# ⚙️ 7. Storage engine internals


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

## 🔹 WAL (write-ahead log)

1. (L1 [T]) Что такое WAL (write-ahead log)?

   **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

   **Пример:** pageLSN=120 нельзя flush как durable page, пока durable WAL LSN меньше 120.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


2. (L1 [T]) Зачем storage engine нужен WAL?

   **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


3. (L1 [T]) Почему запись в WAL должна происходить до изменения data pages?

   **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


4. (L1 [T]) Чем WAL отличается от data file?

   **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


5. (L1 [T]) Что такое commit record в WAL?

   **Ответ:** Commit record отмечает итог transaction и должен однозначно ссылаться на полный recovery-relevant набор. Durable ACK выдаётся лишь после сохранения нужного префикса; malformed/частичный record не принимается как commit.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


6. (L1 [T]) Что такое redo log?

   **Ответ:** Undo сохраняет старое состояние, redo — информацию для повторного применения нового. Для отката конкурентных транзакций недостаточно вернуть произвольную старую копию всей страницы: нужно учитывать чужие завершённые изменения.

   **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


7. (L1 [T]) Что такое undo log и чем он отличается от WAL?

   **Ответ:** Undo сохраняет старое состояние, redo — информацию для повторного применения нового. Для отката конкурентных транзакций недостаточно вернуть произвольную старую копию всей страницы: нужно учитывать чужие завершённые изменения.

   **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


8. (L1 [T]) Почему append-only лог обычно быстрее random write?

   **Ответ:** Append-only избегает in-place перезаписи существующего префикса и удобно группирует log writes. Нужны framing/checksum и safe truncation/recycling; append syscall не гарантирует power-loss atomicity или отсутствие amplification.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


9. (L1 [T]) Что такое crash recovery в контексте WAL?

   **Ответ:** Recovery восстанавливает допустимое committed состояние из устойчивых pages/log/metadata, не доверяя незавершённым writes. Redo/undo либо visibility/replay правила зависят от engine; повторный crash внутри recovery тоже должен быть безопасен.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)


10. (L1 [T]) Почему fsync важен для durability WAL?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


11. (L1 [P]) Реализовать append-only WAL файл на C

    **Ответ:** Сериализовать length/type/tx_id/LSN/payload/checksum, писать loop с short-write/EINTR обработкой. Разделить written и durable LSN, sync перед требуемым ACK; parser ограничивает length и останавливает recovery на неполном tail.

    **Типичная ошибка:** Считать успешный write или наличие записи в page cache доказательством power-loss durability.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


12. (L1 [P]) Реализовать запись log record с type/LSN/payload

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


13. (L1 [P]) Реализовать commit marker

    **Ответ:** Framed COMMIT связывает tx_id с полным набором records/границей log. Записать checksum/length и sync нужный префикс до ACK; recovery принимает лишь валидный завершённый commit и не повторяет бизнес-эффект при replay.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


14. (L1 [P]) Реализовать recovery, читающий WAL после падения

    **Ответ:** Записывать framed records с length, transaction ID, LSN и checksum, проверяя short writes/errors. Отслеживать durable LSN, flush WAL перед зависимыми страницами; recovery читает валидный префикс и не применяет незавершённый хвост.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


15. (L1 [P]) Реализовать checksum для log record

    **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

    **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


16. (L2 [T]) Что такое LSN и зачем он нужен?

    **Ответ:** LSN идентифицирует порядок/позицию журнала в определённом log stream. Written, durable и applied LSN имеют разные значения; сравнивать их между независимыми timelines/группами без контекста нельзя.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


17. (L2 [T]) Почему pageLSN нужен для recovery?

    **Ответ:** pageLSN — позиция последнего отражённого на странице log record. WAL flush обязан покрывать pageLSN до вывода страницы; redo проверяет pageLSN, чтобы не применять уже выполненный record повторно.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)


18. (L2 [T]) Что такое group commit?

    **Ответ:** Group commit объединяет несколько ожидающих commit за одним durable flush. Он сохраняет гарантию ACK после flush для каждой транзакции, но добавляет очередь и время накопления группы.

    **Пример:** Три commit ждут LSN 10/20/30; один успешный flush до 30 позволяет подтвердить все три.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


19. (L2 [T]) Почему WAL часто становится bottleneck на write-heavy workload?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


20. (L2 [T]) Что такое WAL buffer?

    **Ответ:** WAL buffer временно держит log records до write/flush, сглаживая batch/синхронизацию. Переполнение вызывает write/wait/backpressure, а данные buffer ещё не являются durable; durable watermark продвигается после успешного sync.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


21. (L2 [T]) Почему batching записей в WAL улучшает throughput?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


22. (L2 [T]) Что такое force vs no-force policy?

    **Ответ:** Force требует вывести изменённые pages к commit, no-force допускает их более поздний flush и поэтому нуждается в redo. Это независимо от steal/no-steal, определяющего возможность flush uncommitted changes.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)


23. (L2 [T]) Что такое steal vs no-steal policy?

    **Ответ:** Steal допускает flush страницы с незавершёнными изменениями и требует безопасного undo либо иной схемы их невидимости/отмены. No-steal запрещает это, повышая требования к памяти; no-force отдельно требует redo.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)


24. (L2 [T]) Почему torn write опасен для WAL?

    **Ответ:** Torn page содержит смесь частей разных записей страницы. Checksum обнаруживает часть повреждений, а full-page images/doublewrite/atomic replacement дают материал для восстановления; одного checksum недостаточно.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


25. (L2 [T]) Почему page cache ОС не равен durability?

    **Ответ:** Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


26. (L2 [P]) Реализовать in-memory WAL buffer с flush thread

    **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


27. (L2 [P]) Реализовать LSN allocator

    **Ответ:** Задать ownership/lifetime, layout/alignment и bounded allocation, разместить threads/pages совместно по целевому partition. Проверить correctness/free/reuse, затем сравнить remote accesses, alloc rate, perf c2c/misses и p99 с неизменным baseline.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


28. (L2 [P]) Реализовать group commit для нескольких потоков

    **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


29. (L2 [P]) Реализовать pageLSN update при модификации страницы

    **Ответ:** Обновлять pageLSN вместе с отражаемым изменением под page synchronization. Flusher сначала ждёт durable WAL≥pageLSN, redo пропускает уже отражённые records; проверить torn page, snapshot LSN и отсутствие ложного skip.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


30. (L2 [P]) Реализовать failpoint-тесты: crash до/после fsync

    **Ответ:** Писать loop с проверкой return/EINTR/short writes, затем нужный sync и error propagation до ACK. Для atomic replace — temp/sync/rename/directory sync; completion/O_DIRECT не подменяет durable flush, power-loss tests отдельны от kill процесса.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


31. (L2 [D]) Почему committed transaction пропала после crash?

    **Ответ:** Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Типичная ошибка:** Считать успешный write или наличие записи в page cache доказательством power-loss durability.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


32. (L2 [D]) Почему WAL file растёт слишком быстро?

    **Ответ:** Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


33. (L2 [D]) Почему fsync latency даёт пилообразный график?

    **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing. Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


34. (L2 [D]) Почему commit throughput проседает при росте concurrency?

    **Ответ:** Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


35. (L2 [D]) Почему recovery после падения занимает слишком долго?

    **Ответ:** Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


36. (L3 [T]) Как устроен WAL pipeline: generate → buffer → write → flush → durable ack?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


37. (L3 [T]) Как ARIES использует WAL?

    **Ответ:** ARIES сочетает WAL, pageLSN, transaction/dirty-page tables и analysis→redo→undo. Redo повторяет историю, undo откатывает незавершённые транзакции с compensation log records, чтобы повторный crash recovery оставался корректным.

    **Пример:** После повторного crash CLR сообщает, какой undo уже завершён и откуда продолжать откат.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


38. (L3 [T]) Что такое physiological logging?

    **Ответ:** Physiological logging идентифицирует физическую страницу, но описывает действие внутри неё более логически, например вставку slot. Recovery должен сохранять page identity/LSN и корректность операции при повторе.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)


39. (L3 [T]) Как WAL взаимодействует с buffer pool?

    **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


