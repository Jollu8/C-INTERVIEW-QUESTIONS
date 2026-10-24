# 🧮 3. Транзакции и консистентность — Вопросы

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

## 🔹 ACID

---

### L1

**[T]**

1. Что такое транзакция и зачем она нужна?

   **Ответ:** Транзакция — единица выполнения с единым commit/abort и заданными isolation/durability guarantees. Она объединяет операции, совместно сохраняющие инвариант, например списание и зачисление при переводе.

   **Пример:** Перевод: debit(A), credit(B) и operation_id фиксируются одной транзакцией, либо все три изменения откатываются.

   **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

2. Что означает Atomicity?

   **Ответ:** Все изменения транзакции фиксируются совместно либо откатываются; промежуточный частичный результат не становится её окончательным исходом.

   **Пример:** Списание и зачисление при переводе входят в одну транзакцию.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

3. Что означает Consistency в ACID?

   **Ответ:** ACID consistency относится к сохранению заданных ограничений/инвариантов корректной транзакцией. Это не linearizability реплик; СУБД обеспечивает только выраженные правила, а не автоматически все намерения приложения.

   **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

4. Что означает Isolation?

   **Ответ:** Isolation определяет, какие результаты и взаимные влияния допустимы при конкурентных транзакциях. Полная сериализуемость означает эквивалентность некоторому последовательному выполнению, а более слабые уровни разрешают дополнительные histories.

   **Типичная ошибка:** Считать Read Committed полной изоляцией.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

5. Что означает Durability?

   **Ответ:** Durability означает, что успешно подтверждённый результат переживает оговорённые сбои. Требуемый журнал/данные должны стать устойчивыми до ACK; process crash и потеря питания требуют разных предпосылок.

   **Типичная ошибка:** Считать асинхронную реплику гарантией нулевой потери данных при failover.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

6. Чем транзакция отличается от набора независимых операций?

   **Ответ:** Внутри транзакции частичное выполнение не должно стать отдельным успешным исходом. При crash до commit незавершённые изменения не публикуются/откатываются, после durable commit восстанавливаются по принятому recovery protocol.

   **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

7. Почему ACID важен для OLTP систем?

   **Ответ:** OLTP постоянно изменяет связанные данные при конкуренции и сбоях. Atomicity защищает от частичного эффекта, constraints/isolation — от запрещённых состояний/историй, durability — от потери подтверждённого результата.

   **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

8. Какие свойства ACID чаще всего конфликтуют с производительностью?

   **Ответ:** Строгая isolation добавляет locks/validation/aborts, durable commit — sync/replication ожидание. Цена зависит от conflict rate, batching и storage; ослабление гарантии должно быть явным продуктовым решением, а не скрытым tuning.

   **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

9. Что происходит, если система падает между двумя операциями одной транзакции?

   **Ответ:** Внутри транзакции частичное выполнение не должно стать отдельным успешным исходом. При crash до commit незавершённые изменения не публикуются/откатываются, после durable commit восстанавливаются по принятому recovery protocol.

   **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

10. Почему durability почти всегда требует участия диска или устойчивого журнала?

    **Ответ:** Durability обещает сохранение подтверждённого результата при оговорённых сбоях. Volatile RAM/page cache не переживают потерю питания; нужны устойчивый журнал/носитель или протокол с достаточными устойчивыми копиями.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


**[P]**

11. Реализовать простую транзакцию “begin/commit/rollback” для in-memory KV store

    **Ответ:** BEGIN выдаёт ID/snapshot, операции копят private write/undo set, COMMIT валидирует conflicts/constraints и durable log boundary перед публикацией. ROLLBACK отменяет весь write set; test включает concurrent readers, partial error и crash между flush/ACK.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

12. Реализовать журнал undo для отката операций

    **Ответ:** До разрушения старого значения сохранить before-image с tx/page/record identity и prevLSN. Rollback идёт в обратном порядке, не затрагивает чужие committed изменения; crash-safe undo журналирует progress/CLR по выбранной схеме.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

13. Реализовать журнал redo для восстановления после падения

    **Ответ:** Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

14. Сделать атомарный перевод денег между двумя аккаунтами

    **Ответ:** В одной транзакции заблокировать accounts в стабильном порядке/использовать подходящую isolation, проверить лимиты, списать/зачислить и записать unique operation ID. Commit/rollback охватывает всё; external side effects уходят через outbox.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

15. Смоделировать сбой процесса между update и commit

    **Ответ:** Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

16. Реализовать commit marker в WAL

    **Ответ:** Framed COMMIT связывает tx_id с полным набором records/границей log. Записать checksum/length и sync нужный префикс до ACK; recovery принимает лишь валидный завершённый commit и не повторяет бизнес-эффект при replay.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

17. Реализовать idempotent recovery после crash

    **Ответ:** Хранить durable operation/event ID с UNIQUE и менять effect+inbox/result в одной транзакции. Повтор возвращает прежний outcome, другой payload с тем же ID отклоняется; crash между commit и ACK не должен повторять эффект.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

18. Реализовать транзакционный batch update на C++

    **Ответ:** BEGIN выдаёт ID/snapshot, операции копят private write/undo set, COMMIT валидирует conflicts/constraints и durable log boundary перед публикацией. ROLLBACK отменяет весь write set; test включает concurrent readers, partial error и crash между flush/ACK.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

19. Реализовать минимальный transaction manager

    **Ответ:** BEGIN выдаёт ID/snapshot, операции копят private write/undo set, COMMIT валидирует conflicts/constraints и durable log boundary перед публикацией. ROLLBACK отменяет весь write set; test включает concurrent readers, partial error и crash между flush/ACK.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

20. Смоделировать partial failure и восстановление из журнала

    **Ответ:** Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

### L2

**[T]**

21. В чем разница между undo logging и redo logging?

    **Ответ:** Undo сохраняет старое состояние, redo — информацию для повторного применения нового. Для отката конкурентных транзакций недостаточно вернуть произвольную старую копию всей страницы: нужно учитывать чужие завершённые изменения.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

22. Почему WAL должен быть записан до dirty page?

    **Ответ:** Dirty page нельзя сделать устойчивой раньше WAL, описывающего её изменения: иначе crash оставит изменённую страницу без материала для восстановления/отката. Правило относится к durable ordering, а не лишь к порядку write вызовов.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)

23. Что такое force vs no-force policy?

    **Ответ:** Force требует вывести изменённые pages к commit, no-force допускает их более поздний flush и поэтому нуждается в redo. Это независимо от steal/no-steal, определяющего возможность flush uncommitted changes.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)

24. Что такое steal vs no-steal policy?

    **Ответ:** Steal допускает flush страницы с незавершёнными изменениями и требует безопасного undo либо иной схемы их невидимости/отмены. No-steal запрещает это, повышая требования к памяти; no-force отдельно требует redo.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)

25. Как связаны buffer pool и durability?

    **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

26. Что означает commit в терминах storage engine?

    **Ответ:** Commit — необратимое решение принять transaction по выбранному протоколу с публикацией видимости и требуемой устойчивостью. Client ACK может ждать local/replica flush/apply по конфигурации; наличие bytes в buffer ещё не commit guarantee.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

27. Почему fsync может быть дорогим?

    **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

28. Что такое group commit?

    **Ответ:** Group commit позволяет нескольким транзакциям ждать один fsync общего префикса WAL. Durable watermark покрывает их target LSN до ACK; bounded batch delay меняет latency, но не должен незаметно ослаблять durability.

    **Пример:** Три commit ждут LSN 10/20/30; один успешный flush до 30 позволяет подтвердить все три.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

29. Какие trade-offs между latency и durability?

    **Ответ:** Транзакция фиксирует единый набор изменений либо откатывает его; isolation определяет допустимые конкурентные истории, durability — устойчивость ACK при объявленной модели отказа. Инварианты, отсутствующие в constraints/коде, СУБД сама не изобретает.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

30. Что значит “consistency” в ACID и чем она отличается от application invariants?

    **Ответ:** ACID consistency относится к сохранению заданных ограничений/инвариантов корректной транзакцией. Это не linearizability реплик; СУБД обеспечивает только выраженные правила, а не автоматически все намерения приложения. Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[P]**

31. Реализовать WAL с LSN

    **Ответ:** Сериализовать length/type/tx_id/LSN/payload/checksum, писать loop с short-write/EINTR обработкой. Разделить written и durable LSN, sync перед требуемым ACK; parser ограничивает length и останавливает recovery на неполном tail.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

32. Реализовать group commit

    **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

33. Реализовать crash recovery по redo log

    **Ответ:** Каждый record содержит проверяемый framing, identity и LSN; redo применяет только допустимый committed/history prefix по engine protocol. PageLSN/sequence делает повтор безопасным, частичный хвост отвергается; test повторяет crash внутри recovery.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

34. Реализовать dirty page table

    **Ответ:** Для dirty page хранить recLSN первого ещё не гарантированно сохранённого изменения и current state/generation. Flush корректно снимает запись только если page не изменилась снова; checkpoint/recovery сохраняют conservative recLSN.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

