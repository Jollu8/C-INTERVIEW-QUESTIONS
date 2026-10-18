# Вопросы: LTE (4G) (с уклоном в C/C++, сетевую инженерию и системный дизайн)

Практика сетевой стороны: [3GPP L2 LTE/NR — 160 вопросов с ответами для разработчика scheduler и стека eNB/gNB](./09_3gpp_l2_lte_nr.md).

## 1. LTE: общая архитектура

### Базовый уровень
1. Что такое LTE?

   **Ответ:** Long Term Evolution — семейство стандартов 3GPP для E-UTRA/E-UTRAN, то есть радиодоступа и его сети. Вместе с EPC оно образует EPS; в повседневной речи LTE часто называют всю систему доступа к пакетным услугам.

   **Типичная ошибка:** Считать LTE только названием core-сети или одного протокола.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

2. Почему LTE относят к 4G?

   **Ответ:** В индустрии LTE относится к поколению 4G, но формальные требования ITU IMT-Advanced выполнил LTE-Advanced, начиная с Release 10. Ранний LTE Release 8 и LTE-Advanced следует различать, когда обсуждаются требования и возможности.

   **Типичная ошибка:** Приписывать любому раннему LTE все требования и функции LTE-Advanced.

   **Источник:** [3GPP: LTE-Advanced and IMT-Advanced](https://www.3gpp.org/news-events/3gpp-news/itu-r-confers-imt-advanced-4g-status-to-3gpp-lte).

3. Какие ключевые цели были у LTE по сравнению с 3G?

   **Ответ:** Цели включали рост спектральной эффективности и скорости, снижение задержки, гибкую полосу и упрощение пакетной архитектуры. Пиковые показатели зависят от release, UE и конфигурации, а не гарантируются каждому подключению.

   **Типичная ошибка:** Описывать эволюцию только ростом максимальной скорости.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

4. Какие основные компоненты входят в архитектуру LTE?

   **Ответ:** Основные части EPS — UE, E-UTRAN с eNodeB и EPC. В типичной EPC важны MME, S-GW, P-GW и HSS, а policy/charging взаимодействуют с архитектурой через соответствующие функции.

   **Типичная ошибка:** Включать MME в радиобазовую станцию или пропускать HSS при обсуждении аутентификации.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

5. Что такое E-UTRAN?

   **Ответ:** Evolved Universal Terrestrial Radio Access Network — сеть радиодоступа LTE. В базовой архитектуре eNodeB соединяются с EPC по S1 и могут взаимодействовать между собой по X2.

   **Типичная ошибка:** Путать E-UTRAN с EPC или внешним Интернетом.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

6. Что такое EPC?

   **Ответ:** Evolved Packet Core — пакетное ядро EPS, обеспечивающее управление доступом и сессиями, mobility и пользовательский путь к PDN. Логические функции control и user plane могут размещаться разными способами.

   **Типичная ошибка:** Считать EPC простым IP-router без абонентского состояния.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

7. Чем radio access часть LTE отличается от core network?

   **Ответ:** Радиодоступ управляет эфиром, radio bearers и AS-процедурами, core — EPS-сессиями, NAS, аутентификацией и выходом в PDN. На границе они координируются, но не имеют одинакового состояния и ответственности.

   **Типичная ошибка:** Диагностировать отказ NAS как обязательную неисправность PHY.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

8. Что такое eNodeB?

   **Ответ:** eNodeB — узел E-UTRAN, завершающий LTE radio protocols со стороны сети и управляющий радиоресурсами. Он соединяет UE с EPC и участвует в mobility и QoS.

   **Типичная ошибка:** Считать eNodeB только усилителем или антенной.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

9. Что такое UE в LTE?

   **Ответ:** User Equipment — абонентское оборудование с LTE-радиоинтерфейсом и протоколами доступа. В контексте аутентификации важна также USIM с абонентскими данными и секретами.

   **Типичная ошибка:** Путать UE как устройство с единственной неизменной абонентской идентичностью.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

10. Какие функции выполняет EPC?

   **Ответ:** EPC управляет регистрацией и EPS-сессиями, аутентификацией, mobility, bearer/QoS и пользовательской связностью с PDN. Распределение функций между MME, gateways, HSS и policy-узлами определено архитектурой.

   **Типичная ошибка:** Приписывать все функции EPC одному MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

11. Почему LTE архитектурно разделяет access network и core network?

   **Ответ:** Радиофункции имеют жёсткие локальные временные требования, а сессии и доступ к услугам должны сохраняться при смене радиоточки. Разделение даёт стандартизованные границы и независимое развитие частей при координации состояния.

   **Типичная ошибка:** Считать разделение доказательством полной независимости radio и core performance.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

12. Что такое all-IP architecture в контексте LTE?

   **Ответ:** В обычной IP-связности EPS пользовательские данные передаются пакетно, а между сетевыми узлами используется IP-транспорт. Это не означает, что на всех слоях передаются только IP-пакеты без LTE framing, туннелей и сигнализации.

   **Типичная ошибка:** Считать all-IP отсутствием специализированных телеком-протоколов.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

13. Почему переход к all-IP был важен для LTE?

   **Ответ:** Единая пакетная основа упрощает предоставление данных и IP-сервисов, масштабирование и использование Ethernet/IP-инфраструктуры. Для голоса при этом нужны сервисные механизмы, например IMS/VoLTE, а не просто наличие IP.

   **Типичная ошибка:** Считать IP-связность автоматически готовой телефонией со всеми функциями оператора.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

14. Чем LTE архитектурно отличается от legacy circuit-switched сетей?

   **Ответ:** В EPS нет отдельного LTE circuit-switched домена для пользовательского голоса: данные идут по пакетным bearer. Голос обеспечивают IP-сервисы или взаимодействие с legacy-сетями, например CS fallback при соответствующей поддержке.

   **Типичная ошибка:** Считать CS fallback передачей circuit-switched канала непосредственно через LTE PHY.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

15. Что такое bearer в LTE?

   **Ответ:** EPS bearer — логический уровень обслуживания IP-пакетов с общими QoS-характеристиками между UE и P-GW. Он реализуется составными bearer-сегментами; один bearer не обязательно соответствует одному приложению.

   **Типичная ошибка:** Путать EPS bearer с одним TCP-соединением или физическим радиоканалом.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

16. Что такое PDN connection?

   **Ответ:** PDN connection — связность UE с определённой PDN через P-GW, связанная с APN и адресной конфигурацией. Она включает default bearer и может иметь dedicated bearers.

   **Типичная ошибка:** Считать каждый dedicated bearer новой независимой PDN connection.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

17. Что такое default bearer?

   **Ответ:** Это первый EPS bearer новой PDN connection, сохраняемый в течение её существования. Он имеет non-GBR QoS и обеспечивает базовый путь для трафика, не отнесённого к другим bearer.

   **Типичная ошибка:** Путать существование default bearer с постоянным наличием активного radio bearer в idle.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

18. Что такое dedicated bearer?

   **Ответ:** Это дополнительный EPS bearer той же PDN connection для трафика с отдельными QoS-параметрами и packet filters. Он может быть GBR или non-GBR, поэтому dedicated не означает автоматически гарантированную скорость.

   **Типичная ошибка:** Считать dedicated bearer обязательной отдельной IP-адресацией UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

19. Почему LTE считают packet-switched системой?

   **Ответ:** Ресурс обслуживает пакеты и разделяется по расписанию, а не закрепляет постоянный circuit под каждый пользовательский разговор. Гарантии QoS задаются bearer и admission/policy, сохраняя пакетную передачу.

   **Типичная ошибка:** Путать GBR bearer с circuit-switched соединением.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

20. Какие интерфейсы внутри LTE архитектуры считаются ключевыми?

   **Ответ:** Ключевые границы — Uu между UE/eNodeB, S1-MME и S1-U к EPC, X2 между eNodeB. В core важны S11, S5/S8, S6a и SGi; набор зависит от рассматриваемого сценария.

   **Типичная ошибка:** Считать SGi интерфейсом между MME и HSS.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

21. Что такое S1 interface?

   **Ответ:** S1 связывает E-UTRAN с EPC: control часть идёт к MME, user часть — к S-GW. Это логическое разделение, которое не требует отдельных физических кабелей.

   **Типичная ошибка:** Называть весь S1 одним пользовательским GTP-туннелем.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

22. Что такое X2 interface?

   **Ответ:** X2 — интерфейс между eNodeB с control- и, для нужных процедур, user-plane частью. Он поддерживает handover, обмен нагрузкой и координацию; наличие X2 не обязательно для любого LTE handover.

   **Типичная ошибка:** Считать отсутствие X2 полной невозможностью mobility.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

23. Для чего нужен S1-MME?

   **Ответ:** S1-MME переносит S1AP-сигнализацию eNodeB↔MME, включая доставку NAS и управление UE-контекстом. Обычно S1AP работает поверх SCTP/IP.

   **Типичная ошибка:** Считать S1-MME путём пользовательских IP-пакетов к Интернету.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

24. Для чего нужен S1-U?

   **Ответ:** S1-U переносит пользовательские данные между eNodeB и S-GW, обычно по GTP-U/UDP/IP. Идентификаторы туннелей связаны с соответствующими bearer и направлением.

   **Типичная ошибка:** Пытаться декодировать S1-U как S1AP или SCTP.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

25. Для чего нужен X2 между eNodeB?

   **Ответ:** Он позволяет подготовить X2-handover, передать контекст и при необходимости данные, а также обмениваться информацией для координации. Переход user-plane path в EPC завершается соответствующими core-процедурами.

   **Типичная ошибка:** Считать X2 прямым выходом UE во внешнюю PDN.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

26. Чем control signaling отличается от пользовательского трафика в LTE?

   **Ответ:** Control signaling создаёт и изменяет состояние доступа, безопасности, mobility и bearer. User plane переносит пользовательские данные; разделение определяется функцией и протоколом, а не только наличием IP-заголовка.

   **Типичная ошибка:** Считать любой IP-пакет user plane, хотя сигнализация тоже использует IP-транспорт.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

27. Почему архитектурное разделение control plane и user plane критично для LTE?

   **Ответ:** Control и forwarding имеют разные нагрузки, временные требования и модели отказа. Их разделение помогает масштабировать и защищать функции, но согласованность состояния остаётся обязательной.

   **Типичная ошибка:** Считать control plane ненужным после первого подключения пользователя.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

28. Как LTE обеспечивает mobility?

   **Ответ:** UE измеряет радиосреду, сеть управляет connected-mode handover, а idle-mode использует reselection и tracking-area процедуры. Core поддерживает регистрацию и изменение user-plane пути при смене узлов.

   **Типичная ошибка:** Называть любое перемещение UE handover независимо от его состояния.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

29. Как LTE обеспечивает data connectivity?

   **Ответ:** Сеть аутентифицирует UE, создаёт PDN/bearer-контексты и настраивает радио- и туннельные сегменты. Для IP-трафика UE получает адресную конфигурацию, а P-GW соединяет путь с внешней PDN.

   **Типичная ошибка:** Считать успешную RRC connection достаточной для полной IP-связности.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

30. Какие главные сущности в LTE нужно знать до начала изучения процедур?

   **Ответ:** Нужно различать UE, eNodeB, MME, S-GW, P-GW, HSS, APN, PDN connection и EPS bearer. После этого проще проследить S1/X2 и core-интерфейсы в конкретной процедуре.

   **Типичная ошибка:** Учить message flow без понимания, какой узел владеет каким состоянием.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).


### Средний уровень
31. Почему eNodeB объединяет функции, которые раньше были более разделены?

   **Ответ:** В LTE многие радиоуправляющие функции, ранее разделённые между NodeB и RNC в UTRAN, перенесены в eNodeB. Это сокращает число логических узлов radio-path и приближает решения к радио.

   **Типичная ошибка:** Говорить, что все функции старого RNC без исключений перенесены в один неизменный процесс.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

32. Почему EPC построен как распределённая пакетная core-сеть?

   **Ответ:** Разные функции регистрации, mobility, policy и forwarding имеют разные требования к размещению и масштабу. Логическое разбиение EPC позволяет распределять нагрузку, но не обязывает физически разносить каждый узел.

   **Типичная ошибка:** Считать отдельное имя функции обязательным отдельным сервером.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

33. Какие преимущества даёт упрощённая архитектура LTE по сравнению с 3G?

   **Ответ:** Уменьшается число промежуточных radio-узлов, упрощается пакетный путь и локализуются быстрые решения. Выигрыш зависит от реализации, backhaul и конфигурации, а не только от схемы архитектуры.

   **Типичная ошибка:** Обещать низкую end-to-end latency без измерения core и транспорта.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

34. Как LTE поддерживает масштабируемость сети?

   **Ответ:** Сеть добавляет соты и экземпляры core-функций, распределяет UE и сессии и управляет ресурсами. При масштабировании нужно учитывать stateful-контексты, адресацию, tunnels и ограничения соседних узлов.

   **Типичная ошибка:** Считать MME или gateway stateless-сервисом с произвольным балансированием каждого сообщения.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

35. Как архитектура LTE помогает снижать latency?

   **Ответ:** Быстрое radio scheduling, пакетная архитектура и сокращение промежуточных radio-функций уменьшают часть задержек. При этом RRC-состояние, доступ, очереди, backhaul и внешние сервисы определяют фактический бюджет.

   **Типичная ошибка:** Приписывать задержку всего приложения одному LTE TTI.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

36. Почему вынесение радиофункций в eNodeB улучшило responsiveness сети?

   **Ответ:** eNodeB имеет локальные измерения и может быстро выбирать ресурсы и режим передачи без удалённого RNC для каждого решения. Это не отменяет сигнализацию core при сессиях и mobility.

   **Типичная ошибка:** Считать MME управляющим каждым radio allocation.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

37. Как UE, eNodeB и EPC взаимодействуют при подключении пользователя?

   **Ответ:** UE устанавливает radio connection, передаёт NAS через eNodeB к MME, проходит нужные проверки и создаёт сессию через gateways. Затем настраиваются bearer-сегменты; детали зависят от исходного состояния и процедуры.

   **Типичная ошибка:** Описывать attach как один прямой запрос UE к P-GW.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

38. Что такое NAS в архитектуре LTE?

   **Ответ:** Non-Access Stratum — протоколы UE↔core, в EPS главным образом UE↔MME для mobility и session management. eNodeB переносит NAS, но не является его логическим конечным узлом.

   **Типичная ошибка:** Путать NAS с RRC, заканчивающимся на eNodeB.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

39. Чем NAS отличается от AS signaling?

   **Ответ:** AS включает протоколы радиодоступа UE↔eNodeB, например RRC, а NAS связывает UE с MME поверх доставки через доступ. У них разные контексты безопасности, состояния и причины отказа.

   **Типичная ошибка:** Считать успешный RRC exchange доказательством успешного NAS attach.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

40. Почему важно различать radio layer процедуры и core network процедуры?

   **Ответ:** Radio connection и EPS registration/session могут существовать и изменяться по разным правилам. Разделение позволяет понять, где произошёл отказ и какие контексты действительно созданы.

   **Типичная ошибка:** Приравнивать RRC release к удалению PDN connection.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

41. Как S1 интерфейс разделён на control/user части?

   **Ответ:** S1-MME — S1AP/SCTP control path к MME, S1-U — GTP-U/UDP user path к S-GW. Они могут использовать общую IP-инфраструктуру при разных логических endpoint и требованиях.

   **Типичная ошибка:** Считать исправность SCTP достаточной проверкой пользовательского GTP-U-пути.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

42. Почему X2 interface важен для handover?

   **Ответ:** X2 позволяет source eNodeB напрямую подготовить target и передать необходимый контекст без прохождения всей подготовки через MME. При неподходящих условиях используется S1-based handover.

   **Типичная ошибка:** Считать каждый LTE handover X2-based.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

43. Какие риски создаёт отказ eNodeB?

   **Ответ:** Теряются radio service и связанные локальные контексты обслуживаемых UE; восстановление зависит от соседнего покрытия и процедур. Core может ещё хранить сессии, поэтому отказ радио не равен мгновенному удалению всего EPS-state.

   **Типичная ошибка:** Обещать бесшовность любого отказа eNodeB при наличии соседней соты.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

44. Какие риски создаёт отказ MME?

   **Ответ:** Нарушаются управляемые им NAS/S1-процедуры, новые подключения, service requests и часть mobility. Уже настроенный user plane иногда продолжает работать до события или cleanup, но это не гарантированный полный failover.

   **Типичная ошибка:** Считать MME-поломку обязательной немедленной остановкой каждого существующего IP-пакета.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

45. Какие риски создаёт отказ SGW/PGW?

   **Ответ:** Отказ gateway может оборвать user-plane forwarding и затронуть сессии или anchoring. Восстановление зависит от резервирования, сохранения контекстов и возможностей процедур, поэтому его проверяют отдельно от control-plane доступности.

   **Типичная ошибка:** Считать живой MME доказательством исправного пути данных.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

46. Как архитектура LTE связана с roaming?

   **Ответ:** В roaming UE обслуживается visited access/core при взаимодействии с home subscriber и policy-функциями. User plane может быть home-routed или использовать предусмотренный local breakout; различаются пути и интерфейсы.

   **Типичная ошибка:** Считать roaming обязательным выходом в Интернет в visited network.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

47. Что такое home network и visited network в LTE?

   **Ответ:** Home network связана с домашней подпиской UE, visited network предоставляет обслуживание при roaming. Разделение относится к ролям сетей, а не к физическому местоположению конкретного сервера.

   **Типичная ошибка:** Определять home network только по стране текущего нахождения UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

48. Как LTE архитектура помогает поддерживать множество сервисов с разными требованиями?

   **Ответ:** Bearer/QoS, policy, admission и scheduler позволяют по-разному обслуживать группы трафика. Для реального сервиса нужны согласованные параметры радио, core и внешнего пути, а не только маркировка.

   **Типичная ошибка:** Считать отдельный bearer абсолютной end-to-end гарантией приложения.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

49. Как bearer architecture связана с QoS?

   **Ответ:** Каждый EPS bearer связан с QoS-параметрами, применяемыми к отнесённым к нему пакетам. Классификация и policy задают mapping, а radio и transport должны обеспечить соответствующее обслуживание.

   **Типичная ошибка:** Считать QCI одним числом гарантированной скорости для любого bearer.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

50. Почему understanding architecture важно для troubleshooting LTE?

   **Ответ:** Понимание владельцев состояний и интерфейсов позволяет разделить radio, NAS, session и forwarding-ошибки. Диагностика строится по процедуре и границам наблюдения, а не только по пользовательскому симптому.

   **Типичная ошибка:** Начинать менять RF-параметры при отсутствии маршрута на SGi.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

51. Как транспортная IP-сеть оператора интегрируется с LTE архитектурой?

   **Ответ:** IP-backhaul переносит S1/X2 и core-протоколы между логическими узлами. Для него нужны маршрутизация, MTU, QoS, отказоустойчивость и соответствующая синхронизация; tunnel endpoints не заменяют underlay connectivity.

   **Типичная ошибка:** Считать GTP-туннель независимым от IP-маршрута и MTU underlay.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

52. Почему backhaul критичен для LTE performance?

   **Ответ:** Backhaul ограничивает доставляемую скорость, задержку, jitter и потери между radio и core. При перегрузке пользователь может иметь хороший SINR, но низкий goodput и длинные очереди.

   **Типичная ошибка:** Оценивать LTE-performance только по radio peak rate.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

53. Какие bottlenecks возможны вне radio части, но всё равно деградируют LTE сервис?

   **Ответ:** Ограничивать могут backhaul, gateway forwarding, NAT/firewall, DNS, внешняя сеть, сервер и CPU UE. Локализуют bottleneck измерениями на границах, а не предположением по типу доступа.

   **Типичная ошибка:** Считать любое замедление LTE неисправностью базовой станции.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

54. Как control plane load и user plane load влияют на разные части сети?

   **Ответ:** Attach, paging и mobility нагружают MME и signaling, а пользовательские биты — eNodeB, gateways и transport. Нагрузки связаны, но малый объём данных не исключает signaling storm.

   **Типичная ошибка:** Оценивать здоровье control plane только по общему Gbit/s.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

55. Почему при анализе LTE нельзя ограничиваться только радиоинтерфейсом?

   **Ответ:** Сервис проходит через access, transport, core и внешнюю PDN. Исправный эфир не гарантирует успешных authentication, session setup, DNS и передачи данных.

   **Типичная ошибка:** Закрывать диагностику после хорошего RSRP/SINR.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

56. Как LTE архитектура отражает принципы modern distributed systems?

   **Ответ:** Есть распределённое состояние, протокольные автоматы, асинхронные сообщения, таймауты и частичные отказы. Аналогии полезны, но допустимые переходы и recovery определяются telecom-спецификациями.

   **Типичная ошибка:** Подменять стандартный protocol recovery произвольным retry всех сообщений.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

57. Где в LTE можно провести аналогию с классическим networking stack?

   **Ответ:** User plane напоминает последовательность инкапсуляций и forwarding, а control plane — управление сессиями и таблицами состояния. При этом radio bearers, NAS и mobility не сводятся к обычному TCP/IP socket API.

   **Типичная ошибка:** Приравнивать EPS bearer к transport socket один к одному.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

58. Какие части LTE ближе к telecom-specific domain, а какие — к обычной IP networking?

   **Ответ:** Radio scheduling, NAS, subscriber authentication и mobility специфичны для mobile domain. IP routing, UDP/SCTP, очереди, MTU, QoS и observability используют общие сетевые принципы, интегрированные в процедуры EPS.

   **Типичная ошибка:** Считать стандартные IP-инструменты достаточными для полного декодирования LTE-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

59. Что должен понимать software engineer про LTE architecture на уровне сущностей и интерфейсов?

   **Ответ:** Нужно знать роли UE/eNodeB/MME/gateways/HSS, control и user paths, bearer/session-state и основные интерфейсы. Это позволяет определить правильную границу для метрик, capture и обработки отказа.

   **Типичная ошибка:** Учить порты протоколов без понимания владельца состояния.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

60. Какие метрики архитектурного уровня наиболее полезны в эксплуатации LTE сети?

   **Ответ:** Полезны успешность и длительность attach/session/handover, активные контексты и bearer, signaling rates, user-plane goodput и drops. Их дополняют ресурсами узлов и метриками transport, с понятными знаменателями и окнами.

   **Типичная ошибка:** Сравнивать проценты успеха разных процедур без состава попыток.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).


### Продвинутый уровень
61. Как control plane message flow проходит через архитектуру LTE при attach?

   **Ответ:** При initial attach UE передаёт NAS через RRC и S1AP к MME; MME координирует authentication/security, subscriber data и session creation через S-GW/P-GW. Далее настраиваются initial context и default bearer; точная последовательность и необязательные шаги зависят от сценария.

   **Типичная ошибка:** Считать каждый attach обязанным заново выполнять все возможные authentication-шаги.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

62. Как user plane traffic проходит через архитектуру LTE после установления bearer?

   **Ответ:** Для обычного active bearer путь идёт UE↔eNodeB по radio, eNodeB↔S-GW по S1-U, затем S-GW↔P-GW по S5/S8 и в PDN через SGi. MME не находится в пользовательском forwarding path.

   **Типичная ошибка:** Рисовать пользовательский трафик через MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

63. Как eNodeB разделяет radio resource management и transport forwarding?

   **Ответ:** RRM выбирает radio resources и параметры обслуживания, forwarding сопоставляет bearer, radio и GTP-U-пути. Это разные ответственности внутри узла, согласованные общим UE/bearer-state и QoS.

   **Типичная ошибка:** Считать разделение функций обязательным разделением на независимые процессы без общего состояния.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

64. Как EPC логически и физически масштабируется?

   **Ответ:** Добавляют экземпляры функций, распределяют serving areas и сессии, используют pooling и предусмотренное разделение control/user функций. Физическая топология может отличаться от логической, но state ownership и recovery должны оставаться согласованными.

   **Типичная ошибка:** Балансировать каждый GTP/S1-message на случайный узел без контекста.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

65. Какие stateful и stateless аспекты есть у LTE core?

   **Ответ:** MME хранит mobility/security/bearer-context, gateways — session/tunnel/forwarding-state, HSS — subscriber data. Отдельные workers могут быть stateless при внешнем хранилище, но система EPS логически остаётся stateful.

   **Типичная ошибка:** Считать UDP-транспорт GTP признаком отсутствия состояния.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

66. Почему MME считается control-plane узлом без user-plane forwarding?

   **Ответ:** MME обрабатывает NAS, mobility, security и координирует bearer/session setup. Пользовательский путь проходит через S-GW/P-GW, поэтому объём user traffic не пересылается через MME.

   **Типичная ошибка:** Считать MME центральным router всех UE-пакетов.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

67. Как SGW и PGW разделяют функции data anchoring и external connectivity?

   **Ответ:** S-GW служит user-plane узлом и mobility anchor для ряда переходов доступа, P-GW связывает PDN connection с внешней сетью и policy/addressing. Их роли логически различны даже при совместном размещении.

   **Типичная ошибка:** Считать SGW и PGW полными взаимозаменяемыми копиями.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

68. Как GTP-U используется в user plane LTE?

   **Ответ:** GTP-U инкапсулирует пользовательскую PDU в tunnel, идентифицируемый TEID на принимающем endpoint. В обычной LTE IP-связности внутри находится UE IP-пакет, снаружи — транспортная адресация узлов сети.

   **Типичная ошибка:** Считать outer IP адресом UE или TEID глобально уникальным subscriber ID.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

69. Как GTP-C используется в control procedures LTE?

   **Ответ:** GTPv2-C управляет session/bearer-контекстами на соответствующих core-интерфейсах, включая create, modify и delete процедуры. Он не заменяет NAS между UE и MME или S1AP между eNodeB и MME.

   **Типичная ошибка:** Называть всю LTE-сигнализацию GTP-C.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

70. Почему tunneling — фундаментальная часть EPC?

   **Ответ:** Туннели связывают распределённые bearer-сегменты и позволяют менять serving access path, сохраняя PDN-связность. Они также дают transport forwarding по endpoint-адресам без маршрута на каждый UE во всём underlay.

   **Типичная ошибка:** Считать tunneling самостоятельным шифрованием пользовательского трафика.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

71. Какие преимущества и недостатки даёт широкое использование туннелей?

   **Ответ:** Плюсы — отделение абонентской связности от transport и удобное mobility forwarding. Минусы — overhead/MTU, tunnel-state и сложная корреляция; защита и резервирование решаются отдельными механизмами.

   **Типичная ошибка:** Считать наличие GTP достаточной защитой от подделки и прослушивания.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

72. Как S1-U и GTP-U влияют на observability пользовательского трафика?

   **Ответ:** На transport видны outer endpoints и TEID, а внутренние адреса требуют декодирования. Для связи пакета с UE/bearer нужны session-сигнализация и временной контекст, поскольку TEID локален и может переиспользоваться.

   **Типичная ошибка:** Считать один TEID вечным идентификатором пользователя во всей сети.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

73. Какие проблемы debugging возникают из-за туннелирования?

   **Ответ:** Нужно различать inner/outer loss, MTU и QoS, учитывать изменение tunnel endpoints при mobility и captures с разных сторон. Offload и неполный захват дополнительно мешают корреляции.

   **Типичная ошибка:** Диагностировать путь только по outer ping между gateways.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

74. Как correlation между subscriber/session/bearer реализуется в LTE core?

   **Ответ:** Сопоставляют subscriber/temporary identity, PDN/APN, EPS bearer ID, tunnel endpoints/TEID и идентификаторы signaling procedures. Mapping должен иметь область действия и время жизни, особенно при reuse и handover.

   **Типичная ошибка:** Использовать один IP или TEID как безусловный уникальный ключ всех событий.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

75. Как UE context распределён между eNodeB и EPC?

   **Ответ:** eNodeB хранит AS/radio и S1-related UE-state, MME — NAS/mobility/security и EPS bearer сведения, gateways — session/tunnel-state. Контексты связаны, но не идентичны и могут существовать при разных состояниях UE.

   **Типичная ошибка:** Считать RRC idle отсутствием всех subscriber/session-context в EPC.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

76. Что такое EPS session management на концептуальном уровне?

   **Ответ:** EPS Session Management в NAS управляет PDN connectivity и EPS bearer contexts, включая activation, modification и deactivation. Его отличают от EPS Mobility Management, хотя процедуры взаимодействуют.

   **Типичная ошибка:** Путать ESM с установлением TCP-сессии приложения.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

77. Как state machines в LTE похожи на state machines сетевых протоколов?

   **Ответ:** Они обрабатывают события и сообщения с проверкой текущего состояния, таймеров и контекста. Нужны обработка дублей, некорректных переходов и recovery по стандарту, как и в других stateful протоколах.

   **Типичная ошибка:** Считать допустимым любое сообщение с корректным ASN.1 или бинарным форматом.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

78. Как software fault в control plane может не затронуть established user plane сразу?

   **Ответ:** Forwarding может продолжаться по уже установленным tunnel/bearer-state без нового control decision на каждый пакет. Позднее mobility, timeout, restart или изменение bearer обнаружат проблему и нарушат обслуживание.

   **Типичная ошибка:** Считать временную передачу данных доказательством полной исправности control plane.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

79. Как перегрузка core network проявляется для приложений пользователя?

   **Ответ:** Могут расти время подключения, ошибки service request, paging и session setup, а при перегрузке user-plane — очереди, loss и RTT. Симптом зависит от перегруженной функции и состояния UE.

   **Типичная ошибка:** Считать хороший ongoing speed test проверкой успешности новых attach.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

80. Как LTE architecture влияет на failover scenarios?

   **Ответ:** Разные функции держат разные state и anchors, поэтому failover требует не только сменить IP-маршрут, но и восстановить согласованность процедур. Возможности continuity зависят от реализации и предусмотренного recovery.

   **Типичная ошибка:** Обещать прозрачный failover любого EPC-узла только из-за наличия load balancer.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

81. Что значит anchor point в mobility context?

   **Ответ:** Anchor — узел или функция, относительно которой сохраняется часть связности при изменении пути доступа. Термин требует уточнения: radio mobility anchor и PDN connection anchor имеют разные области действия.

   **Типичная ошибка:** Считать anchor неизменным при любом переходе и для всех видов mobility.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

82. Почему SGW historically играл роль mobility anchor?

   **Ответ:** S-GW сохраняет user-plane точку для ряда intra-E-UTRAN handover и взаимодействий с другими 3GPP-доступами. При выходе из его serving area возможна S-GW relocation, поэтому anchor не обязательно постоянен всю сессию.

   **Типичная ошибка:** Утверждать, что handover никогда не меняет S-GW.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

83. Как PGW связан с выходом в external packet networks?

   **Ответ:** P-GW завершает PDN connection со стороны EPC и соединяет её с внешней PDN через SGi. Он участвует в адресации, policy/charging enforcement и классификации трафика согласно архитектуре.

   **Типичная ошибка:** Считать внешней PDN обязательно публичный Интернет — это может быть частная сеть.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

84. Как charging/policy интегрируются в EPC?

   **Ответ:** PCRF и функции enforcement связывают service/policy-решения с bearer QoS, фильтрацией и charging. PCEF обычно связан с P-GW; online/offline charging используют соответствующие интерфейсы и процедуры.

   **Типичная ошибка:** Считать charging простым подсчётом внешних IP-байтов без bearer/policy-контекста.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

85. Как lawful intercept и telecom policy constraints влияют на архитектуру LTE core?

   **Ответ:** Предусмотренные функции перехвата и policy определяют точки получения данных, mediation, доступ и аудит в операторской архитектуре. Конкретные юридические обязанности зависят от юрисдикции; техническую схему отличают от правового требования.

   **Типичная ошибка:** Выдавать наличие функции в 3GPP за одинаковую юридическую обязанность всех сетей.

   **Источник:** [3GPP TS 33.107: Lawful interception architecture and functions](https://www.3gpp.org/ftp/Specs/archive/33_series/33.107/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

86. Какие интерфейсы и узлы чаще всего становятся источником operational complexity?

   **Ответ:** Сложность часто сосредоточена на границах S1/X2, GTP session management и subscriber/policy-интеграциях, где меняется состояние нескольких узлов. Реальный приоритет задают отказами и измерениями конкретного развёртывания.

   **Типичная ошибка:** Считать один интерфейс универсально самым проблемным без данных эксплуатации.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

87. Как latency budget распределяется между radio, backhaul и core?

   **Ответ:** Выделяют ожидание радио и повторы, обработку UE/eNodeB, transport, gateways и внешний путь. Суммарная задержка зависит от состояния и нагрузки; для one-way budget нужны согласованные clocks или другой обоснованный метод.

   **Типичная ошибка:** Складывать средние несинхронных интервалов и выдавать их за tail latency конкретного запроса.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

88. Как tracing subscriber session делается сквозь архитектуру LTE?

   **Ответ:** Строят timeline NAS/S1AP/GTP по абонентским, temporary, procedure и tunnel-идентификаторам с временем жизни. К нему привязывают user-plane packets, radio events и причины отказов, контролируя полноту capture.

   **Типичная ошибка:** Искать сессию только по постоянному subscriber ID в каждом user packet.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

89. Как программно моделировать LTE architecture для тестов/эмуляции?

   **Ответ:** Можно использовать protocol state machines, UE/eNodeB/core эмуляторы и контролируемые network faults с известными ожиданиями. Модель должна явно ограничивать поддерживаемые release, процедуры и fidelity радио; packet replay не заменяет stateful peers.

   **Типичная ошибка:** Считать успешный разбор pcap полноценным тестом attach/handover и recovery.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

90. Что должен понимать C/C++ разработчик сетевой платформы про разбиение LTE архитектуры на control и forwarding domains?

   **Ответ:** Нужно разделять жизненный цикл session-state и быстрый forwarding, согласовывать создание/удаление туннелей и ownership ресурсов. Особенно важны concurrency, bounded queues, таймеры и предотвращение обработки пакетов по устаревшему контексту.

   **Типичная ошибка:** Освобождать bearer-context сразу после control event без синхронизации с работающими packet workers.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).


### Инженерные вопросы
91. Почему LTE архитектура считается хорошим примером эволюции к packet-native network?

   **Ответ:** EPS строит доступ и сервисную связность вокруг пакетных bearer, IP-transport и mobility-aware forwarding. Это эволюция операторской архитектуры, сохраняющая специализированные identity, security, QoS и state management.

   **Типичная ошибка:** Понимать packet-native как отсутствие телеком-состояния и политики.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

92. Какие компромиссы между простотой, масштабируемостью и состоянием соединений заложены в LTE?

   **Ответ:** Плоский radio-path сокращает промежуточные функции, но переносит ответственность в сложный eNodeB; распределённый core масштабируется ценой координации state. Mobility continuity и QoS требуют контекстов, таймеров и recovery.

   **Типичная ошибка:** Обещать одновременно stateless core и полную bearer/mobility-семантику без внешнего состояния.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

93. Почему EPC — это не просто “ещё один IP core”?

   **Ответ:** Он управляет подписками, регистрацией, security, PDN и bearer/QoS и меняет forwarding при mobility. Обычная IP-маршрутизация — необходимая транспортная часть, но не замена этим функциям.

   **Типичная ошибка:** Предлагать заменить EPC одним router, сохранив все EPS-процедуры без дополнительной логики.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

94. Какие архитектурные темы LTE особенно полезны для interview network/software engineer?

   **Ответ:** Особенно полезны роли узлов, control/user separation, NAS/AS, bearer/PDN, GTP и mobility anchors. Для systems-интервью добавляют state lifecycle, partial failures, correlation и MTU/queue диагностику.

   **Типичная ошибка:** Ограничиться расшифровкой сокращений без walkthrough подключения и пути пакета.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

95. Что важно понимать про LTE architecture перед изучением attach, mobility и QoS?

   **Ответ:** Нужно понимать конечные точки NAS/RRC, владельцев контекста, связь PDN и bearer и отдельный user-plane путь. Это база для объяснения, какие состояния меняются при attach, handover, idle и QoS-процедурах.

   **Типичная ошибка:** Смешивать регистрацию, radio connection и пользовательское TCP-соединение в один автомат.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


---

## 2. eNodeB

### Базовый уровень
96. Что такое eNodeB?

   **Ответ:** eNodeB — LTE-узел радиодоступа, завершающий сетевую сторону AS-протоколов и управляющий радиоресурсами обслуживаемых сот. Его логическая роль не равна конкретному корпусу, сектору или одной антенне.

   **Типичная ошибка:** Отождествлять eNodeB с единственной физической антенной.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

97. Какова роль eNodeB в LTE?

   **Ответ:** Он предоставляет UE radio access, управляет RRC и radio bearers, планирует передачи и соединяет их с EPC. Он также участвует в handover, QoS и межсотовой координации.

   **Типичная ошибка:** Приписывать eNodeB обработку всех NAS-процедур как конечному узлу.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

98. Чем eNodeB отличается от базовой станции в более ранних поколениях?

   **Ответ:** По сравнению с UTRAN NodeB LTE eNodeB включает больше функций радиоуправления и не требует отдельного RNC в базовой E-UTRAN-архитектуре. При сравнении поколений важно указать конкретные технологии и логические роли.

   **Типичная ошибка:** Считать отличие только поддержкой более высокой частоты.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

99. Какие функции выполняет eNodeB на radio стороне?

   **Ответ:** Он выполняет PHY, MAC scheduling/HARQ, RLC, PDCP и RRC-функции, radio measurements, admission и управление mobility. Точный набор и распределение реализации зависят от release и платформы.

   **Типичная ошибка:** Считать scheduler отдельным core-сервисом MME.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

100. Какие функции выполняет eNodeB на transport/control стороне?

   **Ответ:** Он поддерживает S1AP/SCTP к MME, GTP-U к S-GW и соответствующие X2-функции. Также нужны transport routing/QoS, OAM и согласование radio и tunnel-state.

   **Типичная ошибка:** Путать NAS forwarding через eNodeB с завершением NAS в eNodeB.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

101. Как eNodeB связан с UE?

   **Ответ:** Через Uu радиоинтерфейс, включая физические каналы и AS-протоколы. UE выполняет измерения и протокольные процедуры, а eNodeB управляет выделением ресурса в connected mode.

   **Типичная ошибка:** Считать связь UE↔eNodeB обычным Ethernet bridge без radio-state.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

102. Как eNodeB связан с EPC?

   **Ответ:** Control path S1-MME идёт к MME, user path S1-U — к S-GW. Совместное использование transport инфраструктуры не меняет разные endpoint, протоколы и роли.

   **Типичная ошибка:** Отправлять пользовательский GTP-U-трафик на S1-MME endpoint.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

103. Почему eNodeB считается ключевым элементом E-UTRAN?

   **Ответ:** В базовой E-UTRAN eNodeB объединяет radio termination и RRM и является сетевой стороной доступа UE. Через него согласуются радио, mobility и core connectivity.

   **Типичная ошибка:** Считать E-UTRAN лишь пассивной транспортной сетью между UE и EPC.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

