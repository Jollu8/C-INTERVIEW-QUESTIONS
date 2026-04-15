# 🧱 1. Модели данных — Вопросы

## Legend

* **L1** — базовый (понимание концепции)
* **L2** — middle (уверенное применение)
* **L3** — senior (глубокое понимание и диагностика)
* **L4** — staff (архитектура и стратегия)

* **[T]** — теория
* **[P]** — практика
* **[D]** — debugging / investigation
* **[S]** — system design / engineering strategy

---

## 🔹 Relational Model

### L1 — базовый уровень

**[T]**

1. Что такое отношение (relation) в терминах реляционной модели?
2. Чем отличается таблица от отношения?
3. Что такое первичный ключ и зачем он нужен?
4. Что такое нормализация (1NF, 2NF, 3NF)?
5. Что такое внешний ключ?
6. Что такое транзакция?
7. Что означает ACID?
8. Что такое JOIN и какие типы существуют?
9. Что такое индекс и зачем он нужен?
10. Разница между clustered и non-clustered индексом?

**[P]**
11. Как реализовать простую in-memory таблицу на C++?
12. Как представить строку таблицы в виде структуры?
13. Как реализовать hash index на C?
14. Как эффективно хранить nullable поля?
15. Как реализовать простой SELECT * WHERE?

---

### L2 — middle

**[T]**
16. Что такое денормализация и когда она оправдана?
17. Как работает B-Tree индекс?
18. Что такое cost-based optimizer?
19. Чем отличается OLTP от OLAP?
20. Что такое MVCC?

**[P]**
21. Реализовать простой B-Tree на C++
22. Реализовать secondary index
23. Написать простой query planner
24. Реализовать WAL (write-ahead log)
25. Реализовать простую транзакцию с rollback

**[D]**
26. Почему SELECT стал медленным после добавления индекса?
27. Почему JOIN вызывает explosion памяти?
28. Почему VACUUM (или аналог) тормозит систему?
29. Почему растёт latency при большом числе concurrent транзакций?
30. Почему deadlock происходит даже при простых операциях?

---

### L3 — senior

**[T]**
31. Как реализуется MVCC на уровне storage?
32. Что такое snapshot isolation vs serializable?
33. Как устроен buffer pool?
34. Как работает lock manager?
35. Что такое write amplification?

**[P]**
36. Реализовать MVCC версионирование строк
37. Реализовать lock-free index (пример)
38. Написать page cache (аналог buffer pool)
39. Реализовать LRU eviction
40. Реализовать concurrent B-Tree

**[D]**
41. Как диагностировать contention в lock manager?
42. Почему CPU 100%, но throughput падает?
43. Как найти источник IO bottleneck?
44. Почему WAL стал узким местом?
45. Как диагностировать false sharing в структуре индекса?

---

### L4 — staff

**[S]**
46. Когда выбирать relational DB, а не NoSQL?
47. Как масштабировать relational DB горизонтально?
48. Как спроектировать multi-tenant storage?
49. Как выбрать стратегию индексации для high-write workload?
50. Как проектировать storage engine с нуля?

---

## 🔹 Key-Value Model

---

### L1

**[T]**
51. Что такое key-value store?
52. Чем отличается от relational?
53. Какие операции базовые?
54. Что такое TTL?
55. Что такое consistent hashing?

**[P]**
56. Реализовать KV store на mmap файле
57. Реализовать hash table на C
58. Добавить TTL поддержку
59. Реализовать простой LRU cache
60. Сделать persistence через append-only log

---

### L2

**[T]**
61. Что такое LSM-tree?
62. Чем отличается от B-Tree?
63. Что такое compaction?
64. Что такое bloom filter?
65. Что такое write amplification в KV?

**[P]**
66. Реализовать LSM-tree (упрощённо)
67. Добавить bloom filter
68. Реализовать SSTable
69. Реализовать compaction
70. Реализовать memtable

**[D]**
71. Почему резко вырос disk usage?
72. Почему latency скачет?
73. Почему compaction съедает CPU?
74. Почему read amplification вырос?
75. Почему hot keys убивают performance?

---

### L3

**[T]**
76. Как устроен RocksDB / LevelDB?
77. Как реализуется WAL в KV?
78. Как работает tiered storage?
79. Как реализуется snapshot?
80. Как устроена memory layout оптимизация?

**[P]**
81. Реализовать lock-free hash table
82. Реализовать zero-copy read (mmap)
83. Оптимизировать layout под cache lines
84. Реализовать concurrent memtable
85. Реализовать prefix compression

**[D]**
86. Как найти cache miss bottleneck?
87. Почему NUMA влияет на KV store?
88. Почему malloc/free тормозит систему?
89. Как выявить fragmentation?
90. Почему page faults растут?

---

### L4

**[S]**
91. Как спроектировать distributed KV store?
92. Как выбрать replication strategy?
93. Когда использовать sharding?
94. Как проектировать storage под SSD vs HDD?
95. Как избежать write amplification?

---

## 🔹 Document Model

---

### L1

**[T]**
96. Что такое document DB?
97. Чем отличается от KV?
98. Что такое JSON/BSON?
99. Что такое schema-less?
100. Что такое embedded documents?

**[P]**
101. Реализовать хранение JSON документов
102. Написать простой parser JSON на C++
103. Реализовать поиск по полю
104. Добавить вложенные структуры
105. Реализовать update документа

---

### L2

**[T]**
106. Как реализуется индекс по вложенным полям?
107. Что такое aggregation pipeline?
108. Что такое document fragmentation?
109. Как реализуется partial update?
110. Как работает compression?

**[P]**
111. Реализовать inverted index
112. Реализовать query engine для JSON
113. Реализовать projection
114. Реализовать partial update
115. Реализовать document compaction

---

### L3

**[T]**
116. Как реализуется storage engine в MongoDB?
117. Как работают secondary indexes?
118. Как решается проблема больших документов?
119. Как реализуется journaling?
120. Как работает sharding?

---
