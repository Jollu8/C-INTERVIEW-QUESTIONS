# 🧩 5. Партиционирование и шардинг

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

## 🔹 Range partitioning

1. (L1 [T]) Что такое range partitioning?

   **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

   **Пример:** При границах [0,100) и [100,200) ключ 100 принадлежит второму диапазону.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


2. (L1 [T]) По какому принципу данные распределяются между range partitions?

   **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


3. (L1 [T]) Чем range partitioning отличается от hash partitioning?

   **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


4. (L1 [T]) Какие типы ключей особенно хорошо подходят для range partitioning?

   **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


5. (L1 [T]) Почему временные ряды часто партиционируют по диапазонам времени?

   **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


6. (L1 [T]) Что такое partition key в range-based схеме?

   **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


7. (L1 [T]) Что происходит, если ключ не попадает ни в один диапазон?

   **Ответ:** При отсутствии подходящей partition операция должна получить явную ошибку/контролируемый маршрут, а не случайного owner. Автосоздание диапазона допустимо только через согласованный catalog protocol с защитой от concurrent creation.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


8. (L1 [T]) Почему range partitioning удобно для range scan запросов?

   **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

   **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


9. (L1 [T]) Что такое partition pruning?

   **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


10. (L1 [T]) Какие базовые риски у range partitioning?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


11. (L1 [P]) Реализовать router, который направляет key в нужный range partition

    **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


12. (L1 [P]) Реализовать хранение таблицы диапазонов в памяти на C++

    **Ответ:** Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


13. (L1 [P]) Реализовать бинарный поиск по ranges

    **Ответ:** Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


14. (L1 [P]) Реализовать insert/check для новой range partition

    **Ответ:** Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


15. (L1 [P]) Реализовать simple partition pruning по предикату `WHERE key BETWEEN A AND B`

    **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила. Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


16. (L2 [T]) Почему range partitioning может приводить к hot partition?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


17. (L2 [T]) Как skew в данных влияет на размер range partitions?

    **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


18. (L2 [T]) Что такое static vs dynamic partition boundaries?

    **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


19. (L2 [T]) Почему monotonically increasing keys опасны для range sharding?

    **Ответ:** Монотонные keys в range placement направляют новые writes в крайний range, несмотря на высокую cardinality. Hash/salting или adaptive splitting меняют распределение, но влияют на ranges/locality и не распараллеливают один aggregate.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


20. (L2 [T]) Как range partitioning влияет на балансировку write workload?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


21. (L2 [T]) Как range partitioning влияет на locality данных?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


22. (L2 [T]) Почему range partitioning полезен для архивирования и retention?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


23. (L2 [T]) Как planner использует partition metadata?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


24. (L2 [T]) Чем logical partitioning отличается от physical placement?

    **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается. Logical partition — стабильная единица keyspace, physical node/shard — место её размещения. Дополнительный слой slots/buckets позволяет менять owners без полного rehash; metadata version и migration protocol становятся обязательными.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


25. (L2 [T]) Когда range partitioning плохо подходит для point lookup-heavy workload?

    **Ответ:** Range placement не делает point lookup плохим автоматически: поиск по ключу с актуальной map адресует один range. Проблемы возникают при hotspot, неудобном partition key или отсутствии pruning, а не от одного наличия диапазонов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


26. (L2 [P]) Реализовать split диапазона на два новых range partitions

    **Ответ:** Split задаёт новые непересекающиеся ranges, merge — общий range; copy/catch-up сохраняют concurrent writes. Atomically сменить catalog generation/owner и fence старый путь, cleanup после readers/rollback safety; проверить keys на границах и crash cutover.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


27. (L2 [P]) Реализовать merge соседних partitions

    **Ответ:** Split задаёт новые непересекающиеся ranges, merge — общий range; copy/catch-up сохраняют concurrent writes. Atomically сменить catalog generation/owner и fence старый путь, cleanup после readers/rollback safety; проверить keys на границах и crash cutover.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


28. (L2 [P]) Реализовать partition pruning для нескольких диапазонов

    **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила. Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


29. (L2 [P]) Реализовать migration данных при split

    **Ответ:** Split задаёт новые непересекающиеся ranges, merge — общий range; copy/catch-up сохраняют concurrent writes. Atomically сменить catalog generation/owner и fence старый путь, cleanup после readers/rollback safety; проверить keys на границах и crash cutover.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


30. (L2 [P]) Реализовать metadata table для range partitions

    **Ответ:** Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


31. (L2 [D]) Почему одна partition постоянно перегружена?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


32. (L2 [D]) Почему запрос с range filter читает все partitions?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


33. (L2 [D]) Почему после добавления новых ranges routing стал медленным?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


34. (L2 [D]) Почему insert latency выросла только для “последнего” диапазона?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


35. (L2 [D]) Почему range scan даёт непредсказуемую latency?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


36. (L3 [T]) Как проектировать range partitioning для multi-tenant системы?

    **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


37. (L3 [T]) Как выбирать boundaries при неизвестном распределении данных?

    **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


38. (L3 [T]) Как работает auto-splitting range partitions?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


39. (L3 [T]) Как сочетаются range partitions и secondary indexes?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


40. (L3 [T]) Как range partitioning влияет на compaction/vacuum/rebalance?

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


41. (L3 [T]) Как реализуется глобальный каталог диапазонов?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


42. (L3 [T]) Как маршрутизация по диапазонам кэшируется на клиентах?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


43. (L3 [T]) Как обновлять range metadata без stop-the-world?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


44. (L3 [T]) Как range partitioning влияет на distributed transactions?

    **Ответ:** Range partitioning назначает интервалы упорядоченного ключа владельцам. Упрощает range pruning/retention и locality, но монотонные вставки или большой tenant могут перегрузить последний диапазон.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


45. (L3 [T]) Почему hotspot в “right-most partition” — классическая production проблема?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


