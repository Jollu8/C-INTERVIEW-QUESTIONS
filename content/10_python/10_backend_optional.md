# Дополнительно: Python backend

Дополнительная ветка; проходите по задачам выбранной роли.

Вопросы, ответы и задачи для самопроверки. Базовая линия — Python 3.14; особенности CPython и сторонних библиотек отмечены в формулировках. Для NumPy, pandas и pybind11 фиксируйте установленную версию при выполнении эксперимента.

## Лёгкий уровень — теория

1. Чем HTTP method, status code, headers и body отличаются по роли в API-контракте?

   **Ответ:** Method задаёт смысл операции, status — исход/semantics ответа, headers — metadata/управление, body — representation. Их согласованность, idempotency, cache/error contract важнее одного JSON shape.

   **Источник:** [RFC 9110: HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

2. Какие задачи решают WSGI и ASGI и какие модели приложения они поддерживают?

   **Ответ:** WSGI описывает sync request/response callable interface; ASGI — async application со scope/receive/send events и protocol/lifespan support. WebSocket/long-lived async work требуют соответствующего server/app lifecycle.

   **Источник:** [PEP 3333: WSGI](https://peps.python.org/pep-3333/); [ASGI: Specification](https://asgi.readthedocs.io/en/latest/specs/main.html)

3. Почему `async def` endpoint не делает автоматически неблокирующим обращение к синхронной библиотеке?

   **Ответ:** Sync call по-прежнему блокирует loop thread, даже внутри async def. Использовать async client/driver либо контролируемый thread offload для подходящего I/O; CPU work выносить с bounded admission.

   **Источник:** [FastAPI: Concurrency](https://fastapi.tiangolo.com/async/); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

4. Как отделить валидацию входа API от бизнес-правил и работы с хранилищем?

   **Ответ:** Boundary валидирует schema/types/limits и создаёт command model, domain проверяет инварианты, repository реализует persistence. HTTP error mapping и transaction lifecycle остаются явными и тестируемыми.

   **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [ASGI: Specification](https://asgi.readthedocs.io/en/latest/specs/main.html)

5. Чем dependency injection помогает тестированию обработчиков и управлению lifecycle ресурсов?

   **Ответ:** Handler получает interface/factory вместо скрытого singleton; tests подставляют fake, а startup/shutdown владеют реальными clients/pools. Scope dependency должен соответствовать request/worker lifecycle, shared state — синхронизироваться.

   **Источник:** [Python 3.14: library/typing.html](https://docs.python.org/3.14/library/typing.html); [ASGI: Specification](https://asgi.readthedocs.io/en/latest/specs/main.html)

6. Почему открытая транзакция базы данных не должна без необходимости охватывать долгий сетевой запрос?

   **Ответ:** Долгое ожидание удерживает connection/locks/snapshot и повышает contention/timeout. Разделить короткую transaction и внешнюю работу через устойчивый workflow/outbox, сохранив бизнес-инвариант и повторяемость.

   **Источник:** [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); [Python 3.14: library/sqlite3.html](https://docs.python.org/3.14/library/sqlite3.html)

7. Как идемпотентность, retry и timeout взаимодействуют в API с побочными эффектами?

   **Ответ:** Timeout оставляет outcome неопределённым: сервер мог commit до потери ответа. Retry с тем же operation key безопасен только при атомарной dedup+effect, payload mismatch отклоняется и общий retry budget ограничен.

   **Источник:** [RFC 9110: HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

8. Чем authentication отличается от authorization и где проверять доступ к конкретному объекту?

   **Ответ:** Authentication устанавливает identity, authorization разрешает действие над конкретным объектом/tenant. Проверка ownership/policy нужна на backend у доступа к данным, а не только в UI или gateway.

   **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

9. Почему фоновой Task внутри web-worker недостаточно для гарантированной доставки важной работы?

   **Ответ:** Task живёт в process memory, может отмениться при shutdown/crash и потерять exception. Важная работа требует durable queue/job state, retries/dedup и owner наблюдения, согласованных с успешным HTTP ACK.

   **Рекомендация:** Для важной работы связать durable acceptance с job_id и endpoint чтения состояния.

   **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

10. Как ограничения размера запроса, pagination и rate limiting защищают ресурсы сервиса?

    **Ответ:** Size/depth/page limits ограничивают bytes/CPU/memory, pagination — output/fan-out, rate/concurrency quotas — работу tenants. Применять до дорогого allocation/query и защищать costly endpoints, а не лишь общую частоту запросов.

    **Источник:** [OWASP: Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html); [ASGI: Specification](https://asgi.readthedocs.io/en/latest/specs/main.html)

## Разбор кода

11. Как межзапросное состояние может затронуть нескольких пользователей в одном процессе?

   **Условие:**

   ```python
   class Handler:
       messages = []

       def handle(self, user, message):
           self.messages.append((user, message))
           return self.messages
   ```

    **Ответ:** Handler.messages — общий class list для instances/requests одного worker: смешиваются users и возможны privacy/memory проблемы. Хранить request-local data отдельно, историю — в authorized storage; self.values в init не исправляет singleton handler scope.

    **Источник:** [Python 3.14: tutorial/classes.html](https://docs.python.org/3.14/tutorial/classes.html); [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

12. Почему coroutine не устраняет блокировку и что потребуется изменить в архитектуре endpoint?

   **Условие:**

   ```python
   import time

   async def endpoint():
       time.sleep(2)
       return {"ok": True}
   ```

    **Ответ:** Time.sleep блокирует event loop и соседние requests. Для simulated wait — await asyncio.sleep, для sync I/O — bounded offload/async driver; CPU processing требует отдельной вычислительной boundary.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html); [FastAPI: Concurrency](https://fastapi.tiangolo.com/async/)

13. Какой отказ приведёт к повторному побочному эффекту и какие требования к API нужны для безопасного retry?

   **Условие:**

   ```python
   def pay_with_retry(client, order):
       try:
           return client.pay(order)
       except TimeoutError:
           return client.pay(order)
   ```

    **Ответ:** Платёж мог пройти, а ответ потеряться по timeout; второй pay создаст второй effect. Передавать один idempotency key, сервер атомарно хранит outcome+effect и проверяет payload; не повторять вслепую неизвестный исход.

    **Источник:** [RFC 9110: HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

14. Почему корректная SQL-параметризация ещё не обеспечивает доступ только к собственным данным?

   **Условие:**

   ```python
   def load_document(db, document_id):
       return db.execute(
           "SELECT * FROM documents WHERE id = ?",
           (document_id,),
       ).fetchone()
   ```

    **Ответ:** Parameters защищают SQL syntax, но здесь нет identity/tenant predicate и object policy. Добавить authorized principal/scope в repository query либо надёжный access check внутри transaction; тестировать чужой document_id.

    **Типичная ошибка:** Принимать SQL-параметризацию за проверку ownership/tenant access.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [Python 3.14: library/sqlite3.html](https://docs.python.org/3.14/library/sqlite3.html)

15. Почему успешный HTTP-ответ не означает завершения или надёжного сохранения фоновой работы?

   **Условие:**

   ```python
   import asyncio

   async def endpoint(save):
       asyncio.create_task(save())
       return {"accepted": True}
   ```

    **Ответ:** Response завершается до save, Task может упасть/быть отменена/потеряться при worker crash. Возвращать accepted только после требуемой durable job запись/queue ACK, предоставить status и worker retry/dedup.

    **Источник:** [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

## Практические задачи

16. Как реализовать небольшой API запуска эксперимента с валидацией параметров, идентификатором задания и чтением статуса?

    **Ответ:** POST валидирует bounded config/owner, атомарно создаёт job_id/state и durable dispatch, GET читает authorized status/result. Состояния/ошибки/retention и idempotency описаны, user input не превращается в произвольную shell command.

    **Источник:** [ASGI: Specification](https://asgi.readthedocs.io/en/latest/specs/main.html); [Python 3.14: library/subprocess.html](https://docs.python.org/3.14/library/subprocess.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

17. Как протестировать authorization на уровне отдельного объекта без реального внешнего провайдера идентификации?

    **Ответ:** Внедрить fake identity provider с фиксированными principals, оставить настоящую object policy/repository semantics. Матрица owner/other tenant/anonymous/admin проверяет read/write/missing cases и отсутствие disclosure чужих данных.

    **Источник:** [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html); [pytest: Documentation](https://docs.pytest.org/en/stable/)

18. Как спроектировать идемпотентное создание задания при повторной отправке одного запроса?

    **Ответ:** Unique(principal,idempotency_key) и request fingerprint записать с job в одной transaction. Повтор возвращает тот же job, different payload — conflict, parallel duplicates сериализуются; expiry key не короче supported retry window.

    **Источник:** [RFC 9110: HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [AWS: Transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

19. Как организовать graceful shutdown сервиса с активными заданиями и ограниченным временем завершения?

    **Ответ:** Закрыть admission, дождаться/отменить bounded active requests/tasks, сохранить recoverable job state и закрыть clients/pools. Grace deadline переводит незавершённую работу в явный retry/recovery исход; собрать exceptions и join workers.

    **Источник:** [ASGI: Specification](https://asgi.readthedocs.io/en/latest/specs/main.html); [Python 3.14: library/asyncio-task.html](https://docs.python.org/3.14/library/asyncio-task.html)

20. Как проверить обработку ошибок backend API, сохранив безопасное сообщение клиенту и подробную диагностику в логах?

    **Ответ:** Стабильные client error codes/safe messages и correlation ID, полная причина в redacted server logs. Тесты domain/validation/infra failures проверяют status/schema, rollback, trace context и отсутствие secrets/stacktrace в клиентском body.

    **Источник:** [RFC 9110: HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [Python 3.14: library/logging.html](https://docs.python.org/3.14/library/logging.html); [OWASP: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Что прочитать

- [Python: WSGI specification](https://peps.python.org/pep-3333/)
- [ASGI specification](https://asgi.readthedocs.io/en/latest/specs/main.html)

[← Предыдущая тема](./09_engineering_experiments.md) · [План раздела](./README.md) · [Следующая тема →](./11_data_processing_optional.md)
