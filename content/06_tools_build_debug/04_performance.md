# C/C++ Performance & Profiling Question Bank (Linux)

270 вопросов с ответами: CPU/heap profiling, counters, locality и benchmarking. Команды `perf` относятся к Linux; события PMU, права доступа и unwind support зависят от машины и ядра. Примеры — лабораторные сценарии, которые нужно адаптировать к своему executable и workload.

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging / investigation

* **[S]** — system design / performance engineering

---

# 4. Performance & Profiling

---

## 4.1 CPU Profiling

## L1

1. (L1, T) Что такое profiling и чем он отличается от benchmarking?

   **Ответ:** Profiling показывает, где расходуются ресурсы; benchmarking измеряет результат заданной нагрузки. Профиль объясняет измеренное замедление.

   **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

2. (L1, T) Зачем нужен CPU profiling?

   **Ответ:** Он локализует участки и пути вызовов с большим расходом CPU, чтобы оптимизировать измеренный bottleneck.

   **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

3. (L1, T) Что такое hotspot?

   **Ответ:** Hotspot — участок с большой долей выбранной метрики: samples, CPU time или аллокаций. Метрику нужно указывать.

   **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

4. (L1, T) Почему “самая медленная функция” не всегда корень проблемы?

   **Ответ:** Большое время может определяться частотой вызовов, входными данными или ожиданием. Проверяют caller и причину нагрузки.

   **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

5. (L1, T) Что такое sampling profiler?

   **Ответ:** Он периодически снимает состояние исполнения и статистически оценивает распределение работы; короткие функции могут не попасть в samples.

   **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

6. (L1, T) Что такое instrumentation profiler?

   **Ответ:** Он добавляет измерительный код на выбранные события или границы функций; точность событий оплачивается накладными расходами.

   **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

