# C/C++ Advanced Topics Question Bank (Linux)

160 вопросов с ответами: LTO/PGO, cross-compilation, reproducible builds и sanitizers. Примеры ориентированы на Linux, GCC/Clang и CMake; поддержка зависит от target/toolchain. Пример PGO использует Clang instrumentation, которую нельзя смешивать с GCC profile data. Отдельно различаются language requirements, ограничения инструментов и инженерные решения.

## Legend

* **L1** — базовый (понимание концепции)

* **L2** — middle (уверенное применение)

* **L3** — senior (глубокое понимание и диагностика)

* **L4** — staff (архитектура и стратегия)

* **[T]** — теория

* **[P]** — практика

* **[D]** — debugging / investigation

* **[S]** — system design / engineering strategy

---

# 8. Advanced Topics

---

## 8.1 LTO (Link Time Optimization)

## L1

1. (L1, T) Что такое LTO?

   **Ответ:** Link Time Optimization переносит часть compiler optimization на объединённое представление нескольких translation units при linking.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

2. (L1, T) Чем LTO отличается от обычной оптимизации компилятора?

   **Ответ:** Обычная оптимизация ограничена доступным translation unit; LTO расширяет межфайловую видимость для анализа и codegen.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

3. (L1, T) Почему LTO выполняется на этапе линковки?

   **Ответ:** Там известен набор участвующих modules и resolution symbols, позволяющий согласованные межмодульные решения.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

4. (L1, T) Какие задачи решает LTO?

   **Ответ:** Межмодульный inline, dead-code elimination, constant propagation и иногда devirtualization при выполнении необходимых предпосылок.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

5. (L1, T) Какие риски у LTO?

   **Ответ:** Дополнительные build time/RAM, toolchain compatibility и сложная диагностика; ускорение и уменьшение размера не гарантированы.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

6. (L1, P) Как включить LTO при сборке?

   **Ответ:** В CMake проверить `check_ipo_supported()` и включить target property `INTERPROCEDURAL_OPTIMIZATION`; GCC -flto нужен в compile и final link.

   **Пример:** В CMake 3.9+ после объявления target `app`:

   ```cmake
   include(CheckIPOSupported)
   check_ipo_supported(RESULT ipo_ok OUTPUT ipo_error LANGUAGES CXX)
   if(ipo_ok)
     set_property(TARGET app PROPERTY INTERPROCEDURAL_OPTIMIZATION TRUE)
   else()
     message(FATAL_ERROR "IPO requested but unsupported: ${ipo_error}")
   endif()
   ```

   Используйте проект с современным `cmake_minimum_required`, устанавливающим нужные policies. Этот пример явно требует IPO и падает, если выбранный toolchain его не поддерживает.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

7. (L1, D) Почему сборка с LTO дольше?

   **Ответ:** Link step выполняет дополнительный анализ и code generation; масштаб зависит от программы и реализации LTO.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

8. (L1, T) Почему LTO может улучшить performance?

   **Ответ:** Видит callers/callees между файлами и устраняет work, который локальный compiler не мог безопасно удалить.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

9. (L1, T) Почему LTO может увеличить размер бинаря?

   **Ответ:** Inlining, cloning и specialization дублируют code; dead-code removal может уменьшать размер, поэтому результат измеряют.

   **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

10. (L1, D) Почему LTO может “сломать” билд?

    **Ответ:** Несовместимые IR/plugins, archive tools, flags и definitions либо проявившееся UB; сохранить полную compile/link диагностику.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)


## L2

11. (L2, T) Что такое interprocedural optimization (IPO)?

    **Ответ:** Оптимизация с использованием информации между functions: inline, propagation, side-effect analysis и другие преобразования.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

12. (L2, T) Какие оптимизации возможны только с LTO?

    **Ответ:** LTO делает меж-TU inline/analysis возможными без ручного объединения исходников; сами классы оптимизаций не уникальны для LTO.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

13. (L2, D) Почему LTO может выявить ошибки линковки, которые раньше не проявлялись?

    **Ответ:** Более полный анализ может обнаружить type/ODR mismatches и несовместимые modules, ранее скрытые границами object files.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

14. (L2, T) Как LTO влияет на inline?

    **Ответ:** Расширяет набор доступных callees для inline, но heuristic учитывает размер/горячесть и может отклонить вызов.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

15. (L2, P) Как комбинировать LTO с static/shared libraries?

    **Ответ:** Static archives могут хранить LTO objects при compatible tools; shared-library boundaries обычно ограничивают optimization и interposition assumptions.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

