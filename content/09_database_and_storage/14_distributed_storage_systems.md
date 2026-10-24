# 🌍 14. Distributed storage systems

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

---

## 🔹 Distributed databases

1. (L1 [T]) Что такое distributed database?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


2. (L1 [T]) Чем distributed DB отличается от single-node DB?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


3. (L1 [T]) Почему distributed storage нужен при росте данных и нагрузки?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


4. (L1 [T]) Что такое shard/node/replica в распределённой БД?

   **Ответ:** Shard — часть данных, node — участник/сервер, replica — копия shard/data group. Один node может держать много shards/replicas, а число копий не равно числу независимых failure domains.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


5. (L1 [T]) Почему distributed DB усложняет consistency?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


6. (L1 [T]) Почему сеть становится частью storage engine?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


7. (L1 [T]) Что такое coordinator node?

   **Ответ:** Coordinator маршрутизирует/собирает результаты участников, но не обязательно является data owner. После его crash outcome может быть неизвестен клиенту при частично/полностью выполненной записи; durable decision/version history и idempotency определяют recovery.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


8. (L1 [T]) Почему distributed DB почти всегда сочетает sharding и replication?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


9. (L1 [T]) Почему latency между узлами критична для дизайна системы?

   **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

   **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


10. (L1 [T]) Почему distributed database — это не просто “много серверов с одной БД”?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


11. (L1 [P]) Реализовать простой distributed KV store на 2–3 узла

    **Ответ:** Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


12. (L1 [P]) Реализовать coordinator, маршрутизирующий запрос на нужный shard

    **Ответ:** Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


13. (L1 [P]) Реализовать replication of writes to follower nodes

    **Ответ:** Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


14. (L1 [P]) Реализовать basic health checks between nodes

    **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


15. (L1 [P]) Реализовать mapping key → shard → replicas

    **Ответ:** Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


16. (L2 [T]) Почему distributed transactions дороже локальных?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


17. (L2 [T]) Что такое cross-shard query?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


18. (L2 [T]) Почему distributed joins обычно дорогие?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


19. (L2 [T]) Что такое control plane и data plane в distributed DB?

    **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


20. (L2 [T]) Почему membership and metadata services критичны?

    **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


21. (L2 [T]) Что такое rebalance в distributed database?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


22. (L2 [T]) Почему failover в distributed DB может привести к stale routing?

    **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


23. (L2 [T]) Почему global secondary indexes особенно сложны?

    **Ответ:** Глобальная uniqueness/index update охватывает несколько владельцев и требует координации или специального allocation протокола. Local UNIQUE на shards не доказывает global invariant; async global projection может временно отставать.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


24. (L2 [T]) Что такое distributed commit path?

    **Ответ:** Commit проходит local concurrency/validation, durable logging/replication каждой группы и при необходимости cross-shard decision. Trace должен различать queue, quorum, prepare/decision и apply, а ACK соответствовать точной boundary.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


25. (L2 [T]) Почему “горячий shard” остаётся проблемой даже в большом кластере?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


26. (L2 [P]) Реализовать routing table with versioned metadata

    **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


27. (L2 [P]) Реализовать shard move with temporary forwarding

    **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


28. (L2 [P]) Реализовать node membership gossip/heartbeat

    **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety. Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


29. (L2 [P]) Реализовать per-shard leader mapping

    **Ответ:** Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


30. (L2 [P]) Реализовать distributed request tracing across router → shard → replica

    **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


31. (L2 [D]) Почему один shard перегружен, хотя кластер в среднем загружен слабо?

    **Ответ:** Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


32. (L2 [D]) Почему client-side routing даёт stale errors после failover?

    **Ответ:** Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


33. (L2 [D]) Почему cross-shard query внезапно стала главной причиной p99?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


34. (L2 [D]) Почему cluster CPU низкий, но latency высокая?

    **Ответ:** Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


35. (L2 [D]) Почему distributed DB unstable only during topology changes?

    **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


36. (L3 [T]) Как проектировать metadata subsystem для distributed storage?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


