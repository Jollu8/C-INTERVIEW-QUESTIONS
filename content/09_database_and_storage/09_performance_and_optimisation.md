# ⚡ 9. Производительность и оптимизация

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

## 🔹 Query planning

1. (L1 [T]) Что такое query planning?

   **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


2. (L1 [T]) Зачем СУБД строит план выполнения запроса?

   **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


3. (L1 [T]) Чем logical plan отличается от physical plan?

   **Ответ:** Physical replication передаёт engine/page/log изменения, logical — значения/операции по логической модели. Logical даёт гибкость schema/targets, но требует identity, ordering, DDL/sequence handling и conflict semantics; совместимость отличается. Logical plan описывает смысл операций, physical plan выбирает algorithms/access paths/order/distribution. Несколько физических планов реализуют один logical result, но order/partition properties и memory/IO cost различаются.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


4. (L1 [T]) Почему один и тот же SQL можно выполнить несколькими способами?

   **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


5. (L1 [T]) Что такое access path?

   **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


6. (L1 [T]) Почему planner выбирает между full scan и index scan?

   **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


7. (L1 [T]) Что такое filter, projection, join, aggregation в плане?

   **Ответ:** Filter отбирает строки, projection вычисляет/выбирает поля, join соединяет наборы, aggregation сворачивает группы. Порядок безопасных преобразований влияет на размеры промежуточных данных; NULL/outer semantics ограничивают reorder.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


8. (L1 [T]) Что такое plan node / operator?

   **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


9. (L1 [T]) Почему порядок операций влияет на производительность?

   **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

   **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


10. (L1 [T]) Почему “правильный SQL” не гарантирует “быстрый SQL”?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


11. (L1 [P]) Реализовать AST для простого SELECT ... WHERE

    **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


12. (L1 [P]) Реализовать logical plan для фильтра и проекции

    **Ответ:** Tokenizer/parser создаёт typed AST, binder разрешает schema/columns, затем logical operators с явными NULL/types. Optimizer меняет только доказанно equivalent expression/plan; ошибки и unsupported syntax возвращаются явно.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


13. (L1 [P]) Реализовать physical plan: seq scan vs index lookup

    **Ответ:** Logical plan описывает смысл операций, physical plan выбирает algorithms/access paths/order/distribution. Несколько физических планов реализуют один logical result, но order/partition properties и memory/IO cost различаются. Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования. Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


14. (L1 [P]) Реализовать tree printer для execution plan

    **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


15. (L1 [P]) Реализовать simple planner для single-table queries

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


16. (L2 [T]) Что такое predicate pushdown на уровне planner?

    **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/)


17. (L2 [T]) Почему join order — одна из самых дорогих частей planning?

    **Ответ:** Порядок joins определяет размеры промежуточных наборов; ошибка cardinality раньше по плану может умножить downstream работу. Перестановка ограничена semantics outer joins/lateral/volatile expressions, а не только cost.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


18. (L2 [T]) Что такое cardinality estimation?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


19. (L2 [T]) Почему planner должен учитывать доступные индексы?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


20. (L2 [T]) Что такое plan enumeration?

    **Ответ:** Добавление enum value может сломать старый код с исчерпывающим switch/validation; удаление/сужение ломает уже сохранённые значения. Нужны unknown-value handling, version policy и migration существующих данных.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)


21. (L2 [T]) Почему planning time itself может быть non-trivial?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


22. (L2 [T]) Что такое parameterized plan?

    **Ответ:** Parameterized path/plan зависит от внешних bind/outer-row параметров; стоимость может сильно меняться по значениям. Нужно отличать generic prepared plan и inner index path nested-loop, уточнив terminology engine.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


23. (L2 [T]) Почему prepared statements могут менять качество плана?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


24. (L2 [T]) Что такое covering plan / index-only plan?

    **Ответ:** В PostgreSQL index-only scan избегает heap fetch, когда visibility map подтверждает all-visible page. Частые writes/недостаточный VACUUM уменьшают эффект даже при полном covering index. Covering требует наличия всех полей query в index, включая predicates/order, но не гарантирует index-only физическое чтение. Payload columns и широкий composite key увеличивают размер и write maintenance.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


25. (L2 [T]) Почему planner важен даже в KV/Document системах, а не только в SQL БД?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


26. (L2 [P]) Реализовать выбор seq scan vs index scan по селективности

    **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями. Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования. Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


27. (L2 [P]) Реализовать pushdown фильтра в scan node

    **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


28. (L2 [P]) Реализовать reordering простых conjunctive predicates

    **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


29. (L2 [P]) Реализовать simple join planner для двух таблиц

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


30. (L2 [P]) Реализовать estimation-based plan selector

    **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


31. (L2 [D]) Почему planner выбрал full scan вместо очевидного индекса?

    **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования. Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


32. (L2 [D]) Почему после добавления WHERE запрос стал медленнее?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


33. (L2 [D]) Почему prepared statement даёт худший план, чем ad-hoc query?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


34. (L2 [D]) Почему planning time внезапно стал заметным на коротких запросах?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


35. (L2 [D]) Почему один и тот же запрос иногда получает разные планы?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


36. (L3 [T]) Как planner связывает parser, catalog, statistics и optimizer?

    **Ответ:** Routing metadata должна иметь authority/version, а cached route — способ обнаружить stale epoch и обновиться. TTL cache сам по себе не защищает write ownership; сервер отвергает старую authority и даёт контролируемый retry/redirect.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


37. (L3 [T]) Как устроен search space для join ordering?

    **Ответ:** Порядок joins определяет размеры промежуточных наборов; ошибка cardinality раньше по плану может умножить downstream работу. Перестановка ограничена semantics outer joins/lateral/volatile expressions, а не только cost.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


38. (L3 [T]) Почему bushy plans дороже оптимизировать, но иногда полезнее?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


39. (L3 [T]) Что такое top-down vs bottom-up planning?

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


40. (L3 [T]) Как planner учитывает physical properties: order, partitioning, distribution?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


41. (L3 [T]) Как planner должен учитывать CPU vs I/O vs memory trade-offs?

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


42. (L3 [T]) Как parameter sniffing влияет на quality плана?

    **Ответ:** Один cached/generic plan может быть неудачен для skewed parameter values. Сравнить реальные bind values, generic/custom plan, statistics и actual rows; отключение cache глобально может добавить заметный planning overhead.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


43. (L3 [T]) Почему статистики и planner связаны жёстче, чем кажется?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


44. (L3 [T]) Как planner должен учитывать MVCC visibility cost?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


45. (L3 [T]) Почему planner — это не просто rule engine, а часть performance-critical architecture?

    **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


46. (L3 [P]) Реализовать dynamic programming join enumerator

    **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


47. (L3 [P]) Реализовать propagation physical properties в plan tree

    **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


48. (L3 [P]) Реализовать parameter-sensitive plan selection

    **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


49. (L3 [P]) Реализовать planner trace/debug output

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


50. (L3 [P]) Реализовать benchmark planning time vs execution time

    **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


51. (L3 [D]) Как доказать, что проблема в planner, а не в execution engine?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


52. (L3 [D]) Почему при одинаковом SQL разные literals радикально меняют план?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


53. (L3 [D]) Как расследовать planner regression после обновления статистик?

    **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


54. (L3 [D]) Почему оптимизация join order взорвала CPU на planning phase?

    **Ответ:** Порядок joins определяет размеры промежуточных наборов; ошибка cardinality раньше по плану может умножить downstream работу. Перестановка ограничена semantics outer joins/lateral/volatile expressions, а не только cost. Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


55. (L3 [D]) Как найти, что bottleneck — это misestimated cardinality, а не плохой алгоритм join?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


56. (L4 [S]) Когда planner можно держать простым rule-based, а когда нужен полноценный optimizer?

    **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