35. Реализовать checkpoint

    **Ответ:** Зафиксировать checkpoint generation/boundary и нужные dirty-page/transaction metadata, завершить предусмотренный WAL/data flush и atomically publish указатель. Retained log не удалять до всех consumers; crash test проверяет старый и новый checkpoint.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)

36. Реализовать transaction table

    **Ответ:** Map tx_id→state/start/read boundary/lastLSN с атомарным переходом active→committed/aborted. Readers используют согласованное visibility состояние, recovery восстанавливает необходимую metadata; reclaim только после исчезновения использующих её snapshots.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

37. Написать небольшой recovery manager

    **Ответ:** Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

38. Реализовать commit batching через отдельный flush thread

    **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

39. Реализовать защиту от torn writes

    **Ответ:** Добавить page identity/LSN/checksum и источник восстановления: full-page log image, doublewrite либо доказанный atomic replacement. Injector повреждает часть write; recovery должен восстановить правильную версию, а не только обнаружить checksum mismatch.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

40. Добавить configurable durability mode: always fsync / periodic fsync

    **Ответ:** Режим задаёт exact ACK boundary: always/group sync ждут durable LSN, periodic допускает объявленную потерю хвоста. API barrier возвращает errors, directories учитываются при публикации; test process crash отдельно от power-loss model.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[D]**

41. Почему после перезапуска часть committed данных пропала?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

42. Почему rollback оставил систему в неконсистентном состоянии?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

43. Почему fsync latency резко вырос?

    **Ответ:** Sync может ждать предыдущие dirty writes, metadata и flush volatile device caches, поэтому его latency зависит от всего storage path/queue. Group commit уменьшает число sync на transaction, но вводит bounded queueing. Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

44. Почему throughput падает при росте числа commit?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

45. Почему recovery занимает слишком много времени?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

46. Почему checkpoint не уменьшает recovery time?

    **Ответ:** Сопоставить checkpoint position, oldest recLSN, dirty backlog, long transactions и retained WAL. Частые checkpoint могут увеличивать I/O и full-page images, но не сокращать recovery, если нижняя безопасная граница не движется.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)

47. Почему WAL стал больше ожидаемого?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

48. Почему при высокой нагрузке commit latency становится “пилообразным”?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

49. Почему данные на реплике есть, а после crash на primary их нет?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

50. Почему transaction log стал главным bottleneck?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

### L3

**[T]**

51. Как устроен ARIES на высоком уровне?

    **Ответ:** ARIES выполняет analysis для восстановления transaction/dirty-page tables, redo для повторения нужной истории и undo для losers. PageLSN, WAL и compensation records позволяют пережить повторный crash внутри recovery.

    **Пример:** После повторного crash CLR сообщает, какой undo уже завершён и откуда продолжать откат.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

52. Что такое physiological logging?

    **Ответ:** Physiological logging идентифицирует физическую страницу, но описывает действие внутри неё более логически, например вставку slot. Recovery должен сохранять page identity/LSN и корректность операции при повторе.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)

53. Что такое log sequence number и как он связан со страницами?

    **Ответ:** LSN идентифицирует порядок/позицию журнала в определённом log stream. Written, durable и applied LSN имеют разные значения; сравнивать их между независимыми timelines/группами без контекста нельзя.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

54. Почему pageLSN нужен для recovery?

    **Ответ:** pageLSN — позиция последнего отражённого на странице log record. WAL flush обязан покрывать pageLSN до вывода страницы; redo проверяет pageLSN, чтобы не применять уже выполненный record повторно.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)

55. Как работают analysis / redo / undo phases?

    **Ответ:** Analysis определяет активные/незавершённые транзакции и dirty-page recovery boundary. Redo повторяет нужную историю с pageLSN проверкой, undo отменяет losers по цепочкам, журналируя compensation records.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

56. Как реализуется atomic commit при конкуренции потоков?

    **Ответ:** Транзакция фиксирует единый набор изменений либо откатывает его; isolation определяет допустимые конкурентные истории, durability — устойчивость ACK при объявленной модели отказа. Инварианты, отсутствующие в constraints/коде, СУБД сама не изобретает.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

57. Как сочетаются WAL, buffer pool и background flushers?

    **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

58. Что такое fuzzy checkpoint?

    **Ответ:** Fuzzy checkpoint записывает recovery metadata, не останавливая все транзакции ради полного согласованного flush. Для правильного recovery требуются dirty-page/transaction information и WAL, покрывающий ещё не отражённые изменения.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)

59. Как устроен group commit в production СУБД?

    **Ответ:** Group commit объединяет несколько ожидающих commit за одним durable flush. Он сохраняет гарантию ACK после flush для каждой транзакции, но добавляет очередь и время накопления группы.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

60. Как обеспечить durability на SSD/NVMe с учётом reorder/write cache?

    **Ответ:** Persistence зависит от flush/FUA/barrier пути до контроллера и его power-loss поведения. O_DIRECT не выключает volatile device cache, а VM/hypervisor может добавить ещё один слой с собственными гарантиями.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


**[P]**

61. Реализовать упрощённый ARIES-style recovery

    **Ответ:** Сохранять prevLSN/undoNextLSN и pageLSN, восстанавливать transaction/dirty-page tables на analysis, redo начинать с безопасного recLSN. Undo losers журналировать через CLR; инъектировать crash и внутри recovery.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

62. Реализовать pageLSN и проверку при recovery

    **Ответ:** Обновлять pageLSN вместе с отражаемым изменением под page synchronization. Flusher сначала ждёт durable WAL≥pageLSN, redo пропускает уже отражённые records; проверить torn page, snapshot LSN и отсутствие ложного skip.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

63. Реализовать background page flusher

    **Ответ:** Выбрать dirty unpinned candidate, зафиксировать согласованный image/LSN, дождаться durable WAL и выполнить write. Проверить errors и re-dirty race перед очисткой dirty flag; ограничить background budget foreground latency.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

64. Реализовать durable commit queue

    **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

65. Реализовать recovery с undo chain

    **Ответ:** Compensation log record фиксирует уже сделанный undo и дальнейший undoNextLSN. Это позволяет повторному recovery не откатывать одно изменение бесконечно и продолжать после сбоя во время rollback. Сохранять prevLSN/undoNextLSN и pageLSN, восстанавливать transaction/dirty-page tables на analysis, redo начинать с безопасного recLSN. Undo losers журналировать через CLR; инъектировать crash и внутри recovery.

    **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

66. Реализовать rollback to savepoint

    **Ответ:** Savepoint сохраняет позицию write/undo log и нужные ресурсы; rollback-to идёт назад до неё, не отменяя более раннюю часть. RELEASE не подтверждает отдельную durable transaction; nested abstraction должна явно использовать outer commit semantics.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770)

67. Реализовать nested transaction abstraction

    **Ответ:** Savepoint сохраняет позицию write/undo log и нужные ресурсы; rollback-to идёт назад до неё, не отменяя более раннюю часть. RELEASE не подтверждает отдельную durable transaction; nested abstraction должна явно использовать outer commit semantics.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

68. Написать crash-consistency тесты с kill -9

    **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

69. Реализовать fault injection для transaction manager

    **Ответ:** BEGIN выдаёт ID/snapshot, операции копят private write/undo set, COMMIT валидирует conflicts/constraints и durable log boundary перед публикацией. ROLLBACK отменяет весь write set; test включает concurrent readers, partial error и crash между flush/ACK.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)

70. Реализовать persist barrier abstraction под Linux

    **Ответ:** Режим задаёт exact ACK boundary: always/group sync ждут durable LSN, periodic допускает объявленную потерю хвоста. API barrier возвращает errors, directories учитываются при публикации; test process crash отдельно от power-loss model.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[D]**

71. Как диагностировать, что lost commit вызван не БД, а файловой системой/диском?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

72. Как отличить логическую неконсистентность от нарушения recovery protocol?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

73. Почему page cache Linux может маскировать проблемы durability?

    **Ответ:** Чтение сразу после write может вернуть данные из page cache, хотя они ещё не устойчивы на storage. Даже restart процесса сохраняет kernel cache; durability проверяется sync/ordering и нужной моделью отказа носителя. Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

74. Почему ext4/xfs mount options могут менять поведение durability?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

75. Как проверить, что WAL flush действительно завершён до ack клиенту?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

76. Почему sync_file_range не заменяет fsync для durability?

    **Ответ:** sync_file_range управляет writeback диапазона, но не даёт полного durability обещания fsync, включая нужную metadata и требования storage flush. Использовать его как единственный барьер перед durable ACK нельзя. Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

77. Почему на виртуализованной среде durability хуже ожидаемой?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

78. Как расследовать повреждение WAL после abrupt power loss?

    **Ответ:** SIGKILL останавливает процесс, но не очищает kernel/device caches; поэтому успешный restart после kill -9 не доказывает power-loss durability. Нужны fault tests persistence boundaries и согласованная модель диска/VM. Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

