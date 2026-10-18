# Вопросы: Transport Layer (с уклоном в C/C++)

## 1. TCP: базовые концепции

### Базовый уровень
1. Что такое TCP?

   **Ответ:** TCP — транспортный протокол, предоставляющий приложениям надёжный упорядоченный двунаправленный поток байтов. Потери компенсируются повторами, скорость ограничивают flow и congestion control. При неустранимом отказе соединение заканчивается ошибкой.

   **Типичная ошибка:** Считать надёжность TCP гарантией, что peer-приложение обработало запрос.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

2. На каком уровне модели OSI работает TCP?

   **Ответ:** По обычному сопоставлению OSI TCP относится к транспортному уровню L4: обеспечивает обмен между endpoints процессов поверх IP.

   **Типичная ошибка:** Относить TCP к L3 из-за наличия портов в сетевом пакете.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

3. На каком уровне модели TCP/IP работает TCP?

   **Ответ:** В TCP/IP TCP относится к Transport layer, между Internet/IP и Application. Прикладной протокол задаёт смысл байтов поверх TCP.

   **Типичная ошибка:** Считать HTTP или TLS встроенными функциями TCP.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

4. Чем TCP отличается от UDP в общем виде?

   **Ответ:** TCP даёт connection state и упорядоченный byte stream с повторами и контролем скорости. UDP передаёт отдельные датаграммы без встроенных гарантий доставки, порядка и congestion control.

   **Типичная ошибка:** Считать UDP автоматически быстрее для любой полезной нагрузки.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768).

5. Почему TCP называют connection-oriented protocol?

   **Ответ:** Стороны согласуют начальные sequence numbers, поддерживают состояние соединения и выполняют процедуры установки/завершения. Это логическая связь, а не закреплённый физический маршрут.

   **Типичная ошибка:** Считать TCP connection резервированием канала и bandwidth.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

6. Что означает reliable delivery в TCP?

   **Ответ:** TCP обнаруживает потери/повреждения и повторяет данные, пока соединение работоспособно или не завершено ошибкой. ACK означает принятие TCP-стеком, но не сохранение в БД или обработку приложением.

   **Типичная ошибка:** Использовать TCP ACK как подтверждение бизнес-операции.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

7. Что означает ordered delivery в TCP?

   **Ответ:** Получатель выдаёт приложению байты в порядке sequence numbers. При пропуске ранних байтов последующие могут храниться в out-of-order queue, задерживая выдачу.

   **Типичная ошибка:** Считать, что IP-сеть обязана доставлять TCP-сегменты по порядку.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

8. Что означает full-duplex соединение в TCP?

   **Ответ:** Обе стороны могут независимо отправлять и принимать данные одновременно; для каждого направления есть собственные sequence space и управление потоком. Одно направление может завершиться раньше другого.

   **Типичная ошибка:** Считать ответ сервера возможным только после полного закрытия отправки клиентом.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

9. Что такое byte stream в TCP?

   **Ответ:** TCP представляет данные последовательностью байтов без прикладных границ сообщений. Приложение само задаёт framing: длины, delimiters или фиксированный формат.

   **Пример:**

   ```cpp
   #include <string>

   // Возможное разбиение одного и того же byte stream:
   const std::string written = "HELLO\nWORLD\n";
   const std::string read1 = "HEL";
   const std::string read2 = "LO\nWORLD\n";
   // Parser хранит "HEL" до получения оставшейся части записи.
   ```

   **Типичная ошибка:** Ожидать соответствия одного send одному recv.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

10. Почему TCP не сохраняет границы сообщений?

   **Ответ:** Границы системных вызовов не входят в wire semantics TCP. Стек может объединять и разделять данные при отправке/приёме, а чтение ограничено доступными байтами и размером буфера.

   **Типичная ошибка:** Использовать PSH как переносимый разделитель сообщений.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

11. Что такое segment в TCP?

   **Ответ:** TCP segment — заголовок TCP и, возможно, данные, передаваемые через IP. SYN, FIN и ACK могут идти без payload; retransmission не обязана повторять прежние границы сегментации.

   **Типичная ошибка:** Приравнивать segment к одному сообщению приложения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

12. Из каких основных полей состоит TCP header?

   **Ответ:** Source/destination ports, sequence и acknowledgement numbers, data offset, reserved/control bits, window, checksum, urgent pointer и optional options/padding. Базовый заголовок — 20 байт, с options до 60.

   **Типичная ошибка:** Всегда читать payload со смещения 20, игнорируя data offset.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

13. Что такое source port?

   **Ответ:** Source port — 16-битный номер локального transport endpoint отправителя. Клиенту его часто назначает ОС из ephemeral range; сервер тоже имеет source port в своих ответах.

   **Типичная ошибка:** Считать source port уникальным идентификатором процесса во всей сети.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

14. Что такое destination port?

   **Ответ:** Destination port выбирает транспортный endpoint получателя в контексте IP и протокола. Один номер не гарантирует конкретное приложение или безопасность сервиса.

   **Типичная ошибка:** Считать любой TCP/443 обязательно корректным HTTPS.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

15. Что такое sequence number?

   **Ответ:** Sequence number — 32-битная позиция в потоке для первого байта сегмента; SYN и FIN тоже занимают по одной позиции. Сравнения учитывают циклическое переполнение.

   **Типичная ошибка:** Увеличивать sequence на один для каждого пакета независимо от длины данных.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

16. Что такое acknowledgement number?

   **Ответ:** При установленном ACK acknowledgement number указывает следующий ожидаемый байт и кумулятивно подтверждает предыдущие последовательные байты. SACK отдельно сообщает полученные диапазоны за разрывом.

   **Типичная ошибка:** Понимать ACK N как подтверждение только одного сегмента с номером N.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

17. Что такое flags в TCP?

   **Ответ:** Control bits задают управляющие признаки TCP, например синхронизацию, подтверждение, завершение и ECN feedback. Они могут сочетаться в одном сегменте.

   **Типичная ошибка:** Считать ACK-пакет обязательно пустым: ACK может сопровождать данные и другие flags.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).

18. Какие флаги TCP считаются основными?

   **Ответ:** Основные исторические флаги — SYN, ACK, FIN, RST, PSH, URG; ECE и CWR обслуживают ECN. Их значение определяется состоянием соединения и остальными полями.

   **Типичная ошибка:** Разбирать flags независимо от sequence numbers и TCP state.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).

19. Что такое SYN?

   **Ответ:** SYN синхронизирует sequence numbers при установке соединения и занимает одну позицию в sequence space. SYN-сегмент также может нести согласуемые options.

   **Типичная ошибка:** Считать ACK на SYN равным ISN вместо ISN+1.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

20. Что такое ACK?

   **Ответ:** ACK отмечает действительность acknowledgement field. После установки соединения обычно сопровождает большинство сегментов и подтверждает принятые байты противоположного направления.

   **Типичная ошибка:** Считать каждый ACK отдельным прикладным сообщением или гарантией чтения данных программой.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

21. Что такое FIN?

   **Ответ:** FIN означает отсутствие дальнейших байтов от отправителя в этом направлении. Он передаётся после уже поставленных данных и занимает sequence number. Встречное направление может продолжаться.

   **Типичная ошибка:** Считать FIN немедленным закрытием обоих направлений.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

22. Что такое RST?

   **Ответ:** RST аварийно сбрасывает соединение или отклоняет неподходящий сегмент в предусмотренных состояниях. Получение reset отличается от orderly EOF и может означать потерю неполученных данных.

   **Типичная ошибка:** Трактовать RST как нормальное подтверждение успешного завершения запроса.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

23. Что такое PSH?

   **Ответ:** PSH связан с push-функцией TCP, указывающей не задерживать доставку накопленных данных в соответствующей модели. Он не сохраняет send boundaries и не является переносимым record delimiter для socket API.

   **Типичная ошибка:** Ждать PSH для определения конца сообщения в recv loop.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

24. Что такое URG?

   **Ответ:** URG указывает значимость urgent pointer для устаревшего urgent-data механизма. Это не универсальный канал приоритетной доставки и не обещание меньшей задержки; новым протоколам лучше не опираться на него.

   **Типичная ошибка:** Использовать URG как способ обойти congestion/flow control.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

25. Что такое window size?

   **Ответ:** Window field объявляет receive window — сколько данных peer готов принять относительно указанной позиции. Поле 16-битное, а negotiated window scaling расширяет effective range. Это не congestion window.

   **Типичная ошибка:** Считать window в capture значением cwnd отправителя.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

26. Что такое checksum в TCP?

   **Ответ:** 16-битная checksum покрывает TCP-заголовок, данные и IP pseudo-header. Она обнаруживает многие ошибки передачи, но не защищает от намеренной подмены и не заменяет TLS.

   **Типичная ошибка:** Считать checksum криптографической подписью содержимого.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

27. Что такое MSS?

   **Ответ:** MSS — максимальный размер TCP data в сегменте, который сторона готова принять, объявляемый через SYN option. Он не включает IP/TCP headers; фактическая отправка может быть меньше из-за PMTU и options.

   **Типичная ошибка:** Считать MSS размером всего Ethernet-кадра.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

28. Чем MSS отличается от MTU?

   **Ответ:** MTU ограничивает размер L3-пакета на конкретном канале; MSS — payload TCP. При IPv4 без options и MTU 1500 базовый расчёт MSS даёт 1460, при IPv6 — 1440. Туннели и headers меняют budget.

   **Типичная ошибка:** Вычитать только Ethernet header из IP MTU или всегда считать MSS=1460.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

29. Что такое TCP options?

   **Ответ:** TCP options расширяют заголовок: MSS, window scale, SACK permitted/SACK blocks, timestamps и другие. Некоторые согласуются только в handshake; parser учитывает option lengths и data offset.

   **Типичная ошибка:** Применять window scale, увиденный в середине потока, без согласования в SYN.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

30. Почему TCP широко используется для прикладных протоколов?

   **Ответ:** Он предоставляет многим приложениям готовые доставка/порядок, управление потоком и congestion control через распространённый API. Приложение сосредотачивается на framing и семантике, но всё равно обрабатывает ошибки и deadlines.

   **Типичная ошибка:** Считать TCP избавлением от необходимости прикладных timeouts и подтверждений.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).


### Средний уровень
31. Почему TCP считается stream-oriented, а не message-oriented?

   **Ответ:** API читает/пишет байты, а протокол не хранит records прикладного уровня. Пакеты и syscall boundaries не определяют сообщения; одинаковые данные могут приходить разными порциями.

   **Типичная ошибка:** Тестировать parser только случаем, когда сообщение пришло целиком одним recv.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

32. Как приложение должно выделять сообщения поверх TCP?

   **Ответ:** Используют length prefix с проверкой допустимого размера, delimiters с escaping либо фиксированные records. Parser накапливает неполное сообщение и может извлекать несколько сообщений из одного чтения.

   **Пример:**

   ```c
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>

   // Length-prefix: 4 байта big-endian, затем payload, максимум 1 MiB.
   bool complete_frame(const uint8_t *data, size_t size, size_t *payload_size) {
       if (size < 4 || data == NULL || payload_size == NULL) return false;
       uint32_t n = ((uint32_t)data[0] << 24) | ((uint32_t)data[1] << 16) |
                    ((uint32_t)data[2] << 8) | data[3];
       if (n > 1024U * 1024U || (size_t)n > size - 4) return false;
       *payload_size = n;
       return true;
   }
   // В реальном parser различают need-more-data и invalid/oversized frame.
   ```

   **Типичная ошибка:** Выделять память по недоверенному length prefix без верхнего лимита и проверки переполнения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

33. Что может случиться, если считать один `recv()` одним сообщением?

   **Ответ:** Часть сообщения будет ошибочно обработана как целое или несколько сообщений сольются в одно. Дефект часто незаметен на localhost и проявляется при нагрузке, задержках и другом buffering.

   **Типичная ошибка:** Исправлять framing увеличением recv buffer вместо корректного parser.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

34. Почему `send()` не гарантирует отправку всех данных одним вызовом?

   **Ответ:** send возвращает реально принятые стеком байты. Ограничения send buffer, nonblocking mode и сигналы допускают partial result; успешный возврат не равен доставке peer.

   **Типичная ошибка:** После положительного неполного результата повторять весь исходный буфер.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

35. Почему `recv()` может вернуть меньше данных, чем ожидается?

   **Ответ:** Чтение возвращает доступные байты до заданного размера, а не обязательно весь ожидаемый record. Возможны EOF, signal и nonblocking error. Даже MSG_WAITALL не отменяет необходимость обработки раннего завершения/ошибок.

   **Типичная ошибка:** Считать короткий recv сам по себе повреждением TCP-потока.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

36. Что такое partial write?

   **Ответ:** Partial write — успешная запись только части запрошенных байтов. Смещают указатель и уменьшают остаток; EAGAIN ждут через readiness, EINTR обрабатывают по контракту операции.

   **Типичная ошибка:** Забыть смещение и продублировать префикс данных.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

37. Что такое partial read?

   **Ответ:** Partial read — получение меньше байтов, чем требуется прикладному parser. Сохраняют накопленное состояние и дочитывают до завершения record или terminal condition.

   **Типичная ошибка:** Перезаписывать уже прочитанный префикс следующим recv в начало буфера.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

38. Как sequence numbers помогают обеспечивать порядок?

   **Ответ:** Sequence numbers задают позиции байтов. Получатель помещает диапазоны в нужные места, отслеживает gaps и выдаёт contiguous prefix. Wraparound требует modular comparisons.

   **Типичная ошибка:** Сортировать sequence обычным unsigned `<` без учёта окна и переполнения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

39. Как acknowledgements помогают обеспечивать надёжность?

   **Ответ:** ACK сообщает, какой contiguous prefix принят, позволяя освободить send state и определить, что ещё требует подтверждения. Повторы и loss detection восстанавливают пропуски. ACK может быть cumulative и delayed.

   **Типичная ошибка:** Ожидать отдельный ACK ровно на каждый сегмент.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

40. Почему TCP может переупорядочивать сегменты на принимающей стороне?

   **Ответ:** Сеть может доставлять сегменты вне порядка. TCP буферизует допустимые out-of-order данные и выдаёт приложениям упорядоченный поток; глубина reorder ограничена ресурсами и окнами.

   **Типичная ошибка:** Считать, что приложение должно сортировать TCP records по sequence header.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

41. Как TCP обнаруживает повреждённые сегменты?

   **Ответ:** Получатель проверяет TCP checksum с pseudo-header и данными. Дополнительно sequence/window validation отбрасывает неподходящие сегменты, но это другой механизм.

   **Типичная ошибка:** Приписывать checksum обнаружение всех возможных ошибок без исключений.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

42. Что происходит при checksum error?

   **Ответ:** Повреждённый сегмент обычно молча отбрасывают. ACK progress не происходит для пропущенных байтов, и отправитель может обнаружить потерю и повторить данные. Ошибка checksum в локальном capture может быть артефактом offload.

   **Типичная ошибка:** По исходящей bad checksum в tcpdump безусловно объявлять повреждение на проводе.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

43. Почему TCP зависит от IP, но дополняет его?

   **Ответ:** IP даёт best-effort доставку между адресами. TCP поверх него добавляет endpoints по портам, порядок, recovery, flow/congestion control. Он не изменяет IP-сеть в гарантированно доступный сервис.

   **Типичная ошибка:** Считать IP ненужным после установки TCP connection.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

44. Какие задачи TCP не решает сам по себе?

   **Ответ:** TCP не задаёт message framing, аутентификацию, шифрование, прикладные deadlines или exactly-once выполнение операций. Он также не гарантирует успешное завершение при бесконечном отказе сети.

   **Типичная ошибка:** Считать повтор запроса после TCP reconnect автоматически безопасным для любой операции.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

45. Почему TCP соединение идентифицируется 4-tuple?

   **Ответ:** В обычном TCP стек различает соединения по local IP/port и remote IP/port в контексте протокола и namespace. Поэтому много клиентов может одновременно обращаться к одному server port.

   **Типичная ошибка:** Считать каждый принятый клиент требующим нового номера listening port.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

46. Что входит в 4-tuple TCP соединения?

   **Ответ:** Source IP, source port, destination IP, destination port. Для двунаправленного соединения те же endpoints меняются ролями; при общей классификации разных транспортов добавляют protocol и говорят о 5-tuple.

   **Типичная ошибка:** Игнорировать NAT и namespace при корреляции tuples из разных точек сети.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

47. Может ли один сокет обслуживать много TCP соединений?

   **Ответ:** Обычный connected TCP socket соответствует одному соединению. Listening socket принимает множество соединений, но accept возвращает отдельный connected socket для каждого. dup создаёт ещё descriptor того же socket, а не новое соединение.

   **Типичная ошибка:** Читать данные всех клиентов из listening fd вместо accepted fds.

   **Источник:** [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

48. Чем listening socket отличается от connected socket?

   **Ответ:** Listener хранит локальную привязку и очереди установления/приёма. Connected socket имеет конкретный peer, buffers и TCP state; accept не заменяет listener, а возвращает новый descriptor.

   **Типичная ошибка:** Закрывать listener после каждого accept, если сервер должен продолжать принимать клиентов.

   **Источник:** [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html); [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html).

49. Что происходит с сегментом, если приложение не читает данные?

   **Ответ:** Принятые допустимые данные заполняют receive buffers, уменьшая advertised window; затем sender ограничивается flow control. ACK не ждёт обязательного чтения приложением. При нехватке ресурсов возможны drops.

   **Типичная ошибка:** Считать отсутствие application read автоматическим отсутствием TCP ACK с первого байта.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

50. Что означает backpressure в TCP?

   **Ответ:** Backpressure — распространение ограничения потребления назад к производителю. Медленный read уменьшает receive window, затем заполняется send buffer peer и его write блокируется либо получает EAGAIN.

   **Типичная ошибка:** Выносить данные из socket в бесконечную user-space очередь и считать backpressure сохранённым.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).


### Продвинутый уровень
51. Как TCP реализуется в ядре Linux на высоком уровне?

   **Ответ:** Обычно Linux kernel держит TCP state, очереди, таймеры, congestion/loss logic и связывает их с socket API. RX/TX проходит network stack, routing и driver/NIC; offload может переносить часть обработки. Приложение не вызывает отдельный syscall на каждый wire segment.

   **Типичная ошибка:** Считать TCP исключительно пользовательской библиотекой, сериализующей один send в один packet.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

52. Что такое send buffer и receive buffer?

   **Ответ:** Send buffer хранит данные/состояние для отправки и recovery, receive buffer — принятые данные и связанные структуры. Kernel accounting включает overhead, поэтому размер buffer не равен точному количеству application payload.

   **Типичная ошибка:** Ожидать, что каждый байт SO_SNDBUF — один байт полезных данных в полёте.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

53. Как размер socket buffer влияет на производительность?

   **Ответ:** Недостаточные buffers могут ограничить окно/очередь ниже нужного BDP. Чрезмерные увеличивают память и возможность queueing. Linux autotuning и sysctl влияют на результат; размер выбирают по measurements.

   **Типичная ошибка:** Безусловно увеличивать buffers всем соединениям до максимума.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

54. Что происходит между `write()` приложения и отправкой сегмента NIC?

   **Ответ:** Данные принимаются send path, учитываются в TCP queues, сегментируются с учётом MSS/options/windows и проходят routing/qdisc/driver к NIC. Копирование/zero-copy и offload зависят от API и настроек. Успех write предшествует подтверждению peer.

   **Типичная ошибка:** Измерять длительность write как полный network RTT.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

55. Как ядро решает, когда формировать TCP segment?

   **Ответ:** Учитывает MSS/PMTU, cwnd/rwnd, накопленные данные, pacing, Nagle/cork и timers. При TSO/GSO крупная внутренняя единица может разделяться позже. Решение не задаётся только размером одного write.

   **Типичная ошибка:** Считать TCP_NODELAY запретом любой агрегации на всём пути.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

56. Что такое segmentation offload?

   **Ответ:** Segmentation offload переносит деление крупной внутренней сетевой единицы на меньшие сегменты в позднюю программную стадию или NIC. На проводе при этом должны соблюдаться ограничения пакетов.

   **Типичная ошибка:** Считать offload разрешением отправлять произвольно большой Ethernet frame в обычный MTU.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

57. Что такое TSO/GSO на концептуальном уровне?

   **Ответ:** TSO поручает TCP segmentation поддерживающей NIC; GSO предоставляет общий программный механизм поздней сегментации. Они уменьшают per-packet overhead в верхних частях стека.

   **Типичная ошибка:** Считать GSO обязательно аппаратной функцией NIC.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

58. Что такое GRO/LRO на приёмной стороне?

   **Ответ:** GRO агрегирует совместимые принятые пакеты программно для уменьшения stack overhead; LRO — родственный механизм, часто на уровне NIC/driver. Это внутренняя оптимизация, не изменение TCP stream semantics.

   **Типичная ошибка:** Делать вывод о размерах wire packets только по агрегированным RX buffers.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

59. Как offloading влияет на анализ tcpdump?

   **Ответ:** Capture hook может видеть крупные pre-segmentation или post-aggregation buffers и ещё не вычисленную аппаратно checksum. Для wire-фактов лучше внешняя точка захвата либо контролируемый тест с offloads учтёнными/отключёнными.

   **Пример:**

   ```bash
   ethtool -k eth0  # Linux: посмотреть включённые offloads.
   # Capture требует прав; вывод зависит от точки захвата.
   tcpdump -ni eth0 -c 20 tcp
   ```

   **Типичная ошибка:** Объявлять MTU violation только по локальному super-packet в capture.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

60. Почему данные в tcpdump иногда выглядят "крупнее", чем MTU?

   **Ответ:** Обычно это TSO/GSO до разбиения на TX или GRO/LRO после объединения на RX. Такие записи не обязательно соответствуют одному физическому кадру. Также отдельно проверяют VLAN/tunnel overhead и jumbo MTU.

   **Типичная ошибка:** Считать каждую запись pcap точным Ethernet frame на проводе независимо от capture point.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

61. Как NIC offload может мешать отладке TCP?

   **Ответ:** Скрывает реальные границы сегментов, меняет вид checksum и timing/batching. Проверяют ethtool и capture location, сравнивают внешние traces. Отключение offload меняет performance, поэтому результат оценивают в контексте.

   **Типичная ошибка:** Делать production tuning выводы только из запуска с полностью отключёнными ускорениями.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

62. Что такое socket backlog?

   **Ответ:** Backlog — ограничение/очереди ожидающих TCP подключений. В Linux параметр listen backlog относится к completed connections, ожидающим accept; incomplete SYN state регулируется отдельно.

   **Пример:**

   ```bash
   ss -lnt  # Linux: очереди TCP listeners; значения интерпретируются по состоянию.
   ```

   **Типичная ошибка:** Приравнивать listen backlog к числу всех established клиентов сервера.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html).

63. Как backlog связан с установкой соединения?

   **Ответ:** Kernel выполняет handshake независимо от accept и помещает завершённые подключения в очередь приложения. Если оно не успевает забирать, ограничения очередей влияют на новые подключения.

   **Типичная ошибка:** Считать accept вызовом, который отправляет SYN-ACK и запускает handshake с нуля.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html).

64. Чем accept queue отличается от SYN queue?

   **Ответ:** SYN queue хранит ещё не завершённые handshake состояния, accept queue — готовые connections, ожидающие accept. SYN cookies могут менять хранение incomplete state. Linux limits этих очередей различаются.

   **Типичная ошибка:** Увеличить только listen backlog и считать SYN flood полностью решённым.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html); [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987).

65. Что происходит, если accept queue переполнена?

   **Ответ:** Новые подключения могут задерживаться, теряться или сбрасываться в зависимости от стека и настроек, включая Linux tcp_abort_on_overflow. Клиентский connect и server accept не всегда наблюдают успех одновременно.

   **Типичная ошибка:** Считать accept queue overflow гарантированным немедленным ECONNREFUSED у каждого клиента.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

66. Что происходит, если приложение слишком медленно вызывает `accept()`?

   **Ответ:** Completed connections накапливаются; при заполнении очереди ухудшается установка новых. Нужно отличать медленный accept loop от медленной обработки уже принятых клиентов и лимитов fds.

   **Типичная ошибка:** Увеличивать backlog бесконечно, не исправляя блокировку accept loop.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html).

67. Как TCP соединение связано с файловым дескриптором в Unix?

   **Ответ:** Descriptor — process-local handle на kernel socket object; несколько fds могут ссылаться на него после dup/fork. Accepted socket получает отдельный fd. Владение и lifetime нужно определить явно.

   **Типичная ошибка:** Считать close одного dup-fd обязательным немедленным закрытием TCP connection.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html).

68. Как epoll/select/poll используются с TCP сокетами?

   **Ответ:** Readiness APIs сообщают, что операция может продвинуться или обнаружить terminal/error state. После уведомления всё равно обрабатывают partial I/O и EAGAIN; для EPOLLET читают/пишут до исчерпания готовности в nonblocking mode.

   **Пример:**

   ```bash
   ss -tin  # Linux: TCP state и внутренние метрики, а не application message boundaries.
   ```

   **Типичная ошибка:** Принимать EPOLLIN за гарантию наличия целого application message.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

69. Почему TCP код часто требует state machine в приложении?

   **Ответ:** Нужно хранить стадии connect, parsing, pending writes, half-close и deadlines между событиями. Неблокирующее выполнение не обязано завершать операцию за один callback.

   **Типичная ошибка:** Смешивать все состояния в один recv loop без сохранения неполного record.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

70. Какие ошибки проектирования чаще всего возникают при работе с TCP в C/C++?

   **Ответ:** Типичны нарушение framing, partial I/O, ownership fd, блокирующий DNS, отсутствие deadlines, unbounded queues и неправильная обработка EOF/errors. Исправляют через явные контракты и state machine.

   **Типичная ошибка:** Считать happy-path echo достаточной проверкой сетевой библиотеки.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).


---

## 2. TCP: 3-way handshake

### Базовый уровень
71. Что такое 3-way handshake?

   **Ответ:** Обычный three-way handshake — обмен SYN, SYN-ACK и ACK, синхронизирующий два sequence space и устанавливающий состояние TCP. Возможны retransmissions и специальные варианты, поэтому фактических пакетов бывает больше трёх.

   **Типичная ошибка:** Считать ровно три пакета обязательным свойством любого capture успешного подключения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

72. Зачем TCP нужен handshake перед передачей данных?

   **Ответ:** Для согласования initial sequence numbers, параметров и подтверждения, что обе стороны получают управляющие сообщения. Он снижает риск принятия старых сегментов за новое соединение, но не аутентифицирует пользователя.

   **Типичная ошибка:** Приравнивать TCP handshake к TLS authentication или проверке готовности приложения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

73. Какие пакеты участвуют в 3-way handshake?

   **Ответ:** Клиент отправляет SYN с ISN x; сервер — SYN+ACK с ISN y и ACK x+1; клиент — ACK y+1. Последний сегмент может уже содержать данные.

   **Пример:**

   ```bash
   # Linux: capture до подключения, нужны права. В другом терминале инициируйте запрос.
   tcpdump -ni any -S -c 12 'host 192.0.2.10 and tcp port 443'
   ```

   **Типичная ошибка:** Забывать, что SYN занимает одну позицию sequence space.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

74. Что отправляет клиент первым?

   **Ответ:** При active open клиент обычно отправляет SYN со своим ISN и options. TCP Fast Open допускает данные в SYN при поддержке, но это отдельное расширение.

   **Типичная ошибка:** Утверждать, что SYN никогда не может содержать application data.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7413: TCP Fast Open](https://www.rfc-editor.org/rfc/rfc7413).

75. Что отвечает сервер на SYN?

   **Ответ:** При допустимом passive open сервер отправляет SYN-ACK, подтверждая клиентский SYN и объявляя свой ISN/options. При отсутствии listener возможен RST; firewall может дать другой результат.

   **Типичная ошибка:** Считать отсутствие SYN-ACK однозначным признаком выключенного сервера.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

76. Что отправляет клиент после SYN-ACK?

   **Ответ:** Он подтверждает SYN сервера ACK с acknowledgement y+1 и переходит к обычной передаче. Пакет может быть объединён с данными; отсутствие отдельного пустого ACK не означает ошибку handshake.

   **Типичная ошибка:** Искать только ACK без payload как обязательный третий пакет.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

77. Почему handshake состоит именно из трёх шагов?

   **Ответ:** Нужно синхронизировать два независимых ISN и получить подтверждение SYN обеих сторон. SYN-ACK совмещает подтверждение первого SYN со встречным SYN, поэтому обычный обмен укладывается в три сегмента.

   **Типичная ошибка:** Объяснять число шагов произвольной «проверкой скорости» канала.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

78. Что подтверждает SYN-ACK?

   **Ответ:** SYN-ACK подтверждает принятие SYN клиента через ACK x+1 и сообщает sequence start сервера. Сам по себе он ещё не доказывает серверу получение этого ответа клиентом.

   **Типичная ошибка:** Считать отправку SYN-ACK полным завершением passive handshake на сервере.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

79. Что подтверждает финальный ACK?

   **Ответ:** Финальный ACK подтверждает SYN сервера и позволяет серверному state перейти к established при допустимых параметрах. Он не подтверждает, что серверное приложение вызвало accept.

   **Типичная ошибка:** Использовать финальный ACK как доказательство готовности бизнес-сервиса.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

80. Когда соединение считается установленным?

   **Ответ:** У сторон переходы локальны: клиент обычно становится ESTABLISHED после допустимого SYN-ACK и отправки ACK, сервер — после получения допустимого ACK. Поэтому короткий интервал разные стороны могут наблюдать разные состояния.

   **Типичная ошибка:** Считать establishment атомарным одновременным событием на обоих хостах.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

81. Почему нельзя обойтись двумя пакетами?

   **Ответ:** Два пакета не дают серверу подтверждения получения его SYN клиентом. Это особенно важно при старых дубликатах и рассогласовании sequence space.

   **Типичная ошибка:** Считать двустороннюю IP-достижимость до handshake достаточной заменой синхронизации TCP state.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

82. Что такое initial sequence number?

   **Ответ:** ISN — initial sequence number выбранного направления соединения. SYN занимает эту позицию; первые обычные data bytes следуют за ней. Генерация учитывает защиту от угадывания и старых сегментов.

   **Типичная ошибка:** Использовать постоянный ISN как безопасную production-схему собственного TCP stack.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

83. Зачем sequence number обмениваются уже на этапе handshake?

   **Ответ:** Обе стороны должны знать исходную точку нумерации байтов и подтвердить её до обычного обмена. Это связывает дальнейшие ACK и segments с конкретным экземпляром соединения.

   **Типичная ошибка:** Считать sequence номером приложения или счётчиком запросов HTTP.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

84. Какие TCP options обычно согласуются в handshake?

   **Ответ:** Часто MSS, window scale, SACK permitted и timestamps. Не все options просто выбирают одинаковое значение для сторон: например, MSS/scale описывают параметры соответствующего направления.

   **Типичная ошибка:** Считать MSS двусторонним минимумом, который обе стороны обязаны объявить одинаково.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

85. Что такое SYN flood?

   **Ответ:** SYN flood расходует ресурсы установления множеством SYN/half-open состояний, иногда с поддельными sources. Защита включает cookies, ограничения, capacity и внешнюю фильтрацию; это не единственный тип DDoS.

   **Типичная ошибка:** Считать защиту SYN cookies достаточной против перегрузки bandwidth или application layer.

   **Источник:** [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987).


### Средний уровень
86. Почему handshake нужен для синхронизации состояний обеих сторон?

   **Ответ:** Handshake связывает endpoints, sequence space и возможности стека с конкретным connection instance. Без подтверждения обеих SYN возможны stale/half-open состояния и ошибочное принятие старого трафика.

   **Типичная ошибка:** Использовать только IP/port tuple без проверки sequence/state в собственной реализации.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

87. Что означает half-open connection?

   **Ответ:** В терминологии TCP half-open — рассогласование: одна сторона считает соединение установленным, другая потеряла/закрыла состояние. В контексте SYN flood так также называют незавершённый handshake в SYN-RECEIVED; нужно уточнить смысл.

   **Типичная ошибка:** Путать half-open с корректным half-close, где одно направление штатно закончено.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987).

