# 🔁 6. Репликация

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

## 🔹 Leader-follower

1. (L1 [T]) Что такое leader-follower replication?

   **Ответ:** Лидер принимает изменения и передаёт их followers. Followers обслуживают разрешённые чтения и могут участвовать в failover; свежесть зависит от режима репликации.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


2. (L1 [T]) Какие роли у leader и follower?

   **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


3. (L1 [T]) Почему writes обычно идут только в leader?

   **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


4. (L1 [T]) Почему reads иногда можно направлять на follower?

   **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


5. (L1 [T]) Что такое replication log?

   **Ответ:** Replication log — упорядоченный stream изменений с identity/position; replicated log дополнительно согласуется выбранным protocol между копиями. Presence записи на replica, durable flush и committed/apply — разные состояния.

   **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


6. (L1 [T]) Чем physical replication отличается от logical replication?

   **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


7. (L1 [T]) Почему follower должен применять изменения в правильном порядке?

   **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


8. (L1 [T]) Что такое failover в leader-follower архитектуре?

   **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


9. (L1 [T]) Что такое promotion follower to leader?

   **Ответ:** Promotion должен выбирать допустимый committed/durable prefix и отозвать старого writer. Async gap может потерять уже ACK-нутый хвост, stale clients продолжат старый route; fencing и exact ACK contract обязательны.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


10. (L1 [T]) Какие базовые преимущества и недостатки leader-follower схемы?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


11. (L1 [P]) Реализовать простой leader, отправляющий append-only log на follower

    **Ответ:** Сериализовать length/type/tx_id/LSN/payload/checksum, писать loop с short-write/EINTR обработкой. Разделить written и durable LSN, sync перед требуемым ACK; parser ограничивает length и останавливает recovery на неполном tail.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


12. (L1 [P]) Реализовать follower apply loop

    **Ответ:** Leader назначает ordered log positions, followers сохраняют/apply идемпотентно и сообщают receive/flush/apply. Promotion требует catch-up/quorum и fencing старого leader; client retries используют operation IDs.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


13. (L1 [P]) Реализовать sequence number / LSN для replicated log

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


14. (L1 [P]) Реализовать catch-up follower после временного отставания

    **Ответ:** Leader назначает ordered log positions, followers сохраняют/apply идемпотентно и сообщают receive/flush/apply. Promotion требует catch-up/quorum и fencing старого leader; client retries используют operation IDs.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


15. (L1 [P]) Реализовать read path: leader-only и follower-read

    **Ответ:** Leader назначает ordered log positions, followers сохраняют/apply идемпотентно и сообщают receive/flush/apply. Promotion требует catch-up/quorum и fencing старого leader; client retries используют operation IDs.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


16. (L2 [T]) Что такое replication slot / checkpoint / offset?

    **Ответ:** Slot удерживает WAL/нужный history до продвижения consumer boundary. Это помогает continuity, но остановленный consumer может удержать диск; нужны lag/retained bytes alerts и план восстановления при потере нужного журнала.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


17. (L2 [T]) Как leader понимает, насколько follower отстал?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


18. (L2 [T]) Почему сетевой reorder сам по себе не должен ломать репликацию?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


19. (L2 [T]) Почему follower apply может быть bottleneck даже при быстрой сети?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


20. (L2 [T]) Как leader-follower влияет на read-your-writes consistency?

    **Ответ:** Read-your-writes требует, чтобы сессия после своей записи не читала более старую версию. Это можно обеспечить leader routing, required LSN/version wait либо session token, не обещая глобальную linearizability всем клиентам.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


21. (L2 [T]) Почему stale reads — типичная проблема follower reads?

    **Ответ:** Follower read уменьшает RTT/нагрузку лидера лишь при разрешённой freshness. Для строгого read нужны доказанная read-index/lease/required-position процедура и applied boundary; «узел здоров» не означает актуальный snapshot.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


22. (L2 [T]) Что такое semi-sync replication?

    **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


23. (L2 [T]) Что такое failover gap и lost commits?

    **Ответ:** Promotion должен выбирать допустимый committed/durable prefix и отозвать старого writer. Async gap может потерять уже ACK-нутый хвост, stale clients продолжат старый route; fencing и exact ACK contract обязательны.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)


24. (L2 [T]) Почему replication тесно связана с WAL/binlog?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


25. (L2 [T]) Что такое log shipping vs streaming replication?

    **Ответ:** Log shipping часто передаёт завершённые segments/files, streaming — поток log records быстрее после генерации. Оба требуют continuity/identity и recovery; streaming не гарантирует durable/apply ACK без соответствующей настройки.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


26. (L2 [P]) Реализовать ack от follower на последний применённый LSN

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


27. (L2 [P]) Реализовать streaming replication поверх TCP

    **Ответ:** Log shipping часто передаёт завершённые segments/files, streaming — поток log records быстрее после генерации. Оба требуют continuity/identity и recovery; streaming не гарантирует durable/apply ACK без соответствующей настройки. Leader назначает ordered log positions, followers сохраняют/apply идемпотентно и сообщают receive/flush/apply. Promotion требует catch-up/quorum и fencing старого leader; client retries используют operation IDs.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


28. (L2 [P]) Реализовать snapshot + log catch-up для нового follower

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


29. (L2 [P]) Реализовать heartbeat между leader и follower

    **Ответ:** Leader назначает ordered log positions, followers сохраняют/apply идемпотентно и сообщают receive/flush/apply. Promotion требует catch-up/quorum и fencing старого leader; client retries используют operation IDs.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


30. (L2 [P]) Реализовать lag metrics: bytes lag, time lag, apply lag

    **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


31. (L2 [D]) Почему follower сильно отстаёт, хотя сеть не загружена?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


32. (L2 [D]) Почему reads с follower иногда возвращают старые данные?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


33. (L2 [D]) Почему failover привёл к потере последних записей?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


34. (L2 [D]) Почему leader CPU низкий, но lag растёт?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


35. (L2 [D]) Почему один follower тормозит, а остальные нет?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


36. (L3 [T]) Как проектировать replication pipeline: log generation → ship → receive → fsync → apply?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


37. (L3 [T]) Как WAL format влияет на репликацию?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


38. (L3 [T]) Чем logical replication сложнее physical?

    **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


39. (L3 [T]) Как реализовать ordered apply в многопоточной системе?

    **Ответ:** Parallel apply допустим при сохранении dependencies и commit/visibility semantics. Независимые transactions/keys можно обрабатывать параллельно, но arbitrary reorder конфликтующих writes меняет state; проверить barriers и atomic transaction publication.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


