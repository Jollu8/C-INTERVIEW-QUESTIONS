# Вопросы: Network Security (с уклоном в C/C++, Linux, сетевую инженерию и практику)

## 1. Общие основы сетевой безопасности

### Базовый уровень
1. Что такое network security?

   **Ответ:** Сетевая безопасность защищает данные, identities, services и infrastructure от недопустимого чтения, изменения и нарушения работы. Она включает protocol, implementation, configuration и operational controls под конкретную модель угроз.

   **Типичная ошибка:** Считать установленный firewall или TLS полной безопасностью системы.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

2. Почему сетевую безопасность нельзя сводить только к шифрованию?

   **Ответ:** Шифрование скрывает содержание при определённых условиях, но не исправляет неверную authorization, memory corruption, stolen credentials и resource exhaustion. Нужны аутентификация, integrity, access control, limits и безопасный lifecycle ключей/сервиса.

   **Типичная ошибка:** Считать encrypted channel разрешением доверять любому полученному сообщению.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

3. Какие основные цели обычно выделяют в информационной безопасности?

   **Ответ:** Часто используют CIA: confidentiality, integrity, availability. Дополнительно рассматривают authenticity, accountability и другие свойства по задаче; они имеют разные threats и criteria.

   **Типичная ошибка:** Считать confidentiality единственной целью всех систем.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

4. Что такое confidentiality?

   **Ответ:** Конфиденциальность ограничивает раскрытие информации неуполномоченным сторонам. Защищать нужно не только payload в канале, но также endpoints, хранилища, logs и применимые metadata.

   **Типичная ошибка:** Считать TLS защитой данных после расшифрования в скомпрометированном endpoint.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

5. Что такое integrity?

   **Ответ:** Целостность защищает от недопустимого изменения/уничтожения и позволяет обнаруживать нарушение в заданной модели. Cryptographic integrity требует аутентифицированного механизма, а обычная checksum не защищает от активного противника.

   **Типичная ошибка:** Считать CRC или неключевой hash достаточной аутентификацией содержимого от attacker.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

6. Что такое availability?

   **Ответ:** Доступность означает своевременную пригодность нужного ресурса или услуги для авторизованных пользователей. Она зависит от capacity, resilience, resource limits, recovery и защиты от злоупотреблений.

   **Типичная ошибка:** Считать process alive достаточным доказательством availability услуги.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

7. Что такое authentication?

   **Ответ:** Authentication проверяет заявленную identity или происхождение сообщения в предусмотренной модели. Пароль, сертификат или token имеют смысл только с корректной проверкой и связью с конкретной identity/context.

   **Типичная ошибка:** Считать предъявление любого parseable сертификата успешной authentication.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

8. Что такое authorization?

   **Ответ:** Authorization определяет, какие действия над какими resources разрешены установленному subject в текущем контексте. Проверка должна учитывать объект/tenant/action и выполняться на соответствующей границе каждого запроса.

   **Типичная ошибка:** Считать logged-in пользователя автоматически имеющим доступ к любому object ID.

   **Источник:** [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

9. Что такое non-repudiation на базовом уровне?

   **Ответ:** Non-repudiation — наличие evidence, позволяющего связать действие/данные с субъектом и противостоять отрицанию в заданных условиях. Подпись может быть частью такого evidence, но key custody, time, audit и организационный context тоже важны.

   **Типичная ошибка:** Считать любой TLS session юридически или технически абсолютным доказательством авторства каждого app действия.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

10. Почему сетевые протоколы изначально часто не проектировались как безопасные?

   **Ответ:** Многие ранние Internet-протоколы возникали для меньшей и более доверенной среды с иными goals и ограниченными ресурсами. История различается по protocol; отсутствие встроенной защиты не следует считать безопасным сегодня без threat analysis.

   **Типичная ошибка:** Утверждать, что все старые protocols никогда не имели security objectives.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

11. Почему “работает” не означает “безопасно”?

   **Ответ:** Happy-path connectivity подтверждает функцию, но не checks под malicious input, forged identity, unauthorized action или overload. Correctness и security требуют явных invariants и проверки нештатных/враждебных условий.

   **Типичная ошибка:** Принимать успешный ping или HTTP 200 за security validation.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

12. Что такое trust boundary?

   **Ответ:** Trust boundary — место изменения уровня/основания доверия, где данные, identities или control переходят между разными security contexts. Это может быть network, process, tenant, privilege или external service boundary.

   **Типичная ошибка:** Считать границей доверия только внешний perimeter и не проверять internal requests.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).

13. Почему важно понимать, где заканчивается доверенная зона?

   **Ответ:** При переходе boundary нужны validation, authentication/authorization и ограничение ресурса под ожидаемые threats. Без явной модели внутренние данные могут ошибочно стать trusted только из-за маршрута или source IP.

   **Типичная ошибка:** Считать любой пакет из private subnet разрешённым действием пользователя.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).

14. Что такое attack surface?

   **Ответ:** Attack surface — доступные пути/интерфейсы и связанные resources, через которые противник может взаимодействовать с системой. Включает network endpoints, parsers, management, dependencies и credentials, а не только открытые TCP ports.

   **Типичная ошибка:** Оценивать surface только port scan, забывая file/config/API и supply-chain inputs.

   **Источник:** [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html).

