# C/C++ Typical Self-Check & Interview Scenarios (Linux)

105 практических вопросов с ответами для самопроверки: build failures, crashes и работа с binary tools. Ответы задают порядок проверки гипотез; пути, PID и имена executables в командах условные. Linux loader behavior следует отличать от link-time решения и от загрузки plugins через dlopen.

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[D]** — debugging / investigation

* **[P]** — практический подход

* **[S]** — системное мышление / архитектура

---

# 7. Типовые вопросы (для самопроверки)

---

## 7.1 Build

## L1

1. (L1, D) Почему проект может собираться на одной машине и не собираться на другой?

   **Ответ:** Сравнить toolchain, dependencies, flags, generated inputs и environment; повторить clean build в одинаковом image.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

2. (L1, D) Какие первые шаги при ошибке линковки?

   **Ответ:** Сохранить первую ошибку и полную link command; определить undefined/duplicate symbol и проверить его definition через nm.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

3. (L1, D) Что произойдет, если изменить header файл?

   **Ответ:** Пересобираются translation units, зависящие от header, затем affected link targets; корректность требует отслеживания include dependencies.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

4. (L1, P) Как пересобрать проект “с нуля”?

   **Ответ:** Создать новый отдельный build directory: `cmake -S . -B build-clean`, затем `cmake --build build-clean`; старое дерево можно сохранить для сравнения.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

5. (L1, D) Почему иногда помогает `clean build`?

   **Ответ:** Удаляет stale outputs/cache, но не исправляет missing dependency graph; найти причину расхождения incremental и clean builds.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

6. (L1, D) Почему компилятор “не видит” header?

   **Ответ:** Неверный include path/name/case, отсутствующий package/generated header или неправильная conditional configuration.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

7. (L1, D) Почему возникает `undefined reference`?

   **Ответ:** Definition не попала в link, signature/mangling отличается, symbol скрыт либо library/order/as-needed rules исключили нужный объект.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

8. (L1, P) Как понять, какие флаги реально используются при сборке?

   **Ответ:** `cmake --build build --verbose` и compilation database; link flags смотреть в фактической link command.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

9. (L1, D) Почему порядок линковки влияет на результат?

   **Ответ:** При обычном archive linking linker извлекает members для уже известных unresolved references; зависимые archives обычно идут после consumers.

   **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

10. (L1, P) Как быстро проверить, какая версия компилятора используется?

    **Ответ:** `c++ --version` и `command -v c++`; wrapper и CMake cache могут выбирать другой compiler.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)


## L2

11. (L2, D) Почему проект собирается локально, но падает в CI?

    **Ответ:** Сравнить exact source/commit, compiler image, dependencies, options и workspace state; локально использовать clean CI environment.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

12. (L2, D) Почему после изменения одного header пересобирается почти весь проект?

    **Ответ:** Header находится высоко в include graph; проверить dependency fan-out и необходимость публичных includes.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

13. (L2, D) Почему incremental build иногда работает некорректно?

    **Ответ:** Не описаны generated outputs/inputs, неверны timestamps или stale cache; compare clean build и actual dependency graph.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

14. (L2, D) Почему разные версии компилятора дают разные ошибки?

    **Ответ:** Меняются standard support, diagnostics, defaults и optimization; разделить изменение warning policy и реальный compile defect.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

15. (L2, D) Как понять, какая библиотека реально используется при линковке?

    **Ответ:** Linker trace `-Wl,-t`, verbose link command и link map показывают inputs; runtime resolution проверяется отдельно.

    **Пример:** Для GCC/Clang driver с совместимым GNU-style linker добавить `-Wl,-t` к сохранённой link command. Для уже работающего процесса на Linux посмотреть `/proc/PID/maps`: link-time path и runtime-loaded path могут различаться.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

16. (L2, P) Как уменьшить время сборки без изменения архитектуры проекта?

    **Ответ:** Измерить critical path, настроить разумный parallelism, compiler cache и убрать лишние rebuilds; PCH проверять измерением.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

