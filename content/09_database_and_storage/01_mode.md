# 🧱 1. Модели данных — Вопросы

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

## 🔹 Relational Model

### L1 — базовый уровень

**[T]**

1. Что такое отношение (relation) в терминах реляционной модели?

   **Ответ:** Множество кортежей над именованными атрибутами с заданными доменами. В математической модели нет порядка строк и одинаковых кортежей.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

2. Чем отличается таблица от отношения?

   **Ответ:** SQL-таблица реализует приближение отношения: может допускать дубликаты и NULL. Порядок выдачи задаётся ORDER BY, а не физическим положением строки.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

3. Что такое первичный ключ и зачем он нужен?

   **Ответ:** Набор атрибутов, уникально и без NULL определяющий строку. Он обеспечивает идентичность и цель внешних ссылок; может быть составным.

   **Пример:** PRIMARY KEY (tenant_id, id).

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

4. Что такое нормализация (1NF, 2NF, 3NF)?

   **Ответ:** 1NF требует атомарности значений относительно модели, 2NF устраняет зависимости неключевых атрибутов от части candidate key, 3NF ограничивает транзитивные зависимости. Нормализация уменьшает аномалии изменения.

   **Пример:** Адрес клиента хранится отдельно от строк его заказов.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

5. Что такое внешний ключ?

   **Ответ:** Ограничение, требующее, чтобы значения ссылочных полей соответствовали ключу другой/той же таблицы либо разрешённому NULL. Действия удаления задаются отдельно.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

6. Что такое транзакция?

   **Ответ:** Единица совместной фиксации/отката операций с выбранными гарантиями изоляции и долговечности. Граница транзакции должна охватывать сохраняемый инвариант.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

7. Что означает ACID?

   **Ответ:** Atomicity, Consistency, Isolation, Durability: целостное применение, сохранение объявленных инвариантов, допустимое взаимодействие конкурентных операций, устойчивость commit.

   **Типичная ошибка:** Путать ACID consistency с согласованностью реплик CAP.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

8. Что такое JOIN и какие типы существуют?

   **Ответ:** Соединение строк по условию. INNER оставляет совпадения, LEFT/RIGHT/FULL сохраняют несопоставленные строки соответствующей стороны с NULL, CROSS даёт декартово произведение.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

9. Что такое индекс и зачем он нужен?

   **Ответ:** Вспомогательная структура поиска/порядка/уникальности. Ускорение чтений оплачивается пространством и обслуживанием при записи; полезность зависит от запросов.

   **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

10. Разница между clustered и non-clustered индексом?

    **Ответ:** Clustered задаёт организацию данных по ключу, secondary/non-clustered ссылается на строки. InnoDB кластеризует по PK; PostgreSQL heap не поддерживает такой порядок автоматически после CLUSTER.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


**[P]**

11. Как реализовать простую in-memory таблицу на C++?

    **Ответ:** Хранить строки в vector<Row>, первичный индекс — map/unordered_map ключ→стабильный ID. Определить insert/update/delete, уникальность и lifetime ссылок; вектор может инвалидировать адреса при росте.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)

12. Как представить строку таблицы в виде структуры?

    **Ответ:** Задать struct с типизированными полями и явным ключом; для nullable использовать optional либо validity bitmap. Не записывать raw struct на диск без формата из-за padding/endianness.

    **Пример:** struct Row { uint64_t id; std::string name; };

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library)

13. Как реализовать hash index на C?

    **Ответ:** Выбрать buckets, функцию хэширования и сравнение ключей; реализовать цепочки или probing, resize и освобождение. При коллизии сравнивать полный ключ, а не только hash.

    **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)

14. Как эффективно хранить nullable поля?

    **Ответ:** Отдельный bitmap присутствия плюс плотно расположенные значения уменьшает overhead. Для учебного C++ удобен optional<T>; различать NULL и нулевое значение.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library)

