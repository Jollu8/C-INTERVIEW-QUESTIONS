## Security — Questions (C/C++ oriented)

### Users & Groups
1. Что такое пользователь в Linux?

   **Ответ:** Учётная запись с числовым UID и атрибутами; ядро проверяет доступ по credentials процесса, а не по текстовому имени.

   **Пример:** `id alice`.

   **Типичная ошибка:** Считать имя пользователя источником полномочий ядра.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

2. Что такое группа в Linux?

   **Ответ:** Идентичность с числовым GID, позволяющая назначать общие права нескольким пользователям.

   **Пример:** `getent group developers`.

   **Типичная ошибка:** Считать группу отдельным изолированным процессным контейнером.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

3. Зачем нужна модель users/groups?

   **Ответ:** Для разграничения доступа, изоляции сервисов и совместного использования ресурсов без общих паролей.

   **Пример:** Сервис получает отдельный UID.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

4. Чем user ownership отличается от group ownership?

   **Ответ:** Файл имеет одного owner UID и один owning GID; права owner и group выбираются по credentials обращающегося процесса.

   **Пример:** `ls -ln file`.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

5. Что такое UID?

   **Ответ:** User ID — числовой идентификатор пользователя, хранящийся в credentials и ownership файлов.

   **Пример:** `id -u`.

   **Типичная ошибка:** Переименование пользователя само по себе не меняет UID файлов.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

6. Что такое GID?

   **Ответ:** Group ID — числовой идентификатор группы; у процесса есть основной и дополнительные GID.

   **Пример:** `id -g` и `id -G`.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

7. Почему root обычно имеет UID 0?

   **Ответ:** UID 0 исторически определяет суперпользователя Unix; полномочия связаны с числом, а не именем root.

   **Пример:** Другой аккаунт с UID 0 тоже привилегирован.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

8. Что означает UID 0 для системы?

   **Ответ:** Это привилегированная идентичность; в Linux реальные возможности дополнительно зависят от capabilities, user namespace и LSM.

   **Пример:** Root внутри контейнера не равен root хоста.

   **Типичная ошибка:** Считать UID 0 достаточным для обхода SELinux/AppArmor.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

9. Чем обычный пользователь отличается от root?

   **Ответ:** Обычный пользователь ограничен DAC; root обычно имеет широкие capabilities, но тоже может быть ограничен LSM и namespaces.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

10. Что такое effective UID?

   **Ответ:** Effective UID определяет многие проверки полномочий; файловый доступ в Linux использует fsuid, обычно совпадающий с euid.

   **Пример:** `geteuid()`.

   **Типичная ошибка:** Использовать getuid для проверки именно текущих effective-полномочий.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

11. Что такое real UID?

   **Ответ:** Real UID отражает исходную идентичность процесса и используется некоторыми API и проверками, например access().

   **Пример:** `getuid()`.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

12. Что такое saved UID?

   **Ответ:** Сохранённый UID позволяет при разрешённых переходах восстановить прежний effective UID; особенно важен для setuid-программ.

   **Пример:** `getresuid()`.

   **Типичная ошибка:** Сбрасывать только euid, считая повышение обратно невозможным.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

13. Зачем различать real/effective UID?

   **Ответ:** Чтобы отделять инициатора запуска от временных полномочий выполняемой программы.

   **Пример:** Setuid-программа может иметь ruid пользователя и euid владельца файла.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

14. Что такое supplementary groups?

   **Ответ:** Дополнительные группы процесса, учитываемые при групповых проверках доступа.

   **Пример:** `getgroups()`.

   **Типичная ошибка:** Изменение /etc/group не обновляет уже запущенные процессы автоматически.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

15. Как группы влияют на доступ к файлам?

   **Ответ:** Сопоставляются owning GID и дополнительные группы процесса; затем применяются mode/ACL и другие ограничения.

   **Пример:** Нужен также search-доступ к каталогам пути.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

16. Что такое primary group?

   **Ответ:** Основная группа учётной записи; при входе обычно становится real/effective GID процесса.

   **Пример:** Третье числовое поле записи passwd после UID — GID.

   **Типичная ошибка:** Считать primary group единственной группой, участвующей в доступе.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

17. Чем primary group отличается от supplementary group?

   **Ответ:** Primary group задаёт основной GID; supplementary groups дополняют набор членств для проверок доступа.

   **Пример:** Владение новой группой файла также зависит от SGID каталога.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

18. Как процесс получает UID и GID?

   **Ответ:** Наследует их от родителя; login/sudo и другие привилегированные механизмы могут настроить UID/GID и supplementary groups.

   **Типичная ошибка:** Доверять переменным окружения вместо credentials ядра.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

19. Наследуются ли credentials при fork()?

   **Ответ:** Да, дочерний процесс наследует real/effective/saved IDs, supplementary groups и другие credentials.

   **Пример:** Сам fork не повышает права.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

20. Что происходит с credentials при exec()?

   **Ответ:** Обычно IDs сохраняются; SUID/SGID и file capabilities могут изменить полномочия, если это не запрещено nosuid, no_new_privs и другими условиями.

   **Типичная ошибка:** Ожидать изменения прав от SUID, когда действует no_new_privs или nosuid.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

21. Как process credentials влияют на open()?

   **Ответ:** При open проверяются путь, DAC/ACL и LSM; в Linux файловые проверки используют fsuid/fsgid и группы.

   **Пример:** Права могут измениться после открытия, но FD обычно остаётся действующим.

   **Типичная ошибка:** Проверять только permissions конечного файла, игнорируя search у родителей.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

22. Как credentials влияют на bind() к privileged port?

   **Ответ:** Для защищённых портов проверяется CAP_NET_BIND_SERVICE в соответствующем user namespace; порог зависит от ip_unprivileged_port_start.

   **Пример:** Запускать весь сервис root только ради bind.

   **Типичная ошибка:** Выдавать CAP_NET_ADMIN ради обычного bind низкого порта.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

23. Что такое privileged port?

   **Ответ:** Порт ниже настроенного порога непривилегированных портов; исторически в Unix — ниже 1024.

   **Пример:** Порог в контейнере может отличаться.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

24. Почему для портов ниже 1024 обычно нужны привилегии?

   **Ответ:** Исторически это ограничивало запуск доверенных системных служб; Linux допускает capabilities и настройку порога.

   **Пример:** Не использовать номер порта как доказательство доверия к сервису.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

25. Что такое least privilege?

   **Ответ:** Предоставлять только необходимые права на минимальное время и минимальный набор ресурсов.

   **Пример:** Read-only доступ к данным вместо полного root.

   **Типичная ошибка:** Сохранить root на весь runtime ради одной операции startup.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

26. Почему сервисы не стоит запускать от root?

   **Ответ:** Ошибка обработки запроса может дать атакующему все полномочия сервиса; отдельный UID и ограничения уменьшают ущерб.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

27. Что такое privilege dropping?

   **Ответ:** Отказ от избыточных credentials/capabilities после подготовки ресурсов.

   **Пример:** Сначала supplementary groups и GID, затем UID; проверять каждый результат.

   **Типичная ошибка:** Игнорировать ошибки setgroups/setgid/setuid.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

28. Когда процессу нужно сначала стартовать от root, а потом сбросить права?

   **Ответ:** Когда требуются привилегированные подготовительные действия, например доступ к устройству; часто их можно вынести в supervisor или capability.

   **Пример:** Не разбирать недоверенные запросы до сброса прав.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

29. Как process capabilities связаны с моделью прав?

   **Ответ:** Capabilities разбивают полномочия суперпользователя на отдельные права.

   **Пример:** CAP_NET_BIND_SERVICE вместо полного набора root capabilities.

   **Типичная ошибка:** Выдавать CAP_SYS_ADMIN как универсальное решение узкого permission denial.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

30. Что такое daemon user?

   **Ответ:** Специальная учётная запись для фонового сервиса, обычно без интерактивного входа.

   **Пример:** `getent passwd www-data`.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

31. Зачем выделять отдельного пользователя под сервис?

   **Ответ:** Чтобы разделить файлы, процессы и последствия компрометации разных служб.

   **Пример:** Два сервиса с одним UID часто могут вмешиваться друг в друга.

   **Типичная ошибка:** Давать нескольким независимым сервисам один UID без необходимости.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

32. Что такое service account?

   **Ответ:** Учётная запись для автоматизированного сервиса, а не персонального входа человека; ей задают узкие права и способ запуска.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

33. Чем shared account плох с точки зрения безопасности?

   **Ответ:** Труднее установить инициатора действия и отозвать доступ одного человека; компрометация затрагивает всех владельцев общих credentials.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

