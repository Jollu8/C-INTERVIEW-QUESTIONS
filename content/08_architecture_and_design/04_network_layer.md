# 🌐 4. Сетевой слой и доставка

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

Про это забывают — и заваливаются.

**Подтемы:**

* DNS
* CDN
* Reverse proxy
* HTTP vs WebSockets
* TLS / HTTPS

---

1. (L1 [T]) Что такое DNS?

   **Ответ:** Распределённая иерархическая система записей о доменных именах: адресах, почте и других данных. Резолверы кэшируют ответы с учётом TTL.

   **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)

2. (L1 [T]) Как работает DNS резолвинг?

   **Ответ:** Приложение спрашивает локальный resolver, тот использует кэш либо обращается по иерархии root → TLD → authoritative. CNAME может потребовать дополнительного разрешения.

   **Пример:** dig example.org показывает записи и TTL.

   **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)

3. (L1 [T]) Что такое IP-адрес?

   **Ответ:** Числовой адрес сетевого интерфейса для маршрутизации IP-пакетов: IPv4 — 32 бита, IPv6 — 128. Адрес не является устойчивой идентичностью пользователя.

   **Пример:** 192.0.2.1 и 2001:db8::1 — адреса для документации.

   **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)

4. (L1 [T]) Что такое CDN?

   **Ответ:** Сеть распределённых точек доставки, обслуживающих контент близко к пользователю. Обычно включает edge cache, маршрутизацию и защиту origin.

   **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

5. (L1 [T]) Что делает reverse proxy?

   **Ответ:** Принимает запрос от имени серверов и перенаправляет его backend. Может завершать TLS, балансировать, буферизовать и ограничивать запросы.

   **Источник:** [NGINX: Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

6. (L1 [T]) Что такое HTTP?

   **Ответ:** Прикладной протокол с методами, статусами, заголовками и представлениями ресурсов. Семантика общая для HTTP/1.1, HTTP/2 и HTTP/3, а транспорт различается.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

7. (L1 [T]) Что такое HTTPS?

   **Ответ:** HTTP поверх защищённого транспорта: TLS защищает конфиденциальность и целостность и позволяет проверить сервер. В HTTP/3 TLS интегрирован с QUIC.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

8. (L1 [T]) Что такое TLS?

   **Ответ:** Криптографический протокол для аутентификации сторон и защиты передаваемых данных. Не защищает данные после расшифрования на скомпрометированном endpoint.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

9. (L1 [T]) Что такое WebSocket?

   **Ответ:** Протокол двустороннего обмена сообщениями по долгоживущему соединению. После установления канала клиент и сервер могут отправлять данные независимо.

   **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html)

10. (L1 [T]) В чём разница между HTTP и WebSocket?

    **Ответ:** HTTP задаёт запросы и ответы, WebSocket — двусторонний поток сообщений с собственной семантикой приложения. HTTP streaming и SSE тоже допускают долгую доставку данных.

    **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html)


---

11. (L2 [T]) Какие бывают типы DNS записей (A, AAAA, CNAME)?

    **Ответ:** A связывает имя с IPv4, AAAA — с IPv6, CNAME задаёт другое каноническое имя. Также существуют MX, TXT, NS и другие типы.

    **Типичная ошибка:** CNAME не задаёт URL с путём и портом.

    **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)

12. (L2 [T]) Что такое TTL в DNS?

    **Ответ:** Срок допустимого кэширования записи, в секундах. Снижение TTL повышает DNS-нагрузку и не удаляет уже закэшированные старые ответы.

    **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)

13. (L2 [P]) Как работает CDN?

    **Ответ:** Маршрутизация приводит пользователя на edge; hit обслуживается локально, miss вызывает запрос к origin или верхнему cache-tier. Правила cache key и свежести определяют повторное использование.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

14. (L2 [T]) Что такое edge-сервер?

    **Ответ:** Сервер в точке присутствия, близкой к пользователю по сетевой топологии. Может выполнять кэширование, TLS termination, фильтрацию и вычисления.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

15. (L2 [P]) Как CDN уменьшает latency?

    **Ответ:** Сокращает RTT до точки доставки и повторные обращения к origin, переиспользует соединения и снимает нагрузку. Для cache miss выигрыш зависит от сети CDN и скорости origin.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

16. (L2 [T]) Что такое cache hit / miss?

    **Ответ:** Hit — пригодный ответ найден в кэше, miss — запрос требует другого источника. Stale, revalidated и bypass полезно измерять отдельно.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