46. (L3 [P]) Реализовать concurrent range map с lock-free read path

    **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


47. (L3 [P]) Реализовать epoch/version-based обновление partition metadata

    **Ответ:** Authority выдаёт monotonic epoch/token, а принимающий write resource хранит максимальный допустимый token и отвергает старые. Persist/update authority согласуются с failover; test paused old owner после promotion и stale routing.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


48. (L3 [P]) Реализовать background splitter hot partitions

    **Ответ:** Split задаёт новые непересекающиеся ranges, merge — общий range; copy/catch-up сохраняют concurrent writes. Atomically сменить catalog generation/owner и fence старый путь, cleanup после readers/rollback safety; проверить keys на границах и crash cutover.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


49. (L3 [P]) Реализовать routing cache на стороне клиента

    **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


50. (L3 [P]) Реализовать наблюдаемость: counters по partition size, QPS, skew

    **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Хранить непересекающиеся bounds [lo,hi), binary-search routing и версию карты. Split копирует диапазон/догоняет изменения и переключает owner; проверить boundary keys, holes/overlap и concurrent insert.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


51. (L3 [D]) Как диагностировать hotspot по последнему диапазону?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


52. (L3 [D]) Почему rebalance не успевает за ростом writes?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


53. (L3 [D]) Почему stale metadata на клиентах приводит к ошибкам маршрутизации?

    **Ответ:** Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


54. (L3 [D]) Почему split partition временно ухудшает p99 latency?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


55. (L3 [D]) Как найти неправильный выбор partition key в уже работающей системе?

    **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail. Сравнить per-range QPS/bytes/p99, distribution ключей и pruning плана. Проверить rightmost hot range, stale metadata и изменение tenant skew; суммарный баланс количества строк не гарантирует баланс запросов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


56. (L4 [S]) Когда range partitioning лучше hash partitioning?

    **Ответ:** Выбирать по dominant range queries и lifecycle, заранее предусмотреть split/merge/rebalance. Совместно проектировать shard key, индексы и tenant locality, не шардировать по времени без проверки монотонного write hotspot.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


57. (L4 [S]) Как проектировать range boundaries под быстрый рост данных?

    **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

    **Рекомендация:** Выбирать по dominant range queries и lifecycle, заранее предусмотреть split/merge/rebalance. Совместно проектировать shard key, индексы и tenant locality, не шардировать по времени без проверки монотонного write hotspot.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


58. (L4 [S]) Как уменьшать hot partitions без полной миграции схемы?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

    **Рекомендация:** Выбирать по dominant range queries и lifecycle, заранее предусмотреть split/merge/rebalance. Совместно проектировать shard key, индексы и tenant locality, не шардировать по времени без проверки монотонного write hotspot.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


59. (L4 [S]) Как сочетать range partitioning с tiered storage?

    **Ответ:** Leveled ограничивает overlap большинства уровней, часто уменьшая reads/space ценой больше rewrites. Tiered/universal хранит несколько sorted runs, уменьшая часть write work, но повышая read/space costs; сравнивать steady state. Горячие данные/metadata держат в низколатентном слое, холодные — в более дешёвом durable storage. Cache miss, retrieval/request/egress cost и restore path входят в SLO; возраст не всегда равен будущей востребованности.

    **Рекомендация:** Выбирать по dominant range queries и lifecycle, заранее предусмотреть split/merge/rebalance. Совместно проектировать shard key, индексы и tenant locality, не шардировать по времени без проверки монотонного write hotspot.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


60. (L4 [S]) Как проектировать range-sharded систему под mixed OLTP + analytical workload?

    **Ответ:** Выбирать по dominant range queries и lifecycle, заранее предусмотреть split/merge/rebalance. Совместно проектировать shard key, индексы и tenant locality, не шардировать по времени без проверки монотонного write hotspot.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


---

## 🔹 Hash partitioning

61. (L1 [T]) Что такое hash partitioning?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Пример:** Стабильный slot=hash(tenant_id)%4096 отображается на owner через отдельную versioned таблицу.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


62. (L1 [T]) Как key преобразуется в partition id?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


63. (L1 [T]) Почему hash partitioning обычно даёт лучший баланс нагрузки?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


64. (L1 [T]) Чем hash partitioning отличается от range partitioning?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


65. (L1 [T]) Почему hash partitioning плохо подходит для range queries?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


66. (L1 [T]) Что такое modulo-based partitioning?

    **Ответ:** hash(key)%N меняет placement большинства ключей при изменении N. Fixed slots, consistent/rendezvous hashing уменьшают movement, но сами не переносят данные и не дают безопасный concurrent cutover.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


67. (L1 [T]) Почему важно качество hash function?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


68. (L1 [T]) Что такое partition skew даже при hash-based схеме?

    **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


69. (L1 [T]) Почему число partitions важно для routing?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


70. (L1 [T]) Какие данные особенно удобно распределять через hash partitioning?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


71. (L1 [P]) Реализовать `partition = hash(key) % N`

    **Ответ:** hash(key)%N меняет placement большинства ключей при изменении N. Fixed slots, consistent/rendezvous hashing уменьшают movement, но сами не переносят данные и не дают безопасный concurrent cutover. Определить стабильный key encoding/hash, buckets/slots→owners и versioned routing. Добавление узла выполнять через перенос buckets с catch-up и однозначным write owner; проверить collisions, negative/overflow и одинаковую карту клиентов.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


72. (L1 [P]) Реализовать hash router на C

    **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


73. (L1 [P]) Реализовать hash function для string keys

    **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


74. (L1 [P]) Реализовать тест равномерности распределения

    **Ответ:** Определить стабильный key encoding/hash, buckets/slots→owners и versioned routing. Добавление узла выполнять через перенос buckets с catch-up и однозначным write owner; проверить collisions, negative/overflow и одинаковую карту клиентов.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


