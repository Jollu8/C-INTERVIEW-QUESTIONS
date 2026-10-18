# C/C++ Runtime & System Level Question Bank (Linux)

260 вопросов с ответами по процессам, потокам, descriptors, signals, event loops и plugins. База — Linux/POSIX; epoll, signalfd и `/proc` относятся к Linux. C++ примеры используют C++17. Фрагменты с условными переменными иллюстрируют protocol и не являются самостоятельными программами.

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging / investigation

* **[S]** — system design / production engineering

---

# 5. Runtime & System Level

---

## 5.1 Процессы и потоки

### Процессы: fork / exec

## L1

1. (L1, T) Что такое процесс в Linux?

   **Ответ:** Процесс — экземпляр исполнения с адресным пространством и системными ресурсами; Linux планирует его потоки как tasks.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

2. (L1, T) Что такое PID?

   **Ответ:** Идентификатор процесса в PID namespace; одно исполнение может иметь разные видимые PID в разных namespaces.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

3. (L1, T) Чем процесс отличается от потока?

   **Ответ:** Потоки разделяют адресное пространство и ресурсы процесса; процессы обычно изолированы и общаются через IPC.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

4. (L1, T) Что делает `fork()`?

   **Ответ:** Создаёт дочерний процесс, продолжающий исполнение после вызова; в multithreaded child остаётся только вызывающий поток.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

5. (L1, T) Что делает `exec()`?

   **Ответ:** Семейство exec заменяет образ текущего процесса новой программой; успешный вызов не возвращается и сохраняет PID.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

6. (L1, T) В чем разница между `fork()` и `exec()`?

   **Ответ:** Fork создаёт процесс, exec заменяет программу существующего; это независимые операции.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

7. (L1, T) Что получает дочерний процесс после `fork()`?

   **Ответ:** Логическую копию памяти и унаследованные ресурсы с исключениями; fd ссылаются на те же open file descriptions.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

8. (L1, T) Что происходит с адресным пространством при `fork()`?

   **Ответ:** Адресные пространства становятся раздельными; Linux обычно откладывает копирование физических страниц через copy-on-write.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

9. (L1, T) Что такое copy-on-write?

   **Ответ:** Общее read-only размещение страниц до записи; запись вызывает создание частной копии там, где это требуется.

   **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

10. (L1, P) Какой return value у `fork()` в родителе и в дочернем процессе?

    **Ответ:** В child возвращает 0, в parent — PID child; при ошибке возвращает -1 и child не создаётся.

    **Пример:** Схема развилки после fork:

    ```c
    pid_t child = fork();
    if (child == -1) {
        /* Ошибка: обработать errno, child не создан. */
    } else if (child == 0) {
        /* Child: минимальная подготовка, exec; при неудаче _exit(...). */
    } else {
        /* Parent: сохранить child PID и позже собрать wait status. */
    }
    ```

    **Типичная ошибка:** Считать отрицательный return value веткой parent с созданным child.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)


## L2

11. (L2, T) Почему часто используют связку `fork() + exec()`?

    **Ответ:** Parent остаётся работать, а child подготавливает окружение/fd и заменяется внешней программой.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

12. (L2, T) Что происходит с открытыми file descriptors при `fork()`?

    **Ответ:** Child наследует descriptors, ссылающиеся на те же open file descriptions: offsets и некоторые flags разделяются.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

13. (L2, T) Что происходит с file descriptors при `exec()`?

    **Ответ:** Обычно сохраняются, кроме помеченных `FD_CLOEXEC`; это может случайно передать sockets и pipe ends новой программе.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

14. (L2, T) Что делает флаг `FD_CLOEXEC`?

    **Ответ:** Предписывает закрыть descriptor при успешном exec; сам fork его не закрывает.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

15. (L2, P) Как дождаться завершения дочернего процесса?

    **Ответ:** `waitpid(child_pid, &status, 0)`; обработать EINTR и проверить возвращённый PID.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

16. (L2, P) Как узнать exit code дочернего процесса?

    **Ответ:** Сначала `WIFEXITED(status)`, затем `WEXITSTATUS(status)`; signal termination проверяют через `WIFSIGNALED`/`WTERMSIG`.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

17. (L2, D) Почему после `fork()` код “выполняется дважды”?

    **Ответ:** Parent и child продолжают после fork; ветвить поведение по return value. Унаследованные stdio buffers тоже могут дублировать вывод.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

18. (L2, D) Почему после `exec()` часть ожидаемой логики не выполняется?

    **Ответ:** Успешный exec не возвращается; код после вызова исполняется только при ошибке и должен обработать errno.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

19. (L2, T) Что происходит с памятью процесса после успешного `exec()`?

    **Ответ:** Старые mappings заменяются новым образом: code, data, stack и runtime initialization новой программы.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

20. (L2, T) Чем `execl`, `execv`, `execvp`, `execve` отличаются друг от друга?

    **Ответ:** `l` принимает список аргументов, `v` — массив; `p` ищет PATH, `e` принимает environment. `execve` — базовый Linux syscall.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)


## L3

21. (L3, T) Почему `fork()` в многопоточном процессе опасен?

    **Ответ:** Child копирует состояние locks, но не потоки-владельцы; обращение к runtime/allocator может зависнуть.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

22. (L3, T) Какие ограничения есть после `fork()` до `exec()` в multithreaded программе?

    **Ответ:** До exec в child допустимы только async-signal-safe операции; сложную C++ логику следует вынести до fork или в новую программу.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

23. (L3, T) Что такое async-signal-safe functions и почему это важно после `fork()`?

    **Ответ:** Это функции, допустимые при прерывании обычного исполнения обработчиком; после multithreaded fork они избегают повреждённых lock states.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

24. (L3, D) Почему процесс завис после `fork()` в приложении с mutex'ами?

    **Ответ:** Mutex мог остаться locked потоком, отсутствующим в child; проверить child stack и заменить схему на подходящий spawn/exec.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

25. (L3, T) Что такое zombie process?

    **Ответ:** Завершившийся child, чей exit status ещё не собран родителем; остаётся запись процесса, а не исполняющийся код.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

26. (L3, T) Что такое orphan process?

    **Ответ:** Процесс с завершившимся parent; Linux передаёт его ближайшему child subreaper или namespace init.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

27. (L3, D) Как найти и объяснить появление zombie processes?

    **Ответ:** Посмотреть `ps -eo pid,ppid,stat,cmd`, найти Z и parent; исправлять отсутствие wait/reaping у владельца.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

28. (L3, P) Как перенаправить stdin/stdout/stderr дочернего процесса перед `exec()`?

    **Ответ:** Создать нужные fd, выполнить `dup2(fd, STDOUT_FILENO)` и аналогично для stdin/stderr; закрыть лишние ends перед exec.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

29. (L3, P) Как реализовать запуск внешней команды с пайпом?

    **Ответ:** Создать pipe, fork, перенаправить child stdout в write end, закрыть лишние ends; parent читает и затем вызывает waitpid.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

30. (L3, D) Почему child process наследует “лишние” дескрипторы?

    **Ответ:** Не задан CLOEXEC либо child не закрыл ненужные fd; использовать atomic flags `O_CLOEXEC`/`SOCK_CLOEXEC` при создании.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)


## L4

31. (L4, S) Когда процессы лучше потоков для изоляции и надежности?

    **Ответ:** Когда нужны fault/resource/security boundaries; учитывать IPC, копирование данных и стоимость управления процессами.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

32. (L4, S) Как проектировать process supervision в Linux-сервисе?

    **Ответ:** Владелец запускает и reaps workers, ограничивает restart rate, передаёт shutdown и фиксирует exit reason.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

