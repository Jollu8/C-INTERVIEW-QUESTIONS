# ⚙️ 3. Backend архитектура

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy


Здесь начинается реальный System Design.

**Подтемы:**

* Monolith vs Microservices
* API design (REST, gRPC)
* Service discovery
* Load balancing
* Stateless vs stateful services

---

1. (L1 [T]) Что такое монолитная архитектура?
2. (L1 [T]) Что такое микросервисная архитектура?
3. (L1 [T]) Что такое API?
4. (L1 [T]) Что такое REST?
5. (L1 [T]) Что такое gRPC?
6. (L1 [T]) Что такое load balancer?
7. (L1 [T]) Что такое stateless сервис?
8. (L1 [T]) Что такое stateful сервис?
9. (L1 [T]) Что такое service discovery?
10. (L1 [T]) Что такое endpoint?

---

11. (L2 [T]) В чём плюсы и минусы монолита?
12. (L2 [T]) В чём плюсы и минусы микросервисов?
13. (L2 [P]) Когда стоит переходить от монолита к микросервисам?
14. (L2 [T]) В чём разница REST vs gRPC?
15. (L2 [P]) Как спроектировать REST API?
16. (L2 [P]) Как спроектировать gRPC API?
17. (L2 [T]) Что такое versioning API?
18. (L2 [P]) Как обеспечить backward compatibility API?
19. (L2 [T]) Что такое service registry?
20. (L2 [P]) Как работает service discovery (client-side vs server-side)?
21. (L2 [T]) Какие бывают алгоритмы load balancing?
22. (L2 [T]) Что такое round-robin?
23. (L2 [T]) Что такое least connections?
24. (L2 [P]) Как балансировать stateful сервис?
25. (L2 [P]) Как сделать сервис stateless?
26. (L2 [T]) Что такое sticky sessions?
27. (L2 [P]) Когда использовать sticky sessions?

---

28. (L3 [D]) Почему сервис деградирует при росте нагрузки?
29. (L3 [D]) Как диагностировать cascading failure?
30. (L3 [T]) Что такое backpressure?
31. (L3 [P]) Как реализовать backpressure?
32. (L3 [T]) Что такое circuit breaker?
33. (L3 [P]) Как реализовать circuit breaker?
34. (L3 [D]) Почему возникают timeout'ы между сервисами?
35. (L3 [P]) Как правильно настроить retry?
36. (L3 [T]) Что такое bulkhead pattern?
37. (L3 [P]) Как изолировать сервисы друг от друга?
38. (L3 [D]) Почему растёт latency между микросервисами?
39. (L3 [D]) Как найти узкое место в цепочке сервисов?
40. (L3 [T]) Что такое API gateway?
41. (L3 [P]) Как реализовать API gateway?

---

42. (L4 [S]) Когда микросервисы вредны?
43. (L4 [S]) Как избежать distributed monolith?
44. (L4 [S]) Как правильно декомпозировать сервисы?
45. (L4 [S]) Как определить границы сервисов (DDD, bounded context)?
46. (L4 [S]) Как проектировать backend для high-load системы?
47. (L4 [S]) Когда использовать gRPC вместо REST на уровне архитектуры?
48. (L4 [S]) Как проектировать систему с тысячами сервисов?
49. (L4 [S]) Как управлять конфигурацией сервисов?
50. (L4 [S]) Как проектировать multi-region backend?
51. (L4 [S]) Как строить resilient backend архитектуру?