79. Почему group commit может ухудшить p99 latency?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Измерить batch size, queue wait, flush duration и p99 commit; отличить batching delay от storage stalls. Проверить что waiter не просыпается по written LSN вместо durable LSN и не теряет wakeup.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

80. Как доказать корректность recovery algorithm на crash-инъекциях?

    **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

### L4

**[S]**

81. Как выбирать durability guarantees для разных классов данных?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

82. Когда допустимо ослаблять durability ради latency?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

83. Как проектировать transaction subsystem для embedded DB на C++?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

84. Как строить crash-safe storage engine поверх Linux filesystem?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

85. Когда нужен свой WAL format, а когда достаточно append-only log?

    **Ответ:** Append-only избегает in-place перезаписи существующего префикса и удобно группирует log writes. Нужны framing/checksum и safe truncation/recycling; append syscall не гарантирует power-loss atomicity или отсутствие amplification.

    **Рекомендация:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

86. Как проектировать recovery так, чтобы startup не занимал десятки минут?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

87. Как разделить fast path commit и background maintenance?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

88. Как строить transaction layer для distributed database?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

89. Как выбрать между synchronous replication и local durability?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

90. Как формулировать SLA для consistency/durability на уровне продукта?

    **Ответ:** Сначала определить инварианты, isolation и допустимый RPO, затем протокол commit/recovery и пределы конкуренции. Ослабление sync или изоляции должно быть частью контракта; benchmark без этих параметров несопоставим.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

## 🔹 Isolation Levels

---

### L1

**[T]**

91. Что такое уровень изоляции?

    **Ответ:** Уровень изоляции — контракт допустимых конкурентных наблюдений и конфликтов. Названия уровней не заменяют product-specific semantics: stable snapshot, predicate protection и write-conflict handling нужно уточнять отдельно.

    **Пример:** T1 читает остаток, T2 меняет его и commit, T1 повторяет чтение: результат зависит от statement/transaction snapshot.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

92. Что такое dirty read?

    **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

93. Что такое non-repeatable read?

    **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Non-repeatable read — повторное чтение той же логической строки возвращает иное committed значение. Phantom относится к составу predicate result; стабильный snapshot скрывает оба наблюдения, но не все аномалии записи.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

94. Что такое phantom read?

    **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

    **Пример:** T1 читает WHERE price BETWEEN 10 AND 20; T2 вставляет price=15 и commit; дальнейшее поведение задаётся isolation.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

95. Что такое lost update?

    **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

96. Чем read committed отличается от repeatable read?

    **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок. Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

97. Чем repeatable read отличается от serializable?

    **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

98. Почему более сильная изоляция обычно дороже?

    **Ответ:** Сильная isolation требует удерживать больше защиты или валидировать дополнительные зависимости и повторять aborts. При низкой конкуренции цена может быть мала; оценивать её на workload с реальными конфликтами.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

99. Почему read uncommitted почти не используется в серьёзных OLTP системах?

    **Ответ:** Read Uncommitted может разрешать чтение данных, которые затем откатятся, поэтому производные решения строятся на несуществующем состоянии. Некоторые engines, включая PostgreSQL, фактически трактуют его как Read Committed.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

100. Что именно гарантирует serializable?

     **Ответ:** Serializable гарантирует, что результат/наблюдения завершённых транзакций эквивалентны некоторому последовательному порядку. Сам по себе он не добавляет real-time ordering между системами или свежесть async replica; для этого нужны отдельные guarantees.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[P]**

101. Смоделировать dirty read на двух потоках

     **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Типичная ошибка:** Принимать стабильный snapshot или отсутствие одинаковых write keys за доказательство serializability.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

102. Смоделировать non-repeatable read

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Non-repeatable read — повторное чтение той же логической строки возвращает иное committed значение. Phantom относится к составу predicate result; стабильный snapshot скрывает оба наблюдения, но не все аномалии записи. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

103. Смоделировать phantom read

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

104. Смоделировать lost update

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

105. Реализовать простейший scheduler для двух транзакций

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

106. Реализовать read committed через блокировки

     **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

107. Реализовать repeatable read через удержание read locks

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

108. Реализовать serializable через строгий 2PL

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

109. Написать multi-threaded test на аномалии изоляции

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

110. Построить маленький history checker для read/write операций

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


---

### L2

**[T]**

111. Какие аномалии разрешены на read committed?

     **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

112. Почему repeatable read не всегда эквивалентен serializable?

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

113. Что такое write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Пример:** Оба дежурных видят двух активных и каждый снимает только себя; final state нарушает «хотя бы один дежурный».

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

114. Почему phantom read часто связан не со строками, а с предикатами?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

115. Как индексы влияют на реализацию уровней изоляции?

     **Ответ:** Индекс задаёт реальные ключи/диапазоны доступа для locking/predicate tracking. Без подходящего path engine может охватывать больше rows/pages/диапазонов, повышая blocking/false conflicts, но корректность isolation всё равно обязательна.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

116. Что такое predicate locking?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

117. Что такое strict 2PL?

     **Ответ:** 2PL разрешает acquire в growing phase и запрещает новые locks после начала release. Strict вариант удерживает write locks до commit/abort; для predicate correctness нужны соответствующие interval locks, а deadlock всё ещё возможен.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

118. Что такое snapshot isolation?

     **Ответ:** Транзакция читает согласованный снимок и обычно обнаруживает конфликтующие записи одной строки. Возможен write skew: две транзакции меняют разные строки и совместно нарушают инвариант.

     **Пример:** Два дежурных одновременно снимают себя с дежурства.

     **Рекомендация:** Для межстрочного инварианта рассмотреть serializable или явные блокировки.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

119. Почему snapshot isolation допускает некоторые аномалии?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

120. Как read-only транзакции могут влиять на систему?

     **Ответ:** Read-only транзакция удерживает snapshot/версии, занимает cache/I/O/CPU и может участвовать в serializable dependencies. Поэтому она способна мешать cleanup и latency даже без UPDATE.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


**[P]**

121. Реализовать strict 2PL

     **Ответ:** Состояние growing разрешает acquire, shrinking запрещает новые locks; write locks strict варианта удерживаются до commit/abort. Поддержать predicate/range protection для соответствующего isolation, deadlock victim и rollback; проверить serial histories.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

122. Реализовать range lock для предикатов

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

123. Реализовать snapshot isolation поверх versioned rows

     **Ответ:** Версия хранит row ID, value, creator/commit metadata и ссылку на предыдущую. UPDATE создаёт новую версию и публикует head атомарно по protocol; aborted версия невидима, reclaim ждёт active snapshots/readers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

124. Реализовать conflict detector для lost update

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

125. Реализовать serial schedule checker

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

126. Написать генератор interleaving сценариев

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

127. Реализовать lock upgrade

     **Ответ:** Для S→X проверить других владельцев и очередь upgrades; не допускать, чтобы два owners бесконечно держали S и ждали X. Выбрать один upgrader/abort victim либо release-and-revalidate protocol; проверить cycle и сохранение read invariant.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

128. Реализовать intent locks

     **Ответ:** Intent locks обозначают намерение брать более мелкие locks и позволяют совместимо проверять иерархию table/page/row. Их конкретные режимы зависят от СУБД; PostgreSQL не следует автоматически описывать как InnoDB. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

129. Реализовать serializable validation phase

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

130. Построить тесты для write skew

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


**[D]**

131. Почему приложение жалуется на “странные” данные при read committed?

     **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Типичная ошибка:** Принимать стабильный snapshot или отсутствие одинаковых write keys за доказательство serializability.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

132. Почему under repeatable read всё ещё возможна бизнес-неконсистентность?

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

133. Почему serializable резко просаживает throughput?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

134. Почему read-only аналитический запрос ломает latency OLTP?

     **Ответ:** Read-only транзакция может удерживать snapshot/versions, занимать I/O/CPU и влиять на serializable dependencies. Отсутствие write не означает отсутствие эксплуатационных последствий или обязательного abort при любой реализации. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

135. Почему long transaction удерживает старые версии слишком долго?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

136. Как диагностировать phantom-и на production workload?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

137. Почему аномалия воспроизводится только под нагрузкой?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

138. Почему lock escalation неожиданно меняет поведение?

     **Ответ:** Escalation заменяет много мелких locks более крупным с сохранением защиты и может увеличить блокирование. Не каждая СУБД выполняет row→table escalation; поведение уточняют по продукту/версии. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

139. Почему SELECT ... FOR UPDATE не решил lost update?

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

140. Как доказать, что проблема именно в уровне изоляции, а не в баге приложения?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


---

### L3

**[T]**

141. Как формально описываются аномалии через histories/conflict graphs?

     **Ответ:** History фиксирует reads/writes/commits/aborts и порядок/версии наблюдений. Graph dependencies связывает конфликтующие транзакции; допустимость проверяется по выбранной модели, а не только одинаковому final state.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

142. Что такое serializability graph testing?

     **Ответ:** Serializability graph testing строит зависимости транзакций и проверяет отсутствие запрещённых циклов при предпосылках используемого graph model. Нужно учитывать predicate reads и реальные версии; одних write-write edges недостаточно.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

