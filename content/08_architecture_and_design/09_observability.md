# 🔍 9. Observability (наблюдаемость)

Senior уровень без этого не проходит.

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

**Подтемы:**

* Logging
* Metrics
* Tracing
* Alerting

---

1. (L1 [T]) Что такое observability?

   **Ответ:** Возможность понимать внутреннее состояние и поведение системы по её внешним сигналам. Требует полезной инструментализации и способности расследовать новые вопросы, а не только наличия dashboard.

   **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/)

2. (L1 [T]) Чем observability отличается от monitoring?

   **Ответ:** Monitoring отслеживает выбранные показатели и известные условия, observability помогает исследовать причины и неизвестные сценарии. Практически они дополняют друг друга.

   **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

3. (L1 [T]) Что такое логирование (logging)?

   **Ответ:** Регистрация событий приложения и окружения с временем, уровнем и контекстом. Логи полезны для деталей отдельного события и аудита, но требуют контроля объёма и чувствительных данных.

   **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/)

4. (L1 [T]) Что такое метрики (metrics)?

   **Ответ:** Числовые измерения состояния или активности с временем и набором атрибутов. Удобны для агрегирования, трендов, SLO и алертов.

   **Источник:** [Prometheus: Metric types](https://prometheus.io/docs/concepts/metric_types/)

5. (L1 [T]) Что такое tracing?

   **Ответ:** Представление исполнения операции в виде связанных spans, включая переходы между процессами. Помогает понять критический путь и причинные связи.

   **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

6. (L1 [T]) Что такое alerting?

   **Ответ:** Автоматическое уведомление о состоянии, требующем реакции. Для действенного alert нужны владелец, приоритет, контекст и runbook.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

7. (L1 [T]) Что такое лог-сообщение?

   **Ответ:** Запись об одном событии с полями timestamp, severity, message и контекстом запроса/сервиса. Важно различать время события и время приёма системой сбора.

   **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/)

8. (L1 [T]) Что такое таймсерия (time series)?

   **Ответ:** Последовательность значений одной метрики для фиксированного набора labels во времени. Новая комбинация labels создаёт новую серию.

   **Пример:** http_requests_total{method="GET", status="200"}.

   **Источник:** [Prometheus: Metric types](https://prometheus.io/docs/concepts/metric_types/)

9. (L1 [T]) Что такое trace/span?

   **Ответ:** Trace объединяет spans одной распределённой операции; span описывает её участок со start/end, parent, атрибутами и событиями. Асинхронные связи могут выражаться links.

   **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

10. (L1 [T]) Что такое latency метрика?

    **Ответ:** Измерение времени операции с ясно заданной границей. Обычно нужно распределение и доля запросов быстрее порога, а не одно среднее значение.

    **Источник:** [Prometheus: Metric types](https://prometheus.io/docs/concepts/metric_types/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


---

11. (L2 [T]) Какие типы метрик существуют (counter, gauge, histogram)?

    **Ответ:** Counter монотонно растёт до reset, gauge может расти и падать, histogram агрегирует наблюдения по buckets/распределению. Summary имеет иную семантику квантилей и агрегирования.

    **Пример:** Счётчик запросов, gauge in-flight, histogram длительности.

    **Источник:** [Prometheus: Metric types](https://prometheus.io/docs/concepts/metric_types/)

12. (L2 [P]) Как выбрать метрики для сервиса?

    **Ответ:** Начать с пользовательских SLIs, затем RED для запросов и USE для ресурсов. Добавить очереди, pool saturation и свежесть; избегать labels с неограниченной кардинальностью.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)

13. (L2 [T]) Что такое structured logging?

    **Ответ:** Логирование в машиночитаемом формате с устойчивой схемой полей. Упрощает фильтрацию и корреляцию по service, event, trace_id и error code.

    **Пример:** JSON с event="payment_declined", trace_id и безопасным кодом причины.

    **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/)

14. (L2 [P]) Как писать полезные логи?

    **Ответ:** Писать значимые события с причиной и идентификатором операции, придерживаться уровней и единиц времени. Исключить токены/пароли и лишние персональные данные, контролировать sampling и volume.

    **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

15. (L2 [T]) Что такое correlation ID?

    **Ответ:** Идентификатор, связывающий записи одной операции в разных компонентах. Он не заменяет полноценную иерархию spans и не должен использоваться как доверенная identity.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

16. (L2 [P]) Как трассировать запрос через несколько сервисов?

    **Ответ:** Инструментировать вход, клиентские вызовы и очереди, передавать context через стандартные headers/metadata. Для асинхронных задач сохранять причинную связь и соблюдать trust boundary.

    **Пример:** W3C traceparent передаёт trace ID и родительский span.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

17. (L2 [T]) Что такое distributed tracing?

    **Ответ:** Tracing, охватывающий несколько процессов или сервисов в одном контексте операции. Зависит от передачи context, синхронизации времени и корректной инструментализации.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

18. (L2 [P]) Как работает tracing система (например Jaeger)?

    **Ответ:** SDK создаёт spans и передаёт их collector, backend сохраняет и индексирует, UI показывает trace. Политики sampling, лимиты и сбои exporter влияют на полноту.

    **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/); [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/)

