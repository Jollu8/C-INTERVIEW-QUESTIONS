# 🧵 10. Конкурентность

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

## 🔹 Locks vs MVCC

1. (L1 [T]) Что такое pessimistic locking?

   **Ответ:** Pessimistic control заранее удерживает защиту от конфликтующей операции, optimistic сначала выполняет работу, затем validates/aborts. Выбор зависит от conflict rate и инварианта; MVCC может сочетаться с обоими подходами.

   **Пример:** Snapshot S видит версию commit_seq=10 и не видит новую commit_seq=20, если её boundary равна 15.

   **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


2. (L1 [T]) Что такое MVCC?

   **Ответ:** Версии строк и снимки позволяют читать согласованное состояние без ожидания большинства писателей. Невидимые старые версии очищаются только после исчезновения нуждающихся в них readers.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


3. (L1 [T]) В чём базовая разница между lock-based concurrency control и MVCC?

   **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


4. (L1 [T]) Почему MVCC обычно лучше для read-heavy workload?

   **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


5. (L1 [T]) Почему locks проще объяснить, но сложнее масштабировать?

   **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


6. (L1 [T]) Почему readers и writers конфликтуют в lock-based схеме?

   **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


7. (L1 [T]) Почему readers в MVCC часто не блокируют writers?

   **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


8. (L1 [T]) Что такое shared lock и exclusive lock?

   **Ответ:** Shared locks допускают совместимых readers, exclusive конфликтует с чужими incompatible locks. Upgrade S→X может образовать deadlock; режимы и матрица совместимости зависят от уровня объекта и СУБД.

   **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


9. (L1 [T]) Почему MVCC не отменяет необходимость блокировок полностью?

   **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


10. (L1 [T]) Что такое snapshot read?

    **Ответ:** Snapshot read выбирает версии, видимые фиксированной boundary/набору активных транзакций. Оно не обязано показывать последние global writes и не является само по себе serializable multi-operation transaction.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


11. (L1 [P]) Реализовать row-level shared/exclusive lock manager

    **Ответ:** Задать матрицу S/X/других режимов и проверить request против всех несовместимых holders. Grant и enqueue выполнить атомарно, release пересматривает ожидающих с выбранной fairness; unit cases покрывают reader-reader, reader-writer и upgrades.

    **Типичная ошибка:** Смешивать transactional lock, page latch и pin, считая их взаимозаменяемыми.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


12. (L1 [P]) Реализовать простейшую MVCC-модель с versioned rows

    **Ответ:** Версия хранит row ID, value, creator/commit metadata и ссылку на предыдущую. UPDATE создаёт новую версию и публикует head атомарно по protocol; aborted версия невидима, reclaim ждёт active snapshots/readers.

    **Типичная ошибка:** Удалять старую версию только потому, что она не нужна текущему состоянию, игнорируя активные snapshots.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


13. (L1 [P]) Реализовать snapshot read для одной таблицы

    **Ответ:** Создать read-only transaction snapshot, все lookups выполнять по одной boundary и удерживать её до конца. Отдельно определить statement vs transaction scope, собственные writes/replica freshness; проверить concurrent insert/update/delete.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


14. (L1 [P]) Реализовать update через append новой версии строки

    **Ответ:** Версия хранит row ID, value, creator/commit metadata и ссылку на предыдущую. UPDATE создаёт новую версию и публикует head атомарно по protocol; aborted версия невидима, reclaim ждёт active snapshots/readers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


15. (L1 [P]) Реализовать тест: reader-writer contention в lock-based и MVCC вариантах

    **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


16. (L2 [T]) Почему MVCC обычно требует garbage collection/vacuum?

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


17. (L2 [T]) Почему lock-based схема может страдать от convoying?

    **Ответ:** Convoy возникает, когда множество threads стоит за holder, а wakeup/scheduling делает последовательную передачу ресурса дорогой. Уменьшение critical section, batching и concurrency limit полезнее бесконечного добавления workers.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


18. (L2 [T]) Почему MVCC может страдать от version chain traversal?

    **Ответ:** Version chain связывает состояния одной записи; lookup ищет новейшую видимую snapshot версию. Длинная цепочка увеличивает memory reads/cache misses, cleanup ограничен активными readers и crash-safe visibility metadata.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


19. (L2 [T]) Что такое optimistic vs pessimistic concurrency?

    **Ответ:** Pessimistic control заранее удерживает защиту от конфликтующей операции, optimistic сначала выполняет работу, затем validates/aborts. Выбор зависит от conflict rate и инварианта; MVCC может сочетаться с обоими подходами.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


20. (L2 [T]) Почему hot rows остаются проблемой и для MVCC, и для locking?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


21. (L2 [T]) Что такое lock escalation и почему MVCC не имеет прямого аналога?

    **Ответ:** Escalation заменяет много мелких locks более крупным с сохранением защиты и может увеличить блокирование. Не каждая СУБД выполняет row→table escalation; поведение уточняют по продукту/версии.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


22. (L2 [T]) Как MVCC влияет на usage памяти и диска?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


23. (L2 [T]) Почему long-running transactions особенно болезненны для MVCC?

    **Ответ:** Долгий snapshot удерживает версии и может мешать vacuum/compaction, увеличивая storage и read work. Ограничение срока/прерывание старых readers — эксплуатационная политика с явными последствиями для клиента.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


24. (L2 [T]) Почему locks могут давать более предсказуемую semantics, чем snapshot-based reads?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


25. (L2 [T]) Почему MVCC и locks часто комбинируются в одной СУБД?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


26. (L2 [P]) Реализовать hybrid scheme: MVCC for reads + X-lock for writes

    **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


