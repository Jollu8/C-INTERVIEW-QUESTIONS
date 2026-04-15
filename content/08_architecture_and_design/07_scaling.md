# 📈 7. Масштабирование

Отдельный блок, хотя пересекается с другими.

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

* Horizontal scaling
* Auto-scaling
* Load balancing algorithms
* Hot partitions

---

1. (L1 [T]) Что такое масштабирование?
2. (L1 [T]) Что такое horizontal scaling?
3. (L1 [T]) Что такое vertical scaling?
4. (L1 [T]) Что такое load balancing?
5. (L1 [T]) Что такое нода (node)?
6. (L1 [T]) Что такое кластер?
7. (L1 [T]) Что такое partition?
8. (L1 [T]) Что такое hot partition?

---

9. (L2 [T]) В чём разница horizontal vs vertical scaling?
10. (L2 [P]) Когда использовать horizontal scaling?
11. (L2 [P]) Когда vertical scaling лучше?
12. (L2 [T]) Какие бывают алгоритмы балансировки нагрузки?
13. (L2 [T]) Что такое round-robin?
14. (L2 [T]) Что такое least connections?
15. (L2 [T]) Что такое consistent hashing?
16. (L2 [P]) Как работает consistent hashing при добавлении ноды?
17. (L2 [T]) Что такое auto-scaling?
18. (L2 [P]) Какие метрики использовать для auto-scaling?
19. (L2 [T]) Что такое reactive vs predictive scaling?
20. (L2 [P]) Как масштабировать stateless сервис?
21. (L2 [P]) Как масштабировать stateful сервис?
22. (L2 [T]) Что такое hotspot в системе?
23. (L2 [P]) Как избежать hot partitions?

---

24. (L3 [D]) Почему система не масштабируется линейно?
25. (L3 [D]) Где возникает bottleneck при масштабировании?
26. (L3 [D]) Почему растёт latency при добавлении нод?
27. (L3 [T]) Что такое Amdahl’s Law?
28. (L3 [T]) Что такое tail latency?
29. (L3 [D]) Как диагностировать uneven load distribution?
30. (L3 [P]) Как перераспределить нагрузку между нодами?
31. (L3 [D]) Почему auto-scaling не успевает за нагрузкой?
32. (L3 [P]) Как настроить auto-scaling thresholds?
33. (L3 [T]) Что такое overprovisioning?
34. (L3 [D]) Как обнаружить hot shard / partition?
35. (L3 [P]) Как перераспределить ключи при hot partition?
36. (L3 [T]) Что такое load shedding?
37. (L3 [P]) Как реализовать graceful degradation?

---

38. (L4 [S]) Как проектировать систему с линейным масштабированием?
39. (L4 [S]) Когда horizontal scaling не работает?
40. (L4 [S]) Как проектировать auto-scaling стратегию?
41. (L4 [S]) Как балансировать cost vs performance?
42. (L4 [S]) Как проектировать multi-region scaling?
43. (L4 [S]) Как минимизировать tail latency?
44. (L4 [S]) Как проектировать систему без hot partitions?
45. (L4 [S]) Как масштабировать write-heavy систему?
46. (L4 [S]) Как масштабировать read-heavy систему?

