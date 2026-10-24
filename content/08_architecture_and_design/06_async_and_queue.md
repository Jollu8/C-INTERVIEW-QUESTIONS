# 📩 6. Асинхронность и очереди

Критично для масштабируемости.

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy



**Подтемы:**

* Message queues
* Pub/Sub
* Event-driven architecture
* Stream processing

**Инструменты:**

* Apache Kafka
* RabbitMQ

---

1. (L1 [T]) Что такое message queue?

   **Ответ:** Буфер сообщений между отправителями и обработчиками, позволяющий разнести их по времени. Удаление, подтверждения и долговечность зависят от реализации.

   **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)

2. (L1 [T]) Зачем нужны очереди?

   **Ответ:** Развязывают producer и consumer, сглаживают краткие пики и позволяют повторную обработку. Не устраняют дефицит устойчивой пропускной способности.

   **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

3. (L1 [T]) Что такое producer?

   **Ответ:** Участник, создающий и публикующий сообщения. Должен учитывать подтверждение broker, ошибки отправки и безопасный повтор.

   **Источник:** [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)

4. (L1 [T]) Что такое consumer?

   **Ответ:** Участник, читающий и обрабатывающий сообщения. Его подтверждение должно отражать выбранную границу успешной обработки.

   **Источник:** [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)

5. (L1 [T]) Что такое message broker?

   **Ответ:** Посредник, принимающий, сохраняющий и маршрутизирующий сообщения. Надёжность определяется типом очереди, репликацией и протоколом подтверждений.

   **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)

6. (L1 [T]) Что такое Pub/Sub?

   **Ответ:** Модель публикации, где каждый независимый подписчик получает свою логическую копию потока. Внутри подписки обработчики могут конкурировать за сообщения.

   **Источник:** [RabbitMQ: Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-python)

7. (L1 [T]) Что такое event?

   **Ответ:** Запись о свершившемся факте с идентификатором, временем и схемой. Команда выражает намерение, событие — факт.

   **Пример:** OrderCreated отличается от команды CreateOrder.

   **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

8. (L1 [T]) Что такое event-driven архитектура?

   **Ответ:** Компоненты реагируют на события через асинхронные каналы. Требуются управление схемами, идемпотентность и диагностика отставания.

   **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

9. (L1 [T]) Что такое stream processing?

   **Ответ:** Непрерывная обработка потока: фильтрации, агрегации и joins, обычно с состоянием и временными окнами. Событийное время может отличаться от времени поступления.

   **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

10. (L1 [T]) Чем очередь отличается от Pub/Sub?

    **Ответ:** В work queue сообщение обрабатывает один конкурирующий consumer; Pub/Sub распространяет его нескольким независимым подпискам. Конкретный broker может поддерживать обе модели.

    **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues); [RabbitMQ: Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-python)


---

11. (L2 [T]) Какие гарантии доставки бывают (at-most-once, at-least-once, exactly-once)?

    **Ответ:** At-most-once допускает потерю без повторов, at-least-once — повторы без потери в заявленной модели отказов, exactly-once — однократный наблюдаемый эффект в определённой транзакционной границе.

    **Типичная ошибка:** Обещать exactly-once внешнего платежа только настройкой broker.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)

12. (L2 [T]) В чём разница между queue и topic?

    **Ответ:** Queue обычно распределяет работу между consumers; topic — именованный поток/канал с независимыми подписками. Термины зависят от broker: Kafka topic — журнал разделов, а RabbitMQ topic exchange — маршрутизатор.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [RabbitMQ: Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-python)

13. (L2 [P]) Как реализовать producer/consumer?

    **Ответ:** Producer публикует с подтверждением и устойчивым event ID; consumer обрабатывает идемпотентно и подтверждает после commit эффекта. При изменении БД и публикации использовать outbox/CDC.

    **Источник:** [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

14. (L2 [T]) Что такое offset?

    **Ответ:** Позиция записи внутри конкретной partition журнала. Committed offset группы задаёт место возобновления; offset не является глобальным ID между partitions.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

15. (L2 [T]) Как работает consumer group?

    **Ответ:** Набор consumers с общим group ID, совместно читающих topic. В обычной Kafka group partition в момент времени назначена одному активному consumer.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

16. (L2 [P]) Как масштабировать consumers?

    **Ответ:** Увеличить экземпляры до полезного числа partitions или конкурирующих обработчиков очереди. Измерить предел БД/downstream и обеспечить корректные ack, dedup и rebalance.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)

