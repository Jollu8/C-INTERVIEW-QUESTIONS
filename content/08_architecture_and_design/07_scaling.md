# 📈 7. Масштабирование

Отдельный блок, хотя пересекается с другими.

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

* Horizontal scaling
* Auto-scaling
* Load balancing algorithms
* Hot partitions

---

1. (L1 [T]) Что такое масштабирование?

   **Ответ:** Изменение ресурсов или структуры системы для обслуживания большего объёма работы при заданных SLO. Рост числа серверов без роста полезного throughput не означает успешного масштабирования.

   **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

2. (L1 [T]) Что такое horizontal scaling?

   **Ответ:** Добавление экземпляров/узлов с распределением работы. Требует разбиваемой нагрузки и отсутствия единого нерасширяемого bottleneck.

   **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

3. (L1 [T]) Что такое vertical scaling?

   **Ответ:** Увеличение CPU, RAM, I/O или сети одного узла. Проще организационно, но имеет аппаратные пределы и может требовать перезапуска.

   **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

4. (L1 [T]) Что такое load balancing?

   **Ответ:** Распределение запросов, соединений или задач между исполнителями с учётом алгоритма и здоровья.

   **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

5. (L1 [T]) Что такое нода (node)?

   **Ответ:** Отдельный участник системы: сервер, VM, процесс или иной экземпляр в контексте конкретного кластера. Разные nodes могут разделять один failure domain.

   **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

6. (L1 [T]) Что такое кластер?

   **Ответ:** Группа взаимодействующих узлов, совместно предоставляющих сервис. Само объединение в кластер не гарантирует отказоустойчивость.

   **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

7. (L1 [T]) Что такое partition?

   **Ответ:** Логическая часть набора данных или потока. Partition key определяет распределение и границы порядка/локальности.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

8. (L1 [T]) Что такое hot partition?

   **Ответ:** Раздел, чья нагрузка существенно превышает остальные. Причиной бывает популярный ключ, неудачная схема partitioning или неодинаковые ресурсы узлов.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


---

9. (L2 [T]) В чём разница horizontal vs vertical scaling?

   **Ответ:** Horizontal добавляет исполнителей, vertical увеличивает мощность исполнителя. Первое требует распределения состояния, второе проще, но ограничено максимальным размером узла.

   **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

10. (L2 [P]) Когда использовать horizontal scaling?

    **Ответ:** Когда работа делится между независимыми экземплярами и нужен рост сверх одного узла либо устойчивость к его отказу. Сначала проверить зависимость от общей БД и внешних API.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

11. (L2 [P]) Когда vertical scaling лучше?

    **Ответ:** Если узкое место локально, больший узел решает задачу дешевле распределения, а допустимая доступность обеспечена. Полезно для начала и компонентов с дорогой координацией.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

12. (L2 [T]) Какие бывают алгоритмы балансировки нагрузки?

    **Ответ:** Round-robin, weighted round-robin, least connections/requests, random, power of two choices и consistent/rendezvous hashing. Проверять соответствие числа соединений реальной стоимости работы.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

13. (L2 [T]) Что такое round-robin?

    **Ответ:** Циклическая выдача следующему узлу. При равных весах каждый получает примерно одинаковое число назначений, но не обязательно одинаковую вычислительную нагрузку.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

14. (L2 [T]) Что такое least connections?

    **Ответ:** Выбирает узел с наименьшим числом открытых соединений; подходит для неодинаковой длительности сессий. Multiplexed HTTP/2 и разные веса запросов могут искажать оценку.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

15. (L2 [T]) Что такое consistent hashing?

    **Ответ:** Стабильное отображение ключей в владельцев, при котором изменение состава переносит часть ключей. Виртуальные узлы улучшают баланс ёмкости, но не лечат один hot key.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

16. (L2 [P]) Как работает consistent hashing при добавлении ноды?

    **Ответ:** Новый токен получает часть диапазона прежнего владельца; остальные диапазоны сохраняются. Данные копируют с учётом конкурентных изменений, после чего обновляют маршрутизацию.

    **Пример:** На кольце новый токен 50 забирает ключи между предыдущим токеном и 50.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

