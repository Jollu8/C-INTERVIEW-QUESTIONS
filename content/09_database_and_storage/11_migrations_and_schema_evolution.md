# 🔄 11. Миграции и эволюция схемы

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

## 🔹 Schema migration

1. (L1 [T]) Что такое schema migration?

   **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


2. (L1 [T]) Зачем вообще нужны миграции схемы в БД?

   **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


3. (L1 [T]) Чем migration отличается от ad-hoc ручного ALTER TABLE?

   **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


4. (L1 [T]) Почему изменение схемы — это не только DDL, но и изменение поведения приложения?

   **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


5. (L1 [T]) Что такое versioned schema?

   **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


6. (L1 [T]) Почему schema changes опасны для production?

   **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


7. (L1 [T]) Что такое destructive migration?

   **Ответ:** Удаление/сужение поля может потерять данные и сломать редко активного reader. Перед contract нужно доказать отсутствие old readers/writers, сохранить recovery/rollback material и проверить dependent indexes/views/ETL.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


8. (L1 [T]) Что такое additive migration?

   **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


9. (L1 [T]) Почему additive changes обычно безопаснее?

   **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions.

   **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


10. (L1 [T]) Почему schema migration должна быть repeatable и observable?

    **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


11. (L1 [P]) Реализовать таблицу `schema_migrations` с version tracking

    **Ответ:** Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


12. (L1 [P]) Реализовать migration runner на C++/C с up/down шагами

    **Ответ:** Хранить migration/schema ID, dependencies, checksum definition и durable run state; runner выполняет допустимые шаги однократно/idempotently под coordinated ownership. Проверять old/new matrix и restart после частичного применения, запретить изменение уже опубликованной definition.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


13. (L1 [P]) Реализовать idempotent migration step

    **Ответ:** Хранить durable operation/event ID с UNIQUE и менять effect+inbox/result в одной транзакции. Повтор возвращает прежний outcome, другой payload с тем же ID отклоняется; crash между commit и ACK не должен повторять эффект.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


14. (L1 [P]) Реализовать dry-run режим для миграций

    **Ответ:** Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


15. (L1 [P]) Реализовать логирование applied/pending/failed migrations

    **Ответ:** Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


16. (L2 [T]) Почему изменение типа колонки может быть expensive rewrite?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


17. (L2 [T]) Почему `ADD COLUMN NULL` и `ADD COLUMN NOT NULL DEFAULT ...` имеют разную стоимость?

    **Ответ:** ADD/SET NOT NULL/default/type/rename имеют разные lock/rewrite/compatibility последствия по версии СУБД. Отдельно проверить validation scan, table rewrite и старых readers; fast metadata operation всё равно может ждать conflicting lock.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


18. (L2 [T]) Что такое metadata-only migration?

    **Ответ:** Metadata-only DDL меняет catalog без полного переписывания данных, но всё ещё может брать/ждать metadata/table locks. Поддержка зависит от версии/операции/default/type; длительный blocker способен сделать быстрый DDL долгим.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


19. (L2 [T]) Почему некоторые ALTER-операции требуют table rebuild?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


20. (L2 [T]) Почему миграции должны учитывать locking semantics конкретной СУБД?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


21. (L2 [T]) Почему large table migration может вызвать disk/network/cache pressure?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


22. (L2 [T]) Что такое migration ordering dependency?

    **Ответ:** Catalog/registry фиксирует schema IDs, compatibility policy, владельцев и зависимости. Он не доказывает semantic compatibility автоматически; ordering миграций и versioned rollback должны учитывать все producers/consumers.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


23. (L2 [T]) Почему rollback migration сложнее, чем кажется?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


24. (L2 [T]) Почему application rollout и schema rollout должны быть связаны?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


25. (L2 [T]) Что такое expand/contract migration pattern?

    **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


26. (L2 [P]) Реализовать expand/contract workflow для rename column

    **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными. Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


27. (L2 [P]) Реализовать lock timeout / retry policy для DDL migration

    **Ответ:** Передать общий deadline в acquisition, при истечении атомарно удалить waiter и освободить принадлежащие ему ресурсы по transaction semantics. DDL retry должен перепроверять состояние migration, иметь bounded jitter/backoff и не оставлять долгий blocker в очереди.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


28. (L2 [P]) Реализовать migration dependency graph

    **Ответ:** Хранить migration IDs и depends_on, проверить отсутствующие зависимости/циклы и получить topological order. Запускать только ready migrations с durable status, координировать concurrent runners; restart не должен повторно применять уже завершённое destructive изменение.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


29. (L2 [P]) Реализовать checksum/validation после миграции

    **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

    **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


30. (L2 [P]) Реализовать benchmark миграции на таблице с десятками миллионов строк

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


31. (L2 [D]) Почему seemingly simple ALTER TABLE заблокировал writes?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


32. (L2 [D]) Почему migration на staging быстрая, а в production идёт часами?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


33. (L2 [D]) Почему после миграции выросла latency у unrelated queries?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


34. (L2 [D]) Почему rollback не вернул систему в прежнее состояние?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


35. (L2 [D]) Почему часть сервисов работает после миграции, а часть падает?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


36. (L3 [T]) Как проектировать migration framework для many-service environment?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


37. (L3 [T]) Почему schema registry / schema catalog важен в крупных системах?

    **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect. Catalog/registry фиксирует schema IDs, compatibility policy, владельцев и зависимости. Он не доказывает semantic compatibility автоматически; ordering миграций и versioned rollback должны учитывать все producers/consumers.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


38. (L3 [T]) Как migration взаимодействует с replication, failover и backups?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


39. (L3 [T]) Почему long-running transactions и schema changes конфликтуют?

    **Ответ:** Долгий snapshot удерживает версии и может мешать vacuum/compaction, увеличивая storage и read work. Ограничение срока/прерывание старых readers — эксплуатационная политика с явными последствиями для клиента.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


40. (L3 [T]) Как DDL locks/metadata locks влияют на runtime traffic?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


41. (L3 [T]) Почему изменение индексов часто опаснее изменения колонок?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


42. (L3 [T]) Как проектировать migrations для multi-tenant DB?

    **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


43. (L3 [T]) Почему migration tooling должно поддерживать pause/resume/cancel?

    **Ответ:** Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию.

    **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


44. (L3 [T]) Как строить safety checks перед destructive schema change?

    **Ответ:** Удаление/сужение поля может потерять данные и сломать редко активного reader. Перед contract нужно доказать отсутствие old readers/writers, сохранить recovery/rollback material и проверить dependent indexes/views/ETL.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


45. (L3 [T]) Почему schema evolution — это часть distributed systems engineering, а не только DB admin task?

    **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


46. (L3 [P]) Реализовать migration orchestrator с phased rollout

    **Ответ:** Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


47. (L3 [P]) Реализовать metadata lock watcher и abort guard

    **Ответ:** Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


48. (L3 [P]) Реализовать preflight checks: free disk, replication lag, long transactions

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


49. (L3 [P]) Реализовать pause/resume for long-running migration job

    **Ответ:** Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию. Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

    **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


