# 🔍 4. Индексы и структуры данных

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

## 🔹 B-Tree

---

1. (L1 [T]) Что такое B-Tree и какие инварианты он поддерживает?

   **Ответ:** Сбалансированное многоходовое дерево: ключи узла отсортированы, children покрывают соответствующие интервалы, occupancy ограничена, листья одной глубины. Convention порядка/minimum degree нужно объявить явно.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


2. (L1 [T]) Чем B-Tree отличается от бинарного дерева поиска?

   **Ответ:** У бинарного дерева максимум два child, у B-tree — много. Fanout уменьшает глубину и число чтений страниц; баланс B-tree поддерживается split/merge.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


3. (L1 [T]) Почему B-Tree хорошо подходит для дисковых структур?

   **Ответ:** Страница содержит много ключей, поэтому одно I/O отсекает большой диапазон. Верхние уровни часто в cache, уменьшая реальные disk accesses.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


4. (L1 [T]) Что такое порядок (order) B-Tree?

   **Ответ:** Неоднозначный термин: максимум children либо параметр minimum degree. Зафиксировать convention и min/max ключей до реализации split/merge.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


5. (L1 [T]) Что такое node/page в контексте B-Tree?

   **Ответ:** Логический узел, обычно сериализованный в фиксированный block с header, keys, offsets и child/row references. Размер DB page не обязан равняться OS page.

   **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


6. (L1 [T]) Что такое leaf node и internal node?

   **Ответ:** Internal node маршрутизирует по separators и children; leaf содержит конечные entries/records. У B+tree payload находится в листьях, часто связанных соседними ссылками.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


7. (L1 [T]) Как выполняется поиск в B-Tree?

   **Ответ:** В узле найти подходящий ключ/интервал, перейти в child и повторять до листа. Сравнение и правила равенства должны совпадать при insert и lookup.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


8. (L1 [T]) Как выполняется вставка?

   **Ответ:** Найти leaf, вставить в sorted order, при overflow разделить страницу и добавить separator родителю. Split может каскадировать и создать новый root.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


9. (L1 [T]) Что такое split node?

   **Ответ:** Разделение переполненного узла на два с перераспределением keys/children и обновлением parent separator. У B-tree и B+tree перенос/копирование median различаются.

   **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


10. (L1 [T]) Почему высота дерева мала?

    **Ответ:** Высота растёт логарифмически по большому fanout: одна страница адресует множество потомков. Длинные ключи/низкая occupancy уменьшают fanout.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


11. (L1 [P]) Реализовать in-memory B-Tree на C++

    **Ответ:** Начать с Node{keys,children,leaf} и minimum degree; реализовать search и insert со split. Проверять sorted keys, occupancy, child intervals и равную глубину листьев после каждой операции.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


12. (L1 [P]) Реализовать поиск по ключу

    **Ответ:** lower_bound по ключам узла, сравнение на совпадение, затем нужный child. Проверить пустое дерево, граничные и отсутствующие ключи, duplicates согласно API.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