104. Какие протоколы/слои заканчиваются на eNodeB?

   **Ответ:** На сетевой стороне заканчиваются RRC, PDCP, RLC, MAC и PHY, а также S1AP/X2AP на соответствующих интерфейсах. NAS логически заканчивается на MME, проходя через eNodeB.

   **Типичная ошибка:** Приписывать eNodeB NAS termination только из-за присутствия NAS-PDU в его trace.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

105. Что такое cell в контексте eNodeB?

   **Ответ:** Cell — логическая радиоячейка с определёнными радиопараметрами, идентификаторами и ресурсами. Её отличают от сайта и сектора: физическая геометрия и логическое представление не обязаны совпадать один к одному.

   **Типичная ошибка:** Считать PCI глобально уникальным идентификатором любой LTE-соты.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

106. Может ли один eNodeB обслуживать несколько сот?

   **Ответ:** Да, один логический eNodeB может обслуживать несколько сот, например разные секторы и несущие. Их число и распределение зависят от архитектуры и реализации.

   **Типичная ошибка:** Приравнивать число eNodeB числу сот или радионесущих.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

107. Что такое sectorization на базовом уровне?

   **Ответ:** Sectorization разделяет обслуживание площадки по направлениям с помощью антенн и конфигурации сот. Это повышает пространственное повторное использование, но требует управления перекрытием и помехами.

   **Типичная ошибка:** Считать границы секторов жёсткими физическими границами радиосигнала.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [ITU-R P.525: Calculation of free-space attenuation](https://www.itu.int/rec/R-REC-P.525/en).

108. Почему eNodeB управляет radio resources?

   **Ответ:** Он знает локальный канал, UE-state и очереди и отвечает за допустимое использование общей радиосреды. Поэтому выбирает распределение ресурсов и режимы в пределах настроек и QoS.

   **Типичная ошибка:** Считать радиоресурс неограниченным при наличии свободного backhaul.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

109. Почему scheduling находится близко к radio edge?

   **Ответ:** Решения должны учитывать актуальные CSI, HARQ и очереди в срок радиопередачи. Близость логики к radio processing уменьшает задержку обмена, хотя физическое размещение зависит от RAN-платформы.

   **Типичная ошибка:** Считать «близко» обязательным размещением всего software на мачте.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

110. Как eNodeB участвует в mobility?

   **Ответ:** Он настраивает measurement reporting, оценивает условия и load и инициирует connected-mode handover. В idle UE само выполняет reselection по широковещательной и сохранённой конфигурации.

   **Типичная ошибка:** Приписывать eNodeB прямое пошаговое управление каждым idle reselection.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

111. Как eNodeB участвует в handover?

   **Ответ:** Source готовит target, отправляет UE radio reconfiguration и при нужном сценарии передаёт данные/контекст. Target принимает UE и участвует в переключении core user-plane path; детали различаются для X2 и S1 handover.

   **Типичная ошибка:** Считать handover одним изменением частоты без изменения контекстов и пути.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

112. Что такое admission control на уровне eNodeB?

   **Ответ:** Admission control решает, можно ли принять UE/bearer с требуемыми параметрами при текущих ограничениях. Учитывают radio, processing, transport и политику, а отказ должен отражаться корректной причиной.

   **Типичная ошибка:** Принимать все GBR-запросы, надеясь позже поделить недостаточный ресурс.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

113. Что такое radio bearer и как eNodeB с ним связан?

   **Ответ:** Radio bearer задаёт обслуживание между UE и eNodeB на AS-уровне. eNodeB настраивает SRB/DRB и их протоколы; DRB является частью пользовательского EPS bearer path, но не всем EPS bearer.

   **Типичная ошибка:** Путать signaling radio bearer с dedicated EPS bearer только из-за похожих названий.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

114. Почему eNodeB важен для QoS enforcement?

   **Ответ:** Он переводит QoS-требования в admission, очереди и scheduler choices на дефицитном radio resource. Core policy без подходящего обслуживания в eNodeB не обеспечит нужную радиодоставку.

   **Типичная ошибка:** Считать назначение QCI достаточной реализацией QoS без ресурса и алгоритма планирования.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

115. Какие основные KPI обычно связывают с eNodeB?

   **Ответ:** Обычно измеряют доступность, RRC и bearer setup success, handover, radio drops, resource utilization, throughput и задержки. Важны определения, причины отказов, интервалы и разрезы по соте/QoS.

   **Типичная ошибка:** Считать одно среднее throughput полным KPI здоровья eNodeB.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).


### Средний уровень
116. Какие функции RRC выполняются в eNodeB?

   **Ответ:** RRC управляет соединением, radio bearer configuration, измерениями, mobility и AS security control. eNodeB формирует соответствующие сообщения и хранит связанный AS-context.

   **Типичная ошибка:** Приравнивать RRC security к NAS security, у которых другие endpoint и ключевой контекст.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

117. Какие функции MAC/RLC/PDCP завершаются в eNodeB?

   **Ответ:** MAC планирует и мультиплексирует передачи, RLC сегментирует/собирает и в AM восстанавливает данные, PDCP обрабатывает соответствующие sequence/security/header-функции. Конкретное поведение зависит от bearer mode и процедур.

   **Типичная ошибка:** Считать MAC HARQ и RLC AM одним общим retry-механизмом.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/); [3GPP TS 36.323: PDCP protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.323/).

118. Как eNodeB управляет uplink и downlink ресурсами?

   **Ответ:** В DL выбирает UE, ресурсы, MCS и передачи по своим очередям; в UL выдаёт grants на основе report/request и состояния UE. UE выполняет назначение и предусмотренные MAC-процедуры, а сеть соблюдает HARQ/timing ограничения.

   **Типичная ошибка:** Считать uplink передачей UE в произвольный момент без grant или предусмотренного исключения.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

119. Почему eNodeB должен быстро реагировать на channel quality?

   **Ответ:** Старая оценка канала может приводить к неверному MCS или слоям, увеличивая ошибки и теряя ресурс. Реакция должна укладываться в radio deadlines и учитывать шум и задержку feedback.

   **Типичная ошибка:** Реагировать на каждое колебание CQI без фильтрации и результатов HARQ.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

120. Как eNodeB принимает решения о scheduler allocation?

   **Ответ:** Scheduler учитывает очереди, QoS, CQI, HARQ, доступный ресурс, capabilities UE и ограничения физического канала. Стандарт задаёт интерфейсы и допустимое поведение, но не единственную универсальную vendor policy fairness.

   **Типичная ошибка:** Считать конкретный proportional-fair алгоритм обязательным для любого LTE eNodeB.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

121. Что такое HARQ и как eNodeB участвует в HARQ?

   **Ответ:** HARQ сочетает кодирование, feedback и повторы с combining. В eNodeB есть передающая DL- и принимающая UL-роль с процессами и временными зависимостями; UE выполняет парные функции.

   **Типичная ошибка:** Путать число HARQ-процессов с числом приложений UE.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

122. Почему eNodeB критичен для latency-sensitive traffic?

   **Ответ:** Ожидание scheduler, retries и обработка на radio edge составляют существенную часть latency budget. Нарушение processing deadline может задержать даже приоритетный пакет, поэтому важны не только средние CPU-метрики.

   **Типичная ошибка:** Считать высокий приоритет гарантией немедленной передачи независимо от radio timing.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

123. Как eNodeB обрабатывает radio measurements от UE?

   **Ответ:** UE получает measurement configuration и отправляет отчёты по заданным условиям; eNodeB использует их для mobility и RRM. Отчёт отражает конкретное измерение с фильтрацией и задержкой, а не всеведение сети.

   **Типичная ошибка:** Считать отсутствие отчёта измеренным хорошим каналом.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

124. Как eNodeB выбирает MCS?

   **Ответ:** На основе CSI/CQI, результатов HARQ, настроек и возможностей UE подбирает параметры передачи под цель качества и эффективности. Номер MCS имеет смысл только вместе с таблицей и соответствующими ресурсами.

   **Типичная ошибка:** Переводить MCS в фиксированную пользовательскую скорость без resource allocation.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

125. Как eNodeB принимает решение о handover?

   **Ответ:** Использует measurement reports, события и фильтры, offsets/hysteresis, load и policy с учётом доступных target и admission. Процедура должна избегать поздних переходов и ping-pong.

   **Типичная ошибка:** Переключать UE на соту с максимальным мгновенным RSSI без hysteresis и контекста.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

126. Как eNodeB взаимодействует с соседними eNodeB?

   **Ответ:** Через X2 обменивается handover и coordination-сигнализацией, а также предусмотренными данными. При отсутствии подходящего X2 часть взаимодействий реализуется через core-процедуры.

   **Типичная ошибка:** Считать соседство на карте автоматически установленным X2-соединением.

   **Источник:** [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

127. Почему X2 interface важен именно для eNodeB-to-eNodeB coordination?

   **Ответ:** Он даёт прямую стандартизованную границу для обмена контекстом, нагрузкой и ресурсной координации между eNodeB. Это уменьшает зависимость конкретного взаимодействия от relay через MME, но не заменяет core.

   **Типичная ошибка:** Считать X2 подходящим каналом для любых произвольных vendor-data без согласования протокола.

   **Источник:** [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

128. Как eNodeB контролирует load balancing между сотами?

   **Ответ:** Использует измерения нагрузки, настройки mobility/admission и информацию соседей, чтобы направлять UE на подходящие соты. Перераспределение должно сохранять покрытие и QoS и не создавать ping-pong.

   **Типичная ошибка:** Перемещать UE только по свободному PRB, игнорируя ухудшение radio channel target.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

129. Как eNodeB связан с interference management?

   **Ответ:** Меняет мощности, resources и spatial choices, использует соседнюю coordination-информацию и radio measurements. Локальная оптимизация должна учитывать воздействие на другие соты и UL/DL.

   **Типичная ошибка:** Настраивать каждую соту на максимальную мощность независимо от окружения.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

130. Как eNodeB участвует в power control?

   **Ответ:** Выдаёт power-control параметры и команды по предусмотренным алгоритмам, учитывая качество и interference constraints. Для UL это помогает UE компенсировать часть path loss без чрезмерной помехи другим.

   **Типичная ошибка:** Считать power control попыткой всегда получить одинаковый RSSI всех UE на любой цене мощности.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

131. Как eNodeB обеспечивает QoS differentiation?

   **Ответ:** QoS отражается в bearer configuration, admission, очередях, приоритетах и выделении ресурса. QCI/GBR-параметры ограничивают и направляют политику, но не заменяют достаточную ёмкость.

   **Типичная ошибка:** Считать QoS только DSCP-маркировкой в IP-backhaul.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

132. Что происходит в eNodeB при attach пользователя?

   **Ответ:** Устанавливает RRC, переносит NAS к MME и выполняет AS-security/context и radio bearer setup по процедуре. EPS authentication/session decisions координируются core, поэтому eNodeB не делает attach автономно.

   **Типичная ошибка:** Проверять успешность attach только по RRCConnectionSetupComplete.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

133. Что происходит в eNodeB при release соединения?

   **Ответ:** При S1/RRC connection release освобождаются соответствующие radio и S1-ресурсы, но EPS registration/PDN могут сохраняться. Полный detach или session deletion — отдельные процедуры с другим объёмом cleanup.

   **Типичная ошибка:** Удалять все PDN-бearer контексты core при любом уходе UE в idle.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

134. Почему перегрузка eNodeB может проявляться и как радиопроблема, и как transport problem?

   **Ответ:** Недостаток CPU, radio resource или processing deadline приводит к очередям, пропускам передачи и ошибкам процедур. Для транспорта это выглядит как рост RTT, loss или низкий goodput, даже если RF-уровень достаточен.

   **Типичная ошибка:** Считать overload eNodeB обязательно слабым сигналом.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

135. Какие counters eNodeB полезны для troubleshooting?

   **Ответ:** Полезны attempts/success/failure causes для RRC/bearer/handover, PRB utilization, CQI/MCS/BLER/HARQ и bytes/drops/queues. Их дополняют CPU, deadlines, transport errors и корректной временной привязкой.

   **Типичная ошибка:** Собирать только абсолютные failures без числа попыток и продолжительности окна.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

136. Как eNodeB влияет на user throughput?

   **Ответ:** Он определяет выделенные ресурсы, MCS, слои, повторы и очереди, поэтому существенно влияет на полезную скорость. При этом bottleneck может быть вне eNodeB, и его нужно локализовать end-to-end.

   **Типичная ошибка:** Объяснять любую низкую скорость только scheduler policy.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

137. Как eNodeB влияет на latency и jitter?

   **Ответ:** Scheduling wait, radio retries, буферизация и processing вносят задержку и её вариацию. Анализируют распределения и radio state, поскольку среднее скрывает редкие пропуски deadline.

   **Типичная ошибка:** Настраивать latency только уменьшением среднего размера очереди без измерения хвостов.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

138. Как backhaul ограничения eNodeB masquerade as radio issues?

   **Ответ:** Ограниченный uplink/downlink backhaul даёт queues, drops и low goodput при достаточном SINR. Сравнивают счётчики radio и S1-U, transport utilization и очереди, учитывая разные уровни учёта.

   **Типичная ошибка:** Считать хороший PHY rate доказательством хорошего backhaul.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

139. Что такое self-organizing network features на уровне eNodeB?

   **Ответ:** SON-функции автоматизируют конфигурацию, оптимизацию и обнаружение проблем, например соседние отношения и часть mobility/load tuning. Конкретный набор зависит от release, реализации и политики оператора.

   **Типичная ошибка:** Считать SON полностью автономной системой, которой не нужны ограничения и наблюдение.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

140. Какие operational проблемы чаще всего ассоциированы с eNodeB?

   **Ответ:** Встречаются проблемы radio coverage/interference, transport/SCTP/GTP, синхронизации, конфигурации и software/resources. Приоритет гипотез задают counters, причины процедур и воспроизводимые traces.

   **Типичная ошибка:** Называть любую недоступность соты аппаратной поломкой RF-модуля.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

141. Почему software quality eNodeB stack критична для стабильности всей сети?

   **Ответ:** Stack согласует множество UE, timers, radio deadlines и distributed procedures, поэтому ошибка состояния может затронуть доступ, mobility и forwarding. Изоляция отказов и корректный lifecycle ресурсов важны не меньше PHY-производительности.

   **Типичная ошибка:** Оценивать стабильность только длительным тестом одного неподвижного UE.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

142. Какие части eNodeB обычно real-time sensitive?

   **Ответ:** PHY processing, scheduling, HARQ и radio control имеют временные ограничения привязки к радиосетке. OAM и долгие аналитические задачи обычно менее срочны, поэтому их влияние на критический путь ограничивают.

   **Типичная ошибка:** Считать все потоки узла одинаково real-time или назначать всем максимальный priority.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

143. Почему scheduler и HARQ logic нельзя делать с большой задержкой?

   **Ответ:** Их решения относятся к определённым radio occasions и feedback, поэтому опоздание может сделать результат неприменимым. Низкая средняя задержка недостаточна без ограничения worst-case и jitter критического пути.

   **Типичная ошибка:** Оптимизировать средний throughput, допуская непредсказуемые длинные scheduler pauses.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

144. Какие интерфейсы eNodeB наиболее важны для packet captures и tracing?

   **Ответ:** S1-MME/S1AP, S1-U/GTP-U и X2 позволяют видеть core и межстанционные процедуры, а внутренние RRC/MAC/PHY traces — радио. Обычный capture на IP-интерфейсе не заменяет декодированный radio trace.

   **Типичная ошибка:** Ожидать увидеть все HARQ-повторы в обычном S1-U pcap.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

145. Что должен понимать C/C++ engineer, если он пишет ПО для eNodeB или похожих real-time network nodes?

   **Ответ:** Нужны безопасный lifecycle UE-context, bounded queues, корректная синхронизация, таймеры и измерение processing deadlines. Реализация должна соблюдать стандартизованные состояния и обеспечивать диагностируемость без блокировки hot path.

   **Типичная ошибка:** Использовать неограниченный allocation, blocking I/O и синхронный verbose logging в критическом radio loop.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).


### Продвинутый уровень
146. Как eNodeB делит функции между control-plane processing и data-plane forwarding?

   **Ответ:** Control обрабатывает RRC/S1AP, конфигурацию и mobility, а data path выполняет per-packet radio/GTP processing. Разделение workers или процессов определяется платформой; версии и lifetime контекстов должны согласовываться.

   **Типичная ошибка:** Считать control/data split достаточным без безопасной передачи обновлённой конфигурации.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

147. Как uplink packet проходит через radio stack eNodeB к GTP tunnel?

   **Ответ:** PHY восстанавливает transport block, MAC демультиплексирует данные, RLC собирает SDU, PDCP выполняет соответствующую обработку. Затем bearer mapping направляет пользовательскую PDU в S1-U GTP-U tunnel к S-GW.

   **Типичная ошибка:** Передавать сырые MAC PDUs в GTP-U как обычные UE IP-пакеты.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/); [3GPP TS 36.323: PDCP protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.323/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

148. Как downlink packet проходит из S1-U/GTP к radio transmission?

   **Ответ:** GTP-U decapsulation и TEID mapping находят bearer, затем данные проходят PDCP, RLC и MAC scheduling к PHY. Packet arrival на S1-U ещё не означает немедленную radio transmission.

   **Типичная ошибка:** Считать GTP-U receive timestamp временем доставки UE.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 36.323: PDCP protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.323/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

149. Как eNodeB хранит UE context?

   **Ответ:** Логически контекст связывает radio IDs, RRC/security, bearer configuration, protocol sequence-state, timers и S1/X2 mappings. Конкретные структуры памяти не стандартизованы, но должны поддерживать корректные переходы и область идентификаторов.

   **Типичная ошибка:** Использовать C-RNTI как глобальный бессрочный subscriber key.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

150. Какие state machines на UE-context уровне реализуются в eNodeB?

   **Ответ:** Есть RRC connection и bearer/configuration процедуры, security и mobility; MAC/RLC/PDCP также имеют свои автоматы и переменные. Их согласуют событиями и ownership, не сводя всё к одному boolean connected.

   **Типичная ошибка:** Считать переход одного автомата автоматически завершённым успехом всех нижних и верхних процедур.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/).

151. Как eNodeB управляет RRC states и radio bearers?

   **Ответ:** RRC задаёт setup, reconfiguration и release и согласует конфигурацию SRB/DRB с UE и нижними слоями. Состояние должно меняться с учётом подтверждений, неудач и таймеров процедуры.

   **Типичная ошибка:** Считать отправку RRC reconfiguration доказательством её успешного применения UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

152. Как eNodeB реализует admission control при ограниченных ресурсах?

   **Ответ:** Оценивает доступность radio, вычислительного и transport-ресурса и возможность выполнить QoS. При нехватке применяет предусмотренный отказ или policy/pre-emption, корректно отражая причину и cleanup.

   **Типичная ошибка:** Принимать новый bearer по свободной памяти, игнорируя требуемую radio capacity.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

153. Как eNodeB взаимодействует с MME при attach и handover?

   **Ответ:** При attach переносит NAS и выполняет S1 initial context/bearer setup; при handover обменивается нужной S1AP-сигнализацией и path/context updates. В X2-based сценарии подготовка между eNodeB не отменяет участия MME в core path switch.

   **Типичная ошибка:** Считать MME полностью не участвующим ни в одной стадии X2 handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

154. Как eNodeB выбирает target cell при handover?

   **Ответ:** Сопоставляет measurement reports с neighbor configuration, доступностью, частотой, load и policy. Target должен поддержать нужный контекст и admission; самый сильный сигнал не всегда лучший выбор.

   **Типичная ошибка:** Выбирать неизвестный PCI без проверки соответствия реальной соседней соте.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

155. Как реализуется scheduler fairness vs throughput optimization в eNodeB?

   **Ответ:** Используются policy, приоритеты, история обслуживания, QoS и текущая эффективность канала. Например, proportional-fair учитывает относительную выгоду к прошлой скорости; это пример реализации, а не единственный стандартный алгоритм.

   **Типичная ошибка:** Считать одинаковую долю PRB гарантией одинаковой полезной скорости UE.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

156. Как eNodeB балансирует QoS, channel quality и cell capacity?

   **Ответ:** Сначала соблюдаются протокольные ограничения и согласованные требования, затем распределяется оставшийся ресурс по политике. Для перегрузки нужны admission, приоритизация и наблюдаемая деградация, а не обещание удовлетворить любой спрос.

   **Типичная ошибка:** Игнорировать ограничения capacity при одновременных строгих QoS-запросах.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

157. Как real-time constraints влияют на архитектуру software внутри eNodeB?

   **Ответ:** Критический путь делают предсказуемым по времени: ограничивают очереди и блокировки, разделяют slow path и горячую обработку, контролируют memory/CPU locality. Нужны измеренные deadlines, а не предположение, что быстрый средний benchmark достаточен.

   **Типичная ошибка:** Считать throughput benchmark доказательством соблюдения radio timing.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

158. Какие многопоточные/lock-free/RT подходы важны для eNodeB software?

   **Ответ:** Полезны явное ownership, partitioning по UE/cell, bounded handoff и подходящая RT-планировка. Lock-free применяют при обоснованной модели памяти и reclamation; отсутствие mutex не гарантирует bounded latency.

   **Типичная ошибка:** Называть алгоритм real-time только потому, что он lock-free.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

159. Как NUMA, CPU affinity и packet processing влияют на performance eNodeB platform?

   **Ответ:** Дальняя NUMA-память, миграции потоков, IRQ и конкуренция cache увеличивают latency и уменьшают packet rate. Affinity и locality настраивают по измерениям, сохраняя запас и избегая перегруженного isolated core.

   **Типичная ошибка:** Прикреплять все threads и IRQ к одному ядру ради формальной affinity.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

160. Как tracing в eNodeB усложняется из-за high event rate?

   **Ответ:** Синхронная запись всех событий может перегрузить CPU/I/O и изменить исследуемое поведение. Используют bounded buffers, sampling/triggered traces, loss counters и точные timestamps с нужной корреляцией.

   **Типичная ошибка:** Считать trace полным, не учитывая dropped events самой системы сбора.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

161. Какие race conditions опасны в UE context handling?

   **Ответ:** Опасны concurrent release и packet access, timer после удаления, повторное использование ID и несогласованный handover-state. Нужны корректная отмена/версии событий и lifetime management, чтобы старое событие не изменяло новый UE-context.

   **Типичная ошибка:** Полагаться только на проверку ненулевого указателя после освобождения контекста.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

162. Как eNodeB software справляется с bursty control-plane events?

   **Ответ:** Ограничивает admission и очереди, приоритизирует обязательные задачи и применяет предусмотренные overload-механизмы. Повторы и recovery должны быть контролируемыми, иначе signaling burst превращается в самоподдерживающуюся перегрузку.

   **Типичная ошибка:** Добавлять бесконечную очередь control events ради отсутствия немедленных drops.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

163. Как packet reordering может возникать на стыке radio retransmission и upper layers?

   **Ответ:** Разные HARQ-процессы завершаются в разное время, а handover/forwarding может создавать несколько путей. RLC/PDCP выполняют предусмотренное sequencing/reordering, поэтому наблюдаемое IP-поведение зависит от mode и процедуры.

   **Типичная ошибка:** Считать порядок готовности PHY transport blocks порядком выдачи всех данных приложению.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/); [3GPP TS 36.323: PDCP protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.323/).

164. Как eNodeB expose metrics для OAM систем?

   **Ответ:** Публикует стандартизованные и vendor-specific counters, gauges и events с cell/UE/QoS-разрезами в предусмотренных границах доступа. Нужны определения, reset semantics, интервалы и ограниченный overhead сбора.

   **Типичная ошибка:** Сравнивать counters после reset без учёта времени жизни процесса.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

165. Как диагностика “проблема в eNodeB или в EPC” обычно строится?

   **Ответ:** Проверяют, где прекращается успешная процедура или доставка: Uu/AS, S1 control, S1-U и далее core. Correlation по UE/bearer и синхронные captures помогают отличить transport-разрыв от ошибки протокольного состояния.

   **Типичная ошибка:** Считать fault domain совпадающим с узлом, который первым записал error.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

166. Какие failure modes eNodeB приводят к attach failure?

   **Ответ:** Причинами могут быть radio access/RRC failure, исчерпание ресурсов, S1/SCTP-недоступность и ошибки context/security setup. При этом eNodeB может лишь переносить core reject, поэтому проверяют cause и endpoint решения.

   **Типичная ошибка:** Приписывать NAS authentication reject неисправности radio scheduler.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

167. Какие failure modes eNodeB приводят к throughput collapse?

   **Ответ:** Возможны scheduler starvation, deadlock, processing deadline misses, buffer drops, RF-проблемы и S1-U mapping/transport errors. Различают отсутствие ресурса, неудачную передачу и недоставку пакетов к радио.

   **Типичная ошибка:** Считать throughput collapse обязательно падением RSRP.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

168. Какие failure modes eNodeB приводят к abnormal handover behavior?

   **Ответ:** Неверные neighbor/measurement настройки, stale contexts, X2/S1 failures, admission и таймеры могут вызывать late handover, failure или ping-pong. Радиоусловия и target readiness проверяют вместе с software-state.

   **Типичная ошибка:** Лечить все abnormal handover одним изменением hysteresis.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

169. Как моделировать нагрузки на eNodeB в lab/testing environment?

   **Ответ:** Генерируют UE/control и user-plane нагрузку с профилями mobility, QoS, channel и faults, задав ожидаемые результаты. Проверяют не только steady-state throughput, но setup/release churn, deadlines и recovery после частичных отказов.

   **Типичная ошибка:** Считать много пакетов одного UE полной моделью многопользовательской eNodeB-нагрузки.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

170. Какие темы eNodeB наиболее важны для senior interview по telecom software?

   **Ответ:** Важны radio timing и scheduler, AS/bearer-state, HARQ/RLC/PDCP, mobility и S1/X2, а также concurrency, resource bounds и observability. Хороший разбор связывает protocol cause с измеряемым поведением и recovery.

   **Типичная ошибка:** Ограничиваться названиями интерфейсов без анализа lifecycle и failure modes.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


### Инженерные вопросы
171. Почему eNodeB — это не просто “антенна с IP uplink”?

   **Ответ:** Узел содержит сложный radio stack, RRM, security, mobility и stateful integration с EPC. Антенна и IP uplink — только части системы с существенно меньшим описанием её поведения.

   **Типичная ошибка:** Считать eNodeB обычным Wi-Fi-подобным bridge без cellular control procedures.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

172. Почему eNodeB — один из самых сложных узлов LTE с точки зрения software engineering?

   **Ответ:** Он совмещает жёсткие radio deadlines с большим числом асинхронных UE, control transitions и packet forwarding. Ошибка времени, памяти или контекста может влиять на несколько уровней и множество пользователей.

   **Типичная ошибка:** Оценивать сложность только количеством обрабатываемых Gbit/s.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

173. Какие компромиссы между low latency, fairness и capacity решает eNodeB?

   **Ответ:** Приоритет срочного трафика и слабых UE может уменьшать суммарный throughput, а длинное ожидание хорошего канала — нарушать deadline. Scheduler балансирует utility, QoS и ресурс в рамках admission и протокольных ограничений.

   **Типичная ошибка:** Максимизировать суммарную скорость, не контролируя starvation и tail latency.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

174. Какие знания про eNodeB полезны C/C++ сетевому разработчику, даже если он не пишет PHY?

   **Ответ:** Полезны роли AS/control/user paths, bearer и tunnel mapping, queues/retries, deadlines и meaning радио-KPI. Для transport software важно понимать, где packet arrival ещё не равен доставке и какое состояние может исчезнуть.

   **Типичная ошибка:** Обрабатывать GTP bearer как бессрочный stateless UDP flow.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

175. Что особенно важно понимать про eNodeB перед изучением scheduler, RRC и handover?

   **Ответ:** Нужно знать владельцев radio и core-context, интерфейсы, временную сетку и различия RRC/MAC/HARQ/RLC. После этого можно проследить изменение конфигурации и пути данных без смешения уровней.

   **Типичная ошибка:** Изучать handover как простую смену IP-адреса UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).


---

## 3. EPC: общая роль core network

### Базовый уровень
176. Что такое EPC?

   **Ответ:** EPC — пакетное ядро EPS, обеспечивающее control функции доступа, сессий и mobility и user-plane связность с PDN. Оно взаимодействует с E-UTRAN, но не выполняет её radio scheduling.

   **Типичная ошибка:** Считать EPC частью физического радиоинтерфейса.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

177. Как расшифровывается EPC?

   **Ответ:** Evolved Packet Core, то есть эволюционировавшее пакетное ядро. Важно отличать его от EPS: EPS включает также E-UTRAN и абонентскую сторону системы.

   **Типичная ошибка:** Использовать EPC и EPS как точные синонимы.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

178. Какие главные узлы входят в EPC?

   **Ответ:** В базовой модели ключевые функции — MME, Serving GW, PDN GW и HSS; policy/charging дополняют их соответствующими узлами. Физическая реализация и extensions могут менять размещение, сохраняя логические роли.

   **Типичная ошибка:** Считать HSS forwarding-узлом на пути пользовательского трафика.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

179. Зачем LTE нужна отдельная packet core сеть?

   **Ответ:** Нужны абонентская аутентификация, регистрация, mobility, PDN-сессии и QoS поверх меняющегося radio access. Один radio link не даёт всей операторской связности и услуг.

   **Типичная ошибка:** Считать EPC необязательным при хорошем SINR и исправном eNodeB.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

180. Как EPC связан с интернетом и внешними сетями?

   **Ответ:** P-GW связывает PDN connection с внешней пакетной сетью через SGi. Это может быть Интернет, корпоративная сеть или другая PDN с собственной маршрутизацией и политикой.

   **Типичная ошибка:** Считать все APN выходами в один и тот же публичный Интернет.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

181. Чем EPC отличается от радиодоступа?

   **Ответ:** EPC управляет EPS registration/session и core user path, а E-UTRAN — радио и AS. У них разные протоколы и контексты, связанные через S1.

   **Типичная ошибка:** Ожидать, что смена MCS управляется MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

182. Какие функции EPC относятся к control plane?

   **Ответ:** К control относятся NAS/mobility/security coordination, subscriber/session management и настройка bearer/tunnel-state. Их выполняют MME и соответствующие control функции gateways и policy/subscriber узлов.

   **Типичная ошибка:** Считать все процессы gateway исключительно user plane.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

183. Какие функции EPC относятся к user plane?

   **Ответ:** Это forwarding пользовательских PDU, tunnel encapsulation/decapsulation и связанные policy/charging enforcement операции на пути данных. Основные gateway-роли — S-GW и P-GW.

   **Типичная ошибка:** Включать MME в обязательную цепочку forwarding каждой PDU.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

184. Почему EPC является packet core, а не circuit core?

   **Ответ:** Ресурс и связность организованы для пакетных данных с bearer/QoS, без отдельного circuit-switched домена EPS. Legacy voice interworking и IMS-сервисы не превращают EPC в circuit core.

   **Типичная ошибка:** Считать длительный bearer постоянным физическим circuit.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

185. Что такое EPS в связи с EPC?

   **Ответ:** Evolved Packet System объединяет E-UTRAN и EPC с UE в общую пакетную систему доступа и услуг. EPC — её core часть, а не вся EPS.

   **Типичная ошибка:** Называть eNodeB узлом EPC.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

186. Что такое subscriber/session management на уровне EPC?

   **Ответ:** Subscriber management связывает подписку, доступ и security, session management — PDN/bearer-state и его lifecycle. Для одного subscriber могут существовать несколько связностей и контекстов с разной областью действия.

   **Типичная ошибка:** Делать один boolean active заменой всем состояниям регистрации, доступа и сессии.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

187. Как EPC участвует в mobility?

   **Ответ:** Поддерживает регистрацию по tracking areas и обновляет serving/tunnel context при перемещении. Конкретные anchors и пути могут сохраняться либо меняться в зависимости от mobility-процедуры.

   **Типичная ошибка:** Считать mobility обязанной менять UE IP на каждом handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

188. Как EPC участвует в аутентификации?

   **Ответ:** MME координирует EPS authentication с UE и HSS/AuC и устанавливает NAS-security context по процедуре. eNodeB затем использует соответствующий AS-security context; секрет подписки не должен становиться обычным forwarding-параметром.

   **Типичная ошибка:** Считать GTP TEID доказательством аутентификации абонента.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

189. Как EPC участвует в policy enforcement?

   **Ответ:** Policy задаёт разрешённые услуги, классификацию и QoS, а enforcement применяет решения в соответствующих узлах и bearer. Реализация согласует core и radio, иначе маркировка сама не создаст ресурс.

   **Типичная ошибка:** Путать policy decision с фактическим наличием radio capacity.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

190. Как EPC участвует в charging?

   **Ответ:** Сеть формирует usage и charging events с контекстом абонента, услуги и сессии для online/offline charging. Точки и единицы учёта должны быть согласованы с policy и charging rules.

   **Типичная ошибка:** Подсчитывать только outer GTP bytes и считать результат автоматически правильным биллингом услуги.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

191. Почему EPC нужен даже если radio link отличный?

   **Ответ:** Radio link обеспечивает лишь доступ к eNodeB; без core procedures нет обычной EPS registration, PDN/bearer connectivity и корректного user path. Отличный RF не исправит subscriber reject или отсутствующий tunnel.

   **Типичная ошибка:** Считать наличие LTE-индикатора доказательством готового доступа к PDN.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

192. Как EPC влияет на end-to-end latency?

   **Ответ:** Gateways, transport path, anchoring и queues добавляют задержку к радио. В idle или при процедурах setup/recovery добавляется control waiting; steady-state forwarding и установление связности измеряют отдельно.

   **Типичная ошибка:** Приписывать весь RTT радиоинтерфейсу.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

193. Как EPC влияет на user connectivity?

   **Ответ:** Он создаёт адресный и bearer/tunnel context, соединяет UE с нужной PDN и поддерживает состояние при mobility. Ошибка policy, адресации или forwarding может нарушить связь при живой RRC connection.

   **Типичная ошибка:** Считать успешный attach полной проверкой DNS, маршрутов и сервиса.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

194. Какие KPI связаны с EPC?

   **Ответ:** Собирают успех/latency attach, TAU, paging, session/bearer операций и причины отказов, а также активные контексты, throughput, drops и ресурсы узлов. Для каждой метрики нужны корректный denominator и временная область.

   **Типичная ошибка:** Сравнивать голое число отказов сетей с разным объёмом попыток.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

195. Какие основные проблемы могут происходить в EPC?

   **Ответ:** Возможны signaling overload, недоступность зависимостей, несогласованный state, GTP/transport ошибки, проблемы policy/addressing и forwarding. Различают node failure и reject, корректно сформированный по данным подписки.

   **Типичная ошибка:** Называть любой attach reject программным сбоем EPC.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).


### Средний уровень
196. Почему EPC логически разделён на специализированные узлы?

   **Ответ:** Функции identity, mobility, policy и forwarding имеют разные state, нагрузку и требования. Логическое разделение даёт стандартизованные интерфейсы и независимое размещение при необходимости координации.

   **Типичная ошибка:** Требовать отдельный физический appliance на каждое логическое имя.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

197. Какие преимущества у разделения MME / SGW / PGW?

   **Ответ:** Можно независимо планировать signaling и packet capacity, локализовать функции и сохранять mobility anchors. Цена — интерфейсы, частичные отказы и согласование контекстов.

   **Типичная ошибка:** Считать separation автоматической гарантией availability без recovery дизайна.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

198. Как EPC поддерживает множество одновременных пользователей?

   **Ответ:** Сессии распределяются между экземплярами функций и serving areas, а ресурс масштабируется под signaling, tunnels и throughput. Важны не только активные UE, но их churn, timers, трафик и mobility.

   **Типичная ошибка:** Оценивать scale одним числом зарегистрированных UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

199. Как EPC хранит состояние активных сессий?

   **Ответ:** Каждая функция хранит свою часть контекста: subscriber/identity, security, PDN/bearer и tunnel mappings. Способ хранения и репликации зависит от реализации, но protocol lifecycle и cleanup должны оставаться согласованными.

   **Типичная ошибка:** Считать наличие общей базы достаточным решением всех race conditions.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

200. Что такое bearer context внутри EPC?

   **Ответ:** Это сведения о bearer identity, QoS, связанных tunnel endpoints и PDN/session context в соответствующем узле. Поля и область меняются по роли узла, поэтому контексты MME и gateways не идентичны.

   **Типичная ошибка:** Считать bearer ID глобально уникальным по всей EPC.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

201. Как EPC взаимодействует с PCRF на концептуальном уровне?

   **Ответ:** PCRF принимает policy/charging decisions и взаимодействует с enforcement-функциями, прежде всего PCEF, связанным с P-GW. Результат может требовать создания или изменения bearer и правил обработки пакетов.

   **Типичная ошибка:** Рисовать PCRF обязательным forwarding hop пользовательских пакетов.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

202. Как EPC поддерживает разные QoS profiles?

   **Ответ:** QoS задаётся параметрами bearer и policy, включая QCI и применимые rate/priority характеристики. Они реализуются совместно admission, enforcement, transport и radio scheduler.

   **Типичная ошибка:** Считать QCI произвольным пользовательским DSCP, автоматически дающим end-to-end SLA.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

203. Как EPC поддерживает roaming?

   **Ответ:** Visited и home функции обмениваются subscriber/security/session информацией, а user path выбирается по допустимой архитектуре roaming. Для home-routed сценария S8 связывает serving и home gateway-роли.

   **Типичная ошибка:** Считать roaming просто изменением тарифного поля без архитектурных последствий.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

204. Как EPC взаимодействует с HSS на концептуальном уровне?

   **Ответ:** HSS предоставляет subscriber data и authentication-related информацию и участвует в регистрации serving MME. Взаимодействие MME↔HSS по S6a связано с состоянием подписки, а не с пересылкой user traffic.

   **Типичная ошибка:** Считать HSS синонимом DNS или обычного адресного сервера UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

205. Почему signaling storm опасен для EPC?

   **Ответ:** Большой поток attach/TAU/service events расходует CPU, timers, state и downstream requests. Неограниченные retries могут усиливать перегрузку даже при малом объёме пользовательских данных.

   **Типичная ошибка:** Использовать user-plane Gbit/s как единственный overload indicator.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

206. Почему control-plane overload и user-plane overload проявляются по-разному?

   **Ответ:** Control overload нарушает setup/mobility и увеличивает procedural latency, user-plane overload ухудшает packet delivery и очереди. Уже работающие сессии и новые подключения могут вести себя по-разному.

   **Типичная ошибка:** Считать успешный ongoing download доказательством исправности новых attach.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

207. Как backhaul/core congestion отражается на пользовательском опыте?

   **Ответ:** Очереди увеличивают RTT и jitter, drops запускают recovery, а ограниченная ёмкость снижает goodput. Сходство с радиоошибками требует измерений на transport и radio границах.

   **Типичная ошибка:** Лечить backhaul bufferbloat повышением transmit power UE.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