33. (L4, D) Как расследовать редкие deadlock'и, связанные с `fork()` в большом C++ приложении?

    **Ответ:** Снять stacks parent/child, найти последний вызов до exec и lock owner; проверить atfork handlers и небезопасный child code.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

34. (L4, S) Как проектировать безопасный launcher/worker runtime на базе `fork/exec`?

    **Ответ:** Явный список наследуемых fd, минимальный child path, контролируемые argv/env, deadlines и supervision; рассмотреть posix_spawn.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)

35. (L4, D) Как строить forensic-анализ проблем с process lifecycle в production?

    **Ответ:** Коррелировать PID/start time, exec/build ID, fd inheritance, signals и wait status; PID без времени старта может переиспользоваться.

    **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html); [waitpid(2)](https://man7.org/linux/man-pages/man2/waitpid.2.html)


### Потоки: pthreads

## L1

36. (L1, T) Что такое поток исполнения?

    **Ответ:** Независимый поток исполнения с собственными registers/stack, разделяющий ресурсы процесса с соседними потоками.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

37. (L1, T) Что общее у потоков одного процесса?

    **Ответ:** Адресное пространство, globals, heap, descriptors и signal dispositions; доступ к общей памяти требует синхронизации.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

38. (L1, T) Что у потоков раздельное?

    **Ответ:** Stack, registers, scheduling state, signal mask и thread-local storage; errno обычно thread-local.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

39. (L1, T) Что такое `pthread`?

    **Ответ:** POSIX API потоков и синхронизации; pthread return codes часто возвращаются напрямую, а не через errno.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

40. (L1, P) Как создать поток через pthread API?

    **Ответ:** `pthread_create(&thread, NULL, start, arg)` с функцией `void *start(void *)`; проверить return code и lifetime arg.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

41. (L1, P) Как дождаться завершения потока?

    **Ответ:** `pthread_join(thread, &result)` для joinable thread; не удерживать lock, который нужен завершающемуся потоку.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

42. (L1, T) Что такое joinable и detached thread?

    **Ответ:** Joinable требует join для сбора ресурсов; detached освобождает их автоматически после завершения и не допускает join.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

43. (L1, T) Что такое mutex?

    **Ответ:** Примитив взаимного исключения для согласованного доступа к состоянию; один lock должен защищать весь нужный invariant.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

44. (L1, T) Зачем нужны condition variables?

    **Ответ:** Позволяют спать до изменения predicate, освобождая mutex на время ожидания; уведомление само по себе не хранит событие.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

45. (L1, D) Почему многопоточный код сложнее однопоточного?

    **Ответ:** Возможны разные interleavings, lifetime races и memory visibility; успешный одиночный тест не охватывает все исполнения.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L2

46. (L2, T) Что такое race condition?

    **Ответ:** Результат зависит от неуправляемого порядка конкурентных действий; race может существовать и при отсутствии data race.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

47. (L2, T) Чем race condition отличается от data race?

    **Ответ:** Data race — конфликтующие несинхронизированные обращения к памяти, хотя бы одно write; в C++ это UB. Race condition шире.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

48. (L2, T) Что такое critical section?

    **Ответ:** Участок изменения/чтения общего invariant, требующий согласованного доступа участников.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

49. (L2, P) Как защитить shared data с помощью mutex?

    **Ответ:** Каждое обращение к защищённому invariant выполнять под тем же mutex; в C++ предпочитать scoped lock/RAII.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

50. (L2, P) Как использовать condition variable для ожидания события?

    **Ответ:** Под mutex проверять predicate в цикле, вызывать wait, затем повторно проверять; producer изменяет состояние под тем же протоколом.

    **Пример:** Фрагмент с заранее инициализированными mutex/cv; общий predicate всегда читается и меняется под mutex.

    ```c
    /* Consumer */
    pthread_mutex_lock(&mutex);
    while (!ready && !stopping)
        pthread_cond_wait(&cv, &mutex);
    /* Под lock забрать результат либо обработать stopping. */
    pthread_mutex_unlock(&mutex);

    /* Producer */
    pthread_mutex_lock(&mutex);
    ready = 1;
    pthread_cond_signal(&cv);
    pthread_mutex_unlock(&mutex);
    ```

    В production проверяют pthread return codes и отдельный shutdown path; boolean predicate не подходит для подсчёта нескольких сообщений.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

51. (L2, D) Почему “редко падающий” баг часто связан с потоками?

    **Ответ:** Вероятность дефекта зависит от interleaving; также исключают обычную memory corruption, не объявляя любой редкий crash race.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

52. (L2, D) Как возникает deadlock?

    **Ответ:** Участники циклически ждут ресурсы друг друга либо поток ждёт сам себя; помогают общий lock order и отсутствие wait под lock.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

53. (L2, D) Как возникает livelock?

    **Ответ:** Потоки активны и реагируют друг на друга, но постоянно отменяют попытки, не продвигая полезную работу.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

54. (L2, T) Что такое starvation?

    **Ответ:** Поток длительно не получает нужный ресурс/CPU, хотя другие участники продолжают работу.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

55. (L2, T) Что такое thread-safe code?

    **Ответ:** Код сохраняет свой контракт при разрешённых конкурентных вызовах; нужно указать, для каких объектов и операций.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L3

56. (L3, T) Что такое memory ordering на практическом уровне?

    **Ответ:** Правила, определяющие наблюдаемость операций между потоками; mutex и release/acquire могут устанавливать happens-before.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

57. (L3, T) Почему “кажется, что работает” не доказывает корректность многопоточного кода?

    **Ответ:** UB и редкие interleavings могут не проявиться в текущем запуске; correctness требует аргумента о synchronization/lifetime.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

58. (L3, D) Как расследовать race condition, которая плохо воспроизводится?

    **Ответ:** Использовать TSan, stress со seed, targeted delays и записи transitions; минимизировать сценарий, сохраняя конфликтующие обращения.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

59. (L3, D) Как найти deadlock в pthread-based приложении?

    **Ответ:** Снять `thread apply all bt` в GDB, найти ожидания и owners; построить граф зависимостей locks/threads.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

60. (L3, P) Как использовать thread sanitizer для pthread-кода?

    **Ответ:** Собрать и линковать с `-fsanitize=thread -g`, выполнить representative tests; ASan и TSan обычно запускают раздельно.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

61. (L3, T) Почему неправильное владение mutex приводит к скрытым багам?

    **Ответ:** Unlock чужим потоком или несогласованный lifetime нарушает контракт mutex; normal mutex не предоставляет переносимой передачи ownership.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

62. (L3, D) Как отличить contention от настоящего deadlock?

    **Ответ:** При contention progress сохраняется после освобождения; при deadlock есть постоянная зависимость без допустимого продвижения.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

63. (L3, T) Что такое spurious wakeup и как правильно писать цикл ожидания?

    **Ответ:** Wait может вернуться без истинного условия; писать `while (!ready) pthread_cond_wait(&cv, &mutex)` с predicate под mutex.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

64. (L3, D) Почему condition variable без predicate — опасна?

    **Ответ:** Уведомление может произойти до wait, а wakeup быть spurious; только состояние predicate определяет возможность продолжать.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

65. (L3, S) Когда использовать pthread API напрямую, а когда std::thread/std::mutex?

    **Ответ:** Стандартные C++ wrappers удобнее для переносимости/RAII; pthread нужен для специфических POSIX attributes и интеграции.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L4

66. (L4, S) Как проектировать многопоточную архитектуру, уменьшающую число shared-state ошибок?

    **Ответ:** Ограничивать shared mutable state, назначать owners, использовать queues и immutable snapshots, документировать shutdown/lifetime.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

67. (L4, S) Как выбирать между thread-per-request, thread pool, actor/event-loop моделью?

    **Ответ:** Выбирать по concurrency, blocking cost и latency budget; event loop требует неблокирующих handlers, pool — ограниченной очереди.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

68. (L4, D) Как расследовать latency spikes, вызванные lock contention?

    **Ответ:** Измерить lock wait/hold time, queue depth и stacks; долгий holder или oversubscription могут давать хвосты.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

69. (L4, S) Как формализовать policy по mutex ordering и concurrency review?

    **Ответ:** Задать порядок locks, protected invariants и запрет blocking callbacks под lock; проверять исключения review и тестами.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

70. (L4, D) Как строить post-mortem анализ сложных concurrency incidents?

    **Ответ:** Сохранить traces, stacks, workload и timeline; восстановить нарушенный invariant и проверить исправление тем же interleaving.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


### Race Conditions

## L1

71. (L1, T) Что такое race condition простыми словами?

    **Ответ:** Два участника действуют так, что результат зависит от случайного порядка, хотя программа ожидает определённый протокол.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

72. (L1, T) Почему race condition может не проявляться на тестовой машине?

    **Ответ:** Иные cores, timings, compiler optimization и нагрузка меняют вероятность опасного порядка исполнения.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

73. (L1, T) Как shared mutable state создает риск race condition?

    **Ответ:** Несогласованные read-modify-write и lifetime transitions позволяют видеть противоречивое состояние.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

74. (L1, D) Какие типичные признаки race condition?

    **Ответ:** Редкие неверные значения, потерянные updates, hangs и use-after-free; каждый симптом требует подтверждения.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

75. (L1, D) Почему добавление логов может “чинить” race temporarily?

    **Ответ:** Логи меняют timing, lock contention и memory layout, случайно скрывая опасное исполнение.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L2

76. (L2, D) Как воспроизводить race condition?

    **Ответ:** Создать concurrency stress с управляемыми точками ожидания и seed; использовать TSan и проверку invariants.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

77. (L2, D) Почему scheduler влияет на вероятность воспроизведения race?

    **Ответ:** Определяет моменты preemption и совместное исполнение; нельзя полагаться на наблюдаемый порядок одного scheduler run.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

78. (L2, D) Какие классы race condition бывают в C/C++?

    **Ответ:** Data races, check-then-act/TOCTOU, lifetime races и protocol races; atomic variables устраняют не все логические races.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

79. (L2, P) Какие минимальные шаги для локализации race bug?

    **Ответ:** Зафиксировать invariant, конфликтующие действия и минимальный workload; собрать stack traces и synchronization evidence.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

80. (L2, D) Почему use-after-free часто имеет concurrency-корень?

    **Ответ:** Один поток освобождает объект, пока другой ещё использует pointer; нужен явный протокол продления lifetime.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L3

81. (L3, D) Как доказывать наличие race condition, а не просто подозревать ее?

    **Ответ:** Показать конфликтующие операции без happens-before либо воспроизводимое нарушение протокола; TSan report — полезное свидетельство.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

82. (L3, D) Как отличить race от memory corruption иной природы?

    **Ответ:** Сопоставить TSan и ASan в отдельных сборках, проверить lifetime и межпоточный доступ; инструменты могут находить разные причины.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

83. (L3, D) Как race condition проявляется через невалидные инварианты?

    **Ответ:** Например, объект помечен готовым до завершения initialization; формулировка invariant помогает найти отсутствующую связь порядка.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

84. (L3, D) Почему lock-free/low-lock код повышает требования к инженерной дисциплине?

    **Ответ:** Нужно отдельно доказывать ordering, reclamation, ABA и progress guarantees; отсутствие mutex не означает простоту или скорость.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

85. (L3, S) Какие design-подходы лучше всего снижают риск race condition?

    **Ответ:** Single ownership, message passing, immutable data и ограниченные критические секции уменьшают число допустимых состояний.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L4

86. (L4, S) Как внедрить systematic concurrency testing в команду?

    **Ответ:** TSan jobs, deterministic hooks, stress/replay, обязательные lifecycle tests и review synchronization contracts.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

87. (L4, D) Как расследовать race в distributed/IPC-heavy системе?

    **Ответ:** Коррелировать local thread traces и IPC IDs; различать in-process data race и нарушение distributed ordering/protocol.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

88. (L4, S) Как выбирать допустимый уровень concurrency complexity в продукте?

    **Ответ:** Выбирать простейшую модель, достигающую SLO; более сложные atomics требуют доказанного bottleneck и компетенции сопровождения.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

89. (L4, S) Как учить команду мыслить через invariants, а не только через mutex'ы?

    **Ответ:** Для каждого состояния определить допустимые transitions, owner и условие публикации; mutex — средство реализации этих правил.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

90. (L4, D) Как документировать и triage'ить concurrency bugs на больших кодовых базах?

    **Ответ:** Записывать symptom, invariant, workload, race evidence, suspected owners и reproduction seed; severity отделять от воспроизводимости.

    **Источник:** [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


    ---

## 5.2 Работа с системой

### File Descriptors

## L1

91. (L1, T) Что такое file descriptor?

    **Ответ:** Небольшое целое число, индексирующее запись таблицы descriptors процесса и ссылающееся на kernel resource.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

92. (L1, T) Какие стандартные file descriptors есть у процесса?

    **Ответ:** 0 — stdin, 1 — stdout, 2 — stderr; они могут быть закрыты или перенаправлены.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

93. (L1, T) Что возвращает `open()`?

    **Ответ:** Неотрицательный fd при успехе, -1 при ошибке с errno; значение 0 является корректным descriptor.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

94. (L1, T) Чем file descriptor отличается от `FILE*`?

    **Ответ:** `FILE*` — библиотечный stdio object с buffering и состоянием; fd — системный handle. Их lifecycle нужно согласовать.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

95. (L1, P) Как открыть файл через системный вызов?

    **Ответ:** `open(path, O_RDONLY | O_CLOEXEC)`; при -1 обработать errno. Для `O_CREAT` передать mode с учётом umask.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

96. (L1, P) Как читать и писать через file descriptor?

    **Ответ:** Использовать `read`/`write`, проверять ssize_t, partial progress, EOF и errno; не считать один вызов полной передачей.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

97. (L1, T) Что делает `close()`?

    **Ответ:** Освобождает descriptor; ресурс закрывается после исчезновения остальных ссылок. Не следует слепо повторять close при ошибке на Linux.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

98. (L1, D) Что происходит, если забыть закрыть fd?

    **Ответ:** Descriptor и ресурс сохраняются до закрытия или завершения процесса; может закончиться лимит fd.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

99. (L1, T) Что такое EOF на уровне `read()`?

    **Ответ:** Для положительного requested count возврат 0 означает EOF; у socket это обычно orderly shutdown peer write side.

    **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

100. (L1, D) Почему утечки file descriptors опасны для long-running процессов?

     **Ответ:** Расходуются descriptors и связанные kernel resources; новые accept/open начинают возвращать ошибки.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)


## L2

101. (L2, T) Что такое blocking vs non-blocking I/O?

     **Ответ:** Blocking может ждать готовности; nonblocking возвращает EAGAIN/EWOULDBLOCK, если операция сейчас потребовала бы ожидания.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

102. (L2, T) Что делает `fcntl(..., O_NONBLOCK)`?

     **Ответ:** Правильно: получить flags через `F_GETFL`, затем `F_SETFL` с `flags | O_NONBLOCK`; это file status flag.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

103. (L2, D) Почему `read()`/`write()` могут вернуть меньше байт, чем ожидалось?

     **Ответ:** Доступно меньше данных/места, вмешался сигнал или семантика устройства допускает short I/O; сохранять progress.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

104. (L2, T) Что такое `EINTR`?

     **Ответ:** Ошибка прерывания операции signal handler; решение о повторе зависит от syscall и уже выполненной работы.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

105. (L2, D) Почему системный вызов может быть прерван сигналом?

     **Ответ:** Сигнал может прервать ожидание; SA_RESTART перезапускает только определённые операции, не любой syscall.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

106. (L2, P) Как дублировать fd через `dup`/`dup2`?

     **Ответ:** `dup(fd)` создаёт новую ссылку; `dup2(fd, target)` атомарно заменяет target при успехе. Проверять ошибки.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

107. (L2, P) Как перенаправить stdout процесса в файл?

     **Ответ:** Открыть файл, выполнить `dup2(fd, STDOUT_FILENO)`, закрыть исходный fd, если он отличается от stdout.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

108. (L2, T) Что такое pipe?

     **Ответ:** Однонаправленный byte stream с read/write ends; EOF возникает, когда закрыты все write ends и данные прочитаны.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

109. (L2, P) Как устроен IPC через pipe на базовом уровне?

     **Ответ:** Parent/child закрывают неиспользуемые ends, передают framed bytes через read/write и обрабатывают EOF/partial I/O.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

110. (L2, D) Как возникают “Too many open files”?

     **Ответ:** EMFILE означает лимит процесса; ENFILE — системный лимит открытых файлов. Сначала искать leak и нагрузку.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)