7. (L1, T) Что такое wall-clock time и CPU time?

   **Ответ:** Wall time — прошедшее реальное время; CPU time — время исполнения на CPU. Сумма CPU time потоков может превышать wall time.

   **Источник:** [getrusage(2)](https://man7.org/linux/man-pages/man2/getrusage.2.html)

8. (L1, T) Что такое user time и system time?

   **Ответ:** User time учитывает исполнение пользовательского кода, system time — работу ядра от имени процесса.

   **Источник:** [getrusage(2)](https://man7.org/linux/man-pages/man2/getrusage.2.html)

9. (L1, P) Как измерить общее время выполнения программы в Linux?

   **Ответ:** Запустить `/usr/bin/time -v ./app`; сравнить elapsed, user и system time на одинаковом входе.

   **Источник:** [GNU Time](https://www.gnu.org/software/time/manual/time.html)

10. (L1, T) Почему без измерений оптимизация — это угадывание?

    **Ответ:** Без baseline неизвестны ни реальный bottleneck, ни размер эффекта; изменения могут ускорить редко выполняемый код.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L2

11. (L2, T) Что такое `perf` и для чего он используется?

    **Ответ:** Linux perf собирает counters, samples и tracing events; доступность зависит от ядра, PMU и разрешений.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

12. (L2, P) Как запустить `perf stat` для программы?

    **Ответ:** `perf stat -- ./app` собирает сводку событий за запуск; для повторов используют `perf stat -r 5 -- ./app`.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

13. (L2, P) Как запустить `perf record` и посмотреть отчет?

    **Ответ:** `perf record -g -- ./app`, затем `perf report`; корректность стеков зависит от unwind metadata и выбранного метода.

    **Пример:** На Linux для приложения с debug info и подходящей поддержкой DWARF unwinding:

    ```bash
    perf record -F 99 --call-graph dwarf -o perf.data -- ./app input.dat
    perf report -i perf.data --stdio
    ```

    **Типичная ошибка:** Анализировать короткий startup вместо steady-state фазы или использовать symbols другой сборки.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

14. (L2, T) Что такое sampling frequency?

    **Ответ:** Это целевая частота samples, например `-F 99`; рост частоты повышает детализацию и overhead, возможны throttling и потери.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

15. (L2, T) Что такое call graph profiling?

    **Ответ:** Профиль сохраняет цепочки вызовов, позволяя связать горячую функцию с контекстом её использования.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

16. (L2, P) Как понять, какая функция потребляет CPU?

    **Ответ:** Снять `perf record -g -- ./app`, затем посмотреть self/children в `perf report` и callers горячих функций.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

17. (L2, D) Почему top/htop недостаточно для анализа производительности?

    **Ответ:** Они показывают загрузку процессов, но обычно не объясняют конкретные функции, cache misses и пути ожидания.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

18. (L2, T) Что такое `gprof`?

    **Ответ:** GNU gprof анализирует данные профилирования инструментированного приложения: flat profile и call graph.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

19. (L2, P) Как собрать программу для `gprof`?

    **Ответ:** Компилировать и линковать с `-pg`, например `gcc -pg -g app.c -o app`; затем выполнить программу.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

20. (L2, T) В чем ограничения `gprof` по сравнению с `perf`?

    **Ответ:** Классический gprof требует instrumentation и ограничен в анализе потоков, ядра, ожиданий и hardware events.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L3

21. (L3, T) Как `perf` получает samples на Linux?

    **Ответ:** Ядро через perf events сохраняет samples при событиях PMU либо программных событиях; режим и payload настраиваются.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

22. (L3, T) Что такое PMU (Performance Monitoring Unit)?

    **Ответ:** PMU — аппаратный блок измерения событий CPU, например retired instructions и cache events; набор зависит от модели процессора.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

23. (L3, T) Разница hardware counters vs software events?

    **Ответ:** Hardware events исходят от PMU; software events формирует ядро, например context switches и page faults.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

24. (L3, P) Как использовать `perf top` для live-анализа?

    **Ответ:** `perf top -p PID` показывает горячие символы работающего процесса; для причин нужны стеки и репрезентативный интервал.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

25. (L3, P) Как собрать flamegraph из `perf` данных?

    **Ответ:** Получить стеки через `perf record -g`, вывести `perf script`, затем обработать `stackcollapse-perf.pl` и `flamegraph.pl` из FlameGraph.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

26. (L3, T) Что такое inclusive time и exclusive/self time?

    **Ответ:** Inclusive включает вложенные вызовы; self относится непосредственно к функции. Samples не всегда являются точным временем.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

27. (L3, D) Почему горячая функция может быть “жертвой”, а не причиной проблемы?

    **Ответ:** Allocator может быть горячим из-за лишних объектов у caller; исправлять следует источник ненужной работы.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

28. (L3, T) Что показывает flamegraph?

    **Ответ:** Агрегированное распределение стеков по выбранному весу, часто числу CPU samples; это не временная шкала.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

29. (L3, D) Как читать flamegraph правильно?

    **Ответ:** Ищут широкие пути снизу вверх, проверяют caller и self; ширина отражает вес, цвет обычно не кодирует стоимость.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

30. (L3, D) Почему “широкий фрейм” на flamegraph не всегда значит, что код надо оптимизировать именно там?

    **Ответ:** Родитель включает потомков, а широкий leaf может обслуживать избыточное число запросов; нужна причинная проверка.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L4

31. (L4, T) Как sampling bias влияет на выводы из профилирования?

    **Ответ:** Редкие или периодические события могут недопредставляться; проверяют объём выборки, lost samples и альтернативные события.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

32. (L4, D) Как диагностировать performance cliff, который проявляется только на production-нагрузке?

    **Ответ:** Воспроизвести размер данных, concurrency и saturation; сопоставить профили, очередь, throttling, память и latency до порога.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

33. (L4, S) Как встроить CPU profiling в инженерный workflow команды?

    **Ответ:** Определить сценарии, baseline, владельцев и формат артефактов; снимать профиль при регрессии и проверять эффект исправления.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

34. (L4, D) Как отличить CPU-bound проблему от lock contention, IO wait или scheduler issue?

    **Ответ:** Сравнить CPU/wall time, runnable/wait states, scheduler traces и стеки ожидания; on-CPU samples не объясняют весь wall time.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

35. (L4, S) Как строить reproducible CPU profiling pipeline для large-scale C++ сервиса?

    **Ответ:** Фиксировать commit, бинарник/symbols, workload, CPU/kernel, flags и команды; хранить raw profile и несколько независимых повторов.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


### perf

## L1

36. (L1, T) Что показывает `perf stat`?

    **Ответ:** Сводные значения выбранных событий, время запуска и производные отношения; это не профиль функций.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

37. (L1, P) Как посмотреть instructions, cycles, branches?

    **Ответ:** `perf stat -e instructions,cycles,branches,branch-misses -- ./app`; проверить поддержку событий и долю времени измерения.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

38. (L1, T) Что такое IPC?

    **Ответ:** Instructions per cycle: retired instructions / cycles. IPC сравнивают в контексте CPU и workload, без универсального целевого значения.

    **Пример:** 2 миллиарда instructions / 1 миллиард cycles = IPC 2. Это не означает, что программа быстрее приложения с IPC 1: последнее могло выполнять меньше полезных для результата инструкций.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

39. (L1, T) Почему высокий CPU usage не всегда означает плохую производительность?

    **Ответ:** Полезная параллельная работа тоже загружает CPU; важны throughput, latency и стоимость единицы результата.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

40. (L1, P) Как профилировать конкретный PID через `perf`?

    **Ответ:** `perf record -p PID -g -- sleep 10`; видимость процесса и разрешения должны позволять attachment.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L2

41. (L2, T) Что такое `perf record` и `perf report`?

    **Ответ:** Record сохраняет samples в perf.data, report агрегирует их по символам и цепочкам вызовов.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

42. (L2, P) Как включить call graph в `perf record`?

    **Ответ:** `perf record --call-graph dwarf -- ./app` либо `--call-graph fp` при сохранённых frame pointers.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

43. (L2, D) Почему `perf` может не показывать symbols?

    **Ответ:** Возможны stripped binary, отсутствующие debug packages, несовпадающие build IDs или недоступные mappings и kernel symbols.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

44. (L2, D) Почему без frame pointers/call graph качество профиля хуже?

    **Ответ:** Без корректного unwinding теряется caller context; leaf hotspot виден, но источник вызовов определить труднее.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

45. (L2, P) Как использовать `perf annotate`?

    **Ответ:** После записи выполнить `perf annotate --stdio`; нужны совпадающий executable и доступный disassembly, для строк — debug info.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

46. (L2, T) Что такое CPU migrations и context switches?

    **Ответ:** Migration — перенос потока между CPU; context switch — смена исполняемой task. Их частота требует контекста workload.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

47. (L2, P) Как измерить cache-misses через `perf stat`?

    **Ответ:** `perf stat -e cache-references,cache-misses -- ./app`; generic events имеют платформенно зависимое отображение.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

48. (L2, D) Как понять по `perf`, что проблема в branch misprediction?

    **Ответ:** Сопоставить branch-misses/branches с samples и кодом ветвлений; одного высокого отношения недостаточно для доказательства причины.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

49. (L2, T) Что такое stalled cycles?

    **Ответ:** События задержек продвижения pipeline; определение frontend/backend stall зависит от конкретной PMU.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

50. (L2, D) Как по counters понять, что код упирается не в ALU, а в память?

    **Ответ:** Проверить memory bandwidth, load latency, cache/TLB misses и IPC; counters служат гипотезой, подтверждаемой изменением доступа.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L3

51. (L3, T) Что такое multiplexing counters в `perf`?

    **Ответ:** При нехватке аппаратных счётчиков perf переключает события во времени и масштабирует результаты.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

52. (L3, T) Почему counters иногда неточны?

    **Ответ:** Причины: multiplexing, короткие интервалы, skid, ограничения PMU и непредставительная выборка; смотрят supported events и scaling.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

53. (L3, P) Как профилировать только user-space или kernel-space?

    **Ответ:** Добавить event modifier: `perf stat -e cycles:u -- ./app` либо `cycles:k`; права на kernel profiling могут ограничиваться.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

54. (L3, P) Как сравнивать два `perf` профиля до/после оптимизации?

    **Ответ:** Одинаковые workload и окружение, абсолютные времена и samples, затем `perf diff`; проценты без общего объёма вводят в заблуждение.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

55. (L3, D) Как интерпретировать высокий LLC miss rate?

    **Ответ:** Данные часто не находятся в LLC; проверяют working set, NUMA и bandwidth. Miss rate сам по себе не доказывает memory-bound.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

56. (L3, D) Как понять, что bottleneck в instruction cache?

    **Ответ:** Проверить frontend/i-cache events данной PMU, code footprint и горячий asm; сравнить после уменьшения рабочего кода.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

57. (L3, T) Что такое off-CPU analysis и чем он отличается от обычного CPU profiling?

    **Ответ:** Off-CPU анализирует время вне исполнения: блокировки, I/O и scheduling; обычный CPU profile видит исполняемые участки.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

58. (L3, D) Как `perf` помогает найти lock contention?

    **Ответ:** Сопоставить futex/scheduler traces и blocked stacks; `perf lock` ориентирован прежде всего на поддерживаемые kernel lock events.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

59. (L3, P) Как анализировать perf data для многопоточного приложения?

    **Ответ:** Разделять samples по TID/CPU, смотреть распределение работы и shared hotspots; дополнять scheduler/lock tracing.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

60. (L3, D) Как профилировать короткоживущую программу, которая заканчивается слишком быстро?

    **Ответ:** Профилировать весь запуск, увеличить полезную нагрузку или повторять процесс; отдельно учитывать startup и прогрев.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L4

61. (L4, S) Как стандартизировать perf-based performance investigations?

    **Ответ:** Зафиксировать команды, метаданные, критерии репрезентативности, ограничения доступа и шаблон причинного эксперимента.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

62. (L4, D) Как расследовать нестабильные результаты `perf` между прогонами?

    **Ответ:** Проверить фоновые задачи, frequency, thermal throttling, NUMA, page cache и lost samples; чередовать контрольные прогоны.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

63. (L4, S) Как сочетать `perf`, tracing и benchmarks для одного performance incident?

    **Ответ:** Benchmark измеряет симптом, perf локализует работу CPU, tracing объясняет очереди и ожидания; коррелировать по времени и request ID.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

64. (L4, D) Как анализировать CPU profile в контейнерах / ограниченных окружениях?

    **Ответ:** Проверить perf_event_paranoid, capabilities, namespace PID, cgroup quotas и symbol mappings; контейнер не обеспечивает отдельную PMU.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

65. (L4, S) Как автоматизировать regression detection по hardware counters?

    **Ответ:** Использовать стабильные runners, нормализацию на операцию и повторную проверку порога; counters дополняют пользовательские KPI.

    **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


### gprof

## L1

66. (L1, T) Как работает `gprof` на базовом уровне?

    **Ответ:** Instrumentation учитывает вызовы, sampling оценивает время; gprof строит отчёт по данным gmon.out.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

67. (L1, P) Какие флаги нужны для сборки под `gprof`?

    **Ответ:** `-pg` нужен при компиляции и линковке; `-g` добавляет исходные строки, но не заменяет instrumentation.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

68. (L1, P) Как получить `gmon.out`?

    **Ответ:** Запустить инструментированную программу с правом записи в текущий каталог и нормальным завершением; crash может не сохранить профиль.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

69. (L1, P) Как прочитать отчет `gprof`?

    **Ответ:** `gprof ./app gmon.out`; executable должен соответствовать запуску и быть собран с нужной instrumentation.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

70. (L1, T) Чем flat profile отличается от call graph в `gprof`?

    **Ответ:** Flat profile показывает собственную стоимость функций; call graph добавляет связи callers/callees и распределённую стоимость.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)


## L2

71. (L2, T) В чем ограничения `gprof` для современных C/C++ приложений?

    **Ответ:** Inlining, потоки, shared libraries и instrumentation overhead усложняют интерпретацию; нет полного анализа системных ожиданий.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

72. (L2, D) Почему `gprof` плохо подходит для многопоточного кода?

    **Ответ:** Классическая модель сбора и атрибуции вызовов не даёт надёжной полной картины современного многопоточного исполнения.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

73. (L2, D) Почему `gprof` может искажать производительность?

    **Ответ:** Дополнительные вызовы instrumentation меняют instruction/cache footprint и стоимость часто вызываемых функций.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

74. (L2, T) Когда `gprof` все еще может быть полезен?

    **Ответ:** Для простого последовательного приложения и учебного анализа call counts при поддерживаемом toolchain.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

75. (L2, D) Почему `gprof` показывает странные результаты на optimized code?

    **Ответ:** Inlining, tail calls и переупорядочивание меняют соответствие исходных функций машинному коду; часть функций исчезает.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)


## L3

76. (L3, D) Как отличить артефакты `gprof` от реальных bottleneck'ов?

    **Ответ:** Повторить измерение без instrumentation, проверить perf и workload; эффект должен сохраняться по времени и структуре затрат.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

77. (L3, S) Почему в современной Linux-практике чаще выбирают `perf`, а не `gprof`?

    **Ответ:** Perf позволяет sampling без пересборки и анализ kernel/hardware events; выбор всё равно зависит от доступности окружения.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

78. (L3, D) Какие типы профилей `gprof` принципиально не может дать?

    **Ответ:** Классический gprof не предоставляет полноценные off-CPU traces, PMU counters и системный scheduler profile.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

79. (L3, T) Почему instrumentation-based profiling меняет runtime behavior?

    **Ответ:** Измерительный код добавляет инструкции, память и синхронизацию, меняя timing и иногда interleavings потоков.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)