208. Какие интерфейсы EPC особенно важны для понимания attach и data session?

   **Ответ:** Для attach важны S1-MME, S6a, S11 и S5/S8 control; для data — S1-U, S5/S8 user и SGi. Конкретный flow и дополнительные зависимости определяет процедура.

   **Типичная ошибка:** Пытаться проверить attach только capture на SGi.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

209. Почему GTP central to EPC architecture?

   **Ответ:** GTP-C координирует session/bearer-state, а GTP-U связывает user-plane сегменты на соответствующих интерфейсах. Это обеспечивает separation и mobility-aware forwarding, но не означает GTP на каждом LTE-интерфейсе.

   **Типичная ошибка:** Называть NAS и S1AP разновидностями GTP.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

210. Какие сложности добавляет туннелирование для observability?

   **Ответ:** Нужна корреляция внутренних UE-пакетов с внешними endpoints/TEID, bearer-state и изменениями пути. Сам TEID имеет локальную область и время жизни, поэтому capture без signaling может быть неоднозначным.

   **Типичная ошибка:** Использовать TEID без endpoint и timestamp как глобальный tracing ID.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

211. Как failures в одном EPC узле могут каскадно затрагивать остальные?

   **Ответ:** Недоступность зависимости вызывает таймауты, удержание ресурсов и повторные запросы, которые нагружают соседей. Разумные limits, backoff и recovery ограничивают cascade, но должны сохранять протокольную семантику.

   **Типичная ошибка:** Реагировать на перегрузку бесконечными синхронными retries во всех узлах.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

212. Какие узлы EPC наиболее чувствительны к high session churn?

   **Ответ:** MME и gateway control функции испытывают создание/изменение/удаление контекстов, а HSS и policy dependencies — связанные запросы. Ограничения зависят от профиля процедур, поэтому packet throughput не заменяет churn test.

   **Типичная ошибка:** Считать миллион долгоживущих idle contexts эквивалентом миллиона attach в секунду.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

213. Как EPC участвует в создании и удалении bearers?

   **Ответ:** MME координирует EPS/NAS и access часть, gateways создают или удаляют tunnel/session context, policy может инициировать нужные изменения. Операция завершена только после требуемых переходов и обработки ошибок, а не одной отправки запроса.

   **Типичная ошибка:** Удалять все состояния на первом сообщении, игнорируя незавершённый peer exchange.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

214. Что такое default path for user traffic в EPC?

   **Ответ:** Для обычной active IP-сессии данные идут eNodeB↔S-GW↔P-GW↔PDN, с radio-сегментом между UE и eNodeB. Default bearer обслуживает базовую классификацию этой PDN connection, но путь может включать предусмотренные архитектурные варианты.

   **Типичная ошибка:** Включать MME в default user-plane path.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

215. Почему EPC должен сочетать telecom signaling и обычный IP forwarding?

   **Ответ:** Сигнализация создаёт subscriber/session/bearer-state, а IP и tunnel forwarding доставляют данные по этому состоянию. Корректность требует и protocol agreement, и рабочего transport/packet processing.

   **Типичная ошибка:** Считать успешный control exchange достаточным доказательством исправного data plane.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

216. Как software engineers обычно отлаживают EPC issues?

   **Ответ:** Строят timeline процедуры по NAS/S1AP/GTP с контекстными IDs и causes, затем сопоставляют transport, forwarding и ресурсы узлов. Гипотезу проверяют на конкретной границе и по возможности воспроизводят в lab.

   **Типичная ошибка:** Начинать с перезапуска всех узлов, уничтожая диагностический контекст.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

217. Как state correlation между логами разных EPC узлов обычно организуется?

   **Ответ:** Связывают subscriber/temporary identity, UE-context IDs, PDN/bearer и tunnel keys с областью действия и временем. Нужны согласованные timestamps и контроль смены идентификаторов при mobility и reuse.

   **Типичная ошибка:** Считать один UE IP достаточным идентификатором всех сессий во времени.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

218. Почему EPC — хороший пример stateful distributed system?

   **Ответ:** Состояние разделено между узлами, изменения согласуются сообщениями и timers, а отказы могут быть частичными. Повтор, restart или delayed message требуют корректного recovery без нарушения текущего контекста.

   **Типичная ошибка:** Предполагать атомарность изменений всех EPC-узлов после одного успешного локального вызова.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

219. Какие части EPC должны быть highly available?

   **Ответ:** Нужно обеспечивать доступность всех функций, необходимых целевому сервису, включая transport, subscriber/policy dependencies и gateways. Резервирование и recovery различаются для signaling и established forwarding-state.

   **Типичная ошибка:** Считать резервный MME полной HA-архитектурой всей EPS.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

220. Что особенно важно понимать в EPC инженеру по network software?

   **Ответ:** Важны control/user separation, владельцы контекстов, tunnel/identity scope, asynchronous state transitions и recovery. В реализации нужны bounds ресурсов, безопасный lifecycle, protocol validation и пригодная корреляция.

   **Типичная ошибка:** Обрабатывать EPC как набор независимых stateless UDP handlers.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


### Продвинутый уровень
221. Как attach procedure проходит через EPC на high level?

   **Ответ:** MME получает NAS attach через eNodeB, выполняет нужные identity/authentication/security и subscriber шаги и создаёт session через gateways. После этого согласуются default bearer, initial context и завершение attach; ветвления зависят от исходного контекста и результата каждого этапа.

   **Типичная ошибка:** Рисовать один безусловный message flow для всех видов attach и recovery.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

222. Как bearer establishment проходит через EPC?

   **Ответ:** Создаются EPS bearer context и соответствующие core tunnels, затем access/radio segment настраивается через eNodeB и UE. Dedicated bearer может инициироваться policy/core с нужными QoS и traffic filters; ошибки требуют согласованного rollback или cleanup.

   **Типичная ошибка:** Считать bearer готовым сразу после выдачи одного TEID.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

223. Как MME, SGW, PGW делят ответственность при создании data path?

   **Ответ:** MME координирует access/NAS и EPS context, S-GW связывает user-plane segments, P-GW обеспечивает PDN connection и policy enforcement. eNodeB и UE дополнительно создают radio часть, поэтому core-state не заменяет готовность Uu.

   **Типичная ошибка:** Приписывать P-GW выбор каждого radio grant.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

224. Как EPC реализует separation of control and forwarding?

   **Ответ:** MME не пересылает user packets, а gateways имеют control и forwarding responsibilities. В поддерживаемых архитектурных вариантах gateway control/user functions могут дополнительно разделяться физически; исходное логическое separation уже существует.

   **Типичная ошибка:** Считать любой EPC deployment обязательно реализующим отдельный CUPS control/user split gateway.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

225. Как GTP-C и GTP-U взаимодействуют в EPC?

   **Ответ:** GTP-C согласует tunnel/bearer-state и параметры endpoints, по которым GTP-U затем переносит user PDU. GTP-U может передавать данные без отдельного control exchange на каждый пакет, но зависит от корректного lifecycle mapping.

   **Типичная ошибка:** Считать GTP-C подтверждением доставки каждой пользовательской PDU.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

226. Как session anchoring влияет на mobility behavior?

   **Ответ:** Сохранение anchor помогает менять доступ без пересоздания всей PDN-связности и адреса. Relocation anchor требует дополнительных процедур и может влиять на путь и latency; область стабильности зависит от типа перехода.

   **Типичная ошибка:** Обещать неизменный маршрут и задержку при любом handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

227. Как charging/policy decisions materialize as bearer/QoS state?

   **Ответ:** Policy rules определяют классификацию трафика, QoS и charging treatment, затем реализуются в PCEF и нужных bearer. Для радио дополнительно нужны admission и ресурсы, поэтому policy intent и достигнутый SLA различают.

   **Типичная ошибка:** Считать запись QoS-rule доказательством доступной гарантированной radio capacity.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

228. Как subscriber identity, mobility state и user plane tunnels связываются между собой?

   **Ответ:** Subscriber связан с mobility/NAS context, тот — с PDN и EPS bearer, а bearer — с локальными endpoint/TEID mappings. Идентификаторы имеют разную область и меняются независимо, поэтому сохраняют связи и время действия.

   **Типичная ошибка:** Пытаться заменить все ключи одним универсальным 32-битным tunnel ID.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

229. Почему EPC observability сложна без хорошего correlation ID strategy?

   **Ответ:** Сообщения разных протоколов не несут один общий сквозной ID, а временные и tunnel identifiers переиспользуются. Без mapping timeline трудно отличить старое событие от нового контекста или проследить mobility.

   **Типичная ошибка:** Считать одинаковый TEID на разных endpoints доказательством одной сессии.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

230. Какие типичные bottlenecks EPC: CPU, memory, signaling rate, tunnel scale, state churn?

   **Ответ:** Ограничивать могут packet CPU/queues, память контекстов, timers, signaling I/O, tunnel tables и скорость lifecycle updates. Профиль measured load должен разделять steady forwarding, registered scale и session churn.

   **Типичная ошибка:** Заменять все capacity-характеристики одним peak Gbit/s.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

231. Как failover в EPC влияет на in-flight sessions?

   **Ответ:** При потере или смене владельца state часть сессий может продолжить forwarding, а часть — потребовать recovery/re-establishment. In-flight сообщения и пакеты создают дубли и late events, поэтому continuity проверяют конкретными fault tests.

   **Типичная ошибка:** Считать любой IP failover прозрачным для session-state и текущих процедур.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

232. Какие race conditions возможны между mobility и session procedures?

   **Ответ:** Handover/path switch может совпасть с bearer modify/delete, detach или timeout, создавая stale endpoint updates. Нужны проверки текущего контекста, последовательности и предусмотренное разрешение конфликтующих процедур.

   **Типичная ошибка:** Применять поздний Modify Bearer к новому контексту только из-за совпавшего переиспользованного ID.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

233. Как перегрузка MME может внешне выглядеть как random attach failure?

   **Ответ:** Различия очередей, timers, зависимостей и исходного состояния UE делают часть попыток успешными, а часть — просроченными. Из пользовательской перспективы это выглядит случайно, но корреляция с rates, CPU и causes выявляет закономерность.

   **Типичная ошибка:** Объявлять sporadic attach failure радиопроблемой без проверки MME-load и dependencies.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

234. Как перегрузка SGW/PGW может внешне выглядеть как throughput/jitter problem?

   **Ответ:** Packet queues, drops и задержка обработки tunnel traffic снижают goodput и увеличивают jitter/RTT. Control функции gateways могут отдельно замедлять создание bearer, поэтому setup и steady data проверяют раздельно.

   **Типичная ошибка:** Считать живой GTP echo достаточной проверкой forwarding capacity.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

235. Какие тесты используют для проверки scale EPC?

   **Ответ:** Проверяют registered/session/tunnel scale, attach/TAU/service churn, packet throughput при разных размерах и recovery under load. Нужно измерять успех, latency tails, drops, memory и cleanup, а не только моментальный peak.

   **Типичная ошибка:** Считать тест завершённым до проверки освобождения контекстов и восстановления после faults.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

236. Как EPC debugging напоминает debugging distributed microservice systems?

   **Ответ:** Полезны tracing, state ownership, dependency timeline, queue/resource metrics и анализ partial failure. Отличие — строгие protocol states и timers, поэтому generic retry/circuit breaker применяют лишь с соблюдением процедур.

   **Типичная ошибка:** Подменять стандартизованный cause code свободным HTTP-подобным статусом внутри внешнего протокола.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

237. Какие метрики EPC нужно обязательно собирать для production?

   **Ответ:** Нужны attempts/success/causes и latency процедур, active contexts/tunnels, rates, retransmissions/timeouts, restart/recovery и user-plane bytes/drops/queues. Их связывают с CPU, memory, I/O и доступностью dependencies.

   **Типичная ошибка:** Собирать только среднее CPU и общую скорость трафика.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

238. Как проектировать load tests для EPC-like systems?

   **Ответ:** Задают profile UE-state, procedural mix, churn, traffic sizes/rates, mobility и fault scenarios с ожидаемыми исходами. Нагрузку увеличивают с контролем ошибок, latency tails и утечек, включая recovery после снятия перегрузки.

   **Типичная ошибка:** Генерировать недопустимые сообщения без state и считать их производительность ёмкостью нормального EPC.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

239. Какие требования к latency и determinism есть у control-plane EPC components?

   **Ответ:** Control plane должен выполнять процедуры до protocol timers и сервисных deadlines при массовой конкуренции. Это обычно иные сроки, чем per-TTI radio loop, но длинные паузы и хвосты задержек вызывают retries и cascade.

   **Типичная ошибка:** Назначать всем EPC control handlers такой же цикл, как PHY scheduler, без требований процедуры.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

240. Что из EPC наиболее важно для C/C++ engineer, пишущего сетевой core software?

   **Ответ:** Главное — безопасные бинарные/ASN.1 protocol boundaries, state machines, context lifetime, timers, duplicates и bounded resources. Для forwarding добавляются MTU, tunnel parsing, batching и измерение latency/packet rate при корректной синхронизации с control.

   **Типичная ошибка:** Оптимизировать packet hot path, допуская use-after-free при concurrent bearer deletion.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


### Инженерные вопросы
241. Почему EPC нельзя рассматривать только как набор “телеком коробок”?

   **Ответ:** Это взаимодействующие протокольные функции с распределённым state, ресурсами и recovery, а не только физические appliances. Развёртывание можно менять, сохраняя стандартизованные роли и наблюдаемое поведение.

   **Типичная ошибка:** Считать перемещение функций в контейнеры устранением stateful telecom-сложности.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

242. Какие аналогии между EPC и современными distributed network platforms наиболее полезны?

   **Ответ:** Полезны аналогии с session controllers и stateful forwarding platforms, ownership, dependency graphs и partial failures. Их границы важны: telecom procedures задают конкретные сообщения, timers и recovery, а не произвольный service API.

   **Типичная ошибка:** Переносить stateless request balancing на все signaling сообщения без affinity/state routing.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

243. Почему при troubleshooting LTE важно быстро отделять radio issue от EPC issue?

   **Ответ:** Одинаковые пользовательские симптомы имеют разные причины и владельцев, поэтому разделение ускоряет проверку гипотез. Граница может быть общей, например S1/backhaul, и не всегда сводится к бинарному «радио или core».

   **Типичная ошибка:** Выбирать одну команду-владельца по симптому до определения места нарушения.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

244. Какие EPC темы часто всплывают на интервью для network/telecom engineer?

   **Ответ:** Часто обсуждают роли MME/S-GW/P-GW/HSS, NAS/AS, bearer/PDN, GTP, attach, mobility, QoS и tracing. Для software роли важны context lifecycle, overload, duplicates и restart/failover.

   **Типичная ошибка:** Заучивать порядок сообщений без объяснения, какие state и data paths они меняют.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

245. Что нужно понять про EPC до изучения MME, SGW и PGW отдельно?

   **Ответ:** Нужно понять общий путь control и user plane, понятия subscriber, PDN connection и bearer и распределение state. После этого функции каждого узла изучаются как части согласованной процедуры, а не изолированные определения.

   **Типичная ошибка:** Считать MME, S-GW и P-GW тремя последовательными user-plane routers.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).


---

## 4. MME

### Базовый уровень
246. Что такое MME?

   **Ответ:** Mobility Management Entity — control-plane функция EPC для NAS, регистрации, mobility и координации EPS bearer/session процедур. Она не находится в цепочке обычного user-plane forwarding.

   **Типичная ошибка:** Считать MME центральным packet router LTE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

247. Какова роль MME в LTE?

   **Ответ:** MME управляет EPS mobility/security context UE, взаимодействует с HSS и gateways и координирует access/session процедуры. Радиоресурсами в пределах соты управляет eNodeB.

   **Типичная ошибка:** Приписывать MME выбор radio MCS и PRB каждого UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

248. Почему MME относится к control plane?

   **Ответ:** Он обрабатывает сообщения и состояния, создающие и изменяющие связность, а пользовательские PDU проходят другим путём. Даже если NAS и S1AP переносятся поверх IP, их назначение остаётся control.

   **Типичная ошибка:** Считать любой IP-based узел user-plane функцией.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

249. Пересылает ли MME пользовательский трафик?

   **Ответ:** Обычный пользовательский трафик MME не пересылает: он идёт через eNodeB и gateways. Предусмотренные CIoT control-plane optimizations могут переносить небольшие пользовательские данные через signaling, поэтому абсолютное «никогда» требует уточнения режима.

   **Типичная ошибка:** Переносить исключение CIoT CP data на обычный S1-U-path всех UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

250. За какие процедуры отвечает MME?

   **Ответ:** Ключевые процедуры — attach/detach, TAU, service request, paging, NAS-security и координация bearer/mobility. Точные обязанности зависят от исходных состояний и участвующих узлов.

   **Типичная ошибка:** Считать MME единственным исполнителем всех этапов без HSS, gateways и eNodeB.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

251. Как MME участвует в attach?

   **Ответ:** Получает NAS attach через eNodeB, проверяет нужные identity/security/subscription условия и координирует создание PDN/default bearer и access context. Завершение требует корректных последующих ответов и transitions.

   **Типичная ошибка:** Считать Attach Request уже успешной регистрацией.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

252. Как MME участвует в аутентификации?

   **Ответ:** Запрашивает authentication-related данные у HSS/AuC при необходимости и выполняет EPS AKA/NAS-security процедуры с UE. Долговременный секрет подписки не передаётся MME как обычный открытый subscriber field.

   **Типичная ошибка:** Считать аутентификацию простой проверкой IMSI в таблице без cryptographic proof.

   **Источник:** [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

253. Как MME участвует в mobility management?

   **Ответ:** Хранит registration/tracking-area и serving access context, выполняет TAU/paging и участвует в handover/path updates. Он не выбирает каждый radio handover target самостоятельно вместо исходного eNodeB.

   **Типичная ошибка:** Считать mobility management равным только connected-mode handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

254. Как MME связан с NAS signaling?

   **Ответ:** MME — логический network endpoint EPS NAS для UE. NAS доставляется через RRC и S1AP; MME проверяет сообщения, security и состояние перед применением transitions.

   **Типичная ошибка:** Считать eNodeB конечным NAS-партнёром UE.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

255. С какими основными узлами взаимодействует MME?

   **Ответ:** Основные peer — eNodeB по S1-MME, HSS по S6a, S-GW по S11 и другие mobility core nodes по предусмотренным интерфейсам. P-GW session-control обычно достигается через S-GW, а не прямым MME→P-GW S5.

   **Типичная ошибка:** Рисовать S11 как MME↔P-GW интерфейс.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

256. Почему отказ MME критичен для абонентов?

   **Ответ:** Без него нарушаются новые регистрации, service/mobility и security процедуры для затронутых UE. Часть уже установленного forwarding может временно продолжаться, но это не означает полной доступности услуги.

   **Типичная ошибка:** Считать продолжение одного download доказательством безвредности MME outage.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

257. Что такое UE context в MME?

   **Ответ:** Это набор mobility/NAS-security, identity, access connection и EPS session/bearer сведений UE. У разных полей разные lifetime и область; реализация памяти не задаётся единственной стандартной C-структурой.

   **Типичная ошибка:** Удалять весь context при каждом S1 release, теряя зарегистрированную idle-сессию.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

258. Как MME связан с bearer establishment?

   **Ответ:** MME координирует создание и изменение EPS bearer-state между NAS/access и gateways. Он сообщает нужные QoS/context параметры, но не пересылает обычные данные по созданному bearer.

   **Типичная ошибка:** Считать MME только читателем bearer-state без участия в его lifecycle.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

259. Почему MME важен для idle/connected state management?

   **Ответ:** Он различает EPS registration и наличие signaling connection, поддерживает idle location и инициирует paging/service восстановление. ECM-state и EMM-state имеют разные значения и не сводятся к одному connected flag.

   **Типичная ошибка:** Путать ECM-IDLE с EMM-DEREGISTERED.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

260. Какие KPI обычно ассоциированы с MME?

   **Ответ:** Полезны success/causes и latency attach, TAU, service, paging и bearer процедур, активные UE-context и signaling rates/timeouts. Добавляют dependency, CPU/memory/queue и restart/recovery metrics.

   **Типичная ошибка:** Оценивать MME только количеством user-plane Gbit/s, которые он обычно не пересылает.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).


### Средний уровень
261. Как MME взаимодействует с eNodeB по S1-MME?

   **Ответ:** S1AP поверх SCTP/IP переносит initial/context, NAS transport, mobility и release процедуры. SCTP association — транспортная сущность между узлами, а UE-associated S1AP IDs задают отдельные контексты.

   **Типичная ошибка:** Приравнивать один SCTP association одному UE.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

262. Как MME взаимодействует с HSS?

   **Ответ:** По S6a Diameter получает subscriber/authentication сведения и выполняет location-related взаимодействие. Важны peer routing, result codes и связь Diameter-транзакции с конкретной UE-процедурой.

   **Типичная ошибка:** Считать TCP/SCTP connection к HSS достаточным подтверждением успешного subscriber update.

   **Источник:** [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

263. Как MME взаимодействует с SGW/PGW?

   **Ответ:** По S11 GTPv2-C управляет session/bearer в S-GW, который взаимодействует с P-GW по соответствующему S5/S8 control path. Путь ответов и причины ошибок связывают с исходной NAS/S1-процедурой.

   **Типичная ошибка:** Считать наличие UDP-пакета к S-GW доказательством созданного user-plane tunnel.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

264. Как MME участвует в tracking area updates?

   **Ответ:** При TAU проверяет UE/context и условия, обновляет registration/location и при необходимости взаимодействует с другими узлами. TAU не обязательно создаёт новую PDN connection или меняет IP.

   **Типичная ошибка:** Считать каждый TAU полным повторным attach.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

265. Что такое tracking area?

   **Ответ:** Tracking area — область LTE mobility management, составленная из сот и определяемая TAI. UE получает tracking-area list и выполняет обновления по предусмотренным условиям, включая выход из допустимой области.

   **Типичная ошибка:** Считать TA идентичной одной соте или одному eNodeB.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

266. Зачем нужна tracking area?

   **Ответ:** Она позволяет отслеживать idle UE с меньшим signaling, чем постоянное сообщение каждой смены соты. Большая область уменьшает часть updates, но расширяет paging и меняет эксплуатационный баланс.

   **Типичная ошибка:** Считать увеличение TA всегда полезным без цены paging load.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

267. Как MME участвует в paging?

   **Ответ:** Получив повод доставить данные или сигнализацию idle UE, MME инициирует paging через подходящие eNodeB в нужной области. UE отвечает доступом/service procedure, после чего восстанавливается подходящий access path.

   **Типичная ошибка:** Считать paging прямой передачей пользовательского IP-пакета на broadcast всем UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

268. Почему paging связан именно с mobility state?

   **Ответ:** Для idle UE сеть обычно не знает текущую serving cell с connected точностью, поэтому ищет его в допустимой области. Paging scope и ответ зависят от сохранённой регистрации и состояния доступа.

   **Типичная ошибка:** Считать paging требующим активного S1 UE-associated connection к одной известной соте.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

269. Что такое detach procedure и как MME в ней участвует?

   **Ответ:** Detach прекращает EPS registration и связанные контексты согласно сценарию, с координацией UE и core cleanup. Он отличается от обычного release радиосоединения в idle; UE- и network-initiated ветви различаются.

   **Типичная ошибка:** Удалять регистрацию при каждом RRC release как будто произошёл detach.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

270. Как MME выбирает SGW/PGW на концептуальном уровне?

   **Ответ:** Выбор зависит от location/serving area, APN, subscription, policy, topology и доступных процедур обнаружения. Стандарт описывает роли и условия; конкретная политика и инфраструктура выбора могут различаться.

   **Типичная ошибка:** Всегда выбирать один ближайший IP без проверки допустимой PDN/APN и serving area.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

271. Почему MME — stateful control node?

   **Ответ:** Решение по сообщению зависит от текущих EMM/ECM, security, session и procedural contexts и timers. Поэтому сообщение нельзя обрабатывать как независимую stateless-команду.

   **Типичная ошибка:** Распределять NAS сообщения одного UE случайно между workers без общего owner/state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

272. Какие типы перегрузки особенно опасны для MME?

   **Ответ:** Опасны attach/TAU/service bursts, paging, массовые reconnect и задержки dependencies, накапливающие транзакции. Ограничение бывает по CPU, timers, памяти или signaling I/O даже при низком user traffic.

   **Типичная ошибка:** Настраивать overload threshold только по среднему CPU без queue и timeout metrics.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

273. Почему attach storm опасен для MME?

   **Ответ:** Каждая попытка требует state transitions, signaling, security и обращения к другим узлам. Синхронные retries повышают нагрузку и могут продлевать outage, поэтому нужны предусмотренные ограничения и backoff.

   **Типичная ошибка:** Считать attach storm безвредным из-за малого размера каждого сообщения.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

274. Почему массовая re-attach активность после outage может перегрузить MME?

   **Ответ:** Многие UE одновременно обнаруживают восстановление и начинают attach/service recovery, создавая кратный пик. Нужно тестировать recovery-load и использовать допустимое управление доступом/overload вместо предположения о steady-state capacity.

   **Типичная ошибка:** Проверять outage recovery только на одном UE или плавной нагрузке.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

275. Как MME failure проявляется для пользователя?

   **Ответ:** Новые подключения или service requests могут не завершаться, paging и mobility — сбоить. Уже работающие данные иногда сохраняются до необходимости control event, поэтому симптомы зависят от UE-state.

   **Типичная ошибка:** Считать MME failure всегда одинаковым полным исчезновением RF-сигнала.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

276. Какие ошибки приводят к attach reject?

   **Ответ:** Reject может следовать из subscription/access restrictions, identity/security проблем, policy или нехватки ресурса, с соответствующими cause. Timeout и транспортный разрыв не следует автоматически называть корректным Attach Reject.

   **Типичная ошибка:** Читать только текст «attach failed», игнорируя NAS/S1AP/Diameter/GTP causes и источник решения.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

277. Как MME участвует в handover control?

   **Ответ:** MME участвует в S1-based preparation и core path/context changes, а при X2-based выполняет необходимые path-switch/core шаги. Конкретная роль зависит от смены MME/S-GW и исходного сценария.

   **Типичная ошибка:** Считать любой handover сменой MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

278. Как S1 handover затрагивает MME?

   **Ответ:** MME координирует S1 handover между source/target access и при необходимости core nodes, включая context и bearer path. Это отдельная процедура, а не обычная маршрутизация X2 через произвольный IP-hop.

   **Типичная ошибка:** Считать S1 handover просто X2AP-пакетом, пересланным MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

279. Как X2 handover может минимизировать involvement MME?

   **Ответ:** Прямая подготовка source↔target по X2 сокращает участие core в этой стадии. После выполнения UE-перехода остаются предусмотренные path switch и core updates, поэтому MME не исключается полностью.

   **Типичная ошибка:** Называть X2 handover полностью core-free процедурой.

   **Источник:** [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

280. Какие логи MME наиболее важны при анализе attach failure?

   **Ответ:** Нужны NAS timeline/security outcome, S1AP IDs, S6a result, GTP session requests/responses и причины, timers и cleanup. Идентификаторы и время связывают с исходной попыткой, а секреты не выводят для обычной диагностики.

   **Типичная ошибка:** Искать attach failure только по последней строке timeout, не проверяя ранний dependency reject.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

281. Какие state transitions MME нужно понимать?

   **Ответ:** Различают registration EMM, signaling connection ECM и состояния отдельных NAS/procedure automata. Attach, service, release, TAU и detach меняют разные части state, поэтому нужен контекстный timeline.

   **Типичная ошибка:** Считать connected/disconnected достаточной моделью всего MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

282. Чем MME похож на signaling control service в distributed systems?

   **Ответ:** Он координирует stateful workflows через асинхронные peer messages, deadlines и partial failures. Но wire protocols и transitions стандартизованы, поэтому общие service patterns применяют с учётом telecom semantics.

   **Типичная ошибка:** Заменять protocol timers произвольным общим request timeout без анализа процедур.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

283. Как software design MME должен учитывать большое количество состояний UE?

   **Ответ:** Нужны ограниченная память на context, эффективные timers, корректный lookup/ownership и очистка незавершённых процедур. Масштаб оценивают вместе с churn и recovery, поскольку idle-state scale не описывает work rate.

   **Типичная ошибка:** Предвыделять неограниченные buffers на каждого UE или оставлять timed-out contexts навсегда.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

284. Почему таймеры и retransmissions важны для MME procedures?

   **Ответ:** Ответ может потеряться или опоздать, поэтому timers запускают предусмотренные повторы, отказ или cleanup. Номера, пределы и реакции зависят от процедуры и должны соответствовать выбранной версии NAS/core protocol.

   **Типичная ошибка:** Повторять бесконечно любое сообщение по единому универсальному таймеру.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

285. Что должен понимать C/C++ разработчик про внутреннюю state machine MME?

   **Ответ:** Нужно явно моделировать допустимые states/events, ownership контекста, lifetime timers и обработку дублей/late responses. Parsing success не означает, что событие допустимо или принадлежит текущей версии UE-context.

   **Типичная ошибка:** Выполнять transition до проверки integrity, identity и текущей procedure-state.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).


### Продвинутый уровень
286. Как attach message flow обрабатывается MME по шагам?

   **Ответ:** MME принимает Initial UE Message с NAS, определяет identity/context и выполняет необходимые authentication, security и location/subscription шаги. Затем координирует Create Session, access/default bearer setup и завершение attach с обработкой подтверждений и ошибок; optional branches зависят от сценария.

   **Типичная ошибка:** Считать порядок одной упрощённой схемы обязательным для всех emergency, recovery и context-reuse случаев.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

287. Как NAS messages маршрутизируются и обрабатываются в MME?

   **Ответ:** S1AP доставляет NAS с access-context IDs, после чего MME связывает его с UE/procedure и проверяет формат, security и состояние. Внутренняя диспетчеризация должна сохранять порядок и ownership для связанного контекста.

   **Типичная ошибка:** Маршрутизировать сообщение только по IMSI, которого может не быть в каждой NAS-PDU.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

288. Как MME correlates subscriber identity, security state и bearer context?

   **Ответ:** Identity и temporary identifiers связываются с EMM/ECM и NAS-security context, а далее с PDN и bearer mappings. Ключевые связи обновляют по процедуре и проверяют область/версию, не смешивая переиспользованные IDs.

   **Типичная ошибка:** Применять старый security или bearer-context к новому UE только по совпавшему локальному номеру.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

289. Какие timer-driven state transitions наиболее важны в MME?

   **Ответ:** Важны ожидания authentication/security/attach/TAU/service и соответствующие пределы повторов/cleanup, а также idle/reachability-related timers. Конкретные NAS timer IDs и реакции берут из выбранной версии TS 24.301, отличая UE и network сторону.

   **Типичная ошибка:** Копировать значения timer UE в MME только из-за похожего названия процедуры.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

290. Какие гонки возникают между detach, paging, TAU и handover?

   **Ответ:** Detach может удалить state, пока paging/service/TAU или handover ещё держат ссылки и ожидают ответы. Нужно различать отменённую, старую и текущую процедуру и не воскрешать удалённые session mappings поздним событием.

   **Типичная ошибка:** Применять любой пришедший успешный ответ после detach как новое разрешение создать контекст.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

291. Почему idempotency важна в обработке control-plane сообщений MME?

   **Ответ:** Потеря ответа и retry не должны приводить к повторному созданию сессии, двойной аллокации или некорректному cleanup. Идемпотентность обеспечивают по правилам конкретной процедуры и transaction identity, а не слепым игнорированием дублей.

   **Типичная ошибка:** Считать одинаковый payload всегда одним событием независимо от контекста и времени.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

292. Как retries и duplicate signaling messages должны обрабатываться в MME?

   **Ответ:** Проверяют transaction/procedure IDs, ожидаемое состояние и lifetime; при дубликате выполняют предусмотренный повтор ответа или другую protocol reaction. Поздний ответ не должен менять уже заменённый контекст.

   **Типичная ошибка:** Отбрасывать все повторы без ответа, заставляя peer бесконечно ждать завершения.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

293. Как MME scale ограничивается CPU, memory, session state или signaling I/O?

   **Ответ:** CPU ограничивает parsing/security/transitions, память — contexts и pending transactions, I/O — signaling connections/rates, timers — event processing. Capacity измеряют многомерно и при разных procedural mixes, включая overload recovery.

   **Типичная ошибка:** Считать максимальное число сохранённых UE единственным пределом производительности MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

294. Как шардировать или распределять нагрузку MME-like control service?

   **Ответ:** Распределяют context ownership и routing сообщений по устойчивым ключам, поддерживают доступность peer/UE mappings и recovery при смене владельца. Стандартизованное pooling и внутренний software sharding — разные уровни решений.

   **Типичная ошибка:** Хешировать каждый временный ID независимо, теряя связь NAS, S1AP и gateway транзакций.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

295. Какие проблемы thread safety и concurrency типичны для MME software?

   **Ответ:** Конкурируют timers, peer responses, release, mobility и session updates с общими context maps. Нужны сериализация по owner или корректная синхронизация, memory ordering и reclamation, включая shutdown и ID reuse.

   **Типичная ошибка:** Считать atomic pointer достаточным решением lifetime связанных неатомарных полей.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

296. Как tracing одного subscriber through MME works in practice?

   **Ответ:** Выбирают нужную попытку и временной интервал, затем связывают identity, temporary IDs, S1AP и GTP/Diameter transaction context. Timeline включает cause, timers, state transitions и зависимости с учётом смены идентификаторов.

   **Типичная ошибка:** Искать одну строку IMSI во всех пакетах и считать отсутствие совпадения отсутствием события.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

297. Как overload protection реализуется в MME?

   **Ответ:** Используются предусмотренные overload signaling, ограничения admission/requests, управление очередями и защитой зависимостей. Reject/backoff должны соответствовать протоколу, а не создавать повторный шторм и незавершённые contexts.

   **Типичная ошибка:** Случайно drop все сообщения, включая cleanup и завершающие ответы, без анализа recovery.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

298. Какие backpressure strategies полезны для MME?

   **Ответ:** Полезны bounded queues, ограничение concurrency, admission/rate control и приоритет обязательного recovery/cleanup. На внешней границе применяют допустимые reject/overload механизмы; бесконечное удержание запроса не является безопасным backpressure.

   **Типичная ошибка:** Блокировать общий event loop ожиданием медленного HSS, останавливая все UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/).

299. Как MME failover влияет на active UE contexts?

   **Ответ:** Сохранённость зависит от репликации/recovery контекстов и поддерживаемых процедур; часть UE может потребовать service recovery или повторной регистрации. Переключить transport endpoint недостаточно без security, procedure и bearer-state.

   **Типичная ошибка:** Считать failover прозрачным при наличии только копии IMSI-списка.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

300. Как тестировать MME на resilience к signaling storms?

   **Ответ:** Создают реалистичные attach/TAU/service bursts и dependency delays/failures, проверяя limits, retry dynamics и восстановление после снятия нагрузки. Контролируют success, latency tails, memory/contexts, cleanup и влияние на уже обслуживаемых UE.

   **Типичная ошибка:** Заканчивать тест на пике, не проверив возврат к нормальному состоянию.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

301. Какие metrics/alerts нужны для production-grade MME?

   **Ответ:** Нужны procedural success/causes/latency, rates, pending work, timeouts/retries, active contexts и dependency health. Alerts должны учитывать попытки, сезонную нагрузку и impact, а не только process alive.

   **Типичная ошибка:** Считать доступный management port достаточным health check услуги регистрации.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

302. Какие ошибки конфигурации чаще всего ломают MME procedures?

   **Ответ:** Ошибки PLMN/TAC/TA-list, subscriber/APN policy, peer identities/routing, transport и security parameters могут ломать процедуры. Проверяют конкретный cause и конфигурацию на всех участниках, не подбирая значения наугад.

   **Типичная ошибка:** Менять timer для маскировки постоянного Diameter routing reject.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

303. Как distinguish between MME bug and upstream/downstream integration issue?

   **Ответ:** Определяют первый нарушенный контракт: неверный локальный transition, peer reject, transport timeout или несогласованная конфигурация. Сопоставляют wire trace и state timeline и воспроизводят минимальный сценарий, сохраняя фактическую причину ответа.

   **Типичная ошибка:** Объявлять баг MME только потому, что он отправил пользователю итоговый reject.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

304. Какие design patterns полезны при реализации MME в C/C++?

   **Ответ:** Полезны явные state machines, RAII для ресурсов, bounded messaging, single-owner contexts и cancellation-aware timers. Выбор concurrency-подхода подтверждают измерениями и проверками lifetime, а protocol handling отделяют от transport parsing.

   **Типичная ошибка:** Скрывать сложные state transitions в глобальных callbacks с сырыми бессрочными указателями.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

305. Какие темы MME чаще всего обсуждают на senior telecom software interview?

   **Ответ:** Обсуждают EPS/NAS, EMM/ECM, attach/TAU/service/paging, security, bearer и interfaces. На senior уровне важны duplicates, transaction scope, failover, overload, concurrency и диагностический разбор неудачной процедуры.

   **Типичная ошибка:** Заменять понимание recovery заученным happy-path attach diagram.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).


### Инженерные вопросы
306. Почему MME — это хороший пример сложной stateful control-plane системы?

   **Ответ:** MME связывает несколько независимых peer и UE automata, security и сессии через ненадёжную асинхронную доставку. Частичные отказы и late messages требуют строгого state ownership и recovery.

   **Типичная ошибка:** Считать один успешный ответ атомарным commit всей распределённой EPS-системы.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

307. Какие инженерные уроки из MME полезны вне телекома?

   **Ответ:** Полезны ограничение ресурсов, явные состояния, idempotency, scopes идентификаторов, deadlines и observability workflow. Эти принципы применимы к orchestration/session services, но конкретные telecom таймеры вне домена не копируют автоматически.

   **Типичная ошибка:** Переносить MME message flow буквально в произвольный бизнес-сервис.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

308. Почему control-plane reliability часто важнее raw throughput для MME?

   **Ответ:** Ошибка registration/security/context может нарушить услугу даже при огромном packet capacity других узлов. Reliability и соблюдение процедур необходимы, а throughput control events тоже важен как измеряемое ограничение.

   **Типичная ошибка:** Считать надёжность оправданием отсутствия capacity и overload testing.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

309. Какие части MME должны быть поняты глубоко разработчиком telecom software?

   **Ответ:** Разработчику нужны NAS state/security semantics, identity и context lifetime, procedure timers, S1AP/GTP/S6a integration и recovery. Глубина radio DSP может быть меньше, но границы с eNodeB и bearer path должны быть понятны.

   **Типичная ошибка:** Реализовывать NAS только по примерам pcap без чтения state и error-handling требований.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

