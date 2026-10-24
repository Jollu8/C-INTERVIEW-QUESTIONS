# System Design & C/C++ & Linux Interview Questions

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

# 🧠 1. Базовые принципы распределённых систем

1. (L1 [T]) Что такое CAP theorem?

   **Ответ:** При сетевом разделении нельзя одновременно гарантировать linearizability и ответ каждому запросу к неотказавшему узлу. Выбор C/A относится к поведению во время partition, а не к произвольным «двум из трёх».

   **Типичная ошибка:** Считать partition tolerance выключаемой опцией реальной распределённой сети.

   **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)

2. (L1 [T]) Что означает consistency в распределённых системах?

   **Ответ:** Модель согласованности задаёт допустимые результаты и порядок наблюдения операций. Linearizable, sequential, causal и eventual описывают разные гарантии; это не ACID-инварианты.

   **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency)

3. (L1 [T]) Что означает availability?

   **Ответ:** В CAP — каждый запрос к неотказавшему узлу получает ответ по правилам модели; ошибка вместо необходимого результата не решает противоречие. Пользовательская доступность по latency SLO — отдельная инженерная метрика.

   **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

4. (L1 [T]) Что такое partition tolerance?

   **Ответ:** Способность системы продолжать работать согласно выбранным гарантиям при потере сообщений/связи между группами узлов. Во время разделения приходится ограничить доступность или ослабить согласованность.

   **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)

5. (L1 [T]) Что такое latency?

   **Ответ:** Время между определёнными началом и завершением операции. Различают сетевой RTT, обработку и end-to-end latency; хвостовые процентили важнее одного среднего для многих сервисов.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

6. (L1 [T]) Что такое throughput?

   **Ответ:** Количество завершённой полезной работы за единицу времени: запросов/с, сообщений/с, байт/с. Измерять вместе с ошибками и latency, иначе рост входного потока маскирует перегрузку.

   **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

7. (L1 [T]) Что такое idempotency?

   **Ответ:** Повтор операции имеет тот же задуманный эффект, что однократное выполнение. Ответ может отличаться; сетевой POST не является идемпотентным автоматически.

   **Пример:** Повтор создания заказа с тем же idempotency key возвращает прежний заказ.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

8. (L1 [T]) Что такое fault tolerance?

   **Ответ:** Сохранение требуемой функции при предусмотренных отказах компонентов. Нужны избыточность, изоляция, обнаружение и проверенное восстановление, а не только дополнительные узлы.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

9. (L1 [T]) Что такое horizontal scaling?

   **Ответ:** Добавление узлов и распределение нагрузки/данных между ними. Эффект ограничен общей БД, последовательной работой и коммуникацией.

   **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

10. (L1 [T]) Что такое vertical scaling?

    **Ответ:** Увеличение ресурсов одного узла: CPU, памяти, I/O и сети. Имеет предел аппаратной конфигурации и требует оценки доступности при изменении.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


11. (L2 [T]) В чём разница между strong consistency и eventual consistency?

    **Ответ:** Под strong часто понимают linearizability: чтение отражает завершённые записи в порядке реального времени. Eventual допускает временное расхождение и обещает сходимость при прекращении обновлений и восстановлении обмена.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency)

12. (L2 [T]) Когда выбирают AP систему вместо CP?

    **Ответ:** Когда операция должна оставаться доступной при partition, а конфликты и устаревшие значения допустимы и разрешимы. Решение принимают по операциям, а не назначают один ярлык всей системе.

    **Пример:** Лента рекомендаций допускает задержку, списание денег требует защиты инварианта.

    **Источник:** [Gilbert, Lynch: Perspectives on CAP](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

13. (L2 [P]) Как реализовать idempotent API?

    **Ответ:** Принять ключ операции с fingerprint запроса, атомарно связать его с эффектом и сохранить результат. Повтор с тем же ключом возвращает сохранённый исход, с другим payload — отклоняется; concurrent запросы сериализуются.

    **Пример:** UNIQUE(client_id, idempotency_key) защищает одновременное создание одного заказа.

    **Рекомендация:** Задать окно хранения ключей не короче возможного окна повторов.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

14. (L2 [T]) Что такое quorum?

    **Ответ:** Набор участников, достаточный для принятия решения. В консенсусе обычно большинство; в leaderless модели задают R/W/N и пересечения. Пересечение само по себе не доказывает linearizability.

    **Пример:** При N=3 большинство — 2.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

15. (L2 [P]) Как уменьшить latency в распределённой системе?

    **Ответ:** Измерить critical path, очереди и сетевые RTT; сократить fan-out/hops, переиспользовать соединения и приблизить данные. Кэш и параллелизм применять с учётом свежести и нагрузки.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

16. (L2 [P]) Как увеличить throughput?

    **Ответ:** Найти насыщенный ресурс, затем оптимизировать запросы/алгоритм, batches и распараллеливание. Сохранять ограниченные очереди и проверять throughput при целевых p99 и доле ошибок.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

17. (L2 [T]) Что такое causal consistency?

    **Ответ:** Причинно связанные операции наблюдаются в причинном порядке; независимые могут иметь разный порядок на разных узлах. Не гарантирует единого глобального real-time порядка.

    **Пример:** Ответ на сообщение не должен появляться раньше исходного сообщения.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency)