13. (L1 [P]) Реализовать вставку с split

    **Ответ:** Перед descent разделять full child либо распространять overflow снизу; поддерживать правильный separator и parent/root. Сравнить все результаты с std::map.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [C++ working draft: Library](https://eel.is/c++draft/library)


14. (L1 [P]) Реализовать удаление (упрощённо)

    **Ответ:** Удалить ключ, при underflow занять у sibling или merge с обновлением parent; пустой internal root заменить child. Даже упрощённый вариант должен сохранять search invariant.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


15. (L1 [P]) Реализовать итератор по B-Tree

    **Ответ:** In-order traversal со стеком ancestor/child positions; для B+tree удобно linked leaves. Определить invalidation iterator при update и lifetime страниц.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


---

16. (L2 [T]) Почему размер страницы обычно совпадает с page size ОС (4KB/8KB)?

    **Ответ:** Совпадение не обязательно: ОС часто использует 4 KiB, PostgreSQL обычно 8 KiB. DB page выбирается по fanout/I/O/cache/recovery, а не только OS granularity.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


17. (L2 [T]) Что такое fanout и как он влияет на глубину дерева?

    **Ответ:** Число children internal node. Чем оно больше, тем меньше ожидаемая глубина, но крупные страницы/сравнения/перенос bytes могут стоить дороже.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


18. (L2 [T]) Почему B-Tree оптимален по IO?

    **Ответ:** Высокий fanout уменьшает число page transfers для ordered lookup. «Оптимален» зависит от external-memory модели: cache, updates и competing structures меняют практический результат.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


19. (L2 [T]) Что такое B+Tree и чем он отличается?

    **Ответ:** B+tree хранит payload в листьях, internal pages — separators; листья часто связаны. Классический B-tree может хранить записи и внутри.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


20. (L2 [T]) Почему данные обычно хранятся только в листьях?

    **Ответ:** Это увеличивает fanout внутренних страниц и позволяет однообразно проходить листья для ranges. Цена — необходимость спуститься в leaf даже при совпавшем separator.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


21. (L2 [T]) Что такое range scan и почему он эффективен?

    **Ответ:** Поиск начального ключа, затем последовательный проход подходящих leaf entries. Эффективность зависит от physical locality, heap fetch и видимости версий.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


22. (L2 [T]) Что такое latch coupling?

    **Ответ:** Захват child latch до освобождения parent, чтобы traversal не использовал исчезнувшую/неверно связанную страницу. Изменяющий путь удерживает ancestors, пока возможен split/merge.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


23. (L2 [T]) Почему node split дорогой?

    **Ответ:** Нужны allocation, перенос bytes, WAL и обновление parent/links; возможен каскад. Contention и storage flush делают хвостовую задержку выше средней вставки.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


24. (L2 [T]) Что такое fill factor?

    **Ответ:** Целевая заполненность страниц с резервом свободного места. Меньшая occupancy уменьшает некоторые splits ценой размера индекса и cache footprint.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


25. (L2 [T]) Почему fragmentation влияет на B-Tree?

    **Ответ:** Свободное место и physical scattering увеличивают количество страниц и ухудшают locality. Rebuild/compaction могут помочь, но требуют resources и не устраняют причину будущих splits.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


26. (L2 [P]) Реализовать B+Tree с linked листьями

    **Ответ:** Разделить internal/leaf layouts; при split связать новый leaf с соседями и затем опубликовать separator. Проверять двусторонние ссылки и ordered scan после вставок/удалений.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


27. (L2 [P]) Реализовать range scan iterator

    **Ответ:** Seek lower_bound(low), затем leaf iterator до high по выбранной inclusive/exclusive semantics. Проверить пустой диапазон, duplicates, page boundary и concurrent invalidation.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


28. (L2 [P]) Реализовать page layout (slotted page)

    **Ответ:** Header + slot directory + packed variable-size records; slots хранят offsets/lengths. При compaction менять offsets, сохраняя обещанную slot identity; валидировать bounds.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


29. (L2 [P]) Реализовать бинарный поиск внутри страницы

    **Ответ:** Binary search по логическому массиву keys/slots с единым comparator. Не искать напрямую по packed bytes без декодирования формата и границ.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


30. (L2 [P]) Реализовать page split с перераспределением ключей

    **Ответ:** Выбрать точку разделения, перенести keys/children, установить separators и sibling links. Учесть variable-length keys, WAL/recovery и publication order для readers.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


31. (L2 [D]) Почему insert latency растёт при заполнении дерева?

    **Ответ:** Измерить split rate, leaf/cache misses и contention при том же key distribution. Большое дерево чаще выходит из cache, а заполненные leaves чаще требуют split.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


32. (L2 [D]) Почему range scan стал медленным?

    **Ответ:** Сопоставить количество leaf/heap pages, physical clustering, fragmentation и MVCC dead entries. Индексный порядок не гарантирует последовательное расположение строк heap.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


33. (L2 [D]) Почему page split вызывает latency spikes?

    **Ответ:** Сопоставить p99 insert с split/WAL/parent latch и storage allocation. Проверить каскад root и fillfactor; average throughput не исключает редкие дорогие splits.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


34. (L2 [D]) Почему cache miss rate высокий?

    **Ответ:** Проверить working set, key width, page count и random access. Измерить cache misses по уровням дерева, а не только глобальный hit ratio.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


35. (L2 [D]) Почему random IO растёт?

    **Ответ:** Рост индекса/heap probes вышел за cache либо изменился distribution/query plan. Сравнить physical reads на lookup и фактический план, отдельно index и table I/O.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


---

36. (L3 [T]) Как устроен B-Tree в PostgreSQL/InnoDB на уровне страниц?

    **Ответ:** Оба используют страницы и ordered separators, но PostgreSQL B-tree и InnoDB clustered/secondary layout различаются. InnoDB primary leaf содержит row, PostgreSQL индекс обычно ссылается на heap tuple.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


37. (L3 [T]) Что такое sibling pointers и зачем они нужны?

    **Ответ:** Siblings связывают соседние страницы; right link/high key помогают найти правильную page после split. Они также упрощают range scan и безопасный concurrent traversal.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


38. (L3 [T]) Как работает latch coupling при traversal?

    **Ответ:** Захватить child, проверить его принадлежность нужному интервалу, затем отпустить parent. Для insert/delete удержание ancestors определяется безопасностью child для overflow/underflow.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


39. (L3 [T]) Как реализуется concurrent B-Tree?

    **Ответ:** Используются page latches, right links/high keys, version validation и WAL. Physical structure protection отделяют от transaction key/predicate locks и reclamation.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


40. (L3 [T]) Что такое B-link tree?

    **Ответ:** B+tree-подобная структура с right links и high keys, позволяющими обойти concurrent split. Обновления parent могут завершаться после публикации нового right sibling при правильном протоколе.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


41. (L3 [T]) Как реализуются key-range locks?

    **Ответ:** Lock manager защищает interval/gap от конфликтующих insert/update. Конкретные next-key/predicate semantics зависят от engine; SSI tracking не обязательно блокирует writers.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


42. (L3 [T]) Как влияет cache line alignment на performance?

    **Ответ:** Уменьшает split-line accesses и false sharing hot metadata, но padding увеличивает объём. Проверять профиль: alignment не исправляет истинный общий lock.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


43. (L3 [T]) Почему pointer chasing дорогой?

    **Ответ:** Каждый зависимый pointer load ждёт предыдущий, снижая memory-level parallelism. Cache-friendly pages/compact offsets уменьшают переходы и cache misses.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


44. (L3 [T]) Как работает prefix compression?

    **Ответ:** Общие префиксы ключей сохраняются один раз/как length+suffix; restart points ограничивают стоимость seek. Comparator и decode обязаны восстанавливать исходный порядок.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


45. (L3 [T]) Как реализуется page compaction?

    **Ответ:** Перемещает живые записи внутри страницы и обновляет slot offsets, объединяя free space. Сохранять row/slot references, concurrency и WAL recovery invariant.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


46. (L3 [P]) Реализовать concurrent B-Tree с latch coupling

    **Ответ:** Начать с явного latch order и child-before-parent-release; сложные split/merge защищать безопасным набором ancestors. Stress сравнивать с locked reference map, проверять deadlocks и memory lifetime.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


47. (L3 [P]) Реализовать prefix compression ключей

    **Ответ:** Хранить prefix length/suffix и periodic full keys, decoder проверяет длины и offsets. Проверить seek/scan на длинных одинаковых префиксах и corrupted blocks.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


48. (L3 [P]) Реализовать page compaction

    **Ответ:** Под latch скопировать живые payload в packed layout, обновить directory и записать WAL по протоколу. Проверить recovery до/после перемещения и стабильность внешних slot IDs.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


49. (L3 [P]) Реализовать B-link tree

    **Ответ:** Добавить high key/right link, публиковать split в доказанном порядке и корректировать parent. Проверять readers во время каждого failpoint split, затем merge/reclamation.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


50. (L3 [P]) Реализовать optimistic traversal

    **Ответ:** Reader фиксирует page version, читает, проверяет неизменность и повторяет при конфликте; writer меняет version по протоколу. Memory lifetime page должен оставаться безопасным и при retries.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [CMU 15-445: Index concurrency](https://15445.courses.cs.cmu.edu/fall2024/notes/10-indexconcurrency.pdf)


51. (L3 [D]) Почему contention на root node?

    **Ответ:** Снять hold/wait root latch и cache-line contention. Если exclusive root берётся на каждый insert, сократить scope/применить безопасный descent; горячий root в cache сам по себе нормален.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


52. (L3 [D]) Почему NUMA ухудшает performance B-Tree?

    **Ответ:** Pointer/page allocations могли оказаться на другом socket, а shared latches мигрируют. Проверить first-touch, thread affinity, remote accesses и баланс перед NUMA pinning.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


53. (L3 [D]) Почему TLB misses растут при больших индексах?

    **Ответ:** Случайный доступ к большему числу страниц выходит за TLB coverage. Проверить page walks/working set, compact layout и huge-page trade-off, не смешивать с disk page misses.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


54. (L3 [D]) Почему branch misprediction влияет на поиск?

    **Ответ:** Binary search ветвится по input-dependent comparisons. Измерить branch misses и CPU profile, сравнить layouts/branchless/SIMD без увеличения лишних memory loads.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


55. (L3 [D]) Как диагностировать latch contention?

    **Ответ:** Собрать latch waits/spins по page/level, holder stacks и critical-section time. Разделить hot key, root bottleneck и allocator; транзакционные lock reports могут не показывать latch проблему.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

56. (L4 [S]) Когда B-Tree лучше LSM?

    **Ответ:** Для ordered/range/point queries с приемлемыми updates и без LSM maintenance debt. Сравнивать filled steady-state workload, amplification, p99 и recovery, а не только insert throughput.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

57. (L4 [S]) Как выбрать размер страницы?

    **Ответ:** По key width/fanout, размеру reads, cache budget, splits и atomic/recovery требованиям. DB page не обязана совпадать с OS page или максимальным device request.

    **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

58. (L4 [S]) Как проектировать B-Tree под SSD?

    **Ответ:** Использовать параллельные reads/reuse cache, учитывать write amplification/endurance и flush semantics. SSD уменьшает seek penalty, но не устраняет random IOPS/queueing и page-latch contention.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)

59. (L4 [S]) Как бороться с hot keys?

    **Ответ:** Read hotspot — cache/coalescing/replicas; write hotspot — разделение агрегата/шарда, если допустимы инварианты. Добавление независимых pages не распараллеливает одну логическую запись.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

60. (L4 [S]) Как проектировать concurrent index без глобальных bottleneck?

    **Ответ:** Минимизировать global mutable metadata, page latches и central allocation, применять partitioning/version validation. Доказать correctness/reclamation раньше, чем выбирать lock-free ради названия.

    **Источник:** [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics)


---

## 🔹 LSM Tree

---

61. (L1 [T]) Что такое LSM Tree?

    **Ответ:** LSM буферизует writes в memtable и создаёт immutable sorted runs, сливаемые compaction. Durable WAL защищает данные до flush при соответствующей конфигурации.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


62. (L1 [T]) Из каких компонентов он состоит?

    **Ответ:** WAL, active/frozen memtables, SST files, manifest/version metadata, indexes/filters/cache и compaction workers. Optional features не меняют необходимость visibility/recovery protocol.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


63. (L1 [T]) Что такое memtable?

    **Ответ:** Упорядоченный in-memory слой новых версий/удалений, обычно skip list/tree. Freeze делает его неизменяемым до flush и освобождения после readers.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


64. (L1 [T]) Что такое SSTable?

    **Ответ:** Immutable отсортированный файл key/value с blocks, sparse index, metadata и checksum. Имеет собственный format/comparator/version, а не произвольный dump hash map.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


65. (L1 [T]) Что такое compaction?

    **Ответ:** Слияние sorted runs с разрешением versions и безопасным reclaim. Это не просто concatenate files: нужно сохранить snapshots/tombstone semantics и atomically publish outputs.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


66. (L1 [T]) Почему LSM оптимален для write-heavy workload?

    **Ответ:** Batching и sequential flush сокращают часть случайных мелких updates. Однако компактация должна успевать за входом; LSM не универсально оптимален для любого write-heavy сценария.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


67. (L1 [T]) Почему reads дороже?

    **Ответ:** Lookup может проверить несколько runs/versions и filters, а scan объединяет iterators. Cache/Bloom/compaction уменьшают work, поэтому actual read cost зависит от конфигурации.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


68. (L1 [T]) Что такое immutable structure?

    **Ответ:** Структура не меняется после публикации; update создаёт новую версию. Это упрощает readers, но требует generation tracking и delayed reclaim старых данных.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


69. (L1 [T]) Что такое flush?

    **Ответ:** Преобразование frozen memtable в SST с последующей публикацией manifest. Flush не равен compaction нескольких SST и не всегда является commit boundary.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


70. (L1 [T]) Что такое write amplification?

    **Ответ:** Отношение physical bytes written к logical changed bytes в заданной границе. WAL, compaction, индексы и device FTL следует считать отдельно.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


71. (L1 [P]) Реализовать memtable (skip list / tree)

    **Ответ:** Реализовать ordered container key→версии с sequence/tombstone; freeze переключает active pointer. WAL и commit visibility должны предшествовать нужному ACK, readers удерживают lifetime.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


72. (L1 [P]) Реализовать SSTable файл

    **Ответ:** Sorted blocks + checksums/index/footer, bounded writer и parser с проверкой offsets. Сначала закончить/sync файл, затем публиковать в manifest.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


73. (L1 [P]) Реализовать flush на диск

    **Ответ:** Зафиксировать immutable memtable, писать SST, sync output/metadata и durable manifest; только потом освобождать WAL/таблицу по safety границе. Проверить crash на каждом шаге.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)