310. Какие анти-паттерны опасны при проектировании MME-like services?

   **Ответ:** Опасны бесконечные очереди и retries, global mutable contexts, blocking dependencies, ID без scope/version и cleanup без lifetime контроля. Они ведут к storms, утечкам и применению старых событий к новым сессиям.

   **Типичная ошибка:** Считать редкие race conditions приемлемыми, пока обычный attach работает.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).


---

## 5. SGW

### Базовый уровень
311. Что такое SGW?

   **Ответ:** Serving Gateway — gateway-функция EPC, связывающая access user plane с P-GW и участвующая в mobility/session control. S-GW имеет и forwarding, и связанные control responsibilities.

   **Типичная ошибка:** Считать S-GW только пассивным GTP relay без состояния.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

312. Какова роль SGW в EPC?

   **Ответ:** Он завершает соответствующие tunnel segments, пересылает данные и служит anchor для ряда переходов доступа. При idle-сценариях участвует в buffering/notification, а session-state согласует с MME и P-GW.

   **Типичная ошибка:** Приписывать S-GW радиопланирование и NAS-security termination.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

313. Относится ли SGW к user plane?

   **Ответ:** Да, forwarding пользовательских PDU — его основная роль, но логическая S-GW также участвует в control signaling session/bearer. В вариантах CUPS control и user функции могут быть разделены.

   **Типичная ошибка:** Считать любой S-GW не имеющим GTP-C и session-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

314. Как SGW связан с eNodeB?

   **Ответ:** В обычном active LTE bearer eNodeB связан с S-GW по S1-U, используя GTP-U/UDP/IP. Параметры endpoint и TEID согласуются control-процедурами, а не выводятся из UE IP.

   **Типичная ошибка:** Считать S1-MME интерфейсом eNodeB↔S-GW.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

315. Как SGW связан с PGW?

   **Ответ:** Через S5 внутри соответствующей сети или S8 в roaming-сценарии связываются serving и PDN gateway-роли. В GTP-based варианте есть control GTPv2-C и user GTP-U; архитектурные варианты нужно уточнять.

   **Типичная ошибка:** Считать любой S5/S8 безусловно одним и тем же протоколом во всех предусмотренных вариантах EPC.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

316. Почему SGW участвует в forwarding пользовательского трафика?

   **Ответ:** Он соединяет пользовательские bearer-сегменты eNodeB↔S-GW и S-GW↔P-GW и меняет serving path при нужных процедурах. Forwarding выполняется по bearer/tunnel context, а не только по произвольной destination IP inner-пакета.

   **Типичная ошибка:** Предлагать заменить tunnel lookup обычным route lookup без сохранения bearer semantics.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

317. Что такое mobility anchor в контексте SGW?

   **Ответ:** Это относительно стабильная user-plane точка для определённых изменений access path, например intra-E-UTRAN handover. Область стабильности ограничена процедурой и serving area; возможна relocation S-GW.

   **Типичная ошибка:** Считать S-GW постоянным anchor при любом перемещении абонента на весь срок подписки.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

318. Почему SGW важен при handover?

   **Ответ:** Он обновляет access-side tunnel endpoint и участвует в согласовании нового пути, сохраняя другую часть session path в подходящем сценарии. Это помогает continuity, но не гарантирует нулевые loss/reordering или latency.

   **Типичная ошибка:** Считать handover обновлением только таблицы eNodeB без участия core path state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

319. Какие туннели обычно завершаются на SGW?

   **Ответ:** В обычном GTP-based LTE завершаются S1-U и S5/S8-U user-plane segments, а соответствующие control interfaces управляют ими. TEID направления и peer endpoint задаются отдельно.

   **Типичная ошибка:** Считать один TEID одинаковым на всех сегментах и направлениях EPS bearer.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

320. Участвует ли SGW в control signaling?

   **Ответ:** Да: GTPv2-C на S11 и соответствующем S5/S8 управляет session/bearer-state. Это отличается от NAS UE↔MME и S1AP eNodeB↔MME.

   **Типичная ошибка:** Считать user-plane роль запретом на любые control functions gateway.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

321. Как SGW связан с bearer path?

   **Ответ:** S-GW связывает core и access tunnel части соответствующего EPS bearer. Его context хранит mappings и параметры, необходимые для пересылки и процедур mobility/idle.

   **Типичная ошибка:** Приравнивать bearer-state только локальному UDP socket без peer и lifecycle.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

322. Какие KPI важны для SGW?

   **Ответ:** Нужны packets/bytes, drops по причинам, active sessions/bearers/tunnels, latency/queues, buffering и GTP control success/timeouts. Их связывают с CPU, memory, NIC и изменениями пути.

   **Типичная ошибка:** Считать общую скорость достаточной, если часть bearer теряет все пакеты.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

323. Как SGW влияет на latency?

   **Ответ:** К обработке добавляются forwarding, queues и при idle/recovery — ожидание нужных процедур. В стабильном состоянии важны tail latency и drops, а не только средняя скорость обработки.

   **Типичная ошибка:** Считать задержку gateway постоянной независимо от packet rate и нагрузки.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

324. Как SGW влияет на throughput?

   **Ответ:** Его packet processing, interfaces, memory bandwidth и queues могут ограничивать агрегированный throughput. Для мелких пакетов предел packet/s может наступать раньше предела bit/s.

   **Типичная ошибка:** Сравнивать capacity только в Gbit/s без packet sizes и feature profile.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

325. Что происходит при отказе SGW?

   **Ответ:** Может прерваться forwarding и потеряться session/tunnel-state, а восстановление зависит от HA и protocol recovery. Наличие живых MME/P-GW не автоматически восстанавливает потерянные mappings.

   **Типичная ошибка:** Считать смену IP-маршрута полной заменой восстановления S-GW-context.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).


### Средний уровень
326. Как SGW участвует в создании S1-U туннеля?

   **Ответ:** При session/bearer setup выделяется access-side endpoint/TEID и согласуется peer eNodeB через MME и S1 procedures. Полноценный data path требует правильного mapping в обоих направлениях.

   **Типичная ошибка:** Считать tunnel готовым после односторонней установки одного endpoint.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

327. Как SGW участвует в handover между eNodeB?

   **Ответ:** Обновляет access user-plane destination по соответствующей Modify Bearer/path-switch процедуре и выполняет предусмотренные forwarding indications. При S-GW relocation меняется также gateway-часть контекста.

   **Типичная ошибка:** Предполагать, что любой handover сохраняет один и тот же S-GW.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

328. Почему SGW может сохранять data-plane continuity во время mobility?

   **Ответ:** Если S-GW остаётся anchor, P-GW-side session может сохраняться при замене access-side пути. Continuity зависит от coordination и timing, поэтому buffers, transient loss и reordering всё равно возможны.

   **Типичная ошибка:** Понимать continuity как гарантированную доставку без потерь и задержки каждого in-flight пакета.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

329. Как SGW взаимодействует с MME при bearer setup?

   **Ответ:** MME по S11 инициирует или координирует нужные Create/Modify/Delete session/bearer операции, а S-GW обновляет state и взаимодействует с P-GW. Причины и ответы должны возвращаться в соответствующий текущий контекст.

   **Типичная ошибка:** Обрабатывать повторный Create Session как новую независимую аллокацию без transaction checks.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

330. Как SGW взаимодействует с PGW в user plane?

   **Ответ:** В GTP-based варианте принимает user PDU одного сегмента и отправляет в соответствующий GTP-U сегмент peer P-GW или обратно. Inner user packet обычно сохраняется, а outer endpoints и TEID относятся к новому сегменту.

   **Типичная ошибка:** Ожидать одинаковые outer headers на S1-U и S5/S8-U.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

331. Почему throughput bottleneck в SGW особенно болезнен?

   **Ответ:** Через узел может проходить трафик множества UE, поэтому общий packet-rate bottleneck влияет на многих одновременно. Особенно важны loss/queues по bearer и recovery под нагрузкой, чтобы агрегат не скрывал starvation.

   **Типичная ошибка:** Считать хороший средний aggregate rate доказательством хорошего обслуживания всех UE.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

332. Чем SGW отличается от обычного IP router?

   **Ответ:** Он выполняет IP transport forwarding вместе с EPS bearer/tunnel-state, mobility updates и idle-related procedures. Router lookup сам по себе не создаёт и не удаляет этот telecom context.

   **Типичная ошибка:** Считать GTP только лишним IP-заголовком без session semantics.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

333. Как tunneling overhead влияет на SGW performance?

   **Ответ:** Добавляются UDP/GTP и outer IP bytes, уменьшается полезная доля MTU и растут parsing/encapsulation расходы. Для GTP-U optional fields и outer IPv4/IPv6 размер различается, поэтому overhead не всегда одна постоянная величина.

   **Типичная ошибка:** Всегда вычитать ровно 36 байт без проверки outer family и GTP flags.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

334. Как SGW обрабатывает uplink и downlink traffic?

   **Ответ:** UL mapping связывает входной access tunnel с P-GW-side передачей, DL — core tunnel с текущим access path либо idle buffering. Направления могут иметь разные TEID, endpoints и состояние готовности.

   **Типичная ошибка:** Использовать только inner five-tuple вместо проверенного tunnel/bearer lookup.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

335. Как buffering downlink data связано с mobility/idle state?

   **Ответ:** Когда access user plane освобождён, входящие DL-данные могут запускать предусмотренные buffering и notification к MME. Восстановление доступа после paging позволяет продолжить передачу, но буфер и ожидание ограничены.

   **Типичная ошибка:** Считать idle UE навсегда недостижимым или хранить его данные бесконечно.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

336. Что происходит с данными при временном отсутствии UE?

   **Ответ:** Поведение зависит от причины недоступности и bearer/session-state: возможны buffering, notification, drop или дальнейший cleanup по процедуре. Ограничения времени/объёма не позволяют обещать хранение всех данных до возвращения UE.

   **Типичная ошибка:** Считать отсутствие UE поводом сразу удалить подписку и все PDN без протокольного основания.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

337. Как SGW участвует в paging-related data buffering?

   **Ответ:** При поступлении подходящих DL-данных в idle-сценарии S-GW уведомляет MME, который инициирует paging; S-GW обрабатывает buffer и дальнейшие указания. Сам S-GW не передаёт radio paging напрямую в эфир.

   **Типичная ошибка:** Рисовать paging как broadcast GTP-U-пакета от S-GW к UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

338. Какие counters и логи SGW полезны при troubleshooting?

   **Ответ:** Собирают GTP control transactions/causes/timeouts, tunnel lifecycle, DL notification/buffering и packet drop reasons по границам path. Нужны endpoint/TEID с временем жизни и данные NIC/queues, а не только inner IP.

   **Типичная ошибка:** Искать сессию только по TEID, не указывая peer и направление.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

339. Как packet loss в SGW отличить от radio packet loss?

   **Ответ:** Сопоставляют входные/выходные counters/captures S-GW с radio results и проверяют drops самого измерителя. Различают исчезновение до ingress, внутри обработки и после egress, сохраняя одинаковый packet identity/interval.

   **Типичная ошибка:** Выводить место потери только по end-to-end TCP retransmission.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

340. Как SGW issues проявляются для TCP/UDP flows?

   **Ответ:** TCP видит рост RTT, recovery и падение goodput, UDP — потери, jitter и нарушения deadline. Эти признаки неспецифичны, поэтому их связывают с S-GW drops/queues и соседними границами.

   **Типичная ошибка:** Считать UDP-потери доказательством отсутствия GTP-state без capture и counters.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

341. Как перегрузка SGW может повышать jitter?

   **Ответ:** Очереди и переменная скорость workers дают разное время ожидания пакетов, а burst processing меняет интервалы выдачи. Даже при небольшом среднем latency tail может резко вырасти перед drops.

   **Типичная ошибка:** Увеличивать ring buffers как универсальное решение jitter без оценки queue delay.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

342. Как SGW связан с lawful intercept/charging paths на концептуальном уровне?

   **Ответ:** S-GW может предоставлять предусмотренные usage/interception данные в соответствующей архитектуре, сохраняя связь с абонентским/session-state. Это не делает его единственной policy/charging или юридической точкой всей системы.

   **Типичная ошибка:** Путать техническую точку сбора с одинаковой правовой обязанностью всех deployments.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 33.107: Lawful interception architecture and functions](https://www.3gpp.org/ftp/Specs/archive/33_series/33.107/).

343. Какие проблемы state management возможны в SGW?

   **Ответ:** Возможны stale mappings, TEID reuse, несогласованный path switch, duplicate control operations и incomplete cleanup после отказа. Их предотвращают transaction validation, lifetime/version checks и согласованное обновление forwarding.

   **Типичная ошибка:** Применять delayed control response к новому bearer по совпавшему reused TEID.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

344. Как SGW масштабируется горизонтально или вертикально?

   **Ответ:** Вертикально увеличивают CPU/NIC/memory resources, горизонтально распределяют sessions и packet queues между экземплярами с корректным ownership. Уже созданные tunnels нельзя произвольно перенаправлять без соответствующего context и recovery.

   **Типичная ошибка:** Делать per-packet ECMP к stateless replicas без доступного session-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

345. Что важно понимать software engineer про SGW data path?

   **Ответ:** Нужно знать формат и bounds GTP-U, scope TEID, bearer mapping, MTU, buffer ownership и control-driven lifecycle. Производительность оценивают вместе с drops, latency и поведением при mobility/release.

   **Типичная ошибка:** Оптимизировать parsing прямым cast packed headers без проверки длины и alignment.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).


### Продвинутый уровень
346. Как uplink packet проходит через SGW по шагам?

   **Ответ:** S-GW принимает outer IP/UDP/GTP-U на S1-U, валидирует пакет и находит текущий bearer по tunnel endpoint/TEID. Затем user PDU пересылается в соответствующий S5/S8-U tunnel с новым outer header; ошибки lookup/MTU/queue учитываются отдельными counters.

   **Типичная ошибка:** Считать TEID достаточно прочитать без проверки version, message type, lengths и optional headers.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

347. Как downlink packet проходит через SGW по шагам?

   **Ответ:** Пакет с P-GW-side GTP-U проходит validation и bearer lookup, после чего передаётся в текущий access tunnel. При отсутствии access path выполняются предусмотренные idle/buffering/notification действия, а не произвольная отправка на старый eNodeB.

   **Типичная ошибка:** Считать последнее известное eNodeB endpoint всегда актуальным после release или handover.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

348. Как SGW хранит bearer/tunnel state?

   **Ответ:** Контекст связывает session/bearer identity, QoS-related данные и peer endpoints/TEID разных сегментов. Структура lookup и репликации выбирается реализацией, но scope IDs, lifecycle и согласованность обновлений обязательны.

   **Типичная ошибка:** Использовать один глобальный map только по TEID без endpoint context.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

349. Как SGW переключает user plane path во время mobility?

   **Ответ:** Control procedure предоставляет новые access-side параметры, после чего S-GW обновляет forwarding согласно состоянию перехода. Поздние пакеты и предусмотренные end/forwarding indications нужно учитывать отдельно от подтверждения control request.

   **Типичная ошибка:** Ожидать, что смена destination IP сама упорядочит все in-flight пакеты.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

350. Как packet forwarding в SGW сочетается с control-driven state changes?

   **Ответ:** Fast path читает согласованный snapshot/контекст, а control path создаёт, изменяет и удаляет его с безопасным lifetime. Обновление не должно оставлять работникам смесь старых и новых endpoint-полей или освобождённый объект.

   **Типичная ошибка:** Писать несколько связанных полей без синхронизации, надеясь на атомарность отдельных машинных слов.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

351. Какие race conditions возникают при handover и concurrent packet forwarding?

   **Ответ:** Packet worker может читать старый path во время switch или использовать context после delete; delayed message способен обновить уже reused ID. Нужны ownership/versioning, согласованный publish и безопасная reclamation.

   **Типичная ошибка:** Освобождать context сразу после удаления из lookup, пока reader ещё держит указатель.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

352. Как buffering и reordering handled in SGW-like systems?

   **Ответ:** Буферы ограничивают по ресурсу и времени, связывают с актуальным bearer и освобождают при завершении/отмене процедуры. S-GW не является универсальным reliable/reordering transport для всех user packets; специальные действия определяет сценарий.

   **Типичная ошибка:** Ожидать от любого S-GW полного исправления потерь и порядка GTP-U как от TCP.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

353. Как SGW design зависит от packet rate, session scale и tunnel scale?

   **Ответ:** Packet rate задаёт work на parsing/lookup/enqueue, session/tunnel scale — память и lookup locality, churn — скорость updates и cleanup. Проверяют эти измерения отдельно и в комбинации при нужном feature mix.

   **Типичная ошибка:** Считать один тест больших пакетов достаточным для всех traffic profiles.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

354. Какие dataplane optimization techniques важны для SGW implementation?

   **Ответ:** Помогают batching с ограничением ожидания, локальные memory pools, cache/NUMA locality, корректный queue steering и уменьшение общих locks. Их выбирают по профилю, сохраняя validation и tail latency.

   **Типичная ошибка:** Удалять bounds checks ради benchmark или ждать заполнения огромного batch без timeout.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

355. Как DPDK/user-space packet processing может быть полезен для SGW-like nodes?

   **Ответ:** DPDK предоставляет userspace packet I/O, mbuf pools и очереди, позволяя управлять fast path и locality. Цена — dedicated CPU, сложный ownership и интеграция с control/OAM; само наличие DPDK не гарантирует быстрый корректный S-GW.

   **Типичная ошибка:** Считать kernel bypass заменой session-state, congestion handling и правильного lifetime buffers.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

356. Какие сложности observability возникают в high-throughput tunneled dataplane?

   **Ответ:** Сплошной capture и per-packet logging могут менять performance и терять события. Используют counters, bounded/sampled traces и event triggers с tunnel context и контрольной оценкой drops измерителя.

   **Пример:**

   ```bash
   # Offline analysis of an existing lab capture with TShark.
   # TEID is local to an endpoint; correlate it with control-plane context.
   tshark -r s1u-lab.pcapng -Y 'gtp' -T fields     -e frame.time_epoch -e ip.src -e ip.dst -e gtp.teid
   ```

   **Типичная ошибка:** Принимать неполный sampled capture за точный список всех потерь.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [Wireshark: GTP display filter reference](https://www.wireshark.org/docs/dfref/g/gtp.html).

357. Как pinpoint packet drops inside SGW?

   **Ответ:** Разделяют NIC ingress, parser, lookup, policy/buffer, queue и egress counters по причинам; выборочно сопоставляют captures и packet identity. Учитывают reuse и feature path, чтобы один aggregate drop не скрывал разные проблемы.

   **Типичная ошибка:** Считать отсутствие пакета на одном capture доказательством drop в коде gateway.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

358. Как distinguish SGW overload from PGW/backhaul/radio bottleneck?

   **Ответ:** Измеряют очереди, drops и utilization на границах S-GW, P-GW, transport и radio и смотрят, где впервые теряется доставка. Контролируемая смена нагрузки и локальные tests подтверждают bottleneck.

   **Типичная ошибка:** Объявлять S-GW перегруженным только по end-to-end low throughput.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

359. Как SGW failover влияет на active sessions и packet continuity?

   **Ответ:** Для continuity нужны сохранённые tunnel/session mappings и корректное recovery control peers, а не только резервный IP endpoint. Возможны transient loss/reordering и необходимость переустановления контекстов; это проверяют fault tests.

   **Типичная ошибка:** Обещать zero-loss failover на основании одной перенастройки маршрута.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

360. Какие metrics нужно собирать на SGW уровне: packets, drops, tunnel count, latency, buffering?

   **Ответ:** Нужны RX/TX packets/bytes по интерфейсам и bearer, drop reasons, active tunnels/sessions, queue occupancy/age, latency и buffering. Дополняют control transaction rates/timeouts и resource/NIC metrics с lifecycle correlation.

   **Типичная ошибка:** Считать нулевые application errors достаточным признаком отсутствия потерь внутри узла.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

361. Как тестировать SGW under mobility-heavy load?

   **Ответ:** Создают частые path switches, S-GW relocation и concurrent user traffic с контролируемыми delays/duplicates/failures. Проверяют правильность destination, bounded losses/queues, cleanup и отсутствие stale-state после завершения нагрузки.

   **Типичная ошибка:** Проверять только скорость в неподвижном steady-state и переносить результат на mobility.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

362. Какие memory management проблемы опасны для SGW C/C++ code?

   **Ответ:** Опасны use-after-free при bearer delete, double-free mbuf, утечки на error path, переполнение длины и выход за buffer bounds. Явное ownership и согласованные pools/refcounts/lifetimes проверяют на многосегментных и некорректных пакетах.

   **Типичная ошибка:** Считать mbuf data всегда одним непрерывным буфером полной длины пакета.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

363. Какие lock/contention проблемы типичны для high-rate SGW software?

   **Ответ:** Общий tunnel map, глобальные counters, allocator и shared queues могут сериализовать packet workers и создавать cache contention. Шардирование и локальные counters помогают, но требуют корректного merge и state update.

   **Типичная ошибка:** Заменять mutex spinlock на том же перегруженном глобальном ресурсе без измерения contention.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

364. Какие design trade-offs между feature richness и fast path performance у SGW?

   **Ответ:** Дополнительные классификация, accounting, mirroring и security требуют CPU/memory и могут менять latency. Fast/slow path и offload позволяют управлять ценой, но обязаны сохранять одинаковую требуемую семантику и наблюдаемость.

   **Типичная ошибка:** Отключать обязательные проверки или учёт на fast path без корректной альтернативы.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

365. Какие SGW темы самые важные для interview telecom dataplane engineer?

   **Ответ:** Важны GTP-U parsing/TEID scope, bearer lifecycle, mobility path switch, MTU, queues, memory ownership и packet-rate scale. Senior разбор должен включать concurrent updates, recovery и измерение потерь без искажения hot path.

   **Типичная ошибка:** Ограничиваться рассказом про DPDK без знания EPS context и ошибок протокола.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).


### Инженерные вопросы
366. Почему SGW ближе по духу к high-performance packet processing node, чем к классическому control server?

   **Ответ:** Основная нагрузка связана с per-packet forwarding, tunnel lookup и очередями, что требует packet-rate и memory locality оптимизации. При этом state и control procedures остаются обязательными, особенно при mobility.

   **Типичная ошибка:** Считать S-GW исключительно dataplane без control-driven state changes.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

367. Какие dataplane engineering знания особенно полезны для понимания SGW?

   **Ответ:** Полезны packet parsing, MTU/fragmentation, NIC queues, batching, pools, cache/NUMA и concurrency. Для S-GW к ним добавляют EPS bearer/tunnel semantics и recovery, которых нет в обычном stateless forwarder.

   **Типичная ошибка:** Считать высокий synthetic forwarding rate полноценной проверкой S-GW.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

368. Почему SGW troubleshooting требует одновременно telecom и IP networking мышления?

   **Ответ:** Telecom-контекст объясняет допустимые endpoints и transitions, IP-наблюдение — underlay route, MTU, loss и queues. Без одного из этих уровней можно принять корректный protocol reject за сеть или transport drop за bearer bug.

   **Типичная ошибка:** Диагностировать GTP connectivity только наличием default IP route.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

369. Что должен глубоко понимать C/C++ engineer, если он работает с SGW-like software?

   **Ответ:** Нужны строгие bounds и endian handling, scope IDs, безопасный context/packet lifetime, concurrent path updates и overload behavior. Performance подтверждают по packet rate, drops и tail latency в реалистичных lifecycle сценариях.

   **Типичная ошибка:** Использовать benchmark-only shortcut в production parser или lifecycle.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

370. Какие anti-patterns наиболее опасны в дизайне SGW dataplane?

   **Ответ:** Опасны unbounded queues, malloc/free на каждом hot packet без анализа, общие locks, сырые stale pointers, unchecked headers и logging каждого пакета. Оптимизация должна сохранять корректность при malformed input, release и handover.

   **Типичная ошибка:** Считать отсутствие падения на happy path достаточным подтверждением безопасности dataplane.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).


---

## 6. PGW

### Базовый уровень
371. Что такое PGW?

   **Ответ:** PDN Gateway — gateway-функция EPC, завершающая PDN connection и связывающая её с внешней packet data network. Она сочетает forwarding с session, адресными и policy/charging responsibilities.

   **Типичная ошибка:** Считать P-GW только NAT без EPS session-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

372. Какова роль PGW в EPC?

   **Ответ:** Он обеспечивает выход в выбранную PDN, участвует в адресации UE, bearer management и policy/charging enforcement. В user-plane пути находится после S-GW со стороны внешней сети.

   **Типичная ошибка:** Приписывать P-GW RRC termination и radio scheduling.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

373. Почему PGW считается шлюзом во внешние packet data networks?

   **Ответ:** Через SGi P-GW соединяет EPS session с PDN и применяет связанные routing/policy правила. Внешняя PDN может быть Интернетом или частной сетью, поэтому gateway не обязательно имеет один публичный выход.

   **Типичная ошибка:** Считать PDN синонимом публичного Интернета.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

374. Как PGW связан с интернетом?

   **Ответ:** Для Internet APN пользовательские пакеты выходят через SGi в маршрутизируемую операторскую/внешнюю сеть, возможно через дополнительные service nodes. NAT может присутствовать, но не является обязательным определением P-GW.

   **Типичная ошибка:** Считать LTE Internet connectivity невозможной без NAT, в том числе для IPv6.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

375. Как PGW связан с SGW?

   **Ответ:** В GTP-based варианте они обмениваются control по S5/S8-C и пользовательскими данными по S5/S8-U. P-GW хранит свою сторону session/bearer-state и не заменяет access anchoring роль S-GW.

   **Типичная ошибка:** Путать S5/S8 с eNodeB↔MME S1-MME.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

376. Почему PGW важен для IP connectivity пользователя?

   **Ответ:** P-GW связывает адресацию и PDN-сессию с пользовательским маршрутом и policy. Поэтому UE IP сам по себе без корректного P-GW-state, route и bearer path не обеспечивает достижимость.

   **Типичная ошибка:** Проверять connectivity только наличием IP-адреса в UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

377. Кто обычно назначает IP-адрес UE в LTE data session?

   **Ответ:** P-GW отвечает за адресную конфигурацию в PDN connection, используя предусмотренные локальные, внешние или статические механизмы. Доставка конфигурации UE и детали IPv4/IPv6 зависят от PDN type и процедуры.

   **Типичная ошибка:** Считать, что MME всегда сам выбирает адрес из собственного DHCP pool.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

378. Как PGW связан с policy enforcement?

   **Ответ:** PCEF, обычно связанный с P-GW, применяет policy/charging rules к service data flows. Решения могут быть локальными или приходить от PCRF, с действиями по gating, QoS и charging.

   **Типичная ошибка:** Путать PCRF как decision function с обязательным forwarding узлом каждого пакета.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

379. Как PGW связан с charging?

   **Ответ:** Он собирает и применяет charging-related информацию о соответствующих flows/session и взаимодействует с charging функциями. Важны корректные rules, контекст и единицы учёта, а не просто число внешних байтов.

   **Типичная ошибка:** Считать одинаковый physical byte counter готовым начислением для любого сервиса.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

380. Почему PGW относится в основном к user plane, но участвует и в policy-related logic?

   **Ответ:** Пересылка и обработка пользовательских пакетов — существенная функция, но session control и policy задают, как её выполнять. Поэтому логический P-GW имеет и control responsibilities, которые могут разделяться в CUPS-архитектуре.

   **Типичная ошибка:** Называть P-GW полностью stateless из-за user-plane роли.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

381. Как отказ PGW влияет на пользователя?

   **Ответ:** Может нарушиться forwarding, адресная/PDN-связность и policy/charging-state, затрагивая множество UE. Непрерывность зависит от HA, replication и protocol recovery, а не только от живого S-GW.

   **Типичная ошибка:** Считать любой P-GW outage безвредным для уже созданных сессий.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

382. Какие KPI ассоциированы с PGW?

   **Ответ:** Полезны session/bearer setup success/latency, active contexts, address pool usage, throughput/drops/queues и policy/charging outcomes. Если есть NAT, отдельно следят за mappings/ports и allocation failures.

   **Типичная ошибка:** Считать один aggregate throughput достаточным показателем услуги PDN connectivity.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

383. Как PGW влияет на latency?

   **Ответ:** Он добавляет packet processing и queue delay, а policy/service chain может вносить дополнительные расходы. Под нагрузкой важны tail latency и packet loss с разрезами по feature path.

   **Типичная ошибка:** Считать задержку P-GW одинаковой для любого размера пакета и набора функций.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

384. Как PGW влияет на internet reachability?

   **Ответ:** Достижимость зависит от его session/routing, address/policy state и SGi path, а также внешних DNS/маршрутов/сервисов. Успешное создание bearer проверяет только часть этого пути.

   **Типичная ошибка:** Объявлять любой сайт недоступным из-за radio, не проверив SGi policy и маршрут.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

385. Какие функции PGW отличают его от SGW?

   **Ответ:** P-GW завершает PDN connection и связывает её с внешней PDN, адресацией и PCEF/policy функциями. S-GW в основном соединяет access и core segments и служит anchor для предусмотренной mobility.

   **Типичная ошибка:** Считать эти узлы разными названиями одного обязательного NAT-блока.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).


### Средний уровень
386. Как PGW участвует в выделении PDN connectivity?

   **Ответ:** При session setup принимает PDN/APN-related context, создаёт свою сторону сессии, согласует addressing/bearer параметры и rules. Ответ через core приводит к настройке полного пути, но отдельные этапы могут отказать.

   **Типичная ошибка:** Считать успешный локальный Create Session всей завершённой end-to-end связностью UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

387. Как PGW связан с APN?

   **Ответ:** APN участвует в выборе PDN/service context и соответствующего gateway, а P-GW применяет его настройки и subscription/policy. Один P-GW может поддерживать несколько APN с разными routing и адресными доменами.

   **Типичная ошибка:** Считать одному APN обязательно соответствующим один физический P-GW-сервер.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

388. Что такое APN в LTE?

   **Ответ:** Access Point Name — идентификатор требуемого packet data network/service access в EPS-процедурах. Его структура и выбор связаны с подпиской и core selection, а не с названием radio cell.

   **Типичная ошибка:** Путать APN с SSID Wi-Fi или адресом пользовательского веб-сервера.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

389. Почему APN важен для выбора PDN/service context?

   **Ответ:** Он помогает выбрать нужную PDN и её addressing, routing, policy и service profile. Разные APN могут давать разную достижимость и QoS при одинаковой radio connection.

   **Типичная ошибка:** Считать смену APN только изменением текстовой метки без влияния на core path.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

390. Как PGW применяет policy and charging rules?

   **Ответ:** Классифицирует packets в service data flows по rules и применяет gating, QoS/charging treatment с соответствующим bearer mapping. Правила имеют precedence и lifecycle; уже активный flow может требовать обновления состояния.

   **Типичная ошибка:** Считать любой новый rule независимым от порядка, существующего flow-state и cleanup.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

391. Как PGW обеспечивает NAT, firewalling или service chaining на концептуальном уровне?

   **Ответ:** Может включать такие функции локально или направлять пакеты через дополнительные узлы по policy и routing. NAT/firewall/service chain — deployment choices, их state и MTU/latency учитываются отдельно.

   **Типичная ошибка:** Считать NAT и DPI обязательной реализацией каждого стандартного P-GW.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

392. Как PGW связан с subscriber-specific service profile?

   **Ответ:** Subscription и policy определяют разрешённые PDN/services и QoS/charging параметры, которые связываются с session-state. При изменении profile нужна согласованная переоценка применимых rules, а не только обновление записи в базе.

   **Типичная ошибка:** Считать любые пользовательские APN/QoS пожелания авторизованными без проверки подписки.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

393. Почему PGW — важная точка для QoS enforcement?

   **Ответ:** Здесь классифицируются и ограничиваются flows перед или после radio/core пути, а policy связывается с EPS bearers. Но P-GW не управляет каждым PRB, поэтому end-to-end QoS требует согласования с access и transport.

   **Типичная ошибка:** Считать rate limiter P-GW гарантией минимальной скорости в перегруженной соте.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

394. Как PGW участвует в bearer management?

   **Ответ:** Создаёт/изменяет/удаляет свою сторону bearer и может инициировать нужные операции по policy с участием S-GW/MME/UE. Точные triggers и rollback определяются процедурой и состоянием.

   **Типичная ошибка:** Считать dedicated bearer локальной записью P-GW без обмена с остальными участниками.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

395. Как PGW влияет на uplink/downlink data path?

   **Ответ:** UL decapsulation, classification и policy ведут пакет к SGi; DL route/session lookup и filters связывают внешний packet с подходящим bearer/tunnel. Направления могут иметь разные checks и state, поэтому исправность одного не доказывает другое.

   **Типичная ошибка:** Проверять bidirectional connectivity только одним UL capture.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

396. Как проблемы в PGW могут выглядеть как general internet issue?

   **Ответ:** Неверные routes, адресные pools, policy/NAT или SGi failures проявляются как недоступность многих сайтов или части протоколов. Radio и registration могут при этом оставаться исправными.

   **Типичная ошибка:** Считать любой general Internet issue доказательством отказа DNS или внешнего провайдера.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

397. Как distinguish between PGW issue and external network issue?

   **Ответ:** Сопоставляют ingress/egress P-GW, session/policy-state и SGi-route с наблюдением внешнего пути. Если пакет корректно покинул gateway, дальнейшая потеря ещё требует проверки обратного маршрута и capture completeness.

   **Типичная ошибка:** Считать исходящий пакет достаточной проверкой успешной двусторонней доставки.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

398. Какие counters и логи PGW важны для troubleshooting?

   **Ответ:** Нужны GTP control causes/timeouts, session/address/tunnel lifecycle, rule decisions/drop reasons и ingress/egress counters. Добавляют queues, CPU, dependencies и NAT allocation/timeout metrics при наличии NAT.

   **Типичная ошибка:** Искать policy drop только в сетевом pcap без reason counters и rule context.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

399. Как PGW влияет на TCP/UDP applications?

   **Ответ:** Queues/drops и rules меняют RTT/goodput TCP, а UDP-приложения видят loss/jitter/deadline misses. Stateful NAT/filter timeouts могут давать selective failures независимо от radio SINR.

   **Типичная ошибка:** Называть все UDP failures radio loss без проверки session/policy state.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

400. Как packet filtering/policy на PGW может вызывать selective connectivity issues?

   **Ответ:** Правила могут разрешать одни flows и блокировать другие по адресам, портам, направлению и контексту. Проверяют classifier, precedence, state и return path; успех одного протокола не означает полную достижимость.

   **Типичная ошибка:** Использовать успешный ping как доказательство разрешения любого TCP/UDP-сервиса.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

401. Какие bottlenecks типичны для PGW: throughput, session scale, NAT state, policy lookup?

   **Ответ:** Ограничения включают packet rate, session/tunnel tables, address/NAT ports, classifier cost и queues. Разные profile дают разные bottlenecks, поэтому capacity описывают с workload и feature mix.

   **Типичная ошибка:** Считать максимальный bit rate предельной характеристикой любых policy-heavy нагрузок.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

402. Как PGW участвует в roaming scenarios?

   **Ответ:** В home-routed roaming P-GW остаётся в home network, а S8 соединяет его с visited serving side; предусмотрен также local breakout. Выбор влияет на маршрут, задержку, policy и charging.

   **Типичная ошибка:** Считать P-GW всегда физически находящимся в той стране, где UE сейчас подключён.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

403. Как PGW связан с charging data records?

   **Ответ:** Usage и session events служат входом для предусмотренных charging records и взаимодействий. Требуются связь с subscriber/session/rules, корректные окна и обработка restart, чтобы не терять и не дублировать учёт.

   **Типичная ошибка:** Суммировать повторно отправленные charging records как новые независимые расходы.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

404. Что должен понимать software engineer про PGW как edge service gateway?

   **Ответ:** Это subscriber-aware gateway с session/address/policy state и packet processing к внешнему домену. Для реализации важны и fast-path performance, и корректный lifecycle правил, tunnels и ресурсов.

   **Типичная ошибка:** Проектировать его как stateless router с добавленной строкой IMSI в лог.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

405. Какие функции PGW похожи на функции cloud edge gateways или service gateways?

   **Ответ:** Похожи routing/encapsulation, filtering, rate enforcement, NAT и stateful flow processing при соответствующих deployment features. Специфика P-GW — EPS session/bearer, mobile identity и telecom policy/charging integration.

   **Типичная ошибка:** Переносить cloud gateway API один к одному без EPS protocol semantics.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).


### Продвинутый уровень
406. Как PGW assigns UE IP and maintains session context?

   **Ответ:** P-GW создаёт PDN context и обеспечивает согласованную адресную конфигурацию по выбранному механизму, связывая адрес с PDN/APN, bearer и tunnel-state. Выделение и возврат ресурса должны учитывать retries, failures и recovery, особенно при перекрывающихся адресных доменах.

   **Типичная ошибка:** Использовать UE IP как глобально уникальный ключ без PDN/address-domain scope.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

407. Как policy enforcement materializes in actual packet handling inside PGW?

   **Ответ:** Packet classification выбирает применимые service flow rules, затем выполняются gating, QoS и charging actions и нужный bearer mapping. Обновление rules должно быть согласовано с существующим session/flow-state и порядком применения.

   **Типичная ошибка:** Считать наличие rule в management базе доказательством, что fast path уже использует его версию.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

408. Как deep packet awareness, charging и QoS mapping влияют на PGW complexity?

   **Ответ:** Нужно согласовать session identity, classifier, rule precedence, QoS и учёт на высокой скорости. Зашифрованный трафик ограничивает доступную прикладную информацию, а DPI не является обязательным универсальным способом классификации.

   **Типичная ошибка:** Ожидать точного знания содержания любого TLS/QUIC-потока только по port number.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

409. Какие fast path / slow path разделения полезны для PGW software?

   **Ответ:** Fast path выполняет частые валидированные packet actions, slow path — session/rule lifecycle и редкие control/error случаи. Между ними нужен безопасный publish state и ограниченный handoff, чтобы slow dependency не блокировала весь forwarding.

   **Типичная ошибка:** Считать slow path неограниченной очередью, куда можно отправить все неизвестные пакеты.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

410. Как implement scalable subscriber session table for PGW-like systems?

   **Ответ:** Разделяют session lookup keys с правильным scope, ownership и быстрые packet-facing данные от холодного control-state. Шардинг и versioned/immutable snapshots могут уменьшать contention, но reclamation и lifecycle остаются обязательными.

   **Типичная ошибка:** Ключевать таблицу только по inner IP при нескольких PDN с пересекающимися адресами.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

411. Как per-subscriber policy lookup влияет на dataplane performance?

   **Ответ:** Lookup добавляет memory accesses и branches, поэтому размер/структура rules и locality влияют на packet rate. Кэширование и compiled actions полезны при корректной invalidation на policy changes и session reuse.

   **Типичная ошибка:** Сохранять решение навсегда в flow cache после изменения или удаления subscriber policy.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

