# 📊 12. Специализированные хранилища

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

## 🔹 Time-series DB

1. (L1 [T]) Что такое time-series database?

   **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


2. (L1 [T]) Чем time-series workload отличается от обычной OLTP БД?

   **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


3. (L1 [T]) Почему timestamp — центральная часть модели данных в TSDB?

   **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


4. (L1 [T]) Почему TSDB обычно оптимизирована под append-heavy writes?

   **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


5. (L1 [T]) Что такое retention policy?

   **Ответ:** Правила удаления данных по возрасту/объёму. Учитывать ingestion lag, query windows, backup retention и реальное время освобождения blocks.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


6. (L1 [T]) Что такое downsampling?

   **Ответ:** Снижение временного разрешения с агрегатами по окнам. Хранить необходимые count/sum/min/max, чтобы последующие агрегаты были корректны; среднее средних обычно неверно без весов.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


7. (L1 [T]) Почему time-series данные часто читаются диапазонами по времени?

   **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


8. (L1 [T]) Что такое tags и fields в time-series моделях?

   **Ответ:** Tags/labels обычно образуют идентичность и индекс ряда, fields/values — измерения; точные правила зависят от TSDB. Неограниченные значения в indexed identity создают много series, даже если каждая имеет мало точек.

   **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


9. (L1 [T]) Почему high-cardinality tags опасны для TSDB?

   **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

   **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


10. (L1 [T]) Почему компрессия особенно важна для time-series данных?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


11. (L1 [P]) Реализовать append-only storage для точек `(timestamp, value)`

    **Ответ:** Series ID/labels→time chunks с bounds/index/validity, WAL+sequence и explicit lateness policy. Encoding имеет version/anchors/overflow checks, windows используют event time/allowed lateness; test raw-oracle queries, duplicate/out-of-order и retention boundaries.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


12. (L1 [P]) Реализовать time index по диапазонам timestamp

    **Ответ:** Series ID/labels→time chunks с bounds/index/validity, WAL+sequence и explicit lateness policy. Encoding имеет version/anchors/overflow checks, windows используют event time/allowed lateness; test raw-oracle queries, duplicate/out-of-order и retention boundaries.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


13. (L1 [P]) Реализовать retention cleanup по age-based policy

    **Ответ:** Retention определяет, какие данные можно удалить по возрасту/объёму; физический reclaim может ждать block/GC boundary. Нужно учесть late ingestion, snapshots, replicas и backup/replay consumers, чтобы не уничтожить ещё нужную history. Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


14. (L1 [P]) Реализовать простую агрегацию по time window

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


15. (L1 [P]) Реализовать downsampling: 1s → 1m buckets

    **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

    **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


16. (L2 [T]) Почему chunk-based storage хорошо подходит для TSDB?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


17. (L2 [T]) Что такое delta encoding для timestamp-ов?

    **Ответ:** Delta encoding хранит difference относительно предыдущего/base значения; для регулярного времени полезна delta-of-delta. Формат должен задавать signed width/overflow и начальные anchors, decoder — точно восстанавливать исходные данные.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


18. (L2 [T]) Почему Gorilla-like compression эффективна для time-series?

    **Ответ:** Для регулярных timestamps эффективны delta/delta-of-delta, для floating-point values — XOR соседних битовых представлений. Compression зависит от ряда; special values, out-of-order и overflow требуют корректного формата/decoder. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


19. (L2 [T]) Почему out-of-order writes усложняют TSDB design?

    **Ответ:** Event time — время факта, processing time — время обработки. Watermark/allowed lateness задают, когда закрывать окно и как исправлять/отбрасывать поздние события; сортировка по arrival не восстанавливает причинный порядок.

    **Источник:** [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/)


20. (L2 [T]) Почему high-cardinality labels могут убить память и индекс?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


21. (L2 [T]) Что такое inverted index по labels/tags?

    **Ответ:** Inverted index отображает term/label в postings document/series IDs и, если нужно, positions. Query использует intersection/union и skip metadata; update/delete/merge должны учитывать versions и удалённые IDs.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


22. (L2 [T]) Почему write path в TSDB часто отделён от query path?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


23. (L2 [T]) Почему late-arriving data усложняет compaction и compression?

    **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


24. (L2 [T]) Что такое hot data vs cold data в TSDB?

    **Ответ:** Горячие данные/metadata держат в низколатентном слое, холодные — в более дешёвом durable storage. Cache miss, retrieval/request/egress cost и restore path входят в SLO; возраст не всегда равен будущей востребованности.

    **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


25. (L2 [T]) Почему TSDB часто использует tiered storage?

    **Ответ:** Leveled ограничивает overlap большинства уровней, часто уменьшая reads/space ценой больше rewrites. Tiered/universal хранит несколько sorted runs, уменьшая часть write work, но повышая read/space costs; сравнивать steady state. Горячие данные/metadata держат в низколатентном слое, холодные — в более дешёвом durable storage. Cache miss, retrieval/request/egress cost и restore path входят в SLO; возраст не всегда равен будущей востребованности.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


26. (L2 [P]) Реализовать chunk storage по fixed time windows

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


27. (L2 [P]) Реализовать delta-of-delta compression для timestamps

    **Ответ:** Series ID/labels→time chunks с bounds/index/validity, WAL+sequence и explicit lateness policy. Encoding имеет version/anchors/overflow checks, windows используют event time/allowed lateness; test raw-oracle queries, duplicate/out-of-order и retention boundaries.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


28. (L2 [P]) Реализовать label index для series selection

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


29. (L2 [P]) Реализовать batched ingestion pipeline

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


30. (L2 [P]) Реализовать rollup job с materialized aggregates

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


31. (L2 [D]) Почему write throughput резко падает при росте cardinality?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


32. (L2 [D]) Почему query latency взлетает на seemingly simple label filter?

    **Ответ:** Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


33. (L2 [D]) Почему disk usage растёт быстрее числа точек?

    **Ответ:** Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


