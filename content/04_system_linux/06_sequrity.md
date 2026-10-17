## Linux Security — Questions (C/C++ oriented)

Вопросы о разграничении доступа, защите C/C++ процессов и практическом hardening Linux-сервисов. Возможности sandbox APIs и unit directives проверяйте для целевых версий ядра, libc и systemd.

### Модель угроз, идентичность и границы доверия

1. С чего начинать проектирование безопасности Linux-сервиса?

   **Ответ:** Составить модель угроз: какие данные защищаются, откуда приходит недоверенный ввод, какие права нужны процессу и какой ущерб возможен после RCE. Затем выбрать отдельные механизмы для предотвращения ошибки и ограничения её последствий; одних прав на исполняемый файл недостаточно.

   **Пример:** Сетевой parser работает без root, а signing key доступен отдельному ограниченному компоненту.

   **Типичная ошибка:** Настраивать sandbox без понимания ресурсов, действительно необходимых приложению.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

2. Как отличить аутентификацию от авторизации в сервере?

   **Ответ:** Аутентификация устанавливает личность клиента, авторизация решает, какие действия этой личности разрешены. Успешный login или корректный token не разрешает доступ ко всем объектам. Проверку полномочий выполняют для каждой защищённой операции с учётом объекта и контекста.

   **Пример:** Аутентифицированный пользователь читает только принадлежащий ему отчёт.

   **Типичная ошибка:** После проверки пароля пропустить проверку ownership запрошенного объекта.

   **Источник:** [man7: pam(8)](https://man7.org/linux/man-pages/man8/pam.8.html)

3. Почему нельзя считать переменную USER достоверной идентичностью процесса?

   **Ответ:** Окружение задаётся вызывающей стороной и может содержать произвольные значения. Для локальной OS-идентичности используют getuid/geteuid и другие credential APIs; для удалённого пользователя — проверенную authentication-сессию. UID сервиса и личность клиента относятся к разным уровням.

   **Пример:**

   ```c
   #include <stdio.h>
   #include <unistd.h>
   #include <inttypes.h>

   int main(void) {
       printf("ruid=%ju euid=%ju\n",
              (uintmax_t)getuid(), (uintmax_t)geteuid());
       return 0;
   }
   /* USER=root ./check_identity меняет environment, а не IDs ядра. */
   ```

   **Типичная ошибка:** Разрешать административную операцию после сравнения getenv("USER") с "root".

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

4. Почему два сервиса с одним UID плохо изолированы друг от друга?

   **Ответ:** DAC и часть process-access checks видят одну пользовательскую идентичность. При соответствующих условиях сервисы могут читать общие файлы, посылать сигналы и исследовать процессы друг друга. Отдельные UIDs уменьшают общий доступ, а LSM и namespace policy дополняют разделение.

   **Пример:** Для api и worker используются разные service accounts.

   **Типичная ошибка:** Считать разные имена units достаточной security-границей при одном UID.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

5. Какие идентификаторы процесса полезно проверять при неожиданном доступе к файлам?

   **Ответ:** Real, effective, saved и filesystem UID/GID, supplementary groups, capabilities и user namespace. В Linux обычные файловые проверки используют fsuid/fsgid, чаще совпадающие с effective IDs; одного имени из ps недостаточно для объяснения всех полномочий.

   **Пример:**

   ```bash
   id
   ps -o pid,user,euser,group,egroup,args -p 1234
   cat /proc/1234/status
   # Uid/Gid: real, effective, saved, filesystem.
   # Groups и Cap* показывают дополнительные части credentials.
   ```

   **Типичная ошибка:** Проверить только real UID и пропустить сохранившийся privileged effective/saved UID.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

6. Почему удаление пользователя не отзывает мгновенно доступ его процессов?

   **Ответ:** Работающие процессы сохраняют числовые credentials и открытые ресурсы, а файлы — числовой ownership. Удаление записи меняет lookup имени, но не закрывает FD и не завершает задачи. Нужен отдельный план остановки сессий, отзыва credentials и обработки файлов.

   **Пример:** После userdel старый UID ещё может владеть процессами и файлами.

   **Типичная ошибка:** Быстро переиспользовать освободившийся UID, передав новому аккаунту старые данные.

   **Источник:** [man7: passwd(5)](https://man7.org/linux/man-pages/man5/passwd.5.html)

7. Можно ли ограничить root так же, как обычный сервис?

   **Ответ:** Да: capability sets, SELinux/AppArmor, namespaces и seccomp накладывают ограничения, применимые и к UID 0. Но доступ к настройке самих защитных механизмов нужно исключить; иначе процесс сможет снять часть ограничений. Смысл root зависит также от user namespace.

   **Пример:** Root-процесс с профилем AppArmor может получить отказ чтения файла.

   **Типичная ошибка:** Считать UID 0 либо всегда полностью всесильным, либо безопасным только из-за контейнера.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

8. Что означает fail closed при ошибке security-проверки?

   **Ответ:** Если проверка identity, policy или sandbox не выполнена, защищённое действие запрещается, а запуск/запрос завершается контролируемой ошибкой. Ошибка инфраструктуры не является разрешением. При этом ответ и лог должны позволять отличить отказ доступа от внутренней неисправности без раскрытия секретов.

   **Пример:** Не удалось установить seccomp policy — worker не принимает недоверенные запросы.

   **Типичная ошибка:** Продолжить работу без ограничений после неудачного вызова настройки защиты.

   **Источник:** [man7: seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

9. Почему defense in depth требует независимых механизмов?

   **Ответ:** У каждого слоя свои пределы: DAC ограничивает identities, LSM — разрешённое поведение, seccomp — syscalls, hardening сборки усложняет эксплуатацию ошибок памяти. Слои должны закрывать разные пути атаки; несколько одинаковых проверок недоверенной строки не создают сопоставимой защиты.

   **Пример:** Отдельный UID + read-only данные + seccomp + проверка входных размеров.

   **Типичная ошибка:** Считать включённый ASLR заменой проверки границ буфера.

   **Источник:** [man7: seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

10. Как отличить security boundary от удобной административной группировки?

   **Ответ:** Нужно выяснить, что именно принудительно проверяется ядром или доверенным компонентом и какие полномочия позволяют обойти ограничение. Имя процесса, каталог проекта, unit или Docker label сами по себе не разделяют доступ; граница задаётся credentials, policy и изоляцией ресурсов.

   **Пример:** Два units с одним UID и общим writable каталогом имеют общую область риска.

   **Типичная ошибка:** Описывать систему как изолированную только из-за отдельных конфигурационных файлов.

   **Источник:** [man7: credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)

### Права файлов, каталоги, umask и ACL

11. Как интерпретировать r, w и x применительно к каталогу?

   **Ответ:** Read разрешает читать список имён, write — менять записи, execute/search — искать объект по известному имени и проходить через каталог. Для многих операций нужны сочетания прав. Права самого файла проверяются отдельно от доступа к его пути.

   **Пример:**

   ```text
   Каталог: --x  → можно искать известное имя, но нельзя читать весь список
   Каталог: r-x  → можно читать список и проходить к объектам
   Каталог: -wx  → можно менять записи при прочих разрешённых условиях
   Файл:    r--  → отдельно определяет чтение содержимого самого файла
   ```

   **Типичная ошибка:** Считать x каталога разрешением запускать все файлы внутри него.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

12. Почему файл с mode 0600 иногда можно удалить другому пользователю?

   **Ответ:** Unlink изменяет каталог, а не содержимое файла: важны права write/search на родительский каталог, sticky bit и другие применимые ограничения. Mode 0600 защищает чтение/запись содержимого, но не гарантирует сохранность имени в чужом writable каталоге.

   **Пример:** Приватный config в общедоступном writable deployment-каталоге можно заменить.

   **Типичная ошибка:** Проверять только mode файла, игнорируя ownership и права родительского каталога.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

13. Как sticky bit помогает защитить общий временный каталог?

   **Ответ:** Для удаления/переименования записей в sticky-каталоге действуют дополнительные проверки ownership файла/каталога и привилегий. Он уменьшает возможность удалять чужие имена, но не шифрует содержимое и не делает предсказуемые temp paths безопасными.

   **Пример:** Обычный `/tmp` часто имеет mode 1777.

   **Типичная ошибка:** Считать sticky bit заменой mkstemp или защитой от чтения world-readable файла.

   **Источник:** [man7: inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html)

14. Зачем общему рабочему каталогу устанавливают SGID?

   **Ответ:** SGID на каталоге заставляет новые объекты наследовать owning group каталога по правилам ФС; новые подкаталоги обычно также наследуют SGID. Это помогает совместному доступу, но не гарантирует group-write: итог зависит от mode, umask и default ACL.

   **Пример:** `chmod 2770 shared` в заранее подготовленном доверенном каталоге.

   **Типичная ошибка:** Ожидать автоматического rw-доступа группе к файлу, созданному с mode 0600.

   **Источник:** [man7: inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html)

15. Как вычисляется mode нового файла при отсутствии default ACL?

   **Ответ:** Запрошенные права ограничиваются маской: mode & ~umask. Umask только убирает биты и не добавляет execute. Обычный open с mode 0666 и umask 0027 даёт 0640. Для каталога обычно запрашивают 0777; специальные биты и ACL требуют отдельного учёта.

   **Пример:**

   ```bash
   # Выполняется в отдельном subshell и собственном временном каталоге.
   (
       umask 027
       task_security_demo=$(mktemp -d)
       touch "$task_security_demo/data"
       mkdir "$task_security_demo/subdir"
       stat -c '%a %n' "$task_security_demo/data" "$task_security_demo/subdir"
       # Ожидается 640 для нового файла и 750 для подкаталога.
   )
   ```

   **Типичная ошибка:** Вычитать umask арифметически или ожидать, что она исправит уже существующие файлы.

   **Источник:** [man7: umask(2)](https://man7.org/linux/man-pages/man2/umask.2.html)

16. Почему нельзя временно менять umask вокруг одного open в многопоточном коде?

   **Ответ:** Umask разделяется потоками процесса, поэтому параллельный create может попасть в окно с чужой маской. Предпочтительно задавать стабильную umask при старте и сразу создавать чувствительные файлы с ограниченным mode. Правки chmod после небезопасного создания оставляют окно доступа.

   **Пример:** Secret создаётся с mode 0600, а не сначала 0666 с последующим chmod.

   **Типичная ошибка:** Считать umask thread-local настройкой.

   **Источник:** [man7: umask(2)](https://man7.org/linux/man-pages/man2/umask.2.html)

17. Как ACL mask может объяснить неожиданное отсутствие доступа?

   **Ответ:** Named-user и group-class entries ограничиваются mask. Запись user:alice:rw- при mask::r-- даёт только чтение. getfacl показывает effective permissions; ls group bits при расширенной ACL отражают mask, поэтому простого просмотра group:: недостаточно.

   **Пример:**

   ```text
   user::rw-
   user:alice:rw-             #effective:r--
   group::r--
   mask::r--
   other::---
   # mask ограничивает named-user entry: rw- & r-- = r--.
   ```

   **Типичная ошибка:** Добавлять rwx named entry, не проверяя текущую mask.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

18. Когда default ACL не даст ожидаемых прав новому файлу?

   **Ответ:** При наследовании ACL итог ограничивается mode, запрошенным создающим приложением. Если программа создаёт secret с 0600, default ACL не должна автоматически выдать группе rw. Access ACL каталога и default ACL также отвечают за разные объекты.

   **Пример:** Каталог имеет default group rw, но приложение сознательно создаёт приватный файл.

   **Типичная ошибка:** Считать default ACL безусловным chmod для всех новых объектов.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

19. Почему chmod 777 редко является корректным исправлением Permission denied?

   **Ответ:** Он широко расширяет DAC-доступ и не устраняет независимые причины: отсутствие search у родителей, read-only mount, ACL mask или LSM denial. Сначала находят отказавшую операцию и определяют identity и применимую policy; затем дают минимальное нужное разрешение.

   **Пример:** Проверить namei, getfacl, findmnt и LSM logs для конкретного пути.

   **Типичная ошибка:** Менять всё дерево рекурсивно и терять исходную картину доступа.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

20. Что проверять при переносе данных с ACL на другую ФС или backup?

   **Ответ:** Поддержку access/default ACL, сохранение ownership, extended attributes и security labels инструментом копирования. После восстановления проверяют effective access от service account: успешное чтение от root не доказывает правильность прав. Для сетевых ФС модель ACL может отличаться.

   **Пример:**

   ```bash
   getfacl /srv/shared
   getfacl /restore/shared
   # Сопоставить owner/group, access ACL, mask и default ACL.
   # Дополнительно проверить labels/xattrs и доступ из контекста службы.
   ```

   **Типичная ошибка:** Считать сохранение девяти rwx-битов полным сохранением security metadata.

   **Источник:** [man7: acl(5)](https://man7.org/linux/man-pages/man5/acl.5.html)

### Capabilities и безопасный запуск с привилегиями

21. Чем effective capabilities отличаются от permitted capabilities?

   **Ответ:** Effective set участвует в текущих privilege checks; permitted задаёт capabilities, которые поток может включать в effective в рамках правил ядра. Пустой effective set не означает необратимой потери всех полномочий, если permitted остаётся широким.

   **Пример:** Сравнить CapEff и CapPrm в `/proc/PID/status`.

   **Типичная ошибка:** Проверить только CapEff после «сброса» привилегий.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

22. Какую роль играет capability bounding set?

   **Ответ:** Ограничивает возможности получения capabilities через exec по правилам преобразования sets. Его сокращение необратимо для данного execution lineage, но само по себе не удаляет уже действующие permitted/effective capabilities. Нужна согласованная настройка всех relevant sets и securebits.

   **Пример:** Systemd CapabilityBoundingSet ограничивает разрешённый набор сервиса.

   **Типичная ошибка:** Считать PR_CAPBSET_DROP достаточным удалением уже имеющейся effective capability.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

23. Для чего используются ambient capabilities?

   **Ответ:** Позволяют ограниченному набору capabilities сохраняться при exec обычной непривилегированной программы при соблюдении условий permitted/inheritable. Они удобны для запуска non-root сервисов, но расширяют полномочия descendants. Переход к privileged executable изменяет правила ambient inheritance.

   **Пример:** Сервису передают только возможность bind защищённого порта.

   **Типичная ошибка:** Забыть, что дочерняя helper-программа тоже может получить ambient capability.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

24. Когда file capabilities предпочтительнее SUID root?

   **Ответ:** Когда программе нужна узкая операция, покрываемая конкретной capability, а не широкие root-права. Нужно проверить все последствия этой capability и условия exec: nosuid, no_new_privs, namespace и loader secure mode. File capability не делает уязвимую программу безопасной автоматически.

   **Пример:** Проверка атрибутов командой `getcap /path/to/program`.

   **Типичная ошибка:** Заменить SUID на CAP_SYS_ADMIN и считать privilege surface минимальным.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

25. Почему CAP_SYS_ADMIN опасно выдавать «на всякий случай»?

   **Ответ:** Это перегруженная capability для множества чувствительных операций; она часто даёт гораздо больше, чем нужно одному действию. Следует найти конкретную проверку и проверить наличие более узкой capability либо вынести действие в supervisor. Namespace scope тоже нужно учитывать.

   **Пример:** Для обычного bind защищённого порта требуется не CAP_SYS_ADMIN, а соответствующее узкое разрешение.

   **Типичная ошибка:** Лечить любой EPERM добавлением CAP_SYS_ADMIN.

   **Источник:** [man7: capabilities(7)](https://man7.org/linux/man-pages/man7/capabilities.7.html)

26. Как проверить capabilities бинарника и работающего процесса?

   **Ответ:** File capabilities читают getcap; process/thread sets — через getpcaps и поля CapInh/CapPrm/CapEff/CapBnd/CapAmb в proc status. Нужно учитывать namespace и то, что kernel attributes относятся к потокам. После обновления executable проверку повторяют.

   **Пример:**

   ```bash
   getcap /usr/local/bin/myapp
   getpcaps 1234
   cat /proc/1234/status
   # Не путать file attributes и capabilities фактического execution context.
   ```

   **Типичная ошибка:** Оценивать текущие права процесса только по атрибутам файла на диске.

   **Источник:** [man7: getcap(8)](https://man7.org/linux/man-pages/man8/getcap.8.html)

27. Почему сброс UID нужно выполнять после supplementary groups и GID?

   **Ответ:** После потери нужных privileges может стать невозможно изменить группы, и процесс сохранит лишний доступ. Последовательность обычно настраивает группы, затем все нужные GIDs и UIDs, после чего проверяет capability policy и ошибки. Любая неудача должна останавливать privileged startup.

   **Пример:**

   ```c
   #define _GNU_SOURCE
   #include <sys/types.h>
   #include <unistd.h>
   #include <grp.h>
   #include <errno.h>

   /* Фрагмент privileged startup до создания потоков.
      Пример политики: worker не имеет supplementary groups.
      При ошибке вызывающий обязан завершить startup, а не продолжать работу. */
   int drop_ids(uid_t uid, gid_t gid) {
       if (uid == 0 || gid == 0) { errno = EINVAL; return -1; }
       if (setgroups(0, NULL) == -1) return -1;
       if (setresgid(gid, gid, gid) == -1) return -1;
       if (setresuid(uid, uid, uid) == -1) return -1;
       return 0;
   }
   /* Это не полная sandbox: capabilities/securebits/FD policy
      и результат перехода нужно проверить отдельно. */
   ```

   **Типичная ошибка:** Продолжить startup после ошибки setgroups, оставив привилегированную группу.

   **Источник:** [man7: setresuid(2)](https://man7.org/linux/man-pages/man2/setresuid.2.html)

28. Почему одного seteuid(nonroot) недостаточно для необратимого сброса прав?

   **Ответ:** Real/saved UID и capability sets могут позволять восстановить более высокий effective UID или privilege. Для окончательного перехода используют подходящие APIs всех IDs и проверяют sets, securebits и открытые resources. Поведение зависит от исходных credentials.

   **Пример:** Сравнить getresuid до и после transition.

   **Типичная ошибка:** Считать временное переключение euid необратимой потерей root.

   **Источник:** [man7: setresuid(2)](https://man7.org/linux/man-pages/man2/setresuid.2.html)

29. Что сохраняет опасность после успешного сброса UID?

   **Ответ:** Открытые privileged FD, mappings, доступные secrets, capabilities и разрешённые IPC endpoints. Смена UID не заставляет ядро повторно проверить pathname DAC для каждой операции на уже открытом файле. Ненужные ресурсы надо закрыть до обработки недоверенного ввода.

   **Пример:** Передать worker только listener, закрыв FD административного config и secret store.

   **Типичная ошибка:** Сбросить UID, но оставить writable FD на системный файл.

   **Источник:** [man7: open(2)](https://man7.org/linux/man-pages/man2/open.2.html)

30. Как no_new_privs влияет на последующие exec?

   **Ответ:** После установки флаг наследуется fork/exec и запрещает получать новые полномочия от SUID/SGID и file capabilities через exec. Он не отнимает уже имеющиеся capabilities и не закрывает FD. Его нельзя снять в том же execution lineage; часть LSM transitions тоже требует внимания.

   **Пример:**

   ```c
   #include <sys/prctl.h>
   #include <stdio.h>

   int main(void) {
       if (prctl(PR_SET_NO_NEW_PRIVS, 1L, 0L, 0L, 0L) == -1) {
           perror("PR_SET_NO_NEW_PRIVS");
           return 1;
       }
       /* Только теперь запускать код, полагающийся на эту гарантию. */
       return 0;
   }
   ```

   **Типичная ошибка:** Использовать no_new_privs вместо собственно удаления текущих privileges.

   **Источник:** [Linux Kernel: No New Privileges](https://docs.kernel.org/userspace-api/no_new_privs.html)

### Учётные записи, аутентификация, sudo и секреты

31. Как связаны публичная passwd-запись и закрытая shadow-запись?

   **Ответ:** Passwd предоставляет имя, UID/GID, home и shell; shadow хранит password verifier и aging для локальной схемы. Связь идёт по имени, а NSS/PAM могут использовать внешние providers. Обычному backend не нужен прямой доступ к hashes локальных пользователей.

   **Пример:** `getent passwd alice` и `passwd -S alice` для соответствующих задач.

   **Типичная ошибка:** Писать собственную authentication по ручному чтению shadow без account policy.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

32. Почему locked password не равен полностью отключённому аккаунту?

   **Ответ:** Markers вроде ! или * запрещают обычную проверку данного UNIX password verifier, но не обязательно public-key login, активные сессии и другие authentication providers. Полное отключение требует учесть account policy и все используемые механизмы входа.

   **Пример:**

   ```bash
   sudo passwd -S alice
   sudo chage -l alice
   # Статус password и account aging — разные проверки.
   # Отдельно оценить SSH keys, активные сессии и внешние providers.
   ```

   **Типичная ошибка:** Считать смену password marker отзывом всех выданных tokens и SSH-доступа.

   **Источник:** [man7: shadow(5)](https://man7.org/linux/man-pages/man5/shadow.5.html)

33. Какие стадии PAM важны помимо проверки пароля?

   **Ответ:** Authentication устанавливает личность, account management проверяет срок/допустимость входа, credential и session stages готовят необходимые условия. Корректная интеграция использует нужные стадии для сценария, а не только pam_authenticate. Для сетевого API может быть уместнее иной identity provider.

   **Пример:** Успешный password check ещё не отменяет account expiration.

   **Типичная ошибка:** Разрешить сессию expired account после одной успешной authentication-функции.

   **Источник:** [man7: pam(8)](https://man7.org/linux/man-pages/man8/pam.8.html)

34. Как оценить, даёт ли sudo-правило фактически произвольный root execution?

   **Ответ:** Проверить поведение executable: shell escapes, scripting, plugins, config, аргументы и writable dependencies. Разрешённый root wrapper должен иметь фиксированный контракт и контролируемые владельцем paths. Ограничение по имени программы недостаточно, если сама программа умеет выполнять произвольный код.

   **Пример:**

   ```sudoers
   # Учебное правило: wrapper без аргументов и с фиксированным действием.
   deploy ALL=(root) /usr/local/sbin/restart-myapp ""
   # Файл wrapper и все его parents должны контролироваться root.
   # Его helpers, configs и рабочие пути не должны допускать подмену deploy.
   ```

   **Типичная ошибка:** Белый список программы считать автоматическим белым списком её безопасных действий.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

35. Почему wildcard в sudoers требует осторожности с аргументами?

   **Ответ:** Правила matching sudoers не совпадают с интуицией shell: pattern может захватить неожиданные аргументы и пути. Лучше ограничивать точный контракт или проверяемый wrapper, а синтаксис проверять visudo. Поддержку regex и её семантику нужно сверять с установленной версией sudo.

   **Пример:** Wrapper без аргументов перезапускает только заранее заданный unit.

   **Типичная ошибка:** Предполагать, что * соответствует только одному безопасному имени файла.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

36. Зачем sudo очищает окружение и задаёт secure_path?

   **Ответ:** Environment влияет на поиск executables, загрузку libraries, конфигурацию и поведение команды. Policy должна сохранять только необходимые значения и исключать пользовательские writable directories из доверенного поиска. Абсолютный путь executable не защищает его небезопасные subprocess/config lookups.

   **Пример:**

   ```sudoers
   # Пример defaults: конкретный состав PATH зависит от целевой системы.
   Defaults env_reset
   Defaults secure_path="/usr/sbin:/usr/bin:/sbin:/bin"
   # Проверка синтаксиса выполняется через visudo -c.
   # Это не защищает небезопасную логику самого privileged executable.
   ```

   **Типичная ошибка:** Разрешать все env variables ради удобства deploy.

   **Источник:** [sudo: sudoers(5)](https://www.sudo.ws/docs/man/sudoers.man/)

37. Когда sudoedit всё равно может дать опасные полномочия?

   **Ответ:** Редактор обычно работает без root, но изменяемый файл может управлять root-сервисом, commands, plugins или путями загрузки. Поэтому разрешение редактировать config оценивается по тому, кто и как интерпретирует его после сохранения; безопасный редактор не делает произвольный target безопасным.

   **Пример:** Config root-сервиса с директивой внешней команды требует особенно узкой делегации.

   **Типичная ошибка:** Считать sudoedit безопасным для любого системного файла по определению.

   **Источник:** [man7: sudo(8)](https://man7.org/linux/man-pages/man8/sudo.8.html)

38. Почему секрет в environment не следует считать автоматически защищённым?

   **Ответ:** Он наследуется children и может попасть в diagnostic dumps, logs и доступные по policy process interfaces. Точная видимость proc зависит от credentials и настроек; риск не сводится к «виден всем». Лучше явно ограничивать доставку, lifetime и наследование secrets.

   **Пример:** Не передавать production token каждому child helper процесса.

   **Типичная ошибка:** Считать окружение secret vault или, наоборот, утверждать, что его всегда читает любой UID.

   **Источник:** [man7: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html)

39. Как создавать криптографически стойкие случайные tokens в Linux?

   **Ответ:** Использовать OS CSPRNG, например getrandom, с проверкой результатов и обработкой partial read/EINTR. Не выводить секреты в logs; entropy API и encoding — разные задачи. Rand, PID и timestamp не подходят как источники непредсказуемости.

   **Пример:**

   ```c
   #include <sys/random.h>
   #include <stddef.h>
   #include <errno.h>

   int random_bytes(unsigned char *out, size_t size) {
       size_t done = 0;
       while (done < size) {
           ssize_t n = getrandom(out + done, size - done, 0);
           if (n > 0) { done += (size_t)n; continue; }
           if (n == -1 && errno == EINTR) continue;
           if (n == 0) errno = EIO;
           return -1;
       }
       return 0;
   }
   /* На ошибке частично заполненный результат не использовать как token. */
   ```

   **Типичная ошибка:** Seed rand временем запуска и использовать результат как session token.

   **Источник:** [man7: getrandom(2)](https://man7.org/linux/man-pages/man2/getrandom.2.html)

40. Как уменьшить риск сохранения секретов в памяти после использования?

   **Ответ:** Сократить lifetime и число копий, использовать специальное гарантированное стирание доступного буфера, например explicit_bzero при поддержке libc. При необходимости применяют mlock и dump policy. Это не стирает прошлые копии в registers, swap, allocator или сторонних libraries автоматически.

   **Пример:**

   ```c
   #define _DEFAULT_SOURCE
   #include <string.h>

   void erase_secret(char *buffer, size_t size) {
       explicit_bzero(buffer, size);
   }
   /* Пример для libc с explicit_bzero.
      Функция не стирает автоматически другие копии секрета. */
   ```

   **Типичная ошибка:** Использовать обычный memset, который optimizer может удалить, и считать проблему полностью решённой.

   **Источник:** [man7: explicit_bzero(3)](https://man7.org/linux/man-pages/man3/explicit_bzero.3.html)

### SELinux и AppArmor: внедрение и диагностика

41. Как совместно учитываются DAC и SELinux при open?

   **Ответ:** Успех требует прохождения применимых проверок: pathname access, mode/ACL и SELinux policy. Allow в SELinux не выдаёт отсутствующие UNIX permissions, а chmod не отменяет SELinux denial. Проверяют конкретный syscall, identity, file label и process domain.

   **Пример:** Файл читается owner, но httpd_t не имеет права на его type.

   **Типичная ошибка:** Рассматривать DAC и MAC как альтернативные режимы вместо совместных ограничений.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

42. Какие поля AVC denial помогают найти причину отказа?

   **Ответ:** Scontext описывает субъект, tcontext — объект, tclass — класс ресурса, перечисленные permissions — запрещённые действия; comm/path/pid помогают связать событие с процессом. Сначала проверяют ожидаемые labels и deployment paths, затем необходимость расширения policy.

   **Пример:**

   ```bash
   sudo ausearch -m AVC,USER_AVC -ts recent
   ls -Z /srv/myapp/config
   ps -eZ
   # Сопоставить scontext, tcontext, tclass и запрещённую permission.
   ```

   **Типичная ошибка:** Автоматически превращать каждый AVC в постоянное allow rule.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

43. Почему перенос файла может изменить результат SELinux-проверки?

   **Ответ:** Перемещение в пределах ФС обычно сохраняет label inode; создание/копирование может получить иной label по policy и инструменту. Ожидаемый type задаётся правилами путей и transitions, поэтому после deployment labels проверяют и восстанавливают при необходимости.

   **Пример:** Файл, перенесённый из home в web root, может сохранить неподходящий type.

   **Типичная ошибка:** Ожидать автоматического relabel при любом mv.

   **Источник:** [man7: restorecon(8)](https://man7.org/linux/man-pages/man8/restorecon.8.html)

44. Как сделать настройку SELinux label устойчивой к relabel?

   **Ответ:** Задать подходящее постоянное file-context mapping, затем применить restorecon к существующим объектам. Chcon меняет текущий label, но обычно не задаёт ожидаемое правило для будущего восстановления. Тип должен соответствовать назначению данных, а не просто снимать отказ.

   **Пример:**

   ```bash
   # Пример для SELinux-системы с соответствующим web-content policy type.
   sudo semanage fcontext -a -t httpd_sys_content_t '/srv/www(/.*)?'
   sudo restorecon -Rv /srv/www
   ls -Zd /srv/www
   # Если mapping уже существует, оценить изменение через -m вместо -a.
   ```

   **Типичная ошибка:** Использовать только chcon в deploy и удивляться отмене изменения после relabel.

   **Источник:** [man7: semanage-fcontext(8)](https://man7.org/linux/man-pages/man8/semanage-fcontext.8.html)

45. Почему наличие CAP_NET_BIND_SERVICE не гарантирует bind при SELinux?

   **Ответ:** Capability разрешает определённую privileged-port проверку, но policy может ограничивать domain по protocol/port type независимо от неё. Проверяют AVC и semanage port, а затем выбирают подходящий уже предусмотренный policy путь; полный root не является корректным исправлением.

   **Пример:** Нестандартный HTTP-порт должен иметь допустимый для domain SELinux type.

   **Типичная ошибка:** Добавлять широкие capabilities вместо проверки port labeling.

   **Источник:** [man7: semanage-port(8)](https://man7.org/linux/man-pages/man8/semanage-port.8.html)

46. Когда SELinux boolean лучше локального policy module?

   **Ответ:** Когда нужное поведение уже предусмотрено переключаемым boolean и его область соответствует требованиям сервиса. Это более поддерживаемый контракт, чем произвольные allow rules. Перед включением смотрят, какие дополнительные действия он открывает; постоянность настройки задаётся отдельно.

   **Пример:** Разрешение предусмотренного policy вида сетевого соединения сервиса.

   **Типичная ошибка:** Включать все booleans ради исчезновения denials.

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

47. Как использовать permissive mode без потери смысла диагностики?

   **Ответ:** Воспроизвести нужный сценарий и изучить предполагаемые denials; где возможно, ограничить permissive отдельным domain. Затем исправить labels/настройки и повторить проверку в enforcing. Работа в permissive не доказывает отсутствие DAC, функциональных или иных ошибок.

   **Пример:** Тест startup, reload и обычных запросов перед возвратом domain в enforcing.

   **Типичная ошибка:** Оставить глобальный permissive как постоянное «исправление».

   **Источник:** [man7: selinux(8)](https://man7.org/linux/man-pages/man8/selinux.8.html)

48. Что нужно учесть при переводе AppArmor profile из complain в enforce?

   **Ответ:** Прогнать реальные startup, DNS/NSS lookup, reload, rotation, temp files и helper execution, затем проверить минимальность правил и включить enforcement. Complain наблюдает многие нарушения, но явные deny остаются запрещающими. Профиль должен соответствовать фактическим paths deployment.

   **Пример:** Сервис стартует, но reload требует дополнительного config include.

   **Типичная ошибка:** Обучить профиль только на healthcheck и считать покрытыми все сценарии.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

49. Как execution transitions AppArmor влияют на запуск helpers?

   **Ответ:** Правило определяет, наследует helper текущий профиль, переходит в другой или получает иное состояние confinement. Требуется подобрать ожидаемую isolation policy для каждого разрешённого executable; широкий unconfined exec может обнулить смысл профиля через доступную helper-функцию.

   **Пример:** Отдельный профиль helper имеет только доступ к своей задаче.

   **Типичная ошибка:** Разрешить запуск shell без анализа унаследованных или снятых ограничений.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

50. Как отличить AppArmor denial от обычного EACCES?

   **Ответ:** EACCES — общий результат syscall, а kernel/audit logs могут содержать apparmor=DENIED с profile, operation, path и masks. Параллельно проверяют DAC/ACL и mounts: отсутствие видимого лога не доказывает, что AppArmor непричастен, из-за настроек audit и явных deny.

   **Пример:**

   ```bash
   sudo aa-status
   sudo journalctl -k --since "10 minutes ago" --grep="apparmor"
   # Найти profile, operation, name, requested_mask и denied_mask.
   # Сопоставить с отказавшей операцией приложения.
   ```

   **Типичная ошибка:** Выдать chmod 777, не установив активный profile и фактическую операцию.

   **Источник:** [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/)

### Sandboxing: seccomp, Landlock, namespaces и контейнеры

51. Что seccomp фильтрует, а что остаётся за его пределами?

   **Ответ:** Seccomp ограничивает syscalls и доступные фильтру числовые аргументы. Обычный BPF filter не может безопасно читать произвольную userspace memory, поэтому не заменяет pathname policy. Для файлов используют DAC/LSM/Landlock, для сети — соответствующие namespace и network controls.

   **Пример:** Разрешить read только на заранее открытых ресурсах легче, чем описать пути в seccomp.

   **Типичная ошибка:** Считать seccomp полноценным файловым allowlist по строкам путей.

   **Источник:** [man7: seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

52. Почему seccomp filter должен проверять архитектуру syscall ABI?

   **Ответ:** Номера syscalls и способы передачи аргументов зависят от ABI; один номер может означать разную операцию. Фильтр проверяет arch и учитывает допустимые ABI, иначе появляются обходы или ложные отказы. High-level library уменьшает ошибки encoding, но не выбирает policy за разработчика.

   **Пример:** На x86-64 нужно осмысленно учесть compat/x32 пути, если они доступны.

   **Типичная ошибка:** Сравнивать только syscall number без проверки arch.

   **Источник:** [man7: seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

53. Почему seccomp allowlist лучше составлять по сценариям, а не одному запуску strace?

   **Ответ:** Один trace не покрывает error paths, threads, resolver, allocator, signals и поведение другой libc/kernel версии. Нужно определить разрешённую функциональность, прогнать рабочие и отказные сценарии и проверить policy после обновления dependencies. Результат tracing — вход для анализа, а не доказательство полноты.

   **Пример:** Startup без DNS не раскрывает syscalls, нужные при первом lookup.

   **Типичная ошибка:** Автоматически закрепить allowlist по единственному happy-path trace.

   **Источник:** [man7: seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

54. Как применить seccomp ко всем потокам процесса?

   **Ответ:** Политика привязана к thread; при установке filter mode можно использовать TSYNC для синхронизации существующих threads при выполнении условий. Возврат и ошибки нужно проверять. Проще ограничить execution до создания workers, но это зависит от требований startup и libraries.

   **Пример:** Устанавливать согласованную filter policy перед началом обработки запросов.

   **Типичная ошибка:** Ограничить только main thread и оставить workers без filter.

   **Источник:** [man7: seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)

55. Что даёт Landlock непривилегированному процессу?

   **Ответ:** Позволяет процессу ограничить собственный доступ к поддерживаемым классам ресурсов и наследуемым execution contexts без системного root policy. Возможности зависят от Landlock ABI ядра: файловые, некоторые сетевые и другие права добавлялись постепенно. Это дополнительное ограничение, а не выдача отсутствующих прав.

   **Пример:**

   ```text
   1. Определить обязательные гарантии sandbox.
   2. Узнать Landlock ABI и поддерживаемые права.
   3. Построить ruleset и разрешить только необходимые операции.
   4. Установить no_new_privs, затем ограничить execution context.
   5. При ошибке обязательного ограничения остановить worker.
   6. Проверить allowed и denied сценарии в том же execution context.
   ```

   **Типичная ошибка:** Предполагать поддержку всех новых rights на любом ядре с Landlock.

   **Источник:** [Linux Kernel: Landlock](https://docs.kernel.org/userspace-api/landlock.html)

56. Почему при использовании Landlock нужно проверять ABI и handled rights?

   **Ответ:** Ruleset ограничивает только корректно объявленные и поддерживаемые rights. Программа должна выбрать явно описанную совместимость и определить, какие отсутствующие гарантии допустимы. Если обязательная защита недоступна, startup прерывают; молчаливый fallback создаёт ложное ощущение sandbox.

   **Пример:** Запрос ABI через LANDLOCK_CREATE_RULESET_VERSION перед построением ruleset.

   **Типичная ошибка:** Игнорировать неподдерживаемый security feature и продолжать как будто policy действует.

   **Источник:** [Linux Kernel: Landlock](https://docs.kernel.org/userspace-api/landlock.html)

57. Почему chroot не является достаточной защитой от RCE?

   **Ответ:** Он меняет корень pathname resolution, но не изолирует PID/network, не удаляет capabilities и не закрывает FD за пределами дерева. Privileged процесс при определённых условиях может обойти ожидаемые границы. Для sandbox нужны отдельные credentials, resource/LSM policy и аккуратная работа с mounts.

   **Пример:** Открытый до chroot FD всё ещё может давать доступ к внешнему ресурсу.

   **Типичная ошибка:** Оставить CAP_SYS_CHROOT и privileged FD, считая новый / полной изоляцией.

   **Источник:** [man7: chroot(2)](https://man7.org/linux/man-pages/man2/chroot.2.html)

58. Какую угрозу уменьшает user namespace и какие риски остаются?

   **Ответ:** Он отображает внутренние UID/GID на внешние IDs и ограничивает scope capabilities. Это позволяет rootless-сценарии без host root, но все процессы по-прежнему используют ядро хоста, а writable host mounts и доступные kernel interfaces требуют контроля. Политика unprivileged namespaces зависит от системы.

   **Пример:** UID 0 внутри может отображаться на обычный host UID.

   **Типичная ошибка:** Считать rootless эквивалентом отдельной VM или разрешать произвольные host mounts.

   **Источник:** [man7: user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

59. Почему доступ к Docker socket часто эквивалентен широкому доступу к хосту?

   **Ответ:** Управление привилегированным Docker daemon позволяет запускать workloads с опасными mounts и настройками. Разрешение использовать API — чувствительное административное полномочие; обычный bind mount socket внутрь контейнера не становится безопасным от read-only rootfs самого контейнера.

   **Пример:** CI job с docker.sock может управлять другими контейнерами daemon.

   **Типичная ошибка:** Добавлять service account в docker group как безопасную замену sudo без анализа daemon privileges.

   **Источник:** [Docker: Daemon attack surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)

60. Почему cgroup limits относятся и к защите от отказа в обслуживании?

   **Ответ:** Ограничения памяти, CPU, задач и I/O уменьшают последствия resource exhaustion одним workload. Они не задают confidentiality или pathname access, а лимиты должны учитывать восстановление после OOM и поведение очередей. Неограниченные application buffers всё равно опасны внутри выделенного бюджета.

   **Пример:**

   ```ini
   # Фрагмент service unit; значения нужно подобрать по нагрузке.
   [Service]
   MemoryMax=512M
   TasksMax=128
   CPUQuota=100%
   # CPUQuota=100% — бюджет одного CPU, а не всех ядер хоста.
   # Resource limits не заменяют authorisation и memory-safety checks.
   ```

   **Типичная ошибка:** Считать namespaces достаточными для ограничения памяти и числа threads.

   **Источник:** [man7: cgroups(7)](https://man7.org/linux/man-pages/man7/cgroups.7.html)

### Безопасная работа с файлами и subprocess в C/C++

61. Как избежать TOCTOU между проверкой metadata и использованием файла?

   **Ответ:** Открыть нужный объект в контролируемом контексте, затем проверять уже открытый FD через fstat и выполнять операции над ним. Для ограничения resolution используют доверенный dirfd и openat2 при поддержке. Даже корректный fstat не делает содержимое неизменным, если другой writer сохраняет доступ.

   **Пример:**

   ```c
   #include <sys/stat.h>
   #include <unistd.h>

   /* fd уже безопасно открыт относительно доверенной директории. */
   int is_regular_file(int fd) {
       struct stat st;
       if (fstat(fd, &st) == -1) return -1;
       return S_ISREG(st.st_mode) ? 1 : 0;
   }
   /* Дальнейшее чтение выполняется с этого же FD.
      Здесь не проверяются ownership и возможность конкурентной записи. */
   ```

   **Типичная ошибка:** Сначала stat(path), затем открыть path и считать объект тем же самым.

   **Источник:** [man7: stat(2)](https://man7.org/linux/man-pages/man2/stat.2.html)

62. Почему O_NOFOLLOW не защищает все компоненты пути?

   **Ответ:** Флаг обычного open ограничивает следование конечной symbolic link; промежуточные каталоги могут разрешаться через links. Для строгого ограничения всего resolution применяют dirfd/openat2 с соответствующими RESOLVE flags и проверяют доступность API. Политика должна отдельно решить вопрос mount crossings.

   **Пример:** RESOLVE_BENEATH и RESOLVE_NO_SYMLINKS для относительного пути под доверенным каталогом.

   **Типичная ошибка:** Добавить O_NOFOLLOW к произвольному абсолютному пути и считать все parents доверенными.

   **Источник:** [man7: openat2(2)](https://man7.org/linux/man-pages/man2/openat2.2.html)

63. Как безопасно открыть пользовательский относительный путь внутри data directory?

   **Ответ:** Держать FD доверенного корня и разрешать путь относительно него с проверяемыми resolution restrictions. Отклонять выход за корень и нежелательные symlinks, учитывать mount policy и требуемый тип объекта. Строковое удаление ../ не заменяет kernel-enforced resolution.

   **Пример:**

   ```c
   #define _GNU_SOURCE
   #include <linux/openat2.h>
   #include <sys/syscall.h>
   #include <unistd.h>
   #include <fcntl.h>

   /* dirfd — заранее открытый доверенный каталог, name — относительный путь. */
   int open_data(int dirfd, const char *name) {
       struct open_how how = {
           .flags = O_RDONLY | O_CLOEXEC,
           .resolve = RESOLVE_BENEATH | RESOLVE_NO_SYMLINKS
       };
       return (int)syscall(SYS_openat2, dirfd, name, &how, sizeof how);
   }
   /* RESOLVE_NO_XDEV добавляют, если политика запрещает пересечение mounts.
      Обработать ENOSYS/другие ошибки; не подменять защиту обычным open(). */
   ```

   **Типичная ошибка:** Проверять starts_with("/srv/data") без учёта symlinks и границ компонентов.

   **Источник:** [man7: openat2(2)](https://man7.org/linux/man-pages/man2/openat2.2.html)

64. Чем атомарное создание temp file безопаснее выбора случайного имени отдельно?

   **Ответ:** Mkstemp или open с `O_CREAT | O_EXCL` объединяют проверку отсутствия и создание, устраняя гонку захвата имени. Режим доступа задают сразу; после ошибки файл не используют. Нужно учесть trustworthy directory, FD_CLOEXEC и удаление временных данных по завершении.

   **Пример:**

   ```c
   #define _GNU_SOURCE
   #include <stdlib.h>
   #include <unistd.h>
   #include <fcntl.h>

   int private_temp(void) {
       char path[] = "/tmp/myapp-XXXXXX";
       int fd = mkostemp(path, O_CLOEXEC); /* Linux/glibc: атомарный CLOEXEC. */
       if (fd == -1) return -1;
       if (unlink(path) == -1) { close(fd); return -1; }
       return fd; /* Анонимный после unlink файл, вызывающий закрывает FD. */
   }
   /* Для разных приложений может понадобиться отдельный trusted temp directory. */
   ```

   **Типичная ошибка:** Сначала mktemp/exists, затем обычный fopen в общем каталоге.

   **Источник:** [man7: mkstemp(3)](https://man7.org/linux/man-pages/man3/mkstemp.3.html)

65. Зачем передавать O_CLOEXEC прямо в open, а не выставлять позже fcntl?

   **Ответ:** Атомарное создание FD с close-on-exec исключает окно, в котором другой thread делает fork/exec и передаёт секретный ресурс helper. Флаг действует при успешном exec, а не при fork. Аналоги существуют у socket, accept4, pipe2 и других APIs.

   **Пример:** Open config с `O_RDONLY | O_CLOEXEC` в multithreaded daemon.

   **Типичная ошибка:** Считать две отдельные операции open и fcntl атомарными относительно exec.

   **Источник:** [man7: open(2)](https://man7.org/linux/man-pages/man2/open.2.html)

66. Как проверить, что открытый объект — обычный файл, а не FIFO или device?

   **Ответ:** После открытия выполнить fstat и S_ISREG(st_mode), проверить ownership/permissions по политике. Но нежелательное устройство или FIFO может иметь эффект уже при open, включая блокировку; поэтому критичны доверенный каталог, resolution restrictions и соответствующие open flags. Одного последующего type check не всегда достаточно.

   **Пример:** Не принимать произвольный путь из world-writable каталога для privileged config loader.

   **Типичная ошибка:** Ожидать, что fstat после блокирующего open защитит от зависания на FIFO.

   **Источник:** [man7: stat(2)](https://man7.org/linux/man-pages/man2/stat.2.html)

67. Какие security-свойства даёт temp file + rename для config updates?

   **Ответ:** Читатели имени видят старую или новую целую версию при корректном rename в пределах mount; нужно безопасно создать temp, задать ownership/mode и защитить каталог от подмены. Durability требует отдельной синхронизации файла и каталога. Атомарная замена не проверяет доверие к новому содержимому.

   **Пример:**

   ```text
   Доверенный каталог, temp на той же ФС:
   create exclusive temp → задать/проверить mode и ownership
   → записать полностью → проверить новый config → fsync(temp)
   → rename(temp, target) → fsync(directory FD)
   На каждом шаге проверить результат и выполнить предусмотренное cleanup.
   Rename публикует новую версию, fsync относится к durability.
   ```

   **Типичная ошибка:** Считать atomic rename одновременно валидацией, авторизацией и backup.

   **Источник:** [man7: rename(2)](https://man7.org/linux/man-pages/man2/rename.2.html)

68. Почему execve с argv безопаснее system при запуске helper?

   **Ответ:** Execve не интерпретирует строку как shell language и явно задаёт executable, argv и environment. Однако helper может интерпретировать собственные options, config и входные данные. Нужны абсолютные доверенные пути, отделение options от filenames и ограниченные credentials/FD.

   **Пример:**

   ```c
   #include <unistd.h>

   /* Фрагмент child после безопасной настройки credentials и FD. */
   void run_helper(void) {
       char *const argv[] = { "/usr/local/libexec/my-helper", "--status", NULL };
       char *const envp[] = { "PATH=/usr/bin:/bin", "LANG=C", NULL };
       execve(argv[0], argv, envp);
       _exit(127); /* exec возвращается только при ошибке. */
   }
   /* Helpers, путь и config должны быть доверенными; открытые FD — ограничены. */
   ```

   **Типичная ошибка:** Считать отказ от shell защитой от option injection в самом helper.

   **Источник:** [man7: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)

69. Почему символы ; и $ не являются единственной проблемой subprocess input?

   **Ответ:** Даже без shell имя, начинающееся с -, может стать опцией, а special filenames или config directives — изменить поведение программы. Используют API helper, корректные argument boundaries и -- только там, где он поддерживается. Входные значения проверяют по контракту конкретной операции.

   **Пример:** Путь --output=/etc/target не должен неожиданно менять выходной файл helper.

   **Типичная ошибка:** Экранировать shell metacharacters и забыть об option injection.

   **Источник:** [man7: exec(3)](https://man7.org/linux/man-pages/man3/exec.3.html)

70. Как проверять личность клиента Unix domain socket?

   **Ответ:** Для connected AF_UNIX socket в Linux можно получить SO_PEERCRED; для datagram-сценариев применяются credentials ancillary data и правила их проверки. Значения относятся к OS credentials, а не автоматически к удалённой business identity; semantics snapshots и namespace нужно учитывать.

   **Пример:**

   ```c
   #define _GNU_SOURCE
   #include <sys/socket.h>

   int get_peer_uid(int fd, uid_t *uid) {
       struct ucred peer;
       socklen_t size = sizeof peer;
       if (getsockopt(fd, SOL_SOCKET, SO_PEERCRED, &peer, &size) == -1)
           return -1;
       if (size != sizeof peer) return -1;
       *uid = peer.uid;
       return 0;
   }
   /* fd — connected AF_UNIX socket; дальнейшая authorisation — по policy.
      Peer credentials относятся к определённому моменту установления связи. */
   ```

   **Типичная ошибка:** Доверять имени socket path или присланной клиентом строке username.

   **Источник:** [man7: unix(7)](https://man7.org/linux/man-pages/man7/unix.7.html)

### Ошибки памяти, hardening сборки и криптография

71. Какие меры сборки усложняют эксплуатацию ошибок памяти в C/C++?

   **Ответ:** Stack protector, PIE/ASLR, non-executable stack и RELRO закрывают разные техники эксплуатации при поддержке toolchain/platform. FORTIFY добавляет отдельные проверки известных размеров. Это mitigations, а не доказательство отсутствия memory bugs; нужные flags и итоговый ELF проверяют на целевой сборке.

   **Пример:** GCC -fhardened доступен только в поддерживающих версиях и имеет определённый набор flags.

   **Типичная ошибка:** Включить один flag и объявить бинарник memory-safe.

   **Источник:** [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

72. Чем PIE отличается от ASLR?

   **Ответ:** PIE делает основной executable пригодным к загрузке по переменным адресам; ASLR — механизм ОС, выбирающий размещение поддерживаемых областей. Нужны совместимые сборка и runtime policy. Libraries и stack могут рандомизироваться независимо от того, собран ли основной executable как PIE.

   **Пример:** Проверить ELF type и runtime mappings на тестовом процессе.

   **Типичная ошибка:** Считать -fPIE без нужного этапа линковки гарантией полной ASLR.

   **Источник:** [Linux Kernel: kernel sysctl](https://docs.kernel.org/admin-guide/sysctl/kernel.html)

73. Что защищает stack protector и какие ошибки он не исправляет?

   **Ответ:** Compiler добавляет canary checks к выбранным stack frames и аварийно завершает программу при обнаруженном повреждении. Он не устраняет исходный out-of-bounds, heap corruption и все способы overwrite; покрытие зависит от режима и toolchain. Требуется исправлять корневую ошибку.

   **Пример:** -fstack-protector-strong для поддерживаемого GCC/Clang.

   **Типичная ошибка:** Считать успешный запуск без canary crash доказательством отсутствия переполнения.

   **Источник:** [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

74. Как RELRO и BIND_NOW связаны с защитой ELF?

   **Ответ:** RELRO делает определённые relocation-related memory regions read-only после нужной фазы загрузки; eager symbol binding позволяет завершить relocation до защиты соответствующих областей. Часто full RELRO связывают с -z relro и -z now. Это не запрещает все записи в память процесса.

   **Пример:**

   ```bash
   # Пример GNU toolchain; сначала проверить поддержку на целевой платформе.
   c++ -O2 -g -fPIE -fstack-protector-strong app.cpp \
     -pie -Wl,-z,relro,-z,now -o app
   readelf -lW app
   readelf -dW app
   # Наличие GNU_RELRO и BIND_NOW оценивается вместе с остальной сборкой.
   ```

   **Типичная ошибка:** Считать только наличие GNU_RELRO гарантией полного набора hardening options.

   **Источник:** [GNU ld: Options](https://sourceware.org/binutils/docs/ld/Options.html)

75. Когда _FORTIFY_SOURCE обнаруживает ошибку?

   **Ответ:** При поддерживаемых libc/compiler и optimisation часть известных функций получает compile-time diagnostics или runtime bounds checks на основе доступных размеров объектов. Уровни и покрытие зависят от версий. Неизвестный размер, произвольный pointer arithmetic и custom functions могут остаться без нужной проверки.

   **Пример:** Сверять поддерживаемый уровень FORTIFY с toolchain, а не копировать значение вслепую.

   **Типичная ошибка:** Считать FORTIFY полной проверкой всех обращений к памяти.

   **Источник:** [glibc: Source Fortification](https://sourceware.org/glibc/manual/latest/html_node/Source-Fortification.html)

76. Почему sanitizer build не заменяет production hardening?

   **Ответ:** ASan/UBSan помогают находить ошибки на выполненных путях, но требуют специальных сборок и меняют memory layout/performance. Production mitigations имеют другую цель и тоже не гарантируют корректность. Нужны тестовые входы, fuzzing и исправление найденных дефектов, а не подавление reports.

   **Пример:**

   ```bash
   # Отдельная диагностическая сборка, не замена обычной release build.
   clang++ -O1 -g -fno-omit-frame-pointer \
     -fsanitize=address,undefined app.cpp -o app-sanitized
   ./app-sanitized
   # Нужны representative tests/fuzz inputs, а не только пустой запуск.
   ```

   **Типичная ошибка:** Отсутствие sanitizer report на одном тесте считать доказательством безопасности.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

77. Как integer overflow превращает проверку длины в уязвимость?

   **Ответ:** Переполнение при вычислении count × element_size или header + payload может дать маленькую allocation при последующей большой записи. Проверяют допустимый диапазон до арифметики и conversions. Signed overflow в C/C++ может быть UB, а unsigned wrap — корректной арифметикой, но неверной бизнес-логикой.

   **Пример:**

   ```c
   #include <stdint.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <errno.h>

   void *allocate_records(size_t count, size_t record_size) {
       if (record_size == 0 || count > SIZE_MAX / record_size) {
           errno = EOVERFLOW;
           return NULL;
       }
       return malloc(count * record_size);
   }
   /* Дополнительно нужен бизнес-лимит: корректный размер тоже может исчерпать RAM. */
   ```

   **Типичная ошибка:** Проверять только результат malloc, не проверив размер до вызова.

   **Источник:** [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

78. Почему нельзя передавать пользовательскую строку как printf format?

   **Ответ:** Format string управляет чтением аргументов и некоторыми записями; отсутствующие или недоверенные specifiers могут привести к UB и раскрытию памяти. Используют фиксированный format и отдельный data argument, корректно учитывая длину и encoding. Аналогичный принцип относится к syslog.

   **Пример:**

   ```c
   #include <stdio.h>

   void log_name(const char *name) {
       /* name должен указывать на корректную NUL-terminated строку. */
       printf("name=%s\n", name);
       /* В настоящих логах экранировать CR/LF и иные управляющие символы. */
   }
   /* printf(name) недопустим для недоверенной строки. */
   ```

   **Типичная ошибка:** Считать строку безопасной format string после ограничения общей длины.

   **Источник:** [glibc: Source Fortification](https://sourceware.org/glibc/manual/latest/html_node/Source-Fortification.html)

79. Зачем сравнивать authentication tags через constant-time API?

   **Ответ:** Обычный memcmp может завершиться на первом различии; наблюдаемое время в подходящей модели угроз раскрывает информацию о секрете. Применяют documented comparison примитив криптобиблиотеки и корректный протокол; ручной цикл без раннего выхода не гарантирует поведение optimizer и всей системы.

   **Пример:**

   ```c
   #include <openssl/crypto.h>
   #include <stddef.h>

   /* Контракт: оба buffers имеют ровно tag_size доступных байтов,
      а tag_size определён протоколом и заранее проверен. */
   int equal_tag(const unsigned char *a, const unsigned char *b, size_t tag_size) {
       return CRYPTO_memcmp(a, b, tag_size) == 0;
   }
   /* Это только сравнение; получение/проверку MAC делает криптобиблиотека. */
   ```

   **Типичная ошибка:** Считать обычный == над строками constant-time из-за малого размера token.

   **Источник:** [OpenSSL: CRYPTO_memcmp](https://docs.openssl.org/3.0/man3/CRYPTO_memcmp/)

80. Почему собственная криптографическая схема опаснее использования готового протокола?

   **Ответ:** Безопасность зависит от управления ключами, nonce, authentication, encoding и обработки ошибок, а не только выбора шифра. Для канала используют корректно настроенный TLS; для данных — проверенные AEAD APIs с соблюдением nonce requirements. Нужен maintenance и соответствие threat model.

   **Пример:** Проверять сертификатную цепочку и hostname, а не только факт TLS handshake.

   **Типичная ошибка:** Шифровать AES без authentication и считать данные защищёнными от подмены.

   **Источник:** [OpenSSL: SSL_set1_host](https://docs.openssl.org/3.0/man3/SSL_set1_host/)

### Защита службы через systemd

81. Как User и Group unit-файла помогают уменьшить последствия RCE?

   **Ответ:** Supervisor запускает процесс под заданными IDs, отделяя его DAC-доступ от root и других сервисов. Права на config, state и logs должны соответствовать этой модели. Настройка имени пользователя не отменяет унаследованные ресурсы, capabilities и дополнительные sandbox directives.

   **Пример:** Отдельный app user читает root-owned config, но пишет только в свой state directory.

   **Типичная ошибка:** Сделать весь installation directory writable сервисному пользователю.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

82. Когда DynamicUser полезен и чего от него нельзя ожидать?

   **Ответ:** Systemd может выделять временную user identity на lifetime unit и организовывать managed directories с соответствующими мерами. Для постоянного state следует использовать поддерживаемые StateDirectory и другие механизмы. Нужно учитывать повторное использование UID и требования внешнего общего доступа.

   **Пример:** Runtime identity не требует постоянного ручного создания service account.

   **Типичная ошибка:** Хранить unmanaged host files под временным UID, не оценивая его reuse.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

83. Как ProtectSystem=strict сочетается с writable state directory?

   **Ответ:** Служба получает ограниченное read-only представление большей части файлового дерева, а нужные writable места задаются managed directories/ReadWritePaths по правилам systemd. Это не абсолютная гарантия против всех способов записи: значение имеют mounts, capabilities и доступные kernel interfaces.

   **Пример:**

   ```ini
   # Фрагмент unit для службы с read-only кодом и отдельным state.
   [Service]
   User=myapp
   Group=myapp
   ProtectSystem=strict
   ProtectHome=yes
   StateDirectory=myapp
   WorkingDirectory=/var/lib/myapp
   NoNewPrivileges=yes
   PrivateTmp=yes
   # Совместимость и дополнительные writable paths проверяются для приложения.
   ```

   **Типичная ошибка:** Считать ProtectSystem заменой корректным DAC permissions для других процессов хоста.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

84. Почему PrivateTmp не заменяет безопасное создание временных файлов?

   **Ответ:** Он отделяет представление временных каталогов службы от обычного host namespace, но внутри остаются concurrency и правила pathname safety. Риски зависят от других доступных процессов и topology. Temp file всё равно создают атомарно с ограниченным mode и управляемым lifetime.

   **Пример:** PrivateTmp=yes плюс mkstemp для каждой операции.

   **Типичная ошибка:** Использовать предсказуемый filename, полагаясь только на PrivateTmp.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

85. Что именно даёт NoNewPrivileges=yes в unit?

   **Ответ:** Настраивает no_new_privs для execution lineage службы, запрещая privilege gain через exec в рамках kernel contract. Это полезно для запрета SUID/file-capability transitions, но не удаляет уже выданные capabilities и writable FD. Совместимость с нужными helpers проверяют.

   **Пример:** Helper с SUID bit не должен повышать полномочия worker.

   **Типичная ошибка:** Оставить широкий CapabilityBoundingSet и считать NoNewPrivileges полным сбросом прав.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

86. Как ограничить capabilities и address families службы?

   **Ответ:** CapabilityBoundingSet задаёт допустимую область capabilities, AmbientCapabilities — намеренно передаваемые ambient права. RestrictAddressFamilies ограничивает создание поддерживаемых семейств sockets, но не является firewall по destinations и не отменяет уже переданные FD. Выбирают минимальный набор по рабочим сценариям.

   **Пример:**

   ```ini
   [Service]
   User=myapp
   CapabilityBoundingSet=CAP_NET_BIND_SERVICE
   AmbientCapabilities=CAP_NET_BIND_SERVICE
   RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
   NoNewPrivileges=yes
   # Только для сервиса, которому нужен собственный privileged bind.
   # Socket activation может убрать необходимость и этой capability.
   ```

   **Типичная ошибка:** Запретить AF_UNIX и сломать resolver/logging либо считать AF_INET разрешением только к одному IP.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

87. Как применить SystemCallFilter без поломки редких сценариев?

   **Ответ:** Определить необходимые операции и выбрать подходящие filters, затем проверить startup, reload, threads, network и error handling на целевых systemd/libc/kernel. Группы syscalls и availability меняются по версиям; итоговую policy надо проверить на работающем unit, а не только в тексте файла.

   **Пример:** SystemCallFilter=@system-service — отправная точка для оценки, не универсальная гарантия совместимости.

   **Типичная ошибка:** Скопировать filter с другого приложения и не проверить обработку ошибок.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

88. Как передавать секреты службе через systemd credentials?

   **Ответ:** LoadCredential и родственные директивы предоставляют service-specific файлы credentials с управляемым lifetime и правами. Поддержка и шифрованные варианты зависят от версии systemd. Приложение читает credential file, избегая argv и ненужного environment inheritance, и не логирует содержимое.

   **Пример:**

   ```ini
   [Service]
   User=myapp
   LoadCredential=api_token:/etc/myapp/api_token
   # Приложение читает файл api_token внутри CREDENTIALS_DIRECTORY.
   # Передаются путь/credential handle, а не token в argv.
   # Root-owned source должен иметь подходящие закрытые permissions.
   ```

   **Типичная ошибка:** Считать credential delivery защитой от уже скомпрометированного процесса-получателя.

   **Источник:** [systemd.exec(5): Credentials](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#Credentials)

89. Почему socket activation помогает запускать сетевой сервис без лишних привилегий?

   **Ответ:** Systemd socket unit открывает endpoint, а service получает готовые FD через установленный activation protocol. Worker не обязан сам иметь capability для privileged bind. Нужно валидировать число/тип descriptors и не рассчитывать на новые bind permissions при необходимости дополнительного listener.

   **Пример:** Socket unit слушает порт, service с User=myapp принимает переданный listener.

   **Типичная ошибка:** Путать переданный listening FD с уже принятым клиентским соединением.

   **Источник:** [systemd.socket(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.socket.html)

90. Как интерпретировать systemd-analyze security?

   **Ответ:** Это статическая оценка известных unit hardening directives и их сочетаний, а не penetration test и не доказательство безопасности приложения. Высокий score может указывать на широкие permissions; каждый пункт сопоставляют с нужной функциональностью и проверяют на целевой системе.

   **Пример:**

   ```bash
   systemd-analyze security myapp.service
   systemctl cat myapp.service
   # Затем проверить реальные allowed/denied операции с теми же credentials.
   # Score — подсказка по настройкам, а не результат security audit кода.
   ```

   **Типичная ошибка:** Гнаться только за минимальным score, ломая обязательные функции или игнорируя RCE в коде.

   **Источник:** [systemd-analyze(1): security](https://www.freedesktop.org/software/systemd/man/latest/systemd-analyze.html)

### Наблюдаемость, обновления и практические инциденты

91. Какие данные стоит логировать при отказе в доступе?

   **Ответ:** Тип операции, стабильный request/correlation ID, минимальные identity attributes, код причины и безопасный идентификатор ресурса. Passwords, tokens, raw authorization headers и полный secret payload в лог не помещают. Пользовательские значения экранируют, чтобы не создавать поддельные строки журнала.

   **Пример:** reason=access_denied resource_id=report-42 request_id=...

   **Типичная ошибка:** Печатать весь запрос вместе с Authorization ради отладки одного 403.

   **Источник:** [Linux Audit: auditd.conf(5)](https://man7.org/linux/man-pages/man5/auditd.conf.5.html)

92. Чем auditd отличается от обычного application logging?

   **Ответ:** Audit фиксирует selected kernel/security events по настроенной policy и помогает связать syscalls с identity и execution context. Приложение знает business meaning запроса, которого нет в kernel event. Нужны оба слоя, корректное время, retention и наблюдение за потерями audit events.

   **Пример:**

   ```bash
   sudo auditctl -s
   sudo auditctl -l
   # Убедиться в наличии нужных rules и отсутствии потерь событий.
   # Не добавляем системные rules без плана объёма и retention.
   ```

   **Типичная ошибка:** Считать наличие auditd автоматической записью всех значимых действий без rules.

   **Источник:** [man7: auditctl(8)](https://man7.org/linux/man-pages/man8/auditctl.8.html)

93. Почему core dumps могут содержать production secrets?

   **Ответ:** Dump включает доступные области памяти, где могут находиться keys, tokens и request data. Доступ к dumps и collector policy нужно ограничивать; при необходимости исключают mappings или запрещают dumps для службы. RLIMIT_CORE=0 не универсально отменяет piped collector — проверяют system-wide policy.

   **Пример:**

   ```bash
   systemctl show myapp.service -p LimitCORE
   sysctl kernel.core_pattern
   # Если core_pattern начинается с |, dump передаётся userspace collector.
   # Его storage/access/size policy проверяется отдельно от одного RLIMIT_CORE.
   ```

   **Типичная ошибка:** Закрыть secret file, но публиковать весь core dump из memory сервиса.

   **Источник:** [man7: core(5)](https://man7.org/linux/man-pages/man5/core.5.html)

94. Когда mlock и MADV_DONTDUMP полезны для буфера секрета?

   **Ответ:** Mlock ограничивает вытеснение соответствующих страниц в swap при успешном вызове; MADV_DONTDUMP исключает mapping из обычного core dump по семантике ядра. Оба имеют пределы и требования к правам/лимитам; они не защищают от кода, уже исполняющегося внутри процесса, и не стирают прошлые копии.

   **Пример:** Выделенный page-aligned mapping с проверкой обоих вызовов.

   **Типичная ошибка:** Игнорировать ошибку mlock и считать, что секрет гарантированно не попадёт на диск.

   **Источник:** [man7: mlock(2)](https://man7.org/linux/man-pages/man2/mlock.2.html)

95. Почему ptrace и perf permissions относятся к защите секретов?

   **Ответ:** Debugging/tracing может раскрывать memory, register values, addresses и sensitive syscall buffers. Kernel проверяет credentials, dumpability, capabilities и LSM; perf имеет собственные security knobs. Диагностический доступ выдают адресно, а trace/dump сохраняют с теми же ограничениями, что исходные данные.

   **Пример:**

   ```bash
   sysctl kernel.yama.ptrace_scope
   sysctl kernel.perf_event_paranoid
   # Наличие параметров и их семантика зависят от kernel/config.
   # Диагностика читает настройки, не ослабляет их глобально.
   ```

   **Типичная ошибка:** Считать read-only diagnostic tool неспособным раскрыть production secrets.

   **Источник:** [man7: ptrace(2)](https://man7.org/linux/man-pages/man2/ptrace.2.html)

96. Почему подпись package repository не заменяет контроль происхождения сборки?

   **Ответ:** Apt-secure проверяет доверенную цепочку repository metadata и integrity packages, но это не доказывает отсутствие vulnerabilities и безопасность исходного кода. Нужны доверенный источник ключа, поддерживаемый repository, актуальные обновления и проверяемая build/release цепочка. Нельзя смешивать transport TLS и repository signature.

   **Пример:** Устанавливать пакеты из управляемого repo с ограниченными trust keys.

   **Типичная ошибка:** Отключать signature checking после ошибки загрузки metadata.

   **Источник:** [Debian: apt-secure(8)](https://manpages.debian.org/stable/apt/apt-secure.8.en.html)

97. Что обеспечивает подпись kernel module и чего она не обещает?

   **Ответ:** Она позволяет ядру проверить происхождение/целостность модуля относительно доверенных keys и политики enforcement. Подписанный код всё ещё может содержать bugs и работать с kernel privileges. Возможность загрузки зависит также от configuration, Secure Boot/lockdown и других правил системы.

   **Пример:** Kernel отвергает неподходящую подпись при обязательной проверке.

   **Типичная ошибка:** Считать любой подписанный module безопасным для загрузки в production.

   **Источник:** [Linux Kernel: Module signing](https://docs.kernel.org/admin-guide/module-signing.html)

98. Какие первые действия разумны при подозрении на компрометацию сервиса?

   **Ответ:** Действовать по incident plan: ограничить дальнейший доступ, сохранить нужные evidence и timelines, отозвать credentials и выяснить затронутые ресурсы. Не доверять только executable/config на скомпрометированном хосте; восстановление требует известного доверенного состояния. Изоляция должна учитывать сохранение доступа для расследования.

   **Пример:** Зафиксировать identity/process/network данные и централизованные audit logs перед изменениями.

   **Типичная ошибка:** Ограничиться restart, оставив украденные tokens действительными и потеряв evidence.

   **Источник:** [NIST SP 800-61 Rev. 3: Incident Response](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

99. Как проверить, что sandbox действительно запрещает лишние действия?

   **Ответ:** Кроме positive tests нужны controlled negative tests от фактической identity службы: чтение постороннего файла, лишний exec, запрещённый bind или syscall. Проверяют errno, logs и сохранность штатных сценариев. Тест запускают в отдельном окружении с реальной policy, а не только анализируют config.

   **Пример:** Worker читает разрешённый state, но получает отказ для специально созданного чужого test file.

   **Типичная ошибка:** Проверять доступ только от root-shell на хосте, а не из execution context службы.

   **Источник:** [systemd.exec(5)](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html)

100. Как разбирать Permission denied без ослабления всей системы?

   **Ответ:** Найти syscall и объект, проверить real/effective/fs IDs, группы, caps, путь, ACL, mount options и активные LSM/sandbox policies. Затем изменить минимальный необходимый параметр и повторить positive/negative checks. Для API, скрывающих причину, сопоставить application error с kernel/audit logs.

   **Пример:**

   ```bash
   # Учебный пример диагностики: заменить PID и путь фактическими.
   cat /proc/1234/status
   namei -l /srv/myapp/data
   getfacl /srv/myapp/data
   findmnt -T /srv/myapp/data
   # При необходимости добавить LSM audit logs и ограниченный strace.
   # Проверять из того же mount/user namespace, что и процесс службы.
   ```

   **Типичная ошибка:** Последовательно отключить SELinux, seccomp и права до успеха, не установив первопричину.

   **Источник:** [man7: path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)
