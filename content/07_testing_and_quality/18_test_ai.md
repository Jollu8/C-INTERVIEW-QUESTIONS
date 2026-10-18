# AI в тестировании

## 18. AI в тестировании

1. (L1 [T]) Что означает применение AI в тестировании?

   **Ответ:** AI помогает предлагать scenarios, inputs, code и triage hypotheses. Польза определяется найденными рисками и временем review, а не количеством сгенерированных tests.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


2. (L1 [T]) Чем генерация тестов отличается от тестирования самого AI-продукта?

   **Ответ:** В первом случае модель — инструмент создания проверок обычного software; во втором объект проверки включает вероятностное model behavior и его quality/safety requirements.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


3. (L1 [T]) Что такое test oracle и почему AI не заменяет его автоматически?

   **Ответ:** Oracle определяет правильность результата. Модель может повторить ошибку implementation либо выдумать expected value, поэтому ожидание выводят из независимого contract/examples.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


4. (L1 [T]) Какие задачи QA разумно поручать AI как помощнику?

   **Ответ:** Предложение boundary cases, преобразование approved cases в code, объяснение logs и поиск missing scenarios. Изменение contracts и принятие risk требуют ответственного review.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


5. (L1 [T]) Какие основные риски есть у AI-generated tests?

   **Ответ:** Неверные assertions, выдуманные APIs, дубликаты, неполный cleanup, unsafe inputs и раскрытие secrets. Успешная compilation ещё не означает полезного test.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


6. (L2 [P]) Как подготовить контекст для генерации тестов C++-функции?

   **Ответ:** Передать signature, invariants, ownership/error contract, supported C++/framework versions и несколько независимых examples; не отправлять ненужные секретные данные.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


7. (L2 [P]) Как проверить сгенерированный unit-тест перед добавлением в репозиторий?

   **Ответ:** Review oracle и fixtures, compile/run в реальном harness, убедиться в failure на intentional relevant mutation и оценить distinct risk coverage.

   **Пример:** AI предложил test для `bounded(requested, capacity)`. Mutation возвращает `requested` без ограничения. Если suite остаётся зелёным для `requested > capacity`, нужно исправлять coverage/oracle, а не добавлять ещё похожие happy-path cases.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


8. (L2 [P]) Как использовать AI для поиска граничных случаев?

   **Ответ:** Попросить equivalence classes, min/max/empty/invalid inputs и lifecycle failures; проверить границы arithmetic, чтобы сам test не создавал UB вне контракта.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


9. (L2 [P]) Как генерировать property-based tests и invariants с помощью AI?

   **Ответ:** Сначала согласовать свойства: round-trip, monotonicity, conservation или idempotency; затем генераторы valid/invalid inputs и shrinking/replay. Свойство не должно просто дублировать implementation.

   **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


10. (L2 [P]) Как применять AI к triage падений тестов?

    **Ответ:** Дать sanitized error/context и попросить разделить факты, hypotheses и эксперименты; ссылки на root cause проверять в code/trace, а не принимать по убедительности текста.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


11. (L2 [P]) Как защищать исходники и тестовые данные при использовании внешней модели?

    **Ответ:** Минимизировать/redact inputs, соблюдать approved access/retention contracts и использовать synthetic fixtures; учитывать secrets в logs, dumps, screenshots и tool outputs.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


12. (L2 [P]) Как оценивать качество сгенерированных assertions?

    **Ответ:** Проверить связь с requirement, specificity, отрицательный control и failure diagnostic. EXPECT_TRUE(true) или сравнение результата с самим собой не дают evidence.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


13. (L2 [P]) Что такое self-healing UI tests и где границы их применения?

    **Ответ:** Автоматический поиск альтернативного locator может чинить UI mechanics; нельзя автоматически менять business expectation или выбирать другой элемент без проверки его смысла.

    **Типичная ошибка:** После UI change заменить кнопку «Отмена» на найденную по похожему тексту «Удалить» и автоматически принять зелёный test. Self-healing требует проверки смысла элемента.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


14. (L2 [P]) Как интегрировать генерацию тестов в CI без ложного зелёного результата?

    **Ответ:** Генерация создаёт reviewable patch, а deterministic build/tests выполняются отдельно. Model success и process exit не заменяют assertions и approved gate.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


15. (L2 [P]) Как фиксировать воспроизводимость AI-assisted эксперимента?

    **Ответ:** Сохранять approved input corpus, prompt/tool versions, model identifier/config, outputs и evaluation code. Это позволяет повторить процедуру, но не гарантирует побитно одинаковую генерацию.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