74. (L1 [P]) Реализовать merge нескольких SSTable

    **Ответ:** K-way merge sorted iterators, для одинакового key выбрать допустимую snapshot версию. Не удалять tombstone, если старая версия может прийти из другого уровня.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


75. (L1 [P]) Реализовать простой LSM KV store

    **Ответ:** WAL + ordered memtable + SST/manifest + get/scan и безопасный merge. Проверить crash/replay, overwrite/delete, retained snapshots и equivalence с reference map.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


---

76. (L2 [T]) Что такое leveled vs tiered compaction?

    **Ответ:** Leveled уменьшает overlap большей части levels ценой rewrites; tiered хранит несколько runs, меняя read/space cost. Выбор зависит от sustainable maintenance и запросов.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


77. (L2 [T]) Что такое bloom filter?

    **Ответ:** Вероятностный bit filter: «точно нет» либо «возможно есть». Correct insert/read дают отсутствие false negatives, положительный ответ проверяется данными.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


78. (L2 [T]) Что такое read amplification?

    **Ответ:** Лишние probes/blocks/bytes на полезное чтение. Указывать границу: SST probes, cache accesses или physical disk bytes — это разные метрики.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


79. (L2 [T]) Почему compaction дорогой?

    **Ответ:** Читает, декодирует, сортированно сливает и повторно пишет данные; потребляет CPU, bandwidth и временный disk. Сжатие и snapshots могут повышать cost.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


80. (L2 [T]) Как работает merge iterator?

    **Ответ:** Выбирает следующий минимальный key из нескольких ordered inputs, разрешая duplicates/versions. Heap даёт O(log k) выбор, input lifetime удерживается до окончания.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


81. (L2 [T]) Что такое tombstone?

    **Ответ:** Запись удаления, подавляющая старые версии. Удаляется из storage лишь когда не может воскресить данные в snapshots/других runs/replicas.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


82. (L2 [T]) Почему delete дорогой?

    **Ответ:** Сначала создаётся tombstone, позже compaction проверяет и удаляет старые версии. Массовое delete не обязано немедленно уменьшать размер файла.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


83. (L2 [T]) Что такое write stall?

    **Ответ:** Ограничение/остановка writers при переполненных memtables/L0/maintenance backlog. Защищает bounded resources, но добавляет queueing и p99.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


84. (L2 [T]) Что такое backpressure?

    **Ответ:** Сигнал замедлить upstream при недостатке capacity: bounded queue, wait/reject и quota. Без него burst превращается в неограниченную память/latency.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


85. (L2 [T]) Почему LSM плохо для range scan?

    **Ответ:** Предпосылка не универсальна: LSM хорошо сканирует sorted runs, но должен merge overlaps/versions/tombstones. Сравнить число iterators и bytes examined с B+tree на своём workload.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


86. (L2 [P]) Реализовать bloom filter

    **Ответ:** Реализовать m-bit array, k probes, одинаковое encoding/hash для insert/query и versioned serialization. Проверить все inserted keys и false-positive rate отсутствующих.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


87. (L2 [P]) Реализовать merge iterator

    **Ответ:** Держать heap heads input iterators, шагать по минимальному ключу, дедуплицировать versions по sequence/snapshot. Обработать end/error и lifetime каждого файла.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


88. (L2 [P]) Реализовать leveled compaction

    **Ответ:** Выбирать overlapping inputs соседних levels, merge в неперекрывающиеся output ranges и atomically обновлять manifest. Old files удалять после readers и безопасной публикации.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


89. (L2 [P]) Реализовать tombstone deletion

    **Ответ:** Put tombstone с sequence, get/merge подавляет старые значения. Drop только при достаточном coverage/history horizon; тестировать «новая delete + старая value в нижнем level».

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


