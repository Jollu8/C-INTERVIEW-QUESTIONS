# Профилирование GPU и проверка оптимизаций

Цель — переходить от наблюдаемой задержки приложения к проверяемой причине и выбирать оптимизацию по профилю. Предварительно разберите [модель исполнения](01_gpu_architecture.md), [память](04_global_memory.md) и [streams и events](07_streams_events_and_graphs.md). Первые вопросы полезны с первого kernel; аппаратные метрики и инструменты NVIDIA проверяйте для своей версии GPU, драйвера и профилировщика.

## Лёгкий уровень

1. Чем время постановки kernel в очередь отличается от времени его выполнения? Нарисуйте временную линию CPU и GPU для асинхронного запуска; какой интервал получится при измерении только вокруг вызова launch на CPU?

   **Ответ:** На CPU launch занимает интервал постановки; GPU может начать позже и закончить после возврата host. CPU-таймер только вокруг launch измеряет вызов/постановку и возможные задержки API. Device execution измеряют events с ожиданием конечной точки.

   **Типичная ошибка:** Приписывать host launch time вычислительной работе GPU.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

2. Какие разные задачи решают измерение времени одного kernel и измерение всего приложения? На примере «подготовить данные → H2D → kernel → D2H → обработать результат» определите границы обоих измерений и укажите, какой показатель отвечает на вопрос об ускорении пользовательской задачи.

   **Ответ:** Kernel-only измеряет device-операцию на готовых данных. End-to-end включает подготовку, H2D, kernel, D2H и нужную обработку результата с ожиданием завершения. Именно второе сравнение с CPU отвечает на вопрос о пользовательском ускорении.

   **Типичная ошибка:** Сравнивать GPU kernel-only с полным CPU pipeline.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

3. Как CUDA events позволяют измерить интервал между операциями в stream? Укажите, куда поставить начальное и конечное событие и какого завершения дождаться перед чтением длительности; что изменится, если связанные операции находятся в разных streams?

   **Ответ:** Start и stop записывают в stream до и после интересующих команд; ждут stop и читают elapsed time. Для нескольких streams строят общий start и join всех конечных событий. Между несвязанными events разных streams нет автоматически заданного интервала задачи.

   **Типичная ошибка:** Читать elapsed time до завершения stop.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

4. Почему первый запуск может быть медленнее последующих? Разделите инициализацию runtime, JIT, выделение памяти, прогрев кешей и само вычисление; как выбрать процедуру warm-up для измерения steady state, сохранив отдельный результат холодного запуска?

   **Ответ:** Первый запуск может включать runtime/context initialization, module load/JIT и allocator; кэш и частоты тоже меняют время. Создают нужные ресурсы, выполняют репрезентативные прогревочные итерации, затем измеряют steady state. Cold start сохраняют отдельным измерением в новом процессе при заданной политике JIT cache.

   **Типичная ошибка:** Скрывать cold latency в задаче, где она важна пользователю.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

5. Зачем повторять измерения и сохранять распределение длительностей? Объясните, как фоновые процессы, температура и режим питания могут повлиять на короткий эксперимент; какие характеристики серии нужны для сравнения двух реализаций?

   **Ответ:** Повторы показывают вариативность от планирования, фоновой нагрузки, температуры и частот. Сохраняют число запусков, медиану и перцентили/разброс, отдельно выбросы и порядок сравнения. Чередование A/B уменьшает влияние длительного дрейфа условий.

   **Типичная ошибка:** Выбирать лучший единичный замер как типичную производительность.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

6. Как вычислить полезную скорость сложения двух массивов `float`, если каждый элемент требует двух чтений и одной записи по 4 байта? Для `N = 10^7` и времени kernel 0,5 мс посчитайте effective bandwidth в десятичных GB/s; почему эта оценка не равна автоматически трафику DRAM по счётчикам?

   **Ответ:** Полезные байты `10^7*12=120 000 000`; время 0,0005 с даёт 240 GB/s. DRAM bytes могут отличаться из-за кэша, лишних секторов и write-политик. Для сравнения указывают, какая именно bandwidth измерена.

   **Типичная ошибка:** Считать 240 GB/s автоматически показанием DRAM-счётчика.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