88. Что происходит на сервере после получения SYN?

   **Ответ:** При наличии listener и допустимом SYN формирует состояние SYN-RECEIVED и SYN-ACK; SYN cookies могут избежать обычного хранения request state. Данные ещё не обязаны быть доступны через accept.

   **Типичная ошибка:** Предполагать немедленное выделение полного application fd на каждый SYN.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987).

89. В каком состоянии находится клиент после отправки SYN?

   **Ответ:** После active open и отправки SYN клиент находится в SYN-SENT, ожидая подходящий ответ и выполняя retries по таймерам.

   **Типичная ошибка:** Считать SYN-SENT признаком, что сервер уже принял соединение.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

90. В каком состоянии сервер находится после получения SYN и отправки SYN-ACK?

   **Ответ:** Обычно SYN-RECEIVED, пока не получено подтверждение собственного SYN. При SYN cookies внутреннее хранение request state может отличаться от обычного.

   **Типичная ошибка:** Путать SYN-RECEIVED с очередью полностью готовых accepted sockets.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987).

91. Что означает состояние SYN_SENT?

   **Ответ:** SYN-SENT означает ожидание ответа на начальный SYN при active open. Из состояния возможны успех, simultaneous open, отказ или timeout.

   **Пример:**

   ```bash
   ss -nt state syn-sent  # Linux
   ```

   **Типичная ошибка:** Считать SYN-SENT обязательно firewall drop: причин отсутствия ответа несколько.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

92. Что означает состояние SYN_RECEIVED?

   **Ответ:** SYN-RECEIVED означает, что SYN peer принят и свой SYN отправлен, но ещё ждёт подтверждения. Это состояние встречается при passive и simultaneous open.

   **Типичная ошибка:** Считать любой долгий SYN-RECEIVED доказательством SYN flood без анализа потерь.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

93. Что означает состояние ESTABLISHED?

   **Ответ:** ESTABLISHED разрешает обычный двунаправленный обмен данными. Это TCP state, а не доказательство успешного TLS, авторизации или здоровья peer-приложения.

   **Типичная ошибка:** Считать established connection гарантированно живым после сетевого разрыва без новых обменов.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

94. Что происходит, если финальный ACK потеряется?

   **Ответ:** Сервер может повторить SYN-ACK; клиент снова подтвердит его. Корректный ACK с последующими данными также может завершить handshake. Клиентский connect уже мог вернуть успех.

   **Типичная ошибка:** Немедленно разрывать состояние на сервере после потери одного финального ACK.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

95. Может ли соединение всё равно установиться при потере ACK?

   **Ответ:** Да, retransmission SYN-ACK и новый ACK или допустимый сегмент данных с нужным ACK могут завершить синхронизацию. Это требует сохранения состояния и доступности пути.

   **Типичная ошибка:** Считать потерю третьего пакета невосстановимой ошибкой TCP.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

96. Что такое retransmission SYN?

   **Ответ:** Повторная передача SYN при отсутствии допустимого ответа до таймера. Число попыток и интервалы зависят от стека/configuration; повторы не означают несколько independent application connections.

   **Типичная ошибка:** Считать каждый SYN retry новым вызовом connect приложения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

97. Как TCP определяет timeout при handshake?

   **Ответ:** Используются retransmission timers и backoff; RFC задаёт базовые требования, ОС — конкретные limits и настройки. Application deadline может завершить попытку раньше kernel timeout.

   **Типичная ошибка:** Ожидать единого точного времени timeout для всех ОС и конфигураций.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

98. Что происходит, если сервер не отвечает на SYN?

   **Ответ:** Клиент повторяет SYN в пределах политики; затем connect завершается ошибкой или application timeout. Причина может быть route, loss, filtering, перегрузка или недоступный listener с молчаливой политикой.

   **Типичная ошибка:** По отсутствию SYN-ACK безусловно заключать, что IP назначения не существует.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

99. Что увидит приложение при неудачном `connect()`?

   **Ответ:** Blocking connect возвращает -1 с errno; nonblocking начинает с EINPROGRESS, затем итог проверяют SO_ERROR после readiness. Приложение может иметь собственный timeout и должно закрыть неуспешный socket.

   **Типичная ошибка:** Переиспользовать socket после failed connect без проверки разрешённого контракта ОС.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

100. Чем `ECONNREFUSED` отличается от timeout при `connect()`?

   **Ответ:** ECONNREFUSED обычно соответствует активному отказу, например RST от закрытого порта или reject. Timeout означает отсутствие успешного завершения в пределах срока и не указывает однозначно на место отказа.

   **Типичная ошибка:** При timeout утверждать, что порт закрыт, хотя закрытый TCP-порт часто отвечает RST.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

101. Когда сервер отвечает RST вместо SYN-ACK?

   **Ответ:** Например, SYN пришёл на адрес/порт без listening endpoint и не был молча отфильтрован. RST может формировать firewall/proxy; проверяют source и точку захвата.

   **Типичная ошибка:** Считать любой RST доказательством ответа именно процесса сервера.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

102. Как firewall влияет на handshake?

   **Ответ:** Firewall может пропускать, молча отбрасывать или активно отклонять handshake traffic; stateful policy зависит от направления/состояния. Асимметрия и переполнение state tables тоже влияют.

   **Типичная ошибка:** Открыть только клиентский SYN и не разрешить корректный обратный SYN-ACK/ACK.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

103. Почему handshake помогает защититься от старых/дублированных сегментов?

   **Ответ:** Свежие ISN и проверка ACK подтверждают соответствие новому connection instance. Это уменьшает риск старых duplicate segments, но не заменяет криптографию и правильные TIME-WAIT/sequence rules.

   **Типичная ошибка:** Считать handshake защитой от любого активного MITM.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

104. Что такое SYN cookies?

   **Ответ:** SYN cookie кодирует проверяемую информацию в server ISN и позволяет проверить финальный ACK без обычного per-SYN request state. Возможности и ограничения зависят от реализации и сохраняемых options.

   **Типичная ошибка:** Считать cookie application token или средством аутентификации клиента.

   **Источник:** [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

105. Как SYN cookies помогают против SYN flood?

   **Ответ:** Они уменьшают исчерпание SYN state, откладывая обычное выделение состояния до проверенного ACK. Но не устраняют bandwidth/CPU нагрузку и переполнение других очередей.

   **Типичная ошибка:** Включить cookies и не наблюдать listen drops, CPU и legit connection success.

   **Источник:** [RFC 4987: TCP SYN Flooding Attacks and Common Mitigations](https://www.rfc-editor.org/rfc/rfc4987).


### Продвинутый уровень
106. Как посмотреть handshake в tcpdump?

   **Ответ:** tcpdump с адресом/портом показывает SYN, SYN-ACK, ACK; -S выводит absolute sequence numbers. Capture должен начаться до подключения; учитывают retries, timestamps и обе стороны.

   **Пример:**

   ```bash
   tcpdump -ni eth0 -S -c 12 'tcp port 8080'
   ```

   **Типичная ошибка:** Считать relative sequence numbers в анализаторе реальным ISN, равным нулю.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

107. Как увидеть handshake в Wireshark?

   **Ответ:** Используют display filter по tcp.stream либо endpoint и рассматривают SYN/ACK flags, sequence и timestamps. Expert labels — эвристики, а неполный capture может дать ложные выводы.

   **Типичная ошибка:** Принимать Wireshark «previous segment not captured» за доказанную network loss.

   **Источник:** [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

108. Как `connect()` связан с 3-way handshake на уровне ядра?

   **Ответ:** Для обычного TCP active open connect запускает kernel state machine, route/neighbour resolution и handshake. Blocking вызов ждёт завершения или ошибки; nonblocking возвращается раньше. Серверное приложение может ещё не выполнить accept.

   **Типичная ошибка:** Считать успешный connect подтверждением обработки application request.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

109. Когда `connect()` возвращает управление приложению?

   **Ответ:** Обычный blocking TCP connect — при успешном локальном establishment либо ошибке; nonblocking может сразу вернуть EINPROGRESS. Special options вроде TCP_FASTOPEN_CONNECT меняют детали, поэтому контракт нужно указывать.

   **Типичная ошибка:** Обобщать обычную семантику на все TFO modes без проверки.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

110. Что происходит при non-blocking `connect()`?

   **Ответ:** Обычно возвращает -1/EINPROGRESS; приложение ждёт readiness или свой deadline, затем проверяет SO_ERROR. Готовность к записи сама по себе не гарантирует успех.

   **Типичная ошибка:** Считать EINPROGRESS окончательным отказом либо готовым подключением.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html).

111. Как понять, что non-blocking `connect()` завершился успешно?

   **Ответ:** После уведомления о завершении connect вызывают getsockopt(SOL_SOCKET, SO_ERROR). Нулевой error означает успех, ненулевой — код ошибки. Нужно также обработать ошибку самого getsockopt и timeout ожидания.

   **Пример:**

   ```c
   #include <sys/socket.h>

   // Вызывать после readiness завершения nonblocking connect.
   // 0: подключено; положительное: socket error; -1: ошибка getsockopt.
   int connection_result(int fd) {
       int error = 0;
       socklen_t size = sizeof error;
       if (getsockopt(fd, SOL_SOCKET, SO_ERROR, &error, &size) == -1) return -1;
       return error;
   }
   ```

   **Типичная ошибка:** Использовать только POLLOUT/EPOLLOUT как признак успешного handshake.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

112. Почему после `EINPROGRESS` обычно проверяют сокет через `select`/`poll`/`epoll`?

   **Ответ:** Readiness позволяет ждать завершение без blocking event loop и без busy polling. Возврат по write/error readiness требует проверки SO_ERROR, а deadline — корректной отмены/закрытия сокета.

   **Типичная ошибка:** Постоянно вызывать connect в цикле до успеха вместо ожидания завершения текущей попытки.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html); [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html).

113. Что показывает `getsockopt(SO_ERROR)` после non-blocking `connect()`?

   **Ответ:** SO_ERROR возвращает и очищает pending socket error; после завершившейся обычной connect attempt значение 0 означает успех. Повторное чтение может уже не вернуть прежнюю ошибку, поэтому результат сохраняют.

   **Типичная ошибка:** Игнорировать ненулевой SO_ERROR, потому что сам getsockopt вернул 0.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

114. Что происходит на стороне сервера между `listen()` и `accept()`?

   **Ответ:** Kernel обрабатывает SYN, поддерживает incomplete state, завершает handshake и помещает готовые connections в accept queue. listen/accept — работа приложения с listener, а не пользовательская реализация handshake.

   **Типичная ошибка:** Считать, что без вызванного accept ядро вообще не отвечает на SYN.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html).

115. Как handshake выглядит для `accept()`?

   **Ответ:** accept обычно возвращает уже установленный kernel connection из очереди или ждёт его появления. Между readiness и accept возможны изменения/ошибки, особенно при нескольких workers.

   **Типичная ошибка:** Делать blocking accept в event loop после предположения, что readiness никогда не устаревает.

   **Источник:** [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html).

116. Почему accepted socket отличается от listening socket?

   **Ответ:** Listener продолжает обслуживать новые подключения, accepted socket относится к одному peer и его stream. Это разные kernel objects/handles с разным назначением; наследование options/flags нужно проверять по ОС.

   **Типичная ошибка:** Считать accepted fd всегда автоматически nonblocking только потому, что nonblocking listener.

   **Источник:** [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html).

117. Как backlog влияет на устойчивость сервера под нагрузкой?

   **Ответ:** Backlog поглощает кратковременные всплески completed connections до accept. Он ограничен системными settings и не заменяет быстрый accept loop, fd capacity и обработку нагрузки.

   **Типичная ошибка:** Использовать большой backlog как единственное средство защиты от длительного overload.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

118. Что такое simultaneous open?

   **Ответ:** Simultaneous open — обе стороны выполняют active open, и встречные SYN приводят к предусмотренной синхронизации состояния. TCP допускает такой сценарий, хотя обычный client/server чаще использует active/passive open.

   **Типичная ошибка:** Считать встречный SYN в SYN-SENT безусловно некорректным.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

119. Может ли TCP handshake происходить одновременно в обе стороны?

   **Ответ:** Да, при simultaneous open, если endpoints и сеть позволяют. Стек обрабатывает встречные SYN и подтверждения по TCP state machine; NAT/firewall могут усложнить практическую достижимость.

   **Типичная ошибка:** Обещать, что наличие simultaneous open автоматически решает TCP NAT traversal.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

120. Что такое TCP Fast Open?

   **Ответ:** TCP Fast Open позволяет передавать data уже в SYN и ускорять некоторые обмены, используя TFO cookie и поддержку обеих сторон. Это отдельный механизм от TLS 0-RTT и не отменяет TCP state machine.

   **Типичная ошибка:** Отправлять произвольную replay-sensitive операцию в early data без анализа повторного исполнения.

   **Источник:** [RFC 7413: TCP Fast Open](https://www.rfc-editor.org/rfc/rfc7413).

121. Какие преимущества даёт TCP Fast Open?

   **Ответ:** Он может уменьшить задержку до передачи/обработки первых данных на один RTT в подходящих сценариях. Выигрыш зависит от cookie, потерь, middleboxes и приложения, а не гарантирован для каждого подключения.

   **Типичная ошибка:** Обещать ускорение bulk throughput только из-за сокращения startup latency.

   **Источник:** [RFC 7413: TCP Fast Open](https://www.rfc-editor.org/rfc/rfc7413).

122. Какие ограничения и риски у TCP Fast Open?

   **Ответ:** Нужны поддержка, fallback при несовместимости и безопасная семантика early data: SYN/data могут повторяться. Middleboxes и cookies влияют на применимость; измеряют реальные success/latency.

   **Типичная ошибка:** Считать TCP delivery защитой от replay прикладного действия в TFO early data.

   **Источник:** [RFC 7413: TCP Fast Open](https://www.rfc-editor.org/rfc/rfc7413).

123. Как handshake ведёт себя при packet loss?

   **Ответ:** Потери SYN/SYN-ACK вызывают retries и backoff; потеря ACK восстанавливается повторным SYN-ACK или последующим допустимым ACK/data. Tail connect latency может резко вырасти даже при малом среднем loss.

   **Типичная ошибка:** Считать handshake latency равной одному RTT независимо от потерь.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

124. Как считать RTT по handshake?

   **Ответ:** На клиентском capture интервал SYN→SYN-ACK приблизительно отражает RTT плюс server processing; на сервере SYN-ACK→ACK — аналогичная оценка. Retries, delayed capture и асимметрия усложняют выводы.

   **Типичная ошибка:** Считать интервалы между пакетами с разных несинхронизированных hosts точной one-way задержкой.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

125. Какие метрики handshake полезно логировать на сервере?

   **Ответ:** Connection attempts/success, connect duration distributions, SYN retries, listen queue occupancy/drops, resets и accept delay. Серверное приложение не видит каждую SYN-попытку, поэтому нужны kernel/host metrics и client view.

   **Типичная ошибка:** Считать число successful accept полным числом клиентов, пытавшихся подключиться.

   **Источник:** [Linux man-pages: listen(2)](https://man7.org/linux/man-pages/man2/listen.2.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).


---

## 3. TCP: завершение соединения

### Базовый уровень
126. Как TCP соединение закрывается штатно?

   **Ответ:** Каждая сторона завершает своё направление FIN, peer подтверждает его ACK. Встречный FIN может прийти позже или совместиться с ACK. Приложение должно согласовать завершение прикладного обмена отдельно.

   **Типичная ошибка:** Считать close гарантией обработки всех ранее отправленных данных peer-приложением.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html).

127. Чем закрытие TCP отличается от установки соединения?

   **Ответ:** Handshake синхронизирует два sequence space в обычном трёхстороннем обмене. Закрытие независимо завершает два направления, поэтому требует отдельных FIN/ACK и может включать half-close.

   **Типичная ошибка:** Ожидать, что полученный FIN запрещает отправлять ответ в ещё открытом направлении.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

128. Что такое four-way termination?

   **Ответ:** Типичный обмен FIN → ACK → FIN → ACK. Это удобная схема, а не обязательное число packets: FIN+ACK могут совмещаться, возможны retransmissions и simultaneous close.

   **Типичная ошибка:** Объявлять закрытие некорректным только потому, что capture содержит три сегмента вместо четырёх.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

129. Что означает FIN?

   **Ответ:** FIN сообщает конец данных отправляющей стороны. Он следует за предыдущими байтами в sequence space; EOF становится виден приложению после чтения предшествующих данных.

   **Типичная ошибка:** При первом FIN отбрасывать ещё не прочитанные принятые байты.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

130. Что означает graceful shutdown?

   **Ответ:** Graceful shutdown — завершение с сохранением согласованной прикладной семантики и orderly закрытием transport. Обычно прекращают новые операции, допередают ответы, half-close/дочитывают по протоколу и ограничивают ожидание deadline.

   **Типичная ошибка:** Ждать peer FIN бесконечно, называя это graceful shutdown.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html).

131. Что такое half-close?

   **Ответ:** Half-close — одно направление TCP закончено, другое остаётся доступным. После shutdown(SHUT_WR) можно продолжать читать; peer видит EOF после всех отправленных байтов.

   **Пример:**

   ```c
   #include <sys/socket.h>

   // После завершения user-space очереди отправки; fd затем ещё читают и закрывают.
   int finish_sending(int fd) {
       return shutdown(fd, SHUT_WR);
   }
   ```

   **Типичная ошибка:** Закрывать оба направления, когда протокол использует EOF запроса перед ответом.

   **Источник:** [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

132. Что делает `close()`?

   **Ответ:** close освобождает descriptor; при последней ссылке инициируется освобождение socket с поведением, зависящим от state и linger. Передача/FIN могут продолжаться в kernel после возврата; close не является application delivery confirmation.

   **Типичная ошибка:** Считать close(fd) синхронным подтверждением получения всех байтов удалённым приложением.

   **Источник:** [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

133. Что делает `shutdown()`?

   **Ответ:** shutdown отключает чтение, запись или оба направления socket через SHUT_RD/WR/RDWR, не освобождая descriptor. Для TCP SHUT_WR инициирует завершение отправки после уже поставленных данных.

   **Типичная ошибка:** Использовать shutdown вместо close и утекать файловыми дескрипторами.

   **Источник:** [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html).

134. Чем `shutdown()` отличается от `close()`?

   **Ответ:** close убирает конкретный fd reference; shutdown меняет состояние самого socket endpoint и затрагивает его использование через другие дубликаты. После shutdown fd всё равно нужно закрыть.

   **Типичная ошибка:** Ожидать независимого half-close у двух dup-fds одного socket.

   **Источник:** [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html); [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html).

135. Что означает RST при завершении соединения?

   **Ответ:** RST означает abort/reset, а не orderly конец stream. Peer может увидеть ECONNRESET, а ожидаемые данные/результат операции могут остаться неопределёнными на уровне приложения.

   **Типичная ошибка:** Повторять неидемпотентную операцию после reset, считая, что сервер точно ничего не сделал.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).


### Средний уровень
136. Почему закрытие часто требует четырёх пакетов?

   **Ответ:** Каждое направление имеет собственный FIN и его подтверждение; их моменты не обязаны совпадать. ACK первого FIN может совмещаться со встречным FIN, сокращая число сегментов.

   **Типичная ошибка:** Считать FIN обязательно последним сегментом всего двустороннего обмена.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

137. Что происходит, если одна сторона больше не хочет отправлять данные, но готова принимать?

   **Ответ:** Вызывает shutdown(SHUT_WR), завершив pending application writes по своей state machine, и продолжает recv. Это корректно, только если прикладной протокол допускает такую границу запроса.

   **Типичная ошибка:** Вызывать close и ожидать возможность прочитать ответ по тому же fd.

   **Источник:** [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

138. Что означает состояние FIN_WAIT_1?

   **Ответ:** FIN-WAIT-1: локальная сторона инициировала orderly close и ждёт подтверждения своего FIN либо встречного FIN. Дальнейший переход зависит от порядка ACK и FIN.

   **Типичная ошибка:** Считать FIN-WAIT-1 состоянием ожидания первого application response.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

139. Что означает состояние FIN_WAIT_2?

   **Ответ:** FIN-WAIT-2: локальный FIN подтверждён, но встречный FIN ещё не получен. Входящие данные peer могут продолжаться. Kernel cleanup/timeouts для orphan sockets зависят от ОС.

   **Типичная ошибка:** Считать FIN-WAIT-2 аналогом TIME-WAIT и лечить одинаковыми sysctl.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

140. Что означает состояние CLOSE_WAIT?

   **Ответ:** CLOSE-WAIT означает, что FIN peer получен и локальное приложение ещё не закрыло отправляющее направление/socket. Длительное накопление часто указывает на application lifetime bug.

   **Пример:**

   ```bash
   ss -nt state close-wait  # Linux: ищем также владельца процесса с -p и нужными правами.
   ```

   **Типичная ошибка:** Списывать тысячи CLOSE-WAIT на обязательный kernel timeout вместо поиска незакрытых sockets.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html).

141. Что означает состояние LAST_ACK?

   **Ответ:** LAST-ACK: после получения FIN peer локальная сторона отправила свой FIN и ждёт его ACK. Затем обычное закрытие может завершиться без локального TIME-WAIT.

   **Типичная ошибка:** Считать LAST-ACK очередью ожидания application accept.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

142. Что означает состояние TIME_WAIT?

   **Ответ:** TIME-WAIT сохраняет состояние после завершения обмена FIN/ACK для обработки повторного FIN и защиты от старых сегментов. Обычно это 2×MSL по модели TCP; конкретная длительность зависит от реализации.

   **Пример:**

   ```bash
   ss -nt state time-wait
   ```

   **Типичная ошибка:** Называть TIME-WAIT утечкой application fd без проверки.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

143. Зачем нужен TIME_WAIT?

   **Ответ:** Он позволяет повторить последний ACK при retransmitted FIN и отделяет старые дубликаты от нового connection instance с тем же tuple. Без него быстрое повторное использование tuple опаснее.

   **Типичная ошибка:** Немедленно отключать TIME-WAIT ради красивого вывода ss.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

144. Почему TIME_WAIT держится дольше RTT?

   **Ответ:** RTT — текущая задержка обмена, MSL — предел жизни старых сегментов в модели протокола. Защита нужна от задержанных дубликатов и повторов, а не только одного текущего round trip.

   **Типичная ошибка:** Рассчитывать TIME-WAIT как фиксированные два RTT до peer.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

145. Почему TIME_WAIT обычно возникает на активной стороне закрытия?

   **Ответ:** Обычная active closer проходит FIN-WAIT и после встречного FIN отправляет финальный ACK, который может требовать повтора. При simultaneous close TIME-WAIT возможен у обеих сторон.

   **Типичная ошибка:** Считать TIME-WAIT исключительно клиентским состоянием независимо от того, кто закрывает.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

146. Какие проблемы создаёт большое число сокетов в TIME_WAIT?

   **Ответ:** Расходуется kernel state и ограничивается быстрое повторное использование tuples/ephemeral ports при высоком connection churn. Нормальное число TIME-WAIT не требует лечения; помогают connection reuse и корректная архитектура нагрузки.

   **Типичная ошибка:** Заменять graceful close на RST ради уменьшения счётчика, теряя семантику доставки.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

147. Что будет, если приложение не вызывает `close()` корректно?

   **Ответ:** Открытые descriptors/sockets накапливаются, удерживают память и могут привести к EMFILE/ENFILE и исчерпанию ресурсов. После peer FIN возможны CLOSE-WAIT. RAII и явное владение уменьшают риск.

   **Типичная ошибка:** Надеяться, что GC языка или процесс завершится раньше исчерпания fds в C/C++ сервере.

   **Источник:** [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

148. Когда TCP завершает соединение через RST?

   **Ответ:** При недопустимом/несуществующем connection state, explicit abort и некоторых сценариях close, например abortive linger или unread data в определённых стеках. Детали зависят от ОС и состояния.

   **Типичная ошибка:** Считать любой reset атакой, игнорируя обычный reject и application close.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

149. Почему abrupt close может приводить к потере данных?

   **Ответ:** Abort может отбросить queued/unread данные и не дать peer orderly EOF. Даже уже TCP-ACKed запрос мог быть принят стеком, но не обработан приложением; прикладной outcome требует отдельного подтверждения.

   **Типичная ошибка:** Считать reset доказательством полного отсутствия side effects у peer.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

150. Как unread data на сокете влияет на закрытие?

   **Ответ:** В Linux close с непрочитанными входящими данными может привести к reset, сообщая, что часть данных потеряна. Нужно либо дочитать по протоколу с deadline, либо явно принять abortive поведение.

   **Типичная ошибка:** Делать close сразу после send response, не понимая состояния request body и протокола.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).


### Продвинутый уровень
151. Как в tcpdump выглядит корректное закрытие TCP?

   **Ответ:** FIN/ACK для каждого направления, возможно совмещённые, с корректными sequence/ACK. FIN подтверждается следующей позицией sequence space. Повторы возможны и при в целом успешном закрытии.

   **Пример:**

   ```bash
   tcpdump -ni eth0 -S -c 40 'tcp port 8080'  # Нужны права на захват.
   ```

   **Типичная ошибка:** Принимать отсутствие отдельного ACK на combined FIN+ACK за ошибку.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

152. Как выглядит reset соединения?

   **Ответ:** В capture виден RST или RST+ACK с параметрами, зависящими от TCP state. Нужно проверить, кто его сгенерировал и что было до него; неполный trace ограничивает вывод.

   **Типичная ошибка:** Считать flags R единственным доказательством, что server application намеренно вызвало abort.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

153. Когда `SIGPIPE` может возникать в Unix-приложении при TCP?

   **Ответ:** Запись в socket с завершённым отправляющим направлением/соединением может дать EPIPE и SIGPIPE, который по умолчанию завершает процесс. Конкретная первая ошибка после reset может отличаться.

   **Типичная ошибка:** Обрабатывать только errno и забывать, что процесс может быть завершён сигналом раньше своего recovery-кода.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

154. Как использовать `MSG_NOSIGNAL` или `SO_NOSIGPIPE`?

   **Ответ:** В Linux send с MSG_NOSIGNAL подавляет SIGPIPE для вызова, сохраняя errno. На BSD/macOS применяют SO_NOSIGPIPE; переносимый слой должен учитывать доступность API. Это не превращает неудачную запись в успешную.

   **Пример:**

   ```c
   #include <sys/socket.h>
   #include <stddef.h>

   // Linux; return value/errno и partial write обрабатывает вызывающая сторона.
   ssize_t send_without_sigpipe(int fd, const void *data, size_t size) {
       return send(fd, data, size, MSG_NOSIGNAL);
   }
   ```

   **Типичная ошибка:** Глобально игнорировать SIGPIPE, не проверяя EPIPE/ECONNRESET в местах записи.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

155. Что происходит, если писать в уже закрытый peer socket?

   **Ответ:** Возможен успешный локальный приём данных до обнаружения закрытия, затем EPIPE/ECONNRESET и SIGPIPE по условиям. FIN peer означает конец его отправки и сам по себе не всегда запрещает локальную отправку.

   **Типичная ошибка:** Считать любой peer FIN немедленным запретом писать ответ при half-close.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

156. Что означает ошибка `EPIPE`?

   **Ответ:** EPIPE означает, что отправляющая сторона socket не может продолжать запись, например после shutdown или завершения соединения. При соответствующей операции возможен SIGPIPE; данные нужно считать неотправленными по результату вызова.

   **Типичная ошибка:** Бесконечно повторять send после EPIPE на том же соединении.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

157. Как close/shutdown влияют на протокол прикладного уровня?

   **Ответ:** Они задают transport termination, но прикладной протокол должен определить конец сообщения, допустимый half-close и acknowledgement результата. Например, EOF может завершать request body, но для framed протокола преждевременный EOF — ошибка.

   **Типичная ошибка:** Считать любое TCP EOF корректным концом любого прикладного сообщения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html).

158. Почему важно различать EOF и временное отсутствие данных?

   **Ответ:** EAGAIN говорит, что сейчас данных нет и можно ждать продолжения; TCP EOF говорит, что дальнейших байтов этого направления не будет. Ошибки и short reads — отдельные случаи.

   **Типичная ошибка:** На EAGAIN закрывать живое соединение как будто получен EOF.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

159. Что означает `recv()` == 0?

   **Ответ:** Для stream recv с ненулевым размером запроса 0 означает orderly EOF после ранее принятых байтов. Это не значит, что всё прикладное сообщение обязательно завершено. Нулевой запрос и UDP zero-length datagram имеют другую интерпретацию.

   **Типичная ошибка:** Переносить TCP EOF-правило на UDP recvfrom, где пустая датаграмма допустима.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

160. Почему `recv()` == 0 указывает на orderly shutdown?

   **Ответ:** TCP FIN обозначает конец sequence stream; после выдачи предшествующих байтов recv возвращает 0. Reset обычно проявляется ошибкой. Для нулевого размера чтения вывод об orderly shutdown делать нельзя.

   **Типичная ошибка:** Считать EOF гарантией корректности framing или успешной business operation.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

161. Как спроектировать протокол, который корректно переживает half-close?

   **Ответ:** Определяют независимые send/receive состояния и допустимые границы сообщений; после EOF запроса можно продолжить ответ, затем закрыть запись. Неполный frame, reset и deadline обрабатывают явно.

   **Типичная ошибка:** Использовать один флаг closed для обоих направлений и преждевременно прекращать ответ.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html).

162. Когда полезно использовать `shutdown(SHUT_WR)`?

   **Ответ:** Когда протокол использует конец request stream как delimiter, а ответ нужно ещё прочитать, либо для graceful отправки накопленных данных. Перед вызовом приложение должно завершить собственную очередь записи.

   **Типичная ошибка:** Считать shutdown(SHUT_WR) автоматической отправкой данных, которые ещё остались только в user-space queue.

   **Источник:** [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

163. Как TIME_WAIT влияет на клиентские load tests?

   **Ответ:** Генератор с частыми короткими connections может исчерпать ephemeral tuples или ресурсы раньше тестируемого сервера. Нужно наблюдать active closer, source pools и churn, а также отличать ограничения клиента от сервера.

   **Типичная ошибка:** Объяснять снижение RPS только server CPU, не проверив генератор и TIME-WAIT.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

164. Почему `SO_REUSEADDR` не решает все проблемы TIME_WAIT?

   **Ответ:** SO_REUSEADDR меняет правила bind, но не отменяет TCP sequence safety, все конфликты tuples и ephemeral port limits. Его поведение отличается по ОС и сценарию listener/client.

   **Типичная ошибка:** Считать эту опцию разрешением бесконечно открывать тот же 4-tuple без ожидания и риска.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

165. Какие anti-patterns чаще всего возникают при завершении TCP соединений?

   **Ответ:** Игнорирование partial writes перед close, abortive linger без необходимости, бесконечное ожидание EOF, утечки CLOSE-WAIT и смешение EOF с EAGAIN. Завершение требует отдельного состояния и deadline.

   **Типичная ошибка:** Управлять lifetime fd из нескольких потоков без единого ownership-контракта.

   **Источник:** [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html); [Linux man-pages: shutdown(2)](https://man7.org/linux/man-pages/man2/shutdown.2.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).


---

## 4. TCP: flow control

### Базовый уровень
166. Что такое flow control в TCP?

   **Ответ:** Flow control ограничивает sender возможностями receiver через объявляемое receive window. Он защищает приёмный стек от объёма данных, который тот не может принять.

   **Типичная ошибка:** Путать receive window с congestion window, зависящим от сети.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

167. Зачем нужен flow control?

   **Ответ:** Даже быстрый sender не должен бесконечно заполнять память медленного receiver. Receive window сообщает допустимый диапазон байтов; application read освобождает capacity.

   **Типичная ошибка:** Считать, что успешный TCP ACK означает освобождение receive buffer приложением.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

168. Чем flow control отличается от congestion control?

   **Ответ:** Flow control учитывает приёмник (rwnd), congestion control — путь/сеть (cwnd, pacing). Передача ограничивается обоими, а также приложением и ресурсами sender.

   **Типичная ошибка:** Лечить zero receive window сменой congestion algorithm без проверки reader.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

169. Что такое receive window?

   **Ответ:** Receive window — диапазон sequence space, который receiver готов принять. Размер передаётся в TCP window field и с negotiated scale может быть больше 65 535 байт.

   **Типичная ошибка:** Считать окно просто числом пакетов, не учитывая длину байтов.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

170. Кто объявляет receive window?

   **Ответ:** Получатель данных объявляет окно в своих сегментах, обычно вместе с ACK. В full-duplex каждое направление имеет своё объявление и независимое управление.

   **Типичная ошибка:** Считать, что сервер всегда receiver и только он задаёт window.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

171. Как receive window ограничивает объём неподтверждённых данных?

   **Ответ:** Sender не должен посылать новые обычные данные за разрешённую правую границу окна receiver. Он также ограничен cwnd; ACK progress и window updates позволяют продвинуть отправку.

   **Типичная ошибка:** Оценивать flight limit только SO_SNDBUF, игнорируя rwnd/cwnd.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

172. Что происходит, если принимающая сторона не успевает читать данные?

   **Ответ:** Receive buffer заполняется, свободное окно уменьшается вплоть до нуля. Затем отправитель ограничивает новые data, а его send buffers/очереди начинают накапливать данные.

   **Типичная ошибка:** Продолжать безлимитно читать в другую user-space очередь и считать медленного потребителя устранённым.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

173. Что такое advertised window?

   **Ответ:** Это окно, которое receiver сообщает peer в TCP header с учётом согласованного scaling. Оно отражает доступный приёмный диапазон, а не точную текущую скорость чтения приложения.

   **Типичная ошибка:** Считать величину окна мгновенной пропускной способностью сети.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

174. Почему flow control защищает приёмник от переполнения?

   **Ответ:** Sender соблюдает разрешённый sequence range, поэтому receiver управляет объёмом новых данных. Это не гарантия отсутствия локальных drops: ресурсы, out-of-order и overload могут создавать отдельные проблемы.

   **Типичная ошибка:** Считать flow control гарантией бесконечной памяти или отсутствия application backlog.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

175. Что такое zero window?

   **Ответ:** Zero window — receiver сообщил отсутствие доступного окна для новых обычных данных. Это обычно признак заполнения приёмного состояния, но не обязательный разрыв соединения.

   **Типичная ошибка:** Немедленно считать peer умершим при одном zero-window advertisement.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).


### Средний уровень
176. Что происходит, если receiver advertises zero window?

   **Ответ:** Sender прекращает обычную отправку новых данных сверх разрешённого окна и использует zero-window probing. После освобождения buffer receiver объявляет окно; приложение может продолжать ждать в пределах deadline.

   **Типичная ошибка:** Бесконечно ждать восстановления окна без прикладного лимита времени.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

177. Может ли sender продолжать отправку при zero window?

   **Ответ:** Новые обычные данные за закрытое окно не отправляются. Специальные probes нужны для проверки открытия; ACK/control и обработка уже переданных данных имеют отдельные правила.

   **Типичная ошибка:** Считать zero window полным запретом любых TCP packets в обоих направлениях.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

178. Что такое zero-window probe?

   **Ответ:** Zero-window probe проверяет, открылось ли окно, и вызывает актуальное window advertisement. Механизм связан с persist handling, а не обычным congestion RTO.

   **Типичная ошибка:** Принимать probes за доказательство packet loss в сети.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

179. Зачем zero-window probes нужны?

   **Ответ:** Window update мог потеряться. Probing не даёт обеим сторонам бесконечно ждать: sender узнаёт, что receiver снова готов. Прикладной deadline остаётся независимой необходимостью.

   **Типичная ошибка:** Считать отсутствие потерь TCP-data достаточным, чтобы window update всегда дошёл.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

180. Как размер receive buffer связан с advertised window?

   **Ответ:** Размер buffer и занятая память влияют на доступное окно, но kernel accounting, autotuning и implementation policy не дают простой идентичности SO_RCVBUF=rwnd. Чтение приложения освобождает capacity.

   **Типичная ошибка:** По одному значению SO_RCVBUF предсказывать точное окно каждого ACK.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

181. Почему маленькое receive window снижает throughput?

   **Ответ:** Flight ограничен окном, поэтому при устойчивом RTT возможная скорость примерно не выше window/RTT, если именно окно — bottleneck. Большая bandwidth сама это ограничение не снимает.

   **Типичная ошибка:** Игнорировать window scaling на WAN, считая локальный throughput достаточным тестом.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

182. Как медленное приложение на приёмнике влияет на TCP поток?

   **Ответ:** Непрочитанные данные удерживают buffer, сужают rwnd и могут остановить sender. Нужно проверить event loop, parser и downstream consumer, а не только network counters.

   **Типичная ошибка:** Увеличивать окно без устранения зависшего consumer.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

183. Что такое application-limited receiver?

   **Ответ:** Термин часто используют для receiver, у которого потребление приложением ограничивает темп и окно. Его надо отличать от app-limited sender в congestion-control measurements, где недостаточно предлагаемых данных.

   **Типичная ошибка:** Смешивать медленное чтение peer с отсутствием данных для отправки у локального приложения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

184. Как flow control проявляется в tcpdump?

   **Ответ:** Смотрят window advertisements, negotiated scale, zero-window events/probes и связь ACK progress с данными. Capture без SYN может не дать scale, а analyzer labels — эвристики.

   **Пример:**

   ```bash
   tcpdump -ni eth0 -c 40 'tcp port 8080'
   ss -tin  # Linux: сопоставить window/buffer metrics с capture.
   ```

   **Типичная ошибка:** Читать raw 16-bit window как effective bytes, игнорируя negotiated scale.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

185. Почему чтение из сокета должно быть регулярным?

   **Ответ:** Регулярное чтение при наличии downstream capacity освобождает receive state и поддерживает окно. При перегрузке backpressure может быть намеренным; цель — bounded queues, а не безлимитное выкачивание socket.

   **Типичная ошибка:** Читать любой ценой в бесконечный buffer, увеличивая память и tail latency.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

186. Что произойдёт, если сервер перестанет читать из сокета?

   **Ответ:** После заполнения receive buffer поток ограничится окном; sender со временем заполнит свои очереди. Другие соединения могут пострадать через shared ресурсы приложения, хотя их TCP windows независимы.

   **Типичная ошибка:** Считать, что каждое непрочитанное соединение автоматически сразу reset-ится ядром.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

187. Как backpressure доходит до отправителя?

   **Ответ:** Через уменьшение rwnd, ограничение ACK/data progress и заполнение sender buffers. Blocking send может ждать, nonblocking — вернуть EAGAIN; само приложение должно ограничить свою очередь.

   **Типичная ошибка:** Продолжать принимать новые задания после EAGAIN без bounded admission.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

188. Как flow control влияет на latency приложения?

   **Ответ:** Данные могут ждать чтения и открытия окна, увеличивая задержку даже при малом network RTT. Нужны timestamps enqueue/read/process и limits, а не только замеры ping.

   **Типичная ошибка:** Приписывать всю задержку между send и response только сетевому RTT.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

189. Что такое window scaling?

   **Ответ:** Window Scale option согласует сдвиг 16-битного window field для каждого направления, расширяя допустимое окно. Scale объявляют в SYN; сами window fields SYN не масштабируются.

   **Типичная ошибка:** Применять scale к window в SYN или считать scales направлений обязательно одинаковыми.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

190. Почему без window scaling большие каналы работают плохо?

   **Ответ:** Без scaling advertised window не больше 65 535 байт; при большом RTT это ограничивает bandwidth-delay product. Например, при 100 ms окно даёт порядок 0,65 MB/s без других ограничений.

   **Типичная ошибка:** Путать мегабайты в секунду с мегабитами при оценке window/RTT.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).


### Продвинутый уровень
191. Как `SO_RCVBUF` влияет на flow control?

   **Ответ:** SO_RCVBUF задаёт/ограничивает receive buffering в пределах системных правил. В Linux ручная настройка влияет на autotuning и kernel accounting; изменение не гарантирует пропорционального rwnd и throughput.

   **Типичная ошибка:** Вручную фиксировать маленький buffer и ждать, что autotuning всё равно всегда расширит его.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

192. Как `SO_SNDBUF` влияет на поведение отправителя?

   **Ответ:** SO_SNDBUF влияет на объём queued send state и момент blocking/EAGAIN. Оно не увеличивает напрямую cwnd и не гарантирует wire bandwidth. Слишком большая очередь может скрыть overload и увеличить latency.

   **Типичная ошибка:** Использовать успешные send в большой buffer как метрику доставленных peer данных.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

193. Почему реальный размер buffer может отличаться от запрошенного?

   **Ответ:** ОС может округлять, ограничивать и добавлять memory overhead; Linux обычно удваивает user-set SO_SNDBUF/SO_RCVBUF для accounting и возвращает это значение через getsockopt. Autotuning и limits также влияют.

   **Типичная ошибка:** Считать отличающееся значение getsockopt ошибкой самой функции без проверки документации ОС.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

194. Что такое bandwidth-delay product и как он связан с размером окна?

   **Ответ:** BDP = bandwidth × RTT — объём данных, нужный в полёте для заполнения пути. Для 100 Mbit/s и 100 ms это около 1,25 MB. Нужны достаточные rwnd/cwnd и реальная передача, а не только большой buffer.

   **Пример:**

   ```cpp
   #include <cstdint>

   constexpr std::uint64_t bits_per_second = 100000000;
   constexpr std::uint64_t rtt_ms = 100;
   constexpr auto bdp_bytes = bits_per_second * rtt_ms / 8000;
   static_assert(bdp_bytes == 1250000);
   ```

   **Типичная ошибка:** Использовать one-way delay вместо RTT без согласования определения расчёта.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

195. Почему большой RTT требует большего окна для полной загрузки канала?

   **Ответ:** Каждый ACK возвращает возможность продвинуть flight. При большем времени оборота для той же скорости требуется больше одновременно неподтверждённых байтов. Иначе sender простаивает, ожидая ACK/window.

   **Типичная ошибка:** Считать, что один маленький window может насытить любую bandwidth при любом RTT.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

196. Как window scaling согласуется в handshake?

   **Ответ:** Каждая сторона объявляет свой shift в SYN; для использования механизма нужна поддержка/обмен согласно RFC. Значение относится к window fields последующих сегментов соответствующей стороны и не меняется произвольно внутри connection.

   **Типичная ошибка:** Пытаться включить полноценно negotiated scaling только после handshake.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

197. Что будет, если одна сторона не поддерживает window scaling?

   **Ответ:** Если механизм не согласован, используется немасштабированное 16-битное окно. Это может ограничить WAN throughput, но не делает TCP несовместимым или полностью неработоспособным.

   **Типичная ошибка:** Считать отсутствие scaling причиной отказа любого небольшого request/response.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

198. Как flow control влияет на long fat networks?

   **Ответ:** В сетях с большим BDP маленькое rwnd ограничивает flight и throughput; требуется достаточное окно и корректное scaling. При этом latency и memory требуют bounded buffering, а потери/cwnd тоже могут стать bottleneck.

   **Типичная ошибка:** Проверить только rwnd и игнорировать congestion control, pacing и loss.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

199. Как в приложении определить, что peer перестал читать?

   **Ответ:** Прямого переносимого API «peer приложение не читает» нет. Можно наблюдать window/queued bytes, send progress и timeout, в Linux — TCP_INFO/ss. Zero window показывает приёмное ограничение, но не точную причину внутри приложения.

   **Типичная ошибка:** По одному медленному send безусловно заключать, что peer вызвал stop reading.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

200. Почему `send()` может блокироваться из-за flow control?

   **Ответ:** Пока peer окно мало, данные остаются в sender queues; когда свободного send buffer недостаточно, blocking send ждёт. Ограничение может быть вызвано также cwnd, loss или local scheduling.

   **Типичная ошибка:** Считать каждый blocking send исключительно rwnd bottleneck.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

201. Как non-blocking sockets ведут себя при заполнении send buffer?

   **Ответ:** Когда места для записи сейчас нет, send возвращает -1 с EAGAIN/EWOULDBLOCK; при частичном успехе возвращает количество принятых байтов. Остаток сохраняют и ждут writable readiness.

   **Типичная ошибка:** Терять остаток буфера после partial send либо spin-ить на EAGAIN.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

202. Что означает `EAGAIN` / `EWOULDBLOCK` для TCP записи?

   **Ответ:** Socket не может принять новые данные без ожидания в текущий момент. Это временное условие, а не гарантированный disconnect; peer/network/local buffers нужно анализировать отдельно.

   **Типичная ошибка:** Закрывать живое соединение на любом EAGAIN.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

203. Как epoll уведомляет о возможности записи?

   **Ответ:** EPOLLOUT сообщает возможность продвижения записи либо ситуацию завершения/ошибки, требующую проверки. Интерес к записи обычно включают при pending data и выключают, когда очередь пуста, чтобы не получать лишние события.

   **Типичная ошибка:** Постоянно подписываться на level-triggered EPOLLOUT для всех idle sockets и загружать CPU.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html).