17. (L2, D) Почему сборка зависит от порядка include'ов?

    **Ответ:** Headers не self-contained, зависят от чужих declarations/macros или имеют order-sensitive definitions; тестировать header отдельно.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

18. (L2, D) Как понять, что проблема в ABI, а не в API?

    **Ответ:** Source компилируется, но binary contract отличается: symbols, layouts, calling convention/runtime; проверить точные build settings сторон.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

19. (L2, D) Почему бинарь падает сразу после запуска, хотя сборка прошла?

    **Ответ:** Loader/dependency failure, unsupported CPU instruction, static initialization bug или UB; сначала сохранить stderr и exit signal.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

20. (L2, P) Как воспроизвести CI сборку локально?

    **Ответ:** Взять exact image/toolchain/commit, dependency locks, commands и inputs; сохранять те же resource constraints где существенны.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)


## L3

21. (L3, D) Почему бинарь работает на одной машине и падает на другой?

    **Ответ:** Проверить architecture/ISA, loader/libc versions, runtime libraries, config и UB; сравнить hashes binaries и mappings.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

22. (L3, D) Как диагностировать mismatch зависимостей (system vs vendored)?

    **Ответ:** Сопоставить include search paths, compile commands, linker trace и runtime mappings; headers и loaded .so должны соответствовать.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

23. (L3, D) Почему после обновления библиотеки появляется crash без изменений кода?

    **Ответ:** Изменились ABI/semantics, dependency resolution или проявился latent UB; проверить release contract и matching symbols.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

24. (L3, D) Как найти источник symbol conflict?

    **Ответ:** `nm -A -C` по object/archive и `readelf --dyn-syms` для shared libs; затем linker map/trace для выбранной definition.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

25. (L3, D) Почему сборка нестабильна при parallel build?

    **Ответ:** Недостающие dependencies между generators/consumers, общие output paths или resource exhaustion; serial success не доказывает correctness graph.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

26. (L3, P) Как уменьшить build time в 2–3 раза в большом проекте?

    **Ответ:** Сначала измерить configure/compile/link; затем убрать repeated work, включить cache/PCH и оптимизировать critical path. Гарантировать 2–3× заранее нельзя.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

27. (L3, D) Как понять, что проблема в toolchain, а не в коде?

    **Ответ:** Минимальный корректный reproducer, согласованные flags и сравнение supported versions; исключить UB и dependency mismatch до compiler bug claim.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

28. (L3, D) Почему debug и release сборки ведут себя по-разному?

    **Ответ:** Оптимизация, asserts, initialization и macros различаются; искать UB, races и побочные эффекты внутри assert.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

29. (L3, P) Как анализировать compile_commands.json для расследования проблем?

    **Ответ:** Найти запись affected TU, сравнить directory, compiler, includes, macros и flags; link stage database обычно не описывает.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

30. (L3, D) Как найти hidden dependency, из-за которой билд “магически” работает?

    **Ответ:** Собрать в чистом окружении без лишних packages/network, сравнить accessed files и declared inputs; добавить missing dependency явно.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)


## L4

31. (L4, S) Как построить reproducible build pipeline?

    **Ответ:** Pinned inputs/toolchain, controlled paths/time/locale и clean independent rebuild; hashes и diffoscope проверяют bitwise reproducibility.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

32. (L4, S) Как стандартизировать toolchain в команде?

    **Ответ:** Versioned presets/toolchain images, lockfiles, единые bootstrap commands и staged upgrades с compatibility matrix.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

33. (L4, D) Как расследовать нестабильные build failures на CI?

    **Ответ:** Сохранить source/image IDs, commands/logs, resource pressure и cache status; классифицировать infra, graph race и product failure.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

