# Performance Testing

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 6. Performance Testing

1. (L1 [T]) Что такое performance testing и какие задачи оно решает?

   **Ответ:** Оценивает скорость, capacity и resource use под заданными conditions; цель — проверить performance requirements, saturation и recovery.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

2. (L1 [T]) В чем разница между load testing, stress testing и spike testing?

   **Ответ:** Load моделирует ожидаемую нагрузку, stress ищет пределы, spike проверяет резкий рост. Soak исследует длительность и накопление state.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

3. (L1 [T]) Какие метрики используются для оценки производительности (latency, throughput, error rate)?

   **Ответ:** Latency distribution, successful throughput, errors/timeouts, saturation и queues; определять numerator/denominator, units и измерительный boundary.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

4. (L1 [T]) Что такое SLA, SLO и SLI в контексте производительности?

   **Ответ:** SLI — измеряемый показатель, SLO — целевой уровень, SLA — соглашение с последствиями нарушения. Нагрузочный тест проверяет только выбранные conditions.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

5. (L1 [T]) Почему функционально корректная система может не выдерживать нагрузку?

   **Ответ:** Contention, очереди, memory footprint и capacity dependencies растут с concurrency; корректность одного запроса не гарантирует bounded latency под нагрузкой.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)


6. (L2 [P]) Как определить целевые сценарии для нагрузочного тестирования?

   **Ответ:** Выбрать важные journeys и дорогие paths по usage/risk, затем зафиксировать mix, sizes, arrival rate и критерии успеха/восстановления.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

7. (L2 [P]) Как моделировать реальную нагрузку (пользователи, запросы, профили трафика)?

   **Ответ:** Разделить arrival-rate и fixed-concurrency models, учесть think time, bursts, cardinality и warm/cold caches. Closed model может снизить offered load при замедлении сервиса.

   **Пример:** При closed model фиксированы 100 users: если response стал в 10 раз медленнее, они могут посылать меньше запросов. Arrival-rate model продолжает задавать целевое поступление и выявляет queue growth. Проверять также dropped iterations и capacity generator.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

8. (L2 [P]) Какие инструменты используются для performance testing (JMeter, k6, wrk, locust)?

   **Ответ:** JMeter — сценарии разных протоколов, k6 — scriptable load, wrk — HTTP load, Locust — Python user behavior; protocol support сверять по версии и plugins.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

9. (L2 [P]) Как тестировать производительность C++ backend-сервисов (HTTP/gRPC)?

   **Ответ:** Генерировать traffic через реальный HTTP/gRPC interface, сохранять release flags/limits и representative dataset; CPU microbenchmark не заменяет service load test.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

10. (L2 [P]) Как измерять latency (p50, p95, p99) и почему это важно?

    **Ответ:** Строить histogram полного request latency, включая failed/timeouts согласно метрике; для p99/p999 нужен достаточный sample count и корректное объединение distributions.

    **Типичная ошибка:** Усреднять p99 разных workers. Для общего percentile нужны совместимые histogram buckets или объединение наблюдений; среднее percentile не равно percentile всей выборки.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

11. (L2 [P]) Как подготовить тестовое окружение, приближенное к production?

    **Ответ:** Сопоставить CPU/memory limits, topology, data size, dependency latency и software versions; неизбежные отличия документировать, а не объявлять environment равным production.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

12. (L2 [P]) Как собирать и анализировать метрики во время теста?

    **Ответ:** Коррелировать load-generator timestamps с service resources, queues, errors и traces; наблюдать также saturation самого generator.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

13. (L2 [P]) Как выявлять деградацию производительности при увеличении нагрузки?

    **Ответ:** Ступенчато увеличивать offered load, отмечать knee latency и saturation; сравнивать achieved throughput и ошибки на каждой ступени.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

14. (L2 [P]) Как интегрировать performance-тесты в CI/CD?

    **Ответ:** Короткий regression benchmark на controlled runner, долгий representative load по расписанию/release; thresholds должны учитывать baseline variance.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

15. (L2 [T]) Какие ограничения есть у синтетических нагрузочных тестов?

    **Ответ:** Synthetic traffic может не отражать correlations, skew, реальный dataset и user behavior; результат ограничен объявленным workload.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)


