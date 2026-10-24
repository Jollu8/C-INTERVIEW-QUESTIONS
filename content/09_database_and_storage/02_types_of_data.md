# 📦 2. Типы баз данных — Вопросы

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

## 🔹 OLTP vs OLAP

---

### L1

**[T]**

1. В чем фундаментальная разница между OLTP и OLAP?

   **Ответ:** OLTP меняет небольшие наборы данных короткими транзакциями; OLAP агрегирует большие наборы. Сравнивать нужно profile запросов и SLA, а не только названия систем.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

2. Какие workload-характеристики у OLTP?

   **Ответ:** Много конкурентных коротких read/write, точечные индексы, ограничения и чувствительность к p99 commit. Важны конфликтность ключей и доля обновлений.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

3. Какие workload-характеристики у OLAP?

   **Ответ:** Большие scan/join/group/sort, чтение избранных колонок и работа партиями. Скорость зависит от bandwidth, CPU, pruning и объёма промежуточных результатов.

   **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

4. Почему OLAP предпочитает column-store?

   **Ответ:** Считывает нужные столбцы, лучше сжимает однородные значения и обрабатывает batches SIMD. Восстановление полной строки и частые точечные изменения могут быть дороже.

   **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

5. Что такое transactional vs analytical query?

   **Ответ:** Транзакционный запрос читает/меняет операционный факт, аналитический обобщает множество фактов. Одно SQL-выражение может сочетать обе роли.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


**[P]**

6. Смоделировать OLTP workload (много мелких writes)

   **Ответ:** Задать размер набора, распределение ключей, mix операций, threads и transaction size. Генерировать реалистичные конфликты, фиксировать seed, completed throughput, p50/p99 и ошибки.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

7. Смоделировать OLAP workload (scan + aggregation)

   **Ответ:** Подготовить данные больше/меньше RAM, выполнить scan нужных колонок с filter/group и проверить checksum результата. Отдельно измерить cold/warm run, прочитанные bytes и spill.

   **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

8. Написать benchmark (C++) для сравнения latency vs throughput

   **Ответ:** Использовать steady_clock и синхронный старт threads, не включать подготовку данных. Собрать распределение latency и завершённые ops/s; генератор open-loop должен учитывать coordinated omission.

   **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

9. Реализовать batched insert vs single insert

   **Ответ:** Сравнить одинаковое число строк и одинаковую durability: по одному commit и batches разных размеров. Измерять не только rows/s, но и задержку строки, WAL bytes и память batch.

   **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

10. Сравнить performance row vs column layout

    **Ответ:** Создать одинаковые данные в AoS и SoA, сравнить point read всей строки и scan одного столбца. Проверить результат и bandwidth/cache misses при одинаковой компиляции и working set.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

### L2

**[T]**

11. Почему OLTP требует low latency, а OLAP — high throughput?

    **Ответ:** Операционные действия часто блокируют пользователя, аналитика обычно обрабатывает больше данных. Однако OLAP тоже имеет latency SLO, а OLTP — throughput capacity; это не взаимоисключающие требования.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

12. Что такое star schema?

    **Ответ:** Факт-таблица с измерениями, присоединяемыми напрямую: звездообразная схема упрощает аналитические запросы. Гранулярность факта и ключи измерений должны быть явными.

    **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

13. Что такое snowflake schema?

    **Ответ:** Нормализованные измерения образуют дополнительные уровни связей. Снижается часть дублирования, но увеличивается число JOIN и сложность запросов.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

14. Почему joins в OLAP дорогие?

    **Ответ:** Затраты на чтение/build/probe hash tables, перераспределение и большой результат. JOIN не всегда дорог: фильтры, сортировка, индексы и небольшие измерения могут резко уменьшить стоимость.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

15. Что такое vectorized execution?

    **Ответ:** Оператор обрабатывает batch значений за вызов, уменьшая per-row overhead и облегчая SIMD. Vectorized execution не означает, что каждая операция использует аппаратный SIMD.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


**[P]**

16. Реализовать column scan с SIMD

    **Ответ:** Обрабатывать фиксированные порции одинакового типа, сравнивать SIMD lanes, собирать mask и корректно обработать tail. Проверять CPU support/alignment и сравнивать с scalar oracle.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library)

17. Реализовать aggregation pipeline

    **Ответ:** Разделить filter→project→aggregate, хранить state по ключу группы и передавать batches. Ограничить память и определить spill/merge, NULL и overflow semantics.

    **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

18. Написать простой vectorized executor

    **Ответ:** Ввести Batch с колонками и selection vector, операторы возвращают/потребляют batches. Убрать виртуальный вызов на строку, корректно завершать pipeline и проверять результат против scalar.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

19. Реализовать batch processing

    **Ответ:** Ограничить размер batch и время накопления, обрабатывать whole/partial batches, корректно повторять сбой. End-to-end latency включает ожидание заполнения batch.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

20. Реализовать simple columnar compression

    **Ответ:** Выбрать RLE/dictionary/delta по данным, записывать codec metadata и bounds. Реализовать round-trip decoder и проверить случайные, пустые и предельные значения.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


**[D]**

21. Почему OLAP query грузит CPU на 100%?

    **Ответ:** Полный CPU может быть полезной vectorized обработкой, decompression, hashing или ошибочным plan. Проверить профили, bytes processed и итоговую скорость, отличить compute-bound от stalled cycles.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

22. Почему OLTP latency нестабилен?

    **Ответ:** Lock waits, fsync/checkpoints, cache misses, pool queues и фоновые jobs меняют хвост. Сопоставить p99 с wait events и arrival rate, удерживая workload и durability постоянными.

    **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

23. Почему scan быстрее index lookup?

    **Ответ:** При большой селективности последовательное чтение дешевле множества случайных обращений по индексу. Проверить фактическую долю строк, cache state, clustering и planner estimates.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