412. Как NAT inside PGW масштабируется?

   **Ответ:** Нужны public address/port capacity, таблицы mappings, timers, предсказуемое распределение нагрузки и учёт ограничений. Horizontal scale требует ownership и обратного steering; NAT может быть внешним к P-GW сервисом.

   **Типичная ошибка:** Проверять NAT-scale только по памяти, игнорируя исчерпание ports и корректность return path.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

413. Как observability строится в PGW при mix of session state, policy state and packet forwarding?

   **Ответ:** Связывают session/tunnel lifecycle, версии rules, packet counters/drop reasons и dependency events общими scoped IDs и временем. Для high-rate traffic используют bounded/sampled traces, сохраняя полноту counters и metadata измерения.

   **Типичная ошибка:** Считать один aggregate counter достаточным объяснением selective connectivity failure.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

414. Как distinguish packet drops due to policy from congestion or transport issues?

   **Ответ:** Проверяют rule/reason counters, очереди и ingress/egress captures с текущей policy version. Пропажа пакета сама по себе не показывает, был ли это намеренный deny, переполнение или drop захвата.

   **Типичная ошибка:** Объявлять любой отсутствующий egress packet policy deny без reason evidence.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

415. Как PGW failover impacts subscriber sessions?

   **Ответ:** Требуется восстановить session/address/tunnel, policy/charging и при наличии NAT flow-state с корректными timers. Сохранённый IP без этих mappings не гарантирует continuity; loss и повторная установка возможны по recovery-сценарию.

   **Типичная ошибка:** Считать перенесённый адрес gateway полной HA без синхронизации state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

416. Какие performance optimizations важны для PGW C/C++ implementation?

   **Ответ:** Помогают batch processing, local pools, table locality, partitioned ownership и минимизация shared hot-state. Оптимизацию проверяют при реальном classifier/charging mix и malformed/lifecycle нагрузке, сохраняя correctness.

   **Типичная ошибка:** Оптимизировать только пустой forwarding loop без включённых production rules.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

417. Как memory locality и cache efficiency влияют на PGW packet processing?

   **Ответ:** Раздельные горячие и холодные поля, компактные lookup structures и NUMA-local queues уменьшают memory stalls. Реальная польза зависит от working set и workload, поэтому её подтверждают profiling и tail metrics.

   **Типичная ошибка:** Объявлять структуру эффективной только по её компактному sizeof без паттерна доступа.

   **Источник:** [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

418. Какие concurrency problems typical for PGW stateful dataplane?

   **Ответ:** Concurrent rule change, bearer delete, NAT timeout и packet workers могут использовать несовместимые версии или освобождённые объекты. Нужны корректные lifetime и atomicity связанных обновлений, включая restart и ID reuse.

   **Типичная ошибка:** Менять active rule объект на месте без синхронизации со всеми читающими потоками.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

419. Как trace one subscriber’s packets and policy decisions through PGW?

   **Ответ:** Сначала восстанавливают session/address-domain и tunnel mappings, затем связывают ingress packet с classification, action/rule version и egress. При NAT дополнительно учитывают translation tuple и время жизни mapping.

   **Типичная ошибка:** Искать subscriber только по публичному адресу, который разделяют многие UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

420. Как test PGW for scale, policy correctness and failure handling?

   **Ответ:** Проверяют session/tunnel/churn scale и packets при разных размерах/rules, адресные/NAT limits, policy correctness и concurrent updates. Fault tests должны охватывать peer/dependency failures, duplicates, failover, cleanup и восстановление под нагрузкой.

   **Типичная ошибка:** Считать достижение peak Gbit/s подтверждением корректного charging и QoS.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

421. Какие interfaces/integrations чаще всего делают PGW operationally complex?

   **Ответ:** S5/S8 control/user, SGi routing/service chains, policy/charging dependencies и addressing integrations создают разные точки отказа. Реальная сложность зависит от deployment, поэтому проверяют контракт и state на конкретной границе.

   **Типичная ошибка:** Считать недоступную policy dependency обязательно неисправным packet parser.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

422. Как PGW-like functionality эволюционировала в 5G user plane concepts?

   **Ответ:** В 5GS session-control выделен в SMF, а forwarding/policy actions выполняют UPF под управлением control plane; PDU Session Anchor связывает с Data Network. Это концептуальная эволюция разделения ролей, а не переименование каждого P-GW целиком в UPF.

   **Типичная ошибка:** Приравнивать EPS bearer и 5G QoS flow один к одному без модели PDU session и QoS mapping.

   **Источник:** [3GPP TS 23.501: System architecture for the 5G System](https://www.etsi.org/deliver/etsi_ts/123500_123599/123501/18.08.00_60/ts_123501v180800p.pdf).

423. Какие темы PGW обычно спрашивают на interview high-performance networking engineer?

   **Ответ:** Важны scoped session lookup, GTP/MTU, classifier/rule lifecycle, pools/queues, cache/NUMA и concurrency. Для telecom дополняют PDN/bearer, policy/charging и recovery с измерением correctness под нагрузкой.

   **Типичная ошибка:** Говорить только о максимальной скорости NIC без анализа packet size и state churn.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

424. Что должен особенно хорошо понимать разработчик, если работает с PGW-like code?

   **Ответ:** Нужны protocol validation, session/address scope, safe state lifetime, policy precedence/invalidation, accounting semantics и packet ownership. Ограниченные ресурсы и диагностируемые failures важны наравне с fast path.

   **Типичная ошибка:** Игнорировать error/cleanup paths, если обычный user flow работает быстро.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

425. Какие design mistakes опасны при реализации PGW?

   **Ответ:** Опасны глобальные key без PDN scope, stale flow rules, unchecked parsing, unbounded queues и cleanup без синхронизации. Они дают cross-session errors, selective drops, leaks или corruption при churn и recovery.

   **Типичная ошибка:** Считать raw pointer на session безопасным после удаления её из общей таблицы.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).


### Инженерные вопросы
426. Почему PGW — это сочетание packet gateway, policy engine и subscriber-aware stateful system?

   **Ответ:** Gateway доставляет packets к PDN, session context связывает их с subscriber и bearer, policy/charging задаёт допустимые действия. Все три части взаимодействуют, поэтому packet path без state или policy-state без enforcement неполны.

   **Типичная ошибка:** Считать subscriber awareness просто дополнительным полем лога без влияния на обработку.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

427. Какие архитектурные аналогии между PGW и современными cloud gateways наиболее полезны?

   **Ответ:** Полезны аналогии со stateful edge gateways, control/data separation, rule compilation и tenant/address domains. Специфику EPS identity, PDN/bearer procedures и charging нельзя подменять общей cloud терминологией.

   **Типичная ошибка:** Предполагать, что смена deployment среды меняет внешний LTE protocol contract.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

428. Почему PGW troubleshooting требует видеть и subscriber state, и packet path?

   **Ответ:** Корректный маршрут не помогает при отсутствующей/неверной сессии, а правильная сессия не гарантирует route, MTU и return path. Нужны и lifecycle/rule evidence, и фактическая доставка на границах.

   **Типичная ошибка:** Выбирать только pcap или только subscriber database как достаточный источник полной причины.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

429. Какие знания из классического networking напрямую применимы к PGW, а какие — специфичны для LTE?

   **Ответ:** Применимы routing, MTU, IP/UDP, queues, filtering, NAT и observability. Специфичны EPS session/bearer identity, GTP lifecycle, mobility anchoring и PCC integrations; оба набора знаний нужны вместе.

   **Типичная ошибка:** Считать GTP-state обычным долгоживущим UDP flow без control semantics.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

430. Что нужно понимать про PGW до изучения QoS и bearer management?

   **Ответ:** Нужно понимать PDN connection/APN, addressing и роли PCEF/PCRF, classifiers и связь flow с bearer. Тогда QoS рассматривается как согласованные решения и enforcement, а не отдельная метка максимальной скорости.

   **Типичная ошибка:** Путать dedicated bearer с отдельным P-GW или новой адресной сессией.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).


---

## 7. Control plane vs User plane

### Базовый уровень
431. Что такое control plane в LTE?

   **Ответ:** Control plane — протоколы и функции, управляющие доступом, security, mobility, bearer и configuration. В LTE сюда относятся AS/NAS signaling и соответствующие core control procedures.

   **Типичная ошибка:** Определять plane только по тому, передаётся ли сообщение поверх IP.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

432. Что такое user plane в LTE?

   **Ответ:** User plane переносит пользовательские PDU по radio bearers и core path к PDN. В обычной active IP-связности путь проходит UE↔eNodeB↔S-GW↔P-GW, с соответствующими инкапсуляциями.

   **Типичная ошибка:** Включать MME в обязательную цепочку forwarding обычных user packets.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

433. Чем control plane отличается от user plane?

   **Ответ:** Control создаёт и меняет состояние обслуживания, user plane доставляет данные по этому состоянию. Они логически различаются, но могут разделять hardware/transport и имеют общие зависимости.

   **Типичная ошибка:** Считать separation обязательным отдельным физическим сервером и кабелем для каждой функции.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

434. Какие данные передаются по control plane?

   **Ответ:** Identity/security, registration, measurements, radio/session configuration, mobility и управление bearer/tunnels. Небольшие user data в предусмотренных CIoT control-plane optimizations — специальное исключение, которое нужно обозначать.

   **Типичная ошибка:** Делать вывод, что любой control-path payload обязательно только configuration или что исключение задаёт обычный LTE data path.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

435. Какие данные передаются по user plane?

   **Ответ:** Обычно это пользовательские IP-пакеты и соответствующие radio/core user PDU для приложений. HTTPS, RTP или DNS остаются пользовательским трафиком LTE, хотя внутри приложения могут иметь управляющее назначение.

   **Типичная ошибка:** Называть DNS LTE control plane только потому, что DNS управляет разрешением имён.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

436. Почему разделение plane важно?

   **Ответ:** Разные требования к состояниям, signaling rate и packet throughput позволяют отдельно проектировать функции и масштабирование. Но data path зависит от правильного control-state и обновлений, поэтому нужен согласованный lifecycle.

   **Типичная ошибка:** Считать planes полностью независимыми системами, где состояние не нужно коррелировать.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

437. Какие узлы EPC mainly control-plane?

   **Ответ:** MME — ключевая control-plane функция, HSS и PCRF предоставляют subscriber/security и policy control. Gateways тоже имеют control responsibilities, хотя активно участвуют в user forwarding.

   **Типичная ошибка:** Считать control plane исключительно одним MME без зависимостей.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

438. Какие узлы EPC mainly user-plane?

   **Ответ:** S-GW и P-GW обеспечивают core user-plane path и одновременно имеют связанную session/control логику. Их control/user части могут разделяться в предусмотренных архитектурных вариантах.

   **Типичная ошибка:** Считать логический gateway полностью лишённым control-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

439. Почему MME не форвардит user traffic?

   **Ответ:** В обычной EPS архитектуре MME управляет регистрацией, security и процедурами, а user path выделен gateways. Нужно помнить о специальных CIoT CP data режимах, не меняющих типичный S1-U path остальных UE.

   **Типичная ошибка:** Считать отсутствие обычного forwarding признаком, что отказ MME не влияет на пользовательскую услугу.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

440. Почему SGW/PGW форвардят user traffic?

   **Ответ:** Они являются tunnel/session endpoints и соединяют access segments с PDN path. Control protocol устанавливает mapping, по которому эти узлы затем пересылают пользовательские PDU.

   **Типичная ошибка:** Предполагать, что user packet на gateway обрабатывается как NAS-message.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

441. Как control plane участвует в attach?

   **Ответ:** NAS/RRC/S1AP и core exchanges проверяют доступ/security, создают session и согласуют bearer. Attach — control procedure, но её результат включает готовность пользовательского пути, которую проверяют отдельно.

   **Типичная ошибка:** Считать успешный decode Attach Request созданным bearer.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

442. Как user plane начинает работать после attach?

   **Ответ:** После настройки необходимых session, tunnels и radio bearer UE может передавать данные в соответствии со своим состоянием и scheduler. Позднейший idle release может убрать access resources, сохранив PDN/default bearer context.

   **Типичная ошибка:** Считать once-attached UE постоянно имеющим активный radio data path.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

443. Как control plane участвует в mobility?

   **Ответ:** Измерения и signaling готовят target, переносят контексты и обновляют serving/tunnel parameters. Точные роли eNodeB/MME/gateways зависят от X2/S1 и relocation сценария.

   **Типичная ошибка:** Называть mobility только control event без последующего изменения forwarding-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

444. Как user plane участвует в data delivery?

   **Ответ:** Передаёт user PDU через radio и tunnel segments, используя актуальные bearer endpoints и QoS treatment. На delivery влияют queues, retransmissions и transient path changes при mobility.

   **Типичная ошибка:** Считать успешный control response подтверждением доставки каждого in-flight user packet.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

445. Какие метрики различают проблемы control plane и user plane?

   **Ответ:** Control проверяют через procedural attempts/success/causes, timers и latency, user — через bytes/packets, loss, queues и goodput. Общие timestamps и context mappings связывают обе группы с инцидентом.

   **Типичная ошибка:** Считать один KPI attach success полным health check услуги передачи данных.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


### Средний уровень
446. Почему control plane load и user plane throughput масштабируются по-разному?

   **Ответ:** Control work определяется событиями и churn, user work — packet rate, bytes и actions над пакетом. Большой объём долгих flows может давать мало signaling, а массовые короткие подключения — обратную картину.

   **Типичная ошибка:** Планировать MME capacity по одному коэффициенту от Gbit/s трафика.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

447. Почему сеть может иметь рабочий control plane, но плохой user plane?

   **Ответ:** Session setup может пройти, но user tunnel mapping, MTU, forwarding, queues или external route остаются неисправными. Поэтому после control success нужны data-path проверки с обеих сторон.

   **Типичная ошибка:** Считать Attach Accept доказательством доступа к любому внешнему серверу.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

448. Почему сеть может иметь хороший user plane for existing sessions, но новые attach failing?

   **Ответ:** Установленный forwarding иногда продолжает работать без нового control decision на пакет, пока MME/dependencies перегружены или недоступны. Новые процедуры требуют их работы и могут отказать независимо от старых flows.

   **Типичная ошибка:** Проверять control availability только ongoing download одного UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

449. Как signaling storms влияют на control plane?

   **Ответ:** Они увеличивают pending transactions, state и timers, нагружают dependencies и вызывают повторные попытки. Нужны overload control и корректный backoff/cleanup, а не бесконечное накопление.

   **Типичная ошибка:** Разрешать всем peers мгновенно повторять запросы после timeout без ограничений.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

450. Как data traffic peaks влияют на user plane?

   **Ответ:** Возрастает packet work и queue occupancy, возможны drops и tail latency при достижении CPU/NIC/memory limits. Это может косвенно затронуть control при общих ресурсах, несмотря на логическое separation.

   **Типичная ошибка:** Считать planes физически изолированными только из-за разных протоколов.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

451. Какие процедуры в LTE чисто control-plane, а какие смешанные?

   **Ответ:** Authentication и configuration exchanges — control, forwarding пользовательских данных — user plane. Attach, handover и bearer management как end-to-end процессы включают control transitions и подготовку/изменение user path, поэтому термин «смешанные» относится к эффектам процедуры.

   **Типичная ошибка:** Классифицировать каждый этап handover одним общим названием без указания plane и протокола.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

452. Как bearers связывают control decisions и user forwarding?

   **Ответ:** Control определяет bearer identity, QoS и segment mappings, а forwarding применяет их к user PDU. Эта связь требует согласования не только core tunnels, но и radio bearer configuration.

   **Типичная ошибка:** Считать bearer только записью QoS без фактического маршрута и ресурсов.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

453. Как control-plane messages создают state для user-plane path?

   **Ответ:** Create/Modify/Delete и access configuration согласуют IDs, endpoints, QoS и lifecycle, по которым устанавливаются data tables. Успех должен учитывать требуемое применение state, а не только принятие сообщения transport socket.

   **Типичная ошибка:** Считать send() control request атомарной установкой удалённых forwarding tables.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

454. Как outages проявляются по-разному в этих planes?

   **Ответ:** Control outage чаще нарушает новые процедуры и mobility, user outage — packet delivery текущих сессий. На практике shared resources и зависимости могут затронуть обе части, а симптомы зависят от UE-state.

   **Типичная ошибка:** Обещать сохранность existing traffic при любом control-plane outage.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

455. Как debugging control plane отличается от debugging user plane?

   **Ответ:** Для control восстанавливают message/state/timer timeline и источник cause, для user — packet path, counters, queues и drops. Общая session correlation позволяет проверить, где состояние и фактическая доставка разошлись.

   **Типичная ошибка:** Отлаживать NAS-state только ping или user-plane loss только текстовыми attach logs.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