27. (L2 [P]) Реализовать active transaction table для MVCC

    **Ответ:** Map tx_id→state/start/read boundary/lastLSN с атомарным переходом active→committed/aborted. Readers используют согласованное visibility состояние, recovery восстанавливает необходимую metadata; reclaim только после исчезновения использующих её snapshots.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Mohan et al.: ARIES](https://doi.org/10.1145/128765.128770); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


28. (L2 [P]) Реализовать vacuum старых версий

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


29. (L2 [P]) Реализовать lock wait queue

    **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


30. (L2 [P]) Реализовать benchmark read-heavy vs write-heavy under locks and MVCC

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


31. (L2 [D]) Почему MVCC engine использует много памяти даже при малом объёме живых данных?

    **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Типичная ошибка:** Удалять старую версию только потому, что она не нужна текущему состоянию, игнорируя активные snapshots.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


32. (L2 [D]) Почему lock-based engine резко деградирует при росте числа потоков?

    **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


33. (L2 [D]) Почему latency на MVCC сильно растёт после длинной транзакции?

    **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


34. (L2 [D]) Почему lock waits почти нет, но throughput всё равно плохой?

    **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


35. (L2 [D]) Почему “переключение на MVCC” не решило проблему hot keys?

    **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


36. (L3 [T]) Как MVCC и locks сочетаются на уровне storage engine?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


37. (L3 [T]) Почему page latches и logical locks — разные сущности?

    **Ответ:** Latch защищает краткое изменение физической структуры page/node, logical lock — транзакционный объект или predicate. Latch обычно не держат до commit; освобождение одного не заменяет другой механизм.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


38. (L3 [T]) Как MVCC влияет на secondary indexes?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


39. (L3 [T]) Почему lock manager и version manager оба могут быть bottleneck?

    **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


40. (L3 [T]) Как epoch-based reclamation связана с MVCC cleanup?

    **Ответ:** После удаления узла читатель может всё ещё держать ссылку; release/acquire не решает lifetime. Hazard pointers, epochs/RCU или иной доказанный protocol откладывают free, а ABA требует учитывать повторное использование identity. Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать.

    **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [Raft paper](https://raft.github.io/raft.pdf)


41. (L3 [T]) Почему strict 2PL проще формально, но хуже по concurrency profile?

    **Ответ:** 2PL делит acquisition и release phases, запрещая новые locks после начала release; strict вариант удерживает write locks до исхода транзакции. Для predicate serializability нужны соответствующие range/predicate locks, а deadlocks всё ещё возможны.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [CMU 15-445: Two-phase locking](https://15445.courses.cs.cmu.edu/fall2024/notes/17-twophaselocking.pdf)


42. (L3 [T]) Как cache locality влияет на performance lock table vs version chains?

    **Ответ:** Version chain связывает состояния одной записи; lookup ищет новейшую видимую snapshot версию. Длинная цепочка увеличивает memory reads/cache misses, cleanup ограничен активными readers и crash-safe visibility metadata.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


43. (L3 [T]) Как NUMA усиливает contention в глобальном lock manager?

    **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


44. (L3 [T]) Почему MVCC cleanup может разрушить p99 latency?

    **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


45. (L3 [T]) Почему readers-writer locks редко оказываются идеальным ответом для DB concurrency?

    **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


46. (L3 [P]) Реализовать sharded lock manager

    **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


47. (L3 [P]) Реализовать MVCC visibility cache

    **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


48. (L3 [P]) Реализовать hybrid lock+MVCC engine для hot updates

    **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


49. (L3 [P]) Реализовать per-key contention counters

    **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


50. (L3 [P]) Реализовать trace: lock wait / version traversal / retry reasons

    **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла. У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


51. (L3 [D]) Как доказать, что bottleneck в lock manager, а не в I/O?

    **Ответ:** Снять wait-for graph с режимами/объектами, blocker transaction age и wait duration. Отличить row/table lock от latch, pool wait и CPU spin; короткие запросы могут ждать долгую открытую транзакцию.

    **Типичная ошибка:** Смешивать transactional lock, page latch и pin, считая их взаимозаменяемыми.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


52. (L3 [D]) Почему MVCC engine CPU-bound при низком disk util?

    **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


53. (L3 [D]) Почему visibility checks стали дороже после роста concurrency?

    **Ответ:** Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


54. (L3 [D]) Как расследовать race между vacuum и readers?

    **Ответ:** Очистка версий ограничена oldest active snapshot и другими retention consumers. Долгие readers/slots могут удерживать старые данные; физическое освобождение места и возможность повторного использования страниц — разные события. Проверить age/duration snapshots, dead/live versions, cleanup horizon, transaction state и visibility logic. Сверить чтение по фиксированному snapshot с эталоном; долгие readers способны вызвать bloat даже без растущего live dataset.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


55. (L3 [D]) Почему contention на transaction ID allocator ломает throughput?

    **Ответ:** Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak. Сопоставить perf stacks, allocation profile, cache/TLB misses и remote NUMA с p99. Отличить leak от retention/fragmentation и true contention от false sharing, затем менять одну подтверждённую причину.

    **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


56. (L4 [S]) Когда стоит предпочесть locks, а когда MVCC?

    **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


57. (L4 [S]) Как проектировать concurrency control для in-memory DB?

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Рекомендация:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


58. (L4 [S]) Как сочетать MVCC, short latches и optimistic techniques?

    **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


59. (L4 [S]) Как строить observability для lock waits, aborts и version churn?

    **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла.

    **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


60. (L4 [S]) Как объяснять команде, что MVCC — это не “бесплатная конкурентность”, а другой набор trade-offs?

    **Ответ:** Связать snapshot semantics, conflict checks и version GC с isolation. Ограничить долгие транзакции, наблюдать retained bytes/oldest snapshot и предусмотреть восстановление transaction metadata после crash.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


---

## 🔹 Isolation anomalies

61. (L1 [T]) Что такое isolation anomaly?

    **Ответ:** Interleaving — конкретное чередование операций транзакций; anomaly — история, запрещённая выбранной моделью/инвариантом. Проверка только final state недостаточна: наблюдавшиеся readers результаты тоже входят в correctness.

    **Пример:** T1 читает остаток, T2 меняет его и commit, T1 повторяет чтение: результат зависит от statement/transaction snapshot.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


62. (L1 [T]) Что такое dirty read?

    **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


63. (L1 [T]) Что такое non-repeatable read?

    **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Non-repeatable read — повторное чтение той же логической строки возвращает иное committed значение. Phantom относится к составу predicate result; стабильный snapshot скрывает оба наблюдения, но не все аномалии записи.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


64. (L1 [T]) Что такое lost update?

    **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


65. (L1 [T]) Почему аномалии возникают только при конкуренции транзакций?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


66. (L1 [T]) Что такое interleaving транзакций?

    **Ответ:** Interleaving — конкретное чередование операций транзакций; anomaly — история, запрещённая выбранной моделью/инвариантом. Проверка только final state недостаточна: наблюдавшиеся readers результаты тоже входят в correctness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


67. (L1 [T]) Почему read committed допускает часть аномалий?

    **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


68. (L1 [T]) Почему repeatable read сильнее read committed?

    **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок. Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


69. (L1 [T]) Почему serializable — самый сильный практический уровень?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


70. (L1 [T]) Почему бизнес-неконсистентность и DB-level anomaly — не одно и то же?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


71. (L1 [P]) Смоделировать dirty read на двух потоках

    **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Типичная ошибка:** Принимать стабильный snapshot или отсутствие одинаковых write keys за доказательство serializability.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


72. (L1 [P]) Смоделировать lost update

    **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


73. (L1 [P]) Смоделировать non-repeatable read

    **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Non-repeatable read — повторное чтение той же логической строки возвращает иное committed значение. Phantom относится к составу predicate result; стабильный snapshot скрывает оба наблюдения, но не все аномалии записи. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


74. (L1 [P]) Реализовать history logger для read/write events

    **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


75. (L1 [P]) Реализовать validator на dirty read/lost update scenarios

    **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit. Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


76. (L2 [T]) Почему snapshot isolation убирает часть аномалий, но не все?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


77. (L2 [T]) Почему repeatable read не всегда достаточно для correctness?

    **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


78. (L2 [T]) Что такое write-write conflict?

    **Ответ:** Write-write conflict — concurrent изменения одного логического объекта; snapshot engines часто отклоняют одного writer. В multi-leader нужно явное resolution, а разные write sets всё ещё могут совместно нарушить invariant через write skew.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


79. (L2 [T]) Что такое read-write dependency?

    **Ответ:** Read-write anti-dependency возникает, когда writer меняет значение/предикат, прочитанный reader из более ранней версии. Циклы зависимостей могут возникнуть без пересечения write sets и лежат в основе write skew/SSI detection.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


80. (L2 [T]) Почему anomaly часто воспроизводится только под нагрузкой?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


81. (L2 [T]) Почему “всё работает в тестах” не доказывает отсутствие isolation bugs?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


82. (L2 [T]) Почему retry после serialization failure — часть correctness модели?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


83. (L2 [T]) Что такое serialization graph?

    **Ответ:** В graph узлы — транзакции, рёбра — соответствующие зависимости операций. Цикл conflict graph указывает на нарушение conflict serializability при его предпосылках; final-state comparison без read history не обнаруживает все аномалии.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


84. (L2 [T]) Почему application-level read-modify-write особенно опасен?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


85. (L2 [T]) Почему long transactions увеличивают вероятность аномалий?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


86. (L2 [P]) Реализовать precedence/conflict graph builder

    **Ответ:** В graph узлы — транзакции, рёбра — соответствующие зависимости операций. Цикл conflict graph указывает на нарушение conflict serializability при его предпосылках; final-state comparison без read history не обнаруживает все аномалии. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


87. (L2 [P]) Реализовать generator interleavings для двух транзакций

    **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


88. (L2 [P]) Реализовать conflict detector для lost update

    **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


89. (L2 [P]) Реализовать optimistic validation at commit

    **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

    **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


90. (L2 [P]) Реализовать test harness для repeatable anomalies under load

    **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


91. (L2 [D]) Почему приложение видит “странные данные”, хотя явных ошибок нет?

    **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

    **Типичная ошибка:** Принимать стабильный snapshot или отсутствие одинаковых write keys за доказательство serializability.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


92. (L2 [D]) Почему race condition проявляется только на production dataset?

    **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


93. (L2 [D]) Почему read committed иногда даёт логически неконсистентные результаты?

    **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


94. (L2 [D]) Почему после перехода на serializable выросло число retry/abort?

    **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


95. (L2 [D]) Почему anomaly исчезает под debugger или single-threaded replay?

    **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


96. (L3 [T]) Как формально описываются anomalies через histories и conflict graphs?

    **Ответ:** В graph узлы — транзакции, рёбра — соответствующие зависимости операций. Цикл conflict graph указывает на нарушение conflict serializability при его предпосылках; final-state comparison без read history не обнаруживает все аномалии.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


97. (L3 [T]) Чем conflict serializability отличается от view serializability?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


98. (L3 [T]) Как Serializable Snapshot Isolation (SSI) ловит dangerous structures?

    **Ответ:** Snapshot isolation предотвращает часть аномалий, но допускает циклы read-write dependencies без прямого write-write конфликта. Serializable должен исключать такие histories, иногда ценой abort/retry. SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


99. (L3 [T]) Почему predicate dependencies труднее ловить, чем row conflicts?

    **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


100. (L3 [T]) Как optimizer/planner косвенно влияет на вероятность аномалий через access path?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


101. (L3 [T]) Почему covering index может менять конфликтный профиль workload?

     **Ответ:** Covering требует наличия всех полей query в index, включая predicates/order, но не гарантирует index-only физическое чтение. Payload columns и широкий composite key увеличивают размер и write maintenance.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


102. (L3 [T]) Как read-only transactions участвуют в serialization graph?

     **Ответ:** В graph узлы — транзакции, рёбра — соответствующие зависимости операций. Цикл conflict graph указывает на нарушение conflict serializability при его предпосылках; final-state comparison без read history не обнаруживает все аномалии. Read-only транзакция может удерживать snapshot/versions, занимать I/O/CPU и влиять на serializable dependencies. Отсутствие write не означает отсутствие эксплуатационных последствий или обязательного abort при любой реализации.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


103. (L3 [T]) Почему anomaly detection сама может иметь overhead и false positives?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


104. (L3 [T]) Как distributed replication усложняет reasoning о local isolation anomalies?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


105. (L3 [T]) Почему correctness under concurrency требует не только DB guarantees, но и transaction design discipline?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


106. (L3 [P]) Реализовать cycle detection в serialization graph

     **Ответ:** Под синхронизацией фиксировать waiter→holders edges и удалять их при grant/cancel/release. DFS colours/Tarjan на согласованном снимке находит cycle; перед abort victim перепроверить актуальность edges, затем откатить транзакцию и разбудить waiters.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


107. (L3 [P]) Реализовать SSI-style rw-conflict tracking

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


108. (L3 [P]) Реализовать trace capture для later anomaly replay

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


109. (L3 [P]) Реализовать property-based testing для concurrency anomalies

     **Ответ:** Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


110. (L3 [P]) Реализовать deterministic scheduler для воспроизведения race conditions

     **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Составить расписание двух/трёх транзакций с barriers: reads, conflicting writes и commits. Проверять наблюдения и final invariant, целиком повторять aborted serializable transaction; не полагаться на случайные sleep для воспроизводимости.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


111. (L3 [D]) Как доказать, что observed bug — это isolation anomaly, а не баг бизнес-логики?

     **Ответ:** Interleaving — конкретное чередование операций транзакций; anomaly — история, запрещённая выбранной моделью/инвариантом. Проверка только final state недостаточна: наблюдавшиеся readers результаты тоже входят в correctness. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


112. (L3 [D]) Почему serialization failures выросли после добавления индекса?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


113. (L3 [D]) Как расследовать редкую anomaly, происходящую раз в несколько дней?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


114. (L3 [D]) Почему retry loop сам стал источником деградации?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


115. (L3 [D]) Как собрать минимальный воспроизводимый schedule для production race?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


116. (L4 [S]) Какой isolation level выбирать по умолчанию для OLTP-системы?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


117. (L4 [S]) Когда достаточно read committed, а когда нужен serializable?

     **Ответ:** Read Committed в PostgreSQL берёт новый snapshot на statement, поэтому повторный SELECT в одной транзакции может видеть новые committed данные. Lost-update/read-modify-write безопасность зависит от формы UPDATE и дополнительных проверок.

     **Рекомендация:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


118. (L4 [S]) Как проектировать API и transaction boundaries, чтобы минимизировать anomalies?

     **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics.

     **Рекомендация:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


119. (L4 [S]) Как обучать команды мыслить schedule-ами, а не только SQL-запросами?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


120. (L4 [S]) Как строить testing strategy, ловящую concurrency anomalies до production?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


---

## 🔹 Phantom reads

121. (L1 [T]) Что такое phantom read?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Пример:** T1 читает WHERE price BETWEEN 10 AND 20; T2 вставляет price=15 и commit; дальнейшее поведение задаётся isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


122. (L1 [T]) Чем phantom read отличается от non-repeatable read?

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Non-repeatable read — повторное чтение той же логической строки возвращает иное committed значение. Phantom относится к составу predicate result; стабильный snapshot скрывает оба наблюдения, но не все аномалии записи.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


123. (L1 [T]) Почему phantom связан с предикатом, а не только с конкретной строкой?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


124. (L1 [T]) Как insert новой строки может вызвать phantom?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


125. (L1 [T]) Почему повторный `SELECT WHERE condition` может вернуть другой набор строк?

     **Ответ:** Phantom — изменение множества строк, удовлетворяющих повторному predicate read. Snapshot может скрыть новые строки от reader, но предотвращение predicate-based нарушения инварианта требует serializability либо подходящего range/predicate locking.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


126. (L1 [T]) Почему row locks не всегда защищают от phantom?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


127. (L1 [T]) Что такое range/predicate lock?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


128. (L1 [T]) Почему serializable должен учитывать phantoms?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


129. (L1 [T]) Почему phantom важен для aggregate queries (`COUNT`, `SUM`)?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


130. (L1 [T]) Почему phantom может ломать бизнес-инварианты без явных ошибок?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


131. (L1 [P]) Смоделировать phantom read через concurrent INSERT

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


132. (L1 [P]) Реализовать range predicate test: `WHERE x BETWEEN A AND B`

     **Ответ:** T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


133. (L1 [P]) Реализовать repeatable query harness для выявления phantom

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


134. (L1 [P]) Реализовать упрощённый key-range lock

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


135. (L1 [P]) Реализовать snapshot read, устраняющий phantom в рамках одной snapshot

     **Ответ:** Создать read-only transaction snapshot, все lookups выполнять по одной boundary и удерживать её до конца. Отдельно определить statement vs transaction scope, собственные writes/replica freshness; проверить concurrent insert/update/delete.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


136. (L2 [T]) Почему MVCC snapshot часто скрывает phantom для reader-а, но не решает все predicate conflicts?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Predicate conflict возникает, когда concurrent write меняет множество/значения, прочитанные условием другой транзакции, включая ещё отсутствовавшие строки. Tracking только прочитанных row IDs пропускает вставку в пустой gap; нужны ranges/predicates либо serializable dependency validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


137. (L2 [T]) Чем key-range locking отличается от row locking?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


138. (L2 [T]) Что такое next-key locks?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


139. (L2 [T]) Почему phantom особенно важен при uniqueness/business constraints “по условию”?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


140. (L2 [T]) Почему индекс влияет на возможность и стоимость predicate locking?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


141. (L2 [T]) Почему full table scan усложняет борьбу с phantom?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


142. (L2 [T]) Почему `SELECT ... FOR UPDATE` не всегда защищает от phantom?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


143. (L2 [T]) Как phantom проявляется в `COUNT(*)`, `EXISTS`, `NOT EXISTS` запросах?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


144. (L2 [T]) Почему snapshot isolation допускает некоторые predicate anomalies?

     **Ответ:** Phantom — изменение множества строк, удовлетворяющих повторному predicate read. Snapshot может скрыть новые строки от reader, но предотвращение predicate-based нарушения инварианта требует serializability либо подходящего range/predicate locking.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


145. (L2 [T]) Почему phantom — одна из причин, почему “repeatable read” не всегда равен “serializable”?

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


146. (L2 [P]) Реализовать key-range lock поверх отсортированного индекса

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


147. (L2 [P]) Реализовать phantom detector для predicate-based histories

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. В graph узлы — транзакции, рёбра — соответствующие зависимости операций. Цикл conflict graph указывает на нарушение conflict serializability при его предпосылках; final-state comparison без read history не обнаруживает все аномалии. T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


148. (L2 [P]) Реализовать test для `COUNT WHERE ...` under concurrent inserts

     **Ответ:** T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


149. (L2 [P]) Реализовать next-key locking (упрощённо)

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


150. (L2 [P]) Реализовать benchmark predicate lock overhead vs row lock overhead

     **Ответ:** Представить locks как интервалы с явно заданными open/closed bounds и режимами, проверять overlap не только по существующим rows. INSERT в защищённый gap должен конфликтовать по протоколу; test включает пустой диапазон и boundary keys.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


151. (L2 [D]) Почему повторный COUNT даёт разный результат внутри одной бизнес-операции?

     **Ответ:** Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


152. (L2 [D]) Почему после перехода на MVCC phantom “исчез”, но логическая ошибка осталась?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


153. (L2 [D]) Почему range query неожиданно стала источником contention?

     **Ответ:** Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


154. (L2 [D]) Почему serializable workload начал часто abort-иться на insert-heavy диапазонах?

     **Ответ:** Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


155. (L2 [D]) Почему phantom воспроизводится только на определённых диапазонах ключей?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


156. (L3 [T]) Как B-Tree structure используется для реализации key-range locking?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


157. (L3 [T]) Почему predicate locking без индекса может быть слишком грубым?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


158. (L3 [T]) Как SSI ловит phantom-like dangerous structures без полного predicate locking?

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


159. (L3 [T]) Почему phantom — это конфликт между набором строк, а не отдельной версией?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


160. (L3 [T]) Как optimizer access path влияет на phantom protection semantics?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


161. (L3 [T]) Почему concurrent inserts into hot range создают avalanche aborts?

     **Ответ:** Phantom — изменение множества строк, удовлетворяющих повторному predicate read. Snapshot может скрыть новые строки от reader, но предотвращение predicate-based нарушения инварианта требует serializability либо подходящего range/predicate locking.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


162. (L3 [T]) Как partitioning/sharding влияет на predicate conflicts и phantoms?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Predicate conflict возникает, когда concurrent write меняет множество/значения, прочитанные условием другой транзакции, включая ещё отсутствовавшие строки. Tracking только прочитанных row IDs пропускает вставку в пустой gap; нужны ranges/predicates либо serializable dependency validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


163. (L3 [T]) Почему phantoms сложнее диагностировать, чем row-level lost updates?

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


164. (L3 [T]) Как index gaps и page splits влияют на lock ranges?

     **Ответ:** Split распределяет keys/records между страницами и публикует separator/links в правильном порядке. Он добавляет allocation, logging и parent updates, иногда каскад до root; запас свободного места меняет частоту, а не необходимость корректного split.

     **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


165. (L3 [T]) Почему phantom prevention часто дороже, чем кажется по учебнику?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


166. (L3 [P]) Реализовать B-Tree backed key-range lock manager

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


167. (L3 [P]) Реализовать SSI-like rw-dependency tracker для predicate reads

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


168. (L3 [P]) Реализовать trace gaps/ranges touched by each transaction

     **Ответ:** T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


169. (L3 [P]) Реализовать synthetic hotspot benchmark on insert-into-range workload

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


170. (L3 [P]) Реализовать visualization predicate conflicts over time

     **Ответ:** Predicate conflict возникает, когда concurrent write меняет множество/значения, прочитанные условием другой транзакции, включая ещё отсутствовавшие строки. Tracking только прочитанных row IDs пропускает вставку в пустой gap; нужны ranges/predicates либо serializable dependency validation. T1 выполняет range predicate, T2 вставляет/меняет подходящую строку и commit, T1 повторяет чтение/проверку. Зафиксировать expected history для уровня isolation; отдельно проверить gap/range lock и записи вне диапазона.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


171. (L3 [D]) Как доказать, что проблема именно phantom, а не обычный non-repeatable read?

     **Ответ:** Repeatable Read не имеет универсальной одинаковой реализации: PostgreSQL даёт transaction snapshot, InnoDB сочетает consistent reads с locking reads/next-key locks. Stable reads сами по себе не исключают write skew. Non-repeatable read — повторное чтение той же логической строки возвращает иное committed значение. Phantom относится к составу predicate result; стабильный snapshot скрывает оба наблюдения, но не все аномалии записи. Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


172. (L3 [D]) Почему key-range locks взорвали contention на горячем диапазоне?

     **Ответ:** Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines. Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


173. (L3 [D]) Как расследовать phantom anomaly, зависящую от выбора индекса planner-ом?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


174. (L3 [D]) Почему inserts в “соседние” ключи начали конфликтовать после изменения схемы индекса?

     **Ответ:** Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


175. (L3 [D]) Как минимально воспроизвести predicate anomaly на production-like workload?

     **Ответ:** Сопоставить query predicate, index/range locks и snapshots двух транзакций. Различать phantom observation и write skew: одинаковые повторные чтения не доказывают serializable выполнение.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


176. (L4 [S]) Когда оправдан key-range locking, а когда лучше SSI/optimistic schemes?

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. Range/next-key locks защищают также интервалы вставки, а не только существующие tuples. Предикатный tracking SSI может лишь обнаруживать зависимости; physical implementation и blocking semantics различаются у engines.

     **Рекомендация:** Защищать именно множество допустимых новых записей: constraint, serializable validation или range/parent lock с доказанным охватом. Блокировка существующих строк не закрывает пустой диапазон автоматически.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


177. (L4 [S]) Как проектировать schema/indexes, уменьшающие risk predicate conflicts?

     **Ответ:** Predicate conflict возникает, когда concurrent write меняет множество/значения, прочитанные условием другой транзакции, включая ещё отсутствовавшие строки. Tracking только прочитанных row IDs пропускает вставку в пустой gap; нужны ranges/predicates либо serializable dependency validation.

     **Рекомендация:** Защищать именно множество допустимых новых записей: constraint, serializable validation или range/parent lock с доказанным охватом. Блокировка существующих строк не закрывает пустой диапазон автоматически.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


178. (L4 [S]) Как объяснять разработчикам, что row locks не защищают от phantom semantics?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation.

     **Рекомендация:** Защищать именно множество допустимых новых записей: constraint, serializable validation или range/parent lock с доказанным охватом. Блокировка существующих строк не закрывает пустой диапазон автоматически.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


179. (L4 [S]) Как выбирать isolation semantics для запросов с агрегатами и диапазонами?

     **Ответ:** Защищать именно множество допустимых новых записей: constraint, serializable validation или range/parent lock с доказанным охватом. Блокировка существующих строк не закрывает пустой диапазон автоматически.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


180. (L4 [S]) Как строить observability и tooling для phantom/predicate conflict analysis?

     **Ответ:** Phantom меняет набор строк predicate, например после concurrent INSERT. Lock существующих строк не обязательно защищает пустой gap; нужны соответствующие range/predicate semantics или serializable validation. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


---

## 🔹 Write skew

181. (L1 [T]) Что такое write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Пример:** Оба дежурных видят двух активных и каждый снимает только себя; final state нарушает «хотя бы один дежурный».

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


182. (L1 [T]) Почему write skew отличается от lost update?

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


183. (L1 [T]) Почему write skew часто возникает при snapshot isolation?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


184. (L1 [T]) Почему две транзакции могут читать одни и те же данные и писать в разные строки, но всё равно сломать инвариант?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


185. (L1 [T]) Почему write skew — это логическая, а не только физическая аномалия?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


186. (L1 [T]) Как выглядит классический пример write skew с “дежурными врачами”/“минимум один on-call”?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


187. (L1 [T]) Почему отсутствие write-write конфликта не означает отсутствие проблемы?

     **Ответ:** При write skew транзакции читают пересекающийся инвариант, но меняют разные строки; write-write конфликта нет, а общий инвариант нарушается. Это возможно при snapshot isolation со стабильным snapshot.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


188. (L1 [T]) Почему row-level locks не всегда предотвращают write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


189. (L1 [T]) Почему write skew важен для уникальности “по условию” и quota-like invariants?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


190. (L1 [T]) Почему serializable обычно нужен именно для таких инвариантов?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


191. (L1 [P]) Смоделировать классический write skew на двух строках

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


192. (L1 [P]) Реализовать snapshot isolation test harness

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


193. (L1 [P]) Реализовать invariant checker after concurrent commits

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


194. (L1 [P]) Реализовать пример “оба читали count>0, затем оба выключили свой флаг”

     **Ответ:** Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


195. (L1 [P]) Реализовать forced interleaving для reproducible write skew

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


196. (L2 [T]) Чем write skew отличается от phantom и lost update?

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


197. (L2 [T]) Почему snapshot isolation предотвращает lost update, но не write skew?

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


198. (L2 [T]) Почему конфликт идёт через read set, а не через write set?

     **Ответ:** При write skew транзакции читают пересекающийся инвариант, но меняют разные строки; write-write конфликта нет, а общий инвариант нарушается. Это возможно при snapshot isolation со стабильным snapshot.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


199. (L2 [T]) Как materialized aggregate/check row может превратить write skew в обычный write conflict?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


200. (L2 [T]) Почему `SELECT ... FOR UPDATE` иногда помогает, а иногда нет?

     **Ответ:** При write skew транзакции читают пересекающийся инвариант, но меняют разные строки; write-write конфликта нет, а общий инвариант нарушается. Это возможно при snapshot isolation со стабильным snapshot.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


201. (L2 [T]) Как предикатные инварианты порождают write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


202. (L2 [T]) Почему denormalized counters/summary rows иногда используются как защита от write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


203. (L2 [T]) Почему write skew часто не виден на unit-тестах?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


204. (L2 [T]) Почему retry на snapshot isolation сам по себе не исправляет write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


205. (L2 [T]) Почему serializable abort полезен именно как сигнал скрытой аномалии?

     **Ответ:** При write skew транзакции читают пересекающийся инвариант, но меняют разные строки; write-write конфликта нет, а общий инвариант нарушается. Это возможно при snapshot isolation со стабильным snapshot.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


206. (L2 [P]) Реализовать conflict detector по read set + predicate set

     **Ответ:** Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


207. (L2 [P]) Реализовать summary-row technique для предотвращения write skew

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


208. (L2 [P]) Реализовать `SELECT FOR UPDATE` workaround benchmark

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


209. (L2 [P]) Реализовать serialization-graph detection for skew pattern

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


210. (L2 [P]) Реализовать test cases на business invariants under snapshot isolation

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


211. (L2 [D]) Почему логика “каждый обновляет свою строку” всё равно ломает инвариант?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


212. (L2 [D]) Почему write skew проявляется только при одновременных коммитах?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


213. (L2 [D]) Почему после перехода на snapshot isolation исчезли deadlocks, но появились логические баги?

     **Ответ:** Взять deadlock report и обе полные транзакции с порядком lock acquisition, а не только последним SQL. Проверить индексы, FK/triggers и batch order; timeout сам по себе не доказывает наличие цикла.

     **Типичная ошибка:** Считать любой timeout deadlock либо повторять только последний statement отменённой транзакции.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


214. (L2 [D]) Почему retry после conflict не помогает для skew anomaly?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


215. (L2 [D]) Почему два UPDATE по разным строкам внезапно требуют serializable semantics?

     **Ответ:** Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


216. (L3 [T]) Как SSI детектирует dangerous structure, ведущую к write skew?

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


217. (L3 [T]) Почему write skew формально проявляется как цикл rw-dependencies?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


218. (L3 [T]) Как materialized constraints переводят invisible logical conflicts в visible physical conflicts?

     **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


219. (L3 [T]) Почему sharding/partitioning может скрыть или усилить skew patterns?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


220. (L3 [T]) Как secondary indexes and predicate reads участвуют в skew anomalies?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


221. (L3 [T]) Почему write skew особенно важен для booking/quota/scheduling систем?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


222. (L3 [T]) Почему “каждая транзакция корректна по отдельности” — опасная мысль under concurrency?

     **Ответ:** При write skew транзакции читают пересекающийся инвариант, но меняют разные строки; write-write конфликта нет, а общий инвариант нарушается. Это возможно при snapshot isolation со стабильным snapshot.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


223. (L3 [T]) Как строить static analysis/business invariant review against skew-prone workflows?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


224. (L3 [T]) Почему low-level DB guarantees нужно переводить на язык product invariants?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


225. (L3 [T]) Как observability по serialization failures помогает находить скрытый write skew?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


226. (L3 [P]) Реализовать SSI-style dangerous structure tracker

     **Ответ:** SSI отслеживает опасные read-write dependencies поверх snapshot execution и отменяет транзакции для предотвращения неserializable histories. Predicate tracking не обязательно является обычным блокирующим range lock. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


227. (L3 [P]) Реализовать automatic invariant checker over committed histories

     **Ответ:** В graph узлы — транзакции, рёбра — соответствующие зависимости операций. Цикл conflict graph указывает на нарушение conflict serializability при его предпосылках; final-state comparison без read history не обнаруживает все аномалии. Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


228. (L3 [P]) Реализовать benchmark quota-like workload under SI vs serializable

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


229. (L3 [P]) Реализовать graph visualization rw-dependencies causing skew

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


230. (L3 [P]) Реализовать pattern detector for skew-prone read-modify-write flows

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Создать две строки дежурных; обе транзакции читают count≥2 и каждая снимает своего дежурного. С barriers добиться общего snapshot и показать нарушение, затем проверить Serializable/общий guard row или constraint.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


231. (L3 [D]) Как доказать, что баг — это именно write skew, а не bad application logic without concurrency?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


232. (L3 [D]) Почему skew anomaly появилась после оптимизации и сокращения lock duration?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


233. (L3 [D]) Как расследовать редкий skew в scheduling/booking системе?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


234. (L3 [D]) Почему summary-row workaround улучшил correctness, но ухудшил contention?

     **Ответ:** Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


235. (L3 [D]) Как минимально воспроизвести skew anomaly на production-like dataset?

     **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


236. (L4 [S]) Когда инварианты требуют serializable, а когда можно безопасно жить на SI/RC?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Рекомендация:** Для критичных межстрочных правил выбирать serializable с retries или общую блокируемую сущность/декларативное ограничение. Не считать оптимистическую проверку версии одной изменяемой строки защитой всего агрегата.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


237. (L4 [S]) Как проектировать schema/API так, чтобы write skew было трудно выразить?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

     **Рекомендация:** Для критичных межстрочных правил выбирать serializable с retries или общую блокируемую сущность/декларативное ограничение. Не считать оптимистическую проверку версии одной изменяемой строки защитой всего агрегата.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


238. (L4 [S]) Когда стоит материализовать constraint row/counter, а когда лучше поднять isolation level?

     **Ответ:** Для критичных межстрочных правил выбирать serializable с retries или общую блокируемую сущность/декларативное ограничение. Не считать оптимистическую проверку версии одной изменяемой строки защитой всего агрегата.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


239. (L4 [S]) Как обучать команды отличать lost update, phantom и write skew?

     **Ответ:** Lost update возникает, когда stale read-modify-write затирает concurrent изменение. Atomic UPDATE вида x=x+1, compare-and-swap version или locking/Serializable устраняют разные варианты, если все writers соблюдают протокол. Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint.

     **Рекомендация:** Для критичных межстрочных правил выбирать serializable с retries или общую блокируемую сущность/декларативное ограничение. Не считать оптимистическую проверку версии одной изменяемой строки защитой всего агрегата.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


240. (L4 [S]) Как включать concurrency invariant review в дизайн новых фич?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Рекомендация:** Для критичных межстрочных правил выбирать serializable с retries или общую блокируемую сущность/декларативное ограничение. Не считать оптимистическую проверку версии одной изменяемой строки защитой всего агрегата.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


---

## 🔹 Contention

241. (L1 [T]) Что такое contention в контексте СУБД?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


242. (L1 [T]) Чем lock contention отличается от CPU contention?

     **Ответ:** Logical lock защищает транзакционный объект/инвариант, latch — краткую физическую операцию над структурой. Совместимость режимов и порядок захвата определяют блокирование; MVCC не устраняет write/FK/schema locks.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


243. (L1 [T]) Почему hot row или hot key может убить throughput?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


244. (L1 [T]) Почему больше потоков не всегда означает больше производительности?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


245. (L1 [T]) Что такое contention hotspot?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


246. (L1 [T]) Почему tail latency часто страдает от contention сильнее, чем average latency?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


247. (L1 [T]) Что такое lock wait?

     **Ответ:** Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


248. (L1 [T]) Что такое spin vs sleep waiting?

     **Ответ:** Spin тратит CPU, ожидая очень короткий hold, sleep блокирует thread с scheduler/wakeup overhead. Долгое spinning под preemption/NUMA contention ухудшает progress; choice зависит от hold distribution и oversubscription.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics)


249. (L1 [T]) Почему contention бывает и в lock-based, и в MVCC systems?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


250. (L1 [T]) Почему contention может возникать не только на данных, но и на metadata/global counters?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


251. (L1 [P]) Реализовать benchmark hot key vs uniform key distribution

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


252. (L1 [P]) Реализовать latency/throughput measurement under growing thread count

     **Ответ:** Latency — время одной операции с определёнными границами, throughput — завершённая работа в единицу времени. После saturation рост offered load повышает queue/p99, а не обязательно useful throughput; считать ошибки отдельно. Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


253. (L1 [P]) Реализовать per-key contention counters

     **Ответ:** Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


254. (L1 [P]) Реализовать hot row update workload

     **Ответ:** Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


255. (L1 [P]) Реализовать mutex vs spinlock benchmark для коротких критических секций

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


256. (L2 [T]) Почему lock convoying ухудшает throughput?

     **Ответ:** Convoy возникает, когда множество threads стоит за holder, а wakeup/scheduling делает последовательную передачу ресурса дорогой. Уменьшение critical section, batching и concurrency limit полезнее бесконечного добавления workers.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


257. (L2 [T]) Почему false sharing может выглядеть как “непонятный contention”?

     **Ответ:** Независимые записи разных threads в одну cache line вызывают invalidation/migration. Проверять perf c2c и расположение hot fields; padding увеличивает footprint и не лечит true sharing одного счётчика.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


258. (L2 [T]) Почему global transaction ID allocator может стать bottleneck?

     **Ответ:** Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


259. (L2 [T]) Почему contention усиливается на NUMA?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


260. (L2 [T]) Что такое latch contention внутри B-Tree/buffer pool?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


261. (L2 [T]) Почему optimistic retries могут при высоком конфликте ухудшить ситуацию?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


262. (L2 [T]) Почему hot partitions и hot keys — разные, но родственные проблемы?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


263. (L2 [T]) Почему fairness и throughput часто конфликтуют в lock scheduling?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


264. (L2 [T]) Почему contention может расти при низкой загрузке диска и сети?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


265. (L2 [T]) Почему аборты/retries — тоже форма hidden contention cost?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


266. (L2 [P]) Реализовать lock striping для снижения contention

     **Ответ:** Разбить resources на stable stripes/buckets, каждый защищать отдельным mutex; multi-resource операции берут locks в едином порядке. Resize и lifetime entries координировать отдельно; тестировать collisions, hot stripe и concurrent remove.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


267. (L2 [P]) Реализовать sharded counter вместо global counter

     **Ответ:** Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


268. (L2 [P]) Реализовать backoff strategy для retry loops

     **Ответ:** Распознать retryable ошибки, сохранить operation ID, ограничить attempts и общий deadline. Перед попыткой выбрать full-jitter delay в [0,min(cap,base×2^n)], учитывать Retry-After; успешный ранее committed эффект не повторять.

     **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


269. (L2 [P]) Реализовать benchmark false sharing на adjacent cache lines

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


270. (L2 [P]) Реализовать trace lock wait histogram и contention heatmap

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Lock wait — ожидание несовместимого владельца, timeout ограничивает его длительность и обычно приводит к отмене операции/транзакции по правилам СУБД. Timeout не доказывает deadlock: возможна долгая очередь без цикла. Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


271. (L2 [D]) Почему CPU 100%, а throughput падает?

     **Ответ:** Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


272. (L2 [D]) Почему одна строка/partition становится bottleneck всей системы?

     **Ответ:** Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


273. (L2 [D]) Почему после перехода на lock-free структуру latency не улучшилась?

     **Ответ:** Lock-free гарантирует системный прогресс, а не ограниченное время каждой операции и не отсутствие contention. CAS loops требуют memory-order proof, защиты ABA и reclamation; использование atomic pointer не делает структуру автоматически lock-free. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


274. (L2 [D]) Почему retry storm положил сервис сильнее, чем исходный конфликт?

     **Ответ:** Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


275. (L2 [D]) Почему p50 хороший, а p99 ужасный при горячих ключах?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


276. (L3 [T]) Как perf/futex traces помогают видеть contention inside DB engine?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


277. (L3 [T]) Почему latch contention в buffer pool/index может доминировать над logical locks?

     **Ответ:** Latch защищает краткое изменение физической структуры page/node, logical lock — транзакционный объект или predicate. Latch обычно не держат до commit; освобождение одного не заменяет другой механизм. Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


278. (L3 [T]) Как cache line bouncing разрушает scalability на many-core CPU?

     **Ответ:** Независимые записи разных threads в одну cache line вызывают invalidation/migration. Проверять perf c2c и расположение hot fields; padding увеличивает footprint и не лечит true sharing одного счётчика.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


279. (L3 [T]) Почему adaptive spinning полезен на 8 cores и вреден на 128?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


280. (L3 [T]) Как contention profiles differ for OLTP, analytics, mixed workloads?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


281. (L3 [T]) Почему contention на allocator/free lists может выглядеть как “DB slowdown”?

     **Ответ:** Allocator overhead включает bookkeeping, contention и удержание arenas. Arena/slab подходят при известных size/lifetime, но требуют alignment/ownership и bounded capacity; RSS без live allocation analysis не доказывает leak. Free list содержит доступные frames/slots/blocks в конкретной границе allocator/pool. Выдача/возврат должны сохранять ownership, alignment и generation, быть concurrency-safe и не возвращать ещё pinned/live storage.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


282. (L3 [T]) Как queueing theory помогает reasoning about contention and tail latency?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


283. (L3 [T]) Почему batching может одновременно уменьшать contention и увеличивать per-op latency?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


284. (L3 [T]) Как partitioning/sharding данных и metadata уменьшает contention?

     **Ответ:** Конкуренция за общий ресурс создаёт ожидание, spins и cache-line migration; после насыщения дополнительные workers увеличивают latency. Общий CPU/throughput скрывает перекос по ключу, shard и lock.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


285. (L3 [T]) Почему contention observability должна быть per-lock/per-key/per-code-path, а не только global CPU?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


286. (L3 [P]) Реализовать sharded lock table

     **Ответ:** Map resource_id→holders/modes/waiters, атомарные acquire/release и transaction→held resources. Добавить deadlines/cancellation, fixed lock order внутренних mutexes и deadlock handling; не освобождать logical locks раньше выбранной isolation boundary.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


287. (L3 [P]) Реализовать lock-free or wait-free counter for hot path

     **Ответ:** Lock-free гарантирует системный прогресс, а не ограниченное время каждой операции и не отсутствие contention. CAS loops требуют memory-order proof, защиты ABA и reclamation; использование atomic pointer не делает структуру автоматически lock-free. Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


288. (L3 [P]) Реализовать contention profiler with stack traces

     **Ответ:** Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


289. (L3 [P]) Реализовать synthetic hotspot workload generator with Zipfian distribution

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


290. (L3 [P]) Реализовать experiment: mutex/spin/rwlock/optimistic retry under mixed contention

     **Ответ:** Сделать workload с управляемой долей hot keys, barrier-start workers и bounded concurrency. Измерять completed ops, wait/spin time и p99 при увеличении threads; сравнить sharding/lock striping при той же корректности.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


291. (L3 [D]) Как доказать, что bottleneck — false sharing, а не логический lock conflict?

     **Ответ:** Независимые записи разных threads в одну cache line вызывают invalidation/migration. Проверять perf c2c и расположение hot fields; padding увеличивает footprint и не лечит true sharing одного счётчика. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


292. (L3 [D]) Почему после роста числа ядер throughput перестал расти?

     **Ответ:** Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


293. (L3 [D]) Как расследовать contention, который проявляется только на двухсокетной NUMA-машине?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


294. (L3 [D]) Почему hot key mitigation помогла p99, но ухудшила average latency?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


295. (L3 [D]) Как отличить contention на данных от contention на metadata/global structures?

     **Ответ:** Профилировать wait events, hold time, retries/CAS failures и per-key skew, затем stacks и perf c2c. Проверить root/global mutex, allocator и pool; отличать логический конфликт транзакций от false sharing.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


296. (L4 [S]) Как проектировать engine/schema/API так, чтобы минимизировать contention с первого дня?

     **Ответ:** Уменьшить shared mutable state и critical section, shard по независимому ключу, ограничить in-flight и использовать batching там, где оно сохраняет инварианты. Lock-free не является гарантированным лечением contention.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


297. (L4 [S]) Когда стоит бороться с contention через sharding, а когда через изменение semantics?

     **Ответ:** Уменьшить shared mutable state и critical section, shard по независимому ключу, ограничить in-flight и использовать batching там, где оно сохраняет инварианты. Lock-free не является гарантированным лечением contention.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


298. (L4 [S]) Как строить observability и alerting для contention до реального инцидента?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


299. (L4 [S]) Как объяснять продуктовым командам, что “горячий объект” — архитектурная проблема, а не просто вопрос железа?

     **Ответ:** Уменьшить shared mutable state и critical section, shard по независимому ключу, ограничить in-flight и использовать batching там, где оно сохраняет инварианты. Lock-free не является гарантированным лечением contention.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


300. (L4 [S]) Как выбирать между fairness, throughput, tail latency и complexity в concurrency control design?

     **Ответ:** Отсутствие deadlock не гарантирует fairness: операция может постоянно проигрывать конкуренцию/retry. Нужны очереди/приоритеты, bounded backoff и метрики времени ожидания, а не только общий throughput. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета.

     **Рекомендация:** Уменьшить shared mutable state и critical section, shard по независимому ключу, ограничить in-flight и использовать batching там, где оно сохраняет инварианты. Lock-free не является гарантированным лечением contention.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Почему locks vs MVCC — это не бинарный выбор, а спектр дизайнов?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


302. (L2 [T]) Как isolation anomalies связаны с конкретными механизмами concurrency control?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


303. (L2 [T]) Почему phantom reads и write skew важнее для бизнес-инвариантов, чем dirty reads?

     **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit. Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


304. (L2 [T]) Как contention влияет и на throughput, и на correctness через retries/aborts?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


305. (L2 [T]) Почему planner/index choice может менять concurrency profile workload?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


306. (L2 [T]) Как buffer pool, B-Tree latches и logical locks вместе формируют observed latency?

     **Ответ:** Latch защищает краткое изменение физической структуры page/node, logical lock — транзакционный объект или predicate. Latch обычно не держат до commit; освобождение одного не заменяет другой механизм. Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


307. (L2 [T]) Почему long transactions одновременно вредят MVCC cleanup, lock hold time и contention?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


308. (L2 [T]) Как replication/retry/failover усиливают concurrency bugs на уровне приложения?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


309. (L2 [T]) Почему concurrency issues редко ловятся обычными unit tests?

     **Ответ:** Уровень изоляции задаёт разрешённые истории конкурентных транзакций. Read Committed, Repeatable Read и Serializable реализуются по-разному у СУБД; стабильный snapshot не исключает write skew и не равен real-time freshness.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


310. (L2 [T]) Почему observability для concurrency должна связывать locks, aborts, retries, versions и hot keys?

     **Ответ:** Один горячий ключ остаётся serialization point даже после добавления shards. Для reads помогают cache/replicas/coalescing, для writes — разделение агрегата/коммутативное накопление лишь при сохранении инвариантов. Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


311. (L2 [P]) Реализовать mini-engine: locks + MVCC + anomaly tests + contention metrics

     **Ответ:** У версий хранить creator/deleter transaction metadata или интервалы commit sequence; snapshot фиксирует границу видимости. Публиковать commit атомарно, удерживать lifetime версий до reader release; проверить aborted и concurrent writers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


312. (L2 [P]) Реализовать dashboard: lock waits, abort rate, retry rate, oldest snapshot, hot keys

     **Ответ:** Registry регистрирует read boundary до доступа к версиям и снимает её после завершения всех reads. Oldest protected boundary вычислять concurrency-safe; GC rechecks horizon и pins, включая crash/recovery consumers.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать chaos harness: kill/restart + concurrent workload + invariant checking

     **Ответ:** Детерминированный harness сохраняет seed/operations и вводит сбой перед/после persistence/message boundaries. После restart/rejoin checker сравнивает committed history/invariants; отдельно моделировать process crash, power loss, partial write, loss/reorder и повтор recovery.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Raft paper](https://raft.github.io/raft.pdf)


314. (L2 [P]) Реализовать deterministic interleaving tester для tricky anomalies

     **Ответ:** Typed chunks хранят count/validity/offsets и encoding parameters, blocks — checksum/metadata для pruning. Decoder валидирует bounds/overflow, round-trip сравнивает raw data; projection/predicate не должны читать ненужные columns или менять NULL semantics.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


315. (L2 [P]) Реализовать benchmark: uniform vs Zipfian vs range-hotspot workloads

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


316. (L3 [D]) Почему после повышения isolation correctness улучшилась, но SLA сломался?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


317. (L3 [D]) Почему после оптимизации locks появилось больше write skew anomalies?

     **Ответ:** Две snapshot транзакции могут прочитать общий инвариант и изменить разные строки, не конфликтуя по writes. Пример: оба дежурных одновременно снимают себя; нужен Serializable либо общая защищённая сущность/constraint. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Построить read-write dependency graph и сверить snapshot/commits: разные write sets не исключают цикл. Проверить, охватывает ли инвариант несколько строк/предикат и участвуют ли все writers в выбранной защите.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


318. (L3 [D]) Как доказать, что корень проблемы — плохие transaction boundaries, а не сама СУБД?

     **Ответ:** Диапазоны должны иметь непротиворечивые границы, например [lo,hi), без holes/overlap в покрываемом keyspace. Boundary update публикуют атомарно с owner/epoch; samples/quantiles оценивают data size, а traffic требует heat metrics. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


319. (L3 [D]) Почему p50 стабильный, а p99 и abort rate резко прыгают под нагрузкой?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


320. (L3 [D]) Как расследовать инцидент “данные не потерялись, но concurrent поведение было неконсистентным”?

     **Ответ:** Записать версии прочитанных/изменённых строк, границы транзакций и isolation configuration. Восстановить history и проверить конкретную аномалию; не называть любой stale replica read нарушением transaction isolation.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


321. (L4 [S]) Как выбирать concurrency model для новой БД или storage engine?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


322. (L4 [S]) Как встроить concurrency testing и invariant review в обычный процесс разработки?

     **Ответ:** Инвариант должен сохраняться всеми разрешёнными конкурентными histories, включая retries/failures. Проверка на read перед отдельным write не атомарна; выбрать constraint, транзакцию/lock или условный versioned update с достаточным охватом.

     **Рекомендация:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


323. (L4 [S]) Какие anti-patterns в transaction design чаще всего приводят к painful concurrency bugs?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


324. (L4 [S]) Как строить internal guidelines по isolation levels, retries и lock usage для инженерных команд?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


325. (L4 [S]) Как объяснять команде, что конкурентность — это не “деталь реализации”, а ядро correctness и performance одновременно?

     **Ответ:** Начать с бизнес-инварианта и доступных histories; критичные multi-row проверки защищать Serializable, constraints либо доказанным locking. Отдельно определить retry policy и требуемую свежесть реплик.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
