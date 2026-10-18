# Integration Testing

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

## 3. Integration Testing

1. (L1 [T]) Что такое integration testing и какую задачу оно решает в C++-проекте?

   **Ответ:** Проверяет работу выбранных реальных компонентов вместе: API calls, serialized formats, storage, IPC и lifecycle resources.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

2. (L1 [T]) Чем integration-тесты отличаются от unit-тестов и system-тестов?

   **Ответ:** Unit изолирует локальное правило, integration проверяет стык, system оценивает целую систему по внешним требованиям; scope должен быть явно описан.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

3. (L1 [T]) Какие типы взаимодействий обычно покрываются integration-тестами?

   **Ответ:** Вызовы модулей/библиотек, БД, брокеры, HTTP/gRPC, filesystem, dynamic plugins и межпроцессный обмен.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

4. (L1 [T]) Почему недостаточно покрывать систему только unit-тестами?

   **Ответ:** Doubles могут повторить неверные assumptions реализации; реальные contracts, transaction semantics и configuration errors остаются непроверенными.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

5. (L1 [T]) Какие риски возникают на стыке модулей, даже если каждый модуль отдельно протестирован?

   **Ответ:** Ошибки форматов, ABI, ownership, ordering, transaction boundaries и error handling; локально правильные части могут несовместимо интерпретировать данные.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)


6. (L2 [P]) Как проверять взаимодействие модулей внутри одного C++-приложения?

   **Ответ:** Собрать реальные реализации двух modules с минимальным окружением и проверить результат/side effects через публичные interfaces, включая failure path.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

7. (L2 [P]) Какие сценарии интеграции стоит покрывать в первую очередь?

   **Ответ:** Наиболее критичные и изменчивые boundaries: persistence, auth, message delivery, compatibility и recovery после отказа dependency.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

8. (L2 [P]) Как тестировать интеграцию между бизнес-логикой, слоем доступа к данным и внешними сервисами?

   **Ответ:** Запустить реальный data adapter и контролируемый внешний endpoint, проверить сохранение/чтение данных и propagation ошибок, не ограничиваясь mock call count.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

9. (L2 [T]) Что такое контрактное тестирование и зачем оно нужно?

   **Ответ:** Contract testing проверяет согласованный interface producer/consumer: formats, fields, status/error semantics и expectations об использовании.

   **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

10. (L2 [T]) Чем consumer-driven contract testing отличается от обычных integration-тестов?

    **Ответ:** Consumer фиксирует нужные interactions, provider независимо verifies их на своей реализации; это уменьшает необходимость общего окружения, но не заменяет E2E/business tests.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