15. Как реализовать простой SELECT * WHERE?

    **Ответ:** Последовательно проверить predicate для каждой живой строки и вернуть подходящие. Индексный путь применять только если существует подходящий индекс; для SQL NULL требует трёхзначной логики.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)


---

### L2 — middle

**[T]**

16. Что такое денормализация и когда она оправдана?

    **Ответ:** Преднамеренное дублирование/предвычисление ради нужного чтения. Нужны владелец обновления, правила свежести и восстановление производной проекции.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

17. Как работает B-Tree индекс?

    **Ответ:** Упорядоченные страницы с большим fanout направляют поиск от корня к листу. Split/merge поддерживают баланс; диапазонные чтения используют соседние листья.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

18. Что такое cost-based optimizer?

    **Ответ:** Сравнивает допустимые планы по оценке строк, CPU, I/O и других затрат, используя статистику. Выбирает дешёвый оценённый план, который может оказаться не лучшим фактически.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)

19. Чем отличается OLTP от OLAP?

    **Ответ:** OLTP — короткие конкурентные транзакции над небольшим набором строк; OLAP — сканы и агрегации больших наборов. Это профили нагрузки, а не строгая классификация продуктов.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

20. Что такое MVCC?

    **Ответ:** Версии строк и снимки позволяют читать согласованное состояние без ожидания большинства писателей. Невидимые старые версии очищаются только после исчезновения нуждающихся в них readers.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


**[P]**

21. Реализовать простой B-Tree на C++

    **Ответ:** Определить минимальную степень, отсортированные ключи и child pointers; поиск — выбор ветви, вставка — split полного узла. Проверять равную глубину листьев, границы ключей и сохранность всех вставок.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

22. Реализовать secondary index

    **Ответ:** Поддерживать mapping вторичный ключ→набор row IDs и менять его атомарно с основной строкой. Для одинаковых значений хранить несколько ID; проверить update и delete.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

23. Написать простой query planner

    **Ответ:** Построить AST, определить scan/filter/project/join, оценить размеры и выбрать scan или index path. Для учебного planner сначала поддержать ограниченный язык, затем сравнивать результат с прямым исполнением.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)

24. Реализовать WAL (write-ahead log)

    **Ответ:** Формат записи: длина, тип, transaction ID, LSN, payload и checksum. До flush dirty page обеспечить durable WAL; commit ack отправлять после нужного flush, recovery останавливать на неполном хвосте.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

25. Реализовать простую транзакцию с rollback

    **Ответ:** Хранить before-images или локальный write set; commit атомарно публикует изменения, rollback возвращает их в обратном порядке. Конкурентные транзакции требуют контроля версий/locks.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


**[D]**

26. Почему SELECT стал медленным после добавления индекса?

    **Ответ:** Сравнить EXPLAIN ANALYZE и BUFFERS до/после: устаревшие оценки могли выбрать плохой plan. Индекс также увеличивает стоимость записи и давление на cache/I/O.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

27. Почему JOIN вызывает explosion памяти?

    **Ответ:** Проверить фактическую кардинальность и кратность ключей: many-to-many может давать огромный результат. Сверить оценки, hash table size, work_mem и spill, устранить ошибку условия JOIN.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

28. Почему VACUUM (или аналог) тормозит систему?

    **Ответ:** VACUUM читает/очищает страницы и индексы, конкурируя за I/O/CPU. Долгие snapshots удерживают dead tuples; проверить autovacuum progress, блокировки и темп образования мусора.

    **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)

29. Почему растёт latency при большом числе concurrent транзакций?

    **Ответ:** Разделить lock waits, pool waits, WAL flush, I/O и CPU. Увеличение конкуренции после насыщения увеличивает очередь, а не полезную скорость; ограничить in-flight и длину транзакций.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

