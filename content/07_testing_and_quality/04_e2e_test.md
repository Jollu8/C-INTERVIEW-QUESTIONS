# End-to-End Testing

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 4. End-to-End (E2E) Testing

1. (L1 [T]) Что такое E2E тестирование и какую задачу оно решает?

   **Ответ:** Проверяет достижение внешнего бизнес-результата через весь выбранный пользовательский путь и существенные компоненты системы.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

2. (L1 [T]) Чем E2E тесты отличаются от integration и system тестов?

   **Ответ:** Integration фокусируется на стыке, system — целой системе, E2E — полном journey, иногда проходящем несколько систем; термины scope нужно уточнять.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

3. (L1 [T]) Что такое сквозной (end-to-end) сценарий?

   **Ответ:** Сценарий от пользовательского действия до подтверждённого результата: например создание заказа, обработка и доступность его статуса.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

4. (L1 [T]) Какие компоненты системы обычно участвуют в E2E тестах?

   **Ответ:** Клиент UI/CLI/API, auth, backend services, queues/storage и необходимые внешние integrations; substitutes меняют реальный scope проверки.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

5. (L1 [T]) Какие основные риски покрываются E2E тестированием?

   **Ответ:** Неверная wiring/config, permission failures, разрыв цепочки side effects и несогласованность пользовательского результата между компонентами.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


6. (L2 [P]) Какие пользовательские сценарии стоит покрывать E2E тестами в первую очередь?

   **Ответ:** Основной доходный/критичный путь, ключевые роли и один-два важных negative/recovery flows; редкие permutations дешевле проверять ниже.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

7. (L2 [P]) Как проектировать стабильные E2E тесты для UI (web/desktop)?

   **Ответ:** Управляемые данные, устойчивые accessible locators, state-based waits и независимые sessions. Desktop требует соответствующего toolkit/driver, browser tools не универсальны.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

8. (L2 [T]) Какие инструменты используются для E2E (Cypress, Playwright, Selenium) и в чем их различия?

   **Ответ:** Playwright/Cypress автоматизируют browser interaction с собственными execution models; Selenium использует WebDriver ecosystem. Supported browsers, features и инфраструктуру сверяют по версии.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

9. (L2 [P]) Как интегрировать E2E тесты с backend на C++ (через API, UI или CLI)?

   **Ответ:** Запустить release-like C++ backend, дождаться health и выполнить внешний сценарий из клиента; язык теста не обязан совпадать с языком backend.

   **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

10. (L2 [P]) Как организовать тестовые данные для сквозных сценариев?

    **Ответ:** Создавать минимум нужных данных через supported setup API/fixtures, давать per-run identities и исключать зависимость от предыдущего test.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

11. (L2 [P]) Как управлять состоянием системы (setup/teardown) в E2E тестах?

    **Ответ:** Предпочитать fresh context/tenant и cleanup с owner/run ID; reset shared production-like environment должен быть контролируемым и изолированным.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

12. (L2 [P]) Как писать E2E тесты для CLI-приложений или сервисов без UI (характерно для C++)?

    **Ответ:** Запустить subprocess с arguments/input, ограничить timeout, проверить exit code/stdout/stderr и persistent result; процесс гарантированно завершать и reaping делать даже при failure.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

13. (L2 [T]) Какие best practices существуют для минимизации хрупкости E2E тестов?

    **Ответ:** Проверять observable contracts, избегать internals/fragile CSS, fixed sleeps и shared accounts; сохранять trace и фактическую ошибку.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

14. (L2 [P]) Как использовать retry, ожидания (waits) и селекторы для стабильности тестов?

    **Ответ:** Ждать конкретную видимость/состояние через locators/assertions; retries допускаются ограниченно с сохранением первой ошибки и учётом flaky rate.

    **Пример:** Фрагмент Playwright Test для предварительно авторизованного isolated context и тестовой страницы заказа.

    ```ts
    import { test, expect } from '@playwright/test';

    test('creates a draft', async ({ page }) => {
      await page.goto('/orders/new'); // baseURL задаётся в config.
      await page.getByLabel('Название').fill('Test draft');
      await page.getByRole('button', { name: 'Сохранить' }).click();
      await expect(page.getByRole('status')).toHaveText('Черновик сохранён');
    });
    ```

    Accessible names и бизнес-текст условные. Для полного journey дополнительно проверяют persistence результата; UI status сам по себе может показываться до успешной записи.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