75. (L1 [P]) Реализовать метрики по количеству ключей на partition

    **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


76. (L2 [T]) Почему modulo-based partitioning плохо переносит изменение числа shards?

    **Ответ:** hash(key)%N меняет placement большинства ключей при изменении N. Fixed slots, consistent/rendezvous hashing уменьшают movement, но сами не переносят данные и не дают безопасный concurrent cutover.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


77. (L2 [T]) Что такое skewed key distribution?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


78. (L2 [T]) Почему “равномерный hash” не всегда означает равномерный workload?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


79. (L2 [T]) Как hot keys влияют на hash-sharded систему?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


80. (L2 [T]) Что такое virtual partitions / logical buckets?

    **Ответ:** Logical partition — стабильная единица keyspace, physical node/shard — место её размещения. Дополнительный слой slots/buckets позволяет менять owners без полного rehash; metadata version и migration protocol становятся обязательными.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


81. (L2 [T]) Почему часто разделяют logical partitions и physical shards?

    **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается. Logical partition — стабильная единица keyspace, physical node/shard — место её размещения. Дополнительный слой slots/buckets позволяет менять owners без полного rehash; metadata version и migration protocol становятся обязательными.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


82. (L2 [T]) Как hash partitioning влияет на join/locality?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


83. (L2 [T]) Почему scatter-gather часто неизбежен?

    **Ответ:** Scatter-gather рассылает работу нескольким shards и объединяет результаты; latency ждёт критический хвост, cost растёт с fan-out/bytes. Co-location, pruning и precomputed projections уменьшают shipping, если сохраняется семантика.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


84. (L2 [T]) Как hash partitioning влияет на cross-shard transactions?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


85. (L2 [T]) Когда hash partitioning хуже range даже для OLTP?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


86. (L2 [P]) Реализовать слой virtual buckets поверх physical shards

    **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

    **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


87. (L2 [P]) Реализовать remapping buckets → shards

    **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

    **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


88. (L2 [P]) Реализовать hot-key detector

    **Ответ:** Определить стабильный key encoding/hash, buckets/slots→owners и versioned routing. Добавление узла выполнять через перенос buckets с catch-up и однозначным write owner; проверить collisions, negative/overflow и одинаковую карту клиентов.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


89. (L2 [P]) Реализовать rebalance отдельных buckets

    **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


90. (L2 [P]) Реализовать benchmark равномерности по key-space и по request distribution

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


91. (L2 [D]) Почему shards формально равны по размеру, но не равны по CPU?

    **Ответ:** Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


92. (L2 [D]) Почему одна shard перегружена при “хорошем” hash?

    **Ответ:** Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


93. (L2 [D]) Почему scatter-gather резко увеличил latency?

    **Ответ:** Scatter-gather рассылает работу нескольким shards и объединяет результаты; latency ждёт критический хвост, cost растёт с fan-out/bytes. Co-location, pruning и precomputed projections уменьшают shipping, если сохраняется семантика. Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


94. (L2 [D]) Почему после увеличения числа shards пришлось мигрировать почти все данные?

    **Ответ:** Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


95. (L2 [D]) Почему hash routing стал bottleneck на клиенте?

    **Ответ:** Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


96. (L3 [T]) Как проектировать hash partitioning для миллиардов keys?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


97. (L3 [T]) Как выбирать число virtual buckets?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


98. (L3 [T]) Как hash partitioning сочетается с replication?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


99. (L3 [T]) Как поддерживать metadata о bucket placement?

    **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


100. (L3 [T]) Что такое rendezvous hashing и как оно связано с shard placement?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


101. (L3 [T]) Как hash partitioning влияет на cache locality?

     **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


102. (L3 [T]) Как выбирать hash function с учётом CPU/cache/DoS risks?

     **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


103. (L3 [T]) Как работает client-side routing в hash-sharded системе?

     **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


104. (L3 [T]) Как бороться с hot buckets?

     **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


105. (L3 [T]) Почему слишком мелкие buckets тоже создают overhead?

     **Ответ:** Hash partitioning распределяет по hash(key), обычно улучшая распределение разных ключей. Он теряет естественный порядок диапазонов; один популярный ключ остаётся у одного owner, а hash(key)%N вызывает большой перенос при изменении N.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


106. (L3 [P]) Реализовать bucket map с versioned metadata

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


107. (L3 [P]) Реализовать incremental rebalance на уровне buckets

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


108. (L3 [P]) Реализовать cache-friendly hash routing table

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


109. (L3 [P]) Реализовать hot-bucket split/migrate

     **Ответ:** Split задаёт новые непересекающиеся ranges, merge — общий range; copy/catch-up сохраняют concurrent writes. Atomically сменить catalog generation/owner и fence старый путь, cleanup после readers/rollback safety; проверить keys на границах и crash cutover.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


110. (L3 [P]) Реализовать simulation для bucket sizing и rebalance cost

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


111. (L3 [D]) Как доказать, что проблема в workload skew, а не в hash quality?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


112. (L3 [D]) Почему при NUMA один routing thread тормозит сильнее остальных?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


113. (L3 [D]) Почему rebalance buckets не улучшил p99 latency?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


114. (L3 [D]) Почему distributed cache стала неэффективной из-за hash partitioning?

     **Ответ:** Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


115. (L3 [D]) Как расследовать hash collision attack или pathological distribution?

     **Ответ:** Разделить key-count skew и request skew, снять per-slot QPS/size/latency и stale-route retries. Проверить hash quality, key extraction и single hot key: новые nodes не делят его нагрузку автоматически.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


116. (L4 [S]) Когда hash partitioning — лучший дефолт?

     **Ответ:** Подходит equality/key-local workload, если scatter-gather ranges допустим. Стабильные slots/virtual nodes упрощают migration, но нужны locality/fault-domain constraints и отдельная политика горячих tenants.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