34. (L2 [D]) Почему retention cleanup вызывает latency spikes?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Retention определяет, какие данные можно удалить по возрасту/объёму; физический reclaim может ждать block/GC boundary. Нужно учесть late ingestion, snapshots, replicas и backup/replay consumers, чтобы не уничтожить ещё нужную history. Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


35. (L2 [D]) Почему небольшое число noisy series ломает весь ingestion path?

    **Ответ:** Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


36. (L3 [T]) Как устроен storage path в Prometheus/InfluxDB-подобных системах?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


37. (L3 [T]) Как chunk compaction сочетается с immutable segment design?

    **Ответ:** Immutable/versioned backup и отдельные credentials/failure domains уменьшают риск массового удаления/заражения. Retention lock, key access и restore permissions проверяются вместе; недоступный encryption key делает целую копию бесполезной.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


38. (L3 [T]) Почему series cardinality — одна из главных production-проблем TSDB?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


39. (L3 [T]) Как проектировать memory index для миллионов/миллиардов series?

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


40. (L3 [T]) Как out-of-order ingestion влияет на compression ratio и query semantics?

    **Ответ:** Event time — время факта, processing time — время обработки. Watermark/allowed lateness задают, когда закрывать окно и как исправлять/отбрасывать поздние события; сортировка по arrival не восстанавливает причинный порядок. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


41. (L3 [T]) Как строить query engine для range scans + aggregations + label filters?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


42. (L3 [T]) Почему remote write / remote read меняют границы системы хранения?

    **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


43. (L3 [T]) Как TSDB взаимодействует с page cache, compaction и WAL?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


44. (L3 [T]) Почему retention, downsampling и cold storage надо проектировать вместе?

    **Ответ:** Downsampling хранит агрегаты по временному окну, меняя доступное разрешение. Для корректного объединения average нужны sum/count; квантили разных групп нельзя просто усреднить.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


45. (L3 [T]) Почему TSDB — это одновременно storage engine и streaming aggregation system?

    **Ответ:** TSDB организует series по timestamp+labels и хранит time chunks/blocks с WAL/compaction. Число уникальных label combinations, out-of-order и retention определяют состояние/стоимость; points count сам по себе недостаточен.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


46. (L3 [P]) Реализовать series registry с memory accounting

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


47. (L3 [P]) Реализовать background chunk compactor

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


48. (L3 [P]) Реализовать adaptive chunk size policy

    **Ответ:** Реализовать series IDs, append chunks, time bounds/index и inverted tag postings, WAL/replay и retention. Кодировать timestamps/values, проверять late data/dedup и chunk boundary; запрос сравнивать с простым raw reference.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


49. (L3 [P]) Реализовать cardinality analyzer per label/key

    **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


50. (L3 [P]) Реализовать observability: ingest lag, cardinality, chunk count, compression ratio

    **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


51. (L3 [D]) Как доказать, что bottleneck в label cardinality, а не в raw ingest rate?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


52. (L3 [D]) Почему CPU высокий, а disk/network выглядят нормальными?

    **Ответ:** Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


53. (L3 [D]) Почему query on recent data быстрая, а on older data очень медленная?

    **Ответ:** Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


54. (L3 [D]) Как расследовать out-of-order writes, ломающие compression и correctness?

    **Ответ:** Event time — время факта, processing time — время обработки. Watermark/allowed lateness задают, когда закрывать окно и как исправлять/отбрасывать поздние события; сортировка по arrival не восстанавливает причинный порядок. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться. Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


55. (L3 [D]) Почему after enabling downsampling storage cost fell, but query correctness complaints grew?

    **Ответ:** Downsampling хранит агрегаты по временному окну, меняя доступное разрешение. Для корректного объединения average нужны sum/count; квантили разных групп нельзя просто усреднить. Измерить active/new series, bytes/series, ingestion age, WAL/compaction и chunks scanned. High cardinality, churn и широкие queries могут перегрузить память/CPU при умеренных points/s; разбить по tenant/labels.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


56. (L4 [S]) Когда выбирать TSDB вместо general-purpose DB?

    **Ответ:** RPO — допустимая потеря/отставание точки восстановления, RTO — допустимое время восстановления сервиса. В RTO входят provision/download/replay/validation/routing; репликация ACK policy и tested restore определяют реальные пределы.

    **Рекомендация:** Выбирать по query windows, cardinality, out-of-order, retention/downsampling и restore. Ограничить labels/tenant budgets, отделить горячие/холодные blocks и определить freshness/aggregation semantics.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


57. (L4 [S]) Как проектировать TSDB под миллиарды points per second?

    **Ответ:** Выбирать по query windows, cardinality, out-of-order, retention/downsampling и restore. Ограничить labels/tenant budgets, отделить горячие/холодные blocks и определить freshness/aggregation semantics.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


58. (L4 [S]) Как балансировать ingest speed, retention, query flexibility и cost?

    **Ответ:** Выбирать по query windows, cardinality, out-of-order, retention/downsampling и restore. Ограничить labels/tenant budgets, отделить горячие/холодные blocks и определить freshness/aggregation semantics.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)


59. (L4 [S]) Как строить product guardrails против uncontrolled cardinality growth?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

    **Рекомендация:** Выбирать по query windows, cardinality, out-of-order, retention/downsampling и restore. Ограничить labels/tenant budgets, отделить горячие/холодные blocks и определить freshness/aggregation semantics.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


60. (L4 [S]) Как объяснять команде, что TSDB schema design начинается с labels/cardinality, а не с таблиц?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

    **Рекомендация:** Выбирать по query windows, cardinality, out-of-order, retention/downsampling и restore. Ограничить labels/tenant budgets, отделить горячие/холодные blocks и определить freshness/aggregation semantics.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


---

## 🔹 Search engines

61. (L1 [T]) Что такое search engine в контексте хранения данных?

    **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


62. (L1 [T]) Чем search engine отличается от обычной реляционной БД?

    **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


63. (L1 [T]) Что такое inverted index?

    **Ответ:** Inverted index отображает term/label в postings document/series IDs и, если нужно, positions. Query использует intersection/union и skip metadata; update/delete/merge должны учитывать versions и удалённые IDs.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