40. (L3 [T]) Что такое parallel replication apply?

    **Ответ:** Parallel apply допустим при сохранении dependencies и commit/visibility semantics. Независимые transactions/keys можно обрабатывать параллельно, но arbitrary reorder конфликтующих writes меняет state; проверить barriers и atomic transaction publication.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


41. (L3 [T]) Как replication взаимодействует с MVCC snapshots?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


42. (L3 [T]) Как строится failover-safe commit acknowledgment?

    **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


43. (L3 [T]) Почему page cache Linux может искажать perceived replication durability?

    **Ответ:** Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


44. (L3 [T]) Как network backpressure влияет на replication throughput?

    **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


45. (L3 [T]) Почему leader-follower просто выглядит только на диаграмме, но не в production?

    **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


46. (L3 [P]) Реализовать replication sender/receiver с bounded queues

    **Ответ:** Leader присваивает stream identity/position, sender передаёт framed ordered records, receiver отдельно сохраняет/flush/apply и ACK watermarks. Reconnect resumes from checked position, duplicate replay идемпотентен; gap/timeline mismatch требует controlled resync.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


47. (L3 [P]) Реализовать parallel apply worker pool с сохранением commit order

    **Ответ:** Построить dependencies по transaction/key, независимые jobs параллелить, conflicting effects/commit visibility упорядочить. Checkpoint отмечает лишь применённый безопасный префикс; test out-of-order completion, rollback и crash worker.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


48. (L3 [P]) Реализовать flow control между leader и follower

    **Ответ:** Leader назначает ordered log positions, followers сохраняют/apply идемпотентно и сообщают receive/flush/apply. Promotion требует catch-up/quorum и fencing старого leader; client retries используют operation IDs.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


49. (L3 [P]) Реализовать incremental snapshot transfer

    **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


50. (L3 [P]) Реализовать observability: send lag, receive lag, fsync lag, apply lag

    **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


51. (L3 [D]) Как доказать, что lag вызван disk flush на follower, а не сетью?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


52. (L3 [D]) Почему parallel apply увеличил throughput, но сломал commit ordering?

    **Ответ:** Parallel apply допустим при сохранении dependencies и commit/visibility semantics. Независимые transactions/keys можно обрабатывать параллельно, но arbitrary reorder конфликтующих writes меняет state; проверить barriers и atomic transaction publication. Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


53. (L3 [D]) Почему после switch traffic на follower p99 резко вырос?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


54. (L3 [D]) Как расследовать split-brain после неудачного failover?

    **Ответ:** Split-brain — конфликтующие владельцы/лидеры действуют одновременно. Диагноз требует authority/term/membership и ACK history; наличие двух процессов, называющих себя leader, ещё не доказывает два committed histories при корректном quorum protocol. Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


55. (L3 [D]) Почему snapshot transfer убивает foreground latency?

    **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


56. (L4 [S]) Когда leader-follower — правильный default?

    **Ответ:** ADD/SET NOT NULL/default/type/rename имеют разные lock/rewrite/compatibility последствия по версии СУБД. Отдельно проверить validation scan, table rewrite и старых readers; fast metadata operation всё равно может ждать conflicting lock.

    **Рекомендация:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

    **Источник:** [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


57. (L4 [S]) Как проектировать failover без лишней потери данных?

    **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


58. (L4 [S]) Как решать, можно ли давать reads с followers?

    **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


59. (L4 [S]) Как балансировать durability, latency и failover complexity?

    **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


60. (L4 [S]) Как проектировать replication layer для собственной C++ БД?

    **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


---

## 🔹 Multi-leader

61. (L1 [T]) Что такое multi-leader replication?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


62. (L1 [T]) Чем multi-leader отличается от leader-follower?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


63. (L1 [T]) Почему multi-leader удобен для geo-distributed writes?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


64. (L1 [T]) Почему conflicts здесь неизбежны?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


65. (L1 [T]) Что такое conflict resolution?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


66. (L1 [T]) Почему multi-leader сложнее operationally?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


67. (L1 [T]) Что такое write-write conflict?

    **Ответ:** Write-write conflict — concurrent изменения одного логического объекта; snapshot engines часто отклоняют одного writer. В multi-leader нужно явное resolution, а разные write sets всё ещё могут совместно нарушить invariant через write skew.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


68. (L1 [T]) Что такое last-write-wins?

    **Ответ:** LWW выбирает одну версию по timestamp/tie-break и может терять concurrent updates; clock skew способен выбрать логически старое изменение. Это политика разрешения, а не гарантия сохранения всех бизнес-эффектов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


69. (L1 [T]) Почему clocks влияют на conflict resolution?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


70. (L1 [T]) В каких сценариях multi-leader особенно полезен?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


71. (L1 [P]) Реализовать два leader-а, обменивающихся update log

    **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


72. (L1 [P]) Реализовать conflict detector по key/version

    **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


73. (L1 [P]) Реализовать last-write-wins resolution

    **Ответ:** Записывать origin/event identity и causal/version metadata, различать dominated/concurrent versions. Resolver явно реализует business merge/LWW/CRDT с указанными предпосылками; test concurrent update/delete, duplicate delivery и post-partition reconciliation.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


74. (L1 [P]) Реализовать timestamp-based versioning

    **Ответ:** Series ID/labels→time chunks с bounds/index/validity, WAL+sequence и explicit lateness policy. Encoding имеет version/anchors/overflow checks, windows используют event time/allowed lateness; test raw-oracle queries, duplicate/out-of-order и retention boundaries.

    **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


75. (L1 [P]) Реализовать логирование конфликтов для postmortem

    **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


76. (L2 [T]) Почему LWW может терять данные?

    **Ответ:** LWW выбирает одну версию по timestamp/tie-break и может терять concurrent updates; clock skew способен выбрать логически старое изменение. Это политика разрешения, а не гарантия сохранения всех бизнес-эффектов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


77. (L2 [T]) Что такое causal ordering?

    **Ответ:** Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


78. (L2 [T]) Почему wall clock — плохой источник истины?

    **Ответ:** Wall clock может иметь skew и скачки; NTP не даёт единого строгого порядка событий. Для локальных intervals используют monotonic clock, для authority/order — согласованные versions/epochs и нужные bounded-time assumptions.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Jepsen: Consistency models](https://jepsen.io/consistency)


79. (L2 [T]) Что такое vector clocks?

    **Ответ:** Vector versions могут различать causal order и concurrency; Lamport clock даёт совместимый причинный порядок, но не детектирует concurrency сам. Version metadata и resolver не заменяют бизнес-правило слияния конфликтов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


80. (L2 [T]) Чем business conflict отличается от storage-level conflict?

    **Ответ:** Storage-level merge/transaction success не доказывает бизнес-инвариант. Два допустимых состояния/операции по отдельности могут быть недопустимы совместно; правило уникальности/баланса должно быть выражено в соответствующей atomic/coordinated границе.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


81. (L2 [T]) Почему network partition делает multi-leader особенно tricky?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


82. (L2 [T]) Как replication topology влияет на convergence?

    **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


83. (L2 [T]) Почему loops в replication graph опасны?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


84. (L2 [T]) Что такое idempotent apply в multi-leader?

    **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)