143. Что такое optimistic concurrency control в контексте isolation?

     **Ответ:** Optimistic control читает/вычисляет без длительных pessimistic locks, затем валидирует read/write dependencies перед commit. Проверка только версии записываемой строки не исключает write skew; при провале повторяют целую транзакцию.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

144. Чем certifier-based serializability отличается от locking-based?

     **Ответ:** Certifier валидирует read/write dependencies и выбирает commit/abort после выполнения, locking блокирует конфликтующую работу заранее. Обе схемы должны защищать нужную модель, а не только прямые write-write конфликты.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

145. Как реализуется SSI (Serializable Snapshot Isolation)?

     **Ответ:** Snapshot isolation предотвращает часть аномалий, но допускает циклы read-write dependencies без прямого write-write конфликта. Serializable должен исключать такие histories, иногда ценой abort/retry. SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

146. Чем snapshot isolation отличается от repeatable read в популярных СУБД?

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

147. Что такое predicate conflict и почему его сложно ловить?

     **Ответ:** Predicate conflict возникает, если writer меняет состав/значения множества, прочитанного условием. Вставка в ранее пустой диапазон не отражается в списке существовавших row IDs, поэтому нужен range/predicate tracking либо консервативное покрытие.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

148. Как реализуются range locks в B-Tree?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

149. Как long-running readers влияют на concurrency control?

     **Ответ:** Долгие readers задерживают GC/VACUUM версий и удерживают ресурсы; в locking схемах ещё и блокируют writers. Нужны duration/oldest snapshot limits и наблюдение retention, а не убеждение, что SELECT всегда бесплатен.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

150. Как isolation связан с replication consistency?

     **Ответ:** Isolation описывает отношения операций транзакций, replication consistency — какие версии/порядок видят клиенты разных replicas. Serializable на leader не делает async follower свежим; обе границы нужно объявлять отдельно.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[P]**

151. Реализовать precedence graph builder

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

152. Реализовать cycle detection для histories

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

153. Реализовать optimistic validation на commit

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

154. Реализовать SSI-style rw-conflict tracking

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

155. Реализовать key-range locking в индексе

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

156. Реализовать lock compatibility matrix

     **Ответ:** Задать матрицу S/X/других режимов и проверить request против всех несовместимых holders. Grant и enqueue выполнить атомарно, release пересматривает ожидающих с выбранной fairness; unit cases покрывают reader-reader, reader-writer и upgrades.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

157. Реализовать starvation-free lock scheduler

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

158. Написать fuzzing для concurrency anomalies

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

159. Реализовать deterministic transaction scheduler

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

160. Реализовать trace logger interleavings для расследования race conditions

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[D]**

161. Как расследовать редкую аномалию write skew в production?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

162. Почему serializable abort rate резко вырос после изменения workload?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

163. Почему key-range locks взорвали contention?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

164. Как найти точный interleaving, приводящий к неконсистентности?

     **Ответ:** Interleaving — конкретное чередование операций транзакций; anomaly — история, запрещённая выбранной моделью/инвариантом. Проверка только final state недостаточна: наблюдавшиеся readers результаты тоже входят в correctness. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

165. Почему одна и та же логика работает в PostgreSQL и ломается в MySQL/InnoDB?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

166. Как отделить проблему snapshot staleness от настоящей аномалии serializability?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

167. Почему горячие диапазоны индекса приводят к лавине abort/retry?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

168. Почему retry loop на serializable сам стал причиной деградации?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

169. Как собирать минимальный воспроизводимый сценарий аномалии?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

170. Как проверить реализацию уровня изоляции property-based тестированием?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


---

### L4

**[S]**

171. Какой уровень изоляции выбирать по умолчанию для OLTP продукта?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

172. Когда оправдан serializable, а когда достаточно read committed?

     **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок.

     **Рекомендация:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

173. Как проектировать API так, чтобы разработчики не делали опасных read-modify-write?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

174. Как балансировать correctness и throughput?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

175. Как проектировать mixed workload с короткими и длинными транзакциями?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

176. Как закладывать retry semantics в клиентский SDK?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

177. Как документировать isolation guarantees для внутренних платформ?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

178. Когда переходить от pessimistic locking к optimistic schemes?

     **Ответ:** Pessimistic control заранее удерживает защиту от конфликтующей операции, optimistic сначала выполняет работу, затем validates/aborts. Выбор зависит от conflict rate и инварианта; MVCC может сочетаться с обоими подходами.

     **Рекомендация:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

179. Как проектировать serializable layer в распределённой системе?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

180. Как обучать команды отличать DB consistency от business consistency?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


---

## 🔹 MVCC

---

### L1

**[T]**

181. Что такое MVCC?

     **Ответ:** MVCC хранит несколько версий записи и выбирает видимую согласно snapshot и состоянию транзакций. Это уменьшает reader-writer блокирование, но сохраняет write conflicts, storage/GC overhead и необходимость защиты инвариантов.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

182. Зачем нужна многоверсионность?

     **Ответ:** Многоверсионность позволяет читателю видеть согласованное прошлое, пока writer создаёт новое состояние. Вместо ожидания каждого writer reader платит version selection, а engine — памятью и очисткой history.

     **Пример:** Snapshot S видит версию commit_seq=10 и не видит новую commit_seq=20, если её boundary равна 15.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

183. Как MVCC помогает читателям не блокировать писателей?

     **Ответ:** Reader выбирает старую committed версию по snapshot и не обязан ждать, пока writer завершит новую. Writer-writer conflicts, schema locks и внутренние page latches при этом никуда не исчезают.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

184. Что такое snapshot в MVCC?

     **Ответ:** Snapshot — boundary/metadata, определяющие видимые транзакции или commit sequence. Это обычно не физическая копия всей БД: разные readers выбирают соответствующие версии из общего storage.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

185. Что такое version chain?

     **Ответ:** Version chain связывает состояния одной логической записи. Reader ищет новейшую версию, допустимую его snapshot; длина цепочки увеличивает lookup cost, а reclaim ограничен защищёнными readers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

186. Почему MVCC не отменяет необходимость cleanup/garbage collection?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

187. Что хранится в версии записи?

     **Ответ:** Payload и metadata видимости: creator/deleter transaction IDs либо commit intervals, ссылка/offset предыдущей версии, tombstone/state и identity. Точный layout зависит от engine; wall-clock timestamp сам по себе недостаточен.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

188. Как reader выбирает видимую версию?

     **Ответ:** Reader проверяет собственные writes, затем идёт по версиям от новых к старым и выбирает committed версию, видимую snapshot. Active/aborted creator и deletion visibility учитываются отдельно; life-time версии защищён до конца чтения.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

189. Почему MVCC полезен для read-heavy workload?

     **Ответ:** Большинство readers не сериализуется с текущими writers и может читать стабильное состояние. Выигрыш уменьшается при длинных chains, удерживаемых snapshots и давлении на cache/GC, поэтому read-heavy не значит нулевой overhead.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

190. Чем MVCC отличается от locking-only подхода?

     **Ответ:** Locking-only защита чаще заставляет readers/writers ждать несовместимые locks, MVCC разводит их по версиям. Production engines комбинируют версии с locks/latches; это не бинарный выбор «locks либо MVCC».

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


**[P]**

191. Реализовать versioned row

     **Ответ:** Версия хранит row ID, value, creator/commit metadata и ссылку на предыдущую. UPDATE создаёт новую версию и публикует head атомарно по protocol; aborted версия невидима, reclaim ждёт active snapshots/readers.

     **Типичная ошибка:** Удалять старую версию только потому, что она не нужна текущему состоянию, игнорируя активные snapshots.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

