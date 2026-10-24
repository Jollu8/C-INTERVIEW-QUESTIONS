# ⚙️ 3. Backend архитектура

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy


Здесь начинается реальный System Design.

**Подтемы:**

* Monolith vs Microservices
* API design (REST, gRPC)
* Service discovery
* Load balancing
* Stateless vs stateful services

---

1. (L1 [T]) Что такое монолитная архитектура?

   **Ответ:** Приложение, которое развёртывается как единая единица. Внутри оно может иметь строгие модули и несколько процессов; монолит не означает отсутствие архитектуры.

   **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html)

2. (L1 [T]) Что такое микросервисная архитектура?

   **Ответ:** Система из независимо развёртываемых сервисов с явными контрактами и владением данными. Требует автоматизации доставки, наблюдаемости и управления распределёнными отказами.

   **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html)

3. (L1 [T]) Что такое API?

   **Ответ:** Контракт взаимодействия программ: операции, данные, ошибки и правила использования. API бывает локальным, библиотечным и сетевым.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/)

4. (L1 [T]) Что такое REST?

   **Ответ:** Архитектурный стиль с ресурсами, единообразным интерфейсом, stateless запросами и возможностью кэширования. HTTP API с JSON не автоматически удовлетворяет всем ограничениям REST.

   **Пример:** GET /orders/42 возвращает представление заказа.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

5. (L1 [T]) Что такое gRPC?

   **Ответ:** Фреймворк RPC с контрактами, обычно Protocol Buffers, генерацией клиентов и поддержкой streaming. Типичный транспорт — HTTP/2; необходимо задавать deadlines и совместимость схем.

   **Источник:** [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/)

6. (L1 [T]) Что такое load balancer?

   **Ответ:** Компонент, распределяющий запросы или соединения по backend-экземплярам с учётом доступности и выбранного алгоритма.

   **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

7. (L1 [T]) Что такое stateless сервис?

   **Ответ:** Сервис, которому для обработки запроса не нужно локальное состояние предыдущих запросов клиента. Долговременные данные и сессии могут храниться снаружи.

   **Типичная ошибка:** Считать stateless отсутствием БД.

   **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html)

8. (L1 [T]) Что такое stateful сервис?

   **Ответ:** Сервис, где результат зависит от сохраняемого состояния, часто закреплённого за экземпляром. Масштабирование требует владения данными, переноса и восстановления.

   **Пример:** Узел хранения с локальными партициями.

   **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

9. (L1 [T]) Что такое service discovery?

   **Ответ:** Механизм нахождения актуальных адресов экземпляров по логическому имени. Использует DNS, registry или управляющую плоскость и должен учитывать устаревшие записи.

   **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

10. (L1 [T]) Что такое endpoint?

    **Ответ:** Адресуемая точка взаимодействия API: маршрут с методом либо RPC-метод. Один URL с разными HTTP-методами может представлять разные операции.

    **Пример:** GET /users/42.

    **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)


---

11. (L2 [T]) В чём плюсы и минусы монолита?

    **Ответ:** Плюсы — простые локальные вызовы, транзакции и развёртывание; минусы — связанный выпуск и сложность независимого масштабирования частей. Модульность уменьшает организационные ограничения.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html)

12. (L2 [T]) В чём плюсы и минусы микросервисов?

    **Ответ:** Дают независимые релизы, владение и масштабирование, но добавляют сеть, eventual consistency, стоимость платформы и сложность отладки.

    **Типичная ошибка:** Считать разбиение на процессы автоматическим улучшением дизайна.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html)

