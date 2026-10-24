# 🧩 11. Типовые system design кейсы

Это уже “прикладной слой”.

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

**Набор must-have:**

* URL shortener
* Chat system
* News feed
* Video streaming
* Ride sharing

---

## URL Shortener

1. (L1 [S]) Спроектировать URL shortener (базовый уровень)

   **Ответ:** Начать с create/redirect/expire, QPS и срока хранения. Схема: API генерации → устойчивое mapping(code, URL, owner, expires_at) → redirect service с кэшем; уникальность code защищает БД, аналитику отправлять асинхронно.

   **Пример:** POST /links возвращает /aB7x, GET /aB7x отвечает Location.

   **Рекомендация:** Уточнить, можно ли менять цель: от этого зависит 301/302 и кэширование.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

2. (L1 [T]) Какие требования к системе (read/write ratio)?

   **Ответ:** Уточнить средний/пиковый read и write QPS, длину URL, retention, число уникальных ссылок, SLO и возможность удаления. Read/write ratio не следует из названия продукта: его надо запросить или объявить допущением.

   **Пример:** При условных 10 тыс. redirect/с и 100 create/с отношение — 100:1.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

3. (L2 [T]) Как генерировать короткие ссылки?

   **Ответ:** Кодировать уникальный числовой ID в Base62 либо генерировать криптографически случайный короткий code. Последовательный ID легко перечислять, случайный требует проверки коллизии.

   **Пример:** При алфавите 62 длина 8 даёт 62^8 возможных кодов.

   **Рекомендация:** Случайный код не является самостоятельной проверкой доступа к приватному ресурсу.

   **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

4. (L2 [P]) Как избежать коллизий при генерации ID?

   **Ответ:** Создать UNIQUE(code), вставлять атомарно и повторять генерацию при конфликте. Для выделенных диапазонов ID нужна координация allocator; проверка SELECT перед INSERT не устраняет гонку.

   **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