40. (L3 [T]) Почему commit order и flush order не всегда одно и то же?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


41. (L3 [T]) Как WAL организуется по сегментам/файлам?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


42. (L3 [T]) Как log recycling влияет на производительность?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


43. (L3 [T]) Почему SSD/NVMe меняют дизайн WAL, но не отменяют fsync semantics?

    **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


44. (L3 [T]) Как Linux page cache, writeback и storage cache влияют на perceived durability?

    **Ответ:** Buffered writes создают dirty pages и позже background writeback; при превышении порогов writer может быть throttled. Быстрый write benchmark до накопления dirty debt измеряет RAM buffering, а не устойчивую скорость диска. Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя.

    **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


45. (L3 [T]) Как проектировать WAL format для backward compatibility и recovery robustness?

    **Ответ:** Совместимость проверяется матрицей old/new readers и writers, а не фактом успешного parse. Изменение default/NULL/meaning или повторное использование field ID способно сломать старого клиента без syntax error.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


46. (L3 [P]) Реализовать сегментированный WAL с rotation

    **Ответ:** Записывать framed records с length, transaction ID, LSN и checksum, проверяя short writes/errors. Отслеживать durable LSN, flush WAL перед зависимыми страницами; recovery читает валидный префикс и не применяет незавершённый хвост.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


47. (L3 [P]) Реализовать background flush scheduler

    **Ответ:** Записывать framed records с length, transaction ID, LSN и checksum, проверяя short writes/errors. Отслеживать durable LSN, flush WAL перед зависимыми страницами; recovery читает валидный префикс и не применяет незавершённый хвост.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


48. (L3 [P]) Реализовать recovery phases: analysis / redo / undo (упрощённо)

    **Ответ:** Каждый record содержит проверяемый framing, identity и LSN; redo применяет только допустимый committed/history prefix по engine protocol. PageLSN/sequence делает повтор безопасным, частичный хвост отвергается; test повторяет crash внутри recovery.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


49. (L3 [P]) Реализовать WAL archiving / recycling

    **Ответ:** Записывать framed records с length, transaction ID, LSN и checksum, проверяя short writes/errors. Отслеживать durable LSN, flush WAL перед зависимыми страницами; recovery читает валидный префикс и не применяет незавершённый хвост.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


50. (L3 [P]) Реализовать метрики: write lag, flush lag, durable lag, bytes/sec

    **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


51. (L3 [D]) Как доказать, что bottleneck именно в WAL fsync, а не в data file flush?

    **Ответ:** Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


52. (L3 [D]) Почему group commit улучшил throughput, но ухудшил p99?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Измерить batch size, queue wait, flush duration и p99 commit; отличить batching delay от storage stalls. Проверить что waiter не просыпается по written LSN вместо durable LSN и не теряет wakeup.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


53. (L3 [D]) Почему page cache скрывает реальные проблемы durability на тестах?

    **Ответ:** Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя. Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


54. (L3 [D]) Почему после смены filesystem поведение WAL изменилось?

    **Ответ:** Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


55. (L3 [D]) Как расследовать повреждение WAL после power loss?

    **Ответ:** SIGKILL останавливает процесс, но не очищает kernel/device caches; поэтому успешный restart после kill -9 не доказывает power-loss durability. Нужны fault tests persistence boundaries и согласованная модель диска/VM. Сопоставить generated/written/flushed LSN, WAL bytes, fsync latency и commit queue. Проверить ошибки sync, checkpoint/full-page writes, retention и storage write cache; crash процесса не моделирует потерю питания.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


56. (L4 [S]) Как выбирать durability guarantees для разных классов данных?

    **Ответ:** Выбрать durability boundary и bounded log/recovery budget. Разделить append, flush/group commit, checkpoint и reclaim, не удалять журнал до безопасной recovery/replication/backup границы.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


57. (L4 [S]) Когда допустим semi-durable WAL mode?

    **Ответ:** Выбрать durability boundary и bounded log/recovery budget. Разделить append, flush/group commit, checkpoint и reclaim, не удалять журнал до безопасной recovery/replication/backup границы.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


58. (L4 [S]) Как проектировать WAL для embedded C/C++ storage engine?

    **Ответ:** Выбрать durability boundary и bounded log/recovery budget. Разделить append, flush/group commit, checkpoint и reclaim, не удалять журнал до безопасной recovery/replication/backup границы.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


59. (L4 [S]) Как минимизировать commit latency без подрыва correctness?

    **Ответ:** Выбрать durability boundary и bounded log/recovery budget. Разделить append, flush/group commit, checkpoint и reclaim, не удалять журнал до безопасной recovery/replication/backup границы.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


60. (L4 [S]) Как строить observability для WAL path на production?

    **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

    **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


---

## 🔹 SSTables

61. (L1 [T]) Что такое SSTable?

    **Ответ:** Immutable отсортированный файл key/value с blocks, sparse index, metadata и checksum. Имеет собственный format/comparator/version, а не произвольный dump hash map.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


62. (L1 [T]) Почему SSTable immutable?

    **Ответ:** Immutable/versioned backup и отдельные credentials/failure domains уменьшают риск массового удаления/заражения. Retention lock, key access и restore permissions проверяются вместе; недоступный encryption key делает целую копию бесполезной. Immutable файл после публикации не меняется in-place, что упрощает concurrent readers и checksum. Update/delete создают новые versions/files, а reclaim требует отсутствия живых readers и корректного manifest.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


63. (L1 [T]) Какую роль SSTable играет в LSM-based engine?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


64. (L1 [T]) Что обычно хранится внутри SSTable?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


65. (L1 [T]) Почему записи в SSTable отсортированы по ключу?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


66. (L1 [T]) Что такое data blocks в SSTable?

    **Ответ:** Block-based format группирует sorted entries в independently addressable blocks с encoding/compression/checksum. Sparse index направляет к нужному block, а footer описывает metadata; block size меняет read amplification и cache granularity.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


67. (L1 [T]) Что такое index block?

    **Ответ:** Sparse index указывает block по separator key, footer хранит адреса/handles важных metadata. Lookup обычно читает index и нужный block, затем проверяет key; все offsets/lengths должны валидироваться до обращения.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


68. (L1 [T]) Что такое footer / metadata block?

    **Ответ:** Sparse index указывает block по separator key, footer хранит адреса/handles важных metadata. Lookup обычно читает index и нужный block, затем проверяет key; все offsets/lengths должны валидироваться до обращения.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


69. (L1 [T]) Почему SSTable удобна для sequential IO?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


70. (L1 [T]) Почему delete в SSTable обычно представляется tombstone-записью?

    **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


71. (L1 [P]) Реализовать простейший SSTable writer

    **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


72. (L1 [P]) Реализовать сортировку memtable и flush в SSTable

    **Ответ:** Ordered container хранит key/sequence/value-or-tombstone, WAL/visibility publication синхронизированы. Freeze переключает active table атомарно, старый table живёт до flush/readers; проверить concurrent update и snapshot traversal.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


73. (L1 [P]) Реализовать бинарный поиск по index block

    **Ответ:** Sparse index указывает block по separator key, footer хранит адреса/handles важных metadata. Lookup обычно читает index и нужный block, затем проверяет key; все offsets/lengths должны валидироваться до обращения. Writer формирует bounded sorted blocks, restart points, sparse index и checksum, затем footer. Reader валидирует magic/version/offsets/lengths, binary-search index и decode block; публикация файла происходит после завершения/flush.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


74. (L1 [P]) Реализовать reader для SSTable

    **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


75. (L1 [P]) Реализовать metadata/footer с offsets блоков

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


76. (L2 [T]) Что такое sparse index внутри SSTable?

    **Ответ:** Sparse index указывает block по separator key, footer хранит адреса/handles важных metadata. Lookup обычно читает index и нужный block, затем проверяет key; все offsets/lengths должны валидироваться до обращения.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


77. (L2 [T]) Что такое block-based format?

    **Ответ:** Block-based format группирует sorted entries в independently addressable blocks с encoding/compression/checksum. Sparse index направляет к нужному block, а footer описывает metadata; block size меняет read amplification и cache granularity.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