24. Почему cache misses критичны для OLAP?

    **Ответ:** Scan должен быстро подавать значения вычислительным блокам; лишние cache lines снижают эффективный bandwidth. Проверить выбранные поля, layout и промежуточные объекты.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

25. Почему branch misprediction влияет на OLAP?

    **Ответ:** Непредсказуемый branch на каждую строку сбрасывает pipeline. Selection masks/SIMD могут помогать, но проверять по данным и compiler output: branchless не всегда быстрее.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


---

### L3

**[T]**

26. Как устроен execution engine в аналитических БД?

    **Ответ:** Pipeline scan/filter/project и blocking stages sort/hash aggregation, работающие над batches. Планировщик выбирает параллелизм, память и spill; профиль показывает затраты каждого оператора.

    **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

27. Что такое late materialization?

    **Ответ:** Откладывание сборки полных строк до фильтрации/агрегации. Переносятся IDs/selection vectors и только нужные столбцы, уменьшая bytes и allocation.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

28. Что такое predicate pushdown?

    **Ответ:** Безопасный перенос фильтра ближе к scan/source, чтобы сократить downstream rows/bytes. Не все выражения можно переносить через outer join, aggregation или volatile функции.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

29. Как работает SIMD в аналитике?

    **Ответ:** Одна инструкция применяет операцию к нескольким значениям одного типа. Выигрыш ограничивают память, ветвления, типы и преобразования; нужен scalar fallback.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library)

30. Что такое pipeline execution?

    **Ответ:** Смежные неблокирующие операторы передают данные без материализации полного промежуточного результата. Sort/global aggregation могут создавать pipeline barriers.

    **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)


**[P]**

31. Реализовать predicate pushdown

    **Ответ:** Представить predicate в scan API, применять до создания полного Row и подтвердить уменьшение rows read/materialized. Перенос разрешать только при сохранении SQL semantics.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

32. Реализовать late materialization

    **Ответ:** Хранить отобранные row IDs, затем загрузить требуемые столбцы только для survivors. Сравнить с eager reconstruction на низкой/высокой селективности.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

33. Написать SIMD filter (AVX)

    **Ответ:** Проверять AVX/AVX2 поддержку, vector width, mask и tail; не читать за границы массива. Сравнить бит-в-бит с scalar filter и измерять одинаковый input.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

34. Реализовать columnar iterator

    **Ответ:** Итератор выдаёт contiguous typed spans/blocks и validity bitmap. Сохранить lifetime backing storage, корректный переход через chunk и NULL semantics.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

35. Реализовать pipeline execution engine

    **Ответ:** Описать операторный DAG, batches, scheduling и backpressure. Blocking stages материализуют/сливают state, cancellation закрывает ресурсы и не теряет ошибки.

    **Источник:** [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


**[D]**

36. Как найти bottleneck в аналитическом запросе?

    **Ответ:** EXPLAIN с фактическими строками плюс профили CPU/I/O/memory/network. Искать ошибки cardinality, skew, spills и dominant stage вместо оптимизации самого длинного SQL-фрагмента.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

37. Почему memory bandwidth становится лимитом?

    **Ответ:** Scan потребляет больше байтов, чем память успевает доставить CPU. Измерить bandwidth и stalled cycles; уменьшить columns/width/материализацию и проверить NUMA.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

38. Как диагностировать NUMA penalty?

    **Ответ:** Сравнить размещение threads/pages, local/remote traffic и производительность pinned к локальному узлу. Высокий remote access может быть следствием first-touch в одном loader thread.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

39. Почему prefetching не работает?

    **Ответ:** Random access, нерегулярный stride, слишком далёкий/близкий prefetch и насыщение bandwidth скрывают пользу. Сравнить hardware/software prefetch и не добавлять лишние reads в cache.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

40. Как найти vectorization regression?

    **Ответ:** Сравнить compiler vectorization reports, assembly, типы/alignment и число scalar fallback. Проверить thresholds/selectivity и тот же CPU: иной input может менять branch behaviour без code regression.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

### L4

**[S]**

41. Когда разделять OLTP и OLAP системы?

    **Ответ:** Когда аналитические scan/CPU/I/O мешают latency транзакций либо нужны другие форматы/retention. Доставлять изменения через CDC с измеримой freshness и reconciliation.

    **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

42. Как строить HTAP систему?

    **Ответ:** Поддерживать transactional row path и аналитическую проекцию/snapshot с определённым lag. Изолировать ресурсы, определить consistency аналитики и стоимость propagation.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

43. Как проектировать real-time analytics?

    **Ответ:** Durable ingestion → partitioned stream → windowed aggregation → serving storage. Задать freshness SLO, event time, late events, replay и идемпотентные обновления.

    **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

44. Как минимизировать data duplication?

    **Ответ:** Хранить один canonical source, производные проекции только под измеренные запросы, общие objects/форматы и lifecycle. Дублирование иногда необходимо для latency/изоляции; цена синхронизации должна быть явной.

    **Источник:** [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

45. Как выбрать storage layout под mixed workload?

    **Ответ:** Выбрать доминирующий путь; для точечных изменений row store, для scan column store, для mixed — раздельные проекции либо hybrid. Сравнивать полный workload с concurrency и maintenance.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)


---

## 🔹 Row-based vs Column-based

---

### L1

**[T]**

46. В чем разница row-store vs column-store?

    **Ответ:** Row store размещает поля строки рядом, column store — значения столбца. Первый удобен для целой записи, второй уменьшает чтение ненужных полей и улучшает сжатие.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

47. Когда лучше row-based?

    **Ответ:** Для point reads целой записи, коротких транзакций и частых обновлений. Индексы и buffer cache всё равно определяют фактическую скорость.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

48. Когда лучше column-based?

    **Ответ:** Для scan небольшого числа колонок, агрегаций и сжатия больших массивов. Оценить цену updates/deletes и реконструкции строк.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [ClickHouse: Introduction](https://clickhouse.com/docs/get-started/about/intro)

49. Что такое cache locality?

    **Ответ:** Temporal locality — повторное использование недавно прочитанного, spatial — использование соседних bytes/cache lines. Layout и working set определяют попадание в cache.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

50. Почему column-store лучше для агрегаций?

    **Ответ:** Однородные contiguous значения лучше сжимаются и обрабатываются без чтения остальных полей. Выигрыш уменьшается при запросах почти всех колонок и точечном доступе.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


**[P]**

51. Реализовать row layout (struct of structs)

    **Ответ:** Создать vector<Row> с фиксированными полями; контролировать padding и lifetime. Для persistence сериализовать формат отдельно от C++ object representation.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library)

52. Реализовать column layout (struct of arrays)

    **Ответ:** Создать отдельные vector<T> на поле и общий row count; синхронно менять длины и validity. Для чтения строки собирать одинаковый индекс из всех колонок.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library)