80. (L3, D) Как объяснить расхождение между `gprof` и `perf`?

    **Ответ:** Проверить разные сборки, события, интервалы и overhead; CPU samples и инструментированные оценки могут измерять разное.

    **Источник:** [GNU gprof](https://sourceware.org/binutils/docs/gprof/)


### Flamegraphs

## L1

81. (L1, T) Что такое flamegraph?

    **Ответ:** Визуализация агрегированных стеков, где ширина пропорциональна весу стека, например CPU samples.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

82. (L1, T) Что означает ширина блока на flamegraph?

    **Ответ:** Долю выбранного веса во всех samples с этим стековым префиксом; это не обязательно duration одного вызова.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

83. (L1, T) Что означает высота flamegraph?

    **Ответ:** Глубину стека вызовов, а не длительность или количество запросов.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

84. (L1, P) Как на базовом уровне использовать flamegraph для поиска hotspot'ов?

    **Ответ:** Найти широкие пути и leaves, затем проверить соответствующие callers и исходный код.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

85. (L1, D) Почему flamegraph не показывает временную последовательность событий?

    **Ответ:** Одинаковые стеки объединяются, а горизонтальное положение обычно задаётся сортировкой, не временем.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)


## L2

86. (L2, D) Как отличить self time от вложенных вызовов на flamegraph?

    **Ответ:** Ширина родителя включает детей; участок без дочерних frames соответствует self samples в обычном CPU flamegraph.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

87. (L2, D) Как понять, что у функции “дорогие дети”, а не она сама?

    **Ответ:** Большая часть ширины покрыта дочерними frames; подтвердить children/self в табличном отчёте.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

88. (L2, P) Как сравнивать two flamegraphs до/после изменений?

    **Ответ:** Одинаковые нагрузка, длительность и шкала; сравнивать абсолютную стоимость и нормализованный расход на операцию.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

89. (L2, D) Какие типичные ошибки допускают при чтении flamegraph?

    **Ответ:** Путать ширину с числом вызовов, высоту со временем, цвет с критичностью и агрегированный график с timeline.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

90. (L2, T) Почему flamegraph удобен для больших call stacks?

    **Ответ:** Он сохраняет caller context и показывает общие префиксы, скрытые в плоском списке функций.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)


## L3

91. (L3, D) Как flamegraph помогает обнаружить accidental complexity?

    **Ответ:** Повторяющиеся цепочки преобразований и wrappers показывают лишнюю работу; подтвердить, что её можно убрать без изменения контракта.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

92. (L3, D) Как по flamegraph заметить чрезмерную аллокацию или dispatch overhead?

    **Ответ:** Искать allocator, constructors, virtual dispatch и conversion chains; отличать стоимость операции от чрезмерного числа операций.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

93. (L3, D) Как увидеть на flamegraph, что время уходит в STL/allocator/runtime, а не в business logic?

    **Ответ:** Посмотреть широкие ветви std/allocator/runtime и перейти к первому прикладному caller, создающему эту нагрузку.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

94. (L3, P) Как строить differential flamegraph?

    **Ответ:** Свернуть стеки baseline и candidate, обработать `difffolded.pl`, затем `flamegraph.pl`; согласовать нормализацию.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

95. (L3, D) Как не сделать ложных выводов по flamegraph без дополнительных метрик?

    **Ответ:** Дополнить график elapsed time, throughput, counters и wait traces; профиль описывает только выбранный тип samples.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)


## L4

96. (L4, S) Как встроить flamegraphs в performance review pipeline?

    **Ответ:** Сохранять baseline/candidate profiles с метаданными и запускать review при воспроизводимом ухудшении KPI.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

97. (L4, D) Как использовать flamegraphs для обучения команды performance thinking?

    **Ответ:** Разбирать реальные широкие пути и проверять гипотезы небольшим экспериментом; не приравнивать визуальную ширину к дефекту.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

98. (L4, S) Как автоматизировать генерацию flamegraphs для regression analysis?

    **Ответ:** Скриптовать запись, symbolization, folding и rendering; хранить raw data вместе с commit и workload.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

99. (L4, D) Когда flamegraph лучше таблицы hot functions, а когда хуже?

    **Ответ:** Он лучше показывает контекст и общие пути; таблица удобнее для точных чисел, сортировки и сравнения self cost.

    **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)