34. (L4, S) Как уменьшить build time в 10x на уровне архитектуры?

    **Ответ:** Снизить dependency fan-out, разделить modules/targets, isolate generated work и использовать distributed/cache builds; выигрыш доказывать по critical path.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)

35. (L4, S) Как проектировать build system для large-scale C++ продукта?

    **Ответ:** Явный dependency graph, target contracts, supported toolchains и configs, reproducibility и наблюдаемость build time/failures.

    **Источник:** [CMake documentation](https://cmake.org/cmake/help/latest/); [GNU ld](https://sourceware.org/binutils/docs/ld/)


    ---

## 7.2 Debug

## L1

36. (L1, D) Как найти memory leak на базовом уровне?

    **Ответ:** Запустить ASan/LSan либо `valgrind --leak-check=full ./app`; различать lost allocations и intentionally retained reachable memory.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

37. (L1, D) Что делать, если программа падает с `SIGSEGV`?

    **Ответ:** Собрать core или запустить GDB, определить fault instruction/address и object lifetime; SIGSEGV сообщает место проявления, не обязательно причины.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

38. (L1, D) Как получить stack trace?

    **Ответ:** В GDB `bt` для текущего thread и `thread apply all bt` для всех; нужны matching binaries/debug information.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

39. (L1, P) Как запустить программу под отладчиком?

    **Ответ:** `gdb --args ./app argument`, затем `run`; после остановки проверить stack, locals и arguments.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

40. (L1, D) Почему программа “иногда падает”?

    **Ответ:** Возможны inputs, UB, races, lifetime и external failures; фиксировать build, workload и diagnostics вместо случайной правки timing.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

41. (L1, D) Что делать, если нет core dump?

    **Ответ:** Проверить core limits, core_pattern, dumpability, service settings и storage; на systemd проверить `coredumpctl`.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

42. (L1, D) Как понять, где произошел crash?

    **Ответ:** По crashing thread, instruction, fault address и matching symbols; посмотреть callers и предшествующую corruption.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

43. (L1, P) Какие первые команды в GDB после падения?

    **Ответ:** `bt`, `info threads`, `thread apply all bt`, `frame 0`, `info locals`; optimized locals могут быть недоступны.

    **Пример:**

    ```text
    gdb /artifacts/app /artifacts/core
    (gdb) info files
    (gdb) info threads
    (gdb) thread apply all bt
    (gdb) frame 0
    (gdb) info registers
    ```

    Пути условные; executable и shared libraries берут из того же release, что сформировал core.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

44. (L1, D) Почему debug build работает, а release — нет?

    **Ответ:** Оптимизация проявила UB/race либо отличаются defines/assertions; сравнить configs и запустить sanitizer build с релевантной optimization.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

45. (L1, D) Как найти null pointer dereference?

    **Ответ:** ASan/UBSan report или GDB fault instruction с registers; проверить, действительно ли base pointer NULL и откуда он пришёл.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)


## L2

46. (L2, D) Как найти memory leak в production?

    **Ответ:** Собирать bounded heap samples и RSS/live trends; воспроизвести workload на стенде и проверить ownership крупнейших retained objects.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

47. (L2, D) Что делать, если crash без stack trace?

    **Ответ:** Нужны core, matching build ID/symbols и mappings; при повреждённом stack анализировать registers/disassembly и memory history.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

48. (L2, D) Как дебажить зависание (deadlock)?

    **Ответ:** Снять все thread stacks, построить wait-for graph и определить owners; не все зависания являются deadlock.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

49. (L2, D) Почему программа зависает без CPU usage?

    **Ответ:** Возможны I/O wait, condition wait, exhausted queue protocol или deadlock; inspect thread states и blocking calls.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

50. (L2, D) Как найти use-after-free?

    **Ответ:** Сборка `-fsanitize=address -g` с instrumentation при compile/link, затем воспроизвести workload и изучить allocation/free/access stacks.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