16. (L2, D) Почему разные компиляторы по-разному реализуют LTO?

    **Ответ:** Различаются IR, summary/index models, plugins и optimization pipelines; compiler-specific bitcode не является общим ABI.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

17. (L2, T) Что такое thin LTO?

    **Ответ:** LLVM ThinLTO использует summaries и выборочный import с parallel backend, уменьшая цену монолитного whole-program анализа.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

18. (L2, D) Почему LTO требует согласованного toolchain?

    **Ответ:** IR formats и linker/plugin protocols не обязаны быть совместимы между versions/vendors; фиксировать supported combination.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

19. (L2, P) Как измерить эффект LTO?

    **Ответ:** Одинаковые flags/workload кроме LTO, несколько повторов, performance/size/build-time/RAM metrics и correctness tests.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

20. (L2, D) Почему LTO ухудшает debugability?

    **Ответ:** Inlining, elimination и code motion усложняют source stepping/locals; хранить symbols exact optimized build.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)


## L3

21. (L3, T) Как LTO влияет на symbol visibility и ABI?

    **Ответ:** Visibility/interposition определяют допустимые assumptions; export ABI должен оставаться явным, hidden не означает автоматически whole-program ownership.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

22. (L3, D) Почему LTO может менять layout кода и ломать профили?

    **Ответ:** Addresses и inlining меняются; старый address-based profile требует корректного matching/mapping и не переносится слепо.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

23. (L3, D) Почему LTO может приводить к нестабильным performance результатам?

    **Ответ:** Меняются code layout, cache effects и heuristics; проверить representative workloads и noise вместо одного запуска.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

24. (L3, T) Как LTO взаимодействует с PGO?

    **Ответ:** PGO добавляет сведения о горячести, LTO — межмодульную видимость; вместе могут улучшать inline/layout decisions.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

25. (L3, D) Почему LTO может ломать incremental builds?

    **Ответ:** Расширяет invalidation и стоимость relink; пропущенные dependency edges ломают correctness, а само LTO не требует неверного incremental результата.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

26. (L3, D) Как диагностировать miscompilation из-за LTO?

    **Ответ:** Минимизировать reproducer, сравнить LTO on/off, проверить UB/ODR и версии; сохранить preprocessed inputs и commands для compiler report.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

27. (L3, P) Как selectively отключать LTO для отдельных модулей?

    **Ответ:** Управлять IPO property для target или собирать часть objects без -flto; проверить смешанный link на конкретном toolchain.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

28. (L3, D) Почему LTO может конфликтовать с sanitizer'ами?

    **Ответ:** Возможны unsupported combinations/runtime requirements, но LTO и sanitizers не запрещены вообще; проверять documented support и compile/link consistency.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

29. (L3, S) Когда LTO оправдан в production?

    **Ответ:** Когда measured runtime/size gain окупает build/maintenance cost и все supported platforms проходят validation.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

30. (L3, S) Когда LTO — лишняя сложность?

    **Ответ:** Когда bottleneck вне compiler-optimizable code либо gains малы относительно стоимости linking и диагностики.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)


## L4

31. (L4, S) Как внедрять LTO в большой кодовой базе безопасно?

    **Ответ:** Pilot targets, baseline correctness/performance, toolchain pinning, canary rollout и простой способ отключения.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

32. (L4, S) Как строить pipeline: LTO only for release?

    **Ответ:** Отдельный release preset с IPO, быстрый developer preset без него; регулярно тестировать exact release configuration.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

33. (L4, D) Как расследовать rare bugs, вызванные LTO?

    **Ответ:** Сохранить exact artifact, profile/config и symbols; сравнить affected modules с LTO off и исключить UB перед обвинением compiler.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

34. (L4, S) Как оценивать ROI от LTO?

    **Ответ:** Сопоставить CPU/cost/size savings с build time, RAM, CI capacity и engineering maintenance.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)