30. Почему deadlock происходит даже при простых операциях?

    **Ответ:** Даже простой UPDATE затрагивает строки, индексы и FK. Две транзакции могут брать их в разном порядке; построить wait-for cycle, унифицировать порядок и повторять целую отменённую транзакцию.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


---

### L3 — senior

**[T]**

31. Как реализуется MVCC на уровне storage?

    **Ответ:** Каждая версия содержит признаки создающей/удаляющей транзакции либо интервалы видимости. Snapshot выбирает версию по состоянию транзакций; GC не удаляет данные, доступные старейшему reader.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

32. Что такое snapshot isolation vs serializable?

    **Ответ:** Snapshot isolation даёт стабильный снимок, но допускает write skew. Serializable запрещает неэквивалентные последовательному исполнению истории, иногда отменяя транзакции для повторного запуска.

    **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

33. Как устроен buffer pool?

    **Ответ:** Кэш страниц БД: page table, frames, pin count, dirty flag и replacement policy. Pinned/используемые страницы не вытесняются, dirty pages требуют безопасного flush после WAL.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

34. Как работает lock manager?

    **Ответ:** Хранит владельцев/ожидающих locks и совместимость режимов, выдаёт lock либо ставит транзакцию в очередь. Обрабатывает освобождение и deadlock detection/timeout; latch страниц — другой уровень.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

35. Что такое write amplification?

    **Ответ:** Отношение физических записанных байтов к логически изменённым. Включает WAL, индексы, переписывание страниц и compaction; отдельно измерять host и device amplification.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


**[P]**

36. Реализовать MVCC версионирование строк

    **Ответ:** Сохранить chain версий с transaction ID, snapshot и commit state. Reader выбирает видимую версию, writer публикует commit атомарно; тестировать rollback и GC при удерживаемом snapshot.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

37. Реализовать lock-free index (пример)

    **Ответ:** Для учебного примера взять неизменяемый индекс и atomic root, писать через copy-on-write/CAS. Нужны корректное освобождение через epochs/hazard pointers и доказательство прогресса; атомарного указателя недостаточно.

    **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

38. Написать page cache (аналог buffer pool)

    **Ответ:** Реализовать map<page_id, frame>, pin/unpin, dirty state и bounded replacement. Перед повторным использованием frame проверить pins, завершить WAL/data flush и изменить mapping без гонок.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

39. Реализовать LRU eviction

    **Ответ:** Hash map key→iterator и двусвязный список: hit перемещает в начало, eviction удаляет хвост. Все изменения связаны; pinned/in-flight записи требуют отдельной обработки.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library)

40. Реализовать concurrent B-Tree

    **Ответ:** Начать с latch coupling: захватить child до отпускания parent, выполнять split с безопасным порядком locks. B-link right links/high keys облегчают обход concurrent split; reclamation решается отдельно.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


**[D]**

41. Как диагностировать contention в lock manager?

    **Ответ:** Собрать wait events, ожидания по объектам/режимам, длины очередей и wait-for graph. Проверить длительность транзакций и global mutex; отличить lock wait от page latch.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)

42. Почему CPU 100%, но throughput падает?

    **Ответ:** Сравнить useful work с cycles/spins/retries/context switches. Возможны lock contention, cache-line bouncing, compaction или плохой plan; нужны per-thread stacks и throughput завершённых операций.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

43. Как найти источник IO bottleneck?

    **Ответ:** Измерить latency/queue depth/bytes/IOPS устройства, cache misses и storage waits БД. Проверить temp spill, WAL/checkpoint и random reads по отдельности, сопоставить p99 с I/O стадиями.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

44. Почему WAL стал узким местом?

    **Ответ:** Проверить WAL bytes/transaction, fsync latency, flush queue и размер batches. Частые маленькие commit, full-page images и медленный storage ограничивают log; group commit помогает без скрытого ослабления durability.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

45. Как диагностировать false sharing в структуре индекса?

    **Ответ:** Сравнить shared cache lines через perf c2c при фиксированном workload; найти независимые часто изменяемые поля на одной линии. Разнести их и повторить измерение с учётом выросшего footprint.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