51. (L2, D) Почему sanitizer ловит баг, а без него программа “работает”?

    **Ответ:** Sanitizer проверяет нарушения до видимого crash и меняет layout/timing; отсутствие crash без него не делает UB допустимым.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

52. (L2, D) Как расследовать intermittent crash?

    **Ответ:** Группировать по stack/build/workload, сохранять cores и seeds, добавлять targeted diagnostics и минимизировать reproducer.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

53. (L2, D) Как анализировать core dump?

    **Ответ:** `gdb /path/to/exact-app /path/to/core`; загрузить matching shared libs/symbols и проверить все threads.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

54. (L2, D) Почему stack trace может быть некорректным?

    **Ответ:** Stack corruption, неправильный executable, отсутствующий unwind info, inlining/tail calls или ошибка unwinder.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

55. (L2, P) Как использовать Valgrind или ASan в расследовании?

    **Ответ:** ASan требует пересборки, Valgrind обычно запускает существующий binary; выбрать инструмент по классу дефекта и overhead.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)


## L3

56. (L3, D) Как расследовать crash в production без возможности воспроизвести локально?

    **Ответ:** Сохранить exact artifact/symbols, core, config и input metadata; сопоставить reports и воспроизводить минимальные подозрительные paths.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

57. (L3, D) Как понять, что ошибка произошла задолго до crash?

    **Ответ:** Faulting object уже повреждён; ASan или hardware watchpoint на известное поле может поймать более раннюю неверную запись.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

58. (L3, D) Как дебажить multithreaded race condition?

    **Ответ:** Отдельная TSan build, проверка happens-before/lifetime и управляемый stress; debugger меняет scheduling.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

59. (L3, D) Как отличить memory corruption от логической ошибки?

    **Ответ:** Проверить bounds/lifetime reports и invariants; логический дефект может существовать без memory violation, а corruption имитирует неверную логику.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

60. (L3, D) Почему баг исчезает под отладчиком?

    **Ответ:** Меняются scheduling, heap layout, speed и resource timing; использовать менее intrusive diagnostics и сохранять uncontrolled evidence.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

61. (L3, D) Как анализировать core dump с stripped бинарем?

    **Ответ:** Найти separate debug symbols по build ID и matching libraries; symbols другой сборки могут дать убедительный, но ложный stack.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

62. (L3, D) Как найти источник deadlock в большом коде?

    **Ответ:** Граф locks/resources/owners и все thread stacks; проверить join/callback/I/O под lock и lock-order inversion.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

63. (L3, D) Как расследовать rare bug, который возникает раз в неделю?

    **Ответ:** Постоянный сбор bounded context, generation IDs и invariant checks; сравнивать incidents по signature и усиливать targeted diagnostics.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

64. (L3, D) Как интерпретировать sanitizer report правильно?

    **Ответ:** Начать с типа ошибки и первой invalid operation, затем access/allocation/free stacks и lifetime; не лечить только последнюю строку stack.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

65. (L3, D) Как доказать root cause, а не просто “подозрение”?

    **Ответ:** Показать нарушение invariant, минимальный сценарий и причинное исправление; regression test должен падать до fix и проходить после.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)


## L4

66. (L4, S) Как построить debugging strategy для production системы?

    **Ответ:** Retention exact binaries/symbols, crash capture, structured context и runbooks; регулярные drills проверяют пригодность артефактов.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

67. (L4, S) Какие артефакты нужно собирать при crash?

    **Ответ:** Core, executable/libraries hashes, symbols, config, input/request IDs, logs, resource state и exit signal/time.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

68. (L4, D) Как triage'ить большое количество crash reports?

    **Ответ:** Дедупликация по normalized signature/build и impact; разные top frames могут иметь один root cause.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

69. (L4, S) Как уменьшить MTTR (mean time to resolution)?

    **Ответ:** Автоматизировать capture/symbolization и routing к owner, иметь reproduction scripts и проверенные runbooks.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)