18. (L3 [D]) Как диагностировать split-brain?

    **Ответ:** Сопоставить одновременно активных лидеров, terms/epochs, membership и историю записей. Проверить partition, lease и fencing; при восстановлении не сливать конфликтующие журналы вслепую.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)

19. (L3 [T]) Как работают distributed locks?

    **Ответ:** Участник получает право работать с ресурсом через согласованный сервис координации, часто с lease. Потерявший lease процесс может продолжить работу, поэтому ресурс должен проверять монотонный fencing token.

    **Типичная ошибка:** Полагаться только на TTL блокировки без защиты от «ожившего» старого владельца.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf)

20. (L3 [P]) Как реализовать retry с exponential backoff?

    **Ответ:** Пауза перед попыткой n: random(0, min(cap, base×2^n)); ограничить attempts и общий deadline. Повторять лишь временные ошибки и безопасные операции, учитывать Retry-After.

    **Пример:** base=100 мс, cap=2 с; full jitter распределяет клиентов по времени.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

21. (L3 [T]) Как clock skew влияет на систему?

    **Ответ:** Смещение часов и скачки wall clock искажают timestamps, TTL, leases и порядок событий. Для локальных интервалов использовать monotonic clock, для распределённого порядка — версии/логические часы или согласованный протокол.

    **Типичная ошибка:** Считать NTP гарантией строгого глобального порядка.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [Jepsen: Consistency models](https://jepsen.io/consistency)

22. (L3 [D]) Почему система теряет consistency?

    **Ответ:** Сначала определить нарушенный инвариант и собрать историю операций. Проверить stale replica reads, lost updates, split-brain, weak isolation и конфликты multi-writer; сравнить с обещанной моделью.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)


23. (L4 [S]) Как выбрать consistency model для банковской системы?

    **Ответ:** Разделить операции: ledger и переводы защищать транзакциями с подходящей изоляцией, уникальными operation IDs и аудитом; витрины/уведомления обновлять асинхронно. Serializable и real-time freshness — разные свойства, их задают явно.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Jepsen: Consistency models](https://jepsen.io/consistency); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

24. (L4 [S]) Как спроектировать geo-distributed систему?

    **Ответ:** Определить SLO, data residency, home region, RPO/RTO и partition policy. Строгие данные координировать через quorum, допустимые проекции реплицировать асинхронно; проверить отказ региона и запас capacity.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Raft paper](https://raft.github.io/raft.pdf)

25. (L4 [S]) Когда допустима eventual consistency?

    **Ответ:** Когда продукт принимает временную устарелость, конфликты разрешимы и критичные инварианты защищены отдельно. Нужны repair/reconciliation, измерение lag и определённое поведение read-your-writes.

    **Пример:** Счётчик просмотров, поиск и рекомендации часто допускают задержку.

    **Источник:** [Jepsen: Consistency models](https://jepsen.io/consistency); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


---

# 🗄️ 2. Хранение данных

26. (L1 [T]) Что такое SQL?

    **Ответ:** SQL — декларативный язык определения, запроса и изменения данных, обычно реляционных. Стандарт SQL и поддерживаемые расширения различаются у СУБД.

    **Пример:** SELECT id FROM users WHERE active = true;

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

27. (L1 [T]) Что такое NoSQL?

    **Ответ:** SQL — язык работы с данными, обычно в реляционной модели; NoSQL объединяет документные, key-value, графовые и другие модели. Транзакции и масштабирование зависят от конкретной СУБД.

    **Типичная ошибка:** Считать, что NoSQL всегда лишён схемы и транзакций.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/)

28. (L1 [T]) Что такое индекс?

    **Ответ:** Дополнительная структура для ускорения поиска, сортировки или проверки уникальности. Занимает место и увеличивает стоимость записи.

    **Пример:** Индекс по user_id ускоряет выборку заказов пользователя.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

29. (L1 [T]) Что такое primary key?

    **Ответ:** Primary key однозначно идентифицирует строку: значения уникальны и не NULL. Может быть составным; физический порядок хранения зависит от СУБД.

    **Пример:** PRIMARY KEY (tenant_id, order_id).

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

30. (L1 [T]) Что такое replication?

    **Ответ:** Поддержание копий данных на нескольких узлах. Репликация бывает синхронной и асинхронной; помогает доступности и чтению, но не заменяет резервные копии.

    **Типичная ошибка:** Удаление данных может реплицироваться на все узлы.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

31. (L1 [T]) Что такое sharding?

    **Ответ:** Часть горизонтально разделённого набора данных, закреплённая за узлом или группой реплик. Shard — часть данных, replica — копия.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)


