# Test Architecture

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 16. Test Architecture

1. (L1 [T]) Что такое test architecture и какую задачу она решает?

   **Ответ:** Архитектура определяет layers, boundaries, lifecycle и contracts test system, чтобы проверки были полезными и сопровождаемыми при росте.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

2. (L1 [T]) Какие основные компоненты входят в тестовую архитектуру?

   **Ответ:** Scenarios/oracles, fixtures/data, adapters/drivers, environment lifecycle, runner/orchestration и diagnostic reporting.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

3. (L1 [T]) Чем test architecture отличается от просто набора автотестов?

   **Ответ:** Набор files может работать случайно; architecture явно определяет зависимости, ownership, isolation и evolution contracts.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

4. (L1 [T]) Почему структура тестового проекта важна для долгосрочной поддержки?

   **Ответ:** Понятные границы уменьшают цену changes и triage; hidden shared state превращает локальное изменение в массовый suite failure.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

5. (L1 [T]) Какие проблемы возникают при отсутствии архитектуры тестов?

   **Ответ:** Duplicated setup, god fixtures, test-order coupling, inconsistent errors и высокая стоимость parallel execution.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


6. (L2 [P]) Как структурировать тестовый проект (директории, слои, модули)?

   **Ответ:** Domain suites отдельно от protocol adapters и minimal shared helpers; common library не должна знать внутренности всех продуктов.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

7. (L2 [P]) Как разделять unit, integration, API и E2E тесты в проекте?

   **Ответ:** По scope и dependency cost разнести targets/labels, отдельно отметить interface API/UI; API не является взаимоисключающим уровнем с integration.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

8. (L2 [P]) Как проектировать переиспользуемые тестовые утилиты и библиотеки?

   **Ответ:** Малые explicit interfaces, versioned helpers и contract tests для сложных utilities; не прятать assertions за неясными magic defaults.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

9. (L2 [T]) Какие архитектурные паттерны используются в тестировании (POM, test fixtures, builders)?

   **Ответ:** POM изолирует UI mechanics, fixture управляет lifecycle, builder создаёт минимальные valid data; паттерны не требуют общего inheritance framework.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

10. (L2 [P]) Как организовать конфигурацию тестов (env, secrets, параметры запуска)?

    **Ответ:** Typed validated config и explicit overrides; secrets поступают trusted mechanism и redacted в logs, не хранятся в fixtures repo.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

11. (L2 [P]) Как работать с тестовыми данными на уровне архитектуры?

    **Ответ:** Deterministic factories, per-run IDs/tenant namespaces и controlled cleanup; large baseline dataset версионируется и имеет owner.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

12. (L2 [P]) Как интегрировать тестовую архитектуру с CI/CD pipeline?

    **Ответ:** Общий runner contract/exit codes и artifacts, labels/shards и dependencies среды; test identity связывается с commit/build.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

13. (L2 [T]) Какие требования предъявляются к масштабируемой тестовой архитектуре?

    **Ответ:** Isolation, bounded resource use, predictable duration, observability, portability и clear extension points; масштабирование требует capacity planning.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

14. (L2 [P]) Как проектировать тесты для C++ сервисов (CLI, API, библиотеки)?

    **Ответ:** Library contracts через unit harness, CLI через subprocess, service behavior через protocol client; real OS/dependency semantics — отдельная integration suite.

    **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

15. (L2 [P]) Как обеспечить независимость и изоляцию тестов?

    **Ответ:** Fresh fixtures и independent data/resources, no cross-test sequencing, correct cleanup; random test order выявляет, но не устраняет coupling.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


16. (L3 [D]) Как выявить архитектурные проблемы в тестовом проекте?

    **Ответ:** Массовые failures от малого change, долгий setup, global config и tangled helpers; построить dependency map и измерить maintenance hotspots.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

17. (L3 [D]) Как диагностировать рост сложности и хрупкости тестов?

    **Ответ:** Отслеживать helper churn, flaky clusters и время triage; проблема часто в смешении domain assertions и low-level transport mechanics.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

18. (L3 [P]) Как рефакторить тестовую архитектуру без остановки разработки?

    **Ответ:** Добавить stable seams, migrate по suite, сохранять behavior/evidence сравнения и удалять old path после consumers; не останавливать feature work общей переписью.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

19. (L3 [P]) Как управлять зависимостями между тестами и компонентами системы?

    **Ответ:** Тесты не зависят от результатов соседей; components связывать через documented contracts и versioned helpers с назначенными owners.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

20. (L3 [D]) Как находить источники flaky-тестов на уровне архитектуры?

    **Ответ:** Shared mutable fixtures, fixed ports/clocks, leaked resources и non-idempotent cleanup; измерить failure correlation по workers/order.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

21. (L3 [P]) Как масштабировать тестовую инфраструктуру при росте числа тестов?

    **Ответ:** Independent shards, dynamic resource allocation, runner pools и duration balancing; сначала убрать shared bottlenecks и утечки.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

22. (L3 [P]) Как оптимизировать время выполнения тестов через архитектурные решения?

    **Ответ:** Перенести permutations в быстрый layer, reuse immutable setup, parallelize independent cases и избегать repeated full-stack startup.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

23. (L3 [D]) Как анализировать coupling между тестами и production-кодом?

    **Ответ:** Тест должен зависеть от promised behavior, а не private methods/layout; высокая mock interaction детализация часто сигнал overcoupling.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

24. (L3 [P]) Как проектировать abstraction layer для устойчивости тестов к изменениям?

    **Ответ:** Domain actions и explicit results поверх thin adapters; сохранять доступ к raw evidence, не маскировать protocol errors общим exception.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

25. (L3 [D]) Как оценить maintainability тестовой системы?

    **Ответ:** Время добавления/изменения scenario, triage effort, churn/fan-out и flaky/duration trends; code-size metric одной test library недостаточна.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


26. (L4 [S]) Как выстроить test architecture для крупной распределённой системы?

    **Ответ:** Boundary contracts, service-owned suites, representative system journeys и общая environment/reporting platform с распределённым ownership.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

27. (L4 [S]) Как определить границы ответственности между тестовыми слоями?

    **Ответ:** Для каждого риска назначить достаточный scope и owner, сохранять минимальный overlap для integration confidence, а не дублировать каждую permutation на UI.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

28. (L4 [S]) Как обеспечить масштабируемость тестов при росте продукта и команд?

    **Ответ:** Versioned reusable interfaces, isolated data, sharding и governance только общих contracts; автономность команд требует понятных compatibility rules.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

29. (L4 [S]) Как интегрировать test architecture с общей инженерной архитектурой?

    **Ответ:** Testability включается в production design: explicit clocks/I/O, observable state/errors и dependency boundaries; test framework не диктует всю product architecture.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

30. (L4 [S]) Как управлять эволюцией тестовой архитектуры со временем?

    **Ответ:** Small versioned migrations, deprecation policy, telemetry costs и periodic risk review; избегать speculative abstractions без реальных consumers.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

31. (L4 [S]) Как оценивать эффективность test architecture на уровне организации?

    **Ответ:** По скорости/точности feedback, escaped defect impact, maintenance cost и team adoption; сложность framework не является достижением сама по себе.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)
