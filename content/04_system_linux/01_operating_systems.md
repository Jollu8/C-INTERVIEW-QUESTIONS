## Operating Systems — Questions (C/C++ oriented)

### OS Architecture

1. Что такое монолитное ядро?

   **Ответ:** Монолитное ядро (Monolithic Kernel) — это архитектура операционной системы, в которой все ключевые компоненты (планировщик процессов, подсистема управления виртуальной памятью, драйверы устройств, сетевой стек и файловые системы) скомпилированы в единый образ и выполняются в общем привилегированном адресном пространстве ядра (Kernel Space).

   **Пример:**

   ```
   // Архитектура Linux / FreeBSD:
   [ User Space: Приложения ]
              | (syscalls)
   [ Kernel Space: Файловые системы + Сеть + Драйверы + Память (единый бинарник/адресация) ]
              |
   [ Аппаратное обеспечение (Hardware) ]
   ```

   **Источник:** [Silberschatz, Galvin, Gagne: Operating System Concepts (Monolithic Systems)](https://www.os-book.com/?utm_source=gemini)

2. Чем микроядро отличается от монолитного?

   **Ответ:** В микроядерной архитектуре (Microkernel) в привилегированном режиме ядра остается только абсолютный минимум функций: базовое переключение потоков, низкоуровневая обработка прерываний и механизм межпроцессного взаимодействия (IPC). Все остальные подсистемы (драйверы, файловые системы, сеть) вынесены в изолированные пользовательские процессы (серверы).

   **Пример:**

   ```
   // В микроядре (QNX, seL4) обращение к диску — это отправка IPC-сообщения:
   // App -> IPC -> File System Server (User Space) -> IPC -> Disk Driver (User Space)
   ```

   **Источник:** [Tanenbaum, A. S.: Modern Operating Systems (Microkernels)](https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003295?utm_source=gemini)

3. Преимущества и недостатки микроядра?

   **Ответ:** Преимущества: высокая надежность, отказоустойчивость и безопасность (падение драйвера не рушит всю систему, а требует лишь перезапуска пользовательского процесса-сервера), компактная база верифицируемого кода. Недостатки: потеря производительности из-за частых переключений контекста и оверхеда на сериализацию сообщений IPC между серверами.

   **Пример:**

   ```
   # Сравнение производительности:
   # Монолитное ядро: прямой вызов функции драйвера (единицы тактов CPU)
   # Микроядро: IPC + 2 переключения контекста User->Kernel->User (сотни тактов)
   ```

   **Источник:** [Härtig et al.: The Performance of Micro-Kernel-Based Systems (SOSP)](https://dl.acm.org/doi/10.1145/268998.266660?utm_source=gemini)

4. Где выполняется драйвер в монолитной архитектуре?

   **Ответ:** В монолитной архитектуре драйвер выполняется в пространстве ядра (Ring 0 / Kernel Space). Он имеет прямой доступ ко всей оперативной памяти ядра, аппаратуре и регистрам процессора, из-за чего любая ошибка в драйвере (например, разыменование nullptr) приводит к падению всей ОС (Kernel Panic / BSOD).

   **Пример:**

   ```c
   // Драйвер символьного устройства Linux работает в Ring 0:
   #include <linux/module.h>
   #include <linux/fs.h>

   static int device_open(struct inode *inode, struct file *file) {
       pr_info("Driver executed in Ring 0 (kernel space)\n");
       return 0;
   }
   ```

   **Источник:** [Linux Device Drivers, 3rd Edition (Corbet, Rubini, Kroah-Hartman)](https://lwn.net/Kernel/LDD3/?utm_source=gemini)

5. Что такое kernel space и user space?

   **Ответ:** Это разделение виртуального адресного пространства и режимов процессора для изоляции программ. User Space — непривилегированный режим (Ring 3), где работают приложения без прямого доступа к железу. Kernel Space — привилегированный режим (Ring 0), где работает ядро, имея доступ ко всей физической памяти и аппаратуре.

   **Пример:**

   ```
   // Раскладка виртуальной памяти 64-битного Linux:
   0x0000000000000000 - 0x00007FFFFFFFFFFF : User Space (128 ТБ)
   0xFFFF800000000000 - 0xFFFFFFFFFFFFFFFF : Kernel Space (128 ТБ)
   ```

   **Источник:** [Linux Kernel Documentation: Virtual Memory Layout on x86_64](https://www.kernel.org/doc/html/latest/arch/x86/x86_64/mm.html?utm_source=gemini)

6. Как происходит переход между ними?

   **Ответ:** Переход из User Space в Kernel Space происходит аппаратно через специальные механизмы: инструкцию системного вызова (`syscall` в x86_64), программные прерывания (`int 0x80`), аппаратные прерывания от устройств (IRQ) или процессорные исключения (Faults/Traps). При этом процессор атомарно меняет уровень привилегий (CPL) с 3 на 0 и переключает стек на стек ядра.

   **Пример:**

   ```assembly
   ; Инструкция перехода в Kernel Space на x86_64:
   mov rax, 1          ; номер syscall (sys_write)
   mov rdi, 1          ; fd (stdout)
   syscall             ; Аппаратный переход в Ring 0
   ```

   **Источник:** [Intel 64 and IA-32 Architectures Software Developer's Manual (Syscall instruction)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

7. Что такое syscall interface?

   **Ответ:** Syscall interface (интерфейс системных вызовов) — это стандартизированный программный API ядра операционной системы, предоставляющий пользовательским приложениям контролируемый и безопасный доступ к ресурсам ОС: созданию процессов, вводу-выводу, сетевым сокетам и выделению виртуальной памяти.

   **Пример:**

   ```c
   #include <unistd.h>
   #include <sys/syscall.h>

   // Прямой системный вызов минуя glibc:
   long bytes = syscall(SYS_write, 1, "Hello\n", 6);
   ```

   **Источник:** [Linux man-pages: syscalls(2)](https://man7.org/linux/man-pages/man2/syscalls.2.html?utm_source=gemini)

8. Почему ядро изолировано от user space?

   **Ответ:** Изоляция защищает стабильность, безопасность и целостность системы. Она предотвращает падение операционной системы из-за сбоев пользовательских программ, исключает несанкционированное чтение и модификацию чужих процессов или структур ядра, а также защищает аппаратные устройства от некорректного прямого управления.

   **Пример:**

   ```c
   int* kernel_addr = (int*)0xFFFF880000000000;
   *kernel_addr = 42; // Аппаратная защита MMU немедленно выбросит SIGSEGV
   ```

   **Источник:** [Saltzer & Schroeder: The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/greatpapers/saltzer.pdf?utm_source=gemini)

9. Что такое interrupt?

   **Ответ:** Interrupt (аппаратное прерывание) — это электрический асинхронный сигнал от внешнего аппаратного контроллера (сетевой карты, таймера, клавиатуры), сообщающий процессору о наступлении внешнего события, требующего немедленной обработки, что заставляет процессор приостановить текущий поток инструкций и перейти к таблице векторов прерываний (IDT).

   **Пример:**

   ```
   // Сетевая карта получила пакет -> послала сигнал на контроллер APIC ->
   // CPU остановил юзерский код -> вызвал зарегистрированный обработчик IRQ в ядре
   ```

   **Источник:** [Bovet, Cesati: Understanding the Linux Kernel (Interrupts and Exceptions)](https://www.oreilly.com/library/view/understanding-the-linux/0596005652/?utm_source=gemini)

10. Разница между interrupt и exception?

    **Ответ:** Interrupt (прерывание) асинхронен и генерируется внешним аппаратным обеспечением независимо от текущей исполняемой инструкции процессора (таймер, диск). Exception (исключение) синхронно и генерируется самим вычислительным ядром процессора при попытке выполнить ошибочную или требующую вмешательства инструкцию (деление на ноль, Page Fault, переполнение).

    **Пример:**

    ```
    # Interrupt: пришел пакет с сетевой карты (асинхронно внешнему коду)
    # Exception: выполнение `int x = 10 / 0;` (синхронно, ошибка ядра процессора)
    ```

    **Источник:** [Intel 64 and IA-32 Architectures Software Developer's Manual (Interrupt and Exception Handling)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

11. Что такое context switch?

    **Ответ:** Context switch (переключение контекста) — процедура ядра операционной системы, при которой выполнение процессора переключается с одного процесса/потока на другой: сохраняется текущее вычислительное состояние (регистры, счетчик команд, стек) снимаемой задачи и восстанавливается сохраненное состояние запускаемой задачи.

    **Пример:**

    ```
    # Мониторинг частоты переключений контекста в системе:
    vmstat 1
    # Колонка 'cs' (context switches per second)
    ```

    **Источник:** [Linux man-pages: sched(7)](https://man7.org/linux/man-pages/man7/sched.7.html?utm_source=gemini)

12. Какие данные сохраняются при context switch?

    **Ответ:** При переключении потока сохраняются: регистры общего назначения (GPR), регистр флагов (EFLAGS), программный счетчик (PC/RIP), указатель вершины стека (SP/RSP) и состояние векторных FPU/SSE/AVX регистров. При переключении процесса дополнительно сменяется таблица виртуальной памяти (базовый адрес каталога страниц в регистре CR3) и метаданные безопасности.

    **Пример:**

    ```c
    // Структура сохранения регистров процессора в ядре Linux (struct thread_struct)
    struct inactive_task_frame {
        unsigned long bp;
        unsigned long rbx;
        unsigned long r12;
        unsigned long r13;
        unsigned long r14;
        unsigned long r15;
        unsigned long flags;
        unsigned long ret_addr;
    };
    ```

    **Источник:** [Robert Love: Linux Kernel Development (Process Scheduling)](https://en.wikipedia.org/wiki/Linux_Kernel_Development?utm_source=gemini)

13. Что такое privilege levels?

    **Ответ:** Privilege levels (уровни привилегий) — аппаратные кольца защиты архитектуры процессора, определяющие права выполняемого кода на исполнение привилегированных инструкций (например, `hlt`, `cli`, управление регистром `cr3`) и доступ к страницам памяти, помеченным как супервизорские.

    **Пример:**

    ```
    Архитектура x86 поддерживает 4 уровня (колец):
    Ring 0: Ядро ОС (полный доступ)
    Ring 1, 2: Традиционно для драйверов (сейчас почти не используются)
    Ring 3: Пользовательские приложения (ограниченный доступ)
    ```

    **Источник:** [OSDev Wiki: Privilege Rings](https://wiki.osdev.org/Security#Privilege_Levels?utm_source=gemini)

14. Ring 0 vs Ring 3?

    **Ответ:** Ring 0 (Supervisor Mode) — режим максимальных привилегий: прямой доступ ко всей аппаратуре, портам ввода-вывода и таблицам трансляции виртуальных адресов. Ring 3 (User Mode) — непривилегированный режим изоляции: запрещены аппаратные инструкции ввода-вывода, адресация ограничена пределами виртуального адресного пространства процесса, а доступ к железу возможен только через системные вызовы ядра.

    **Пример:**

    ```assembly
    ; Попытка выполнить инструкцию отключения прерываний в Ring 3:
    cli ; Приведет к немедленному аппаратному прерыванию General Protection Fault (#GP)
    ```

    **Источник:** [Intel 64 and IA-32 Architectures Software Developer's Manual (Volume 3A, Chapter 5)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

15. Как работает trap?

    **Ответ:** Trap (ловушка) — это синхронное программное исключение, генерируемое процессором после выполнения определенной команды (или явно вызванное инструкцией `sysenter`/`syscall`/`int`). В отличие от fault, адрес возврата ловушки указывает на *следующую* инструкцию, что позволяет использовать trap для отладочных точек останова (breakpoint) и штатной реализации системных вызовов.

    **Пример:**

    ```assembly
    ; Программная ловушка для отладчика GDB (инструкция breakpoint):
    int 3 ; Процессор сохраняет состояние и передает управление в ядро ОС
    ```

    **Источник:** [Bovet, Cesati: Understanding the Linux Kernel (Traps)](https://www.oreilly.com/library/view/understanding-the-linux/0596005652/?utm_source=gemini)

16. Что такое bootloader?

    **Ответ:** Bootloader (начальный загрузчик: GRUB, systemd-boot, U-Boot) — это компактная низкоуровневая программа, загружаемая прошивкой материнской платы (BIOS/UEFI) с загрузочного сектора накопителя; она настраивает базовое аппаратное окружение, переводит процессор в защищенный/длинный режим, загружает образ ядра ОС и initramfs в оперативную память и передает управление на точку входа ядра.

    **Пример:**

    ```
    // Конфигурационный файл GRUB2 (/boot/grub/grub.cfg):
    linux /vmlinuz-linux root=UUID=... rw quiet
    initrd /initramfs-linux.img
    ```

    **Источник:** [GNU GRUB Manual](https://www.gnu.org/software/grub/manual/grub/grub.html?utm_source=gemini)

17. Как ОС загружается?

    **Ответ:** 1) Подача питания -> включение схемы сброса CPU; 2) Запуск прошивки UEFI/BIOS (POST-тестирование оборудования); 3) UEFI считывает bootloader с EFI-раздела (ESP); 4) Загрузчик загружает ядро ОС и initramfs в память, передавая управление точке входа `startup_64`; 5) Ядро распаковывается, настраивает контроллеры памяти (MMU), прерывания (IDT), ACPI и монтирует виртуальный rootfs; 6) Запуск первого пространства пользователя: процесс `init` (PID 1).

    **Пример:**

    ```
    BIOS/UEFI -> Bootloader (GRUB) -> Linux Kernel (vmlinuz) -> PID 1 (systemd) -> Login Shell
    ```

    **Источник:** [Linux Kernel Documentation: x86 Boot Protocol](https://www.kernel.org/doc/html/latest/arch/x86/boot.html?utm_source=gemini)

18. Что делает init/systemd?

    **Ответ:** Init/systemd — это процесс с PID 1, прямой или косвенный предок всех остальных пользовательских процессов в ОС. Он монтирует реальные файловые системы, запускает и супервизирует фоновые демоны (системные сервисы), настраивает сеть, слушает шину межпроцессных событий D-Bus и утилизирует процессы-сироты («усыновляет» и вызывает для них `wait()`).

    **Пример:**

    ```bash
    # Просмотр дерева процессов от PID 1:
    pstree -p 1
    ```

    **Источник:** [systemd System and Service Manager](https://systemd.io/?utm_source=gemini)

19. Что такое kernel module?

    **Ответ:** Kernel Module (LKM — Loadable Kernel Module) — это объектный бинарный файл (обычно с расширением `.ko`), содержащий скомпилированный код, который может быть динамически загружен в работающее адресное пространство ядра ОС или выгружен из него без необходимости перезагрузки компьютера.

    **Пример:**

    ```bash
    # Загрузка модуля ядра в Linux:
    sudo insmod my_driver.ko
    # Просмотр списка загруженных модулей:
    lsmod
    ```

    **Источник:** [The Linux Kernel Module Programming Guide](https://sysprog21.github.io/lkmpg/?utm_source=gemini)

20. Когда используют loadable modules?

    **Ответ:** Их используют для поддержки драйверов специфического оборудования (видеокарт, USB-контроллеров), подключения редких сетевых протоколов и файловых систем (ZFS, NTFS), а также для работы отладочных инструментов и систем безопасности (сетевой экран Netfilter/iptables), чтобы не раздувать базовый статичный монолитный образ ядра.

    **Пример:**

    ```bash
    # Автоматическая загрузка драйвера Wi-Fi при подключении адаптера:
    modprobe iwlwifi
    ```

    **Источник:** [Linux man-pages: modprobe(8)](https://man7.org/linux/man-pages/man8/modprobe.8.html?utm_source=gemini)

    ---

### Processes vs Threads

21. Что такое процесс?

    **Ответ:** Процесс — это изолированный экземпляр выполняющейся компьютерной программы, которому операционная система выделяет независимый набор ресурсов: изолированное виртуальное адресное пространство, стек, сегменты кода и данных, дескрипторы открытых файлов, переменные окружения и права доступа.

    **Пример:**

    ```bash
    # Просмотр параметров запущенного процесса:
    ls -l /proc/$$/
    # Содержит: cmdline, fd, maps (карта памяти), status
    ```

    **Источник:** [Silberschatz, Galvin: Operating System Concepts (Processes)](https://www.os-book.com/?utm_source=gemini)

22. Что такое поток?

    **Ответ:** Поток (Thread / поток выполнения) — наименьшая запланированная единица работы процессора внутри процесса. Поток обладает собственным программным счетчиком (PC), регистрами и стеком выполнения, но делит адресное пространство, кучу и дескрипторы файлов со всеми остальными потоками своего процесса.

    **Пример:**

    ```cpp
    #include <thread>
    void task() { /* Свой стек, свои регистры, но общая память процесса */ }
    std::thread t(task);
    t.join();
    ```

    **Источник:** [ISO C++ Standard: Threads (§ 32.4 \[thread.thread.class\])](https://eel.is/c++draft/thread.thread.class?utm_source=gemini)

23. Основное отличие процесса от потока?

    **Ответ:** Главное отличие — в изоляции адресного пространства. Процессы изолированы друг от друга аппаратной защитой MMU (один процесс не может прочитать память другого без средств IPC). Потоки одного процесса живут в едином общем адресном пространстве и могут напрямую читать и модифицировать одни и те же указатели и структуры в памяти.

    **Пример:**

    ```
    Процессы: [Process A (RAM A)] <--- IPC (shm/socket) ---> [Process B (RAM B)]
    Потоки:   [Process A [Thread 1 (Stack)] + [Thread 2 (Stack)] -> Common Heap/Data]
    ```

    **Источник:** [Tanenbaum, A. S.: Modern Operating Systems](https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003295?utm_source=gemini)

24. Что делится между потоками?

    **Ответ:** Между потоками одного процесса делятся: виртуальное адресное пространство, динамическая память (heap), глобальные и статические переменные, дескрипторы открытых файлов и сетевых сокетов, текущая рабочая директория (cwd), обработчики сигналов (signal handlers) и пользовательские идентификаторы (UID/GID).

    **Пример:**

    ```c
    int shared_global = 100; // Доступна для одновременного изменения всеми потоками
    ```

    **Источник:** [POSIX standard: IEEE Std 1003.1 (Threads concepts)](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html?utm_source=gemini)

25. Что НЕ делится между потоками?

    **Ответ:** У каждого потока строго индивидуальны: идентификатор потока (TID), контекст регистров процессора (включая указатель команд PC и указатель стека SP), собственный стек вызовов для локальных переменных функций, битовая маска блокировки сигналов (signal mask), значение `errno`, параметры планирования (приоритет) и данные Thread-Local Storage (TLS).

    **Пример:**

    ```c
    // Переменная errno индивидуальна для каждого потока:
    #include <errno.h> // разворачивается в (*__errno_location())
    ```

    **Источник:** [Linux man-pages: pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html?utm_source=gemini)

26. Что такое PCB (Process Control Block)?

    **Ответ:** PCB (дескриптор процесса, в Linux — `struct task_struct`) — фундаментальная структура данных ядра операционной системы, хранящая полную информацию о процессе: PID, состояние (running, sleeping, zombie), права доступа, указатель на таблицы страниц памяти (`mm_struct`), таблицу открытых файлов (`files_struct`), приоритет и статистику планировщика.

    **Пример:**

    ```c
    // Концептуальное представление ядра Linux:
    struct task_struct {
        pid_t pid;
        long state;
        struct mm_struct *mm;       // Адресное пространство
        struct files_struct *files; // Файловые дескрипторы
        // ...
    };
    ```

    **Источник:** [Bovet, Cesati: Understanding the Linux Kernel (Processes)](https://www.oreilly.com/library/view/understanding-the-linux/0596005652/?utm_source=gemini)

27. Что такое TCB?

    **Ответ:** TCB (Thread Control Block) — служебная структура данных ядра, хранящая состояние конкретного потока: TID (Thread ID), сохраненные регистры процессора, указатель на индивидуальный стек ядра, приоритет и указатель на родительский PCB процесса, которому принадлежит данный поток. (В Linux один и тот же `struct task_struct` служит и PCB, и TCB).

    **Пример:**

    ```
    // Связка в ядре:
    [ PCB Процесса ] <---> [ TCB Потока 1 ], [ TCB Потока 2 ]
    ```

    **Источник:** [Silberschatz, Galvin: Operating System Concepts (Thread Structures)](https://www.os-book.com/?utm_source=gemini)

    28. Что такое `fork()`?

    **Ответ:** `fork()` — системный вызов POSIX, создающий новый дочерний процесс, который является практически точной копией вызывающего родительского процесса. `fork()` вызывается один раз, но возвращает управление дважды: дочернему процессу возвращается 0, а родительскому процессу — PID созданного дочернего процесса.

    **Пример:**

    ```c
    #include <unistd.h>
    #include <stdio.h>

    int main() {
        pid_t pid = fork();
        if (pid == 0) {
            printf("I am child!\n");
        } else if (pid > 0) {
            printf("I am parent, child PID = %d\n", pid);
        }
    }
    ```

    **Источник:** [Linux man-pages: fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html?utm_source=gemini)

    29. Как `fork()` работает внутри?

    **Ответ:** Ядро выделяет новый `task_struct`, назначает уникальный PID, дублирует дескрипторы файлов родителя (увеличивая счетчики ссылок открытых файлов) и копирует таблицы страниц виртуальной памяти (Page Tables). Сами физические страницы памяти не копируются, а помечаются как Read-Only для работы механизма Copy-On-Write (COW).

    **Пример:**

    ```
    Родитель (Page Table) \
                            ---> [ Физическая страница памяти (Read-Only) ]
    Потомок (Page Table)  /
    ```

    **Источник:** [Maurice J. Bach: The Design of the UNIX Operating System](https://en.wikipedia.org/wiki/The_Design_of_the_UNIX_Operating_System?utm_source=gemini)

    30. Что копируется при `fork()`?

    **Ответ:** Логически копируется всё состояние процесса. Физически копируются: PCB (создается новый дескриптор), таблицы страниц виртуальной памяти, открытые файловые дескрипторы (структуры `file` становятся общими), переменные окружения и стек. Реальная физическая память страниц данных процесса откладывается до момента записи (COW).

    **Пример:**

    ```c
    // Дескрипторы файлов копируются:
    int fd = open("test.txt", O_WRONLY);
    fork();
    // Теперь и родитель, и потомок пишут в одну позицию файла (общий struct file)
    ```

    **Источник:** [Linux man-pages: fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html?utm_source=gemini)

31. Что такое copy-on-write?

    **Ответ:** Copy-On-Write (COW, копирование при записи) — оптимизационный механизм виртуальной памяти: при создании копии процесса страницы памяти родителя и потомка разделяются совместно с правами только для чтения (Read-Only). Дублирование физической страницы происходит только тогда, когда один из процессов пытается выполнить в нее запись, провоцируя Page Fault.

    **Пример:**

    ```
    Процесс пытается записать:
    [Запись в COW-страницу] -> [Аппаратный Page Fault] -> [Ядро выделяет новый фрейм 4 КБ] -> [Копирует данные] -> [Повторяет инструкцию записи]
    ```

    **Источник:** [Bovet, Cesati: Understanding the Linux Kernel (Memory Management: COW)](https://www.oreilly.com/library/view/understanding-the-linux/0596005652/?utm_source=gemini)

    32. Что делает `exec()`?

    **Ответ:** Семейство системных вызовов `exec()` (`execve`, `execl` и др.) полностью заменяет текущий образ процесса (код, стек, кучу, данные) на новую исполняемую программу из указанного бинарного файла ELF. При этом PID процесса, дескрипторы файлов (если не выставлен флаг `O_CLOEXEC`) и открытые ресурсы сохраняются.

    **Пример:**

    ```c
    #include <unistd.h>
    // Замена текущего процесса на выполнение команды /bin/ls:
    char *args[] = {"ls", "-l", NULL};
    execv("/bin/ls", args);
    // Сюда управление никогда не вернется при успешном вызове
    ```

    **Источник:** [Linux man-pages: execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html?utm_source=gemini)

    33. Разница `fork()` vs `exec()`?

    **Ответ:** `fork()` создает совершенно новый дочерний процесс, являющийся точной копией текущего (появляется новый PID, программа продолжает выполняться с той же точки). `exec()` не создает нового процесса, а уничтожает текущую программу внутри существующего процесса и загружает на ее место новую с нуля (PID остается прежним).

    **Пример:**

    ```c
    // Классический паттерн терминала (Shell):
    if (fork() == 0) {
        execvp(cmd, args); // Потомок заменяет себя новой программой
    }
    wait(NULL);            // Родитель ждет завершения
    ```

    **Источник:** [W. Richard Stevens: Advanced Programming in the UNIX Environment](https://www.pearson.com/en-us/subject-catalog/p/advanced-programming-in-the-unix-environment/P200000003301?utm_source=gemini)

    34. Что такое `wait()`?

    **Ответ:** Системный вызов `wait()` (или `waitpid()`) блокирует вызывающий родительский процесс до тех пор, пока один из его дочерних процессов не завершит выполнение, не будет убит сигналом или остановлен, возвращая код завершения потомка и освобождая его остаточную запись из таблицы процессов ядра.

    **Пример:**

    ```c
    #include <sys/wait.h>
    int status;
    pid_t child_pid = wait(&status);
    if (WIFEXITED(status)) {
        printf("Child exited with code %d\n", WEXITSTATUS(status));
    }
    ```

    **Источник:** [Linux man-pages: wait(2)](https://man7.org/linux/man-pages/man2/wait.2.html?utm_source=gemini)

35. Что такое zombie процесс?

    **Ответ:** Zombie-процесс (состояние `Z` / defunct) — это завершившийся дочерний процесс, который уже освободил все свои ресурсы (память, файловые дескрипторы), но его запись (PID, код выхода) всё еще хранится в таблице процессов ядра, потому что родительский процесс еще не прочитал код его завершения через вызов `wait()`.

    **Пример:**

    ```bash
    # Отображение zombie-процессов в выводе ps:
    ps aux | grep 'Z'
    # user 12345 0.0 0.0 0 0 ? Z 12:00 0:00 [app] <defunct>
    ```

    **Источник:** [Linux man-pages: wait(2) (Notes: Zombie processes)](https://man7.org/linux/man-pages/man2/wait.2.html?utm_source=gemini)

36. Что такое orphan процесс?

    **Ответ:** Orphan (процесс-сирота) — это процесс, родитель которого завершил работу раньше него самого. Такие процессы не становятся зомби: они немедленно переусыновляются корневым системным процессом `init`/`systemd` (PID 1), который регулярно вызывает `wait()` для завершающихся усыновленных сирот.

    **Пример:**

    ```c
    // Создание сироты:
    if (fork() > 0) {
        exit(0); // Родитель немедленно умирает, потомок становится сиротой
    }
    sleep(5); // Теперь getppid() вернет 1 (systemd)
    ```

    **Источник:** [Advanced Programming in the UNIX Environment (Process Relationships)](https://www.pearson.com/en-us/subject-catalog/p/advanced-programming-in-the-unix-environment/P200000003301?utm_source=gemini)

37. Как избежать zombie?

    **Ответ:** 1) Регулярно вызывать `wait()` / `waitpid()` в родительском процессе; 2) Установить обработчик сигнала `SIGCHLD`, вызывающий `waitpid(-1, &status, WNOHANG)` в цикле; 3) Игнорировать сигнал завершения детей: `signal(SIGCHLD, SIG_IGN)` — ядро автоматически сразу удалит завершившегося потомка без перевода в зомби; 4) Паттерн двойного форка (double fork).

    **Пример:**

    ```c
    #include <signal.h>
    // Автоматическая утилизация зомби ядром Linux:
    signal(SIGCHLD, SIG_IGN);
    ```

    **Источник:** [POSIX standard: SIGCHLD handling](https://pubs.opengroup.org/onlinepubs/9699919799/functions/sigaction.html?utm_source=gemini)

38. Что такое pthread?

    **Ответ:** POSIX Threads (pthreads) — стандартизированный интерфейс C-библиотеки для создания и синхронизации потоков на уровне операционных систем POSIX (Linux, macOS, BSD). Включает в себя функции управления потоками (`pthread_create`), мьютексами (`pthread_mutex_t`) и условными переменными (`pthread_cond_t`).

    **Пример:**

    ```c
    #include <pthread.h>
    void* worker(void* arg) { return NULL; }

    pthread_t thread;
    pthread_create(&thread, NULL, worker, NULL);
    pthread_join(thread, NULL);
    ```

    **Источник:** [Linux man-pages: pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html?utm_source=gemini)

39. Как создать поток в C++ (std::thread)?

    **Ответ:** Поток создается инстанцированием объекта `std::thread` (из заголовка `<thread>`), которому передается исполняемый объект (лямбда, функция, функтор) и аргументы. Поток начинает исполнение немедленно в момент создания конструктора.

    **Пример:**

    ```cpp
    #include <thread>
    #include <iostream>

    void print_sum(int a, int b) {
        std::cout << a + b << '\n';
    }

    int main() {
        std::thread t(print_sum, 5, 7);
        t.join();
    }
    ```

    **Источник:** [cppreference: std::thread](https://en.cppreference.com/w/cpp/thread/thread?utm_source=gemini)

    40. `join` vs `detach`?

    **Ответ:** `join()` блокирует текущий поток до тех пор, пока целевой поток не завершит исполнение, очищая все его системные ресурсы. `detach()` отделяет поток от объекта `std::thread`, позволяя ему исполняться независимо в фоновом режиме; ресурсы detached-потока освобождаются ОС самостоятельно после его завершения.

    **Пример:**

    ```cpp
    std::thread t1(worker);
    t1.join(); // Ждем завершения

    std::thread t2(background_task);
    t2.detach(); // Отпустили, t2 больше не joinable
    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Joining and Detaching)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

41. Что будет если не join поток?

    **Ответ:** Если объект `std::thread` уничтожается (вызывается его деструктор при выходе из скоупа), но при этом поток всё еще находится в состоянии `joinable()` (для него не вызван ни `join()`, ни `detach()`), рантайм C++ немедленно аварийно завершает работу всей программы вызовом `std::terminate()`.

    **Пример:**

    ```cpp
    void bad() {
        std::thread t([](){});
        // Забыли t.join(); при выходе из функции -> std::terminate()!
    }
    ```

    **Источник:** [cppreference: std::thread::~thread](https://en.cppreference.com/w/cpp/thread/thread/~thread?utm_source=gemini)

42. Что такое race condition?

    **Ответ:** Race condition (состояние гонки) — архитектурная ошибка многопоточного приложения, при которой корректность программы зависит от неконтролируемого относительного порядка или таймингов выполнения операций разными потоками (например, паттерн проверки с последующим действием: Check-Then-Act).

    **Пример:**

    ```cpp
    // Check-then-act гонка:
    if (!queue.empty()) {
        // Другой поток успел сделать queue.pop() здесь!
        auto item = queue.front(); // Ошибка в рантайме
    }
    ```

    **Источник:** [C++ Core Guidelines: CP.2: Avoid data races](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp2-avoid-data-races)

43. Что такое thread-safe код?

    **Ответ:** Потокобезопасный (thread-safe) код — это программный модуль, класс или функция, которые гарантируют корректную работу, соблюдение всех инвариантов и отсутствие состояний гонки (Data Races) при одновременном обращении из нескольких параллельных потоков без необходимости внешней синхронизации.

    **Пример:**

    ```cpp
    // Thread-safe счетчик на базе атомика:
    class ThreadSafeCounter {
        std::atomic<int> count{0};
    public:
        void increment() { count.fetch_add(1, std::memory_order_relaxed); }
        int get() const { return count.load(std::memory_order_relaxed); }
    };
    ```

    **Источник:** [Java Concurrency in Practice (Goetz et al. - Thread Safety)](https://jcip.net/?utm_source=gemini)

44. Когда использовать процессы вместо потоков?

    **Ответ:** Процессы выбирают, когда необходима: 1) максимальная изоляция сбоев (падение рабочего процесса не убивает основной сервер, например как в браузерах Chrome или Nginx); 2) изоляция безопасности (песочницы / sandboxing с разграничением привилегий); 3) распределенные вычисления на разных машинах кластера; 4) работа со сторонними нестабильными C-библиотеками с утечками памяти.

    **Пример:**

    ```
    Архитектура Chromium:
    [Browser Process] <--- IPC ---> [Isolated Tab Renderer Process 1]
                                   [Isolated Tab Renderer Process 2]
    ```

    **Источник:** [The Chromium Projects: Multi-process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/?utm_source=gemini)

45. Что дешевле: thread или process?

    **Ответ:** Поток (thread) значительно дешевле. Создание процесса требует аллокации нового дескриптора PCB, дублирования таблиц страниц памяти (COW) и инициализации окружения. При переключении потоков одного процесса не сбрасывается кэш TLB (так как таблица CR3 не меняется), тогда как переключение процессов требует смены корневых таблиц памяти и глубокой очистки кэшей.

    **Пример:**

    ```
    Создание pthread в Linux: ~10-20 микросекунд.
    Создание fork() процесса в Linux: ~100-500 микросекунд.
    ```

    **Источник:** [Eli Bendersky: Measuring context switching and process creation overhead](https://eli.thegreenplace.net/2018/measuring-context-switching-and-memory-overheads-for-linux-processes/?utm_source=gemini)

46. Что такое thread pool?

    **Ответ:** Thread Pool (пул потоков) — шаблон проектирования, предварительно создающий фиксированное количество долгоживущих рабочих потоков (workers) и очередь задач. Задачи помещаются в очередь, а свободные потоки забирают их на исполнение, устраняя тяжелые накладные расходы на постоянное создание и уничтожение потоков ОС.

    **Пример:**

    ```cpp
    // Концепция пула:
    ThreadPool pool(4); // 4 постоянных потока
    pool.enqueue([]{ do_work_1(); });
    pool.enqueue([]{ do_work_2(); });
    ```

    **Источник:** [Ousterhout, J.: A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php?utm_source=gemini)

47. Что такое TLS (thread-local storage)?

    **Ответ:** Thread-Local Storage (TLS) — модель размещения статических данных, при которой каждая переменная, помеченная как `thread_local`, имеет отдельный физический экземпляр для каждого потока выполнения программы. Доступ к ней не требует мьютексов и атомиков, так как память изолирована.

    **Пример:**

    ```cpp
    // У каждого потока будет СВОЙ персональный счетчик:
    thread_local int thread_specific_id = 0;

    void work() {
        thread_specific_id++;
    }
    ```

    **Источник:** [cppreference: Storage duration (thread_local)](https://en.cppreference.com/w/cpp/language/storage_duration?utm_source=gemini#Storage_duration)

    48. Как работает `std::this_thread::sleep_for`?

    **Ответ:** Функция переводит текущий поток из состояния выполнения (`Running`) в состояние ожидания (`Blocked`/`Sleeping`), делая системный вызов ядра ОС (например, `clock_nanosleep` в Linux). Ядро заносит поток в очередь таймера и переключает CPU на другие полезные задачи; по истечении времени таймер генерирует прерывание, и ядро возвращает поток в состояние `Runnable`.

    **Пример:**

    ```cpp
    #include <thread>
    #include <chrono>

    // Поток усыпляется и освобождает ядро CPU для других задач:
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    ```

    **Источник:** [Linux man-pages: clock_nanosleep(2)](https://man7.org/linux/man-pages/man2/clock_nanosleep.2.html?utm_source=gemini)

49. Что такое concurrency vs parallelism?

    **Ответ:** Concurrency (конкурентность) — способность программы быть структурированной в виде независимых задач, которые могут исполняться вперемешку во времени (даже на одном ядре процессора путем деления времени). Parallelism (параллелизм) — физически одновременное выполнение нескольких инструкций на нескольких физических ядрах CPU в один момент времени.

    **Пример:**

    ```
    Concurrency: Жонглер жонглирует 3 шариками одной рукой (задачи сменяются, рука одна).
    Parallelism: 2 жонглера бросают шарики одновременно (два ядра работают параллельно).
    ```

    **Источник:** [Rob Pike: Concurrency is not Parallelism (Waza Talk)](https://go.dev/blog/waza-talk?utm_source=gemini)

50. Какие проблемы многопоточности?

    **Ответ:** 1) Гонки данных (Data Races) и неопределенное поведение; 2) Взаимные блокировки (Deadlocks) и Livelocks; 3) Ложное разделение данных в кэш-линиях (False Sharing); 4) Потери производительности из-за contention на блокировках; 5) Недетерминированность выполнения и исключительная сложность воспроизведения багов (Heisenbugs).

    **Пример:**

    ```cpp
    // Классический False Sharing: два потока замедляют друг друга,
    // модифицируя соседние байты внутри одной 64-байтной кэш-линии
    struct Data {
        alignas(64) std::atomic<int> thread1_val;
        alignas(64) std::atomic<int> thread2_val; // Разнесены для защиты
    };
    ```

    **Источник:** [Herb Sutter: Eliminate False Sharing (Dr. Dobb's Journal)](https://www.drdobbs.com/parallel/eliminate-false-sharing/217500206?utm_source=gemini)

    ---

### Scheduling Algorithms

51. Что делает scheduler?

    **Ответ:** Scheduler (планировщик процессов/потоков) — это компонент ядра операционной системы, который решает, какой из готовых к выполнению потоков (в состоянии `Runnable`) должен занять доступное вычислительное ядро процессора (CPU), когда и на какой промежуток времени, оптимизируя утилизацию CPU, задержку отклика и пропускную способность.

    **Пример:**

    ```
    // Изменение политики и приоритета планировщика через POSIX API:
    #include <sched.h>
    struct sched_param param;
    param.sched_priority = 10;
    sched_setscheduler(0, SCHED_RR, &param);


    ```

    **Источник:** [Linux man-pages: sched(7)](https://man7.org/linux/man-pages/man7/sched.7.html?utm_source=gemini)

52. Что такое preemptive scheduling?

    **Ответ:** Preemptive scheduling (вытесняющая многозадачность) — стратегия планирования, при которой операционная система имеет право принудительно прервать выполнение текущего потока по аппаратному прерыванию таймера или при появлении более приоритетной задачи, переключив контекст процессора на другой поток без согласия текущего.

    **Пример:**

    ```
    [Поток 1 работает] -> [Аппаратный тик таймера] -> [Ядро вытесняет Поток 1] -> [Поток 2 получает CPU]


    ```

    **Источник:** [Silberschatz, Galvin: Operating System Concepts (Preemptive Scheduling)](https://www.os-book.com/?utm_source=gemini)

53. Что такое non-preemptive?

    **Ответ:** Non-preemptive (кооперативная многозадачность) — схема планирования, при которой поток, единожды получив процессор, удерживает его до тех пор, пока добровольно не освободит CPU (вызов `yield()`, завершение работы или блокировка на операциях ввода-вывода). Сбойный поток с бесконечным циклом в такой системе может заблокировать всю ОС.

    **Пример:**

    ```
    // Кооперативная уступка процессора:
    #include <sched.h>
    sched_yield(); // Поток сам просит ядро переключиться на другого


    ```

    **Источник:** [Tanenbaum, A. S.: Modern Operating Systems (Cooperative Multitasking)](https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003295?utm_source=gemini)

54. Round-robin алгоритм?

    **Ответ:** Round-Robin (RR, карусельный алгоритм) — классический вытесняющий алгоритм планирования с разделением времени: всем процессам назначается одинаковый фиксированный квант времени процессора (time slice). Процессы организованы в очередь FIFO; по исчерпании кванта процесс перемещается в конец очереди, а процессор отдается следующему.

    **Пример:**

    ```
    Очередь: [P1, P2, P3] (квант 10 мс)
    P1 (10 мс) -> P2 (10 мс) -> P3 (10 мс) -> P1 (10 мс) ...


    ```

    **Источник:** [Silberschatz, Galvin: Operating System Concepts (Round-Robin Scheduling)](https://www.os-book.com/?utm_source=gemini)

55. Что такое time slice?

    **Ответ:** Time slice (квант времени / scheduling quantum) — непрерывный промежуток процессорного времени (обычно от 1 до 100 мс), выделяемый планировщиком потоку для непрерывного выполнения на ядре до того, как сработает планировщик и пересмотрит распределение CPU.

    **Пример:**

    ```
    # Просмотр базового кванта планировщика Linux CFS:
    sysctl kernel.sched_latency_ns
    # kernel.sched_latency_ns = 6000000 (6 миллисекунд)


    ```

    **Источник:** [Linux Kernel Documentation: CFS Scheduler](https://www.kernel.org/doc/html/latest/scheduler/sched-design-CFS.html?utm_source=gemini)

56. Что такое priority scheduling?

    **Ответ:** Priority scheduling (планирование по приоритетам) — алгоритм, назначающий каждому процессу числовой приоритет. Планировщик всегда выбирает для исполнения готовый процесс с наивысшим приоритетом. Приоритеты могут быть статическими (задаются пользователем через `nice`) или динамическими (ядро повышает приоритет интерактивным I/O-bound процессам).

    **Пример:**

    ```
    # Запуск команды с повышенным приоритетом (nice от -20 до 19, меньше = приоритетнее):
    nice -n -5 ./high_priority_service


    ```

    **Источник:** [Linux man-pages: nice(2)](https://man7.org/linux/man-pages/man2/nice.2.html?utm_source=gemini)

57. starvation — что это?

    **Ответ:** Starvation (голодание) — ситуация, при которой поток, готовый к исполнению, бесконечно долго или недопустимо долго не получает процессорное время, потому что планировщик постоянно отдает предпочтение другим потокам с более высоким приоритетом.

    **Пример:**

    ```
    Поток с приоритетом Low никогда не получает CPU,
    потому что непрерывно поступают задачи с приоритетом High.


    ```

    **Источник:** [The Art of Multiprocessor Programming (Herlihy & Shavit)](https://www.elsevier.com/books/the-art-of-multiprocessor-programming/herlihy/978-0-12-397337-5?utm_source=gemini)

58. Как избежать starvation?

    **Ответ:** Основной механизм — старение (Aging): техника, при которой ядро постепенно увеличивает динамический приоритет процесса по мере того, как он ожидает в очереди `runqueue`. Рано или поздно приоритет голодающего процесса сравнивается с наивысшим, и он получает процессор. Также применяются справедливые планировщики (CFS/EEVDF).

    **Пример:**

    ```
    Dynamic_Priority = Base_Priority + Time_In_Wait_Queue


    ```

    **Источник:** [Silberschatz, Galvin: Operating System Concepts (Aging Technique)](https://www.os-book.com/?utm_source=gemini)

59. Что такое fair scheduling?

    **Ответ:** Fair scheduling (справедливое планирование, например CFS — Completely Fair Scheduler) — концепция, стремящаяся предоставить каждому процессу строго равную долю процессорного времени (пропорционально его весу). В CFS ядро отслеживает виртуальное время выполнения (`vruntime`): планировщик всегда отдает CPU процессу с наименьшим `vruntime`, используя красно-черное дерево.

    **Пример:**

    ```
    // Дерево CFS:
    // Самый "обделенный" процесс лежит в крайнем левом узле rbtree:
    struct task_struct *leftmost = rb_entry(rb_first_cached(&cfs_rq->tasks_timeline), ...);


    ```

    **Источник:** [Robert Love: Linux Kernel Development (The Completely Fair Scheduler)](https://en.wikipedia.org/wiki/Linux_Kernel_Development?utm_source=gemini)

60. Что такое load balancing?

    **Ответ:** Load balancing (балансировка нагрузки) — механизм ядра на многопроцессорных (SMP) системах, распределяющий потоки между очередями исполнения (`runqueues`) разных ядер CPU, чтобы исключить ситуацию, когда одно ядро перегружено очередью задач, а соседние ядра простаивают.

    **Пример:**

    ```
    # Мониторинг равномерности распределения нагрузки по ядрам CPU:
    mpstat -P ALL 1


    ```

    **Источник:** [Linux Kernel Documentation: Scheduler Domains](https://www.kernel.org/doc/html/latest/scheduler/sched-domains.html?utm_source=gemini)

61. Что такое CPU affinity?

    **Ответ:** CPU affinity (привязка к процессору) — конфигурация планировщика, связывающая выполнение конкретного процесса или потока со строго определенным набором физических или логических ядер процессора, запрещая планировщику мигрировать этот поток на другие ядра.

    **Пример:**

    ```
    # Привязка запущенного процесса с PID 1234 к ядрам 0 и 1:
    taskset -cp 0,1 1234


    ```

    **Источник:** [Linux man-pages: sched_setaffinity(2)](https://man7.org/linux/man-pages/man2/sched_setaffinity.2.html?utm_source=gemini)

62. Что такое real-time scheduling?

    **Ответ:** Real-time scheduling (планирование реального времени) — детерминированный режим планировщика (POSIX политики `SCHED_FIFO`, `SCHED_RR`, `SCHED_DEADLINE`), гарантирующий, что жесткие временные рамки (deadlines) выполнения задач будут строго соблюдены: real-time поток немедленно вытесняет любые обычные процессы.

    **Пример:**

    ```
    # Запуск процесса с политикой жесткого реального времени SCHED_FIFO:
    chrt -f 99 ./flight_controller


    ```

    **Источник:** [Linux man-pages: sched(7) (Real-time policies)](https://man7.org/linux/man-pages/man7/sched.7.html?utm_source=gemini)

63. Разница SJF и FIFO?

    **Ответ:** FIFO (First-In, First-Out) выполняет процессы строго в порядке их поступления, независимо от длительности. SJF (Shortest Job First) выбирает процесс с минимальным временем выполнения CPU-burst, минимизируя среднее время ожидания, но страдая от невозможности точно знать длительность будущих задач и риска голодания длинных процессов.

    **Пример:**

    ```
    Задачи: A (100 с), B (1 с), C (1 с).
    FIFO: A -> B -> C (B ждет 100 с, C ждет 101 с).
    SJF:  B -> C -> A (B ждет 0 с, C ждет 1 с, A ждет 2 с).


    ```

    **Источник:** [Silberschatz, Galvin: Operating System Concepts (SJF vs FCFS)](https://www.os-book.com/?utm_source=gemini)

64. Что такое throughput?

    **Ответ:** Throughput (пропускная способность планировщика) — количество процессов или полезных вычислительных задач, полностью выполненных и завершенных операционной системой за единицу времени (например, 500 задач в секунду).

    **Пример:**

    ```
    Throughput = Total_Completed_Processes / Total_Elapsed_Time


    ```

    **Источник:** [Brendan Gregg: Systems Performance (Throughput Metric)](https://www.brendangregg.com/methodology.html?utm_source=gemini)

65. Что такое latency?

    **Ответ:** Latency (задержка планировщика / scheduling latency) — время от момента, когда поток перешел в состояние готовности (`Runnable` / проснулся по I/O или прерыванию), до момента, когда он фактически получил процессорное ядро и начал выполнение инструкций.

    **Пример:**

    ```
    # Измерение задержки планировщика в Linux через perf sched:
    perf sched record -- ./my_app
    perf sched latency


    ```

    **Источник:** [Linux man-pages: perf-sched(1)](https://man7.org/linux/man-pages/man1/perf-sched.1.html?utm_source=gemini)

66. Что такое context switching overhead?

    **Ответ:** Это суммарные вычислительные затраты процессора, расходуемые не на полезную работу приложений, а на саму процедуру переключения задач: выполнение кода планировщика ядра, сохранение/восстановление регистров, сброс конвейера, перезагрузка таблиц виртуальной памяти и последующие промахи кэша CPU (L1/L2) из-за холодной памяти новой задачи.

    **Пример:**

    ```
    // Если квант равен 1 мс, а переключение занимает 0.1 мс,
    // то 10% времени CPU теряется исключительно на overhead планировщика.


    ```

    **Источник:** [Eli Bendersky: Measuring context switching overhead](https://eli.thegreenplace.net/2018/measuring-context-switching-and-memory-overheads-for-linux-processes/?utm_source=gemini)

67. Как влияет количество потоков на производительность?

    **Ответ:** Увеличение числа потоков до количества физических ядер ускоряет выполнение за счет истинного параллелизма. При дальнейшем росте (oversubscription) производительность выходит на плато, а затем резко падает из-за лавинообразного роста context switches, конкуренции за блокировки (contention) и вытеснения рабочих данных из аппаратных кэшей процессора.

    **Пример:**

    ```
    График производительности от потоков:
    Speed |    /\
          |   /  \____  (падение из-за contention и context switches)
          |  /
          +------------
             Cores  Threads ->


    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Choosing the number of threads)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

68. Что такое NUMA?

    **Ответ:** NUMA (Non-Uniform Memory Access) — многопроцессорная архитектура, в которой память физически распределена между сокетами: доступ процессора к памяти своей локальной ноды происходит в разы быстрее, чем к памяти, подключенной к соседнему сокету (через межпроцессорную шину QPI/UPI/Infinity Fabric).

    **Пример:**

    ```
    # Топология NUMA-узлов в системе:
    numactl --hardware
    # node 0 cpus: 0-7, node 0 size: 32 GB
    # node 1 cpus: 8-15, node 1 size: 32 GB


    ```

    **Источник:** [Linux Kernel Documentation: NUMA](https://www.kernel.org/doc/html/latest/vm/numa.html?utm_source=gemini)

69. Как scheduler работает с многопроцессорными системами?

    **Ответ:** Современный планировщик строится по модели NUMA-aware / Per-CPU Runqueue: у каждого ядра есть своя локальная очередь задач, что устраняет блокировки общего планировщика. Планировщик старается удерживать поток на том же ядре и том же NUMA-узле для сохранения локальности кэша, прибегая к балансировке нагрузки (миграции) только при значительном перекосе очередей.

    **Пример:**

    ```
    // Ядро Linux группирует планирование в sched_domain с иерархией:
    // SMT (Hyperthreading) -> MC (Multi-Core) -> NUMA node


    ```

    **Источник:** [Linux Kernel Documentation: Scheduler Domains](https://www.kernel.org/doc/html/latest/scheduler/sched-domains.html?utm_source=gemini)

70. Что такое run queue?

    **Ответ:** Run queue (`runqueue`, `rq`) — фундаментальная внутренняя структура данных планировщика ядра, хранящая упорядоченный список всех потоков, находящихся в состоянии готовности к исполнению (`TASK_RUNNING`) и ожидающих предоставления процессорного ядра.

    **Пример:**

    ```
    // В Linux у каждого CPU ядра есть своя независимая очередь:
    DEFINE_PER_CPU(struct rq, runqueues);


    ```

    **Источник:** [Bovet, Cesati: Understanding the Linux Kernel (The Runqueue structure)](https://www.oreilly.com/library/view/understanding-the-linux/0596005652/?utm_source=gemini)

### Synchronization

71. Что такое mutex?

    **Ответ:** Mutex (Mutual Exclusion / взаимное исключение) — примитив синхронизации, гарантирующий, что только один поток может в данный момент времени владеть блокировкой и исполнять защищаемую критическую секцию кода, усыпляя остальные потоки через ядро ОС при попытке захвата.

    **Пример:**

    ```
    #include <mutex>
    std::mutex mtx;

    void safe_increment(int& val) {
        std::lock_guard<std::mutex> lock(mtx);
        val++; // Безопасно под мьютексом
    }


    ```

    **Источник:** [cppreference: std::mutex](https://en.cppreference.com/w/cpp/thread/mutex?utm_source=gemini)

72. Как работает mutex внутри?

    **Ответ:** Современный мьютекс (например, `pthread_mutex` на базе Linux `futex`) работает гибридно в два этапа: 1) В User Space пытается атомарно захватить переменную состояния через CAS (`cmpxchg`). Если мьютекс свободен, захват происходит мгновенно без переключения в ядро; 2) Если занят, вызывается системный вызов `sys_futex(FUTEX_WAIT)`, и ядро усыпляет поток, переводя его в очередь ожидания.

    **Пример:**

    ```
    // Псевдокод Futex:
    if (atomic_cas(&lock_word, 0, 1) == 0) return; // Успех в User Space!
    syscall(SYS_futex, &lock_word, FUTEX_WAIT, 1, ...); // Сон в Kernel Space


    ```

    **Источник:** [Ulrich Drepper: Futexes Are Tricky](https://dept-info.labri.fr/~denis/Enseignement/2008-IR/Articles/01-futex.pdf?utm_source=gemini)

73. Что такое semaphore?

    **Ответ:** Semaphore (семафор) — примитив синхронизации, управляющий доступом к пулу разделяемых ресурсов с помощью внутреннего защищенного целочисленного счетчика. Операция `acquire()` (`wait`/`P`) уменьшает счетчик (блокируя поток, если он 0), а `release()` (`signal`/`V`) увеличивает счетчик, пробуждая ожидающий поток.

    **Пример:**

    ```
    #include <semaphore>
    // Ограничение одновременного доступа к ресурсу до 4 потоков:
    std::counting_semaphore<4> sem(4);

    void access_resource() {
        sem.acquire();
        // полезная работа
        sem.release();
    }


    ```

    **Источник:** [Dijkstra, E. W.: Over seinpalen (Semaphores)](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD00xx/EWD74.html?utm_source=gemini)

74. Binary vs counting semaphore?

    **Ответ:** Binary semaphore (бинарный семафор) имеет максимальное значение счетчика, равное 1 (может принимать только значения 0 и 1). Counting semaphore (счетный семафор) может иметь произвольное положительное максимальное значение $N$, регулируя доступ к группе однотипных ресурсов (например, пулу из 10 соединений с БД).

    **Пример:**

    ```
    std::binary_semaphore bin_sem(1);    // Значения: 0 или 1
    std::counting_semaphore<10> count_sem(10); // Значения: от 0 до 10


    ```

    **Источник:** [cppreference: std::counting_semaphore](https://en.cppreference.com/w/cpp/thread/counting_semaphore?utm_source=gemini)

75. Что такое spinlock?

    **Ответ:** Spinlock (спинлок) — примитив блокировки, при попытке захвата которого поток не засыпает через системный вызов ядра, а непрерывно опрашивает флаг блокировки в активном плотном цикле (busy-waiting), загружая ядро CPU на 100% в ожидании освобождения.

    **Пример:**

    ```
    #include <atomic>
    class Spinlock {
        std::atomic_flag flag = ATOMIC_FLAG_INIT;
    public:
        void lock() {
            while (flag.test_and_set(std::memory_order_acquire)) {
                #if defined(__x86_64__)
                _mm_pause(); // Снижает энергопотребление и нагрузку на шину памяти
                #endif
            }
        }
        void unlock() { flag.clear(std::memory_order_release); }
    };


    ```

    **Источник:** [Intel 64 and IA-32 Architectures Optimization Reference Manual (Spin-Wait Loop)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

76. Когда использовать spinlock?

    **Ответ:** Спинлоки оправданы исключительно тогда, когда: 1) критическая секция ультракороткая (смена нескольких указателей), и время удержания блокировки меньше времени двух переключений контекста ядра (\~2–5 мкс); 2) в коде ядра ОС внутри обработчиков аппаратных прерываний, где засыпать (вызывать `sleep`/`schedule`) категорически запрещено.

    **Пример:**

    ```
    // Внутри ISR драйвера Linux:
    spin_lock_irqsave(&my_lock, flags);
    // 2 инструкции чтения регистров
    spin_unlock_irqrestore(&my_lock, flags);


    ```

    **Источник:** [Linux Kernel Documentation: Spinlocks](https://www.kernel.org/doc/Documentation/locking/spinlocks.txt?utm_source=gemini)

77. Что такое deadlock?

    **Ответ:** Deadlock (взаимная блокировка) — ситуация в многопоточной системе, когда два или более потока взаимно заблокированы в ожидании освобождения ресурсов, удерживаемых друг другом, и ни один из них не может продолжить выполнение самостоятельно.

    **Пример:**

    ```
    // Поток 1 держит M1 и ждет M2.
    // Поток 2 держит M2 и ждет M1.


    ```

    **Источник:** [Coffman, E. G.: System Deadlocks (1971)](https://dl.acm.org/doi/10.1145/356586.356588?utm_source=gemini)

78. 4 условия deadlock?

    **Ответ:** Deadlock возникает тогда и только тогда, когда одновременно выполняются 4 условия Коффмана:

    1. **Mutual Exclusion** (взаимное исключение — ресурс неделим);

    2. **Hold and Wait** (удержание и ожидание — поток удерживает ресурс и запрашивает новый);

    3. **No Preemption** (невытесняемость — ресурс нельзя принудительно отобрать);

    4. **Circular Wait** (круговое ожидание — существует замкнутая цепочка ожидания $T_1 \to T_2 \to \dots \to T_1$).

    **Пример:**

    ```
    [Поток 1] --держит--> [Ресурс A] <--ждет-- [Поток 2]
        |                                          ^
        |--ждет---------> [Ресурс B] --держит------|


    ```

    **Источник:** [Edward G. Coffman: System Deadlocks (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/356586.356588?utm_source=gemini)

79. Как предотвратить deadlock?

    **Ответ:** Достаточно разрушить хотя бы одно из четырех условий Коффмана:

    1. Разрушение Circular Wait: ввести единый глобальный порядок захвата мьютексов (lock hierarchy);

    2. Использовать одновременный атомарный захват ресурсов (`std::scoped_lock` / `std::lock`);

    3. Использовать неблокирующие попытки захвата с откатом (`try_lock()` / таймауты);

    4. Избегать удержания нескольких замков одновременно.

    **Пример:**

    ```
    // Исключает deadlock при любом порядке аргументов:
    std::scoped_lock lock(account_a.mtx, account_b.mtx);


    ```

    **Источник:** [C++ Core Guidelines: CP.25: Prefer std::scoped_lock for multi-mutex locking](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#cp25-prefer-stdscoped_lock-for-multi-mutex-locking)

80. Что такое livelock?

    **Ответ:** Livelock (активная взаимная блокировка) — состояние, в котором потоки не спят на системных блокировках, а активно меняют свои состояния в ответ на действия друг друга (например, синхронно пытаются уступить ресурс через `try_lock` и откатываются), расходуя 100% CPU, но не продвигаясь вперед в решении полезной задачи.

    **Пример:**

    ```
    // Два джентльмена бесконечно уступают друг другу дорогу в узком дверном проеме.


    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Deadlock and Livelock)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

81. Что такое starvation?

    **Ответ:** Starvation (голодание) — ситуация, когда один или несколько потоков длительное время или бесконечно не могут получить доступ к разделяемому ресурсу или мьютексу из-за несправедливой политики примитивов синхронизации, отдающих предпочтение другим конкурирующим потокам.

    **Пример:**

    ```
    // Reader-Writer Lock с предпочтением читателей:
    // непрерывный поток читателей полностью блокирует писателя от доступа к данным.


    ```

    **Источник:** [The Little Book of Semaphores (Readers-Writers Problem)](https://greenteapress.com/wp/semaphores/?utm_source=gemini)

82. Что такое critical section?

    **Ответ:** Критическая секция — участок программного кода, в котором осуществляется доступ к разделяемым разделяемым изменяемым данным (shared mutable state), одновременный вход в который более чем одного потока приводит к гонке по данным (Data Race).

    **Пример:**

    ```
    mtx.lock();
    // --- НАЧАЛО КРИТИЧЕСКОЙ СЕКЦИИ ---
    balance += deposit;
    // --- КОНЕЦ КРИТИЧЕСКОЙ СЕКЦИИ ---
    mtx.unlock();


    ```

    **Источник:** [Dijkstra, E. W.: Cooperating Sequential Processes](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD01xx/EWD123.html?utm_source=gemini)

83. Что такое atomic операции?

    **Ответ:** Атомарные операции — неделимые низкоуровневые машинные инструкции процессора над ячейками памяти. Для всех остальных потоков в системе такая операция наблюдается либо как еще не начавшаяся, либо как уже полностью завершенная; чтение промежуточного или наполовину записанного состояния аппаратно невозможно.

    **Пример:**

    ```
    ; x86 инструкция атомарного сложения с блокировкой шины кэша:
    lock add dword [rdi], 1


    ```

    **Источник:** [Intel 64 and IA-32 Architectures Software Developer's Manual (Locked Atomic Operations)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html?utm_source=gemini)

    84. `std::atomic` — как работает?

    **Ответ:** Шаблон `std::atomic<T>` указывает компилятору отображать операции чтения, записи и RMW (Read-Modify-Write) напрямую в специальные атомарные машинные инструкции процессора (`LOCK CMPXCHG`, `LOCK XADD`), запрещая компилятору выносить чтения в регистры и переставлять инструкции памяти местами в обход барьеров.

    **Пример:**

    ```
    #include <atomic>
    std::atomic<int> counter{0};
    counter.fetch_add(1); // Атомарная модификация без мьютекса


    ```

    **Источник:** [cppreference: std::atomic](https://en.cppreference.com/w/cpp/atomic/atomic?utm_source=gemini)

85. memory order в C++?

    **Ответ:** Memory Order (модель упорядочивания памяти) — набор спецификаторов стандартов C++11+, управляющих тем, как атомарные операции упорядочиваются относительно обычных чтений и записей памяти. Он определяет границы дозволенного для переупорядочивания инструкций компилятором и внеочередным исполнением (OoO) процессора.

    **Пример:**

    ```
    // Доступные режимы:
    // relaxed, consume, acquire, release, acq_rel, seq_cst


    ```

    **Источник:** [cppreference: std::memory_order](https://en.cppreference.com/w/cpp/atomic/memory_order?utm_source=gemini)

86. acquire/release semantics?

    **Ответ:** Это паттерн межпоточной публикации данных:

    * `release` (при записи в атомик) гарантирует, что никакие предшествующие чтения/записи не опустятся ниже этой точки;

    * `acquire` (при чтении того же атомика) гарантирует, что никакие последующие чтения/записи не поднимутся выше этой точки. В паре они формируют отношение `happens-before`.

    **Пример:**

    ```
    // Поток 1:
    data = 42;
    ready.store(true, std::memory_order_release);

    // Поток 2:
    if (ready.load(std::memory_order_acquire)) {
        assert(data == 42); // Гарантированно увидит 42!
    }


    ```

    **Источник:** [Jeff Preshing: Acquire and Release Semantics](https://preshing.com/20120913/acquire-and-release-semantics/?utm_source=gemini)

    87. `seq_cst` — что это?

    **Ответ:** `memory_order_seq_cst` (Sequentially Consistent) — строжайшая модель памяти по умолчанию: помимо свойств acquire-release, она гарантирует существование единого глобального абсолютного порядка выполнения всех `seq_cst` операций во всей программе, одинаково наблюдаемого всеми ядрами процессора.

    **Пример:**

    ```
    std::atomic<bool> x{false}, y{false};
    // Все операции без аргумента порядка используют seq_cst:
    x.store(true);


    ```

    **Источник:** [Leslie Lamport: How to Make a Multiprocessor Computer That Correctly Executes Multiprocess Programs](https://lamport.azurewebsites.net/pubs/multi.pdf?utm_source=gemini)

88. Что такое lock-free?

    **Ответ:** Lock-free (свободный от блокировок) — класс многопоточных алгоритмов, который гарантирует на аппаратном уровне (через атомики и CAS), что хотя бы один поток в системе обязательно совершает полезный прогресс за конечное число шагов, даже если часть остальных потоков была приостановлена ядром ОС.

    **Пример:**

    ```
    // Lock-free вершина стека:
    void push(Node* new_node) {
        new_node->next = head.load();
        while (!head.compare_exchange_weak(new_node->next, new_node));
    }


    ```

    **Источник:** [Maurice Herlihy: Wait-Free Synchronization (ACM TOPLAS)](https://dl.acm.org/doi/10.1145/114005.102808?utm_source=gemini)

89. Что такое wait-free?

    **Ответ:** Wait-free (свободный от ожидания) — сильнейшая форма неблокирующей синхронизации: каждый отдельный поток гарантированно завершает свою операцию за фиксированное конечное число шагов независимо от действий, конкуренции или задержек всех других потоков системы (без циклов перезапуска CAS).

    **Пример:**

    ```
    // Атомарное инкрементирование счетчика без цикла повторов является wait-free:
    counter.fetch_add(1, std::memory_order_relaxed);


    ```

    **Источник:** [Herlihy & Shavit: The Art of Multiprocessor Programming](https://www.elsevier.com/books/the-art-of-multiprocessor-programming/herlihy/978-0-12-397337-5?utm_source=gemini)

    90. `condition_variable` — зачем?

    **Ответ:** `std::condition_variable` необходима для организации энергоэффективного ожидания событий между потоками: она позволяет потоку освободить мьютекс и безопасно заснуть в ядре без расхода тактов CPU, пока другой поток не изменит разделяемое состояние и не разбудит его сигналом.

    **Пример:**

    ```
    #include <condition_variable>
    std::condition_variable cv;
    std::mutex cv_m;
    bool ready = false;


    ```

    **Источник:** [cppreference: std::condition_variable](https://en.cppreference.com/w/cpp/thread/condition_variable?utm_source=gemini)

    91. Как работает `std::condition_variable`?

    **Ответ:** Метод `wait(unique_lock)` выполняет атомарную последовательность: 1) Освобождает переданный мьютекс; 2) Переводит текущий поток в очередь сна ядра ОС (системный вызов futex); 3) При получении `notify` ядро будит поток, и тот повторно захватывает мьютекс перед возвратом управления.

    **Пример:**

    ```
    std::unique_lock<std::mutex> lk(cv_m);
    // Проверяет предикат, при false отпускает lk и засыпает:
    cv.wait(lk, []{ return ready; });


    ```

    **Источник:** [Anthony Williams: C++ Concurrency in Action (Waiting for a condition)](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition?utm_source=gemini)

92. spurious wakeup — что это?

    **Ответ:** Spurious wakeup (ложное пробуждение) — аппаратное или платформенное поведение, при котором поток просыпается из состояния ожидания на `condition_variable`, несмотря на то, что ни один другой поток не вызывал `notify()`. Поэтому ожидание всегда оборачивают в цикл с проверкой предиката.

    **Пример:**

    ```
    // Всегда ждем в цикле:
    while (!ready) {
        cv.wait(lk);
    }


    ```

    **Источник:** [POSIX standard: pthread_cond_wait (Spurious Wakeups)](https://pubs.opengroup.org/onlinepubs/9699919799/functions/pthread_cond_wait.html?utm_source=gemini)

93. Что такое barrier?

    **Ответ:** Barrier (барьер, `std::barrier` в C++20) — примитив синхронизации для группы из $N$ потоков, требующий, чтобы все участники дошли до определенной точки вычислений (`arrive_and_wait()`), прежде чем хотя бы один из них сможет продолжить выполнение следующей фазы алгоритма.

    **Пример:**

    ```
    #include <barrier>
    std::barrier sync_point(4); // Ждет 4 потока

    void worker() {
        step1();
        sync_point.arrive_and_wait(); // Все 4 потока сойдутся здесь
        step2();
    }


    ```

    **Источник:** [cppreference: std::barrier](https://en.cppreference.com/w/cpp/thread/barrier?utm_source=gemini)

94. Что такое reader-writer lock?

    **Ответ:** Reader-Writer Lock (`std::shared_mutex` в C++17) — примитив, разрешающий параллельный одновременный доступ неограниченному количеству читающих потоков (`shared_lock`), но предоставляющий строго монопольный доступ только одному пишущему потоку (`unique_lock`), оптимизируя сценарии Read-Heavy.

    **Пример:**

    ```
    #include <shared_mutex>
    std::shared_mutex rw_mtx;

    // Множество читателей:
    void read_data() { std::shared_lock lock(rw_mtx); }

    // Один писатель:
    void write_data() { std::unique_lock lock(rw_mtx); }


    ```

    **Источник:** [cppreference: std::shared_mutex](https://en.cppreference.com/w/cpp/thread/shared_mutex?utm_source=gemini)

95. Что такое false sharing?

    **Ответ:** False sharing (ложное разделение данных) — аппаратная проблема многопоточности, при которой два потока на разных ядрах CPU параллельно модифицируют независимые переменные, оказавшиеся случайно расположенными в границах **одной и той же 64-байтной кэш-линии**, вызывая непрерывную инвалидацию кэша ядрами.

    **Пример:**

    ```
    // Опасная структура (в одной кэш-линии):
    struct BadCounters {
        std::atomic<int> a; // Ядро 1
        std::atomic<int> b; // Ядро 2 (постоянно выбивают кэш друг у друга)
    };


    ```

    **Источник:** [Herb Sutter: Eliminate False Sharing (Dr. Dobb's)](https://www.drdobbs.com/parallel/eliminate-false-sharing/217500206?utm_source=gemini)

96. Что такое cache coherence?

    **Ответ:** Cache coherence (когерентность кэшей) — аппаратный протокол процессора (MESI, MOESI), поддерживающий целостность и актуальность данных между индивидуальными L1/L2 кэшами всех ядер CPU, гарантируя, что любая запись в ячейку памяти одним ядром делает устаревшими копии этой строки в кэшах всех остальных ядер.

    **Пример:**

    ```
    Ядро 1 пишет в адрес 0x1000 -> Протокол MESI шлет сигнал Invalidate по шине ->
    Кэш-линия в Ядре 2 помечается как 'Invalid' (I).


    ```

    **Источник:** [Sorin et al.: A Primer on Memory Consistency and Cache Coherence](https://www.morganclaypool.com/doi/abs/10.2200/S00346ED1V01Y201104CAC016?utm_source=gemini)

97. Что такое happens-before?

    **Ответ:** Отношение `happens-before` — математическое отношение частичного порядка между двумя операциями в C++. Если $A$ happens-before $B$, то операция $A$ логически завершена до начала $B$, и все побочные эффекты в памяти, сделанные $A$, гарантированно видимы операции $B$.

    **Пример:**

    ```
    // Завершение t.join() happens-before следующей инструкции вызывающего потока:
    std::thread t([]{ res = 1; });
    t.join();
    assert(res == 1); // Всегда истинно


    ```

    **Источник:** [ISO C++ Standard: Happens-before order (§ 6.9.2.1 \[intro.multithread\])](https://eel.is/c++draft/intro.multithread?utm_source=gemini)

98. volatile в C++ — зачем?

    **Ответ:** Ключевое слово `volatile` в C++ запрещает компилятору применять оптимизации к переменной (выносить чтения в регистры, удалять "лишние" записи). Оно предназначено **исключительно** для взаимодействия со специализированным аппаратным обеспечением (Memory-Mapped I/O, MMIO) и обработчиками сигналов `sig_atomic_t`.

    **Пример:**

    ```
    // Чтение регистра контроллера аппаратуры (MMIO):
    volatile uint32_t* status_reg = (uint32_t*)0x40001000;
    while (*status_reg & 0x1); // Компилятор не оптимизирует в бесконечный цикл


    ```

    **Источник:** [cppreference: cv (const/volatile) type qualifiers](https://en.cppreference.com/w/cpp/language/cv?utm_source=gemini)

99. Почему volatile не заменяет mutex?

    **Ответ:** В отличие от Java/C#, в C++ `volatile` **не гарантирует атомарности** операций и **не генерирует барьеров памяти** (Memory Fences) для процессора. Процессор может произвольно переупорядочить операции чтения/записи `volatile`, а одновременный доступ к `volatile` из двух потоков является классическим Data Race с неопределенным поведением.

    **Пример:**

    ```
    volatile int x = 0;
    // Потоки A и B делают:
    x++; // НЕАТОМАРНО! Приведет к Data Race (UB)


    ```

    **Источник:** [Hans Boehm: volatile vs atomic in C++](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2006/n2016.html?utm_source=gemini)

100. Что такое ABA problem?

     **Ответ:** ABA-проблема — ошибка в lock-free структурах данных при использовании CAS (Compare-And-Swap): поток прочитал значение `A`, был приостановлен; другие потоки сменили значение на `B`, освободили память и вернули `A` обратно. Первый поток просыпается, выполняет CAS, видит всё то же значение `A` и ошибочно считает, что состояние не менялось, повреждая данные.

     **Пример:**

     ```
     Поток 1 прочитал Top = A.
     Поток 2 удалил A (память освобождена!), удалил B, вставил новый узел с тем же адресом A.
     Поток 1 делает CAS(Top, A, B) -> Успешно, но указатель B уже указывает на мусор!


     ```

     **Источник:** [Damian Dechev et al.: Practical Lock-Free Algorithms (ABA Prevention)](https://dl.acm.org/doi/10.1145/1810931.1810943?utm_source=gemini)

     ---

### IPC (Interprocess Communication)
101. Что такое IPC?
102. pipe — как работает?
103. unnamed vs named pipe?
104. FIFO в Linux?
105. Что такое shared memory?
106. Преимущества shared memory?
107. Недостатки shared memory?
108. Что такое mmap()?
109. Как использовать shm_open?
110. Что такое message queue?
111. POSIX message queues vs System V?
112. Что такое socket?
113. UNIX domain socket vs TCP?
114. Что такое loopback?
115. Что такое serialization?
116. Что такое RPC?
117. Что такое file descriptor?
118. Как передаются данные через pipe?
119. blocking vs non-blocking IPC?
120. select/poll/epoll — что это?
121. Что такое epoll edge-triggered?
122. Что такое backpressure?
123. Как синхронизировать shared memory?
124. Что быстрее: pipe или shared memory?
125. Когда использовать sockets локально?

     ---

### Virtual Memory
126. Что такое virtual memory?
127. Почему нужна виртуальная память?
128. Что такое paging?
129. Что такое page?
130. Что такое page table?
131. Что такое TLB?
132. Что такое page fault?
133. minor vs major page fault?
134. Что такое segmentation?
135. Paging vs segmentation?
136. Что такое swap?
137. Что такое demand paging?
138. Что такое copy-on-write?
139. Что такое memory mapping?
140. mmap vs malloc?
141. Что такое heap vs stack?
142. Как растёт стек?
143. Что такое stack overflow?
144. Что такое fragmentation?
145. internal vs external fragmentation?
146. Что такое huge pages?
147. Что такое NUMA memory?
148. Что такое protection bits?
149. Что такое address translation?
150. Что такое kernel memory allocator?

     ---

### System Calls
151. Что такое system call?
152. Как выполняется syscall?
153. user → kernel переход?
154. syscall vs function call?
155. Что такое syscall table?
156. Примеры syscalls?
157. read(), write() — как работают?
158. open(), close()?
159. Что возвращает errno?
160. Что такое blocking syscall?
161. non-blocking syscall?
162. Что такое async I/O?
163. select vs epoll?
164. Что такое file descriptor?
165. STDIN/STDOUT/STDERR?
166. dup(), dup2()?
167. fork() как syscall?
168. execve()?
169. waitpid()?
170. kill()?
171. Что такое signal handler?
172. reentrant функции — что это?
173. Что такое syscall overhead?
174. Как уменьшить количество syscalls?
175. Что такое zero-copy?
176. sendfile()?
177. splice()?
178. mmap как альтернатива read?
179. Как дебажить syscalls (strace)?
180. Что такое ABI?