64. (L1 [T]) Почему search engines оптимизированы под text retrieval?

    **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


65. (L1 [T]) Что такое tokenization?

    **Ответ:** Analyzer преобразует текст в index/query terms: tokenizer, normalization и filters. Изменение analyzer часто требует reindex; точное keyword и analyzed text поля имеют разную equality/sort semantics.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


66. (L1 [T]) Что такое stemming/lemmatization?

    **Ответ:** Analyzer преобразует текст в index/query terms: tokenizer, normalization и filters. Изменение analyzer часто требует reindex; точное keyword и analyzed text поля имеют разную equality/sort semantics.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


67. (L1 [T]) Что такое document в search engine?

    **Ответ:** Document — логическая индексируемая сущность с fields, identity/version и mapping/analyzer semantics. Физический Lucene document после update часто представлен новым entry и deletion старого до merge.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


68. (L1 [T]) Что такое term dictionary?

    **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


69. (L1 [T]) Что такое postings list?

    **Ответ:** Inverted index отображает term/label в postings document/series IDs и, если нужно, positions. Query использует intersection/union и skip metadata; update/delete/merge должны учитывать versions и удалённые IDs.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


70. (L1 [T]) Почему ranking/scoring — часть search engine, а не только storage?

    **Ответ:** Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


71. (L1 [P]) Реализовать простейший inverted index `term -> docIDs`

    **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


72. (L1 [P]) Реализовать tokenization для plain text documents

    **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


73. (L1 [P]) Реализовать boolean AND/OR search

    **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


74. (L1 [P]) Реализовать postings list intersection

    **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


75. (L1 [P]) Реализовать простой TF-based scoring

    **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


76. (L2 [T]) Что такое BM25 и зачем нужен ranking model?

    **Ответ:** Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


77. (L2 [T]) Почему search engine часто near-real-time, а не fully transactional?

    **Ответ:** Refresh публикует новые search segments/состояние для поиска; это отдельная граница от durability/replication ACK. Частые refresh увеличивают small segments и merge cost, а долгие — задержку search visibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


78. (L2 [T]) Что такое segment-based index design?

    **Ответ:** Lucene-подобный индекс публикует immutable segments с postings/stored fields/doc values и живыми/deleted docs. Merge удаляет старый мусор и меняет file generations, потребляя временный disk/CPU и cache bandwidth.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


79. (L2 [T]) Почему search engine часто immutable segments + merge?

    **Ответ:** Immutable/versioned backup и отдельные credentials/failure domains уменьшают риск массового удаления/заражения. Retention lock, key access и restore permissions проверяются вместе; недоступный encryption key делает целую копию бесполезной.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


80. (L2 [T]) Что такое analyzer chain?

    **Ответ:** Analyzer преобразует текст в index/query terms: tokenizer, normalization и filters. Изменение analyzer часто требует reindex; точное keyword и analyzed text поля имеют разную equality/sort semantics. Устаревшие/недостаточные statistics искажает rows/selectivity, меняя join/index decisions. ANALYZE полезен, но sampling/skew/correlations остаются; сравнить estimates и actual до и после, не форсировать план вслепую.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


81. (L2 [T]) Почему language-specific processing усложняет indexing?

    **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


82. (L2 [T]) Что такое faceting и aggregations в search systems?

    **Ответ:** Doc values — columnar-подобное представление для sort/aggregations, postings — путь от term к documents. Facets/high-cardinality aggregations требуют memory/CPU и могут быть дороже самого text retrieval.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


83. (L2 [T]) Почему updates/deletes дороже, чем insert-only indexing?

    **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


84. (L2 [T]) Что такое doc values / columnar side storage?

    **Ответ:** Doc values — columnar-подобное представление для sort/aggregations, postings — путь от term к documents. Facets/high-cardinality aggregations требуют memory/CPU и могут быть дороже самого text retrieval.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


85. (L2 [T]) Почему relevance и consistency — разные оси качества search system?

    **Ответ:** Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


86. (L2 [P]) Реализовать positional postings для phrase queries

    **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


87. (L2 [P]) Реализовать BM25-like scoring

    **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


88. (L2 [P]) Реализовать segment merge

    **Ответ:** Tokenizer/analyzer → term dictionary → sorted postings/positions, query объединяет/пересекает списки и считает score. Хранить doc versions/deletes, merge immutable segments; проверять update, refresh и отличия точного/анализируемого поля.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


89. (L2 [P]) Реализовать delete tombstones and background merge cleanup

    **Ответ:** DELETE добавляет versioned tombstone, lookup подавляет более старые values. Compaction удаляет marker лишь после проверки snapshots и охвата старых copies/levels; test строит «new tombstone + hidden older value» и проверяет отсутствие resurrection.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


90. (L2 [P]) Реализовать facet counter over indexed docs

    **Ответ:** Tokenizer/analyzer → term dictionary → sorted postings/positions, query объединяет/пересекает списки и считает score. Хранить doc versions/deletes, merge immutable segments; проверять update, refresh и отличия точного/анализируемого поля.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


91. (L2 [D]) Почему search freshness отстаёт от write path?

    **Ответ:** Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


92. (L2 [D]) Почему индекс растёт быстрее raw document corpus?

    **Ответ:** Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


93. (L2 [D]) Почему merge job убивает query latency?

    **Ответ:** Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


94. (L2 [D]) Почему phrase query медленная, хотя term query быстрая?

    **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


95. (L2 [D]) Почему ranking кажется “сломанным”, хотя данные есть?

    **Ответ:** Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса. Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


96. (L3 [T]) Как устроен Lucene-like segment architecture?

    **Ответ:** Lucene-подобный индекс публикует immutable segments с postings/stored fields/doc values и живыми/deleted docs. Merge удаляет старый мусор и меняет file generations, потребляя временный disk/CPU и cache bandwidth.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


97. (L3 [T]) Как FST/term dictionary layout влияет на memory and CPU?

    **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