## L3

111. (L3, T) Что такое open file description и чем он отличается от fd?

     **Ответ:** Open file description — kernel object состояния открытия; несколько fd могут ссылаться на один объект.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

112. (L3, T) Какие состояния разделяют duplicated descriptors?

     **Ответ:** Offset и file status flags вроде O_NONBLOCK; descriptor flags вроде FD_CLOEXEC задаются для каждого fd отдельно.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

113. (L3, D) Почему offset файла “неожиданно общий” между двумя fd?

     **Ответ:** Fd получены через dup/fork и ссылаются на одну open file description; для независимого offset нужно отдельное open или pread.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

114. (L3, D) Как расследовать fd leak в production?

     **Ответ:** Снимать количество и цели `/proc/PID/fd` во времени, сопоставлять open/close paths и request lifecycle.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

115. (L3, P) Как смотреть открытые fd процесса через `/proc`?

     **Ответ:** `ls -l /proc/PID/fd`; детали доступны в `/proc/PID/fdinfo`, с учётом permissions и namespace.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

116. (L3, D) Почему небезопасное наследование fd ломает дочерние процессы?

     **Ответ:** Child удерживает sockets/pipe ends, препятствует EOF и получает неожиданный доступ; CLOEXEC предотвращает передачу через exec.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

117. (L3, T) Что такое socket как file descriptor?

     **Ответ:** Descriptor указывает на socket endpoint; доступен обычным read/write и socket-specific API/options.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

