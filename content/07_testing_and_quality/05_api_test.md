# API Testing

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 5. API Testing

1. (L1 [T]) Что такое API testing и какую задачу оно решает?

   **Ответ:** Проверяет программный interface через requests и responses, включая business effects, ошибки и access control.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

2. (L1 [T]) Чем API-тесты отличаются от unit, integration и E2E тестов?

   **Ответ:** API — поверхность доступа, а unit/integration/E2E — scope проверки. Один API test может быть component integration или полноценным E2E.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

3. (L1 [T]) Какие типы API чаще всего тестируются в современных системах?

   **Ответ:** HTTP REST-like, GraphQL, gRPC и asynchronous/event interfaces; каждый имеет собственные transport/schema/error contracts.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

4. (L1 [T]) В чем особенности тестирования REST и GraphQL API?

   **Ответ:** REST-like API часто использует resource/method/status semantics; GraphQL — typed schema, selected fields и data/errors. HTTP 200 не исключает GraphQL errors.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

5. (L1 [T]) Какие основные аспекты нужно проверять в API: статусы, схемы, данные, заголовки, ошибки?

   **Ответ:** Status/error code, headers, shape/types, business values, access scope и побочные эффекты; positive и negative contracts проверяются вместе.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)


6. (L2 [P]) Как тестировать REST API на уровне запросов и ответов?

   **Ответ:** Сформировать известные preconditions, выполнить запрос, проверить status/headers/body и state change; повторить с invalid и boundary inputs.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

7. (L2 [P]) Как проверять HTTP status codes и корректность их использования?

   **Ответ:** Сверять с HTTP semantics и documented contract: например 201 для создания, 204 без content, 401/403 для разных auth failures.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

8. (L2 [P]) Как валидировать структуру ответа по JSON Schema, OpenAPI или protobuf-схеме?

   **Ответ:** Использовать matching dialect/version validator, required/types/bounds и examples; protobuf message parsing отдельно от HTTP JSON schema validation.

   **Пример:** Python с `jsonschema`, dialect 2020-12. Schema проверяет форму, а отдельный assertion — бизнес-правило.

   ```python
   from jsonschema import Draft202012Validator

   schema = {
       "$schema": "https://json-schema.org/draft/2020-12/schema",
       "type": "object",
       "required": ["id", "total"],
       "properties": {
           "id": {"type": "string", "minLength": 1},
           "total": {"type": "integer", "minimum": 0},
       },
   }
   Draft202012Validator.check_schema(schema)
   response = {"id": "order-1", "total": 1200}
   Draft202012Validator(schema).validate(response)
   assert response["total"] == 3 * 400
   ```

   Additional fields здесь разрешены намеренно. Отдельно проверяют, нужна ли strictness для входа и совместимость новых полей в ответах.

   **Источник:** [JSON Schema: Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)

9. (L2 [P]) Как проверять корректность данных в response body?

   **Ответ:** Сравнить конкретные поля и invariants с известными fixtures, проверить units/timezone/rounding; schema не подтверждает правильность суммы или владельца объекта.

   **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

10. (L2 [P]) Как тестировать headers, query params, path params и request body?

    **Ответ:** Проверять missing/duplicate/encoded params, case rules headers, invalid body и content type; unexpected fields обрабатываются согласно контракту.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

11. (L2 [P]) Как тестировать негативные сценарии API?

    **Ответ:** Invalid formats, missing fields, out-of-range values, unauthorized object access, unavailable dependency и oversized payload; ошибка не должна оставлять частичный side effect.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