100. (L4, S) Как объединять flamegraphs с counters и benchmark-результатами в единую картину?

     **Ответ:** Привязать один workload и build ID к времени, CPU samples и counters; вывод должен объяснять измеренное изменение KPI.

     **Источник:** [FlameGraph](https://github.com/brendangregg/FlameGraph)


     ---

## 4.2 Memory Profiling

## L1

101. (L1, T) Что такое memory profiling?

     **Ответ:** Измерение выделений, живых объектов, пиков и поведения памяти во времени; RSS и heap bytes анализируют отдельно.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

102. (L1, T) Чем memory leak отличается от high memory usage?

     **Ответ:** Leak означает потерю нужного освобождения или бесконтрольное удержание; большой полезный working set сам по себе не утечка.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

103. (L1, T) Что такое heap profiling?

     **Ответ:** Сбор allocation/free событий или samples с attribution к стеку для анализа heap usage и churn.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

104. (L1, T) Что такое stack memory vs heap memory?

     **Ответ:** Stack обычно хранит контекст вызовов и автоматические объекты; dynamic storage выделяется allocator. Размещение оптимизированных объектов может отличаться.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

105. (L1, T) Почему большое число аллокаций может быть проблемой даже без leak?

     **Ответ:** Каждое выделение несёт overhead, metadata и иногда contention/page faults, даже если память потом освобождена.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

106. (L1, T) Что такое fragmentation?

     **Ответ:** Неэффективное использование памяти из-за свободных промежутков, округлений размеров и удерживаемых частично занятых страниц.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

107. (L1, T) Что такое cache locality?

     **Ответ:** Переиспользование близких по времени или адресу данных, позволяющее эффективно использовать cache lines.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

108. (L1, T) Почему locality влияет на производительность?

     **Ответ:** Cache hit обычно существенно дешевле доступа к дальней памяти; locality уменьшает ожидание и трафик памяти.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

109. (L1, P) Какие признаки memory problem можно заметить без профайлера?

     **Ответ:** Рост RSS, page faults, swap, OOM, allocator CPU и latency; это симптомы для дальнейшего измерения.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

110. (L1, D) Почему рост RSS не всегда означает leak?

     **Ответ:** Allocator retention, caches, mappings и полезные данные могут увеличивать RSS без потерянных allocation.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L2

111. (L2, T) Что показывает heap profiler?

     **Ответ:** Текущие/пиковые объёмы, allocation counts и вызывающие стеки; конкретные метрики зависят от инструмента.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

112. (L2, D) Как понять, какие участки кода чаще всего аллоцируют память?

     **Ответ:** Снять allocation profile и отсортировать по count и bytes; горячая по числу функция не обязательно крупнейшая по объёму.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

113. (L2, D) Почему allocator может удерживать память после free?

     **Ответ:** Для повторного использования arenas и size classes; свободный блок не всегда позволяет освободить целую страницу ОС.

     **Источник:** [jemalloc manual: arenas and decay](https://jemalloc.net/jemalloc.3.html)

114. (L2, T) В чем разница virtual memory, RSS и working set?

     **Ответ:** Virtual memory — адресные mappings; RSS — резидентные страницы; working set — активно используемые данные на выбранном интервале.

     **Источник:** [proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

115. (L2, D) Как fragmentation ухудшает memory footprint?

     **Ответ:** Полезные байты занимают больше страниц из-за holes, alignment и округления size classes.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

116. (L2, D) Как fragmentation влияет на latency?

     **Ответ:** Увеличивает footprint, cache/TLB pressure и вероятность page faults; эффект зависит от allocator и workload.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

117. (L2, T) Что такое temporal locality?

     **Ответ:** Повторное обращение к недавно использованным данным, пока они ещё находятся в cache.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

118. (L2, T) Что такое spatial locality?

     **Ответ:** Обращение к соседним адресам, загруженным одной cache line или предвыбранным аппаратурой.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

119. (L2, D) Почему linked list часто хуже vector с точки зрения locality?

     **Ответ:** Узлы list часто разнесены и требуют зависимых pointer loads; vector обеспечивает последовательный компактный обход.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

120. (L2, P) Какие практические способы улучшить cache locality ты знаешь?

     **Ответ:** Плотные массивы, batching, hot/cold splitting, SoA для выборочных полей и порядок обхода по размещению данных.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L3

121. (L3, T) Как heap profiler собирает данные об аллокациях?

     **Ответ:** Через allocator hooks/interposition, встроенные профили или sampling; стеки и объём событий создают overhead.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

122. (L3, D) Как различить leak, churn и allocator retention?

     **Ответ:** Сравнить live bytes, allocation rate и RSS после спада нагрузки; retention требует статистики allocator, leak — анализа владельцев.

     **Пример:** После одинаковых циклов нагрузки:

     | Наблюдение | Проверяемая гипотеза |
     | --- | --- |
     | Live bytes растут и не возвращаются | Leak, неограниченный cache или очередь |
     | Allocation count велик, live bytes стабильны | Churn |
     | Live bytes падают, RSS остаётся | Retention/fragmentation либо другие mappings |

     **Типичная ошибка:** Делать вывод об утечке только по RSS.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

123. (L3, D) Почему большое число мелких аллокаций опасно для производительности?

     **Ответ:** Растут metadata, calls, fragmentation и lock/cache pressure; проверять стоимость на операцию.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

124. (L3, D) Как profiling помогает найти ненужные копирования и временные объекты?

     **Ответ:** Профиль показывает allocation stacks временных строк/контейнеров; CPU profile и inspection подтверждают копирующие пути.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

125. (L3, D) Как понять, что bottleneck связан с allocator contention?

     **Ответ:** Проверить wait stacks и CPU в allocator locks, затем сравнить шардирование или иной allocator при том же workload.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

126. (L3, T) Что такое NUMA и почему это важно для memory profiling?

     **Ответ:** Память NUMA-узлов имеет разную стоимость доступа для CPU; важны placement, first touch и миграции потоков.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

127. (L3, D) Как плохая locality проявляется в CPU profile?

     **Ответ:** Видны дорогие load-heavy пути и низкий IPC; нужны cache/TLB и memory latency events для подтверждения.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

128. (L3, D) Как layout данных влияет на cache misses?

     **Ответ:** Размер, порядок и группировка полей определяют число затронутых линий и полезных байтов на загрузку.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

129. (L3, D) Почему AoS vs SoA может радикально менять производительность?

     **Ответ:** SoA удобнее при проходе по отдельным полям и SIMD; AoS может быть лучше при использовании всех полей объекта.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

130. (L3, P) Как профилировать memory-heavy код в long-running service?

     **Ответ:** Использовать ограниченный sampling, snapshots и allocator metrics на репрезентативных фазах; измерить overhead и сохранить workload context.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L4

131. (L4, S) Как проектировать data structures с учетом locality?

     **Ответ:** Начать с паттернов доступа и размера working set, затем выбрать компактный layout и проверить benchmark на реальных размерах.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

132. (L4, S) Когда стоит внедрять custom allocator/pool allocator?

     **Ответ:** Когда измерены allocator overhead/fragmentation и понятны lifetime/size patterns; учитывать сложность освобождения и retained capacity.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

133. (L4, D) Как расследовать memory bloat в production без полного доступа к процессу?

     **Ответ:** Собирать RSS/PSS, mappings, allocator stats и workload; сравнить рост live data с кешами и очередями.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

134. (L4, S) Как встроить memory profiling в CI/performance lab?

     **Ответ:** Выделить сценарии steady-state и peak, фиксировать live/peak bytes и allocation rate; пороги проверять повторными запусками.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

135. (L4, S) Как отличать архитектурную memory problem от локального implementation bug?

     **Ответ:** Если растут обязательные копии, queues и caches — искать архитектуру; если утрачено освобождение конкретного объекта — ownership bug.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


### Heap Profiling

## L1

136. (L1, T) Что такое heap snapshot?

     **Ответ:** Снимок heap на выбранном этапе с размерами и attribution; данные о владельцах зависят от профилировщика.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

137. (L1, T) Что означает allocation hotspot?

     **Ответ:** Участок с большим allocation count или bytes; нужно явно выбрать метрику и интервал.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

138. (L1, P) Что полезно смотреть в heap profile в первую очередь?

     **Ответ:** Peak/live bytes, крупнейшие allocation stacks, count и динамику после нагрузки; затем retained memory allocator.

     **Пример:** Для отдельного лабораторного запуска:

     ```bash
     valgrind --tool=massif --massif-out-file=massif.out ./app input.dat
     ms_print massif.out
     ```

     Massif меняет скорость исполнения; timing этого запуска не используют как production latency.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html)

139. (L1, D) Почему один и тот же код может давать разные heap profile на разных входных данных?

     **Ответ:** Размеры и распределение входа меняют capacity, branches, caching и частоту временных объектов.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

140. (L1, T) Почему количество аллокаций и объем аллокаций — разные метрики?

     **Ответ:** Миллион мелких allocation и одна крупная имеют разную CPU-стоимость при одинаковом суммарном объёме.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L2

141. (L2, D) Как выявить функцию, которая делает лишние аллокации?

     **Ответ:** Сравнить allocation stacks/count на одну операцию и проверить ненужные temporaries, conversions и growth.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

142. (L2, D) Почему `std::string`/`std::vector` могут неожиданно аллоцировать часто?

     **Ответ:** Рост capacity, копирование и создание временных значений могут выделять память; SSO не гарантируется для всех строк.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

143. (L2, P) Как проверить гипотезу, что reserve/reuse уменьшит churn?

     **Ответ:** Снять count/bytes и latency до/после `reserve()` или reuse на одинаковой нагрузке; учесть увеличенный retained capacity.

     **Источник:** [C++ draft: vector capacity](https://eel.is/c++draft/vector.capacity)

144. (L2, D) Как heap profiling помогает в оптимизации latency-sensitive кода?

     **Ответ:** Позволяет убрать непредсказуемые allocation/reallocation из критического пути и измерить изменение хвостов latency.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

145. (L2, T) Почему allocator behavior зависит от паттернов освобождения памяти?

     **Ответ:** Size classes, порядок освобождения и lifetime определяют доступность reusable blocks и полностью свободных страниц.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L3

146. (L3, D) Как находить allocation hot path через combined CPU + memory profile?

     **Ответ:** Связать горячие allocator callers в CPU profile с count/bytes в heap profile на одном сценарии.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

147. (L3, D) Как отличить полезные аллокации от accidental allocations?

     **Ответ:** Полезные обеспечивают контракт и хранение результата; accidental возникают из лишних копий/преобразований и удаляются без смены семантики.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

148. (L3, S) Какие аллокации допустимы в hot path, а какие нет?

     **Ответ:** Допустимость задаёт latency budget и измерения; bounded заранее выделенная память часто предпочтительнее непредсказуемой аллокации.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

149. (L3, D) Как профилировать аллокации в многопоточной программе?

     **Ответ:** Нужен thread-aware profiler и корректные stacks; сравнивать local/cross-thread free и shared allocator contention.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

150. (L3, D) Почему heap profile без контекста workload может ввести в заблуждение?

     **Ответ:** Одинаковый footprint может быть нормой для большого входа и регрессией для малого; нужны units per request и фаза работы.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


### Fragmentation

## L1

151. (L1, T) Что такое external fragmentation?

     **Ответ:** Свободные блоки распределены так, что не подходят требуемому размещению или возврату страниц.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

152. (L1, T) Что такое internal fragmentation?

     **Ответ:** Выделенный блок больше полезного объекта из-за alignment, size-class rounding и metadata.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

153. (L1, D) Почему fragmentation может приводить к росту памяти без leak?

     **Ответ:** Небольшое число живых объектов может удерживать множество страниц с неиспользуемыми промежутками.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

154. (L1, T) Как размеры объектов влияют на fragmentation?

     **Ответ:** Разнообразие размеров и округления влияют на waste; одинаковые размеры часто проще переиспользовать в size classes.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

155. (L1, D) Почему долгоживущие и короткоживущие объекты вместе — риск для fragmentation?

     **Ответ:** Живые объекты мешают освободить страницы, на которых уже удалены короткоживущие соседи.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L2

156. (L2, D) Как заподозрить fragmentation по симптомам?

     **Ответ:** RSS остаётся большим при малом live heap; подтвердить allocator stats, исключив mappings и caches.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

157. (L2, D) Почему fragmentation опасна для сервисов с длительным uptime?

     **Ответ:** Разнообразные циклы нагрузки постепенно меняют распределение свободных блоков и удерживаемых страниц.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

158. (L2, T) Как allocator design влияет на fragmentation?

     **Ответ:** Size classes, arenas, coalescing и release policy определяют баланс reuse, contention и footprint.

     **Источник:** [jemalloc manual](https://jemalloc.net/jemalloc.3.html)

159. (L2, D) Как object pooling может помочь?

     **Ответ:** Объединяет одинаковые объекты и переиспользует storage; требует лимита и ясного lifetime.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

160. (L2, D) Когда pooling ухудшает ситуацию?

     **Ответ:** При завышенной capacity, неоднородных объектах, удержании peak memory и shared pool contention.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


## L3

161. (L3, D) Как отличить fragmentation от allocator caching?

     **Ответ:** Сравнить полезные, active и resident bytes средствами allocator; свободные целые страницы отличаются от дыр в занятых.

     **Источник:** [jemalloc manual: statistics](https://jemalloc.net/jemalloc.3.html)

162. (L3, D) Как fragmentation влияет на page faults и locality?

     **Ответ:** Разбрасывание живых объектов увеличивает число страниц/cache lines; faults зависят от резидентности, а не fragmentation автоматически.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

163. (L3, S) Какие архитектурные решения уменьшают fragmentation?

     **Ответ:** Разделение объектов по lifetime/size, bounded pools, компактные структуры и ограниченные caches.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

164. (L3, D) Как mixed-size allocations влияют на long-term footprint?

     **Ответ:** Чередование размеров и сроков жизни оставляет трудно переиспользуемые промежутки; эффект зависит от allocator.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

165. (L3, D) Как profiling подтвердит, что проблема именно во fragmentation?

     **Ответ:** Нужны allocator occupancy/fragmentation stats и live heap; один RSS-график не отличает fragmentation от retention.

     **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Linux: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)


### Cache Locality

## L1

166. (L1, T) Что такое CPU cache?

     **Ответ:** Небольшая быстрая память рядом с CPU, сохраняющая копии данных и инструкций из более медленных уровней.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

167. (L1, T) Какие уровни кэша обычно есть?

     **Ответ:** Обычно L1, L2 и L3/LLC; размеры, sharing и inclusive policy зависят от процессора.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

168. (L1, T) Что такое cache line?

     **Ответ:** Единица переноса и coherence cache, часто 64 байта, но размер платформенно зависим.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

169. (L1, T) Почему последовательный доступ обычно быстрее случайного?

     **Ответ:** Использует соседние байты линии и prefetch; случайный доступ чаще ждёт независимые cache/TLB misses.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

170. (L1, D) Почему pointer chasing часто медленный?

     **Ответ:** Адрес следующего узла зависит от предыдущей загрузки, ограничивая prefetch и memory-level parallelism.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L2

171. (L2, D) Как locality влияет на throughput?

     **Ответ:** Меньше memory stalls позволяет выполнить больше операций за время при том же CPU budget.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

172. (L2, D) Как locality влияет на latency?

     **Ответ:** Меньше cache/TLB misses сокращает обслуживание запроса; хвосты дополнительно зависят от очередей и scheduling.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

173. (L2, P) Какие структуры данных обычно лучше с точки зрения locality?

     **Ответ:** Компактные arrays/vector, flat containers и структуры с плотным hot data; выбор проверяют на реальном доступе.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

174. (L2, D) Почему `std::vector` часто быстрее `std::list`?

     **Ответ:** Последовательное размещение уменьшает pointer chasing и overhead узлов; преимущества list зависят от операций.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

175. (L2, D) Как data layout влияет на performance больше, чем микрооптимизации кода?

     **Ответ:** Layout меняет объём memory traffic и stalls, которые могут доминировать над стоимостью отдельных инструкций.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L3

176. (L3, T) Что такое cache-friendly algorithm?

     **Ответ:** Алгоритм, организующий доступ так, чтобы переиспользовать cache-resident данные: например blocked matrix traversal.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

177. (L3, D) Как профилировать cache misses?

     **Ответ:** Начать с `perf stat -e cache-references,cache-misses -- ./app`, затем использовать события конкретной PMU и профиль.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

178. (L3, D) Как false locality assumptions приводят к неправильным выводам?

     **Ответ:** Малый тест может полностью помещаться в cache, хотя production working set значительно больше; нужны разные размеры.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

179. (L3, D) Как branchy code и poor locality взаимно усиливают slowdown?

     **Ответ:** Непредсказуемые ветви нарушают pipeline, а зависимые misses мешают скрывать latency; степень эффекта измеряют.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

180. (L3, S) Когда нужно redesign data layout ради locality?

     **Ответ:** Когда подтверждён memory bottleneck и локальные изменения не обеспечивают цель; учитывать API, memory cost и сопровождение.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L4

181. (L4, S) Как обучать команду думать категориями data-oriented performance?

     **Ответ:** Обсуждать рабочие наборы, access patterns и ownership на примерах с измерениями, а не вводить универсальный запрет abstractions.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

182. (L4, D) Как доказать, что bottleneck именно в locality, а не в “медленном CPU”?

     **Ответ:** Сохранить CPU и workload, изменить только layout/access pattern и подтвердить снижение misses и времени.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

183. (L4, S) Как встроить locality review в code review/perf review процесс?

     **Ответ:** Для горячих структур проверять размер, stride, hot fields и concurrency; требовать измерения только для значимых путей.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

184. (L4, D) Как локально воспроизвести production locality problem?

     **Ответ:** Воспроизвести cardinality, skew, object sizes, NUMA placement и concurrency, а не только число запросов.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

185. (L4, S) Как принимать trade-off между readability/abstraction и locality?

     **Ответ:** Выделять специализированный hot path с понятным интерфейсом; принимать усложнение только при воспроизводимом полезном эффекте.

     **Источник:** [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


     ---

## 4.3 Benchmarking

## L1

186. (L1, T) Что такое benchmark?

     **Ответ:** Контролируемое выполнение заданной нагрузки с измерением выбранных показателей и зафиксированным окружением.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

187. (L1, T) Чем microbenchmark отличается от macrobenchmark?

     **Ответ:** Microbenchmark измеряет узкий компонент; macrobenchmark — взаимодействие подсистем на более полном сценарии.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

188. (L1, T) Когда microbenchmark полезен?

     **Ответ:** Для сравнения реализаций конкретной операции при реалистичных размерах и исключённых измерительных артефактах.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

189. (L1, T) Когда microbenchmark вводит в заблуждение?

     **Ответ:** При неверном working set, оптимизированном прочь коде, отсутствии contention или нерепрезентативном входе.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

190. (L1, T) Что важно фиксировать при измерении benchmark?

     **Ответ:** Commit, flags/toolchain, CPU/kernel, workload, warm-up, единицы метрики и число повторов.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

191. (L1, P) Почему нужно делать несколько прогонов?

     **Ответ:** Чтобы оценить вариативность и отличить устойчивое изменение от шума окружения.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

192. (L1, T) Что такое warm-up?

     **Ответ:** Фаза стабилизации caches, allocations и состояния приложения; cold-start измеряют отдельно, если он важен.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

193. (L1, D) Почему “один запуск” нельзя считать доказательством?

     **Ответ:** Единичный результат смешивает эффект кода с scheduling, frequency и случайным состоянием памяти.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

194. (L1, T) Что такое variance в измерениях?

     **Ответ:** Разброс результатов относительно среднего; распределение и выбросы важны для доверия к сравнению.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

195. (L1, D) Почему benchmark на ноутбуке может быть нестабилен?

     **Ответ:** Меняются питание, turbo, температура, фоновые процессы и размещение потоков.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)


## L2

196. (L2, T) Как оптимизации компилятора влияют на benchmark?

     **Ответ:** Inlining, vectorization и устранение кода меняют измеряемую работу; benchmark должен использовать production-like flags.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

197. (L2, D) Почему компилятор может “выкинуть” код из microbenchmark?

     **Ответ:** Если вычисление не имеет наблюдаемого результата, as-if rule позволяет удалить его полностью.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

198. (L2, P) Как предотвратить dead-code elimination в benchmark?

     **Ответ:** Использовать `benchmark::DoNotOptimize()` и при необходимости `ClobberMemory()`, затем проверить asm; volatile не универсальное решение.

     **Пример:** Фрагмент для Google Benchmark; вход готовится вне измеряемого цикла.

     ```cpp
     #include <benchmark/benchmark.h>
     #include <numeric>
     #include <vector>

     static void BM_Sum(benchmark::State& state) {
         std::vector<int> values(4096, 1);
         for (auto _ : state) {
             benchmark::DoNotOptimize(values.data());
             auto sum = std::accumulate(values.begin(), values.end(), 0LL);
             benchmark::DoNotOptimize(sum);
         }
     }
     BENCHMARK(BM_Sum);
     BENCHMARK_MAIN();
     ```

     Это warm-cache microbenchmark суммирования, а не модель всей системы. Даже с barriers необходимо проверить generated code.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

199. (L2, T) Почему `-O0` почти бесполезен для performance benchmark?

     **Ответ:** Он меняет layout, inlining и instruction count относительно production; полезен для отладки, но редко предсказывает release performance.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

200. (L2, D) Почему benchmark должен соответствовать реальному workload?

     **Ответ:** Иначе оптимизируется другая пропорция операций, размеров и ожиданий, чем у пользователей.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

201. (L2, T) Что важнее: latency, throughput или tail latency?

     **Ответ:** Зависит от SLO: интерактивному сервису важны хвосты, batch — throughput; следить за стоимостью и всеми ограничениями.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

202. (L2, P) Какие факторы окружения нужно стабилизировать перед benchmark?

     **Ответ:** CPU placement, governor/thermal state, фон, NUMA, вход, caches и версии окружения; фиксировать неизбежные различия.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

203. (L2, D) Как CPU frequency scaling ломает чистоту измерений?

     **Ответ:** Разная частота меняет elapsed time при том же коде; фиксировать режим питания и наблюдать throttling.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

204. (L2, D) Как IO и page cache могут испортить benchmark?

     **Ответ:** Warm page cache скрывает disk I/O, а конкурирующий I/O добавляет noise; явно определить cold/warm сценарий.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

205. (L2, P) Чем полезны percentile-метрики вместо одного среднего значения?

     **Ответ:** p95/p99 показывают хвосты, скрытые средним; нужны достаточная выборка и корректная методика нагрузки.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)


## L3

206. (L3, T) Как проектировать representative macrobenchmark?

     **Ответ:** Воспроизвести operation mix, размеры, concurrency, arrival pattern и SLO; сохранять seed и проверять correctness результата.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

207. (L3, D) Почему ускорение microbenchmark не гарантирует ускорение системы?

     **Ответ:** Компонент может занимать малую долю общего времени; bottleneck смещается или меняются взаимодействия.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

208. (L3, D) Как benchmark может поощрять “оптимизацию не того”?

     **Ответ:** Слишком узкий KPI поощряет улучшение synthetic path за счёт памяти, хвостов или реального workload.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

209. (L3, T) Что такое benchmark harness?

     **Ответ:** Обвязка запуска, прогрева, повторов и сбора результатов; сама обвязка не должна доминировать в измерении.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

210. (L3, P) Как сравнивать две версии алгоритма корректно?

     **Ответ:** Одинаковые inputs и flags, чередование A/B, независимые повторы, проверка результата и интервалы неопределённости.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

211. (L3, D) Как отличить signal от noise в benchmark results?

     **Ответ:** Оценить baseline variance и повторяемость эффекта; случайный порядок запусков снижает влияние дрейфа машины.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

212. (L3, D) Как понять, что разница 3% реальна, а не статистический шум?

     **Ответ:** Нужны достаточные независимые повторы и интервал оценки разницы уже 3%; одного среднего недостаточно.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

213. (L3, T) Как работать с regression benchmark suite?

     **Ответ:** Хранить representative cases и baseline, отслеживать тренды, периодически убирать нерепрезентативные или нестабильные тесты.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

214. (L3, S) Как автоматизировать performance regression testing?

     **Ответ:** Выделенный runner, сохранение metadata/raw results, пороги относительно noise и повторная проверка перед блокировкой изменения.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

215. (L3, D) Как связывать benchmark-результаты с профилировщиком, а не гадать по цифрам?

     **Ответ:** Профилировать тот же scenario/build и проверить, что исчезла ожидаемая работа, а не поменялось окружение.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)


## L4

216. (L4, S) Как строить benchmarking culture в C/C++ команде?

     **Ответ:** Требовать гипотезу, baseline, воспроизводимый эксперимент и review эффекта; сохранять удачные и отвергнутые результаты.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

217. (L4, S) Как выбрать KPI для performance regression gates?

     **Ответ:** Выбирать пользовательские SLO и cost per operation; counters применять как диагностику, а не универсальный gate.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

218. (L4, D) Как расследовать “benchmark improved, production worsened”?

     **Ответ:** Сравнить workload, tail latency, contention, memory footprint и compiler flags; проверить, не изменён ли алгоритмический контракт.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

219. (L4, S) Как проектировать lab environment для достоверных benchmark'ов?

     **Ответ:** Контролировать железо, thermal state, CPU/NUMA placement, фон и software image; хранить калибровочные baseline runs.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)

220. (L4, S) Как совмещать synthetic benchmarks и production traces?

     **Ответ:** Traces задают распределения synthetic нагрузки; synthetic cases изолируют гипотезы, replay проверяет реалистичность эффекта.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md)