32. (L2 [T]) В чём разница между B-Tree и LSM Tree?

    **Ответ:** B-tree обновляет страницы дерева и удобен для точечных/диапазонных чтений; LSM буферизует запись и объединяет отсортированные файлы. LSM платит compaction и amplification, B-tree — своими затратами случайных изменений страниц.

    **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [RocksDB: Overview](https://github.com/facebook/rocksdb/wiki/RocksDB-Overview)

33. (L2 [P]) Как выбрать тип базы данных?

    **Ответ:** Зафиксировать инварианты, запросы, объёмы, RPO/RTO и навыки команды; сравнить кандидатов на реалистичных данных и отказах. Проверить миграции и стоимость сопровождения.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

34. (L2 [T]) Что такое leader-follower replication?

    **Ответ:** Лидер принимает изменения и передаёт их followers. Followers обслуживают разрешённые чтения и могут участвовать в failover; свежесть зависит от режима репликации.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

35. (L2 [P]) Как работает sharding?

    **Ответ:** Выбрать ключ из основных запросов, оценить кардинальность, перекос, рост и межшардовые транзакции. Заранее определить маршрутизацию и процедуру split/move.

    **Типичная ошибка:** Шардировать только по времени при монотонном потоке записей.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

36. (L2 [T]) Что такое ACID?

    **Ответ:** Atomicity, Consistency, Isolation, Durability — свойства транзакций: целостное применение, сохранение инвариантов, изоляция и сохранность подтверждённых результатов.

    **Типичная ошибка:** Путать ACID consistency с согласованностью реплик CAP.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

37. (L2 [T]) Что такое BASE?

    **Ответ:** Basically Available, Soft state, Eventual consistency — подход, допускающий временное расхождение ради доступности. Это не строгая спецификация транзакций и не синоним любой NoSQL БД.

    **Источник:** [Pritchett: BASE, an ACID Alternative](https://queue.acm.org/detail.cfm?id=1394128)


38. (L3 [D]) Почему запрос внезапно стал медленным?

    **Ответ:** Сравнить планы до/после, оценки строк, статистику и BUFFERS. Новый индекс может привести к неудачному плану; на записи он добавляет работу, а создание может конкурировать за I/O.

    **Типичная ошибка:** Удалять индекс без сравнения плана и профиля нагрузки.

    **Источник:** [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

39. (L3 [T]) Как работает MVCC?

    **Ответ:** MVCC хранит версии строк; снимок и правила изоляции определяют видимую версию. Старые версии очищаются после исчезновения потребности в них; долгие транзакции мешают очистке.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

40. (L3 [P]) Как мигрировать данные без даунтайма?

    **Ответ:** Использовать expand–migrate–contract: совместимая схема, backfill малыми партиями, перенос изменений через CDC/outbox, сверка, переключение чтений и лишь затем удаление старого. Предусмотреть rollback и ограничение нагрузки.

    **Типичная ошибка:** Считать две независимые записи в старое и новое хранилище атомарными.

    **Источник:** [PostgreSQL: Documentation](https://www.postgresql.org/docs/current/); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

41. (L3 [D]) Как обнаружить hot shard?

    **Ответ:** Сравнить QPS, объём, p99, CPU, I/O и очереди по shard и по ключам. Отличить один горячий ключ от неравномерного распределения множества ключей.

    **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

42. (L3 [P]) Как реализовать consistent hashing?

    **Ответ:** Хэшировать виртуальные узлы и ключи в одно упорядоченное пространство, выбрать первый токен по часовой стрелке с обходом конца. Хранить версию карты и план переноса; для реплик выбирать разные физические узлы.

    **Пример:** Для токенов [20, 60, 90] ключ 61 назначается владельцу 90.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)


43. (L4 [S]) Как спроектировать storage для миллиарда пользователей?

    **Ответ:** Оценить активных пользователей, QPS, размеры и retention; выделить транзакционный источник истины, объектное хранилище и аналитические проекции. Шардировать по локальности запросов, спланировать реплики, backup/restore и rebalance.

    **Типичная ошибка:** Само число зарегистрированных пользователей не определяет архитектуру.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

44. (L4 [S]) Когда использовать multi-leader replication?

    **Ответ:** Когда нескольким регионам нужна локальная запись либо поддержка offline, а конфликты можно детектировать и разрешать. Для уникальности, баланса и других глобальных инвариантов нужна дополнительная координация.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)

45. (L4 [S]) Как минимизировать cross-shard запросы?

    **Ответ:** Размещать связанные данные по tenant/user/aggregate, денормализовать нужные представления и выполнять аналитику отдельно. Глобальные запросы делать явными, с ограничением fan-out.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)


---

# 🐧 3. Linux internals

46. (L1 [T]) Что такое процесс?

    **Ответ:** Экземпляр выполняющейся программы с адресным пространством, ресурсами и одним или несколькими потоками. PID идентифицирует процесс в пределах соответствующего namespace.

    **Источник:** [Linux man-pages: credentials and process attributes](https://man7.org/linux/man-pages/man7/credentials.7.html)

47. (L1 [T]) Что такое поток?

    **Ответ:** Поток исполнения внутри процесса со своим стеком и регистровым состоянием; разделяет адресное пространство и многие ресурсы с другими потоками процесса.

    **Источник:** [Linux man-pages: pthreads](https://man7.org/linux/man-pages/man7/pthreads.7.html)

48. (L1 [T]) Что такое syscall?

    **Ответ:** Вход из userspace в ядро для привилегированной операции через заданный ABI. Обёртка libc не всегда равна одному syscall, а некоторые функции обслуживаются через vDSO.

    **Пример:** read, write, mmap.

    **Источник:** [Linux man-pages: syscalls](https://man7.org/linux/man-pages/man2/syscalls.2.html)

49. (L1 [T]) Что такое file descriptor?

    **Ответ:** Небольшое целое, индекс в таблице открытых ресурсов процесса. FD ссылается на open file description; dup/fork могут разделять позицию файла.

    **Типичная ошибка:** Путать номер fd с устойчивым идентификатором файла.

    **Источник:** [Linux man-pages: open](https://man7.org/linux/man-pages/man2/open.2.html)

50. (L1 [T]) Что такое virtual memory?

    **Ответ:** Абстракция адресного пространства с отображением виртуальных страниц на физические страницы/файлы. Позволяет изоляцию и совместное использование; виртуальный объём не равен RSS.

    **Источник:** [Linux kernel: Memory management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)


51. (L2 [P]) Как работает fork()?

    **Ответ:** Создаёт дочерний процесс; в родителе возвращает PID ребёнка, в ребёнке 0, при ошибке −1. Память обычно copy-on-write, FD наследуются; после fork многопоточного процесса до exec безопасны только async-signal-safe операции.

    **Типичная ошибка:** Повторно flush одинаковых stdio buffers в обоих процессах.

    **Источник:** [Linux man-pages: fork](https://man7.org/linux/man-pages/man2/fork.2.html)

52. (L2 [T]) Что такое context switch?

    **Ответ:** Сохранение состояния исполняемой задачи и восстановление другой при передаче CPU. Цена включает scheduler work и потенциальную потерю locality кэшей/TLB; переход в kernel mode сам по себе не обязательно переключает задачу.

    **Источник:** [Linux kernel: EEVDF scheduler](https://docs.kernel.org/scheduler/sched-eevdf.html)

53. (L2 [P]) Как работает mmap()?

    **Ответ:** Создаёт отображение файла либо anonymous memory в адресном пространстве. Проверять MAP_FAILED, размер/защиту и различие MAP_SHARED/MAP_PRIVATE; доступ может вызвать page fault.

    **Пример:** mmap(nullptr, length, PROT_READ, MAP_PRIVATE, fd, 0) отображает файл для чтения.

    **Источник:** [Linux man-pages: mmap](https://man7.org/linux/man-pages/man2/mmap.2.html)

54. (L2 [T]) Что такое page fault?

    **Ответ:** Исключение при доступе к странице, для которой нужно установить/изменить отображение либо проверить права. Minor fault не требует чтения с диска, major обычно требует I/O; недопустимый доступ может завершиться SIGSEGV.

    **Источник:** [Linux kernel: Memory management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)

55. (L2 [T]) Что такое copy-on-write?

    **Ответ:** Совместное использование страниц до первой записи; при записи создаётся отдельная копия. После fork это экономит память, но объём приватных страниц растёт при изменениях.

    **Источник:** [Linux man-pages: fork](https://man7.org/linux/man-pages/man2/fork.2.html); [Linux kernel: Memory management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)


56. (L3 [D]) Почему процесс потребляет 100% CPU?

    **Ответ:** Найти горячие threads и stacks через top -H/perf, разделить user/system и полезную работу от spin/retry loop. Проверить контейнерную CPU quota и единицу измерения: 100% часто означает одно ядро.

    **Источник:** [Linux perf: perf record](https://man7.org/linux/man-pages/man1/perf-record.1.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

57. (L3 [D]) Как найти memory leak?

    **Ответ:** Сначала подтвердить растущий live heap, а не кэш/fragmentation/RSS; сравнить heap snapshots и allocation stacks. Для C/C++ использовать LeakSanitizer в воспроизводимом сценарии и проверить жизненный цикл владельцев.

    **Источник:** [Clang: LeakSanitizer](https://clang.llvm.org/docs/LeakSanitizer.html); [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)

58. (L3 [P]) Как работает scheduler?

    **Ответ:** Планировщик выбирает runnable задачи с учётом scheduling class, приоритета и fairness/deadlines. В современных ядрах Linux fair scheduling развивается от CFS к EEVDF; поведение зависит от версии, CPU affinity и cgroups.

    **Типичная ошибка:** Описывать все версии Linux как неизменно использующие только классический CFS.

    **Источник:** [Linux kernel: EEVDF scheduler](https://docs.kernel.org/scheduler/sched-eevdf.html)

59. (L3 [T]) Что такое NUMA?

    **Ответ:** Non-Uniform Memory Access: CPU быстрее обращается к локально подключённой памяти, чем к памяти другого NUMA-узла. Важны размещение потоков и first-touch allocation.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

60. (L3 [D]) Как анализировать OOM killer?

    **Ответ:** Изучить kernel/journal сообщения, victim, memory pressure, swap и ограничения cgroup. Сопоставить memory.current/max/events и состав RSS; причина может быть лимитом контейнера, а не исчерпанием всей RAM.

    **Типичная ошибка:** Увеличивать лимит до выяснения роста памяти и working set.

    **Источник:** [Linux kernel: cgroup v2 memory controller](https://docs.kernel.org/admin-guide/cgroup-v2.html#memory)


61. (L4 [S]) Как тюнить Linux под high-load?

    **Ответ:** Измерить bottleneck через CPU/I/O/network/queues, затем менять конкретный лимит с baseline и rollback. Проверять tail latency, ресурсы cgroup, IRQ и пулы; универсального набора sysctl для high-load нет.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

62. (L4 [S]) Как оптимизировать NUMA workload?

    **Ответ:** Размещать worker и его данные на одном NUMA node, контролировать affinity и memory policy. Для общего набора сравнить interleave с локализацией, проверить remote accesses и баланс нагрузки.

    **Источник:** [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)

63. (L4 [S]) Когда использовать huge pages?

    **Ответ:** Когда большой рабочий набор страдает от TLB misses и экономия подтверждена измерениями. Учесть резервирование, внутреннюю фрагментацию и особенности THP/HugeTLB; большие страницы не исправляют плохую locality.

    **Источник:** [Linux kernel: HugeTLB pages](https://docs.kernel.org/admin-guide/mm/hugetlbpage.html); [Linux kernel: NUMA memory policy](https://docs.kernel.org/admin-guide/mm/numa_memory_policy.html)


---

# 🌐 4. Networking

64. (L1 [T]) Что такое TCP?

    **Ответ:** Надёжный упорядоченный поток байтов поверх IP с контролем потока и перегрузки. Не сохраняет границы сообщений приложения и не гарантирует, что peer обработал принятые данные.

    **Типичная ошибка:** Считать один recv одним сообщением.

    **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html)

65. (L1 [T]) Что такое UDP?

    **Ответ:** Протокол датаграмм без встроенной гарантии доставки, порядка и повторной передачи. Приложение само определяет обработку потерь и congestion control.

    **Источник:** [RFC 768: UDP](https://www.rfc-editor.org/rfc/rfc768.html)

66. (L1 [T]) Что такое socket?

    **Ответ:** Endpoint сетевого взаимодействия, представленный API/дескриптором. Тип и семейство задают stream/datagram и адресацию.

    **Источник:** [Linux man-pages: socket](https://man7.org/linux/man-pages/man2/socket.2.html)

67. (L1 [T]) Что такое DNS?

    **Ответ:** Распределённая иерархическая система записей доменных имён с кэшированием по TTL. Разрешает не только IP-адреса: существуют MX, TXT, SRV и другие записи.

    **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)


68. (L2 [T]) Как работает TCP handshake?

    **Ответ:** Клиент посылает SYN, сервер отвечает SYN-ACK, клиент подтверждает ACK. Стороны синхронизируют sequence numbers; TLS при HTTPS — отдельный последующий протокол.

    **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html)

69. (L2 [P]) Как написать TCP сервер?

    **Ответ:** socket → bind → listen → accept, затем цикл read/write с framing и обработкой ошибок. Для конкурентных клиентов выбрать threads/event loop; учитывать partial I/O, EOF, EINTR/EAGAIN и лимиты.

    **Пример:** Сначала читать заголовок длины, затем ровно указанное допустимое число байтов.

    **Источник:** [Linux man-pages: socket](https://man7.org/linux/man-pages/man2/socket.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html)

70. (L2 [T]) Что такое epoll?

    **Ответ:** Linux API готовности множества FD: создать instance, зарегистрировать интерес и ждать events. В edge-triggered режиме nonblocking I/O обычно нужно вычитывать/записывать до EAGAIN.

    **Типичная ошибка:** Считать readiness гарантией, что следующее I/O не вернёт EAGAIN.

    **Источник:** [Linux man-pages: epoll](https://man7.org/linux/man-pages/man7/epoll.7.html)

71. (L2 [T]) Что такое keep-alive?

    **Ответ:** TCP keepalive — опциональные пробы простаивающего соединения, HTTP keep-alive — reuse для нескольких запросов. Настройки и назначение различаются; прикладной heartbeat может давать более точный сигнал.

    **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)


72. (L3 [D]) Почему connection reset by peer?

    **Ответ:** Соединение было сброшено RST другой стороной или промежуточным устройством. Сопоставить packet capture, server/LB logs, idle timeout и момент закрытия; не считать это доказательством ошибки только удалённого приложения.

    **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html)

73. (L3 [D]) Как диагностировать packet loss?

    **Ответ:** Сопоставить end-to-end retransmits, NIC drops/errors, очереди и captures на обеих сторонах. Loss ответа промежуточного hop в mtr не доказывает потерю транзитного трафика из-за ICMP rate limiting.

    **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)

74. (L3 [P]) Как работает zero-copy (sendfile)?

    **Ответ:** Передаёт данные между поддерживаемыми FD без копирования payload через userspace. Нужно обрабатывать короткую отправку/ошибки, а наличие «zero-copy» не гарантирует отсутствие любых копий внутри kernel/hardware.

    **Источник:** [Linux man-pages: sendfile](https://man7.org/linux/man-pages/man2/sendfile.2.html)

75. (L3 [T]) Что такое congestion control?

    **Ответ:** Регулирование интенсивности отправки по состоянию сети, чтобы не перегружать маршрут. Отличается от flow control, защищающего приёмный буфер получателя.

    **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681.html)


76. (L4 [S]) Как оптимизировать сетевой стек?

    **Ответ:** Сначала измерить packets/bytes, RTT, loss, softirq, backlog и NIC queues. Затем проверять RSS/RPS, affinity, offload, буферы и connection reuse на конкретной нагрузке с rollback.

    **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293.html)

77. (L4 [S]) Когда использовать UDP вместо TCP?

    **Ответ:** Когда допустимы потери/устаревшие данные либо приложение реализует нужную надёжность и ordering. QUIC использует UDP, но сам добавляет надёжные streams и congestion control.

    **Пример:** Realtime медиа часто предпочитает своевременный пакет запоздалому retransmit.

    **Источник:** [RFC 768: UDP](https://www.rfc-editor.org/rfc/rfc768.html); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681.html)

78. (L4 [S]) Как проектировать high-load network service?

    **Ответ:** Nonblocking I/O или ограниченные worker pools, явный framing, deadlines, connection limits и backpressure. Проверять slow clients, bursts, TLS, partial I/O и graceful shutdown, а ёмкость считать по CPU, FD, памяти и сети.

    **Источник:** [Linux man-pages: epoll](https://man7.org/linux/man-pages/man7/epoll.7.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)


---

# 🧵 5. C++

79. (L1 [T]) Что такое RAII?

    **Ответ:** Resource Acquisition Is Initialization: владение ресурсом связано с временем жизни объекта, освобождение выполняет деструктор. Работает при normal scope exit и раскрутке исключения.

    **Пример:** std::lock_guard освобождает mutex при выходе из scope.

    **Источник:** [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)

80. (L1 [T]) Что такое указатель?

    **Ответ:** Значение, представляющее адрес объекта/функции либо null. Сырой указатель не задаёт владение и сам не обеспечивает время жизни адресата.

    **Типичная ошибка:** Разыменовывать dangling или null pointer.

    **Источник:** [C++ working draft: Pointers](https://eel.is/c++draft/basic.compound); [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)

81. (L1 [T]) Что такое ссылка?

    **Ответ:** Ссылка — привязка к объекту/функции, требующая корректного referent; после инициализации её нельзя перепривязать как pointer. Ссылки также могут стать dangling.

    **Типичная ошибка:** Считать ссылку гарантией бесконечного времени жизни объекта.

    **Источник:** [C++ working draft: References](https://eel.is/c++draft/dcl.ref)

82. (L1 [T]) Что такое стек и куча?

    **Ответ:** Практические названия областей для вызовов/автоматических объектов и динамических allocations. C++ формально определяет storage duration, а не обязательное физическое размещение каждого объекта на «стеке» или «куче».

    **Пример:** Локальный vector обычно имеет автоматическое время жизни, его буфер — динамическое.

    **Источник:** [C++ working draft: Storage duration](https://eel.is/c++draft/basic.stc)


83. (L2 [T]) Что такое move semantics?

    **Ответ:** Передача ресурсов из источника через move-конструктор/присваивание вместо копирования. Перемещённый объект остаётся допустимым в пределах контракта; конкретные члены не обязаны стать пустыми.

    **Источник:** [C++ working draft: forward/move helpers](https://eel.is/c++draft/forward); [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)

84. (L2 [P]) Как работает std::unique_ptr?

    **Ответ:** Владеет объектом единолично, вызывает deleter при уничтожении/reset, не копируется и может перемещаться. Передавать владение нужно явно, release передаёт ответственность вызывающему.

    **Пример:** auto p = std::make_unique<int>(42);

    **Источник:** [C++ working draft: unique_ptr](https://eel.is/c++draft/unique.ptr)

85. (L2 [T]) Что такое std::shared_ptr?

    **Ответ:** Совместное владение через control block; объект уничтожается после последнего strong owner. weak_ptr разрывает циклы; потокобезопасность счётчика не делает потокобезопасным сам объект.

    **Типичная ошибка:** Создавать два независимых shared_ptr из одного сырого указателя.

    **Источник:** [C++ working draft: shared_ptr](https://eel.is/c++draft/util.smartptr.shared)

86. (L2 [P]) Когда использовать std::move?

    **Ответ:** Когда текущий владелец готов отдать ресурс: std::move делает cast к xvalue и позволяет выбрать move overload. Сам std::move ничего не перемещает; для const объекта может получиться копирование.

    **Пример:** auto q = std::move(p); передаёт unique_ptr.

    **Рекомендация:** Не писать return std::move(local) без причины: можно мешать NRVO.

    **Источник:** [C++ working draft: forward/move helpers](https://eel.is/c++draft/forward)


87. (L3 [D]) Что такое undefined behavior?

    **Ответ:** Поведение, для которого стандарт не предъявляет требований. Не обязано приводить к crash; оптимизатор исходит из того, что UB в корректном исполнении отсутствует.

    **Пример:** Выход за границы массива, use-after-free и data race.

    **Источник:** [C++ working draft: Definitions](https://eel.is/c++draft/defns.undefined)

88. (L3 [P]) Как работает custom allocator?

    **Ответ:** Allocator предоставляет выделение/освобождение storage по контракту контейнера, с нужным alignment и равенством/propagation. Пулы и arena уменьшают overhead, но нужно согласовать lifetime и потокобезопасность.

    **Пример:** std::pmr::monotonic_buffer_resource удобен для набора объектов с общим временем жизни.

    **Источник:** [C++ working draft: Allocator requirements](https://eel.is/c++draft/allocator.requirements)

89. (L3 [T]) Что такое memory alignment?

    **Ответ:** Требование к адресам размещения объектов, обычно кратность заданному выравниванию. Получение достаточного числа байтов без нужного alignment недостаточно; over-aligned типы требуют подходящего allocation.

    **Пример:** alignas(64) задаёт повышенное выравнивание объекта.

    **Источник:** [C++ working draft: Alignment](https://eel.is/c++draft/basic.align)

90. (L3 [D]) Как найти use-after-free?

    **Ответ:** Собрать reproducer с AddressSanitizer и debug symbols, получить allocation/free/use stacks. Исправлять модель владения и отмену callbacks, а не только обнулять один из aliases.

    **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)


91. (L4 [S]) Как проектировать low-latency C++ систему?

    **Ответ:** Зафиксировать latency budget и распределение нагрузки; минимизировать непредсказуемые allocations, locks, page faults и fan-out на critical path. Проверять p99/p99.9 под пиками, а не только среднее в microbenchmark.

    **Источник:** [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)

92. (L4 [S]) Как минимизировать аллокации?

    **Ответ:** Переиспользовать buffers, reserve известную ёмкость, использовать pools/arenas и компактное представление данных. Измерять alloc rate и live memory; чрезмерное резервирование повышает footprint и cache misses.

    **Источник:** [C++ working draft: Allocator requirements](https://eel.is/c++draft/allocator.requirements); [C++ Core Guidelines: Resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)


---

# 🔀 6. Concurrency

93. (L1 [T]) Что такое mutex?

    **Ответ:** Примитив взаимного исключения для защиты общего инварианта. Захват/освобождение создают синхронизацию; все обращения к защищённому состоянию должны следовать одному протоколу.

    **Пример:** std::lock_guard<std::mutex> lock(m);

    **Источник:** [C++ working draft: Mutex requirements](https://eel.is/c++draft/thread.mutex.requirements)

94. (L1 [T]) Что такое race condition?

    **Ответ:** Ошибка, при которой результат зависит от взаимного порядка конкурентных событий. Data race — более узкое понятие языка: несинхронизированные конфликтующие обращения к памяти, хотя бы одно — запись.

    **Пример:** Проверить наличие файла и затем создать его — race даже без shared-memory data race.

    **Источник:** [C++ working draft: Data races](https://eel.is/c++draft/intro.races)


95. (L2 [P]) Как использовать std::thread?

    **Ответ:** Запустить callable, безопасно передать аргументы и обеспечить join/detach до уничтожения joinable thread. Предпочесть RAII lifecycle; std::jthread с C++20 автоматически join и поддерживает cooperative stop.

    **Типичная ошибка:** Уничтожать joinable std::thread: это вызывает std::terminate.

    **Источник:** [C++ working draft: thread](https://eel.is/c++draft/thread.thread)

96. (L2 [T]) Что такое deadlock?

    **Ответ:** Цикл ожидания ресурсов, при котором участники не могут продвинуться. Задавать единый порядок locks или применять std::scoped_lock, не выполнять неизвестные callbacks под lock.

    **Источник:** [C++ working draft: Mutex requirements](https://eel.is/c++draft/thread.mutex.requirements)

97. (L2 [T]) Что такое condition variable?

    **Ответ:** Позволяет ждать изменения предиката, атомарно отпуская mutex на время ожидания. После пробуждения mutex захвачен снова, предикат проверяется из-за spurious wakeups и конкуренции.

    **Пример:** `cv.wait(lock, [&]{ return ready || stopped; });`

    **Типичная ошибка:** Считать notify сохранённым событием без проверки состояния.

    **Источник:** [C++ working draft: Condition variables](https://eel.is/c++draft/thread.condition)


98. (L3 [D]) Как найти data race?

    **Ответ:** Запустить ThreadSanitizer на конкурентном сценарии, изучить обе stacks и синхронизацию. Ненайденная гонка не доказывает её отсутствия: покрытие и расписание конечны.

    **Источник:** [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html); [C++ working draft: Data races](https://eel.is/c++draft/intro.races)

99. (L3 [P]) Что такое lock-free структура?

    **Ответ:** Структура с гарантией системного прогресса: при конкуренции хотя бы одна операция завершается за конечное число шагов. Это не wait-free и не обязательно быстрее mutex; CAS-цикл требует доказательства и reclamation.

    **Источник:** [C++ working draft: Atomic operations](https://eel.is/c++draft/atomics.order); [C++ working draft: Data races](https://eel.is/c++draft/intro.races)

100. (L3 [T]) Что такое memory ordering?

     **Ответ:** Правила порядка и видимости операций между threads. Release/acquire связывают доступы через соответствующую atomic operation, relaxed сохраняет атомарность без такого порядка для остальных данных.

     **Пример:** Запись данных перед release-store становится видна после читающего её acquire-load.

     **Рекомендация:** Использовать volatile как замену atomic/synchronization.

     **Источник:** [C++ working draft: Atomic operations](https://eel.is/c++draft/atomics.order)


101. (L4 [S]) Когда использовать actor model?

     **Ответ:** Для независимых владельцев состояния, обменивающихся сообщениями: сессии, устройства, workflow. Нужны bounded mailboxes, supervision и определённый порядок; actors не устраняют бизнес-гонки между сообщениями.

     **Источник:** [Erlang: Processes](https://www.erlang.org/doc/system/ref_man_processes.html)

102. (L4 [S]) Как проектировать lock-free систему?

     **Ответ:** Выбирать lock-free только после подтверждения bottleneck, определить linearization points и progress guarantee. Решить ABA и memory reclamation через hazard pointers/epochs либо проверенную библиотеку, проверить sanitizer/stress/model tests.

     **Источник:** [C++ working draft: Atomic operations](https://eel.is/c++draft/atomics.order); [C++ working draft: Data races](https://eel.is/c++draft/intro.races)


---

# 🔍 7. Debugging & Performance

103. (L1 [T]) Что такое profiling?

     **Ответ:** Сбор измерений выполнения для определения затрат CPU, памяти, I/O или ожидания. Sampling уменьшает overhead, instrumentation даёт детали, но меняет исследуемое поведение.

     **Источник:** [Linux perf: perf record](https://man7.org/linux/man-pages/man1/perf-record.1.html); [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html)


104. (L2 [P]) Как использовать gdb?

     **Ответ:** Собрать binary с debug symbols, открыть gdb, поставить breakpoint, run, затем bt, info locals и print. Для оптимизированной сборки учитывать inlining/удалённые переменные и проверять соответствие symbols.

     **Пример:** gdb ./app; break main; run; bt.

     **Источник:** [GDB manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

105. (L2 [P]) Как читать stack trace?

     **Ответ:** Идти от текущего frame к callers, проверяя аргументы, причины ошибки и thread context. Stacks показывают место наблюдения, а не обязательно первопричину; нужны совпадающие binary/symbols.

     **Источник:** [GDB manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)


106. (L3 [D]) Как найти bottleneck?

     **Ответ:** Измерить пользовательский симптом, определить насыщенный ресурс и очередь через USE, затем профиль конкретного участка. Менять одну подтверждённую причину и повторять сопоставимый workload.

     **Источник:** [Brendan Gregg: USE Method](https://www.brendangregg.com/usemethod.html); [Linux perf: perf record](https://man7.org/linux/man-pages/man1/perf-record.1.html)

107. (L3 [D]) Как анализировать core dump?

     **Ответ:** Открыть core с точно соответствующим executable и библиотеками, изучить signal, все thread stacks и значения. Дамп может содержать секреты, а отсутствие core требует проверки limits, core_pattern и coredump handler.

     **Пример:** gdb ./app core; thread apply all bt full.

     **Источник:** [Linux man-pages: core](https://man7.org/linux/man-pages/man5/core.5.html); [GDB manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

108. (L3 [P]) Как использовать perf?

     **Ответ:** perf stat показывает аппаратные/системные счётчики, perf record собирает профиль, perf report — stacks и hot paths. Выбор call graph, права и kernel symbols влияют на качество результата.

     **Пример:** perf record -g -- ./app, затем perf report.

     **Источник:** [Linux perf: perf record](https://man7.org/linux/man-pages/man1/perf-record.1.html)


109. (L4 [S]) Как построить observability систему?

     **Ответ:** Определить пользовательские SLIs и SLO, внедрить metrics/logs/traces с единым контекстом, collectors, retention и алерты. Контролировать стоимость, кардинальность, доступы и потери telemetry.

     **Источник:** [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/); [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

110. (L4 [S]) Как внедрить distributed tracing?

     **Ответ:** Инструментировать входы, вызовы и очереди через SDK, передавать trace context, экспортировать spans через collector. Выбрать sampling и доверенные границы, проверить end-to-end trace включая асинхронный путь.

     **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/)


---

# 🧩 8. System Design кейсы

111. (L2 [S]) Спроектировать URL shortener

     **Ответ:** Начать с create/redirect/expire, QPS и срока хранения. Схема: API генерации → устойчивое mapping(code, URL, owner, expires_at) → redirect service с кэшем; уникальность code защищает БД, аналитику отправлять асинхронно.

     **Пример:** POST /links возвращает /aB7x, GET /aB7x отвечает Location.

     **Рекомендация:** Уточнить, можно ли менять цель: от этого зависит 301/302 и кэширование.

     **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

112. (L2 [S]) Спроектировать чат

     **Ответ:** Определить 1:1/группы, историю, offline и подтверждения. Клиент → WebSocket gateway → message service → durable log/store → доставка online; offline sync читает по cursor, event ID обеспечивает dedup.

     **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)


113. (L3 [S]) Спроектировать rate limiter

     **Ответ:** Выбрать identity, единицу стоимости и модель bucket/window; атомарно обновлять состояние и возвращать понятный отказ. Для глобального лимита определить квоты регионов, допускаемый overshoot и поведение при недоступности счётчика.

     **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [Raft paper](https://raft.github.io/raft.pdf)

114. (L3 [S]) Спроектировать лог-систему

     **Ответ:** Агенты собирают структурированные события в bounded durable buffer, затем broker/collector доставляет их в partitioned storage/index. Определить retention, redaction, tenant quotas и at-least-once replay с dedup.

     **Источник:** [OpenTelemetry Collector: Resiliency](https://opentelemetry.io/docs/collector/resiliency/); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)


115. (L4 [S]) Спроектировать HFT систему

     **Ответ:** Определить рыночные feeds, order gateway, risk checks и пределы задержки; критический путь делать предсказуемым с bounded queues, preallocation и контролируемым single-writer state. Нужны детерминированный журнал/replay, отказобезопасное управление ордерами и измерение хвостов.

     **Типичная ошибка:** Оптимизировать nanoseconds, не определив порядок событий, риск-лимиты и восстановление после disconnect.

     **Источник:** [LMAX: Architecture](https://lmax-exchange.github.io/disruptor/disruptor.html); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/)

116. (L4 [S]) Спроектировать distributed filesystem

     **Ответ:** Разделить metadata/namespace и data chunks, хранить реплики в разных failure domains. Определить consistency записи/append, lease/fencing, checksum, repair/rebalance и поведение клиента при отказе; metadata требует надёжной координации.

     **Источник:** [Google File System paper](https://research.google.com/archive/gfs.html); [Raft paper](https://raft.github.io/raft.pdf)