90. (L2 [P]) Реализовать read path через несколько уровней

    **Ответ:** Проверить active/frozen memtables и нужные SST по ranges/filters, выбрать новейшую видимую version. Недостаточно вернуть первую найденную value при несовместимом порядке files.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


91. (L2 [D]) Почему disk usage растёт?

    **Ответ:** Измерить live data, WAL, files per level, pinned snapshots и pending outputs. Space растёт при compaction debt/retention даже без роста live keys.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


92. (L2 [D]) Почему latency скачет?

    **Ответ:** Сопоставить p99 с stalls, flush/compaction, fsync, page faults и hot keys. Разделить queue wait и service time, сравнить одинаковый workload.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


93. (L2 [D]) Почему compaction грузит CPU?

    **Ответ:** Профиль покажет merge/comparisons/codec; сопоставить bytes compacted и CPU/IO budget. Rate limit защищает сейчас, но не должен приводить к постоянному росту debt.

    **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


94. (L2 [D]) Почему read amplification вырос?

    **Ответ:** Проверить L0/overlap, files probed, Bloom false positives и cache hit. Долгие snapshots/tombstones могут увеличить work; disk быстрее не исправит плохой read path.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


95. (L2 [D]) Почему write stall происходит?

    **Ответ:** Вход/flush опережают compaction, либо место/threads/snapshots мешают reclaim. Проверить configured stop/slowdown conditions, pending bytes и bottleneck устройства/CPU.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


---

96. (L3 [T]) Как устроен RocksDB?

    **Ответ:** Embedded LSM engine: WAL/memtables, SST/manifest, caches/filters и configurable compaction. RocksDB сам не предоставляет готовый distributed replication protocol.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


97. (L3 [T]) Как работает block cache?

    **Ответ:** Хранит data/index/filter blocks в ограниченной памяти с replacement/pinning. Cache key включает file generation; повторное использование IDs не должно возвращать чужие blocks.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


98. (L3 [T]) Как устроен SSTable format?

    **Ответ:** Blocks с encoded keys/values, restart points, index/filter metadata, handles и footer. Parser проверяет magic/version/checksum/bounds и comparator compatibility.

    **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


99. (L3 [T]) Как реализуется prefix bloom?

    **Ответ:** Prefix extractor определяет часть ключа для filter и обязателен одинаковый build/read смысл. Query вне допустимой prefix semantics требует корректного fallback, иначе возможны пропуски.

    **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


100. (L3 [T]) Как работает compaction scheduler?

     **Ответ:** Выбирает jobs по levels/overlap/debt и ресурсам, предотвращая conflicting inputs. Приоритет/parallelism/rate limit согласуются с foreground SLO и устройством.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


101. (L3 [T]) Как влияет SSD на LSM design?

     **Ответ:** Меньше mechanical seek penalty, больше параллелизм; остаются bandwidth, endurance/FTL и p99 flush. Выбирать compaction/block/cache по реальным лимитам SSD, а не считать random I/O бесплатным.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


102. (L3 [T]) Что такое compaction debt?

     **Ответ:** Невыполненная обязательная работа compaction, оцениваемая files/bytes/time. Если debt растёт устойчиво, дополнительные buffers лишь откладывают stall.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


103. (L3 [T]) Как работает rate limiting compaction?

     **Ответ:** Выдаёт фоновой работе ограниченный byte/IO budget и priorities. Слишком малый budget защищает latency краткосрочно, но накапливает files/debt.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


104. (L3 [T]) Как оптимизируется read path?

     **Ответ:** Уменьшать ненужные SST probes через ranges/index/Bloom, cache и compaction; соблюдать snapshot/version resolution. Измерять blocks/files/bytes на get/scan, включая cold misses.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


