# ⚡ 5. Кэширование

Один из самых частых топиков.

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

* Cache aside / write-through / write-back
* TTL, eviction policies (LRU, LFU)
* Distributed cache (например Redis)

---

1. (L1 [T]) Что такое кэш?
2. (L1 [T]) Зачем нужен кэш?
3. (L1 [T]) Что такое TTL?
4. (L1 [T]) Что такое cache hit?
5. (L1 [T]) Что такое cache miss?
6. (L1 [T]) Что такое eviction?
7. (L1 [T]) Что такое LRU?
8. (L1 [T]) Что такое LFU?
9. (L1 [T]) Что такое distributed cache?
10. (L1 [T]) Где обычно располагается кэш в архитектуре?

---

11. (L2 [T]) Что такое cache-aside (lazy loading)?
12. (L2 [P]) Как реализовать cache-aside?
13. (L2 [T]) Что такое write-through cache?
14. (L2 [T]) Что такое write-back cache?
15. (L2 [T]) В чём разница между write-through и write-back?
16. (L2 [P]) Когда использовать cache-aside vs write-through?
17. (L2 [T]) Как выбрать TTL?
18. (L2 [P]) Как подобрать eviction policy?
19. (L2 [T]) Что такое cache invalidation?
20. (L2 [P]) Как инвалидировать кэш при изменении данных?
21. (L2 [T]) Что такое distributed cache (например Redis)?
22. (L2 [P]) Как масштабировать кэш?
23. (L2 [T]) Что такое consistent hashing в кэше?
24. (L2 [P]) Как распределить ключи по нодам кэша?
25. (L2 [T]) Что такое warmup кэша?

---

26. (L3 [D]) Почему кэш не даёт ускорения?
27. (L3 [D]) Почему низкий cache hit rate?
28. (L3 [D]) Как диагностировать cache stampede?
29. (L3 [P]) Как предотвратить cache stampede?
30. (L3 [D]) Почему появляется stale data?
31. (L3 [P]) Как бороться с устаревшими данными?
32. (L3 [T]) Что такое write amplification в кэше?
33. (L3 [D]) Почему кэш перегружен памятью?
34. (L3 [P]) Как оптимизировать memory usage кэша?
35. (L3 [T]) Что такое hot key problem?
36. (L3 [D]) Как обнаружить hot keys?
37. (L3 [P]) Как распределить нагрузку от hot keys?
38. (L3 [T]) Что такое dogpile effect?
39. (L3 [P]) Как реализовать request coalescing?

---

40. (L4 [S]) Где правильно размещать кэш (client, CDN, backend)?
41. (L4 [S]) Когда кэш вреден?
42. (L4 [S]) Как проектировать multi-layer caching?
43. (L4 [S]) Как балансировать consistency vs performance в кэше?
44. (L4 [S]) Как проектировать distributed cache для high-load системы?
45. (L4 [S]) Как минимизировать cache invalidation complexity?
46. (L4 [S]) Как проектировать кэш для write-heavy системы?
47. (L4 [S]) Когда отказаться от кэша?

