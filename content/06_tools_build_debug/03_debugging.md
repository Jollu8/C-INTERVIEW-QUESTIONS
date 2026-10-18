# C/C++ Debugging Question Bank (Linux)

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging

* **[S]** — system design / production engineering

---

# 3. Debugging

---

## 3.1 Основы отладки

## L1

1. (L1, T) Что такое debugging symbols?

   **Ответ:** Debug symbols связывают machine addresses с source lines, functions, types и variables. Их наличие не отменяет effects оптимизации.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

2. (L1, T) Что делает флаг `-g`?

   **Ответ:** `-g` добавляет debug information, обычно DWARF на Linux. Optimization и assertions задаются другими flags.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

3. (L1, T) Чем debug build отличается от release build с точки зрения отладки?

   **Ответ:** Debug обычно упрощает source-level stepping; optimized release может inline/remove/reorder code. Release тоже следует собирать с сохраняемыми symbols.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

4. (L1, T) Что такое stack trace?

   **Ответ:** Stack trace — восстановленная последовательность активных function calls выбранного thread. Inlining, tail calls и corruption ограничивают её полноту.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

5. (L1, T) Что такое stack frame?

   **Ответ:** Frame содержит контекст вызова: return location, saved state и доступные locals/arguments. Реальный layout зависит от ABI и optimization.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

6. (L1, T) Как вызовы функций формируют call stack?

   **Ответ:** Вызовы создают необходимые activation records, возврат восстанавливает caller state. Inlining и tail calls могут убрать отдельные physical frames.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

7. (L1, T) Что такое core dump?

   **Ответ:** Core dump — snapshot части process state при событии: memory mappings, registers и threads. Это чувствительный artifact, который может содержать secrets.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

8. (L1, P) Как включить генерацию core dump через `ulimit`?

   **Ответ:** В shell: `ulimit -c unlimited`, затем запускают process из этого environment. Также проверяют core_pattern, service limits и collector policy.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

9. (L1, P) Как проверить, что core dump действительно создается?

   **Ответ:** В controlled test вызывают известный crash и проверяют configured core location/collector. Не создают аварии в production ради проверки.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

10. (L1, T) Почему без `-g` отладка сильно ограничена?

   **Ответ:** Без matching debug info доступны addresses/exported symbols и disassembly, но source/types/locals часто отсутствуют. Их нельзя восстановить только включением `-g` после crash.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

## L2

11. (L2, T) Какие данные попадают в debug symbols?

   **Ответ:** Обычно сохраняются source mapping, function/type descriptions и variable location information. Optimized-out values могут не иметь восстанавливаемого location.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

12. (L2, T) Почему оптимизации ухудшают качество stack trace?

   **Ответ:** Inlining и tail calls меняют видимые frames; code motion затрудняет source mapping. Это не обязательно ошибка unwinder.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

13. (L2, T) Как frame pointer связан с backtrace?

   **Ответ:** Frame-pointer chain может помочь проходить frames. Альтернатива — unwind metadata; отсутствие frame pointer не означает невозможность backtrace.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

14. (L2, T) Что делает `-fno-omit-frame-pointer`?

   **Ответ:** Флаг уменьшает omission frame pointers, облегчая ряд profilers/unwinders. Гарантии зависят от target и function kind.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

15. (L2, P) Как получить stack trace из упавшего процесса?

   **Ответ:** `gdb ./app core` и `thread apply all bt full`; нужны matching executable/libraries/debug info. Для live процесса возможен attach.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

16. (L2, P) Как посмотреть системные настройки core dump в Linux?

   **Ответ:** Проверяют `ulimit -c`, `/proc/sys/kernel/core_pattern` и service/collector limits. Также учитывают permissions, disk и dump filters.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

17. (L2, D) Почему core dump не появился после падения программы?

   **Ответ:** Причины: лимит, collector destination, permissions, space, dumpability или signal без core action. Проверяют policy до предположения об ошибке application.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

18. (L2, D) Почему stack trace неполный или “сломанный”?

   **Ответ:** Возможны missing/wrong unwind info, optimized frames, mismatched binaries или stack corruption. Проверяют artifacts и registers/disassembly, не доверяют случайным адресам.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

19. (L2, T) Что такое signal и какие сигналы обычно приводят к crash?

   **Ответ:** Signals уведомляют process/thread о событиях; SIGSEGV, SIGABRT, SIGILL и SIGBUS часто связаны с crash. Default actions различаются.

   **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html).

20. (L2, T) Чем `SIGSEGV` отличается от `SIGABRT`?

   **Ответ:** SIGSEGV обычно сообщает invalid memory access; SIGABRT часто вызван abort/assert/runtime check. Конкретную первопричину определяют по context.

   **Источник:** [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html).

## L3

21. (L3, T) Как DWARF связан с debug symbols?

   **Ответ:** DWARF — формат debug descriptions для source/types/locations и related unwind data. ELF служит контейнером соответствующих sections.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

22. (L3, T) Как устроено unwind stack trace на Linux?

   **Ответ:** Unwinder использует registers, unwind rules/metadata и иногда frame pointers. Для shared objects нужны корректные mappings/load addresses.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

23. (L3, T) Почему tail-call optimization мешает отладке?

   **Ответ:** Tail-call может заменить caller frame переходом в callee. Поэтому logical call history не всегда представлена physical stack frames.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

24. (L3, D) Почему адреса в stack trace есть, а имен функций нет?

   **Ответ:** Нет matching symbols/debug packages, binary stripped или неверны runtime mappings. Проверяют build-id и load bias перед symbolication.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

25. (L3, P) Как использовать `addr2line` для расшифровки адресов?

   **Ответ:** `addr2line -e app -f -C 0xADDRESS`; для PIE/shared objects нужен address с учётом load bias, не raw ASLR PC.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

26. (L3, D) Почему crash воспроизводится только в release-сборке?

   **Ответ:** Сравнивают UB/races, defines, allocator/layout и exact flags. Сохраняют production-like optimized build с symbols, а не заменяют его сразу Debug.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

27. (L3, D) Как дебажить optimized-out variables?

   **Ответ:** Исследуют registers/disassembly и доступные value locations; иногда значение уже невозможно восстановить. Для нового run меняют instrumentation или targeted optimization.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

28. (L3, T) Что такое separate debug symbols?

   **Ответ:** Debug information хранится отдельно от runtime binary с надёжной связью по build-id/debuglink. Это уменьшает deployed size без потери diagnosis.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

