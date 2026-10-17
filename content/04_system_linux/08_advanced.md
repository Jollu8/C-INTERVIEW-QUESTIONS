## Advanced — Questions (C/C++ oriented)

### Kernel Modules
1. Что такое kernel module?

   **Ответ:** Объектный код, загружаемый в работающее ядро для расширения его функций; выполняется с полномочиями ядра.

   **Пример:** Драйвер устройства в `.ko`.

   **Типичная ошибка:** Считать модуль изолированным процессом.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

2. Зачем нужны loadable kernel modules (LKM)?

   **Ответ:** Чтобы подключать драйверы и подсистемы по необходимости без включения всего кода в образ ядра.

   **Пример:** Модуль можно выгрузить только при поддержке и отсутствии активных ссылок.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

3. Чем module отличается от встроенного в ядро кода?

   **Ответ:** Built-in код входит в образ и доступен при загрузке; module подключается отдельно, но после загрузки работает в том же kernel space.

   **Типичная ошибка:** Путать module ABI с устойчивым userspace syscall ABI Linux.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

4. Какие преимущества у модулей?

   **Ответ:** Меньший базовый образ, загрузка по требованию, удобство разработки и замены некоторых компонентов.

   **Пример:** Совместимость с версией и конфигурацией ядра обязательна.

   **Типичная ошибка:** Считать, что любой драйвер можно безопасно выгрузить на работающем устройстве.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

5. Какие риски у kernel modules?

   **Ответ:** Ошибки могут повредить память всего ядра, вызвать panic или открыть уязвимость; модуль не имеет process-level изоляции.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

6. Что происходит при загрузке модуля?

   **Ответ:** Ядро проверяет формат и ограничения, размещает секции, разрешает symbols/relocations и вызывает init; при ошибке init загрузка отклоняется.

   **Типичная ошибка:** Игнорировать ошибку init после частичной регистрации ресурсов.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