17. (L2 [T]) Как работает reverse proxy (Nginx)?

    **Ответ:** NGINX принимает клиентское соединение, выбирает upstream и пересылает запрос. Управляет соединениями, заголовками, буферизацией и timeout независимо на обеих сторонах.

    **Источник:** [NGINX: Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

18. (L2 [P]) Как настроить reverse proxy?

    **Ответ:** Задать upstream и location с proxy_pass, лимиты, timeouts и TLS; передать корректный Host и только доверенные forwarded-заголовки. Проверить nginx -t и выполнить контролируемый reload.

    **Пример:** location /api/ { proxy_pass http://backend; } — минимальный маршрут без полной production-конфигурации.

    **Источник:** [NGINX: Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

19. (L2 [T]) Что такое HTTP/1.1 vs HTTP/2?

    **Ответ:** HTTP/1.1 передаёт последовательности запросов по TCP-соединениям; HTTP/2 использует бинарные frames, multiplexing streams и сжатие заголовков. Потеря TCP-пакета всё ещё задерживает разные streams.

    **Источник:** [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)

20. (L2 [T]) Что такое keep-alive соединения?

    **Ответ:** Переиспользование соединения для нескольких запросов, уменьшающее connect/TLS расходы. В HTTP/1.1 постоянные соединения обычно используются по умолчанию; TCP keepalive — отдельные пробы живости.

    **Типичная ошибка:** Путать HTTP keep-alive с SO_KEEPALIVE.

    **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

21. (L2 [T]) Что такое TLS handshake?

    **Ответ:** Обмен для согласования параметров, ключей и проверки сертификата. TLS 1.3 обычно требует один RTT для полного handshake; возобновление уменьшает работу, 0-RTT имеет ограничения replay.

    **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

22. (L2 [T]) Что такое сертификат?

    **Ответ:** Подписанное удостоверение связи публичного ключа с именем/субъектом. Клиент проверяет цепочку доверия, имя, срок действия и применимые ограничения.

    **Типичная ошибка:** Доверять сертификату без проверки hostname.

    **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

23. (L2 [P]) Как работает HTTPS на уровне запроса?

    **Ответ:** Сначала DNS и соединение, затем согласование защищённого канала и проверка сервера, затем зашифрованный HTTP. В proxy-архитектуре каждый участок после TLS termination требует отдельного решения о защите.

    **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

24. (L2 [T]) Когда использовать WebSocket вместо HTTP?

    **Ответ:** Когда нужен частый двусторонний обмен с небольшой задержкой: чат, совместное редактирование, realtime управление. Нужны heartbeat, reconnect, backpressure и восстановление пропущенных сообщений.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html)

25. (L2 [P]) Как реализовать long polling?

    **Ответ:** Клиент отправляет запрос, сервер держит его до события или ограниченного timeout, затем клиент возобновляет запрос с cursor. Не удерживать рабочий поток на каждое ожидание.

    **Пример:** GET /events?after=123 возвращает события после сохранённой позиции.

    **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)


---

26. (L3 [D]) Почему DNS резолвинг занимает много времени?

    **Ответ:** Измерить resolver RTT, cache hit, число CNAME, потери, retries и fallback TCP. Сравнить локальный resolver с authoritative через dig; DNSSEC и неверная делегация также могут замедлять разрешение.

    **Источник:** [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html)

27. (L3 [D]) Почему CDN не кеширует контент?

    **Ответ:** Проверить Cache-Control, Set-Cookie, Authorization, Vary, cache key, статус и правила CDN. Персональные ответы нельзя делать общими только ради hit rate.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

28. (L3 [D]) Как диагностировать cache miss storm?

    **Ответ:** Сопоставить скачок misses с TTL, purge, релизом, новой версией ключей и изменением трафика. Проверить origin QPS и заполнение пулов, отличить массовый холодный старт от одного горячего объекта.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/); [Azure Architecture: Cache-Aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

29. (L3 [D]) Почему высокий latency между регионами?

    **Ответ:** Проверить RTT, маршрут, loss, повторные соединения и синхронные межрегиональные вызовы. Физическое расстояние задаёт нижнюю границу, а очереди и fan-out увеличивают задержку.

    **Источник:** [Google SRE: Load Balancing in the Datacenter](https://sre.google/sre-book/load-balancing-datacenter/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

30. (L3 [T]) Как работает Anycast?

    **Ответ:** Один IP-префикс объявляется из разных точек; BGP выбирает маршрут по политике сети. Это не гарантия географически ближайшего узла и не автоматическое сохранение долгих соединений при смене маршрута.

    **Источник:** [RFC 4786: Anycast](https://www.rfc-editor.org/rfc/rfc4786.html)

31. (L3 [P]) Как реализовать geo-routing?

    **Ответ:** Использовать DNS steering, Anycast или глобальный L7 LB с health, latency и capacity сигналами. Учитывать кеширование DNS, данные home region и предотвращение маршрутизации в перегруженный регион.

    **Источник:** [RFC 4786: Anycast](https://www.rfc-editor.org/rfc/rfc4786.html); [RFC 1034: Domain names](https://www.rfc-editor.org/rfc/rfc1034.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

32. (L3 [D]) Почему TLS handshake медленный?

    **Ответ:** Разделить TCP connect и TLS, проверить RTT/loss, CPU криптографии, цепочку сертификатов и возобновление сессий. Сопоставить холодные соединения с reuse и загрузкой терминатора.

    **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

33. (L3 [P]) Как оптимизировать TLS (session reuse)?

    **Ответ:** Включить session tickets/resumption и безопасное управление ключами, переиспользовать соединения. Не отправлять в 0-RTT незащищённые от replay изменения состояния.

    **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)

34. (L3 [D]) Почему WebSocket соединения обрываются?

    **Ответ:** Проверить idle timeout proxy/LB, heartbeat, deployment drain, сеть и причины close. Реализовать reconnect с jitter, cursor и дедупликацией, чтобы восстановление не теряло сообщения.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html)

35. (L3 [T]) Что такое head-of-line blocking?

    **Ответ:** Ситуация, когда задержка раннего элемента блокирует следующие. В HTTP/1.1 это возможно на уровне ответов, в HTTP/2 остаётся TCP HOL между multiplexed streams.

    **Источник:** [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)

36. (L3 [D]) Как диагностировать проблемы с HTTP/2?

    **Ответ:** Смотреть RST_STREAM/GOAWAY, лимиты concurrent streams, flow-control окна, proxy logs и потери TCP. Сравнить с HTTP/1.1 на том же маршруте, проверить поддержку H2 всеми участками.

    **Источник:** [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113.html)

37. (L3 [P]) Как реализовать rate limiting на уровне proxy?

    **Ответ:** Использовать limit_req с общей зоной состояния, burst и явной реакцией на превышение. Ключ строить по доверенному IP/identity; отдельно ограничить соединения и дорогие маршруты.

    **Пример:** limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s; — пример, требующий настройки burst и статуса отказа.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/)


---

38. (L4 [S]) Как проектировать глобальную CDN архитектуру?

    **Ответ:** Определить PoP, иерархию edge/shield/origin, cache key и invalidation, затем маршрутизацию, ёмкость и наблюдаемость. Защитить origin от прямого обхода и проверить холодный кэш при отказе PoP.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/); [RFC 4786: Anycast](https://www.rfc-editor.org/rfc/rfc4786.html)

39. (L4 [S]) Когда CDN бесполезен?

    **Ответ:** При уникальных ответах с запретом общего кэша, редких запросах или зависимости от далёкой синхронной БД эффект может быть мал. CDN всё ещё может помогать TLS, защите и маршруту; это нужно измерять.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/)