105. (L3 [T]) Как работает key ordering?

     **Ответ:** Comparator задаёт полный согласованный порядок build/search/merge. Encoding чисел/строк и collation должны соответствовать ему, а изменения comparator требуют migration/rebuild.

     **Источник:** [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


106. (L3 [P]) Реализовать block cache

     **Ответ:** Bounded map block key→pinned buffer с LRU/Clock и coalescing загрузок. Ключ включает file generation, eviction не освобождает bytes активного reader.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


107. (L3 [P]) Реализовать compaction scheduler

     **Ответ:** Priority queue jobs по debt/level, budget threads/bytes и reservations на inputs. Проверить cancellation, error cleanup, starvation и отсутствие одновременной compaction одного файла.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


108. (L3 [P]) Реализовать prefix bloom filter

     **Ответ:** Сохранить prefix extractor identity/parameters с file metadata, filter строить по тем же prefixes. Проверить queries с/без подходящего prefix и отсутствие false negatives.

     **Источник:** [RocksDB: Bloom filter](https://github.com/facebook/rocksdb/wiki/RocksDB-Bloom-Filter)


109. (L3 [P]) Реализовать zero-copy read SSTable

     **Ответ:** Отобразить immutable file и вернуть checked slice, удерживающий mapping generation. Compaction/delete не должны unmap/reuse bytes до освобождения всех slices.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [RocksDB: BlockBasedTable format](https://github.com/facebook/rocksdb/wiki/Rocksdb-BlockBasedTable-Format)


110. (L3 [P]) Реализовать rate-limited compaction

     **Ответ:** Token bucket по bytes/IO с cancellation и bounded waits, priority для критичной maintenance. Проверять foreground p99 и trend debt, а не только соблюдение лимита.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


111. (L3 [D]) Почему compaction мешает latency SLA?

     **Ответ:** Конкурирует за CPU/IO/cache, иногда создаёт очередь/space pressure. По timeline сравнить p99 и background work, проверить backlog перед уменьшением лимитов.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


112. (L3 [D]) Почему CPU usage высокий даже без нагрузки?

     **Ответ:** Проверить background compaction/flush/GC/retries и busy loops через per-thread profile. «Нет внешних запросов» не означает отсутствие maintenance.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


113. (L3 [D]) Почему read path деградирует со временем?

     **Ответ:** Рост working set/files/dead versions и compaction lag повышает probes/cache misses. Сравнить per-level/lookup metrics с исходным steady state и размером набора.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


114. (L3 [D]) Почему hot keys ломают LSM?

     **Ответ:** Read hotspot насыщает cache/node, write hotspot создаёт contention и очередь по одному ключу. Проверить per-key heat, coalescing/replicas или доменно допустимое разделение writes.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


115. (L3 [D]) Как диагностировать compaction backlog?

     **Ответ:** Измерять pending compaction bytes, L0 files, job throughput, stalls и disk headroom. Сопоставить incoming write work с устойчивой maintenance capacity.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


---

116. (L4 [S]) Когда LSM лучше B-Tree?

     **Ответ:** Для большого потока мелких writes при приемлемой цене compaction и read amplification. Сравнить p99/space/endurance/range scans на заполненном steady-state dataset.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

117. (L4 [S]) Как выбрать compaction strategy?

     **Ответ:** По read/write/range mix, space/endurance и SLO: leveled/tiered имеют разные amplification trade-offs. Проверить snapshots, delete rate и worst-case compaction.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

118. (L4 [S]) Как проектировать LSM под SSD/NVMe?

     **Ответ:** Настроить concurrent I/O, block/cache/filter и rate-limited maintenance, оставить space/endurance запас. NVMe throughput не отменяет fsync/recovery и CPU codec/comparison costs.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)

119. (L4 [S]) Как минимизировать write amplification?

     **Ответ:** Убирать лишние rewrites/indexes, batch, выбирать compaction и подходящее encoding. Выигрыш WA сверять с read/space amplification и устойчивым p99, не ослаблять durability незаметно.

     **Источник:** [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

120. (L4 [S]) Как балансировать read vs write performance?

     **Ответ:** Задать budgets read/write/space и latency, сравнивать steady state с maintenance. Улучшение одной amplification часто ухудшает другую, поэтому измерять весь workload.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)


---

## 🔹 Hash Index

---

121. (L1 [T]) Что такое hash index?

     **Ответ:** Структура hash(key)→bucket→full-key comparison→row/value. Обычно эффективна для equality, но не задаёт упорядоченность диапазонов.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


122. (L1 [T]) Как работает hashing?

     **Ответ:** Детерминированно преобразует key bytes в hash code; bucket определяется mapping/capacity. Equality должен быть согласован с hash для всех representations ключа.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


123. (L1 [T]) Что такое collision?

     **Ответ:** Разные ключи получают один hash/bucket. Это нормально и решается full-key comparison и collision strategy, а не предположением уникальности hash.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


124. (L1 [T]) Что такое chaining vs open addressing?

     **Ответ:** Chaining хранит отдельные списки/массивы entries bucket; open addressing ищет slot внутри общего массива. Они по-разному платят pointers/cache/probes и deletion complexity.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


125. (L1 [T]) Когда hash index лучше B-Tree?

     **Ответ:** Для equality lookup без ranges/order, если hash cost и load factor приемлемы. B-tree может выигрывать locality/covering/малым working set, поэтому benchmark обязателен.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)


126. (L1 [P]) Реализовать hash table на C

     **Ответ:** Buckets, hash/equality, collision resolution, resize и ownership памяти. Проверить пустые keys, deliberate collisions, delete, overflow и allocation failure.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


127. (L1 [P]) Реализовать chaining

     **Ответ:** Bucket хранит chain entries, insert/get сравнивают полный key, delete связывает соседей и освобождает owner. Ограничить lifetime возвращаемой ссылки при concurrent remove.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


128. (L1 [P]) Реализовать open addressing

     **Ответ:** Выбрать probe sequence и состояния empty/occupied/deleted. Get не останавливается на tombstone, insert/resize сохраняют достижимость остальных keys; проверить full table.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


129. (L1 [P]) Реализовать resize

     **Ответ:** Выделить новый массив, перераспределить все entries, опубликовать новое поколение и безопасно освободить старое. Incremental migration требует чтения/записи обоих поколений.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


130. (L1 [P]) Реализовать hash function

     **Ответ:** Определить canonical encoding и смешивание bytes с обработкой всех длин. Для adversarial keys нужен подходящий keyed hash; проверить распределение и цену, не принимать hash за ID.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


---

131. (L2 [T]) Почему hash index не поддерживает range queries?

     **Ответ:** Hash mapping не сохраняет порядок исходных keys, поэтому соседние значения могут попасть куда угодно. Диапазон требует scan buckets или отдельного ordered index.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


132. (L2 [T]) Что такое load factor?

     **Ответ:** Отношение entries к capacity по convention структуры. Для chaining и open addressing одинаковое число имеет разные последствия; при заполнении probing резко дорожает.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


133. (L2 [T]) Почему resizing дорогой?

     **Ответ:** Нужно O(n) rehash/move и временно две таблицы, часто с синхронизацией. Цена особенно видна в p99; reserve/incremental migration меняют распределение задержек.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


134. (L2 [T]) Что такое cache-friendly hashing?

     **Ответ:** Компактные buckets/control bytes и contiguous probes уменьшают pointer chasing. Выигрыш зависит от key size, load factor и операций, а не одного названия algorithm.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


135. (L2 [T]) Почему hash index чувствителен к skew?

     **Ответ:** Неравномерные ключи/запросы создают длинные chains/probes или hot bucket. Один popular key горячий даже при идеальном hash distribution.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


136. (L2 [P]) Реализовать linear probing

     **Ответ:** Probe последовательно до empty/совпавшего key, insert использует корректный empty/deleted slot. Delete сохраняет search chain через tombstone/backward shift; проверить wrap-around.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


137. (L2 [P]) Реализовать robin hood hashing

     **Ответ:** При probing менять местами entries так, чтобы более удалённый от home получал slot. Сохранять probe-distance invariant при lookup/delete и проверять resize.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


138. (L2 [P]) Реализовать concurrent hash table

     **Ответ:** Начать с striped/per-bucket locks и явного resize barrier/version. Reads не должны видеть half-moved entries или freed table; доказать lifetime до попытки lock-free.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


139. (L2 [P]) Реализовать lock striping

     **Ответ:** Отобразить buckets в fixed stripes, при multi-bucket операции брать locks в едином порядке. Проверить hot stripe, resize coordination и false sharing mutex metadata.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


140. (L2 [P]) Реализовать cache-aligned buckets

     **Ответ:** Выделить bucket/control arrays с нужным alignment и разнести независимо изменяемые hot поля. Не раздувать каждый entry без профиля: footprint может стать хуже.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


141. (L2 [D]) Почему hash table деградирует при load factor > 0.8?

     **Ответ:** Плотная open-addressing table получает длинные probe clusters, но 0,8 не универсальный порог всех algorithms. Измерить probes p99, delete markers и hash quality.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


142. (L2 [D]) Почему performance нестабилен?

     **Ответ:** Проверить resize, changing load factor, collisions, working set/cache и concurrent contention. Сравнить latency по операциям, а не только aggregate throughput.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


143. (L2 [D]) Почему collisions резко выросли?

     **Ответ:** Возможно изменились key distribution/encoding, hash seed/function либо слишком мала capacity. Снять bucket/probe histogram и distinct keys, сравнить с прежним dataset.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


144. (L2 [D]) Почему resizing вызывает latency spike?

     **Ответ:** Массовый перенос и allocation под lock останавливают readers/writers. Измерить resize duration и память; reserve/incremental migration помогают при корректной generation/lifetime модели.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


145. (L2 [D]) Почему cache misses высокий?

     **Ответ:** Random buckets, chains, wide keys и working set выше LLC увеличивают misses. Проверить layout/probe lengths и NUMA, сравнить contiguous layout при том же load factor.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

146. (L3 [T]) Как устроены hash индексы в production DB?

     **Ответ:** Имеют buckets/pages, overflow/split/resize и recovery/concurrency protocol; детали зависят от engine. In-memory unordered_map не является готовым crash-safe disk index.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


147. (L3 [T]) Что такое extendible hashing?

     **Ответ:** Directory по hash prefix адресует buckets с local depth; split иногда удваивает directory. Durable updates должны сохранять reachable mapping и при crash.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


148. (L3 [T]) Что такое cuckoo hashing?

     **Ответ:** Несколько допустимых buckets; insert вытесняет entries между ними. Цикл требует stash/rehash, concurrent relocation усложняет корректность lookup.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


149. (L3 [T]) Как работает lock-free hash table?

     **Ответ:** CAS публикует entries/mappings, но delete/resize требуют reclamation и ABA защиты. Lock-free progress и linearization points доказываются отдельно от атомарности слова.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics)


