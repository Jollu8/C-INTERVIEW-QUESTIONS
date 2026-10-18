# Observability & Monitoring

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 17. Observability & Monitoring

1. (L1 [T]) Что такое observability и чем она отличается от monitoring?

   **Ответ:** Monitoring отслеживает выбранные signals и conditions; observability позволяет исследовать внутреннее поведение по outputs, включая заранее не предусмотренные вопросы.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

2. (L1 [T]) Какие три основных сигнала observability используются чаще всего?

   **Ответ:** Logs, metrics и traces — распространённые signals; profiles и events тоже могут быть полезны. Наличие трёх storage tools само по себе не создаёт observability.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

3. (L1 [T]) Что такое логи, метрики и трассировка?

   **Ответ:** Logs — записи событий, metrics — агрегированные числовые series, traces — связанные spans конкретного выполнения. Их контекст/время нужно согласовать.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

4. (L1 [T]) Зачем observability нужна в тестировании и эксплуатации систем?

   **Ответ:** Помогает объяснить test/production failure, связать symptoms с dependencies и проверить восстановление, а не только увидеть красный status.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

5. (L1 [T]) Почему одной только метрики uptime недостаточно для понимания состояния системы?

   **Ответ:** Процесс может быть up, но отвечать медленно, неверно или только части users; нужны user-visible SLIs и error/latency breakdown.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


6. (L2 [P]) Как использовать логи для анализа поведения приложения?

   **Ответ:** По request/trace ID восстановить transitions и earliest error, учитывать version/config и timestamps; отсутствие log не доказывает отсутствие события.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

7. (L2 [P]) Как проектировать полезные application logs для backend/C++ сервиса?

   **Ответ:** Structured fields: timestamp, severity, event name, service/version, operation, trace/request ID и error details; избегать secrets и unbounded message dumps.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

8. (L2 [P]) Какие метрики важно собирать у сервиса (latency, throughput, error rate, resource usage)?

   **Ответ:** Requests/rate, errors/timeouts, latency distribution и saturation/queue depth; memory/fd/thread pressure особенно полезны для C++ service lifecycle.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

9. (L2 [T]) Что такое distributed tracing и какие задачи он решает?

   **Ответ:** Trace объединяет spans операции между процессами через propagated context; показывает dependencies и timing, но sampling может пропустить событие.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

10. (L2 [P]) Как использовать трассировку для анализа запросов между сервисами?

    **Ответ:** Найти trace по request ID, определить critical path и failed/slow spans, сопоставить с logs/queues; суммы overlapping spans не равны end-to-end duration.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

11. (L2 [T]) Какие инструменты используются для observability и monitoring (Prometheus, Grafana, OpenTelemetry)?

    **Ответ:** Prometheus собирает/запрашивает metrics, Grafana визуализирует data sources, OpenTelemetry стандартизирует instrumentation/collection/export; backend storage выбирается отдельно.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

12. (L2 [P]) Как строить dashboards для сервиса или системы?

    **Ответ:** От user outcomes к rate/errors/latency/saturation, затем breakdown по bounded dimensions; показывать единицы, windows и release annotations.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

13. (L2 [P]) Как настраивать alerts, чтобы они были полезными и не создавали alert fatigue?

    **Ответ:** Actionable symptoms и SLO burn-rate windows, подходящие severity/routing и runbooks; noisy threshold без действия лучше пересмотреть.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

14. (L2 [P]) Как связывать логи, метрики и трейсы между собой?

    **Ответ:** Trace/span IDs в logs, exemplars для отдельных metric observations и единые service/version attributes; request IDs не использовать как metric labels.

    **Пример:**

    ```json
    {"event":"dependency_timeout","service":"orders","version":"build-42","trace_id":"example-trace","operation":"reserve","duration_ms":200}
    ```

    Значения идентификаторов условные. Trace ID хранится в event/trace context; добавление уникального ID в Prometheus metric label создаст неограниченную cardinality.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

