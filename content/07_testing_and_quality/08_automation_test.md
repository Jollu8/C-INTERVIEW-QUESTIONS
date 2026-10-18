# Test Automation

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 8. Test Automation

1. (L1 [T]) Что такое автоматизация тестирования и какие задачи она решает?

   **Ответ:** Использует tools для повторяемого setup, исполнения checks и сбора результатов; expected behavior и стратегию выбирают инженеры.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

2. (L1 [T]) Чем автоматизированные тесты отличаются от ручного тестирования?

   **Ответ:** Automation повторяет формализованные действия/oracles, manual testing позволяет исследовать неизвестное и оценивать контекст. Оба способа могут находить разные defects.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

3. (L1 [T]) Какие виды тестов чаще всего автоматизируют?

   **Ответ:** Unit, contracts, API/integration, smoke/regression, некоторые UI и nonfunctional checks; автоматизировать удобнее стабильные повторяемые проверки.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

4. (L1 [T]) Какие преимущества и ограничения есть у test automation?

   **Ответ:** Частый feedback и масштабирование покрытий оплачиваются maintenance, infrastructure и triage; неверный oracle автоматически воспроизводит ошибочное ожидание.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

5. (L1 [T]) Почему не все тестовые сценарии нужно автоматизировать?

   **Ответ:** Редкие/быстро меняющиеся или exploratory сценарии могут иметь низкий ROI; отсутствие подходящего автоматического oracle требует человеческой оценки.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


6. (L2 [T]) По каким критериям выбирать сценарии для автоматизации?

   **Ответ:** Risk, частота запуска, устойчивость interface/oracle, стоимость manual проверки и сопровождения; учитывать потребность в special environments.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

7. (L2 [P]) Когда автоматизация оправдана, а когда дешевле оставить manual testing?

   **Ответ:** Сравнить ожидаемое число повторов и цену ошибок с setup/maintenance cost; одноразовое исследование часто выгоднее выполнить вручную.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

8. (L2 [P]) Как определить ROI автоматизации тестов?

   **Ответ:** Оценить saved execution/triage effort и предотвращённые потери против development/infrastructure/maintenance; результаты пересматривать, а не обещать ROI по числу tests.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

9. (L2 [P]) Как организовать структуру автотестов в проекте?

   **Ответ:** Разделить domain scenarios, protocol/UI adapters, fixtures/data builders и runner/reporting; избегать общего mutable state и циклических test dependencies.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

10. (L2 [T]) Что такое Page Object Model и какую проблему он решает?

    **Ответ:** POM скрывает locators и UI mechanics за page/component operations, уменьшая объём изменений при перестройке страницы.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

11. (L2 [P]) Как применять Page Object Model в UI-автоматизации?

    **Ответ:** Методы выражают действия пользователя, locators ограничены компонентом; business assertions остаются явными и не маскируются внутри непроверяемого helper.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

12. (L2 [T]) Какие ещё паттерны используются в test automation кроме POM?

    **Ответ:** Fixtures, builders, screenplay/actor abstractions, dependency injection и contract fixtures; выбирать паттерн для конкретной боли, а не слоя ради слоя.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

13. (L2 [P]) Как проектировать переиспользуемые и поддерживаемые тестовые компоненты?

    **Ответ:** Малые helpers с явными inputs/outputs и ownership, не framework-wide singleton; повторение нескольких строк иногда дешевле сложной общей abstraction.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

14. (L2 [P]) Как работать с тестовыми данными в автоматизированных тестах?

    **Ответ:** Factories с deterministic defaults, unique run/test IDs и cleanup; secret/production data не копировать в reports без согласованной обработки.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

15. (L2 [P]) Как интегрировать автотесты в CI/CD pipeline?

    **Ответ:** Build/setup, readiness, suite execution, exit-code gate, reports и teardown; сохранять first-failure context даже при retry.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

16. (L2 [P]) Как настроить автоматический запуск тестов на pull request, merge и release?

    **Ответ:** Repository triggers и filters выбирают suites; PR gate быстрый, merge/full и release проверяют более широкий supported scope с exact artifact identity.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