70. (L4, S) Как внедрить культуру доказательного debugging в команде?

    **Ответ:** Разделять факт, гипотезу и эксперимент; сохранять evidence и формулировать fix через нарушенный invariant.

    **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)


    ---

## 7.3 Tools

## L1

71. (L1, P) Как понять, какая библиотека реально подлинкована?

    **Ответ:** Link-time inputs смотреть linker trace/map; runtime loaded libraries — mappings процесса или loader diagnostics.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

72. (L1, P) Как посмотреть зависимости бинаря?

    **Ответ:** `readelf -d ./app` показывает DT_NEEDED; `ldd` использовать только для доверенного binary и помнить о runtime environment.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

73. (L1, P) Как посмотреть symbols?

    **Ответ:** `nm -C ./app` для обычных symbols, `nm -D -C lib.so` для dynamic; stripped tables могут отсутствовать.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

74. (L1, P) Как проверить, что бинарь debug или release?

    **Ответ:** У ELF нет универсального debug/release bit; inspect sections/debug info и build manifest, наличие -g не исключает optimization.

    **Типичная ошибка:** Увидеть `.debug_info` и объявить binary неoptimized. Production executable может одновременно иметь `-O2` и `-g`.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

75. (L1, D) Почему бинарь не запускается?

    **Ответ:** Проверить permissions, ELF architecture/interpreter, dependencies и error message; ENOENT может означать отсутствие interpreter.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

76. (L1, P) Как посмотреть версию компилятора?

    **Ответ:** `gcc --version`/`clang --version`; проверить путь executable и compiler в CMake cache/build logs.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

77. (L1, P) Как найти путь до библиотеки в системе?

    **Ответ:** Loader cache через `ldconfig -p`, package metadata и filesystem paths; путь найденного файла не доказывает runtime selection.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

78. (L1, D) Почему программа не видит `.so`?

    **Ответ:** Неверный RUNPATH/search policy, отсутствующая transitive dependency, architecture mismatch или permissions; читать loader error.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

79. (L1, P) Как посмотреть environment variables?

    **Ответ:** Проверять только нужные variables, например PATH и compiler settings; полный env может содержать secrets и не должен попадать в logs.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

80. (L1, D) Почему разные машины дают разное поведение?

    **Ответ:** Иные dependencies, CPU/OS, config, filesystem и scheduler; одинаковый source не означает одинаковый binary/environment.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)


## L2

81. (L2, D) Как понять, какая версия библиотеки используется на runtime?

    **Ответ:** Посмотреть `/proc/PID/maps`, loaded library build IDs и package/version metadata; SONAME часто недостаточен для точной версии.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

82. (L2, D) Как анализировать ELF бинарник?

    **Ответ:** `readelf -h -l -S -d -n ./app` для headers/segments/sections/dependencies/build ID, затем symbols и disassembly.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

83. (L2, D) Как понять, почему не линкуется?

    **Ответ:** Полная link command, первая undefined/duplicate ошибка, definitions через nm и ordering/visibility/ABI checks.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

84. (L2, D) Как понять, почему не находится symbol?

    **Ответ:** Проверить exact mangled name, dynamic visibility, version, lookup scope и выбранную library; для dlsym использовать dlerror.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

85. (L2, P) Как использовать `nm`, `readelf`, `objdump` для расследования?

    **Ответ:** Nm находит definitions/references, readelf объясняет ELF metadata, objdump показывает инструкции и relocations; связать по адресам/build ID.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

86. (L2, D) Как найти проблему в dynamic linking?

    **Ответ:** Inspect DT_NEEDED/RUNPATH, actual mappings и `LD_DEBUG=libs,bindings` в контролируемом воспроизведении; special loader modes могут игнорировать env.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

87. (L2, D) Почему `ldd` показывает не то, что ожидалось?

    **Ответ:** Ldd отражает текущее loader environment и filesystem, а не compile-time выбор и не все будущие dlopen modules.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