35. (L4, S) Как формализовать policy использования LTO в команде?

    **Ответ:** Указать поддерживаемые toolchains/targets, mandatory checks, exception owners и критерии включения/отката.

    **Источник:** [GCC: Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html); [LLVM ThinLTO](https://clang.llvm.org/docs/ThinLTO.html); [CMake IPO](https://cmake.org/cmake/help/latest/module/CheckIPOSupported.html)


    ---

## 8.2 PGO (Profile Guided Optimization)

## L1

36. (L1, T) Что такое PGO?

    **Ответ:** Profile Guided Optimization использует runtime profile для compiler decisions о горячести и распределении исполнения.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

37. (L1, T) Как PGO отличается от LTO?

    **Ответ:** PGO добавляет данные исполнения, LTO расширяет область анализа; они независимы и могут сочетаться.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

38. (L1, T) Какие данные использует PGO?

    **Ответ:** Частоты выполнения branches/functions, value profiles либо samples; состав зависит от compiler и метода сбора.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

39. (L1, P) Какие этапы у PGO?

    **Ответ:** Собрать training build, выполнить representative workload, обработать profile и собрать optimized profile-use build.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

40. (L1, T) Почему PGO может сильно ускорить код?

    **Ответ:** Помогает выбирать inline, layout и specialization по реальной горячести вместо общих heuristics.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

41. (L1, D) Почему PGO может ухудшить производительность?

    **Ответ:** Нерепрезентативный профиль и trade-offs code size/layout могут ухудшать реальные hot paths.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

42. (L1, T) Какие типы оптимизаций делает PGO?

    **Ответ:** Branch probabilities, hot/cold splitting, inline, layout и value-guided specialization в зависимости от toolchain.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

43. (L1, P) Как собрать профилированную сборку?

    **Ответ:** Clang instrumentation: compile/link с `-fprofile-instr-generate`, запуск с LLVM_PROFILE_FILE, merge llvm-profdata, rebuild с `-fprofile-instr-use=...`.

    **Пример:** Полный Clang instrumentation цикл для условного single-file `main.cpp`:

    ```bash
    clang++ -O2 -g -fprofile-instr-generate main.cpp -o app-train
    LLVM_PROFILE_FILE='training-%p.profraw' ./app-train training-input.dat
    llvm-profdata merge -output=training.profdata training-*.profraw
    clang++ -O2 -g -fprofile-instr-use=training.profdata main.cpp -o app-pgo
    ./app-pgo validation-input.dat
    ```

    Запускают в отдельном чистом training directory, чтобы glob не смешивал чужие builds. `llvm-profdata` выбирают совместимый с Clang; source и остальные flags сохраняют.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

44. (L1, T) Почему важен representative workload?

    **Ответ:** Compiler оптимизирует наблюдавшиеся paths; training должен покрывать реальные operation mix, sizes и важные редкие сценарии.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

45. (L1, D) Почему PGO чувствителен к input данным?

    **Ответ:** Inputs определяют branches, calls и values; изменение распределений меняет полезность решений optimizer.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)


## L2

46. (L2, T) Какие ошибки возможны при неправильном PGO?

    **Ответ:** Несовместимый/stale profile, неверный merge weights, missing modules и ignored warnings; instrumentation/profile-use flags должны соответствовать методу.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

47. (L2, D) Почему “плохой профиль” хуже, чем отсутствие PGO?

    **Ответ:** Профиль уверенно направляет optimizer к неверным hot paths и может вытеснить важный code из cache.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

48. (L2, T) Как PGO влияет на branch prediction?

    **Ответ:** Даёт compiler branch probabilities для layout и transformations; это не прямое программирование аппаратного predictor.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

49. (L2, T) Как PGO влияет на inlining?

    **Ответ:** Горячие calls могут чаще inline, холодные — оставаться вызовами; результат зависит от heuristics и size budgets.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

50. (L2, P) Как автоматизировать сбор профилей?

    **Ответ:** Versioned training harness, fixed datasets/weights, unique per-process profile files и deterministic merge/validation.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

51. (L2, D) Почему profile data устаревает?

    **Ответ:** Меняются source/control flow, compiler или workload; профиль требует совместимости и регулярного обновления.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

52. (L2, T) Как PGO взаимодействует с cache locality?

    **Ответ:** Группирует горячий code и меняет inline/layout, влияя на instruction cache; data locality автоматически не исправляется.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

53. (L2, D) Почему PGO может ухудшить cold paths?

    **Ответ:** Ресурсы code-size/layout отдаются горячим путям; редкие, но latency-critical paths нужно измерять отдельно.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

54. (L2, P) Как проверить корректность профиля?

    **Ответ:** Проверить compiler diagnostics, profile summary/counts и workload coverage; отсутствие warnings не доказывает репрезентативность.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

55. (L2, D) Почему PGO усложняет debugging?

    **Ответ:** Specialization, inline и code motion уменьшают source correspondence; profile-use executable/symbols нужно сохранять точно.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)


## L3

56. (L3, D) Как диагностировать regression после включения PGO?

    **Ответ:** Повторить baseline A/B, проверить training mix/profile compatibility, hot/cold paths и code-size/cache changes.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