50. (L3 [P]) Реализовать observability: progress %, rows touched, lock wait, lag impact

    **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


51. (L3 [D]) Как доказать, что bottleneck миграции — metadata lock, а не data copy?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


52. (L3 [D]) Почему после DDL вырос replication lag?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


53. (L3 [D]) Как расследовать migration, которая застревает только на одном shard-е?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


54. (L3 [D]) Почему migration прошла, но optimizer/plans внезапно ухудшились?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


55. (L3 [D]) Как найти hidden dependency сервисов на старую схему?

    **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


56. (L4 [S]) Как строить schema migration policy для большой инженерной организации?

    **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

    **Рекомендация:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


57. (L4 [S]) Когда schema changes должны проходить только через expand/contract?

    **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными.

    **Рекомендация:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


58. (L4 [S]) Как проектировать DB platform так, чтобы risky migrations были редкими?

    **Ответ:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


59. (L4 [S]) Как формулировать SLO/SLA для schema migration operations?

    **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

    **Рекомендация:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


60. (L4 [S]) Как объяснять командам, что “простая миграция” в production — это всегда hypothesis with blast radius?

    **Ответ:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


---

## 🔹 Backward / forward compatibility

61. (L1 [T]) Что такое backward compatibility схемы?

    **Ответ:** В контексте сохранённых schemas backward compatibility означает, что новый reader понимает старые данные. Нужны безопасные defaults, прежние типы/meaning и тест historical payload; «новый producer пишет новое» — другая сторона матрицы.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


62. (L1 [T]) Что такое forward compatibility схемы?

    **Ответ:** Forward compatibility означает, что старый reader корректно обрабатывает данные нового writer в оговорённых пределах, например игнорирует unknown optional fields. Unknown enum/type/required semantics могут её нарушить даже при успешном parse.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


63. (L1 [T]) Почему совместимость важна при независимом деплое сервисов?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


64. (L1 [T]) Почему удаление поля почти всегда опаснее добавления поля?

    **Ответ:** Удаление/сужение поля может потерять данные и сломать редко активного reader. Перед contract нужно доказать отсутствие old readers/writers, сохранить recovery/rollback material и проверить dependent indexes/views/ETL. Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


65. (L1 [T]) Почему nullable/additive columns обычно безопаснее?

    **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


66. (L1 [T]) Что значит “новый код работает со старой схемой”?

    **Ответ:** Новый binary не должен требовать ещё не добавленную column/обязательное поле и должен корректно читать старые values/defaults. Это позволяет code/schema rollout в согласованном expand этапе; поведение проверяется отдельной комбинацией версий.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


67. (L1 [T]) Что значит “старый код работает с новой схемой”?

    **Ответ:** Старый binary продолжает читать/писать расширенную schema без ошибки и нарушения инвариантов. Additive optional поле часто допустимо, а rename/drop/new enum/изменённый default способны сломать старые expectations.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


68. (L1 [T]) Почему compatibility — это свойство всей системы, а не только БД?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


69. (L1 [T]) Почему сериализация и schema evolution связаны?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


70. (L1 [T]) Почему rename column часто не backward-compatible change?

    **Ответ:** Совместимость проверяется матрицей old/new readers и writers, а не фактом успешного parse. Изменение default/NULL/meaning или повторное использование field ID способно сломать старого клиента без syntax error.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


71. (L1 [P]) Реализовать compatibility test matrix: old app ↔ new schema

    **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

    **Типичная ошибка:** Проверять только новый код на новой schema, забывая old/new combinations и persisted payloads.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


72. (L1 [P]) Реализовать compatibility test: new app ↔ old schema

    **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


73. (L1 [P]) Реализовать additive column rollout

    **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions. Составить матрицу old/new reader×writer×schema, добавить optional/default-safe поля и version tags. Не переиспользовать удалённые IDs/имена с новой семантикой, тестировать rolling deployment и rollback с уже записанными новыми данными.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


74. (L1 [P]) Реализовать safe deprecation flag для старого поля

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


75. (L1 [P]) Реализовать integration tests на mixed-version environment

    **Ответ:** Составить матрицу old/new reader×writer×schema, добавить optional/default-safe поля и version tags. Не переиспользовать удалённые IDs/имена с новой семантикой, тестировать rolling deployment и rollback с уже записанными новыми данными.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


76. (L2 [T]) Почему `NOT NULL` constraint часто требует phased rollout?

    **Ответ:** ADD/SET NOT NULL/default/type/rename имеют разные lock/rewrite/compatibility последствия по версии СУБД. Отдельно проверить validation scan, table rewrite и старых readers; fast metadata operation всё равно может ждать conflicting lock.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


77. (L2 [T]) Почему enum expansion и enum narrowing имеют разные риски?

    **Ответ:** Добавление enum value может сломать старый код с исчерпывающим switch/validation; удаление/сужение ломает уже сохранённые значения. Нужны unknown-value handling, version policy и migration существующих данных.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


78. (L2 [T]) Почему изменение семантики поля опаснее изменения типа?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


79. (L2 [T]) Что такое wire compatibility vs storage compatibility?

    **Ответ:** Wire compatibility касается обмена serialized payload между версиями, storage compatibility — чтения/записи сохранённых formats/schema. Они могут расходиться: новый protocol parser не обязан читать старый on-disk encoding.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


80. (L2 [T]) Почему default values могут скрыть compatibility bugs?

    **Ответ:** ADD/SET NOT NULL/default/type/rename имеют разные lock/rewrite/compatibility последствия по версии СУБД. Отдельно проверить validation scan, table rewrite и старых readers; fast metadata operation всё равно может ждать conflicting lock.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


81. (L2 [T]) Почему readers and writers evolve differently?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


82. (L2 [T]) Почему compatibility должна проверяться на уровне API/ORM/SQL и data semantics?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


83. (L2 [T]) Что такое tolerant reader pattern?

    **Ответ:** Tolerant reader принимает неизвестные допустимые поля и явно обрабатывает defaults/unknown enum, сохраняя validation важных invariants. «Игнорировать все ошибки» не является безопасной совместимостью.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


84. (L2 [T]) Почему generated code/ORM migrations могут ломать compatibility silently?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


85. (L2 [T]) Почему backward-compatible storage change не обязательно backward-compatible для analytics/jobs?

    **Ответ:** Совместимость проверяется матрицей old/new readers и writers, а не фактом успешного parse. Изменение default/NULL/meaning или повторное использование field ID способно сломать старого клиента без syntax error.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


86. (L2 [P]) Реализовать tolerant reader для optional fields

    **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


87. (L2 [P]) Реализовать phased `NOT NULL` migration: add nullable → backfill → enforce

    **Ответ:** Stable keyset ranges + durable batch cursor + idempotent versioned upsert. Связать snapshot с CDC boundary, throttle по foreground/lag, validate и catch-up перед cutover; повтор batch не стирает свежие изменения или delete.

    **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