17. (L2 [T]) Какие риски появляются при плохой интеграции автотестов в CI/CD?

    **Ответ:** Ложный green из-за skipped/empty tests, tests другого artifact, медленный feedback и неотслеживаемая flakiness подрывают доверие.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


18. (L3 [D]) Почему автотесты становятся flaky и как находить источник нестабильности?

    **Ответ:** Собирать seed/order, trace и environment, искать shared state/timeouts/races; bounded retries измеряют нестабильность, а не лечат её.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

19. (L3 [D]) Как диагностировать падения, связанные с окружением, данными, таймингами и параллельным запуском?

    **Ответ:** Коррелировать failures с run/worker, dataset и image; повторить один тест и suite в другом порядке/parallelism с сохранёнными artifacts.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

20. (L3 [P]) Как масштабировать автоматизацию, когда число тестов быстро растёт?

    **Ответ:** Ownership suites, sharding по длительности, isolated data и общий protocol/reporting layer; pruning duplicates и перенос coverage ниже UI.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

21. (L3 [P]) Как разделять smoke, regression и full test suites?

    **Ответ:** Smoke проверяет минимальную работоспособность, regression — значимые прежние risks, full — широкую matrix; теги должны иметь ясные inclusion rules.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

22. (L3 [P]) Как оптимизировать время выполнения автотестов в CI?

    **Ответ:** Измерить critical path, убрать repeated setup, parallelize independent tests и использовать affected-test selection с периодическим full run.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

23. (L3 [D]) Как отличить дефект продукта от дефекта автотеста?

    **Ответ:** Сверить oracle с contract, воспроизвести запрос вне test harness и исследовать earliest divergence; environment bug может одновременно выявить product weakness.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

24. (L3 [P]) Как выстраивать abstraction layer, чтобы изменения UI/API минимально ломали тесты?

    **Ответ:** Domain API поверх стабильных boundaries, небольшие UI components/clients и contract validation adapters; чрезмерная abstraction ухудшает читаемость failures.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

25. (L3 [P]) Как автоматизировать тестирование backend и C++-сервисов без UI?

    **Ответ:** Library tests через GoogleTest/CTest, service tests через API/gRPC/CLI и isolated dependencies; UI framework для этого не обязателен.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

26. (L3 [D]) Как расследовать деградацию качества тестового фреймворка со временем?

    **Ответ:** Тренды duration/flaky/helper churn, dependency graph и повторные failure causes; выявить god fixtures, скрытый state и устаревшие wrappers.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

27. (L3 [P]) Как внедрять отчётность, логирование и артефакты для быстрого анализа падений?

    **Ответ:** Test/run/request IDs, sanitized inputs, logs/traces/screenshots и framework versions; reports должны открываться из failure summary.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


28. (L4 [S]) Как выстроить стратегию test automation для большого продукта или платформы?

    **Ответ:** Начать с product risk map, feedback goals и supported interfaces, затем определить layers/owners, cost budgets и measurement процесса.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

29. (L4 [S]) Как определить границы между unit, integration, API, UI и E2E automation?

    **Ответ:** Каждый риск проверять на самом дешёвом достаточном уровне; API/UI — способы доступа, unit/integration/E2E — разные scopes.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

30. (L4 [S]) Как встроить automation в engineering lifecycle так, чтобы она ускоряла delivery, а не тормозила его?

    **Ответ:** Обсуждать testability при design, запускать fast checks локально/PR и приоритизировать noisy/slow suites как инженерную проблему.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

31. (L4 [S]) Как выбрать архитектуру тестового фреймворка для нескольких команд?

    **Ответ:** Versioned shared contracts/helpers и автономные domain suites; interfaces platform должны позволять разным teams обновляться постепенно.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

32. (L4 [S]) Как управлять техническим долгом в автоматизации тестирования?

    **Ответ:** Фиксировать recurring pain и risk, назначить owners и refactor по частям с измерением duration/flaky/maintenance effects.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

33. (L4 [S]) Как измерять эффективность automation strategy на уровне команды и организации?

    **Ответ:** Время полезного feedback, escaped defect impact, flaky/triage cost и confidence releases; test count и automation percentage недостаточны.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)