15. (L2 [P]) Как внедрять observability в C++ приложения и сервисы?

    **Ответ:** OpenTelemetry C++ SDK или совместимая instrumentation, context propagation через async boundaries и bounded exporters; supported signals/version сверять по SDK.

    **Источник:** [OpenTelemetry C++](https://opentelemetry.io/docs/languages/cpp/)

16. (L2 [P]) Как использовать monitoring в performance и integration тестах?

    **Ответ:** Маркировать test run, смотреть service/dependency metrics и traces на том же интервале; monitoring overhead и test traffic isolation учитывать явно.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


17. (L3 [D]) Как диагностировать инцидент, используя логи, метрики и трассировку вместе?

    **Ответ:** Начать с affected user SLI и timeline, найти service/trace boundary, затем logs и resource changes; подтверждать hypothesis эксперимента, а не одной корреляцией.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

18. (L3 [D]) Как выявлять root cause деградации производительности по telemetry-данным?

    **Ответ:** Разделить queue/service/dependency time, проверить saturation, deployments и data changes; trace показывает где задержка, а причина может требовать profile.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

19. (L3 [P]) Как расследовать intermittent/flaky проблемы с помощью observability?

    **Ответ:** Correlation IDs, retained first-failure context, sampling с учётом errors и повторяемые seeds; intrusive logs могут менять timing race.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

20. (L3 [D]) Как интерпретировать рост ошибок без явного роста нагрузки?

    **Ответ:** Возможны dependency/config change, expired credentials/certificates, data skew и resource exhaustion; смотреть denominator и breakdown, не только общий request rate.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

21. (L3 [P]) Как строить SLI/SLO на основе метрик и реального поведения системы?

    **Ответ:** SLI отражает успешный пользовательский outcome с ясным numerator/denominator/window; SLO — target, согласованный с risk и user need.

    **Пример:** SLI успеха = good eligible requests / all eligible requests за определённое window. Ошибки/timeouts входят в denominator по утверждённым правилам; исключение всех failures искусственно улучшит показатель.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

22. (L3 [D]) Как находить bottlenecks в распределённой системе по traces и metrics?

    **Ответ:** Critical-path spans вместе с queue/resource metrics локализуют candidate bottleneck; shared dependency saturation может объяснять slow spans разных services.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

23. (L3 [P]) Как проектировать structured logging для удобства анализа?

    **Ответ:** Стабильные machine-readable event fields, typed IDs, units и error codes; high-volume events sampling/level policy, sensitive values redacted до export.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

24. (L3 [D]) Как бороться с шумом: избыточными логами, некачественными метриками и ложными алертами?

    **Ответ:** Удалить duplicate/unactionable events, ограничить cardinality, нормализовать alerts и retention по полезности; не подавлять symptoms без owner review.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

25. (L3 [P]) Как использовать observability для валидации релизов и canary deployment?

    **Ответ:** Сравнивать canary/control на comparable traffic с error/latency/correctness guardrails; small samples и mix difference ограничивают уверенность.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

26. (L3 [D]) Как анализировать корреляцию между проблемами приложения и инфраструктурными метриками?

    **Ответ:** Сопоставить timestamps/config/deploy и CPU/memory/network/cgroup limits, проверить counterfactual; совместный spike не доказывает causal link.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


27. (L4 [S]) Как выстроить observability strategy для крупной инженерной организации?

    **Ответ:** Общие semantic conventions/context/ownership и self-service instrumentation, локальные SLO по продукту и budget контроля telemetry cost.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

28. (L4 [S]) Как определить минимально необходимый набор telemetry для новых сервисов?

    **Ответ:** Service/build identity, request/error/latency metrics, structured failure logs, health/readiness и trace propagation по critical paths.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

29. (L4 [S]) Как стандартизировать логи, метрики и трейсы между командами?

    **Ответ:** Versioned schemas/semantic conventions, bounded label taxonomy, consistent units и compatibility rollout; cardinality rules проверяют на реальном traffic.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

30. (L4 [S]) Как встроить observability в CI/CD, incident response и quality engineering процессы?

    **Ответ:** Run/commit/deploy annotations связывают stages и runtime evidence; incidents и regression tests улучшают instrumentation requirements.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

31. (L4 [S]) Как балансировать глубину наблюдаемости и стоимость хранения/обработки telemetry?

    **Ответ:** Sampling/aggregation, bounded attributes, разные retention tiers и cost metrics; критичные failure signals должны переживать overload exporters.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

32. (L4 [S]) Как использовать observability как основу для engineering decision-making и reliability strategy?

    **Ответ:** Telemetry поддерживает проверяемые hypotheses, SLO/capacity decisions и validation fixes; не подменяет business reasoning и не превращает correlation в доказательство.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