### Влияние оптимизаций компилятора

## L1

221. (L1, T) Почему один и тот же код на `-O0` и `-O3` ведет себя по-разному по скорости?

     **Ответ:** Оптимизации устраняют лишнюю работу, меняют inlining, register allocation и SIMD; UB может менять и поведение программы.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

222. (L1, T) Что оптимизатор обычно делает с простыми циклами?

     **Ответ:** Может выполнять unrolling, vectorization, constant folding и вынос инвариантов, если это сохраняет допустимое поведение.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

223. (L1, D) Почему benchmark без оптимизаций почти бесполезен?

     **Ответ:** Он часто измеряет debug overhead вместо production path; сравнивать нужно релевантные сборки.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

224. (L1, T) Как inline влияет на benchmark?

     **Ответ:** Убирает call overhead и открывает межфункциональные оптимизации, но может увеличить code size и i-cache pressure.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

225. (L1, D) Почему small function call overhead может исчезнуть после оптимизации?

     **Ответ:** Inlining или устранение вызова оставляет только полезные инструкции либо полностью удаляет ненаблюдаемое вычисление.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)


## L2

226. (L2, T) Что такое vectorization и как она влияет на benchmark?

     **Ответ:** SIMD выполняет несколько операций над элементами одной инструкцией; эффект зависит от данных, alignment и memory bandwidth.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