118. (L3, D) Почему non-blocking I/O требует иного стиля обработки ошибок?

     **Ответ:** EAGAIN является штатным состоянием, partial I/O требует буферов и state machine, readiness — повторной проверки операции.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

119. (L3, P) Как анализировать readiness/event-driven код на fd?

     **Ответ:** Проследить регистрацию, событие, actual I/O result и изменение state; проверить EOF, errors, backpressure и generation handle.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

120. (L3, S) Когда выбирать blocking модель, а когда event-driven?

     **Ответ:** Blocking проще для ограниченной concurrency; event-driven подходит многим ожидающим connections при bounded работе handlers.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)


## L4

121. (L4, S) Как проектировать fd lifecycle policy в большом сервисе?

     **Ответ:** Один owner закрывает fd, borrow не переживает owner, transfer явный; регистрация events входит в lifecycle.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

122. (L4, D) Как расследовать деградацию сервиса из-за fd exhaustion?

     **Ответ:** Собрать count/limits/errors и типы fd, ограничить admission, локализовать leaking path; повышение лимита не устраняет утечку.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

123. (L4, S) Как формализовать ownership fd в C/C++ коде?

     **Ответ:** Move-only RAII owner и явные borrowed views; запрет неоговорённого close у потребителя borrowed fd.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

124. (L4, S) Как строить безопасные RAII-обертки над системными ресурсами?

     **Ответ:** Хранить invalid sentinel -1, запрещать copy, поддерживать move и однократное закрытие; destructor не бросает исключения.

     **Пример:** Минимальный Linux RAII owner; ownership передаётся явно.

     ```cpp
     #include <unistd.h>
     #include <utility>

     class unique_fd {
         int fd_ = -1;
     public:
         explicit unique_fd(int fd = -1) noexcept : fd_(fd) {}
         ~unique_fd() { if (fd_ != -1) ::close(fd_); }
         unique_fd(const unique_fd&) = delete;
         unique_fd& operator=(const unique_fd&) = delete;
         unique_fd(unique_fd&& other) noexcept
             : fd_(std::exchange(other.fd_, -1)) {}
         unique_fd& operator=(unique_fd&& other) noexcept {
             if (this != &other) {
                 if (fd_ != -1) ::close(fd_);
                 fd_ = std::exchange(other.fd_, -1);
             }
             return *this;
         }
         int get() const noexcept { return fd_; } // Borrowed descriptor.
         int release() noexcept { return std::exchange(fd_, -1); }
     };
     ```

     Destructor не сообщает errors закрытия. Если write durability/error важны, нужен явный checked finalization path; для файлов durability отдельно требует appropriate sync policy.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)

125. (L4, D) Как находить subtle bugs, связанные с переиспользованием fd ядром?

     **Ответ:** Использовать generation IDs и owner checks; старое событие с числом fd может относиться уже к новому ресурсу.

     **Источник:** [open(2)](https://man7.org/linux/man-pages/man2/open.2.html); [fcntl(2)](https://man7.org/linux/man-pages/man2/fcntl.2.html); [close(2)](https://man7.org/linux/man-pages/man2/close.2.html)


### Signals

## L1

126. (L1, T) Что такое signal в Linux?

     **Ответ:** Механизм уведомления процесса/потока о событии с disposition, mask и правилами доставки.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

127. (L1, T) Какие сигналы чаще всего встречаются в практике C/C++?

     **Ответ:** SIGINT, SIGTERM, SIGCHLD, SIGPIPE, SIGSEGV, SIGABRT; смысл и действие зависят от сигнала и disposition.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

128. (L1, T) Чем `SIGINT`, `SIGTERM`, `SIGKILL` отличаются?

     **Ответ:** SIGINT — обычно interrupt терминала; SIGTERM — запрос завершения; SIGKILL принудительно завершает без handler/cleanup.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

129. (L1, T) Какие сигналы обычно означают crash?

     **Ответ:** SIGSEGV, SIGBUS, SIGILL, SIGFPE и SIGABRT часто приводят к аварийному завершению; они не всегда доказывают первопричину.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

130. (L1, P) Как установить signal handler?

     **Ответ:** Настроить `struct sigaction`, mask и flags, вызвать `sigaction`; handler должен соблюдать async-signal-safety.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

131. (L1, D) Почему нельзя просто “делать всё что угодно” внутри signal handler?

     **Ответ:** Он может прервать code с удержанными internal locks; небезопасный повторный вызов runtime приводит к deadlock/corruption.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

132. (L1, T) Что значит asynchronous signal delivery?

     **Ответ:** Signal может быть обработан вне обычного control flow; thread-directed и синхронные fault signals имеют дополнительные правила.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

133. (L1, D) Почему `SIGKILL` нельзя перехватить?

     **Ответ:** Ядро не разрешает менять disposition SIGKILL и SIGSTOP; процесс не может заблокировать их mask.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

134. (L1, T) Что обычно делает `SIGCHLD`?

     **Ответ:** Уведомляет parent об изменении состояния child; требуется собрать statuses через wait, обычно в цикле.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

135. (L1, P) Как корректно завершать программу по `SIGTERM`?

     **Ответ:** Передать событие normal control flow, остановить admission, разбудить workers и завершить в ограниченный deadline.

     **Типичная ошибка:** Вызывать logger, delete объектов и join потоков непосредственно из asynchronous handler. Достаточно передать событие нормальному control flow.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)