---

### L4 — staff

**[S]**

46. Когда выбирать relational DB, а не NoSQL?

    **Ответ:** Когда нужны ограничения, транзакции и запросы по связям, а требования масштаба подтверждены выбранной СУБД. NoSQL выбирать за конкретную модель доступа/гарантии, а не из-за одного объёма.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

47. Как масштабировать relational DB горизонтально?

    **Ответ:** Сначала оптимизация и read replicas, затем разделение по tenant/aggregate с явным routing. Межшардовые joins, uniqueness и транзакции требуют отдельного протокола либо иной модели данных.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

48. Как спроектировать multi-tenant storage?

    **Ответ:** Tenant ID должен входить в routing, ключи и проверки доступа; применить quotas и изоляцию noisy neighbors. Выбрать shared tables/schema/database по требованиям изоляции и восстановления одного tenant.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

49. Как выбрать стратегию индексации для high-write workload?

    **Ответ:** Оставить индексы нужных запросов и ограничений, оценить write amplification и размер. Онлайн-построение и удаление проводить с контролем блокировок и реального профиля запросов.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

50. Как проектировать storage engine с нуля?

    **Ответ:** Определить API, инварианты, формат страниц/ключей, WAL/recovery и concurrency model, затем buffer pool и индексы. Первый milestone — корректность на fault injection; benchmark проводить после этого.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

## 🔹 Key-Value Model

---

### L1

**[T]**

51. Что такое key-value store?

    **Ответ:** Хранилище пар ключ→значение с точечными get/put/delete. Транзакции, scan и структура значения зависят от реализации.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

52. Чем отличается от relational?

    **Ответ:** KV обычно индексирует ключ и не требует реляционных JOIN; relational задаёт таблицы, связи и ограничения. Наличие транзакций не определяется одним названием модели.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

53. Какие операции базовые?

    **Ответ:** Put, get, delete; часто также batch, conditional update и ordered scan. Для каждой операции нужны error, atomicity и durability semantics.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

54. Что такое TTL?

    **Ответ:** Срок логической пригодности записи. Хранить expires_at, проверять на чтении, удалять в фоне; expiration и физическое освобождение памяти не обязаны совпадать.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

55. Что такое consistent hashing?

    **Ответ:** Стабильное назначение ключей узлам с ограниченным переносом при изменении состава. На кольце используют tokens/virtual nodes; один hot key от этого не распараллеливается.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


**[P]**

56. Реализовать KV store на mmap файле

    **Ответ:** Определить заголовок/формат записей и смещения вместо process pointers, отобразить файл и валидировать границы. Persistence требует crash-safe update protocol и msync/fsync по выбранной модели; mmap сам не транзакция.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

57. Реализовать hash table на C

    **Ответ:** Buckets + hash/equality, collisions через chaining или probing, resize при выбранном load factor. Проверять allocation failures, overflow размера и корректное освобождение.

    **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)

58. Добавить TTL поддержку

    **Ответ:** Хранить deadline с каждой записью, проверять его на get и добавить heap/колесо для cleanup. Для локальных интервалов использовать monotonic time, для сохраняемого срока — определённую wall-clock семантику.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

59. Реализовать простой LRU cache

    **Ответ:** Связать hash map с двусвязным списком; get/update перемещает узел в MRU, capacity превышение удаляет LRU. Возврат ссылки должен учитывать последующее eviction.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library)

60. Сделать persistence через append-only log

    **Ответ:** Append records с длиной/checksum/sequence; commit ack после требуемого sync. Startup replay восстанавливает карту и отбрасывает неполный хвост; compaction публикуется атомарно.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


---

### L2

**[T]**

61. Что такое LSM-tree?

    **Ответ:** Write-optimized структура: WAL, memtable и immutable sorted files с compaction. Цена — усиление чтения/записи и фоновое обслуживание.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