57. (L4 [S]) Как проектировать planner для своей C/C++ БД без взрывной сложности?

    **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


58. (L4 [S]) Как балансировать planning time и plan quality?

    **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


59. (L4 [S]) Как строить observability для planner/optimizer с первого дня?

    **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

    **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


60. (L4 [S]) Как объяснять продуктовой команде, что “быстрый SQL” зависит от planner semantics, а не только от железа?

    **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


---

## 🔹 Cost-based optimizer

61. (L1 [T]) Что такое cost-based optimizer (CBO)?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


62. (L1 [T]) Чем CBO отличается от rule-based optimizer?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


63. (L1 [T]) Что такое cost model?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


64. (L1 [T]) Почему optimizer оценивает несколько альтернативных планов?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


65. (L1 [T]) Какие ресурсы обычно входят в cost: CPU, I/O, memory?

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


66. (L1 [T]) Почему селективность предиката важна для CBO?

    **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


67. (L1 [T]) Что такое statistics?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


68. (L1 [T]) Почему плохие statistics ведут к плохим планам?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


69. (L1 [T]) Что такое cardinality estimate?

    **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

    **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


70. (L1 [T]) Почему CBO никогда не знает будущий runtime точно?

    **Ответ:** Cost model использует неполную статистику и упрощённые resource assumptions; concurrency/cache/parameter skew меняются во время выполнения. Поэтому estimated cheapest не обязан быть fastest, а regression проверяется actual plan и workload.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


71. (L1 [P]) Реализовать простую cost model: seq scan cost vs index scan cost

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


72. (L1 [P]) Реализовать выбор cheapest plan из двух альтернатив

    **Ответ:** Задать затраты scan, lookup, sort/join и shipping с явными единицами, оценки selectivity и cumulative rows. Калибровать на измерениях, проверять orders-of-magnitude ошибки и не подменять correctness стоимостным эвристическим правилом.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


73. (L1 [P]) Реализовать selectivity estimate для equality predicate

    **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями. Задать затраты scan, lookup, sort/join и shipping с явными единицами, оценки selectivity и cumulative rows. Калибровать на измерениях, проверять orders-of-magnitude ошибки и не подменять correctness стоимостным эвристическим правилом.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


74. (L1 [P]) Реализовать histogram-based estimate (упрощённо)

    **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Задать затраты scan, lookup, sort/join и shipping с явными единицами, оценки selectivity и cumulative rows. Калибровать на измерениях, проверять orders-of-magnitude ошибки и не подменять correctness стоимостным эвристическим правилом.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


75. (L1 [P]) Реализовать join cost estimate для nested loop и hash join

    **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


76. (L2 [T]) Что такое histogram и зачем он нужен optimizer-у?

    **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


77. (L2 [T]) Что такое NDV (number of distinct values)?

    **Ответ:** NDV — оценка числа различных значений в заданном наборе/колонке. Она влияет на selectivity, group cardinality и memory; NULL, correlations и skew требуют явной модели, а не независимых uniform assumptions.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


78. (L2 [T]) Почему предположение independence between predicates часто ошибочно?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


79. (L2 [T]) Почему skew ломает cost model?

    **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


80. (L2 [T]) Как optimizer оценивает cost join order?

    **Ответ:** Порядок joins определяет размеры промежуточных наборов; ошибка cardinality раньше по плану может умножить downstream работу. Перестановка ограничена semantics outer joins/lateral/volatile expressions, а не только cost.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


81. (L2 [T]) Почему memory budget влияет на выбор плана?

    **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


82. (L2 [T]) Что такое spill risk в cost model?

    **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


83. (L2 [T]) Почему optimizer должен учитывать cost сортировки?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


84. (L2 [T]) Что такое startup cost vs total cost?

    **Ответ:** Startup cost — работа до первой выдачи, total — до всего результата. При LIMIT/interactive stream план с низким startup может выиграть у более дешёвого полного scan; blocking sort требует сначала обработать большой набор.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


85. (L2 [T]) Почему cheaper estimated plan может быть медленнее в реальности?

    **Ответ:** Cost model использует неполную статистику и упрощённые resource assumptions; concurrency/cache/parameter skew меняются во время выполнения. Поэтому estimated cheapest не обязан быть fastest, а regression проверяется actual plan и workload. Estimated plan показывает оценки без выполнения, actual добавляет наблюдённые rows/loops/timing/buffers после исполнения. EXPLAIN ANALYZE реально выполняет запрос, в том числе изменяющий, и добавляет measurement overhead.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


86. (L2 [P]) Реализовать multi-column selectivity estimate (упрощённо)

    **Ответ:** Tuple comparator задаёт lexicographic key order и NULL/collation rules, bounds выражают допустимый prefix/range. Search и updates используют тот же encoding, string-prefix upper bound не всегда простое увеличение byte.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


87. (L2 [P]) Реализовать cost для sort + merge join

    **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


88. (L2 [P]) Реализовать memory-aware выбор hash join vs sort-merge join

    **Ответ:** Построить bounded operators с typed batches, NULL/equality rules и explicit blocking state. Hash/sort stages имеют memory budget/spill и merge semantics; test empty/duplicate/skewed input, cancellation и correctness против простой реализации.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


89. (L2 [P]) Реализовать startup-vs-total cost chooser

    **Ответ:** Startup cost — работа до первой выдачи, total — до всего результата. При LIMIT/interactive stream план с низким startup может выиграть у более дешёвого полного scan; blocking sort требует сначала обработать большой набор. Задать затраты scan, lookup, sort/join и shipping с явными единицами, оценки selectivity и cumulative rows. Калибровать на измерениях, проверять orders-of-magnitude ошибки и не подменять correctness стоимостным эвристическим правилом.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


90. (L2 [P]) Реализовать statistics catalog для optimizer-а

    **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


91. (L2 [D]) Почему optimizer выбрал hash join, а nested loop оказался быстрее?

    **Ответ:** Hash join строит hash table одной стороны и probe другой; выгоден для соответствующих equality predicates. Build cardinality/width и memory limit определяют spill, skew может создать перегруженный partition. Nested loop выполняет inner path для каждой outer row, поэтому rows×loops важны. При малом outer и indexed inner он эффективен, при ошибке оценки превращается в огромное число probes. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


92. (L2 [D]) Почему после ANALYZE план ухудшился?

    **Ответ:** Устаревшие/недостаточные statistics искажает rows/selectivity, меняя join/index decisions. ANALYZE полезен, но sampling/skew/correlations остаются; сравнить estimates и actual до и после, не форсировать план вслепую. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


93. (L2 [D]) Почему skew по одному значению ломает оценку cost?

    **Ответ:** Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


94. (L2 [D]) Почему optimizer недооценил размер intermediate result?

    **Ответ:** Term/epoch различает поколения authority; fencing проверяется самим принимающим ресурсом, отвергающим старого владельца. Lease timeout на клиенте недостаточен, если остановленный процесс возобновился и всё ещё способен писать. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


95. (L2 [D]) Почему spill to disk случился, хотя cost model ожидала fit in memory?

    **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency. Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


96. (L3 [T]) Как устроены реальные cost models в PostgreSQL/коммерческих СУБД?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


97. (L3 [T]) Почему cost model завязана на hardware assumptions?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