17. (L2 [T]) Что такое partition в стримах?

    **Ответ:** Упорядоченный раздел topic с собственным журналом и offsets. Это единица распределения хранения, репликации и параллельной обработки.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

18. (L2 [P]) Как выбрать количество partition?

    **Ответ:** Оценить целевой throughput на раздел, число consumers, порядок по ключу и стоимость metadata/rebalance. Увеличение partitions может изменить key→partition и нарушить ожидаемый порядок при переходе.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)

19. (L2 [T]) Что такое ordering сообщений?

    **Ответ:** Гарантия порядка внутри определённой области: ключа, partition или всей очереди. Порядок поступления, исполнения и завершения может различаться.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)

20. (L2 [P]) Как обеспечить ordering?

    **Ответ:** Направлять один aggregate key в один упорядоченный раздел и сериализовать обработку по ключу. Добавить sequence/version и обработку пропусков; retries и параллельные workers не должны менять семантику.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

21. (L2 [T]) Что такое backpressure в очередях?

    **Ответ:** Ограничение скорости источника при насыщении consumers или broker. Реализуется квотами, ограничением in-flight, prefetch и размерами очередей.

    **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

22. (L2 [P]) Как обрабатывать burst нагрузку?

    **Ответ:** Оценить объём накопления и время дренирования, предусмотреть буфер, autoscaling и admission control. Если вход длительно выше выхода, очередь неизбежно растёт.

    **Пример:** При 20 тыс./с входа и 15 тыс./с выхода за минуту добавится 300 тыс. сообщений.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

23. (L2 [T]) Что такое dead letter queue (DLQ)?

    **Ответ:** Отдельное место для сообщений, не обработанных по заданным правилам. Содержит исходный payload, причину, попытки и метаданные для расследования/replay.

    **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)

24. (L2 [P]) Когда использовать DLQ?

    **Ответ:** После ограниченного числа неуспешных попыток либо при неисправимой ошибке схемы/данных. Назначить владельца, алерт, retention и безопасный повтор; DLQ не должна быть забытым архивом.

    **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues); [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)

25. (L2 [T]) Что такое retention policy?

    **Ответ:** Правила хранения по времени, объёму или compaction. В Kafka чтение не удаляет запись; consumer может потерять возможность replay, если отстал за retention.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)


---

26. (L3 [D]) Почему сообщения теряются?

    **Ответ:** Проверить publisher confirms, routing, durable/persistent настройки, ack до commit, retention и offset reset. Сопоставить event IDs на границах producer/broker/consumer.

    **Источник:** [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms); [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

27. (L3 [D]) Почему сообщения дублируются?

    **Ответ:** Producer мог повторить отправку после потери подтверждения, consumer — после эффекта до ack. Такие повторы нормальны для at-least-once и требуют дедупликации.

    **Источник:** [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

28. (L3 [D]) Почему consumer отстаёт (lag)?

    **Ответ:** Вход выше скорости обработки, есть горячая partition, медленный downstream, GC или rebalance. Lag нужно оценивать и в количестве записей, и по возрасту события.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

29. (L3 [D]) Как диагностировать consumer lag?

    **Ответ:** Разбить lag по partitions и consumers, сопоставить processing rate, poll cadence, CPU/I/O и downstream latency. Проверить skew, rebalances, ошибки и время самого старого события.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)

30. (L3 [T]) Как работает Apache Kafka под капотом?

    **Ответ:** Topic разбит на append-only partition logs с лидером и репликами; broker сохраняет batches, consumers читают по offsets. В Kafka 4.x metadata управляется KRaft, а не ZooKeeper.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/)

31. (L3 [T]) Как работает RabbitMQ (exchange, routing key)?

    **Ответ:** Producer публикует в exchange; тип exchange, bindings и routing key определяют очереди-получатели. Consumer читает очередь и подтверждает обработку отдельно от publisher confirm.

    **Источник:** [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues); [RabbitMQ: Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-python)

32. (L3 [P]) Как реализовать exactly-once processing?

    **Ответ:** В Kafka transactions атомарно связывают выходные записи и offsets в поддерживаемом pipeline, consumers используют read_committed. Для внешней БД нужны её транзакция с inbox/dedup, outbox либо иной общий протокол.

    **Типичная ошибка:** Путать idempotent producer с exactly-once произвольного бизнес-эффекта.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

33. (L3 [D]) Почему падает throughput очереди?

    **Ответ:** Проверить broker disk/network, replication, batch sizes, число partitions, quotas и consumer обработку. Отделить publish throughput от скорости завершённых бизнес-операций.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)

