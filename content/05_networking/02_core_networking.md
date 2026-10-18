# Вопросы: Core Networking (с уклоном в C/C++)

## 1. IPv4 vs IPv6

### Базовый уровень
1. Что такое IPv4?

   **Ответ:** IPv4 — протокол межсетевого уровня с 32-битными адресами. Он доставляет дейтаграммы между сетями без гарантии доставки и порядка.

   **Пример:**

   ```bash
   ip -4 address show  # Linux: IPv4-адреса интерфейсов
   ```

   **Типичная ошибка:** Приписывать IPv4 повторную передачу потерянных пакетов: её обеспечивает, например, TCP.

   **Источник:** [RFC 791, §1.2](https://www.rfc-editor.org/rfc/rfc791#section-1.2).

2. Что такое IPv6?

   **Ответ:** IPv6 — протокол межсетевого уровня со 128-битными адресами и базовым заголовком длиной 40 байт. Это отдельная версия IP; обмен с IPv4 требует поддержки обеих версий или механизма перехода.

   **Пример:**

   ```bash
   ip -6 address show  # Linux: IPv6-адреса интерфейсов
   ```

   **Типичная ошибка:** Считать IPv6 автоматически совместимым с IPv4 на уровне пакетов.

   **Источник:** [RFC 8200, §1, §3](https://www.rfc-editor.org/rfc/rfc8200#section-3).

3. Почему IPv6 был разработан как замена IPv4?

   **Ответ:** Главная причина — расширение адресного пространства с 32 до 128 бит. IPv6 также изменил формат заголовка и обработку расширений; переход требует поддержки со стороны узлов и сети.

   **Типичная ошибка:** Считать, что смена версии IP сама по себе увеличивает пропускную способность канала.

   **Источник:** [RFC 8200, §1](https://www.rfc-editor.org/rfc/rfc8200#section-1).

4. Какова длина IPv4-адреса в битах?

   **Ответ:** IPv4-адрес занимает 32 бита, то есть 4 октета.

   **Пример:**

   ```c
   #include <netinet/in.h>

   _Static_assert(sizeof(struct in_addr) == 4, "IPv4: 4 bytes"); // C11, POSIX
   ```

   **Типичная ошибка:** Путать длину бинарного адреса с длиной строки вида `192.0.2.1`.

   **Источник:** [RFC 791, §3.1](https://www.rfc-editor.org/rfc/rfc791#section-3.1).

5. Какова длина IPv6-адреса в битах?

   **Ответ:** IPv6-адрес занимает 128 бит, то есть 16 октетов.

   **Пример:**

   ```c
   #include <netinet/in.h>

   _Static_assert(sizeof(struct in6_addr) == 16, "IPv6: 16 bytes"); // C11, POSIX
   ```

   **Типичная ошибка:** Выделять для IPv6 те же четыре байта, что и для IPv4.

   **Источник:** [RFC 4291, §2](https://www.rfc-editor.org/rfc/rfc4291#section-2).

6. Сколько примерно уникальных адресов поддерживает IPv4?

   **Ответ:** 32 бита дают 2³² = 4 294 967 296 комбинаций — около 4,3 миллиарда адресов. Это размер всего пространства, включая специальные диапазоны.

   **Типичная ошибка:** Считать все эти адреса доступными для публичного назначения отдельным хостам.

   **Источник:** [RFC 791, §3.2](https://www.rfc-editor.org/rfc/rfc791#section-3.2).

7. Почему адресного пространства IPv4 оказалось недостаточно?

   **Ответ:** Количество устройств и сетей выросло, а 32-битное пространство ограничено. Часть адресов имеет специальное назначение; историческое распределение крупных блоков также снижало эффективность использования. NAT позволяет повторно использовать частные адреса, но усложняет сквозную связность.

   **Типичная ошибка:** Считать NAT расширением самого 32-битного адресного пространства.

   **Источник:** [RFC 8200, §1; RFC 3022, §1](https://www.rfc-editor.org/rfc/rfc8200#section-1). [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022#section-1).

8. Как записывается IPv4-адрес?

   **Ответ:** Обычная запись IPv4 — четыре десятичных октета от 0 до 255, разделённые точками. Префикс сети и номер порта записывают отдельно.

   **Пример:**

   ```c
   #include <arpa/inet.h>

   int main(void) {
       struct in_addr address;
       return inet_pton(AF_INET, "192.0.2.1", &address) == 1 ? 0 : 1;
   }
   ```

   **Типичная ошибка:** Принимать значение октета больше 255 или передавать строку с `/24` в `inet_pton()`.

   **Источник:** [RFC 3986, §3.2.2; inet_pton(3)](https://www.rfc-editor.org/rfc/rfc3986#section-3.2.2). [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html).

9. Как записывается IPv6-адрес?

   **Ответ:** IPv6 обычно записывают как восемь групп по 16 бит в шестнадцатеричном виде, разделённых двоеточиями. Ведущие нули групп и одну последовательность нулевых групп можно сокращать.

   **Пример:**

   ```c
   #include <arpa/inet.h>

   int main(void) {
       struct in6_addr address;
       return inet_pton(AF_INET6, "2001:db8::1", &address) == 1 ? 0 : 1;
   }
   ```

   **Типичная ошибка:** Разделять адрес и порт последним двоеточием: в URL с портом нужны скобки, например `[2001:db8::1]:443`.

   **Источник:** [RFC 4291, §2.2](https://www.rfc-editor.org/rfc/rfc4291#section-2.2). [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html).

10. Что означает шестнадцатеричная запись IPv6?

   **Ответ:** Каждая шестнадцатеричная цифра кодирует четыре бита; группа из четырёх цифр — 16 бит. Допустимы цифры `0–9` и буквы `a–f` без учёта регистра.

   **Типичная ошибка:** Читать группу `0010` как десятичное 10: её значение равно 16.

   **Источник:** [RFC 4291, §2.2](https://www.rfc-editor.org/rfc/rfc4291#section-2.2).

11. Что такое сокращённая запись IPv6?

   **Ответ:** Это запись с удалёнными ведущими нулями внутри групп и, при необходимости, с заменой последовательности нулевых групп на `::`. Адрес при этом не меняется.

   **Пример:**

   ```c
   #include <arpa/inet.h>
   #include <stdio.h>

   int main(void) {
       struct in6_addr address;
       char text[INET6_ADDRSTRLEN];
       if (inet_pton(AF_INET6, "2001:0db8:0000:0000:0000:0000:0000:0001",
                     &address) != 1) return 1;
       if (inet_ntop(AF_INET6, &address, text, sizeof text) == NULL) return 1;
       puts(text); // Обычно: 2001:db8::1
       return 0;
   }
   ```

   **Типичная ошибка:** Удалять конечные нули группы: `1000` и `1` обозначают разные значения.

   **Источник:** [RFC 4291, §2.2; RFC 5952, §4](https://www.rfc-editor.org/rfc/rfc5952#section-4). [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html).

12. Когда в IPv6 можно использовать `::`?

   **Ответ:** В допустимой записи IPv6 `::` заменяет одну или несколько последовательных нулевых 16-битных групп и используется не более одного раза. Каноническая запись по RFC 5952 сокращает самую длинную последовательность минимум из двух групп; при равенстве выбирает первую.

   **Типичная ошибка:** Считать неканоническую, но допустимую запись вроде `2001:db8::1:1:1:1:1` синтаксически неверной: здесь `::` заменяет одну группу.

   **Источник:** [RFC 4291, §2.2; RFC 5952, §4.2](https://www.rfc-editor.org/rfc/rfc5952#section-4.2).

13. Почему `::` нельзя использовать более одного раза в адресе?

   **Ответ:** Число пропущенных групп вычисляют так, чтобы восстановить 128-битный адрес. Два сокращения сделали бы распределение пропущенных нулей между ними неоднозначным, поэтому такой синтаксис запрещён.

   **Пример:**

   ```c
   #include <arpa/inet.h>

   int main(void) {
       struct in6_addr address;
       // Для недопустимого текста inet_pton возвращает 0.
       return inet_pton(AF_INET6, "2001::db8::1", &address) == 0 ? 0 : 1;
   }
   ```

   **Типичная ошибка:** Пытаться самостоятельно угадывать число нулевых групп для каждого из двух `::`.

   **Источник:** [RFC 4291, §2.2](https://www.rfc-editor.org/rfc/rfc4291#section-2.2). [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html).

14. Чем отличается структура IPv4 header от IPv6 header?

   **Ответ:** Заголовок IPv4 имеет длину 20–60 байт с учётом options; базовый заголовок IPv6 — 40 байт. В IPv6 нет IHL и checksum заголовка, TTL заменён Hop Limit, Protocol — Next Header. Options и сведения о фрагментации передаются заголовками расширения.

   **Пример:**

   ```bash
   # Linux: отдельно посмотреть заголовки пакетов обеих версий.
   # Потребуются права на захват; завершить каждый запуск через Ctrl-C.
   tcpdump -ni any -c 5 -v ip
   tcpdump -ni any -c 5 -v ip6
   ```

   **Типичная ошибка:** Считать, что все заголовки IPv6 вместе всегда занимают только 40 байт.

   **Источник:** [RFC 791, §3.1; RFC 8200, §3–4](https://www.rfc-editor.org/rfc/rfc8200#section-3).

15. Почему IPv6 header считается проще IPv4 header?

   **Ответ:** Базовый заголовок IPv6 имеет фиксированный размер и меньше полей; контрольная сумма заголовка отсутствует, поэтому её не нужно пересчитывать после изменения Hop Limit. При этом разбор цепочки заголовков расширения может быть сложным.

   **Типичная ошибка:** Делать вывод, что любой пакет IPv6 обрабатывается быстрее IPv4 независимо от реализации и расширений.

   **Источник:** [RFC 8200, §1, §3–4](https://www.rfc-editor.org/rfc/rfc8200#section-1).


### Средний уровень
16. Какие поля есть в IPv4 header?

   **Ответ:** Version, IHL, поле DSCP/ECN (исторически ToS), Total Length, Identification, Flags, Fragment Offset, TTL, Protocol, Header Checksum, Source и Destination Address; при наличии — Options и Padding. IHL задаёт длину заголовка в 32-битных словах.

   **Типичная ошибка:** Считать IPv4-заголовок всегда равным 20 байтам и читать транспортный заголовок по фиксированному смещению.

   **Источник:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791).

17. Какие поля убраны или изменены в IPv6 header?

   **Ответ:** В IPv6 нет IHL, Header Checksum и полей фрагментации в базовом заголовке. TTL заменён Hop Limit, Protocol — Next Header; Traffic Class несёт DSCP/ECN, добавлен Flow Label. Payload Length не включает 40 байт базового заголовка.

   **Типичная ошибка:** Трактовать Payload Length так же, как IPv4 Total Length, включающий заголовок.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200); [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791).

18. Что такое Hop Limit в IPv6?

   **Ответ:** Hop Limit — 8-битный предел числа пересылок пакета маршрутизаторами. При пересылке значение уменьшается на единицу; исчерпавший лимит пакет отбрасывается, обычно с ICMPv6 Time Exceeded. Это ограничивает жизнь пакета при петлях.

   **Типичная ошибка:** Понимать Hop Limit как время в миллисекундах.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

19. Чем Hop Limit отличается от TTL?

   **Ответ:** IPv6 Hop Limit явно считает переходы. IPv4 TTL исторически определён через время жизни с уменьшением как минимум на единицу при обработке маршрутизатором; в современных сетях он практически используется как предел переходов.

   **Типичная ошибка:** Считать TTL точным временем доставки или временем хранения DNS-записи: DNS TTL — другое поле другого протокола.

   **Источник:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791); [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

20. Есть ли checksum в IPv6 header?

   **Ответ:** В базовом заголовке IPv6 контрольной суммы нет. Контроль ошибок остаётся на других уровнях: например, Ethernet FCS и TCP/UDP checksum с IPv6 pseudo-header.

   **Типичная ошибка:** Считать отсутствие checksum IP-заголовка отсутствием проверки целостности TCP-сегмента.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

21. Почему checksum убрали из IPv6 header?

   **Ответ:** Убрали дополнительную проверку заголовка и необходимость пересчёта на маршрутизаторе при изменении Hop Limit. Проверки канального и транспортного уровней покрывают соответствующие данные, хотя не являются полной заменой криптографической защиты.

   **Типичная ошибка:** Считать TCP checksum средством защиты от намеренной подмены пакета.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

22. Что такое extension headers в IPv6?

   **Ответ:** Это дополнительные заголовки между базовым IPv6-заголовком и протоколом верхнего уровня. Поле Next Header связывает цепочку; примеры — Hop-by-Hop Options, Routing, Fragment и Destination Options. Парсер должен учитывать длины и границы каждого элемента.

   **Типичная ошибка:** Искать TCP сразу после первых 40 байт во всех IPv6-пакетах.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

23. Какие преимущества даёт IPv6 по сравнению с IPv4?

   **Ответ:** IPv6 даёт значительно больше адресов, фиксированный базовый заголовок, расширения и встроенную архитектуру multicast и автоконфигурации. Достаточное адресное пространство позволяет строить сети без NAT ради экономии адресов; доступ всё равно ограничивают политиками безопасности.

   **Типичная ошибка:** Обещать автоматическое шифрование или меньшую задержку только из-за IPv6.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

24. Какие сложности внедрения IPv6 существуют на практике?

   **Ответ:** Нужно обеспечить маршрутизацию, адресный план, DNS AAAA, firewall, мониторинг и поддержку приложений. Отдельно проверяют PMTU, ICMPv6 и зависимость от IPv4-сервисов; частично работающий IPv6 может создавать задержки подключений.

   **Типичная ошибка:** Проверить только выдачу адреса и считать сквозную IPv6-связность готовой.

   **Источник:** [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

25. Что такое dual stack?

   **Ответ:** Dual stack — одновременная поддержка IPv4 и IPv6 узлом или сетью. Приложение может получать A и AAAA и устанавливать соединение по доступной версии; поддержка обеих не означает автоматическую трансляцию между ними.

   **Пример:**

   ```bash
   curl -4 --connect-timeout 5 https://example.com/
   curl -6 --connect-timeout 5 https://example.com/
   ```

   **Типичная ошибка:** Считать наличие IPv6-адреса доказательством наличия рабочего IPv6-маршрута до сервера.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

26. Что такое IPv4-mapped IPv6 address?

   **Ответ:** Адрес вида `::ffff:192.0.2.1` представляет IPv4 endpoint в IPv6 socket API. Префикс — `::ffff:0:0/96`. Это представление для совместимости, а не обычный маршрутизируемый IPv6-адрес удалённого узла.

   **Типичная ошибка:** Обходить IPv4 ACL через mapped-представление, проверяя только семейство AF_INET6.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

27. Что такое link-local IPv6 адрес?

   **Ответ:** Link-local — адрес для связи в пределах одного канала; используется диапазон `fe80::/10`. Маршрутизаторы не пересылают такие пакеты на другие каналы. Для однозначного выбора интерфейса API может требовать scope ID, например для `fe80::1%eth0`.

   **Типичная ошибка:** Передавать link-local адрес без идентификатора зоны при наличии нескольких интерфейсов.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

28. Что такое global unicast IPv6 адрес?

   **Ответ:** Global unicast — адрес для глобальной индивидуальной адресации. Наличие такого адреса не гарантирует опубликованный маршрут, открытый firewall или доступный сервис. Его нужно отличать от link-local, loopback и ULA.

   **Типичная ошибка:** Называть любой IPv6-адрес глобальным или автоматически доступным из интернета.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

29. Что такое unique local IPv6 адрес?

   **Ответ:** ULA предназначены для локальной связи между административно управляемыми сетями; диапазон — `fc00::/7`, локально генерируемые префиксы используют `fd00::/8`. Случайный Global ID уменьшает вероятность пересечений при объединении сетей. В глобальную таблицу их обычно не анонсируют.

   **Типичная ошибка:** Использовать во всех организациях один и тот же ULA-префикс и ожидать отсутствия конфликтов.

   **Источник:** [RFC 4193: Unique Local IPv6 Unicast Addresses](https://www.rfc-editor.org/rfc/rfc4193).

30. Что такое loopback адрес в IPv4?

   **Ответ:** IPv4 loopback — диапазон `127.0.0.0/8`; привычный адрес — `127.0.0.1`. Пакеты предназначены самому узлу и не должны выходить в сеть. Сервис на loopback доступен только внутри соответствующего сетевого пространства имён.

   **Пример:**

   ```bash
   ping -c 1 127.0.0.1
   ```

   **Типичная ошибка:** Считать `127.0.0.1` адресом другого контейнера или удалённой машины.

   **Источник:** [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml); [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html).

31. Что такое loopback адрес в IPv6?

   **Ответ:** IPv6 loopback — единственный адрес `::1/128`. Он обозначает текущий узел, не назначается физическому интерфейсу и не пересылается маршрутизатором.

   **Пример:**

   ```bash
   ping -6 -c 1 ::1  # Linux
   ```

   **Типичная ошибка:** Путать `::1` с `::`, обозначающим unspecified address.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

32. Что такое unspecified address в IPv6?

   **Ответ:** Unspecified address — `::/128`, то есть все 128 бит равны нулю. Он обозначает отсутствие определённого адреса и используется в специальных процедурах; в bind API `::` означает wildcard для локальных IPv6-адресов.

   **Типичная ошибка:** Публиковать `::` как адрес сервера, по которому клиент должен подключаться.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

33. Что такое multicast в IPv6?

   **Ответ:** Multicast — доставка группе интерфейсов, присоединившихся к группе. IPv6 multicast-адреса начинаются с `ff00::/8`; scope ограничивает область распространения. Например, `ff02::1` — все узлы на локальном канале.

   **Типичная ошибка:** Считать, что любая multicast-группа автоматически достижима через все маршрутизаторы.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

34. Почему в IPv6 нет broadcast?

   **Ответ:** В IPv6 нет broadcast-адресов: задачи групповой доставки выполняет multicast. Например, вместо обращения ко всем узлам для разрешения адреса применяются solicited-node multicast-группы Neighbor Discovery.

   **Типичная ошибка:** Посылать ARP broadcast при разрешении IPv6-адреса: IPv6 использует Neighbor Discovery.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

35. Чем multicast отличается от broadcast?

   **Ответ:** Broadcast адресован всем узлам broadcast-домена; multicast — определённой группе с заданной областью распространения. Какая фильтрация реально происходит на L2, зависит от оборудования и его настроек.

   **Типичная ошибка:** Ожидать, что multicast никогда не попадёт на порты без заинтересованных получателей: без подходящей фильтрации возможен flooding.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).


### Продвинутый уровень
36. Какие изменения нужны в приложении на C/C++, чтобы оно поддерживало и IPv4, и IPv6?

   **Ответ:** Нужно использовать getaddrinfo с AF_UNSPEC, обрабатывать список адресов, создавать сокет с параметрами выбранного addrinfo и хранить адрес вместе с семейством и длиной. Для вывода подходят getnameinfo или inet_ntop; клиенту нужны ограниченные таймауты и стратегия переключения адресов.

   **Типичная ошибка:** Оставить sockaddr_in и заменить только строку адреса на IPv6.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

37. Почему `sockaddr_in` недостаточен для IPv6?

   **Ответ:** sockaddr_in содержит IPv4-адрес на 32 бита и не вмещает 128-битный IPv6-адрес, flowinfo и scope ID. Для IPv6 нужен sockaddr_in6, а для общего буфера — sockaddr_storage.

   **Типичная ошибка:** Приводить маленький буфер sockaddr_in к sockaddr_in6 и записывать за его пределами.

   **Источник:** [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

38. Чем отличается `sockaddr_in` от `sockaddr_in6`?

   **Ответ:** sockaddr_in описывает AF_INET: порт и in_addr. sockaddr_in6 описывает AF_INET6: порт, in6_addr, flowinfo и scope ID. В socket API передают указатель на sockaddr и фактическую длину структуры.

   **Типичная ошибка:** Передавать sizeof(sockaddr_in) при bind с sockaddr_in6.

   **Источник:** [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

39. Зачем нужен `sockaddr_storage`?

   **Ответ:** sockaddr_storage — буфер с размером и выравниванием, подходящими для поддерживаемых socket address structures. Поле ss_family позволяет выбрать интерпретацию; фактическую длину сохраняют отдельно в socklen_t.

   **Типичная ошибка:** Считать sockaddr_storage готовым IPv6-адресом без проверки семейства.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

40. Как `getaddrinfo()` помогает писать protocol-independent code?

   **Ответ:** getaddrinfo преобразует имя и сервис в список адресов с ai_family, ai_socktype, ai_protocol, ai_addr и ai_addrlen. С AF_UNSPEC не нужно заранее выбирать IPv4 или IPv6. Список освобождают freeaddrinfo; ошибки объясняет gai_strerror.

   **Типичная ошибка:** Использовать только первый адрес без попыток следующего при неудаче соединения.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

41. Почему `gethostbyname()` считается устаревшим?

   **Ответ:** gethostbyname имеет устаревший интерфейс, ориентирован на IPv4 и возвращает данные со сложными ограничениями времени жизни и потокобезопасности. getaddrinfo поддерживает оба семейства и возвращает список параметров для socket API.

   **Типичная ошибка:** Считать gethostbyname подходящим переносимым способом получить AAAA-записи.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

42. Как в C определить, IPv4 это или IPv6 адрес?

   **Ответ:** Для бинарного socket address проверяют sa_family или ss_family. Для строки пробуют inet_pton с AF_INET и AF_INET6, принимая только возврат 1; наличие двоеточия само по себе не является валидацией.

   **Пример:**

   ```c
   #include <arpa/inet.h>

   int main(void) {
       struct in_addr v4;
       struct in6_addr v6;
       const char *text = "2001:db8::1";
       if (inet_pton(AF_INET, text, &v4) == 1) return 0;
       if (inet_pton(AF_INET6, text, &v6) == 1) return 0;
       return 1;
   }
   ```

   **Типичная ошибка:** Определять корректность IPv6 только по наличию `:` в строке.

   **Источник:** [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

43. Как преобразовать строковый IP в бинарный вид?

   **Ответ:** inet_pton преобразует числовую строку в in_addr или in6_addr заданного семейства. Возврат 1 означает успех, 0 — неверный текст, -1 — ошибку семейства. DNS-имена обрабатывают через getaddrinfo.

   **Типичная ошибка:** Принять 0 за успех или передать имя хоста в inet_pton.

   **Источник:** [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

44. Чем отличаются `inet_pton()` и `inet_ntop()`?

   **Ответ:** inet_pton выполняет presentation-to-network: строка в бинарный адрес. inet_ntop делает обратное преобразование и требует выходной буфер достаточного размера — INET_ADDRSTRLEN или INET6_ADDRSTRLEN. Обе функции работают с адресом, без номера порта.

   **Типичная ошибка:** Пытаться получить порт или выполнить DNS lookup через inet_ntop.

   **Источник:** [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html); [Linux man-pages: inet_ntop(3)](https://man7.org/linux/man-pages/man3/inet_ntop.3.html).

45. Какие ошибки часто возникают при работе с IPv6 в C/C++?

   **Ответ:** Частые ошибки — маленькие буферы, неверные длины sockaddr, потеря scope ID, неоднозначная запись endpoint без скобок, зависимость от значения IPV6_V6ONLY по умолчанию и пропуск IPv4-mapped адресов в ACL. Семейство и длина должны сопровождать адрес на всём пути.

   **Типичная ошибка:** Хранить endpoint одной строкой и разделять адрес и порт по первому двоеточию.

   **Источник:** [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

46. Как bind-сокет к IPv6 адресу?

   **Ответ:** Создают socket(AF_INET6, ...), обнуляют sockaddr_in6, задают sin6_family, порт через htons и sin6_addr. Для wildcard используют in6addr_any, для loopback — in6addr_loopback. Затем вызывают bind с sizeof этой структуры и проверяют результат.

   **Пример:**

   ```c
   #include <sys/socket.h>
   #include <netinet/in.h>
   #include <unistd.h>

   int main(void) {
       int fd = socket(AF_INET6, SOCK_STREAM, 0);
       if (fd == -1) return 1;
       struct sockaddr_in6 addr = {0};
       addr.sin6_family = AF_INET6;
       addr.sin6_port = htons(8080);
       addr.sin6_addr = in6addr_loopback;
       int result = bind(fd, (const struct sockaddr *)&addr, sizeof addr);
       close(fd);
       return result == 0 ? 0 : 1;
   }
   ```

   **Типичная ошибка:** Передавать порт в host byte order или игнорировать ошибку bind.

   **Источник:** [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html); [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html).

47. Что делает опция `IPV6_V6ONLY`?

   **Ответ:** IPV6_V6ONLY ограничивает AF_INET6-сокет IPv6-трафиком. При отключении на поддерживающей это ОС возможны IPv4-mapped peers. Значение по умолчанию зависит от системы; серверу следует явно установить желаемое поведение до bind.

   **Типичная ошибка:** Рассчитывать, что одинаковый bind на `::` будет одинаково принимать IPv4 на всех ОС.

   **Источник:** [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

48. Можно ли через IPv6 socket принимать IPv4 соединения?

   **Ответ:** Да, если ОС поддерживает dual-stack sockets и IPV6_V6ONLY отключён. IPv4-peer представляется как IPv4-mapped IPv6 address. Альтернатива — отдельные IPv4 и IPv6 listeners с явно заданной политикой привязки.

   **Типичная ошибка:** Нормализовать mapped address только в логах, оставив отличающуюся трактовку в ACL.

   **Источник:** [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

49. Как в Linux посмотреть IPv6 маршруты?

   **Ответ:** Команда ip -6 route show показывает IPv6-маршруты основной таблицы. Для остальных используют table all; ip -6 rule show показывает policy rules, а route get — результат выбора для конкретного назначения.

   **Пример:**

   ```bash
   ip -6 route show
   ip -6 route show table all
   ip -6 rule show
   ip -6 route get 2001:db8::1  # Документационный адрес: маршрут может отсутствовать.
   ```

   **Типичная ошибка:** Считать main единственной таблицей при policy routing.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

50. Как в дампе tcpdump отличить IPv4 трафик от IPv6?

   **Ответ:** В capture filter libpcap `ip` выбирает IPv4, `ip6` — IPv6. Используйте числовой вывод (-n), чтобы DNS lookup не затруднял чтение. Фильтры транспортных полей требуют внимания к заголовкам расширения.

   **Пример:**

   ```bash
   tcpdump -ni any -c 10 ip
   tcpdump -ni any -c 10 ip6  # Нужны права на захват.
   ```

   **Типичная ошибка:** Использовать IPv4-смещения заголовка для IPv6-пакетов.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

51. Почему MTU и fragmentation по-разному обрабатываются в IPv4 и IPv6?

   **Ответ:** IPv4 допускает фрагментацию отправителем и маршрутизаторами, если не установлен DF. В IPv6 фрагментирует только отправитель через Fragment Header; маршрутизатор при превышении MTU отбрасывает пакет и отправляет ICMPv6 Packet Too Big.

   **Типичная ошибка:** Блокировать Packet Too Big, считая весь ICMPv6 необязательным для передачи данных.

   **Источник:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791); [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

52. Где выполняется fragmentation в IPv4?

   **Ответ:** Фрагментация IPv4 возможна у отправителя и на промежуточном маршрутизаторе при недостаточном MTU следующего канала и сброшенном DF. Сборка IP-фрагментов выполняется конечным получателем.

   **Типичная ошибка:** Ожидать, что каждый следующий маршрутизатор обязательно соберёт пакет перед пересылкой.

   **Источник:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791).

53. Почему в IPv6 роутеры не фрагментируют пакеты?

   **Ответ:** Архитектура IPv6 переносит фрагментацию на отправителя, упрощая пересылку в маршрутизаторах. Если пакет не помещается в MTU выходного канала, маршрутизатор сообщает допустимый размер через ICMPv6 Packet Too Big.

   **Типичная ошибка:** Предполагать, что IPv6 вообще не поддерживает IP-фрагменты.

   **Источник:** [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

54. Что такое Path MTU Discovery?

   **Ответ:** Path MTU Discovery определяет максимальный размер IP-пакета, проходящего весь путь без фрагментации. Классический механизм использует сообщения об ограничении MTU; в IPv6 — Packet Too Big. Изменение маршрута может изменить и PMTU.

   **Типичная ошибка:** Приравнивать MTU локального интерфейса к MTU всего пути.

   **Источник:** [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).

55. Какие проблемы возникают при неправильной работе PMTU?

   **Ответ:** Возможен PMTU black hole: небольшие пакеты проходят, большие теряются, а отправитель не получает или не учитывает сообщение о размере. Типичны зависание TLS/передачи данных при успешном handshake и проблемы после включения туннеля.

   **Типичная ошибка:** Объявлять сеть исправной только потому, что проходит маленький ping.

   **Источник:** [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201).


### Инженерные вопросы
56. Когда IPv4 всё ещё предпочтительнее IPv6 на практике?

   **Ответ:** IPv4 выбирают, когда необходимые сети, peers или оборудование доступны только по IPv4 либо эксплуатация IPv6 ещё не обеспечена. Решение принимают по реальным требованиям совместимости и связности; dual stack помогает поддержать обе версии.

   **Типичная ошибка:** Выбирать версию по стереотипу о скорости, не проверяя реальные пути и зависимости.

   **Источник:** [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

57. Почему некоторые системы долго не переходят на IPv6?

   **Ответ:** Мешают зависимости от IPv4-only систем, изменение адресного плана и ACL, необходимость обучения и поддержки двух стеков. Требуется проверить приложения, DNS, маршрутизацию и диагностику; выдача IPv6-адреса решает лишь часть перехода.

   **Типичная ошибка:** Игнорировать IPv6 в firewall и мониторинге, пока основная нагрузка идёт по IPv4.

   **Источник:** [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

58. Как проектировать сервис, который должен работать в dual-stack среде?

   **Ответ:** Задать явную политику listeners, обеспечить A/AAAA и рабочие маршруты, одинаковую аутентификацию и ACL для обоих семейств. Клиентам нужны попытки по нескольким адресам с ограничением задержек; метрики и тесты разделяют по семействам.

   **Типичная ошибка:** Публиковать AAAA до проверки IPv6-доступности сервиса извне.

   **Источник:** [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

59. Какие API и структуры данных должны быть абстрагированы в C++ сетевой библиотеке для поддержки IPv4/IPv6?

   **Ответ:** Абстрагируют endpoint как семейство, бинарный адрес, порт, scope ID и длину socket address; отдельно — resolver и стратегию connect. Форматирование, сравнение, hashing и ACL должны одинаково трактовать mapped addresses и учитывать scope там, где он значим.

   **Типичная ошибка:** Сравнивать endpoint через memcmp всей sockaddr_storage с padding и неинициализированными байтами.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

60. Как протестировать IPv6 поддержку в сетевом приложении?

   **Ответ:** Проверяют IPv4-only, IPv6-only и dual-stack окружения, числовые адреса и DNS, loopback и реальные интерфейсы, link-local scope, таймауты и fallback. Для listeners проверяют IPV6_V6ONLY и одинаковую политику доступа; для передачи — большие данные и PMTU.

   **Пример:**

   ```bash
   # Для тестируемого сервиса с A и AAAA:
   curl -4 --connect-timeout 3 https://example.com/
   curl -6 --connect-timeout 3 https://example.com/
   ```

   **Типичная ошибка:** Ограничиться успешным connect к `::1`: он не проверяет маршрутизацию, DNS и внешний firewall.

   **Источник:** [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305); [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).


---

## 2. CIDR и subnetting

### Базовый уровень
61. Что такое subnet mask?

   **Ответ:** Маска IPv4 выделяет сетевую часть адреса: в CIDR это последовательность единиц, за которой идут нули. Побитовое AND адреса и маски даёт адрес сети. Например, `/24` соответствует `255.255.255.0`.

   **Типичная ошибка:** Принимать разрывную маску вроде `255.0.255.0` за обычный CIDR-префикс.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

62. Что такое CIDR?

   **Ответ:** CIDR — бесклассовая адресация и агрегация маршрутов. Сеть задают адресом и длиной префикса: `192.0.2.0/24`. Граница определяется числом бит, а не историческим классом A/B/C.

   **Типичная ошибка:** Выводить размер подсети из первого октета адреса вместо заданного префикса.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

63. Почему CIDR пришёл на смену classful addressing?

   **Ответ:** Классы выделяли блоки фиксированных размеров, что расходовало адреса и затрудняло агрегацию. CIDR позволяет назначать блоки по длине префикса и объединять маршруты, уменьшая рост глобальной таблицы.

   **Типичная ошибка:** Считать, что CIDR увеличил разрядность IPv4: она осталась 32 бита.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

64. Что означает запись `/24`?

   **Ответ:** `/24` означает 24 бита префикса. Для IPv4 остаётся 8 бит адресов внутри блока: всего 256 адресов, обычно 254 адреса хостов. Для IPv6 та же запись означает 24 из 128 бит.

   **Типичная ошибка:** Считать `/24` указанием количества хостов.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

65. Что означает запись `/16`?

   **Ответ:** Для IPv4 `/16` означает маску `255.255.0.0` и блок из 65 536 адресов, обычно с 65 534 адресами хостов в обычной подсети.

   **Типичная ошибка:** Путать число всех адресов блока с числом назначаемых адресов хостов.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

66. Что означает запись `/32`?

   **Ответ:** IPv4 `/32` фиксирует все биты: это ровно один адрес. Такой префикс используют для host route и loopback-интерфейсов. Назначение `/32` само по себе не определяет, как достигать соседей и шлюза.

   **Типичная ошибка:** Вычитать из одного адреса network и broadcast по формуле обычной подсети.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

67. Что означает запись `/128` для IPv6?

   **Ответ:** IPv6 `/128` обозначает один адрес, поскольку все 128 бит принадлежат префиксу. Применяется для host route и отдельных адресов, например `::1/128`.

   **Типичная ошибка:** Ожидать, что `/128` описывает обычную SLAAC-подсеть.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [RFC 7421: Analysis of the 64-bit Boundary in IPv6 Addressing](https://www.rfc-editor.org/rfc/rfc7421).

68. Сколько адресов содержит сеть `/24`?

   **Ответ:** IPv4 `/24` содержит 2^(32−24) = 256 адресов. В обычной broadcast-подсети первый — network, последний — directed broadcast, поэтому остаются 254 адреса хостов.

   **Типичная ошибка:** Указывать 254 как полное число адресов блока.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

69. Сколько адресов содержит сеть `/30`?

   **Ответ:** IPv4 `/30` содержит четыре адреса: сеть, два адреса хостов и broadcast. Например, `192.0.2.0/30` охватывает `.0–.3`, хосты — `.1` и `.2`.

   **Типичная ошибка:** Назначать `.3` обычному хосту в этой подсети.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

70. Сколько адресов содержит сеть `/29`?

   **Ответ:** IPv4 `/29` содержит восемь адресов, обычно шесть адресов хостов. Например, `192.0.2.8/29`: сеть `.8`, хосты `.9–.14`, broadcast `.15`.

   **Типичная ошибка:** Считать, что любой блок `/29` обязательно начинается с `.0`.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

71. Как определить network address?

   **Ответ:** Адрес сети получают побитовым AND IP-адреса с маской. Для `192.0.2.130/26` результат — `192.0.2.128`. При хранении канонического префикса host bits обнуляют.

   **Типичная ошибка:** Обнулять только последний октет, хотя граница префикса может проходить внутри него.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

72. Как определить broadcast address в IPv4?

   **Ответ:** Для обычной IPv4-подсети directed broadcast получают установкой всех host bits в единицу: network OR NOT mask. У `192.0.2.128/26` это `192.0.2.191`. Для `/31` на point-to-point такой смысл не применяется.

   **Типичная ошибка:** Использовать последний адрес `/31` как broadcast и терять один конец канала.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021).

73. Что такое host part и network part адреса?

   **Ответ:** Network part — первые биты, заданные длиной префикса; host part — остальные. У `192.0.2.130/26` сетевых бит 26, оставшихся — 6. Один и тот же IP можно рассматривать в разных содержащих его префиксах.

   **Типичная ошибка:** Считать границу network/host свойством IP без указания маски.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

74. Как subnet mask влияет на число хостов?

   **Ответ:** Чем длиннее IPv4-префикс, тем меньше host bits: блок содержит 2^(32−p) адресов. Формула назначения `−2` относится к обычным broadcast-подсетям, с исключениями для `/31` и `/32`.

   **Типичная ошибка:** Безусловно использовать `2^(32−p)−2` для любого префикса.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021).

75. Почему из числа адресов обычно вычитают 2?

   **Ответ:** В обычной IPv4-подсети host bits из одних нулей обозначают сеть, из одних единиц — directed broadcast. Поэтому для хостов обычно остаётся на два адреса меньше; `/31` point-to-point и `/32` обрабатывают отдельно.

   **Типичная ошибка:** Переносить вычитание двух адресов на IPv6, где нет broadcast.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).


### Средний уровень
76. Как вычислить диапазон адресов в подсети?

   **Ответ:** Вычисляют маску, network = address AND mask и последний адрес = network OR NOT mask. Для обычной IPv4-подсети хостовый диапазон — от network+1 до last−1. Сначала отдельно обрабатывают `/31` и `/32`.

   **Типичная ошибка:** Применять формулу хостового диапазона до проверки крайних длин префикса.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021).

77. Как определить, принадлежат ли два IP одной подсети?

   **Ответ:** Для заданной маски сравнивают результаты AND: `(a & mask) == (b & mask)`. Это проверка принадлежности одному префиксу, а не доказательство прямой L2-связности или одинаковых настроек интерфейсов.

   **Типичная ошибка:** Забывать указать общую маску при сравнении адресов.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

78. Что такое supernetting?

   **Ответ:** Supernetting объединяет несколько более специфичных блоков в более короткий префикс. Точное объединение возможно для смежных правильно выровненных блоков: `192.0.2.0/25` и `192.0.2.128/25` дают `192.0.2.0/24`.

   **Типичная ошибка:** Объединять несмежные сети и не замечать появившиеся в агрегате дополнительные адреса.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

79. Что такое summarization маршрутов?

   **Ответ:** Summarization — представление множества маршрутов менее специфичным агрегатом. Он сокращает объявления, но узел-агрегатор должен корректно обрабатывать покрытые адреса, включая отсутствующие более специфичные маршруты.

   **Типичная ошибка:** Анонсировать агрегат без политики для «дыр» и получить петлю через default route.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

80. Почему route aggregation важен для масштабируемости?

   **Ответ:** Без агрегации каждой небольшой сети понадобился бы отдельный глобальный маршрут. Иерархическое выделение адресов позволяет представлять множество сетей одним префиксом, снижая память, число обновлений и нагрузку на обработку таблиц.

   **Типичная ошибка:** Считать, что агрегирование автоматически сохраняет индивидуальную политику всех включённых сетей.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

81. Чем `/31` отличается от обычных subnet masks?

   **Ответ:** В IPv4 `/31` оставляет один host bit, то есть два адреса. На point-to-point по RFC 3021 оба используются концами канала, без выделения network и directed broadcast как в обычной подсети.

   **Типичная ошибка:** Использовать `/31` для произвольного общего Ethernet-сегмента с несколькими хостами.

   **Источник:** [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021).

82. Когда допустимо использовать `/31`?

   **Ответ:** `/31` применяют к IPv4 point-to-point каналам с двумя концами при поддержке обоими устройствами. Это экономит два адреса относительно `/30`.

   **Типичная ошибка:** Проверить поддержку только на одном конце или автоматически считать любой Ethernet-линк многоточечным.

   **Источник:** [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021).

83. Для чего используется `/32` маршрут?

   **Ответ:** `/32` маршрут направляет трафик к единственному IPv4-адресу. Он используется для loopback, VPN peers, точечных исключений и сервисных адресов и выигрывает у менее специфичных совпадающих маршрутов.

   **Типичная ошибка:** Путать host route с назначением адреса интерфейсу: это разные операции.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

84. Что такое longest prefix match?

   **Ответ:** Longest prefix match выбирает совпадающий маршрут с наибольшим числом бит префикса. Например, для `192.0.2.200` маршрут `192.0.2.128/25` специфичнее `192.0.2.0/24` и default `/0`.

   **Пример:**

   ```bash
   ip route get 192.0.2.200  # Linux: показать фактический выбор маршрута.
   ```

   **Типичная ошибка:** Выбирать default с меньшей metric вместо существующего более специфичного маршрута в той же таблице.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

85. Как CIDR влияет на выбор маршрута?

   **Ответ:** CIDR задаёт длину совпадения, по которой работает longest prefix match. Сначала учитываются policy rules и выбранная таблица; внутри неё ищется наиболее специфичный маршрут, затем применяются правила выбора среди подходящих альтернатив.

   **Типичная ошибка:** Сравнивать metric произвольных маршрутов из всех таблиц без учёта policy routing.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

86. Что такое VLSM?

   **Ответ:** VLSM — использование масок разной длины при разбиении адресного блока. Например, внутри `/24` можно выделить `/26` для одной сети и `/28` для другой.

   **Типичная ошибка:** Ожидать одинаковой маски у всех подсетей одного исходного блока.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

87. Зачем нужен VLSM?

   **Ответ:** VLSM позволяет выдавать каждой подсети блок подходящего размера, экономить IPv4-адреса и сохранять возможность иерархического адресного плана.

   **Типичная ошибка:** Выделять всем сегментам `/24` независимо от потребности и будущей агрегации.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

88. Как разбить сеть `/24` на несколько подсетей?

   **Ответ:** Увеличивают длину префикса на k бит: получится 2^k равных блоков. Разделение IPv4 `/24` на четыре `/26` даёт начала `.0`, `.64`, `.128`, `.192`; каждый блок содержит 64 адреса.

   **Типичная ошибка:** Считать началом `/26` произвольный адрес, например `.32`.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

89. Как разбить сеть так, чтобы одна подсеть поддерживала 50 хостов, а другая 10?

   **Ответ:** Для 50 IPv4-хостов нужен минимум `/26` с 62 назначаемыми адресами; для 10 — `/28` с 14. Из `192.0.2.0/24` можно выделить `192.0.2.0/26` и `192.0.2.64/28`, оставив остальной блок свободным.

   **Типичная ошибка:** Разместить второй блок внутри уже выделенного `/26` и получить пересечение.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

90. Что такое overlapping subnets?

   **Ответ:** Overlapping subnets — префиксы с пересекающимися адресами. Например, `10.0.0.0/8` содержит `10.1.0.0/16`. В routing table вложенные маршруты нормальны; конфликт возникает, если адреса должны обозначать разные независимые узлы в объединённой сети.

   **Типичная ошибка:** Считать любое вложение префиксов ошибкой: longest prefix match рассчитан на него.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

91. Почему overlapping subnets создают проблемы?

   **Ответ:** При объединении сетей одинаковый адрес может обозначать разных peers. Маршрутизация, VPN selectors и ACL становятся неоднозначными; помогают перенумерация, изоляция VRF или контролируемая трансляция.

   **Типичная ошибка:** Ожидать, что DNS устранит конфликт одинаковых адресов после их разрешения.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

92. Чем subnetting в IPv6 концептуально отличается от IPv4?

   **Ответ:** Принцип префиксов сохраняется, но IPv6 обычно планируют по числу подсетей, а не экономии адресов хостов. Для обычных LAN/SLAAC используют `/64`; broadcast и правило вычитания двух адресов отсутствуют.

   **Типичная ошибка:** Разбивать IPv6 LAN на маленькие блоки только из-за малого числа устройств, ломая ожидания SLAAC.

   **Источник:** [RFC 7421: Analysis of the 64-bit Boundary in IPv6 Addressing](https://www.rfc-editor.org/rfc/rfc7421); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

93. Почему в IPv6 обычно используют `/64`?

   **Ответ:** 64-битный interface identifier — основа большинства обычных IPv6 unicast LAN и SLAAC. Поэтому для таких подсетей используют `/64`. Это не запрет других длин: для host routes и point-to-point существуют отдельные случаи.

   **Типичная ошибка:** Утверждать, что любой IPv6-префикс обязан быть `/64`, включая маршруты агрегации.

   **Источник:** [RFC 7421: Analysis of the 64-bit Boundary in IPv6 Addressing](https://www.rfc-editor.org/rfc/rfc7421).

94. Что может пойти не так при выборе слишком маленькой или слишком большой подсети?

   **Ответ:** В IPv4 маленький блок быстро исчерпывается; чрезмерно большой on-link сегмент может увеличить broadcast/ARP-нагрузку и область отказа. Размер префикса сам по себе не задаёт L2-топологию. В IPv6 учитывают требования SLAAC и архитектуру, а не только число устройств.

   **Типичная ошибка:** Пытаться исправить слишком большой broadcast-домен только изменением маски без сегментации L2.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 7421: Analysis of the 64-bit Boundary in IPv6 Addressing](https://www.rfc-editor.org/rfc/rfc7421).

95. Как subnetting влияет на broadcast domain?

   **Ответ:** Маска задаёт L3 on-link представление, а broadcast-домен формируется L2-мостами и VLAN. Несколько IP-подсетей могут находиться в одном VLAN; чтобы разделить L2 broadcast, нужны отдельные L2-сегменты.

   **Типичная ошибка:** Считать, что две IP-подсети на одном мосту автоматически изолируют Ethernet broadcast.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).


### Продвинутый уровень
96. Как реализовать проверку принадлежности IP подсети в C?

   **Ответ:** Парсят адрес и сеть в бинарный вид, приводят IPv4 к host byte order, строят маску после проверки `0 ≤ prefix ≤ 32` и сравнивают замаскированные значения. `/0` обрабатывают отдельно, чтобы не сдвигать 32-битное значение на 32.

   **Пример:**

   ```c
   #include <arpa/inet.h>
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>

   bool in_subnet(struct in_addr ip, struct in_addr network, unsigned prefix) {
       if (prefix > 32) return false;
       uint32_t mask = prefix == 0 ? 0 : UINT32_MAX << (32 - prefix);
       return (ntohl(ip.s_addr) & mask) == (ntohl(network.s_addr) & mask);
   }
   ```

   **Типичная ошибка:** Использовать signed int и неопределённый сдвиг на ширину типа.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

97. Как побитово вычислить network address?

   **Ответ:** Для IPv4 network = host_order_address AND mask. Затем для передачи в socket API результат возвращают в network byte order. Маска `/0` равна нулю, `/32` — UINT32_MAX.

   **Пример:**

   ```c
   #include <arpa/inet.h>
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>

   bool network_address(struct in_addr ip, unsigned prefix, struct in_addr *out) {
       if (out == NULL || prefix > 32) return false;
       uint32_t mask = prefix == 0 ? 0 : UINT32_MAX << (32 - prefix);
       out->s_addr = htonl(ntohl(ip.s_addr) & mask);
       return true;
   }
   ```

   **Типичная ошибка:** Смешать host-order маску с адресом в network byte order.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

98. Как побитово вычислить broadcast address?

   **Ответ:** Для обычной IPv4-подсети broadcast = network OR bitwise-NOT(mask) в 32-битном беззнаковом типе. Результат для `/31` не следует трактовать как broadcast на point-to-point.

   **Пример:**

   ```c
   #include <arpa/inet.h>
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>

   // Directed broadcast для обычных подсетей; /31 и /32 не принимаем.
   bool broadcast_address(struct in_addr ip, unsigned prefix, struct in_addr *out) {
       if (out == NULL || prefix > 30) return false;
       uint32_t mask = prefix == 0 ? 0 : UINT32_MAX << (32 - prefix);
       out->s_addr = htonl((ntohl(ip.s_addr) & mask) | ~mask);
       return true;
   }
   ```

   **Типичная ошибка:** Проводить NOT в типе большей ширины и не ограничивать результат 32 битами.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html); [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021).

99. Как в коде представить CIDR?

   **Ответ:** CIDR удобно хранить как семейство, нормализованный бинарный network address и prefix length. Для IPv4 длина 0–32, для IPv6 — 0–128; host bits при создании префикса обнуляют или отклоняют по явно заданной политике.

   **Пример:**

   ```cpp
   #include <array>
   #include <cstdint>

   struct IpPrefix {
       enum class Family { v4, v6 } family;
       std::array<std::uint8_t, 16> network{}; // IPv4: первые 4 байта.
       std::uint8_t length{};
   };
   // Конструктор/фабрика должны проверить длину и обнулить host bits.
   ```

   **Типичная ошибка:** Хранить префикс только текстом и сравнивать строки вместо битовых значений.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

100. Как эффективно хранить и проверять большое число префиксов?

   **Ответ:** Для большого числа префиксов применяют radix/Patricia trie и специализированные LPM-структуры. Выбор зависит от семейств адресов, частоты обновлений, памяти и требуемой скорости lookup. Маленький набор часто проще проверять линейно.

   **Типичная ошибка:** Использовать hash map только по полному адресу и ожидать эффективный поиск всех содержащих его префиксов.

   **Источник:** [Linux kernel: LC-trie implementation notes](https://docs.kernel.org/networking/fib_trie.html).

101. Что такое trie / radix tree в контексте маршрутизации?

   **Ответ:** Prefix trie организует адреса по последовательным битам префикса. Узлы могут хранить маршруты, а compressed radix/Patricia сокращает цепочки без ветвлений. При lookup запоминают последний подходящий маршрут по пути.

   **Типичная ошибка:** Возвращать первый найденный префикс вместо последнего, наиболее специфичного.

   **Источник:** [Linux kernel: LC-trie implementation notes](https://docs.kernel.org/networking/fib_trie.html).

102. Почему longest prefix match часто реализуют через prefix tree?

   **Ответ:** Обход trie следует битам адреса; глубина ограничена шириной адреса, а подходящие маршруты встречаются вдоль пути. Это естественно выражает LPM и избегает полного сканирования таблицы. Реальные реализации оптимизируют число обращений к памяти.

   **Типичная ошибка:** Оценивать lookup только асимптотикой и игнорировать cache locality и обновления.

   **Источник:** [Linux kernel: LC-trie implementation notes](https://docs.kernel.org/networking/fib_trie.html).

103. Как в Linux kernel хранится routing table?

   **Ответ:** В Linux IPv4 FIB использует оптимизированный LC-trie; policy routing может выбирать несколько таблиц. IPv6 имеет отдельную реализацию, поэтому нельзя переносить устройство IPv4 FIB на весь стек. Детали следует сверять с версией ядра.

   **Типичная ошибка:** Путать таблицу маршрутов с neighbour/ARP cache или старым глобальным route cache.

   **Источник:** [Linux kernel: LC-trie implementation notes](https://docs.kernel.org/networking/fib_trie.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

104. Как протестировать функции subnetting unit-тестами?

   **Ответ:** Проверяют `/0`, `/32`, граничные адреса, правильные и неправильные prefix lengths, канонизацию host bits и byte order. Для IPv6 добавляют границы байтов и `/128`. Полезное свойство: нормализация префикса идемпотентна, а его первый и последний адреса входят в блок.

   **Типичная ошибка:** Тестировать только `/24`, где многие ошибки скрываются из-за границы октета.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html).

105. Какие типичные ошибки разработчики допускают при побитовых операциях с IP?

   **Ответ:** Типичные ошибки — signed shifts, сдвиг на 32/128, неверный byte order, переполнение при вычислении размера блока и применение IPv4-формул к IPv6. Нужны беззнаковые типы, проверка длины и отдельная обработка крайних случаев.

   **Типичная ошибка:** Писать `1 << 32` для размера IPv4-пространства.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

106. Почему важно учитывать network byte order?

   **Ответ:** Порядок байтов определяет соответствие числового значения последовательности октетов. IP и порты в socket structures используют network byte order; побитовую арифметику IPv4 удобно делать после ntohl.

   **Типичная ошибка:** Считать, что чтение s_addr как целого даёт одинаковое значение на little-endian и big-endian.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html).

107. Что будет, если забыть `htonl()` / `ntohl()` при работе с IPv4?

   **Ответ:** На little-endian системах число может интерпретироваться с переставленными байтами: ломаются маски, сравнения и адрес назначения. На big-endian ошибка может оставаться незаметной. Преобразование требуется при переходе между host-order числами и сетевым представлением, а не после каждого копирования.

   **Типичная ошибка:** Повторно применять htonl к уже сетевому адресу, полученному inet_pton.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html); [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html).

108. Как корректно парсить CIDR строку вида `192.168.1.0/24`?

   **Ответ:** Разделяют строку по единственному `/`, строго парсят адрес через inet_pton и всю десятичную длину префикса с проверкой диапазона. Затем нормализуют host bits либо отвергают их по контракту. Хвостовой мусор и неоднозначные пустые значения отклоняют.

   **Типичная ошибка:** Использовать atoi, принимающий `24garbage`, или молча обрезать отрицательный префикс.

   **Источник:** [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

109. Как обработать некорректную маску в пользовательском вводе?

   **Ответ:** Проверяют диапазон prefix length, полный разбор строки и непрерывность единичных битов, если ввод задан dotted mask. Возвращают понятную ошибку; некорректный ввод не должен незаметно становиться `/0`.

   **Типичная ошибка:** Исправлять ошибочную маску на default route и расширять доступ на все адреса.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

110. Какой алгоритм выбрать для поиска наиболее специфичного маршрута?

   **Ответ:** Для небольшого статического списка достаточно перебора с выбором максимальной длины совпавшего префикса. Для большой таблицы — radix/Patricia trie или специализированный LPM. Оценивать нужно lookup, обновления и память на реальном распределении префиксов.

   **Типичная ошибка:** Брать первый совпавший маршрут в неотсортированном списке.

   **Источник:** [Linux kernel: LC-trie implementation notes](https://docs.kernel.org/networking/fib_trie.html); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).


### Инженерные вопросы
111. Как subnetting влияет на дизайн датацентровой сети?

   **Ответ:** Адресный план увязывают с фабриками, зонами отказа, tenant/VRF и точками агрегации. Предусматривают рост и непересечение связанных сетей. Подсеть не является самостоятельной границей безопасности без соответствующих правил и сегментации.

   **Типичная ошибка:** Распределять блоки случайно, а затем ожидать компактной агрегации по площадкам.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

112. Почему слишком крупные L2 домены вредны?

   **Ответ:** Они расширяют область flooding, ARP/ND-нагрузки, петель и ошибочных L2-событий. Но длина IP-префикса не равна размеру L2-домена: нужно учитывать VLAN/bridging и фактическое число узлов.

   **Типичная ошибка:** Объяснять любой рост сетевой нагрузки одной маской, не проверяя L2-топологию.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

113. Почему слишком мелкие подсети тоже могут быть неэффективны?

   **Ответ:** Они могут увеличивать число маршрутов и настроек, расход IPv4 на служебные адреса и сложность эксплуатации. Размер выбирают по числу узлов, росту и топологии; `/31` экономит адреса на подходящих point-to-point каналах.

   **Типичная ошибка:** Уменьшать все IPv6 LAN-префиксы по аналогии с IPv4, не учитывая SLAAC.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021); [RFC 7421: Analysis of the 64-bit Boundary in IPv6 Addressing](https://www.rfc-editor.org/rfc/rfc7421).

114. Как route aggregation уменьшает размер routing table?

   **Ответ:** Несколько смежных правильно выровненных блоков представляют одним более коротким префиксом. Например, четыре `/26` внутри `192.0.2.0/24` заменяются одним `/24`, если политика анонса и достижимости это допускает.

   **Типичная ошибка:** Агрегировать маршруты с разными требованиями к пути и потерять нужную политику.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

115. Как правильно проектировать адресное пространство для микросервисов, VPN и офисных сетей?

   **Ответ:** Выделяют непересекающиеся блоки по площадкам, tenant и VPN, резервируют рост и ведут централизованный учёт. Учитывают сети клиентов, партнёров и контейнеров, чтобы VPN не пересекался с их локальными диапазонами; предусматривают агрегацию.

   **Типичная ошибка:** Считать, что RFC1918-адреса всегда уникальны за пределами своей организации.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).


---

## 3. Private vs Public IP

### Базовый уровень
116. Что такое private IP адрес?

   **Ответ:** Private IPv4 — адрес из блоков RFC 1918, предназначенных для внутренних сетей. Такие адреса не глобально уникальны и могут независимо использоваться разными организациями.

   **Типичная ошибка:** Называть private любой адрес, который сейчас недоступен из интернета.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

117. Что такое public IP адрес?

   **Ответ:** Обычно так называют глобально уникальный unicast-адрес, предназначенный для публичной маршрутизации. Это не означает, что он назначен интерфейсу, анонсирован или доступен извне. Адреса special-purpose требуют отдельной классификации.

   **Типичная ошибка:** Считать public всё, что не входит в RFC1918: loopback, multicast и документационные блоки тоже не RFC1918.

   **Источник:** [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml); [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

118. Какие диапазоны IPv4 являются private?

   **Ответ:** `10.0.0.0/8`, `172.16.0.0/12` и `192.168.0.0/16`. Второй диапазон охватывает только `172.16.0.0–172.31.255.255`.

   **Типичная ошибка:** Считать весь `172.0.0.0/8` частным.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

119. Что такое RFC1918?

   **Ответ:** RFC 1918 — документ, резервирующий три блока IPv4 для частных сетей и описывающий их использование без глобального назначения адресов. Он не определяет CGNAT, link-local или loopback.

   **Типичная ошибка:** Включать `100.64.0.0/10` в RFC1918.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 6598: Shared Address Space](https://www.rfc-editor.org/rfc/rfc6598).

120. Почему private адреса не маршрутизируются в интернете?

   **Ответ:** Они не имеют единственного глобального владельца: один адрес может обозначать разные узлы в разных сетях. Поэтому объявления таких сетей и соответствующий трафик фильтруют на внешних границах. Внутри частной инфраструктуры их маршрутизировать можно.

   **Типичная ошибка:** Считать, что маршрутизатор технически не способен пересылать RFC1918-пакеты.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

121. В чём назначение private адресов?

   **Ответ:** Они дают адресное пространство для внутренней связности без выделения глобальных IPv4 каждому узлу. Для внешних сервисов используют NAT, прокси или другой посредник при необходимости.

   **Типичная ошибка:** Считать private addressing заменой firewall и аутентификации.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

122. Где обычно используются private адреса?

   **Ответ:** В домашних и офисных LAN, закрытых backend-сетях, лабораториях и VPN. При соединении таких сетей нужно согласовать адресный план, поскольку диапазоны могут пересекаться.

   **Типичная ошибка:** Выбирать одинаковую подсеть во всех VPN-площадках без учёта будущего объединения.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

123. Где обычно используются public адреса?

   **Ответ:** На публичных frontend, внешних интерфейсах и маршрутизируемых сетях, которым нужна глобальная адресация. Адрес может принадлежать хосту, балансировщику или NAT gateway, а не самому backend.

   **Типичная ошибка:** Предполагать, что каждый публичный URL соответствует public IP на backend-интерфейсе.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

124. Может ли одно устройство иметь и private, и public IP?

   **Ответ:** Да: на разных интерфейсах или как несколько адресов одного интерфейса. Кроме того, public endpoint может быть создан NAT на внешнем устройстве и тогда не числиться среди локальных адресов хоста.

   **Типичная ошибка:** Путать назначенный хосту адрес с адресом, под которым соединение видно после NAT.

   **Источник:** [Linux man-pages: getifaddrs(3)](https://man7.org/linux/man-pages/man3/getifaddrs.3.html); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

125. Что такое loopback range?

   **Ответ:** Для IPv4 loopback зарезервирован `127.0.0.0/8`, обычно используется `127.0.0.1`. Для IPv6 loopback — `::1/128`. Они обозначают текущий сетевой стек, в том числе отдельный network namespace.

   **Типичная ошибка:** Пытаться подключиться к loopback другого узла, указав `127.0.0.1` на своей машине.

   **Источник:** [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html).

126. Что такое APIPA / link-local в IPv4?

   **Ответ:** IPv4 link-local — `169.254.0.0/16`, адреса для связи в пределах локального канала без обычной адресной конфигурации. APIPA — распространённое название реализации этого механизма. Маршрутизаторы не должны пересылать такой трафик между каналами.

   **Типичная ошибка:** Путать link-local с private RFC1918 и ожидать обычной маршрутизации между офисами.

   **Источник:** [RFC 3927: Dynamic Configuration of IPv4 Link-Local Addresses](https://www.rfc-editor.org/rfc/rfc3927).

127. Когда устройство получает адрес из диапазона `169.254.0.0/16`?

   **Ответ:** Хост может самостоятельно выбрать IPv4 link-local адрес при отсутствии пригодной конфигурации, часто после неудачи DHCP, предварительно проверив конфликт. Не все клиенты делают это автоматически; первые и последние 256 адресов блока не выбирают этим механизмом.

   **Типичная ошибка:** По одному `169.254` безусловно заключать, что DHCP отсутствует: поведение зависит от ОС и настроек.

   **Источник:** [RFC 3927: Dynamic Configuration of IPv4 Link-Local Addresses](https://www.rfc-editor.org/rfc/rfc3927).

128. Что такое CGNAT?

   **Ответ:** CGNAT — трансляция адресов на оборудовании оператора, позволяющая нескольким абонентам разделять публичные IPv4. Между CPE и оператором может использоваться shared space `100.64.0.0/10`.

   **Типичная ошибка:** Считать port forwarding на домашнем роутере достаточным для прохождения ещё и операторского NAT.

   **Источник:** [RFC 6598: Shared Address Space](https://www.rfc-editor.org/rfc/rfc6598); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

129. Почему CGNAT появился?

   **Ответ:** Он позволяет обслуживать больше абонентов при ограниченном числе публичных IPv4. Цена — дополнительное состояние, совместное использование портов, сложность входящих соединений и атрибуции трафика.

   **Типичная ошибка:** Считать CGNAT способом получить полноценную индивидуальную публичную адресацию для каждого абонента.

   **Источник:** [RFC 6598: Shared Address Space](https://www.rfc-editor.org/rfc/rfc6598); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

130. Какие проблемы создаёт CGNAT?

   **Ответ:** Ограничиваются входящие соединения и доступные порты, усложняются P2P, диагностика и определение абонента по логам. Репутация общего public IP может затрагивать многих пользователей. Для идентификации нужны как минимум порт, протокол и точное время.

   **Типичная ошибка:** Блокировать одного абонента только по shared public IP и затронуть остальных.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).


### Средний уровень
131. Как частные адреса взаимодействуют с NAT?

   **Ответ:** При исходящем соединении NAT заменяет внутренний адрес и, при NAPT, порт на внешний endpoint; обратные пакеты переводит по состоянию mapping. Частная адресация внутри сети сама по себе NAT не требует.

   **Типичная ошибка:** Добавлять NAT между любыми двумя RFC1918-подсетями, хотя достаточно маршрутизации.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

132. Почему private address space можно повторно использовать в разных сетях?

   **Ответ:** Они не анонсируются как глобально уникальные назначения и имеют смысл внутри согласованной административной области. Разные изолированные сети могут использовать один блок; при их соединении уникальность нужно обеспечить заново.

   **Типичная ошибка:** Считать адрес `10.0.0.1` уникальным идентификатором устройства во всём мире.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

133. Какие риски возникают при объединении двух сетей с одинаковыми private ranges?

   **Ответ:** Пересечения делают маршрутизацию и идентификацию peers неоднозначными. Возможны неправильный next hop, конфликты VPN selectors и ACL. Решения — перенумерация, отдельные VRF или спланированная трансляция.

   **Типичная ошибка:** Объединять сети и надеяться, что более специфичные маршруты решат конфликт одинаковых адресов узлов.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632).

134. Почему public IPv4 адреса дороги и дефицитны?

   **Ответ:** IPv4 имеет конечное 32-битное пространство, а спрос на глобальную связность высок. Это создаёт дефицит доступных назначений и стоимость получения/обслуживания. Конкретные цены зависят от рынка и условий провайдера.

   **Типичная ошибка:** Считать частный адрес равноценной заменой public IP для прямых входящих соединений.

   **Источник:** [RFC 791: Internet Protocol](https://www.rfc-editor.org/rfc/rfc791); [RFC 6598: Shared Address Space](https://www.rfc-editor.org/rfc/rfc6598).

135. Зачем серверу обычно нужен public IP?

   **Ответ:** Для прямого доступа из интернета нужен достижимый public endpoint. Он может находиться на самом сервере, балансировщике, reverse proxy или NAT gateway; backend не обязан иметь public IP.

   **Типичная ошибка:** Назначать публичный адрес каждому backend только ради публикации одного сервиса.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

136. Может ли клиент работать без public IP?

   **Ответ:** Да: клиент с private IPv4 может обращаться к внешним сервисам через NAT или прокси. При этом сервер видит внешний endpoint посредника; прямые входящие подключения требуют отдельного решения.

   **Типичная ошибка:** Ожидать, что сервер сможет установить новое соединение на private адрес клиента через интернет.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

137. Чем private IPv4 отличается от unique local IPv6?

   **Ответ:** RFC1918 — три частных IPv4-блока с частыми пересечениями; ULA — IPv6 `fc00::/7`, где локально генерируемые `fd`-префиксы включают случайный Global ID. ULA снижает вероятность конфликтов, но не является глобально маршрутизируемым адресом.

   **Типичная ошибка:** Переносить привычку выбирать один стандартный домашний префикс на ULA во всех сетях.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 4193: Unique Local IPv6 Unicast Addresses](https://www.rfc-editor.org/rfc/rfc4193).

138. Чем public IPv6 отличается от public IPv4 с точки зрения доступности?

   **Ответ:** Оба требуют маршрута, разрешающего firewall и слушающего приложения. IPv6 позволяет адресовать узлы без экономящего адреса NAT, но сам адрес не открывает порт и не отменяет политики доступа.

   **Типичная ошибка:** Считать глобальный IPv6 автоматически открытым для любых входящих соединений.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

139. Почему наличие public IP не означает доступность сервиса извне?

   **Ответ:** Могут отсутствовать маршрут, слушающий процесс, разрешающий firewall или корректный обратный путь. Сервис также может быть привязан только к loopback либо другому адресу. Проверять нужно конкретный endpoint и протокол.

   **Типичная ошибка:** Проверять только наличие адреса на интерфейсе.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

140. Что такое ingress filtering?

   **Ответ:** Ingress filtering ограничивает допустимые исходные адреса входящих пакетов по ожидаемой топологии. На границе провайдера это помогает пресекать spoofing адресов клиента. Политика должна учитывать multihoming и асимметрию.

   **Типичная ошибка:** Безусловно применять strict reverse-path проверку в асимметричной сети.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827).

141. Какие адреса считаются special-purpose и не должны использоваться как обычные host addresses?

   **Ответ:** Это адреса с отдельным назначением: loopback, link-local, multicast, unspecified, документационные и другие зарегистрированные блоки. Допустимость источника, назначения и пересылки зависит от конкретного блока и контекста.

   **Типичная ошибка:** Объединять все special-purpose адреса в одну категорию с одинаковыми правилами.

   **Источник:** [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml).

142. Что такое reserved ranges?

   **Ответ:** Термин неоднозначен: он может обозначать выделенные для специального назначения блоки или конкретное поле Reserved-by-Protocol реестра IANA. Нужно назвать точный диапазон и его свойства, а не выводить их из слова reserved.

   **Типичная ошибка:** Считать любой незнакомый префикс свободным для внутреннего использования.

   **Источник:** [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml).

143. Что такое documentation ranges?

   **Ответ:** Для IPv4 документационные блоки — `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`; для IPv6 — `2001:db8::/32`. Их используют в примерах вместо реальных чужих адресов, но не как production-адресный план.

   **Типичная ошибка:** Ожидать интернет-доступность адреса из учебного примера.

   **Источник:** [RFC 5737: IPv4 Address Blocks Reserved for Documentation](https://www.rfc-editor.org/rfc/rfc5737); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

144. Почему важно фильтровать bogon addresses?

   **Ответ:** Фильтрация адресов, недопустимых на конкретной границе, уменьшает spoofing и ошибочные объявления. Список должен соответствовать контексту и актуальным реестрам: устаревшие bogon-фильтры могут блокировать уже выделенные сети.

   **Типичная ошибка:** Однажды сохранить список невыделенных блоков и больше не обновлять его.

   **Источник:** [RFC 2827: Network Ingress Filtering](https://www.rfc-editor.org/rfc/rfc2827); [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml).

145. Как понять, private или public IP у хоста?

   **Ответ:** Сначала получают адреса интерфейсов и классифицируют их по префиксам и реестрам. Для проверки внешнего представления нужен взгляд с другой стороны NAT. Отсутствие RFC1918-префикса само по себе не означает public address.

   **Пример:**

   ```bash
   ip -brief address show  # Linux: адреса интерфейсов, не внешний NAT mapping.
   ```

   **Типичная ошибка:** Считать `100.64.1.2` публичным только потому, что он не входит в RFC1918.

   **Источник:** [Linux man-pages: getifaddrs(3)](https://man7.org/linux/man-pages/man3/getifaddrs.3.html); [IANA: IPv4 Special-Purpose Address Registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml); [RFC 6598: Shared Address Space](https://www.rfc-editor.org/rfc/rfc6598).


### Продвинутый уровень
146. Как получить локальный IP адрес в C/C++?

   **Ответ:** getifaddrs возвращает список адресов интерфейсов; нужно проверить ifa_addr на NULL и sa_family, затем преобразовать адрес. Единственного «локального IP» у multihomed хоста нет. Адрес выбранного соединения получают через getsockname.

   **Типичная ошибка:** Брать первый адрес списка, который может быть loopback или относиться к другому интерфейсу.

   **Источник:** [Linux man-pages: getifaddrs(3)](https://man7.org/linux/man-pages/man3/getifaddrs.3.html).

147. Как узнать peer IP после `accept()`?

   **Ответ:** accept может заполнить sockaddr_storage и фактическую длину peer address; для существующего сокета используют getpeername. Числовой вывод удобно получить getnameinfo с NI_NUMERICHOST и NI_NUMERICSERV.

   **Типичная ошибка:** Считать peer socket IP исходным клиентом, когда соединение пришло от reverse proxy.

   **Источник:** [Linux man-pages: getpeername(2)](https://man7.org/linux/man-pages/man2/getpeername.2.html); [Linux man-pages: getnameinfo(3)](https://man7.org/linux/man-pages/man3/getnameinfo.3.html).

148. Как определить, private ли адрес, программно?

   **Ответ:** Нужно определить, что означает private в контракте: только RFC1918, также ULA или более широкий набор неглобальных адресов. Затем сравнивают бинарный адрес с явными префиксами; IPv4-mapped адреса нормализуют перед IPv4-проверками.

   **Типичная ошибка:** Считать все неглобальные адреса RFC1918 или проверять только IPv4.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [RFC 4193: Unique Local IPv6 Unicast Addresses](https://www.rfc-editor.org/rfc/rfc4193); [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291).

149. Как проверить, попадает ли адрес в RFC1918 диапазон?

   **Ответ:** IPv4 переводят в host byte order и проверяют принадлежность `10/8`, `172.16/12`, `192.168/16` через маски. Границы диапазонов должны быть покрыты тестами. Такая функция проверяет RFC1918, а не общую глобальную достижимость.

   **Пример:**

   ```c
   #include <arpa/inet.h>
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>

   bool is_rfc1918(struct in_addr address) {
       uint32_t ip = ntohl(address.s_addr);
       return (ip & UINT32_C(0xff000000)) == UINT32_C(0x0a000000) ||
              (ip & UINT32_C(0xfff00000)) == UINT32_C(0xac100000) ||
              (ip & UINT32_C(0xffff0000)) == UINT32_C(0xc0a80000);
   }
   ```

   **Типичная ошибка:** Ошибочно включать `172.32.0.0` в частный диапазон.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html).

150. Почему нельзя просто проверять строковый префикс?

   **Ответ:** Строковое сравнение зависит от формата и легко захватывает соседние диапазоны. Например, `172.1` не выражает `172.16/12`; IPv6 имеет несколько эквивалентных записей. Правильная проверка работает над бинарными адресами и префиксами.

   **Типичная ошибка:** Проверять `starts_with("172.")` для RFC1918.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918); [Linux man-pages: inet_pton(3)](https://man7.org/linux/man-pages/man3/inet_pton.3.html).

151. Как приложение может узнать свой внешний public IP?

   **Ответ:** Оно может получить наблюдаемый endpoint через STUN либо ответ доверенного внешнего сервиса. Результат относится к конкретному пути, протоколу и моменту: другие назначения могут видеть иной mapping. Нужна явная политика доверия к ответу.

   **Типичная ошибка:** Считать ответ одного HTTP-сервиса универсальным UDP/TCP endpoint для всех peers.

   **Источник:** [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

152. Почему приложение обычно не знает public IP напрямую за NAT?

   **Ответ:** NAT находится за пределами локального socket API и изменяет адрес уже после отправки пакета. Хост видит локальный endpoint; внешний mapping нужно узнать извне или через протокол управления устройством.

   **Типичная ошибка:** Ожидать public адрес NAT в getsockname локального сокета.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489).

153. Какие сетевые сервисы ломаются за NAT или CGNAT?

   **Ответ:** Особенно сложны протоколы с адресами в payload, прямыми входящими потоками и несколькими согласуемыми соединениями: P2P, телефония и некоторые VPN/FTP-сценарии. Совместимость зависит от traversal, ALG и поведения NAT.

   **Типичная ошибка:** Утверждать, что любой протокол обязательно перестаёт работать за NAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

154. Почему P2P сложнее работает через private addressing?

   **Ответ:** Private endpoint другого участника не достижим напрямую из произвольной сети. Нужно выяснить кандидаты, проверить mappings и фильтрацию; некоторые NAT требуют relay. Сам обмен public IP ещё не гарантирует связность.

   **Типичная ошибка:** Считать один успешный STUN-запрос доказательством прямой доступности для любого peer.

   **Источник:** [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445); [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489).

155. Как NAT traversal связан с private IP?

   **Ответ:** NAT traversal помогает установить связь при трансляции адресов: обнаруживает кандидаты, создаёт/проверяет mappings и при необходимости использует relay. Private адрес — локальный кандидат, а server-reflexive и relay адреса дают другие возможности связи.

   **Типичная ошибка:** Публиковать только private IP в сигнализации между участниками из разных сетей.

   **Источник:** [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

156. Как логировать private и public адреса в серверном приложении?

   **Ответ:** Записывают локальный и peer endpoint, семейство, протокол, время и идентификатор соединения. Адрес из доверенного proxy-заголовка хранят отдельно от socket peer; NAT mapping получают из соответствующих сетевых логов.

   **Типичная ошибка:** Доверять любому клиентскому X-Forwarded-For и подменять им фактического peer в аудите.

   **Источник:** [Linux man-pages: getnameinfo(3)](https://man7.org/linux/man-pages/man3/getnameinfo.3.html); [RFC 7239: Forwarded HTTP Extension](https://www.rfc-editor.org/rfc/rfc7239); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

157. Какие security-риски связаны с раскрытием internal IP ranges?

   **Ответ:** Внутренние диапазоны раскрывают часть топологии и помогают разведке, но сами по себе не дают доступ. Их не стоит без необходимости публиковать в ошибках и публичных логах; доступ защищают аутентификацией, сегментацией и ACL.

   **Типичная ошибка:** Считать секретность private IP основной защитой внутреннего сервиса.

   **Источник:** [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

158. Как в tcpdump понять, что трафик идёт между private адресами?

   **Ответ:** В libpcap используют фильтр по трём RFC1918-сетям для источника и назначения. Точка захвата важна: с внешней стороны NAT адреса уже могут быть заменены.

   **Пример:**

   ```bash
   # Linux; нужны права на захват. Оба endpoint должны быть RFC1918.
   tcpdump -ni any -c 20 \
     '(src net 10.0.0.0/8 or src net 172.16.0.0/12 or src net 192.168.0.0/16) and (dst net 10.0.0.0/8 or dst net 172.16.0.0/12 or dst net 192.168.0.0/16)'
   ```

   **Типичная ошибка:** По внешнему дампу делать вывод, что внутри сети RFC1918 вообще не используется.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

159. Как интерпретировать mixed environment с private backend и public frontend?

   **Ответ:** Публичный frontend принимает внешнее соединение, backend получает трафик по внутренней адресации. При L7 proxy это обычно два независимых соединения; источник на backend может быть адресом proxy. Корреляция требует request/connection IDs и доверенной передачи метаданных.

   **Типичная ошибка:** Ожидать совпадения socket peer на backend с IP внешнего клиента.

   **Источник:** [RFC 7239: Forwarded HTTP Extension](https://www.rfc-editor.org/rfc/rfc7239); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

160. Как тестировать приложение в среде с private и public addressing?

   **Ответ:** В изолированной лаборатории создают внутреннюю и внешнюю сети с маршрутизатором/NAT, проверяют исходящие и входящие сценарии, ACL, логирование и перекрытие диапазонов. Внешнюю доступность проверяют из отдельной сети, не только через hairpin.

   **Типичная ошибка:** Тестировать port forwarding только из той же LAN и переносить результат на внешних клиентов.

   **Источник:** [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).


---

## 4. NAT (SNAT, DNAT, PAT)

### Базовый уровень
161. Что такое NAT?

   **Ответ:** NAT меняет IP-адреса при прохождении пакетов через транслятор и обеспечивает соответствующее преобразование обратного трафика. NAPT дополнительно использует номера портов. При изменении полей пересчитывают затронутые контрольные суммы.

   **Типичная ошибка:** Считать NAT синонимом маршрутизации: маршрут выбирает путь, а NAT изменяет адреса.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

162. Зачем нужен NAT?

   **Ответ:** Основные задачи — совместное использование публичных IPv4, соединение сетей с разными адресными планами и публикация внутренних endpoints. Это добавляет состояние и затрудняет прямую связность.

   **Типичная ошибка:** Использовать NAT там, где достаточно согласованной адресации и маршрутизации.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

163. Что такое source NAT?

   **Ответ:** SNAT изменяет исходный адрес пакета, например private адрес клиента на внешний адрес шлюза. NAPT может также изменить исходный порт; обратный трафик переводится по соответствующему mapping.

   **Типичная ошибка:** Считать, что SNAT изменяет адрес назначения сервера в исходящем пакете.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

164. Что такое destination NAT?

   **Ответ:** DNAT изменяет адрес назначения, например публичный endpoint сервиса на внутренний сервер. При необходимости меняется и destination port; обратное преобразование должно быть согласовано с путём ответов.

   **Типичная ошибка:** Добавить DNAT, но забыть маршрутизацию, forwarding и firewall до backend.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

165. Что такое PAT?

   **Ответ:** PAT, или NAPT, различает несколько внутренних потоков по внешним адресам и портам. Это позволяет многим узлам использовать один публичный IPv4 для TCP/UDP.

   **Типичная ошибка:** Считать, что одному внутреннему хосту всегда навсегда выделяется один внешний порт.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

166. Чем PAT отличается от обычного NAT?

   **Ответ:** Basic NAT сопоставляет IP-адреса, а NAPT/PAT также использует транспортные порты и протокол. Поэтому NAPT способен разделять один внешний адрес между множеством внутренних endpoints.

   **Типичная ошибка:** Игнорировать транспортный протокол при описании port mapping.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

167. Как NAT помогает экономить IPv4 адреса?

   **Ответ:** При NAPT множество внутренних адресов использует небольшой пул внешних IP, различаясь портами и состоянием. Basic one-to-one NAT сам по себе такого масштаба экономии не даёт.

   **Типичная ошибка:** Приписывать одинаковую экономию one-to-one NAT и many-to-one PAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

168. Почему NAT не является полноценным security-механизмом?

   **Ответ:** NAT выполняет трансляцию, но не аутентифицирует peers, не шифрует данные и не задаёт полную политику доступа. Запрет нежелательных входящих пакетов обычно обеспечивается фильтрацией/stateful firewall и поведением mappings.

   **Типичная ошибка:** Считать любой разрешённый исходящий поток безопасным только потому, что он прошёл NAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

169. Что происходит с исходным адресом при SNAT?

   **Ответ:** SNAT заменяет source IP на адрес из настроенного пула или адрес выходного интерфейса; при NAPT может измениться source port. Конечный сервер видит трансляцию, а не исходный private endpoint.

   **Типичная ошибка:** Искать исходный private адрес в IP-заголовке на внешней стороне NAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

170. Что происходит с адресом назначения при DNAT?

   **Ответ:** DNAT заменяет destination IP, а при заданном port forwarding — и порт назначения. Пакет затем должен пройти маршрутизацию и фильтрацию до нового адресата.

   **Типичная ошибка:** Проверять правило фильтрации только по адресу назначения до трансляции, не учитывая hook.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

171. Что такое port forwarding?

   **Ответ:** Port forwarding публикует внешний адрес/порт и направляет входящий трафик к внутреннему endpoint. Обычно это DNAT с согласованным обратным маршрутом и разрешением forwarding.

   **Типичная ошибка:** Ожидать, что проброс TCP-порта автоматически пробросит UDP с тем же номером.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html); [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

172. Как port forwarding связан с DNAT?

   **Ответ:** DNAT реализует замену внешнего назначения на внутреннее. Port forwarding — конкретное применение, обычно с условием по протоколу и порту. DNAT может работать и без изменения порта.

   **Типичная ошибка:** Считать всякий DNAT обязательно преобразованием номера порта.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

173. Может ли NAT менять только IP, не меняя порт?

   **Ответ:** Да: one-to-one/basic NAT меняет адрес, сохраняя транспортный порт. Даже NAPT может сохранить порт, если он доступен и это допускает политика mapping.

   **Типичная ошибка:** Определять наличие NAT только по изменившемуся порту.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

174. Когда NAT меняет и адрес, и порт?

   **Ответ:** При NAPT порт меняют, чтобы избежать конфликтов внешних mappings или выполнить явное правило. В DNAT внешний порт сервиса также можно направить на другой порт backend.

   **Типичная ошибка:** Считать изменение порта обязательным для каждого пакета, проходящего NAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

175. Что такое NAT table / translation table?

   **Ответ:** Это набор соответствий внутренних и внешних endpoints и связанного состояния. В Linux правила NAT и conntrack mappings — разные сущности: правило задаёт решение, conntrack хранит состояние потока.

   **Типичная ошибка:** Пытаться найти все активные соединения в выводе списка NAT rules.

   **Источник:** [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [nftables manual](https://netfilter.org/projects/nftables/manpage.html).


### Средний уровень
176. Как NAT отслеживает соединения?

   **Ответ:** Stateful NAT хранит исходный и обратный tuple, трансляцию и таймеры; для TCP учитывает наблюдаемое состояние. UDP тоже может иметь conntrack state, хотя сам протокол не устанавливает соединение.

   **Типичная ошибка:** Считать, что UDP не может иметь состояние на NAT.

   **Источник:** [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

177. Почему NAT проще работает с TCP, чем с некоторыми другими протоколами?

   **Ответ:** У TCP есть явные признаки установки и завершения соединения, помогающие вести состояние. Но UDP с таймерами тоже хорошо поддерживается; основные трудности создают встроенные адреса, дополнительные потоки и несовместимые схемы проверки целостности.

   **Типичная ошибка:** Утверждать, что TCP вообще не требует NAT-таймаутов или не может пострадать от истечения mapping.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

178. Какие проблемы NAT создаёт для протоколов, встраивающих IP в payload?

   **Ответ:** Трансляция заголовка не исправляет IP/порт, записанные внутри приложения. Peer может попытаться подключиться к private адресу. Нужны протокольные traversal-механизмы, посредник или ALG, который сам создаёт дополнительные риски совместимости.

   **Типичная ошибка:** Ожидать, что NAT автоматически найдёт и заменит все адреса в любом payload, включая шифрованный.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 6314: NAT Traversal Practices for Client-Server SIP](https://www.rfc-editor.org/rfc/rfc6314).

179. Почему FTP historically имеет проблемы с NAT?

   **Ответ:** FTP использует отдельное data connection: в active mode сервер подключается к адресу/порту клиента из управляющего канала. NAT/firewall мешает такому входящему подключению. Passive mode меняет инициатора, но сервер всё равно должен корректно публиковать data endpoint.

   **Типичная ошибка:** Считать, что открытого TCP/21 достаточно для всех FTP data connections.

   **Источник:** [RFC 1579: Firewall-Friendly FTP](https://www.rfc-editor.org/rfc/rfc1579).

180. Какие проблемы возникают у SIP за NAT?

   **Ответ:** SIP-сигнализация и SDP могут содержать адреса и порты, не достижимые снаружи; медиапотоки имеют собственные mappings и таймеры. Используют подходящие SIP-механизмы, ICE/STUN/TURN и иногда SBC.

   **Типичная ошибка:** Исправлять только SIP Contact, не проверяя адреса и связность медиапотока.

   **Источник:** [RFC 6314: NAT Traversal Practices for Client-Server SIP](https://www.rfc-editor.org/rfc/rfc6314); [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

181. Что такое hairpin NAT?

   **Ответ:** Hairpin NAT позволяет внутреннему клиенту обратиться к внутреннему серверу через его внешний mapping. Могут потребоваться и DNAT, и SNAT, чтобы ответы вернулись через транслятор.

   **Типичная ошибка:** Считать успешный hairpin доказательством доступности сервиса из интернета.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787); [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

182. Что такое symmetric NAT?

   **Ответ:** Исторический термин symmetric NAT обычно описывает зависимость mapping от удалённого назначения. Надёжнее отдельно описывать mapping и filtering behavior по RFC 4787: они влияют на traversal независимо.

   **Типичная ошибка:** Определять все свойства NAT одним ярлыком и обещать работоспособность любого P2P.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

183. Чем full cone NAT отличается от symmetric NAT?

   **Ответ:** Исторически full cone сочетает endpoint-independent mapping и допускающую входящий трафик фильтрацию; symmetric обычно означает destination-dependent mapping. Современное описание разделяет поведение mapping и filtering вместо одной типологии.

   **Типичная ошибка:** Смешивать постоянство внешнего mapping с разрешением пакетов от любого источника.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

184. Почему тип NAT важен для P2P?

   **Ответ:** Traversal зависит от того, сохраняется ли внешний endpoint при смене peer и какие входящие источники допускает фильтрация. При строгих сочетаниях прямые connectivity checks могут не пройти, и потребуется relay.

   **Типичная ошибка:** Использовать STUN endpoint, полученный для одного назначения, как гарантированно пригодный для любого другого.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787); [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

185. Что происходит при timeout state в NAT table?

   **Ответ:** Транслятор удаляет mapping; поздний пакет больше не связан с прежним внутренним endpoint и может быть отброшен. Новый исходящий трафик может получить другой mapping, что нарушит ожидания приложения.

   **Типичная ошибка:** Считать бесконечным время жизни внешнего UDP endpoint после одного запроса.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

186. Почему UDP через NAT требует keepalive?

   **Ответ:** Если протоколу нужно сохранять простаивающий UDP mapping, он может отправлять keepalive до истечения таймера. Интервал выбирают по требованиям протокола и среды, учитывая нагрузку; keepalive не нужен каждому короткому UDP-запросу.

   **Типичная ошибка:** Назначать агрессивный универсальный keepalive всем клиентам без оценки масштаба.

   **Источник:** [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787); [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

187. Как NAT влияет на входящие соединения?

   **Ответ:** Новый входящий пакет должен соответствовать допустимому mapping или явному правилу публикации и пройти фильтрацию. При обычном исходящем NAPT произвольное входящее соединение к private хосту не имеет однозначного назначения.

   **Типичная ошибка:** Считать блокировку входящих пакетов криптографической гарантией NAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

188. Почему серверы чаще требуют DNAT / port forwarding?

   **Ответ:** Клиент должен знать внешний endpoint, который транслятор направит на сервер. Для backend с private IPv4 это может быть DNAT/port forwarding, proxy или load balancer. Сервер с собственной публичной адресацией не требует DNAT только потому, что он сервер.

   **Типичная ошибка:** Без необходимости ставить DNAT перед любым публично маршрутизируемым сервером.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022).

189. Чем NAT44 отличается от NAT64?

   **Ответ:** NAT44 переводит адреса между IPv4-сетями, сохраняя версию IP. NAT64 переводит пакеты между IPv6 и IPv4 с преобразованием заголовков и состояния; типичный сценарий — IPv6-клиент к IPv4-серверу.

   **Типичная ошибка:** Считать NAT64 обычной заменой IPv6-адреса в неизменном IPv6-пакете.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 6146: Stateful NAT64](https://www.rfc-editor.org/rfc/rfc6146).

190. Для чего нужен NAT64?

   **Ответ:** NAT64 позволяет IPv6-only клиентам обращаться к IPv4-сервисам. Часто DNS64 синтезирует AAAA из A-записи, чтобы клиент направил пакет к транслятору. IPv4 literals и адреса внутри payload требуют отдельного рассмотрения.

   **Типичная ошибка:** Обещать прозрачную работу любого IPv4-only приложения только от включения DNS64.

   **Источник:** [RFC 6146: Stateful NAT64](https://www.rfc-editor.org/rfc/rfc6146); [RFC 6147: DNS64](https://www.rfc-editor.org/rfc/rfc6147).

191. Что такое NPTv6?

   **Ответ:** NPTv6 — stateless трансляция IPv6-префикса между внутренней и внешней адресацией с сохранением host part и checksum-neutral mapping. Это не NAPT и не механизм разделения одного адреса по портам.

   **Типичная ошибка:** Приравнивать NPTv6 к stateful many-to-one IPv4 PAT.

   **Источник:** [RFC 6296: IPv6-to-IPv6 Network Prefix Translation](https://www.rfc-editor.org/rfc/rfc6296).

192. Почему NAT в IPv6 не обязателен?

   **Ответ:** IPv6 предоставляет достаточно адресов для глобальной адресации узлов, поэтому NAT ради экономии адресов обычно не нужен. Контроль доступа выполняет firewall; отдельные задачи трансляции могут существовать, но не являются обязательной частью IPv6.

   **Типичная ошибка:** Считать отсутствие NAT отсутствием защиты от входящих соединений.

   **Источник:** [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291); [RFC 6296: IPv6-to-IPv6 Network Prefix Translation](https://www.rfc-editor.org/rfc/rfc6296).

193. Какие преимущества и недостатки NAT с точки зрения оператора сети?

   **Ответ:** NAT экономит public IPv4 и помогает управлять адресными планами, но требует mappings, портов, обработки таймаутов и логов. Усложняет входящие сервисы, отладку и HA. Выгоду оценивают вместе с ресурсами и требованиями приложений.

   **Типичная ошибка:** Оценивать операторский NAT только по общей пропускной способности.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

194. Почему NAT усложняет observability?

   **Ответ:** Разные точки наблюдения видят разные tuples, а общий внешний IP может принадлежать множеству абонентов. Для корреляции нужны timestamps, протокол, порты и translation events; часы и сроки хранения должны быть согласованы.

   **Типичная ошибка:** Коррелировать внешние и внутренние логи только по IP без времени и порта.

   **Источник:** [RFC 8158: IPFIX Information Elements for Logging NAT Events](https://www.rfc-editor.org/rfc/rfc8158); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

195. Какие проблемы NAT создаёт для end-to-end connectivity?

   **Ответ:** Внешний peer не всегда может инициировать связь; mappings могут истекать и зависеть от назначения. Адреса в payload и защита неизменности заголовков также усложняются. Приложениям нужны traversal или посредники.

   **Типичная ошибка:** Считать public endpoint постоянным идентификатором клиента после смены сети или NAT.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).


### Продвинутый уровень
196. Как NAT влияет на socket programming?

   **Ответ:** Локальные bind/getsockname отражают адрес хоста, а не внешний mapping. Приложению могут понадобиться traversal, keepalive и reconnect; endpoint, сообщаемый peer, должен соответствовать доступному пути.

   **Типичная ошибка:** Передавать private getsockname адрес удалённому интернет-клиенту как единственный доступный endpoint.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489).

197. Почему `getsockname()` не всегда показывает реальный внешний адрес?

   **Ответ:** getsockname описывает локальный endpoint сокета в данном network namespace. Трансляция может происходить на другом узле после отправки, поэтому этот API не обязан знать внешний адрес и порт.

   **Типичная ошибка:** Заменять STUN или внешний контрольный запрос вызовом getsockname.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489).

198. Как приложение узнаёт свой mapped public endpoint?

   **Ответ:** Через STUN оно получает server-reflexive address для конкретного socket/path; через согласованный API шлюза может запросить mapping. Результат нужно проверять connectivity checks, поскольку другой peer может наблюдать иное поведение.

   **Типичная ошибка:** Отправлять STUN с одного UDP-сокета, а ожидать тот же mapping у другого.

   **Источник:** [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489); [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

199. Что такое STUN?

   **Ответ:** STUN — набор механизмов, среди которых определение наблюдаемого сервером адреса/порта клиента и проверки связности. Сам по себе STUN не ретранслирует весь пользовательский трафик и не гарантирует обход любого NAT.

   **Типичная ошибка:** Называть STUN универсальным туннелем через firewall.

   **Источник:** [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489).

200. Для чего используются STUN, TURN, ICE?

   **Ответ:** STUN помогает узнать и проверить endpoints; TURN предоставляет relay, когда прямой путь не подходит; ICE собирает кандидаты, проверяет пары и выбирает работающий путь. Наличие TURN-кандидата не означает обязательный relay для каждого соединения.

   **Типичная ошибка:** Использовать только STUN без relay fallback там, где требуется высокая доля успешных подключений.

   **Источник:** [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445); [RFC 8489: Session Traversal Utilities for NAT](https://www.rfc-editor.org/rfc/rfc8489).

201. Как NAT traversal работает на высоком уровне?

   **Ответ:** Участники получают host, server-reflexive и при необходимости relay candidates, обмениваются ими через сигнализацию, проводят connectivity checks и выбирают подходящую пару. Состояние поддерживают и пересоздают при изменении пути.

   **Типичная ошибка:** Предполагать, что «hole punching» пробивает любую корпоративную политику фильтрации.

   **Источник:** [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445).

202. Какие приложения наиболее чувствительны к NAT?

   **Ответ:** Чувствительны приложения с прямой peer-to-peer связью, входящими потоками, адресами в payload и долгими простоями: телефония, игры, P2P и некоторые VPN. Степень зависит от поведения NAT и traversal реализации.

   **Типичная ошибка:** Переносить успешный результат HTTP через NAT на все UDP-приложения.

   **Источник:** [RFC 8445: Interactive Connectivity Establishment](https://www.rfc-editor.org/rfc/rfc8445); [RFC 6314: NAT Traversal Practices for Client-Server SIP](https://www.rfc-editor.org/rfc/rfc6314).

203. Почему NAT ломает некоторые security модели?

   **Ответ:** Трансляция нарушает предположения о постоянстве адресов и end-to-end идентичности; общий IP не определяет одного пользователя. Кроме того, изменение защищённых полей может конфликтовать с протоколами целостности. Идентичность следует подтверждать на подходящем уровне.

   **Типичная ошибка:** Аутентифицировать пользователя только по public IP за CGNAT.

   **Источник:** [RFC 4302: IP Authentication Header](https://www.rfc-editor.org/rfc/rfc4302); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

204. Как NAT влияет на IPsec?

   **Ответ:** IPsec AH защищает поля IP-заголовка, поэтому их изменение NAT несовместимо с проверкой. ESP имеет другие ограничения; для прохождения NAT применяют UDP encapsulation и NAT traversal. Поддержку проверяют для конкретных режимов и peers.

   **Типичная ошибка:** Считать, что весь IPsec принципиально не работает через NAT.

   **Источник:** [RFC 4302: IP Authentication Header](https://www.rfc-editor.org/rfc/rfc4302); [RFC 3948: UDP Encapsulation of IPsec ESP Packets](https://www.rfc-editor.org/rfc/rfc3948).

205. Почему ESP historically конфликтует с NAT?

   **Ответ:** У ESP нет TCP/UDP-портов, на которые рассчитан обычный NAPT; возникают проблемы demultiplexing и совместимости реализации. Для transport mode также важны адреса в проверках верхнего уровня. UDP encapsulation предоставляет пригодный для NAT внешний транспорт.

   **Типичная ошибка:** Объяснять конфликт ESP тем, что он обязательно аутентифицирует весь внешний IP-заголовок, как AH.

   **Источник:** [RFC 3948: UDP Encapsulation of IPsec ESP Packets](https://www.rfc-editor.org/rfc/rfc3948); [RFC 4302: IP Authentication Header](https://www.rfc-editor.org/rfc/rfc4302).

206. Что такое NAT-T?

   **Ответ:** NAT-T для IPsec включает обнаружение NAT и инкапсуляцию ESP в UDP, обычно с UDP/4500. Это позволяет NAPT обслуживать поток; при необходимости mapping поддерживают keepalive. Одного открытия UDP/4500 недостаточно без согласования peers.

   **Типичная ошибка:** Путать IPsec NAT-T с произвольным пробросом UDP-порта без настройки IPsec.

   **Источник:** [RFC 3948: UDP Encapsulation of IPsec ESP Packets](https://www.rfc-editor.org/rfc/rfc3948).

207. Как в Linux настроить простейший SNAT / MASQUERADE?

   **Ответ:** В Linux SNAT/MASQUERADE задают в postrouting NAT chain. SNAT использует явный адрес, masquerade — адрес выходного интерфейса. Отдельно нужны IP forwarding, маршруты и firewall. Настраивать пример следует в изолированной лаборатории.

   **Пример:**

   ```bash
   # Пример для отдельной Linux-лаборатории: eth0 — WAN. Нужны root-права.
   # Forwarding и фильтрация настраиваются отдельно.
   nft add table ip lab_nat
   nft 'add chain ip lab_nat postrouting { type nat hook postrouting priority srcnat; policy accept; }'
   nft add rule ip lab_nat postrouting oifname "eth0" ip saddr 10.0.0.0/24 masquerade
   ```

   **Типичная ошибка:** Добавить masquerade и ожидать, что оно само включит forwarding и разрешит transit-трафик.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

208. Как в Linux настроить DNAT для входящего соединения?

   **Ответ:** DNAT задают в prerouting NAT chain с условиями по входному интерфейсу, адресу, протоколу и порту. Проверяют маршрут к backend, разрешение forwarding и возврат ответов через тот же NAT. Локально созданный трафик проходит другой hook.

   **Пример:**

   ```bash
   # Отдельная Linux-лаборатория: WAN=eth0, внешний адрес=198.51.100.10.
   # Адреса учебные; forwarding/firewall и return route настроены отдельно.
   nft add table ip lab_dnat
   nft 'add chain ip lab_dnat prerouting { type nat hook prerouting priority dstnat; policy accept; }'
   nft add rule ip lab_dnat prerouting iifname "eth0" ip daddr 198.51.100.10 tcp dport 8080 dnat to 10.0.0.10:80
   ```

   **Типичная ошибка:** Проверять prerouting DNAT запросом с самого NAT gateway и ожидать тот же путь пакета.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html).

209. Как посмотреть текущие NAT rules в Linux?

   **Ответ:** Для nftables используют nft list ruleset, для iptables — просмотр nat table. Нужно учитывать используемый backend и network namespace; правила не равны активным mappings.

   **Пример:**

   ```bash
   # Linux, с правами администратора:
   nft list ruleset
   iptables -t nat -S  # Если используются iptables.
   ```

   **Типичная ошибка:** Проверить только iptables-legacy на узле, где правила установлены через nftables.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

210. Как отладить проблему port forwarding?

   **Ответ:** Проверяют внешний адрес, приход пакета на WAN, совпадение DNAT, forwarding/firewall, доступность backend и обратный маршрут. Сопоставляют дампы по обе стороны и conntrack. Наличие listener проверяют на самом backend.

   **Типичная ошибка:** Исправлять DNAT, когда SYN вообще не приходит из-за upstream CGNAT.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [RFC 6598: Shared Address Space](https://www.rfc-editor.org/rfc/rfc6598).

211. Как увидеть трансляцию адресов в conntrack?

   **Ответ:** conntrack показывает original и reply tuples; при трансляции их адреса/порты позволяют увидеть mapping. Нужны права и правильный namespace. Event mode помогает наблюдать создание и удаление состояния.

   **Пример:**

   ```bash
   # Linux, с правами администратора:
   conntrack -L -p tcp
   conntrack -E  # События до Ctrl-C.
   ```

   **Типичная ошибка:** Считать отсутствие старого соединения в списке доказательством отсутствия NAT: mapping мог истечь.

   **Источник:** [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

212. Какое влияние NAT оказывает на производительность?

   **Ответ:** NAT требует lookup/update состояния, пересчёта checksum и распределения портов. Ограничивать могут packets per second, connection rate, память, блокировки и логирование; аппаратное offload меняет профиль. Измеряют на реальных размерах пакетов и churn.

   **Типичная ошибка:** Оценивать производительность только длительной передачей одного TCP-потока.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

213. Как масштабируются крупные NAT gateway?

   **Ответ:** Распределяют mappings и public pools между узлами, сохраняют flow affinity, контролируют port allocation и capacity. HA требует политики синхронизации или явного reconnect; асимметричный путь должен попадать к нужному состоянию.

   **Типичная ошибка:** Балансировать каждый пакет независимо между несогласованными stateful NAT узлами.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

214. Какие ресурсы ограничивают NAT устройство?

   **Ответ:** Публичные адреса и порты, память conntrack, скорость создания/удаления mappings, CPU/PPS, пропускная способность и ёмкость логирования. Реальное число одновременно допустимых потоков зависит от политики повторного использования ports и tuples.

   **Типичная ошибка:** Обещать строго 65 536 соединений на один public IP независимо от протокола, peers и политики NAT.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888); [RFC 4787: NAT Behavioral Requirements for Unicast UDP](https://www.rfc-editor.org/rfc/rfc4787).

215. Что происходит при исчерпании port space в PAT?

   **Ответ:** Новым mappings не хватает допустимого внешнего endpoint: подключения могут отбрасываться или завершаться таймаутом, а устройство регистрирует allocation failures. Помогают увеличение пула, лимиты и контроль ненужных соединений.

   **Типичная ошибка:** Сокращать таймауты без анализа и массово разрывать ещё нужные mappings.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).


### Инженерные вопросы
216. Когда NAT оправдан архитектурно, а когда вреден?

   **Ответ:** NAT оправдан при нехватке публичных IPv4, контролируемой публикации private backend или переходных адресных конфликтах. Он нежелателен, если добавляет состояние и ломает end-to-end без необходимой выгоды. Решение сравнивают с обычной маршрутизацией и proxy.

   **Типичная ошибка:** Использовать трансляцию как универсальную замену адресному плану и firewall.

   **Источник:** [RFC 3022: Traditional NAT](https://www.rfc-editor.org/rfc/rfc3022); [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

217. Какие компромиссы возникают при использовании NAT в облаке?

   **Ответ:** Облачный NAT упрощает исходящий доступ private workloads, но может добавлять стоимость, port limits, зависимость от зоны и сложность внешней атрибуции. Точные ограничения и HA зависят от конкретной услуги и конфигурации.

   **Типичная ошибка:** Считать управляемый NAT бесконечно масштабируемым и автоматически устойчивым к любому отказу зоны.

   **Источник:** [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

218. Как логировать NAT translations для аудита?

   **Ответ:** Логируют создание/удаление mappings, original/translated endpoints, протокол, subscriber context и точные timestamps. Нужны синхронизация часов, целостность, контроль потерь и политика хранения. Содержимое payload для сопоставления NAT обычно не требуется.

   **Типичная ошибка:** Записывать только внешний IP без порта и времени.

   **Источник:** [RFC 8158: IPFIX Information Elements for Logging NAT Events](https://www.rfc-editor.org/rfc/rfc8158); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

219. Как проектировать высокодоступный NAT?

   **Ответ:** Определяют допустимую потерю established flows, резервируют адреса и ресурсы, обеспечивают согласованные forward/reverse пути. Для сохранения состояния используют репликацию mappings и проверяют split-brain, таймеры и повторное выделение портов.

   **Типичная ошибка:** Проверять HA только новым соединением после отказа, не проверив существующие потоки.

   **Источник:** [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [RFC 6888: Common Requirements for Carrier-Grade NATs](https://www.rfc-editor.org/rfc/rfc6888).

220. Как NAT влияет на балансировщики, firewall и мониторинг?

   **Ответ:** Порядок hooks определяет, какие адреса видят ACL и балансировщик. Stateful цепочка должна сохранять путь к нужному состоянию; мониторинг коррелирует tuples до и после NAT и health backend. L7 proxy дополнительно создаёт отдельные соединения.

   **Типичная ошибка:** Сопоставлять firewall, LB и application logs по одному tuple, игнорируя точки трансляции.

   **Источник:** [nftables manual](https://netfilter.org/projects/nftables/manpage.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html); [RFC 8158: IPFIX Information Elements for Logging NAT Events](https://www.rfc-editor.org/rfc/rfc8158).


---

## 5. Routing: Static Routing

### Базовый уровень
221. Что такое routing?

   **Ответ:** Routing выбирает путь IP-пакета к назначению по маршрутам и политике. Для локального отправителя это выбор next hop, выходного интерфейса и часто исходного адреса; для маршрутизатора — решение о дальнейшей пересылке.

   **Типичная ошибка:** Приравнивать routing к NAT: пересылка не требует изменения IP endpoints.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

222. Чем routing отличается от switching?

   **Ответ:** IP routing пересылает между сетями по L3-адресу и таблицам маршрутизации. Ethernet switching пересылает кадры по MAC и L2 forwarding table внутри bridged-сегмента. Одно устройство может выполнять обе функции.

   **Типичная ошибка:** Считать, что любой физический коммутатор не способен маршрутизировать.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

223. Что такое routing table?

   **Ответ:** Таблица маршрутизации содержит префиксы назначения и сведения о действии: next hop, интерфейс, metric, тип маршрута и дополнительные атрибуты. В Linux policy rules могут выбирать разные таблицы.

   **Типичная ошибка:** Ожидать, что список маршрутов является списком всех активных TCP-соединений.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

224. Что такое next hop?

   **Ответ:** Next hop — следующий узел, которому нужно передать пакет на выбранном пути. Его link-layer адрес разрешают локально; конечный IP destination обычно остаётся прежним. Для directly connected назначения отдельный gateway не нужен.

   **Типичная ошибка:** Выполнять ARP для удалённого destination вместо локального next-hop gateway.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

225. Что такое default route?

   **Ответ:** Default route — наименее специфичный маршрут `/0`, используемый при отсутствии более подходящего. Для IPv4 это `0.0.0.0/0`, для IPv6 — `::/0`.

   **Типичная ошибка:** Считать default route предпочтительнее любого более специфичного маршрута с большей metric.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

226. Что означает маршрут `0.0.0.0/0`?

   **Ответ:** `0.0.0.0/0` покрывает всё IPv4-пространство: в префиксе нет фиксированных битов. Он используется как default route, но не отменяет longest prefix match и policy routing.

   **Типичная ошибка:** Путать маршрут `0.0.0.0/0` с bind на wildcard-адрес `0.0.0.0`.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

227. Как хост выбирает маршрут для отправки пакета?

   **Ответ:** Учитываются policy rules, адрес назначения, source, mark и другие параметры. В выбранной таблице ищется наиболее специфичный подходящий маршрут; затем определяются next hop и интерфейс. При ECMP возможен выбор одного из нескольких путей.

   **Типичная ошибка:** Описывать Linux route selection только как поиск gateway по первой строке вывода.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

228. Что такое directly connected route?

   **Ответ:** Это маршрут к сети, непосредственно доступной через интерфейс без промежуточного IP gateway. Обычно он создаётся при назначении адреса с префиксом, если конфигурация не подавляет prefix route.

   **Типичная ошибка:** Думать, что connected route гарантирует физическую доступность всех адресов блока.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

229. Что такое static route?

   **Ответ:** Static route задаётся административно, а не вычисляется динамическим routing protocol. Он может быть установлен вручную, через конфигурацию или автоматику и всё равно остаётся статическим по источнику.

   **Типичная ошибка:** Считать маршрут динамическим только потому, что его добавил скрипт.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

230. В чём преимущества static routes?

   **Ответ:** Они просты, предсказуемы и не требуют обмена протокольными объявлениями. Уместны для небольшого числа стабильных путей, default и специальных исключений.

   **Типичная ошибка:** Приписывать static route автоматическое обнаружение всех удалённых отказов.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

231. В чём недостатки static routes?

   **Ответ:** Изменения топологии требуют обновления конфигурации; ошибочные маршруты могут сохраняться после отказа. При росте сети сложнее обеспечивать согласованность, резервирование и отсутствие петель.

   **Типичная ошибка:** Считать наличие резервной строки в таблице достаточным механизмом определения живого пути.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

232. Когда static routing уместен?

   **Ответ:** Для небольших стабильных сетей, stub-сегментов, default routes и явно контролируемых специальных путей. Если нужны быстрое обнаружение отказов и обмен множеством маршрутов, оценивают динамический протокол.

   **Типичная ошибка:** Выбирать static только ради отсутствия routing daemon, игнорируя стоимость ручного failover.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

233. Как static routing работает в маленькой сети?

   **Ответ:** Каждый узел знает directly connected сети и default gateway; маршрутизаторы имеют маршруты к удалённым подсетям и обратные пути. При изменении схемы маршруты обновляет администратор или автоматика.

   **Типичная ошибка:** Настроить только прямой путь и забыть маршрут ответа.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

234. Что произойдёт, если default gateway недоступен?

   **Ответ:** Трафик по этому маршруту перестанет доходить; возможны retries ARP/ND и таймауты. Связь по другим маршрутам, включая локальную подсеть, может сохраниться. Автоматическое переключение требует обнаружения отказа и пригодного альтернативного пути.

   **Типичная ошибка:** Считать, что недоступный gateway автоматически заменяется любым другим адресом в LAN.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

235. Что такое longest prefix match в контексте маршрутизации?

   **Ответ:** Выбирается совпадающий префикс наибольшей длины. `/32` специфичнее `/24`, а `/24` — `/0`. Сначала нужно учитывать выбранную policy routing table и допустимость маршрута.

   **Типичная ошибка:** Сравнивать только metric у маршрутов разной специфичности.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).


### Средний уровень
236. Как host route отличается от network route?

   **Ответ:** Host route покрывает один адрес: IPv4 `/32` или IPv6 `/128`. Network route покрывает блок адресов меньшей длиной префикса. Host route позволяет сделать точечное исключение из общего пути.

   **Типичная ошибка:** Считать host route командой назначения адреса сетевому интерфейсу.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

237. Как роутер принимает решение, куда переслать пакет?

   **Ответ:** Он проверяет пригодность пакета, выбирает маршрут/действие, уменьшает TTL/Hop Limit и передаёт пакет через соответствующий link-layer next hop. Firewall, policy routing и тип маршрута могут привести к отбрасыванию вместо пересылки.

   **Типичная ошибка:** Считать forwarding безусловным после одного совпадения с префиксом.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

238. Что происходит, если маршрута не найдено?

   **Ответ:** Локальный вызов может получить ошибку недостижимости сети; маршрутизатор обычно отбрасывает пакет и может вернуть ICMP unreachable по правилам протокола. Blackhole-политика и rate limiting влияют на наличие ответа.

   **Типичная ошибка:** Считать отсутствие ICMP доказательством того, что маршрут существует.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

239. Что такое blackhole route?

   **Ответ:** Blackhole route намеренно отбрасывает совпавшие пакеты без сетевого сообщения об ошибке отправителю. Его используют для контролируемого discard и предотвращения петель под агрегатами. Локальный API при этом может получить ошибку.

   **Типичная ошибка:** Путать blackhole с отсутствующим маршрутом и ожидать одинаковых errno и ICMP.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

240. Для чего нужен reject route?

   **Ответ:** Reject — общее название маршрута с явной недостижимостью/запретом. В Linux есть типы unreachable и prohibit с разными ICMP и локальными ошибками. Они позволяют быстро и явно отказать вместо молчаливой потери.

   **Типичная ошибка:** Писать Linux-команду `type reject`, не проверив поддерживаемые типы маршрутов.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

241. Что такое administrative distance в общем смысле?

   **Ответ:** Administrative distance — вендорское понятие предпочтения источников маршрутов при выборе между протоколами. Это не длина префикса и не протокольная metric. Конкретные значения и соответствия зависят от платформы.

   **Типичная ошибка:** Переносить таблицу distance одного производителя на Linux metric без проверки.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

242. Почему static route часто имеет высокий приоритет?

   **Ответ:** Во многих системах административно заданному пути дают большее доверие, чем learned route. Но это политика реализации и конфигурации: static route можно сделать резервным. Специфичность префикса всё равно рассматривается отдельно.

   **Типичная ошибка:** Считать любой static route сильнее любого dynamic route независимо от префикса и настроек.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

243. Что такое floating static route?

   **Ответ:** Floating static route — статический резерв, которому назначено меньшее предпочтение, чем основному маршруту. Он становится рабочим после исчезновения основного кандидата. Удалённую доступность может потребоваться отслеживать отдельно.

   **Типичная ошибка:** Ожидать переключения, когда основной next hop остаётся в таблице, но трафик за ним теряется.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

244. Когда используют floating static routes?

   **Ответ:** Для простого backup uplink, резервного туннеля или пути при пропаже динамически изученного маршрута. Нужно проверить критерии отказа и возврата на основной путь.

   **Типичная ошибка:** Не предусмотреть обратный маршрут при переключении.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

245. Что такое recursive route lookup?

   **Ответ:** Это разрешение достижимости next hop с помощью другого маршрута, пока не определены реально пригодные интерфейс и сосед. Поддержка и ограничения зависят от платформы; возможны циклические зависимости.

   **Типичная ошибка:** Создать взаимно зависимые next hops без directly reachable основы.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

246. Что произойдёт при routing loop?

   **Ответ:** Пакет может многократно ходить между узлами до исчерпания TTL/Hop Limit, расходуя ресурсы. Маршруты могут формально существовать на каждом узле, но не вести к получателю.

   **Типичная ошибка:** Считать loop только L2-проблемой и искать исключительно STP.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812); [RFC 8200: IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).

247. Как TTL помогает обнаружить loop?

   **Ответ:** TTL ограничивает число пересылок, а ICMP Time Exceeded позволяет увидеть точки исчерпания. traceroute использует разные TTL и может показать повторяющиеся hops; отсутствие ответов не исключает петлю.

   **Типичная ошибка:** Считать TTL механизмом исправления маршрутов: он только ограничивает жизнь пакета.

   **Источник:** [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

248. Как static route может создать loop?

   **Ответ:** Если A направляет некоторый префикс на B, а B тот же трафик возвращает на A, образуется петля. Частый случай — default в одну сторону и агрегат с «дырой» обратно.

   **Типичная ошибка:** Анонсировать агрегат без discard route для непокрытых более специфичными маршрутами адресов.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

249. Как проверить таблицу маршрутизации на Linux?

   **Ответ:** Используют ip route show и ip -6 route show, а для всех таблиц — table all и ip rule show. ip route get показывает выбор для конкретного назначения и при необходимости source/mark.

   **Пример:**

   ```bash
   ip route show
   ip -6 route show
   ip route show table all
   ip rule show
   ip route get 192.0.2.10
   ```

   **Типичная ошибка:** Судить о фактическом пути по main table при наличии policy rules.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

250. Как добавить static route в Linux?

   **Ответ:** Команда ip route add задаёт префикс, next hop и/или интерфейс. Gateway должен быть достижим согласно правилам системы; конфигурация, сделанная этой командой, обычно не переживает перезагрузку без настройки менеджера сети.

   **Пример:**

   ```bash
   # Только лаборатория Linux: gateway достижим через eth0. Нужны root-права.
   ip route add 192.0.2.0/24 via 10.0.0.1 dev eth0
   ```

   **Типичная ошибка:** Добавлять runtime route и считать его автоматически сохранённым в сетевом профиле.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

251. Как удалить static route?

   **Ответ:** ip route del удаляет маршрут по заданным параметрам и таблице. Перед удалением проверяют точный префикс, gateway и последствия для текущего доступа. Для постоянной конфигурации также меняют профиль менеджера сети.

   **Пример:**

   ```bash
   # Удаление именно лабораторного маршрута из предыдущего примера:
   ip route del 192.0.2.0/24 via 10.0.0.1 dev eth0
   ```

   **Типичная ошибка:** Удалять default через удалённую сессию без альтернативного пути управления.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

252. Что такое policy-based routing?

   **Ответ:** Policy-based routing выбирает таблицу или действие по набору правил, например source address, mark или интерфейсу. В Linux это routing policy database (RPDB); после выбора таблицы используется её маршрутный lookup.

   **Типичная ошибка:** Считать policy routing заменой всех longest-prefix lookup.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

253. Чем policy routing отличается от обычного destination-based routing?

   **Ответ:** Destination routing использует преимущественно адрес назначения. Policy routing добавляет условия выбора таблицы/действия до поиска маршрута — например, для разных source prefixes или tenants.

   **Типичная ошибка:** Ожидать, что разные source addresses обязательно выберут разные пути без соответствующих правил.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

254. Как multiple routing tables используются в Linux?

   **Ответ:** Правила ip rule по приоритету выбирают таблицы; каждая может содержать свой default и специфичные маршруты. Это применяется для multihoming, VRF и управления трафиком. Диагностировать нужно и rules, и таблицы.

   **Типичная ошибка:** Настроить дополнительную таблицу, но не правило, которое к ней обращается.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

255. Как routing влияет на multihomed host?

   **Ответ:** У multihomed хоста маршрут определяет выход и выбор source, а ответы могут уйти другим uplink. Часто нужны source-based policies, согласованные ACL и учёт reverse-path filtering.

   **Типичная ошибка:** Добавить второй default и считать все ответы автоматически симметричными.

   **Источник:** [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html); [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).


### Продвинутый уровень
256. Как kernel выбирает маршрут при вызове `connect()`?

   **Ответ:** Ядро использует destination и параметры socket/context: source bind, mark, bound device и policy rules. Полученный маршрут определяет next hop и source при отсутствии явной привязки. Для UDP connect не устанавливает транспортный handshake.

   **Типичная ошибка:** Считать route lookup исключительно пользовательской задачей getaddrinfo.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

257. Что происходит при `sendto()` на UDP socket с точки зрения route lookup?

   **Ответ:** Для UDP sendto маршрут выбирается к переданному destination с учётом параметров сокета и политики. Успешный возврат означает принятие данных локальным стеком, а не получение peer. Возможны route errors, neighbour resolution и асинхронные ICMP.

   **Типичная ошибка:** Считать успешный sendto подтверждением доступности удалённого UDP-сервиса.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

258. Можно ли в приложении выбрать исходящий интерфейс?

   **Ответ:** В Linux можно bind к source address, использовать SO_BINDTODEVICE либо ancillary data IP_PKTINFO/IPV6_PKTINFO для подходящих сценариев. Эти способы имеют разные контракты и требования к правам и не создают отсутствующий маршрут.

   **Типичная ошибка:** Считать bind к IP полным эквивалентом привязки ко всему интерфейсу.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: ipv6(7)](https://man7.org/linux/man-pages/man7/ipv6.7.html).

259. Что делает `SO_BINDTODEVICE`?

   **Ответ:** SO_BINDTODEVICE связывает сокет с конкретным сетевым устройством в Linux. Это влияет на передачу и приём согласно socket type и routing policy; опция не является переносимым POSIX API и может требовать capabilities.

   **Типичная ошибка:** Использовать её без проверки ошибки setsockopt и ожидать одинакового поведения на всех ОС.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

260. Как определить через какой интерфейс уйдёт пакет?

   **Ответ:** ip route get с destination и при необходимости source/mark показывает выбранный интерфейс и source. Для реального потока сверяют socket options, namespace и tcpdump: конфигурация могла измениться после lookup.

   **Пример:**

   ```bash
   ip route get 192.0.2.10 from 10.0.0.2
   # Source должен соответствовать конфигурации тестового узла.
   ```

   **Типичная ошибка:** Проверять маршрут из другого network namespace, чем у приложения.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html).

261. Как программно получить routing information в Linux?

   **Ответ:** Через NETLINK_ROUTE отправляют RTM_GETROUTE и разбирают ответы; библиотеки упрощают alignment, attributes и multipart messages. Для полной диагностики нужны также правила и состояние интерфейсов.

   **Типичная ошибка:** Парсить человекочитаемый вывод ip как стабильный бинарный API.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

262. Что такое netlink sockets?

   **Ответ:** Netlink — семейство socket-интерфейсов Linux для обмена структурированными сообщениями с подсистемами ядра. NETLINK_ROUTE обслуживает адреса, ссылки, routes и neighbours. Поддерживаются запросы и уведомления, но нужно учитывать возможную потерю сообщений.

   **Типичная ошибка:** Предполагать, что любой netlink-сокет автоматически подписан на все сетевые события.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

263. Как взаимодействовать с routing subsystem через netlink?

   **Ответ:** Создают AF_NETLINK/NETLINK_ROUTE socket, формируют nlmsghdr и payload запроса, проверяют sequence, sender, NLMSG_ERROR и завершение multipart dump. Атрибуты обходят с контролем длины и выравнивания.

   **Типичная ошибка:** Считать один recv полным снимком всех маршрутов.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

264. Почему `ioctl` подходы устарели для ряда сетевых задач?

   **Ответ:** Старые ioctl часто ограничены отдельными структурами и не выражают современные атрибуты, IPv6 и большие наборы объектов. Netlink даёт расширяемые сообщения и уведомления. При этом не каждый ioctl устарел для любой задачи.

   **Типичная ошибка:** Заменять корректный простой ioctl только из-за самого имени API без анализа требований.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

265. Что такое reverse path filtering?

   **Ответ:** Reverse path filtering проверяет source входящего пакета по обратной маршрутизации. В Linux IPv4 rp_filter имеет strict и loose режимы; строгая проверка ожидает подходящий обратный путь через входной интерфейс.

   **Типичная ошибка:** Путать rp_filter с проверкой установленного TCP-соединения firewall.

   **Источник:** [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

266. Как rp_filter влияет на нестандартную маршрутизацию?

   **Ответ:** Strict rp_filter может отбрасывать легитимные пакеты при асимметрии, multihoming и policy routing. Настройки выбирают по топологии и требованиям anti-spoofing; учитывают effective значения all/interface и marks.

   **Типичная ошибка:** Отключать anti-spoofing глобально вместо настройки подходящего режима и правил.

   **Источник:** [Linux kernel: IP sysctl](https://docs.kernel.org/networking/ip-sysctl.html).

267. Как asymmetric routing влияет на отладку?

   **Ответ:** Запрос и ответ проходят через разные точки наблюдения и stateful устройства. Один capture не показывает полный обмен; нужны двусторонние дампы, route lookup с правильным source и данные firewall/conntrack.

   **Типичная ошибка:** Объявлять ответ потерянным только потому, что его нет на интерфейсе отправки запроса.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

268. Почему tcpdump на одном интерфейсе может не показывать ожидаемый трафик?

   **Ответ:** Пакет мог уйти другим интерфейсом, находиться в другом namespace, не пройти routing/firewall или обрабатываться в offload-пути. Фильтр также может быть неверным; положение capture относительно hooks важно.

   **Типичная ошибка:** Считать отсутствие пакета в одном capture доказательством, что приложение ничего не отправляло.

   **Источник:** [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

269. Как route cache влиял на старые версии Linux?

   **Ответ:** В старых Linux существовал глобальный IPv4 route cache, который влиял на повторные lookup и диагностику. Начиная с Linux 3.6 он удалён; отдельные socket/dst caches и связанные механизмы не равны тому старому cache.

   **Типичная ошибка:** Советовать очистку старого глобального route cache как универсальное решение для современного Linux.

   **Источник:** [Linux man-pages: route(8), NOTES](https://man7.org/linux/man-pages/man8/route.8.html).

270. Какие race conditions возможны при изменении маршрутов во время работы приложения?

   **Ответ:** Маршрут может измениться между предварительным lookup и отправкой; может смениться source, MTU или next hop. Уведомления и локальные снимки не дают вечной гарантии. Приложению нужны deadlines, обработка ошибок и корректный reconnect.

   **Типичная ошибка:** Проверить маршрут при старте и больше не обрабатывать сетевые ошибки.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).


### Инженерные вопросы
271. Когда static routing лучше динамического?

   **Ответ:** Когда путей мало, топология стабильна и failover прост или управляется внешней автоматикой. Динамика выгоднее при большом числе зависимостей и частых изменениях. Выбор учитывает стоимость сопровождения и обнаружения отказов.

   **Типичная ошибка:** Считать static всегда надёжнее только потому, что отсутствует routing daemon.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

272. Какие риски есть у ручного управления маршрутами?

   **Ответ:** Ошибки префиксов и next hops, несогласованный обратный путь, забытые runtime изменения, петли и потеря доступа. Помогают версионирование конфигурации, проверки адресного плана и отработка rollback.

   **Типичная ошибка:** Вносить независимые изменения на нескольких узлах без проверки сквозного пути.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 1812: Requirements for IPv4 Routers](https://www.rfc-editor.org/rfc/rfc1812).

273. Как резервировать uplink с помощью static routes?

   **Ответ:** Задают основной и резервный путь с явным предпочтением и механизмом проверки пригодности. Отказ физического линка и недоступность сервиса за gateway — разные события; для второго нужен tracking или другой control plane.

   **Типичная ошибка:** Надеяться, что высокая metric резервного default сама обнаружит black hole за основным gateway.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

274. Как спроектировать failover между двумя gateway?

   **Ответ:** Определяют health criterion, меняют маршруты/политику при отказе, обеспечивают обратный путь и hysteresis против flapping. Отдельно проверяют source address, NAT state и established connections при смене uplink.

   **Типичная ошибка:** Считать переход на другой public source прозрачным для обычного установленного TCP-соединения.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

275. Почему неправильный default route может "сломать всё"?

   **Ответ:** Default обслуживает все назначения без более специфичного совпадения, поэтому ошибка затрагивает множество внешних сервисов сразу. Локальная сеть и специфичные маршруты могут продолжать работать, скрывая проблему.

   **Типичная ошибка:** При частичной связности сначала переустанавливать DNS, не проверив default и route get.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).


---

## 6. Routing: Dynamic Routing (OSPF, BGP — обзор)

### Базовый уровень
276. Что такое dynamic routing?

   **Ответ:** Dynamic routing — получение и пересчёт маршрутов через протокольный обмен между маршрутизаторами. Изменения доступности и топологии могут автоматически менять выбранные пути в пределах настроенной политики.

   **Типичная ошибка:** Считать динамическую маршрутизацию отсутствием необходимости в конфигурации и фильтрах.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

277. Чем dynamic routing отличается от static routing?

   **Ответ:** Static routes задаются административно, dynamic routes изучаются и пересчитываются протоколом. Динамика адаптируется к изменениям, но добавляет control plane, таймеры и риск распространения ошибочных объявлений.

   **Типичная ошибка:** Считать маршрут динамическим только потому, что у него есть время установки.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

278. Какие задачи решают dynamic routing protocols?

   **Ответ:** Они распространяют reachability, выбирают пути и реагируют на изменения. Конкретные критерии различаются: OSPF использует топологию и cost, BGP — атрибуты и политику.

   **Типичная ошибка:** Ожидать, что все протоколы выбирают минимальную физическую задержку.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

279. Что такое OSPF?

   **Ответ:** OSPF — link-state IGP. Маршрутизаторы обмениваются сведениями о состоянии связей, формируют LSDB по областям и вычисляют кратчайшие пути по cost. OSPFv2 в основном обслуживает IPv4.

   **Типичная ошибка:** Считать OSPF протоколом транспортной передачи пользовательских данных.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

280. Что такое BGP?

   **Ответ:** BGP — протокол обмена маршрутами, прежде всего между автономными системами, а также внутри них. Он объявляет префиксы с атрибутами и выбирает пути по политике; BGP sessions работают поверх TCP.

   **Типичная ошибка:** Считать BGP таблицей всех маршрутизаторов интернета, содержащей полную физическую топологию.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

281. В чём фундаментальная разница между OSPF и BGP?

   **Ответ:** OSPF строит link-state представление области и вычисляет пути по cost. BGP распространяет префиксы с path attributes и допускает административную политику, а не глобальную оптимизацию кратчайшего пути.

   **Типичная ошибка:** Считать AS_PATH точной последовательностью физических hops.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

282. Где обычно используется OSPF?

   **Ответ:** Внутри автономной системы: корпоративные и операторские сети, где нужен IGP с топологией и автоматическим пересчётом. Области помогают ограничить масштаб flooding и вычислений.

   **Типичная ошибка:** Использовать OSPF как обычный глобальный межоператорский протокол интернета.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

283. Где обычно используется BGP?

   **Ответ:** Между операторами, на peering/transit границах и внутри крупных сетей, включая датацентровые фабрики. Сценарий и policy определяют, будет ли использован eBGP или iBGP.

   **Типичная ошибка:** Считать BGP пригодным только для подключения к интернету.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7938: Use of BGP for Routing in Large-Scale Data Centers](https://www.rfc-editor.org/rfc/rfc7938).

284. Что такое IGP?

   **Ответ:** IGP — Interior Gateway Protocol, протокол маршрутизации внутри автономной системы. Примеры — OSPF и IS-IS. Само слово interior относится к административной области, а не к private addressing.

   **Типичная ошибка:** Считать, что IGP не может распространять public префиксы.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

285. Что такое EGP?

   **Ответ:** EGP — класс протоколов обмена маршрутизацией между автономными системами; на практике эту роль выполняет BGP. Не следует путать класс с историческим протоколом, также называвшимся EGP.

   **Типичная ошибка:** Называть любой маршрут к внешнему адресу EGP-маршрутом.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

286. Почему крупные сети не могут жить только на static routes?

   **Ответ:** Масштаб и изменения делают ручное согласование путей и обратных маршрутов дорогим и ошибкоопасным. Динамические протоколы автоматизируют обмен reachability и восстановление после отказов; отдельные static routes всё равно могут оставаться.

   **Типичная ошибка:** Пытаться масштабировать полный набор static routes без системы учёта и проверки изменений.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

287. Что такое convergence?

   **Ответ:** Convergence — переход control/data plane к согласованным пригодным маршрутам после изменения. Она включает обнаружение события, распространение, выбор пути и установку в forwarding; промежуточно возможны потери и петли.

   **Типичная ошибка:** Измерять convergence только временем сходимости routing daemon, исключив FIB и реальный трафик.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

288. Почему скорость convergence важна?

   **Ответ:** До завершения сходимости трафик может теряться, идти обходным путём или петлять. Чем строже требования сервиса, тем важнее оценивать полный interruption time. Слишком агрессивные таймеры могут повышать нагрузку и нестабильность.

   **Типичная ошибка:** Уменьшать все таймеры без проверки устойчивости и нагрузки CPU.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

289. Что такое routing advertisement?

   **Ответ:** Это протокольное объявление сведений о маршруте или топологии. В BGP UPDATE объявляет/отзывает reachability с атрибутами; OSPF распространяет LSA, а не просто список конечных лучших путей.

   **Типичная ошибка:** Считать OSPF LSA и BGP UPDATE идентичными по содержанию и области распространения.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

290. Что такое route metric?

   **Ответ:** Metric — численная оценка пути внутри конкретного механизма выбора. Например, OSPF складывает link costs; BGP использует набор атрибутов и policy, которые нельзя свести к одной общей metric.

   **Типичная ошибка:** Сравнивать числа metric разных протоколов как одну универсальную шкалу.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).


### Средний уровень
291. Как OSPF строит карту сети?

   **Ответ:** OSPF формирует соседства, синхронизирует LSDB и flooding распространяет LSA в допустимой области. По полученной топологии вычисляет SPF tree. Межобластные сведения представлены иначе, чем полная внутреобластная топология.

   **Типичная ошибка:** Ожидать, что каждый маршрутизатор хранит полную детальную карту всех областей.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

292. Что такое link-state routing?

   **Ответ:** Link-state routing распространяет состояние связей и строит топологическое представление, по которому каждый узел вычисляет пути. Это отличается от передачи только расстояний до назначений.

   **Типичная ошибка:** Считать, что каждый пользовательский пакет запускает новый flooding состояния связей.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

293. Что такое LSDB?

   **Ответ:** LSDB — link-state database, набор актуальных LSA в соответствующей области OSPF. У стабильно работающих маршрутизаторов одной области базы должны быть согласованы. Это не то же самое, что готовая FIB.

   **Типичная ошибка:** Считать совпадение LSDB доказательством отсутствия всех проблем forwarding.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

294. Что такое SPF algorithm?

   **Ответ:** SPF в OSPF использует алгоритм Дейкстры для поиска кратчайших путей по сумме cost в топологии. Полученный результат дополняется правилами выбора разных типов маршрутов и устанавливается в routing subsystem.

   **Типичная ошибка:** Подставлять RTT вместо настроенного OSPF cost и ожидать совпадения пути.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

295. Что такое area в OSPF?

   **Ответ:** Area — логическая область OSPF со своей LSDB и областью распространения части LSA. Area border routers связывают области; inter-area routing использует backbone.

   **Типичная ошибка:** Считать area изолированным VRF или самостоятельной границей безопасности.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

296. Зачем OSPF делит сеть на areas?

   **Ответ:** Areas ограничивают объём топологических сведений и flooding, уменьшают масштаб SPF и позволяют summarization. Дизайн должен учитывать backbone и типы областей; произвольное дробление тоже усложняет эксплуатацию.

   **Типичная ошибка:** Создавать много областей без необходимости и без согласованной схемы backbone.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

297. Что такое backbone area?

   **Ответ:** Backbone — area 0, через которую организуется межобластная маршрутизация OSPF. Остальные области должны иметь корректную связь с backbone; специальные virtual links не заменяют продуманный физический дизайн.

   **Типичная ошибка:** Соединять области как произвольную цепочку и ожидать нормальный inter-area обмен без backbone.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

298. Что такое hello packets в OSPF?

   **Ответ:** Hello обнаруживают и поддерживают OSPF neighbours, передают параметры и участвуют в выборе DR/BDR на подходящих сетях. Несовместимые параметры могут препятствовать соседству.

   **Типичная ошибка:** Считать получение одного Hello доказательством полной синхронизации LSDB.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

299. Как OSPF определяет соседей?

   **Ответ:** По Hello на интерфейсах проверяются идентификаторы и совместимость параметров; далее neighbour state machine устанавливает необходимые adjacency и синхронизирует базы. Не каждый сосед обязан стать Full в multiaccess-сети.

   **Типичная ошибка:** Считать 2-Way между двумя DROther обязательной неисправностью.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

300. Что такое DR и BDR?

   **Ответ:** Designated Router и Backup Designated Router уменьшают число adjacency и организуют обмен на broadcast/NBMA multiaccess-сетях. Это роли control plane, а не обязательный путь всего пользовательского трафика.

   **Типичная ошибка:** Ожидать, что все IP-пакеты LAN должны проходить через DR.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

301. Что такое BGP peer?

   **Ответ:** BGP peer — участник BGP-сессии, с которым обмениваются OPEN, UPDATE и другими сообщениями. Установленный TCP и состояние Established необходимы, но ещё не означают получение допустимых маршрутов.

   **Типичная ошибка:** Приравнивать Established к наличию рабочего маршрута и исправной import/export policy.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

302. Что такое AS?

   **Ответ:** AS — автономная система: сеть или набор сетей под согласованным административным управлением и внешней политикой маршрутизации. Это не обязательно одна площадка или один провайдер.

   **Типичная ошибка:** Считать номер VLAN или private subnet идентификатором AS.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

303. Что такое ASN?

   **Ответ:** ASN — номер автономной системы, используемый в BGP и AS_PATH. Существуют глобально назначаемые и private ASN; выбор определяется контекстом и правилами регистрации/экспорта.

   **Типичная ошибка:** Анонсировать private ASN во внешнюю политику без согласования с upstream.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

304. Что такое eBGP и iBGP?

   **Ответ:** eBGP связывает peers разных AS; iBGP — одной AS. Различаются правила распространения и обработки атрибутов; iBGP требует full mesh либо механизмы масштабирования вроде route reflection.

   **Типичная ошибка:** Ожидать, что iBGP автоматически раздаст маршрут всем остальным iBGP peers без соответствующей топологии.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

305. Что такое AS_PATH?

   **Ответ:** AS_PATH — атрибут BGP с последовательностью/сегментами AS, через которые прошло объявление. Используется для обнаружения AS-петель и выбора пути; не описывает все router hops и не является криптографическим доказательством пути.

   **Типичная ошибка:** Определять физическую задержку только по длине AS_PATH.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

306. Почему BGP считается policy-based протоколом?

   **Ответ:** Import/export policies и атрибуты позволяют предпочитать пути по экономике, управлению трафиком и отношениям peers. Кратчайший AS_PATH не обязательно победит при другой local preference или политике.

   **Типичная ошибка:** Считать BGP глобальным алгоритмом поиска пути с минимальной latency.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

307. Что такое route advertisement в BGP?

   **Ответ:** BGP UPDATE связывает NLRI — например, префикс — с path attributes и может отзывать reachability. Получатель применяет политику и проверяет next-hop reachability; объявление не равно гарантии доставки.

   **Типичная ошибка:** Принимать любой полученный префикс без фильтров происхождения и допустимого размера.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

308. Что такое prefix filtering?

   **Ответ:** Prefix filtering разрешает только ожидаемые префиксы и допустимые длины при приёме/экспорте. Это помогает предотвращать ошибочные анонсы и утечки. Prefix filters дополняют, а не заменяют прочие проверки policy и происхождения.

   **Типичная ошибка:** Разрешить весь интернет-пространство от клиента, которому выделен один блок.

   **Источник:** [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

309. Что такое route aggregation в BGP?

   **Ответ:** Агрегация BGP публикует менее специфичный префикс вместо множества деталей. Нужно обеспечить реальную reachability и discard для дыр, а также учесть, какие attributes и политики сохраняются.

   **Типичная ошибка:** Анонсировать крупный агрегат без права/возможности обслуживать покрываемые сети.

   **Источник:** [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

310. Что такое MED, local preference и communities на концептуальном уровне?

   **Ответ:** Local preference задаёт предпочтение выхода внутри AS: выше обычно лучше. MED предлагает соседней AS предпочтительный вход при сопоставимых условиях, ниже обычно лучше. Communities — метки для policy; их эффект определяется договорённой обработкой.

   **Типичная ошибка:** Ожидать, что MED или произвольная community обязательно будут приняты и одинаково обработаны любым оператором.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).


### Продвинутый уровень
311. Почему OSPF чувствителен к топологии и LSA flooding?

   **Ответ:** Изменения вызывают LSA generation/flooding, обновление LSDB и SPF. Большое число изменений, неудачные области и ресурсы устройств влияют на стабильность и сходимость.

   **Типичная ошибка:** Устранять LSA storm только увеличением bandwidth линков, не проверив источник изменений.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328).

312. Почему BGP convergence может быть медленной?

   **Ответ:** Влияют detection timers, TCP/session recovery, распространение withdrawals, path exploration, policy и установка FIB. Разные peers могут менять выбор неодновременно. Конкретную задержку нужно измерять, а не назначать одну константу для BGP.

   **Типичная ошибка:** Считать время Hold Timer единственной составляющей convergence.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

313. Что такое route flap?

   **Ответ:** Route flap — повторяющееся изменение доступности или выбора маршрута/атрибутов. Оно создаёт updates, пересчёты и возможные потери трафика; причину ищут в линках, sessions, policy и достижимости next hop.

   **Типичная ошибка:** Лечить flapping только подавлением объявлений, не исследуя причину.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7196: Making Route Flap Damping Usable](https://www.rfc-editor.org/rfc/rfc7196).

314. Почему route damping спорен?

   **Ответ:** Damping снижает распространение нестабильных маршрутов, но может подавлять уже восстановившийся пригодный путь и увеличивать недоступность. Важно выбирать параметры и область применения по рекомендациям и наблюдаемым условиям.

   **Типичная ошибка:** Включать агрессивные старые параметры damping для всех префиксов без оценки последствий.

   **Источник:** [RFC 7196: Making Route Flap Damping Usable](https://www.rfc-editor.org/rfc/rfc7196).

315. Что такое BGP hijack?

   **Ответ:** BGP hijack — несанкционированное объявление чужого префикса или пути, способное перетянуть трафик. Более специфичный анонс особенно опасен из-за LPM. Защита включает фильтры, проверку происхождения и мониторинг; не каждый ошибочный анонс умышленный.

   **Типичная ошибка:** Считать валидный TCP peer доказательством прав на все объявленные им префиксы.

   **Источник:** [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

316. Как происходит утечка маршрутов в BGP?

   **Ответ:** Route leak — распространение маршрута за пределы ожидаемой политики, например между upstreams через клиента. Origin может быть правильным, но экспорт нарушает отношения и вызывает нежелательный транзит.

   **Типичная ошибка:** Считать проверку только origin AS полной защитой от всех route leaks.

   **Источник:** [RFC 7908: Problem Definition and Classification of BGP Route Leaks](https://www.rfc-editor.org/rfc/rfc7908); [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

317. Почему фильтрация маршрутов критически важна?

   **Ответ:** Ошибки одного peer могут распространиться на большую сеть и привлечь либо потерять трафик. Import/export filters, prefix limits и согласованная policy ограничивают последствия.

   **Типичная ошибка:** Проверять только входящую политику и оставлять экспорт без ограничений.

   **Источник:** [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454).

318. Что такое ECMP?

   **Ответ:** ECMP позволяет использовать несколько путей с равной допустимой стоимостью. Обычно поток закрепляют хешем по набору полей, чтобы уменьшить reordering; распределение не обязано быть равным по байтам.

   **Типичная ошибка:** Ожидать, что один TCP-поток равномерно использует суммарную полосу всех ECMP next hops.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 7938: Use of BGP for Routing in Large-Scale Data Centers](https://www.rfc-editor.org/rfc/rfc7938).

319. Как dynamic routing взаимодействует с FIB и RIB?

   **Ответ:** Routing protocols дают кандидаты в RIB; после policy и выбора лучшие маршруты программируются в FIB. RIB может содержать альтернативы, не используемые в forwarding. Сбой установки FIB создаёт расхождение между control и data plane.

   **Типичная ошибка:** Проверять только BGP RIB и не смотреть фактическую FIB/forwarding.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [FRRouting: Zebra](https://docs.frrouting.org/en/latest/zebra.html).

320. Чем control plane отличается от data plane в маршрутизации?

   **Ответ:** Control plane обменивается reachability и вычисляет пути; data plane пересылает реальные пакеты по установленным правилам/FIB. Control plane может быть исправен, а forwarding нарушен из-за ACL, offload или установки маршрутов.

   **Типичная ошибка:** Считать успешную routing session доказательством успешного пользовательского трафика.

   **Источник:** [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [FRRouting: Zebra](https://docs.frrouting.org/en/latest/zebra.html).

321. Как routing daemon взаимодействует с kernel routing table?

   **Ответ:** В Linux daemon обычно использует netlink для установки/удаления kernel routes и получения событий. FRRouting разделяет протокольные daemons и Zebra, которая взаимодействует с системой. Kernel и protocol views нужно сверять.

   **Пример:**

   ```bash
   # Linux: системное представление маршрутов; routing RIB смотрят отдельно в daemon.
   ip -details route show
   ip -6 -details route show
   ```

   **Типичная ошибка:** Считать, что BGP UPDATE напрямую обрабатывается ядром как команда изменения маршрута.

   **Источник:** [FRRouting: Zebra](https://docs.frrouting.org/en/latest/zebra.html); [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

322. Что такое FRRouting / Bird / Quagga в общем смысле?

   **Ответ:** Это программные routing suites/daemons, реализующие протоколы и взаимодействие с системной маршрутизацией. Конкретные возможности и статус проектов различаются; для выбора следует проверять документацию используемой версии.

   **Типичная ошибка:** Считать routing daemon обязательным участником пересылки каждого пакета в user space.

   **Источник:** [FRRouting: Zebra](https://docs.frrouting.org/en/latest/zebra.html); [BIRD User’s Guide](https://bird.network.cz/doc/bird.html).

323. Как приложение чувствует изменение маршрута в системе?

   **Ответ:** Оно может получать route notifications, но чаще замечает изменение через latency, потери, ошибки или другой исходный путь новых соединений. Уведомления не гарантируют работоспособность сервиса. Приложению нужны собственные deadlines и recovery.

   **Типичная ошибка:** После route event немедленно объявлять все соединения потерянными без проверки их состояния.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html); [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293).

324. Как динамическая маршрутизация влияет на долгоживущие TCP-соединения?

   **Ответ:** Если endpoints остаются прежними и есть рабочий новый путь, TCP может пережить смену маршрута, повторив потери. Изменения RTT/MTU и reordering влияют на скорость. При изменении адреса или потере NAT state обычное соединение часто не сохраняется.

   **Типичная ошибка:** Считать любое route change обязательным TCP reset.

   **Источник:** [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293).

325. Что происходит с established connection при route change?

   **Ответ:** Существующий socket не закрывается только от факта изменения маршрута. Дальнейшие пакеты могут идти новым путём после соответствующих обновлений стека; сохранность зависит от reachability, endpoints и промежуточного состояния.

   **Типичная ошибка:** Обещать прозрачный failover между разными public IP для обычного TCP.

   **Источник:** [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

326. Как быстрое изменение маршрутов может влиять на latency и packet reordering?

   **Ответ:** Разные пути имеют разные задержки и очереди; пакеты, отправленные раньше старым путём, могут прийти после новых. При пересчётах возможны временные потери и microloops, влияющие на tail latency.

   **Типичная ошибка:** Оценивать влияние route change только средним RTT за минуту.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293).

327. Почему packet reordering может снижать TCP performance?

   **Ответ:** Получатель видит пропуски последовательности, отправляет duplicate ACK/SACK; отправитель может принять reordering за потерю и сделать лишнюю retransmission или уменьшить congestion window. Эффект зависит от TCP-алгоритмов и глубины reordering.

   **Типичная ошибка:** Считать всякую retransmission в capture доказательством физической потери пакета.

   **Источник:** [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293).

328. Как отлаживать проблему, вызванную route asymmetry?

   **Ответ:** Проверяют forward и reverse route, source-based policy, rp_filter, stateful firewalls и NAT. Снимают синхронизированные captures с обеих сторон и связывают tuples/время. Асимметрия сама по себе допустима, если устройства её поддерживают.

   **Типичная ошибка:** Исправлять любую асимметрию, не выяснив, какое устройство действительно требует симметрии.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

329. Какие метрики наблюдаемости нужны для анализа routing problems?

   **Ответ:** Нужны состояния sessions/neighbours, число route updates/withdrawals, время convergence и FIB installation, изменения next hop, потери/RTT/reordering и загрузка control plane. События связывают общими timestamps.

   **Пример:**

   ```bash
   ip -s link show
   ip monitor route  # Linux: изменения маршрутов до Ctrl-C.
   ```

   **Типичная ошибка:** Смотреть только число установленных маршрутов и игнорировать churn и forwarding loss.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [FRRouting: Zebra](https://docs.frrouting.org/en/latest/zebra.html).

330. Чем OSPF и BGP отличаются с точки зрения операционного сопровождения?

   **Ответ:** В OSPF обычно диагностируют adjacency, LSDB, areas, cost и flooding. В BGP — sessions, import/export, attributes, reachability next hop и соответствие объявлений policy. Оба требуют сверки RIB/FIB и data plane.

   **Типичная ошибка:** Использовать успешный ping соседу как единственную проверку routing protocol.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).


### Инженерные вопросы
331. Когда нужен OSPF, а когда BGP?

   **Ответ:** OSPF подходит для внутреннего topology-based IGP; BGP — для меж-AS policy и масштабируемых управляемых доменов, включая DC. Они могут использоваться совместно: IGP обеспечивает reachability, BGP распространяет сервисные/внешние префиксы.

   **Типичная ошибка:** Выбирать протокол только по числу маршрутизаторов без требований к policy и топологии.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271); [RFC 7938: Use of BGP for Routing in Large-Scale Data Centers](https://www.rfc-editor.org/rfc/rfc7938).

332. Почему BGP часто используется и внутри крупных датацентров?

   **Ответ:** BGP даёт явную policy, масштабирование через AS/peering структуру и удобную модель leaf-spine ECMP. В DC часто используют eBGP с предсказуемой топологией. Это требует согласованного адресного плана и шаблонов конфигурации.

   **Типичная ошибка:** Переносить интернет-политику BGP в DC без адаптации к архитектуре фабрики.

   **Источник:** [RFC 7938: Use of BGP for Routing in Large-Scale Data Centers](https://www.rfc-editor.org/rfc/rfc7938).

333. Какие риски даёт неправильная BGP политика?

   **Ответ:** Возможны утечка чужих маршрутов, привлечение нежелательного транзита, black holes, loops и overload таблиц/control plane. Нужны явные import/export filters, ограничения и проверки изменений.

   **Типичная ошибка:** Считать BGP peer доверенным только потому, что он внутри организации.

   **Источник:** [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454); [RFC 7908: Problem Definition and Classification of BGP Route Leaks](https://www.rfc-editor.org/rfc/rfc7908).

334. Почему динамическая маршрутизация повышает отказоустойчивость?

   **Ответ:** Она может обнаружить отказ и выбрать/распространить альтернативу без ручного изменения каждого узла. Но устойчивость зависит от резервной топологии, detection, policy и FIB, а ошибочная конфигурация тоже распространяется автоматически.

   **Типичная ошибка:** Добавить routing protocol без физического резервного пути и ожидать защиты от обрыва единственного линка.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).

335. Какие trade-offs между простотой static routing и гибкостью dynamic routing?

   **Ответ:** Static проще при малом числе стабильных путей; dynamic лучше адаптируется, но добавляет протокольное состояние, ресурсы и требования к сопровождению. Сравнивают failure model, масштаб и recovery time; часто используют сочетание.

   **Типичная ошибка:** Считать выбранный подход универсально лучшим для любых частей сети.

   **Источник:** [RFC 2328: OSPF Version 2](https://www.rfc-editor.org/rfc/rfc2328); [RFC 4271: BGP-4](https://www.rfc-editor.org/rfc/rfc4271).


---

## 7. ARP

### Базовый уровень
336. Что такое ARP?

   **Ответ:** ARP сопоставляет IPv4-адрес соседа с link-layer адресом в локальном сегменте, чаще всего Ethernet MAC. Для обмена используется отдельный Ethernet protocol type, а не IP-пакет.

   **Типичная ошибка:** Искать ARP внутри TCP или IPv4-заголовка.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

337. Для чего нужен ARP?

   **Ответ:** После выбора on-link next hop нужен его MAC для Ethernet-кадра. ARP получает это соответствие при отсутствии пригодной записи. Для удалённой сети разрешается адрес gateway, а не конечного удалённого узла.

   **Типичная ошибка:** Рассылать ARP через маршрутизаторы до каждого внешнего сервера.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

338. Между какими уровнями OSI находится ARP по смыслу?

   **Ответ:** По смыслу ARP связывает L3 IPv4 и L2 Ethernet-адресацию. Однозначная классификация по OSI условна: на Ethernet ARP передаётся напрямую в кадре с EtherType 0x0806.

   **Типичная ошибка:** Называть ARP транспортным протоколом только потому, что он использует request/reply.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

339. Почему IP недостаточно для доставки пакета в локальной сети?

   **Ответ:** Ethernet-коммутатор пересылает по MAC, а не по IP. Отправителю нужен MAC следующего локального получателя; IP destination определяет конечного адресата и маршрут, но не заменяет Ethernet destination.

   **Типичная ошибка:** Ставить MAC удалённого сервера в кадр, который должен уйти локальному gateway.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

340. Что такое ARP request?

   **Ответ:** ARP request спрашивает, кто имеет заданный protocol address. В типичном Ethernet/IPv4 случае кадр отправляется на broadcast MAC, а payload содержит адреса отправителя и искомый IPv4.

   **Типичная ошибка:** Считать ARP request IP broadcast-пакетом на 255.255.255.255.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

341. Что такое ARP reply?

   **Ответ:** ARP reply сообщает соответствие protocol address и hardware address. Обычный ответ направляется requester unicast; специальные объявления и процедуры имеют другое поведение.

   **Типичная ошибка:** Предполагать, что всякий ARP reply обязательно является ожидаемым ответом на локальный запрос.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227).

342. Что такое ARP cache?

   **Ответ:** ARP cache хранит известные соответствия IPv4 соседей и MAC с состоянием/таймерами. В Linux он входит в общую neighbour subsystem и привязан к интерфейсам.

   **Типичная ошибка:** Хранить один MAC на IP без учёта интерфейса, VLAN или network namespace.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

343. Зачем нужен ARP cache?

   **Ответ:** Кэш сокращает число broadcast-запросов и задержку повторной отправки. Записи проверяются и обновляются, поскольку адрес соседа или его MAC может измениться.

   **Типичная ошибка:** Считать однажды изученное соответствие неизменным на всё время работы узла.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

344. Когда хост отправляет ARP request?

   **Ответ:** Когда выбран next hop, но для него нет пригодного link-layer mapping либо требуется проверка доступности. Локальная neighbour state machine решает, когда и какие probes нужны; запрос не обязателен перед каждым пакетом.

   **Типичная ошибка:** Ожидать ARP для каждого send и считать его отсутствие в capture ошибкой.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

345. Что происходит, если MAC адрес шлюза неизвестен?

   **Ответ:** Ядро начинает разрешение IPv4 gateway через ARP на выходном интерфейсе. Часть пакетов может ожидать в ограниченной очереди; при неудаче передача не состоится и возможна ошибка верхнему уровню.

   **Типичная ошибка:** Менять DNS, когда не разрешается MAC default gateway.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

346. Что такое gratuitous ARP?

   **Ответ:** Gratuitous ARP — распространённое название незапрошенного объявления собственного IPv4/MAC. В частности, ARP Announcement по RFC 5227 использует ARP request с одинаковыми sender/target IP. Встречаются также unsolicited replies.

   **Типичная ошибка:** Считать любой пакет gratuitous ARP атакой или обычным запросом адреса удалённого узла.

   **Источник:** [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227).

347. Зачем используется gratuitous ARP?

   **Ответ:** Для объявления нового/перенесённого адреса, обновления caches соседей и обнаружения конфликтов. Особенно полезен при failover floating IP. Получатели и сетевые защитные политики могут по-разному реагировать на объявления.

   **Типичная ошибка:** Считать отправку одного объявления гарантированным обновлением всех соседских caches.

   **Источник:** [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227).

348. Что такое ARP spoofing?

   **Ответ:** ARP spoofing — отправка ложных соответствий IP↔MAC, чтобы перенаправить или нарушить трафик. Это может поддерживать MITM или DoS внутри L2-сегмента.

   **Типичная ошибка:** Считать TLS-сбой доказательством отсутствия угрозы: перехват маршрута остаётся проблемой даже при защищённом payload.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [Cisco: Dynamic ARP Inspection](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dynamic_arp_inspection.html).

349. Почему ARP уязвим к spoofing?

   **Ответ:** Базовый ARP не содержит криптографической аутентификации заявителя. Узлы обрабатывают сообщения в локальном сегменте по своим правилам, поэтому атакующий может пытаться обновить caches ложными сведениями.

   **Типичная ошибка:** Доверять sender IP/MAC в любом ARP reply как проверенной идентичности.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [Cisco: Dynamic ARP Inspection](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dynamic_arp_inspection.html).

350. В каких сетях ARP используется, а в каких нет?

   **Ответ:** ARP применяется для IPv4 на Ethernet и других поддерживающих его link layers. В IPv6 используется NDP, а на point-to-point каналах Ethernet MAC resolution может вообще не требоваться.

   **Типичная ошибка:** Утверждать, что ARP нужен для любого IP-трафика на любом типе интерфейса.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861).


### Средний уровень
351. Как ARP связан с subnetting?

   **Ответ:** Маска и routing policy определяют, какое назначение считается on-link и кто является next hop. Для Ethernet IPv4 ARP выполняют к этому next hop. Неверный on-link префикс может заставить хост безуспешно искать удалённый узел в локальном L2.

   **Типичная ошибка:** При ошибочной маске проверять только таблицу DNS.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

352. Почему ARP работает только в пределах L2 сегмента?

   **Ответ:** Обычные Ethernet ARP requests распространяются broadcast внутри L2-домена и не маршрутизируются как IP-пакеты. Proxy ARP может ответить от имени другого адреса, но не делает обычный ARP глобальным.

   **Типичная ошибка:** Считать маршрутизатор прозрачным ретранслятором всех Ethernet broadcasts.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

353. Что происходит при отправке пакета в удалённую подсеть?

   **Ответ:** Хост выбирает gateway по маршруту, разрешает его MAC и отправляет ему Ethernet-кадр. IP destination остаётся удалённым адресом; маршрутизатор создаёт следующий L2-кадр на своём выходе.

   **Типичная ошибка:** Заменять IP destination на IP gateway при обычной маршрутизации.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

354. Для какого IP будет выполняться ARP: удалённого хоста или шлюза?

   **Ответ:** Для удалённого назначения, достигаемого через gateway, разрешается IPv4 next-hop gateway. Если маршрут объявляет адрес on-link, ARP может выполняться непосредственно к назначению.

   **Типичная ошибка:** Отвечать «всегда шлюза», не учитывая on-link routes и локальные назначения.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

355. Как хост определяет, нужен ли ARP?

   **Ответ:** Сначала выбирает маршрут и выходной link type, затем проверяет neighbour state выбранного next hop. Для Ethernet IPv4 при недостаточном mapping запускает ARP. Для loopback или некоторых point-to-point интерфейсов он не нужен.

   **Типичная ошибка:** Решать необходимость ARP только по тому, private или public destination.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

356. Что хранится в ARP таблице?

   **Ответ:** IP соседа, интерфейс, MAC при его наличии, состояние доступности и связанные параметры/таймеры. Incomplete/failed записи могут существовать без известного MAC.

   **Типичная ошибка:** Считать запись без lladdr доказательством повреждения таблицы.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

357. Как долго живут записи ARP cache?

   **Ответ:** Нет единого фиксированного TTL для всех ARP-записей. В Linux есть состояния, reachable/probe timers и garbage collection; permanent entries обрабатываются отдельно. Конкретное поведение зависит от настроек и подтверждений доступности.

   **Типичная ошибка:** Запоминать одно число секунд как обязательную норму ARP.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

358. Что происходит при stale ARP записи?

   **Ответ:** STALE означает, что mapping известен, но его доступность давно не подтверждалась. Он может быть использован с последующей проверкой через DELAY/PROBE; STALE не равен FAILED.

   **Типичная ошибка:** Удалять все STALE entries, считая их обязательно неверными.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

359. Как диагностировать ARP проблему?

   **Ответ:** Сверяют маршрут/интерфейс, ip neigh, link/VLAN, затем capture ARP requests и replies. Проверяют конфликт IP, фильтрацию и ответ правильного MAC. При remote destination исследуют соседа gateway.

   **Пример:**

   ```bash
   ip route get 192.0.2.10
   ip neigh show
   tcpdump -eni eth0 -c 20 arp  # Linux; права на захват.
   ```

   **Типичная ошибка:** Начинать с полной очистки caches и терять важное диагностическое состояние.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

360. Что показывает команда `arp -n` или `ip neigh`?

   **Ответ:** Они показывают изученные соседские соответствия; ip neigh дополнительно отражает состояния NUD и поддерживает IPv6. Таблица относится к конкретному namespace; пустой список не обязательно является ошибкой.

   **Пример:**

   ```bash
   ip -4 neigh show
   ip -6 neigh show
   ```

   **Типичная ошибка:** Считать ip neigh исключительно IPv4 ARP-таблицей.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

361. Почему конфликт IP адресов может проявляться через ARP?

   **Ответ:** Два устройства могут объявлять один IPv4 с разными MAC. У соседей mapping меняется, и трафик попеременно идёт разным узлам. Capture и neighbour events помогают связать сбои со сменой MAC.

   **Типичная ошибка:** Объяснять MAC flapping только атакой, не проверив ошибочное дублирование IP.

   **Источник:** [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html).

362. Что такое proxy ARP?

   **Ответ:** Proxy ARP — ответ маршрутизатора своим MAC на запрос о другом IPv4, к которому он может переслать пакет. Отправитель считает адрес локально достижимым, хотя дальше применяется routing.

   **Типичная ошибка:** Считать proxy ARP трансляцией IP-адресов.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

363. Когда proxy ARP используется?

   **Ответ:** Для отдельных сценариев совместимости, расширения достижимости и подключения узлов без изменения их представления о on-link сети. Требуются корректные маршруты и контроль области действия; это не универсальная замена адресному плану.

   **Типичная ошибка:** Включать proxy ARP на всех интерфейсах без понимания, за какие адреса устройство ответит.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

364. Чем ARP отличается от NDP в IPv6?

   **Ответ:** ARP разрешает IPv4↔L2. IPv6 Neighbor Discovery работает через ICMPv6 и дополнительно обслуживает router discovery, prefix/on-link discovery, neighbour reachability и другие процедуры. Для resolution использует multicast, а не IPv4 ARP broadcast.

   **Типичная ошибка:** Называть NDP лишь ARP с длинным адресом и игнорировать его управляющие функции.

   **Источник:** [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861).

365. Почему в IPv6 нет ARP?

   **Ответ:** IPv6 определяет собственный Neighbor Discovery через ICMPv6, включая Neighbor Solicitation/Advertisement. Поэтому ARP EtherType не используется для разрешения IPv6 neighbours.

   **Типичная ошибка:** Блокировать ICMPv6 и ожидать, что разрешение адресов продолжит работать через ARP.

   **Источник:** [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861).


### Продвинутый уровень
366. Как raw socket можно использовать для работы с ARP?

   **Ответ:** В Linux Ethernet-кадры ARP принимают/отправляют через AF_PACKET с ETH_P_ARP, а не обычный AF_INET raw socket. Нужны CAP_NET_RAW, выбор интерфейса и корректная L2-структура. При разборе проверяют длины до доступа к полям.

   **Типичная ошибка:** Пытаться отправить Ethernet ARP как payload IP raw socket.

   **Источник:** [Linux man-pages: packet(7)](https://man7.org/linux/man-pages/man7/packet.7.html).

367. На каком уровне захвата виден ARP в pcap?

   **Ответ:** На Ethernet ARP виден как самостоятельный L2 payload с EtherType 0x0806. В Linux cooked capture внешняя link-layer оболочка другая; формат задаёт pcap datalink type.

   **Типичная ошибка:** Всегда пропускать ровно 14 байт перед ARP, игнорируя VLAN и cooked capture.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

368. Как с помощью libpcap фильтровать ARP пакеты?

   **Ответ:** В libpcap capture filter достаточно `arp`; для конкретных полей используют ARP-specific expressions с учётом формата. При программном разборе дополнительно проверяют captured length и datalink type.

   **Пример:**

   ```bash
   tcpdump -eni eth0 -c 20 arp
   ```

   **Типичная ошибка:** Применять фильтр `ip and arp`, который не выбирает обычные ARP-кадры Ethernet.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

369. Как вручную сформировать ARP request?

   **Ответ:** Для Ethernet/IPv4 заполняют broadcast destination MAC, source MAC, EtherType 0x0806; в ARP — hardware type Ethernet, protocol type IPv4, длины 6/4, opcode request, sender MAC/IP и target IP. Поля кодируют в требуемом byte order, target MAC запроса обычно обнуляют.

   **Типичная ошибка:** Копировать C struct с padding вместо явной wire serialization.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [Linux man-pages: packet(7)](https://man7.org/linux/man-pages/man7/packet.7.html).

370. Какие поля входят в ARP packet?

   **Ответ:** Hardware Type, Protocol Type, Hardware Length, Protocol Length, Operation и четыре адресных поля: sender hardware/protocol, target hardware/protocol. Размер адресов зависит от HLEN/PLEN.

   **Типичная ошибка:** Без проверки HLEN/PLEN читать любые ARP-пакеты как фиксированный Ethernet/IPv4 layout.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

371. Чем Ethernet/IPv4 ARP отличается от ARP для других link layers?

   **Ответ:** У Ethernet/IPv4 HTYPE=1, PTYPE=0x0800, HLEN=6, PLEN=4. Другие среды/протоколы могут иметь другие типы и длины; базовая схема ARP параметризована.

   **Типичная ошибка:** Считать шестибайтный MAC обязательным для любого hardware type ARP.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826).

372. Как ядро Linux обрабатывает ARP?

   **Ответ:** Ядро принимает ARP через соответствующий link-layer handler, проверяет поля и политику, обновляет/использует neighbour state и при необходимости отвечает. Влияют настройки proxy_arp, arp_ignore, arp_filter и другие параметры интерфейса.

   **Типичная ошибка:** Ожидать одинакового ответа на ARP при любой multihomed конфигурации Linux.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

373. Что такое neighbour table subsystem?

   **Ответ:** Это общая инфраструктура сопоставления L3 neighbours с L2 endpoints и отслеживания доступности. В Linux обслуживает IPv4 ARP и IPv6 neighbours, состояния, очереди и probes.

   **Типичная ошибка:** Считать ARP cache и IPv6 neighbour cache полностью не связанными механизмами в ядре.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861).

374. Как приложение может инициировать резолвинг L2 адреса косвенно?

   **Ответ:** Обычная отправка IP-пакета к достижимому через Ethernet next hop вызывает resolution при отсутствии mapping. Приложению не нужно вручную строить ARP, чтобы отправить TCP/UDP.

   **Типичная ошибка:** Отправлять raw ARP перед каждым connect, дублируя работу ядра.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

375. Что происходит при `sendto()` если ARP резолвинг ещё не завершён?

   **Ответ:** Ядро может принять UDP-датаграмму и поставить её в ограниченную очередь до разрешения next hop. Возврат sendto не обязан ждать ARP reply; итог зависит от очередей, flags и состояния, а ошибка может стать видна позднее.

   **Типичная ошибка:** Считать возврат sendto числом байтов доказательством передачи кадра в провод.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

376. Может ли пакет быть буферизован до завершения ARP?

   **Ответ:** Да, neighbour subsystem имеет ограниченную очередь неразрешённых пакетов. При переполнении или неудаче resolution возможны потери и ошибки. Это не бесконечный буфер, гарантирующий доставку после появления соседа.

   **Типичная ошибка:** Устранять ARP failure только увеличением очереди, не исправляя связность.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

377. Как ARP failure проявляется на уровне сокетов?

   **Ответ:** Возможны задержка, таймаут, host unreachable или асинхронная ошибка; конкретное поведение зависит от socket type и стадии. TCP будет повторять попытки в пределах своих таймеров, UDP send может уже завершиться успешно.

   **Типичная ошибка:** Ожидать одного обязательного errno для всех ARP failures.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

378. Почему `connect()` или `send()` могут зависеть/таймаутиться при ARP проблеме?

   **Ответ:** Без MAC следующего узла пакет не может быть отправлен Ethernet-получателю. Blocking connect может ждать TCP/network timers; send может отдельно блокироваться из-за send buffer. Нужно различать neighbour resolution и прикладной timeout.

   **Типичная ошибка:** Считать каждое долгое send непосредственным ожиданием ARP reply внутри системного вызова.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

379. Как защититься от ARP spoofing на уровне сети?

   **Ответ:** Используют L2-сегментацию, DHCP snooping с Dynamic ARP Inspection, port security и статические bindings там, где они управляемы. Защищённые L7-протоколы ограничивают последствия перехвата, но не устраняют L2 DoS.

   **Типичная ошибка:** Включать DAI без корректных trusted ports и bindings, блокируя легитимные статические узлы.

   **Источник:** [Cisco: Dynamic ARP Inspection](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dynamic_arp_inspection.html).

380. Какие симптомы ARP spoofing видны в приложении и в tcpdump?

   **Ответ:** Могут наблюдаться неожиданные MAC для gateway, частые противоречивые объявления, разрывы или MITM-подобные симптомы. Это признаки для проверки, а не доказательство: failover и конфликт IP выглядят похоже.

   **Типичная ошибка:** По одному unsolicited ARP объявлять атаку без сравнения с допустимым HA-поведением.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227); [Cisco: Dynamic ARP Inspection](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dynamic_arp_inspection.html).


### Инженерные вопросы
381. Как ARP влияет на high-availability схемы с floating IP?

   **Ответ:** При переносе floating IP соседи должны отправлять кадры активному узлу. Если MAC изменился, старые caches могут вести на прежний узел до обновления; при virtual MAC важны также L2 forwarding tables.

   **Типичная ошибка:** Считать перенос IP полностью завершённым после успешной команды добавления адреса.

   **Источник:** [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

382. Почему gratuitous ARP важен при failover?

   **Ответ:** Объявление нового соответствия ускоряет обновление соседей и восстановление входящего трафика. Эффект зависит от получателей, фильтрации и L2; failover нужно проверять реальным трафиком.

   **Типичная ошибка:** Отправить announcement и не измерить фактический interruption time.

   **Источник:** [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227).

383. Как большое число ARP записей влияет на производительность устройств?

   **Ответ:** Растут память, работа garbage collection/probes и нагрузка на control plane, особенно при сканировании/недоступных адресах. Важны neighbour limits, churn и распределение нагрузки, а не только число строк.

   **Типичная ошибка:** Увеличивать лимиты бесконечно без оценки памяти и причин neighbour churn.

   **Источник:** [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

384. Какие operational проблемы вызывает ARP storm?

   **Ответ:** ARP storm нагружает все устройства L2-домена, CPU и каналы, может вытеснять полезный трафик и мешать resolution. Ищут петли, сканирование, некорректный host и чрезмерный домен; применяют контролируемую сегментацию и rate policies.

   **Типичная ошибка:** Маскировать storm только очисткой caches на клиентах.

   **Источник:** [RFC 826: An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

385. Как диагностировать intermittent connectivity, связанную с ARP?

   **Ответ:** Собирают timestamped neighbour events и captures, сопоставляют смены MAC, NUD transitions, failover и конфликты. Проверяют VLAN/port mapping и counters на коммутаторах. Случайная очистка ARP может временно скрыть причину.

   **Пример:**

   ```bash
   ip monitor neigh  # Состояния соседей; завершение Ctrl-C.
   # Параллельно в другом терминале:
   tcpdump -tttt -eni eth0 arp
   ```

   **Типичная ошибка:** Ограничиваться ping после очистки cache и объявлять проблему решённой.

   **Источник:** [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227).


---

## 8. DNS: recursive vs iterative queries

### Базовый уровень
386. Что такое DNS?

   **Ответ:** DNS — распределённая иерархическая система имён и ресурсных записей. Она хранит не только адреса: также delegations, mail routing и другие данные. Запрос задаёт имя, тип и класс записи.

   **Типичная ошибка:** Сводить DNS к одной централизованной таблице hostname→IPv4.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

387. Зачем нужен DNS?

   **Ответ:** DNS отделяет стабильное имя сервиса от конкретных адресов и распределяет управление пространством имён. Кэширование уменьшает обращения к authoritative инфраструктуре. Смена записи не переключает уже открытые соединения.

   **Типичная ошибка:** Ожидать, что изменение A-записи немедленно перенесёт существующий TCP-сеанс.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

388. Что такое доменное имя?

   **Ответ:** Доменное имя — последовательность labels в иерархии DNS, например `www.example.com.`. Завершающая точка обозначает корень и делает имя абсолютным; без неё resolver может применить search policy.

   **Типичная ошибка:** Путать доменное имя с URL, включающим схему, порт и путь.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html).

389. Что такое A record?

   **Ответ:** A — ресурсная запись, связывающая owner name с 32-битным IPv4-адресом. У одного имени может быть несколько A records. Это не маршрут и не гарантия доступности приложения.

   **Типичная ошибка:** Считать A-запись допустимым местом для IPv6 или URL.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

390. Что такое AAAA record?

   **Ответ:** AAAA связывает имя со 128-битным IPv6-адресом. Наличие AAAA требует реальной IPv6-доступности сервиса, иначе некоторые клиенты потратят время на неудачную попытку.

   **Типичная ошибка:** Публиковать AAAA, указывающую на адрес без рабочего маршрута и listener.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

391. Что такое CNAME?

   **Ответ:** CNAME делает owner name псевдонимом другого DNS-имени. Это ссылка на имя, а не HTTP redirect, и она не задаёт порт или путь. Resolver продолжает поиск нужного типа у canonical name.

   **Типичная ошибка:** Использовать CNAME как перенаправление на URL или ожидать изменения адресной строки браузера.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

392. Что такое MX record?

   **Ответ:** MX задаёт имя почтового обменника и preference: меньшее значение предпочтительнее. Данные MX содержат hostname, адреса которого разрешают отдельно.

   **Типичная ошибка:** Записывать IPv4 вместо имени mail exchanger в MX RDATA.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

393. Что такое NS record?

   **Ответ:** NS указывает имя authoritative сервера зоны или делегации. Чтобы обратиться к нему, нужен адрес; в некоторых делегациях родитель предоставляет glue A/AAAA.

   **Типичная ошибка:** Считать NS-запись адресом рекурсивного resolver для всех клиентов.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

394. Что такое PTR record?

   **Ответ:** PTR указывает доменное имя из другого имени DNS; чаще используется для reverse lookup адреса. Обратная запись административно независима от A/AAAA и не подтверждает идентичность сама по себе.

   **Типичная ошибка:** Доверять PTR как аутентификации peer или требовать единственный PTR для каждого адреса.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

395. Что такое recursive DNS query?

   **Ответ:** При recursive query клиент просит resolver получить конечный ответ либо ошибку, самостоятельно выполнив необходимые дальнейшие запросы. Флаг RD выражает запрос рекурсии; возможность сервера отражается RA.

   **Типичная ошибка:** Считать установленный RD доказательством того, что сервер действительно выполнил рекурсию.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

396. Что такое iterative DNS query?

   **Ответ:** При iterative resolution участник получает доступный серверу ответ, например referral к следующей зоне, и сам продолжает поиск. В обычной цепочке recursive resolver выполняет такие запросы к authoritative серверам.

   **Типичная ошибка:** Ожидать, что root сам запросит все нижележащие authoritative servers вместо referral.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

397. Чем recursive query отличается от iterative?

   **Ответ:** В recursive режиме работу по получению конечного ответа берёт resolver. В iterative режиме запрашивающая сторона сама следует referrals. Оба режима могут использовать кэш на соответствующих участках.

   **Типичная ошибка:** Считать recursive и iterative разными транспортами вроде UDP и TCP.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

398. Кто обычно выполняет recursive queries?

   **Ответ:** Обычно stub resolver ОС или приложение обращается с запросом рекурсии к настроенному recursive resolver. Им может быть локальный caching service или сетевой сервер.

   **Типичная ошибка:** Считать, что каждое приложение самостоятельно опрашивает root servers.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html).

399. Кто обычно выполняет iterative queries?

   **Ответ:** Обычно full-service recursive resolver при cache miss выполняет итеративный обход authoritative иерархии. Он также может переслать запрос upstream forwarder; это другая конфигурация обработки.

   **Типичная ошибка:** Считать каждый recursive resolver обязательно прямым клиентом root для каждого запроса.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

400. Что такое resolver?

   **Ответ:** Resolver — компонент, который получает ответы на запросы имён. Stub делегирует основную работу другому серверу; recursive resolver может обходить hierarchy, кэшировать и валидировать DNSSEC.

   **Типичная ошибка:** Называть любой authoritative-only сервер recursive resolver.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

401. Что такое authoritative DNS server?

   **Ответ:** Authoritative server обслуживает данные зон, за которые он отвечает. Он не обязан предлагать рекурсию клиентам; authoritative и recursive роли различаются, хотя могут быть реализованы одним ПО.

   **Типичная ошибка:** Считать отсутствие рекурсии у authoritative server неисправностью.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

402. Что такое root DNS server?

   **Ответ:** Root server отвечает за корневую зону и обычно направляет к TLD nameservers. Он не хранит полный набор записей всех доменов. Root service распределён по множеству экземпляров.

   **Типичная ошибка:** Ожидать прямой A-записи любого сайта в root zone.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

403. Что такое TLD server?

   **Ответ:** TLD nameserver обслуживает зону верхнего уровня, например `com.`, и выдаёт сведения о делегации дочерних зон. Конкретную запись сервиса обычно получают у authoritative сервера дочерней зоны.

   **Типичная ошибка:** Путать регистратора домена, registry и конечный authoritative server как одну обязательную роль.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

404. Как DNS резолвит имя шаг за шагом?

   **Ответ:** Stub обращается к recursive resolver; тот проверяет кэш, при необходимости получает referrals от root и TLD и запрос у authoritative сервера. Обрабатывает CNAME и возвращает ответ, сохраняя пригодные данные в кэше.

   **Пример:**

   ```bash
   dig example.com A
   dig +trace example.com A
   ```

   **Типичная ошибка:** Считать, что весь путь root→TLD→authoritative выполняется при каждом обращении, несмотря на кэш.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

405. Что такое TTL у DNS записи?

   **Ответ:** TTL задаёт срок, на который запись может быть кэширована без повторного получения. В cached answer обычно показывается оставшееся время. Это не TTL IP-пакета и не время жизни TCP-соединения.

   **Типичная ошибка:** Ожидать немедленного обновления всех кэшей после изменения записи у authoritative.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).


### Средний уровень
406. Что такое DNS caching?

   **Ответ:** Это хранение DNS-ответов/наборов записей с ограниченным временем пригодности. Оно существует у recursive resolver и иногда в ОС/приложении; отдельные уровни могут иметь разные правила.

   **Типичная ошибка:** Добавлять бессрочный cache адресов в приложение поверх DNS TTL.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

407. Почему DNS cache ускоряет работу сети?

   **Ответ:** Cache hit устраняет часть или весь обход иерархии, снижая latency и нагрузку authoritative серверов. DNS-кэш не ускоряет саму передачу данных после установления соединения.

   **Типичная ошибка:** Объяснять рост throughput одного уже открытого TCP-сеанса прогревом DNS.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

408. Что такое negative caching?

   **Ответ:** Negative caching хранит отрицательный результат, например NXDOMAIN или отсутствие нужного типа записи, на ограниченное время. Правила срока используют SOA отрицательного ответа. NXDOMAIN и NODATA означают разное.

   **Типичная ошибка:** Кэшировать все timeout/SERVFAIL как NXDOMAIN на длительное время.

   **Источник:** [RFC 2308: Negative Caching of DNS Queries](https://www.rfc-editor.org/rfc/rfc2308).

409. Что происходит при истечении TTL?

   **Ответ:** Обычная cached запись становится непригодной и для свежего ответа требуется обновление. Некоторые реализации отдельно поддерживают controlled serve-stale, но это не делает TTL бессрочным. Уже открытые соединения не закрываются из-за истечения DNS TTL.

   **Типичная ошибка:** На истечении TTL принудительно обрывать все работающие соединения без требований приложения.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [RFC 2308: Negative Caching of DNS Queries](https://www.rfc-editor.org/rfc/rfc2308).

410. Что такое stub resolver?

   **Ответ:** Stub resolver — клиентская часть, обычно обращающаяся к recursive resolver вместо самостоятельного обхода hierarchy. Вызов getaddrinfo может использовать её через системный name service.

   **Типичная ошибка:** Ожидать собственного полного DNS cache и DNSSEC validation у любой libc stub реализации.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

411. Как ОС взаимодействует с DNS resolver?

   **Ответ:** Приложение обычно вызывает getaddrinfo, а системный name service по конфигурации проверяет источники вроде hosts и DNS. Возможен локальный resolver daemon. Поэтому успешный getaddrinfo не доказывает сетевой DNS-запрос.

   **Типичная ошибка:** Считать, что getaddrinfo всегда отправляет DNS непосредственно на сервер из resolv.conf.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html).

412. Что такое `/etc/resolv.conf`?

   **Ответ:** Это распространённая Unix/Linux конфигурация resolver с nameserver, search и options. Файл может генерироваться сетевым менеджером и указывать на локальный stub. Реальное поведение зависит от libc/NSS и resolver service.

   **Типичная ошибка:** Вручную менять генерируемый файл и ожидать сохранения после DHCP renewal.

   **Источник:** [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html); [Linux man-pages: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html).

413. Что такое search domain?

   **Ответ:** Search domain используется для достраивания не абсолютного имени. Порядок попыток зависит от search, ndots и resolver. Это может добавлять запросы и задержки и неожиданно менять разрешаемое имя.

   **Типичная ошибка:** Использовать короткие имена без учёта search policy в разных окружениях.

   **Источник:** [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html).

414. Что такое reverse DNS lookup?

   **Ответ:** Reverse lookup ищет DNS-имя по адресу, обычно через PTR в reverse namespace. Он не является автоматической обратной функцией A/AAAA и может не дать ответа.

   **Типичная ошибка:** Считать отсутствие PTR признаком недоступности IP или невозможности TCP-connect.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

415. Как работает PTR lookup?

   **Ответ:** Для IPv4 октеты разворачивают и добавляют `in-addr.arpa`; IPv6 представляют обратной последовательностью hex nibbles в `ip6.arpa`. getnameinfo может выполнить lookup за приложение.

   **Пример:**

   ```bash
   dig -x 192.0.2.1
   dig -x 2001:db8::1  # Учебные адреса: PTR может отсутствовать.
   ```

   **Типичная ошибка:** Строить IPv6 reverse query перестановкой 16-битных групп вместо отдельных nibbles.

   **Источник:** [Linux man-pages: getnameinfo(3)](https://man7.org/linux/man-pages/man3/getnameinfo.3.html); [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

416. Чем отличаются UDP и TCP в DNS?

   **Ответ:** DNS поддерживает UDP и TCP. UDP не требует подключения, но ответ может быть усечён или потерян; TCP имеет framing с длиной и надёжную доставку, может переиспользоваться. Серверы общего назначения должны поддерживать TCP согласно требованиям.

   **Типичная ошибка:** Блокировать TCP/53, полагая, что обычным DNS он никогда не нужен.

   **Источник:** [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766).

417. Почему DNS обычно использует UDP?

   **Ответ:** UDP удобен для небольшого request/response без TCP handshake. Но потери, размер и middleboxes влияют на выбор; современная эксплуатация не ограничивается UDP и предусматривает TCP.

   **Типичная ошибка:** Считать UDP гарантированно быстрее в любом сценарии, включая повторные потери и fallback.

   **Источник:** [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766).

418. Когда DNS использует TCP?

   **Ответ:** TCP нужен при fallback после TC, для традиционных AXFR и может использоваться непосредственно, в том числе с persistent connections. DNS-over-TLS также работает поверх TCP. Большой ответ не обязательно всегда сначала пробуют по UDP.

   **Типичная ошибка:** Разрешить UDP/53, но забыть TCP/53 и получить избирательные DNS-сбои.

   **Источник:** [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766); [RFC 7858: DNS over TLS](https://www.rfc-editor.org/rfc/rfc7858).

419. Что такое EDNS(0)?

   **Ответ:** EDNS(0) расширяет DNS через OPT pseudo-record, позволяя сообщать поддерживаемый UDP payload size, дополнительные flags и options. Он не гарантирует, что объявленный большой пакет пройдёт путь без фрагментации.

   **Типичная ошибка:** Задавать максимально возможный UDP size и игнорировать PMTU и фильтрацию фрагментов.

   **Источник:** [RFC 6891: EDNS(0)](https://www.rfc-editor.org/rfc/rfc6891).

420. Почему классический размер DNS ответа был ограничен?

   **Ответ:** Изначальный DNS over UDP ограничивал сообщения 512 байтами; более крупный ответ усекался с TC и требовал другого пути, обычно TCP. EDNS(0) позволяет согласовать больший UDP payload size.

   **Типичная ошибка:** Считать 512 байт универсальным пределом DNS поверх TCP и EDNS.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035); [RFC 6891: EDNS(0)](https://www.rfc-editor.org/rfc/rfc6891).

421. Что такое DNS truncation?

   **Ответ:** Truncation — ответ с флагом TC, означающим, что сообщение не полностью помещается в доступный размер. Клиенту обычно требуется повторить запрос по TCP. Усечённые данные нельзя считать полным RRset.

   **Типичная ошибка:** Молча использовать только вошедшую часть списка адресов как окончательный ответ.

   **Источник:** [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035); [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766).

422. Что такое DNSSEC на концептуальном уровне?

   **Ответ:** DNSSEC добавляет подписи и проверяемую цепочку доверия для DNS data, включая аутентифицированное отрицание существования. Валидатор проверяет подлинность/целостность, но не шифрует имя запроса или ответ.

   **Типичная ошибка:** Считать DNSSEC заменой DoT/DoH для конфиденциальности.

   **Источник:** [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).

423. Зачем нужен DNSSEC?

   **Ответ:** Он позволяет отличать проверенные данные от подмены в пределах цепочки доверия. Это снижает риск forged/cached ложных записей; не гарантирует доступность resolver и не защищает соединение приложения вместо TLS.

   **Типичная ошибка:** Считать валидную DNSSEC-запись подтверждением добросовестности самого сайта.

   **Источник:** [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).

424. Почему CNAME нельзя смешивать с некоторыми другими записями на одном имени?

   **Ответ:** CNAME сообщает, что имя является псевдонимом, поэтому обычные другие data records на том же owner name создают противоречивую семантику. DNSSEC-related записи имеют предусмотренные исключения. На zone apex уже нужны SOA/NS.

   **Типичная ошибка:** Создавать обычный CNAME на apex вместе с обязательными SOA/NS, не различая provider-specific flattening.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).

425. Какие проблемы возникают из-за stale DNS cache?

   **Ответ:** Клиент может продолжать обращаться к старому endpoint после миграции, failover или смены политики. Дополнительные application caches и долгие connection pools увеличивают задержку переключения.

   **Типичная ошибка:** Снизить TTL непосредственно в момент миграции и ожидать немедленного истечения старых ранее закэшированных TTL.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).


### Продвинутый уровень
426. Как приложение на C/C++ вызывает DNS lookup?

   **Ответ:** Для host/service обычно используют getaddrinfo, затем перебирают addrinfo и освобождают список. Этот API обслуживает системное разрешение имён, а не произвольные типы DNS-записей; для MX/TXT нужны другие средства.

   **Пример:**

   ```c
   #define _POSIX_C_SOURCE 200112L
   #include <netdb.h>
   #include <stdio.h>
   #include <sys/socket.h>

   int main(void) {
       struct addrinfo hints = {0}, *list = NULL;
       hints.ai_family = AF_UNSPEC;
       hints.ai_socktype = SOCK_STREAM;
       int error = getaddrinfo("example.com", "443", &hints, &list);
       if (error != 0) {
           fprintf(stderr, "%s\n", gai_strerror(error));
           return 1;
       }
       for (const struct addrinfo *p = list; p != NULL; p = p->ai_next)
           printf("family=%d, length=%u\n", p->ai_family, (unsigned)p->ai_addrlen);
       freeaddrinfo(list);
       return 0;
   }
   ```

   **Типичная ошибка:** Искать MX или TXT через обычный getaddrinfo и считать отсутствие адреса отсутствием DNS-записи.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

427. Чем `getaddrinfo()` лучше `gethostbyname()` для DNS резолвинга?

   **Ответ:** Он поддерживает IPv4/IPv6, service names и выдаёт параметры, непосредственно подходящие socket/bind/connect. Возвращает список кандидатов и имеет отдельные error codes. У gethostbyname старый IPv4-ориентированный контракт.

   **Типичная ошибка:** Использовать strerror(errno) как единственное описание ошибки getaddrinfo вместо gai_strerror.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

428. Является ли `getaddrinfo()` always thread-safe?

   **Ответ:** Нельзя утверждать это для всех платформ и условий. В Linux man-pages getaddrinfo помечен MT-Safe env locale: параллельные вызовы допустимы при соблюдении ограничений вокруг environment/locale. Настройки процесса не следует менять конкурентно без продуманной синхронизации.

   **Типичная ошибка:** Приравнивать thread-safe к неблокирующему или async-signal-safe.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

429. Почему DNS lookup может блокировать поток?

   **Ответ:** Синхронный getaddrinfo может ждать DNS, retries, несколько источников NSS и локальные службы. Время lookup не равно времени TCP connect; оно может исчерпать общий deadline ещё до создания сокета.

   **Типичная ошибка:** Ставить timeout только на connect, оставляя DNS без ограничения в event-loop потоке.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html).

430. Как избежать блокирующего DNS в high-performance приложении?

   **Ответ:** Используют event-driven resolver либо выделенный ограниченный pool для blocking lookup. Ограничивают очередь, параллелизм и общий deadline; отмена ожидания не всегда отменяет уже выполняющийся libc вызов.

   **Типичная ошибка:** Создавать новый поток на каждый DNS-запрос без лимита и контроля завершения.

   **Источник:** [c-ares documentation](https://c-ares.org/docs.html); [libuv: DNS utility functions](https://docs.libuv.org/en/v1.x/dns.html).

431. Что такое asynchronous DNS resolution?

   **Ответ:** Это запуск lookup с получением результата позже через callback/future/event без блокировки основного потока. Внутри может быть неблокирующий сетевой resolver или worker pool — эти подходы имеют разные cancellation и resource свойства.

   **Типичная ошибка:** Считать любой async API полностью неблокирующим внутри реализации.

   **Источник:** [c-ares documentation](https://c-ares.org/docs.html); [libuv: DNS utility functions](https://docs.libuv.org/en/v1.x/dns.html).

432. Какие библиотечные подходы используются для async DNS в C/C++?

   **Ответ:** c-ares предоставляет DNS resolution с интеграцией в event loop; libuv uv_getaddrinfo выполняет системный lookup через worker pool. При выборе учитывают NSS semantics, cancellation, cache и требуемые типы записей.

   **Типичная ошибка:** Менять системный resolver на прямой DNS library, не проверив hosts, split DNS и корпоративные источники.

   **Источник:** [c-ares documentation](https://c-ares.org/docs.html); [libuv: DNS utility functions](https://docs.libuv.org/en/v1.x/dns.html); [Linux man-pages: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html).

433. Как DNS timeout проявляется в приложении?

   **Ответ:** Системный lookup может вернуть временную ошибку, например EAI_AGAIN; приложение также может завершить ожидание по собственному deadline. Нужно раздельно логировать lookup и connect, включая длительность и выбранное семейство.

   **Типичная ошибка:** Все resolver errors переводить в «сервер не принимает TCP».

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

434. Почему проблема DNS иногда выглядит как "сеть медленная"?

   **Ответ:** До получения адреса приложение не может начать обычный connect по имени. Search suffixes, потери и retries могут занять значительное время, хотя передача к известному IP работает нормально.

   **Типичная ошибка:** Измерять только общий request time и объяснять весь рост RTT сети.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html).

435. Как отладить ошибку `Temporary failure in name resolution`?

   **Ответ:** Проверяют resolver configuration, NSS, локальную resolver службу, route и UDP/TCP доступность DNS. Сравнивают системный lookup с dig к конкретному серверу, смотрят timeout/SERVFAIL и capture. EAI_AGAIN означает временную ошибку, но не её единственную причину.

   **Пример:**

   ```bash
   # Linux: системный lookup и отдельная DNS-проверка не эквивалентны.
   getent ahosts example.com
   cat /etc/resolv.conf
   dig example.com A
   dig +tcp example.com A
   ```

   **Типичная ошибка:** Сразу переписывать resolv.conf на случайный public resolver и ломать split DNS.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html); [Linux man-pages: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html).

436. Что покажет `dig` при recursive резолвинге?

   **Ответ:** Обычный dig отправляет запрос настроенному серверу с RD; ответ показывает flags, status, sections и время. Наличие RD означает просьбу, RA — поддержку рекурсии; флаг AA относится к authoritative answer.

   **Типичная ошибка:** По одному RD считать, что запрос действительно прошёл всю hierarchy без cache hit.

   **Источник:** [ISC BIND: dig manual](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

437. Как `dig +trace` отражает iterative resolution?

   **Ответ:** dig +trace сам следует делегациям от root, запрашивая уровни иерархии. Это полезно для delegations, но не повторяет точный путь системного recursive resolver, его кэш и split-DNS policy.

   **Типичная ошибка:** Считать успешный +trace доказательством исправности настроенного корпоративного resolver.

   **Источник:** [ISC BIND: dig manual](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

438. Как проверить TTL записи?

   **Ответ:** dig показывает TTL в answer section; у recursive ответа это обычно оставшееся время cache. Запрос к authoritative серверу помогает увидеть опубликованный TTL, но цепочку CNAME и нужный RRset нужно проверить отдельно.

   **Пример:**

   ```bash
   dig example.com A +noall +answer
   ```

   **Типичная ошибка:** Принимать TTL одного CNAME за TTL всех конечных A/AAAA.

   **Источник:** [ISC BIND: dig manual](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility); [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035).

439. Как увидеть, откуда пришёл DNS ответ — из cache или нет?

   **Ответ:** Сам DNS-ответ обычно не содержит универсального флага cache hit. Можно сравнивать оставшийся TTL, authoritative данные, время и resolver logs, но малый RTT сам по себе не доказательство. AA тоже не является общей меткой «без кэша».

   **Типичная ошибка:** По отсутствию AA безусловно заключать, что ответ взят из cache.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [ISC BIND: dig manual](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility).

440. Как tcpdump использовать для анализа DNS?

   **Ответ:** На нужном интерфейсе захватывают UDP и TCP port 53, сопоставляют query ID, names/types, flags и retries. Учитывают loopback stub и namespace. DoT/DoH не раскрывают обычные DNS payload в таком capture.

   **Пример:**

   ```bash
   tcpdump -ni any -c 30 'udp port 53 or tcp port 53'  # Linux, права на захват.
   ```

   **Типичная ошибка:** Фильтровать только UDP/53 и не заметить TCP fallback.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766); [RFC 7858: DNS over TLS](https://www.rfc-editor.org/rfc/rfc7858); [RFC 8484: DNS over HTTPS](https://www.rfc-editor.org/rfc/rfc8484).

441. Как отличить DNS проблему от routing/firewall проблемы?

   **Ответ:** Разделяют этапы: разрешение имени, route к полученному адресу, transport connect и TLS/application. Тестируют известный адрес, сохраняя Host/SNI, и проверяют DNS server reachability. Успех DNS не гарантирует доступность сервиса.

   **Пример:**

   ```bash
   # Подставьте реальный известный IP тестируемого HTTPS-сервиса.
   # --resolve сохраняет имя для Host/SNI, обходя обычный lookup этого endpoint.
   curl --connect-timeout 5 --resolve example.com:443:192.0.2.10 https://example.com/
   ```

   **Типичная ошибка:** Тестировать HTTPS только прямым IP и принимать ошибку SNI/сертификата за сетевой отказ.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

442. Почему DNS over TCP или DoT/DoH меняют модель наблюдаемости?

   **Ответ:** TCP даёт поток и connections; DoT/DoH дополнительно шифруют DNS payload. Обычный capture видит endpoints/transport и timing, но не names и RCODE без соответствующего доступа к расшифровке/логам. Наблюдаемость переносится на resolver/application.

   **Типичная ошибка:** Считать отсутствие видимого UDP/53 доказательством отсутствия DNS-запросов.

   **Источник:** [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766); [RFC 7858: DNS over TLS](https://www.rfc-editor.org/rfc/rfc7858); [RFC 8484: DNS over HTTPS](https://www.rfc-editor.org/rfc/rfc8484).

443. Как cache poisoning влияет на безопасность?

   **Ответ:** Ложная запись в cache направляет многих клиентов на неправильный endpoint до истечения срока или очистки. Проверка ответов, source-port/query-ID entropy и DNSSEC validation снижают риск; TLS остаётся отдельной защитой сервиса.

   **Типичная ошибка:** Доверять ответу только потому, что в нём совпало запрошенное имя.

   **Источник:** [RFC 5452: Measures for Making DNS More Resilient against Forged Answers](https://www.rfc-editor.org/rfc/rfc5452); [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).

444. Какие риски создаёт отсутствие валидации DNS ответа?

   **Ответ:** Возможны forged answers, неверное сопоставление транзакций и использование данных от недоверенного источника. Resolver должен проверять параметры ответа, а при DNSSEC — цепочку доверия. Ошибки валидации не следует молча превращать в успешный ответ.

   **Типичная ошибка:** При DNSSEC validation failure автоматически повторять без проверки и считать это надёжным fallback.

   **Источник:** [RFC 5452: Measures for Making DNS More Resilient against Forged Answers](https://www.rfc-editor.org/rfc/rfc5452); [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).

445. Как правильно проектировать retries при DNS lookup в приложении?

   **Ответ:** Используют общий deadline, ограниченные retries с backoff/jitter и различают временные ошибки, NXDOMAIN и NODATA. Коалесцируют одновременные lookup одного имени и учитывают negative cache, чтобы не создавать retry storm.

   **Типичная ошибка:** Бесконечно повторять NXDOMAIN с нескольких потоков без задержки.

   **Источник:** [RFC 2308: Negative Caching of DNS Queries](https://www.rfc-editor.org/rfc/rfc2308); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).


### Инженерные вопросы
446. Почему DNS считается критичной зависимостью почти любого сервиса?

   **Ответ:** Почти любая зависимость по имени требует свежего разрешения при новых подключениях или смене endpoints. Отказ resolver может затронуть сразу много сервисов, даже когда IP routing исправен. Существующие connections могут продолжать работать.

   **Типичная ошибка:** Считать DNS исключительно зависимостью пользовательского браузера.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

447. Что лучше кешировать в приложении, а что оставить системному resolver?

   **Ответ:** Системному resolver оставляют hosts/NSS/split-DNS semantics; в приложении при необходимости кэшируют результаты с явной политикой свежести и лимитами. getaddrinfo не предоставляет стандартного TTL, поэтому его результат нельзя автоматически считать TTL-aware cache API.

   **Типичная ошибка:** Бессрочно кэшировать первый IP из getaddrinfo и терять failover и балансировку.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html); [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

448. Какие проблемы создаёт слишком большой TTL?

   **Ответ:** Он замедляет смену endpoints и реакцию на ошибки/компрометацию, поскольку старые данные могут жить долго. Снижение TTL планируют заранее; существующие connections и дополнительные caches проверяют отдельно.

   **Типичная ошибка:** После аварии снизить TTL у authoritative и ожидать немедленного обновления уже выданных ответов.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

449. Какие проблемы создаёт слишком маленький TTL?

   **Ответ:** Растут число запросов, нагрузка, зависимость от resolver и чувствительность к его отказу. Низкий TTL не гарантирует мгновенный failover, если приложения удерживают connections или кэшируют отдельно.

   **Типичная ошибка:** Использовать TTL=0 как единственный механизм отказоустойчивости.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034).

450. Как проектировать отказоустойчивый DNS для production-сервиса?

   **Ответ:** Разносят authoritative инфраструктуру по независимым failure domains, обеспечивают надёжные recursive resolvers, контролируют delegations и актуальность записей. Проверяют UDP/TCP, IPv4/IPv6, DNSSEC при использовании и поведение клиентов при отказах.

   **Типичная ошибка:** Разместить несколько NS names на одном устройстве/канале и считать их независимым резервированием.

   **Источник:** [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034); [RFC 7766: DNS Transport over TCP](https://www.rfc-editor.org/rfc/rfc7766); [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033).


---

## 9. DHCP: процесс получения IP

### Базовый уровень
451. Что такое DHCP?

   **Ответ:** DHCP автоматически выдаёт узлам сетевую конфигурацию и аренду IPv4-адреса. Здесь речь о DHCPv4; DHCPv6 — отдельный протокол с другими сообщениями и свойствами.

   **Типичная ошибка:** Переносить DORA и UDP-порты DHCPv4 на DHCPv6.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

452. Для чего нужен DHCP?

   **Ответ:** Для централизованной выдачи адресов, маршрутов и других параметров без ручной настройки каждого клиента. Сервер управляет пулом и сроками аренды; клиент должен корректно обновлять и прекращать использование адреса.

   **Типичная ошибка:** Считать выданный адрес постоянной идентичностью устройства.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132).

453. Какие параметры кроме IP может выдавать DHCP?

   **Ответ:** Например, subnet mask, routers/default gateway, DNS servers, domain name и lease timers. Набор зависит от options и политики сервера; клиент может запрашивать нужные параметры.

   **Типичная ошибка:** Ожидать одинакового набора опций у любого DHCP-сервера.

   **Источник:** [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132).

454. Что такое lease?

   **Ответ:** Lease — разрешение клиенту использовать адрес в течение согласованного срока с определёнными параметрами. Оно требует renewal или прекращения использования при истечении. Возможны специальные случаи, например бесконечный срок по протоколу.

   **Типичная ошибка:** Продолжать использовать истёкший динамический адрес без новой аренды.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

455. Что такое DHCP Discover?

   **Ответ:** DHCPDISCOVER — сообщение поиска серверов при начальной конфигурации. Обычно клиент рассылает его broadcast, ещё не имея пригодного IPv4, и указывает идентификаторы транзакции/клиента.

   **Типичная ошибка:** Ожидать unicast-запрос к заранее известному серверу в каждом начальном обмене.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

456. Что такое DHCP Offer?

   **Ответ:** DHCPOFFER — предложение адреса и параметров от сервера. Клиент может получить несколько предложений и выбрать одно; Offer ещё не завершает выдачу аренды.

   **Типичная ошибка:** Начинать использовать предложенный адрес как подтверждённый до необходимого ACK и проверок.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

457. Что такое DHCP Request?

   **Ответ:** DHCPREQUEST используется не только для выбора Offer, но и в других состояниях, включая renewal и подтверждение ранее известной конфигурации. Содержание и способ доставки зависят от состояния клиента.

   **Типичная ошибка:** Считать всякий Request доказательством предшествующего Discover в том же capture.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

458. Что такое DHCP Acknowledgement?

   **Ответ:** DHCPACK подтверждает допустимую конфигурацию/аренду и передаёт параметры клиенту. Клиент применяет её с предусмотренными проверками; DHCPNAK, напротив, отклоняет использование конфигурации.

   **Типичная ошибка:** Игнорировать ACK options и продолжать применять параметры из старого Offer.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

459. Что такое DORA?

   **Ответ:** DORA — сокращение Discover → Offer → Request → Acknowledge, типичного начального DHCPv4 обмена. Renewal и INIT-REBOOT могут иметь другой набор сообщений.

   **Типичная ошибка:** Требовать все четыре сообщения в каждом корректном обновлении аренды.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

460. Почему на первом этапе клиент использует broadcast?

   **Ответ:** Клиент не знает сервер и ещё не имеет обычного исходного адреса, поэтому обращается через локальный broadcast. Relay при необходимости передаёт запрос в другую сеть. Не каждый последующий этап обязан использовать broadcast.

   **Типичная ошибка:** Считать весь DHCP-трафик всегда широковещательным.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

461. Как клиент без IP адреса может общаться в сети?

   **Ответ:** Начальный DHCPv4 использует source `0.0.0.0`, destination `255.255.255.255` и UDP, а идентификация включает transaction/client fields и link-layer контекст. Это специальный bootstrap-процесс, а не обычный IP unicast.

   **Типичная ошибка:** Полагать, что до назначения IP узел вообще не может отправить Ethernet-кадр.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

462. Что такое DHCP server?

   **Ответ:** Это сервис, который по политике выбирает конфигурацию, управляет пулами и lease database и отвечает клиентам/relay. Он должен предотвращать конфликтующие выдачи в своей административной области.

   **Типичная ошибка:** Запускать два независимых сервера с одним пулом без координации и считать это HA.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

463. Что такое DHCP relay?

   **Ответ:** DHCP relay принимает клиентский bootstrap-трафик и пересылает его серверу вне локального сегмента. Он сообщает контекст клиентской сети, в DHCPv4 важную роль играет giaddr.

   **Типичная ошибка:** Считать relay обычным прозрачным bridge для всех broadcasts.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

464. Зачем нужен DHCP relay?

   **Ответ:** IP routers не распространяют обычный limited broadcast между подсетями. Relay позволяет централизованному серверу обслуживать несколько L3-сегментов и выбрать подходящий пул по клиентскому контексту.

   **Типичная ошибка:** Пытаться решить отсутствие DHCP за роутером только добавлением default route клиенту, у которого ещё нет адреса.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

465. Что такое lease time?

   **Ответ:** Lease time — срок разрешённого использования адреса, переданный клиенту, обычно в секундах. Он влияет на частоту renewal, скорость возврата адресов в пул и устойчивость клиентов при недоступности сервера.

   **Типичная ошибка:** Задавать очень короткую аренду без оценки нагрузки и поведения при отказе DHCP.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132).


### Средний уровень
466. Что происходит при обновлении lease?

   **Ответ:** Клиент в RENEWING отправляет DHCPREQUEST выбранному серверу, обычно unicast, и после ACK обновляет срок/параметры. При отсутствии ответа продолжает процедуру по таймерам; renewal не обязан менять IP.

   **Типичная ошибка:** Обрывать все приложения при каждом ACK, даже если адрес и маршруты не изменились.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

467. Что такое T1 и T2 timers?

   **Ответ:** T1 — момент перехода к renewal, T2 — к rebinding. Если сервер не задал иные допустимые значения, обычно T1=0,5 и T2=0,875 срока аренды. Должно соблюдаться T1 < T2 < expiration.

   **Типичная ошибка:** Считать T1/T2 абсолютными константами в секундах для всех клиентов.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

468. Когда клиент пытается renew адрес?

   **Ответ:** При достижении T1 клиент пытается продлить lease у исходного сервера. Использует имеющуюся конфигурацию в пределах её срока; получение ACK обновляет таймеры.

   **Типичная ошибка:** Считать отсутствие ответа на первый renewal немедленным требованием сбросить ещё действующий адрес.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

469. Когда клиент начинает rebinding?

   **Ответ:** При T2 без успешного renewal клиент переходит в REBINDING и обращается broadcast к доступным серверам. Если срок истёк без подтверждения, адрес больше нельзя использовать по старой аренде.

   **Типичная ошибка:** Продолжать бесконечно отправлять только unicast старому серверу после T2.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

470. Что происходит, если DHCP сервер недоступен?

   **Ответ:** Клиент с действующим lease продолжает использовать его до допустимого срока, пытаясь renew/rebind. После истечения должен прекратить использование; поведение при начальном отсутствии адреса и link-local fallback зависит от реализации.

   **Типичная ошибка:** Считать, что любой отказ DHCP немедленно обрывает весь трафик всех уже настроенных клиентов.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [RFC 3927: Dynamic Configuration of IPv4 Link-Local Addresses](https://www.rfc-editor.org/rfc/rfc3927).

471. Что такое DHCP decline?

   **Ответ:** DHCPDECLINE сообщает серверу, что предложенный/подтверждённый адрес обнаружен уже используемым, например после проверки конфликта. Сервер не должен немедленно выдавать его другому клиенту без разбирательства.

   **Типичная ошибка:** Игнорировать Decline и искать только нехватку свободных адресов.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [RFC 3927: Dynamic Configuration of IPv4 Link-Local Addresses](https://www.rfc-editor.org/rfc/rfc3927).

472. Когда клиент отправляет DHCP release?

   **Ответ:** Когда клиент корректно отказывается от ещё действующей аренды, он может отправить DHCPRELEASE серверу. При аварийном выключении сообщения может не быть, поэтому серверу всё равно нужен lease expiry.

   **Типичная ошибка:** Строить освобождение пула исключительно на обязательном приходе Release.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

473. Что такое reservation в DHCP?

   **Ответ:** Reservation — политика сервера выдавать определённому идентификатору клиента выбранный адрес. Идентификатором может быть client ID, MAC или другой поддерживаемый ключ; точные правила зависят от сервера.

   **Типичная ошибка:** Считать MAC единственно возможным ключом reservation и игнорировать client identifier.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

474. Чем DHCP reservation отличается от static IP?

   **Ответ:** При reservation параметры всё ещё получает DHCP-клиент и зависит от доступности DHCP-процедуры. Static IP задаётся локально и не арендуется этим способом. Оба варианта требуют предотвращения пересечений с динамическим пулом.

   **Типичная ошибка:** Назначить вручную адрес из пула без исключения/reservation и получить дубликат.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

475. Что такое option 3 в DHCP?

   **Ответ:** DHCP option 3 — Router Option, список IPv4 routers на клиентской подсети в порядке предпочтения. Обычно через неё передают default gateway; поддерживаемые route options могут дополнять правила.

   **Типичная ошибка:** Путать option 3 с DNS servers, передаваемыми option 6.

   **Источник:** [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132).

476. Что такое option 6?

   **Ответ:** Option 6 содержит список IPv4 DNS servers в порядке предпочтения. Это не сами DNS-записи и не гарантия, что клиент будет использовать только их при наличии других resolver policies.

   **Типичная ошибка:** Считать получение option 6 доказательством исправного DNS resolution.

   **Источник:** [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132).

477. Как DHCP выдаёт default gateway?

   **Ответ:** Через Router Option 3 сервер сообщает адреса маршрутизаторов. Клиентский менеджер сети устанавливает соответствующую конфигурацию с учётом своей policy. Другие DHCP route options могут изменить итоговую таблицу.

   **Типичная ошибка:** Считать содержимое option 3 единственным фактором итогового default route в multihomed системе.

   **Источник:** [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).

478. Как DHCP выдаёт DNS серверы?

   **Ответ:** Через option 6 передаются адреса DNS servers; другие options могут задавать domain/search settings. Клиент интегрирует их в системный resolver, иногда через локальный daemon.

   **Типичная ошибка:** Искать DNS server из lease только в resolv.conf, не учитывая per-link/split-DNS менеджер.

   **Источник:** [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132); [Linux man-pages: resolv.conf(5)](https://man7.org/linux/man-pages/man5/resolv.conf.5.html).

479. Почему DHCP обычно работает поверх UDP?

   **Ответ:** UDP поддерживает небольшие сообщения и bootstrap без предварительного транспортного соединения. DHCP определяет собственные transaction IDs, retransmissions и state machine; отсутствие TCP не означает отсутствия повторов.

   **Типичная ошибка:** Считать DORA одним TCP connection, которое клиент открывает до получения IP.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

480. Какие порты использует DHCP?

   **Ответ:** DHCPv4 использует UDP/67 на стороне сервера и UDP/68 на стороне клиента; relay-сценарии имеют дополнительные особенности направлений. DHCPv6 использует другие порты и не описывается этим ответом.

   **Типичная ошибка:** Снимать capture только TCP/67 или переносить 67/68 на DHCPv6.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

481. Почему DHCP не проходит через роутер без relay?

   **Ответ:** Начальный limited broadcast не пересылается обычной IP-маршрутизацией. Relay принимает его в локальном сегменте и формирует корректную доставку серверу с контекстом сети клиента.

   **Типичная ошибка:** Включить IPv4 forwarding и считать, что это само создаёт DHCP relay.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

482. Какие security риски есть у DHCP?

   **Ответ:** Возможны ложная выдача gateway/DNS, отказ в обслуживании через исчерпание пула, подмена client identifiers и нарушение учёта. DHCP snooping и границы доверия уменьшают риск, но не заменяют защиту приложений.

   **Типичная ошибка:** Доверять выданному DNS/gateway как криптографически аутентифицированной информации.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [Cisco: DHCP Snooping](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dhcp.html).

483. Что такое rogue DHCP server?

   **Ответ:** Это неразрешённый DHCP-сервер, способный выдать клиентам неправильные адреса, gateway или DNS. Он может быть злоумышленным либо случайно включённым домашним роутером.

   **Типичная ошибка:** Предполагать злой умысел без проверки случайного подключения устройства.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [Cisco: DHCP Snooping](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dhcp.html).

484. Как DHCP starvation attack работает?

   **Ответ:** Атакующий пытается занять много leases, выдавая себя за множество клиентов, чтобы легитимным узлам не хватило пула. Защита включает контроль портов/идентификаторов и rate limits по принятой политике.

   **Типичная ошибка:** Защищаться только увеличением пула, не ограничивая источник массовых запросов.

   **Источник:** [Cisco: DHCP Snooping](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dhcp.html).

485. Как защититься от rogue DHCP?

   **Ответ:** Разрешают server replies только с trusted switch ports, используют DHCP snooping, контролируют uplinks/relay и доступ к L2. Настройку согласуют с реальной топологией, иначе блокируют легитимные offers.

   **Типичная ошибка:** Объявить все access ports trusted и лишить snooping защитного смысла.

   **Источник:** [Cisco: DHCP Snooping](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_cg/configuring_dhcp.html).


### Продвинутый уровень
486. Как в Linux посмотреть полученный DHCP lease?

   **Ответ:** Способ зависит от клиента: NetworkManager показывает DHCP options через nmcli, systemd-networkd — состояние через networkctl и журнал. Файлы lease и их путь зависят от службы/версии. ip addr показывает применённый адрес, но не всю аренду.

   **Пример:**

   ```bash
   # Используйте команду своего сетевого менеджера:
   nmcli -f GENERAL,IP4,DHCP4 device show eth0
   networkctl status eth0
   ip -4 address show dev eth0
   ```

   **Типичная ошибка:** Искать обязательный для любого Linux файл dhclient.leases, хотя dhclient может не использоваться.

   **Источник:** [NetworkManager: nmcli manual](https://networkmanager.dev/docs/api/latest/nmcli.html); [systemd: networkctl](https://www.freedesktop.org/software/systemd/man/latest/networkctl.html).

487. Как отладить ситуацию, когда хост не получает IP?

   **Ответ:** Проверяют link/VLAN, состояние DHCP client, наличие Discover, Offer, Request и ACK/NAK, корректность relay и доступность пула. Захват на клиенте/relay/server помогает найти первый отсутствующий этап.

   **Типичная ошибка:** Перезапускать всё подряд до сохранения capture и lease/server logs.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

488. Как tcpdump использовать для анализа DORA?

   **Ответ:** Capture UDP/67 и UDP/68 позволяет увидеть типы сообщений, transaction ID, client fields и options. Сопоставляют один обмен по идентификаторам, а не только порядку строк; relay и несколько клиентов дают перемешанные пакеты.

   **Пример:**

   ```bash
   tcpdump -ni eth0 -vvv -c 40 'udp port 67 or udp port 68'
   # Linux, нужны права на захват; интерфейс замените на клиентский/relay.
   ```

   **Типичная ошибка:** Принять Offer одного клиента за ответ на Discover другого.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

489. Какие поля содержатся в DHCP packet?

   **Ответ:** Фиксированные BOOTP-поля включают op, htype, hlen, hops, xid, secs, flags, ciaddr, yiaddr, siaddr, giaddr, chaddr, sname и file. Далее — magic cookie и options, включая DHCP message type. Разбор требует проверки длин и special option rules.

   **Типичная ошибка:** Непосредственно cast полученного буфера к C struct и читать options без bounds checks.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [RFC 2132: DHCP Options and BOOTP Vendor Extensions](https://www.rfc-editor.org/rfc/rfc2132).

490. Чем DHCP отличается от BOOTP?

   **Ответ:** DHCP использует BOOTP-совместимый базовый формат, но добавляет динамическую аренду, типы сообщений, state machine и расширенное управление options. BOOTP исторически ориентирован на bootstrap с более статической конфигурацией.

   **Типичная ошибка:** Считать DHCP и BOOTP полностью разными wire formats без совместимого заголовка.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

491. Как DHCP client реализуется на уровне state machine?

   **Ответ:** Клиент проходит INIT/SELECTING/REQUESTING/BOUND/RENEWING/REBINDING и дополнительные состояния. Переходы определяют входящие сообщения, timers и проверки; xid и выбранный server связывают обмен. Нужно проверять неожиданные/старые ответы.

   **Типичная ошибка:** Применять любой ACK независимо от текущей транзакции и состояния.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

492. Может ли приложение на C/C++ узнать, что IP адрес интерфейса изменился по DHCP?

   **Ответ:** В Linux можно подписаться на RTNETLINK address/link/route events и сверять снимок конфигурации. Событие изменения адреса не сообщает обязательную причину «DHCP»; для неё нужны данные сетевого менеджера.

   **Пример:**

   ```bash
   ip monitor address route  # Linux: уведомления до Ctrl-C.
   ```

   **Типичная ошибка:** Считать RTM_NEWADDR доказательством, что lease поменял именно DHCP.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html); [NetworkManager: nmcli manual](https://networkmanager.dev/docs/api/latest/nmcli.html).

493. Как изменение IP адреса влияет на уже открытые сокеты?

   **Ответ:** Если адрес сохраняется при renewal, сокеты обычно не затронуты самим DHCP ACK. При удалении/замене адреса существующие соединения не получают автоматически новый endpoint; поведение передачи зависит от состояния ядра и маршрутов.

   **Типичная ошибка:** Считать любой DHCP renewal сменой IP и обязательным reset всех сокетов.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [Linux man-pages: ip(7)](https://man7.org/linux/man-pages/man7/ip.7.html).

494. Что происходит с long-lived TCP connections при смене IP?

   **Ответ:** Обычный TCP привязан к endpoints соединения. При потере адреса старый поток может перестать передавать данные и завершиться ошибкой/timeout; новое соединение используют для нового адреса. Нужны protocol-level recovery и безопасный повтор операций.

   **Типичная ошибка:** Просто повторять неидемпотентный запрос после reconnect без проверки, не был ли он уже выполнен.

   **Источник:** [RFC 9293: TCP](https://www.rfc-editor.org/rfc/rfc9293).

495. Как серверные приложения реагируют на DHCP renewal?

   **Ответ:** Renewal с тем же адресом не требует обязательного rebind. При реальной смене адреса пересматривают listeners, опубликованные endpoints и исходящие connections; реагируют на network events и состояние сервиса, а не только на lease timer.

   **Типичная ошибка:** Перезапускать сервер на каждом ACK и создавать ненужные разрывы.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [Linux man-pages: bind(2)](https://man7.org/linux/man-pages/man2/bind.2.html); [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

496. Как подписаться на netlink события изменения адреса интерфейса?

   **Ответ:** Создают NETLINK_ROUTE socket и подписываются на IPv4/IPv6 address multicast groups, разбирают RTM_NEWADDR/RTM_DELADDR и их attributes. Делают начальный dump и последующую синхронизацию; при потере событий нужен rescan.

   **Типичная ошибка:** Считать поток уведомлений полным вечным источником истины без обработки overflow и начального состояния.

   **Источник:** [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

497. Почему bind к `0.0.0.0` ведёт себя иначе, чем bind к конкретному IP при смене адреса?

   **Ответ:** Wildcard listener не привязан к одному локальному IPv4 и может принимать на доступных локальных адресах. Listener, bound к конкретному адресу, сохраняет эту привязку; она не преобразуется автоматически в новый IP. Accepted TCP sockets всё равно имеют конкретные endpoints.

   **Типичная ошибка:** Считать wildcard способом перенести уже установленное соединение на другой адрес.

   **Источник:** [Linux man-pages: ip(7)](https://man7.org/linux/man-pages/man7/ip.7.html); [Linux man-pages: bind(2)](https://man7.org/linux/man-pages/man2/bind.2.html).

498. Как тестировать DHCP зависимые приложения в CI?

   **Ответ:** В отдельных network namespaces/VM запускают управляемый DHCP server, меняют lease/адреса и моделируют потерю ответов. Проверяют startup, renewal без смены адреса, readdress и recovery. Тестовая DHCP-служба не должна попадать в реальную LAN.

   **Типичная ошибка:** Запускать CI DHCP broadcast в общей сети рабочего компьютера.

   **Источник:** [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

499. Какие race conditions возникают при старте сервиса до получения DHCP lease?

   **Ответ:** Bind к ещё не назначенному адресу может вернуть EADDRNOTAVAIL; resolver/routes тоже могут быть не готовы. Адрес способен измениться между проверкой и использованием. Нужно обрабатывать ошибки операций и определить, что именно означает readiness.

   **Типичная ошибка:** Проверить адрес один раз, затем игнорировать ошибки bind/connect, считая race невозможной.

   **Источник:** [Linux man-pages: bind(2)](https://man7.org/linux/man-pages/man2/bind.2.html); [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html).

500. Как корректно обрабатывать "сеть ещё не готова" в daemon/service?

   **Ответ:** Разделяют готовность процесса и сетевую готовность сервиса, используют ограниченные retries/backoff и события менеджера сети. Проверяют конкретные prerequisites: listener, route, DNS или зависимость. Сам link-up не означает internet-ready.

   **Типичная ошибка:** Бесконечно блокировать startup без health/status и без возможности корректного завершения.

   **Источник:** [Linux man-pages: bind(2)](https://man7.org/linux/man-pages/man2/bind.2.html); [Linux man-pages: rtnetlink(7)](https://man7.org/linux/man-pages/man7/rtnetlink.7.html); [NetworkManager: nmcli manual](https://networkmanager.dev/docs/api/latest/nmcli.html).


### Инженерные вопросы
501. Когда DHCP лучше static addressing?

   **Ответ:** Для большого числа управляемых клиентов, мобильных/сменяемых устройств и централизованного изменения параметров. Reservations позволяют сохранить предсказуемые назначения, не переходя на ручную настройку каждого узла.

   **Типичная ошибка:** Считать DHCP несовместимым с постоянными адресами для известных клиентов.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

502. Когда static addressing предпочтительнее DHCP?

   **Ответ:** Когда bootstrap инфраструктуры должен быть независим от DHCP, адрес строго фиксирован либо таковы требования оборудования/эксплуатации. Это требует учёта, защиты от конфликтов и отдельного обновления параметров.

   **Типичная ошибка:** Считать static addressing свободным от необходимости централизованного inventory.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).

503. Какие проблемы возникают у серверов при DHCP вместо static IP?

   **Ответ:** При неконтролируемой смене адреса расходятся DNS, ACL и published endpoints; startup зависит от lease availability. Reservations и надёжный DHCP уменьшают риски, но не отменяют проверки renewal/readdress.

   **Типичная ошибка:** Решать проблему только очень длинной арендой без адресного учёта и HA.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

504. Как DHCP влияет на observability и inventory management?

   **Ответ:** Lease logs связывают client identifier, адрес и временной интервал; relay context помогает определить сегмент. Для расследований нужны синхронизированные часы и история, а MAC/client ID не является сильной идентификацией пользователя.

   **Типичная ошибка:** Считать текущее назначение IP доказательством его владельца в момент прошлого инцидента.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).

505. Как спроектировать сеть так, чтобы DHCP не был единой точкой отказа?

   **Ответ:** Разносят серверы/relay и питание/каналы, координируют пулы и lease state через поддерживаемый HA-механизм. Проверяют renew/rebind и восстановление после разделения сети. Два несогласованных сервера с одним пулом создают конфликты.

   **Типичная ошибка:** Объявить HA по числу процессов без проверки split-brain и согласованности аренды.

   **Источник:** [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131); [ISC Kea: High Availability](https://kea.readthedocs.io/en/latest/arm/hooks.html#high-availability-ha-hook-library).


---

## 10. Сквозные вопросы по Core Networking

### Диагностика
506. Как последовательно диагностировать отсутствие connectivity?

   **Ответ:** Фиксируют конкретный endpoint, протокол, source и момент сбоя. Затем проверяют link/address, route/rules и next-hop neighbour, name resolution, transport handshake и приложение. Пакетные захваты с обеих сторон помогают найти первый участок потери.

   **Типичная ошибка:** Считать успешный ping полной проверкой TCP, DNS, TLS и прикладной авторизации.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

507. С чего начать: ARP, route, DNS или firewall?

   **Ответ:** Начинают с точного симптома и конфигурации хоста. Для ошибки имени проверяют resolver; для числового IP — маршрут и next hop; затем capture/firewall на нужном этапе. ARP проверяют только там, где он действительно участвует.

   **Типичная ошибка:** Всегда применять одну жёсткую последовательность, начиная с DNS даже для ENETUNREACH по числовому IP.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

508. Почему `ping IP` работает, а `ping hostname` нет?

   **Ответ:** Вероятна проблема разрешения имени, но также имя может указывать на другой адрес или семейство. Сравнивают getaddrinfo/getent, A/AAAA и фактически выбранный endpoint. Исправный ping по одному IPv4 не доказывает исправность IPv6.

   **Типичная ошибка:** Считать любую такую ситуацию однозначным отказом authoritative DNS.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

509. Почему DNS работает, но соединение не устанавливается?

   **Ответ:** DNS сообщает адрес, а не доступность порта. Возможны неверная запись, маршрут, firewall, отсутствие listener, exhausted resources или сломанный обратный путь. TLS/приложение проверяют после transport connect.

   **Типичная ошибка:** Менять DNS, не проверив, какой IP уже получен и проходит ли SYN/SYN-ACK.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

510. Почему соединение в одной подсети работает, а через gateway — нет?

   **Ответ:** Локальная доставка не использует тот же путь, что удалённая. Проверяют default gateway и его MAC, forwarding/ACL, route удалённой сети и обратный путь. Неверная маска может ошибочно сделать удалённый адрес on-link.

   **Типичная ошибка:** Считать исправный обмен внутри LAN проверкой gateway и всех внешних маршрутов.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

511. Как отличить NAT проблему от routing проблемы?

   **Ответ:** Сначала проверяют маршрут и forwarding без предположения о NAT. Затем сравнивают tuples и captures до/после трансляции, conntrack, правила и обратный путь. Пакет может вообще не доходить до NAT hook.

   **Типичная ошибка:** Объявлять любую потерю private→public трафика ошибкой SNAT.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [nftables manual](https://netfilter.org/projects/nftables/manpage.html); [conntrack-tools manual](https://www.netfilter.org/projects/conntrack-tools/manual.html).

512. Как отличить DHCP проблему от DNS проблемы?

   **Ответ:** DHCP выдаёт адрес/параметры, DNS разрешает имена. Проверяют наличие пригодного адреса и маршрута, затем lookup. DHCP может работать, но выдать неправильный DNS; статически настроенный хост может иметь отдельный DNS-сбой.

   **Типичная ошибка:** Считать отсутствие ответа сайта по имени доказательством отсутствия DHCP lease.

   **Источник:** [RFC 2131: DHCP](https://www.rfc-editor.org/rfc/rfc2131); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

513. Почему приложение может видеть `ENETUNREACH`?

   **Ответ:** ENETUNREACH означает недостижимость сети в контексте операции, например отсутствие пригодного маршрута в выбранной таблице. Проверяют namespace, destination family, source/mark и rules; сообщение не указывает автоматически на физический обрыв.

   **Типичная ошибка:** Исправлять DNS для уже разрешённого адреса, не посмотрев route selection.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

514. Почему приложение может видеть `EHOSTUNREACH`?

   **Ответ:** EHOSTUNREACH указывает недостижимость хоста; возможны neighbour failure, полученное unreachable или явный тип маршрута. Источник ошибки уточняют по route/neighbour state и capture.

   **Типичная ошибка:** Считать этот errno доказательством, что удалённый сервер выключен.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).

515. Что означает `ECONNREFUSED` и на каком этапе оно возникает?

   **Ответ:** При connect это отказ в установлении соединения, часто из-за TCP RST при отсутствии listener; активный firewall reject тоже может его вызвать. Он отличается от молчаливого drop/timeout. Конкретный этап устанавливают по capture.

   **Типичная ошибка:** Безусловно приписывать ECONNREFUSED приложению сервера без проверки firewall и destination port.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

516. Что означает timeout при `connect()` и как его интерпретировать?

   **Ответ:** Connect не завершился успешно в пределах kernel timeout либо application deadline. Причины включают потери SYN/SYN-ACK, silent drops, неправильный путь, neighbour failure и перегрузку. По самому timeout нельзя определить виновное устройство.

   **Типичная ошибка:** Бесконечно увеличивать timeout, не проверяя handshake и общий бюджет запроса.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

517. Как собрать минимальный набор команд для сетевой диагностики на Linux?

   **Ответ:** Минимальный набор покрывает интерфейсы/адреса, маршруты/rules, neighbours, listeners/connections, DNS и capture. Команды запускают в namespace приложения и для правильного семейства; snapshots фиксируют с временем.

   **Пример:**

   ```bash
   # Linux, выполнять в сетевом окружении приложения:
   ip -brief address
   ip route show
   ip -6 route show
   ip rule show
   ip neigh show
   ss -lntup
   getent ahosts example.com
   # Точечный capture требует прав:
   tcpdump -ni any -c 30 'host 192.0.2.10 and tcp port 443'
   ```

   **Типичная ошибка:** Собирать только вывод ping и не указывать destination port/протокол.

   **Источник:** [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

518. Какие пакеты захватывать в tcpdump при проблеме с DHCP?

   **Ответ:** Для DHCPv4 — UDP/67 и UDP/68 на клиентском сегменте и при необходимости пути relay↔server. Сопоставляют xid, client identifier, giaddr и тип сообщения. DHCPv6 требует другого фильтра.

   **Пример:**

   ```bash
   tcpdump -ni eth0 -c 40 -vvv 'udp port 67 or udp port 68'
   ```

   **Типичная ошибка:** Ожидать DORA в capture, начатом после перехода клиента в BOUND.

   **Источник:** [RFC 2131: DHCP](https://www.rfc-editor.org/rfc/rfc2131); [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

519. Какие пакеты захватывать при проблеме с DNS?

   **Ответ:** Для обычного DNS — UDP и TCP/53, включая loopback до локального stub. Смотрят name/type, ID, RCODE, TC, retries и времена. Для DoT/DoH нужны соответствующие endpoints и resolver/application logs.

   **Пример:**

   ```bash
   tcpdump -ni any -c 30 'udp port 53 or tcp port 53'
   ```

   **Типичная ошибка:** Исключать TCP и пропускать причину отказа после truncation.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [RFC 1034: DNS](https://www.rfc-editor.org/rfc/rfc1034).

520. Какие пакеты захватывать при проблеме с ARP?

   **Ответ:** ARP capture на правильном L2-интерфейсе; для анализа MAC полезен Ethernet header. Проверяют target next hop, requests/replies, конфликты и объявления. IPv6 neighbour issues исследуют через ICMPv6, не ARP.

   **Пример:**

   ```bash
   tcpdump -eni eth0 -c 20 arp
   ```

   **Типичная ошибка:** Снимать ARP только на WAN, когда проблема между клиентом и LAN gateway.

   **Источник:** [libpcap: pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html); [Linux man-pages: arp(7)](https://man7.org/linux/man-pages/man7/arp.7.html).


### C/C++ / Linux / sockets
521. Какие системные вызовы чаще всего участвуют в сетевом приложении?

   **Ответ:** socket, bind, listen, accept, connect, send/recv и варианты read/write, sendmsg/recvmsg, close; для неблокирующего I/O — poll/epoll и управление flags/options. Разрешение имён обычно выполняется библиотечным getaddrinfo, а не отдельным одноимённым syscall.

   **Типичная ошибка:** Считать каждый сетевой библиотечный вызов отдельным системным вызовом ядра.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

522. Как `socket`, `bind`, `listen`, `accept`, `connect`, `send`, `recv` соотносятся с Core Networking?

   **Ответ:** socket создаёт endpoint; bind задаёт локальную привязку; listen/accept обслуживают входящие TCP connections; connect выбирает peer и для TCP запускает handshake; send/recv передают данные. Под ними работают routing, neighbour resolution и transport state.

   **Типичная ошибка:** Считать accept созданием listening socket или ожидать TCP handshake от UDP connect.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

523. Почему важно понимать route selection при `connect()`?

   **Ответ:** Маршрут определяет путь и часто source address, а значит firewall/NAT policy и доступность ответа. При multihoming неправильный source или таблица могут ломать connect даже к правильному IP.

   **Типичная ошибка:** Проверять route get без source/mark/namespace и считать результат тождественным маршруту приложения.

   **Источник:** [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html); [ip-rule(8)](https://man7.org/linux/man-pages/man8/ip-rule.8.html).

524. Как DNS resolution встроен в жизненный цикл клиентского соединения?

   **Ответ:** Разрешение имени даёт список endpoints перед connect; затем выбирают кандидаты и устанавливают transport/TLS. Ошибки/тайминги этих стадий разделяют, а общий deadline включает их все. Повторный lookup не обязателен для каждого запроса по уже открытому connection.

   **Типичная ошибка:** Считать TCP connect timeout ограничением, автоматически покрывающим предшествующий getaddrinfo.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

525. Почему неправильная обработка `getaddrinfo()` часто ломает IPv6?

   **Ответ:** Ошибки — AF_INET вместо AF_UNSPEC, sockaddr_in для любого результата, неверный ai_addrlen, пропуск AAAA и IPv4-only форматирование. Важно брать family/type/protocol/address/length согласованно из одного addrinfo.

   **Типичная ошибка:** Создавать AF_INET socket и передавать ему sockaddr_in6 из другого результата.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html).

526. Как написать клиент, который корректно перебирает адреса из `getaddrinfo()`?

   **Ответ:** Получают список, для каждого кандидата создают соответствующий socket и пробуют connect; неудачный descriptor закрывают, список освобождают. Нужны общий deadline и ограниченные попытки, а для отзывчивого dual stack — Happy Eyeballs. Blocking перебор проще, но может быть медленным.

   **Пример:**

   ```c
   #define _POSIX_C_SOURCE 200112L
   #include <netdb.h>
   #include <sys/socket.h>
   #include <unistd.h>

   // Учебный блокирующий перебор: явного общего deadline здесь нет.
   // Возвращённым fd владеет вызывающая сторона; при ошибке возвращает -1.
   int connect_candidates(const char *host, const char *service) {
       struct addrinfo hints = {0}, *list = NULL;
       hints.ai_family = AF_UNSPEC;
       hints.ai_socktype = SOCK_STREAM;
       if (getaddrinfo(host, service, &hints, &list) != 0) return -1;
       int connected = -1;
       for (const struct addrinfo *p = list; p != NULL; p = p->ai_next) {
           int fd = socket(p->ai_family, p->ai_socktype, p->ai_protocol);
           if (fd == -1) continue;
           if (connect(fd, p->ai_addr, p->ai_addrlen) == 0) {
               connected = fd;
               break;
           }
           close(fd); // Не переиспользуем socket после ошибки connect.
       }
       freeaddrinfo(list);
       return connected;
   }
   ```

   **Типичная ошибка:** Перебирать кандидаты с бесконечным ожиданием каждого и терять весь deadline на первом неработающем адресе.

   **Источник:** [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

527. Почему нужно аккуратно обрабатывать `EINTR`, `EAGAIN`, `EWOULDBLOCK` в сетевом коде?

   **Ответ:** EINTR требует обработки прерывания с учётом операции; EAGAIN/EWOULDBLOCK означают, что сейчас нельзя продолжить без ожидания готовности. После readiness снова проверяют результат. Частичные send/recv сохраняют прогресс; connect имеет отдельную state machine и проверку SO_ERROR.

   **Типичная ошибка:** Крутить busy loop при EAGAIN или повторять send всего буфера после частичного успеха.

   **Источник:** [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html); [Linux man-pages: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html); [Linux man-pages: connect(2)](https://man7.org/linux/man-pages/man2/connect.2.html).

528. Как network byte order влияет на переносимость кода?

   **Ответ:** Числа в сетевом формате имеют заданный порядок байтов независимо от CPU. Преобразования htons/htonl и обратные отделяют host-order арифметику от wire/socket representation. Для нестандартных ширин нужен явный encoding.

   **Типичная ошибка:** Проверять код только на одной архитектуре и считать порядок native integers переносимым.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html).

529. Почему нельзя напрямую сериализовать C struct в сеть без учёта alignment и endianess?

   **Ответ:** В C struct возможны padding, различное выравнивание/размеры полей и host endian. Передача памяти также может раскрыть неинициализированные байты. Сериализуют поля по явному формату и проверяют длины при разборе.

   **Пример:**

   ```c
   #include <stdint.h>

   // Явное кодирование uint32_t в 4 network-order байта без struct padding.
   void encode_u32(uint8_t out[4], uint32_t value) {
       out[0] = (uint8_t)(value >> 24);
       out[1] = (uint8_t)(value >> 16);
       out[2] = (uint8_t)(value >> 8);
       out[3] = (uint8_t)value;
   }
   ```

   **Типичная ошибка:** Считать pragma pack полным решением endian, версионирования и bounds checking.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html); [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource).

530. Что такое endianess и почему оно важно для сетевого программирования?

   **Ответ:** Endianness — порядок байтов многобайтного значения в памяти. В big-endian старший байт идёт первым, в little-endian — младший. Wire protocol задаёт собственный порядок; он не обязан совпадать с CPU.

   **Типичная ошибка:** Путать byte order с порядком битов в строковом IP или внутри отдельного байта.

   **Источник:** [Linux man-pages: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html).

531. Как хранить IP/port в логах так, чтобы анализировать инциденты было проще?

   **Ответ:** Логируют source/destination отдельно, семейство, числовой адрес и порт, scope ID при необходимости, протокол, timestamp и connection/request ID. IPv6 endpoint со слитным портом оформляют `[address]:port`; proxy metadata отделяют от socket peer.

   **Типичная ошибка:** Смешивать DNS reverse name и числовой IP в одном поле, затрудняя корреляцию и добавляя blocking lookup.

   **Источник:** [Linux man-pages: getnameinfo(3)](https://man7.org/linux/man-pages/man3/getnameinfo.3.html); [RFC 7239: Forwarded HTTP Extension](https://www.rfc-editor.org/rfc/rfc7239).

532. Как проектировать C++ abstraction над socket API без потери контроля над low-level деталями?

   **Ответ:** RAII владеет descriptor и закрывает его однократно, move переносит владение, копирование явно запрещено или имеет отдельный контракт. Endpoint хранит family/length; API сохраняет partial I/O, nonblocking semantics, deadlines и native error details.

   **Типичная ошибка:** Оборачивать send в метод, обещающий отправить весь буфер, но возвращающий успех после одного частичного syscall.

   **Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource); [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html).

533. Какие ошибки проектирования чаще всего встречаются в учебных сетевых библиотеках на C++?

   **Ответ:** Неясное владение fd, копируемый owning socket, игнорирование partial I/O/EINTR, blocking DNS в event loop, IPv4-only structs, отсутствие deadlines и неправильное разделение stream messages. Нужны явные контракты и обработка ошибок на каждом этапе.

   **Типичная ошибка:** Считать соответствие числа send и recv границами сообщений TCP.

   **Источник:** [C++ Core Guidelines: resource management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource); [Linux man-pages: send(2)](https://man7.org/linux/man-pages/man2/send.2.html); [Linux man-pages: recv(2)](https://man7.org/linux/man-pages/man2/recv.2.html).

534. Как корректно тестировать сетевой код локально?

   **Ответ:** Loopback покрывает базовые интеграции; namespaces/VM дают разные подсети, routes и NAT. Моделируют fragmentation/read splitting, delays, loss, disconnect, IPv6 и exhaustion. Реальные privileged Linux-сценарии отделяют от переносимых unit tests.

   **Типичная ошибка:** Считать один успешный localhost echo достаточной проверкой production network library.

   **Источник:** [Linux man-pages: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html); [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html); [RFC 8305: Happy Eyeballs Version 2](https://www.rfc-editor.org/rfc/rfc8305).

535. Какие части Core Networking разработчик сетевых сервисов обязан понимать глубоко, а какие достаточно знать обзорно?

   **Ответ:** Глубоко нужны socket semantics, TCP/UDP, адресация, routing/source selection, DNS, deadlines, partial I/O, диагностика и безопасность приложения. Детали OSPF/BGP или аппаратной коммутации зависят от роли; разработчику routing control plane они уже нужны глубоко.

   **Типичная ошибка:** Заучивать названия протоколов без умения проследить реальный пакет от lookup до приложения.

   **Источник:** [Linux man-pages: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html); [Linux man-pages: getaddrinfo(3)](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html); [ip-route(8)](https://man7.org/linux/man-pages/man8/ip-route.8.html).
