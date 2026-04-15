## 🗄️ 2. Хранение данных (Data Storage)

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

Очень часто проверяют глубину именно здесь.

**Подтемы:**

* SQL vs NoSQL
* ACID vs BASE
* Indexing (B-Tree, LSM)
* Sharding (range, hash, geo)
* Replication (leader-follower, multi-leader)
* Data partitioning

---

1. (L1 [T]) В чём разница между SQL и NoSQL?
2. (L1 [T]) Что такое реляционная база данных?
3. (L1 [T]) Что такое документная база данных?
4. (L1 [T]) Что такое ключ-значение (key-value) storage?
5. (L1 [T]) Что такое колонко-ориентированная БД?
6. (L1 [T]) Что такое ACID?
7. (L1 [T]) Что означает Atomicity?
8. (L1 [T]) Что означает Consistency (в контексте ACID)?
9. (L1 [T]) Что означает Isolation?
10. (L1 [T]) Что означает Durability?
11. (L1 [T]) Что такое BASE?
12. (L1 [T]) Что такое eventual consistency в BASE?
13. (L1 [T]) Что такое индекс?
14. (L1 [T]) Что такое B-Tree?
15. (L1 [T]) Что такое LSM Tree?
16. (L1 [T]) Что такое shard?
17. (L1 [T]) Что такое replication?

---

18. (L2 [T]) Когда выбирать SQL вместо NoSQL?
19. (L2 [T]) Когда NoSQL лучше SQL?
20. (L2 [P]) Как выбрать тип БД под продукт?
21. (L2 [T]) В чём разница между ACID и BASE?
22. (L2 [T]) Какие компромиссы даёт BASE?
23. (L2 [T]) Как работает B-Tree индекс?
24. (L2 [T]) Как работает LSM Tree?
25. (L2 [P]) Когда использовать LSM вместо B-Tree?
26. (L2 [T]) Что такое secondary index?
27. (L2 [T]) Что такое covering index?
28. (L2 [P]) Как спроектировать индекс под запрос?
29. (L2 [T]) Что такое range-based sharding?
30. (L2 [T]) Что такое hash-based sharding?
31. (L2 [T]) Что такое geo-sharding?
32. (L2 [P]) Как выбрать стратегию шардинга?
33. (L2 [T]) Что такое leader-follower replication?
34. (L2 [T]) Что такое read replicas?
35. (L2 [P]) Как масштабировать read-heavy workload?
36. (L2 [T]) Что такое data partitioning?
37. (L2 [P]) Как разделить таблицу на партиции?

---

38. (L3 [D]) Почему запрос стал медленным после добавления индекса?
39. (L3 [D]) Почему индекс не используется?
40. (L3 [D]) Как найти full table scan?
41. (L3 [T]) Как работает MVCC?
42. (L3 [T]) Что такое snapshot isolation?
43. (L3 [D]) Почему возникают deadlocks в БД?
44. (L3 [P]) Как мигрировать данные без downtime?
45. (L3 [P]) Как перераспределить shard?
46. (L3 [D]) Как обнаружить hot shard?
47. (L3 [T]) Что такое consistent hashing?
48. (L3 [P]) Как реализовать consistent hashing?
49. (L3 [D]) Почему реплика отстаёт (replication lag)?
50. (L3 [D]) Как диагностировать replication lag?
51. (L3 [T]) Что такое write amplification в LSM?
52. (L3 [T]) Что такое compaction?
53. (L3 [D]) Почему резко вырос latency записи?
54. (L3 [P]) Как оптимизировать heavy write workload?

---

55. (L4 [S]) Как выбрать архитектуру хранения для миллиарда пользователей?
56. (L4 [S]) Когда использовать multi-leader replication?
57. (L4 [S]) Когда использовать leaderless (Dynamo-style) системы?
58. (L4 [S]) Как минимизировать cross-shard запросы?
59. (L4 [S]) Как проектировать глобально распределённую БД?
60. (L4 [S]) Как обеспечить low-latency доступ к данным по всему миру?
61. (L4 [S]) Как балансировать consistency vs latency?
62. (L4 [S]) Как проектировать storage под high-write систему (логирование, метрики)?
63. (L4 [S]) Как проектировать storage под OLAP vs OLTP?
64. (L4 [S]) Как выбрать между B-Tree и LSM на уровне всей системы?