98. (L3 [T]) Почему postings compression критична для search at scale?

    **Ответ:** Inverted index отображает term/label в postings document/series IDs и, если нужно, positions. Query использует intersection/union и skip metadata; update/delete/merge должны учитывать versions и удалённые IDs. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


99. (L3 [T]) Как index merging влияет на write amplification и cache locality?

    **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

    **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


100. (L3 [T]) Как query planner search engine-а выбирает term ordering and execution strategy?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


101. (L3 [T]) Как search clusters шардируют index and route queries?

     **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


102. (L3 [T]) Почему aggregations/facets превращают search engine partly into analytical engine?

     **Ответ:** Doc values — columnar-подобное представление для sort/aggregations, postings — путь от term к documents. Facets/high-cardinality aggregations требуют memory/CPU и могут быть дороже самого text retrieval.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


103. (L3 [T]) Как consistency/replication/failover проектируются для NRT search?

     **Ответ:** Search engine строит inverted index term→postings и ranking/filtering поверх документов. Analyzer/tokenization определяет смысл совпадений, refresh — видимость новых записей; shard replicas и backup имеют разные роли.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


104. (L3 [T]) Почему analyzers and mappings are schema evolution problems too?

     **Ответ:** Analyzer преобразует текст в index/query terms: tokenizer, normalization и filters. Изменение analyzer часто требует reindex; точное keyword и analyzed text поля имеют разную equality/sort semantics. Устаревшие/недостаточные statistics искажает rows/selectivity, меняя join/index decisions. ANALYZE полезен, но sampling/skew/correlations остаются; сравнить estimates и actual до и после, не форсировать план вслепую.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


105. (L3 [T]) Почему search engine performance — это смесь CPU cache, compression, merge policy и query skew?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


106. (L3 [P]) Реализовать compressed postings lists

     **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


107. (L3 [P]) Реализовать query execution for phrase + boolean + ranking

     **Ответ:** Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса. Tokenizer/analyzer → term dictionary → sorted postings/positions, query объединяет/пересекает списки и считает score. Хранить doc versions/deletes, merge immutable segments; проверять update, refresh и отличия точного/анализируемого поля.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


108. (L3 [P]) Реализовать shard-aware distributed search fan-out

     **Ответ:** Зафиксировать analyzer/mapping, построить term→sorted IDs/positions и versioned docs/delete markers, query пересекает postings. Refresh/merge и doc-values имеют отдельные stages; test exact vs analyzed fields, update/delete и reindex compatibility.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


109. (L3 [P]) Реализовать merge scheduler с IO throttling

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


110. (L3 [P]) Реализовать observability: freshness lag, segment count, query latency, merge debt

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


111. (L3 [D]) Как доказать, что bottleneck в segment merges, а не в query parser?

     **Ответ:** Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


112. (L3 [D]) Почему одна shard search cluster деградирует сильнее остальных?

     **Ответ:** Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


113. (L3 [D]) Как расследовать poor relevance после schema/analyzer change?

     **Ответ:** Analyzer преобразует текст в index/query terms: tokenizer, normalization и filters. Изменение analyzer часто требует reindex; точное keyword и analyzed text поля имеют разную equality/sort semantics. Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса. Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


114. (L3 [D]) Почему high CPU search cluster caused by scoring, not by IO?

     **Ответ:** Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


115. (L3 [D]) Почему after adding faceting p99 latency exploded?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Doc values — columnar-подобное представление для sort/aggregations, postings — путь от term к documents. Facets/high-cardinality aggregations требуют memory/CPU и могут быть дороже самого text retrieval. Снять per-shard docs/segments, refresh/merge, query breakdown и top terms/cardinality. Проверить analyzer/mapping, skew, deleted docs и fan-out; «документ записан» не всегда значит уже searchable.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


116. (L4 [S]) Когда использовать search engine, а не SQL `LIKE`/GIN/FTS в обычной БД?

     **Ответ:** Использовать как поисковую проекцию с явным canonical source/reindex path, если инварианты требуют отдельного OLTP store. Планировать mapping evolution, shard size, relevance, freshness и disk headroom на merges.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


117. (L4 [S]) Как проектировать source-of-truth vs derived-search-index architecture?

     **Ответ:** Использовать как поисковую проекцию с явным canonical source/reindex path, если инварианты требуют отдельного OLTP store. Планировать mapping evolution, shard size, relevance, freshness и disk headroom на merges.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


118. (L4 [S]) Как балансировать freshness, relevance, indexing cost и operational complexity?

     **Ответ:** Ranking использует term statistics и признаки запроса/документа; BM25 не является произвольным business rank. Оценивать relevance на размеченных/online сценариях вместе с latency, не только score одного запроса.

     **Рекомендация:** Использовать как поисковую проекцию с явным canonical source/reindex path, если инварианты требуют отдельного OLTP store. Планировать mapping evolution, shard size, relevance, freshness и disk headroom на merges.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


119. (L4 [S]) Как строить schema/mapping governance для search at scale?

     **Ответ:** Использовать как поисковую проекцию с явным canonical source/reindex path, если инварианты требуют отдельного OLTP store. Планировать mapping evolution, shard size, relevance, freshness и disk headroom на merges.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


120. (L4 [S]) Как объяснять команде, что search engine — это specialized derived system, а не general-purpose DB replacement?

     **Ответ:** RPO — допустимая потеря/отставание точки восстановления, RTO — допустимое время восстановления сервиса. В RTO входят provision/download/replay/validation/routing; репликация ACK policy и tested restore определяют реальные пределы.

     **Рекомендация:** Использовать как поисковую проекцию с явным canonical source/reindex path, если инварианты требуют отдельного OLTP store. Планировать mapping evolution, shard size, relevance, freshness и disk headroom на merges.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)


---

## 🔹 Analytical warehouses

121. (L1 [T]) Что такое analytical warehouse?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


122. (L1 [T]) Чем analytical warehouse отличается от OLTP БД?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


123. (L1 [T]) Почему columnar storage хорошо подходит для аналитики?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


