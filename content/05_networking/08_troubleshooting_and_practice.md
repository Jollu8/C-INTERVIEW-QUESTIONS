# Вопросы: Troubleshooting и практика (с уклоном в C/C++, Linux и сетевую инженерию)

## 1. Общий подход к сетевой диагностике

### Базовый уровень
1. Что такое network troubleshooting?

   **Ответ:** Это последовательная локализация причины сетевого симптома через наблюдения, проверяемые гипотезы и контролируемые проверки с последующим подтверждением исправления.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

2. Почему сетевые проблемы нельзя диагностировать хаотично?

   **Ответ:** Случайные изменения уничтожают evidence и создают новые переменные. Для каждого действия нужны гипотеза, ожидаемый результат и запись фактического результата.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

3. Почему важно идти от простого к сложному?

   **Ответ:** Дешёвые проверки адреса, маршрута и конкретной ошибки быстро сужают область поиска. Порядок выбирают по вероятности и информативности, а не механически.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

4. Почему важно сначала определить symptom, а не сразу guessing root cause?

   **Ответ:** Сначала фиксируют наблюдаемый отказ и expected behavior. Назвав причину заранее, легко начать искать только подтверждающие её данные.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

5. Что такое symptom, cause и root cause в сетевой диагностике?

   **Ответ:** Symptom — наблюдаемый отказ, cause — вызывающий механизм, root cause — условия, объясняющие его возникновение. Полезная RCA связывает их доказуемой цепочкой.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

6. Почему “интернет не работает” — слишком широкое описание проблемы?

   **Ответ:** Нужно назвать конкретные hostname/IP, protocol/port, операцию, время и ошибку. DNS failure, TCP timeout и HTTP 403 требуют разных проверок.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

7. Какие уточняющие вопросы нужно задать при сетевой проблеме?

   **Ответ:** Уточняют что, откуда, куда, когда и как часто не работает; какой expected result и recent changes. Нужен пример проблемного запроса.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

8. Почему важно понять, проблема постоянная или интермиттирующая?

   **Ответ:** Постоянный отказ можно проверять сразу; intermittent требует временной корреляции и capture во время события. Успех между событиями причину не исключает.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

9. Почему важно знать, затронут один хост, один сервис или вся сеть?

   **Ответ:** Scope показывает общий failure domain: host, subnet, resolver, backend или region. Сравнение affected и healthy объектов помогает найти различающий фактор.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

10. Почему важно различать client-side, network-side и server-side проблему?

   **Ответ:** Это разделяет ownership и подходящие точки измерения. Проверяют send/receive обеих сторон и промежуточные границы, не назначая виновного по одному timeout.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

11. Почему полезно строить troubleshooting по уровням OSI?

   **Ответ:** Модель помогает отделить link, IP, transport и application. Реальный workflow может идти сверху вниз, если ошибка уже локализована на конкретной стадии.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

12. Почему полезно разделять control-plane и data-plane симптомы?

   **Ответ:** Согласованные routes/tunnel state не доказывают доставку packets; существующий dataplane может пережить сбой управления. Проверяют управляющее состояние и actual traffic отдельно.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

13. Что такое baseline и почему он важен в диагностике?

   **Ответ:** Baseline — нормальные latency, error rates, load и topology для сопоставимых условий. С ним изменения интерпретируют относительно реального режима сервиса.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

14. Почему без baseline трудно понять, “плохо” это или “нормально”?

   **Ответ:** Одна величина без контекста не определяет нарушение: RTT 80 мс может быть нормой для дальнего пути и аномалией для соседнего rack.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

15. Почему важно смотреть на recent changes перед поиском экзотических причин?

   **Ответ:** Deploy, firewall, DNS и route changes часто дают проверяемую гипотезу. Совпадение по времени помогает поиску, но само по себе не доказывает причину.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

16. Что такое blast radius проблемы?

   **Ответ:** Blast radius — множество пользователей, workloads, данных и dependencies, затронутых отказом. Его учитывают при выборе mitigation и приоритета response.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

17. Почему полезно определить scope инцидента как можно раньше?

   **Ответ:** Scope помогает выбрать владельца, сравнимую контрольную группу и безопасную mitigation. Широкий incident нельзя оценивать по одному успешному локальному тесту.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

18. Почему полезно собрать timeline событий?

   **Ответ:** Timeline связывает начало impact, changes, метрики и mitigation. Она позволяет отделить исходную причину от последующих cascading failures.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

19. Почему наблюдаемость (observability) важна для troubleshooting?

   **Ответ:** Без telemetry трудно увидеть, на какой стадии и границе остановился запрос. Нужны согласованные logs, metrics, traces и snapshots состояния.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

20. Почему packet capture не всегда нужен первым шагом?

   **Ответ:** Логи могут уже показывать NXDOMAIN, expired cert или явный reject. Capture нужен, когда вопрос касается actual packet exchange и более дешёвых данных недостаточно.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Средний уровень
21. Как выглядит хороший workflow для диагностики сетевой проблемы?

   **Ответ:** Фиксируют impact/scope, строят путь запроса, проверяют стадии, сравнивают affected/healthy, тестируют гипотезы и подтверждают recovery. Изменения и evidence записывают.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

22. Почему стоит сначала проверить DNS/IP/reachability, а не сразу приложение?

   **Ответ:** Ошибки нижележащих стадий делают application diagnosis бессмысленной. Но явный application response позволяет сразу сузить проверку, не проходя весь checklist.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

23. Как отличить отсутствие connectivity от ошибки приложения?

   **Ответ:** Успешный transport и HTTP/application reject указывают на прикладную стадию. Отсутствие ответа требует локализации пути и проверки, получал ли сервер request.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

24. Почему важно проверять проблему несколькими инструментами?

   **Ответ:** Независимые измерения проверяют ограничения друг друга. Например, ping показывает ICMP reachability, а TCP probe и TLS log проверяют путь реального приложения.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

25. Почему нужно уметь отличать false positive от настоящей проблемы?

   **Ответ:** Ложный сигнал может быть особенностью измерения или штатной policy. Иначе mitigation создаст outage там, где исходного нарушения не было.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

26. Что такое reproducibility в troubleshooting?

   **Ответ:** Это возможность повторить симптом в известных условиях. Фиксируют input, environment, версии, load и timings, чтобы сравнивать результаты изменений.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

27. Почему интермиттирующие проблемы самые сложные?

   **Ответ:** Состояние меняется быстрее ручного анализа, а sampling пропускает bursts. Нужны event correlation, history и захват вокруг момента отказа.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

28. Как коррелировать application logs и network symptoms?

   **Ответ:** Связывают timestamp, request/connection ID, endpoint tuple и stage timings. Учитывают clock skew, retries, NAT и proxy legs.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

29. Почему важно различать local issue и upstream issue?

   **Ответ:** Local issue проявляется на конкретном host/interface/namespace; upstream затрагивает общий дальнейший путь. Сравнивают соседние hosts и независимые destinations.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

30. Почему стоит проверять path in both directions?

   **Ответ:** Request и reply могут иметь разные routes, policies и bottlenecks. Успешный исходящий capture не доказывает обратную доставку.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

31. Как asymmetric routing усложняет диагностику?

   **Ответ:** Путь ответа отличается, а stateful devices и source checks могут отвергать traffic. Односторонний traceroute не описывает оба направления.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

32. Почему packet loss в одну сторону может выглядеть как странная latency в другую?

   **Ответ:** Потерянный request или ACK вызывает retransmission/ожидание на другом endpoint. Итоговая request latency включает последствия потерь обоих направлений.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

33. Почему важно понимать, какой именно протокол используется приложением?

   **Ответ:** ICMP, TCP/443 и UDP/53 могут обрабатываться разными правилами и ECMP paths. Тест должен соответствовать реальным protocol, port и family.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

34. Почему TCP и UDP проблемы диагностируются по-разному?

   **Ответ:** TCP имеет handshake, state, ACK/retransmission; UDP не подтверждает доставку на transport уровне. Для UDP особенно важны application responses и обе capture points.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

35. Почему некоторые инструменты misleading в presence of ICMP filtering?

   **Ответ:** Фильтр может запрещать echo/time-exceeded, сохраняя доступность сервиса. Неответивший ICMP probe не равен недоставленному application packet.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

36. Что такое “working as designed”, но воспринимается как баг?

   **Ответ:** Например, firewall намеренно блокирует ICMP, а VPN пропускает только разрешённые prefixes. Сверяют expected behavior с documented policy, а не с предположением.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

37. Почему firewall policy часто выглядит как “сеть сломалась”?

   **Ответ:** Silent drop выглядит как timeout, reject — как быстрый отказ. Нужны rule counters/logs и packet evidence на границе.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

38. Почему NAT может маскировать реальную топологию?

   **Ответ:** Source/destination могут меняться по пути, поэтому tuple в клиентском и серверном capture различается. Для корреляции учитывают translation mappings и время.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

39. Почему overlay/tunnel сети усложняют RCA?

   **Ответ:** Появляются inner/outer addresses, несколько MTU и скрытые forwarding hops. Проверяют отдельно overlay и underlay, включая return path.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

40. Как важно различать network path issue и endpoint resource issue?

   **Ответ:** Network path проверяют packets/counters, endpoint — CPU, queues, sockets и workers. Сервер может получать packets вовремя, но поздно обслуживать request.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

41. Почему CPU saturation на сервере может выглядеть как “сеть тормозит”?

   **Ответ:** Busy CPU задерживает event loop, TLS, parsing и отправку ответа. Пользователь видит latency, хотя сам network transit не изменился.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

42. Почему queueing и buffer pressure могут выглядеть как random loss?

   **Ответ:** При заполнении queues packets/messages ждут или отбрасываются; bursts создают нерегулярные symptoms. Сравнивают queue occupancy, drops и load по времени.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

43. Почему change management и troubleshooting тесно связаны?

   **Ответ:** Changes дают context и возможность controlled rollback. Inventory/config versions нужны, чтобы знать, что реально изменилось на affected объектах.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

44. Когда нужно делать packet capture, а когда достаточно counters/logs?

   **Ответ:** Counters/logs достаточно для явного локализованного отказа. Capture нужен для спорной доставки, timing, retransmissions и protocol exchange; фильтр задают по гипотезе.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

45. Что должен понимать инженер про порядок действий при сетевом инциденте?

   **Ответ:** Сначала оценивают impact и ограничивают ущерб, сохраняя evidence. Дальше локализуют отказ, вносят контролируемое исправление и проверяют user-visible recovery.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

### Продвинутый уровень
46. Как строить hypothesis-driven troubleshooting?

   **Ответ:** Формулируют механизм, предсказывают наблюдаемые признаки, выбирают различающий test и обновляют гипотезу по результату. Неудачная гипотеза тоже полезно сужает поиск.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

47. Как формулировать проверяемые гипотезы для сетевой проблемы?

   **Ответ:** Гипотеза должна давать проверяемое предсказание. Например: «DNS возвращает старый IP; запрос к актуальному IP с сохранением hostname успешно проходит».

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

48. Почему важно исключать целые классы причин, а не проверять всё подряд?

   **Ответ:** Различающая проверка может сразу исключить множество устройств/стадий. Это быстрее, чем последовательно менять случайные параметры каждого компонента.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

49. Как правильно выбирать vantage points для измерений?

   **Ответ:** Выбирают точки до/после предполагаемого boundary и healthy control point. Учитывают namespace, interface, direction, NAT и encryption boundary.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

50. Какой минимальный набор данных нужно собрать до эскалации?

   **Ответ:** Нужны impact/scope, timeline, endpoints/protocol, exact errors, recent changes, topology и результаты проверок. Чувствительные payload/credentials исключают.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

51. Почему плохая observability делает любой network RCA почти невозможным?

   **Ответ:** Без истории и stage signals нельзя уверенно восстановить transient state. Выводы останутся гипотезами; добавляют telemetry, позволяющую проверить следующий occurrence.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

52. Как строить correlation между host metrics, app metrics и network metrics?

   **Ответ:** Строят общую временную шкалу и связывают request latency с CPU, queues, errors и packet counters. Correlation проверяют механизмом и контрольными сравнениями.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

53. Как избежать confirmation bias при troubleshooting?

   **Ответ:** Заранее записывают, что опровергнет гипотезу; рассматривают альтернативы и healthy controls. Не игнорируют факты, противоречащие первоначальному предположению.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

54. Какие anti-patterns чаще всего встречаются у начинающих инженеров?

   **Ответ:** Часты reboot без evidence, несколько changes сразу, доверие одному ping и вывод по одному snapshot. Полезнее фиксировать факты и проверять по одной гипотезе.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

55. Почему “ping проходит, значит сеть в порядке” — плохой вывод?

   **Ответ:** Ping проверяет ICMP exchange, а сервис может ломаться на DNS, TCP port, TLS или application. Нужна проверка реального запроса.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

56. Почему “packet loss есть в traceroute, значит там проблема” — не всегда верно?

   **Ответ:** Intermediate router может ограничивать собственные ICMP ответы, продолжая нормально forwarding. Проверяют downstream/destination и реальный traffic.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

57. Как отличить capacity issue от transient impairment?

   **Ответ:** Capacity issue коррелирует с load/queues и воспроизводимым порогом; transient impairment — с краткими path/link events. Возможны сочетания, поэтому нужны временные данные.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

58. Как distinguish application timeout from transport timeout?

   **Ответ:** Application timeout задаёт deadline операции и может включать DNS/TLS/backend. Transport timeout относится к connect/retransmissions; сохраняют stage и конкретный error.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

59. Какие временные окна нужны для reliable diagnosis intermittent issues?

   **Ответ:** Нужно окно до, во время и после события с разрешением, соответствующим его длительности. Минутные averages не объясняют миллисекундные microbursts.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