192. Реализовать begin timestamp / commit timestamp

     **Ответ:** Series ID/labels→time chunks с bounds/index/validity, WAL+sequence и explicit lateness policy. Encoding имеет version/anchors/overflow checks, windows используют event time/allowed lateness; test raw-oracle queries, duplicate/out-of-order и retention boundaries.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Apache Kafka Streams: Core concepts](https://kafka.apache.org/41/streams/core-concepts/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

193. Реализовать snapshot read

     **Ответ:** Создать read-only transaction snapshot, все lookups выполнять по одной boundary и удерживать её до конца. Отдельно определить statement vs transaction scope, собственные writes/replica freshness; проверить concurrent insert/update/delete.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

194. Реализовать append новой версии при update

     **Ответ:** Версия хранит row ID, value, creator/commit metadata и ссылку на предыдущую. UPDATE создаёт новую версию и публикует head атомарно по protocol; aborted версия невидима, reclaim ждёт active snapshots/readers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

195. Реализовать delete как tombstone version

     **Ответ:** DELETE добавляет versioned tombstone, lookup подавляет более старые values. Compaction удаляет marker лишь после проверки snapshots и охвата старых copies/levels; test строит «new tombstone + hidden older value» и проверяет отсутствие resurrection.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

196. Реализовать traversal version chain

     **Ответ:** Version chain связывает состояния одной записи; lookup ищет новейшую видимую snapshot версию. Длинная цепочка увеличивает memory reads/cache misses, cleanup ограничен активными readers и crash-safe visibility metadata. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

197. Реализовать in-memory MVCC KV store

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

198. Реализовать visibility check

     **Ответ:** Зафиксировать snapshot boundary/active transaction set, идти по версиям от новой к старой и выбирать committed видимую, учитывая собственные writes и tombstone. Проверить active/aborted creators, concurrent delete и границы snapshot; compare с reference history.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

199. Реализовать rollback незакоммиченной версии

     **Ответ:** Отметить transaction aborted и не публиковать её версии как committed; при физическом удалении соблюсти reader lifetime. Undo не должен стирать committed изменения другого writer; secondary entries и transaction metadata остаются согласованы.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

200. Реализовать простой vacuum старых версий

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

### L2

**[T]**

201. Что такое xmin/xmax-подобные поля?

     **Ответ:** В PostgreSQL transaction visibility использует transaction metadata, а конечный XID space требует freezing/anti-wraparound vacuum. xmin/xmax нельзя трактовать как обычные wall-clock timestamps или переносить на все MVCC engines.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

202. Как MVCC связан с undo log?

     **Ответ:** Undo может хранить предыдущие значения для реконструкции snapshot-видимых версий, как в некоторых engines. В других MVCC versions лежат в heap/append chains; undo и MVCC не обязаны иметь одинаковую физическую организацию.

     **Источник:** [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

203. Как MVCC связан с append-only storage?

     **Ответ:** Append-only удобно публикует новые версии, сохраняя прежние для readers. Но нужны version index/visibility, tombstones и GC/compaction; сам append не обеспечивает transaction isolation.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

204. Что такое vacuum / garbage collection версий?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

205. Почему long-running transactions мешают cleanup?

     **Ответ:** Долгий snapshot удерживает версии и может мешать vacuum/compaction, увеличивая storage и read work. Ограничение срока/прерывание старых readers — эксплуатационная политика с явными последствиями для клиента.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

206. Что такое snapshot too old?

     **Ответ:** Долгий snapshot удерживает версии и может мешать vacuum/compaction, увеличивая storage и read work. Ограничение срока/прерывание старых readers — эксплуатационная политика с явными последствиями для клиента.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

207. Как MVCC влияет на usage памяти и диска?

     **Ответ:** Несколько версий и metadata увеличивают memory/disk footprint, а старые snapshots ограничивают reclaim. Дополнительно растут cache misses и bytes read; сравнивать live data с retained history отдельно.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

208. Почему point lookup может замедляться из-за длинной version chain?

     **Ответ:** Поиск key может найти head chain, но затем пройти несколько невидимых/aborted версий. Это добавляет dependent memory/I/O accesses; индексы и cleanup horizon определяют реальную цену point lookup.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

209. Как secondary indexes работают с MVCC?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

210. Почему MVCC не решает все write conflicts?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


**[P]**

211. Реализовать global transaction ID allocator

     **Ответ:** Задать ownership/lifetime, layout/alignment и bounded allocation, разместить threads/pages совместно по целевому partition. Проверить correctness/free/reuse, затем сравнить remote accesses, alloc rate, perf c2c/misses и p99 с неизменным baseline.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)

212. Реализовать active transaction table

     **Ответ:** Map tx_id→state/start/read boundary/lastLSN с атомарным переходом active→committed/aborted. Readers используют согласованное visibility состояние, recovery восстанавливает необходимую metadata; reclaim только после исчезновения использующих её snapshots.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

213. Реализовать vacuum, учитывающий oldest active snapshot

     **Ответ:** Registry регистрирует read boundary до доступа к версиям и снимает её после завершения всех reads. Oldest protected boundary вычислять concurrency-safe; GC rechecks horizon и pins, включая crash/recovery consumers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

214. Реализовать secondary index с указателем на version chain head

     **Ответ:** В одной atomic write boundary менять row и old/new index entries, учитывать duplicates/NULL/constraints. Старые snapshot references удерживать до GC; test rollback/error после каждого index change и lookup equivalence со scan.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

215. Реализовать undo-based MVCC

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

216. Реализовать append-only MVCC

     **Ответ:** Append-only избегает in-place перезаписи существующего префикса и удобно группирует log writes. Нужны framing/checksum и safe truncation/recycling; append syscall не гарантирует power-loss atomicity или отсутствие amplification. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

217. Реализовать snapshot pinning

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

218. Реализовать visibility map

     **Ответ:** Хранить conservatively safe all-visible flags по data pages, очищать перед изменениями и устанавливать после проверки horizons. False-negative лишь теряет ускорение, false-positive может нарушить correctness.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

219. Реализовать pruning коротких version chains

     **Ответ:** Version chain связывает состояния одной записи; lookup ищет новейшую видимую snapshot версию. Длинная цепочка увеличивает memory reads/cache misses, cleanup ограничен активными readers и crash-safe visibility metadata. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

220. Написать benchmark на read/write mix

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


**[D]**

221. Почему размер таблицы растёт без роста “живых” данных?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Типичная ошибка:** Удалять старую версию только потому, что она не нужна текущему состоянию, игнорируя активные snapshots.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

222. Почему SELECT стал медленнее после серии update?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

223. Почему vacuum не успевает?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

224. Почему disk bloat растёт из-за long-lived transaction?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

225. Почему старые snapshot-читатели тормозят всю систему?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

226. Почему secondary index указывает на “мертвые” версии?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

227. Почему p99 latency скачет при cleanup?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

228. Почему after-delete место не освобождается сразу?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

229. Как найти запрос, который держит oldest snapshot?

     **Ответ:** Долгий snapshot удерживает версии и может мешать vacuum/compaction, увеличивая storage и read work. Ограничение срока/прерывание старых readers — эксплуатационная политика с явными последствиями для клиента. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

230. Почему chain traversal стал CPU bottleneck?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


---

### L3

**[T]**

231. Какие есть варианты реализации MVCC: undo-based, append-only, tuple-versioned?

     **Ответ:** Append-only избегает in-place перезаписи существующего префикса и удобно группирует log writes. Нужны framing/checksum и safe truncation/recycling; append syscall не гарантирует power-loss atomicity или отсутствие amplification.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

232. Как MVCC сочетается с B-Tree/LSM?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

233. Как реализуется visibility check без слишком большого overhead?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

234. Как проектировать commit timestamps в многопоточной системе?

     **Ответ:** Start/read timestamp выбирает snapshot, commit timestamp задаёт публикацию/порядок в конкретном engine. Их назначение должно согласоваться с conflict protocol; timestamp по wall clock без проверки не обеспечивает serializable/external consistency.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

235. Что такое epoch-based reclamation в контексте MVCC?

     **Ответ:** После удаления узла читатель может всё ещё держать ссылку; release/acquire не решает lifetime. Hazard pointers, epochs/RCU или иной доказанный protocol откладывают free, а ABA требует учитывать повторное использование identity. Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [Raft paper](https://raft.github.io/raft.pdf)

236. Как MVCC влияет на replication и recovery?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

237. Почему vacuum — это не просто delete old rows?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

238. Как работает HOT update-подобная оптимизация?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

239. Как оптимизировать версионность под cache locality?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

240. Как snapshot isolation строится поверх MVCC?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


**[P]**

241. Реализовать epoch-based GC для версий

     **Ответ:** Authority выдаёт monotonic epoch/token, а принимающий write resource хранит максимальный допустимый token и отвергает старые. Persist/update authority согласуются с failover; test paused old owner после promotion и stale routing.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

242. Реализовать background vacuum worker

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

243. Реализовать per-page pruning

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

244. Реализовать optimization для update без изменения indexed columns

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

245. Реализовать immutable snapshot descriptor

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

246. Реализовать fast-path visibility cache

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

247. Реализовать version chain compaction

     **Ответ:** Выбрать непересекающиеся jobs/inputs, merge key+sequence с snapshot/tombstone rules и писать новое поколение outputs. Durable manifest publish предшествует old-file cleanup; тестировать crash, retained readers и исчерпание temporary space.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

248. Реализовать hybrid MVCC + locking

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

249. Реализовать recovery для MVCC storage

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

250. Реализовать тесты на корректность видимости при concurrency

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


**[D]**

251. Как расследовать memory blow-up из-за MVCC?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

252. Почему freeze/vacuum фаза приводит к latency spikes?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

253. Почему version cleanup создаёт write amplification?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

254. Как доказать, что bottleneck в visibility checks, а не в I/O?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

255. Почему NUMA ухудшает производительность MVCC engine?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

256. Почему горячие строки деградируют сильнее, чем холодные?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

257. Как отладить race condition между vacuum и reader?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

258. Почему snapshot creation стала дорогой операцией?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

259. Как диагностировать contention на global transaction ID?

     **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

260. Почему cache line bouncing разрушает throughput version manager?

     **Ответ:** Независимые записи разных threads в одну cache line вызывают invalidation/migration. Проверять perf c2c и расположение hot fields; padding увеличивает footprint и не лечит true sharing одного счётчика. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

### L4

**[S]**

261. Когда MVCC — правильный выбор, а когда нет?

     **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

262. Какой вариант MVCC выбрать для in-memory DB?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

     **Рекомендация:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

263. Как проектировать cleanup так, чтобы он не убивал p99?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Рекомендация:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

264. Как балансировать storage bloat и read concurrency?

     **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

265. Как сочетать MVCC с distributed transactions?

     **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

266. Как выбирать GC/vacuum стратегию под разные workload?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

     **Рекомендация:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

267. Как проектировать MVCC для time-travel queries?

     **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

268. Как строить observability для version churn?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

269. Как объяснять ограничения MVCC продуктовым командам?

     **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

270. Когда стоит перейти с MVCC на другой concurrency model?

     **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


---

## 🔹 Locks (row/table, intent, range)

---

### L1

**[T]**

271. Что такое lock в СУБД?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Пример:** T1 держит X(A) и ждёт B, T2 держит X(B) и ждёт A: wait-for graph содержит цикл.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

272. Зачем нужны shared и exclusive locks?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

273. Чем row lock отличается от table lock?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

274. Почему coarse-grained lock проще, но хуже по concurrency?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

275. Что такое lock compatibility?

     **Ответ:** Матрица совместимости определяет, какие режимы разных owners могут удерживаться одновременно на одном объекте. Проверять нужно все уже выданные/ожидающие incompatible locks и правила upgrade, а не только наличие любого lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

276. Что такое lock wait?

     **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

277. Что такое lock timeout?

     **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

278. Что такое intent lock?

     **Ответ:** Intent locks обозначают намерение брать более мелкие locks и позволяют совместимо проверять иерархию table/page/row. Их конкретные режимы зависят от СУБД; PostgreSQL не следует автоматически описывать как InnoDB.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

279. Что такое lock escalation?

     **Ответ:** Escalation заменяет много мелких locks более крупным с сохранением защиты и может увеличить блокирование. Не каждая СУБД выполняет row→table escalation; поведение уточняют по продукту/версии.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

280. Почему блокировки сами по себе не гарантируют хорошую производительность?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[P]**

281. Реализовать mutex-based row lock manager

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Типичная ошибка:** Смешивать transactional lock, page latch и pin, считая их взаимозаменяемыми.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

282. Реализовать shared/exclusive lock

     **Ответ:** Задать матрицу S/X/других режимов и проверить request против всех несовместимых holders. Grant и enqueue выполнить атомарно, release пересматривает ожидающих с выбранной fairness; unit cases покрывают reader-reader, reader-writer и upgrades.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

283. Реализовать очередь ожидания lock request

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

284. Реализовать table lock manager

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

285. Реализовать intent locks

     **Ответ:** Intent locks обозначают намерение брать более мелкие locks и позволяют совместимо проверять иерархию table/page/row. Их конкретные режимы зависят от СУБД; PostgreSQL не следует автоматически описывать как InnoDB. Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

286. Реализовать upgrade S→X

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

287. Реализовать timeout на ожидание блокировки

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

288. Реализовать try_lock для транзакций

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

289. Реализовать release всех locks при commit/rollback

     **Ответ:** Lease даёт ограниченное во времени право при оговорённых clock/communication assumptions. Pause/skew/partition могут оставить старого владельца активным, поэтому critical writes требуют resource-side fencing/consensus rules. Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

290. Написать stress test на lock contention

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

### L2

**[T]**

291. Как работает strict 2PL?

     **Ответ:** 2PL делит acquisition и release phases, запрещая новые locks после начала release; strict вариант удерживает write locks до исхода транзакции. Для predicate serializability нужны соответствующие range/predicate locks, а deadlocks всё ещё возможны.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

292. Почему lock upgrade опасен?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

293. Когда возникает convoying?

     **Ответ:** Convoy возникает, когда множество threads стоит за holder, а wakeup/scheduling делает последовательную передачу ресурса дорогой. Уменьшение critical section, batching и concurrency limit полезнее бесконечного добавления workers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

294. Что такое latch и чем он отличается от lock?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

295. Почему page latches нужны даже при MVCC?

     **Ответ:** Latch защищает краткое изменение физической структуры page/node, logical lock — транзакционный объект или predicate. Latch обычно не держат до commit; освобождение одного не заменяет другой механизм.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

296. Что такое key-range lock?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

297. Что такое next-key lock?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

298. Чем logical locks отличаются от physical latches?

     **Ответ:** Latch защищает краткое изменение физической структуры page/node, logical lock — транзакционный объект или predicate. Latch обычно не держат до commit; освобождение одного не заменяет другой механизм. Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)

299. Как работает lock hierarchy?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

300. Какие trade-offs между row, page и table locking?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[P]**

301. Реализовать strict 2PL scheduler

     **Ответ:** Состояние growing разрешает acquire, shrinking запрещает новые locks; write locks strict варианта удерживаются до commit/abort. Поддержать predicate/range protection для соответствующего isolation, deadlock victim и rollback; проверить serial histories.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

302. Реализовать lock compatibility matrix

     **Ответ:** Задать матрицу S/X/других режимов и проверить request против всех несовместимых holders. Grant и enqueue выполнить атомарно, release пересматривает ожидающих с выбранной fairness; unit cases покрывают reader-reader, reader-writer и upgrades.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

303. Реализовать page latch для B-Tree

     **Ответ:** Объявить occupancy/separator invariants, реализовать search и insert split, затем delete rebalance и linked-leaf range. Concurrency вводить через доказанный latch/version protocol; проверять после interleavings keys/order/depth и equivalence reference map.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

304. Реализовать lock escalation threshold

     **Ответ:** Escalation заменяет много мелких locks более крупным с сохранением защиты и может увеличить блокирование. Не каждая СУБД выполняет row→table escalation; поведение уточняют по продукту/версии. Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

305. Реализовать key-range locking

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

306. Реализовать deadlock-safe lock upgrade

     **Ответ:** Для S→X проверить других владельцев и очередь upgrades; не допускать, чтобы два owners бесконечно держали S и ждали X. Выбрать один upgrader/abort victim либо release-and-revalidate protocol; проверить cycle и сохранение read invariant.

     **Типичная ошибка:** Считать любой timeout deadlock либо повторять только последний statement отменённой транзакции.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

307. Реализовать partitioned lock table

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

308. Реализовать intent hierarchy: table/page/row

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

309. Реализовать fair lock scheduler

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

310. Реализовать lock statistics counters

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[D]**

311. Почему throughput падает при росте числа потоков?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Типичная ошибка:** Смешивать transactional lock, page latch и pin, считая их взаимозаменяемыми.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

312. Почему возникает lock convoy?

     **Ответ:** Convoy возникает, когда множество threads стоит за holder, а wakeup/scheduling делает последовательную передачу ресурса дорогой. Уменьшение critical section, batching и concurrency limit полезнее бесконечного добавления workers. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

313. Почему table lock появился “неожиданно”?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

314. Почему hot row убивает всю систему?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

315. Почему lock table потребляет слишком много памяти?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

316. Почему latch contention выше lock contention?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

317. Почему B-Tree split приводит к всплеску блокировок?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

318. Почему upgrade lock приводит к зависаниям?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

319. Как найти самый конфликтный объект в системе?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

320. Как понять, что проблема в lock granularity?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

### L3

**[T]**

321. Как устроен lock manager внутри СУБД?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

322. Как проектировать lock table под миллионы lock entries?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

323. Как хеширование объектов влияет на contention в lock manager?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

324. Что такое lock partitioning/sharding?

     **Ответ:** Lock table делится по hash object ID на независимые partitions/stripes. Это снижает shared mutex contention, но не logical конфликт одной строки; multi-partition операции требуют единого lock order.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)