17. (L2 [T]) Что такое auto-scaling?

    **Ответ:** Автоматическое изменение числа или размера ресурсов по метрикам, расписанию или прогнозу. Управление включает задержки измерения, запуска, прогрева и безопасного scale-in.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

18. (L2 [P]) Какие метрики использовать для auto-scaling?

    **Ответ:** Метрики, связанные с потребной ёмкостью: CPU при CPU-bound, in-flight, queue age, QPS на replica. Ошибки и p99 полезны как ограничения, но сами по себе могут давать нестабильный feedback.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

19. (L2 [T]) Что такое reactive vs predictive scaling?

    **Ответ:** Reactive реагирует на наблюдаемую нагрузку, predictive заранее выделяет ресурсы по прогнозу или расписанию. Обычно их сочетают с минимальным запасом и ограничениями.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

20. (L2 [P]) Как масштабировать stateless сервис?

    **Ответ:** Добавлять готовые replicas за LB, задавать readiness, resource requests и graceful drain. Проверять общие пулы БД и поведение при массовом холодном старте.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/); [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

21. (L2 [P]) Как масштабировать stateful сервис?

    **Ответ:** Выделить владение partition, реплики и протокол переноса; добавление узла включает rebalance и восстановление состояния. Для консенсусных групп quorum и membership меняют безопасно.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)

22. (L2 [T]) Что такое hotspot в системе?

    **Ответ:** Локализованное насыщение ресурса или ключа при наличии свободной ёмкости в других частях. Hotspot может быть в shard, lock, очереди или сетевом endpoint.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

23. (L2 [P]) Как избежать hot partitions?

    **Ответ:** Выбирать ключ с достаточной кардинальностью и распределением, применять subpartitioning и salting там, где это допустимо. Отдельно обрабатывать сверхпопулярные сущности и монотонные записи.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


---

24. (L3 [D]) Почему система не масштабируется линейно?

    **Ответ:** Последовательная часть, координация, общая БД, сеть и распределение нагрузки ограничивают прирост. Измерить throughput/SLO при фиксированном workload и числе узлов, затем найти насыщаемый ресурс.

    **Источник:** [Gene Amdahl: Validity of the single processor approach](https://doi.org/10.1145/1465482.1465560); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

25. (L3 [D]) Где возникает bottleneck при масштабировании?

    **Ответ:** По очередям, wait time и utilization определить ресурс, ограничивающий полезную скорость. Проверить leader, общий lock, storage, broker и downstream; увеличение frontend может лишь усилить давление.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

26. (L3 [D]) Почему растёт latency при добавлении нод?

    **Ответ:** Rebalance, cold cache, рост соединений к БД, новая межузловая коммуникация и skew. Сравнить latency до/во время/после добавления, ресурсные метрики и traces.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/); [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

27. (L3 [T]) Что такое Amdahl’s Law?

    **Ответ:** Ускорение при параллелизме ограничено последовательной долей: S(N) = 1 / (s + (1−s)/N), если накладные расходы не учитываются. При N → ∞ предел равен 1/s.

    **Пример:** При s=0,1 теоретический предел ускорения — 10 раз.

    **Источник:** [Gene Amdahl: Validity of the single processor approach](https://doi.org/10.1145/1465482.1465560)

28. (L3 [T]) Что такое tail latency?

    **Ответ:** Задержки медленной части распределения, например p99/p99.9. При fan-out общий запрос часто ждёт самого медленного участника, поэтому хвост важен даже при хорошем среднем.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/)

29. (L3 [D]) Как диагностировать uneven load distribution?

    **Ответ:** Сравнить QPS, active requests, CPU, latency и распределение ключей по экземплярам. Проверить sticky sessions, долгие соединения, веса, locality и неполное обновление discovery.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

30. (L3 [P]) Как перераспределить нагрузку между нодами?

    **Ответ:** Обновить веса/маршруты, ограничить горячие tenants, выполнить drain и перенос partitions. Переносить постепенно с лимитом, контролируя p99 и нагрузку на источник/приёмник.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

31. (L3 [D]) Почему auto-scaling не успевает за нагрузкой?

    **Ответ:** Метрики запаздывают, threshold слишком высокий, образ медленно стартует или нет свободных узлов/квоты. Измерить весь путь detect → schedule → ready → warm.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

32. (L3 [P]) Как настроить auto-scaling thresholds?

    **Ответ:** Определить безопасную нагрузку на replica и время реакции; задать запас, разные правила scale-out/scale-in и stabilization window. Проверить burst и защиту от колебаний на нагрузочном тесте.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

33. (L3 [T]) Что такое overprovisioning?

    **Ответ:** Заранее выделенный запас сверх обычной потребности. Покрывает всплески и отказы, но повышает стоимость; объём выбирают по SLO и времени пополнения.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

34. (L3 [D]) Как обнаружить hot shard / partition?

    **Ответ:** Смотреть показатели per-partition и top keys: QPS, bytes, lag, latency и waits. Высокий общий CPU не доказывает hot shard, а низкий общий CPU его не исключает.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

35. (L3 [P]) Как перераспределить ключи при hot partition?

    **Ответ:** Множество ключей — split/move partition; один ключ — разделение логического агрегата, кэширование или отдельный владелец. Изменить routing с версией, migration и совместимостью читающих путей.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

36. (L3 [T]) Что такое load shedding?

    **Ответ:** Контролируемое отклонение части работы при нехватке ресурсов, чтобы сохранить полезную обработку. Лучше отказать до дорогого вычисления, чем удерживать заведомо просроченные запросы.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

37. (L3 [P]) Как реализовать graceful degradation?

    **Ответ:** Выключать необязательные функции, отдавать допустимые stale результаты и сохранять критичные операции в выделенных лимитах. Деградация должна быть понятна клиенту и не нарушать финансовые/безопасностные инварианты.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)