29. (L3, P) Как отделить символы от бинаря и использовать их отдельно?

   **Ответ:** Например: `objcopy --only-keep-debug app app.debug`, `strip --strip-debug app`, `objcopy --add-gnu-debuglink=app.debug app`. Архивируют исходный build.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

30. (L3, D) Как понять, соответствует ли core dump именно этому бинарю?

   **Ответ:** Сверяют build-id, architecture, mappings и release metadata всех relevant modules. Совпадение имени файла недостаточно.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

## L4

31. (L4, T) Как устроена инфраструктура symbol server / debug package в Linux?

   **Ответ:** Debug artifacts индексируют по build-id и выдают debugger по configured search/debuginfod. Доступ, retention и provenance должны быть управляемыми.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

32. (L4, S) Как организовать хранение debug symbols для production?

   **Ответ:** Сохраняют exact binaries/debug info/dependencies по release/build-id с retention и access policy. Crash должен автоматически ссылаться на этот inventory.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

33. (L4, D) Как расследовать crash при частично поврежденном stack?

   **Ответ:** Начинают с fault PC/registers и reliable frames, проверяют stack memory и mappings. Предполагаемые frames помечают как гипотезы, не точную историю.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

34. (L4, S) Как проектировать build/debug pipeline, чтобы post-mortem был надежным?

   **Ответ:** Pipeline создаёт build-id, matching debug artifacts и immutable release metadata, проверяет unwind/symbolication smoke test и configured core collection.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

35. (L4, D) Как восстанавливать контекст падения при отсутствии полного core dump?

   **Ответ:** Используют minidump/registers, addresses, maps, logs и version metadata. Недоступные memory/state явно ограничивают выводы.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

---

## 3.2 GDB

## L1

36. (L1, T) Что такое GDB?

   **Ответ:** GDB — debugger, управляющий execution и исследующий live process или core, registers, memory и source context.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

37. (L1, P) Как запустить программу под GDB?

   **Ответ:** `gdb --args ./app arg1`, затем `run`. Подбирают environment и working directory, соответствующие воспроизведению.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

38. (L1, P) Как поставить обычный breakpoint?

   **Ответ:** `break main` или `break file.cpp:42`. Breakpoint связывается с доступным code location; pending/shared-library cases учитывают отдельно.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

39. (L1, P) В чем разница между `run` и `start`?

   **Ответ:** `run` запускает до остановки/завершения; `start` ставит временную остановку у начала main и запускает process.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

40. (L1, P) Что делают команды `step`, `next`, `finish`?

   **Ответ:** `step` входит в вызовы, `next` проходит source line без обычного входа, `finish` выполняет до возврата текущего frame. Optimization меняет stepping.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

41. (L1, P) Как посмотреть backtrace?

   **Ответ:** `bt` показывает текущий thread; `bt full` добавляет доступные locals, `thread apply all bt` — все threads.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

42. (L1, P) Как вывести значение переменной?

   **Ответ:** `print variable` или `p expression` в выбранном frame. Вычисление некоторых expressions может вызвать code, поэтому в diagnosis это учитывают.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

43. (L1, P) Как продолжить выполнение после остановки?

   **Ответ:** Команда `continue` (`c`) продолжает до следующей остановки или exit. Для signal handling учитывают debugger policy.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

44. (L1, P) Как выйти из GDB?

   **Ответ:** `quit` (`q`); debugger уточняет судьбу active inferior при необходимости. Для attached process предварительно используют `detach`, если нужно продолжить его работу.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

45. (L1, T) В чем разница между source-level и instruction-level debugging?

   **Ответ:** Source-level использует lines/types, instruction-level — registers и machine instructions. При optimized code второй режим часто необходим.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

## L2

46. (L2, P) Как поставить conditional breakpoint?

   **Ответ:** `break file.cpp:42 if count > 100` либо `condition N expression`. Условие должно быть valid в соответствующем frame context.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

47. (L2, P) Как поставить breakpoint по имени функции?

   **Ответ:** `break Namespace::function`; overloads/templates могут дать несколько locations. Проверяют `info breakpoints`.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

48. (L2, P) Как поставить breakpoint по файлу и строке?

   **Ответ:** `break source.cpp:42`; при relocated source tree настраивают source path/substitution. Optimizer мог убрать отдельную строку.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

49. (L2, P) Что такое watchpoint?

   **Ответ:** Watchpoint останавливает при изменении expression/memory location. `watch`, `rwatch`, `awatch` имеют разные semantics и hardware constraints.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

50. (L2, P) Как смотреть память по адресу?

   **Ответ:** Например, `x/16xb address` показывает 16 bytes, `x/8gx address` — восемь 8-byte units. Проверяют valid mapping и target architecture.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

51. (L2, P) Как напечатать register'ы?

   **Ответ:** `info registers`, для расширенного набора — `info all-registers`. Значения интерпретируют по ABI и текущей instruction.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

52. (L2, P) Как attach'иться к уже запущенному процессу?

   **Ответ:** `gdb -p PID`; нужны ptrace permissions и подходящий namespace/security context. Attach обычно временно останавливает threads.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

53. (L2, D) Когда attach полезнее, чем запуск под GDB?

   **Ответ:** Attach сохраняет уже возникшее состояние long-running process, например hang. Он меняет scheduling и может повлиять на timing-sensitive bug.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

54. (L2, P) Как переключаться между потоками в GDB?

   **Ответ:** `info threads`, затем `thread N`, где N — GDB thread ID. Это не обязательно Linux TID.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

55. (L2, D) Как найти поток, который завис или держит mutex?

   **Ответ:** `thread apply all bt` выявляет waits и active owners; mutex ownership зависит от реализации. Строят wait-for relationships и подтверждают state.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

## L3

56. (L3, T) В чем разница hardware watchpoint vs software watchpoint?

   **Ответ:** Hardware watchpoint использует CPU debug facilities с ограничениями count/size. Software watchpoint требует дорогого stepping/comparison и имеет другие restrictions.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

57. (L3, D) Почему breakpoint “не срабатывает”?

   **Ответ:** Проверяют execution path, actual binary, symbols, inline/removed code, pending library и breakpoint conditions. Номер строки не гарантирует executable location.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

58. (L3, D) Почему GDB показывает `<optimized out>`?

   **Ответ:** Оптимизатор удалил variable или её location/value недоступны в этой точке. Debug info не обязан хранить все исходные values.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

