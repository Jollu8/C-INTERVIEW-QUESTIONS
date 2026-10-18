# Test Management

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 10. Test Management

1. (L1 [T]) Что такое test management и какие задачи он решает?

   **Ответ:** Планирование, организация, наблюдение и контроль тестовой деятельности, рисков, ресурсов и результатов на протяжении lifecycle.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

2. (L1 [T]) Что такое тест-кейс и из каких частей он состоит?

   **Ответ:** Preconditions, inputs, actions, expected result и идентификатор/связь с requirement; cleanup и environment нужны, если влияют на воспроизводимость.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

3. (L1 [T]) Чем тест-кейс отличается от чек-листа?

   **Ответ:** Test case подробно задаёт проверку и oracle; checklist компактно напоминает области исследования и допускает больше решений исполнителя.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

4. (L1 [T]) Что такое тест-план и зачем он нужен?

   **Ответ:** Описывает scope, риски, подход, окружение, ресурсы, schedule и критерии завершения; размер документа определяется контекстом.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

5. (L1 [T]) Какие уровни детализации бывают у тестовой документации?

   **Ответ:** Strategy задаёт направление, plan — конкретный scope/условия, scenarios/cases — checks; детальность повышают для сложных/critical процессов.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


6. (L2 [P]) Как писать качественные и поддерживаемые тест-кейсы?

   **Ответ:** Одна ясная цель, минимальные preconditions и конкретный expected outcome; избегать ambiguous шагов вроде «всё работает правильно».

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

7. (L2 [P]) Когда лучше использовать чек-листы вместо тест-кейсов?

   **Ответ:** Для exploratory/manual работы опытной команды и изменчивых workflows; critical повторяемые procedures могут требовать более подробных инструкций.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

8. (L2 [P]) Как структурировать тест-кейсы для сложной системы?

   **Ответ:** Группировать по capabilities/risks/interfaces, помечать layer/platform/priority и сохранять stable IDs; структура не должна зависеть только от текущего UI.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

9. (L2 [P]) Какие разделы должен содержать тест-план?

   **Ответ:** Цели/scope, risk priorities, techniques, environments/data, owners, dependencies, schedule, entry/exit criteria и reporting.

   **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

10. (L2 [P]) Как определять scope тестирования в тест-плане?

    **Ответ:** От требований и impact изменений определить in/out of scope, supported configurations и residual risks; отсутствие проверки должно быть явным решением.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

11. (L2 [T]) Какие инструменты используются для test management (TestRail, Zephyr, Allure TestOps)?

    **Ответ:** TestRail, Zephyr и Allure TestOps дают разные способы хранения cases/runs/reporting; оценивать traceability, integrations и workflow на реальном пилоте.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

12. (L2 [P]) Как организовать хранение и версионирование тестовой документации?

    **Ответ:** Versioned Markdown/repository или managed system с history, owners и stable IDs; изменения cases должны связываться с изменением требования.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

13. (L2 [P]) Как связывать тест-кейсы с требованиями (traceability)?

    **Ответ:** Requirement ID связывать с scenario/test ID и execution evidence; связь many-to-many, наличие ссылки ещё не гарантирует достаточную проверку.

    **Пример:**

    | Требование/риск | Проверка | Evidence |
    | --- | --- | --- |
    | R-17: повтор запроса не создаёт duplicate | API-IDEMP-01 | Run + artifact hash |
    | R-18: чужой tenant недоступен | AUTH-TENANT-02 | Deny + no side effect |
    | R-19: отказ dependency ограничен deadline | INT-TIMEOUT-03 | Error + latency window |

    Статусы `not run`, `skipped` и `failed` должны оставаться различимыми.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

14. (L2 [P]) Как поддерживать тест-кейсы в актуальном состоянии?

    **Ответ:** Обновление вместе с feature change, review affected cases и периодическая проверка rarely used scenarios; устаревшие cases помечать/удалять осознанно.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

15. (L2 [P]) Как оценивать покрытие требований тестами?

    **Ответ:** Матрица requirement/risk → tests → run results показывает gaps; учитывать силу oracle, негативные условия и version/config coverage.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


16. (L3 [D]) Как выявить устаревшие или неэффективные тест-кейсы?

    **Ответ:** Cases не соответствуют текущему contract, дублируют другие или никогда не дают полезного evidence; проверить history, owners и реальную risk relevance.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

17. (L3 [D]) Как диагностировать пробелы в тестовом покрытии?

    **Ответ:** Сопоставить incidents/requirements/interfaces с suite и configurations; coverage lines не выявляет все пропущенные user outcomes.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

18. (L3 [P]) Как оптимизировать набор тест-кейсов (удаление дубликатов, сокращение объёма)?

    **Ответ:** Объединять identical intent, переносить permutations в parameterization и удалять obsolete cases; сохранить traceability к исходным рискам.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

19. (L3 [P]) Как адаптировать тест-план при изменении требований?

    **Ответ:** Сделать impact analysis, изменить scope/priorities/данные и сообщить affected owners; зафиксировать новые residual risks и criteria.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

20. (L3 [D]) Как анализировать дефекты, чтобы улучшить тестовую документацию?

    **Ответ:** Добавить минимальный reproducer и missing oracle/path в подходящий слой, обновить related requirement examples и root-cause taxonomy.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

21. (L3 [P]) Как балансировать между избыточной документацией и её отсутствием?

    **Ответ:** Документировать то, что нужно для coordination, reproduction и evidence; не дублировать автоматически доступные test details вручную.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

22. (L3 [P]) Как интегрировать test management с CI/CD и автотестами?

    **Ответ:** Stable test IDs и commit/build/run identity связывают cases с results; reports ingestion должен отличать failed, skipped, not run и flaky.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

23. (L3 [D]) Как определить, что текущий процесс test management тормозит разработку?

    **Ответ:** Измерить manual copy effort, stale links, approval waits и низкую полезность reports; сокращать дублирование и автоматизировать evidence.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

24. (L3 [P]) Как выстроить процесс ревью тест-кейсов?

    **Ответ:** Проверять ясность oracle, coverage boundary/risk, данные, isolation и maintenance cost; review проводить с domain owner и исполнителем.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)


25. (L4 [S]) Как выстроить стратегию test management для нескольких команд и продуктов?

    **Ответ:** Единые identifiers/reporting contracts и local risk-based plans; общий процесс не должен требовать одинаковой детальности у всех продуктов.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

26. (L4 [S]) Как выбрать и внедрить инструмент test management в организации?

    **Ответ:** Сначала requirements/use cases и пилот реального workflow, затем integrations, exportability, access model и total maintenance cost.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

27. (L4 [S]) Как масштабировать управление тестами без роста бюрократии?

    **Ответ:** Переиспользовать taxonomy и tooling, автоматизировать results/traceability и оставлять decisions у boundary owners.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

28. (L4 [S]) Как связать test management с product management и delivery процессами?

    **Ответ:** Acceptance criteria связывать с backlog, test evidence — с candidate artifact, residual risks — с release decision.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

29. (L4 [S]) Как определить уровень необходимой документации для разных типов проектов?

    **Ответ:** По impact failures, сложности coordination, сроку жизни и обязательствам evidence; больше страниц не означает лучшее управление.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)

30. (L4 [S]) Как автоматизировать процессы управления тестированием (синхронизация с backlog, CI/CD, отчётность)?

    **Ответ:** Интеграции через stable IDs/versioned API, idempotent sync и reconciliation; конфликт источников истины должен иметь явное правило разрешения.

    **Источник:** [ISTQB CTFL: test analysis and management](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/)
