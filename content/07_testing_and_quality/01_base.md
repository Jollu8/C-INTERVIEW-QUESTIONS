# 🧪 Testing & Quality — Questions

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

## 1. Основы тестирования

1. (L1 [T]) Что такое тестирование и какие цели оно преследует?

   **Ответ:** Тестирование оценивает продукт, выявляет дефекты и снижает неопределённость о рисках. Оно не доказывает отсутствие всех ошибок; важны проверяемые ожидания и репрезентативные условия.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

2. (L1 [T]) Чем отличается QA от QC?

   **Ответ:** QA улучшает процессы предупреждения дефектов, QC оценивает результаты работы. Тестирование — одна из практик QC, а ответственность за качество общая.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

3. (L1 [T]) Какие существуют виды тестирования?

   **Ответ:** Функциональное, нефункциональное, структурное и связанное с изменениями; manual/automation — способы выполнения, а unit/integration — уровни. Эти классификации не взаимоисключающие.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

4. (L1 [T]) Что такое уровни тестирования (unit, integration, system, acceptance)?

   **Ответ:** Unit проверяет компонент, integration — взаимодействия, system — систему целиком, acceptance — пригодность для согласованных потребностей пользователей/заказчика.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

5. (L1 [T]) Что такое SDLC и STLC?

   **Ответ:** SDLC охватывает жизненный цикл разработки и эксплуатации; STLC описывает деятельность по тестированию: анализ, планирование, реализацию, исполнение и завершение. Они взаимодействуют, а не обязательно идут последовательно.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


6. (L2 [P]) Как определить, какие типы тестирования нужны для конкретного проекта?

   **Ответ:** Построить карту рисков по функциям, интерфейсам и ограничениям, затем выбрать уровни и техники для наиболее вероятных и дорогих отказов.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

7. (L2 [P]) Как выбрать между manual и automation тестированием?

   **Ответ:** Автоматизировать повторяемые сценарии со стабильным oracle и высокой частотой; ручное исследование полезно для новых функций, usability и ещё неясных рисков.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

8. (L2 [T]) В чем разница между verification и validation?

   **Ответ:** Verification проверяет выполнение спецификации, validation — соответствие пользовательской потребности. Формально правильная реализация неверного требования может пройти первое и провалить второе.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


9. (L3 [D]) Как выявить пробелы в тестовом покрытии системы?

   **Ответ:** Сопоставить требования, риски, интерфейсы и incidents с тестами; дополнить coverage анализом assertions, негативных сценариев и непроверенных configurations.

   **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

10. (L3 [P]) Как оценить эффективность тестовой стратегии?

    **Ответ:** Оценивать escaped defects, время feedback, flaky rate и стоимость сопровождения при реальном coverage рисков; число тестов само по себе не мера эффективности.

    **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

11. (L3 [T]) Какие риски возникают при отсутствии разных уровней тестирования?

    **Ответ:** Без unit сложно локализовать ошибки логики, без integration остаются defects стыков, без system/acceptance можно пропустить сломанный пользовательский результат.

    **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


12. (L4 [S]) Как построить стратегию тестирования для крупной распределённой системы?

    **Ответ:** Выделить критичные journeys, contracts и failure modes, распределить проверки по уровням, добавить fault injection и telemetry; назначить owners и release criteria.

    **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

13. (L4 [S]) Как интегрировать тестирование в SDLC на уровне всей организации?

    **Ответ:** Обсуждать testability и acceptance criteria при проектировании, автоматизировать проверки в CI и использовать production feedback для пересмотра рисков.

    **Источник:** [ISTQB CTFL: syllabus and testing concepts](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


    ---

## 2. Unit Testing

1. (L1 [T]) Что такое unit-тесты?

   **Ответ:** Unit-тест проверяет небольшой согласованный фрагмент поведения с контролируемыми dependencies и понятным expected result.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)

2. (L1 [T]) Какие характеристики хорошего unit-теста?

   **Ответ:** Быстрый, воспроизводимый, независимый и диагностичный тест проверяет контракт через конкретные assertions, а не внутреннее устройство реализации.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