88. (L2 [P]) Реализовать mixed-version canary test harness

    **Ответ:** Составить матрицу old/new reader×writer×schema, добавить optional/default-safe поля и version tags. Не переиспользовать удалённые IDs/имена с новой семантикой, тестировать rolling deployment и rollback с уже записанными новыми данными.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


89. (L2 [P]) Реализовать schema diff checker с compatibility rules

    **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


90. (L2 [P]) Реализовать automated contract tests для old/new readers/writers

    **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


91. (L2 [D]) Почему новый сервис пишет данные, которые старый не может прочитать?

    **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

    **Типичная ошибка:** Проверять только новый код на новой schema, забывая old/new combinations и persisted payloads.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


92. (L2 [D]) Почему migration была “additive”, но старый код всё равно упал?

    **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions. Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


93. (L2 [D]) Почему default value скрыла частичный rollout bug?

    **Ответ:** ADD/SET NOT NULL/default/type/rename имеют разные lock/rewrite/compatibility последствия по версии СУБД. Отдельно проверить validation scan, table rewrite и старых readers; fast metadata operation всё равно может ждать conflicting lock. Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


94. (L2 [D]) Почему совместимость ломается только на старых бэкфилленных строках?

    **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


95. (L2 [D]) Почему часть клиентов работает, а часть видит null/unknown field errors?

    **Ответ:** Совместимость проверяется матрицей old/new readers и writers, а не фактом успешного parse. Изменение default/NULL/meaning или повторное использование field ID способно сломать старого клиента без syntax error. Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


96. (L3 [T]) Как формализовать compatibility policy для data contracts?

    **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


97. (L3 [T]) Почему backward/forward compatibility должна учитывать не только schema shape, но и invariants?

    **Ответ:** Совместимость проверяется матрицей old/new readers и writers, а не фактом успешного parse. Изменение default/NULL/meaning или повторное использование field ID способно сломать старого клиента без syntax error. Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


98. (L3 [T]) Как строить compatibility gates в CI/CD?

    **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


99. (L3 [T]) Как schema compatibility связана с event sourcing / CDC / replication pipelines?

    **Ответ:** Transactional outbox связывает business write и event в одной локальной транзакции; CDC извлекает committed изменения. Delivery может быть at-least-once, поэтому destination требует dedup/version handling и reconciliation.

    **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


100. (L3 [T]) Почему data consumers, которых “не видно”, особенно опасны для schema evolution?

     **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


101. (L3 [T]) Как multi-region/multi-version deployments усложняют compatibility reasoning?

     **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


102. (L3 [T]) Почему compatibility tests должны включать production-like old data?

     **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


103. (L3 [T]) Как version skew между services, jobs и DB clients создаёт hidden breakage?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


104. (L3 [T]) Почему compatibility budget — это продуктовая и организационная политика, а не только техдизайн?

     **Ответ:** Backward compatibility позволяет новому reader понимать старые данные/клиентов, forward — старому reader понимать новые в определённой границе. Совместимость синтаксиса не гарантирует сохранение meaning, defaults и invariants.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


105. (L3 [T]) Как schema registry или contract ownership уменьшают migration risk?

     **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными. Catalog/registry фиксирует schema IDs, compatibility policy, владельцев и зависимости. Он не доказывает semantic compatibility автоматически; ordering миграций и versioned rollback должны учитывать все producers/consumers.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


106. (L3 [P]) Реализовать compatibility linter для migration PRs

     **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


107. (L3 [P]) Реализовать version-skew test environment

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Составить матрицу old/new reader×writer×schema, добавить optional/default-safe поля и version tags. Не переиспользовать удалённые IDs/имена с новой семантикой, тестировать rolling deployment и rollback с уже записанными новыми данными.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


108. (L3 [P]) Реализовать semantic compatibility checks on sampled production rows

     **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


109. (L3 [P]) Реализовать consumer inventory / dependency graph for schema users

     **Ответ:** Хранить nodes с устойчивыми IDs и typed directed edges; updates и snapshot графа должны быть concurrency-safe. Cycle detection/топологический порядок выбрать по задаче, проверять stale edges, cancellation и воспроизводимые interleavings.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


110. (L3 [P]) Реализовать rollout gate: block destructive change if old readers still active

     **Ответ:** Удаление/сужение поля может потерять данные и сломать редко активного reader. Перед contract нужно доказать отсутствие old readers/writers, сохранить recovery/rollback material и проверить dependent indexes/views/ETL. Составить матрицу old/new reader×writer×schema, добавить optional/default-safe поля и version tags. Не переиспользовать удалённые IDs/имена с новой семантикой, тестировать rolling deployment и rollback с уже записанными новыми данными.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


111. (L3 [D]) Как доказать, что инцидент вызван compatibility break, а не corrupted data?

     **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


112. (L3 [D]) Почему mixed-version fleet ломается только после partial deploy?

     **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


113. (L3 [D]) Как расследовать невидимого consumer-а, который зависит от старого поля?

     **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


114. (L3 [D]) Почему compatibility tests зелёные, а production ломается на edge-case rows?

     **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


115. (L3 [D]) Как найти semantic incompatibility, когда типы формально совместимы?

     **Ответ:** Зафиксировать реальные версии producers/consumers и payload, сравнить defaults/unknown fields/enums/nullable semantics. Ошибка может возникнуть у старого фонового consumer спустя время, хотя основной API уже обновлён.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


116. (L4 [S]) Как строить organizational compatibility policy для схем и data contracts?

     **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными.

     **Рекомендация:** Поддерживать явные deprecation windows, expand-contract и contract tests с историческими fixtures. Удалять поля/индексы только после inventory всех readers, включая ETL, restore и редко запускаемые jobs.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


117. (L4 [S]) Когда allowed only additive changes, а когда возможны controlled breaking changes?

     **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions.

     **Рекомендация:** Поддерживать явные deprecation windows, expand-contract и contract tests с историческими fixtures. Удалять поля/индексы только после inventory всех readers, включая ETL, restore и редко запускаемые jobs.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)


118. (L4 [S]) Как проектировать платформу, чтобы teams не ломали друг другу schema evolution?

     **Ответ:** Поддерживать явные deprecation windows, expand-contract и contract tests с историческими fixtures. Удалять поля/индексы только после inventory всех readers, включая ETL, restore и редко запускаемые jobs.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


119. (L4 [S]) Как объяснять, что backward/forward compatibility — это про rollout safety, а не про “красивую схему”?

     **Ответ:** Совместимость проверяется матрицей old/new readers и writers, а не фактом успешного parse. Изменение default/NULL/meaning или повторное использование field ID способно сломать старого клиента без syntax error.

     **Рекомендация:** Поддерживать явные deprecation windows, expand-contract и contract tests с историческими fixtures. Удалять поля/индексы только после inventory всех readers, включая ETL, restore и редко запускаемые jobs.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


120. (L4 [S]) Как балансировать скорость разработки и строгие compatibility guarantees?

     **Ответ:** Поддерживать явные deprecation windows, expand-contract и contract tests с историческими fixtures. Удалять поля/индексы только после inventory всех readers, включая ETL, restore и редко запускаемые jobs.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


