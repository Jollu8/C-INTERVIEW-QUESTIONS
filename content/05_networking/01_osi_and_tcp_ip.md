# Вопросы: OSI и TCP/IP (с уклоном в C/C++)

## 🟢 Базовый уровень

### Общие концепции

1. Что такое модель OSI и зачем она нужна?

   **Ответ:** Модель OSI (Open Systems Interconnection) — это концептуальная 7-уровневая эталонная модель, разработанная ISO в 1984 году для стандартизации сетевых коммуникаций. Она нужна для декомпозиции сложного сетевого взаимодействия на независимые модульные уровни, что позволяет разработчикам оборудования и ПО создавать совместимые протоколы, стандартизировать интерфейсы и изолировать изменения одной подсистемы от других.

   **Пример:**

   ```
   [ Application  ] -> HTTP / DNS (Интерфейс пользователя)
   [ Presentation ] -> TLS / ASCII (Форматирование, шифрование)
   [ Session      ] -> RPC / NetBIOS (Управление сессиями)
   [ Transport    ] -> TCP / UDP (Сквозная доставка)
   [ Network      ] -> IP (Маршрутизация)
   [ Data Link    ] -> Ethernet (Доставка между узлами)
   [ Physical     ] -> Биты / Радиоволны / Витая пара
   ```

   **Источник:** [ISO/IEC 7498-1: Information technology — Open Systems Interconnection — Basic Reference Model](https://www.iso.org/standard/20269.html?utm_source=gemini)

2. Сколько слоёв в модели OSI?

   **Ответ:** Модель OSI состоит ровно из 7 слоев, нумеруемых снизу вверх: L1 (Physical / Физический), L2 (Data Link / Канальный), L3 (Network / Сетевой), L4 (Transport / Транспортный), L5 (Session / Сеансовый), L6 (Presentation / Уровень представления) и L7 (Application / Прикладной).

   **Пример:**

   ```
   L7: Application
   L6: Presentation
   L5: Session
   L4: Transport
   L3: Network
   L2: Data Link
   L1: Physical
   ```

   **Источник:** [IETF RFC 1122: Requirements for Internet Hosts — Communication Layers](https://datatracker.ietf.org/doc/html/rfc1122?utm_source=gemini)

3. Какие слои входят в TCP/IP модель?

   **Ответ:** Современная модель стека протоколов TCP/IP (RFC 1122 / обновленная 4-уровневая или 5-уровневая гибридная модель) включает следующие уровни: Application (Прикладной), Transport (Транспортный), Internet (Межсетевой / Network) и Network Access / Link (Канальный / Уровень сетевого доступа, часто разделяемый на Data Link и Physical).

   **Пример:**

   ```
   4-уровневая модель TCP/IP (RFC 1122):
   4. Application Layer (HTTP, DNS, SSH)
   3. Transport Layer   (TCP, UDP)
   2. Internet Layer    (IP, ICMP)
   1. Link Layer        (Ethernet, Wi-Fi)
   ```

   **Источник:** [IETF RFC 1122: Architectural Overview](https://datatracker.ietf.org/doc/html/rfc1122#section-1.1.3?utm_source=gemini)

4. В чём разница между OSI и TCP/IP?

   **Ответ:** Модель OSI — строго теоретическая концептуальная модель, созданная комитетом до практической реализации протоколов; в ней 7 четко разграниченных слоев, включая редко используемые в чистом виде Session и Presentation. Стек TCP/IP — практическая инженерная модель, разработанная ARPA/IETF параллельно с реальной реализацией стека протоколов интернета; в ней функции уровней 5–7 объединены в единый прикладной уровень.

   **Пример:**

   ```
   OSI:    [L7: App] + [L6: Pres] + [L5: Session]
                  \        |        /
   TCP/IP:        [ Application Layer ] (TLS и сессии реализованы прямо внутри процесса приложения)
   ```

   **Источник:** [Kurose, Ross: Computer Networking: A Top-Down Approach](https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003335?utm_source=gemini)

5. Почему TCP/IP используется на практике чаще, чем OSI?

   **Ответ:** TCP/IP победил исторически и экономически: он был свободно и открыто реализован в кодовой базе BSD Unix (Berkeley Sockets), протестирован на реальной сети ARPANET и отличался простотой и прагматичностью. Протоколы OSI (CLNP, FTAM) были перегружены бюрократическими спецификациями, требовали огромных вычислительных ресурсов и появились слишком поздно, когда глобальная сеть уже работала на IP.

   **Пример:**

   ```
   # Сокеты Беркли (1983 г.) закрепили API TCP/IP для всех ОС:
   int s = socket(AF_INET, SOCK_STREAM, 0); // Стандарт де-факто
   ```

   **Источник:** [Andrew S. Tanenbaum: Computer Networks (Why OSI didn't catch on)](https://www.pearson.com/en-us/subject-catalog/p/computer-networks/P200000003333?utm_source=gemini)

   ---

### Слои и их функции

6. Какие функции выполняет Physical layer?

   **Ответ:** Физический уровень (L1) отвечает за передачу неструктурированного потока сырых битов (0 и 1) через физическую среду передачи данных: электрические импульсы по витой паре (медь), световые вспышки по оптоволокну или электромагнитные волны в радиоэфире (Wi-Fi). Он стандартизирует типы разъемов (RJ-45), уровни напряжений, частоты, модуляции и скорость передачи сигналов.

   **Пример:**

   ```
   1000BASE-T (Gigabit Ethernet over Cat 5e):
   4 витые пары, амплитудная модуляция PAM-5, частота 125 МГц
   ```

   **Источник:** [IEEE 802.3 Ethernet Standard: Physical Layer Specifications](https://standards.ieee.org/ieee/802.3/7081/?utm_source=gemini)

7. За что отвечает Data Link layer?

   **Ответ:** Канальный уровень (L2) обеспечивает надежную передачу данных непосредственно между двумя соседними узлами в пределах одного физического сетевого сегмента (коллизионного или широковещательного домена). Он упаковывает пакеты в кадры (frames), выполняет физическую адресацию с помощью MAC-адресов, управляет доступом к общей среде (CSMA/CD, CSMA/CA) и производит проверку целостности данных через контрольную сумму (CRC32).

   **Пример:**

   ```
   Структура кадра Ethernet II:
   [ Preamble | Dest MAC (6B) | Src MAC (6B) | Type (2B) | Payload (46-1500B) | CRC32 (4B) ]
   ```

   **Источник:** [IEEE Standard for Ethernet (IEEE 802.3-2022)](https://standards.ieee.org/ieee/802.3/10529/?utm_source=gemini)

8. Какие задачи решает Network layer?

   **Ответ:** Сетевой уровень (L3) решает задачу сквозной доставки пакетов между узлами в гетерогенных сетях произвольной топологии (inter-networking). Ключевые функции: логическая глобальная адресация (IPv4, IPv6), маршрутизация (выбор оптимального пути через промежуточные маршрутизаторы на основе BGP/OSPF), обработка фрагментации пакетов и трансляция адресов (NAT).

   **Пример:**

   ```
   # Таблица маршрутизации ядра ОС определяет, куда отправить L3-пакет:
   ip route show
   # default via 192.168.1.1 dev eth0 proto dhcp metric 100
   ```

   **Источник:** [IETF RFC 791: Internet Protocol (IP)](https://datatracker.ietf.org/doc/html/rfc791?utm_source=gemini)

9. Что делает Transport layer?

   **Ответ:** Транспортный уровень (L4) обеспечивает сквозную (end-to-end) связь между конкретными процессами приложений на хостах, мультиплексируя потоки с помощью номеров портов (1–65535). Он может предоставлять как гарантированную доставку с установлением соединения, контролем порядка, переповтором и регулированием скорости (TCP), так и легковесную датаграммную передачу без гарантий и задержек (UDP).

   **Пример:**

   ```
   // Адресация процесса через сокет: IP + Port
   192.168.1.50:5432 -> подключение к процессу PostgreSQL
   ```

   **Источник:** [IETF RFC 793: Transmission Control Protocol](https://datatracker.ietf.org/doc/html/rfc793?utm_source=gemini)

10. Чем занимается Application layer?

    **Ответ:** Прикладной уровень (L7 / TCP/IP App Layer) предоставляет протоколы высокого уровня и пользовательские интерфейсы для прямого взаимодействия приложений с сетью. Он определяет синтаксис и семантику сообщений, с помощью которых программы запрашивают ресурсы, передают веб-страницы, файлы, почту и выполняют разрешение имен (HTTP, DNS, SSH, SMTP).

    **Пример:**

    ```http
    GET /index.html HTTP/1.1
    Host: example.com
    User-Agent: curl/8.0.1
    ```

    **Источник:** [IETF RFC 9110: HTTP Semantics](https://datatracker.ietf.org/doc/html/rfc9110?utm_source=gemini)

    ---

### Протоколы

11. Какие протоколы работают на уровне L3?

    **Ответ:** На сетевом уровне (L3) работают: базовые протоколы маршрутизации данных — IPv4 и IPv6; протоколы служебных управляющих сообщений и диагностики — ICMP (Internet Control Message Protocol) и ICMPv6; протокол управления групповой рассылкой — IGMP; а также протокол обеспечения безопасности на сетевом уровне — IPsec.

    **Пример:**

    ```bash
    # Диагностика L3 через ICMP Echo Request:
    ping -c 1 8.8.8.8
    ```

    **Источник:** [IETF RFC 792: Internet Control Message Protocol (ICMP)](https://datatracker.ietf.org/doc/html/rfc792?utm_source=gemini)

12. Какие протоколы относятся к Transport layer?

    **Ответ:** К ключевым протоколам транспортного уровня (L4) относятся: TCP (Transmission Control Protocol — надежный потоковый транспорт), UDP (User Datagram Protocol — ненадежный легковесный датаграммный транспорт), SCTP (Stream Control Transmission Protocol — мультипоточный транспорт сообщений) и DCCP (Datagram Congestion Control Protocol).

    **Пример:**

    ```bash
    # Просмотр открытых сокетов L4 (TCP и UDP):
    ss -tuln
    # tcp  LISTEN 0 128 0.0.0.0:22  (SSH)
    # udp  UNCONN 0 0   0.0.0.0:53  (DNS)
    ```

    **Источник:** [IETF RFC 768: User Datagram Protocol (UDP)](https://datatracker.ietf.org/doc/html/rfc768?utm_source=gemini)

13. Где работает HTTP?

    **Ответ:** Протокол HTTP (Hypertext Transfer Protocol, версии 1.1, 2 и 3) работает на прикладном уровне (Application Layer — L7 в модели OSI). Он описывает формат обмена запросами и ответами между веб-клиентом и сервером и опирается на транспортный уровень: TCP для HTTP/1.1 и HTTP/2, либо QUIC (поверх UDP) для HTTP/3.

    **Пример:**

    ```
    [ Application ] -> HTTP/2 или HTTP/3
    [ Transport   ] -> TCP (HTTP/1,2) или QUIC/UDP (HTTP/3)
    ```

    **Источник:** [IETF RFC 9114: HTTP/3](https://datatracker.ietf.org/doc/html/rfc9114?utm_source=gemini)

14. Где работает TCP?

    **Ответ:** Протокол TCP (Transmission Control Protocol) работает на транспортном уровне (Transport Layer — L4 модели OSI). Он инкапсулирует данные прикладного уровня в TCP-сегменты, гарантируя надежную доставку с подтверждением приема (ACK), упорядочивание и повтор потерянных байтов.

    **Пример:**

    ```
    Заголовок TCP (L4) содержит Source Port и Destination Port:
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |          Source Port          |       Destination Port        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    ```

    **Источник:** [IETF RFC 9293: Transmission Control Protocol (TCP)](https://datatracker.ietf.org/doc/html/rfc9293?utm_source=gemini)

15. Где работает IP?

    **Ответ:** Протокол IP (Internet Protocol) работает на сетевом уровне (Network Layer — L3 модели OSI / Internet Layer в модели TCP/IP). Он отвечает за логическую адресацию и объединение независимых локальных сетей в единый глобальный интернет без сохранения состояния соединений (connectionless protocol).

    **Пример:**

    ```
    IP-заголовок (L3) добавляется к каждому TCP-сегменту:
    [ IP Header (Src: 192.168.1.10, Dst: 93.184.216.34) | [ TCP Header | Data ] ]
    ```

    **Источник:** [IETF RFC 791: Internet Protocol Specification](https://datatracker.ietf.org/doc/html/rfc791?utm_source=gemini)

    ---

### Инкапсуляция

16. Что такое инкапсуляция данных?

    **Ответ:** Инкапсуляция данных — это процесс последовательной упаковки данных вышестоящего уровня модели в структуру служебного блока нижестоящего уровня путем добавления служебных заголовков (headers) и концевиков (trailers). Каждый нижележащий уровень воспринимает весь блок данных вышестоящего уровня просто как неделимую полезную нагрузку (payload).

    **Пример:**

    ```
    L7 Data:              [  HTTP Request  ]
    L4 Segment:   [TCP Hdr | HTTP Request  ]
    L3 Packet:  [IP Hdr   | TCP Hdr | HTTP Request ]
    L2 Frame: [Eth Hdr | IP Hdr | TCP Hdr | HTTP Request | Eth Trailer]
    ```

    **Источник:** [W. Richard Stevens: TCP/IP Illustrated, Volume 1 (The Protocols)](https://www.pearson.com/en-us/subject-catalog/p/tcp-ip-illustrated-volume-1-the-protocols/P200000003348?utm_source=gemini)

17. Что происходит с данными на каждом уровне?

    **Ответ:** При передаче: на прикладном уровне генерируются данные (Data); на транспортном они нарезаются на части с добавлением портов и флагов (TCP Segments / UDP Datagrams); на сетевом уровне добавляются IP-адреса отправителя и получателя (Packets); на канальном уровне пакет помещается в кадр с MAC-адресами и CRC (Frames); на физическом уровне кадр кодируется в бинарный поток импульсов (Bits). При приеме происходит обратный процесс — деинкапсуляция.

    **Пример:**

    ```
    Data (L7) -> Segment (L4) -> Packet (L3) -> Frame (L2) -> Bits (L1)
    ```

    **Источник:** [Cisco Networking Academy: CCNA Routing and Switching Introduction](https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html?utm_source=gemini)

18. Чем отличается packet от frame?

    **Ответ:** Packet (пакет) — это PDU (Protocol Data Unit) сетевого уровня (L3 / IP), оперирующий логическими IP-адресами, существующий сквозным образом на всем пути от отправителя до получателя через интернет. Frame (кадр / фрейм) — это PDU канального уровня (L2 / Ethernet), оперирующий физическими MAC-адресами; кадр полностью пересобирается заново на каждом транзитном сетевом переходе (hop) каждым маршрутизатором.

    **Пример:**

    ```
    Пакет (L3): IP-адреса источника и назначения НЕ меняются на маршрутизаторах (без NAT).
    Кадр (L2):  MAC-адреса источника и назначения ПЕРЕЗАПИСЫВАЮТСЯ на каждом роутере!
    ```

    **Источник:** [IETF RFC 894: Standard for the transmission of IP datagrams over Ethernet networks](https://datatracker.ietf.org/doc/html/rfc894?utm_source=gemini)

19. Что такое payload?

    **Ответ:** Payload (полезная нагрузка) — это фактические пользовательские или вышестоящие данные, переносимые сетевым блоком (PDU), за исключением служебных заголовков (headers) и контрольных сумм (trailers), добавленных текущим протоколом.

    **Пример:**

    ```
    Для IP-пакета payload — это TCP-сегмент.
    Для TCP-сегмента payload — это прикладной HTTP-запрос "GET / HTTP/1.1".
    ```

    **Источник:** [RFC 791: Internet Protocol (Data Field)](https://datatracker.ietf.org/doc/html/rfc791#section-3.1?utm_source=gemini)

20. Что такое header?

    **Ответ:** Header (заголовок протокола) — служебный блок метаданных фиксированной или переменной длины, добавляемый протоколом в начало передаваемых данных для управления сессией, адресации, маршрутизации, проверки целостности и указания типа вложенного содержимого.

    **Пример:**

    ```
    Заголовок IPv4 (минимум 20 байт):
    содержит Version, IHL, Total Length, TTL, Protocol, Source IP, Destination IP
    ```

    **Источник:** [RFC 791: IP Header Format](https://datatracker.ietf.org/doc/html/rfc791#section-3.1?utm_source=gemini)

    ---

## 🟡 Средний уровень

### Архитектура и сопоставление

21. Как сопоставляются слои OSI и TCP/IP?

    **Ответ:**
    1. Уровни 7 (Application), 6 (Presentation) и 5 (Session) модели OSI объединяются в единый **Application Layer** в модели TCP/IP.
    2. Уровень 4 (Transport) OSI точно соответствует **Transport Layer** в TCP/IP.
    3. Уровень 3 (Network) OSI соответствует **Internet Layer** в TCP/IP.
    4. Уровни 2 (Data Link) и 1 (Physical) OSI объединяются в **Link / Network Access Layer** в классической 4-уровневой модели TCP/IP (или рассматриваются отдельно в 5-уровневой практической модели).

    **Пример:**

    ```
    OSI Layer             TCP/IP Layer (RFC 1122)
    -----------------     -----------------------
    7. Application   \
    6. Presentation   +-> Application Layer
    5. Session       /
    4. Transport     ---> Transport Layer
    3. Network       ---> Internet Layer
    2. Data Link     \
    1. Physical       +-> Link Layer
    ```

    **Источник:** [RFC 1122: Requirements for Internet Hosts](https://datatracker.ietf.org/doc/html/rfc1122?utm_source=gemini)

22. Почему Presentation и Session уровни отсутствуют в TCP/IP?

    **Ответ:** Создатели TCP/IP придерживались сквозного принципа (End-to-End Principle): сеть должна быть максимально простой («тупой»), а все специализированные функции обработки данных должны находиться в приложениях на конечных хостах. Форматирование (Presentation: MIME, JSON, шифрование TLS) и управление сессиями (Session: токены, cookies, RPC) оказались настолько специфичными для конкретных приложений, что выделение их в независимые жесткие сетевые уровни ОС было признано неэффективным.

    **Пример:**

    ```
    Шифрование TLS в модели OSI должно быть на L6 (Presentation),
    но в стеке TCP/IP библиотека OpenSSL работает прямо внутри пользовательского процесса (L7).
    ```

    **Источник:** [Saltzer, Reed, Clark: End-to-End Arguments in System Design (ACM TOCS)](https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf?utm_source=gemini)

23. Какие проблемы решает каждый слой в реальной сети?

    **Ответ:**
    * **L1 (Physical):** как физически передать биты через провод, оптику или воздух без затухания и помех.
    * **L2 (Data Link):** как двум сетевым картам в одном проводе понять, кому адресован кадр, и где его границы.
    * **L3 (Network):** как доставить данные через 10 промежуточных стран и разных сетей от хоста А до хоста Б.
    * **L4 (Transport):** как распределить данные по разным программам хоста (порты) и восстановить потерянные пакеты.
    * **L7 (Application):** как интерпретировать полученные байты (показать веб-страницу, запустить команду).

    **Пример:**

    ```
    L1: провод перебит -> нет несущей частоты.
    L2: петля коммутации -> броадкаст-шторм.
    L3: нет маршрута к подсети 10.0.0.0/8 -> Network unreachable.
    L4: закрыт порт 443 -> Connection refused.
    L7: на сервере упал скрипт -> HTTP 500 Internal Server Error.
    ```

    **Источник:** [Tanenbaum, Wetherall: Computer Networks (5th Edition)](https://www.pearson.com/en-us/subject-catalog/p/computer-networks/P200000003333?utm_source=gemini)

    ---

### Data Link / Network

24. Что такое MAC-адрес и где он используется?

    **Ответ:** MAC-адрес (Media Access Control) — уникальный 48-битный (6 байт) физический идентификатор сетевого интерфейса (NIC), используемый на канальном уровне (L2) для адресной доставки кадров в пределах одного локального сегмента сети (Ethernet/Wi-Fi). Первые 3 байта обозначают производителя (OUI — Organizationally Unique Identifier), а вторые 3 байта — уникальный серийный номер адаптера.

    **Пример:**

    ```
    # Пример MAC-адреса:
    00:1A:2B:3C:4D:5E
    [  OUI  ] [ Device ID ]
    ```

    **Источник:** [IEEE Guidelines for Use of Extended Unique Identifier (EUI)](https://standards.ieee.org/products-programs/regauth/tut/eui/?utm_source=gemini)

25. Как работает ARP?

    **Ответ:** Протокол ARP (Address Resolution Protocol, RFC 826) транслирует известный логический IP-адрес узла в локальной сети в его физический MAC-адрес. Отправитель отправляет широковещательный запрос **ARP Request** (на MAC `ff:ff:ff:ff:ff:ff`): «У кого IP $X.X.X.X$? Сообщите свой MAC хосту $Y$». Хост с искомым IP отвечает адресным ответом **ARP Reply** (Unicast): «IP $X.X.X.X$ у меня, мой MAC — $Z$». Результат кэшируется в локальной ARP-таблице хоста.

    **Пример:**

    ```bash
    # Просмотр локального ARP-кэша в Linux:
    ip neighbor show
    # 192.168.1.1 dev eth0 lladdr a4:91:b1:cd:23:01 REACHABLE
    ```

    **Источник:** [IETF RFC 826: An Ethernet Address Resolution Protocol (ARP)](https://datatracker.ietf.org/doc/html/rfc826?utm_source=gemini)

26. Что происходит при отправке пакета в другую подсеть?

    **Ответ:** Хост накладывает маску подсети на IP-адрес назначения. Обнаружив, что получатель находится в другой подсети:
    1. Хост формирует L3 IP-пакет, где Destination IP = реальный удаленный IP сервера.
    2. Хост находит в своей таблице маршрутизации IP-адрес шлюза по умолчанию (Default Gateway).
    3. С помощью ARP хост выясняет MAC-адрес **шлюза (роутера)**.
    4. Хост упаковывает IP-пакет в L2 Ethernet-кадр, где Destination MAC = **MAC-адрес роутера**, и отправляет его в физическую среду.

    **Пример:**

    ```
    Пакет идет к 8.8.8.8 через шлюз 192.168.1.1:
    [ L2: Src MAC = My_PC,   Dst MAC = Router_MAC ]
    [ L3: Src IP  = 192.168.1.5, Dst IP  = 8.8.8.8   ]
    ```

    **Источник:** [RFC 1122: Host Requirements — Communication Layers (Routing Outbound Datagrams)](https://datatracker.ietf.org/doc/html/rfc1122#section-3.3.1?utm_source=gemini)

27. Как работает маршрутизация на уровне IP?

    **Ответ:** Маршрутизатор (L3 устройство) принимает входящий кадр, считывает его, проверяет CRC и отбрасывает L2-заголовок. Далее он считывает Destination IP в L3-заголовке и ищет наиболее подходящую запись в своей таблице маршрутизации по принципу наибольшего совпадения маски (Longest Prefix Match). Маршрутизатор декрементирует поле TTL на 1, пересчитывает контрольную сумму заголовка IP, инкапсулирует пакет в новый L2-кадр с MAC-адресом следующего транзитного узла (next-hop) и выталкивает в соответствующий сетевой интерфейс.

    **Пример:**

    ```
    Таблица маршрутизатора:
    10.0.0.0/8     via 192.168.10.1 (префикс 8 бит)
    10.1.2.0/24    via 192.168.20.1 (префикс 24 бита - победитель Longest Prefix Match!)
    ```

    **Источник:** [IETF RFC 1812: Requirements for IP Version 4 Routers](https://datatracker.ietf.org/doc/html/rfc1812?utm_source=gemini)

28. Что такое TTL и зачем он нужен?

    **Ответ:** TTL (Time to Live) — 8-битное поле в заголовке IPv4 (в IPv6 называется *Hop Limit*), предназначенное для предотвращения бесконечного циркулирования пакетов по сети в случае возникновения петель маршрутизации (routing loops). Каждый маршрутизатор при прохождении пакета уменьшает значение TTL ровно на 1. Если TTL достигает 0, пакет уничтожается, а отправителю отсылается служебное сообщение ICMP Time Exceeded (Type 11).

    **Пример:**

    ```bash
    # traceroute использует последовательное увеличение TTL от 1 до N:
    traceroute 8.8.8.8
    # 1  192.168.1.1 (TTL=1 отброшен шлюзом)
    # 2  10.50.0.1   (TTL=2 отброшен провайдером)
    ```

    **Источник:** [IETF RFC 791: Internet Protocol (Time to Live)](https://datatracker.ietf.org/doc/html/rfc791#section-3.2?utm_source=gemini)

    ---

### Transport layer

29. В чём разница между TCP и UDP?

    **Ответ:**
    * **TCP:** протокол с установлением соединения (handshake), гарантирует доставку (ACK, переповтор при потере), сохраняет порядок следования байт, реализует управление скоростью (Flow Control и Congestion Control). Имеет большой заголовок (20–60 байт).
    * **UDP:** протокол без установления соединения, отправляет датаграммы по принципу «выстрелил и забыл» (best-effort), не гарантирует доставку и порядок, не контролирует перегрузку. Имеет минимальный заголовок (8 байт), обеспечивая минимальные задержки.

    **Пример:**

    ```
    TCP: передача файлов, веб, транзакции (HTTP, SSH, PostgreSQL).
    UDP: видеопотоки, онлайн-игры, DNS-запросы, VoIP.
    ```

    **Источник:** [IETF RFC 793 (TCP)](https://datatracker.ietf.org/doc/html/rfc793?utm_source=gemini) и [IETF RFC 768 (UDP)](https://datatracker.ietf.org/doc/html/rfc768?utm_source=gemini)

30. Что такое 3-way handshake?

    **Ответ:** 3-way handshake (трехэтапное рукопожатие) — процедура инициализации двустороннего TCP-соединения между клиентом и сервером для согласования начальных порядковых номеров последовательностей (ISN — Initial Sequence Number) и параметров окна:
    1. **SYN:** Клиент отправляет флаг `SYN`, свой начальный `Seq=X`.
    2. **SYN-ACK:** Сервер отвечает флагами `SYN` и `ACK`, подтверждает номер клиента `Ack=X+1` и передает свой `Seq=Y`.
    3. **ACK:** Клиент подтверждает номер сервера `Ack=Y+1`. Соединение установлено (`ESTABLISHED`).

    **Пример:**

    ```
    Client                     Server
      | ------ SYN (Seq=X) ------> |
      | <-- SYN-ACK (Seq=Y, Ack=X+1) |
      | ------ ACK (Ack=Y+1) ----> |
    ```

    **Источник:** [RFC 793: Transmission Control Protocol (Connection Establishment)](https://datatracker.ietf.org/doc/html/rfc793#section-3.4?utm_source=gemini)

31. Что такое flow control?

    **Ответ:** Flow Control (управление потоком) — механизм TCP, предотвращающий переполнение приемного буфера **конечного получателя** слишком быстрым отправителем. Получатель в каждом ответном пакете ACK передает размер свободного места в своем буфере в поле `Receive Window` (rwnd / Window Size). Отправитель имеет право отправить без подтверждения не более байт, чем указано в rwnd.

    **Пример:**

    ```
    Получатель перегружен: шлет ACK с Window Size = 0 (Zero Window).
    Отправитель немедленно останавливает передачу и шлет редкие Probe-пакеты.
    ```

    **Источник:** [RFC 9293: Transmission Control Protocol (Flow Control)](https://datatracker.ietf.org/doc/html/rfc9293#section-3.8.3?utm_source=gemini)

32. Что такое congestion control?

    **Ответ:** Congestion Control (контроль перегрузки сети) — механизм TCP, предотвращающий коллапс **промежуточных сетевых каналов и буферов маршрутизаторов** в интернете из-за избыточного трафика. Отправитель поддерживает динамическое окно перегрузки (`cwnd`). Алгоритмы (Reno, Cubic, BBR) плавно увеличивают `cwnd` (Slow Start, Congestion Avoidance) и резко сбрасывают его при обнаружении потерь пакетов или росте RTT.

    **Пример:**

    ```
    Размер окна передачи отправителя:
    Send_Window = min(rwnd, cwnd)
    rwnd — ограничивает принимающий хост, cwnd — ограничивает состояние каналов интернета.
    ```

    **Источник:** [IETF RFC 5681: TCP Congestion Control](https://datatracker.ietf.org/doc/html/rfc5681?utm_source=gemini)

33. Как происходит повторная передача пакетов?

    **Ответ:** В TCP повторная передача (retransmission) инициируется двумя путями:
    1. **Retransmission Timeout (RTO):** если подтверждение ACK для отправленного сегмента не вернулось в течение расчетного тайм-аута RTO (вычисляется адаптивно по формуле Якобсона на основе сглаженного RTT), сегмент отправляется повторно.
    2. **Fast Retransmit:** если отправитель получает 3 дублирующих подтверждения подряд (3 Duplicate ACKs с одинаковым номером), это сигнализирует о потере конкретного сегмента, и он переотправляется немедленно, не дожидаясь истечения таймера RTO.

    **Пример:**

    ```
    Отправлены: 1, 2, 3, 4. Сегмент 2 потерян.
    Получатель шлет: ACK 2, ACK 2, ACK 2 (3 дубля).
    Отправитель мгновенно переотправляет сегмент 2 (Fast Retransmit).
    ```

    **Источник:** [IETF RFC 6298: Computing TCP's Retransmission Timer](https://datatracker.ietf.org/doc/html/rfc6298?utm_source=gemini)

    ---

### Ошибки и диагностика

34. Какие проблемы характерны для L1?

    **Ответ:** Для физического уровня (L1) характерны аппаратные поломки среды передачи: механический обрыв медного кабеля или надлом оптоволокна, окисление или плохой обжим коннекторов RJ-45/SFP, электромагнитные наводки и помехи от силовых кабелей, превышение предельной длины трассы (более 100 метров для витой пары), аппаратный выход из строя приемопередатчика (трансивера) или порта сетевой карты.

    **Пример:**

    ```bash
    # Диагностика L1: проверка наличия физического линка:
    ethtool eth0 | grep "Link detected"
    # Link detected: no (кабель отключен или поврежден)
    ```

    **Источник:** [IEEE 802.3: Physical Medium Attachment Specifications](https://standards.ieee.org/ieee/802.3/7081/?utm_source=gemini)

35. Какие проблемы возникают на L2?

    **Ответ:** На канальном уровне (L2) возникают: широковещательные штормы из-за петель коммутации (сбой или отсутствие протокола STP/RSTP), некорректная настройка VLAN (VLAN mismatch, ненастроенный Trunk-порт), переполнение таблицы MAC-адресов коммутатора (MAC flooding), дублирование MAC-адресов в одном сегменте, несоответствие настроек дуплекса (Duplex Mismatch — половина в Half, половина в Full), а также ошибки CRC (битые фреймы из-за помех).

    **Пример:**

    ```bash
    # Диагностика L2: проверка счетчиков ошибок CRC и дропов кадра:
    netstat -i
    # RX-ERR / RX-OVR / CRC errors указывают на проблему L1/L2
    ```

    **Источник:** [IEEE 802.1Q: Bridges and Bridged Networks (VLANs)](https://standards.ieee.org/ieee/802.1Q/10323/?utm_source=gemini)

36. Какие проблемы типичны для L3?

    **Ответ:** На сетевом уровне (L3) типичны: дублирование IP-адресов (IP conflict), неверно указанная маска подсети (хост считает соседа внешней сетью или наоборот), отсутствие или неверный IP шлюза по умолчанию (Default Gateway), петли маршрутизации (пакеты умирают по истечении TTL), асимметричная маршрутизация, блокировка пакетов правилами межсетевого экрана (firewall / iptables) и некорректная настройка трансляции адресов (NAT).

    **Пример:**

    ```bash
    # Диагностика L3: проверка маршрута к адресу:
    ip route get 8.8.8.8
    # RTNETLINK answers: Network is unreachable (отсутствует default gateway)
    ```

    **Источник:** [IETF RFC 1812: Requirements for IP Version 4 Routers](https://datatracker.ietf.org/doc/html/rfc1812?utm_source=gemini)

37. Как определить, на каком уровне произошла ошибка?

    **Ответ:** Диагностика производится систематически снизу вверх (Bottom-Up approach):
    1. **L1:** Проверить физический линк (`ethtool`, индикаторы портов на карте/роутере).
    2. **L2:** Проверить получение MAC-адреса шлюза через ARP (`ip neigh`, `arp -a`).
    3. **L3:** Проверить связность по IP с помощью ICMP-пинга шлюза и внешнего IP (`ping 192.168.1.1`, `ping 8.8.8.8`).
    4. **L4:** Проверить доступность конкретного порта сервиса (`nc -zv host 443`, `curl -v`, `telnet`).
    5. **L7:** Проверить прикладные коды ошибок (HTTP 403/500, валидность TLS-сертификата).

    **Пример:**

    ```bash
    # Проверка L4 (порт открыт?):
    nc -zv example.com 443
    # Connection to example.com 443 port [tcp/https] succeeded! (L1-L4 работают)
    ```

    **Источник:** [Cisco Troubleshooting Methodology (Network Maintenance and Troubleshooting Guide)](https://www.cisco.com/c/en/us/support/docs/quality-of-service-qos/qos-troubleshooting/112028-qos-troubleshooting-methodology.html?utm_source=gemini)

38. Почему ping может не работать?

    **Ответ:** Утилита `ping` работает на L3 через протокол ICMP (Echo Request / Echo Reply). Возможные причины сбоя:
    1. ICMP-трафик явно заблокирован локальным файрволом хоста (iptables, Windows Defender Firewall) или промежуточным корпоративным брандмауэром.
    2. Целевой сервер настроен игнорировать входящие ICMP Echo запросы в целях маскировки (`net.ipv4.icmp_echo_ignore_all = 1`).
    3. Отсутствует маршрут к целевой сети или некорректен Default Gateway (Network unreachable).
    4. Проблема с L2: не удается разрешить MAC-адрес шлюза через ARP (Destination Host Unreachable).
    5. Не работает DNS (если пинговали по доменному имени, а не по IP: `ping: cannot resolve example.com: Unknown host`).

    **Пример:**

    ```bash
    # Блокировка ICMP при сохранении доступности веб-сайта на L4/L7:
    ping example.com       # 100% packet loss (ICMP отброшен)
    curl -I https://example.com # HTTP/2 200 OK (TCP 443 работает штатно)
    ```

    **Источник:** [IETF RFC 792: Internet Control Message Protocol (Echo and Echo Reply)](https://datatracker.ietf.org/doc/html/rfc792?utm_source=gemini)

    ---

## 🔴 Продвинутый уровень (C/C++ и low-level)

### Работа с сокетами

39. На каком уровне OSI работают сокеты?

    **Ответ:** Сокет — это абстракция операционной системы (файловый дескриптор и связанные структуры ядра), служащая интерфейсом между прикладным уровнем (L7 в терминах модели OSI) и транспортным уровнем (L4). Сам интерфейс сокетов обычно соотносят с границей сеансового уровня (L5) и транспортного уровня (L4), так как он управляет конечными точками сессии связи.

    **Пример:**

    ```c
    // Сокет связывает пользовательский буфер приложения (L7)
    // со структурами управления TCP-сессией ядра (L4):
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    ```

    **Источник:** [W. Richard Stevens: UNIX Network Programming, Volume 1 (Sockets API)](https://www.pearson.com/en-us/subject-catalog/p/unix-network-programming-volume-1-the-sockets-networking-api/P200000003347?utm_source=gemini)

40. Как системный вызов `socket()` соотносится с OSI?

    **Ответ:** Аргументы системного вызова `socket(domain, type, protocol)` напрямую конфигурируют стек протоколов в терминах уровней:
    1. `domain` (`AF_INET`, `AF_INET6`) определяет протокол сетевого уровня (**L3 — Network**).
    2. `type` (`SOCK_STREAM`, `SOCK_DGRAM`) задает тип сервиса транспортного уровня (**L4 — Transport**).
    3. `protocol` (`IPPROTO_TCP`, `IPPROTO_UDP`) указывает конкретную реализацию L4-протокола.

    **Пример:**

    ```c
    // L3: IPv4 (AF_INET), L4: TCP (SOCK_STREAM)
    int fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    ```

    **Источник:** [Linux man-pages: socket(2)](https://man7.org/linux/man-pages/man2/socket.2.html?utm_source=gemini)

41. Какие уровни затрагиваются при `send()`?

    **Ответ:** При вызове `send()` данные последовательно проходят все уровни сверху вниз:
    1. **L7 -> Ядро:** буфер копируется из адресного пространства пользователя в буфер сокета в ядре (`sk_buff`).
    2. **L4 (Transport):** формируется TCP-сегмент со служебным заголовком (порты, `seq`, контрольная сумма).
    3. **L3 (Network):** выполняется маршрутизация, генерируется IP-заголовок (IP-адреса, TTL).
    4. **L2 (Data Link):** ядро находит MAC-адрес (ARP) и помещает пакет в очередь сетевой карты (`qdisc`), добавляя Ethernet-заголовок.
    5. **L1 (Physical):** DMA передает кадр сетевой карте, физический контроллер (PHY) преобразует биты в электрические или оптические сигналы.

    **Пример:**

    ```
    send() [L7] -> tcp_sendmsg() [L4] -> ip_queue_xmit() [L3] -> dev_queue_xmit() [L2] -> Ring Buffer / PHY [L1]
    ```

    **Источник:** [Understanding Linux Network Internals (Christian Benvenuti)](https://www.oreilly.com/library/view/understanding-linux-network/0596002556/?utm_source=gemini)

42. Какие уровни задействованы при `recv()`?

    **Ответ:** Данные проходят обратный путь снизу вверх:
    1. **L1/L2:** Сетевая карта (NIC) принимает сигнал, проверяет CRC кадра, помещает его через DMA в кольцевой буфер (RX ring buffer) и вызывает аппаратное прерывание.
    2. **L3:** Драйвер по механизму NAPI обрабатывает очередь, ядро проверяет IP-заголовок и контрольную сумму.
    3. **L4:** Пакет передается в TCP-стек, проверяется порт, отправляется ACK, данные помещаются в очередь приема сокета (`sk_receive_queue`).
    4. **L7:** Вызов `recv()` переводит поток из ожидания, копирует байты из памяти ядра в пользовательский буфер процесса и возвращает число прочитанных байт.

    **Пример:**

    ```
    PHY/DMA [L1] -> netif_receive_skb() [L2] -> ip_rcv() [L3] -> tcp_v4_rcv() [L4] -> sys_recv() [L7]
    ```

    **Источник:** [Linux Kernel Documentation: NAPI](https://docs.kernel.org/networking/napi.html?utm_source=gemini)

43. Как OSI проявляется в BSD sockets API?

    **Ответ:** BSD Sockets API абстрагирует слои OSI через типизированные структуры и флаги:
    * Уровень адресации хоста (L3) представлен структурами `struct in_addr` / `struct in6_addr`.
    * Транспортный уровень (L4) выражен через `sin_port` в `sockaddr_in` и типы сокетов (`SOCK_STREAM` / `SOCK_DGRAM`).
    * Канальный уровень (L2) доступен через специализированные адресные семейства `AF_PACKET` и `struct sockaddr_ll`.
    * Прикладной уровень (L7) оперирует чтением и записью потока сырых байт (`read`/`write`/`send`/`recv`).

    **Пример:**

    ```c
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;         // L3: IPv4
    addr.sin_port = htons(8080);       // L4: Порт процесса
    addr.sin_addr.s_addr = INADDR_ANY; // L3: IP-интерфейс
    ```

    **Источник:** [POSIX.1-2017: sys/socket.h](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/sys_socket.h.html?utm_source=gemini)

### Инкапсуляция в коде

44. Как данные проходят через стек TCP/IP в ядре?

    **Ответ:** В ядре Linux данные представляются структурой `struct sk_buff` (socket buffer). Структура содержит указатели `head`, `data`, `tail` и `end`. При движении вниз по стеку вызывается вспомогательная функция `skb_push()`, которая сдвигает указатель `data` назад, резервируя место перед данными для заголовка каждого нового уровня (L4, затем L3, затем L2), исключая лишнее перевыделение и копирование памяти.

    **Пример:**

    ```c
    // Ядро резервирует место под заголовок без копирования данных:
    unsigned char *data = skb_push(skb, sizeof(struct iphdr));
    struct iphdr *iph = (struct iphdr *)data;
    ```

    **Источник:** [Linux Kernel: struct sk_buff documentation](https://docs.kernel.org/networking/kapi.html?utm_source=gemini#c.sk_buff)

45. Где формируется TCP header?

    **Ответ:** В ядре Linux заголовок TCP формируется на уровне L4 внутри подсистемы сетевого стека, преимущественно в функции `tcp_transmit_skb()` (файл `net/ipv4/tcp_output.c`). Функция заполняет поля `source`, `dest`, `seq`, `ack_seq`, битовые флаги (SYN, ACK, FIN и др.), размер окна и вычисляет контрольную сумму TCP.

    **Пример:**

    ```c
    // Ядро заполняет struct tcphdr:
    struct tcphdr *th = tcp_hdr(skb);
    th->source = inet->inet_sport;
    th->dest = inet->inet_dport;
    th->seq = htonl(tp->write_seq);
    ```

    **Источник:** [Linux Kernel Source: net/ipv4/tcp_output.c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/net/ipv4/tcp_output.c?utm_source=gemini)

46. Где добавляется IP header?

    **Ответ:** IP-заголовок формируется на уровне L3 в функциях `ip_build_and_send_pkt()` или `ip_queue_xmit()` (файл `net/ipv4/ip_output.c`). Ядро запрашивает у подсистемы FIB (Forwarding Information Base) маршрут, сдвигает указатель `sk_buff` функцией `skb_push()`, формирует `struct iphdr`, выставляет версию IPv4, поля IHL, TTL, Source/Destination IP и рассчитывает контрольную сумму IP-заголовка.

    **Пример:**

    ```c
    struct iphdr *iph = ip_hdr(skb);
    iph->version  = 4;
    iph->ttl      = ip_select_ttl(inet, &rt->dst);
    iph->daddr    = daddr;
    iph->saddr    = saddr;
    iph->protocol = IPPROTO_TCP;
    ```

    **Источник:** [Linux Kernel Source: net/ipv4/ip_output.c](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/net/ipv4/ip_output.c?utm_source=gemini)

47. Можно ли вручную сформировать пакет?

    **Ответ:** Да. Используя сокет типа Raw Socket с опцией `IP_HDRINCL` (`IPPROTO_RAW`), разработчик в пространстве пользователя может вручную сконструировать L3 (IP) и L4 (TCP/UDP) заголовки. При использовании сокетов семейства `AF_PACKET` (`SOCK_RAW`) на Linux можно вручную собрать даже L2 Ethernet-заголовок, контролируя все байты кадра вплоть до MAC-адресов.

    **Пример:**

    ```c
    int fd = socket(AF_INET, SOCK_RAW, IPPROTO_RAW);
    int opt = 1;
    // Сообщаем ядру, что IP-заголовок собран вручную:
    setsockopt(fd, IPPROTO_IP, IP_HDRINCL, &opt, sizeof(opt));
    ```

    **Источник:** [Linux man-pages: raw(7)](https://man7.org/linux/man-pages/man7/raw.7.html?utm_source=gemini)

48. Что такое raw socket и на каком уровне он работает?

    **Ответ:** Raw Socket (сырой сокет) — это тип сокета, предоставляющий приложению доступ к протоколам без их автоматической обработки транспортным уровнем ядра:
    1. `socket(AF_INET, SOCK_RAW, ...)` работает на **уровне L3**, позволяя читать и отправлять IP-пакеты напрямую (например, для реализации ICMP в утилите `ping`).
    2. `socket(AF_PACKET, SOCK_RAW, ...)` в Linux работает на **уровне L2**, позволяя передавать и перехватывать сырые Ethernet-кадры напрямую на драйвере сетевой карты.

    **Пример:**

    ```c
    // Перехват всех входящих Ethernet-кадров (L2) в Linux:
    int raw_l2 = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL));
    ```

    **Источник:** [Linux man-pages: packet(7)](https://man7.org/linux/man-pages/man7/packet.7.html?utm_source=gemini)

### Практика (C/C++)

49. Как в C получить IP-адрес удалённого клиента?

    **Ответ:** Для получения IP-адреса удаленного узла после успешного `accept()` или `connect()` используется системный вызов `getpeername()`, либо адрес извлекается из выходной структуры `sockaddr_in`, переданной во второй аргумент функции `accept()`. Бинарный адрес преобразуется в строку через `inet_ntop()`.

    **Пример:**

    ```c
    struct sockaddr_in client_addr;
    socklen_t addr_len = sizeof(client_addr);
    int client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &addr_len);

    char ip_str[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &client_addr.sin_addr, ip_str, sizeof(ip_str));
    printf("Client IP: %s\n", ip_str);
    ```

    **Источник:** [Linux man-pages: getpeername(2)](https://man7.org/linux/man-pages/man2/getpeername.2.html?utm_source=gemini)

50. Как получить MAC-адрес?

    **Ответ:** В ОС Linux MAC-адрес собственного сетевого интерфейса можно получить с помощью системного вызова `ioctl()` с запросом `SIOCGIFHWADDR`. Для получения MAC-адреса удаленного хоста в локальной подсети читают системную таблицу ARP ядра через Netlink (`RTM_GETNEIGH`) или файл `/proc/net/arp`.

    **Пример:**

    ```c
    #include <sys/ioctl.h>
    #include <net/if.h>
    #include <unistd.h>

    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    struct ifreq ifr;
    strncpy(ifr.ifr_name, "eth0", IFNAMSIZ - 1);
    ioctl(fd, SIOCGIFHWADDR, &ifr);
    close(fd);

    unsigned char* mac = (unsigned char*)ifr.ifr_hwaddr.sa_data;
    printf("MAC: %02x:%02x:%02x:%02x:%02x:%02x\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    ```

    **Источник:** [Linux man-pages: netdevice(7)](https://man7.org/linux/man-pages/man7/netdevice.7.html?utm_source=gemini)

51. Как реализовать простой TCP клиент?

    **Ответ:** Базовый сценарий клиента включает три этапа: создание сокета через `socket()`, подключение к удаленному IP и порту сервера через `connect()` (инициирует 3-way handshake) и обмен данными функциями `send()` и `recv()`.

    **Пример:**

    ```c
    #include <arpa/inet.h>
    #include <unistd.h>

    int main() {
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        struct sockaddr_in serv_addr = {
            .sin_family = AF_INET,
            .sin_port = htons(8080)
        };
        inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr);

        connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr));
        send(sock, "Ping", 4, 0);

        char buf[128];
        ssize_t bytes = recv(sock, buf, sizeof(buf), 0);
        close(sock);
        return 0;
    }
    ```

    **Источник:** [W. Richard Stevens: UNIX Network Programming, Volume 1 (TCP Echo Client)](https://www.pearson.com/en-us/subject-catalog/p/unix-network-programming-volume-1-the-sockets-networking-api/P200000003347?utm_source=gemini)

52. Как реализовать UDP сервер?

    **Ответ:** Так как UDP не требует установления соединения, серверу не нужны вызовы `listen()` и `accept()`. Он создает датаграммный сокет `SOCK_DGRAM`, привязывает его к адресу и порту вызовом `bind()` и сразу читает входящие датаграммы через `recvfrom()`, сохраняя адрес отправителя для ответа вызовом `sendto()`.

    **Пример:**

    ```c
    #include <arpa/inet.h>
    #include <unistd.h>

    int main() {
        int sock = socket(AF_INET, SOCK_DGRAM, 0);
        struct sockaddr_in addr = {
            .sin_family = AF_INET,
            .sin_port = htons(9090),
            .sin_addr.s_addr = INADDR_ANY
        };
        bind(sock, (struct sockaddr*)&addr, sizeof(addr));

        char buf[256];
        struct sockaddr_in client;
        socklen_t len = sizeof(client);
        ssize_t n = recvfrom(sock, buf, sizeof(buf), 0, (struct sockaddr*)&client, &len);
        sendto(sock, "ACK", 3, 0, (struct sockaddr*)&client, len);
        close(sock);
        return 0;
    }
    ```

    **Источник:** [Linux man-pages: recvfrom(2)](https://man7.org/linux/man-pages/man2/recvfrom.2.html?utm_source=gemini)

53. Чем отличается blocking и non-blocking socket?

    **Ответ:** По умолчанию сокет является блокирующим (blocking): вызовы `recv()` или `accept()` переводят поток ОС в спящее состояние (`TASK_INTERRUPTIBLE`) до появления данных в буфере или нового соединения. На неблокирующем сокете (non-blocking, флаг `O_NONBLOCK` через `fcntl`) вызовы возвращают управление немедленно: если данных нет, функция возвращает `-1`, а переменная `errno` устанавливается в `EWOULDBLOCK` или `EAGAIN`, что позволяет организовывать мультиплексирование через `epoll` или `kqueue`.

    **Пример:**

    ```c
    #include <fcntl.h>
    // Перевод сокета в неблокирующий режим:
    int flags = fcntl(sock, F_GETFL, 0);
    fcntl(sock, F_SETFL, flags | O_NONBLOCK);
    ```

    **Источник:** [Linux man-pages: fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html?utm_source=gemini)

### Debugging и анализ

54. Как с помощью tcpdump понять уровень проблемы?

    **Ответ:** Анализ вывода `tcpdump` по уровням:
    1. **L2/L3:** Видны непрерывные широковещательные запросы `ARP who-has X.X.X.X tell Y.Y.Y.Y` без ответов Reply -> проблема L2/L3 связности или изоляции портов.
    2. **L3:** Возвращаются служебные пакеты `ICMP host unreachable` или `time exceeded` -> проблема с маршрутом или петля TTL.
    3. **L4:** Видны исходящие флаги `[S]` (SYN), а в ответ возвращаются пакеты `[R.]` (RST/ACK) -> целевой порт закрыт или заблокирован файрволом. Если в ответ тишина -> пакеты молча дропаются фильтром.
    4. **L7:** Рукопожатие TCP проходит успешно, но нет сессий `HTTP/TLS Application Data` -> зависание бэкенда.

    **Пример:**

    ```bash
    # Просмотр трафика с подробными заголовками L2-L4:
    tcpdump -enni eth0 host 192.168.1.50
    ```

    **Источник:** [tcpdump(1) manual page](https://www.tcpdump.org/manpages/tcpdump.1.html?utm_source=gemini)

55. Как Wireshark отображает уровни OSI?

    **Ответ:** Интерфейс разбора пакета в Wireshark (дерево Packet Details) визуально построен строго в виде иерархических блоков, отражающих инкапсуляцию модели OSI снизу вверх:
    * **Frame:** физические параметры захвата (длина, время, интерфейс — L1).
    * **Ethernet II:** адреса Source/Destination MAC, EtherType (L2).
    * **Internet Protocol Version 4/6:** IP-адреса, TTL, протокол (L3).
    * **Transmission Control Protocol:** порты, порядковые номера, флаги (L4).
    * **Hypertext Transfer Protocol:** заголовки, тело запроса (L7).

    **Пример:**

    ```
    > Frame 1: 74 bytes on wire (L1)
    > Ethernet II, Src: 00:1a:2b:3c:4d:5e, Dst: a4:91:b1:cd:23:01 (L2)
    > Internet Protocol Version 4, Src: 192.168.1.10, Dst: 93.184.216.34 (L3)
    > Transmission Control Protocol, Src Port: 54321, Dst Port: 80 (L4)
    > Hypertext Transfer Protocol (L7)
    ```

    **Источник:** [Wireshark User’s Guide: Packet Details Window](https://www.wireshark.org/docs/wsug_html_chunked/ChUsePacketDetailsPaneSection.html?utm_source=gemini)

56. Как определить потерю пакетов?

    **Ответ:** Потерю пакетов определяют по признакам:
    1. **ICMP:** статистика утилиты `ping` показывает процент потерь (`packet loss > 0%`).
    2. **TCP:** наличие множественных дубликатов подтверждений `TCP Dup ACK` и повторных отправок `TCP Retransmission` в дампах сетевого анализатора.
    3. **Статистика ОС:** счетчики `retrans` и `drop` в выводе утилит ядра (`netstat -s`, `ss -ti` или `ip -s link`).

    **Пример:**

    ```bash
    # Диагностика потерь на уровне интерфейса:
    ip -s link show dev eth0
    # Поля RX/TX: dropped, errors, overruns
    ```

    **Источник:** [Brendan Gregg: Systems Performance (Network Drops and Errors)](https://www.brendangregg.com/methodology.html?utm_source=gemini)

57. Как анализировать TCP retransmissions?

    **Ответ:** Анализ производится фильтрацией сетевого дампа по признакам повторной передачи:
    * В Wireshark используют фильтр `tcp.analysis.retransmission`.
    * Анализируют интервалы между исходным пакетом и ретрансмиссией: если повтор произошел через ~200 мс, сработал таймер RTO (Retransmission Timeout); если повтор произошел немедленно после пачки `tcp.analysis.duplicate_ack`, сработал механизм Fast Retransmit.

    **Пример:**

    ```bash
    # Извлечение только повторных отправок через tshark:
    tshark -r capture.pcap -Y "tcp.analysis.retransmission"
    ```

    **Источник:** [Wireshark Wiki: TCP Analysis Infra](https://wiki.wireshark.org/TCP_Analysis?utm_source=gemini)

58. Как увидеть handshake в дампе?

    **Ответ:** Для обнаружения трехэтапного рукопожатия TCP в сетевом дампе фильтруют трафик по IP и портам сессии, обращая внимание на флаги TCP:
    1. Пакет 1: `[SYN]`, `Seq = 0` (относительный).
    2. Пакет 2: `[SYN, ACK]`, `Seq = 0`, `Ack = 1`.
    3. Пакет 3: `[ACK]`, `Seq = 1`, `Ack = 1`.

    **Пример:**

    ```bash
    # Фильтр Wireshark для поиска всех рукопожатий:
    tcp.flags.syn == 1
    ```

    **Источник:** [RFC 793: Transmission Control Protocol (Handshake analysis)](https://datatracker.ietf.org/doc/html/rfc793?utm_source=gemini)

### Производительность

59. Где возникает bottleneck чаще всего?

    **Ответ:** В зависимости от архитектуры узкое место возникает:
    1. **Переключение контекста и прерывания ядра:** при обработке миллионов мелких пакетов ядро тратит 80% времени на softirq/NAPI и переходы `User <-> Kernel`.
    2. **Копирование памяти:** копирование буфера между ядром и приложением перегружает шину оперативной памяти (Memory Bandwidth).
    3. **Буферы очередей (Bufferbloat):** чрезмерно раздутые буферы сетевого оборудования создают гигантские задержки (latency spikes) под нагрузкой.
    4. **Алгоритмы Congestion Control:** сброс окна TCP при случайных (не связанных с перегрузкой) потерях в Wi-Fi.

    **Пример:**

    ```bash
    # Мониторинг времени ядра в обработке сетевых softirq:
    mpstat -P ALL 1
    # Процент в колонке %soft указывает на сетевую нагрузку ядра
    ```

    **Источник:** [Bufferbloat: Dark Buffers in the Internet (ACM Queue)](https://queue.acm.org/detail.cfm?id=2071893?utm_source=gemini)

60. Как влияет MTU на передачу данных?

    **Ответ:** MTU (Maximum Transmission Unit) определяет максимальный размер полезного блока L3-пакета (обычно 1500 байт для Ethernet), который сетевой интерфейс может передать без фрагментации. Увеличение MTU (например, использование Jumbo Frames до 9000 байт в ЦОД):
    * Уменьшает суммарное количество пакетов и прерываний процессора на гигабайт переданных данных в 6 раз.
    * Снижает долю служебных заголовков по отношению к полезной нагрузке (Protocol Overhead), повышая чистый Throughput.

    **Пример:**

    ```bash
    # Установка Jumbo Frames (9000 байт) на интерфейсе:
    ip link set dev eth0 mtu 9000
    ```

    **Источник:** [IETF RFC 894: Transmission of IP Datagrams over Ethernet](https://datatracker.ietf.org/doc/html/rfc894?utm_source=gemini)

61. Что такое fragmentation?

    **Ответ:** Фрагментация IP — это процесс разделения одного крупного L3 IP-пакета на два или более меньших IP-пакетов маршрутизатором или хостом-отправителем, когда исходный размер пакета превышает MTU следующего сетевого линка на пути следования. Каждый фрагмент получает одинаковый идентификатор `Identification`, флаг `MF` (More Fragments) и смещение `Fragment Offset`.

    **Пример:**

    ```
    Исходный пакет (3000 байт) -> Сеть с MTU 1500:
    Фрагмент 1: 1500 байт (IP Header + 1480B data, Offset=0, MF=1)
    Фрагмент 2: 1500 байт (IP Header + 1480B data, Offset=185, MF=1)
    Фрагмент 3: 60 байт   (IP Header + 40B data,   Offset=370, MF=0)
    ```

    **Источник:** [IETF RFC 791: IP Fragmentation and Reassembly](https://datatracker.ietf.org/doc/html/rfc791?utm_source=gemini#section-3.2?utm_source=gemini)

62. Как избежать fragmentation?

    **Ответ:** Основные методы предотвращения фрагментации:
    1. Выставление бита **DF (Don't Fragment)** в заголовке IP: маршрутизаторы не будут резать пакет, а отбросят его и вернут ICMP Type 3 Code 4 («Fragmentation Needed and DF set»).
    2. Использование механизма **PMTUD (Path MTU Discovery)**: хост автоматически определяет минимальный MTU на всем маршруте с помощью сообщений ICMP и уменьшает размер пакетов.
    3. Ограничение **TCP MSS (Maximum Segment Size)**: согласование максимального размера TCP-сегмента при рукопожатии (`MSS = MTU - 40 байт` для IPv4), либо переписывание MSS транзитным маршрутизатором (MSS Clamping).

    **Пример:**

    ```bash
    # Пример правила iptables для предотвращения фрагментации (MSS Clamping):
    iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
    ```

    **Источник:** [IETF RFC 1191: Path MTU Discovery](https://datatracker.ietf.org/doc/html/rfc1191?utm_source=gemini)

63. Как latency зависит от уровней стека?

    **Ответ:** Каждая стадия сетевого конвейера добавляет свою составляющую в задержку (End-to-End Latency):
    * **L1:** физическая задержка распространения сигнала в среде (скорость света в стекле $\approx 5$ мкс на км) и задержка сериализации (время выталкивания битов в кабель).
    * **L2:** задержки коммутации (store-and-forward / cut-through) и время ожидания в очереди порта коммутатора.
    * **L3:** время обработки маршрутизатором (поиск в FIB, декремент TTL, фильтрация ACL).
    * **L4:** задержки рукопожатий (RTT на handshake), тайм-ауты сборки очередей (Head-of-Line Blocking) и задержки алгоритма Нейгла (`TCP_NODELAY`).
    * **L7/ОС:** переключения контекста ядра, копирование данных и ожидание вызова планировщика процессов приложения.

    **Пример:**

    ```c
    // Отключение алгоритма Нейгла для снижения задержки на L4:
    int flag = 1;
    setsockopt(sock, IPPROTO_TCP, TCP_NODELAY, (char*)&flag, sizeof(int));
    ```

    **Источник:** [Computer Systems: A Programmer's Perspective (Network Latency Factors)](https://csapp.cs.cmu.edu/?utm_source=gemini)

    ---

## 🧠 Глубокие вопросы (архитектура)

64. Почему OSI считается теоретической моделью?

    **Ответ:** Модель OSI была спроектирована комитетом ISO в отрыве от практического программирования и аппаратных ограничений. В ней:
    1. Сеансовый (L5) и представительный (L6) уровни практически пусты для большинства реальных задач и создают избыточные абстракции.
    2. Функции дублируются: контроль ошибок, адресация и управление потоком присутствуют сразу на L2, L3 и L4.
    3. Реальные высокоскоростные протоколы интернета строились по принципам прагматичности и обратной совместимости, поэтому строгие формальные протоколы OSI (X.400, CLNP) не выдержали конкуренции со стеком TCP/IP.

    **Пример:**

    ```
    Теория OSI: 7 независимых уровней со строгими сервисными границами (SAP).
    Практика: сокеты ОС отдают приложению сразу L4-поток, минуя L5 и L6.
    ```

    **Источник:** [Andrew S. Tanenbaum: Computer Networks (A Critique of the OSI Model and Protocols)](https://www.pearson.com/en-us/subject-catalog/p/computer-networks/P200000003333?utm_source=gemini)

65. Где нарушается строгая слоистость в TCP/IP?

    **Ответ:** В реальном стеке протоколы регулярно нарушают слоистость (Cross-Layer Leaks):
    1. **Контрольная сумма TCP/UDP (L4):** вычисляется с использованием «псевдозаголовка», содержащего IP-адреса источника и назначения из сетевого уровня (L3).
    2. **ICMP (L3):** инкапсулируется непосредственно внутрь IP-пакета, хотя концептуально управляет поведением самого же уровня L3.
    3. **ARP (L2.5):** передает IP-адреса внутри Ethernet-кадра, не являясь полноценным протоколом ни L2, ни L3.
    4. **NAT (L3/L4):** изменяет не только IP-адреса, но и номера портов транспортного уровня для трансляции соединений.

    **Пример:**

    ```
    TCP Pseudo-Header (L4 залезает в поля L3):
    [ Source IP (32 bit) | Dest IP (32 bit) | Zero (8) | Protocol (8) | TCP Length (16) ]
    ```

    **Источник:** [RFC 793: TCP Checksum Calculation and Pseudo-header](https://datatracker.ietf.org/doc/html/rfc793?utm_source=gemini#section-3.1?utm_source=gemini)

66. Почему некоторые протоколы "протекают" между уровнями?

    **Ответ:** Утечки абстракций (Cross-layering) допускаются намеренно ради **производительности**, **целостности данных** и **диагностики**:
    * Протоколы L4 проверяют адреса L3 в псевдозаголовке, чтобы пакет, ошибочно доставленный не на тот интерфейс, был отброшен.
    * Межсетевые экраны со с сохранением состояния (Stateful Firewalls) и NAT обязаны сопоставлять данные L3 (IP) и L4 (Port), чтобы отслеживать сессии.
    * Полная изоляция слоев требует дублирования информации и лишних операций копирования в памяти ядра.

    **Пример:**

    ```
    NAT транслирует сокетное соединение: подменяет L3 IP и L4 Port одновременно.
    ```

    **Источник:** [Joel Spolsky: The Law of Leaky Abstractions](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/?utm_source=gemini)

67. Как современные протоколы (например QUIC) меняют модель?

    **Ответ:** Протокол QUIC (RFC 9000), лежащий в основе HTTP/3:
    1. **Переносит транспортный уровень в User-Space:** QUIC работает поверх UDP, поэтому стек надежной доставки и контроля перегрузок компилируется прямо в бинарник приложения, а не обновляется вместе с ядром ОС.
    2. **Сливает L4 и L6:** протокол TLS 1.3 намертво встроен внутрь самого QUIC (рукопожатие безопасности объединено с транспортным рукопожатием за 1 RTT).
    3. **Устраняет Head-of-Line Blocking:** мультиплексирует независимые потоки данных без блокировки соседних потоков при потере пакета.

    **Пример:**

    ```
    HTTP/2: [ HTTP/2 (L7) ] -> [ TLS 1.3 (L6) ] -> [ TCP (L4) ] -> [ IP (L3) ]
    HTTP/3: [ HTTP/3 (L7) ] -> [ QUIC (Шифрование + Надежный транспорт в User-Space) ] -> [ UDP (L4) ] -> [ IP (L3) ]
    ```

    **Источник:** [IETF RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://datatracker.ietf.org/doc/html/rfc9000?utm_source=gemini)

68. Можно ли реализовать свою сетевую модель?

    **Ответ:** Да. В закрытых кластерах, суперкомпьютерах и HPC-сетях часто отказываются от стандартной модели TCP/IP в пользу специализированных архитектур с прямым доступом к памяти:
    * **RDMA (RoCE / InfiniBand):** сетевая карта сама выполняет чтение и запись напрямую в память удаленного сервера без участия CPU и ядра ОС.
    * **Собственные протоколы L2:** промышленные шины (EtherCAT, Profinet) убирают уровни L3/L4 для обеспечения сверхмалых микросекундных задержек в реальном времени.

    **Пример:**

    ```
    Архитектура RDMA:
    App Memory (User-Space) <===[ Прямой доступ через PCIe/NIC ]===> Remote App Memory
    Ядро ОС и классический TCP/IP стек полностью исключены из передачи.
    ```

    **Источник:** [RDMA Aware Networks Programming User Manual (Mellanox/NVIDIA)](https://network.nvidia.com/files/doc-2020/ethernet-rdma-handbook.pdf?utm_source=gemini)

69. Какие уровни реализуются в user-space, а какие в kernel?

    **Ответ:** В классических POSIX ОС:
    * **User-Space:** уровень приложений (L7), включая прикладные протоколы (HTTP, DNS) и библиотеки шифрования (TLS/SSL).
    * **Kernel-Space:** транспортный уровень (L4 — TCP, UDP), сетевой уровень (L3 — IPv4, IPv6, ICMP, маршрутизация, фильтрация netfilter/iptables) и программная логика канального уровня (L2 — ARP, управление сетевыми интерфейсами).
    * **Аппаратный уровень (NIC Hardware/Firmware):** часть канального уровня (L2 — MAC, расчет CRC32) и физический уровень (L1 — трансивер PHY, кодирование сигнала).

    **Пример:**

    ```
    [ User-Space ] -> HTTP-парсер, OpenSSL (TLS)
    =================== Системный вызов (Syscall Boundary) ===================
    [ Kernel     ] -> TCP сокеты, Таблица маршрутизации IP, ARP-кэш, qdisc
    =================== Аппаратная шина (PCIe Boundary) ======================
    [ NIC / PHY  ] -> MAC-контроллер, DMA контроллер, кабель (L1)
    ```

    **Источник:** [Robert Love: Linux Kernel Development (Network Architecture)](https://en.wikipedia.org/wiki/Linux_Kernel_Development?utm_source=gemini)

70. Как работает zero-copy networking?

    **Ответ:** В классической схеме данные копируются: `User Buffer -> Kernel Socket Buffer -> NIC DMA Buffer`. Zero-Copy исключает промежуточное копирование через память ядра:
    1. Системный вызов `sendfile()` или `splice()` передает страницы из страничного кэша диска (page cache) напрямую в кольцевой буфер сетевой карты через дескрипторы страниц.
    2. Флаг `MSG_ZEROCOPY` отображает страницы пользовательской памяти напрямую в память для DMA сетевой карты.
    3. Технологии типа **AF_XDP** или **DPDK** выделяют память в User-Space (UMEM), разделяемую напрямую с сетевой картой через кольцевые буферы без участия сетевого стека ядра.

    **Пример:**

    ```c
    // Передача файла в сокет без копирования в пространство пользователя:
    #include <sys/sendfile.h>
    sendfile(socket_fd, file_fd, &offset, file_stat.st_size);
    ```

    **Источник:** [Linux Kernel Documentation: MSG_ZEROCOPY](https://docs.kernel.org/networking/msg_zerocopy.html?utm_source=gemini)

71. Как NIC взаимодействует с OSI слоями?

    **Ответ:** Сетевой адаптер (Network Interface Card):
    * **L1:** микросхема PHY принимает физические аналоговые сигналы из кабеля и преобразует их в последовательность цифровых бит.
    * **L2:** MAC-контроллер собирает биты в кадр, проверяет адрес назначения (Destination MAC), отсеивая чужие кадры (если не включен promiscuous mode), валидирует контрольную сумму кадра (FCS/CRC32) и через шину PCIe DMA выгружает кадр в кольцевой буфер оперативной памяти хоста.
    * **L3/L4 (Hardware Offloading):** современные NIC анализируют заголовки IP и TCP, выполняя валидацию и расчет контрольных сумм и раскладывая входящие пакеты по разным ядрам процессора (RSS).

    **Пример:**

    ```
    Кабель (L1) -> PHY -> MAC Controller (L2 CRC Check) -> PCIe DMA -> RX Ring Buffer RAM
    ```

    **Источник:** [Intel 82599 10 GbE Controller Datasheet (Architecture)](https://www.intel.com/content/www/us/en/content-details/322472/intel-82599-10-gbe-controller-datasheet.html?utm_source=gemini)

72. Что такое offloading (TSO, LRO)?

    **Ответ:** Hardware Offloading — делегирование тяжелых сетевых вычислений от центрального процессора (CPU) аппаратному контроллеру сетевой карты (NIC):
    * **TSO (TCP Segmentation Offload):** ядро формирует один гигантский TCP-сегмент размером до 64 КБ (GSO) и отдает его сетевой карте; сетевая карта самостоятельно нарезает его на пакеты размером под MTU (1500 байт), дублируя заголовки TCP/IP в железе.
    * **LRO / GRO (Large / Generic Receive Offload):** сетевая карта или нижний слой драйвера объединяет пачку последовательно пришедших мелких TCP-сегментов в один большой суперпакет перед передачей его в сетевой стек ядра, сокращая накладные расходы процессора на обход стека.
    * **Checksum Offloading:** расчет и проверка контрольных сумм IP, TCP и UDP аппаратурой сетевой карты.

    **Пример:**

    ```bash
    # Просмотр и включение TSO на сетевой карте:
    ethtool -k eth0 | grep tcp-segmentation-offload
    ethtool -K eth0 tso on
    ```

    **Источник:** [Linux Kernel Documentation: Segmentation Offloads](https://docs.kernel.org/networking/scaling.html?utm_source=gemini#segmentation-offloads)

73. Как kernel networking stack обрабатывает пакеты?

    **Ответ:** Конвейер обработки пакета в Linux:
    1. Сетевая карта складывает кадр в память по DMA и генерирует аппаратное прерывание (Hard IRQ).
    2. Ядро выполняет минимальный обработчик прерывания, отключает прерывания сетевой карты и планирует программное прерывание NAPI (SoftIRQ).
    3. Подсистема NAPI в контексте `ksoftirqd` без прерываний читает пачку пакетов из DMA-буфера в цикле (polling).
    4. Пакет оборачивается в `struct sk_buff` и передается функции `netif_receive_skb()`.
    5. Кадр проходит хуки TC (Traffic Control) и eBPF/XDP.
    6. Вызывается L3 обработчик `ip_rcv()`: проверка целостности, фильтрация Netfilter (PREROUTING).
    7. Подсистема маршрутизации решает, локальный ли это пакет; если да, вызывается хук INPUT и L4-функция `tcp_v4_rcv()`.
    8. Пакет сопоставляется с сокетом и помещается в очередь приема, а ждущий процесс пробуждается.

    **Пример:**

    ```
    Hard IRQ -> SoftIRQ (NAPI poll) -> XDP/eBPF -> ip_rcv() -> Netfilter -> tcp_v4_rcv() -> Socket Queue -> Application
    ```

    **Источник:** [Red Hat Enterprise Linux Network Performance Tuning Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/monitoring_and_managing_system_status_and_performance/tuning-network-performance_monitoring-and-managing-system-status-and-performance?utm_source=gemini)

74. Где происходит переключение контекста при сетевых вызовах?

    **Ответ:** Переключение контекста (Context Switch) происходит на двух рубежах:
    1. **Переход User <-> Kernel:** при выполнении системных вызовов `send()` / `recv()` процессор меняет уровень привилегий (Ring 3 -> Ring 0) через команду `syscall`. Это системный переход контекста привилегий.
    2. **Переключение потоков планировщиком:** если блокирующий сокет пуст при вызове `recv()`, ядро переводит поток в состояние `TASK_INTERRUPTIBLE` и вызывает планировщик `schedule()`. Планировщик сохраняет регистры текущего потока и переключает CPU на исполнение другого процесса. Когда сетевая карта через прерывание доставит пакет, ядро вернет поток в очередь `runqueue`, и планировщик выполнит обратное переключение контекста на вызывающий процесс.

    **Пример:**

    ```
    Application (Ring 3) --[ syscall: recv() ]--> Kernel (Ring 0)
                                                        |
                                             Данных нет? Поток спит
                                                        |
                                                schedule() -> Переключение на другой процесс
                                                        |
                                          Пакет пришел по IRQ -> Поток разбужен
                                                        |
    Application <--[ возврат данных из ядра ]-----------+
    ```

    **Источник:** [Linux man-pages: sched(7)](https://man7.org/linux/man-pages/man7/sched.7.html?utm_source=gemini)