98. (L3 [T]) Как CPU cache, branch prediction и vectorization влияют на современный CBO?

    **Ответ:** Vectorized batches уменьшают per-row overhead и помогают SIMD, но memory bandwidth/gather/variable-length types могут ограничить выигрыш. Нужны feature detection, безопасный tail и scalar oracle; наличие vector instructions само не доказывает ускорение.

    **Источник:** [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


99. (L3 [T]) Почему one-size-fits-all cost constants редко работают?

    **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

    **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


100. (L3 [T]) Как adaptive / runtime re-optimization соотносится с классическим CBO?

     **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


101. (L3 [T]) Как optimizer учитывает partition pruning и data locality?

     **Ответ:** Pushdown/pruning уменьшают работу до materialization/shipping, только если преобразование сохраняет semantics. Metadata min/max позволяют пропустить блок лишь при доказанном отсутствии совпадений, включая NULL/collation правила. Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


102. (L3 [T]) Как CBO учитывает parallelism?

     **Ответ:** Parallelism делит работу, но добавляет exchange, coordination и memory per worker. Skew/serial stages/bandwidth ограничивают speedup; увеличение workers может ухудшить общую multitenant capacity и p99.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


103. (L3 [T]) Почему misestimated cardinality часто доминирует над ошибками в cost constants?

     **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


104. (L3 [T]) Как optimizer должен учитывать buffer pool/page cache effects?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


105. (L3 [T]) Почему CBO — это одновременно статистика, алгоритмы и engineering compromise?

     **Ответ:** Cost model оценивает CPU/I/O/memory/network по cardinality и доступным paths, а не предсказывает точное wall-clock время. Ошибка оценок промежуточных наборов особенно опасна для join order, hash memory и distributed shuffle.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


106. (L3 [P]) Реализовать calibration benchmark для cost constants

     **Ответ:** Зафиксировать dataset/seed, целевой profile операций, одинаковую durability и correctness oracle. Сравнивать cold/warm, concurrency/QD и steady-state maintenance, измеряя finished ops/bytes, p50/p99 и errors; менять один исследуемый параметр и исключить setup из таймера.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


107. (L3 [P]) Реализовать skew-aware histogram

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Задать затраты scan, lookup, sort/join и shipping с явными единицами, оценки selectivity и cumulative rows. Калибровать на измерениях, проверять orders-of-magnitude ошибки и не подменять correctness стоимостным эвристическим правилом.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


108. (L3 [P]) Реализовать cost model с учётом cache hit ratio

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


109. (L3 [P]) Реализовать optimizer trace: chosen cost vs actual runtime

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


110. (L3 [P]) Реализовать re-optimization trigger при large cardinality misprediction

     **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Задать затраты scan, lookup, sort/join и shipping с явными единицами, оценки selectivity и cumulative rows. Калибровать на измерениях, проверять orders-of-magnitude ошибки и не подменять correctness стоимостным эвристическим правилом.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


111. (L3 [D]) Как доказать, что корень проблемы в cardinality estimation, а не в executor?

     **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


112. (L3 [D]) Почему cost model работает на тестах и ломается на production workload?

     **Ответ:** Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


113. (L3 [D]) Как расследовать parameter-sensitive regression?

     **Ответ:** Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


114. (L3 [D]) Почему оптимизатор систематически недооценивает joins на correlated columns?

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


115. (L3 [D]) Как понять, что пора менять cost model, а не “тюнить запросы вручную”?

     **Ответ:** Сопоставить estimate/actual cardinality на каждом node, statistics freshness, skew/correlations и cached parameterized plan. Ошибка верхнего operator часто является следствием нижнего неверного estimate.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


116. (L4 [S]) Когда для своей БД оправдан полноценный CBO?

     **Ответ:** Расширять модель только под наблюдаемые workload regressions; учитывать uncertainty и resource budgets. Точный micro-cost не компенсирует ошибку cardinality на несколько порядков, поэтому сначала улучшать statistics/selectivity.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


117. (L4 [S]) Как эволюционировать optimizer от rule-based к cost-based?

     **Ответ:** Расширять модель только под наблюдаемые workload regressions; учитывать uncertainty и resource budgets. Точный micro-cost не компенсирует ошибку cardinality на несколько порядков, поэтому сначала улучшать statistics/selectivity.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


118. (L4 [S]) Как строить cost model, не привязанную намертво к одной машине?

     **Ответ:** Расширять модель только под наблюдаемые workload regressions; учитывать uncertainty и resource budgets. Точный micro-cost не компенсирует ошибку cardinality на несколько порядков, поэтому сначала улучшать statistics/selectivity.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


119. (L4 [S]) Как проектировать feedback loop actual runtime → optimizer stats?

     **Ответ:** Расширять модель только под наблюдаемые workload regressions; учитывать uncertainty и resource budgets. Точный micro-cost не компенсирует ошибку cardinality на несколько порядков, поэтому сначала улучшать statistics/selectivity.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


120. (L4 [S]) Как объяснять команде, что optimizer не может быть “всегда прав” по определению?

     **Ответ:** Расширять модель только под наблюдаемые workload regressions; учитывать uncertainty и resource budgets. Точный micro-cost не компенсирует ошибку cardinality на несколько порядков, поэтому сначала улучшать statistics/selectivity.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


---

## 🔹 Execution plans

121. (L1 [T]) Что такое execution plan?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


122. (L1 [T]) Чем execution plan отличается от исходного SQL?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


123. (L1 [T]) Что обычно видно в execution plan: scan, filter, join, sort, aggregate?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


124. (L1 [T]) Почему execution plan полезен при performance debugging?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


125. (L1 [T]) Что такое estimated plan и actual plan?

     **Ответ:** Estimated plan показывает оценки без выполнения, actual добавляет наблюдённые rows/loops/timing/buffers после исполнения. EXPLAIN ANALYZE реально выполняет запрос, в том числе изменяющий, и добавляет measurement overhead.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


126. (L1 [T]) Почему row estimate и actual rows — критично важные поля?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


127. (L1 [T]) Что означает seq scan в плане?

     **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


128. (L1 [T]) Что означает index scan в плане?

     **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


129. (L1 [T]) Что означает hash join / nested loop / merge join?

     **Ответ:** Hash join строит hash table одной стороны и probe другой; выгоден для соответствующих equality predicates. Build cardinality/width и memory limit определяют spill, skew может создать перегруженный partition. Nested loop выполняет inner path для каждой outer row, поэтому rows×loops важны. При малом outer и indexed inner он эффективен, при ошибке оценки превращается в огромное число probes.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


130. (L1 [T]) Почему plan tree читается снизу вверх?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


131. (L1 [P]) Реализовать pretty-printer execution plan tree

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


132. (L1 [P]) Реализовать instrumentation: actual rows/time per node

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


133. (L1 [P]) Реализовать explain output для своего mini-engine

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


134. (L1 [P]) Реализовать estimated vs actual counters

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


135. (L1 [P]) Реализовать tree walker для анализа plan nodes

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs. Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


136. (L2 [T]) Почему actual plan важнее estimated plan при расследовании?

     **Ответ:** Estimated plan показывает оценки без выполнения, actual добавляет наблюдённые rows/loops/timing/buffers после исполнения. EXPLAIN ANALYZE реально выполняет запрос, в том числе изменяющий, и добавляет measurement overhead.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


137. (L2 [T]) Что такое startup time и total time node-а?

     **Ответ:** Startup time node — время до первой строки, total — до завершения выдачи в принятом explain формате. При loops/parallel execution метрики требуют правильного масштабирования и inclusive/exclusive понимания, а не простого суммирования всех nodes.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


138. (L2 [T]) Почему loops count важен в nested loop-heavy plans?

     **Ответ:** Nested loop выполняет inner path для каждой outer row, поэтому rows×loops важны. При малом outer и indexed inner он эффективен, при ошибке оценки превращается в огромное число probes.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


139. (L2 [T]) Как plan показывает, где происходят sorts и materialization?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


140. (L2 [T]) Почему plan node может быть cheap, но multiplier effect делает его дорогим?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


141. (L2 [T]) Что такое plan instability?

     **Ответ:** Plan instability — изменение выбранного физического плана при изменении statistics/parameters/schema/configuration. Это не всегда regression; сравнить actual latency/output и rows estimates по репрезентативным parameter classes.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


142. (L2 [T]) Почему два похожих запроса могут иметь radically different plans?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


143. (L2 [T]) Что такое plan cache?

     **Ответ:** Один cached/generic plan может быть неудачен для skewed parameter values. Сравнить реальные bind values, generic/custom plan, statistics и actual rows; отключение cache глобально может добавить заметный planning overhead.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


144. (L2 [T]) Почему cached plan может стать неактуальным?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


145. (L2 [T]) Почему execution plan — это interface между optimizer и executor?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


146. (L2 [P]) Реализовать collection actual timing per operator

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs. Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


147. (L2 [P]) Реализовать loops-aware plan instrumentation

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


148. (L2 [P]) Реализовать detect large estimate error in explain output

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


149. (L2 [P]) Реализовать plan diff tool для двух execution plans

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


150. (L2 [P]) Реализовать simple plan cache с invalidation по statistics change

     **Ответ:** Сравнивать canonical data по стабильным ranges и согласованным versions, count дополнить hashes/values/business invariants. Checksum покрывает identity/length/version; mismatch сохраняется с provenance и чинится из доверенного source, а не молча игнорируется.

     **Источник:** [PostgreSQL: Data checksums](https://www.postgresql.org/docs/current/checksums.html); [PostgreSQL: Logical replication](https://www.postgresql.org/docs/current/logical-replication.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


151. (L2 [D]) Почему plan выглядит “нормально”, а запрос медленный?

     **Ответ:** Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


152. (L2 [D]) Почему actual rows на два порядка больше estimate?

     **Ответ:** Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


153. (L2 [D]) Почему nested loop неожиданно вызвал миллионы index lookups?

     **Ответ:** Nested loop выполняет inner path для каждой outer row, поэтому rows×loops важны. При малом outer и indexed inner он эффективен, при ошибке оценки превращается в огромное число probes. Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


154. (L2 [D]) Почему sort node spill-ится на диск?

     **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency. Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


155. (L2 [D]) Почему planner cache держит устаревший плохой plan?

     **Ответ:** Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


156. (L3 [T]) Как устроено instrumentation plan nodes с минимальным overhead?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


157. (L3 [T]) Как actual execution plans помогают тюнить optimizer?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


158. (L3 [T]) Как parallel execution отражается в execution plan?

     **Ответ:** Parallelism делит работу, но добавляет exchange, coordination и memory per worker. Skew/serial stages/bandwidth ограничивают speedup; увеличение workers может ухудшить общую multitenant capacity и p99.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


159. (L3 [T]) Как visibility checks, rechecks и heap fetches отражаются в плане?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


160. (L3 [T]) Почему explain/analyze сам может менять timing behavior?

     **Ответ:** Устаревшие/недостаточные statistics искажает rows/selectivity, меняя join/index decisions. ANALYZE полезен, но sampling/skew/correlations остаются; сравнить estimates и actual до и после, не форсировать план вслепую.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


161. (L3 [T]) Как flamegraphs/perf traces соотносятся с plan nodes?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


162. (L3 [T]) Как materialization и buffering влияют на shape плана?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


163. (L3 [T]) Как executor pipeline breakers отражаются в плане?

     **Ответ:** Execution plan задаёт физические scan/join/aggregate/sort operators и их потоки данных. Actual rows, loops, memory/spill и критический путь объясняют работу; суммировать inclusive node times как независимые затраты нельзя.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


164. (L3 [T]) Почему production-safe observability execution plans сложна?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)


165. (L3 [T]) Как строить mapping “SQL fragment → plan node → CPU/IO cost”?

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


166. (L3 [P]) Реализовать lightweight sampling profiler по plan nodes

     **Ответ:** Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs. Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


167. (L3 [P]) Реализовать actual vs estimated cardinality heatmap

     **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


168. (L3 [P]) Реализовать trace executor events с привязкой к plan tree

     **Ответ:** Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


169. (L3 [P]) Реализовать spill diagnostics для sort/hash nodes

     **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency. Реализовать pipeline operators над batches/iterators, явный row schema и NULL semantics. Blocking stages имеют memory limit/spill, cancellation освобождает state; сравнить output с reference interpreter на edge cases.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


170. (L3 [P]) Реализовать plan regression detector по сохранённым explain snapshots

     **Ответ:** Зафиксировать engine/volume snapshot boundary, manifest/base dependencies и reference counts/retention. CoW сохраняет old blocks до release, partial snapshot не публикуется; проверить multi-volume consistency, base loss и restore/restart.

     **Источник:** [PostgreSQL: Backup and restore](https://www.postgresql.org/docs/current/backup.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


171. (L3 [D]) Как доказать, что плохой runtime идёт из-за executor bottleneck внутри “правильного” плана?

     **Ответ:** Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


172. (L3 [D]) Почему explain analyze показывает одно, а production профилирование другое?

     **Ответ:** Устаревшие/недостаточные statistics искажает rows/selectivity, меняя join/index decisions. ANALYZE полезен, но sampling/skew/correlations остаются; сравнить estimates и actual до и после, не форсировать план вслепую. Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


173. (L3 [D]) Как расследовать plan regression, проявляющуюся только на одном tenant-е?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


174. (L3 [D]) Почему actual loops count explodes на correlated subquery?

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


175. (L3 [D]) Как найти один node, который формально cheap, но ломает p99 из-за cache miss/spill?

     **Ответ:** Hash/sort spill переносит промежуточные данные на временный storage при недостаточном memory budget. Увеличение per-operator memory умножается на operators/workers/queries и может вызвать OOM; сначала проверить cardinality и concurrency. Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Разобрать actual rows×loops, filtered rows, sort/hash spill и buffer/I/O. Найти доминирующую стадию и её причину: plan, resource saturation, skew или data growth; сравнить workload до/после regression.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


176. (L4 [S]) Как строить explain/trace tooling для собственной СУБД?

     **Ответ:** Выбирать iterator/vectorized/fused execution под типы и latency/throughput, сохраняя observability. Ограничить intermediate memory и parallel fan-out; faster operator не улучшит запрос, если bottleneck в remote I/O.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


177. (L4 [S]) Какие execution metrics нужно собирать с первого дня?

     **Ответ:** Выбирать iterator/vectorized/fused execution под типы и latency/throughput, сохраняя observability. Ограничить intermediate memory и parallel fan-out; faster operator не улучшит запрос, если bottleneck в remote I/O.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


178. (L4 [S]) Как балансировать информативность explain output и overhead instrumentation?

     **Ответ:** Выбирать iterator/vectorized/fused execution под типы и latency/throughput, сохраняя observability. Ограничить intermediate memory и parallel fan-out; faster operator не улучшит запрос, если bottleneck в remote I/O.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


179. (L4 [S]) Как включить plan analysis в регулярный perf review команды?

     **Ответ:** Выбирать iterator/vectorized/fused execution под типы и latency/throughput, сохраняя observability. Ограничить intermediate memory и parallel fan-out; faster operator не улучшит запрос, если bottleneck в remote I/O.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


180. (L4 [S]) Как объяснять разработчикам, что execution plan — это главный источник правды о запросе, а не догадки по SQL?

     **Ответ:** Выбирать iterator/vectorized/fused execution под типы и latency/throughput, сохраняя observability. Ограничить intermediate memory и parallel fan-out; faster operator не улучшит запрос, если bottleneck в remote I/O.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [Apache Arrow: Columnar format](https://arrow.apache.org/docs/format/Columnar.html)


---

## 🔹 Index selection

181. (L1 [T]) Что такое index selection в контексте optimizer-а?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


182. (L1 [T]) Почему наличие индекса ещё не означает, что он будет использован?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


183. (L1 [T]) Что такое selectivity индекса?

     **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


184. (L1 [T]) Почему low-selectivity index часто бесполезен?

     **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


185. (L1 [T]) Что такое composite index?

     **Ответ:** Composite index сортирует tuple ключей лексикографически по объявленному comparator. Leading equality prefix и следующий range дают полезные bounds; suffix-only доступ/skip-scan зависят от engine, а payload INCLUDE не является частью sort key.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


186. (L1 [T]) Почему порядок колонок в composite index важен?

     **Ответ:** Composite index сортирует tuple ключей лексикографически по объявленному comparator. Leading equality prefix и следующий range дают полезные bounds; suffix-only доступ/skip-scan зависят от engine, а payload INCLUDE не является частью sort key.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


187. (L1 [T]) Что такое covering index?

     **Ответ:** Индекс, содержащий все поля, нужные query predicates/order/projection. Может избежать table fetch, но не всех visibility checks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


188. (L1 [T]) Почему index lookup может быть дороже seq scan?

     **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


189. (L1 [T]) Что такое index-only scan?

     **Ответ:** Чтение результата из index при доступных полях и доказанной видимости. В PostgreSQL visibility map может потребовать heap fallback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


190. (L1 [T]) Почему secondary index может требовать table/heap lookup?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


191. (L1 [P]) Реализовать выбор между seq scan и single-column index

     **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования. Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


192. (L1 [P]) Реализовать поддержку composite index selection

     **Ответ:** Tuple comparator задаёт lexicographic key order и NULL/collation rules, bounds выражают допустимый prefix/range. Search и updates используют тот же encoding, string-prefix upper bound не всегда простое увеличение byte.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


193. (L1 [P]) Реализовать простую оценку selectivity

     **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями. Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


194. (L1 [P]) Реализовать covering-index fast path

     **Ответ:** Стабильно кодировать key/tokens, выбирать owner и distinct fault-domain replicas по общей versioned membership. Симулировать join/leave/weights, считать moved keys и requests/bytes skew; перенос данных/cutover не подменяется пересчётом hash.

     **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


195. (L1 [P]) Реализовать heuristic “не использовать индекс при высокой selectivity”

     **Ответ:** Selectivity — доля строк, проходящих predicate. Очень большая доля может сделать full scan дешевле random lookups; estimates нужно сверять с actual и учитывать correlations между полями. Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


196. (L2 [T]) Почему optimizer должен учитывать clustering factor / locality?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


197. (L2 [T]) Почему range predicate лучше подходит B-Tree, чем hash index?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


198. (L2 [T]) Почему composite index `(a, b)` не всегда помогает по `WHERE b = ?`?

     **Ответ:** Composite index сортирует tuple ключей лексикографически по объявленному comparator. Leading equality prefix и следующий range дают полезные bounds; suffix-only доступ/skip-scan зависят от engine, а payload INCLUDE не является частью sort key.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


199. (L2 [T]) Что такое prefix matching в composite index?

     **Ответ:** Composite index сортирует tuple ключей лексикографически по объявленному comparator. Leading equality prefix и следующий range дают полезные bounds; suffix-only доступ/skip-scan зависят от engine, а payload INCLUDE не является частью sort key.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


200. (L2 [T]) Почему фильтр, сортировка и join могут конкурировать за “лучший” индекс?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


201. (L2 [T]) Что такое skip scan / bitmap scan и зачем они нужны?

     **Ответ:** Skip scan выполняет серию probes по подходящим leading-key значениям при допустимом distribution, bitmap scan сначала собирает row/page candidates и затем читает их группами. Доступность/выгодность зависят от engine/version и selectivity.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


202. (L2 [T]) Почему optimizer иногда выбирает несколько индексов, а не один?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


203. (L2 [T]) Как MVCC visibility влияет на реальную стоимость index-only scan?

     **Ответ:** В PostgreSQL index-only scan избегает heap fetch, когда visibility map подтверждает all-visible page. Частые writes/недостаточный VACUUM уменьшают эффект даже при полном covering index.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


204. (L2 [T]) Почему stale statistics ломают index selection?

     **Ответ:** Устаревшие/недостаточные statistics искажает rows/selectivity, меняя join/index decisions. ANALYZE полезен, но sampling/skew/correlations остаются; сравнить estimates и actual до и после, не форсировать план вслепую.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


205. (L2 [T]) Почему over-indexing ухудшает writes и иногда даже reads?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


206. (L2 [P]) Реализовать composite-index prefix rules

     **Ответ:** Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


207. (L2 [P]) Реализовать bitmap index merge (упрощённо)

     **Ответ:** Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


208. (L2 [P]) Реализовать cost model для covering vs non-covering index

     **Ответ:** Index entry включает search key/locator и нужный payload; query проверяет coverage, snapshot visibility и residual predicates. Если видимость/поле не доказаны, fetch row; test compare с table scan на concurrent update/delete.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


209. (L2 [P]) Реализовать выбор индекса под filter + order by

     **Ответ:** Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


210. (L2 [P]) Реализовать advisor, предлагающий индекс по observed queries

     **Ответ:** Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


211. (L2 [D]) Почему optimizer не использует “очевидный” индекс?

     **Ответ:** Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


212. (L2 [D]) Почему после создания индекса запрос стал медленнее?

     **Ответ:** Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


213. (L2 [D]) Почему composite index почти не помог?

     **Ответ:** Composite index сортирует tuple ключей лексикографически по объявленному comparator. Leading equality prefix и следующий range дают полезные bounds; suffix-only доступ/skip-scan зависят от engine, а payload INCLUDE не является частью sort key. Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


214. (L2 [D]) Почему index-only scan всё равно ходит в heap/table?

     **Ответ:** В PostgreSQL index-only scan избегает heap fetch, когда visibility map подтверждает all-visible page. Частые writes/недостаточный VACUUM уменьшают эффект даже при полном covering index. Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


215. (L2 [D]) Почему low-cardinality predicate создаёт плохой index plan?

     **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения. Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


216. (L3 [T]) Как optimizer выбирает между multiple usable indexes?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


217. (L3 [T]) Как column correlation влияет на index usefulness?

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


218. (L3 [T]) Как cache residency индекса должна учитываться в выборе?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


219. (L3 [T]) Как partial indexes и filtered indexes меняют index selection?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


220. (L3 [T]) Как planner учитывает maintenance cost индекса косвенно через workload mix?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


221. (L3 [T]) Как индекс может одновременно помогать WHERE, ORDER BY и JOIN?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


222. (L3 [T]) Как partitioned tables усложняют index selection?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


223. (L3 [T]) Как global vs local indexes влияют на distributed cost?

     **Ответ:** Глобальная uniqueness/index update охватывает несколько владельцев и требует координации или специального allocation протокола. Local UNIQUE на shards не доказывает global invariant; async global projection может временно отставать.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/)


224. (L3 [T]) Почему index advisor без workload-awareness почти бесполезен?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


225. (L3 [T]) Как строить explainability для решений optimizer-а по выбору индекса?

     **Ответ:** Индекс полезен при соответствии predicate/order/join и достаточной selectivity; большая доля строк может читаться быстрее sequential scan. Composite порядок, expressions, collation, NULL и covering влияют на применимость.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


226. (L3 [P]) Реализовать multi-index candidate scoring

     **Ответ:** В одной atomic write boundary менять row и old/new index entries, учитывать duplicates/NULL/constraints. Старые snapshot references удерживать до GC; test rollback/error после каждого index change и lookup equivalence со scan.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


227. (L3 [P]) Реализовать partial-index eligibility check

     **Ответ:** Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


228. (L3 [P]) Реализовать cache-aware index cost estimation

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


229. (L3 [P]) Реализовать index usage telemetry и unused-index detector

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов. Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


230. (L3 [P]) Реализовать what-if optimizer для виртуальных индексов

     **Ответ:** Перечислить semantically допустимые scan/join/order alternatives, оценить rows/selectivity/CPU/IO/memory и выбрать minimum cost. Сравнить output с reference и estimates с actual, включить skew/correlation/cold-warm и разные bind values.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


231. (L3 [D]) Как доказать, что причина плохого плана — correlation/skew, а не отсутствие индекса?

     **Ответ:** Статистика описывает распределения/частые значения и иногда зависимости столбцов. Оценка независимости predicates ошибается при correlation; ANALYZE/extended statistics помогают, но не предсказывают все меняющиеся данные. Равномерное число keys/bytes не гарантирует равномерный traffic или join work. Измерять heat по ключам/partitions и стоимость операций; hot single key отличается от множества неравномерно распределённых keys. Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


232. (L3 [D]) Почему index advisor рекомендует индекс, который на деле вреден?

     **Ответ:** Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


233. (L3 [D]) Почему один tenant постоянно получает другой index plan?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants. Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


234. (L3 [D]) Как расследовать случай, когда индекс ускоряет p50, но ухудшает p99?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


235. (L3 [D]) Почему cache residency индекса изменила поведение optimizer-а после рестарта?

     **Ответ:** Проверить casts/functions, leading columns, statistics и estimated/actual selectivity. Отдельно измерить index probes, heap fetch и cache state; отсутствие Index Scan не означает ошибку optimizer.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


236. (L4 [S]) Как проектировать indexing strategy для нового продукта, а не для одного запроса?

     **Ответ:** Поддерживать минимальный полезный набор под реальные queries/constraints. Не создавать index на каждый столбец; удаление/изменение и online build требуют impact analysis, capacity и rollback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


237. (L4 [S]) Когда лучше добавить индекс, а когда переписать access pattern?

     **Ответ:** Поддерживать минимальный полезный набор под реальные queries/constraints. Не создавать index на каждый столбец; удаление/изменение и online build требуют impact analysis, capacity и rollback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


238. (L4 [S]) Как балансировать read gains и write amplification от индексов?

     **Ответ:** Поддерживать минимальный полезный набор под реальные queries/constraints. Не создавать index на каждый столбец; удаление/изменение и online build требуют impact analysis, capacity и rollback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


239. (L4 [S]) Как строить индексную политику для multi-tenant системы?

     **Ответ:** Tenant identity должна входить в routing/keys/проверки доступа и quotas. Изоляция CPU/I/O/memory/queues нужна помимо логического ACL; global averages скрывают noisy-neighbor нарушение SLO отдельных tenants.

     **Рекомендация:** Поддерживать минимальный полезный набор под реальные queries/constraints. Не создавать index на каждый столбец; удаление/изменение и online build требуют impact analysis, capacity и rollback.

     **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


240. (L4 [S]) Как объяснять команде, что индекс — это trade-off, а не бесплатное ускорение?

     **Ответ:** Поддерживать минимальный полезный набор под реальные queries/constraints. Не создавать index на каждый столбец; удаление/изменение и online build требуют impact analysis, capacity и rollback.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


---

## 🔹 Caching (buffer pool)

241. (L1 [T]) Что такое buffer pool?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Пример:** Frame с pin_count=1 не является допустимым eviction victim, даже если давно не было hit.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


242. (L1 [T]) Чем buffer pool БД отличается от page cache ОС?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


243. (L1 [T]) Зачем БД держит собственный cache страниц?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


244. (L1 [T]) Что такое page hit и page miss?

     **Ответ:** Hit означает пригодная копия найдена на конкретном уровне, miss требует следующего уровня/источника. Указать DB buffer/OS cache/CDN/device границу: высокий hit rate одного слоя не означает отсутствие дорогих misses другого.

     **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


245. (L1 [T]) Почему buffer pool влияет и на reads, и на writes?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


246. (L1 [T]) Что такое dirty page в buffer pool?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Dirty page изменена в памяти и ещё не приведена к устойчивому backing state. Для DB pages нужен WAL-before-data, для OS cache — writeback/sync по контракту; один dirty flag не содержит всего recovery protocol.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: open and O_DIRECT](https://man7.org/linux/man-pages/man2/open.2.html)


247. (L1 [T]) Почему eviction policy важна?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


248. (L1 [T]) Что такое LRU и почему её любят в теории?

     **Ответ:** LRU сохраняет недавно использованные, LFU — частые с aging, Clock приближает recency с меньшей metadata работой. Scan pollution, approximation и pinned pages меняют эффективность; выбирать по hit/bytes/latency, а не названию.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)


249. (L1 [T]) Почему чистый LRU не всегда хорош для БД?

     **Ответ:** LRU сохраняет недавно использованные, LFU — частые с aging, Clock приближает recency с меньшей metadata работой. Scan pollution, approximation и pinned pages меняют эффективность; выбирать по hit/bytes/latency, а не названию.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)