85. (L2 [T]) Почему schema changes в multi-leader сложнее?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


86. (L2 [P]) Реализовать vector clock для объекта

    **Ответ:** Реализовать map key→replacement metadata и byte capacity; hit обновляет policy, victim исключает pinned/in-flight entries. Dirty victim flush следует WAL-before-data; test scan pollution, concurrency, failed writeback и exhaustion.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


87. (L2 [P]) Реализовать conflict queue для ручного разбора

    **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


88. (L2 [P]) Реализовать idempotent replay replicated updates

    **Ответ:** Хранить durable operation/event ID с UNIQUE и менять effect+inbox/result в одной транзакции. Повтор возвращает прежний outcome, другой payload с тем же ID отклоняется; crash между commit и ACK не должен повторять эффект.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


89. (L2 [P]) Реализовать anti-entropy sync между узлами

    **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


90. (L2 [P]) Реализовать detection циклической репликации

    **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


91. (L2 [D]) Почему данные “сходятся”, но пользователь видит потерянные обновления?

    **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


92. (L2 [D]) Почему конфликтов резко стало больше после открытия нового региона?

    **Ответ:** Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


93. (L2 [D]) Почему одна и та же запись переписывается по кругу?

    **Ответ:** Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


94. (L2 [D]) Почему clocks drift привёл к странным LWW результатам?

    **Ответ:** LWW выбирает одну версию по timestamp/tie-break и может терять concurrent updates; clock skew способен выбрать логически старое изменение. Это политика разрешения, а не гарантия сохранения всех бизнес-эффектов. Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


95. (L2 [D]) Почему один DC постоянно “проигрывает” в conflict resolution?

    **Ответ:** Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


96. (L3 [T]) Как проектировать multi-leader replication без бесконечных loops?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


97. (L3 [T]) Как CRDT-подход соотносится с multi-leader storage?

    **Ответ:** CRDT использует доказанные merge/operation свойства для сходимости при заданных условиях доставки/идентичности. Это подходит не всем инвариантам: uniqueness и произвольные ограничения баланса не возникают автоматически.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


98. (L3 [T]) Как строить causality tracking с приемлемым overhead?

    **Ответ:** Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


99. (L3 [T]) Как multi-leader влияет на secondary indexes и uniqueness constraints?

    **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


100. (L3 [T]) Почему uniqueness в multi-leader особенно трудна?

     **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


101. (L3 [T]) Как topology-aware replication снижает latency и conflict cost?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


102. (L3 [T]) Как проектировать convergence guarantees?

     **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


103. (L3 [T]) Как строить audit trail для конфликтов?

     **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


104. (L3 [T]) Как работает async reconciliation в multi-leader системе?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


105. (L3 [T]) Когда multi-leader лучше заменить архитектурой “single-writer per shard”?

     **Ответ:** Несколько лидеров принимают локальные изменения; concurrent writes могут конфликтовать. Timestamp last-write-wins способен потерять бизнес-обновление, поэтому нужны versions/conflict semantics и защита глобальных инвариантов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


106. (L3 [P]) Реализовать anti-entropy gossip sync

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


107. (L3 [P]) Реализовать conflict resolver plug-in API

     **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


108. (L3 [P]) Реализовать per-key ownership policy для снижения конфликтов

     **Ответ:** Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


109. (L3 [P]) Реализовать metrics: conflict rate, convergence lag, replay lag

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


110. (L3 [P]) Реализовать симулятор partitions и conflict storms

     **Ответ:** Fault harness должен контролировать schedules и persistence/network boundaries, сохранять seed/trace и проверять инварианты, а не только успешный restart. Отдельно моделировать process crash, power-loss, delay/loss/reorder и stale clients. Назначать origin/event ID и version metadata, предотвращать replication loops и duplicate effects. Сохранять conflicting versions либо применять доказанный merge/CRDT; test concurrent updates/delete и повторную доставку после partition.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


111. (L3 [D]) Как доказать, что проблема в topology loops, а не в apply bug?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition. Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


112. (L3 [D]) Почему after reconciliation данные формально консистентны, но бизнес-логика сломана?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol. Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


113. (L3 [D]) Почему conflict resolver стал bottleneck CPU?

     **Ответ:** Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


114. (L3 [D]) Почему anti-entropy traffic неожиданно съел весь межрегиональный bandwidth?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


115. (L3 [D]) Как расследовать редкий conflict, зависящий от порядка доставки событий?

     **Ответ:** Собрать per-key origin/version history, replication paths и resolver decisions. Проверить clock skew, LWW tie-break, duplicate delivery и tombstone retention; одинаковые final bytes не доказывают сохранение всех нужных эффектов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


116. (L4 [S]) Когда multi-leader оправдан, а когда это trap?

     **Ответ:** Выбирать для независимых областей записи/offline и явной конфликтной семантики. Балансы, uniqueness и некоммутативные операции требуют single owner/coordination либо изменения модели данных, а не надежды на eventual merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


117. (L4 [S]) Как минимизировать conflict surface на уровне продуктовой модели данных?

     **Ответ:** Выбирать для независимых областей записи/offline и явной конфликтной семантики. Балансы, uniqueness и некоммутативные операции требуют single owner/coordination либо изменения модели данных, а не надежды на eventual merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


118. (L4 [S]) Когда выбрать async conflict resolution, а когда синхронный отказ записи?

     **Ответ:** Выбирать для независимых областей записи/offline и явной конфликтной семантики. Балансы, uniqueness и некоммутативные операции требуют single owner/coordination либо изменения модели данных, а не надежды на eventual merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


119. (L4 [S]) Как объяснить командам ограничения multi-leader до запуска в production?

     **Ответ:** Выбирать для независимых областей записи/offline и явной конфликтной семантики. Балансы, uniqueness и некоммутативные операции требуют single owner/coordination либо изменения модели данных, а не надежды на eventual merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


120. (L4 [S]) Как проектировать geo-write систему так, чтобы не утонуть в reconciliation?

     **Ответ:** Validation проверяет completeness и values/invariants на согласованной boundary; равное число строк не исключает разные значения/дубликаты. Comparisons учитывают versions, concurrent writes и canonical encoding, а failures требуют repair/retry protocol.

     **Рекомендация:** Выбирать для независимых областей записи/offline и явной конфликтной семантики. Балансы, uniqueness и некоммутативные операции требуют single owner/coordination либо изменения модели данных, а не надежды на eventual merge.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


