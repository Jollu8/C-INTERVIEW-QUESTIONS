# 🔒 8. Надёжность и отказоустойчивость

Интервьюеры любят ломать твою систему.

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

* Retries, backoff
* Circuit breaker
* Failover
* SLA / SLO / SLI

---

1. (L1 [T]) Что такое надёжность системы?
2. (L1 [T]) Что такое отказ (failure)?
3. (L1 [T]) Что такое retry?
4. (L1 [T]) Что такое backoff?
5. (L1 [T]) Что такое circuit breaker?
6. (L1 [T]) Что такое failover?
7. (L1 [T]) Что такое SLA?
8. (L1 [T]) Что такое SLO?
9. (L1 [T]) Что такое SLI?

---

10. (L2 [T]) Когда использовать retry?
11. (L2 [P]) Как реализовать retry?
12. (L2 [T]) Что такое exponential backoff?
13. (L2 [P]) Как настроить backoff стратегию?
14. (L2 [T]) Когда retry вреден?
15. (L2 [T]) Как работает circuit breaker (open/half-open/closed)?
16. (L2 [P]) Как реализовать circuit breaker?
17. (L2 [T]) Что такое timeout?
18. (L2 [P]) Как правильно выбирать timeout?
19. (L2 [T]) Что такое failover (active-passive, active-active)?
20. (L2 [P]) Как реализовать failover?
21. (L2 [T]) Как измерять availability?
22. (L2 [T]) Как рассчитывается SLA?
23. (L2 [P]) Как определить SLO для сервиса?
24. (L2 [T]) Что такое error budget?

---

25. (L3 [D]) Почему retry вызывает деградацию системы?
26. (L3 [D]) Как диагностировать retry storm?
27. (L3 [D]) Почему circuit breaker не спасает систему?
28. (L3 [P]) Как правильно настроить thresholds для circuit breaker?
29. (L3 [D]) Почему failover не сработал?
30. (L3 [D]) Как обнаружить частичные отказы (partial failures)?
31. (L3 [T]) Что такое cascading failure?
32. (L3 [P]) Как предотвратить cascading failure?
33. (L3 [D]) Почему SLA не выполняется?
34. (L3 [P]) Как анализировать downtime?
35. (L3 [T]) Что такое graceful degradation?
36. (L3 [P]) Как реализовать graceful degradation?
37. (L3 [D]) Почему система падает при пике нагрузки?
38. (L3 [T]) Что такое bulkhead pattern?

---

39. (L4 [S]) Как проектировать highly available систему?
40. (L4 [S]) Как балансировать reliability vs cost?
41. (L4 [S]) Как проектировать multi-region failover?
42. (L4 [S]) Когда использовать active-active vs active-passive?
43. (L4 [S]) Как правильно задавать SLA/SLO для продукта?
44. (L4 [S]) Как управлять error budget на уровне организации?
45. (L4 [S]) Как проектировать систему с минимальным downtime?
46. (L4 [S]) Как строить self-healing системы?
47. (L4 [S]) Как проектировать систему, устойчивую к partial failures?