7. Чем общая загрузка GPU отличается от полезной производительности конкретной задачи? Сравните непрерывное выполнение неэффективного kernel и короткие эффективные kernels с паузами между ними; какие дополнительные данные нужны помимо одного процента utilization?

   **Ответ:** Utilization показывает занятость по определённой метрике и интервалу, но не полезный результат в секунду. Медленный kernel может держать GPU постоянно занятым; быстрый — ждать вход. Нужны throughput, latency, timeline, объём работы и аппаратные метрики.

   **Типичная ошибка:** Принимать 100% utilization за оптимальную реализацию.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

8. Когда полезнее сначала открыть timeline Nsight Systems, а когда исследовать kernel в Nsight Compute? Для приложения с редкими длинными паузами и приложения с одним доминирующим kernel выберите начальный инструмент и сформулируйте вопрос, на который должен ответить профиль.

   **Ответ:** При паузах начинают с Nsight Systems: ищут CPU gaps, передачи, sync и очереди. Для одного доминирующего kernel используют Nsight Compute: исследуют память, инструкции и выдачу. Выбор инструмента следует вопросу о потере времени.

   **Типичная ошибка:** Начинать с тонких счётчиков kernel, когда приложение ждёт CPU.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

## Средний уровень

9. Как NVTX ranges помогают связать этапы приложения с вызовами CUDA и GPU-работой? Разметьте чтение входа, подготовку, передачу и вычисление; почему длительность CPU range не обязательно совпадает с завершением асинхронно запущенных им kernels?

   **Ответ:** NVTX размечает CPU-фазы и помогает сопоставить их с CUDA API и device-командами. Диапазоны «read», «prepare», «H2D enqueue», «compute enqueue» задают смысл этапов. Закрытие CPU range после launch не означает завершения GPU; completion отмечают отдельно.

   **Типичная ошибка:** Приравнивать длительность NVTX range вокруг launch к GPU duration.

   **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

10. Как обнаружить скрытую сериализацию передач и kernels на timeline? Сравните ожидаемые зависимости с фактическим порядком и составьте план проверки default stream, pageable memory, синхронизирующих API и нехватки независимой работы.

    **Ответ:** Сравнивают ожидаемый DAG с timeline и ищут лишние рёбра/пустоты. Проверяют legacy default stream, pageable staging, device/stream sync, allocations и отсутствие независимых слотов данных. По одному устраняют подозреваемый механизм и повторяют полный замер.

    **Типичная ошибка:** Добавлять streams, не выяснив источник сериализации.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

11. В чём различие theoretical occupancy и achieved occupancy в отчёте профилировщика? На примере kernel с коротким хвостом и неравной длительностью blocks объясните, какие ограничения статического размещения и фактического исполнения нужно исследовать отдельно.

    **Ответ:** Theoretical occupancy — предел размещения для данной конфигурации и ресурсов, achieved — наблюдаемое заполнение в ходе выполнения. Короткая grid, хвост и неравная длительность блоков снижают achieved без изменения статического предела. Проверяют обе причины отдельно.

    **Типичная ошибка:** Объяснять низкую achieved occupancy только регистрами.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

12. Для учебного GPU предел заданной арифметики равен 12 TFLOP/s, а DRAM bandwidth — 600 GB/s. Какой предел Roofline соответствует arithmetic intensity 4 FLOP на байт трафика DRAM и какой — 40; какие условия должны совпасть у пиковых значений и измеряемого kernel?

    **Ответ:** Roofline `min(Ppeak,B*I)`: при 4 FLOP/байт `min(12,0,6*4)=2,4 TFLOP/s`; при 40 — `min(12,24)=12 TFLOP/s`. Тип арифметики, способ счёта FLOP и уровень байтов должны совпадать; это потолок, а не обещание достижения.

    **Типичная ошибка:** Использовать интенсивность по полезным байтам с bandwidth физического DRAM без оговорки.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