53. Сравнить cache misses

    **Ответ:** Сравнить AoS/SoA на одинаковых данных и operations, собрать cache misses/cycles/bytes. Учитывать hardware prefetch и повторное использование между проходами.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

54. Написать scan benchmark

    **Ответ:** Исключить setup, выполнить warmup и замеры по рабочим наборам до/сверх LLC/RAM. Проверять checksum результата, чтобы compiler не удалил loop.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [C++ working draft: Library](https://eel.is/c++draft/library)

55. Реализовать simple filter

    **Ответ:** Скалярный loop проверяет predicate и пишет selection IDs либо агрегат. Корректно обрабатывать NULL, пустой input и overflow результата.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)


---

### L2

**[T]**

56. Что такое compression в column-store?

    **Ответ:** Однородные последовательности кодируются дешевле: dictionary, RLE, delta и bit-packing. Encoding и compression codec — разные этапы.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

57. Что такое dictionary encoding?

    **Ответ:** Словарь уникальных значений и массив компактных IDs. Хорош для низкой кардинальности; для произвольного сравнения учитывать порядок/семантику словаря.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

58. Что такое run-length encoding?

    **Ответ:** Серия одинаковых значений кодируется парой value/count. Случайные данные могут стать больше; длины проверяются при decode.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

59. Что такое bit-packing?

    **Ответ:** Значения фиксированной ограниченной разрядности упаковываются без выравнивания по целым машинным словам. Нужны bounds, безопасные сдвиги и корректный cross-word decode.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

60. Почему column-store лучше с SIMD?

    **Ответ:** Колонки имеют одинаковый тип и contiguous данные, что уменьшает gather и преобразования. NULL bitmap и variable-length значения требуют дополнительных masks/offsets.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


**[P]**

61. Реализовать dictionary encoding

    **Ответ:** Построить value→ID map и обратный dictionary, encode IDs минимальной ширины. Decode и сравнение должны учитывать NULL и неизвестные значения.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

62. Реализовать RLE

    **Ответ:** Считать длину текущего run, emit при смене, обработать последний run и count overflow. Проверить round-trip на чередующихся/повторяющихся/пустых данных.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

63. Реализовать bit-packing

    **Ответ:** Выбрать bit width по диапазону, записывать/читать через проверенные маски и сдвиги, не сдвигать на ширину слова. Хранить число значений и валидировать размер buffer.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [C++ working draft: Library](https://eel.is/c++draft/library)

64. Реализовать vectorized scan

    **Ответ:** Работать batches фиксированного типа и mask, отдельно validity и tail. Измерить SIMD и scalar на memory/compute-bound вариантах.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

65. Реализовать selective column loading

    **Ответ:** Получить набор требуемых колонок из projection/filter, читать только их chunks. Не исключать столбец, используемый скрытым predicate/join/order.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


**[D]**

66. Почему column-store медленный для point lookup?

    **Ответ:** Индекс может найти row ID быстро, но затем нужны чтение/decode нескольких колонок/блоков. Холодные wide point lookups часто платят лишним I/O и reconstruction.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

67. Почему row-store плохо масштабируется для аналитики?

    **Ответ:** Читаются ненужные поля, хуже сжатие нужной колонки, больше cache/IO. Покрывающий индекс и projection могут уменьшить разницу, поэтому измерять конкретный запрос.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

68. Почему compression ухудшает latency?

    **Ответ:** Декомпрессия добавляет CPU и может требовать целый block ради одного значения. Проверить codec, block size, lookup pattern и cache decoded blocks.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

69. Почему CPU cache thrashing?

    **Ответ:** Working set/associativity, конкурирующие threads или большие промежуточные данные вытесняют полезные lines. Профилировать LLC misses и footprint, уменьшить data movement.

    **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

70. Почему memory alignment влияет на perf?

    **Ответ:** Misaligned accesses могут пересекать cache lines/pages; некоторые инструкции требуют alignment. Современные unaligned loads не всегда медленнее, поэтому нужны assembly и замер.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [C++ working draft: Library](https://eel.is/c++draft/library)


---

### L3

**[T]**

71. Что такое hybrid storage (PAX, DSM)?

    **Ответ:** DSM разделяет атрибуты по колонкам; PAX группирует мини-колонки внутри страницы. PAX сохраняет page locality строк, улучшая обработку выбранных полей в странице.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

72. Как устроен Apache Parquet / ORC?

    **Ответ:** Колонночные форматы с row groups/stripes, column chunks, pages, encodings и metadata для pruning. Конкретная организация Parquet и ORC различается; это форматы, а не полноценные БД.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

73. Что такое column chunk?

    **Ответ:** Набор страниц одной колонки внутри row group Parquet. Имеет metadata/encoding/compression и позволяет читать выбранный столбец.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

74. Что такое encoding pipelines?

    **Ответ:** Последовательность представления значений: dictionary/delta/RLE/bit-packing, затем общий codec. Decoder должен знать порядок, версии и параметры каждого шага.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

75. Как работает predicate pushdown в column store?

    **Ответ:** Использует min/max/statistics или фильтры для пропуска chunks/pages и применяет predicate при decode. Нельзя пропустить блок, если metadata недостаточно для доказательства отсутствия совпадений.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


**[P]**

76. Реализовать PAX layout

    **Ответ:** Внутри page выделить секции колонок с offsets/validity и общим числом строк. Проверять capacity при insert, перенос значений и реконструкцию row.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)

77. Реализовать column chunk storage

    **Ответ:** Записать typed blocks, validity, offsets, metadata и checksum, затем footer/index. Сначала завершить chunk, затем публиковать его в manifest; parser проверяет границы.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

78. Реализовать predicate pushdown

    **Ответ:** По metadata отсеять только доказанно неподходящие row groups, затем фильтровать decoded values. Сравнить результат со full scan, включая NULL и граничные значения.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

79. Реализовать selective decompression

    **Ответ:** Применить pruning на metadata и читать/decode только нужные pages колонок. Минимальная единица декомпрессии задаётся codec/page, а не одним row ID.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

80. Реализовать column pruning

    **Ответ:** Вычислить требуемые field IDs из всего plan и не открывать остальные chunks. Учитывать predicate, sort, join и hidden schema dependencies.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


**[D]**

81. Почему decompression bottleneck?

    **Ответ:** Определить долю CPU codec в профиле и bytes decoded/returned. Изменить codec/block size, применять pruning/cache и оценить trade-off с I/O.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

82. Почему IO pattern стал случайным?

    **Ответ:** Selective reads множества scattered chunks и late materialization превращают scan в random access. Проверить row group size, сортировку данных, coalescing и план.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

83. Почему vectorization не даёт прироста?

    **Ответ:** Memory bandwidth, маленькие batches, branches, conversion, gather и scalar tail ограничивают SIMD. Сравнить instructions/row и bytes/row, не только наличие AVX в assembly.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

84. Как диагностировать misaligned loads?

    **Ответ:** Проверить адреса/stride и инструкции, долю split-line/page accesses. Сравнить aligned/unaligned buffers при равном input и исключить чтение за границы.

    **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

85. Почему page faults растут при scan?

    **Ответ:** Scan впервые затрагивает mapped pages либо RAM не хватает. Minor faults и major I/O различны; проверить pressure/swap, readahead и размер рабочего набора.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

### L4

**[S]**

86. Как выбрать layout для mixed workload?

    **Ответ:** Сравнить стоимость whole-row point access, updates и projection scans. Hybrid/две проекции оправданы, когда выигрыш превышает maintenance и допустим lag.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html)