15. Почему чем сложнее система, тем шире attack surface?

   **Ответ:** Больше interfaces, dependencies, states и privileges могут создавать новые entry points и сложные interactions. Но связь не строго монотонна по lines of code: качественная decomposition/isolation может уменьшать reachable risk.

   **Типичная ошибка:** Считать количество строк единственной количественной оценкой безопасности.

   **Источник:** [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

16. Что такое threat model?

   **Ответ:** Threat model описывает assets/security goals, attackers/capabilities, entry points/boundaries, threats и выбранные mitigations/assumptions. Она помогает приоритизировать защиту и явно показать остаточный риск.

   **Типичная ошибка:** Начинать выбор crypto/firewall до определения, от кого и что защищается.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

17. Почему без threat model трудно говорить о “достаточной” защите?

   **Ответ:** Разные attackers, последствия и trust assumptions требуют разных controls и assurance. Без целей/границ нельзя понять, закрывает ли выбранный механизм нужную threat или тратит усилия на нерелевантное.

   **Типичная ошибка:** Обещать «полностью безопасно» без attack model и условий.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

18. Что такое defense in depth?

   **Ответ:** Defense in depth использует взаимодополняющие controls, чтобы отказ одного не делал compromise полного сервиса неизбежным. Например, TLS, per-object authorization, sandbox/least privilege и detection закрывают разные layers угроз.

   **Типичная ошибка:** Считать несколько одинаково ошибочно настроенных perimeter checks независимой глубиной защиты.

   **Источник:** [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

19. Почему нельзя полагаться на один защитный механизм?

   **Ответ:** У одного control ограничен scope и возможны bug, misconfiguration или bypass, а последствия могут затронуть endpoint после канала. Дополняющие mechanisms и recovery уменьшают impact при known residual failures.

   **Типичная ошибка:** Считать VPN/TLS устранением всех application и insider угроз.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

20. Что такое secure by default?

   **Ответ:** Default configuration должна давать безопасный baseline: минимальный доступ/экспозицию, обязательные проверки и отсутствие общих production secrets. Небезопасное исключение должно быть явным и обоснованным, а не незаметной fallback-веткой.

   **Типичная ошибка:** Отключать peer verification по умолчанию ради простого первого запуска.

   **Источник:** [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

21. Что такое least privilege?

   **Ответ:** Least privilege даёт subject только необходимые permissions/resources на нужный срок. Это относится к OS capabilities, network paths, service/API scopes и data, а не только к запрету root.

   **Типичная ошибка:** Выдавать всем компонентам один admin token «для удобства интеграции».

   **Источник:** [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

22. Почему принцип least privilege важен для сетевых сервисов?

   **Ответ:** Compromise parser/handler не должен автоматически давать полный host/cluster/data доступ. Разделение identities/permissions и resource limits уменьшает ущерб и риск lateral movement.

   **Типичная ошибка:** Запускать публичный packet parser с неограниченными правами только ради bind низкого порта.

   **Источник:** [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

23. Что такое segmentation на базовом уровне?

   **Ответ:** Segmentation разделяет systems/flows на области с explicit connectivity/access rules. Она может использовать physical/logical networks и policy, но должна ограничивать реальные разрешённые пути и identities.

   **Типичная ошибка:** Считать отдельную subnet/VLAN достаточной segmentation, если routing/ACL разрешают всё.

   **Источник:** [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

24. Почему segmentation снижает blast radius?

   **Ответ:** Ограниченные paths/permissions затрудняют распространение compromise и доступ к несвязанным resources. Эффект зависит от фактических enforcement и shared dependencies, поэтому границы тестируют.

   **Типичная ошибка:** Обещать zero blast radius при общих admin credentials и management plane.

   **Источник:** [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

25. Что такое zero trust на концептуальном уровне?

   **Ответ:** Zero trust не выдаёт implicit trust только по network location/ownership, а оценивает доступ subject/device к resource по identity/context/policy. Это архитектурные принципы, не один product и не требование отключить любые уже существующие sessions на каждом packet.

   **Типичная ошибка:** Считать внутренний IP достаточным доказательством доверия или название ZTNA полным zero-trust внедрением.

   **Источник:** [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).


### Средний уровень
26. Как CIA triad проявляется в сетевых системах practically?

   **Ответ:** TLS/access/data controls защищают secrecy, authenticated messages/authorization — integrity, а limits/resilience/recovery — availability. Один механизм может помогать нескольким целям, но их fulfillment оценивают отдельно по threat model.

   **Типичная ошибка:** Проверить только encryption и объявить всю CIA triad реализованной.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

27. Почему доступность так же важна, как конфиденциальность?

   **Ответ:** Недоступный защищённый service не выполняет задачу авторизованного пользователя, а в некоторых системах задержка имеет серьёзные последствия. Threat model определяет относительный priority и допустимую деградацию, не одинаковое значение каждой цели везде.

   **Типичная ошибка:** Отключать resource limits/log capacity planning, сосредоточившись только на key length.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

28. Почему integrity может быть важнее secrecy для некоторых систем?

   **Ответ:** Команды управления, конфигурация и software updates могут быть публичными, но их подмена опасна. Authenticity/integrity нужны даже без secrecy, хотя конкретные цели должны задаваться системой.

   **Типичная ошибка:** Считать подпись ненужной потому, что содержимое не секретно.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

29. Как threat model зависит от типа сервиса: internal, public, mobile, industrial?

   **Ответ:** Меняются exposure, attacker access, device/environment control, assets и цена downtime/изменений. Internal service тоже имеет threats compromised peers/identities, а industrial/mobile добавляют свои operational constraints.

   **Типичная ошибка:** Использовать public web checklist как полную модель любой telecom/industrial/internal системы без адаптации.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).

30. Какие угрозы типичны для client-server приложений?

   **Ответ:** Типичны impersonation/MITM при неверном trust, authz/session flaws, injection/parser/memory bugs, replay и resource abuse. Конкретный набор зависит от protocol, data и privileges, поэтому нужен asset/boundary анализ.

   **Типичная ошибка:** Считать аутентифицированного клиента неспособным отправить malicious payload или exhausting requests.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

31. Какие угрозы типичны для публичных API?

   **Ответ:** Важны object/function-level authorization, credential/token misuse, input/resource limits и exposure management APIs. Encryption и token validation не проверяют автоматически право читать конкретный объект другого tenant.

   **Типичная ошибка:** Считать наличие JWT/TLS полной API access policy.

   **Источник:** [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html).

32. Какие угрозы типичны для distributed systems?

   **Ответ:** Угрозы включают compromised peers, inconsistent identities/permissions, replay/duplicates, secrets leakage и shared-resource exhaustion. Distributed failure/retry logic может влиять на integrity и availability, поэтому security invariants задают поверх states/lifecycle.

   **Типичная ошибка:** Доверять любому запросу service discovery participant без authorization контекста.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).

33. Почему encrypted traffic всё равно может оставаться уязвимым к ряду атак?

   **Ответ:** Endpoints, identity trust, authorization, resource use и malicious application input остаются за пределами одной confidentiality защиты. Encryption не скрывает обязательно все metadata и не делает небезопасный parser безопасным.

   **Типичная ошибка:** Считать encrypted transport разрешением пропустить bounds/semantic validation payload.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

34. Что такое metadata leakage?

   **Ответ:** Metadata leakage раскрывает сведения вроде endpoints, timing, размеров, частоты и traffic relationships без чтения payload. Чувствительность зависит от задачи и способности сопоставлять наблюдения.

   **Типичная ошибка:** Считать любые metadata заведомо несекретными только потому, что они не message body.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

35. Почему даже защищённый канал может раскрывать чувствительную информацию через метаданные?

   **Ответ:** Routing/transport и traffic patterns часто остаются наблюдаемыми вне зашифрованного application content. По ним можно делать inference о поведении и связях, а логи endpoints добавляют сведения; mitigations выбирают по threat model.

   **Типичная ошибка:** Обещать TLS полную анонимность и невозможность определить время/объём коммуникации.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949).

36. Что такое security control?

   **Ответ:** Security control — мера, уменьшающая вероятность/impact угрозы или позволяющая обнаружить/восстановиться после неё. Control может быть technical, process или organizational и должен иметь проверяемую цель/область.

   **Типичная ошибка:** Считать наличие продукта автоматическим доказательством эффективного control независимо от configuration и coverage.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

37. Чем preventive controls отличаются от detective controls?

   **Ответ:** Preventive мешает нежелательному действию, detective выявляет его или признаки, например access check против audit/alert. Одна мера может выполнять несколько функций, но detection не гарантирует prevention.

   **Типичная ошибка:** Принимать alert после exfiltration за доказательство, что данные не были раскрыты.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

38. Чем detective controls отличаются от corrective controls?

   **Ответ:** Detective сообщает о нарушении/подозрении, corrective ограничивает последствия и восстанавливает нужное состояние. Для реального incident response нужны подготовленные процедуры, evidence и проверка recovery, не только notification.

   **Типичная ошибка:** Считать отправленное уведомление завершённым устранением compromise.

   **Источник:** [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final); [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

39. Как observability помогает security, а не только troubleshooting?

   **Ответ:** Метрики/логи помогают увидеть необычные auth/permission failures, resource abuse, изменения policy и связи events. Correlation и контекст важны, а отсутствие alert при неполном coverage не доказывает отсутствия атаки.

   **Типичная ошибка:** Считать observability только throughput/latency dashboard без security-relevant outcomes.

   **Источник:** [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

40. Почему логирование — важная часть защиты?

   **Ответ:** Audit trail помогает обнаружить, связать и расследовать действия и проверить восстановление. Логи должны иметь полезные timestamps/context/outcomes и защиту доступа/целостности/retention с контролем потерь сбора.

   **Типичная ошибка:** Считать текстовый log в том же скомпрометированном процессе неизменным надёжным forensic evidence сам по себе.

   **Источник:** [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

41. Почему избыточное логирование тоже может быть риском?

   **Ответ:** Можно раскрыть tokens/PII/keys, усилить доступ посторонним, переполнить storage или создать logging bottleneck. Нужны minimization, redaction, access/retention и bounded throughput, без потери нужных security events.

   **Типичная ошибка:** Логировать Authorization headers, session cookies и plaintext secrets для каждого запроса.

   **Источник:** [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

42. Как secrets handling связан с network security?

   **Ответ:** Leaked credentials/keys позволяют impersonation и доступ к защищённым каналам/resources вне intended identity boundary. Нужны controlled storage/access, rotation/revocation и безопасные delivery/logging, включая build/deploy цепочку.

   **Типичная ошибка:** Считать TLS достаточной защитой ключа, уже попавшего в source code или logs.

   **Источник:** [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

43. Почему hardcoded credentials — плохая практика?

   **Ответ:** Они копируются в repository/build/artifacts, трудно индивидуально отзываются/меняются и часто становятся общими. Используют предусмотренное защищённое provisioning/storage с ограниченными identities/scopes и lifecycle.

   **Типичная ошибка:** Считать удаление секрета из последнего commit достаточным после публикации в истории без rotation.

   **Источник:** [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

44. Что такое trust on first use и где это встречается?

   **Ответ:** Trust on first use принимает/запоминает впервые увиденный key/identity и проверяет последующие соответствия; знакомый пример — SSH host keys. Первая встреча уязвима к подмене без другого trusted способа проверки.

   **Типичная ошибка:** Считать первое нажатие yes в неизвестном SSH host-key prompt независимой аутентификацией правильного сервера.

   **Источник:** [RFC 4251: SSH Protocol Architecture](https://www.rfc-editor.org/rfc/rfc4251); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

45. Почему network security требует одновременно protocol thinking и systems thinking?

   **Ответ:** Protocol задаёт identities/keys/messages и допустимые transitions, systems — memory, permissions, concurrency, resources и deployment. Ошибка любой части разрушает security property даже при корректном другом слое.

   **Типичная ошибка:** Считать сильную криптографию компенсацией use-after-free или неверной per-object authorization.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

46. Как безопасность связана с правильной конфигурацией, а не только с кодом?

   **Ответ:** Доступность management ports, trust stores, permissions, verification flags и secrets задаются configuration и могут обойти хороший код. Безопасный baseline и validation/tests configuration нужны вместе с secure implementation.

   **Типичная ошибка:** Включать verify=false в production config, считая application code автоматически защищённым TLS.

   **Источник:** [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

47. Почему security misconfiguration — одна из самых частых причин инцидентов?

   **Ответ:** Misconfiguration может открыть admin/API/storage, отключить проверки или выдать избыточные права, поэтому это существенный operational риск. Утверждение о её месте в рейтинге зависит от выборки/периода; конкретную систему оценивают по config evidence.

   **Типичная ошибка:** Объявлять configuration безопасной только потому, что сервис успешно стартует.

   **Источник:** [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

48. Как network security связана с patching and dependency management?

   **Ответ:** Известные vulnerabilities и небезопасные defaults dependencies могут сделать reachable attack path независимо от собственного кода. Нужны inventory, оценка applicability, supported updates и проверка compatibility/recovery, а не слепая смена версий.

   **Типичная ошибка:** Считать vendored/static library навсегда безопасной, раз package manager её не показывает.

   **Источник:** [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final).

49. Как software supply chain влияет на безопасность сетевых приложений?

   **Ответ:** Компрометация source/dependency/build/signing/distribution может внедрить код до сетевого запуска сервиса. Происхождение artifacts, доступ к build/secrets и verification/version management относятся к общей threat model.

   **Типичная ошибка:** Считать TLS download доказательством доброкачественности самого загруженного software artifact.

   **Источник:** [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

50. Что должен понимать C/C++ разработчик об основах сетевой безопасности до изучения TLS/VPN/атак?

   **Ответ:** Нужны trust boundaries, strict parsing/bounds, safe ownership/lifetime, authn/authz и resource limits с безопасной configuration/secret handling. Crypto используют через проверенные APIs с validation/error handling, не как замену этой модели.

   **Типичная ошибка:** Писать собственную криптографию или принимать trusted payload после encryption без semantic validation.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final).


### Продвинутый уровень
51. Как строить threat model для сетевого сервиса?

   **Ответ:** Описывают assets/goals и system/data flows, выделяют actors/capabilities, entry points и boundaries, затем threats/mitigations и residual assumptions. Модель обновляют при изменениях interfaces, deployments и зависимостей.

   **Типичная ошибка:** Составить один generic список атак и не связать его с реальными resources и flows сервиса.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

52. Как выделять assets, attackers, entry points и trust boundaries?

   **Ответ:** Assets — что нужно защитить, attacker model — чьи возможности учитываются, entry points — доступные inputs/interfaces, boundaries — смены trust/privilege. Diagram/инвентарь помогают проверить, что путь данных и control не пропущен.

   **Типичная ошибка:** Считать assets только database rows, забывая availability, keys и возможность выполнять privileged actions.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html).

53. Почему “внутренняя сеть доверенная” — опасное допущение?

   **Ответ:** Компрометированный workload/credential, insider, ошибочный routing и lateral movement могут обойти perimeter. Доступ проверяют по resource/identity/context с нужными controls, а network location — только один сигнал.

   **Типичная ошибка:** Разрешать internal admin operation любому source private IP без service/user authorization.

   **Источник:** [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

54. Как микросервисная архитектура меняет attack surface?

   **Ответ:** Добавляются APIs, service identities, discovery, secrets, dependencies и deployment/management interfaces, а partial failures усложняют policy. Isolation может уменьшить impact, если boundaries реально enforce, поэтому complexity нельзя свести к count services.

   **Типичная ошибка:** Предполагать, что каждый internal RPC доверен только потому, что оба процесса в одном cluster.

   **Источник:** [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).

55. Почему east-west traffic требует не меньшего внимания, чем north-south traffic?

   **Ответ:** Compromised peers/credentials могут атаковать соседей и sensitive data, а внутренний трафик нередко несёт privileged operations. Приоритет определяется threat/impact, а не только пересечением Internet perimeter.

   **Типичная ошибка:** Считать mTLS для external edge достаточной authorization всего east-west traffic.

   **Источник:** [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

56. Как secure defaults должны отражаться в API и конфигурации?

   **Ответ:** API/config должны требовать explicit identity/permission, safe parsing/limits и verification, закрывать лишние interfaces и не иметь общих production secrets. Небезопасные exceptions должны быть явными/ограниченными и видимыми в эксплуатации.

   **Типичная ошибка:** Автоматически fallback на plaintext/anonymous access после ошибки защищённой configuration.

   **Источник:** [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

57. Какие security invariants полезно формулировать для сетевой системы?

   **Ответ:** Примеры: запрос не выходит за authorized tenant/object scope, unverified peer не получает secrets, lengths/allocations bounded, expired/revoked identity не применяется. Invariants формулируют так, чтобы их проверять на разных input/state/failure paths.

   **Типичная ошибка:** Писать «система безопасна» вместо конкретного проверяемого ограничения доступа/состояния.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

58. Как threat modeling помогает выбирать between TLS termination, mTLS, VPN, ACLs and segmentation?

   **Ответ:** Модель показывает endpoints/trust boundaries и какие properties нужны каждому hop/identity/action. TLS/mTLS, VPN, ACL/segmentation имеют разные scopes и не взаимозаменяют app authorization или endpoint protection.

   **Типичная ошибка:** Выбирать один механизм как полную защиту всех threats, не уточнив место termination и доверие дальше.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).

59. Как оценивать компромиссы между security, performance и operability?

   **Ответ:** Сравнивают security goals/impact и measurable costs, рассматривая корректные alternatives и recovery/operation requirements. Performance tuning не должно молча разрушать invariant, например отключать verification вместо устранения handshake bottleneck.

   **Типичная ошибка:** Убирать auth/validation по benchmark без пересмотра threat model и documented requirement.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

60. Как строить security observability без чрезмерной утечки чувствительных данных?

   **Ответ:** Собирают нужные security outcomes/context с минимизацией/redaction, bounded collection и защищённым доступом/retention. Для correlation используют scoped opaque IDs вместо plaintext секретов, контролируя log injection и collector gaps.

   **Типичная ошибка:** Считать redaction фильтром последнего этапа достаточной причиной сериализовать все secrets во все промежуточные pipelines.

   **Источник:** [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

61. Какие данные можно логировать безопасно, а какие нет?

   **Ответ:** Обычно полезны timestamp, action/outcome/cause и минимальный identity/context с установленными access/retention rules. Passwords/private keys/tokens/session cookies и чувствительные payload без необходимости не логируют; PII/IP sensitivity зависит от задачи/правил обработки.

   **Типичная ошибка:** Объявлять любые идентификаторы/IP всегда безопасными для публичного бессрочного audit dump.

   **Источник:** [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

62. Почему correlation IDs полезны и для security расследований?

   **Ответ:** Они связывают действия и решения нескольких components без копирования секретного payload. ID должен иметь scope/validation и не становиться credential; attacker-controlled values учитывают при ingestion и display.

   **Типичная ошибка:** Доверять входному correlation ID как доказательству identity или log record integrity.

   **Источник:** [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

63. Как incident response зависит от качества network telemetry?

   **Ответ:** Полнота context, clocks и traces помогает отличить initial compromise, распространение и recovery effects. Retention, доступ/целостность и dropped-event accounting определяют практическую пригодность evidence.

   **Типичная ошибка:** Считать отсутствие записи в перегруженном collector доказательством отсутствия действия attacker.

   **Источник:** [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final); [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

64. Какие ошибки мышления чаще всего встречаются у инженеров в network security?

   **Ответ:** Часты trust по subnet, TLS как universal solution, authn=authz, secrecy собственных protocols, отсутствие resource bounds и blind trust dependencies. Исправление начинается с explicit assets/boundaries/invariants и проверяемых controls.

   **Типичная ошибка:** Считать неизвестность format/port заменой authentication и authorization.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

65. Какие interview вопросы по security foundations показывают зрелое мышление, а не заученные термины?

   **Ответ:** Зрелый ответ объясняет threats/assumptions, scope controls, остаточный риск и проверку failures. Например, как mTLS service всё ещё допускает cross-tenant read или как logs раскрывают действующий token.

   **Типичная ошибка:** Отвечать набором названий products/algorithms без связи с asset и attack path.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).


### Инженерные вопросы
66. Почему network security — это не отдельный модуль, а свойство всей системы?

   **Ответ:** Data/identity проходит protocols, parsers, permissions, state, deployment и operation, и любой неверный boundary может нарушить цель. Security требует согласованных controls/lifecycle и assurance, а не одного подключённого middleware.

   **Типичная ошибка:** Считать готовую security library гарантией всего business authorization и resource safety.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html).

67. Какие принципы security наиболее универсальны для network/software engineer?

   **Ответ:** Универсальны explicit trust/authorization, least privilege, safe defaults, bounded input/resources, secure secrets/lifecycle и defence in depth. Конкретные mechanisms выбирают по threats и проверяют в реальной architecture.

   **Типичная ошибка:** Переносить один checklist как полный ответ на любую среду без анализа boundary и impact.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

68. Что особенно важно знать C/C++ инженеру о security foundations?

   **Ответ:** Внешние inputs требуют strict length/type/state validation, safe memory/lifetime и resource accounting до доверенного действия. Concurrency и error/cleanup paths также security-critical, а crypto/trust checks должны корректно использовать vetted APIs.

   **Типичная ошибка:** Считать успешный parse разрешением выполнять action или ошибку allocation безопасной без проверки cleanup/state.

   **Источник:** [OWASP: Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final).

69. Как объяснить свой security mindset на интервью?

   **Ответ:** Полезно пройти system/dataflow, assets/boundaries/threats, выбранные controls и один failure/abuse case с detection/recovery. Точные assumptions и evidence убедительнее обещания «всё зашифруем» или перечня tools.

   **Типичная ошибка:** Считать security mindset максимальными ограничениями без service goals и operational feasibility.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

70. Какие темы основ безопасности нужно знать глубоко перед TLS, VPN и attack analysis?

   **Ответ:** Нужны CIA/authenticity, authentication против authorization, trust/key/identity lifecycle, threat model, safe parsing/resource limits и security telemetry. Тогда TLS/VPN/атаки анализируются по реальным endpoints/properties и остаточным threats.

   **Типичная ошибка:** Учить crypto suite names без understanding trust и права application action.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).


---

## 2. TLS/SSL: базовые концепции

### Базовый уровень
71. Что такое SSL?

   **Ответ:** Secure Sockets Layer — предшественник TLS с устаревшими версиями протокола. В разговоре «SSL-сертификат» часто означает certificate для TLS, но SSL 2.0/3.0 включать для совместимости не следует.

   **Типичная ошибка:** Путать название OpenSSL/SSL_* API с обязательным использованием wire protocol SSL.

   **Источник:** [RFC 7568: Deprecating SSL 3.0](https://www.rfc-editor.org/rfc/rfc7568); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

72. Что такое TLS?

   **Ответ:** Transport Layer Security — протокол защищённого канала с confidentiality, authenticated integrity и authentication согласно выбранной модели. Он защищает канал между endpoints, а не автоматически всю application authorization и storage.

   **Типичная ошибка:** Считать TLS доказательством безопасности business logic сервиса.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

73. Почему SSL считается устаревшим?

   **Ответ:** У SSL известны design/algorithm weaknesses, и его использование депрецировано. Современную совместимость строят на актуально поддерживаемых TLS versions/policies, а не отключением безопасных ограничений ради SSL clients.

   **Типичная ошибка:** Включать SSL 3.0 как fallback при handshake failure.

   **Источник:** [RFC 7568: Deprecating SSL 3.0](https://www.rfc-editor.org/rfc/rfc7568); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

74. Чем TLS концептуально отличается от SSL?

   **Ответ:** TLS — стандартизованное развитие защищённого transport канала с изменёнными protocol/crypto mechanisms и разными версиями. TLS 1.3 существенно отличается от TLS 1.2, поэтому «TLS против SSL» не одна мелкая настройка имени.

   **Типичная ошибка:** Считать любой TLS version безопасным только из-за отсутствия слова SSL.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 8996: Deprecating TLS 1.0 and TLS 1.1](https://www.rfc-editor.org/rfc/rfc8996); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

75. Зачем нужен TLS?

   **Ответ:** Он уменьшает риск прослушивания/подмены канала и даёт проверку peer identity в предусмотренной authentication модели. Нужны корректные trust/identity checks, cipher configuration и endpoint handling.

   **Типичная ошибка:** Использовать encryption без проверки того, с каким peer установлена связь.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

76. Какие задачи решает TLS?

   **Ответ:** Обеспечивает confidentiality, authenticated integrity record data и handshake authentication/key establishment по mode. Не гарантирует availability, app permission или защиту compromised endpoint; обычный TLS 1.3 0-RTT имеет отдельные replay limitations.

   **Типичная ошибка:** Считать все TLS application data одинаково replay-safe независимо от early data.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

77. Как TLS связан с confidentiality?

   **Ответ:** Session traffic защищается symmetric encryption с ключами, полученными из handshake/key schedule. Payload остаётся доступен на TLS endpoints, а observable metadata и app/log exposure имеют отдельный scope.

   **Типичная ошибка:** Считать TLS hiding plaintext от самого termination proxy или заражённого server process.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

78. Как TLS связан с integrity?

   **Ответ:** Authenticated record protection обнаруживает подделку защищённого data по secret keys/sequence context, а handshake связывает согласованные параметры. Это не отменяет app-level validation, multi-request replay/idempotency и storage integrity.

   **Типичная ошибка:** Считать обычный hash/CRC эквивалентом TLS record authentication от активного adversary.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

79. Как TLS связан с authentication?

   **Ответ:** В certificate mode peer доказывает владение private key и цепочка/identity проверяются клиентом; возможны и PSK modes. Authentication проверяет counterpart, не право каждой application operation.

   **Типичная ошибка:** Считать наличие любого подписанного сертификата достаточным без trust chain и expected service identity.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 5280: X.509 PKI certificate and CRL profile](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

80. Почему TLS не решает все security проблемы приложения?

   **Ответ:** TLS не исправляет authz/logic/parser bugs, secrets/log leakage и resource exhaustion. Он даёт нужные channel properties только до выбранного endpoint и при правильной validation/configuration.

   **Типичная ошибка:** Доверять всем decrypted bytes как безопасным privileged commands.

   **Источник:** [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

81. Где в сетевом стеке обычно рассматривают TLS?

   **Ответ:** Обычно TLS рассматривают между transport и application, обеспечивая channel для app protocol поверх reliable byte stream. Это практическая модель, не точное обязательное соответствие одному OSI layer; QUIC интегрирует TLS handshake иначе.

   **Типичная ошибка:** Считать TLS сетевым IP-routing протоколом либо прикладной authorization системой.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9001: Using TLS to secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

82. Почему TLS часто считают надстройкой над TCP?

   **Ответ:** Классический TLS record protocol использует reliable ordered transport, чаще TCP, поэтому его API часто оборачивает socket/BIO. TLS не устраняет TCP HOL/transport semantics; QUIC — другой transport integration.

   **Типичная ошибка:** Приравнивать TLS record boundary к границе TCP recv() или application message.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9001: Using TLS to secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

83. Можно ли использовать TLS поверх UDP?

   **Ответ:** Классический TLS record protocol не просто помещают в произвольные UDP datagrams. Для datagram protection используют DTLS, а QUIC использует TLS handshake/key schedule и собственную packet protection/recovery.

   **Типичная ошибка:** Называть HTTP/3 «TLS records поверх UDP» без QUIC layers и специальных механизмов.

   **Источник:** [RFC 9147: DTLS 1.3](https://www.rfc-editor.org/rfc/rfc9147); [RFC 9001: Using TLS to secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

84. Что такое DTLS на базовом уровне?

   **Ответ:** Datagram TLS адаптирует защищённое channel establishment/records к datagram transport, включая потери/reordering и соответствующие anti-replay механизмы. Он сам не превращает application traffic в TCP reliable ordered stream.

   **Типичная ошибка:** Считать DTLS гарантированной доставкой всех UDP application datagrams.

   **Источник:** [RFC 9147: DTLS 1.3](https://www.rfc-editor.org/rfc/rfc9147).

85. Что такое TLS handshake?

   **Ответ:** Handshake — обмен, согласующий protocol/security parameters, устанавливающий keys и аутентифицирующий parties согласно mode. Его успешность отличается от дальнейшей app authorization и полноценной обработки запроса.

   **Типичная ошибка:** Считать TCP connect() завершённым TLS handshake.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

86. Почему TLS требует handshake?

   **Ответ:** У peers сначала нет общего session traffic context и подтверждённой service identity/параметров. Handshake создаёт shared secrets и binds negotiation/transcript; resumption/early modes меняют обмен и security assumptions.

   **Типичная ошибка:** Считать handshake просто необязательным hello без security significance.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

87. Что происходит в handshake на высоком уровне?

   **Ответ:** Client/ServerHello выбирают совместимые параметры/key establishment, затем защищённые authentication/Finished сообщения подтверждают контекст и выводятся traffic keys. Certificate/PSK и retry/resumption branches зависят от версии/mode.

   **Типичная ошибка:** Считать каждый TLS handshake обязательно RSA-encryption случайного session key сертификатом.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 5246: TLS 1.2](https://www.rfc-editor.org/rfc/rfc5246).

88. Что такое certificate?

   **Ответ:** Certificate — подписанная структура, связывающая public key с identities/attributes и ограничениями/сроком в PKI. Для TLS X.509 trust требует path validation и expected identity check, а не чтение subject строки.

   **Типичная ошибка:** Считать certificate private key или сам по себе секретом, который нельзя отправлять peer.

   **Источник:** [RFC 5280: X.509 PKI certificate and CRL profile](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

89. Что такое public key?

   **Ответ:** Public key — открытая часть asymmetric key pair для соответствующих signature/key-establishment операций. Он может публиковаться, но его принадлежность нужной identity надо аутентифицировать отдельно.

   **Типичная ошибка:** Считать любой полученный public key автоматически ключом ожидаемого сервера.

   **Источник:** [RFC 4949: Internet Security Glossary](https://www.rfc-editor.org/rfc/rfc4949); [RFC 5280: X.509 PKI certificate and CRL profile](https://www.rfc-editor.org/rfc/rfc5280).

90. Что такое private key?

   **Ответ:** Private key — секретная часть asymmetric pair, позволяющая выполнять предусмотренные private operations, например подпись handshake. Доступ, rotation/revocation и backup должны соответствовать trust/impact, а certificate не содержит этот secret.

   **Типичная ошибка:** Отправлять private key клиенту вместе с certificate chain.

   **Источник:** [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

91. Что такое CA?

   **Ответ:** Certificate Authority подписывает сертификаты в PKI и имеет определённую policy/trust scope. Клиент доверяет chosen trust anchors и проверяет constraints/path, а не всем self-declared CA по факту названия.

   **Типичная ошибка:** Добавлять присланный сервером root в trust store автоматически без доверенного provisioning.

   **Источник:** [RFC 5280: X.509 PKI certificate and CRL profile](https://www.rfc-editor.org/rfc/rfc5280).

92. Зачем нужны certificate authorities?

   **Ответ:** Они позволяют строить проверяемые chains связывания key/identity без индивидуального ручного pin каждого сервера. PKI не единственная возможная trust model, а compromise CA/misissuance и revocation требуют учёта.

   **Типичная ошибка:** Считать CA гарантией добросовестности сайта или безопасности его application.

   **Источник:** [RFC 5280: X.509 PKI certificate and CRL profile](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

93. Что такое certificate chain?

   **Ответ:** Это последовательность certificates от peer к issuer/intermediates до доверенного anchor при path building/validation. Server обычно отправляет leaf и нужные intermediates; trust anchor должен быть у клиента независимо, а не становиться trusted из самой посылки.

   **Типичная ошибка:** Считать longest chain автоматически валидной или доверять любому root из handshake.

   **Источник:** [RFC 5280: X.509 PKI certificate and CRL profile](https://www.rfc-editor.org/rfc/rfc5280); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

94. Что такое server authentication?

   **Ответ:** Клиент проверяет, что канал связан с ожидаемым service peer: trust/path, identity и proof of private-key possession по protocol. Encryption alone без этой связи допускает защищённый канал к attacker endpoint.

   **Типичная ошибка:** Принимать сертификат другого trusted домена как authentication нужного hostname.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

95. Что такое mutual TLS на базовом уровне?

   **Ответ:** mTLS аутентифицирует client и server на TLS уровне, обычно с сертификатами обеих сторон. Application должна связать cert identity с permissions/tenant, а lifecycle client keys/issuance/revocation становится operational задачей.

   **Типичная ошибка:** Считать valid client certificate разрешением любых admin actions приложения.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).


### Средний уровень
96. Почему TLS обычно строится на сочетании asymmetric и symmetric cryptography?

   **Ответ:** Asymmetric mechanisms позволяют key establishment и signatures/authentication, symmetric AEAD эффективно защищает большой traffic. В TLS 1.3 PSK modes и key schedule имеют свои ветви, поэтому не всякая session обязана использовать certificates.

   **Типичная ошибка:** Считать все TLS payload bytes напрямую RSA-encrypted public key сервера.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

97. Почему asymmetric crypto не используют для шифрования всего трафика напрямую?

   **Ответ:** Asymmetric operations обычно существенно дороже и не предназначены для такого streaming record protection. TLS использует key establishment/authentication плюс symmetric traffic protection с нужными nonce/sequence rules.

   **Типичная ошибка:** Шифровать большие app payload кусками raw RSA вместо нормального TLS channel/API.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

98. Что такое session keys?

   **Ответ:** Это secrets/keys для защиты конкретного connection/epoch/direction, выведенные key schedule. В TLS 1.3 handshake/application/early и key updates различают по stage/direction; это не один вечный master encryption key.

   **Типичная ошибка:** Переиспользовать один traffic key/nonce context произвольно между независимыми sessions/directions.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

99. Как handshake приводит к созданию симметричных ключей?

   **Ответ:** Handshake получает key-establishment secret и/или PSK, а HKDF-based schedule с transcript выводит нужные handshake/application traffic secrets и keys. Raw shared secret не используют напрямую как готовый универсальный AES key.

   **Типичная ошибка:** Самостоятельно hash-конвертировать ECDHE output в один общий key в обход нормативного schedule.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

100. Что такое cipher suite?

   **Ответ:** Cipher suite обозначает согласованный набор crypto parameters, но его состав различается по TLS версии. В TLS 1.3 suite задаёт AEAD и hash для schedule/transcript, а key exchange и signature algorithms согласуются отдельно.

   **Типичная ошибка:** Считать имя TLS 1.3 suite указанием RSA/ECDHE и вида certificate как в старых suite names.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 5246: TLS 1.2](https://www.rfc-editor.org/rfc/rfc5246).

101. Что входит в выбор cipher suite?

   **Ответ:** В TLS 1.2 suite обычно связывает key exchange/authentication и record encryption/MAC, в TLS 1.3 — AEAD/hash. Version, groups, signatures и other extensions остаются отдельными inputs совместимости и security policy.

   **Типичная ошибка:** Менять только TLS 1.3 suite list, ожидая полного управления key exchange/groups и signatures.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 5246: TLS 1.2](https://www.rfc-editor.org/rfc/rfc5246).

102. Что такое key exchange?

   **Ответ:** Key exchange/establishment создаёт общий secret через предусмотренный protocol, например ephemeral (EC)DHE или PSK-based mode. Authentication binds его к peer/context; bare DH сам по себе не доказывает identity.

   **Типичная ошибка:** Считать agreement shared secret автоматической защитой от MITM без authentication.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

103. Что такое forward secrecy?

   **Ответ:** Forward secrecy означает защиту прошлых session keys от последующего раскрытия долгоживущего authentication key при соответствующих ephemeral assumptions. Не все resumption/PSK/early-data режимы дают одинаковое свойство.

   **Типичная ошибка:** Обещать FS всем TLS sessions только по слову TLS без проверки key-establishment mode.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

104. Почему forward secrecy важна?

   **Ответ:** Поздняя кража server signing key не должна автоматически расшифровать записанные прошлые ephemeral sessions. Но compromise endpoints/session secrets и отсутствие FS в конкретном mode остаются отдельными threats.

   **Типичная ошибка:** Считать FS защитой от live endpoint compromise или кражи traffic secrets.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

105. Что такое ECDHE на концептуальном уровне?

   **Ответ:** Ephemeral Elliptic Curve Diffie–Hellman использует временные key pairs для общего secret с соответствующей group. Identity подтверждается отдельной authentication частью, а ephemeral secret lifetime/удаление важны для FS assumptions.

   **Типичная ошибка:** Считать ECDHE самой цифровой подписью certificate или гарантией identity без проверки.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

106. Чем TLS 1.3 отличается от TLS 1.2 на высоком уровне?

   **Ответ:** TLS 1.3 сокращает normal handshake, меняет schedule, разделяет suite/key exchange/signature negotiation и убирает много legacy options. TLS 1.2 с подходящими settings остаётся отдельной версией, поэтому policies и APIs надо различать.

   **Типичная ошибка:** Считать version field legacy_record_version точным выбранным TLS version без supported_versions context.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

107. Почему TLS 1.3 считается более безопасным и более простым?

   **Ответ:** Убраны многие опасные/сложные legacy constructions, упрощены choices и усилен authenticated handshake/key schedule. Это уменьшает protocol risk, но implementation/configuration/identity mistakes и 0-RTT replay всё ещё возможны.

   **Типичная ошибка:** Считать TLS 1.3 разрешением отключить hostname/path validation.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9325: TLS and DTLS recommendations](https://www.rfc-editor.org/rfc/rfc9325).

108. Почему сокращение числа раундов handshake уменьшает latency?

   **Ответ:** Каждый обязательный round trip добавляет ожидание peer/network RTT, поэтому fewer flights обычно ускоряют setup на latency-heavy paths. Processing, retries/HelloRetryRequest и transport establishment также влияют; 0-RTT имеет особый threat profile.

   **Типичная ошибка:** Считать сокращение handshake равным автоматическому ускорению всего long-lived application throughput.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

109. Что такое session resumption?

   **Ответ:** Resumption использует ранее установленное PSK/session ticket-related состояние для новой session с сокращённой authentication работой. Это не повторное использование старого TCP connection и не отмена проверки lifecycle/policy.

   **Типичная ошибка:** Считать ticket бессрочным универсальным bearer-token для любых hostnames/services без scope.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

110. Зачем нужна session resumption?

   **Ответ:** Она уменьшает setup crypto/control cost и часто задержку в подходящем mode, помогая масштабу short connections. Tickets/PSK keys, lifetime, rotation, privacy и early-data policy требуют защиты; gain зависит от protocol и path.

   **Типичная ошибка:** Хранить shared ticket-encryption key неограниченно долго без lifecycle только ради максимального hit rate.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

111. Что такое 0-RTT в TLS 1.3 на базовом уровне?

   **Ответ:** Это передача early data вместе с первым сообщением возобновляемого TLS 1.3 соединения, до завершения handshake. Нужны ранее полученный PSK и разрешение сервера.

   **Типичная ошибка:** Считать 0-RTT свойством любого первого подключения.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

112. Какие риски есть у 0-RTT?

   **Ответ:** Early data допускает replay и не имеет forward secrecy относительно PSK. Для операций с побочными эффектами нужны ограничения приложения и защита от повторного выполнения.

   **Пример:** Повтор платежа недопустим; безопаснее отправить его после handshake.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

113. Что такое certificate validation?

   **Ответ:** Это проверка цепочки до доверенного корня, подписей, сроков и ограничений сертификатов; отдельно проверяют соответствие identity ожидаемому сервису и применимую политику отзыва.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

114. Почему нельзя “просто шифровать” без проверки сертификата?

   **Ответ:** Без аутентификации можно установить зашифрованный канал с посредником. Он расшифрует запрос и создаст собственное соединение с настоящим сервером.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

115. Что такое hostname verification?

   **Ответ:** Это сопоставление ожидаемого имени сервиса с допустимыми идентификаторами сертификата, прежде всего SAN. Ожидаемое имя берут из доверенного контекста запроса.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

116. Почему hostname verification критична для безопасности?

   **Ответ:** Доверенная CA может выдать сертификат другому домену. Проверка имени связывает предъявленный ключ именно с запрошенным сервисом.

   **Типичная ошибка:** Проверять только подпись CA.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

117. Что такое self-signed certificate?

   **Ответ:** Это сертификат, подписанный собственным приватным ключом соответствующего субъекта. Самоподпись сама по себе не создаёт доверия со стороны клиента.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280).

118. Когда self-signed certificates допустимы, а когда опасны?

   **Ответ:** Они допустимы при заранее и безопасно установленном доверии, например в закрытой инфраструктуре. Автоматическое принятие неизвестного self-signed сертификата позволяет подмену сервера.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

119. Что такое trust store?

   **Ответ:** Это набор доверенных якорей и связанных настроек клиента. Системный, браузерный и встроенный в приложение trust store могут различаться.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280).

120. Что такое revocation на концептуальном уровне?

   **Ответ:** Отзыв сообщает, что сертификату больше нельзя доверять до истечения срока, например после компрометации ключа. Обнаружение зависит от механизма и политики клиента.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 6960: OCSP](https://www.rfc-editor.org/rfc/rfc6960).

121. Что такое OCSP и CRL на базовом уровне?

   **Ответ:** CRL публикует подписанный список отозванных сертификатов, OCSP возвращает подписанный статус конкретного сертификата. Учитывают свежесть ответа и поведение при недоступности проверки.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 6960: OCSP](https://www.rfc-editor.org/rfc/rfc6960).

122. Почему certificate expiry — реальная operational проблема?

   **Ответ:** После notAfter корректная проверка отвергает сертификат, и новые соединения могут массово перестать работать. Нужны автоматическое продление, доставка и проверка реально выдаваемого сертификата.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

123. Какие типовые ошибки допускают с TLS конфигурацией?

   **Ответ:** Типичны выключенная проверка имени, неполная цепочка, устаревшие протоколы, открытый приватный ключ и разная конфигурация узлов балансировщика. Проверяют эффективную конфигурацию снаружи.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

124. Почему отключение проверки сертификата — крайне плохая практика?

   **Ответ:** Это устраняет проверку identity сервера и превращает ошибку доверия в возможность незаметной подмены. Исправлять нужно цепочку, имя или trust store.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

125. Что должен понимать инженер про practical TLS basics?

   **Ответ:** Нужно различать шифрование, аутентификацию и authorization; понимать цепочки, SAN, SNI, ALPN, resumption, сроки и безопасное поведение при ошибках.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Продвинутый уровень
126. Как TLS handshake выглядит по шагам на high level?

   **Ответ:** В полном TLS 1.3 handshake клиент отправляет ClientHello, сервер — ServerHello, затем защищённые параметры, сертификат, CertificateVerify и Finished; клиент проверяет их и отправляет Finished.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

127. Как client hello и server hello участвуют в согласовании параметров?

   **Ответ:** ClientHello предлагает версии, suites, groups и extensions; ServerHello фиксирует выбор и key share либо запрашивает повтор через HelloRetryRequest. Выбор должен соответствовать предложениям клиента.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

128. Как certificate chain передаётся и проверяется?

   **Ответ:** Сервер обычно передаёт leaf и intermediates. Клиент строит и проверяет путь к собственному trust anchor; переданный сервером root не становится автоматически доверенным.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

129. Как derive symmetric keys conceptually?

   **Ответ:** В TLS 1.3 HKDF получает PSK и/или (EC)DHE secret, связывает вывод с transcript и создаёт отдельные secrets для направлений и стадий.

   **Типичная ошибка:** Использовать raw DH secret напрямую как AES key.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

130. Как transcript integrity помогает безопасности handshake?

   **Ответ:** CertificateVerify и Finished связывают аутентификацию с transcript handshake. Изменение согласованных параметров посредником обнаруживается при проверке подписи или MAC.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

131. Почему downgrade attacks historically были важны для TLS evolution?

   **Ответ:** Подмена negotiation или небезопасный fallback позволяли навязать слабые варианты. TLS использует проверки согласования и downgrade protection; приложение не должно обходить ошибки небезопасным повтором.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

132. Какие слабые алгоритмы и практики считаются опасными legacy today?

   **Ответ:** SSLv2/3, TLS 1.0/1.1, RC4, экспортные suites и слабые ключи относятся к опасному наследию. Конкретную политику совместимости сверяют с актуальными рекомендациями.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

133. Как TLS termination влияет на security boundaries?

   **Ответ:** В точке termination появляется plaintext и доступ к identity/секретам сессии. Участок proxy–backend требует собственной защиты и отдельной модели доверия.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

134. Что такое end-to-end encryption vs TLS termination at proxy?

   **Ответ:** При сквозном шифровании intermediaries не получают plaintext. Terminating proxy завершает один защищённый канал и при re-encryption создаёт другой; он видит содержимое.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

135. Как load balancers and reverse proxies complicate TLS architecture?

   **Ответ:** Появляются несколько TLS legs, разные SNI/сертификаты, trust stores и правила передачи identity. Каждый участок проверяют отдельно, включая защиту backend connection.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

136. Как mTLS меняет operational complexity?

   **Ответ:** Нужно управлять клиентскими сертификатами, выдачей, отзывом, ротацией и сопоставлением identity с правами. Успешный mTLS сам по себе не определяет authorization.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

137. Как certificate rotation должна быть автоматизирована?

   **Ответ:** Автоматизируют выпуск, защищённую доставку, reload, проверку всех endpoints и оповещение до expiry. Новый сертификат проверяют с реальными trust stores до массового rollout.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

138. Какие observability ограничения появляются после включения TLS everywhere?

   **Ответ:** Пассивный capture теряет доступ к application payload. Нужны метрики endpoints/proxy, traces и классификация ошибок без записи секретов.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

139. Как packet captures становятся менее полезны без decryption keys?

   **Ответ:** Видны транспортные симптомы и часть handshake metadata, но не содержимое зашифрованных records. Для расшифрования нужны подходящие session secrets; одного server private key обычно недостаточно.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

140. Как security debugging TLS differs from plain TCP debugging?

   **Ответ:** Сначала проверяют TCP, затем negotiation, identity и trust. TCP success не доказывает TLS success; логи библиотеки важнее попыток угадать причину по timeout.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

141. Как C/C++ libraries обычно реализуют TLS abstractions?

   **Ответ:** Библиотека предоставляет context/configuration, объект соединения, handshake и read/write поверх транспорта. Приложение управляет lifetime, проверкой peer, readiness и deadlines.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

142. Какие ошибки использования OpenSSL/BoringSSL/wolfSSL типичны?

   **Ответ:** Типичны отключённая verification, отсутствие hostname check, неверная обработка WANT_READ/WANT_WRITE, ошибки lifetime и игнорирование error queue. Точные контракты зависят от библиотеки.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

143. Почему memory safety особенно важна в TLS-related C/C++ code?

   **Ответ:** Парсинг недоверенных records и ошибки владения буферами могут привести к утечке ключей или выполнению кода. Криптография не исправляет out-of-bounds и use-after-free.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

144. Какие interview вопросы по TLS хорошо выявляют реальное инженерное понимание?

   **Ответ:** Полезно спросить, почему доверенная цепочка не заменяет hostname check и как обработать SSL_write, вернувший WANT_READ. Ответ должен раскрывать trust и state machine.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

145. Что особенно важно знать о TLS C/C++ инженеру, даже если он не пишет криптографию сам?

   **Ответ:** Нужны проверка peer, управление секретами/буферами, nonblocking handshake, deadlines и диагностика. Криптографические примитивы и протокол следует брать из поддерживаемой библиотеки.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Инженерные вопросы
146. Почему TLS — один из фундаментальных building blocks современной сети?

   **Ответ:** TLS предоставляет стандартный аутентифицированный защищённый канал поверх недоверенной сети. Это позволяет приложениям не изобретать собственное согласование ключей и защиту records.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

147. Какие компромиссы TLS создаёт между security, latency и operability?

   **Ответ:** Handshake требует RTT и CPU, сертификаты — автоматизации, шифрование — endpoint telemetry. Resumption уменьшает стоимость, но ticket management и 0-RTT добавляют требования.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

148. Когда TLS защищает хорошо, а когда даёт ложное чувство безопасности?

   **Ответ:** TLS защищает канал между проверенными endpoints; он не предотвращает компрометацию endpoints, неверную authorization или утечки после расшифрования.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

149. Как объяснить TLS на интервью через handshake, certificates и trust?

   **Ответ:** Клиент согласует параметры и ключи, проверяет identity сервера по сертификату и trust anchors, затем стороны защищают records. Права пользователя проверяются отдельно.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

150. Какие TLS темы нужно знать глубоко network/software engineer?

   **Ответ:** Глубоко нужны identity validation, handshake/error states, сертификаты, nonblocking I/O, resumption и эксплуатация. Детали примитивов зависят от роли и не заменяют корректный API.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

---

## 3. TLS/SSL: практическая эксплуатация и отладка

### Базовый уровень
151. Как понять, что проблема именно в TLS, а не в TCP connectivity?

   **Ответ:** Разделяют DNS, connect и TLS handshake по отдельным результатам и временам. Установленный TCP с последующим TLS alert указывает на стадию TLS, но не определяет причину.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

152. Что означает TLS handshake failure?

   **Ответ:** Стороны не завершили согласование защищённой сессии. Причину ищут в версии, algorithms, сертификатах, mTLS и transport interruption по ошибкам обеих сторон.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

153. Почему `connection refused` и `TLS handshake failed` — разные классы проблем?

   **Ответ:** Refused относится к отказу установления транспорта, часто TCP RST. TLS failure возникает при попытке согласовать TLS поверх доступного транспорта.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

154. Что означает certificate expired?

   **Ответ:** Проверяемое время находится после notAfter сертификата. Проверяют часы, leaf и intermediates, а также сертификаты всех узлов и SNI-вариантов.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280).

155. Что означает hostname mismatch?

   **Ответ:** Ожидаемая identity не соответствует SAN сертификата. Проверяют имя запроса, proxy routing и выбранный сертификат; изменение DNS само по себе проверку не исправляет.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

156. Почему client может не доверять сертификату сервера?

   **Ответ:** Возможны неизвестный root, отсутствующий intermediate, неверные часы, ограничения цепочки или interception. Проверяют именно trust store проблемного клиента.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280).

157. Что такое unsupported protocol version в TLS?

   **Ответ:** Стороны не нашли допустимую общую TLS версию либо политика её отвергла. Сравнивают поддерживаемые версии клиента, сервера и посредников.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

158. Что такое unsupported cipher?

   **Ответ:** Нет совместимого разрешённого suite либо связанной криптографической возможности. В TLS 1.3 groups и signatures согласуются отдельно от cipher suite.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

159. Что означает alert в TLS на базовом уровне?

   **Ответ:** Alert — сообщение TLS о закрытии или ошибке. Его код помогает классификации, но локальная ошибка проверки может быть подробнее удалённого alert.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

160. Почему TLS errors часто выглядят для пользователей как “сайт не открывается”?

   **Ответ:** Пользователь видит общий отказ запроса, хотя он мог случиться после DNS и TCP, до HTTP. Для диагностики UI/logs должны различать стадии.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

### Средний уровень
161. Как инструменты вроде `openssl s_client` помогают в troubleshooting?

   **Ответ:** s_client показывает handshake, цепочку и параметры TLS. Для проверки задают ожидаемое имя и fail-on-verification: `openssl s_client -connect example.com:443 -servername example.com -verify_hostname example.com -verify_return_error`.

   **Источник:** [OpenSSL: s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/).

162. Как проверить certificate chain вручную?

   **Ответ:** Сохраняют leaf/intermediates и проверяют путь относительно нужных CA: `openssl verify -CAfile roots.pem -untrusted intermediates.pem -verify_hostname example.com leaf.pem`. Проверять нужно доверие клиента.

   **Источник:** [OpenSSL: verify](https://docs.openssl.org/3.0/man1/openssl-verify/).

163. Как проверить срок действия сертификата?

   **Ответ:** `openssl x509 -in leaf.pem -noout -dates` показывает notBefore/notAfter. Для предупреждения об expiry используют `-checkend 604800`; проверяют также intermediates.

   **Источник:** [OpenSSL: x509](https://docs.openssl.org/3.0/man1/openssl-x509/).

164. Как проверить SAN/CN в сертификате?

   **Ответ:** `openssl x509 -in leaf.pem -noout -subject -ext subjectAltName` показывает subject и SAN. Современную service identity проверяют по SAN, не по произвольному CN.

   **Источник:** [OpenSSL: x509](https://docs.openssl.org/3.0/man1/openssl-x509/).

165. Как понять, что проблема в intermediate certificate?

   **Ответ:** Сравнивают переданную цепочку с issuer leaf и проверяют построение пути на чистом клиентском trust store. Missing intermediate нельзя исправлять отключением verification.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [OpenSSL: s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/).

166. Почему missing intermediate certificate часто ломает только часть клиентов?

   **Ответ:** Некоторые клиенты уже кешировали intermediate или умеют получать его дополнительно. Другие располагают только отправленной сервером цепочкой и собственными anchors.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280).

167. Как debug-ить handshake mismatch между client и server?

   **Ответ:** Сопоставляют версии, suites, signature algorithms, groups, SNI и mTLS settings. Меняют по одному параметру и используют логи сервера вместе с клиентскими.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

168. Почему старые клиенты могут не поддерживать современные TLS settings?

   **Ответ:** Старые стеки могут не знать новые версии, algorithms, roots или extensions. Проверяют реальную матрицу клиентов и обновляют зависимости вместо безусловного ослабления сервера.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

169. Как TLS interception/proxy влияет на диагностику?

   **Ответ:** Interception создаёт отдельные TLS sessions и предъявляет сертификат proxy CA. Проверяют issuer, trust stores и обе стороны proxy; захват только одного leg недостаточен.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

170. Как mTLS failures отличаются symptomatically от обычного server-auth TLS?

   **Ответ:** При mTLS сервер дополнительно проверяет клиентский сертификат. Ошибка может касаться его отсутствия, chain, EKU или mapping identity; смотреть нужно server-side verification.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280).

171. Как packet capture помогает при TLS debugging, даже без расшифровки?

   **Ответ:** Capture показывает retransmissions, resets, размеры и часть открытого handshake. Это отделяет транспортный обрыв от negotiation, но не раскрывает причину encrypted alert автоматически.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

172. Какие фазы TLS можно увидеть по длинам пакетов и alerts?

   **Ответ:** Можно видеть ClientHello/ServerHello и сетевые паузы; в TLS 1.3 последующие handshake messages обычно зашифрованы. Размер records не даёт надёжной полной реконструкции фаз.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

173. Почему SNI важно practically?

   **Ответ:** SNI передаёт имя нужного сервера в ClientHello и позволяет выбрать virtual host/сертификат. Оно не заменяет hostname verification.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

174. Как отсутствие/ошибка SNI ломает virtual hosting over TLS?

   **Ответ:** Без правильного SNI сервер может выбрать default virtual host и чужой сертификат. Тестируют нужное имя при подключении к конкретному IP.

   **Источник:** [OpenSSL: s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/).

175. Что такое ALPN на базовом уровне?

   **Ответ:** ALPN согласует прикладной протокол внутри TLS, например `h2` или `http/1.1`. Клиент предлагает список, сервер выбирает поддерживаемый вариант.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

176. Почему ALPN важно для HTTP/2 и HTTP/3 ecosystem?

   **Ответ:** ALPN позволяет выбрать HTTP mapping: `h2` для HTTP/2, `h3` для HTTP/3 в QUIC. Совпадение порта 443 само по себе протокол не определяет.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

177. Как TLS handshake latency измерять practically?

   **Ответ:** Измеряют длительность от начала TLS negotiation до завершения handshake, отдельно от DNS/connect. Разделяют full/resumed sessions, версии, ошибки и перцентили.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

178. Как session resumption влияет на latency и load?

   **Ответ:** Resumption сокращает повторную authentication работу и может уменьшать setup latency. Измеряют hit rate, CPU и latency; возобновление не означает автоматическое использование 0-RTT.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

179. Какие security misconfigurations TLS наиболее часты в production?

   **Ответ:** Часты неполная цепочка, просроченные certs, отключённая backend verification, слабые legacy settings и ошибочная mTLS policy. Проверяют каждый TLS leg и узел.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

180. Что должен понимать software engineer про TLS troubleshooting workflow?

   **Ответ:** Последовательность: DNS → TCP → TLS version/negotiation → chain/identity → ALPN → application. Фиксируют имя, endpoint, время и библиотечную ошибку до изменения настроек.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Продвинутый уровень
181. Как distinguish trust-store issue, hostname-verification issue and protocol mismatch?

   **Ответ:** Trust-store issue ломает путь доверия; hostname issue — соответствие SAN; protocol mismatch — negotiation до успешной аутентификации. Сохраняют точный verification/alert code.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

182. Как trace TLS failure across proxy, backend and client?

   **Ответ:** По request/connection ID связывают frontend TLS и backend TLS logs. Проверяют SNI, trust и время каждого leg, включая реальный backend за балансировщиком.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

183. Какие метрики полезны для TLS observability: handshake latency, alert types, cert expiry windows, resume rate?

   **Ответ:** Полезны handshake latency/error rate, verification/alert classes, expiry каждого endpoint, negotiated versions и resumption rate. Метрики разделяют по роли, leg и версии клиента.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

184. Как certificate rotation can fail operationally?

   **Ответ:** Выпуск мог пройти, а доставка/reload — нет; возможны неверный key, missing intermediate и старые certs на части узлов. Проверяют сертификат, реально выдаваемый каждым endpoint.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

185. Почему distributed systems with many internal certs require strong automation?

   **Ответ:** Ручное продление не масштабируется и создаёт несогласованные сроки/настройки. Автоматизация должна покрывать inventory, выпуск, доставку, reload, проверку и recovery.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

186. Как decryption with session keys can help lab debugging and why it’s risky in production?

   **Ответ:** Session secrets позволяют связать capture с plaintext для воспроизводимого разбора. Они раскрывают содержимое сессий, поэтому доступ и срок хранения ограничивают; production key logging требует строгого контроля.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

187. Какие pitfalls у TLS offload architecture?

   **Ответ:** Риски: plaintext до backend, пропущенная проверка backend identity, чрезмерное доверие forwarded headers и единая точка хранения ключей. Каждую границу защищают отдельно.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

188. Как C/C++ application should surface TLS errors usefully instead of opaque failure?

   **Ответ:** Возвращают стадию, категорию TLS ошибки, verification result и безопасный контекст endpoint. Error queue сохраняют сразу; пользователю не предлагают обходить trust checks.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

189. Какие errno and library-level errors важно различать при TLS over TCP?

   **Ответ:** Различают syscall errno, TLS alerts, verification errors, WANT_READ/WANT_WRITE и корректное TLS закрытие. SSL_get_error вызывают по контракту, не заменяя его чтением errno.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

190. Как test TLS configurations in CI/CD?

   **Ответ:** В CI проверяют разрешённые версии, цепочку, hostname, mTLS и отрицательные случаи: expired, wrong name, unknown CA. Проверяют frontend и backend конфигурации.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

191. Какие interview вопросы по TLS operations показывают production experience?

   **Ответ:** Полезен разбор ротации, сломавшей часть клиентов: ожидаются проверка цепочек, trust stores, узлов, SNI и rollback с сохранением verification.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

192. Какие anti-patterns чаще всего вредят TLS reliability and security?

   **Ответ:** Вредят ручная ротация, `verify=false`, слепой retry, один сертификат без inventory и непрозрачные ошибки. Эти практики превращают ожидаемые события в массовые outages.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

193. Как design safe certificate rollout and rollback?

   **Ответ:** Сначала проверяют key/chain/identity и клиентов, затем canary и rollout. Сохраняют рабочую конфигурацию для rollback, не возвращая скомпрометированные ключи.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

194. Как combine TLS logging with privacy requirements?

   **Ответ:** Пишут техническую категорию ошибки, стадию и correlation ID; исключают ключи, session secrets, tokens и payload. Доступ/retention задают по чувствительности.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

195. Что особенно важно знать senior engineer про TLS failure analysis?

   **Ответ:** Нужно локализовать конкретный TLS leg и отличать transport, negotiation и identity failures. Вывод подтверждают клиентскими и серверными данными за одно время.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Инженерные вопросы
196. Почему хороший TLS deployment требует не только криптографии, но и хорошей эксплуатации?

   **Ответ:** Без выпуска, доставки, reload и мониторинга правильная криптография перестаёт быть доступным сервисом. Сроки и изменения trust требуют предсказуемого operational lifecycle.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

197. Какие TLS operational mistakes самые дорогие в реальной жизни?

   **Ответ:** Наиболее дороги expiry без мониторинга, потеря private key, массовая смена CA без rollout и отключение validation. План восстановления проверяют заранее.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

198. Что стоит логировать для TLS-инцидентов в production?

   **Ответ:** Логируют стадию, endpoint/SNI при допустимости, version, ALPN, verification code, alert и correlation ID. Приватные ключи и authentication tokens не записывают.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

199. Как объяснить TLS troubleshooting на интервью?

   **Ответ:** Описывают последовательный пример: TCP работает, chain verification падает, отсутствует intermediate; после доставки полной цепочки проверяют проблемный клиент и error rate.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

200. Какие практические темы TLS обязательны для сильного network/C++ engineer?

   **Ответ:** Нужны s_client/verify, chain и SAN checks, mTLS, nonblocking TLS, certificate rollout и endpoint telemetry. Практика должна включать отрицательные сценарии.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

---

## 4. HTTPS

### Базовый уровень
201. Что такое HTTPS?

   **Ответ:** HTTPS — HTTP с защищённым транспортом и аутентификацией сервера. Для HTTP/1.1 и HTTP/2 обычно используется TLS поверх TCP; HTTP/3 использует QUIC с TLS 1.3.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

202. Чем HTTPS отличается от HTTP?

   **Ответ:** HTTPS добавляет защиту канала и identity сервера к HTTP semantics. Методы, статусы и прикладная authorization остаются отдельными механизмами.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

203. Почему HTTPS = HTTP поверх TLS?

   **Ответ:** Для HTTP/1.1 и HTTP/2 HTTP messages передаются внутри TLS. HTTP/3 сохраняет защищённую HTTPS семантику, используя QUIC вместо TLS records поверх TCP.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

204. Какие проблемы HTTPS решает по сравнению с plain HTTP?

   **Ответ:** HTTPS защищает содержимое от чтения и изменения в пути и подтверждает сервер при корректной проверке. Оно не устраняет уязвимости endpoints.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

205. Защищает ли HTTPS содержимое запроса и ответа?

   **Ответ:** Заголовки и тело HTTP защищены между TLS endpoints. В terminating proxy и конечном приложении они доступны в открытом виде.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

206. Что именно HTTPS не скрывает полностью?

   **Ответ:** Обычно видны IP endpoints, размеры и времена передачи; DNS и имя сервера могут раскрываться в зависимости от используемых механизмов. Наличие HTTPS не гарантирует анонимность.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

207. Почему URL path/query historically могли утекать в разных местах, несмотря на HTTPS?

   **Ответ:** Path/query защищены в канале, но могут попасть в browser history, server/proxy logs и Referer согласно политике. Поэтому секреты не следует помещать в URL.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

208. Что такое secure transport for web?

   **Ответ:** Это передача HTTP с проверенной identity сервера и защитой конфиденциальности/целостности до TLS endpoint. Backend legs требуют собственной оценки доверия.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

209. Почему сегодня HTTPS считается default, а не optional feature?

   **Ответ:** Даже публичную страницу могут подменить в пути; API часто передают credentials и персональные данные. Защищённый транспорт нужен и для integrity публичного контента.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

210. Что такое mixed content?

   **Ответ:** Mixed content возникает, когда HTTPS страница запрашивает ресурсы по незащищённому HTTP. Поведение блокировки/обновления зависит от типа ресурса и браузера.

   **Источник:** [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

211. Почему mixed content опасен?

   **Ответ:** Подмена script или другого активного ресурса может скомпрометировать защищённую страницу. HTTPS основного HTML не защищает отдельно загруженный HTTP ресурс.

   **Источник:** [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

212. Что такое HSTS?

   **Ответ:** HSTS — политика, полученная по HTTPS, требующая обращаться к хосту через HTTPS в течение max-age. Опционально она распространяется на поддомены.

   **Источник:** [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797).

213. Зачем нужен HSTS?

   **Ответ:** HSTS предотвращает последующие HTTP подключения к известному хосту и обход некоторых certificate errors. Первое посещение требует отдельного решения, например preload.

   **Источник:** [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797).

214. Почему редирект с HTTP на HTTPS сам по себе не идеален без HSTS?

   **Ответ:** Первый HTTP запрос ещё не защищён, и посредник может заменить redirect. HSTS, уже известная клиенту, переводит запрос на HTTPS до сетевой передачи.

   **Источник:** [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797).

215. Что такое secure cookie?

   **Ответ:** Cookie с атрибутом Secure передаётся браузером по защищённому соединению. Этот атрибут не запрещает доступ JavaScript и не предотвращает CSRF сам по себе.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

216. Что означает флаг HttpOnly?

   **Ответ:** HttpOnly запрещает доступ к cookie через обычные JavaScript cookie APIs. Браузер продолжает отправлять её в подходящих HTTP запросах; XSS всё ещё опасен.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

217. Что означает SameSite на базовом уровне?

   **Ответ:** SameSite ограничивает отправку cookies в cross-site контекстах: Strict, Lax или None. Для None современные браузеры требуют Secure; правила зависят от контекста запроса.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

218. Почему cookie security тесно связана с HTTPS?

   **Ответ:** Перехваченный session cookie позволяет захватить сессию. HTTPS и Secure защищают транспорт, а HttpOnly/SameSite дополняют защиту от других каналов злоупотребления.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

219. Что такое TLS termination у reverse proxy?

   **Ответ:** Reverse proxy завершает клиентский TLS и получает HTTP plaintext. Далее он передаёт запрос backend по отдельному соединению, которое при необходимости тоже защищают TLS.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

220. Почему HTTPS важен не только для браузеров, но и для API?

   **Ответ:** API передают tokens, данные и управляющие команды. HTTPS защищает канал независимо от того, работает клиент в браузере или в C++ сервисе.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Средний уровень
221. Как HTTPS помогает против MITM?

   **Ответ:** Проверенный сертификат связывает ключ с сервером, а TLS аутентифицирует handshake и records. Посредник без нужных ключей не может незаметно подменить содержимое.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

222. Почему HTTPS без корректной валидации сертификата не даёт достаточной защиты?

   **Ответ:** Шифрование с непроверенным peer может защищать соединение с атакующим. Проверяют и доверенную цепочку, и ожидаемую identity сервиса.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

223. Почему HTTPS не защищает от уязвимостей приложения типа XSS/SQL injection?

   **Ответ:** XSS и SQL injection эксплуатируют обработку данных после расшифрования. Нужны безопасный вывод, parameterized queries, validation и authorization в приложении.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

224. Как HTTPS влияет на caching, proxies и observability?

   **Ответ:** Промежуточный узел без TLS termination не читает HTTP и не кеширует его как обычный HTTP proxy. Terminating CDN может кешировать по HTTP правилам.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

225. Что такое HTTPS interception в enterprise environments?

   **Ответ:** Enterprise proxy завершает TLS, анализирует plaintext и создаёт TLS к серверу. Клиент доверяет установленной корпоративной CA; proxy становится чувствительной границей доверия.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

226. Какие риски и плюсы у TLS termination на edge proxy?

   **Ответ:** Edge централизует certificate management и filtering, но получает plaintext и ключи. Backend protection и доверие к identity headers должны быть заданы явно.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

227. Как end-to-end HTTPS through proxy differs from terminated-and-reencrypted traffic?

   **Ответ:** При passthrough proxy пересылает зашифрованный поток и не читает HTTP. При termination/re-encryption он видит plaintext между двумя независимыми защищёнными каналами.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

228. Почему secure headers важны вместе с HTTPS?

   **Ответ:** HTTPS защищает транспорт; CSP, HSTS и другие headers задают browser-side правила обработки контента. Они закрывают другие классы угроз.

   **Источник:** [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

229. Что такое certificate pinning на концептуальном уровне?

   **Ответ:** Pinning ограничивает доверие заранее ожидаемым ключом или сертификатом. Это дополнительная проверка, требующая безопасного обновления и recovery.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

230. Какие проблемы у pinning operationally?

   **Ответ:** Смена key/CA или потеря backup pin может заблокировать клиентов. Нужны управляемое обновление, overlap и план восстановления; устаревший HPKP для браузеров не следует внедрять.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

231. Почему browser padlock не означает “сайт безопасен во всех смыслах”?

   **Ответ:** Индикатор соединения говорит о транспортной защите и проверке identity, но не о честности владельца сайта, отсутствии malware или корректности приложения.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

232. Как HTTPS влияет на authentication flows?

   **Ответ:** HTTPS защищает credentials, tokens и redirects в пути. OAuth/OIDC state, redirect URI validation и session controls остаются обязательными на прикладном уровне.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

233. Почему bearer tokens обязательно должны ходить только через HTTPS?

   **Ответ:** Bearer token даёт полномочия предъявителю; перехват позволяет использовать его без знания дополнительного секрета. HTTPS обязателен, но token также защищают в logs/storage.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

234. Как HTTPS protects REST/gRPC APIs?

   **Ответ:** TLS защищает HTTP messages, включая REST bodies и gRPC metadata/data, между endpoints. Authorization, quotas и input validation реализуются отдельно.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

235. Почему internal services тоже часто требуют HTTPS or mTLS?

   **Ответ:** Внутренняя сеть допускает compromised hosts и ошибки маршрутизации. HTTPS защищает канал, mTLS дополнительно проверяет service identity; права задают отдельно.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

236. Как redirect loops and misconfigured TLS break HTTPS deployments?

   **Ответ:** Proxy может считать исходный HTTPS запрос HTTP и бесконечно перенаправлять обратно. Проверяют trusted forwarded-proto, canonical scheme и TLS конфигурацию каждого hop.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

237. Что такое SNI and virtual hosting practically in HTTPS?

   **Ответ:** SNI выбирает TLS virtual host до HTTP. Позже Host/:authority выбирает HTTP ресурс; их несогласованность требует предусмотренной сервером политики.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

238. Как CDN/proxy/load balancer architecture влияет на HTTPS design?

   **Ответ:** У каждого leg свои сертификаты, TLS policy и identity. Проверяют edge и origin, доверенные proxy headers, routing и расположение plaintext.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

239. Какие security headers полезны вместе с HTTPS?

   **Ответ:** Часто полезны HSTS, CSP, X-Content-Type-Options и Referrer-Policy; session cookies требуют Secure/HttpOnly/SameSite. Настройки выбирают под приложение и проверяют совместимость.

   **Источник:** [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html); [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

240. Что должен понимать инженер про HTTPS beyond “включить сертификат”?

   **Ответ:** Нужны lifecycle сертификатов, validation всех legs, HTTP routing, headers/cookies и безопасная обработка credentials. Сертификат без этих настроек не завершает HTTPS deployment.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### Продвинутый уровень
241. Как HTTPS affects web security posture end to end?

   **Ответ:** HTTPS уменьшает сетевую поверхность атаки, но end-to-end posture также зависит от DNS/trust, proxy, browser policy, session handling и безопасности backend.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

242. Какие attack surfaces остаются even with perfect HTTPS?

   **Ответ:** Остаются XSS, injection, broken authorization, credential theft, endpoint compromise и application DoS. Защита канала не устраняет эти уязвимости.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

243. Как HSTS preload helps and what are operational risks?

   **Ответ:** Preload заранее сообщает браузеру обязательность HTTPS, закрывая первое HTTP посещение. Длительное распространение/удаление записи требует готовности всех затронутых поддоменов.

   **Источник:** [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797); [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

244. Как secure cookie configuration interacts with cross-site auth flows?

   **Ответ:** Strict/Lax могут мешать некоторым cross-site flows; None требует Secure и увеличивает важность CSRF controls. Проверяют реальный redirect/form сценарий, а не отключают защиту глобально.

   **Источник:** [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

245. Как service mesh / ingress gateways change HTTPS boundaries?

   **Ответ:** Ingress и sidecars становятся TLS endpoints. Определяют, кто проверяет service identity, где plaintext и как proxy identity передаётся приложению без возможности подмены.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

246. Какие telemetry and logs useful for HTTPS incidents without violating privacy?

   **Ответ:** Полезны stage timings, status/error classes и correlation IDs. URL query, Authorization и cookies редактируют или исключают; retention ограничивают.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

247. Как C/C++ HTTP clients/servers typically integrate TLS for HTTPS?

   **Ответ:** HTTP стек использует TLS backend для handshake, verification и encrypted I/O. Проверяют, что настройки CA, hostname, SNI и ALPN согласованы с URL.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

248. Какие pitfalls типичны у custom HTTP clients with TLS validation?

   **Ответ:** Часты verify-chain без hostname, неправильный SNI, доверие любому redirect и выключение verification после ошибки. После redirect проверяют новую identity и передачу credentials.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

249. Как debug HTTPS failures through proxies and layered infrastructure?

   **Ответ:** Отдельно проверяют client–proxy, proxy–origin и HTTP routing. Для каждого leg фиксируют endpoint, имя, TLS error и время, затем связывают запросы.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

250. Какие interview вопросы по HTTPS показывают зрелое понимание, а не только определение?

   **Ответ:** Предложите объяснить HTTPS к origin через CDN и последствия выключенной backend verification. Сильный ответ выделяет trust boundaries, сертификаты и передачу identity.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### Инженерные вопросы
251. Почему HTTPS — это необходимый минимум, а не полный security solution?

   **Ответ:** HTTPS защищает транспорт, но не определяет разрешённые действия и не проверяет business logic. Нужны authorization, безопасный parsing и session management.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

252. Какие темы HTTPS особенно важны для backend and network engineers?

   **Ответ:** Важны verification, termination/passthrough, certificate lifecycle, HTTP routing, proxy headers, cookies и observability. Глубина зависит от ответственности за client, ingress или backend.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

253. Что должен знать C/C++ инженер о корректной работе HTTPS clients/servers?

   **Ответ:** Нужно корректно связать URL identity с TLS, обработать nonblocking I/O/errors, deadlines и redirects. Владение буферами и соединениями должно быть явным.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

254. Как объяснить HTTPS на интервью через threats and protections?

   **Ответ:** Сначала описывают угрозы чтения, подмены и impersonation, затем TLS channel и проверку identity. Завершают границами защиты: endpoints и authorization.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

255. Какие HTTPS ошибки особенно опасны в production?

   **Ответ:** Опасны отключённая verification, plaintext backend с секретами, доверие spoofed proxy headers и утечки tokens в URL/logs. Проверяют всю цепочку обработки запроса.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

---

## 5. VPN: общая идея

### Базовый уровень
256. Что такое VPN?

   **Ответ:** VPN создаёт логическую частную связность поверх другой сети. Защищённые VPN дополнительно аутентифицируют peers и шифруют трафик между концами туннеля.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

257. Зачем нужен VPN?

   **Ответ:** Он позволяет безопасно соединить удалённого пользователя или площадки через недоверенную сеть и применять централизованные политики доступа.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

258. Что означает virtual private network?

   **Ответ:** Это логическая сеть с ограниченным участием поверх общей инфраструктуры. Слово private описывает изоляцию; конкретные гарантии шифрования зависят от технологии.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

259. Какие задачи обычно решает VPN?

   **Ответ:** Типовые задачи: удалённый доступ, соединение филиалов и защищённая overlay-сеть. Для каждой нужны адресный план, routing, identity и access policy.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

260. Чем VPN отличается от TLS for one application?

   **Ответ:** TLS обычно защищает соединение приложения; VPN переносит выбранный сетевой трафик между peers. VPN не заменяет проверку identity конечного приложения.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

261. Почему VPN operating at network layer даёт другой scope защиты?

   **Ответ:** L3 VPN может переносить IP пакеты разных приложений по routing policy. Защита заканчивается у VPN endpoint, который может находиться далеко от сервера.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

262. Какие use cases бывают у VPN: remote access, site-to-site, internal overlay?

   **Ответ:** Remote access соединяет пользователя с сетью, site-to-site — площадки, overlay — логические endpoints поверх underlay. Их маршруты и доверие проектируют отдельно.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

263. Почему VPN не равен “анонимности” автоматически?

   **Ответ:** VPN gateway видит metadata и часто исходящий трафик; сайты идентифицируют пользователя по аккаунтам/cookies. VPN меняет маршрут и доверенную сторону, а не гарантирует анонимность.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

264. Что такое tunnel на базовом уровне?

   **Ответ:** Туннель переносит пакет одного протокола внутри другого до удалённого endpoint. Дальше внутренний пакет извлекают и маршрутизируют.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

265. Почему tunneling — ключевая идея VPN?

   **Ответ:** Инкапсуляция позволяет пересечь сеть, которая знает только внешние endpoints. Внутренняя адресация и политики могут отличаться от underlay.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

266. Что значит encapsulation в контексте VPN?

   **Ответ:** К внутреннему пакету добавляют внешние заголовки и необходимые служебные поля. Это меняет размер и эффективную MTU пути.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

267. Что значит encrypted tunnel?

   **Ответ:** Это туннель, где содержимое защищено криптографически между аутентифицированными endpoints. Внешние IP и некоторые характеристики потока остаются видимыми.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

268. Что такое remote access VPN?

   **Ответ:** Пользовательский endpoint устанавливает туннель к gateway для доступа к разрешённым внутренним ресурсам. Нужны индивидуальная identity, отзыв доступа и endpoint policy.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

269. Что такое site-to-site VPN?

   **Ответ:** Gateway каждой площадки защищает выбранный межсетевой трафик. Узлам за gateways не обязательно самостоятельно реализовывать VPN.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

270. Что такое full tunnel?

   **Ответ:** Full tunnel направляет через VPN весь предусмотренный политикой трафик, обычно включая default route. IPv4, IPv6 и DNS нужно учитывать явно.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

271. Что такое split tunnel?

   **Ответ:** Split tunnel направляет в VPN только выбранные подсети или потоки, оставляя остальной трафик на обычном пути.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

272. Почему split tunneling — это security trade-off?

   **Ответ:** Split tunnel снижает нагрузку и задержку, но часть трафика обходит корпоративные controls. Нужны точные routes, DNS policy и защита endpoint.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

273. Какие протоколы VPN ты знаешь?

   **Ответ:** Примеры: IPsec/IKEv2, WireGuard и OpenVPN. Их dataplane, управление identity и способы прохождения NAT различаются; GRE сам по себе шифрования не даёт.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

274. Где обычно используют IPsec?

   **Ответ:** IPsec используют для site-to-site, remote access и сетевой защиты между gateways/hosts, особенно при требованиях к совместимости оборудования.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

275. Где обычно используют WireGuard?

   **Ответ:** WireGuard удобен для защищённых L3 overlays, соединения площадок и устройств. Выдача пользователей, MFA и orchestration требуют внешнего control plane.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

### Средний уровень
276. Как VPN affects routing on client or gateway?

   **Ответ:** VPN добавляет интерфейсы, routes или IPsec policies; может менять default route и source selection. Проверяют также обратный путь и policy routing.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

277. Почему VPN требует управления ключами и identities?

   **Ответ:** Ключи определяют, кто может войти в туннель. Их нужно безопасно выдавать, связывать с identity, ротировать и отзывать при компрометации.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

278. Как VPN helps protect traffic on untrusted networks?

   **Ответ:** Локальный наблюдатель видит внешний туннель, но не защищённый payload. После gateway действуют свойства следующего участка; end-to-end TLS остаётся полезным.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

279. Почему VPN не решает endpoint compromise?

   **Ответ:** Скомпрометированный endpoint видит данные до шифрования и может действовать с правами пользователя. Нужны endpoint security и минимальные сетевые полномочия.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

280. Как VPN interacts with NAT and firewalls?

   **Ответ:** NAT меняет внешний endpoint, firewall должен разрешать нужный transport. Проверяют keepalive, UDP timeout и policy обоих направлений.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

281. Почему MTU/MSS часто становятся проблемой через VPN?

   **Ответ:** Внешние заголовки уменьшают доступный размер внутреннего пакета. При сломанном PMTUD small packets проходят, а большие передачи зависают.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

282. Как tunneling overhead affects performance?

   **Ответ:** Overhead уменьшает полезные байты на пакет и увеличивает PPS/CPU на тот же payload. Эффект зависит от packet size, MTU и crypto/offload.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

283. Почему encrypted tunnels complicate observability?

   **Ответ:** Capture underlay показывает ciphertext, а не внутренние flows. Сопоставляют captures до/после туннеля, counters peers и endpoint telemetry.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

284. Почему VPN deployment — это не только cryptography, но и routing design?

   **Ответ:** Успешный handshake не создаёт автоматически правильные routes, forwarding, return path и DNS. Их проектируют вместе с crypto policy.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

285. Какие ошибки конфигурации VPN самые частые?

   **Ответ:** Часты неверные prefixes/selectors, отсутствие forwarding, ошибочный firewall, overlap подсетей и завышенная MTU. Проверяют реальный packet path.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

286. Как distinguish VPN control-plane issue from tunneled traffic issue?

   **Ответ:** Control plane проверяют по handshake/auth/SA state; dataplane — по counters, inner packets, маршрутам и return path. Активная SA не доказывает доставку.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

287. Как packet capture помогает при VPN troubleshooting?

   **Ответ:** Одновременно смотрят underlay handshake/outer packets и внутренний трафик на tunnel/LAN interfaces. Согласуют время и tuple, учитывают encryption boundary.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

288. Почему overlapping subnets complicate site-to-site VPN?

   **Ответ:** Одинаковые prefixes не позволяют однозначно выбрать локальный и удалённый ресурс. Используют перенумерацию, изоляцию VRF/namespaces или согласованную трансляцию адресов.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

289. Как split tunnel affects security and usability?

   **Ответ:** Пользователь сохраняет прямой internet path, но маршруты и resolver rules усложняются. Ограничения доступа должны учитывать возможность одновременного участия в двух сетях.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

290. Как DNS leaks связаны с VPN setups?

   **Ответ:** DNS может уходить к resolver вне туннеля, раскрывая имена или давая неправильный split-DNS ответ. Проверяют resolver configuration и IPv4/IPv6 paths.

   **Источник:** [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

291. Почему key rotation важна и для VPN?

   **Ответ:** Ротация ограничивает срок воздействия утёкшего credential и позволяет отозвать устройство. Static identity keys и автоматически обновляемые session keys имеют разные lifecycle.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

292. Какие KPI useful for VPN operations?

   **Ответ:** Полезны availability внутренних probes, handshake/auth failures, latency/loss, throughput, drops и rekey events. Сам факт существования интерфейса недостаточен.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

293. Какие симптомы типичны для VPN failure?

   **Ответ:** Возможны отсутствие handshake, односторонний трафик, недоступные подсети, DNS failure и зависание больших сообщений. Каждый симптом проверяют по своему участку пути.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

294. Что должен понимать software engineer про VPN as a system, not just a protocol?

   **Ответ:** VPN объединяет identity, key lifecycle, маршрутизацию, MTU, firewall и эксплуатацию. Приложение всё равно должно иметь deadlines, authorization и собственную защиту канала.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

295. Какие interview вопросы по VPN foundations показывают practical understanding?

   **Ответ:** Хороший вопрос: handshake успешен, ping gateway проходит, сервис в LAN недоступен. Ответ должен проверить forwarding, routes, firewall, return path и MTU.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

### Продвинутый уровень
296. Как VPN changes trust boundaries in distributed systems?

   **Ответ:** Gateway объединяет сети и расширяет достижимость ресурсов. Политики должны ограничить, какие authenticated peers имеют доступ к конкретным destination/services.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

297. Какие control-plane and dataplane parts есть у VPN solutions?

   **Ответ:** Control plane управляет identity, настройками, routes и ключевым обменом; dataplane переносит защищённые пакеты. Сбой одной части не всегда останавливает другую.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

298. Как route propagation and policy interact with VPN?

   **Ответ:** Распространённый route задаёт достижимость, а security policy — разрешение и способ защиты. Проверяют их согласованность и отсутствие утечки private prefixes.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

299. Как troubleshoot intermittent VPN issues under NAT rebinding and path changes?

   **Ответ:** Коррелируют внешний endpoint, NAT timeout, keepalive, handshake и path changes. Отдельно проверяют recovery после idle и изменение MTU нового пути.

   **Источник:** [WireGuard: Quick Start](https://www.wireguard.com/quickstart/); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

300. Как build observability for encrypted tunnels without payload visibility?

   **Ответ:** Собирают per-peer counters, timings, SA/handshake state и synthetic probes до внутренних ресурсов. Payload visibility заменяют endpoint metrics, а не логированием секретов.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

301. Как distinguish crypto/auth failure from routing/MTU failure?

   **Ответ:** При auth failure нет нужной защищённой сессии. При routing/MTU failure сессия существует, но counters и packet sizes показывают недоставку; проверяют оба направления.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

302. Как full-tunnel VPN can create bottlenecks and single points of failure?

   **Ответ:** Весь трафик конкурирует за канал и CPU gateway. Нужны capacity headroom, резервирование, health checks и проверка переключения routes.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

303. Как design safe and scalable VPN key/cert distribution?

   **Ответ:** Выдают отдельные credentials через аутентифицированный control plane, ограничивают доступ к private keys и автоматизируют отзыв/ротацию. Общий ключ на всех затрудняет isolation.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

304. Какие anti-patterns common in enterprise VPN design?

   **Ответ:** Вредят общие credentials, плоский полный доступ, overlapping networks, ручная настройка без inventory и проверка только handshake. Масштаб требует управляемых политик.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

305. Что должен глубоко понимать senior engineer про VPN architecture?

   **Ответ:** Нужны trust boundaries, routing/return path, failure recovery, key lifecycle, capacity и наблюдаемость. Архитектура должна переживать отзыв ключей и отказ gateway.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

### Инженерные вопросы
306. Почему VPN — это сочетание crypto, routing, identity и operations?

   **Ответ:** Криптография проверяет peers и защищает packets, routing выбирает путь, identity задаёт участника, operations поддерживают lifecycle. Отказ любого компонента нарушает услугу.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

307. Какие VPN темы особенно важны для network/software engineer?

   **Ответ:** Глубоко нужны маршруты, MTU, NAT/firewall, peer identity и диагностика. Детали конкретного key exchange изучают по используемому VPN.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

308. Как объяснить VPN на интервью через tunneling, trust and routing?

   **Ответ:** VPN инкапсулирует выбранные packets между доверенными peers, защищает их и доставляет через underlay. Доступ определяется routing и отдельной access policy.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

309. Что особенно важно знать C/C++ инженеру про VPN behavior?

   **Ответ:** Для приложения туннель меняет latency, MTU, reachability и source address. Нужны корректные deadlines, retries, partial I/O и восстановление соединений.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

310. Какие темы общей VPN практики нужно знать глубоко?

   **Ответ:** Нужны key lifecycle, address plan, routing/return path, NAT traversal, DNS, MTU и per-peer observability. Практика включает не только создание туннеля, но и recovery.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

---

## 6. IPsec

### Базовый уровень
311. Что такое IPsec?

   **Ответ:** IPsec — архитектура защиты IP трафика, включающая политики, security associations и протоколы AH/ESP. Ключами обычно управляет IKE.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

312. На каком уровне IPsec работает conceptually?

   **Ответ:** Он защищает трафик на IP уровне между hosts или security gateways. Конкретное место обработки в ОС зависит от реализации.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

313. Какие задачи решает IPsec?

   **Ответ:** IPsec предоставляет аутентификацию происхождения, целостность, anti-replay и, при соответствующем ESP режиме, конфиденциальность выбранного IP трафика.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

314. Что такое AH?

   **Ответ:** AH обеспечивает integrity/authentication IP пакета, включая защищаемые неизменяемые поля заголовка. Шифрование AH не предоставляет.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

315. Что такое ESP?

   **Ответ:** ESP защищает payload посредством integrity/authentication и/или encryption в согласованном режиме. Для обычного защищённого VPN выбирают аутентифицированное шифрование.

   **Источник:** [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303).

316. Чем AH отличается от ESP?

   **Ответ:** AH не шифрует и включает часть IP header в integrity protection. ESP может шифровать payload и обычно лучше совместим с NAT traversal.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303).

317. Почему ESP используется чаще?

   **Ответ:** ESP даёт необходимую для VPN конфиденциальность и поддерживается NAT-T. AH не шифрует и плохо переносит изменение защищаемых полей NAT.

   **Источник:** [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

318. Что такое transport mode?

   **Ответ:** Transport mode защищает содержимое исходного IP пакета без добавления нового туннельного IP header. Часто применяется host-to-host.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

319. Что такое tunnel mode?

   **Ответ:** Tunnel mode помещает исходный IP пакет внутрь нового защищённого пакета с внешними адресами gateways. Внутренние адреса скрыты при encryption.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

320. Чем transport mode отличается от tunnel mode?

   **Ответ:** Transport mode сохраняет исходный IP header снаружи; tunnel mode переносит весь исходный IP packet внутри внешнего. Выбор меняет scope и overhead.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

321. Что такое IKE?

   **Ответ:** IKE — протокол согласования параметров, аутентификации peers и создания/обновления security associations для IPsec. IKEv2 отделяет IKE SA от Child SAs.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

322. Зачем нужен IKE?

   **Ответ:** Он автоматизирует создание общего ключевого материала и согласованной политики вместо ручной установки ключей для каждого направления.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

323. Почему key negotiation важна для IPsec?

   **Ответ:** Без согласованного алгоритма, ключей и lifecycle peers не могут безопасно обрабатывать packets. IKE также проверяет identity и обновляет SAs.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

324. Что такое security association (SA)?

   **Ответ:** SA содержит параметры односторонней защиты: keys, algorithms, SPI, sequence/anti-replay state и lifetime. Для двустороннего ESP обычно нужна пара SAs.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303).

325. Почему IPsec считается мощным, но сложным решением?

   **Ответ:** IPsec гибок по modes, selectors, identity и interoperability, но это увеличивает число взаимозависимых настроек и классов отказов.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

### Средний уровень
326. Как IPsec обеспечивает confidentiality?

   **Ответ:** ESP шифрует защищаемую часть пакета согласованным алгоритмом. В tunnel mode это включает исходный IP packet; внешний routing header остаётся видимым.

   **Источник:** [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303).

327. Как IPsec обеспечивает integrity?

   **Ответ:** ESP использует authentication tag/MAC согласованного режима; AH предоставляет свою integrity protection. Anti-replay отдельно отслеживает sequence numbers.

   **Источник:** [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

328. Как IPsec обеспечивает peer authentication?

   **Ответ:** Peers аутентифицируются при IKE, например сертификатами или PSK. Это не означает прикладную аутентификацию каждого пользователя за gateway.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

329. Как IPsec integrates with site-to-site VPN scenarios?

   **Ответ:** Gateways создают tunnel-mode SAs для согласованных prefixes/selectors. Для работы нужны маршруты, forwarding, firewall и обратный путь.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

330. Почему NAT historically complicated IPsec?

   **Ответ:** NAT меняет адреса и transport state; AH защищает изменяемые NAT поля, а ESP без UDP неудобен многим NAT. Для ESP применяют NAT-T.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

331. Что такое NAT-T на базовом уровне?

   **Ответ:** NAT-T инкапсулирует ESP в UDP и поддерживает работу через NAT. Peers обнаруживают NAT при IKE и используют предусмотренную encapsulation.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

332. Почему ESP без NAT-T плохо сочетается с NAT?

   **Ответ:** ESP — IP protocol 50 без обычных UDP/TCP ports, поэтому NAT сложнее различать mappings. AH дополнительно конфликтует с изменением адресов.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

333. Какие порты/протоколы вовлечены в IKE and NAT-T?

   **Ответ:** IKE обычно начинается на UDP/500; при NAT-T используют UDP/4500 для IKE и ESP encapsulation. Без encapsulation ESP использует IP protocol 50.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

334. Как IPsec влияет на MTU?

   **Ответ:** ESP, внешний IP header и возможный UDP добавляют overhead. Эффективную MTU внутреннего трафика уменьшают с учётом algorithms и encapsulation.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

335. Почему fragmentation issues common in IPsec tunnels?

   **Ответ:** Пакет после encapsulation может превысить PMTU; blocked ICMP мешает адаптации. Разбирают, где происходит fragmentation, и проверяют оба направления.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

336. Как SPD и SAD conceptually relate to packet processing?

   **Ответ:** SPD выбирает bypass/discard/protect и параметры политики, SAD хранит действующие SAs для обработки packets. Согласованные SAs не отменяют проверок policy.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

337. Что такое policy-based IPsec?

   **Ответ:** Выбор защищаемого трафика определяется IPsec policies/selectors, например парой prefixes. Обычный route и matching policy должны быть согласованы.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

338. Что такое route-based IPsec на концептуальном уровне?

   **Ответ:** Маршруты направляют трафик через виртуальный интерфейс, связанный с IPsec. Реализация всё равно использует SAs и policies, но routing становится явнее.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

339. Какие сложности в конфигурации IPsec наиболее часты?

   **Ответ:** Часты несовместимые proposals, неверные IDs/credentials, selectors, NAT exclusions и routes. Сначала фиксируют стадию отказа: IKE, Child SA или data path.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

340. Почему mismatched proposals и auth settings часто ломают IPsec?

   **Ответ:** Для SA нужны пересекающиеся допустимые algorithms и успешно проверенная identity. Несовпадение приводит к отказу negotiation до передачи защищённого payload.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

341. Как packet captures помогают при IPsec debugging?

   **Ответ:** Capture показывает IKE, UDP/4500 или ESP и наличие внутренних packets на LAN. Содержимое ESP без нужных secrets не видно.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

342. Почему encrypted IPsec traffic complicates observability?

   **Ответ:** Underlay скрывает inner tuple/payload. Для RCA объединяют SA counters, drops, sequence/replay errors и captures до/после защиты.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 4303: ESP](https://www.rfc-editor.org/rfc/rfc4303).

343. Какие симптомы характерны для failed IKE negotiation?

   **Ответ:** Видны retries IKE, отсутствие установленной IKE SA и negotiation/authentication errors. Проверяют reachability UDP, proposals, identities и credentials.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

344. Какие симптомы характерны для broken data plane after successful IKE?

   **Ответ:** IKE SA есть, но Child SA может отсутствовать или не совпадать с потоком. Проверяют selectors, counters, routes, firewall и MTU.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

345. Что должен понимать инженер про practical IPsec operation?

   **Ответ:** Важно разделять IKE SA, Child SAs и actual traffic path. Диагностика должна учитывать направления, selectors, rekey и return route.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

### Продвинутый уровень
346. Как IKE negotiation выглядит на high level?

   **Ответ:** IKE_SA_INIT согласует algorithms и DH material; IKE_AUTH подтверждает identities и обычно создаёт первую Child SA. CREATE_CHILD_SA создаёт/обновляет последующие SAs.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

347. Как peers negotiate crypto parameters and identities?

   **Ответ:** Peers выбирают совместимые proposals, обмениваются key-establishment материалом и доказывают identity по настроенной authentication policy. IP address и authenticated ID не обязаны совпадать.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

348. Как child SAs differ from IKE SA conceptually?

   **Ответ:** IKE SA защищает управляющие IKE exchanges; Child SA обеспечивает IPsec dataplane. Рабочий control channel не гарантирует правильных traffic selectors.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

349. Как rekeying работает и почему важно operationally?

   **Ответ:** Rekey создаёт новые SAs до истечения старых с согласованным переключением. Ошибки timers, negotiation или overlap проявляются периодическими обрывами.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

350. Как selector mismatch breaks only part of traffic in IPsec?

   **Ответ:** Поток вне согласованных selectors не попадает в нужную SA либо отвергается policy. Поэтому одна подсеть может работать, а соседняя — нет.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

351. Как distinguish policy issue from crypto issue from routing issue?

   **Ответ:** Проверяют IKE/Child state, matching policy, SA counters и маршрут по порядку. Успешное увеличение encrypt counter без decrypt/ответа сужает область поиска.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

352. Как asymmetric routing complicates IPsec tunnels?

   **Ответ:** Обратный трафик может миновать gateway с нужной SA/policy. Stateful firewall или anti-spoof checks также могут отвергать асимметричный путь.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

353. Как overlapping networks and route leaks affect IPsec deployments?

   **Ответ:** Overlap делает выбор сети неоднозначным, route leaks отправляют traffic не туда или раскрывают prefixes. Нужны изоляция таблиц и управляемый address plan.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

354. Какие metrics useful for IPsec observability: SA counts, rekey rate, auth failures, tunnel latency, drops?

   **Ответ:** Собирают IKE/Child counts, auth/rekey failures, bytes/packets, replay/integrity drops и synthetic tunnel latency. Events связывают с peer и временем.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

355. Как hardware acceleration impacts IPsec performance?

   **Ответ:** Crypto offload снижает CPU на поддерживаемых algorithms, но ограничения NIC, copies и packet rate могут остаться bottleneck. Производительность измеряют на реальных размерах packets.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

356. Какие bottlenecks типичны для high-throughput IPsec gateways?

   **Ответ:** Ограничителями бывают PPS, crypto CPU, IRQ/queues, memory bandwidth и NIC/link capacity. Сравнивают utilisation и drops до изменения algorithms.

   **Источник:** [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

357. Как C/C++ systems engineers interact with kernel IPsec or user-space datapaths conceptually?

   **Ответ:** В Linux приложение/daemon управляет kernel XFRM state/policy либо использует user-space datapath. Важно согласовать ownership, lifetimes, routing и counters.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

358. Какие interview вопросы по IPsec показывают глубокое понимание beyond buzzwords?

   **Ответ:** Спросите, почему IKE SA up не означает доступность subnet и чем Child SA отличается от IKE SA. Ожидаются selectors, return path и dataplane evidence.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

359. Какие anti-patterns чаще всего встречаются при IPsec troubleshooting?

   **Ответ:** Вредят перезапуск без сбора state, смешение IKE/ESP ошибок, проверка только ping и произвольная смена proposals. Сначала определяют сбойный этап.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

360. Что особенно важно знать senior engineer про IPsec deployments?

   **Ответ:** Нужны interoperability, policy/routing consistency, rekey recovery, capacity и key lifecycle. Изменения проверяют на traffic разных selectors в обоих направлениях.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

### Инженерные вопросы
361. Почему IPsec часто считают “enterprise-grade”, но operationally complex?

   **Ответ:** IPsec предлагает стандартизованные policy, identity и crypto mechanisms для разных сценариев. Гибкость требует согласования многих параметров и хорошей диагностики.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

362. Когда IPsec особенно уместен?

   **Ответ:** Он уместен для совместимого site-to-site/remote access и интеграции с существующими gateways, PKI и сетевыми политиками. Выбор зависит от требований эксплуатации.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

363. Какие темы IPsec важны для network/software engineer даже без глубокого telecom/security background?

   **Ответ:** Нужно знать ESP/AH, modes, IKE/Child SAs, selectors, NAT-T, MTU и routing. Эти знания объясняют большинство распространённых отказов.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

364. Как объяснить IPsec на интервью через ESP, IKE, tunnel mode и trade-offs?

   **Ответ:** ESP защищает IP packets, IKE аутентифицирует peers и создаёт SAs, tunnel mode соединяет сети. Компромиссы касаются policy complexity, совместимости и overhead.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

365. Какие IPsec topics нужно знать глубоко?

   **Ответ:** Для эксплуатации глубоко нужны SA lifecycle, selectors, proposals/identity, NAT-T и troubleshooting. Реализация криптопримитивов требует отдельной специализации.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296).

---

## 7. WireGuard (обзор)

### Базовый уровень
366. Что такое WireGuard?

   **Ответ:** WireGuard — защищённый L3 tunnel protocol с peers, идентифицируемыми public keys, и передачей encrypted IP packets поверх UDP.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

367. Почему WireGuard стал популярен?

   **Ответ:** Он сочетает небольшую конфигурацию, фиксированный криптографический набор и хорошую интеграцию с routing. Управление пользователями и topology обычно строят отдельно.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

368. Чем WireGuard концептуально отличается от более старых VPN решений?

   **Ответ:** У него компактный protocol и cryptokey routing вместо широкого negotiation множества legacy suites. Это не отменяет внешнего управления identity и routes.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

369. Почему WireGuard считают более простым в конфигурации?

   **Ответ:** Основные настройки — keys, endpoint и AllowedIPs. Меньше согласуемых algorithms, но firewall, routes и key distribution остаются ответственностью оператора.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

370. Какие базовые криптографические идеи использует WireGuard на высоком уровне?

   **Ответ:** WireGuard использует Noise-based authenticated handshake, Curve25519, ChaCha20-Poly1305 и другие фиксированные primitives. Static identity keys отделены от обновляемых session keys.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

371. Что такое peer в WireGuard?

   **Ответ:** Peer — удалённый участник, заданный public key и связанной configuration. Он может иметь динамически меняющийся внешний endpoint.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

372. Что такое public/private key pair в WireGuard?

   **Ответ:** Private key хранится у участника и доказывает владение identity; public key безопасно передают ожидаемым peers. Private key не должен попадать в общий config repository.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

373. Как WireGuard идентифицирует peers?

   **Ответ:** Identity peer определяется public key. Привязка ключа к человеку, устройству или service осуществляется внешним control plane.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

374. Что такое AllowedIPs?

   **Ответ:** AllowedIPs связывает IP prefixes с peer: выбирает peer для outgoing inner destination и проверяет допустимый inner source при приёме.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

375. Почему AllowedIPs одновременно связаны и с routing, и с policy?

   **Ответ:** Это cryptokey routing внутри WireGuard и проверка source identity. OS routes до интерфейса настраиваются отдельно; wg-quick может создать их из AllowedIPs.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

376. Работает ли WireGuard поверх UDP?

   **Ответ:** Да, WireGuard передаёт handshake и encrypted data в UDP. Номер listen port настраивается, а не является обязательной фиксированной константой.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

377. Почему использование UDP помогает portability and NAT traversal?

   **Ответ:** UDP широко поддерживается, позволяет NAT mappings и не добавляет TCP-over-TCP retransmission effects. Автоматическое прохождение любого NAT/firewall не гарантируется.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

378. Что такое persistent keepalive?

   **Ответ:** PersistentKeepalive периодически отправляет authenticated empty packets при отсутствии другого трафика. Это помогает сохранять NAT/firewall mapping; интервал настраивается.

   **Источник:** [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

379. Зачем нужен keepalive в WireGuard?

   **Ответ:** Keepalive нужен, когда peer за NAT должен оставаться доступным после idle. Он не исправляет неверные routes или закрытый UDP на другом конце.

   **Источник:** [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

380. Почему WireGuard часто удобен для site-to-site и remote access?

   **Ответ:** Простой peer/key model удобен для L3 связи площадок и устройств. Для выдачи доступа пользователям, MFA и inventory нужен дополнительный control plane.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

### Средний уровень
381. Какие преимущества даёт WireGuard simplicity?

   **Ответ:** Меньше protocol choices упрощает review, настройку и поиск mismatch. Основная operational complexity перемещается в identity, routes и orchestration.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

382. Какие operational ограничения у WireGuard по сравнению с more feature-heavy VPN solutions?

   **Ответ:** Сам protocol не предоставляет полноценные user directory, MFA, certificate PKI или динамическую маршрутизацию. Эти возможности добавляют внешние компоненты.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

383. Как WireGuard handles roaming/NAT rebinding conceptually?

   **Ответ:** Endpoint peer может обновляться после получения корректно аутентифицированного пакета с нового адреса. Это позволяет roaming, но требует достижимого UDP пути.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

384. Почему WireGuard configuration mistakes often manifest as routing issues?

   **Ответ:** Handshake подтверждает keys, но не создаёт все OS routes, forwarding и firewall rules. Неверный AllowedIPs или return route ломает inner traffic.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

385. Как AllowedIPs misconfiguration ломает только часть connectivity?

   **Ответ:** Outgoing destination может выбрать другого peer, а incoming source — не пройти проверку. Проверяют самые специфичные prefixes и обе стороны configuration.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

386. Почему WireGuard debugging часто упирается в routing and firewall rather than cryptography?

   **Ответ:** Криптографический набор фиксирован, поэтому после проверки keys/handshake часто остаются маршруты, AllowedIPs, forwarding, NAT и firewall. Их подтверждают counters и capture.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

387. Как MTU issues проявляются через WireGuard tunnels?

   **Ответ:** Small packets проходят, большие теряются или TCP зависает после connect. Проверяют tunnel MTU и PMTUD, учитывая outer IP/UDP overhead.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

388. Как WireGuard compares to IPsec in complexity and operational ergonomics?

   **Ответ:** WireGuard имеет меньше protocol settings; IPsec предлагает более широкий ecosystem/policy set. Сравнивают полный control plane, interoperability и требования, а не только число строк config.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

389. Какие use cases особенно хорошо подходят для WireGuard?

   **Ответ:** Подходят Linux overlays, соединение серверов/площадок и remote access с внешней автоматизацией. Важны управляемая выдача keys и address plan.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

390. Какие use cases требуют более сложных VPN control planes than WireGuard alone?

   **Ответ:** Большие user fleets с MFA, device posture, централизованным отзывом и audit требуют отдельного identity/orchestration слоя поверх WireGuard.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

391. Как packet capture помогает в WireGuard troubleshooting?

   **Ответ:** Смотрят UDP на underlay и inner IP packets на wg interface. Отсутствие inner replies исследуют по routes/firewall/AllowedIPs, не пытаясь читать ciphertext.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

392. Почему encrypted WireGuard traffic complicates payload-level analysis?

   **Ответ:** Payload защищён между peers; внешняя capture показывает endpoints, timings и объёмы. Для application RCA нужны inner captures и telemetry endpoints.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

393. Какие counters/logs useful for WireGuard debugging?

   **Ответ:** `wg show` даёт latest handshake, endpoints и transfer counters. Дополняют route/firewall counters и probes; старый handshake без трафика не обязательно означает outage.

   **Источник:** [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

394. Что должен понимать software engineer про WireGuard as practical VPN?

   **Ответ:** WireGuard даёт защищённую IP связность, но не application authorization. Приложение должно учитывать path changes, MTU, deadlines и собственную trust boundary.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

395. Какие interview вопросы по WireGuard показывают реальную практику?

   **Ответ:** Полезно разобрать случай: handshake есть, RX растёт, LAN недоступен. Ожидаются AllowedIPs, forwarding, firewall, return route и capture на LAN.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

### Продвинутый уровень
396. Как WireGuard’s minimal protocol design affects security and operability?

   **Ответ:** Малый protocol уменьшает negotiation complexity и поверхность реализации. Ошибки key provisioning, ACL/routing и endpoint security остаются существенными.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

397. Как key distribution and rotation should be automated around WireGuard?

   **Ответ:** Private keys создают/доставляют защищённо, public keys связывают с inventory и правами. Rotation требует согласованного обновления peers и плана recovery.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

398. Как distinguish handshake issue from route issue from NAT/firewall issue?

   **Ответ:** Сначала проверяют UDP reachability и latest handshake, затем inner route/AllowedIPs и оба направления counters. NAT/firewall подтверждают outer capture и idle tests.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

399. Как WireGuard interacts with Linux routing tables and policy routing?

   **Ответ:** Kernel routing направляет packet на wg interface, затем AllowedIPs выбирает peer. Policy routing может управлять outer/inner paths; wg-quick добавляет вспомогательные rules.

   **Источник:** [WireGuard: Quick Start](https://www.wireguard.com/quickstart/); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

400. Почему AllowedIPs are powerful but dangerous if misunderstood?

   **Ответ:** Слишком широкий prefix отправит лишний traffic peer и разрешит ему больше source addresses. AllowedIPs не заменяет port/application firewall.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

401. Какие metrics should be collected for WireGuard in production?

   **Ответ:** Собирают bytes/packets, handshake age при ожидаемой активности, endpoint changes, drops и probes до ресурсов. Interface up не равен service availability.

   **Источник:** [WireGuard: Quick Start](https://www.wireguard.com/quickstart/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

402. Как build high-availability or multi-peer topologies around WireGuard?

   **Ответ:** Нужны внешнее управление routes/health, согласованные keys и обработка return paths. Один prefix нельзя произвольно назначить нескольким peers одного интерфейса как готовый балансировщик.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

403. Какие limitations WireGuard has for large-scale enterprise orchestration without extra control plane?

   **Ответ:** WireGuard не решает самостоятельно enrollment, policy distribution, MFA, inventory и route orchestration. Для крупной сети нужен поддерживаемый control plane.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

404. Как C/C++ engineers should think about WireGuard when building systems atop Linux networking?

   **Ответ:** Для приложения это IP interface с изменёнными MTU, path и lifecycle. Управление tunnel configuration отделяют от application I/O и прав доступа.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

405. Какие anti-patterns наиболее часты в WireGuard deployments?

   **Ответ:** Типичны общий private key, широкие AllowedIPs, отсутствие return route, неверная MTU и ожидание, что handshake доказывает работоспособность всей сети.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

406. Какие interview вопросы по WireGuard помогают отличить buzzword familiarity from operational competence?

   **Ответ:** Спросите, создаёт ли `wg set` OS routes и что означает рост TX без RX. Сильный ответ разделяет cryptokey routing, kernel routes и remote return path.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

407. Что особенно важно знать senior engineer о WireGuard в production?

   **Ответ:** Важны key/identity lifecycle, topology, routing, observability и recovery при endpoint/NAT changes. HA и user management требуют внешних решений.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

408. Как compare WireGuard and IPsec fairly without reducing to “one is simpler”?

   **Ответ:** Сравнивают поддерживаемые platforms, interoperability, identity integration, NAT behavior, performance и lifecycle. Удобство protocol отдельно от сложности всей системы.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

409. Как explain WireGuard on interview through keys, UDP, peers and routing?

   **Ответ:** Peer узнаётся по public key; handshake создаёт session keys; IP packets шифруются и идут через UDP. AllowedIPs связывает inner addresses с peer.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

410. Какие WireGuard темы нужно знать глубоко, а какие обзорно?

   **Ответ:** Глубоко нужны keys, AllowedIPs, OS routes, NAT/MTU и debugging. Детали Noise/crypto изучают глубже при работе над реализацией protocol.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

### Инженерные вопросы
411. Почему WireGuard стал значимым сдвигом в VPN usability?

   **Ответ:** Небольшой набор settings и встроенный roaming сделали защищённую L3 связь проще для многих сценариев. Распределение identity и политики всё равно нужно проектировать.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

412. Какие компромиссы simplicity vs ecosystem richness есть у WireGuard?

   **Ответ:** Фиксированные primitives и компактность уменьшают настройки, но enterprise enrollment, MFA и policy distribution требуют дополнительных сервисов.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

413. Что особенно полезно знать software/network engineer про WireGuard?

   **Ответ:** Практически нужны AllowedIPs, маршруты, UDP reachability, key handling и `wg show`. Это позволяет объяснить большинство проблем без изменения crypto.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

414. Когда WireGuard — отличный выбор, а когда требуется more complex architecture?

   **Ответ:** WireGuard хорош для управляемой L3 связности. Для крупного user access, compliance policies и автоматического HA нужна архитектура с дополнительным control plane.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

415. Какие темы WireGuard обязательно понимать practically?

   **Ответ:** Нужно уметь настроить peers, проверить keys/handshake, routes/return path, AllowedIPs, firewall, MTU и безопасный отзыв доступа.

   **Источник:** [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/); [WireGuard: Quick Start](https://www.wireguard.com/quickstart/).

---

## 8. MITM (Man-in-the-Middle)

### Базовый уровень
416. Что такое MITM атака?

   **Ответ:** MITM — положение атакующего между сторонами, позволяющее перехватывать обмен и при отсутствии защиты подменять сообщения или endpoints.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

417. Почему MITM опасна?

   **Ответ:** Посредник может похитить credentials, изменить команды и выдать себя за доверенный сервис. Шифрование без проверки peer не устраняет эту угрозу.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

418. Какие цели преследует MITM attacker?

   **Ответ:** Цели включают чтение секретов, изменение операций, session hijacking и перенаправление пользователя. Возможности зависят от расположения и проверки identity.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

419. Может ли MITM только подслушивать, не изменяя трафик?

   **Ответ:** Пассивный наблюдатель может только записывать доступный traffic; обычно это называют eavesdropping. Активный MITM дополнительно способен вмешиваться в обмен.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

420. Может ли MITM менять данные на лету?

   **Ответ:** Да, если протокол не обеспечивает проверяемую целостность и identity. Аутентифицированный TLS обнаруживает изменение защищённых records при корректной проверке peers.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

421. Почему plain-text protocols особенно уязвимы к MITM?

   **Ответ:** Plaintext раскрывает содержимое и часто не связывает сообщения с authenticated peer. Участник пути может читать и изменять запросы.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

422. Как TLS помогает против MITM?

   **Ответ:** TLS связывает handshake с проверенным peer и защищает records от чтения/изменения. Проверка ожидаемой identity обязательна.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

423. Почему TLS без проверки сертификата не защищает от MITM?

   **Ответ:** Клиент может принять ключ посредника, который создаст второй TLS канал к серверу. Оба канала зашифрованы, но посредник читает plaintext.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

424. Что такое certificate validation в контексте MITM defense?

   **Ответ:** Проверяют trusted chain, сроки/constraints и ожидаемое имя. Нельзя принимать присланный root как новый trust anchor автоматически.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

425. Как ARP spoofing может использоваться для MITM в локальной сети?

   **Ответ:** Поддельные ARP mappings могут направить frames через атакующего в общем L2 сегменте. Защищённый TLS всё равно должен отвергать подмену identity.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

426. Как rogue Wi-Fi может использоваться для MITM?

   **Ответ:** Поддельная точка доступа контролирует локальный path и DNS/gateway configuration. Это позволяет interception plaintext, но не отменяет проверку TLS identity.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

427. Почему open Wi-Fi без защиты опасен?

   **Ответ:** Локальная сеть может прослушиваться или управляться чужим gateway. Используют проверенный HTTPS/VPN и не обходят certificate errors.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

428. Что такое proxy-based MITM на базовом уровне?

   **Ответ:** Proxy завершает клиентское соединение и создаёт другое к серверу. Если клиент доверяет его CA, proxy может читать и менять HTTP plaintext.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

429. Как DNS spoofing может помогать MITM?

   **Ответ:** Подложный DNS ответ направляет клиента на чужой endpoint. Корректная TLS identity verification не позволит принять его без подходящего сертификата.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

430. Почему users often can’t visually distinguish legitimate from intercepted traffic?

   **Ответ:** Подменённый контент может выглядеть идентично оригиналу. Внешний вид страницы не доказывает origin; доверие обеспечивают протокол и проверка identity.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

### Средний уровень
431. Какие условия нужны для успешного MITM?

   **Ответ:** Нужны влияние на path/endpoint discovery и возможность обойти требуемую authentication/integrity. Контроль маршрута сам по себе не расшифровывает корректный TLS.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

432. Как attacker position on path affects feasibility of MITM?

   **Ответ:** On-path attacker проще наблюдает и меняет packets. Off-path attacker обычно вынужден подделывать discovery/responses или эксплуатировать protocol/endpoint weakness.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

433. Чем passive MITM отличается от active MITM?

   **Ответ:** Passive interception наблюдает обмен, active MITM вмешивается или создаёт отдельные sessions. Защита должна учитывать обе угрозы.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

434. Как MITM differs from simple eavesdropping?

   **Ответ:** Eavesdropping — чтение доступного обмена; MITM обычно подразумевает посредничество с возможностью вмешательства и impersonation сторон.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

435. Почему HSTS helps against some MITM downgrade scenarios?

   **Ответ:** Уже известная HSTS policy запрещает HTTP доступ к хосту и предотвращает подмену HTTP→HTTPS redirect. Без preload первое посещение остаётся особым случаем.

   **Источник:** [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797).

436. Что такое SSL stripping на концептуальном уровне?

   **Ответ:** SSL stripping удерживает клиента на HTTP, пока посредник общается с сервером по HTTPS. HSTS уменьшает риск, если политика известна до запроса.

   **Источник:** [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797).

437. Почему mixed content может облегчать exploitation?

   **Ответ:** HTTP ресурс внутри HTTPS страницы может быть изменён в пути и повлиять на страницу. Особенно опасен исполняемый script.

   **Источник:** [OWASP: HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

438. Как enterprise TLS interception differs from malicious MITM?

   **Ответ:** Технически оба варианта завершают TLS у посредника. Enterprise interception предполагает управляемое доверие/политику, но создаёт те же чувствительные plaintext boundaries.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

439. Почему trust store compromise опасен?

   **Ответ:** Добавленный attacker-controlled anchor позволяет принимать поддельные сертификаты в пределах политики клиента. Trust store требует защищённого управления.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

440. Как pinned trust or mTLS reduce MITM risk?

   **Ответ:** Pinning сужает допустимые keys; mTLS проверяет также клиента. Оба требуют корректной server identity validation и безопасного lifecycle credentials.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

441. Какие признаки могут косвенно указывать на MITM?

   **Ответ:** Неожиданные issuer/chain, trust errors, DNS/ARP changes и различия между сетями требуют проверки. По одному признаку MITM не доказывают.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

442. Почему unexpected certificate changes should be investigated?

   **Ответ:** Изменение может быть штатной ротацией, CDN или interception. Сверяют inventory, issuer, SAN и timeline, прежде чем объявлять компрометацию.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

443. Как secure DNS can reduce some MITM vectors?

   **Ответ:** DNSSEC проверяет происхождение/целостность подписанных DNS данных; DoT/DoH защищают канал к resolver. Они не заменяют TLS identity конечного сервиса.

   **Источник:** [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

444. Почему MITM still matters even in mostly-HTTPS world?

   **Ответ:** Остаются ошибочные trust stores, verification bypass, HTTP fallback и plaintext legs. TLS защищает только при правильной конфигурации и endpoints.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

445. Какие приложения особенно чувствительны к MITM?

   **Ответ:** Особенно чувствительны authentication, платежи, обновление ПО и управление инфраструктурой. Там подмена сообщения может давать длительные или необратимые последствия.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

446. Что должен понимать software engineer про MITM beyond “use TLS”?

   **Ответ:** Нужны trusted identity source, fail-closed verification, отсутствие insecure fallback и защита proxy/backend legs. Важно понимать, кто именно видит plaintext.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

447. Какие ошибки разработчиков часто открывают дорогу для MITM?

   **Ответ:** Опасны `verify=false`, отсутствие hostname check, доверие любому CA и переход на HTTP после ошибки. Безопасные defaults должны быть встроены в client API.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

448. Как custom protocol without authentication invites MITM?

   **Ответ:** Самодельный key exchange без authentication позволяет посреднику договориться о разных keys с каждой стороной. Нужен проверенный аутентифицированный протокол.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).

449. Какие interview вопросы по MITM показывают реальное понимание attack path and defense?

   **Ответ:** Предложите DNS подмену при исправном HTTPS: кандидат должен объяснить отказ certificate validation и условия, при которых он исчезнет.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

450. Какие basic mitigations against MITM must every engineer know?

   **Ответ:** Базовые меры: HTTPS с chain/name verification, HSTS, защищённый trust store, отсутствие insecure fallback и минимальное доверие посредникам.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 6797: HSTS](https://www.rfc-editor.org/rfc/rfc6797).

### Продвинутый уровень
451. Как MITM manifests in packet captures and TLS logs?

   **Ответ:** Видны изменения certificate/issuer, alerts и различия по путям. В encrypted capture активную подмену нельзя уверенно доказать только размерами packets.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

452. Как distinguish server-side cert issue from interception issue?

   **Ответ:** Сравнивают сертификат и цепочку из нескольких доверенных vantage points с server inventory. Штатная ротация и CDN variation могут выглядеть похожим образом.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

453. Какие observability signals useful for detecting attempted MITM?

   **Ответ:** Полезны verification failures, неожиданные issuers, DNS/ARP changes и расхождения synthetic probes. Сигналы коррелируют с approved changes, чтобы снизить false positives.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

454. Как C/C++ clients commonly fail open in ways that enable MITM?

   **Ответ:** Fail-open возникает при игнорировании verification result, callback, принимающем любую chain, или повторе с отключённой проверкой. Ошибка trust должна прекращать операцию.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

455. Почему insecure fallback logic especially dangerous in network clients?

   **Ответ:** Повтор через HTTP или без verification делает сетевую ошибку способом заставить клиента ослабить защиту. Retry должен сохранять исходные security requirements.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

456. Как build clients that surface trust errors clearly and safely?

   **Ответ:** Возвращают отдельные категории chain/name/expiry errors и безопасный endpoint context. Предусматривают исправление trust configuration, а не кнопку безусловного продолжения.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

457. Какие anti-patterns in proxy architectures increase MITM risk?

   **Ответ:** Риски повышают plaintext backend, широкое доверие proxy CA, непроверенный origin TLS и доверие forwarded headers от любого источника.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

458. Как internal PKI misuse can unintentionally create MITM-like trust failures?

   **Ответ:** Слишком широкие CA, ошибочные SAN и неконтролируемый выпуск позволяют подменять внутренние services. Нужны issuance policy, audit и ограничение доверия.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

459. Какие layered defenses best reduce MITM risk in enterprise/internal systems?

   **Ответ:** Сочетают verified TLS/mTLS, least privilege, защищённый trust store, segmentation и endpoint controls. Каждый механизм закрывает отдельную часть attack path.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

460. Какие interview вопросы по MITM best reveal strong security instincts?

   **Ответ:** Полезен вопрос: что делать при cert error в production client? Сильный ответ сохраняет fail-closed, собирает evidence и исправляет trust/rotation.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

### Инженерные вопросы
461. Почему MITM — одна из фундаментальных угроз в networking?

   **Ответ:** Сеть передаёт сообщения через чужие узлы и не гарантирует identity endpoints. Поэтому authenticated channel — базовое требование, а не дополнительная функция.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

462. Какие defenses against MITM особенно важны software/network engineer?

   **Ответ:** Особенно важны name/chain verification, trust lifecycle, HSTS для web, защита backend legs и отказ от небезопасного fallback.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

463. Как объяснить MITM на интервью через trust, identity and authenticated encryption?

   **Ответ:** Посредник пытается представить себя обеим сторонам. Проверка identity связывает ключ с ожидаемым peer, а authenticated encryption защищает обмен от подмены.

   **Источник:** [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

464. Что должен глубоко понимать C/C++ engineer about certificate validation and fail-closed behavior?

   **Ответ:** Нужно понимать, что verification failure запрещает прикладной обмен. Ошибки API, callback и retries не должны превращать отказ authentication в успех.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

465. Какие MITM-related themes обязательны для практики?

   **Ответ:** Обязательны trust anchors, SAN verification, TLS termination, HSTS, interception diagnostics и безопасное поведение при errors.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

---

## 9. Spoofing

### Базовый уровень
466. Что такое spoofing?

   **Ответ:** Spoofing — подделка идентификатора или признака происхождения, которому получатель ошибочно доверяет. Это может быть адрес, DNS ответ или application metadata.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

467. Какие виды spoofing ты знаешь?

   **Ответ:** Примеры: IP, ARP, DNS, email sender и подложные proxy headers. Для каждого проверяют источник доверия и доступную authentication.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

468. Что такое IP spoofing?

   **Ответ:** IP spoofing подставляет чужой source IP в packet. Ответ обычно идёт заявленному адресу, поэтому произвольный полноценный TCP обмен сложнее слепой UDP отправки.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

469. Что такое ARP spoofing?

   **Ответ:** ARP spoofing подменяет соответствие IPv4↔MAC в локальном сегменте. Это может перенаправить traffic или вызвать отказ связи.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

470. Что такое DNS spoofing?

   **Ответ:** DNS spoofing заставляет принять ложные DNS данные, например поддельный response. Валидация DNSSEC и защищённый resolver path уменьшают разные части риска.

   **Источник:** [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

471. Что такое email spoofing на базовом уровне?

   **Ответ:** Email spoofing подделывает видимого отправителя или envelope identity. SPF/DKIM/DMARC проверяют разные аспекты происхождения и alignment; display name сам по себе ничего не доказывает.

   **Источник:** [RFC 7489: DMARC, DKIM and SPF alignment](https://www.rfc-editor.org/rfc/rfc7489).

472. Почему spoofing работает там, где идентичность плохо проверяется?

   **Ответ:** Получатель принимает заявленный адрес/имя без надёжного доказательства владения identity. Атакующему достаточно сформировать данные с ожидаемым идентификатором.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

473. Чем spoofing отличается от impersonation в широком смысле?

   **Ответ:** Impersonation шире и включает stolen accounts или social engineering. Spoofing акцентирует подделку протокольного идентификатора/атрибута происхождения.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

474. Почему L2/L3 protocols historically уязвимы к spoofing?

   **Ответ:** Базовые Ethernet/IP механизмы создавались без встроенной криптографической identity каждого отправителя. Защиту добавляют boundary controls и верхние уровни.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

475. Почему ARP особенно уязвим к spoofing?

   **Ответ:** Обычный ARP не аутентифицирует mapping криптографически. Принимаемые объявления могут изменить neighbour cache, если сеть не применяет дополнительные controls.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

476. Почему DNS without validation historically vulnerable to spoofing?

   **Ответ:** Обычный DNS не содержит криптографического доказательства данных; matching transaction fields лишь затрудняет подделку. DNSSEC добавляет проверяемые подписи.

   **Источник:** [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

477. Как spoofing может использоваться для MITM?

   **Ответ:** Поддельный ARP/DNS mapping может направить traffic через attacker. Для чтения TLS payload ему дополнительно нужно обойти authentication или скомпрометировать endpoint.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

478. Как spoofing может использоваться для DDoS amplification?

   **Ответ:** Attacker указывает IP жертвы как source запроса к reflector. Ответ направляется жертве, а amplification увеличивает объём относительно запроса.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

479. Что такое source-address spoofing?

   **Ответ:** Это подмена source address пакета, обычно IP. Она не доказывает, что отправитель способен получить ответы по указанному адресу.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

480. Почему source spoofing затрудняет attribution attacker’а?

   **Ответ:** Логи показывают подставленный IP, а не обязательно реальный host attacker. Для attribution нужны дополнительные evidence и данные операторов.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

### Средний уровень
481. Какие practical consequences у IP spoofing?

   **Ответ:** Возможны reflection, обход простых IP-based assumptions и загрязнение logs. Source filtering уменьшает spoofed traffic, но IP всё равно не становится user identity.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

482. Почему TCP harder to spoof blindly than some UDP-based protocols?

   **Ответ:** TCP требует корректного handshake и sequence state, а ответы идут source IP. Off-path attacker сложнее поддерживать такой обмен, чем отправить одиночную UDP datagram.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

483. Почему UDP services historically useful for spoofed reflection?

   **Ответ:** UDP не требует transport handshake перед ответом. Если сервис отвечает на spoofed source, его можно использовать reflector; amplification зависит от application response.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

484. Как ingress/egress filtering reduces spoofing?

   **Ответ:** Boundary filters разрешают только допустимые source prefixes с данного направления. Они блокируют часть forged packets ближе к источнику.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

485. Что такое BCP38 на концептуальном уровне?

   **Ответ:** BCP38 рекомендует фильтровать traffic с недопустимыми source addresses на границе сети. Это снижает возможность исходящего spoofing и reflection attacks.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

486. Почему anti-spoofing filters важны у операторов и датацентров?

   **Ответ:** Оператор видит, какие source prefixes допустимы от клиента/tenant, и может остановить spoofing до выхода в Internet. Жертве сложнее сделать это после amplification.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

487. Как ARP spoofing обнаруживается и предотвращается?

   **Ответ:** Ищут неожиданные mapping changes и duplicate IP/MAC; применяют switch controls, DAI и segmentation. Статические mappings подходят только ограниченным управляемым сценариям.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

488. Как DHCP snooping and dynamic ARP inspection conceptually help?

   **Ответ:** DHCP snooping создаёт доверенные bindings IP/MAC/port; DAI использует их для проверки ARP. Нужны корректные trusted ports и обработка static hosts.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

489. Как DNSSEC conceptually helps against some DNS spoofing vectors?

   **Ответ:** DNSSEC проверяет подписи и chain доверия DNS данных, включая отрицательные ответы. Он не шифрует запросы и не гарантирует честность владельца домена.

   **Источник:** [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).

490. Почему host authentication at upper layers more robust than trusting network addresses?

   **Ответ:** TLS/mTLS или signed credentials доказывают владение ключом независимо от NAT и route changes. IP адрес описывает сетевое положение, а не полномочия.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

491. Какие symptoms suggest spoofing-related incident?

   **Ответ:** Признаки: невозможные source prefixes, неожиданные ARP changes, DNS validation failures и unsolicited reflected replies. Каждый требует исключить штатные topology changes.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

492. Почему spoofed traffic complicates logs and forensic analysis?

   **Ответ:** Подставленный source делает IP-based attribution ненадёжной. В logs различают transport peer, trusted proxy metadata и заявленную application identity.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

493. Как custom protocols often mistakenly trust IP as identity?

   **Ответ:** Протокол может разрешать команды по source IP без cryptographic authentication. При NAT, proxies или spoofing такая привязка не определяет реального principal.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

494. Что должен понимать software engineer про spoofing risks in protocol design?

   **Ответ:** Нужно отдельно аутентифицировать sender, проверять целостность и replay, а address использовать как контекст. Доверенные proxy headers принимают только от известных proxies.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

495. Какие interview вопросы по spoofing показывают реальное понимание protocol weakness and mitigation?

   **Ответ:** Хороший вопрос: почему UDP ACL по source IP не заменяет authentication? Ожидаются spoofing, NAT/shared addresses и authenticated application messages.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

### Продвинутый уровень
496. Как spoofing appears differently at L2, L3 and application layers?

   **Ответ:** L2 подделывает MAC/ARP mappings, L3 — source IP, L7 — headers/identities. Защита должна проверять соответствующую границу доверия.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

497. Какие telemetry useful for detecting spoofing in production networks?

   **Ответ:** Полезны ingress filter drops, ARP changes, DNS validation failures, source distributions и authenticated identity mismatch. Необходима привязка ко времени и интерфейсу.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

498. Как distinguish spoofing from asymmetric routing or NAT weirdness?

   **Ответ:** Сравнивают expected routes/NAT mappings, ingress interface и authenticated identity. Асимметрия объясняет неожиданный путь, но сама по себе не доказывает подделку.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

499. Как C/C++ network servers should avoid treating source IP as sufficient authentication?

   **Ответ:** Проверяют TLS client identity или application credentials и authorization для каждой операции. Source IP оставляют дополнительным сигналом/ACL, а не единственным доказательством.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

500. Какие data validation and authentication layers reduce spoofing impact?

   **Ответ:** Помогают authenticated channels/messages, строгий parsing, replay protection и authorization. Обычная checksum не подтверждает происхождение сообщения.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

501. Как build anti-spoofing defenses in internal service meshes and multi-tenant networks?

   **Ответ:** Привязывают service identity к workload и policy, ограничивают tenant source prefixes на ingress и защищают control plane выдачи identity.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

502. Какие anti-patterns most often create spoofing opportunities?

   **Ответ:** Опасны доверие любому X-Forwarded-For, IP-only authentication, открытые recursive resolvers и отсутствие source filtering на tenant boundary.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

503. Как packet capture and logs can help investigate suspected spoofing?

   **Ответ:** Capture связывает заявленный source с ingress interface и packet pattern; logs показывают authentication outcome. Для доказательства сравнивают данные нескольких границ.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

504. Какие interview questions on spoofing best reveal systems-level thinking?

   **Ответ:** Предложите разобрать spoofed UDP reflection через NAT и объяснить, где применять фильтрацию. Сильный ответ различает origin, reflector и victim.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

505. Что особенно важно знать senior engineer about spoofing as root cause vs symptom?

   **Ответ:** Поддельный адрес может быть симптомом reflection, а root cause — отсутствие filtering и открытый reflector. RCA должна объяснить возможность и путь воздействия.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

### Инженерные вопросы
506. Почему spoofing — это следствие недостатка authenticated identity in protocols?

   **Ответ:** Если протокол принимает заявленный идентификатор без доказательства, sender может его скопировать. Source filtering ограничивает возможность подделки, а authentication подтверждает identity.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

507. Какие spoofing defenses наиболее practical and universal?

   **Ответ:** Практичны source-prefix filtering, authenticated TLS/messages, защищённый DNS path и осторожное доверие proxy metadata. Универсального одного фильтра для всех уровней нет.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

508. Как объяснить spoofing на интервью через protocol trust assumptions?

   **Ответ:** Объясняют, какой field принимается за identity, кто может его задать и чем проверяется подлинность. Затем выбирают control на этой границе.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

509. Что должен понимать C/C++ engineer про identity vs address?

   **Ответ:** Адрес может меняться, разделяться NAT или задаваться attacker. Identity — проверенный principal, а authorization определяет его разрешённые действия.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

510. Какие темы spoofing нужно знать глубоко?

   **Ответ:** Нужны IP/ARP/DNS spoofing, BCP38, reflection, upper-layer authentication и trusted proxy boundaries. Детали switch controls зависят от роли.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

---

## 10. DDoS (обзор)

### Базовый уровень
511. Что такое DoS?

   **Ответ:** DoS — нарушение доступности ресурса, например через исчерпание канала, state, CPU или application dependencies.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

512. Что такое DDoS?

   **Ответ:** DDoS — распределённый DoS: воздействие приходит от множества источников или reflectors и усложняет локальное блокирование.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

513. Чем DDoS отличается от DoS?

   **Ответ:** Разница в распределённости источников воздействия. Класс исчерпываемого ресурса может быть одинаковым, но mitigation и attribution сложнее при DDoS.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

514. Какие цели преследует DDoS атака?

   **Ответ:** Цель — ухудшить или прекратить обслуживание легитимных пользователей, повысить costs или отвлечь response team. Компрометация сервера не обязательна.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

515. Почему availability — ключевая цель DDoS?

   **Ответ:** Атака расходует ограниченные ресурсы быстрее, чем система обслуживает полезную нагрузку. Нарушается своевременный доступ к услуге.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

516. Какие high-level типы DDoS атак бывают?

   **Ответ:** Выделяют volumetric attacks, protocol/state exhaustion и application-resource exhaustion. Реальные события могут сочетать несколько классов.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

517. Что такое volumetric attack?

   **Ответ:** Volumetric attack перегружает доступную полосу или packet-processing capacity пути. Фильтрация после насыщенного uplink не восстанавливает потерянную пропускную способность.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

518. Что такое protocol attack?

   **Ответ:** Protocol attack эксплуатирует стоимость/состояние обработки сетевого протокола, например half-open TCP connections. Защита зависит от конкретного state bottleneck.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

519. Что такое application-layer attack?

   **Ответ:** Application-layer attack перегружает дорогие HTTP/API операции, CPU, workers или backend. Небольшого bandwidth может хватить для большого ущерба.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

520. Почему DDoS не обязательно связан с взломом сервера?

   **Ответ:** Достаточно отправлять доступные извне запросы, потребляющие ограниченные ресурсы. Уязвимость может быть в экономике обработки, а не в возможности выполнить чужой код.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

521. Что такое amplification attack?

   **Ответ:** Amplification возникает, когда небольшой запрос вызывает существенно больший ответ. В reflection attacks этот ответ направляется spoofed-source жертве.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

522. Что такое reflection attack?

   **Ответ:** Reflection использует третью сторону, отвечающую на подставленный адрес жертвы. Amplification описывает увеличение объёма, это отдельное свойство.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

523. Почему UDP-based protocols historically использовались для amplification?

   **Ответ:** UDP позволяет ответить без handshake и проверки достижимости source. Некоторые приложения дополнительно формируют большой response на маленький request.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

524. Что такое SYN flood?

   **Ответ:** SYN flood создаёт множество попыток TCP открытия и расходует ресурсы обработки/half-open state. Ответная стратегия зависит от stack и attack pattern.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

525. Почему SYN flood нацелен на ресурсы stateful server stack?

   **Ответ:** Сервер может хранить state до завершения handshake. Поток незавершённых opens вытесняет полезные попытки; SYN cookies уменьшают часть этого state cost.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

526. Что такое application-layer flood на базовом уровне?

   **Ответ:** Это поток application requests, исчерпывающий workers, CPU, memory или dependencies. Запросы могут быть синтаксически корректными.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

527. Почему DDoS может исходить от множества “обычных” хостов?

   **Ответ:** Заражённые устройства, арендованные мощности или управляемые bots способны отправлять обычные protocol requests. Разнообразие адресов не делает traffic легитимным.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

528. Что такое botnet?

   **Ответ:** Botnet — множество управляемых атакующим скомпрометированных устройств. Для DDoS их координируют как распределённые источники трафика.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

529. Почему распределённость атаки усложняет защиту?

   **Ответ:** Источники меняются и пересекаются с legitimate networks, а суммарный объём велик. Простой blacklist становится неполным и может блокировать нормальных клиентов.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

530. Почему DDoS mitigation — это не только firewall rule?

   **Ответ:** Нужны upstream capacity/filtering, transport controls, application admission и response coordination. Host firewall не помогает, если забит канал до host.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

### Средний уровень
531. Чем volumetric attack symptomatically отличается от app-layer attack?

   **Ответ:** При volumetric attack растут bps/pps и upstream drops; при L7 attack могут расти CPU, queue depth и backend latency без насыщения канала.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

532. Почему bandwidth saturation и CPU saturation — разные DDoS scenarios?

   **Ответ:** При bandwidth saturation ограничен путь передачи; при CPU saturation — обработка packets/requests. Меры выбирают по исчерпываемому ресурсу, а не общему слову DDoS.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

533. Как reflection/amplification rely on spoofing?

   **Ответ:** Reflector отправляет ответ на source IP запроса. Spoofing направляет этот ответ жертве; большой response создаёт amplification.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

534. Какие протоколы historically abused for reflection?

   **Ответ:** Исторически использовались открытые DNS, NTP, SSDP и другие UDP services. Защита — закрывать ненужную публичную функцию, ограничивать ответы и блокировать spoofed sources.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

535. Почему SYN cookies useful against some TCP floods?

   **Ответ:** SYN cookies позволяют проверить завершение handshake с меньшим хранением half-open state. Они не устраняют bandwidth/PPS exhaustion и имеют ограничения.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

536. Как rate limiting помогает и где его недостаточно?

   **Ответ:** Rate limiting ограничивает расход ресурса выбранным субъектом/классом. Он не восстановит уже насыщенный uplink и требует устойчивого key, чтобы не вредить NAT users.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

537. Как load balancers, CDNs и scrubbing centers помогают против DDoS?

   **Ответ:** Они распределяют обработку, кешируют ответы и фильтруют traffic до origin. Эффект зависит от покрытия протокола и возможности обойти защиту прямым origin access.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

538. Почему upstream provider coordination critical in serious volumetric attacks?

   **Ответ:** При заполненном uplink локальная фильтрация слишком поздняя. Провайдер может фильтровать/перенаправить traffic до bottleneck или применить согласованный emergency action.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

539. Какие KPI and telemetry useful for DDoS detection?

   **Ответ:** Собирают bps/pps, connection/request rates, errors, latency, CPU, queue depth и source/endpoint mix. Сравнивают с baseline и business traffic.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

540. Как distinguish flash crowd from DDoS?

   **Ответ:** Сравнивают поведение, конверсию, authentication, geography и дороговизну endpoints. Окончательного вывода по одному росту RPS сделать нельзя; mitigation должна учитывать false positives.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

541. Почему app-layer DDoS hardest to separate from legitimate traffic?

   **Ответ:** Запросы могут выглядеть корректными и идти из реальных browser stacks. Различать приходится по поведению, identity и resource cost, сохраняя доступ легитимным пользователям.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

542. Как capacity planning helps against some forms of DDoS?

   **Ответ:** Headroom и знание capacity позволяют пережить ограниченные bursts и выбрать ранний admission control. Бесконечное масштабирование против attack экономически и технически невозможно.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

543. Почему anycast useful for resilience?

   **Ответ:** Anycast может распределять трафик между sites и сокращать область отказа. Реальное распределение зависит от routing, а каждый site всё равно имеет предел capacity.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

544. Какие counters важны для SYN flood analysis?

   **Ответ:** Важны SYN rate, SYN_RECV, listen drops/overflows, SYN cookies и successful accepts. Соотносят их с CPU/PPS и размером backlog.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

545. Какие counters важны для L7 flood analysis?

   **Ответ:** Нужны per-endpoint RPS, latency, concurrency, auth outcomes, cache hit rate и backend saturation. Один общий RPS скрывает дорогие операции.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

546. Почему observability and alerting critical for DDoS response?

   **Ответ:** Раннее обнаружение позволяет включить согласованные меры до полного exhaustion. Метрики также показывают, помогают ли controls и сколько legitimate traffic теряется.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

547. Что должен понимать software engineer about DDoS-safe application design?

   **Ответ:** Нужны bounded queues, request size/time limits, quotas, admission control и backpressure. Отказ должен быть дешевле продолжения дорогой работы.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

548. Какие mistakes разработчиков worsen DDoS impact?

   **Ответ:** Вредят unbounded buffers, дорогая работа до authentication, retry storms и отсутствие deadlines. Один внешний request не должен бесконтрольно множить внутренние операции.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

549. Какие interview вопросы по DDoS показывают understanding of layers and mitigation?

   **Ответ:** Спросите, почему host rate limiter не спасает saturated uplink и чем SYN flood отличается от дорогого API flood. Ожидается выбор controls по bottleneck.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

550. Какие practical first steps useful during suspected DDoS incident?

   **Ответ:** Подтверждают user impact и bottleneck, собирают counters/samples, активируют runbook и связываются с upstream/response team. Изменения контролируют по метрикам и rollback.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

### Продвинутый уровень
551. Как distinguish network saturation, state exhaustion and app-resource exhaustion?

   **Ответ:** Сеть проверяют по bps/pps/drops, state — по connection/backlog/conntrack occupancy, application — по CPU/workers/queues/dependencies. Симптомы могут сочетаться.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

552. Как build layered DDoS defense across network, proxy, app and infrastructure?

   **Ответ:** Upstream фильтрует volume, proxy ограничивает connections/requests, application применяет quotas/admission, инфраструктура изолирует failures. Controls размещают до дорогого ресурса.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

553. Как queue tuning, backlog, SYN cookies and connection limiting affect resilience?

   **Ответ:** Backlog сглаживает bursts, cookies снижают half-open state, limits ограничивают concurrency. Увеличение очередей без capacity увеличивает latency и не устраняет overload.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

554. Как C/C++ servers should fail gracefully under overload?

   **Ответ:** Ограничивают resources, отказывают рано, закрывают просроченные операции и сохраняют management/health capacity. Не допускают неконтролируемого allocation на входной length.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

555. Какие patterns useful for overload protection: backpressure, admission control, shed load, bounded queues?

   **Ответ:** Admission control решает, принимать ли работу; bounded queues ограничивают ожидание; backpressure замедляет producers; load shedding отбрасывает часть нагрузки для сохранения полезного обслуживания.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

556. Почему unbounded memory allocation dangerous during attack?

   **Ответ:** Attacker может заставить процесс исчерпать RAM или вызвать OOM. Проверяют lengths до allocation и вводят per-connection и global budgets.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

557. Как rate limiting can be bypassed or harm legitimate clients?

   **Ответ:** IP rotation обходит per-IP limits, а общий NAT объединяет legitimate users. Нужны несколько уровней ключей/quotas и измерение false-positive impact.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

558. Как bot behavior analysis differs from simple IP blacklisting?

   **Ответ:** Behavior analysis оценивает последовательности, timings, identity и resource cost; blacklist смотрит главным образом адрес. Поведенческие признаки тоже ошибаются и требуют validation.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

559. Какие telemetry dimensions important: PPS, BPS, conn rate, handshake failure rate, CPU, queue depth, error mix?

   **Ответ:** PPS/BPS описывают сеть, conn/handshake rates — transport, CPU/queues — processing, error mix — результат. Совместный анализ показывает место exhaustion.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

560. Как design incident runbooks for DDoS events?

   **Ответ:** Runbook задаёт признаки, роли, upstream contacts, безопасные mitigation steps, success metrics и rollback. Его проверяют учениями, а доступы готовят заранее.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

561. Как test DDoS resilience ethically and safely?

   **Ответ:** Используют согласованную изолированную среду, ограниченные нагрузку/время и stop conditions. Проверяют overload behavior и recovery без трафика к посторонним системам.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

562. Как anti-spoofing at Internet scale reduces reflection DDoS?

   **Ответ:** Source filtering мешает отправлять запросы от имени жертвы, поэтому reflectors не направляют ей forged-source responses. Эффект требует широкого внедрения у источников.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

563. Какие anti-patterns most often make services fragile under DDoS?

   **Ответ:** Хрупкость создают single bottleneck, открытый origin, отсутствие resource limits, expensive unauthenticated work и retry storms. Capacity без admission policy недостаточна.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

564. Какие interview вопросы по DDoS distinguish surface familiarity from deep engineering knowledge?

   **Ответ:** Предложите выбрать действия при PPS saturation без высокой CPU приложения и при backend exhaustion без большого bandwidth. Сильный ответ различает bottlenecks и mitigation placement.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

565. Что особенно важно знать senior engineer about DDoS mitigation limits and trade-offs?

   **Ответ:** Любой слой имеет capacity и false-positive costs. Нужны upstream coordination, наблюдаемость и приоритизация полезного traffic; абсолютную защиту от любого объёма обещать нельзя.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

### Инженерные вопросы
566. Почему DDoS — это проблема не только security, но и reliability engineering?

   **Ответ:** DoS использует те же capacity/failure limits, что и обычный overload. Защита требует SLO, bounded resources, деградации и восстановления.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

567. Какие mitigation layers самые важные для public Internet services?

   **Ответ:** Нужны upstream/edge защита, ограниченный transport state, proxy limits и application admission/quotas. Origin должен быть защищён от прямого обхода edge.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

568. Как объяснить DDoS на интервью через attack classes and defense layers?

   **Ответ:** DDoS распределённо исчерпывает канал, protocol state или application resources. Защиту размещают до bottleneck и дополняют response coordination.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

569. Что должен понимать C/C++ engineer about overload-safe network service design?

   **Ответ:** Нужны bounded allocations, explicit lifetimes, concurrency limits, deadlines и дешёвое отклонение. Partial I/O и disconnect не должны оставлять ресурсы навсегда.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

570. Какие DDoS темы нужно знать глубоко даже без работы в anti-DDoS team?

   **Ответ:** Глубоко нужны bottleneck detection, rate/concurrency limits, queues, timeouts, upstream boundaries и recovery. Детали специализированного scrubbing изучают по роли.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

---

## 11. Базовые принципы защиты

### Базовый уровень
571. Что такое principle of least privilege?

   **Ответ:** Принцип минимальных привилегий выдаёт субъекту только права, необходимые для его задач, на нужный срок. Это ограничивает последствия ошибок и компрометации.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

572. Почему default deny полезен в security?

   **Ответ:** Default deny запрещает доступ без явного разрешения. Новые resources/actions не становятся публичными из-за пропущенного правила.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

573. Что такое segmentation and isolation?

   **Ответ:** Segmentation разделяет сеть на области с контролируемыми переходами; isolation ограничивает совместное влияние workloads. Межсегментный доступ задают policy.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

574. Почему segmentation reduces blast radius?

   **Ответ:** Компрометация одного workload не должна автоматически давать reachability и полномочия ко всем остальным. Границы проверяют технически, а не только схемой сети.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

575. Что такое authentication vs authorization?

   **Ответ:** Authentication устанавливает identity, authorization определяет разрешённые ей действия над ресурсом. Успешный login или mTLS не означает полный доступ.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

576. Почему strong identity critical for secure networking?

   **Ответ:** Надёжная identity позволяет применять права к конкретному workload/user независимо от адреса. Без неё сложно безопасно отзывать доступ и расследовать действия.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

577. Что такое patching and why is it security control?

   **Ответ:** Patching устраняет известные дефекты в доступном software и dependencies. Управляют inventory, приоритетами по exposure и проверкой rollout/recovery.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

578. Почему secret management важен?

   **Ответ:** Secrets management контролирует выдачу, хранение, доступ, ротацию и отзыв keys/tokens. Секреты в source code или logs сложно отозвать и защитить.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

579. Почему logging and monitoring — часть защиты?

   **Ответ:** Они позволяют обнаружить misuse, подтвердить работу controls и восстановить timeline. Логи должны быть защищены от подмены и не содержать секретов.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

580. Что такое secure configuration baseline?

   **Ответ:** Baseline — проверяемый набор безопасных настроек для типового сервиса/host. Он включает exposed ports, access policy, TLS, limits и logging.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

581. Почему unnecessary services should be disabled?

   **Ответ:** Каждый listener/dependency увеличивает поверхность атаки и расходы на обновление. Ненужный service лучше отключить, чем полагаться на его неиспользование.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

582. Что такое hardening на базовом уровне?

   **Ответ:** Hardening уменьшает attack surface и привилегии через безопасную конфигурацию, удаление лишних компонентов, ограничения доступа и обновления.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

583. Почему backups и disaster recovery связаны с security?

   **Ответ:** Атаки могут уничтожить или зашифровать данные. Изолированные backups и проверенное восстановление уменьшают ущерб, но не возвращают конфиденциальность уже украденных данных.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

584. Почему asset inventory важен для защиты?

   **Ответ:** Невозможно надёжно обновлять и контролировать неизвестные endpoints, owners и credentials. Inventory нужен для exposure assessment, expiry monitoring и incident response.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

585. Что такое principle of minimal exposure?

   **Ответ:** Минимальная exposure означает открывать лишь необходимые interfaces, ports и данные, для нужной аудитории. Internal/admin endpoints не должны становиться публичными случайно.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### Средний уровень
586. Как least privilege applies to services, users, network paths and credentials?

   **Ответ:** Service получает нужные API actions, user — нужные object permissions, network path — разрешённые destinations, credential — ограниченные scope/lifetime. Проверяют фактическое enforcement.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

587. Почему network segmentation не заменяет encryption?

   **Ответ:** Segmentation ограничивает достижимость, но не скрывает содержимое разрешённого канала от наблюдателя. Для confidentiality/integrity нужен защищённый transport.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

588. Почему encryption не заменяет authorization?

   **Ответ:** Шифрованный запрос может просить недопустимую операцию. Authorization связывает authenticated principal, action и resource, включая tenant boundary.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

589. Как firewall rules should align with actual service architecture?

   **Ответ:** Rules выводят из реальных dependencies: source identity/segment, destination и port/protocol. У правил должны быть owner, purpose и проверка после изменений.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

590. Почему broad trust between internal services dangerous?

   **Ответ:** Один compromised service получает возможность двигаться по сети и использовать чрезмерные credentials. Ограничивают и reachability, и application permissions.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

591. Что такое mTLS as identity and channel protection combined?

   **Ответ:** mTLS защищает channel и позволяет обеим сторонам проверить certificate identity. Сопоставление identity с разрешёнными actions остаётся отдельной policy.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

592. Почему secret rotation must be automated?

   **Ответ:** Ручная ротация плохо масштабируется и часто не охватывает consumers. Автоматизация нужна для доставки, overlap, проверки переключения и быстрого отзыва.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

593. Как vulnerability management ties into network security?

   **Ответ:** Уязвимости ранжируют по exposure, exploitability и impact, затем исправляют/изолируют и проверяют rollout. Одного списка CVE без owners недостаточно.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

594. Почему secure defaults in code more reliable than operator memory?

   **Ответ:** Default configuration действует при первом запуске и ошибках оператора. Secure API должен требовать явного решения для опасного ослабления, а не для включения проверки.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

595. Как observability helps detect misuse, abuse and compromise?

   **Ответ:** Сопоставляют access/auth outcomes, необычные rates и privilege changes с baseline. Нужны достаточный контекст и actionable alerts без утечек данных.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

596. Почему rate limiting и quotas тоже security controls?

   **Ответ:** Они ограничивают расход finite resources и стоимость злоупотреблений. Quotas задают по appropriate principal/tenant и дополняют global budgets.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

597. Как input validation relates to network-facing services?

   **Ответ:** Parser получает данные, контролируемые внешней стороной. Проверяют format, lengths, ranges и допустимость операции в protocol state до использования input.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

598. Почему bounded resource usage important for resilience and security?

   **Ответ:** Ограниченные buffers, queues, concurrency и deadlines препятствуют дешёвому resource exhaustion. Нужны per-client и global limits.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

599. Как dependency updates relate to exposed network software?

   **Ответ:** Открытый сервис наследует vulnerabilities своего TLS stack, parsers и runtime. Нужны dependency inventory, обновления и проверяемый rollout.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

600. Что должен понимать software engineer about turning principles into engineering practice?

   **Ответ:** Принцип превращают в invariant, configuration default и проверку. Например: каждый request проходит authorization, а неизвестный CA всегда приводит к отказу.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### Продвинутый уровень
601. Как translate security principles into concrete design requirements?

   **Ответ:** Для каждого риска задают конкретное требование, owner и проверку. Например: private key недоступен worker без необходимости, а expired certificate отвергается клиентом.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

602. Как map threats to controls systematically?

   **Ответ:** Описывают assets, actors, boundaries и attack paths, затем выбирают preventive/detective/recovery controls. У каждого control должна быть проверяемая цель.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

603. Как avoid security theater and focus on high-value controls?

   **Ответ:** Приоритет получают controls, снижающие реальные attack paths и impact. Эффективность подтверждают тестами, telemetry и сокращением измеримых рисков.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

604. Какие controls universal for most network services: TLS, auth, logging, segmentation, patching, least privilege?

   **Ответ:** Часто нужны authenticated transport, authorization, least privilege, limits, logs и updates. Конкретная реализация зависит от данных, exposure и модели угроз.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

605. Как security principles differ for internal-only vs Internet-facing services?

   **Ответ:** Public service ожидает произвольный hostile input и крупный overload; internal service учитывает compromised workloads и lateral movement. Оба требуют identity и limits.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

606. Как build defense in depth without unmanageable complexity?

   **Ответ:** Выбирают несколько независимых controls с понятными owners и границами. Избыточные layers без observability увеличивают конфигурационные ошибки и затрудняют recovery.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

607. Какие trade-offs between usability, operability and security most common?

   **Ответ:** Частые компромиссы: short-lived credentials против доступности issuance, строгий access против удобства, telemetry против privacy. Решение фиксируют через threats и recovery requirements.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

608. Как C/C++ services can embody secure defaults at API and config levels?

   **Ответ:** API по умолчанию проверяет peer, ограничивает lengths/resources и требует explicit authorization. Ошибки возвращаются как ошибки, а не как успех с ослабленной проверкой.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

609. Какие interview вопросы по базовым принципам защиты показывают зрелость мышления?

   **Ответ:** Спросите, как обеспечить least privilege для конкретного daemon и проверить его. Сильный ответ назовёт credentials, filesystem, network paths и негативные тесты.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

610. Что особенно важно знать senior engineer about applying principles, not just reciting them?

   **Ответ:** Нужно связывать controls с threats и operational costs, назначать owners и проверять effectiveness. Список модных технологий без модели риска не заменяет design.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### Инженерные вопросы
611. Почему базовые принципы защиты важнее экзотических механизмов?

   **Ответ:** Большинство ошибок связано с лишним доступом, непроверенными данными, утечкой secrets и отсутствием limits. Базовые controls закрывают широкий круг attack paths.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

612. Какие security principles should every network/software engineer internalize?

   **Ответ:** Нужны least privilege, explicit trust, default deny, minimal exposure, defense in depth и fail-closed. Они должны проявляться в API, configuration и operations.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

613. Как объяснить basic defense principles на интервью через реальные примеры?

   **Ответ:** Примеры: service account без admin прав, private listener для management, TLS verification и bounded queue. Для каждого объясняют threat и способ проверки.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

614. Что особенно важно знать C/C++ инженеру про secure service design?

   **Ответ:** Особенно важны safe parsing/ownership, resource budgets, authentication/authorization и корректный TLS API. Нужны fuzzing, sanitizers и тесты отрицательных путей.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

615. Какие темы защиты нужно знать глубоко перед углублением в конкретные атаки и протоколы?

   **Ответ:** Сначала изучают trust boundaries, identity/authorization, key lifecycle, безопасный parsing, resource limits и observability. На этой основе легче выбирать конкретные защитные механизмы.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

---

## 12. Secure coding и C/C++ в сетевом контексте

### Базовый уровень
616. Почему C/C++ особенно чувствительны к security bugs?

   **Ответ:** Язык допускает небезопасный доступ к памяти и ошибки lifetime; C++ abstractions уменьшают риск, но не делают любой код memory-safe. Network input увеличивает exposure.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

617. Какие классы memory bugs особенно опасны в network-facing C/C++ code?

   **Ответ:** Особенно опасны out-of-bounds read/write, use-after-free, double free и data races. Они могут раскрыть secrets, повредить state или дать выполнение кода.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

618. Что такое buffer overflow?

   **Ответ:** Buffer overflow — доступ с записью за границы выделенного буфера. Проверяют фактическую capacity и арифметику длины до копирования.

   **Пример:** Наличие length в packet не означает, что столько байтов реально получено.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

619. Что такое use-after-free?

   **Ответ:** Use-after-free — обращение к объекту после завершения его lifetime. В async code причиной часто становится callback, сохранивший pointer после закрытия connection.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

620. Что такое integer overflow и почему он опасен при парсинге сетевых данных?

   **Ответ:** Overflow может превратить большую длину в маленький allocation, после чего copy выйдет за границы. Для signed overflow возможен UB; unsigned wrap тоже требует проверок.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

621. Почему untrusted input всегда нужно считать враждебным?

   **Ответ:** Любой peer может быть compromised или ошибаться. Перед использованием input проверяют boundaries, ranges, state и resource cost, независимо от внутреннего адреса.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

622. Почему network packet parsing — high-risk зона?

   **Ответ:** Parser переводит управляемые attacker bytes в lengths, offsets и state transitions. Ошибка здесь часто происходит до authentication и доступна любому подключившемуся.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

623. Почему length fields нельзя доверять без проверки?

   **Ответ:** Заявленная длина может превышать remaining bytes, overflow arithmetic или resource budget. Проверяют все три условия до allocation и доступа.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

624. Почему string handling в C/C++ опасен в сетевом коде?

   **Ответ:** Network bytes не обязаны содержать NUL, а encoding и byte length различаются. Используют length-aware APIs и не передают raw buffers в strlen/printf как строки.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

625. Что такое fail-closed behavior?

   **Ответ:** Fail-closed означает отказ в защищаемой операции, если обязательная проверка не выполнена или завершилась ошибкой. Это не обязательно остановка всего процесса.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

### Средний уровень
626. Какие secure coding practices важны для socket/TLS/network protocol code?

   **Ответ:** Нужны explicit ownership, checked lengths/arithmetic, limits, deadlines и корректная обработка partial I/O. TLS integration должна проверять peer и contract каждого API.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

627. Почему bounds checking критичен при разборе пакетов?

   **Ответ:** Каждое поле читают только внутри доступного диапазона, а связанные lengths проверяют совместно. Удобнее сравнивать length с remaining, чем сначала складывать offsets.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

628. Почему state machines нужно проектировать defensively?

   **Ответ:** Peer может прислать valid message в недопустимой фазе или повторить старый. State machine должна явно разрешать transitions и ограничивать timers/resources.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

629. Как malformed input should be handled safely?

   **Ответ:** Некорректное сообщение отклоняют по protocol contract, очищают принадлежащие ему resources и логируют ограниченный безопасный контекст. Нельзя продолжать с частично проверенным state.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

630. Почему timeouts и resource limits — часть безопасности?

   **Ответ:** Они ограничивают удержание connections, memory и workers медленными/враждебными peers. Deadline нужен для всей операции, а не только одного recv.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

631. Почему unbounded buffers/queues опасны?

   **Ответ:** Внешний producer может накапливать данные быстрее consumer. Без budgets это приводит к memory exhaustion и большой latency даже без corruption.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

632. Как structured logging помогает incident analysis?

   **Ответ:** Стабильные поля stage, error class, connection/request ID и timestamp позволяют связывать события без разбора произвольного текста.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

633. Почему secrets нельзя логировать?

   **Ответ:** Logs часто доступны шире и живут дольше исходного запроса. Утекшие tokens/keys дают реальные полномочия; masking и allowlist полей должны быть системными.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

634. Почему certificate validation нельзя “временно отключить и забыть”?

   **Ответ:** Временный bypass часто остаётся в production и позволяет impersonation. Исправляют root cause chain/name/trust и проверяют, что negative cases отвергаются.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

635. Как правильно обрабатывать ошибки из TLS libraries?

   **Ответ:** Сохраняют код возврата, применяют SSL_get_error по контракту и различают readiness, closure и fatal errors. Error queue читают вовремя и без раскрытия secrets.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

636. Почему unsafe fallback logic dangerous?

   **Ответ:** Fallback на HTTP, слабую authentication или ignored certificate errors позволяет attacker инициировать ослабление. Повторные попытки должны сохранять policy.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

637. Как concurrency bugs become security issues?

   **Ответ:** Race может обойти authorization state, использовать освобождённый object или смешать tenants. Нужны ownership и синхронизация, соответствующие модели concurrency.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

638. Почему fuzzing особенно полезен для network parsers?

   **Ответ:** Fuzzing генерирует множество malformed/truncated inputs и необычных sequences. Он находит paths, которые трудно вручную перечислить, особенно вместе с sanitizers.

   **Источник:** [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html).

639. Как ASan/UBSan/TSan помогают security posture?

   **Ответ:** ASan выявляет многие memory errors, UBSan — selected UB, TSan — data races. Они дополняют review/testing, но не доказывают отсутствие уязвимостей.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

640. Какие common mistakes делают в C/C++ network clients and servers?

   **Ответ:** Часты unchecked lengths, dangling callbacks, игнорирование partial I/O, unbounded allocation, verify bypass и неправильное закрытие fd. Проверяют также negative paths.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

641. Что должен понимать C/C++ engineer о secure coding before writing custom protocols?

   **Ответ:** Сначала определяют wire format, state machine, ownership, limits и authenticated channel. Собственный crypto protocol без экспертизы лучше не изобретать.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

642. Какие interview вопросы по secure C/C++ networking показывают практический опыт?

   **Ответ:** Предложите разобрать frame с length больше buffer и disconnect во время async write. Ожидаются checked arithmetic, lifetime и cleanup.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

643. Как code review should focus on network/security hotspots?

   **Ответ:** Review концентрируют на trust boundaries, parsing, allocations, identity checks, state transitions и async lifetime. Для опасных paths требуют явных invariants.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

644. Какие dangerous anti-patterns чаще всего встречаются в сетевом C/C++ коде?

   **Ответ:** Опасны cast wire bytes в native struct, unchecked memcpy, raw owning pointers в callbacks, shared mutable state и ignored TLS errors.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

645. Почему “работает на happy path” ничего не говорит о security?

   **Ответ:** Happy path не проверяет malicious lengths, reordering, disconnects, timeouts и overload. Security свойства подтверждают negative tests и анализом invariants.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

### Продвинутый уровень
646. Как design parser boundaries, memory ownership and lifetime to reduce risk?

   **Ответ:** Parser принимает bounded byte view, возвращает проверенную структуру, а ownership отделён от borrowed references. Async consumers не должны переживать владельца backing buffer.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

647. Как represent protocol state safely and explicitly?

   **Ответ:** Состояния представляют enum/variant с допустимыми transitions и данными конкретной фазы. Не допускают неявных комбинаций flags, позволяющих обход authentication.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

648. Как choose fail-fast vs tolerate-invalid behavior in network-facing components?

   **Ответ:** Ошибки границ/authentication отвергают; toleration допустима лишь для явно разрешённых protocol вариантов. Политика должна исключать разный parsing одного сообщения компонентами.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

649. Как integrate fuzzing, sanitizers and protocol corpus tests into CI?

   **Ответ:** Запускают corpus regression, bounded fuzz jobs и отдельные sanitizer builds. Найденные crashes минимизируют и сохраняют как regression inputs; stateful flows тоже покрывают.

   **Источник:** [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

650. Как build observability that supports security investigations without leaking secrets?

   **Ответ:** Используют structured error categories, IDs, counts и redaction. Raw packet/payload logging ограничивают; keys и bearer tokens исключают всегда.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

651. Как secure coding intersects with performance constraints in high-rate networking?

   **Ответ:** Bounds checks и budgets задают как invariants, затем измеряют copies/allocations. Оптимизация не должна убирать validation; zero-copy требует более строгого lifetime contract.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

652. Как reason about side effects of partial reads/writes, retries and reconnect logic on security?

   **Ответ:** Partial write не равен atomic operation; после reconnect сервер мог уже выполнить request. Retry требует idempotency/deduplication, а buffers должны жить до завершения I/O.

   **Источник:** [send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

653. Как certificate and key handling should be isolated in C/C++ systems?

   **Ответ:** Ограничивают доступ к key material, используют защищённую загрузку и отдельный lifecycle context. Не копируют secrets в logs, exception messages и лишние buffers.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

654. Какие architecture patterns reduce bug density in security-sensitive network services?

   **Ответ:** Помогают небольшой проверенный parser, explicit state machine, RAII ownership и изоляция privileged operations. Узкие interfaces уменьшают число возможных неправильных состояний.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

655. Какие interview вопросы по secure C/C++ networking distinguish senior engineers?

   **Ответ:** Полезен разбор race между timeout и завершением write с tenant-bound auth state. Сильный ответ объясняет ownership, exactly-once cleanup и границы retries.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

656. Какие anti-patterns most often lead to exploitable bugs in network daemons?

   **Ответ:** Чаще вредят unchecked lengths, implicit ownership, fail-open verification, unbounded resources и неоднозначный parsing между proxy/backend. Каждая проблема доступна через внешний input.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

657. Что особенно важно знать senior C/C++ engineer about writing safe networked systems?

   **Ответ:** Нужно проектировать invariants через memory, protocol state, authentication и resources, а не добавлять проверки случайно. Проверяемые negative paths обязательны.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

658. Как explain secure coding mindset on interview with practical examples?

   **Ответ:** Пример: сначала проверяю length против remaining и budget, затем создаю объект с явным владельцем; malformed input не изменяет authenticated state.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

659. Как test negative paths and malformed traffic systematically?

   **Ответ:** Матрица включает truncation каждого поля, boundary lengths, invalid states, повтор сообщений, disconnect и timeout races. Дополняют fuzzing, sanitizers и resource-budget checks.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

660. Что нужно знать глубже всего: parsing, memory safety, auth, TLS integration or resource control?

   **Ответ:** Все перечисленные области обязательны на границах сервиса. Приоритет определяют exposure и роль; безопасный parser не компенсирует отсутствующую authorization.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### Инженерные вопросы
661. Почему secure network programming на C/C++ требует дисциплины на каждом уровне?

   **Ответ:** Корректность нужна от bytes и lifetime до identity и resource limits. Уязвимость одного слоя может обойти защиту остальных.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

662. Какие классы ошибок самые опасные для public-facing services?

   **Ответ:** Наиболее опасны memory corruption, authentication/authorization bypass, secret leakage и resource exhaustion. Они дают выполнение кода, чужие права или отказ услуги.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

663. Как объяснить secure coding in networking на интервью?

   **Ответ:** Объясняют границы input, checked parsing, ownership, state machine, TLS verification и budgets. Подкрепляют конкретным malformed-input или disconnect сценарием.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

664. Какие темы secure C/C++ стоит обязательно включить в большой сборник вопросов?

   **Ответ:** Стоит включить bounded parsing, arithmetic overflow, RAII/async lifetime, TLS API, authorization, fuzzing/sanitizers и overload control.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

665. Что особенно важно знать разработчику сетевого ПО про безопасность кода?

   **Ответ:** Главное — не доверять input и адресам, владеть resources явно, проверять identity/permissions и ограничивать стоимость запросов. Errors должны сохранять security invariants.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

---

## 13. Практика, observability и troubleshooting в security

### Базовый уровень
666. Как понять, что проблема security-related, а не просто networking issue?

   **Ответ:** Отделяют reachability от явного policy/auth/verification rejection и проверяют audit evidence. Timeout сам по себе не доказывает security incident.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

667. Какие симптомы характерны для TLS/certificate issue?

   **Ответ:** Характерны verification errors, alerts, chain/name/expiry failures после TCP connect. Проверяют точный endpoint, SNI и клиентский trust store.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

668. Какие симптомы характерны для MITM or trust issue?

   **Ответ:** Неожиданные issuers, differing chains по сетям и trust failures требуют расследования. Штатные proxy/rotation нужно исключить до вывода об атаке.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

669. Какие симптомы характерны для VPN misconfiguration?

   **Ответ:** Handshake может отсутствовать либо inner traffic работать частично. Проверяют credentials, AllowedIPs/selectors, routes, firewall, DNS и MTU.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

670. Какие симптомы характерны для DDoS?

   **Ответ:** Признаки: необычный volume/connection rate, saturation, очереди и рост failures. Сравнивают с baseline; legitimate flash crowd может выглядеть похоже.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

671. Почему security incidents часто выглядят как обычные connectivity problems?

   **Ответ:** Firewall drops, failed TLS и overloaded auth service могут выглядеть как timeout. Классификация требует данных конкретной стадии и обеих сторон.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

672. Какие базовые инструменты useful in security troubleshooting?

   **Ответ:** Используют ip/ss, tcpdump, dig, openssl и audit/application logs. Инструмент выбирают по гипотезе и границе, а не запускают всё без контекста.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [OpenSSL: s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

673. Почему `tcpdump`, `openssl s_client`, `dig`, `ss`, logs useful together?

   **Ответ:** dig проверяет resolution, ss — transport state, tcpdump — packets, s_client — TLS, logs — policy outcome. Вместе они связывают стадии одного запроса.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [OpenSSL: s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

674. Что нужно собрать первым делом при suspected security incident?

   **Ответ:** Фиксируют scope, impact, timestamps, endpoints, recent changes и безопасные snapshots/logs. По возможности сохраняют evidence до restart или изменения policy.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

675. Почему exact timestamps and correlation IDs важны?

   **Ответ:** Они позволяют сопоставить события на нескольких hosts/proxies и отличить причину от следствия. Проверяют clock offsets и timezone, а не только формат строки.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### Средний уровень
676. Как build workflow for TLS/HTTPS/VPN incident diagnosis?

   **Ответ:** Идут от DNS/transport к TLS/identity, tunnel state, routes и application policy. Для каждой стадии формулируют гипотезу и проверяемый expected result.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

677. Как distinguish auth failure from reachability failure?

   **Ответ:** Reachability подтверждают transport exchange, auth failure — явным TLS/application отказом. Packet timeout не указывает, какой policy layer остановил запрос.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

678. Как distinguish cert trust failure from hostname mismatch?

   **Ответ:** Trust failure касается цепочки до anchor; mismatch — expected identity и SAN. Исправления различаются, поэтому сохраняют точный verification reason.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

679. Как distinguish firewall block from app-level auth reject?

   **Ответ:** App reject обычно даёт application response и audit record; firewall block — drop/reject на пути. Проверяют packet exchange и logs соответствующих компонентов.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

680. Как detect possible spoofing or MITM signs from logs and traces?

   **Ответ:** Сопоставляют unexpected mappings/certificates, source inconsistencies и verification events с inventory. Каждый индикатор проверяют через независимый vantage point.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

681. Как recognize DDoS vs legitimate traffic spike?

   **Ответ:** Смотрят source/behavior mix, expensive endpoints, auth outcomes и business conversion. Делают несколько гипотез; увеличение нагрузки ещё не доказывает malicious intent.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

682. Какие counters and alerts useful for security observability?

   **Ответ:** Полезны auth deny/failure rates, TLS verify errors, expiry, firewall drops, credential changes и resource saturation. Alerts должны иметь owner и actionable context.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

683. Почему security telemetry should include both successes and failures?

   **Ответ:** Успехи дают baseline и показывают suspicious successful access, который failure-only logs пропустят. Чувствительные поля и cardinality ограничивают.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

684. Как rate of handshake failures can reveal attack or misconfig?

   **Ответ:** Рост может означать attack, несовместимый client rollout, expiry или broken proxy. Разделяют причины по stage, client version, endpoint и времени.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

685. Как VPN state and route telemetry should be correlated?

   **Ответ:** Связывают SA/handshake events с route changes, inner counters и service probes. Tunnel up без правильного return path не доказывает availability.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

686. Как logging too little and too much both hurt investigations?

   **Ответ:** Мало logs не даёт timeline; избыток создаёт noise, cost и secret leakage. Выбирают structured allowlist полей и разумный retention.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

687. Как preserve forensic usefulness without logging secrets?

   **Ответ:** Сохраняют timestamps, IDs, outcomes, configuration versions и integrity/access controls logs. Секреты заменяют безопасными references, не raw tokens.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

688. Как C/C++ services should expose actionable security diagnostics?

   **Ответ:** Expose stable stage/error categories, safe context и counters; сохраняют low-level error до потери. Diagnostic output не должен менять policy или раскрывать secrets.

   **Источник:** [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

689. Какие interview вопросы по security troubleshooting показывают production experience?

   **Ответ:** Полезен разбор «сертификат обновлён, часть клиентов падает»: ожидаются chains, trust stores, per-node rollout и evidence до rollback.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

690. Какие common anti-patterns break security incident response?

   **Ответ:** Вредят restart до сбора данных, выключение verification, logging secrets, отсутствие owners и хаотичные изменения. Runbook и timeline уменьшают риск.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

### Продвинутый уровень
691. Как combine packet capture, TLS logs, auth logs and routing info in one RCA?

   **Ответ:** Сводят по времени и correlation IDs transport packets, TLS stage, authenticated principal и route/config snapshots. Отмечают факты, гипотезы и недостающие данные отдельно.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

692. Как build security observability for encrypted traffic environments?

   **Ответ:** Нужны endpoint metrics/traces, proxy TLS telemetry, auth outcomes и synthetic probes. Пассивный ciphertext capture дополняет транспортную картину, но не заменяет application evidence.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

693. Как distinguish control-plane security problem from dataplane transport issue?

   **Ответ:** Control plane проверяют по выдаче identity, handshake и policy distribution; dataplane — по actual packets/counters и routes. Existing sessions могут пережить сбой control plane.

   **Источник:** [RFC 7296: IKEv2](https://www.rfc-editor.org/rfc/rfc7296); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

694. Как create safe runbooks for cert expiry, trust failures and VPN outages?

   **Ответ:** Runbook задаёт diagnosis, проверку часов/chain/identity, безопасный rollout и rollback. Для VPN отдельно проверяют auth state, selectors/routes и service probes.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

695. Как drill DDoS or MITM-like incident response safely?

   **Ответ:** Учения проводят в разрешённой изолированной среде с test CA/endpoints, bounded load и stop conditions. Проверяют detection, fail-closed и recovery.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

696. Как use synthetic probes to detect certificate and TLS regressions early?

   **Ответ:** Probes используют реальные SNI, expected identity и representative trust stores. Проверяют expiry, chain, ALPN и application success, а не только открытый порт.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

697. Как detect gradual security degradation before full outage?

   **Ответ:** Следят за expiry windows, drift policy, ростом verification failures, failed rotations и unusual access. Сравнивают cohorts и trends до массового отказа.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

698. Какие metrics must be retained historically for meaningful security RCA?

   **Ответ:** Хранят error/success rates, latency, saturation, auth/TLS categories и config/deploy events. Retention и детализацию выбирают так, чтобы сравнивать с baseline.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

699. Как tie threat model to observability design?

   **Ответ:** Для каждого threat определяют наблюдаемый сигнал, необходимые поля, alert и response. Например, identity misuse требует audit principal/action/resource/outcome.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

700. Какие interview вопросы по security operations best reveal systems thinking?

   **Ответ:** Спросите, как сохранить evidence и доступность при компрометации service credential. Сильный ответ включает scope, отзыв, rotation, dependent services и verification recovery.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

701. Как avoid chasing false positives during incident analysis?

   **Ответ:** Проверяют данные независимым источником и сравнивают с baseline/changes. Не принимают один alert или подозрительный IP за доказательство root cause.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

702. Как design dashboards that show security posture, not just raw counters?

   **Ответ:** Показывают user impact, coverage controls, expiry/rotation health и actionable failures. Raw counters дополняют ratios, trends и breakdown по boundaries.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

703. Какие anti-patterns make encrypted production systems impossible to troubleshoot?

   **Ответ:** Мешают общие opaque errors, отсутствие IDs, неразделённые TLS legs и проверка только портов. Logging plaintext/keys создаёт новый риск вместо observability.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

704. Что особенно важно знать senior engineer about operational security troubleshooting?

   **Ответ:** Нужно одновременно сохранять evidence, availability и security invariants. Mitigation проверяют по impact и не оставляют обходы verification после incident.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

705. Как объяснить свой incident workflow на интервью?

   **Ответ:** Описывают scope/impact, timeline, гипотезы, локализацию слоя, безопасную mitigation и подтверждение recovery. Затем фиксируют root cause и preventive actions.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Инженерные вопросы
706. Почему security observability так же важна, как preventive controls?

   **Ответ:** Controls могут ошибаться или быть обойдены; observability позволяет это обнаружить и ограничить ущерб. Она также подтверждает корректность rollout/recovery.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

707. Какие security troubleshooting навыки обязательны для network/software engineer?

   **Ответ:** Нужны TLS/identity diagnosis, tunnel/routing analysis, audit correlation и resource-exhaustion detection. Инструменты должны применяться с понятной гипотезой.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

708. Что стоит логировать в production network service с точки зрения security?

   **Ответ:** Пишут principal/reference, action/resource, outcome, stage/error class, timestamp и correlation IDs. Credentials, private keys и sensitive payload исключают.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

709. Как объяснить security RCA approach на интервью?

   **Ответ:** RCA связывает user impact с конкретным механизмом отказа/атаки и доказательствами. Отдельно описывают enabling conditions, detection gaps и проверяемые corrective actions.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

710. Какие темы security operations нужно знать глубоко?

   **Ответ:** Глубоко нужны certificate/key lifecycle, identity/authorization failures, secure logging, incident handling и observability encrypted paths. Конкретные attack signatures зависят от роли.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

---

## 14. Сквозные вопросы по Network Security

### Архитектура и принципы
711. Почему network security нельзя свести к “включить TLS”?

   **Ответ:** TLS защищает channel; остаются authorization, memory safety, secret handling, overload и endpoint compromise. Security design должен охватывать весь путь данных.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

712. Как threat model влияет на выбор TLS, VPN, segmentation, mTLS и auth?

   **Ответ:** Threat model определяет защищаемые assets и boundaries. TLS/mTLS защищают application channel/identity, VPN — сетевую связность, segmentation и auth ограничивают доступ.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

713. Почему identity и trust часто важнее простого шифрования?

   **Ответ:** Зашифрованный канал к attacker не решает задачу. Нужны доказательство ожидаемой identity и ограничения того, кому/чему разрешено доверять.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

714. Как defense in depth practically выглядит в сетевой системе?

   **Ответ:** Пример: edge filtering, verified TLS, service authorization, bounded parser/resources и audit. Компрометация одного слоя не должна автоматически давать полный доступ.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

715. Почему secure defaults важнее документации “не забудьте включить защиту”?

   **Ответ:** Пропущенная настройка неизбежна при масштабировании. Проверка peer, default deny и resource limits должны действовать при обычном запуске и ошибках configuration.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

716. Почему encryption without validation dangerous?

   **Ответ:** Без authentication можно безопасно зашифровать данные для посредника. Validation связывает keys с ожидаемым endpoint.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

717. Почему internal traffic deserves serious security controls too?

   **Ответ:** Internal hosts могут быть compromised, а routes/configuration — ошибочны. Внутренним services нужны identity, ограниченные privileges и безопасная обработка input.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

718. Как operational simplicity и security sometimes conflict?

   **Ответ:** Более частая rotation и строгие policies требуют automation и recovery. Упрощают управление, сохраняя security invariants, а не отключая проверки.

   **Источник:** [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

719. Как choose between HTTPS, mTLS, IPsec and WireGuard for different trust boundaries?

   **Ответ:** HTTPS подходит для HTTP channel, mTLS — mutual service identity, IPsec/WireGuard — L3 связности. Выбор зависит от границы защиты, clients и control plane.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

720. Почему availability — часть security, а не только reliability?

   **Ответ:** Недоступность мешает авторизованному использованию и может быть целевой атакой. Поэтому capacity limits, DoS controls и recovery входят в модель security.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

### Практика и атаки
721. Как MITM, spoofing и DDoS differ in goals and mechanics?

   **Ответ:** MITM перехватывает/подменяет обмен, spoofing подделывает identity/адрес, DDoS исчерпывает ресурсы. Spoofing может помогать первым двум attack paths.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

722. Почему spoofing often enables other attacks?

   **Ответ:** Подставленная identity позволяет направить traffic не туда, обойти слабые ACL или использовать reflectors. Поэтому проверяют происхождение, а не только format.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

723. Как DDoS differs from ordinary overload?

   **Ответ:** DDoS содержит coordinated malicious load из многих источников, но наблюдаемые saturation симптомы похожи на обычный overload. Attribution требует дополнительных evidence.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

724. Как MITM defenses depend on correct trust validation?

   **Ответ:** Без проверки chain/name attacker может завершить собственный TLS. Trust anchors, identity checks и fail-closed делают authentication реальной.

   **Источник:** [RFC 5280: PKIX](https://www.rfc-editor.org/rfc/rfc5280); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

725. Почему cert expiry — это security issue and reliability issue simultaneously?

   **Ответ:** Expiry прекращает доверие к identity и ломает соединения. Правильное решение — rotation/recovery; отключение validation создаёт security vulnerability.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

726. Как split tunnel VPN creates trade-offs between convenience and risk?

   **Ответ:** Часть traffic получает короткий прямой путь, но обходит VPN controls. Нужны точные routing/DNS policies и понимание доверия endpoint.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

727. Как encrypted traffic changes troubleshooting methods?

   **Ответ:** Основной payload анализ переносится к endpoints/proxies. Capture остаётся полезен для transport, а stage metrics и traces связывают encrypted legs.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

728. Какие attacks remain possible even with HTTPS everywhere?

   **Ответ:** Остаются injection, XSS, authorization bypass, stolen tokens, endpoint compromise и DoS. HTTPS не проверяет business semantics и использование данных после расшифрования.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

729. Какие principles best reduce blast radius after compromise?

   **Ответ:** Помогают least privilege, segmentation, scoped credentials, short lifetime и ограничение lateral reachability. Recovery требует быстрого отзыва и audit.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

730. Какие signs most strongly suggest security misconfiguration rather than random network issue?

   **Ответ:** Детерминированные verify/permission failures после change, совпадение с expiry и разные результаты по trust stores сильнее указывают на config issue. Причину всё равно подтверждают.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

### C/C++ / systems / interviews
731. Что должен понимать C/C++ engineer, если он пишет network-facing services?

   **Ответ:** Нужны hostile-input parsing, ownership/lifetime, protocol state, TLS identity, authorization и bounded resources. Error paths столь же важны, как success paths.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

732. Какие security topics most important for socket/TLS client code?

   **Ответ:** Критичны expected-name verification, trust store, SNI/ALPN, nonblocking errors, deadlines, redirects и credential leakage prevention.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

733. Какие security topics most important for server-side network daemons?

   **Ответ:** Критичны parser safety, authentication/authorization, privileged isolation, connection/resource limits и безопасные logs. Проверяют malformed input и disconnect races.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds).

734. Почему memory safety and protocol parsing central to network security in C/C++?

   **Ответ:** Network bytes прямо управляют parser и allocations; memory error может обойти все последующие проверки. Checked boundaries и explicit ownership уменьшают этот риск.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

735. Какие interview вопросы по network security чаще всего показывают senior-level understanding?

   **Ответ:** Хороши сценарии: missing intermediate только у части клиентов, туннель up без traffic и retry после частичного выполнения. Оценивают evidence, trust boundaries и trade-offs.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

736. Как за 2–3 минуты объяснить роль TLS, HTTPS, VPN и basic defenses на интервью?

   **Ответ:** TLS создаёт authenticated protected channel; HTTPS применяет его к HTTP; VPN переносит выбранные IP flows между peers. Дополняют identity/authorization, limits, updates и monitoring.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

737. Как за минуту объяснить difference between TLS and VPN?

   **Ответ:** TLS защищает соединение приложения, VPN — выбранную сетевую связность до tunnel endpoint. Их можно использовать вместе: VPN не удостоверяет автоматически конечный application server.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

738. Как за минуту объяснить difference between IPsec and WireGuard?

   **Ответ:** IPsec использует ESP/policies и обычно IKE с широким ecosystem; WireGuard — компактный UDP protocol и public-key peers. Сравнивают также management, interoperability и routing.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

739. Как за минуту объяснить MITM and how to stop it?

   **Ответ:** MITM пытается читать/менять обмен, представляясь сторонам. Защита — authenticated TLS с chain/name validation, защищённый trust store и отсутствие insecure fallback.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

740. Как за минуту объяснить DDoS through attack classes and defense layers?

   **Ответ:** DDoS исчерпывает bandwidth/PPS, protocol state или application resources. Защита сочетает upstream filtering, transport limits и application admission/quotas по месту bottleneck.

   **Источник:** [RFC 4732: Internet Denial-of-Service Considerations](https://www.rfc-editor.org/rfc/rfc4732).

741. Какие темы network security нужно знать глубоко networking/software engineer?

   **Ответ:** Глубоко нужны trust/identity, TLS integration, authorization, safe parsing, resource control, secret lifecycle и practical diagnosis. Это повседневные границы network service.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

742. Какие темы достаточно понимать на уровне инженерной интуиции?

   **Ответ:** Обзорно можно знать детали редких attacks и crypto primitives, если не отвечаешь за их реализацию. При работе с VPN/kernel/security stack глубину повышают по роли.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

743. Какие вопросы лучше всего включать в interview kit для C/C++ networking role?

   **Ответ:** Включают TLS trust/name failure, malformed frame, async lifetime, resource exhaustion и proxy identity. Сценарии с code/error evidence лучше проверяют практику.

   **Источник:** [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [OpenSSL: SSL_get_error](https://docs.openssl.org/3.0/man3/SSL_get_error/).

744. Какие темы security стоит изучать дальше после этого блока: PKI, mTLS, authn/authz, eBPF security, Linux hardening, Web security?

   **Ответ:** Дальше полезны PKI automation, workload identity, authorization models, Linux isolation и web security. eBPF/security tooling изучают после понимания базовых trust boundaries.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

745. Какие части Network Security являются лучшим мостом между classic networking и secure systems engineering?

   **Ответ:** Лучший мост — TLS identity, routing/VPN boundaries, protocol parsing, overload protection и incident observability. Они соединяют packet path с поведением безопасного сервиса.

   **Источник:** [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).