16. (L3 [D]) Почему рост coverage после AI-генерации не доказывает улучшение качества?

    **Ответ:** Дополнительные tests могут исполнять строки без meaningful oracle; оценивать уникальные risks, mutation sensitivity и реальные escaped defects.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


17. (L3 [D]) Как обнаружить, что AI скопировал дефект реализации в expected result?

    **Ответ:** Получить oracle из независимого specification/reference model, проверить known examples и intentional mutation; сравнение с тем же алгоритмом под другим именем недостаточно.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


18. (L3 [D]) Почему AI-generated tests могут быть flaky?

    **Ответ:** Shared resources, wall-clock assumptions, randomness и неподдерживаемые APIs/versions; стабилизировать ordinary test design прежде обвинения модели.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


19. (L3 [D]) Как расследовать prompt injection через логи или внешние fixtures?

    **Ответ:** Считать содержимое artifacts недоверенными данными, отделять его от инструкций и ограничивать tool permissions; review неожиданные команды/изменения предложенного patch.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


20. (L3 [D]) Как избежать подгонки тестов и prompts под известный набор examples?

    **Ответ:** Разделить development и holdout datasets, оценивать новые cases и следить за overlap/leakage; не обновлять ожидаемые результаты ради лучшего score.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


21. (L3 [D]) Как сравнить AI-помощник с обычным процессом написания тестов?

    **Ответ:** На сопоставимых tasks измерить confirmed defect detection, review/maintenance time и correctness output; учесть skill команды и стоимость инфраструктуры.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


22. (L3 [D]) Как проверять nondeterministic model outputs в AI-продукте?

    **Ответ:** Использовать task-specific deterministic validators где возможно и calibrated rubrics для semantic quality, несколько trials и human adjudication спорных случаев.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


23. (L3 [D]) Как валидировать LLM-as-a-judge и его ограничения?

    **Ответ:** Сравнить с размеченным representative набором, проверить bias к order/style/verbosity, согласованность и устойчивость. Judge score — измерение модели, а не независимая истина.

    **Пример:** Дважды оценить одну пару ответов с перестановкой A/B и сравнить judge с human labels по risk slices. Высокое согласие на простых examples не доказывает точность на access-control или factuality failures.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


24. (L3 [D]) Как тестировать retrieval и RAG отдельно от генерации ответа?

    **Ответ:** Проверить retrieval relevance/recall на known documents, access filtering и citation grounding; затем end-to-end answer correctness и отсутствие unsupported claims.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


25. (L3 [D]) Как находить утечки и небезопасные side effects AI-агента?

    **Ответ:** Тестовые secrets/canaries, denied permissions и sandbox tools позволяют проверить, какие данные доступны и действия происходят; approvals проверяются на реальном execution boundary.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


26. (L4 [S]) Как построить AI-assisted testing strategy для команды?

    **Ответ:** Выбрать высокополезные задачи, human review rules, approved data/tool access и measurable pilot; расширять применение по доказанному effect и maintenance cost.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


27. (L4 [S]) Как организовать ownership сгенерированных тестов?

    **Ответ:** После принятия tests принадлежат module team как обычный code; сохранять rationale/oracle и обновлять при approved behavior change.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


28. (L4 [S]) Как выбирать quality gates для AI-assisted изменений?

    **Ответ:** Те же correctness/security/contracts checks плюс review смысла assertions, data handling и tool side effects; происхождение code не снижает acceptance criteria.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


29. (L4 [S]) Как выстроить regression evaluation для AI-продукта?

    **Ответ:** Versioned representative corpus, risk slices, deterministic checks/semantic rubrics и thresholds с uncertainty; holdout и production feedback обновляют coverage.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


30. (L4 [S]) Как управлять стоимостью и latency AI-тестирования?

    **Ответ:** Измерять end-to-end run/review cost, использовать bounded inputs/trials и tiered suites; экономия tokens не оправдывает пропуск critical risk checks.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


31. (L4 [S]) Как безопасно внедрять обновления model, prompts и tools?

    **Ответ:** Versioned configs/artifacts, old/new evaluations на одном corpus, adversarial/access checks и controlled rollout с rollback; отдельно анализировать distribution drift.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)


32. (L4 [S]) Когда лучше отказаться от AI в конкретной проверке?

    **Ответ:** Когда deterministic code проще/точнее, oracle неясен, данные нельзя передавать или review cost выше выигрыша; автоматизация должна уменьшать проверяемый риск.

    **Источник:** [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [OWASP LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