78. (L2 [T]) Зачем нужен bloom filter для SSTables?

    **Ответ:** Bloom filter отвечает «точно отсутствует» или «возможно присутствует»; positive требует проверки данных. Обычный filter не поддерживает безопасное удаление битов, false negatives недопустимы; hash/key transformation должна совпадать с read path.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


79. (L2 [T]) Почему lookup может требовать проверки нескольких SSTables?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


80. (L2 [T]) Что такое block cache?

    **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


81. (L2 [T]) Почему compression часто делается по блокам?

    **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


82. (L2 [T]) Что такое prefix compression ключей в SSTable?

    **Ответ:** Prefix compression хранит common-prefix length и suffix относительно предыдущего ключа. Restart points ограничивают стоимость seek/decode; parser проверяет длины, а comparator должен видеть тот же логический порядок. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


83. (L2 [T]) Почему range scans по SSTables обычно эффективны?

    **Ответ:** И B+tree, и LSM поддерживают упорядоченный range scan: B+tree проходит листья, LSM сливает sorted iterators. LSM не обязательно «плох» для ranges, но overlap/versions/tombstones увеличивают merge work; проверять workload.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


84. (L2 [T]) Как tombstones влияют на read path?

    **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


85. (L2 [T]) Почему большое количество SSTables ухудшает reads?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


86. (L2 [P]) Реализовать sparse index

    **Ответ:** Sparse index указывает block по separator key, footer хранит адреса/handles важных metadata. Lookup обычно читает index и нужный block, затем проверяет key; все offsets/lengths должны валидироваться до обращения. Writer формирует bounded sorted blocks, restart points, sparse index и checksum, затем footer. Reader валидирует magic/version/offsets/lengths, binary-search index и decode block; публикация файла происходит после завершения/flush.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


87. (L2 [P]) Реализовать bloom filter для SSTable

    **Ответ:** Выбрать m bits/k probes/seed и одинаковое canonical key/prefix encoding, set bits при build и check при lookup. Сохранить format parameters, проверить отсутствие false negatives всех inserted keys и измерить false positives на независимой выборке.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


88. (L2 [P]) Реализовать block cache

    **Ответ:** Bounded map block key→pinned buffer с LRU/Clock и coalescing загрузок. Ключ включает file generation, eviction не освобождает bytes активного reader.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


89. (L2 [P]) Реализовать block-level compression

    **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


90. (L2 [P]) Реализовать merge iterator по нескольким SSTables

    **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


91. (L2 [D]) Почему point lookup деградировал со временем?

    **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


92. (L2 [D]) Почему bloom filter не даёт ожидаемого выигрыша?

    **Ответ:** Bloom filter отвечает «точно отсутствует» или «возможно присутствует»; positive требует проверки данных. Обычный filter не поддерживает безопасное удаление битов, false negatives недопустимы; hash/key transformation должна совпадать с read path. Проверить совпадение comparator/prefix extractor/encoding на build/read, число keys и bit budget. Сопоставить false-positive probes с cache misses; false negatives указывают на bug/config mismatch, а не на нормальную вероятностность.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


93. (L2 [D]) Почему range scan начал читать слишком много блоков?

    **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


94. (L2 [D]) Почему disk usage растёт быстрее объёма живых данных?

    **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


95. (L2 [D]) Почему чтения стали CPU-bound, а не IO-bound?

    **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


96. (L3 [T]) Как устроены SSTable formats в RocksDB/LevelDB-подобных системах?

    **Ответ:** Column files на object store сами по себе не дают table transactions/schema evolution. Нужны catalog/manifest и protocol publication/snapshot/GC, совместимый с читателями; lifecycle не должен удалять referenced generations.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


97. (L3 [T]) Как выбирается block size и index granularity?

    **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


98. (L3 [T]) Как partitioned index/filter улучшают locality?

    **Ответ:** Partitioned index/filter разбивает крупную metadata на cacheable части, чтобы point lookup не загружал весь индекс/фильтр. Выигрыш зависит от cache budget, locality и добавленного обращения к верхнему index level.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


99. (L3 [T]) Как SSTables взаимодействуют с block cache и OS page cache?

    **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


100. (L3 [T]) Почему mmap и pread/read ведут себя по-разному для SSTable reads?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)


101. (L3 [T]) Как устроены restart points для prefix-compressed keys?

     **Ответ:** Restart points содержат полные ключи внутри prefix-compressed блока и позволяют начать decode с ближайшего anchor. Меньший интервал ускоряет seek, но снижает compression и увеличивает metadata. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


102. (L3 [T]) Как проектировать format evolution без ломания старых файлов?

     **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


103. (L3 [T]) Как checksum и corruption detection встроены в SSTable?

     **Ответ:** Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


104. (L3 [T]) Как SSTable design зависит от SSD vs HDD?

     **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


105. (L3 [T]) Как строить efficient iterators для scan across levels?

     **Ответ:** SSTable — immutable sorted key/value файл с data blocks, index, metadata/filters, checksums и footer. Comparator/encoding задают порядок, а internal sequence/version metadata — разрешение нескольких версий ключа.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


106. (L3 [P]) Реализовать restart-point based prefix compression

     **Ответ:** Хранить prefix length+suffix относительно предыдущего key и full restart key через заданный интервал. Seek начинает с ближайшего restart, decoder проверяет bounds; round-trip и comparator order проверяются на длинных/пустых keys.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


107. (L3 [P]) Реализовать partitioned bloom / partitioned index

     **Ответ:** Выбрать m bits/k probes/seed и одинаковое canonical key/prefix encoding, set bits при build и check при lookup. Сохранить format parameters, проверить отсутствие false negatives всех inserted keys и измерить false positives на независимой выборке.

     **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


108. (L3 [P]) Реализовать corruption checker для SSTable blocks

     **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