19. (L2 [T]) Что такое sampling в tracing?

    **Ответ:** Выбор части traces для записи/хранения. Head sampling решает в начале, tail sampling — после получения информации о trace, что требует буферизации и маршрутизации.

    **Источник:** [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/)

20. (L2 [P]) Как выбрать sampling rate?

    **Ответ:** Исходить из QPS, стоимости и нужной вероятности увидеть редкие ошибки. Сохранять больше ошибок/медленных операций, учитывать skew и ограничения tail sampling.

    **Типичная ошибка:** Считать sampled traces точным счётчиком всех запросов.

    **Источник:** [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/)

21. (L2 [T]) Что такое alert threshold?

    **Ответ:** Условие срабатывания alert: числовой порог, окно и дополнительные ограничения. Статический CPU threshold часто менее полезен, чем сигнал пользовательского ущерба.

    **Источник:** [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

22. (L2 [P]) Как настраивать алерты?

    **Ответ:** Опираться на SLO burn rate, указывать владельца и runbook, настроить окна, dedup и маршрутизацию. Проверить доставку и полезность сигнала на реальных или учебных инцидентах.

    **Источник:** [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

23. (L2 [T]) Что такое noisy alerts?

    **Ответ:** Частые или недейственные сигналы: дубли, flapping, низкий приоритет без действий. Они отнимают внимание и ухудшают реакцию на важные отказы.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

24. (L2 [P]) Как уменьшить alert fatigue?

    **Ответ:** Удалить алерты без действия, сгруппировать дубли, добавить окна/гистерезис и направить предупреждения в менее срочный канал. Регулярно анализировать precision и пропущенные инциденты.

    **Источник:** [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

25. (L2 [T]) Что такое dashboard?

    **Ответ:** Набор визуализаций для конкретной задачи или аудитории. Хороший dashboard показывает пользовательское качество, нагрузку, насыщение и контекст релизов с переходом к расследованию.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


---

26. (L3 [D]) Почему система “зелёная”, но пользователи жалуются?

    **Ответ:** Health checks и средние метрики могут не покрывать проблемный регион, tenant или пользовательский сценарий. Проверить client-side SLI, ошибки, p99, свежесть и synthetic probes.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

27. (L3 [D]) Как найти root cause по логам?

    **Ответ:** Начать с конкретной неуспешной операции и trace/correlation ID, собрать цепочку событий и временную линию. Проверять гипотезы метриками и изменениями конфигурации: совпадение во времени не доказывает причинность.

    **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

28. (L3 [D]) Почему метрики не отражают реальность?

    **Ответ:** Ошибки instrumentation, потеря scrape/export, неверные единицы, агрегации, reset counters или исключённый трафик. Сверить с независимым источником и проверить отсутствие данных отдельно от нулевого значения.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)

29. (L3 [D]) Как диагностировать рост latency?

    **Ответ:** Разбить latency на очередь, локальную работу и зависимости, сравнить histogram по маршрутам/регионам. Проверить saturation, locks, GC, retries, холодные соединения и последние изменения.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

30. (L3 [T]) Что такое RED метод (Rate, Errors, Duration)?

    **Ответ:** Rate — частота операций, Errors — ошибки, Duration — длительность. Метод полезен для сервисов с запросами, особенно при одинаковых labels и ясной границе измерения.

    **Источник:** [Grafana: RED Method](https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/)

31. (L3 [T]) Что такое USE метод (Utilization, Saturation, Errors)?

    **Ответ:** Для каждого ресурса измерять Utilization, Saturation и Errors: занятость, ожидание сверх доступной ёмкости и ошибки. Высокая utilization без очереди не всегда означает проблему.

    **Пример:** CPU utilization, run queue length, аппаратные/системные ошибки.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

32. (L3 [P]) Как анализировать distributed trace?

    **Ответ:** Найти медленный критический путь, учесть перекрытие параллельных spans и gaps. Проверить retries, fan-out и метаданные, затем подтвердить bottleneck профилированием/метриками.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

33. (L3 [D]) Почему пропадают логи?

    **Ответ:** Буферы переполнены, агент падает до flush, ротация опережает чтение, сеть недоступна или действует sampling/drop policy. Измерить created/accepted/exported/dropped и проверить disk queue.

    **Источник:** [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/)

34. (L3 [P]) Как обеспечить надёжную доставку логов?

    **Ответ:** Устойчивый буфер, ack/retry с backpressure и ограничением диска, checkpoints чтения и replay. At-least-once доставка допускает дубли, поэтому нужны event IDs и понятная политика при переполнении.

    **Источник:** [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/)

35. (L3 [D]) Почему алерты приходят слишком поздно?

    **Ответ:** Длинные окна/for, редкий scrape, задержка ingest, неверный порог или проблема notification pipeline. Разделить время возникновения, обнаружения, вычисления правила и доставки.

    **Источник:** [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

36. (L3 [P]) Как настроить early warning систему?

    **Ответ:** Комбинировать быстрый/медленный burn rate с предупреждением о saturation и прогнозом исчерпания ресурсов. Проверить ложные срабатывания; любой ранний сигнал должен вести к конкретному действию.

    **Источник:** [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

37. (L3 [T]) Что такое high-cardinality метрики?

    **Ответ:** Метрики с большим числом комбинаций labels. user_id, request_id и произвольный URL могут создавать практически неограниченное число серий и перегружать backend.

    **Типичная ошибка:** Использовать полный URL с динамическими ID вместо шаблона маршрута.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)

38. (L3 [D]) Почему monitoring система сама становится bottleneck?

    **Ответ:** Чрезмерная кардинальность, объём логов, тяжёлые запросы и неограниченные exporter queues конкурируют с приложением. Измерить overhead и ввести quotas, batching, sampling и изоляцию.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/)


---

39. (L4 [S]) Как построить observability платформу с нуля?

    **Ответ:** Определить пользователей платформы, SLO, сигналы и retention; внедрить единые SDK/context и collector pipeline. Затем хранение, поиск, алерты, доступы, стоимость и собственная наблюдаемость платформы.

    **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/); [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/)

40. (L4 [S]) Как балансировать стоимость хранения логов и метрик?

    **Ответ:** Назначить retention по ценности и требованиям, агрегировать старые метрики, применять sampling и tiered storage. Ограничивать объём по командам без потери критичных SLI и аудита.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/)