37. (L3 [T]) Почему distributed DB должна учитывать clock skew, network partitions и node churn?

    **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Wall clock может иметь skew и скачки; NTP не даёт единого строгого порядка событий. Для локальных intervals используют monotonic clock, для authority/order — согласованные versions/epochs и нужные bounded-time assumptions.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Raft paper](https://raft.github.io/raft.pdf); [Jepsen: Consistency models](https://jepsen.io/consistency)


38. (L3 [T]) Как placement strategy влияет на latency, fault tolerance и cost?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


39. (L3 [T]) Как routing caches on clients balance freshness and control-plane load?

    **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


40. (L3 [T]) Почему distributed DB performance часто определяется slowest shard/replica path?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


41. (L3 [T]) Как transaction layer сочетается с consensus and replication layer?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


42. (L3 [T]) Почему observability for distributed storage must be shard-aware and topology-aware?

    **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


43. (L3 [T]) Как membership changes interact with load balancing and recovery?

    **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


44. (L3 [T]) Почему anti-entropy, rebalancing и compaction together can destabilize cluster?

    **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


45. (L3 [T]) Почему distributed DB design — это компромисс между locality, consistency, availability и operability?

    **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


46. (L3 [P]) Реализовать metadata service with epoch/version control

    **Ответ:** Authority выдаёт monotonic epoch/token, а принимающий write resource хранит максимальный допустимый token и отвергает старые. Persist/update authority согласуются с failover; test paused old owner после promotion и stale routing.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


47. (L3 [P]) Реализовать stale-route retry with metadata refresh

    **Ответ:** Refresh публикует новые search segments/состояние для поиска; это отдельная граница от durability/replication ACK. Частые refresh увеличивают small segments и merge cost, а долгие — задержку search visibility. Сначала корректный local engine, затем replicated group с durable terms/log, versioned shard map и idempotent client requests. Проверять stale routing, reconfiguration, partitions и restart; cross-shard operations требуют отдельного commit/semantic protocol.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


48. (L3 [P]) Реализовать placement simulator for shards/replicas across racks/AZs

    **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


49. (L3 [P]) Реализовать per-shard SLO metrics and topology dashboard

    **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


50. (L3 [P]) Реализовать fault injection: node loss, slow link, stale metadata

    **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


51. (L3 [D]) Как доказать, что bottleneck в control plane, а не в storage engine?

    **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


52. (L3 [D]) Почему topology change triggered cluster-wide latency spike?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


53. (L3 [D]) Как расследовать request amplification from coordinator retries?

    **Ответ:** Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


54. (L3 [D]) Почему shard migration fixed capacity but worsened tail latency?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


55. (L3 [D]) Как найти hidden hotspot tenant in distributed database?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


56. (L4 [S]) Когда distributed database действительно нужна, а когда single-node + replicas достаточно?

    **Ответ:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


57. (L4 [S]) Как выбирать between shared-nothing DB, managed distributed SQL and custom storage layer?

    **Ответ:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


58. (L4 [S]) Как проектировать organization-wide guardrails against cross-shard antipatterns?

    **Ответ:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


59. (L4 [S]) Как строить control plane, который сам не станет SPOF или bottleneck?

    **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

    **Рекомендация:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


60. (L4 [S]) Как объяснять команде, что distributed DB complexity comes from coordination, not from networking alone?

    **Ответ:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

    **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


---

## 🔹 Consensus (Raft, Paxos)

61. (L1 [T]) Что такое consensus в distributed systems?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Пример:** При N=3 majority=2; один изолированный узел не может самостоятельно подтвердить новую запись.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


62. (L1 [T]) Зачем distributed storage нужен consensus?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


63. (L1 [T]) Что такое replicated log?

    **Ответ:** Replication log — упорядоченный stream изменений с identity/position; replicated log дополнительно согласуется выбранным protocol между копиями. Presence записи на replica, durable flush и committed/apply — разные состояния.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


64. (L1 [T]) Что такое leader в Raft-like системах?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


65. (L1 [T]) Что такое follower?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


66. (L1 [T]) Что такое term в Raft?

    **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


67. (L1 [T]) Что такое election timeout?

    **Ответ:** Randomized election timeout уменьшает одновременные candidacies, но слишком короткое окно относительно RTT/fsync/pause вызывает churn. Safety обеспечивают voting/log rules, timeout в основном влияет на liveness/failover delay.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


68. (L1 [T]) Почему consensus нужен для leader election и log agreement?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


69. (L1 [T]) Чем Paxos концептуально отличается от Raft?

    **Ответ:** Paxos формализует выбор значений через intersecting quorums/ballots, Multi-Paxos — последовательность решений; Raft структурирует leader election/log replication и правила log matching. Отличие не в том, что один «имеет консенсус», а другой нет.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


70. (L1 [T]) Почему consensus сложнее обычной репликации?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


71. (L1 [P]) Реализовать упрощённый Raft election among 3 nodes

    **Ответ:** Persist term/votedFor/log, реализовать voting/log-match и majority/current-term commit rules. Apply только committed prefix, snapshot/membership менять безопасно; deterministic simulator проверяет loss/reorder, split vote, stale leader и restart.

    **Типичная ошибка:** Считать heartbeat/timeout достаточным доказательством права старого лидера продолжать запись.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


72. (L1 [P]) Реализовать AppendEntries heartbeat

    **Ответ:** Persist term/votedFor/log, реализовать voting/log-match и majority/current-term commit rules. Apply только committed prefix, snapshot/membership менять безопасно; deterministic simulator проверяет loss/reorder, split vote, stale leader и restart.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


73. (L1 [P]) Реализовать majority vote for leader election

    **Ответ:** Persist term/votedFor/log, реализовать voting/log-match и majority/current-term commit rules. Apply только committed prefix, snapshot/membership менять безопасно; deterministic simulator проверяет loss/reorder, split vote, stale leader и restart.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


74. (L1 [P]) Реализовать log append with monotonically increasing index

    **Ответ:** Монотонные keys в range placement направляют новые writes в крайний range, несмотря на высокую cardinality. Hash/salting или adaptive splitting меняют распределение, но влияют на ranges/locality и не распараллеливают один aggregate. Реализовать persistent term/votedFor/log, RequestVote/AppendEntries и правила commit текущего term. Apply только committed prefix, сделать snapshot install/reconfiguration безопасными; model tests теряют/дублируют/переставляют сообщения и перезапускают nodes.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


75. (L1 [P]) Реализовать simple commit when majority acknowledged entry

    **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity. Реализовать persistent term/votedFor/log, RequestVote/AppendEntries и правила commit текущего term. Apply только committed prefix, сделать snapshot install/reconfiguration безопасными; model tests теряют/дублируют/переставляют сообщения и перезапускают nodes.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


76. (L2 [T]) Почему majority quorum обеспечивает safety under node failures?

    **Ответ:** Majority — больше N/2 участников фиксированной конфигурации, поэтому любые два большинства пересекаются. Safety дополнительно требует protocol rules, durable state и безопасной reconfiguration; арифметика одна не разрешает конфликтующие записи.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


77. (L2 [T]) Что такое committed entry в Raft?

    **Ответ:** В Raft committed entry должен сохраняться у будущих лидеров; log matching связывает одинаковые index/term с одинаковым префиксом. Majority replication произвольной старой-term записи без остальных commit/election правил недостаточно.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


78. (L2 [T]) Почему leader completeness важна?

    **Ответ:** В Raft committed entry должен сохраняться у будущих лидеров; log matching связывает одинаковые index/term с одинаковым префиксом. Majority replication произвольной старой-term записи без остальных commit/election правил недостаточно.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


79. (L2 [T]) Что такое log matching property?

    **Ответ:** В Raft committed entry должен сохраняться у будущих лидеров; log matching связывает одинаковые index/term с одинаковым префиксом. Majority replication произвольной старой-term записи без остальных commit/election правил недостаточно.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


80. (L2 [T]) Почему split vote happens and how Raft mitigates it?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


81. (L2 [T]) Почему network partitions complicate election?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


82. (L2 [T]) Почему leader lease/read optimization tricky?

    **Ответ:** Lease даёт ограниченное во времени право при оговорённых clock/communication assumptions. Pause/skew/partition могут оставить старого владельца активным, поэтому critical writes требуют resource-side fencing/consensus rules. Follower read уменьшает RTT/нагрузку лидера лишь при разрешённой freshness. Для строгого read нужны доказанная read-index/lease/required-position процедура и applied boundary; «узел здоров» не означает актуальный snapshot.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


83. (L2 [T]) Что такое log compaction / snapshotting in consensus?

    **Ответ:** Consensus snapshot заменяет старый применённый prefix состоянием с lastIncludedIndex/Term. Удалять log можно лишь после durable snapshot metadata; install/catch-up/restore должны сохранять committed state и voting/log rules.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


84. (L2 [T]) Почему recovery of lagging follower important for consensus cluster health?

    **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


85. (L2 [T]) Почему Paxos reputation as “hard to understand” partly about decomposition, not only math?

    **Ответ:** Paxos формализует выбор значений через intersecting quorums/ballots, Multi-Paxos — последовательность решений; Raft структурирует leader election/log replication и правила log matching. Отличие не в том, что один «имеет консенсус», а другой нет.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


86. (L2 [P]) Реализовать randomized election timeout

    **Ответ:** Randomized election timeout уменьшает одновременные candidacies, но слишком короткое окно относительно RTT/fsync/pause вызывает churn. Safety обеспечивают voting/log rules, timeout в основном влияет на liveness/failover delay. Реализовать persistent term/votedFor/log, RequestVote/AppendEntries и правила commit текущего term. Apply только committed prefix, сделать snapshot install/reconfiguration безопасными; model tests теряют/дублируют/переставляют сообщения и перезапускают nodes.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


87. (L2 [P]) Реализовать follower catch-up from missing log index

    **Ответ:** Реализовать persistent term/votedFor/log, RequestVote/AppendEntries и правила commit текущего term. Apply только committed prefix, сделать snapshot install/reconfiguration безопасными; model tests теряют/дублируют/переставляют сообщения и перезапускают nodes.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


88. (L2 [P]) Реализовать commit index propagation

    **Ответ:** Реализовать persistent term/votedFor/log, RequestVote/AppendEntries и правила commit текущего term. Apply только committed prefix, сделать snapshot install/reconfiguration безопасными; model tests теряют/дублируют/переставляют сообщения и перезапускают nodes.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


89. (L2 [P]) Реализовать snapshot install for lagging follower

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


90. (L2 [P]) Реализовать fault injection: delayed heartbeats and split votes

    **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


91. (L2 [D]) Почему cluster frequently re-elects leaders under moderate packet loss?

    **Ответ:** Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

    **Типичная ошибка:** Считать heartbeat/timeout достаточным доказательством права старого лидера продолжать запись.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


92. (L2 [D]) Почему follower never catches up after partition heals?

    **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


93. (L2 [D]) Почему writes stall despite majority of nodes healthy?

    **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


94. (L2 [D]) Почему leadership flaps only in one AZ/region?

    **Ответ:** Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


95. (L2 [D]) Почему read optimization returned stale data after leader transition?

    **Ответ:** Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


96. (L3 [T]) Как устроен Raft state machine: leader election, log replication, safety?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


97. (L3 [T]) Как проектировать durable log for consensus node?

    **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


98. (L3 [T]) Почему fsync latency directly affects consensus write latency?

    **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


99. (L3 [T]) Как joint consensus / membership change works?

    **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


100. (L3 [T]) Почему reconfiguration is one of the hardest parts of consensus systems?

     **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


101. (L3 [T]) Как batching affects throughput and tail latency in Raft?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


102. (L3 [T]) Почему clock assumptions in consensus must stay weak?

     **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


103. (L3 [T]) Как Raft snapshots interact with application state machine snapshots?

     **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


104. (L3 [T]) Почему multi-Raft per shard/tablet is common in distributed databases?

     **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


105. (L3 [T]) Почему consensus solves agreement, but not all higher-level DB semantics?

     **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


106. (L3 [P]) Реализовать joint-consensus-like reconfiguration (упрощённо)

     **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Raft paper](https://raft.github.io/raft.pdf)


107. (L3 [P]) Реализовать batched AppendEntries pipeline

     **Ответ:** Persist term/votedFor/log, реализовать voting/log-match и majority/current-term commit rules. Apply только committed prefix, snapshot/membership менять безопасно; deterministic simulator проверяет loss/reorder, split vote, stale leader и restart.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


108. (L3 [P]) Реализовать per-peer replication state: nextIndex/matchIndex

     **Ответ:** Реализовать persistent term/votedFor/log, RequestVote/AppendEntries и правила commit текущего term. Apply только committed prefix, сделать snapshot install/reconfiguration безопасными; model tests теряют/дублируют/переставляют сообщения и перезапускают nodes.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


109. (L3 [P]) Реализовать metrics: election count, leader changes, commit lag, append RTT

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


110. (L3 [P]) Реализовать simulator for partitions, restarts, fsync stalls and slow followers

     **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Raft paper](https://raft.github.io/raft.pdf)


111. (L3 [D]) Как доказать, что latency caused by durable log flush, not network RTT?

     **Ответ:** Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


112. (L3 [D]) Почему cluster remains unavailable after one-node restart because elections keep oscillating?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева. Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Raft paper](https://raft.github.io/raft.pdf)


113. (L3 [D]) Как расследовать inconsistent reads from follower-read optimization in consensus-backed DB?

     **Ответ:** Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


114. (L3 [D]) Почему membership change caused long unavailability window?

     **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety. Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


115. (L3 [D]) Как найти unsafe assumption in homegrown Raft implementation?

     **Ответ:** Сравнить terms/votes/log indices, leader changes, match/commit/apply и membership configs. Slow disk/GC/loss вызывают election churn; отличать недоступность majority от нарушения safety и старого leader без fencing.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


116. (L4 [S]) Когда использовать consensus-backed replication, а когда достаточно async/semi-sync?

     **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO.

     **Рекомендация:** Выбирать проверенную реализацию, majority в независимых fault domains и bounded log/snapshot recovery. Для membership использовать доказанный overlapping/joint protocol; быстрый failover не должен нарушать единственность committed history.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


117. (L4 [S]) Как проектировать multi-Raft architecture without drowning in metadata and hot leaders?

     **Ответ:** Выбирать проверенную реализацию, majority в независимых fault domains и bounded log/snapshot recovery. Для membership использовать доказанный overlapping/joint protocol; быстрый failover не должен нарушать единственность committed history.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


118. (L4 [S]) Как выбирать cluster size and placement for consensus groups?

     **Ответ:** Выбирать проверенную реализацию, majority в независимых fault domains и bounded log/snapshot recovery. Для membership использовать доказанный overlapping/joint protocol; быстрый failover не должен нарушать единственность committed history.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


119. (L4 [S]) Как объяснять команде, что consensus gives safety guarantees, but costs latency and operability?

     **Ответ:** Выбирать проверенную реализацию, majority в независимых fault domains и bounded log/snapshot recovery. Для membership использовать доказанный overlapping/joint protocol; быстрый failover не должен нарушать единственность committed history.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


120. (L4 [S]) Как строить testing/drill strategy for consensus subsystems before production incidents do it for you?

     **Ответ:** Выбирать проверенную реализацию, majority в независимых fault domains и bounded log/snapshot recovery. Для membership использовать доказанный overlapping/joint protocol; быстрый failover не должен нарушать единственность committed history.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


---

## 🔹 Quorum reads / writes

121. (L1 [T]) Что такое quorum read?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Пример:** N=3,R=2,W=2 пересекаются при фиксированном replica set, но concurrency/version resolution всё ещё требуют протокола.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


122. (L1 [T]) Что такое quorum write?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


123. (L1 [T]) Что означают параметры N, R, W?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


124. (L1 [T]) Почему при `R + W > N` часто ожидают лучшую согласованность?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


125. (L1 [T]) Почему quorum systems используются в distributed storage?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


126. (L1 [T]) Что такое majority quorum?

     **Ответ:** Majority — больше N/2 участников фиксированной конфигурации, поэтому любые два большинства пересекаются. Safety дополнительно требует protocol rules, durable state и безопасной reconfiguration; арифметика одна не разрешает конфликтующие записи.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


127. (L1 [T]) Почему read quorum и write quorum влияют на latency differently?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


128. (L1 [T]) Почему quorum read может всё равно вернуть stale value?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


129. (L1 [T]) Что такое sloppy quorum?

     **Ответ:** Quorum пересечение зависит от конкретного replica set/topology. Local quorum не обещает свежесть в другом регионе, sloppy quorum может ждать другой набор nodes; простое R+W>N без этих предпосылок вводит в заблуждение.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


130. (L1 [T]) Почему quorum не равен строгой linearizability автоматически?

     **Ответ:** Linearizability задаёт единый порядок операций с учётом real-time завершения. Serializable задаёт эквивалентность последовательным транзакциям; «strong consistency» без уточнения модели слишком неоднозначно.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency)