109. (L3 [P]) Реализовать zero-copy block read (где уместно)

     **Ответ:** Возвращать slice(pointer,length) вместе с owner/pin mapping generation; валидировать offsets/length/alignment. Compaction/unmap ждут release readers, async send удерживает buffer до completion; compare output с copied reader.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [Linux man-pages: open](https://man7.org/linux/man-pages/man2/open.2.html)


110. (L3 [P]) Реализовать benchmark для разных block sizes

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


111. (L3 [D]) Как доказать, что bottleneck в block cache misses, а не в compaction?

     **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers. Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


112. (L3 [D]) Почему после изменения block size ухудшился throughput?

     **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


113. (L3 [D]) Почему page faults выросли после перехода на mmap?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются. Minor fault устанавливает/меняет mapping без обязательного disk read, major обычно требует I/O. Рост faults может быть cold mapping, CoW, reclaim/pressure; mmap не делает working set бесплатным и всегда резидентным. Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


114. (L3 [D]) Как расследовать corruption в одном SSTable среди тысяч?

     **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


115. (L3 [D]) Почему iterator allocation/memcpy стал bottleneck в scan-heavy workload?

     **Ответ:** Проверить порядок/comparator, index bounds, checksums, block cache и bytes read/returned. Неправильный offset/encoding может давать ошибочный lookup без очевидного I/O отказа; сравнить file reader с последовательным dump.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


116. (L4 [S]) Как выбирать SSTable format под конкретный workload?

     **Ответ:** Column files на object store сами по себе не дают table transactions/schema evolution. Нужны catalog/manifest и protocol publication/snapshot/GC, совместимый с читателями; lifecycle не должен удалять referenced generations.

     **Рекомендация:** Выбирать block size, compression и filters по point/range нагрузке и memory budget. Формат должен поддерживать версию, повреждённый input и безопасное чтение старых файлов после upgrade.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


117. (L4 [S]) Когда стоит делать более крупные blocks, а когда более мелкие?

     **Ответ:** Выбирать block size, compression и filters по point/range нагрузке и memory budget. Формат должен поддерживать версию, повреждённый input и безопасное чтение старых файлов после upgrade.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


118. (L4 [S]) Как балансировать compression ratio и CPU cost?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Рекомендация:** Выбирать block size, compression и filters по point/range нагрузке и memory budget. Формат должен поддерживать версию, повреждённый input и безопасное чтение старых файлов после upgrade.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


119. (L4 [S]) Как проектировать SSTable layout под cold/hot data?

     **Ответ:** Горячие данные/metadata держат в низколатентном слое, холодные — в более дешёвом durable storage. Cache miss, retrieval/request/egress cost и restore path входят в SLO; возраст не всегда равен будущей востребованности.

     **Рекомендация:** Выбирать block size, compression и filters по point/range нагрузке и memory budget. Формат должен поддерживать версию, повреждённый input и безопасное чтение старых файлов после upgrade.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


120. (L4 [S]) Как эволюционировать SSTable format без painful migrations?

     **Ответ:** Column files на object store сами по себе не дают table transactions/schema evolution. Нужны catalog/manifest и protocol publication/snapshot/GC, совместимый с читателями; lifecycle не должен удалять referenced generations.

     **Рекомендация:** Выбирать block size, compression и filters по point/range нагрузке и memory budget. Формат должен поддерживать версию, повреждённый input и безопасное чтение старых файлов после upgrade.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


---

## 🔹 Compaction

121. (L1 [T]) Что такое compaction в LSM engine?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


122. (L1 [T]) Зачем нужна compaction?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


123. (L1 [T]) Как compaction уменьшает количество SSTables?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


124. (L1 [T]) Как compaction удаляет obsolete versions и tombstones?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


125. (L1 [T]) Почему compaction — это не просто merge файлов?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


126. (L1 [T]) Что такое minor compaction / flush?

     **Ответ:** Термины зависят от engine: minor часто означает flush/небольшое слияние, major — более широкий merge уровней/runs. Нужно назвать inputs/outputs и visibility/reclaim guarantees, а не предполагать одну универсальную реализацию.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


127. (L1 [T]) Что такое major compaction?

     **Ответ:** Термины зависят от engine: minor часто означает flush/небольшое слияние, major — более широкий merge уровней/runs. Нужно назвать inputs/outputs и visibility/reclaim guarantees, а не предполагать одну универсальную реализацию.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


128. (L1 [T]) Почему compaction создаёт дополнительную нагрузку на диск?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


129. (L1 [T]) Почему compaction может увеличивать latency foreground запросов?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


130. (L1 [T]) Что такое compaction debt?

     **Ответ:** Невыполненная обязательная работа compaction, оцениваемая files/bytes/time. Если debt растёт устойчиво, дополнительные buffers лишь откладывают stall.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


131. (L1 [P]) Реализовать merge двух SSTables

     **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

     **Типичная ошибка:** Удалять tombstone, пока старая версия может сохраниться вне compaction inputs или в живом snapshot.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


132. (L1 [P]) Реализовать удаление obsolete versions при merge

     **Ответ:** Выбирать input files без конфликтов, K-way merge по key/sequence, писать новый generation и atomically обновлять manifest. Старые файлы удалять после reader release; tombstone удалять только при доказанном отсутствии воскресающей старой версии.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


133. (L1 [P]) Реализовать обработку tombstones в compaction

     **Ответ:** DELETE добавляет versioned tombstone, lookup подавляет более старые values. Compaction удаляет marker лишь после проверки snapshots и охвата старых copies/levels; test строит «new tombstone + hidden older value» и проверяет отсутствие resurrection.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


134. (L1 [P]) Реализовать background compaction worker

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


135. (L1 [P]) Реализовать простейший scheduler compaction jobs

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


136. (L2 [T]) Чем leveled compaction отличается от tiered/size-tiered?

     **Ответ:** Leveled ограничивает overlap большинства уровней, часто уменьшая reads/space ценой больше rewrites. Tiered/universal хранит несколько sorted runs, уменьшая часть write work, но повышая read/space costs; сравнивать steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


137. (L2 [T]) Почему разные compaction strategies дают разный trade-off read/write amplification?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


138. (L2 [T]) Что такое overlap между SSTables и почему он важен?

     **Ответ:** Overlap key ranges заставляет lookup/scan проверять несколько files и усложняет безопасный tombstone/version drop. Leveled ограничивает часть overlap после L0, но snapshots и другие levels всё равно участвуют в read/reclaim правилах.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


139. (L2 [T]) Почему compaction может вызывать write stalls?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


140. (L2 [T]) Как compaction влияет на block cache efficiency?

     **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


141. (L2 [T]) Почему tombstone cleanup нельзя делать слишком агрессивно?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


142. (L2 [T]) Что такое compaction priority?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


143. (L2 [T]) Как size ratio уровней влияет на compaction cost?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


144. (L2 [T]) Почему compaction scheduler должен учитывать IO bandwidth?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Scheduler выбирает работу по debt/overlap/level priorities и доступным ресурсам; rate limiter ограничивает её bytes/IO. Ограничение должно оставлять sustainable maintenance ≥ incoming work, иначе foreground защита превратится в будущий stall.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


145. (L2 [T]) Что такое subcompactions / parallel compaction?

     **Ответ:** Subcompactions делят merge на независимые key ranges, повышая parallelism при достаточно большом input. Требуются корректные boundaries, resource limits и общее atomic publication; больше потоков может насытить disk/CPU и ухудшить p99.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


146. (L2 [P]) Реализовать leveled compaction policy

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


147. (L2 [P]) Реализовать size-tiered compaction policy

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


148. (L2 [P]) Реализовать scoring function для выбора compaction candidates

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


149. (L2 [P]) Реализовать rate limiting compaction

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


150. (L2 [P]) Реализовать compaction backlog metrics

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


151. (L2 [D]) Почему disk usage внезапно вырос во время compaction?

     **Ответ:** Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Типичная ошибка:** Удалять tombstone, пока старая версия может сохраниться вне compaction inputs или в живом snapshot.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


152. (L2 [D]) Почему compaction идёт постоянно и не догоняет workload?

     **Ответ:** Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


153. (L2 [D]) Почему foreground writes начинают stall-иться?

     **Ответ:** Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


154. (L2 [D]) Почему после compaction cache hit rate падает?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


155. (L2 [D]) Почему p99 latency скачет каждые несколько минут?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


156. (L3 [T]) Как проектировать compaction scheduler для SSD/NVMe?

     **Ответ:** Scheduler выбирает работу по debt/overlap/level priorities и доступным ресурсам; rate limiter ограничивает её bytes/IO. Ограничение должно оставлять sustainable maintenance ≥ incoming work, иначе foreground защита превратится в будущий stall.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


157. (L3 [T]) Как compaction сочетается с snapshots и long-running readers?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


158. (L3 [T]) Как compaction влияет на space amplification?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


159. (L3 [T]) Почему trivial move compaction иногда возможна, а иногда нет?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


160. (L3 [T]) Как устроен parallel compaction без нарушения sorted order?

     **Ответ:** Subcompactions делят merge на независимые key ranges, повышая parallelism при достаточно большом input. Требуются корректные boundaries, resource limits и общее atomic publication; больше потоков может насытить disk/CPU и ухудшить p99.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


161. (L3 [T]) Как compaction взаимодействует с checksums, bloom filters и index rebuild?

     **Ответ:** Bloom filter отвечает «точно отсутствует» или «возможно присутствует»; positive требует проверки данных. Обычный filter не поддерживает безопасное удаление битов, false negatives недопустимы; hash/key transformation должна совпадать с read path. Checksum обнаруживает случайную corruption только в покрытой границе и не восстанавливает данные. CRC не аутентифицирует намеренное изменение, а валидный checksum не доказывает корректность бизнес-содержимого.

     **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html)


162. (L3 [T]) Как проектировать backpressure между writes и compaction?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


163. (L3 [T]) Почему compaction может saturate memory bandwidth, а не только disk?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


164. (L3 [T]) Как observability должна разделять compaction debt, stall time и amp factors?

     **Ответ:** Debt — накопившаяся обязательная compaction работа, измеряемая files/bytes/time. Пока sustainable maintenance ниже incoming work, добавление буфера задерживает stall, но не устраняет причину. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


165. (L3 [T]) Как проектировать manual compaction и background compaction policies?

     **Ответ:** Compaction сливает sorted runs, сохраняет актуальные/нужные snapshot версии и убирает безопасный мусор. Leveled обычно уменьшает overlap/read-space amplification ценой переписывания; tiered меняет этот баланс в пользу записи.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