5. (L2 [T]) Как хранить mapping short → long URL?

   **Ответ:** Хранить code как уникальный ключ и URL вместе с metadata в durable SQL/key-value store. Выбор shard по code обеспечивает точечные чтения; deletion и expiration должны распространяться в кэш.

   **Источник:** [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

6. (L2 [P]) Как реализовать redirect с минимальной latency?

   **Ответ:** Lookup по code в L1/shared cache, затем по индексу БД; вернуть подходящий redirect с Location. Reuse соединений, региональная locality и асинхронная аналитика сокращают критический путь.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

7. (L2 [T]) Нужно ли кеширование?

   **Ответ:** Если популярные ссылки многократно читаются и источник нуждается в разгрузке, кэш полезен. TTL/версия должны учитывать смену цели, удаление и блокировку вредоносных ссылок.

   **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

8. (L2 [P]) Как масштабировать read-heavy workload?

   **Ответ:** Статeless redirect replicas, кэш горячих ссылок, read replicas по допустимой свежести и partitioned mapping. Защитить origin/store при cold cache и предусмотреть negative caching для неизвестных code.

   **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

9. (L3 [D]) Почему редиректы стали медленными?

   **Ответ:** Разделить lookup, очередь, cache latency, DB и сеть. Проверить miss storm, hot code, lag, блокировки, отсутствие индекса и синхронную аналитику в критическом пути.

   **Источник:** [Redis: Latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/); [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

10. (L3 [P]) Как реализовать rate limiting?

    **Ответ:** Ограничивать создание по аккаунту/IP и стоимость проверки URL, redirect — по разумным защитным квотам. Общий публичный IP и легитимная популярность ссылки требуют аккуратной политики.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

11. (L3 [T]) Как бороться с abuse (spam ссылки)?

    **Ответ:** Проверять разрешённые схемы URL и репутацию, обрабатывать жалобы, блокировать вредоносные цели и ограничивать массовую генерацию. Если backend загружает URL для preview, отдельно защищать его от SSRF.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

12. (L4 [S]) Как проектировать глобальный URL shortener?

    **Ответ:** Региональные redirect frontends и кэши, глобально уникальные code и выбранная модель репликации mapping. Создание может иметь home region; чтения должны учитывать недавнюю запись, удаление и abuse block.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

13. (L4 [S]) Как обеспечить high availability?

    **Ответ:** Реплицировать mapping, frontend и routing по failure domains, иметь запас ёмкости и проверенный failover. Кэш не должен быть единственной копией, а свежая блокировка ссылки требует заданного срока распространения.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)


---

## Chat System

14. (L1 [S]) Спроектировать чат систему

    **Ответ:** Определить 1:1/группы, историю, offline и подтверждения. Клиент → WebSocket gateway → message service → durable log/store → доставка online; offline sync читает по cursor, event ID обеспечивает dedup.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

15. (L1 [T]) Какие типы сообщений существуют?

    **Ответ:** Текст, вложения, системные события, presence, typing и receipts. Разделить устойчивые пользовательские сообщения и эфемерные сигналы с разными гарантиями доставки.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

16. (L2 [T]) Как доставлять сообщения (push vs pull)?

    **Ответ:** Push по активному соединению уменьшает задержку, pull по cursor восстанавливает историю и подходит offline. Мобильный notification push — сигнал о новых данных, а не единственный источник сообщения.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

17. (L2 [P]) Как реализовать real-time messaging?

    **Ответ:** Аутентифицировать WebSocket, подтвердить приём после durable записи, отправить получателям и ждать нужного ack. Reconnect использует последний cursor, повторная отправка — client message ID.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

18. (L2 [T]) Как хранить сообщения?

    **Ответ:** Append-only сообщения по conversation_id и sequence, индекс/cursor для истории; вложения отдельно в object storage. Политики retention, удаления и доступа применяются к истории и копиям.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

19. (L2 [P]) Как обеспечить ordering сообщений?

    **Ответ:** Назначать монотонный sequence в пределах conversation у одного владельца или согласованного sequencer. Отображение по времени устройств не гарантирует порядок из-за clock skew.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Raft paper](https://raft.github.io/raft.pdf)

20. (L2 [T]) Как обрабатывать offline пользователей?

    **Ответ:** Сохранять сообщения устойчиво и позицию последнего подтверждения; после входа отдавать пропуски по cursor. Notifications не заменяют историю, а повторная доставка требует dedup.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

21. (L2 [P]) Как реализовать delivery status (sent/delivered/read)?

    **Ответ:** Sent — принято/сохранено сервером по контракту, delivered — подтверждено устройством, read — получен пользовательский read receipt. Хранить состояния монотонно; явно определить семантику нескольких устройств.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

22. (L3 [D]) Почему сообщения приходят с задержкой?

    **Ответ:** Проверить event age на ingestion, storage, queue и gateway, состояние соединения получателя и backpressure. Отделить серверную задержку от offline устройства и задержки notification provider.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html)

23. (L3 [D]) Почему нарушается порядок сообщений?

    **Ответ:** Несколько producers, разные partitions, повторная доставка, параллельные consumers и часы клиента. Сравнить event IDs/sequence по пути; сортировать и выявлять пропуски внутри объявленной области порядка.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

24. (L3 [P]) Как масштабировать chat сервер?

    **Ответ:** Разделить connection gateways и message storage/processing, shard conversations и распределять directory online-соединений. Планировать число соединений, heartbeat, fan-out и graceful drain независимо.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

25. (L3 [T]) Как реализовать fan-out?

    **Ответ:** Для небольшой группы разослать копии получателям, для крупных — публиковать в общий журнал/канал и иерархию подписчиков. Крупная группа не должна блокировать delivery остальных.

    **Источник:** [RabbitMQ: Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-python); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

26. (L4 [S]) Как проектировать чат на миллионы пользователей?

    **Ответ:** Региональные gateways, home shard разговора, durable сообщения и cursor-based sync. Изолировать большие группы, учитывать traffic bytes, присутствие, multidevice, retention и региональное восстановление.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

