# 🔐 13. Надёжность данных

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

## 🔹 Backup / restore

1. (L1 [T]) Что такое backup в контексте БД и storage systems?

   **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


2. (L1 [T]) Чем backup отличается от replication?

   **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


3. (L1 [T]) Почему реплика не заменяет полноценный backup?

   **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


4. (L1 [T]) Что такое restore?

   **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


5. (L1 [T]) Почему backup без регулярного restore test почти бесполезен?

   **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


6. (L1 [T]) Что такое full backup?

   **Ответ:** Full backup содержит полный набор нужных данных в определённой границе, но его восстанавливаемость также зависит от schema/global metadata/keys и recovery logs выбранного метода. «Полный» не означает независимый от всех внешних сервисов.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


7. (L1 [T]) Что такое incremental backup?

   **Ответ:** Incremental backup хранит изменения после определённого предыдущего backup/base по правилам инструмента. Restore требует compatible base и всех необходимых звеньев/metadata; экономия копирования оплачивается зависимостями и более сложным restore.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


8. (L1 [T]) Что такое differential backup?

   **Ответ:** Differential backup обычно хранит изменения с последней полной базы, а не с предыдущего differential. Restore часто требует full base плюс выбранный differential; точные block/WAL зависимости проверяются по формату инструмента.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Microsoft SQL Server: Differential backups](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/differential-backups-sql-server)


9. (L1 [T]) Почему RPO и RTO важны для проектирования backup strategy?

   **Ответ:** RPO — допустимая потеря/отставание точки восстановления, RTO — допустимое время восстановления сервиса. В RTO входят provision/download/replay/validation/routing; репликация ACK policy и tested restore определяют реальные пределы.

   **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


10. (L1 [T]) Почему backup — это часть reliability, а не только ops housekeeping?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


11. (L1 [P]) Реализовать full backup файловой БД на C/C++

    **Ответ:** Получить engine backup lock/API либо consistent snapshot+нужный log, перечислить все files/schema/global metadata. Копировать через read/write loops с error handling, считать checksums, записать manifest и durable completion; затем реально восстановить копию отдельно и проверить инварианты.

    **Типичная ошибка:** Считать успешный backup job или наличие реплики достаточным без независимого restore test.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


12. (L1 [P]) Реализовать restore из полного backup-а

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


13. (L1 [P]) Реализовать manifest с метаданными backup-а

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


14. (L1 [P]) Реализовать проверку целостности backup-файлов

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


15. (L1 [P]) Реализовать retention policy для старых backup-ов

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


16. (L2 [T]) Почему hot backup сложнее cold backup?

    **Ответ:** Cold backup делается при остановленном/замороженном изменении state, hot — при concurrent writes с backup API/snapshot+log protocol. Копирование открытых files без consistency boundary не становится hot backup автоматически.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


17. (L2 [T]) Что такое crash-consistent backup?

    **Ответ:** Crash-consistent snapshot допускает штатное engine recovery при условии согласованной модели всех нужных volumes/logs. Application-consistent copy использует coordination; несколько независимых volume snapshots не становятся атомарными сами.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


18. (L2 [T]) Что такое application-consistent backup?

    **Ответ:** Crash-consistent snapshot допускает штатное engine recovery при условии согласованной модели всех нужных volumes/logs. Application-consistent copy использует coordination; несколько независимых volume snapshots не становятся атомарными сами.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


19. (L2 [T]) Почему full backup часто слишком дорогой для больших систем?

    **Ответ:** Full backup содержит полный набор нужных данных в определённой границе, но его восстанавливаемость также зависит от schema/global metadata/keys и recovery logs выбранного метода. «Полный» не означает независимый от всех внешних сервисов.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


20. (L2 [T]) Почему incremental backup требует точного tracking changed pages/segments?

    **Ответ:** Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


21. (L2 [T]) Как WAL/binlog помогают backup/restore?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


22. (L2 [T]) Почему backup влияет на I/O, cache и production latency?

    **Ответ:** Backup конкурирует за read bandwidth, CPU compression/encryption, network и cache; CoW/retention могут добавить запись. Ограничить скорость по foreground SLO и измерять elapsed restore/backup, а не только transferred bytes.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


23. (L2 [T]) Почему backup windows становятся проблемой на больших БД?

    **Ответ:** Backup конкурирует за read bandwidth, CPU compression/encryption, network и cache; CoW/retention могут добавить запись. Ограничить скорость по foreground SLO и измерять elapsed restore/backup, а не только transferred bytes.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


24. (L2 [T]) Почему backup metadata так же важны, как и сами data files?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


25. (L2 [T]) Почему restore time часто недооценивают сильнее, чем backup time?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


26. (L2 [P]) Реализовать incremental backup на основе changed-page bitmap

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


27. (L2 [P]) Реализовать backup manifest: version, LSN, checksums, timestamps

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


28. (L2 [P]) Реализовать restore planner для full + incremental chain

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


29. (L2 [P]) Реализовать throttled backup reader, не убивающий foreground workload

    **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


30. (L2 [P]) Реализовать backup verification job после создания archive

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


31. (L2 [D]) Почему backup успешно создаётся, но restore из него не работает?

    **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Типичная ошибка:** Считать успешный backup job или наличие реплики достаточным без независимого restore test.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


32. (L2 [D]) Почему backup window внезапно выросла с минут до часов?

    **Ответ:** Backup конкурирует за read bandwidth, CPU compression/encryption, network и cache; CoW/retention могут добавить запись. Ограничить скорость по foreground SLO и измерять elapsed restore/backup, а не только transferred bytes. Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


33. (L2 [D]) Почему backup job вызывает рост p99 latency у БД?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Backup конкурирует за read bandwidth, CPU compression/encryption, network и cache; CoW/retention могут добавить запись. Ограничить скорость по foreground SLO и измерять elapsed restore/backup, а не только transferred bytes. Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


34. (L2 [D]) Почему incremental chain стала слишком длинной и restore непрактичен?

    **Ответ:** Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку. Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


35. (L2 [D]) Почему replica-based backup оказался логически неконсистентным?

    **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


36. (L3 [T]) Как проектировать backup pipeline для distributed/sharded DB?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


37. (L3 [T]) Как backup взаимодействует с snapshots, WAL archiving и PITR?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


38. (L3 [T]) Почему backup catalog/control plane — критическая часть системы?

    **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect. Data plane обслуживает операции, control plane управляет membership/placement/schema/routing. Изоляция отказов полезна, но stale/потерянная metadata может остановить или направить data plane неверно; bootstrap/recovery control state нужно проверять отдельно.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


39. (L3 [T]) Как проектировать consistent backup across multiple shards/partitions?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


40. (L3 [T]) Почему object storage часто good durability layer for backups, но не решает restore speed?

    **Ответ:** Высокая durability object service относится к сохранности объектов по его модели, а не к полноте/согласованности вашего backup. Неправильный key, недописанный manifest, удаление или потеря encryption key остаются рисками уровня приложения.

    **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


41. (L3 [T]) Как backup влияет на page cache, buffer pool и SSD wear?

    **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Endurance зависит от total device writes и FTL amplification, не только logical payload. Считать WAL/index/compaction writes и device health; уменьшение write amplification обычно меняет read/space costs.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