16. (L3 [D]) Как находить bottlenecks в системе (CPU, memory, I/O, network)?

    **Ответ:** Сопоставить CPU samples, memory pressure, I/O latency и network/queue saturation; менять один фактор для подтверждения гипотезы.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

17. (L3 [D]) Как диагностировать рост latency и tail latency (p99/p999)?

    **Ответ:** Разделить queue/service time, проверить GC/allocator, locks, page faults, throttling и медленные dependencies; среднее скрывает редкие stalls.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

18. (L3 [P]) Как профилировать C++ приложение (perf, gprof, flame graphs)?

    **Ответ:** Собрать symbols для optimized artifact, снять perf samples/call graphs и counters; flamegraph агрегирует стеки, не временную последовательность.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

19. (L3 [P]) Как анализировать contention, lock-и и проблемы многопоточности?

    **Ответ:** Измерить wait/hold durations и blocked stacks, построить scaling curve; TSan проверяет data races в отдельной build, не performance baseline.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

20. (L3 [D]) Как выявлять memory leaks и неэффективное использование памяти под нагрузкой?

    **Ответ:** Смотреть live heap/allocations и RSS во времени при стабильном workload; retention/fragmentation отличать от leak по allocator stats и ownership.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

21. (L3 [P]) Как тестировать поведение системы при деградации зависимостей (БД, внешние API)?

    **Ответ:** Контролируемо увеличить latency/error rate dependency, проверить timeout budgets, retry amplification, backpressure и recovery после восстановления.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

22. (L3 [D]) Как интерпретировать результаты нагрузочных тестов и отличить реальную проблему от артефактов теста?

    **Ответ:** Сверить inputs, environment и generator capacity, повторить baseline/candidate в случайном порядке; исключить network/harness bottleneck и warmup effects.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

23. (L3 [P]) Как тестировать autoscaling и поведение системы при горизонтальном масштабировании?

    **Ответ:** Проверить trigger metric, provisioning delay, warmup, распределение traffic и поведение scale-in; дополнительные replicas не устраняют shared DB bottleneck.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

24. (L3 [D]) Как анализировать влияние конфигурации (thread pool, connection pool, кеши) на производительность?

    **Ответ:** Менять pool/cache settings изолированно, измерять queues, memory и tail latency; большой pool может ухудшить contention и overload dependencies.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

25. (L3 [P]) Как тестировать устойчивость системы при длительной нагрузке (soak testing)?

    **Ответ:** Длительный representative steady-state с мониторингом memory/fd/queues и periodic checks; после нагрузки проверить drain/recovery и retained resources.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)


26. (L4 [S]) Как выстроить стратегию performance testing для высоконагруженной C++-системы?

    **Ответ:** Performance SLO и budgets по критичным flows, representative workloads, dedicated baselines и release canary; назначить владельцев regression triage.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

27. (L4 [S]) Как определить performance budget и контролировать его соблюдение?

    **Ответ:** Распределить end-to-end latency/resource cost по участкам, учесть queues/retries и резерв; проверять budgets измерениями при нужной нагрузке.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

28. (L4 [S]) Как встроить performance testing в lifecycle продукта (shift-left / shift-right)?

    **Ответ:** Ранние component benchmarks дополнять integration load tests и production telemetry; реальные incidents обновляют workload corpus.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

29. (L4 [S]) Как связать performance testing с observability (метрики, логи, трейсы)?

    **Ответ:** Помечать run/release ID, собирать correlated metrics/traces и bounded profiles; telemetry overhead учитывать в сравнении.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

30. (L4 [S]) Как принимать архитектурные решения на основе результатов performance-тестов?

    **Ответ:** Сначала подтвердить bottleneck и полезный эффект prototype на SLO/cost, затем сравнить complexity, reliability и operational trade-offs.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

31. (L4 [S]) Как масштабировать нагрузочное тестирование в организации (несколько команд, сервисов)?

    **Ответ:** Общий harness/metadata/reporting, reusable workload contracts и owned service scenarios; capacity лаборатории и reproducibility тоже требуют owners.

    **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)