34. (L3 [P]) Как оптимизировать batch processing?

    **Ответ:** Подобрать batch size и время накопления, сжатие и bulk-запись, измеряя p99 и память. Ошибка части batch должна иметь явную стратегию повторов и дедупликации.

    **Источник:** [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)

35. (L3 [T]) Что такое idempotent consumer?

    **Ответ:** Consumer, у которого повтор одного события не меняет окончательный результат после первого успешного применения. Обычно использует уникальный event ID или условное обновление версии.

    **Пример:** INSERT inbox(event_id) с UNIQUE и изменение заказа в одной транзакции.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

36. (L3 [P]) Как обрабатывать повторные сообщения?

    **Ответ:** Проверять event ID в durable inbox и атомарно применять эффект вместе с отметкой; дубликат подтверждать без нового эффекта. Хранить dedup историю не меньше возможного окна replay.

    **Источник:** [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/); [PostgreSQL: Concurrency Control](https://www.postgresql.org/docs/current/mvcc.html)

37. (L3 [D]) Почему возникает rebalancing и чем он опасен?

    **Ответ:** Меняется состав группы, подписка или доступность участников, и partitions переназначаются. Возможны паузы, повторная обработка и потеря локального состояния без правильного lifecycle.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)

38. (L3 [T]) Что такое stream join?

    **Ответ:** Соединение записей потоков или потока с таблицей по ключу, часто в ограниченном временном окне. Нужны co-partitioning, state store и правила late/out-of-order events.

    **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

39. (L3 [P]) Как реализовать windowed processing?

    **Ответ:** Определить event time, tumbling/sliding/session окно, допустимое опоздание и момент закрытия. Хранить состояние с checkpoint, исправлять результаты или отбрасывать поздние события по явной политике.

    **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)


---

40. (L4 [S]) Когда использовать event-driven архитектуру?

    **Ответ:** Когда нужны независимые реакции на факты, асинхронные проекции, replay и развязка по нагрузке. Согласовать контракты и допустимую задержку; критичные инварианты оставить в надёжной транзакционной границе.

    **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

41. (L4 [S]) Когда очереди вредны?

    **Ответ:** Когда требуется немедленный согласованный ответ либо простой вызов обрастает сложными saga и отладкой. Неограниченные очереди маскируют перегрузку и увеличивают время восстановления.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

42. (L4 [S]) Как проектировать систему с миллионами событий в секунду?

    **Ответ:** Оценить байты/с, partitions, replication traffic и retention, выбрать ключи без перекоса и batches. Планировать обработку с запасом, изоляцию арендаторов, схемы и восстановление состояния.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/)

43. (L4 [S]) Как балансировать latency vs throughput в стримах?

    **Ответ:** Большие batches и окна эффективнее используют ресурсы, но увеличивают ожидание. Задать latency SLO, ограничить linger и размер batch, измерить задержку в каждой стадии.

    **Источник:** [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/); [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

44. (L4 [S]) Как проектировать fault-tolerant pipeline?

    **Ответ:** Устойчивые источники, репликация, checkpoints и согласование offsets с состоянием. Проверять replay, idempotency, схему и восстановление после отказа каждой стадии.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [RabbitMQ: Consumer acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)

45. (L4 [S]) Когда выбирать Apache Kafka vs RabbitMQ?

    **Ответ:** Kafka подходит для долговременного replayable log и stream processing, RabbitMQ — для маршрутизируемых задач с гибкими ack и очередями. Проверять конкретные версии и режимы, а не выбирать по лозунгу.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)

46. (L4 [S]) Как проектировать real-time analytics систему?

    **Ответ:** Устойчивый ingestion → partitioned log → stateful обработка по event time → serving store. Определить свежесть, late events, повторный расчёт и согласованность online/offline результатов.

    **Источник:** [Apache Kafka Streams: Concepts](https://kafka.apache.org/41/streams/core-concepts/)

47. (L4 [S]) Как минимизировать задержки в event pipeline?

    **Ответ:** Измерить event age на каждом переходе, уменьшить очереди, лишние hops и длительность batches. Сохранить разумный запас ёмкости и локальность состояния, не убирая durability вслепую.

    **Источник:** [Apache Kafka: Configuration](https://kafka.apache.org/41/configuration/); [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

48. (L4 [S]) Как проектировать multi-region event streaming?

    **Ответ:** Выделить локальные журналы и асинхронную репликацию с origin/event IDs, предотвращать циклы и дубликаты. Определить RPO, порядок по ключу, failover и обработку конфликтующих записей.

    **Источник:** [Apache Kafka: Design](https://kafka.apache.org/41/design/design/); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)