227. (L2, D) Почему `-march=native` может резко изменить результаты?

     **Ответ:** Разрешает инструкции и tuning текущего CPU; такой бинарник может не работать на более старой машине.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

228. (L2, D) Как UB может сделать benchmark “быстрым, но бессмысленным”?

     **Ответ:** Оптимизатор предполагает отсутствие UB и может убрать проверки/циклы; сначала проверяют корректность и sanitizers.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

229. (L2, P) Как проверить, что оптимизатор не упростил benchmark до константы?

     **Ответ:** Посмотреть `objdump -d -C ./bench` или compiler output; результат должен зависеть от runtime input и потребляться harness.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

230. (L2, D) Почему release benchmark нужно сопровождать inspection generated code?

     **Ответ:** Asm подтверждает, что измеряется нужная работа и ожидаемая оптимизация действительно применена.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)


## L3

231. (L3, D) Как интерпретировать benchmark, если разные компиляторы дают разный результат?

     **Ответ:** Сравнить flags, targets и generated code; результат относится к конкретной комбинации compiler/workload, не к языку вообще.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

232. (L3, D) Почему PGO/LTO могут улучшить одни benchmark'и и ухудшить другие?

     **Ответ:** Меняют inlining, layout и branch decisions; тренировочный профиль и code-size trade-offs подходят не всем сценариям.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