124. (L1 [T]) Что такое large scan + aggregation workload?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


125. (L1 [T]) Почему analytical engines оптимизируют throughput, а не single-row latency?

     **Ответ:** Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно.

     **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


126. (L1 [T]) Что такое star schema?

     **Ответ:** Факт-таблица с измерениями, присоединяемыми напрямую: звездообразная схема упрощает аналитические запросы. Гранулярность факта и ключи измерений должны быть явными.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


127. (L1 [T]) Что такое fact table и dimension table?

     **Ответ:** Fact table хранит события/измерения на объявленной гранулярности, dimension — описательные атрибуты и ключи; star соединяет fact напрямую с dimensions. Корректная grain/uniqueness важнее одной формы диаграммы.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


128. (L1 [T]) Что такое partition pruning в warehouse?

     **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


129. (L1 [T]) Почему compression играет огромную роль в warehouses?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


130. (L1 [T]) Почему ETL/ELT часто часть warehouse architecture?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


131. (L1 [P]) Реализовать columnar storage for fixed schema table

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


132. (L1 [P]) Реализовать scan of selected columns only

     **Ответ:** Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


133. (L1 [P]) Реализовать simple aggregate over billions-like synthetic rows

     **Ответ:** Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


134. (L1 [P]) Реализовать dictionary encoding for one column

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


135. (L1 [P]) Реализовать partition pruning по дате

     **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила. Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


136. (L2 [T]) Что такое vectorized execution и почему оно полезно в analytics?

     **Ответ:** Vectorized batches уменьшают per-row overhead и помогают SIMD, но memory bandwidth/gather/variable-length types могут ограничить выигрыш. Нужны feature detection, безопасный tail и scalar oracle; наличие vector instructions само не доказывает ускорение.

     **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


137. (L2 [T]) Что такое predicate pushdown?

     **Ответ:** Безопасный перенос фильтра ближе к scan/source, чтобы сократить downstream rows/bytes. Не все выражения можно переносить через outer join, aggregation или volatile функции.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


138. (L2 [T]) Почему late materialization уменьшает memory traffic?

     **Ответ:** Late materialization переносит selection/row IDs и собирает полные значения после фильтров. Экономит копирование, но при низкой селективности и scattered survivors может увеличить random fetch. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


139. (L2 [T]) Что такое file formats Parquet/ORC/Iceberg-like tables?

     **Ответ:** Parquet группирует строки в row groups, внутри — column chunks из pages с encoding/metadata. ORC использует собственную организацию stripes; размеры этих единиц меняют pruning, parallelism, compression и request overhead.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


140. (L2 [T]) Почему warehouses часто отделяют compute и storage?

     **Ответ:** Разделение storage/compute позволяет независимо масштабировать ресурсы, но добавляет remote fetch, metadata и cache warmup. Локальный SSD cache меняет hit path, не заменяя durable object source и consistency manifests.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


141. (L2 [T]) Что такое micro-partitions / column chunks?

     **Ответ:** Parquet группирует строки в row groups, внутри — column chunks из pages с encoding/metadata. ORC использует собственную организацию stripes; размеры этих единиц меняют pruning, parallelism, compression и request overhead.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


142. (L2 [T]) Почему sort/cluster keys важны для pruning?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


143. (L2 [T]) Почему small files problem опасна для warehouses?

     **Ответ:** Множество мелких файлов/objects повышает metadata/list/open/request overhead и ухудшает batching. Compaction уменьшает число requests, но увеличивает стоимость переписывания и задержку публикации.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


144. (L2 [T]) Что такое spill to disk в execution engines?

     **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


145. (L2 [T]) Почему analytical query может быть CPU-bound even on remote storage?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


146. (L2 [P]) Реализовать vectorized filter over column batches

     **Ответ:** Сначала scalar oracle, затем typed batches/selection+validity masks, CPU feature detection и безопасный tail. Не читать за bounds, сохранять backing lifetime; проверить NULL/overflow/NaN semantics и сравнить instructions/row/bytes, а не только throughput.

     **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library)


147. (L2 [P]) Реализовать predicate pushdown на chunk metadata

     **Ответ:** Определить required fields и безопасные predicates из AST, передать scan/source до materialization. Сохранять outer-join/NULL/volatile semantics, metadata pruning применять лишь при доказанном отсутствии matches; test против full scan.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


148. (L2 [P]) Реализовать late materialization for projected columns

     **Ответ:** Late materialization переносит selection/row IDs и собирает полные значения после фильтров. Экономит копирование, но при низкой селективности и scattered survivors может увеличить random fetch. Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


149. (L2 [P]) Реализовать simple cost-based choice: scan compressed vs materialize early

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться. Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


150. (L2 [P]) Реализовать benchmark row-store vs column-store on aggregation queries

     **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


151. (L2 [D]) Почему warehouse scan читает почти всё, хотя WHERE выглядит selective?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


152. (L2 [D]) Почему after partitioning performance not improved?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


153. (L2 [D]) Почему many small files killed query planning and open latency?

     **Ответ:** Множество мелких файлов/objects повышает metadata/list/open/request overhead и ухудшает batching. Compaction уменьшает число requests, но увеличивает стоимость переписывания и задержку публикации. Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


154. (L2 [D]) Почему spill случается при seemingly moderate dataset?

     **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency. Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


155. (L2 [D]) Почему one dashboard query saturates cluster CPU?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Свести timeline p99/errors с per-stage waits, topology/maintenance и recent changes. Проверить missing signals/sampling и агрегирование; зелёный global dashboard не опровергает жалобу одного tenant/region.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


156. (L3 [T]) Как устроены modern analytical warehouses: file metadata + optimizer + distributed execution?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


157. (L3 [T]) Как data skipping statistics уменьшают scan cost?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


158. (L3 [T]) Как warehouses используют remote object storage efficiently?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


159. (L3 [T]) Почему compaction/clustering and file maintenance — центральная operational задача?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


160. (L3 [T]) Как query optimizer учитывает remote IO, decompression, network shuffle and CPU?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