59. (L3, P) Как дебажить core dump через GDB?

   **Ответ:** `gdb ./app core`, затем `bt full`, `info registers`, `thread apply all bt`. Execution core продолжать нельзя.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

60. (L3, P) Как загрузить отдельные debug symbols в GDB?

   **Ответ:** Настраивают `set debug-file-directory`, matching debuglink/build-id или debuginfod. Symbols произвольной новой сборки применять нельзя.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

61. (L3, P) Как дизассемблировать текущую функцию?

   **Ответ:** `disassemble /m function` или `x/10i $pc`; source mix зависит от debug info. Для crash важна фактическая machine instruction.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

62. (L3, P) Как смотреть аргументы функции и локальные переменные на каждом frame?

   **Ответ:** Выбирают `frame N`, используют `info args` и `info locals`. Optimized values могут отсутствовать или иметь неполное location coverage.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

63. (L3, D) Как искать corruption памяти через watchpoint?

   **Ответ:** Ставят watch на known-valid location до её порчи и исследуют writer. Watchpoint после crash не восстановит уже прошедшее изменение.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

64. (L3, D) Как дебажить multithreaded deadlock в GDB?

   **Ответ:** Собирают все stacks, определяют locks/resources и строят cycle ожиданий. Один blocked thread не доказывает deadlock; нужны владельцы и dependencies.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

65. (L3, P) Как использовать `thread apply all bt`?

   **Ответ:** Команда выполняет backtrace для каждого thread: `thread apply all bt full`. Большой output может содержать sensitive values.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

## L4

66. (L4, T) Как GDB работает с DWARF и unwind info?

   **Ответ:** GDB читает debug types/locations и unwind rules, связывая PC с source/frame. Совпадение artifacts и runtime mappings критично.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

67. (L4, D) Как дебажить race condition, которая редко воспроизводится?

   **Ответ:** Предпочитают TSan/stress/replay и narrow tracing: debugger меняет timing. GDB полезен для state, но не доказывает absence race.

   **Источник:** [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

68. (L4, S) Как встроить GDB-based post-mortem анализ в production pipeline?

   **Ответ:** Автоматизируют безопасный batch разбор core с matched artifacts, сохраняют signature и ограничивают доступ/объём вывода. Сбор не должен блокировать recovery.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

69. (L4, D) Как расследовать crash внутри libc / libstdc++ / чужой `.so`?

   **Ответ:** Сначала проверяют matching library symbols и caller arguments/lifetimes. Crash в allocator/libc часто является следствием более ранней corruption.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

70. (L4, D) Как использовать Python scripting в GDB для автоматизации расследований?

   **Ответ:** GDB Python API позволяет обходить threads/frames, читать values и создавать commands/pretty printers. Скрипты должны учитывать invalid memory и untrusted artifacts.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

---

## 3.3 Memory Debugging

### Valgrind

## L1

71. (L1, T) Что такое Valgrind?

   **Ответ:** Valgrind — framework dynamic instrumentation; Memcheck — один из его tools для memory errors. Названия не следует использовать как полные синонимы.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

72. (L1, T) Что делает Memcheck?

   **Ответ:** Memcheck отслеживает addressability/definedness и сообщает invalid accesses, misuse allocation и leaks. Он не обнаруживает все логические или concurrency errors.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

73. (L1, T) Что такое memory leak?

   **Ответ:** Leak — allocated memory, которой больше нельзя корректно распорядиться/освободить по ownership contract. Рост RSS сам по себе leak не доказывает.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

74. (L1, T) Что такое use-after-free?

   **Ответ:** Это доступ после окончания lifetime/free allocation. Память может ещё содержать прежние bytes, но доступ уже некорректен.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

75. (L1, T) Что такое invalid read / invalid write?

   **Ответ:** Чтение/запись address, недопустимого для операции, например вне allocation или после free. Memcheck сообщает size и relevant allocation context.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

76. (L1, P) Как запустить программу под Valgrind?

   **Ответ:** `valgrind --tool=memcheck ./app args`. Для source locations собирают с debug info и сохраняют controlled workload.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

77. (L1, P) Как включить leak detection?

   **Ответ:** `valgrind --leak-check=full --show-leak-kinds=all ./app`. Выходной статус для CI настраивают отдельно.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

78. (L1, D) Как интерпретировать “definitely lost”?

   **Ответ:** Memcheck не нашёл pointer к allocation: память считается definitely lost в текущем snapshot. Исследуют allocation stack и потерю ownership.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

79. (L1, D) Как интерпретировать “indirectly lost”?

   **Ответ:** Allocation достижима только через другую lost allocation, например nodes дерева после потери root. Исправление root ownership может устранить множество indirect leaks.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

80. (L1, D) Чем leak отличается от still reachable?

   **Ответ:** Still reachable имеет найденный pointer path и может быть intentional pool/cache. Это не автоматическая ошибка, но policy требует объяснения lifetime.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

## L2

81. (L2, D) Как по отчету Valgrind найти место утечки?

   **Ответ:** Report показывает allocation stack, а не обязательно строку потери pointer. Прослеживают ownership transitions и missing cleanup по соответствующему workload.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

82. (L2, P) Как использовать suppression files?

   **Ответ:** Файл подключают `--suppressions=path`; patterns делают узкими и документированными. Suppression скрывает diagnosis, а не исправляет memory defect.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

83. (L2, T) Почему Valgrind сильно замедляет программу?

   **Ответ:** Он переводит и инструментирует machine code, ведёт shadow state и проверяет accesses. Поэтому CPU/memory overhead существенно выше обычного execution.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

84. (L2, D) Какие классы ошибок хорошо ловит Valgrind?

   **Ответ:** Хорошо выявляет invalid heap accesses, use-after-free, double free, uninitialized-value use и leaks в наблюдённых paths.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

85. (L2, D) Какие ошибки Valgrind ловит плохо или не ловит?

   **Ответ:** Не гарантирует обнаружение всех stack/global overflows, data races и logical lifetime errors внутри valid allocations. Невыполненный path не проверяется.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

86. (L2, T) Почему Valgrind хуже подходит для heavily optimized кода?

   **Ответ:** Optimization усложняет source mapping и меняет code patterns; instrumentation всё равно работает, но diagnosis становится менее прямой. Используют suitable debug build.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

87. (L2, D) Что означает “conditional jump depends on uninitialised value”?

   **Ответ:** Управление потоком зависит от undefined bytes. Причина может быть раньше места branch; включают origin tracking и ищут initialization.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

88. (L2, P) Как анализировать uninitialized memory через Valgrind?

   **Ответ:** `--track-origins=yes` добавляет сведения о происхождении uninitialized value. Это увеличивает overhead, зато сокращает путь к allocation/stack origin.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

89. (L2, D) Как найти double free через Valgrind?

   **Ответ:** Report invalid free связывают с предыдущим free и allocation. Исправляют double ownership/cleanup race, а не только условие вокруг free.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

90. (L2, D) Как найти heap corruption через Valgrind?

   **Ответ:** Сначала рассматривают первый invalid write/read по времени: поздний allocator crash часто вторичен. Уменьшают testcase и отслеживают ownership.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

## L3

91. (L3, T) Как Valgrind инструментирует код?

   **Ответ:** Valgrind переводит blocks machine code в внутреннее representation, добавляет tool instrumentation и исполняет преобразованные blocks.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

92. (L3, D) Почему под Valgrind баг исчезает?

   **Ответ:** Instrumentation меняет scheduling, memory layout и скорость. Исчезновение race/UB symptom не означает исправление.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

93. (L3, D) Почему Valgrind показывает много шума от сторонних библиотек?

   **Ответ:** Возможны реальные bugs, unsupported patterns, missing symbols или известные tool/library interactions. Проверяют versions и минимальный пример до narrow suppression.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

94. (L3, P) Как сочетать Valgrind и debug symbols для качественного анализа?

   **Ответ:** Собирают с `-g`, используют matching libraries и удобный уровень optimization. Тогда error stacks связываются с source locations.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

95. (L3, D) Как анализировать leaks в long-running daemon?

   **Ответ:** Выделяют representative cycle, сравнивают leak/heap snapshots и allocation growth. Для полного daemon workload стоимость Memcheck может быть слишком высокой.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

96. (L3, D) Как отличить реальную утечку от кешей/allocator pools?

   **Ответ:** Сравнивают live allocations, удерживающие owners и plateau после нагрузки. Pools могут удерживать память законно, но unbounded growth всё равно требует limits.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

97. (L3, S) Когда Valgrind лучше ASan, а когда хуже?

   **Ответ:** Memcheck полезен без rebuild и для definedness; ASan обычно быстрее и лучше подходит частым instrumented tests. Coverage/platform restrictions сравнивают отдельно.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

98. (L3, D) Как дебажить corruption, если stack trace указывает на allocator, а не на место ошибки?

   **Ответ:** Ищут ранний invalid access, allocation/free history и повреждённый object. Crash inside allocator указывает на обнаружение inconsistency, не обязательно её источник.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

99. (L3, P) Как использовать Massif и когда это полезно?

   **Ответ:** `valgrind --tool=massif ./app` строит heap-usage profile во времени; анализируют allocation call trees. Это profiling объёма, не замена Memcheck.

   **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html).