131. (L1 [P]) Реализовать quorum write to N replicas waiting for W ACKs

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Типичная ошибка:** Обещать linearizability лишь из R+W>N, не проверяя replica sets, versions и ACK semantics.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


132. (L1 [P]) Реализовать quorum read from R replicas

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


133. (L1 [P]) Реализовать latest-version choose among R responses

     **Ответ:** Смоделировать fixed N replicas, R/W wait sets, version history и durable/apply states. Менять topology/partial failures, concurrent writes и stale metadata; checker сравнивает observed histories с объявленной моделью, а не только число ACK.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


134. (L1 [P]) Реализовать tunable consistency parameters per request

     **Ответ:** Смоделировать fixed N replicas, R/W wait sets, version history и durable/apply states. Менять topology/partial failures, concurrent writes и stale metadata; checker сравнивает observed histories с объявленной моделью, а не только число ACK.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


135. (L1 [P]) Реализовать read repair after detecting stale replica

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


136. (L2 [T]) Почему intersecting quorums still fail under timing/version anomalies?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


137. (L2 [T]) Почему coordinator correctness critical in quorum protocol?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


138. (L2 [T]) Что такое hinted handoff in quorum-based systems?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


139. (L2 [T]) Почему write acknowledgments may mean receive, durable write or apply — and these differ?

     **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