161. (L3 [T]) Как distributed joins и aggregations проектируются в warehouse?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


162. (L3 [T]) Почему multi-tenant warehouses требуют governance on query slots/resources?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


163. (L3 [T]) Как materialized views/caching interplay with freshness and cost?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


164. (L3 [T]) Почему schema evolution в warehouses зависит от formats/metadata tables?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


165. (L3 [T]) Почему analytical warehouse — это сочетание storage layout, metadata plane и execution engine?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


166. (L3 [P]) Реализовать distributed scan + partial aggregate + final reduce

     **Ответ:** Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


167. (L3 [P]) Реализовать metadata-driven file pruning

     **Ответ:** Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


168. (L3 [P]) Реализовать small-files compaction planner

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


169. (L3 [P]) Реализовать query resource governor

     **Ответ:** Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


170. (L3 [P]) Реализовать observability: bytes scanned, files touched, spill bytes, shuffle bytes, CPU/vector efficiency

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


171. (L3 [D]) Как доказать, что bottleneck в file layout/pruning, а не в SQL syntax itself?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


172. (L3 [D]) Почему after clustering cost dropped for one query type but rose for another?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


173. (L3 [D]) Как расследовать runaway query, съедающую весь warehouse?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


174. (L3 [D]) Почему compute scale-up didn’t help because remote storage open/list cost dominated?

     **Ответ:** Разделение storage/compute позволяет независимо масштабировать ресурсы, но добавляет remote fetch, metadata и cache warmup. Локальный SSD cache меняет hit path, не заменяя durable object source и consistency manifests. Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


175. (L3 [D]) Почему results correct, but freshness and performance complaints appear after compaction?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


176. (L4 [S]) Когда строить warehouse отдельно от OLTP systems?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


177. (L4 [S]) Как выбирать between self-managed warehouse stack and managed service?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


178. (L4 [S]) Как проектировать file layout, partitioning, clustering and retention together?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


179. (L4 [S]) Как балансировать cost, freshness and query flexibility in analytics platform?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


180. (L4 [S]) Как объяснять команде, что warehouse performance начинается с data layout and ingestion discipline, а не только с “больше compute”?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


---

## 🔹 Blob / object storage

181. (L1 [T]) Что такое blob storage?

     **Ответ:** Blob/object адресуется ключом внутри bucket/container, с bytes и metadata. Key не обязан быть файловым путём, slash может быть только частью имени; multi-object namespace/rename/POSIX semantics надо проверять отдельно.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


182. (L1 [T]) Что такое object storage?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


183. (L1 [T]) Чем object storage отличается от block storage и filesystem?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


184. (L1 [T]) Почему object storage хорошо подходит для больших immutable objects?

     **Ответ:** Immutable/versioned backup и отдельные credentials/failure domains уменьшают риск массового удаления/заражения. Retention lock, key access и restore permissions проверяются вместе; недоступный encryption key делает целую копию бесполезной.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


185. (L1 [T]) Что такое bucket/container?

     **Ответ:** Blob/object адресуется ключом внутри bucket/container, с bytes и metadata. Key не обязан быть файловым путём, slash может быть только частью имени; multi-object namespace/rename/POSIX semantics надо проверять отдельно.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


186. (L1 [T]) Что такое key/object name?

     **Ответ:** Blob/object адресуется ключом внутри bucket/container, с bytes и metadata. Key не обязан быть файловым путём, slash может быть только частью имени; multi-object namespace/rename/POSIX semantics надо проверять отдельно.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


187. (L1 [T]) Почему object storage обычно не даёт POSIX semantics?

     **Ответ:** Object API не обязан поддерживать POSIX random write/atomic rename/append. Обычно используют immutable generations и manifest pointer; copy+delete не приравнивается к атомарному filesystem rename.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


188. (L1 [T]) Почему object storage часто используется как cheap durable storage tier?

     **Ответ:** Высокая durability object service относится к сохранности объектов по его модели, а не к полноте/согласованности вашего backup. Неправильный key, недописанный manifest, удаление или потеря encryption key остаются рисками уровня приложения.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


189. (L1 [T]) Почему latency object storage сильно выше локального диска?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


190. (L1 [T]) Почему object storage отлично подходит для backups, media, data lakes?

     **Ответ:** Column files на object store сами по себе не дают table transactions/schema evolution. Нужны catalog/manifest и protocol publication/snapshot/GC, совместимый с читателями; lifecycle не должен удалять referenced generations.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


191. (L1 [P]) Реализовать простое key->blob storage на файловой системе

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


192. (L1 [P]) Реализовать multipart upload для больших объектов

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


193. (L1 [P]) Реализовать metadata alongside blob

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


194. (L1 [P]) Реализовать range-read for large object

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


195. (L1 [P]) Реализовать content checksum verification

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


196. (L2 [T]) Почему object storage часто eventually consistent or API-specific consistent?

     **Ответ:** Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


197. (L2 [T]) Что такое multipart upload и зачем он нужен?

     **Ответ:** Multipart upload становится целым объектом по протоколу complete; незавершённые parts требуют cleanup. Согласованность коллекции объектов обеспечивают versioned manifest и publication protocol, не multi-object atomicity обычного PUT.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


198. (L2 [T]) Почему listing objects — отдельная expensive operation?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


199. (L2 [T]) Что такое object versioning?

     **Ответ:** Versioning сохраняет поколения одного key и позволяет адресовать/восстанавливать конкретную версию. Delete marker, lifecycle и permissions могут скрыть/удалить history; это не автоматически независимый immutable backup.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


200. (L2 [T]) Почему small objects могут быть неэффективны в object storage?

     **Ответ:** Множество мелких файлов/objects повышает metadata/list/open/request overhead и ухудшает batching. Compaction уменьшает число requests, но увеличивает стоимость переписывания и задержку публикации.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


201. (L2 [T]) Что такое lifecycle policy и tiering?

     **Ответ:** Lifecycle автоматизирует переход/удаление generations/objects по правилам возраста/класса. Нужно учитывать referenced manifests, restore/retrieval delay/cost и retention consumers, иначе холодный tier может нарушить SLO или recovery.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