27. (L4 [S]) Как минимизировать latency доставки?

    **Ответ:** Сократить критический путь, удерживать соединения, выбирать близкий gateway и владельца разговора. Подтверждать после требуемой durability, а аналитику/необязательные уведомления вынести в фон.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)


---

## News Feed

28. (L1 [S]) Спроектировать news feed систему

    **Ответ:** Сервис posts хранит публикации, social graph — подписки, pipeline формирует candidate timeline, read path ранжирует и фильтрует доступ. Выбор push/pull зависит от размеров графа и активности.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

29. (L1 [T]) Что такое feed?

    **Ответ:** Упорядоченное представление публикаций, доступных пользователю по подпискам и правилам ranking. Это производная проекция, а не обязательно первичный источник публикаций.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/)

30. (L2 [T]) Push vs Pull модель (fan-out on write vs read)

    **Ответ:** Fan-out on write заранее добавляет ID поста в ленты подписчиков; fan-out on read собирает их при чтении. Гибрид уменьшает взрыв записи у знаменитостей и стоимость чтения обычных аккаунтов.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/)

31. (L2 [P]) Как формировать ленту пользователя?

    **Ответ:** Получить кандидатов из подписок/материализованной timeline, проверить доступ и удаление, ранжировать и выдать страницу с cursor. Избегать N+1 запросов и нестабильной offset pagination.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

32. (L2 [T]) Как хранить подписки (followers)?

    **Ответ:** Таблица/индекс рёбер follower_id → followee_id и обратное представление для fan-out. Шардирование и отдельный индекс определяются путями чтения; изменения подписок должны попадать в pipeline.

    **Источник:** [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

33. (L2 [P]) Как кешировать feed?

    **Ответ:** Кэшировать IDs страницы и разрешённые представления постов отдельно, включать контекст пользователя в персональный ключ. TTL/версия должны учитывать приватность, удаление и смену подписок.

    **Источник:** [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

34. (L3 [D]) Почему feed грузится медленно?

    **Ответ:** Разобрать candidate retrieval, graph fan-out, ranking, hydration и cache misses. Проверить хвостовые задержки, огромные подписки и N+1; ограничить набор кандидатов и деградировать ranking.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [Dean, Barroso: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/)

35. (L3 [D]) Как бороться с hot users (миллионы подписчиков)?

    **Ответ:** Не разносить каждый пост автора миллионам неактивных читателей синхронно. Хранить поток автора и объединять при чтении либо применять гибрид с отдельным budget fan-out.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/)

36. (L3 [P]) Как реализовать ranking алгоритм?

    **Ответ:** Начать с хронологии, затем score по признакам свежести, интереса и взаимодействий. Разделить retrieval/ranking, ограничить latency, оценивать offline/online качество и сохранять простой fallback.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/)