250. (L1 [T]) Почему большой buffer pool не гарантирует хорошую производительность?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


251. (L1 [P]) Реализовать buffer pool для fixed-size pages

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


252. (L1 [P]) Реализовать page table: page_id → frame

     **Ответ:** Реализовать page table, pin/unpin, bounded frames, loader coalescing и LRU/Clock policy. Flush dirty frame только после durable pageLSN, смену mapping синхронизировать; проверять eviction при живых readers и ошибках I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


253. (L1 [P]) Реализовать LRU eviction

     **Ответ:** Hash map key→iterator и двусвязный список: hit перемещает в начало, eviction удаляет хвост. Все изменения связаны; pinned/in-flight записи требуют отдельной обработки.

     **Источник:** [C++ working draft: Library](https://eel.is/c++draft/library)


254. (L1 [P]) Реализовать dirty flag и flush dirty pages

     **Ответ:** Выбрать dirty unpinned candidate, зафиксировать согласованный image/LSN, дождаться durable WAL и выполнить write. Проверить errors и re-dirty race перед очисткой dirty flag; ограничить background budget foreground latency.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


255. (L1 [P]) Реализовать hit/miss counters

     **Ответ:** Реализовать page table, pin/unpin, bounded frames, loader coalescing и LRU/Clock policy. Flush dirty frame только после durable pageLSN, смену mapping синхронизировать; проверять eviction при живых readers и ошибках I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


256. (L2 [T]) Почему scans могут вытеснять hot pages?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


257. (L2 [T]) Что такое buffer pool thrashing?

     **Ответ:** Control loop без hysteresis/cooldown может многократно переносить данные/ресурсы между решениями. Использовать стабильное окно, разные пороги входа/выхода и budget изменений; учитывать delayed metrics и стоимость прогрева. Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


258. (L2 [T]) Почему CLOCK/2Q/LRU-K часто лучше простого LRU?

     **Ответ:** LRU сохраняет недавно использованные, LFU — частые с aging, Clock приближает recency с меньшей metadata работой. Scan pollution, approximation и pinned pages меняют эффективность; выбирать по hit/bytes/latency, а не названию.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)