117. (L4 [S]) Как выбрать число buckets и shards для роста на 2–3 года?

     **Ответ:** Подходит equality/key-local workload, если scatter-gather ranges допустим. Стабильные slots/virtual nodes упрощают migration, но нужны locality/fault-domain constraints и отдельная политика горячих tenants.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


118. (L4 [S]) Как проектировать hash-based routing без central coordinator в hot path?

     **Ответ:** Подходит equality/key-local workload, если scatter-gather ranges допустим. Стабильные slots/virtual nodes упрощают migration, но нужны locality/fault-domain constraints и отдельная политика горячих tenants.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


119. (L4 [S]) Как сочетать hash partitioning и locality requirements?

     **Ответ:** Подходит equality/key-local workload, если scatter-gather ranges допустим. Стабильные slots/virtual nodes упрощают migration, но нужны locality/fault-domain constraints и отдельная политика горячих tenants.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


120. (L4 [S]) Как мигрировать с modulo sharding на более гибкую схему?

     **Ответ:** hash(key)%N меняет placement большинства ключей при изменении N. Fixed slots, consistent/rendezvous hashing уменьшают movement, но сами не переносят данные и не дают безопасный concurrent cutover.

     **Рекомендация:** Подходит equality/key-local workload, если scatter-gather ranges допустим. Стабильные slots/virtual nodes упрощают migration, но нужны locality/fault-domain constraints и отдельная политика горячих tenants.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


---

## 🔹 Geo partitioning

121. (L1 [T]) Что такое geo partitioning?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


122. (L1 [T]) Зачем данные распределять по регионам/странам/continent-based zones?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


123. (L1 [T]) Чем geo partitioning отличается от обычного logical sharding?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


124. (L1 [T]) Какие типы workload выигрывают от geo partitioning?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


125. (L1 [T]) Что такое data sovereignty / data residency?

     **Ответ:** Residency ограничивает физическое размещение/обработку данных, sovereignty — требования применимой юрисдикции по заданному контракту. Placement policy должна охватывать replicas, backups, logs и temporary copies, а не только primary shard.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


126. (L1 [T]) Почему geo partitioning может уменьшать latency?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


127. (L1 [T]) Почему geo partitioning усложняет консистентность?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


128. (L1 [T]) Что такое home region для данных?

     **Ответ:** Home region — выбранный регион authority/основного placement конкретного tenant/агрегата. Он упрощает write ownership, но удалённые клиенты платят RTT; relocation требует data catch-up и authority/routing cutover.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


129. (L1 [T]) Как geo partitioning связан с multi-region deployment?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


130. (L1 [T]) Почему глобальные secondary indexes становятся сложнее?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


131. (L1 [P]) Реализовать routing по региону пользователя

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


132. (L1 [P]) Реализовать таблицу соответствия region → shard group

     **Ответ:** Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


133. (L1 [P]) Реализовать fallback routing для неизвестного региона

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


134. (L1 [P]) Реализовать placement policy для “EU only” данных

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


135. (L1 [P]) Реализовать простую модель latency-aware выбора региона

     **Ответ:** Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


136. (L2 [T]) Как выбирать geo partition key?

     **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


137. (L2 [T]) Что делать с глобальными пользователями, которые перемещаются между регионами?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


138. (L2 [T]) Как сочетать geo partitioning с replication?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


139. (L2 [T]) Что такое follower read / local read в multi-region системе?

     **Ответ:** Follower read уменьшает RTT/нагрузку лидера лишь при разрешённой freshness. Для строгого read нужны доказанная read-index/lease/required-position процедура и applied boundary; «узел здоров» не означает актуальный snapshot.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


140. (L2 [T]) Почему cross-region transaction особенно дороги?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


141. (L2 [T]) Как geo partitioning влияет на failover?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


142. (L2 [T]) Что такое regional quorum?

     **Ответ:** Regional quorum определяет, где должны находиться подтверждающие реплики. Нужно назвать количество/fault domains и режим отказа: локальное большинство одного региона не эквивалентно globally intersecting majority при двух независимых writable регионах.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


143. (L2 [T]) Как regulatory требования влияют на placement данных?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


144. (L2 [T]) Почему geo partitioning может ухудшить operational complexity?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


145. (L2 [T]) Что такое nearest-region routing и когда он опасен?

     **Ответ:** Выбор ближайшего региона сокращает RTT, но должен учитывать authority, replica freshness и capacity. Без этих проверок клиент может читать stale state либо направлять запись к неуполномоченному владельцу.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


146. (L2 [P]) Реализовать policy engine для region-aware placement

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


147. (L2 [P]) Реализовать primary region + replica regions mapping

     **Ответ:** Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


148. (L2 [P]) Реализовать workload simulation для regional latency

     **Ответ:** Fault harness должен контролировать schedules и persistence/network boundaries, сохранять seed/trace и проверять инварианты, а не только успешный restart. Отдельно моделировать process crash, power-loss, delay/loss/reorder и stale clients. Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


149. (L2 [P]) Реализовать миграцию tenant-а между регионами

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


150. (L2 [P]) Реализовать geo-aware request router

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


151. (L2 [D]) Почему latency низкая локально, но глобально система нестабильна?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


152. (L2 [D]) Почему часть запросов внезапно пошла в другой регион?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


153. (L2 [D]) Почему failover нарушил data residency policy?

     **Ответ:** Residency ограничивает физическое размещение/обработку данных, sovereignty — требования применимой юрисдикции по заданному контракту. Placement policy должна охватывать replicas, backups, logs и temporary copies, а не только primary shard. Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


154. (L2 [D]) Почему cross-region трафик неожиданно вырос?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


155. (L2 [D]) Почему multi-region writes резко просадили throughput?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


156. (L3 [T]) Как проектировать geo partitioning для multi-tenant SaaS?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


157. (L3 [T]) Как балансировать latency, residency и consistency?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