## L2

136. (L2, T) Что такое async-signal-safe functions?

     **Ответ:** Функции из POSIX signal-safety contract, например write и _exit; это отдельное свойство от thread safety.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

137. (L2, D) Почему `printf`, `malloc`, mutex'ы и большинство C++ API опасны в signal handler?

     **Ответ:** Они используют locks и состояние, которое могло быть прервано handler; reentrancy не гарантируется.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

138. (L2, D) Как безопасно передавать факт получения сигнала в main loop?

     **Ответ:** Использовать self-pipe или централизованный sigwait/signalfd; простой `volatile sig_atomic_t` годится для ограниченного signal/main сценария.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

139. (L2, T) Что такое signal mask?

     **Ответ:** Набор временно blocked signals для потока; dispositions обычно общие для процесса.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

140. (L2, P) Как блокировать/разблокировать сигналы в потоке?

     **Ответ:** В multithreaded коде вызвать `pthread_sigmask`, проверив return code; задавать mask до создания workers.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

141. (L2, T) Как сигналы взаимодействуют с многопоточностью?

     **Ответ:** Mask индивидуальна, dispositions общие; process-directed signal доставляется одному из подходящих unblocked threads.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

142. (L2, D) Почему сигнал пришел “не в тот поток”?

     **Ответ:** Для process-directed signal ядро выбирает допустимый поток; централизовать приём через заранее настроенные masks.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

143. (L2, T) Что такое `sigaction` и почему он лучше старого `signal()`?

     **Ответ:** Даёт явные flags, handler mode и mask; семантика старого signal исторически различалась между системами.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

144. (L2, D) Как сигналы влияют на системные вызовы и I/O?

     **Ответ:** Могут прервать blocking calls или вызвать restart; обработка EINTR и deadlines нужна независимо от handler.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

145. (L2, P) Как построить graceful shutdown через signals?

     **Ответ:** Получить сигнал в control thread/loop, выставить stop state, остановить новые запросы, drain/timeout и join workers.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)


## L3

146. (L3, D) Как расследовать нестабильные баги, вызванные сигналами?

     **Ответ:** Собрать masks/dispositions, siginfo и stacks, проверить unsafe handler operations и неверные ожидания signal queueing.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

147. (L3, T) Что такое self-pipe trick и зачем он нужен?

     **Ответ:** Handler делает неблокирующий write в pipe, loop читает pipe и выполняет работу обычным кодом; обработать заполнение pipe.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

148. (L3, T) Как `signalfd` упрощает event-driven обработку сигналов?

     **Ответ:** Заблокированные signals читаются как records из fd; его можно включить в epoll без асинхронного handler для этих signals.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

149. (L3, D) Почему обработка сигналов и потоки вместе часто приводят к сложным ошибкам?

     **Ответ:** Mask, выбранный thread и прерванные locks образуют сложные interleavings; общий signal policy уменьшает пространство ошибок.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

150. (L3, D) Как отличить crash по `SIGSEGV` из-за кода от crash из-за внешнего воздействия?

     **Ответ:** Проверить siginfo si_code/si_addr и core stack: fault и отправленный kill/tgkill signal имеют разные признаки.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

151. (L3, S) Когда лучше обрабатывать signals централизованно в одном потоке?

     **Ответ:** Для control signals daemon: заранее блокировать их во всех workers и принимать в sigwait/control thread.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

152. (L3, D) Почему fork/exec + signals требуют особой аккуратности?

     **Ответ:** Mask наследуется; exec сбрасывает caught dispositions, но сохраняет ignored и mask, что может неожиданно блокировать signals новой программы.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

153. (L3, P) Как интегрировать signals в epoll/event-loop архитектуру?

     **Ответ:** Создать signalfd для заранее blocked набора, зарегистрировать EPOLLIN и читать records в обычном handler loop.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

154. (L3, D) Как диагностировать lost/repeated signal handling bugs?

     **Ответ:** Обычные signals могут объединяться; проверить masks, pending state и counting assumptions. Для счётных событий нужен другой механизм.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

155. (L3, S) Как проектировать signal-safe shutdown path?

     **Ответ:** Handler только сообщает событие; cleanup, locks и joins выполняются normal flow с идемпотентными transitions и deadline.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)


## L4

156. (L4, S) Как проектировать signal policy для production daemon/service?

     **Ответ:** Документировать control/fault signals, masks, shutdown/reload semantics и supervision escalation; проверять интеграционными тестами.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

157. (L4, D) Как расследовать аварийное завершение, где signals — только симптом?

     **Ответ:** Сопоставить fault address, crashing instruction, memory ownership и предшествующие ошибки; сигнал описывает механизм остановки.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

158. (L4, S) Как обучать команду безопасной работе с signal handlers?

     **Ответ:** Использовать минимальный approved handler pattern и review signal-safe calls; проверять сценарии прихода сигнала в любой момент.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

159. (L4, D) Как формализовать требования к shutdown/reload semantics через сигналы?

     **Ответ:** Определить admission/drain, timeout, повторный сигнал и атомарное применение reload; публиковать видимый статус результата.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)

160. (L4, S) Как сочетать signals, supervision и observability в Linux runtime?

     **Ответ:** Supervisor задаёт termination deadline и restart policy; сервис логирует lifecycle transitions и exit status вне unsafe handler.

     **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [signal-safety(7)](https://man7.org/linux/man-pages/man7/signal-safety.7.html); [signalfd(2)](https://man7.org/linux/man-pages/man2/signalfd.2.html)


### epoll / select

## L1

161. (L1, T) Что такое multiplexed I/O?

     **Ответ:** Ожидание готовности нескольких I/O sources одним потоком вместо отдельного blocking wait на каждый.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

162. (L1, T) Зачем нужен `select()`?

     **Ответ:** Позволяет ждать read/write/exception readiness набора fd с timeout.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

163. (L1, T) Какие ограничения у `select()`?

     **Ответ:** Fd ограничены FD_SETSIZE у обычного API, sets изменяются вызовом, сканирование растёт с диапазоном fd.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

164. (L1, T) Что делает `epoll`?

     **Ответ:** Поддерживает persistent interest list и возвращает ready events для зарегистрированных descriptors.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

165. (L1, T) Почему `epoll` часто предпочтительнее `select()` на Linux?

     **Ответ:** Удобнее для больших sparse sets соединений и не ограничен fd_set; стоимость всё равно зависит от событий и операций.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

166. (L1, T) Что значит readiness-based I/O?

     **Ответ:** Уведомление, что операция может продвинуться без blocking; фактический syscall всё равно может вернуть EAGAIN.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

167. (L1, P) Как на базовом уровне ждать готовности fd к чтению?

     **Ответ:** Для nonblocking fd использовать poll/epoll_wait, затем read/recv и проверить result; readiness не заменяет обработку ошибок.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

168. (L1, D) Почему blocking I/O плохо масштабируется на множество соединений?

     **Ответ:** Thread-per-connection расходует stacks и scheduler resources; для ограниченной concurrency blocking модель может быть достаточной.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

169. (L1, T) Чем polling отличается от event-driven подхода?

     **Ответ:** Busy polling активно проверяет состояние, event-driven ждёт уведомления; системный вызов poll сам может эффективно спать.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

170. (L1, D) Почему event loop сложнее, но масштабируемее?

     **Ответ:** Он обслуживает много ожидающих fd малым числом threads, но требует state machines, bounded handlers и lifecycle discipline.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)