62. Чем отличается от B-Tree?

    **Ответ:** B-tree меняет упорядоченные страницы, LSM накапливает и сливает отсортированные серии. Сравнение зависит от read/write ratio, range scans и sustainable compaction.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

63. Что такое compaction?

    **Ответ:** Слияние sorted runs с сохранением актуальных версий и безопасным удалением tombstones. Нужен запас диска для входных и выходных файлов.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

64. Что такое bloom filter?

    **Ответ:** Вероятностная проверка принадлежности: «точно нет» либо «возможно есть». При корректном построении нет false negatives; положительный ответ требует проверки ключа.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)

65. Что такое write amplification в KV?

    **Ответ:** WAL, flush, compaction и реплики увеличивают физические байты сверх payload. Вычислять отношение за интервал, включая фоновую работу и заполненный набор данных.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


**[P]**

66. Реализовать LSM-tree (упрощённо)

    **Ответ:** Сначала WAL+memtable; по порогу freeze, сбросить отсортированный SST и опубликовать manifest. Get ищет новейшую версию, compaction выполняет merge; удаление задаётся tombstone.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

67. Добавить bloom filter

    **Ответ:** Выбрать m бит и k хэшей, set при добавлении, проверять все биты при поиске. Привязать filter к comparator/encoding ключа; проверить отсутствие false negatives.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)

68. Реализовать SSTable

    **Ответ:** Записать sorted data blocks, sparse index, filters, checksums и footer. Parser проверяет offsets/lengths; запись файла завершается до публикации в manifest.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)

69. Реализовать compaction

    **Ответ:** K-way merge входных sorted iterators, одинаковые ключи разрешать по sequence. Не убирать версии/tombstones, доступные snapshots или требуемые для подавления старых данных.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

70. Реализовать memtable

    **Ответ:** Ordered map/skip list с sequence и tombstone; WAL предшествует durable publication. Freeze выполняется с переключением active table, readers удерживают lifetime старой.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


**[D]**

71. Почему резко вырос disk usage?

    **Ответ:** Проверить compaction backlog, retained snapshots, tombstones, WAL retention и временные output files. Считать live data отдельно от filesystem allocated bytes и запаса на compaction.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

72. Почему latency скачет?

    **Ответ:** Сопоставить p99 с flush/compaction/stalls, page faults, malloc и fsync. Холодный и прогретый рабочий набор измерять отдельно; средний throughput проблему не исключает.

    **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

73. Почему compaction съедает CPU?

    **Ответ:** Merge, сравнение ключей и compression/decompression расходуют CPU на фоновых потоках. Проверить bytes compacted, codec и pending bytes; rate limit снижает помехи, но может накапливать debt.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

74. Почему read amplification вырос?

    **Ответ:** Больше перекрывающихся files/levels, tombstones, misses в Bloom/cache или задержка compaction. Измерить files/blocks examined на один get/scan и долю false positives.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)

75. Почему hot keys убивают performance?

    **Ответ:** Один ключ или partition насыщает владельца и создаёт очереди. Для read — caching/replicas; для write — объединение или разделение логического агрегата, если инварианты допускают.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


---

### L3

**[T]**

76. Как устроен RocksDB / LevelDB?

    **Ответ:** Оба — embedded LSM KV engines; RocksDB расширяет модель LevelDB настройками compaction, column families, cache и параллелизмом. Они не дают distributed replication автоматически.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

77. Как реализуется WAL в KV?

    **Ответ:** До изменения durable state записать record с sequence и checksum, sync согласно режиму commit. Recovery воспроизводит завершённый префикс и не применяет частично записанный record.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

78. Как работает tiered storage?

    **Ответ:** Разместить горячие данные/metadata в быстром слое, холодные files — в более дешёвом. Нужны migration, кэш, integrity и измерение miss penalty, а не только политика возраста.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