166. (L3 [P]) Реализовать parallel compaction по key ranges

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


167. (L3 [P]) Реализовать compaction planner с учётом overlap и score

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


168. (L3 [P]) Реализовать write stall control на основе backlog

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt. Выбирать input files без конфликтов, K-way merge по key/sequence, писать новый generation и atomically обновлять manifest. Старые файлы удалять после reader release; tombstone удалять только при доказанном отсутствии воскресающей старой версии.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


169. (L3 [P]) Реализовать compaction traces для postmortem

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


170. (L3 [P]) Реализовать симулятор compaction strategies на synthetic workloads

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


171. (L3 [D]) Как доказать, что lag или stalls вызваны compaction debt, а не WAL?

     **Ответ:** Debt — накопившаяся обязательная compaction работа, измеряемая files/bytes/time. Пока sustainable maintenance ниже incoming work, добавление буфера задерживает stall, но не устраняет причину. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


172. (L3 [D]) Почему compaction CPU высокий даже на NVMe?

     **Ответ:** Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


173. (L3 [D]) Как расследовать starvation: одни ranges compact-ятся, другие нет?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


174. (L3 [D]) Почему после tuning compaction throughput вырос, а read latency ухудшилась?

     **Ответ:** Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


175. (L3 [D]) Как диагностировать, что bottleneck — metadata/manifest locking, а не IO?

     **Ответ:** Manifest/catalog описывает опубликованный набор file generations и их metadata. Данные output file завершаются до ссылки из durable manifest; старые files удаляются после безопасной публикации и исчезновения readers. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


176. (L4 [S]) Как выбрать compaction strategy под write-heavy vs read-heavy workload?

     **Ответ:** Определить read/write/space budgets и резерв свободного места, задать priorities/rate limits. Слишком сильное throttling защищает foreground сейчас, но накапливает debt и write stalls позже.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


177. (L4 [S]) Когда стоит предпочесть tiered compaction, а когда leveled?

     **Ответ:** Leveled ограничивает overlap большинства уровней, часто уменьшая reads/space ценой больше rewrites. Tiered/universal хранит несколько sorted runs, уменьшая часть write work, но повышая read/space costs; сравнивать steady state.

     **Рекомендация:** Определить read/write/space budgets и резерв свободного места, задать priorities/rate limits. Слишком сильное throttling защищает foreground сейчас, но накапливает debt и write stalls позже.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


178. (L4 [S]) Как проектировать engine так, чтобы compaction не разрушала p99?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Рекомендация:** Определить read/write/space budgets и резерв свободного места, задать priorities/rate limits. Слишком сильное throttling защищает foreground сейчас, но накапливает debt и write stalls позже.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


179. (L4 [S]) Как строить SLA вокруг неизбежной background maintenance?

     **Ответ:** Определить read/write/space budgets и резерв свободного места, задать priorities/rate limits. Слишком сильное throttling защищает foreground сейчас, но накапливает debt и write stalls позже.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


180. (L4 [S]) Как объяснять продуктовым командам цену tombstones, snapshots и retention на LSM engine?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает. Snapshot может требовать старую версию, даже если current lookup видит delete. Compaction проверяет visibility horizon и наличие старых данных вне inputs; ранний drop tombstone может воскресить значение.

     **Рекомендация:** Определить read/write/space budgets и резерв свободного места, задать priorities/rate limits. Слишком сильное throttling защищает foreground сейчас, но накапливает debt и write stalls позже.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

## 🔹 Write amplification

181. (L1 [T]) Что такое write amplification?

     **Ответ:** Отношение physical bytes written к logical changed bytes в заданной границе. WAL, compaction, индексы и device FTL следует считать отдельно.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


182. (L1 [T]) Почему write amplification важна для storage engines?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


183. (L1 [T]) Почему LSM engines склонны к write amplification?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


184. (L1 [T]) Чем logical write отличается от physical bytes written?

     **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


185. (L1 [T]) Почему rewrite данных во время compaction увеличивает WA?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


186. (L1 [T]) Почему WAL тоже вносит вклад в write amplification?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


187. (L1 [T]) Как tombstones влияют на WA?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


188. (L1 [T]) Почему маленькие update-ы могут приводить к большим physical write?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


189. (L1 [T]) Как write amplification влияет на SSD lifetime?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


190. (L1 [T]) Почему WA — это метрика и correctness, и стоимости?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


191. (L1 [P]) Реализовать счётчик logical bytes written

     **Ответ:** Считать logical payload, WAL bytes, flush/compaction bytes и device writes отдельно. На одинаковом workload изменить один параметр, дождаться steady state/фоновой работы и сравнить ratios, p99 и disk space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


192. (L1 [P]) Реализовать счётчик physical bytes written

     **Ответ:** Считать logical payload, WAL bytes, flush/compaction bytes и device writes отдельно. На одинаковом workload изменить один параметр, дождаться steady state/фоновой работы и сравнить ratios, p99 и disk space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


193. (L1 [P]) Реализовать метрику WA = physical / logical

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


194. (L1 [P]) Реализовать отчёт по WA для WAL + compaction + flush

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


195. (L1 [P]) Реализовать synthetic workload для измерения WA

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


196. (L2 [T]) Какие компоненты дают write amplification в B-Tree engine?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


197. (L2 [T]) Какие компоненты дают WA в LSM engine?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


198. (L2 [T]) Как размер memtable влияет на WA?

     **Ответ:** Memtable — изменяемый ordered in-memory слой LSM; после freeze он immutable до flush/reclamation. WAL защищает требуемый committed state, а writer/snapshot sequence определяет видимую версию.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


199. (L2 [T]) Как compaction policy влияет на WA?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


200. (L2 [T]) Почему small random writes особенно дороги?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


201. (L2 [T]) Как compression влияет на measured WA?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


202. (L2 [T]) Почему overwrite и append-only workloads дают разный WA?

     **Ответ:** Append-only избегает in-place перезаписи существующего префикса и удобно группирует log writes. Нужны framing/checksum и safe truncation/recycling; append syscall не гарантирует power-loss atomicity или отсутствие amplification.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


203. (L2 [T]) Что такое device-level WA и почему он отличается от DB-level WA?

     **Ответ:** DB-level WA сравнивает host bytes engine с logical payload; device-level добавляет внутренние FTL/GC rewrites. Эти отношения имеют разные numerator/denominator и могут перемножаться лишь при согласованных границах/интервале.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


204. (L2 [T]) Как page size/block size влияют на WA?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


205. (L2 [T]) Почему high update churn по hot keys создаёт disproportionate WA?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


206. (L2 [P]) Реализовать breakdown WA по источникам

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


207. (L2 [P]) Реализовать benchmark WA для overwrite vs append workloads

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


208. (L2 [P]) Реализовать сравнение leveled vs tiered compaction по WA

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


209. (L2 [P]) Реализовать per-level WA metrics

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


210. (L2 [P]) Реализовать alert на аномальный рост WA

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


211. (L2 [D]) Почему SSD writes в системе намного выше клиентского ingress?

     **Ответ:** Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


212. (L2 [D]) Почему после изменения compaction policy вырос WA?

     **Ответ:** Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


213. (L2 [D]) Почему tombstone-heavy workload уничтожает диск?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает. Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


214. (L2 [D]) Почему WAL recycle не уменьшил write volume?

     **Ответ:** Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


215. (L2 [D]) Почему after compression WA по байтам снизился, а latency нет?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться. Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


216. (L3 [T]) Как проектировать storage engine с низким WA без разрушения reads?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


217. (L3 [T]) Как write amplification связана с read amplification и space amplification?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


218. (L3 [T]) Как SSD FTL добавляет hidden device-level WA?

     **Ответ:** FTL/flash GC и wear leveling добавляют внутренние rewrites и задержки, особенно при низком свободном месте. Fresh-device burst не отражает steady-state p99/endurance; учитывать TRIM, overprovisioning и power-loss protection. DB-level WA сравнивает host bytes engine с logical payload; device-level добавляет внутренние FTL/GC rewrites. Эти отношения имеют разные numerator/denominator и могут перемножаться лишь при согласованных границах/интервале.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