57. (L3, T) Как PGO влияет на layout функций?

    **Ответ:** Может размещать часто вызываемые functions и blocks ближе, отделяя cold code; конкретный layout зависит от linker/compiler.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

58. (L3, D) Почему PGO может “переобучиться” на workload?

    **Ответ:** Training покрывает узкий набор входов, и оптимизация за его пределами не приносит пользы либо вредит.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

59. (L3, T) Как PGO взаимодействует с LTO?

    **Ответ:** Profile-guided hotness помогает межмодульным решениям LTO; validation должна охватывать совместный pipeline.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

60. (L3, P) Как сравнивать performance с/без PGO?

    **Ответ:** Одинаковый source/toolchain/workload и flags кроме PGO, независимый validation dataset и повторные замеры всех SLO.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

61. (L3, D) Почему PGO нестабилен между релизами?

    **Ответ:** Профиль, code layout и hot paths меняются с source/workload; сравнение требует fresh compatible profile.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

62. (L3, S) Когда PGO оправдан?

    **Ответ:** Для достаточно дорогих CPU-heavy стабильных workloads, где measured gain оправдывает training и сопровождение.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

63. (L3, D) Как понять, что PGO не дает пользы?

    **Ответ:** Разница укладывается в noise либо cost/latency не улучшаются на representative validation workloads.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

64. (L3, D) Почему PGO может увеличивать binary size?

    **Ответ:** Горячие functions могут inline/clone/specialize, увеличивая размер ради скорости.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

65. (L3, S) Как интегрировать PGO в CI/CD?

    **Ответ:** Training/profile artifacts связывать с source/compiler IDs, затем separate profile-use build и full correctness/performance validation.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)


## L4

66. (L4, S) Как строить PGO pipeline для production сервиса?

    **Ответ:** Репрезентативный corpus, versioned collector, controlled merge, immutable profile и canary rollout с fallback без PGO.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

67. (L4, S) Как автоматизировать сбор профилей с production трафика?

    **Ответ:** Использовать поддерживаемый sampling/instrumentation с bounded overhead, собирать versioned profiles и агрегировать weights без смешения incompatible builds.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

68. (L4, D) Как расследовать деградации из-за PGO drift?

    **Ответ:** Сравнить traffic mix и hot paths между profile generation и текущим production; пересобрать со свежим profile и проверить holdout.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

69. (L4, S) Как балансировать стабильность и performance при PGO?

    **Ответ:** Обновлять profile по расписанию/изменению workload, проверять отдельный validation набор и хранить rollback artifacts.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)

70. (L4, S) Как формализовать policy: где PGO обязателен, а где нет?

    **Ответ:** Задать eligible products, minimum gain, training ownership и validation coverage; PGO не обязан быть универсальным.

    **Источник:** [Clang: Profile Guided Optimization](https://clang.llvm.org/docs/UsersManual.html#profile-guided-optimization); [GCC: Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)


    ---

## 8.3 Cross-compilation

## L1

71. (L1, T) Что такое cross-compilation?

    **Ответ:** Сборка программы для платформы, отличающейся от машины, на которой исполняется build toolchain.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

72. (L1, T) Что такое host vs target?

    **Ответ:** В CMake host — build machine, target — целевая система; в GNU build/host/target terminology значения зависят от собираемого инструмента.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

73. (L1, T) Что такое toolchain?

    **Ответ:** Согласованный набор compiler, assembler, linker, runtime/standard libraries и связанных build tools для target.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

74. (L1, T) Что такое sysroot?

    **Ответ:** Каталог, представляющий целевой root для поиска headers/libraries; сам по себе не является полноценной target environment.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

75. (L1, P) Как собрать программу под другую архитектуру?

    **Ответ:** Например `aarch64-linux-gnu-g++ main.cpp -o app`; установить matching target dependencies/sysroot и проверить ELF architecture.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)


## L2

76. (L2, T) Почему cross-compilation сложнее обычной сборки?

    **Ответ:** Нужно различать build tools и target binaries, выбрать target libraries и корректно обработать configure-time execution tests.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

77. (L2, D) Почему бинарь не запускается на target?

    **Ответ:** Неверные ISA/ABI, отсутствующий interpreter/runtime, неподходящие shared libs или permissions; inspect file/readelf и loader error.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

78. (L2, T) Что такое ABI target платформы?

    **Ответ:** Соглашения о registers/calls, data layout, object format и runtime, необходимые для binary compatibility.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