140. (L2 [T]) Почему latency of quorum operation depends on tail replicas, not average replicas?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


141. (L2 [T]) Как read repair and anti-entropy complement quorum reads/writes?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


142. (L2 [T]) Почему vector clocks/version stamps важны for resolving concurrent writes?

     **Ответ:** Vector versions могут различать causal order и concurrency; Lamport clock даёт совместимый причинный порядок, но не детектирует concurrency сам. Version metadata и resolver не заменяют бизнес-правило слияния конфликтов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


143. (L2 [T]) Почему “quorum achieved” and “client sees latest data” are different statements?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


144. (L2 [T]) Как topology-aware quorum placement affects availability and latency?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


145. (L2 [T]) Почему hot keys disproportionately hurt quorum systems?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


146. (L2 [P]) Реализовать per-replica version stamps

     **Ответ:** Смоделировать fixed N replicas, R/W wait sets, version history и durable/apply states. Менять topology/partial failures, concurrent writes и stale metadata; checker сравнивает observed histories с объявленной моделью, а не только число ACK.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


147. (L2 [P]) Реализовать hinted handoff queue

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


148. (L2 [P]) Реализовать stale replica detection and repair

     **Ответ:** Смоделировать fixed N replicas, R/W wait sets, version history и durable/apply states. Менять topology/partial failures, concurrent writes и stale metadata; checker сравнивает observed histories с объявленной моделью, а не только число ACK.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


149. (L2 [P]) Реализовать latency-aware coordinator choosing fastest replicas

     **Ответ:** Смоделировать fixed N replicas, R/W wait sets, version history и durable/apply states. Менять topology/partial failures, concurrent writes и stale metadata; checker сравнивает observed histories с объявленной моделью, а не только число ACK.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


150. (L2 [P]) Реализовать benchmark for N/R/W trade-offs under failures

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


151. (L2 [D]) Почему quorum read occasionally returns old value after recent successful write?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки. Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Типичная ошибка:** Обещать linearizability лишь из R+W>N, не проверяя replica sets, versions и ACK semantics.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


152. (L2 [D]) Почему write latency exploded after one replica became slow but not dead?

     **Ответ:** Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


153. (L2 [D]) Почему hinted handoff queue grew forever?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


154. (L2 [D]) Почему coordinator became hotspot for one hot partition?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


155. (L2 [D]) Почему changing from `W=1` to `W=2` broke SLA unexpectedly?

     **Ответ:** Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


156. (L3 [T]) Как проектировать versioning for quorum-based storage: timestamps, vector clocks, epochs?

     **Ответ:** Vector versions могут различать causal order и concurrency; Lamport clock даёт совместимый причинный порядок, но не детектирует concurrency сам. Version metadata и resolver не заменяют бизнес-правило слияния конфликтов. Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


157. (L3 [T]) Почему bounded staleness over quorum systems is subtle?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


158. (L3 [T]) Как partial failures and retries create duplicate or reordered writes in quorum systems?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


159. (L3 [T]) Как quorum interacts with leaderless replication and consistent hashing placement?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


160. (L3 [T]) Почему local quorum vs global quorum matters in geo-distributed clusters?

     **Ответ:** Quorum пересечение зависит от конкретного replica set/topology. Local quorum не обещает свежесть в другом регионе, sloppy quorum может ждать другой набор nodes; простое R+W>N без этих предпосылок вводит в заблуждение.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


161. (L3 [T]) Как observability должна разделять quorum failure, stale read, repair debt and coordinator overload?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


162. (L3 [T]) Почему tunable consistency complicates application correctness reasoning?

     **Ответ:** ACID consistency относится к сохранению заданных ограничений/инвариантов корректной транзакцией. Это не linearizability реплик; СУБД обеспечивает только выраженные правила, а не автоматически все намерения приложения. Storage-level merge/transaction success не доказывает бизнес-инвариант. Два допустимых состояния/операции по отдельности могут быть недопустимы совместно; правило уникальности/баланса должно быть выражено в соответствующей atomic/coordinated границе.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