325. Как избежать глобального mutex в lock subsystem?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

326. Как сочетаются latches, locks и MVCC?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

327. Что такое optimistic locking на уровне строк?

     **Ответ:** Row-level optimistic locking проверяет ожидаемую version в условном UPDATE и атомарно увеличивает её. Если affected rows=0, read-modify-write повторяют/отклоняют; межстрочный инвариант это автоматически не защищает.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

328. Как range locks реализуются поверх индекса?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

329. Почему readers-writer lock не всегда хорош для БД?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

330. Как starvation и fairness влияют на latency profile?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


**[P]**

331. Реализовать sharded lock manager

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

332. Реализовать lock-free wait queue metadata

     **Ответ:** Lock-free гарантирует системный прогресс, а не ограниченное время каждой операции и не отсутствие contention. CAS loops требуют memory-order proof, защиты ABA и reclamation; использование atomic pointer не делает структуру автоматически lock-free. Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

333. Реализовать intrusive lock request list

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

334. Реализовать B-Tree latch coupling

     **Ответ:** Объявить occupancy/separator invariants, реализовать search и insert split, затем delete rebalance и linked-leaf range. Concurrency вводить через доказанный latch/version protocol; проверять после interleavings keys/order/depth и equivalence reference map.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)

335. Реализовать optimistic read + validation

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