100. (L3, T) Что такое origin tracking в Valgrind?

   **Ответ:** Origin tracking хранит происхождение undefined values и показывает, где они возникли. Он не выдаёт полную историю каждого присваивания.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

## L4

101. (L4, S) Как встроить Valgrind checks в CI без чрезмерного slowdown?

   **Ответ:** Запускают selected memory-focused tests отдельно/ночью, используют error-exitcode и controlled suppressions. Не подменяют полный coverage маленьким smoke test.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

102. (L4, D) Как расследовать memory corruption, который воспроизводится только на production-нагрузке?

   **Ответ:** Сохраняют production artifacts/core, снимают low-overhead context и воспроизводят load в lab с sanitizers. Ищут early corruption, учитывая timing changes.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

103. (L4, S) Как выбрать memory-debugging strategy для большого C/C++ проекта?

   **Ответ:** Комбинируют ASan/UBSan, TSan отдельно, Memcheck для definedness и heap profiles для роста. Coverage/overhead определяют этап запуска.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html); [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

104. (L4, D) Как приоритизировать сотни Valgrind-репортов в legacy-коде?

   **Ответ:** Группируют по root stack/type, приоритизируют invalid writes/UAF и externally reachable paths. Сначала устраняют ранние общие causes, затем secondary reports.

   **Источник:** [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

105. (L4, S) Как комбинировать Valgrind, ASan и post-mortem анализ?

   **Ответ:** Sanitizers дают быстрые instrumented runs, Memcheck дополняет definedness, core сохраняет state невоспроизведённого crash. Artifacts и workload связывают одной version metadata.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

### AddressSanitizer / UBSan

## L1

106. (L1, T) Что такое AddressSanitizer?

   **Ответ:** ASan — compiler/runtime instrumentation для обнаружения многих address/lifetime errors в выполненном коде. Это не формальное доказательство memory safety.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

107. (L1, T) Что такое UndefinedBehaviorSanitizer?

   **Ответ:** UBSan проверяет выбранные классы undefined behavior, например alignment и signed overflow. Он не охватывает всё UB языка.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

108. (L1, P) Как собрать программу с ASan?

   **Ответ:** Например: `clang++ -g -O1 -fsanitize=address -fno-omit-frame-pointer main.cpp -o app`. Sanitizer flag нужен и на final link.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

109. (L1, P) Как собрать программу с UBSan?

   **Ответ:** `clang++ -g -O1 -fsanitize=undefined main.cpp -o app`; recovery/trap policy задают отдельно.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

110. (L1, T) Какие ошибки ловит ASan?

   **Ответ:** Многие out-of-bounds, use-after-free, double/invalid free и selected stack lifetime errors. Возможности зависят от configuration/platform.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

111. (L1, T) Какие ошибки ловит UBSan?

   **Ответ:** Проверки включают signed overflow, invalid shifts, alignment и некоторые type/bounds cases. Набор флагов и ограничения сверяют с compiler docs.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

112. (L1, D) Чем ASan отличается от Valgrind?

   **Ответ:** ASan инструментирует при compilation и использует runtime/shadow memory; Memcheck dynamically instrumentирует machine code. Overhead и detected classes различаются.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

113. (L1, D) Что такое heap-buffer-overflow?

   **Ответ:** Это access за пределами heap allocation. Report связывают с размером allocation и offending instruction, а не только crash PC.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

114. (L1, D) Что такое stack-buffer-overflow?

   **Ответ:** Это access вне допустимой области stack object. Не любой неверный index внутри одного большого allocation будет обнаружен.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

115. (L1, D) Что такое use-after-free?

   **Ответ:** Объект уже освобождён, но pointer/reference ещё используется. ASan может показать allocation и free stacks, помогая восстановить lifetime.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

## L2

116. (L2, T) Как ASan инструментирует код?

   **Ответ:** Compiler добавляет проверки accesses, runtime поддерживает shadow memory и interceptors. Неинструментированный код снижает coverage.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

117. (L2, T) Что такое red zones?

   **Ответ:** Poisoned области вокруг objects позволяют обнаружить пересечение границы до порчи соседнего объекта. Redzones увеличивают memory footprint.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

118. (L2, D) Почему ASan может падать раньше, чем исходная программа без него?

   **Ответ:** ASan останавливается на обнаруженном invalid access раньше вторичного crash. Изменённый layout также может изменить момент проявления bug.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

119. (L2, P) Как читать ASan stack trace?

   **Ответ:** Читают error type, access size/address, fault stack и allocation/free stacks. Исправляют ownership/bounds первопричину, не строку runtime reporter.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

120. (L2, D) Как найти источник UB по отчету UBSan?

   **Ответ:** Берут точную source location, operands/type и violated rule из diagnostic. Проверяют исходную arithmetic/type logic и добавляют regression input.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

121. (L2, T) Какие типы UB особенно важны в C/C++?

   **Ответ:** Особенно важны bounds/lifetime, signed arithmetic, alignment, invalid shifts и races. Для races используют отдельный TSan, не UBSan.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

122. (L2, D) Почему signed integer overflow считается UB?

   **Ответ:** Языковые правила не задают wraparound signed arithmetic. Для нужной modular arithmetic используют unsigned или checked операции согласно contract.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

123. (L2, P) Можно ли запускать ASan в тестах/CI?

   **Ответ:** Да: собирают и линкуют tests с sanitizer, запускают representative workload и сохраняют reports. Resource limits должны учитывать overhead.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

124. (L2, D) Почему sanitizer-сборка иногда требует отключить часть оптимизаций?

   **Ответ:** Умеренная optimization улучшает diagnosis, но ASan поддерживает optimized builds. Массовое отключение optimization может скрыть production-like paths.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

125. (L2, D) Что делать, если sanitizer нашел баг в third-party code?

   **Ответ:** Минимизируют report, проверяют supported version, обновляют/patch dependency и передают воспроизведение upstream. Suppression оправдана лишь после понятного analysis.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

## L3

126. (L3, T) Ограничения ASan по сравнению с Valgrind?

   **Ответ:** ASan обычно требует rebuild и не отслеживает uninitialized-value use как Memcheck. Неинструментированные modules и intra-object accesses ограничивают coverage.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

127. (L3, T) Что такое ODR violation detection у sanitizer'ов?

   **Ответ:** ASan может выявлять selected ODR violations, например конфликтующие global definitions. Это не полный анализ ODR во всём C++ program.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

128. (L3, D) Почему sanitizer-сборка не воспроизводит production crash?

   **Ответ:** Layout, timing, allocation behavior, workload или instrumented coverage отличаются. Сохраняют production-like flags и исследуют races отдельно.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

129. (L3, D) Как расследовать intermittent use-after-free с ASan?

   **Ответ:** Запускают повторяемый stress/replay, сохраняют первый report с allocation/free stacks. Уточняют async ownership и cancellation races.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

130. (L3, D) Как интерпретировать shadow memory report?

   **Ответ:** Shadow bytes описывают доступность application memory; legend связывает markers с freed/redzone states. Они помогают классификации, но не заменяют source stacks.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

131. (L3, T) Что такое leak sanitizer и как он связан с ASan?

   **Ответ:** LSan ищет unreachable heap allocations; на supported platforms он интегрирован с ASan либо запускается отдельно. Leak detection обычно выполняется на configured checkpoints/exit.

   **Источник:** [Clang: LeakSanitizer](https://clang.llvm.org/docs/LeakSanitizer.html).

132. (L3, P) Как комбинировать ASan и UBSan в одной сборке?

   **Ответ:** Например, `-fsanitize=address,undefined` на compilation/link. ASan и TSan совместно в одном обычном build не комбинируют.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

133. (L3, D) Почему sanitizer увеличивает memory footprint?

   **Ответ:** Shadow mapping, redzones, quarantine и allocation metadata увеличивают virtual/resident memory. Virtual address usage нельзя напрямую приравнивать RSS.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

134. (L3, D) Как анализировать false positive / false negative sanitizer'ов?

   **Ответ:** Проверяют instrumented coverage, custom allocators, supported platform и минимальный testcase. Реальный дефект не следует объявлять false positive из-за необычного stack.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

135. (L3, S) Как внедрить sanitizer pipeline в команду?

   **Ответ:** Начинают с stable selected tests, назначают owners/fix policy, затем расширяют coverage. Reports сохраняют с exact artifacts; новые failures должны быть actionable.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

## L4

136. (L4, S) Как выбрать набор sanitizer'ов для разных стадий CI/CD?

   **Ответ:** PR: быстрые ASan/UBSan; отдельно TSan/concurrency tests; nightly — длинный stress/fuzz и дополнительные tools. Набор зависит от риска и platform support.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

137. (L4, D) Как расследовать баг, который проявляется только без sanitizer'ов?

   **Ответ:** Сравнивают workload/config и применяют release symbols, cores, narrow tracing и minimized testcase. Sanitizer success не исключает race/UB.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

138. (L4, S) Как минимизировать стоимость sanitizer builds в большом монорепо?

   **Ответ:** Кешируют compatible builds, запускают impacted targets и шардируют tests. Nightly coverage дополняет PR subset; sanitizer configs не смешивают в одном artifact cache.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

139. (L4, D) Как использовать sanitizer-репорты для поиска архитектурных проблем?

   **Ответ:** Повторяющиеся UAF показывают неясный ownership, bounds bugs — слабый parsing boundary. Группируют patterns и исправляют API/invariants, а не только отдельные crashes.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

140. (L4, S) Как построить policy: какие sanitizer'ы обязательны для merge?

   **Ответ:** Policy фиксирует required configs/tests, blocking severity, suppression owner/expiry и platform matrix. Необнаруженный defect не считается доказательством отсутствия риска.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

---

## 3.4 Post-mortem анализ

## L1

141. (L1, T) Что такое post-mortem debugging?

   **Ответ:** Post-mortem — исследование сохранённого state после завершения/crash process. В отличие от live run нельзя продолжить execution и воспроизвести прошлые события.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

142. (L1, T) Зачем нужен core dump после crash?

   **Ответ:** Core сохраняет registers, thread stacks и часть memory в момент сбоя. Это позволяет проверить context без немедленного воспроизведения.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

143. (L1, P) Как открыть core dump в GDB?

   **Ответ:** `gdb ./app core`, затем `bt full` и `thread apply all bt`. Нужны соответствующие binary и loaded libraries.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

144. (L1, T) Почему stripped binary затрудняет анализ?

   **Ответ:** Удалённая debug information лишает source/types/locals. Matching separate symbols могут восстановить доступную diagnosis без замены runtime binary.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

145. (L1, T) Что значит “бинарь соотносится с core dump”?

   **Ответ:** Это exact executable build и compatible saved mappings/modules. Проверяют build-id и artifact provenance, а не только filename.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

## L2

146. (L2, D) Как понять причину падения по core dump?

   **Ответ:** Определяют signal/faulting thread, PC/instruction/operands, stacks и object invariants. Core показывает state detection, который может быть следствием более ранней ошибки.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

147. (L2, P) Как получить backtrace всех потоков из core dump?

   **Ответ:** В GDB: `thread apply all bt full`. Вывод защищают: locals могут содержать credentials и пользовательские данные.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

148. (L2, D) Как понять, какой поток упал первым?

   **Ответ:** Обычно core notes/debugger указывают thread, получивший fatal signal. Это не обязательно thread, который раньше повредил память.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

149. (L2, D) Что делать, если бинарь stripped, но debug package есть?

   **Ответ:** Загружают matching separate debug files через build-id/debuglink/search paths. Debug package другой version может дать ложные source locations.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

150. (L2, D) Почему адреса в core dump не совпадают с исходниками?

   **Ответ:** Причины: ASLR/load bias, другой build, wrong source revision и optimization. Сначала подтверждают exact artifact mapping.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

151. (L2, T) Как ASLR влияет на post-mortem анализ?

   **Ответ:** ASLR меняет load addresses, поэтому raw PC нормализуют по mappings/load bias. Для symbolication нужна точная module identity.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

152. (L2, P) Как использовать `info sharedlibrary` в GDB?

   **Ответ:** `info sharedlibrary` показывает известные GDB shared objects и symbol status. При offline analysis настраивают sysroot/search paths к сохранённым dependencies.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

153. (L2, D) Как понять, какая версия библиотеки была загружена во время crash?

   **Ответ:** Сверяют module paths, build-ids и immutable release inventory. Одного SONAME недостаточно для точной версии реализации.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

154. (L2, D) Как расследовать crash в фоне, когда нет возможности воспроизвести локально?

   **Ответ:** Сохраняют core, artifacts, config revision и безопасные logs, формулируют hypotheses и проверяют invariants. Для следующего occurrence добавляют targeted telemetry.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

155. (L2, T) Чем post-mortem отличается от live-debugging?

   **Ответ:** Core неизменяем и ограничен сохранёнными данными; live debugging позволяет stepping/watchpoints, но меняет timing и process state.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

## L3

156. (L3, D) Как анализировать production crash без исходников всех зависимостей?

   **Ответ:** Используют exported symbols, debug packages, disassembly, ABI и caller contracts. Неизвестные source/locals явно ограничивают уверенность analysis.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

157. (L3, D) Как расследовать crash внутри allocator'а?

   **Ответ:** Ищут invalid free, overwritten metadata, UAF и races раньше обнаружения. Sanitizer reproduction часто показывает offending access ближе к root cause.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

158. (L3, D) Как понять, что первичная ошибка произошла задолго до падения?

   **Ответ:** Несогласованные object/allocator invariants и поздний consumer crash дают гипотезу. Её подтверждают lifetime history, earlier logs или instrumented reproduction.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

159. (L3, T) Что такое split debug info и build-id?

   **Ответ:** Split debug info отделяет descriptions от runtime code; build-id идентифицирует artifact. Он помогает lookup, но не заменяет source/config provenance.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

160. (L3, P) Как использовать build-id для поиска символов?

   **Ответ:** Читают build-id, затем ищут corresponding debug artifact в configured directory/service. Проверяют identity before load, не подбирают «похожую» version.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

161. (L3, D) Как расследовать crash в multithreaded сервисе по core dump?

   **Ответ:** Изучают все threads, queues, object owners и locks, начиная с fatal context. Snapshot не показывает полную history и сам не доказывает race.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

162. (L3, D) Как отличить memory corruption от логической ошибки по core dump?

   **Ответ:** Проверяют addresses, types и invariants: impossible pointer/layout может указывать corruption, valid state с неверным branch — logic. Окончательный вывод требует дополнительных evidence.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

163. (L3, D) Как извлекать полезный контекст: аргументы, глобальные объекты, состояние очередей?

   **Ответ:** Используют `info args/locals`, print known objects и bounded memory inspection. Для STL нужны matching pretty printers; повреждённые containers нельзя обходить без limits.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

164. (L3, D) Что делать, если core dump слишком большой или обрезанный?

   **Ответ:** Проверяют collector/size/filter policy и доступные mappings. Для следующих crashes настраивают полезный scope/limits; отсутствующие страницы восстановить из core невозможно.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

165. (L3, S) Как организовать автоматический сбор и разбор core dump'ов?

   **Ответ:** Collector сохраняет core и metadata, worker symbolicates по exact build-id, группирует signature и открывает triage record. Access/retention учитывают sensitive memory.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

## L4

166. (L4, S) Как строить production crash triage pipeline?

   **Ответ:** Pipeline связывает release, crash metadata, symbols, bounded automated analysis, deduplication и owner. Отдельно отслеживают collection/symbolication failures.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

167. (L4, D) Как кластеризовать одинаковые crash'и по stack trace / signature?

   **Ответ:** Нормализуют PC по module/build-id и сравнивают stable frames/error type. Одна signature может объединять разные corruption causes; grouping проверяют.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

168. (L4, S) Как обеспечить соответствие: бинарь, symbols, config, core?

   **Ответ:** Artifacts immutable, подписаны/хешированы и связаны release manifest. Core record содержит build-id, dependency/config revisions и timestamp.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

169. (L4, D) Как анализировать crash после hotfix, если символы потеряны?

   **Ответ:** Ищут exact CI/package artifacts и matching source. Rebuild может отличаться; без подтверждения identity symbolication считают приблизительной.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

170. (L4, S) Как сделать post-mortem анализ стандартной инженерной практикой в команде?

   **Ответ:** Вводят artifact retention, runbooks, ownership, regular drills и review corrective actions. Проверяют не только crash fix, но и пригодность collected evidence.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

---

## 3.5 Logging

## L1

171. (L1, T) Зачем нужен logging?

   **Ответ:** Logging фиксирует события и diagnostic context для operations, audit и debugging. Он дополняет metrics/traces, а не заменяет их.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

172. (L1, T) Какие бывают уровни логирования?

   **Ответ:** Часто используют TRACE, DEBUG, INFO, WARN, ERROR, FATAL; semantics задаёт проект/library. Единое соглашение важнее названий.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

173. (L1, T) Чем `INFO` отличается от `DEBUG`?

   **Ответ:** INFO отражает normal operational events, DEBUG — подробности diagnosis. Production verbosity выбирают по ценности, overhead и confidentiality.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

174. (L1, T) Когда использовать `ERROR` и `FATAL`?

   **Ответ:** ERROR — failed operation, требующая внимания; FATAL — событие с termination по policy. Не каждую recoverable retry ошибку нужно считать fatal.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

175. (L1, P) Какие поля полезно включать в лог?

   **Ответ:** Timestamp, severity, service/version, event name, request/connection ID и safe context. Secrets и raw personal payload исключают.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

176. (L1, T) Что такое structured logging?

   **Ответ:** Structured logging хранит отдельные типизированные fields вместо неформального текста. Это облегчает фильтрацию и aggregation.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

177. (L1, T) Почему plain text логов может быть недостаточно?

   **Ответ:** Нестабильные сообщения трудно парсить, связывать и сравнивать. Schema даёт однозначные event names, IDs и error categories.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

178. (L1, P) Что важно логировать при ошибке?

   **Ответ:** Логируют operation/stage, native error, safe endpoint/context и correlation ID. errno сохраняют сразу после failed syscall.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [socket(7)](https://man7.org/linux/man-pages/man7/socket.7.html).

179. (L1, D) Почему “слишком мало логов” мешает расследованию?

   **Ответ:** Не хватает stage/state, чтобы связать symptom с механизмом. Требования к diagnostic fields проектируют до incident.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

180. (L1, D) Почему “слишком много логов” тоже проблема?

   **Ответ:** Logs потребляют CPU/I/O/storage, создают noise и могут раскрыть secrets. Нужны levels, sampling и bounded queues.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## L2

181. (L2, T) Что такое correlation ID / request ID?

   **Ответ:** ID связывает события одной operation через threads/services. Для retries полезны общий request ID и отдельный attempt ID.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

182. (L2, T) Как логирование помогает в distributed/system-level debugging?

   **Ответ:** Общие IDs и stage events позволяют построить path/timeline между компонентами. Clock skew и missing events учитывают явно.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

183. (L2, D) Как понять по логам порядок событий в многопоточном приложении?

   **Ответ:** Используют thread/task IDs, sequence numbers и explicit synchronization events. Timestamp order не всегда доказывает causal/happens-before order.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

184. (L2, T) Что такое synchronous vs asynchronous logging?

   **Ответ:** Sync logging выполняет output на request path; async помещает records в queue. Async тоже требует bounded memory и overflow policy.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

185. (L2, T) Как логи влияют на latency?

   **Ответ:** Formatting, locks, allocation и output добавляют delay; async queue может block или drop. Измеряют tail latency под реальной verbosity.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

186. (L2, D) Почему verbose logging может скрыть race condition?

   **Ответ:** Logging меняет scheduling и может добавлять synchronization. Исчезновение race при verbose mode — clue, а не исправление.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

187. (L2, P) Как выбирать log level для production?

   **Ответ:** Оставляют actionable operational/error events, подробности включают targeted и временно. У каждой категории должны быть cost/privacy ограничения.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

188. (L2, T) Как логировать исключения и errno-коды?

   **Ответ:** Сохраняют error code/type, operation и safe message. errno читают до других calls; exception messages проверяют на sensitive content.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

189. (L2, P) Какие события обязательно логировать в daemon/service?

   **Ответ:** Полезны startup/config version, readiness, shutdown/reload, dependency failures и resource exhaustion. Per-request logs выбирают по load и debugging needs.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

190. (L2, D) Как коррелировать логи с stack trace и crash timestamp?

   **Ответ:** Связывают instance/build-id, request ID, signal и crash time с clock context. PID без start time/release identity недостаточен.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## L3

191. (L3, T) Как structured logging упрощает автоматический анализ?

   **Ответ:** Fields позволяют queries и grouping без regex по prose. Stable schema также облегчает automated incident correlation.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

192. (L3, T) Как формировать schema логов?

   **Ответ:** Определяют event names, required IDs/types, optional context, schema version и redaction. Cardinality/retention планируют заранее.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

193. (L3, D) Почему логирование может менять timing и маскировать баг?

   **Ответ:** Formatting/I/O/locks меняют timing и allocation. Поэтому измеряют logger overhead и применяют sampling/narrow tracing для timing-sensitive issues.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

194. (L3, D) Как расследовать инцидент, если есть только логи и нет core dump?

   **Ответ:** Строят timeline и проверяемые hypotheses по state transitions, признавая missing memory/history. Добавляют targeted evidence для следующего occurrence.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

195. (L3, S) Как балансировать observability и overhead?

   **Ответ:** Сохраняют high-value events, используют sampling/aggregation и ограниченные queues. Проверяют overhead и diagnostic coverage на representative incident scenarios.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

196. (L3, T) Как логировать безопасно с точки зрения sensitive data?

   **Ответ:** Применяют allowlist fields, redaction, access controls и retention. Не логируют keys, passwords, bearer tokens и необработанный sensitive payload.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

197. (L3, D) Почему логи из нескольких потоков трудно интерпретировать?

   **Ответ:** Physical write order зависит от buffering/scheduling и не обязательно отражает event causality. Thread/task IDs и sequence numbers уменьшают ambiguity.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

198. (L3, P) Какие метаданные полезны для production crash investigation?

   **Ответ:** Нужны build-id/revision, instance/start time, config/dependency versions, signal/PC и correlation IDs. Environment сохраняют без secrets.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

199. (L3, T) Как sampling логов влияет на debugging?

   **Ответ:** Sampling снижает cost, но может потерять редкий causal event. Errors/state transitions и correlated trace sampling требуют отдельной policy.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

200. (L3, S) Как стандартизировать logging policy в команде?

   **Ответ:** Policy задаёт schema, levels, PII/secrets rules, retention, ownership и overflow behavior. Library wrapper помогает обеспечить defaults единообразно.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## L4

201. (L4, S) Как строить logging strategy для high-load C++ сервиса?

   **Ответ:** Используют bounded async pipeline, efficient formatting, per-category sampling и monitoring drops/backlog. Critical diagnostic events должны иметь отдельную loss policy.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

202. (L4, S) Когда логирование нужно дополнять metrics/tracing, а не расширять?

   **Ответ:** Metrics подходят для trends/rates, tracing — для request path/latency; logs — для discrete context. Увеличение verbosity не заменяет missing phase timings.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

203. (L4, D) Как расследовать rare production bug при минимальном допустимом логировании?

   **Ответ:** Добавляют narrow event records, ring buffer/flight recorder, targeted sampling и safe state snapshots. Проверяют privacy и измеряют влияние на timing.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

204. (L4, S) Как проектировать логирование так, чтобы оно помогало post-mortem анализу?

   **Ответ:** Включают build/instance IDs, stage transitions и link к artifacts; crash collector связывает logs/core. Последние buffered records могут не пережить fatal signal.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

205. (L4, S) Как формализовать требования к диагностической информации в production?

   **Ответ:** Для failure classes фиксируют required evidence, overhead budget, retention/access и acceptance drills. Требования проверяют моделированием incidents.

   **Источник:** [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

---

# 10. Practical / Real-world Scenarios

## L2

206. (L2, D) Программа падает с `SIGSEGV`: какие первые 5 шагов расследования?

   **Ответ:** Фиксируют release/scope, сохраняют core/logs, проверяют exact artifacts, изучают fatal thread/PC и все stacks. Затем строят hypotheses и regression reproduction.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

207. (L2, D) Есть core dump, но нет символов: что делать?

   **Ответ:** Ищут matching debug packages/build-id archive. Если их нет, используют symbols/disassembly/maps, отмечая ограничения; чужая сборка может ввести в заблуждение.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [core(5)](https://man7.org/linux/man-pages/man5/core.5.html).

208. (L2, D) Программа зависла, а не упала: как дебажить?

   **Ответ:** Снимают repeated all-thread stacks и syscall/CPU state. Различают deadlock, blocked I/O, busy loop и starvation.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html); [perf-stat(1)](https://man7.org/linux/man-pages/man1/perf-stat.1.html).

209. (L2, D) Утечка памяти растет медленно неделями: какой план анализа?

   **Ответ:** Сравнивают live heap/allocation profiles во времени при известном workload. Отделяют leaks от pools/fragmentation/RSS и сужают растущие allocation stacks.

   **Источник:** [Valgrind: Massif](https://valgrind.org/docs/manual/ms-manual.html); [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

210. (L2, D) После включения `-O2` баг появился, а под GDB исчезает: почему так бывает?

   **Ответ:** Optimization проявляет UB/races, debugger меняет layout/timing. Сохраняют exact optimized build, применяют sanitizers и минимизируют scenario.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

## L3

211. (L3, D) Падение происходит только под нагрузкой и только ночью: как строить расследование?

   **Ответ:** Коррелируют workload, scheduled jobs, resource pressure и config/deploys; сохраняют artifacts/core и временные metrics. Ночное совпадение само по себе не причина.

   **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/); [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/).

212. (L3, D) Crash внутри `std::string`/`malloc`: как понять, что корень проблемы раньше?

   **Ответ:** Проверяют caller ownership, bounds и object lifetime; library могла лишь первой прочитать повреждённое состояние. ASan ищет ранний write/free.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

213. (L3, D) Есть только логи и адрес падения из syslog: как двигаться дальше?

   **Ответ:** Сохраняют release/build-id, fault PC, module mappings и time; нормализуют address для symbolication. Без load bias или exact artifacts вывод ограничен.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

214. (L3, D) Один поток “висит”, остальные ждут: как искать deadlock?

   **Ответ:** Снимают stacks всех threads, определяют held/waited locks и строят wait-for cycle. Проверяют thread, выполняющий I/O/CPU, а не только mutex waits.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html).

215. (L3, D) Sanitizer находит баг, но стек указывает в allocator/runtime: как локализовать исходный код?

   **Ответ:** Читают allocation/free/access stacks первого report, caller input и object lifetime. При missing symbols загружают exact debug artifacts.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Valgrind: Memcheck](https://valgrind.org/docs/manual/mc-manual.html).

## L4

216. (L4, S) Как построить единую стратегию debugging для legacy C/C++ продукта?

   **Ответ:** Нужны reliable artifacts/symbols, crash collection, structured events и staged sanitizer coverage. Начинают с критичных paths и measurable diagnostic gaps.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

217. (L4, S) Как сократить MTTR для production crash'ей в 2–3 раза?

   **Ответ:** Автоматизируют collection/matching/symbolication, triage ownership и runbooks, измеряют текущий MTTR. Конкретное ускорение проверяют на incidents, не обещают заранее.

   **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

218. (L4, S) Какие артефакты должны автоматически сохраняться при падении сервиса?

   **Ответ:** Сохраняют core или registers/maps, build/dependency/config identities и safe logs/time. Secrets в memory требуют restricted access и retention.

   **Источник:** [core(5)](https://man7.org/linux/man-pages/man5/core.5.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

219. (L4, S) Как стандартизировать требования к symbol retention, logging и sanitizer builds?

   **Ответ:** Policy связывает retention с release support, задаёт logging schema/privacy и required sanitizer jobs. Recovery drills проверяют пригодность exact artifacts.

   **Источник:** [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html); [Reproducible Builds Documentation](https://reproducible-builds.org/docs/).

220. (L4, S) Как внедрить культуру доказательного расследования инцидентов, а не “угадывания по логу”?

   **Ответ:** Разделяют факты/гипотезы, требуют предсказаний tests и causal evidence, ведут timeline и review corrective actions. Ошибочные гипотезы фиксируют без поиска виноватых.

   **Источник:** [Google SRE: Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/).

---