79. (L2, P) Как использовать toolchain file в CMake?

    **Ответ:** Передать `-DCMAKE_TOOLCHAIN_FILE=...` при первом configure в новом tree; файл задаёт system, compilers, sysroot и search modes.

    **Пример:** CMake toolchain fragment для target Linux/AArch64:

    ```cmake
    set(CMAKE_SYSTEM_NAME Linux)
    set(CMAKE_SYSTEM_PROCESSOR aarch64)
    set(CMAKE_C_COMPILER aarch64-linux-gnu-gcc)
    set(CMAKE_CXX_COMPILER aarch64-linux-gnu-g++)
    set(CMAKE_SYSROOT /opt/sdk/sysroot)
    set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
    set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
    set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
    set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)
    ```

    Compiler names и sysroot условные и должны соответствовать установленному SDK. Build-time generators исполняются на host, target executables — только через target/emulator.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

80. (L2, D) Почему зависимости не находятся при cross-build?

    **Ответ:** Find/package-config смотрит host paths либо target dev packages отсутствуют; настроить root path и target pkg-config metadata.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

81. (L2, T) Что такое emulator (qemu) в контексте cross-build?

    **Ответ:** QEMU исполняет target instructions; user-mode требует подходящий target loader/libs и не моделирует всё железо.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

82. (L2, P) Как тестировать cross-compiled бинарь?

    **Ответ:** На реальном target и при необходимости через emulator; unit/contract tests на host дополняют, но не заменяют target validation.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

83. (L2, D) Почему compile проходит, а runtime падает?

    **Ответ:** Link проверяет лишь часть contract; target может иметь другие deps, instruction support, alignment и latent UB.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

84. (L2, T) Что такое endianness?

    **Ответ:** Порядок байтов многобайтного значения; wire/storage formats должны задавать его явно.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

85. (L2, D) Как архитектура влияет на поведение программы?

    **Ответ:** Различаются ISA, alignment, data model, memory ordering и floating-point behavior; переносимый C++ исключает UB и platform assumptions.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)


## L3

86. (L3, D) Как диагностировать ABI mismatch между host и target?

    **Ответ:** Сравнить ELF machine/class/attributes, interpreter, symbol versions, headers и sysroot с реальным target runtime.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

87. (L3, D) Почему alignment/layout может ломать код?

    **Ответ:** Cast к неправильно aligned типу и assumption о packed struct могут нарушить ABI/языковой контракт; сериализовать поля явно.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

88. (L3, T) Что такое cross-toolchain consistency?

    **Ответ:** Compiler, linker, runtime libraries, headers и target options относятся к совместимому набору versions/ABI.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

89. (L3, P) Как организовать reproducible cross-build environment?

    **Ответ:** Pinned SDK/sysroot/image, target presets, lockfiles и manifest; независимая пересборка проверяет identity outputs.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

90. (L3, D) Почему floating-point поведение отличается на разных архитектурах?

    **Ответ:** Различаются instruction sets, intermediate precision, fused operations, libraries и flags; fast-math ослабляет обычные guarantees.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

91. (L3, S) Когда использовать cross-compilation, а когда native build?

    **Ответ:** Cross ускоряет builds для слабого target; native проще для execution probes и подтверждения target-specific поведения.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

92. (L3, D) Как расследовать баг, который есть только на ARM?

    **Ответ:** Исключить alignment/ordering/endianness assumptions и UB, сохранить target core/symbols; воспроизвести на hardware или emulator с оговорками.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

93. (L3, D) Почему sanitizer'ы сложнее использовать при cross-compilation?

    **Ответ:** Нужны supported compiler/runtime и target OS capabilities; наличие cross compiler не гарантирует sanitizer runtime для target.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

94. (L3, S) Как проектировать build system с поддержкой нескольких архитектур?

    **Ответ:** Target-based dependencies, platform adapters, versioned toolchain presets и отдельные build directories/configuration matrix.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

95. (L3, D) Почему system headers могут ломать portability?

    **Ответ:** Headers могут предоставлять extensions и ABI одного OS/SDK; host headers в target build создают неверные declarations/layout assumptions.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)


## L4

96. (L4, S) Как строить multi-platform build strategy?

    **Ответ:** Явная support matrix, pinned SDK/toolchains, cross builds и runtime tests на representative target hardware.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

97. (L4, S) Как тестировать cross-platform поведение reliably?

    **Ответ:** Общий contract corpus плюс platform-specific tests, real hardware CI и проверка serialized outputs/численных допусков.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

98. (L4, D) Как расследовать platform-specific bugs без прямого доступа к железу?

    **Ответ:** Собрать remote artifacts/core/logs и exact sysroot, использовать QEMU для минимизации; hardware timing bugs требуют доступа к target eventually.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