60. Как проектировать тесты, которые воспроизводят сетевую проблему controlled way?

   **Ответ:** В lab фиксируют topology, input и load, затем изменяют один фактор: loss, delay, MTU или disconnect. Проверяют и проявление, и recovery.

   **Источник:** [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

61. Как netem/tc помогают в практике troubleshooting?

   **Ответ:** tc/netem моделируют delay, loss, duplication и reordering на выбранном egress. Для двусторонних эффектов настраивают нужные стороны и очищают lab config после опыта.

   **Источник:** [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

62. Как packet capture и flow telemetry дополняют друг друга?

   **Ответ:** Capture даёт packets и timing для узкого окна, flow telemetry — объёмы и распределение множества соединений. Sampling и aggregation limits учитывают явно.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

63. Как строить RCA для проблем, где symptom на L7, а cause на L2/L3/L4?

   **Ответ:** Прослеживают конкретный request до transport/IP/link evidence и показывают причинный механизм. Например, PMTU black hole вызывает retransmissions и затем HTTP deadline.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

64. Какие навыки senior engineer отличают хорошую сетевую диагностику от хаотичной?

   **Ответ:** Отличают scope, выбирают информативные tests, сохраняют evidence и отделяют mitigation от доказательства причины. Также умеют координировать response и обозначать неопределённость.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

65. Какие interview вопросы по troubleshooting лучше всего показывают реальный опыт?

   **Ответ:** Полезны реальные scenarios с неполными данными: ping работает, HTTPS нет; intermittent timeout только через VPN. Оценивают последовательность гипотез и evidence.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Инженерные вопросы
66. Почему troubleshooting — это не набор команд, а метод мышления?

   **Ответ:** Команда полезна лишь при понятном вопросе и expected result. Метод связывает наблюдение с проверяемой моделью системы.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

67. Какие принципы наиболее универсальны для сетевой диагностики?

   **Ответ:** Уточнять symptom/scope, сравнивать с baseline, проверять оба направления, менять по одному фактору и подтверждать recovery реальным запросом.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

68. Что должен особенно хорошо уметь software/network engineer при production incident?

   **Ответ:** Нужно локализовать стадию, снижать impact, сохранять данные и сообщать факты/риски. Важны безопасные changes и координация owners.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

69. Как объяснить свой troubleshooting workflow на интервью?

   **Ответ:** Кратко описывают symptom → scope → path/stages → гипотезы/tests → mitigation → verification → RCA. Один конкретный пример делает workflow проверяемым.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

70. Какие темы troubleshooting обязательны для сильного C/C++ network developer?

   **Ответ:** Нужны DNS/dual stack, routes/MTU, TCP state, socket errors, partial I/O, TLS, capture и host resource diagnosis.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

---

## 2. Инструмент: ping

### Базовый уровень
71. Что делает `ping`?

   **Ответ:** Ping отправляет ICMP Echo Requests и измеряет получение Echo Replies от выбранного destination. Это ограниченная проверка reachability и round-trip timing.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

72. Какой протокол использует `ping`?

   **Ответ:** IPv4 использует ICMP, IPv6 — ICMPv6. Это не TCP или UDP probe конкретного application port.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

73. Что такое ICMP Echo Request?

   **Ответ:** Echo Request — диагностическое ICMP сообщение с identifier, sequence и payload, на которое поддерживающий узел может ответить Echo Reply.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

74. Что такое ICMP Echo Reply?

   **Ответ:** Echo Reply — ответ на Echo Request. По соответствующим identifier/sequence/payload утилита связывает его с отправленной probe.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

75. Что показывает `ping` кроме факта reachability?

   **Ответ:** Показывает RTT samples, долю отсутствующих replies, summary statistics и некоторые header fields. Нельзя автоматически переносить эти показатели на application traffic.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

76. Что такое RTT в выводе ping?

   **Ответ:** RTT — время от отправки request до получения matching reply. Оно включает forward/reverse paths и обработку endpoints.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

77. Что такое packet loss в выводе ping?

   **Ответ:** Это доля отправленных probes, для которых не получен ответ в рамках измерения. Причиной может быть потеря request, reply или ICMP filtering/rate limiting.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

78. Что означает TTL в ответе ping?

   **Ответ:** Для IPv4 это оставшийся TTL полученного reply, а не исходного request. Начальное значение у отправителя обычно неизвестно; IPv6 использует Hop Limit.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

79. Почему ping не проверяет “весь интернет”, а только reachability конкретного узла?

   **Ответ:** Ответ проверяет конкретный адрес и ICMP path в данное время. Другие networks, ports и services могут вести себя иначе.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

80. Почему ping не равен успешному TCP/UDP соединению?

   **Ответ:** TCP/UDP используют свои ports, policies и protocol states. ICMP success не проверяет listener, handshake, TLS и application response.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

81. Что означает, если ping до IP проходит?

   **Ответ:** Удалённый адрес смог ответить на ICMP probe, а reply вернулся. Это не доказывает доступность какого-либо приложения на host.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

82. Что означает, если ping до hostname не проходит?

   **Ответ:** Нужно разделить resolution failure и отсутствие Echo Reply по resolved address. Проверяют A/AAAA и сравнивают с probe к конкретному IP.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

83. Почему hostname issue и IP reachability issue нужно различать?

   **Ответ:** DNS может вернуть ошибку или неверный address при исправном пути к IP. Исправления resolver и route/firewall принципиально различаются.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

84. Что означает timeout в ping?

   **Ответ:** Не получен ожидаемый reply до timeout. По одному этому нельзя определить, был ли потерян request, reply или ответ запрещён policy.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

85. Что означает `Destination Host Unreachable`?

   **Ответ:** Это ICMP unreachable от local host или router, например при neighbour failure. Проверяют, кто прислал сообщение и какой destination оно описывает.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

86. Что означает `Network is unreachable`?

   **Ответ:** Обычно local routing не нашёл применимого пути. Проверяют address family, namespace, routes и policy rules.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

87. Почему ping полезен как первый быстрый тест?

   **Ответ:** Он быстро даёт coarse RTT/reachability сигнал с небольшой настройкой. Результат должен вести к следующей protocol-specific проверке.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

88. Какие ограничения у ping?

   **Ответ:** Ping не проверяет application port, authentication и throughput; ICMP может фильтроваться и иметь другую обработку. RTT не разделяет направления.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

89. Почему некоторые хосты не отвечают на ping специально?

   **Ответ:** Security policy или rate limiting могут подавлять Echo Replies. Такое поведение совместимо с работоспособным TCP/UDP сервисом.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

90. Почему отсутствие ответа на ping не всегда означает проблему?

   **Ответ:** ICMP может быть заблокирован при исправном application path. Сравнивают с настоящим protocol/port, не объявляют host down только по ping.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

### Средний уровень
91. Как интерпретировать jitter по серии ping?

   **Ответ:** Смотрят разброс последовательных RTT и distribution, а не один avg. Это variation ICMP RTT, не точная оценка one-way application jitter.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

92. Почему min/avg/max RTT полезны для диагностики?

   **Ответ:** Min приближает низкую задержку наблюдаемого пути, avg показывает среднюю, max — отдельный tail sample. Без числа samples и distribution вывод ограничен.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

93. Когда высокий RTT в ping указывает на congestion?

   **Ответ:** Если RTT растёт вместе с load и queues, congestion становится вероятной гипотезой. CPU/ICMP scheduling тоже могут увеличить RTT.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

94. Когда spikes RTT могут указывать на queueing?

   **Ответ:** Очереди добавляют переменное ожидание, поэтому bursts RTT могут совпадать с traffic bursts. Подтверждают queue/drops counters и другими probes.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

95. Почему occasional packet loss в ping может быть значимым?

   **Ответ:** Даже редкая настоящая потеря может увеличивать TCP latency и вредить realtime traffic. Сначала исключают ICMP-specific policy и слишком малую выборку.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

96. Когда ICMP rate limiting искажает результаты ping?

   **Ответ:** Router/host может ограничивать Echo responses при частых probes. Наблюдаемая доля ответов тогда описывает rate policy, а не transit packet loss.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

97. Почему ping до gateway — полезный отдельный тест?

   **Ответ:** Он проверяет ближайший L3 hop и часть local link/neighbour path. Успех gateway при отказе remote destination сужает область дальнейшего поиска.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

98. Почему ping loopback, local IP, gateway и remote host дают разные сведения?

   **Ответ:** Loopback проверяет local stack, local IP — локальную address handling, gateway — LAN path, remote host — дальнейшую сеть. Ни один тест не заменяет остальные.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

99. Как ping помогает отличить local stack problem от upstream problem?

   **Ответ:** Сравнивают loopback/local, gateway и несколько remote addresses. Успех loopback не доказывает исправность NIC, кабеля или upstream route.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

100. Почему важно ping-овать и IP, и hostname?

   **Ответ:** Hostname включает resolution и address selection; IP исключает этот этап. Для HTTPS direct-IP тест должен всё равно сохранять expected hostname.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

101. Почему large ping payload может выявлять path MTU issues?

   **Ответ:** Увеличенный packet может превысить PMTU и выявить fragmentation/ICMP проблемы. Для IPv4 полезно явно управлять DF, учитывая IP/ICMP headers.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

102. Что делает флаг flood ping conceptually?

   **Ответ:** Flood mode отправляет probes с очень высокой частотой, оценивая replies на соответствующем rate. Это нагрузочный режим, а не нейтральный connectivity check.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

103. Почему flood ping опасен в production?

   **Ответ:** Он создаёт PPS/CPU load и может активировать rate limits, искажая исходную проблему. В production используют ограниченные rate/count и согласованную цель.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

104. Как TTL в ping помогает косвенно судить о hops?

   **Ответ:** По оставшемуся TTL и предполагаемому initial TTL можно грубо оценить reverse hop count. Неизвестное начальное значение делает оценку неоднозначной.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

105. Почему изменение TTL само по себе редко достаточно для RCA?

   **Ответ:** TTL меняется из-за route, initial settings или разных responders. Без path/config evidence нельзя заключать, что возникла routing failure.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

106. Что означает packet reordering в серии ping?

   **Ответ:** Replies приходят не по порядку sequence numbers. Причиной могут быть reordering requests/replies или различная обработка; это не обязательно потеря.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

107. Как asymmetric path может влиять на RTT interpretation?

   **Ответ:** RTT суммирует разные forward/reverse paths. Изменение RTT не говорит, какое направление ухудшилось; нужны дополнительные vantage points.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

108. Почему wireless/cellular networks могут давать variable ping even when “working normally”?

   **Ответ:** Radio scheduling, retransmissions, interference, power saving и handovers дают переменную latency. Нормальность оценивают по service requirements и baseline.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

109. Как ping помогает проверить packet loss on path?

   **Ответ:** Серия bounded probes оценивает reply loss во времени. Локализацию и применимость к реальному traffic подтверждают другими tests/captures.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

110. Почему ICMP может обрабатываться иначе, чем application traffic?

   **Ответ:** Устройства могут применять разные queues, priorities, ACL и rate limits к ICMP. Ответ самого router также отличается от forwarding transit packets.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

111. Почему ping иногда показывает хуже, чем TCP, а иногда лучше?

   **Ответ:** ICMP может быть deprioritized или rate-limited; application может иметь TLS/queue overhead, которого у Echo нет. Сравнивать нужно одинаковые условия и стадию.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

112. Как `ping -s` помогает в диагностике fragmentation/MTU?

   **Ответ:** `-s` задаёт ICMP payload size; в Linux IPv4 `-M do` запрещает fragmentation. Например, `ping -4 -c 3 -M do -s 1472 192.0.2.1` проверяет 1500-byte IP packet.

   **Типичная ошибка:** Считать 1472 универсальной MTU для VPN и IPv6.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

113. Почему packet size matters in troubleshooting?

   **Ответ:** Размер влияет на PMTU, fragmentation, serialization time и PPS. Маленький probe может пройти там, где большой application packet не доставляется.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

114. Какие типовые ошибки в интерпретации ping делают инженеры?

   **Ответ:** Ошибки: приравнивать Echo к service health, считать каждый timeout transit loss и судить по avg. Учитывают policy, sampling и оба направления.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

115. Что должен понимать software engineer про границы применимости ping?

   **Ответ:** Ping — вспомогательный ICMP probe. Для сервиса нужны реальные DNS/connect/TLS/application checks, соответствующие family и network context.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

### Продвинутый уровень
116. Как ядро обрабатывает ICMP Echo на sender и receiver?

   **Ответ:** Отправитель формирует ICMP message, kernel маршрутизирует его; receiver проверяет/обрабатывает Echo и при разрешении отвечает. Реализация утилиты может использовать datagram ICMP или raw sockets.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

117. Почему ping useful but not definitive for production diagnosis?

   **Ответ:** Он быстро показывает ограниченный path signal, но не проверяет application semantics. Вывод о production impact подтверждают service-level telemetry.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

118. Как ICMP filtering/firewalling маскирует реальную ситуацию?

   **Ответ:** Drop/reject может относиться только к ICMP, а rate limit — к replies. Поэтому отсутствие Echo не локализует отказ и не доказывает application outage.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

119. Как packet capture использовать вместе с ping?

   **Ответ:** Capture matching requests/replies на endpoints показывает фактическую отправку/получение. Сопоставляют identifier/sequence и учитывают направление и clock offset.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

120. Как distinguish loss on request path vs loss on reply path?

   **Ответ:** Захватывают обе стороны: request пришёл, но reply не вернулся — проверяют reply path; request не дошёл — forward path. Один sender capture недостаточен.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

121. Как использовать ping для проверки jitter distribution?

   **Ответ:** Собирают достаточно samples с timestamps и разумным interval, строят percentiles/histogram. Отдельно учитывают lost samples и нагрузку, чтобы не скрыть bursts.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

122. Как timestamping влияет на точность ping measurements?

   **Ответ:** Software timestamps включают scheduling/processing и зависят от реализации clock source. Для точных one-way measurements нужны синхронизация и подходящее timestamping.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

123. Как interpret ping under CPU saturation on endpoint?

   **Ответ:** Busy endpoint может поздно обработать ICMP или доставить reply userspace. Сравнивают CPU/softirq и independent probes, не обвиняют path по одному RTT.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

124. Почему busy userspace or kernel can inflate ping latency?

   **Ответ:** Scheduling задерживает обработку packets и измерение времени. RTT утилиты включает эти delays, поэтому рост не обязательно вызван физическим network transit.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

125. Как ping помогает выявлять microbursts only indirectly?

   **Ответ:** Редкие probes могут попасть в burst queue и показать spike, но часто пропускают короткие события. Для доказательства нужны queue telemetry с достаточным resolution.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

126. Как use ping from multiple vantage points to isolate fault domain?

   **Ответ:** Сравнивают probes из разных subnets/sites и до разных destinations. Общий affected segment помогает выделить failure domain без точного определения виновного устройства.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

127. Какие pitfalls при использовании ping в overlay/VPN/tunnel environments?

   **Ответ:** Проверяют inner/outer destination, routing, tunnel MTU и ICMP policy. Successful outer ping не доказывает работоспособность inner application path.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

128. Как IPv4 ping и IPv6 ping могут давать разную диагностику?

   **Ответ:** IPv4 и IPv6 имеют разные routes, addresses, policies и neighbour discovery. Тестируют оба family явно: успех одного не доказывает другого.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

129. Какие C/C++ или raw socket знания полезны для понимания того, как реализован ping?

   **Ответ:** Полезны sockaddr, network byte order, ICMP headers/checksum, sequence matching, timers и permissions raw sockets. Buffer lengths и parsing должны быть проверены.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

130. Какие interview вопросы по ping хорошо отделяют практику от формального знания?

   **Ответ:** Спросите, почему ping не отвечает при рабочем HTTPS и как отличить request loss от reply loss. Практический ответ учитывает policies и two-sided capture.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

### Инженерные вопросы
131. Почему ping — полезный, но опасный для переинтерпретации инструмент?

   **Ответ:** Простой результат легко принять за полную health check. На самом деле измеряется конкретный ICMP exchange с собственными policy и scheduling limits.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

132. Когда ping должен быть первым шагом, а когда он почти ничего не доказывает?

   **Ответ:** Он полезен для быстрой проверки IP path/RTT, если ICMP ожидаемо разрешён. При явном TLS/HTTP reject информативнее данные соответствующей стадии.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

133. Как объяснить ограничения ping на интервью?

   **Ответ:** Объясняют: ping проверяет ICMP RTT/replies к адресу, не port и не service. Timeout требует дальнейшей локализации и учёта filtering.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

134. Что должен понимать инженер про ICMP, чтобы корректно использовать ping?

   **Ответ:** Нужны Echo semantics, ICMP errors, TTL/Hop Limit и rate limits. ICMP также участвует в сетевых механизмах, поэтому блокировать его целиком опасно.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [RFC 4443: ICMPv6](https://www.rfc-editor.org/rfc/rfc4443); [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

135. Какие anti-patterns чаще всего связаны с ping-based troubleshooting?

   **Ответ:** Anti-patterns: бесконечный/flood probe, игнорирование IPv6, вывод по одному sample и признание сети исправной только по Echo success.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

---

## 3. Инструмент: traceroute

### Базовый уровень
136. Что делает `traceroute`?

   **Ответ:** Traceroute исследует видимые L3 hops серией probes с увеличиваемым TTL/Hop Limit и выводит responders и RTT.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

137. Как traceroute определяет hops на пути?

   **Ответ:** При истечении TTL router может вернуть ICMP Time Exceeded. По ответам на probes с последовательными TTL утилита строит наблюдаемую последовательность.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

138. Почему traceroute использует TTL?

   **Ответ:** TTL ограничивает число forwarding hops. Постепенно увеличивая его, можно вызвать ответы от всё более удалённых routers.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

139. Какую роль играют ICMP Time Exceeded сообщения?

   **Ответ:** Time Exceeded сообщает об исчерпании TTL и включает часть исходного packet для сопоставления probe. Router не обязан отвечать на каждую probe.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

140. Почему traceroute показывает последовательность маршрутизаторов?

   **Ответ:** Разные TTL обычно истекают на последовательных forwarding узлах. Однако ECMP и response source selection делают результат приближённым.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

141. Почему traceroute не всегда показывает все hops?

   **Ответ:** ICMP может фильтроваться, rate-limitиться или скрываться tunnel/MPLS. Отсутствующий responder не означает отсутствующий forwarding hop.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

142. Почему некоторые hops отображаются как `* * *`?

   **Ответ:** Для этих probes не пришёл matching response до timeout. Возможны policy, loss, unreachable reverse path или скрытый hop.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

143. Почему traceroute не гарантирует точную картину data path?

   **Ответ:** Probes могут иметь другой protocol/tuple и идти другим ECMP path, чем приложение. Путь и responders также меняются во времени.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

144. Чем traceroute полезен при диагностике?

   **Ответ:** Он помогает заметить path changes, loops и приблизительную границу отсутствующих responses. Вывод проверяют real-service tests и route evidence.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

145. Чем traceroute ограничен?

   **Ответ:** Не показывает гарантированно все hops, reverse path и фактическую per-link latency. Intermediate response loss не равен transit loss.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

146. Почему разные реализации traceroute используют UDP, ICMP или TCP?

   **Ответ:** Разные transports проходят разные ACL и используют разные destination-completion signals. Выбор должен соответствовать исследуемому service path насколько возможно.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

147. Что означает last hop в traceroute?

   **Ответ:** Это последний отображённый responder; destination достигнут только при соответствующем terminal response. Последняя строка перед timeout может быть промежуточным router.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

148. Почему last hop может не отвечать, даже если сервис работает?

   **Ответ:** Destination может не отправлять ожидаемый terminal ICMP/TCP response, несмотря на доступный сервис. Проверяют actual application request.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

149. Почему traceroute часто используют вместе с ping?

   **Ответ:** Ping оценивает end-to-end Echo, traceroute — видимые промежуточные ответы. Вместе они полезны, но оба имеют ICMP/policy ограничения.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

150. Что такое path discovery на базовом уровне?

   **Ответ:** Path discovery — наблюдение доступной информации о последовательности forwarding boundaries. Это измерение конкретных probes, а не полный topology inventory.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

### Средний уровень
151. Как интерпретировать рост latency по hops?

   **Ответ:** Устойчивый рост, сохраняющийся на последующих hops/destination, указывает на область дополнительной задержки. Один высокий intermediate RTT не локализует bottleneck.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

152. Почему высокий RTT на одном hop не всегда означает проблему именно на нём?

   **Ответ:** Router может поздно сформировать собственный ICMP reply или иметь длинный reverse path. При этом transit packets проходят быстро.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

153. Почему control plane ответа роутера не равен forwarding plane behavior?

   **Ответ:** Control plane генерирует diagnostic replies с отдельными limits/CPU. Forwarding plane пересылает transit traffic по другим ресурсам и policy.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

154. Почему ICMP deprioritization искажает traceroute?

   **Ответ:** Deprioritized ICMP replies приходят поздно или не приходят. Это искажает intermediate RTT/loss без обязательной деградации application forwarding.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

155. Как load balancing влияет на результаты traceroute?

   **Ответ:** Разные probes могут попасть в разные ECMP branches и создать мнимую единую цепочку. Сравнивают flow identifiers и повторяемость результата.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

156. Что такое per-flow и per-packet load balancing в контексте traceroute?

   **Ответ:** Per-flow обычно выбирает путь по tuple, per-packet может разделять packets одного flow. Изменяемые probe ports в classic traceroute меняют flow selection.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

157. Почему разные прогоны traceroute могут показывать разный путь?

   **Ответ:** Причинами бывают route changes, ECMP, different tuples и varying response behavior. Различие не доказывает нестабильность routing.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

158. Почему asymmetric routing ограничивает usefulness traceroute?

   **Ответ:** Каждый RTT включает обратный путь ICMP responder, которого forward trace не показывает. Нужен trace с удалённой стороны и другие observations.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

159. Как traceroute помогает определить, где примерно теряется reachability?

   **Ответ:** Последние стабильные responders ограничивают область гипотез, но дальше может просто фильтроваться ICMP. Проверяют destination service и capture на границах.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

160. Почему packet loss на intermediate hop не всегда равен packet loss through that hop?

   **Ответ:** Router может терять только генерируемые replies из-за rate limit. Если последующие hops/destination отвечают нормально, forwarding loss на нём не подтверждён.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

161. Как TCP traceroute помогает в firewall-restricted environments?

   **Ответ:** TCP probes к разрешённому destination port могут пройти там, где UDP/ICMP probes блокируются. Они всё равно не воспроизводят полный application session.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

162. Когда UDP traceroute misleading?

   **Ответ:** UDP probes могут блокироваться или выбирать другой path, чем реальный TCP сервис. Неответивший UDP destination не означает broken TCP reachability.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

163. Когда ICMP traceroute misleading?

   **Ответ:** ICMP ACL/rate limits и иной flow hash могут отличать probe path от application. Проверяют нужный protocol и destination port.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

164. Как traceroute помогает при подозрении на routing loop?

   **Ответ:** Повторяющиеся routers/patterns при растущем TTL могут указывать на loop. Подтверждают route tables и captures, исключая response/address artifacts.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

165. Как traceroute помогает при blackhole issues?

   **Ответ:** Trace помогает сузить область, где responses исчезают, но silent hops не доказывают black hole. Нужны data-plane probes и evidence по обе стороны boundary.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

166. Как interpret sudden jump in RTT after several hops?

   **Ответ:** Проверяют, сохраняется ли jump до destination и повторяется ли для того же flow. Это может быть long link, queueing или другой reverse path.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

167. Почему MPLS, tunnels и overlays могут скрывать реальный маршрут?

   **Ответ:** Encapsulation может скрывать underlay hops и менять TTL propagation. Видимый trace описывает выбранный logical path, а не каждый физический router.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

168. Как VPN/tunneling искажает traceroute?

   **Ответ:** Внутренние probes видят tunnel как logical segment; outer TTL относится к underlay отдельно. Address/RTT могут отражать tunnel endpoints.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

169. Почему traceroute может не помочь при application-layer проблеме?

   **Ответ:** Routing probes не проверяют TLS trust, authorization и backend execution. При HTTP 500 path discovery часто менее полезен application logs.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

170. Какие ошибки чаще всего делают при анализе traceroute?

   **Ответ:** Ошибки: складывать RTT строк, обвинять первый `*`, считать intermediate loss transit loss и забывать ECMP/reverse paths.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

171. Что должен понимать инженер про useful vs misleading traceroute evidence?

   **Ответ:** Полезны повторяемые destination-impacting patterns и path changes. Отдельные stars/slow replies — только гипотезы до подтверждения другими данными.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

### Продвинутый уровень
172. Как traceroute реализуется на уровне протоколов?

   **Ответ:** Утилита отправляет UDP/ICMP/TCP probes с заданным TTL, сопоставляет ICMP или terminal responses и измеряет RTT. Формат/порты зависят от implementation.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

173. Как TTL manipulation приводит к генерации ICMP Time Exceeded?

   **Ответ:** Router уменьшает TTL при forwarding и при исчерпании отбрасывает packet, обычно формируя Time Exceeded. Policy может подавить ответ.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

174. Почему last hop behavior differs between UDP and TCP traceroute?

   **Ответ:** UDP обычно завершает trace по destination port-unreachable; TCP — по SYN-ACK/RST. Firewall может изменить или скрыть эти признаки.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

175. Как Paris traceroute conceptually improves stability результатов?

   **Ответ:** Paris traceroute старается сохранять flow-defining fields, чтобы уменьшить ECMP variation между probes. Это не устраняет path changes и все варианты balancing.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

176. Почему classic traceroute плохо работает при ECMP/load balancing?

   **Ответ:** Classic probes часто меняют ports, попадая в разные ECMP branches. Результат может выглядеть как путь, которого ни один application flow не проходит целиком.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

177. Как correlate traceroute with routing table and BGP/OSPF data?

   **Ответ:** Локальная routing table показывает выбранный next hop, routing control plane — доступные/выбранные routes. Trace сопоставляют с ними по destination, времени и VRF.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

178. Как combine traceroute with packet captures for deeper RCA?

   **Ответ:** Capture подтверждает probe fields, outgoing interface и returned ICMP quotations. На нескольких boundaries можно отличить forwarding failure от отсутствия diagnostic reply.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

179. Как distinguish control-plane ICMP anomalies from real forwarding issues?

   **Ответ:** Проверяют destination/application loss и downstream replies. Если страдает только ответ intermediate router, это скорее response-plane behavior, но нужны повторные observations.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

180. Какие vantage points нужны, чтобы проверить forward и reverse path?

   **Ответ:** Нужны доступные endpoints с обеих сторон и при необходимости промежуточные captures. Обратный trace — отдельное измерение, а не разворот forward результата.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

181. Как interpret traceroute in cloud environments with hidden networking layers?

   **Ответ:** Cloud может скрывать hops и отдавать synthetic responses. Используют также provider route/security/flow telemetry и реальные endpoint probes.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

182. Почему traceroute по IPv6 может вести себя иначе, чем по IPv4?

   **Ответ:** IPv6 использует Hop Limit, ICMPv6 и отдельную routing topology. ACL и source selection могут отличаться от IPv4.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [RFC 4443: ICMPv6](https://www.rfc-editor.org/rfc/rfc4443).

183. Какие interview вопросы по traceroute хорошо выявляют реальный практический опыт?

   **Ответ:** Полезно спросить, почему intermediate hop теряет 80% replies, а destination — 0%. Ожидаются ICMP limits и distinction response/forwarding planes.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

184. Какие типовые anti-patterns связаны с “over-trusting” traceroute?

   **Ответ:** Вредят вывод о сбое по первой звёздочке, сумма RTT строк и требование симметричного маршрута. Trace нужно читать с учётом protocol и policy.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

185. Что должен понимать C/C++ инженер про то, как traceroute работает под капотом?

   **Ответ:** Нужны TTL/Hop Limit, ICMP quotation parsing, probe matching, timeouts и flow hashing. В implementation проверяют lengths и permissions.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

### Инженерные вопросы
186. Почему traceroute — это инструмент интерпретации, а не абсолютной истины?

   **Ответ:** Ответы формируются независимыми узлами с собственными limits и reverse paths. Только контекст protocol/topology делает наблюдение полезным.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

187. Когда traceroute особенно полезен?

   **Ответ:** Полезен при path changes, suspected loops и reachability differences между sites. Особенно информативно сравнение с прежним trace того же flow.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

188. Когда traceroute почти бесполезен без дополнительных данных?

   **Ответ:** Мало помогает при скрытом underlay, ICMP filtering и явных L7 failures. Нужны provider/endpoint telemetry и actual protocol requests.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

189. Как объяснить traceroute на интервью без ухода в лишние детали?

   **Ответ:** Кратко: probes с растущим TTL вызывают ответы последовательных routers, пока не достигнут destination. Stars/RTT ограничены policy, ECMP и reverse paths.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

190. Какие ограничения traceroute обязан знать любой network/software engineer?

   **Ответ:** Обязательны понимание ICMP filtering, ECMP, asymmetric routing, hidden tunnels и различия intermediate response loss и transit loss.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

---

## 4. Инструменты: nslookup / dig

### Базовый уровень
191. Что делает `nslookup`?

   **Ответ:** nslookup выполняет DNS queries и показывает ответы выбранного resolver. Его результат не обязательно совпадает с системным name-service lookup приложения.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

192. Что делает `dig`?

   **Ответ:** dig отправляет настраиваемый DNS query и показывает header, status, sections, TTL, server и query timing. Удобен для точного сравнения responses.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

193. Чем `dig` обычно полезнее `nslookup`?

   **Ответ:** dig удобно управляет type, server, recursion, TCP и output, сохраняя protocol details. Выбор инструмента вторичен относительно правильного запроса и контекста.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

194. Что такое DNS query?

   **Ответ:** DNS query запрашивает данные для name, type и class, например IN AAAA для example.com. Response содержит status и соответствующие sections.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

195. Что такое A record?

   **Ответ:** A связывает DNS name с IPv4 address. У имени может быть несколько A records с разными addresses.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

196. Что такое AAAA record?

   **Ответ:** AAAA связывает DNS name с IPv6 address. Наличие записи не гарантирует исправный IPv6 path от клиента.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

197. Что такое CNAME?

   **Ответ:** CNAME указывает canonical name для alias. Resolver должен получить требуемые данные конечного имени, если они не уже доступны в response/cache.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

198. Что такое MX record?

   **Ответ:** MX задаёт mail exchanger и preference для домена. Это не IP address; адреса mail server получают отдельными queries.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

199. Что такое NS record?

   **Ответ:** NS задаёт authoritative nameservers зоны. Делегация у parent и данные child zone должны быть согласованы.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

200. Что такое PTR record?

   **Ответ:** PTR связывает reverse-DNS name с именем host, обычно в in-addr.arpa или ip6.arpa. Это не доказательство authenticated identity.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

201. Что значит “resolve hostname”?

   **Ответ:** Это получение адресов или других нужных данных для имени через настроенную name-service систему. Она может включать hosts, cache и DNS.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

202. Почему DNS нужно проверять отдельно от IP reachability?

   **Ответ:** IP path может работать при сломанном resolver, и наоборот. Разделение стадий позволяет не менять routing ради NXDOMAIN.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

203. Что означает, если `ping IP` работает, а `ping hostname` — нет?

   **Ответ:** Вероятны resolution/record/address-selection проблемы, но hostname мог выбрать другой family/IP. Сравнивают exact resolved addresses, а не только текст имени.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

204. Какой базовый вопрос отвечает `dig example.com`?

   **Ответ:** Он обычно запрашивает A record у resolver из configuration. Смотрят status, ANSWER, SERVER и timing, а не только наличие строки IP.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

205. Что такое authoritative answer?

   **Ответ:** Ответ authoritative server за данные его зоны помечается AA. Cached response recursive resolver может быть правильным, не имея AA.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

206. Что такое TTL в DNS ответе?

   **Ответ:** TTL задаёт допустимый срок кеширования RR; в cached reply обычно виден оставшийся срок. Это не IP hop limit.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

207. Что такое NXDOMAIN?

   **Ответ:** NXDOMAIN означает отсутствие запрошенного имени в соответствующем DNS view. Отсутствие только данного record type обычно даёт NOERROR/NODATA.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

208. Что значит SERVFAIL?

   **Ответ:** SERVFAIL означает, что server не смог завершить обработку, например из-за upstream или DNSSEC failure. Это не утверждение об отсутствии имени.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

209. Почему DNS failure часто выглядит как “сеть не работает”?

   **Ответ:** Без адреса приложение не начинает connect к сервису. Пользователь видит общий отказ, хотя IP network может быть исправна.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

210. Почему `dig` — ключевой инструмент для базовой сетевой диагностики?

   **Ответ:** dig позволяет явно зафиксировать name, type, server и flags. Это делает ответы и различия между DNS stages проверяемыми.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

### Средний уровень
211. Как проверить, какой DNS server используется?

   **Ответ:** Смотрят SERVER в dig и system resolver configuration; при stub проверяют его upstreams. Приложение может использовать собственный resolver/DoH.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

212. Как запросить конкретный DNS server через `dig`?

   **Ответ:** Используют `dig @192.0.2.53 example.com A`. Проверяют, что запрос идёт из нужного namespace и разрешён policy.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

213. Чем recursive lookup отличается от iterative trace?

   **Ответ:** Recursive resolver выполняет lookup за клиента; iterative lookup следует referrals. `+trace` проводит собственный путь и не повторяет полностью поведение local resolver.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

214. Что показывает `dig +trace`?

   **Ответ:** Он показывает цепочку DNS referrals от root к authoritative servers и ответы по дороге. Direct queries могут блокироваться network policy.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

215. Как определить, проблема в local resolver или upstream authoritative path?

   **Ответ:** Сравнивают application/stub, configured resolver и authoritative responses с учётом view. Успешный direct lookup не исключает проблемы DNSSEC/cache у resolver.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

216. Почему stale cache может вводить в заблуждение?

   **Ответ:** Кеш может продолжать выдавать старые данные до expiry или по serve-stale policy. Разные resolvers и приложение могут иметь разные caches.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

217. Как проверить TTL и cache behavior?

   **Ответ:** Повторяют одинаковый query к одному resolver и наблюдают TTL/answers. Cache hit не следует определять только по низкому RTT.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

218. Что такое CNAME chain и как она влияет на lookup?

   **Ответ:** Это последовательность aliases до конечной записи. Дополнительные names/zones могут требовать новых queries и увеличивать число failure dependencies.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

219. Почему long CNAME chains вредны operationally?

   **Ответ:** Цепочки добавляют lookup work, latency и зависимости от нескольких zones. Возможны loops, inconsistent TTLs и более сложное recovery.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

220. Как distinguish DNS issue from connectivity issue?

   **Ответ:** Проверяют resolution отдельно, затем соединение с выбранным IP с сохранением application hostname. Для HTTPS нельзя заменять имя на IP и игнорировать identity.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

221. Почему IPv4/IPv6 DNS records могут давать разное поведение приложения?

   **Ответ:** Приложение может сначала выбрать AAAA и попасть на broken IPv6 path либо получить другой backend. Проверяют обе records и обе family paths.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

222. Что такое split-horizon DNS?

   **Ответ:** Split-horizon DNS выдаёт разные данные в зависимости от клиента/view, например private addresses внутри VPN и public снаружи.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

223. Как split DNS усложняет troubleshooting?

   **Ответ:** Результат зависит от resolver, source network и VPN state. Проверка с ноутбука вне incident environment может показывать правильный, но нерелевантный ответ.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

224. Почему internal и external DNS views могут давать разные ответы?

   **Ответ:** Это может быть намеренная policy для private services, geo routing или isolation. Сверяют expected view, а не требуют полного совпадения всегда.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

225. Как проверить reverse DNS?

   **Ответ:** Используют `dig -x 192.0.2.10`. Проверяют PTR и при необходимости отдельное forward lookup возвращённого имени.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

226. Когда reverse DNS важно practically?

   **Ответ:** Reverse DNS используют в mail policy, diagnostics и log presentation. Он не заменяет TLS identity и не гарантирует доверие host.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

227. Как DNSSEC может влиять на troubleshooting?

   **Ответ:** DNSSEC validation failure может давать SERVFAIL при достижимых servers. Проверяют validation diagnostics, signatures, chain и часы; AD зависит от trust к resolver.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

228. Почему timeout в DNS lookup отличается от NXDOMAIN?

   **Ответ:** Timeout означает отсутствие своевременного response; NXDOMAIN — полученный DNS outcome. Их retries, caching и причины принципиально различаются.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

229. Что означает truncated response?

   **Ответ:** TC flag означает, что ответ был усечён для выбранного transport/size. Клиенту обычно нужно повторить query по TCP.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

230. Когда DNS использует TCP вместо UDP?

   **Ответ:** TCP используют при truncation, zone transfers и других режимах; обычный DNS также должен поддерживать TCP. Проверяют firewall для UDP и TCP/53.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

231. Как packet capture помогает при DNS troubleshooting?

   **Ответ:** Capture показывает queries/responses, retries, flags, IDs и timings. Включают UDP/TCP и loopback stub, а для DoH/DoT нужны endpoint logs.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

232. Какие типовые ошибки интерпретации `dig` встречаются?

   **Ответ:** Ошибки: игнорировать status/type/server/view, считать NODATA NXDOMAIN и приравнивать dig к getaddrinfo. Проверяют реальный client context.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

233. Что должен понимать software engineer про DNS troubleshooting beyond “nslookup не работает”?

   **Ответ:** Нужны resolver path, caches/TTL, A/AAAA selection, retry budget и отличие DNS errors от connect errors.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

### Продвинутый уровень
234. Как resolver behavior влияет на observed application latency?

   **Ответ:** Search domains, retry intervals, multiple servers, cache и family selection добавляют задержку до connect. Измеряют actual application resolution stage.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

235. Как diagnose intermittent DNS failures?

   **Ответ:** Логируют resolver/server, type, status и timings вокруг события, сравнивают clients/views. Проверяют packet loss, overload, expiry и DNSSEC events.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

236. Как distinguish packet loss to resolver from resolver overload?

   **Ответ:** Two-sided capture показывает доставку query и время response; server metrics показывают processing queues. Отсутствие reply у клиента не различает эти причины.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

237. Как compare answers from multiple resolvers to detect propagation/split-view issues?

   **Ответ:** Запрашивают одинаковые name/type в одно время и записывают answers/TTL/server. Различия интерпретируют с учётом intentional views, caches и authoritative state.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

238. Какие метрики useful for DNS troubleshooting: RTT, SERVFAIL rate, NXDOMAIN rate, cache hit ratio?

   **Ответ:** Нужны query rate/latency, status mix, timeouts, retries, cache hits и upstream failures. Метрики разделяют по resolver/view/type.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

239. Как application retries can amplify DNS issues?

   **Ответ:** Aggressive retries увеличивают query load при медленном resolver, ухудшая outage. Используют bounded retries, backoff и общий deadline.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

240. Как TTL choices affect failover and troubleshooting?

   **Ответ:** Короткий TTL ускоряет adoption новых данных, но повышает load; длинный снижает load и задерживает failover. Приложения могут кешировать по собственной политике.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

241. Какие pitfalls при тестировании DNS через containerized/cloud environments?

   **Ответ:** Внутри container могут быть другой resolv.conf, search suffixes, stub и network policy. Диагностику выполняют в namespace workload.

   **Источник:** [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

242. Как `dig +trace` может помочь и в чём его ограничения?

   **Ответ:** Trace помогает найти broken delegation/authoritative reachability. Он не повторяет recursive cache, DNSSEC policy и split view реального resolver.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

243. Как DNS over TLS / DNS over HTTPS усложняют observability?

   **Ответ:** Wire capture видит encrypted transport к resolver, но не DNS messages. Нужны telemetry клиента/resolver и корректная identification DoH/DoT endpoint.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

244. Как C/C++ приложение взаимодействует с resolver через `getaddrinfo()` и как это влияет на диагностику?

   **Ответ:** getaddrinfo проходит configured name-service path и возвращает список candidates или EAI error. Он не является просто эквивалентом одного dig A query.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

245. Какие interview вопросы по DNS troubleshooting показывают реальный опыт?

   **Ответ:** Полезен сценарий: dig успешен, getaddrinfo медленный. Ожидаются NSS/hosts, search domains, AAAA, resolver context, cache и timing budget.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

246. Какие anti-patterns опасны при интерпретации DNS результатов?

   **Ответ:** Вредят flush всех caches до evidence, query из другой view и вывод по одному resolver. Не трактуют TTL как обещание глобальной мгновенной propagation.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

247. Что должен понимать инженер о negative caching?

   **Ответ:** Отрицательные ответы тоже кешируются по правилам negative caching. После создания имени старый NXDOMAIN может оставаться у resolvers до истечения соответствующего срока.

   **Источник:** [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

248. Как correlate DNS timing with application timeout symptoms?

   **Ответ:** Инструментируют lookup start/end и connect отдельно. Сопоставляют queries/retries с request deadline, не относят всё pre-connect ожидание к TCP.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

249. Почему DNS может быть root cause, даже если “сама сеть” в порядке?

   **Ответ:** Ошибочный DNS address, delegation или validation ломает discovery исправного сервиса. Достижимость IP не обеспечивает корректного name resolution.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

250. Как объяснить DNS troubleshooting workflow на интервью?

   **Ответ:** Проверяют exact name/type/view, configured resolver и application lookup, затем authoritative path/cache/transport. Подтверждают исправление из исходного environment.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

### Инженерные вопросы
251. Почему `dig` — один из самых мощных простых инструментов в сетевой диагностике?

   **Ответ:** Небольшая команда раскрывает DNS-level status, sections, TTL и выбранный server. Управление flags/type делает гипотезы воспроизводимыми.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

252. Какие DNS темы особенно важны software engineer?

   **Ответ:** Особенно важны A/AAAA, aliases, TTL/negative cache, getaddrinfo, search domains и retries. Нужны отдельные stage timings.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

253. Когда проблема “не открывается сайт” чаще DNS, чем transport?

   **Ответ:** Если lookup явно возвращает ошибку/неверный address, а connection к правильному endpoint с сохранением hostname работает, DNS становится сильной гипотезой.

   **Источник:** [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

254. Как отличить DNS outage от upstream service outage?

   **Ответ:** При DNS outage discovery fails; при upstream service outage правильные records есть, но connect/TLS/request fails. Возможны оба события одновременно.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

255. Какие знания о DNS debugging обязательны для network/C++ engineer?

   **Ответ:** Нужно различать EAI errors и errno, понимать candidate list, dual stack, NSS/resolver context и packet-level DNS. Обязателен общий request deadline.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

---

## 5. Анализ проблем: нет connectivity

### Базовый уровень
256. Что означает “нет connectivity”?

   **Ответ:** Это отсутствие нужного обмена с конкретным destination по заданным protocol/port/family. Необходимо назвать проверяемую операцию, а не только host.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

257. Почему важно уточнить: нет connectivity до чего именно?

   **Ответ:** Gateway, resolver, public IP и backend используют разные paths/policies. Конкретный destination позволяет построить проверяемую модель отказа.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

258. Как отличить “не открывается сайт” от “нет IP reachability”?

   **Ответ:** Проверяют DNS, route, TCP connect, TLS и HTTP отдельно. Неоткрывающийся сайт может возвращать application error при полностью исправном IP path.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

259. С чего начать диагностику отсутствия connectivity?

   **Ответ:** Фиксируют endpoint/error/time/scope, затем проверяют interface/address, route/neighbor и actual protocol. Сравнивают healthy host из того же environment.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

260. Почему стоит проверить local interface up/down state?

   **Ответ:** Admin state и carrier указывают, может ли interface передавать packets. `ip -brief link` и link counters помогают отделить local link failure.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html).

261. Почему стоит проверить IP address на интерфейсе?

   **Ответ:** Нужны правильные family, prefix, scope и lifetime. Без подходящего source address или с tentative/expired address packets могут не отправляться ожидаемым образом.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

262. Почему default gateway — один из первых checkpoints?

   **Ответ:** Default gateway часто является next hop для удалённых prefixes. Но конкретный destination может идти по более специфичному route или policy table.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

263. Почему DNS нужно проверять отдельно?

   **Ответ:** Resolution может ломаться при рабочей IP connectivity. Проверяют name/type/resolver и отдельно путь к resolved destination.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

264. Почему firewall/local policy могут полностью имитировать отсутствие сети?

   **Ответ:** Policy может молча отбрасывать packets до/после host, создавая timeout. Проверяют firewall counters/logs и фактический path.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

265. Как проверить loopback, local IP, gateway, remote IP и hostname по очереди?

   **Ответ:** В Linux делают bounded probes к 127.0.0.1/::1, local address, gateway и remote IP, затем lookup имени. Результаты дополняют actual service probe.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

266. Почему этот порядок полезен?

   **Ответ:** Каждый шаг расширяет охват пути и помогает выделить первую failing boundary. Однако ICMP restrictions могут нарушать такое упрощённое сравнение.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

267. Что означает, если loopback работает, а gateway — нет?

   **Ответ:** Local stack отвечает, но возможны NIC/link, address/prefix, VLAN, neighbour или ICMP policy проблемы до gateway. Проверяют route и ARP/NDP.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

268. Что означает, если gateway reachable, а internet IP — нет?

   **Ответ:** Local segment частично работает; дальше проверяют routing/NAT/firewall/upstream и remote ICMP policy. Один remote ping не определяет отказ всего Internet.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

269. Что означает, если remote IP reachable, а hostname — нет?

   **Ответ:** Вероятны DNS или выбранный AAAA/другой IP. Проверяют actual resolution и connection к каждому candidate.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

270. Почему ARP/NDP нужно учитывать в локальной проблеме?

   **Ответ:** Для локального next hop нужен корректный L2 neighbour mapping. INCOMPLETE/FAILED может указывать на VLAN/link/peer issue, даже если route существует.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

### Средний уровень
271. Какой чеклист полезен при отсутствии connectivity на Linux-хосте?

   **Ответ:** Минимум: `ip -brief address`, `ip route get 192.0.2.10`, `ip rule`, `ip neigh`, `ss -lntup`, lookup и targeted capture. Выполняют в namespace приложения.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

272. Как routing table влияет на отсутствие connectivity?

   **Ответ:** Route определяет next hop, interface и часто source address. Проверяют lookup для нужного source/family/mark, а не только наличие default entry.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

273. Что означает отсутствие default route?

   **Ответ:** Destination без более специфичного route может быть недостижим. При policy routing default может существовать в другой table; отсутствие в main не окончательный диагноз.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

274. Что означает wrong subnet mask/prefix?

   **Ответ:** Host может считать remote address on-link или отправлять local peer через gateway. Это приводит к неверному neighbour resolution/next hop.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

275. Как duplicate IP address может ломать connectivity?

   **Ответ:** Neighbour caches переключаются между MAC, а replies попадают другому host. Проверяют conflict announcements, switch data и address inventory.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

276. Как DHCP failure проявляется как no connectivity?

   **Ответ:** Host может не получить address, route или resolver configuration либо сохранить устаревшую lease. Проверяют lease state и DHCP exchange, не только interface up.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

277. Как stale ARP entry может ломать доступ?

   **Ответ:** Packet уходит старому MAC, например после перемещения адреса. Подтверждают mapping и ARP/NDP exchange; без причины массово очищать caches не следует.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

278. Как MTU black hole может выглядеть как partial connectivity?

   **Ответ:** Handshake и small messages проходят, а большие packets не доставляются и не вызывают рабочий PMTUD. Симптом — зависание transfer при доступном port.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

279. Почему small pings pass, but larger traffic fails?

   **Ответ:** Большой packet может превышать PMTU, а small probe — нет. Также возможны size-dependent filtering и loss; проверяют packet sizes и ICMP errors.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

280. Как NAT/firewall может ломать только часть направлений?

   **Ответ:** Rules/selectors могут зависеть от destination, protocol, source и state. Неверная translation/return policy ломает лишь matching subset flows.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

281. Почему service can be reachable locally but not remotely?

   **Ответ:** Listener может bind только loopback, remote firewall запрещает port или отсутствует обратный route. Проверяют bound address/family и remote path.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

282. Как ACL/filtering отличить от routing issue?

   **Ответ:** Route lookup показывает intended next hop, capture — actual отправку, filter counters — policy hit. ICMP reject помогает, но silent drop требует нескольких точек.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

283. Как packet capture помогает при полном отсутствии connectivity?

   **Ответ:** Проверяют, отправляется ли request, доходит ли до destination и выходит ли reply. Capture выбирают на реальном interface/namespace и сопоставляют tuples.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

284. Какие counters интерфейса важны при no-connectivity incident?

   **Ответ:** Важны carrier, RX/TX packets, errors/drops и NIC-specific counters. Берут deltas за incident window, а не только накопленный total.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

285. Как distinguish physical/link issue from IP/routing issue?

   **Ответ:** Link issue подтверждают carrier/errors и L2 observations; IP issue — address/route/neighbor и protocol evidence. Interface UP без carrier не означает физическую связь.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

286. Как distinguish server down from network unreachable?

   **Ответ:** Проверяют server health с независимого path и capture на destination. Timeout с одной стороны не отличает выключенный host от dropped packets.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

287. Как container/netns/VM overlay environments усложняют диагностику?

   **Ответ:** У workload отдельные interfaces, routes, resolver и policies. Host-level success не доказывает container/VM path; проверяют veth/bridge/overlay boundaries.

   **Источник:** [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

288. Почему IPv6 can fail while IPv4 works, and vice versa?

   **Ответ:** Семейства имеют отдельные routes, neighbour mechanisms, addresses и ACL. Dual-stack testing должно проверять оба явно.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4443: ICMPv6](https://www.rfc-editor.org/rfc/rfc4443).

289. Как application-specific port blocking looks compared to full no-connectivity?

   **Ответ:** Другие ports/protocols работают, а конкретный flow получает drop/reject или refusal. Проверяют listener и rule match для точного tuple.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

290. Какие ошибки инженеры чаще всего пропускают в basic connectivity RCA?

   **Ответ:** Часто пропускают wrong namespace/family, loopback bind, prefix/source selection, return route и ICMP policy. Фиксируют exact context теста.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

### Продвинутый уровень
291. Как построить hypothesis tree для no-connectivity problem?

   **Ответ:** Дерево: discovery → local link/address → route/neighbor → transport/policy → TLS/application. На каждом ветвлении выбирают test, разделяющий классы причин.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

292. Как isolate fault domain between host, access network, upstream router and destination?

   **Ответ:** Сравнивают local, adjacent и remote vantage points и captures по обе стороны boundaries. Общая affected область сужает fault domain без поспешного blame.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

293. Как use packet capture on both ends to see where packets disappear?

   **Ответ:** Сопоставляют request/reply по tuple, sequence и времени с учётом NAT. Где packet наблюдается до boundary и отсутствует после, там уточняют path/capture completeness.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

294. Как infer directionality of failure from SYN, ICMP and ARP/NDP evidence?

   **Ответ:** ARP/NDP failure указывает на next-hop resolution; SYN без SYN-ACK — на open-path problem; ICMP сообщает конкретную category/отправителя. Доказательство направления требует captures.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

295. Как overlay/tunnel misconfiguration manifests as no connectivity?

   **Ответ:** Неверные endpoints/keys, missing routes, AllowedIPs/selectors, MTU и forwarding могут разорвать inner path при исправном underlay. Проверяют оба уровня.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [WireGuard: Protocol and Cryptokey Routing](https://www.wireguard.com/).

296. Как asymmetric policy routing complicates no-connectivity analysis?

   **Ответ:** Source/mark/VRF могут выбрать неожиданный table и reverse path. Проверяют rules и lookup с теми же selectors, что у application.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

297. Как cloud security groups / NACLs / host firewall differ symptomatically?

   **Ответ:** Эти фильтры работают на разных boundaries и могут различаться statefulness. По timeout нельзя определить слой; сверяют конкретную cloud semantics, flow logs и host counters.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

298. Как app connect timeout, ICMP unreachable and TCP RST help narrow root cause?

   **Ответ:** Timeout означает отсутствие успешного завершения, ICMP unreachable даёт network hint, RST — активный transport отказ. Ни один сам по себе не доказывает конкретного виновника.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

299. Как C/C++ приложение видит no-connectivity через errno and socket behavior?

   **Ответ:** Blocking connect возвращает error или ждёт; nonblocking может вернуть EINPROGRESS, затем результат читают через SO_ERROR после readiness. Сохраняют errno и stage.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

300. Что значат `ENETUNREACH`, `EHOSTUNREACH`, `ETIMEDOUT`, `ECONNREFUSED` practically?

   **Ответ:** ENETUNREACH — недоступна сеть; EHOSTUNREACH — host/path unreachable; ETIMEDOUT — истёк transport wait; ECONNREFUSED — активный отказ. Точный источник определяют дополнительными данными.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

301. Как distinguish path MTU blackhole from server slowness?

   **Ответ:** PMTU issue часто зависит от размера и показывает повторные большие segments без progress. Server slowness проверяют receipt/processing timings и здоровые size variants.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

302. Какие telemetry and logs must be collected for solid RCA?

   **Ответ:** Нужны address/route/rules/neighbor snapshots, firewall/NIC deltas, socket/application errors и targeted capture. Всё связывают временем, namespace и changes.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

303. Как reproduce no-connectivity failure safely in test environment?

   **Ответ:** В lab namespaces/VM контролируемо меняют route, filter или link и проверяют application errors/recovery. Fault injection ограничивают тестовой topology.

   **Источник:** [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

304. Какие interview вопросы по no-connectivity diagnosis действительно показывают опыт?

   **Ответ:** Сценарий: localhost service работает, remote connect timeout. Ожидаются bind address/family, listener, inbound request, firewall и return path.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

305. Какие anti-patterns чаще всего ломают качественный RCA?

   **Ответ:** Мешают simultaneous changes, выключение firewall целиком, restart без evidence и проверки из wrong namespace. Успех после restart не доказывает root cause.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

### Инженерные вопросы
306. Почему отсутствие connectivity — не одна проблема, а целый класс причин?

   **Ответ:** Одинаковый timeout дают address, route, neighbour, policy, remote health и protocol issues. Нужно найти конкретную failing stage.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

307. Какие проверки должны выполняться автоматически в голове инженера?

   **Ответ:** Нужно проверить exact endpoint/family, source context, link/address, route/neighbor, listener, policy и обратный путь. Порядок зависит от уже известной ошибки.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

308. Как объяснить no-connectivity troubleshooting на интервью?

   **Ответ:** Описывают конкретный symptom, проверки local path и destination, evidence обоих направлений, затем controlled fix и real-request verification.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

309. Что должен особенно хорошо уметь C/C++ network developer при such incidents?

   **Ответ:** Нужно правильно читать socket states/errors, instrument stages и связывать code behavior с packet path. Partial I/O и nonblocking completion нельзя принимать за connectivity failure.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

310. Какие темы no-connectivity обязательно знать глубоко?

   **Ответ:** Глубоко нужны routing/source selection, ARP/NDP, firewall/NAT, namespaces, dual stack, MTU и connect semantics.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

---

## 6. Анализ проблем: высокая задержка

### Базовый уровень
311. Что такое высокая задержка в сетевом контексте?

   **Ответ:** Это превышение допустимого времени сетевого обмена относительно baseline/SLO. Уточняют RTT, one-way или end-to-end request latency.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

312. Чем latency отличается от slowness в общем смысле?

   **Ответ:** Slowness может означать низкий throughput, медленную обработку или startup. Latency — время конкретной операции, которое нужно измерять с явными границами.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

313. Почему высокая latency не всегда означает packet loss?

   **Ответ:** Propagation, queues и processing могут задерживать packets без потери. Loss — отдельный сигнал, хотя retransmissions часто увеличивают latency.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

314. Почему высокая latency может быть и network, и server, и application проблемой?

   **Ответ:** Request проходит DNS, connection setup, queues, execution и transfer. Общую задержку разбивают на эти стадии, прежде чем назначать fault domain.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

315. Как ping помогает заметить high latency?

   **Ответ:** Ping даёт ICMP RTT samples, полезные для сравнения с baseline. Application latency требует отдельных измерений из того же environment.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

316. Почему average latency недостаточна без max/p95/p99?

   **Ответ:** Average скрывает редкие медленные запросы. Нужны percentiles, distribution, sample count и timeouts; max зависит от длительности наблюдения.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

317. Что такое latency spike?

   **Ответ:** Spike — кратковременный рост задержки относительно нормального уровня. Важны duration, affected requests и correlation с load/events.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

318. Почему intermittent latency особенно сложна?

   **Ответ:** Периодические snapshots часто попадают между событиями. Нужны per-request timing, высокое временное разрешение и данные до/после spike.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

319. Как queueing влияет на задержку?

   **Ответ:** Время ожидания в очередях входит в latency и растёт при приближении к capacity. Неограниченная очередь превращает overload в долгие timeouts.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

320. Почему distance/propagation delay не единственная причина latency?

   **Ответ:** Добавляются serialization, queueing, endpoint scheduling, retransmissions и protocol round trips. Близкие hosts тоже могут иметь высокий tail latency.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

321. Почему congestion повышает latency?

   **Ответ:** При превышении доступной скорости packets ждут в queues или теряются. TCP recovery и retries дополнительно увеличивают observed request time.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

322. Почему bufferbloat повышает latency?

   **Ответ:** Чрезмерные queues удерживают packets при нагрузке, сохраняя throughput ценой большого RTT. Это особенно заметно при одновременном bulk transfer.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

323. Как retransmissions повышают observed latency?

   **Ответ:** Потерянные данные/ACK требуют повторов и ожидания recovery; TCP также может снизить sending rate. Это увеличивает completion time.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

324. Почему DNS lookup тоже может добавлять latency?

   **Ответ:** Resolution может включать network queries, search domains, retries и cache misses. Его latency возникает до TCP connect и требует отдельного измерения.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

325. Что нужно уточнить при жалобе “всё тормозит”?

   **Ответ:** Уточняют операцию, expected latency, affected users/endpoints, family, timing distribution и changes. Разделяют startup, response time и transfer throughput.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Средний уровень
326. Как отличить network latency от server processing latency?

   **Ответ:** Используют client/server stage timings и traces; capture показывает network exchange на boundaries. Для one-way subtraction clocks должны быть достаточно согласованы.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

327. Почему TCP handshake time полезен в диагностике?

   **Ответ:** Handshake RTT даёт transport setup signal до application execution. Повторы SYN и server backlog могут увеличить его; сравнивают с established-connection RTT.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

328. Как traceroute помогает при latency issues?

   **Ответ:** Trace может показать path detour и устойчивый RTT jump до destination. Intermediate replies оценивают с учётом reverse paths и ICMP scheduling.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

329. Почему traceroute limited for latency RCA?

   **Ответ:** RTT каждого hop включает свой reverse path и control-plane response time. Нельзя просто вычитать соседние строки и получить точную link latency.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

330. Как local interface queue drops correlate with high latency?

   **Ответ:** Queue buildup может одновременно повышать latency и drops. Но drops бывают на других queues/стадиях; нужны соответствующие interval counters.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

331. Как Wi-Fi/cellular variability влияет на latency?

   **Ответ:** Radio scheduling, contention, retransmissions, handovers и power saving дают variable RTT. Сравнивают radio conditions и actual service requirements.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

332. Почему tail latency важнее average latency для user experience?

   **Ответ:** Редкие долгие запросы особенно заметны пользователю и усиливаются при fan-out. Percentiles показывают этот эффект, скрытый average.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

333. Как packet size влияет на latency symptoms?

   **Ответ:** Large packets дольше сериализуются и могут столкнуться с PMTU; many small packets увеличивают PPS/CPU. Сравнивают size distributions при одинаковой операции.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

334. Почему congestion на одном узле path может вызывать spikes throughout session?

   **Ответ:** Общий congested link задерживает packets многих flows; recovery может влиять на последующие requests. Correlation проверяют queue/load observations.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

335. Как overloaded firewall/NAT/LB device проявляется как latency?

   **Ответ:** Устройства добавляют queues, задерживают new connections или теряют packets/state. Смотрят latency по legs, state occupancy, CPU и drops.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

336. Как CPU saturation on endpoint inflates network-looking latency?

   **Ответ:** Packet processing, TLS и event loop получают CPU поздно, увеличивая response time. Это отделяют от network transit через receipt/processing timestamps.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

337. Как application thread starvation masquerades as network delay?

   **Ответ:** Готовый socket не обслуживается, пока worker/event loop занят. Request ждёт в kernel/application queue, хотя path доставил bytes вовремя.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

338. Почему нужно измерять latency from multiple vantage points?

   **Ответ:** Разные точки имеют разные routes, access links и endpoint load. Сравнение выделяет общий segment или конкретный client context.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

339. Как asymmetric path complicates latency interpretation?

   **Ответ:** RTT не разделяет направления; reverse path может быть длиннее или congested. Нужны remote probes/captures и осторожная интерпретация timestamps.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

340. Как delayed ACK / Nagle / small writes influence latency-sensitive apps?

   **Ответ:** Nagle может задержать small write при unacked data, delayed ACK — подтверждение. Для latency-sensitive traffic рассматривают batching/TCP_NODELAY, измеряя реальный эффект.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

341. Как high RTT affects TCP throughput?

   **Ответ:** Для заполнения path нужен достаточный bytes-in-flight относительно bandwidth-delay product. Ограниченные congestion/receive windows снижают throughput при большом RTT.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

342. Как queue buildup shows in packet capture?

   **Ответ:** На одной capture point queue delay может быть не виден напрямую. Сравнивают timings на boundaries, ACK/RTT и kernel queue telemetry; one-sided spacing не доказывает очередь.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

343. Какие counters и графики нужны для high-latency RCA?

   **Ответ:** Нужны stage p50/p95/p99, timeouts, RTT/retransmissions, CPU/scheduler, queue depth, NIC drops и changes. Сопоставляют одинаковые time windows.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

344. Как distinguish steady high latency from jitter bursts?

   **Ответ:** Steady delay стабильно сдвигает distribution, bursts формируют tail/variance и временные spikes. Смотрят series и histogram, не только одну summary.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

345. Какие common mistakes happen when diagnosing latency complaints?

   **Ответ:** Ошибки: avg-only, ping вместо request timing, смешение DNS/TLS/processing и вывод по intermediate trace. Таймауты тоже включают в анализ.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Продвинутый уровень
346. Как decompose end-to-end latency into DNS, connect, TLS, request, server and transfer components?

   **Ответ:** На клиенте ставят timestamps начала/конца DNS, connect, TLS, write, first byte и completion. Server traces разбивают processing/dependencies; phases могут перекрываться при pooling/streaming.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

347. Как packet capture helps measure handshake and response phases precisely?

   **Ответ:** Capture показывает SYN exchange, data/ACK и first response packet. Для encrypted application boundaries нужны endpoint timings; capture drops/clock placement ограничивают точность.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

348. Как correlate kernel queueing, NIC stats and app timing?

   **Ответ:** Синхронизируют interval app timings, qdisc/NIC counters и scheduler/softirq data. Проверяют причинный порядок и location counters, а не только похожие графики.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

349. Как bufferbloat manifests in ping, TCP RTT and application metrics?

   **Ответ:** Под bulk load растут ping RTT, TCP RTT и request tails, затем снижаются после drain. Подтверждают queue occupancy и исключают endpoint CPU saturation.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

350. Как use tc/netem to reproduce latency pathologies?

   **Ответ:** В lab задают delay/variation/loss на нужных directions и измеряют stage timings/recovery. Не путают искусственный egress delay с полным bidirectional RTT.

   **Источник:** [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

351. Как p50 vs p99 analysis changes RCA conclusions?

   **Ответ:** Хороший p50 при плохом p99 указывает на редкие stalls, bursts или отдельные cohorts. Улучшение average может не исправить user-visible tail.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

352. Как coordinated omission can hide real latency problems?

   **Ответ:** Генератор, ожидающий completion перед следующим request, недодаёт load именно во время stalls. Измеряют scheduling delay/заданный arrival rate и не исключают timeout samples.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

353. Как instrument C/C++ applications to separate network wait from user-space delays?

   **Ответ:** Используют monotonic clock для durations и timestamps стадий I/O, readiness, callback start и processing. Correlation IDs связывают client/server logs.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

354. Как event loop starvation or thread contention inflate perceived network latency?

   **Ответ:** Socket ready не означает немедленный handler execution. Измеряют event-loop lag, runnable/blocked threads и lock waits, чтобы отделить userspace delay.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

355. Как distinguish congestion-induced delay from routing detour?

   **Ответ:** Detour подтверждают path/route change и persistent baseline shift; congestion — load-correlated queues/drops. Оба фактора могут действовать вместе.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

356. Как packet pacing and queue discipline tuning can reduce latency?

   **Ответ:** Pacing сглаживает bursts, queue discipline/AQM ограничивает excess queueing. Настройки проверяют под representative load, сохраняя throughput и fairness.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

357. Как identify latency bottleneck in multi-hop distributed service chains?

   **Ответ:** Distributed traces показывают critical path и waits между services. Проверяют connection pools, dependencies и fan-out tails, а не складывают несвязанные averages.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

358. Какие interview вопросы по latency troubleshooting показывают engineering maturity?

   **Ответ:** Спросите, почему p50 нормальный, p99 вырос и ping стабилен. Ожидаются queue/lock/GC-like stalls, cohorts, traces и корректная нагрузочная модель.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

359. Какие anti-patterns чаще всего вредят latency RCA?

   **Ответ:** Вредят исключение timeouts, avg-only, несогласованные clocks, сравнение разной нагрузки и tuning без baseline. Network blame без decomposition не проверяем.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

360. Что должен глубоко понимать инженер про latency, прежде чем говорить “сеть медленная”?

   **Ответ:** Нужно определить границы измерения, latency budget, distribution и влияние queues/retries. Без этого слово «медленно» не локализует компонент.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Инженерные вопросы
361. Почему высокая задержка — одна из самых коварных сетевых проблем?

   **Ответ:** Одинаковая request latency возникает из разных стадий, а intermittent tails плохо видны averages. Исправление требует temporal и stage decomposition.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

362. Какие компоненты latency budget чаще всего игнорируют?

   **Ответ:** Часто забывают DNS, connection pool wait, TLS, scheduling, retries/backoff и client-side queues. Их включают в общий deadline операции.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

363. Как объяснить latency troubleshooting на интервью через decomposition?

   **Ответ:** На примере показывают time budget стадий и место роста, затем hypothesis/test/fix. Проверяют improved distribution и user-visible result, включая tails.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

364. Какие знания особенно важны software engineer для latency-sensitive systems?

   **Ответ:** Важны deadlines, monotonic timing, queueing, nonblocking I/O, batching, RTT/BDP и tracing. Оптимизируют measured critical path, сохраняя correctness.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

365. Какие темы high-latency RCA нужно знать глубоко?

   **Ответ:** Глубоко нужны distributions, phase timing, queueing/overload, transport recovery и endpoint scheduling. Correlation всегда дополняют проверкой механизма.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

---

## 7. Анализ проблем: потери пакетов

### Базовый уровень
366. Что такое packet loss?

   **Ответ:** Packet loss — недоставка packet до выбранной точки наблюдения. Нужно указать направление, уровень, interval и способ измерения.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

367. Почему packet loss возможен даже в работающей сети?

   **Ответ:** Сеть имеет конечные buffers и capacity, а links/devices могут ошибаться. Небольшие transient потери не обязательно означают полный отказ услуги.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

368. Как ping помогает увидеть packet loss?

   **Ответ:** Ping считает missing Echo Replies за серию probes. Это loss ICMP exchange, который включает оба направления и response policy.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

369. Почему ping loss не всегда равен application loss?

   **Ответ:** ICMP и application traffic могут иметь разные ACL, priorities, paths и rates. Сначала подтверждают loss на реальном protocol/flow.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

370. Как packet loss влияет на TCP?

   **Ответ:** TCP повторно передаёт данные, может снижать sending rate и задерживает ordered delivery до заполнения gap. Итог — рост latency и снижение throughput.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

371. Как packet loss влияет на UDP?

   **Ответ:** UDP сам не повторяет и не подтверждает datagrams. Приложение видит gaps только при собственных sequence/ack mechanisms либо замечает timeout/ухудшение качества.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

372. Почему loss и latency часто связаны?

   **Ответ:** Queues одновременно добавляют delay и при overflow теряют packets; retransmission дополнительно задерживает completion. Но возможна latency без loss и loss без роста RTT.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

373. Почему burst loss обычно хуже random loss?

   **Ответ:** Серия consecutive losses труднее восстанавливается и может превышать FEC/interpolation возможности realtime приложения. Эффект зависит от protocol и loss pattern, не только среднего процента.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

374. Что такое retransmission как symptom потерь?

   **Ответ:** Повтор того же TCP sequence range означает, что sender не получил достаточного подтверждения. Причиной может быть data/ACK loss, reordering или spurious recovery.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

375. Почему небольшая потеря может сильно ломать некоторые приложения?

   **Ответ:** Realtime имеет tight deadlines, а short TCP requests чувствительны к recovery timeout. Один потерянный критический packet может определять completion всей операции.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

### Средний уровень
376. Какие основные причины packet loss?

   **Ответ:** Основные классы: congestion/queue overflow, link errors, filtering/policing, MTU, host buffer/CPU exhaustion и application drops. Измерение capture тоже может терять данные.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

377. Как congestion вызывает loss?

   **Ответ:** При превышении service rate очередь заполняется, после чего packets отбрасываются либо AQM отбрасывает/маркирует раньше. Смотрят load и queue counters.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

378. Как queue overflow вызывает loss?

   **Ответ:** Finite buffer не принимает новый packet при исчерпании capacity. Drop может происходить в NIC, kernel, qdisc или application queue, поэтому важен location counter.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

379. Как bad cable/NIC/driver может давать loss?

   **Ответ:** Ошибки physical transmission, RX ring exhaustion или driver defects могут терять packets. Проверяют link/NIC error deltas и system logs.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html).

380. Как wireless interference or fading дают loss?

   **Ответ:** Низкий SINR увеличивает radio retransmissions и вероятность окончательной недоставки. Upper layers видят loss/delay, хотя причина находится на radio link.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

381. Как policer/shaper/firewall can look like packet loss?

   **Ответ:** Policer dropает превышение policy rate, shaper задерживает и может dropнуть при полном buffer, firewall намеренно запрещает matching traffic. Это разные mechanisms.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

382. Как MTU mismatch может выглядеть как loss?

   **Ответ:** Oversized packets могут отбрасываться без успешного PMTUD, тогда потери зависят от размера. Проверяют ICMP too-big/fragmentation-needed и tunnel overhead.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191).

383. Почему drops на receive queue хоста и drops в сети — не одно и то же?

   **Ответ:** Packet мог дойти до NIC, но не попасть в socket/application из-за ring/buffer pressure. Network transit тогда исправен, но end-to-end delivery нет.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

384. Как interpret packet loss only on one protocol?

   **Ответ:** Подозревают protocol-specific policy, queues или endpoint behavior. Сравнивают одинаковые destinations/family/rates и проверяют firewall/application counters.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

385. Почему TCP retransmissions are a critical clue?

   **Ответ:** Они показывают, что transport восстанавливает неподтверждённые data. Но счётчик retransmissions не равен точному числу потерянных IP packets.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

386. Как `netstat -s`, `ss`, `ip -s link` помогают при loss diagnosis?

   **Ответ:** `ss -ti` показывает per-socket transport data, protocol stats — агрегаты, `ip -s link` — interface counters. Берут interval deltas и учитывают scope.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

387. Какие interface counters особенно важны?

   **Ответ:** Нужны RX/TX errors/drops, CRC/frame errors, missed/no-buffer и queue-specific drops, если доступны. Значение зависит от driver; total RX dropped не называет root cause.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html).

388. Как packet capture помогает увидеть retransmissions, dup ACKs, gaps?

   **Ответ:** TCP sequence/ACK ranges показывают gaps и recovery, duplicate ACKs — повторное подтверждение. Анализатору нужны полный capture и учёт offloads/reordering.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

389. Почему packet capture не всегда позволяет доказать, где именно теряется пакет?

   **Ответ:** Одна точка показывает только проходившие через неё packets. Observer может терять capture, а path может меняться; нужны несколько согласованных points.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

390. Как multiple vantage points помогают pinpoint loss domain?

   **Ответ:** Сопоставляют одну последовательность packets до/после boundaries. Это сужает область недоставки, если известны routing, translation и полнота captures.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

391. Как distinguish sender-side drop from network drop from receiver-side drop?

   **Ответ:** Проверяют sender syscall/qdisc/NIC, наблюдения на path и receiver NIC/kernel/socket. Отсутствие packet в userspace не доказывает внешнюю потерю.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

392. Почему high CPU on host can create drops without external network fault?

   **Ответ:** CPU/softirq не успевают обслуживать rings и sockets, buffers переполняются. Смотрят scheduling/softirq и drop counters в том же interval.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

393. Как buffer sizing влияет на host-side loss?

   **Ответ:** Малые buffers не выдерживают bursts, большие увеличивают memory/queueing. Размер выбирают по measured burst/service rate, не вместо устранения sustained overload.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

394. Как loss проявляется в приложении на C/C++?

   **Ответ:** TCP обычно скрывает loss через recovery, оставляя slow I/O/timeouts; UDP приложение может видеть sequence gaps. Нужны собственные counters и корректный partial I/O.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

395. Какие common mistakes делают при анализе packet loss?

   **Ответ:** Ошибки: считать retransmission точным loss, обвинять intermediate traceroute hop и игнорировать capture drops. Важны direction, observation point и policy.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

### Продвинутый уровень
396. Как correlate TCP retransmissions with interface drops and queue pressure?

   **Ответ:** Сопоставляют per-flow recovery с interval NIC/qdisc/socket drops и load. Aggregate counter может относиться к другим flows, поэтому одного совпадения недостаточно.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

397. Как distinguish true path loss from packet capture loss on observer host?

   **Ответ:** Проверяют capture dropped statistics, buffer sizing, offloads и missing observations с другой стороны. Анализируют ACK progression: gap в capture при нормальном ACK может быть артефактом.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

398. Как use sequence numbers, ACK patterns and timestamps to reason about loss?

   **Ответ:** Sequence ranges и ACK/SACK показывают подтверждённые и missing bytes, timestamps — recovery timing. Reordering и lost ACKs не позволяют объявлять каждый gap path loss.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

399. Как asymmetric loss paths complicate RCA?

   **Ответ:** Потеря ACK может вызвать повтор data, доставленного receiver. Для направления нужны captures обоих endpoints и понимание routes.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

400. Как microbursts create loss without obvious average bandwidth saturation?

   **Ответ:** Короткий burst переполняет очередь, даже если минутный average низкий. Нужны queue/drop events и measurements с подходящим временным разрешением.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

401. Как policers differ from congested queues symptomatically?

   **Ответ:** Policer часто даёт drops около заданного rate/burst allowance без долгой очереди; congestion может сопровождаться RTT growth. Подтверждают configuration/counters, а не только pattern.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

402. Как use synthetic traffic tests to characterize loss behavior?

   **Ответ:** В lab меняют rate, size, concurrency и direction, фиксируя sequence counters и latency. Нагрузку повышают контролируемо и отделяют generator limits.

   **Источник:** [ESnet: iperf3](https://software.es.net/iperf/invoking.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

403. Как FEC, retransmission and buffering trade off against loss in realtime apps?

   **Ответ:** FEC добавляет bandwidth/CPU для восстановления без RTT; retransmission требует времени; buffering скрывает variation ценой latency. Решение зависит от deadline и loss pattern.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

404. Как instrument C/C++ services to detect downstream vs upstream packet loss symptoms?

   **Ответ:** Логируют per-direction bytes/progress, TCP_INFO при доступности, UDP sequence gaps и socket drops. Сопоставляют с remote telemetry; приложение не видит напрямую каждый path drop.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

405. Как interpret UDP loss in high-rate applications where app drops may dominate?

   **Ответ:** Сравнивают NIC, kernel/socket drops и application sequence counters. Медленный reader может терять datagrams после успешной доставки host, поэтому проверяют CPU и receive buffer.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

406. Какие interview вопросы по packet loss diagnosis действительно проверяют практику?

   **Ответ:** Спросите, почему UDP sequence gaps растут без link errors и при свободном uplink. Ожидаются socket buffers, CPU/read loop, application queue и capture limits.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

407. Какие anti-patterns чаще всего мешают реальному loss RCA?

   **Ответ:** Вредят бессистемное увеличение buffers, ping-only conclusions, отсутствие baseline и single-point blame. Изменения делают после локализации drop boundary.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

408. Как build a production-ready loss investigation playbook?

   **Ответ:** Playbook задаёт scope/direction, real-flow reproduction, interval counters, two-sided capture, host checks и verification recovery. Сохраняют data до tuning/restart.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

409. Какие metrics must be retained historically to analyze intermittent loss?

   **Ответ:** Хранят rates, retransmissions, interface/socket/queue drops, CPU/softirq, RTT и change events. Sampling interval должен позволять увидеть relevant bursts.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

410. Что должен глубоко понимать инженер про packet loss beyond “есть потеря/нет потери”?

   **Ответ:** Нужно знать где, когда, в каком направлении и как измерен loss; его pattern и impact на protocol. Процент без контекста недостаточен.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

### Инженерные вопросы
411. Почему packet loss — это symptom, а не root cause?

   **Ответ:** Один symptom вызывают congestion, link error, policy и receiver overload. Root cause объясняет конкретный механизм drop и условия его возникновения.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

412. Какие классы причин потерь обязан быстро перебрать инженер?

   **Ответ:** Быстро проверяют path congestion, physical/NIC errors, policy/policer, PMTU и endpoint resource exhaustion. Отдельно проверяют measurement artifacts.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

413. Как объяснить packet-loss troubleshooting на интервью?

   **Ответ:** Описывают scope/direction, подтверждение actual-flow loss, counters/captures до и после boundary, root mechanism и controlled recovery verification.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

414. Какие темы packet loss особенно важны для TCP-heavy systems?

   **Ответ:** Важны ACK/SACK, retransmission/reordering, recovery timers, cwnd/RTT и host drops. Нужно отличать data loss от ACK loss и capture artifacts.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

415. Какие темы packet loss особенно важны для realtime/UDP systems?

   **Ответ:** Важны application sequence numbers, late versus lost datagrams, receive drops, pacing, FEC и deadline-aware recovery. Average loss не описывает burst impact.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

---

## 8. Bottlenecks в сети

### Базовый уровень
416. Что такое bottleneck в сети?

   **Ответ:** Bottleneck — ресурс/стадия, ограничивающая достижимую скорость полезной обработки при данном workload. Он может меняться с load и packet size.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

417. Почему bottleneck не всегда находится там, где highest utilization?

   **Ответ:** Процент utilization может скрывать одну перегруженную queue/core или hard quota. Ресурс с высоким aggregate utilization не обязательно ограничивает critical path.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

418. Как bottleneck влияет на throughput?

   **Ответ:** Он ограничивает goodput независимо от capacity остальных stages. После ускорения одного bottleneck ограничителем может стать следующий.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

419. Как bottleneck влияет на latency?

   **Ответ:** При нагрузке около service capacity растут queues и response time; при overflow появляются drops. Даже до полного throughput limit tail latency может нарушить SLO.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

420. Почему bottleneck может быть в сети, на хосте или в приложении?

   **Ответ:** Каждая стадия имеет конечную service rate: link, NIC, kernel, CPU, parser, storage и backend. Request проходит весь этот pipeline.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

421. Чем bandwidth bottleneck отличается от CPU bottleneck?

   **Ответ:** Link limit измеряется доступной transmission capacity; CPU limit — стоимостью обработки и scheduling. Одинаковый throughput может упираться в разные resources.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

422. Чем queue bottleneck отличается от routing problem?

   **Ответ:** Queue buildup означает ожидание ограниченной service capacity; routing issue — неправильную/отсутствующую forwarding decision. Они требуют разных evidence и исправлений.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

423. Почему bottleneck важно локализовать, а не просто “увидеть медленно”?

   **Ответ:** Иначе tuning неограничивающего ресурса не улучшит результат. Нужно найти stage, где образуется backlog или заканчивается доступная capacity.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

424. Какие симптомы у bottleneck чаще всего?

   **Ответ:** Типичны plateau goodput, рост latency/queue depth, drops и saturating per-resource counters. Проверяют одновременно user impact и workload characteristics.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

425. Почему один bottleneck может скрывать другой?

   **Ответ:** Медленная ранняя стадия не позволяет нагрузить последующие. После её ускорения обнаруживается следующий предел; это нормальное свойство pipeline.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

### Средний уровень
426. Как определить, bottleneck link это или endpoint limitation?

   **Ответ:** Измеряют path capacity и endpoint CPU/queues/windows, меняют sender/receiver либо workload. Network benchmark тоже может быть endpoint-limited.

   **Источник:** [ESnet: iperf3](https://software.es.net/iperf/invoking.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

427. Почему high utilization не всегда bad, а low utilization не всегда good?

   **Ответ:** Высокий utilization допустим при соблюдении SLO, а low average скрывает bursts, per-core saturation и quotas. Нужны relevant scope и resolution.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

428. Как BDP связан с throughput bottleneck?

   **Ответ:** BDP = bandwidth × RTT задаёт bytes-in-flight для заполнения path. Меньшее effective window может ограничить throughput ниже link capacity.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

429. Почему small socket buffers могут выглядеть как network bottleneck?

   **Ответ:** Ограниченные send/receive buffers могут уменьшать progress/in-flight data или приводить к stalls/drops. Но autotuning и congestion state тоже влияют.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

430. Как TCP window limitation masquerades as path limitation?

   **Ответ:** Малое rwnd/cwnd ограничивает outstanding bytes, и sender не заполняет доступный link. Смотрят effective windows, RTT и receiver consumption.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

431. Как queueing on one hop manifests at application level?

   **Ответ:** Данные приходят позже, application waits растут, retries могут усилить нагрузку. Transport/application backpressure переносит влияние bottleneck на другие stages.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

432. Как NAT/firewall/load balancer can become hidden bottleneck?

   **Ответ:** Ограничителями становятся state table, PPS, CPU, TLS offload или configured rate. Проверяют per-leg latency и appliance counters, не только link utilization.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

433. Как DNS or control-plane dependencies can become perceived bottleneck?

   **Ответ:** Медленный resolver или control plane задерживает создание новых sessions при исправной передаче established traffic. Разделяют setup и steady-state throughput.

   **Источник:** [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

434. Как server disk/CPU/back-end latency may look like network bottleneck?

   **Ответ:** Server поздно создаёт или читает данные, поэтому socket простаивает или window уменьшается. Capture плюс processing/IO metrics отделяет это от path capacity.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

435. Как load tests help reveal bottlenecks?

   **Ответ:** Контролируемое увеличение offered load показывает throughput plateau, queue growth и error onset. Тест должен воспроизводить реальную смесь requests и sizes.

   **Источник:** [ESnet: iperf3](https://software.es.net/iperf/invoking.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

436. Почему short benchmarks can misidentify bottlenecks?

   **Ответ:** Короткий run может измерять startup, slow start, warmup или cache effects. Он также пропускает thermal, queue и periodic resource limits.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

437. Какие counters и metrics useful for bottleneck analysis?

   **Ответ:** Нужны goodput/offered load, RTT/latency, errors/drops, CPU per core, queue depth, NIC stats и effective windows. Анализируют deltas одного interval.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

438. Почему throughput нужно анализировать вместе с latency and drops?

   **Ответ:** Высокий throughput может достигаться с неприемлемыми queues и loss; низкий — быть demand-limited. Полезный результат оценивают вместе с SLO и resource cost.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

439. Как traceroute помогает и в чём ограничен для bottleneck detection?

   **Ответ:** Trace показывает path/RTT hints, но не измеряет capacity каждого link и не отделяет reply-plane delays. Bottleneck подтверждают load/resource evidence.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

440. Как packet capture помогает понять bottleneck behavior?

   **Ответ:** Capture показывает pacing, in-flight behavior, ACK/window/recovery и idle gaps. Без endpoint telemetry эти признаки не определяют bottleneck однозначно.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

441. Как distinguish policer from true capacity bottleneck?

   **Ответ:** Policer задаёт policy rate/burst и соответствующие drops; physical capacity limit связан с ресурсом пути. Проверяют configuration и controlled rate sweep.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

442. Как distinguish wireless radio bottleneck from core transport bottleneck?

   **Ответ:** Сравнивают radio metrics/scheduling с backhaul/core counters и probes до разных boundaries. Radio retries и variable allocation могут влиять на RTT/goodput без core congestion.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

443. Какие mistakes чаще всего допускают при bottleneck analysis?

   **Ответ:** Часты вывод по average bandwidth, игнорирование generator/receiver limits и tuning многих knobs сразу. Необходимо измерить workload и limiting stage.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

444. Что должен понимать software engineer про bottlenecks in distributed systems?

   **Ответ:** Critical path включает pools, queues и dependencies, а fan-out усиливает tail. Bottleneck может мигрировать, поэтому нужна сквозная telemetry, а не локальные averages.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

445. Какие interview вопросы по bottlenecks проверяют зрелое понимание?

   **Ответ:** Спросите, почему link свободен, а goodput ограничен при высоком RTT. Ожидаются BDP/windows, application demand, CPU и проверки, различающие причины.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

### Продвинутый уровень
446. Как systematically locate bottleneck across host stack, NIC, access link, core and remote endpoint?

   **Ответ:** Сопоставляют per-stage load/queues, заменяют endpoints/path и варьируют size/rate/concurrency. Доказательство — предсказуемое изменение результата при воздействии на предполагаемый limiter.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

447. Как combine RTT growth, cwnd behavior, retransmissions and throughput to infer bottleneck type?

   **Ответ:** RTT growth с load указывает на queues, recovery — на loss/reordering, small cwnd/rwnd — на transport limits. Все признаки проверяют с endpoint/resource data.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

448. Как microbursts and shallow buffers create hidden bottlenecks?

   **Ответ:** Неглубокие буферы могут отбрасывать краткие bursts при низком average load. Нужны per-queue drop stats и high-resolution observations, иначе bottleneck выглядит случайным.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

449. Как queue disciplines, pacing and shaping alter bottleneck behavior?

   **Ответ:** Pacing сглаживает packet bursts, shaping переносит очередь к управляемому rate, AQM ограничивает excess delay. Меняются loss/latency, но физическая capacity не увеличивается.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

450. Как use controlled experiments to move bottleneck and validate hypothesis?

   **Ответ:** В lab меняют один ресурс: CPU quota, rate, buffer или concurrency. Если plateau/queue сдвигается предсказанно, гипотеза получает подтверждение; ищут следующий limiter.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

451. Как instrument C/C++ network service to identify whether it is producer-limited, consumer-limited or path-limited?

   **Ответ:** Измеряют producer/consumer rates, queue age/depth, socket blocked time и bytes progress. Producer idle, receiver backpressure и path recovery имеют разные signatures.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

452. Как asynchronous processing and thread pools can obscure real bottlenecks?

   **Ответ:** Очереди и handoffs скрывают время ожидания от одного handler timer. Нужны timestamps enqueue/dequeue, pool utilization и end-to-end tracing.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

453. Как cloud/virtualization layers create hidden network-like bottlenecks?

   **Ответ:** vCPU scheduling, virtual NIC queues, shared hosts и bandwidth/PPS quotas создают пределы вне приложения. Используют guest и provider telemetry, сравнивают placements.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

454. Какие historical metrics are needed to catch transient bottlenecks?

   **Ответ:** Хранят rates, latency distributions, queue/drops, CPU/softirq, window/recovery и quota/change events. Слишком грубая aggregation скрывает bursts.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

455. Какие anti-patterns особенно опасны при bottleneck RCA?

   **Ответ:** Опасны tuning без hypothesis, unlimited queues, benchmark только localhost и игнорирование dropped/timed-out requests. Проверяют bottleneck и после изменений.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

456. Как design capacity tests that surface true bottlenecks rather than artifacts?

   **Ответ:** Проверяют generator capacity, representative sizes/mix, warmup, duration и arrival model. Отдельно фиксируют errors/timeouts и нагрузку наблюдающих инструментов.

   **Источник:** [ESnet: iperf3](https://software.es.net/iperf/invoking.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

457. Как explain bottleneck analysis clearly on interview?

   **Ответ:** Пример: goodput plateau при свободном link; measured rwnd/RTT объясняет предел; ускорение reader увеличивает window и throughput. Вывод строят на numbers и test.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

458. Какие bottleneck topics особенно важны для high-performance C++ networking?

   **Ответ:** Важны PPS versus BPS, batching/copies/allocations, per-core/NUMA, rings, queueing, socket windows и event-loop lag. Оптимизация начинается с measured limiter.

   **Источник:** [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

459. Как distinguish steady-state bottleneck from transient congestion?

   **Ответ:** Steady limit воспроизводится при sustained workload; transient congestion связан с bursts/events и исчезает после drain. Длительность и resolution теста принципиальны.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

460. Что должен глубоко понимать senior engineer про bottleneck behavior?

   **Ответ:** Нужно понимать queueing, resource scope, demand versus capacity и migration bottleneck. Local optimization оценивают через end-to-end SLO и следующий limiter.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

### Инженерные вопросы
461. Почему bottleneck analysis — центральная часть performance troubleshooting?

   **Ответ:** Performance ограничен самым значимым constrained stage. Его локализация позволяет тратить effort на изменение, реально влияющее на user result.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

462. Какие bottleneck classes стоит всегда держать в голове?

   **Ответ:** Классы: link/PPS, CPU/scheduling, memory/copies, queues/state, windows/RTT, storage/dependencies и configured quotas. Реальный limit может сочетать несколько.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

463. Как объяснить bottleneck reasoning на интервью через concrete examples?

   **Ответ:** Например, увеличение socket buffer не поможет, если receiver thread занят CPU. Измеряют queue/window/CPU, устраняют verified limiter и повторно проверяют SLO.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

464. Какие знания особенно важны для engineers working on packet processing or low-latency systems?

   **Ответ:** Важны serialization/PPS cost, cache/NUMA, batching, IRQ/rings, pacing и tail latency. Нужен контроль overhead instrumentation и корректности оптимизаций.

   **Источник:** [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

465. Какие темы bottlenecks обязательно знать глубоко?

   **Ответ:** Глубоко нужны BDP/windows, queueing, saturation signals, workload design, endpoint stack и controlled experiments. Это позволяет отделять physical limits от artifacts.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

---

## 9. Диагностика по уровням OSI

### Базовый уровень
466. Почему модель OSI полезна в troubleshooting?

   **Ответ:** OSI помогает разделять hypotheses по функциям: link, addressing, transport и application. Это упорядочивает поиск evidence на конкретных boundaries.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

467. Почему OSI не всегда literally соответствует implementation, но полезна practically?

   **Ответ:** Реальные протоколы и software объединяют функции нескольких уровней. Модель полезна как checklist responsibilities, а не буквальная карта процессов/пакетов.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

468. Как L1 problems обычно проявляются?

   **Ответ:** L1 issues дают carrier loss, flaps, CRC/physical errors или отсутствие передачи. Проверяют medium, transceivers и NIC counters.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html).

469. Как L2 problems обычно проявляются?

   **Ответ:** L2 issues проявляются неверными VLAN/MAC paths, loops и broadcast problems. Link может быть up, но frames не доходят до нужного neighbour.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

470. Как L3 problems обычно проявляются?

   **Ответ:** L3 issues касаются addresses/prefixes, routes, TTL и ICMP errors. Проверяют next hop, source selection и reverse path.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

471. Как L4 problems обычно проявляются?

   **Ответ:** L4 issues видны как failed handshake, resets, retransmissions, zero windows и socket errors. Сопоставляют TCP state и обе стороны exchange.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

472. Как L7 problems обычно проявляются?

   **Ответ:** L7 issues включают DNS status, HTTP errors, authentication и медленную обработку. Полезны protocol-aware probes и application logs.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

473. Почему важно не перепрыгивать уровни слишком рано?

   **Ответ:** Необоснованное перескакивание ведёт к tuning TLS при отсутствии route или routing при HTTP 403. Следующий шаг должен следовать из уже известного evidence.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

474. Почему “ping works” не исключает L4/L7 проблему?

   **Ответ:** Echo success не проверяет listener, TCP/UDP policy, TLS и application. Тестируют реальный destination port и запрос.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

475. Почему application error не всегда означает L7 root cause?

   **Ответ:** HTTP timeout может быть следствием PMTU loss или TCP recovery. Application symptom локализует наблюдение, но root cause ищут через lower-layer evidence.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

### Средний уровень
476. Какие типовые симптомы для Physical layer?

   **Ответ:** Типичны link down/flaps, physical errors, плохой signal и нестабильная negotiated speed. Подтверждают hardware/link telemetry.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

477. Какие типовые симптомы для Data Link layer?

   **Ответ:** Типичны VLAN mismatch, incorrect MAC learning, L2 loops и neighbour reachability failures. Нужны bridge/switch observations, не только route table.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

478. Какие типовые симптомы для Network layer?

   **Ответ:** Типичны no route, wrong next hop/source, loop и unreachable. Проверяют exact destination lookup и соответствующие rules/tables.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

479. Какие типовые симптомы для Transport layer?

   **Ответ:** Типичны SYN timeout/RST, retransmissions, receive-window stalls и disconnect. Определяют, кто и на какой стадии завершил exchange.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

480. Какие типовые симптомы для Application layer?

   **Ответ:** Типичны valid protocol error, failed authorization и delayed execution. Transport success позволяет сузить поиск, но не исключает underlying latency/loss.

   **Источник:** [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

481. Как ARP/NDP issues классифицировать между L2 и L3 practically?

   **Ответ:** ARP/NDP обеспечивает соседство между L3 адресом и L2 доставкой. В troubleshooting это boundary: route есть, но next-hop mapping не работает.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

482. Почему VLAN/tagging/STP issues часто выглядят как “пропадает сеть”?

   **Ответ:** Frames могут оказаться в чужом broadcast domain или port может временно блокироваться для предотвращения loop. IP configuration при этом внешне остаётся правильной.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

483. Как routing issues symptomatically differ from firewall issues?

   **Ответ:** Оба могут давать timeout/unreachable. Route lookup показывает intended forwarding, rule counters и captures — actual filtering; по одному symptom их не различить.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

484. Как TCP reset, timeout и retransmissions помогают L4 diagnosis?

   **Ответ:** RST — активный abort/refusal, timeout — незавершённая операция, retransmission — recovery неподтверждённых bytes. Они сужают стадию, но не определяют виновника.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

485. Как DNS issues sit between L7 symptom and lower-layer connectivity?

   **Ответ:** DNS является application protocol, но необходим для discovery destination. Его failure выглядит как недоступность всего сервиса до начала connect.

   **Источник:** [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

486. Почему TLS handshake issues часто ошибочно считают “сеть не работает”?

   **Ответ:** Пользователь видит общий connect failure, хотя TCP уже установлен. Разделение stage errors показывает trust/negotiation вместо отсутствия IP path.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

487. Как MTU issues проявляются across multiple layers?

   **Ответ:** L2/L3 size limits и encapsulation приводят к IP drops, TCP recovery и L7 timeout. Проверяют размер, PMTUD и actual packet path.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

488. Как congestion can look like L3/L4/L7 problem simultaneously?

   **Ответ:** Очередь задерживает/теряет IP packets, TCP восстанавливает delivery, application ждёт или истекает deadline. Это одна причинная цепочка через несколько уровней.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

489. Почему wireless issues often surface as L4/L7 symptoms?

   **Ответ:** Radio errors/scheduling меняют delivery time и loss, что вызывает transport recovery и application stalls. Нужны radio и endpoint observations за одно время.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

490. Как OSI mindset помогает сузить fault domain быстрее?

   **Ответ:** Он заставляет задать, какие функции уже подтверждены и где обмен перестаёт соответствовать expected behavior. Так исключают классы причин вместо случайных devices.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

491. Какие команды/инструменты наиболее полезны per OSI layer?

   **Ответ:** L1: ethtool; L2: ip link/neigh; L3: ip route/rule; L4: ss/tcpdump; L7: dig/s_client и protocol logs. Namespace/family должны совпадать с workload.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

492. Как packet capture maps to OSI-based thinking?

   **Ответ:** Capture связывает headers и protocol states разных уровней в одном обмене. Но physical errors до capture point и encrypted payload могут быть невидимы.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

493. Какие common mistakes делают при “OSI troubleshooting”?

   **Ответ:** Ошибки: строго идти L1→L7 при явном L7 reject, назначать каждой проблеме только один layer и заменять evidence классификацией.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

494. Почему OSI should guide reasoning, not replace evidence?

   **Ответ:** Название уровня не подтверждает механизм отказа. Нужны observable packets, errors и state, которые согласуются с гипотезой.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

495. Что должен понимать engineer про layered troubleshooting?

   **Ответ:** Нужно различать symptom layer и cause layer, зависимости и boundaries. Реальные systems требуют также control-plane/dataplane и endpoint-resource analysis.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Продвинутый уровень
496. Как build OSI-based fault tree for a real incident?

   **Ответ:** От конкретного symptom строят ветви discovery, link/address, routing/policy, transport и application. Для каждой выбирают test, который даст различающий результат.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

497. Как map application symptom to likely lower-layer hypotheses?

   **Ответ:** Например, HTTP timeout допускает DNS delay, TCP loss, PMTU black hole и backend stall. Stage timings сужают дерево, capture/metrics проверяют механизм.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

498. Как distinguish transport backpressure from network loss using layered reasoning?

   **Ответ:** Backpressure видна по unread data/advertised window и reader progress; path loss — по missing delivery/recovery evidence. Проверяют receiver и captures, а не только blocked send.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

499. Как overlays, tunnels and service meshes blur OSI-style diagnosis?

   **Ответ:** Один request проходит inner/outer networks и несколько terminating proxies. Для каждой logical leg нужны свои addresses, MTU, identity и observability.

   **Источник:** [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

500. Как combine OSI model with control-plane/user-plane separation?

   **Ответ:** У каждого уровня есть configuration/control state и actual packet processing. Route/tunnel up проверяют отдельно от успешной доставки user traffic.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4301: IPsec Architecture](https://www.rfc-editor.org/rfc/rfc4301).

501. Как LTE/5G or wireless systems fit imperfectly but usefully into layered troubleshooting?

   **Ответ:** Radio stack имеет дополнительные scheduling/retransmission/mobility functions, не укладывающиеся буквально в семь слоёв. Полезно разделять radio, transport, core и service boundaries.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

502. Как instrument systems so that each logical layer has observable signals?

   **Ответ:** Expose link/NIC errors, route/neighbor events, socket states, TLS outcomes и application timings с общими IDs/time. Выбирают signals по возможным failure mechanisms.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

503. Какие interview вопросы по OSI-based troubleshooting показывают real engineering approach?

   **Ответ:** Спросите: ping работает, TLS timeout, большие transfers не проходят — как проверить PMTU? Сильный ответ связывает layers и подтверждает packet-size dependence.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

504. Какие anti-patterns бывают у engineers who overfit every problem into one layer?

   **Ответ:** Overfitting приводит к игнорированию cross-layer chains и endpoint CPU. Классификация не должна мешать переходу к evidence другого уровня.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

505. Что должен глубоко понимать engineer about using OSI as a troubleshooting framework?

   **Ответ:** OSI — scaffold для функций и dependencies; реальная diagnosis требует paths, timings, resources и protocol semantics. Нельзя выводить root cause из имени слоя.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Инженерные вопросы
506. Почему OSI — полезный mental model для RCA?

   **Ответ:** Модель помогает проследить, как lower-layer failure создаёт upper-layer symptom, и выбрать точку проверки. Это делает RCA понятнее и проверяемее.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

507. Когда OSI помогает, а когда слишком упрощает картину?

   **Ответ:** Она полезна при localization unknown connectivity failures. Упрощает слишком сильно, если скрывает overlays, proxies, control-plane state и host scheduling.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

508. Как объяснить layered troubleshooting на интервью?

   **Ответ:** На примере разделяют DNS, connect, TLS и request, затем связывают failing stage с lower-layer evidence. Подтверждают fix исходным user operation.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

509. Какие OSI темы особенно важны C/C++ network developer?

   **Ответ:** Особенно нужны addressing/routing, TCP/UDP semantics, MTU, DNS/TLS и mapping socket errors к exchange. API behavior связывают с packet path.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

510. Что надо знать глубоко, чтобы эффективно диагностировать проблемы по слоям?

   **Ответ:** Глубоко нужны реальные protocol semantics, observability boundaries и зависимости layers. Одного заучивания названий OSI недостаточно для выбора проверок.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

---

## 10. Практика: Linux, сокеты и системная диагностика

### Базовый уровень
511. Какие базовые команды Linux полезны для network troubleshooting?

   **Ответ:** Базовый набор: ip, ss, ping, traceroute, dig, tcpdump; по гипотезе добавляют ethtool, journalctl и strace. Начинают с read-only проверок нужного namespace.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

512. Что показывают `ip addr`, `ip route`, `ip neigh`?

   **Ответ:** `ip addr` показывает addresses/interfaces, `ip route` — routes, `ip neigh` — neighbour mappings и состояния. Учитывают family, tables и namespace.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html).

513. Зачем нужны `ss` и `netstat`?

   **Ответ:** Они показывают sockets и protocol statistics. ss обычно удобнее для современных Linux TCP states/options; старый netstat может быть ограничен или отсутствовать.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

514. Что показывает `ss -tulpen`?

   **Ответ:** Это TCP/UDP listening/bound sockets с numeric addresses, process и extended details. Process metadata может требовать прав; wildcard/loopback и family читают отдельно.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

515. Как проверить, слушает ли процесс нужный порт?

   **Ответ:** Используют `ss -lntp 'sport = :443'` для TCP, отдельно UDP при необходимости. Проверяют bound address/family и владельца в namespace сервиса.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

516. Как проверить, есть ли established TCP connections?

   **Ответ:** Используют `ss -nt state established`. ESTABLISHED подтверждает transport state, но не работоспособность TLS или приложения.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

517. Зачем нужен `tcpdump`?

   **Ответ:** Tcpdump захватывает packets на выбранном interface с фильтрами и timestamps. Он проверяет actual exchange вместо предположений по application timeout.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

518. Почему packet capture остаётся ключевым инструментом?

   **Ответ:** Capture связывает headers, order и timing конкретных packets. Но нужно учитывать capture loss, offloads, encryption и отсутствие видимости вне точки захвата.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

519. Что такое `errno` в сетевом программировании?

   **Ответ:** errno хранит thread-local код некоторых failed POSIX calls. Его читают сразу после ошибки; successful call не обязан обнулять errno.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

520. Какие ошибки сокетов нужно знать в первую очередь?

   **Ответ:** Нужны EAGAIN/EWOULDBLOCK, EINTR, EINPROGRESS, ECONNREFUSED/RESET, ETIMEDOUT, ENETUNREACH/EHOSTUNREACH и EPIPE. Значение интерпретируют по syscall и stage.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

### Средний уровень
521. Что означают `ECONNREFUSED`, `ETIMEDOUT`, `ECONNRESET`, `EHOSTUNREACH`, `ENETUNREACH`?

   **Ответ:** Refused — активный отказ connect; timed out — истёк wait; reset — аварийный TCP abort; host/network unreachable — недоступность пути. Сохраняют syscall и endpoint context.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

522. Как эти ошибки помогают в troubleshooting?

   **Ответ:** Они классифицируют локально наблюдаемый отказ и выбирают следующий test. Код не определяет автоматически конкретное устройство, создавшее проблему.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

523. Что означает `recv() == 0`?

   **Ответ:** Для stream socket с ненулевой requested length это EOF: peer orderly закрыл sending direction после доступных bytes. Для UDP нулевая datagram допустима.

   **Источник:** [recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

524. Почему `connect()` timeout и `ECONNREFUSED` указывают на разные проблемы?

   **Ответ:** Timeout означает отсутствие успешного завершения в срок, refused — полученный/локальный активный отказ. Вторая ситуация часто быстрее и отличается packet pattern.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

525. Как `strace` помогает в сетевой диагностике приложения?

   **Ответ:** Strace показывает syscalls, return values, errno и длительности ожиданий. Например, `strace -f -tt -T -e trace=network,poll,epoll_wait -p PID`; учитывают overhead и возможные sensitive bytes.

   **Источник:** [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html).

526. Как `lsof -i` помогает?

   **Ответ:** `lsof -nP -i` связывает network endpoints с processes/fds, если права позволяют. В container/netns контекст и доступность metadata могут отличаться.

   **Источник:** [lsof(8)](https://man7.org/linux/man-pages/man8/lsof.8.html).

527. Как `ip -s link` помогает?

   **Ответ:** Показывает interface-level RX/TX packets/bytes/errors/drops. Для incident берут snapshots и interval deltas, затем уточняют driver-specific причины.

   **Источник:** [ip-link(8)](https://man7.org/linux/man-pages/man8/ip-link.8.html).

528. Как `ethtool` помогает при L1/L2 проблемах?

   **Ответ:** Проверяют speed/duplex/link и `ethtool -S eth0` counters, если поддерживаются. Значения driver-specific; counters нужно сопоставлять с medium и нагрузкой.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

529. Как `journalctl` и system logs помогают network troubleshooting?

   **Ответ:** Logs показывают link flaps, driver resets, address/configuration changes и service failures. Фильтруют по incident window и сопоставляют с application timestamps.

   **Источник:** [systemd: journalctl](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html).

530. Как container network namespaces усложняют диагностику?

   **Ответ:** Container имеет собственные routes, interfaces, sockets и resolver context. Команда на host может не видеть failing path; исследуют workload и veth/bridge boundaries.

   **Источник:** [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html).

531. Как Linux firewall (`iptables`/`nftables`) влияет на симптомы?

   **Ответ:** Drop создаёт timeout, reject — явный ICMP/TCP отказ; state tracking/NAT меняют допустимость и tuple. Проверяют matching chain/hook и counters.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

532. Как policy routing и multiple tables complicate host-side debugging?

   **Ответ:** Main table может не использоваться для данного source/mark/UID/VRF. Проверяют `ip rule` и route lookup с selectors, соответствующими application.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

533. Почему reverse path filtering sometimes breaks valid traffic?

   **Ответ:** Strict rp_filter может отвергать packet, если лучший reverse route не совпадает с ingress, что бывает при multihoming/asymmetry. Проверяют policy и sysctl, не отключают защиту вслепую.

   **Источник:** [Linux: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

534. Как socket buffer sizes influence performance symptoms?

   **Ответ:** Buffers влияют на burst tolerance, backpressure, TCP windows и UDP drops. Увеличение требует memory budget и не устраняет sustained slow reader.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

535. Что должен понимать C/C++ engineer about host-side network debugging?

   **Ответ:** Нужно связывать syscall outcomes с socket state, routes, packet exchange и process scheduling. Application-level logs должны разделять stages и сохранять native error.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html).

### Продвинутый уровень
536. Как instrument C/C++ application for useful network diagnostics without too much overhead?

   **Ответ:** Добавляют stable IDs, stage timers, counters и sampled structured errors. Используют monotonic durations, bounded logging и исключают payload/credentials по умолчанию.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

537. Какие per-request/per-connection timings стоит логировать?

   **Ответ:** Полезны queue wait, DNS, connect, TLS, request write, first byte и completion, плюс retry attempt. Pool reuse и overlapping phases отмечают явно.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

538. Как distinguish app hang from blocked socket I/O?

   **Ответ:** Stack/syscall sampling показывает ожидание read/poll либо CPU/lock loop. Проверяют thread states, socket readiness и event-loop progress, учитывая tracing overhead.

   **Источник:** [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html); [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

539. Как non-blocking sockets and epoll complicate debugging?

   **Ответ:** Readiness не гарантирует успешную операцию; edge-triggered loop должен drain до EAGAIN. Progress, rearming и lifetime bugs могут выглядеть как сетевой timeout.

   **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html).

540. Какие race conditions typical in asynchronous network code?

   **Ответ:** Часты close/reuse fd versus callback, timeout versus completion и shared buffer mutation. Нужны explicit ownership, cancellation contract и one-time cleanup.

   **Источник:** [C++ Core Guidelines: Bounds Safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#SS-bounds); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html).

541. Как packet captures correlate with userspace timestamps?

   **Ответ:** Связывают tuple/sequence и request IDs, учитывая clock source/offset, NAT и kernel buffering. Syscall timestamp не обязательно равен wire timestamp.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

542. Как use `perf`, `ebpf` or kernel tracing conceptually in network RCA?

   **Ответ:** Perf показывает CPU/scheduling cost, tracing — события kernel/socket/queues. Выбирают узкую гипотезу, ограничивают overhead и не считают отсутствие sampled event доказательством отсутствия проблемы.

   **Источник:** [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

543. Как identify host stack bottleneck vs external network bottleneck?

   **Ответ:** Проверяют local CPU/softirq/rings/socket drops и packet observations с remote. Данные, дошедшие до NIC, могут потеряться до application без внешнего path failure.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

544. Какие interview вопросы по Linux/socket troubleshooting показывают сильного инженера?

   **Ответ:** Полезен случай: packets приходят, epoll client ждёт до timeout. Ожидаются edge-trigger draining, event-loop lag, fd lifecycle и exact syscall results.

   **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html).

545. Какие anti-patterns вредят observability in C/C++ networking code?

   **Ответ:** Вредят единое «network error», lost errno, отсутствие stages/IDs и unlimited payload logging. Telemetry не должна добавлять существенный blocking в I/O loop.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

546. Как build reproducible local labs for debugging network code?

   **Ответ:** Используют namespaces/VM с фиксированными addresses/routes, tiny client/server и fault injection. Сохраняют commands/configuration и expected outcomes.

   **Источник:** [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

547. Как use network namespaces, tc/netem and packet capture together?

   **Ответ:** Namespaces задают topology, netem — controlled impairments, capture — actual packets до/после fault point. Проверяют correct egress и cleanup test configuration.

   **Источник:** [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

548. Какие logging fields most useful: local/remote IP, port, errno, RTT, bytes, retries?

   **Ответ:** Полезны family, local/remote address/port, protocol, stage, errno/library error, bytes, timings и attempt/connection IDs. RTT отмечают как transport estimate, если он доступен.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

549. Как explain practical Linux-side network debugging on interview?

   **Ответ:** Рассказывают: определяю process/netns, проверяю route/listener/state, читаю exact syscall error и подтверждаю packets. Затем проверяю recovery исходной операцией.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

550. Что должен глубоко понимать engineer about sockets as observability surface?

   **Ответ:** Socket даёт state, errors, queue/backpressure и transport estimates, но не полную картину path. EOF, EAGAIN и timeout имеют разные contracts.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

### Инженерные вопросы
551. Почему сильный network developer должен уметь и команды Linux, и packet capture, и socket-level reasoning?

   **Ответ:** Команды показывают configuration, capture — exchange, syscall reasoning — поведение кода. Их согласование отличает внешнюю проблему от misuse API.

   **Источник:** [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

552. Какие host-side инструменты обязательны для практики?

   **Ответ:** Обязательны ip/ss, tcpdump, dig, ethtool, logs и strace; perf/tracing добавляют для сложного scheduling/stack RCA. Нужно знать ограничения каждого.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html).

553. Что особенно важно логировать в production network service?

   **Ответ:** Логируют safe endpoint/identity references, stages/timings, error category, bytes/progress и correlation IDs. Secrets и raw payload не должны попадать в обычные logs.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

554. Как лучше объяснять socket-level troubleshooting на интервью?

   **Ответ:** На конкретном syscall показывают expected result, observed errno/state и corresponding packets. Для nonblocking connect объясняют EINPROGRESS и SO_ERROR.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

555. Какие темы Linux/network debugging нужно знать глубоко?

   **Ответ:** Глубоко нужны netns/routes, TCP/UDP states, readiness, errors/partial I/O, buffers, lifecycle и targeted capture. Это связывает code и host datapath.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

---

## 11. Практические сценарии troubleshooting

### Базовый уровень
556. Как диагностировать сценарий: “ping до IP работает, сайт не открывается”?

   **Ответ:** Проверяют resolution/выбранный IP, TCP port, TLS identity/ALPN и HTTP response. Echo success подтверждает лишь ICMP, поэтому не пропускают остальные стадии.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

557. Как диагностировать сценарий: “hostname не резолвится”?

   **Ответ:** Фиксируют exact name/type/error и resolver context, сравнивают getaddrinfo/dig, authoritative data и cache/view. Разделяют timeout, NXDOMAIN и SERVFAIL.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

558. Как диагностировать сценарий: “в локальной сети всё работает, наружу — нет”?

   **Ответ:** Проверяют default/policy routes, gateway forwarding, NAT, firewall и upstream. LAN success не доказывает return path для external traffic.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

559. Как диагностировать сценарий: “иногда всё работает, иногда timeout”?

   **Ответ:** Собирают temporal series, failed request IDs, endpoint cohorts и changes. Проверяют load, path/NAT idle timers, DNS/backend variation и recovery после события.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

560. Как диагностировать сценарий: “только один сервис недоступен”?

   **Ответ:** Проверяют listener/bind, precise port/family, service health и matching policy. Сравнивают healthy service на том же host/path, сохраняя различия конфигурации.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

561. Как диагностировать сценарий: “UDP сервис теряет пакеты”?

   **Ответ:** Сравнивают application sequence gaps с NIC/kernel/socket drops и sender pacing. Проверяют receive-loop CPU/buffers и path loss на двух capture points.

   **Источник:** [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

562. Как диагностировать сценарий: “TCP соединения долго устанавливаются”?

   **Ответ:** Измеряют DNS отдельно от SYN exchange, смотрят SYN retransmissions, backlog/accept pressure и policy. Capture обеих сторон отличает delayed server response от недоставки.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

563. Как диагностировать сценарий: “под нагрузкой сеть резко деградирует”?

   **Ответ:** Ищут limiting resource по CPU/softirq, PPS/BPS, queues/state и errors. Контролируемый load sweep показывает порог; не увеличивают buffers до локализации.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

564. Как диагностировать сценарий: “только large responses ломаются”?

   **Ответ:** Проверяют size threshold, PMTU/ICMP и tunnel overhead, затем application/proxy body limits. Capture и size variants отличают transport black hole от явного HTTP reject.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

565. Как диагностировать сценарий: “через VPN работает, без VPN нет”?

   **Ответ:** Сравнивают DNS view, route/source, egress IP и access policy через/без VPN. VPN мог дать нужный private route или разрешённый source, а не «исправить Интернет».

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

### Средний уровень
566. Как построить RCA для intermittent packet loss?

   **Ответ:** Связывают loss pattern/direction с interval counters и synchronized captures вокруг события. Исключают observer loss и объясняют конкретный drop mechanism.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

567. Как построить RCA для only-one-region issue?

   **Ответ:** Сравнивают region-specific DNS/backend, routes, edge policy и capacity с healthy region. Уточняют client versus server location и common dependency.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

568. Как построить RCA для only-one-client-class issue?

   **Ответ:** Группируют по OS/library version, TLS support, trust store, family и access network. Reproduction должна сохранять отличающую feature, а не только user agent.

   **Источник:** [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

569. Как построить RCA для DNS-only issue?

   **Ответ:** Показывают failing resolution stage/status, resolver/view/cache behavior и authoritative cause. Подтверждают исправление реальным application lookup.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

570. Как построить RCA для SYN timeout vs TLS timeout?

   **Ответ:** SYN timeout относится к transport establishment, TLS timeout — к следующему handshake. Stage timestamps и captures показывают, где exchange перестал продвигаться.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

571. Как построить RCA для high RTT but no visible loss?

   **Ответ:** Измеряют baseline/path, RTT distribution, queues и endpoint CPU. Проверяют routing detour и congestion без drop; no visible loss может быть ограничением sampling.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

572. Как построить RCA для good ping but bad application throughput?

   **Ответ:** Проверяют application production/consumption, CPU/backend, TCP windows/BDP и recovery. Маленький Echo не измеряет capacity и payload transfer.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ESnet: iperf3](https://software.es.net/iperf/invoking.html).

573. Как построить RCA для no-connectivity after config change?

   **Ответ:** Сохраняют effective before/after config, route/rule/filter snapshots и failed-flow evidence. Controlled rollback может подтвердить связь, но конкретный faulty setting всё равно объясняют.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page).

574. Как построить RCA для NAT-related reachability issue?

   **Ответ:** Сопоставляют inner/outer tuples, mapping lifetime, available ports и return path. Проверяют idle/rebinding сценарий и исключают firewall state exhaustion.

   **Источник:** [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

575. Как построить RCA для MTU blackhole?

   **Ответ:** Доказывают зависимость от packet size, oversized retransmissions и отсутствие рабочего ICMP PMTU feedback. Корректируют tunnel MTU/path policy и проверяют оба направления.

   **Источник:** [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

576. Как built layered evidence rather than intuition in these scenarios?

   **Ответ:** Каждая гипотеза должна предсказывать наблюдение на конкретной boundary. Связывают application stage, syscall state, packets и configuration, отмечая пробелы evidence.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

577. Какие данные обязательно собрать перед эскалацией?

   **Ответ:** Нужны scope/impact, endpoints/protocol/family, timestamps, exact errors, topology, changes и проведённые tests. Прикладывают безопасные targeted logs/counters/capture.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

578. Какие минимальные reproduction steps стоит описывать?

   **Ответ:** Описывают environment/version/netns, source/destination, input/command, rate/size, expected/actual result и частоту. Указывают условия, при которых проблема не возникает.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

579. Почему incident notes и exact timestamps важны?

   **Ответ:** Notes сохраняют hypotheses, actions и outcomes для нескольких responders. Exact time позволяет связать краткие события и не повторять уже опровергнутые tests.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

580. Какие типовые ошибки инженеры делают в scenario-based troubleshooting?

   **Ответ:** Ошибки: сразу назвать root cause, выполнить пачку commands без interpretation и изменить несколько settings. Нужно объяснять, какой результат ожидается и что он исключает.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Продвинутый уровень
581. Как design troubleshooting exercises for interview or training?

   **Ответ:** Задают понятную topology, observable symptom и hidden fault, дают данные по запросу. Оценивают reasoning, безопасные checks и verification, а не запоминание команды.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

582. Какие synthetic scenarios best test real network reasoning?

   **Ответ:** Полезны wrong DNS view, missing return route, PMTU black hole, loopback-only listener, receiver overload и TLS chain mismatch. Каждый проверяет разные boundaries.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191); [OWASP: TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

583. Как simulate packet loss, delay, DNS failure, MTU issue, routing issue in lab?

   **Ответ:** В изолированной lab используют netem для delay/loss, local resolver для DNS, interface MTU и routes/filter rules. Проверяют impairment direction и rollback.

   **Источник:** [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html).

584. Как evaluate whether candidate truly understands troubleshooting?

   **Ответ:** Кандидат должен уточнять symptom/scope, предсказывать tests, интерпретировать результаты и менять гипотезу. Список commands без expected outcomes недостаточен.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

585. Какие interview questions on practical scenarios reveal senior-level thinking?

   **Ответ:** Спросите, как расследовать intermittent failure без capture прошлого события и снизить impact. Senior должен разделить mitigation, evidence gaps, instrumentation и RCA.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

586. Как distinguish cargo-cult command running from evidence-based diagnosis?

   **Ответ:** Evidence-based подход объясняет, зачем команда нужна и как оба возможных результата изменят hypothesis tree. Cargo cult повторяет commands независимо от observations.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

587. Как structure written RCA after solving scenario?

   **Ответ:** RCA содержит impact, timeline, causal mechanism/evidence, contributing conditions, mitigation и corrective actions с owners. Неподтверждённые предположения отмечают явно.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

588. Какие anti-patterns чаще всего появляются в practical troubleshooting exercises?

   **Ответ:** Вредят единственный «правильный» command, подсказка root cause в условии и оценка скорости угадывания. Exercise должен проверять diagnosis process и trade-offs.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

589. Как convert real production incidents into reusable question bank?

   **Ответ:** Удаляют secrets/identifiers, сохраняют topology и causal evidence, формулируют staged prompts. Добавляют expected reasoning, альтернативные hypotheses и limits observations.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

590. Что должен уметь senior engineer in scenario-driven network RCA?

   **Ответ:** Нужно управлять scope/impact, выбирать различающие tests, координировать owners и подтверждать recovery. Senior также формирует preventive work на основе доказанного механизма.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

### Инженерные вопросы
591. Почему лучшие вопросы по troubleshooting — это сценарии, а не определения?

   **Ответ:** Сценарии проверяют применение protocol knowledge при неполной информации, а также выбор tools и interpretation. Определения не показывают, как инженер действует при outage.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

592. Какие практические сценарии обязательно включить в сборник вопросов?

   **Ответ:** Нужны DNS versus connect, ping versus HTTPS, partial VPN connectivity, PMTU, loss/overload, TLS trust и namespace/bind issues. Они покрывают типичные cross-layer failures.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

593. Как объяснить своё решение сценария на интервью?

   **Ответ:** Последовательно: уточнения, hypotheses, выбранные tests, observations, вывод и verification. Неизвестные данные и альтернативы обозначают вместо выдачи догадок за факт.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

594. Какие темы practical troubleshooting наиболее ценны для network/software engineer?

   **Ответ:** Наиболее ценны DNS/dual stack, routes/policy, TCP/UDP, TLS, capture и host resource diagnosis. Они непосредственно связываются с application stages.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

595. Что стоит изучать после этого блока: tcpdump, Wireshark, netem, Linux kernel networking, eBPF?

   **Ответ:** Сначала углубляют tcpdump/Wireshark и sockets/Linux paths, затем netem labs и kernel tracing/eBPF под реальные вопросы. Complexity повышают по потребности.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

---

## 12. Сквозные вопросы по troubleshooting и практике

### Обобщение
596. Какой минимальный troubleshooting workflow должен знать любой network engineer?

   **Ответ:** Минимум: symptom/scope/time, path/stages, baseline/changes, hypotheses/tests, controlled mitigation и real-operation verification. После recovery фиксируют cause и preventive actions.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

597. Какие 5 инструментов наиболее полезны ежедневно?

   **Ответ:** Универсальная стартовая пятёрка: ping, traceroute, dig, ss и tcpdump. На Linux её дополняет ip для local configuration/routing.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

598. Почему `ping`, `traceroute`, `dig`, `ss`, `tcpdump` — сильная стартовая связка?

   **Ответ:** Они покрывают ICMP RTT, видимый path, DNS, socket state и actual packets. Ни один отдельно не описывает весь request lifecycle.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html); [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

599. Как быстро отделить DNS issue от connectivity issue?

   **Ответ:** Проверяют exact lookup и соединение с resolved/known-correct IP с сохранением hostname. Wrong DNS и broken IP path могут существовать одновременно.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525).

600. Как быстро отделить routing issue от firewall issue?

   **Ответ:** Проверяют route/rules для конкретного flow, затем filter counters и packets до/после boundary. По silent timeout одному быстро и надёжно различить их нельзя.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [nftables wiki](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

601. Как быстро отделить network issue от app/server issue?

   **Ответ:** Сопоставляют request arrival/response departure и server processing time. Если packets своевременно доставлены, а handler ждёт CPU/backend, фокус смещается к endpoint.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

602. Как packet capture вписывается в layered troubleshooting?

   **Ответ:** Capture проверяет обмен на выбранных boundaries и связывает protocol states. Выбирают точку/фильтр по гипотезе и учитывают encryption/offload/capture loss.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

603. Почему hypothesis-driven подход эффективнее случайного запуска команд?

   **Ответ:** Каждый test уменьшает uncertainty и исключает alternatives. Случайные команды могут собирать много данных, не отвечая на вопрос о механизме отказа.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

604. Какие метрики нужно всегда связывать: latency, loss, retransmissions, errors, throughput?

   **Ответ:** Связывают request latency/error rates, throughput, RTT/recovery, packet/host drops и saturation. Counters должны относиться к совместимым interval и scope.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

605. Почему packet loss, latency и throughput нельзя анализировать изолированно?

   **Ответ:** Loss вызывает recovery и снижает throughput; queues повышают latency; low throughput может быть demand-limited. Изолированная метрика допускает несколько противоположных объяснений.

   **Источник:** [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

606. Как bottlenecks и OSI model together помогают RCA?

   **Ответ:** OSI выделяет функцию/стадию отказа, bottleneck analysis — ограничивающий resource и queue. Вместе они связывают symptom с местом и механизмом воздействия.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

607. Как troubleshooting differs in wired vs wireless/mobile networks?

   **Ответ:** В wireless дополнительно смотрят radio quality, contention, retransmissions и mobility. Общие DNS/transport/application проверки остаются, но path timing сильнее меняется.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

608. Какие дополнительные сложности вносят LTE/5G/Wi-Fi/cellular paths?

   **Ответ:** Radio scheduling, handovers, power saving, tunnels и operator NAT добавляют variability и скрытые boundaries. Нужна correlation radio/core/endpoint telemetry.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

609. Что должен понимать C/C++ engineer о production troubleshooting?

   **Ответ:** Нужно проектировать diagnostics заранее: stages, native errors, IDs, progress и limits. Production diagnosis должна сохранять security и учитывать overhead tracing.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

610. Какие вопросы по troubleshooting чаще всего показывают senior-level понимание?

   **Ответ:** Сильны вопросы о intermittent cross-layer failure, conflicting probes и safe mitigation. Оценивают evidence, scope, альтернативы и recovery, а не уверенность первой догадки.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

### Interview-style
611. Как за 2 минуты описать свой стандартный подход к сетевой диагностике?

   **Ответ:** Описывают exact symptom/impact, environment/path, stages и сравнение healthy/affected. Затем hypotheses/tests, минимальную mitigation, verification и RCA с evidence gaps.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

612. Как за минуту объяснить, чем полезен и чем ограничен ping?

   **Ответ:** Ping отправляет Echo и измеряет replies/RTT к адресу. Он не проверяет port/TLS/application; filtering и endpoint scheduling ограничивают выводы.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

613. Как за минуту объяснить, как интерпретировать traceroute?

   **Ответ:** Trace использует TTL/Hop Limit и diagnostic replies для видимых hops. Stars/slow intermediate replies не доказывают transit loss; учитывают ECMP и reverse paths.

   **Источник:** [traceroute(8)](https://man7.org/linux/man-pages/man8/traceroute.8.html).

614. Как за минуту объяснить базовый DNS troubleshooting workflow?

   **Ответ:** Проверяют name/type, resolver/view, status/TTL и application lookup, затем authoritative/cache/transport. Разделяют NXDOMAIN, SERVFAIL и timeout.

   **Источник:** [BIND: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

615. Как за минуту объяснить подход к no-connectivity incident?

   **Ответ:** Фиксируют destination/protocol/family, проверяют local address/link, route/neighbor, listener/policy и return path. Capture обеих сторон локализует недоставку.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html).

616. Как за минуту объяснить подход к high-latency incident?

   **Ответ:** Разбивают request на DNS/connect/TLS/processing/transfer, сравнивают distributions и baseline. Коррелируют growth с RTT/queues/CPU и подтверждают limiting stage.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

617. Как за минуту объяснить подход к packet-loss incident?

   **Ответ:** Уточняют direction/pattern и actual-flow impact, затем сравнивают path/host counters и captures. Исключают ICMP-specific и observer artifacts до tuning.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

618. Как за минуту объяснить, что такое bottleneck и как его искать?

   **Ответ:** Bottleneck ограничивает полезную service rate при данном workload. Ищут plateau, queues/saturation и проверяют гипотезу controlled изменением соответствующего resource.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).

619. Как за минуту объяснить OSI-based troubleshooting practically?

   **Ответ:** Разделяют link, IP, transport и application functions, проверяют подтверждённые boundaries. Symptom может быть наверху, а cause ниже; layer name не заменяет evidence.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

620. Какие troubleshooting темы нужно знать глубоко network/software engineer?

   **Ответ:** Глубоко нужны DNS, routing/neighbor, dual stack, TCP/UDP/socket API, MTU, TLS и targeted capture. Дополняют host scheduling/queues и incident reasoning.

   **Источник:** [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

621. Какие troubleshooting темы достаточно знать на уровне инженерной интуиции?

   **Ответ:** Редкие routing protocols, radio internals и advanced tracing можно знать обзорно, если они вне роли. Для эксплуатации соответствующего stack нужны более глубокие знания.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

622. Какие вопросы по troubleshooting обязательно стоит задать кандидату на C/C++ networking role?

   **Ответ:** Спросите про partial send/recv, EINPROGRESS/SO_ERROR, EOF versus UDP zero-length, epoll stalls, TLS verification и malformed frame. Добавьте scenario с packet evidence.

   **Источник:** [connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html).

623. Какие вопросы по troubleshooting отличают junior, middle и senior?

   **Ответ:** Junior объясняет базовые tools/errors; middle локализует типовой failure; senior работает с неполными данными, cross-layer effects и trade-offs mitigation/observability. Оценка зависит от роли.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

624. Как построить хороший раздел “практика и диагностика” в большом сборнике вопросов?

   **Ответ:** Строят раздел от метода и tools к failure classes, Linux/socket practice и staged scenarios. Каждый answer должен объяснять evidence, ограничения и verification.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

625. Какие темы из troubleshooting стоит расширить следующими блоками: tcpdump/Wireshark, Linux networking, eBPF, sockets, performance tuning?

   **Ответ:** Расширяют capture analysis, socket state machines, namespaces/netem labs и performance/queueing; затем kernel tracing/eBPF по measured gaps. Практика должна связывать code, packets и user impact.

   **Источник:** [tcpdump(8)](https://www.tcpdump.org/manpages/tcpdump.8.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html).