158. (L3 [T]) Как работает lease/leader placement в geo-distributed system?

     **Ответ:** Lease даёт ограниченное во времени право при оговорённых clock/communication assumptions. Pause/skew/partition могут оставить старого владельца активным, поэтому critical writes требуют resource-side fencing/consensus rules.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


159. (L3 [T]) Как глобальный каталог данных хранит region placement metadata?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


160. (L3 [T]) Как строить geo-aware query planning?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


161. (L3 [T]) Как geo partitioning влияет на backup/restore?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


162. (L3 [T]) Как проектировать global control plane и local data plane?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


163. (L3 [T]) Что делать с глобальными таблицами, которые нужны во всех регионах?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


164. (L3 [T]) Как строить observability по region skew и cross-region dependencies?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


165. (L3 [T]) Почему geo partitioning часто требует компромисса на уровне продукта, а не только БД?

     **Ответ:** Geo placement привязывает данные/владельца к региону ради RTT, residency и isolation. Близкая read replica может быть stale, а локальный leader всё равно ждёт удалённый quorum по выбранной topology.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


166. (L3 [P]) Реализовать metadata service для geo placement с versioning

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


167. (L3 [P]) Реализовать tenant relocation workflow без long downtime

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


168. (L3 [P]) Реализовать region-local read policy и global write policy

     **Ответ:** Хранить tenant/home-region и replica topology, маршрутизировать с проверкой health/capacity и consistency. Перенос региона включает copy/catch-up, fencing/version update и rollback, а не только смену DNS.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


169. (L3 [P]) Реализовать geo-aware cache invalidation

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


170. (L3 [P]) Реализовать симулятор partition placement с учётом latency и compliance

     **Ответ:** Map хранит tenant/range replicas по rack/AZ/region и allowed constraints, scoring учитывает RTT/heat/capacity/egress. До move проверить fault domains/quorum, выполнить catch-up/epoch cutover; test remote fallback и fairness для остальных tenants.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


171. (L3 [D]) Как доказать, что проблема в неверном placement policy, а не в сети?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


172. (L3 [D]) Почему при переезде tenant-а деградировали локальные индексы и cache hit rate?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


173. (L3 [D]) Почему локальный failover создал глобальную перегрузку control plane?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно. Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


174. (L3 [D]) Как расследовать нарушение residency constraints после rebalance?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


175. (L3 [D]) Почему часть данных стала “логически локальной”, но физически удалённой?

     **Ответ:** Измерить local/remote read rate, leader location, cross-region bytes/RTT и replica freshness. Проверить hidden remote dependency, stale routing и capacity региона; p99 по регионам важнее одного global percentile.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


176. (L4 [S]) Когда geo partitioning оправдан, а когда достаточно обычной репликации?

     **Ответ:** Определить residency, write ownership, допустимую stale read и regional-failure semantics. Сочетать locality с quorum/fault domains и запасом capacity, не размещать все копии рядом ради одного быстрого RTT.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


177. (L4 [S]) Как проектировать продукт с region-aware data ownership?

     **Ответ:** Определить residency, write ownership, допустимую stale read и regional-failure semantics. Сочетать locality с quorum/fault domains и запасом capacity, не размещать все копии рядом ради одного быстрого RTT.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


178. (L4 [S]) Как избежать избыточной сложности в multi-region архитектуре?

     **Ответ:** Определить residency, write ownership, допустимую stale read и regional-failure semantics. Сочетать locality с quorum/fault domains и запасом capacity, не размещать все копии рядом ради одного быстрого RTT.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


179. (L4 [S]) Как сочетать compliance, latency и disaster recovery?

     **Ответ:** Определить residency, write ownership, допустимую stale read и regional-failure semantics. Сочетать locality с quorum/fault domains и запасом capacity, не размещать все копии рядом ради одного быстрого RTT.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


180. (L4 [S]) Как формулировать для команд чёткие правила region placement?

     **Ответ:** Определить residency, write ownership, допустимую stale read и regional-failure semantics. Сочетать locality с quorum/fault domains и запасом capacity, не размещать все копии рядом ради одного быстрого RTT.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


---

## 🔹 Consistent hashing

181. (L1 [T]) Что такое consistent hashing?

     **Ответ:** Стабильное назначение ключей узлам с ограниченным переносом при изменении состава. На кольце используют tokens/virtual nodes; один hot key от этого не распараллеливается.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


182. (L1 [T]) Какую проблему он решает по сравнению с `hash(key) % N`?

     **Ответ:** hash(key)%N меняет placement большинства ключей при изменении N. Fixed slots, consistent/rendezvous hashing уменьшают movement, но сами не переносят данные и не дают безопасный concurrent cutover.

     **Пример:** Tokens 20,60,90: key hash 61 попадает к owner token 90; после конца кольца выполняется wrap-around.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


183. (L1 [T]) Что такое hash ring?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


184. (L1 [T]) Как key отображается в точку на кольце?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


185. (L1 [T]) Как выбирается узел для ключа?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


186. (L1 [T]) Почему при добавлении нового узла перемещается только часть ключей?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


187. (L1 [T]) Что такое virtual nodes?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


188. (L1 [T]) Зачем нужны virtual nodes?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


189. (L1 [T]) Чем consistent hashing полезен для distributed caches и KV stores?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


190. (L1 [T]) Какие у него базовые недостатки?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


191. (L1 [P]) Реализовать hash ring на C++

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


192. (L1 [P]) Реализовать поиск узла по ключу на кольце

     **Ответ:** Hash tokens и keys в одинаковое ordered space, выбирать successor с wrap-around, replicas — разные физические/failure-domain nodes. Хранить versioned map, тестировать добавление/удаление, collision и weighted capacity.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


193. (L1 [P]) Реализовать добавление узла

     **Ответ:** Hash tokens и keys в одинаковое ordered space, выбирать successor с wrap-around, replicas — разные физические/failure-domain nodes. Хранить versioned map, тестировать добавление/удаление, collision и weighted capacity.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


