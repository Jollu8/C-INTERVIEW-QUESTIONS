# ⚡ 5. Кэширование

Один из самых частых топиков.

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy


**Подтемы:**

* Cache aside / write-through / write-back
* TTL, eviction policies (LRU, LFU)
* Distributed cache (например Redis)

---

1. (L1 [T]) Что такое кэш?

   **Ответ:** Быстро доступная копия данных или результата вычисления, предназначенная для повторного использования. Для корректности нужны правила свежести, обновления и поведения при отсутствии записи.

   **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

2. (L1 [T]) Зачем нужен кэш?

   **Ответ:** Сокращает дорогие обращения и вычисления, снижает latency и нагрузку источника. Выигрыш зависит от повторяемости запросов и цены обслуживания самого кэша.

   **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

3. (L1 [T]) Что такое TTL?

   **Ответ:** Time To Live — срок пригодности записи согласно выбранной политике. Истечение не гарантирует мгновенное физическое освобождение памяти и не заменяет согласованную invalidation.

   **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

4. (L1 [T]) Что такое cache hit?

   **Ответ:** Пригодная для запроса запись найдена в кэше, источник не требуется. Hit rate нужно оценивать вместе с latency, объёмом данных и экономией backend работы.

   **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

5. (L1 [T]) Что такое cache miss?

   **Ответ:** Нужной пригодной записи нет: данные не загружены, истекли, удалены или вытеснены. Сервис обращается к источнику либо выполняет вычисление.

   **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

6. (L1 [T]) Что такое eviction?

   **Ответ:** Вытеснение записей по политике, обычно при ограничении памяти. Отличается от expiration по TTL и invalidation из-за изменения данных.

   **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

7. (L1 [T]) Что такое LRU?

   **Ответ:** Least Recently Used: вытеснение давно не использовавшихся записей. Реализации часто приближённые; большие последовательные сканы могут загрязнять кэш.

   **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

8. (L1 [T]) Что такое LFU?

   **Ответ:** Least Frequently Used: предпочтительно сохраняются часто читаемые записи. Частотные оценки обычно стареют, чтобы политика адаптировалась к новой нагрузке.

   **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

9. (L1 [T]) Что такое distributed cache?

   **Ответ:** Кэш, доступный нескольким процессам/узлам по сети, часто с partitioning и репликацией. Добавляет RTT, отказы и отдельные правила согласованности.

   **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

10. (L1 [T]) Где обычно располагается кэш в архитектуре?

    **Ответ:** В клиенте, CDN/proxy, памяти процесса или отдельном сетевом сервисе. Каждый уровень имеет собственный ключ, владельца и бюджет устаревания.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)


---

11. (L2 [T]) Что такое cache-aside (lazy loading)?

    **Ответ:** Приложение проверяет кэш; при miss читает источник и заполняет кэш. Записи обычно изменяют источник и затем инвалидируют соответствующую копию.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

12. (L2 [P]) Как реализовать cache-aside?

    **Ответ:** Выполнить get; на miss объединить одинаковые загрузки, прочитать БД и set с TTL. При записи сначала commit в БД, затем invalidation; учесть гонку старого reader и задержанную доставку invalidation.

    **Пример:** Reader может прочитать старое значение до commit и положить его в кэш после удаления.

    **Рекомендация:** Для строгой свежести нужны версии/координация либо обход кэша.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

13. (L2 [T]) Что такое write-through cache?

    **Ответ:** Запись проходит через слой кэша и синхронно сохраняется в источник перед успешным завершением. Два независимых хранилища не становятся атомарными без протокола восстановления.

    **Типичная ошибка:** Последовательные SET и UPDATE сами по себе не дают транзакцию.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

14. (L2 [T]) Что такое write-back cache?

    **Ответ:** Изменение сначала принимается кэшем, а источник обновляется позже. Нужны устойчивый журнал, replay и понятная гарантия при потере узла.

    **Типичная ошибка:** Использовать обычный volatile кэш как единственную копию подтверждённой записи.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

15. (L2 [T]) В чём разница между write-through и write-back?

    **Ответ:** Write-through ждёт сохранения в источник, повышая latency записи; write-back откладывает сохранение, снижая задержку ценой риска и сложности восстановления.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