79. Как реализуется snapshot?

    **Ответ:** Зафиксировать read sequence; выбирать версии не новее него. Compaction/GC удерживают нужные старые версии до освобождения snapshot.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

80. Как устроена memory layout оптимизация?

    **Ответ:** Компактные записи, contiguous arrays, alignment и уменьшение pointer chasing снижают misses. Измерять footprint и locality; padding каждого поля может ухудшить cache density.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


**[P]**

81. Реализовать lock-free hash table

    **Ответ:** Использовать CAS для публикации и корректную reclamation для удаления/resize. Сначала ограничить API и memory model; без hazard/epoch подхода читатель может обратиться к освобождённому bucket.

    **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

82. Реализовать zero-copy read (mmap)

    **Ответ:** Возвращать view на mapped bytes только пока mapping/file version живы. Проверить offsets, bounds и alignment; lifetime view не должен переживать unmap/compaction.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)

83. Оптимизировать layout под cache lines

    **Ответ:** Разделить независимо изменяемые счётчики/locks, сгруппировать совместно читаемые поля, сократить pointer hops. Выбор alignment проверить perf c2c и cache-miss профилем.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

84. Реализовать concurrent memtable

    **Ответ:** Выбрать доказанную concurrent skip list либо sharded lock protected map; определить publication sequence и freeze barrier. Readers удерживают snapshot/lifetime до завершения lookup.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

85. Реализовать prefix compression

    **Ответ:** Хранить длину общего префикса и suffix относительно предыдущего ключа, периодически добавлять restart points. Decoder проверяет длины и восстанавливает порядок; long seek начинает с restart.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


**[D]**

86. Как найти cache miss bottleneck?

    **Ответ:** Профилировать LLC misses, stalled cycles и адреса на реальном наборе. Сопоставить рост misses с размером индекса/working set, затем проверить locality/компрессию, а не только CPU utilization.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

87. Почему NUMA влияет на KV store?

    **Ответ:** Remote RAM дороже local RAM, а общие cache lines мигрируют между sockets. Проверить placement threads/pages и first-touch, сравнить pinned/local с текущим распределением.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

88. Почему malloc/free тормозит систему?

    **Ответ:** Частые allocation/free, contention allocator и fragmentation увеличивают CPU и хвосты. Измерить allocation stacks/size classes; использовать arena/pool лишь при понятном lifetime.

    **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)

