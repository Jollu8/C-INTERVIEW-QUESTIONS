# Загрузка, привилегии и виртуализация

Цель — понять, как система начинает выполнять ОС, какие границы защищает процессор и как поверх них работает виртуальная машина. Предварительно нужны [виртуальная память](./07_virtual_memory.md), [DMA и IOMMU](./12_dma_iommu_and_interrupts.md) и [системный интерфейс](./13_abi_and_system_interface.md). Детали reset, firmware и режимов исполнения проверяйте для выбранной ISA и платформы.

## Лёгкий уровень

1. Что происходит между подачей питания и первой инструкцией ОС? Разделите задачи аппаратного reset, firmware, загрузчика и ядра; какие условия должен подготовить предыдущий этап, чтобы следующий мог исполнять код?

   **Ответ:** После стабилизации питания/тактов reset переводит CPU в определённое ISA начальное состояние и выбирает стартовый адрес. Firmware начинает с доступного boot storage, настраивает платформу и DRAM, обнаруживает устройства и выбирает загрузочный образ. Загрузчик размещает ядро и параметры в памяти и передаёт управление согласно boot protocol. Ядро создаёт собственные таблицы страниц, обработчики, allocator, scheduler и драйверы. Передача требует согласованных адреса входа, режима CPU, доступной памяти и формата параметров.

   **Пример:** На x86 reset vector не равен `main` ядра; ранний код может работать до доступности обычного стека в DRAM.

   **Типичная ошибка:** Считать, что firmware инициализирует все механизмы ровно так, как они нужны ОС.

   **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Processor Management and Initialization; [Linux/x86 Boot Protocol](https://docs.kernel.org/arch/x86/boot.html).

2. Зачем компьютерному устройству firmware и чем оно отличается от ОС и драйвера? Сравните прошивку системной платы и прошивку контроллера устройства; где находится исполняющий их процессор и когда выполняется соответствующий код?

   **Ответ:** Firmware — программное обеспечение, близкое к платформе/устройству и обеспечивающее его начальную или текущую работу. Системная прошивка выполняется главным CPU при запуске, предоставляя boot services и часть runtime services. Прошивка SSD/NIC обычно выполняется встроенным контроллером устройства и продолжает работу после загрузки ОС. Драйвер выполняется на host CPU и общается с устройством по его протоколу; он может загрузить firmware image в устройство. Расположение в ROM/flash само по себе не определяет роль кода.

   **Типичная ошибка:** Называть файл firmware драйвером и предполагать, что его инструкции исполняет основной CPU.

   **Источник:** [Linux request_firmware API](https://docs.kernel.org/driver-api/firmware/request_firmware.html); [UEFI 2.10, Overview](https://uefi.org/specs/UEFI/2.10/02_Overview.html).

3. Какие задачи решает загрузчик ОС? Объясните, откуда он получает образ ядра, сведения о памяти и параметры запуска; почему загрузка байтов в RAM ещё не означает готовность ядра работать?

   **Ответ:** Загрузчик получает ядро с диска, сети или иного boot source; размещает его и initramfs в подходящей памяти, передаёт командную строку, memory map и ссылки на firmware tables. Он соблюдает требуемые alignment, entry address, режим и состояние регистров/прерываний. Ядро может требовать распаковку или relocation. Простого копирования файла недостаточно: неверный режим CPU, пересечение областей памяти или отсутствующие boot parameters делают вход некорректным.

   **Пример:** Для Linux/x86 `boot_params`, адрес initrd и command line задаёт boot protocol; для EFI stub часть действий выполняет само ядро как EFI image.

   **Типичная ошибка:** Переносить условия входа 32-битного Linux boot protocol на 64-битный entry point.

   **Источник:** [Linux/x86 Boot Protocol](https://docs.kernel.org/arch/x86/boot.html).

4. Что даёт разделение user mode и kernel mode? Приведите примеры операций, которые приложение может выполнять напрямую, и операций, требующих привилегий; какой механизм предотвращает произвольную смену режима самим приложением?

   **Ответ:** User mode ограничивает доступ к привилегированному состоянию и памяти ядра. Приложение напрямую считает, ветвится и обращается к разрешённым страницам; изменение таблиц трансляции, управление прерываниями и многими устройствами требует ядра. CPU проверяет privilege level и page permissions при выполнении. Разрешённые входы — syscall, gates и exceptions — ведут к заранее заданному коду; произвольная запись в регистр режима не предоставляет повышение прав.

   **Пример:** На x86 user code не может обычным `MOV` записать `CR3`; попытка привилегированной инструкции вызывает exception.

   **Типичная ошибка:** Считать вызов библиотеки достаточным механизмом повышения привилегий.

   **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Protection и System-Call Instructions.

5. Чем interrupt, exception и запрошенный программой переход в ядро различаются по источнику и назначению? Проследите прерывание таймера и ошибку доступа к странице; какие сведения процессору и ОС нужны для продолжения или завершения исполнения?

   **Ответ:** Interrupt обычно приходит асинхронно от таймера/устройства; exception связан с исполнением инструкции или процессорным условием; syscall — явно запрошенный вход в сервис ядра. Таймер сохраняет точку продолжения и вызывает обработку времени/планирования. Page fault даёт faulting address, error code и context; ядро может создать отображение и повторить инструкцию либо послать сигнал. Для продолжения нужны адрес/режим, состояние регистров и корректно обработанная причина; fault, trap и abort имеют разные правила восстановления.

   **Типичная ошибка:** Считать любой page fault ошибкой программы или ожидать, что после всех exceptions следует следующая инструкция.

   **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Interrupt and Exception Handling.

6. Зачем ОС нужна информация о доступной памяти, CPU и устройствах? Сравните роли аппаратного обнаружения и таблиц описания платформы, например ACPI или Device Tree; что в этом процессе зависит от семейства машин?

   **Ответ:** ОС должна знать, какие физические диапазоны свободны/зарезервированы, где CPU и interrupt controllers, как адресуются устройства и как ими управлять. PCI configuration space позволяет перечислить PCI-устройства, но не описывает всю платформу. ACPI даёт таблицы и методы управления, Device Tree — описание узлов, регистров, связей и interrupts. Выбор зависит от архитектуры и firmware: x86 обычно использует ACPI, многие embedded Arm/RISC-V — DT; существуют исключения. CPU features дополнительно читаются архитектурными средствами.

   **Пример:** RAM, занятая firmware runtime region, не должна автоматически попасть в allocator ядра.

   **Типичная ошибка:** Считать, что сканирование PCI обнаружит всю память и все устройства SoC.

   **Источник:** [Linux ACPI Support](https://docs.kernel.org/firmware-guide/acpi/index.html); [Linux Device Tree usage model](https://docs.kernel.org/devicetree/usage-model.html).

7. Чем виртуальная машина отличается от процесса и контейнера? Сравните, кто предоставляет ISA, ядро ОС и изоляцию адресного пространства; какие компоненты могут совместно использоваться несколькими гостями?

   **Ответ:** Процесс получает виртуальное адресное пространство и сервисы ядра host OS. Контейнер группирует процессы с namespaces/cgroups и обычно разделяет то же ядро. VM предоставляет виртуальную машину с vCPU/виртуальной ISA, памятью и устройствами, на которой работает собственное guest kernel. При hardware virtualization большая часть guest instructions исполняется CPU, при emulation ISA может быть другой. Разные VM могут разделять host cores, caches, DRAM, storage и hypervisor; отдельное ядро гостя не означает физически раздельные ресурсы.

   **Типичная ошибка:** Приравнивать контейнер к VM с отдельным ядром или VM — к полному отсутствию общих ресурсов.

   **Источник:** [Linux KVM API](https://docs.kernel.org/virt/kvm/api.html), General description; [Linux namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html).

8. Что такое hypervisor и vCPU? Объясните, как гостевая ОС видит процессор и память, хотя физические ресурсы разделяются с другими задачами; почему число vCPU не задаёт число одновременно работающих физических ядер?

   **Ответ:** Hypervisor создаёт виртуальный аппаратный контекст, отображает память гостя и контролирует привилегированные события/доступ к ресурсам. vCPU — сохраняемое состояние виртуального процессора и единица его исполнения. В KVM userspace VMM создаёт VM/vCPU через ioctls, а host scheduler планирует исполняющие их потоки. Восемь vCPU можно разместить на четырёх физических ядрах, но одновременно полную независимую вычислительную мощность восьми ядер это не даёт. SMT и oversubscription дополнительно меняют доступные ресурсы.

   **Типичная ошибка:** Читать число vCPU как число выделенных физических ядер.

   **Источник:** [Linux KVM API](https://docs.kernel.org/virt/kvm/api.html), KVM_CREATE_VM, KVM_CREATE_VCPU, KVM_RUN.

## Средний уровень

9. Проследите упрощённую загрузку Linux через UEFI, загрузчик и initramfs. Кто загружает образ, передаёт карту памяти, завершает использование boot services и подготавливает корневую файловую систему; какие шаги зависят от выбранной схемы загрузки?

   **Ответ:** UEFI boot manager запускает EFI loader либо непосредственно EFI stub ядра. Loader/stub получает kernel/initramfs и command line, сохраняет актуальную memory map, вызывает `ExitBootServices` с её ключом и передаёт управление по согласованному протоколу; после успешного выхода boot services недоступны. Ядро распаковывает initramfs в начальную rootfs и запускает `/init`; ранний userspace загружает нужные драйверы, монтирует настоящий root и делает `switch_root`. Unified kernel image может объединять ядро, initrd и параметры; отдельный внешний загрузчик необязателен.

   **Типичная ошибка:** Продолжать использовать UEFI boot allocator после `ExitBootServices` или путать initramfs с обязательным отдельным RAM block device initrd.

   **Источник:** [UEFI 2.10, Boot Services §7.4.6](https://uefi.org/specs/UEFI/2.10/07_Services_Boot_Services.html); [Linux ramfs/rootfs/initramfs](https://docs.kernel.org/filesystems/ramfs-rootfs-initramfs.html); [Linux/x86 Boot Protocol](https://docs.kernel.org/arch/x86/boot.html).

10. Как Secure Boot связывает проверку подписи с цепочкой доверия при запуске? Определите, какие компоненты проверяются в выбранной конфигурации, где находятся доверенные ключи и чем проверка загружаемого кода отличается от измерения его хеша в measured boot.

    **Ответ:** Secure Boot проверяет допустимость загружаемых EFI images по доверенным/отозванным подписям или hashes. В UEFI authenticated variables находятся PK, KEK, разрешающая `db` и запрещающая `dbx`; PK/KEK управляют обновлениями политики. Далее каждый проверенный этап должен проверять следующий: например firmware→shim→loader→подписанное ядро, затем политика ядра для modules. Какая именно цепочка проверяется, зависит от конфигурации, включая initramfs/command line. Measured boot записывает измерения в TPM PCR/event log для attestation и сам по себе не запрещает запуск.

    **Типичная ошибка:** Считать, что включение Secure Boot автоматически проверяет каждый байт любого initramfs или шифрует диск.

    **Источник:** [UEFI 2.10, §32 Secure Boot and Driver Signing](https://uefi.org/specs/UEFI/2.10/32_Secure_Boot_and_Driver_Signing.html); [TCG PC Client Platform Firmware Profile](https://trustedcomputinggroup.org/resource/pc-client-specific-platform-firmware-profile-specification/).

11. Почему ранняя загрузка использует иной набор возможностей, чем уже работающая ОС? На примере инициализации памяти, таблиц страниц и обработчиков исключений объясните, какие зависимости нужно установить до включения следующих механизмов.

    **Ответ:** До настройки DRAM нужны доступные boot memory и минимальное временное состояние. До включения paging нужны корректные page tables и отображения текущего кода, стека и данных; до разрешения interrupts — handlers, таблицы входов и подходящие стеки. Нельзя вызвать allocator, scheduler или console driver до их инициализации. Код последовательно создаёт зависимости, затем заменяет ранние временные mappings/allocators полноценными механизмами.

    **Пример:** Если после записи `CR3` и включения paging адрес следующей инструкции не отображён, возникнет page fault; при неготовом обработчике возможны double/triple fault и reset.

    **Типичная ошибка:** Применять обычные runtime функции в ранней загрузке без проверки их зависимостей.

    **Источник:** [Linux/x86 Boot Protocol](https://docs.kernel.org/arch/x86/boot.html), 64-bit Boot Protocol; [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Paging и Processor Management.

12. Как ОС запускает дополнительные ядра и подготавливает для них локальное состояние? Разберите, какие таблицы и структуры могут быть общими, а какие нужны каждому CPU; почему один факт подачи стартового сигнала ещё не делает ядро готовым к планированию потоков?

    **Ответ:** Bootstrap processor обнаруживает дополнительные CPU и запускает их по платформенному протоколу: на традиционном x86 используются APIC INIT/SIPI и trampoline. Общими могут быть kernel code и часть page tables; каждому CPU нужны свой kernel stack, per-CPU data, TSS/локальные таблицы при выбранной организации, interrupt controller/timer и scheduler state. AP проходит rendezvous, объявляет readiness/online и только затем получает задачи. Boot signal лишь начинает исполнение стартового кода.

    **Типичная ошибка:** Считать AP готовым сразу после SIPI и разделять один стек между одновременно стартующими CPU.

    **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Multiple-Processor Management; [Linux CPU hotplug, Startup callbacks](https://docs.kernel.org/core-api/cpu_hotplug.html).

13. Что сохраняется при входе в обработчик исключения аппаратно, а что должен сохранить код ОС на выбранной ISA? Проследите смену стека и возврат, затем объясните, как предотвращается потеря контекста при вложенном событии.

    **Ответ:** Для x86-64 IDT interrupt/exception entry CPU сохраняет `SS`, `RSP`, `RFLAGS`, `CS`, `RIP`; в 64-битном режиме `SS:RSP` сохраняется и без смены CPL. Некоторые vectors добавляют error code. При входе с другого CPL новый stack выбирается из TSS, IST может задать отдельный stack независимо от смены CPL. General-purpose registers сохраняет entry code ОС до их изменения и разрешения допустимого вложения; дополнительные состояния сохраняются по принятой политике. Нужны достаточный резерв стека, отдельные IST для выбранных критических событий и протокол, исключающий повторное использование занятой вершины IST при вложенном входе. Маска обычных IRQ не блокирует NMI и faults. Возврат обычно выполняется через `IRETQ`. Вход `SYSCALL` имеет отдельную семантику и не создаёт такой же IDT-frame автоматически.

    **Типичная ошибка:** Предполагать, что аппаратно сохранены все регистры либо что вложенное NMI всегда использует безопасное свободное место.

    **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), 64-Bit Mode Stack Usage / IST; [Linux x86 Kernel Entries](https://docs.kernel.org/arch/x86/entry_64.html).

14. Как аппаратная виртуализация позволяет запускать привилегированный код гостя под контролем hypervisor? На примере VM entry и VM exit в выбранной архитектуре разделите инструкции, исполняемые непосредственно, и события, для которых управление передаётся хосту.

    **Ответ:** В Intel VMX hypervisor готовит VMCS с guest/host state и controls. VM entry запускает guest в VMX non-root; обычные вычисления, обращения к памяти при разрешённых mappings и часть привилегированных операций исполняются непосредственно. Настроенные события — например selected I/O, intercepted control-register operations или EPT violation — вызывают VM exit: CPU сохраняет определённое guest state, загружает host state и сообщает причину. Hypervisor обрабатывает событие и возобновляет гостя. VMX root/non-root — дополнительное измерение, guest kernel может оставаться CPL0.

    **Типичная ошибка:** Считать, что любая guest instruction проходит через программный интерпретатор или что любой VM exit выходит в userspace QEMU.

    **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), VMX Non-Root Operation / VM Entries / VM Exits; [Linux KVM API](https://docs.kernel.org/virt/kvm/api.html), KVM_RUN.

15. Как guest virtual address превращается в host physical address при двухступенчатой трансляции? Нарисуйте роль гостевых таблиц и EPT/NPT либо stage-2 translation; чем guest page fault отличается от нарушения на втором этапе?

    **Ответ:** Схема: `GVA —guest page tables→ GPA —EPT/NPT→ HPA`. Page-table pages гостя сами лежат по GPA, поэтому чтения при walk тоже требуют второго этапа. Guest page fault относится к guest mappings/permissions и обычно обрабатывается guest OS. EPT violation означает отсутствие/запрет mapping GPA→HPA и обрабатывается hypervisor, например для lazy allocation, dirty tracking или MMIO emulation. Итоговая проверка учитывает права обоих этапов.

    **Пример:** GVA отображён гостем в GPA `0x4000`, но hypervisor не разрешил доступ к соответствующему HPA: исправление guest PTE само по себе недостаточно.

    **Типичная ошибка:** Принимать GPA за адрес физической DRAM хоста.

    **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), EPT / Guest-Physical Translation; [KVM x86 MMU](https://docs.kernel.org/virt/kvm/x86/mmu.html).

16. Сравните эмуляцию устройства, паравиртуальное устройство и passthrough. Кто обрабатывает запросы и прерывания, как гость получает доступ к данным и какие обязанности по изоляции и времени жизни памяти остаются у hypervisor и IOMMU?

    **Ответ:** Эмуляция воспроизводит register/device model: hypervisor/VMM обслуживает обращения гостевого драйвера. Paravirtual device, например virtio, использует согласованные shared queues и notifications, уменьшая число перехватов. Passthrough передаёт физическую функцию гостю, который управляет её DMA/очередями; доступ ограничивают IOMMU и interrupt remapping. Во всех вариантах остаются правила ownership, pinning/mapping, завершения I/O и reset. IRQ может быть эмулированным, ускоренно инжектируемым или привязанным к физическому устройству; детали зависят от реализации.

    **Типичная ошибка:** Считать passthrough отсутствием hypervisor и основанием освобождать память до остановки DMA.

    **Источник:** [Linux VFIO, Groups/Devices/IOMMUs](https://docs.kernel.org/driver-api/vfio.html); [virtio specification, Basic Facilities](https://docs.oasis-open.org/virtio/virtio/v1.3/virtio-v1.3.html).

## Сложный уровень

17. Составьте схему запуска минимальной ОС на выбранной архитектуре: от начального состояния CPU до первого пользовательского процесса. Какие состояния регистров, память, обработчики и правила привилегий нужно подготовить; какие из них определяет ISA, а какие — формат загрузки?

    **Ответ:** Пример для минимальной x86-64 ОС: reset→firmware→выбранный loader protocol→entry stub→kernel initialization→user process. На handoff зафиксировать режим CPU, memory map, entry и параметры; создать stack, GDT/TSS, IDT, per-CPU state и page tables, установить control registers и права. Подготовить allocator, обработчики faults/IRQ и syscall, затем scheduler и загрузчик user image. Для первого процесса создать user mappings/stack и return frame с user selectors/flags; перейти в ring 3 через корректный механизм. ISA определяет допустимые регистры/переходы, boot protocol — исходное состояние и размещение образа, ОС — layout и policy.

    **Пример:** Для 64-bit Linux handoff нельзя предполагать reset state: loader уже выполнил часть переходов. Для собственной ОС контракт loader нужно описать отдельно.

    **Типичная ошибка:** Включать interrupts до установки IDT и per-CPU stack.

    **Источник:** [Linux/x86 Boot Protocol](https://docs.kernel.org/arch/x86/boot.html); [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Protection / Paging / Interrupt Handling.

18. Гость активно обращается к MMIO-регистрам эмулируемого устройства, и число VM exits велико. Как проверить причину потери производительности и сравнить batching, shared-memory queues и паравиртуальный интерфейс; какие изменения потребуются в протоколе уведомлений?

    **Ответ:** Сопоставить причины/число exits с числом MMIO requests, host CPU profile и latency. Сравнить одинаковые операции: отдельные MMIO doorbells, пакет descriptors с одним doorbell и shared-memory virtqueue. В протокол добавить producer/consumer indices, release/acquire или device-specific barriers, правила уведомления и повторную проверку очереди перед сном, чтобы исключить lost wakeup. Оптимизация уведомлений не должна менять completion/error semantics.

    **Пример:** `perf kvm stat` и KVM tracepoints показывают exits; уменьшение их числа подтвердить снижением host CPU на request и сохранением p99 при малой нагрузке. KVM может обслуживать exit в ядре, поэтому отдельно считать userspace exits.

    **Типичная ошибка:** Убирать уведомления без handshake, оставляя очередь заполненной при спящем потребителе.

    **Источник:** [perf-kvm(1)](https://man7.org/linux/man-pages/man1/perf-kvm.1.html); [Linux KVM API](https://docs.kernel.org/virt/kvm/api.html), KVM_IOEVENTFD / KVM_IRQFD; [virtio specification, Notifications](https://docs.oasis-open.org/virtio/virtio/v1.3/virtio-v1.3.html).

19. Почему oversubscription vCPU может ухудшить задержки программы со spinlock? Рассмотрите владельца блокировки, которого хост временно не исполняет; как проверить роль планирования, конкуренции за физические CPU и выбранного механизма ожидания?

    **Ответ:** Если host вытеснил vCPU-владельца spinlock, другие vCPU продолжают занимать физические CPU ожиданием и могут затруднить его возврат. Возникают lock-holder preemption и длинные tails; guest scheduler не управляет host scheduling. Измерять guest lock wait, host run queue/steal time, vCPU off-CPU intervals и размещение. Сравнить без oversubscription, с выделенными cores и с поддерживаемыми paravirtual locks/блокирующим ожиданием, сохранив critical section и нагрузку.

    **Типичная ошибка:** Объяснять весь spin time длительностью critical section, когда владелец вообще не исполнялся.

    **Источник:** [KVM CPUID, KVM_FEATURE_PV_UNHALT / PV_SCHED_YIELD](https://docs.kernel.org/virt/kvm/x86/cpuid.html); [Linux perf sched](https://man7.org/linux/man-pages/man1/perf-sched.1.html).

20. Как двухступенчатая трансляция влияет на стоимость TLB miss? Сравните обычные и большие страницы гостя и хоста, учтите кеширование результатов трансляции и объясните, почему число чтений памяти нельзя получить простым постоянным множителем для всех машин.

    **Ответ:** При miss итогового TLB hardware walker проходит guest tables и для их чтений использует second-stage translation; доступ к данным также требует второго этапа. В учебной модели с `g` guest levels и `h` host levels, без всех caches, максимум составляет `g(h+1)+h` чтений таблиц, плюс data access. Для `g=h=4` это 24 table reads и одно чтение данных. Это модель, а не постоянная цена: paging-structure caches, TLBs, huge pages и перекрытие резко меняют число DRAM accesses. Большие guest pages сокращают guest walk, большие host pages — second-stage walk; итоговый translation reach зависит от обоих mappings.

    **Типичная ошибка:** Умножать обычный miss cost на два без анализа walk и caches.

    **Источник:** [Intel SDM, Vol. 3: System Programming Guide](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), Caching Translation Information / EPT; [KVM x86 MMU](https://docs.kernel.org/virt/kvm/x86/mmu.html).

21. Что нужно перенести при live migration виртуальной машины помимо содержимого RAM? Разберите состояние vCPU, устройств, незавершённых I/O и учёт изменённых страниц; почему passthrough-устройство может усложнять согласованную миграцию?

    **Ответ:** Переносятся CPU registers/features, interrupt controllers/timers, clock state, device model, queues, pending interrupts и согласованное состояние I/O; disk/network state требует собственного протокола. Dirty tracking выявляет изменённые страницы, pre-copy переносит их повторно, затем на короткой остановке фиксируют окончательное состояние. При post-copy иные гарантии/риски. Passthrough усложняет migration, поскольку внутреннее состояние и DMA writes устройства могут не поддерживать сериализацию/dirty logging; нужна явная migration support пары device/driver/VMM и совместимость destination.

    **Типичная ошибка:** Скопировать RAM работающей VM и считать image согласованным snapshot.

    **Источник:** [QEMU Migration framework](https://www.qemu.org/docs/master/devel/migration/main.html); [QEMU VFIO device migration](https://www.qemu.org/docs/master/devel/migration/vfio.html).

22. Чем nested virtualization отличается от обычной виртуальной машины? Проследите ответственность гостевого и внешнего hypervisor за привилегированные события и трансляцию адресов; какие аппаратные возможности нужно явно проверить перед сравнением производительности?

    **Ответ:** Nested virtualization запускает guest hypervisor L1 внутри VM внешнего L0, а его VM — L2. L0 владеет аппаратной виртуализацией и изолирует L1/L2 от host; L1 задаёт виртуальные controls/таблицы для L2. L0 объединяет/эмулирует controls и отражает нужные exits L1. Логический адресный путь: `L2 GVA → L2 GPA → L1 GPA → HPA`; L0 обычно компонирует mappings, поэтому три логических перехода не означают три независимых полных walk при каждом доступе. Нужно проверить exposed VMX/SVM, nested EPT/NPT, interrupt virtualization и ограничения migration, версии CPU/KVM и guest-visible features.

    **Типичная ошибка:** Представлять nested guest как независимый прямой VMX root на физическом CPU.

    **Источник:** [Linux KVM, Running nested guests](https://docs.kernel.org/virt/kvm/x86/running-nested-guests.html).

23. В гостевой ОС измеряется нестабильное время короткой операции. Как различить clock source, приостановку vCPU, миграцию между физическими CPU и реальное замедление кода; что именно должны означать wall time и CPU time в отчёте?

    **Ответ:** Зафиксировать guest clock source и host timekeeping/TSC virtualization. Wall time включает паузы, когда vCPU не исполнялся; guest thread CPU time характеризует учитываемое ОС исполнение и требует проверки semantics на выбранной среде. Сопоставить outliers с steal time, host scheduler traces, migrations и CPU frequency. Измерить достаточно длинные batches, отдельно overhead таймера, повторить с pinning/reserved cores и без migration. TSC delta не равен автоматически active core cycles и способен продолжать расти при паузе vCPU.

    **Типичная ошибка:** Объявить короткий код медленнее по одному wall-time outlier без проверки descheduling.

    **Источник:** [KVM x86 Timekeeping Virtualization](https://docs.kernel.org/virt/kvm/x86/timekeeping.html); [clock_gettime(2)](https://man7.org/linux/man-pages/man2/clock_gettime.2.html).

24. Для очереди DMA выбран passthrough в VM. Спроектируйте последовательность настройки, запуска, остановки и возврата устройства хосту: кто владеет страницами, IOMMU mappings и прерываниями и как исключить доступ устройства к памяти после её освобождения?

    **Ответ:** Host проверяет IOMMU group/reset isolation, останавливает native driver и передаёт устройство VFIO. VMM регистрирует guest memory, закрепляет необходимые страницы и создаёт IOVA mappings с минимальными правами; настраивает interrupt routing. Guest driver создаёт queues/descriptors и запускает DMA только после готовности mappings. При остановке блокируют новые submissions, завершают или отменяют pending I/O, quiesce/reset устройство по документации и синхронизируют handlers. Затем отзывают DMA/interrupt mappings с требуемой invalidation, освобождают pinned pages и только после безопасного reset возвращают host driver. Закрытие guest процесса само по себе не доказывает прекращение всех транзакций.

    **Типичная ошибка:** Сначала освободить RAM VM, а затем пытаться остановить всё ещё bus-mastering устройство.

    **Источник:** [Linux VFIO, Groups/Devices/IOMMUs](https://docs.kernel.org/driver-api/vfio.html); [Linux IOMMUFD, IO address spaces and device ownership](https://docs.kernel.org/userspace-api/iommufd.html).

## Критерий освоения

Вы связываете этапы загрузки с подготовкой аппаратного состояния, объясняете границы привилегий и рисуете трансляцию адресов в VM. В разборе виртуализации вы различаете работу гостя, hypervisor и устройства, а потери производительности объясняете проверяемыми механизмами.

[<- Prev](./13_abi_and_system_interface.md) · [Оглавление](./README.md) · [Next ->](./15_security_reliability_and_power.md)