---

## 🔹 Online migrations

121. (L1 [T]) Что такое online migration?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


122. (L1 [T]) Чем online migration отличается от offline migration?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


123. (L1 [T]) Почему online migration важна для high-availability systems?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


124. (L1 [T]) Почему online migration почти всегда сложнее?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


125. (L1 [T]) Что значит “без долгого stop-the-world”?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


126. (L1 [T]) Почему online migration обычно делается поэтапно?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


127. (L1 [T]) Что такое chunked migration?

     **Ответ:** Работа делится на bounded key ranges/batches с durable progress и идемпотентным применением. Stable cursor, version checks и snapshot/CDC boundary защищают от пропусков и stale overwrite при concurrent writes.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


128. (L1 [T]) Почему throttling важен для online migration?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


129. (L1 [T]) Почему online migration должна быть resumable?

     **Ответ:** Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


130. (L1 [T]) Почему verification после online migration обязательна?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


131. (L1 [P]) Реализовать chunked backfill job для таблицы

     **Ответ:** Stable keyset ranges + durable batch cursor + idempotent versioned upsert. Связать snapshot с CDC boundary, throttle по foreground/lag, validate и catch-up перед cutover; повтор batch не стирает свежие изменения или delete.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


132. (L1 [P]) Реализовать migration progress table с checkpoint-ами

     **Ответ:** Подготовить shadow schema/index, snapshot/backfill и change capture с контролем гонок, validate и выполнить bounded cutover. Ограничить batch и lock timeout, предусмотреть cancel/resume и cleanup незавершённого build.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


133. (L1 [P]) Реализовать throttled row copier

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


134. (L1 [P]) Реализовать resumable online migration workflow

     **Ответ:** Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию. Подготовить shadow schema/index, snapshot/backfill и change capture с контролем гонок, validate и выполнить bounded cutover. Ограничить batch и lock timeout, предусмотреть cancel/resume и cleanup незавершённого build.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


135. (L1 [P]) Реализовать compare old/new table row counts during migration

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


136. (L2 [T]) Почему chunk size влияет и на throughput, и на p99 latency?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


137. (L2 [T]) Почему online migration должна учитывать replication lag?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


138. (L2 [T]) Почему full table scan во время migration может убить OLTP?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


139. (L2 [T]) Что такое shadow table / ghost table?

     **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


140. (L2 [T]) Почему triggers/binlog/CDC часто используются для online migration?

     **Ответ:** Transactional outbox связывает business write и event в одной локальной транзакции; CDC извлекает committed изменения. Delivery может быть at-least-once, поэтому destination требует dedup/version handling и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


141. (L2 [T]) Что такое cutover в online migration?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


142. (L2 [T]) Почему final cutover — самый рискованный шаг?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


143. (L2 [T]) Почему online index build — отдельный special case online migration?

     **Ответ:** Online/concurrent index build требует snapshot scan, учёта concurrent изменений и validation до публикации. Ошибка может оставить invalid build; нужно контролировать locks, disk headroom, progress и cleanup.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


144. (L2 [T]) Почему long-running writes осложняют consistent cutover?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


145. (L2 [T]) Почему online migration должна уметь деградировать gracefully или останавливаться?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


146. (L2 [P]) Реализовать shadow table migration

     **Ответ:** Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными. Подготовить shadow schema/index, snapshot/backfill и change capture с контролем гонок, validate и выполнить bounded cutover. Ограничить batch и lock timeout, предусмотреть cancel/resume и cleanup незавершённого build.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


147. (L2 [P]) Реализовать change-capture stream для догонки изменений

     **Ответ:** Подготовить shadow schema/index, snapshot/backfill и change capture с контролем гонок, validate и выполнить bounded cutover. Ограничить batch и lock timeout, предусмотреть cancel/resume и cleanup незавершённого build.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


148. (L2 [P]) Реализовать chunk scheduler с adaptive throttling

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


149. (L2 [P]) Реализовать cutover flag switch

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


150. (L2 [P]) Реализовать verify-by-checksum for migrated chunks

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


151. (L2 [D]) Почему online migration не блокирует writes, но всё равно ломает latency?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


152. (L2 [D]) Почему replication lag взлетел во время migration?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


153. (L2 [D]) Почему cutover прошёл, но часть reads ушла в старую таблицу?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


154. (L2 [D]) Почему migration идёт бесконечно, хотя бэкфилл почти закончен?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


155. (L2 [D]) Почему chunked migration даёт sawtooth CPU/IO pattern?

     **Ответ:** Работа делится на bounded key ranges/batches с durable progress и идемпотентным применением. Stable cursor, version checks и snapshot/CDC boundary защищают от пропусков и stale overwrite при concurrent writes. Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


156. (L3 [T]) Как проектировать online migration protocol: snapshot → catch-up → verify → cutover?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


157. (L3 [T]) Почему exactly-once semantics редко достижима “бесплатно” в migration pipelines?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


158. (L3 [T]) Как dual reads/verification снижают риск silent divergence?

     **Ответ:** Dual-read сравнивает либо выбирает два источника по явному precedence/version правилу. Silent fallback на любой успешный ответ может скрыть drift/stale state; comparison требует сопоставимой snapshot/CDC boundary и метрик расхождений.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


159. (L3 [T]) Как проектировать chunk boundaries, чтобы избежать hotspot ranges?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


160. (L3 [T]) Как online migrations сочетаются с partitioned/sharded systems?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


161. (L3 [T]) Почему online migration tooling должно быть topology-aware?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


162. (L3 [T]) Как observability должна разделять copy lag, change-catch-up lag и cutover readiness?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


163. (L3 [T]) Почему page cache/buffer pool pollution от migration может быть главным production effect?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


164. (L3 [T]) Как metadata locks и final rename/swap влияют на blast radius?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


165. (L3 [T]) Почему successful online migration — это orchestration problem, а не только SQL trick?

     **Ответ:** Online изменение стремится сохранить обслуживание, но может иметь краткие metadata locks, дополнительный I/O и catch-up. Возможность зависит от операции/версии СУБД; низкое downtime не означает отсутствие влияния на p99.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


166. (L3 [P]) Реализовать migration state machine: init/copy/catchup/verify/cutover/done

     **Ответ:** Durable states plan→copy→catch-up→validate→cutover→cleanup с migration ID и idempotent retries. Version/fence защищает ownership, rate limits и disk headroom защищают foreground; test restart на каждом переходе и rollback eligibility.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


167. (L3 [P]) Реализовать lag-aware throttling by observed p99 latency

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


168. (L3 [P]) Реализовать per-chunk checksums + retry

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


169. (L3 [P]) Реализовать dual-read verifier on sampled traffic

     **Ответ:** Новый read path сначала сравнивает old/new results на сопоставимой boundary и пишет bounded mismatch telemetry. Явно задать authority/precedence, не маскировать drift fallback; switching разрешается после validation и max lag criteria.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