16. (L2 [P]) Когда использовать cache-aside vs write-through?

    **Ответ:** Cache-aside проще для выборочного read-heavy кэширования; write-through полезен, когда важно сразу заполнять читаемые данные. Сравнить число лишних записей и поведение при отказе cache/store.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

17. (L2 [T]) Как выбрать TTL?

    **Ответ:** По допустимой устарелости, частоте обновления и нагрузке повторного заполнения. Добавить случайный разброс сроков и отдельно определить negative cache TTL.

    **Пример:** Если цена устаревшего статуса высока, использовать короткий TTL или не кэшировать эту операцию.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

18. (L2 [P]) Как подобрать eviction policy?

    **Ответ:** Измерить локальность и частоту доступа на трассе: LRU для недавнего рабочего набора, LFU для устойчиво популярных ключей. В Redis учесть разницу allkeys и volatile.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

19. (L2 [T]) Что такое cache invalidation?

    **Ответ:** Признание копии непригодной после изменения источника. Может быть удалением, сменой версии ключа или запретом выдачи старой версии.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

20. (L2 [P]) Как инвалидировать кэш при изменении данных?

    **Ответ:** После commit удалить точные ключи, передать invalidation через надёжный outbox/CDC и повторять безопасно. TTL ограничивает часть последствий, а версии помогают отбрасывать запоздалые обновления.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

21. (L2 [T]) Что такое distributed cache (например Redis)?

    **Ответ:** Сетевой сервис с операциями по ключам; Redis поддерживает структуры данных, expiration и атомарные команды. Cluster распределяет ключи по hash slots; режим репликации нужно учитывать отдельно.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

22. (L2 [P]) Как масштабировать кэш?

    **Ответ:** Измерить CPU/сеть/память и горячие ключи, затем shard или добавить разрешённые read replicas и L1. Рост числа узлов не устраняет нагрузку одного ключа.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

23. (L2 [T]) Что такое consistent hashing в кэше?

    **Ответ:** Стабильное назначение ключей узлам при изменении состава: переносится часть ключей. Redis Cluster использует фиксированные hash slots, а не классическое хэш-кольцо.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

24. (L2 [P]) Как распределить ключи по нодам кэша?

    **Ответ:** Выбрать маршрутизацию и единое версионированное представление владельцев: ring, rendezvous или hash slots. Клиенты должны корректно обрабатывать перенос и устаревшую карту.

    **Источник:** [Amazon Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

25. (L2 [T]) Что такое warmup кэша?

    **Ответ:** Предварительное заполнение востребованных записей до подачи полной нагрузки. Должно иметь лимит скорости, иначе прогрев перегрузит источник.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


---

26. (L3 [D]) Почему кэш не даёт ускорения?

    **Ответ:** Сравнить hit/miss latency, сериализацию, сеть и нагрузку БД. Низкий reuse, крупные объекты и дорогой сетевой hop могут полностью поглотить выигрыш.

    **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

27. (L3 [D]) Почему низкий cache hit rate?

    **Ответ:** Проверить TTL, eviction, состав cache key, размер рабочего набора, доступность узлов и частоту invalidation. Разбить статистику по маршрутам и размерам объектов.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

28. (L3 [D]) Как диагностировать cache stampede?

    **Ответ:** Искать одновременный рост miss и одинаковых запросов в БД на истечении популярных записей. Проверить cold start, массовый purge и распределение TTL.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

29. (L3 [P]) Как предотвратить cache stampede?

    **Ответ:** Singleflight/request coalescing, jitter TTL, soft TTL с фоновым refresh и ограничение параллельных загрузок. Блокировка на загрузку должна иметь срок и обработку отказа владельца.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

30. (L3 [D]) Почему появляется stale data?

    **Ответ:** Источник обновился, а invalidation потеряна, задержана или проиграла гонку старому reader; возможны также replication lag и несколько уровней кэша.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

31. (L3 [P]) Как бороться с устаревшими данными?

    **Ответ:** Определить допустимый возраст, применять версии, invalidation и ограниченный TTL; критичные чтения направлять к источнику истины. Stale-while-revalidate допустим только при согласованном продуктовом поведении.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

32. (L3 [T]) Что такое write amplification в кэше?

    **Ответ:** Одно логическое изменение порождает несколько физических записей: обновление копий, индексов, реплик и уровней кэша. Измерять объём и количество операций, включая invalidation и refresh.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

33. (L3 [D]) Почему кэш перегружен памятью?

    **Ответ:** Проверить рост числа ключей и размеров, отсутствие TTL, fragmentation и overhead структур. В Redis сравнить used_memory, RSS, MEMORY USAGE и eviction; RSS не равен полезным данным.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/); [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

34. (L3 [P]) Как оптимизировать memory usage кэша?

    **Ответ:** Удалить ненужные поля/ключи, выбрать компактный формат и TTL, ограничить кардинальность и размер значений. Учитывать цену компрессии и запас под репликационные/клиентские buffers.

    **Источник:** [Redis: Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)

35. (L3 [T]) Что такое hot key problem?

    **Ответ:** Один ключ получает непропорциональную долю запросов и перегружает обслуживающий его узел. Простое добавление shards не делит такой ключ автоматически.

    **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

36. (L3 [D]) Как обнаружить hot keys?

    **Ответ:** Сравнить QPS и latency узлов, использовать ограниченную выборку запросов и штатные hot-key средства, если доступны. Не запускать тяжёлый полный сбор в разгар инцидента.

    **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

37. (L3 [P]) Как распределить нагрузку от hot keys?

    **Ответ:** Для чтения — L1, реплики и coalescing; для агрегируемой записи — subkeys с последующим объединением. Разделение записи должно сохранять требуемые инварианты.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

38. (L3 [T]) Что такое dogpile effect?

    **Ответ:** Множество клиентов одновременно пересчитывает истёкшее значение; часто это другое название cache stampede. Приводит к скачку нагрузки и очередей источника.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

39. (L3 [P]) Как реализовать request coalescing?

    **Ответ:** Хранить на ключ одну in-flight загрузку, остальные ждут общий результат. После завершения удалять запись ожидания и распространять ошибки; ограничить число ожидающих и общий deadline.

    **Пример:** В одном процессе map<key, future>; между процессами требуется отдельная координация.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)