233. (L3, S) Как выбирать стандартный набор compile flags для perf lab?

     **Ответ:** Определить supported deployment CPU и production baseline; экспериментальные flags тестировать отдельно, сохраняя correctness checks.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

234. (L3, D) Как доказывать, что улучшение связано с кодом, а не с изменением flags/toolchain?

     **Ответ:** Провести A/B с одним toolchain и flags, затем отдельный эксперимент смены окружения.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

235. (L3, D) Когда необходимо смотреть asm, а не только benchmark numbers?

     **Ответ:** Когда подозреваются DCE, vectorization, missed inline, UB или неожиданная разница между компиляторами.

     **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)


### False Sharing

## L1

236. (L1, T) Что такое false sharing?

     **Ответ:** Потоки изменяют независимые объекты одной cache line, вызывая ненужный coherence traffic.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

237. (L1, T) Как false sharing связан с cache line?

     **Ответ:** Coherence работает линиями, поэтому независимость переменных на уровне C++ не означает независимость cache traffic.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

238. (L1, D) Почему независимые переменные в разных потоках могут мешать друг другу?

     **Ответ:** Запись требует владения общей линией и может инвалидировать копию у другого CPU.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

239. (L1, T) Почему false sharing особенно важен в многопоточном C++ коде?

     **Ответ:** Per-thread counters и queues часто расположены рядом и активно записываются разными ядрами.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

240. (L1, P) Какие симптомы могут указывать на false sharing?

     **Ответ:** Плохое масштабирование, высокая coherence activity и улучшение при разнесении hot writable fields.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)