170. (L3 [P]) Реализовать automated cutover readiness checklist

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Подготовить shadow schema/index, snapshot/backfill и change capture с контролем гонок, validate и выполнить bounded cutover. Ограничить batch и lock timeout, предусмотреть cancel/resume и cleanup незавершённого build.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


171. (L3 [D]) Как доказать, что degradation caused by online migration comes from cache pollution, not locks?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


172. (L3 [D]) Почему change-catch-up не догоняет high-write workload?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


173. (L3 [D]) Как расследовать cutover, где logical switch завершился, а часть app-нodes осталась на старом path?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


174. (L3 [D]) Почему verification зелёная по row counts, но данные всё равно расходятся?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


175. (L3 [D]) Как найти unsafe assumption в online migration script, которая проявляется только на одном shard-е?

     **Ответ:** Измерить lock queue, old transactions, progress/catch-up lag, write amplification и disk headroom. Проверить, не блокирует ли ожидающий DDL следующие запросы и не сломан ли rollback после частичного cutover.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


176. (L4 [S]) Когда online migration обязательна, а когда честнее сделать maintenance window?

     **Ответ:** Выбирать native concurrent/online DDL, когда оно даёт нужные гарантии; shadow-copy оправдан при иных ограничениях. План должен охватывать retries, validation, cutover и возврат, а не только запуск ALTER.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


177. (L4 [S]) Как строить migration platform, usable не только staff-инженерами?

     **Ответ:** Выбирать native concurrent/online DDL, когда оно даёт нужные гарантии; shadow-copy оправдан при иных ограничениях. План должен охватывать retries, validation, cutover и возврат, а не только запуск ALTER.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


178. (L4 [S]) Как выбирать between shadow table, in-place DDL, dual-write, CDC-based copy?

     **Ответ:** Transactional outbox связывает business write и event в одной локальной транзакции; CDC извлекает committed изменения. Delivery может быть at-least-once, поэтому destination требует dedup/version handling и reconciliation. Expand-contract сначала добавляет совместимый путь, затем переносит/догоняет данные и переключает readers, а удаляет старый контракт последним. Shadow copy/cutover должны учитывать concurrent writes и rollback с уже новыми данными.

     **Рекомендация:** Выбирать native concurrent/online DDL, когда оно даёт нужные гарантии; shadow-copy оправдан при иных ограничениях. План должен охватывать retries, validation, cutover и возврат, а не только запуск ALTER.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


179. (L4 [S]) Как формулировать risk budget и rollback strategy для online migration?

     **Ответ:** Выбирать native concurrent/online DDL, когда оно даёт нужные гарантии; shadow-copy оправдан при иных ограничениях. План должен охватывать retries, validation, cutover и возврат, а не только запуск ALTER.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


180. (L4 [S]) Как объяснять командам, что “online” не значит “free” по latency/cost/complexity?

     **Ответ:** Выбирать native concurrent/online DDL, когда оно даёт нужные гарантии; shadow-copy оправдан при иных ограничениях. План должен охватывать retries, validation, cutover и возврат, а не только запуск ALTER.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


---

## 🔹 Dual writes

181. (L1 [T]) Что такое dual writes?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Пример:** Source transaction пишет order и outbox event; relay повторяет событие, destination дедуплицирует его по event_id.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


182. (L1 [T]) Зачем dual writes используются в миграциях?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


183. (L1 [T]) Почему dual writes помогают переходу между старой и новой схемой/таблицей?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


184. (L1 [T]) Почему dual writes опасны?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


185. (L1 [T]) Что значит писать одновременно в old path и new path?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


186. (L1 [T]) Почему partial failure делает dual writes tricky?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


187. (L1 [T]) Почему порядок записи old/new path важен?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


188. (L1 [T]) Что такое dual read как companion к dual write?

     **Ответ:** Dual-read сравнивает либо выбирает два источника по явному precedence/version правилу. Silent fallback на любой успешный ответ может скрыть drift/stale state; comparison требует сопоставимой snapshot/CDC boundary и метрик расхождений.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


189. (L1 [T]) Почему idempotency важна при dual writes?

     **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


190. (L1 [T]) Почему dual writes — это не то же самое, что replication?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


191. (L1 [P]) Реализовать write path: write old table + new table

     **Ответ:** Записать business change и outbox event в одной локальной транзакции; relay повторяет публикацию, consumer применяет idempotently с durable inbox/version check. Backfill reconciles старые данные и не затирает свежие версии.

     **Типичная ошибка:** Называть две последовательные независимые записи атомарной транзакцией.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


192. (L1 [P]) Реализовать flag-controlled dual writes

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


193. (L1 [P]) Реализовать compare old/new payload after write

     **Ответ:** Matrix test old/new readers/writers на исторических и новых payload/schema, включая NULL/default/unknown enum и rollback. Проверять не только parse, но semantic result; destructive contract запрещён до исчезновения старых consumers.

     **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


194. (L1 [P]) Реализовать idempotent retry для dual-write operation

     **Ответ:** Хранить durable operation/event ID с UNIQUE и менять effect+inbox/result в одной транзакции. Повтор возвращает прежний outcome, другой payload с тем же ID отклоняется; crash между commit и ACK не должен повторять эффект.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


195. (L1 [P]) Реализовать failure injection: second write fails after first succeeds

     **Ответ:** Записать business change и outbox event в одной локальной транзакции; relay повторяет публикацию, consumer применяет idempotently с durable inbox/version check. Backfill reconciles старые данные и не затирает свежие версии.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


196. (L2 [T]) Почему dual writes создают риск divergence?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


197. (L2 [T]) Что такое write ordering bug в dual-write workflow?

     **Ответ:** Две записи/события могут примениться в разном порядке и оставить destination на старой версии. Operation ID устраняет дубли, но не порядок: нужны sequence/version compare и правило update/delete conflict.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


198. (L2 [T]) Почему exactly-once почти недостижима без дополнительного механизма?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


199. (L2 [T]) Что такое outbox/event-based alternative to direct dual writes?

     **Ответ:** Transactional outbox связывает business write и event в одной локальной транзакции; CDC извлекает committed изменения. Delivery может быть at-least-once, поэтому destination требует dedup/version handling и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


200. (L2 [T]) Почему retries без deduplication могут ухудшить divergence?

     **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


201. (L2 [T]) Почему dual writes особенно опасны across two different datastores?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


202. (L2 [T]) Как dual writes влияют на latency и tail risk?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


203. (L2 [T]) Почему read-after-write semantics усложняются при partial cutover?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Read-after-write гарантирует видимость завершённой записи по заявленной модели сервиса; S3 даёт strong consistency объектных операций. Это не атомарность нескольких keys/внешней БД и не запрет stale ответа собственного cache клиента.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


204. (L2 [T]) Почему transactional DB + non-transactional sink — классическая ловушка?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


205. (L2 [T]) Почему verification and reconciliation обязательны рядом с dual writes?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


206. (L2 [P]) Реализовать outbox table как safer alternative

     **Ответ:** Local transaction пишет effect+outbox, relay/CDC сохраняет position и повторяет delivery. Destination использует unique event ID и version-aware apply; тестировать crash всех границ, duplicate/out-of-order/update/delete и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


