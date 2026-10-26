# Безопасность, надёжность и энергопотребление

Цель — понять, что аппаратная платформа гарантирует при изоляции программ, сбоях и изменении режима питания и где необходима поддержка ОС и приложения. Предварительно нужны [микроархитектура](./04_cpu_microarchitecture.md), [память](./07_virtual_memory.md) и [привилегии](./14_boot_and_virtualization.md). Уязвимости, набор mitigations и возможности контроля питания рассматривайте для конкретной модели и конфигурации.

## Лёгкий уровень

1. Какие разные задачи решают конфиденциальность, целостность и доступность данных? На примере памяти процесса объясните, как права доступа помогают каждой задаче и какие проблемы остаются при физическом сбое или утечке через время исполнения.

   **Ответ:** Конфиденциальность ограничивает раскрытие данных, целостность — неразрешённое изменение, доступность — возможность получить сервис. Права страниц не дают постороннему процессу читать/менять память; изоляция сдерживает часть повреждений и сбоев. Но права не исправляют физический bit flip, не гарантируют CPU time и не устраняют timing leakage через общие ресурсы. Для этих задач нужны отдельные механизмы надёжности, планирования и защиты от побочных каналов.

   **Пример:** Read-only mapping защищает от обычной записи CPU, но не является ECC и не делает содержимое нечувствительным к наблюдению времени.

   **Типичная ошибка:** Считать один механизм изоляции гарантией всех трёх свойств.

   **Источник:** [Intel SDM, Vol. 3: Protection / Paging](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html); [Linux Spectre, Problem](https://docs.kernel.org/admin-guide/hw-vuln/spectre.html).

2. Как права страниц, непривилегированный режим и IOMMU участвуют в изоляции? Разделите обращения CPU и DMA устройства; почему проверка прав пользовательского указателя сама по себе не определяет разрешённые адреса устройства?

   **Ответ:** CPU проверяет page permissions вместе с текущим privilege level; непривилегированный процесс не должен менять эти правила. DMA идёт другим путём: устройство выдаёт DMA address, а IOMMU проверяет mappings и права его domain. Проверка user pointer в syscall не создаёт и не ограничивает IOMMU mapping автоматически. Изоляция устройства требует корректного domain/group, минимальных прав и отзыва mapping после завершения DMA.

   **Типичная ошибка:** Передавать проверенный user VA прямо устройству, полагая, что MMU процесса проверит DMA.

   **Источник:** [Intel SDM, Vol. 3: Protection / Paging](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html); [Linux VFIO, IOMMU groups](https://docs.kernel.org/driver-api/vfio.html).

3. Что такое побочный канал (side channel)? Сравните чтение запрещённого адреса с наблюдением времени разрешённой операции; какие общие ресурсы компьютера могут сделать второе наблюдение зависимым от чужой работы?

   **Ответ:** Side channel раскрывает сведения через наблюдаемый эффект выполнения, например время, cache occupancy, предсказатель или потребление энергии. Запрещённое архитектурное чтение пытается получить данные напрямую; timing observation может использовать только разрешённые обращения, но их длительность зависит от действий другой задачи. Общие caches, DRAM/interconnect queues, execution units и predictors создают такие зависимости. Наличие шума затрудняет анализ, но не доказывает отсутствие канала.

   **Пример:** Secret-dependent индекс таблицы способен менять cache behavior даже без записи секрета в выходной буфер.

   **Типичная ошибка:** Считать, что page permissions устраняют все наблюдения за чужой работой.

   **Источник:** [BearSSL, Constant-Time Crypto: Execution Model](https://www.bearssl.org/constanttime.html); [Linux Spectre Side Channels](https://docs.kernel.org/admin-guide/hw-vuln/spectre.html).

4. Чем обнаружение ошибки отличается от её исправления? На примере parity и ECC объясните, какие сведения нужно хранить дополнительно и почему слово «ECC» без описания кода и области защиты не задаёт универсальную гарантию.

   **Ответ:** Обнаружение сообщает, что кодовое слово повреждено; исправление дополнительно определяет допустимое восстановление. Один parity bit выявляет нечётное число flips, но не указывает ошибочный бит и пропускает чётное число. ECC добавляет несколько check bits, вычисляет syndrome и исправляет ошибки в пределах возможностей кода. SECDED обычно исправляет один и обнаруживает два ошибочных бита в кодовом слове; другие коды и схемы имеют другие гарантии. Нужны размер codeword, тип ошибок и область защиты.

   **Пример:** Два flips могут сохранить parity, хотя исходные данные уже неверны.

   **Типичная ошибка:** Читать «ECC» как обещание исправить любое количество ошибок или защитить всю машину.

   **Источник:** [Linux EDAC, Main Concepts и sysfs](https://docs.kernel.org/driver-api/edac.html); [Linux RAS, types of errors and memory error handling](https://cdn.kernel.org/doc/html/latest/admin-guide/RAS/main.html).

5. Чем кратковременная ошибка данных отличается от устойчивой неисправности компонента? Рассмотрите однократный bit flip и повторяющиеся ошибки одного модуля памяти; какие наблюдения нужны, чтобы сформулировать проверяемую гипотезу о причине?

   **Ответ:** Transient/soft error меняет состояние без обязательного устойчивого дефекта; hard fault воспроизводимо связан с компонентом/трактом, а intermittent fault появляется при определённых условиях. Одно событие не доказывает причину. Собирают адреса/syndromes, DIMM/channel, время, температуру, нагрузку и историю повторов. Повторяющийся pattern после контролируемой диагностики усиливает гипотезу дефекта, но причиной также могут быть slot, controller, питание или связь.

   **Типичная ошибка:** Считать любой однократный исправленный flip поломкой DIMM или любую повторную ошибку исключительно ошибкой приложения.

   **Источник:** [Linux RAS, types of errors and memory error handling](https://cdn.kernel.org/doc/html/latest/admin-guide/RAS/main.html), Types of errors; [Linux EDAC, Main Concepts и sysfs](https://docs.kernel.org/driver-api/edac.html), memory controller topology.

6. Чем мощность отличается от энергии? Если две реализации обрабатывают одинаковый объём данных за разное время и с разным потреблением, какие измерения позволят сравнить энергию на задачу и производительность на ватт?

   **Ответ:** Мощность `P` измеряется в ваттах — джоулях в секунду; энергия `E = ∫P(t)dt` — в джоулях. Для одинакового результата измеряют время, энергию в согласованной области системы, requests/s и `E/N` на задачу. Throughput/W эквивалентен tasks/J при тех же границах учёта. Нужно включить выбранный период idle и пояснить, учитывается ли фон: package energy не равно энергии всей машины.

   **Пример:** 50 W в течение 2 s — 100 J; 80 W в течение 1 s — 80 J. Более мощный вариант здесь тратит меньше энергии на задачу.

   **Типичная ошибка:** Сравнивать только средние ватты, игнорируя длительность и выполненный объём.

   **Источник:** [Linux Power Capping / RAPL](https://docs.kernel.org/power/powercap/powercap.html).

7. Зачем CPU меняет частоту, напряжение и состояние простоя? Разделите активное выполнение, ожидание и тепловое ограничение; почему максимальная частота из спецификации не обещает её постоянного достижения под любой нагрузкой?

   **Ответ:** DVFS меняет operating point частоты/напряжения для баланса мощности и скорости, idle states выключают неиспользуемые блоки, а thermal/power limits ограничивают активность при перегреве или превышении бюджета. Более глубокий idle обычно экономит энергию ценой выхода; частотные решения зависят от нагрузки, числа активных ядер, температуры и политики. Spec maximum/turbo — условная возможность, а не постоянная частота всей системы.

   **Типичная ошибка:** Принимать заданную governor частоту за фактически удерживаемую и смешивать P-states с C-states.

   **Источник:** [Linux CPU Performance Scaling](https://docs.kernel.org/admin-guide/pm/cpufreq.html); [Linux CPU Idle Time Management](https://docs.kernel.org/admin-guide/pm/cpuidle.html).

8. Какие различия между SRAM, DRAM и энергонезависимым накопителем важны при потере питания? Проследите путь изменения данных от регистра CPU до файла и объясните, почему видимость записи другому потоку ещё не означает её сохранность после выключения.

   **Ответ:** SRAM и DRAM обычно теряют данные без питания; DRAM дополнительно требует refresh. Nonvolatile storage сохраняет информацию в своей устойчивой среде, но его volatile write cache может потеряться. Путь записи: register/store buffer→CPU cache→DRAM page cache→I/O request→controller cache→media. Когерентная видимость store другому CPU описывает совместное наблюдение при работающей системе; durability требует продвижения до persistence domain и правильного ordering. Для файла используют контракт ОС/FS и flush/FUA устройства, а не один CPU fence.

   **Типичная ошибка:** Считать успешный `write` или atomic release store доказательством сохранности после потери питания.

   **Источник:** [fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html); [NVMe specifications, Flush / volatile write cache](https://nvmexpress.org/specifications/).

## Средний уровень

9. Как transient execution может оставить наблюдаемый след, хотя спекулятивные инструкции не были архитектурно завершены? Разберите на концептуальной схеме роль предсказателя, доступа к кешу и последующего наблюдения; чем такая проблема отличается от обычного нарушения прав страниц?

   **Ответ:** Предсказатель выбирает путь до разрешения условия; CPU может выполнить операции и затронуть cache/buffers. При ошибке пути architectural results отменяются, однако микроархитектурный след способен сохраниться и влиять на последующие наблюдения. На концептуальной схеме `prediction→transient access→cache state→timing observation` архитектурный load результата не возвращает, но изоляции только по архитектурным effects недостаточно. Не каждая ISA/CPU допускает одинаковые transient accesses: важны класс уязвимости и mitigations.

   **Типичная ошибка:** Утверждать, что rollback обязательно откатывает все caches, либо что Spectre и прямое нарушение page permissions — один механизм.

   **Источник:** [Linux Spectre Side Channels, Problem и variants](https://docs.kernel.org/admin-guide/hw-vuln/spectre.html).

10. Что означает constant-time для функции, работающей с секретными данными? Проверьте, могут ли ветвления, адреса обращений и выбранные инструкции зависеть от секрета; почему одинаковое число строк исходника или одна серия измерений не доказывают отсутствие утечки?

    **Ответ:** Constant-time означает отсутствие зависимости наблюдаемого поведения от секретов в выбранной модели утечки. Проверяют branch conditions, memory addresses и инструкции с переменной latency, а также compiler transformations. Публичная длина может определять цикл, секрет — не должен управлять table index или ранним выходом. Нужны проверенная реализация, анализ binary для выбранной ISA и статистические проверки на разных secrets/inputs; равенство одной серии timings не является доказательством. Абсолютно одинаковое wall time при шумах ОС не требуется.

    **Пример:** Обычный `memcmp` может завершаться на первом отличии; для секретов используют специально предназначенное сравнение с проверенным контрактом.

    **Типичная ошибка:** Заменить `if` тернарным оператором и считать задачу решённой без проверки машинного кода.

    **Источник:** [BearSSL, Constant-Time Crypto: Compiler Woes и Generic Tools](https://www.bearssl.org/constanttime.html).

11. Чем защита памяти модулем ECC отличается от внутренней коррекции ошибок в кристалле DRAM и от CRC на линии передачи? Нарисуйте области покрытия для выбранной платформы; какие повреждения между компонентами могут остаться за границами конкретного механизма?

    **Ответ:** Для платформы с DDR5 on-die ECC схема покрытия: `DRAM array [on-die correction] → чиповые pins/линия [CRC, если включён] → memory controller [system ECC over codeword] → CPU`. On-die ECC исправляет часть внутренних ошибок до выдачи данных и не заменяет защиту тракта за пределами кристалла. Module/system ECC использует дополнительные check bits и контроллер; CRC обнаруживает повреждение передачи, но сама по себе не восстанавливает исходные данные. Конкретное покрытие зависит от direction, codeword и режимов платформы.

    **Типичная ошибка:** Называть любую DDR5-память полноценной end-to-end ECC только из-за on-die ECC.

    **Источник:** [Micron DDR5 SDRAM: New Features, RAS](https://assets.micron.com/adobe/assets/urn%3Aaaid%3Aaem%3A5ea148c8-e3fe-489e-8489-99b1b9cdcd3c/original/as/ddr5-new-features-white-paper.pdf); [Linux EDAC, Main Concepts и sysfs](https://docs.kernel.org/driver-api/edac.html).

12. Как ОС получает сведения об исправленных и неисправимых аппаратных ошибках? Выберите Linux EDAC/RAS и доступные диагностические сообщения; какие поля помогут связать события с каналом или модулем и почему отсутствие сообщения ещё не подтверждает исправность всех компонентов?

    **Ответ:** Memory controller/CPU/firmware сообщают события через поддерживаемые механизмы, а Linux EDAC, machine-check и APEI/GHES обрабатывают и публикуют сведения. Сопоставляют CE/UE, timestamp, channel/rank/DIMM label, physical address при наличии, syndrome и исходный hardware status. В Linux читают kernel log, доступные EDAC sysfs counters и RAS trace events; `rasdaemon` может сохранять историю. Не все ошибки видимы системе, например исправление внутри DRAM может не выдавать отдельное событие.

    **Типичная ошибка:** Считать пустой `dmesg` доказательством отсутствия ошибок либо суммировать одни события из нескольких каналов отчётности дважды.

    **Источник:** [Linux EDAC, Main Concepts и sysfs](https://docs.kernel.org/driver-api/edac.html); [Linux ACPI APEI output format](https://docs.kernel.org/firmware-guide/acpi/apei/output_format.html).

13. Как рабочая частота и idle states влияют на задержку первого запроса после простоя? Спроектируйте измерение короткой операции после разных интервалов ожидания; какие данные о режиме питания и планировании нужны для объяснения результатов?

    **Ответ:** После idle CPU может выходить из глубокого C-state и менять operating point; это добавляет задержку первому запросу. Измерять одну и ту же проверенную операцию после интервалов idle, например 10 μs, 1 ms и 100 ms, сохраняя отдельные распределения. Записывать wakeup source, affinity, scheduler delay, CPU frequency/idle tracepoints, состояние caches и конкурирующую нагрузку. Контроль с меньшей разрешённой exit latency на изолированном тестовом стенде помогает проверить гипотезу; busy wait меняет и энергию, и cache warmth.

    **Типичная ошибка:** Приписать всю разницу частоте, не отделив descheduling и cache misses.

    **Источник:** [Linux CPU Idle Time Management](https://docs.kernel.org/admin-guide/pm/cpuidle.html), latency constraints; [Linux power tracepoints](https://docs.kernel.org/trace/events-power.html).

14. Почему длительный benchmark может показать меньшую скорость, чем короткий? Разберите прогрев, power limits, охлаждение и изменение частоты; какие наблюдения позволят отделить thermal throttling от перехода рабочего набора за границы кеша?

    **Ответ:** Короткий запуск может попасть в turbo при холодном чипе и незаполненном среднем power budget; длительный — достичь устойчивых thermal/power limits. Снять временные ряды throughput, effective frequency, температуры, package power/energy и limit/throttle status. Повторить с постоянным рабочим набором, уже выделенными страницами и прогретым кодом; отдельно менять размер данных. Падение скорости при той же структуре accesses вместе с limit events поддерживает thermal/power hypothesis; перелом только по размеру и cache events — memory hypothesis.

    **Типичная ошибка:** Сравнить первые 10 ms с последними 10 s при разных рабочих наборах и объявить причину доказанной.

    **Источник:** [Linux CPU Performance Scaling](https://docs.kernel.org/admin-guide/pm/cpufreq.html); [Linux Power Capping / RAPL](https://docs.kernel.org/power/powercap/powercap.html).

15. Чем запись в кеш CPU, завершение записи в память и достижение persistence domain отличаются по смыслу? Для выбранной технологии постоянной памяти выясните роль writeback, ordering и защиты от потери питания; почему инструкции для одной платформы нельзя переносить на обычный файл или SSD как готовый рецепт?

    **Ответ:** Store в CPU cache может быть виден через coherence, но ещё не сохранён при отключении питания. Достижение DRAM также не даёт durability для volatile RAM. Для byte-addressable persistent memory persistence domain задаётся платформой: на x86 pmem-системе с ADR обычно защищены write-pending queues контроллера памяти и pmem-носитель, а CPU caches находятся вне этой области; eADR может включать и их. На поддерживаемой платформе применяют cache-line writeback (`CLWB` или допустимую альтернативу) и `SFENCE` по документированному протоколу; fence сам по себе не делает обычную DRAM постоянной. Для файлов/SSD нужен storage API и его flush semantics.

    **Типичная ошибка:** Использовать `CLWB + SFENCE` на page-cache mapping как универсальную замену `fsync`.

    **Источник:** [Intel SDM, CLWB / CLFLUSHOPT / SFENCE](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html); [PMDK libpmem, pmem_persist и ограничения](https://pmem.io/pmdk/manpages/linux/v1/libpmem.3/); [fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html).

16. Почему SSD может иметь разные задержки чтения и записи при одинаковом размере запроса? Свяжите страницы NAND, стирание блоками, контроллер и garbage collection; какие дополнительные сведения о write cache и защите питания нужны для обсуждения сохранности данных?

    **Ответ:** NAND читает/программирует страницы и стирает более крупные блоки; перезапись LBA обычно обслуживается через FTL и запись в другое физическое место. Write amplification, garbage collection, wear leveling, очереди и SLC cache меняют latency и tails. Read и write одного размера поэтому могут иметь разные paths; заполненность, история нагрузки и firmware важны. Для durability узнать volatile write cache, Flush/FUA semantics и power-loss protection; command completion без нужной политики не всегда означает устойчивый media write.

    **Пример:** Сравнивать random reads и sustained writes после явно описанного preconditioning, а не только запись в пустой SLC cache.

    **Типичная ошибка:** Обобщать первые секунды burst benchmark на длительную запись и сохранность при power loss.

    **Источник:** [NVMe specifications, NVM Command Set / Flush / FUA](https://nvmexpress.org/specifications/); [Microchip, NAND Flash Organization](https://onlinedocs.microchip.com/oxy/GUID-87101AE8-6003-4D1F-B624-895C158CCD3E-en-US-1/GUID-F3BE160C-4AEC-4F0A-92A7-39025FDDEE0B.html).

## Сложный уровень

17. Как составить модель угроз для обработки секретов на машине с несколькими арендаторами? Укажите противника, доступные ему наблюдения и общие ресурсы; какие ограничения дают процессная изоляция, отдельная VM, раздельное размещение на ядрах и аппаратные механизмы защиты?

    **Ответ:** Указать секрет, доверенные компоненты, противника и его возможности: соседний процесс/VM, control над входами, co-residency, timing/PMU/network observations. Перечислить общие SMT units, caches, memory controllers и physical access. Process permissions и VM ограничивают прямой доступ, но не автоматически side channels. Раздельные физические cores убирают часть SMT sharing, однако LLC/DRAM могут остаться общими. Выбор constant-time crypto, обновлений, core scheduling, placement и hardware isolation привязывают к конкретной угрозе и документированным границам защиты.

    **Типичная ошибка:** Обещать отсутствие side channels только из-за отдельной VM или шифрования DRAM.

    **Источник:** [Linux Core Scheduling, threat model](https://docs.kernel.org/admin-guide/hw-vuln/core-scheduling.html); [Linux Spectre, Guest/host mitigations](https://docs.kernel.org/admin-guide/hw-vuln/spectre.html).

18. Как проверять состояние mitigations аппаратной уязвимости на конкретной Linux-системе? Сопоставьте модель CPU, microcode, ядро и отчёт ОС; как измерить влияние на свою нагрузку, сохраняя требуемую защиту, и почему результат нельзя обобщить на все реализации ISA?

    **Ответ:** Зафиксировать CPU model/stepping/features, microcode revision, kernel/build/config, boot command line и guest/host context. Читать `/sys/devices/system/cpu/vulnerabilities/` и соответствующее описание Linux: значения описывают известное ядру состояние и условия, включая SMT/virtualization. Сравнивать поддерживаемые защищённые конфигурации на одинаковой нагрузке и измерять CPU, throughput и latency; отключение защиты не требуется для оценки вариантов внутри допустимой политики. После обновления повторить проверку, так как detection и рекомендации меняются.

    **Типичная ошибка:** Переносить статус одного CPU на всю ISA либо считать название mitigation гарантией устранения любых побочных каналов.

    **Источник:** [Linux Hardware vulnerabilities](https://docs.kernel.org/admin-guide/hw-vuln/index.html); [Linux Spectre, system information](https://docs.kernel.org/admin-guide/hw-vuln/spectre.html).

19. Чем Rowhammer отличается от случайного bit flip и ошибки программы? Объясните механизм disturbance на уровне DRAM без разработки атаки; какие свойства памяти, refresh и средств коррекции нужно знать, чтобы оценивать границы защиты?

    **Ответ:** Rowhammer — disturbance: интенсивные активации DRAM rows при некоторых условиях изменяют заряд соседних ячеек без нормальной записи в них. Это отличается от случайного независимого upset и от выхода программы за границы: логически разрешённая активность может вызвать физическое повреждение другой строки. Оценка требует модели DRAM, refresh/temperature, mapping, ECC codeword и документированных mitigations. ECC/повышенный refresh уменьшают отдельные риски, но не дают универсальной гарантии против любого pattern; перенос старых экспериментальных порогов на новую память некорректен.

    **Типичная ошибка:** Считать, что page permissions или наличие любого ECC полностью закрывают физический disturbance.

    **Источник:** [Kim et al., ISCA 2014: Flipping Bits in Memory Without Accessing Them](https://users.ece.cmu.edu/~yoonguk/papers/kim-isca14.pdf).

20. Сервис продолжает работать, но исправленные ошибки памяти накапливаются. Как собрать временной ряд, локализовать компонент и спланировать дальнейшие действия; почему успешная коррекция каждого наблюдаемого события не является достаточным доказательством долговременной надёжности?

    **Ответ:** Сохранять исходные RAS events и строить частоту CE по времени, объёму работы и DIMM/channel/address, учитывая перезапуск counters, scrub и дубли отчётов. Сопоставить температуру, нагрузку и изменения firmware, проверить labels/topology. Рост или устойчивое повторение — повод действовать по регламенту платформы: диагностировать, мигрировать нагрузку, применить page offlining либо заменить подтверждённый компонент в maintenance window. Исправление каждого наблюдаемого события не предсказывает будущий burst за пределами кода.

    **Типичная ошибка:** Игнорировать растущий CE rate, пока система ещё отвечает, либо менять DIMM по одному неточному label.

    **Источник:** [Linux RAS, types of errors and memory error handling](https://cdn.kernel.org/doc/html/latest/admin-guide/RAS/main.html), Improving RAS; [Linux EDAC, Main Concepts и sysfs](https://docs.kernel.org/driver-api/edac.html).

21. Как спроектировать обновление структуры в постоянной памяти с восстановлением после внезапного выключения? Определите допустимые промежуточные состояния, порядок записи данных и признака завершения, затем разберите точки отказа; какие гарантии атомарности и persistence domain нужно получить из документации?

    **Ответ:** Для crash-consistent copy-on-write record хранить старую версию, новую копию и отдельный атомарно обновляемый commit descriptor с generation/offset. Сначала записать новую копию и checksum, persist её полностью; затем записать descriptor и persist его. До начала обновления descriptor recovery выбирает старую версию. Во время его записи/persist допустима целая старая или новая версия: store может стать persistent ещё до возврата persist. После успешного завершения persist descriptor выбирается новая версия; незавершённую копию игнорируют. Старые данные освобождать лишь после устойчивого commit и ухода readers. Контракт должен гарантировать подходящий размер/выравнивание failure-atomic descriptor, порядок persistence, отсутствие torn commit и модель power loss; CPU atomicity сама по себе недостаточна.

    **Пример:** Проверить crash points до/после каждого persist и обновления commit, в том числе torn data writes; recovery обязан дать целую старую или новую запись. Для обычного файла нужен отдельный FS transaction protocol.

    **Типичная ошибка:** Обновить in-place несколько полей и поставить один fence, не определив допустимый recovery state.

    **Источник:** [PMDK, libpmemobj transactions](https://github.com/pmem/pmdk/blob/master/doc/libpmemobj/pmemobj_tx_begin.3.md); [PMDK libpmem, persistence не является транзакцией](https://pmem.io/pmdk/manpages/linux/v1/libpmem.3/); [Intel SDM, memory ordering / cache writeback](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

22. Вспомогательное PCIe-устройство работает с чувствительным буфером. Как проверить границы DMA-изоляции, права mappings и порядок отзыва доступа; почему шифрование данных в DRAM и включённая IOMMU решают разные части задачи?

    **Ответ:** Проверить IOMMU domain/group, peer-to-peer/ACS ограничения и отсутствие лишних mappings; выдать устройству только нужные страницы с нужным направлением доступа. Установить ownership и не менять/освобождать буфер во время DMA. Для отзыва прекратить submissions, завершить/quiesce/reset DMA, синхронизировать обработчики, удалить mappings с требуемой invalidation и только затем unpin/free. DRAM encryption защищает определённые physical-access угрозы, но разрешённый DMA path может получать расшифрованные данные; IOMMU ограничивает адреса, а не шифрует содержимое.

    **Типичная ошибка:** Считать включённую IOMMU достаточной без проверки domain и lifetime либо полагаться на memory encryption для запрета разрешённого DMA.

    **Источник:** [Linux VFIO, Groups/Devices/IOMMUs](https://docs.kernel.org/driver-api/vfio.html); [Linux DMA API HOWTO](https://docs.kernel.org/core-api/dma-api-howto.html).

23. Сравните два режима обработки: немедленную работу на высокой частоте с последующим простоем и более медленную непрерывную работу. При заданном потоке запросов как измерить энергию на запрос и p99, учесть время выхода из простоя и обосновать выбор без универсального правила «меньше частота — меньше энергия»?

    **Ответ:** Подать одинаковый поток с заданными arrival times и числом запросов; сравнить race-to-idle и медленное исполнение при том же SLA. Измерять energy на весь период, `J/completed request`, queueing/service latency и p99, busy/idle residency, effective frequency и wakeup delay. Включить низкую и высокую нагрузку: экономия deep idle может исчезнуть при частых пробуждениях, а снижение частоты — увеличить очередь и длительность активного состояния. Выбрать режим по измеренным energy и SLA с учётом области датчика и фонового потребления.

    **Типичная ошибка:** Сравнивать режимы при разном числе выполненных запросов либо исключить idle energy только у одного варианта.

    **Источник:** [Linux CPU Idle Time Management](https://docs.kernel.org/admin-guide/pm/cpuidle.html); [Linux Power Capping / RAPL](https://docs.kernel.org/power/powercap/powercap.html); [Linux CPU Performance Scaling](https://docs.kernel.org/admin-guide/pm/cpufreq.html).

24. После оптимизации SIMD вырос throughput, но ухудшились задержки соседнего сервиса и энергия на запрос. Как исследовать общие power/thermal limits, частоты и конкуренцию за ресурсы; какие измерения на разных длительностях и размещениях потоков позволят проверить причину?

    **Ответ:** Проверить одинаковый результат, объём работы и arrival rate, затем измерять отдельно и совместно SIMD-задачу и соседний сервис. Собирать effective frequencies по ядрам, package power/thermal limits, energy, bandwidth/cache contention, scheduler и p99. Менять длительность runs и placement: SMT sibling, отдельное ядро того же socket, другой power domain при наличии. Сравнить narrower SIMD/scalar с одинаковой семантикой и контроль при ограниченном throughput. Причиной могут быть shared bandwidth, heating, power budget и на некоторых CPU особенности частоты при wide vectors; вывод подтверждают telemetry и контрольные варианты, а не одно имя ISA.

    **Типичная ошибка:** Считать рост локальных FLOP/s гарантией лучшей энергии на request и лучшего поведения всей системы.

    **Источник:** [Linux CPU Performance Scaling](https://docs.kernel.org/admin-guide/pm/cpufreq.html); [Linux Power Capping / RAPL](https://docs.kernel.org/power/powercap/powercap.html); [Intel Optimization Reference Manual, SIMD and power considerations](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

## Критерий освоения

Вы умеете назвать границы каждой гарантии: права доступа, когерентность, исправление ошибок и сохранность после потери питания рассматриваются отдельно. Решение об изоляции или режиме питания опирается на модель угроз, документацию платформы и воспроизводимые измерения.

Для проверки платформенных деталей: [аппаратные уязвимости Linux](https://docs.kernel.org/admin-guide/hw-vuln/index.html), [EDAC](https://docs.kernel.org/driver-api/edac.html), [CPUFreq](https://docs.kernel.org/admin-guide/pm/cpufreq.html) и [CPUIdle](https://docs.kernel.org/admin-guide/pm/cpuidle.html).

[<- Prev](./14_boot_and_virtualization.md) · [Оглавление](./README.md) · [Next ->](./16_performance_experiments.md)