336. Реализовать partition-local lock statistics

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

337. Реализовать wait-for graph hooks в lock manager

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

338. Реализовать adaptive spinning before sleep

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

339. Реализовать NUMA-aware lock table

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

340. Реализовать lock instrumentation для perf tracing

     **Ответ:** Определить lock IDs, совместимые режимы, owners и очередь waiters. Захват/освобождение сделать атомарными, добавить cancellation/deadlock handling, удерживать locks до безопасной границы выбранного протокола.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[D]**

341. Как расследовать contention в lock manager через perf/futex traces?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

342. Почему spinlock лучше на 4 ядрах и хуже на 64?

     **Ответ:** Spin тратит CPU, ожидая очень короткий hold, sleep блокирует thread с scheduler/wakeup overhead. Долгое spinning под preemption/NUMA contention ухудшает progress; choice зависит от hold distribution и oversubscription. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

343. Почему false sharing внутри lock table убивает throughput?

     **Ответ:** Независимые записи разных threads в одну cache line вызывают invalidation/migration. Проверять perf c2c и расположение hot fields; padding увеличивает footprint и не лечит true sharing одного счётчика. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

344. Как доказать, что bottleneck в lock hash bucket?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

345. Почему futex wake storms портят p99?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

346. Как отличить проблему logical lock от latch contention в индексе?

     **Ответ:** Latch защищает краткое изменение физической структуры page/node, logical lock — транзакционный объект или predicate. Latch обычно не держат до commit; освобождение одного не заменяет другой механизм. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

347. Почему fair scheduling снизил throughput?

     **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

348. Как диагностировать starvation на горячих ключах?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

349. Почему memory allocator стал bottleneck для lock requests?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak. Сопоставить perf stacks, allocation profile, cache/TLB misses и remote NUMA с p99. Отличить leak от retention/fragmentation и true contention от false sharing, затем менять одну подтверждённую причину.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

350. Как отладить race при release/wakeup в lock manager?

     **Ответ:** Lease даёт ограниченное во времени право при оговорённых clock/communication assumptions. Pause/skew/partition могут оставить старого владельца активным, поэтому critical writes требуют resource-side fencing/consensus rules. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

### L4

**[S]**

351. Как выбирать granularity блокировок для нового storage engine?

     **Ответ:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

352. Когда стоит предпочесть MVCC + short latches вместо long locks?

     **Ответ:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

353. Как проектировать lock subsystem для highly contended workload?

     **Ответ:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

354. Когда оправдан optimistic concurrency control?

     **Ответ:** Optimistic control читает/вычисляет без длительных pessimistic locks, затем валидирует read/write dependencies перед commit. Проверка только версии записываемой строки не исключает write skew; при провале повторяют целую транзакцию.

     **Рекомендация:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

355. Как строить observability для lock wait и contention?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

356. Как выбирать между fairness и throughput?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput.

     **Рекомендация:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

357. Как спроектировать locking strategy для B-Tree/LSM engine?

     **Ответ:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

358. Как бороться с hot keys на архитектурном уровне?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Рекомендация:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

359. Когда полезна partitioning/sharding lock table?

     **Ответ:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

360. Как документировать lock semantics для application engineers?

     **Ответ:** Сужать scope и длительность locks, задавать единый порядок, короткие транзакции и bounded waits. Оптимизация throughput не должна исключать защиту предиката/инварианта; retry aborted transactions должен быть безопасным.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

## 🔹 Deadlocks

---

### L1

**[T]**

361. Что такое deadlock?

     **Ответ:** Цикл ожидания ресурсов, при котором участники не могут продвинуться. Задавать единый порядок locks или применять std::scoped_lock, не выполнять неизвестные callbacks под lock.

     **Источник:** [C++ working draft: Mutex requirements](https://eel.is/c++draft/thread.mutex.requirements)

362. Чем deadlock отличается от обычного lock wait?

     **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

363. Какие 4 условия делают deadlock возможным?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

364. Как выглядит классический deadlock между двумя транзакциями?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

365. Почему deadlock нельзя “починить” только timeout-ами?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

366. Что такое victim transaction?

     **Ответ:** Victim — транзакция, выбранная для abort ради разрыва deadlock/конфликта. Её изменения откатываются по протоколу, locks освобождаются, а приложение должно безопасно повторить целую транзакцию при retryable исходе.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

367. Что происходит после обнаружения deadlock?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

368. Почему rollback одной транзакции обычно снимает deadlock?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

369. Что такое livelock и чем он отличается от deadlock?

     **Ответ:** При livelock участники продолжают действия/retries, но полезного прогресса нет; при deadlock блокируются в цикле ожидания. Bounded randomized backoff/очередь/приоритеты помогают liveness, но корректность data protocol сохраняется отдельно.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

370. Почему deterministic order locking уменьшает риск deadlock?

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


**[P]**

371. Смоделировать deadlock на двух mutex/rows

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

372. Реализовать wait-for graph

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

373. Реализовать cycle detection

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

374. Реализовать выбор victim transaction

     **Ответ:** Задать детерминированный victim policy с учётом возраста/стоимости отката, отметить abort и безопасно отменить ожидания. Rollback всей транзакции предшествует освобождению защиты; retry запускает весь business unit с bounded backoff и стабильным operation ID.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

375. Реализовать abort и повторный запуск транзакции

     **Ответ:** Задать детерминированный victim policy с учётом возраста/стоимости отката, отметить abort и безопасно отменить ожидания. Rollback всей транзакции предшествует освобождению защиты; retry запускает весь business unit с bounded backoff и стабильным operation ID.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

376. Смоделировать deadlock при lock upgrade

     **Ответ:** Для S→X проверить других владельцев и очередь upgrades; не допускать, чтобы два owners бесконечно держали S и ждали X. Выбрать один upgrader/abort victim либо release-and-revalidate protocol; проверить cycle и сохранение read invariant.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

377. Реализовать timeout-based detection

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

378. Написать unit test на deadlock reproduction

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

379. Реализовать логирование цепочки ожидания

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

380. Реализовать deadlock detector thread

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

### L2

**[T]**

381. Какие стратегии есть: detection, prevention, avoidance?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

382. Что такое wait-die?

     **Ответ:** Timestamp-based prevention разрывает потенциальный цикл, допуская ожидание только в определённом направлении возраста. Wait-die aborts younger waiter, wound-wait aborts younger holder; retries обычно сохраняют исходный возраст для снижения starvation.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

383. Что такое wound-wait?

     **Ответ:** Timestamp-based prevention разрывает потенциальный цикл, допуская ожидание только в определённом направлении возраста. Wait-die aborts younger waiter, wound-wait aborts younger holder; retries обычно сохраняют исходный возраст для снижения starvation.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

384. Как timestamps помогают предотвращать deadlock?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

385. Почему deadlock detection имеет overhead?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

386. Как часто нужно запускать detector?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

387. Что такое distributed deadlock?

     **Ответ:** Цикл ожиданий может проходить через несколько узлов, поэтому локальные graphs не показывают полный deadlock. Distributed detector/timeout-victim protocol должен учитывать stale edges и корректно отменять одну transaction без conflicting commit.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

388. Почему range locks увеличивают вероятность deadlock?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

389. Почему lock upgrade особенно опасен?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

390. Как retry логика после deadlock влияет на нагрузку?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[P]**

391. Реализовать wait-die

     **Ответ:** Timestamp-based prevention разрывает потенциальный цикл, допуская ожидание только в определённом направлении возраста. Wait-die aborts younger waiter, wound-wait aborts younger holder; retries обычно сохраняют исходный возраст для снижения starvation. Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

392. Реализовать wound-wait

     **Ответ:** Timestamp-based prevention разрывает потенциальный цикл, допуская ожидание только в определённом направлении возраста. Wait-die aborts younger waiter, wound-wait aborts younger holder; retries обычно сохраняют исходный возраст для снижения starvation. Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

393. Реализовать timestamp ordering для lock requests

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

394. Реализовать distributed-style edge export для wait-for graph

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

395. Реализовать backoff после deadlock retry

     **Ответ:** Распознать retryable ошибки, сохранить operation ID, ограничить attempts и общий deadline. Перед попыткой выбрать full-jitter delay в [0,min(cap,base×2^n)], учитывать Retry-After; успешный ранее committed эффект не повторять.

     **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

396. Реализовать adaptive detector interval

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

397. Реализовать deadlock-safe lock ordering helper API

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

398. Реализовать detector с инкрементальным обновлением графа

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

399. Написать workload generator для разных типов deadlock

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

400. Реализовать статистику deadlock frequency по объектам

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[D]**

401. Почему deadlock rate вырос после релиза?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Типичная ошибка:** Считать любой timeout deadlock либо повторять только последний statement отменённой транзакции.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

402. Почему приложение стало бесконечно ретраить транзакции?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

403. Почему timeout-ы маскируют настоящую проблему?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

404. Как понять, что это deadlock, а не starvation?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

405. Почему deadlock возникает только на production данных?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

406. Как найти SQL/операции, образующие цикл?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

407. Почему добавление индекса изменило deadlock pattern?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

408. Почему batch updates резко увеличили число deadlock?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

409. Как расследовать deadlock в mixed OLTP/maintenance workload?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

410. Почему victim selection ухудшает throughput?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)