207. (L2 [P]) Реализовать dedup key для dual-write retries

     **Ответ:** Хранить durable operation/event ID с UNIQUE и менять effect+inbox/result в одной транзакции. Повтор возвращает прежний outcome, другой payload с тем же ID отклоняется; crash между commit и ACK не должен повторять эффект.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


208. (L2 [P]) Реализовать dual-read compare on sampled requests

     **Ответ:** Новый read path сначала сравнивает old/new results на сопоставимой boundary и пишет bounded mismatch telemetry. Явно задать authority/precedence, не маскировать drift fallback; switching разрешается после validation и max lag criteria.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


209. (L2 [P]) Реализовать reconciliation job для divergent rows

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


210. (L2 [P]) Реализовать metrics: old_write_ok, new_write_ok, mismatch_rate, retry_rate

     **Ответ:** Записать business change и outbox event в одной локальной транзакции; relay повторяет публикацию, consumer применяет idempotently с durable inbox/version check. Backfill reconciles старые данные и не затирает свежие версии.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


211. (L2 [D]) Почему old path и new path расходятся при редких таймаутах?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Типичная ошибка:** Называть две последовательные независимые записи атомарной транзакцией.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


212. (L2 [D]) Почему dual writes зелёные по логам, но данные в новой таблице неполные?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


213. (L2 [D]) Почему retries создали дубликаты в новом хранилище?

     **Ответ:** После потери ACK relay/client повторил уже применённую запись, а destination не связал durable event ID с эффектом в одной транзакции. Проследить один ID через source/outbox/apply/ACK, добавить UNIQUE inbox/idempotent versioned apply и сверить уже возникшие дубли.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


214. (L2 [D]) Почему dual-write rollout резко ухудшил p99 latency?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


215. (L2 [D]) Почему divergence видна только на update/delete, но не на insert?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


216. (L3 [T]) Как проектировать dual writes с bounded inconsistency window?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


217. (L3 [T]) Как outbox/CDC pattern снижает риск compared to direct dual writes?

     **Ответ:** Transactional outbox связывает business write и event в одной локальной транзакции; CDC извлекает committed изменения. Delivery может быть at-least-once, поэтому destination требует dedup/version handling и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


218. (L3 [T]) Почему sequencing and idempotency keys критичны?

     **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


219. (L3 [T]) Как dual writes взаимодействуют с replication lag и failover?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


220. (L3 [T]) Почему cross-service ownership делает dual writes ещё опаснее?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


221. (L3 [T]) Как verification sampling и full reconciliation дополняют друг друга?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


222. (L3 [T]) Как строить write fencing / version checks during migration?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


223. (L3 [T]) Почему dual writes иногда лучше заменить “single writer + derived copy”?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


224. (L3 [T]) Как observability должна показывать divergence as first-class signal?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


225. (L3 [T]) Почему dual writes — это distributed transaction problem в disguise?

     **Ответ:** Две независимые записи в разные системы не атомарны: crash/timeout между ними создаёт расхождение. Retry без operation ID даёт дубли, а одинаковый порядок вызовов не устраняет окно partial failure.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


226. (L3 [P]) Реализовать outbox + async applier pipeline

     **Ответ:** Local transaction пишет effect+outbox, relay/CDC сохраняет position и повторяет delivery. Destination использует unique event ID и version-aware apply; тестировать crash всех границ, duplicate/out-of-order/update/delete и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


227. (L3 [P]) Реализовать versioned writes with compare-and-set

     **Ответ:** Записать business change и outbox event в одной локальной транзакции; relay повторяет публикацию, consumer применяет idempotently с durable inbox/version check. Backfill reconciles старые данные и не затирает свежие версии.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


228. (L3 [P]) Реализовать reconciliation state machine: detect/fix/reverify

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


229. (L3 [P]) Реализовать dual-read shadow validation on live traffic

     **Ответ:** Новый read path сначала сравнивает old/new results на сопоставимой boundary и пишет bounded mismatch telemetry. Явно задать authority/precedence, не маскировать drift fallback; switching разрешается после validation и max lag criteria.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


230. (L3 [P]) Реализовать simulator partial failures and retries for dual-write path

     **Ответ:** Local transaction пишет effect+outbox, relay/CDC сохраняет position и повторяет delivery. Destination использует unique event ID и version-aware apply; тестировать crash всех границ, duplicate/out-of-order/update/delete и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


231. (L3 [D]) Как доказать, что divergence caused by retry ordering, not data corruption?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


232. (L3 [D]) Почему mismatch rate низкий в среднем, но catastrophic for one tenant?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


233. (L3 [D]) Как расследовать divergence после region failover during dual-write rollout?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


234. (L3 [D]) Почему direct dual writes кажутся простыми в code review, но ломаются под network jitter?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


235. (L3 [D]) Как найти safe cutover point при длительном периоде dual writes?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


236. (L4 [S]) Когда dual writes оправданы, а когда их надо запрещать policy-level?

     **Ответ:** Предпочесть transactional outbox/CDC и явный canonical source, если нет реального общего atomic commit. Определить lag/reconciliation/rollback, не оставлять временный dual-write как бессрочный неуправляемый протокол.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


237. (L4 [S]) Как выбрать between direct dual writes, outbox, CDC, shadow copy?

     **Ответ:** Transactional outbox связывает business write и event в одной локальной транзакции; CDC извлекает committed изменения. Delivery может быть at-least-once, поэтому destination требует dedup/version handling и reconciliation.

     **Рекомендация:** Предпочесть transactional outbox/CDC и явный canonical source, если нет реального общего atomic commit. Определить lag/reconciliation/rollback, не оставлять временный dual-write как бессрочный неуправляемый протокол.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


238. (L4 [S]) Как строить platform primitives, чтобы команды не писали unsafe dual writes вручную?

     **Ответ:** Предпочесть transactional outbox/CDC и явный canonical source, если нет реального общего atomic commit. Определить lag/reconciliation/rollback, не оставлять временный dual-write как бессрочный неуправляемый протокол.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


239. (L4 [S]) Как объяснять продуктовым командам цену длительного периода dual writes?

     **Ответ:** Предпочесть transactional outbox/CDC и явный canonical source, если нет реального общего atomic commit. Определить lag/reconciliation/rollback, не оставлять временный dual-write как бессрочный неуправляемый протокол.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


240. (L4 [S]) Как формулировать exit criteria из dual-write phase?

     **Ответ:** Предпочесть transactional outbox/CDC и явный canonical source, если нет реального общего atomic commit. Определить lag/reconciliation/rollback, не оставлять временный dual-write как бессрочный неуправляемый протокол.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


---

## 🔹 Data backfill

241. (L1 [T]) Что такое data backfill?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Пример:** Upsert version=5 не должен перезаписывать уже применённый destination update version=6.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


242. (L1 [T]) Зачем backfill нужен при schema evolution?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


243. (L1 [T]) Чем backfill отличается от migration DDL?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


244. (L1 [T]) Почему backfill часто делается асинхронно?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