37. (L3 [T]) Как хранить timeline?

    **Ответ:** Хранить ограниченную упорядоченную последовательность post IDs со score/cursor и версией проекции. Сам текст поста хранить отдельно, чтобы удаление/редактирование не копировалось по всем timelines.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/); [PostgreSQL: Indexes](https://www.postgresql.org/docs/current/indexes.html)

38. (L4 [S]) Как проектировать feed для миллиарда пользователей?

    **Ответ:** Разделить social graph, posts, fan-out workers и serving по независимым partitions/регионам. Выбирать гибрид push/pull на основе степеней графа, обеспечить replay, privacy filtering и bounded storage.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

39. (L4 [S]) Как балансировать свежесть vs производительность?

    **Ответ:** Задать допустимый lag ленты, обновлять горячих пользователей чаще, фоновые проекции — batches. Измерять freshness вместе с latency/стоимостью и всегда применять актуальные запреты доступа.

    **Источник:** [Twitter: Timelines at scale](https://www.infoq.com/presentations/Twitter-Timeline-Scalability/); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


---

## Video Streaming

40. (L1 [S]) Спроектировать video streaming сервис

    **Ответ:** Upload → object storage → очередь transcoding → варианты качества/сегменты → manifests → CDN → player. Metadata/auth хранятся отдельно; измерять startup, rebuffering и качество воспроизведения.

    **Источник:** [AWS: Video on Demand architecture](https://docs.aws.amazon.com/solutions/latest/video-on-demand-on-aws/architecture-overview.html); [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html)

41. (L1 [T]) Какие типы контента (live vs VOD)?

    **Ответ:** VOD обрабатывает завершённый материал и допускает предварительный encode; live кодирует/упаковывает непрерывно и ограничен end-to-end задержкой. Различаются buffering, DVR и восстановление потока.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html)

42. (L2 [T]) Как хранить видео?

    **Ответ:** Оригиналы и renditions — в устойчивом object storage с checksum, lifecycle и replication; metadata и права — в БД. Не помещать большие видеофайлы в обычную таблицу без конкретной причины.

    **Источник:** [AWS: Video on Demand architecture](https://docs.aws.amazon.com/solutions/latest/video-on-demand-on-aws/architecture-overview.html)

43. (L2 [P]) Как доставлять видео пользователю?

    **Ответ:** Плеер получает manifest и загружает сегменты выбранного варианта через CDN с авторизованным доступом. Настройки caching должны учитывать срок прав и возможность sharing подписанного URL.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

44. (L2 [T]) Что такое chunking?

    **Ответ:** Деление медиа на небольшие сегменты для независимой загрузки, кэширования и смены bitrate. Границы и keyframes согласуют между вариантами, чтобы переключение оставалось корректным.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html)

45. (L2 [P]) Как работает adaptive bitrate streaming?

    **Ответ:** Плеер оценивает throughput, buffer и возможности устройства и выбирает rendition для следующего сегмента. Цель — избегать stalls и резких переключений, а не всегда максимальный bitrate.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html)

46. (L2 [T]) Зачем нужен CDN?

    **Ответ:** Снимает повторный трафик с origin и приближает сегменты к зрителям. Особенно важен при массовом просмотре одного контента и глобальной аудитории.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/); [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html)

47. (L3 [D]) Почему видео буферизуется?

    **Ответ:** Проверить network throughput/loss, cache misses, origin latency, выбранный bitrate, CPU декодера и buffer. Сопоставить player QoE с CDN/origin метриками по ISP и региону.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

48. (L3 [D]) Как диагностировать high latency streaming?

    **Ответ:** Измерить capture/encode/package, публикацию manifest, доставку и player buffer. Установить timestamp на стадиях; обычная HTTP latency не равна glass-to-glass задержке live.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

49. (L3 [P]) Как оптимизировать video delivery?

    **Ответ:** Настроить ladder и codecs по устройствам, reuse соединений, CDN hit rate и segment duration. Слишком маленькие сегменты увеличивают overhead, слишком большие — startup и latency.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