13. Почему нужно различать байты, запрошенные потоками, и байты, переданные подсистемой памяти? Предложите сравнение последовательного и strided-доступа с одинаковой полезной работой; как по документации метрик проверить влияние coalescing, кешей и повторного использования?

    **Ответ:** Одинаковые полезные 128 байт warp могут затрагивать разное число секторов при stride. Повторные обращения могут обслужиться кэшем и не попасть в DRAM. По документации проверяют уровень метрики, единицы и нормировку; сравнивают requests, sectors, hits и DRAM bytes.

    **Типичная ошибка:** Смешивать счётчики L1, L2 и DRAM как один трафик.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

14. Как исследовать сообщение профилировщика о частых stalls? Сопоставьте зависимости, доступные eligible warps и выдачу инструкций; почему один высокий показатель ожидания не определяет причину замедления без учёта его базы подсчёта и занятости ресурсов?

    **Ответ:** Stall трактуют вместе с eligible warps, issue rate, зависимостями и занятостью memory/compute pipeline. Большая доля ожиданий не обязательно ограничивает throughput, если другие warp дают достаточно работы. Проверяют знаменатель/выборку метрики и ставят контрольный эксперимент.

    **Типичная ошибка:** Оптимизировать самый большой stall процент без анализа выдачи.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

15. Как узнать, появились ли local-memory accesses из-за spills после изменения kernel? Сравните отчёт компилятора, SASS и метрики памяти, затем проверьте время; почему простое уменьшение лимита регистров может одновременно повысить occupancy и ухудшить производительность?

    **Ответ:** Сверяют ptxas register/spill report, local инструкции SASS и local load/store метрики до/после. Не все local обращения являются spills: возможен исходный приватный массив. Уменьшение register limit может повысить размещение и одновременно добавить дорогой local-трафик; решает время.

    **Типичная ошибка:** Принимать любой local load за spill без проверки кода.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

16. Как сбор подробных метрик может изменить измеряемое выполнение? Разберите replay, сохранение состояния, сериализацию и управление кешами в выбранном режиме Nsight Compute; какие длительности нужно дополнительно получить вне профилировщика?

    **Ответ:** Nsight Compute может делать replay, сохранять состояние, сериализовать kernels и управлять cache состоянием. Поэтому профиль отличается от обычного pipeline. Проверяют режим инструмента и получают независимые CUDA-event и end-to-end измерения без профилирования.

    **Типичная ошибка:** Использовать профилируемый duration как единственное время приложения.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

## Сложный уровень

17. После увеличения block size occupancy выросла, а kernel замедлился: как построить расследование? Проверьте распределение работы, register pressure, spills, barriers, доступ к памяти и длину хвоста; какие контрольные варианты помогут связать результат с конкретным механизмом?

    **Ответ:** Фиксируют вход/объём, сравнивают несколько block sizes по времени, регистрам/spills, barriers, адресам и хвосту. Контрольные варианты меняют только B либо только объём работы на поток. Рост occupancy может сопровождаться худшим балансом, ILP и памятью.

    **Типичная ошибка:** Объяснять замедление одним показателем occupancy.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

18. Когда kernel fusion способна ускорить приложение, а когда увеличивает его длительность? Постройте модель с удаляемыми промежуточными передачами и launch overhead, затем учтите рост числа регистров, размер кода и потерю независимого планирования стадий.

    **Ответ:** Fusion экономит промежуточную запись/чтение и launch overhead. Цена — больше регистров, кода, сложнее синхронизация и потеря независимого планирования. Сравнивают `Tsaved memory+launch` с добавленными затратами и проверяют сохранение численного контракта.

    **Типичная ошибка:** Сливать стадии с глобальной зависимостью без корректного барьера.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

19. Как измерить пользу CUDA Graphs для повторяющейся последовательности коротких операций? Разделите capture, instantiation, обновление параметров и повторные launches; сколько повторений требуется для окупаемости при дополнительных затратах подготовки 2 мс и экономии 10 мкс на повтор?

    **Ответ:** Дополнительные 2000 мкс окупаются по 10 мкс на повтор: при 200 итерациях равенство, с 201 — строгий выигрыш. В реальном тесте отдельно измеряют capture, instantiate, update и replay, а также первый launch и итог серии.

    **Типичная ошибка:** Забывать расходы частого graph update.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