245. (L1 [T]) Почему backfill может занимать часы или дни?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


246. (L1 [T]) Что такое chunked backfill?

     **Ответ:** Работа делится на bounded key ranges/batches с durable progress и идемпотентным применением. Stable cursor, version checks и snapshot/CDC boundary защищают от пропусков и stale overwrite при concurrent writes.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


247. (L1 [T]) Почему backfill должен быть restartable?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


248. (L1 [T]) Почему verification после backfill обязательна?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


249. (L1 [T]) Почему backfill может влиять на reads, writes и caches?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


250. (L1 [T]) Почему исторические данные часто содержат edge cases для backfill?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


251. (L1 [P]) Реализовать chunked backfill job по primary key ranges

     **Ответ:** Stable keyset ranges + durable batch cursor + idempotent versioned upsert. Связать snapshot с CDC boundary, throttle по foreground/lag, validate и catch-up перед cutover; повтор batch не стирает свежие изменения или delete.

     **Типичная ошибка:** Считать равный row count доказательством равенства значений и отсутствия пропусков.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


252. (L1 [P]) Реализовать cursor/checkpoint для resume

     **Ответ:** Keyset pagination идёт по стабильному упорядоченному уникальному cursor, в отличие от OFFSET, чувствительного к вставкам/удалениям. Для backfill дополнительно нужны snapshot/CDC boundary и idempotent checkpointed batches. Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию. Использовать stable keyset cursor и durable checkpoints, bounded batches, idempotent upsert с version compare. Связать snapshot с CDC position, догнать поток, проверить partitions/counts/checksums/invariants и безопасно повторить любой batch.

     **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


253. (L1 [P]) Реализовать per-chunk progress metrics

     **Ответ:** Использовать stable keyset cursor и durable checkpoints, bounded batches, idempotent upsert с version compare. Связать snapshot с CDC position, догнать поток, проверить partitions/counts/checksums/invariants и безопасно повторить любой batch.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


254. (L1 [P]) Реализовать validate-after-write for backfilled rows

     **Ответ:** Stable keyset ranges + durable batch cursor + idempotent versioned upsert. Связать snapshot с CDC boundary, throttle по foreground/lag, validate и catch-up перед cutover; повтор batch не стирает свежие изменения или delete.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


255. (L1 [P]) Реализовать throttled backfill worker

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


256. (L2 [T]) Почему backfill по primary key range лучше, чем OFFSET/LIMIT scan?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


257. (L2 [T]) Почему order of backfill matters for caches/hot ranges?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


258. (L2 [T]) Почему high-write tables требуют catch-up logic после initial backfill?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


259. (L2 [T]) Что такое idempotent backfill transform?

     **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


260. (L2 [T]) Почему backfill часто создаёт replication lag?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


261. (L2 [T]) Почему backfill может конфликтовать с compaction/vacuum/checkpoints?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


262. (L2 [T]) Как backfill влияет на buffer pool/page cache pollution?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


263. (L2 [T]) Почему backfill correctness нельзя проверять только row count?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


264. (L2 [T]) Почему backfill на hot table и cold archive table — fundamentally different problems?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


265. (L2 [T]) Почему backfill needs kill-switch?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


266. (L2 [P]) Реализовать PK-range scheduler for backfill

     **Ответ:** Stable keyset ranges + durable batch cursor + idempotent versioned upsert. Связать snapshot с CDC boundary, throttle по foreground/lag, validate и catch-up перед cutover; повтор batch не стирает свежие изменения или delete.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


267. (L2 [P]) Реализовать checksum-based chunk verification

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


268. (L2 [P]) Реализовать lag-aware throttling on replica/app latency

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


269. (L2 [P]) Реализовать catch-up pass for rows changed during backfill

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


270. (L2 [P]) Реализовать dashboard: rows done, rows/sec, retry count, mismatch count

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


271. (L2 [D]) Почему backfill почти закончен, но never reaches zero delta?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Типичная ошибка:** Считать равный row count доказательством равенства значений и отсутствия пропусков.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


272. (L2 [D]) Почему backfill reads saturate disk, хотя writes небольшие?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


273. (L2 [D]) Почему latency приложения растёт только на одном диапазоне ключей?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


274. (L2 [D]) Почему после backfill row counts совпадают, но запросы дают разные результаты?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


275. (L2 [D]) Почему backfill job безопасна днём на staging и опасна ночью в production?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


276. (L3 [T]) Как проектировать backfill for live mutable dataset?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


277. (L3 [T]) Почему snapshot + catch-up + verify — стандартный pattern?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


278. (L3 [T]) Как backfill сочетается с dual writes and online cutover?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


279. (L3 [T]) Как строить chunking strategy, учитывающую skew и hotspot tenants?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


280. (L3 [T]) Почему sampled verification и full verification обе нужны в разных фазах?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


281. (L3 [T]) Как observability должна разделять scan cost, transform cost, write cost and verification lag?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


282. (L3 [T]) Почему backfill tooling должно быть tenant-aware/shard-aware?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


283. (L3 [T]) Как backfill interacts with MVCC, vacuum, tombstones, compaction?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


284. (L3 [T]) Почему historical bad data and null semantics often break transforms late in the process?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


285. (L3 [T]) Почему backfill — это data pipeline with correctness requirements, а не просто long SQL UPDATE?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


286. (L3 [P]) Реализовать snapshot-based backfill with change capture catch-up

     **Ответ:** Stable keyset ranges + durable batch cursor + idempotent versioned upsert. Связать snapshot с CDC boundary, throttle по foreground/lag, validate и catch-up перед cutover; повтор batch не стирает свежие изменения или delete.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


287. (L3 [P]) Реализовать per-tenant quota and throttling

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


288. (L3 [P]) Реализовать verifier: semantic equality old vs new derived fields

     **Ответ:** Использовать stable keyset cursor и durable checkpoints, bounded batches, idempotent upsert с version compare. Связать snapshot с CDC position, догнать поток, проверить partitions/counts/checksums/invariants и безопасно повторить любой batch.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


289. (L3 [P]) Реализовать backfill planner with adaptive chunk sizing

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


290. (L3 [P]) Реализовать simulation of mutable workload during long backfill

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


291. (L3 [D]) Как доказать, что bottleneck backfill — verification or transform CPU, not scan IO?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


292. (L3 [D]) Почему replication lag остался высоким даже после slowdown backfill?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


293. (L3 [D]) Как расследовать one-off bad rows that poison the whole backfill?

     **Ответ:** Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


294. (L3 [D]) Почему after pause/resume часть чанков обработана дважды и данные разошлись?

     **Ответ:** Resumable job хранит durable cursor/generation/progress и делает каждый шаг идемпотентным. Checkpoint отмечает только проверенно завершённую работу; cancellation должна оставлять recoverable state и не публиковать частичную копию. Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


295. (L3 [D]) Как найти правильный cutover point, если backfill never fully “quiets down”?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Проверить cursor holes/overlap, concurrent delete/update, source snapshot age, destination versions и applied CDC watermark. Разделить skipped, failed и completed rows; count equality не исключает ошибочные значения.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


