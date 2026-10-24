## 🗄️ 2. Хранение данных (Data Storage)

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

Очень часто проверяют глубину именно здесь.

**Подтемы:**

* SQL vs NoSQL
* ACID vs BASE
* Indexing (B-Tree, LSM)
* Sharding (range, hash, geo)
* Replication (leader-follower, multi-leader)
* Data partitioning

---

1. (L1 [T]) В чём разница между SQL и NoSQL?

   **Ответ:** SQL — язык работы с данными, обычно в реляционной модели; NoSQL объединяет документные, key-value, графовые и другие модели. Транзакции и масштабирование зависят от конкретной СУБД.

   **Типичная ошибка:** Считать, что NoSQL всегда лишён схемы и транзакций.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

2. (L1 [T]) Что такое реляционная база данных?

   **Ответ:** База с отношениями (таблицами), ключами, ограничениями и операциями реляционной алгебры; связи выражаются значениями ключей.

   **Пример:** Заказы ссылаются на пользователей через user_id.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

3. (L1 [T]) Что такое документная база данных?

   **Ответ:** Хранит агрегаты как документы, обычно JSON-подобные; вложенные поля можно индексировать и запрашивать. Границы документа выбирают по совместному чтению и обновлению.

   **Пример:** Профиль с настройками хранится одним документом; PostgreSQL также поддерживает JSONB.

   **Источник:** [MongoDB: Data modeling](https://www.mongodb.com/docs/manual/data-modeling/); [PostgreSQL: JSON types](https://www.postgresql.org/docs/current/datatype-json.html)

4. (L1 [T]) Что такое ключ-значение (key-value) storage?

   **Ответ:** Хранилище, где основной доступ — получить, записать или удалить значение по ключу. Запросы по произвольным полям могут быть ограничены.

   **Пример:** session:123 → сериализованная сессия.

   **Источник:** [Redis: Data types](https://redis.io/docs/latest/develop/data-types/)

5. (L1 [T]) Что такое колонко-ориентированная БД?

   **Ответ:** Хранит значения столбцов совместно, что уменьшает чтение и улучшает сжатие при аналитических агрегациях. Отличается от wide-column модели Cassandra.

   **Пример:** SUM(amount) читает нужный столбец вместо всех полей строки.

   **Рекомендация:** Сопоставлять OLAP-нагрузку с колоночным форматом, OLTP — с профилем точечных изменений.

   **Источник:** [ClickHouse: Column-oriented databases](https://clickhouse.com/docs/get-started/about/intro)

6. (L1 [T]) Что такое ACID?

   **Ответ:** Atomicity, Consistency, Isolation, Durability — свойства транзакций: целостное применение, сохранение инвариантов, изоляция и сохранность подтверждённых результатов.

   **Типичная ошибка:** Путать ACID consistency с согласованностью реплик CAP.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

7. (L1 [T]) Что означает Atomicity?

   **Ответ:** Все изменения транзакции фиксируются совместно либо откатываются; промежуточный частичный результат не становится её окончательным исходом.

   **Пример:** Списание и зачисление при переводе входят в одну транзакцию.

   **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

8. (L1 [T]) Что означает Consistency (в контексте ACID)?

   **Ответ:** Корректная транзакция переводит БД между состояниями, удовлетворяющими заданным ограничениям. СУБД обеспечивает объявленные ограничения, а бизнес-логику необходимо задать корректно.

   **Типичная ошибка:** Считать, что ACID автоматически проверяет все бизнес-правила.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

9. (L1 [T]) Что означает Isolation?

   **Ответ:** Определяет допустимое взаимодействие конкурентных транзакций. Уровни изоляции разрешают разные аномалии; serializable эквивалентен некоторому последовательному выполнению.

   **Типичная ошибка:** Считать Read Committed полной изоляцией.

   **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

10. (L1 [T]) Что означает Durability?

    **Ответ:** После успешного commit изменения переживают предусмотренные моделью отказа сбои, обычно благодаря WAL и устойчивому носителю. Настройки синхронизации и репликации влияют на гарантию.

    **Типичная ошибка:** Считать асинхронную реплику гарантией нулевой потери данных при failover.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

11. (L1 [T]) Что такое BASE?

    **Ответ:** Basically Available, Soft state, Eventual consistency — подход, допускающий временное расхождение ради доступности. Это не строгая спецификация транзакций и не синоним любой NoSQL БД.

    **Источник:** [Pritchett: BASE, an ACID Alternative](https://queue.acm.org/detail.cfm?id=1394128)

12. (L1 [T]) Что такое eventual consistency в BASE?

    **Ответ:** При прекращении изменений и восстановлении обмена реплики должны сойтись. Нужны определённые правила разрешения конфликтов; верхняя граница задержки из названия не следует.

    **Типичная ошибка:** Считать eventual consistency гарантией «через секунду».

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

13. (L1 [T]) Что такое индекс?

    **Ответ:** Дополнительная структура для ускорения поиска, сортировки или проверки уникальности. Занимает место и увеличивает стоимость записи.

    **Пример:** Индекс по user_id ускоряет выборку заказов пользователя.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

14. (L1 [T]) Что такое B-Tree?

    **Ответ:** Сбалансированное многоуровневое дерево с большим ветвлением, удобное для страниц хранения; поддерживает точечный поиск и диапазоны за логарифмическое число переходов.

    **Типичная ошибка:** Путать B-tree с бинарным деревом.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

15. (L1 [T]) Что такое LSM Tree?

    **Ответ:** Семейство структур с буферизацией записей в памяти и отсортированными файлами на диске. WAL защищает неподтверждённый сброс, compaction объединяет файлы.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

16. (L1 [T]) Что такое shard?

    **Ответ:** Часть горизонтально разделённого набора данных, закреплённая за узлом или группой реплик. Shard — часть данных, replica — копия.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

17. (L1 [T]) Что такое replication?

    **Ответ:** Поддержание копий данных на нескольких узлах. Репликация бывает синхронной и асинхронной; помогает доступности и чтению, но не заменяет резервные копии.

    **Типичная ошибка:** Удаление данных может реплицироваться на все узлы.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)


---

18. (L2 [T]) Когда выбирать SQL вместо NoSQL?

    **Ответ:** Когда нужны связи, ограничения, транзакции и гибкие запросы с JOIN. Выбор определяется моделью доступа и эксплуатации, а не только размером данных.

    **Пример:** Учёт заказов, платежей и остатков.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

19. (L2 [T]) Когда NoSQL лучше SQL?

    **Ответ:** Когда конкретная модель доступа лучше выражается документами, ключами или графом, а нужные гарантии и масштабирование подтверждены измерениями.

    **Типичная ошибка:** Выбирать NoSQL только из-за предполагаемого роста.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

20. (L2 [P]) Как выбрать тип БД под продукт?

    **Ответ:** Зафиксировать инварианты, запросы, объёмы, RPO/RTO и навыки команды; сравнить кандидатов на реалистичных данных и отказах. Проверить миграции и стоимость сопровождения.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

21. (L2 [T]) В чём разница между ACID и BASE?

    **Ответ:** ACID описывает свойства транзакций, BASE — подход к доступности и временному расхождению. Они не образуют строгую бинарную классификацию всех СУБД.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Pritchett: BASE, an ACID Alternative](https://queue.acm.org/detail.cfm?id=1394128)

22. (L2 [T]) Какие компромиссы даёт BASE?

    **Ответ:** Ниже задержка и выше доступность при некоторых отказах, но появляются устаревшие чтения, конфликты и необходимость reconciliation. Компромисс допустим только для разрешённых инвариантами операций.

    **Источник:** [Pritchett: BASE, an ACID Alternative](https://queue.acm.org/detail.cfm?id=1394128); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

23. (L2 [T]) Как работает B-Tree индекс?

    **Ответ:** По ключу выбираются ветви дерева до листа с нужными значениями и ссылками на строки. Диапазон читается по соседним листьям; стоимость зависит от селективности и доступа к таблице.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

24. (L2 [T]) Как работает LSM Tree?

    **Ответ:** Запись проходит через WAL и memtable, затем flush создаёт SST-файл. Чтение объединяет версии из памяти и файлов; compaction убирает старые версии и tombstones.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

25. (L2 [P]) Когда использовать LSM вместо B-Tree?

    **Ответ:** При интенсивных последовательных потоках записи и допустимой цене compaction. Сравнить write/read/space amplification, хвостовую задержку и диапазонные запросы на своей нагрузке.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

26. (L2 [T]) Что такое secondary index?

    **Ответ:** Индекс по атрибутам, не являющимся основным ключом или основным порядком хранения. В распределённой БД его обслуживание может требовать дополнительной межузловой работы.

    **Пример:** Индекс email для поиска пользователя.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

27. (L2 [T]) Что такое covering index?

    **Ответ:** Индекс, содержащий все необходимые запросу поля. Это позволяет избежать части обращений к таблице, но PostgreSQL для index-only scan также должен проверить видимость строки.

    **Пример:** CREATE INDEX ON orders(user_id) INCLUDE (total);

    **Рекомендация:** Не включать без необходимости широкие и часто меняющиеся поля.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

28. (L2 [P]) Как спроектировать индекс под запрос?

    **Ответ:** Начать с WHERE, JOIN, ORDER BY и LIMIT; учитывать равенства, диапазоны и порядок столбцов составного индекса. Подтвердить выигрыш через EXPLAIN (ANALYZE, BUFFERS) и стоимость записи.

    **Пример:** Для WHERE user_id = ? ORDER BY created_at DESC — индекс (user_id, created_at DESC).

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

29. (L2 [T]) Что такое range-based sharding?

    **Ответ:** Деление по интервалам ключа. Удобно для диапазонов и удаления старых периодов, но последовательные записи могут перегружать последний диапазон.

    **Пример:** Заказы разделены по месяцам.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

30. (L2 [T]) Что такое hash-based sharding?

    **Ответ:** Назначение shard по хэшу ключа. Обычно равномернее распределяет ключи, но диапазонные запросы превращаются в scatter-gather.

    **Пример:** hash(user_id) определяет раздел данных.

    **Рекомендация:** Равномерность ключей не гарантирует равномерность запросов.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

31. (L2 [T]) Что такое geo-sharding?

    **Ответ:** Размещение по географическому признаку: региону клиента, арендатора или юрисдикции. Снижает задержку локальных операций, усложняет перенос и межрегиональные запросы.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

32. (L2 [P]) Как выбрать стратегию шардинга?

    **Ответ:** Выбрать ключ из основных запросов, оценить кардинальность, перекос, рост и межшардовые транзакции. Заранее определить маршрутизацию и процедуру split/move.

    **Типичная ошибка:** Шардировать только по времени при монотонном потоке записей.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

33. (L2 [T]) Что такое leader-follower replication?

    **Ответ:** Лидер принимает изменения и передаёт их followers. Followers обслуживают разрешённые чтения и могут участвовать в failover; свежесть зависит от режима репликации.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

34. (L2 [T]) Что такое read replicas?

    **Ответ:** Реплики, на которые направляют часть чтений. При асинхронной репликации результат может отставать; после записи read-your-writes требует специальной маршрутизации или ожидания.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

35. (L2 [P]) Как масштабировать read-heavy workload?

    **Ответ:** Сначала оптимизировать запросы и индексы, затем использовать кэш и read replicas. Разделить запросы по допустимой свежести, следить за lag и нагрузкой лидера.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

36. (L2 [T]) Что такое data partitioning?

    **Ответ:** Разделение данных на части по ключу или правилу. Партиции могут находиться на одном сервере; шардирование обычно подразумевает распределение по узлам.

    **Типичная ошибка:** Считать локальное partitioning автоматическим горизонтальным масштабированием.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

37. (L2 [P]) Как разделить таблицу на партиции?

    **Ответ:** Выбрать range/list/hash по запросам и жизненному циклу, создать партиции и индексы, проверить pruning. Для существующей таблицы заранее подготовить перенос и управление новыми партициями.

    **Пример:** PARTITION BY RANGE (created_at) удобно для удаления старых периодов.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


---

38. (L3 [D]) Почему запрос стал медленным после добавления индекса?

    **Ответ:** Сравнить планы до/после, оценки строк, статистику и BUFFERS. Новый индекс может привести к неудачному плану; на записи он добавляет работу, а создание может конкурировать за I/O.

    **Типичная ошибка:** Удалять индекс без сравнения плана и профиля нагрузки.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

39. (L3 [D]) Почему индекс не используется?

    **Ответ:** Проверить селективность, статистику, типы, выражения, collation и порядок столбцов. Для большой доли строк последовательное чтение может быть дешевле индекса.

    **Пример:** Функция lower(email) обычно требует индекса на выражение для такого поиска.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

40. (L3 [D]) Как найти full table scan?

    **Ответ:** EXPLAIN показывает Seq Scan, а EXPLAIN ANALYZE — фактические строки, циклы и время. Проверить объём чтения и фильтрацию: полный scan небольшой таблицы не является проблемой сам по себе.

    **Типичная ошибка:** Запускать EXPLAIN ANALYZE изменяющего запроса без учёта реального выполнения.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

41. (L3 [T]) Как работает MVCC?

    **Ответ:** MVCC хранит версии строк; снимок и правила изоляции определяют видимую версию. Старые версии очищаются после исчезновения потребности в них; долгие транзакции мешают очистке.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

42. (L3 [T]) Что такое snapshot isolation?

    **Ответ:** Транзакция читает согласованный снимок и обычно обнаруживает конфликтующие записи одной строки. Возможен write skew: две транзакции меняют разные строки и совместно нарушают инвариант.

    **Пример:** Два дежурных одновременно снимают себя с дежурства.

    **Рекомендация:** Для межстрочного инварианта рассмотреть serializable или явные блокировки.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

43. (L3 [D]) Почему возникают deadlocks в БД?

    **Ответ:** Транзакции удерживают ресурсы и циклически ждут друг друга. Изучить deadlock report и порядок захвата; сократить транзакции, унифицировать порядок блокировок и повторять целую отменённую транзакцию.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

44. (L3 [P]) Как мигрировать данные без downtime?

    **Ответ:** Использовать expand–migrate–contract: совместимая схема, backfill малыми партиями, перенос изменений через CDC/outbox, сверка, переключение чтений и лишь затем удаление старого. Предусмотреть rollback и ограничение нагрузки.

    **Типичная ошибка:** Считать две независимые записи в старое и новое хранилище атомарными.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

45. (L3 [P]) Как перераспределить shard?

    **Ответ:** Скопировать диапазон на новый shard, догнать изменения, проверить полноту и атомарно переключить владельца маршрута. Во время переноса нужен однозначный порядок записи и защита от старых маршрутов.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

46. (L3 [D]) Как обнаружить hot shard?

    **Ответ:** Сравнить QPS, объём, p99, CPU, I/O и очереди по shard и по ключам. Отличить один горячий ключ от неравномерного распределения множества ключей.

    **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

47. (L3 [T]) Что такое consistent hashing?

    **Ответ:** Хэширование, при котором изменение числа узлов переносит только часть ключей. На кольце узел владеет интервалами; виртуальные узлы сглаживают распределение.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

48. (L3 [P]) Как реализовать consistent hashing?

    **Ответ:** Хэшировать виртуальные узлы и ключи в одно упорядоченное пространство, выбрать первый токен по часовой стрелке с обходом конца. Хранить версию карты и план переноса; для реплик выбирать разные физические узлы.

    **Пример:** Для токенов [20, 60, 90] ключ 61 назначается владельцу 90.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

49. (L3 [D]) Почему реплика отстаёт (replication lag)?

    **Ответ:** Генерация WAL превышает приём или применение: сеть, диск реплики, тяжёлые запросы, блокировки либо недостаток CPU. Проверить также намеренную задержку и остановленный replay.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

50. (L3 [D]) Как диагностировать replication lag?

    **Ответ:** Раздельно измерить отправленную, полученную, flush и replay позиции WAL; сопоставить с CPU/I/O/сетью и блокировками. В PostgreSQL смотреть pg_stat_replication и состояние replay на standby.

    **Типичная ошибка:** При отсутствии новых транзакций возраст последнего replay не равен реальной очереди WAL.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

51. (L3 [T]) Что такое write amplification в LSM?

    **Ответ:** Отношение объёма физических записей к логическим: данные повторно пишутся при flush и compaction. Высокое усиление расходует I/O, ресурс SSD и увеличивает хвостовые задержки.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

52. (L3 [T]) Что такое compaction?

    **Ответ:** Объединение SST-файлов с упорядочением и удалением устаревших версий и tombstones, когда это безопасно. Политики leveled и tiered по-разному меняют усиление чтения, записи и объём.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

53. (L3 [D]) Почему резко вырос latency записи?

    **Ответ:** Проверить fsync/WAL, очереди диска, checkpoint/compaction, блокировки, репликационные подтверждения и лимиты. Сопоставить момент скачка с размером batch, ростом данных и изменениями конфигурации.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

54. (L3 [P]) Как оптимизировать heavy write workload?

    **Ответ:** Группировать записи в разумные batches, сократить лишние индексы, распределить ключи и обеспечить запас I/O. Менять durability только при явно допустимом RPO, а не как скрытую оптимизацию.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)


---

55. (L4 [S]) Как выбрать архитектуру хранения для миллиарда пользователей?

    **Ответ:** Оценить активных пользователей, QPS, размеры и retention; выделить транзакционный источник истины, объектное хранилище и аналитические проекции. Шардировать по локальности запросов, спланировать реплики, backup/restore и rebalance.

    **Типичная ошибка:** Само число зарегистрированных пользователей не определяет архитектуру.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

56. (L4 [S]) Когда использовать multi-leader replication?

    **Ответ:** Когда нескольким регионам нужна локальная запись либо поддержка offline, а конфликты можно детектировать и разрешать. Для уникальности, баланса и других глобальных инвариантов нужна дополнительная координация.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

57. (L4 [S]) Когда использовать leaderless (Dynamo-style) системы?

    **Ответ:** Для ключевых операций с допустимыми версиями/конфликтами и высокой доступностью при отказах. Настроить R/W/N, repair и разрешение конфликтов; пересечение quorum само по себе не доказывает linearizability.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

58. (L4 [S]) Как минимизировать cross-shard запросы?

    **Ответ:** Размещать связанные данные по tenant/user/aggregate, денормализовать нужные представления и выполнять аналитику отдельно. Глобальные запросы делать явными, с ограничением fan-out.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

59. (L4 [S]) Как проектировать глобально распределённую БД?

    **Ответ:** Определить home region данных, модель согласованности и последствия partition. Выбрать синхронный консенсус для критичных записей или асинхронную репликацию с конфликтами; учесть residency, RPO/RTO и failover.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

60. (L4 [S]) Как обеспечить low-latency доступ к данным по всему миру?

    **Ответ:** Реплицировать разрешённые данные ближе к читателям, применять региональные кэши и маршрутизацию. Для строго свежих чтений учитывать расположение лидера и межрегиональный RTT.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

61. (L4 [S]) Как балансировать consistency vs latency?

    **Ответ:** По каждой операции определить инвариант и допустимую устарелость. Строгие операции платят координацией, некритичные проекции можно обновлять асинхронно; измерять latency и lag отдельно.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

62. (L4 [S]) Как проектировать storage под high-write систему (логирование, метрики)?

    **Ответ:** Использовать последовательный ingestion, batches, партиции по времени и дополнительному распределителю, сжатие и retention. Отделить журнал приёма от индексов аналитического чтения и спланировать compaction.

    **Источник:** [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview); [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

63. (L4 [S]) Как проектировать storage под OLAP vs OLTP?

    **Ответ:** OLTP оптимизируется под короткие транзакции и точечные изменения, OLAP — под сканирование и агрегации больших массивов. Передавать изменения через CDC/ETL в отдельное аналитическое представление.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [ClickHouse: OLAP and column-oriented storage](https://clickhouse.com/docs/get-started/about/intro)

64. (L4 [S]) Как выбрать между B-Tree и LSM на уровне всей системы?

    **Ответ:** Сравнить профиль записи/чтения, диапазоны, объём индексов, compaction и устойчивую p99 на заполненном диске. Решение принимают по end-to-end нагрузке и эксплуатационным ограничениям, а не по одному benchmark вставки.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)