34. Как посмотреть текущего пользователя в shell?

   **Ответ:** `whoami` показывает имя effective UID; `id` выводит подробные credentials.

   **Пример:** `$USER` — переменная окружения, а не надёжная проверка.

   **Типичная ошибка:** Использовать $USER как достоверную security identity.

   **Источник:** [man7: id(1)](https://man7.org/linux/man-pages/man1/id.1.html)

35. Как посмотреть UID/GID пользователя?

   **Ответ:** `id username`; для текущего процесса — `id`.

   **Пример:**

   ```bash
   id
   id alice
   getent passwd alice
   getent group developers
   ```

   **Источник:** [man7: id(1)](https://man7.org/linux/man-pages/man1/id.1.html)

36. Как посмотреть группы пользователя?

   **Ответ:** `groups username` либо `id -nG username`.

   **Источник:** [man7: groups(1)](https://man7.org/linux/man-pages/man1/groups.1.html)

37. Что показывает команда `id`?

   **Ответ:** UID, основной GID и дополнительные группы; может отображать real/effective IDs при их различии.

   **Пример:** `id`.

   **Источник:** [man7: id(1)](https://man7.org/linux/man-pages/man1/id.1.html)

38. Что показывает команда `groups`?

   **Ответ:** Имена групп пользователя или текущего процесса; актуальность зависит от способа запроса и уже установленных credentials.

   **Источник:** [man7: groups(1)](https://man7.org/linux/man-pages/man1/groups.1.html)

39. Что делает `whoami`?

   **Ответ:** Имя пользователя, соответствующее effective UID процесса.

   **Пример:** `sudo whoami` обычно выведет root.

   **Источник:** [man7: whoami(1)](https://man7.org/linux/man-pages/man1/whoami.1.html)

40. Почему знание users/groups важно для C/C++ backend/system developer?

   **Ответ:** Чтобы корректно диагностировать EACCES, безопасно запускать демоны и сбрасывать права без возможности восстановления лишних полномочий.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

---

### /etc/passwd
41. Что такое `/etc/passwd`?

   **Ответ:** Локальная текстовая база учётных записей; пароли в современных системах обычно вынесены в shadow.

   **Пример:** `getent passwd alice`.

   **Типичная ошибка:** Читать пароль из passwd, ожидая plaintext.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

42. Зачем нужен `/etc/passwd`?

   **Ответ:** Для сопоставления имён и UID и хранения атрибутов локального аккаунта.

   **Пример:** NSS может добавлять внешние источники.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

43. Какие данные хранит `/etc/passwd`?

   **Ответ:** Имя, password marker, UID, GID, GECOS, home и shell; поля разделены двоеточиями.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

44. Почему `/etc/passwd` обычно world-readable?

   **Ответ:** Многим программам нужны имена, UID и home; секретные password hashes хранятся отдельно с ограниченным доступом.

   **Пример:** Делать passwd доступным на запись всем.

   **Типичная ошибка:** Закрывать passwd от чтения, ломая обычный user lookup.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

45. Что означает каждая колонка в `/etc/passwd`?

   **Ответ:** Формат: `name:password:UID:GID:GECOS:home:shell`.

   **Пример:** `app:x:1001:1001:Service:/var/lib/app:/usr/sbin/nologin`.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

46. Где хранится username?

   **Ответ:** В первом поле строки, перед первым двоеточием.

   **Пример:** Для устойчивого lookup лучше getpwnam, а не ручной разбор.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

47. Где хранится UID в `/etc/passwd`?

   **Ответ:** В третьем поле; второе занимает password marker.

   **Пример:** `getent passwd alice`.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

48. Где хранится GID в `/etc/passwd`?

   **Ответ:** В четвёртом поле — идентификатор основной группы; дополнительные группы перечисляются отдельно.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

49. Что означает поле gecos/comment?

   **Ответ:** Информационный комментарий, часто полное имя и контакты; не влияет на права ядра.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

50. Что означает home directory в `/etc/passwd`?

   **Ответ:** Путь домашнего каталога; наличие записи не гарантирует, что каталог существует и доступен.

   **Типичная ошибка:** Считать запись home гарантией существования и безопасных прав каталога.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

51. Что означает login shell в `/etc/passwd`?

   **Ответ:** Программа интерактивного входа; обычно shell, но может быть nologin или false.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

52. Почему у некоторых системных пользователей shell может быть `/sbin/nologin` или `/bin/false`?

   **Ответ:** Чтобы ограничить интерактивный вход служебного аккаунта; это не останавливает уже работающие сервисы и все способы доступа.

   **Пример:** Считать nologin полной блокировкой учётной записи.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

53. Где historically хранился пароль пользователя?

   **Ответ:** Исторически password hash размещался во втором поле passwd; современные локальные схемы обычно используют shadow.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

54. Почему пароли вынесли из `/etc/passwd`?

   **Ответ:** Чтобы обычным пользователям не были доступны hashes для offline-подбора, сохранив публичный lookup имён и UID.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

55. Что означает `x` во втором поле `/etc/passwd`?

   **Ответ:** Маркер, что password information ожидается в shadow; сама буква не является hash.

   **Типичная ошибка:** Считать x признаком пустого пароля.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

56. Что такое системные пользователи?

   **Ответ:** Аккаунты для системных компонентов и демонов, обычно без обычного пользовательского входа.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

57. Чем системные пользователи отличаются от обычных?

   **Ответ:** Назначением, политикой входа и диапазоном UID, который зависит от дистрибутива; ядро не имеет отдельного типа «system user».

   **Типичная ошибка:** Хардкодить диапазон системных UID как одинаковый для всех дистрибутивов.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

58. Зачем сервисам отдельные записи в `/etc/passwd`?

   **Ответ:** Для отдельной идентичности процесса, владельца данных и управляемых прав на ресурсы.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

59. Что произойдет, если запись пользователя удалить из `/etc/passwd`?

   **Ответ:** Запись исчезнет из локального lookup, но процессы и файлы с этим числовым UID останутся.

   **Пример:** Сначала учитывать данные и переиспользование UID.

   **Типичная ошибка:** Считать удаление имени мгновенным отзывом полномочий работающего процесса.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

60. Что произойдет, если UID у двух пользователей одинаковый?

   **Ответ:** Ядро рассматривает их как одну пользовательскую идентичность для большинства UID-проверок.

   **Пример:** Разные имена не разделяют права.

   **Типичная ошибка:** Считать разные имена с общим UID независимыми аккаунтами.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

61. Почему дублирующийся UID опасен?

   **Ответ:** Они получают доступ к ресурсам одного UID и нарушают персональный аудит; повтор UID 0 особенно критичен.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

62. Как `/etc/passwd` участвует в name resolution user ↔ UID?

   **Ответ:** NSS files provider читает passwd и связывает имя с UID и атрибутами; обратный поиск работает аналогично.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

63. Как libc получает информацию о пользователе?

   **Ответ:** Через NSS API, например getpwnam/getpwuid и их `_r` варианты.

   **Пример:** Не предполагать, что источник всегда локальный файл.

   **Источник:** [man7: getpwnam(3)](https://man7.org/linux/man-pages/man3/getpwnam.3.html)

64. Что делает `getpwnam()`?

   **Ответ:** Ищет passwd-запись по имени и возвращает struct passwd; NULL означает отсутствие или ошибку, уточняемую по errno.

   **Типичная ошибка:** Хранить возвращённый статический буфер между другими getpw-вызовами в многопоточном коде.

   **Источник:** [man7: getpwnam(3)](https://man7.org/linux/man-pages/man3/getpwnam.3.html)

65. Что делает `getpwuid()`?

   **Ответ:** Ищет passwd-запись по числовому UID.

   **Пример:** Для многопоточного кода удобнее getpwuid_r с собственным буфером.

   **Типичная ошибка:** Считать неизвестный UID доказательством отсутствия действующих прав у процесса.

   **Источник:** [man7: getpwnam(3)](https://man7.org/linux/man-pages/man3/getpwnam.3.html)

66. Что такое NSS в контексте пользователей?

   **Ответ:** Name Service Switch — механизм выбора источников баз passwd/group/hosts и других через конфигурацию.

   **Источник:** [man7: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html)

67. Как `/etc/nsswitch.conf` влияет на lookup пользователей?

   **Ответ:** Строка `passwd:` задаёт порядок и обработку результатов providers, например `files sss`.

   **Типичная ошибка:** Парсить только passwd и игнорировать настроенный NSS.

   **Источник:** [man7: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html)

68. Может ли пользователь существовать не только в `/etc/passwd`?

   **Ответ:** Да, запись может предоставляться LDAP, SSSD, NIS или другим NSS provider.

   **Пример:** Проверять через getent, а не только cat /etc/passwd.

   **Источник:** [man7: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html)

69. Как LDAP/SSSD связаны с этой темой на базовом уровне?

   **Ответ:** LDAP хранит каталог, SSSD предоставляет интеграцию идентичности, кеширование и NSS/PAM-интерфейсы по конфигурации.

   **Источник:** [man7: nsswitch.conf(5)](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html)

70. Как посмотреть запись пользователя в `/etc/passwd`?

   **Ответ:** `getent passwd username` показывает запись NSS; только локальную запись ищут непосредственно в `/etc/passwd`.

   **Пример:**

   ```bash
   getent passwd alice
   # NSS может вернуть пользователя из SSSD/LDAP,
   # даже если его нет непосредственно в /etc/passwd.
   ```

   **Типичная ошибка:** Раскрывать лишние персональные поля GECOS в публичной диагностике.

   **Источник:** [man7: getent(1)](https://man7.org/linux/man-pages/man1/getent.1.html)

71. Какие риски у неправильных прав на `/etc/passwd`?

   **Ответ:** Возможность записи посторонним позволяет менять IDs, shell и привилегированные аккаунты; повреждение формата ломает lookup.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

72. Почему повреждение `/etc/passwd` критично для системы?

   **Ответ:** Вход, запуск служб и интерпретация ownership зависят от корректных записей и согласованности UID/GID.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

73. Можно ли вручную редактировать `/etc/passwd`?

   **Ответ:** Технически да, но штатные useradd/usermod и vipw уменьшают риск гонок и ошибок формата.

   **Пример:** Не применять массовые текстовые замены без проверки.

   **Типичная ошибка:** Редактировать базу параллельно с usermod без блокировки.

   **Источник:** [man7: vipw(8)](https://man7.org/linux/man-pages/man8/vipw.8.html)

74. Почему для этого обычно используют `vipw`?

   **Ответ:** Vipw блокирует базу на время редактирования и помогает избежать параллельных несовместимых изменений.

   **Пример:** Это не заменяет проверку смысла UID/GID.

   **Источник:** [man7: vipw(8)](https://man7.org/linux/man-pages/man8/vipw.8.html)

75. Почему понимание `/etc/passwd` полезно системному программисту?

   **Ответ:** Чтобы получать credentials через корректные API и понимать, почему имя аккаунта и числовая идентичность — разные вещи.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

---

### /etc/shadow
76. Что такое `/etc/shadow`?

   **Ответ:** Ограниченно доступная локальная база password hashes и сроков действия паролей/аккаунтов.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

77. Зачем нужен `/etc/shadow`?

   **Ответ:** Отделяет секретную password information от общедоступных данных пользователей.

   **Типичная ошибка:** Размещать незашифрованные copies shadow в общедоступных backups.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

78. Почему `/etc/shadow` не должен быть world-readable?

   **Ответ:** Доступный hash позволяет атакующему проверять догадки offline без лимитов login-сервиса.

   **Пример:** Не публиковать shadow в логах и backup без защиты.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

79. Какие данные хранятся в `/etc/shadow`?

   **Ответ:** Login name, hash/lock marker, день последней смены, min/max age, warning, inactivity, account expiration и reserved field.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

80. Где хранится hash пароля?

   **Ответ:** Во втором поле строки shadow; формат обычно включает идентификатор схемы, соль и результат password hashing.

   **Типичная ошибка:** Перепутать lock marker с допустимым hash и самостоятельно обрабатывать все варианты.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

81. Хранятся ли в `/etc/shadow` plaintext пароли?

   **Ответ:** Нет, хранятся hashes/verifiers или специальные markers; пустое поле может допускать passwordless login в зависимости от политики.

   **Типичная ошибка:** Считать пустое поле безопасным способом заблокировать пароль.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

82. Что такое password hash?

   **Ответ:** Односторонний результат специализированной функции проверки пароля с солью и параметрами затрат.

   **Пример:** Не заменять password hashing обычным быстрым SHA-256.

   **Источник:** [man7: crypt(3)](https://man7.org/linux/man-pages/man3/crypt.3.html)

83. Чем hash отличается от encryption?

   **Ответ:** Шифрование обратимо при наличии ключа; password hash предназначен для проверки кандидата без восстановления исходного пароля.

   **Источник:** [man7: crypt(3)](https://man7.org/linux/man-pages/man3/crypt.3.html)

84. Что означают дополнительные поля про aging в `/etc/shadow`?

   **Ответ:** Определяют последнюю смену, минимальный/максимальный срок, предупреждение, inactivity и срок жизни аккаунта.

   **Пример:** Единицы и начало отсчёта определяет формат shadow.

   **Типичная ошибка:** Смешивать дни с Unix seconds при ручной обработке aging.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

85. Что такое password aging?

   **Ответ:** Политика сроков действия пароля, проверки необходимости смены и предупреждений пользователю.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

86. Что такое minimum password age?

   **Ответ:** Минимальное число дней до разрешённой следующей смены пароля.

   **Пример:** Слишком большое значение мешает срочной самостоятельной смене.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

87. Что такое maximum password age?

   **Ответ:** Число дней после последней смены, по истечении которых политика требует обновить пароль.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

88. Что такое warning period?

   **Ответ:** Число дней до истечения пароля, когда пользователь получает предупреждения при поддерживаемом входе.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

89. Что означает locked password в `/etc/shadow`?

   **Ответ:** Password verifier помечен недействительным для обычной парольной проверки; другие способы входа могут оставаться доступны.

   **Пример:** Блокировать пароль и считать все SSH-ключи отозванными.

   **Типичная ошибка:** Предполагать, что passwd -l отключает вход по SSH public key.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

90. Как выглядит заблокированная password entry?

   **Ответ:** Обычно `!` перед сохранённым hash либо marker вроде `!`/`*`, который не является допустимым hash.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

91. Что означает `!` или `*` в password field?

   **Ответ:** Обычная UNIX password authentication с таким verifier не проходит; блокировка аккаунта целиком определяется отдельно.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

92. Как PAM связан с `/etc/shadow`?

   **Ответ:** PAM задаёт цепочку authentication/account modules; pam_unix может проверять локальный hash и aging через необходимые helpers.

   **Типичная ошибка:** Обходить PAM account checks после успешной проверки только password hash.

   **Источник:** [man7: pam(8)](https://man7.org/linux/man-pages/man8/pam.8.html)

93. Что происходит при login с точки зрения проверки пароля?

   **Ответ:** Login-программа вызывает настроенную аутентификацию, проверяет credentials и account policy, затем создаёт сессию с нужными IDs.

   **Типичная ошибка:** Считать authentication единственной проверкой перед открытием сессии.

   **Источник:** [man7: pam_unix(8)](https://man7.org/linux/man-pages/man8/pam_unix.8.html)

94. Почему доступ к `/etc/shadow` требует повышенных привилегий?

   **Ответ:** Hash и aging считаются чувствительными данными; доступ предоставляется доверенным компонентам по политике системы.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

95. Какой риск утечки `/etc/shadow`?

   **Ответ:** Возможен offline-подбор, раскрытие слабых и повторно используемых паролей и последующая компрометация аккаунтов.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

96. Почему сильный hash алгоритм важен?

   **Ответ:** Дорогой адаптивный алгоритм повышает стоимость каждой попытки; параметры нужно подбирать по возможностям системы.

   **Типичная ошибка:** Использовать быстрый общий hash вместо password hashing с cost parameters.

   **Источник:** [man7: crypt(3)](https://man7.org/linux/man-pages/man3/crypt.3.html)

97. Чем salted hash лучше простого hash?

   **Ответ:** Случайная соль делает одинаковые пароли различимыми и затрудняет готовые таблицы и совместный подбор многих аккаунтов.

   **Типичная ошибка:** Считать соль секретом, который заменяет сильный пароль.

   **Источник:** [man7: crypt(3)](https://man7.org/linux/man-pages/man3/crypt.3.html)

98. Что такое password cracking offline?

   **Ответ:** Проверка кандидатов на собственной копии hashes без обращения к серверу аутентификации.

   **Пример:** Сетевой rate limit от такого перебора не защищает.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

99. Почему компрометация `/etc/shadow` все равно опасна, даже без plaintext?

   **Ответ:** Слабые пароли остаются подбираемыми; hashes и metadata дают атакующему материал для дальнейших атак.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

100. Как посмотреть, есть ли у пользователя shadow entry?

   **Ответ:** Обычно достаточно `sudo passwd -S username` для статуса; `getent shadow username` выдаёт чувствительный verifier и требует особой осторожности.

   **Пример:**

   ```bash
   sudo passwd -S alice
   sudo chage -l alice
   # Не выводим password hash в диагностический лог.
   ```

   **Типичная ошибка:** Печатать всю shadow entry ради проверки наличия записи.

   **Источник:** [man7: passwd(1)](https://man7.org/linux/man-pages/man1/passwd.1.html)

101. Как `/etc/passwd` и `/etc/shadow` связаны между собой?

   **Ответ:** Связаны по login name: passwd хранит публичные атрибуты, shadow — password information.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

102. Почему username должен совпадать в обеих таблицах?

   **Ответ:** Локальные authentication tools ищут password record по имени; несовпадение нарушает ожидаемую связь записей.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

103. Что произойдет, если shadow entry отсутствует?

   **Ответ:** Парольный вход может не сработать при схеме с `x`; итог зависит от PAM/NSS и возможных других способов authentication.

   **Типичная ошибка:** Считать fallback на пустой пароль правильной обработкой отсутствующей записи.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

104. Как системные аккаунты могут быть представлены в `/etc/shadow`?

   **Ответ:** Часто имеют locked marker вместо рабочего password hash; служба запускается supervisor без парольного входа.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

105. Почему приложению на C/C++ обычно не нужно напрямую читать `/etc/shadow`?

   **Ответ:** Обычному сервису нужна проверка через PAM или внешний identity provider, а не полномочия для чтения системных hashes.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

106. Почему прямой доступ к `/etc/shadow` — чувствительная операция?

   **Ответ:** Программа получает доступ к verifier всех локальных аккаунтов, увеличивая последствия утечки памяти, логирования или компрометации.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

107. Какие API вместо этого обычно используют?

   **Ответ:** Для локальной authentication — PAM; для внешней — поддерживаемый API identity provider, без собственной реализации проверки shadow.

   **Типичная ошибка:** Писать собственную PAM-подобную логику без обработки account expiration.

   **Источник:** [man7: pam(8)](https://man7.org/linux/man-pages/man8/pam.8.html)

108. Как root может менять пароль пользователя?

   **Ответ:** Штатной утилитой `passwd username`; она корректно обновляет локальную базу и применяет соответствующую политику.

   **Типичная ошибка:** Передавать plaintext пароль аргументом команды и оставлять его в history/process listing.

   **Источник:** [man7: passwd(1)](https://man7.org/linux/man-pages/man1/passwd.1.html)

109. Почему shadow-механизм улучшает безопасность Unix-like систем?

   **Ответ:** Сокращает круг процессов, которым доступны password verifiers, сохраняя открытыми несекретные атрибуты.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

110. Какие типичные ошибки администрирования связаны с `/etc/shadow`?

   **Ответ:** Неверные права, утечка backup, ручная порча полей и смешивание блокировки пароля с блокировкой всех способов входа.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

---

### sudo
111. Что такое `sudo`?

   **Ответ:** Программа запуска команды с полномочиями другого пользователя по заданной политике; по умолчанию target обычно root.

   **Типичная ошибка:** Считать sudo синонимом неограниченного root-доступа в любой конфигурации.

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

112. Зачем нужен `sudo`?

   **Ответ:** Для ограниченного делегирования административных операций с authentication и аудитом.

   **Пример:** `sudo -l`.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

113. Чем `sudo` лучше прямого логина под root?

   **Ответ:** Позволяет связывать действия с индивидуальным аккаунтом и выдавать отдельные команды вместо общего root-пароля.

   **Типичная ошибка:** Раздать sudo root-shell всем и ожидать полного покомандного аудита без I/O logging.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

114. Что такое principle of least privilege в контексте `sudo`?

   **Ответ:** Разрешать только необходимую команду, target user, аргументы и окружение, избегая общего root-shell.

   **Пример:** Разрешённая команда не должна загружать пользовательский код.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

115. Как `sudo` определяет, кто может выполнять команды?

   **Ответ:** Policy plugin, обычно sudoers, сопоставляет пользователя, host, runas identity, команду и её условия.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

116. Где обычно хранится конфигурация `sudo`?

   **Ответ:** Обычно `/etc/sudoers` и включённые файлы `/etc/sudoers.d/`; точные пути задаются сборкой/конфигурацией.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

117. Что такое `/etc/sudoers`?

   **Ответ:** Основной файл sudoers policy: кто, на каком хосте, от чьего имени и какие команды может запускать.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

118. Почему `/etc/sudoers` не рекомендуют редактировать обычным редактором?

   **Ответ:** Синтаксическая ошибка может лишить администраторов sudo-доступа; обычный редактор также не обеспечивает нужную блокировку.

   **Типичная ошибка:** Сохранять непроверенный sudoers и закрывать последнюю административную сессию.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

119. Что делает `visudo`?

   **Ответ:** Открывает sudoers безопаснее с блокировкой и проверкой синтаксиса; `visudo -c` проверяет конфигурацию.

   **Пример:**

   ```bash
   sudo visudo -c
   # Проверка синтаксиса основной policy и подключённых файлов.
   ```

   **Источник:** [man7: visudo(8)](https://man7.org/linux/man-pages/man8/visudo.8.html)

120. Что такое sudoers policy?

   **Ответ:** Набор правил разрешения команд и настроек authentication, environment, logging и target credentials.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

121. Как `sudo` проверяет пароль пользователя?

   **Ответ:** Обычно через PAM либо настроенный authentication backend; политика может требовать иной пароль или не требовать его вовсе.

   **Типичная ошибка:** Хардкодить предположение, что sudo всегда проверяет локальный password hash.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

122. Чей пароль обычно спрашивает `sudo`?

   **Ответ:** Обычно вызывающего пользователя; rootpw, targetpw, runaspw и backend могут изменить поведение.

   **Пример:** Не считать это всегда паролем root.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

123. Что такое timestamp cache у `sudo`?

   **Ответ:** Временное подтверждение недавней аутентификации, часто привязанное к терминалу/контексту; не кеш результата разрешения всех команд.

   **Типичная ошибка:** Считать timestamp cache разрешением на любую команду.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

124. Почему `sudo` иногда не спрашивает пароль повторно?

   **Ответ:** Для подходящей сессии действует timestamp timeout; также возможны NOPASSWD и другие правила policy.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

125. Что делает `sudo -k`?

   **Ответ:** Инвалидирует текущий timestamp authentication cache, чтобы следующая подходящая команда вновь потребовала проверку.

   **Пример:** `sudo -k` не отзывает существующие root-shell.

   **Типичная ошибка:** Ожидать завершения уже запущенных root-процессов после sudo -k.

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

126. Что делает `sudo -l`?

   **Ответ:** Показывает разрешённые и запрещённые пользователю команды по текущей политике.

   **Пример:**

   ```bash
   sudo -l
   sudo -ll
   ```

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

127. Как посмотреть, какие команды пользователь может выполнять через `sudo`?

   **Ответ:** Через `sudo -l`; подробный режим — `sudo -ll` при поддержке версии.

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

128. Можно ли ограничить `sudo` конкретными командами?

   **Ответ:** Да, по абсолютным путям, target identities и аргументам; нужно учитывать семантику программы и доступность её файлов для изменения.

   **Пример:**

   ```sudoers
   # Пример правила, проверяемого через visudo.
   # Без аргументов: deploy может запускать только этот wrapper.
   deploy ALL=(root) /usr/local/sbin/restart-myapp ""
   # Wrapper и все каталоги его пути должны контролироваться root.
   # Он не должен читать команды/config из writable deploy-каталогов.
   ```

   **Типичная ошибка:** Разрешить root-запуск скрипта, который deploy может перезаписать.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

129. Почему разрешать `sudo ALL=(ALL) ALL` — самый широкий вариант?

   **Ответ:** Для пользователя, к которому применено правило, это разрешение любых команд от любых runas users без ограничения программы.

   **Пример:** Это практически полный административный доступ.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

130. Что такое NOPASSWD в sudoers?

   **Ответ:** Tag, отключающий запрос пароля для соответствующих разрешённых команд; прочая policy продолжает применяться.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

131. Когда NOPASSWD может быть оправдан?

   **Ответ:** Для узкой автоматизированной операции с неизменяемым executable и строго ограниченным поведением.

   **Пример:** Не делегировать через него произвольный shell.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

132. Почему NOPASSWD может быть опасен?

   **Ответ:** Кражи пользовательской сессии достаточно для выполнения разрешённой операции без дополнительной authentication.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

133. Что такое command whitelisting в `sudo`?

   **Ответ:** Явный список допустимых executables и условий запуска вместо разрешения всего подряд.

   **Типичная ошибка:** Не учитывать implicit shell escapes, config и plug-ins разрешённого executable.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

134. Почему опасно давать `sudo` на интерпретаторы вроде `sh`, `python`, `vim`?

   **Ответ:** Они могут исполнять произвольный код, запускать shell или писать системные файлы с target-полномочиями.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

135. Как через seemingly safe command можно эскалировать привилегии?

   **Ответ:** Через shell escape, плагины, пользовательский config, writable executable или небезопасные аргументы.

   **Пример:** Оценивать программу целиком, а не только название команды.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

136. Что такое environment sanitization в `sudo`?

   **Ответ:** Удаление/замена опасных переменных окружения и сохранение только разрешённых policy значений.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

137. Почему `sudo` фильтрует environment variables?

   **Ответ:** Переменные могут менять поиск программ, загрузку библиотек и поведение привилегированной команды.

   **Пример:** Безусловно разрешать sudo -E или все переменные.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

138. Что такое `secure_path`?

   **Ответ:** Настройка sudoers, подставляющая заданный PATH для запускаемых команд по соответствующим правилам.

   **Типичная ошибка:** Указать secure_path с каталогом, доступным пользователю на запись.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

139. Почему PATH важен для безопасности `sudo`?

   **Ответ:** Поиск executable по контролируемому PATH может выбрать подменённую программу; важны также writable directories и абсолютные пути.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

140. Что такое `sudoedit`?

   **Ответ:** Механизм редактирования разрешённых файлов: пользовательский редактор работает без root, а sudo управляет копированием результата.

   **Типичная ошибка:** Разрешить редактирование config, который затем интерпретируется root как код, не оценив последствия.

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

141. Чем `sudoedit` безопаснее прямого редактирования файла от root?

   **Ответ:** Снижает риск root shell escape из редактора; доступ к содержимому разрешённого файла всё равно может давать опасные возможности.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

142. Чем `sudo su` отличается от `sudo -i`?

   **Ответ:** `sudo su` запускает su по политике sudo, затем применяет его режим; `sudo -i` сразу создаёт login environment target user.

   **Пример:** Оба варианта обычно дают широкую интерактивную сессию.

   **Типичная ошибка:** Использовать интерактивный root-shell там, где достаточно одной разрешённой команды.

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

143. Чем `su` отличается от `sudo`?

   **Ответ:** Su переключает пользователя с authentication по собственной/PAM политике; sudo делегирует запуск конкретной команды по policy.

   **Источник:** [man7: su(1)](https://man7.org/linux/man-pages/man1/su.1.html)

144. Что такое audit trail у `sudo`?

   **Ответ:** Записи о вызывающем пользователе, target identity, команде, времени и исходе; I/O logging требует отдельной настройки.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

145. Почему логирование `sudo` важно?

   **Ответ:** Для расследований, accountability и выявления необычных административных действий.

   **Пример:** Обычный command log не записывает автоматически всё внутри root-shell.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

146. Где обычно логируются sudo-события?

   **Ответ:** В journald, auth.log/secure, syslog либо отдельном журнале/сервере sudo по конфигурации.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

147. Что такое privilege escalation через неправильный sudoers?

   **Ответ:** Правило предоставляет больше поведения, чем задумано: например, root-запуск изменяемого скрипта или команды с shell escape.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

148. Почему wildcard в sudoers может быть опасен?

   **Ответ:** Wildcard может сопоставить неожиданные аргументы и пути; shell и sudoers matching имеют разную семантику.

   **Пример:** Считать `*` ограничением до одного безопасного имени файла.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

149. Как `sudo` влияет на effective UID процесса?

   **Ответ:** Команда получает effective UID target user вместе с настроенными группами и остальными credentials; target не обязательно root.

   **Типичная ошибка:** Считать target всегда root, игнорируя sudo -u и runas rules.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

150. Почему знание `sudo` важно для эксплуатации и защиты C/C++ сервисов?

   **Ответ:** Чтобы безопасно делегировать deploy/restart/debug, не превращая сервисную операцию в неограниченный запуск кода.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

---

### ACL
151. Что такое ACL?

   **Ответ:** Access Control List — расширенные записи доступа к объекту для пользователей и групп помимо базовых owner/group/other.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

152. Зачем ACL нужны, если уже есть rwx-права?

   **Ответ:** Для нескольких конкретных пользователей или групп, которым нужны разные права на один объект.

   **Пример:** Не менять others на rw ради одного сервиса.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

153. Чем ACL отличается от обычной POSIX-модели owner/group/others?

   **Ответ:** Добавляет named user/group entries и маску их эффективных прав; базовые права остаются частью модели ACL.

   **Типичная ошибка:** Считать ACL отдельной «надбавкой», никак не связанной с group mode bits.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

154. Какие проблемы ACL решают?

   **Ответ:** Точечный shared access без смены владельца и создания множества специальных групп.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

155. Что такое POSIX ACL?

   **Ответ:** Распространённая Unix-модель access/default ACL; в Linux основана на проекте стандарта POSIX.1e, который не стал финальным POSIX-стандартом.

   **Типичная ошибка:** Называть POSIX.1e ACL завершённым стандартом POSIX.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

156. На каких ФС ACL обычно поддерживаются?

   **Ответ:** Обычно ext4, XFS и Btrfs; поддержку, mount configuration и семантику сетевой ФС нужно проверять.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

157. Что такое access ACL?

   **Ответ:** ACL, непосредственно определяющая доступ к данному файлу или каталогу.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

158. Что такое default ACL?

   **Ответ:** ACL каталога, используемая как шаблон наследования для новых объектов, а не как разрешение доступа к самому каталогу.

   **Типичная ошибка:** Ожидать, что default ACL сама разрешит доступ к текущему каталогу.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

159. Где default ACL применяется?

   **Ответ:** Только на каталогах, откуда наследуется вновь создаваемыми файлами и подкаталогами.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

160. Как ACL влияет на новые файлы в директории?

   **Ответ:** Новый объект наследует default ACL, ограниченную mode аргументом создания; подкаталоги могут наследовать и default ACL.

   **Типичная ошибка:** Ожидать наследования write, когда приложение создаёт файл с mode 0600.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

161. Что означает user ACL entry?

   **Ответ:** `user::` задаёт права владельца, `user:name:` — named user, ограниченный mask при расширенной ACL.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

162. Что означает group ACL entry?

   **Ответ:** `group::` задаёт owning group, `group:name:` — named group; их effective rights ограничены mask.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

163. Что означает mask в ACL?

   **Ответ:** Верхняя граница прав group class: named users, owning group и named groups; owner и other ею не ограничены.

   **Типичная ошибка:** Забывать о mask при диагностике named-user permissions.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

164. Почему mask важен для effective permissions?

   **Ответ:** Даже запись `user:alice:rwx` даст только `r-x`, если mask равна `r-x`.

   **Пример:** Проверять комментарий effective в getfacl.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

165. Что показывает `getfacl`?

   **Ответ:** ACL объекта, owner/group, mask и effective permissions.

   **Пример:**

   ```bash
   getfacl /srv/shared
   getfacl /srv/shared/data.bin
   ```

   **Источник:** [man7: getfacl(1)](https://man7.org/linux/man-pages/man1/getfacl.1.html)

166. Что делает `setfacl`?

   **Ответ:** Создаёт, изменяет и удаляет ACL entries; обычно автоматически пересчитывает mask, если не указан иной режим.

   **Типичная ошибка:** Не проверять пересчитанную mask после setfacl.

   **Источник:** [man7: setfacl(1)](https://man7.org/linux/man-pages/man1/setfacl.1.html)

167. Как добавить ACL для конкретного пользователя?

   **Ответ:** `setfacl -m u:alice:rw file`; для доступа по пути также нужны права на каталоги.

   **Пример:**

   ```bash
   # Учебный пример: создаём файлы только в собственном temp-каталоге.
   task_acl_demo=$(mktemp -d)
   touch "$task_acl_demo/data"
   # Замените alice существующим пользователем; нужен search-доступ к пути.
   setfacl -m u:alice:rw "$task_acl_demo/data"
   getfacl "$task_acl_demo/data"
   ```

   **Источник:** [man7: setfacl(1)](https://man7.org/linux/man-pages/man1/setfacl.1.html)

168. Как удалить ACL entry?

   **Ответ:** `setfacl -x u:alice file`; `-b` удаляет расширенные access ACL, поэтому это более широкое изменение.

   **Типичная ошибка:** Применить setfacl -b вместо удаления одной named entry.

   **Источник:** [man7: setfacl(1)](https://man7.org/linux/man-pages/man1/setfacl.1.html)

169. Как ACL отображаются в `ls -l`?

   **Ответ:** Обычно знаком `+` после mode bits; подробности читать через getfacl.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

170. Что означает `+` в конце mode bits?

   **Ответ:** Наличие дополнительных ACL entries; точная индикация security attributes может зависеть от ls и платформы.

   **Пример:**

   ```text
   user::rw-
   user:alice:rwx             #effective:r--
   group::r--
   mask::r--
   other::---
   # Alice получает r--: named entry пересекается с mask.
   ```

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

171. Как ACL взаимодействует с chmod?

   **Ответ:** Меняет соответствующие ACL entries; при расширенной ACL group bits соотносятся с mask, а не только group::.

   **Типичная ошибка:** Выполнить chmod g-r и неожиданно убрать effective read у named users.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

172. Может ли chmod изменить effect ACL?

   **Ответ:** Да, изменение group bits может ограничить или расширить effective permissions named entries через mask.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

173. Как ACL взаимодействует с umask?

   **Ответ:** Без default ACL применяется umask; при наличии default ACL наследование ограничивается mode создания, а не простым независимым пересечением с umask.

   **Типичная ошибка:** Механически пересекать default ACL с umask вместо правил наследования mode.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

174. Что произойдет, если и ACL, и обычные права заданы одновременно?

   **Ответ:** Это одна согласованная модель DAC: mode bits отражают часть ACL, а расширенные entries уточняют доступ.

   **Пример:** Плюс ACL не означает обход SELinux.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

175. Как система вычисляет итоговый доступ с учетом ACL?

   **Ответ:** Проверяются owner, затем named user, затем подходящие group entries с mask, иначе other; это не объединение всех классов подряд.

   **Типичная ошибка:** Всегда складывать owner, named user, groups и other permissions в одно объединение.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

176. Какие риски создают ACL с точки зрения аудита доступа?

   **Ответ:** Доступ может быть шире ожидаемого по простому ls; копирование и backup должны сохранять ACL осознанно.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

177. Почему ACL усложняют reasoning о правах?

   **Ответ:** Нужно учитывать named entries, mask, наследование и путь до объекта, а не только девять rwx-битов.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

178. Когда ACL полезны в production?

   **Ответ:** Для точечного доступа нескольких сервисных аккаунтов к shared directories и данным.

   **Типичная ошибка:** Не сохранять ACL в backup, а затем получить другой доступ после восстановления.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

179. Когда ACL лучше не использовать без необходимости?

   **Ответ:** Если owner/group достаточно: избыточные entries усложняют аудит, перенос и предсказуемость прав.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

180. Как ACL могут помочь сервису на C/C++ доступаться к shared data безопасно?

   **Ответ:** Предоставить read/write нужному UID на конкретный каталог/файлы и настроить default ACL для новых данных.

   **Пример:** Не выдавать всему дереву rwx без необходимости.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

---

### SELinux
181. Что такое SELinux?

   **Ответ:** Linux Security Module для обязательного контроля доступа по labels и загруженной политике.

   **Пример:** `getenforce`.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

182. Чем SELinux отличается от обычных Unix permissions?

   **Ответ:** DAC зависит от UID/GID и ownership; SELinux дополнительно проверяет разрешённые действия домена над типом объекта.

   **Типичная ошибка:** Считать корректные rwx достаточным доказательством, что SELinux не мешает.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

183. Что такое MAC (Mandatory Access Control)?

   **Ответ:** Контроль, при котором системная security policy ограничивает доступ независимо от желания владельца объекта.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

184. Чем MAC отличается от DAC (Discretionary Access Control)?

   **Ответ:** При DAC владелец может делегировать доступ в рамках прав; MAC задаёт дополнительные обязательные ограничения централизованно.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

185. Почему DAC недостаточен для hardening системы?

   **Ответ:** Компрометированный процесс получает все DAC-права своего UID; MAC может дополнительно запретить ему доступ к неуместным данным и операциям.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

186. Что такое SELinux policy?

   **Ответ:** Набор правил разрешённых взаимодействий между security contexts, классами объектов и permissions.

   **Пример:** Политика может включать booleans и transitions.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

187. Что такое SELinux context?

   **Ответ:** Security label процесса или объекта, используемая при проверке политики.

   **Пример:** `system_u:object_r:httpd_sys_content_t:s0`.

   **Типичная ошибка:** Смешивать UNIX username и SELinux user.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

188. Из каких частей состоит SELinux context?

   **Ответ:** SELinux user, role, type/domain и, при MLS/MCS, level/range.

   **Пример:** Не путать SELinux user с UNIX username.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

189. Что такое user:role:type:level в SELinux context?

   **Ответ:** User и role задают SELinux identity/роль, type — тип объекта или domain процесса, level — уровень и категории MLS/MCS.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

190. Что такое type enforcement?

   **Ответ:** Разрешение операций главным образом по паре domain процесса и type объекта, с учётом класса и permissions.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

191. Почему type enforcement — основной механизм SELinux?

   **Ответ:** Позволяет задавать предметные ограничения служб без привязки ко всем конкретным UID и именам файлов.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

192. Что такое domain в SELinux?

   **Ответ:** Type, присвоенный процессу и определяющий его набор разрешённых взаимодействий.

   **Пример:** Например, `httpd_t`.

   **Типичная ошибка:** Определять SELinux domain только по имени бинарника без проверки actual context.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

193. Что такое type для файлов?

   **Ответ:** Метка, классифицирующая объект для правил policy.

   **Пример:** `httpd_sys_content_t` для определённого веб-контента.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

194. Как процесс и файл взаимодействуют через policy?

   **Ответ:** Ядро проверяет, разрешена ли domain операция над type объекта и его class, плюс прочие применимые ограничения.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

195. Что такое label на файле?

   **Ответ:** Security context объекта, для файлов часто сохраняемый в extended attribute `security.selinux`.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

196. Как посмотреть SELinux context файла?

   **Ответ:** `ls -Z file` либо `stat -c '%C' file` в поддерживаемом окружении.

   **Пример:**

   ```bash
   getenforce
   ls -Zd /srv/www
   ls -Z /srv/www/index.html
   ps -eZ
   ```

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

197. Как посмотреть SELinux context процесса?

   **Ответ:** `ps -eZ`; для конкретного PID — соответствующая фильтрация ps.

   **Пример:** Проверять domain фактического процесса, а не только unit user.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

198. Что означает режим Enforcing?

   **Ответ:** Политика SELinux применяется: запрещённые операции блокируются и могут журналироваться.

   **Типичная ошибка:** Ожидать, что permissive denials будут блокироваться как enforcing.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

199. Что означает режим Permissive?

   **Ответ:** Запреты SELinux обычно журналируются, но не блокируют операции; другие механизмы доступа всё ещё действуют.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

200. Что означает режим Disabled?

   **Ответ:** SELinux не выполняет обычное enforcement и AVC-аудит; детали выключения и восстановления зависят от загрузки и дистрибутива.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

201. Чем Permissive полезен при диагностике?

   **Ответ:** Позволяет увидеть предполагаемые denials и проверить policy/labels без немедленной блокировки сервиса.

   **Пример:** Не оставлять систему в permissive после диагностики.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

202. Почему Disabled — не то же самое, что Permissive?

   **Ответ:** Permissive сохраняет активную policy и диагностическую информацию; disabled лишает их и может потребовать relabel при включении.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

203. Что такое AVC denial?

   **Ответ:** Отказ SELinux по решению Access Vector Cache/policy, обычно с scontext, tcontext, class и permission в сообщении.

   **Типичная ошибка:** Генерировать широкий allow из каждого AVC без проверки mislabeled files.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

204. Где смотреть SELinux denials?

   **Ответ:** Через auditd, например `ausearch -m AVC,USER_AVC -ts recent`, либо journal/kernel logs по настройке.

   **Пример:**

   ```bash
   sudo ausearch -m AVC,USER_AVC -ts recent
   # Сопоставить scontext/tcontext/class/permission с нужной операцией.
   ```

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

205. Почему сервис может не работать даже при correct Unix permissions?

   **Ответ:** После DAC-проверки SELinux может запретить действие из-за domain/type, port label или другого ограничения.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

206. Как SELinux ограничивает компрометированный процесс?

   **Ответ:** Ограничивает доступ разрешёнными объектами и действиями domain даже при исполнении атакующего кода внутри процесса.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

207. Что такое booleans в SELinux?

   **Ответ:** Настраиваемые переключатели предусмотренных policy вариантов поведения.

   **Пример:** `getsebool -a`.

   **Типичная ошибка:** Включать все booleans без анализа расширяемых разрешений.

   **Источник:** [man7: booleans(8)](https://man7.org/linux/man-pages/man8/booleans.8.html)

208. Когда используют SELinux booleans вместо изменения policy?

   **Ответ:** Когда требуемый доступ уже предусмотрен boolean: это понятнее и поддерживаемее произвольной локальной allow policy.

   **Источник:** [man7: booleans(8)](https://man7.org/linux/man-pages/man8/booleans.8.html)

209. Что такое `restorecon`?

   **Ответ:** Утилита, восстанавливающая labels по заданным file context mappings.

   **Пример:** `restorecon -v /srv/www/index.html`.

   **Типичная ошибка:** Считать restorecon изменением Unix chmod permissions.

   **Источник:** [man7: restorecon(8)](https://man7.org/linux/man-pages/man8/restorecon.8.html)

210. Зачем нужен `restorecon`?

   **Ответ:** После перемещения, восстановления данных или изменения mappings, когда текущий label не соответствует ожидаемому.

   **Источник:** [man7: restorecon(8)](https://man7.org/linux/man-pages/man8/restorecon.8.html)

211. Что делает `chcon`?

   **Ответ:** Меняет текущий security context файла без определения постоянного pathname mapping.

   **Пример:** Изменение может быть отменено restorecon/relabel.

   **Типичная ошибка:** Использовать chcon как постоянную настройку deployment paths.

   **Источник:** [man7: chcon(1)](https://man7.org/linux/man-pages/man1/chcon.1.html)

212. Чем `chcon` отличается от постоянной настройки через policy tools?

   **Ответ:** Chcon меняет label объекта; `semanage fcontext` задаёт постоянное правило, после чего restorecon применяет его.

   **Пример:**

   ```bash
   # Постоянное правило для каталога веб-контента в SELinux-системе:
   sudo semanage fcontext -a -t httpd_sys_content_t '/srv/www(/.*)?'
   sudo restorecon -Rv /srv/www
   # При уже существующем mapping нужен -m, а не повторный -a.
   ```

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

213. Что такое file context mappings?

   **Ответ:** Правила сопоставления путей с ожидаемыми SELinux contexts.

   **Пример:** `semanage fcontext -l`.

   **Типичная ошибка:** Добавить mapping, но не применить restorecon к существующим файлам.

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

214. Как SELinux влияет на binding портов сервисом?

   **Ответ:** Policy может разрешать domain bind только к определённым port types независимо от CAP_NET_BIND_SERVICE.

   **Типичная ошибка:** Выдать root, когда policy запрещает bind нужного port type.

   **Источник:** [man7: semanage-port(8)](https://man7.org/linux/man-pages/man8/semanage-port.8.html)

215. Почему кастомный сервис может уметь слушать порт, но получать deny?

   **Ответ:** Системные привилегии разрешают bind, но SELinux policy может запрещать domain нужный port type.

   **Пример:** Проверить AVC и semanage port.

   **Источник:** [man7: semanage-port(8)](https://man7.org/linux/man-pages/man8/semanage-port.8.html)

216. Что такое `semanage port` на базовом уровне?

   **Ответ:** Управляет mappings protocol/port → SELinux port type.

   **Пример:**

   ```bash
   sudo semanage port -l
   # Сначала найти нужный protocol/port и допустимый тип сервиса;
   # затем решить, нужно ли изменять policy.
   ```

   **Типичная ошибка:** Не добавлять произвольный type без проверки назначения policy.

   **Источник:** [man7: semanage-port(8)](https://man7.org/linux/man-pages/man8/semanage-port.8.html)

217. Какие типичные ошибки разработчиков связаны с SELinux?

   **Ответ:** Неверные file labels, нестандартные пути/порты, забытый restorecon и чрезмерные allow rules вместо исправления причины.

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

218. Почему отключать SELinux “для простоты” — плохая практика?

   **Ответ:** Это снимает ограничения сразу со многих процессов и скрывает первопричину; лучше исправить labels, boolean или узкую policy.

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

219. Как SELinux связан с defense in depth?

   **Ответ:** Даёт дополнительный рубеж поверх DAC, capabilities и изоляции; отказ одного механизма не обязательно даёт полный доступ.

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

220. Почему знание SELinux полезно системному C/C++ разработчику?

   **Ответ:** Чтобы отличать ошибки кода от policy denial и проектировать нужные paths, ports и действия с минимальными permissions.

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

---

### AppArmor
221. Что такое AppArmor?

   **Ответ:** LSM для ограничения программ профилями доступа, преимущественно по путям к файлам и классам операций.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

222. Чем AppArmor концептуально отличается от SELinux?

   **Ответ:** AppArmor в основном path-based, SELinux в основном label-based; оба дополняют DAC и имеют разную policy model.

   **Типичная ошибка:** Считать path-based policy эквивалентом простой проверки строк без VFS resolution.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

223. Что такое профиль AppArmor?

   **Ответ:** Набор разрешений и transitions для определённой программы/контекста исполнения.

   **Пример:** Обычно файлы профилей находятся в `/etc/apparmor.d/`.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

224. Как AppArmor ограничивает процесс?

   **Ответ:** Перехватывает security-sensitive операции через LSM и сопоставляет их активному профилю процесса.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

225. На чем основана модель AppArmor: labels или paths?

   **Ответ:** Основная файловая модель — paths; кроме файлов есть правила для capabilities, network и других классов.

   **Типичная ошибка:** Считать AppArmor только списком файлов и игнорировать capabilities и exec rules.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

226. Почему path-based подход AppArmor проще в понимании?

   **Ответ:** Пути узнаваемы администратору и напрямую соответствуют расположению файлов приложения.

   **Пример:** Переезд данных требует проверки профиля.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

227. Какие есть режимы у AppArmor?

   **Ответ:** Основные режимы — enforce и complain; профиль также может быть не загружен, а процесс — unconfined.

   **Типичная ошибка:** Считать unconfined то же самое, что complain загруженного профиля.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

228. Что означает enforce mode?

   **Ответ:** Не разрешённые профилем действия блокируются; audit зависит от типа правил и настроек.

   **Типичная ошибка:** Перевести профиль в enforce без проверки реальных сценариев запуска и reload.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

229. Что означает complain mode?

   **Ответ:** Обычные нарушения логируются вместо блокировки, но явные deny rules продолжают запрещать.

   **Пример:** Считать complain полной отменой ограничений профиля.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

230. Чем complain mode полезен при внедрении профиля?

   **Ответ:** Позволяет собрать реальные обращения приложения и уточнить правила перед включением enforce.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

231. Как посмотреть статус AppArmor?

   **Ответ:** `aa-status` или `apparmor_status` при наличии пакетов и достаточных прав.

   **Пример:**

   ```bash
   sudo aa-status
   sudo journalctl -k --since "10 minutes ago" --grep="apparmor"
   ```

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

232. Где обычно хранятся профили AppArmor?

   **Ответ:** Обычно `/etc/apparmor.d/`; includes и local overrides могут лежать в подкаталогах.

   **Типичная ошибка:** Редактировать профиль и забывать загрузить его обновлённую версию.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

233. Что значит, что процесс confined профилем?

   **Ответ:** К процессу применяется загруженный профиль, ограничивающий его действия даже при достаточных UNIX permissions.

   **Типичная ошибка:** Считать UID root исключением из ограничений профиля.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

234. Как AppArmor ограничивает доступ к файлам?

   **Ответ:** Разрешениями вроде `r`, `w`, `m`, `k` и execution modes для совпадающих путей.

   **Пример:**

   ```text
   # Фрагмент AppArmor profile, а не полный профиль:
   /etc/myapp/config.toml r,
   /var/lib/myapp/state rw,
   # Runtime, библиотеки, DNS/NSS и требуемые операции описываются отдельно.
   ```

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

235. Как AppArmor ограничивает network capabilities?

   **Ответ:** Отдельно ограничивает network operations и capabilities, например net_admin; детализация зависит от версии ядра и policy ABI.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

236. Как AppArmor ограничивает execution других программ?

   **Ответ:** Execution rules определяют запрет/разрешение запуска и наследование либо переход профиля, например ix/px/cx.

   **Типичная ошибка:** Разрешать unconfined exec вместо корректного profile transition.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

237. Что такое deny rule в профиле?

   **Ответ:** Явное запрещающее правило, имеющее приоритет над обычным allow; применяется и в complain.

   **Пример:** Такой запрет может не давать привычного complain-лога.

   **Типичная ошибка:** Ожидать, что complain отключит явные deny rules.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

238. Что такое allow rule в профиле?

   **Ответ:** Правило разрешения определённого действия над совпадающим объектом; не отменяет независимые проверки DAC и других механизмов.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

239. Как AppArmor помогает ограничить ущерб от RCE в C/C++ сервисе?

   **Ответ:** RCE получает только ресурсы, разрешённые профилем: например, не может читать SSH-ключи или запускать shell при отсутствии таких прав.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

240. Какие типичные ошибки возникают при слишком жестком профиле?

   **Ответ:** Неучтённые temp files, DNS/NSS-конфиги, libraries, helper programs и новые paths могут ломать штатные сценарии.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

241. Почему complain mode полезен перед enforce?

   **Ответ:** Позволяет прогнать реальные сценарии и проверить требуемые permissions до их принудительного применения.

   **Пример:** После обучения удалить лишние разрешения и проверить enforce.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

242. Чем AppArmor проще администрировать по сравнению с SELinux?

   **Ответ:** Пути проще сопоставлять deployment layout; но сложные profiles, transitions и namespaces всё равно требуют понимания policy.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

243. Какие слабые стороны у path-based контроля?

   **Ответ:** Ограничения зависят от представления paths, mounts и aliases; hard links, переезды и namespace visibility усложняют аудит.

   **Типичная ошибка:** Переехать на новый каталог/монтирование без повторного тестирования профиля.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

244. Как symbolic links могут быть релевантны для path-based security?

   **Ответ:** Разрешение применяется с учётом path resolution и операции над ссылкой; нужно проверять и путь назначения, и правила links.

   **Пример:** Не считать любой symlink обходом AppArmor.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

245. Почему AppArmor и Unix permissions не заменяют друг друга?

   **Ответ:** DAC проверяет ownership/ACL, AppArmor — допустимое поведение профиля; для успеха нужны все применимые разрешения.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

246. Может ли процесс с root-привилегиями быть ограничен AppArmor?

   **Ответ:** Да: UID 0 не отменяет enforce profile; изменение самой политики требует соответствующих полномочий и настроек.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

247. Как логи помогают диагностировать AppArmor deny?

   **Ответ:** Kernel/audit messages содержат profile, operation, name и requested/denied masks.

   **Пример:** `journalctl -k` и поиск AppArmor DENIED.

   **Типичная ошибка:** Искать AVC SELinux в системе, где активен только AppArmor.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

248. Что такое least privilege profile?

   **Ответ:** Профиль, разрешающий только необходимые пути, действия, capabilities и exec transitions для рабочего набора сценариев.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

249. Когда AppArmor особенно полезен для сетевых демонов?

   **Ответ:** Когда интернет-доступный демон обрабатывает недоверенные запросы и имеет ограниченный предсказуемый набор ресурсов.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

250. Почему знание AppArmor полезно backend/system developer?

   **Ответ:** Позволяет проектировать deployment permissions и диагностировать EACCES без выдачи сервису лишних системных прав.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

---

### Practical Security for C/C++ / Linux
251. Как процесс на C/C++ узнать свой UID/GID?

   **Ответ:** Через getuid/geteuid/getgid/getegid из unistd.h; дополнительные группы — getgroups.

   **Пример:**

   ```c
   #include <stdio.h>
   #include <unistd.h>
   #include <inttypes.h>

   int main(void) {
       printf("ruid=%ju euid=%ju rgid=%ju egid=%ju\n",
              (uintmax_t)getuid(), (uintmax_t)geteuid(),
              (uintmax_t)getgid(), (uintmax_t)getegid());
       return 0;
   }
   ```

   **Типичная ошибка:** Выводить uid_t через неподходящий printf format с undefined behavior.

   **Источник:** [man7: getuid(2)](https://man7.org/linux/man-pages/man2/getuid.2.html)

252. Что делают `getuid()`, `geteuid()`, `getgid()`, `getegid()`?

   **Ответ:** Getuid/getgid возвращают real IDs, geteuid/getegid — effective IDs; для saved IDs используют getresuid/getresgid.

   **Источник:** [man7: getuid(2)](https://man7.org/linux/man-pages/man2/getuid.2.html)

253. Почему effective UID важнее real UID для проверки доступа?

   **Ответ:** Большинство privilege checks используют effective credentials; файловые операции Linux используют fsuid/fsgid, обычно совпадающие с ними.

   **Пример:** Access по умолчанию проверяет real IDs.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

254. Как процесс может сбросить привилегии после bind() к privileged port?

   **Ответ:** После открытия listener установить нужные supplementary groups, затем GID и все UID через подходящие API, убрать лишние capabilities и проверить ошибки.

   **Пример:**

   ```c
   #define _GNU_SOURCE
   #include <sys/types.h>
   #include <grp.h>
   #include <unistd.h>

   /* Фрагмент для однопоточной фазы привилегированного старта.
      При любой ошибке вызывающий обязан немедленно завершить процесс. */
   int drop_ids(uid_t uid, gid_t gid) {
       if (uid == 0 || gid == 0) return -1;
       if (setgroups(0, NULL) == -1) return -1;
       if (setresgid(gid, gid, gid) == -1) return -1;
       if (setresuid(uid, uid, uid) == -1) return -1;
       return 0;
   }
   /* Не включает полную capability/securebits/ambient policy:
      её проверяют отдельно. Закрыть лишние privileged FD тоже необходимо. */
   ```

   **Типичная ошибка:** Продолжать обслуживать запросы после частичного неудачного privilege drop.

   **Источник:** [man7: setresuid(2)](https://man7.org/linux/man-pages/man2/setresuid.2.html)

255. Что делают `setuid()` и `setgid()`?

   **Ответ:** Меняют IDs согласно полномочиям процесса; у привилегированного процесса setuid может менять real/effective/saved UID.

   **Пример:** Всегда проверять результат и невозможность восстановления root.

   **Типичная ошибка:** Считать seteuid(nonroot) гарантией удаления saved root identity.

   **Источник:** [man7: setuid(2)](https://man7.org/linux/man-pages/man2/setuid.2.html)

256. Почему setuid-root программы опасны при ошибках в C/C++ коде?

   **Ответ:** Ошибка памяти или command injection выполняется с euid владельца бинарника, часто root, и может дать широкие полномочия.

   **Источник:** [man7: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)

257. Что такое SUID binary?

   **Ответ:** Исполняемый файл с S_ISUID; exec может установить effective UID в UID владельца при выполнении условий ядра.

   **Типичная ошибка:** Ожидать SUID-семантики для shell script в обычном Linux.

   **Источник:** [man7: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)

258. Как SUID связан с privilege escalation?

   **Ответ:** Механизм легально даёт программе дополнительные полномочия; уязвимость в ней превращает контролируемую операцию в нежелательный privileged execution.

   **Источник:** [man7: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)

259. Почему небезопасно вызывать shell-команды из привилегированного процесса?

   **Ответ:** Shell интерпретирует специальные символы, expansions и окружение; контролируемая строка может стать дополнительной командой.

   **Пример:** Использовать execve с явным argv и проверенными путями.

   **Источник:** [man7: system(3)](https://man7.org/linux/man-pages/man3/system.3.html)

260. Почему `system()` опасен в setuid-программах?

   **Ответ:** System вызывает shell и наследует опасный контекст интерпретации; документация прямо не рекомендует его для privileged programs.

   **Источник:** [man7: system(3)](https://man7.org/linux/man-pages/man3/system.3.html)

261. Как environment variables могут использоваться для атак на привилегированное приложение?

   **Ответ:** Они меняют PATH, locale, поиск конфигов и загрузку библиотек; secure execution очищает часть опасных loader variables, но не делает весь environment доверенным.

   **Типичная ошибка:** Считать secure-execution очисткой всех переменных, используемых приложением.

   **Источник:** [man7: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html)

262. Почему нужно аккуратно работать с PATH в privileged code?

   **Ответ:** Нужно исключить запуск подменённого executable из writable directory; использовать фиксированные пути и контролируемое окружение.

   **Источник:** [man7: exec(3)](https://man7.org/linux/man-pages/man3/exec.3.html)

263. Почему временные файлы опасны для security-sensitive программ?

   **Ответ:** Предсказуемый путь и разделяемый каталог допускают подмену и гонки.

   **Пример:**

   ```c
   #include <stdlib.h>
   #include <unistd.h>

   int make_temp(void) {
       char path[] = "/tmp/myapp-XXXXXX";
       int fd = mkstemp(path); /* Создание нового файла с mode 0600. */
       if (fd == -1) return -1;
       if (unlink(path) == -1) { close(fd); return -1; }
       return fd; /* Файл без имени; вызывающий обязан закрыть FD. */
   }
   /* Если возможен параллельный exec, нужен атомарный CLOEXEC-вариант. */
   ```

   **Типичная ошибка:** Создать temp имя через mktemp и отдельный open без атомарного создания.

   **Источник:** [man7: mkstemp(3)](https://man7.org/linux/man-pages/man3/mkstemp.3.html)

264. Что такое TOCTOU race в файловой безопасности?

   **Ответ:** Time Of Check To Time Of Use: объект по пути изменяется между проверкой и использованием.

   **Пример:**

   ```c
   /* Небезопасно: объект между вызовами может быть заменён. */
   if (access(path, W_OK) == 0) {
       int fd = open(path, O_WRONLY);
       /* Это мог оказаться другой объект. */
   }
   /* Правильное решение зависит от доверенной директории и политики:
      открыть относительно dirfd и проверить уже открытый объект. */
   ```

   **Типичная ошибка:** Проверять path, а затем доверять ему после нескольких других вызовов.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

265. Чем `access()` + `open()` опаснее, чем сразу `open()`?

   **Ответ:** Между проверкой и open объект может смениться; кроме того, access и open могут использовать разные credentials.

   **Пример:** Открыть один раз и проверять объект через fstat.

   **Источник:** [man7: access(2)](https://man7.org/linux/man-pages/man2/access.2.html)

266. Почему симлинки опасны для root-процессов, работающих с файлами?

   **Ответ:** Разрешение пути может привести к файлу, контролируемому атакующим, и заставить привилегированный процесс читать/перезаписывать чужой объект.

   **Источник:** [man7: openat2(2)](https://man7.org/linux/man-pages/man2/openat2.2.html)

267. Что такое symlink attack?

   **Ответ:** Подмена ожидаемого пути символьной ссылкой, чтобы действие привилегированной программы затронуло иной объект.

   **Источник:** [man7: openat2(2)](https://man7.org/linux/man-pages/man2/openat2.2.html)

268. Как `O_NOFOLLOW` помогает?

   **Ответ:** O_NOFOLLOW запрещает следование конечной symlink при open; промежуточные компоненты защищают через dirfd/openat2 resolution flags.

   **Пример:**

   ```c
   #define _GNU_SOURCE
   #include <linux/openat2.h>
   #include <sys/syscall.h>
   #include <unistd.h>
   #include <fcntl.h>

   /* dirfd — заранее открытый доверенный каталог, relative — относительный путь. */
   int open_under(int dirfd, const char *relative) {
       struct open_how how = {
           .flags = O_RDONLY | O_CLOEXEC,
           .resolve = RESOLVE_BENEATH | RESOLVE_NO_SYMLINKS
       };
       return (int)syscall(SYS_openat2, dirfd, relative, &how, sizeof how);
   }
   /* Обработать ошибку, включая ENOSYS на старом ядре;
      не делать незаметный fallback на незащищённый open(). */
   ```

   **Источник:** [man7: openat2(2)](https://man7.org/linux/man-pages/man2/openat2.2.html)

269. Почему важно выставлять `FD_CLOEXEC` для чувствительных дескрипторов?

   **Ответ:** Флаг закрывает FD при успешном exec, предотвращая утечку ключей, sockets и служебных файлов новому executable.

   **Пример:** Предпочитать атомарные O_CLOEXEC/SOCK_CLOEXEC.

   **Типичная ошибка:** Выставить FD_CLOEXEC отдельным fcntl в multithreaded процессе и получить race с exec.

   **Источник:** [man7: open(2)](https://man7.org/linux/man-pages/man2/open.2.html)

270. Что будет, если секретный FD утечет через exec() дочернему процессу?

   **Ответ:** Дочерняя программа может прочитать секрет или использовать уже открытый privileged resource без нового pathname access check.

   **Типичная ошибка:** Думать, что низкие pathname permissions защищают уже переданный открытый FD.

   **Источник:** [man7: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)

271. Почему логирование должно избегать утечки паролей и токенов?

   **Ответ:** Логи доступны операторам и системам сбора и хранятся долго; утечка превращает рабочий журнал в источник credentials.

   **Пример:** Редактировать/redact чувствительные поля до записи.

   **Источник:** [man7: syslog(3)](https://man7.org/linux/man-pages/man3/syslog.3.html)

272. Почему сервису полезно иметь отдельного пользователя и минимальные права?

   **Ответ:** Отдельный UID и узкие permissions отделяют данные и уменьшают последствия эксплуатации ошибки сервиса.

   **Типичная ошибка:** Выдавать сервисному UID доступ ко всем данным других сервисов через общую группу.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

273. Как ACL/SELinux/AppArmor помогают ограничить blast radius уязвимости?

   **Ответ:** ACL ограничивает доступ конкретных IDs, LSM — операции процесса; вместе сокращают множество доступных после RCE объектов.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

274. Почему daemon не должен писать в произвольные каталоги?

   **Ответ:** Иначе ошибка пути или захват процесса позволяет портить чужие данные и системные файлы; нужны выделенные writable directories.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

275. Как неправильные права на конфиг могут привести к компрометации сервиса?

   **Ответ:** Если атакующий меняет config или его родительский каталог, он может подставить команды, плагины, пути и credentials, которые сервис считает доверенными.

   **Типичная ошибка:** Проверить только сам config, оставив родительский каталог writable атакующему.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

276. Почему секреты нельзя хранить world-readable?

   **Ответ:** Любой локальный пользователь/процесс с доступом может прочитать их; выдавать только нужному UID и учитывать backup, logs и mounts.

   **Типичная ошибка:** Закрыть основной secret file, но оставить его копию в world-readable temp или backup.

   **Источник:** [man7: chmod(2)](https://man7.org/linux/man-pages/man2/chmod.2.html)

277. Как проверить, под кем реально работает процесс?

   **Ответ:** `ps -o pid,user,euser,group,egroup,args -p PID` и `/proc/PID/status` для real/effective/saved/fs IDs.

   **Пример:**

   ```bash
   ps -o pid,user,euser,group,egroup,args -p 1234
   cat /proc/1234/status
   # Uid/Gid содержат real, effective, saved и filesystem IDs.
   ```

   **Источник:** [man7: proc_pid_status(5)](https://man7.org/linux/man-pages/man5/proc_pid_status.5.html)

278. Как связать проблемы “Permission denied” с Unix perms vs ACL vs SELinux/AppArmor?

   **Ответ:** Проверить identity, все компоненты пути, mode/getfacl, mount flags и LSM logs; strace укажет операцию и errno.

   **Пример:**

   ```bash
   namei -l /srv/myapp/data
   getfacl /srv/myapp/data
   findmnt -T /srv/myapp/data
   # В SELinux-системе дополнительно ls -Z и ausearch;
   # в AppArmor-системе — aa-status и kernel/audit logs.
   ```

   **Типичная ошибка:** Выдать chmod 777 и потерять исходный источник отказа.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

279. Какие типичные security-ошибки встречаются в системном C/C++ коде под Linux?

   **Ответ:** TOCTOU, небезопасные temp files, shell injection, FD leaks через exec, неполный privilege drop и использование недоверенного config/environment.

   **Источник:** [man7: openat2(2)](https://man7.org/linux/man-pages/man2/openat2.2.html)

280. Почему знание Linux security primitives критично для backend/system engineer?

   **Ответ:** Ядро применяет эти примитивы к каждому запросу ресурсов; понимание позволяет безопасно проектировать сервис и локализовать отказ без лишних привилегий.

   **Типичная ошибка:** Подменять системную изоляцию надеждой на отсутствие ошибок в C/C++.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)