88. (L2, D) Как воспроизвести баг из CI локально?

    **Ответ:** Повторить exact commit/image/commands/dependencies и seed; воспроизвести resource limits и concurrency, если они существенны.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

89. (L2, D) Почему toolchain влияет на runtime поведение?

    **Ответ:** Меняет codegen, ABI/runtime и optimization assumptions; latent UB часто проявляется после смены compiler.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

90. (L2, P) Как анализировать compile flags проекта?

    **Ответ:** Compilation database плюс verbose build/link logs; сравнивать effective flags, definitions и per-target options.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)


## L3

91. (L3, D) Как понять, какой именно symbol используется при конфликте?

    **Ответ:** Link map/trace для static linking, loader bindings и relocation inspection для dynamic; проверить interposition/symbol versions.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

92. (L3, D) Как диагностировать ABI mismatch через tools?

    **Ответ:** Сравнить exported names/versions, ELF ABI metadata, headers/layout и build settings; tool output без contract не доказывает совместимость.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

93. (L3, D) Почему бинарь использует “не ту” библиотеку?

    **Ответ:** Search order, RUNPATH, LD_LIBRARY_PATH, loader cache или dlopen path выбирают другой файл; подтвердить actual mappings.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

94. (L3, D) Как анализировать поведение dynamic loader?

    **Ответ:** В контролируемом запуске `LD_DEBUG=libs,versions ./app` и readelf metadata; сохранить resolved paths и ошибки relocations.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

95. (L3, D) Как tools помогают в расследовании performance проблем?

    **Ответ:** Perf локализует CPU costs, tracing — waits/queues, binary tools связывают addresses с конкретной сборкой.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

96. (L3, D) Как найти hidden dependency через tooling?

    **Ответ:** Сопоставить file access trace и declared inputs в clean environment; distinguish build-time и runtime dependencies.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

97. (L3, D) Как связать данные из `perf`, `gdb`, `readelf` в одну картину?

    **Ответ:** Build ID связывает profile/core с ELF; mappings и offsets позволяют корректно symbolicate, затем проверить исходный invariant.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

98. (L3, D) Как расследовать баг, связанный с загрузкой `.so`?

    **Ответ:** Зафиксировать library path/hash, loader errors, exports, API version и lifecycle; separate load failure от crash после вызова.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

99. (L3, D) Почему бинарь ведет себя по-разному при одинаковом коде?

    **Ответ:** Могут различаться flags, deps, generated code, inputs, scheduling и UB manifestations; сравнить artifacts прежде исходных предположений.

    **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

100. (L3, P) Как построить reproducible debugging environment?

     **Ответ:** Хранить exact image/sysroot, binaries/symbols и replayable inputs; документировать команды и ограничения reproduction.

     **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)


## L4

101. (L4, S) Как стандартизировать набор tooling в команде?

     **Ответ:** Выбрать maintained tools по defect classes, pinned versions и общие scripts; owners отвечают за updates и документацию.

     **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

102. (L4, S) Как обучать инженеров эффективно использовать low-level tools?

     **Ответ:** Практические расследования с raw artifacts и проверяемыми гипотезами; учить ограничениям инструмента, а не только командам.

     **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

103. (L4, D) Как расследовать сложный инцидент, комбинируя разные инструменты?

     **Ответ:** Сначала timeline и symptom, затем минимальный набор tools для конкретных гипотез; коррелировать по build IDs, времени и request IDs.

     **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

104. (L4, S) Как выбрать минимальный, но достаточный стек tooling?

     **Ответ:** Compiler diagnostics, debugger/core capture, sanitizer, profiler и binary tools обычно покрывают основу; расширять по реальным пробелам.

     **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)

105. (L4, S) Как построить инженерный workflow: build → debug → profile → fix → verify?

     **Ответ:** Зафиксировать воспроизводимую сборку и symptom, локализовать причину, внести минимальный fix, проверить correctness и измеренный эффект.

     **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/)


     ---