219. (L3 [T]) Как выравнивание IO по erase block/zone влияет на WA?

     **Ответ:** Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure. NAND программируется страницами и стирается более крупными erase blocks; in-place overwrite на уровне host скрывает relocation/GC FTL. Host block size, filesystem page и flash geometry — разные уровни.

     **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


220. (L3 [T]) Как snapshots/retention/TTL policies влияют на WA?

     **Ответ:** TTL определяет логическую пригодность, eviction — вытеснение под memory pressure. Отложенное физическое удаление нормально, но чтение не должно возвращать expired запись по обещанному контракту; wall-clock jumps требуют выбранной time semantics.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)


221. (L3 [T]) Как hot/cold data separation может снизить WA?

     **Ответ:** Горячие данные/metadata держат в низколатентном слое, холодные — в более дешёвом durable storage. Cache miss, retrieval/request/egress cost и restore path входят в SLO; возраст не всегда равен будущей востребованности.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


222. (L3 [T]) Как batching, coalescing и larger memtables уменьшают WA?

     **Ответ:** Memtable — изменяемый ordered in-memory слой LSM; после freeze он immutable до flush/reclamation. WAL защищает требуемый committed state, а writer/snapshot sequence определяет видимую версию.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


223. (L3 [T]) Как Linux buffered IO vs direct IO влияет на наблюдаемую write path efficiency?

     **Ответ:** Write amplification — физически записанные байты, делённые на логические изменения за согласованный интервал. WAL, индексы, replication, compaction и device FTL могут добавлять разные уровни усиления; их нельзя смешивать без границы измерения.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


224. (L3 [T]) Как измерять WA корректно в production, а не на synthetic benchmark?

     **Ответ:** Сравнение требует одинаковых данных, correctness/durability, concurrency и cold/warm состояния. Проверять finished throughput, latency distribution, ошибки и steady-state maintenance; генератор не должен скрывать ожидание/coordinated omission.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


225. (L3 [T]) Почему нельзя минимизировать WA изолированно от остальных метрик?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


226. (L3 [P]) Реализовать per-key / per-range churn analysis для WA

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


227. (L3 [P]) Реализовать hot/cold partitioning симулятор

     **Ответ:** Fault harness должен контролировать schedules и persistence/network boundaries, сохранять seed/trace и проверять инварианты, а не только успешный restart. Отдельно моделировать process crash, power-loss, delay/loss/reorder и stale clients. Считать logical payload, WAL bytes, flush/compaction bytes и device writes отдельно. На одинаковом workload изменить один параметр, дождаться steady state/фоновой работы и сравнить ratios, p99 и disk space.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


228. (L3 [P]) Реализовать device-aware IO alignment benchmark

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


229. (L3 [P]) Реализовать WA heatmap по уровням / tenants / tables

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


230. (L3 [P]) Реализовать what-if model для tuning memtable / compaction parameters

     **Ответ:** Ordered container хранит key/sequence/value-or-tombstone, WAL/visibility publication синхронизированы. Freeze переключает active table атомарно, старый table живёт до flush/readers; проверить concurrent update и snapshot traversal.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


231. (L3 [D]) Как доказать, что write amplification вызвана churn, а не просто высоким ingress?

     **Ответ:** Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


232. (L3 [D]) Почему after bigger memtables WA снизилась, но recovery time вырос?

     **Ответ:** Memtable — изменяемый ordered in-memory слой LSM; после freeze он immutable до flush/reclamation. WAL защищает требуемый committed state, а writer/snapshot sequence определяет видимую версию. Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


233. (L3 [D]) Как расследовать расхождение между DB-level WA и SSD-level telemetry?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. DB-level WA сравнивает host bytes engine с logical payload; device-level добавляет внутренние FTL/GC rewrites. Эти отношения имеют разные numerator/denominator и могут перемножаться лишь при согласованных границах/интервале. Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


234. (L3 [D]) Почему per-tenant WA сильно различается при одинаковом объёме данных?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


235. (L3 [D]) Как диагностировать, что write path saturate-ится memory copies, а не диском?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Разложить host writes по WAL/data/index/compaction и проверить устройства/retention. Малые updates широких строк, лишние индексы и частые compactions увеличивают ratio даже при неизменном QPS.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


236. (L4 [S]) Как выбирать acceptable WA budget для продукта?

     **Ответ:** Снижать через batches, минимальные индексы, compact encoding и подходящую compaction. Нулевое усиление обычно нереалистично; оптимизация WA не должна нарушать durability или бесконтрольно ухудшать read/space amplification.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


237. (L4 [S]) Когда стоит жертвовать WA ради лучшего read latency?

     **Ответ:** Снижать через batches, минимальные индексы, compact encoding и подходящую compaction. Нулевое усиление обычно нереалистично; оптимизация WA не должна нарушать durability или бесконтрольно ухудшать read/space amplification.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


238. (L4 [S]) Как проектировать storage tiers под workloads с разным churn?

     **Ответ:** Снижать через batches, минимальные индексы, compact encoding и подходящую compaction. Нулевое усиление обычно нереалистично; оптимизация WA не должна нарушать durability или бесконтрольно ухудшать read/space amplification.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


239. (L4 [S]) Как объяснять бизнесу связь WA, стоимости SSD и latency?

     **Ответ:** Снижать через batches, минимальные индексы, compact encoding и подходящую compaction. Нулевое усиление обычно нереалистично; оптимизация WA не должна нарушать durability или бесконтрольно ухудшать read/space amplification.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


240. (L4 [S]) Как строить roadmap оптимизаций write path, не ломая recovery/correctness?

     **Ответ:** Снижать через batches, минимальные индексы, compact encoding и подходящую compaction. Нулевое усиление обычно нереалистично; оптимизация WA не должна нарушать durability или бесконтрольно ухудшать read/space amplification.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

## 🔹 Read amplification

241. (L1 [T]) Что такое read amplification?

     **Ответ:** Лишние probes/blocks/bytes на полезное чтение. Указывать границу: SST probes, cache accesses или physical disk bytes — это разные метрики.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


242. (L1 [T]) Почему read amplification важна для storage engines?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


243. (L1 [T]) Почему LSM engine может иметь высокую read amplification?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


244. (L1 [T]) Чем point lookup и range scan отличаются по read amplification?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


245. (L1 [T]) Почему множество SSTables увеличивает read amplification?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


246. (L1 [T]) Как bloom filters помогают снижать read amplification?

     **Ответ:** Bloom filter отвечает «точно отсутствует» или «возможно присутствует»; positive требует проверки данных. Обычный filter не поддерживает безопасное удаление битов, false negatives недопустимы; hash/key transformation должна совпадать с read path.

     **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


247. (L1 [T]) Почему secondary indexes тоже могут увеличивать RA?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


248. (L1 [T]) Почему cache misses усиливают read amplification?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


249. (L1 [T]) Как stale versions и tombstones увеличивают стоимость чтения?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


250. (L1 [T]) Почему read amplification — это не только IO, но и CPU work?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


251. (L1 [P]) Реализовать счётчик logical reads vs physical block reads

     **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается. Инструментировать files/levels/blocks examined и disk/cache bytes на get/scan. Добавить Bloom/index/pruning и сравнить с baseline на hit/miss, cold/warm и range queries; результат проверять на одном snapshot.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


252. (L1 [P]) Реализовать метрику RA для point lookups

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


253. (L1 [P]) Реализовать метрику RA для range scans

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


254. (L1 [P]) Реализовать tracing read path через memtable + SSTables + cache

     **Ответ:** Ordered container хранит key/sequence/value-or-tombstone, WAL/visibility publication синхронизированы. Freeze переключает active table атомарно, старый table живёт до flush/readers; проверить concurrent update и snapshot traversal.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


255. (L1 [P]) Реализовать benchmark для lookup across N SSTables

     **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


256. (L2 [T]) Почему leveled compaction уменьшает RA по сравнению с tiered?

     **Ответ:** Leveled ограничивает overlap большинства уровней, часто уменьшая reads/space ценой больше rewrites. Tiered/universal хранит несколько sorted runs, уменьшая часть write work, но повышая read/space costs; сравнивать steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