---

## 🔹 Leaderless (Dynamo-style)

121. (L1 [T]) Что такое leaderless replication?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


122. (L1 [T]) Чем leaderless отличается от leader-follower и multi-leader?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


123. (L1 [T]) Что такое coordinator node?

     **Ответ:** Coordinator маршрутизирует/собирает результаты участников, но не обязательно является data owner. После его crash outcome может быть неизвестен клиенту при частично/полностью выполненной записи; durable decision/version history и idempotency определяют recovery.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


124. (L1 [T]) Что такое replication factor N?

     **Ответ:** N — число назначенных replicas объекта в заявленной модели, не автоматически число независимых failure domains или обязательных durable ACK. Реальные copies могут временно отличаться из-за migration/repair/fallback.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


125. (L1 [T]) Что такое quorum read и quorum write?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


126. (L1 [T]) Что означают параметры N, R, W?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


127. (L1 [T]) Почему при `R + W > N` ожидается лучшая согласованность?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


128. (L1 [T]) Что такое sloppy quorum?

     **Ответ:** Quorum пересечение зависит от конкретного replica set/topology. Local quorum не обещает свежесть в другом регионе, sloppy quorum может ждать другой набор nodes; простое R+W>N без этих предпосылок вводит в заблуждение.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


129. (L1 [T]) Что такое hinted handoff?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


130. (L1 [T]) Что такое read repair?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


131. (L1 [P]) Реализовать coordinator, рассылающий write на N реплик

     **Ответ:** Определить N/R/W, placement и version comparison; coordinator сохраняет версии/ACK statuses. Retry имеет event ID, repair ограничен budget; проверить partial writes, crash coordinator и возврат долгоживущей stale replica.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


132. (L1 [P]) Реализовать quorum write с ожиданием W ACK

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


133. (L1 [P]) Реализовать quorum read с чтением R реплик

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


134. (L1 [P]) Реализовать read repair

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


135. (L1 [P]) Реализовать hinted handoff queue

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


136. (L2 [T]) Почему `R + W > N` не гарантирует строгую консистентность в реальном мире?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


137. (L2 [T]) Что такое version vector в leaderless системе?

     **Ответ:** Vector versions могут различать causal order и concurrency; Lamport clock даёт совместимый причинный порядок, но не детектирует concurrency сам. Version metadata и resolver не заменяют бизнес-правило слияния конфликтов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


138. (L2 [T]) Почему concurrent writes могут порождать siblings?

     **Ответ:** B-link/right sibling links и high keys позволяют найти корректную страницу после concurrent split без полного удержания пути. Split publication order и reclamation всё равно требуют доказанного concurrency protocol.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


139. (L2 [T]) Что такое anti-entropy repair?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


140. (L2 [T]) Почему sloppy quorum помогает availability, но усложняет consistency?

     **Ответ:** Quorum пересечение зависит от конкретного replica set/topology. Local quorum не обещает свежесть в другом регионе, sloppy quorum может ждать другой набор nodes; простое R+W>N без этих предпосылок вводит в заблуждение.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


141. (L2 [T]) Что такое coordinator failure during write?

     **Ответ:** Coordinator маршрутизирует/собирает результаты участников, но не обязательно является data owner. После его crash outcome может быть неизвестен клиенту при частично/полностью выполненной записи; durable decision/version history и idempotency определяют recovery.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


142. (L2 [T]) Как leaderless replication ведёт себя при network partition?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


143. (L2 [T]) Почему tombstones особенно важны в leaderless KV store?

     **Ответ:** Tombstone подавляет старые версии ключа, а не сразу удаляет их bytes. Удалять его безопасно лишь когда старое значение не может воскреснуть из lower level/replica/snapshot/replay; TTL само это не доказывает.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


144. (L2 [T]) Как read repair влияет на tail latency?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


145. (L2 [T]) Почему hot keys особенно болезненны для quorum systems?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


146. (L2 [P]) Реализовать version vectors

     **Ответ:** Записывать origin/event identity и causal/version metadata, различать dominated/concurrent versions. Resolver явно реализует business merge/LWW/CRDT с указанными предпосылками; test concurrent update/delete, duplicate delivery и post-partition reconciliation.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


147. (L2 [P]) Реализовать sibling detection и merge

     **Ответ:** B-link/right sibling links и high keys позволяют найти корректную страницу после concurrent split без полного удержания пути. Split publication order и reclamation всё равно требуют доказанного concurrency protocol. Определить N/R/W, placement и version comparison; coordinator сохраняет версии/ACK statuses. Retry имеет event ID, repair ограничен budget; проверить partial writes, crash coordinator и возврат долгоживущей stale replica.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


148. (L2 [P]) Реализовать anti-entropy background repair

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


149. (L2 [P]) Реализовать sloppy quorum fallback

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


150. (L2 [P]) Реализовать per-replica freshness tracking

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


151. (L2 [D]) Почему quorum read иногда возвращает старую версию?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки. По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


152. (L2 [D]) Почему hinted handoff queue бесконечно растёт?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


153. (L2 [D]) Почему read repair улучшил correctness, но ухудшил p99 latency?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


154. (L2 [D]) Почему часть keys стала иметь множество siblings?

     **Ответ:** B-link/right sibling links и high keys позволяют найти корректную страницу после concurrent split без полного удержания пути. Split publication order и reclamation всё равно требуют доказанного concurrency protocol. По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


155. (L2 [D]) Почему coordinator стал bottleneck при горячих ключах?

     **Ответ:** По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


156. (L3 [T]) Как проектировать coordinator path без лишних копий и сериализации?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


157. (L3 [T]) Как vector clocks масштабируются на большое число writers?

     **Ответ:** Vector versions могут различать causal order и concurrency; Lamport clock даёт совместимый причинный порядок, но не детектирует concurrency сам. Version metadata и resolver не заменяют бизнес-правило слияния конфликтов.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


158. (L3 [T]) Как Merkle trees помогают anti-entropy?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. Merkle tree агрегирует hashes диапазонов, позволяя найти различающиеся поддеревья без полного обмена данных. Нужны одинаковые key ranges/canonical encoding и сравнимые snapshots; hash mismatch не выбирает правильного победителя.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


159. (L3 [T]) Как leaderless replication сочетается с consistent hashing?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


160. (L3 [T]) Как replication factor и topology влияют на failure tolerance?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


161. (L3 [T]) Почему “eventual consistency” — это не одна конкретная гарантия?

     **Ответ:** Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


162. (L3 [T]) Как проектировать bounded staleness поверх leaderless core?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


163. (L3 [T]) Как строить observability для quorum failures и repair debt?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