3. (L2 [P]) Как писать unit-тесты с использованием mocks и stubs?

   **Ответ:** Stub задаёт ответы dependency, mock проверяет существенные interactions. Внедрить dependency через interface/параметр и не задавать ненужные ожидания порядка вызовов.

   **Источник:** [GoogleMock Cookbook](https://google.github.io/googletest/gmock_cook_book.html)

4. (L2 [P]) Когда стоит использовать TDD?

   **Ответ:** TDD полезен при понятных примерах поведения и коротком feedback: сначала падающий тест, минимальная реализация, затем refactor при зелёных тестах.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


5. (L3 [D]) Почему unit-тесты становятся нестабильными (flaky)?

   **Ответ:** Причины: скрытые globals, время/randomness, UB, races и зависимость от порядка; контролировать inputs и запускать sanitizer configurations.

   **Источник:** [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html); [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)

6. (L3 [P]) Как тестировать сложную бизнес-логику?

   **Ответ:** Разделить правила на функции и state transitions; покрыть boundaries, таблицы решений и invariants, оставляя I/O отдельным интеграционным слоем.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


7. (L4 [S]) Как выстроить стратегию unit-тестирования в большом проекте?

   **Ответ:** Определить ownership модулей и контрактов, единый test harness и быстрый CI gate; выбирать тесты по рискам, а не требовать одинаковое число на класс.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


   ---

## 3. Integration Testing

1. (L1 [T]) Что такое integration testing?

   **Ответ:** Integration testing проверяет согласованность реальных взаимодействующих частей: форматов, вызовов, storage и протоколов.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

2. (L1 [T]) Чем отличается от unit-тестирования?

   **Ответ:** Unit локализует поведение компонента, integration намеренно включает выбранный стык; границу фиксируют явно, а не определяют количеством файлов.

   **Источник:** [GoogleTest Primer](https://google.github.io/googletest/primer.html)


3. (L2 [P]) Как тестировать взаимодействие сервисов?

   **Ответ:** Проверять requests/responses, auth, retries/timeouts и наблюдаемые side effects на изолированных данных; contracts дополнять реальными integration scenarios.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

4. (L2 [P]) Когда использовать test containers?

   **Ответ:** Когда нужна конкретная реальная БД/брокер с управляемым lifecycle. Контейнер обеспечивает packaging/isolation части среды, но не гарантирует readiness или production parity.

   **Источник:** [Testcontainers: test environment lifecycle](https://testcontainers.com/)


5. (L3 [D]) Как диагностировать падения интеграционных тестов?

   **Ответ:** Сохранить первый failure, service logs, request IDs, versions и readiness timeline; отделить ошибку setup от нарушения контракта приложения.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

6. (L3 [P]) Как изолировать внешние зависимости?

   **Ответ:** Использовать отдельные service instances/namespaces, контролируемые fakes внешних систем и уникальные данные; обозначить, какой реальный стык остаётся предметом теста.

   **Источник:** [Testcontainers: test environment lifecycle](https://testcontainers.com/)


7. (L4 [S]) Как организовать интеграционные тесты в микросервисной архитектуре?

   **Ответ:** Проверять contracts на изменении каждого сервиса и небольшой набор representative chains; full environments дополняют эти проверки для системных рисков.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)


   ---

## 4. End-to-End Testing

1. (L1 [T]) Что такое E2E тестирование?

   **Ответ:** E2E проверяет полный пользовательский или внешний бизнес-сценарий через выбранную систему с её существенными интеграциями.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

2. (L1 [T]) Какие задачи оно решает?

   **Ответ:** Находит failures сборки продукта в целом: routing, permissions, UI/API integration и потерю результата между подсистемами.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


3. (L2 [P]) Как писать E2E тесты с использованием Cypress/Playwright?

   **Ответ:** Изолировать browser context/data, выбирать устойчивые locators и ждать наблюдаемое состояние; проверять бизнес-результат вместо последовательности кликов.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

4. (L2 [P]) Какие сценарии стоит покрывать E2E тестами?

   **Ответ:** Критичные journeys: вход, основная операция, её подтверждение и ключевые ошибки; варианты алгоритма выгоднее проверить ниже UI.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


5. (L3 [D]) Почему E2E тесты становятся flaky?

   **Ответ:** Shared state, fragile selectors, fixed sleeps и зависимости от окружения; retries собирают evidence, но не устраняют причину.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

6. (L3 [P]) Как ускорить выполнение E2E тестов?

   **Ответ:** Подготовка данных через API, parallel isolated workers, разумный sharding и перенос избыточных permutations в unit/API tests.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


7. (L4 [S]) Как сбалансировать пирамиду тестирования (unit vs integration vs E2E)?

   **Ответ:** Проверять каждое свойство на самом дешёвом достаточном уровне; форма пирамиды — эвристика, а не нормативное соотношение процентов.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


   ---

## 5. API Testing

1. (L1 [T]) Что такое API тестирование?

   **Ответ:** API testing проверяет внешний программный контракт: inputs, outputs, error semantics, authorization и side effects.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

2. (L1 [T]) Какие параметры проверяются в API?

   **Ответ:** Статус, headers, schema, значения, business invariants и ошибки; успешный HTTP status не гарантирует правильного результата.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)


3. (L2 [P]) Как тестировать REST API?

   **Ответ:** Проверить methods/resources, valid/invalid inputs, permissions, idempotency и persisted effects; сохранять request/response без секретов.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

4. (L2 [P]) Как валидировать JSON-схемы?

   **Ответ:** Выбрать dialect, применить валидатор к request/response и проверить required/types/bounds. Schema validation не проверяет все бизнес-правила.

   **Источник:** [JSON Schema: Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)


5. (L3 [D]) Как находить проблемы в контракте API?

   **Ответ:** Сравнить provider implementation со schema и consumer expectations; добавить примеры отсутствующих полей, enum values и ошибок версионирования.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

6. (L3 [P]) Как тестировать backward compatibility?

   **Ответ:** Запускать старые consumers с новым provider и наоборот в поддерживаемой matrix; проверять defaults и semantics, а не только parse success.

   **Источник:** [Protocol Buffers: Updating a Message Type](https://protobuf.dev/programming-guides/proto3/#updating)


7. (L4 [S]) Как внедрить contract testing в организации?

   **Ответ:** Версионировать contracts, назначить provider/consumer owners и выполнять verification в CI; правила breaking changes согласовать до rollout.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)


   ---

## 6. Performance Testing

1. (L1 [T]) Что такое нагрузочное тестирование?

   **Ответ:** Проверка latency, throughput, ошибок и resource use под заданным профилем нагрузки относительно заранее определённых целей.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

2. (L1 [T]) Разница между load, stress и spike testing?

   **Ответ:** Load — ожидаемая нагрузка, stress — за пределами capacity, spike — резкий скачок; отдельно проверяют восстановление после воздействия.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)


3. (L2 [P]) Как подготовить сценарии нагрузочного тестирования?

   **Ответ:** Зафиксировать mix операций, arrival rate, sizes, datasets и thresholds; подготовить независимый load generator и baseline окружения.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)

