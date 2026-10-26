# Измерения и сквозные задачи

Цель — связать механизмы предыдущих тем с наблюдаемым поведением программы и научиться проверять причины ускорения или замедления. Начать можно после [основ устройства компьютера](./01_digital_foundations.md); задания с кешами, NUMA, SIMD и устройствами проходите после соответствующих тем. Для Linux подойдут `perf`, `objdump`, `readelf`, `lscpu` и средства изучения топологии; поддержку PMU и разрешения на измерения проверяйте в своей среде.

## Лёгкий уровень

1. Чем latency одной операции отличается от throughput потока операций? Для обработки пакетов определите единицы измерения, границы начала и конца запроса и случай, когда увеличение размера batch повышает throughput, но ухудшает задержку.

   **Ответ:** Latency — длительность одного запроса между выбранными событиями, например arrival→completion в μs. Throughput — завершённые requests/s, packets/s или полезные bytes/s за интервал. Отдельно определяют service time и queueing time. Batch амортизирует накладные расходы, но первый пакет ждёт накопления группы; при перегрузке растёт ещё и очередь. Для корректного сравнения фиксируют arrivals, размер пакетов, границы timing и error/drop rate.

   **Пример:** Batch 32 с обработкой за 16 μs даёт до 2 млн packets/s без других затрат; пакет, ожидавший накопления 100 μs, имеет latency минимум 116 μs.

   **Типичная ошибка:** Выводить p99 из `1/throughput`, когда одновременно в работе много запросов.

   **Источник:** [Google Benchmark, CPU/Real/Manual Timing](https://google.github.io/benchmark/user_guide.html); [Linux NAPI, batching](https://docs.kernel.org/networking/napi.html).

2. Что именно вы измеряете: wall time, CPU time, такты или число завершённых инструкций? Объясните влияние ожидания, вытеснения и нескольких потоков; почему эти величины нельзя подставлять друг вместо друга без уточнения условий?

   **Ответ:** Wall time — прошедшее время, включая ожидание и descheduling; thread/process CPU time — учтённое ОС исполнение. Core cycles зависят от event, частоты и scope; TSC ticks могут иметь фиксированный rate и не равняться active cycles. Retired instructions считают архитектурно завершённую работу по определению PMU, а не исходные строки или все speculative μops. У нескольких потоков CPU time может превышать wall time; у блокирующего потока — быть намного меньше.

   **Пример:** Два потока, исполнявшиеся по секунде одновременно, дают около 1 s wall и 2 s суммарного CPU time.

   **Типичная ошибка:** Делить TSC delta на номинальную частоту ядра без проверки clock semantics.

   **Источник:** [clock_gettime(2)](https://man7.org/linux/man-pages/man2/clock_gettime.2.html); [perf_event_open(2)](https://man7.org/linux/man-pages/man2/perf_event_open.2.html).

3. Какие сведения нужно записать, чтобы другой человек мог повторить benchmark? Составьте паспорт эксперимента с CPU, памятью, ОС, компилятором, флагами сборки, входом и числом потоков; какие из этих параметров особенно важны для сравнения двух запусков?

   **Ответ:** Паспорт включает source commit и checksum binary, CPU model/stepping/microcode, topology/caches/NUMA, RAM/channels, ОС/kernel, compiler version/target, flags/libraries, вход/seed/size/layout, threads/affinity/memory policy. Записать частотную/энергетическую политику, virtual/container context, competing workload, warmup, timing scope, repeats и aggregation. Сохранить команды, raw results, дату и выбранные PMU events с единицами. Для A/B особенно важны одинаковые input semantics, build flags, placement, frequency и прогретость; несовпадения явно документируют.

   **Типичная ошибка:** Написать только «CPU 3 GHz, -O3» без модели, версии и воспроизводимого входа.

   **Источник:** [Google Benchmark, User Guide](https://google.github.io/benchmark/user_guide.html), Extra Context / Output Formats; [perf-stat(1), events, repetition и scope](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

4. Почему перед измерением скорости нужно проверить результат вычисления? Предложите проверку для целочисленного преобразования и для суммы floating-point массива; как выбирать допуск и обнаруживать пропущенную работу или неверную обработку хвоста?

   **Ответ:** Неверная или удалённая работа может выглядеть очень быстрой. Для целочисленного преобразования сравнить каждый результат с простой эталонной реализацией, включая нулевой/малый размер, границы значений и длины около SIMD width; signed overflow нельзя использовать как неоговорённый эталон. Для FP sum задать правило NaN/Inf, тип и порядок эталона, абсолютный/относительный допуск с учётом масштаба и cancellation; при необходимости использовать higher precision/compensated reference. Проверку сделать вне timing и потребить результат внутри общего протокола benchmark.

   **Пример:** Проверить длины `0,1,W-1,W,W+1,2W+3`; хвост `W+1` обнаруживает пропущенный последний элемент.

   **Типичная ошибка:** Проверять только checksum с высокой вероятностью коллизии или требовать bitwise равенство всех допустимых FP reductions.

   **Источник:** [LLVM Auto-Vectorization, diagnostics и reductions](https://llvm.org/docs/Vectorizers.html); [Google Benchmark, User Guide](https://google.github.io/benchmark/user_guide.html), Preventing Optimization.

5. Зачем повторять измерение и показывать разброс результатов? На примере нескольких длительностей объясните различие минимума, медианы и процентилей; почему среднее одной небольшой серии может скрыть редкие большие задержки?

   **Ответ:** Повторы показывают variability и устойчивость вывода. Для `10,11,11,12,100 ms` minimum=10, median=11, mean=28,8 ms: среднее и медиана отражают разные свойства, а большой хвост важен для SLA. Percentile требует указанного метода оценки; p99 из пяти наблюдений ненадёжен. Сохраняют raw samples, размер выборки и интервалы/порядок A/B runs; различают распределение per-request latency и распределение длительности целого benchmark. Не удаляют outliers без объяснения причин.

   **Типичная ошибка:** Показывать лишь лучший запуск как «типичное время» или вычислять среднее от разных по нагрузке серий.

   **Источник:** [Google Benchmark, User Guide](https://google.github.io/benchmark/user_guide.html), Repetitions / Reporting Statistics.

6. Чем холодный запуск отличается от steady state? Разделите загрузку кода, page faults, заполнение кешей и выполнение уже прогретого цикла; какой вариант соответствует первому запросу сервиса, а какой — длительной обработке массива?

   **Ответ:** Cold run может включать process startup, linking, demand paging, first-touch allocation, заполнение caches/TLB и startup allocator. Steady state измеряет уже работающий процесс после явно описанного warmup; он всё ещё может испытывать DRAM/cache misses из-за большого working set. Первый запрос сервиса проверяют отдельным end-to-end cold сценарием; длительную обработку массива — устойчивым режимом. Разделяют cold CPU caches и cold filesystem cache: это разные условия.

   **Пример:** Выделение/инициализацию массива вынести за timing для чистого compute test, но включить при оценке полной стоимости разовой операции.

   **Типичная ошибка:** Считать prefaulted массив гарантированно находящимся в LLC или прогревать вариант A сильнее B.

   **Источник:** [Google Benchmark, User Guide](https://google.github.io/benchmark/user_guide.html), Warmup Time / Setup and Teardown; [getrusage(2), page faults](https://man7.org/linux/man-pages/man2/getrusage.2.html).

7. Как оптимизатор может удалить или преобразовать работу benchmark? Разберите функцию с заранее известным результатом и функцию, результат которой нигде не используется; как убедиться через машинный код и наблюдаемый результат, что измеряется нужная операция?

   **Ответ:** Компилятор может constant-fold результат, удалить неиспользуемые вычисления, вынести invariant из цикла, vectorize или объединить обращения. Вход должен быть runtime-dependent, результат — наблюдаемым; проверить итоговое disassembly и compiler report. Benchmark helpers вроде `DoNotOptimize`/`ClobberMemory` применять по их контракту: они не запрещают все преобразования внутри выражения. Измеряемый цикл должен остаться в нужном виде; отдельный `volatile` меняет semantics/access pattern и часто мешает самой исследуемой оптимизации.

   **Пример:** Миллион вызовов `f(2)` может превратиться в одну константу; runtime input и external/неинлайновая граница позволяют проверить нужную работу, но добавляют overhead.

   **Типичная ошибка:** Использовать пустой цикл и называть полученное время стоимостью арифметики.

   **Источник:** [Google Benchmark, User Guide](https://google.github.io/benchmark/user_guide.html), Preventing Optimization; [GCC Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

8. Как отличить гипотезу о причине замедления от самого измеренного факта? Сформулируйте для падения скорости обхода массива минимум два возможных объяснения и предложите по одному изменению эксперимента, которое поможет их различить.

   **Ответ:** Факт: время на элемент выросло при переходе от 256 KiB к 2 MiB. Гипотеза 1 — выход из cache: изменить footprint при сохранении числа pages/характера доступа насколько возможно и сопоставить cache events с известной геометрией. Гипотеза 2 — TLB pressure: сравнить обычные/huge pages при одинаковом data footprint и проверить фактический mapping. Также возможны prefetch, frequency и faults: prefault, pinning и telemetry делают проверки различимыми. Ни один counter сам по себе не доказывает причину.

   **Типичная ошибка:** Называть каждую ступеньку графика границей L1/L2 без topology и контрольных опытов.

   **Источник:** [Intel Optimization Manual, memory hierarchy](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html); [Linux THP](https://docs.kernel.org/admin-guide/mm/transhuge.html).

## Средний уровень

9. За одну и ту же измеренную область PMU зарегистрировал 1,2 млрд завершённых инструкций и 0,8 млрд core cycles. Рассчитайте IPC и CPI; какие сведения о потоках, поддержке событий, multiplexing и области измерения нужны, прежде чем сравнивать результат с другой машиной?

   **Ответ:** `IPC = 1,2/0,8 = 1,5 instruction/cycle`; `CPI = 0,8/1,2 ≈ 0,667 cycle/instruction`. Убедиться, что events собраны для одной области и одинаковых threads, user/kernel scope и времени. Проверить поддержку/точное определение events, `time_enabled/time_running`, scaling при multiplexing, migrations между типами ядер и виртуализацию. Grouping помогает получать одновременные counts при наличии PMU resources; неподдержанный event нельзя считать нулём. Более высокий IPC не гарантирует меньшего времени для другой программы/ISA.

   **Типичная ошибка:** Делить per-process instructions на system-wide cycles или сравнивать IPC без объёма полезной работы.

   **Источник:** [perf-stat(1), events, repetition и scope](https://man7.org/linux/man-pages/man1/perf-stat.1.html); [perf_event_open(2), event semantics и sampling](https://man7.org/linux/man-pages/man2/perf_event_open.2.html), PERF_FORMAT_TOTAL_TIME_ENABLED / RUNNING.

10. Для учебной машины пиковая вычислительная производительность равна 160 GFLOP/s, пропускная способность DRAM — 40 GB/s, а arithmetic intensity задачи — 2 FLOP на байт трафика DRAM. Какой предел даёт модель Roofline и что изменится при intensity 8; какие расходы реальной программы не учитывает этот расчёт?

    **Ответ:** Roofline даёт `P ≤ min(P_peak, BW × I)`. При `I=2 FLOP/B`: `min(160,40×2)=80 GFLOP/s`, предел по памяти. При `I=8`: `min(160,40×8)=160 GFLOP/s`, предел по вычислениям; ridge point `160/40=4 FLOP/B`. Использованы десятичные GB и тот же уровень DRAM для bandwidth и intensity. Это верхняя граница: модель не гарантирует достаточные SIMD/ILP/MLP, не учитывает все зависимости, imbalance, branch/control cost и недостижение пиковой полосы.

    **Типичная ошибка:** Считать intensity по байтам исходных элементов, игнорируя реальный DRAM traffic, повторное использование и write allocation.

    **Источник:** [Williams, Waterman, Patterson: Roofline, UCB/EECS-2008-134](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.pdf).

11. Спроектируйте benchmark обхода рабочего набора от нескольких KiB до размера больше LLC. Как выбрать шаг изменения размера и число проходов, учитывать prefetch и page faults и проверить, действительно ли наблюдаемые переломы соответствуют уровням кеша?

    **Ответ:** Выбрать геометрическую сетку размеров, например ×1,25, с дополнительными точками около ожидаемых caches. Prefault и initialize вне timing, pin thread, зафиксировать layout/alignment и набрать достаточно проходов для устойчивого времени; публиковать ns/access и bytes/s. Последовательный обход исследует streaming/prefetch, случайный зависимый — иную задачу. Сопоставить переломы с cache geometry и counters, а контроль с huge pages/offset/stride поможет отделить TLB и conflicts. Cold и warm серии вести отдельно.

    **Типичная ошибка:** Сохранять одно число проходов для 4 KiB и 1 GiB, получая слишком короткий первый и thermal drift второго.

    **Источник:** [Intel Optimization Manual, caches/prefetch](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html); [perf-stat(1), events, repetition и scope](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

12. Чем эксперимент с зависимым pointer chasing отличается от чтения нескольких независимых потоков адресов? Спланируйте сравнение, которое исследует latency и memory-level parallelism; как исключить повторяемый порядок, который упрощает работу prefetcher?

    **Ответ:** Одна зависимая chain выдаёт следующий адрес после завершения предыдущего load, исследуя latency при малом MLP. Несколько независимых chains допускают concurrent misses и показывают рост throughput до ресурсного предела. Создать случайные permutations без коротких циклов, сохранить seed и одинаковые footprint/число loads; менять число chains с контролем кода. Prefault, warmup и final consumed pointer исключают faults и удаление работы. Один cache line на node помогает избежать случайного reuse, но меняет footprint — его учитывать явно.

    **Пример:** При latency 100 ns идеальный предел одной chain — 10 млн loads/s, восьми — до 80 млн до достижения bandwidth/request limits; это модель, не измерение CPU.

    **Типичная ошибка:** Сравнить одну chain с восемью при восьмикратном footprint и объяснить всё только MLP.

    **Источник:** [Intel Optimization Manual, memory-level parallelism](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

13. Как проверить гипотезу о branch misprediction на цикле с условием? Сравните входы с одинаковым объёмом данных и разным порядком значений, исследуйте машинный код и branch events; что делать, если компилятор заменил ветвление на условное перемещение или SIMD?

    **Ответ:** Сохранить одинаковые значения/долю true, footprint и полезные вычисления, но сравнить sorted/alternating/random order. Проверить disassembly: нужен реальный branch в исследуемом месте. Собрать branches, branch-misses и время, нормируя на элементы; сохранить seed. Если compiler сделал cmov/SIMD, это отдельный вариант: использовать предусмотренную compiler настройку/контролируемую функцию для branch test и отдельно сравнить обычную оптимизацию. Sorting может менять и locality, поэтому данные/число обращений контролируют.

    **Типичная ошибка:** Вывести misprediction cost из исходного `if`, который отсутствует в binary.

    **Источник:** [perf-stat(1), events, repetition и scope](https://man7.org/linux/man-pages/man1/perf-stat.1.html); [LLVM Auto-Vectorization, diagnostics и reductions](https://llvm.org/docs/Vectorizers.html); [GCC Optimize Options, if-conversion](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

14. Как сравнить scalar и SIMD версии одной операции без подмены задачи? Зафиксируйте типы, правила floating point, хвост массива и ISA, затем получите отчёт о векторизации и профиль; почему ускорение на массиве в L1 может исчезнуть при работе из DRAM?

    **Ответ:** Зафиксировать одну функцию, integer overflow rules либо FP contraction/reassociation, aliasing, alignment, хвост и допустимую ISA. Scalar собрать с явно отключённой vectorization, SIMD — с включённой, сохранив остальные существенные условия; проверить reports/disassembly и outputs. Измерить L1-resident и DRAM-sized inputs с одинаковым traffic. В L1 уменьшается compute instruction cost, а из DRAM обе версии могут упереться в одинаковый memory bandwidth; speedup тогда уменьшается. Учитывать изменившуюся частоту и tail fraction.

    **Пример:** Для Clang reports: `-Rpass=loop-vectorize -Rpass-missed=loop-vectorize`; scalar control: `-fno-vectorize -fno-slp-vectorize`.

    **Типичная ошибка:** Разрешить fast-math только SIMD-варианту и сравнивать разные численные контракты.

    **Источник:** [LLVM Auto-Vectorization, diagnostics и reductions](https://llvm.org/docs/Vectorizers.html).

15. Как проверить влияние NUMA на многопоточную обработку? Сопоставьте привязку потоков, размещение страниц, первый доступ и размер рабочего набора; какие наблюдения различат удалённый доступ, исчерпание bandwidth и конкуренцию SMT siblings?

    **Ответ:** На настоящей NUMA-машине зафиксировать topology и выбрать матрицу CPU placement × memory placement: local, remote, parallel first-touch, interleave. Инициализировать новые страницы нужными потоками, проверить `numa_maps`/`move_pages`, учитывать automatic balancing/THP. Сравнить dependent loads и streaming, увеличивая threads сначала по одному physical core, затем SMT. Remote access подтверждают topology/placement и межузловой traffic, bandwidth saturation — plateau bytes/s, SMT contention — ухудшение при добавлении siblings с тем же memory placement.

    **Типичная ошибка:** Считать `taskset` достаточным контролем расположения памяти.

    **Источник:** [Linux NUMA Memory Policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Linux Page Migration](https://docs.kernel.org/mm/page_migration.html).

16. Как использовать sampling profile и счётчики PMU вместе? На примере горячей функции объясните, что показывает доля samples и что показывает агрегированное событие; почему samples, skid и ограниченная точность событий не позволяют приписывать каждую задержку одной строке исходника?

    **Ответ:** Sampling показывает, где накапливались samples выбранного события, а `perf stat` — агрегированное число событий в scope. Доля cycle samples в функции приближённо локализует CPU activity; cache-miss samples отвечают другому вопросу. Использовать symbols/debug info, call graph, event definition и точный sampling, если поддерживается. Skid сдвигает recorded IP, inlining и instruction scheduling усложняют привязку к строке; multiplexing, потерянные samples и overhead тоже проверяют. Затем узкую гипотезу подтверждают контрольным изменением и whole-program time.

    **Типичная ошибка:** Прочитать 40% samples как «40% wall time» без учёта ожидания или приписать каждый miss соседней исходной строке.

    **Источник:** [perf_event_open(2), event semantics и sampling](https://man7.org/linux/man-pages/man2/perf_event_open.2.html), precise_ip / sampling; [perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

## Сложный уровень

17. Скорость обработки растёт до четырёх потоков, а затем почти не меняется. Постройте план проверки сериализации, lock contention, bandwidth, false sharing и NUMA; какие независимые изменения нагрузки или размещения помогут отсеять каждую гипотезу?

    **Ответ:** Измерить throughput, per-thread CPU/off-CPU time и profile при 1,2,4,8… workers. Сериализацию проверить уменьшением serial phase/независимыми partitions; lock contention — локальными accumulators и lock wait profile; bandwidth — bytes/s и compute-heavy control; false sharing — padding при сохранении числа операций; NUMA — local first-touch и affinity. Менять по одному фактору, проверять outputs и учитывать overhead запуска/агрегации. Amdahl fit описывает plateau, но сам по себе не определяет его механизм.

    **Типичная ошибка:** Объяснить предел числом ядер без проверки bandwidth и shared ownership.

    **Источник:** [Linux perf lock](https://man7.org/linux/man-pages/man1/perf-lock.1.html); [perf-c2c(1)](https://man7.org/linux/man-pages/man1/perf-c2c.1.html); [Roofline](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.pdf).

18. Сравните несколько потоков с общим атомарным счётчиком, независимыми счётчиками в соседних полях и разнесёнными локальными счётчиками с итоговым суммированием. Как обеспечить корректность и одинаковый логический результат, проверить layout и отделить true sharing от false sharing и стоимости финальной агрегации?

    **Ответ:** Каждый из T потоков выполняет N increments, итог во всех вариантах — `T×N`. Общий counter — atomic (при простом подсчёте достаточно relaxed); соседние отдельные counters принадлежат одному writer каждый и читаются после join, либо используются отдельные atomics для сравнения той же инструкции. Разнесённые counters выровнять и разместить по фактической coherence line; проверить addresses/offsets. Для частоты stores исследовать disassembly: compiler может свернуть обычный local loop в одно сложение. Отдельно показывать worker time и total time с reduction, startup и barriers.

    **Пример:** Shared atomic исследует true sharing; независимые atomics на одной линии против разнесённых — false sharing при одинаковой операции. Thread-local обычные counters с reduction показывают дополнительную пользу устранения atomics.

    **Типичная ошибка:** Использовать общий неатомарный counter с data race либо одновременно изменить sharing, операцию и объём работы.

    **Источник:** [Linux False Sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [perf-c2c(1)](https://man7.org/linux/man-pages/man1/perf-c2c.1.html).

19. После перестановки полей структуры программа ускорилась на 20%. Как проверить влияние уменьшения working set, alignment, векторизации, TLB и кеш-конфликтов; какие контрольные варианты помогут связать ускорение с механизмом, а не с одним удачным размещением?

    **Ответ:** Проверить `sizeof/alignof/offsetof`, addresses и прежний binary; сохранить исходные inputs/results. Контроль 1: новый layout с padding до прежнего размера отделяет footprint. Контроль 2: менять base alignment/несколько случайных offsets при одном layout. Контроль 3: vectorization on/off с проверкой codegen. Измерить sizes в L1/LLC/DRAM, pages/TLB events и варианты stride, сравнить instructions/bytes/cache events. Повторить A/B с чередованием и распределением времени: одна удачная аллокация не доказывает универсальные 20%.

    **Типичная ошибка:** Приписать всё «лучшему кешу», когда новый layout изменил векторизацию или просто уменьшил объём данных.

    **Источник:** [LLVM Vectorizers, costs/layout](https://llvm.org/docs/Vectorizers.html); [Linux False Sharing, layout investigation](https://docs.kernel.org/kernel-hacking/false-sharing.html).

20. Два варианта имеют близкую медиану, но разные p99. Как собрать достаточно наблюдений, определить способ подачи нагрузки, учесть очереди и coordinated omission; какие данные о scheduler, page faults и частоте нужны для интерпретации хвостов?

    **Ответ:** Собрать per-request arrival/start/completion, warmup policy, errors/timeouts и достаточно samples с независимыми повторами. При 100 наблюдениях p99 определяется лишь единичными хвостовыми событиями; большие серии и интервалы неопределённости нужны для устойчивого вывода. Open-loop arrivals продолжаются при замедлении, closed-loop клиент ждёт ответ и меняет offered load. Coordinated omission скрывает ожидавшие/неотправленные запросы; задержку считать от запланированного arrival, фиксировать generator lag и очереди. Сопоставлять tails с scheduling, faults, GC/allocations и frequency, сохраняя одинаковую load model.

    **Типичная ошибка:** Сравнивать p99 при разных arrival rates либо исключать timeouts из распределения без отдельного отчёта.

    **Источник:** [HdrHistogram, coordinated omission и corrected recording](https://github.com/HdrHistogram/HdrHistogram); [perf-sched(1)](https://man7.org/linux/man-pages/man1/perf-sched.1.html).

21. Спроектируйте сравнение interrupts, polling и адаптивного ожидания на очереди завершений. Как сохранить одинаковые полезную работу и входной поток, измерить CPU cost и задержки при простое и перегрузке и учитывать batching и interrupt moderation?

    **Ответ:** Подать один и тот же arrivals trace и payload, проверить completed/duplicate/lost requests и одинаковый queue protocol. Сравнить interrupts, busy polling и adaptive spin-then-sleep при low load, bursts и near saturation; фиксировать queue depth, affinity, batching и moderation. Измерить end-to-end latency distribution, throughput, cycles/CPU time и energy, включая idle. Для sleep transition нужен race-free recheck/notification protocol. Polling может улучшить low-latency ценой занятого core; под перегрузкой сравнивать также drops и queue growth.

    **Типичная ошибка:** Дать polling выделенное ядро, interrupts — занятое посторонней работой, а разницу объяснить только механизмом ожидания.

    **Источник:** [Linux NAPI, Busy Polling / IRQ suspension](https://docs.kernel.org/networking/napi.html).

22. Для передачи данных CPU → устройство нужно выбрать между копированием в staging buffer и DMA из отображённых страниц приложения. Какие затраты mapping, pinning, IOMMU, синхронизации и повторного использования буфера измерять; как построить зависимость от размера и частоты передач, сохранив корректное владение?

    **Ответ:** Сравнить одинаковые полезные transfers от доступности данных до completion, отдельно one-shot и reused/premapped buffers. Staging включает CPU copy, allocation/reuse, DMA mapping и submission; direct path — pinning/lifetime pages, scatter-gather, IOMMU mapping/invalidation и cache synchronization. Построить latency/throughput/CPU cost по size и transfer rate, записав число segments и queue depth. В timing включать setup согласно сценарию; amortized вариант показывать отдельно. Устройство читает буфер только после ownership transfer, приложение переиспользует его после completion и нужной sync.

    **Пример:** `T_staging ≈ T_copy(size)+T_submit+T_DMA`, `T_direct ≈ T_pin/map+T_submit+T_DMA`; reuse амортизирует pin/map, но фиксированного универсального crossover нет.

    **Типичная ошибка:** Сравнить premapped direct path с allocation+copy+mapping при каждом staging request и назвать это общим законом.

    **Источник:** [Linux DMA API HOWTO](https://docs.kernel.org/core-api/dma-api-howto.html); [Linux pin_user_pages](https://docs.kernel.org/core-api/pin_user_pages.html).

23. Программа стала быстрее после замены вычисления таблицей предрасчитанных значений. Как сравнить instruction count, обращения к памяти, размер таблицы и влияние на соседнюю нагрузку; почему локальное сокращение инструкций может ухудшить итоговый throughput при большем рабочем наборе?

    **Ответ:** Проверить эквивалентность таблицы, domain inputs, numerical error и cost её построения. Собирать whole-program time, instructions, actual loads/bytes, footprint/cache/TLB effects; менять table size и input distribution от L1-resident до DRAM-sized. Сравнить isolated и colocated нагрузку: table может вытеснить данные соседа и увеличить shared bandwidth. Для разового запуска включить initialization, для долгой службы — показать амортизацию. Снижение retired instructions помогает только если выигрыш превышает добавленную memory latency/traffic.

    **Типичная ошибка:** Объявить оптимизацию успешной по instruction count, игнорируя end-to-end throughput и соседние workloads.

    **Источник:** [Roofline, operational intensity и memory traffic](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.pdf); [Intel Optimization Manual, cache locality](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

24. Подготовьте итоговый отчёт об оптимизации выбранной задачи: бинарного парсера, обработки массива или очереди сообщений. Какие исходники, проверки, конфигурация, графики, профили и контрольные эксперименты позволят читателю воспроизвести результат, оценить ограничения и выбрать следующий шаг исследования?

    **Ответ:** Для обработки массива отчёт должен содержать задачу/контракт (например `uint32_t out[i]=in[i]*3+1` с арифметикой modulo 2³²), baseline и оптимизацию, исходники/commit, build/run commands и паспорт среды. Приложить correctness checks для границ/хвостов, runtime-generated inputs/seed, raw timings нескольких runs и графики time/element, bytes/s по size и threads. Добавить compiler report/disassembly, profile/PMU definition и контрольные варианты: vectorization off, разные alignments, cache/DRAM working sets. Разделить measured facts, объяснение и непроверенные гипотезы; описать где speedup исчезает и следующий опыт. Это шаблон ответа, результаты конкретного проекта нужно получить запуском.

    **Пример:** Артефакты: `src/`, `build.sh`, `run.sh`, `environment.txt`, `checks.log`, `raw.csv`, `plots/`, `profile/`, `report.md`. В таблице A/B указать median, spread, число repeats, outputs и общий scope, не придумывая недоступные hardware counters.

    **Типичная ошибка:** Оставить только график speedup без baseline time, raw data и воспроизводимого binary.

    **Источник:** [Google Benchmark, User Guide](https://google.github.io/benchmark/user_guide.html), Output Formats / Context / Repetitions; [perf-stat(1), events, repetition и scope](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

## Критерий освоения

У вас есть хотя бы один воспроизводимый эксперимент с проверкой корректности, исходной гипотезой, контрольным вариантом и результатами нескольких запусков. Вы объясняете пределы измерений и связываете выводы с механизмами CPU, памяти или устройства, а следующий эксперимент выбираете по оставшейся неопределённости.

[<- Prev](./15_security_reliability_and_power.md) · [Оглавление](./README.md)