257. (L2 [T]) Как block size влияет на RA?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


258. (L2 [T]) Почему маленький block cache приводит к большому RA?

     **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


259. (L2 [T]) Как read amplification проявляется в B-Tree engines?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


260. (L2 [T]) Почему index lookup + table lookup — форма read amplification?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


261. (L2 [T]) Как covering index уменьшает RA?

     **Ответ:** Covering требует наличия всех полей query в index, включая predicates/order, но не гарантирует index-only физическое чтение. Payload columns и широкий composite key увеличивают размер и write maintenance.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


262. (L2 [T]) Почему scans на HDD и SSD по-разному чувствительны к RA?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


263. (L2 [T]) Как prefetch влияет на perceived RA?

     **Ответ:** Prefetch полезен, если адрес известен достаточно заранее и есть bandwidth/cache capacity. Pointer dependency, случайные accesses, неверная distance и cache pollution могут убрать выигрыш; сравнивать physical bytes и stalled cycles.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


264. (L2 [T]) Почему сжатие может уменьшить IO RA, но увеличить CPU RA?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


265. (L2 [T]) Как tombstones и snapshots ухудшают lookup path?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает. Snapshot может требовать старую версию, даже если current lookup видит delete. Compaction проверяет visibility horizon и наличие старых данных вне inputs; ранний drop tombstone может воскресить значение.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


266. (L2 [P]) Реализовать bloom-assisted lookup path

     **Ответ:** Выбрать m bits/k probes/seed и одинаковое canonical key/prefix encoding, set bits при build и check при lookup. Сохранить format parameters, проверить отсутствие false negatives всех inserted keys и измерить false positives на независимой выборке.

     **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


267. (L2 [P]) Реализовать block cache simulator

     **Ответ:** Cache key содержит file generation+block offset, value удерживается pin/ref до конца read. Реализовать byte budget, load coalescing и eviction без освобождения активного block; test concurrent misses и reuse file identity.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


268. (L2 [P]) Реализовать covering index prototype

     **Ответ:** Index entry включает search key/locator и нужный payload; query проверяет coverage, snapshot visibility и residual predicates. Если видимость/поле не доказаны, fetch row; test compare с table scan на concurrent update/delete.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


269. (L2 [P]) Реализовать prefetch для range scan

     **Ответ:** Задать hint/distance/окно, измерить physical bytes и полезную latency при sequential/random/mixed workload. Prefetch не должен читать за bounds или вытеснять критичный cache; сравнить с hardware/OS baseline.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


270. (L2 [P]) Реализовать сравнение RA для leveled vs tiered layouts

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


271. (L2 [D]) Почему reads деградируют, хотя write throughput нормальный?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


272. (L2 [D]) Почему cache hit rate упал после compaction?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого. Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


273. (L2 [D]) Почему point lookup внезапно стал читать десятки файлов?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


274. (L2 [D]) Почему range scans стали медленнее после включения compression?

     **Ответ:** И B+tree, и LSM поддерживают упорядоченный range scan: B+tree проходит листья, LSM сливает sorted iterators. LSM не обязательно «плох» для ranges, но overlap/versions/tombstones увеличивают merge work; проверять workload. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться. Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


275. (L2 [D]) Почему CPU usage высокий на reads даже при малом disk IO?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


276. (L3 [T]) Как проектировать read path для минимального RA без взрыва WA?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


277. (L3 [T]) Как блоковая компрессия, bloom filters и partitioned indexes вместе уменьшают RA?

     **Ответ:** Bloom filter отвечает «точно отсутствует» или «возможно присутствует»; positive требует проверки данных. Обычный filter не поддерживает безопасное удаление битов, false negatives недопустимы; hash/key transformation должна совпадать с read path. Partitioned index/filter разбивает крупную metadata на cacheable части, чтобы point lookup не загружал весь индекс/фильтр. Выигрыш зависит от cache budget, locality и добавленного обращения к верхнему index level.

     **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


278. (L3 [T]) Как Linux page cache и block cache движка взаимодействуют при RA?

     **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


279. (L3 [T]) Как readahead может помогать и вредить?

     **Ответ:** Readahead заранее подтягивает ожидаемые страницы последовательного файла. Random/sparse доступ, лишние reads и cache pollution способны уменьшить пользу; сравнить physical bytes, faults и полезную latency.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


280. (L3 [T]) Как NUMA, TLB misses и cache locality влияют на CPU-side RA?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. TLB кэширует translations, и большой случайный working set повышает translation misses/page walks. Huge pages увеличивают охват TLB, но требуют оценки fragmentation, allocation stalls и реального выигрыша.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


281. (L3 [T]) Как planner/optimizer должен учитывать RA при выборе access path?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


282. (L3 [T]) Как измерять RA по tenants/tables/queries, а не только глобально?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


283. (L3 [T]) Почему read amplification часто растёт постепенно и незаметно?

     **Ответ:** Read amplification — работа/bytes/IO сверх полезного ответа в выбранной границе. Несколько runs, tombstones, слабые filters и маленький cache увеличивают probes; page/block fetch ради одного значения тоже создаёт усиление.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