163. (L3 [T]) Как anti-entropy and quorum protocols together define eventual convergence speed?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Jepsen: Consistency models](https://jepsen.io/consistency)


164. (L3 [T]) Почему different object sizes and request types distort quorum latency model?

     **Ответ:** Quorum — достаточный набор участников по протоколу, а не универсальная формула correctness. В leaderless R+W>N даёт пересечение фиксированных sets, но versions, concurrency, sloppy quorum и ACK durability определяют реальные guarantees.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


165. (L3 [T]) Почему quorum reads/writes are storage semantics, not complete application semantics?

     **Ответ:** Storage-level merge/transaction success не доказывает бизнес-инвариант. Два допустимых состояния/операции по отдельности могут быть недопустимы совместно; правило уникальности/баланса должно быть выражено в соответствующей atomic/coordinated границе. Storage quorum определяет, чьи версии/ACK участвовали в операции, но не atomicity нескольких бизнес-объектов. Даже корректные key-level reads/writes могут нарушить multi-key invariant без транзакционного/доменного протокола.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


166. (L3 [P]) Реализовать local-vs-global quorum simulator across regions

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


167. (L3 [P]) Реализовать consistency checker comparing observed staleness vs configured R/W/N

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


168. (L3 [P]) Реализовать per-key coordinator trace with version conflict logging

     **Ответ:** Смоделировать fixed N replicas, R/W wait sets, version history и durable/apply states. Менять topology/partial failures, concurrent writes и stale metadata; checker сравнивает observed histories с объявленной моделью, а не только число ACK.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


169. (L3 [P]) Реализовать background anti-entropy queue with rate limiting

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


170. (L3 [P]) Реализовать observability: stale-read rate, read repair rate, hinted handoff debt, coordinator retries

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


171. (L3 [D]) Как доказать, что stale reads caused by version resolution bug, not by slow network?

     **Ответ:** Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


172. (L3 [D]) Почему quorum math looks fine on paper, but production still shows anomalies?

     **Ответ:** Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


173. (L3 [D]) Как расследовать write loss after coordinator crash during partial quorum?

     **Ответ:** Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


174. (L3 [D]) Почему local quorum improved latency but worsened cross-region read correctness complaints?

     **Ответ:** Quorum пересечение зависит от конкретного replica set/topology. Local quorum не обещает свежесть в другом регионе, sloppy quorum может ждать другой набор nodes; простое R+W>N без этих предпосылок вводит в заблуждение. Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


175. (L3 [D]) Как найти mismatch between “ACK semantics” and operator expectations in quorum deployment?

     **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity. Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs. Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


176. (L4 [S]) Когда quorum-based storage оправдан, а когда consensus-based leader model проще and safer?

     **Ответ:** Выбирать N/R/W и topology из exact consistency/availability/latency требований. Для строгого порядка consensus leader может быть проще; tunable levels требуют guardrails и понятного поведения при partition/retry.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


177. (L4 [S]) Как выбирать N/R/W for different classes of data and SLAs?

     **Ответ:** Выбирать N/R/W и topology из exact consistency/availability/latency требований. Для строгого порядка consensus leader может быть проще; tunable levels требуют guardrails и понятного поведения при partition/retry.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


178. (L4 [S]) Как объяснять командам реальные guarantees tunable consistency without overselling them?

     **Ответ:** Выбирать N/R/W и topology из exact consistency/availability/latency требований. Для строгого порядка consensus leader может быть проще; tunable levels требуют guardrails и понятного поведения при partition/retry.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


179. (L4 [S]) Как строить guardrails so product teams do not accidentally choose unsafe consistency levels?

     **Ответ:** Выбирать N/R/W и topology из exact consistency/availability/latency требований. Для строгого порядка consensus leader может быть проще; tunable levels требуют guardrails и понятного поведения при partition/retry.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


180. (L4 [S]) Как балансировать latency, repair cost, topology and correctness in quorum system design?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Рекомендация:** Выбирать N/R/W и topology из exact consistency/availability/latency требований. Для строгого порядка consensus leader может быть проще; tunable levels требуют guardrails и понятного поведения при partition/retry.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


---

## 🔹 Partition tolerance

181. (L1 [T]) Что такое network partition в distributed system?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


182. (L1 [T]) Что значит partition tolerance?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


183. (L1 [T]) Почему distributed storage must assume partitions will happen?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


184. (L1 [T]) Чем partition отличается от simple node failure?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


185. (L1 [T]) Почему two halves of cluster may both think they are healthy?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


186. (L1 [T]) Что такое split brain?

     **Ответ:** Split-brain — конфликтующие владельцы/лидеры действуют одновременно. Диагноз требует authority/term/membership и ACK history; наличие двух процессов, называющих себя leader, ещё не доказывает два committed histories при корректном quorum protocol.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


187. (L1 [T]) Почему partitions affect both reads and writes?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


188. (L1 [T]) Почему latency spikes and packet loss often precede full partition-like symptoms?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


189. (L1 [T]) Почему partition tolerance is not a feature switch you “turn on”?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


190. (L1 [T]) Почему CAP discussions often become misleading in practical DB design?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


191. (L1 [P]) Реализовать fault injector: simulate dropped network link between nodes

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


192. (L1 [P]) Реализовать leader election reaction to partition

     **Ответ:** Persist term/votedFor/log, реализовать voting/log-match и majority/current-term commit rules. Apply только committed prefix, snapshot/membership менять безопасно; deterministic simulator проверяет loss/reorder, split vote, stale leader и restart.

     **Типичная ошибка:** Разрешать forced writes обеим сторонам partition без объявленной conflict/authority модели.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


193. (L1 [P]) Реализовать client retry logic under temporary partition

     **Ответ:** Fault harness управляет directional loss/delay/reorder между nodes, отдельно data/control traffic. Проверять majority-only writes, epochs/fencing, idempotent retries и heal/catch-up; stale leader и duplicate replay не должны нарушить инварианты.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


194. (L1 [P]) Реализовать degraded mode when minority partition loses write ability

     **Ответ:** Fault harness управляет directional loss/delay/reorder между nodes, отдельно data/control traffic. Проверять majority-only writes, epochs/fencing, idempotent retries и heal/catch-up; stale leader и duplicate replay не должны нарушить инварианты.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


195. (L1 [P]) Реализовать split-brain detector using epoch/leader-id metadata

     **Ответ:** Split задаёт новые непересекающиеся ranges, merge — общий range; copy/catch-up сохраняют concurrent writes. Atomically сменить catalog generation/owner и fence старый путь, cleanup после readers/rollback safety; проверить keys на границах и crash cutover.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


196. (L2 [T]) Почему majority-based systems sacrifice availability in minority partition?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


197. (L2 [T]) Почему async replicated systems may stay writable through partition but risk divergence?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


198. (L2 [T]) Как partition affects quorum reads/writes?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


199. (L2 [T]) Почему network partition often manifests as partial and asymmetric, not total?

     **Ответ:** Reachability направленная: A→B и B→A могут вести себя различно, как и data/control traffic. Диагностировать matrix probe/captures с обеих сторон, отличать network loss от GC pause/slow disk; одного ping недостаточно.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


200. (L2 [T]) Почему client timeouts and retries can amplify partition damage?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


201. (L2 [T]) Что такое fencing token and why useful after partitions?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


202. (L2 [T]) Почему leases become dangerous under long partitions and clock skew?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Lease даёт ограниченное во времени право при оговорённых clock/communication assumptions. Pause/skew/partition могут оставить старого владельца активным, поэтому critical writes требуют resource-side fencing/consensus rules.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Raft paper](https://raft.github.io/raft.pdf)


203. (L2 [T]) Как placement across racks/AZs changes partition failure modes?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


204. (L2 [T]) Почему stale metadata after partition heal can be as dangerous as the partition itself?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


205. (L2 [T]) Почему operator actions during partition often worsen blast radius?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


206. (L2 [P]) Реализовать majority-only write admission

     **Ответ:** Admission control ограничивает принятую/конкурентную работу до дорогих стадий. Ограниченный queue/reject сохраняет полезный throughput при saturation; бесконечные waits/retries не добавляют capacity и ухудшают tail. Fault harness управляет directional loss/delay/reorder между nodes, отдельно data/control traffic. Проверять majority-only writes, epochs/fencing, idempotent retries и heal/catch-up; stale leader и duplicate replay не должны нарушить инварианты.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


207. (L2 [P]) Реализовать fencing token for leaders/coordinators

     **Ответ:** Authority выдаёт monotonic epoch/token, а принимающий write resource хранит максимальный допустимый token и отвергает старые. Persist/update authority согласуются с failover; test paused old owner после promotion и stale routing.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


208. (L2 [P]) Реализовать asymmetric partition simulator

     **Ответ:** Управлять directional loss/delay/reorder для каждой пары и data/control channels, логировать reachability/epochs/ACK. Проверять degraded writes/reads по контракту, fencing и heal/catch-up; burst replay/retries ограничены budgets.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


209. (L2 [P]) Реализовать client backoff and idempotent retry under partition

     **Ответ:** Распознать retryable ошибки, сохранить operation ID, ограничить attempts и общий deadline. Перед попыткой выбрать full-jitter delay в [0,min(cap,base×2^n)], учитывать Retry-After; успешный ранее committed эффект не повторять.

     **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


210. (L2 [P]) Реализовать heal phase: rejoin, catch-up, stale leader demotion

     **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


211. (L2 [D]) Почему both sides accepted writes during partition?

     **Ответ:** Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Типичная ошибка:** Разрешать forced writes обеим сторонам partition без объявленной conflict/authority модели.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


212. (L2 [D]) Почему cluster unavailable though only one link was flaky?

     **Ответ:** Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


213. (L2 [D]) Почему retries from clients caused cascading overload after network recovered?

     **Ответ:** Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


214. (L2 [D]) Почему healed cluster still served stale data?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


215. (L2 [D]) Почему partition symptoms appeared only in one region or one rack?

     **Ответ:** Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


216. (L3 [T]) Как partition tolerance interacts with consensus, quorum systems and replication mode?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


217. (L3 [T]) Почему “partition tolerant” usually means well-defined degraded behavior, not seamless operation?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


218. (L3 [T]) Как design for read-only degradation, write shedding or local buffering during partitions?

     **Ответ:** Read-only транзакция может удерживать snapshot/versions, занимать I/O/CPU и влиять на serializable dependencies. Отсутствие write не означает отсутствие эксплуатационных последствий или обязательного abort при любой реализации.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


219. (L3 [T]) Как split-brain prevention interacts with failover speed?

     **Ответ:** Split-brain — конфликтующие владельцы/лидеры действуют одновременно. Диагноз требует authority/term/membership и ACK history; наличие двух процессов, называющих себя leader, ещё не доказывает два committed histories при корректном quorum protocol.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


220. (L3 [T]) Почему client-side routing/caching complicates recovery after partition heals?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


221. (L3 [T]) Как observability should distinguish packet loss, high RTT, asymmetric reachability and full partition?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Reachability направленная: A→B и B→A могут вести себя различно, как и data/control traffic. Диагностировать matrix probe/captures с обеих сторон, отличать network loss от GC pause/slow disk; одного ping недостаточно.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


222. (L3 [T]) Почему data re-convergence after heal is as important as surviving the partition itself?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


223. (L3 [T]) Как partition drills should include operator runbooks and application behavior, not only DB nodes?

     **Ответ:** Covering требует наличия всех полей query в index, включая predicates/order, но не гарантирует index-only физическое чтение. Payload columns и широкий composite key увеличивают размер и write maintenance. Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


224. (L3 [T]) Почему storage systems need to reason about partial partitions in metadata/control plane separately from data plane?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


225. (L3 [T]) Почему “availability during partitions” must be stated with exact semantics of possible staleness/divergence?

     **Ответ:** Network partition бывает частичной/асимметричной: живые nodes могут не обмениваться нужными сообщениями. При partition нельзя одновременно гарантировать linearizability и ответ каждой операции на неотказавшем узле; CP/AP выбирают по операциям и их смыслу.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


226. (L3 [P]) Реализовать rejoin protocol with stale term/epoch rejection

     **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


227. (L3 [P]) Реализовать observability: reachability matrix, quorum availability, stale-route counters

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


228. (L3 [P]) Реализовать partition drill harness with asymmetric loss, latency and packet reordering

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


229. (L3 [P]) Реализовать application-visible degraded modes: reject writes, serve stale reads, queue locally

     **Ответ:** Fault harness управляет directional loss/delay/reorder между nodes, отдельно data/control traffic. Проверять majority-only writes, epochs/fencing, idempotent retries и heal/catch-up; stale leader и duplicate replay не должны нарушить инварианты.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


230. (L3 [P]) Реализовать post-heal divergence checker and reconciliation pipeline

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


231. (L3 [D]) Как доказать, что incident was asymmetric partition, not node crash or GC pause?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Reachability направленная: A→B и B→A могут вести себя различно, как и data/control traffic. Диагностировать matrix probe/captures с обеих сторон, отличать network loss от GC pause/slow disk; одного ping недостаточно. Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


232. (L3 [D]) Почему cluster experienced split brain despite using leases?

     **Ответ:** Lease даёт ограниченное во времени право при оговорённых clock/communication assumptions. Pause/skew/partition могут оставить старого владельца активным, поэтому critical writes требуют resource-side fencing/consensus rules. Split-brain — конфликтующие владельцы/лидеры действуют одновременно. Диагноз требует authority/term/membership и ACK history; наличие двух процессов, называющих себя leader, ещё не доказывает два committed histories при корректном quorum protocol. Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


233. (L3 [D]) Как расследовать incorrect failover caused by stale health checks during partition?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


234. (L3 [D]) Почему partition heal triggered replay storm and p99 collapse?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)