164. (L3 [T]) Почему coordinator locality сильно влияет на latency?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


165. (L3 [T]) Когда Dynamo-style схема лучше, чем consensus-based replication?

     **Ответ:** Leaderless схема посылает операции нескольким replicas и собирает R/W acknowledgements. Versions, read repair, hinted handoff и anti-entropy определяют сходимость; R+W>N само по себе не даёт linearizability.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


166. (L3 [P]) Реализовать Merkle tree diff для anti-entropy

     **Ответ:** Хранить versioned repair tasks с bounded retries/bytes и durable progress, compare одинаковые key ranges/снимки. Repair выбирает разрешённый resolver исход, сохраняет tombstones и не перетирает новую version старой; test interrupted repair и cold keys.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


167. (L3 [P]) Реализовать dynamic quorum tuning

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


168. (L3 [P]) Реализовать background repair scheduler

     **Ответ:** Определить N/R/W, placement и version comparison; coordinator сохраняет версии/ACK statuses. Retry имеет event ID, repair ограничен budget; проверить partial writes, crash coordinator и возврат долгоживущей stale replica.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


169. (L3 [P]) Реализовать quorum trace logging по ключу

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


170. (L3 [P]) Реализовать симулятор partitions, sloppy quorum и handoff recovery

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


171. (L3 [D]) Как доказать, что проблема в repair debt, а не в hash ring placement?

     **Ответ:** Consistent/rendezvous placement уменьшает ключи, меняющие owner при membership change. Virtual nodes сглаживают распределение множества keys, но не делят один hot key; для replicas нужно учитывать разные physical/failure-domain owners. По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


172. (L3 [D]) Почему после recovery ноды stale data держится дольше ожидаемого?

     **Ответ:** По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


173. (L3 [D]) Почему quorum формально достигнут, но клиент всё равно видит старое значение?

     **Ответ:** По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


174. (L3 [D]) Как расследовать write loss при coordinator crash?

     **Ответ:** По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


175. (L3 [D]) Почему anti-entropy трафик неожиданно saturate-ит диски и сеть?

     **Ответ:** Read repair чинит обнаруженные версии при чтении, anti-entropy сравнивает replicas в фоне, hinted handoff доставляет временно недоступному владельцу. Ни один по отдельности не гарантирует быстрое восстановление всех холодных ключей. По ключу сопоставить replica set/versions, successful ACK durability, hinted handoff и repair backlog. Проверить sloppy quorum, concurrent writes, resolver и membership churn; «quorum собран» не означает корректный бизнес-merge.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


176. (L4 [S]) Когда leaderless replication оправдана?

     **Ответ:** Подходит при допустимых временных версиях/конфликтах и доступности независимых writes. Установить exact read/write semantics, local/global quorum и repair SLO; для строгого single-value порядка consensus обычно проще рассуждать.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


177. (L4 [S]) Как выбирать N/R/W под разные SLA?

     **Ответ:** Подходит при допустимых временных версиях/конфликтах и доступности независимых writes. Установить exact read/write semantics, local/global quorum и repair SLO; для строгого single-value порядка consensus обычно проще рассуждать.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


178. (L4 [S]) Когда eventual consistency подходит продукту, а когда нет?

     **Ответ:** Eventual consistency обещает сходимость при прекращении updates и восстановлении обмена в рамках resolver. Causal consistency дополнительно сохраняет причинные зависимости наблюдений; верхняя граница lag из этих названий не следует.

     **Рекомендация:** Подходит при допустимых временных версиях/конфликтах и доступности независимых writes. Установить exact read/write semantics, local/global quorum и repair SLO; для строгого single-value порядка consensus обычно проще рассуждать.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


179. (L4 [S]) Как минимизировать conflict/repair complexity в Dynamo-style системе?

     **Ответ:** Подходит при допустимых временных версиях/конфликтах и доступности независимых writes. Установить exact read/write semantics, local/global quorum и repair SLO; для строгого single-value порядка consensus обычно проще рассуждать.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


180. (L4 [S]) Как объяснять командам реальные guarantees quorum-based replication?

     **Ответ:** Подходит при допустимых временных версиях/конфликтах и доступности независимых writes. Установить exact read/write semantics, local/global quorum и repair SLO; для строгого single-value порядка consensus обычно проще рассуждать.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


---

## 🔹 Sync vs async replication

181. (L1 [T]) Что такое synchronous replication?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Пример:** Получить record по сети, fsync его на replica и применить в readable state — три разные boundaries.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


182. (L1 [T]) Что такое asynchronous replication?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


183. (L1 [T]) Чем они отличаются с точки зрения commit path?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


184. (L1 [T]) Почему sync replication обычно увеличивает write latency?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


185. (L1 [T]) Почему async replication допускает replication lag?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


186. (L1 [T]) Что такое semi-sync replication?

     **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


187. (L1 [T]) Почему async replication может привести к потере последних записей при failover?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


188. (L1 [T]) Почему sync replication может снижать availability?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


189. (L1 [T]) Как выбор sync/async зависит от расстояния между DC?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


190. (L1 [T]) Почему не существует бесплатной strong durability across regions?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


191. (L1 [P]) Реализовать commit, который ждёт ACK от replica

     **Ответ:** Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


192. (L1 [P]) Реализовать async replication queue

     **Ответ:** Задать ACK predicate по local/replica durable/apply positions, явно конфигурировать required replica set и failure policy. Waiters просыпаются только по выполненному predicate/error, никакого silent async fallback; test slow/lost replica и promotion.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


193. (L1 [P]) Реализовать configurable mode: sync / async / semi-sync

     **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO. Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


194. (L1 [P]) Реализовать таймаут ожидания replica ACK

     **Ответ:** Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


195. (L1 [P]) Реализовать метрики commit latency по режимам

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


196. (L2 [T]) Что именно должен подтвердить follower при sync replication: receive, fsync или apply?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


197. (L2 [T]) Почему receive ACK и durable ACK — не одно и то же?

     **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


198. (L2 [T]) Что такое commit quorum?

     **Ответ:** Read quorum ждёт заданный R набор ответов и разрешает версии, write/commit quorum — заданные W/majority подтверждения по своему protocol. Смысл ACK, membership и тип coordination обязательны; универсальная формула не заменяет эти предпосылки.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)


199. (L2 [T]) Как sync replication влияет на throughput?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


200. (L2 [T]) Почему p99 latency в sync mode зависит от самой медленной replica?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


201. (L2 [T]) Как semi-sync уменьшает риск loss без полного sync penalty?

     **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


202. (L2 [T]) Почему async queue может стать скрытым memory bomb?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


203. (L2 [T]) Как backpressure строится для async replication?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