13. (L2 [P]) Когда стоит переходить от монолита к микросервисам?

    **Ответ:** Когда конкретные границы домена, команды или нагрузки требуют независимого жизненного цикла. Сначала выделить модуль и контракт, затем переносить по одному потоку с измеримой выгодой.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html); [Microsoft: Domain analysis for microservices](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

14. (L2 [T]) В чём разница REST vs gRPC?

    **Ответ:** REST задаёт стиль работы с ресурсами и использует HTTP-семантику; gRPC задаёт RPC-контракт и генерацию кода. Выбор зависит от клиентов, streaming, совместимости и инструментов.

    **Источник:** [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

15. (L2 [P]) Как спроектировать REST API?

    **Ответ:** Определить ресурсы и идентификаторы, HTTP-методы, статусы, пагинацию, ошибки и авторизацию. Зафиксировать идемпотентность, ограничения и стратегию совместимости.

    **Пример:** POST /orders создаёт заказ, GET /orders/{id} читает его.

    **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

16. (L2 [P]) Как спроектировать gRPC API?

    **Ответ:** Описать service/messages, выбрать unary или streaming, задать deadlines, ошибки, лимиты размеров и правила эволюции. Не переиспользовать удалённые номера полей.

    **Источник:** [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/); [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)

17. (L2 [T]) Что такое versioning API?

    **Ответ:** Управляемая эволюция публичного контракта. Несовместимые изменения требуют новой версии или согласованной миграции; номер в URL сам по себе совместимость не обеспечивает.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

18. (L2 [P]) Как обеспечить backward compatibility API?

    **Ответ:** Добавлять необязательные поля, сохранять семантику и поддерживать старых клиентов в переходный период. Для protobuf резервировать удалённые номера, для HTTP учитывать строгих клиентов и unknown enum.

    **Источник:** [Protocol Buffers: Updating a message type](https://protobuf.dev/programming-guides/proto3/#updating)

19. (L2 [T]) Что такое service registry?

    **Ответ:** Хранилище записей об экземплярах: адреса, метаданные и lease/health. Регистрация не доказывает фактическую готовность обслуживать запросы.

    **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

20. (L2 [P]) Как работает service discovery (client-side vs server-side)?

    **Ответ:** В client-side discovery клиент получает список и выбирает адрес; в server-side обращается к proxy/виртуальному адресу, который выбирает backend. В обоих случаях нужны обновления и health checks.

    **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/)

21. (L2 [T]) Какие бывают алгоритмы load balancing?

    **Ответ:** Round-robin, weighted, least connections/requests, random, power of two choices и hash-based. Алгоритм выбирают по длительности запросов, мощности узлов и требованиям locality.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

22. (L2 [T]) Что такое round-robin?

    **Ответ:** Последовательное циклическое назначение запросов узлам. Прост и работает при похожих запросах и мощности экземпляров, но не учитывает текущую загрузку.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

23. (L2 [T]) Что такое least connections?

    **Ответ:** Выбор узла с меньшим числом активных соединений. Полезен для долгих соединений, но число соединений может плохо отражать CPU и число запросов внутри HTTP/2.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

24. (L2 [P]) Как балансировать stateful сервис?

    **Ответ:** Маршрутизировать по ключу владельца, учитывать репликацию, миграцию и drain. Sticky sessions дают affinity, но не восстанавливают утраченное состояние.

    **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/); [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

25. (L2 [P]) Как сделать сервис stateless?

    **Ответ:** Вынести сессии и долговременные данные во внешнее хранилище, убрать зависимость от локальных файлов, сделать обработку повторов безопасной. Локальный кэш должен быть необязательным для корректности.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

26. (L2 [T]) Что такое sticky sessions?

    **Ответ:** Привязка клиента к backend по cookie, хэшу или другому признаку. Упрощает использование локального состояния, но вызывает перекос и осложняет failover.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)

27. (L2 [P]) Когда использовать sticky sessions?

    **Ответ:** Для унаследованных приложений с локальными сессиями либо как оптимизацию locality. Состояние всё равно нужно восстанавливать или хранить вне экземпляра, если требуется непрерывность.

    **Типичная ошибка:** Делать sticky sessions единственной гарантией сохранности сессии.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/)


---

28. (L3 [D]) Почему сервис деградирует при росте нагрузки?

    **Ответ:** Проверить насыщение CPU/I/O, пулы, блокировки, очереди и зависимости на профиле нагрузки. Сопоставить throughput с p95/p99 и временем ожидания, чтобы отделить сервисное время от очередей.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

29. (L3 [D]) Как диагностировать cascading failure?

    **Ответ:** Построить временную линию ошибок, latency, retries и исчерпания пулов по зависимостям. Найти исходный отказ и петлю усиления; для восстановления ограничить вход и повторные попытки.

    **Источник:** [Google SRE: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)

30. (L3 [T]) Что такое backpressure?

    **Ответ:** Передача сигнала о недостатке пропускной способности вверх по цепочке, чтобы источник замедлился. Ограничивает рост очередей и памяти.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

31. (L3 [P]) Как реализовать backpressure?

    **Ответ:** Ограничить очередь и число in-flight операций, блокировать/замедлять producer либо возвращать контролируемый отказ. Распространять отмену и deadlines, отдельно определить политику сброса.

    **Пример:** При заполнении пула — 429/503 с уместным Retry-After.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

32. (L3 [T]) Что такое circuit breaker?

    **Ответ:** Автомат состояний, временно прекращающий обращения к проблемной зависимости. После паузы допускает ограниченные пробы; сам по себе не ограничивает все ресурсы.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

33. (L3 [P]) Как реализовать circuit breaker?

    **Ответ:** Считать ошибки и медленные вызовы в окне с минимальным объёмом выборки, переходить в open, затем half-open с ограниченными пробами. Сочетать с timeout и изоляцией пулов.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