150. (L3 [T]) Как влияет NUMA?

     **Ответ:** Threads и buckets/pages могут оказаться на разных NUMA sockets; shared hot metadata мигрирует. Проверить allocation/first-touch, remote memory и key locality.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


151. (L3 [P]) Реализовать cuckoo hashing

     **Ответ:** Два/несколько hash locations, displacement loop с bounded kicks и stash/rehash. Lookup проверяет все допустимые места, delete/concurrent move не теряют entry.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


152. (L3 [P]) Реализовать extendible hashing

     **Ответ:** Directory global depth + bucket local depth, split по следующему hash bit. Проверять doubling, shared directory pointers и поиск всех keys после split; disk version требует WAL/publication.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


153. (L3 [P]) Реализовать lock-free hash table

     **Ответ:** Взять доказанный алгоритм, определить memory orders, linearization и reclamation. Проверять insert/delete/resize interleavings с sanitizer/model/stress, не освобождать узел при живом reader.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics)


154. (L3 [P]) Реализовать NUMA-aware hashing

     **Ответ:** Partition buckets по NUMA domains и выполнять local allocation у владельцев, задать remote routing/fallback. Сравнить skew и общий баланс с выигрышем locality.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)


155. (L3 [P]) Реализовать per-bucket locking

     **Ответ:** Каждый bucket защищён lock, chain mutations и lifetime lookup согласованы. Для resize нужен отдельный protocol/lock order, иначе перенесённые entries станут недостижимы.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html)


156. (L3 [D]) Почему hot bucket ломает throughput?

     **Ответ:** Множество операций сериализуется по одной chain/lock/cache line. Разделить коллизии разных keys и запросы одного hot key; дополнительная capacity лечит только часть причин.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


157. (L3 [D]) Почему false sharing?

     **Ответ:** Adjacent locks/counters разных threads делят cache line. Проверить адреса perf c2c, разнести hot metadata и измерить footprint/throughput заново.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


158. (L3 [D]) Почему atomic operations дорогие?

     **Ответ:** Требуют coherence/ownership cache line, иногда full ordering и retry CAS при конфликте. Relaxed уменьшает часть ordering cost, но не устраняет true sharing и обязан сохранять correctness.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


159. (L3 [D]) Почему hash function стал bottleneck?

     **Ответ:** Профиль покажет bytes hashed/comparisons; длинные ключи или дорогой криптоhash могут доминировать. Выбирать hash по threat model, cache/precompute только при стабильных bytes и lifetime.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


160. (L3 [D]) Как диагностировать contention?

     **Ответ:** Измерить lock waits/CAS failures/probe lengths, skew и per-thread stacks. Определить global resize, hot bucket, allocator или false sharing, прежде чем менять algorithm.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

161. (L4 [S]) Когда использовать hash index?

     **Ответ:** Для точных equality queries с подходящей памятью/коллизиями, когда ordered scan не нужен. Сравнить с B-tree на реальных keys, concurrency и recoverability.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: B-tree implementation](https://www.postgresql.org/docs/current/btree.html)

162. (L4 [S]) Как выбрать hashing strategy?

     **Ответ:** По размеру/типу ключей, threat model, load factor, cache и concurrency. Chaining/probing/cuckoo/extendible имеют разные resize/lifetime и latency профили.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)

163. (L4 [S]) Как бороться с skew?

     **Ответ:** Хороший hash делит разные keys, но не запросы одного key. Read cache/replicas и доменно допустимые subkeys/sharding решают разные виды skew.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

164. (L4 [S]) Как проектировать distributed hash index?

     **Ответ:** Разделить global key placement и local bucket index, определить replication/authority/routing versions. Сохранность/unique multi-key semantics требуют отдельного protocol и recovery.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Raft paper](https://raft.github.io/raft.pdf)

165. (L4 [S]) Когда hash хуже B-Tree даже для point lookup?

     **Ответ:** Когда hash длинного key дороже ordered comparisons, working set/layout хуже или B-tree покрывает запрос без heap fetch. Проверять cold/warm, load factor и concurrency вместо асимптотики одного lookup.

     **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


---

## 🔹 Secondary Indexes

---

166. (L1 [T]) Что такое secondary index?

     **Ответ:** Дополнительный доступ по атрибуту, отличному от основного пути хранения. Хранит key и row identity/locator, должен обновляться вместе с row.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


167. (L1 [T]) Чем отличается от primary index?

     **Ответ:** Primary index/PK связан с основной идентичностью/организацией, secondary даёт другой search key. Физическое значение primary/clustered зависит от engine.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


168. (L1 [T]) Что хранится в secondary index?

     **Ответ:** Индексируемые key values, row locator/PK и нужные metadata/payload. Version/visibility представление зависит от storage engine.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


169. (L1 [T]) Почему нужен pointer/reference?

     **Ответ:** Чтобы после совпадения secondary key найти исходную строку/версию. На диске обычно stable ID/offset/PK, а не сырой process pointer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


170. (L1 [T]) Что такое index lookup?

     **Ответ:** Поиск index entry по predicate с последующей projection/row fetch и visibility/filter checks. Один matching entry не обязательно соответствует живой видимой строке.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


171. (L1 [P]) Реализовать secondary index mapping key → pointer

     **Ответ:** Map secondary value→набор stable row IDs; insert/update/delete меняют mapping atomically со строкой. Не сохранять pointer на reallocating vector без lifetime guarantees.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [C++ working draft: Library](https://eel.is/c++draft/library)


172. (L1 [P]) Реализовать lookup через secondary index

     **Ответ:** Найти IDs, проверить их generation/visibility, загрузить rows и применить residual predicate. Учесть неуникальные secondary values и deleted rows.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


173. (L1 [P]) Реализовать update secondary index

     **Ответ:** Удалить старый key→ID и добавить новый вместе с изменением row в одной atomic boundary. При rollback вернуть обе стороны, не оставляя половину update.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


174. (L1 [P]) Реализовать delete

     **Ответ:** Пометить/удалить index entry и row согласно version protocol; reclaim после исчезновения readers. Проверить lookup после delete и reuse row ID с новой generation.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


175. (L1 [P]) Реализовать multiple indexes

     **Ответ:** Хранить набор index definitions и transactionally обслуживать все затронутые индексы. Ошибка одного ограничения отменяет весь row/index набор.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

176. (L2 [T]) Почему secondary index может быть дорогим при update?

     **Ответ:** Изменение key требует remove+insert, payload update — rewrites, WAL и page splits. Чем больше indexes, тем выше commit work и cache/IO pressure.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


177. (L2 [T]) Что такое index maintenance?

     **Ответ:** Обслуживание индексов при изменениях: вставка/удаление entries, поддержка uniqueness, versions и cleanup. Оно входит в write cost даже без пользовательских index queries.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


178. (L2 [T]) Что такое index-only scan?

     **Ответ:** Ответ формируется из index без обычного table fetch для полей. PostgreSQL всё ещё проверяет visibility, иногда обращаясь к heap.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


179. (L2 [T]) Что такое clustering factor?

     **Ответ:** Оценка связи index order с физическим расположением rows. Хорошая clustering уменьшает scattered heap reads; смысл/метрики зависят от конкретной СУБД.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


180. (L2 [T]) Почему random IO возникает?

     **Ответ:** Secondary entries в key order ссылаются на scattered row pages. Большое число matches может дать множество random heap reads даже при sequential index scan.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


181. (L2 [P]) Реализовать index maintenance при insert/update/delete

     **Ответ:** Сначала вычислить old/new key sets, проверить constraints, затем atomically применить row/index changes с rollback/WAL. Проверить повтор apply и crash между этапами.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


182. (L2 [P]) Реализовать multi-index update

     **Ответ:** Использовать одну transaction/write set для всех индексов и row, фиксированный lock order и undo/redo. Нельзя подтверждать row до завершения обязательных index constraints.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


183. (L2 [P]) Реализовать index-only scan

     **Ответ:** Возвращать требуемые fields из index, если payload полный и visibility доказана; иначе загрузить row. Сравнить output с table scan на одном snapshot.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


184. (L2 [P]) Реализовать covering index

     **Ответ:** Разделить search key и included payload, поддерживать их изменение вместе с row. Проверить comparator, duplicates, NULL и snapshot visibility.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


185. (L2 [P]) Реализовать deferred index update

     **Ответ:** Durable queue/лог pending updates с versions, reader учитывает overlay либо допускает объявленную stale projection. Unique/transactional indexes нельзя молча сделать eventual.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)


186. (L2 [D]) Почему update стал медленным?

     **Ответ:** Профилировать index maintenance, WAL, splits и locks, сравнить set индексов и changed columns. Даже не меняющий key update может обновлять included payload/версии по engine rules.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


187. (L2 [D]) Почему index lookup медленный?

     **Ответ:** Сверить plan, matches, heap fetch, visibility и cache state. Низкая selectivity/плохая clustering делает secondary lookup дороже scan.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


188. (L2 [D]) Почему disk IO вырос?

     **Ответ:** Измерить index/table/WAL/temp I/O отдельно; добавленные indexes увеличивают write bytes и вытесняют pages. Query plan/regression может увеличить random reads.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


189. (L2 [D]) Почему fragmentation индекса?

     **Ответ:** Случайные inserts/deletes и variable-length updates создают holes/неполные pages. Проверить size/fill/split и retained dead entries перед rebuild.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


190. (L2 [D]) Почему cache locality плохой?

     **Ответ:** Index keys и referenced rows могут иметь разный порядок/working set, широкие entries не помещаются в cache. Измерить bytes/probes/heap fetch и physical clustering.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

191. (L3 [T]) Как secondary index реализуется в MVCC?

     **Ответ:** Entry указывает на row/version либо содержит key с row ID, а snapshot решает видимость. Изменённый secondary key может требовать старых entries до исчезновения старых snapshots.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


192. (L3 [T]) Как решается dangling pointer проблема?

     **Ответ:** Использовать stable IDs с generation или удерживать storage lifetime через pins/epochs. Delete/reuse не должен превращать старую ссылку в ссылку на чужую строку.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics)