4. (L2 [P]) Какие метрики важны?

   **Ответ:** Latency percentiles, achieved throughput, error/timeouts, queue depth и saturation CPU/memory/I/O; определить границы измерения.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)


5. (L3 [D]) Как анализировать деградацию производительности?

   **Ответ:** Сопоставить нагрузку с queues, traces и resource metrics во времени; сравнить baseline/candidate и исключить saturation generator.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

6. (L3 [P]) Как находить bottlenecks?

   **Ответ:** Наращивать нагрузку, наблюдать первый насыщающийся ресурс и провести изолированный эксперимент; высокий CPU сам по себе не диагноз.

   **Источник:** [Grafana k6: Testing guides](https://grafana.com/docs/k6/latest/testing-guides/)


7. (L4 [S]) Как встроить performance testing в CI/CD?

   **Ответ:** Быстрые stable checks на PR, representative load по расписанию и release validation; thresholds должны учитывать noise и состояние runners.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


   ---

## 7. Security Testing

1. (L1 [T]) Что такое security testing?

   **Ответ:** Оценка защиты активов через проверку trust boundaries, доступа, ввода и устойчивости к известным классам атак в согласованной тестовой среде.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

2. (L1 [T]) Что такое OWASP Top 10?

   **Ответ:** OWASP Top 10 — обзор значимых рисков web applications; это ориентир приоритизации, а не полный test plan или сертификат безопасности.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)


3. (L2 [P]) Как проверять базовые уязвимости?

   **Ответ:** Выбрать сценарии по threat model: validation, authorization, injection и session handling; использовать тестовые accounts и проверяемые expected outcomes.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

4. (L2 [P]) Какие инструменты использовать?

   **Ответ:** SAST/SCA, DAST, secret scanning, fuzzers и sanitizers покрывают разные риски; инструмент не заменяет manual review доступа и business logic.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)


5. (L3 [D]) Как расследовать инциденты безопасности?

   **Ответ:** Сохранить timeline/logs/artifacts, ограничить влияние, определить entry point и scope, исправить root cause и проверить отсутствие повторения.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

6. (L3 [P]) Как тестировать аутентификацию и авторизацию?

   **Ответ:** Разделить identity и permissions: invalid/expired credentials, разные roles/tenants, доступ к чужим объектам и обход endpoint restrictions.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)


7. (L4 [S]) Как внедрить secure SDLC?

   **Ответ:** Threat modeling, secure design/review, dependency controls, security tests и response process встроить в обычные этапы delivery с владельцами.

   **Источник:** [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)


   ---

