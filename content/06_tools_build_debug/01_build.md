# C/C++ Build Systems Question Bank (Linux)
# 1. Compilation Pipeline

## L1

1. (L1, T) Какие стадии включает compilation pipeline?

**Ответ:** Классический пайплайн сборки C/C++ включает 4 последовательные стадии: препроцессинг (preprocessing), трансляция/компиляция в ассемблер (compilation), ассемблирование в машинный код (assembly) и компоновка/линковка (linking).

**Пример:**

```
main.c -> [ Препроцессор (cpp) ] -> main.i
       -> [ Компилятор (cc1) ]    -> main.s
       -> [ Ассемблер (as) ]     -> main.o
       -> [ Линкер (ld) ]        -> a.out
```

**Источник:** [GCC Online Docs: Overall Options](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html?utm_source=gemini)

2. (L1, T) Что делает препроцессор?

**Ответ:** Препроцессор выполняет текстовые преобразования до синтаксического анализа: подставляет содержимое файлов по `#include`, раскрывает макроопределения `#define`, удаляет комментарии и отсекает неактивные ветки условной компиляции (`#ifdef`, `#if`).

**Пример:**

```c
#define VALUE 42
int x = VALUE; // Препроцессор заменит на: int x = 42;
```

**Источник:** [cppreference: Phases of translation](https://en.cppreference.com/w/cpp/language/translation_phases?utm_source=gemini)

3. (L1, T) В чем разница между `.c` и `.o` файлами?

**Ответ:** Файл `.c` — это исходный человекочитаемый текст программы. Файл `.o` (object file) — сгенерированный машинный двоичный код для конкретной архитектуры с незаполненными адресами внешних вызовов (relocations) и таблицей символов.

**Пример:**

```bash
file main.c # C source, ASCII text
file main.o # ELF 64-bit LSB relocatable, x86-64
```

**Источник:** [System V Application Binary Interface (GABI)](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.intro.html?utm_source=gemini)

4. (L1, T) Что делает компилятор?

**Ответ:** Компилятор преобразует единицу трансляции в ассемблерный код или промежуточное представление (IR): выполняет лексический, синтаксический и семантический разбор, строит AST-дерево и производит оптимизации (inlining, векторизация, unrolling).

**Пример:**

```bash
# Получение ассемблерного кода:
gcc -S -O2 main.c -o main.s
```

**Источник:** [LLVM Compiler Architecture Overview](https://www.aosabook.org/en/llvm.html?utm_source=gemini)

5. (L1, T) Что делает линкер?

**Ответ:** Линкер связывает независимые объектные файлы (`.o`) и библиотеки (`.a`, `.so`) в исполняемый бинарник или разделяемую библиотеку, разрешая внешние ссылки на функции/переменные и выполняя релокацию адресов.

**Пример:**

```bash
ld -o app main.o utils.o -lc
```

**Источник:** [Levine, J. R. "Linkers and Loaders"](https://www.iecc.com/linker/?utm_source=gemini)

6. (L1, T) Что такое `#include`?

**Ответ:** Директива препроцессора, выполняющая физическую копипасту указанного файла целиком в текущую позицию исходного кода до начала компиляции.

**Пример:**

```c
#include "header.h" // Всё содержимое header.h вставляется прямо сюда
```

**Источник:** [cppreference: Source file inclusion](https://en.cppreference.com/w/cpp/preprocessor/include?utm_source=gemini)

7. (L1, T) Разница между `<...>` и `"..."`?

**Ответ:** При `#include <...>` компилятор ищет заголовок строго в стандартных системных директориях и путях, указанных через `-I`. При `#include "..."` поиск начинается сначала с каталога текущего исходного файла, и лишь затем переходит к системным путям.

**Пример:**

```c
#include <vector>   // Системный STL заголовок
#include "my_cfg.h" // Локальный заголовок в папке с кодом
```

**Источник:** [GCC Online Docs: Search Path](https://gcc.gnu.org/onlinedocs/cpp/Search-Path.html?utm_source=gemini)

8. (L1, T) Что такое header file?

**Ответ:** Текстовый файл (обычно `.h` / `.hpp`), содержащий объявления типов, структур, классов, прототипов функций и констант, используемый для разделения публичного интерфейса модуля и его приватной реализации.

**Пример:**

```c
// math_utils.h
#pragma once
int add(int a, int b); // Интерфейс без тела
```

**Источник:** [C++ Core Guidelines: SF.1](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini#sf1-keep-declarations-in-header-files)

9. (L1, T) Что такое object file?

**Ответ:** Промежуточный бинарный файл формата ELF/Mach-O/COFF, содержащий секции машинного кода (`.text`), инициализированных данных (`.data`), таблицу символов (`.symtab`) и директивы перемещения адресов для линкера.

**Пример:**

```bash
gcc -c worker.c -o worker.o # Получение object file
```

**Источник:** [System V ABI: Object Files](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.intro.html?utm_source=gemini)

10. (L1, P) Как скомпилировать файл вручную через `gcc`?

**Ответ:** Компиляция без линковки выполняется флагом `-c`, полная сборка в исполняемый файл — прямым вызовом компилятора с указанием выходного флага `-o`.

**Пример:**

```bash
gcc -Wall -Wextra -O2 -c main.c -o main.o
gcc main.o -o my_app
```

**Источник:** [GCC Command Options](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html?utm_source=gemini)

---

## L2

11. (L2, T) Что такое translation unit?

**Ответ:** Единица трансляции (Translation Unit) — базовый входной поток данных для компилятора, получаемый после обработки одного `.c`/`.cpp` файла препроцессором со всеми раскрытыми заголовками и макросами.

**Пример:**

```bash
# Получение единицы трансляции:
gcc -E main.c -o main.i
```

**Источник:** [cppreference: Translation units](https://en.cppreference.com/w/cpp/language/translation_phases?utm_source=gemini)

12. (L2, T) Что такое symbol table?

**Ответ:** Таблица символов — секция внутри объектного файла, связывающая идентификаторы функций и переменных с их типами, областями видимости (local/global) и адресами со смещением относительно секций.

**Пример:**

```bash
readelf -s main.o
```

**Источник:** [System V ABI: Symbol Table](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.symtab.html?utm_source=gemini)

13. (L2, T) Что такое relocation?

**Ответ:** Процесс подстановки окончательных абсолютных или относительных адресов в машинные команды и структуры данных, выполняемый линкером после объединения секций и фиксации базовых адресов.

**Пример:**

```bash
# Просмотр записей релокации:
readelf -r main.o
```

**Источник:** [Eli Bendersky: How Linkers Work](https://eli.thegreenplace.net/2011/08/25/load-time-relocation-of-shared-libraries?utm_source=gemini)

14. (L2, T) Что такое ODR?

**Ответ:** One Definition Rule — правило одного определения в C++, запрещающее более одного определения не-`inline` переменной/функции в программе и требующее эквивалентности дублирующихся определений типов в разных translation units.

**Пример:**

```cpp
// a.cpp: int id = 1;
// b.cpp: int id = 2; // Нарушение ODR при линковке
```

**Источник:** [cppreference: One Definition Rule](https://en.cppreference.com/w/cpp/language/definition?utm_source=gemini#One_Definition_Rule)

15. (L2, P) Как посмотреть результат препроцессинга?

**Ответ:** Флаг `-E` останавливает компилятор сразу после работы препроцессора и выводит чистый код в стандартный поток или файл.

**Пример:**

```bash
gcc -E -P main.c -o preprocessed.c
```

**Источник:** [GCC Options Controlling the Preprocessor](https://gcc.gnu.org/onlinedocs/gcc/Preprocessor-Options.html?utm_source=gemini)

16. (L2, P) Как собрать `.o`, а затем бинарь вручную?

**Ответ:** Сначала компилируются исходники во флаге `-c`, затем объектные модули сводятся вызовом компилятора-драйвера в единый бинарник.

**Пример:**

```bash
gcc -c a.c -o a.o
gcc -c b.c -o b.o
gcc a.o b.o -o final_app
```

**Источник:** [GCC Online Manual](https://gcc.gnu.org/onlinedocs/gcc/?utm_source=gemini)

17. (L2, D) Почему возникает `undefined reference`?

**Ответ:** Ошибка линкера, означающая, что символ был объявлен и использован в коде, но ни один переданный объектный файл или библиотека не содержит его фактического определения в секциях кода/данных.

**Пример:**

```bash
# undefined reference to 'calculate_sum'
# Причина: забыли скомпилировать math.c или передать math.o линкеру
```

**Источник:** [GCC Wiki: Verbose Diagnostics](https://gcc.gnu.org/wiki/VerboseDiagnostics?utm_source=gemini#undefined_reference)

18. (L2, D) Почему возникает `multiple definition`?

**Ответ:** Ошибка линкера, означающая, что один и тот же сильный глобальный символ (функция или глобальная переменная без `inline`/`static`) определен более чем в одном `.o` файле проекта.

**Пример:**

```c
// header.h
int counter = 0; // Определение в хедере! При включении в 2 .c файла даст multiple definition.
```

**Источник:** [GNU ld: Duplicate symbols](https://sourceware.org/binutils/docs/ld/Options.html?utm_source=gemini)

19. (L2, T) Как компилятор обрабатывает inline?

**Ответ:** Для оптимизатора `inline` — это эвристическая подсказка встроить тело функции по месту вызова без `call`. Для линкера — указание пометить символ как слабый (weak/linkonce), чтобы объединить идентичные копии определений из разных `.o` файлов в одну.

**Пример:**

```c
inline int max(int a, int b) { return a > b ? a : b; }
```

**Источник:** [cppreference: inline specifier](https://en.cppreference.com/w/cpp/language/inline?utm_source=gemini)

20. (L2, T) Что такое debug symbols?

**Ответ:** Метаданные (форматы DWARF в Linux, PDB в Windows), сохраняющие таблицы соответствия смещений инструкций строкам исходного кода, именам локальных переменных и типам для дебаггеров (GDB/LLDB).

**Пример:**

```bash
gcc -g -O0 main.c -o app_debug # Флаг -g внедряет секции .debug_*
```

**Источник:** [DWARF Debugging Standard](https://dwarfstd.org/?utm_source=gemini)

---

## L3

21. (L3, T) Как устроен ELF object file?

**Ответ:** Структура ELF включает ELF Header (магическое число, архитектура, ABI), Program Header Table (для сегментов загрузки в память), секции (код, данные, метаданные) и Section Header Table (описывает границы секций для компоновщика).

**Пример:**

```
[ ELF Header ]
[ .text (Код) ]
[ .data (Инициализированные данные) ]
[ .bss (Нули) ]
[ .symtab (Символы) ]
[ Section Header Table ]
```

**Источник:** [System V Application Binary Interface (GABI)](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.intro.html?utm_source=gemini)

22. (L3, T) Что такое sections (.text, .data, .bss)?

**Ответ:** `.text` — сегмент неизменяемых исполняемых инструкций CPU; `.data` — сегмент глобальных/статических инициализированных переменных; `.bss` — сегмент неинициализированных нулей (не занимает места в бинарнике на диске, расширяется ОС при запуске).

**Пример:**

```c
int a = 10;   // .data
int b;        // .bss
void f() {}   // .text
```

**Источник:** [CS:APP (Bryant & O'Hallaron): Linking](https://csapp.cs.cmu.edu/?utm_source=gemini)

23. (L3, T) Что такое GOT/PLT?

**Ответ:** Механизм для Position Independent Code (PIC): PLT (Procedure Linkage Table) — массив инструкций-трамплинов для вызова внешних функций; GOT (Global Offset Table) — таблица абсолютных адресов данных и функций в памяти, заполняемая динамическим линкером при старте или лениво.

**Пример:**

```
Вызов printf -> PLT[printf] -> читает GOT[printf] -> переход в libc.so
```

**Источник:** [Ian Lance Taylor: Linkers (Part 4 - GOT and PLT)](https://www.airs.com/blog/archives/41?utm_source=gemini)

24. (L3, T) Как работает dynamic linker?

**Ответ:** Системная программа (`ld.so`), запускаемая ядром при выполнении бинарника: считывает секцию `.dynamic`, загружает зависимые `.so` библиотеки через `mmap`, выполняет релокацию адресов в GOT и передает управление в `_start`.

**Пример:**

```bash
/lib64/ld-linux-x86-64.so.2 ./my_program
```

**Источник:** [Linux man-pages: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html?utm_source=gemini)

25. (L3, P) Как посмотреть symbols через `nm`?

**Ответ:** Утилита `nm` выводит таблицу символов файла с их типами (`T` — глобальный код, `U` — неразрешенный внешний символ, `D` — инициализированные данные).

**Пример:**

```bash
nm -C my_file.o
# 0000000000000000 T calculate
#                  U printf
```

**Источник:** [GNU Binutils: nm manual](https://sourceware.org/binutils/docs/binutils/nm.html?utm_source=gemini)

26. (L3, P) Как анализировать бинарь через `readelf`?

**Ответ:** `readelf` позволяет инспектировать заголовки, секции, сегменты и зависимости ELF-файла без привлечения библиотек разбора.

**Пример:**

```bash
readelf -h app  # ELF Header
readelf -d app  # Dynamic section (.dynamic, RPATH, NEEDED)
```

**Источник:** [Linux man-pages: readelf(1)](https://man7.org/linux/man-pages/man1/readelf.1.html?utm_source=gemini)

27. (L3, D) Почему бинарь падает при запуске, хотя линковка успешна?

**Ответ:** Причины: не найдена зависимая `.so` динамическим загрузчиком; несовпадение ABI версий библиотек (бинарная несовместимость); краш в глобальных конструкторах (`.init_array`) до вызова `main()`.

**Пример:**

```bash
# error while loading shared libraries: libfoo.so: cannot open shared object file
```

**Источник:** [Dynamic Linker Search Path Rules](https://man7.org/linux/man-pages/man8/ld.so.8.html?utm_source=gemini)

28. (L3, T) Что такое weak symbols?

**Ответ:** Символы с пониженным приоритетом при компоновке: линкер разрешает их переопределение сильным символом без ошибки дублирования, а если определение отсутствует вовсе, адрес символа обнуляется.

**Пример:**

```c
__attribute__((weak)) void default_impl() {}
```

**Источник:** [GCC Variable and Function Attributes: weak](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html?utm_source=gemini#index-weak-function-attribute)

29. (L3, T) Как работает symbol resolution?

**Ответ:** Линкер сканирует входные файлы слева направо, ведя наборы определенных (D) и неопределенных (U) символов. Встретив сильный символ, линкер закрывает ссылку; если встречает дубль сильного — падает с ошибкой; слабые символы перезаписываются сильными.

**Пример:**

```
Strong + Strong = Error (multiple definition)
Strong + Weak   = Strong побеждает
Weak + Weak     = Линкер произвольно выбирает первый
```

**Источник:** [CS:APP Chapter 7: Symbol Resolution](https://csapp.cs.cmu.edu/?utm_source=gemini)

30. (L3, D) Почему порядок линковки `.a` важен?

**Ответ:** Статические библиотеки (`.a`) сканируются строго в порядке указания в командной строке. Линкер извлекает из `.a` только те `.o`, которые закрывают *уже накопленные* к этому моменту неразрешенные символы. Если библиотека `B` зависит от `A`, но указана до нее, возникнет `undefined reference`.

**Пример:**

```bash
# Ошибка:
gcc -lmylib main.o -o app
# Корректно (зависимый идет перед поставщиком):
gcc main.o -lmylib -o app
```

**Источник:** [Eli Bendersky: Library order in static linking](https://eli.thegreenplace.net/2013/07/09/library-order-in-static-linking?utm_source=gemini)

---

## L4

31. (L4, T) Как реализована lazy binding?

**Ответ:** При первом вызове функции через PLT управление прыгает в резолвер динамического линкера (`_dl_runtime_resolve`), передавая ID символа и релокации. Линкер вычисляет адрес функции, прописывает его напрямую в GOT-ячейку, и все последующие вызовы минуют линкер.

**Пример:**

```
Call foo@plt -> GOT указывает на вторую строчку PLT -> push ID -> jump _dl_runtime_resolve -> GOT обновлен!
```

**Источник:** [Ulrich Drepper: How To Write Shared Libraries](https://www.akkadia.org/drepper/dsohowto.pdf?utm_source=gemini)

32. (L4, T) Как работает relocation на runtime?

**Ответ:** При загрузке PIC-библиотеки загрузчик смещает адреса по базовому смещению (ASLR base). Для символов данных он правит записи GOT по типу `R_X86_64_RELATIVE` или `R_X86_64_GLOB_DAT`, сопоставляя их с таблицей `.dynsym`.

**Пример:**

```bash
readelf -r libfoo.so # Типы релокаций времени выполнения
```

**Источник:** [System V Application Binary Interface (Dynamic Linking)](https://refspecs.linuxfoundation.org/elf/gabi4+/ch5.dynamic.html?utm_source=gemini)

33. (L4, S) Как минимизировать symbol conflicts в large-scale системе?

**Ответ:** 1) Скрывать приватные символы по умолчанию флагом `-fvisibility=hidden`; 2) Использовать Version Scripts для экспорта только официального API; 3) Изолировать динамические плагины флагом `RTLD_LOCAL` при `dlopen`; 4) Использовать namespaces и anonymous namespaces.

**Пример:**

```
// version_script.map
LIB_1.0 {
    global: public_api_*;
    local: *;
};
```

**Источник:** [GCC Wiki: Visibility](https://gcc.gnu.org/wiki/Visibility?utm_source=gemini)

34. (L4, T) Как реализован dynamic loader в Linux?

**Ответ:** `ld-linux.so` — это самостоятельный позиционно-независимый исполняемый ELF, стартующий без внешних библиотек. Он сам выполняет собственные базовые релокации (bootstrap), читает вспомогательный вектор ядра (Auxiliary Vector `auxv`), парсит заголовки программы, строит граф DSOs (BFS/DFS) и выполняет relocations.

**Пример:**

```bash
# Просмотр шагов загрузчика:
LD_DEBUG=all ./my_app
```

**Источник:** [Glibc Source: elf/rtld.c](https://sourceware.org/git/?p=glibc.git;a=blob;f=elf/rtld.c?utm_source=gemini)

35. (L4, D) Как диагностировать subtle ABI mismatch?

**Ответ:** 1) Сравнить дампы памяти структур через `pahole` или `clang -fdump-record-layouts`; 2) Сравнить бинарный ABI через инструмент `abidiff` (libabigail); 3) Проверить расхождение флагов типа `-D_GLIBCXX_USE_CXX11_ABI`.

**Пример:**

```bash
abidiff libold.so libnew.so # Подсветит измененные размеры структур и vtable
```

**Источник:** [Libabigail: ABI Generic Analysis and Instrumentation Library](https://sourceware.org/libabigail/?utm_source=gemini)

---

# 2. Static vs Dynamic Linking

## L1

36. (L1, T) Что такое static library?

**Ответ:** Статическая библиотека — это архив скомпилированных объектных файлов (`.o`), запакованных в один файл утилитой `ar`, код которых копируется линкером в итоговый исполняемый файл на этапе сборки.

**Пример:**

```bash
ar rcs libtools.a tool1.o tool2.o
```

**Источник:** [GNU Binutils: ar](https://sourceware.org/binutils/docs/binutils/ar.html?utm_source=gemini)

37. (L1, T) Что такое shared library?

**Ответ:** Разделяемая (динамическая) библиотека — бинарный файл (`.so` / `.dll`), загружаемый в оперативную память один раз и используемый множеством одновременно работающих процессов за счет разделения страниц виртуальной памяти кода.

**Пример:**

```bash
gcc -shared -fPIC math.c -o libmath.so
```

**Источник:** [Linux Program Library HOWTO](https://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html?utm_source=gemini)

38. (L1, T) Разница `.a` vs `.so`?

**Ответ:** `.a` внедряется в тело бинарника на этапе сборки (раздувает размер, автономен); `.so` подключается загрузчиком при старте программы (экономит память, но требует наличия файла в системе).

**Пример:**

```bash
gcc main.o libfoo.a -o app_static # .a
gcc main.o -L. -lfoo -o app_dyn   # .so
```

**Источник:** [Levine, J. R. Linkers and Loaders](https://www.iecc.com/linker/?utm_source=gemini)

39. (L1, P) Как собрать static library?

**Ответ:** Скомпилировать файлы в `.o` и упаковать архиватором `ar` с ключами `rcs`.

**Пример:**

```bash
gcc -c util.c -o util.o
ar rcs libutil.a util.o
```

**Источник:** [GNU ar documentation](https://sourceware.org/binutils/docs/binutils/ar.html?utm_source=gemini)

40. (L1, P) Как собрать shared library?

**Ответ:** Скомпилировать код с флагом `-fPIC` (Position Independent Code) и слинковать с флагом `-shared`.

**Пример:**

```bash
gcc -fPIC -c util.c -o util.o
gcc -shared util.o -o libutil.so
```

**Источник:** [GCC Link Options (-shared)](https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html?utm_source=gemini)

---

## L2

41. (L2, T) Когда использовать static linking?

**Ответ:** Когда критична портабельность и автономность развертывания (single binary deployment в Docker без зависимостей), когда недопустимы накладные расходы на запуск динамического линкера, или для предотвращения DLL hell.

**Пример:**

```bash
gcc -static main.c -o standalone_app
```

**Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines?utm_source=gemini)

42. (L2, T) Когда использовать dynamic linking?

**Ответ:** Когда код библиотеки используется многими процессами (экономия RAM и диска), для реализации модульной архитектуры плагинов, а также для возможности обновлять библиотеки безопасности без перекомпиляции основного ПО.

**Пример:**

```
Обновление системной libssl.so закрывает уязвимость во всех приложениях сразу.
```

**Источник:** [Ulrich Drepper: How To Write Shared Libraries](https://www.akkadia.org/drepper/dsohowto.pdf?utm_source=gemini)

43. (L2, T) Что такое SONAME?

**Ответ:** Логическое имя разделяемой библиотеки, прошиваемое внутрь нее линкером; указывает на совместимую версию ABI (например, `libcrypto.so.1.1`). Загрузчик ищет файл именно по SONAME, а не по физическому имени файла на диске.

**Пример:**

```bash
gcc -shared -Wl,-soname,libfoo.so.1 -o libfoo.so.1.0.0 foo.o
```

**Источник:** [Linux man-pages: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html?utm_source=gemini)

44. (L2, P) Как посмотреть зависимости бинаря (`ldd`)?

**Ответ:** Утилита `ldd` запускает динамический линкер в диагностическом режиме и выводит список всех найденных `.so` файлов и их адреса.

**Пример:**

```bash
ldd /bin/ls
# libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f...)
```

**Источник:** [Linux man-pages: ldd(1)](https://man7.org/linux/man-pages/man1/ldd.1.html?utm_source=gemini)

45. (L2, D) Почему не находится `.so` при запуске?

**Ответ:** Директория с библиотекой не входит в стандартный путь поиска `ld.so`, не указана в переменной `LD_LIBRARY_PATH` или не прошита в заголовках бинарника через `rpath`/`runpath`.

**Пример:**

```bash
./app: error while loading shared libraries: libfoo.so: cannot open shared object file
```

**Источник:** [Debian Wiki: RpathIssue](https://wiki.debian.org/RpathIssue?utm_source=gemini)

46. (L2, T) Что такое LD_LIBRARY_PATH?

**Ответ:** Переменная окружения, содержащая разделенный двоеточиями список каталогов, в которых динамический загрузчик ищет библиотеки до обращения к системным папкам (`/lib`, `/usr/lib`).

**Пример:**

```bash
export LD_LIBRARY_PATH=/opt/custom_libs:$LD_LIBRARY_PATH
```

**Источник:** [Linux man-pages: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html?utm_source=gemini)

47. (L2, T) Что такое rpath?

**Ответ:** Запись `DT_RPATH` внутри секции `.dynamic` ELF-бинарника, жестко кодирующая пути поиска библиотек во время сборки; имеет приоритет над переменной `LD_LIBRARY_PATH`.

**Пример:**

```bash
gcc main.o -Wl,-rpath,/custom/path -L. -lfoo -o app
```

**Источник:** [System V ABI: Dynamic Section](https://refspecs.linuxfoundation.org/elf/gabi4+/ch5.dynamic.html?utm_source=gemini)

---

## L3

48. (L3, T) Разница RPATH vs RUNPATH?

**Ответ:** `RPATH` имеет наивысший приоритет и опрашивается *до* `LD_LIBRARY_PATH`. `RUNPATH` проверяется *после* `LD_LIBRARY_PATH`, что дает разработчику возможность переопределять библиотеки окружением.

**Пример:**

```
Порядок поиска:
1. RPATH (если RUNPATH пуст)
2. LD_LIBRARY_PATH
3. RUNPATH
4. Системный кэш /etc/ld.so.cache
5. /lib, /usr/lib
```

**Источник:** [Linux man-pages: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html?utm_source=gemini)

49. (L3, T) Что такое symbol interposition?

**Ответ:** Механизм, при котором динамический загрузчик разрешает одинаковые символы в пользу того, кто был загружен первым (или через `LD_PRELOAD`), перехватывая вызовы оригинальных библиотечных функций.

**Пример:**

```bash
# Подмена стандартного аллокатора:
LD_PRELOAD=/usr/lib/libtcmalloc.so ./my_app
```

**Источник:** [Ulrich Drepper: How To Write Shared Libraries](https://www.akkadia.org/drepper/dsohowto.pdf?utm_source=gemini)

50. (L3, D) Почему бинарь использует не ту версию библиотеки?

**Ответ:** Из-за порядка поиска: загрузчик нашел устаревшую версию с тем же SONAME в папке из `LD_LIBRARY_PATH` или системном кэше `/etc/ld.so.cache` раньше, чем целевую библиотеку из целевой папки.

**Пример:**

```bash
# Трассировка разрешения библиотек:
LD_DEBUG=libs ./my_app
```

**Источник:** [Linux man-pages: ld.so(8)](https://man7.org/linux/man-pages/man8/ld.so.8.html?utm_source=gemini)

51. (L3, P) Как задать rpath при линковке?

**Ответ:** Через ключ компоновщика `-Wl,-rpath,ПУТЬ`. Часто используется токен `$ORIGIN` для создания переносимых каталогов (относительно положения бинарника).

**Пример:**

```bash
gcc main.c -Wl,-rpath,'$ORIGIN/../lib' -L./lib -lutil -o bin/app
```

**Источник:** [GCC Linker Options](https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html?utm_source=gemini)

52. (L3, T) Как shared libs влияют на startup time?

**Ответ:** Замедляют старт программы: динамический загрузчик тратит время на открытие сотен файлов (`open`/`mmap`), валидацию ELF, разрешение тысяч символов через хеш-таблицы (`.gnu.hash`) и правку памяти в GOT/PLT.

**Пример:**

```bash
# Флаг немедленной загрузки замедляет старт, но ускоряет работу:
gcc -Wl,-z,now main.o -o app
```

**Источник:** [Brendan Gregg: Systems Performance (Startup Latency)](https://www.brendangregg.com/methodology.html?utm_source=gemini)

---

## L4

53. (L4, T) Как реализовать plugin system через `.so`?

**Ответ:** Вызовом POSIX API `dlopen` с флагом `RTLD_NOW|RTLD_LOCAL` для изолированной загрузки библиотеки и получением указателей на функции интерфейса через `dlsym`.

**Пример:**

```c
void* handle = dlopen("./plugin.so", RTLD_NOW);
typedef void (*PluginFunc)();
PluginFunc run = (PluginFunc)dlsym(handle, "execute_plugin");
run();
dlclose(handle);
```

**Источник:** [Linux man-pages: dlopen(3)](https://man7.org/linux/man-pages/man3/dlopen.3.html?utm_source=gemini)

54. (L4, D) Как диагностировать ABI break между версиями `.so`?

**Ответ:** Использовать инструменты семантического анализа ELF: `abi-compliance-checker` и `abidiff`, сравнивающие публичный интерфейс библиотек по типам, смещениям полей структур и сигнатурам.

**Пример:**

```bash
abi-compliance-checker -l libfoo -old v1.xml -new v2.xml
```

**Источник:** [ABI Compliance Checker](https://github.com/lvc/abi-compliance-checker?utm_source=gemini)

55. (L4, S) Когда static linking — единственный вариант?

**Ответ:** В initramfs/rescue окружениях ядра; в микро-контейнерах без glibc (`scratch`/`alpine` со static musl); в embedded RTOS; в серверах с ультра-жесткими требованиями к startup-latency (где 200 мс на `ld.so` недопустимы).

**Пример:**

```
Docker FROM scratch
COPY my_app /my_app # Работает только при static linking!
```

**Источник:** [Alpine Linux: Functional differences with glibc](https://wiki.alpinelinux.org/wiki/Functional_differences_with_glibc?utm_source=gemini)

---

# 3. ABI

## L1

56. (L1, T) Что такое ABI?

**Ответ:** Application Binary Interface — низкоуровневый интерфейс между скомпилированными бинарными модулями: правила передачи аргументов регистрами, размеры и выравнивание типов данных, вызовы системных функций и формат объектных файлов.

**Пример:**

```
System V AMD64 ABI: первые 6 аргументов целочисленных функций передаются через rdi, rsi, rdx, rcx, r8, r9.
```

**Источник:** [System V Application Binary Interface (AMD64 Architecture)](https://gitlab.com/x86-psABIs/x86-64-ABI?utm_source=gemini)

57. (L1, T) Разница ABI vs API?

**Ответ:** API определяет совместимость на уровне *исходного кода* (названия функций, типы аргументов, заголовочные файлы). ABI определяет совместимость на уровне *машинного бинарного кода* (расположение байт в памяти, соглашения о вызовах, mangling).

**Пример:**

```
Изменили приватное поле в классе:
API не сломался (код компилируется),
ABI сломался (сместились поля в памяти, нужен ребилд клиентов).
```

**Источник:** [KDE Community: Binary Compatibility Issues](https://community.kde.org/Policies/Binary_Compatibility_Issues_With_C%2B%2B?utm_source=gemini)

---

## L2

58. (L2, T) Что входит в ABI?

**Ответ:** 1) Набор инструкций процессора; 2) Соглашения о вызовах (calling conventions); 3) Выравнивание и раскладка структур в памяти; 4) Схема декорирования имен (name mangling); 5) Раскладка виртуальных таблиц (`vtable`); 6) Механизм раскрутки исключений.

**Пример:**

```c
struct Test {
    char c; // 1 байт + 3 байта паддинга
    int i;  // 4 байта (выровнено по 4 байтам согласно ABI)
};
```

**Источник:** [Itanium C++ ABI](https://itanium-cxx-abi.github.io/cxx-abi/?utm_source=gemini)

59. (L2, T) Что такое name mangling?

**Ответ:** Шифрование компилятором C++ имени функции, ее пространства имен и типов параметров в одну уникальную строку символов для линкера, необходимое для поддержки перегрузки функций.

**Пример:**

```cpp
void foo(int); // Mangled: _Z3fooi
void foo(double); // Mangled: _Z3food
```

**Источник:** [Itanium C++ ABI: External Names (Mangler)](https://itanium-cxx-abi.github.io/cxx-abi/abi.html?utm_source=gemini#mangling)

60. (L2, T) Как влияет layout struct на ABI?

**Ответ:** Изменение типа, добавление поля или перестановка полей в структуре меняет смещения (offsets) в байтах. Если клиентский код скомпилирован со старыми смещениями, чтение поля попадет в соседние чужие байты (UB и память ломается).

**Пример:**

```c
// Версия 1: struct S { int a; };        -> offset(a) = 0
// Версия 2: struct S { int x; int a; }; -> offset(a) = 4 (ABI сломан!)
```

**Источник:** [GCC Data Alignment and Padding](https://gcc.gnu.org/onlinedocs/gcc/Structure-Layout-Pragmas.html?utm_source=gemini)

61. (L2, D) Почему бинарь ломается после обновления библиотеки?

**Ответ:** Нарушена бинарная совместимость (ABI break): библиотека обновилась с новыми размерами структур или измененной таблицей виртуальных функций, но исполняемый файл не был пересобран и работает по старым адресам памяти.

**Пример:**

```
Клиент вызывает vtable[2], а в новой библиотеке этот метод сдвинулся на vtable[3].
```

**Источник:** [Herb Sutter: How To Design a Stable C++ ABI](https://herbsutter.com/?utm_source=gemini)

---

## L3

62. (L3, T) Что ломает ABI?

**Ответ:** Добавление/удаление виртуальных методов; добавление нестатических полей в класс; смена сигнатуры методов; замена типов аргументов; смена компилятора или стандартной библиотеки с другим манглингом; изменение флагов выравнивания (`#pragma pack`).

**Пример:**

```cpp
// Добавление виртуального метода меняет индексы vtable:
class Base {
    virtual void a();
    virtual void new_method(); // Сломает вызов b() у всех старых клиентов!
    virtual void b();
};
```

**Источник:** [KDE Policies: Binary Compatibility](https://community.kde.org/Policies/Binary_Compatibility_Issues_With_C%2B%2B?utm_source=gemini)

63. (L3, T) Как vtable влияет на ABI?

**Ответ:** Таблица виртуальных методов — это массив указателей на функции. Компилятор хардкодит вызовы методов в виде константных индексов (`vtable[N]`). Любое смещение порядка методов в классе приводит к вызову не той функции.

**Пример:**

```
call [rax + 16] // Жестко скомпилированный вызов 3-го виртуального метода
```

**Источник:** [Itanium C++ ABI: Virtual Table Layout](https://itanium-cxx-abi.github.io/cxx-abi/abi.html?utm_source=gemini#vtable)

64. (L3, T) Почему inline функции опасны для ABI?

**Ответ:** Тело `inline` функции копируется непосредственно в код вызывающей программы во время ее компиляции. Если внутренняя логика функции в библиотеке изменится, старые программы продолжат выполнять заинлайненный старый код, создавая рассогласование состояний.

**Пример:**

```cpp
// my_lib.h
inline int get_timeout() { return 1000; } // Вшивается клиентам навечно
```

**Источник:** [Effective C++ (Scott Meyers)](https://www.aristeia.com/books.html?utm_source=gemini)

65. (L3, D) Как обнаружить ABI mismatch?

**Ответ:** 1) Запустить `pahole` на двух версиях библиотек и сопоставить байтовые смещения членов структур; 2) Использовать `abidiff` из пакета libabigail для генерации отчета об изменениях типов и символов.

**Пример:**

```bash
pahole -C MyStruct libv1.so
pahole -C MyStruct libv2.so
```

**Источник:** [Pahole (Poke-a-hole) tool](https://git.kernel.org/pub/scm/devel/pahole/pahole.git/?utm_source=gemini)

---

## L4

66. (L4, S) Как проектировать стабильный ABI?

**Ответ:** 1) Использовать pImpl-идиому (Pointer to Implementation) для сокрытия полей классов; 2) Экспортировать только чистый C-интерфейс (`extern "C"`); 3) Никогда не удалять и не менять порядок виртуальных методов; 4) Резервировать паддинг в структурах под будущие поля.

**Пример:**

```cpp
class StableApi {
    struct Impl;
    Impl* pimpl; // Размер указателя неизменен (8 байт), любые изменения скрыты в .cpp
};
```

**Источник:** [Herb Sutter: Pimpl Idiom](https://herbsutter.com/gotw/_100/?utm_source=gemini)

67. (L4, S) Как поддерживать backward compatibility?

**Ответ:** Использовать Symbol Versioning в ELF (директивы `.symver` в ассемблере), позволяя экспортировать одновременно старую и новую версии одной и той же функции под разными версионными метками.

**Пример:**

```c
__asm__(".symver old_foo, foo@LIB_1.0");
__asm__(".symver new_foo, foo@@LIB_2.0");
```

**Источник:** [GNU ld: Symbol Versioning](https://sourceware.org/binutils/docs/ld/VERSION.html?utm_source=gemini)

---

# 4. Make

## L1

68. (L1, T) Что такое Makefile?

**Ответ:** Конфигурационный файл для утилиты `make`, содержащий декларативный набор правил: целевые файлы, их зависимости и скриптовые команды (рецепты) для их генерации.

**Пример:**

```makefile
app: main.o
	gcc main.o -o app
```

**Источник:** [GNU Make Manual](https://www.gnu.org/software/make/manual/?utm_source=gemini)

69. (L1, T) Что такое target?

**Ответ:** Цель (target) — имя сущности в правиле Makefile (обычно имя генерируемого файла бинарника/библиотеки) или псевдо-действие (clean, all), которое необходимо выполнить.

**Пример:**

```makefile
clean: # target
	rm -f *.o app
```

**Источник:** [GNU Make: Rule Syntax](https://www.gnu.org/software/make/manual/html_node/Rule-Syntax.html?utm_source=gemini)

70. (L1, T) Что такое dependency?

**Ответ:** Файл (или другая цель), от которого зависит целевой файл. Если время изменения зависимости новее времени изменения цели, Make выполняет рецепт.

**Пример:**

```makefile
app: main.o utils.o # dependencies
```

**Источник:** [GNU Make: Prerequisites](https://www.gnu.org/software/make/manual/html_node/Prerequisite-Types.html?utm_source=gemini)

71. (L1, P) Написать простой Makefile

**Ответ:** Минимальный Makefile с компиляцией и линковкой.

**Пример:**

```makefile
CC = gcc
CFLAGS = -Wall -O2

app: main.o
	$(CC) main.o -o app

main.o: main.c
	$(CC) $(CFLAGS) -c main.c -o main.o

clean:
	rm -f *.o app
```

**Источник:** [GNU Make: Simple Makefile](https://www.gnu.org/software/make/manual/html_node/Simple-Makefile.html?utm_source=gemini)

---

## L2

72. (L2, T) Как Make решает, что пересобирать?

**Ответ:** Make сравнивает метку времени последнего изменения файла цели (`mtime`) с метками времени всех его зависимостей. Если хотя бы одна зависимость имеет более свежий `mtime` или цель отсутствует на диске — правило запускается.

**Пример:**

```
main.c (12:05) > main.o (12:00) -> Нужен ребилд main.o
```

**Источник:** [GNU Make: How Make Works](https://www.gnu.org/software/make/manual/html_node/How-Make-Works.html?utm_source=gemini)

73. (L2, T) Что такое `.PHONY`?

**Ответ:** Специальная служебная цель, указывающая Make, что цель не является физическим файлом на диске. Это предотвращает коллизии, если в папке появится реальный файл с именем цели (например, файл `clean`).

**Пример:**

```makefile
.PHONY: all clean test
clean:
	rm -f *.o
```

**Источник:** [GNU Make: Phony Targets](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html?utm_source=gemini)

74. (L2, P) Использование `$@`, `$<`, `$^`

**Ответ:** Автоматические переменные Make:

* `$@` — имя текущей цели правила;

* `$<` — имя первой зависимости;

* `$^` — имена всех зависимостей через пробел.

**Пример:**

```makefile
app: main.o utils.o
	gcc $^ -o $@

%.o: %.c
	gcc -c $< -o $@
```

**Источник:** [GNU Make: Automatic Variables](https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html?utm_source=gemini)

75. (L2, P) Pattern rules

**Ответ:** Шаблонные правила с символом `%` для компактного описания компиляции классов файлов (например, как из любого `.c` получить `.o`).

**Пример:**

```makefile
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
```

**Источник:** [GNU Make: Pattern Rules](https://www.gnu.org/software/make/manual/html_node/Pattern-Rules.html?utm_source=gemini)

76. (L2, D) Почему пересобирается всё?

**Ответ:** 1) Файл цели не генерируется рецептом (Make ищет его снова и снова); 2) Часы системы сбиты (файл из будущего); 3) В зависимостях указана Phony-цель; 4) Makefile сам зависит от файла, который постоянно меняется.

**Пример:**

```bash
# Диагностика причин пересборки в Make:
make --debug=why
```

**Источник:** [GNU Make: Debugging](https://www.gnu.org/software/make/manual/html_node/Options-Summary.html?utm_source=gemini)

---

## L3

77. (L3, T) Как работают dependency files (.d)?

**Ответ:** Файлы `.d` содержат списки всех заголовочных файлов, включенных в конкретный `.c`. Make динамически импортирует их через `include`, чтобы пересобирать `.o` файл при изменении любого вложенного хедера.

**Пример:**

```makefile
-include $(OBJS:.o=.d)
```

**Источник:** [GNU Make: Auto-Dependencies](https://www.gnu.org/software/make/manual/html_node/Automatic-Prerequisites.html?utm_source=gemini)

78. (L3, P) Генерация зависимостей через `-MMD`

**Ответ:** Флаги `-MMD -MP` заставляют компилятор параллельно с компиляцией генерировать валидный фрагмент Makefile со списком пользовательских хедеров.

**Пример:**

```makefile
CFLAGS += -MMD -MP

-include $(wildcard *.d)
```

**Источник:** [GCC Preprocessor Options (-MMD)](https://gcc.gnu.org/onlinedocs/gcc/Preprocessor-Options.html?utm_source=gemini#index-MMD)

79. (L3, D) Как избежать stale headers?

**Ответ:** Флаг `-MP` генерирует фиктивные пустые правила для каждого заголовка. Это предотвращает падение Make с ошибкой `No rule to make target 'old.h'`, если старый заголовок был удален с диска.

**Пример:**

```makefile
# Сгенерированный .d файл содержит:
old.h:
```

**Источник:** [GCC Options: -MP](https://gcc.gnu.org/onlinedocs/gcc/Preprocessor-Options.html?utm_source=gemini#index-MP)

80. (L3, T) Почему recursive make плох?

**Ответ:** Рекурсивный вызов `$(MAKE) -C subdir` изолирует графы зависимостей разных подпапок. Make теряет глобальный контекст проекта, что ломает корректную параллелизацию (`-j`), приводит к ложным пересборкам и ошибкам порядка линковки.

**Пример:**

```
Recursive Make Considered Harmful (Peter Miller, 1997)
```

**Источник:** [Miller, P.: Recursive Make Considered Harmful](https://aegis.sourceforge.net/auug97.pdf?utm_source=gemini)

---

## L4

81. (L4, S) Как масштабировать Make на большой проект?

**Ответ:** Перейти на Non-Recursive Make (единый монолитный граф зависимостей проекта через подключение множества фрагментов `include module.mk`), либо использовать Make исключительно как тонкую обертку над метагенератором сборочных файлов Ninja.

**Пример:**

```makefile
include src/net/rules.mk
include src/db/rules.mk
```

**Источник:** [Emile van Bergen: Non-recursive Make Made Easy](http://evbergen.home.xs4all.nl/nonrecursive-make.html?utm_source=gemini)

82. (L4, D) Почему build не детерминирован с `-j`?

**Ответ:** Отсутствуют явные зависимости между целями (race condition в сборке). Поток A пытается слинковать бинарник, пока поток B еще компилирует нужный для него `.o` файл. При сборке в 1 поток порядок случайно соблюдался.

**Пример:**

```makefile
# Баг: app зависит от lib.a, но зависимость не объявлена:
app: main.o
	gcc main.o -L. -llib -o app
# С -j8 упадет, если lib.a еще не готов!
```

**Источник:** [GNU Make: Parallel Execution](https://www.gnu.org/software/make/manual/html_node/Parallel.html?utm_source=gemini)

---

# 5. CMake

## L1

83. (L1, T) Что такое CMake?

**Ответ:** Кроссплатформенный метагенератор систем сборки: он считывает файлы `CMakeLists.txt` и генерирует нативные скрипты сборки под платформу (Makefile, Ninja, Visual Studio, Xcode).

**Пример:**

```bash
cmake -B build -G Ninja
```

**Источник:** [CMake Official Documentation](https://cmake.org/documentation/?utm_source=gemini)

84. (L1, T) Что такое out-of-source build?

**Ответ:** Практика разделения исходников и артефактов компиляции, при которой сгенерированные объектные файлы, кэш CMake и бинарники складываются в отдельную изолированную папку (например, `build/`), не засоряя дерево репозитория.

**Пример:**

```bash
cmake -B build -S .
cmake --build build
```

**Источник:** [CMake Out-of-Source Guide](https://gitlab.kitware.com/cmake/community/-/wikis/FAQ#what-is-an-out-of-source-build?utm_source=gemini)

85. (L1, P) Минимальный CMakeLists.txt

**Ответ:** Минимальный манифест для сборки приложения.

**Пример:**

```cmake
cmake_minimum_required(VERSION 3.20)
project(App LANGUAGES CXX)

add_executable(my_app main.cpp)
```

**Источник:** [CMake Tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html?utm_source=gemini)

---

## L2

86. (L2, T) Что такое target?

**Ответ:** Основной строительный блок в современном CMake, представляющий артефакт сборки (исполняемый файл или библиотеку), к которому инкапсулированно привязываются исходники, пути заголовков, флаги и зависимости.

**Пример:**

```cmake
add_library(Engine STATIC engine.cpp)
```

**Источник:** [CMake Targets](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html?utm_source=gemini#targets)

87. (L2, T) PUBLIC vs PRIVATE vs INTERFACE

**Ответ:** Спецификаторы транзитивности зависимостей target:

* `PRIVATE` — свойство нужно только самому таргету;

* `INTERFACE` — свойство передается только внешним потребителям этого таргета;

* `PUBLIC` — свойство применяется и к самому таргету, и ко всем, кто с ним линкуется.

**Пример:**

```cmake
target_include_directories(MyLib PUBLIC include/ PRIVATE src/)
```

**Источник:** [CMake: Transitive Usage Requirements](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html?utm_source=gemini#transitive-usage-requirements)

88. (L2, P) add_executable / add_library

**Ответ:** Команды создания целей исполнения и библиотек (`STATIC`, `SHARED`, `INTERFACE`).

**Пример:**

```cmake
add_library(Core STATIC core.cpp)
add_executable(App main.cpp)
```

**Источник:** [CMake Command Reference](https://cmake.org/cmake/help/latest/manual/cmake-commands.7.html?utm_source=gemini)

89. (L2, P) target_link_libraries

**Ответ:** Связывает зависимости между целями, автоматически пробрасывая флаги линковщика, пути поиска инклудов и дефайны компилятора согласно их транзитивности.

**Пример:**

```cmake
target_link_libraries(App PRIVATE Core)
```

**Источник:** [CMake: target_link_libraries](https://cmake.org/cmake/help/latest/command/target_link_libraries.html?utm_source=gemini)

---

## L3

90. (L3, T) Как работает find_package?

**Ответ:** Команда ищет внешнюю библиотеку в системе. Работает в двух режимах: ищет файл поиска `Find<Package>.cmake` в путях `CMAKE_MODULE_PATH`, либо ищет готовый конфигурационный пакет `<Package>Config.cmake`, поставляемый самой библиотекой.

**Пример:**

```cmake
find_package(OpenSSL REQUIRED)
target_link_libraries(App PRIVATE OpenSSL::SSL)
```

**Источник:** [CMake: find_package](https://cmake.org/cmake/help/latest/command/find_package.html?utm_source=gemini)

91. (L3, T) Module vs Config mode

**Ответ:** Module mode ищет внешний скрипт-обертку `FindXXX.cmake` (пишется третьими лицами или CMake). Config mode ищет файл `XXXConfig.cmake`, который сгенерирован и установлен автором самой библиотеки с точным описанием ее таргетов.

**Пример:**

```cmake
find_package(Boost CONFIG REQUIRED) # Принудительно Config mode
```

**Источник:** [CMake Packages Modes](https://cmake.org/cmake/help/latest/command/find_package.html?utm_source=gemini#search-modes)

92. (L3, P) Использование toolchain file

**Ответ:** Файл скрипта, передаваемый параметром `-DCMAKE_TOOLCHAIN_FILE`, переопределяющий целевую платформу, системный корень (sysroot) и пути к кросс-компиляторам.

**Пример:**

```cmake
# arm-toolchain.cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)
set(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc)
```

**Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html?utm_source=gemini)

93. (L3, D) Почему не находится библиотека?

**Ответ:** Каталог установки библиотеки отсутствует в путях поиска `CMAKE_PREFIX_PATH`; не совпадает регистр букв в имени; библиотека собрана под другую разрядность (32 vs 64 бит); отсутствуют права доступа к директории.

**Пример:**

```bash
cmake -B build -DCMAKE_PREFIX_PATH=/opt/my_custom_package
```

**Источник:** [CMake: CMAKE_PREFIX_PATH](https://cmake.org/cmake/help/latest/variable/CMAKE_PREFIX_PATH.html?utm_source=gemini)

---

## L4

94. (L4, S) Как проектировать CMake для large-scale проекта?

**Ответ:** 1) Строго следовать парадигме Modern Target-based CMake (никаких глобальных `include_directories`); 2) Использовать алиасы таргетов (`MyLib::Core`); 3) Ограничивать видимость через `PRIVATE`; 4) Разделять проект на независимые компоненты, поддерживающие установку (`install(EXPORT)`); 5) Использовать `ccache` и PCH.

**Пример:**

```cmake
add_library(MyOrg::Core ALIAS Core)
```

**Источник:** [Professional CMake: A Practical Guide (Craig Scott)](https://crascit.com/professional-cmake/?utm_source=gemini)

95. (L4, T) Как реализовать reusable modules?

**Ответ:** Написать `*Config.cmake.in` шаблон с использованием генератора экспорта таргетов `CMakePackageConfigHelpers`, формируя экспортируемый namespace при установке.

**Пример:**

```cmake
install(TARGETS Core EXPORT CoreTargets DESTINATION lib)
install(EXPORT CoreTargets NAMESPACE MyLib:: DESTINATION lib/cmake/MyLib)
```

**Источник:** [CMake: Packaging Software](https://cmake.org/cmake/help/latest/manual/cmake-packages.7.html?utm_source=gemini)

96. (L4, D) Debugging сложного dependency graph

**Ответ:** Сгенерировать граф зависимостей в формате Graphviz с помощью флага `--graphviz` и визуализировать его утилитой `dot`.

**Пример:**

```bash
cmake -B build --graphviz=graph.dot
dot -Tpng graph.dot -o deps.png
```

**Источник:** [CMake Graphviz Support](https://cmake.org/cmake/help/latest/module/CMakeGraphVizOptions.html?utm_source=gemini)

---

# 6. Ninja / Bazel / Meson

## L2

97. (L2, T) Почему Ninja быстрее Make?

**Ответ:** Ninja предельно упрощена: в ней нет циклов, скриптовых условий и функций. Входной файл `build.ninja` содержит плоский готовый граф. Ninja загружает его за миллисекунды, мгновенно опрашивает mtime через системные батч-вызовы и полностью параллелит сборку без блокировок.

**Пример:**

```bash
ninja -C build -j 16
```

**Источник:** [The Ninja Build System](https://ninja-build.org/?utm_source=gemini)

98. (L2, T) Что такое minimal build system?

**Ответ:** Сборочный инструмент (типа Ninja), намеренно лишенный высокоуровневой логики конфигурирования. Его единственная задача — максимально быстро исполнить готовый ориентированный граф команд без вычислений условий на лету.

**Пример:**

```
CMake (High-Level Meta) -> генерирует build.ninja -> Ninja (Minimal Low-Level Engine)
```

**Источник:** [Ninja Design Principles](https://ninja-build.org/manual.html?utm_source=gemini#_design_goals)

---

## L3

99. (L3, T) Что такое hermetic build (Bazel)?

**Ответ:** Герметичная сборка — система, в которой сборка изолирована от хостовой машины: используются строго фиксированные тулчейны, скачиваемые самой системой сборки, а доступ к глобальным `/usr/include` и сети во время компиляции заблокирован.

**Пример:**

```python
# WORKSPACE: фиксация компилятора и зависимостей вплоть до sha256
```

**Источник:** [Bazel: Hermeticity](https://bazel.build/basics/hermeticity?utm_source=gemini)

100. (L3, T) Что такое sandboxing?

**Ответ:** Запуск каждого шага компиляции в изолированном пространстве (Linux namespaces / chroot): шаг сборки видит строго те входные файлы, которые были явно объявлены в зависимостях. Если забыли объявить инклуд — сборка упадет.

**Пример:**

```
Bazel выполняет компиляцию в пустой песочнице с симлинками только на разрешенные файлы.
```

**Источник:** [Bazel Sandboxing](https://bazel.build/docs/sandboxing?utm_source=gemini)

101. (L3, T) Что такое reproducible build?

**Ответ:** Сборка, гарантирующая идентичность итоговых бинарных файлов байт-в-байт при сборке из одного и того же коммита на любой машине в любое время (исключены влияние временных меток, путей и порядка файлов).

**Пример:**

```bash
sha256sum build_a/app build_b/app # Хэши совпадают на 100%
```

**Источник:** [Reproducible Builds Project](https://reproducible-builds.org/?utm_source=gemini)

---

## L4

102. (L4, S) Когда стоит мигрировать на Bazel?

**Ответ:** Когда размер монорепозитория превышает миллионы строк кода, кодовая база мультиязычна (C++, Java, Go, Python), сборка на одной машине занимает часы, и критически необходим распределенный кэш (Remote Caching) и распределенное выполнение (Remote Execution).

**Пример:**

```
Google, Uber, Stripe используют Bazel для монорепозиториев.
```

**Источник:** [Bazel FAQ: When should I use Bazel?](https://bazel.build/faq?utm_source=gemini)

103. (L4, S) Trade-offs Meson vs CMake

**Ответ:** Meson проще, имеет строгий непрограммируемый синтаксис (меньше спагетти-кода), работает поверх Ninja по умолчанию и очень быстр. CMake сложнее, имеет синтаксис на макросах, но является абсолютным стандартом индустрии с поддержкой любых IDE, библиотек и тулчейнов.

**Пример:**

```
Meson идеален для GNOME/Systemd проектов чистого C.
CMake обязателен для коммерческого C++ из-за интеграций.
```

**Источник:** [Meson Build System vs CMake Comparison](https://mesonbuild.com/Comparisons.html?utm_source=gemini)

---

# 7. Dependency Management

## L1

104. (L1, T) Что такое dependency?

**Ответ:** Сторонняя библиотека, модуль или компонент, функции которого вызываются программой для реализации требуемой функциональности без написания собственного аналога.

**Пример:**

```
Наш сервис -> зависит от libcurl -> зависит от OpenSSL
```

**Источник:** [Software Engineering at Google (Titus Winters)](https://abseil.io/resources/swe-book?utm_source=gemini)

105. (L1, T) Что такое system package?

**Ответ:** Библиотека или инструмент, установленный централизованно администратором в глобальные каталоги операционной системы через пакетный менеджер дистрибутива (`apt`, `yum`, `pacman`).

**Пример:**

```bash
sudo apt install libboost-all-dev
```

**Источник:** [Debian Package Management Basics](https://www.debian.org/doc/manuals/debian-faq/pkg-basics.en.html?utm_source=gemini)

---

## L2

106. (L2, T) Что такое vendoring?

**Ответ:** Практика сохранения исходного кода сторонних библиотек непосредственно внутри своего репозитория (в каталоге `third_party/` или `vendor/`), исключающая зависимость процесса сборки от сети и сторонних серверов.

**Пример:**

```
my_project/
  ├── src/
  └── third_party/sqlite/sqlite3.c
```

**Источник:** [Go Modules and Vendoring Guide](https://go.dev/ref/mod#vendoring?utm_source=gemini)

107. (L2, T) Что такое version pinning?

**Ответ:** Явная фиксация точной версии зависимости (вплоть до конкретного тега, коммита или sha256 хеша), запрещающая сборщику подтягивать плавающие новые обновления (типа `latest`).

**Пример:**

```
conanfile.txt:
[requires]
zlib/1.2.13#b79f88d6b8ef3f48a478b0a94cb22c54
```

**Источник:** [Conan Package Manager: Versioning](https://docs.conan.io/2/tutorial/consuming_packages.html?utm_source=gemini)

108. (L2, D) Почему разные версии ломают билд?

**Ответ:** Новая версия может удалить объявленный метод (API break), изменить сигнатуру, или нарушить раскладку байт структур в памяти при линковке со старыми объектниками (ABI break).

**Пример:**

```c
// Было: void init(int);
// Стало: void init(int, bool); -> Ошибка компиляции: too few arguments
```

**Источник:** [Semantic Versioning 2.0.0](https://semver.org/?utm_source=gemini)

---

## L3

109. (L3, T) Что такое dependency hell?

**Ответ:** Конфликт транзитивных зависимостей: модуль A требует библиотеку C v1.0, а модуль B требует ту же библиотеку C v2.0. В одном C++ бинарнике нельзя слинковать две разные версии одной библиотеки из-за коллизии глобальных символов (ODR violation).

**Пример:**

```
       [ App ]
      /       \
  [ LibA ]   [ LibB ]
     |          |
  [ C v1 ]   [ C v2 ] -> ODR Crash / Duplicate symbols
```

**Источник:** [Modern C++ and Package Managers (Conan Docs)](https://docs.conan.io/2/knowledge/guidelines.html?utm_source=gemini)

110. (L3, T) Как работает pkg-config?

**Ответ:** Утилита считывает специальные манифесты `.pc`, в которых разработчики библиотек декларируют пути инклудов, флаги линковки и список транзитивных зависимостей, подставляя их в команды компилятора.

**Пример:**

```bash
pkg-config --cflags --libs libpng
# -I/usr/include/libpng16 -lpng16
```

**Источник:** [Freedesktop: pkg-config Guide](https://www.freedesktop.org/wiki/Software/pkg-config/?utm_source=gemini)

111. (L3, P) Использование pkg-config

**Ответ:** Вызов `pkg-config` внутри Makefile или интеграция с CMake через `PkgConfig`.

**Пример:**

```makefile
CFLAGS += $(shell pkg-config --cflags glib-2.0)
LDFLAGS += $(shell pkg-config --libs glib-2.0)
```

**Источник:** [CMake: FindPkgConfig](https://cmake.org/cmake/help/latest/module/FindPkgConfig.html?utm_source=gemini)

---

## L4

112. (L4, S) Как обеспечить reproducible dependencies?

**Ответ:** Использовать пакетные менеджеры с lock-файлами (Conan, vcpkg) с обязательной проверкой криптографических контрольных сумм тарболов; поднимать собственный локальный репозиторий артефактов (Artifactory/Nexus); собирать зависимости в единых герметичных Docker-образах тулчейна.

**Пример:**

```json
// conan.lock фиксирует точный sha256 и все транзитивные узлы графа
```

**Источник:** [Conan Lockfiles Architecture](https://docs.conan.io/2/knowledge/design_requirements/lockfiles.html?utm_source=gemini)

113. (L4, S) Как управлять ABI compatibility?

**Ответ:** Внедрить автоматический CI-пайплайн проверки ABI (libabigail), блокирующий PR при несовместимости; строго следовать Semantic Versioning; инкапсулировать изменения через Pimpl; избегать передачи STL-контейнеров через границы shared-библиотек.

**Пример:**

```yaml
# CI шаг:
- name: ABI check
  run: abidiff --leaf-changes-only old_lib.so new_lib.so
```

**Источник:** [Libabigail in CI (Red Hat Developer)](https://developers.redhat.com/blog/2019/04/24/how-to-use-libabigail-to-check-for-abi-changes?utm_source=gemini)

---

# 8. Practical / Real-world Scenarios

## L2

114. (L2, D) Билд работает локально, но падает в CI — причины?

**Ответ:** 1) Разница в версиях компиляторов и стандартных библиотек; 2) Необъявленная зависимость установлена на локальной машине, но отсутствует в чистом CI контейнере; 3) Чувствительность к регистру файловой системы (macOS case-insensitive vs Linux case-sensitive); 4) Полагание на локальный кэш сборки.

**Пример:**

```cpp
#include "Header.h" // На macOS локально скомпилируется, на Linux в CI упадет: "header.h: No such file"
```

**Источник:** [Martin Fowler: Continuous Integration Pitfalls](https://martinfowler.com/articles/continuousIntegration.html?utm_source=gemini)

115. (L2, D) Почему не линкуется библиотека?

**Ответ:** Ошибочный путь в `-L`; не указано имя в `-l`; имя файла не начинается с префикса `lib` (например, `foo.so` вместо `libfoo.so`); несовпадение разрядности архитектуры (x86 vs x86_64).

**Пример:**

```bash
# /usr/bin/ld: cannot find -lfoo: No such file or directory
# Решение: добавить путь: -L/path/to/dir
```

**Источник:** [GCC Linking Options](https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html?utm_source=gemini)

---

## L3

116. (L3, D) Почему бинарь падает только на другой машине?

**Ответ:** 1) Использовался флаг `-march=native`, сгенерировавший инструкции AVX2/AVX-512, отсутствующие на целевом CPU (падение с `Illegal instruction`); 2) Бинарник скомпилирован с более новой glibc, чем установлена на целевой ОС (`version GLIBC_2.34 not found`).

**Пример:**

```bash
# Crash: Illegal instruction (core dumped)
# Причина: сборка с -march=native запущена на старом процессоре
```

**Источник:** [Red Hat: How glibc works and backward compatibility](https://developers.redhat.com/blog/2016/02/23/why-the-new-glibc-breaks-compatibility?utm_source=gemini)

117. (L3, D) Почему изменение header пересобирает весь проект?

**Ответ:** Заголовок транзитивно включен в базовый корневой хедер проекта (например, в `common.h` или `pch.h`), от которого прямо или косвенно зависят абсолютно все остальные единицы трансляции в графе зависимостей.

**Пример:**

```
Core.h (изменен) -> включен в Base.h -> включен во все 500 .cpp файлов
```

**Источник:** [Large-Scale C++ Software Design (John Lakos)](https://www.informit.com/store/large-scale-c-plus-plus-software-design-9780201633627?utm_source=gemini)

118. (L3, D) Почему увеличилось время сборки?

**Ответ:** Попадание тяжелых шаблонных заголовочных файлов (STL, Boost, JSON) в часто включаемые хедеры; отключение или инвалидация Precompiled Headers (PCH); раздувание макросов; отключение инкрементальности в CI.

**Пример:**

```bash
# Анализ времени сборки каждого хедера в Clang:
clang++ -ftime-trace main.cpp
```

**Источник:** [Aras Pranckevičius: Tune Compilation Times with -ftime-trace](https://aras-p.info/blog/2019/01/16/time-trace-timeline-flame-chart-profiler-for-Clang/?utm_source=gemini)

---

## L4

119. (L4, S) Как уменьшить build time в 10x?

**Ответ:** 1) Заменить линкер `ld` на многопоточный `mold` или `lld` (ускоряет линковку в 5–10 раз); 2) Внедрить распределенный кэш сборки `sccache` / `ccache`; 3) Использовать Ninja вместо Make; 4) Внедрить Unity-билды для релизной сборки; 5) Использовать PCH и переходить на C++20 Modules; 6) Сократить инклуды через forward declarations и pImpl.

**Пример:**

```bash
# Использование mold ускоряет линковку гигантских бинарников с минут до секунд:
clang++ -fuse-ld=mold main.o -o app
```

**Источник:** [Rui Ueyama: Mold - A Modern Linker](https://github.com/rui314/mold?utm_source=gemini)

120. (L4, S) Как сделать build reproducible?

**Ответ:** 1) Зафиксировать все пути компилятора через флаг `-ffile-prefix-map`; 2) Переопределить макросы времени и даты переменной `SOURCE_DATE_EPOCH`; 3) Зафиксировать порядок передачи файлов линкеру (сортировка аргументов); 4) Собирать внутри изолированных контейнеров с единым locale (`LC_ALL=C`).

**Пример:**

```bash
export SOURCE_DATE_EPOCH=$(git log -1 --pretty=%ct)
gcc -ffile-prefix-map=$(pwd)=. -c main.c -o main.o
```

**Источник:** [Reproducible Builds: SOURCE_DATE_EPOCH Specification](https://reproducible-builds.org/docs/source-date-epoch/?utm_source=gemini)

121. (L4, S) Как проектировать build system для монорепозитория?

**Ответ:** 1) Использовать артефактно-ориентированную систему сборки (Bazel/Buck2) с графом строго ориентированного ациклического вида (DAG); 2) Обеспечить полную герметичность тулчейнов и зависимостей; 3) Развернуть ферму удаленного кэширования (Remote Caching) и распределенного выполнения компиляции (Remote Execution); 4) Интегрировать Change Detection (сборка строго затронутых PR таргетов).

**Пример:**

```
[ Git Monorepo ] -> [ Target Graph Analyzer ] -> [ Remote Execution Engine ] -> [ Distributed Cache ]
```

**Источник:** [Software Engineering at Google (Build Systems and Monorepos)](https://abseil.io/resources/swe-book?utm_source=gemini)