193. (L3 [T]) Как secondary index связан с clustering?

     **Ответ:** Secondary index order часто отличается от row physical order; locator бывает clustered PK. Выбор PK/row layout влияет на размер secondary entries и стоимость fetch.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


194. (L3 [T]) Как реализуется covering index?

     **Ответ:** В index entry хранить недостающие projection fields/payload, обслуживать их при updates. Покрытие не отменяет visibility и residual predicates.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


195. (L3 [T]) Как работает index scan + filter?

     **Ответ:** Index ограничивает кандидатов, затем visibility и residual filter убирают неподходящие rows. Фильтр, не выраженный index bounds, всё ещё требует работы на каждом кандидате.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


196. (L3 [P]) Реализовать MVCC-aware secondary index

     **Ответ:** Сохранять row identity/version metadata и key generations, выбирать видимые snapshot entries. Проверить key-changing update между snapshots и cleanup после readers.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


197. (L3 [P]) Реализовать version pointer

     **Ответ:** Version reference содержит stable row ID и sequence/generation, resolution проверяет lifetime. Не сериализовать virtual pointer; после restart identity должна восстанавливаться.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


198. (L3 [P]) Реализовать index vacuum

     **Ответ:** Найти entries, не видимые ни одному удерживаемому snapshot, и удалить по engine protocol. Учитывать concurrent readers/writers и WAL перед reclaim.

     **Источник:** [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


199. (L3 [P]) Реализовать index compaction

     **Ответ:** Перепаковать живые entries/страницы с сохранением key order/locators, корректно опубликовать generation. Проверить crash и readers во время замены.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


200. (L3 [P]) Реализовать multi-version lookup

     **Ответ:** Среди entries одного key выбрать версии, видимые snapshot, исключить aborted/deleted. Проверять snapshot isolation и совпадение результатов с MVCC table scan.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


---

201. (L4 [S]) Когда создавать secondary index?

     **Ответ:** Когда запросы/constraints дают измеримый выигрыш больше write/space cost. Начать с predicates/join/order, подтвердить actual plan и workload, не отдельных microqueries.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

202. (L4 [S]) Как выбрать поля?

     **Ответ:** По filter/join/order и selectivity, учитывая composite prefix, types/collation и projection. Высокая cardinality полезна не всегда: важны actual queries и key width.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

203. (L4 [S]) Как балансировать write cost?

     **Ответ:** Оставить обязательные и реально полезные индексы, измерить WAL/CPU/IO per write. Часть чтений вынести в асинхронные проекции только при явной freshness семантике.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)

204. (L4 [S]) Как избегать over-indexing?

     **Ответ:** Собирать usage вместе с constraints/rare jobs, искать дубли/перекрытия и оценивать write cost. Не удалять индекс по короткому окну отсутствия scans.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

205. (L4 [S]) Как проектировать indexing strategy?

     **Ответ:** Inventory queries/constraints → candidate design → actual plan/нагрузка → controlled rollout. Планировать online build, storage, rollback и регулярную ревизию изменений workload.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


---

## 🔹 Covering Indexes

---

206. (L1 [T]) Что такое covering index?

     **Ответ:** Индекс, содержащий все поля, нужные query predicates/order/projection. Может избежать table fetch, но не всех visibility checks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


207. (L1 [T]) Почему он ускоряет запросы?

     **Ответ:** Убирает часть row fetch и random heap I/O, если запрос действительно покрыт и index path выгоден. Более широкий index может ухудшить cache и запись.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


208. (L1 [T]) Чем отличается от обычного secondary index?

     **Ответ:** Обычный secondary может хранить только search key/locator; covering дополнительно содержит нужный payload. Покрытие определяется конкретным запросом, а не постоянным свойством «индекс всегда покрывающий».

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


209. (L1 [T]) Что такое index-only scan?

     **Ответ:** Чтение результата из index при доступных полях и доказанной видимости. В PostgreSQL visibility map может потребовать heap fallback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


210. (L1 [T]) Когда он не работает?

     **Ответ:** Когда нужны отсутствующие fields, visibility требует row check или cost scan дешевле. Functions/collation/predicate/order также должны соответствовать доступному path.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


