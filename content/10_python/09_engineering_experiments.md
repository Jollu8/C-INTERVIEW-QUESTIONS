# Автоматизация и воспроизводимые эксперименты

Этап 9 основного маршрута Python для системного разработчика.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Какие параметры запуска C++ benchmark нужно сохранить вместе с его результатом?

   **Ответ:** Revision/build artifact hash, точная команда/параметры, input hash/size/seed, threads/affinity и hardware/OS/toolchain/library versions. Вместе хранить status/exit code, единицы, timestamps и границы измерения.

   **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

2. Почему elapsed time одного запуска недостаточно для вывода об устойчивом ускорении?

   **Ответ:** Один запуск не отделяет эффект от warmup, scheduler, frequency scaling и шума. Нужны повторения, распределение/неопределённость и контроль совпадения workload/correctness.

   **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

3. Чем throughput отличается от latency и почему единицы измерения должны быть явными?

   **Ответ:** Throughput — завершённые операции/bytes за интервал, latency — длительность одной операции с заданными start/end. Учитывать offered/completed/error rates отдельно, не выдавать batch elapsed за индивидуальный p99.

   **Источник:** [Python 3.14: library/time.html](https://docs.python.org/3.14/library/time.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

4. Чем среднее значение отличается от медианы и перцентиля p99?

   **Ответ:** Среднее чувствительно к большим значениям, median — 50-й percentile, p99 — хвост по выбранному quantile method. При малом числе наблюдений p99 нестабилен и почти отражает крайние элементы.

   **Источник:** [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html)

5. Зачем отдельно учитывать warm-up и измеряемую часть эксперимента?

   **Ответ:** Warmup прогревает caches/JIT/native init/allocator и может менять состояние. Если важен cold start, его измеряют отдельно; прогрев не должен скрывать real startup cost end-to-end scenario.

   **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

6. Почему данные результата удобно отделять от диагностических логов?

   **Ответ:** Машинные данные имеют schema/units/status, логи — diagnostic free text в stderr/artifacts. Такое разделение предотвращает поломку parser от warning/traceback и сохраняет ошибки отдельно от успешных измерений.

   **Источник:** [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html); [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html)

7. Какие задачи Python может выполнять в pipeline сборки, запуска и анализа C++ программы?

   **Ответ:** Python управляет build/process lifecycle, матрицей inputs, collection/validation и analysis/plots. Тяжёлый kernel остаётся в подходящем native/GPU path; оркестратор сам может стать bottleneck и требует измерения overhead.

   **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/profile.html](https://docs.python.org/3.14/library/profile.html)

8. Зачем фиксировать seed генератора случайных данных и какие источники недетерминизма это не устраняет?

   **Ответ:** Seed воспроизводит конкретный RNG stream при известных algorithm/version, но не thread scheduling, nondeterministic reductions, clock, input order и hardware. Сохранять generator/configuration и реальные input hashes.

   **Источник:** [Python 3.14: library/random.html](https://docs.python.org/3.14/library/random.html)

## Средний уровень — применение

9. Как автоматизировать серию запусков для нескольких размеров данных и не смешать разные конфигурации в одном наборе результатов?

   **Ответ:** Создать explicit matrix и unique run ID/directory на case/repetition, записывать полный config/status в каждую row. Анализ группирует только сопоставимые configuration keys, failed runs не смешивает с numerical zeros.

   **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

10. Какие версии ОС, Python, compiler, flags и native-библиотек нужно включить в metadata эксперимента?

    **Ответ:** Python version/build/GIL mode, OS/kernel/arch, CPU/GPU/driver, compiler/linker/flags, BLAS/CUDA/native extensions и resolved packages. Сохранить фактические значения, а не только desired requirements.

    **Источник:** [Python 3.14: library/sys.html](https://docs.python.org/3.14/library/sys.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/); [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/)

11. Как CPU frequency scaling, фоновые процессы и привязка к ядрам могут исказить сравнение?

    **Ответ:** Turbo/thermal throttling, соседние jobs и CPU migration меняют clocks/cache/NUMA. Записать/контролировать power/affinity и порядок runs; pinning полезен только при корректной locality и одинаковой policy для сравнения.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

12. Как отличить неудавшийся запуск от корректного результата со значением ноль?

    **Ответ:** Явный status success/error/timeout/start_failed и optional metric только при valid measurement. 0 допускается как реальный результат с единицами, отсутствие — null/отдельный error record, никогда silent conversion.

    **Источник:** [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

13. Как выбирать число повторений и показывать разброс вместо единственного лучшего времени?

    **Ответ:** Выбрать число независимых runs по нужной precision/budget, показать все relevant observations и spread/interval. Best-only timing пригоден для отдельных lower-bound microbenchmarks, но не универсального вывода о typical latency.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/); [SciPy: Bootstrap confidence intervals](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html)

14. Как построить latency histogram и какие детали расчёта квантилей нужно документировать?

    **Ответ:** Сохранить boundaries/unit/count и quantile method/interpolation, отдельно count/NaN/error policy. Histogram buckets должны покрывать хвост; процентили из грубых buckets имеют ограниченную точность.

    **Источник:** [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

15. Как сравнить baseline и изменение, если входные данные и условия выполнения могут дрейфовать?

    **Ответ:** Чередовать/randomize baseline/changed blocks, повторять paired одинаковые inputs, фиксировать environment и сравнивать как effect size, так и variability. Изменение correctness/workload запрещает считать ratio чистым ускорением.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/); [SciPy: Bootstrap confidence intervals](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html)

16. Почему нельзя объединять p99 нескольких запусков простым усреднением и что хранить для последующего анализа?

    **Ответ:** Quantile нелинеен: среднее p99 не равно p99 pooled observations. Хранить raw samples либо mergeable histogram/sketch с указанной точностью и count/weights; также можно отдельно сообщать distribution run-level p99.

    **Источник:** [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html)

17. Как ограничить число одновременно запускаемых benchmark, чтобы они не искажали друг другу результаты?

    **Ответ:** Bounded worker pool/admission и отдельные directories, не запускать более одного CPU-intensive benchmark, если нужна изолированная скорость. Лимит учитывать вместе с внутренними BLAS/OpenMP/GPU workloads.

    **Источник:** [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

18. Как организовать схему JSON/CSV отчёта так, чтобы сохранялась обратная совместимость анализатора?

    **Ответ:** Versioned schema, explicit field types/units/status, stable IDs и defaults для новых optional fields. Analyzer проверяет required invariants/unknown version, regression fixtures содержат старые отчёты и error records.

    **Источник:** [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html); [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html)

## Сложный уровень — ограничения и проектирование

19. Как отличить статистическую неопределённость измерения от практически несущественного эффекта оптимизации?

    **Ответ:** Заранее задать practically relevant threshold и оценивать uncertainty effect, а не только наличие статистической значимости. Большая выборка делает крошечный эффект significant; широкий interval не доказывает отсутствие полезного ускорения.

    **Рекомендация:** Заранее определить практически значимый эффект и единицу независимого наблюдения.

    **Источник:** [SciPy: Bootstrap confidence intervals](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

20. Какие предпосылки независимости наблюдений нужно проверить перед построением доверительного интервала?

    **Ответ:** Проверить зависимости samples внутри run/queue/time series, drift и shared input/randomness. Resample на уровне независимых runs/блоков или применять подходящую dependent-data методику; iid bootstrap по коррелированным samples даёт ложную precision.

    **Источник:** [SciPy: Bootstrap confidence intervals](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html)

21. Как исключать выбросы по заранее заданной политике, не подбирая правило под желаемый вывод?

    **Ответ:** До эксперимента объявить criteria исключения и сохранить excluded records/reasons вместе с полной выборкой. Задержки, являющиеся частью реального workload/SLO, нельзя удалить только ради красивого p99.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

22. Как разделить стоимость старта процесса, чтения данных, вычисления и записи результата в end-to-end измерении?

    **Ответ:** Monotonic timestamps на start/process/init/input/compute/output/exit; для kernels также native/device timer. Показать end-to-end и стадии без двойного суммирования overlapping operations, оценить instrumentation overhead.

    **Источник:** [Python 3.14: library/time.html](https://docs.python.org/3.14/library/time.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

23. Как сравнить CPU и GPU pipeline с учётом transfers, синхронизации и проверки численной точности?

    **Ответ:** Одинаковые inputs/output tolerance, dtype и workload; GPU measurement ждёт completion через events/sync. Отдельно H2D/kernel/D2H/setup и полный pipeline, warmup/context init сохраняются отдельными сценариями.

    **Источник:** [CuPy: Performance best practices](https://docs.cupy.dev/en/stable/user_guide/performance.html); [NumPy: allclose](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html)

24. Какие ограничения у жёсткого performance threshold в CI на разделяемом runner и как изменить стратегию проверки?

    **Ответ:** Shared runner имеет шум/neighbors/разное железо; жёсткий процент даёт flakes. CI проверяет correctness и крупные regressions с repeats/uncertainty, строгие performance gates — на контролируемом runner с baseline history.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

25. Как воспроизвести регрессию на другой машине и какие различия окружения могут сделать сравнение некорректным?

    **Ответ:** Передать revision/build instructions/artifact+input hashes+commands/env metadata/raw results. Сравнивать относительные изменения внутри каждой машины, отмечать CPU ISA, compiler, clocks, BLAS/thread counts и GPU differences.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/); [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/)

## Разбор кода

26. Почему такое измерение плохо подходит для вывода о скорости функции и как улучшить эксперимент?

   **Условие:**

   ```python
   import time

   start = time.time()
   result = sum(range(1000))
   print(time.time() - start)
   ```

    **Ответ:** Time.time — wall clock, короткая операция измерена один раз с noise/warmup и без полезного распределения. Использовать perf_counter/timeit/pyperf, проверить output, подобрать repeats/loops и отдельно указать setup.

    **Источник:** [Python 3.14: library/time.html](https://docs.python.org/3.14/library/time.html); [Python 3.14: library/timeit.html](https://docs.python.org/3.14/library/timeit.html)

27. Почему вычисленное ускорение не описывает типичное поведение запусков?

   **Условие:**

   ```python
   baseline = [10.0, 11.0, 12.0]
   changed = [1.0, 20.0, 30.0]
   print(min(baseline) / min(changed))
   ```

    **Ответ:** Ratio min/min равен 10, но median times 11 и 20 показывают другое typical поведение. Минимумы из разных нестабильных samples не доказывают ускорение; показать распределения, paired workload и uncertainty.

    **Источник:** [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html); [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/)

28. Как потеряется информация о сбое запуска и почему это нельзя хранить как нормальный результат?

   **Условие:**

   ```python
   def measure(run):
       try:
           return run()
       except Exception:
           return 0.0
   ```

    **Ответ:** Любое исключение превращается в 0.0 и выглядит фантастически быстрым success. Вернуть structured failure либо propagate, сохраняя error/exit/timeout и safe metadata; metric отсутствует при failure.

    **Пример:**

    ```python
    def measure(run):
        try:
            return {"status": "ok", "value": run(), "error_type": None}
        except Exception as exc:
            return {"status": "error", "value": None, "error_type": type(exc).__name__}

    assert measure(lambda: 0.0)["status"] == "ok"
    assert measure(lambda: 1 / 0)["value"] is None
    ```

    **Типичная ошибка:** Считать failed run корректным измерением с duration=0.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

29. Почему имя результата создаёт гонку и как безопасно разделить артефакты нескольких запусков?

   **Условие:**

   ```python
   from concurrent.futures import ThreadPoolExecutor
   from pathlib import Path

   def save(value):
       Path("result.json").write_text(str(value))

   with ThreadPoolExecutor() as pool:
       list(pool.map(save, range(4)))
   ```

    **Ответ:** Workers одновременно truncate/write одно имя, итог недетерминирован и может быть corrupted. Unique run paths/files, atomic publish завершённого result и единый collector; atomic replace общим именем всё равно теряет предыдущие результаты.

    **Источник:** [Python 3.14: library/tempfile.html](https://docs.python.org/3.14/library/tempfile.html); [Python 3.14: library/os.html](https://docs.python.org/3.14/library/os.html); [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html)

30. Почему усреднение готовых перцентилей не даёт перцентиль объединённой выборки?

   **Условие:**

   ```python
   p99_by_run = [10.0, 100.0]
   print(sum(p99_by_run) / len(p99_by_run))
   ```

    **Ответ:** 55.0 — лишь average двух reported p99, не pooled quantile. Без исходных samples/counts/distributions восстановить pooled p99 нельзя; использовать raw data/mergeable histogram или явно run-level статистику.

    **Источник:** [Python 3.14: library/statistics.html](https://docs.python.org/3.14/library/statistics.html)

## Практические задачи

31. Как написать runner C++ benchmark с матрицей параметров, timeout, отдельными артефактами и сохранением неуспешных запусков?

    **Ответ:** Matrix+run IDs, bounded executor и subprocess with timeout, stdout/stderr в отдельные bounded artifacts. Status сохранять при каждом исходе, cleanup/reap process tree по policy; manifest включает commands/env/input hashes.

    **Источник:** [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [Python 3.14: library/concurrent.futures.html](https://docs.python.org/3.14/library/concurrent.futures.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

32. Как построить отчёт baseline/changed с распределением времени, числом наблюдений, единицами и явно указанной методикой сравнения?

    **Ответ:** Проверить schema и сопоставимость configurations, показать sample/run counts, units, medians/percentiles/spread и effect interval выбранным методом. Сохранить raw data и failures, не усреднять готовые p99.

    **Источник:** [pyperf: Benchmarking](https://pyperf.readthedocs.io/en/latest/); [SciPy: Bootstrap confidence intervals](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html)

33. Как собрать latency/throughput отчёт обработки LTE/NR-подобного потока с параметрами нагрузки и размером очередей?

    **Ответ:** Записать packet/batch size, arrival/service rates, queue capacity/age/drop, processing stages и единицы. End-to-end latency мерить на единичных элементах/заявленных batches, report содержит offered/completed/error rates и нагрузочный profile.

    **Источник:** [Python 3.14: library/time.html](https://docs.python.org/3.14/library/time.html); [Python 3.14: library/json.html](https://docs.python.org/3.14/library/json.html)

34. Как организовать повторяемый эксперимент CPU versus GPU с проверкой результата и раздельным учётом копирования данных?

    **Ответ:** Повторить один input/seed для CPU/GPU, валидировать output с declared tolerance. Device events+sync покрывают kernel, отдельный wall timer покрывает transfers/setup/end-to-end; фиксировать warm/cold, dtype/layout и versions/threads.

    **Источник:** [CuPy: Performance best practices](https://docs.cupy.dev/en/stable/user_guide/performance.html); [NumPy: allclose](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html)

35. Как подготовить минимальный воспроизводимый набор для регрессии: revision, команда сборки, вход, окружение и последовательность запусков?

    **Ответ:** Минимальный script/config/input с hashes, точные build/run commands и revision, compiler/OS/hardware/deps, expected invariant и failing raw results. Проверить воспроизведение из чистого каталога без скрытых локальных файлов.

    **Источник:** [pip: Repeatable installs](https://pip.pypa.io/en/stable/topics/repeatable-installs/); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html)

## Что прочитать

- [Python: timeit](https://docs.python.org/3.14/library/timeit.html)
- [Python: statistics](https://docs.python.org/3.14/library/statistics.html)
- [Python: perf_counter](https://docs.python.org/3.14/library/time.html#time.perf_counter)
- [Python: subprocess](https://docs.python.org/3.14/library/subprocess.html)

[← Предыдущая тема](./08_cpp_integration.md) · [План раздела](./README.md) · [Следующая тема →](./10_backend_optional.md)
