# 🔍 9. Observability (наблюдаемость)

Senior уровень без этого не проходит.

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

* Logging
* Metrics
* Tracing
* Alerting

---

1. (L1 [T]) Что такое observability?
2. (L1 [T]) Чем observability отличается от monitoring?
3. (L1 [T]) Что такое логирование (logging)?
4. (L1 [T]) Что такое метрики (metrics)?
5. (L1 [T]) Что такое tracing?
6. (L1 [T]) Что такое alerting?
7. (L1 [T]) Что такое лог-сообщение?
8. (L1 [T]) Что такое таймсерия (time series)?
9. (L1 [T]) Что такое trace/span?
10. (L1 [T]) Что такое latency метрика?

---

11. (L2 [T]) Какие типы метрик существуют (counter, gauge, histogram)?
12. (L2 [P]) Как выбрать метрики для сервиса?
13. (L2 [T]) Что такое structured logging?
14. (L2 [P]) Как писать полезные логи?
15. (L2 [T]) Что такое correlation ID?
16. (L2 [P]) Как трассировать запрос через несколько сервисов?
17. (L2 [T]) Что такое distributed tracing?
18. (L2 [P]) Как работает tracing система (например Jaeger)?
19. (L2 [T]) Что такое sampling в tracing?
20. (L2 [P]) Как выбрать sampling rate?
21. (L2 [T]) Что такое alert threshold?
22. (L2 [P]) Как настраивать алерты?
23. (L2 [T]) Что такое noisy alerts?
24. (L2 [P]) Как уменьшить alert fatigue?
25. (L2 [T]) Что такое dashboard?

---

26. (L3 [D]) Почему система “зелёная”, но пользователи жалуются?
27. (L3 [D]) Как найти root cause по логам?
28. (L3 [D]) Почему метрики не отражают реальность?
29. (L3 [D]) Как диагностировать рост latency?
30. (L3 [T]) Что такое RED метод (Rate, Errors, Duration)?
31. (L3 [T]) Что такое USE метод (Utilization, Saturation, Errors)?
32. (L3 [P]) Как анализировать distributed trace?
33. (L3 [D]) Почему пропадают логи?
34. (L3 [P]) Как обеспечить надёжную доставку логов?
35. (L3 [D]) Почему алерты приходят слишком поздно?
36. (L3 [P]) Как настроить early warning систему?
37. (L3 [T]) Что такое high-cardinality метрики?
38. (L3 [D]) Почему monitoring система сама становится bottleneck?

---

39. (L4 [S]) Как построить observability платформу с нуля?
40. (L4 [S]) Как балансировать стоимость хранения логов и метрик?
41. (L4 [S]) Как проектировать observability для микросервисов?
42. (L4 [S]) Какие сигналы критичны для high-load системы?
43. (L4 [S]) Как проектировать SLO-driven monitoring?
44. (L4 [S]) Как связать observability с incident response?
45. (L4 [S]) Как минимизировать MTTR (mean time to recovery)?
46. (L4 [S]) Как проектировать scalable logging pipeline?

