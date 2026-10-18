# Quality Assurance

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 9. Основы качества

1. (L1 [T]) Что такое Quality Assurance (QA) и Quality Control (QC)?

   **Ответ:** QA — деятельность по обеспечению доверия к качеству через процессы; QC — проверка качества результата. Тестирование относится к QC и помогает улучшать QA.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

2. (L1 [T]) В чем разница между QA и QC?

   **Ответ:** QA предотвращает системные причины defects через практики, QC обнаруживает несоответствия в product artifacts; роли могут выполнять одни и те же люди.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

3. (L1 [T]) Что такое качество ПО и как его определить?

   **Ответ:** Соответствие пользовательским потребностям и agreed constraints; определить конкретные outcomes и измеримые acceptance/nonfunctional requirements.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

4. (L1 [T]) Какие основные характеристики качества (надежность, производительность, безопасность и т.д.)?

   **Ответ:** Функциональная пригодность, reliability, performance, security, usability, compatibility и maintainability; приоритет зависит от продукта и контекста эксплуатации.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

5. (L1 [T]) Что такое Definition of Done (DoD)?

   **Ответ:** DoD описывает требуемое состояние Increment, удовлетворяющего общим quality measures; это не перечень acceptance criteria одной задачи.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)


6. (L2 [T]) Какие метрики используются для оценки качества продукта?

   **Ответ:** User-visible errors/crashes, SLO attainment, incident impact и escaped defects; coverage/pass rate и delivery metrics добавляют контекст процесса.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

7. (L2 [P]) Как измерять качество ПО на практике?

   **Ответ:** Выбрать critical journeys и SLI, собрать baseline по releases и сопоставить telemetry с customer feedback и severity defects.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

8. (L2 [P]) Как формировать Definition of Done для команды?

   **Ответ:** Команда согласует наблюдаемые quality conditions и проверки; organizational DoD задаёт minimum, который teams могут расширять.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

9. (L2 [P]) Какие критерии включать в DoD для backend/C++ проекта?

   **Ответ:** Build supported targets, meaningful tests, appropriate sanitizer/static checks, explicit ownership/error handling и deploy/diagnostic readiness по рискам сервиса.

   **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

10. (L2 [T]) Какие метрики относятся к процессу, а какие к продукту?

    **Ответ:** Product: ошибки, latency, availability. Process: lead/cycle time, feedback latency, review flow. Одинаковая метрика может требовать уточнения границ измерения.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

11. (L2 [P]) Как использовать defect rate, test coverage, lead time в оценке качества?

    **Ответ:** Нормализовать defects по usage/change exposure, coverage оценивать вместе с assertions, lead time — вместе с reliability; сравнивать trends одного scope.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

12. (L2 [P]) Как связать метрики качества с бизнес-целями?

    **Ответ:** Связать failures/latency с завершением journeys, retention и cost; проверять гипотезу связи, не объявлять корреляцию причинностью.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

13. (L2 [T]) Какие ограничения есть у количественных метрик качества?

    **Ответ:** Неполные данные, разные denominators, confounding и gaming; один score не описывает все quality attributes.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


14. (L3 [D]) Как выявить деградацию качества продукта по метрикам?

    **Ответ:** Сравнить trends с baseline и release/workload changes; искать sustained deterioration SLI и impact defects, а не любой spike.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

15. (L3 [D]) Как интерпретировать противоречивые метрики (например, высокий coverage, но много багов)?

    **Ответ:** Coverage измеряет исполнение code, а не силу oracle и полноту requirements; проверить негативные paths, integration и реальные defect classes.

    **Пример:** 95% line coverage и отсутствие тестов запрета доступа между tenants совместимы: строки обработчика исполнялись, но security invariant не проверялся. Добавляют отдельные negative role/object cases.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

16. (L3 [P]) Как улучшать качество без увеличения времени разработки?

    **Ответ:** Убрать recurring root causes, улучшить testability и ранний feedback; оценивать end-to-end rework вместо добавления формальных gates.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

17. (L3 [P]) Как выстроить процесс контроля качества в команде разработки?

    **Ответ:** Общие acceptance/DoD, risk-based tests, owned checks и регулярный разбор production defects; QA не должен быть единственным release bottleneck.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

18. (L3 [D]) Как находить root cause повторяющихся дефектов?

    **Ответ:** Группировать defects по нарушенным invariants и условиям, строить timeline и проверять причинные experiments; blame конкретного человека не root cause.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

19. (L3 [P]) Как внедрять практики shift-left testing в команду?

    **Ответ:** QA участвует в requirement/design review, примерах acceptance и contract tests до интеграции; это не просто более ранний запуск того же UI suite.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

20. (L3 [D]) Как определить, что текущий DoD неэффективен?

    **Ответ:** Done items регулярно не работают в intended conditions, defects повторяются или checks игнорируются; пересмотреть DoD по concrete risk gaps.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

21. (L3 [P]) Как балансировать скорость разработки и уровень качества?

    **Ответ:** Согласовать risk tolerance/SLO, быстрые gates для опасных defects и controlled rollout; сокращать rework, не скрывать known risks ради скорости.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)


22. (L4 [S]) Как выстроить систему качества на уровне всей организации?

    **Ответ:** Общие quality principles, telemetry/incident feedback, owned product-specific controls и enabling platform; стандарты должны учитывать разные риски.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

23. (L4 [S]) Как внедрить культуру качества среди разработчиков?

    **Ответ:** Shared ownership, практические design/review/testing навыки и безопасное обсуждение incidents; не использовать raw defect counts для наказания людей.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

24. (L4 [S]) Как определить и поддерживать quality standards для разных команд?

    **Ответ:** Минимальный baseline и local extensions, версия rules, documented exceptions/owners и проверка полезности по incidents/maintenance.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

25. (L4 [S]) Как связать QA-стратегию с продуктовой стратегией компании?

    **Ответ:** Определить critical capabilities и trust requirements продукта, перевести их в risk priorities, SLO и инженерные investments.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

26. (L4 [S]) Как масштабировать процессы QA при росте команды и системы?

    **Ответ:** Автономные teams с boundary ownership, reusable checks/data tools и общие definitions; shared platform снижает дублирование без central approval каждого изменения.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)

27. (L4 [S]) Как использовать метрики для принятия управленческих решений?

    **Ответ:** Использовать normalized trends для выбора hypothesis/experiment, дополнять qualitative evidence и смотреть side effects выбранного KPI.

    **Источник:** [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/); [Google SRE: Testing for Reliability](https://sre.google/sre-book/testing-reliability/)