259. (L2 [T]) Что такое pin/unpin page?

     **Ответ:** Pin удерживает frame/страницу от reuse пока caller её использует; unpin отпускает удержание. Pin не равен latch для содержимого, а забытый unpin может исчерпать pool даже при хорошем hit rate.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


260. (L2 [T]) Почему buffer pool должен быть concurrency-safe?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


261. (L2 [T]) Как background flusher помогает write path?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


262. (L2 [T]) Почему checkpoint pressure влияет на buffer pool behavior?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


263. (L2 [T]) Что такое free list?

     **Ответ:** Free list содержит доступные frames/slots/blocks в конкретной границе allocator/pool. Выдача/возврат должны сохранять ownership, alignment и generation, быть concurrency-safe и не возвращать ещё pinned/live storage.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [C++ working draft: Memory resources](https://eel.is/c++draft/mem.res)


264. (L2 [T]) Почему buffer pool sizing связан с workload, а не только с объёмом RAM?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


265. (L2 [T]) Почему double caching с ОС может быть болезненной?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


266. (L2 [P]) Реализовать CLOCK eviction

     **Ответ:** Реализовать map key→replacement metadata и byte capacity; hit обновляет policy, victim исключает pinned/in-flight entries. Dirty victim flush следует WAL-before-data; test scan pollution, concurrency, failed writeback и exhaustion.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


267. (L2 [P]) Реализовать scan-resistant policy

     **Ответ:** Реализовать page table, pin/unpin, bounded frames, loader coalescing и LRU/Clock policy. Flush dirty frame только после durable pageLSN, смену mapping синхронизировать; проверять eviction при живых readers и ошибках I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


268. (L2 [P]) Реализовать pin count и запрет eviction pinned pages

     **Ответ:** Реализовать map key→replacement metadata и byte capacity; hit обновляет policy, victim исключает pinned/in-flight entries. Dirty victim flush следует WAL-before-data; test scan pollution, concurrency, failed writeback и exhaustion.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


269. (L2 [P]) Реализовать background flush thread

     **Ответ:** Committers публикуют target LSN в bounded queue, один flusher пишет и sync общий префикс. После успеха продвинуть durable watermark и разбудить только покрытых waiters; error/cancel/restart не должны давать ранний ACK или lost wakeup.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Linux man-pages: fsync](https://man7.org/linux/man-pages/man2/fsync.2.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html)


270. (L2 [P]) Реализовать buffer pool benchmark: hot set + scan workload

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


271. (L2 [D]) Почему после большого scan OLTP latency выросла?

     **Ответ:** Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


272. (L2 [D]) Почему hit rate хороший, а запросы всё равно медленные?

     **Ответ:** Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


273. (L2 [D]) Почему buffer pool постоянно грязный и flush не успевает?

     **Ответ:** Dirty read наблюдает незавершённое изменение; dirty write перезаписывает его до исхода владельца. Это разные аномалии; проверять complete history, а не только final значения после commit. Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


274. (L2 [D]) Почему mutex/locks внутри buffer pool стали bottleneck?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


275. (L2 [D]) Почему после увеличения cache size performance почти не изменилась?

     **Ответ:** Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


276. (L3 [T]) Как проектировать sharded/partitioned buffer pool под many-core CPU?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


277. (L3 [T]) Как replacement policy должна учитывать scans vs point lookups?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


278. (L3 [T]) Как NUMA влияет на buffer pool design?

     **Ответ:** На NUMA стоимость доступа зависит от размещения страницы относительно выполняющего thread. First-touch, affinity и memory policy важны вместе; pinning CPU без переноса данных не гарантирует locality. Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


279. (L3 [T]) Как buffer pool взаимодействует с WAL, checkpoint и recovery?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


280. (L3 [T]) Почему page latch, pin count и eviction policy надо рассматривать вместе?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Pin удерживает frame/страницу от reuse пока caller её использует; unpin отпускает удержание. Pin не равен latch для содержимого, а забытый unpin может исчерпать pool даже при хорошем hit rate.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


281. (L3 [T]) Как page temperature / frequency statistics улучшают caching decisions?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


282. (L3 [T]) Как huge pages, alignment и allocator choices влияют на buffer pool?

     **Ответ:** TLB кэширует translations, и большой случайный working set повышает translation misses/page walks. Huge pages увеличивают охват TLB, но требуют оценки fragmentation, allocation stalls и реального выигрыша. Alignment влияет на допустимость и стоимость loads, пересечение lines/pages и SIMD. Over-aligned buffer требует подходящего allocator; больше padding не всегда лучше из-за footprint/cache pressure.

     **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [C++ working draft: Library](https://eel.is/c++draft/library); [Linux kernel: False sharing](https://docs.kernel.org/kernel-hacking/false-sharing.html)


283. (L3 [T]) Почему compressed pages в cache — отдельный trade-off?

     **Ответ:** Compression уменьшает bytes/IO ценой encode/decode CPU и минимальной единицы доступа. Codec/block size выбирают по input, point/range path и p99; уже сжатые/высокоэнтропийные данные могут почти не уменьшаться.

     **Источник:** [Apache Parquet: File format](https://parquet.apache.org/docs/file-format/); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)


284. (L3 [T]) Как измерять не только hit ratio, но и useful hit ratio / eviction pain?

     **Ответ:** Buffer pool отображает page IDs в frames с pin/ref count, dirty state и replacement metadata. Используемую страницу нельзя переиспользовать; dirty victim требует write-ahead ordering и безопасного завершения I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


285. (L3 [T]) Почему buffer pool — это не просто cache, а центр всей storage concurrency?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


286. (L3 [P]) Реализовать sharded buffer pool

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


287. (L3 [P]) Реализовать LRU-K или 2Q

     **Ответ:** Реализовать map key→replacement metadata и byte capacity; hit обновляет policy, victim исключает pinned/in-flight entries. Dirty victim flush следует WAL-before-data; test scan pollution, concurrency, failed writeback и exhaustion.

     **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


288. (L3 [P]) Реализовать per-page access frequency tracking

     **Ответ:** Реализовать page table, pin/unpin, bounded frames, loader coalescing и LRU/Clock policy. Flush dirty frame только после durable pageLSN, смену mapping синхронизировать; проверять eviction при живых readers и ошибках I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


289. (L3 [P]) Реализовать flush scheduler с write coalescing

     **Ответ:** Реализовать page table, pin/unpin, bounded frames, loader coalescing и LRU/Clock policy. Flush dirty frame только после durable pageLSN, смену mapping синхронизировать; проверять eviction при живых readers и ошибках I/O.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


290. (L3 [P]) Реализовать observability: hit ratio, dirty ratio, eviction rate, flush lag, latch contention

     **Ответ:** Выбрать dirty unpinned candidate, зафиксировать согласованный image/LSN, дождаться durable WAL и выполнить write. Проверить errors и re-dirty race перед очисткой dirty flag; ограничить background budget foreground latency.

     **Источник:** [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


291. (L3 [D]) Как доказать, что bottleneck в buffer pool contention, а не в диске?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


292. (L3 [D]) Почему после смены eviction policy p50 улучшился, а p99 ухудшился?

     **Ответ:** Tail определяется очередями, редкими stalls и fan-out: хороший p50 не исключает плохой p99. Сопоставить временную линию с maintenance, topology changes и resource saturation; retry/hedging добавляют нагрузку и требуют бюджета. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


293. (L3 [D]) Как расследовать write stall, вызванный нехваткой clean pages?

     **Ответ:** Stall/backpressure ограничивает приём, когда memtables/L0/очередь опережают обслуживание. Это защищает bounded resources, но пиковая latency растёт; бесконечная очередь лишь откладывает отказ и увеличивает recovery debt. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


294. (L3 [D]) Почему хороший hit ratio скрывает плохую locality и высокие latch costs?

     **Ответ:** Locality сокращает RTT/shipping, но должна учитывать freshness, quorum и fault domains. Ближайший node не всегда eligible; приближение одного leader может увеличить remote reads/влияние на других tenants. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Google: Spanner paper](https://research.google/pubs/spanner-googles-globally-distributed-database/); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


295. (L3 [D]) Как отличить page cache issue ОС от собственного buffer pool issue БД?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Измерить hits/misses по типу страниц, pins, dirty backlog, eviction stalls и load latency. Отличить cache БД от Linux page cache; общий hit rate может скрывать misses горячего tenant или leaf pages.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


296. (L4 [S]) Когда БД стоит полагаться на OS page cache, а когда нужен мощный buffer pool?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Рекомендация:** Распределить память между data/index/filter/working buffers и ОС, учитывать cgroups и concurrency. Кэшировать измеренный working set, ограничить scan pollution и проверить cold recovery/массовый прогрев.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


297. (L4 [S]) Как выбирать memory budget между buffer pool, execution memory и OS cache?

     **Ответ:** Planner search может строиться снизу вверх dynamic programming либо сверху вниз через memo/rules и physical requirements. Search space grows combinatorially, поэтому pruning/budgets/heuristics обязательны; semantic equivalence проверяется отдельно от cost. Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Рекомендация:** Распределить память между data/index/filter/working buffers и ОС, учитывать cgroups и concurrency. Кэшировать измеренный working set, ограничить scan pollution и проверить cold recovery/массовый прогрев.

     **Источник:** [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html); [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


298. (L4 [S]) Как проектировать buffer pool для mixed OLTP + analytical workload?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Рекомендация:** Распределить память между data/index/filter/working buffers и ОС, учитывать cgroups и concurrency. Кэшировать измеренный working set, ограничить scan pollution и проверить cold recovery/массовый прогрев.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


299. (L4 [S]) Как строить roadmap cache optimizations без переусложнения архитектуры?

     **Ответ:** Распределить память между data/index/filter/working buffers и ОС, учитывать cgroups и concurrency. Кэшировать измеренный working set, ограничить scan pollution и проверить cold recovery/массовый прогрев.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


300. (L4 [S]) Как объяснять команде, что высокий hit ratio сам по себе не равен хорошей производительности?

     **Ответ:** Распределить память между data/index/filter/working buffers и ОС, учитывать cgroups и concurrency. Кэшировать измеренный working set, ограничить scan pollution и проверить cold recovery/массовый прогрев.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


---

## 🔹 Cross-topic вопросы

301. (L2 [T]) Как query planning, CBO и execution plans связаны между собой?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


302. (L2 [T]) Почему плохой cardinality estimate часто ведёт и к плохому index selection, и к плохому execution plan?

     **Ответ:** Кардинальность означает число разных значений/комбинаций либо размер результата — границу нужно назвать. В TSDB каждый новый label set создаёт series state; в query planning cardinality error меняет memory/join решения.

     **Источник:** [Prometheus: Instrumentation practices](https://prometheus.io/docs/practices/instrumentation/); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


303. (L2 [T]) Как buffer pool/page cache меняют реальную стоимость plan operators?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Access path — физический способ получить строки, например sequential/index scan; plan operator выполняет scan/filter/join/sort/aggregate. План связывает их и requirements порядка/распределения; одинаковый результат допускает разные costs.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


304. (L2 [T]) Почему optimizer не может идеально предсказывать performance без runtime feedback?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


305. (L2 [T]) Как MVCC visibility cost и heap fetches искажают “теоретически хороший” index plan?

     **Ответ:** MVCC сохраняет версии и выбирает видимую по snapshot/transaction state. Readers меньше блокируют writers, но conflicts писателей, version storage и GC остаются; старейший активный snapshot ограничивает безопасную очистку.

     **Пример:** Snapshot S видит версию commit_seq=10 и не видит новую commit_seq=20, если её boundary равна 15.

     **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [PostgreSQL: Routine vacuuming](https://www.postgresql.org/docs/current/routine-vacuuming.html)


306. (L2 [T]) Почему performance debugging всегда требует связки: SQL + plan + stats + cache + I/O?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


307. (L2 [T]) Как Linux page cache, buffer pool и storage latency вместе формируют observed query time?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)


308. (L2 [T]) Почему high CPU query может быть следствием planner mistake, а не “медленного железа”?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


309. (L2 [T]) Почему оптимизация одного запроса может ухудшить общий workload mix?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


310. (L2 [T]) Почему production performance issues редко решаются “добавить индекс” в один шаг?

     **Ответ:** Planner строит эквивалентные logical/physical планы и выбирает по оценённым rows/cost. Плохая cardinality, correlations, неверная selectivity или дорогой data shipping могут сделать выбранный план хуже фактической альтернативы.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


311. (L2 [P]) Реализовать mini-engine: planner + CBO + executor + buffer pool

     **Ответ:** Map page_id→frames с pin/dirty/generation и coalesced load, bounded replacement. I/O не выполняется с произвольным освобождённым frame, dirty flush ждёт durable pageLSN; test concurrent load/evict и I/O failure.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


312. (L2 [P]) Реализовать dashboard: planning time, execution time, actual rows, buffer hits, spills

     **Ответ:** Экспортировать counters/gauges/histograms по stages и bounded shard/region/workload dimensions; operation IDs оставить logs/traces. Добавить queue age, completion/error rates и нужные версии/LSN, проверить сигнал known fault и отдельно loss/sampling telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


313. (L2 [P]) Реализовать plan regression test suite на synthetic workloads

     **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


314. (L2 [P]) Реализовать what-if experiments: add index / change stats / shrink cache

     **Ответ:** Сформировать кандидаты из WHERE/JOIN/ORDER BY, выбрать equality-prefix и range/order suffix, проверить EXPLAIN с фактическими rows. Измерить read gain вместе с size, writes и concurrent build locks.

     **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)


315. (L2 [P]) Реализовать perf harness: hot cache vs cold cache vs mixed workload

     **Ответ:** Описать AST и scan/filter/project/join/sort, перечислить допустимые paths и оценить rows/cost. Сравнивать результаты с прямым executor, а оценки — с actual execution; semantic rewrites не должны менять NULL/outer join/volatile поведение.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


316. (L3 [D]) Почему после добавления индекса p50 улучшился, а cluster-wide throughput упал?

     **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


317. (L3 [D]) Почему planner стал чаще выбирать full scan после роста таблицы?

     **Ответ:** Seq scan может быть оптимален для большой доли строк/малой таблицы, index scan добавляет probes и heap fetch. Сравнивать actual rows/loops/bytes и cache state; «индекс существует» не является правилом обязательного использования. Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


318. (L3 [D]) Как доказать, что bottleneck в optimizer stats, а не в buffer pool size?

     **Ответ:** Buffer pool держит page frames с mapping, pin count и dirty state; pinned frame нельзя переиспользовать. Для dirty victim WAL должен стать durable до data flush, а concurrent loader/evictor обязаны согласовать page generation. Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

     **Источник:** [PostgreSQL: Database physical storage](https://www.postgresql.org/docs/current/storage.html); [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


319. (L3 [D]) Почему explain plan хороший, но запрос всё равно unstable по latency?

     **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


320. (L3 [D]) Как расследовать инцидент “SQL тот же, схема та же, железо то же, а производительность внезапно хуже”?

     **Ответ:** Снять EXPLAIN (ANALYZE, BUFFERS) с реальными параметрами, сравнить estimated/actual rows и loops. Найти первый большой промах, spills, лишний fan-out/scan и stale statistics; ANALYZE изменяющего SQL реально выполняет изменения.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


321. (L4 [S]) Как строить performance engineering process для своей БД, а не тушить запросы по одному?

     **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


322. (L4 [S]) Какие метрики optimizer/planner/cache нужно собирать с первого дня?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


323. (L4 [S]) Как балансировать complexity optimizer-а и предсказуемость системы?

     **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


324. (L4 [S]) Как проектировать observability, чтобы junior/middle инженеры тоже могли читать execution plans осмысленно?

     **Ответ:** Нужны metrics и traces по shard/tenant/region/stage с ограниченной cardinality, а не только общий health. Разделять queue wait, service, I/O, replication и retries, сохранять operation/epoch context без утечки payload/секретов.

     **Рекомендация:** Начать с good/eligible SLI и freshness/durability indicators, затем диагностические dimensions. Назначить владельцев/runbooks и проверить alerts на drills, контролируя стоимость и конфиденциальность telemetry.

     **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


325. (L4 [S]) Как объяснить команде, что производительность БД — это результат взаимодействия planner, executor, indexes, cache и I/O, а не “одной магической настройки”?

     **Ответ:** Оптимизировать важные workload classes, а не один удачный query. Управлять statistics, plan stability и observability; hints/forced paths использовать только с измеренным основанием и rollback, а не вместо исправления модели/запроса.

     **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Planner statistics](https://www.postgresql.org/docs/current/planner-stats.html)


---