202. (L2 [T]) Почему delete semantics в object storage может быть tricky?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


203. (L2 [T]) Почему object storage часто используют как backing store for warehouses and backups?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


204. (L2 [T]) Что такое read-after-write consistency and why it matters here?

     **Ответ:** Read-after-write гарантирует видимость завершённой записи по заявленной модели сервиса; S3 даёт strong consistency объектных операций. Это не атомарность нескольких keys/внешней БД и не запрет stale ответа собственного cache клиента.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


205. (L2 [T]) Почему rename в object storage обычно copy+delete, а не metadata op?

     **Ответ:** Object API не обязан поддерживать POSIX random write/atomic rename/append. Обычно используют immutable generations и manifest pointer; copy+delete не приравнивается к атомарному filesystem rename.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


206. (L2 [P]) Реализовать object manifest + chunk parts model

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


207. (L2 [P]) Реализовать lifecycle expiration job

     **Ответ:** TTL определяет логическую пригодность, eviction — вытеснение под memory pressure. Отложенное физическое удаление нормально, но чтение не должно возвращать expired запись по обещанному контракту; wall-clock jumps требуют выбранной time semantics. Загружать immutable/versioned objects с checksum, завершать multipart, затем публиковать manifest с exact generations. Клиент проверяет length/hash, retry имеет стабильный object identity; cleanup удаляет только unreferenced завершённые generations.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


208. (L2 [P]) Реализовать parallel multipart uploader/downloader

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


209. (L2 [P]) Реализовать object listing cache

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


210. (L2 [P]) Реализовать simple deduplication by content hash

     **Ответ:** Хранить durable operation/event ID с UNIQUE и менять effect+inbox/result в одной транзакции. Повтор возвращает прежний outcome, другой payload с тем же ID отклоняется; crash между commit и ACK не должен повторять эффект.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


211. (L2 [D]) Почему throughput upload высок, а listing and small reads painfully slow?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


212. (L2 [D]) Почему copy/rename workflow unexpectedly expensive?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


213. (L2 [D]) Почему after enabling versioning storage bill exploded?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


214. (L2 [D]) Почему backup restore is much slower than backup write?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


215. (L2 [D]) Почему many tiny objects killed metadata/list performance?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


216. (L3 [T]) Как устроены metadata plane и data plane в object storage systems?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


217. (L3 [T]) Почему erasure coding/object placement влияют на latency and durability?

     **Ответ:** Высокая durability object service относится к сохранности объектов по его модели, а не к полноте/согласованности вашего backup. Неправильный key, недописанный manifest, удаление или потеря encryption key остаются рисками уровня приложения.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


218. (L3 [T]) Как multipart upload interacts with consistency and failure recovery?

     **Ответ:** Multipart upload становится целым объектом по протоколу complete; незавершённые parts требуют cleanup. Согласованность коллекции объектов обеспечивают versioned manifest и publication protocol, не multi-object atomicity обычного PUT.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


219. (L3 [T]) Почему object storage often better viewed as distributed system API, not “just remote disk”?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


220. (L3 [T]) Как design for large scans over object storage differs from random small GET workload?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


221. (L3 [T]) Почему caching, local SSD and manifest layers are often necessary on top of object storage?

     **Ответ:** Manifest/catalog описывает опубликованный набор file generations и их metadata. Данные output file завершаются до ссылки из durable manifest; старые files удаляются после безопасной публикации и исчезновения readers.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


222. (L3 [T]) Как warehouses/lakes build table semantics over object storage lacking transactions?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


223. (L3 [T]) Почему read amplification in object storage often comes from metadata/list/open overhead?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


224. (L3 [T]) Как lifecycle/tiering/versioning affect compliance, cost and operational risk?

     **Ответ:** Object storage адресует объекты по bucket/key и metadata, не предоставляет POSIX block-update/rename semantics автоматически. Гарантии consistency/versioning зависят от сервиса; у S3 strong read-after-write для объектов не делает multi-object операции транзакцией.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


225. (L3 [T]) Почему object storage is ideal for durability/cost, but terrible as low-latency primary DB storage?

     **Ответ:** Высокая durability object service относится к сохранности объектов по его модели, а не к полноте/согласованности вашего backup. Неправильный key, недописанный manifest, удаление или потеря encryption key остаются рисками уровня приложения.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


226. (L3 [P]) Реализовать metadata cache with background refresh

     **Ответ:** Refresh публикует новые search segments/состояние для поиска; это отдельная граница от durability/replication ACK. Частые refresh увеличивают small segments и merge cost, а долгие — задержку search visibility. Загружать immutable/versioned objects с checksum, завершать multipart, затем публиковать manifest с exact generations. Клиент проверяет length/hash, retry имеет стабильный object identity; cleanup удаляет только unreferenced завершённые generations.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


227. (L3 [P]) Реализовать local SSD cache for remote objects

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


228. (L3 [P]) Реализовать manifest-based table over object blobs

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


229. (L3 [P]) Реализовать parallel range reader for large analytical objects

     **Ответ:** PUT immutable generation с явным checksum/length, complete multipart и затем versioned manifest publication. GET проверяет exact version, retries безопасны, cleanup лишь unreferenced objects; test partial uploads, list/cache differences и external DB atomicity gap.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


230. (L3 [P]) Реализовать observability: object count, list latency, GET p99, bytes/obj size distribution, multipart failures

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


231. (L3 [D]) Как доказать, что bottleneck in object workflow is metadata/list operations, not network bandwidth?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


232. (L3 [D]) Почему object storage works well for backups but badly for interactive analytics unless cached?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


233. (L3 [D]) Как расследовать partial multipart upload failures leaving orphaned parts/cost leaks?

     **Ответ:** Multipart upload становится целым объектом по протоколу complete; незавершённые parts требуют cleanup. Согласованность коллекции объектов обеспечивают versioned manifest и publication protocol, не multi-object atomicity обычного PUT. Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