284. (L3 [T]) Как hot/cold data separation помогает снижать RA?

     **Ответ:** Горячие данные/metadata держат в низколатентном слое, холодные — в более дешёвом durable storage. Cache miss, retrieval/request/egress cost и restore path входят в SLO; возраст не всегда равен будущей востребованности.

     **Источник:** [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


285. (L3 [T]) Почему RA — одна из главных причин непредсказуемого p99 на storage engine?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


286. (L3 [P]) Реализовать per-query RA profiler

     **Ответ:** Считать logical bytes/results и отдельно WAL/flush/compaction/device bytes либо files/blocks probed. Зафиксировать границу/интервал, включая фоновую работу, сравнить overwrite/append/negative lookup при одинаковой durability и steady state.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


287. (L3 [P]) Реализовать cache-aware iterator

     **Ответ:** Инструментировать files/levels/blocks examined и disk/cache bytes на get/scan. Добавить Bloom/index/pruning и сравнить с baseline на hit/miss, cold/warm и range queries; результат проверять на одном snapshot.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


288. (L3 [P]) Реализовать adaptive prefetch policy

     **Ответ:** Задать hint/distance/окно, измерить physical bytes и полезную latency при sequential/random/mixed workload. Prefetch не должен читать за bounds или вытеснять критичный cache; сравнить с hardware/OS baseline.

     **Источник:** [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


289. (L3 [P]) Реализовать heatmap block accesses / cache misses / SSTable probes

     **Ответ:** Writer пишет sorted bounded blocks с encoding/checksum, index/filters и footer; parser проверяет bounds/version/comparator. Sync завершённый file до durable manifest reference; test truncated/corrupt input и equivalence sequential/index lookup.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


290. (L3 [P]) Реализовать симулятор trade-off между RA и WA для разных compaction policies

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


291. (L3 [D]) Как доказать, что bottleneck в read amplification, а не в network/service layer?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


292. (L3 [D]) Почему уменьшение числа SSTables не улучшило reads?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


293. (L3 [D]) Почему planner выбирает path с высоким RA?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


294. (L3 [D]) Как расследовать сочетание high CPU, low IO и плохой read latency?

     **Ответ:** Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


295. (L3 [D]) Почему p50 хороший, а p99 ужасный именно из-за read path complexity?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сравнить per-query probes, Bloom false positives, cache hits, overlap L0 и tombstone density. Проверить compaction debt и changed working set; высокий read amplification может скрываться высоким cache hit до роста данных.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


296. (L4 [S]) Как выбирать acceptable RA budget для OLTP vs analytics workload?

     **Ответ:** Сочетать filters, indexes, layout/ordering и compaction с budget памяти. Сокращение files/blocks для чтения часто оплачивается дополнительными writes/space или более тяжёлой metadata.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


297. (L4 [S]) Как балансировать RA, WA и space amplification в storage engine?

     **Ответ:** Сочетать filters, indexes, layout/ordering и compaction с budget памяти. Сокращение files/blocks для чтения часто оплачивается дополнительными writes/space или более тяжёлой metadata.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


298. (L4 [S]) Когда стоит инвестировать в block cache, а когда в другую compaction strategy?

     **Ответ:** Block cache хранит прочитанные blocks и metadata в bounded памяти. Cache key должен включать стабильную file/generation identity, иначе reuse file ID может вернуть чужой block; pinning и eviction должны учитывать readers.

     **Рекомендация:** Сочетать filters, indexes, layout/ordering и compaction с budget памяти. Сокращение files/blocks для чтения часто оплачивается дополнительными writes/space или более тяжёлой metadata.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


299. (L4 [S]) Как строить roadmap оптимизаций read path, не ломая write path?

     **Ответ:** Сочетать filters, indexes, layout/ordering и compaction с budget памяти. Сокращение files/blocks для чтения часто оплачивается дополнительными writes/space или более тяжёлой metadata.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


300. (L4 [S]) Как объяснять команде, что “быстрые записи” почти всегда кто-то потом оплачивает на чтении?

     **Ответ:** Сочетать filters, indexes, layout/ordering и compaction с budget памяти. Сокращение files/blocks для чтения часто оплачивается дополнительными writes/space или более тяжёлой metadata.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как WAL, SSTables и compaction вместе образуют write path в LSM engine?

     **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


302. (L2 [T]) Почему оптимизация одного компонента storage engine часто ухудшает другой?

     **Ответ:** LSM пишет WAL/memtable, затем immutable sorted files и compaction. Он превращает часть мелких изменений в последовательные writes, но платит read/write/space amplification и может stall при отставании background work.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


303. (L2 [T]) Как recovery зависит от того, где именно данные находятся: в WAL, memtable или SSTables?

     **Ответ:** Memtable — изменяемый ordered in-memory слой LSM; после freeze он immutable до flush/reclamation. WAL защищает требуемый committed state, а writer/snapshot sequence определяет видимую версию.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


304. (L2 [T]) Почему snapshots, TTL и deletes особенно важны для compaction semantics?

     **Ответ:** TTL определяет логическую пригодность, eviction — вытеснение под memory pressure. Отложенное физическое удаление нормально, но чтение не должно возвращать expired запись по обещанному контракту; wall-clock jumps требуют выбранной time semantics.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)


305. (L2 [T]) Как Linux page cache влияет и на WAL, и на SSTable reads?

     **Ответ:** Write-ahead правило: журнал изменения обязан стать устойчивым раньше соответствующей dirty page. Durable commit определяется завершением нужной flush boundary; запись в userspace/kernel buffer ещё не является долговечным ACK.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


306. (L2 [T]) Почему mmap vs pread/read — не только API choice, но и архитектурный trade-off?

     **Ответ:** mmap даёт memory view файла, но обращения могут вызывать page faults, а MAP_SHARED не делает update crash-atomic. Pointer/view обязан жить не дольше mapping/file generation, внешние offsets и lengths проверяются.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)


307. (L2 [T]) Как allocator, memcpy и serialization overhead становятся bottleneck внутри storage engine?

     **Ответ:** Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


308. (L2 [T]) Почему SSD/NVMe не отменяют проблем amplification, а только меняют их профиль?

     **Ответ:** LSM пишет WAL/memtable, затем immutable sorted files и compaction. Он превращает часть мелких изменений в последовательные writes, но платит read/write/space amplification и может stall при отставании background work.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


309. (L2 [T]) Как observability должна связывать WAL lag, compaction debt, WA и RA в одну картину?

     **Ответ:** Debt — накопившаяся обязательная compaction работа, измеряемая files/bytes/time. Пока sustainable maintenance ниже incoming work, добавление буфера задерживает stall, но не устраняет причину. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


310. (L2 [T]) Почему большинство production storage incidents — это не один баг, а сочетание нескольких trade-offs?

     **Ответ:** LSM пишет WAL/memtable, затем immutable sorted files и compaction. Он превращает часть мелких изменений в последовательные writes, но платит read/write/space amplification и может stall при отставании background work.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


311. (L2 [P]) Реализовать end-to-end mini LSM engine: WAL + memtable + SSTables + compaction

     **Ответ:** Ordered container хранит key/sequence/value-or-tombstone, WAL/visibility publication синхронизированы. Freeze переключает active table атомарно, старый table живёт до flush/readers; проверить concurrent update и snapshot traversal.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


312. (L2 [P]) Реализовать dashboard: WAL flush latency, compaction debt, WA, RA, stall time

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos tests: crash during flush/compaction/recovery

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


314. (L2 [P]) Реализовать benchmark matrix: write-heavy / read-heavy / overwrite / tombstone-heavy

     **Ответ:** DELETE добавляет versioned tombstone, lookup подавляет более старые values. Compaction удаляет marker лишь после проверки snapshots и охвата старых copies/levels; test строит «new tombstone + hidden older value» и проверяет отсутствие resurrection.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


315. (L2 [P]) Реализовать tenant-aware storage metrics

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Ввести sequence numbers/tombstones, active/frozen memtables, SST и manifest. Flush публиковать после устойчивой записи файла, get/merge выбирает новейшую видимую версию, compaction сохраняет snapshots и безопасные tombstones.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


316. (L3 [D]) Почему после tuning compaction write throughput вырос, но recovery time и read latency ухудшились?

     **Ответ:** Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно. Снять pending bytes, L0 count, throughput merge/codec, temporary disk usage и snapshots. Проверить, успевает ли maintenance за входом, и не ограничены ли потоки disk bandwidth/CPU/retained versions.

     **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


317. (L3 [D]) Почему p50 нормальный, а p99 ломается каждые несколько минут?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сопоставить L0 files, pending compaction bytes, memtable backlog, stall time, cache/Bloom misses и disk/CPU. Измерять sustainable throughput на заполненном dataset, включая фоновую работу и snapshots.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


318. (L3 [D]) Как доказать, что storage bottleneck в memory bandwidth, а не в SSD?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Сопоставить L0 files, pending compaction bytes, memtable backlog, stall time, cache/Bloom misses и disk/CPU. Измерять sustainable throughput на заполненном dataset, включая фоновую работу и snapshots.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


319. (L3 [D]) Почему system-wide disk util невысокий, но storage engine всё равно медленный?

     **Ответ:** Сопоставить L0 files, pending compaction bytes, memtable backlog, stall time, cache/Bloom misses и disk/CPU. Измерять sustainable throughput на заполненном dataset, включая фоновую работу и snapshots.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но storage cost и latency резко выросли”?

     **Ответ:** Сопоставить L0 files, pending compaction bytes, memtable backlog, stall time, cache/Bloom misses и disk/CPU. Измерять sustainable throughput на заполненном dataset, включая фоновую работу и snapshots.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


321. (L4 [S]) Как выбирать между B-Tree и LSM на уровне storage engine architecture?

     **Ответ:** Выбирать compaction под read/write/range требования, оставлять запас CPU/I/O/disk и admission control. Рост числа threads без учёта устройства может ухудшить p99 и не убрать накопление compaction debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


322. (L4 [S]) Как проектировать storage engine под NVMe, сохраняя переносимость и correctness?

     **Ответ:** Выбирать compaction под read/write/range требования, оставлять запас CPU/I/O/disk и admission control. Рост числа threads без учёта устройства может ухудшить p99 и не убрать накопление compaction debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


323. (L4 [S]) Какие anti-patterns в storage engine internals чаще всего взрываются на production?

     **Ответ:** Выбирать compaction под read/write/range требования, оставлять запас CPU/I/O/disk и admission control. Рост числа threads без учёта устройства может ухудшить p99 и не убрать накопление compaction debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


324. (L4 [S]) Как строить roadmap observability для своей БД: что мерить с первого дня?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


325. (L4 [S]) Как объяснить команде, что storage engine — это цепочка компромиссов, а не набор независимых оптимизаций?

     **Ответ:** Выбирать compaction под read/write/range требования, оставлять запас CPU/I/O/disk и admission control. Рост числа threads без учёта устройства может ухудшить p99 и не убрать накопление compaction debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


---