89. Как выявить fragmentation?

    **Ответ:** Сравнить live allocated bytes с reserved/committed/RSS и распределением размеров. Рост RSS без live objects может быть allocator retention, но не доказывает leak.

    **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res); [Clang: LeakSanitizer](https://clang.llvm.org/docs/LeakSanitizer.html)

90. Почему page faults растут?

    **Ответ:** Working set вышел из RAM, mapping затрагивает новые страницы либо CoW копирует изменяемые. Разделить minor/major faults, memory pressure и swap; mmap не устраняет чтение с носителя.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fork](https://man7.org/linux/man-pages/man2/fork.2.html)


---

### L4

**[S]**

91. Как спроектировать distributed KV store?

    **Ответ:** Partition map + replicated groups + routing/versioning + recovery/repair. Выбрать single-leader consensus либо leaderless conflict resolution от инвариантов, затем проверить partitions и rebalance.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

92. Как выбрать replication strategy?

    **Ответ:** От допустимого RPO/latency и failure domains: sync/quorum для подтверждённой сохранности, async для локальной задержки с явным окном потери. Репликация не заменяет backup.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

93. Когда использовать sharding?

    **Ответ:** Когда ёмкость/throughput одного владельца достигли предела и нагрузка разбивается по ключу. Предусмотреть routing, перемещение и cross-shard операции до первого переноса.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

94. Как проектировать storage под SSD vs HDD?

    **Ответ:** HDD особенно чувствителен к seeks, SSD — к IOPS, write amplification и endurance. Разделить WAL/data/compaction по измеренным ограничениям; SSD не делает случайное I/O бесплатным.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

95. Как избежать write amplification?

    **Ответ:** Полностью исключить нельзя: измерять источники, уменьшать лишние индексы/перезаписи, подбирать compaction и batching. Снижение WA обычно меняет read/space amplification.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


---

## 🔹 Document Model

---

### L1

**[T]**

96. Что такое document DB?

    **Ответ:** Хранит документы с вложенными полями/массивами, обычно с запросами и индексами по ним. Агрегат и его границы выбирают по совместному чтению/изменению.

    **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

97. Чем отличается от KV?

    **Ответ:** KV главным образом адресует opaque value ключом; document DB понимает структуру value для запросов и индексов. Некоторые продукты поддерживают обе модели.

    **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

98. Что такое JSON/BSON?

    **Ответ:** JSON — текстовый формат значений/объектов/массивов; BSON — бинарный типизированный формат с дополнительными типами. BSON не является просто сжатым JSON.

    **Источник:** [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259.html); [BSON specification](https://bsonspec.org/spec.html)

99. Что такое schema-less?

    **Ответ:** Гибкая схема означает, что набор полей документов может различаться, но не отсутствие правил. Требуются validation, версии и совместимость читающего кода.

    **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

100. Что такое embedded documents?

     **Ответ:** Вложенные объекты/массивы внутри одного документа. Удобны для агрегата с общим lifecycle, но неограниченный рост и дублирование усложняют обновления.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)


**[P]**

101. Реализовать хранение JSON документов

     **Ответ:** Использовать проверенный JSON parser, задать ID и durable encoded representation. Валидировать размер/глубину/типы, хранить schema version и атомарно обновлять документ с индексами.

     **Источник:** [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259.html); [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

102. Написать простой parser JSON на C++

     **Ответ:** Рекурсивный descent/tokenizer для ограниченной грамматики; корректно обработать escaping, Unicode, числа и вложенность. Ограничить ресурсы и сравнить с conformance corpus, для production взять зрелую библиотеку.

     **Источник:** [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259.html)

103. Реализовать поиск по полю

     **Ответ:** Начать со scan и доступа по field path, затем добавить secondary index value→IDs. Уточнить сравнение типов, missing/null и семантику массивов.

     **Источник:** [MongoDB: Indexes](https://www.mongodb.com/docs/manual/indexes/)

104. Добавить вложенные структуры

     **Ответ:** Представить value как tagged union: null/bool/number/string/array/object. Парсер и traversal проверяют максимальную глубину, ownership и ошибки типов.

     **Источник:** [RFC 8259: JSON](https://www.rfc-editor.org/rfc/rfc8259.html); [C++ working draft: Library](https://eel.is/c++draft/library)

105. Реализовать update документа

     **Ответ:** Прочитать текущую версию, применить изменение к копии, проверить schema и atomically replace при совпадении версии. Обновление индексов и durability входят в ту же транзакционную границу.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

### L2

**[T]**

106. Как реализуется индекс по вложенным полям?

     **Ответ:** Индекс строится по значению field path; для массивов может стать multikey с несколькими записями на документ. Нужно учитывать ограничения составных multikey индексов конкретной СУБД.

     **Источник:** [MongoDB: Indexes](https://www.mongodb.com/docs/manual/indexes/)

107. Что такое aggregation pipeline?

     **Ответ:** Последовательность стадий match/project/group/sort и других преобразований документов. Порядок стадий влияет на объём данных и стоимость, а оптимизатор может безопасно их переставлять.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

108. Что такое document fragmentation?

     **Ответ:** Неоднозначный термин: внутренний свободный объём страниц, разнесённые части документа или свободное место файла. Уточнить storage engine и измерять live/allocated/cache bytes раздельно.

     **Источник:** [MongoDB: WiredTiger storage engine](https://www.mongodb.com/docs/manual/core/wiredtiger/)

109. Как реализуется partial update?

     **Ответ:** API меняет выбранные поля, но физическая запись может переписать страницу/документ и индексы. Не считать partial update гарантией минимального количества записанных байтов.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/); [MongoDB: WiredTiger storage engine](https://www.mongodb.com/docs/manual/core/wiredtiger/)

110. Как работает compression?

     **Ответ:** Кодирование уменьшает storage/IO ценой CPU и доступа к отдельным частям. Codec, блок и словарь выбирают по данным и latency; зашифрованные/уже сжатые payload могут почти не уменьшаться.

     **Источник:** [MongoDB: WiredTiger storage engine](https://www.mongodb.com/docs/manual/core/wiredtiger/)


**[P]**

111. Реализовать inverted index

     **Ответ:** Токенизация и нормализация → term→sorted document IDs/positions; query пересекает postings. Update/delete должны удалять старые postings и иметь versioning/merge политику.

     **Источник:** [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)

112. Реализовать query engine для JSON

     **Ответ:** Parse query AST, типизированно применить predicate, projection и ограниченный aggregation pipeline. Зафиксировать missing/null/array semantics и сравнивать indexed path с scan oracle.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

113. Реализовать projection

     **Ответ:** Построить новый документ из выбранных field paths, сохраняя правила включения/исключения и вложенность. Не считать projection авторизацией: недоступные поля блокируются отдельно.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

114. Реализовать partial update

     **Ответ:** Применять patch к конкретной ожидаемой версии документа, валидировать типы/path и обновлять затронутые индексы. Повтор patch с инкрементом не идемпотентен без operation ID.

     **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

115. Реализовать document compaction

     **Ответ:** Переписать живые документы в новый файл, проверить checksum/count и атомарно переключить manifest. Readers удерживают старое поколение до завершения; crash не должен оставлять единственную неполную копию.

     **Источник:** [MongoDB: WiredTiger storage engine](https://www.mongodb.com/docs/manual/core/wiredtiger/); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


---

### L3

**[T]**

116. Как реализуется storage engine в MongoDB?

     **Ответ:** В обычных MongoDB deployments WiredTiger использует cache, MVCC, checkpoints и journal, с compression данных/индексов. Детали зависят от версии и режима deployment; не описывать его как LSM RocksDB.

     **Источник:** [MongoDB: WiredTiger storage engine](https://www.mongodb.com/docs/manual/core/wiredtiger/)

117. Как работают secondary indexes?

     **Ответ:** Хранят поля ключа и ссылку на документ, обновляются при изменении индексируемых значений. Уникальность, sparse/partial и multikey имеют разные ограничения.

     **Источник:** [MongoDB: Indexes](https://www.mongodb.com/docs/manual/indexes/)

118. Как решается проблема больших документов?

     **Ответ:** Ограничивать размер/массивы, выносить большие binary в подходящее внешнее хранилище, хранить ссылки. В MongoDB учитывать BSON document limit 16 MiB; разбиение меняет границы атомарности.

     **Источник:** [MongoDB: Limits](https://www.mongodb.com/docs/manual/reference/limits/); [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

119. Как реализуется journaling?

     **Ответ:** WiredTiger journal хранит изменения между checkpoints для recovery; write concern j и репликационные подтверждения задают разные части гарантии. Уточнить конфигурацию, не приравнивать ACK к любому уровню durable flush.

     **Источник:** [MongoDB: WiredTiger storage engine](https://www.mongodb.com/docs/manual/core/wiredtiger/)

120. Как работает sharding?

     **Ответ:** Shard key задаёт распределение/routing диапазонов, config metadata хранит владельцев, router направляет запросы. Без shard key запрос может потребовать scatter-gather; migration должна переносить конкурентные изменения.

     **Источник:** [MongoDB: Sharding](https://www.mongodb.com/docs/manual/sharding/)


---