99. (L4, S) Как управлять toolchain версиями для разных target'ов?

    **Ответ:** Versioned SDK manifests и compatibility matrix; обновлять canary targets отдельно с понятным rollback.

    **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)

100. (L4, S) Как минимизировать platform-specific divergence?

     **Ответ:** Узкий platform layer, feature detection и общие contracts вместо рассыпанных architecture macros; тестировать все adapters.

     **Источник:** [CMake Toolchains](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html); [Clang CrossCompilation](https://clang.llvm.org/docs/CrossCompilation.html)


     ---

## 8.4 Reproducible Builds

## L1

101. (L1, T) Что такое reproducible build?

     **Ответ:** Сборка, которую независимые участники могут повторить из заданных inputs/environment с побитно идентичными заданными outputs.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

102. (L1, T) Почему это важно?

     **Ответ:** Позволяет независимо проверить artifact identity и уменьшает неоднозначность debugging/supply-chain verification.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

103. (L1, T) Что может ломать reproducibility?

     **Ответ:** Time/path embedding, unordered inputs, environment drift, random IDs и undeclared dependencies.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

104. (L1, T) Как timestamps влияют на сборку?

     **Ответ:** Встроенные build dates и archive metadata меняют bytes; использовать SOURCE_DATE_EPOCH, где поддерживается, и deterministic metadata.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

105. (L1, T) Что такое deterministic build?

     **Ответ:** Одинаковые declared inputs дают одинаковый output; reproducibility дополнительно требует practically reconstructible inputs/environment.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)


## L2

106. (L2, T) Какие источники nondeterminism в C/C++ сборке?

     **Ответ:** __DATE__/__TIME__, debug paths, traversal order, locale, random seeds, generator races и compiler/linker differences.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

107. (L2, D) Почему два билда дают разные бинарники?

     **Ответ:** Сравнить inputs/toolchain/environment, затем sections/metadata через diffoscope; hash difference только указывает на различие.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

108. (L2, T) Как environment влияет на build?

     **Ответ:** PATH, locale, timezone, umask и installed packages меняют выбор tools и содержимое generated files.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

109. (L2, P) Как фиксировать версии toolchain?

     **Ответ:** Pinned compiler/SDK image digest и package versions с manifest; mutable tag недостаточен для точной фиксации.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

110. (L2, D) Почему порядок файлов влияет на бинарь?

     **Ответ:** Archive/link order влияет на symbol resolution, layout и metadata; сортировать inputs там, где порядок не семантически значим.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

111. (L2, T) Что такое build path leakage?

     **Ответ:** Absolute source/build paths попадают в debug info, __FILE__ и generated outputs, различаясь между машинами.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

112. (L2, D) Почему debug symbols ломают reproducibility?

     **Ответ:** Они могут содержать paths и metadata; `-ffile-prefix-map`/`-fdebug-prefix-map` помогают при supported compiler, symbols не нужно просто удалять.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

113. (L2, P) Как сравнивать бинарники?

     **Ответ:** Сначала `sha256sum`, затем `cmp`/`diffoscope`, `readelf` и objdump для структуры различий.

     **Пример:** На Linux с установленным diffoscope:

     ```bash
     sha256sum build-a/app build-b/app
     diffoscope build-a/app build-b/app
     ```

     Независимые builds выполняют с одинаковыми declared inputs, но в разных директориях. Различия debug paths, archive metadata и machine code исследуют раздельно.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

114. (L2, D) Почему containerization помогает?

     **Ответ:** Фиксирует большую часть userspace/toolchain, но host kernel, mounts, time и network inputs остаются внешними.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

115. (L2, T) Что такое hermetic build?

     **Ответ:** Build использует только declared dependencies и controlled inputs, не случайное состояние host; hermeticity не автоматически означает deterministic output.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)


## L3

116. (L3, D) Как диагностировать источник nondeterminism?

     **Ответ:** Две clean builds с изменением одного фактора, compare через diffoscope и локализация различающего generator/step.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

117. (L3, T) Как reproducibility связана с security?

     **Ответ:** Независимая пересборка помогает обнаружить подмену artifact, но не доказывает отсутствие уязвимости в source/toolchain.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

118. (L3, D) Почему incremental build может нарушать reproducibility?

     **Ответ:** Stale outputs и missing graph edges делают результат зависимым от истории; сравнивать clean и incremental outputs.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