---

38. (L4 [S]) Как проектировать систему с линейным масштабированием?

    **Ответ:** Разделить данные и работу с минимумом cross-partition координации, исключить общие locks и глобальные лимитирующие ресурсы. Линейность проверять на рабочем наборе и нужном SLO, задав целевой диапазон масштаба.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Gene Amdahl: Validity of the single processor approach](https://doi.org/10.1145/1465482.1465560)

39. (L4 [S]) Когда horizontal scaling не работает?

    **Ответ:** Если доминируют последовательная работа, один горячий ключ, глобальные транзакции или нерасширяемый downstream. Требуется изменить алгоритм/модель данных либо мощность конкретного bottleneck.

    **Источник:** [Gene Amdahl: Validity of the single processor approach](https://doi.org/10.1145/1465482.1465560); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

40. (L4 [S]) Как проектировать auto-scaling стратегию?

    **Ответ:** Сочетать baseline capacity, реактивные метрики, прогноз пиков и ограничения стоимости. Учесть start/warm time, capacity зависимостей, отказ зоны и безопасный scale-in.

    **Источник:** [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

41. (L4 [S]) Как балансировать cost vs performance?

    **Ответ:** Оптимизировать стоимость успешной операции при заданных SLO, а не только CPU utilization. Сравнить классы ресурсов, batching, retention, резервирование и цену отказа.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

42. (L4 [S]) Как проектировать multi-region scaling?

    **Ответ:** Региональные ячейки с локальными данными, независимыми лимитами и запасом для failover. Масштабировать регион по его нагрузке, избегать синхронной глобальной зависимости на каждом запросе.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

43. (L4 [S]) Как минимизировать tail latency?

    **Ответ:** Уменьшить очереди и fan-out, изолировать медленных tenants, контролировать GC и hot keys. Hedged requests допустимы для безопасных чтений при бюджете дополнительной нагрузки.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

44. (L4 [S]) Как проектировать систему без hot partitions?

    **Ответ:** Абсолютное отсутствие hotspot гарантировать трудно: проектировать достаточную кардинальность, адаптивное split и отдельный путь для горячих сущностей. Регулярно проверять реальное распределение запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

45. (L4 [S]) Как масштабировать write-heavy систему?

    **Ответ:** Разделить поток по ключам, использовать batches, последовательную запись и минимально нужные индексы. Проверить репликацию, compaction, диски и обратное давление, а не только масштабировать API.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

46. (L4 [S]) Как масштабировать read-heavy систему?

    **Ответ:** Индексы и эффективные запросы, затем кэши и реплики по допустимой свежести. Для тяжёлой аналитики строить отдельные проекции; учитывать единичные hot keys и суммарный fan-out.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