50. (L3 [T]) Что такое transcoding pipeline?

    **Ответ:** Асинхронная цепочка декодирования, создания variants, упаковки и публикации manifest. Задачи идемпотентны, исходник устойчив, готовый asset публикуется после проверки полноты.

    **Источник:** [AWS: Video on Demand architecture](https://docs.aws.amazon.com/solutions/latest/video-on-demand-on-aws/architecture-overview.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

51. (L4 [S]) Как проектировать глобальный video сервис?

    **Ответ:** Региональная загрузка и encode, устойчивые originals, CDN/при необходимости multi-CDN с QoE steering. Раздельно масштабировать control/data plane, учесть права, стоимость egress и failure domains.

    **Источник:** [AWS: Video on Demand architecture](https://docs.aws.amazon.com/solutions/latest/video-on-demand-on-aws/architecture-overview.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

52. (L4 [S]) Как масштабировать live streaming?

    **Ответ:** Стабильный live ingest, резервные encoders, упаковка и edge fan-out. Ёмкость считать по зрителям × bitrate, защищать origin shielding и проверять reconnect surge при отказе.

    **Источник:** [RFC 8216: HTTP Live Streaming](https://www.rfc-editor.org/rfc/rfc8216.html); [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)


---

## Ride Sharing

53. (L1 [S]) Спроектировать ride-sharing сервис

    **Ответ:** Сервисы rider/driver, location ingestion, geo search, matching, trip state и payments. Локации допускают краткую устарелость, назначение водителя требует атомарного перехода состояния.

    **Источник:** [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

54. (L1 [T]) Какие сущности (driver, rider, trip)?

    **Ответ:** Driver с доступностью и location, rider с запросом, trip с lifecycle и назначением; также fare/payment и vehicle. Владелец trip определяет допустимые переходы состояния.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

55. (L2 [T]) Как матчить водителя и пассажира?

    **Ответ:** Найти доступных водителей по геоиндексу, оценить ETA/ограничения и предложить кандидату поездку. Резервирование и acceptance выполнять условно/транзакционно, чтобы водитель не получил две активные поездки.

    **Источник:** [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

56. (L2 [P]) Как отслеживать геолокацию?

    **Ответ:** Принимать координаты с device timestamp, sequence и точностью, проверять давность/правдоподобие. Частоту менять по состоянию поездки, движению и энергобюджету.

    **Источник:** [Uber Engineering: H3 spatial index](https://www.uber.com/blog/h3/)

57. (L2 [T]) Как хранить location updates?

    **Ответ:** Последнюю позицию — в геоиндексе с TTL и sequence; историю — в отдельном ограниченном retention хранилище. Старые updates не должны перезаписывать свежие.

    **Источник:** [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html); [Uber Engineering: H3 spatial index](https://www.uber.com/blog/h3/)

58. (L2 [P]) Как реализовать real-time tracking?

    **Ответ:** Передавать активной поездке location events через WebSocket/SSE, проверять доступ к trip. На reconnect восстанавливать последнее состояние, на клиенте показывать возраст позиции и допустимую интерполяцию.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

59. (L3 [D]) Почему водитель долго находится?

    **Ответ:** Разделить поиск кандидатов, ETA, dispatch и ожидание acceptance. Проверить плотность доступных водителей, устаревшие координаты, перегруженную geo-cell и слишком узкий радиус.

    **Источник:** [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

60. (L3 [D]) Как диагностировать проблемы с matching?

    **Ответ:** Сопоставить traces matching с candidate count, rejection/timeout, доступностью и версиями location/state. Проверить конкурирующие назначения и рассогласованные проекции статуса водителя.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

61. (L3 [P]) Как оптимизировать dispatch алгоритм?

    **Ответ:** Ограничить геопоиск и число дорогих ETA вычислений, расширять радиус постепенно, применять batching там, где допустим latency budget. Оптимизировать совместно время ожидания, pickup ETA и долю успешных назначений.

    **Источник:** [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html); [Uber Engineering: H3 spatial index](https://www.uber.com/blog/h3/)

62. (L3 [T]) Как учитывать surge pricing?

    **Ответ:** Рассчитывать локальный дисбаланс спроса/предложения с ограничениями и версией тарифа. Зафиксировать показанную/принятую цену в quote/trip, чтобы последующий пересчёт не менял договорённость молча.

    **Источник:** [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

63. (L4 [S]) Как проектировать глобальный ride-sharing сервис?

    **Ответ:** Региональные/городские ячейки с локальным matching и владением trip. Общие identity/payments интегрировать через устойчивые контракты, определить правила приграничных поездок и регионального failover.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html)

64. (L4 [S]) Как минимизировать latency matching?

    **Ответ:** Держать актуальный geo-index рядом с dispatch, ограничить кандидатов и дорогие зависимости на critical path. Параллелить независимые оценки, но резервировать водителя атомарно; измерять p99 по городам.

    **Источник:** [PostGIS: Spatial indexing](https://postgis.net/workshops/postgis-intro/indexing.html); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