---

40. (L4 [S]) Где правильно размещать кэш (client, CDN, backend)?

    **Ответ:** Ставить ближе к потребителю там, где повторное использование оправдывает сложность. CDN для публичных объектов, L1 для горячих локальных данных, shared cache для общего набора.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

41. (L4 [S]) Когда кэш вреден?

    **Ответ:** При строгой свежести, малом reuse, больших уникальных объектах и дорогостоящей invalidation. Дополнительный слой способен увеличить latency и скрыть перегрузку источника до холодного старта.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

42. (L4 [S]) Как проектировать multi-layer caching?

    **Ответ:** У каждого уровня определить ключ, TTL, владельца invalidation и метрики hit/miss. Проверить суммарную устарелость и отказ уровней; не продлевать бесконтрольно возраст данных при копировании.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

43. (L4 [S]) Как балансировать consistency vs performance в кэше?

    **Ответ:** Для каждой операции задать максимальную устарелость и последствия неверного ответа. Платёжные инварианты проверять в транзакционном источнике, а некритичные представления можно кэшировать.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

44. (L4 [S]) Как проектировать distributed cache для high-load системы?

    **Ответ:** Распределить рабочий набор по shards, обработать hot keys, лимитировать клиенты и прогрев. Предусмотреть изоляцию tenants, отказ узла, rebalance и контролируемую нагрузку на БД при miss.

    **Источник:** [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

45. (L4 [S]) Как минимизировать cache invalidation complexity?

    **Ответ:** Кэшировать устойчивые агрегаты с явным владельцем, использовать версионированные ключи и небольшой набор зависимостей. Избегать множества производных представлений с неявными связями.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

46. (L4 [S]) Как проектировать кэш для write-heavy системы?

    **Ответ:** Кэшировать только читаемые проекции с достаточным reuse; частые изменения могут делать заполнение дороже выгоды. Write-back требует устойчивого журнала, ограниченной очереди и восстановления.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

47. (L4 [S]) Когда отказаться от кэша?

    **Ответ:** Когда измерения не показывают выигрыша либо цена устаревших данных и сопровождения превышает экономию. Перед удалением проверить, выдержит ли источник весь поток и пиковую нагрузку.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)