234. (L3 [D]) Почему eventual/weak consistency assumptions broke cutover pipeline?

     **Ответ:** Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует. Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


235. (L3 [D]) Почему after moving blobs to object storage application latency became bimodal?

     **Ответ:** Проверить object version/key, manifest publication, multipart completion, credentials и request errors. Разделить client retries/cache stale state от storage consistency; listing/GET/metadata и внешняя БД могут расходиться из-за неатомарного workflow.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


236. (L4 [S]) Когда object storage — правильный primary durability layer, а когда нет?

     **Ответ:** Высокая durability object service относится к сохранности объектов по его модели, а не к полноте/согласованности вашего backup. Неправильный key, недописанный manifest, удаление или потеря encryption key остаются рисками уровня приложения.

     **Рекомендация:** Подходит large immutable blobs и cold tiers при приемлемых per-request/egress/latency cost. Спроектировать manifests, caching, lifecycle, access и restore; не переносить файловые assumptions об atomic append/rename без проверки.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


237. (L4 [S]) Как проектировать systems that combine local SSD + object storage + metadata DB?

     **Ответ:** Подходит large immutable blobs и cold tiers при приемлемых per-request/egress/latency cost. Спроектировать manifests, caching, lifecycle, access и restore; не переносить файловые assumptions об atomic append/rename без проверки.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


238. (L4 [S]) Как выбирать between filesystem, block storage and object storage for a new platform?

     **Ответ:** Подходит large immutable blobs и cold tiers при приемлемых per-request/egress/latency cost. Спроектировать manifests, caching, lifecycle, access и restore; не переносить файловые assumptions об atomic append/rename без проверки.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


239. (L4 [S]) Как объяснять команде, что object storage is API-centric and metadata-heavy, not just “infinite cheap disk”?

     **Ответ:** Подходит large immutable blobs и cold tiers при приемлемых per-request/egress/latency cost. Спроектировать manifests, caching, lifecycle, access и restore; не переносить файловые assumptions об atomic append/rename без проверки.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


240. (L4 [S]) Как строить guardrails around object count, object size distribution and lifecycle cost?

     **Ответ:** Подходит large immutable blobs и cold tiers при приемлемых per-request/egress/latency cost. Спроектировать manifests, caching, lifecycle, access и restore; не переносить файловые assumptions об atomic append/rename без проверки.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


---

## 🔹 Cross-topic вопросы

241. (L2 [T]) Когда Time-series DB лучше обычной OLTP/warehouse системы?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


242. (L2 [T]) Когда search engine должен быть derived index over source-of-truth DB, а не primary store?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


243. (L2 [T]) Почему warehouses и object storage часто проектируются вместе?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


244. (L2 [T]) Почему specialized storage almost always optimizes one workload by sacrificing another?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


245. (L2 [T]) Как retention, compaction, compression and lifecycle differ between TSDB, search and warehouse?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


246. (L2 [T]) Почему schema evolution and compatibility are still hard in specialized stores?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


247. (L2 [T]) Как cache layers radically change observed performance in all these systems?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


248. (L2 [T]) Почему replication/consistency guarantees vary widely across specialized stores?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


249. (L2 [T]) Как metadata plane often dominates performance and correctness more than raw data path?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


250. (L2 [T]) Почему product requirements must pick between latency, freshness, flexibility and cost before choosing the storage?

     **Ответ:** Warehouse оптимизирует columnar scan, compression, pruning и распределённую агрегацию больших наборов. Small files, skew и data shuffle способны доминировать над raw storage bandwidth; storage/compute separation добавляет remote fetch.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


251. (L2 [P]) Реализовать benchmark suite: TSDB ingest, search query, columnar scan, blob upload/download

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


252. (L2 [P]) Реализовать dashboard comparing write amplification / read amplification / storage cost across store types

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


253. (L2 [P]) Реализовать hybrid architecture prototype: OLTP source DB + search index + warehouse lake + object storage backups

     **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

     **Типичная ошибка:** Считать успешный backup job или наличие реплики достаточным без независимого restore test.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


254. (L2 [P]) Реализовать metadata inventory service for specialized stores

     **Ответ:** Записать column chunks/row groups со stats, реализовать projection/predicate pushdown, vectorized batches и bounded hash/sort state. На distributed path добавить exchange, skew-aware partitioning и spill; проверять aggregates/NULL/late data.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


255. (L2 [P]) Реализовать cost model comparing local disk vs remote object storage vs derived index layers

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


256. (L3 [D]) Почему команда выбрала “не тот” specialized storage, и это проявилось только на росте workload?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


257. (L3 [D]) Почему storage cost низкий, но operational complexity exploded?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


258. (L3 [D]) Как доказать, что bottleneck in specialized system comes from metadata/control plane, not raw data throughput?

     **Ответ:** Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно. Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


259. (L3 [D]) Почему freshness/lag complaints arise even when durability and correctness are fine?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


260. (L3 [D]) Как расследовать инцидент, где source-of-truth correct, but derived specialized storage stale/divergent?

     **Ответ:** Профилировать bytes scanned/pruned, rows/loops, shuffle, spill, codec CPU и remote cache hits. Сравнить estimates с actual, отметить skew и small-file metadata overhead; общий CPU не локализует bottleneck.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


261. (L4 [S]) Как выбирать specialized storage under uncertainty about future workload?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


262. (L4 [S]) Когда строить polyglot persistence, а когда стандартизировать на fewer systems?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


263. (L4 [S]) Как проектировать data platform, в которой TSDB, search, warehouse and object storage coexist sanely?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


264. (L4 [S]) Какие anti-patterns чаще всего приводят к painful specialized-storage sprawl?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


265. (L4 [S]) Как объяснять организации, что “лучшее хранилище” всегда зависит от dominant access pattern, consistency model and cost envelope?

     **Ответ:** Выбирать layout/sort/partition/materialized views под реальные analytics и freshness SLO. Отделить ingestion/maintenance и queries, контролировать cost per query и предсказуемость multitenant ресурсов.

     **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)