## L2

171. (L2, T) Что такое level-triggered и edge-triggered режимы в epoll?

     **Ответ:** LT сообщает пока условие readiness сохраняется; ET — о переходах, поэтому fd должен быть nonblocking и обычно drain до EAGAIN.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

172. (L2, D) Почему edge-triggered режим часто вызывает ошибки у новичков?

     **Ответ:** Если не дочитать доступные данные и ждать нового edge, connection может зависнуть без нового уведомления.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

173. (L2, P) Как правильно читать из non-blocking socket в event loop?

     **Ответ:** Читать в цикле, учитывать bytes/EOF/EINTR, останавливаться на EAGAIN; fairness budget должен сохранять возможность продолжения.

     **Пример:** Ветка чтения nonblocking socket, без полного protocol parser:

     ```c
     for (;;) {
         ssize_t n = recv(fd, buf, sizeof(buf), 0);
         if (n > 0) {
             /* Добавить n bytes в bounded input/parser state. */
             continue;
         }
         if (n == 0) { /* Peer закрыл write side. */ break; }
         if (errno == EINTR) continue;
         if (errno == EAGAIN || errno == EWOULDBLOCK) break;
         /* Сохранить errno, обработать ошибку connection. */
         break;
     }
     ```

     В ET при раннем выходе ради fairness нужно запланировать продолжение, не полагаясь на новый edge. Обработка EOF/error меняет lifecycle connection, а не только выходит из цикла.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

174. (L2, D) Почему нельзя предполагать, что один event = все данные прочитаны?

     **Ответ:** Событие относится к readiness, не к границе сообщения; объём и framing определяет protocol/parser.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

175. (L2, D) Как `EAGAIN` связан с epoll/non-blocking I/O?

     **Ответ:** Показывает отсутствие дальнейшего немедленного progress; возвращают управление loop и ждут соответствующего readiness.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

176. (L2, P) Как добавить, изменить и удалить fd из epoll interest list?

     **Ответ:** Вызвать `epoll_ctl` с EPOLL_CTL_ADD/MOD/DEL; проверить return value и привязать стабильный owner/generation token.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

177. (L2, D) Почему event loop может “крутиться” и жечь CPU?

     **Ответ:** Постоянный EPOLLOUT, необработанный HUP/EOF, нулевые timeouts или повторные EAGAIN без ожидания.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

178. (L2, T) Что такое thundering herd problem?

     **Ответ:** Много waiters пробуждаются на одну доступную работу; уменьшают конкуренцию ownership/partitioning и поддерживаемыми wakeup flags.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

179. (L2, D) Как ошибки lifecycle fd ломают epoll-based код?

     **Ответ:** Закрытие/reuse и stale events могут обратиться к другому connection; удаление регистрации не аннулирует уже выданный event batch.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

180. (L2, S) Когда `select/poll/epoll` достаточно, а когда нужна более высокая абстракция?

     **Ответ:** Низкий API достаточен небольшой системе; библиотека полезна для переносимости, timers, cancellation и проверенных lifecycle contracts.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)


## L3

181. (L3, D) Как расследовать lost wakeup / missed event в epoll-системе?

     **Ответ:** Записать ADD/MOD/DEL, mask, I/O results и transitions; проверить ET drain, ONESHOT rearm и races публикации работы.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

182. (L3, D) Почему readiness не равна progress в I/O?

     **Ответ:** Другой consumer может забрать данные или условие изменится; readiness может вести к EOF/error, а не payload.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

183. (L3, T) Как epoll ведет себя при закрытии fd в другом потоке?

     **Ответ:** Ожидающий epoll_wait не обязан проснуться; registration связан с fd и open file description, а dup references усложняют удаление.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

184. (L3, D) Почему fd reuse может приводить к трудноуловимым epoll bug'ам?

     **Ответ:** Число fd быстро переиспользуется, а старый event/state ещё существует; нужны generation checks и согласованный owner.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

185. (L3, D) Как проектировать backpressure в event-driven сервере?

     **Ответ:** Ограничить очереди/bytes per connection, приостанавливать ingress, возобновлять по low watermark и задавать overload policy.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

186. (L3, T) Что такое reactor pattern и как он связан с epoll?

     **Ответ:** Reactor ждёт readiness и вызывает handlers, которые делают nonblocking I/O; epoll реализует механизм ожидания на Linux.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

187. (L3, D) Как отличить bottleneck event-loop'а от bottleneck бизнес-логики?

     **Ответ:** Измерять loop lag, handler duration, queue depth и worker utilization; profile привязать к запросному latency.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

188. (L3, P) Как интегрировать timerfd/eventfd/signalfd в epoll loop?

     **Ответ:** Создать соответствующие nonblocking CLOEXEC fd, добавить EPOLLIN и полностью обработать формат чтения/счётчики каждого API.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

189. (L3, D) Как расследовать latency spikes в epoll-based сервере?

     **Ответ:** Проверить long callbacks, unfair batching, worker queues, CPU throttling, timers и allocation stalls.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

190. (L3, S) Когда стоит делить I/O loop и worker pool?

     **Ответ:** Когда CPU-heavy или blocking business work нарушает I/O deadlines; нужен bounded pool и безопасная передача ownership/result.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)


## L4

191. (L4, S) Как проектировать high-load event-driven runtime на Linux?

     **Ответ:** Shard connections по owners, nonblocking I/O, bounded queues, timers/cancellation и явные shutdown states; измерять SLO под overload.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

192. (L4, S) Как выбирать между thread-per-connection, pool и epoll/reactor?

     **Ответ:** По concurrency, blocking requirements, CPU work и team complexity budget; benchmark должен включать overload и tail latency.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

193. (L4, D) Как расследовать масштабируемость event-loop архитектуры на production?

     **Ответ:** Снять scaling curve, loop lag, CPU/queue profiles и cgroup limits; отделить saturation одного shard от общей нагрузки.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

194. (L4, S) Как обеспечить корректность fd/event lifecycle при сложной архитектуре?

     **Ответ:** Один owner transitions/close, generation handles, отмена pending tasks и quiescence перед уничтожением context.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)