87. Когда использовать hybrid storage?

    **Ответ:** Если один layout не обслуживает критичные point и scan SLO, а дополнительная синхронизация/хранение приемлемы. Сначала проверить простой row-store с индексами.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

88. Как проектировать column-store engine?

    **Ответ:** Schema/types → immutable column chunks → metadata/pruning → vectorized execution → update/delete visibility. Определить WAL/recovery, compaction и snapshot semantics, а не только формат файла.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

89. Как выбрать encoding strategy?

    **Ответ:** По cardinality, runs, диапазонам и query path выбирать dictionary/RLE/delta/bitpack. Решение принимать per column/chunk и поддерживать fallback на plain encoding.

    **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)

90. Как оптимизировать под SSD vs RAM?

    **Ответ:** В RAM важны bytes moved, cache и NUMA; на SSD также IOPS, read size и endurance. Холодные и прогретые queries оценивать отдельно.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

## 🔹 In-Memory Databases

---

### L1

**[T]**

91. Что такое in-memory DB?

    **Ответ:** БД, чей основной рабочий набор обрабатывается в памяти. Может иметь durable журнал/snapshots; «in-memory» не означает отсутствие диска.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

92. Почему RAM быстрее диска?

    **Ответ:** У RAM нет файлового/блочного пути и задержек flash/controller; доступ значительно короче. Однако cache/NUMA/случайный доступ всё равно важны, а RAM обычно volatile.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

93. Что такое persistence в in-memory DB?

    **Ответ:** Механизм восстановления state после перезапуска: snapshots, журнал и/или устойчивые реплики. Подтверждение commit и окно возможной потери задаются конфигурацией.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

94. Что такое snapshot?

    **Ответ:** Согласованная копия состояния в определённый момент/sequence. Нужно обеспечить целостность во время копирования и atomic publication завершённой копии.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)