42. (L3 [T]) Почему encryption/compression backup-ов меняют trade-offs CPU vs storage vs restore time?

    **Ответ:** Шифрование защищает данные только при корректном key lifecycle и доступах; потеря KMS/key может сделать исправный backup невосстановимым. Catalog должен знать key/version, а restore drill проверять реальные permissions и rotation. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


43. (L3 [T]) Как проектировать resumable backup job with fault tolerance?

    **Ответ:** Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию.

    **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


44. (L3 [T]) Почему backup chain corruption — control-plane as much as data-plane problem?

    **Ответ:** Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


45. (L3 [T]) Почему backup strategy должна включать drills, not just retention checkboxes?

    **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


46. (L3 [P]) Реализовать resumable backup with chunk manifests

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


47. (L3 [P]) Реализовать shard-aware backup coordinator

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


48. (L3 [P]) Реализовать background verification restore on sampled backups

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


49. (L3 [P]) Реализовать observability: backup lag, bytes/sec, throttling, restore readiness

    **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


50. (L3 [P]) Реализовать backup planner с выбором full vs incremental based on restore cost

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


51. (L3 [D]) Как доказать, что bottleneck backup — object storage upload, а не local reads?

    **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


52. (L3 [D]) Почему backup chain формально complete, но restore fails at one increment?

    **Ответ:** Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку. Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


53. (L3 [D]) Как расследовать inconsistent multi-shard backup после failover во время job?

    **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


54. (L3 [D]) Почему backup cost резко вырос после включения compression/encryption?

    **Ответ:** Шифрование защищает данные только при корректном key lifecycle и доступах; потеря KMS/key может сделать исправный backup невосстановимым. Catalog должен знать key/version, а restore drill проверять реальные permissions и rotation. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться. Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


55. (L3 [D]) Как найти hidden assumption, из-за которой backup good on staging but unsafe in production?

    **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


56. (L4 [S]) Как выбирать backup strategy по RPO/RTO, а не “по привычке”?

    **Ответ:** RPO — допустимая потеря/отставание точки восстановления, RTO — допустимое время восстановления сервиса. В RTO входят provision/download/replay/validation/routing; репликация ACK policy и tested restore определяют реальные пределы.

    **Рекомендация:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


57. (L4 [S]) Когда backup стоит брать с primary, а когда с replica/snapshot layer?

    **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


58. (L4 [S]) Как строить backup platform для многих БД и many-tenant organization?

    **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

    **Рекомендация:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


59. (L4 [S]) Как формулировать policy: backup success is not enough, restore proof required?

    **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


60. (L4 [S]) Как объяснять командам, что backup — это страховка только тогда, когда restore реально проверен?

    **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


---

## 🔹 Snapshots

61. (L1 [T]) Что такое snapshot в storage systems?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


62. (L1 [T]) Чем snapshot отличается от backup?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


63. (L1 [T]) Почему snapshot обычно быстрее full copy?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


64. (L1 [T]) Что такое copy-on-write snapshot?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


65. (L1 [T]) Что такое read-only point-in-time image данных?

    **Ответ:** Read-only транзакция может удерживать snapshot/versions, занимать I/O/CPU и влиять на serializable dependencies. Отсутствие write не означает отсутствие эксплуатационных последствий или обязательного abort при любой реализации.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


66. (L1 [T]) Почему snapshot не всегда переносим как offsite backup?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


67. (L1 [T]) Почему snapshot удобен для быстрых откатов и клонирования?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


68. (L1 [T]) Почему snapshot сам по себе не гарантирует application consistency?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


69. (L1 [T]) Что такое volume-level snapshot?

    **Ответ:** Volume snapshot фиксирует blocks в границе storage, database logical snapshot — видимость transactions через engine. Их нельзя подменять: для volume copy нужны согласованные data/WAL/metadata и recovery, для logical — сохранение нужной history.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


70. (L1 [T]) Что такое database-level logical snapshot?

    **Ответ:** Volume snapshot фиксирует blocks в границе storage, database logical snapshot — видимость transactions через engine. Их нельзя подменять: для volume copy нужны согласованные data/WAL/metadata и recovery, для logical — сохранение нужной history.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


71. (L1 [P]) Реализовать copy-on-write snapshot для простого page store

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Типичная ошибка:** Считать snapshot того же failure domain независимым backup и забывать зависимости CoW/base.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


72. (L1 [P]) Реализовать read-only mount/clone snapshot-а

    **Ответ:** Создать read-only transaction snapshot, все lookups выполнять по одной boundary и удерживать её до конца. Отдельно определить statement vs transaction scope, собственные writes/replica freshness; проверить concurrent insert/update/delete.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


73. (L1 [P]) Реализовать metadata table snapshot chain

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


74. (L1 [P]) Реализовать snapshot create/list/delete API

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


75. (L1 [P]) Реализовать быстрый clone из snapshot-а для тестовой среды

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


76. (L2 [T]) Почему snapshot creation почти мгновенный, а storage cost растёт потом?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


77. (L2 [T]) Почему COW snapshots увеличивают write amplification?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


78. (L2 [T]) Почему long-lived snapshots мешают garbage collection/compaction?

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


79. (L2 [T]) Почему snapshot-ы влияют на performance writes?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


80. (L2 [T]) Что такое crash-consistent snapshot?

    **Ответ:** Crash-consistent snapshot допускает штатное engine recovery при условии согласованной модели всех нужных volumes/logs. Application-consistent copy использует coordination; несколько независимых volume snapshots не становятся атомарными сами.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


81. (L2 [T]) Почему coordinated snapshot across multiple volumes/services сложен?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


82. (L2 [T]) Чем filesystem snapshot отличается от storage-array/cloud-volume snapshot?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


83. (L2 [T]) Почему snapshot useful for fast restore, but not necessarily enough for disaster recovery?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


84. (L2 [T]) Почему snapshot retention policy важна для space consumption?

    **Ответ:** Retention определяет, какие данные можно удалить по возрасту/объёму; физический reclaim может ждать block/GC boundary. Нужно учесть late ingestion, snapshots, replicas и backup/replay consumers, чтобы не уничтожить ещё нужную history.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


85. (L2 [T]) Почему snapshot metadata corruption особенно опасна?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


86. (L2 [P]) Реализовать reference counting blocks/pages for snapshots

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


87. (L2 [P]) Реализовать snapshot retention and cleanup

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


88. (L2 [P]) Реализовать snapshot export into backup archive

    **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


89. (L2 [P]) Реализовать quiesce/unquiesce hooks around snapshot creation

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


90. (L2 [P]) Реализовать benchmark: write slowdown with N active snapshots

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


91. (L2 [D]) Почему snapshots создаются быстро, но restore from snapshot slow?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью. Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

    **Типичная ошибка:** Считать snapshot того же failure domain независимым backup и забывать зависимости CoW/base.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


92. (L2 [D]) Почему после включения snapshots вырос write latency?

    **Ответ:** Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


93. (L2 [D]) Почему storage usage растёт, хотя объём логических данных почти неизменен?

    **Ответ:** Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


94. (L2 [D]) Почему deletion old snapshots вызывает massive IO spikes?

    **Ответ:** Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