194. (L1 [P]) Реализовать удаление узла

     **Ответ:** Hash tokens и keys в одинаковое ordered space, выбирать successor с wrap-around, replicas — разные физические/failure-domain nodes. Хранить versioned map, тестировать добавление/удаление, collision и weighted capacity.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


195. (L1 [P]) Реализовать virtual nodes

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


196. (L2 [T]) Почему без virtual nodes кольцо может быть плохо сбалансировано?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


197. (L2 [T]) Как выбирать число virtual nodes?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


198. (L2 [T]) Как consistent hashing влияет на rebalance cost?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


199. (L2 [T]) Что такое preference list / replication set на кольце?

     **Ответ:** Preference list — упорядоченный набор кандидатов replicas для key. Учитывают distinct physical nodes/failure domains и fallback rules; sloppy quorum по fallback nodes меняет предпосылки обычного quorum intersection.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


200. (L2 [T]) Как consistent hashing сочетается с replication factor?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


201. (L2 [T]) Почему locality-aware placement не всегда естественно ложится на ring?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


202. (L2 [T]) Как сравнить consistent hashing и rendezvous hashing?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


203. (L2 [T]) Почему membership changes требуют согласованного metadata distribution?

     **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


204. (L2 [T]) Что происходит при node churn?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


205. (L2 [T]) Почему consistent hashing не решает проблему hot keys?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


206. (L2 [P]) Реализовать replication set поверх hash ring

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


207. (L2 [P]) Реализовать weighted nodes

     **Ответ:** Hash tokens и keys в одинаковое ordered space, выбирать successor с wrap-around, replicas — разные физические/failure-domain nodes. Хранить versioned map, тестировать добавление/удаление, collision и weighted capacity.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


208. (L2 [P]) Реализовать rebalance estimator при изменении membership

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


209. (L2 [P]) Реализовать membership versioning

     **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety. Hash tokens и keys в одинаковое ordered space, выбирать successor с wrap-around, replicas — разные физические/failure-domain nodes. Хранить versioned map, тестировать добавление/удаление, collision и weighted capacity.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


210. (L2 [P]) Реализовать мониторинг uneven ring distribution

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


211. (L2 [D]) Почему при добавлении одного узла moved data unexpectedly huge?

     **Ответ:** Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


212. (L2 [D]) Почему распределение ключей по кольцу неравномерное?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


213. (L2 [D]) Почему после node failure часть клиентов пишет в разные узлы?

     **Ответ:** Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


214. (L2 [D]) Почему stale ring metadata вызывает split-brain-like routing?

     **Ответ:** Split-brain — конфликтующие владельцы/лидеры действуют одновременно. Диагноз требует authority/term/membership и ACK history; наличие двух процессов, называющих себя leader, ещё не доказывает два committed histories при корректном quorum protocol. Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


215. (L2 [D]) Почему ring lookup стал CPU bottleneck?

     **Ответ:** Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


216. (L3 [T]) Как проектировать ring metadata dissemination в distributed system?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


217. (L3 [T]) Как consistent hashing влияет на cache hit rate при churn?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners. Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


218. (L3 [T]) Как выбирать between ring, rendezvous hashing и bucket-based schemes?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


219. (L3 [T]) Как работает incremental movement of ranges при ring update?

     **Ответ:** Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


220. (L3 [T]) Как учитывать heterogeneous node capacity?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


221. (L3 [T]) Как consistent hashing взаимодействует с failure domains?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


222. (L3 [T]) Как делать placement-aware replication across racks/AZ/regions?

     **Ответ:** Consistent hashing ограничивает перенос ключей при изменении состава. Кольцо с virtual nodes распределяет token intervals; rendezvous hashing ранжирует владельцев по score. Они не решают replication/consistency и hot-key проблему сами.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


223. (L3 [T]) Почему множество virtual nodes может ухудшать control-plane overhead?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


224. (L3 [T]) Как строить observability для ring imbalance и movement cost?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


225. (L3 [T]) Как consistent hashing реализуется в real systems вроде caches/object stores?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


226. (L3 [P]) Реализовать weighted consistent hashing с учётом capacity

     **Ответ:** Реализовать canonical hash/equality, collision resolution и bounded resize. В open addressing хранить empty/deleted states и search invariant, в chaining — корректные links/lifetime; test deliberate collisions, delete, full table и restart для durable варианта.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


227. (L3 [P]) Реализовать ring update protocol с atomic version switch

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


228. (L3 [P]) Реализовать cache for ring lookups

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


229. (L3 [P]) Реализовать failure-domain-aware placement поверх ring

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


230. (L3 [P]) Реализовать симулятор churn и key movement cost

     **Ответ:** Fault harness должен контролировать schedules и persistence/network boundaries, сохранять seed/trace и проверять инварианты, а не только успешный restart. Отдельно моделировать process crash, power-loss, delay/loss/reorder и stale clients. Hash tokens и keys в одинаковое ordered space, выбирать successor с wrap-around, replicas — разные физические/failure-domain nodes. Хранить versioned map, тестировать добавление/удаление, collision и weighted capacity.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


231. (L3 [D]) Как доказать, что деградация cache hit rate вызвана churn в ring?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


232. (L3 [D]) Почему weighted nodes создали неожиданный skew?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


233. (L3 [D]) Почему control plane перегружен частыми membership updates?

     **Ответ:** Смена membership должна сохранять нужное пересечение quorums, например через joint/overlapping конфигурации. Одновременная замена всех участников по двум несогласованным maps может нарушить safety. Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно. Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


234. (L3 [D]) Как расследовать inconsistent ring state между клиентами?

     **Ответ:** Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


235. (L3 [D]) Почему vnodes помогли с балансом, но ухудшили recovery time?

     **Ответ:** Проверить token distribution, weights, per-node requests/bytes и версию membership у клиентов. Слишком мало virtual nodes даёт skew, слишком много увеличивает metadata/migration; replay старой карты вызывает stale routes.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