456. Какие инструменты/логи используются для control plane analysis?

   **Ответ:** Используют NAS/RRC/S1AP/X2AP/GTP-C/Diameter traces, state transitions, timers и cause counters. Capture дополняют internal logs, поскольку не всё состояние видно на wire и часть сигнализации защищена.

   **Типичная ошибка:** Считать отсутствие открытого NAS payload отсутствием NAS exchange.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.272: MME and SGSN interfaces based on Diameter](https://www.3gpp.org/ftp/Specs/archive/29_series/29.272/).

457. Какие tools/counters используются для user plane analysis?

   **Ответ:** Полезны captures на S1-U/S5/S8/SGi, tunnel/route tables, bytes/drops/queues и UE/application metrics. Проверяют offload, timestamp source и потери самого capture, прежде чем считать packet missing.

   **Типичная ошибка:** Считать один capture в середине пути достаточным доказательством end-to-end delivery.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [Wireshark: GTP display filter reference](https://www.wireshark.org/docs/dfref/g/gtp.html); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

458. Как packet captures различаются для S1-MME и S1-U?

   **Ответ:** На S1-MME декодируют S1AP/SCTP signaling и UE-context IDs, на S1-U — GTP-U/UDP с tunnel IDs и user PDU. Это разные captures и критерии корректности, даже если интерфейс underlay общий.

   **Типичная ошибка:** Использовать UDP port filter как полную проверку S1-MME.

   **Источник:** [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

459. Почему latency проблем user plane не всегда означает control plane issue?

   **Ответ:** Queues, packet processing, radio scheduling и retries могут увеличить delay при полностью успешных control procedures. Для причинной связи нужен timeline и показатели нагрузки/состояния соответствующего data path.

   **Типичная ошибка:** Считать любой RTT spike основанием перезапустить MME.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

460. Почему attach success rate не гарантирует good throughput?

   **Ответ:** Attach проверяет процедуру регистрации и установки нужного контекста, но не доступную ёмкость, текущий radio resource и внешние bottlenecks. Поэтому отдельно измеряют goodput, latency и loss при заданной нагрузке.

   **Типичная ошибка:** Выдавать высокий attach success за гарантию максимальной скорости всех UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

461. Как перегрузка MME и перегрузка SGW проявляются по-разному?

   **Ответ:** MME overload затрагивает NAS/S1/session workflows и их timers, S-GW overload — forwarding/queues и связанные control операции. Симптом зависит от состояния UE и того, какая функция узла перегружена.

   **Типичная ошибка:** Считать MME и S-GW failures одинаковым radio coverage fault.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

462. Как failures during handover могут затрагивать control и user planes differently?

   **Ответ:** Target preparation может не завершиться до изменения user path, а path switch/forwarding failure — нарушить данные после успешных control этапов. Нужно определить конкретную стадию и сохранённый source/target/core context.

   **Типичная ошибка:** Называть любой handover success proof непрерывной доставки всех user packets.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

463. Как software architecture обычно разделяет control и data processing?

   **Ответ:** Обычно signaling workflows и packet pipelines имеют разные workers/queues и data structures, координируясь context updates. Конкретная физическая декомпозиция выбирается реализацией и должна сохранять deadlines и ownership.

   **Типичная ошибка:** Считать разделение файлов или классов полным concurrency/lifetime дизайном.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

464. Какие C/C++ design patterns полезны отдельно для control-plane code и data-plane code?

   **Ответ:** Control удобны явные автоматы, transaction contexts и cancellation-aware timers, data path — bounded buffers, pools и immutable/read-optimized actions. В обоих нужны RAII/ownership и проверка внешнего ввода, а lock-free не универсально обязателен.

   **Типичная ошибка:** Использовать одинаковые blocking dependency calls в per-packet loop и control slow path.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

465. Что должен понимать engineer про границу между control и user plane?

   **Ответ:** Нужно знать, какое state создаёт control, когда оно становится применимым к packet processing и как удаляется при concurrent работе. Ошибка этой границы даёт stale tunnels, misrouting и use-after-free независимо от скорости каждого plane.

   **Типичная ошибка:** Считать control success достаточным без проверки актуальности dataplane tables.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


### Продвинутый уровень
466. Как control-plane state machines drive creation/modification/release of user-plane tunnels?

   **Ответ:** Автоматы согласуют session/bearer parameters и publish нужных mappings, затем разрешают передачу или изменяют путь. При release надо остановить новые обращения и безопасно завершить работу readers и pending packets по процедуре.

   **Типичная ошибка:** Считать удаление control-context доказательством, что packet workers больше им не пользуются.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

467. Как data plane continues while some control updates are in-flight?

   **Ответ:** Workers могут использовать текущую применимую версию state до безопасного переключения на новую. Нужны явные правила для creation/switch/delete, чтобы промежуточное состояние не давало неверный endpoint или чужой bearer.

   **Типичная ошибка:** Передавать данные по наполовину обновлённому набору tunnel fields.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

468. Какие race conditions между control updates и packet forwarding опасны?

   **Ответ:** Опасны lookup во время delete, handover-update после release, ID reuse и смешанные policy/path versions. Решения включают scoped keys, owner serialization, version checks и safe reclamation, выбранные под concurrency model.

   **Типичная ошибка:** Считать атомарный pointer решением синхронизации всего связанного контекста без lifetime protocol.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

469. Как обеспечить consistency между control plane state и dataplane tables?

   **Ответ:** Определяют owner и версию state, порядок применения, подтверждение и rollback/cleanup при ошибке. Инварианты проверяют на control и packet границах, включая retries и restart, чтобы локальный успех не маскировал remote failure.

   **Типичная ошибка:** Считать отсутствие error log доказательством совпадения control database и fast-path tables.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

470. Что лучше: synchronous or eventually consistent propagation of state to dataplane?

   **Ответ:** Выбор зависит от инварианта: разрешение доступа, security и teardown требуют строгой применимости, а часть telemetry допускает отставание. Асинхронный publish возможен при explicit acknowledgment/ordering и безопасном поведении до применения; одной общей модели для всех updates нет.

   **Типичная ошибка:** Объявлять eventual consistency допустимой для любого изменения bearer endpoint или разрешений.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

471. Как failover control-plane nodes affects established user plane?

   **Ответ:** Готовые forwarding entries иногда продолжают работать, но новые updates, mobility и recovery требуют доступного control-state. При смене owner необходимы согласование идентичностей, timers и session context, иначе continuity нарушится позже.

   **Типичная ошибка:** Гарантировать бесконечную работу user plane после потери всей control-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

472. Как telemetry for control plane and user plane should be correlated?

   **Ответ:** Сопоставляют UE/session/bearer и endpoint/TEID mappings с временем действия, procedural causes и packet metrics. Нужны согласованные clocks/окна и знание потерь/фильтрации сбора.

   **Типичная ошибка:** Соединять события по одному совпавшему IP без address-domain и временного контекста.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

473. Как packet-processing pipelines строятся отдельно от signaling-processing pipelines?

   **Ответ:** Signaling pipeline валидирует сообщение и state и запускает workflow/timers, packet pipeline выполняет bounded parsing/lookup/actions/enqueue. Обмен конфигурацией должен сохранять ownership и не блокировать всех packet workers на slow dependency.

   **Типичная ошибка:** Встраивать HSS/PCRF request в синхронную обработку каждого пакета.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

474. Как backpressure differently manifests in control-plane services and dataplane services?

   **Ответ:** Control ограничивает pending procedures и admission с предусмотренными reject/backoff, data — queues/rates и packet drops согласно policy. Оба должны удерживать ресурс и задержку в пределах, а unbounded buffering лишь откладывает отказ.

   **Типичная ошибка:** Понимать backpressure как бесконечное ожидание отправителя или накопление всего входного потока.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

475. Какие performance requirements fundamentally differ between control plane and user plane?

   **Ответ:** Control важны transactions/s, state scale и сроки процедур, user — packets/bytes per second и per-packet latency. Обе части имеют latency tails, correctness и recovery requirements, но workload и критические сроки различаются.

   **Типичная ошибка:** Считать control plane нечувствительным к задержкам, раз он не пересылает обычные user packets.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

476. Почему control plane часто более stateful и transaction-heavy?

   **Ответ:** Каждое сообщение связано с identity, текущей процедурой, peer responses и timers, а update влияет на distributed state. User plane тоже stateful, но обычно повторяет короткие actions по уже созданным mappings.

   **Типичная ошибка:** Считать user plane полностью stateless по определению separation.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

477. Почему user plane более throughput/latency sensitive?

   **Ответ:** Каждый пакет требует обработки и занимает queue/memory bandwidth, поэтому скорость и хвосты задержки непосредственно влияют на доставку. При этом control processing тоже должен укладываться в deadlines и не является «медленным по праву».

   **Типичная ошибка:** Оптимизировать packet throughput ценой неограниченного ожидания маленьких потоков.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

478. Как test methodology должна отличаться для control-plane и user-plane components?

   **Ответ:** Control тестируют sequences/states, timers, duplicates, peer errors и recovery, user — packet formats, forwarding, MTU, rates, queues и loss. Совместные тесты проверяют lifecycle updates под traffic и partial failure.

   **Типичная ошибка:** Считать раздельные успешные unit tests доказательством корректности concurrent bearer delete под packet load.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

479. Как security considerations differ for control and user planes?

   **Ответ:** Control требует защиты identity/authentication, state transitions, parsing и overload, user — правильной изоляции сессий, validation, policy и защиты данных. Plane name сам по себе не означает шифрование; конкретные security механизмы зависят от слоя и deployment.

   **Типичная ошибка:** Считать GTP-U или control/user separation механизмом confidentiality без отдельной защиты.

   **Источник:** [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

480. Как observability gaps между planes приводят к ложным выводам during incident analysis?

   **Ответ:** Attach success может скрыть недоставку данных, а user loss без timeline — неверный bearer или path switch. Без связей между state и packet evidence команда может обвинить не тот слой и усилить проблему настройками.

   **Типичная ошибка:** Локализовать root cause по метрикам только одного plane при общей session-проблеме.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

481. Какие примеры bugs affect control plane only, user plane only, or both?

   **Ответ:** Неверный NAS timer handling может нарушить новые процедуры, packet parser/queue bug — forwarding при живом control, а stale bearer mapping — обе части. Классификация зависит от проявления и shared dependencies, а не только файла кода.

   **Типичная ошибка:** Считать любой баг control-state неспособным привести к misrouting user data.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

482. Как correlate subscriber incident across NAS logs, bearer state and packet drops?

   **Ответ:** Восстанавливают NAS/UE-state timeline, PDN/bearer и tunnel mappings, затем связывают packet drops и queue/policy reasons в том же interval. Проверяют, что identity/ID принадлежит текущей сессии, а не старому reused контексту.

   **Типичная ошибка:** Считать совпавший TEID достаточным subscriber correlation без endpoint и времени.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

483. Какие interview вопросы чаще всего проверяют понимание separation of planes?

   **Ответ:** Полезно объяснить path пакета, роль MME, успех attach при плохом forwarding и работу старых flows при control outage. Сложные вопросы касаются publish/delete state, recovery и измерения места расхождения.

   **Типичная ошибка:** Отвечать только «control управляет, user передаёт» без конкретного message/data path.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

484. Почему понимание control vs user plane полезно даже вне LTE, например в SDN/cloud networking?

   **Ответ:** В SDN и cloud control также создаёт policy/route/session state, а dataplane применяет actions к packets. Общие вопросы — ownership, update ordering, scope IDs, availability и observability; LTE добавляет свои протоколы и mobility.

   **Типичная ошибка:** Считать архитектурную аналогию полной взаимозаменяемостью внешних интерфейсов.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

485. Какие архитектурные уроки из LTE plane separation наиболее универсальны?

   **Ответ:** Полезны разделение workload, явные state contracts, bounded resources и проверяемая связь intent с forwarding. Нужно проектировать update/failure lifecycle, а не только steady-state независимость компонентов.

   **Типичная ошибка:** Считать больше отдельных сервисов автоматическим улучшением надёжности.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


### Инженерные вопросы
486. Почему разделение control plane и user plane — один из главных архитектурных принципов LTE?

   **Ответ:** Разные функции регистрации/session control и high-rate packet delivery можно независимо размещать и масштабировать. Это упрощает часть архитектуры, но требует явных интерфейсов и согласованного состояния между plane.

   **Типичная ошибка:** Считать separation устранением всех общих точек отказа.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

487. Какие преимущества и сложности создаёт такое разделение?

   **Ответ:** Преимущества — специализация, capacity planning и fault localization; сложности — distributed state, update races и correlation. Польза реализуется, если transitions, overload и recovery спроектированы вместе с fast path.

   **Типичная ошибка:** Добавлять асинхронные границы без определения момента применения и подтверждения state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

488. Как plane separation влияет на scalability, troubleshooting и software design?

   **Ответ:** Позволяет отдельно тестировать signaling churn и packet capacity и искать границу неисправности. Software должен связывать их безопасным lifecycle API и telemetry, чтобы масштабирование одного plane не ломало другой.

   **Типичная ошибка:** Считать независимый deployment достаточным доказательством независимого scaling-state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

489. Что особенно важно знать про control/user plane C/C++ инженеру?

   **Ответ:** Нужно понимать context ownership, safe publish/reclamation, async transactions, parsing и bounded queues/deadlines. На практике именно concurrent setup/modify/delete под traffic часто проверяет correctness лучше, чем отдельный throughput benchmark.

   **Типичная ошибка:** Считать single-threaded happy path достаточным проектированием многопоточной платформы.

   **Источник:** [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

490. Как использовать этот концепт для объяснения LTE архитектуры на интервью?

   **Ответ:** Удобно пройти attach как создание state, затем путь user packet через eNodeB/gateways и handover как изменение path. Добавить пример: control setup успешен, но GTP-U route сломан — пользователь не получает данные.

   **Типичная ошибка:** Перечислять аббревиатуры без причинной связи процедур с forwarding.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


---

## 8. RRC (Radio Resource Control)

### Базовый уровень
491. Что такое RRC?

   **Ответ:** Radio Resource Control — AS control protocol между UE и eNodeB. Он управляет radio connection, configuration, measurements, mobility и AS security procedures.

   **Типичная ошибка:** Путать RRC с NAS, заканчивающимся в MME.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

492. Где в LTE находится RRC?

   **Ответ:** RRC находится на control стороне radio stack над PDCP/RLC/MAC/PHY, с логическими endpoint UE и eNodeB. Для доставки использует предусмотренные logical/signaling bearers и lower-layer procedures.

   **Типичная ошибка:** Считать RRC EPC-протоколом поверх S1-U.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

493. Какие основные задачи RRC?

   **Ответ:** Задачи включают broadcast system information, connection lifecycle, SRB/DRB configuration, measurement reporting, mobility и AS-security control. Точный набор зависит от версии и режима UE.

   **Типичная ошибка:** Сводить RRC только к handover или установлению user data bearer.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

494. Почему RRC относится к control plane?

   **Ответ:** Он переносит управление доступом и радиоконфигурацией, а не обычный поток пользовательских приложений. Передача NAS через RRC не делает eNodeB NAS-endpoint.

   **Типичная ошибка:** Считать перенос NAS доказательством слияния AS и NAS в один протокол.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

495. Что такое RRC connection?

   **Ответ:** Это установленный AS control context между UE и E-UTRAN с соответствующими radio resources и состоянием RRC_CONNECTED. Он отличается от NAS registration, PDN connection и TCP socket.

   **Типичная ошибка:** Называть открытый TCP socket признаком непрерывно активной RRC connection.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

496. Зачем UE устанавливает RRC connection?

   **Ответ:** Чтобы получить dedicated radio control и обслуживать connected-mode signaling/data согласно сценарию. В обычном доступе RRC establishment предшествует доставке initial NAS, но не заменяет core registration/session setup.

   **Типичная ошибка:** Считать RRC setup одновременно EPS authentication и выдачей UE IP.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

497. Какие основные состояния RRC нужно знать в LTE?

   **Ответ:** Базовые состояния LTE RRC — RRC_IDLE и RRC_CONNECTED. В некоторых поздних LTE/CIoT сценариях существуют suspend/resume механизмы; NR RRC_INACTIVE нельзя автоматически переносить в обычную LTE state model.

   **Типичная ошибка:** Приписывать LTE все три NR RRC-state без указания технологии и режима.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

498. Что такое RRC Idle?

   **Ответ:** В RRC_IDLE нет обычной активной RRC connection; UE выполняет reselection, читает system information и отслеживает paging. Регистрация и PDN/EPS bearer-state в core могут сохраняться.

   **Типичная ошибка:** Понимать idle как выключенный modem или удалённую подписку.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

499. Что такое RRC Connected?

   **Ответ:** В RRC_CONNECTED UE имеет connection/context в E-UTRAN и обслуживается по configured dedicated resources и network-controlled mobility. Это не означает постоянную передачу user data или непрерывный maximum PHY rate.

   **Типичная ошибка:** Считать connected равным занятости всех ресурсов каждым UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

500. Чем Idle отличается от Connected?

   **Ответ:** В idle UE самостоятельно выбирает/перевыбирает соту и отвечает на paging, а в connected сеть управляет radio configuration и mobility. Core state и энергопотребление нужно рассматривать отдельно от простого флага radio state.

   **Типичная ошибка:** Приравнивать любой переход в idle полному detach.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

501. Что такое RRC setup?

   **Ответ:** В обычном LTE establishment включает RRCConnectionRequest, RRCConnectionSetup и RRCConnectionSetupComplete с необходимой initial NAS доставкой. Random access и дальнейшие security/bearer шаги — связанные, но отдельные стадии.

   **Типичная ошибка:** Называть один RRCConnectionRequest завершённой connection setup процедурой.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

502. Что такое RRC release?

   **Ответ:** Сеть освобождает соответствующее radio connection состояние по RRC release, учитывая исходный сценарий и нижние слои. Это обычно позволяет UE перейти в idle при сохранённой EPS registration/PDN, а не обязательно выполняет detach.

   **Типичная ошибка:** Удалять все core session-state при любом RRCConnectionRelease.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

503. Почему RRC важен для mobility?

   **Ответ:** RRC задаёт measurements и radio reconfiguration для connected mobility, включая параметры перехода. Core может менять tunnel path отдельно, поэтому успешный RRC этап не доказывает полноту user-plane switch.

   **Типичная ошибка:** Считать handover только RRC-message без target admission и core path coordination.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

504. Почему RRC важен для measurements?

   **Ответ:** Через RRC сеть конфигурирует объекты, reporting conditions, фильтры и gaps для нужных измерений. Эти параметры определяют актуальность и объём данных для mobility/RRM.

   **Типичная ошибка:** Считать MeasurementReport произвольным периодическим полным сканированием всех частот UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

505. Почему RRC важен для bearer setup?

   **Ответ:** RRC конфигурирует signaling и data radio bearers и lower-layer параметры на UE/eNodeB стороне. EPS bearer setup требует также core и S1 coordination, не ограничиваясь radio reconfiguration.

   **Типичная ошибка:** Путать SRB setup с готовым PDN/default EPS bearer.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).


### Средний уровень
506. Какие процедуры выполняются по RRC при подключении UE?

   **Ответ:** После random access идут обычные establishment сообщения, затем по сценарию AS security, capability exchange и bearer/measurement reconfiguration. NAS authentication/session procedures логически отделены, хотя используют доставку через AS.

   **Типичная ошибка:** Считать каждую перечисленную optional процедуру обязательной при любом resume или re-establishment.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

507. Как RRC связан с NAS signaling?

   **Ответ:** RRC доставляет NAS между UE и access-сетью, а eNodeB передаёт NAS дальше к MME по S1AP. AS и NAS имеют разные endpoint, security и state machines.

   **Типичная ошибка:** Считать успешный RRC decode доказательством успешной NAS integrity/security проверки.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

508. Почему NAS часто переносится через RRC/AS?

   **Ответ:** У UE нет самостоятельного прямого физического канала до MME, поэтому NAS пользуется услугами radio access и core signaling transport. Это layering доставки, а не перенос NAS-логики в scheduler.

   **Типичная ошибка:** Называть NAS разновидностью RRC configuration message.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

509. Какие radio bearers конфигурируются через RRC?

   **Ответ:** RRC задаёт SRB для signaling и DRB для data, а также соответствующие PDCP/RLC/MAC configuration. SRB0/1/2 и DRB имеют разные назначения и применимость, которые проверяют по процедуре.

   **Типичная ошибка:** Считать все radio bearers одинаковыми reliable user IP channels.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/); [3GPP TS 36.323: PDCP protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.323/).

510. Как RRC управляет measurement reporting?

   **Ответ:** Конфигурирует measurement objects, report configurations, связи идентификаторов и параметры quantity/filtering/gaps. UE сообщает по выбранным условиям, а сеть интерпретирует report в текущем configuration context.

   **Типичная ошибка:** Обрабатывать measId без проверки, к какой актуальной конфигурации он относится.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

511. Как RRC участвует в handover preparation?

   **Ответ:** Measurement configuration и reports дают source данные для решения; inter-node preparation идёт по X2/S1. RRC передаёт UE mobility reconfiguration, но не заменяет обмен контекстом между source и target.

   **Типичная ошибка:** Называть всю target preparation одним RRC message напрямую между eNodeB.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

512. Как RRC участвует в security activation?

   **Ответ:** RRC SecurityModeCommand/Complete участвуют в активации AS-security с согласованными алгоритмами и ключевым контекстом. NAS Security Mode — отдельная процедура UE↔MME, хотя обе связаны EPS key hierarchy.

   **Типичная ошибка:** Путать RRC SecurityModeComplete с завершением NAS-security procedure.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

513. Как RRC влияет на battery life UE?

   **Ответ:** Radio state, DRX, measurement activity и частота transitions меняют работу приёмника и signaling. Конфигурацию выбирают под battery, latency и mobility, а не по одному inactivity timer.

   **Типичная ошибка:** Считать RRC_CONNECTED обязательным непрерывным приёмом без DRX.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

514. Почему idle/connected transitions важны для power efficiency?

   **Ответ:** Idle может экономить ресурс и энергию, но последующий доступ требует signaling и времени. Слишком частые transitions создают churn, а слишком долгое удержание connection расходует ресурсы; оптимум зависит от трафика и DRX.

   **Типичная ошибка:** Считать минимальный inactivity timer универсальной максимальной энергоэффективностью.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

515. Как paging связан с RRC Idle?

   **Ответ:** Idle UE отслеживает paging occasions по своей конфигурации, а по подходящему page инициирует предусмотренный доступ. Paging не требует заранее активной обычной dedicated RRC connection.

   **Типичная ошибка:** Отправлять paging только по старому SRB уже освобождённого idle UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

516. Как service request связан с переходом в Connected?

   **Ответ:** Обычный EPS service request использует radio connection для восстановления signaling/user access у зарегистрированного UE. Он отличается от нового attach и может включать дополнительные проверки по текущему context.

   **Типичная ошибка:** Считать любое idle-to-connected событие повторной полной регистрацией с новой PDN.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

517. Как measurement gaps и reports используются в RRC?

   **Ответ:** Gaps дают время измерять другие частоты/технологии при ограниченных RF-возможностях, а reports передают результаты по конфигурации. Gaps отнимают доступность ресурса и не обязательно нужны для каждого intra-frequency измерения.

   **Типичная ошибка:** Включать gaps всегда без анализа UE capabilities и целей измерения.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

518. Почему частые RRC transitions могут быть проблемой?

   **Ответ:** Расходуют signaling, CPU, radio access и иногда battery, увеличивают start latency коротких потоков. Но отсутствие transitions тоже имеет стоимость, поэтому нужна настройка под profile, а не полный запрет idle.

   **Типичная ошибка:** Держать всех UE connected бесконечно ради отсутствия setup latency.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

519. Что такое signaling load из-за RRC?

   **Ответ:** Это объём и частота RRC procedures/messages и связанная обработка, а не user data throughput. Малые bursts приложений могут создавать много transitions при небольшом полезном трафике.

   **Типичная ошибка:** Оценивать RRC-load только по объёму переданных UE мегабайт.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

520. Как RRC misconfiguration может ухудшать user experience?

   **Ответ:** Неверные measurement/timer/DRX/bearer параметры могут дать поздний mobility, лишние transitions, ожидание или нестабильность. Причину ищут по процедурам и состояниям с учётом radio и core, а не только по самому факту плохого UX.

   **Типичная ошибка:** Изменять сразу все RRC timers без baseline и проверяемой гипотезы.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

521. Какие counters и KPI важны для RRC analysis?

   **Ответ:** Нужны setup/re-establishment/reconfiguration attempts/success/causes/latency, release reasons, state occupancy и mobility/report rates. Counters дополняют radio access, core и ресурсными данными, учитывая определение каждой метрики.

   **Типичная ошибка:** Сравнивать RRC setup success и EPS attach success как один и тот же показатель.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

522. Какие типовые причины RRC setup failure?

   **Ответ:** Причины включают radio access/coverage/interference, decode/timer ошибки, congestion/admission, конфигурацию и неисправность state handling. Core reject после завершённого RRC setup — другая стадия, которую не следует смешивать.

   **Типичная ошибка:** Называть любой attach failure неудачным RRC setup.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

523. Как RRC problems manifest as attach or data issues?

   **Ответ:** Без подходящей RRC connection NAS может не дойти до MME, а без корректного DRB user data не передаётся несмотря на часть успешного core setup. Timeline показывает, где именно access procedure остановилась.

   **Типичная ошибка:** Считать доступность S1AP достаточной проверкой UE radio bearer.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

524. Как RRC влияет на handover success?

   **Ответ:** Корректные measurements, timing и mobility reconfiguration позволяют UE вовремя перейти на target. При плохом RF, target resources или core switch одна корректная RRC-message тоже не гарантирует end-to-end success.

   **Типичная ошибка:** Считать handover successful сразу после отправки команды UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

525. Что должен понимать software engineer про RRC state machine?

   **Ответ:** Нужно различать базовое RRC-state и pending procedures, учитывать transaction IDs, timers, lower-layer responses и release/re-establishment. Parsing и доставка сообщения не означают допустимый state transition.

   **Типичная ошибка:** Хранить весь RRC workflow одним флагом connected без текущей конфигурации и процедуры.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


### Продвинутый уровень
526. Как RRC coordinates radio bearer configuration, security, mobility and measurements?

   **Ответ:** RRC конфигурирует SRB/DRB и lower layers, security activation, measurement/reporting и mobility transitions по допустимым процедурам. Согласованность требует правильного порядка, подтверждений и cleanup, а часть core-state обновляется через отдельные интерфейсы.

   **Типичная ошибка:** Применять несогласованные bearer/security параметры локально, не проверив результат UE-процедуры.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

527. Как state machine RRC реализуется внутри eNodeB software?

   **Ответ:** Реализация хранит UE-state, pending procedure/transaction, активную конфигурацию и timers и обрабатывает сообщения/нижние события. Software-декомпозиция свободна, но внешние transitions, ошибки и сроки должны соответствовать спецификации.

   **Типичная ошибка:** Считать удобный внутренний enum полной заменой нормативным правилам обработки каждого события.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

528. Какие timers и retransmission logic критичны для RRC?

   **Ответ:** Важны establishment/re-establishment ожидания, radio link failure-related timers/counters и сроки pending procedures по выбранному release. Не все таймеры имеют network сторону или одинаковую retry semantics; точные условия берут из TS 36.331.

   **Типичная ошибка:** Включать повтор любого RRC-message по одному общему таймеру независимо от lower layers и процедуры.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

529. Какие race conditions возможны между measurement report, handover decision и release?

   **Ответ:** Report может относиться к старой measurement configuration или прийти одновременно с release/handover. Нужно проверять context/procedure applicability и отменять устаревшие decisions, не создавая вторую несовместимую mobility procedure.

   **Типичная ошибка:** Запускать handover по любому report после удаления или замены UE-context.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

530. Как RRC inactivity timers влияют на signaling load и latency?

   **Ответ:** Короткое удержание connection увеличивает establishment/service churn и start latency bursts, длинное — сохраняет resources и меняет battery cost. Эффект оценивают вместе с DRX и приложениями, не принимая inactivity tuning за одно универсальное число.

   **Типичная ошибка:** Уменьшать inactivity до минимума только ради освобождения контекстов.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

531. Какие компромиссы между battery efficiency и responsiveness закладываются через RRC?

   **Ответ:** Более редкая активность и idle могут экономить энергию, но увеличивать ожидание доступа или paging/DRX. Быстрый отклик требует доступности radio и state, поэтому настройки подбирают под сервисные latency и power требования.

   **Типичная ошибка:** Обещать одновременно минимальный расход энергии и немедленный ответ любого пакета без расхода ресурсов.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

532. Как RRC events коррелируют с QoS and scheduling behavior?

   **Ответ:** Bearer configuration задаёт доступные logical channels/QoS mapping, state transition — доступность ресурса, mobility — смену serving radio. Packet scheduling использует полученную конфигурацию, но не равен RRC-процедуре на каждый TTI.

   **Типичная ошибка:** Искать отдельное RRC-message для каждого MAC allocation.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

533. Как poor RRC tuning increases control-plane load across network?

   **Ответ:** Лишние release/reconnect и неудачные mobility/reconfiguration создают RRC, NAS/S1 и core work. Нужно проверять, какие transitions действительно запускают downstream процедуры: не каждое RRC-event одинаково нагружает EPC.

   **Типичная ошибка:** Механически умножать любой measurement report на полный attach-flow.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

534. Как trace RRC issue through radio logs and core logs?

   **Ответ:** Связывают UE radio IDs с S1AP/context и NAS/session timeline, включая configuration version, causes и timers. Проверяют первый неуспешный этап и фактическое применение lower-layer параметров, а не только последнюю core error.

   **Типичная ошибка:** Считать MME timeout первопричиной, если NAS не дошёл из-за более раннего RRC failure.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

535. Какие message parsing/state handling ошибки типичны для RRC implementations?

   **Ответ:** Типичны ошибки ASN.1 bounds/optional fields, unsupported combinations, transaction matching и обработка в неправильном состоянии. Нужны validation и определённая реакция на malformed/late/duplicate input, а не unchecked direct mutation контекста.

   **Типичная ошибка:** Считать корректный ASN.1 decode достаточной семантической проверкой сообщения.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

536. Почему robust state machine design критичен для RRC software?

   **Ответ:** RRC связывает timers, UE inputs, lower layers и core events, которые могут опаздывать и конфликтовать. Явные допустимые transitions предотвращают утечки, double configuration и использование удалённого context.

   **Типичная ошибка:** Обрабатывать неожиданное событие как успех, чтобы не прерывать happy path.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

537. Как unit/integration/system tests строятся для RRC procedures?

   **Ответ:** Unit проверяют parsing/validation и transitions/timers, integration — взаимодействие RLC/PDCP/MAC и S1, system — UE access, mobility и failures под нагрузкой. Важны негативные ветви, cleanup и deadline, а не только последовательность успешных сообщений.

   **Типичная ошибка:** Писать только тест отправки expected message без проверки состояния после timeout/release.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

538. Как моделировать abnormal UE behavior для тестов RRC?

   **Ответ:** В lab задают malformed/unsupported messages, duplicates, поздние ответы, исчезновение UE и конфликтующие transitions в допустимой тестовой модели. Проверяют bounds, protocol responses и отсутствие corruption других UE.

   **Типичная ошибка:** Проверять только случайные байты, не тестируя валидные сообщения в неправильном состоянии.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

539. Какие concurrency hazards есть в RRC handling on eNodeB?

   **Ответ:** Release/delete, timers, measurement callbacks и lower-layer completions могут одновременно менять UE-state. Сериализация по owner, cancellation/versioning и безопасный lifetime должны исключить stale callbacks и повторный cleanup.

   **Типичная ошибка:** Держать raw pointer на UE-context в отложенном timer callback без гарантии lifetime.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

540. Как observability для RRC должна быть спроектирована?

   **Ответ:** Логируют state/procedure/transaction, cause, timer events и configuration identity с radio/core correlation и timestamp. Sampling и bounded traces не должны скрывать сброс событий, а сбор не должен ломать radio deadlines.

   **Типичная ошибка:** Включать синхронный verbose dump всех UE в критическом processing loop.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

541. Какие метрики указывают на RRC storm or inefficient state management?

   **Ответ:** Подозрительны высокие establishment/release/re-establishment rates на UE, короткое connected time, retries/timeouts и рост setup latency. Их нормируют на попытки, UE и traffic pattern и проверяют конфигурацию, а не делают вывод из одного aggregate peak.

   **Типичная ошибка:** Называть любой рост RRC setup storm без учёта увеличения числа UE и активности.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

542. Как RRC behavior косвенно влияет на TCP session experience?

   **Ответ:** Idle-to-connected добавляет startup delay, failures и mobility могут давать pauses/loss, а retries — RTT variation. Долгоживущий TCP socket может переживать множество RRC transitions, поэтому transport-state и radio-state различают.

   **Типичная ошибка:** Закрывать TCP socket при каждом обычном RRC idle transition без сервисной причины.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

543. Какие interview темы по RRC особенно важны для telecom software engineer?

   **Ответ:** Основные темы — endpoints/state, establishment/release/re-establishment, measurement/mobility, AS-security и SRB/DRB. Для software добавляют transaction/timer handling, concurrency, parsing и correlation с core.

   **Типичная ошибка:** Объяснять RRC только расшифровкой названия без walkthrough одного failure.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 33.401: EPS security architecture](https://www.3gpp.org/ftp/Specs/archive/33_series/33.401/).

544. Что нужно понимать глубже всего в RRC: states, procedures, timers или measurements?

   **Ответ:** Сначала нужны states и процедуры как причинная модель, затем timers и measurements как условия transitions и mobility. Для реализации все эти части обязательны, а глубину отдельных DSP-метрик определяет роль.

   **Типичная ошибка:** Заучивать числа timers без знания запуска, остановки и реакции на expiry.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

545. Какие anti-patterns опасны при реализации RRC-related software?

   **Ответ:** Опасны неявный глобальный state, unbounded pending work, callbacks без lifetime, unchecked ASN.1 и игнорирование failure/duplicate ветвей. Для real-time части особенно вредны blocking calls и logging, меняющие timing.

   **Типичная ошибка:** Считать редкий timeout без cleanup приемлемым, потому что UE обычно переподключается.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


### Инженерные вопросы
546. Почему RRC — одна из центральных control-plane тем в LTE?

   **Ответ:** Через RRC сеть конфигурирует и поддерживает AS-связь, измерения, security и mobility UE. Он соединяет control решения с реальной radio configuration, не подменяя NAS/core процедуры.

   **Типичная ошибка:** Считать RRC единственным control protocol всей LTE-системы.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

547. Как RRC связывает radio management, mobility и signalling efficiency?

   **Ответ:** Measurement rules дают данные для RRM/mobility, reconfiguration меняет radio resources, а state/DRX/timers влияют на signalling и power. Эти решения нужно согласовывать с QoS и ресурсом, поскольку улучшение одной стороны имеет цену.

   **Типичная ошибка:** Настраивать mobility, DRX и inactivity независимо без проверки совместного поведения.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

548. Почему проблемы RRC могут выглядеть как “общие сетевые проблемы”?

   **Ответ:** Неуспешный доступ, потерянная reconfiguration или лишние transitions выглядят как connection timeout, pause или низкая скорость приложения. Для локализации нужен radio/core timeline, поскольку такой же UX дают и другие причины.

   **Типичная ошибка:** Диагностировать RRC по одной клиентской ошибке «network unavailable».

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

549. Что должен понимать C/C++ engineer про RRC даже без углубления в PHY?

   **Ответ:** Нужно знать ownership UE-state, процедуру/transaction/timers, связь с lower layers и S1/NAS и безопасный lifecycle контекста. Это позволяет корректно реализовать signaling и диагностику без глубокого PHY-DSP.

   **Типичная ошибка:** Считать невозможность писать PHY оправданием игнорирования radio timing и states.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

550. Как лучше объяснять RRC на интервью: через состояния, процедуры или practical symptoms?

   **Ответ:** Начать с UE↔eNodeB и Idle/Connected, затем пройти setup, reconfiguration и release и связать их с NAS и user path. Практический пример задержки первого пакета после idle показывает, зачем states и timers важны приложению.

   **Типичная ошибка:** Перечислять все message names до объяснения назначения и конечных точек протокола.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).


---

## 9. MAC layer scheduling

### Базовый уровень
551. Что такое MAC layer в LTE?

   **Ответ:** Medium Access Control — слой между RLC и PHY, выполняющий multiplexing, HARQ и предусмотренные access/scheduling-related функции. В eNodeB scheduler выбирает допустимое использование radio resources.

   **Типичная ошибка:** Считать MAC только Ethernet-подобной адресацией по MAC-address.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

552. Какова роль MAC в radio stack LTE?

   **Ответ:** Он связывает logical-channel данные RLC с transport blocks PHY, обслуживает HARQ и control elements. Scheduling учитывает информацию очередей и радио в рамках physical/protocol constraints.

   **Типичная ошибка:** Считать MAC независимым от timing PHY и конфигурации RRC.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

553. Что такое scheduling в LTE?

   **Ответ:** Scheduling — выбор UE, ресурсов и параметров передач в конкретных radio occasions. Включает новые данные, повторы и необходимые управляющие действия, а не только разделение одинаковых временных долей.

   **Типичная ошибка:** Считать allocation равной успешной доставке выделенного числа битов.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

554. Почему scheduler нужен в беспроводной системе?

   **Ответ:** Несколько UE и сервисов делят конечные radio resources с разным качеством и требованиями. Координация нужна для эффективной передачи, QoS, fairness и соблюдения протокольных ограничений.

   **Типичная ошибка:** Разрешать каждому UE произвольно использовать всю UL-полосу при готовых данных.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

555. Кто принимает решение о выделении radio resources?

   **Ответ:** В обычном LTE eNodeB управляет UL/DL scheduling; UE исполняет grants и предусмотренные MAC-процедуры. Есть стандартизованные persistent/access механизмы, поэтому формулировка не означает отдельный новый grant на любой возможный случай.

   **Типичная ошибка:** Считать MME per-TTI radio scheduler.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

556. Что именно распределяет scheduler?

   **Ответ:** Он назначает time/frequency resources, UE и transmission parameters, включая MCS и связанные spatial/HARQ решения в рамках конфигурации. Control-channel capacity и UE capabilities ограничивают допустимые назначения.

   **Типичная ошибка:** Считать распределяемым ресурсом только PRB без PDCCH, мощности и timing.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

557. Почему radio resources ограничены?

   **Ответ:** Конечны время, спектр, мощность, пространственные степени свободы и вычисления. Помехи и overhead уменьшают полезно доступную часть, даже если логически connected UE может быть много.

   **Типичная ошибка:** Считать число UE-контекстов эквивалентом одновременной radio capacity.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

558. Что такое uplink scheduling?

   **Ответ:** eNodeB назначает UE допустимую UL transmission opportunity и параметры, используя requests/reports и состояние канала. UE формирует передачу и выполняет logical channel prioritization в пределах grants и конфигурации.

   **Типичная ошибка:** Предполагать, что eNodeB видит точный полный UL-buffer каждого UE без report delay и granularity.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

559. Что такое downlink scheduling?

   **Ответ:** eNodeB выбирает данные из своих DL-очередей, UE, ресурсы и режим, формирует передачу и контролирует HARQ. Выбор ограничен QoS, channel state, timing и control resource.

   **Типичная ошибка:** Считать поступление пакета с S1-U немедленным DL allocation независимо от очередей.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

560. Почему scheduler должен учитывать качество канала?

   **Ответ:** Канал определяет число надёжно передаваемых битов, слои и вероятность повторов. Устаревшая или завышенная оценка даёт ошибки, заниженная — неиспользованную ёмкость.

   **Типичная ошибка:** Планировать всех UE одним фиксированным высоким MCS независимо от feedback.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

561. Почему scheduler должен учитывать QoS?

   **Ответ:** Сервисы имеют разные delay/loss/rate требования, которые bearer/QoS отображает на radio обслуживание. Максимальная сумма битов без приоритетов может сделать часть услуг непригодной.

   **Типичная ошибка:** Считать самый высокий CQI достаточным единственным критерием scheduling.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

562. Почему scheduler должен учитывать fairness?

   **Ответ:** Без fairness пользователи с плохим каналом или непостоянной очередью могут долго не получать ресурс. Определение справедливости выбирают по политике и QoS, а не обязательно по равной скорости.

   **Типичная ошибка:** Считать fairness всегда одинаковым количеством PRB всем UE.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

563. Как scheduling влияет на throughput?

   **Ответ:** Назначения определяют долю ресурса, MCS/слои и цену повторов для UE. Высокая сумма allocated bits не гарантирует high goodput, если блоки часто не декодируются.

   **Типичная ошибка:** Оценивать scheduler только номинальным transport block size без результатов HARQ.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

564. Как scheduling влияет на latency?

   **Ответ:** Пакет ждёт обслуживания в очереди и подходящего radio occasion; policy и нагрузка определяют это ожидание. HARQ и processing добавляют задержку, поэтому анализируют полный queue-to-delivery timeline.

   **Типичная ошибка:** Считать scheduler latency только временем выполнения его функции на CPU.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

565. Как scheduling влияет на cell capacity?

   **Ответ:** Он выбирает, насколько эффективно расходуются ресурс, control opportunities и мощность. Max aggregate throughput может конфликтовать с cell-edge service, QoS и fairness, поэтому capacity оценивают под заданной политикой.

   **Типичная ошибка:** Объявлять лабораторный пик с одним хорошим UE ёмкостью для любого профиля соты.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).


### Средний уровень
566. Какие факторы учитывает LTE scheduler?

   **Ответ:** Учитываются queues/BSR, CQI/CSI, QoS, HARQ, прошлое обслуживание, power/capabilities UE и radio/control ограничения. Конкретная policy — реализация, а стандарт задаёт допустимую процедуру и параметры.

   **Типичная ошибка:** Считать один опубликованный scheduler algorithm обязательной реализацией 3GPP.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

567. Как scheduler использует CQI/качество канала?

   **Ответ:** Использует feedback и результаты декодирования для оценки возможной скорости/ошибки и выбора параметров. Значения CQI интерпретируют с их конфигурацией, задержкой и reference conditions.

   **Типичная ошибка:** Считать CQI точным throughput в Мбит/с без allocation и code-rate context.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

568. Почему “лучший канал” не всегда должен получать все ресурсы?

   **Ответ:** Нужно обслуживать требования остальных, предотвращать starvation и обеспечивать допустимую задержку. Передача только лучшему мгновенному каналу может повысить сумму битов, но нарушить utility и SLA.

   **Типичная ошибка:** Приравнивать максимальную сумму битов единственному определению качества scheduler.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

569. Что такое proportional fair scheduling на концептуальном уровне?

   **Ответ:** Proportional fair выбирает пользователя по относительной выгоде мгновенной скорости к его историческому обслуживанию в простой модели. Это помогает балансировать efficiency и fairness, но реальный алгоритм добавляет QoS/constraints и имеет параметры усреднения.

   **Типичная ошибка:** Считать PF гарантией одинаковой скорости каждого UE или полного соблюдения любого deadline.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

570. Чем round-robin отличается от channel-aware scheduling?

   **Ответ:** Round-robin следует очередности/квоте, channel-aware учитывает качество и ожидаемую эффективность. Первый проще, второй может лучше использовать хорошие состояния, но требует актуального CSI и контроля starvation.

   **Типичная ошибка:** Считать round-robin автоматически справедливым по пользовательскому goodput.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

571. Какие trade-offs между fairness и total throughput?

   **Ответ:** Ресурс слабому каналу может доставлять меньше битов, но быть необходимым для fairness/QoS. Оптимум задаётся utility и admission, а не универсальным выбором полного равенства или полного max-rate.

   **Типичная ошибка:** Считать уменьшение aggregate peak при улучшении edge service ошибкой реализации.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

572. Как scheduler учитывает delay-sensitive traffic?

   **Ответ:** Учитывает возраст/срочность данных и приоритет bearer, резервирует или выбирает своевременные ресурсы в пределах политики. Наличие delay-sensitive class не создаёт ресурс сверх capacity, поэтому нужны admission и bounded queues.

   **Типичная ошибка:** Обещать deadline при любой перегрузке только из-за высокой priority метки.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

573. Как scheduler учитывает GBR vs non-GBR traffic?

   **Ответ:** GBR требует учитывать согласованные rate-параметры и admission, non-GBR обслуживается по применимой политике и ограничениям. ARP относится к admission/pre-emption, а не универсальному per-packet priority; QCI влияет на packet treatment.

   **Типичная ошибка:** Использовать ARP как единственную очередь приоритета каждого пакета вместо QCI и scheduler policy.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

574. Как scheduler взаимодействует с HARQ?

   **Ответ:** Scheduler знает процессы, ACK/NACK и допустимые timings и выделяет ресурсы нужным новым передачам/повторам. MAC и PHY должны согласовать transport block и redundancy-related параметры по процедуре.

   **Типичная ошибка:** Планировать новый несвязанный transport block как повтор старого HARQ-процесса.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

575. Почему retransmissions имеют приоритетные последствия для scheduling?

   **Ответ:** Повтор связан с уже незавершённым блоком, timing и задержкой, поэтому влияет на доступный ресурс новых данных. Конкретный priority policy не равен безусловному правилу «любой retry всегда выше всего».

   **Типичная ошибка:** Разрешать бесконечным повторам полностью starving новые срочные flows без лимитов и QoS-анализа.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

576. Как buffer occupancy влияет на scheduling?

   **Ответ:** Нужны данные в очереди и оценка спроса, чтобы выделение не простаивало. В DL очередь локальна, UL оценивается через BSR/SR и другие события с задержкой/дискретностью.

   **Типичная ошибка:** Считать ненулевой BSR точным числом пользовательских bytes в момент будущей передачи.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

577. Что такое uplink grant?

   **Ответ:** Uplink grant сообщает UE допустимое назначение для UL-передачи с соответствующими resource/transport параметрами. Dynamic и persistent механизмы имеют разные signaling и lifetime правила.

   **Типичная ошибка:** Считать grant бессрочным разрешением UE передавать в любые последующие интервалы.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

578. Почему uplink требует координации ресурсов?

   **Ответ:** UE делят общий ресурс и ограничены power/timing/capabilities, а eNodeB должен предсказуемо принимать назначения. Без согласования передачи конфликтуют и не образуют требуемую multiuser структуру.

   **Типичная ошибка:** Считать UL независимым от base-station scheduling только потому, что данные генерирует UE.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

579. Как scheduler влияет на jitter real-time traffic?

   **Ответ:** Разная длительность ожидания, чередование выделений и HARQ меняют интервалы доставки. Для real-time важны хвосты и deadline misses, а не только средняя полоса bearer.

   **Типичная ошибка:** Оценивать jitter по средней доле PRB без времени расположения allocations.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

580. Как scheduler влияет на packet delay budget?

   **Ответ:** Ожидание и обработка на радиоучастке расходуют часть общего допустимого времени пакета. QoS packet delay budget интерпретируют по определению стандарта и границе UE↔PCEF, а не как гарантированное время всего Internet round trip.

   **Типичная ошибка:** Использовать QCI PDB как максимальный end-to-end RTT любого сервера.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

581. Как congestion в cell проявляется через scheduler decisions?

   **Ответ:** Растёт очередь и competing demand, уменьшается доля UE, могут срабатывать admission/drop и приоритизация. Высокая utilization сама не доказывает плохой scheduler: нужно смотреть delivered QoS и эффективность при заданной нагрузке.

   **Типичная ошибка:** Считать любой 100% PRB usage неисправностью без учёта полезного спроса.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

582. Как плохой radio quality у части пользователей влияет на общую эффективность cell?

   **Ответ:** Низкий MCS и повторы требуют больше ресурса на доставленный бит, уменьшая доступный ресурс остальным при обслуживании их спроса. Степень зависит от policy, доли таких UE и доступных diversity/MIMO механизмов.

   **Типичная ошибка:** Считать один cell-edge UE автоматически снижающим rate всех до своего MCS.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

583. Почему scheduler важен для QoS enforcement?

   **Ответ:** Именно здесь QoS превращается в реальные моменты и объёмы передачи по общему radio resource. Core rules без radio decisions и admission не обеспечат требуемого обслуживания.

   **Типичная ошибка:** Считать настроенный QoS profile доказательством фактического соблюдения latency/rate.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

584. Какие KPI помогают оценивать качество scheduling?

   **Ответ:** Нужны goodput и allocated resources, queue delay/deadline misses, BLER/HARQ, utilization и fairness по UE/QoS. Также измеряют CPU execution/jitter и пропуски radio deadlines, чтобы отличить policy от реализации.

   **Типичная ошибка:** Оценивать scheduler одним aggregate Mbit/s без per-UE distribution и timing.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

585. Что должен понимать software engineer про scheduler logic?

   **Ответ:** Он реализует ограниченную по времени policy при неполном/устаревающем state и множестве constraints. Для software важны валидность allocations, детерминированный критический путь и диагностируемое решение без unbounded work.

   **Типичная ошибка:** Считать scheduler обычной сортировкой списка по CQI, не проверяя QoS/HARQ/PHY constraints.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).


### Продвинутый уровень
586. Как scheduler balances CQI, QoS class, HARQ state, buffer status and fairness?

   **Ответ:** Сначала соблюдает обязательные radio/HARQ/capability ограничения, затем policy ранжирует допустимые передачи по QoS, срочности, спросу и utility. Оптимальная формула зависит от цели; feedback и история обслуживания нужны для адаптации.

   **Типичная ошибка:** Смешивать hard constraints и мягкие веса так, что высокий score разрешает недопустимую PHY-передачу.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

587. Какие эвристики обычно лежат в основе LTE scheduler?

   **Ответ:** Применяют round-robin, max-rate, proportional-fair и priority/deadline-aware комбинации, с учётом HARQ и constraints. Это примеры policy, а не обязательный одинаковый алгоритм всех vendor LTE.

   **Типичная ошибка:** Называть собственную эвристику частью стандартизованного wire protocol.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

588. Почему scheduling — это near-real-time optimization problem?

   **Ответ:** Доступные каналы и очереди меняются, а решение нужно к конкретной radio occasion за ограниченное время. Полный глобальный поиск часто непрактичен, поэтому выбирают быстрые допустимые приближения с проверяемым качеством.

   **Типичная ошибка:** Считать точное вычисление офлайн-оптимума пригодным без оценки execution deadline.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

589. Какие hard timing constraints есть у MAC scheduler?

   **Ответ:** Назначения должны быть готовы к предусмотренному timing PHY и HARQ, с учётом FDD/TDD и функций release. Обычный LTE scheduling связан с субкадровой сеткой 1 мс, но это не универсальный budget ровно 1 мс на любую software функцию.

   **Типичная ошибка:** Переносить один фиксированный processing budget на все каналы, конфигурации и архитектуры.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

590. Как scheduler decisions impact TCP throughput and latency distribution?

   **Ответ:** Доля ресурса и pattern доставки влияют на goodput, ACK timing и очереди, а ошибки/повторы — на RTT и recovery. TCP также меняет offered load, поэтому radio и transport образуют обратную связь.

   **Типичная ошибка:** Считать transport congestion window независимым от bursty radio delivery.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

591. Как scheduler can unintentionally starve edge users or low-priority flows?

   **Ответ:** Max-rate policy выбирает постоянно хорошие каналы, а ошибочная priority/history логика может бесконечно отодвигать остальных. Нужны измерение waiting/service distributions и явные fairness/QoS ограничения.

   **Типичная ошибка:** Считать высокий aggregate throughput доказательством отсутствия starvation.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

592. Как cell-edge users влияют на spectral efficiency cell-wide?

   **Ответ:** Для их полезного бита часто нужны больше resources и retries, поэтому обслуживание влияет на общую эффективность. Исключение edge UE увеличит статистический peak, но нарушит покрытие и fairness, поэтому метрику оценивают под задачей.

   **Типичная ошибка:** Улучшать cell average rate простым исключением трудных пользователей из denominator.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

593. Как semi-persistent scheduling conceptually helps for real-time traffic?

   **Ответ:** Semi-persistent scheduling уменьшает частоту dynamic control для подходящего периодического трафика через заранее согласованные назначения. Он требует правил activation/release и адаптации к реальному спросу; это не бесконечная безусловная резервация.

   **Типичная ошибка:** Считать SPS устранением всех grant/control процедур и HARQ.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

594. Как link adaptation tightly coupled with scheduling?

   **Ответ:** Выделенный ресурс, мощность, MCS и число слоёв совместно определяют transport block и успешность. Решение о скорости без allocation или allocation без актуальной channel/error оценки может быть неэффективно.

   **Типичная ошибка:** Выбирать MCS и ресурсы как полностью независимые оптимизации без проверки итогового блока.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

595. Какие race/timing bugs опасны в scheduler implementation?

   **Ответ:** Опасны stale HARQ/UE-state, двойное allocation, missed processing deadline и use-after-release. Нужны согласованный snapshot входов, проверка допустимости результата и lifecycle, не только хорошая policy в single-thread test.

   **Типичная ошибка:** Использовать устаревший context, если его ID уже присвоен другому UE.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

596. Как multi-core software architecture влияет на scheduler determinism?

   **Ответ:** Параллелизм помогает throughput, но handoff, shared locks, cache и OS scheduling добавляют jitter. Декомпозицию выбирают по зависимости данных и deadlines, измеряя worst-case-like tails под реалистичной конкуренцией.

   **Типичная ошибка:** Считать увеличение числа threads автоматическим улучшением determinism.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

597. Какие data structures полезны для fast scheduling decisions?

   **Ответ:** Полезны bounded queues, per-UE/per-bearer state, компактные resource bitmaps и структуры ранжирования с предсказуемым work. Конкретный контейнер выбирают по размеру workload и update pattern, избегая unbounded allocation в критическом пути.

   **Типичная ошибка:** Использовать сложный generic container только по асимптотике без cache и timing измерений.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

598. Как test correctness and performance of MAC scheduler?

   **Ответ:** Проверяют protocol/resource invariants, QoS/fairness outcomes и processing deadline на replay/synthetic и integration сценариях. Нужны плохие каналы, HARQ, overload, UE churn и configuration changes, а не только суммарная скорость.

   **Типичная ошибка:** Считать успешный schedule без пересечения PRB полной проверкой QoS и HARQ correctness.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

599. Какие synthetic traffic profiles нужны для scheduler testing?

   **Ответ:** Нужны saturated и sparse flows, периодический real-time, bursts, UL/DL asymmetry, разные QoS и edge/good-channel UE. Добавляют mobility/CSI delay и HARQ/failure profiles, сохраняя воспроизводимость.

   **Типичная ошибка:** Тестировать только full-buffer одинаковые UE и переносить вывод на короткие latency-sensitive flows.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

600. Как measure scheduler fairness vs QoS compliance?

   **Ответ:** Измеряют распределение delivered rate, waiting time и deadline compliance по UE/QoS при заданном спросе. Индекс Jain может описать равномерность выбранных rates, но не заменяет проверку SLA и не определяет fairness-policy сам по себе.

   **Пример:**

   ```cpp
   #include <array>
   #include <iostream>
   int main() {
       constexpr std::array<double, 3> rates{10, 10, 20};
       double sum = 0, squares = 0;
       for (double rate : rates) { sum += rate; squares += rate * rate; }
       if (squares == 0) { std::cout << "No service: fairness undefined\n"; return 0; }
       std::cout << (sum * sum) / (rates.size() * squares) << '\n';
       // Equal-demand rate equality only; this does not verify QoS compliance.
   }
   ```

   **Типичная ошибка:** Считать одинаковую скорость доказательством соблюдения разных QoS требований.

   **Источник:** [Jain, Chiu, Hawe: A Quantitative Measure of Fairness](https://www.cs.wustl.edu/~jain/papers/fairness.htm); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

601. Как diagnose poor user throughput: scheduler issue or radio issue?

   **Ответ:** Сопоставляют allocated resources и queue demand с CQI/MCS, BLER/HARQ и capabilities. Мало выделений при хорошем канале направляет к policy/load, много неуспешных передач — к quality/adaptation, но причины могут сочетаться.

   **Типичная ошибка:** Считать каждый low throughput при хорошем RSRP scheduler bug.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

602. Как diagnose latency spikes caused by scheduling?

   **Ответ:** Смотрят queue arrival/dequeue, доступные radio occasions, allocations, HARQ и processing timestamps в одном timeline. Так различают ожидание policy, отсутствие разрешённого ресурса и software deadline miss.

   **Типичная ошибка:** Делать вывод из одного среднего scheduler execution time без queue timeline.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

603. Как observability for scheduler should be designed?

   **Ответ:** Нужны агрегированные и выборочные per-UE decision reasons, allocation, queue age, channel inputs и HARQ outcome с radio time. Logging должен иметь bounded overhead и event-loss counters, чтобы не создавать исследуемые pauses.

   **Типичная ошибка:** Синхронно печатать все candidate scores каждого TTI в production hot path.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

604. Какие counters per-UE/per-QCI/per-cell наиболее полезны?

   **Ответ:** Полезны demand/served bytes, resources, waiting/deadline drops, MCS/BLER/HARQ и starvation indicators по нужным scope. На cell уровне добавляют control/resource utilization и processing deadlines, учитывая cardinality и lifetime UE IDs.

   **Типичная ошибка:** Суммировать per-UE gauges после ухода UE как текущую cell загрузку.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

605. Какие interview вопросы чаще всего проверяют реальное понимание MAC scheduling?

   **Ответ:** Хорошие вопросы связывают CQI с rate, fairness с edge UE, QoS с deadlines, UL BSR с неполным знанием и HARQ с resource budget. Практический разбор должен объяснить, какие метрики отличат policy trade-off от implementation bug.

   **Типичная ошибка:** Отвечать одним названием PF без описания ограничений и результатов.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).


### Инженерные вопросы
606. Почему scheduler — одно из главных “сердец” eNodeB?

   **Ответ:** Он превращает radio capabilities, queues и QoS в конкретные передачи многим UE. Его решения непосредственно определяют полезное использование ограниченного эфира и время доставки.

   **Типичная ошибка:** Считать scheduler необязательной оптимизацией поверх готового независимого radio канала каждого UE.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

607. Какие компромиссы scheduler решает каждую миллисекунду?

   **Ответ:** В обычной субкадровой работе балансируются новые данные/повторы, efficiency/fairness, latency/rate и power/control constraints. Некоторые решения имеют иной срок или persistent nature, поэтому «каждую миллисекунду» — полезное упрощение, а не описание всех функций.

   **Типичная ошибка:** Игнорировать FDD/TDD/HARQ timing, считая каждый TTI полностью независимым.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

608. Почему scheduling напрямую влияет на восприятие сети пользователем?

   **Ответ:** Ожидание, bitrate, jitter и успешность доставки определяют загрузки, звонки и интерактивность. Даже одинаковая средняя полоса с другим временным распределением ресурса даёт разный UX.

   **Типичная ошибка:** Оптимизировать только средний throughput и игнорировать tail delay для real-time.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

609. Что должен хорошо понимать C/C++ инженер про scheduler, даже без углубления в PHY?

   **Ответ:** Нужно понимать inputs/state, hard constraints, bounded execution, queue ownership и результаты HARQ. PHY-детали могут иметь разную глубину, но некорректный timing/allocation нельзя исправить только быстрым C++ кодом.

   **Типичная ошибка:** Считать latency scheduler измеримой только числом инструкций его главной функции.

   **Источник:** [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

610. Как лучше объяснить MAC scheduling на интервью через fairness, QoS и throughput trade-offs?

   **Ответ:** Начать с конечного ресурса и разных UE, затем сравнить равную очередь, max-rate и PF/QoS-aware policy. Пример слабого срочного UE показывает цену fairness и deadline для суммарной скорости; затем назвать измерения goodput, queue delay и failures.

   **Типичная ошибка:** Представлять fairness, QoS и throughput как всегда одновременно максимизируемые независимые показатели.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).


---

## 10. Handover: базовые концепции

### Базовый уровень
611. Что такое handover в LTE?

   **Ответ:** Handover — управляемый переход connected UE на другую обслуживающую radio cell с переносом/изменением необходимого контекста и пути. Его отличают от idle-mode cell reselection и полного повторного attach.

   **Типичная ошибка:** Называть любую смену PCI на idle UE handover.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

612. Зачем нужен handover?

   **Ответ:** Он поддерживает обслуживание при изменении radio conditions и может перераспределять нагрузку. Переход должен сохранить нужную session continuity при допустимых interruption/loss.

   **Типичная ошибка:** Считать единственной целью всегда выбрать максимальный мгновенный RSRP.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

613. Когда handover происходит?

   **Ответ:** Когда network decision по measurements, thresholds, load и policy выбирает доступный target и запускает процедуру. Физическое движение не обязательно: нагрузка или изменение среды могут вызвать переход неподвижного UE.

   **Типичная ошибка:** Считать каждый шаг пользователя обязательным handover.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

