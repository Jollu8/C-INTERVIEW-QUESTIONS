# Tools / Debug / Build

## Overview

Этот документ описывает ключевые области знаний для C++ разработчика в Linux-среде с акцентом на:

* инструменты (tools)
* сборку (build systems)
* отладку (debugging)

Можно использовать как:

* чеклист навыков
* основу для подготовки к интервью
* базу для внутреннего knowledge sharing

---

# 1. [Build Systems](./01_build.md)

## 1.1 Основы сборки

* Что такое compilation pipeline (preprocess → compile → link)
* Разница между static и dynamic linking
* Что такое ABI и почему он важен
* Role of linker (`ld`, `gold`, `lld`)

## 1.2 Make и low-level сборка

* Как работает Makefile (targets, dependencies)
* Что такое phony targets
* Инкрементальная сборка: как она реально определяется
* Dependency hell: как Make решает (или не решает)

## 1.3 CMake

* Target-based подход vs старый style (variables)
* PUBLIC / PRIVATE / INTERFACE
* add_library / add_executable
* find_package: как работает под капотом
* toolchain files (cross-compiling)
* generator'ы (Ninja vs Make)

## 1.4 Другие build системы

* Ninja — зачем нужен и почему быстрее Make
* Bazel — hermetic builds, sandboxing
* Meson — современная альтернатива

## 1.5 Управление зависимостями

* vendoring vs system packages
* vcpkg / Conan
* ABI compatibility между библиотеками
* version pinning

---

# 2. [Toolchain & Tooling](./02_toolchain.md)

## 2.1 Компиляторы

* GCC vs Clang
* Основные флаги:

    * `-O0/-O2/-O3`
    * `-g`
    * `-Wall -Wextra -Werror`
* undefined behavior и его последствия

## 2.2 Линковка

* static vs shared libraries (.a vs .so)
* rpath / runpath
* symbol visibility (`-fvisibility=hidden`)
* проблемы multiple definition

## 2.3 Binary tools

* `nm`, `objdump`, `readelf`
* как читать symbols
* как понять, почему не линкуется

## 2.4 Package management (Linux)

* apt / yum / pacman
* как устроены dev-пакеты
* pkg-config: что он реально делает

## 2.5 IDE / Editors

* VS Code + clangd
* CLion
* compile_commands.json — зачем нужен

---

# 3. [Debugging](./03_debugging.md)

## 3.1 Основы отладки

* debug symbols (`-g`)
* stack trace: как формируется
* core dump: как включить и анализировать

## 3.2 GDB

* breakpoints (conditional, watchpoints)
* stepping (step / next / finish)
* inspect variables / memory
* attach к процессу
* debugging multithreaded программ

## 3.3 Memory debugging

* Valgrind

    * memcheck
    * leak detection
* AddressSanitizer
* UBSan

## 3.4 Post-mortem анализ

* core dumps + gdb
* символы vs stripped binaries
* debugging production crashes

## 3.5 Logging

* structured logging
* уровни логирования
* performance impact логов

---

# 4. [Performance & Profiling](./04_performance.md)

## 4.1 CPU profiling

* perf
* gprof
* flamegraphs

## 4.2 Memory profiling

* heap profiling
* fragmentation
* cache locality

## 4.3 Benchmarking

* microbenchmarks vs macro
* влияние оптимизаций компилятора
* false sharing

---

# 5. [Runtime & System Level](./05_runtime.md)

## 5.1 Процессы и потоки

* fork / exec
* pthreads
* race conditions

## 5.2 Работа с системой

* file descriptors
* signals
* epoll/select

## 5.3 Dynamic loading

* dlopen / dlsym
* plugin architectures

---

# 6. [CI/CD и автоматизация](./06_ci.md)

## 6.1 CI pipelines

* сборка + тесты + линтинг
* caching build artifacts

## 6.2 Инструменты

* GitHub Actions
* GitLab CI
* Jenkins

## 6.3 Code quality

* clang-tidy
* clang-format
* static analysis

---

# 7. [Типовые вопросы (для самопроверки)](./07_type_questions.md)

## Build

* Почему проект может собираться на одной машине и падать на другой?
* Что произойдет, если изменить header?
* Как уменьшить время сборки?

## Debug

* Как найти memory leak в production?
* Что делать, если crash без stack trace?
* Как дебажить зависание (deadlock)?

## Tools

* Как понять, какая библиотека реально подлинкована?
* Как анализировать ELF бинарник?
* Как воспроизвести баг из CI локально?

---

# 8. [Advanced Topics (опционально)](./08_advanced_topic.md)

* LTO (Link Time Optimization)
* PGO (Profile Guided Optimization)
* Cross-compilation (embedded, ARM)
* Reproducible builds
* Sanitizers в CI