34. (L3 [D]) Почему возникают timeout'ы между сервисами?

    **Ответ:** Разделить DNS/connect/TLS, ожидание пула, очередь и работу downstream по spans. Проверить packet loss, нагрузку, GC и несовместимые deadline-бюджеты.

    **Источник:** [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/); [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

35. (L3 [P]) Как правильно настроить retry?

    **Ответ:** Повторять только временные ошибки и безопасные операции с лимитом попыток, общего времени, backoff и jitter. Делать retries на выбранном уровне, чтобы вложенные повторы не умножали нагрузку.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

36. (L3 [T]) Что такое bulkhead pattern?

    **Ответ:** Разделение ресурсов на независимые отсеки, чтобы отказ одной зависимости или tenant не исчерпал общий пул. Изоляция бывает через пулы, процессы и отдельные deployments.

    **Источник:** [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

37. (L3 [P]) Как изолировать сервисы друг от друга?

    **Ответ:** Выделить квоты, очереди, thread/connection pools и лимиты конкурентности по зависимостям и арендаторам. Проверить отказ одного отсека нагрузочным тестом и предусмотреть деградацию.

    **Источник:** [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

38. (L3 [D]) Почему растёт latency между микросервисами?

    **Ответ:** Проверить увеличение fan-out, очередей, payload, connect/TLS, retries и межзонного RTT. Сравнить traces и распределение задержек до/после изменения, а не только среднее.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

39. (L3 [D]) Как найти узкое место в цепочке сервисов?

    **Ответ:** Найти критический путь trace, отделить локальную работу от ожидания downstream, затем подтвердить метриками ресурсов и профилем. Сумма длительностей параллельных spans не равна latency запроса.

    **Источник:** [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

40. (L3 [T]) Что такое API gateway?

    **Ответ:** Входной слой для маршрутизации, аутентификации, квот, преобразований и агрегации. Не должен становиться владельцем всей бизнес-логики и единой точкой отказа.

    **Источник:** [NGINX: Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

41. (L3 [P]) Как реализовать API gateway?

    **Ответ:** Развернуть несколько экземпляров proxy/gateway, задать маршруты, TLS, auth, лимиты, timeouts и наблюдаемость. Проверять конфигурации, безопасно раскатывать изменения и сохранять ограничения внутри сервисов.

    **Источник:** [NGINX: Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/); [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/)


---

42. (L4 [S]) Когда микросервисы вредны?

    **Ответ:** Когда домен ещё не понятен, команда мала либо процессы релиза и эксплуатации незрелы. Сетевые границы при сильной связанности создают затраты без независимости.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html)

43. (L4 [S]) Как избежать distributed monolith?

    **Ответ:** Сделать контракты и владение данными явными, убрать совместное изменение общей БД и синхронные цепочки релизов. Использовать совместимые события/API и проверять возможность независимого выпуска.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html); [Microsoft: Domain analysis for microservices](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

44. (L4 [S]) Как правильно декомпозировать сервисы?

    **Ответ:** По бизнес-возможностям, инвариантам, темпам изменений и владению команд. Сильные транзакционные связи обычно оставляют внутри одного агрегата/сервиса.

    **Источник:** [Microsoft: Domain analysis for microservices](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

45. (L4 [S]) Как определить границы сервисов (DDD, bounded context)?

    **Ответ:** Найти разные модели и язык домена, определить aggregates и инварианты, нарисовать context map. Bounded context задаёт границу модели; не обязан точно совпадать с одним deployment.

    **Источник:** [Microsoft: Domain analysis for microservices](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

46. (L4 [S]) Как проектировать backend для high-load системы?

    **Ответ:** Начать с QPS, размеров, burst, SLO и инвариантов; оценить лимиты, выбрать partition key и модель хранения. Использовать bounded concurrency, кэш по измерениям, асинхронные проекции и проверку отказов.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [PostgreSQL: Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

47. (L4 [S]) Когда использовать gRPC вместо REST на уровне архитектуры?

    **Ответ:** Для контролируемых клиентов, строгих контрактов, streaming и большого числа внутренних RPC. Для браузеров учесть gRPC-Web/proxy и эксплуатационные ограничения; сравнить реальные профили.

    **Источник:** [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/)

48. (L4 [S]) Как проектировать систему с тысячами сервисов?

    **Ответ:** Стандартизировать discovery, identity, telemetry, совместимость и шаблоны доставки. Ограничить синхронный fan-out, назначить владельцев и SLO, строить изоляцию по ячейкам и доменам.

    **Источник:** [Martin Fowler: Microservices](https://martinfowler.com/articles/microservices.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

49. (L4 [S]) Как управлять конфигурацией сервисов?

    **Ответ:** Версионировать конфигурации, проверять схему и раскатывать постепенно с rollback. Отделить секреты, задать приоритеты источников и наблюдать фактически применённую версию.

    **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

50. (L4 [S]) Как проектировать multi-region backend?

    **Ответ:** Определить регион владения данными и разрешённые операции при потере связи. Настроить маршрутизацию, репликацию, запас ёмкости и failover с fencing старого владельца.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Raft paper](https://raft.github.io/raft.pdf)

51. (L4 [S]) Как строить resilient backend архитектуру?

    **Ответ:** Проектировать ограниченные очереди, deadlines, безопасные retries, bulkheads и деградацию от требований SLO. Регулярно проверять восстановление данных, отказ зоны и зависимостей.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker); [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead); [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