614. Почему mobility требует handover?

   **Ответ:** При выходе из зоны пригодного serving radio текущая сота перестаёт обеспечивать service, а другая может продолжить его. Handover меняет serving access с контекстом вместо полного независимого подключения заново.

   **Типичная ошибка:** Считать mobility обязательной сменой IP адреса и TCP соединения.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

615. Что произойдёт без handover при движении UE?

   **Ответ:** По мере ухудшения serving channel растут ошибки и повторы, затем возможен radio link failure/outage. Если UE остаётся в хорошем покрытии той же соты, движение само по себе не требует перехода.

   **Типичная ошибка:** Утверждать, что без handover связь сразу исчезает при любом движении.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

616. Какие основные типы handover есть в LTE на высоком уровне?

   **Ответ:** Различают intra/inter-eNodeB, intra/inter-frequency и inter-RAT, X2/S1-based и варианты со сменой MME/S-GW. Это независимые оси классификации, а не один список взаимоисключающих типов.

   **Типичная ошибка:** Считать inter-frequency и X2 handover взаимно исключающими понятиями.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

617. Что такое intra-LTE handover?

   **Ответ:** Это переход между LTE/E-UTRA сотами, в отличие от inter-RAT. Он может быть intra/inter-frequency и внутри одного или между разными eNodeB.

   **Типичная ошибка:** Считать intra-LTE обязательно intra-eNodeB.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

618. Что такое inter-frequency handover?

   **Ответ:** Переход на соту другой рабочей частоты/несущей в соответствующей RAT. Для подготовки могут понадобиться measurements на другой частоте и gaps с учётом возможностей UE.

   **Типичная ошибка:** Считать inter-frequency обязательной сменой core или PDN connection.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

619. Что такое intra-frequency handover?

   **Ответ:** Переход между сотами на одной частоте. Он всё равно требует target context, radio execution и применимого path handling; одинаковая частота не делает его бесплатным.

   **Типичная ошибка:** Считать intra-frequency отсутствием реального handover и signaling.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

620. Что такое inter-RAT handover?

   **Ответ:** Это переход между radio access technologies, например E-UTRA и UTRA/GERAN, в поддерживаемом сценарии. Процедуры, bearer/QoS mapping и continuity зависят от технологий и core interworking.

   **Типичная ошибка:** Путать handover с redirection или fallback, не проверив фактическую процедуру.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

621. Чем X2 handover отличается от S1 handover?

   **Ответ:** X2-based использует прямую source↔target preparation, S1-based — координацию через MME. В обоих случаях нужны radio execution и соответствующая core/user-path согласованность.

   **Типичная ошибка:** Считать S1 handover user-plane передачей через MME.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

622. Почему handover важен для непрерывности сервиса?

   **Ответ:** Позволяет сменить radio access без обязательного разрушения всей PDN/app связности. Continuity не означает нулевую задержку и потерю каждого пакета, поэтому измеряют interruption и service outcomes.

   **Типичная ошибка:** Обещать zero-loss по факту поддержки handover.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

623. Как handover влияет на голос/видео/данные?

   **Ответ:** Короткая пауза или loss может вызвать прерывание real-time, адаптацию видео и TCP recovery. Последствия зависят от duration, buffering, QoS и состояния приложения, а не только результата control procedure.

   **Типичная ошибка:** Считать успешный handover неощутимым для любого приложения.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

624. Какие KPI связаны с handover?

   **Ответ:** Нужны attempts/success по стадиям и типам, preparation/execution failures, interruption, RLF и ping-pong, плюс packet/QoS impact. Все rates требуют чётких denominators и временных критериев.

   **Типичная ошибка:** Считать общий success rate достаточным описанием mobility качества.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

625. Что такое handover success rate?

   **Ответ:** Это доля успешных handover среди соответствующих попыток по заданной методике. Нужно указать стадию успеха, тип и исключения, иначе preparation и execution показатели несопоставимы.

   **Типичная ошибка:** Складывать успехи и попытки разных процедур или считать отправленную command завершением.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).


### Средний уровень
626. Какие события/метрики запускают handover decision?

   **Ответ:** Используются configured measurements/events с фильтрами, hysteresis/TTT, а также load, policy и target availability. Event report даёт вход для network decision, а не безусловную команду UE переключиться.

   **Типичная ошибка:** Считать достижение threshold автоматическим мгновенным завершённым handover.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

627. Как measurement reports от UE участвуют в handover?

   **Ответ:** UE сообщает результаты по measurement configuration, source оценивает target и условия перехода. Reports имеют задержку и scope, поэтому не заменяют текущую проверку контекста и возможности target admission.

   **Типичная ошибка:** Обрабатывать report от старой конфигурации как свежий полный обзор всех соседей.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

628. Почему handover обычно network-controlled?

   **Ответ:** Connected mobility требует согласовать target resources, AS/security/context и user path, чем управляет сеть. UE выполняет measurements и command, а idle reselection имеет другую модель ответственности.

   **Типичная ошибка:** Приписывать UE произвольный connected handover без network preparation.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

629. Что такое handover preparation?

   **Ответ:** Это согласование с target, проверка admission и подготовка необходимого контекста и radio parameters. X2/S1 определяют путь координации, а отказ подготовки отличается от неудачи UE execution.

   **Типичная ошибка:** Считать preparation законченной до подтверждения target readiness.

   **Источник:** [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

630. Что такое handover execution?

   **Ответ:** UE применяет mobility command, переходит к target и выполняет нужный access/synchronization и completion signaling. Таймеры и отказ при недостижимости target определяются процедурой.

   **Типичная ошибка:** Считать отправку source command доказательством успешного radio перехода.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

631. Что такое handover completion?

   **Ответ:** В зависимости от методики это подтверждение UE на target и завершение нужных path/context действий. Для end-to-end результата проверяют также user-plane delivery и cleanup source, различая success boundaries.

   **Типичная ошибка:** Использовать один неопределённый флаг done для всех radio и core стадий.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

632. Чем X2 handover обычно быстрее S1 handover?

   **Ответ:** Прямая preparation может уменьшить signaling hops и coordination delay по сравнению с relay через MME. Это типичное преимущество, а не гарантия: transport, load и сценарий могут дать другой результат.

   **Типичная ошибка:** Обещать фиксированное ускорение любого X2 handover без измерения условий.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

633. Почему X2 handover уменьшает нагрузку на core?

   **Ответ:** Часть source↔target context/preparation обменивается напрямую, не требуя core relay для каждого шага этой стадии. Но path switch и другие core updates остаются по процедуре.

   **Типичная ошибка:** Считать X2 способом полностью исключить MME и gateways из всей mobility.

   **Источник:** [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

634. Когда приходится использовать S1 handover?

   **Ответ:** Когда подходящий X2 путь/процедура недоступны или сценарий требует S1 coordination согласно архитектуре. Нужны target/core support и корректный context, а не просто маршрут вместо X2.

   **Типичная ошибка:** Считать S1 fallback возможным без проверки поддерживаемого сценария и peer state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

635. Как handover влияет на user plane path?

   **Ответ:** Access tunnel path переключается на target, возможны forwarding/buffering и при relocation изменения core segments. In-flight data старого и нового пути требуют предусмотренного sequencing/cleanup.

   **Типичная ошибка:** Считать сохранённый UE IP признаком неизменных GTP endpoints.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

636. Как handover влияет на control plane state?

   **Ответ:** Меняются serving radio/context IDs, target/source responsibilities и нужные MME/gateway mappings. Security и bearer context обновляют по процедуре, поэтому mobility не сводится к одной таблице cell ID.

   **Типичная ошибка:** Считать source context бессрочно валидным после target completion.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

637. Что такое handover interruption time?

   **Ответ:** Это пауза в возможности пользовательской radio/data передачи при переходе, измеренная по определённым событиям или packet delivery. Методика должна указать direction и границы, поскольку control duration и interruption различаются.

   **Типичная ошибка:** Приравнивать полное время preparation к пользовательскому interruption.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

638. Почему низкое interruption time важно?

   **Ответ:** Меньше нарушаются deadlines, playout и transport feedback, поэтому real-time и interactive сервисы лучше переносят переход. Низкое interruption не заменяет проверки loss, reordering и success.

   **Типичная ошибка:** Считать короткую паузу достаточной, если после неё user path не работает.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

639. Что такое too early handover?

   **Ответ:** Переход запускается до устойчивой пригодности target и может закончиться быстрым отказом/возвратом. Конкретное operational определение too early использует события и временные окна MRO, а не только низкий target RSRP.

   **Типичная ошибка:** Называть любой быстрый следующий handover too early без анализа причины и маршрута.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

640. Что такое too late handover?

   **Ответ:** Сеть не успевает перевести UE до серьёзного ухудшения serving связи, что может привести к RLF. Причины включают thresholds/TTT, measurement delay, target preparation и скорость движения.

   **Типичная ошибка:** Считать единственной причиной слишком большой time-to-trigger.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

641. Что такое ping-pong handover?

   **Ответ:** Быстрые обратные переходы между сотами по принятому временному критерию. Иногда возврат оправдан реальным движением или нагрузкой, поэтому сам паттерн требует контекста перед признанием нежелательным.

   **Типичная ошибка:** Считать любой повторный визит в прежнюю соту ошибкой tuning.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

642. Почему ping-pong handovers вредны?

   **Ответ:** Создают signaling, interruption, context churn и возможные losses без устойчивого выигрыша. Но меры подавления не должны задерживать необходимые переходы до radio failure.

   **Типичная ошибка:** Запретить обратный handover жёстко на длительное время независимо от качества канала.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

643. Как hysteresis и time-to-trigger помогают?

   **Ответ:** Hysteresis требует дополнительного запаса условия, TTT — его удержания во времени, снижая реакцию на краткие флуктуации. Избыточные значения могут сделать handover поздним, поэтому их подбирают по сценарию.

   **Типичная ошибка:** Максимально увеличивать оба параметра ради минимального числа переходов.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

644. Как плохая настройка thresholds ухудшает mobility?

   **Ответ:** Слишком агрессивные thresholds дают неустойчивые переходы, слишком осторожные — late handover и outage. Важно совместное действие filtering, offsets, hysteresis, TTT и neighbor config.

   **Типичная ошибка:** Менять один threshold без проверки остальных условий и target coverage.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

645. Как handover проблемы проявляются для TCP и UDP приложений?

   **Ответ:** TCP может пережить RTT spike/loss и снизить скорость, UDP real-time — потерять или получить поздние packets. Пакетные симптомы связывают с конкретными handover стадиями и радио/core outcomes.

   **Типичная ошибка:** Считать любой TCP retransmission во время движения доказательством failure всей handover процедуры.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

646. Какие причины handover failure наиболее типичны?

   **Ответ:** Возможны target admission/preparation reject, radio execution/RLF, transport/context errors и path switch failure. Разделение по stage/cause необходимо, потому что одинаковая конечная пауза имеет разные исправления.

   **Типичная ошибка:** Объединять все handover failures в один radio threshold issue.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

647. Как radio conditions влияют на handover success?

   **Ответ:** Нужно достаточно хорошее serving качество для своевременного command и target качество для access/completion. Interference, fading, скорость и gaps влияют на обе стороны, а core-path ошибки могут действовать независимо.

   **Типичная ошибка:** Проверять только target RSRP в момент уже произошедшего failure.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf).

648. Как load balancing мотивирует handover кроме radio quality?

   **Ответ:** Сеть может перевести UE на менее загруженную соту, если её покрытие и возможности пригодны. Это балансирует demand, но потенциально ухудшает radio efficiency или стабильность, поэтому решение не только по load.

   **Типичная ошибка:** Переводить UE на свободную соту с непригодным каналом ради равного PRB usage.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

649. Какие counters полезны для handover troubleshooting?

   **Ответ:** Нужны attempts/success/failures по preparation/execution/path switch, причины, source/target, тип и timers. Добавляют RLF, ping-pong, interruption и user-plane effects с тем же context/time.

   **Типичная ошибка:** Сравнивать counters разных стадий без mapping одной попытки между ними.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

650. Что должен понимать software engineer про basic handover flow?

   **Ответ:** Нужно проследить измерение/решение, target preparation, UE execution, core path update и source cleanup. Для каждой стадии важны owner, identifiers, expected response/timer и user data state.

   **Типичная ошибка:** Считать handover одной атомарной функцией с одним ответом success/failure.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


### Продвинутый уровень
651. Как X2 handover message flow выглядит на high level?

   **Ответ:** Source отправляет X2 Handover Request, target отвечает подготовленным context, затем source передаёт UE RRC mobility command. После доступа UE к target идут completion/path switch через core, forwarding-related действия и source release; optional steps зависят от bearer и сценария.

   **Типичная ошибка:** Пропускать path switch и cleanup, считая X2 preparation всем handover.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

652. Как S1 handover message flow выглядит на high level?

   **Ответ:** Source инициирует handover через MME, core координирует target preparation и возвращает command для UE. После target access выполняются notification/path updates, при необходимости relocation/forwarding и source cleanup согласно сценарию.

   **Типичная ошибка:** Рисовать user packets как обычный поток через MME во время S1 handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

653. Как user-plane forwarding/packet buffering handled during handover?

   **Ответ:** Предусмотренное forwarding переносит часть данных source→target напрямую или через нужный путь, target учитывает packets старого и нового пути. End marker помогает разграничению после path switch; буферы и in-sequence delivery не означают неограниченную надёжность GTP-U.

   **Типичная ошибка:** Считать end marker пользовательским payload или гарантией, что все ранние пакеты точно доставлены.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

654. Какие state transitions проходят в source eNodeB, target eNodeB, MME, SGW?

   **Ответ:** Source проходит preparation/execution и release, target создаёт context и принимает обслуживание, MME/gateways обновляют serving/path-state. Их transitions распределены во времени и могут завершаться с разными ошибками.

   **Типичная ошибка:** Считать один node success атомарным завершением всех узлов.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

655. Какие race conditions опасны during handover?

   **Ответ:** Concurrent release/bearer update, timeout после completion, delayed path-switch response и reused IDs могут испортить context. Нужны applicability checks, согласованный lifecycle и безопасное завершение/отмена pending операций.

   **Типичная ошибка:** Применять поздний target response к уже отменённому или заменённому UE-context.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

656. Как in-flight packets могут теряться или переупорядочиваться во время handover?

   **Ответ:** Часть пакетов остаётся в старых queues, forwarding и новый путь имеют разные задержки, а radio interruption может привести к drops. Sequencing, buffering и end markers уменьшают последствия по процедуре, но не устраняют все возможные потери.

   **Типичная ошибка:** Считать сохранённую PDN connection доказательством идеального порядка всех IP-пакетов.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 36.323: PDCP protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.323/).

657. Как handover affects TCP cwnd, RTT and retransmissions?

   **Ответ:** Пауза меняет ACK timing/RTT, loss/reordering может запускать recovery и изменения cwnd. Конкретное поведение зависит от TCP implementation и характера событий; сам handover не задаёт обязательный одинаковый сброс окна.

   **Типичная ошибка:** Утверждать, что каждый handover всегда обнуляет или всегда сохраняет cwnd без последствий.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

658. Как handover affects UDP jitter and packet loss?

   **Ответ:** Пауза и burst delivery дают jitter, неисправленные drops — loss, а поздние packets могут быть бесполезны даже после доставки. Playout buffer/FEC и deadlines определяют восприятие real-time сервиса.

   **Типичная ошибка:** Оценивать UDP качество только числом дошедших datagrams без их своевременности.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

659. Как distinguish radio handover issue from core path switch issue?

   **Ответ:** Проверяют UE/target radio completion и RLF отдельно от S1/GTP path-switch outcome и фактического forwarding. Target может принять UE, но не получать корректные DL packets из core, поэтому нужны обе стороны timeline.

   **Типичная ошибка:** Объявлять radio failure только потому, что приложение после handover не получает данные.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

660. Какие таймеры критичны для handover procedures?

   **Ответ:** Нужны radio handover execution/re-establishment сроки и соответствующие X2/S1/GTP procedural ожидания по сценарию. Например, UE T304 связан с handover execution; точные start/stop/expiry правила и значения берут из выбранного release.

   **Типичная ошибка:** Считать T304 полным универсальным timeout всех core handover стадий.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

661. Как measurement configuration влияет на handover stability?

   **Ответ:** Objects/events, filtering, gaps, offsets и TTT определяют своевременность и устойчивость входных данных для решения. Слишком шумный feedback провоцирует ping-pong, слишком медленный — late handover.

   **Типичная ошибка:** Подбирать thresholds без проверки measurement availability и UE capabilities.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

662. Как mobility robustness optimization conceptually works?

   **Ответ:** MRO анализирует mobility failures, RLF и нежелательные возвраты и корректирует применимые параметры в рамках policy. Нужны классификация причины, safe limits и проверка последствий; не каждый failure лечится radio tuning.

   **Типичная ошибка:** Автоматически менять hysteresis после любого core transport timeout.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

663. Как test handover scenarios in lab?

   **Ответ:** Воспроизводят source/target с нужным core и управляемыми channel/attenuation/traffic profiles и fault injection. Проверяют stages, packet interruption/loss и cleanup, а не только смену cell ID на UE.

   **Типичная ошибка:** Считать статический replay control messages полным тестом реального handover со stateful UE.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

664. Какие synthetic mobility profiles useful for testing?

   **Ответ:** Полезны плавный cell crossing, быстрый проезд, пограничное колебание, sudden blockage и load-based переходы с UL/DL traffic. Добавляют inter-frequency/RAT и core relocation отдельно, сохраняя параметры для повторения.

   **Типичная ошибка:** Тестировать только идеальный медленный переход двух равномерных сигналов.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

665. Как observability for handover should correlate RRC, X2/S1, GTP and QoS metrics?

   **Ответ:** Нужен scoped UE/session mapping для RRC radio IDs, X2/S1 context IDs и GTP endpoints/TEID с common timeline. Добавляют radio quality, QoS/queues и service outcomes, отмечая clock uncertainty и потери traces.

   **Типичная ошибка:** Соединять source и target события только по PCI, который не глобально уникален.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

666. Какие software bugs типичны в handover implementations?

   **Ответ:** Типичны stale target/source state, неверные tunnel/security updates, потерянные timers, двойной cleanup и ошибки buffer sequencing. Faults часто проявляются только при delayed messages и concurrent bearer lifecycle.

   **Типичная ошибка:** Считать happy-path handover достаточным тестом memory lifetime и idempotency.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

667. Как concurrency and state consistency problems show up under high mobility?

   **Ответ:** Частые transitions повышают вероятность пересечения timers, path updates и packet workers на старых contexts. Это даёт intermittent drops, leaks или неверное обслуживание; нужны versioned applicability и safe lifetime.

   **Типичная ошибка:** Считать race исправленной простым увеличением handover timers без устранения владения state.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

668. Какие interview вопросы обычно проверяют реальное понимание handover beyond buzzwords?

   **Ответ:** Полезно объяснить успешную radio completion при сломанном DL path, разницу preparation/execution и причины reordering/end marker. Другой тест понимания — какие state и data paths меняются при X2, S1 и S-GW relocation.

   **Типичная ошибка:** Отвечать только «X2 быстрее» без path/state и условий.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

669. Какие части handover нужно понимать глубже всего для telecom software?

   **Ответ:** Нужны procedure phases и owners, RRC execution, X2/S1/GTP context updates, security и sequence/buffer handling. Глубину RF-моделей определяет роль, но timers, identifiers и recovery важны любому участнику implementation.

   **Типичная ошибка:** Писать core path switch без понимания radio/source cleanup и in-flight packets.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

670. Какие anti-patterns опасны при handover troubleshooting?

   **Ответ:** Опасны смешение стадий, диагноз по aggregate success, одновременное изменение многих thresholds и игнорирование clocks/capture loss. Ещё хуже считать любой application timeout radio failure без core path evidence.

   **Типичная ошибка:** Считать повтор успешного теста доказательством устранения редкого сценарного бага.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


### Инженерные вопросы
671. Почему handover — одна из самых сложных процедур LTE?

   **Ответ:** Она одновременно меняет radio access, distributed contexts и packet path, сохраняя security и сервис в условиях движения. Участники имеют независимые timers и возможные partial failures, поэтому последовательность и cleanup принципиальны.

   **Типичная ошибка:** Моделировать handover одним безошибочным assignment serving_cell = target.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

672. Почему handover нельзя анализировать только как radio event?

   **Ответ:** После radio transition должны работать актуальные core tunnels, forwarding, security и bearer mappings. Ошибка user-path switch даст плохой сервис при хорошем target SINR и успешной UE completion.

   **Типичная ошибка:** Останавливать RCA на факте смены serving cell без проверки доставки.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

673. Как handover объединяет radio measurements, control-plane state и user-plane continuity?

   **Ответ:** Measurements дают решение, control готовит/переносит state, user-plane механизмы переводят доставку на новый путь. Успех оценивают по согласованности стадий и service continuity, не одному числу radio level.

   **Типичная ошибка:** Считать улучшение RSRP после перехода полным критерием handover качества.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

674. Что должен понимать C/C++ engineer о handover, если он работает с eNodeB/EPC software?

   **Ответ:** Нужны scope/lifetime IDs, cancellable timers, safe concurrent context updates, packet ownership и handling late/duplicate messages. Для eNodeB и EPC разные части flow, но интеграционные invariants и tracing должны совпадать.

   **Типичная ошибка:** Освобождать source resources до завершения всех нужных forwarding и readers без безопасного protocol/lifetime основания.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

675. Какие practical handover темы особенно важны на interview?

   **Ответ:** Важно пройти X2/S1 flow, различить idle reselection, измерить interruption и объяснить too early/late/ping-pong. Для software интервью добавить race, path switch failure, end markers и тестирование recovery под traffic.

   **Типичная ошибка:** Заменять объяснение causal timeline списком handover buzzwords.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).


---

## 11. Handover: типы и сценарии

### Базовый уровень
676. Какие типы handover обычно выделяют в LTE?

   **Ответ:** Классифицируют по смене cell/eNodeB, frequency/RAT, X2/S1 procedure и MME/S-GW relocation. Эти признаки комбинируются: например, inter-frequency handover может быть inter-eNodeB и X2-based.

   **Типичная ошибка:** Считать названия типов одним взаимоисключающим enum без отдельных измерений сценария.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

677. Что такое intra-cell vs inter-cell mobility на концептуальном уровне?

   **Ответ:** Внутри соты могут меняться ресурсы, лучи или radio configuration без перехода в другую cell. Inter-cell mobility меняет serving cell; в connected это handover, а в idle — соответствующий reselection.

   **Типичная ошибка:** Называть любое изменение radio parameters intra-cell handover с тем же flow, что inter-eNodeB.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

678. Что такое intra-eNodeB handover?

   **Ответ:** Это переход между сотами одного логического eNodeB. Межузловая X2 preparation не нужна как обмен двух eNodeB, но UE radio procedure и нужная bearer/context согласованность сохраняются.

   **Типичная ошибка:** Считать intra-eNodeB всегда без RRC, interruption и риска failure.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

679. Что такое inter-eNodeB handover?

   **Ответ:** Source и target принадлежат разным eNodeB, поэтому нужен межузловой перенос/подготовка context и смена user access path. Procedure может идти по X2 или S1 в поддерживаемом сценарии.

   **Типичная ошибка:** Считать inter-eNodeB обязательной сменой MME и S-GW.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

680. Что такое intra-frequency handover?

   **Ответ:** Source/target работают на одной frequency carrier, но могут быть разными сотами и eNodeB. Одинаковая частота упрощает часть measurements, не исключая inter-cell interference и context transfer.

   **Типичная ошибка:** Считать intra-frequency handover единственно возможным X2-сценарием.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

681. Что такое inter-frequency handover?

   **Ответ:** Serving cell меняется на другую частоту в той же RAT. Требования измерений/gaps и radio parameters target зависят от UE capabilities и configurations.

   **Типичная ошибка:** Путать inter-frequency с обязательным inter-RAT.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

682. Что такое inter-RAT handover из LTE в 3G/2G?

   **Ответ:** Это предусмотренный переход E-UTRA к UTRA/GERAN с соответствующим core и bearer/interworking. Он отличается от release с redirection и CS fallback flow, поэтому фактическую процедуру определяют по trace.

   **Типичная ошибка:** Называть любую индикацию 3G после LTE одним и тем же handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

683. Когда inter-frequency handover может быть нужен?

   **Ответ:** Для покрытия, load balancing, обслуживания в другом слое и спектральной конфигурации, если target пригоден. Выбор может быть нужен даже при достаточном source level из-за policy и распределения demand.

   **Типичная ошибка:** Считать другую частоту всегда более высокой скоростью для UE.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

684. Когда inter-RAT handover может быть нужен?

   **Ответ:** Когда другая RAT обеспечивает требуемое покрытие/услугу или предусмотренный interworking policy требует перехода. Наличие legacy сети и support UE/core обязательны; это не универсальная гарантия continuity.

   **Типичная ошибка:** Считать любой LTE UE способным к бесшовному переходу на любую существующую RAT.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

685. Чем mobility for coverage отличается от mobility for load balancing?

   **Ответ:** Coverage mobility избегает ухудшения/потери связи, load mobility переносит обслуживание ради распределения ресурса. На практике цели взаимодействуют: свободный target должен иметь достаточный канал и сервисные возможности.

   **Типичная ошибка:** Выполнять load handover без минимальных radio-quality ограничений.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).


### Средний уровень
686. В каких сценариях предпочтителен X2 handover?

   **Ответ:** Когда source/target имеют пригодный X2 и сценарий позволяет прямую preparation с нужным context transfer. Типичны меньше core relay шагов, но фактическое преимущество зависит от topology и нагрузки.

   **Типичная ошибка:** Выбирать X2 только по факту IP-достижимости без protocol/neighbor support.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

687. В каких сценариях нужен S1 handover?

   **Ответ:** Если применимый X2 handover недоступен или архитектурный scenario требует coordination через MME. Проверяют поддерживаемые inter-node/core отношения, а не считают S1 безусловным универсальным fallback.

   **Типичная ошибка:** Ожидать, что любое X2 failure автоматически успешно повторится по S1 без последствий.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

688. Чем handover в пределах одного MME/SGW отличается от более сложных mobility scenarios?

   **Ответ:** При сохранении MME/S-GW меньше переносов core ownership/anchor-state. Смена этих узлов добавляет context/security/session exchanges и recovery possibilities, но не обязательно меняет UE IP или PDN anchor.

   **Типичная ошибка:** Считать любой inter-eNodeB переход полной пересозданной PDN connection.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

689. Когда handover затрагивает path switch?

   **Ответ:** Для inter-eNodeB перехода нужно связать user traffic с target access endpoint, в X2 procedure target инициирует Path Switch к core. Другие сценарии имеют свой core path update; не каждый внутрисотовый radio change запускает тот же flow.

   **Типичная ошибка:** Называть любую PHY reconfiguration одинаковой S1 path-switch процедурой.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/).

690. Когда handover может затрагивать SGW relocation?

   **Ответ:** Когда новый access выходит за применимую serving area/условия текущего S-GW или scenario требует выбора нового gateway. Точные selection/relocation условия и messages задаются процедурой, не каждым изменением eNodeB.

   **Типичная ошибка:** Переносить S-GW при любом handover без необходимости и анализа continuity.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

691. Почему inter-frequency handover сложнее measurement-wise?

   **Ответ:** UE должен измерять ресурсы вне serving frequency и может иметь ограниченное число RF chains, поэтому нужны gaps и больше planning. Конкретная цена зависит от capabilities, измеряемых frequencies и существующей carrier configuration.

   **Типичная ошибка:** Считать gaps обязательными одинаковой длительности для любого UE и inter-frequency случая.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

692. Почему inter-RAT handover operationally более сложен?

   **Ответ:** Различаются measurements, radio procedures, core interworking и bearer/QoS/security mappings. Нужно согласовать UE capabilities и услуги на обеих сторонах, поэтому одного target RSRP недостаточно.

   **Типичная ошибка:** Считать inter-RAT обычным LTE X2 handover с другим названием cell.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

693. Как coverage holes влияют на handover performance?

   **Ответ:** Если между пригодными source/target зонами нет достаточного перекрытия, command или target access могут не успеть завершиться. Tuning может уменьшить риск, но не создать отсутствующий link budget и coverage.

   **Типичная ошибка:** Лечить физическую дыру покрытия только уменьшением TTT без проверки target usability.

   **Источник:** [ITU-R P.525: Calculation of free-space attenuation](https://www.itu.int/rec/R-REC-P.525/en); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

694. Как high-speed mobility влияет на типичные handover failures?

   **Ответ:** Сокращается время доступного перекрытия, быстрее устаревают measurements и меняется канал. Параметры должны учитывать preparation/execution budget и Doppler, но высокая скорость не определяет одну универсальную настройку.

   **Типичная ошибка:** Копировать пешеходные thresholds/TTT в high-speed deployment без проверки времени перехода.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

695. Почему highway/train scenarios особенно трудны?

   **Ответ:** Быстрая смена геометрии, проникновение в транспорт, Doppler, линейный маршрут и массовые UE/нагрузка создают совместные проблемы. Нужны сценарные измерения, coverage planning и проверка timing/capabilities.

   **Типичная ошибка:** Считать train-проблему исключительно большим Doppler и игнорировать wagon loss/backhaul/load.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [ITU-R P.2109: Prediction of building entry loss](https://www.itu.int/rec/R-REC-P.2109/en); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

696. Как dense urban deployment влияет на handover tuning?

   **Ответ:** Много перекрывающихся cells, отражений и неустойчивых neighbors усложняют выбор target и suppression ping-pong. Tuning учитывает скорость, tiers, interference и load, а не один глобальный threshold.

   **Типичная ошибка:** Назначать одинаковые параметры всем macro/small cells по одной urban average.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

697. Почему small cells создают больше handover events?

   **Ответ:** При меньшей зоне обслуживания маршрут может чаще пересекать границы, особенно при плотном размещении. Реальная частота зависит от selection policy, overlap и движения; лишние transitions можно ограничивать в рамках сервиса.

   **Типичная ошибка:** Считать увеличение числа handover неизбежно пропорциональным числу установленных small cells.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

698. Как load-based handover может конфликтовать с radio-quality-based handover?

   **Ответ:** Свободная сота может иметь хуже channel и требовать больше ресурса, а попытки балансировки — вызвать обратный переход. Нужно совместно учитывать radio, QoS, load и stability, избегая конфликтующих loops.

   **Типичная ошибка:** Оптимизировать два независимых controllers без согласования objectives и timescales.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/).

699. Как VoLTE or real-time traffic ужесточает требования к handover?

   **Ответ:** Непрерывный поток и небольшой playout/deadline budget делают interruption и bursts loss заметнее, чем для фоновой загрузки. Нужно измерять service outcomes, а не только handover signaling success.

   **Типичная ошибка:** Считать одинаковый success rate одинаковым качеством download и VoLTE.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

700. Какие сценарии handover чаще всего вызывают packet loss bursts?

   **Ответ:** Риск выше при radio outage во время execution, delayed path switch, relocation/faults и ограниченных forwarding buffers. Это условия, а не жёсткий рейтинг типов: измеряют duration, stage и packet fate конкретного сценария.

   **Типичная ошибка:** Считать любой inter-frequency handover обязательно более loss-heavy любого intra-frequency.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

701. Какие сценарии чаще вызывают ping-pong?

   **Ответ:** Нестабильная граница, шумные measurements, агрессивные offsets/TTT и конфликтующая load policy часто дают быстрые обратные переходы. Реальный маршрут с возвратом тоже возможен, поэтому применяют сценарную классификацию.

   **Типичная ошибка:** Подавлять все возвраты независимо от качества target и движения UE.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

702. Какие сценарии handover hardest to reproduce in lab?

   **Ответ:** Трудны редкие сочетания high-speed channel, intermittent interference, multi-operator topology, нагрузка и delayed concurrent control events. Повторение требует сохранённых profile/seeds/fault timing, а capture replay покрывает лишь часть условий.

   **Типичная ошибка:** Считать отсутствие повторения в простой двухсотовой lab-схеме доказательством невозможности production bug.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

703. Как roaming scenarios усложняют mobility path?

   **Ответ:** Roaming добавляет административные и географические границы core path/policy и home-routed/local breakout варианты. Конкретный handover обычно определяется radio/core serving scenario, поэтому roaming не означает обязательную смену home P-GW.

   **Типичная ошибка:** Считать каждую смену соты в visited network новым roaming attach с другим PDN anchor.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

704. Какие counters useful specifically per handover type?

   **Ответ:** Разделяют attempts, preparation/execution/path success/failure и interruption по frequency/RAT, X2/S1, source/target и relocation. Для meaningful сравнения сохраняют UE capabilities, load и radio context.

   **Типичная ошибка:** Смешивать разные типы и стадии в один показатель, скрывающий конкретный проблемный сценарий.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

705. Что должен понимать engineer про сценарную классификацию handover?

   **Ответ:** Классификация должна описать независимые оси radio и core, expected message flow и измеряемый service impact. Тогда понятно, какие state/идентификаторы меняются и где искать failure.

   **Типичная ошибка:** Ограничиваться меткой «handover failure» без scenario и stage.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).


### Продвинутый уровень
706. Как tuning differs for macro-only, macro+small-cell, indoor and high-speed mobility scenarios?

   **Ответ:** Macro/high-speed важны время перекрытия и coverage, small/indoor — плотность neighbors, overlap, penetrations и ping-pong. Настройки подтверждают маршрутами и load profiles, а не копируют по одному названию типа deployment.

   **Типичная ошибка:** Считать все indoor cells одинаковыми независимо от материалов, частот и mobility.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [ITU-R P.2109: Prediction of building entry loss](https://www.itu.int/rec/R-REC-P.2109/en); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

707. Как event thresholds/hysteresis/time-to-trigger should adapt to scenario type?

   **Ответ:** Выбирают условия под dynamics, время пригодности target и цену лишнего перехода, сохраняя нормативные ranges и UE support. Нужно проверять совместно filtering, offsets, hysteresis и TTT, а не только один параметр.

   **Типичная ошибка:** Всегда уменьшать TTT для любого failure без определения too early/late/core причины.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

708. Как per-scenario mobility optimization affects throughput vs stability?

   **Ответ:** Агрессивный выбор сильного/свободного target может улучшить rate, но увеличить interruption и churn. Более стабильное обслуживание уменьшает переходы, но способно удерживать UE на худшем канале; objective задаётся сервисом.

   **Типичная ошибка:** Оптимизировать throughput по пику после перехода без учёта потерянного времени и failures.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

709. Какие design trade-offs between aggressive and conservative handover policies?

   **Ответ:** Агрессивность снижает риск позднего ухода, но повышает unwanted/ping-pong переходы; консервативность делает обратный компромисс. Пределы задают coverage, скорость, measurements и preparation latency.

   **Типичная ошибка:** Выбирать policy по минимальному числу handover как единственной цели.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

710. Как different handover scenarios affect EPC signaling load?

   **Ответ:** X2/S1, inter-node relocations и retry/failure branches дают разный signaling work. Частота transitions и доля failures влияют на MME/gateway load, поэтому total handover count без mix недостаточен.

   **Типичная ошибка:** Оценивать EPC signaling по одному постоянному числу messages на любой переход.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

711. Как scenario-specific failures surface in app-level telemetry?

   **Ответ:** Разная длительность interruption/loss проявляется pauses, RTT spikes, bitrate changes и deadline misses. Эти симптомы связывают с scenario/stage, иначе похожие app events от congestion или серверов будут ошибочно приписаны mobility.

   **Типичная ошибка:** Определять handover type только по клиентскому timeout pattern.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

712. Как reproduce inter-frequency/inter-RAT handovers in test automation?

   **Ответ:** Нужны поддерживаемые UE/RAN/core технологии, управляемые частоты/channel profiles и проверка фактических procedures по trace. Автоматизация фиксирует configuration/release, исходное UE-state, traffic и ожидаемые context/path changes.

   **Типичная ошибка:** Называть тест inter-RAT только потому, что после отключения LTE UE заново подключился к 3G.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

713. Как build trace analysis framework that classifies handover failures by scenario?

   **Ответ:** Парсят и нормализуют events, восстанавливают scoped context mappings и timeline попытки, затем классифицируют scenario, stage и cause с отметкой неопределённости. Классификатор проверяют на размеченных успешных/неуспешных traces и неполных данных.

   **Типичная ошибка:** Делать окончательный диагноз по одной regex «timeout» без state reconstruction.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.423: X2AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.423/); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

714. Какие log dimensions нужны для scenario-aware handover RCA?

   **Ответ:** Нужны source/target cell IDs и frequencies/RAT, X2/S1/relocation type, UE capability/state, QoS, radio/load и protocol IDs/causes/timers. Добавляют clock/source и trace completeness, чтобы сравнение было воспроизводимым.

   **Типичная ошибка:** Использовать только PCI без глобальной cell identity и времени.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

715. Какие interview вопросы проверяют понимание сценариев, а не только определения handover types?

   **Ответ:** Хороший кейс — почему пешеходный UE ping-pong, поезд получает late failures или radio completion проходит при сломанном DL. Ответ должен выбрать stage, связанные measurements и проверку гипотезы вместо универсального threshold.

   **Типичная ошибка:** Одинаково отвечать «увеличить hysteresis» на любые mobility симптомы.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).


### Инженерные вопросы
716. Почему handover нужно изучать не только по типам, но и по practical deployment scenarios?

   **Ответ:** Один protocol type может работать по-разному при разных скорости, покрытии, load и topology. Практический scenario определяет временные и resource ограничения и нужную методику теста.

   **Типичная ошибка:** Считать знание message names достаточным предсказанием production поведения.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

717. Какие сценарии handover наиболее важны для production troubleshooting?

   **Ответ:** Приоритетны реально используемые radio/core transitions, проблемные маршруты/границы, peak load и recovery/failure случаи сети. Универсальный список не заменяет incident data, поэтому coverage tests связывают с эксплуатацией.

   **Типичная ошибка:** Тестировать только самый простой X2 handover, если сеть реально использует relocation/inter-RAT.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).

718. Что особенно полезно знать разработчику ПО про сценарии handover?

   **Ответ:** Нужно понимать, какие contexts/IDs меняются, какие peers/timers участвуют и что происходит с in-flight data. Это задаёт concurrency, cancellation и tracing requirements независимо от того, пишет ли инженер RF-логику.

   **Типичная ошибка:** Делать один cleanup-path для всех сценариев без проверки сохраняемых session/anchor states.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

719. Какие deployment assumptions чаще всего ломают “идеальную” handover логику?

   **Ответ:** Идеальную логику ломают отсутствующий neighbor/X2, coverage gap, stale CSI, target overload, transport delay и concurrent release/update. Нужны explicit assumptions, validation и recovery вместо надежды на синхронный happy path.

   **Типичная ошибка:** Предполагать всегда доступный target и безграничные buffers при реальном mobility.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

