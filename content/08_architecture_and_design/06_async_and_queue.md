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
2. (L1 [T]) Зачем нужны очереди?
3. (L1 [T]) Что такое producer?
4. (L1 [T]) Что такое consumer?
5. (L1 [T]) Что такое message broker?
6. (L1 [T]) Что такое Pub/Sub?
7. (L1 [T]) Что такое event?
8. (L1 [T]) Что такое event-driven архитектура?
9. (L1 [T]) Что такое stream processing?
10. (L1 [T]) Чем очередь отличается от Pub/Sub?

---

11. (L2 [T]) Какие гарантии доставки бывают (at-most-once, at-least-once, exactly-once)?
12. (L2 [T]) В чём разница между queue и topic?
13. (L2 [P]) Как реализовать producer/consumer?
14. (L2 [T]) Что такое offset?
15. (L2 [T]) Как работает consumer group?
16. (L2 [P]) Как масштабировать consumers?
17. (L2 [T]) Что такое partition в стримах?
18. (L2 [P]) Как выбрать количество partition?
19. (L2 [T]) Что такое ordering сообщений?
20. (L2 [P]) Как обеспечить ordering?
21. (L2 [T]) Что такое backpressure в очередях?
22. (L2 [P]) Как обрабатывать burst нагрузку?
23. (L2 [T]) Что такое dead letter queue (DLQ)?
24. (L2 [P]) Когда использовать DLQ?
25. (L2 [T]) Что такое retention policy?

---

26. (L3 [D]) Почему сообщения теряются?
27. (L3 [D]) Почему сообщения дублируются?
28. (L3 [D]) Почему consumer отстаёт (lag)?
29. (L3 [D]) Как диагностировать consumer lag?
30. (L3 [T]) Как работает Apache Kafka под капотом?
31. (L3 [T]) Как работает RabbitMQ (exchange, routing key)?
32. (L3 [P]) Как реализовать exactly-once processing?
33. (L3 [D]) Почему падает throughput очереди?
34. (L3 [P]) Как оптимизировать batch processing?
35. (L3 [T]) Что такое idempotent consumer?
36. (L3 [P]) Как обрабатывать повторные сообщения?
37. (L3 [D]) Почему возникает rebalancing и чем он опасен?
38. (L3 [T]) Что такое stream join?
39. (L3 [P]) Как реализовать windowed processing?

---

40. (L4 [S]) Когда использовать event-driven архитектуру?
41. (L4 [S]) Когда очереди вредны?
42. (L4 [S]) Как проектировать систему с миллионами событий в секунду?
43. (L4 [S]) Как балансировать latency vs throughput в стримах?
44. (L4 [S]) Как проектировать fault-tolerant pipeline?
45. (L4 [S]) Когда выбирать Apache Kafka vs RabbitMQ?
46. (L4 [S]) Как проектировать real-time analytics систему?
47. (L4 [S]) Как минимизировать задержки в event pipeline?
48. (L4 [S]) Как проектировать multi-region event streaming?