195. (L4, S) Как строить performance/debugging playbook для epoll-based сервисов?

     **Ответ:** Зафиксировать команды fd/limits, scheduler traces, loop metrics и capture state machines; для каждого symptom дать проверяемые гипотезы.

     **Источник:** [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [epoll_ctl(2)](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html)


     ---

## 5.3 Dynamic Loading

### dlopen / dlsym

## L1

196. (L1, T) Что такое dynamic loading?

     **Ответ:** Загрузка executable module во время работы процесса вместо обязательного включения в startup dependencies.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

197. (L1, T) Что делает `dlopen()`?

     **Ответ:** Загружает shared object и dependencies, выполняет необходимые relocations/initializers и возвращает handle либо NULL.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

198. (L1, T) Что делает `dlsym()`?

     **Ответ:** Ищет symbol по имени в области handle; ошибку определяют через dlerror, поскольку NULL может быть значением symbol.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

199. (L1, T) Что такое plugin на базовом уровне?

     **Ответ:** Загружаемый модуль с согласованным extension API и lifecycle, предоставляющий host дополнительное поведение.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

200. (L1, P) Как загрузить `.so` во время выполнения?

     **Ответ:** `dlopen(path, RTLD_NOW | RTLD_LOCAL)`, проверить handle/dlerror, найти entry point и проверить ABI до вызова.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


## L2

201. (L2, T) Что означают `RTLD_LAZY` и `RTLD_NOW`?

     **Ответ:** LAZY откладывает поддерживаемые function bindings до использования; NOW разрешает необходимые undefined symbols при загрузке.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

202. (L2, T) Что такое `RTLD_LOCAL` и `RTLD_GLOBAL`?

     **Ответ:** LOCAL ограничивает доступность symbols для последующих загрузок; GLOBAL делает их доступными в global lookup scope.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

203. (L2, D) Почему `dlopen()` может не найти библиотеку?

     **Ответ:** Неверный path/search policy, отсутствующая dependency, неподходящая architecture или permissions; читать dlerror.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

204. (L2, D) Почему `dlsym()` возвращает `NULL`?

     **Ответ:** Возможны отсутствие symbol и scope/version mismatch; только dlerror отличает lookup error от допустимого NULL value.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

205. (L2, P) Как корректно объявлять API плагина для загрузки через `dlsym()`?

     **Ответ:** Экспортировать C-compatible entry point с фиксированной signature и versioned table; host обязан использовать точно совпадающий function type.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

206. (L2, T) Почему `extern "C"` часто нужен для plugin entry points?

     **Ответ:** Отключает C++ name mangling для entry symbol; совместимость layout, ownership и calling convention этим не гарантируется.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

207. (L2, D) Как проверить `dlerror()` и почему это важно?

     **Ответ:** Сначала очистить старую ошибку `dlerror()`, вызвать dlsym, затем проверить новый `dlerror()`; сообщения копировать при необходимости.

     **Пример:** Фрагмент для POSIX dlsym:

     ```c
     typedef int (*plugin_init_fn)(void);
     dlerror();
     void *symbol = dlsym(handle, "plugin_init_v1");
     const char *error = dlerror();
     if (error != NULL) {
         /* Lookup failure: скопировать/сообщить error обычным кодом. */
     } else if (symbol == NULL) {
         /* Для function entry point это непригодный адрес. */
     } else {
         plugin_init_fn init = (plugin_init_fn)symbol;
         /* Вызывать только при совпадении documented ABI/signature. */
         int result = init();
         (void)result;
     }
     ```

     Преобразование object pointer в function pointer здесь опирается на POSIX contract dlsym, не на универсальную переносимость ISO C.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

208. (L2, T) Что происходит с зависимостями загружаемой `.so`?

     **Ответ:** Loader ищет DT_NEEDED dependencies и выполняет relocations; наличие main .so не гарантирует доступность всех зависимостей.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

209. (L2, D) Почему plugin может загрузиться, но упасть при первом вызове функции?

     **Ответ:** Signature/ABI mismatch, неинициализированный context, отсутствующая lazy dependency или нарушение ownership; проверить loader error и stack.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

210. (L2, P) Как выгрузить библиотеку через `dlclose()`?

     **Ответ:** Сначала остановить работу plugin и убрать все references/callbacks, затем `dlclose(handle)`; физическая выгрузка не гарантирована.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


## L3

211. (L3, T) Как symbol visibility влияет на dynamic loading?

     **Ответ:** Hidden symbols не становятся обычным public dynamic API; entry points нужно экспортировать явно.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

212. (L3, D) Почему возникают конфликты символов между host и plugin?

     **Ответ:** Global lookup/interposition связывает одинаковые имена с неожиданной реализацией; ограничивать exports и область видимости.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

213. (L3, D) Как ABI mismatch проявляется при dynamic loading?

     **Ответ:** Неверные аргументы/layout, vtable corruption, allocator mismatch и crashes; link/load success не доказывает ABI compatibility.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

214. (L3, T) Почему C++ классы через границу plugin ABI — рискованная идея?

     **Ответ:** Layout, mangling, exceptions, STL и runtime ABI зависят от toolchain; crossing boundary требует жёсткой compatibility policy.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

215. (L3, S) Как проектировать stable C-compatible plugin ABI?

     **Ответ:** Version/size fields, fixed-width types, opaque handles, явные error codes и destroy functions на стороне allocator owner.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

216. (L3, D) Почему `dlclose()` может быть опасен в многопоточном приложении?

     **Ответ:** Другой поток может исполнять plugin code или держать callbacks/TLS/destructors; нужна quiescence всех пользователей.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

217. (L3, D) Как расследовать crash в plugin после reload/unload?

     **Ответ:** Проверить stale function pointers, живые objects/tasks, callbacks, TLS и reload generations; сопоставить crash address с mappings.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

218. (L3, P) Как анализировать экспортируемые символы plugin `.so`?

     **Ответ:** `nm -D --defined-only plugin.so` и `readelf --dyn-syms plugin.so`; обычная symbol table не равна dynamic exports.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

219. (L3, D) Как versioning plugin API помогает избежать runtime crash?

     **Ответ:** Host проверяет version/capabilities/size до вызовов и отклоняет несовместимый модуль, а не угадывает layout.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

220. (L3, S) Когда dynamic loading оправдан архитектурно, а когда это overengineering?

     **Ответ:** Когда нужны независимые extensions/deployment; если все модули выпускаются вместе, обычная linking может быть проще.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


## L4

221. (L4, S) Как проектировать plugin platform для большого C/C++ продукта?

     **Ответ:** Минимальный versioned ABI, lifecycle protocol, packaging, compatibility tests, observability и isolation для недоверенных extensions.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

222. (L4, S) Как организовать compatibility policy между host и plugins?

     **Ответ:** Определить supported ABI generations, toolchain/runtime constraints, deprecation сроки и CI matrix host/plugin combinations.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

223. (L4, D) Как расследовать production incidents, вызванные сторонним plugin'ом?

     **Ответ:** Сохранить plugin hash/version, host build, config, stack и reproduction; проверить на изолированном стенде и отключить виновный модуль.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

224. (L4, S) Как безопасно реализовать plugin isolation и rollback?

     **Ответ:** Process boundary ограничивает crash; проверенная предыдущая версия и контролируемая смена routing позволяют rollback без unsafe unload.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

225. (L4, S) Как сочетать dynamic loading, observability и crash forensics?

     **Ответ:** Логировать load/init/stop/unload, build IDs и active generation; хранить symbols всех участвовавших модулей для core analysis.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


### Plugin Architectures

## L1

226. (L1, T) Что такое plugin architecture?

     **Ответ:** Host предоставляет extension contract, а модули реализуют функции через этот ограниченный интерфейс.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

227. (L1, T) Какие преимущества дает plugin model?

     **Ответ:** Независимое расширение продукта и выбор функций/dependencies при запуске; выгода требует стабильного контракта.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

228. (L1, T) Какие риски в plugin-based дизайне?

     **Ответ:** ABI drift, lifecycle races, dependency conflicts и crashes внутри host; in-process plugin разделяет его privileges и memory.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

229. (L1, P) Как на базовом уровне host узнает, какие функции предоставляет plugin?

     **Ответ:** Через documented entry point, возвращающий versioned function table и capabilities; проверять size/version до доступа к полям.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

230. (L1, D) Почему plugin system усложняет поддержку?

     **Ответ:** Появляются комбинации версий, platform dependencies и ownership boundaries, которые нужно тестировать и диагностировать.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


## L2

231. (L2, T) Как versioning API/ABI влияет на plugin system?

     **Ответ:** API описывает source contract, ABI — binary contract; совместимый source не обязательно совместим с уже собранным plugin.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

232. (L2, D) Почему plugin, собранный другим компилятором, может сломаться?

     **Ответ:** Могут отличаться ABI, standard library, compiler flags и calling conventions; C entry point уменьшает, но не исключает риски.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

233. (L2, T) Как отделить extension points от внутренней реализации host'а?

     **Ответ:** Публиковать узкие callbacks/opaque handles, скрывать internal structs и не обещать стабильность внутренних symbols.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

234. (L2, S) Как сделать plugin contract минимальным, но достаточным?

     **Ответ:** Предоставлять необходимые операции и versioned capabilities, избегая передачи внутренних containers и неограниченных callbacks.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

235. (L2, D) Почему shared ownership объектов между host и plugin опасен?

     **Ответ:** Неясно, кто освобождает память и переживает unload; allocator/runtime на сторонах могут различаться.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


## L3

236. (L3, S) Как проектировать plugin lifecycle: load/init/run/stop/unload?

     **Ответ:** Явные states и rollback init failure; stop отменяет callbacks/tasks, await quiescence предшествует destroy/unload.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

237. (L3, D) Как расследовать memory/resource leaks в plugin architecture?

     **Ответ:** Сопоставлять resources с plugin generation, проверять cycles load/run/stop и outstanding handles/tasks после stop.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

238. (L3, S) Как обеспечить диагностируемость ошибок plugin'ов?

     **Ответ:** Структурированные errors, plugin IDs, request correlation, lifecycle metrics и сохранение exact binary/symbols.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

239. (L3, D) Как sandbox/isolation влияют на debugging plugin'ов?

     **Ответ:** Изоляция добавляет IPC/namespace boundaries, зато позволяет отдельно наблюдать process, limits и crash artifacts.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

240. (L3, S) Когда нужен отдельный process boundary вместо in-process plugins?

     **Ответ:** Когда нужен fault containment, privilege separation или нельзя доверять lifecycle/ABI стороннего кода; IPC имеет цену.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


## L4

241. (L4, S) Как выбирать между in-process plugins, IPC modules и microservice-style extensions?

     **Ответ:** Сравнить isolation, latency, deployment independence и operational cost; boundary должен соответствовать риску и требованиям продукта.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

242. (L4, S) Как формализовать compatibility matrix для plugins?

     **Ответ:** Таблица host ABI × plugin ABI × platform/toolchain с ожидаемым результатом load и contract tests.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

243. (L4, D) Как triage'ить инциденты, когда host стабилен, а плагины разные и сторонние?

     **Ответ:** Группировать по plugin hash/version и symptom, собирать host context; успешность других plugins не исключает host contract bug.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

244. (L4, S) Как проектировать upgrade path для plugin ecosystem без массовых поломок?

     **Ответ:** Capability negotiation, additive changes, compatibility adapters и период поддержки старого ABI; проверять rolling upgrade/rollback.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)