296. (L4 [S]) Когда backfill делать inline, а когда отдельным pipeline/job framework?

     **Ответ:** Задать rate/space/lag guards, pause/resume и ownership; adaptive throttling должно учитывать foreground p99 и replicas. Cutover разрешать по доказанной полноте/freshness, а не по достижению последнего ID.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


297. (L4 [S]) Как проектировать reusable backfill platform for many teams?

     **Ответ:** Задать rate/space/lag guards, pause/resume и ownership; adaptive throttling должно учитывать foreground p99 и replicas. Cutover разрешать по доказанной полноте/freshness, а не по достижению последнего ID.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


298. (L4 [S]) Как выбирать safety vs speed vs cost for large backfills?

     **Ответ:** Задать rate/space/lag guards, pause/resume и ownership; adaptive throttling должно учитывать foreground p99 и replicas. Cutover разрешать по доказанной полноте/freshness, а не по достижению последнего ID.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


299. (L4 [S]) Как строить policy: no cutover without verified backfill completeness?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Рекомендация:** Задать rate/space/lag guards, pause/resume и ownership; adaptive throttling должно учитывать foreground p99 и replicas. Cutover разрешать по доказанной полноте/freshness, а не по достижению последнего ID.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


300. (L4 [S]) Как объяснять командам, что backfill — это migration risk multiplier, а не “просто догрузка старых данных”?

     **Ответ:** Задать rate/space/lag guards, pause/resume и ownership; adaptive throttling должно учитывать foreground p99 и replicas. Cutover разрешать по доказанной полноте/freshness, а не по достижению последнего ID.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Почему schema migration, compatibility, online migration, dual writes и backfill нужно проектировать как одну программу изменений, а не отдельные шаги?

     **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


302. (L2 [T]) Почему additive schema change может всё равно требовать сложный backfill и dual writes?

     **Ответ:** Additive change обычно легче сделать совместимым, но NOT NULL/default/schema validators и строгие readers могут его сломать. Проверять default meaning, physical rewrite/locks и matrix old/new versions.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


303. (L2 [T]) Как replication lag, locks и page cache pollution делают migrations production-risky?

     **Ответ:** Linux page cache хранит файловые страницы, buffered I/O и mmap обычно используют его. Dirty pages сбрасываются позже; высокий cache hit уменьшает device I/O, но не доказывает durability или достаточность памяти под реальным cgroup limit.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


304. (L2 [T]) Почему optimizer/planner/indexes могут неожиданно измениться после schema evolution?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


305. (L2 [T]) Как MVCC/long transactions влияют на online DDL and backfill?

     **Ответ:** Backfill переносит историческое состояние, пока текущие writers продолжают работу. Главная гонка — старый snapshot overwrite свежего change event; нужны snapshot boundary/versions и catch-up, а не только pagination.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


306. (L2 [T]) Почему retries, idempotency и observability обязательны для migration tooling?

     **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


307. (L2 [T]) Почему “row counts match” — очень слабый сигнал correctness после migration?

     **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


308. (L2 [T]) Как sharding/partitioning усложняют rollout, backfill и cutover coordination?

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf)


309. (L2 [T]) Почему migration incidents почти всегда связаны с hidden consumers and mixed versions?

     **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


310. (L2 [T]) Почему эволюция схемы — это вопрос не только storage, но и distributed system semantics?

     **Ответ:** Schema/data migration меняет контракт при одновременной работе старого/нового кода. Expand→migrate→contract разделяет совместимое расширение, backfill/catch-up и удаление старого; rollback данных сложнее rollback binary.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


311. (L2 [P]) Реализовать end-to-end migration harness: expand schema → dual write → backfill → verify → cutover → contract

     **Ответ:** Local transaction пишет effect+outbox, relay/CDC сохраняет position и повторяет delivery. Destination использует unique event ID и version-aware apply; тестировать crash всех границ, duplicate/out-of-order/update/delete и reconciliation.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


312. (L2 [P]) Реализовать dashboard: migration progress, replication lag, lock waits, mismatch rate, rollback readiness

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos tests: fail mid-backfill, fail during cutover, stale app node after schema switch

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


314. (L2 [P]) Реализовать canary rollout for one tenant/shard before global migration

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


315. (L2 [P]) Реализовать automated post-cutover verification suite

     **Ответ:** Cutover переводит authority/read/write path после catch-up и validation; копирование данных до него не достаточно. Нужно атомарно изменить generation/owner, fence старый path и сохранить определённый rollback либо roll-forward. Сначала добавить совместимую schema/read path, выполнить resumable idempotent batches с checkpoints, догнать concurrent writes, проверить counts/checksums/invariants и переключить readers. Contract только после исчезновения старых readers/writers и окна rollback.

     **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


316. (L3 [D]) Почему schema migration технически успешна, но бизнес-данные логически сломаны?

     **Ответ:** Версионированная миграция — воспроизводимое ordered изменение schema/data с ID, dependencies и состоянием применения. Успешный ALTER не завершает rollout: старые binaries/ETL/restore readers ещё могут ожидать прежний контракт. Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


317. (L3 [D]) Почему migration проходит на большинстве shard-ов, но один shard умирает по p99/lag?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


318. (L3 [D]) Как доказать, что проблема caused by hidden old readers, not by DB corruption?

     **Ответ:** Локализовать first bad page/record, сравнить независимые replicas/backups, I/O/ECC/controller logs и временную линию. Сохранить артефакты; отключение checksum или blindly copying majority не доказывает исправление.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


319. (L3 [D]) Почему dual writes + backfill + partial deploy создали divergence storm?

     **Ответ:** Проследить один operation ID через source commit, outbox/CDC, delivery, destination apply и ack. Проверить missing/duplicate/out-of-order события, producer crash и retention; сверять данные по версии, а не только общему count.

     **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


320. (L3 [D]) Как расследовать инцидент “схема новая, данные почти все на месте, но система ведёт себя нестабильно”?

     **Ответ:** Сопоставить DDL locks, old/new code/schema versions, backfill cursor, replication/CDC lag и validation errors. Проверить гонку backfill со свежим update и partial rollout; успешный DDL не доказывает корректность миграции данных.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


321. (L4 [S]) Как строить platform-level migration strategy для быстрорастущей компании?

     **Ответ:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


322. (L4 [S]) Какие migration patterns стоит стандартизировать, а какие запретить?

     **Ответ:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


323. (L4 [S]) Как выбирать between safety, speed, cost and operational complexity in schema evolution?

     **Ответ:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


324. (L4 [S]) Как встроить migration reviews, compatibility checks и invariant verification в SDLC?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Рекомендация:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


325. (L4 [S]) Как объяснить инженерной организации, что schema evolution — это один из самых недооценённых источников production incidents?

     **Ответ:** Назначить владельца и rollback/roll-forward план, latency/lag/space guardrails и stop criteria. Выбирать online strategy по точной версии/DDL операции: «ADD COLUMN всегда без блокировки» неверно.

     **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)