119. (L3, P) Как построить reproducible CI pipeline?

     **Ответ:** Immutable inputs/image, deterministic generators и metadata, independent clean rebuild и проверка hashes выбранных artifacts.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

120. (L3, D) Почему build cache может ломать reproducibility?

     **Ответ:** Неполный key возвращает output от других inputs; cache должен быть отключаемым и проверяться clean rebuilds.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

121. (L3, T) Как reproducibility помогает debugging?

     **Ответ:** Позволяет восстановить exact binary и исключить случайный build drift при сравнении executions.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

122. (L3, D) Почему разные linker'ы дают разные бинарники?

     **Ответ:** Различаются algorithms, defaults и layouts; reproducibility предполагает согласованный toolchain, а не идентичность разных linkers.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

123. (L3, S) Когда reproducibility критична?

     **Ответ:** Для independent artifact verification, long-term support и расследования происхождения release; требования формализуют по outputs.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

124. (L3, D) Как убедиться, что билд действительно deterministic?

     **Ответ:** Повторять clean builds на разных machines/paths/time в объявленной среде; один повтор не покрывает все источники variation.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

125. (L3, S) Как внедрять reproducibility в legacy проект?

     **Ответ:** Начать с измерения различий и manifests, затем устранить time/path/order inputs по одному, сохраняя coverage.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)


## L4

126. (L4, S) Как построить полностью reproducible build system?

     **Ответ:** Hermetic declared graph, pinned tools/inputs, deterministic transforms и independent verification всех release outputs.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

127. (L4, S) Как формализовать reproducibility requirements?

     **Ответ:** Указать artifact set, environment contract, equivalence criterion, verification frequency и процесс exceptions.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

128. (L4, D) Как расследовать security incident через reproducible builds?

     **Ответ:** Сравнить подозрительный artifact с независимым trusted rebuild; различия исследовать по steps, не предполагая любую разницу атакой.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

129. (L4, S) Как балансировать reproducibility и build performance?

     **Ответ:** Использовать корректный cache/parallelism с deterministic outputs; периодические independent builds проверяют сохранение свойства.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)