12. (L2 [T]) Какие особенности есть у GraphQL API с точки зрения тестирования?

    **Ответ:** Запрос выбирает поля из typed schema; partial data может сопровождаться errors, а authorization должна действовать на objects/fields, не только endpoint.

    **Источник:** [GraphQL specification](https://spec.graphql.org/)

13. (L2 [P]) Как тестировать GraphQL queries, mutations и обработку ошибок?

    **Ответ:** Покрыть variables, nullability, aliases/fragments, invalid fields, mutations и error paths; проверять одновременно data, errors и business state.

    **Источник:** [GraphQL specification](https://spec.graphql.org/)

14. (L2 [T]) Какие инструменты применяются для API testing (Postman, REST Assured, curl, grpcurl и аналоги для C++)?

    **Ответ:** Curl подходит для воспроизводимых requests, Postman/REST Assured — для suites, grpcurl — gRPC inspection/calls; выбор зависит от protocol, schema и CI integration.

    **Источник:** [curl](https://curl.se/docs/); [grpcurl](https://github.com/fullstorydev/grpcurl); [REST Assured](https://rest-assured.io/)

15. (L2 [P]) Как организовать API-тесты для C++ backend-сервиса, если сам сервис написан на REST или gRPC?

    **Ответ:** Внешний test client обращается к release-like service; REST проверяют HTTP harness, gRPC — generated client/grpcurl с schema. Implementation language не определяет язык tests.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

16. (L2 [P]) Как подготавливать тестовые данные для API-тестов?

    **Ответ:** Factories/setup API, unique per-test IDs, фиксированные времена/values и явный teardown; связанные entities создаются минимальным согласованным набором.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

17. (L2 [P]) Как интегрировать API-тесты в CI/CD pipeline?

    **Ответ:** Запустить isolated service/dependencies, readiness и suite с timeout, сохранить sanitized request/response и reports, завершить окружение.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)


18. (L3 [D]) Как диагностировать падения API-тестов: проблема в контракте, данных, конфигурации или самой бизнес-логике?

    **Ответ:** Сохранить exact request, expected/actual result и trace ID; проверить schema, fixtures/config и earliest failing service boundary.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

19. (L3 [D]) Как выявлять нестабильные API-тесты и находить причину flaky-поведения?

    **Ответ:** Повторить с seed/order, проверить shared entities, async completion, rate limits и environment drift; retries не заменяют причину.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

20. (L3 [P]) Как тестировать backward compatibility и versioning API?

    **Ответ:** Проверять supported old consumers на новом provider, semantic defaults, unknown enum/fields и rollout/rollback direction; additive change тоже может сломать assumptions.

    **Источник:** [Protocol Buffers: Updating a Message Type](https://protobuf.dev/programming-guides/proto3/#updating)

21. (L3 [P]) Как валидировать контракт между consumer и provider?

    **Ответ:** Consumer-owned examples проверяются provider implementation в CI; schema compatibility дополняют contract assertions и интеграционными эффектами.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

22. (L3 [D]) Как расследовать ошибки сериализации, десериализации и schema mismatch?

    **Ответ:** Зафиксировать schema versions и raw sanitized payload, сверить field types/encoding/presence/limits; найти отправителя первого несовместимого значения.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

23. (L3 [P]) Как тестировать idempotency, pagination, filtering, sorting и partial updates?

    **Ответ:** Повторить операцию с тем же idempotency key, проверить отсутствие duplicates; pagination — пропуски/дубли/ordering, patch — различие absent/null и atomicity.

    **Пример:** Pagination oracle: объединение pages должно содержать ожидаемые IDs без duplicates при стабильном snapshot/order. При concurrent writes контракт может требовать cursor/snapshot semantics, а не только page number.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

24. (L3 [P]) Как проверять согласованность данных между API и БД?

    **Ответ:** Проверять через read API либо отдельный test observer; для eventual consistency ждать documented outcome с deadline, не требовать мгновенного состояния.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

25. (L3 [D]) Как анализировать проблемы производительности API по результатам функциональных тестов?

    **Ответ:** Функциональный test даёт симптом, но не capacity estimate; повторить representative workload, сравнить latency и traces без overhead тестового harness.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

26. (L3 [P]) Как тестировать timeout, retry, rate limiting и обработку внешних ошибок?

    **Ответ:** Внедрить controlled delayed/error dependency, проверить общий deadline, bounded retries/backoff, 429 policy и отсутствие repeated side effects.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

27. (L3 [D]) Как интерпретировать ситуацию, когда статус ответа корректный, но данные бизнес-некорректны?

    **Ответ:** Transport contract выполнен частично, business invariant нарушен; добавить assertions о данных и state, сохранить минимальный reproducer.

    **Типичная ошибка:** Единственная проверка `status == 200`. Нужны values, permissions и side effects; иначе бизнес-дефект остаётся зелёным.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)


28. (L4 [S]) Как выстроить стратегию API testing для распределённой системы с несколькими сервисами?

    **Ответ:** Собственные suites каждого provider, consumer contracts, compatibility checks и небольшой набор cross-service business journeys.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

29. (L4 [S]) Как определить границу между API, contract, integration и E2E тестами?

    **Ответ:** API задаёт interface, contract — обещание взаимодействия, integration — реальный стык, E2E — полный outcome; эти оси могут пересекаться.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

30. (L4 [S]) Как организовать тестирование REST, GraphQL и gRPC интерфейсов в одной инженерной экосистеме?

    **Ответ:** Общий reporting/lifecycle и domain fixtures, protocol-specific adapters/oracles; не сводить gRPC status и GraphQL errors к одному HTTP check.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

31. (L4 [S]) Как встроить schema validation и contract checks в процесс поставки?

    **Ответ:** Версионировать schema, lint/compatibility checks и provider verification; блокировать согласованные breaking changes до rollout consumers.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

32. (L4 [S]) Как спроектировать API так, чтобы оно было наблюдаемым, тестопригодным и устойчивым к изменениям?

    **Ответ:** Явные schemas/errors, idempotency и deadlines, correlation IDs и стабильные setup interfaces; ownership и deprecation policy документировать.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)

33. (L4 [S]) Как масштабировать API testing между несколькими командами без дублирования сценариев?

    **Ответ:** Назначить owners интерфейсов, переиспользовать contracts/data builders и разделить responsibility; central registry не требует общего монолитного suite.

    **Источник:** [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