236. (L4 [S]) Когда consistent hashing — правильный выбор, а когда нет?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Рекомендация:** Использовать для эластичного key-local placement, дополнять явным replication/routing/migration protocol. Выбирать число tokens по балансу/metadata cost и проверять реальный traffic skew, а не только случайные uniform keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


237. (L4 [S]) Как выбрать между ring-based и bucket-based placement?

     **Ответ:** Использовать для эластичного key-local placement, дополнять явным replication/routing/migration protocol. Выбирать число tokens по балансу/metadata cost и проверять реальный traffic skew, а не только случайные uniform keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


238. (L4 [S]) Как проектировать hashing layer для масштабирования на сотни узлов?

     **Ответ:** Использовать для эластичного key-local placement, дополнять явным replication/routing/migration protocol. Выбирать число tokens по балансу/metadata cost и проверять реальный traffic skew, а не только случайные uniform keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


239. (L4 [S]) Как минимизировать movement cost без сложного control plane?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Рекомендация:** Использовать для эластичного key-local placement, дополнять явным replication/routing/migration protocol. Выбирать число tokens по балансу/metadata cost и проверять реальный traffic skew, а не только случайные uniform keys.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


240. (L4 [S]) Как объяснить команде ограничения consistent hashing до запуска в production?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Рекомендация:** Использовать для эластичного key-local placement, дополнять явным replication/routing/migration protocol. Выбирать число tokens по балансу/metadata cost и проверять реальный traffic skew, а не только случайные uniform keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


---

## 🔹 Rebalancing

241. (L1 [T]) Что такое rebalancing в sharded системе?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


242. (L1 [T]) Зачем нужен rebalance?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


243. (L1 [T]) Какие события обычно триггерят rebalance?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


244. (L1 [T]) Чем rebalance отличается от replication?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


245. (L1 [T]) Почему rebalance может быть дорогим?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


246. (L1 [T]) Что такое data movement cost?

     **Ответ:** Перенос стоит bytes read/write/network, replay CPU и cache warmup, плюс temporary replicas/space и egress. Цель ребаланса должна учитывать этот transient cost и foreground SLO, а не только будущий ровный size.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


247. (L1 [T]) Почему во время rebalance возможна деградация latency?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


248. (L1 [T]) Что значит online rebalance?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


249. (L1 [T]) Что такое source shard и destination shard?

     **Ответ:** Source — текущий владелец/источник копии, destination — будущий владелец/приёмник. Во время copy/catch-up authority остаётся определённой, а cutover меняет owner/epoch; одинаковые bytes на двух узлах не разрешают обоим принимать writes.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


250. (L1 [T]) Почему rebalance должен сохранять correctness routing?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


251. (L1 [P]) Реализовать простую миграцию partition между двумя shards

     **Ответ:** Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


252. (L1 [P]) Реализовать state machine для migration job

     **Ответ:** Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


253. (L1 [P]) Реализовать переключение routing после копирования данных

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


254. (L1 [P]) Реализовать copy-then-cutover workflow

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


255. (L1 [P]) Реализовать progress tracking для rebalance task

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


256. (L2 [T]) Какие есть стратегии: full rebalance, incremental rebalance, hotspot rebalance?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


257. (L2 [T]) Что такое split-brain risk во время миграции?

     **Ответ:** Split-brain — конфликтующие владельцы/лидеры действуют одновременно. Диагноз требует authority/term/membership и ACK history; наличие двух процессов, называющих себя leader, ещё не доказывает два committed histories при корректном quorum protocol.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


258. (L2 [T]) Что такое dual write / dual read during migration?

     **Ответ:** Dual-read сравнивает либо выбирает два источника по явному precedence/version правилу. Silent fallback на любой успешный ответ может скрыть drift/stale state; comparison требует сопоставимой snapshot/CDC boundary и метрик расхождений.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


259. (L2 [T]) Как обеспечить consistency при live migration?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


260. (L2 [T]) Что такое cutover?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


261. (L2 [T]) Почему rebalance должен учитывать CPU, memory, disk и network одновременно?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


262. (L2 [T]) Почему “равный размер данных” не означает “равную нагрузку”?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


263. (L2 [T]) Как backpressure используется во время rebalance?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


264. (L2 [T]) Почему важно rate-limit migration traffic?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


265. (L2 [T]) Как rebalance влияет на cache warmup?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


266. (L2 [P]) Реализовать throttled migration worker

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


267. (L2 [P]) Реализовать dual-read verification при migration

     **Ответ:** Новый read path сначала сравнивает old/new results на сопоставимой boundary и пишет bounded mismatch telemetry. Явно задать authority/precedence, не маскировать drift fallback; switching разрешается после validation и max lag criteria.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


268. (L2 [P]) Реализовать background consistency checker

     **Ответ:** Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


269. (L2 [P]) Реализовать cutover с versioned metadata

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


270. (L2 [P]) Реализовать rollback migration при ошибке

     **Ответ:** Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


271. (L2 [D]) Почему после rebalance система стала медленнее, хотя shards выровнялись?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


272. (L2 [D]) Почему миграция идёт бесконечно долго?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


273. (L2 [D]) Почему p99 latency выросла только у части tenants?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


274. (L2 [D]) Почему после cutover часть запросов идёт в старый shard?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


275. (L2 [D]) Почему cache miss storm случается сразу после migration?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


276. (L3 [T]) Как строить online rebalance без потери данных и без долгого write freeze?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


277. (L3 [T]) Как обеспечивать exactly-once/at-least-once semantics для migration steps?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


278. (L3 [T]) Как проектировать migration journal/checkpoints?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


279. (L3 [T]) Как rebalance сочетается с replication и failover?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