235. (L3 [D]) Как найти hidden assumption in app/client code that turned partition into data inconsistency incident?

     **Ответ:** Собрать reachability matrix с обеих сторон, quorum/term history, GC/pause и packet telemetry. После heal проверить stale routes, divergent versions, repair/replay debt; восстановленная сеть ещё не означает восстановленную корректность.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


236. (L4 [S]) Как выбирать degraded semantics under partition for different products?

     **Ответ:** Задать reject/read-only/stale/local-buffer modes по продуктовым инвариантам. Запретить небезопасный forced promotion, иметь runbooks/fencing и rate-limited recovery; partition drills включают приложение, clients и operator действия.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


237. (L4 [S]) Когда лучше reject writes than risk divergence?

     **Ответ:** Задать reject/read-only/stale/local-buffer modes по продуктовым инвариантам. Запретить небезопасный forced promotion, иметь runbooks/fencing и rate-limited recovery; partition drills включают приложение, clients и operator действия.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


238. (L4 [S]) Как проектировать operator playbooks for partition events before the first real incident?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Рекомендация:** Задать reject/read-only/stale/local-buffer modes по продуктовым инвариантам. Запретить небезопасный forced promotion, иметь runbooks/fencing и rate-limited recovery; partition drills включают приложение, clients и operator действия.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