204. (L2 [T]) Почему batching полезен и в sync, и в async режимах?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


205. (L2 [T]) Как sync/async влияет на failover semantics?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


206. (L2 [P]) Реализовать sync ACK после durable flush

     **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity. Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


207. (L2 [P]) Реализовать batching для replicated commits

     **Ответ:** Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


208. (L2 [P]) Реализовать bounded async queue с backpressure

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt. Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


209. (L2 [P]) Реализовать semi-sync policy “wait for 1 durable replica”

     **Ответ:** Задать ACK predicate по local/replica durable/apply positions, явно конфигурировать required replica set и failure policy. Waiters просыпаются только по выполненному predicate/error, никакого silent async fallback; test slow/lost replica и promotion.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


210. (L2 [P]) Реализовать admission control при росте replication lag

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


211. (L2 [D]) Почему переключение на sync replication убило throughput?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


212. (L2 [D]) Почему async mode периодически теряет bursts записей при аварии?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


213. (L2 [D]) Почему commit latency “зубчатая” в semi-sync?

     **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO. Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


214. (L2 [D]) Почему очередь async replication растёт быстрее, чем успевает опустошаться?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


215. (L2 [D]) Почему одна медленная replica деградирует весь cluster commit path?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


216. (L3 [T]) Как проектировать durable ACK protocol?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


217. (L3 [T]) Как Linux fsync, page cache и storage write cache влияют на perceived sync replication?

     **Ответ:** Persistence зависит от flush/FUA/barrier пути до контроллера и его power-loss поведения. O_DIRECT не выключает volatile device cache, а VM/hypervisor может добавить ещё один слой с собственными гарантиями.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


218. (L3 [T]) Как flow control связывает foreground writes и background replication?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


219. (L3 [T]) Как групповые коммиты работают при sync replication?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


220. (L3 [T]) Как строить graceful degradation между sync и async режимами?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


221. (L3 [T]) Как управлять tail latency в geo-sync репликации?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


222. (L3 [T]) Как проектировать safe failover для async system?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


223. (L3 [T]) Как observability должна разделять send lag, durable lag и apply lag?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


224. (L3 [T]) Почему async replication часто выглядит “быстрой”, пока не случится failover?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


225. (L3 [T]) Как выбирать sync level для разных таблиц/тенантов/классов данных?

     **Ответ:** Synchronous ACK ждёт оговорённого состояния реплик: receive, durable flush или apply — разные границы. Async отвечает раньше и допускает lag/потерю неподхваченного хвоста при failover; sync latency зависит от quorum RTT/диска.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


226. (L3 [P]) Реализовать commit quorum с разными типами ACK

     **Ответ:** Симулировать replica sets, версии и receive/flush/apply ACK, configurable N/R/W/topology и coordinator crash. Checker использует заявленную модель истории, учитывает partial writes, retries/sloppy-local quorums; одно R+W>N не служит oracle.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


227. (L3 [P]) Реализовать adaptive batching под network RTT

     **Ответ:** Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


228. (L3 [P]) Реализовать failover gate, запрещающий promotion слишком stale replica

     **Ответ:** Выбрать допустимую candidate по committed/durable history, получить новую authority и fence старого writer до открытия записи. Обновить routes/clients, проверить RPO и catch-up/rollback divergent tail; test concurrent old/new clients.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


229. (L3 [P]) Реализовать lag-aware routing и write admission

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


230. (L3 [P]) Реализовать симулятор sync/async trade-offs на разных RTT и disk latency

     **Ответ:** Fault harness должен контролировать schedules и persistence/network boundaries, сохранять seed/trace и проверять инварианты, а не только успешный restart. Отдельно моделировать process crash, power-loss, delay/loss/reorder и stale clients. Для каждого log position отслеживать local durable и replica receive/flush/apply watermarks, ACK выдавать по заданному predicate. При недоступности sync replicas блокировать/отказывать либо явно переключать контракт; не делать silent downgrade.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


231. (L3 [D]) Как доказать, что problem root cause — slow durable ACK, а не CPU?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


232. (L3 [D]) Почему semi-sync иногда ведёт себя почти как async?

     **Ответ:** Semi-sync — продуктовый термин, обычно означает ожидание части replica ACK вместо всех стадий apply. Нужно назвать точное условие receive/flush, число replicas и fallback; оно не универсально равно zero RPO. Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


233. (L3 [D]) Почему после failover “успешно подтверждённые” записи пропали?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


234. (L3 [D]) Как расследовать ложное ощущение durability из-за storage cache?

     **Ответ:** Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


235. (L3 [D]) Почему adaptive mode oscillates между sync и async?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева. Проверить конфигурацию required replicas, тип подтверждения, фактические watermarks и promotion candidate. Разделить ACK transport, durable storage и visibility, затем воспроизвести crash/power-loss на каждой boundary.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


236. (L4 [S]) Как выбирать sync vs async по умолчанию для продукта?

     **Ответ:** Выбирать из допустимого RPO, p99 и fault domains. Нулевой RPO в выбранной модели отказов требует достаточного durable replication до ACK и безопасного failover, а не просто наличия нескольких узлов.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


237. (L4 [S]) Когда стоит давать пользователям разные durability tiers?

     **Ответ:** Выбирать из допустимого RPO, p99 и fault domains. Нулевой RPO в выбранной модели отказов требует достаточного durable replication до ACK и безопасного failover, а не просто наличия нескольких узлов.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


238. (L4 [S]) Как проектировать multi-region replication без разрушения latency SLA?

     **Ответ:** Выбирать из допустимого RPO, p99 и fault domains. Нулевой RPO в выбранной модели отказов требует достаточного durable replication до ACK и безопасного failover, а не просто наличия нескольких узлов.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


239. (L4 [S]) Как документировать реальные guarantees commit acknowledgment?

     **Ответ:** ACK должен соответствовать явно названной boundary: accepted, written, locally durable, replica durable или applied. Потерянный ответ даёт неопределённый клиентский исход, даже если эффект committed; безопасный retry требует operation identity.

     **Рекомендация:** Выбирать из допустимого RPO, p99 и fault domains. Нулевой RPO в выбранной модели отказов требует достаточного durable replication до ACK и безопасного failover, а не просто наличия нескольких узлов.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


240. (L4 [S]) Как объяснить бизнесу цену “не терять ни одной записи”?

     **Ответ:** Выбирать из допустимого RPO, p99 и fault domains. Нулевой RPO в выбранной модели отказов требует достаточного durable replication до ACK и безопасного failover, а не просто наличия нескольких узлов.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

## 🔹 Replication lag

241. (L1 [T]) Что такое replication lag?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Пример:** Received LSN=1000, flushed=950, applied=900: bottleneck/последствия нельзя описать одним словом «реплика получила».

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


