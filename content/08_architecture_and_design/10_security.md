# 🔐 10. Безопасность

Часто задают ближе к концу интервью.

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

* Authentication / Authorization
* OAuth, JWT
* Rate limiting
* DDoS protection

---

1. (L1 [T]) Что такое аутентификация (authentication)?

   **Ответ:** Проверка заявленной идентичности: кто обращается. Использует пароль, ключ, сертификат, passkey или другой фактор; успешный вход ещё не означает право на любой ресурс.

   **Источник:** [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

2. (L1 [T]) Что такое авторизация (authorization)?

   **Ответ:** Проверка, разрешено ли субъекту конкретное действие над конкретным ресурсом в текущем контексте. Выполняется на сервере для каждого значимого доступа.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

3. (L1 [T]) В чём разница между authentication и authorization?

   **Ответ:** Authentication устанавливает identity, authorization проверяет полномочия этой identity. Отсутствие проверки владельца объекта опасно даже после корректного входа.

   **Пример:** Пользователь вошёл, но не может читать чужой заказ.

   **Источник:** [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

4. (L1 [T]) Что такое токен?

   **Ответ:** Значение, представляющее право, сессию или иной контекст. Бывает opaque и самодостаточным; bearer token даёт доступ предъявителю, поэтому требует защиты от утечки.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html); [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

5. (L1 [T]) Что такое сессия?

   **Ответ:** Состояние взаимодействия клиента с сервером, связанное с идентификатором. Обычно сервер хранит состояние, а браузер — случайный session ID в защищённой cookie.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

6. (L1 [T]) Что такое парольное хэширование?

   **Ответ:** Одностороннее преобразование пароля специальной медленной функцией с уникальной солью. Предпочтителен Argon2id с параметрами по актуальным требованиям и возможностям сервера.

   **Типичная ошибка:** Хранить пароли через быстрый SHA-256 без password KDF.

   **Источник:** [OWASP: Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

7. (L1 [T]) Что такое JWT?

   **Ответ:** Формат набора claims; часто используется как подписанный JWS, также бывает зашифрованным JWE. Сам по себе формат не задаёт отзыв, хранение и правила авторизации.

   **Типичная ошибка:** Считать обычный JWT зашифрованным: payload читается.

   **Источник:** [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)

8. (L1 [T]) Что такое OAuth?

   **Ответ:** OAuth 2.0 — framework делегированного доступа к ресурсам. Для входа и утверждений об identity обычно используют OpenID Connect поверх OAuth.

   **Типичная ошибка:** Использовать access token как ID token без проверки назначения.

   **Источник:** [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

9. (L1 [T]) Что такое rate limiting?

   **Ответ:** Ограничение частоты/стоимости операций по identity, tenant, IP или ресурсу. Защищает ёмкость и справедливость, но не заменяет авторизацию и защиту канала.

   **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

10. (L1 [T]) Что такое DDoS-атака?

    **Ответ:** Распределённый поток вредоносной нагрузки, истощающий канал или ресурсы сервиса. Может действовать на сетевом, транспортном и прикладном уровнях.

    **Источник:** [AWS: DDoS resiliency practices](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html)


---

11. (L2 [T]) Как работает JWT (header, payload, signature)?

    **Ответ:** В JWS header задаёт метаданные, payload — claims, signature/MAC защищает целостность и подлинность. Base64url-кодирование не скрывает данные; алгоритм выбирают по доверенной конфигурации.

    **Источник:** [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)

12. (L2 [P]) Как реализовать аутентификацию через JWT?

    **Ответ:** Выдавать короткоживущий access token после надёжного входа, проверять подпись, alg allowlist, issuer, audience и время. Использовать проверенную библиотеку, TLS, ротацию ключей и отдельную проверку прав.

    **Типичная ошибка:** Просто декодировать payload без верификации подписи.

    **Источник:** [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html); [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

13. (L2 [T]) В чём плюсы и минусы JWT?

    **Ответ:** Плюсы — локальная проверка и удобный перенос claims; минусы — сложный немедленный отзыв, устаревшие права, размер и управление ключами. Наличие JWT не делает всю систему stateless.

    **Источник:** [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html); [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

14. (L2 [T]) Как работает OAuth 2.0 (authorization code flow)?

    **Ответ:** Клиент направляет пользователя на authorization endpoint с state и PKCE, получает code на точный redirect URI и обменивает его с verifier на tokens. Проверяются привязка к клиенту и защита от mix-up/CSRF.

    **Типичная ошибка:** Использовать implicit flow для нового приложения вместо code + PKCE.

    **Источник:** [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

15. (L2 [P]) Когда использовать OAuth?

    **Ответ:** Для делегирования доступа внешнему приложению с ограниченными scopes без передачи пароля. Для пользовательского входа добавить OIDC и проверять ID token по его правилам.

    **Источник:** [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

16. (L2 [T]) Что такое refresh token?

    **Ответ:** Credential для получения новых access tokens. Обычно живёт дольше и требует особенно защищённого хранения; rotation и обнаружение повторного использования уменьшают риск кражи.

    **Источник:** [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

17. (L2 [P]) Как реализовать logout с JWT?

    **Ответ:** Удалить клиентские credentials, отозвать refresh token/session и при необходимости вести denylist или версию сессии. Уже выданный JWT остаётся действителен до exp, если сервер не проверяет отзыв.

    **Источник:** [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html); [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

18. (L2 [T]) Что такое RBAC (role-based access control)?

    **Ответ:** Права назначаются ролям, пользователи/сервисы получают роли. Проверять scope роли и принадлежность ресурса tenant; слишком общие роли создают избыточный доступ.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

19. (L2 [T]) Что такое ABAC?

    **Ответ:** Attribute-Based Access Control — решение по атрибутам субъекта, ресурса, действия и окружения. Требует доверенных атрибутов, явной политики и аудита решений.

    **Пример:** Разрешить чтение записи сотруднику того же tenant при действующем назначении.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

20. (L2 [P]) Как реализовать authorization?

    **Ответ:** Deny by default, least privilege и проверки на сервере у границы ресурса. Использовать централизованные правила с локальным enforcement, тестировать доступ к чужим объектам и изменения прав.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

21. (L2 [T]) Какие алгоритмы rate limiting существуют?

    **Ответ:** Fixed window, sliding log/window, token bucket, leaky bucket и concurrency limits. Выбор зависит от разрешённых bursts, точности, памяти и распределённости.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

22. (L2 [T]) Что такое token bucket?

    **Ответ:** В bucket до B токенов, они пополняются со скоростью r; запрос расходует токен. Разрешает краткий burst при ограниченной средней скорости.

    **Пример:** B=100, r=10/с разрешает до 100 накопленных запросов сразу.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/)

23. (L2 [T]) Что такое leaky bucket?

    **Ответ:** Модель выпуска с постоянной скоростью из ограниченного буфера; сглаживает bursts ценой ожидания или сброса. В разных реализациях это может быть meter либо queue — семантику нужно уточнять.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/)

24. (L2 [P]) Как реализовать rate limiter?

    **Ответ:** Хранить состояние bucket и timestamp, обновлять атомарно, определить ключ и цену операции. Ограничить память, задать TTL и поведение при отказе счётчика; локальный лимит умножается на число replicas.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [Redis: Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/)

25. (L2 [T]) Где лучше ставить rate limiting (gateway, сервис)?

    **Ответ:** На edge/gateway — ранняя фильтрация и грубые квоты; в сервисе — identity/resource-aware лимиты дорогих действий. Защищать внутренние обходные пути и не доверять произвольному X-Forwarded-For.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

26. (L2 [T]) Какие типы DDoS атак бывают?

    **Ответ:** Объёмные floods, атаки протоколов/состояния L3/L4 и дорогие L7 запросы. Уровень атаки определяет место фильтрации; защита приложения не помогает при уже забитом внешнем канале.

    **Источник:** [AWS: DDoS resiliency practices](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html)


---

27. (L3 [D]) Почему токен можно подделать?

    **Ответ:** Проверить, выполняется ли verification, разрешён ли none, нет ли confusion алгоритмов, слабого HMAC-ключа или доверия к чужому key URL. Сохранять безопасные артефакты и ротировать затронутые ключи.

    **Источник:** [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)

28. (L3 [D]) Как диагностировать утечку токенов?

    **Ответ:** Проверить audit trail выдачи/refresh, необычные географии, устройства и повторное использование, не записывая raw tokens. Отозвать затронутые сессии и найти путь утечки: URL, логи, XSS, расширения.

    **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html); [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

29. (L3 [D]) Почему rate limiter не защищает систему?

    **Ответ:** Лимит задан только по IP, можно обходить endpoint, состояние локально на replica либо атака исчерпывает ресурсы до проверки. Сопоставить allowed/rejected и фактическую стоимость операций.

    **Источник:** [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html); [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/)

30. (L3 [P]) Как защититься от brute-force атак?

    **Ответ:** Rate limits по аккаунту и источнику, прогрессивные задержки, MFA/passkeys и обнаружение credential stuffing. Не создавать простой account-lockout DoS и не раскрывать существование аккаунта в ответах.

    **Источник:** [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

31. (L3 [T]) Что такое replay attack?

    **Ответ:** Повтор ранее допустимого запроса/credential для повторного эффекта или входа. Подпись доказывает подлинность, но сама по себе не доказывает свежесть.

    **Источник:** [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html); [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)

32. (L3 [P]) Как предотвратить replay attack?

    **Ответ:** Для эффектов — устойчивый operation ID и дедупликация, для credentials — короткий срок, одноразовые nonce и sender-constrained tokens при необходимости. Окно времени без nonce допускает повторы внутри окна.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

33. (L3 [D]) Почему OAuth интеграция небезопасна?

    **Ответ:** Проверить точность redirect URI, state/PKCE, code binding, issuer/audience, mix-up и утечки через URL. Исключить устаревшие flows и неправильное хранение refresh tokens по RFC 9700.

    **Источник:** [RFC 9700: OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

34. (L3 [P]) Как безопасно хранить секреты?

    **Ответ:** Использовать secret manager/KMS, workload identity, минимальные права и короткоживущие credentials. Ротировать и аудитировать доступ, исключить секреты из репозитория, образов и логов.

    **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

35. (L3 [T]) Что такое CSRF?

    **Ответ:** Атака, при которой браузер жертвы отправляет нежелательный запрос с автоматически приложенными credentials. Важна для cookie-based auth и других ambient credentials.

    **Источник:** [OWASP: CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

36. (L3 [P]) Как защититься от CSRF?

    **Ответ:** CSRF token, проверка Origin/Referer и SameSite cookies как дополнительный слой. Не менять состояние через GET; CORS не является полной защитой от отправки cross-site запросов.

    **Типичная ошибка:** Отключать CSRF только потому, что API принимает JSON.

    **Источник:** [OWASP: CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

37. (L3 [T]) Что такое XSS?

    **Ответ:** Внедрение атакующего содержимого, исполняемого браузером в контексте доверенного сайта. Бывает reflected, stored и DOM-based; последствия включают кражу данных и действия от пользователя.

    **Источник:** [OWASP: XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

38. (L3 [P]) Как защититься от XSS?

    **Ответ:** Контекстное экранирование вывода, безопасные DOM API и sanitizer для разрешённого HTML. CSP — дополнительная защита, а HttpOnly мешает чтению cookie, но не действиям XSS от имени пользователя.

    **Источник:** [OWASP: XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

39. (L3 [D]) Как обнаружить DDoS атаку?

    **Ответ:** Сопоставить рост трафика, источники, сетевые flags, RPS, ошибки, стоимость запросов и региональный профиль. Использовать telemetry провайдера и отличать атаку от легитимного всплеска.

    **Источник:** [AWS: DDoS resiliency practices](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html)

40. (L3 [P]) Как смягчить DDoS на уровне приложения?

    **Ответ:** Дешёвые проверки на edge, quotas по identity/ресурсу, ограничения body и concurrent work, кэш разрешённых ответов. Отключать дорогие необязательные функции и защищать origin от обхода.

    **Источник:** [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html); [AWS: DDoS resiliency practices](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html)


---

41. (L4 [S]) Как проектировать secure authentication систему?

    **Ответ:** Доверенный IdP либо зрелый auth-компонент, MFA/passkeys, безопасное восстановление, сессии и token lifecycle. Разделить authentication/authorization, учесть угрозы, аудит, отзыв и защиту от brute force.

    **Источник:** [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html); [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

42. (L4 [S]) Когда использовать JWT vs session-based auth?

    **Ответ:** Для браузерного first-party приложения server-side session часто проще с отзывом; JWT полезен для распределённой проверки и федерации. Выбор определяется trust boundaries, клиентами и временем актуальности прав.

    **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html); [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)

43. (L4 [S]) Как проектировать authorization для микросервисов?

    **Ответ:** Проверять identity сервисов и пользователя, audience/scope и объектные права на каждом boundary. Общая policy-модель с локальным enforcement; gateway не заменяет проверки внутри владельца данных.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)

44. (L4 [S]) Как строить multi-layer защиту (defense in depth)?

    **Ответ:** Независимые уровни: identity, least privilege, сегментация, безопасный код, шифрование, аудит и recovery. Их отказы не должны иметь одну общую причину или полагаться на один gateway.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

45. (L4 [S]) Как проектировать rate limiting для глобальной системы?

    **Ответ:** Комбинировать глобальную квоту с региональными бюджетами и локальными быстрыми лимитами. Определить допустимое превышение при partition: строгое глобальное ограничение требует координации.

    **Источник:** [NGINX: Limiting access](https://docs.nginx.com/nginx/admin-guide/security-controls/controlling-access-proxied-http/); [Raft paper](https://raft.github.io/raft.pdf)

46. (L4 [S]) Как защитить API от abuse?

    **Ответ:** Авторизация по объекту, quotas по стоимости, безопасные defaults, ограничения пагинации, антибот-сигналы и аудит аномалий. Учитывать abuse легально авторизованных пользователей, а не только анонимный flood.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

47. (L4 [S]) Как проектировать систему устойчивую к DDoS?

    **Ответ:** Поглощение/фильтрация у сетевого провайдера, распределённый edge, скрытый origin и ограниченная работа backend. Проверять ёмкость зависимостей, сценарий failover и управляемую деградацию.

    **Источник:** [AWS: DDoS resiliency practices](https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

48. (L4 [S]) Как балансировать security vs usability?

    **Ответ:** Оценить угрозы и цену ошибки по сценарию, сделать безопасный путь простым: passkeys, разумные сессии, step-up для чувствительных действий. Измерять и attack success, и пользовательские отказы.

    **Источник:** [OWASP: Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

49. (L4 [S]) Как управлять секретами в distributed системе?

    **Ответ:** Единый lifecycle inventory → выдача → использование → ротация → отзыв с владельцами и аудитом. Получать секреты по identity workload, ограничивать кэш и права, проверять массовую ротацию и outage secret manager.

    **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