## 8. Test Automation

1. (L1 [T]) Что такое автоматизация тестирования?

   **Ответ:** Автоматизация исполняет повторяемые проверки и публикует результаты через tools; проектирование oracle и исследование рисков остаются инженерными задачами.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

2. (L1 [T]) Какие преимущества и недостатки?

   **Ответ:** Плюсы — частый feedback и повторяемость; минусы — стоимость инфраструктуры, сопровождения и риск стабильного теста с неверным oracle.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


3. (L2 [P]) Как выбрать, что автоматизировать?

   **Ответ:** Выбирать высокорисковые частые проверки со стабильным expected result и разумной ценой реализации; учитывать maintenance и triage cost.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

4. (L2 [P]) Что такое Page Object Model?

   **Ответ:** POM инкапсулирует UI locators и операции страницы; business assertions остаются читаемыми в сценарии или domain layer.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


5. (L3 [D]) Почему автотесты становятся нестабильными?

   **Ответ:** Локализовать shared state, waits, environment drift и test-order dependencies; собирать trace/seed и устранять причину вместо бесконечных retries.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

6. (L3 [P]) Как поддерживать тестовую инфраструктуру?

   **Ответ:** Pinned versions/images, актуальные adapters, metrics duration/flaky и owner каждого helper; изменения framework проверять representative suites.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


7. (L4 [S]) Как масштабировать автоматизацию в команде/компании?

   **Ответ:** Общие contracts/reporting, изолированные данные, sharding и ownership команд; общая платформа не должна превращаться в обязательный монолит.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


   ---

## 9. Quality Assurance

1. (L1 [T]) Что такое качество ПО?

   **Ответ:** Качество — соответствие нуждам пользователей и ограничениям эксплуатации: correctness, reliability, security, usability и maintainability.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

2. (L1 [T]) Какие метрики качества существуют?

   **Ответ:** Escaped defect impact, SLO attainment, crash/error rate и recovery time; coverage и pass rate описывают проверки, но не весь продукт.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


3. (L2 [P]) Как измерять качество продукта?

   **Ответ:** Выбрать пользовательские outcomes, измерять errors/latency и feedback, сопоставлять с releases и рисками; не объединять всё в один безусловный score.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

4. (L2 [P]) Что такое Definition of Done?

   **Ответ:** DoD — общее понимание необходимых свойств готового Increment; acceptance criteria уточняют ожидаемое поведение конкретного backlog item.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)


5. (L3 [D]) Как выявить деградацию качества?

   **Ответ:** Отслеживать тренды errors/incidents и customer outcomes с учётом traffic mix и versions; искать изменение, а не случайный единичный spike.

   **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

6. (L3 [P]) Как улучшить процессы QA?

   **Ответ:** Разобрать recurring defects, сократить feedback loop, улучшить testability/requirements и проверить результат по incidents и времени delivery.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


7. (L4 [S]) Как построить культуру качества в компании?

   **Ответ:** Общее ownership качества, безопасное обсуждение failures и рабочие инструменты локального feedback; не перекладывать качество на отдельную QA-команду.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


   ---

## 10. CI/CD и качество

1. (L1 [T]) Что такое CI/CD?

   **Ответ:** CI регулярно интегрирует и проверяет изменения; delivery сохраняет готовность к выпуску, deployment автоматически выпускает прошедшие проверки.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

2. (L1 [T]) Как тесты интегрируются в pipeline?

   **Ответ:** Stages собирают конкретный artifact и проверяют его unit/integration/security suites; результаты и failures влияют на заранее определённые gates.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


3. (L2 [P]) Как настроить автоматический запуск тестов?

   **Ответ:** Настроить repository events и jobs, reproducible setup и test command с ненулевым exit при failure; сохранять reports даже при падении.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

4. (L2 [P]) Что такое quality gates?

   **Ответ:** Условия принятия изменения/выпуска: обязательные checks, допустимые defects и thresholds. Их полезность определяется рисками и качеством сигнала.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


5. (L3 [D]) Почему pipeline становится медленным?

   **Ответ:** Измерить queue/setup/build/test durations; искать serialized stages, лишние rebuilds, shared resources и flaky retries.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

6. (L3 [P]) Как оптимизировать тестовые стадии?

   **Ответ:** Параллелить независимые suites, разделить fast/deep checks, правильно кэшировать compilation и сохранять exact tested artifact.

   **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


7. (L4 [S]) Как построить стратегию continuous testing?

   **Ответ:** Распределить проверки по lifecycle от требований до production, определить owners, rapid feedback и пересмотр coverage по реальным failures.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)