95. Что такое durability trade-off?

    **Ответ:** Частый sync уменьшает окно потери, но добавляет latency/I/O; периодический sync допускает потерю последних ACK при crash. Условие должно быть явным и проверенным.

    **Источник:** [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


**[P]**

96. Реализовать in-memory KV store

    **Ответ:** Hash map с get/put/delete и явной моделью concurrency; добавить bounds, errors и lifetime. Durability и transactions — отдельные подсистемы, не свойства unordered_map.

    **Источник:** [C++ working draft: Unordered associative containers](https://eel.is/c++draft/unord.req); [CMU 15-445: Hash tables](https://15445.courses.cs.cmu.edu/fall2024/notes/07-hashtables.pdf)

97. Реализовать snapshot на диск

    **Ответ:** Зафиксировать snapshot/версии, записать во временный файл, проверить checksum и atomically publish. Для rename durability может требоваться sync directory; не перезаписывать единственную исправную копию.

    **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

98. Использовать mmap

    **Ответ:** Отображать файл с корректным размером/permissions, проверять MAP_FAILED и границы. MAP_SHARED не даёт транзакционность и не означает durable ACK без протокола sync/recovery.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

99. Реализовать ring buffer для WAL

    **Ответ:** Ring с monotonic positions, publish после полного record, reuse после durable watermark. При заполнении block/backpressure; нельзя перезаписывать ещё не сохранённый WAL.

    **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

100. Реализовать простой allocator

     **Ответ:** Pool фиксированного размера с free list и alignment, fallback на upstream allocation. Ownership/lifetime и concurrency определить заранее; тестировать double-free и exhaustion.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


---

### L2

**[T]**

101. Что такое NUMA?

     **Ответ:** Неравномерная стоимость памяти по CPU/socket: local быстрее remote. Размещать обработчик и его страницы совместно, учитывая баланс узлов.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

102. Почему memory latency важна?

     **Ответ:** In-memory workload может упираться в зависимые cache misses и pointer chasing, а не CPU instructions. Измерять stalled cycles, locality и размер working set.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

103. Что такое lock-free структуры?

     **Ответ:** Гарантируют системный прогресс без обязательного ожидания mutex; не равны wait-free и могут проигрывать при конкуренции. Требуют memory ordering и безопасного reclamation.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

104. Что такое false sharing?

     **Ответ:** Независимые threads пишут разные поля одной cache line, вызывая invalidation/bouncing. Padding/разделение помогает, но увеличивает footprint.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

105. Что такое memory fragmentation?

     **Ответ:** Свободная память распределена так, что её нельзя эффективно использовать, либо allocator удерживает arenas. Различать internal/external fragmentation и leak.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


**[P]**

106. Реализовать lock-free queue

     **Ответ:** Для SPSC использовать bounded ring: producer/consumer indices с release/acquire и явно обработанным full/empty. MPMC существенно сложнее; брать доказанный алгоритм и решать reclamation.

     **Источник:** [C++ working draft: Atomics](https://eel.is/c++draft/atomics)

107. Реализовать custom allocator

     **Ответ:** Выбрать arena/slab под реальные размеры и lifetime, соблюдать alignment и освобождение через тот же resource. Не скрывать нехватку памяти и thread-safety assumptions.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)

108. Оптимизировать под cache lines

     **Ответ:** Разнести hot counters/locks, сгруппировать read-mostly поля и убрать лишние hops. Подтвердить perf c2c, cache misses и footprint на целевом CPU.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)

109. Реализовать slab allocator

     **Ответ:** Разделить память на slabs фиксированных size classes, выдавать slots через free lists/bitmap. Учитывать alignment, возврат полностью свободных slabs и metadata overhead.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)

110. Реализовать NUMA-aware allocation

     **Ответ:** Использовать NUMA memory policy/first-touch с pinned workers; задать fallback при exhaustion. Проверить местоположение страниц, а не только affinity потока.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


**[D]**

111. Почему latency нестабилен?

     **Ответ:** Проверить allocator, page faults, CoW snapshot, eviction, scheduler и сеть. Сопоставить p99 с событиями и оценить влияние фоновых задач при том же QPS.

     **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

112. Почему CPU usage высокий?

     **Ответ:** Профиль отличит полезный command processing от spins, serialization, eviction и retries. CPU utilization без completed ops/s не объясняет эффективность.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

113. Почему malloc тормозит?

     **Ответ:** Частые мелкие allocations, общие locks и fragmentation могут доминировать. Измерить allocation rate/stacks и попробовать reuse/pool с контролем memory footprint.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)

114. Почему TLB misses растут?

     **Ответ:** Рабочий набор страниц вырос или доступ стал случайным. Проверить page size, NUMA и адресные patterns; huge pages могут помогать ценой fragmentation/reservation.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