130. (L4, S) Как обучать команду reproducible engineering?

     **Ответ:** Практические задачи с path/time/order drift, manifests и diffoscope; делать reproducibility наблюдаемым свойством pipeline.

     **Источник:** [Reproducible Builds documentation](https://reproducible-builds.org/docs/)


     ---

## 8.5 Sanitizers в CI

## L1

131. (L1, T) Что такое sanitizer?

     **Ответ:** Compiler/runtime instrumentation, обнаруживающая определённые нарушения во время исполнения проверяемой программы.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

132. (L1, T) Какие основные sanitizer'ы используются в C/C++?

     **Ответ:** ASan — memory safety, UBSan — выбранные UB, TSan — data races, MSan — uninitialized reads; LSan — leaks при поддержке platform.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

133. (L1, P) Как включить sanitizer в сборке?

     **Ответ:** Например `clang++ -g -O1 -fsanitize=address,undefined main.cpp -o app`; flags нужны и для compile, и для final link.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

134. (L1, T) Какие баги ловит ASan?

     **Ответ:** Многие out-of-bounds и use-after-free, а также некоторые stack lifetime ошибки; не вся memory safety покрывается.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

135. (L1, T) Какие баги ловит UBSan?

     **Ответ:** Настроенные классы UB, например signed overflow, invalid shifts и некоторые alignment/type нарушения; не полный детектор UB.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L2

136. (L2, P) Как запускать sanitizer в CI pipeline?

     **Ответ:** Отдельный build tree/job, compatible flags/runtime, representative tests и сохранённые symbolized reports с корректным failure exit policy.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

137. (L2, D) Почему sanitizer замедляет выполнение?

     **Ответ:** Добавляет проверки, shadow memory, metadata и interception calls; overhead зависит от sanitizer и workload.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

138. (L2, D) Почему sanitizer меняет поведение программы?

     **Ответ:** Меняет timing, memory layout и resource use; latent races могут исчезнуть или проявиться иначе.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

139. (L2, T) Почему sanitizer builds нельзя использовать в production?

     **Ответ:** Категорический запрет неверен: обычные sanitizer runtimes не рассчитаны на production security/performance requirements; применение требует отдельной оценки и supported deployment mode.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

140. (L2, D) Почему sanitizer может ловить баг, который трудно воспроизвести иначе?

     **Ответ:** Проверки ловят invalid operation до случайного visible crash; quarantine и memory layout тоже повышают обнаружимость некоторых defects.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

141. (L2, P) Как анализировать sanitizer report?

     **Ответ:** Определить error type и invalid access, затем allocation/free/origin stacks; проверить matching symbols и первую причинную ошибку.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

142. (L2, D) Что делать с багами в third-party code?

     **Ответ:** Проверить reproducer и supported instrumentation, сообщить upstream, обновить/patch dependency; narrow suppression только с owner/rationale.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

143. (L2, T) Какие ограничения у sanitizer'ов?

     **Ответ:** Покрывают лишь supported defect classes и реально исполненные paths; uninstrumented code и platform support ограничивают наблюдение.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

144. (L2, D) Почему sanitizer может пропустить баг?

     **Ответ:** Нет нужного execution path, error вне модели, неполная instrumentation или неподдерживаемая memory pattern.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

145. (L2, S) Когда sanitizer должен быть обязательным?

     **Ответ:** Когда поддерживается platform и высок риск memory/concurrency defects; набор gates выбирать по стоимости и coverage.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L3

146. (L3, S) Как встроить sanitizer pipeline в CI/CD?

     **Ответ:** ASan/UBSan и отдельный TSan pipeline, scheduled long stress/fuzz и обязательная реакция owners на findings.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

147. (L3, D) Почему sanitizer builds могут быть нестабильны?

     **Ответ:** Реальные races, resource limits, unsupported runtime/environment и intermittent workload; не списывать report на tool noise без проверки.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

148. (L3, D) Как triage'ить sanitizer findings?

     **Ответ:** Группировать по root-cause signature, impact и owner, сохранять reproducer и полный report, исправлять первичную invalid operation.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

149. (L3, P) Как разделять fast CI и deep sanitizer checks?

     **Ответ:** Быстрый representative sanitizer suite на PR, широкий fuzz/stress по расписанию; nightly failures имеют SLA triage.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

150. (L3, D) Почему sanitizer требует отдельной конфигурации build?

     **Ответ:** Instrumentation/runtime несовместимы с обычным artifact contract и некоторыми configs; отдельное дерево предотвращает смешение objects.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

151. (L3, S) Как комбинировать разные sanitizer'ы?

     **Ответ:** ASan+UBSan часто совместимы; TSan и MSan обычно отдельные builds. Проверять support конкретного compiler/platform.

     **Пример:** Раздельные конфигурации одной программы:

     ```bash
     clang++ -g -O1 -fno-omit-frame-pointer -fsanitize=address,undefined main.cpp -o app-asan
     clang++ -g -O1 -fno-omit-frame-pointer -fsanitize=thread main.cpp -o app-tsan
     ```

     TSan build требует поддерживаемой target platform. В многомодульном проекте flags применяют согласованно ко всем своим translation units и final link.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

152. (L3, D) Как избежать false positives?

     **Ответ:** Корректная complete instrumentation, supported runtime и проверка report; TSan custom synchronization требует documented annotations, не blanket suppressions.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

153. (L3, S) Как измерять эффективность sanitizer'ов?

     **Ответ:** Подтверждённые defects, time-to-fix, execution coverage и overhead; report count не равен качеству.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

154. (L3, D) Почему sanitizer не заменяет testing?

     **Ответ:** Sanitizer проверяет execution, но tests должны обеспечить inputs и expected semantics; логические ошибки могут не нарушать его модель.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

155. (L3, S) Когда отключать sanitizer оправдано?

     **Ответ:** Для unsupported modules/platform или документированного overhead constraint; сохранять альтернативные checks и узкий scope исключения.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


## L4

156. (L4, S) Как строить policy использования sanitizer'ов в организации?

     **Ответ:** Определить supported configurations, обязательные suites, owners, retention reports и reviewed exception policy.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

157. (L4, S) Как интегрировать sanitizer results в engineering workflow?

     **Ответ:** Actionable reports с owner и reproduction command, regression tests и отслеживание повторных root causes.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

158. (L4, D) Как расследовать flaky sanitizer failures?

     **Ответ:** Сохранить seeds, exact build/runtime и resource state; повторить минимальный сценарий и отделить bug от infrastructure failure.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

159. (L4, S) Как балансировать cost vs value sanitizer pipeline?

     **Ответ:** Приоритизировать risky paths, быстрые suites и targeted stress; измерять compute cost и предотвращённые дефекты.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

160. (L4, S) Как сделать sanitizer частью культуры разработки, а не “разовой проверкой”?

     **Ответ:** Единые локальные команды, регулярные jobs, быстрая triage и обучение чтению reports; coverage расширять по incident history.

     **Источник:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)


     ---