41. (L4 [S]) Как проектировать observability для микросервисов?

    **Ответ:** Стандартные service/resource attributes, propagation и semantic conventions, централизованные collectors и локальные владельцы instrumentation. Нужны квоты, schema governance и переходы metrics → traces → logs.

    **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

42. (L4 [S]) Какие сигналы критичны для high-load системы?

    **Ответ:** Пользовательские success/latency/freshness, RED и saturation CPU/I/O/пулов, queue age, retries и per-shard skew. Выбор подтверждать failure model, не собирать всё без цели.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

43. (L4 [S]) Как проектировать SLO-driven monitoring?

    **Ответ:** Начать с good/eligible events и error budget; dashboard и multi-window burn alerts строить вокруг него. Ресурсные метрики использовать для объяснения причин и предупреждения насыщения.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

44. (L4 [S]) Как связать observability с incident response?

    **Ответ:** Alert должен открывать нужные dashboard/traces и runbook, показывать owner и последние изменения. Incident timeline и postmortem возвращают найденные пробелы в instrumentation и правила.

    **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/)

45. (L4 [S]) Как минимизировать MTTR (mean time to recovery)?

    **Ответ:** Улучшить обнаружение пользовательского ущерба, доступность контекста, ясность командования и безопасные способы mitigation. Измерять этапы восстановления, проводить учения и выполнять действия postmortem.

    **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/)

46. (L4 [S]) Как проектировать scalable logging pipeline?

    **Ответ:** Агенты → bounded durable buffers → брокер/collectors → partitioned storage/indexes с backpressure. Учесть bursts, multitenancy, redaction, replay, дедупликацию и наблюдаемость потерь.

    **Источник:** [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)