280. (L3 [T]) Как обрабатывать concurrent writes в moving partition?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


281. (L3 [T]) Как проверять data completeness после миграции?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


282. (L3 [T]) Как выбирать, что переносить первым: hot partitions или cold partitions?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


283. (L3 [T]) Как проектировать automated rebalance без oscillation?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


284. (L3 [T]) Как моделировать cost rebalance на этапе capacity planning?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


285. (L3 [T]) Почему rebalance — это отдельная distributed system inside the system?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


286. (L3 [P]) Реализовать migration protocol: snapshot + catch-up + cutover

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


287. (L3 [P]) Реализовать change log replay для догонки writes

     **Ответ:** Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


288. (L3 [P]) Реализовать validator checksum/source-destination

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


289. (L3 [P]) Реализовать rate-limited chunk transfer

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


290. (L3 [P]) Реализовать автоматический planner для выбора partitions к переносу

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


291. (L3 [D]) Как расследовать потерю записи во время миграции partition?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


292. (L3 [D]) Почему rebalance вызывает network saturation и ломает foreground traffic?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


293. (L3 [D]) Почему metadata switch завершился, а клиенты ещё долго пишут по старому маршруту?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


294. (L3 [D]) Как доказать, что bottleneck rebalance — disk read, а не network?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


295. (L3 [D]) Почему auto-rebalance попал в oscillation loop?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева. Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


296. (L4 [S]) Когда rebalance должен быть автоматическим, а когда ручным?

     **Ответ:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


297. (L4 [S]) Как проектировать систему так, чтобы rebalance был редким и дешёвым?

     **Ответ:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


298. (L4 [S]) Как формулировать SLO для rebalancing operations?

     **Ответ:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


299. (L4 [S]) Как балансировать скорость миграции и влияние на production latency?

     **Ответ:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


300. (L4 [S]) Как строить архитектуру shard placement, устойчивую к росту, skew и hardware heterogeneity?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Рекомендация:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Чем partitioning отличается от sharding в практическом смысле?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


302. (L2 [T]) Почему выбор partition key часто важнее выбора самой схемы partitioning?

     **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


303. (L2 [T]) Как secondary indexes усложняют shard placement?

     **Ответ:** Locality — близость compute/users/leader/replicas по сетевой и аппаратной topology. Она уменьшает RTT и shipping, но конфликтует с балансом/fault domains; ближайшая replica не обязана удовлетворять freshness/consistency.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


304. (L2 [T]) Почему cross-shard joins почти всегда дорогие?

     **Ответ:** Scatter-gather рассылает работу нескольким shards и объединяет результаты; latency ждёт критический хвост, cost растёт с fan-out/bytes. Co-location, pruning и precomputed projections уменьшают shipping, если сохраняется семантика.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


305. (L2 [T]) Как партиционирование влияет на транзакции и изоляцию?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


306. (L2 [T]) Почему hot tenant и hot key — разные проблемы?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)


307. (L2 [T]) Как Linux network stack и TCP backpressure начинают влиять на shard migration?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


308. (L2 [T]) Почему NUMA и allocator overhead могут быть видны даже на routing layer?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


309. (L2 [T]) Как page cache и disk IO влияют на rebalance throughput?

     **Ответ:** Rebalance меняет владельцев/реплики, сохраняя доступность и выбранные consistency guarantees. Copy недостаточно: нужны concurrent-change catch-up, безопасная смена metadata/membership и защита старых владельцев.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


310. (L2 [T]) Почему observability по shards/buckets/regions обязательна, а не optional?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


311. (L2 [P]) Реализовать shard-aware benchmark: point lookup / range scan / hotspot workload

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


312. (L2 [P]) Реализовать dashboard метрик: shard size, QPS, rebalance lag, skew ratio

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать trace request path через router → shard → replica

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


314. (L2 [P]) Реализовать chaos test: shard loss during migration

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


315. (L2 [P]) Реализовать synthetic hotspot generator

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Состояния planned→copying→catching-up→cutover→cleanup, durable progress и migration ID. Сделать шаги идемпотентными, cutover с epoch/fencing, ограничить bytes/IO и удерживать старую копию до проверки readers/rollback.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


316. (L3 [D]) Почему после введения шардинга p50 улучшился, а p99 ухудшился?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


317. (L3 [D]) Почему system-wide CPU низкий, но одна shard перегружена?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


318. (L3 [D]) Как найти неправильный shard key до того, как система вырастет в 10 раз?

     **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail. Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


319. (L3 [D]) Почему cross-region rebalance сломал локальные SLO?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


320. (L3 [D]) Как расследовать инцидент “данные на месте, но routing периодически неверный”?

     **Ответ:** Снять movement progress, lag, bytes/second, stale routes, retries и foreground p99. Проверить stalled catch-up, disk headroom, topology constraints и oscillation; равный data size не означает равный workload.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


321. (L4 [S]) Как выбирать shard key для нового продукта, если точный workload ещё неизвестен?

     **Ответ:** Partition/shard key определяет routing, co-location и число затрагиваемых shards. Кардинальность и распределение запросов важны вместе: уникальный монотонный key в range схеме всё ещё создаёт hot tail.

     **Рекомендация:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


322. (L4 [S]) Когда выгоднее resharding, а когда — вертикально усилить hot shards?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Рекомендация:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


323. (L4 [S]) Как проектировать control plane для shard metadata?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Рекомендация:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


324. (L4 [S]) Как сочетать partitioning, replication и failover без взрывной сложности?

     **Ответ:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


325. (L4 [S]) Какие anti-patterns в sharding architecture чаще всего приводят к painful resharding через год?

     **Ответ:** Планировать incremental moves с rate limits, hysteresis и fault-domain guards. Выбор target учитывать size/heat/locality, отказаться от переноса при недостаточном capacity или невозможности безопасного cutover.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Raft paper](https://raft.github.io/raft.pdf)


---