95. (L2 [D]) Почему snapshot is crash-consistent, but application state still invalid?

    **Ответ:** Crash-consistent snapshot допускает штатное engine recovery при условии согласованной модели всех нужных volumes/logs. Application-consistent copy использует coordination; несколько независимых volume snapshots не становятся атомарными сами. Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


96. (L3 [T]) Как проектировать snapshot subsystem поверх WAL/MVCC/COW pages?

    **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


97. (L3 [T]) Как snapshot interplay with replication and failover?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


98. (L3 [T]) Почему snapshot chains deepen restore/read complexity?

    **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


99. (L3 [T]) Как snapshots работают в LSM-based systems with immutable SSTables?

    **Ответ:** Immutable/versioned backup и отдельные credentials/failure domains уменьшают риск массового удаления/заражения. Retention lock, key access и restore permissions проверяются вместе; недоступный encryption key делает целую копию бесполезной. Immutable файл после публикации не меняется in-place, что упрощает concurrent readers и checksum. Update/delete создают новые versions/files, а reclaim требует отсутствия живых readers и корректного manifest.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


100. (L3 [T]) Почему snapshot management becomes metadata scalability problem?

     **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


101. (L3 [T]) Как coordinated snapshots across shards/services approximate consistency?

     **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


102. (L3 [T]) Почему snapshots и backups нужно проектировать вместе, а не как альтернативы?

     **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


103. (L3 [T]) Как snapshotting влияет на SSD wear and device-level write amplification?

     **Ответ:** Endurance зависит от total device writes и FTL amplification, не только logical payload. Считать WAL/index/compaction writes и device health; уменьшение write amplification обычно меняет read/space costs.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


104. (L3 [T]) Почему clone-from-snapshot environments often distort performance testing?

     **Ответ:** Snapshot фиксирует согласованную точку/sequence, но filesystem/volume snapshot без координации может быть только crash-consistent. CoW/delta копии зависят от базовых данных и создают overhead/retained space.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


105. (L3 [T]) Как observability должна показывать snapshot depth, retained bytes and write penalty?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


106. (L3 [P]) Реализовать snapshot manifest with parent links and checksums

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


107. (L3 [P]) Реализовать shard-consistent snapshot coordinator

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


108. (L3 [P]) Реализовать snapshot-aware garbage collector

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


109. (L3 [P]) Реализовать observability: active snapshots, retained blocks, write penalty, cleanup lag

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


110. (L3 [P]) Реализовать snapshot export/import pipeline

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


111. (L3 [D]) Как доказать, что write slowdown идёт от snapshot COW overhead, а не от WAL/fsync?

     **Ответ:** CoW snapshot сначала сохраняет ссылки/metadata, а последующие изменения удерживают/копируют старые blocks. Быстрое создание не означает бесплатную ёмкость: retained deltas и random writes повышают space/I/O, base остаётся зависимостью. Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


112. (L3 [D]) Почему snapshot cleanup stalls foreground traffic?

     **Ответ:** Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


113. (L3 [D]) Как расследовать missing blocks after snapshot chain manipulation?

     **Ответ:** Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


114. (L3 [D]) Почему multi-volume snapshot gave logically inconsistent restore?

     **Ответ:** Crash-consistent snapshot допускает штатное engine recovery при условии согласованной модели всех нужных volumes/logs. Application-consistent copy использует coordination; несколько независимых volume snapshots не становятся атомарными сами. Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


115. (L3 [D]) Как найти snapshot policy, которая silently destroys restore economics?

     **Ответ:** Сверить время/LSN каждого volume, retained blocks, base chain и application recovery logs. Snapshot «успешен» на storage уровне не доказывает consistency между data/WAL/metadata volumes.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


116. (L4 [S]) Когда snapshots should be primary restore mechanism, а когда only convenience layer?

     **Ответ:** Выбирать application-consistent либо корректно восстанавливаемый crash-consistent режим по RPO/RTO. Планировать CoW/retention ёмкость и независимую полную копию; snapshot того же устройства не защищает от его потери.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


117. (L4 [S]) Как проектировать snapshot lifecycle in multi-tenant platform?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Рекомендация:** Выбирать application-consistent либо корректно восстанавливаемый crash-consistent режим по RPO/RTO. Планировать CoW/retention ёмкость и независимую полную копию; snapshot того же устройства не защищает от его потери.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


118. (L4 [S]) Как балансировать clone convenience, retention depth and write cost?

     **Ответ:** Выбирать application-consistent либо корректно восстанавливаемый crash-consistent режим по RPO/RTO. Планировать CoW/retention ёмкость и независимую полную копию; snapshot того же устройства не защищает от его потери.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


119. (L4 [S]) Как объяснять командам, что snapshot ≠ backup ≠ PITR, хотя пользователи часто смешивают их?

     **Ответ:** Выбирать application-consistent либо корректно восстанавливаемый crash-consistent режим по RPO/RTO. Планировать CoW/retention ёмкость и независимую полную копию; snapshot того же устройства не защищает от его потери.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


120. (L4 [S]) Как стандартизировать snapshot safety checks before teams rely on them operationally?

     **Ответ:** Выбирать application-consistent либо корректно восстанавливаемый crash-consistent режим по RPO/RTO. Планировать CoW/retention ёмкость и независимую полную копию; snapshot того же устройства не защищает от его потери.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

## 🔹 Point-in-time recovery (PITR)

121. (L1 [T]) Что такое point-in-time recovery?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Пример:** Для возврата перед ошибочным DELETE восстановить base backup отдельно и остановить WAL replay до его commit.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


122. (L1 [T]) Чем PITR отличается от обычного restore из backup-а?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


123. (L1 [T]) Почему PITR нужен для recovery после user error, bad deploy или logical corruption?

     **Ответ:** Physical corruption нарушает bytes/структуры, logical corruption может иметь корректные checksums и реплицироваться как нормальная запись. Их различают integrity checks и business invariants/history, а восстановление выбирает доверенный target до ошибки.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


124. (L1 [T]) Как WAL/binlog/transaction log используется в PITR?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


125. (L1 [T]) Почему PITR требует базовый backup + continuous log archive?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


126. (L1 [T]) Что значит “восстановить состояние на 12:03:17”?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


127. (L1 [T]) Почему PITR важен при accidental DELETE/DROP/UPDATE?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


128. (L1 [T]) Почему точность PITR зависит от log coverage и clock/LSN semantics?

     **Ответ:** LSN идентифицирует порядок/позицию журнала в определённом log stream. Written, durable и applied LSN имеют разные значения; сравнивать их между независимыми timelines/группами без контекста нельзя.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


129. (L1 [T]) Почему PITR не заменяет application-level audit/history completely?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


130. (L1 [T]) Почему testing PITR сложнее, чем обычный restore?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


131. (L1 [P]) Реализовать base backup + append-only log replay

     **Ответ:** Сериализовать length/type/tx_id/LSN/payload/checksum, писать loop с short-write/EINTR обработкой. Разделить written и durable LSN, sync перед требуемым ACK; parser ограничивает length и останавливает recovery на неполном tail.

     **Типичная ошибка:** Удалять base/WAL chain по разным retention правилам, не проверив полное restorable window.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


132. (L1 [P]) Реализовать restore to target LSN

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


