# Bug Tracking

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 11. Bug Tracking

1. (L1 [T]) Что такое баг и как он отличается от дефекта/инцидента?

   **Ответ:** Defect — несоответствие work product, bug — разговорное название; incident — событие, требующее расследования и не всегда вызванное defect code.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

2. (L1 [T]) Что такое жизненный цикл бага (bug lifecycle)?

   **Ответ:** Путь от регистрации и triage до исправления/проверки/закрытия либо решения duplicate/not-a-bug; конкретный workflow задаёт команда.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

3. (L1 [T]) Какие статусы обычно есть у бага (Open, In Progress, Resolved, Closed и т.д.)?

   **Ответ:** New/Open, Triaged, In Progress, Resolved, Verified/Closed, Reopened; resolution и status полезно различать для duplicate/won't-fix.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

4. (L1 [T]) Что такое severity и priority?

   **Ответ:** Severity — технический/пользовательский impact, priority — очередность и срочность работы в текущем business context.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

5. (L1 [T]) В чем разница между severity и priority?

   **Ответ:** Тяжёлый failure редкого неподдерживаемого режима может иметь иной priority, чем небольшой defect критичной кампании; оценивать отдельно.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


6. (L2 [P]) Как правильно оформлять баг-репорт?

   **Ответ:** Краткий symptom/title, environment/version, reproduction, expected/actual и evidence; отделять проверенные факты от гипотез root cause.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

7. (L2 [P]) Какие обязательные поля должен содержать баг-репорт?

   **Ответ:** ID, affected version/config, steps/inputs, expected/actual, impact, frequency и owner/triage state; logs/dumps включать без secrets.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

8. (L2 [P]) Как воспроизводить баг и фиксировать шаги воспроизведения?

   **Ответ:** Зафиксировать starting state и minimal inputs, повторить steps и записать frequency/seed; важны не только actions, но и preconditions.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

9. (L2 [P]) Как определять severity бага?

   **Ответ:** По потере данных, нарушению доступа, доступности и масштабу user impact; локальный severity rubric должен быть понятен всем.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

10. (L2 [P]) Как определять priority бага с учетом бизнес-контекста?

    **Ответ:** Учитывать exposure, business deadlines, workaround, recurrence и risk; priority пересматривают при появлении новых evidence.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

11. (L2 [T]) Какие инструменты используются для bug tracking (Jira, YouTrack, Linear)?

    **Ответ:** Jira, YouTrack, Linear и repository issue trackers позволяют вести workflow/links; выбрать систему по нужным integrations и процессу, не по числу полей.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

12. (L2 [P]) Как работать с backlog дефектов?

    **Ответ:** Регулярный triage, dedup, актуализация impact и owners; старые defects не закрывают автоматически только из-за возраста.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

13. (L2 [P]) Как связывать баги с требованиями, тест-кейсами и релизами?

    **Ответ:** Stable IDs requirements/tests, introducing/fixing commits и affected/fixed releases; это помогает impact analysis и проверке rollout.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

14. (L2 [P]) Как управлять багами в процессе спринта (triage, grooming)?

    **Ответ:** Срочные defects оценивают по impact, менее срочные упорядочивают в backlog; изменение sprint scope обсуждают с командой и Product Owner.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

15. (L2 [P]) Как оформлять баги для backend/C++ сервисов (логи, дампы, метрики)?

    **Ответ:** Exact binary/build IDs и symbols, core/stack, inputs/request IDs, config и resource state; для race — threads/seed/timing evidence.

    **Пример:** Минимальный backend bug report:

    ```text
    Symptom: повтор create после response timeout создаёт второй объект
    Build: commit/build ID и config
    Precondition: tenant test-a, idempotency key k-17
    Steps: создать объект; потерять response; повторить тот же request
    Expected: один object ID, один business effect
    Actual: два ID; trace IDs req-1 и req-2
    Evidence: sanitized requests, service logs и persisted IDs
    ```

    Значения условные; секреты и реальные персональные данные в ticket не переносят.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


16. (L3 [D]) Как находить root cause бага, а не только фиксить симптом?

    **Ответ:** Восстановить invariant и causal chain, воспроизвести smallest failure и проверить изменение причины; исчезновение symptom после sleep не доказательство.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

17. (L3 [D]) Как анализировать повторяющиеся дефекты?

    **Ответ:** Группировать по defect mechanism, module/boundary и missed control, затем менять design/tests/process для целого класса проблем.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

18. (L3 [P]) Как выстроить процесс bug triage в команде?

    **Ответ:** Небольшая регулярная встреча owners с ясным impact rubric и решениями assign/fix/defer; не требовать полного root cause для регистрации.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

19. (L3 [P]) Как балансировать между фиксом багов и разработкой новых фич?

    **Ответ:** Распределять capacity по risk и user cost, учитывать rework и reliability goals; raw bug count не определяет нужный баланс.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

20. (L3 [D]) Как отличить баг от неправильного требования или ожидания?

    **Ответ:** Сверить agreed requirement и реальную user need, зафиксировать ambiguity и решение owner; неподтверждённая assumption не становится контрактом автоматически.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

21. (L3 [D]) Как расследовать сложно воспроизводимые (flaky/intermittent) баги?

    **Ответ:** Сохранять run/environment/build evidence, искать correlations и минимизировать scenario; bounded diagnostics полезнее бесконечного ручного rerun.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

22. (L3 [P]) Как использовать метрики (bug rate, reopen rate) для улучшения качества?

    **Ответ:** Нормализовать bug rate и reopen по scope/exposure; рост reopen может означать неверный oracle, неполный fix либо неясный workflow.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

23. (L3 [D]) Как интерпретировать большое количество багов: проблема качества или процесса?

    **Ответ:** Больше reports может означать активное обнаружение и новые users; смотреть severity, exposure, escaped defects и качество triage.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

24. (L3 [P]) Как автоматизировать обработку и анализ дефектов?

    **Ответ:** Dedup signatures, auto-link build/test artifacts и routing к owners; automated severity/closure требует review uncertain cases.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

25. (L3 [D]) Как работать с багами, найденными в production?

    **Ответ:** Сначала снизить user impact и сохранить evidence, затем root cause/fix/regression и контролируемый rollout; incident response и backlog defect связаны, но различны.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


26. (L4 [S]) Как выстроить стратегию управления дефектами на уровне организации?

    **Ответ:** Общие severity taxonomy и evidence requirements, accountable product owners, risk-based сроки и анализ recurring classes.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

27. (L4 [S]) Как внедрить эффективный bug triage процесс между командами?

    **Ответ:** Boundary ownership, единый intake и escalation path; cross-team defect имеет coordinating owner, а не бесконечное переназначение.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

28. (L4 [S]) Как определить SLA на исправление дефектов?

    **Ответ:** Определить response/mitigation/fix targets отдельно по severity/exposure и поддерживаемым products; фиксировать exceptions и customer commitments.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

29. (L4 [S]) Как связать bug tracking с quality metrics и product KPI?

    **Ответ:** Связать defect impact с errors, failed journeys и release quality; не использовать отчётность как ranking отдельных разработчиков.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

30. (L4 [S]) Как масштабировать процесс bug tracking при росте продукта и команды?

    **Ответ:** Stable taxonomy, delegated triage, automated artifacts и cross-team escalation; минимальный общий workflow вместо множества обязательных ручных статусов.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

31. (L4 [S]) Как минимизировать поток багов через улучшение инженерных практик?

    **Ответ:** Review/design feedback, boundary tests, sanitizers/fuzzing для C++, controlled releases и анализ причин повторения; prevention проверяют по реальным outcomes.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)