115. Как найти false sharing?

     **Ответ:** Найти contentious cache lines через perf c2c, сопоставить адреса с полями/структурами и threads. Разнести поля и подтвердить улучшение на неизменном workload.

     **Источник:** [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


---

### L3

**[T]**

116. Как устроен Redis internals?

     **Ответ:** Основной command path традиционно event-driven; словари/типы, expiration/eviction и persistence — отдельные механизмы. Версия и режим влияют на I/O threads и фоновые операции, поэтому «всё однопоточно» слишком грубо.

     **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

117. Как реализуется persistence (RDB/AOF)?

     **Ответ:** RDB сохраняет снимок, AOF — журнал команд/изменений с выбранной fsync политикой и rewrite. Возможное окно потери и стоимость CoW/rewrite зависят от настройки.

     **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

118. Как работает event loop?

     **Ответ:** Reactor ждёт готовности FD и вызывает handlers без блокирующей работы в loop. Долгий callback задерживает всех клиентов; CPU-heavy задачи выносят с ограничением очереди.

     **Источник:** [Linux man-pages: epoll](https://man7.org/linux/man-pages/man7/epoll.7.html)

119. Что такое zero-copy?

     **Ответ:** Исключение части копирований между слоями, например sendfile или views на mapped bytes. Не означает отсутствие всех копий и требует корректного lifetime buffers.

     **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html); [Linux man-pages: open](https://man7.org/linux/man-pages/man2/open.2.html)

120. Как работает memory eviction?

     **Ответ:** При memory limit политика выбирает кандидатов либо отклоняет запись. TTL expiration и eviction — разные механизмы; учитывать pinned/critical state и стоимость освобождения больших объектов.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)


**[P]**

121. Реализовать event loop (epoll)

     **Ответ:** epoll_create1 → add nonblocking FD → epoll_wait → обработка readiness. Для edge-triggered вычитывать до EAGAIN, обрабатывать partial I/O, EOF и закрытие FD.

     **Источник:** [Linux man-pages: epoll](https://man7.org/linux/man-pages/man7/epoll.7.html)

122. Реализовать zero-copy send

     **Ответ:** Выбрать поддерживаемый kernel путь/ссылку на buffer, удержать ресурс до завершения отправки и обработать short write. Для TLS zero-copy зависит от конкретной реализации.

     **Источник:** [Linux man-pages: open](https://man7.org/linux/man-pages/man2/open.2.html); [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)

123. Реализовать eviction policy

     **Ответ:** Map + LRU/LFU metadata + byte budget; evict лишь записи без активных owners/pins. Проверить bounded memory, updates и корректность при конкуренции.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

124. Реализовать async IO

     **Ответ:** Подать операции в io_uring, связать completion с владельцем buffer, обработать short I/O/error/cancel. Completion записи не равен durable flush без нужной sync операции.

     **Источник:** [Linux man-pages: io_uring](https://man7.org/linux/man-pages/man7/io_uring.7.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html)

125. Реализовать memory pool

     **Ответ:** Предвыделить blocks, хранить free slots, соблюдать alignment и общий budget. Не возвращать block, пока живы views/callbacks; добавить fallback/error при исчерпании.

     **Источник:** [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


**[D]**

126. Почему GC/eviction вызывает latency spikes?

     **Ответ:** Освобождение больших объектов, поиск кандидатов, GC и CoW фоновых snapshots конкурируют за CPU/память. Измерить длительность и объём конкретной стадии, ограничить batch/background rate.

     **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

127. Почему network становится bottleneck?

     **Ответ:** Payload/ops × connections превысили bandwidth/packet capacity или serialization budget. Измерить bytes, retransmits, packets и server/client CPU, сравнить локальный benchmark.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

128. Как диагностировать epoll overhead?

     **Ответ:** Смотреть calls/events, empty wakeups, batch size и loop callback time. Частое изменение interest или обработка слишком малого объёма на wakeup повышает overhead.

     **Источник:** [Linux man-pages: epoll](https://man7.org/linux/man-pages/man7/epoll.7.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

129. Почему throughput падает при росте клиентов?

     **Ответ:** Возрастают contention, queueing, context switches и pressure общих ресурсов. Найти точку насыщения и ограничить in-flight вместо бесконечного роста clients.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

130. Как найти memory leak?

     **Ответ:** Сравнить live heap snapshots/alloc stacks после одинаковых циклов нагрузки и очистки. LeakSanitizer помогает на воспроизводимом сценарии; RSS сам по себе leak не доказывает.

     **Источник:** [Clang: LeakSanitizer](https://clang.llvm.org/docs/LeakSanitizer.html)


---

### L4

**[S]**

131. Когда использовать in-memory DB?

     **Ответ:** Когда working set помещается в доступный RAM budget, latency оправдывает стоимость, а durability/recovery проверены. Рост данных и время загрузки тоже входят в capacity plan.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

132. Как обеспечить durability?

     **Ответ:** Durable WAL перед ACK либо синхронные устойчивые реплики по контракту, snapshots для ограниченного recovery. Проверить crash и power-loss модель; несколько volatile копий не равны диску.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

133. Как проектировать hybrid RAM+disk систему?

     **Ответ:** RAM хранит горячий subset/index/cache, durable disk — источник/холодные данные. Определить eviction, promotion, freshness и p99 cold misses.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

134. Как масштабировать?

     **Ответ:** Partition key/routing и replicas, отдельная обработка hot keys и rebalance. Оценивать память, сеть и восстановление, а не только число узлов.

     **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

135. Как балансировать latency vs persistence?

     **Ответ:** Задать допустимый RPO, выбрать sync/group commit/periodic mode и измерить p99. Ослабление durability должно быть частью договора, а не скрытым tuning.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


---

## 🔹 Time-Series Databases

---

### L1

**[T]**

136. Что такое time-series DB?

     **Ответ:** Хранилище временных рядов с timestamp, значением и labels/tags, оптимизированное под append, time-range запросы и retention. Порядок прихода может быть неполным.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

137. Какие особенности данных?

     **Ответ:** Много последовательных точек, временная locality, повторяющиеся tags и часто ограниченный lifecycle. High cardinality и out-of-order записи меняют память/compaction.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

138. Что такое append-only?

     **Ответ:** Новые записи добавляются, не переписывая существующий префикс. Логическое удаление/коррекция обычно оформляется новой записью или compaction.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

139. Что такое retention policy?

     **Ответ:** Правила удаления данных по возрасту/объёму. Учитывать ingestion lag, query windows, backup retention и реальное время освобождения blocks.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

140. Что такое downsampling?

     **Ответ:** Снижение временного разрешения с агрегатами по окнам. Хранить необходимые count/sum/min/max, чтобы последующие агрегаты были корректны; среднее средних обычно неверно без весов.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


**[P]**

141. Реализовать append-only storage

     **Ответ:** Записывать framed records с timestamp/series ID/value/checksum и проверять short writes. Recovery читает корректный префикс, новый segment публикуется безопасно.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

142. Реализовать time index

     **Ответ:** Отобразить series ID и временной диапазон в blocks, хранить sparse time index и offsets. Учитывать out-of-order data и границы [from,to).

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

143. Реализовать rolling window

     **Ответ:** Deque/ring для ограниченного интервала, удалять точки старше watermark по определённой политике. Уточнить event time и допустимое опоздание.

     **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

144. Реализовать retention cleanup

     **Ответ:** Удалять целые безопасно просроченные blocks после исключения активных readers и обновления manifest. Не удалять единственную копию данных, ещё нужных backup/replay.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

145. Реализовать timestamp compression

     **Ответ:** Кодировать разности timestamps, при регулярном шаге — delta-of-delta. Записать начальные значения/width и проверить overflow, отрицательные/нерегулярные интервалы.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


---

### L2

**[T]**

146. Что такое chunking?

     **Ответ:** Разделение ряда/временного диапазона на bounded chunks с metadata и compression. Размер влияет на ingestion, памяти, pruning и число файлов.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

147. Что такое compression (delta, Gorilla)?

     **Ответ:** Delta кодирует изменения времени/значений; Gorilla-подобные схемы применяют delta-of-delta timestamps и XOR floating-point представлений. Нужны точное восстановление и формат special values.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

148. Что такое cardinality problem?

     **Ответ:** Число уникальных комбинаций labels определяет число series и состояние индексов/буферов. Значения user_id/request_id могут создавать почти неограниченный рост.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)

149. Что такое tag index?

     **Ответ:** Индекс label name/value→series IDs, часто inverted postings. Конъюнкции пересекают IDs, затем time index выбирает нужные chunks.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

150. Что такое write-heavy workload?

     **Ответ:** Поток поступления велик относительно чтения; важны batching, sequential append, partitioning, compaction capacity и backpressure. Устойчивую скорость считать вместе с maintenance.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


**[P]**

151. Реализовать delta encoding

     **Ответ:** Хранить base и последовательность differences, выбрать signed/varint representation и overflow checks. Decoder должен восстанавливать исходные timestamps побитово.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

152. Реализовать chunk storage

     **Ответ:** Chunk с series/time bounds, encoded values, checksum и index entry. Закрытый chunk immutable; переключение manifest и GC должны переживать crash.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

153. Реализовать tag index

     **Ответ:** Map label pair→sorted set series IDs, операции пересечения/объединения для query. Update/delete не должны оставлять неконтролируемый index debt.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

154. Реализовать compression pipeline

     **Ответ:** Последовательно применить timestamp/value encoding и общий codec, сохранить версии/параметры. Проверить round-trip на NaN/Inf/нерегулярных шагах и malformed input.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

155. Реализовать batched ingestion

     **Ответ:** Группировать по series/partition с ограничениями bytes/time, подтверждать после durability. Сохранять event IDs/sequence и правила обработки out-of-order/retries.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)


**[D]**

156. Почему high cardinality убивает память?

     **Ответ:** Каждая новая series создаёт metadata, postings и active chunk state. Измерить series creation rate и память на series; ограничивать cardinality до приёма.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)

157. Почему write throughput падает?

     **Ответ:** Проверить WAL flush, compaction, число новых series, batches и hot partitions. Разделить accepted от durable persisted throughput и посмотреть queue age.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

158. Почему query latency растёт?

     **Ответ:** Больше рядов/диапазон, хуже pruning/cache или идёт compaction. По query profile измерить chunks/series/bytes examined и cardinality промежуточных результатов.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

159. Почему compaction дорогой?

     **Ответ:** Слияние blocks читает/decode/reencode данные и индексы, требует временного места. Измерить pending bytes и maintenance bandwidth, не допускать неограниченного debt.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [RocksDB: Compaction](https://github.com/facebook/rocksdb/wiki/Compaction)

160. Почему disk IO растёт?

     **Ответ:** Рост ingestion, query scans, compaction, checkpoints и cache misses. Разложить reads/writes по компонентам и сравнить device bytes с логическими points.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

### L3

**[T]**

161. Как устроен InfluxDB / Prometheus storage?

     **Ответ:** Prometheus использует head/WAL и immutable blocks с chunk/index, но архитектура InfluxDB зависит от версии/engine. Их нельзя описывать как один одинаковый storage engine.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

162. Как работает WAL + compaction?

     **Ответ:** WAL защищает новые точки, затем flush/blocks и compaction объединяют устойчивые данные. Нужны checkpoint/retention правила, чтобы replay и disk usage оставались ограниченными.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

163. Как реализуется compression?

     **Ответ:** По однородным временным последовательностям использовать delta/delta-of-delta/XOR, для labels — dictionary. Выигрыш измерять вместе с CPU decode/query latency.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

164. Как устроены inverted indexes?

     **Ответ:** Термин/label value хранит postings IDs, запросы объединяют/пересекают списки. Compression, skip metadata и cardinality определяют скорость/память.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Elasticsearch: Mapping](https://www.elastic.co/docs/manage-data/data-store/mapping)

165. Как работает query engine?

     **Ответ:** Планирует выбор series, time ranges/chunks, decode и aggregation. Ограничить fan-out/intermediate memory, использовать pruning и определить lookback/late data semantics.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)


---

### L4

**[S]**

166. Как проектировать TSDB под миллиарды точек?

     **Ответ:** Оценить points/s, активные series, bytes/point, retention и query windows. Partition по tenant/series+time, ограничить cardinality, разделить ingestion/queries и предусмотреть cold tiers.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

167. Как решать high-cardinality проблему?

     **Ответ:** Запретить unbounded labels, задать tenant budgets, наблюдать creation churn и aggregations. Хэширование label не уменьшает число уникальных series.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/)

168. Как строить real-time ingestion pipeline?

     **Ответ:** Устойчивый приём с ограниченной очередью, partition по series и идемпотентные batches, WAL/checkpoints и backpressure. Контролировать event age и lateness, а не только accepted rate.

     **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/); [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

169. Как балансировать storage vs query speed?

     **Ответ:** Настраивать chunk size, encoding, indexes и агрегаты под запросы; меньший storage может увеличивать decode CPU. Сравнить p99 и объём сканирования на реальном retention.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/)

170. Как проектировать retention + cold storage?

     **Ответ:** Горячие blocks локально, холодные — устойчивое object storage с cache и manifest/catalog. Проверить удаление/restore и запрет retention раньше завершения нужного backup/replay окна.

     **Источник:** [Prometheus: Storage](https://prometheus.io/docs/prometheus/latest/storage/); [Amazon S3: Consistency model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel)


---

## 🔹 NewSQL

---

### L1

**[T]**

171. Что такое NewSQL?

     **Ответ:** Семейство систем с SQL/реляционными транзакциями и горизонтальной распределённостью. Термин не задаёт конкретную isolation/latency гарантию — её смотрят у продукта.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

172. Чем отличается от NoSQL и RDBMS?

     **Ответ:** Сохраняет SQL/транзакционную модель, распределяя хранение/координацию; NoSQL описывает другие модели доступа, традиционная RDBMS может тоже реплицироваться/шардироваться.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

173. Что такое distributed SQL?

     **Ответ:** SQL-план и транзакции работают над данными нескольких узлов/шардов. Требует routing, distributed execution и протоколов commit/recovery.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

174. Что такое strong consistency?

     **Ответ:** Нужно назвать точную модель: linearizability учитывает real time, serializability — эквивалентность последовательным транзакциям. Strong — неоднозначный общий термин.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency)

175. Что такое horizontal scaling?

     **Ответ:** Добавление узлов с распределением работы/данных. Глобальная координация и hot keys ограничивают масштаб даже при свободном storage.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)


---

### L2

**[T]**

176. Как работает distributed transaction?

     **Ответ:** Участники согласуют commit/abort и долговечность результатов через coordinator и логи. Consensus внутри replica group не заменяет cross-shard atomic commit.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

177. Что такое 2PC?

     **Ответ:** Two-phase commit: prepare с durable vote, затем durable decision commit/abort и рассылка. Prepared участник может блокироваться при неизвестном исходе coordinator.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

178. Что такое consensus (Raft)?

     **Ответ:** Протокол согласования журнала в группе реплик с terms, election и majority commit. Safety опирается на log/voting rules, а не только на heartbeat.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)

