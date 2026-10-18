# Тестовая документация

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 14. Documentation

1. (L1 [T]) Что такое тестовая документация и зачем она нужна?

   **Ответ:** Фиксирует риски, ожидания, проверки и evidence, позволяя согласовать scope и повторить расследование без устных assumptions.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

2. (L1 [T]) Какие виды документации используются в QA (тест-кейсы, чек-листы, тест-планы)?

   **Ответ:** Test strategy/plan, cases/checklists, data/environment notes и execution/defect reports; выбирать artifacts по нуждам проекта.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

3. (L1 [T]) Что такое требования и спецификации?

   **Ответ:** Требование определяет нужный outcome/constraint, specification уточняет contract и условия. Оно должно иметь owner и способ проверки.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

4. (L1 [T]) Что такое traceability matrix?

   **Ответ:** Связь requirements/risks с tests и результатами; помогает видеть gaps и impact changes, но сама ссылка не доказывает достаточную проверку.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

5. (L1 [T]) Почему важно поддерживать документацию в актуальном состоянии?

   **Ответ:** Иначе команда проверяет устаревшее ожидание и принимает release на ложном evidence; документация нуждается в ownership/version context.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


6. (L2 [P]) Как писать понятные и проверяемые требования (functional / non-functional)?

   **Ответ:** Указать actor, preconditions, outcome, errors и measurable limits; «быстро» заменить latency threshold при объявленной нагрузке и boundary измерения.

   **Пример:** Вместо «API должен быть быстрым»: «Для workload W на environment E p95 времени успешного запроса не выше 200 ms в 10-минутном steady-state; error rate не выше 0,1%». Числа учебные, в проекте их согласуют с владельцем SLO.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

7. (L2 [P]) Как превращать требования в тестовые сценарии?

   **Ответ:** Выделить examples, equivalence classes, boundaries и failure paths; сформулировать независимый oracle до implementation.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

8. (L2 [P]) Как строить traceability между требованиями, тестами и дефектами?

   **Ответ:** Stable requirement/test/defect IDs и version/build identity; хранить many-to-many links и отдельно execution evidence.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

9. (L2 [P]) Какие инструменты используются для управления документацией (Confluence, Notion, Markdown)?

   **Ответ:** Confluence/Notion поддерживают совместные knowledge pages, Markdown — review/versioning в repo; важнее ownership, links и доступность актуальной версии.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

10. (L2 [P]) Как организовать структуру тестовой документации в проекте?

    **Ответ:** По capabilities/interfaces, с общими strategy/glossary и local scenarios/runbooks; избегать дублирования одного контракта в нескольких несинхронных местах.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

11. (L2 [P]) Как поддерживать документацию синхронизированной с кодом и тестами?

    **Ответ:** Doc changes входят в feature review/DoD, executable schemas/examples проверяются CI; auto-generation не гарантирует актуальной бизнес-семантики.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

12. (L2 [T]) Какие риски возникают при плохой или устаревшей документации?

    **Ответ:** Неверный oracle, integration mismatch, потеря требований и долгий onboarding/triage; outdated document должен явно показывать status.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

13. (L2 [P]) Как документировать API (OpenAPI, protobuf, GraphQL schema)?

    **Ответ:** Schema описывает shape/interface, descriptions — semantics/errors/constraints; examples и compatibility policy версионируют вместе с provider.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

14. (L2 [P]) Как документировать сложные бизнес-флоу и сценарии?

    **Ответ:** State/sequence diagrams, invariants, identities и error/recovery cases; happy path без failure semantics недостаточен для сложной цепочки.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

15. (L2 [P]) Как использовать документацию в процессе онбординга новых разработчиков и QA?

    **Ответ:** Краткий маршрут по architecture/contracts, runnable examples и debugging playbooks; onboarding feedback помогает находить missing assumptions.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


16. (L3 [D]) Как выявить пробелы или противоречия в требованиях?

    **Ответ:** Сопоставить stakeholder examples и edge cases, искать conflicting definitions/units и нетестируемые слова; unresolved вопросы зафиксировать до реализации.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

17. (L3 [D]) Как диагностировать рассинхронизацию между документацией и реальным поведением системы?

    **Ответ:** Выполнить documented example/contract test на конкретном release и сравнить outputs; различить stale doc, product defect и approved semantic change.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

18. (L3 [P]) Как выстроить процесс обновления документации при изменениях?

    **Ответ:** Назначить owner, добавить impact checklist в change review и versioned decision record; изменение публикуется вместе с code/schema.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

19. (L3 [P]) Как использовать traceability matrix для анализа покрытия?

    **Ответ:** Искать requirements без tests, tests без актуального purpose и риски без evidence по target/config; количество links не заменяет review oracle.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

20. (L3 [D]) Как находить неявные требования (implicit requirements)?

    **Ответ:** Разбор real workflows/incidents, domain interviews и boundary/failure examples; неявное ожидание формализует ответственный product/domain owner.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

21. (L3 [P]) Как балансировать между избыточной и недостаточной документацией?

    **Ответ:** Хранить decisions/contracts и reproduction details, автоматизировать фактические inventories/reports; удалять текст без читателя и цели.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

22. (L3 [P]) Как автоматизировать генерацию документации (например, из кода или тестов)?

    **Ответ:** Из схем/annotations/test metadata строить reference/reports; generated outputs проверять на drift, business intent писать и review отдельно.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

23. (L3 [D]) Как оценить качество требований до начала разработки?

    **Ответ:** Проверяемость, однозначность, согласованность, traceability, измеримость и covered exceptions; concrete examples выявляют ambiguity раньше code.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

24. (L3 [P]) Как использовать документацию как инструмент коммуникации между командами?

    **Ответ:** Общие schemas/glossary, versioned contracts и review affected consumers; async decisions должны иметь owner и ссылку на итог.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

25. (L3 [D]) Как интерпретировать конфликты между требованиями и реализацией?

    **Ответ:** Сначала определить intended contract и version, затем решить fix implementation или approved requirement change; не менять expected result только ради green test.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


26. (L4 [S]) Как выстроить стратегию документации на уровне организации?

    **Ответ:** Owned authoritative contracts, минимальные templates, discoverability, version/retention policy и автоматические checks links/examples.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

27. (L4 [S]) Как внедрить practices documentation-as-code?

    **Ответ:** Markdown/schema в repo, PR review, CI render/link/example validation и публикация согласованной версии; docs не обязаны все генерироваться из code.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

28. (L4 [S]) Как обеспечить traceability на уровне нескольких команд и систем?

    **Ответ:** Общая ID scheme и cross-system links с owners, сохраняющие requirement/test/build version; регулярно проверять broken/obsolete relationships.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

29. (L4 [S]) Как связать документацию с CI/CD и процессом поставки?

    **Ответ:** CI проверяет schemas/examples/links и публикует release-matched docs; release criteria включают изменения contracts и runbooks по рискам.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

30. (L4 [S]) Как масштабировать документацию без потери актуальности?

    **Ответ:** Распределённое ownership, small reusable pages, generated reference и freshness signals; один central writer становится bottleneck.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

31. (L4 [S]) Как использовать документацию как источник истины (single source of truth)?

    **Ответ:** Для каждого вида knowledge выбрать authoritative artifact и derived views; не обещать один файл для всех целей и не хранить расходящиеся копии contracts.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)
