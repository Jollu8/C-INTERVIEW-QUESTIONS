# Agile QA

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 15. Agile QA

1. (L1 [T]) Что такое Agile QA и чем он отличается от классического QA?

   **Ответ:** Качество формируется в коротких feedback cycles совместно с разработкой; QA не откладывается в отдельную фазу после всех изменений. Конкретные practices зависят от команды.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

2. (L1 [T]) Какова роль QA в Scrum-команде?

   **Ответ:** Scrum не задаёт отдельной accountability QA: testing specialists входят в cross-functional Developers и помогают команде достичь DoD.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

3. (L1 [T]) Что такое shift-left testing?

   **Ответ:** Более раннее обнаружение risks/defects через requirement examples, design review и быстрые checks; production validation тоже остаётся нужна.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

4. (L1 [T]) Что такое continuous feedback в разработке?

   **Ответ:** Регулярные signals от tests, reviewers, пользователей и эксплуатации, которые используются для корректировки продукта и процесса.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

5. (L1 [T]) Почему QA вовлекается на ранних этапах разработки?

   **Ответ:** Ранние examples выявляют ambiguous requirements и testability gaps, уменьшая дорогой rework после интеграции.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)


6. (L2 [P]) Как QA участвует в Scrum-церемониях (planning, refinement, daily, review, retrospective)?

   **Ответ:** На planning/refinement уточняет risks/examples, daily помогает inspect progress, review обсуждает outcomes, retro — улучшения. Refinement — ongoing activity, не отдельное обязательное Scrum event.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

7. (L2 [P]) Как QA работает с требованиями до начала разработки?

   **Ответ:** Проверять acceptance examples, boundaries, negative flows и measurable nonfunctional constraints вместе с product/domain owners.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

8. (L2 [P]) Как внедрять shift-left testing в команде?

   **Ответ:** Совместный review stories/design, contract tests и ранние component checks; это дополняет, а не переносит весь объём testing на один ранний этап.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

9. (L2 [P]) Как QA взаимодействует с разработчиками и продукт-менеджерами?

   **Ответ:** Общий language invariants/risks, короткие уточнения с examples и прозрачные decisions; QA не посредник, через которого должны идти все вопросы.

   **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

10. (L2 [P]) Как обеспечивать быстрый feedback в процессе разработки?

    **Ответ:** Малые increments, local/PR checks и доступные previews/test environments; медленные suites выносить осознанно с ownership результатов.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

11. (L2 [T]) Какие метрики используются для оценки эффективности Agile QA?

    **Ответ:** Feedback latency, escaped defect impact, rework и reliability outcomes; velocity/число найденных bugs не являются прямой мерой QA effectiveness.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

12. (L2 [P]) Как организовать тестирование в условиях коротких спринтов?

    **Ответ:** Делить work на testable vertical slices, согласовать criteria заранее и автоматизировать частые проверки; не переносить всё QA в последний день sprint.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

13. (L2 [P]) Как интегрировать автоматизацию тестирования в Agile-процесс?

    **Ответ:** Automation tasks входят в обычный backlog/DoD по рискам, developers и testers поддерживают tests вместе с behavior changes.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

14. (L2 [P]) Как QA участвует в формировании Definition of Done и Acceptance Criteria?

    **Ответ:** DoD — общий quality baseline Increment; Acceptance Criteria — конкретное поведение item. QA помогает сделать оба проверяемыми, но не владеет качеством единолично.

    **Пример:** DoD: reviewed code, пройденные agreed checks, обновлённый public contract и operational notes. Acceptance Criteria: «повтор с тем же key возвращает исходный result без нового effect». DoD не подменяет конкретное поведение feature.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

15. (L2 [P]) Как работать с изменяющимися требованиями?

    **Ответ:** Обновлять examples и impact analysis, согласовывать scope с Product Owner и командой; в sprint изменения не должны подвергать опасности Sprint Goal.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)


16. (L3 [D]) Как выявить проблемы в процессе взаимодействия QA и разработки?

    **Ответ:** Очереди handoff, поздние вопросы, repeated reopen и раздельные «готово dev/готово QA» часто указывают на разрыв ownership.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

17. (L3 [D]) Как диагностировать узкие места в Agile-процессе?

    **Ответ:** Посмотреть flow времени работы/ожидания, WIP, blocked dependencies и review/test queues; высокая загрузка всех участников не гарантирует throughput.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

18. (L3 [P]) Как улучшать коммуникацию внутри команды?

    **Ответ:** Совместное example mapping, pairing по сложным changes и short decision records; обсуждать конкретный outcome вместо личных оценок.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

19. (L3 [P]) Как балансировать скорость разработки и качество в Agile?

    **Ответ:** Согласовать risk tolerance и DoD, уменьшать batch size и rework, применять controlled rollout; не объявлять known critical failures Done.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

20. (L3 [D]) Как анализировать причины дефектов, попадающих в production?

    **Ответ:** Восстановить causal chain и missed control, проверить requirements/test layer/data/config; incident review без blame должен приводить к проверяемым actions.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

21. (L3 [P]) Как внедрять continuous testing в Agile-команду?

    **Ответ:** Связать fast component/contracts checks и integration environments с каждой meaningful change; runtime feedback обновляет risk-based suite.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

22. (L3 [P]) Как использовать feedback для улучшения процессов?

    **Ответ:** Выбирать одно measurable process improvement, проверить effect за несколько циклов и сохранить/отменить по evidence.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

23. (L3 [D]) Как определить, что shift-left реализован неэффективно?

    **Ответ:** Ранние meetings есть, но questions/defects всё равно обнаруживаются поздно; проверить качество examples и изменения lead time/rework, а не число ceremonies.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

24. (L3 [P]) Как выстраивать ответственность за качество внутри команды?

    **Ответ:** У команды общее ownership Increment, у modules/checks — конкретные maintainers; QA не final gatekeeper для чужого code.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

25. (L3 [D]) Как интерпретировать метрики Agile QA (lead time, defect rate, cycle time)?

    **Ответ:** Определить boundaries метрик и сравнивать trends с impact/complexity; снижение cycle time ценой incident growth не считается автоматическим улучшением.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)


26. (L4 [S]) Как выстроить Agile QA стратегию на уровне организации?

    **Ответ:** Общий baseline quality и enabling tools, автономные teams и product-specific risks; организационная strategy не сводится к одинаковому checklist.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

27. (L4 [S]) Как внедрить культуру качества в Agile-командах?

    **Ответ:** Shared learning, прозрачные failures и time для fixes/testability; не поощрять hiding defects ради sprint score.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

28. (L4 [S]) Как масштабировать QA-практики (SAFe, LeSS)?

    **Ответ:** Масштабировать dependency coordination и общие product/quality definitions; SAFe и LeSS — разные frameworks, не обязательные ступени зрелости.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

29. (L4 [S]) Как связать Agile QA с DevOps и CI/CD?

    **Ответ:** Общая artifact identity, automated checks и runtime feedback позволяют команде отвечать за change от design до эксплуатации.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)

30. (L4 [S]) Как оптимизировать процессы для continuous delivery?

    **Ответ:** Уменьшить batches/queues, стабилизировать fast checks и environments, поддерживать backward-compatible changes и validated rollback.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)

31. (L4 [S]) Как выстроить end-to-end ownership качества в продукте?

    **Ответ:** Product team владеет outcomes/SLO и incidents, platform помогает tooling, cross-team contracts имеют owners; responsibility не заканчивается merge.

    **Источник:** [Scrum Guide, 2020](https://scrumguides.org/scrum-guide.html)