179. Что такое sharding?

     **Ответ:** Разделение данных между владельцами по ключу/диапазону. Нужны карта маршрутов, репликация, migration и явные cross-shard операции.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

180. Что такое global index?

     **Ответ:** Индекс, логически охватывающий несколько shards. Обновление/уникальность требуют координации или асинхронной проекции с определёнными гарантиями.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


**[P]**

181. Реализовать простой Raft (упрощённо)

     **Ответ:** Реализовать durable term/votedFor/log, RequestVote/AppendEntries и majority commit по правилам Raft. Тестировать потерю/дубли/перестановку, restart и stale terms; не выдавать учебный прототип за production.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)

182. Реализовать 2PC coordinator

     **Ответ:** Сохранять participant set и decision, prepare votes, затем commit/abort с retries. Participants сохраняют prepared state и узнают итог после restart; моделировать crash до/после каждой durable записи.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)

183. Реализовать shard routing

     **Ответ:** Версионированная map key range→group, cache с epoch, redirects/retry на stale route. Во время migration должен существовать однозначный write owner.

     **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Raft paper](https://raft.github.io/raft.pdf)

184. Реализовать distributed KV

     **Ответ:** Локальный KV engine + replicated log + partition map + client idempotency. Сначала доказать single-shard recovery/ordering, затем membership и rebalance.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

185. Реализовать leader election

     **Ответ:** Persist term и vote, randomized election timeout, majority и проверка актуальности candidate log. После победы leader не должен подтверждать запись без нужного quorum.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


**[D]**

186. Почему latency высокий?

     **Ответ:** Межузловые RTT, consensus, 2PC, remote reads и queueing добавляются к storage time. Разбить trace на эти стадии и проверить locality/leader placement.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

187. Почему транзакции блокируются?

     **Ответ:** Locks/conflicts либо prepared transactions ждут участников/решение commit. Проверить wait graph, intent age, coordinator state и downstream reachability.

     **Источник:** [PostgreSQL: Explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

188. Почему split brain?

     **Ответ:** Два writer могли действовать без общего majority/fencing или по устаревшему epoch. Сверить terms, votes, membership и ACK history; наличие heartbeat не доказывает единственность лидера.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)

189. Почему replication lag?

     **Ответ:** Запись/передача быстрее replay из-за диска, сети, CPU, apply conflicts или тяжёлых readers. Разделить receive/flush/apply positions и измерить очередь, а не возраст последнего события.

     **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

190. Почему network — bottleneck?

     **Ответ:** Replication fanout, shuffle/joins и cross-region hops увеличивают bytes/RTT. Измерить per-link bytes, loss и queueing, затем улучшать placement/plan/batching.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


---

### L3

**[T]**

191. Как устроены CockroachDB / Google Spanner?

     **Ответ:** Обе — distributed SQL с replicated key ranges и транзакционным слоем, но clock/commit/isolation механизмы различаются. TrueTime относится к Spanner; детали CockroachDB нужно проверять по его версии.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

192. Что такое TrueTime?

     **Ответ:** API времени возвращает интервал возможного текущего времени с uncertainty. Spanner использует commit-wait и правила timestamps для external consistency; это не «абсолютно точные часы».

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

193. Как реализуется serializability?

     **Ответ:** Locking, optimistic validation либо serializable snapshot mechanisms исключают nonserializable histories. Serializable не обязательно означает real-time ordering; aborted transactions нужно безопасно повторять целиком.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

194. Как работает distributed query planner?

     **Ответ:** Выбирает pushdown, join order, partition pruning и обмен данными, учитывая estimates и locality. Стоимость remote shipping может доминировать над CPU/index lookup.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

195. Как работает rebalancing?

     **Ответ:** Копирование range/snapshot, catch-up log, безопасная смена replica membership и routing. Rate limits и placement constraints не дают переносу нарушить foreground SLO и fault tolerance.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf)