245. (L4, S) Как удержать plugin architecture от деградации в “неуправляемую платформу”?

     **Ответ:** Ограничить public contracts, назначить owners, версионировать и удалять deprecated paths по прозрачной политике.

     **Источник:** [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html); [dlsym(3)](https://man7.org/linux/man-pages/man3/dlsym.3.html); [GCC: Code Generation Options](https://gcc.gnu.org/onlinedocs/gcc/Code-Gen-Options.html)


     ---

# 10. Practical / Real-world Scenarios

## L2

246. (L2, D) После `fork()` дочерний процесс неожиданно наследует сетевой сокет и не дает серверу корректно завершиться. Что проверять?

     **Ответ:** Проверить fd inheritance и все references в child; CLOEXEC срабатывает при exec, а ненужный socket нужно закрыть и до него.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

247. (L2, D) Многопоточное приложение иногда зависает на shutdown. Какие первые гипотезы?

     **Ответ:** Join под lock, workers без wakeup, незакрытые очереди, blocking I/O без deadline и race уничтожения ресурсов.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

248. (L2, D) Сервис перестает принимать новые соединения после нескольких дней работы. Какие system-level причины проверишь?

     **Ответ:** Fd leaks/limits, backlog saturation, memory pressure, CPU throttling и stuck accept loop; сохранить errno новых accept.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

249. (L2, D) `epoll`-loop грузит CPU на 100%, но полезной работы почти нет. Какие типовые причины?

     **Ответ:** Постоянный EPOLLOUT, HUP/EOF без удаления, zero timeout и EAGAIN spin; логировать events и actual I/O outcomes.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

250. (L2, D) Plugin загружается успешно, но падает при первом вызове API. Какие вероятные корни проблемы?

     **Ответ:** API version/signature, object lifetime, unresolved lazy symbols, runtime mismatch и init contract; собрать core с matching symbols.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)


## L3

251. (L3, D) После рефакторинга часть запросов “теряется” в event loop. Как строить расследование?

     **Ответ:** Коррелировать request IDs и transitions, проверить interest masks, ET drain, ONESHOT rearm, stale generations и ownership transfer.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

252. (L3, D) В логах есть `Too many open files`, но локально воспроизвести не удается. Как собирать доказательства?

     **Ответ:** Периодически сохранять fd count/targets, limits и open/close attribution на production; воспроизводить длительность и traffic mix.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

253. (L3, D) Child process иногда зависает сразу после `fork()` и до `exec()`. Почему это особенно подозрительно в multithreaded приложении?

     **Ответ:** Child мог унаследовать locked runtime state без owner thread; искать malloc/logging/locks между fork и exec.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

254. (L3, D) После hot reload plugin'а сервис нестабилен. Какие классы ошибок ищешь в первую очередь?

     **Ответ:** Stale callbacks/function pointers, unfinished workers, shared objects, allocator mismatch и неверную ABI negotiation новой generation.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

255. (L3, D) Производительность резко падает при увеличении числа потоков. Как отличить scheduler/lock contention/fd event issues?

     **Ответ:** Сравнить runnable/wait states, lock hold/wait, loop lag и queue depth; затем изолировать число workers и shards.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)


## L4

256. (L4, S) Как спроектировать runtime architecture Linux-сервиса: процессы, потоки, сигналы, event loop, plugins?

     **Ответ:** Определить owners и process boundaries, bounded worker/I/O paths, signal control plane, shutdown protocol и plugin isolation requirements.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

257. (L4, S) Какие invariants и ownership rules обязательно документировать в system-level C/C++ коде?

     **Ответ:** Кто создаёт/закрывает ресурс, кто может его использовать, synchronization order, deadlines, cancellation и момент окончательного освобождения.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

258. (L4, S) Как уменьшить число production incidents, связанных с fd lifecycle, signals и concurrency?

     **Ответ:** RAII, atomic CLOEXEC creation, owner-based event loops, signal policy и tests lifecycle under failure/stress.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

259. (L4, S) Как стандартизировать подход к graceful shutdown, crash handling и resource cleanup?

     **Ответ:** Общий state machine shutdown с deadlines; crash artifacts сохраняет supervision, unsafe handlers не выполняют сложный cleanup.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)

260. (L4, S) Как выстроить инженерную культуру, где runtime/system-level ошибки расследуются доказательно, а не “по ощущениям”?

     **Ответ:** Сохранять факты: errors, timestamps, build IDs, stacks и resource trends; каждую гипотезу проверять воспроизводимым экспериментом.

     **Источник:** [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html); [epoll(7)](https://man7.org/linux/man-pages/man7/epoll.7.html); [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html); [dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html)


     ---