40. (L4 [S]) Как проектировать multi-region routing?

    **Ответ:** Совмещать health и capacity с локальностью данных, постепенным failover и ограничением межрегионального трафика. Запас ёмкости и защита от split-brain важнее самого переключателя DNS.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Raft paper](https://raft.github.io/raft.pdf)

41. (L4 [S]) Как минимизировать latency для глобальных пользователей?

    **Ответ:** Сократить критический путь и число RTT, приблизить данные/кэш и вычисления, использовать reuse и асинхронные операции. Отдельно измерять cold/warm p99 по регионам и сетям.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

42. (L4 [S]) Когда использовать WebSocket vs polling vs SSE?

    **Ответ:** WebSocket — двусторонний частый обмен, SSE — серверные события поверх HTTP, polling — редкие изменения и простой клиент. Оценить fan-out, reconnect, прокси, авторизацию и восстановление событий.

    **Источник:** [RFC 6455: WebSocket](https://www.rfc-editor.org/rfc/rfc6455.html); [HTML Standard: Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)

43. (L4 [S]) Как проектировать edge computing архитектуру?

    **Ответ:** Выполнять близко к пользователю работу с локальными данными и ограниченным состоянием. Определить синхронизацию конфигурации, секреты, версии, лимиты среды и fallback в регион.

    **Источник:** [Cloudflare: Content delivery networks](https://developers.cloudflare.com/cache/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

44. (L4 [S]) Как защищать систему от DDoS на уровне сети?

    **Ответ:** Применять распределённое поглощение трафика, фильтрацию и scrubbing у провайдера до насыщения канала. Закрыть прямой origin, контролировать L3/L4 flood и отдельно защищать L7.

    **Источник:** [AWS: DDoS resiliency practices](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html)

45. (L4 [S]) Как строить высоконагруженный reverse proxy слой?

    **Ответ:** Несколько независимых proxy-узлов, reuse upstream, bounded buffers, лимиты запросов/соединений и graceful drain. Нагрузочные тесты должны учитывать TLS, медленных клиентов, большие payload и отказ узла.

    **Источник:** [NGINX: Reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/); [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/)