20. Почему оптимизация kernel на прогретых данных может не ускорить обработку новых порций? Сравните рабочий набор, кеширование, transfers, выделение буферов и CPU-подготовку; как построить эксперимент, соответствующий реальному времени жизни данных?

    **Ответ:** Прогретый набор может помещаться в кэш, а новые порции требуют передач, выделений и CPU-подготовки. Для реального режима используют сменяющиеся буферы/данные, соответствующий размер набора и lifetime. Сравнивают полный поток запросов, а не только повтор одного kernel.

    **Типичная ошибка:** Переносить warm-cache микробенчмарк на streaming workload.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

21. Как сравнить две версии, если профилирование требует нескольких проходов, а kernel имеет изменяющееся состояние? Определите способ восстановления входа и проверки детерминированности измеряемой работы; какие режимы сбора и ограничения инструмента нужно проверить до интерпретации счётчиков?

    **Ответ:** Перед каждым сопоставимым проходом восстанавливают исходное состояние и проверяют одинаковую полезную работу. Для внешних эффектов/состояния проверяют application/range replay и ограничения восстановления. Сохраняют seed и результат; счётчики несопоставимых прогонов не объединяют в причинный вывод.

    **Типичная ошибка:** Профилировать mutating kernel многократно без восстановления входа.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

22. Как отличить ограничение device-memory bandwidth от ожидания PCIe, CPU-подачи данных и частых запусков? Предложите серию экспериментов с уже размещёнными на GPU данными, разными batch sizes и отключённой CPU-подготовкой, сохраняя объём полезной работы и проверку результата.

    **Ответ:** Device-resident вариант исключает PCIe, увеличение batch проверяет launch overhead, готовые CPU-входы исключают подготовку. На одинаковой полезной работе измеряют timeline, DRAM bytes/bandwidth и transfer время. Изменение одного фактора показывает, где находится ограничение.

    **Типичная ошибка:** Называть любую медленную передачу «ограничением памяти GPU».

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

23. Как измерять tail latency GPU pipeline под непрерывным потоком запросов? Задайте модель поступления, способ учёта очереди и границы запроса, затем объясните, как асинхронность, batching и coordinated omission могут исказить p99.

    **Ответ:** Latency считают от запланированного/фактического поступления до готовности ответа, включая очередь и batching. Нагрузку задают независимо от завершения предыдущих запросов, иначе coordinated omission скрывает задержки перегрузки. Сохраняют p50/p95/p99, rate, очередь, drops и период измерения.

    **Типичная ошибка:** Начинать таймер только после выхода запроса из очереди.

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

24. Какие материалы позволят другому инженеру проверить утверждение «оптимизация ускорила обработку на 30%»? Подготовьте структуру отчёта с исходниками, входами, версиями, параметрами запуска, проверкой корректности, результатами нескольких серий и профилем, объясняющим причину изменения.

    **Ответ:** Отчёт содержит версии исходников, входы/seed, окружение, команды, launch, correctness и повторные серии baseline/new. Явно задают метрику: время меньше на 30% означает `Tnew=0,7*Told`, ускорение около 1,43. Профиль и контрольный вариант объясняют механизм, raw results позволяют перепроверить.

    **Типичная ошибка:** Путать «на 30% меньше времени» с «в 1,3 раза быстрее».

    **Источник:** [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html); [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

## Критерий освоения

Вы умеете отделить запуск от завершения, локальное ускорение от end-to-end результата и наблюдаемую метрику от гипотезы. Хотя бы одна оптимизация подтверждена воспроизводимым измерением, контрольным вариантом и повторной проверкой результата.

Источники: [Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html), [Nsight Compute Profiling Guide](https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html).

[← Библиотеки, FFT и случайные числа](12_libraries_fft_and_random.md) · [Оглавление](README.md) · [Отладка и корректность →](14_debugging_and_correctness.md)