## L2

241. (L2, D) Как false sharing проявляется в benchmark'ах?

     **Ответ:** С ростом потоков независимые updates замедляются; контроль с разделёнными cache lines помогает подтвердить причину.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

242. (L2, D) Почему throughput может резко падать при росте числа потоков?

     **Ответ:** Возможны coherence, locks, bandwidth и oversubscription; false sharing — лишь одна из проверяемых гипотез.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

243. (L2, P) Как padding помогает бороться с false sharing?

     **Ответ:** Разносит независимо изменяемые данные по линиям; нужны корректные alignment и размер/stride элементов массива.

     **Пример:** C++17, если standard library предоставляет interference constants:

     ```cpp
     #include <atomic>
     #include <new>

     struct alignas(std::hardware_destructive_interference_size) Slot {
         std::atomic<unsigned long long> count{0};
     };
     // Slot slots[N]: alignment делает stride кратным выбранному alignment.
     ```

     Константа implementation-defined; она не обещает оптимального layout для каждого deployment CPU. При сравнении binary layout нельзя бездумно менять compiler tuning flags.

     **Источник:** [C++ draft: hardware interference size](https://eel.is/c++draft/hardware.interference); [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

244. (L2, T) Почему array of counters — типичный источник false sharing?

     **Ответ:** Соседние counters попадают в одну линию, хотя каждый поток пишет только свой элемент.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

245. (L2, D) Как отличить false sharing от lock contention?

     **Ответ:** Смотреть blocking stacks и line contention; эксперимент с layout при неизменных locks отделяет гипотезы.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)


## L3

246. (L3, D) Как подтвердить false sharing через perf counters и benchmark?

     **Ответ:** Использовать `perf c2c` при поддержке PMU и сравнить aligned layout; HITM само по себе не отличает true sharing.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

247. (L3, S) Как проектировать per-thread data structures, чтобы избежать false sharing?

     **Ответ:** Выделять cache-aligned slots с достаточным stride и агрегировать результаты вне hot path; проверять фактический layout.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

248. (L3, D) Почему false sharing может появиться после “безобидного” рефакторинга?

     **Ответ:** Перестановка полей или новый allocator может разместить ранее разнесённые writable данные в одной линии.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

249. (L3, D) Как NUMA и false sharing вместе ухудшают performance?

     **Ответ:** Ownership линии перемещается между узлами, добавляя межсокетную latency к coherence traffic.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

250. (L3, S) Когда padding оправдан, а когда это лишний расход памяти?

     **Ответ:** Когда доказан выигрыш на горячих writes; учитывать увеличение footprint и ухудшение locality при чтении.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)


## L4

251. (L4, S) Как встроить проверку false sharing risks в performance review?

     **Ответ:** Проверять writers, field placement и array stride у горячих shared структур; измерять сомнительные случаи.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

252. (L4, D) Как расследовать production slowdown, вызванный cache-line contention?

     **Ответ:** Собрать topology, affinity, c2c/PMU samples и адреса lines; сопоставить с полями и проверить layout change.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

253. (L4, S) Какие шаблоны многопоточного дизайна минимизируют false sharing?

     **Ответ:** Per-thread accumulation, sharding, ownership partitioning и batching сокращают совместные writes.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

254. (L4, D) Как сочетать benchmarking, profiling и code inspection для доказательства false sharing?

     **Ответ:** Benchmark доказывает эффект, profile локализует линии, inspection показывает независимые поля и подтверждает false sharing.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)

255. (L4, S) Как обучать команду видеть false sharing на уровне структуры данных, а не только профиля?

     **Ответ:** Рисовать линии с размещёнными полями и назначенными writers; проверять расчёт sizeof/alignment и реальными измерениями.

     **Источник:** [perf c2c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation/perf-c2c.txt)


     ---

# 10. Practical / Real-world Scenarios

## L2

256. (L2, D) CPU usage высокий, но throughput низкий: какие основные гипотезы проверишь?

     **Ответ:** Проверить busy loops, spin contention, cache misses, лишнюю работу и CPU quota; связать CPU profile с throughput.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

257. (L2, D) После оптимизации алгоритма benchmark улучшился, а система — нет. Почему?

     **Ответ:** Ускоренный участок не был системным bottleneck либо эффект скрыли I/O, очередь и contention.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

258. (L2, D) `perf` показывает hotspot в allocator/STL: как двигаться дальше?

     **Ответ:** Найти прикладных callers и count/bytes; уменьшать лишние объекты и рост контейнеров до замены allocator.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

259. (L2, D) Программа делает много мелких аллокаций: как проверить, что это bottleneck?

     **Ответ:** Измерить allocation rate, CPU/wait cost, затем bounded reuse/reserve эксперимент с тем же контрактом.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

260. (L2, D) С ростом потоков производительность перестала масштабироваться: как расследовать?

     **Ответ:** Проверить locks, CPU quota, oversubscription, bandwidth, NUMA и false sharing; строить scaling curve.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L3

261. (L3, D) Flamegraph показывает глубокий стек абстракций, но ни одна функция не выглядит “очевидно плохой”: что это значит?

     **Ответ:** Стоимость может быть распределена между множеством layers; искать повторную работу, conversions и частоту проходов.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

262. (L3, D) После перехода на новый компилятор benchmark изменился на 7%: как проверить, реальна ли разница?

     **Ответ:** Пересобрать обе версии с согласованными flags, чередовать повторы и сравнить asm, variance и system KPIs.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

263. (L3, D) Есть подозрение на плохую locality данных: какой минимальный план расследования?

     **Ответ:** Снять baseline/cache events, проверить working set и stride, изменить layout изолированно и сравнить время/misses.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

264. (L3, D) Производительность плавает между прогонами без изменений кода: какие источники нестабильности проверишь?

     **Ответ:** Питание/температуру, фон, scheduler affinity, NUMA, caches, inputs, ASLR и virtualized host contention.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

265. (L3, D) `perf stat` показывает много cache-misses и stalled cycles: какие инженерные выводы можно делать, а какие пока нельзя?

     **Ответ:** Есть признаки stalls и misses, но пока не доказаны причина и полезность layout change; нужны attribution и эксперимент.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


## L4

266. (L4, S) Как построить performance engineering process для C/C++ сервиса под Linux?

     **Ответ:** Определить SLO/budgets, representative workloads, регулярные baselines и расследование регрессий с владельцами и артефактами.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

267. (L4, S) Какие артефакты должны прикладываться к performance regression issue?

     **Ответ:** Commit/build IDs, hardware/software, flags, workload, raw runs, profiles, метрики и минимальная команда воспроизведения.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

268. (L4, S) Как стандартизировать benchmark-практику между командами?

     **Ответ:** Общий harness и metadata schema, классы workload и правила сравнения; сохранять специфику продукта.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

269. (L4, S) Как уменьшить число ложных performance regression alarms?

     **Ответ:** Стабилизировать окружение, учитывать variance, требовать повторное подтверждение и различать предупреждение и blocking threshold.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)

270. (L4, S) Как формализовать правило: “сначала измерь, потом оптимизируй, потом докажи эффект”?

     **Ответ:** В review прикладывать baseline → гипотезу → изменение → повторный эксперимент с correctness и оценкой side effects.

     **Источник:** [Google Benchmark: User Guide](https://github.com/google/benchmark/blob/main/docs/user_guide.md); [perf tools documentation](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/tools/perf/Documentation)


     ---