211. (L1 [P]) Реализовать covering index

     **Ответ:** Хранить search key, row ID, payload и необходимые visibility данные; updates изменяют согласованный entry. Проверить покрытие конкретной projection и fallback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


212. (L1 [P]) Реализовать index-only scan

     **Ответ:** Для каждого candidate проверить snapshot visibility и вернуть index fields, при недостаточной информации fetch row. Сверить с full table execution на concurrent updates.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


213. (L1 [P]) Реализовать projection из индекса

     **Ответ:** Сопоставить query column IDs с payload schema и построить projection без лишнего row object. Проверить NULL/type/default и остаточные predicates.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


214. (L1 [P]) Реализовать fallback на table lookup

     **Ответ:** При missing fields/неизвестной visibility загрузить row по stable ID, проверить version и predicate. Сохранять единый snapshot обоих путей.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


215. (L1 [P]) Реализовать multi-column index

     **Ответ:** Tuple key с lexicographic comparator и encoded boundaries, search по допустимому prefix/range. Проверить duplicates, NULL ordering и обновление любой части key.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


---

216. (L2 [T]) Почему covering index увеличивает размер индекса?

     **Ответ:** Каждый entry содержит дополнительные bytes payload, уменьшая entries/page и повышая cache footprint. Размер растёт с числом/шириной included fields и versions.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


217. (L2 [T]) Что такое selectivity?

     **Ответ:** Доля rows, удовлетворяющих predicate. Низкая доля часто делает index path полезным; высокая доля может оправдать sequential scan.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


218. (L2 [T]) Как влияет порядок колонок?

     **Ответ:** Composite B-tree order определяет leading-prefix доступ и поддерживаемую sort/range semantics. Equality-prefix и следующий range часто полезны, но реальные planner возможности зависят от продукта/версии.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


219. (L2 [T]) Почему index может не использоваться?

     **Ответ:** Cost/selectivity, incompatible expression/cast/collation, leading key, visibility/coverage или stale statistics. Проверить actual plan и bind values, не форсировать index только из-за наличия.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


220. (L2 [T]) Что такое prefix index?

     **Ответ:** Может означать leading prefix composite key либо индекс усечённой части значения. Для truncated string key equality проверяет полный оригинал, а uniqueness/sort/collation ограничения зависят от СУБД.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


221. (L2 [P]) Реализовать composite index

     **Ответ:** Tuple comparator с lexicographic order и стабильным encoding, insert/delete всех columns как одного key. Проверять prefix range bounds и NULL/variable-length values.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


222. (L2 [P]) Реализовать prefix matching

     **Ответ:** Определить lower/upper bounds допустимого prefix либо применять explicit prefix predicate; учитывать collation/encoding. Нельзя всегда строить upper bound простым увеличением последнего byte.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


223. (L2 [P]) Реализовать index scan optimizer

     **Ответ:** Определить применимые indexes, coverage/order и residual predicates, оценить selectivity/heap fetch. Сравнить с full scan и проверить одинаковый result.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


224. (L2 [P]) Реализовать cost estimation

     **Ответ:** Оценить rows, page probes, heap fetch, CPU, sort и startup/total cost по statistics. Калибровать estimates с actual measurements, не выдавать cost units за точные миллисекунды.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


225. (L2 [P]) Реализовать column pruning

     **Ответ:** Собрать required columns из projection/filter/join/order и читать только их. Не убирать поле, нужное скрытому predicate/visibility или expression.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


---

226. (L3 [T]) Как covering index влияет на cache locality?

     **Ответ:** Меньше разрозненных heap fetch, но более широкий index вытесняет pages и повышает bytes scanned. Измерить обе стороны на realistic working set.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


227. (L3 [T]) Как влияет на write amplification?

     **Ответ:** Payload требует дополнительных writes/WAL/splits при updates, даже если не search key. Read gain оценивать вместе с write volume и endurance.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


228. (L3 [T]) Как работает visibility check в index-only scan?

     **Ответ:** Visibility map в PostgreSQL подтверждает all-visible heap page; иначе нужна проверка tuple в heap. Новые writes очищают флаг, VACUUM может установить его безопасно.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


229. (L3 [T]) Как MVCC влияет на index-only scan?

     **Ответ:** Snapshot должен видеть правильную row version; наличие payload не доказывает актуальность. Старые index entries/невидимые tuples требуют фильтрации или fallback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


230. (L3 [T]) Как planner выбирает covering index?

     **Ответ:** Сравнивает selectivity, width, ordering, visibility/heap fetch estimates и scan cost с альтернативами. Проверять actual rows/Heap Fetches и cardinality errors.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


231. (L3 [P]) Реализовать visibility map

     **Ответ:** Хранить conservatively safe all-visible flags по data pages, очищать перед изменениями и устанавливать после проверки horizons. False-negative лишь теряет ускорение, false-positive может нарушить correctness.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


232. (L3 [P]) Реализовать MVCC-aware index-only scan

     **Ответ:** Index payload + snapshot visibility check + table fallback, согласованные versions обоих путей. Тестировать concurrent update/delete, старый snapshot и неверную/очищенную visibility metadata.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


233. (L3 [P]) Реализовать adaptive index selection

     **Ответ:** Собирать workload/usage и estimates, вводить hysteresis и budget build/drop, сравнивать кандидаты. Автоизменения не должны удалять constraints/редкие обязательные paths без правил.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


234. (L3 [P]) Реализовать cost-based optimizer для index choice

     **Ответ:** Перечислить допустимые full/index/index-only paths, оценить rows/CPU/IO/order и visibility cost. Сверять выбор с actual plans, отдельно cold/warm и разными bind values.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


235. (L3 [P]) Реализовать статистику использования индексов

     **Ответ:** Counters scans/tuples read/fetched/maintenance bytes и период наблюдения, bounded query classes. Usage дополнять constraints/rare-job inventory, чтобы не удалить нужный индекс.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


---

236. (L4 [S]) Когда стоит делать covering index?

     **Ответ:** Для частого стабильного read path с дорогим heap I/O и умеренной шириной/обновлением payload. Проверить реальный index-only эффект и p99, а не только syntax INCLUDE.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

237. (L4 [S]) Как балансировать size vs performance?

     **Ответ:** Сравнить экономию row fetch с index bytes/cache/write amplification. Ограничивать payload нужными полями и измерять read/write mix при рабочем размере БД.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

238. (L4 [S]) Как проектировать composite indexes?

     **Ответ:** От реальных equality/range/order/join запросов и constraints; учитывать prefix, types/collation, sort direction и included fields. Проверять несколько classes параметров и стоимость updates.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

239. (L4 [S]) Как избегать redundant indexes?

     **Ответ:** Искать одинаковые/перекрывающиеся definitions с учётом uniqueness, partial predicate, include/order/collation. Prefix overlap не всегда делает более короткий индекс полностью бесполезным.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

240. (L4 [S]) Как проектировать indexing под конкретный workload?

     **Ответ:** Запросы/constraints/SLO → минимальный набор индексов → workload verification → safe build/rollback и usage review. План должен учитывать рост данных, write amplification, VACUUM и migrations.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


---
