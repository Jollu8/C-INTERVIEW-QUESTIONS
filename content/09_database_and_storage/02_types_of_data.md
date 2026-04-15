# 📦 2. Типы баз данных — Вопросы

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

## 🔹 OLTP vs OLAP

---

### L1

**[T]**

1. В чем фундаментальная разница между OLTP и OLAP?
2. Какие workload-характеристики у OLTP?
3. Какие workload-характеристики у OLAP?
4. Почему OLAP предпочитает column-store?
5. Что такое transactional vs analytical query?

**[P]**
6. Смоделировать OLTP workload (много мелких writes)
7. Смоделировать OLAP workload (scan + aggregation)
8. Написать benchmark (C++) для сравнения latency vs throughput
9. Реализовать batched insert vs single insert
10. Сравнить performance row vs column layout

---

### L2

**[T]**
11. Почему OLTP требует low latency, а OLAP — high throughput?
12. Что такое star schema?
13. Что такое snowflake schema?
14. Почему joins в OLAP дорогие?
15. Что такое vectorized execution?

**[P]**
16. Реализовать column scan с SIMD
17. Реализовать aggregation pipeline
18. Написать простой vectorized executor
19. Реализовать batch processing
20. Реализовать simple columnar compression

**[D]**
21. Почему OLAP query грузит CPU на 100%?
22. Почему OLTP latency нестабилен?
23. Почему scan быстрее index lookup?
24. Почему cache misses критичны для OLAP?
25. Почему branch misprediction влияет на OLAP?

---

### L3

**[T]**
26. Как устроен execution engine в аналитических БД?
27. Что такое late materialization?
28. Что такое predicate pushdown?
29. Как работает SIMD в аналитике?
30. Что такое pipeline execution?

**[P]**
31. Реализовать predicate pushdown
32. Реализовать late materialization
33. Написать SIMD filter (AVX)
34. Реализовать columnar iterator
35. Реализовать pipeline execution engine

**[D]**
36. Как найти bottleneck в аналитическом запросе?
37. Почему memory bandwidth становится лимитом?
38. Как диагностировать NUMA penalty?
39. Почему prefetching не работает?
40. Как найти vectorization regression?

---

### L4

**[S]**
41. Когда разделять OLTP и OLAP системы?
42. Как строить HTAP систему?
43. Как проектировать real-time analytics?
44. Как минимизировать data duplication?
45. Как выбрать storage layout под mixed workload?

---

## 🔹 Row-based vs Column-based

---

### L1

**[T]**
46. В чем разница row-store vs column-store?
47. Когда лучше row-based?
48. Когда лучше column-based?
49. Что такое cache locality?
50. Почему column-store лучше для агрегаций?

**[P]**
51. Реализовать row layout (struct of structs)
52. Реализовать column layout (struct of arrays)
53. Сравнить cache misses
54. Написать scan benchmark
55. Реализовать simple filter

---

### L2

**[T]**
56. Что такое compression в column-store?
57. Что такое dictionary encoding?
58. Что такое run-length encoding?
59. Что такое bit-packing?
60. Почему column-store лучше с SIMD?

**[P]**
61. Реализовать dictionary encoding
62. Реализовать RLE
63. Реализовать bit-packing
64. Реализовать vectorized scan
65. Реализовать selective column loading

**[D]**
66. Почему column-store медленный для point lookup?
67. Почему row-store плохо масштабируется для аналитики?
68. Почему compression ухудшает latency?
69. Почему CPU cache thrashing?
70. Почему memory alignment влияет на perf?

---

### L3

**[T]**
71. Что такое hybrid storage (PAX, DSM)?
72. Как устроен Apache Parquet / ORC?
73. Что такое column chunk?
74. Что такое encoding pipelines?
75. Как работает predicate pushdown в column store?

**[P]**
76. Реализовать PAX layout
77. Реализовать column chunk storage
78. Реализовать predicate pushdown
79. Реализовать selective decompression
80. Реализовать column pruning

**[D]**
81. Почему decompression bottleneck?
82. Почему IO pattern стал случайным?
83. Почему vectorization не даёт прироста?
84. Как диагностировать misaligned loads?
85. Почему page faults растут при scan?

---

### L4

**[S]**
86. Как выбрать layout для mixed workload?
87. Когда использовать hybrid storage?
88. Как проектировать column-store engine?
89. Как выбрать encoding strategy?
90. Как оптимизировать под SSD vs RAM?

---

## 🔹 In-Memory Databases

---

### L1