---

### L4

**[S]**

196. Когда выбирать NewSQL?

     **Ответ:** Когда нужны SQL/transactions и независимый от одного узла масштаб/география, а latency/cost координации приемлемы. Сравнить с более простым replicated single-writer.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

197. Как проектировать глобально распределённую БД?

     **Ответ:** Определить topology, data/leader locality, RPO/RTO и точные consistency guarantees. Согласовать residency, cross-region writes и partition degradation, затем измерить RTT и failover.

     **Источник:** [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

198. Как балансировать consistency vs latency?

     **Ответ:** По операциям выбрать инварианты и допустимую устарелость; строгие записи требуют координации, локальные проекции — reconciliation. Не ослаблять гарантию неявной маршрутизацией на follower.

     **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)

199. Как проектировать multi-region system?

     **Ответ:** Независимые региональные стеки/группы и запас ёмкости, явный write owner/consensus, routing и проверенный failover. Учесть partition, stale metadata и recovery после возврата региона.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Raft paper](https://raft.github.io/raft.pdf)

200. Как строить fault-tolerant storage?

     **Ответ:** Устойчивые replicated logs, корректный quorum, backup/restore и repair с integrity checks. Тестировать data-plane и metadata-plane отказы, не только перезапуск процесса.

     **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html)


---