239. (L4 [S]) Как объяснять CAP/partition tolerance without oversimplifying into slogans?

     **Ответ:** Задать reject/read-only/stale/local-buffer modes по продуктовым инвариантам. Запретить небезопасный forced promotion, иметь runbooks/fencing и rate-limited recovery; partition drills включают приложение, clients и operator действия.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


240. (L4 [S]) Как build culture where partition drills are routine, not heroic one-offs?

     **Ответ:** Задать reject/read-only/stale/local-buffer modes по продуктовым инвариантам. Запретить небезопасный forced promotion, иметь runbooks/fencing и rate-limited recovery; partition drills включают приложение, clients и operator действия.

     **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Raft paper](https://raft.github.io/raft.pdf)


---

## 🔹 Data locality

241. (L1 [T]) Что такое data locality в distributed storage?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


242. (L1 [T]) Почему data locality влияет на latency?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


243. (L1 [T]) Почему locality важна для both storage and compute?

     **Ответ:** Разделение storage/compute позволяет независимо масштабировать ресурсы, но добавляет remote fetch, metadata и cache warmup. Локальный SSD cache меняет hit path, не заменяя durable object source и consistency manifests.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


244. (L1 [T]) Что такое local read vs remote read?

     **Ответ:** Affinity связывает workload/tenant с предпочитаемым data placement. Local/remote read определяются topology boundary, но пригодность replica также требует freshness/authority; локальное размещение не должно ломать fault tolerance и fairness.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


245. (L1 [T]) Почему cross-region access much slower than same-rack access?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


246. (L1 [T]) Почему data placement determines cost as well as performance?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


247. (L1 [T]) Что такое affinity between workload and data?

     **Ответ:** Affinity связывает workload/tenant с предпочитаемым data placement. Local/remote read определяются topology boundary, но пригодность replica также требует freshness/authority; локальное размещение не должно ломать fault tolerance и fairness.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


248. (L1 [T]) Почему “равномерно размазать всё везде” usually conflicts with locality?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


249. (L1 [T]) Почему locality matters even if bandwidth seems abundant?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


250. (L1 [T]) Почему geo-distributed systems care about both user locality and replica locality?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


251. (L1 [P]) Реализовать routing policy preferring local replica

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Типичная ошибка:** Всегда выбирать ближайшую replica без проверки freshness/authority и запаса ёмкости.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


252. (L1 [P]) Реализовать simple placement map: rack/AZ/region for each shard replica

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


253. (L1 [P]) Реализовать latency-aware read selection

     **Ответ:** Placement map хранит rack/AZ/region, tenant affinity и replica eligibility; routing учитывает epoch, health, freshness и capacity. Симулятор считает RTT/bytes/egress/cache warmth и проверяет fault-domain constraints до move.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


254. (L1 [P]) Реализовать synthetic benchmark local-vs-remote read latency

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


255. (L1 [P]) Реализовать basic tenant-to-region placement policy

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


256. (L2 [T]) Почему data locality often conflicts with load balancing?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


257. (L2 [T]) Почему cross-shard joins destroy locality?

     **Ответ:** Scatter-gather рассылает работу нескольким shards и объединяет результаты; latency ждёт критический хвост, cost растёт с fan-out/bytes. Co-location, pruning и precomputed projections уменьшают shipping, если сохраняется семантика.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


258. (L2 [T]) Как leader placement affects write locality in consensus-based systems?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


259. (L2 [T]) Почему follower reads can improve locality but complicate consistency?

     **Ответ:** Follower read уменьшает RTT/нагрузку лидера лишь при разрешённой freshness. Для строгого read нужны доказанная read-index/lease/required-position процедура и applied boundary; «узел здоров» не означает актуальный snapshot.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


260. (L2 [T]) Что такое rack-aware and zone-aware placement?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


261. (L2 [T]) Почему compute-locality in warehouses/analytics differs from request-locality in OLTP?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


262. (L2 [T]) Как caches interact with locality?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


263. (L2 [T]) Почему moving data to improve locality may worsen rebalance cost?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


264. (L2 [T]) Что такое hotspot due to locality preference?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


265. (L2 [T]) Почему one-size-fits-all placement policy rarely works?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


266. (L2 [P]) Реализовать rack-aware replica placement

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


267. (L2 [P]) Реализовать leader rebalancing toward write-locality goals

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


268. (L2 [P]) Реализовать locality score for placement decisions

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


269. (L2 [P]) Реализовать benchmark locality-sensitive workload vs random placement

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


270. (L2 [P]) Реализовать observability: local-read rate, cross-zone traffic, remote-write penalty

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


271. (L2 [D]) Почему users in one region suddenly see much higher latency?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Типичная ошибка:** Всегда выбирать ближайшую replica без проверки freshness/authority и запаса ёмкости.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


272. (L2 [D]) Почему local-read policy causes stale results complaints?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


273. (L2 [D]) Почему after rebalance cross-AZ traffic exploded?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


274. (L2 [D]) Почему compute nodes spend more time fetching remote blocks than processing them?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


275. (L2 [D]) Почему a “balanced” placement still performs badly for one large tenant?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


276. (L3 [T]) Как locality-aware placement interacts with consensus quorum placement?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


277. (L3 [T]) Почему moving leaders can improve writes but degrade reads or failover behavior?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


278. (L3 [T]) Как model cost of locality: RTT, bandwidth, egress cost, cache warmth, failure domains?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


279. (L3 [T]) Как design for multi-tenant locality without sacrificing isolation and fairness?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)


280. (L3 [T]) Почему object storage + local SSD cache is partly a locality optimization story?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


281. (L3 [T]) Как data locality affects compaction, repair, backup and restore workflows?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


282. (L3 [T]) Почему query planners in distributed systems must reason about locality and shipping cost?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


283. (L3 [T]) Как observability should show locality misses, remote amplification and cross-region dependencies?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


284. (L3 [T]) Почему locality problems often masquerade as generic network or CPU issues?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


285. (L3 [T]) Почему good locality architecture starts at schema/shard key design, not only at routing layer?

     **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