11. (L2 [P]) Как проверять совместимость форматов данных, API и protobuf/gRPC контрактов в C++-системах?

    **Ответ:** Проверять schema compatibility и cross-version round trips, reserved protobuf tags/names, unknown fields и semantic defaults; binary и JSON compatibility имеют разные ограничения.

    **Источник:** [Protocol Buffers: Updating a Message Type](https://protobuf.dev/programming-guides/proto3/#updating)

12. (L2 [P]) Когда в integration-тестах стоит использовать реальные зависимости, а когда — test doubles?

    **Ответ:** Реальный компонент нужен для его semantics, fake — для управляемого fault/rare case, внешний mock — для изоляции недоступного сервиса; coverage gap обозначить явно.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

13. (L2 [P]) Как использовать test containers для поднятия БД, брокеров сообщений или других сервисов в тестовой среде?

    **Ответ:** Из harness запустить pinned service image, дождаться meaningful readiness, получить dynamic endpoint, создать test data и гарантировать teardown при failure.

    **Типичная ошибка:** Начинать test после запуска container process, пока service ещё выполняет migrations. Нужен readiness probe, проверяющий реальную готовность требуемой операции.

    **Источник:** [Testcontainers: test environment lifecycle](https://testcontainers.com/)

14. (L2 [P]) Как организовать подготовку и очистку тестового окружения для integration-тестов?

    **Ответ:** Выделять per-run DB/schema/namespace и unique IDs; setup идемпотентный, cleanup не должен уничтожать артефакты расследования до сохранения logs.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

15. (L2 [P]) Как интегрировать integration-тесты в CMake/CTest и CI pipeline?

    **Ответ:** Зарегистрировать executable/script через add_test, задать labels/timeouts, передать endpoints/config и запускать CTest после readiness services.

    **Пример:** Фрагмент CMake для уже объявленного `storage_tests`, который получает свой isolated endpoint через конфигурацию.

    ```cmake
    include(CTest)
    if(BUILD_TESTING)
      add_test(NAME storage_roundtrip COMMAND storage_tests --case roundtrip)
      set_tests_properties(storage_roundtrip PROPERTIES
        LABELS "integration;storage"
        TIMEOUT 30)
    endif()
    ```

    ```bash
    ctest --test-dir build -L integration --output-on-failure --parallel 2
    ```

    Лимит TIMEOUT — ограничитель test run, не замена deadline каждой сетевой операции.

    **Источник:** [CTest manual](https://cmake.org/cmake/help/latest/manual/ctest.1.html); [GitHub Actions](https://docs.github.com/en/actions)


16. (L3 [D]) Почему integration-тесты становятся flaky и как находить источник нестабильности?

    **Ответ:** Собрать logs всех участников, seed, actual endpoints и timing; проверить shared data, fixed ports, unbounded waits и environment drift.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

17. (L3 [D]) Как диагностировать падения, связанные с порядком запуска сервисов, таймингами и readiness checks?

    **Ответ:** Статус running не равен ready: проверять health/handshake/migrations, сохранять retry/deadline timeline и ошибки первого запроса.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

18. (L3 [P]) Как тестировать интеграцию C++-сервиса с БД, очередями и внешними HTTP/gRPC сервисами?

    **Ответ:** Реальные isolated dependencies плюс network clients; проверять transaction/message semantics, retries/idempotency, deadlines и end-state системы.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

19. (L3 [P]) Как изолировать интеграционные тесты друг от друга при параллельном запуске?

    **Ответ:** Per-test namespaces/keys, dynamic ports, independent users и bounded resource allocation; serializing только реально неисолируемые scenarios.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

20. (L3 [D]) Как находить несовместимость контрактов между producer и consumer до выхода в production?

    **Ответ:** Contract verification и schema compatibility checks в CI обеих сторон, затем matrix поддерживаемых versions на реальных instances.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

21. (L3 [P]) Как валидировать schema evolution для JSON, protobuf или Avro в интеграционных сценариях?

    **Ответ:** Проверять каждое направление upgrade/rollback, readers/writers old/new, defaults и unknown fields; конкретные compatibility rules зависят от schema format.

    **Источник:** [Protocol Buffers: Updating a Message Type](https://protobuf.dev/programming-guides/proto3/#updating)

22. (L3 [D]) Как расследовать интеграционные ошибки, вызванные конфигурацией, сетью, сериализацией или версиями библиотек?

    **Ответ:** Разделить стадии resolve/connect/auth/serialize/process; сопоставить exact versions/config и wire/log evidence с контрактом.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

23. (L3 [P]) Как тестировать rollback, retry, timeout и circuit breaker сценарии на уровне интеграции?

    **Ответ:** Внедрить управляемый timeout/error/drop и проверить deadline, число попыток, отсутствие duplicate side effects, rollback transaction и breaker recovery.

    **Пример:** Сервер сохранил payment, но response потерян. Клиент повторяет запрос с тем же idempotency key. Проверяют один business effect, тот же operation ID и определённый повторный ответ. «Оба запроса вернули успех» не проверяет отсутствие двойного списания.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

24. (L3 [D]) Как интерпретировать нестабильные падения integration-тестов в контейнеризированной среде?

    **Ответ:** Проверить readiness, resource/OOM limits, network namespaces/DNS, shared volumes и container logs; контейнер не устраняет timing/races.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)


25. (L4 [S]) Как выстроить стратегию integration testing для распределённой C++-системы или набора микросервисов?

    **Ответ:** Локальные проверки стыков и contracts на PR, representative chains после merge, fault/recovery matrix по расписанию; назначить boundary owners.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

26. (L4 [S]) Как определить границу между unit, integration, contract и end-to-end тестами в инженерной организации?

    **Ответ:** Определить для каждого риска самый дешёвый достаточный scope; contract проверяет обещания интерфейса, integration — совместную работу реализаций.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

27. (L4 [S]) Как использовать contract testing как механизм управления изменениями между командами?

    **Ответ:** Consumer expectations versioned вместе с code, provider verification обязательна перед совместимым rollout; publish results привязать к exact versions.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

28. (L4 [S]) Как масштабировать integration-тесты так, чтобы они оставались полезными, но не делали CI слишком медленным?

    **Ответ:** Изолировать services/data, shard независимые suites, переиспользовать read-only setup и перенести ненужные full-stack cases ниже.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)

29. (L4 [S]) Как проектировать C++-модули и сервисные интерфейсы так, чтобы интеграционные сценарии были наблюдаемыми и тестопригодными?

    **Ответ:** Explicit config/dependencies, structured errors, correlation IDs и bounded timeouts; вводить fault injection seams без скрытых production bypasses.

    **Источник:** [Pact: Consumer-driven contracts](https://docs.pact.io/)