242. (L1 [T]) В каких единицах его можно измерять?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


243. (L1 [T]) Чем send lag отличается от apply lag?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


244. (L1 [T]) Почему lag важен для correctness, а не только для performance?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


245. (L1 [T]) Почему follower может отставать даже при низком network RTT?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


246. (L1 [T]) Почему large transactions часто создают lag spikes?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


247. (L1 [T]) Как lag влияет на stale reads?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


248. (L1 [T]) Почему lag опасен для failover?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


249. (L1 [T]) Что такое replica freshness?

     **Ответ:** Freshness — насколько возвращаемое состояние отстаёт от нужной committed boundary, измеряемой version/LSN/time по выбранному SLI. Быстрый ответ/health check не доказывает свежесть, а timestamp последнего apply без source activity вводит в заблуждение.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


250. (L1 [T]) Почему one-number lag metric почти всегда недостаточна?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


251. (L1 [P]) Реализовать измерение lag в байтах логов

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


252. (L1 [P]) Реализовать измерение lag по времени коммита

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


253. (L1 [P]) Реализовать отдельные метрики receive/apply lag

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


254. (L1 [P]) Реализовать health-check replica freshness

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


255. (L1 [P]) Реализовать alert на превышение lag threshold

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


256. (L2 [T]) Какие основные причины replication lag: network, disk, CPU, lock contention, apply serialization?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Пример:** T1 держит X(A) и ждёт B, T2 держит X(B) и ждёт A: wait-for graph содержит цикл.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


257. (L2 [T]) Почему large batch write может создать хвост lag на минуты?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


258. (L2 [T]) Почему DDL/maintenance операции часто ломают lag?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


259. (L2 [T]) Как single-threaded apply ограничивает throughput?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


260. (L2 [T]) Почему lag не всегда монотонно убывает после всплеска?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


261. (L2 [T]) Как lag влияет на read routing policy?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


262. (L2 [T]) Почему “реплика жива” и “реплика безопасна для чтения” — разные состояния?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


263. (L2 [T]) Что такое delayed replica и зачем она нужна?

     **Ответ:** Delayed replica намеренно задерживает apply, оставляя окно перед ошибочным изменением. Она полезна для некоторых logical incidents, но не заменяет независимый backup и должна исключаться из read/failover путей, требующих свежести.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