286. (L3 [P]) Реализовать placement simulator optimizing for latency + fault domains + balance

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


287. (L3 [P]) Реализовать query planner prototype that penalizes remote data shipping

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


288. (L3 [P]) Реализовать leader placement rebalance with tenant affinity constraints

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


289. (L3 [P]) Реализовать cache layer measuring local-hit vs remote-fetch savings

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


290. (L3 [P]) Реализовать heatmap of cross-rack/AZ/region traffic per shard/tenant

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Placement map хранит rack/AZ/region, tenant affinity и replica eligibility; routing учитывает epoch, health, freshness и capacity. Симулятор считает RTT/bytes/egress/cache warmth и проверяет fault-domain constraints до move.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


291. (L3 [D]) Как доказать, что bottleneck is poor locality rather than insufficient CPU or disk?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants. Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


292. (L3 [D]) Почему after making leader local for one tenant, another tenant’s SLA degraded?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


293. (L3 [D]) Как расследовать locality regression after schema/shard-key change?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


294. (L3 [D]) Почему planner chooses remote-heavy plan despite local replica availability?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants. Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


295. (L3 [D]) Как identify hidden cross-region dependency causing bimodal latency?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


296. (L4 [S]) Как выбирать locality strategy for OLTP, analytics and geo-distributed products?

     **Ответ:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


297. (L4 [S]) Когда стоит платить higher replication/storage cost ради better locality?

     **Ответ:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


298. (L4 [S]) Как design shard keys and placement policies together, not separately?

     **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail.

     **Рекомендация:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


299. (L4 [S]) Как explain to teams that locality is a first-class design axis, not an optimization after launch?

     **Ответ:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


300. (L4 [S]) Как build platform primitives so product teams get locality benefits without hand-tuning every service?

     **Ответ:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как distributed databases, consensus and quorums together define storage semantics under failure?

     **Ответ:** Storage quorum определяет, чьи версии/ACK участвовали в операции, но не atomicity нескольких бизнес-объектов. Даже корректные key-level reads/writes могут нарушить multi-key invariant без транзакционного/доменного протокола.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


302. (L2 [T]) Почему partition tolerance and data locality often pull design in opposite directions?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


303. (L2 [T]) Почему consensus solves leader agreement, but not cross-shard transaction semantics automatically?

     **Ответ:** Raft/Paxos согласуют решения/журнал при модели отказов; safety и liveness различаются. В Raft durable term/vote, log matching, up-to-date election и majority commit работают совместно; heartbeat сам по себе не доказывает право писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


304. (L2 [T]) Как quorum reads/writes and leader-based consensus represent two different coordination models?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


305. (L2 [T]) Почему distributed storage performance usually limited by coordination and placement, not raw disk speed alone?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


306. (L2 [T]) Как routing metadata, leader placement and shard locality interact in every request?

     **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


307. (L2 [T]) Почему network partitions, stale metadata and retries together often create bigger incidents than one hardware failure?

     **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


308. (L2 [T]) Как control plane reliability becomes as important as data plane reliability in distributed storage?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


309. (L2 [T]) Почему observability must be per-shard, per-region, per-consensus-group, not only cluster-wide?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


310. (L2 [T]) Почему most production incidents in distributed storage are coordination failures with storage symptoms?

     **Ответ:** Distributed storage разделяет data/routing/replication между узлами. Consensus одной группы даёт упорядоченный replicated log, но не автоматически global transactions, корректный query plan, backup или доступность при любой partition.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


311. (L2 [P]) Реализовать mini distributed store: sharding + replication + Raft-like leader + locality-aware reads

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


312. (L2 [P]) Реализовать dashboard: leader changes, quorum failures, stale reads, cross-region traffic, partition events

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos harness: network partition, slow disk on leader, stale metadata, reconfiguration

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


314. (L2 [P]) Реализовать simulator comparing quorum-based leaderless vs consensus-based leadered design

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


315. (L2 [P]) Реализовать end-to-end trace: client → router → shard leader → replicas → commit ACK

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


316. (L3 [D]) Почему p50 latency acceptable, but p99 collapses only during leader changes and topology events?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


317. (L3 [D]) Почему cluster appears healthy globally, yet one region sees repeated stale reads and timeouts?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


318. (L3 [D]) Как доказать, что root cause is poor placement/locality rather than insufficient hardware?

     **Ответ:** Построить per-shard/tenant heatmap local/remote traffic, read freshness, leader placement и critical-path traces. Проверить schema/shard-key change, cross-shard joins и скрытую remote dependency; balanced bytes не гарантируют locality.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


319. (L3 [D]) Почему after improving availability via local quorums product correctness complaints increased?

     **Ответ:** Quorum пересечение зависит от конкретного replica set/topology. Local quorum не обещает свежесть в другом регионе, sloppy quorum может ждать другой набор nodes; простое R+W>N без этих предпосылок вводит в заблуждение. Для ключа восстановить membership/version/ACK history, resolver и repair/hinted handoff. Проверить local/global scope, overlapping epochs и coordinator crash: partial successful writes могут наблюдаться даже при timeout клиенту.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


320. (L3 [D]) Как расследовать incident “данные не потерялись, но distributed behavior became unpredictable”?

     **Ответ:** Разбить симптомы по shard/group/region: leader term, commit/apply lag, quorum, route epoch и remote RTT. Проследить operation ID end-to-end и восстановить ACK history; здоровый cluster aggregate скрывает локальный отказ.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


321. (L4 [S]) Как выбирать between distributed SQL, leaderless KV, multi-Raft storage and simpler replicated single-writer systems?

     **Ответ:** Выбирать проверенную реализацию, majority в независимых fault domains и bounded log/snapshot recovery. Для membership использовать доказанный overlapping/joint protocol; быстрый failover не должен нарушать единственность committed history.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


322. (L4 [S]) Какие platform guardrails нужны, чтобы команды не ломали locality, quorum safety or partition behavior accidentally?

     **Ответ:** Выбирать N/R/W и topology из exact consistency/availability/latency требований. Для строгого порядка consensus leader может быть проще; tunable levels требуют guardrails и понятного поведения при partition/retry.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


323. (L4 [S]) Как строить engineering process for distributed storage design reviews before scale exposes weak assumptions?

     **Ответ:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


324. (L4 [S]) Какие anti-patterns чаще всего приводят к painful distributed storage incidents a year later?

     **Ответ:** Выбрать точные transaction/replication/partition semantics по инвариантам, затем placement, capacity и recovery. Сравнить цену распределённости с replicated single-writer и не добавлять global coordination без необходимости.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Raft paper](https://raft.github.io/raft.pdf)


325. (L4 [S]) Как объяснять организации, что distributed storage systems — это прежде всего discipline of coordination, placement and failure semantics, а не просто “база данных на нескольких машинах”?

     **Ответ:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)