15. (L2 [P]) Как интегрировать E2E тесты в CI/CD pipeline?

    **Ответ:** Build/deploy test artifact, readiness/setup, запуск suites, reports/traces и teardown; secrets и доступ к среде отделить от untrusted PR.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


16. (L3 [D]) Почему E2E тесты чаще всего flaky и как выявить источник нестабильности?

    **Ответ:** Много зависимостей увеличивает sources of nondeterminism; искать общий state, selectors, timeouts и changing environment по первому failure.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

17. (L3 [D]) Как диагностировать проблемы, связанные с асинхронностью, сетью и таймингами?

    **Ответ:** Трассировать request/job IDs, проверять очереди и eventual state с deadline; фиксированный sleep не подтверждает завершение асинхронной операции.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

18. (L3 [P]) Как ускорить выполнение E2E тестов без потери покрытия?

    **Ответ:** Сократить scope дубликатов, seed через API, shard suites и parallelize независимые contexts; не заменять реальные assertions простым wait.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

19. (L3 [P]) Как изолировать тесты друг от друга при параллельном запуске?

    **Ответ:** Per-worker tenant/data namespace и browser context, уникальные resources/ports; shared mutable setup не считать изоляцией.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

20. (L3 [D]) Как находить проблемы в интеграции UI ↔ backend (включая C++ сервисы)?

    **Ответ:** Сохранить browser trace/network errors и backend logs с одним correlation ID; проверить contract, auth, routing и state transitions.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

21. (L3 [P]) Как тестировать распределённые сценарии (несколько сервисов, очереди, БД)?

    **Ответ:** Проверить один сквозной invariant, например один подтверждённый эффект при retries; ожидать asynchronous delivery по бизнес-идентификатору и deadline.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

22. (L3 [D]) Как интерпретировать падения E2E тестов: баг или проблема теста?

    **Ответ:** Сверить expected behavior с требованиями и replay; failure из-за неверного selector/setup относится к test, но может скрывать реальный product issue.

    **Типичная ошибка:** Объявлять любой failed rerun «проблемой теста», если следующая попытка зелёная. Intermittent product defect тоже может исчезать при повторе.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

23. (L3 [P]) Как валидировать бизнес-флоу, а не только технические шаги?

    **Ответ:** Проверять итоговый статус, суммы, доступность и сохранение результата; успешные clicks/HTTP 200 не доказывают бизнес-корректность.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

24. (L3 [D]) Как анализировать логи, трейсы и метрики при падении E2E тестов?

    **Ответ:** Привязать run/test ID к trace/log context, изучить earliest failed boundary и сравнить resource metrics с baseline периода.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)


25. (L4 [S]) Как определить место E2E тестов в тестовой пирамиде/тестовом ромбе?

    **Ответ:** E2E покрывает дорогостоящие критичные journeys; unit/contracts/integration берут подробные варианты. Универсального соотношения количества тестов нет.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

26. (L4 [S]) Как сбалансировать количество E2E тестов и их стоимость поддержки?

    **Ответ:** Оценивать risk coverage и escaped defects против duration/flaky/maintenance; удалять дублирующие scenarios, сохраняя критичные outcomes.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

27. (L4 [S]) Как выстроить стратегию E2E тестирования для системы с C++ backend и разными клиентами (web, mobile, CLI)?

    **Ответ:** Общие backend contracts и test data tools, отдельные client journeys для web/mobile/CLI; supported device/version matrix строить по использованию и рискам.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)

28. (L4 [S]) Как внедрить observability (логирование, трейсинг) для повышения дебагабельности E2E тестов?

    **Ответ:** Распространять test/request IDs, собирать spans и structured errors; artifacts доступны по run ID и сохраняют sensitive-data policy.

    **Источник:** [OpenTelemetry: Observability primer](https://opentelemetry.io/docs/concepts/observability-primer/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

29. (L4 [S]) Как масштабировать E2E тестирование в большой организации с несколькими командами?

    **Ответ:** Versioned shared harness/contracts и owned product suites, изолированные environments, sharding и единые правила triage flakes.

    **Источник:** [Playwright: Best practices](https://playwright.dev/docs/best-practices)