---

### L3

**[T]**

411. Как проектируется deadlock detector в high-throughput СУБД?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

412. Как минимизировать overhead от wait-for graph?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

413. Как строить edges без глобального lock?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

414. Как deadlock detector взаимодействует с lock manager?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

415. Чем distributed deadlock detection сложнее локального?

     **Ответ:** Цикл ожиданий может проходить через несколько узлов, поэтому локальные graphs не показывают полный deadlock. Distributed detector/timeout-victim protocol должен учитывать stale edges и корректно отменять одну transaction без conflicting commit.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

416. Почему false positives/negatives опасны?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

417. Как связаны deadlock, lock escalation и range locking?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines. Escalation заменяет много мелких locks более крупным с сохранением защиты и может увеличить блокирование. Не каждая СУБД выполняет row→table escalation; поведение уточняют по продукту/версии.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

418. Как проектировать abort-safe cleanup?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

419. Как rollback cost влияет на victim selection?

     **Ответ:** Deadlock — цикл ожидания ресурсов, а длительная очередь без цикла — blocking. Даже один SQL statement может захватывать несколько row/index/FK ресурсов в разном порядке у конкурентных транзакций.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

420. Как observability помогает расследовать deadlocks?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


**[P]**

421. Реализовать инкрементальный wait-for graph с шардированием

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

422. Реализовать victim selection по cost heuristic

     **Ответ:** Задать детерминированный victim policy с учётом возраста/стоимости отката, отметить abort и безопасно отменить ожидания. Rollback всей транзакции предшествует освобождению защиты; retry запускает весь business unit с bounded backoff и стабильным operation ID.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

423. Реализовать detector без полного сканирования графа

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

424. Реализовать deadlock event trace для postmortem

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

425. Реализовать per-transaction dependency tracking

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

426. Реализовать rollback-aware victim policy

     **Ответ:** Задать детерминированный victim policy с учётом возраста/стоимости отката, отметить abort и безопасно отменить ожидания. Rollback всей транзакции предшествует освобождению защиты; retry запускает весь business unit с bounded backoff и стабильным operation ID.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

427. Реализовать graph snapshot для отладки

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

428. Реализовать integration tests с forced interleavings

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

429. Реализовать fault injection для deadlock windows

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)

430. Реализовать дедупликацию repeated deadlock reports

     **Ответ:** Для ожиданий строить directed graph waiter→holder и искать цикл; выбрать victim, откатить её и освободить locks. Перепроверять состояние под синхронизацией и корректно отменять ожидания; test должен воспроизводить цикл barriers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


**[D]**

431. Как расследовать редкий deadlock, который случается раз в неделю?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

432. Почему detector сам стал bottleneck?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

433. Как отличить локальный deadlock от распределённого?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

434. Почему deadlock исчезает под debugger/trace?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

435. Как восстановить цикл ожидания из логов и tracepoints?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

436. Почему изменение порядка обхода индекса изменило deadlock rate?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

437. Как доказать, что причина в lock upgrade path?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

438. Почему retry storm после deadlock положил сервис?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

439. Как оценить, выгоднее prevention или detection на данном workload?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

440. Как построить tooling для автоматического анализа deadlock dumps?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

### L4

**[S]**

441. Какую стратегию борьбы с deadlock выбрать для новой СУБД?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

442. Когда лучше prevention, а когда detection?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

443. Как проектировать application API, уменьшающий вероятность deadlock?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

444. Как стандартизировать порядок доступа к ресурсам в большой кодовой базе?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

445. Как проектировать retry policy после deadlock без retry storm?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

446. Как экспонировать deadlock метрики и алерты?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

447. Как обучать команды писать transaction-safe бизнес-логику?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

448. Как менять схему/индексы, не ухудшая deadlock profile?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

449. Как строить resilience для workloads с высоким конфликтом?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

450. Как включать deadlock analysis в регулярный performance review storage engine?

     **Ответ:** Единый порядок объектов/ключей, короткие batches и подходящие indexes уменьшают риск. Сохранить victim abort/retry как нормальную часть эксплуатации; профилактика через грубую глобальную блокировку может разрушить concurrency.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

## 🔹 Смешанные cross-topic вопросы

### L2–L3

**[T]**

451. Чем MVCC + read committed отличается от strict 2PL + read committed по свойствам и perf?

     **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок. 2PL делит acquisition и release phases, запрещая новые locks после начала release; strict вариант удерживает write locks до исхода транзакции. Для predicate serializability нужны соответствующие range/predicate locks, а deadlocks всё ещё возможны.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

452. Почему serializable на MVCC и serializable на 2PL дают разный runtime profile?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)

453. Как WAL, locks и buffer pool взаимодействуют в commit path?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Пример:** pageLSN=120 нельзя flush как durable page, пока durable WAL LSN меньше 120.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

454. Почему long transaction одновременно портит и MVCC cleanup, и lock contention?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

455. Как replication влияет на perceived consistency у клиентов?

     **Ответ:** Транзакция фиксирует единый набор изменений либо откатывает его; isolation определяет допустимые конкурентные истории, durability — устойчивость ACK при объявленной модели отказа. Инварианты, отсутствующие в constraints/коде, СУБД сама не изобретает.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

456. Чем логическая консистентность приложения отличается от serializability СУБД?

     **Ответ:** Транзакция фиксирует единый набор изменений либо откатывает его; isolation определяет допустимые конкурентные истории, durability — устойчивость ACK при объявленной модели отказа. Инварианты, отсутствующие в constraints/коде, СУБД сама не изобретает.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

457. Почему idempotency важна при retry после deadlock или serialization failure?

     **Ответ:** Идемпотентность требует, чтобы повтор одной logical operation не повторял эффект. Durable operation ID/inbox и atomic coupling с эффектом закрывают crash между apply и ACK; повтор с иным payload должен быть отличим.

     **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

458. Как checkpoint влияет на transaction throughput?

     **Ответ:** Checkpoint фиксирует безопасную recovery boundary и состояние, необходимое для восстановления; он не обязан мгновенно сбрасывать все страницы. Fuzzy checkpoint допускает работающие транзакции и требует учитывать оставшиеся dirty pages.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)

459. Почему hot key вызывает и lock contention, и version churn?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

460. Почему isolation bugs трудно ловятся обычными unit-тестами?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


**[P]**

461. Реализовать mini-DB: WAL + locks + MVCC + recovery

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

462. Реализовать serialization failure и retry policy в клиенте

     **Ответ:** Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

463. Реализовать метрики: lock_wait_ms, deadlocks, oldest_snapshot_age

     **Ответ:** Registry регистрирует read boundary до доступа к версиям и снимает её после завершения всех reads. Oldest protected boundary вычислять concurrency-safe; GC rechecks horizon и pins, включая crash/recovery consumers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

464. Реализовать chaos-тесты: crash во время commit, rollback, flush

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

465. Реализовать deterministic scheduler для воспроизведения race conditions

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

466. Написать benchmark: read-heavy / write-heavy / contended hot rows

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

467. Реализовать trace timeline транзакций для postmortem

     **Ответ:** Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

468. Реализовать property-based тесты на отсутствие dirty read/lost update

     **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit. Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Задать transaction ID, private write/undo set и состояния active/prepared/committed/aborted. Публиковать изменения атомарно, commit связывать с durable log position; проверить crash до/после каждого шага и повтор recovery.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

469. Реализовать мониторинг vacuum lag

     **Ответ:** Собирать source/sent/received/flushed/applied positions и event age по stream identity; gap/restart обрабатываются явно. Для required freshness читать после нужной applied boundary либо routing к допустимому owner, с bounded deadline.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

470. Реализовать fault injection в lock manager и WAL flush path

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


**[D]**

471. Почему после включения serializable correctness выросла, а SLA сломался?

     **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

472. Почему после оптимизации WAL неожиданно вырос deadlock rate?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

473. Почему после добавления индекса выросло число serialization failures?

     **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

474. Как расследовать периодические latency spikes каждые N секунд?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

475. Почему p50 хороший, а p99 ужасный на конкурентной нагрузке?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

476. Как понять, bottleneck в I/O, lock manager, vacuum или scheduler Linux?

     **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

477. Почему retry механизм клиента усугубил деградацию БД?

     **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

478. Как найти одну “плохую” транзакцию среди миллионов?

     **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

479. Почему maintenance job ломает OLTP consistency/latency profile?

     **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

480. Как строить postmortem по инциденту “данные не потерялись, но поведение было неконсистентным”?

     **Ответ:** Собрать transaction IDs, commit/flush LSN и историю ACK, затем воспроизвести сбой между log append, sync, page flush и ответом. Отделить нарушение инварианта приложения от нарушения atomicity/durability engine.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---