204. Почему writable socket не означает "можно записать бесконечно много"?

   **Ответ:** Ready означает текущую возможность выполнить операцию с ограниченным результатом. Размер доступного места конечен и может измениться; send всё равно может быть partial или вернуть EAGAIN.

   **Типичная ошибка:** Записать один большой buffer без проверки return value, потому что poll сообщил writable.

   **Источник:** [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

205. Какие метрики помогают выявлять flow-control bottlenecks?

   **Ответ:** Effective rwnd, zero-window duration/probes, receive queue, application read/processing latency, send queue и sndbuf/rwnd-limited time при поддержке стека. Нужны обе стороны и сравнение с cwnd/RTT.

   **Пример:**

   ```bash
   ss -tinm  # Linux: internal TCP info и socket memory; поля зависят от версии.
   ```

   **Типичная ошибка:** Диагностировать flow control только общей загрузкой сетевого интерфейса.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).


---

## 5. TCP: congestion control

### Базовый уровень
206. Что такое congestion control в TCP?

   **Ответ:** Congestion control адаптирует отправку к доступной ёмкости пути, используя ACK, RTT, loss, ECN и другие сигналы. Алгоритм управляет cwnd и/или pacing; это отдельный механизм от ограничения receiver window.

   **Типичная ошибка:** Считать congestion control способом увеличить receive buffer peer.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

207. Зачем congestion control нужен в сети?

   **Ответ:** Без адаптации одновременные отправители могут переполнять очереди, создавать потери и congestion collapse. Контроль ограничивает нагрузку и пытается разумно разделять ресурсы между потоками.

   **Типичная ошибка:** Считать максимальное число отправленных байтов без учёта доставки целью сетевого алгоритма.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

208. Чем congestion control отличается от flow control?

   **Ответ:** Flow control ориентирован на capacity receiver и rwnd; congestion control — на состояние пути и cwnd/pacing. Передача ограничена обоими, а также application supply и local resources.

   **Типичная ошибка:** Объяснять нулевое advertised window обязательной перегрузкой маршрутизатора.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

209. Что такое congestion window (cwnd)?

   **Ответ:** cwnd — локальная переменная sender, ограничивающая допустимый flight по оценке congestion. Она не передаётся как TCP window field и меняется по выбранному алгоритму.

   **Типичная ошибка:** Читать advertised window в pcap как congestion window.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

210. Как congestion window ограничивает объём данных в полёте?

   **Ответ:** Sender обычно ограничивает outstanding data через cwnd совместно с rwnd и loss recovery rules. ACK progress освобождает flight; pacing может дополнительно распределять отправку во времени.

   **Типичная ошибка:** Считать cwnd точным числом байтов в send buffer или количеством packets/s.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

211. Что такое slow start?

   **Ответ:** Slow start — начальная/восстановительная фаза быстрого увеличения cwnd по ACK до порога или сигнала congestion. В классической модели рост примерно экспоненциальный по RTT.

   **Типичная ошибка:** Понимать «slow» как линейный рост на всём протяжении передачи.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

212. Почему slow start так называется?

   **Ответ:** Он начинает с ограниченного flight вместо немедленного burst всей возможной нагрузки. Название историческое: после старта классический рост быстрее линейного congestion avoidance.

   **Типичная ошибка:** Считать slow start свидетельством намеренно низкой скорости на всём соединении.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

213. Что такое congestion avoidance?

   **Ответ:** Фаза осторожного исследования capacity после slow start; правило роста зависит от алгоритма. У Reno примерно additive increase, у CUBIC — кубическая функция времени с дополнительными режимами.

   **Типичная ошибка:** Применять Reno-формулу к любому современному алгоритму без оговорки.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

214. Что такое ssthresh?

   **Ответ:** ssthresh — порог выбора slow start/congestion avoidance в классическом TCP. После congestion его пересчитывают по правилам алгоритма. Он не равен постоянной bandwidth канала.

   **Типичная ошибка:** Считать ssthresh сетевым параметром, который присылает receiver.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

215. Что означает packet loss для TCP congestion control?

   **Ответ:** Потеря может вызвать recovery и снижение интенсивности, но реакция зависит от алгоритма, способа обнаружения и того, признана ли retransmission ложной. Loss не обязательно физическая ошибка или congestion.

   **Типичная ошибка:** Говорить, что любой потерянный сегмент всегда обнуляет cwnd.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

216. Почему packet loss часто интерпретируется как признак congestion?

   **Ответ:** Переполнение очередей — распространённый сигнал избыточной нагрузки. Но loss бывает также из-за радио, filtering, host drops и ошибок; алгоритм часто не знает причину напрямую.

   **Типичная ошибка:** Считать retransmission counter однозначным датчиком перегрузки линка.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

217. Как ACK влияет на рост окна?

   **Ответ:** ACK продвигает confirmed sequence, освобождает flight и может запускать рост cwnd. Правило зависит от фазы/алгоритма, ACK ratio и защиты от burst; один ACK не всегда означает фиксированное увеличение.

   **Типичная ошибка:** Считать, что receiver может неограниченно ускорять sender множеством искусственных ACK.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

218. Почему TCP не может всегда отправлять на полной скорости?

   **Ответ:** Скорость ограничена cwnd, rwnd, RTT, loss, pacing, предложенной нагрузкой и локальными ресурсами. Линк sender может быть быстрее bottleneck дальше по пути, поэтому full local link rate не всегда безопасен.

   **Типичная ошибка:** Считать локальную скорость NIC гарантированной скоростью end-to-end передачи.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

219. Что такое fairness в контексте congestion control?

   **Ответ:** Fairness — критерий разделения bottleneck resources между потоками/пользователями по выбранной модели. Равенство не гарантируется: влияют RTT, алгоритмы, число connections и policy.

   **Типичная ошибка:** Ожидать равной доли bandwidth у двух приложений, если одно открывает сотни потоков.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

220. Почему congestion control критичен для стабильности интернета?

   **Ответ:** Он предотвращает устойчивую избыточную нагрузку и поддерживает полезную доставку при конкуренции. Отсутствие cooperative поведения у многих источников может ухудшить сеть для всех.

   **Типичная ошибка:** Отключать congestion control ради локального выигрыша throughput на общей сети.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).


### Средний уровень
221. Как растёт cwnd в slow start?

   **Ответ:** В классическом slow start ACK увеличивают cwnd так, что за RTT он примерно удваивается при подходящем ACK pattern. Delayed ACK, initial window и implementation rules меняют точную траекторию.

   **Типичная ошибка:** Обещать точное удвоение каждую миллисекунду или на каждый ACK.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

222. Как растёт cwnd в congestion avoidance?

   **Ответ:** В Reno congestion avoidance cwnd растёт примерно на один MSS за RTT при насыщенном потоке. У CUBIC и других алгоритмов другое правило, поэтому нужен указанный baseline.

   **Типичная ошибка:** Считать линейный рост универсальным свойством TCP.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

223. Что происходит с cwnd при packet loss?

   **Ответ:** Реакция зависит от алгоритма и события: fast recovery и RTO обрабатываются по-разному. Reno уменьшает ssthresh относительно flight и меняет cwnd по соответствующей процедуре; CUBIC имеет свой коэффициент и recovery.

   **Типичная ошибка:** Безусловно писать «cwnd делится пополам при любой retransmission».

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

224. Чем fast retransmit связан с congestion control?

   **Ответ:** Fast retransmit восстанавливает предполагаемую потерю по ACK-сигналам до RTO; одновременно алгоритм реагирует на congestion. В классическом Reno это связано со входом в fast recovery.

   **Типичная ошибка:** Путать быструю retransmission с сохранением прежней скорости без congestion response.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