133. (L1 [P]) Реализовать restore to target timestamp (упрощённо)

     **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


134. (L1 [P]) Реализовать log archive rotation

     **Ответ:** Сохранить consistent base и архив WAL с identity/timeline/checksums, восстановить в отдельное место, replay до time/LSN/transaction target. Проверить stop condition и данные перед открытием записи, сохранить старый экземпляр для расследования.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


135. (L1 [P]) Реализовать stop-replay-at-target recovery mode

     **Ответ:** Сохранить consistent base и архив WAL с identity/timeline/checksums, восстановить в отдельное место, replay до time/LSN/transaction target. Проверить stop condition и данные перед открытием записи, сохранить старый экземпляр для расследования.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


136. (L2 [T]) Почему PITR требует непрерывной и完整ной цепочки archived logs?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


137. (L2 [T]) Что такое recovery target: timestamp, LSN, transaction ID, named restore point?

     **Ответ:** LSN идентифицирует порядок/позицию журнала в определённом log stream. Written, durable и applied LSN имеют разные значения; сравнивать их между независимыми timelines/группами без контекста нельзя.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


138. (L2 [T]) Почему timestamp-based restore tricky under clock skew/timezone assumptions?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Wall clock может иметь skew и скачки; NTP не даёт единого строгого порядка событий. Для локальных intervals используют monotonic clock, для authority/order — согласованные versions/epochs и нужные bounded-time assumptions.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Raft paper](https://raft.github.io/raft.pdf); [Jepsen: Consistency models](https://jepsen.io/consistency)


139. (L2 [T]) Почему logical corruption может уже присутствовать в base backup before replay?

     **Ответ:** Physical corruption нарушает bytes/структуры, logical corruption может иметь корректные checksums и реплицироваться как нормальная запись. Их различают integrity checks и business invariants/history, а восстановление выбирает доверенный target до ошибки.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


140. (L2 [T]) Почему restore point markers полезны для deploy safety?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


141. (L2 [T]) Почему partial log loss делает PITR impossible past certain point?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


142. (L2 [T]) Почему PITR restore speed зависит от replay rate, not only backup size?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


143. (L2 [T]) Почему long transactions complicate exact stop position?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


144. (L2 [T]) Почему replication lag и log shipping design влияют на PITR readiness?

     **Ответ:** Log shipping часто передаёт завершённые segments/files, streaming — поток log records быстрее после генерации. Оба требуют continuity/identity и recovery; streaming не гарантирует durable/apply ACK без соответствующей настройки.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


145. (L2 [T]) Почему PITR drills нужно делать against realistic incident scenarios?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


146. (L2 [P]) Реализовать archived WAL catalog with gap detection

     **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect. Сохранить consistent base и архив WAL с identity/timeline/checksums, восстановить в отдельное место, replay до time/LSN/transaction target. Проверить stop condition и данные перед открытием записи, сохранить старый экземпляр для расследования.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


147. (L2 [P]) Реализовать named restore point markers

     **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


148. (L2 [P]) Реализовать replay progress tracker

     **Ответ:** Сохранить consistent base и архив WAL с identity/timeline/checksums, восстановить в отдельное место, replay до time/LSN/transaction target. Проверить stop condition и данные перед открытием записи, сохранить старый экземпляр для расследования.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


149. (L2 [P]) Реализовать validator: no missing log segments for target interval

     **Ответ:** Сохранить consistent base и архив WAL с identity/timeline/checksums, восстановить в отдельное место, replay до time/LSN/transaction target. Проверить stop condition и данные перед открытием записи, сохранить старый экземпляр для расследования.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


150. (L2 [P]) Реализовать incident simulation: mistaken DELETE then PITR to just before it

     **Ответ:** Выбрать base/timeline и убедиться в непрерывности archive до target; восстановить отдельно, replay остановить по точной boundary. Проверить данные до promotion, сохранить исходный instance и audit выбранного target; test missing segment и wrong timeline.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


151. (L2 [D]) Почему PITR остановился раньше target time?

     **Ответ:** Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Типичная ошибка:** Удалять base/WAL chain по разным retention правилам, не проверив полное restorable window.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


152. (L2 [D]) Почему restore succeeded, but desired rows still missing?

     **Ответ:** Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


153. (L2 [D]) Почему archived logs contain gap and nobody noticed?

     **Ответ:** Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


154. (L2 [D]) Почему PITR replay takes many hours even for modest DB size?

     **Ответ:** Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


155. (L2 [D]) Почему restored DB consistent technically, but business state not what operators expected?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs. Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


156. (L3 [T]) Как проектировать PITR for sharded/distributed DB with per-shard logs?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


157. (L3 [T]) Как coordinated restore across services/shards approximates transactionally meaningful recovery?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


158. (L3 [T]) Почему log archiving pipeline itself needs checksums, manifests and alerts?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


159. (L3 [T]) Как design WAL format and restore markers for reliable PITR?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


160. (L3 [T]) Почему PITR is both storage problem and incident-response workflow?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


161. (L3 [T]) Как optimize replay: parallelism, page prefetch, incremental restore, changed-block restore?

     **Ответ:** Incremental backup зависит от предков, differential — обычно от выбранной полной базы; точные термины сверять у инструмента. Restore требует совместимого полного набора, metadata и keys; удаление одного звена способно разрушить цепочку. Prefetch полезен, если адрес известен достаточно заранее и есть bandwidth/cache capacity. Pointer dependency, случайные accesses, неверная distance и cache pollution могут убрать выигрыш; сравнивать physical bytes и stalled cycles.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


162. (L3 [T]) Почему human operator UX matters: choosing exact target safely is hard?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


163. (L3 [T]) Как PITR interacts with schema migrations and dual writes?

     **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


164. (L3 [T]) Почему compliance/legal retention affects PITR log retention economics?

     **Ответ:** PITR восстанавливает base backup и непрерывный журнал до заданной recovery target. Нужен полный нужный log chain/timeline; «до времени» требует точной семантики границы и не исправляет ошибочный выбор target.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


165. (L3 [T]) Как observability должна показывать PITR horizon, archive freshness and replay throughput?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


166. (L3 [P]) Реализовать PITR coordinator for multiple shards with target barrier

     **Ответ:** Выбрать base/timeline и убедиться в непрерывности archive до target; восстановить отдельно, replay остановить по точной boundary. Проверить данные до promotion, сохранить исходный instance и audit выбранного target; test missing segment и wrong timeline.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


167. (L3 [P]) Реализовать archived-log integrity checker

     **Ответ:** Сохранить consistent base и архив WAL с identity/timeline/checksums, восстановить в отдельное место, replay до time/LSN/transaction target. Проверить stop condition и данные перед открытием записи, сохранить старый экземпляр для расследования.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


168. (L3 [P]) Реализовать restore-time fast-forward with page prefetch

     **Ответ:** Задать hint/distance/окно, измерить physical bytes и полезную latency при sequential/random/mixed workload. Prefetch не должен читать за bounds или вытеснять критичный cache; сравнить с hardware/OS baseline.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


169. (L3 [P]) Реализовать operator tool: inspect restore timeline before commit

     **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


170. (L3 [P]) Реализовать observability: archive lag, gap alerts, replay MB/s, PITR horizon

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


171. (L3 [D]) Как доказать, что PITR failure caused by archive gap, not restore code bug?

     **Ответ:** Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


172. (L3 [D]) Почему replay throughput low despite fast disks?

     **Ответ:** Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


173. (L3 [D]) Как расследовать restore that crosses schema migration boundary incorrectly?

     **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics. Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт. Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


174. (L3 [D]) Почему target timestamp chosen by operators yields wrong business state?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs. Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


175. (L3 [D]) Как найти earliest point where logical corruption entered the system?

     **Ответ:** Physical corruption нарушает bytes/структуры, logical corruption может иметь корректные checksums и реплицироваться как нормальная запись. Их различают integrity checks и business invariants/history, а восстановление выбирает доверенный target до ошибки. Проверить earliest/latest restorable positions, archive gaps, timeline history, keys и backup compatibility. Различать скачивание log, replay и validation; отсутствие одного segment может сделать поздние WAL бесполезными.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


176. (L4 [S]) Как выбирать PITR retention window from real business blast radius, not from round numbers?

     **Ответ:** Задать archive freshness alert и restore drills для разных targets, включая перед логическим удалением. Retention base и WAL согласовать; RTO зависит от replay distance, не только возраста/размера backup.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


177. (L4 [S]) Когда PITR обязательна, а когда достаточно snapshots/backups?

     **Ответ:** Задать archive freshness alert и restore drills для разных targets, включая перед логическим удалением. Retention base и WAL согласовать; RTO зависит от replay distance, не только возраста/размера backup.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


178. (L4 [S]) Как проектировать operator workflows, чтобы PITR under stress was safe and reversible?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Рекомендация:** Задать archive freshness alert и restore drills для разных targets, включая перед логическим удалением. Retention base и WAL согласовать; RTO зависит от replay distance, не только возраста/размера backup.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


179. (L4 [S]) Как объяснять, что PITR readiness measured by drills and archive integrity, not by config flags?

     **Ответ:** Задать archive freshness alert и restore drills для разных targets, включая перед логическим удалением. Retention base и WAL согласовать; RTO зависит от replay distance, не только возраста/размера backup.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


180. (L4 [S]) Как строить organization-wide policy around restore points before risky deploys or migrations?

     **Ответ:** Задать archive freshness alert и restore drills для разных targets, включая перед логическим удалением. Retention base и WAL согласовать; RTO зависит от replay distance, не только возраста/размера backup.

     **Источник:** [PostgreSQL: Continuous archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)


---

## 🔹 Data corruption

181. (L1 [T]) Что такое data corruption?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


182. (L1 [T]) Чем data corruption отличается от logical bug in application data?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


183. (L1 [T]) Что такое physical corruption страницы/блока/файла?

     **Ответ:** Physical corruption нарушает bytes/структуры, logical corruption может иметь корректные checksums и реплицироваться как нормальная запись. Их различают integrity checks и business invariants/history, а восстановление выбирает доверенный target до ошибки.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


184. (L1 [T]) Что такое silent corruption?

     **Ответ:** Physical corruption нарушает bytes/структуры, logical corruption может иметь корректные checksums и реплицироваться как нормальная запись. Их различают integrity checks и business invariants/history, а восстановление выбирает доверенный target до ошибки.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


185. (L1 [T]) Почему corruption может появиться на диске, в памяти, в сети или в коде?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


186. (L1 [T]) Почему replication может распространить corruption instead of saving you from it?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


187. (L1 [T]) Почему backup может уже содержать corruption?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


188. (L1 [T]) Почему corruption detection should be continuous, not only at restore time?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


189. (L1 [T]) Почему corrupted metadata often worse than corrupted data page?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


190. (L1 [T]) Почему early detection dramatically changes recovery options?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


191. (L1 [P]) Реализовать checksum verification for stored pages

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


192. (L1 [P]) Реализовать simple page scrubber that scans files and verifies headers

     **Ответ:** Injector меняет/truncates/reorders bytes с известной provenance; reader validates framing/identity/checksum до parsing. Scrubber ограничен budget, repair использует проверенную generation/copy и никогда не скрывает mismatch; test логическую ошибку с валидным checksum отдельно.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


193. (L1 [P]) Реализовать corruption injection for testing

     **Ответ:** Injector меняет/truncates/reorders bytes с известной provenance; reader validates framing/identity/checksum до parsing. Scrubber ограничен budget, repair использует проверенную generation/copy и никогда не скрывает mismatch; test логическую ошибку с валидным checksum отдельно.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


194. (L1 [P]) Реализовать quarantine of corrupted segment/page

     **Ответ:** Добавить version/length/checksum к blocks/records и validate до интерпретации offsets. Fault injector меняет bytes/truncates files; reader должен выдавать error, а recovery выбирать проверенную копию/backup без молчаливой порчи данных.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


195. (L1 [P]) Реализовать error path: detect bad checksum and stop read/apply

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


196. (L2 [T]) Какие типы corruption typical for DB/storage: torn write, bit rot, partial write, lost write, memory scribble?

     **Ответ:** Torn page содержит смесь частей разных записей страницы. Checksum обнаруживает часть повреждений, а full-page images/doublewrite/atomic replacement дают материал для восстановления; одного checksum недостаточно. Scrubbing читает и проверяет ранее холодные blocks, выявляя latent corruption до восстановления/отказа replica. Оно расходует I/O и требует корректного repair source; successful scrub не доказывает бизнес-инварианты.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


197. (L2 [T]) Почему power loss может привести к partial/torn page?

     **Ответ:** Torn page содержит смесь частей разных записей страницы. Checksum обнаруживает часть повреждений, а full-page images/doublewrite/atomic replacement дают материал для восстановления; одного checksum недостаточно. SIGKILL останавливает процесс, но не очищает kernel/device caches; поэтому успешный restart после kill -9 не доказывает power-loss durability. Нужны fault tests persistence boundaries и согласованная модель диска/VM.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


198. (L2 [T]) Почему ECC memory снижает, но не исключает corruption risk?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


199. (L2 [T]) Почему network/storage firmware bugs тоже источник corruption?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


200. (L2 [T]) Чем physical page corruption отличается от index logical inconsistency?

     **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


201. (L2 [T]) Почему end-to-end checksums важнее, чем trust in hardware?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


202. (L2 [T]) Почему scrubbing/background verification нужны даже без видимых ошибок?

     **Ответ:** Scrubbing читает и проверяет ранее холодные blocks, выявляя latent corruption до восстановления/отказа replica. Оно расходует I/O и требует корректного repair source; successful scrub не доказывает бизнес-инварианты.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


203. (L2 [T]) Почему corruption в archived backups/logs особенно опасна?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


204. (L2 [T]) Как WAL/redo can help recover from some corruption classes?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


205. (L2 [T]) Почему corruption blast radius зависит от replication/backup topology?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


206. (L2 [P]) Реализовать page header with magic/version/checksum

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


207. (L2 [P]) Реализовать periodic scrub job over data files and backup archives

     **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


208. (L2 [P]) Реализовать distinguishable error codes for checksum mismatch vs format mismatch

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


209. (L2 [P]) Реализовать block-level corruption simulator

     **Ответ:** Injector меняет/truncates/reorders bytes с известной provenance; reader validates framing/identity/checksum до parsing. Scrubber ограничен budget, repair использует проверенную generation/copy и никогда не скрывает mismatch; test логическую ошибку с валидным checksum отдельно.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


210. (L2 [P]) Реализовать index-vs-data consistency checker

     **Ответ:** Добавить version/length/checksum к blocks/records и validate до интерпретации offsets. Fault injector меняет bytes/truncates files; reader должен выдавать error, а recovery выбирать проверенную копию/backup без молчаливой порчи данных.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


211. (L2 [D]) Почему DB crashes only when reading one specific range/page?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


212. (L2 [D]) Почему replication follower fails apply on one WAL segment?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


213. (L2 [D]) Почему backups exist, but all recent ones share the same corrupted blocks?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


214. (L2 [D]) Почему application reports “missing rows”, but issue is corrupted index not data?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


215. (L2 [D]) Почему corruption detected weeks after original hardware event?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


216. (L3 [T]) Как проектировать end-to-end corruption detection across memory, WAL, data pages, backups and network transfers?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


217. (L3 [T]) Почему checksums alone do not solve semantic corruption?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


218. (L3 [T]) Как scrubbing frequency balances IO cost and detection latency?

     **Ответ:** Scrubbing читает и проверяет ранее холодные blocks, выявляя latent corruption до восстановления/отказа replica. Оно расходует I/O и требует корректного repair source; successful scrub не доказывает бизнес-инварианты.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


219. (L3 [T]) Почему self-healing from replicas requires trust boundaries and checksum comparison?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Comparator задаёт единый строгий порядок для build/read/merge/index predicates. Encoding, collation и upgrade не должны менять этот порядок для уже существующих files без reindex/migration; bytewise order не равен любому числовому/text порядку.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


220. (L3 [T]) Как design manifests, Merkle trees or block hashes for large backup sets?

     **Ответ:** Merkle tree агрегирует hashes диапазонов, позволяя найти различающиеся поддеревья без полного обмена данных. Нужны одинаковые key ranges/canonical encoding и сравнимые snapshots; hash mismatch не выбирает правильного победителя.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


221. (L3 [T]) Почему corruption handling is incident-management problem, not only detection mechanism?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


222. (L3 [T]) Как distinguish corruption from software bug causing deterministic bad writes?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


223. (L3 [T]) Почему immutable storage formats often help containment of corruption?

     **Ответ:** Immutable/versioned backup и отдельные credentials/failure domains уменьшают риск массового удаления/заражения. Retention lock, key access и restore permissions проверяются вместе; недоступный encryption key делает целую копию бесполезной.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


224. (L3 [T]) Как page cache and memory corruption complicate reproduction and root cause analysis?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


225. (L3 [T]) Почему corruption drills should include “can we identify exact first bad copy?” scenarios?

     **Ответ:** Covering требует наличия всех полей query в index, включая predicates/order, но не гарантирует index-only физическое чтение. Payload columns и широкий composite key увеличивают размер и write maintenance.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


226. (L3 [P]) Реализовать end-to-end checksum propagation from write to backup archive

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


227. (L3 [P]) Реализовать background scrubber with rate limiting and reporting

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


228. (L3 [P]) Реализовать compare-and-repair from healthy replica for corrupted blocks

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Добавить version/length/checksum к blocks/records и validate до интерпретации offsets. Fault injector меняет bytes/truncates files; reader должен выдавать error, а recovery выбирать проверенную копию/backup без молчаливой порчи данных.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


229. (L3 [P]) Реализовать Merkle-tree-like verifier for backup sets

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


230. (L3 [P]) Реализовать observability: corrupted pages, scrub lag, checksum failures by layer, repair attempts

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


231. (L3 [D]) Как доказать, что corruption originates below DB layer, not in serialization code?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


232. (L3 [D]) Почему checksum mismatch happens only after restore, not during backup creation?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity. Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


233. (L3 [D]) Как расследовать corruption replicated to all followers before detection?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


234. (L3 [D]) Почему self-heal from replica reintroduces corruption because source not actually healthy?

     **Ответ:** После восстановления сети нужно демотировать stale authority, догнать/разрешить версии и обновить routes. Rate-limit replay/repair: одновременный возврат replicas/clients может вызвать recovery storm и повторную перегрузку. Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


235. (L3 [D]) Как найти earliest intact backup/log before corruption entered archives?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


236. (L4 [S]) Как строить corruption-detection strategy for critical data systems?

     **Ответ:** Совместить checksums, scrubbing, независимые backups и проверенную процедуру repair. Определить trust/authority и blast radius, не считать hash доказательством бизнес-корректности или защитой от атак без MAC/signature.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


237. (L4 [S]) Когда enough to detect and fail, а когда нужна automatic repair?

     **Ответ:** Совместить checksums, scrubbing, независимые backups и проверенную процедуру repair. Определить trust/authority и blast radius, не считать hash доказательством бизнес-корректности или защитой от атак без MAC/signature.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


238. (L4 [S]) Как проектировать trust boundaries between DB, filesystem, device and backup layers?

     **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

     **Рекомендация:** Совместить checksums, scrubbing, независимые backups и проверенную процедуру repair. Определить trust/authority и blast radius, не считать hash доказательством бизнес-корректности или защитой от атак без MAC/signature.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


239. (L4 [S]) Как объяснять организации, что replication and backups do not automatically imply corruption safety?

     **Ответ:** Совместить checksums, scrubbing, независимые backups и проверенную процедуру repair. Определить trust/authority и blast radius, не считать hash доказательством бизнес-корректности или защитой от атак без MAC/signature.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


240. (L4 [S]) Как выбирать scrub frequency, archive verification depth and repair policy under cost constraints?

     **Ответ:** Scrubbing читает и проверяет ранее холодные blocks, выявляя latent corruption до восстановления/отказа replica. Оно расходует I/O и требует корректного repair source; successful scrub не доказывает бизнес-инварианты.

     **Рекомендация:** Совместить checksums, scrubbing, независимые backups и проверенную процедуру repair. Определить trust/authority и blast radius, не считать hash доказательством бизнес-корректности или защитой от атак без MAC/signature.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


---

## 🔹 Checksums

241. (L1 [T]) Что такое checksum?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Пример:** Bit flip может нарушить checksum; UPDATE с неверным бизнес-значением может иметь полностью корректный checksum.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


242. (L1 [T]) Зачем checksums нужны в storage systems?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


243. (L1 [T]) Чем checksum отличается от cryptographic hash?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


244. (L1 [T]) Почему checksum помогает обнаружить corruption, но не исправляет её?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


245. (L1 [T]) Почему checksum нужно хранить отдельно от защищаемых данных или хотя бы в структурированном формате?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


246. (L1 [T]) Где checksums обычно используют: pages, WAL records, SSTables, backups, network transfers?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


247. (L1 [T]) Почему checksum page header полезен для быстрой детекции bad reads?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


248. (L1 [T]) Почему checksum WAL record особенно важна для recovery?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


249. (L1 [T]) Почему checksum mismatch — это reliability signal, а не просто I/O error?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


250. (L1 [T]) Почему checksum verification should happen continuously, not occasionally?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


251. (L1 [P]) Реализовать CRC32 checksum для page payload

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


252. (L1 [P]) Реализовать verify-on-read path

     **Ответ:** Выбрать алгоритм и покрываемые bytes/metadata, считать до write и проверять на read/scrub. Включить page/record identity/version, валидировать длины до чтения; тестировать flips, truncation, reordered/misdirected blocks.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


253. (L1 [P]) Реализовать checksum in WAL record header

     **Ответ:** Сериализовать length/type/tx_id/LSN/payload/checksum, писать loop с short-write/EINTR обработкой. Разделить written и durable LSN, sync перед требуемым ACK; parser ограничивает length и останавливает recovery на неполном tail.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


254. (L1 [P]) Реализовать checksum verification during restore

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


255. (L1 [P]) Реализовать test, намеренно flipping bit in stored data

     **Ответ:** Выбрать алгоритм и покрываемые bytes/metadata, считать до write и проверять на read/scrub. Включить page/record identity/version, валидировать длины до чтения; тестировать flips, truncation, reordered/misdirected blocks.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


256. (L2 [T]) Почему checksum должен покрывать именно те байты, которые реально важны для integrity?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


257. (L2 [T]) Почему checksum on compressed vs uncompressed data gives different trade-offs?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


258. (L2 [T]) Почему checksums на разных уровнях нужны одновременно: page-level, file-level, manifest-level?

     **Ответ:** Manifest/catalog описывает опубликованный набор file generations и их metadata. Данные output file завершаются до ссылки из durable manifest; старые files удаляются после безопасной публикации и исчезновения readers. Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


259. (L2 [T]) Почему torn writes могут оставлять формально корректный размер, но неверную checksum?

     **Ответ:** Torn page содержит смесь частей разных записей страницы. Checksum обнаруживает часть повреждений, а full-page images/doublewrite/atomic replacement дают материал для восстановления; одного checksum недостаточно. Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


260. (L2 [T]) Почему checksum mismatch during WAL replay should usually stop recovery or trigger special handling?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


261. (L2 [T]) Как checksum cost влияет на hot read/write path?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


262. (L2 [T]) Почему hardware offload/CRC instructions matter at high throughput?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


263. (L2 [T]) Чем end-to-end checksum отличается от local checksum at one layer?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


264. (L2 [T]) Почему manifest checksum важна для archives and multipart backups?

     **Ответ:** Manifest/catalog описывает опубликованный набор file generations и их metadata. Данные output file завершаются до ссылки из durable manifest; старые files удаляются после безопасной публикации и исчезновения readers. Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


265. (L2 [T]) Почему checksum cannot detect semantic bug writing wrong but internally consistent data?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


266. (L2 [P]) Реализовать hierarchy: block checksum + file manifest checksum

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


267. (L2 [P]) Реализовать choose-once checksum algorithm in file format version

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


268. (L2 [P]) Реализовать benchmark checksum overhead on write/read path

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


269. (L2 [P]) Реализовать checksum sampling verifier for large archives

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


270. (L2 [P]) Реализовать compare compressed-payload checksum vs logical-record checksum

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


271. (L2 [D]) Почему checksum mismatch occurs only on one machine or one filesystem?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


272. (L2 [D]) Почему WAL checksum failures rare but catastrophic?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


273. (L2 [D]) Почему backup file checksum ok, but internal page checksums fail after restore?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


274. (L2 [D]) Почему enabling checksums surfaced many old latent issues?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


275. (L2 [D]) Почему checksum verification tanked throughput unexpectedly?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


276. (L3 [T]) Как проектировать multi-layer checksum strategy without excessive overhead?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


277. (L3 [T]) Как SIMD/CPU CRC instructions and batching reduce checksum cost?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Vectorized batches уменьшают per-row overhead и помогают SIMD, но memory bandwidth/gather/variable-length types могут ограничить выигрыш. Нужны feature detection, безопасный tail и scalar oracle; наличие vector instructions само не доказывает ускорение.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


278. (L3 [T]) Почему checksum coverage decisions are part of file format design, not post-hoc feature?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


279. (L3 [T]) Как checksums interact with encryption, compression and deduplication?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


280. (L3 [T]) Почему checksum validation policy matters: verify-on-read, verify-on-write, background scrub, restore-time verify?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Scrubbing читает и проверяет ранее холодные blocks, выявляя latent corruption до восстановления/отказа replica. Оно расходует I/O и требует корректного repair source; successful scrub не доказывает бизнес-инварианты.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


281. (L3 [T]) Как distinguish transport corruption from at-rest corruption using checksum layering?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


282. (L3 [T]) Почему recovery tooling should preserve and inspect checksum failure context?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


283. (L3 [T]) Как choose between stronger checksum, faster checksum and cryptographic hash for different layers?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


284. (L3 [T]) Почему checksum observability should include location, layer, recurrence and first-seen time?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Covering требует наличия всех полей query в index, включая predicates/order, но не гарантирует index-only физическое чтение. Payload columns и широкий composite key увеличивают размер и write maintenance.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


285. (L3 [T]) Почему checksums are necessary but still insufficient for true data reliability?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


286. (L3 [P]) Реализовать layered checksum strategy for WAL + pages + backup manifests

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


287. (L3 [P]) Реализовать vectorized/batched checksum computation

     **Ответ:** Сначала scalar oracle, затем typed batches/selection+validity masks, CPU feature detection и безопасный tail. Не читать за bounds, сохранять backing lifetime; проверить NULL/overflow/NaN semantics и сравнить instructions/row/bytes, а не только throughput.

     **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


288. (L3 [P]) Реализовать background audit that revalidates sampled stored blocks

     **Ответ:** Выбрать алгоритм и покрываемые bytes/metadata, считать до write и проверять на read/scrub. Включить page/record identity/version, валидировать длины до чтения; тестировать flips, truncation, reordered/misdirected blocks.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


289. (L3 [P]) Реализовать telemetry: checksum failures by file/page/segment/layer

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


290. (L3 [P]) Реализовать fault injector to simulate transport vs storage corruption

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


291. (L3 [D]) Как доказать, что checksum failures caused by memory scribble, not disk corruption?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


292. (L3 [D]) Почему page checksum failures spike after enabling compression or encryption?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Шифрование защищает данные только при корректном key lifecycle и доступах; потеря KMS/key может сделать исправный backup невосстановимым. Catalog должен знать key/version, а restore drill проверять реальные permissions и rotation. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


293. (L3 [D]) Как расследовать mismatch between manifest checksum and inner-block checksums?

     **Ответ:** Manifest/catalog описывает опубликованный набор file generations и их metadata. Данные output file завершаются до ссылки из durable manifest; старые files удаляются после безопасной публикации и исчезновения readers. Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


294. (L3 [D]) Почему stronger checksum algorithm fixed false negatives but introduced hot-path CPU bottleneck?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


295. (L3 [D]) Как найти layer where corruption first appears when multiple checksum layers disagree?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Сопоставить checksum failures с page IDs/generations, независимыми копиями и storage errors. Уточнить где checksum создан/проверен: corruption после проверки либо до расчёта может остаться незамеченной.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


296. (L4 [S]) Как проектировать checksum policy for entire data platform, not one engine?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Рекомендация:** Подбирать granularity/CPU/coverage по данным и пути передачи, наблюдать ошибки и иметь repair source. CRC полезен против случайных ошибок, криптохэш — для иных свойств, но ни один не заменяет backup/recovery.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


297. (L4 [S]) Когда достаточно lightweight checksum, а когда нужен stronger hash/integrity scheme?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Рекомендация:** Подбирать granularity/CPU/coverage по данным и пути передачи, наблюдать ошибки и иметь repair source. CRC полезен против случайных ошибок, криптохэш — для иных свойств, но ни один не заменяет backup/recovery.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


298. (L4 [S]) Как балансировать checksum coverage, CPU overhead and recovery confidence?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Рекомендация:** Подбирать granularity/CPU/coverage по данным и пути передачи, наблюдать ошибки и иметь repair source. CRC полезен против случайных ошибок, криптохэш — для иных свойств, но ни один не заменяет backup/recovery.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


299. (L4 [S]) Как объяснять командам, что checksums detect corruption but do not replace backups, PITR or drills?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

     **Рекомендация:** Подбирать granularity/CPU/coverage по данным и пути передачи, наблюдать ошибки и иметь repair source. CRC полезен против случайных ошибок, криптохэш — для иных свойств, но ни один не заменяет backup/recovery.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


300. (L4 [S]) Как встроить checksum telemetry into routine reliability reviews instead of waiting for corruption incident?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Подбирать granularity/CPU/coverage по данным и пути передачи, наблюдать ошибки и иметь repair source. CRC полезен против случайных ошибок, криптохэш — для иных свойств, но ни один не заменяет backup/recovery.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Почему backup, snapshots и PITR решают разные классы инцидентов?

     **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


302. (L2 [T]) Почему replication не заменяет backup при corruption or operator error?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


303. (L2 [T]) Как checksums, scrubbing и archive verification together improve confidence in restore?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. Scrubbing читает и проверяет ранее холодные blocks, выявляя latent corruption до восстановления/отказа replica. Оно расходует I/O и требует корректного repair source; successful scrub не доказывает бизнес-инварианты.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


304. (L2 [T]) Почему restore drills важнее “зелёных backup jobs”?

     **Ответ:** Backup — восстанавливаемая копия с выбранными RPO/RTO и независимым failure domain. Реплика распространяет логические ошибки/удаления и не заменяет backup; наличие файла без restore test не доказывает восстановимость.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


305. (L2 [T]) Как snapshots and PITR interact with schema migrations and dual writes?

     **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

     **Пример:** Source transaction пишет order и outbox event; relay повторяет событие, destination дедуплицирует его по event_id.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


306. (L2 [T]) Почему object storage durability не гарантирует application-level recoverability?

     **Ответ:** Высокая durability object service относится к сохранности объектов по его модели, а не к полноте/согласованности вашего backup. Неправильный key, недописанный manifest, удаление или потеря encryption key остаются рисками уровня приложения.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


307. (L2 [T]) Как page cache, WAL, fsync and device caches complicate reliability reasoning?

     **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

     **Пример:** pageLSN=120 нельзя flush как durable page, пока durable WAL LSN меньше 120.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


308. (L2 [T]) Почему data corruption часто обнаруживается в одном месте, а зарождается в другом?

     **Ответ:** Физическая corruption нарушает encoding/checksum/структуру, логическая может сохранять checksum, но нарушать смысл/ссылки. Silent corruption требует end-to-end detection; replication способна размножить уже повреждённые логические изменения.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


309. (L2 [T]) Почему metadata/control-plane reliability equally important as raw data blocks?

     **Ответ:** Block-based format группирует sorted entries в independently addressable blocks с encoding/compression/checksum. Sparse index направляет к нужному block, а footer описывает metadata; block size меняет read amplification и cache granularity.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


310. (L2 [T]) Почему true data reliability is a chain: write correctness → checksums → backups → restore proofs → incident workflow?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого. ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


311. (L2 [P]) Реализовать end-to-end mini system: pages + checksums + snapshot + backup + PITR replay

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


312. (L2 [P]) Реализовать dashboard: backup freshness, restore success rate, PITR horizon, scrub lag, checksum failures

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos harness: power loss, torn page, lost WAL segment, corrupted backup chunk

     **Ответ:** Добавить page identity/LSN/checksum и источник восстановления: full-page log image, doublewrite либо доказанный atomic replacement. Injector повреждает часть write; recovery должен восстановить правильную версию, а не только обнаружить checksum mismatch.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [Raft paper](https://raft.github.io/raft.pdf)


314. (L2 [P]) Реализовать restore drill pipeline on sampled production snapshots/backups

     **Ответ:** Consistent backup boundary через engine API, manifest/data/schema/keys/checksums и durable completion. Возобновляемый transfer хранит progress, restore выполняется изолированно и проверяет invariants/полноту и фактический RTO, включая log chain.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


315. (L2 [P]) Реализовать incident simulator: user DELETE, corruption, bad migration, then choose correct recovery mechanism

     **Ответ:** Injector меняет/truncates/reorders bytes с известной provenance; reader validates framing/identity/checksum до parsing. Scrubber ограничен budget, repair использует проверенную generation/copy и никогда не скрывает mismatch; test логическую ошибку с валидным checksum отдельно.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


316. (L3 [D]) Почему все backup jobs зелёные, но restore readiness фактически нулевая?

     **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


317. (L3 [D]) Почему corruption discovered during restore spread through backups weeks earlier?

     **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


318. (L3 [D]) Как доказать, что missing data after restore caused by PITR archive gap, not by backup corruption?

     **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


319. (L3 [D]) Почему snapshot rollback worked technically but violated application invariants due to external systems?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом. Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


320. (L3 [D]) Как расследовать инцидент “данные частично восстановлены, но confidence in correctness low”?

     **Ответ:** Проверить backup manifest, versions, encryption keys, archive completeness и restore logs. Отдельно выяснить, были ли данные согласованы во время копии и доступен ли весь chain/delta set; не проверять только exit code job.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


321. (L4 [S]) Как строить platform-wide data reliability program, а не набор разрозненных backup scripts?

     **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


322. (L4 [S]) Какие reliability drills should be mandatory for critical databases?

     **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


323. (L4 [S]) Как формулировать RPO/RTO/PITR/corruption-detection guarantees так, чтобы их понимали и инженеры, и бизнес?

     **Ответ:** RPO — допустимая потеря/отставание точки восстановления, RTO — допустимое время восстановления сервиса. В RTO входят provision/download/replay/validation/routing; репликация ACK policy и tested restore определяют реальные пределы.

     **Рекомендация:** Совместить checksums, scrubbing, независимые backups и проверенную процедуру repair. Определить trust/authority и blast radius, не считать hash доказательством бизнес-корректности или защитой от атак без MAC/signature.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


324. (L4 [S]) Какие anti-patterns чаще всего создают ложное чувство data safety?

     **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


325. (L4 [S]) Как объяснять организации, что надёжность данных — это не feature одной БД, а дисциплина всей системы эксплуатации?

     **Ответ:** Автоматизировать independent immutable/offsite copies, retention, доступ и регулярные restore drills. RTO включает provisioning, downloads, replay и validation; договорённость должна быть end-to-end, а не только про скорость копирования.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)
