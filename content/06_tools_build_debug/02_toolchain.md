# C/C++ Toolchain & Tooling Question Bank (Linux)

## Legend

* **L1** — базовый

* **L2** — middle

* **L3** — senior

* **L4** — staff

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging

* **[S]** — system design

---

# 2. Toolchain & Tooling

---

## 2.1 Компиляторы (GCC / Clang)

## L1

1. (L1, T) Что такое компилятор?

   **Ответ:** Компилятор переводит исходную программу в машинный код или промежуточное представление, проверяя синтаксис, семантику и применяя допустимые оптимизации.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

2. (L1, T) Разница между GCC и Clang?

   **Ответ:** GCC использует собственные GIMPLE/RTL и backends; Clang — C-family frontend поверх LLVM. Диагностика, platforms и оптимизации различаются по версиям.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [Clang: User Manual](https://clang.llvm.org/docs/UsersManual.html).

3. (L1, T) Что делает флаг `-O0`?

   **Ответ:** `-O0` отключает большинство оптимизаций, облегчая сопоставление исполнения с исходником. Это не отключает все преобразования и не устраняет UB.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

4. (L1, T) Что делает `-g`?

   **Ответ:** `-g` генерирует отладочную информацию. Оптимизация задаётся отдельно: `-O2 -g` допустима и полезна для production diagnosis.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

5. (L1, T) Что делают `-Wall` и `-Wextra`?

   **Ответ:** Они включают два набора диагностик, но не все существующие warnings. Конкретный набор зависит от compiler/version и language mode.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

6. (L1, P) Как скомпилировать программу с warning'ами?

   **Ответ:** Например: `g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app`. Предупреждения анализируют, а не подавляют целиком.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

7. (L1, T) Что делает `-Werror`?

   **Ответ:** `-Werror` превращает предупреждения в ошибки сборки. Политику применяют с учётом стороннего кода и новых warnings после upgrade.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

8. (L1, T) Что такое undefined behavior (UB)?

   **Ответ:** UB — поведение, для которого язык не задаёт требований. Компилятор не обязан диагностировать его или сохранять ожидаемое выполнение.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [LLVM: Language Reference](https://llvm.org/docs/LangRef.html).

9. (L1, T) Пример UB в C++?

   **Ответ:** Примеры: обращение за границу массива, signed overflow и use-after-free. Наблюдаемый «правильный» результат не делает такой код корректным.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html).

10. (L1, P) Как включить debug сборку?

   **Ответ:** Например, `g++ -g -Og main.cpp -o app`; в CMake — configuration Debug, содержание которой зависит от toolchain. Проверяют реальные compile commands.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [CMake Buildsystem](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html).

## L2

11. (L2, T) Разница `-O2` vs `-O3`?

   **Ответ:** `-O3` включает дополнительные преобразования, например более агрессивные loop optimizations. Рост code size и register pressure может ухудшить результат; нужен benchmark.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

12. (L2, T) Почему оптимизации могут менять поведение программы?

   **Ответ:** Для корректного кода сохраняется предусмотренная semantics в выбранном режиме. Различия часто обнаруживают UB, timing dependencies или явно ослабленные floating-point guarantees.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

13. (L2, T) Что делает `-fno-omit-frame-pointer`?

   **Ответ:** Флаг просит сохранять frame pointer для более простого unwinding. Он не гарантирует frame pointer абсолютно во всех функциях и architectures.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

14. (L2, P) Как включить все warning'и и сделать их ошибками?

   **Ответ:** Обычно используют `-Wall -Wextra -Wpedantic -Werror`, но это не «все warnings». Набор дополнительных diagnostics подбирают для проекта.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

15. (L2, T) Что такое strict aliasing?

   **Ответ:** Правила aliasing ограничивают доступ к объекту через несовместимые types. Оптимизатор может считать некоторые pointers неуказывающими на одну память; для representation используют корректные операции.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

16. (L2, D) Почему код работает на `-O0`, но ломается на `-O2`?

   **Ответ:** Сначала проверяют UB, uninitialized data, races и assumptions о timing. Затем сохраняют команды и минимизируют воспроизводимый пример до обвинения compiler.

   **Источник:** [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html); [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

17. (L2, T) Как компилятор использует UB для оптимизаций?

   **Ответ:** Он предполагает отсутствие UB в корректном execution и удаляет недостижимые при этом paths. Например, signed overflow нельзя использовать как универсальную проверку переполнения.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

18. (L2, T) Что такое inline и как влияет `-O`?

   **Ответ:** `inline` прежде всего влияет на ODR/linkage semantics; подстановка тела — решение оптимизатора. `-O` меняет эвристику, но не гарантирует inlining.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

19. (L2, P) Как вывести assembly (`-S`)?

   **Ответ:** `g++ -O2 -S main.cpp -o main.s`; для x86 можно добавить `-masm=intel`. Это compile output до обычной финальной линковки.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

20. (L2, P) Как посмотреть оптимизации?

   **Ответ:** В GCC используют `-fopt-info` и dumps; Clang поддерживает optimization remarks `-Rpass`, `-Rpass-missed`. ASM показывает итог, remarks — часть решений.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [Clang: User Manual](https://clang.llvm.org/docs/UsersManual.html).

## L3

21. (L3, T) Архитектурные различия GCC vs Clang?

   **Ответ:** GCC применяет GIMPLE и RTL passes; Clang строит LLVM IR и использует LLVM optimization/codegen infrastructure. Общая frontend/backend идея одинакова.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [LLVM: Language Reference](https://llvm.org/docs/LangRef.html).

22. (L3, T) Что такое LLVM?

   **Ответ:** LLVM — infrastructure для compiler IR, анализа, optimization и code generation. Clang является одним из frontends, а не синонимом всего LLVM.

   **Источник:** [LLVM: Language Reference](https://llvm.org/docs/LangRef.html).

23. (L3, T) Как работают passes оптимизации?

   **Ответ:** Pass анализирует или преобразует IR, сохраняя необходимые invariants. Порядок и повторение passes влияют на доступные оптимизации и compile cost.

   **Источник:** [LLVM: Language Reference](https://llvm.org/docs/LangRef.html).

24. (L3, T) Что такое vectorization?

   **Ответ:** Vectorization заменяет подходящие scalar operations на SIMD. Нужны допустимые dependencies/aliasing и выгодная cost model; support CPU сам по себе недостаточен.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

25. (L3, T) Что делает `-march`?

   **Ответ:** `-march` задаёт целевую ISA и разрешённые инструкции. Бинарь может перестать работать на CPU без этих features; `-mtune` имеет другую цель.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

26. (L3, P) Как сгенерировать оптимизированный код под конкретный CPU?

   **Ответ:** Для локального CPU: `g++ -O2 -march=native ...`. Для распространения задают поддерживаемый baseline либо dispatch, иначе возможен SIGILL.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

27. (L3, D) Почему бинарь работает медленно на другой машине?

   **Ответ:** Сравнивают CPU features, frequency, memory/NUMA, workload и dependencies. Настройка под один CPU не гарантирует оптимальность или совместимость другого.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html).

28. (L3, T) Что такое LTO?

   **Ответ:** LTO переносит часть optimization на этап link, позволяя анализировать несколько translation units вместе. Нужны совместимые compiler/linker tooling.

   **Источник:** [LLVM: Link Time Optimization](https://llvm.org/docs/LinkTimeOptimization.html).

29. (L3, P) Как включить LTO?

   **Ответ:** GCC: `-flto` при compile и final link через compiler driver. В CMake используют IPO property после проверки support.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [CMake Buildsystem](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html).

30. (L3, D) Почему LTO ломает билд?

   **Ответ:** Возможны несовместимые IR/plugins, tool versions, ODR violations, RAM exhaustion и incorrect flags. Сохраняют exact linker error и toolchain provenance.

   **Источник:** [LLVM: Link Time Optimization](https://llvm.org/docs/LinkTimeOptimization.html).

## L4

31. (L4, T) Как компилятор использует UB для aggressive optimization?

   **Ответ:** Предположение корректности позволяет value-range, alias и reachability transformations. Если программа содержит UB, её исходная «логика» не ограничивает optimizer обычным образом.

   **Источник:** [LLVM: Language Reference](https://llvm.org/docs/LangRef.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

32. (L4, T) Что такое IPO (interprocedural optimization)?

   **Ответ:** IPO анализирует взаимодействие функций: inlining, constant propagation, dead-code removal и другие transformations через function boundaries. LTO расширяет доступную область анализа.

   **Источник:** [LLVM: Link Time Optimization](https://llvm.org/docs/LinkTimeOptimization.html).

33. (L4, S) Когда стоит писать собственные compile flags policy?

   **Ответ:** Политика нужна при нескольких targets/toolchains и общих требованиях к warnings, ISA, debug info и hardening. Применяют target-based settings с проверяемыми исключениями.

   **Источник:** [CMake Buildsystem](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html).

34. (L4, D) Как диагностировать miscompilation?

   **Ответ:** Фиксируют compiler/flags/input, исключают UB, уменьшают testcase и сравнивают outputs/IR между versions. Отчёт должен содержать воспроизводимый корректный пример.

   **Источник:** [Clang: User Manual](https://clang.llvm.org/docs/UsersManual.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

35. (L4, S) Как стандартизировать toolchain в компании?

   **Ответ:** Фиксируют compiler/linker/sysroot/dependencies, profiles и supported targets. CI проверяет единые presets и управляемый upgrade с rollback.

   **Источник:** [Reproducible Builds Documentation](https://reproducible-builds.org/docs/); [CMake: Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html).

---

## 2.2 Линковка

## L1

36. (L1, T) Что такое линковка?

   **Ответ:** Линковка объединяет object files и libraries, разрешает symbols и relocations и создаёт executable/shared object по заданным правилам.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

37. (L1, T) Что такое `.a` и `.so`?

   **Ответ:** `.a` обычно архив object files; `.so` — ELF shared object, загружаемый runtime loader. Расширение само по себе формат не доказывает.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

38. (L1, T) Что такое static vs shared?

   **Ответ:** Static linking включает нужный code из archives в результат; shared linking оставляет runtime dependencies. Это меняет deployment и symbol resolution.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

39. (L1, T) Что такое symbol?

   **Ответ:** Symbol — именованная сущность object format с attributes, например функция/объект, определённая или требуемая этим файлом.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

40. (L1, P) Как слинковать библиотеку вручную?

   **Ответ:** Например: `g++ main.o -L./lib -lfoo -o app`. Для обычных static archives порядок относительно referencing objects важен.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

## L2

41. (L2, T) Что такое symbol visibility?

   **Ответ:** Visibility определяет доступность symbol вне shared object и возможности preemption. Это отличается от C++ access modifiers.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

42. (L2, T) Что делает `-fvisibility=hidden`?

   **Ответ:** Default visibility становится hidden для применимых declarations; public ABI exports отмечают явно. Это уменьшает dynamic symbol surface, но не удаляет весь code автоматически.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

43. (L2, T) Что такое multiple definition?

   **Ответ:** Linker обнаружил конфликтующие strong definitions одного symbol. Возможны ODR violations, повторная передача objects или definitions в header без нужной semantics.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

44. (L2, D) Как возникает multiple definition?

   **Ответ:** Например, non-inline external function определена в header и попала в несколько translation units. Исправляют ownership definition, а не скрывают error linker flag.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

45. (L2, T) Что такое rpath?

   **Ответ:** DT_RPATH — ELF metadata с runtime search paths старого типа. GNU loader использует её при отсутствии RUNPATH с собственными precedence/transitivity rules.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

46. (L2, T) Что такое runpath?

   **Ответ:** DT_RUNPATH задаёт runtime paths для прямых dependencies данного object. В отличие от RPATH, не распространяется автоматически на всё дерево dependencies.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

47. (L2, P) Как задать rpath?

   **Ответ:** Например, GNU linker: `-Wl,-rpath,'$ORIGIN/../lib'`. Современные new-dtags обычно создают RUNPATH; результат проверяют `readelf -d`.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GNU ld](https://sourceware.org/binutils/docs/ld/).

48. (L2, D) Почему `.so` не находится при запуске?

   **Ответ:** Проверяют DT_NEEDED, effective RPATH/RUNPATH, loader cache, permissions и architecture. `LD_DEBUG=libs ./app` помогает увидеть поиск в glibc.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

49. (L2, T) Как linker выбирает символ?

   **Ответ:** На static link учитывают strong/weak definitions, archive extraction/order и linker rules. Runtime resolution дополнительно зависит от loader scopes, visibility и versions.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

## L3

50. (L3, T) Разница rpath vs runpath?

   **Ответ:** Для glibc RPATH при отсутствии RUNPATH имеет иной precedence и transitive behavior; RUNPATH обычно после LD_LIBRARY_PATH и действует на direct dependencies. Secure-execution накладывает ограничения.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

51. (L3, T) Что такое symbol interposition?

   **Ответ:** Interposition позволяет одному definition перехватить reference к symbol другого object, например через LD_PRELOAD. Visibility, binding и loader scope могут этому препятствовать.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

52. (L3, T) Что такое visibility default/hidden?

   **Ответ:** Default symbol участвует в внешнем dynamic lookup по ABI rules; hidden не экспортирует такую доступность. Это помогает отделить public API от implementation.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html); [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html).

53. (L3, P) Как уменьшить exported symbols?

   **Ответ:** Используют `-fvisibility=hidden`, explicit export annotations и linker version script. Проверяют dynamic symbols через `nm -D --defined-only`.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [GNU ld](https://sourceware.org/binutils/docs/ld/); [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

54. (L3, D) Почему конфликтуют символы из разных библиотек?

   **Ответ:** Libraries могут экспортировать одинаковые имена или иметь несовместимые definitions. Проверяют lookup order, versions и ABI; одинаковое имя не гарантирует одинаковую semantics.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

55. (L3, D) Как найти дубликаты символов?

   **Ответ:** `nm -A -C --defined-only *.o libfoo.a` показывает definitions с файлами. Для dynamic exports используют `nm -D` и анализируют actual link inputs.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

56. (L3, T) Что такое versioned symbols?

   **Ответ:** ELF symbol versioning связывает symbol с version node и позволяет различать ABI generations. Это не заменяет совместимость data layout и contracts.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/).

57. (L3, P) Как управлять export map?

   **Ответ:** GNU ld получает script через `-Wl,--version-script=exports.map`; в нём задают global/local patterns. После link проверяют exported/versioned symbols.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/).

## L4

58. (L4, S) Как проектировать shared library API?

   **Ответ:** Экспортируют небольшой стабильный интерфейс, фиксируют ownership/error contracts и versioning. Не раскрывают нестабильные STL layouts между несогласованными toolchains.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

59. (L4, D) Как диагностировать runtime symbol clash?

   **Ответ:** Сопоставляют `readelf`/`nm -D`, loaded mappings и glibc `LD_DEBUG=bindings,versions`. Проверяют symbol provider и ABI именно запущенного процесса.

   **Источник:** [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html); [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

60. (L4, S) Как минимизировать ABI surface?

   **Ответ:** Используют opaque handles/PImpl, hidden internal symbols и узкий C-compatible boundary при необходимости. ABI включает calling convention, types, ownership и exceptions, не только имена.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

---

## 2.3 Binary Tools

## L1

61. (L1, T) Что делает `nm`?

   **Ответ:** nm показывает symbols object/archive и их attributes; `-C` demangles C++ names, `-D` выбирает dynamic table.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

62. (L1, T) Что делает `objdump`?

   **Ответ:** objdump показывает headers, sections, relocations и disassembly. Набор поддерживаемых targets зависит от build инструмента.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

63. (L1, T) Что делает `readelf`?

   **Ответ:** readelf анализирует ELF headers, sections, program headers, symbols, dynamic entries и relocations без необходимости disassemble code.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

64. (L1, P) Как посмотреть symbols?

   **Ответ:** `nm -C app` или `readelf -Ws app`; для доступных dynamic symbols — `nm -D -C libfoo.so`.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

65. (L1, P) Как посмотреть секции бинаря?

   **Ответ:** `readelf -S app` показывает sections; `readelf -l app` — segments, используемые loader. Их назначение и гранулярность различаются.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

## L2

66. (L2, T) Как читать output `nm`?

   **Ответ:** Читают address/value, symbol class и name; register/name mangling и table type учитывают отдельно. Upper/lowercase часто различает global/local binding.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

67. (L2, T) Что означают символы `T`, `U`, `D`?

   **Ответ:** В обычном nm `T` — definition в text/code, `U` — undefined reference, `D` — initialized writable data. Конкретный format зависит от target.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

68. (L2, P) Как найти undefined symbols?

   **Ответ:** `nm -u -C main.o` показывает unresolved references object. В shared object unresolved imports часто штатны и разрешаются runtime loader.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

69. (L2, P) Как посмотреть зависимости ELF?

   **Ответ:** `readelf -d app` показывает DT_NEEDED и search-path metadata. Это прямые заявленные dependencies, не полный снимок реально загруженных plugins.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

70. (L2, D) Как понять, почему не линкуется?

   **Ответ:** Сохраняют полную link command и error, ищут требуемый symbol и provider, проверяют archive order, ABI/mangling и missing dependencies.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

## L3

71. (L3, T) Как читать relocation entries?

   **Ответ:** Relocation задаёт место patch, symbol, type и возможный addend. Формулу вычисления берут из ABI конкретной architecture.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

72. (L3, P) Как использовать `objdump -d`?

   **Ответ:** `objdump -d -C app` disassembles executable sections; `-S` может сопоставить source при наличии debug info. Для PIE учитывают runtime load bias.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

73. (L3, P) Как анализировать PLT/GOT?

   **Ответ:** Смотрят dynamic relocations `readelf -r`, dynamic symbols и disassembly stubs. PLT/GOT поддерживают indirect addressing/binding, детали architecture-specific.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html); [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

74. (L3, D) Как понять, какой символ берется?

   **Ответ:** На link помогают map/trace-symbol, на runtime — `LD_DEBUG=bindings` в glibc и loaded mappings. Требуется различать static selection и dynamic lookup.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

75. (L3, T) Что такое stripping symbols?

   **Ответ:** Stripping удаляет selected symbols/debug sections, уменьшая binary и затрудняя diagnosis. Dynamic linking metadata, необходимая execution, сохраняется в соответствующем режиме.

   **Источник:** [GNU Binutils](https://sourceware.org/binutils/docs/binutils/).

## L4

76. (L4, D) Как reverse engineer crash через ELF?

   **Ответ:** Определяют build-id/architecture/load bias, symbolicate PC, исследуют instruction/registers/core и matching dependencies. Неизвестные bytes без artifacts ограничивают достоверность.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

77. (L4, T) Как устроен ELF loader interaction?

   **Ответ:** Kernel читает program headers и запускает PT_INTERP loader для dynamic executable; loader maps dependencies, relocates и передаёт control. Details зависят от ELF/platform.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

78. (L4, S) Как строить tooling вокруг ELF анализа?

   **Ответ:** Парсят ELF libraries с boundary checks, сохраняют build-id/architecture и normalized records. Unknown/malformed formats обрабатывают явно, version-specific assumptions тестируют.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

---

## 2.4 Package Management (Linux)

## L1

79. (L1, T) Что такое пакетный менеджер?

   **Ответ:** Package manager устанавливает, обновляет и удаляет packages, ведёт metadata и зависимости. Он не гарантирует совместимость произвольных вручную установленных binaries.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html).

80. (L1, T) Примеры: apt / yum / pacman?

   **Ответ:** apt управляет Debian packages, yum/dnf — RPM ecosystem, pacman — Arch packages. Команды и repository policy различаются; выбирают tool дистрибутива.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html).

81. (L1, T) Что такое dev-пакет?

   **Ответ:** Development package обычно содержит headers и metadata для compilation/link. Runtime package содержит нужные для execution components; разделение зависит от distribution.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html).

82. (L1, P) Как установить библиотеку?

   **Ответ:** Для Debian пример: `sudo apt install libssl-dev` для разработки с OpenSSL. Названия и версии сверяют с выбранным distribution/repository.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html).

## L2

83. (L2, T) Что содержит dev-пакет?

   **Ответ:** Обычно headers, unversioned linker symlink, pkg-config/CMake metadata; static archive может быть отдельным optional package. Нельзя предполагать одинаковый состав везде.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html).

84. (L2, T) Что такое headers + static libs?

   **Ответ:** Headers описывают declarations для compilation, static archives содержат linkable objects. Одних headers недостаточно для внешних non-inline definitions.

   **Источник:** [GNU ld](https://sourceware.org/binutils/docs/ld/).

85. (L2, T) Что делает pkg-config?

   **Ответ:** pkg-config читает `.pc` metadata и выводит compiler/linker flags и dependency/version information. Он не скачивает и не устанавливает библиотеки.

   **Источник:** [pkg-config Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html).

86. (L2, P) Как использовать pkg-config?

   **Ответ:** Например: `pkg-config --cflags --libs openssl`. В build system предпочтителен imported target, сохраняющий dependency semantics.

   **Источник:** [pkg-config Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html).

87. (L2, D) Почему pkg-config не находит библиотеку?

   **Ответ:** Проверяют имя `.pc`, installed dev package, search paths, version constraint и cross sysroot. `PKG_CONFIG_PATH` не должен случайно смешивать host/target metadata.

   **Источник:** [pkg-config Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html).

## L3

88. (L3, T) Как устроены `.pc` файлы?

   **Ответ:** Файл содержит variables, Name/Description/Version, Cflags, Libs и dependency fields. Private dependencies важны для static linking.

   **Источник:** [pkg-config Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html).

89. (L3, T) Что такое prefix/libdir/include?

   **Ответ:** prefix задаёт installation root, libdir/include paths выводятся из него. Для cross compilation учитывают sysroot и target-specific search configuration.

   **Источник:** [pkg-config Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html).

90. (L3, P) Как написать свой `.pc` файл?

   **Ответ:** Минимум: Name, Description, Version, `Libs: -L${libdir} -lfoo`, `Cflags: -I${includedir}` и определения paths. Requires/Private отражают реальные dependencies.

   **Источник:** [pkg-config Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html).

91. (L3, D) Почему версии пакетов конфликтуют?

   **Ответ:** Требования могут требовать несовместимые versions или одинаковые files/ABI names. Проверяют dependency graph и repository provenance, а не подменяют symlinks.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

92. (L3, T) Как OS packages влияют на ABI?

   **Ответ:** Upgrade может изменить SONAME, exported versions или runtime baseline. Package dependencies помогают, но custom binaries требуют собственной ABI validation.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html); [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html).

## L4

93. (L4, S) Когда НЕ использовать system packages?

   **Ответ:** Их недостаточно при нужных patchsets, exact versions или target sysroot вне distribution. Собственное dependency management требует updates, provenance и security lifecycle.

   **Источник:** [Reproducible Builds Documentation](https://reproducible-builds.org/docs/).

94. (L4, S) Как обеспечить reproducible environment?

   **Ответ:** Фиксируют repositories/snapshots, package versions, image digest, toolchain и configuration. Повторяемый environment отдельно проверяют clean rebuild.

   **Источник:** [Reproducible Builds Documentation](https://reproducible-builds.org/docs/).

95. (L4, D) Как диагностировать конфликт системных библиотек?

   **Ответ:** Сопоставляют package ownership/versions, ELF DT_NEEDED, actual loaded paths и loader diagnostics. Исключают случайные `/usr/local` и LD_LIBRARY_PATH overrides.

   **Источник:** [Debian Reference: Package Management](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

---

## 2.5 IDE / Editors

## L1

96. (L1, T) Что такое IDE?

   **Ответ:** IDE объединяет editing, navigation, build/run и debugger integration. Для корректного анализа C++ ей нужны реальные compilation settings.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

97. (L1, T) Разница IDE vs editor?

   **Ответ:** Editor обычно расширяется отдельными language/build/debug tools; IDE поставляет интегрированную модель проекта. Граница зависит от extensions, а не названия продукта.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

98. (L1, T) Что делает language server?

   **Ответ:** Language server обслуживает navigation, completion и diagnostics через protocol к editor. Для C++ качество зависит от compile commands и индексирования.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

## L2

99. (L2, T) Как работает clangd?

   **Ответ:** clangd использует Clang frontend, compile commands и indexes для diagnostics/navigation. Он не является build system и может анализировать иную конфигурацию, чем CI.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

100. (L2, T) Что такое compile_commands.json?

   **Ответ:** Это compilation database с directory, source file и command/arguments для translation units. Она не описывает весь build graph или link steps.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

101. (L2, P) Как его сгенерировать?

   **Ответ:** В поддерживаемом CMake generator: `cmake -S . -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON`. Полученный файл должен соответствовать нужному toolchain.

   **Источник:** [CMake Buildsystem](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html); [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

102. (L2, P) Как подключить clangd в VS Code?

   **Ответ:** Устанавливают clangd extension и server, указывают compilation database и проверяют logs. Конкурирующие C++ language servers лучше настроить так, чтобы они не дублировали diagnostics.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

103. (L2, T) Что делает индексирование?

   **Ответ:** Индекс связывает declarations, definitions и references для поиска. Он зависит от parsed configuration и может отставать от generated headers/commands.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

## L3

104. (L3, T) Как CLion интегрируется с CMake?

   **Ответ:** CLion получает target/configuration model из CMake и использует её для build, indexing и run/debug profiles. Проверяют выбранный profile/toolchain.

   **Источник:** [CMake Buildsystem](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html).

105. (L3, T) Как работает code navigation?

   **Ответ:** Parser/index связывает referenced declaration с definition по project metadata. Macros, templates и inactive branches могут ограничивать точность.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

106. (L3, D) Почему IDE не видит символы?

   **Ответ:** Проверяют active configuration, include paths/defines, generated headers и compilation database. Сначала исправляют flags, а не удаляют caches наугад.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

107. (L3, P) Как дебажить через IDE?

   **Ответ:** Создают debug/run configuration с нужным executable, args и environment, запускают GDB/LLDB integration. Debug symbols должны соответствовать binary.

   **Источник:** [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/).

108. (L3, T) Как IDE использует compile flags?

   **Ответ:** Flags задают language standard, macros, include paths, target и sysroot. Отличие от actual build объясняет многие ложные IDE errors.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

## L4

109. (L4, S) Как стандартизировать dev environment в команде?

   **Ответ:** Фиксируют toolchain/dependencies, presets, formatting и compilation database generation. Setup должен воспроизводиться script/CI, сохраняя локальные editor preferences.

   **Источник:** [Reproducible Builds Documentation](https://reproducible-builds.org/docs/); [CMake Buildsystem](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html).

110. (L4, S) Как ускорить indexing для большого проекта?

   **Ответ:** Убирают лишние indexed paths/configurations, обеспечивают accurate commands и generated headers, используют background/remote index при поддержке. Измеряют bottleneck прежде увеличения ресурсов.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

111. (L4, D) Как диагностировать проблемы clangd?

   **Ответ:** Проверяют server logs и `clangd --check=path/to/file.cpp` с нужной database. Сравнивают effective command, includes, target и compiler discovery.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

---

# 9. Real-world Scenarios

## L2

112. (L2, D) Почему код компилируется, но падает при запуске?

   **Ответ:** Compilation не проверяет все runtime inputs, ABI, libraries и logic. Сначала различают loader failure и crash после entry, сохраняют exact error/core.

   **Источник:** [GCC: Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

113. (L2, D) Почему IDE показывает ошибки, а билд проходит?

   **Ответ:** IDE может иметь другой standard, defines, includes или stale database. Сопоставляют actual build command с analysis command.

   **Источник:** [clangd: Compile Commands](https://clangd.llvm.org/design/compile-commands).

## L3

114. (L3, D) Почему разные компиляторы дают разный результат?

   **Ответ:** Возможны UB, implementation-defined choices, versions/extensions и compiler defects. Сначала фиксируют flags/inputs и проверяют correctness минимального testcase.

   **Источник:** [Clang: User Manual](https://clang.llvm.org/docs/UsersManual.html); [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html).

115. (L3, D) Почему релизный билд падает, а debug — нет?

   **Ответ:** Оптимизация меняет layout/timing и обнаруживает UB/races; assertions и defines тоже различаются. Сравнивают exact configurations и сохраняют optimized symbols.

   **Источник:** [GCC: Optimization Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

116. (L3, D) Почему бинарь не переносим между системами?

   **Ответ:** Бинарь зависит от ISA, loader/libc/libstdc++ baseline и ABI. Containers не эмулируют отсутствующие CPU instructions и не убирают kernel requirements.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html); [ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html).

## L4

117. (L4, S) Как построить reproducible toolchain?

   **Ответ:** Фиксируют compiler/linker/sysroot/dependencies, environment и paths, затем сравнивают independent clean builds. Одной версии compiler недостаточно.

   **Источник:** [Reproducible Builds Documentation](https://reproducible-builds.org/docs/).

118. (L4, S) Как управлять версиями компиляторов?

   **Ответ:** Используют versioned toolchain images/presets с inventory, support matrix и staged upgrade. Artifact metadata хранит полные compiler/linker identities.

   **Источник:** [Reproducible Builds Documentation](https://reproducible-builds.org/docs/); [CMake: Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html).

119. (L4, S) Как гарантировать бинарную совместимость?

   **Ответ:** Фиксируют supported ABI contracts и platforms, проверяют exported symbols/layout и совместимость old/new consumers. Абсолютную совместимость с произвольным toolchain обещать нельзя.

   **Источник:** [System V ABI: ELF](https://refspecs.linuxfoundation.org/elf/gabi4+/contents.html); [GNU ld](https://sourceware.org/binutils/docs/ld/).

---