264. (L2 [T]) Почему clock skew мешает time-based lag measurement?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Wall clock может иметь skew и скачки; NTP не даёт единого строгого порядка событий. Для локальных intervals используют monotonic clock, для authority/order — согласованные versions/epochs и нужные bounded-time assumptions.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Raft paper](https://raft.github.io/raft.pdf); [Jepsen: Consistency models](https://jepsen.io/consistency)


265. (L2 [T]) Как lag взаимодействует с checkpoint/vacuum/compaction на replica?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


266. (L2 [P]) Реализовать lag-aware read router

     **Ответ:** Versioned map хранит ranges/slots→owners и epochs; client/router кеширует её, сервер отвергает stale authority. Lookup проверяет boundaries, retry обновляет map в пределах deadline; test migration, missing range и old clients.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


267. (L2 [P]) Реализовать throttle writes при росте lag

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


268. (L2 [P]) Реализовать apply worker backlog queue

     **Ответ:** Построить dependencies по transaction/key, независимые jobs параллелить, conflicting effects/commit visibility упорядочить. Checkpoint отмечает лишь применённый безопасный префикс; test out-of-order completion, rollback и crash worker.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


269. (L2 [P]) Реализовать replica admission policy: safe/unsafe for reads

     **Ответ:** Admission control ограничивает принятую/конкурентную работу до дорогих стадий. Ограниченный queue/reject сохраняет полезный throughput при saturation; бесконечные waits/retries не добавляют capacity и ухудшают tail. Экспортировать source/sent/received/flushed/applied positions и timestamps, queue bytes/age и apply errors. Для read-your-writes передавать required position и ждать/маршрутизировать к owner, соблюдая общий deadline.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


270. (L2 [P]) Реализовать benchmark lag under bursty workload

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


271. (L2 [D]) Почему lag растёт только ночью?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


272. (L2 [D]) Почему replica догоняет днём, но не ночью?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


273. (L2 [D]) Почему после large transaction lag не падает часами?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


274. (L2 [D]) Почему reads с replicas иногда внезапно “старее”, чем обычно?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


275. (L2 [D]) Почему lag вырос после включения compression/encryption?

     **Ответ:** Шифрование защищает данные только при корректном key lifecycle и доступах; потеря KMS/key может сделать исправный backup невосстановимым. Catalog должен знать key/version, а restore drill проверять реальные permissions и rotation. Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться. Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


276. (L3 [T]) Как строить detailed lag pipeline observability?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


277. (L3 [T]) Как распараллелить apply, не нарушая ordering semantics?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


278. (L3 [T]) Как lag связан с Linux I/O scheduler, page cache и fsync latency?

     **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing.

     **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


279. (L3 [T]) Как network buffering и TCP window влияют на perceived lag?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


280. (L3 [T]) Как проектировать bounded-staleness reads?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


281. (L3 [T]) Как оценивать failover safety по lag metrics?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


282. (L3 [T]) Почему lag должен быть per-shard/per-table/per-tenant, а не только per-node?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


283. (L3 [T]) Как отличать receive backlog от apply contention?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


284. (L3 [T]) Как hot keys и lock conflicts на replica увеличивают lag?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


285. (L3 [T]) Почему lag — это often symptom, not root cause?

     **Ответ:** Lag бывает на передаче, durable flush и replay; их последствия различаются. Возраст последнего replay при отсутствии новых записей не равен отставанию, а bytes lag не переводятся во время без профиля потока.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


286. (L3 [P]) Реализовать pipeline tracing: generate → send → receive → durable → apply

     **Ответ:** Экспортировать source/sent/received/flushed/applied positions и timestamps, queue bytes/age и apply errors. Для read-your-writes передавать required position и ждать/маршрутизировать к owner, соблюдая общий deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


287. (L3 [P]) Реализовать replay scheduler для parallel apply

     **Ответ:** Построить dependencies по transaction/key, независимые jobs параллелить, conflicting effects/commit visibility упорядочить. Checkpoint отмечает лишь применённый безопасный префикс; test out-of-order completion, rollback и crash worker.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


288. (L3 [P]) Реализовать lag heatmap по shards/tenants

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


289. (L3 [P]) Реализовать bounded-staleness read API

     **Ответ:** Экспортировать source/sent/received/flushed/applied positions и timestamps, queue bytes/age и apply errors. Для read-your-writes передавать required position и ждать/маршрутизировать к owner, соблюдая общий deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


290. (L3 [P]) Реализовать симулятор lag under disk/network/CPU bottlenecks

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


291. (L3 [D]) Как доказать, что lag вызван contention на apply lock, а не сетью?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


292. (L3 [D]) Почему replica metrics выглядят нормальными, но failover unsafe?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


293. (L3 [D]) Как расследовать lag spike каждые 5 минут?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


294. (L3 [D]) Почему после оптимизации network lag уменьшился, а stale reads нет?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


295. (L3 [D]) Почему одна shard стабильно отстаёт при одинаковом объёме данных?

     **Ответ:** Сравнить production rate с receive/apply rate, CPU/I/O/network, long queries/locks и retained WAL. Найти первую отстающую стадию; увеличение replicas может повысить fan-out и нагрузку leader.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


296. (L4 [S]) Какие lag SLO реально полезны, а какие вводят в заблуждение?

     **Ответ:** Задать freshness SLO/alert и max допустимого lag для promotion/чтений. Lagging replica исключается из строгого read path; catch-up должен быть rate-limited и не разрушать foreground latency.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


297. (L4 [S]) Как строить read-from-replica стратегию без скрытых correctness багов?

     **Ответ:** Задать freshness SLO/alert и max допустимого lag для promotion/чтений. Lagging replica исключается из строгого read path; catch-up должен быть rate-limited и не разрушать foreground latency.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


298. (L4 [S]) Как проектировать replication так, чтобы lag был предсказуемым?

     **Ответ:** Задать freshness SLO/alert и max допустимого lag для promotion/чтений. Lagging replica исключается из строгого read path; catch-up должен быть rate-limited и не разрушать foreground latency.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


299. (L4 [S]) Как решать, когда отставшую replica надо исключать из serving path?

     **Ответ:** Задать freshness SLO/alert и max допустимого lag для promotion/чтений. Lagging replica исключается из строгого read path; catch-up должен быть rate-limited и не разрушать foreground latency.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


300. (L4 [S]) Как объяснять продуктовым командам, что low average lag не равен strong consistency?

     **Ответ:** Linearizability задаёт единый порядок операций с учётом real-time завершения. Serializable задаёт эквивалентность последовательным транзакциям; «strong consistency» без уточнения модели слишком неоднозначно.

     **Рекомендация:** Задать freshness SLO/alert и max допустимого lag для promotion/чтений. Lagging replica исключается из строгого read path; catch-up должен быть rate-limited и не разрушать foreground latency.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Чем replication отличается от sharding в терминах целей и trade-offs?

     **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


302. (L2 [T]) Как replication взаимодействует с WAL, checkpoints и recovery?

     **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


303. (L2 [T]) Почему MVCC и replication вместе создают дополнительные сложности для vacuum/GC?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Пример:** Snapshot S видит версию commit_seq=10 и не видит новую commit_seq=20, если её boundary равна 15.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


304. (L2 [T]) Как leader election связан с failover replication topology?

     **Ответ:** Replica count нужно считать вместе с независимыми failure domains. Три копии в одном rack не переживают его потерю; quorum placement меняет RTT, failover capacity и доступность при regional partition.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


305. (L2 [T]) Почему reads from replica ломают read-your-writes и monotonic reads?

     **Ответ:** Read-your-writes требует, чтобы сессия после своей записи не читала более старую версию. Это можно обеспечить leader routing, required LSN/version wait либо session token, не обещая глобальную linearizability всем клиентам.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


306. (L2 [T]) Как replication влияет на secondary indexes?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


307. (L2 [T]) Почему unique constraints особенно сложны в multi-leader и leaderless системах?

     **Ответ:** Leader упорядочивает запись и передаёт log followers; читатели реплик могут отставать при async replication. Сохранность после failover зависит от flush/ACK policy и выбора актуального нового лидера.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


308. (L2 [T]) Как Linux network stack, socket buffers и TCP backpressure влияют на replication?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


309. (L2 [T]) Как allocator, memcpy и serialization overhead становятся bottleneck в replication sender/receiver?

     **Ответ:** Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


310. (L2 [T]) Почему observability по replication pipeline обязательна для senior/staff уровня?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


311. (L2 [P]) Реализовать end-to-end benchmark: leader write → replicate → follower read

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


312. (L2 [P]) Реализовать dashboard: commit rate, lag, ACK latency, failover safety margin

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos test: packet loss, delayed ACK, follower disk stall

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


314. (L2 [P]) Реализовать verification tool: compare leader and replica state by checksum

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


315. (L2 [P]) Реализовать tenant-aware replication throttling

     **Ответ:** Token bucket по реальной единице bytes/IO/operation с monotonic time, capacity/burst и bounded wait/cancel. Разделить foreground/background budgets, следить за backlog trend: соблюдённый лимит не гарантирует достаточную sustainable capacity.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


316. (L3 [D]) Почему после включения репликации p50 почти не изменился, а p99 резко вырос?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


317. (L3 [D]) Почему cluster выдерживает обычный трафик, но ломается на failover drill?

     **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


318. (L3 [D]) Как найти, теряются ли записи из-за async failover или из-за client retry bugs?

     **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


319. (L3 [D]) Почему network bandwidth свободен, но replication throughput упёрся?

     **Ответ:** IOPS ограничивают частоту небольших операций, bandwidth — байты в секунду; связь bytes/s≈IOPS×средний size работает для заданного потока. Cached reads, mixed workload и queueing требуют отдельного учёта. Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но часть клиентов видела старое состояние”?

     **Ответ:** Сравнить leader/follower positions, log retention, network/disk/apply rate и timeline/epoch. После failover проверить committed prefix, stale routes и старого writer, а не только что новая реплика отвечает health check.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


321. (L4 [S]) Как выбрать replication model под новый продукт: leader-follower, multi-leader или leaderless?

     **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


322. (L4 [S]) Как сочетать replication, partitioning и geo-placement без взрывной сложности?

     **Ответ:** Совместно выбирать shard key, leader/replica placement и query execution. Ограничить migration/egress, учитывать rebuild/cache coldness и failover; local optimisation одного tenant не должна лишать остальных capacity или нужного quorum.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


323. (L4 [S]) Какие anti-patterns в replication architecture чаще всего приводят к painful production incidents?

     **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


324. (L4 [S]) Как проектировать degradation modes при lag, partition и partial DC outage?

     **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


325. (L4 [S]) Как формулировать пользователям и внутренним командам точные consistency/durability guarantees?

     **Ответ:** Выбирать при ясном single-writer инварианте; определить sync/async, read-your-writes и RPO/RTO. Резерв должен иметь data/capacity и проверенный promotion; automatic failover без fencing создаёт split-brain риск.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


---