720. Как объяснить handover scenarios на интервью через практические кейсы?

   **Ответ:** Удобно взять три кейса: одинаковая частота между соседями, переход на другой band под load и inter-RAT/relocation для покрытия. Для каждого назвать decision, preparation path, изменяемый context, user path и измерение успеха.

   **Типичная ошибка:** Выдавать кейс за универсальную схему без условий UE/core support и deployment.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).


---

## 12. QoS в LTE

### Базовый уровень
721. Что такое QoS в LTE?

   **Ответ:** QoS в EPS задаёт дифференцированное обслуживание flows через bearer parameters, policy, admission и packet treatment. Оно должно реализовываться на access/core/transport участках в пределах определённой модели, а не только назначаться меткой.

   **Типичная ошибка:** Считать QoS гарантией любой скорости и задержки во всём публичном Интернете.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

722. Зачем LTE нужна QoS model?

   **Ответ:** Сервисы имеют разные требования, а radio и transport resources ограничены. Модель позволяет согласовать classification, допустимость bearer и обслуживание, сохраняя управляемую деградацию при competing demand.

   **Типичная ошибка:** Обслуживать все flows одинаковой длинной FIFO, ожидая хорошего real-time под любой нагрузкой.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

723. Почему не весь трафик можно обслуживать одинаково?

   **Ответ:** Голос чувствителен к задержке и loss bursts, file transfer — к полезной доставке, другие сервисы имеют иной профиль. Унифицированный treatment может быть допустим для части best effort, но не удовлетворяет всем требованиям при дефиците ресурса.

   **Типичная ошибка:** Приравнивать важность потока только его текущей битовой скорости.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

724. Что такое bearer-level QoS?

   **Ответ:** Пакеты одного EPS bearer получают общий bearer-level QoS treatment, связанный с QCI и применимыми rate/priority параметрами. Разные service flows могут классифицироваться в bearer по rules; это не QoS отдельного TCP socket по умолчанию.

   **Типичная ошибка:** Считать каждый application flow автоматически отдельным bearer.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

725. Что такое QCI?

   **Ответ:** QoS Class Identifier ссылается на набор packet forwarding characteristics, например resource type, priority, delay/loss параметры. Значения и применимость берут из соответствующей таблицы release; QCI не равен единственной фиксированной скорости.

   **Типичная ошибка:** Читать priority number QCI как прямой rate limit в Мбит/с.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

726. Что такое ARP (Allocation and Retention Priority) в контексте QoS, не путая с Address Resolution Protocol?

   **Ответ:** Allocation and Retention Priority определяет admission/retention и pre-emption-related характеристики bearer. В стандартной роли ARP не задаёт обычный per-packet scheduling treatment после admission; для него важны QCI и другие QoS параметры.

   **Типичная ошибка:** Путать ARP с Address Resolution Protocol или использовать его как единственный packet priority.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

727. Что такое GBR bearer?

   **Ответ:** GBR bearer имеет согласованные гарантированные битовые rate-параметры в соответствующих направлениях и связан с admission/resource management. Также применим MBR; гарантия действует в определённых условиях модели и не отменяет outage.

   **Типичная ошибка:** Считать GBR постоянным физическим circuit или обещанием безотказного Internet SLA.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

728. Что такое non-GBR bearer?

   **Ответ:** Non-GBR bearer не имеет индивидуально гарантированного GBR-ресурса. Он всё равно имеет QCI и QoS treatment, а aggregate rate limits могут применяться по соответствующим AMBR правилам.

   **Типичная ошибка:** Считать non-GBR отсутствием любых приоритетов, ограничений и policy.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

729. Чем GBR отличается от non-GBR?

   **Ответ:** GBR задаёт гарантированное rate обязательство для принятого bearer, non-GBR — не задаёт его. QCI, priority, delay/loss profile и фактическая скорость зависят от класса и ресурса; non-GBR не обязательно медленнее каждого GBR.

   **Типичная ошибка:** Приравнивать GBR к «быстрый», non-GBR к «медленный» без трафика и конфигурации.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

730. Почему voice/video/data могут требовать разный QoS?

   **Ответ:** Voice обычно требует своевременных небольших packets, video зависит от режима streaming/interactive, data transfer — от завершения и goodput. Требования сервисов определяют classification/QoS, а не только расширение файла или port.

   **Типичная ошибка:** Назначать одинаковый профиль всему video, игнорируя разницу трансляции и real-time разговора.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

731. Как QoS связана с default и dedicated bearers?

   **Ответ:** Default EPS bearer — non-GBR базовый bearer PDN connection; dedicated может предоставить отдельный QoS treatment matching flows и быть GBR или non-GBR. Все они относятся к той же PDN connection, пока не создаётся отдельная связь.

   **Типичная ошибка:** Считать любой dedicated bearer GBR и новой независимой IP-сессией.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

732. Где в LTE применяется QoS policy?

   **Ответ:** Policy decisions и enforcement находятся в предусмотренных PCC/core функциях, а radio реализует соответствующее обслуживание по bearer. Transport также должен поддерживать нужный treatment на своей части пути.

   **Типичная ошибка:** Считать QoS настройкой только одной очереди P-GW или только одного scheduler.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

733. Какие узлы участвуют в обеспечении QoS?

   **Ответ:** Участвуют policy/charging функции, gateways, MME как coordinator bearer-state, eNodeB и UE с radio configuration. Каждый узел имеет свою роль; наличие QoS context в MME не делает его user packet scheduler.

   **Типичная ошибка:** Приписывать MME per-packet приоритизацию всего пользовательского трафика.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

734. Почему QoS влияет на scheduling?

   **Ответ:** Scheduler решает, когда и сколько radio resource получит bearer, учитывая качество и demand. Без этого packet class или GBR intent не создают фактической доставляемости в эфире.

   **Типичная ошибка:** Считать одинаковые PRB доли соблюдением любого rate/deadline profile.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

735. Какие KPI полезны для оценки QoS?

   **Ответ:** Нужны delivered rates, delay distributions/deadline misses, loss и admission/pre-emption outcomes по QoS/bearer. Их связывают с radio resource, errors/retries, queues и правильной classification.

   **Типичная ошибка:** Считать наличие нужного QCI в config единственным QoS KPI.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/).


### Средний уровень
736. Как QCI отражает delay/loss priority profile traffic?

   **Ответ:** QCI связывает класс с нормативными forwarding characteristics в выбранном release, включая priority и delay/loss ориентиры. Для оценки нужны правильные boundaries этих величин, а не свободное толкование как Internet RTT/loss SLA.

   **Типичная ошибка:** Использовать QCI PDB как абсолютный максимальный RTT любого application request.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

737. Почему QCI влияет на scheduler treatment?

   **Ответ:** Он задаёт характеристики обслуживания, которые radio policy переводит в очереди/приоритеты и выделения ресурса. Конкретная scheduling эвристика не унифицирована одним алгоритмом, но должна учитывать применимые требования.

   **Типичная ошибка:** Выводить конкретный vendor scheduling weight прямо из номера QCI без конфигурации.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

738. Как ARP используется при admission control?

   **Ответ:** При создании/удержании bearer ARP помогает решить admission и возможность/уязвимость pre-emption. Сам он не заменяет radio capacity estimate, GBR параметры и packet forwarding priority QCI.

   **Типичная ошибка:** Переключать каждую packet queue по ARP как будто это стандартная per-packet priority.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

739. Почему QoS не означает гарантированную идеальную скорость всегда?

   **Ответ:** Ресурс конечен, radio может уйти в outage, а внешняя сеть лежит за границей части EPS guarantees. QoS — правила и обязательства в заданной области, с admission и условиями, а не отмена физических ограничений.

   **Типичная ошибка:** Обещать одинаковое качество в любой точке и при любой нагрузке по одной метке bearer.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

740. Как congestion влияет на фактическое соблюдение QoS?

   **Ответ:** При нехватке ресурса нужны приоритизация, admission/pre-emption и bounded buffering/drops по policy. Неверная или превышенная reservation приводит к нарушению delay/rate несмотря на правильно названные классы.

   **Типичная ошибка:** Применять только приоритет, считая capacity planning для GBR необязательным.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

741. Как default bearer обслуживает generic traffic?

   **Ответ:** Пакеты, не отнесённые matching rules к другому bearer, используют соответствующий default bearer данной PDN connection по правилам классификации. Он сохраняется с PDN context, хотя активный radio access может освобождаться в idle.

   **Типичная ошибка:** Считать default bearer всегда одним общим bearer всех PDN UE.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

742. Зачем нужен dedicated bearer?

   **Ответ:** Он позволяет отдельно обслуживать matching flows с требуемыми QoS/rate параметрами в рамках той же PDN. Стоимость — дополнительный state/signaling, поэтому bearer не создают произвольно на каждый пакет.

   **Типичная ошибка:** Считать dedicated bearer обязательным условием любой пользовательской передачи данных.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

743. Как LTE differentiates real-time and best-effort traffic?

   **Ответ:** Service classification и policy связывают flows с bearer/QCI и применимыми rates, затем radio и transport дают соответствующий treatment. Тип сервиса не следует автоматически из UDP/TCP: оба могут использоваться разными приложениями.

   **Типичная ошибка:** Считать весь UDP real-time, а весь TCP best-effort file transfer.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

744. Как QoS rules превращаются в practical packet handling?

   **Ответ:** Classifier определяет flow/bearer, enforcement выполняет gating/rate/charging actions, queues/scheduler выбирают время передачи. Нужны согласованные rule versions и mappings на всех участвующих границах.

   **Типичная ошибка:** Считать успешную запись в policy DB фактическим применением rule во всех packet workers.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

745. Как PGW/SGW/eNodeB совместно обеспечивают QoS?

   **Ответ:** P-GW/PCEF классифицирует и применяет policy, S-GW поддерживает bearer/tunnel path и применимые функции, eNodeB обслуживает radio resources по QoS. Transport и UE также влияют на итог; роли не означают одинаковый scheduler в каждом узле.

   **Типичная ошибка:** Считать QoS реализованной полностью только на P-GW без проверки радиодоставки.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

746. Как scheduler учитывает GBR flows?

   **Ответ:** Учитывает согласованный спрос/GBR в пределах admission и channel efficiency, сохраняя необходимые ресурсы и ограничения. В плохом канале требуется больше radio resource на тот же bit rate, что влияет на capacity.

   **Типичная ошибка:** Резервировать одинаковое число PRB для любого GBR rate независимо от MCS и retransmissions.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

747. Как buffer management связан с QoS?

   **Ответ:** Разделение очередей, лимиты/aging и drop policy определяют, не блокируют ли одни flows другие и не копится ли устаревшее. Большой буфер может снижать drops, но ухудшать latency, поэтому QoS не сводится к хранению всех пакетов.

   **Типичная ошибка:** Увеличивать все buffers до максимума ради «надёжности» real-time.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

748. Как packet delay budget conceptually связан с real-time traffic?

   **Ответ:** PDB задаёт допустимый бюджет передачи по границе, определённой QoS model, обычно UE↔PCEF для EPS, и помогает выбрать scheduling treatment. Application deadline может включать codec, server и другие network segments и отличаться от PDB.

   **Типичная ошибка:** Считать PDB целевым временем всей операции приложения с любым сервером.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

749. Как packet loss tolerance differs across QCI classes?

   **Ответ:** QCI profiles предусматривают разные packet error loss characteristics под конкретные сервисные требования. Значения и определения проверяют в таблице стандарта; они не описывают весь end-to-end loss любого приложения и не заменяют deadline analysis.

   **Типичная ошибка:** Сравнивать QCI loss target напрямую с Internet packet loss без одинаковых boundaries и причин.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

750. Как QoS misconfiguration проявляется для приложений?

   **Ответ:** Ошибочная classification/priority/rate может дать selective slow flows, jitter, drops или admission failure при нормальном RF. Проверяют фактический bearer/rule и queues с нужным направлением и QoS scope.

   **Типичная ошибка:** Лечить QoS classifier bug изменением radio frequency или TCP timeout.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

751. Почему QoS issue может выглядеть как random latency or jitter problem?

   **Ответ:** Пакеты ждут по policy в конкурирующих очередях, а меняющаяся нагрузка делает delay непостоянным. Внешне это похоже на RF или congestion, поэтому нужно связать enqueue/dequeue, resource и policy outcomes.

   **Типичная ошибка:** Считать непостоянный симптом доказательством случайной аппаратной неисправности.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

752. Как transport-layer метрики отражают плохой QoS enforcement?

   **Ответ:** Могут меняться RTT, tail delay, loss/recovery и useful rate, но те же признаки дают другие bottlenecks. Для вывода связывают transport с current bearer/rule, queues и allocation, а не с одним configured QCI.

   **Типичная ошибка:** Считать TCP retransmissions уникальным признаком неправильного QoS.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

753. Какие counters/logs помогут понять, что проблема именно в QoS policy?

   **Ответ:** Нужны classification hits, current rules/versions, gating/rate/drop reasons, bearer/QCI/rates и admission outcomes. Их дополняют queue delay и allocated/delivered service, чтобы отличить policy decision от недоступного ресурса.

   **Типичная ошибка:** Считать zero rule errors доказательством правильного mapping user packets в нужный bearer.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

754. Как admission control влияет на user experience under load?

   **Ответ:** Не принимать невыполнимые обязательства может быть лучше для уже обслуживаемых сервисов, но новые requests получают отказ или иной допустимый treatment. Решение зависит от ARP/pre-emption/policy и реального ресурса, не только количества сессий.

   **Типичная ошибка:** Принимать все GBR requests, рассчитывая на бесконечное деление ресурса без нарушения обещаний.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

755. Что должен понимать software engineer про LTE QoS mapping?

   **Ответ:** Нужно различать service flow, packet filters, EPS/radio bearer, QCI/ARP и GBR/AMBR scopes. Правильное представление и versioned updates нужны, чтобы один и тот же intent применялся к нужным пакетам по текущему context.

   **Типичная ошибка:** Хранить все QoS параметры одним числом priority без единиц, направления и области действия.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).


### Продвинутый уровень
756. Как bearer QoS parameters propagate from control-plane policy decisions to scheduler behavior?

   **Ответ:** Policy и session control согласуют QoS и bearer mappings, MME/S1 доставляют access-related параметры, RRC настраивает radio segment. Scheduler применяет их вместе с текущим channel/demand, поэтому нужно проверить путь intent→configuration→delivery.

   **Типичная ошибка:** Считать сохранённую rule автоматически мгновенно применённой ко всем уже queued packets без процедуры обновления.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

757. Как dedicated bearer setup changes packet treatment end to end?

   **Ответ:** Matching flows переводятся на новый bearer с отдельным QoS treatment по согласованным filters и context. Полезный эффект зависит от admission, полного access/core setup и реального ресурса; сам Create Bearer не меняет автоматически внешний Internet SLA.

   **Типичная ошибка:** Считать dedicated bearer отдельным TCP-соединением и обязательно новым UE IP.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

758. Как QoS state represented across MME, SGW, PGW and eNodeB?

   **Ответ:** MME хранит EPS context и параметры координации, gateways — bearer/tunnel и применимые rules, eNodeB — radio/configuration и scheduling inputs. Это разные представления одной связанной модели, а не одинаковая структура во всех узлах.

   **Типичная ошибка:** Считать одинаковое имя bearer ID глобальным уникальным database key всех subscribers.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

759. Какие race/configuration consistency problems possible in QoS enforcement?

   **Ответ:** Rule update может пересечься с bearer release, packet cache и delayed responses, давая stale treatment или неверный mapping. Нужны applicability/version checks, acknowledgment и безопасный lifecycle обновлений/rollback.

   **Типичная ошибка:** Применять поздний QoS update после удаления и reuse bearer ID без проверки context generation.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

760. Как per-bearer QoS interacts with radio resource scarcity?

   **Ответ:** Radio должна иметь достаточно мощности/времени/частоты для нужного качества и rates, а плохой channel увеличивает цену каждого бита. Admission и policy управляют дефицитом; параметры bearer не создают бесконечную ёмкость.

   **Типичная ошибка:** Обещать GBR при любых radio outages только на основании установленного context.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

761. Как fairness and priority trade-offs manifest under congestion?

   **Ответ:** Высокий приоритет может задерживать остальные flows, а равное обслуживание — нарушать срочные требования. Нужны определённые policy/fairness и admission, с измерением starvation и QoS compliance под load.

   **Типичная ошибка:** Считать fairness одинаковой по всем классам независимо от договорённых требований.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

762. Как diagnose whether packet delay caused by radio scheduling, backhaul, SGW/PGW congestion or QoS policy?

   **Ответ:** Собирают queue/processing times и drops на radio, S1/backhaul и gateways с current bearer/rule context. По timeline находят первый существенный вклад и проверяют его нагрузкой/конфигурацией, отличая policy wait от unavailable channel.

   **Типичная ошибка:** Диагностировать причину только по одному RTT-графику и configured QCI.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

763. Как build observability that ties subscriber QoS profile to actual transport metrics?

   **Ответ:** Связывают subscriber/PDN/bearer, QoS parameters/rule version, resources/queues и packet/application metrics в одной временной модели. Важно измерять фактический demand и success, иначе малую загрузку можно принять за нарушенный rate.

   **Типичная ошибка:** Сравнивать policy target с throughput приложения, которое само отправляет меньше target.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

764. Какие software/data-model patterns useful for representing QoS policy in telecom systems?

   **Ответ:** Полезны типизированные параметры с units/direction/scope, явные classifier precedence и immutable/versioned rule snapshots. Session/bearer lifecycle должен валидировать совместимость и stale events, а не хранить произвольный неструктурированный priority blob.

   **Типичная ошибка:** Смешивать ARP, QCI priority и rate limit в одном поле без семантики.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

765. Как test QoS correctness under mixed traffic loads?

   **Ответ:** Создают конкурирующие classes/UE с контролируемыми offered rates, radio qualities и bursts и измеряют delivered rate, delay/loss и admission. Проверяют изменения policy и teardown под traffic, включая перегрузку и return to normal.

   **Типичная ошибка:** Подтверждать QoS тестом одного потока без конкуренции за ресурс.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

766. Как simulate GBR/non-GBR traffic mixes in lab?

   **Ответ:** Настраивают допустимые bearers/rules и traffic generators с periodic real-time и saturated/sparse best-effort, задавая rates и packetization. Затем меняют offered load и quality, проверяя actual mapping и outcomes, а не только названия flows.

   **Типичная ошибка:** Называть UDP-generator GBR без реальной GBR bearer/policy configuration.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

767. Какие anti-patterns common when teams treat QoS as static config rather than dynamic end-to-end behavior?

   **Ответ:** Часты проверка только config, отсутствие rule version/counters, игнорирование admission и service outcomes при load. Нужно проверять runtime classification, queues и lifecycle, потому что динамика решает, получил ли пакет нужный treatment.

   **Типичная ошибка:** Считать policy корректной навсегда после одного успешного provisioning call.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

768. Как LTE QoS concepts map to more general networking ideas: priority queues, shaping, admission control?

   **Ответ:** QCI связан с differentiated treatment, rates — с policing/shaping/reservation, ARP — с admission/retention и pre-emption. Но соответствие не буквально: EPS имеет bearer scopes и нормативные определения, которые generic queues сами не реализуют.

   **Типичная ошибка:** Считать одну Linux priority queue полной эквивалентной реализацией EPS QoS model.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

769. Какие interview questions по QoS проверяют понимание end-to-end implications, а не только терминов?

   **Ответ:** Практический вопрос: почему хороший RSRP и правильный QCI не дают rate, либо почему dedicated bearer создан, а jitter остался. Ответ должен проверить scope, classification, queues/resource и границу service metric, а не предложить один «более высокий priority».

   **Типичная ошибка:** Путать admission ARP с packet scheduling priority в разборе перегрузки.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

770. Что нужно понимать глубже всего в QoS: QCI, bearers, scheduler or policy path?

   **Ответ:** Для полной модели нужны bearer/flow scopes, QCI/ARP/rates и policy propagation до реального scheduling/forwarding. Конкретная роль определяет глубину алгоритмов, но изолированное знание одного номера QCI не объяснит service outcome.

   **Типичная ошибка:** Изучать таблицу QCI без понимания mapping и доступного ресурса.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).


### Инженерные вопросы
771. Почему QoS в LTE — это не только “приоритеты”, а end-to-end система?

   **Ответ:** Это последовательность classification, authorization/admission, bearer configuration и фактического enforcement на пути UE↔PDN gateway. Внешние application/server segments требуют своего budget; EPS QoS не покрывает автоматически весь Интернет.

   **Типичная ошибка:** Называть «end-to-end» без указания границ гарантии и измерения.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

772. Какие части QoS наиболее важны для network/software engineer?

   **Ответ:** Нужно знать scopes идентификаторов/rates, QCI против ARP, GBR/non-GBR, classifiers и runtime enforcement/metrics. Для software важны safe versioned updates, resource bounds и восстановление корректного state после failures.

   **Типичная ошибка:** Реализовывать QoS только сортировкой packets по одному числу из config.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

773. Почему плохая QoS настройка может выглядеть как radio, core или application problem?

   **Ответ:** Ошибочный treatment меняет queues, allocation и loss, создавая симптомы, похожие на плохой канал, core congestion или медленный app. Различают причины по current policy/context и packet/queue evidence на границах.

   **Типичная ошибка:** Выбирать команду-владельца проблемы только по общему симптому «плохой звонок».

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

774. Как объяснить QoS в LTE на интервью через GBR/non-GBR, scheduler и bearers?

   **Ответ:** Начать с разных latency/rate требований, показать default/non-GBR и отдельный matching dedicated bearer при необходимости. Затем объяснить GBR admission, QCI treatment, ARP retention и scheduler/resource ограничения на конкретном voice+download примере.

   **Типичная ошибка:** Считать любой voice bearer автоматически гарантией качества при полном radio outage.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

775. Какие знания про QoS особенно полезны перед изучением 5G QoS model?

   **Ответ:** Полезны policy/flow classification, bearer scopes, GBR/non-GBR, QCI/ARP и admission/enforcement на нескольких уровнях. В 5GS дальше изучают PDU sessions и QoS flows/5QI/QFI/DRB mapping; это эволюция модели, а не простая замена одного имени.

   **Типичная ошибка:** Приравнивать каждый EPS bearer одному NR DRB и одному 5G QoS flow без mapping процедуры.

   **Источник:** [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.501: System architecture for the 5G System](https://www.etsi.org/deliver/etsi_ts/123500_123599/123501/18.08.00_60/ts_123501v180800p.pdf).


---

## 13. Сквозные вопросы по LTE

### Архитектура и процедуры
776. Как attach, bearer setup, RRC setup и user-plane establishment связаны между собой?

   **Ответ:** Обычный initial access создаёт RRC для доставки NAS attach, core регистрирует UE и координирует PDN/default bearer. Затем согласуются radio/S1/core segments user path; этапы связаны, но успех одного не заменяет проверки следующих.

   **Типичная ошибка:** Считать RRCConnectionSetupComplete завершением всего EPS attach и IP reachability.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/).

777. Где заканчивается radio проблема и начинается core проблема в LTE?

   **Ответ:** Radio AS и EPC разделены логическими интерфейсами, но transport и distributed procedures связывают причины. На практике находят первую нарушенную границу Uu/AS, S1 или дальше core, а не проводят диагноз по одному пользовательскому симптому.

   **Типичная ошибка:** Считать S1/backhaul fault обязательно чисто радио или чисто core без локализации.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

778. Как eNodeB, MME, SGW и PGW совместно обеспечивают data session?

   **Ответ:** eNodeB предоставляет AS/radio и S1 mapping, MME управляет NAS/mobility/session coordination, S-GW связывает access/core tunnels, P-GW — PDN/address/policy. HSS и другие dependencies поддерживают нужные subscriber/security/service решения.

   **Типичная ошибка:** Забывать HSS/security и transport connectivity, перечислив только четыре forwarding/control имени.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

779. Почему understanding interfaces важнее простого заучивания узлов?

   **Ответ:** Интерфейсы показывают peer, протокол, сообщения и изменяемое state, позволяя проследить реальную процедуру и путь пакета. Название узла без этих связей не объясняет failure и recovery.

   **Типичная ошибка:** Диагностировать по месту последнего log line без знания источника cause и downstream dependency.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

780. Как control-plane перегрузка проявится иначе, чем user-plane деградация?

   **Ответ:** Control overload чаще нарушает setup/service/mobility и их timers, user degradation — goodput, queues и delivery текущих flows. Shared resources и события соединяют planes, поэтому их state и metrics коррелируют.

   **Типичная ошибка:** Считать хороший existing download доказательством успешных новых attach.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).


### Производительность и QoE
781. Какие LTE метрики наиболее полезно коррелировать с TCP retransmissions?

   **Ответ:** Коррелируют SINR/CQI/MCS, initial/residual BLER, HARQ/RLC, resources/queues и RRC/handover events. Transport recovery не равно radio repeat, а потери могут возникать и в core/backhaul, поэтому нужна path evidence.

   **Типичная ошибка:** Считать один TCP retransmission одним HARQ NACK.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.322: RLC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.322/).

782. Какие LTE метрики наиболее полезно коррелировать с UDP jitter?

   **Ответ:** Полезны queue/scheduling times, grant pattern, HARQ/RLC, radio quality, duplex и mobility events. Сравнивают с packet generation/arrival timestamps и CPU, исключая jitter отправителя и сбора.

   **Типичная ошибка:** Выводить RF-причину UDP jitter без radio timeline.

   **Источник:** [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

783. Почему хороший RSRP не гарантирует хороший throughput?

   **Ответ:** RSRP характеризует полезные reference resources, но не отражает всю интерференцию, долю ресурса, UE capabilities и внешние bottlenecks. Для скорости нужны quality, allocation, successful bits и end-to-end path.

   **Типичная ошибка:** Использовать RSRP как прямую шкалу Мбит/с.

   **Источник:** [3GPP TS 38.215: Physical layer measurements](https://www.etsi.org/deliver/etsi_ts/138200_138299/138215/18.04.00_60/ts_138215v180400p.pdf); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

784. Как scheduler, QoS и handover together shape user experience?

   **Ответ:** Scheduler определяет сервис ресурса, QoS — policy/requirements, handover — смену access/path с возможной паузой. Совместно они задают delivered rate, deadline и continuity, поэтому хороший один показатель не гарантирует UX.

   **Типичная ошибка:** Оптимизировать один peak throughput, игнорируя краткие outages и packet age.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf).

785. Как определить, что throughput проблема вызвана radio quality, а не core congestion?

   **Ответ:** Сопоставляют radio quality/errors/allocation и queues с ingress/egress counters core/backhaul. Много неуспешных radio передач и queue/drop внутри gateway имеют разную локализацию, хотя могут сочетаться.

   **Типичная ошибка:** Делать бинарный вывод только из хорошего RSSI или высокого CPU одного узла.

   **Источник:** [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

786. Как отличить handover packet loss от обычного radio loss?

   **Ответ:** Привязывают packet fate к handover phases/path changes и сравнивают с BLER/HARQ/RLF вне переходов. Temporal coincidence даёт гипотезу, которую проверяют captures, target/core state и повторением сценария.

   **Типичная ошибка:** Называть любой loss во время движения handover-loss без факта handover.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

787. Как RRC reconfiguration может влиять на latency spikes?

   **Ответ:** Применение новой radio configuration, measurements/gaps, mobility и связанные waits могут менять доставку. Не любая reconfiguration даёт обязательную паузу, поэтому анализируют конкретное сообщение, lower-layer events и queues.

   **Типичная ошибка:** Добавлять фиксированную задержку каждой RRC reconfiguration без измерений.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/).

788. Почему LTE troubleshooting требует смотреть и radio, и transport, и core metrics?

   **Ответ:** Radio определяет пригодность ресурса, transport — доставку между узлами, core — session/path/policy. Похожий application symptom возникает на каждой части, а correlation показывает первую неисправную границу.

   **Типичная ошибка:** Считать один layer capture полной картиной EPS-сервиса.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

789. Какие counters per-UE полезны для root-cause analysis?

   **Ответ:** Нужны current context/bearer/QoS, allocations, channel/MCS, BLER/HARQ/RLC, queues/drops, RRC/mobility causes и tunnel mappings. UE IDs и counters имеют lifetime, поэтому изменения при release/handover фиксируют явно.

   **Типичная ошибка:** Склеивать per-UE history по одному переиспользуемому C-RNTI.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

790. Какие counters per-cell полезны для capacity troubleshooting?

   **Ответ:** Собирают resource/control utilization, active demand, throughput distributions, setup/mobility rates и failures, radio quality и processing deadlines. Backhaul/NIC/CPU дополняют cell metrics, чтобы отличить radio capacity от platform/transport limits.

   **Типичная ошибка:** Считать высокий average PRB usage достаточным основанием добавить спектр без анализа errors и спроса.

   **Источник:** [3GPP TS 32.425: E-UTRAN performance measurements](https://www.3gpp.org/ftp/Specs/archive/32_series/32.425/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).


### C/C++ / systems / observability
791. Что должен понимать C/C++ engineer, если он пишет software для eNodeB или EPC?

   **Ответ:** Нужны протоколы и scoped state, safe lifetime/ownership, concurrency, timers, bounds parsing, queues и deadlines своей части системы. Обязательна связь control outcomes с packet/service evidence, даже если PHY реализует другая команда.

   **Типичная ошибка:** Считать C++ оптимизацию заменой правильным NAS/RRC/GTP transitions и recovery.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

792. Какие части LTE больше похожи на distributed control system?

   **Ответ:** NAS/MME, RRC/mobility, bearer и policy workflows имеют distributed state, messages, timers и partial failures. Analogy полезна для архитектуры, но telecom contracts определяют конкретные допустимые actions.

   **Типичная ошибка:** Обрабатывать стандартный control протокол как произвольные stateless RPC без transaction context.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/).

793. Какие части LTE больше похожи на high-performance packet processing platform?

   **Ответ:** Gateways и packet-facing radio layers обрабатывают высокие rates с queues, buffers, encapsulation и current mappings. Они всё равно зависят от control lifecycle и protocol correctness, поэтому throughput и state неразделимы.

   **Типичная ошибка:** Считать high-rate dataplane полностью stateless и не нуждающимся в session recovery.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

794. Какие design patterns полезны для telecom state machines?

   **Ответ:** Полезны явные automata, typed/scoped IDs, bounded event queues, single-owner contexts и cancellation-aware timers. Для distributed interactions нужны transaction matching, duplicates и rollback/cleanup по протоколу.

   **Типичная ошибка:** Держать long-lived raw callbacks на contexts без lifetime и generation checks.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

795. Какие design patterns полезны для telecom dataplane?

   **Ответ:** Используют bounded pools/queues, locality/partitioning, validated parsing и read-optimized current action/state. Publish/reclamation должны согласоваться с control updates, а batching — не нарушать latency budget.

   **Типичная ошибка:** Устранять проверки и error accounting из fast path только ради benchmark peak.

   **Источник:** [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [DPDK: Packet buffer library](https://doc.dpdk.org/guides-26.07/prog_guide/mbuf_lib.html).

796. Какие таймеры, retries и state transitions особенно опасны для багов?

   **Ответ:** Особенно опасны timers после release/reuse, duplicate creates, late modify responses, overlapping detach/handover и неполный timeout cleanup. Проверяют применимость события к текущей generation/procedure и предусмотренную реакцию.

   **Типичная ошибка:** Увеличивать timers, чтобы скрыть race или потерянный state transition.

   **Источник:** [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

797. Почему correlation ID и traceability критичны в LTE software?

   **Ответ:** Один инцидент проходит через сменяющиеся local/temporary IDs и несколько протоколов, где нет одного общего сквозного поля. Scoped/time-bounded mappings и точный timeline позволяют связать subscriber, bearer, tunnel и причину отказа.

   **Типичная ошибка:** Считать TEID либо UE IP постоянным уникальным correlation ID всей системы.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

798. Как тестировать LTE-like procedures в интеграционной среде?

   **Ответ:** Нужны stateful peers/UE и контролируемые initial states, message delays/failures, traffic и expected transitions. Помимо success проверяют timers, duplicates, resource cleanup и data delivery при setup/modify/delete под нагрузкой.

   **Типичная ошибка:** Считать успешный pcap replay полноценной integration-проверкой состояний и recovery.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/).

799. Как воспроизводить mobility/QoS/control-plane failures в лаборатории?

   **Ответ:** Управляют channel/mobility profiles, radio/core topology, QoS rules/load и peer faults с сохранённым configuration/timing. Проверяют staged outcomes и восстановление, а IP netem используют как модель transport, не замену всей radio PHY.

   **Типичная ошибка:** Считать случайный loss percent полной моделью handover, fading и GBR contention.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

800. Какие anti-patterns чаще всего встречаются у software engineers, которые смотрят на LTE только как на “ещё одну IP сеть”?

   **Ответ:** Часты игнорирование bearer/session-state, сравнение radio retry с TCP loss, unbounded buffering/retries и диагноз по IP-ping. Нужны protocol-aware lifecycle, scope IDs и multi-layer evidence, поскольку IP underlay — только часть EPS.

   **Типичная ошибка:** Пытаться исправить NAS/security reject настройкой route или socket timeout без причины процедуры.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 24.301: NAS protocol for EPS](https://www.3gpp.org/ftp/Specs/archive/24_series/24.301/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).


### Interview-style
801. Почему LTE считается важной базой перед изучением 5G NR?

   **Ответ:** LTE даёт базу AS/NAS, OFDM/MIMO, scheduling/HARQ, mobility, bearers и control/user separation. При изучении NR/5GS важно затем отделить изменившиеся radio/core concepts, а не переносить все LTE правила буквально.

   **Типичная ошибка:** Считать gNB/MME/UPF просто заменами названий eNodeB/MME/P-GW один к одному.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.501: System architecture for the 5G System](https://www.etsi.org/deliver/etsi_ts/123500_123599/123501/18.08.00_60/ts_123501v180800p.pdf).

802. Какие LTE темы обязан знать networking/software engineer глубоко?

   **Ответ:** Для network/software роли глубоко нужны архитектура/interfaces, state и procedures своей области, packet path, queues/timers и observability. Конкретная специализация определяет глубину scheduler, NAS, security или gateway dataplane, но границы интеграции знать обязательно.

   **Типичная ошибка:** Заучивать все optional features одинаково глубоко без понимания основных runtime invariants.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

803. Какие LTE темы достаточно понимать на уровне инженерной интуиции?

   **Ответ:** Разработчику вне PHY может хватать причинного понимания propagation, MCS, MIMO и link adaptation без вывода всех DSP алгоритмов. Но units, scopes и последствия для timing/throughput должны быть точными, а нормативные implementation details проверяют в spec.

   **Типичная ошибка:** Считать «интуитивно» разрешением путать Hz/bit/s, SNR/RSRP и HARQ/TCP retries.

   **Источник:** [3GPP TR 38.901: Channel model for 0.5 to 100 GHz](https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/18.00.00_60/tr_138901v180000p.pdf); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

804. Как лучше объяснить architecture of LTE за 2–3 минуты на интервью?

   **Ответ:** Кратко показать UE→eNodeB→S-GW→P-GW→PDN как user path, MME/HSS как управление доступом/security/session и policy функции для QoS/charging. Затем объяснить NAS/AS, bearer и mobility как настройку/изменение этого пути.

   **Типичная ошибка:** Рисовать MME посредине пользовательского Internet forwarding path.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

805. Как лучше объяснить difference between MME, SGW and PGW?

   **Ответ:** MME координирует control/NAS/mobility, S-GW связывает access/core user segments и служит anchor в ряде переходов, P-GW завершает PDN connection и policy/addressing. У gateways есть control обязанности, а у обычного user path нет MME hop.

   **Типичная ошибка:** Называть все три узла одинаковыми router и различать только порядок в цепочке.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).

806. Как лучше объяснить control plane vs user plane на практическом примере?

   **Ответ:** Attach/setup control exchanges создают UE/bearer/tunnel-state, после чего user packets идут через radio и gateways. Если setup успешен, но S1-U route сломан, control success и user failure могут наблюдаться одновременно.

   **Типичная ошибка:** Считать planes физически и причинно полностью независимыми.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.413: S1AP](https://www.3gpp.org/ftp/Specs/archive/36_series/36.413/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/).

807. Как лучше объяснить RRC и scheduler без ухода в PHY детали?

   **Ответ:** RRC настраивает connection, bearers, measurements и mobility UE↔eNodeB, MAC scheduler выбирает конкретные передачи по queues/channel/QoS. Они связаны конфигурацией и событиями, но работают с разными задачами и сроками.

   **Типичная ошибка:** Считать RRC выдающим каждое per-TTI PRB allocation.

   **Источник:** [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 36.321: MAC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.321/); [3GPP TS 36.213: Physical layer procedures](https://www.3gpp.org/ftp/Specs/archive/36_series/36.213/).

808. Как лучше объяснить handover с точки зрения real user impact?

   **Ответ:** Показать смену обслуживающей соты с переносом state/path и возможной паузой, затем связать interruption/loss с голосом, видео и TCP. Успех signaling и непрерывность service измеряют отдельно, учитывая real deadlines.

   **Типичная ошибка:** Объяснять user impact только новым уровнем сигнала после перехода.

   **Источник:** [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf); [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [RFC 3819: Advice for Internet Subnetwork Designers](https://www.rfc-editor.org/rfc/rfc3819).

809. Как лучше объяснить QoS в LTE через bearers и application requirements?

   **Ответ:** Для voice и background download нужны разные delay/rate treatment, поэтому flows классифицируют в bearer/QCI с подходящими rate/admission параметрами. Radio/transport/core реализуют решения при конечном ресурсе; ARP не следует путать с packet priority.

   **Типичная ошибка:** Обещать идеальное качество всем приложениям после одного dedicated bearer setup.

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/); [3GPP TS 36.300: E-UTRAN overall description](https://www.etsi.org/deliver/etsi_ts/136300_136399/136300/15.04.00_60/ts_136300v150400p.pdf).

810. Какие вопросы по LTE обычно показывают senior-level понимание, а не заученные определения?

   **Ответ:** Senior уровень показывают разбор partial failures, state lifetime/ID scope, timers/duplicates, control/data consistency, QoS under scarcity и mobility packet fate. Важны проверяемые invariants, evidence для RCA и реалистичные recovery/load tests, а не только happy-path определения.

   **Типичная ошибка:** Подменять конкретный разбор количеством названных сокращений и обещанием «масштабировать горизонтально».

   **Источник:** [3GPP TS 23.401: GPRS enhancements for E-UTRAN access](https://www.etsi.org/deliver/etsi_TS/123400_123499/123401/18.05.00_60/ts_123401v180500p.pdf); [3GPP TS 36.331: RRC protocol specification](https://www.3gpp.org/ftp/Specs/archive/36_series/36.331/); [3GPP TS 29.274: GTPv2 control plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.274/); [3GPP TS 29.281: GTP user plane](https://www.3gpp.org/ftp/Specs/archive/29_series/29.281/); [3GPP TS 23.203: Policy and charging control architecture](https://www.3gpp.org/ftp/Specs/archive/23_series/23.203/).
