# Code Quality

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 12. Code Quality

1. (L1 [T]) Что такое качество кода (code quality) и почему оно важно?

   **Ответ:** Код выполняет нужное поведение и позволяет безопасно изменять/эксплуатировать его; readability и testability снижают стоимость будущих defects.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

2. (L1 [T]) Какие характеристики определяют хороший код (читаемость, поддерживаемость, надежность)?

   **Ответ:** Ясные contracts/names, cohesive modules, explicit ownership/error handling, predictable behavior и адекватные tests; лаконичность сама по себе не показатель.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

3. (L1 [T]) Что такое code review и зачем он нужен?

   **Ответ:** Проверка изменения другим инженером для поиска defects, оценки design и обмена context; не заменяет compiler/tests и не гарантирует отсутствия bugs.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

4. (L1 [T]) Что такое coding standards?

   **Ответ:** Согласованные правила оформления, language usage и безопасных patterns; механический style и correctness requirements полезно отделять.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

5. (L1 [T]) Что такое статический анализ кода?

   **Ответ:** Исследование code/models без исполнения target program для поиска определённых patterns и возможных defects; вывод зависит от configuration и models.

   **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)


6. (L2 [P]) Как проводить эффективный code review?

   **Ответ:** Понять проблему/contract и scope diff, проверить behavior/tests/design и дать actionable comments; небольшие changes проще анализировать.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

7. (L2 [P]) Какие аспекты нужно проверять при code review (логика, стиль, архитектура, безопасность)?

   **Ответ:** Correctness, lifetime/concurrency, validation/security, API compatibility и failure paths; formatting делегировать tool, performance замечания подтверждать evidence.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

8. (L2 [P]) Как давать конструктивный feedback в code review?

   **Ответ:** Объяснять impact и ожидаемое свойство, различать blocking defect и preference; обсуждать code, а не способности автора.

   **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

9. (L2 [T]) Какие инструменты статического анализа используются (SonarQube, clang-tidy, cppcheck, ESLint)?

   **Ответ:** Clang-Tidy/Static Analyzer и Cppcheck подходят C/C++, ESLint — JS/TS, SonarQube объединяет анализ/quality reporting. Coverage/security зависят от выбранных checks.

   **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)

10. (L2 [P]) Как интегрировать статический анализ в CI/CD pipeline?

    **Ответ:** Pinned version/config, актуальные compile commands, отдельный job и policy для новых high-signal findings; сохранять воспроизводимую команду.

    **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)

11. (L2 [P]) Как применять coding standards в C++ проектах (Google Style Guide, MISRA)?

    **Ответ:** Выбрать требования проекта и supported C++ subset, документировать exceptions. Google Style и MISRA имеют разные цели; style guide не заменяет требуемое compliance evidence.

    **Источник:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

12. (L2 [P]) Как автоматизировать проверку форматирования и стиля (clang-format)?

    **Ответ:** `clang-format --dry-run --Werror file.cpp` проверяет supported versions без записи; единая pinned version/config нужна в editor и CI.

    **Источник:** [ClangFormat](https://clang.llvm.org/docs/ClangFormat.html)

13. (L2 [T]) Какие типы проблем выявляет статический анализ (bugs, smells, vulnerabilities)?

    **Ответ:** Null/lifetime/bounds/API misuse и подозрительные patterns в пределах models; smells указывают на maintenance risk и требуют контекста.

    **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)

14. (L2 [P]) Как работать с предупреждениями статического анализа?

    **Ответ:** Сначала проверить configuration и reproducibility, затем fix root cause или узкая suppression с owner/rationale; blanket disable скрывает новые defects.

    **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)

15. (L2 [P]) Как обеспечить единообразие кода в команде?

    **Ответ:** Общий formatter/config, templates, локальные commands и review conventions; ручные style споры не должны блокировать semantic review.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)


16. (L3 [D]) Как отличить полезные замечания от noise в static analysis?

    **Ответ:** Смотреть actionable rate, reproducibility и impact; repeated false positives требуют настройки rules/models, не игнорирования всех warnings.

    **Источник:** [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/); [Clang Static Analyzer](https://clang.llvm.org/docs/ClangStaticAnalyzer.html)

17. (L3 [D]) Как работать с legacy-кодом с большим количеством нарушений?

    **Ответ:** Baseline existing debt, запрет новых важных defects и постепенный cleanup вокруг изменяемого code; большие mechanical changes отделять.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

18. (L3 [P]) Как выстраивать процесс code review, чтобы он не тормозил разработку?

    **Ответ:** Небольшие diffs, понятное описание/тесты, owner routing и feedback SLA; не снижать качество проверки ради механического approve.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

19. (L3 [P]) Как использовать code review как инструмент обучения команды?

    **Ответ:** Объяснять reasoning и contracts, показывать альтернативы с trade-offs; recurring темы превращать в примеры/automation.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

20. (L3 [D]) Как выявлять архитектурные проблемы на этапе code review?

    **Ответ:** Проверить dependency direction, boundary contracts, ownership, failure propagation и observability; скрытая coupling часто видна по слишком широкому diff.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

21. (L3 [P]) Как снижать технический долг через практики code quality?

    **Ответ:** Регулярно исправлять рискованные hotspots, упрощать contracts и добавлять characterization tests; debt reduction приоритизировать по impact и change frequency.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

22. (L3 [D]) Как анализировать причины повторяющихся ошибок в коде?

    **Ответ:** Классифицировать mechanisms и shared design assumptions, найти missing checks и обучить на минимальном reproducer; не ограничиваться списком авторов.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

23. (L3 [P]) Как внедрять quality gates (coverage, lint, static analysis)?

    **Ответ:** Только reliable actionable checks с зафиксированным scope/threshold; coverage gate дополнять проверкой assertion strength и risk coverage.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

24. (L3 [D]) Как интерпретировать метрики code quality (complexity, duplication, coverage)?

    **Ответ:** Complexity/duplication/coverage помогают найти области review, но не являются самостоятельным доказательством плохого/хорошего поведения.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

25. (L3 [P]) Как балансировать строгость стандартов и скорость разработки?

    **Ответ:** Mandatory high-signal safety rules, автоматический formatting и reviewed exceptions; экспериментальные noisy rules сначала advisory.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)


26. (L4 [S]) Как выстроить стратегию code quality на уровне организации?

    **Ответ:** Базовые practices, owned product-specific extensions, измеримые outcomes и поддержка platform/tooling; rollout правил через pilot.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

27. (L4 [S]) Как внедрить культуру code review среди разработчиков?

    **Ответ:** Общая ответственность за результат, уважительный feedback, review training и время на качественный анализ, а не approve-count KPI.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

28. (L4 [S]) Как определить и поддерживать coding standards для разных команд?

    **Ответ:** Versioned standards с rationale, maintainers и change process; учитывать targets, language versions и risk profile продукта.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

29. (L4 [S]) Как интегрировать code quality в CI/CD и release process?

    **Ответ:** Fast PR checks, deeper scheduled analysis, release validation exact artifact и документированные исключения; результат должен быть доступен reviewer.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

30. (L4 [S]) Как управлять техническим долгом системно?

    **Ответ:** Inventory hotspots с owner/impact, deliberate capacity для fixes и проверка эффекта; не считать любой старый code debt по возрасту.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)

31. (L4 [S]) Как измерять влияние code quality на стабильность и скорость разработки?

    **Ответ:** Сопоставлять changes с escaped defects, recovery и rework/lead time, учитывая размер/сложность продукта; избегать причинных выводов из одного score.

    **Источник:** [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)