225. Что такое fast recovery?

   **Ответ:** Fast recovery продолжает ограниченную передачу при восстановлении loss, используя данные о продвижении ACK. Reno/NewReno/SACK recovery различаются, особенно при нескольких пропусках.

   **Типичная ошибка:** Считать fast recovery повторной полной slow start во всех реализациях.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6582: TCP NewReno](https://www.rfc-editor.org/rfc/rfc6582); [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

226. Чем timeout хуже для throughput, чем fast retransmit?

   **Ответ:** RTO включает ожидание таймера и часто более сильное уменьшение допустимой отправки. Fast retransmit обнаруживает loss раньше, когда достаточно ACK evidence, и может сохранить больше flight.

   **Типичная ошибка:** Считать любое recovery одинаковым по latency и скорости после события.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

227. Почему RTT влияет на поведение congestion control?

   **Ответ:** ACK feedback возвращается с задержкой; от неё зависят рост окна, оценка bandwidth и реакция на loss. Потоки с разными RTT могут конкурировать неравномерно, в зависимости от алгоритма.

   **Типичная ошибка:** Считать congestion control независимым от задержки пути.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

228. Почему каналы с большим RTT труднее "раскачать"?

   **Ответ:** Для заполнения большого BDP нужно большое flight, а feedback приходит реже по времени. Startup и восстановление после loss занимают больше времени; ограничения rwnd тоже сильнее проявляются.

   **Типичная ошибка:** Проверить только bandwidth и не измерять RTT/BDP.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

229. Что такое AIMD?

   **Ответ:** AIMD — additive increase и multiplicative decrease: постепенно увеличивать нагрузку и при congestion уменьшать её пропорционально. Это основа классической интуиции TCP Reno, а не описание любого алгоритма.

   **Типичная ошибка:** Называть BBR просто AIMD с другим коэффициентом.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [Google: BBR congestion control](https://github.com/google/bbr).

230. Почему классический TCP использует additive increase / multiplicative decrease?

   **Ответ:** Плавное увеличение исследует свободную capacity, пропорциональное уменьшение снижает нагрузку и помогает разделять общий bottleneck в принятой модели. Реальная fairness зависит от условий и реализации.

   **Типичная ошибка:** Считать AIMD доказательством равных долей для любых RTT и любого числа потоков.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

231. Какие проблемы у loss-based congestion control?

   **Ответ:** Он может формировать очереди до появления drops, реагировать на неконгестионные потери и восстанавливаться медленно на больших BDP. AQM/ECN и новые алгоритмы меняют это поведение.

   **Типичная ошибка:** Считать отсутствие drops доказательством низкой queueing latency.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

232. Почему loss не всегда означает congestion в беспроводных сетях?

   **Ответ:** Причиной бывают channel errors, fading, handover и локальные радио-повторы. TCP видит end-to-end сигналы, не точную причину. Такие losses могут снижать скорость даже без заполненной IP-очереди.

   **Типичная ошибка:** Выводить congestion маршрутизатора только из потерь в mobile trace.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

233. Как bufferbloat связан с congestion control?

   **Ответ:** Большие очереди могут скрывать overload от loss-based feedback, сохраняя throughput ценой задержки. AQM, pacing, scheduling и контроль application queues помогают ограничивать standing queue.

   **Типичная ошибка:** Увеличивать сетевые buffers при высокой задержке под нагрузкой без измерения очередей.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 8033: PIE Active Queue Management](https://www.rfc-editor.org/rfc/rfc8033).

234. Что такое standing queue?

   **Ответ:** Standing queue — очередь, которая сохраняется длительно вместо быстрого опустошения после burst. Она добавляет постоянную queueing delay; её размер не является полезным BDP данных, уже находящихся на пути.

   **Типичная ошибка:** Считать любой запас queued packets необходимым для полной загрузки канала.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

235. Как excessive buffering увеличивает latency?

   **Ответ:** Пакет ждёт обслуживания позади накопленных данных; приблизительно delay зависит от queued bytes и drain rate. Это может происходить в сети, хосте и приложении.

   **Типичная ошибка:** Измерять только idle ping и не проверять latency при нагрузке.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 8033: PIE Active Queue Management](https://www.rfc-editor.org/rfc/rfc8033).

236. Почему иногда throughput высокий, а latency плохая?

   **Ответ:** Большой buffer поддерживает непрерывную занятость bottleneck, но запросы стоят в очереди. Поэтому throughput и tail latency измеряют совместно, включая competing/background traffic.

   **Типичная ошибка:** Выбирать конфигурацию только по максимальному bulk Mbit/s.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

237. Что такое goodput?

   **Ответ:** Goodput — скорость доставки уникальных полезных данных на явно определённой границе, например application payload. Нужно назвать, исключены ли headers, retransmissions и дубликаты.

   **Типичная ошибка:** Считать retransmitted wire bytes дополнительной полезной производительностью.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

238. Чем goodput отличается от throughput?

   **Ответ:** Throughput может считать все переданные байты выбранного уровня; goodput — уникальные полезные. Разница включает overhead, repeats и duplicates. Сравнение корректно только при одинаковых интервале и границе учёта.

   **Типичная ошибка:** Сравнивать NIC bytes/s и application bytes/s как одну метрику без поправки на смысл.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

239. Почему reordering может ошибочно восприниматься как loss?

   **Ответ:** Ранний сегмент задержался, более поздние вызвали ACK/SACK с gap; loss detector может решить, что gap — потеря. Современные time-based thresholds уменьшают, но не исключают ложные срабатывания.

   **Типичная ошибка:** Считать out-of-order analyzer label доказательством дропа.

   **Источник:** [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985); [RFC 2883: An Extension to the Selective Acknowledgement Option for TCP](https://www.rfc-editor.org/rfc/rfc2883).

240. Как ECN связан с congestion control?

   **Ответ:** ECN позволяет routers/AQM помечать congestion вместо обязательного drop. Receiver сообщает сигнал sender, который должен реагировать по протоколу/алгоритму. Нужны согласование и поддержка стека/сети.

   **Типичная ошибка:** Считать ECN способом игнорировать congestion и продолжать прежний rate.

   **Источник:** [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).


### Продвинутый уровень
241. Какие алгоритмы congestion control ты знаешь?

   **Ответ:** Классические Reno/NewReno, CUBIC, модельный BBR и специализированные варианты, например для ECN-enabled DC. Доступность и версия в ОС важны: одно имя не определяет все детали поведения.

   **Типичная ошибка:** Сравнивать алгоритмы без указания реализации, версии и workload.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438); [Google: BBR congestion control](https://github.com/google/bbr).

242. Чем Reno отличается от NewReno на концептуальном уровне?

   **Ответ:** NewReno уточняет fast recovery: partial ACK помогает обнаружить и восстановить несколько losses без немедленного выхода из recovery. Это улучшение классического Reno, особенно без SACK, а не другой transport.

   **Типичная ошибка:** Считать NewReno заменой SACK option или новой формой UDP.

   **Источник:** [RFC 6582: TCP NewReno](https://www.rfc-editor.org/rfc/rfc6582).

243. Чем CUBIC отличается от Reno?

   **Ответ:** Reno в avoidance примерно линейно растёт по RTT; CUBIC использует кубическую функцию времени относительно прежнего congestion point и собственные параметры восстановления. Он рассчитан, в частности, на высокие BDP.

   **Типичная ошибка:** Считать CUBIC просто Reno с большими buffers.

   **Источник:** [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

244. Почему CUBIC долго был дефолтом в Linux?

   **Ответ:** CUBIC стал широко используемым Linux default благодаря масштабируемому росту на высоких BDP и практической эффективности. Конкретный default зависит от kernel/distro/configuration; проверяют sysctl на целевой машине.

   **Типичная ошибка:** Утверждать, что любая Linux-система сейчас обязательно использует CUBIC.

   **Источник:** [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

245. Что такое BBR на концептуальном уровне?

   **Ответ:** BBR оценивает delivery bandwidth и minimum propagation RTT, затем управляет pacing и flight по модели пути. Разные поколения BBR отличаются обработкой loss/ECN и конкуренцией.

   **Типичная ошибка:** Считать BBR алгоритмом, которому не нужны ACK и измерения доставки.

   **Источник:** [Google: BBR congestion control](https://github.com/google/bbr).

246. Чем BBR отличается от loss-based подходов?

   **Ответ:** Вместо ожидания потерь как основного показателя ёмкости BBR строит модель bandwidth/RTT. Но считать все версии полностью игнорирующими loss неверно: congestion signals и ограничения зависят от поколения.

   **Типичная ошибка:** Сравнивать неопределённый «BBR» с Reno без версии и loss model.

   **Источник:** [Google: BBR congestion control](https://github.com/google/bbr); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

247. Почему BBR может давать меньшую latency?

   **Ответ:** Модель и pacing могут ограничивать избыточное накопление очереди, улучшая latency в некоторых условиях. Это не гарантия: влияют версия BBR, buffers, competing flows, ACK path и bottleneck.

   **Типичная ошибка:** Обещать меньшую latency любому приложению после одного sysctl.

   **Источник:** [Google: BBR congestion control](https://github.com/google/bbr).

248. Какие риски и компромиссы есть у BBR?

   **Ответ:** Trade-offs включают fairness/coexistence, probing, sensitivity к измерениям и конкретным network conditions. Поведение зависит от версии; нужны tests с реальным RTT/loss/ECN и конкурентами.

   **Типичная ошибка:** Внедрять по одному single-flow benchmark без tail и fairness measurements.

   **Источник:** [Google: BBR congestion control](https://github.com/google/bbr).

249. Как выбрать congestion control algorithm в Linux?

   **Ответ:** Проверяют доступные алгоритмы и выбирают системный default или TCP_CONGESTION per socket. Выбор обосновывают measurements и совместимостью target kernel, а не только названием.

   **Пример:**

   ```bash
   sysctl net.ipv4.tcp_available_congestion_control
   sysctl net.ipv4.tcp_congestion_control
   ss -tin
   ```

   **Типичная ошибка:** Задать имя отсутствующего модуля и проигнорировать ошибку настройки.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

250. Как посмотреть текущий congestion control в системе?

   **Ответ:** sysctl net.ipv4.tcp_congestion_control показывает default для новых TCP sockets, available list — доступные варианты. Для конкретного connection смотрят ss -i или TCP_CONGESTION; default не доказывает алгоритм каждого socket.

   **Типичная ошибка:** Считать изменение default мгновенным переключением всех established connections.

   **Источник:** [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

251. Как поменять congestion control для тестов?

   **Ответ:** В лаборатории меняют sysctl для новых connections либо задают TCP_CONGESTION на тестовом socket. Фиксируют baseline и версии; измеряют одинаковые workloads, RTT/loss и competitors.

   **Пример:**

   ```bash
   # Только изолированная Linux-лаборатория, нужны root-права.
   # Сначала убедитесь, что cubic доступен, и сохраните исходное значение.
   sysctl net.ipv4.tcp_congestion_control
   sysctl -w net.ipv4.tcp_congestion_control=cubic
   ```

   **Типичная ошибка:** Менять глобальный production default во время несвязанного теста без изоляции и учёта существующих sockets.

   **Источник:** [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

252. Может ли одно приложение выбирать congestion control per-socket?

   **Ответ:** Да, в Linux через setsockopt(IPPROTO_TCP, TCP_CONGESTION, ...), если алгоритм доступен и разрешён. Права и разрешённый набор зависят от системы; return value обязателен к проверке.

   **Типичная ошибка:** Считать TCP_CONGESTION переносимой опцией всех POSIX ОС.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

253. Как packet pacing помогает congestion control?

   **Ответ:** Pacing распределяет packets во времени вместо больших ACK-triggered bursts, уменьшает microbursts и помогает следовать target delivery rate. Реализация зависит от TCP stack, qdisc и offload.

   **Типичная ошибка:** Считать pacing гарантией отсутствия queues и losses на всех участках.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Google: BBR congestion control](https://github.com/google/bbr).

254. Что такое self-clocking в TCP?

   **Ответ:** ACK clock возвращает информацию о доставленных данных и позволяет выдавать новые примерно в темпе пути. Compression, delayed ACK и offload искажают точный timing; pacing может сглаживать bursts.

   **Типичная ошибка:** Принимать интервалы ACK на sender за точные интервалы прохождения каждого сегмента через bottleneck.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

255. Как delayed ACK влияет на оценку сети?

   **Ответ:** Delayed ACK уменьшает число ACK и меняет их timing/ratio, влияя на startup и измерения. RTT samples и window growth должны учитывать это; взаимодействие с Nagle иногда заметно приложению.

   **Типичная ошибка:** Считать каждый большой RTT sample доказательством congestion, игнорируя receiver ACK policy.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

256. Как ACK compression влияет на TCP?

   **Ответ:** Скопление ACK в обратной очереди и их быстрый выход создают burst feedback, не отражающий исходный spacing данных. Sender может burst-ить или ошибаться в rate estimates; pacing и robust estimators помогают.

   **Типичная ошибка:** Делать bandwidth estimate по кратчайшему интервалу между двумя сжатыми ACK.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [Google: BBR congestion control](https://github.com/google/bbr).

257. Как AQM (например CoDel/PIE) взаимодействует с congestion control?

   **Ответ:** AQM старается сигнализировать рост очереди заранее через drop/ECN, чтобы endpoints уменьшали нагрузку до чрезмерной задержки. CoDel/PIE используют свои delay-oriented правила и дополняют transport CC.

   **Типичная ошибка:** Считать AQM заменой congestion control на конечных хостах.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 8033: PIE Active Queue Management](https://www.rfc-editor.org/rfc/rfc8033); [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).

258. Что такое incast и почему он опасен для датацентров?

   **Ответ:** Incast — множество отправителей одновременно шлют к одному receiver/bottleneck, создавая microburst и переполнение небольших очередей. В DC это может вызвать losses/timeouts и tail spikes даже при умеренной средней загрузке.

   **Типичная ошибка:** Оценивать риск incast только минутным средним utilization.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

259. Почему wireless links усложняют congestion inference?

   **Ответ:** Radio scheduling, link-layer retries, fading и handover меняют delay/rate и могут создавать loss независимо от IP queue overload. Нужны совместные transport и radio measurements.

   **Типичная ошибка:** Исправлять radio outage только повышением cwnd или увеличением socket buffers.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

260. Какие метрики нужны для анализа поведения congestion control?

   **Ответ:** Нужны cwnd/flight, rwnd, RTT/minRTT, delivery/pacing rate, retrans/loss/ECN, recovery/RTO и queueing. Отдельно — application-limited time, host CPU/drops и полезная доставка.

   **Пример:**

   ```bash
   ss -tinm
   ethtool -S eth0  # Имена hardware counters зависят от NIC/driver.
   ```

   **Типичная ошибка:** Судить о CC только по среднему throughput одного интервала.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).


### Инженерные вопросы
261. Как congestion control влияет на проектирование высоконагруженного TCP сервиса?

   **Ответ:** Влияет на connection reuse, concurrency, buffer budgets, pacing и deadlines. Большое число соединений меняет конкуренцию и память; важно не маскировать overload unbounded application queues.

   **Типичная ошибка:** Увеличивать connection count как единственную стратегию ускорения, игнорируя fairness и tail latency.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

262. Почему один и тот же сервис может вести себя по-разному в LAN, WAN и mobile networks?

   **Ответ:** Различаются RTT, bandwidth, loss, rate variability, handovers и middleboxes. Одинаковый application code может упереться в разные rwnd/cwnd/CPU limits; тестируют репрезентативные профили.

   **Типичная ошибка:** Оптимизировать WAN/mobile сервис только localhost benchmark.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

263. Когда packet loss — это проблема сети, а когда нормальная часть поведения TCP?

   **Ответ:** Loss может быть обычным congestion feedback или следствием неисправности/overload. Сравнивают baseline, location, tail latency и recovery impact; даже ожидаемый механизм не делает любой уровень потерь приемлемым.

   **Типичная ошибка:** Называть любой retransmission инцидентом либо, наоборот, игнорировать все потери как «нормальный TCP».

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

264. Как проводить нагрузочное тестирование TCP сервиса так, чтобы не перепутать congestion и bottleneck приложения?

   **Ответ:** Измеряют sender/receiver CPU и queues, application processing, cwnd/rwnd, RTT/loss и host/network drops. Разделяют генератор, приложение и путь; меняют по одному контролируемому фактору.

   **Типичная ошибка:** Насыщать клиентский CPU и приписывать throughput ceiling серверной сети.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

265. Как выбрать подходящий congestion control для latency-sensitive сервиса?

   **Ответ:** Сначала задают tail-latency/throughput/fairness цели, затем сравнивают доступные версии на нужных RTT, loss и конкуренции. Проверяют pacing/AQM и application queues; алгоритм не заменяет admission control.

   **Типичная ошибка:** Выбирать универсального победителя по одному unloaded LAN тесту.

   **Источник:** [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438); [Google: BBR congestion control](https://github.com/google/bbr); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).


---

## 6. TCP: retransmissions

### Базовый уровень
266. Что такое retransmission в TCP?

   **Ответ:** Retransmission — повторная отправка ещё не подтверждённых байтов TCP после предполагаемой потери. Повтор может иметь другие границы сегментации; sequence positions сохраняют смысл.

   **Типичная ошибка:** Считать retransmission новым application message с новым sequence space.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

267. Зачем TCP выполняет retransmission?

   **Ответ:** IP не гарантирует доставку, поэтому TCP должен восстанавливать пропущенные/повреждённые данные. Повтор нужен и когда потерялся ACK и sender не знает, что данные уже получены.

   **Типичная ошибка:** Считать каждый повтор доказательством потери именно data packet.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

268. Как TCP понимает, что сегмент потерян?

   **Ответ:** По отсутствию своевременного ACK, duplicate ACK/SACK evidence и современным time-based механизмам вроде RACK. Это вывод по наблюдениям, а не прямое знание местоположения дропа.

   **Типичная ошибка:** Считать loss detection безошибочным распознаванием физической причины потери.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

269. Что такое retransmission timeout (RTO)?

   **Ответ:** RTO — retransmission timer, после истечения которого не подтверждённые данные повторяют по процедуре TCP. Его оценивают по RTT и variation с backoff; это не прикладной request deadline.

   **Типичная ошибка:** Использовать фиксированный RTO=RTT без запаса на вариацию.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

270. Что такое duplicate ACK?

   **Ответ:** Duplicate ACK повторяет cumulative acknowledgement при условиях, описанных алгоритмом. Частая причина — более поздние сегменты пришли при gap; само совпадение ACK number ещё не всегда означает qualifying duplicate ACK.

   **Типичная ошибка:** Считать любой пакет с тем же ACK чистым dupACK, игнорируя data/window flags.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

271. Как duplicate ACK помогает обнаружить loss?

   **Ответ:** Серия подходящих duplicate ACK указывает, что поздние данные доходят, а ранние не подтверждены. Это позволяет recovery до RTO. Но reordering тоже может дать такой сигнал.

   **Типичная ошибка:** По одному dupACK немедленно объявлять физический drop.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

272. Что такое fast retransmit?

   **Ответ:** Fast retransmit повторяет предполагаемо потерянные данные по ACK evidence до timer expiry. В классическом алгоритме используется порог трёх duplicate ACK; современные стеки имеют дополнительные loss detectors.

   **Типичная ошибка:** Считать три dupACK единственным существующим способом ранней retransmission.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

273. Чем fast retransmit отличается от retransmission по timeout?

   **Ответ:** Fast retransmit опирается на ACK progress/evidence, timeout — на истечение ожидания. Первый часто быстрее и применим, когда последующие данные вызывают feedback; tail losses могут не дать нужных dupACK.

   **Типичная ошибка:** Ждать три dupACK при потере последнего сегмента без дальнейшей передачи.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

274. Почему timeout обычно считается более "дорогим" событием?

   **Ответ:** Оно добавляет ожидание и обычно более жёсткую recovery/congestion reaction; при backoff пауза растёт. Для короткого запроса одна такая пауза может доминировать в tail latency.

   **Типичная ошибка:** Оценивать влияние RTO только долей потерянных байтов.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

275. Как retransmissions обеспечивают надёжность TCP?

   **Ответ:** Повторы восстанавливают gaps, а sequence/ACK logic предотвращает повторную выдачу тех же stream bytes приложению. При окончательном отказе TCP сообщает ошибку, а не гарантирует бесконечную успешную доставку.

   **Типичная ошибка:** Считать отсутствие duplicate stream bytes защитой от повторного бизнес-запроса после reconnect.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).


### Средний уровень
276. Как TCP вычисляет RTO?

   **Ответ:** Классическая оценка RTO использует сглаженный RTT и variation: SRTT + max(clock granularity, 4×RTTVAR), с ограничениями и exponential backoff. Первый sample и retransmitted samples имеют отдельные правила.

   **Типичная ошибка:** Подставлять простое среднее ping без RTT variation и считать это RFC-таймером.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

277. Почему RTO не может быть слишком маленьким?

   **Ответ:** Он вызовет spurious retransmissions при нормальном jitter, лишнюю нагрузку и ошибочную congestion reaction. Таймер должен учитывать неопределённость feedback, а не только минимальный RTT.

   **Типичная ошибка:** Уменьшать RTO до минимального измеренного RTT ради красивой recovery latency.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

278. Почему RTO не может быть слишком большим?

   **Ответ:** Слишком большой RTO затягивает восстановление, особенно при tail loss без других ACK evidence. Поэтому нужен адаптивный таймер и ранние механизмы loss detection, а не один универсальный большой timeout.

   **Типичная ошибка:** Считать большое значение безопасным без цены для p99.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

279. Что такое spurious retransmission?

   **Ответ:** Spurious retransmission — повтор данных, которые не были действительно потеряны, например из-за reorder, задержки ACK или преждевременного timeout. Его отличают от необходимого повтора после реального loss.

   **Типичная ошибка:** Приравнивать число retransmitted packets к числу уникально потерянных packets.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 2883: An Extension to the Selective Acknowledgement Option for TCP](https://www.rfc-editor.org/rfc/rfc2883).

280. Почему retransmission может происходить без реальной потери?

   **Ответ:** Из-за задержки/потери ACK, reordering, RTT spike, scheduling pauses и неточного loss threshold. Packet capture также может неверно классифицировать повтор при неполной видимости.

   **Типичная ошибка:** Лечить каждый spurious label заменой кабеля без проверки ACK path и capture completeness.

   **Источник:** [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985); [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

281. Как packet reordering влияет на retransmissions?

   **Ответ:** Поздний сегмент создаёт gap и dupACK/SACK, поэтому detector может повторить его раньше прихода оригинала. RACK учитывает reordering window; слишком агрессивные thresholds увеличивают ложные повторы.

   **Типичная ошибка:** Просто отключать recovery вместо анализа reordering depth и источника.

   **Источник:** [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

282. Что такое duplicate ACK threshold?

   **Ответ:** Это порог qualifying dupACK для классического fast retransmit, традиционно три. Конкретная реализация дополнительно использует SACK/time и настройки; счётчик не равен любым трём одинаковым ACK fields.

   **Типичная ошибка:** Копировать threshold в собственный parser без условий определения duplicate ACK.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

283. Почему классически fast retransmit запускается после трёх duplicate ACK?

   **Ответ:** Это практический компромисс: несколько последующих arrivals дают evidence пропуска, а единичное reordering менее вероятно вызывает ложный повтор. Порог не является доказательством невозможности spurious recovery.

   **Типичная ошибка:** Считать три dupACK математическим доказательством уничтожения сегмента.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

284. Что происходит с congestion window при retransmission?

   **Ответ:** Recovery и congestion response зависят от алгоритма, detection и признания повтора ложным. RTO, fast recovery и TLP probe не имеют одного и того же обязательного изменения cwnd.

   **Типичная ошибка:** Считать любой retransmission всегда делением cwnd пополам.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

285. Почему retransmissions снижают effective throughput?

   **Ответ:** Они расходуют bandwidth/CPU на уже отправленные байты, могут уменьшать flight/rate и задерживают выдачу gap-dependent данных. Цена зависит от recovery time и нагрузки, а не только количества repeats.

   **Типичная ошибка:** Включать повторы в goodput и получать завышенную полезную скорость.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

286. Как retransmissions влияют на latency?

   **Ответ:** Данные после gap ждут восстановления, а timer/backoff могут добавить RTT или больше. Для short/interactive requests редкие losses создают заметные tail spikes.

   **Типичная ошибка:** Судить по среднему RTT и не измерять complete-message latency.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

287. Что такое head-of-line blocking в контексте потери сегмента?

   **Ответ:** TCP выдаёт упорядоченный stream, поэтому пропуск ранних байтов задерживает выдачу последующих. Даже независимые application records на одном stream могут ждать один gap.

   **Типичная ошибка:** Считать multiplexing records поверх одного TCP устранением transport HOL.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

288. Почему потеря одного сегмента может задержать выдачу последующих данных приложению?

   **Ответ:** Поздние данные не составляют непрерывный префикс sequence stream. Стек может хранить их, но обычный TCP API должен дождаться недостающих ранних байтов.

   **Типичная ошибка:** Пытаться получить out-of-order TCP payload обычным recv без изменения transport.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

289. Как SACK помогает при multiple losses?

   **Ответ:** SACK сообщает полученные ranges за gap, позволяя sender повторять missing data без обязательного полного повторения всего flight. Это особенно полезно при нескольких losses в одном окне.

   **Типичная ошибка:** Считать SACK окончательным cumulative ACK, позволяющим безусловно забыть все SACKed bytes.

   **Источник:** [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

290. Что такое selective acknowledgement?

   **Ответ:** Selective Acknowledgment — опция с диапазонами уже принятых sequence numbers вне cumulative prefix. Возможность согласуется в handshake; каждый report ограничен местом в TCP header.

   **Типичная ошибка:** Ожидать, что один SACK перечислит бесконечное число gaps.

   **Источник:** [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

291. Чем SACK лучше cumulative ACK в некоторых сценариях?

   **Ответ:** Cumulative ACK показывает только первый gap; SACK добавляет информацию о данных за ним и снижает неоднозначность при нескольких потерях. Он дополняет обычный ACK, а не заменяет его.

   **Типичная ошибка:** Игнорировать cumulative ACK, увидев SACK blocks.

   **Источник:** [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

292. Что произойдёт, если SACK не поддерживается?

   **Ответ:** TCP остаётся работоспособным с cumulative ACK и recovery вроде Reno/NewReno, но несколько losses могут восстанавливаться менее эффективно. Без SACK нельзя просто предполагать известными все принятые поздние ranges.

   **Типичная ошибка:** Считать SACK обязательным условием любого TCP-соединения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6582: TCP NewReno](https://www.rfc-editor.org/rfc/rfc6582); [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018).

293. Как retransmission выглядит в Wireshark?

   **Ответ:** Wireshark помечает предполагаемые retransmission, fast/spurious retransmission по эвристикам sequence/timing. Проверяют полный stream и capture loss/offloads; labels не заменяют endpoint counters.

   **Типичная ошибка:** Считать analyzer label достоверным измерением точного kernel recovery algorithm.

   **Источник:** [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

294. Как retransmission выглядит в tcpdump?

   **Ответ:** Сравнивают sequence ranges и timestamps: повторно передаются уже виденные неподтверждённые байты. Relative/absolute numbering и resegmentation учитывают отдельно; tcpdump не знает полностью внутренних решений sender.

   **Пример:**

   ```bash
   tcpdump -ni eth0 -S -tttt -c 100 'host 192.0.2.10 and tcp port 443'
   ```

   **Типичная ошибка:** Считать одинаковую длину двух сегментов доказательством retransmission без сравнения sequence.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

295. Когда частые retransmissions указывают на проблему сети?

   **Ответ:** При устойчивом росте относительно baseline, связи с loss counters/RTT/очередями и ухудшении SLO. Нужно локализовать network vs endpoint/capture и отличить реальную потерю от reorder/ACK issues.

   **Типичная ошибка:** Открывать network incident только по одному повтору без влияния и evidence.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).


### Продвинутый уровень
296. Какие причины retransmissions кроме physical packet loss ты знаешь?

   **Ответ:** ACK loss/delay, reordering, spurious timeout, pauses receiver/sender, firewall/NAT drops и capture artifacts. Эти причины относятся к разным участкам; одинаковый внешний симптом не определяет root cause.

   **Типичная ошибка:** Объяснять все повторы физическими errors линка.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

297. Как overloaded receiver может косвенно вызывать retransmissions?

   **Ответ:** Приёмный host может терять packets до TCP из-за NIC/ring/softirq/CPU pressure, поэтому sender повторяет. Просто медленный application read чаще сначала проявляется rwnd/backpressure, а не обязательным loss.

   **Типичная ошибка:** Считать всякую медленную обработку приложения прямым уничтожением каждого входящего сегмента.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

298. Как queue drops в сети вызывают retransmissions?

   **Ответ:** Когда очередь не вмещает burst либо AQM выбирает drop, сегмент или ACK исчезает на пути. Sender обнаруживает отсутствие progress и восстанавливает данные; location подтверждают counters/captures.

   **Типичная ошибка:** Приписывать queue drop только исходящему интерфейсу sender без проверки других узлов.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

299. Как microburst traffic связан с losses и retransmissions?

   **Ответ:** Краткий burst может превысить instantaneous buffer/drain capacity, хотя средняя bandwidth невысока. Потери вызывают recovery и tail spikes; нужны более точные counters/timestamps, pacing или scheduling changes.

   **Типичная ошибка:** Считать низкое среднее utilization доказательством отсутствия congestion drops.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

300. Как firewall/NAT могут приводить к неожиданным retransmissions?

   **Ответ:** State timeout, table exhaustion, asymmetry, incorrect rules и MTU/fragment handling могут отбрасывать data или ACK. Нужны original/reply tuples и captures по обе стороны устройства.

   **Типичная ошибка:** Лечить conntrack exhaustion увеличением TCP retransmission count клиента.

   **Источник:** [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

301. Что такое retransmission ambiguity?

   **Ответ:** После повтора ACK может относиться к оригиналу или retransmission, поэтому без дополнительной информации нельзя точно выбрать время отправки для RTT sample.

   **Типичная ошибка:** Считать ACK после retry однозначным подтверждением именно retry.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

302. Как Karn’s algorithm помогает при оценке RTT?

   **Ответ:** Karn запрещает неоднозначные RTT samples по повторно переданным данным и использует backoff таймера. Timestamps могут помочь снять неоднозначность при корректной обработке.

   **Типичная ошибка:** Обновлять SRTT любым интервалом ACK-minus-last-send для retransmitted bytes.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

303. Почему RTT measurement усложняется при retransmission?

   **Ответ:** Один ACK покрывает sequence range без обязательного указания, какую копию он подтвердил. Выбор неправильного send timestamp искажает RTO и может запускать новые spurious retries.

   **Типичная ошибка:** Считать TCP ACK номером конкретной transmission attempt.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

304. Что такое RACK / TLP на концептуальном уровне?

   **Ответ:** RACK определяет loss по времени отправки и ACK/SACK более поздних данных с допуском reordering. TLP отправляет probe для tail loss, чтобы получить feedback до полного RTO. Это не прикладной keepalive.

   **Типичная ошибка:** Считать TLP отдельной гарантированной retransmission каждого последнего сегмента.

   **Источник:** [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

305. Как современные TCP stack улучшают loss detection?

   **Ответ:** SACK-based recovery, time-based RACK, tail probes и корректные RTT/RTO оценки улучшают восстановление. Доступность/включение зависят от stack version; базовая TCP semantics не меняется.

   **Типичная ошибка:** Применять описание старого Reno как полный алгоритм любого современного Linux.

   **Источник:** [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985); [RFC 2018: TCP Selective Acknowledgment Options](https://www.rfc-editor.org/rfc/rfc2018); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

306. Что такое out-of-order delivery и как она влияет на loss detection?

   **Ответ:** Out-of-order — приход sequence ranges не по порядку отправки/ожидаемому prefix. Detector должен выдержать допустимую задержку, иначе reorder будет принят за loss. Безграничное ожидание тоже задерживает recovery.

   **Типичная ошибка:** Выбирать reordering tolerance без trade-off между ложными повторами и скоростью восстановления.

   **Источник:** [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

307. Как DSACK помогает анализировать spurious retransmissions?

   **Ответ:** DSACK сообщает о получении дублирующих байтов и может помочь выявить лишние retransmissions или сетевое duplication. Нужно сопоставить timing и ranges: DSACK сам по себе не устанавливает единственную причину.

   **Типичная ошибка:** Считать каждый DSACK доказательством, что sender ошибся, исключая network duplication.

   **Источник:** [RFC 2883: An Extension to the Selective Acknowledgement Option for TCP](https://www.rfc-editor.org/rfc/rfc2883).

308. Как понять, retransmissions вызваны сетью или приложением?

   **Ответ:** Сравнивают packet delivery до TCP, kernel counters, socket queues и application timestamps. Application pause даёт rwnd/processing delays, host overload может дать drops, сеть — отсутствие packets между точками. Нужен first-failure evidence.

   **Типичная ошибка:** Обвинять приложение только потому, что network team не видит errors интерфейса.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

309. Как недостаточный socket buffer может косвенно ухудшать поведение TCP?

   **Ответ:** Малый receive buffer ограничивает rwnd и out-of-order capacity, малый send buffer — offered flight/progress. Это может усиливать stalls/overload effects, но не делает каждый небольшой buffer прямой причиной retransmissions.

   **Типичная ошибка:** Лечить все retransmissions максимальными buffers без измерения drops и окон.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

310. Как NIC/driver issues могут проявляться как retransmissions?

   **Ответ:** RX ring overflow, missed interrupts, driver resets, firmware errors и TX issues могут терять data/ACK или задерживать обработку. Ищут counters, kernel logs и совпадение по времени; offload artifacts отличают от wire failure.

   **Типичная ошибка:** Принимать локальную checksum offload отметку за доказанный NIC defect.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

311. Как собрать доказательства root cause для retransmissions в production?

   **Ответ:** Собирают синхронные endpoint/по-пути captures с drop statistics, sequence/timing, counters NIC/stack, queue/load и application events. Фиксируют версии/config и сравнивают healthy baseline; вывод должен показывать первый участок исчезновения/задержки.

   **Типичная ошибка:** Сохранять только скриншот Wireshark label без исходного trace и контекста.

   **Источник:** [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

312. Какие counters в Linux полезны для анализа retransmissions?

   **Ответ:** TcpRetransSegs и дополнительные TcpExt counters, RTO/loss/reordering metrics, NIC/driver drops и per-socket TCP_INFO. Названия/доступность зависят от версии; cumulative counters сравнивают как delta за интервал.

   **Пример:**

   ```bash
   nstat -az  # Linux/iproute2: снимок stack counters; анализируйте delta.
   ethtool -S eth0
   ```

   **Типичная ошибка:** Считать глобальный retrans counter метрикой конкретного соединения.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

313. Как `ss -i` помогает анализировать TCP состояние?

   **Ответ:** ss -i показывает внутренние TCP metrics, включая доступные RTT/cwnd/retrans/rate fields; -m добавляет memory. Это snapshot, а не полная история, и набор полей зависит от kernel/iproute2.

   **Пример:**

   ```bash
   ss -tinm 'dst 192.0.2.10'
   ```

   **Типичная ошибка:** Объяснять разовый tail spike единственным ss снимком, сделанным через минуту после него.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

314. Какие метрики стоит экспортировать на уровне приложения и хоста?

   **Ответ:** Application: request latency/errors, queue wait, read/write progress, deadlines и reconnect. Host: retrans/RTO/ECN, RTT/rwnd/cwnd, queue memory, CPU/softirq и NIC drops. Метрики связывают по времени и workload.

   **Типичная ошибка:** Экспортировать только общий bytes/s без успешных операций и tail distributions.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

315. Когда retransmissions допустимы, а когда это инцидент?

   **Ответ:** Приемлемость определяется baseline, SLO и стоимостью восстановления. Единичные повторы на рабочем пути допустимы, но всплески, устойчивое ухудшение, RTO и ошибки требуют расследования. Порог зависит от сервиса и условий.

   **Типичная ошибка:** Назначать одну «нормальную» долю retransmissions всем приложениям и сетям.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).


---

## 7. UDP: базовые концепции

### Базовый уровень
316. Что такое UDP?

   **Ответ:** UDP — минимальный transport для отдельных датаграмм поверх IP. Он добавляет порты, длину и checksum, но не гарантирует доставку, порядок и защиту от дубликатов.

   **Типичная ошибка:** Считать отсутствие reliability запретом строить надёжный протокол поверх UDP.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

317. На каком уровне работает UDP?

   **Ответ:** По обычному сопоставлению OSI — L4, в TCP/IP — Transport layer. UDP доставляет датаграммы transport endpoints, используя IP ниже.

   **Типичная ошибка:** Считать UDP прикладным протоколом вроде DNS или RTP.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768).

318. Чем UDP отличается от TCP?

   **Ответ:** TCP даёт упорядоченный stream с recovery, flow/congestion control и connection state. UDP сохраняет datagram boundaries, а дополнительные гарантии должен обеспечить верхний протокол, если они нужны.

   **Типичная ошибка:** Сравнивать TCP и UDP только по размеру заголовка.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768).

319. Почему UDP называют connectionless protocol?

   **Ответ:** UDP не устанавливает peer handshake и не ведёт TCP-подобное согласованное connection state. Локальный UDP connect на socket задаёт peer, но не создаёт wire handshake.

   **Типичная ошибка:** Считать connected UDP несовместимым с connectionless семантикой протокола.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

320. Что означает message-oriented в контексте UDP?

   **Ответ:** Каждая отправка обычной UDP datagram задаёт отдельное сообщение, принимаемое как одна datagram. Размер receive buffer определяет, сможет ли приложение прочитать её целиком.

   **Типичная ошибка:** Разбивать одну слишком большую UDP datagram несколькими recv как TCP stream.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

321. Сохраняет ли UDP границы датаграмм?

   **Ответ:** Да, в обычном datagram API один приём извлекает одну datagram; несколько не склеиваются в stream. Непоместившийся хвост обычно теряется. GRO/GSO extensions имеют явно включаемые специальные контракты.

   **Типичная ошибка:** Предполагать сохранность хвоста для следующего recvfrom.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

322. Что такое UDP datagram?

   **Ответ:** Это UDP header и payload, переносимые IP. UDP length включает восьмибайтный header; IP fragmentation может разделить доставку по сети, но UDP receive получает собранную datagram или не получает её.

   **Типичная ошибка:** Путать IP fragment с отдельным UDP сообщением.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

323. Есть ли у UDP handshake?

   **Ответ:** Нет встроенного handshake. Протокол поверх UDP может иметь собственное установление/аутентификацию, например QUIC, но это не функция базового UDP.

   **Типичная ошибка:** Считать отсутствие TCP SYN отсутствием какого-либо startup delay у любого UDP-based протокола.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

324. Есть ли у UDP встроенные retransmissions?

   **Ответ:** Нет: потерянные datagrams UDP автоматически не повторяет. Повторы реализует приложение/верхний протокол, учитывая identifiers, deadlines и congestion.

   **Типичная ошибка:** Бесконечно повторять одинаковый запрос без deduplication и ограничения нагрузки.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

325. Есть ли у UDP встроенный congestion control?

   **Ответ:** Нет встроенного congestion control. Internet-приложение поверх UDP должно обеспечивать подходящее congestion-safe поведение самостоятельно либо через готовый transport, например QUIC.

   **Типичная ошибка:** Считать UDP разрешением безлимитно отправлять на полной скорости интерфейса.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

326. Есть ли у UDP встроенный flow control?

   **Ответ:** Нет TCP-подобного advertised receive window. Переполнение receive queue может просто терять datagrams; receiver feedback/flow control добавляет верхний протокол при необходимости.

   **Типичная ошибка:** Ожидать, что sender автоматически остановится, когда peer не успевает recvfrom.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

327. Почему UDP header проще TCP header?

   **Ответ:** В нём нет sequence/ACK, окна, flags и options TCP state machine. Базовый размер — 8 байт. Если приложению нужны эквивалентные функции, их overhead переносится в верхний протокол.

   **Типичная ошибка:** Считать custom reliable UDP обязательно легче TCP после добавления всех гарантий.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

328. Какие поля содержит UDP header?

   **Ответ:** Source port, destination port, length и checksum — по 16 бит. Length включает header и payload; специальные IPv6 jumbogram случаи рассматриваются отдельно.

   **Типичная ошибка:** Считать UDP length длиной только application data.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768).

329. Что такое UDP checksum?

   **Ответ:** Она проверяет UDP header/payload и IP pseudo-header. В IPv4 нулевое поле может означать отсутствие checksum; в обычном IPv6 checksum обязательна с узкими специальными исключениями. Криптографической защиты она не даёт.

   **Типичная ошибка:** Отключать checksum в обычном IPv6 UDP приложении по аналогии с IPv4.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

330. Почему UDP часто быстрее TCP по накладным расходам?

   **Ответ:** У базового UDP небольшой header и нет transport handshake/recovery state. Но общая эффективность зависит от потерь, размера, приложения и добавленных гарантий; для bulk reliable передачи TCP/QUIC могут быть лучше.

   **Типичная ошибка:** Сравнивать sender bytes/s UDP с delivered TCP goodput и объявлять UDP победителем.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).


### Средний уровень
331. Что получает приложение, если UDP packet потерян?

   **Ответ:** Обычно ничего: datagram не приходит, отдельного обязательного уведомления о потере нет. Верхний протокол обнаруживает отсутствие по timeout, sequence gap или ожидаемому ответу.

   **Типичная ошибка:** Считать отсутствие errno доказательством доставки всех отправленных datagrams.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

332. Что происходит, если UDP datagram приходит дублированным?

   **Ответ:** Приложение может получить несколько копий и само решает, допустимы ли они. Для команд с side effects используют transaction IDs и bounded deduplication.

   **Типичная ошибка:** Выполнять повторную оплату/команду на каждой копии без проверки идентификатора.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

333. Что происходит, если UDP datagram приходит вне порядка?

   **Ответ:** Datagrams могут поступить в другом порядке; UDP не восстанавливает последовательность. Приложение использует sequence numbers, reorder window или предпочитает свежие данные по своей семантике.

   **Типичная ошибка:** Всегда ожидать потерянный sequence бесконечно, задерживая все последующие realtime данные.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

334. Как приложение должно реализовать надёжность поверх UDP, если она нужна?

   **Ответ:** Нужны identifiers, ACK/loss detection, bounded retries, deduplication, congestion control и защита состояния/источника. Часто безопаснее готовый transport, чем собственная неполная реализация.

   **Типичная ошибка:** Добавить только ACK и считать reliable UDP production-ready.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

335. Почему UDP подходит не для всех задач?

   **Ответ:** Без дополнительных механизмов нет доставки, порядка, congestion/flow control и защищённой идентичности. Если задача требует именно этого, TCP/QUIC могут быть проще и надёжнее собственного протокола.

   **Типичная ошибка:** Выбирать UDP только ради отсутствия handshake, игнорируя все остальные требования.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

336. Может ли UDP фрагментироваться на уровне IP?

   **Ответ:** Да. В IPv4 возможна source/router fragmentation по условиям DF/MTU, в IPv6 — только отправителем. Потеря любого необходимого fragment не даст собрать datagram; предпочтительнее избегать fragmentation.

   **Типичная ошибка:** Считать сообщение UDP гарантированно одним wire packet независимо от размера.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

337. Почему большие UDP datagrams опасны?

   **Ответ:** Они могут вызвать fragmentation, PMTU errors, reassembly pressure и повышенную вероятность потери всего сообщения. Верхняя граница UDP length не является безопасным размером для любого internet path.

   **Типичная ошибка:** Отправлять 64 KiB datagrams, потому что поле length это позволяет.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

338. Что происходит, если UDP datagram больше receive buffer?

   **Ответ:** Если речь о переданном в recv буфере, непрочитанный хвост datagram отбрасывается; через recvmsg можно узнать truncation. Если речь о kernel SO_RCVBUF queue, при нехватке памяти может потеряться целая datagram.

   **Пример:**

   ```c
   #include <sys/socket.h>
   #include <sys/uio.h>
   #include <stddef.h>

   // 0: полная datagram (в том числе пустая), 1: truncation, -1: ошибка.
   int receive_datagram(int fd, void *buffer, size_t capacity, ssize_t *received) {
       if (received == NULL) return -1;
       struct iovec iov = { .iov_base = buffer, .iov_len = capacity };
       struct msghdr msg = {0};
       msg.msg_iov = &iov;
       msg.msg_iovlen = 1;
       ssize_t n = recvmsg(fd, &msg, 0);
       if (n == -1) return -1;
       *received = n;
       return (msg.msg_flags & MSG_TRUNC) != 0;
   }
   ```

   **Типичная ошибка:** Путать маленький пользовательский буфер одного read с общей kernel receive queue.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

339. Что означает truncation для UDP reads?

   **Ответ:** Truncation означает, что datagram не поместилась в предоставленный буфер и была прочитана не полностью. recvmsg сообщает MSG_TRUNC; особенности возврата полной длины с flags зависят от ОС.

   **Типичная ошибка:** Принимать усечённое сообщение за корректное только потому, что recv вернул положительное число.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

340. Почему один `recvfrom()` обычно соответствует одной UDP датаграмме?

   **Ответ:** Datagram API извлекает одну запись с её source endpoint. Исключения вроде явно включённого UDP_GRO требуют отдельной обработки metadata; обычный UDP не является stream.

   **Типичная ошибка:** Запускать TCP-подобное дочитывание хвоста, смешивая разные datagrams в одно сообщение.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

341. Может ли `sendto()` вернуть успех, хотя пакет позже будет потерян?

   **Ответ:** Да: успех означает локальное принятие данных, а позднее они могут потеряться в host queues, сети или receiver. Некоторые network errors приходят асинхронно, но обязательного delivery ACK у UDP нет.

   **Типичная ошибка:** Логировать sendto success как успешное выполнение команды удалённым узлом.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

342. Почему UDP удобен для multicast?

   **Ответ:** UDP не требует отдельного connection state на каждого получателя и естественно несёт group datagrams. Нужны multicast routing/membership и rate/congestion policy; TCP обычного group delivery не предоставляет.

   **Типичная ошибка:** Считать multicast join гарантией доставки каждой datagram всем участникам.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

343. Почему UDP часто используют для real-time traffic?

   **Ответ:** Приложение может не ждать устаревшие данные и самостоятельно выбирать deadlines, playout, FEC и rate adaptation. Однако UDP сам не гарантирует ни низкую задержку, ни достаточную bandwidth.

   **Типичная ошибка:** Вводить безлимитные повторы для realtime payload, который уже просрочен.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

344. Какие недостатки у UDP для real-time приложений?

   **Ответ:** Потери, reorder, duplication, jitter, NAT state и отсутствие встроенной безопасности/CC нужно обрабатывать выше. Сеть может блокировать UDP; необходимы диагностика и стратегия fallback, если требуется доступность.

   **Типичная ошибка:** Считать UDP пригодным realtime transport без playout/adaptation и congestion handling.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

345. Как packet loss влияет на UDP приложение?

   **Ответ:** Может пропасть update, возникнуть media gap или потеряться команда. Реакция зависит от семантики: concealment, FEC, selective retry или принятие потери, но не универсальный повтор всего.

   **Типичная ошибка:** Одинаково обрабатывать потерю устаревшей позиции игрока и критичной транзакции.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

346. Как jitter влияет на UDP приложение?

   **Ответ:** Неравномерный приход создаёт риск опоздания к playout deadline. Даже без потери всех пакетов их поздний приход может стать application loss.

   **Типичная ошибка:** Считать доставленный после срока пакет полностью полезным для realtime качества.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

347. Как приложение компенсирует jitter?

   **Ответ:** Использует timestamps, reorder/jitter buffer и адаптацию playout/rate. Буфер обменивает устойчивость к variation на добавленную задержку; он не исправляет бесконечную перегрузку.

   **Типичная ошибка:** Увеличивать jitter buffer без верхнего latency budget.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

348. Почему UDP часто используется в DNS?

   **Ответ:** Небольшой request/response часто укладывается без connection setup. Но DNS также требует TCP и использует extensions/защищённые транспорты; UDP/53 не является единственным способом DNS.

   **Типичная ошибка:** Блокировать TCP/53 и считать DNS полностью поддержанным.

   **Источник:** [RFC 1035: DNS](https://www.rfc-editor.org/rfc/rfc1035).

349. Почему UDP используется в RTP/VoIP?

   **Ответ:** RTP предоставляет timestamps/sequence и media-oriented delivery, часто поверх UDP, позволяя управлять сроком полезности данных и playout. Надёжность/защита и feedback определяются сопутствующими механизмами.

   **Типичная ошибка:** Считать RTP обязательной гарантией доставки либо встроенным шифрованием.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

350. Почему UDP подходит для telemetry / gaming / streaming сценариев?

   **Ответ:** Подходит, когда сообщения независимы, устаревшие updates можно отбросить, а приложение умеет работать с loss/jitter и ограничивать rate. Не весь streaming использует UDP: buffered video часто идёт через HTTP/TCP/QUIC.

   **Типичная ошибка:** Выбирать transport по слову «streaming», не определив реальные delivery/deadline требования.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).


### Продвинутый уровень
351. Как реализовать UDP сервер на C?

   **Ответ:** Создают SOCK_DGRAM socket, bind к локальному адресу, recvfrom/recvmsg читают datagrams, sendto отвечает нужному peer. Проверяют длину, truncation и ошибки; echo должен быть ограничен и не становиться amplifier.

   **Пример:**

   ```c
   #include <sys/socket.h>
   #include <netinet/in.h>
   #include <unistd.h>
   #include <errno.h>

   // Учебный UDP echo на loopback: одно сообщение до 1024 bytes.
   int main(void) {
       int fd = socket(AF_INET, SOCK_DGRAM, 0);
       if (fd == -1) return 1;
       struct sockaddr_in local = {0};
       local.sin_family = AF_INET;
       local.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
       local.sin_port = htons(19001);
       if (bind(fd, (struct sockaddr *)&local, sizeof local) == -1) {
           close(fd); return 1;
       }
       struct sockaddr_storage peer;
       socklen_t peer_size = sizeof peer;
       char data[1025]; // +1, чтобы отклонить datagrams больше лимита 1024.
       ssize_t n;
       do { n = recvfrom(fd, data, sizeof data, 0,
                         (struct sockaddr *)&peer, &peer_size); }
       while (n == -1 && errno == EINTR);
       int ok = n >= 0 && n <= 1024 &&
           sendto(fd, data, (size_t)n, 0, (struct sockaddr *)&peer, peer_size) == n;
       close(fd);
       return ok ? 0 : 1;
   }
   ```

   **Типичная ошибка:** Вызвать listen/accept для обычного UDP server или доверять любому payload без bounds checks.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

352. Как реализовать UDP клиент на C++?

   **Ответ:** Создают datagram socket, формируют endpoint и используют sendto/recvfrom либо UDP connect с send/recv. Нужны timeout, проверка source/transaction ID и RAII lifetime; отправка не подтверждает ответ.

   **Типичная ошибка:** Читать первый пришедший UDP пакет как ответ без проверки его принадлежности запросу.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

353. Чем `recvfrom()` отличается от `recv()` для UDP?

   **Ответ:** recvfrom может вернуть source address datagram; recv обычно не возвращает его. Оба читают одну datagram в обычном UDP API; recvmsg дополнительно даёт flags/ancillary data.

   **Типичная ошибка:** Считать recv гарантией connected TCP semantics только из-за имени вызова.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

354. Что даёт `connect()` на UDP socket?

   **Ответ:** Локально назначает default peer для send и ограничивает приём соответствующим endpoint по правилам ОС; может упростить ошибки и route/source selection. Wire handshake и delivery guarantee не появляются.

   **Типичная ошибка:** Считать успешный UDP connect проверкой наличия сервера на peer port.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

355. Можно ли вызывать `send()` на UDP socket после `connect()`?

   **Ответ:** Да: send использует default peer connected UDP socket и передаёт одну datagram. Успех по-прежнему означает локальное принятие, не удалённую доставку.

   **Типичная ошибка:** Ожидать EPIPE как обязательную синхронную реакцию на выключенный UDP server.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

356. Зачем вообще "подключать" UDP socket?

   **Ответ:** Для удобного send/recv с одним peer, source filtering и подходящей обработки network errors. Это также фиксирует логическую ассоциацию endpoint, но не обеспечивает аутентификацию источника.

   **Типичная ошибка:** Использовать peer endpoint filter как замену криптографической проверке сообщений.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

357. Как connected UDP socket фильтрует пакеты?

   **Ответ:** Обычно доставляет только datagrams с заданного peer IP/port, с учётом локальной привязки. Это kernel demultiplexing, не защита от source spoofing и не протокольное подтверждение клиента.

   **Типичная ошибка:** Считать connected UDP невосприимчивым к поддельным пакетам.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

358. Какие ICMP ошибки может увидеть UDP socket?

   **Ответ:** Например, port unreachable, host/network unreachable и packet-too-big связанные ошибки. В Linux error queue через IP_RECVERR позволяет получить расширенный контекст; доставка/errno зависит от ОС и состояния.

   **Типичная ошибка:** Ожидать обязательного ICMP на каждую потерянную UDP datagram.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

359. Как `ECONNREFUSED` может появиться у UDP?

   **Ответ:** Если стек получил ICMP port unreachable или аналогичное уведомление, UDP socket может вернуть ECONNREFUSED. Это асинхронный feedback, иногда относящийся к предыдущей datagram; блокировка ICMP может скрыть его.

   **Типичная ошибка:** Считать отсутствие ECONNREFUSED доказательством работающего UDP listener.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

360. Как non-blocking I/O работает с UDP?

   **Ответ:** Datagram recv/send выполняются без ожидания готовности; при нехватке доступных данных/ресурсов возвращают EAGAIN. UDP send обычно атомарен на уровне datagram: не строят TCP-подобный partial-send хвост как новую datagram.

   **Типичная ошибка:** Считать EAGAIN пустой полученной datagram или делить одно сообщение произвольными retries хвоста.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

361. Как epoll работает с UDP сокетами?

   **Ответ:** EPOLLIN означает возможность чтения/ошибку; nonblocking loop обрабатывает queued datagrams до EAGAIN при edge-triggered режиме. Нужно ограничивать work per loop для fairness и учитывать error events.

   **Типичная ошибка:** Обработать только одну datagram в EPOLLET и навсегда оставить остальные непрочитанными.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

362. Как пакетная обработка (`recvmmsg`/`sendmmsg`) помогает UDP приложениям?

   **Ответ:** recvmmsg/sendmmsg уменьшают число syscalls на группу datagrams, сохраняя их отдельные boundaries. Требуют обработки частично выполненного batch и return lengths/errors; batching имеет latency/fairness trade-offs.

   **Типичная ошибка:** Считать возврат k из sendmmsg подтверждением удалённой доставки k сообщений.

   **Источник:** [Linux man-pages: recvmmsg(2)](https://man7.org/linux/man-pages/man2/recvmmsg.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

363. Что такое UDP GRO/GSO на концептуальном уровне?

   **Ответ:** UDP_SEGMENT/GSO позволяет разделить крупный send buffer на UDP datagrams, UDP_GRO — объединить совместимый receive с metadata размера сегмента. Это opt-in Linux features, а не изменение обычной UDP wire semantics.

   **Типичная ошибка:** Включить GRO и продолжать считать каждый recvmsg одной исходной datagram без разбора metadata.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

364. Как SO_RCVBUF / SO_SNDBUF влияют на UDP?

   **Ответ:** Ограничивают socket memory/очереди в пределах системных правил. Receive buffer помогает поглощать bursts, но при устойчивом медленном consumer drops продолжатся. Send buffer не добавляет UDP надёжность.

   **Типичная ошибка:** Повышать SO_RCVBUF бесконечно вместо ускорения чтения и admission/rate control.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

365. Почему UDP drops могут происходить уже на стороне хоста?

   **Ответ:** Из-за NIC ring, driver/kernel/softirq overload, firewall и переполнения socket queue. Capture hook может увидеть пакет, который позже не дойдёт приложению; важно знать точку наблюдения.

   **Типичная ошибка:** Считать packet visible in tcpdump гарантией successful recvfrom приложения.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

366. Как в Linux увидеть UDP receive drops?

   **Ответ:** Смотрят Udp InErrors/RcvbufErrors и другие stack counters, ss -m, /proc/net/udp и SO_RXQ_OVFL при поддержке. Разделяют общесистемные и per-socket counters и анализируют delta.

   **Пример:**

   ```bash
   nstat -az
   ss -uanm
   ip -s link show dev eth0
   ethtool -S eth0
   ```

   **Типичная ошибка:** Приписывать глобальный UdpRcvbufErrors одному сервису без корреляции.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

367. Что такое socket receive queue overflow?

   **Ответ:** Kernel не может разместить новую datagram в socket receive queue и отбрасывает её. Приложение может увидеть gap по своему sequence, а SO_RXQ_OVFL — сообщить cumulative drop count на последующих messages.

   **Типичная ошибка:** Ждать специальный recv с текстом «предыдущий пакет потерян».

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

368. Как packet capture помогает отладить UDP loss?

   **Ответ:** Сопоставляют датаграммы по protocol IDs/sequence на sender/receiver, проверяют capture drop stats и offload. Один capture не показывает всю цепочку; отсутствие записи может быть потерей самого capture.

   **Типичная ошибка:** Считать один неполный pcap точным эталоном числа всех UDP packets.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

369. Как отличить network loss от application drop для UDP?

   **Ответ:** Нужны receive NIC/stack/socket counters и application accepted/rejected/late counters вместе с captures. Первый участок расхождения sender→wire→kernel→parser локализует проблему; cryptographic/parser rejects — отдельная категория.

   **Типичная ошибка:** Считать любой missing application sequence сетевым дропом между роутерами.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

370. Какие типичные ошибки допускают в UDP сервисах на C/C++?

   **Ответ:** Игнорирование truncation, недоверенные длины/источники, смешение datagram и stream semantics, отсутствие timeout/rate limits, congestion handling и deduplication. Zero-length datagram и errors обрабатывают отдельно.

   **Типичная ошибка:** Считать recvfrom==0 EOF и закрывать UDP server на легальной пустой datagram.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).


---

## 8. UDP: когда используется

### Базовый уровень
371. Когда UDP предпочтительнее TCP?

   **Ответ:** Когда нужны независимые datagrams, multicast либо собственное управление сроками и частичной надёжностью, а приложение готово обеспечить безопасность и congestion-safe поведение. UDP — основа, а не полный набор гарантий.

   **Типичная ошибка:** Выбирать UDP только потому, что у TCP есть handshake, без оценки требований к доставке.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

372. Почему UDP удобен для low-latency приложений?

   **Ответ:** Позволяет не задерживать свежие независимые сообщения ради восстановления устаревших и управлять playout/retry deadlines. Однако queues, сеть и приложение всё равно могут добавить большую задержку.

   **Типичная ошибка:** Считать UDP автоматической гарантией real-time deadlines.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

373. В каких случаях потеря части пакетов допустима?

   **Ответ:** Когда данные заменяются более свежими или допускают деградацию: часть media samples, telemetry с оговорённой полнотой, игровые state updates. Критичные команды могут требовать отдельной надёжности.

   **Типичная ошибка:** Считать loss допустимым для всех сообщений одного приложения, включая управление и транзакции.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

374. Почему real-time audio/video часто используют UDP?

   **Ответ:** Media transport может управлять timestamps, jitter buffer, selective recovery, FEC и bitrate без TCP stream HOL. Но buffered video часто работает по HTTP, а realtime решения могут применять разные transports.

   **Типичная ошибка:** Утверждать, что любое видео обязательно передаётся UDP.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

375. Почему DNS historically использует UDP?

   **Ответ:** Маленькие queries/responses часто обходились без setup overhead. DNS не ограничивается UDP: TCP, EDNS и encrypted transports также важны для полноты и безопасности.

   **Типичная ошибка:** Проектировать DNS client без TCP fallback.

   **Источник:** [RFC 1035: DNS](https://www.rfc-editor.org/rfc/rfc1035).

376. Почему DHCP использует UDP?

   **Ответ:** DHCP нужен bootstrap до обычного IP/connection setup и может использовать broadcast/relay. UDP вместе с DHCP state machine, transaction ID и retries подходит этому процессу.

   **Типичная ошибка:** Переносить отсутствие TCP reliability на утверждение, что DHCP вообще не повторяет запросы.

   **Источник:** [RFC 2131: DHCP](https://www.rfc-editor.org/rfc/rfc2131).

377. Почему multicast обычно строится на UDP?

   **Ответ:** UDP переносит независимые group datagrams без отдельного TCP connection к каждому участнику. Протокол выше определяет membership, feedback и congestion policy по требованиям deployment.

   **Типичная ошибка:** Ожидать, что UDP multicast сам обеспечит надёжную доставку всем receivers.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

378. Почему online games часто используют UDP?

   **Ответ:** Свежий world state часто полезнее своевременно, чем гарантированно, но слишком поздно. Игровой протокол может отдельно обрабатывать reliable commands и unreliable updates с защитой и rate control.

   **Типичная ошибка:** Отправлять всё, включая платежи/инвентарь, как неподтверждённые state updates.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

379. Почему telemetry и metrics иногда отправляют по UDP?

   **Ответ:** Datagram ingest может иметь небольшой startup/connection overhead и допускать оговорённые потери. Нужны limits, оценка потерь и понимание, какие metrics обязаны доставляться надёжно.

   **Типичная ошибка:** Использовать lossy transport для единственного источника обязательного финансового/аудиторского учёта.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

380. Почему service discovery часто использует UDP?

   **Ответ:** Локальный multicast/broadcast позволяет обнаружить участников без знания каждого адреса. Но ответы недоверенны и могут создавать amplification; область распространения и rate ограничивают.

   **Типичная ошибка:** Принимать discovery reply как аутентификацию найденного сервиса.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).


### Средний уровень
381. Когда TCP всё же лучше UDP даже для быстрой передачи?

   **Ответ:** Когда нужна полная упорядоченная доставка, совместимость middleboxes и готовый mature stream API. Для bulk transfers recovery/CC и kernel optimizations часто выгоднее самодельного аналога поверх UDP.

   **Типичная ошибка:** Считать UDP заведомо эффективнее после добавления тех же reliability/security функций.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

382. Почему "UDP быстрее" — слишком грубое утверждение?

   **Ответ:** Нужно сравнить startup latency, delivered goodput, CPU, loss, tail и набор гарантий. Быстрая отправка datagrams в buffer не равна быстрой полезной доставке peer.

   **Типичная ошибка:** Сравнивать неконгестионный UDP flood с congestion-controlled TCP как равные протоколы задачи.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

383. Когда надёжность важнее latency?

   **Ответ:** Когда потеря или пропуск данных недопустимы по семантике: передача файлов, согласованные команды и важные records. Но надёжность всё равно имеет deadline и application acknowledgement; transport не доказывает exactly-once.

   **Типичная ошибка:** Пытаться обеспечить бесконечную надёжность без времени ожидания и политики повтора операций.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

384. Когда ordering критичен, а когда нет?

   **Ответ:** Ordering нужен для зависимых команд/byte-stream формата. Независимые snapshots или media chunks могут обрабатываться с reorder window либо предпочтением свежего. Требования часто различаются по каналам одного приложения.

   **Типичная ошибка:** Заставлять независимые realtime updates ждать один старый потерянный packet.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

385. Когда приложение может само реализовать retransmission лучше TCP?

   **Ответ:** Когда известны per-message deadlines/приоритеты и можно selectively восстанавливать только ещё полезные данные. Всё равно нужны congestion control, deduplication и security; готовый QUIC/медиастек может уже решать задачу.

   **Типичная ошибка:** Считать знание типа приложения достаточным основанием написать собственный TCP без тестов.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

386. Почему media apps часто строят свои механизмы поверх UDP?

   **Ответ:** Им важны media timestamps, playout deadlines, bitrate adaptation и выбор между retry/FEC/concealment. TCP stream semantics не всегда дают нужный контроль над просроченными данными.

   **Типичная ошибка:** Добавлять media buffering без ограничения end-to-end latency.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

387. Что такое jitter buffer и зачем он нужен?

   **Ответ:** Jitter buffer задерживает playout на ограниченное время, чтобы сгладить вариацию прихода и reorder. Он улучшает регулярность ценой добавленной задержки; поздние сверх deadline пакеты могут стать бесполезными.

   **Типичная ошибка:** Считать jitter buffer средством восстановления физически утраченных данных без FEC/retry.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

388. Почему FEC может быть полезен поверх UDP?

   **Ответ:** FEC добавляет избыточность, позволяющую восстановить часть потерянных данных без ожидания RTT. Цена — bandwidth/CPU и block delay; возможности зависят от кода и структуры losses.

   **Типичная ошибка:** Продолжать увеличивать FEC при congestion без снижения полезного rate и усугублять overload.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

389. Когда QUIC вытесняет custom protocol поверх UDP?

   **Ответ:** Когда нужны secure reliable streams, multiplexing, migration и готовые loss/CC mechanisms, QUIC может уменьшить объём собственной protocol logic. Но deadline media semantics могут потребовать QUIC DATAGRAM или другого подхода.

   **Типичная ошибка:** Считать QUIC streams полной заменой любого unreliable realtime сообщения.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9221: QUIC DATAGRAM Extension](https://www.rfc-editor.org/rfc/rfc9221).

390. Какие риски у UDP в интернете с точки зрения middleboxes?

   **Ответ:** Возможны блокировка/rate limiting UDP, короткие NAT timers, ограничения размера и idle traffic. Нужны path checks, разумные keepalive, PMTU handling и fallback, если доступность этого требует.

   **Типичная ошибка:** Тестировать только LAN и считать internet UDP reachability универсальной.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

391. Почему NAT traversal часто строят вокруг UDP?

   **Ответ:** UDP позволяет явно проверять endpoints, mappings и connectivity без TCP handshake semantics; STUN/ICE используют это. Но destination-dependent mappings/filters и firewalls могут потребовать relay.

   **Типичная ошибка:** Считать успешный hole punching гарантированным для любой пары NAT.

   **Источник:** [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445); [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

392. Почему UDP amplification attacks являются проблемой?

   **Ответ:** С поддельным source атакующий может направить большие ответы к жертве. Защита включает anti-spoofing, rate limits, address validation и ограничение ответа до подтверждения адреса.

   **Типичная ошибка:** Отвечать большим payload на маленький unauthenticated request от произвольного источника.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

393. Какие сервисы нельзя бездумно строить на UDP?

   **Ответ:** Критичные команды, транзакции и открытые responder-сервисы требуют явной reliability/security/abuse модели. UDP допустим как основа, но без этих механизмов легко получить потери, дубли и amplification.

   **Типичная ошибка:** Считать checksum проверкой авторизованности команды или прав на ответ.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

394. Как packet pacing важно для UDP real-time трафика?

   **Ответ:** Pacing уменьшает bursts, очереди и drops, помогает уложить media rate в доступную capacity. Должен учитывать actual packet overhead, congestion feedback и deadline, а не только среднее payload bytes/s.

   **Типичная ошибка:** Отправлять все packets кадра мгновенным burst и считать средний bitrate достаточным ограничением.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

395. Когда UDP приложение должно само ограничивать скорость передачи?

   **Ответ:** Для Internet traffic всегда нужно appropriate congestion-safe поведение, даже если протокол не reliable. Ограничение выбирают по типу traffic/feedback; отсутствие ICMP/loss report не означает свободную capacity.

   **Типичная ошибка:** Передавать всё быстрее при потере ACK/feedback и усиливать congestion.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).


### Продвинутый уровень
396. Как принять решение TCP vs UDP для нового протокола?

   **Ответ:** Фиксируют надёжность, ordering scope, deadlines, sizes, multicast, migration, security, reachability и стоимость сопровождения. Затем сравнивают TCP/QUIC и UDP-based варианты по одинаковой семантике и условиям.

   **Типичная ошибка:** Начинать с транспорта, а затем подгонять продуктовые гарантии под его ограничения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

397. Какие требования к доставке, ordering и latency нужно зафиксировать заранее?

   **Ответ:** Для каждого класса сообщений задают допустимые loss/duplicates/reorder, время полезности, delivery acknowledgement, размер и приоритет. Отдельно — authentication, replay protection и нагрузку при отказах.

   **Типичная ошибка:** Писать одно требование «быстро и надёжно» без измеримых failure/deadline правил.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

398. Как измерить, что UDP действительно лучше для данного кейса?

   **Ответ:** Сравнивают delivered results, p95/p99, loss/late fraction, CPU, bandwidth и fairness при одинаковой безопасности и нагрузке. Включают WAN/mobile profiles и middlebox failures.

   **Пример:**

   ```bash
   # Два отдельных теста к разрешённому тестовому iperf3-server.
   # Сравнивайте receiver goodput/loss/latency, а не только sender rate.
   iperf3 -c 192.0.2.10 -t 30
   iperf3 -c 192.0.2.10 -u -b 10M -t 30
   ```

   **Типичная ошибка:** Сравнивать UDP без encryption/retries с TCP+TLS и приписывать всю разницу transport.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

399. Какие trade-offs у UDP в мобильных и беспроводных сетях?

   **Ответ:** Нет stream HOL для независимых updates, но variable rate/jitter/loss и handover требуют adaptation, congestion handling и NAT/migration логики. Link-layer retries могут менять delay даже без видимой UDP loss.

   **Типичная ошибка:** Считать radio loss постоянным Bernoulli-процентом во всех тестах.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

400. Как проектировать протокол поверх UDP для loss-prone среды?

   **Ответ:** Используют bounded sizes, sequence/transaction IDs, timestamps/deadlines, replay-safe state и congestion feedback. Retry/FEC/reorder выбирают по полезности данных; устойчивость проверяют на bursts и path changes.

   **Типичная ошибка:** Добавить unbounded retransmission queue и получить memory collapse при недоступном peer.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

401. Когда стоит добавить sequence numbers в собственный UDP протокол?

   **Ответ:** Когда надо обнаруживать gaps, duplicates, reorder или выбирать свежий state. Определяют scope, wraparound comparisons, restart epochs и допустимое окно; sequence без authentication не защищает от подделки.

   **Типичная ошибка:** Считать перезапуск счётчика с нуля новым сеансом без session/epoch distinction.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

402. Когда стоит добавить ACK/NACK поверх UDP?

   **Ответ:** Когда sender должен знать доставку/пропуски для recovery или adaptation. ACK/NACK сами могут теряться и создавать feedback load; feedback design учитывает multicast implosion, security и deadlines.

   **Типичная ошибка:** Отправлять бесконечный ACK на ACK или trust неподтверждённый NACK для amplification.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

403. Когда стоит добавить retransmission поверх UDP?

   **Ответ:** Если данные ещё полезны в момент возможного восстановления и повтор безопасен. Нужны limited retries/backoff, identifiers, deduplication и общий deadline совместно с congestion control.

   **Типичная ошибка:** Повторять старые realtime samples после playout deadline, задерживая свежие.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

404. Когда стоит не добавлять retransmission вовсе?

   **Ответ:** Когда устаревшие данные уже бесполезны, допустим loss либо FEC/concealment лучше укладываются в budget. Критичный control channel может оставаться reliable отдельно.

   **Типичная ошибка:** Отказываться от retry всех сообщений только потому, что основной media channel lossy.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

405. Какие anti-patterns чаще всего возникают при разработке custom reliable UDP protocol?

   **Ответ:** ACK без CC/security, линейные неограниченные retries, отсутствие wraparound/epoch handling, fragmentation и unbounded reassembly. Mature transport снижает риск, но тоже требует правильной интеграции.

   **Типичная ошибка:** Считать один localhost ping-pong достаточной валидацией собственного reliable protocol.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).


---

## 9. QUIC: базовые концепции

### Базовый уровень
406. Что такое QUIC?

   **Ответ:** QUIC — защищённый multiplexed transport поверх UDP. Базовый QUIC предоставляет reliable ordered streams, TLS-based handshake, flow/congestion control и поддержку смены пути. HTTP/3 — одно из приложений поверх него.

   **Пример:**

   ```bash
   # При наличии HTTP/3 support в сборке curl:
   curl --version
   curl --http3-only --connect-timeout 5 https://example.com/
   # Сервер должен реально поддерживать HTTP/3; успех example.com не предполагается.
   ```

   **Типичная ошибка:** Считать QUIC синонимом HTTP/3 или просто encrypted UDP datagrams.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

407. На каком транспорте работает QUIC?

   **Ответ:** QUIC packets переносятся UDP datagrams; UDP endpoints обеспечивают доставку к реализации QUIC. Надёжность и streams реализует QUIC, а не сам UDP.

   **Типичная ошибка:** Считать UDP checksum достаточной защитой QUIC payload.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

408. Почему QUIC строится поверх UDP?

   **Ответ:** UDP даёт широко доступный packet-oriented substrate без необходимости внедрять новый IP protocol number во всех ОС/сетях. QUIC переносит evolution в endpoints и снижает middlebox dependence; блокировка UDP всё равно возможна.

   **Типичная ошибка:** Считать UDP универсально пропускаемым через любые firewall.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

409. Какие задачи QUIC решает по сравнению с TCP+TLS?

   **Ответ:** Совмещает crypto/transport setup, даёт независимые streams, connection IDs/migration и современные loss/CC механизмы. Это может уменьшить startup/HOL проблемы, но не гарантирует выигрыш каждой нагрузки.

   **Типичная ошибка:** Обещать QUIC меньшую latency и CPU cost во всех окружениях.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

410. Почему QUIC часто ассоциируется с HTTP/3?

   **Ответ:** HTTP/3 отображает HTTP semantics на QUIC streams и использует его transport. QUIC пригоден и для других приложений; наличие UDP/443 не доказывает конкретный application protocol без negotiation.

   **Типичная ошибка:** Называть любую реализацию QUIC HTTP server.

   **Источник:** [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

411. Есть ли у QUIC встроенное шифрование?

   **Ответ:** Да: QUIC v1 использует TLS 1.3 handshake/key derivation и packet protection. Защита Initial основана на публично выводимых начальных ключах и не даёт той же конфиденциальности, что последующие handshake/application уровни.

   **Типичная ошибка:** Считать любую информацию Initial скрытой от пассивного наблюдателя обычными секретными application keys.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

412. Почему security встроена в QUIC изначально?

   **Ответ:** Защищённые transport metadata и authenticated endpoints уменьшают вмешательство middleboxes и делают security обязательной частью transport integration. Но правильная certificate/identity validation приложением остаётся необходимой.

   **Типичная ошибка:** Принимать любое TLS-соединение без проверки server identity, потому что QUIC «уже безопасен».

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

413. Чем QUIC отличается от TCP на концептуальном уровне?

   **Ответ:** TCP — один ordered byte stream, обычно в kernel; QUIC — UDP-based encrypted transport с несколькими streams, CID и path validation. Обе технологии имеют loss/congestion control; user-space реализация QUIC типична, но не его определяющее требование.

   **Типичная ошибка:** Считать QUIC protocol definition обязательным запретом kernel implementations.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

414. Что такое connection ID в QUIC?

   **Ответ:** Connection ID — идентификатор, помогающий endpoints направлять packet к connection независимо от IP/port tuple. CID может меняться и иметь нулевую длину по условиям; это не секретный authentication token.

   **Типичная ошибка:** Использовать CID как доказательство авторизации отправителя без packet protection validation.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

415. Почему connection ID полезен для мобильных клиентов?

   **Ответ:** Позволяет распознавать connection после NAT rebinding или смены адреса клиента. Для безопасного использования нового пути нужны validation и соответствующая transport policy; не вся миграция гарантированно допустима.

   **Типичная ошибка:** Считать CID способом обойти отсутствие сети или перенести connection state на произвольный сервер без coordination.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

416. Что такое streams в QUIC?

   **Ответ:** Streams — независимые ordered byte sequences внутри QUIC connection, бывают bidirectional и unidirectional. Каждый имеет stream ID, offsets и состояние; приложение задаёт message framing внутри stream при необходимости.

   **Типичная ошибка:** Считать stream одной UDP datagram либо одним неизменным packet.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

417. Чем QUIC streams отличаются от TCP byte stream?

   **Ответ:** Один TCP connection даёт один byte stream; QUIC connection multiplexes много streams с отдельными offsets и flow state. Внутри одного reliable QUIC stream порядок и HOL сохраняются.

   **Типичная ошибка:** Считать QUIC устранением любой зависимости от потерянных байтов внутри одного stream.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

418. Что такое multiplexing в QUIC?

   **Ответ:** Данные разных streams размещаются в transport frames и packets одного connection. Их scheduling и resource sharing управляются реализацией/приложением; underlying congestion capacity общая.

   **Типичная ошибка:** Считать каждый stream независимым физическим каналом с собственной bandwidth.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

419. Почему QUIC уменьшает head-of-line blocking на уровне приложения?

   **Ответ:** Loss данных одного stream не обязан блокировать выдачу уже доступных данных другого, как при общем TCP sequence stream. Но application dependencies, connection flow control и congestion могут задерживать несколько streams.

   **Типичная ошибка:** Утверждать, что потеря одного QUIC packet вообще не влияет на другие streams.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

420. Что такое 0-RTT в QUIC?

   **Ответ:** 0-RTT позволяет при resumption отправить early application data до завершения нового handshake, используя сохранённое состояние. Server может отклонить early data; есть replay risk и ограничения transport/application policy.

   **Типичная ошибка:** Отправлять replay-sensitive операции в early data без специальной защиты.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).


### Средний уровень
421. Какие преимущества QUIC даёт по latency?

   **Ответ:** Возможны более короткий setup, ранние data при resumption и меньшая межпоточная блокировка. Выигрыш зависит от RTT, losses, reuse, CPU и UDP reachability; уже тёплые connections могут отличаться мало.

   **Типичная ошибка:** Сравнивать fresh TCP+TLS с reused QUIC без учёта разного startup state.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

422. Почему объединение transport и crypto handshake ускоряет соединение?

   **Ответ:** QUIC переносит TLS handshake в transport и устанавливает защищённое состояние без отдельного предварительного TCP handshake. Это сокращает последовательные сетевые round trips в обычном fresh setup.

   **Типичная ошибка:** Считать объединение устранением server certificate validation и CPU затрат криптографии.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

423. Чем QUIC handshake отличается от TCP + TLS handshake?

   **Ответ:** TCP сначала устанавливает transport, затем обычно выполняется TLS handshake. QUIC переносит TLS messages в CRYPTO frames и согласует transport parameters вместе с security; TLS record layer для packets не используется.

   **Типичная ошибка:** Представлять QUIC как обычные TLS records поверх UDP без transport framing.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

424. Почему QUIC удобнее эволюционировать, чем TCP?

   **Ответ:** Много функций реализуется/обновляется в endpoint libraries, а шифрование снижает ossification transport fields. Изменения всё равно требуют version negotiation, совместимости и deployment tests.

   **Типичная ошибка:** Считать user-space обновление разрешением менять wire format без negotiation.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

425. Как user-space implementation помогает быстрее развивать QUIC?

   **Ответ:** Библиотеку можно обновить с приложением без замены kernel TCP stack; легче интегрировать scheduling, telemetry и protocol experiments. Цена — ответственность за security updates, timers, resources и performance.

   **Типичная ошибка:** Считать независимость от kernel отсутствием зависимости от socket APIs, UDP buffers и OS scheduling.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

426. Что такое connection migration в QUIC?

   **Ответ:** Connection migration переносит трафик существующего connection на новый network path при допустимых условиях. CID связывает состояние, path validation проверяет достижимость peer; congestion state адаптируется.

   **Типичная ошибка:** Считать migration новым connection с автоматической application replay.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

427. Почему QUIC устойчивее к смене IP/сети у клиента?

   **Ответ:** Connection identity отделена от 4-tuple, поэтому NAT rebinding/смена сети не обязательно обрывает transport. Но нужны keys/state, validation и разрешение migration; внезапная потеря connectivity всё ещё вызывает timeout.

   **Типичная ошибка:** Обещать бесшовную миграцию любого сервера и клиента при любом firewall.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

428. Как QUIC реализует надёжность поверх UDP?

   **Ответ:** Packet ACK/loss detection и stream offsets позволяют обнаруживать gaps и повторять нужную информацию. Receiver собирает ordered stream; отдельное DATAGRAM extension даёт unreliable semantics.

   **Типичная ошибка:** Считать потерю UDP datagram необратимой потерей reliable QUIC stream bytes.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [RFC 9221: QUIC DATAGRAM Extension](https://www.rfc-editor.org/rfc/rfc9221).

429. Есть ли у QUIC congestion control?

   **Ответ:** Да, QUIC должен ограничивать congestion load; RFC 9002 описывает базовый controller и loss detection. Реализации могут использовать другие совместимые алгоритмы и pacing.

   **Типичная ошибка:** Считать UDP substrate основанием отключить congestion control QUIC.

   **Источник:** [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

430. Есть ли у QUIC flow control?

   **Ответ:** Да: per-stream и connection-level byte limits регулируют reliable stream data, отдельно ограничивается создание streams. Это логические offset-based limits, а не TCP window field.

   **Типичная ошибка:** Путать MAX_DATA с текущим размером cwnd или UDP receive buffer.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

431. Как QUIC реализует retransmission?

   **Ответ:** Потерянную информацию, например STREAM ranges, пересылают в новых packets с новыми packet numbers. Не каждый frame retransmittable: ACK не просто повторяют как весь исходный packet.

   **Типичная ошибка:** Отправлять идентичный encrypted packet с прежним packet number как обычную retransmission.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

432. Почему QUIC может лучше контролировать packet loss recovery?

   **Ответ:** Уникальные transmission packet numbers и явный ACK delay помогают точнее сопоставить delivery/RTT, а endpoints могут быстрее обновлять алгоритмы. Но loss inference и reordering ambiguity не исчезают полностью.

   **Типичная ошибка:** Считать QUIC detector идеальным знанием фактической network loss.

   **Источник:** [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

433. Что такое packet number spaces в QUIC?

   **Ответ:** Отдельные spaces — Initial, Handshake и Application Data; 0-RTT и 1-RTT относятся к Application Data space. ACK/loss accounting разделяется соответствующим образом; ключевой уровень и PN space — не одно и то же.

   **Типичная ошибка:** Создавать независимые PN spaces для 0-RTT и 1-RTT.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

434. Почему QUIC шифрует большую часть transport metadata?

   **Ответ:** Packet/header protection скрывает значительную часть состояния от случайного чтения/изменения в сети и уменьшает transport ossification. Часть заголовков остаётся видимой; степень защиты зависит от packet type.

   **Типичная ошибка:** Считать весь UDP header, адреса и CID всегда скрытыми.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

435. Какие преимущества и недостатки этого для observability?

   **Ответ:** Плюсы — privacy и меньше вмешательства middleboxes. Минусы — capture не показывает TCP-подобные ACK/stream state без keys; нужны endpoint telemetry, structured logs и осторожная работа с debugging secrets.

   **Типичная ошибка:** Отключать security в production ради привычного packet inspection.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001); [IETF QUIC WG: qlog project](https://github.com/quicwg/qlog).

436. Что такое stream-level flow control в QUIC?

   **Ответ:** Receiver задаёт каждому stream максимальный offset через transport parameters/MAX_STREAM_DATA. Sender не должен превышать credit; receiver увеличивает его по своей политике освобождения ресурсов.

   **Типичная ошибка:** Считать stream limit rate limit в bytes/s вместо cumulative offset credit.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

437. Чем stream-level flow control отличается от connection-level?

   **Ответ:** Stream limit ограничивает один stream, MAX_DATA — суммарный flow-controlled объём connection по правилам offsets. Исчерпание любого применимого credit остановит соответствующую отправку даже при свободном cwnd.

   **Типичная ошибка:** Увеличивать только per-stream limit, не заметив exhausted connection credit.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

438. Как QUIC избегает HOL blocking между потоками?

   **Ответ:** Streams имеют независимые sequence offsets, поэтому gap одного не обязан задержать готовый contiguous data другого. Общие packets/cwnd/flow limits и dependencies вроде headers могут всё равно связать задержки.

   **Типичная ошибка:** Считать независимость stream ordering полной независимостью performance.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114).

439. Какие сложности внедрения QUIC в production ты знаешь?

   **Ответ:** UDP filtering, CPU/crypto cost, timer/pacing precision, load balancing по CID, PMTU, state migration и encrypted observability. Нужны версии/interop tests, fallback и resource limits.

   **Типичная ошибка:** Поменять только listener TCP/443 на UDP/443 и считать HTTP/3 migration завершённой.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114).

440. Почему middleboxes иногда мешали новым transport-протоколам?

   **Ответ:** Они могли жёстко разбирать/переписывать известные поля и отвергать незнакомые transports/options, создавая ossification. QUIC использует UDP и защищённые поля, но сам сталкивается с UDP policy.

   **Типичная ошибка:** Считать обход TCP ossification устранением всех middlebox ограничений.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).


### Продвинутый уровень
441. Почему QUIC поверх UDP не означает "без надёжности"?

   **Ответ:** UDP предоставляет перенос datagrams, QUIC поверх него реализует ACK/loss recovery, stream ordering и congestion/flow control. Необязательное QUIC DATAGRAM имеет другие гарантии.

   **Типичная ошибка:** Приравнивать reliable QUIC stream к необработанному UDP без recovery.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

442. Чем loss recovery в QUIC концептуально отличается от TCP?

   **Ответ:** TCP повторяет stream bytes с теми же sequence positions; QUIC packet number нумерует transmission, а stream offset — данные. Повторная информация идёт в новом packet, что упрощает ACK attribution.

   **Типичная ошибка:** Переносить Wireshark TCP duplicate-sequence эвристику прямо на QUIC packet numbers.

   **Источник:** [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

443. Какие преимущества даёт user-space QUIC implementation для приложений?

   **Ответ:** Ускоряет rollout алгоритмов и исправлений, даёт доступ к timers, stream priorities, backpressure и transport telemetry. Но приложение должно соблюдать library lifetime/threading и регулярно получать security fixes.

   **Типичная ошибка:** Форкнуть transport library и больше не обновлять её после первых benchmark.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

444. Какие недостатки даёт user-space QUIC по сравнению с kernel TCP?

   **Ответ:** UDP packet processing, syscalls, crypto и timers могут требовать существенного user-space CPU; kernel TCP имеет зрелые offloads и tuning. Реальная стоимость зависит от batching, platform и реализации, а не только location.

   **Типичная ошибка:** Считать user-space автоматически медленнее или быстрее в любых условиях.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

445. Как QUIC взаимодействует с NAT и firewall?

   **Ответ:** Использует UDP mappings, поэтому важны idle timers, filtering и PMTU. CID помогает rebinding, но не создаёт разрешающий firewall rule; keepalive/fallback выбирают по policy.

   **Пример:**

   ```bash
   # Linux: UDP capture видит datagrams, но не весь protected transport state.
   tcpdump -ni any -c 30 'udp port 443'
   ```

   **Типичная ошибка:** Считать успешный QUIC handshake гарантией вечного NAT mapping без idle traffic.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

446. Какие проблемы диагностики создаёт шифрование QUIC traffic?

   **Ответ:** Без endpoint keys capture обычно не раскрывает ACK, stream offsets и protected frames. Нужны transport events/metrics; Initial частично анализируем с публично выводимыми keys. Debug secrets защищают как чувствительные данные.

   **Типичная ошибка:** Считать зашифрованный capture бесполезным вообще или полностью открытым как TCP.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001); [IETF QUIC WG: qlog project](https://github.com/quicwg/qlog).

447. Как анализировать QUIC производительность без расшифровки payload?

   **Ответ:** Используют visible packet sizes/timing и endpoint telemetry: RTT, loss, cwnd, pacing, flow blocking, streams, handshake/migration events. Spin bit опционален и не даёт универсального точного RTT для любого trace.

   **Типичная ошибка:** Делать полные выводы о recovery только по внешнему UDP packet timing.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [IETF QUIC WG: qlog project](https://github.com/quicwg/qlog).

448. Почему packet capture для QUIC менее информативен, чем для TCP?

   **Ответ:** Большинство transport control fields защищено, в отличие от открытых TCP sequence/ACK/window. Размеры, endpoints и часть headers остаются видимы, но внутренние причины требуют endpoint data.

   **Типичная ошибка:** Искать незашифрованный QUIC receive window по аналогии с TCP header.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

449. Как 0-RTT влияет на безопасность?

   **Ответ:** Early data может быть воспроизведена; она имеет более слабые replay guarantees, чем обычный подтверждённый application exchange. Server/application должны ограничить допустимые операции и поддержать rejection/fallback.

   **Типичная ошибка:** Приравнивать TLS encryption к exactly-once execution early request.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

450. Какие replay risks есть у 0-RTT?

   **Ответ:** Перехваченный ранний запрос может быть повторно принят в другой попытке/точке инфраструктуры. Требуются replay-safe operations или application-level deduplication/anti-replay в согласованной архитектуре.

   **Типичная ошибка:** Отправлять неидемпотентный side effect в 0-RTT только потому, что клиент не делает retries.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

451. Когда QUIC выигрывает у TCP+TLS, а когда разница мала?

   **Ответ:** Может выиграть на cold connections, parallel independent streams, losses и migration. При reused connection, одном потоке, низком RTT либо CPU bottleneck разница мала или QUIC дороже. Нужны равные security/workload условия.

   **Типичная ошибка:** Универсально объявлять один transport быстрее без experiment design.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

452. Почему QUIC особенно интересен для web и mobile workloads?

   **Ответ:** Web использует много parallel requests, mobile — смены пути и variable loss/RTT. Multiplexing, handshake integration и migration подходят этим условиям, но application dependencies остаются.

   **Типичная ошибка:** Считать HTTP/3 устранением всех причин медленной загрузки страницы.

   **Источник:** [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

453. Какие системные вызовы и event-loop pattern обычно используются в QUIC серверах?

   **Ответ:** UDP socket, recvmsg/recvmmsg и sendmsg/sendmmsg, readiness event loop, timers и library callbacks. QUIC library сама ведёт connections/streams поверх datagrams; обычный accept TCP на каждый QUIC connection не применяется.

   **Типичная ошибка:** Ждать EPOLLOUT без обработки transport timers и задерживать recovery/pacing.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

454. Чем реализация high-performance QUIC server в C/C++ отличается от TCP server?

   **Ответ:** Кроме I/O нужно эффективно обслуживать crypto, per-connection timers, loss/pacing и stream scheduling в user-space library. Batching/offloads, CID routing и bounded state важны; kernel UDP drops надо наблюдать отдельно.

   **Типичная ошибка:** Считать UDP loop достаточным QUIC server без TLS/transport state machine.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

455. Какие библиотеки/стеки QUIC обычно рассматривают в инженерной практике?

   **Ответ:** Примеры стеков — MsQuic, ngtcp2, quiche и LSQUIC. Выбор зависит от языка/API, TLS backend, HTTP/3 integration, платформ и нужной версии. Актуальные возможности сверяют с документацией конкретного релиза.

   **Типичная ошибка:** Выбирать библиотеку только по benchmark без interop, maintenance и security update требований.

   **Источник:** [Microsoft: MsQuic documentation](https://github.com/microsoft/msquic/tree/main/docs); [ngtcp2 documentation](https://nghttp2.org/ngtcp2/); [Cloudflare: quiche](https://github.com/cloudflare/quiche); [LiteSpeed: LSQUIC documentation](https://lsquic.readthedocs.io/).

456. Какие метрики нужно собирать для QUIC сервиса?

   **Ответ:** Handshake/resumption/0-RTT acceptance, RTT/loss/PTO, delivery goodput, cwnd/pacing, flow-blocked time, stream latency, migration outcomes, CPU и UDP drops. Фиксируют версии и причины закрытия.

   **Типичная ошибка:** Считать UDP bytes/s достаточной метрикой QUIC health.

   **Источник:** [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [IETF QUIC WG: qlog project](https://github.com/quicwg/qlog).

457. Как сравнить эффективность TCP и QUIC в controlled experiment?

   **Ответ:** Одинаковые endpoints, payload, concurrency, crypto, warm/cold state и network profiles; измеряют delivered goodput, tails, CPU и errors. Включают loss/reorder/migration и UDP-blocked fallback.

   **Типичная ошибка:** Сравнить cold TCP+TLS с warm 0-RTT QUIC и приписать весь выигрыш одному congestion algorithm.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

458. Какие anti-patterns возникают при миграции с HTTP/2 на HTTP/3?

   **Ответ:** Предположение, что исчезли все HOL/dependencies, отсутствие fallback, перенос TCP tuning без смысла, потеря observability и недооценка CPU/UDP limits. HTTP priorities, QPACK и application behavior тоже требуют проверки.

   **Типичная ошибка:** Выдать HTTP/3 support за доказанный пользовательский performance gain без measurements.

   **Источник:** [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

459. Когда QUIC не даёт ожидаемой выгоды?

   **Ответ:** При CPU/crypto bottleneck, UDP filtering/loss, already reused low-RTT connections или сильных application dependencies. Также возможна неудачная library/pacing/buffer configuration.

   **Типичная ошибка:** Объяснять отсутствие выигрыша только тем, что QUIC «неправильно выбран», не локализовав bottleneck.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

460. Как объяснить выбор QUIC на архитектурном интервью?

   **Ответ:** Связывают выбор с measured workload: startup, stream independence, migration, security и reachability. Называют trade-offs CPU, tooling и rollout/fallback, затем критерии проверки SLO.

   **Типичная ошибка:** Аргументировать только популярностью HTTP/3 или лозунгом «UDP быстрее TCP».

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114).


---

## 10. Метрики: latency

### Базовый уровень
461. Что такое latency?

   **Ответ:** Latency — время между явно заданными событиями, например отправкой запроса и получением ответа. Без границ, единиц и workload число неоднозначно: network delay и end-to-end request latency различаются.

   **Типичная ошибка:** Публиковать «latency 10 ms» без указания начала/конца измерения.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

462. Чем latency отличается от delay?

   **Ответ:** В практике термины часто синонимы. Иногда delay называют задержку одного участка, latency — полное время операции; это соглашение, не универсальный закон. Определение нужно зафиксировать в метрике.

   **Типичная ошибка:** Спорить о слове вместо согласования measurement boundaries.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

463. Что такое round-trip time (RTT)?

   **Ответ:** RTT — время от отправки до возвращения связанного ответа/подтверждения. Включает прямой и обратный пути и обработку, зависящую от метода измерения.

   **Типичная ошибка:** Считать ICMP RTT точным временем только прохождения кабеля.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

464. Чем RTT отличается от one-way latency?

   **Ответ:** One-way latency измеряет одно направление; RTT — оборот туда и обратно. RTT/2 оценивает one-way только при предположении симметрии, которое часто неверно.

   **Типичная ошибка:** Делить RTT пополам и выдавать результат за измеренную задержку каждого направления.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

465. Почему one-way latency труднее измерять?

   **Ответ:** Часы отправителя и получателя должны быть сопоставимы с известной погрешностью; offset/drift и timestamp point влияют на результат. RTT можно измерять одними локальными часами.

   **Типичная ошибка:** Вычитать timestamps разных несинхронизированных hosts и считать отрицательный результат сетевым явлением.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

466. Что такое network latency?

   **Ответ:** Задержка передачи между определёнными сетевыми точками: propagation, serialization, queuing и обработка. Нужно указать, включены ли host stack, NIC и socket queues.

   **Типичная ошибка:** Приписывать network latency всё время обработки HTTP request.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

467. Какие компоненты входят в end-to-end latency?

   **Ответ:** DNS, setup/TLS, application queue, processing, network transfer, dependency calls и клиентская обработка в пределах заданной операции. Этапы могут перекрываться, поэтому сумма произвольных spans не всегда равна total.

   **Типичная ошибка:** Складывать перекрывающиеся spans и получать завышенную задержку.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

468. Что такое propagation delay?

   **Ответ:** Propagation delay — время распространения сигнала в среде, зависящее от длины пути и скорости сигнала. Увеличение link rate само по себе его не устраняет.

   **Типичная ошибка:** Считать переход с 1 на 10 Gbit/s десятикратным уменьшением географического RTT.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

469. Что такое transmission delay?

   **Ответ:** Transmission/serialization delay — время размещения битов пакета на канале, приблизительно packet_bits/link_rate. Это отличается от распространения и ожидания в очереди.

   **Типичная ошибка:** Считать serialization delay независимым от размера пакета.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

470. Что такое queuing delay?

   **Ответ:** Queuing delay — ожидание обслуживания в очереди узла/интерфейса/приложения. Меняется с нагрузкой и bursts, часто определяет tail. Большой buffer может ухудшить задержку без снижения throughput.

   **Типичная ошибка:** Измерять очередь только её лимитом, а не фактическим occupancy/wait time.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

471. Что такое processing delay?

   **Ответ:** Processing delay — время обработки на узле: parsing, routing, crypto, business logic и другие действия по выбранной границе. Очередь до начала обработки лучше учитывать отдельно.

   **Типичная ошибка:** Называть всё server residence time чистым CPU processing.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

472. Почему высокая latency ухудшает user experience?

   **Ответ:** Пользователь позже видит результат; последовательные remote round trips накапливают ожидание. Для интерактивности важны tails и failures, а не только средний удачный запрос.

   **Типичная ошибка:** Оптимизировать bulk bandwidth, когда пользователь ждёт первый небольшой ответ.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/).

473. Почему latency важна даже при высоком throughput?

   **Ответ:** Высокая скорость больших передач не убирает setup, очереди и RTT малых операций. Сервис может иметь высокие GB/s и плохой p99 response time.

   **Типичная ошибка:** Считать высокий throughput достаточным доказательством быстрого UX.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

474. Для каких приложений latency критичнее всего?

   **Ответ:** Интерактивный голос/видео, управление, игры и короткие distributed request chains. Конкретный deadline зависит от продукта и failure consequences, а не универсального числа для всех случаев.

   **Типичная ошибка:** Назначать одинаковый latency SLO media, bulk backup и управляющему циклу.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

475. Как latency влияет на TCP performance?

   **Ответ:** RTT определяет feedback cycle, setup и необходимый flight/BDP; queue variation и loss recovery добавляют задержку. Малое окно сильнее ограничивает throughput на большом RTT.

   **Типичная ошибка:** Считать latency влияющей только на handshake, но не на sustained TCP.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).


### Средний уровень
476. Как RTT влияет на handshake time?

   **Ответ:** Обычный TCP connect требует примерно одного RTT без потерь/дополнительных стадий. DNS и TLS добавляют своё время; QUIC/TFO/resumption изменяют setup. Retries могут резко увеличить tail.

   **Типичная ошибка:** Считать весь HTTP request равным одному TCP handshake RTT.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

477. Почему latency важна для request-response протоколов?

   **Ответ:** Последовательные запросы ждут сеть и peer processing каждый раз. Pipelining, multiplexing, batching и connection reuse могут сокращать последовательные round trips при сохранении semantics.

   **Типичная ошибка:** Параллелить зависимые операции без обеспечения корректного порядка.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

478. Почему высокая latency увеличивает time-to-first-byte?

   **Ответ:** TTFB включает нужные setup/lookup, путь запроса, очередь и начало ответа. Большой RTT увеличивает часть этих стадий, но server processing может доминировать независимо.

   **Типичная ошибка:** Считать TTFB точной чисто сетевой метрикой.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

479. Как congestion может увеличивать latency?

   **Ответ:** При нагрузке очереди растут, пакеты ждут, потери вызывают recovery. Даже без drops latency может ухудшиться из-за bufferbloat; нужны loaded measurements.

   **Типичная ошибка:** Искать congestion только по drop counters.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).

480. Как bufferbloat увеличивает latency?

   **Ответ:** Избыточные buffers удерживают данные долго, сохраняя bottleneck занятым и скрывая feedback. AQM/scheduling и bounded sender queues уменьшают standing delay.

   **Типичная ошибка:** Увеличивать buffer при любой проблеме latency под нагрузкой.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 8033: PIE Active Queue Management](https://www.rfc-editor.org/rfc/rfc8033).

481. Почему wireless links часто имеют variable latency?

   **Ответ:** Доступ к среде, scheduling, fading, link retries и handovers меняют service time. Поэтому одинаковый payload может иметь разные delay даже при стабильном IP route.

   **Типичная ошибка:** Считать постоянный ping interval доказательством постоянного radio transmission delay.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

482. Как retransmissions увеличивают effective latency?

   **Ответ:** Нужно дождаться обнаружения loss и восстановления; для ordered stream поздние байты блокируются gap. RTO/backoff создают особенно большие pauses; late media data может уже не помочь.

   **Типичная ошибка:** Оценивать penalty повтора только временем передачи дополнительных bytes.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

483. Как DNS lookup влияет на perceived latency?

   **Ответ:** До connect по имени часто требуется lookup; cache misses, retries и search policy добавляют ожидание. Раздельные spans DNS/connect/TLS помогают локализовать причину.

   **Типичная ошибка:** Настраивать только TCP timeout, считая DNS автоматически ограниченным тем же сроком.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

484. Как TLS handshake влияет на latency?

   **Ответ:** Crypto handshake требует CPU и сетевых exchanges, число которых зависит от версии, resumption и transport. Reuse может избежать нового handshake; 0-RTT имеет ограничения безопасности.

   **Типичная ошибка:** Считать TLS всегда фиксированными двумя RTT независимо от версии и reuse.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

485. Почему keep-alive помогает уменьшать latency?

   **Ответ:** Повторное использование connection устраняет часть DNS/setup/TLS и startup затрат следующих запросов. Idle/stale connections, лимиты peer и head-of-line dependencies требуют обработки.

   **Типичная ошибка:** Держать connection бесконечно без idle policy и recovery при peer close.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110).

486. Почему connection pooling уменьшает latency?

   **Ответ:** Pool снижает частоту setup и ограничивает concurrency. Слишком маленький pool добавляет queue wait, слишком большой — overhead/конкуренцию; измеряют pool wait отдельно.

   **Типичная ошибка:** Открывать безлимитно новые connections при каждом занятом pooled socket.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

487. Почему Nagle’s algorithm может влиять на latency?

   **Ответ:** Nagle может удерживать мелкую запись, пока есть неподтверждённые данные и не набран подходящий segment. С delayed ACK иногда увеличивает latency. TCP_NODELAY полезен по workload, но не решает framing.

   **Типичная ошибка:** Включать TCP_NODELAY как средство заставить один send соответствовать одному recv.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

488. Что такое delayed ACK и как он влияет на latency?

   **Ответ:** Receiver может ненадолго отложить ACK для сокращения overhead/совмещения. Это влияет на small exchanges и sender feedback; конкретные timers зависят от стека.

   **Типичная ошибка:** Запоминать одно значение delayed ACK timeout как обязательное для всех ОС.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

489. Когда маленькие пакеты ухудшают latency profile?

   **Ответ:** Большой PPS увеличивает syscall/interrupt/per-packet overhead и конкуренцию; мелкие writes также взаимодействуют с buffering/Nagle. Но чрезмерный batching добавит wait, поэтому оптимизируют баланс.

   **Типичная ошибка:** Делать максимальный batch без latency budget ради снижения syscalls.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

490. Как latency измерять на сервере и на клиенте?

   **Ответ:** Клиент измеряет полную операцию локальными monotonic часами; сервер отдельно queue/service/dependency stages. Для one-way network нужны сопоставимые clocks и timestamps. Незавершённые/ошибочные запросы тоже учитывают.

   **Типичная ошибка:** Сравнивать server processing p99 с client end-to-end p99 как одинаковые величины.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679); [Linux man-pages: clock_gettime(2)](https://man7.org/linux/man-pages/man2/clock_gettime.2.html).


### Продвинутый уровень
491. Как измерять latency в C/C++ приложении корректно?

   **Ответ:** Для длительностей используют std::chrono::steady_clock или monotonic clock_gettime. Границы измерения, sampling и histogram фиксируют; timestamp acquisition overhead проверяют для коротких операций.

   **Пример:**

   ```cpp
   #include <chrono>

   using Clock = std::chrono::steady_clock;

   template <class Operation>
   auto elapsed(Operation operation) {
       auto start = Clock::now();
       operation();
       return std::chrono::duration_cast<std::chrono::microseconds>(Clock::now() - start);
   }
   // Exception/error outcome и очередь учитываются отдельной политикой измерений.
   ```

   **Типичная ошибка:** Использовать wall-clock время, которое может прыгнуть из-за синхронизации, для коротких elapsed durations.

   **Источник:** [C++ draft: steady_clock](https://eel.is/c++draft/time.clock.steady); [Linux man-pages: clock_gettime(2)](https://man7.org/linux/man-pages/man2/clock_gettime.2.html).

492. Почему важно различать application latency и network RTT?

   **Ответ:** Application latency включает очереди, вычисления и зависимости; network RTT измеряет другой обмен и может не совпадать с application transport path. Разделение помогает выбрать верную оптимизацию.

   **Типичная ошибка:** Объяснять 500 ms request малым ping RTT и объявлять его impossible.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679); [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/).

493. Как clock source влияет на точность latency measurements?

   **Ответ:** Resolution, monotonicity, synchronization и timestamp point определяют погрешность. Hardware timestamps могут помочь определённым network measurements; высокая заявленная resolution не гарантирует такую же точность.

   **Типичная ошибка:** Считать наносекундный тип duration доказательством наносекундной точности измерения.

   **Источник:** [Linux man-pages: clock_gettime(2)](https://man7.org/linux/man-pages/man2/clock_gettime.2.html); [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

494. Почему percentiles важнее среднего значения?

   **Ответ:** Percentiles показывают распределение и редкие задержки, которые среднее скрывает. Среднее всё равно полезно для других оценок; выбор зависит от SLO, samples и workload.

   **Типичная ошибка:** Считать среднее бесполезным вообще либо сравнивать нестабильный p99 на десятках samples.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [HdrHistogram: coordinated omission](https://github.com/HdrHistogram/HdrHistogram).

495. Что такое p50, p95, p99 latency?

   **Ответ:** p50, p95, p99 — значения, ниже/на которых лежат примерно 50%, 95%, 99% наблюдений по принятому способу оценки. Указывают окно и population. Для high percentiles нужен достаточный sample size.

   **Типичная ошибка:** Усреднять p99 разных узлов как глобальный p99.

   **Источник:** [HdrHistogram: coordinated omission](https://github.com/HdrHistogram/HdrHistogram).

496. Почему tail latency критична для distributed systems?

   **Ответ:** Fan-out и цепочки зависимостей увеличивают вероятность, что хоть один компонент окажется медленным. Tail определяет задержку всей операции, особенно когда ждут всех участников.

   **Типичная ошибка:** Оценивать distributed request только средними значениями каждой зависимости.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/).

497. Как coordinated omission искажает latency measurements?

   **Ответ:** Если генератор перестаёт выдавать запросы во время задержки, он недосчитывает операции, которые должны были ждать. Нужны корректная arrival model и запись фактического waiting/latency, а не только completed closed-loop samples.

   **Типичная ошибка:** Считать closed-loop результат точным поведением open-loop production нагрузки без оговорок.

   **Источник:** [HdrHistogram: coordinated omission](https://github.com/HdrHistogram/HdrHistogram).

498. Как packet capture использовать для оценки latency?

   **Ответ:** Сопоставляют request/response или sequence/ACK events в одной точке, учитывают capture overhead, loss и offload. Разные hosts требуют clock synchronization; app boundaries из encrypted trace часто неизвестны.

   **Типичная ошибка:** Принимать packet timestamp за момент вызова приложения без проверки capture point.

   **Источник:** [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679); [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

499. Как tcpdump/wireshark помогают измерять RTT?

   **Ответ:** Wireshark может оценивать ACK RTT по увиденным segments; tcpdump даёт timestamps и seq для анализа. Retries, delayed ACK и неполный trace создают ambiguity; TCP_INFO даёт взгляд endpoint.

   **Пример:**

   ```bash
   ss -tin
   tcpdump -ni eth0 -tttt -S -c 40 'tcp port 8080'
   ```

   **Типичная ошибка:** Использовать ambiguous retransmission sample как точный RTT.

   **Источник:** [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

500. Как отличить high latency из-за сети от high latency из-за перегруженного сервера?

   **Ответ:** Сравнивают network RTT/loss/queues с server queue wait, CPU и processing spans. Двусторонние captures показывают, пришёл ли запрос вовремя и когда ответ ушёл. Причины могут сосуществовать.

   **Типичная ошибка:** Называть задержку server-side network только потому, что она видна клиенту.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

501. Какие метрики и логи стоит собирать для анализа latency?

   **Ответ:** Client/server histograms, errors/timeouts, offered load, queues, CPU, DNS/connect/TLS phases, RTT/retrans/rwnd и dependency spans. Correlation IDs и clocks связывают событие с transport context.

   **Типичная ошибка:** Хранить только average successful request latency и исключать timeouts из отчёта.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [HdrHistogram: coordinated omission](https://github.com/HdrHistogram/HdrHistogram).

502. Как latency budget распределяется между компонентами системы?

   **Ответ:** Общий deadline распределяют по сетевым и service этапам с запасом на variance/recovery. Параллельные операции не суммируют как последовательные; retries должны укладываться в общий budget.

   **Типичная ошибка:** Давать каждой из десяти зависимостей полный пользовательский timeout плюс неограниченные retries.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/).

503. Как проектировать transport/protocol stack для минимизации latency?

   **Ответ:** Сокращают последовательные round trips, используют connection reuse, подходящий multiplexing, bounded queues и корректные priorities. Pacing/admission control и efficient event loop помогают под нагрузкой; security/reliability сохраняют.

   **Типичная ошибка:** Отключать надёжность и проверку данных ради красивого localhost benchmark.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

504. Какие оптимизации уменьшают latency без потери надёжности?

   **Ответ:** Reuse, ограничение очередей, batching с deadline, устранение лишних copies/allocations, parallelism независимых операций и уменьшение loss. Проверяют p99, CPU и correctness вместе.

   **Типичная ошибка:** Измерять улучшение только unloaded median, скрывая рост tails под нагрузкой.

   **Источник:** [Google Research: The Tail at Scale](https://research.google/pubs/the-tail-at-scale/); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

505. Какие anti-patterns ухудшают latency в сетевых C++ сервисах?

   **Ответ:** Blocking DNS/IO в loop, unbounded queues, lock contention, синхронное heavy logging, needless reconnects и tiny writes без понимания. Профилирование связывают с реальными request timelines.

   **Типичная ошибка:** Оптимизировать syscalls, не заметив секунды application queue wait.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).


---

## 11. Метрики: jitter

### Базовый уровень
506. Что такое jitter?

   **Ответ:** Jitter — вариация задержки пакетов, а не сама средняя задержка. Нужно назвать формулу: IPDV, variation относительно minimum или RTP interarrival estimator дают разные величины.

   **Типичная ошибка:** Сравнивать «jitter» двух инструментов без проверки определения и единиц.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

507. Чем jitter отличается от latency?

   **Ответ:** Latency отвечает, сколько длится доставка/операция; jitter — насколько её delay меняется между samples. Постоянные 100 ms могут иметь малый jitter, колебания 5–100 ms — большой.

   **Типичная ошибка:** Называть большой постоянный RTT большим jitter.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

508. Почему jitter важен для real-time traffic?

   **Ответ:** Playout/управление ждут данные к определённому времени. Variation создаёт недогрузки buffers, late packets и рывки даже при достаточной средней bandwidth.

   **Типичная ошибка:** Считать средний bitrate достаточной метрикой real-time качества.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

509. Какие приложения особенно чувствительны к jitter?

   **Ответ:** Интерактивный голос/видео, игры, дистанционное управление и синхронизированное воспроизведение. Допустимая variation зависит от buffer и deadline конкретного приложения.

   **Типичная ошибка:** Назначать один общий jitter threshold всем realtime сервисам.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

510. Почему голос и видео страдают от jitter?

   **Ответ:** Пакеты приходят неравномерно и могут опоздать к playout. Буфер сглаживает часть variation, добавляя задержку; concealment и adaptation обрабатывают оставшиеся gaps.

   **Типичная ошибка:** Считать все late packets физически потерянными на IP-уровне.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

511. Может ли средняя latency быть нормальной, а качество связи — плохим из-за jitter?

   **Ответ:** Да: среднее скрывает редкие скачки, которые могут опустошать jitter buffer или нарушать deadline. Нужны distributions, burst duration и доля late arrivals.

   **Типичная ошибка:** Объявлять качество хорошим только по mean delay.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

512. Что такое packet delay variation?

   **Ответ:** Packet delay variation сравнивает задержки выбранных packets по заданному правилу. RFC 3393 определяет разность one-way delays пары; negative values допустимы, это не отрицательная физическая задержка.

   **Типичная ошибка:** Считать любую signed variation ошибкой измерителя.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

513. Как jitter воспринимается пользователем?

   **Ответ:** Как рывки, паузы/пропуски аудио, нестабильное управление или uneven frame pacing. Но похожие симптомы дают decoder/CPU issues, поэтому transport jitter надо измерить отдельно.

   **Типичная ошибка:** По одному визуальному freeze безусловно диагностировать сеть.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

514. Почему TCP приложения часто менее чувствительны к jitter, чем RTP/UDP?

   **Ответ:** Buffered non-realtime TCP приложения часто могут подождать и использовать reliable stream. Однако интерактивные TCP сервисы чувствительны к variation и HOL/recovery; меньшая чувствительность не свойство любого TCP workload.

   **Типичная ошибка:** Считать TCP приложению jitter всегда безразличным.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

515. Как jitter связан с буферизацией?

   **Ответ:** Jitter buffer обменивает добавленную задержку и память на устойчивость к variation. Слишком большая очередь сама ухудшает realtime; важно отделять полезный playout buffer от непреднамеренного bufferbloat.

   **Типичная ошибка:** Добавлять buffering на каждом слое без общего latency budget.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).


### Средний уровень
516. Какие причины jitter в сети?

   **Ответ:** Variable queues, competing traffic, wireless access/retries, route changes, batching и host scheduling. Измеритель/несинхронизированные clocks тоже могут создавать артефакты.

   **Типичная ошибка:** Считать jitter признаком исключительно беспроводной среды.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

517. Как очереди на роутерах создают jitter?

   **Ответ:** Packets ждут разное число bytes впереди себя; bursts и scheduling policy меняют wait. Даже неизменный propagation path может иметь variable queue delay.

   **Типичная ошибка:** Выводить jitter из географического расстояния без анализа queues.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

518. Как wireless medium создаёт jitter?

   **Ответ:** Доступ к общей среде, radio scheduling, rate changes, fading/retries и handover дают разное время обслуживания. End-to-end measurements желательно связывать с radio events.

   **Типичная ошибка:** Считать высокий SNR гарантией нулевого jitter на уровне приложения.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

519. Как congestion создаёт jitter?

   **Ответ:** Меняющаяся occupancy и drops/recovery создают variation. ECN/AQM/pacing могут помочь, но CPU/application queues также проверяют.

   **Типичная ошибка:** Считать любое уменьшение packet loss однозначным уменьшением jitter, игнорируя рост buffers.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).

520. Как route changes создают jitter?

   **Ответ:** Разные пути имеют разные delays; пакеты переходного периода могут reorder. Congestion и convergence добавляют временные spikes.

   **Типичная ошибка:** Усреднять весь час и не заметить короткий, но критичный migration spike.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

521. Как packet reordering может сопровождаться jitter?

   **Ответ:** Пакеты с большей задержкой обгоняются более быстрыми через другой путь/очередь. Reordering и variation связаны, но одно не доказывает другую конкретную причину.

   **Типичная ошибка:** Считать каждый out-of-order packet обязательным routing loop.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 8985: RACK-TLP Loss Detection](https://www.rfc-editor.org/rfc/rfc8985).

522. Как jitter влияет на playout buffer?

   **Ответ:** Buffer должен удерживать packets до их playout times; рост variation увеличивает риск underrun или late discard. Adaptive playout меняет target delay в рамках budget.

   **Типичная ошибка:** Ожидать, что buffer любого фиксированного размера выдержит произвольные delay spikes.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

523. Что такое jitter buffer?

   **Ответ:** Это ограниченная очередь с timestamp-based порядком/временем воспроизведения, сглаживающая неравномерный приём. Она может отбрасывать опоздавшие packets и адаптироваться по оценке variation.

   **Типичная ошибка:** Использовать обычную бесконечную FIFO как полноценный realtime jitter buffer.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

524. Как выбрать размер jitter buffer?

   **Ответ:** По распределению delay variation, допустимой late-loss доле, codec/frame rate и end-to-end deadline. Проверяют bursts и adaptive limits; универсальное число миллисекунд отсутствует.

   **Типичная ошибка:** Выбирать buffer только по среднему RTT.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

525. Почему слишком маленький jitter buffer приводит к выпадениям?

   **Ответ:** Поздние из нормального хвоста распределения packets не успевают к playout, давая gaps даже при фактической сетевой доставке. Нужно различать late discard и network loss.

   **Типичная ошибка:** Считать все underruns доказательством недостаточной bandwidth.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

526. Почему слишком большой jitter buffer увеличивает задержку?

   **Ответ:** Дополнительное ожидание входит в mouth-to-ear/control latency и может сделать разговор/управление неудобным. После конца congestion большой buffer может долго держать устаревшие данные.

   **Типичная ошибка:** Увеличивать buffer до исчезновения всех gaps, игнорируя интерактивный deadline.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

527. Как измерять jitter?

   **Ответ:** Сначала фиксируют определение и timestamp points, затем собирают delay/interarrival samples с sequence/clock-rate контекстом. Считают variation distributions или RTP estimator; interarrival variation без sender timing не всегда равна network jitter.

   **Типичная ошибка:** Называть стандартное отклонение RTT тем же самым, что RTP interarrival jitter.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

528. Какой jitter считается приемлемым для VoIP?

   **Ответ:** Зависит от codec, packetization, buffer, loss pattern и total mouth-to-ear budget. Вместо одной нормы проверяют late fraction, underruns и качество в целевых условиях; RTP jitter в timestamp units переводят корректно.

   **Типичная ошибка:** Выдавать одно универсальное пороговое число без codec и измерительного определения.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

529. Почему percentiles полезны и для jitter тоже?

   **Ответ:** Они показывают редкие variation spikes, которые среднее сглаживает. Для signed IPDV нужен осмысленный выбор magnitude/quantiles и периода; один percentile не заменяет burst statistics.

   **Типичная ошибка:** Считать p99 стабильным на очень малом sample count.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

530. Как отделить jitter сети от jitter приложения?

   **Ответ:** Сравнивают timestamps NIC/kernel/application и интервалы ожидания event loop/обработки. Нужны сопоставимые clocks и известная погрешность; arrival в recv не равен wire arrival.

   **Типичная ошибка:** Приписывать паузу worker thread сетевому jitter без kernel/NIC evidence.

   **Источник:** [Linux kernel: Timestamping](https://docs.kernel.org/networking/timestamping.html); [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).


### Продвинутый уровень
531. Как вычислять jitter программно?

   **Ответ:** Например, RTP estimator обновляет J на 1/16 разности между абсолютной interarrival variation и текущим J. Sender/receiver timestamps приводят к одному media clock rate, учитывают wraparound и source state.

   **Пример:**

   ```cpp
   #include <cmath>

   // Все величины в одной шкале media clock; wraparound уже обработан вызывающим кодом.
   double update_rtp_jitter(double jitter, double send_delta, double arrival_delta) {
       double variation = arrival_delta - send_delta;
       return jitter + (std::abs(variation) - jitter) / 16.0;
   }
   ```

   **Типичная ошибка:** Смешивать наносекунды local clock и RTP clock ticks в одной формуле.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

532. Какие timestamping подходы подходят для jitter measurement?

   **Ответ:** Monotonic application timestamps подходят для local intervals; SO_TIMESTAMPING/hardware stamps помогают отделять NIC/stack delay. One-way measurements требуют синхронизации/оценки clocks и одинаковых capture boundaries.

   **Типичная ошибка:** Считать точность CPU timestamp достаточной для сравнения часов двух hosts без sync.

   **Источник:** [Linux kernel: Timestamping](https://docs.kernel.org/networking/timestamping.html); [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

533. Как packet capture использовать для анализа jitter?

   **Ответ:** Извлекают arrival times, sender/media timestamps и sequence, учитывают capture losses, batching и offload. По одному arrival spacing нельзя отделить irregular sending от network variation.

   **Типичная ошибка:** Считать любой неровный pcap spacing доказательством неровной сети.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

534. Как визуализировать jitter distribution?

   **Ответ:** Полезны histogram/ECDF, time series и heatmap delay variation вместе с load/loss/late events. Указывают bins, окно и signed/magnitude meaning. Mean-only график скрывает bursts.

   **Типичная ошибка:** Смешивать разные paths/codecs в одной distribution без labels и получать неинтерпретируемый хвост.

   **Источник:** [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).

535. Как event loop и scheduler OS могут добавлять "ложный" jitter?

   **Ответ:** Ready packet может долго ждать запуск loop/thread; при редком чтении несколько packets возвращаются burst. Это application-observed variation, а не обязательно wire variation.

   **Типичная ошибка:** Использовать recv timestamps как hardware arrival без оговорки.

   **Источник:** [Linux kernel: Timestamping](https://docs.kernel.org/networking/timestamping.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

536. Как GC/allocations/locks в user-space могут маскироваться под network jitter?

   **Ответ:** Pauses allocator/lock/runtime откладывают reads и processing. В C++ нет обязательного GC, но custom runtimes/managed components могут его добавить. Сравнение scheduler traces и receive timestamps отделяет причины.

   **Типичная ошибка:** Объяснять любой C++ latency spike «GC», не выяснив реальную среду выполнения.

   **Источник:** [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

537. Как диагностировать, jitter вызван NIC, kernel, network path или application?

   **Ответ:** Строят последовательность hardware RX→kernel queue→socket read→processing, связывают timestamps и counters с CPU/IRQ/queue events. Изолирующие experiments помогают, но изменение offloads/affinity само меняет поведение.

   **Типичная ошибка:** Переставлять настройки сразу на всех слоях и терять причинность.

   **Источник:** [Linux kernel: Timestamping](https://docs.kernel.org/networking/timestamping.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

538. Как UDP realtime protocol должен адаптироваться к росту jitter?

   **Ответ:** Адаптирует playout budget, bitrate/packetization и recovery в пределах допустимой задержки, ограничивает queues и отбрасывает просроченное. При congestion дополнительная FEC/retry нагрузка не должна усугублять ситуацию.

   **Типичная ошибка:** Бесконечно расширять buffer/rate при ухудшении сети.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

539. Какие adaptive algorithms используют media applications?

   **Ответ:** Adaptive jitter buffers, bitrate/congestion feedback, packet-loss concealment и выбор FEC/retransmission по deadline. Конкретные algorithms зависят от codec и protocol stack, не задаются одним UDP API.

   **Типичная ошибка:** Считать один фиксированный sleep interval полноценным adaptive media control.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

540. Какие operational метрики нужны для контроля jitter в production?

   **Ответ:** Delay/variation distributions, late discard и loss отдельно, reorder/duplicates, buffer occupancy/target, underruns, bitrate и CPU scheduling pauses. Метрики привязывают к media clock и source/session.

   **Типичная ошибка:** Контролировать media SLO только average RTP jitter, исключая late loss и total latency.

   **Источник:** [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550); [RFC 3393: IP Packet Delay Variation Metric](https://www.rfc-editor.org/rfc/rfc3393).


---

## 12. Метрики: packet loss

### Базовый уровень
541. Что такое packet loss?

   **Ответ:** Packet loss — отсутствие ожидаемого пакета на выбранной границе в пределах определённого времени. Нужно назвать уровень и критерий: network loss, host drop и late application discard различаются.

   **Типичная ошибка:** Считать любой отсутствующий application response одним потерянным IP packet.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680).

542. На каком этапе пакет может потеряться?

   **Ответ:** На sender, в NIC/driver/queues, каналах и маршрутизаторах, firewall/policer, receiver stack/socket или в приложении. Последние случаи могут быть application loss, а не физическая network loss.

   **Типичная ошибка:** Искать все drops только на промежуточных routers.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

543. Почему packet loss возможен даже в "рабочей" сети?

   **Ответ:** Конечные buffers, bursts, конкуренция, wireless errors и изменения пути возможны при общей работоспособности. Наличие маршрута не даёт гарантированной доставки каждого IP packet.

   **Типичная ошибка:** Считать один loss доказательством полного сетевого отказа.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

544. Как packet loss влияет на TCP?

   **Ответ:** TCP обычно восстанавливает данные, но платит retransmission delay, HOL и изменением congestion state. При длительном отказе connection завершается ошибкой.

   **Типичная ошибка:** Считать TCP application не затронутым loss только потому, что bytes в итоге доставлены.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

545. Как packet loss влияет на UDP?

   **Ответ:** UDP не восстанавливает datagram автоматически; верхний протокол может обнаружить gap/timeout и применить retry/FEC/concealment. Без собственного feedback sender может не знать о потере.

   **Типичная ошибка:** Ожидать обязательную синхронную ошибку sendto на каждую потерю.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

546. Почему небольшая потеря может быть почти незаметна для одних приложений и критична для других?

   **Ответ:** Важны семантика, deadline, buffering, redundancy и loss pattern. Потеря обновляемого state может быть допустима, потеря control request или tail сегмента — критична.

   **Типичная ошибка:** Оценивать качество всех приложений одной средней долей loss.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

547. Что такое random loss?

   **Ответ:** Random loss обычно моделируют вероятностно распределёнными потерями, например независимым Bernoulli процессом. Это полезная модель, но реальная сеть часто имеет корреляцию.

   **Типичная ошибка:** Считать фиксированный независимый процент достаточной моделью любого mobile/outage поведения.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

548. Что такое burst loss?

   **Ответ:** Burst loss — несколько потерь, сгруппированных по времени/последовательности. Для recovery/media важны длина и интервалы bursts, а не только средняя доля.

   **Типичная ошибка:** Приравнивать два traces с одинаковым loss% и разными burst lengths.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680).

549. Почему burst loss обычно хуже random loss?

   **Ответ:** Пакеты одного recovery/FEC окна могут потеряться вместе, уменьшая feedback и recovery chances. Для media это даёт длинный gap. Но степень ущерба зависит от структуры кода, retransmission и deadlines.

   **Типичная ошибка:** Считать burst всегда строго хуже для любой схемы независимо от placement/semantics.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

550. Как packet loss воспринимается пользователем?

   **Ответ:** Как pauses, повторные загрузки, разрывы, missing updates и media artifacts. TCP может скрыть пропуск байтов, но добавить latency; UDP semantics задаёт приложение.

   **Типичная ошибка:** Считать отсутствие видимого media артефакта доказательством нулевой network loss.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).


### Средний уровень
551. Какие причины packet loss ты знаешь?

   **Ответ:** Congestion/queue overflow, radio/cable errors, driver/NIC overload, фильтрация, policing, MTU/reassembly и socket queue limits. Потерю измерительного capture проверяют отдельно.

   **Типичная ошибка:** Сводить все причины к «плохому интернету» без локализации участка.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

552. Как congestion вызывает packet loss?

   **Ответ:** При избыточном arrival rate очередь может заполниться либо AQM намеренно отбрасывает packet для feedback. Sender должен снизить нагрузку; увеличение buffers может заменить loss задержкой.

   **Типичная ошибка:** Считать отсутствие drops после увеличения queue доказательством улучшения всех SLO.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

553. Как buffer overflow вызывает packet loss?

   **Ответ:** Если новый packet не помещается в ограниченный buffer, он или другой выбранный packet отбрасывается. Важно знать queue type, policy и counters; это может быть NIC ring, qdisc или socket.

   **Типичная ошибка:** Ожидать один общий counter для всех buffer overflow на хосте.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

554. Как плохой wireless signal вызывает packet loss?

   **Ответ:** Ошибки декодирования и исчерпанные link-layer retries могут привести к end-to-end loss; успешные retries вместо потери добавляют delay. Высокий RSSI сам по себе не исключает interference.

   **Типичная ошибка:** Считать каждый IP loss напрямую равным одному radio transmission failure.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

555. Как faulty NIC/cable/driver может вызывать loss?

   **Ответ:** Физические errors, RX/TX ring issues, resets, firmware/driver defects и missed processing могут терять packets. Используют link/device counters и logs с временем; причинность требует корреляции.

   **Типичная ошибка:** Менять driver только из-за bad checksum в pre-offload capture.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

556. Как ACL/firewall/policer могут выглядеть как packet loss?

   **Ответ:** Намеренный drop или policer превышения rate для приложения выглядит как отсутствие delivery. Проверяют rule counters, direction, marks и state; это не физическая ошибка линии.

   **Типичная ошибка:** Проверять только CRC errors и исключать фильтрацию при нулевом значении.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html); [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680).

557. Как MTU black hole выглядит для приложения?

   **Ответ:** Маленькие exchanges проходят, большие зависают/теряются, а ICMP PMTU feedback отсутствует или не обрабатывается. Особенно типично после tunnels. Нужна проверка размеров/path, а не только маленького ping.

   **Типичная ошибка:** Считать успешный TCP handshake доказательством возможности передать большой TLS flight.

   **Источник:** [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

558. Как packet loss влияет на throughput TCP?

   **Ответ:** Loss вызывает повторную работу, паузы recovery и congestion response, снижая unique goodput. Зависимость нелинейна и зависит от RTT, algorithm и pattern.

   **Типичная ошибка:** Вычитать loss% из nominal bandwidth как точную оценку TCP throughput.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298).

559. Почему 1% loss может сильно снизить производительность некоторых TCP flows?

   **Ответ:** На высоком RTT/BDP частые congestion reductions или RTO затрудняют удержание большого flight. Эффект зависит от algorithm, pattern и workload; 1% не означает ровно 1% снижения скорости.

   **Типичная ошибка:** Обещать одну универсальную формулу скорости для всех TCP variants.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 9438: CUBIC for Fast and Long-Distance Networks](https://www.rfc-editor.org/rfc/rfc9438).

560. Как packet loss влияет на latency и jitter?

   **Ответ:** Recovery добавляет переменные паузы, а missing feedback может вызвать backoff. Realtime playout/FEC тоже влияет на variation; latency histogram и loss events анализируют вместе.

   **Типичная ошибка:** Считать loss и jitter независимыми эксплуатационными симптомами во всех случаях.

   **Источник:** [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

561. Почему retransmissions скрывают loss от приложения, но не бесплатно?

   **Ответ:** Приложение получает восстановленный stream, но позже и с расходом bandwidth/CPU; ordered delivery может задержать последующие bytes. При окончательном fail всё равно будет ошибка.

   **Типичная ошибка:** Называть retransmitted bytes бесплатной гарантией доставки.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

562. Как packet loss измеряется?

   **Ответ:** Считают ожидаемые и полученные unique packets на определённых границах/интервале и задают timeout loss threshold. Sequence gaps требуют учёта reorder, duplicates, restart и capture loss.

   **Типичная ошибка:** Объявлять gap потерей до истечения выбранного reorder/deadline окна.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680).

563. Чем active measurement отличается от passive measurement?

   **Ответ:** Active measurement генерирует контрольный traffic; passive наблюдает существующий traffic/counters. Активный probe может идти иначе и влиять на нагрузку, passive ограничен видимостью и идентификацией.

   **Типичная ошибка:** Считать ICMP probe точным представлением любого application flow.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

564. Когда `ping` полезен для оценки loss, а когда недостаточен?

   **Ответ:** Ping полезен для базовой ICMP reachability/loss/RTT, но ICMP может фильтроваться/ограничиваться и отличаться от TCP/UDP data path. Промежуточные hops могут отвечать реже, продолжая нормально forward.

   **Пример:**

   ```bash
   ping -c 20 192.0.2.10  # Учебный destination: замените на свой тестовый узел.
   ```

   **Типичная ошибка:** По loss ответов промежуточного hop без loss на destination объявлять transit packet loss.

   **Источник:** [ping(8)](https://man7.org/linux/man-pages/man8/ping.8.html).

565. Как packet capture помогает анализировать loss?

   **Ответ:** Два корректных capture points позволяют увидеть, где конкретный packet исчез/задержался. Учитывают filters, offload, snaplen и capture drops; retransmission label сам по себе не локализует потерю.

   **Типичная ошибка:** Сравнивать packet counts без учёта retransmissions, GRO и различающихся фильтров.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html); [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).


### Продвинутый уровень
566. Как отличить true network loss от packet drop в host stack?

   **Ответ:** Сверяют external/NIC receive, stack/socket counters и application read. Пакет мог прийти к NIC, но не пройти ring/stack/queue. Требуются наблюдения до и после предполагаемой границы потери.

   **Типичная ошибка:** Принимать наличие packet в локальном tcpdump за гарантию application delivery.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

567. Как UDP receive queue overflow проявляется как loss?

   **Ответ:** Новая datagram отбрасывается при нехватке receive queue; parser видит gap, но packet мог быть виден на capture. SO_RXQ_OVFL и UDP counters помогают подтвердить socket-level drop.

   **Типичная ошибка:** Пытаться исправить медленный reader только retransmission на sender без rate control.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

568. Как ring buffer NIC может приводить к drops?

   **Ответ:** RX descriptors/buffers могут исчерпаться быстрее обслуживания, особенно при bursts и CPU pressure. Device counters и IRQ/softirq context помогают; увеличение ring имеет memory/latency trade-offs.

   **Типичная ошибка:** Проверять только средний CPU и пропускать перегрузку одного RX queue core.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

569. Какие Linux counters полезны для анализа loss?

   **Ответ:** NIC missed/error/drop counters, ip link, qdisc drops, UDP/TCP stack counters и per-socket state. Значения зависят от driver/kernel, а cumulative counts анализируют delta за одинаковый интервал.

   **Пример:**

   ```bash
   ip -s link show dev eth0
   tc -s qdisc show dev eth0
   ethtool -S eth0
   nstat -az
   ss -tinm
   ```

   **Типичная ошибка:** Складывать все drop counters как независимые потери, хотя некоторые отражают один и тот же packet.

   **Источник:** [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

570. Как `netstat -s`, `ss`, `ip -s link` помогают при диагностике?

   **Ответ:** netstat -s/nstat показывают stack aggregates, ss — socket state/queues, ip -s link — интерфейсные counters. Они дополняют capture, но не дают автоматически одну root cause.

   **Типичная ошибка:** Считать нулевой interface dropped гарантией отсутствия socket receive overflow.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

571. Как определить, loss происходит на пути туда или обратно?

   **Ответ:** Нужны timestamps/sequence и captures/feedback на обеих сторонах; data и ACK могут теряться независимо. Один timeout/RTT probe не определяет направление.

   **Типичная ошибка:** По TCP retry однозначно заключать, что потерялся data на прямом пути, исключая ACK.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 6298: Computing TCP Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298); [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680).

572. Почему asymmetric path усложняет анализ loss?

   **Ответ:** Обратный traffic может проходить другие устройства и policy, поэтому одна точка не видит весь обмен. Stateful firewall и rp_filter добавляют зависимости; анализируют forward/reverse paths отдельно.

   **Типичная ошибка:** Считать отсутствие ACK на одном интерфейсе доказательством его отсутствия во всей сети.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

573. Как ECN помогает уменьшать loss?

   **Ответ:** ECN помечает congestion вместо части drops, а endpoint снижает load. Он не устраняет physical errors и не гарантирует нулевой loss; при перегрузке drops всё ещё возможны.

   **Типичная ошибка:** Включить ECN только в sender и считать весь путь end-to-end настроенным без negotiation/support.

   **Источник:** [RFC 3168: Explicit Congestion Notification](https://www.rfc-editor.org/rfc/rfc3168).

574. Как AQM помогает уменьшать loss and latency?

   **Ответ:** AQM ограничивает устойчивые queues и сигнализирует congestion через mark/drop раньше полного overflow. Он может намеренно увеличить ранние drops, улучшив latency/goodput; обещать уменьшение каждого drop counter неверно.

   **Типичная ошибка:** Считать любой AQM drop неисправностью, которую нужно убрать максимальным buffer.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 8033: PIE Active Queue Management](https://www.rfc-editor.org/rfc/rfc8033).

575. Как FEC помогает бороться с packet loss в UDP приложениях?

   **Ответ:** Избыточные данные позволяют восстановить часть erasures без RTT ожидания. Код имеет предел, а burst structure и block delay важны. Дополнительный rate должен оставаться congestion-safe.

   **Типичная ошибка:** Повысить FEC overhead при перегруженном пути без уменьшения payload rate.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

576. Когда retransmission лучше FEC, а когда наоборот?

   **Ответ:** Retry экономит redundancy при редких потерях, если RTT и deadline допускают. FEC даёт recovery без запроса, но расходует rate заранее и имеет coding delay. Гибриды выбирают по measured loss/deadline.

   **Типичная ошибка:** Считать FEC всегда latency-free или retransmission всегда слишком медленным.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

577. Как проектировать приложение, устойчивое к packet loss?

   **Ответ:** Используют deadlines, ограниченные retries с backoff/jitter, idempotency/deduplication, bounded queues и адаптацию нагрузки. Выбирают готовый transport по семантике; failure outcome логируют явно.

   **Типичная ошибка:** Бесконечно retry-ить неидемпотентные команды и создавать дубли side effects.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

578. Какие метрики потерь надо собирать на transport и application уровне?

   **Ответ:** Transport: loss/retrans/RTO/ECN и recovery delay; application: missing/late/duplicate/rejected messages, successful outcomes и deadline failures. Не смешивают wire transmission count и unique delivery.

   **Типичная ошибка:** Считать все application losses равными TCP retransmissions.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

579. Когда packet loss является нормой, а когда это инцидент?

   **Ответ:** Сравнивают baseline, SLO, burst pattern и recovery impact. Ожидаемые occasional losses допустимы, sustained growth, error budget burn и критичные tail spikes требуют действий. Единого нормы loss% нет.

   **Типичная ошибка:** Игнорировать деградацию только потому, что общий процент кажется небольшим.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

580. Как делать root-cause analysis packet loss в production сети?

   **Ответ:** Фиксируют symptom/time/endpoints, сохраняют captures/counters/config, находят первый участок расхождения и проверяют гипотезу контролируемым изменением. Отдельно учитывают measurement loss; после fix подтверждают SLO на похожей нагрузке.

   **Типичная ошибка:** Менять много sysctl одновременно и объявлять root cause по одному удачному повторному тесту.

   **Источник:** [RFC 7680: A One-Way Loss Metric](https://www.rfc-editor.org/rfc/rfc7680); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).


---

## 13. Метрики: throughput

### Базовый уровень
581. Что такое throughput?

   **Ответ:** Throughput — фактический объём работы/данных за единицу времени на заданной границе. Указывают payload/wire bytes, bit/s или byte/s, interval и successful outcomes.

   **Типичная ошибка:** Сравнивать bytes/s одного уровня с bits/s другого без преобразования и пояснений.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

582. Чем throughput отличается от bandwidth?

   **Ответ:** Bandwidth может обозначать доступную/номинальную ёмкость пути, throughput — измеренную скорость передачи. Фактический результат ниже capacity из-за overhead, windows, конкуренции и ресурсов endpoints.

   **Типичная ошибка:** Считать скорость NIC точным end-to-end throughput.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

583. Чем throughput отличается от goodput?

   **Ответ:** Goodput считает уникальные полезные данные, throughput может включать headers, repeats и другие bytes выбранного уровня. Без определения границы сравнение неоднозначно.

   **Типичная ошибка:** Считать retransmission traffic приростом полезной скорости сервиса.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

584. Почему nominal link speed не равна реальному throughput?

   **Ответ:** Служебные поля и interframe overhead расходуют линию; влияют protocol startup, RTT/loss, queues, CPU и удалённый bottleneck. Номинал — ограничение одного участка, не гарантия всего пути.

   **Типичная ошибка:** Ожидать ровно 1 GB/s payload от 1 Gbit/s интерфейса.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

585. Какие факторы ограничивают throughput?

   **Ответ:** Path capacity, RTT/BDP, rwnd/cwnd, loss, congestion, CPU/crypto, memory copies, syscall/PPS и supply/consumer приложения. Определяют активный bottleneck, а не настраивают всё сразу.

   **Типичная ошибка:** Увеличивать socket buffers при CPU-limited encryption без measurements.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

586. Как RTT влияет на achievable throughput?

   **Ответ:** При ограниченном flight скорость примерно ограничена window/RTT; startup/recovery также медленнее на большом RTT. Для одного rate нужен больший BDP. Другие алгоритмы/ограничения меняют точный результат.

   **Типичная ошибка:** Экстраполировать localhost throughput на WAN без RTT.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

587. Как packet loss влияет на throughput?

   **Ответ:** Повторы расходуют capacity и меняют congestion rate, UDP может терять useful delivery при высоком sender rate. Pattern и recovery time важнее простой линейной поправки.

   **Типичная ошибка:** Считать UDP sender throughput delivered goodput при loss.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

588. Почему protocol overhead снижает useful throughput?

   **Ответ:** Headers, ACKs, handshakes, encryption tags и framing занимают bytes/CPU сверх payload. Их доля зависит от packet/message size и protocol state.

   **Типичная ошибка:** Считать восьмибайтный UDP header единственным wire overhead UDP приложения.

   **Источник:** [RFC 768: User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

589. Почему TCP и UDP могут давать разный effective throughput?

   **Ответ:** У них разные гарантии и feedback: TCP ограничивает нагрузку и восстанавливает stream, UDP может отправить быстрее, но потерять большую часть. Честное сравнение требует одинаковой полезной семантики и учёта delivery.

   **Типичная ошибка:** Выбирать UDP по красивому sender Mbps без receiver stats.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

590. Как размер окна влияет на throughput?

   **Ответ:** Effective rwnd/cwnd ограничивает bytes in flight; при недостатке окна даже быстрый путь простаивает между ACK. Увеличение окна сверх другого bottleneck не даст пропорционального прироста.

   **Типичная ошибка:** Считать размер local send buffer единственным TCP window.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).


### Средний уровень
591. Что такое bandwidth-delay product?

   **Ответ:** Bandwidth-delay product — rate × RTT, ориентир объёма flight для насыщения пути. При 1 Gbit/s и 20 ms получается около 2,5 MB, без дополнительного queue budget.

   **Типичная ошибка:** Перепутать ms с s или bits с bytes и завысить buffer на порядки.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

592. Почему BDP важен для high-throughput TCP?

   **Ответ:** На большом BDP нужны достаточные windows/flight и алгоритм роста, иначе sender не держит путь занятым. BDP не означает, что нужно столько же лишней standing queue.

   **Типичная ошибка:** Добавлять BDP в каждый промежуточный queue сверх уже достаточного flight.

   **Источник:** [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).

593. Как недостаточный receive window ограничивает throughput?

   **Ответ:** Если rwnd ниже необходимого flight, sender ждёт ACK/window updates, ограничивая rate примерно rwnd/RTT при прочих равных. Проверяют scaling и consumer read speed.

   **Типичная ошибка:** Лечить receiver-limited flow только сменой sender congestion algorithm.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 7323: TCP Extensions for High Performance](https://www.rfc-editor.org/rfc/rfc7323).

594. Как congestion window ограничивает throughput?

   **Ответ:** Алгоритм CC ограничивает outstanding data по оценке congestion; слишком малый cwnd/startup/recovery снижает rate. Но cwnd может быть большим, а bottleneck — receiver/app/CPU.

   **Типичная ошибка:** По одному большому cwnd объявлять путь полностью насыщенным.

   **Источник:** [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

595. Как small writes ухудшают throughput?

   **Ответ:** Повышают syscall/locking/copy overhead, могут взаимодействовать с Nagle/ACK и создавать мелкие packets. writev, buffering и bounded batching помогают, если сохраняют latency requirements.

   **Типичная ошибка:** Накапливать данные бесконечно ради большого write и нарушать response deadline.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

596. Как syscall overhead влияет на throughput?

   **Ответ:** Частые переходы и per-call работа расходуют CPU при высоком PPS. Batching/vector I/O снижает overhead, но measured benefit зависит от payload, offloads и bottleneck.

   **Типичная ошибка:** Оптимизировать число syscalls, когда процесс ждёт сеть/rwnd и CPU свободен.

   **Источник:** [Linux man-pages: recvmmsg(2)](https://man7.org/linux/man-pages/man2/recvmmsg.2.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

597. Как copy overhead влияет на throughput?

   **Ответ:** Копирование расходует memory bandwidth/CPU/cache, особенно при больших потоках. Но на малых messages или crypto/network bottleneck оно может не быть главным ограничением.

   **Типичная ошибка:** Предполагать, что любая copy removal обязательно увеличит end-to-end throughput.

   **Источник:** [Linux man-pages: sendfile(2)](https://man7.org/linux/man-pages/man2/sendfile.2.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

598. Почему zero-copy техники могут улучшить throughput?

   **Ответ:** Они могут убрать лишний перенос через user space и уменьшить CPU/memory pressure. Важны lifetime buffers, API semantics и TLS/offload compatibility; «zero-copy» не всегда означает отсутствие любых копий на всём пути.

   **Типичная ошибка:** Освобождать buffer до completion выбранного zero-copy API.

   **Источник:** [Linux man-pages: sendfile(2)](https://man7.org/linux/man-pages/man2/sendfile.2.html); [Linux man-pages: splice(2)](https://man7.org/linux/man-pages/man2/splice.2.html).

599. Как MTU влияет на throughput?

   **Ответ:** Большие packets уменьшают per-payload header/PPS overhead, но требуют path support и влияют на serialization/latency. Неверная MTU создаёт errors/black holes, а TCP MSS/segmentation адаптируются по правилам стека.

   **Типичная ошибка:** Менять MTU только на одном endpoint без проверки всего пути.

   **Источник:** [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

600. Почему jumbo frames могут повышать throughput?

   **Ответ:** При поддержке всех участков jumbo снижает PPS и долю headers для bulk workloads. Эффект зависит от CPU/NIC/offloads и payload; гарантии прироста нет.

   **Типичная ошибка:** Считать local jumbo MTU автоматической поддержкой internet path.

   **Источник:** [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

601. Когда jumbo frames вредны или бесполезны?

   **Ответ:** При несовместимом MTU возникают drops/PMTU issues; при малых messages или другом bottleneck выгоды нет. Большая serialization может мешать latency-sensitive соседям по очереди.

   **Типичная ошибка:** Включать jumbo как универсальную оптимизацию без interop и loaded-latency тестов.

   **Источник:** [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201); [Linux kernel: Segmentation Offloads](https://docs.kernel.org/networking/segmentation-offloads.html).

602. Как packet pacing влияет на throughput?

   **Ответ:** Сглаживает bursts и может уменьшить loss, сохраняя useful throughput. Слишком низкий rate/неточный timer ограничит скорость; оценивают pacing вместе с CC, qdisc и NIC batching.

   **Типичная ошибка:** Путать pacing с обязательным sleep после каждого send независимо от требуемого rate.

   **Источник:** [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

603. Как CPU bottleneck ограничивает throughput?

   **Ответ:** CPU может не успевать crypto, parsing, packet handling и syscalls, создавая queue/drop и потолок delivery. Один core может быть насыщен при низкой общей загрузке.

   **Типичная ошибка:** Считать 20% общего CPU доказательством отсутствия CPU bottleneck на одном RX/event-loop core.

   **Источник:** [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [Linux kernel: Scaling in the Networking Stack](https://docs.kernel.org/networking/scaling.html).

604. Как single-threaded event loop может ограничивать throughput?

   **Ответ:** Один loop последовательно выполняет callbacks, parsing и timers; heavy task задерживает остальные connections. Помогают work partitioning и bounded callbacks с сохранением ownership и ordering.

   **Типичная ошибка:** Перенести всё в неограниченный thread pool и получить contention/queue explosion.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

605. Почему throughput нужно анализировать вместе с latency?

   **Ответ:** Большие buffers/batches/concurrency могут повысить GB/s ценой p99, памяти и failures. Выбирают область устойчивой нагрузки под SLO, а не только максимальную точку saturation.

   **Типичная ошибка:** Объявлять оптимизацию успешной при throughput +5% и tail latency ×10 без оценки целей.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289).


### Продвинутый уровень
606. Как измерять throughput корректно?

   **Ответ:** Задают границу/единицы, длительность, нагрузку и успешный delivered payload. Проверяют warmup/startup, loss, CPU endpoints и повторы; повторяют репрезентативные независимые runs, если variability существенна.

   **Пример:**

   ```bash
   # В разрешённой лаборатории; receiver iperf3 -s запущен отдельно.
   iperf3 -c 192.0.2.10 -t 30
   iperf3 -c 192.0.2.10 -R -t 30  # Отдельный тест обратного направления.
   ```

   **Типичная ошибка:** Измерять только скорость enqueue в socket buffer.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

607. Почему короткие тесты часто дают ложные выводы о throughput?

   **Ответ:** Setup, slow start, caches и краткие bursts доминируют; отдельные steady-state режимы могут не успеть проявиться. Для short-request продукта startup важен сам по себе, поэтому результаты не просто выбрасывают.

   **Типичная ошибка:** Использовать секундный bulk тест как универсальный sustained capacity estimate.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

608. Как slow start и handshake искажают результаты коротких тестов?

   **Ответ:** Handshake требует времени без payload, slow start наращивает flight; в коротком тесте среднее ниже steady-state. Это реальная часть short-flow workloads, но не показатель предела длительной передачи.

   **Типичная ошибка:** Сравнивать протоколы, исключив startup у одного и включив у другого.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 5681: TCP Congestion Control](https://www.rfc-editor.org/rfc/rfc5681).

609. Как iperf-подобные тесты отличаются от реальной нагрузки?

   **Ответ:** iperf измеряет synthetic bulk flow с выбранными параметрами, а сервис может иметь parsing, TLS, dependencies, small records и deadlines. Он полезен для path baseline, но не заменяет application benchmark.

   **Типичная ошибка:** Гарантировать production RPS по одному iperf Mbps.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

610. Как оценить throughput на уровне приложения, а не только сокета?

   **Ответ:** Считают unique useful payload или успешно завершённые операции за monotonic interval на нужной стороне. Retries/duplicates/errors отдельно; сравнивают offered, accepted и completed work.

   **Типичная ошибка:** Считать неуспешные retries дополнительной бизнес-производительностью.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

611. Почему bytes written в сокет не равны bytes delivered peer application?

   **Ответ:** Write success означает принятие local stack, не peer application read/process. Buffers и network errors могут задержать/потерять дальнейший прогресс; нужен receiver/application acknowledgement для соответствующей гарантии.

   **Типичная ошибка:** Считать сумму send return values доказанной удалённой полезной доставкой.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

612. Как TLS/QUIC encryption overhead влияет на throughput?

   **Ответ:** Crypto и authentication tags/framing добавляют CPU/bytes; batching, hardware acceleration и implementation меняют cost. QUIC также ведёт transport в типичном user-space stack, поэтому bottleneck измеряют комплексно.

   **Типичная ошибка:** Приписывать всю разницу throughput шифрованию без profiling и одинаковых security settings.

   **Источник:** [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

613. Как NUMA / CPU affinity / IRQ affinity влияют на throughput?

   **Ответ:** Удалённая NUMA память, cache movement и неудачное распределение IRQ/RSS/workers увеличивают cost. Affinity помогает при подтверждённом bottleneck, но чрезмерное закрепление может ухудшить balance.

   **Типичная ошибка:** Копировать настройки affinity с чужой машины без топологии CPU/NIC.

   **Источник:** [Linux kernel: Scaling in the Networking Stack](https://docs.kernel.org/networking/scaling.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

614. Как batching syscalls повышает throughput?

   **Ответ:** Vector/batch APIs амортизируют per-call cost, например sendmmsg/recvmmsg для datagrams и writev/sendmsg для buffers. Обрабатывают partial batches и ограничивают batch wait для latency/fairness.

   **Типичная ошибка:** Ждать заполнения максимального batch, когда готов один срочный ответ.

   **Источник:** [Linux man-pages: recvmmsg(2)](https://man7.org/linux/man-pages/man2/recvmmsg.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

615. Как sendfile/splice/io_uring могут влиять на throughput?

   **Ответ:** sendfile передаёт file data без обычного user-space bounce, splice работает через pipe, io_uring организует submissions/completions. Они различаются контрактами и ограничениями; async не равно zero-copy, а gain зависит от workload.

   **Типичная ошибка:** Считать io_uring автоматическим устранением копий и всех syscall overhead в любой конфигурации.

   **Источник:** [Linux man-pages: sendfile(2)](https://man7.org/linux/man-pages/man2/sendfile.2.html); [Linux man-pages: splice(2)](https://man7.org/linux/man-pages/man2/splice.2.html); [Linux man-pages: io_uring(7)](https://man7.org/linux/man-pages/man7/io_uring.7.html).

616. Какие perf counters и system metrics полезны при анализе throughput?

   **Ответ:** CPU cycles/instructions, cache misses, context switches, per-core usage, IRQ/softirq, memory bandwidth, NIC/PPS/drops, socket queues и delivery/rwnd/cwnd. Sampling overhead и scope измерения фиксируют.

   **Пример:**

   ```bash
   # Linux: права/доступность perf зависят от системы.
   perf stat -p 1234 -e cycles,instructions,cache-misses,context-switches -- sleep 10
   ss -tinm
   ethtool -S eth0
   ```

   **Типичная ошибка:** Объяснять сетевой предел одним aggregate CPU% без per-core и queue data.

   **Источник:** [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux kernel: Scaling in the Networking Stack](https://docs.kernel.org/networking/scaling.html).

617. Как понять, bottleneck в сети, ядре, приложении или удалённой стороне?

   **Ответ:** Сопоставляют supply/consume rate, CPU, queues, network counters и TCP/QUIC state, затем изменяют один фактор. Увеличение network capacity без эффекта и насыщенный core — evidence CPU, а не абсолютное доказательство без проверки.

   **Типичная ошибка:** Начинать с массового sysctl tuning без измерения bottleneck.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

618. Когда имеет смысл жертвовать throughput ради latency?

   **Ответ:** Когда продукту важнее deadline/tail, например interactive requests/media. Меньше batching, bounded concurrency и admission могут снизить peak rate, сохранив полезный completed throughput под SLO.

   **Типичная ошибка:** Считать throughput потерей без учёта снижения failed/late work.

   **Источник:** [RFC 8289: Controlled Delay Active Queue Management](https://www.rfc-editor.org/rfc/rfc8289); [RFC 3550: RTP](https://www.rfc-editor.org/rfc/rfc3550).

619. Когда высокий throughput — ложная цель для приложения?

   **Ответ:** Если считаются ненужные bytes, retries, backlog или операции после deadline. Для сервиса важнее полезные успешные результаты при требуемой latency/стоимости.

   **Типичная ошибка:** Оптимизировать поток логов/повторов, увеличивая Mbps при ухудшении пользовательских операций.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

620. Как проектировать C/C++ сервис для стабильного throughput под нагрузкой?

   **Ответ:** Ограничивают queues/concurrency, задают backpressure, эффективно используют I/O/ownership, profiles и resource budgets. Проверяют saturation, recovery и long-run memory, а не только peak happy-path benchmark.

   **Типичная ошибка:** Достигнуть краткого максимума и игнорировать неустойчивый рост очередей и ошибок.

   **Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource); [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).


---

## 14. Сквозные вопросы по TCP/UDP/QUIC

### Сравнение протоколов
621. Когда выбрать TCP, когда UDP, когда QUIC?

   **Ответ:** TCP — mature reliable stream и широкая совместимость; UDP — datagrams/multicast с нужной логикой выше; QUIC — secure multiplexed streams, migration и гибкое transport integration. Выбирают по semantics, SLO, reachability и стоимости эксплуатации.

   **Типичная ошибка:** Считать низкую latency достаточным основанием всегда выбрать raw UDP.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

622. Почему QUIC не является просто "UDP с шифрованием"?

   **Ответ:** Кроме packet protection QUIC реализует reliable streams, offsets, ACK/loss detection, CC, flow limits, connection IDs и migration. UDP лишь переносит datagrams.

   **Типичная ошибка:** Добавить TLS-like encryption к sendto и назвать результат совместимым QUIC.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001).

623. Почему TCP всё ещё доминирует во многих системах?

   **Ответ:** Он широко поддержан ОС, библиотеками, инфраструктурой и приложениями, имеет mature diagnostics/offloads и удобную stream модель. Это инженерские преимущества, но для новой задачи альтернативы всё равно оценивают.

   **Типичная ошибка:** Считать распространённость доказательством лучшего performance при любом workload.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).

624. Когда custom protocol поверх UDP оправдан, а когда нет?

   **Ответ:** Оправдан при особых datagram/deadline/multicast требованиях и ресурсе на security, CC и interop. Если нужны стандартные reliable secure streams, готовый TCP/TLS/QUIC часто уменьшает риск.

   **Типичная ошибка:** Разрабатывать новый transport ради экономии TCP header, не учитывая overhead собственных гарантий.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

625. Когда HTTP/3 реально даёт выигрыш?

   **Ответ:** При существенных setup/parallel-stream/loss/migration costs и хорошем UDP/CPU path. HTTP/3 не ускорит автоматически slow backend, blocking application и зависимые serial requests.

   **Типичная ошибка:** Выдавать negotiated h3 за измеренный пользовательский выигрыш.

   **Источник:** [RFC 9114: HTTP/3](https://www.rfc-editor.org/rfc/rfc9114); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

626. Какие ограничения у TCP в современных web/mobile сценариях?

   **Ответ:** 4-tuple затрудняет обычную migration, один ordered stream создаёт transport HOL для multiplexed records, а отдельный TLS setup может добавлять startup. Extensions и connection reuse смягчают часть ограничений.

   **Типичная ошибка:** Считать TCP безусловно непригодным mobile transport или всякое HTTP/2 торможение следствием TCP.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 9113: HTTP/2](https://www.rfc-editor.org/rfc/rfc9113); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

627. Когда UDP — плохой выбор, даже если нужна низкая latency?

   **Ответ:** Когда нужны полная доставка/ordering/security, но нет готовой реализации этих функций, либо UDP плохо достижим. Low-latency цель не отменяет congestion и correct failure semantics.

   **Типичная ошибка:** Экономить RTT, отказываясь от обязательного подтверждения критичной команды.

   **Источник:** [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

628. Как NAT/firewall влияет на TCP, UDP и QUIC по-разному?

   **Ответ:** TCP state легче распознаётся middleboxes; UDP mappings часто имеют иные timers и может блокироваться/rate-limit. QUIC наследует UDP path constraints, но CID/path validation помогают rebinding. Политика конкретной сети важнее стереотипа.

   **Типичная ошибка:** Считать любой UDP/443 гарантированно пропускаемым как TCP/443.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

629. Какие протоколы проще отлаживать в production?

   **Ответ:** TCP часто удобнее видимыми sequence/ACK/windows и mature tools. QUIC требует endpoint telemetry для protected state; UDP custom нуждается в собственных IDs/logging. TLS/application payload тоже может быть скрыт у TCP.

   **Типичная ошибка:** Считать открытый transport header полной наблюдаемостью прикладного обмена.

   **Источник:** [Wireshark User’s Guide: TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html); [RFC 9001: Using TLS to Secure QUIC](https://www.rfc-editor.org/rfc/rfc9001); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

630. Какие протоколы проще масштабировать?

   **Ответ:** Масштабирование зависит от connection/state, PPS, crypto, batching, load balancing и workload. UDP без гарантий может иметь мало state, но надстройка добавляет его; QUIC streams не дают бесплатного бесконечного concurrency.

   **Типичная ошибка:** Выбирать «самый масштабируемый» transport без resource model и test conditions.

   **Источник:** [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html).


### C/C++ / Linux / sockets
631. Как реализовать простой TCP echo server на C?

   **Ответ:** Создают TCP listener на loopback, bind/listen, accept возвращает client socket; читают stream и дописывают ровно принятые bytes с partial-write handling. Учебный blocking server не является production multi-client архитектурой.

   **Пример:**

   ```c
   #include <sys/socket.h>
   #include <netinet/in.h>
   #include <unistd.h>
   #include <errno.h>
   #include <signal.h>

   // Один blocking TCP-клиент на loopback; завершает echo по EOF.
   int main(void) {
       if (signal(SIGPIPE, SIG_IGN) == SIG_ERR) return 1;
       int listener = socket(AF_INET, SOCK_STREAM, 0);
       if (listener == -1) return 1;
       struct sockaddr_in addr = {0};
       addr.sin_family = AF_INET;
       addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
       addr.sin_port = htons(19002);
       if (bind(listener, (struct sockaddr *)&addr, sizeof addr) == -1 ||
           listen(listener, 1) == -1) { close(listener); return 1; }
       int client;
       do { client = accept(listener, NULL, NULL); } while (client == -1 && errno == EINTR);
       close(listener);
       if (client == -1) return 1;
       char data[4096];
       int result = 0;
       for (;;) {
           ssize_t n = recv(client, data, sizeof data, 0);
           if (n == 0) break;
           if (n == -1) { if (errno == EINTR) continue; result = 1; break; }
           size_t offset = 0;
           while (offset < (size_t)n) {
               ssize_t sent = send(client, data + offset, (size_t)n - offset, 0);
               if (sent == -1 && errno == EINTR) continue;
               if (sent <= 0) { result = 1; break; }
               offset += (size_t)sent;
           }
           if (result != 0) break;
       }
       close(client);
       return result;
   }
   ```

   **Типичная ошибка:** Отправлять sizeof(buffer) вместо фактически прочитанных n bytes или игнорировать SIGPIPE.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

632. Как реализовать UDP echo server на C?

   **Ответ:** SOCK_DGRAM bind, recvfrom/recvmsg и sendto тому же проверенному peer. Datagram length/truncation и zero-length обрабатывают явно. Для безопасного учебного теста используют loopback и ограниченный payload.

   **Пример:**

   ```bash
   # Соберите C-пример UDP echo из ответа 351 и запустите локально.
   # В другом терминале, для варианта netcat с -w:
   printf 'hello\n' | nc -u -w 1 127.0.0.1 19001
   ```

   **Типичная ошибка:** Публично разворачивать неограниченный UDP echo как responder для spoofed traffic.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

633. Как реализовать event-driven TCP server на epoll?

   **Ответ:** Nonblocking listener/sockets регистрируют в epoll, accept/read/write выполняют с проверкой return values, сохраняют parser/write state и deadlines. В EPOLLET обрабатывают до EAGAIN, но work budget/fairness проектируют явно.

   **Типичная ошибка:** Блокировать event loop на одном клиенте или забывать восстановить interest после backpressure.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [Linux man-pages: accept(2)](https://man7.org/linux/man-pages/man2/accept.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

634. Как реализовать timeout для TCP клиента?

   **Ответ:** Задают monotonic общий deadline, nonblocking connect, poll/epoll ожидание и SO_ERROR после readiness. Остаток времени пересчитывают после EINTR; DNS отдельно включают в budget. При timeout закрывают attempt и фиксируют причину.

   **Типичная ошибка:** Поставить SO_RCVTIMEO и считать его полным timeout для DNS+connect+всего request.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html); [Linux man-pages: clock_gettime(2)](https://man7.org/linux/man-pages/man2/clock_gettime.2.html).

635. Как реализовать timeout для UDP запроса?

   **Ответ:** После send ожидают matching response в пределах monotonic deadline, проверяя peer/transaction ID. Nonblocking receive и poll помогают различить timeout/EAGAIN/errors. Retries ограничивают общим budget и безопасностью операции.

   **Типичная ошибка:** Считать любую входящую datagram подтверждением именно текущего запроса.

   **Источник:** [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).

636. Как обрабатывать partial reads/writes корректно?

   **Ответ:** Хранят offset и remaining bytes, добавляют только успешно прочитанное/записанное. EAGAIN ждёт readiness, EINTR обрабатывается по операции; EOF/error завершают или переводят state по протоколу. UDP не применяет stream partial-write схему.

   **Типичная ошибка:** Заново отправлять весь buffer после положительного partial send.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

637. Как проектировать framing protocol поверх TCP?

   **Ответ:** Определяют wire lengths/types/version, максимальный размер, endian, parser states и поведение при malformed/partial input. Несколько frames могут прийти одним read, один frame — несколькими. Limits защищают memory и CPU.

   **Типичная ошибка:** Доверять length field до проверки полного заголовка, bounds и разрешённого лимита.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

638. Почему length-prefixed framing часто лучше "читать до разделителя"?

   **Ответ:** Length prefix удобен для бинарного payload и ограниченного выделения/парсинга, не требует поиска/escaping delimiter. Но delimiter тоже уместен для текстовых protocols; «лучше» зависит от формата и correctness требований.

   **Типичная ошибка:** Считать length prefix безопасным без проверки размера/переполнения или ограничений ожидания body.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

639. Какие проблемы возникают при смешивании network I/O и business logic в одном потоке?

   **Ответ:** Долгая business operation задерживает I/O, timers и другие connections, создаёт queues и tail spikes. Помогают bounded work, асинхронные зависимости/worker partitioning и явное ownership.

   **Типичная ошибка:** Вынести business logic в unbounded очередь и лишь перенести bottleneck в память.

   **Источник:** [Linux man-pages: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

640. Как устроить backpressure-aware архитектуру сервера?

   **Ответ:** Ограничивают очереди на каждом этапе, останавливают admission/чтение при заполнении downstream и возобновляют по credit. Для UDP нужен feedback/rate/drop policy, для QUIC учитывают stream/connection limits. Deadlines не дают хранить бесполезную работу.

   **Типичная ошибка:** Выкачивать socket в бесконечную очередь и считать rwnd естественным backpressure приложения.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000).

641. Как логировать transport-level ошибки полезно для отладки?

   **Ответ:** Сохраняют operation/stage, errno/library code, family/endpoints, socket/connection ID, timestamps, duration и transferred progress. Различают connect/TLS/read/write/application failures и защиту чувствительных данных.

   **Типичная ошибка:** Логировать только «network error», теряя стадию, tuple и уже отправленные bytes.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

642. Какие errno чаще всего важны в transport-layer коде?

   **Ответ:** EINTR, EAGAIN/EWOULDBLOCK, EINPROGRESS, EPIPE, ECONNRESET, ECONNREFUSED, ETIMEDOUT, ENETUNREACH/EHOSTUNREACH, ENOBUFS и resource errors. Смысл зависит от операции и ОС; положительный partial result тоже важен.

   **Типичная ошибка:** Обрабатывать все errno одинаковым немедленным retry без limits.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

643. Как корректно обрабатывать `EINTR`, `EPIPE`, `ECONNRESET`, `ETIMEDOUT`, `ECONNREFUSED`?

   **Ответ:** EINTR обрабатывают с учётом конкретной операции/deadline; terminal connection errors завершают текущий transport и сохраняют outcome. Reconnect/retry решается на уровне идемпотентности; SIGPIPE подавляют по поддерживаемому API. close имеет отдельные platform-specific EINTR rules.

   **Типичная ошибка:** Безусловно retry-ить close(fd) после EINTR на Linux и случайно закрыть уже переиспользованный fd.

   **Источник:** [Linux man-pages: close(2)](https://man7.org/linux/man-pages/man2/close.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

644. Как не спутать EOF, timeout и temporary unavailability?

   **Ответ:** Для TCP read с ненулевой длиной 0 — EOF; EAGAIN — нет данных сейчас; timeout — истёк выбранный срок или API вернул соответствующую ошибку. UDP 0 может быть пустой datagram. Возвраты классифицируют до обработки payload.

   **Типичная ошибка:** Использовать один `n <= 0` branch для всех нормальных/ошибочных исходов.

   **Источник:** [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [Linux man-pages: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html).

645. Как тестировать transport-level код под loss, delay и reordering?

   **Ответ:** В отдельных Linux namespaces/VM применяют netem delay/loss/reorder, проверяют reconnect, framing, deadlines, backpressure и resource bounds. Тестируют оба направления и отмечают, где стоят queues. Базовая correctness проверка не должна зависеть от случайного реального интернета.

   **Типичная ошибка:** Вводить netem на production interface рабочего компьютера для обычного unit test.

   **Источник:** [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).


### Диагностика и эксплуатация
646. Как понять, проблема в handshake, congestion, flow control или приложении?

   **Ответ:** Handshake: connect states/retries/accept queues; congestion: cwnd/loss/ECN/RTT; flow: rwnd/zero-window/consumer; приложение: processing/queue/CPU spans. Нужны correlated timelines, потому что причины могут сочетаться.

   **Типичная ошибка:** Считать любой slow send congestion без проверки receiver и local queue.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

647. Как отличить packet loss от slow receiver?

   **Ответ:** При slow receiver растут read queue и rwnd-limited/zero-window признаки; loss даёт missing sequence/recovery/counters. Host overload может одновременно давать и то и другое, поэтому проверяют обе стороны.

   **Типичная ошибка:** По одному retrans counter исключать receiver bottleneck.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html).

648. Как отличить network bottleneck от CPU bottleneck?

   **Ответ:** Измеряют per-core CPU/profiles и network/transport capacity/queues; controlled изменение workload, rate или CPU помогает локализовать предел. Свободный NIC не доказывает свободную network path, низкий total CPU не исключает один saturated core.

   **Типичная ошибка:** Диагностировать bottleneck только aggregate utilization графиком.

   **Источник:** [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [Linux kernel: Scaling in the Networking Stack](https://docs.kernel.org/networking/scaling.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html).

649. Какие графики и метрики нужны для transport-level observability?

   **Ответ:** Offered/completed load, error/timeout и latency histograms, queues/memory, CPU/PPS, RTT/cwnd/rwnd, loss/retrans/ECN и setup/close/migration outcomes. Указывают labels и boundary; избегают бесконтрольной cardinality endpoint labels.

   **Типичная ошибка:** Иметь только bandwidth график без goodput и SLO.

   **Источник:** [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002); [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html).

650. Как packet captures сочетаются с application logs при разборе инцидента?

   **Ответ:** По timestamps, endpoints/translated tuples и request/connection IDs связывают packet events со stages приложения. Capture показывает transport evidence, logs — semantics; offload, clock errors и encrypted metadata ограничивают выводы.

   **Типичная ошибка:** Вычитать время из двух несогласованных логов и выдавать разность за точный network delay.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [RFC 7679: A One-Way Delay Metric](https://www.rfc-editor.org/rfc/rfc7679).

651. Как воспроизводить transport проблемы в lab/CI среде?

   **Ответ:** Фиксируют версии/config/workload и минимальный replay, в namespaces/VM воспроизводят loss/MTU/slow peer/NAT таймеры. Для deterministic parser/I/O tests отдельно управляют split/coalesced input. Проверяют recovery и отсутствие resource leaks.

   **Типичная ошибка:** Воспроизводить только удачный connect, не исходный timing/нагрузку отказа.

   **Источник:** [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

652. Как network emulation помогает тестировать TCP/UDP/QUIC?

   **Ответ:** Эмуляция даёт контролируемые delay/rate/loss/reorder и позволяет проверить deadlines/recovery при одинаковых условиях. Она не заменяет все особенности настоящего wireless/middlebox deployment.

   **Типичная ошибка:** Считать один netem random-loss profile полной моделью мобильной сети.

   **Источник:** [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

653. Какие tc/netem сценарии полезны для интервью и практики?

   **Ответ:** Fixed/variable delay, rate bottleneck с bounded queue, independent/burst loss, reorder/duplication и asymmetry. Сценарии запускают по отдельности, затем сочетают по гипотезе; MTU/NAT тесты требуют своих настроек.

   **Пример:**

   ```bash
   # Только отдельный Linux network namespace/VM, eth0 — тестовый интерфейс.
   # Нужны root-права; replace заменяет текущую root qdisc этого интерфейса.
   tc qdisc replace dev eth0 root netem delay 30ms 5ms loss 0.5%
   tc -s qdisc show dev eth0
   # По окончании удалите только созданную тестовую qdisc в этой лаборатории:
   tc qdisc del dev eth0 root
   ```

   **Типичная ошибка:** Изменить десяток параметров сразу и не знать, какой вызвал сбой.

   **Источник:** [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

654. Как transport-layer метрики использовать при capacity planning?

   **Ответ:** Определяют sustainable completed work под latency/error SLO, ресурсы per connection/stream, PPS/crypto/CPU и headroom на bursts/recovery. Проверяют WAN/rwnd/CC и ограничения генератора, а не только nominal link rate.

   **Типичная ошибка:** Планировать capacity по максимальным sender Mbps без failures, tails и memory роста.

   **Источник:** [ESnet: iperf3 documentation](https://software.es.net/iperf/invoking.html); [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html); [RFC 9002: QUIC Loss Detection and Congestion Control](https://www.rfc-editor.org/rfc/rfc9002).

655. Что обязан понимать senior C/C++ network developer про transport layer глубоко, а что можно знать обзорно?

   **Ответ:** Глубоко — stream/datagram semantics, framing, partial I/O, state/lifetime, deadlines, congestion/flow/loss, security и диагностика по evidence. Детали специфических алгоритмов/платформ зависят от роли, но ограничения абстракций надо уметь объяснить.

   **Типичная ошибка:** Заучить flags/errno и не суметь проследить один реальный request от DNS до подтверждения результата.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293); [RFC 9000: QUIC](https://www.rfc-editor.org/rfc/rfc9000); [RFC 8085: UDP Usage Guidelines](https://www.rfc-editor.org/rfc/rfc8085).