**[T]**
91. Что такое in-memory DB?
92. Почему RAM быстрее диска?
93. Что такое persistence в in-memory DB?
94. Что такое snapshot?
95. Что такое durability trade-off?

**[P]**
96. Реализовать in-memory KV store
97. Реализовать snapshot на диск
98. Использовать mmap
99. Реализовать ring buffer для WAL
100. Реализовать простой allocator

---

### L2

**[T]**
101. Что такое NUMA?
102. Почему memory latency важна?
103. Что такое lock-free структуры?
104. Что такое false sharing?
105. Что такое memory fragmentation?

**[P]**
106. Реализовать lock-free queue
107. Реализовать custom allocator
108. Оптимизировать под cache lines
109. Реализовать slab allocator
110. Реализовать NUMA-aware allocation

**[D]**
111. Почему latency нестабилен?
112. Почему CPU usage высокий?
113. Почему malloc тормозит?
114. Почему TLB misses растут?
115. Как найти false sharing?

---

### L3

**[T]**
116. Как устроен Redis internals?
117. Как реализуется persistence (RDB/AOF)?
118. Как работает event loop?
119. Что такое zero-copy?
120. Как работает memory eviction?

**[P]**
121. Реализовать event loop (epoll)
122. Реализовать zero-copy send
123. Реализовать eviction policy
124. Реализовать async IO
125. Реализовать memory pool

**[D]**
126. Почему GC/eviction вызывает latency spikes?
127. Почему network становится bottleneck?
128. Как диагностировать epoll overhead?
129. Почему throughput падает при росте клиентов?
130. Как найти memory leak?

---

### L4

**[S]**
131. Когда использовать in-memory DB?
132. Как обеспечить durability?
133. Как проектировать hybrid RAM+disk систему?
134. Как масштабировать?
135. Как балансировать latency vs persistence?

---

## 🔹 Time-Series Databases

---

### L1

**[T]**
136. Что такое time-series DB?
137. Какие особенности данных?
138. Что такое append-only?
139. Что такое retention policy?
140. Что такое downsampling?

**[P]**
141. Реализовать append-only storage
142. Реализовать time index
143. Реализовать rolling window
144. Реализовать retention cleanup
145. Реализовать timestamp compression

---

### L2

**[T]**
146. Что такое chunking?
147. Что такое compression (delta, Gorilla)?
148. Что такое cardinality problem?
149. Что такое tag index?
150. Что такое write-heavy workload?

**[P]**
151. Реализовать delta encoding
152. Реализовать chunk storage
153. Реализовать tag index
154. Реализовать compression pipeline
155. Реализовать batched ingestion

**[D]**
156. Почему high cardinality убивает память?
157. Почему write throughput падает?
158. Почему query latency растёт?
159. Почему compaction дорогой?
160. Почему disk IO растёт?

---

### L3

**[T]**
161. Как устроен InfluxDB / Prometheus storage?
162. Как работает WAL + compaction?
163. Как реализуется compression?
164. Как устроены inverted indexes?
165. Как работает query engine?

---

### L4

**[S]**
166. Как проектировать TSDB под миллиарды точек?
167. Как решать high-cardinality проблему?
168. Как строить real-time ingestion pipeline?
169. Как балансировать storage vs query speed?
170. Как проектировать retention + cold storage?

---

## 🔹 NewSQL

---

### L1

**[T]**
171. Что такое NewSQL?
172. Чем отличается от NoSQL и RDBMS?
173. Что такое distributed SQL?
174. Что такое strong consistency?
175. Что такое horizontal scaling?

---

### L2

**[T]**
176. Как работает distributed transaction?
177. Что такое 2PC?
178. Что такое consensus (Raft)?
179. Что такое sharding?
180. Что такое global index?

**[P]**
181. Реализовать простой Raft (упрощённо)
182. Реализовать 2PC coordinator
183. Реализовать shard routing
184. Реализовать distributed KV
185. Реализовать leader election

**[D]**
186. Почему latency высокий?
187. Почему транзакции блокируются?
188. Почему split brain?
189. Почему replication lag?
190. Почему network — bottleneck?

---

### L3

**[T]**
191. Как устроены CockroachDB / Google Spanner?
192. Что такое TrueTime?
193. Как реализуется serializability?
194. Как работает distributed query planner?
195. Как работает rebalancing?

---

### L4

**[S]**
196. Когда выбирать NewSQL?
197. Как проектировать глобально распределённую БД?
198. Как балансировать consistency vs latency?
199. Как проектировать multi-region system?
200. Как строить fault-tolerant storage?

---