7. Что делает insmod?

   **Ответ:** Загружает указанный файл модуля; не разрешает автоматически зависимости так, как modprobe.

   **Пример:** `insmod ./demo.ko` — операция изменения ядра.

   **Типичная ошибка:** Ожидать, что insmod сам найдёт и загрузит все dependency modules.

   **Источник:** [man7: insmod(8)](https://man7.org/linux/man-pages/man8/insmod.8.html)

8. Чем insmod отличается от modprobe?

   **Ответ:** Modprobe ищет модуль по имени, учитывает dependencies, aliases и конфигурацию; insmod работает с конкретным файлом.

   **Источник:** [man7: modprobe(8)](https://man7.org/linux/man-pages/man8/modprobe.8.html)

9. Что делает rmmod?

   **Ответ:** Просит выгрузить модуль; ядро может отказать, если он используется или выгрузка недоступна.

   **Пример:** Не использовать forced unload как обычный способ обновления.

   **Источник:** [man7: rmmod(8)](https://man7.org/linux/man-pages/man8/rmmod.8.html)

10. Как посмотреть загруженные модули?

   **Ответ:** Через `lsmod` или `/proc/modules`; built-in компоненты в списке загруженных modules не показываются.

   **Пример:**

   ```bash
   uname -r
   lsmod
   modinfo loop
   # Built-in drivers могут отсутствовать в lsmod.
   ```

   **Типичная ошибка:** Считать отсутствие имени в lsmod доказательством отсутствия built-in функции.

   **Источник:** [man7: lsmod(8)](https://man7.org/linux/man-pages/man8/lsmod.8.html)

11. Что показывает lsmod?

   **Ответ:** Имя, размер и сведения об использовании загруженных модулей; это не точное измерение всего потребления памяти драйвером.

   **Источник:** [man7: lsmod(8)](https://man7.org/linux/man-pages/man8/lsmod.8.html)

12. Где хранятся модули в системе?

   **Ответ:** Обычно в `/lib/modules/$(uname -r)/`, в usr-merged системах путь может вести в `/usr/lib/modules/`.

   **Типичная ошибка:** Загружать .ko от другого release/config ядра, полагаясь только на совпадение имени.

   **Источник:** [man7: modprobe(8)](https://man7.org/linux/man-pages/man8/modprobe.8.html)

13. Что такое /lib/modules?

   **Ответ:** Дерево модулей и индексов для установленных releases ядра, используемое modprobe и depmod.

   **Источник:** [man7: modprobe(8)](https://man7.org/linux/man-pages/man8/modprobe.8.html)

14. Что такое dependency modules?

   **Ответ:** Модули, предоставляющие symbols или функциональность, необходимые другим модулям.

   **Пример:** Зависимость не означает независимую ABI-стабильность.

   **Источник:** [man7: modprobe(8)](https://man7.org/linux/man-pages/man8/modprobe.8.html)

15. Как modprobe работает с зависимостями?

   **Ответ:** Читает индексы, созданные depmod, и загружает необходимые зависимости перед целевым модулем.

   **Источник:** [man7: modprobe(8)](https://man7.org/linux/man-pages/man8/modprobe.8.html)

16. Что такое kernel symbol?

   **Ответ:** Именованная функция или переменная ядра/модуля, которую linker и loader могут сопоставить адресу.

   **Пример:** Не каждый symbol доступен модулям.

   **Типичная ошибка:** Использовать внутренний kernel symbol как стабильный внешний контракт.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

17. Что такое export symbol?

   **Ответ:** Symbol, опубликованный через EXPORT_SYMBOL или аналог; GPL-only exports требуют совместимых условий использования.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

18. Что такое printk()?

   **Ответ:** Функция kernel logging, записывающая форматированное сообщение с уровнем важности в kernel log buffer.

   **Пример:** Обычно удобнее `pr_info()`/`pr_err()`.

   **Типичная ошибка:** Печатать секреты или неограниченный поток сообщений из горячего пути.

   **Источник:** [Linux Kernel: printk basics](https://docs.kernel.org/core-api/printk-basics.html)

19. Чем printk отличается от printf?

   **Ответ:** Printf относится к userspace stdio, printk — к kernel logging; доступные format specifiers и контекст вызова различаются.

   **Источник:** [Linux Kernel: printk basics](https://docs.kernel.org/core-api/printk-basics.html)

20. Где смотреть вывод printk?

   **Ответ:** Через `dmesg`, `journalctl -k` или систему kernel log collection; чтение может требовать прав.

   **Пример:**

   ```bash
   journalctl -k -b
   dmesg --level=err,warn
   ```

   **Типичная ошибка:** Считать отсутствие сообщения доказательством, что init не выполнялся: влияют levels, permissions и ring-buffer overflow.

   **Источник:** [Linux Kernel: printk basics](https://docs.kernel.org/core-api/printk-basics.html)

21. Что такое dmesg?

   **Ответ:** Утилита чтения и управления kernel ring buffer messages.

   **Пример:** `dmesg --level=err,warn`.

   **Типичная ошибка:** Не все сообщения гарантированно сохраняются после переполнения буфера.

   **Источник:** [man7: dmesg(1)](https://man7.org/linux/man-pages/man1/dmesg.1.html)

22. Что такое module_init?

   **Ответ:** Макрос регистрации функции инициализации: вызывается при загрузке модуля либо в boot initcall для built-in кода.

   **Типичная ошибка:** Вернуть успех, не завершив обязательную регистрацию устройства.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

23. Что такое module_exit?

   **Ответ:** Макрос регистрации функции очистки при выгрузке; нужно освободить ресурсы и исключить активные callbacks.

   **Типичная ошибка:** Освободить состояние, пока workqueue/timer/IRQ callback ещё может к нему обратиться.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

24. Как выглядит минимальный kernel module?

   **Ответ:** Нужны init, exit и MODULE_LICENSE; init возвращает 0 при успехе, отрицательный errno при ошибке.

   **Пример:**

   ```c
   #include <linux/init.h>
   #include <linux/module.h>
   #include <linux/printk.h>

   static int __init demo_init(void) {
       pr_info("demo: loaded\n");
       return 0;
   }

   static void __exit demo_exit(void) {
       pr_info("demo: unloaded\n");
   }

   module_init(demo_init);
   module_exit(demo_exit);
   MODULE_LICENSE("GPL");
   MODULE_DESCRIPTION("Minimal learning module");
   /* Собирать через kernel build system с headers целевого ядра,
      а не обычной линковкой с libc. Проверять в учебной VM. */
   ```

   **Типичная ошибка:** Линковать модуль обычным gcc с libc вместо Kbuild целевого ядра.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

25. Почему нельзя использовать libc внутри kernel module?

   **Ответ:** Libc — userspace-библиотека с иной средой и ABI; kernel modules используют внутренние kernel APIs.

   **Пример:** Malloc/printf заменяются подходящими kernel APIs.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

26. Что такое kernel space memory allocation?

   **Ответ:** Выделение памяти из kernel allocators с учётом контекста, размера, физической непрерывности и допустимости ожидания.

   **Источник:** [Linux Kernel: memory allocation](https://docs.kernel.org/core-api/memory-allocation.html)

27. Чем kmalloc отличается от malloc?

   **Ответ:** Kmalloc выделяет физически непрерывную kernel memory с GFP flags, malloc — userspace memory через libc; освобождение kfree и free соответственно.

   **Типичная ошибка:** Считать kmalloc подходящим для любых огромных непрерывных allocations.

   **Источник:** [Linux Kernel: memory allocation](https://docs.kernel.org/core-api/memory-allocation.html)

28. Что такое GFP flags?

   **Ответ:** Флаги, определяющие reclaim, допустимость сна, зоны и резервы allocation.

   **Пример:**

   ```c
   #include <linux/slab.h>
   #include <linux/errno.h>

   /* Фрагмент: только sleepable context. */
   static int allocate_demo(void) {
       void *buffer = kzalloc(4096, GFP_KERNEL);
       if (!buffer) return -ENOMEM;
       /* Работа с buffer. */
       kfree(buffer);
       return 0;
   }
   ```

   **Типичная ошибка:** Считать GFP_ATOMIC гарантией успеха.

   **Источник:** [Linux Kernel: memory allocation](https://docs.kernel.org/core-api/memory-allocation.html)

29. Что такое preemption в kernel?

   **Ответ:** Возможность вытеснения текущей kernel task более приоритетной/готовой; правила зависят от preemption model и текущего контекста.

   **Типичная ошибка:** Отключением preemption пытаться защититься от параллельной работы на других CPU.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

30. Можно ли блокировать в kernel module?

   **Ответ:** В sleepable process context — да; в hard IRQ и под обычным spinlock блокироваться нельзя.

   **Пример:** Не вызывать mutex_lock/GFP_KERNEL в atomic context.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

31. Что такое interrupt handler?

   **Ответ:** Функция обработки прерывания устройства; hard IRQ handler должен быть коротким и не спать, тяжёлую работу переносят в допустимый контекст.

   **Типичная ошибка:** Выполнять блокирующее I/O в hard IRQ handler.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

32. Можно ли писать драйвер как kernel module?

   **Ответ:** Да, многие драйверы загружаются модулями; сам module также может реализовывать ФС или иной subsystem.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

33. Что такое character device driver?

   **Ответ:** Драйвер символьного устройства, предоставляющий операции FD над потоком или командами, а не стандартный block-addressed storage API.

   **Типичная ошибка:** Считать character device обязательно терминалом или последовательным портом.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

34. Что такое block device driver?

   **Ответ:** Драйвер устройства с блочным адресуемым I/O, интегрированный с block layer и очередями запросов.

   **Пример:** SSD/NVMe storage drivers.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

35. Как module взаимодействует с /dev?

   **Ответ:** Регистрирует устройство в kernel device model; devtmpfs/udev обычно создают node в `/dev`, через который приложение получает доступ.

   **Типичная ошибка:** Создать mknod и ожидать работоспособности устройства без зарегистрированного driver.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

36. Что такое file_operations?

   **Ответ:** Таблица callbacks VFS для операций файла: open, read/write или iter-варианты, poll, mmap, release и другие.

   **Типичная ошибка:** Использовать userspace pointer в callback без copy_to_user/copy_from_user и проверок.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

37. Как реализуется open/read/write в драйвере?

   **Ответ:** Зарегистрировать callbacks, вести состояние и синхронизацию, проверять размеры и безопасно передавать данные через user-copy APIs.

   **Пример:** Не разыменовывать userspace pointer напрямую.

   **Типичная ошибка:** Забывать про partial transfers, lifetime и конкурентные операции нескольких FD.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

38. Что такое major/minor numbers?

   **Ответ:** Major определяет зарегистрированный диапазон/драйвер устройства, minor — конкретное устройство/экземпляр в его схеме адресации.

   **Типичная ошибка:** Хардкодить major, уже занятый другим драйвером.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

39. Что такое udev?

   **Ответ:** Userspace device manager, обрабатывающий события ядра, назначающий права, symlinks и правила для устройств.

   **Пример:** Device node не является самим драйвером.

   **Источник:** [man7: udev(7)](https://man7.org/linux/man-pages/man7/udev.7.html)

40. Почему kernel panic возможен при ошибке в module?

   **Ответ:** Модуль выполняется в общей памяти ядра; выход за границы, use-after-free или неверная синхронизация могут повредить критическое состояние.

   **Источник:** [Linux Kernel: driver basics](https://docs.kernel.org/driver-api/driver-basics.html)

---

### cgroups
41. Что такое cgroups?

   **Ответ:** Control groups — механизм группировки задач для учёта, ограничения и распределения ресурсов.

   **Пример:** Современный интерфейс обычно cgroup v2.

   **Типичная ошибка:** Путать cgroup membership с отдельным PID/network namespace.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

42. Зачем нужны cgroups?

   **Ответ:** Для ограничения noisy neighbors, учёта ресурсов и управления workload как группой, включая потомков.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

43. Какие ресурсы можно ограничивать через cgroups?

   **Ответ:** CPU time, память, I/O bandwidth/IOPS, число задач и другие ресурсы при наличии controllers.

   **Пример:** Контроллер pids считает tasks, включая threads.

   **Типичная ошибка:** Задать pids.max как число процессов, забыв о создаваемых threads.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

44. Что такое CPU cgroup?

   **Ответ:** Группа с CPU controller: относительный вес и/или потолок CPU bandwidth.

   **Пример:** V2: cpu.weight, cpu.max.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

45. Что такое memory cgroup?

   **Ответ:** Учёт и лимиты памяти cgroup; v2 различает pressure threshold memory.high и hard limit memory.max.

   **Типичная ошибка:** Ограничивать только RSS в monitoring и игнорировать учитываемый page cache/kernel memory.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

46. Что такое IO cgroup?

   **Ответ:** Контроллер ограничения/распределения I/O по устройствам; эффект зависит от kernel, block stack и поддерживаемой атрибуции I/O.

   **Пример:** V2: io.max и io.weight.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

47. Что такое pids cgroup?

   **Ответ:** Ограничивает число tasks в группе и потомках; новые fork/clone могут вернуть EAGAIN.

   **Пример:** V2: pids.max.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

48. Чем cgroups v1 отличается от v2?

   **Ответ:** V1 допускает отдельные controller hierarchies; v2 использует единую иерархию и согласованные интерфейсы/правила delegation.

   **Пример:** Не смешивать названия файлов разных версий.

   **Типичная ошибка:** Записать v1 filename в unified v2 hierarchy и не проверить результат.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

49. Что такое hierarchy в cgroups?

   **Ответ:** Дерево cgroups: ограничения и распределение ресурсов действуют с учётом предков.

   **Пример:** Лимит дочерней группы не отменяет лимит родителя.

   **Типичная ошибка:** Считать лимит дочерней группы независимым от родительского потолка.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

50. Что такое controller?

   **Ответ:** Подсистема контроля конкретного ресурса, например cpu, memory, io, pids.

   **Пример:** Наличие файла зависит от включённых controllers.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

51. Как процесс попадает в cgroup?

   **Ответ:** Наследует группу при создании либо перемещается manager/записью PID в cgroup.procs при разрешении доступа.

   **Пример:** Systemd обычно должен управлять своим subtree самостоятельно.

   **Типичная ошибка:** Перемещать PID в cgroup без прав delegation и игнорировать отказ.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

52. Как ограничить CPU для процесса?

   **Ответ:** В v2 задают cpu.max как quota и period, например `50000 100000` — половина CPU в среднем на период.

   **Пример:**

   ```bash
   # Пример для хоста с systemd: временный scope, ограниченный 50% одного CPU.
   systemd-run --user --scope -p CPUQuota=50% ./app
   # Требуется доступный user manager и делегированный CPU controller.
   ```

   **Типичная ошибка:** Считать CPUQuota=100% разрешением использовать все ядра машины.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

53. Как ограничить память?

   **Ответ:** В v2 задать memory.max; для мягкого давления использовать memory.high, а swap ограничивать отдельно.

   **Пример:**

   ```bash
   systemd-run --user --scope -p MemoryMax=512M ./app
   # Наличие user manager/controller delegation зависит от окружения.
   ```

   **Типичная ошибка:** Выставить MemoryMax ниже нормального working set без теста восстановления.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

54. Что происходит при превышении memory limit?

   **Ответ:** При memory.high начинается reclaim/throttling; при невозможности уложиться в memory.max может сработать cgroup OOM killer.

   **Пример:** Превышение не всегда немедленно убивает процесс.

   **Типичная ошибка:** Считать memory.high эквивалентом жёсткого memory.max.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

55. Что такое OOM killer?

   **Ответ:** Механизм выбора и завершения задач при неразрешимой нехватке памяти; cgroup OOM может быть локализован соответствующим subtree.

   **Типичная ошибка:** Лечить OOM только расширением лимита, не проверяя неограниченный рост данных.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

56. Как cgroups взаимодействует с scheduler?

   **Ответ:** CPU controller задаёт bandwidth/weight, которые учитываются scheduler; cpuset отдельно ограничивает допустимые CPU и NUMA nodes.

   **Типичная ошибка:** Использовать CPU quota как замену affinity или cpuset.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

57. Что такое cpu.shares?

   **Ответ:** В v1 относительный вес CPU между конкурирующими группами, а не жёсткий процент; в v2 аналог — cpu.weight.

   **Пример:**

   ```text
   cgroup v1: cpu.shares               → относительный вес
   cgroup v1: cpu.cfs_quota_us/period_us → потолок CPU time
   cgroup v2: cpu.weight               → относительный вес
   cgroup v2: cpu.max                  → "quota period" или "max period"
   ```

   **Типичная ошибка:** Считать weight гарантированным фиксированным процентом CPU.

   **Источник:** [Linux Kernel: CFS Bandwidth Control](https://docs.kernel.org/scheduler/sched-bwc.html)

58. Что такое cpu.quota?

   **Ответ:** Обычно имеют в виду v1 cpu.cfs_quota_us вместе с cpu.cfs_period_us; v2 использует cpu.max.

   **Пример:** Файла с универсальным именем cpu.quota нет.

   **Типичная ошибка:** Настраивать несуществующий универсальный файл cpu.quota.

   **Источник:** [Linux Kernel: CFS Bandwidth Control](https://docs.kernel.org/scheduler/sched-bwc.html)

59. Чем shares отличаются от quota?

   **Ответ:** Shares/weight делят CPU при конкуренции; quota ограничивает время даже при свободных CPU.

   **Пример:** Вес не гарантирует выделенный минимум без условий нагрузки.

   **Типичная ошибка:** Ожидать, что свободный CPU отменит исчерпанную hard quota.

   **Источник:** [Linux Kernel: CFS Bandwidth Control](https://docs.kernel.org/scheduler/sched-bwc.html)

60. Что такое memory.swap?

   **Ответ:** Это общее обозначение swap controls: в v2 memory.swap.current/max, в v1 обычно memory.memsw.* при включённом учёте.

   **Пример:** V1 memsw объединяет память и swap, v2 swap.max ограничивает swap отдельно.

   **Типичная ошибка:** Переносить значения v1 memsw limit в v2 swap.max без пересчёта смысла.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

61. Что такое memory.limit_in_bytes?

   **Ответ:** V1 hard limit памяти cgroup в байтах; для v2 используется memory.max.

   **Пример:** Не копировать v1-настройки в v2 без перевода семантики.

   **Источник:** [man7: cgroups(7)](https://man7.org/linux/man-pages/man7/cgroups.7.html)

62. Как посмотреть cgroup процесса?

   **Ответ:** `cat /proc/PID/cgroup`; в v2 строка вида `0::/path` показывает путь в unified hierarchy.

   **Пример:**

   ```bash
   cat /proc/self/cgroup
   findmnt -t cgroup,cgroup2
   # На v2 ожидается запись вида: 0::/user.slice/...
   ```

   **Типичная ошибка:** Интерпретировать container-visible cgroup path как абсолютный путь хоста.

   **Источник:** [man7: proc_pid_cgroup(5)](https://man7.org/linux/man-pages/man5/proc_pid_cgroup.5.html)

63. Что такое /sys/fs/cgroup?

   **Ответ:** Обычная точка монтирования cgroupfs; layout зависит от v1/v2 и mount namespace.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

64. Как systemd использует cgroups?

   **Ответ:** Создаёт cgroups для units и slices, управляет resource controls и lifetime сервисов.

   **Пример:** CPUQuota=, MemoryMax=, TasksMax=.

   **Типичная ошибка:** Вручную менять systemd-owned cgroup, конфликтуя с менеджером.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

65. Как Docker использует cgroups?

   **Ответ:** Runtime размещает процессы контейнера в cgroup и применяет limits, заданные Docker/API/orchestrator.

   **Пример:** Контейнер без заданных limits не получает их автоматически.

   **Типичная ошибка:** Считать Docker-контейнер автоматически ограниченным по memory/CPU.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

66. Можно ли использовать cgroups без контейнеров?

   **Ответ:** Да, это независимый механизм ядра; доступен через systemd units/scopes или прямое делегированное управление.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

67. Что такое throttling CPU?

   **Ответ:** Временная остановка исполнения группы после исчерпания CPU quota до следующего периода.

   **Пример:** V2 cpu.stat показывает throttling counters.

   **Типичная ошибка:** Объяснять latency только загрузкой хоста, игнорируя throttled group.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

68. Что такое pressure stall information (PSI)?

   **Ответ:** Метрики времени, потерянного из-за ожидания CPU, memory или I/O; доступны глобально и для поддерживаемых cgroups.

   **Пример:**

   ```bash
   cat /proc/pressure/cpu
   cat /proc/pressure/memory
   cat /proc/pressure/io
   # avg10/avg60/avg300 — доля stall time, не объём потребления ресурса.
   ```

   **Типичная ошибка:** Приравнивать PSI к проценту занятой памяти или CPU utilization.

   **Источник:** [man7: proc_pressure(5)](https://man7.org/linux/man-pages/man5/proc_pressure.5.html)

69. Почему cgroups важны для multi-tenant систем?

   **Ответ:** Ограничивают потребление одного tenant и позволяют видеть его нагрузку отдельно.

   **Пример:** Лимиты не заменяют полноценную security isolation.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

70. Какие проблемы решает cgroups для backend сервисов?

   **Ответ:** Лимиты памяти/задач, CPU fairness и наблюдаемость помогают предсказуемо обслуживать несколько сервисов на одном хосте.

   **Источник:** [Linux Kernel: cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

---

### Namespaces
71. Что такое namespaces?

   **Ответ:** Механизм отдельных представлений определённых глобальных ресурсов ядра для групп процессов.

   **Типичная ошибка:** Считать namespaces отдельной копией ядра, как у VM.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

72. Зачем нужны namespaces?

   **Ответ:** Для изоляции идентификаторов, сети, mounts и других ресурсов без отдельного ядра гостевой ОС.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

73. Какие типы namespaces существуют?

   **Ответ:** Mount, UTS, IPC, PID, network, user, cgroup и time; поддержка зависит от ядра/configuration.

   **Пример:** Забывать time namespace в современных Linux.

   **Типичная ошибка:** Перечислять только шесть старых типов и забывать cgroup/time.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

74. Что такое PID namespace?

   **Ответ:** Отдельное пространство PID; процесс может иметь разные PID в своём и родительских namespaces.

   **Типичная ошибка:** Искать container PID напрямую в /proc хоста под тем же номером.

   **Источник:** [man7: pid_namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html)

75. Что такое mount namespace?

   **Ответ:** Отдельное дерево mounts и их видимость; propagation определяет распространение изменений.

   **Пример:** Сам namespace не делает каждый mount private.

   **Типичная ошибка:** Создать mount namespace, но оставить нежелательную shared propagation.

   **Источник:** [man7: mount_namespaces(7)](https://man7.org/linux/man-pages/man7/mount_namespaces.7.html)

76. Что такое network namespace?

   **Ответ:** Отдельные сетевые interfaces, routes, sockets/ports и сетевые настройки с соответствующей семантикой namespace.

   **Типичная ошибка:** Ожидать сетевой связности нового net namespace без interfaces/routes.

   **Источник:** [man7: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html)

77. Что такое user namespace?

   **Ответ:** Пространство UID/GID mappings и scoped capabilities: IDs внутри могут отображаться на другие IDs снаружи.

   **Типичная ошибка:** Считать root внутри user namespace неограниченным root хоста.

   **Источник:** [man7: user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

78. Что такое IPC namespace?

   **Ответ:** Изоляция System V IPC и POSIX message queues; не означает автоматически изоляцию всех shared-memory файлов.

   **Типичная ошибка:** Ожидать, что IPC namespace автоматически изолирует файл shared memory на общем mount.

   **Источник:** [man7: ipc_namespaces(7)](https://man7.org/linux/man-pages/man7/ipc_namespaces.7.html)

79. Что такое UTS namespace?

   **Ответ:** Изоляция hostname и NIS domain name.

   **Пример:** Hostname контейнера может отличаться от хоста.

   **Источник:** [man7: uts_namespaces(7)](https://man7.org/linux/man-pages/man7/uts_namespaces.7.html)

80. Что такое cgroup namespace?

   **Ответ:** Виртуализирует видимый корень/пути cgroup hierarchy; сам по себе не задаёт resource limits.

   **Типичная ошибка:** Использовать cgroup namespace вместо настройки resource controllers.

   **Источник:** [man7: cgroup_namespaces(7)](https://man7.org/linux/man-pages/man7/cgroup_namespaces.7.html)

81. Как namespaces изолируют процессы?

   **Ответ:** Каждый процесс видит ресурсы соответствующих namespaces; доступ к общим объектам и privileges остаётся предметом отдельных проверок.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

82. Что такое container с точки зрения namespaces?

   **Ответ:** Обычные host processes в наборе namespaces с rootfs, cgroups и security policy; это не отдельная VM.

   **Типичная ошибка:** Считать контейнер обязательной отдельной VM.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

83. Как PID namespace влияет на PID внутри контейнера?

   **Ответ:** PID внутри может быть 1, а снаружи — другой; предки namespace могут видеть процесс под своими PID.

   **Источник:** [man7: pid_namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html)

84. Почему PID 1 в контейнере особенный?

   **Ответ:** Namespace init усыновляет orphan descendants, должен reap children и имеет особые правила сигналов; его завершение уничтожает оставшиеся процессы namespace.

   **Типичная ошибка:** Не reap дочерние процессы и накапливать zombies в PID namespace.

   **Источник:** [man7: pid_namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html)

85. Что такое mount isolation?

   **Ответ:** Независимая видимость подключённых ФС; shared propagation нужно настроить, чтобы изменения не утекали в другие mount trees.

   **Источник:** [man7: mount_namespaces(7)](https://man7.org/linux/man-pages/man7/mount_namespaces.7.html)

86. Как network namespace изолирует сеть?

   **Ответ:** Даёт отдельные interfaces/routes/port space; доступ наружу организуют через veth/bridge/routing/NAT или другой механизм.

   **Источник:** [man7: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html)

87. Что такое veth pair?

   **Ответ:** Пара связанных виртуальных Ethernet-интерфейсов: отправка с одного конца доставляется на другой.

   **Пример:** Концы часто находятся в разных net namespaces.

   **Типичная ошибка:** Создать veth pair, но не настроить addresses, links и routes.

   **Источник:** [man7: veth(4)](https://man7.org/linux/man-pages/man4/veth.4.html)

88. Как работает loopback внутри namespace?

   **Ответ:** Loopback принадлежит конкретному net namespace; localhost ведёт к нему самому, а link lo нужно административно включить.

   **Типичная ошибка:** Забыть поднять lo в созданном net namespace.

   **Источник:** [man7: network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html)

89. Что такое user namespace?

   **Ответ:** Изолированное представление IDs с uid_map/gid_map; root внутри может соответствовать непривилегированному UID снаружи.

   **Источник:** [man7: user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

90. Почему user namespace важен для безопасности?

   **Ответ:** Позволяет иметь scoped root privileges для namespace операций без выдачи host root; доступ к ядру и ошибки его реализации всё ещё важны.

   **Типичная ошибка:** Считать user namespace единственной достаточной защитой контейнера.

   **Источник:** [man7: user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

91. Можно ли внутри user namespace получить root?

   **Ответ:** Да, процесс может иметь UID 0 и capabilities внутри своего user namespace при настроенном mapping.

   **Пример:** Это не CAP_SYS_ADMIN в initial namespace.

   **Источник:** [man7: user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

92. Что такое root внутри namespace vs реальный root?

   **Ответ:** Namespace root действует в пределах scoped capabilities и ID mappings; host root имеет полномочия initial user namespace, если не ограничен дополнительно.

   **Источник:** [man7: user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

93. Как посмотреть namespaces процесса?

   **Ответ:** `lsns -p PID` и `ls -l /proc/PID/ns`; доступ зависит от procfs и ptrace permissions.

   **Пример:**

   ```bash
   lsns -p 1234
   ls -l /proc/1234/ns
   readlink /proc/self/ns/net
   ```

   **Типичная ошибка:** Сравнивать только название ссылки net, а не namespace identity.

   **Источник:** [man7: lsns(8)](https://man7.org/linux/man-pages/man8/lsns.8.html)

94. Что такое /proc/<pid>/ns?

   **Ответ:** Ссылки на namespace handles: net, mnt, pid, user и другие; одинаковые IDs помогают увидеть общий namespace.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

95. Что делает unshare()?

   **Ответ:** Отделяет часть execution context от текущего процесса; с CLONE_NEW* создаёт namespace. PID/time namespace применяются к будущим children.

   **Типичная ошибка:** Ожидать, что unshare(CLONE_NEWPID) изменит PID самого вызывающего процесса.

   **Источник:** [man7: unshare(2)](https://man7.org/linux/man-pages/man2/unshare.2.html)

96. Что делает clone() с флагами namespace?

   **Ответ:** Создаёт дочернюю задачу с новыми или разделяемыми namespaces по CLONE_NEW* flags и правилам привилегий.

   **Источник:** [man7: clone(2)](https://man7.org/linux/man-pages/man2/clone.2.html)

97. Как создать свой namespace вручную?

   **Ответ:** Например, `unshare --user --map-root-user --mount --pid --fork --mount-proc sh`, если unprivileged user namespaces разрешены.

   **Пример:**

   ```bash
   # Если политика разрешает создание user namespaces:
   unshare --user --map-root-user --mount --pid --fork --mount-proc sh
   # Внутри: UID/PID могут быть 0/1, но это не host-root privileges.
   id
   ps -ef
   ```

   **Типичная ошибка:** Выполнить mount commands на хосте вместо созданного namespace.

   **Источник:** [man7: unshare(1)](https://man7.org/linux/man-pages/man1/unshare.1.html)

98. Как namespaces используются в Docker?

   **Ответ:** Runtime создаёт нужные namespaces, настраивает rootfs, сеть и UID mappings согласно container configuration.

   **Типичная ошибка:** Использовать --network=host и продолжать предполагать отдельное пространство портов.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

99. Как namespaces сочетаются с cgroups?

   **Ответ:** Namespaces определяют видимость ресурсов, cgroups — их учёт и limits; механизмы независимы и дополняют друг друга.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

100. Почему namespaces — основа контейнеризации?

   **Ответ:** Позволяют обычным процессам получить отдельное системное окружение, а runtime добавляет rootfs, resource controls и security policy.

   **Источник:** [man7: namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

---

### strace / ltrace
101. Что делает strace?

   **Ответ:** Наблюдает системные вызовы, их аргументы, результаты и сигналы процесса.

   **Пример:** `strace -o trace.log ./app`.

   **Типичная ошибка:** Считать strace профилировщиком всех C++ функций.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

102. Что такое system call tracing?

   **Ответ:** Трассировка границы userspace/kernel, показывающая операции приложения с ОС, а не все функции программы.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

103. Как запустить программу через strace?

   **Ответ:** `strace -f -o trace.log ./app arg`; `-f` отслеживает создаваемые задачи.

   **Пример:**

   ```bash
   strace -f -tt -T -o trace.log ./app arg
   ```

   **Типичная ошибка:** Забыть -f и пропустить дочерний worker с реальной ошибкой.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

104. Как прицепиться к уже работающему процессу?

   **Ответ:** `strace -p PID`, при необходимости `-f`; нужны права ptrace.

   **Пример:** Attach может повлиять на latency.

   **Типичная ошибка:** Считать attach полностью ненаблюдаемым для latency-sensitive процесса.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

105. Что показывает strace?

   **Ответ:** Имена syscalls, декодированные аргументы, return values, errno и signals; часть данных может быть усечена настройками вывода.

   **Типичная ошибка:** Публиковать trace с токенами и содержимым buffers.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

106. Как увидеть open/read/write?

   **Ответ:** `strace -e trace=open,openat,read,write ./app`; для всех файловых операций удобен `%file`.

   **Пример:**

   ```bash
   strace -f -e trace=open,openat,read,write -o io.trace ./app
   strace -f -e trace=%file -o paths.trace ./app
   ```

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

107. Что означает errno в strace?

   **Ответ:** Символическое имя причины ошибочного syscall, например EACCES после результата `-1`.

   **Пример:** Errno нужно интерпретировать в контексте конкретного вызова.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

108. Как увидеть время выполнения syscall?

   **Ответ:** `strace -T` показывает elapsed duration каждого syscall; `-tt` добавляет timestamps.

   **Пример:** Это не обязательно время работы CPU внутри ядра.

   **Типичная ошибка:** Приравнивать syscall wall time ко времени исполнения инструкций kernel.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

109. Что делает -c в strace?

   **Ответ:** Сводку количества вызовов, ошибок и времени по syscalls; по умолчанию CPU time, `-w` меняет измерение на wall-clock при поддержке.

   **Пример:**

   ```bash
   strace -f -c ./app
   # -c агрегирует count/errors/CPU time; для wall-clock применяют -w.
   ```

   **Типичная ошибка:** Считать стандартную колонку времени -c полным wall-clock ожиданием.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

110. Как отфильтровать syscalls?

   **Ответ:** Через `-e trace=...`: список имён или категории `%file`, `%network`, `%process`.

   **Пример:** `strace -f -e trace=%network ./app`.

   **Типичная ошибка:** Фильтровать только open, забыв, что libc часто вызывает openat.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

111. Что делает -e trace=?

   **Ответ:** Выбирает syscalls для показа; после `=` нужно указать имена/категории.

   **Пример:** `-e trace=read,write`.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

112. Что такое EINTR в strace?

   **Ответ:** Syscall прерван доставкой сигнала; он мог автоматически перезапуститься или вернуть EINTR в userspace в зависимости от API и handlers.

   **Типичная ошибка:** Считать EINTR необратимым сетевым отказом.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

113. Как увидеть fork/exec через strace?

   **Ответ:** `strace -f -e trace=%process ./app` покажет clone/fork/exec/wait и завершение.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

114. Что такое follow forks (-f)?

   **Ответ:** Следование новым процессам и потокам, созданным traced task; `-ff -o prefix` разделяет вывод по файлам.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

115. Как отладить “Permission denied” через strace?

   **Ответ:** Найти отказавший syscall и конкретный путь/адрес; затем проверить DAC, ACL, mount flags и LSM logs.

   **Пример:**

   ```bash
   strace -f -e trace=%file -o paths.trace ./app
   # Найти EACCES/EPERM и проверить конкретный path и операцию.
   ```

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

116. Как понять, какой файл не найден?

   **Ответ:** Фильтровать `%file` и искать ENOENT с полным путём; `-yy` помогает декодировать dirfd.

   **Пример:** Поиск отсутствующих optional configs библиотек может быть нормой.

   **Типичная ошибка:** Считать каждый ENOENT во время library/config search ошибкой приложения.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

117. Что такое ltrace?

   **Ответ:** Трассировщик вызовов динамических библиотек, обычно на границе PLT, а также некоторых других событий по опциям.

   **Источник:** [man7: ltrace(1)](https://man7.org/linux/man-pages/man1/ltrace.1.html)

118. Чем ltrace отличается от strace?

   **Ответ:** Strace видит syscalls независимо от libc; ltrace — поддерживаемые динамические library calls и не все оптимизированные/статические вызовы.

   **Типичная ошибка:** Ожидать, что ltrace увидит все inline/static calls.

   **Источник:** [man7: ltrace(1)](https://man7.org/linux/man-pages/man1/ltrace.1.html)

119. Что такое library call tracing?

   **Ответ:** Наблюдение обращений к библиотечным функциям на перехватываемой границе, а не всех машинных вызовов приложения.

   **Источник:** [man7: ltrace(1)](https://man7.org/linux/man-pages/man1/ltrace.1.html)

120. Какие вызовы показывает ltrace?

   **Ответ:** Например, malloc/strcmp/puts, если они вызываются через отслеживаемый механизм и не встроены компилятором.

   **Пример:** Inlining и static linking скрывают такие вызовы.

   **Источник:** [man7: ltrace(1)](https://man7.org/linux/man-pages/man1/ltrace.1.html)

121. Когда использовать ltrace вместо strace?

   **Ответ:** Когда важны аргументы/результаты библиотечного API, которые не видны на syscall boundary.

   **Пример:** Для неизвестного file path обычно начать со strace.

   **Источник:** [man7: ltrace(1)](https://man7.org/linux/man-pages/man1/ltrace.1.html)

122. Можно ли использовать оба вместе?

   **Ответ:** Можно сочетать анализ отдельных запусков; прямой одновременный ptrace двух tracers одного процесса обычно невозможен.

   **Пример:** Не ожидать два независимых ptrace attach к одной task.

   **Источник:** [man7: ltrace(1)](https://man7.org/linux/man-pages/man1/ltrace.1.html)

123. Что такое LD_PRELOAD?

   **Ответ:** Переменная dynamic loader для предварительной загрузки shared objects и symbol interposition; ограничена в secure-execution mode.

   **Типичная ошибка:** Ожидать LD_PRELOAD interposition в статически связанном бинарнике.

   **Источник:** [man7: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html)

124. Как перехватывать функции через LD_PRELOAD?

   **Ответ:** Создать shared library с нужным symbol, при необходимости вызвать оригинал через dlsym(RTLD_NEXT), затем запустить с LD_PRELOAD.

   **Пример:** Учитывать рекурсию, thread safety и ABI; static/hidden calls не перехватятся.

   **Типичная ошибка:** В wrapper вызвать ту же функцию и получить бесконечную рекурсию.

   **Источник:** [man7: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html)

125. Почему strace полезен для debugging продакшн-проблем?

   **Ответ:** Без пересборки показывает реальные paths, errno, ожидания и сетевые операции; особенно полезен при расхождениях окружения.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

126. Какие ограничения у strace?

   **Ответ:** Не показывает обычные userspace вычисления, меняет timing, требует разрешений и может раскрывать данные в trace.

   **Типичная ошибка:** Делать выводы о race timing только по трассируемому запуску.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

127. Может ли strace замедлить процесс?

   **Ответ:** Да, особенно при частых syscalls и подробном декодировании; overhead измеряют и ограничивают duration/filter.

   **Пример:** Не считать результат трассируемого benchmark исходной производительностью.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

128. Что такое ptrace?

   **Ответ:** Kernel API управления и наблюдения другого процесса для debugging; доступ ограничен credentials, dumpability, capabilities и LSM.

   **Типичная ошибка:** Считать доступность /proc/PID гарантией возможности ptrace attach.

   **Источник:** [man7: ptrace(2)](https://man7.org/linux/man-pages/man2/ptrace.2.html)

129. Как strace связан с ptrace?

   **Ответ:** Классический strace использует ptrace для наблюдения syscall entry/exit и signals; оптимизации фильтрации не отменяют permissions.

   **Источник:** [man7: ptrace(2)](https://man7.org/linux/man-pages/man2/ptrace.2.html)

130. Какие security ограничения у ptrace?

   **Ответ:** Проверки UID/dumpability, CAP_SYS_PTRACE в нужном namespace, Yama ptrace_scope, LSM и procfs restrictions.

   **Типичная ошибка:** Снимать системные security restrictions ради диагностики без оценки области изменения.

   **Источник:** [man7: ptrace(2)](https://man7.org/linux/man-pages/man2/ptrace.2.html)

131. Почему не-root может не увидеть чужие процессы?

   **Ответ:** Чужой UID и security policy не разрешают чтение/управление памятью и execution state другого процесса без полномочий.

   **Источник:** [man7: ptrace(2)](https://man7.org/linux/man-pages/man2/ptrace.2.html)

132. Как диагностировать сетевые проблемы через strace?

   **Ответ:** `strace -f -tt -T -e trace=%network ./app`; проверить connect, accept, send/recv, addresses и errno.

   **Пример:**

   ```bash
   strace -f -tt -T -e trace=%network -o net.trace ./app
   ```

   **Типичная ошибка:** Считать успешный sendto доказательством доставки удалённому приложению.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

133. Как увидеть DNS-запросы через strace?

   **Ответ:** Трассировать network syscalls и обмен с resolver, но запрос может уйти через local Unix socket или обслужиться кешем.

   **Пример:** Для decode DNS protocol удобнее tcpdump/Wireshark.

   **Типичная ошибка:** Не увидеть UDP/53 и заключить, что name resolution не выполнялось.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

134. Как отладить file descriptor leak через strace?

   **Ответ:** Сопоставлять успешные socket/open/accept/dup с close и смотреть `/proc/PID/fd` во времени; учитывать FD reuse и другие creators.

   **Пример:**

   ```bash
   ls -l /proc/1234/fd
   strace -f -yy -e trace=%desc,%network -p 1234
   # Attach может влиять на timing; дополнительно сравнить FD counts во времени.
   ```

   **Типичная ошибка:** Сопоставлять FD только по номеру, игнорируя close и повторное использование.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

135. Как strace помогает понять зависание программы?

   **Ответ:** Показывает ожидание в futex, poll/epoll, read или connect; отсутствие syscalls при высокой CPU намекает на userspace loop.

   **Типичная ошибка:** Считать любой futex wait deadlock без анализа всех threads.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

136. Какие альтернативы strace существуют?

   **Ответ:** Perf trace, ftrace, bpftrace/BCC и debugger; выбор зависит от того, нужны ли syscalls, kernel events, stacks или переменные.

   **Источник:** [man7: perf-trace(1)](https://man7.org/linux/man-pages/man1/perf-trace.1.html)

137. Что такое eBPF tracing на базовом уровне?

   **Ответ:** Загрузка проверяемых kernel programs на tracepoints/kprobes/uprobes и агрегация событий; доступ и возможности зависят от kernel/policy.

   **Типичная ошибка:** Считать BPF verifier проверкой корректности всей бизнес-логики tracing program.

   **Источник:** [man7: bpf(2)](https://man7.org/linux/man-pages/man2/bpf.2.html)

138. Почему tracing важен для системного программиста?

   **Ответ:** Связывает поведение кода с реальными OS-событиями и помогает проверять гипотезы о путях, ожиданиях и ошибках.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

139. Как найти bottleneck через strace?

   **Ответ:** По count/time найти подозрительные syscalls, затем проверить call frequency и wall-clock waits; CPU-hotspot искать sampling profiler.

   **Типичная ошибка:** Оптимизировать самый частый syscall, не оценив его суммарную стоимость.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

140. Какие типичные кейсы использования strace/ltrace?

   **Ответ:** Отсутствующий config, EACCES, connect timeout, FD leak, долгий fsync, futex wait и неожиданная библиотечная последовательность.

   **Источник:** [man7: strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html)

---

### perf
141. Что такое perf?

   **Ответ:** Набор Linux-инструментов для счётчиков событий, sampling и tracing на базе perf_events subsystem.

   **Типичная ошибка:** Считать perf исключительно CPU-time profiler без других event sources.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

142. Зачем нужен perf?

   **Ответ:** Для поиска CPU hotspots, оценки hardware events, scheduler behavior и подтверждения performance hypotheses.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

143. Что такое profiling?

   **Ответ:** Измерение распределения стоимости исполнения по функциям, стекам, событиям или ресурсам на конкретной нагрузке.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

144. Что такое sampling profiler?

   **Ответ:** Периодически или по событиям снимает execution state; распределение samples оценивает, где расходуется ресурс.

   **Типичная ошибка:** Интерпретировать малую выборку samples как точное распределение затрат.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

145. Чем sampling отличается от instrumentation?

   **Ответ:** Sampling статистически наблюдает выбранные моменты; instrumentation добавляет измерения в конкретные точки и может давать другой overhead.

   **Типичная ошибка:** Сравнивать результаты instrumentation и sampling без учёта измеряемого события.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

146. Что показывает perf top?

   **Ответ:** Текущие hotspots выбранного workload в интерактивном режиме.

   **Пример:** `perf top -p PID`.

   **Типичная ошибка:** Искать редкую tail-latency проблему только по текущему perf top.

   **Источник:** [man7: perf-top(1)](https://man7.org/linux/man-pages/man1/perf-top.1.html)

147. Что показывает perf stat?

   **Ответ:** Суммарные счётчики событий и производные показатели за запуск/интервал.

   **Пример:**

   ```bash
   perf stat -e task-clock,cycles,instructions,branches,branch-misses -- ./app
   ```

   **Типичная ошибка:** Игнорировать counter multiplexing и доступность hardware events в VM.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

148. Что показывает perf record?

   **Ответ:** Записывает samples и события в perf.data для последующего анализа.

   **Пример:** `perf record -g -- ./app`.

   **Типичная ошибка:** Не записать call graph и ожидать полные stacks в report.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

149. Что делает perf report?

   **Ответ:** Строит отчёт из perf.data по symbols, shared objects, threads и call chains.

   **Пример:** `perf report`.

   **Источник:** [man7: perf-report(1)](https://man7.org/linux/man-pages/man1/perf-report.1.html)

150. Что такое CPU cycles?

   **Ответ:** Аппаратные такты выбранного CPU event; interpretation зависит от PMU и частоты.

   **Пример:** Cycles и elapsed nanoseconds — разные величины.

   **Типичная ошибка:** Пересчитывать cycles в секунды по одной фиксированной частоте на DVFS-системе.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

151. Что такое cache miss?

   **Ответ:** Обращение не найдено на измеряемом уровне кеша; смысл generic cache-misses зависит от архитектуры.

   **Пример:** Не считать каждый miss обращением к DRAM.

   **Типичная ошибка:** Приравнивать generic cache-misses к точному числу DRAM reads.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

152. Что такое branch misprediction?

   **Ответ:** Предсказанное направление/цель branch оказалось неверным, из-за чего процессор отменяет спекулятивную работу.

   **Типичная ошибка:** Оптимизировать branch count без измерения misprediction и полной стоимости кода.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

153. Как perf помогает найти hotspot?

   **Ответ:** Агрегирует samples по функциям/стекам; большая доля выбранного event указывает на кандидат для дальнейшего анализа.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

154. Что такое flame graph?

   **Ответ:** Визуализация агрегированных стеков: ширина соответствует числу samples/весу, высота — глубине стека.

   **Пример:** Горизонтальная ось обычно не является временем.

   **Типичная ошибка:** Считать горизонтальную позицию flame graph хронологией исполнения.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

155. Как построить flame graph?

   **Ответ:** Собрать call chains perf record, преобразовать perf script через stackcollapse-perf.pl и flamegraph.pl из FlameGraph.

   **Пример:**

   ```bash
   perf record -F 99 -g -- ./app
   perf script > perf.stacks
   # Пути к scripts из отдельно полученного FlameGraph repository:
   ./FlameGraph/stackcollapse-perf.pl perf.stacks > perf.folded
   ./FlameGraph/flamegraph.pl perf.folded > flame.svg
   ```

   **Типичная ошибка:** Строить красивый граф из повреждённых или неполных call chains без проверки unwind.

   **Источник:** [FlameGraph: Linux perf_events](https://github.com/brendangregg/FlameGraph#linux-perf_events)

156. Что такое call stack sampling?

   **Ответ:** Запись цепочки вызовов на момент sample, позволяющая связать стоимость функции с вызывающими путями.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

157. Что такое DWARF unwind?

   **Ответ:** Восстановление стека по unwind metadata DWARF и записанному stack dump; обычно `--call-graph dwarf`.

   **Пример:** Имеет overhead и ограничение размера dump.

   **Типичная ошибка:** Включить DWARF unwind без учёта stack dump size и overhead.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

158. Что такое symbols в perf?

   **Ответ:** Имена функций/объектов, сопоставляемые адресам исполнения из ELF, symbol tables и debug information.

   **Источник:** [man7: perf-report(1)](https://man7.org/linux/man-pages/man1/perf-report.1.html)

159. Почему нужны debug symbols?

   **Ответ:** Для исходных строк, inline frames и более качественного анализа; часть function names доступна и без полного debug info.

   **Пример:** Debug files должны соответствовать build ID.

   **Типичная ошибка:** Использовать symbols от другого build того же приложения.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

160. Как профилировать C++ бинарник?

   **Ответ:** Профилировать representative optimized build с `-g`, собрать perf record с call graph и анализировать report/annotate.

   **Пример:**

   ```bash
   c++ -O2 -g -fno-omit-frame-pointer app.cpp -o app
   perf record --call-graph fp -- ./app
   perf report
   # Frame pointers должны быть доступны и в интересующих libraries.
   # Альтернатива: --call-graph dwarf, с иными затратами.
   ```

   **Типичная ошибка:** Измерять -O0 build и переносить вывод на production -O2.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

161. Как оптимизации компилятора влияют на perf?

   **Ответ:** Inlining, vectorization и перестановки меняют код и соответствие строкам; samples могут относиться к преобразованным instructions.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

162. Что такое inlining и как он влияет на профилирование?

   **Ответ:** Тело функции встраивается в caller; отдельного stack frame может не быть, но debug metadata позволяет показывать inline context.

   **Типичная ошибка:** Считать отсутствие отдельного frame доказательством отсутствия работы inline-функции.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

163. Что такое perf events?

   **Ответ:** События hardware/software counters, tracepoints и другие источники, поддерживаемые perf_event_open.

   **Пример:** `perf list`.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

164. Что такое hardware counters?

   **Ответ:** Регистры PMU для подсчёта cycles, instructions, cache/branch events и других архитектурных событий.

   **Типичная ошибка:** Предполагать одинаковую семантику PMU events на разных CPU.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

165. Как измерить IPC (instructions per cycle)?

   **Ответ:** Разделить retired instructions на cycles за сопоставимый интервал; `perf stat -e instructions,cycles ./app` часто печатает отношение.

   **Пример:**

   ```bash
   perf stat -e instructions,cycles -- ./app
   # IPC = retired instructions / cycles, а не FLOPS.
   ```

   **Типичная ошибка:** Делить несопоставимые multiplexed counts без проверки масштабирования.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

166. Как понять, что программа CPU-bound?

   **Ответ:** Проверить высокое фактическое CPU time и on-CPU hotspots; исключить quota throttling и частые ожидания.

   **Пример:** Одна метрика IPC этого не доказывает.

   **Типичная ошибка:** Считать низкий IPC достаточным доказательством memory-bound.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

167. Как понять, что программа memory-bound?

   **Ответ:** Сопоставить stalls, cache/LLC misses, latency и memory bandwidth с workload; низкий IPC сам по себе недостаточен.

   **Источник:** [man7: perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html)

168. Что такое NUMA effects?

   **Ответ:** Разница стоимости локальной/удалённой памяти и размещения threads/data по NUMA nodes.

   **Пример:** Плохой first-touch placement повышает latency.

   **Типичная ошибка:** Закрепить threads, но оставить data на удалённом NUMA node.

   **Источник:** [man7: numa(7)](https://man7.org/linux/man-pages/man7/numa.7.html)

169. Как perf помогает в оптимизации?

   **Ответ:** Показывает, где расходуются ресурсы; после изменения алгоритма/данных повторяют измерение при сопоставимых условиях.

   **Типичная ошибка:** Приписывать улучшение оптимизации без одинаковой нагрузки и повторного измерения.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

170. Какие ограничения у perf?

   **Ответ:** Permissions/perf_event_paranoid, доступность PMU в VM, multiplexing counters, sampling bias, overhead и проблемы unwind.

   **Типичная ошибка:** Ожидать одинакового доступа к kernel PMU внутри любого контейнера.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

171. Чем perf отличается от gprof?

   **Ответ:** Perf умеет hardware events, sampling и kernel tracing без обязательной instrumentation; классический gprof использует compiler instrumentation и иной набор метрик.

   **Источник:** [man7: perf(1)](https://man7.org/linux/man-pages/man1/perf.1.html)

172. Можно ли профилировать kernel?

   **Ответ:** Да, при достаточных правах и доступных kernel symbols/events; ограничения безопасности могут скрывать адреса и данные.

   **Типичная ошибка:** Считать запрет чтения kernel symbols отсутствием kernel samples.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

173. Что такое perf trace?

   **Ответ:** Команда perf для tracing syscalls и других поддерживаемых событий, использующая perf infrastructure.

   **Источник:** [man7: perf-trace(1)](https://man7.org/linux/man-pages/man1/perf-trace.1.html)

174. Как perf связан с eBPF?

   **Ответ:** Perf events могут запускать BPF programs, а perf buffers используются некоторыми BPF workflows; это пересекающиеся, но разные механизмы.

   **Типичная ошибка:** Считать любое perf recording BPF program.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

175. Когда использовать perf вместо strace?

   **Ответ:** Для CPU hotspots и hardware-counter анализа; strace полезнее для конкретных syscall arguments, errno и путей.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

176. Как профилировать многопоточную программу?

   **Ответ:** Записать процесс с threads, сохранить call chains и сравнить нагрузку по TID/CPU; учитывать scheduler и миграции.

   **Пример:**

   ```bash
   perf record -g -p 1234 -- sleep 10
   perf report --sort comm,pid,tid,symbol
   ```

   **Типичная ошибка:** Смотреть только суммарный профиль и пропустить один перегруженный thread.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

177. Как анализировать lock contention?

   **Ответ:** Использовать поддерживаемые perf lock modes/events и анализ ожиданий; pthread locks не обязаны быть видны как kernel lock events.

   **Пример:** Для userspace mutex нужны futex/scheduler/uprobes или application metrics.

   **Источник:** [man7: perf-lock(1)](https://man7.org/linux/man-pages/man1/perf-lock.1.html)

178. Что такое off-CPU profiling?

   **Ответ:** Анализ времени, когда task не исполняется: блокировки, I/O и scheduler wait; нужны switch/wakeup events и часто специальные инструменты.

   **Типичная ошибка:** Считать on-CPU samples измерением времени ожидания блокировки.

   **Источник:** [man7: perf-sched(1)](https://man7.org/linux/man-pages/man1/perf-sched.1.html)

179. Как perf помогает оптимизировать latency?

   **Ответ:** Сопоставить tail requests с scheduler delays, contention и hotspots; обычный on-CPU профиль не объясняет все задержки.

   **Типичная ошибка:** Оптимизировать средний throughput и не измерять p99 latency.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

180. Почему perf важен для high-performance C/C++?

   **Ответ:** Позволяет измерять реальный машинный код и аппаратные эффекты вместо оптимизации по догадкам.

   **Источник:** [man7: perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html)

---

### System Programming (C)
181. Что такое системное программирование?

   **Ответ:** Разработка ПО, непосредственно использующего OS APIs для процессов, памяти, файлов, сети и устройств.

   **Источник:** [man7: syscalls(2)](https://man7.org/linux/man-pages/man2/syscalls.2.html)

182. Чем системное программирование отличается от прикладного?

   **Ответ:** Системный код ближе к управлению ресурсами и контрактам ОС; граница с прикладным размыта, многие backend-сервисы содержат оба слоя.

   **Источник:** [man7: syscalls(2)](https://man7.org/linux/man-pages/man2/syscalls.2.html)

183. Что такое POSIX API?

   **Ответ:** Стандартизованные интерфейсы Unix-подобных систем; Linux поддерживает POSIX и собственные расширения.

   **Пример:** Epoll не является POSIX API.

   **Типичная ошибка:** Считать Linux-specific epoll/io_uring переносимыми POSIX-интерфейсами.

   **Источник:** [man7: standards(7)](https://man7.org/linux/man-pages/man7/standards.7.html)

184. Что такое file descriptor?

   **Ответ:** Неотрицательный индекс таблицы FD процесса, ссылающийся на открытое файловое описание или другой kernel object.

   **Пример:** FD повторно используется после close.

   **Типичная ошибка:** Хранить номер закрытого FD и затем закрыть другой объект после reuse.

   **Источник:** [man7: open(2)](https://man7.org/linux/man-pages/man2/open.2.html)

185. Что такое open/read/write/close?

   **Ответ:** Open создаёт FD, read/write передают байты, close освобождает ссылку; нужно проверять ошибки и частичный прогресс.

   **Типичная ошибка:** Считать положительный read/write гарантией передачи всего буфера.

   **Источник:** [man7: read(2)](https://man7.org/linux/man-pages/man2/read.2.html)

186. Что такое blocking I/O?

   **Ответ:** Операция может приостановить поток до готовности данных/ресурса; это не обязательно активное потребление CPU.

   **Типичная ошибка:** Держать глобальный lock во время долгого blocking I/O.

   **Источник:** [man7: read(2)](https://man7.org/linux/man-pages/man2/read.2.html)

187. Что такое non-blocking I/O?

   **Ответ:** Операция не ждёт готовности и возвращает EAGAIN/EWOULDBLOCK, если сейчас нельзя продвинуться.

   **Пример:** Не каждое обращение к regular file становится неблокирующим от O_NONBLOCK.

   **Типичная ошибка:** Без ожидания readiness повторять EAGAIN в busy loop.

   **Источник:** [man7: fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html)

188. Что такое select()?

   **Ответ:** POSIX-вызов ожидания readiness наборов FD; в обычной glibc FD_SET ограничен FD_SETSIZE и sets изменяются вызовом.

   **Типичная ошибка:** Передать FD >= FD_SETSIZE в FD_SET либо не восстановить наборы перед следующим select.

   **Источник:** [man7: select(2)](https://man7.org/linux/man-pages/man2/select.2.html)

189. Что такое poll()?

   **Ответ:** POSIX-вызов ожидания readiness массива pollfd; не имеет FD_SET bitmap limit, но список обычно просматривается при каждом вызове.

   **Типичная ошибка:** Игнорировать POLLERR/POLLHUP и обрабатывать только POLLIN.

   **Источник:** [man7: poll(2)](https://man7.org/linux/man-pages/man2/poll.2.html)

190. Что такое epoll()?

   **Ответ:** Linux API с persistent interest set и ready list: epoll_create1, epoll_ctl и epoll_wait.

   **Типичная ошибка:** Зарегистрировать FD и забыть обновить interest/состояние при закрытии и reuse.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

191. Чем epoll лучше select/poll?

   **Ответ:** Избегает повторной передачи полного списка и удобен для больших наборов редко готовых FD; универсального выигрыша для любой нагрузки нет.

   **Типичная ошибка:** Считать epoll универсально O(1) и автоматически быстрым при любых N и patterns.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

192. Что такое edge-triggered vs level-triggered?

   **Ответ:** LT сообщает, пока условие readiness сохраняется; ET сообщает об изменениях и требует nonblocking обработки до EAGAIN.

   **Пример:**

   ```c
   #include <sys/socket.h>
   #include <errno.h>

   /* Фрагмент ET callback: fd nonblocking, consume не блокируется. */
   int drain_input(int fd, void (*consume)(const char *, size_t)) {
       char buffer[4096];
       for (;;) {
           ssize_t n = recv(fd, buffer, sizeof buffer, 0);
           if (n > 0) { consume(buffer, (size_t)n); continue; }
           if (n == 0) return 0; /* Peer завершил отправку. */
           if (errno == EINTR) continue;
           if (errno == EAGAIN || errno == EWOULDBLOCK) return 1;
           return -1;
       }
   }
   /* В production нужен budget обработки и стратегия продолжения,
      чтобы один активный socket не вытеснял остальные. */
   ```

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

193. Что такое event loop?

   **Ответ:** Цикл, который ждёт события/таймеры и запускает короткие обработчики, сохраняя состояние незавершённых операций.

   **Типичная ошибка:** Выполнить DNS, file I/O или тяжёлое вычисление синхронно в единственном event loop.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

194. Что такое reactor pattern?

   **Ответ:** Ожидание готовности ресурсов, после которого приложение само выполняет read/write.

   **Пример:** Epoll-based event loop.

   **Типичная ошибка:** Считать readiness завершённой передачей данных.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

195. Что такое proactor pattern?

   **Ответ:** Запуск асинхронной операции и обработка уведомления о завершении с результатом.

   **Пример:** Completion-oriented I/O, например некоторые io_uring workflows.

   **Типичная ошибка:** Освободить buffer до прихода completion асинхронной операции.

   **Источник:** [man7: io_uring(7)](https://man7.org/linux/man-pages/man7/io_uring.7.html)

196. Что такое mmap()?

   **Ответ:** Отображение файла или anonymous memory в адресное пространство с выбранными permissions и shared/private semantics.

   **Типичная ошибка:** Считать MAP_PRIVATE изменением исходного файла.

   **Источник:** [man7: mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html)

197. Когда mmap лучше read/write?

   **Ответ:** Для random access и разделяемых данных; read/write могут быть проще и быстрее при другом pattern и page-fault overhead.

   **Пример:** Измерять на реальной нагрузке.

   **Типичная ошибка:** Считать mmap безусловным ускорением read/write.

   **Источник:** [man7: mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html)

198. Что такое shared memory?

   **Ответ:** Область памяти, доступная нескольким процессам; требует явной синхронизации и управления lifetime.

   **Пример:** POSIX shm_open + mmap MAP_SHARED.

   **Типичная ошибка:** Разделять память между процессами без synchronization и memory ordering.

   **Источник:** [man7: shm_overview(7)](https://man7.org/linux/man-pages/man7/shm_overview.7.html)

199. Что такое pipes?

   **Ответ:** Однонаправленный byte-stream IPC; unnamed pipe имеет read и write ends, FIFO доступен по имени.

   **Пример:** Не хранит произвольные границы сообщений.

   **Типичная ошибка:** Оставить лишний write end открытым и бесконечно ждать EOF на read end.

   **Источник:** [man7: pipe(7)](https://man7.org/linux/man-pages/man7/pipe.7.html)

200. Что такое signals в системном программировании?

   **Ответ:** Асинхронные уведомления процессу/потоку о событиях; disposition может быть default, ignore или handler.

   **Пример:** SIGKILL и SIGSTOP нельзя перехватить.

   **Типичная ошибка:** Вызывать malloc/printf из signal handler.

   **Источник:** [man7: signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html)

201. Что такое async-signal-safe?

   **Ответ:** Функция безопасна в asynchronous signal handler по POSIX; список ограничен, printf/malloc обычно в него не входят.

   **Пример:**

   ```c
   #include <signal.h>
   #include <unistd.h>

   static volatile sig_atomic_t stop_requested;

   static void handle_term(int signo) {
       (void)signo;
       stop_requested = 1; /* Никаких printf, malloc или mutex. */
   }

   int main(void) {
       struct sigaction sa = {0};
       sa.sa_handler = handle_term;
       sigemptyset(&sa.sa_mask);
       if (sigaction(SIGTERM, &sa, NULL) == -1) return 1;
       while (!stop_requested) {
           /* Таймаут ограничивает ожидание при сигнале между проверкой и sleep. */
           sleep(1);
       }
       return 0;
   }
   /* Для event loop предпочтительнее signalfd/self-pipe/атомарное pselect. */
   ```

   **Источник:** [man7: signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html)

202. Что такое fork/exec модель?

   **Ответ:** Fork создаёт child с наследованием ресурсов, exec заменяет его образ программой, wait собирает завершение.

   **Пример:** После fork в multithreaded child до exec допустимы только async-signal-safe операции.

   **Типичная ошибка:** В child многопоточного процесса вызывать небезопасную библиотечную логику до exec.

   **Источник:** [man7: fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html)

203. Как реализовать простой shell?

   **Ответ:** Разобрать команду, создать pipes/redirections, fork, в child настроить FD и execvp, в parent закрыть лишние концы и waitpid.

   **Пример:** Полный shell также требует job control и корректной обработки сигналов.

   **Типичная ошибка:** Не закрыть лишние pipe ends после dup2 и не собрать child через waitpid.

   **Источник:** [man7: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html)

204. Что такое daemonization?

   **Ответ:** Подготовка процесса к фоновому запуску без controlling terminal в классической модели; под supervisor обычно нужен foreground process.

   **Типичная ошибка:** Форкаться в background под supervisor, ожидающим foreground main PID.

   **Источник:** [man7: daemon(7)](https://man7.org/linux/man-pages/man7/daemon.7.html)

205. Как сделать daemon в Linux?

   **Ответ:** Под systemd обычно достаточно foreground main loop и обработки SIGTERM; для классического daemon нужны отдельная session, FD policy, cwd/umask и startup error reporting.

   **Источник:** [man7: daemon(7)](https://man7.org/linux/man-pages/man7/daemon.7.html)

206. Что такое double fork?

   **Ответ:** Первый fork и setsid отделяют процесс от terminal/session, второй предотвращает получение controlling terminal; под systemd обычно не нужен.

   **Типичная ошибка:** Считать double fork заменой управления lifetime и child reaping.

   **Источник:** [man7: daemon(7)](https://man7.org/linux/man-pages/man7/daemon.7.html)

207. Что такое chroot?

   **Ответ:** Меняет корень pathname resolution процесса; это не полноценная security sandbox.

   **Пример:** Без сброса прав и закрытия внешних FD можно выйти за ожидаемую изоляцию.

   **Типичная ошибка:** Использовать chroot без сброса привилегий как полноценную sandbox.

   **Источник:** [man7: chroot(2)](https://man7.org/linux/man-pages/man2/chroot.2.html)

208. Что такое privilege dropping?

   **Ответ:** Удаление лишних supplementary groups, GID/UID и capabilities с проверкой результата и необратимости там, где требуется.

   **Типичная ошибка:** Сбросить euid, оставив saved UID/capabilities и privileged FDs.

   **Источник:** [man7: setresuid(2)](https://man7.org/linux/man-pages/man2/setresuid.2.html)

209. Что такое sockets API?

   **Ответ:** Набор socket/bind/listen/accept/connect/send/recv APIs и options для работы с сетевыми и локальными endpoints.

   **Источник:** [man7: socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html)

210. Как реализовать TCP сервер на C?

   **Ответ:** Socket → setsockopt при необходимости → bind → listen → accept; accepted FD обслуживать с framing, deadlines и обработкой partial I/O.

   **Типичная ошибка:** Не ограничивать очередь output одного медленного клиента.

   **Источник:** [man7: tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html)

211. Как реализовать UDP сервер?

   **Ответ:** Socket SOCK_DGRAM → bind → recvfrom/recvmsg → sendto/sendmsg; учитывать размер datagram, truncation, потери и подменяемость sender address.

   **Типичная ошибка:** Считать UDP нулевой длины EOF либо игнорировать MSG_TRUNC.

   **Источник:** [man7: udp(7)](https://man7.org/linux/man-pages/man7/udp.7.html)

212. Что такое serialization?

   **Ответ:** Преобразование данных в оговорённое wire/storage представление с типами, размерами, версиями и проверкой границ.

   **Пример:** Не отправлять сырой C struct с padding и pointers.

   **Типичная ошибка:** Передавать sizeof(struct) байтов с padding, указателями и host endian.

   **Источник:** [man7: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html)

213. Что такое endianess?

   **Ответ:** Порядок байтов многобайтного значения в памяти: little-endian или big-endian.

   **Пример:** Сериализация должна задавать порядок явно.

   **Типичная ошибка:** Проверять endian через небезопасный unaligned cast.

   **Источник:** [man7: endian(3)](https://man7.org/linux/man-pages/man3/endian.3.html)

214. Что такое network byte order?

   **Ответ:** Big-endian для многих IP/TCP/UDP числовых полей; прикладной протокол может определить иной encoding.

   **Типичная ошибка:** Повторно применять htonl к уже сериализованному значению.

   **Источник:** [man7: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html)

215. Что делает htons/ntohl?

   **Ответ:** `htons()`/`htonl()` преобразуют 16/32-битные значения host→network, `ntohs()`/`ntohl()` — обратно.

   **Пример:**

   ```c
   #include <arpa/inet.h>
   #include <stdint.h>
   #include <string.h>

   uint32_t decode_length(const unsigned char bytes[4]) {
       uint32_t value;
       memcpy(&value, bytes, sizeof value); /* Без unaligned cast. */
       return ntohl(value);
   }
   /* После decode нужно проверить допустимый максимум длины. */
   ```

   **Типичная ошибка:** Использовать htons для 32-битной длины.

   **Источник:** [man7: byteorder(3)](https://man7.org/linux/man-pages/man3/byteorder.3.html)

216. Что такое alignment памяти?

   **Ответ:** Требование/предпочтение адреса объекта быть кратным нужной границе; нарушение может вызвать UB, fault или performance penalty.

   **Пример:** Unaligned wire bytes безопаснее читать через memcpy и decode.

   **Типичная ошибка:** Привести произвольный byte buffer к struct pointer без гарантий alignment и object lifetime.

   **Источник:** [man7: posix_memalign(3)](https://man7.org/linux/man-pages/man3/posix_memalign.3.html)

217. Что такое cache line?

   **Ответ:** Единица переноса/согласования данных кеша CPU; размер зависит от архитектуры и не всегда равен 64 байтам.

   **Типичная ошибка:** Хардкодить cache line size как универсальную константу для всех платформ.

   **Источник:** [man7: perf-c2c(1)](https://man7.org/linux/man-pages/man1/perf-c2c.1.html)

218. Что такое false sharing?

   **Ответ:** Потоки изменяют независимые данные в одной cache line и вызывают лишнюю coherence traffic.

   **Пример:**

   ```cpp
   #include <new>

   // C++17: implementation-defined расстояние для разделения hot fields.
   struct alignas(std::hardware_destructive_interference_size) Counter {
       unsigned long value = 0;
   };
   // Каждый counter меняет только свой поток; чтение после join.
   // Для одновременного чтения/записи необходимы atomics или другая синхронизация.
   ```

   **Типичная ошибка:** Исправлять padding, не проверив, что проблема действительно coherence contention.

   **Источник:** [man7: perf-c2c(1)](https://man7.org/linux/man-pages/man1/perf-c2c.1.html)

219. Что такое zero-copy?

   **Ответ:** Уменьшение копирования данных между buffers/layers; конкретный API может убирать лишь одну из копий, а не все.

   **Типичная ошибка:** Считать «zero-copy» гарантией отсутствия любых копий на всём пути.

   **Источник:** [man7: sendfile(2)](https://man7.org/linux/man-pages/man2/sendfile.2.html)

220. Что такое sendfile()?

   **Ответ:** Передаёт данные из input file FD в output FD внутри ядра; удобен для file→socket, но поддержка зависит от FD и системы.

   **Пример:** Обрабатывать short result и EAGAIN.

   **Типичная ошибка:** Игнорировать частичную отправку и EAGAIN.

   **Источник:** [man7: sendfile(2)](https://man7.org/linux/man-pages/man2/sendfile.2.html)

221. Что такое splice()?

   **Ответ:** Перемещает данные между FD, один из которых должен быть pipe, потенциально без userspace copy.

   **Пример:** Флаг SPLICE_F_MOVE — hint, а не универсальная гарантия zero-copy.

   **Типичная ошибка:** Забыть, что один из FD splice должен быть pipe.

   **Источник:** [man7: splice(2)](https://man7.org/linux/man-pages/man2/splice.2.html)

222. Как уменьшить syscalls?

   **Ответ:** Буферизовать мелкие операции, использовать writev/readv, sendmmsg/recvmmsg и batching там, где это сохраняет latency/семантику.

   **Пример:**

   ```c
   #include <sys/uio.h>

   /* Фрагмент: header и payload — действующие buffers. */
   struct iovec vec[2] = {
       { .iov_base = header,  .iov_len = header_len },
       { .iov_base = payload, .iov_len = payload_len }
   };
   ssize_t sent = writev(fd, vec, 2);
   /* Проверить sent/errno; положительный результат может быть частичным
      и пересекать границу header/payload. */
   ```

   **Типичная ошибка:** Объединить buffers и забыть обработать short writev между iovec entries.

   **Источник:** [man7: writev(2)](https://man7.org/linux/man-pages/man2/writev.2.html)

223. Что такое batching I/O?

   **Ответ:** Обработка нескольких buffers/messages/requests за один переход в ядро или итерацию.

   **Пример:** Большой batch может повысить tail latency.

   **Типичная ошибка:** Увеличивать batch без контроля latency и fair scheduling.

   **Источник:** [man7: sendmmsg(2)](https://man7.org/linux/man-pages/man2/sendmmsg.2.html)

224. Что такое thread vs event-driven модель?

   **Ответ:** Thread model использует отдельные execution contexts для работы; event-driven хранит состояния операций и реагирует на readiness/completion.

   **Пример:** Возможна гибридная модель event loop + workers.

   **Типичная ошибка:** Противопоставлять threads и event loop как взаимоисключающие модели.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

225. Когда лучше использовать threads?

   **Ответ:** Для CPU parallelism и задач с блокирующими APIs; размер pool должен учитывать ресурсы и нагрузку.

   **Пример:** Не создавать неограниченный thread на каждый запрос.

   **Типичная ошибка:** Создавать бесконтрольное число threads под входящую нагрузку.

   **Источник:** [man7: pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html)

226. Когда лучше использовать epoll?

   **Ответ:** Для многих одновременных sockets с короткими неблокирующими обработчиками, особенно когда большинство соединений простаивает.

   **Типичная ошибка:** Обслуживать regular file I/O через epoll как обычный неблокирующий socket.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

227. Что такое lock contention?

   **Ответ:** Конкуренция нескольких threads за lock, вызывающая ожидания, cache-line bouncing и сериализацию.

   **Типичная ошибка:** Пытаться устранить lock contention только заменой mutex на spinlock.

   **Источник:** [man7: pthread_mutex_lock(3)](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3.html)

228. Как проектировать scalable сервер?

   **Ответ:** Ограничивать очереди и concurrency, применять backpressure/deadlines, разделять CPU и I/O work и измерять throughput вместе с tail latency.

   **Типичная ошибка:** Иметь неограниченные очереди, скрывающие перегрузку до OOM.

   **Источник:** [man7: epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html)

229. Какие типичные ошибки в системном C коде?

   **Ответ:** Непроверенные return values, short I/O, EINTR/EAGAIN, FD leaks, races, integer overflow, unsafe signal handlers и неверный resource lifetime.

   **Типичная ошибка:** Игнорировать return values при успешном happy-path тесте.

   **Источник:** [man7: read(2)](https://man7.org/linux/man-pages/man2/read.2.html)

230. Почему важно понимать OS internals для C/C++?

   **Ответ:** Производительность и корректность зависят от scheduler, VM, filesystem и сетевых контрактов; знание internals помогает выбирать API и проверять причины проблем.

   **Типичная ошибка:** Объяснять performance только сложностью алгоритма, не учитывая I/O и scheduling.

   **Источник:** [man7: syscalls(2)](https://man7.org/linux/man-pages/man2/syscalls.2.html)
