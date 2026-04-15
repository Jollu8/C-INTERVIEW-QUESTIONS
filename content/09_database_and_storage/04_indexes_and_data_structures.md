# 🔍 4. Индексы и структуры данных

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

## 🔹 B-Tree

---

1. (L1 [T]) Что такое B-Tree и какие инварианты он поддерживает?

2. (L1 [T]) Чем B-Tree отличается от бинарного дерева поиска?

3. (L1 [T]) Почему B-Tree хорошо подходит для дисковых структур?

4. (L1 [T]) Что такое порядок (order) B-Tree?

5. (L1 [T]) Что такое node/page в контексте B-Tree?

6. (L1 [T]) Что такое leaf node и internal node?

7. (L1 [T]) Как выполняется поиск в B-Tree?

8. (L1 [T]) Как выполняется вставка?

9. (L1 [T]) Что такое split node?

10. (L1 [T]) Почему высота дерева мала?

11. (L1 [P]) Реализовать in-memory B-Tree на C++

12. (L1 [P]) Реализовать поиск по ключу

13. (L1 [P]) Реализовать вставку с split

14. (L1 [P]) Реализовать удаление (упрощённо)

15. (L1 [P]) Реализовать итератор по B-Tree

---

16. (L2 [T]) Почему размер страницы обычно совпадает с page size ОС (4KB/8KB)?

17. (L2 [T]) Что такое fanout и как он влияет на глубину дерева?

18. (L2 [T]) Почему B-Tree оптимален по IO?

19. (L2 [T]) Что такое B+Tree и чем он отличается?

20. (L2 [T]) Почему данные обычно хранятся только в листьях?

21. (L2 [T]) Что такое range scan и почему он эффективен?

22. (L2 [T]) Что такое latch coupling?

23. (L2 [T]) Почему node split дорогой?

24. (L2 [T]) Что такое fill factor?

25. (L2 [T]) Почему fragmentation влияет на B-Tree?

26. (L2 [P]) Реализовать B+Tree с linked листьями

27. (L2 [P]) Реализовать range scan iterator

28. (L2 [P]) Реализовать page layout (slotted page)

29. (L2 [P]) Реализовать бинарный поиск внутри страницы

30. (L2 [P]) Реализовать page split с перераспределением ключей

31. (L2 [D]) Почему insert latency растёт при заполнении дерева?

32. (L2 [D]) Почему range scan стал медленным?

33. (L2 [D]) Почему page split вызывает latency spikes?

34. (L2 [D]) Почему cache miss rate высокий?

35. (L2 [D]) Почему random IO растёт?

---

36. (L3 [T]) Как устроен B-Tree в PostgreSQL/InnoDB на уровне страниц?

37. (L3 [T]) Что такое sibling pointers и зачем они нужны?

38. (L3 [T]) Как работает latch coupling при traversal?

39. (L3 [T]) Как реализуется concurrent B-Tree?

40. (L3 [T]) Что такое B-link tree?

41. (L3 [T]) Как реализуются key-range locks?

42. (L3 [T]) Как влияет cache line alignment на performance?

43. (L3 [T]) Почему pointer chasing дорогой?

44. (L3 [T]) Как работает prefix compression?

45. (L3 [T]) Как реализуется page compaction?

46. (L3 [P]) Реализовать concurrent B-Tree с latch coupling

47. (L3 [P]) Реализовать prefix compression ключей

48. (L3 [P]) Реализовать page compaction

49. (L3 [P]) Реализовать B-link tree

50. (L3 [P]) Реализовать optimistic traversal

51. (L3 [D]) Почему contention на root node?

52. (L3 [D]) Почему NUMA ухудшает performance B-Tree?

53. (L3 [D]) Почему TLB misses растут при больших индексах?

54. (L3 [D]) Почему branch misprediction влияет на поиск?

55. (L3 [D]) Как диагностировать latch contention?

---

56. (L4 [S]) Когда B-Tree лучше LSM?
57. (L4 [S]) Как выбрать размер страницы?
58. (L4 [S]) Как проектировать B-Tree под SSD?
59. (L4 [S]) Как бороться с hot keys?
60. (L4 [S]) Как проектировать concurrent index без глобальных bottleneck?

---

## 🔹 LSM Tree

---

61. (L1 [T]) Что такое LSM Tree?

62. (L1 [T]) Из каких компонентов он состоит?

63. (L1 [T]) Что такое memtable?

64. (L1 [T]) Что такое SSTable?

65. (L1 [T]) Что такое compaction?

66. (L1 [T]) Почему LSM оптимален для write-heavy workload?

67. (L1 [T]) Почему reads дороже?

68. (L1 [T]) Что такое immutable structure?

69. (L1 [T]) Что такое flush?

70. (L1 [T]) Что такое write amplification?

71. (L1 [P]) Реализовать memtable (skip list / tree)

72. (L1 [P]) Реализовать SSTable файл

73. (L1 [P]) Реализовать flush на диск

74. (L1 [P]) Реализовать merge нескольких SSTable

75. (L1 [P]) Реализовать простой LSM KV store

---

76. (L2 [T]) Что такое leveled vs tiered compaction?

77. (L2 [T]) Что такое bloom filter?

78. (L2 [T]) Что такое read amplification?

79. (L2 [T]) Почему compaction дорогой?

80. (L2 [T]) Как работает merge iterator?

81. (L2 [T]) Что такое tombstone?

82. (L2 [T]) Почему delete дорогой?

83. (L2 [T]) Что такое write stall?

84. (L2 [T]) Что такое backpressure?

85. (L2 [T]) Почему LSM плохо для range scan?

86. (L2 [P]) Реализовать bloom filter

87. (L2 [P]) Реализовать merge iterator

88. (L2 [P]) Реализовать leveled compaction

89. (L2 [P]) Реализовать tombstone deletion

90. (L2 [P]) Реализовать read path через несколько уровней

91. (L2 [D]) Почему disk usage растёт?

92. (L2 [D]) Почему latency скачет?

93. (L2 [D]) Почему compaction грузит CPU?

94. (L2 [D]) Почему read amplification вырос?

95. (L2 [D]) Почему write stall происходит?

---

96. (L3 [T]) Как устроен RocksDB?

97. (L3 [T]) Как работает block cache?

98. (L3 [T]) Как устроен SSTable format?

99. (L3 [T]) Как реализуется prefix bloom?

100. (L3 [T]) Как работает compaction scheduler?

101. (L3 [T]) Как влияет SSD на LSM design?

102. (L3 [T]) Что такое compaction debt?

103. (L3 [T]) Как работает rate limiting compaction?

104. (L3 [T]) Как оптимизируется read path?

105. (L3 [T]) Как работает key ordering?

106. (L3 [P]) Реализовать block cache

107. (L3 [P]) Реализовать compaction scheduler

108. (L3 [P]) Реализовать prefix bloom filter

109. (L3 [P]) Реализовать zero-copy read SSTable

110. (L3 [P]) Реализовать rate-limited compaction

111. (L3 [D]) Почему compaction мешает latency SLA?

112. (L3 [D]) Почему CPU usage высокий даже без нагрузки?

113. (L3 [D]) Почему read path деградирует со временем?

114. (L3 [D]) Почему hot keys ломают LSM?

115. (L3 [D]) Как диагностировать compaction backlog?

---

116. (L4 [S]) Когда LSM лучше B-Tree?
117. (L4 [S]) Как выбрать compaction strategy?
118. (L4 [S]) Как проектировать LSM под SSD/NVMe?
119. (L4 [S]) Как минимизировать write amplification?
120. (L4 [S]) Как балансировать read vs write performance?

---

## 🔹 Hash Index

---

121. (L1 [T]) Что такое hash index?

122. (L1 [T]) Как работает hashing?

123. (L1 [T]) Что такое collision?

124. (L1 [T]) Что такое chaining vs open addressing?

125. (L1 [T]) Когда hash index лучше B-Tree?

126. (L1 [P]) Реализовать hash table на C

127. (L1 [P]) Реализовать chaining

128. (L1 [P]) Реализовать open addressing

129. (L1 [P]) Реализовать resize

130. (L1 [P]) Реализовать hash function

---

131. (L2 [T]) Почему hash index не поддерживает range queries?

132. (L2 [T]) Что такое load factor?

133. (L2 [T]) Почему resizing дорогой?

134. (L2 [T]) Что такое cache-friendly hashing?

135. (L2 [T]) Почему hash index чувствителен к skew?

136. (L2 [P]) Реализовать linear probing

137. (L2 [P]) Реализовать robin hood hashing

138. (L2 [P]) Реализовать concurrent hash table

139. (L2 [P]) Реализовать lock striping

140. (L2 [P]) Реализовать cache-aligned buckets

141. (L2 [D]) Почему hash table деградирует при load factor > 0.8?

142. (L2 [D]) Почему performance нестабилен?

143. (L2 [D]) Почему collisions резко выросли?

144. (L2 [D]) Почему resizing вызывает latency spike?

145. (L2 [D]) Почему cache misses высокий?

---

146. (L3 [T]) Как устроены hash индексы в production DB?

147. (L3 [T]) Что такое extendible hashing?

148. (L3 [T]) Что такое cuckoo hashing?

149. (L3 [T]) Как работает lock-free hash table?

150. (L3 [T]) Как влияет NUMA?

151. (L3 [P]) Реализовать cuckoo hashing

152. (L3 [P]) Реализовать extendible hashing

153. (L3 [P]) Реализовать lock-free hash table

154. (L3 [P]) Реализовать NUMA-aware hashing

155. (L3 [P]) Реализовать per-bucket locking

156. (L3 [D]) Почему hot bucket ломает throughput?

157. (L3 [D]) Почему false sharing?

158. (L3 [D]) Почему atomic operations дорогие?

159. (L3 [D]) Почему hash function стал bottleneck?

160. (L3 [D]) Как диагностировать contention?

---

161. (L4 [S]) Когда использовать hash index?
162. (L4 [S]) Как выбрать hashing strategy?
163. (L4 [S]) Как бороться с skew?
164. (L4 [S]) Как проектировать distributed hash index?
165. (L4 [S]) Когда hash хуже B-Tree даже для point lookup?

---

## 🔹 Secondary Indexes

---

166. (L1 [T]) Что такое secondary index?

167. (L1 [T]) Чем отличается от primary index?

168. (L1 [T]) Что хранится в secondary index?

169. (L1 [T]) Почему нужен pointer/reference?

170. (L1 [T]) Что такое index lookup?

171. (L1 [P]) Реализовать secondary index mapping key → pointer

172. (L1 [P]) Реализовать lookup через secondary index

173. (L1 [P]) Реализовать update secondary index

174. (L1 [P]) Реализовать delete

175. (L1 [P]) Реализовать multiple indexes

---

176. (L2 [T]) Почему secondary index может быть дорогим при update?

177. (L2 [T]) Что такое index maintenance?

178. (L2 [T]) Что такое index-only scan?

179. (L2 [T]) Что такое clustering factor?

180. (L2 [T]) Почему random IO возникает?

181. (L2 [P]) Реализовать index maintenance при insert/update/delete

182. (L2 [P]) Реализовать multi-index update

183. (L2 [P]) Реализовать index-only scan

184. (L2 [P]) Реализовать covering index

185. (L2 [P]) Реализовать deferred index update

186. (L2 [D]) Почему update стал медленным?

187. (L2 [D]) Почему index lookup медленный?

188. (L2 [D]) Почему disk IO вырос?

189. (L2 [D]) Почему fragmentation индекса?

190. (L2 [D]) Почему cache locality плохой?

---

191. (L3 [T]) Как secondary index реализуется в MVCC?

192. (L3 [T]) Как решается dangling pointer проблема?

193. (L3 [T]) Как secondary index связан с clustering?

194. (L3 [T]) Как реализуется covering index?

195. (L3 [T]) Как работает index scan + filter?

196. (L3 [P]) Реализовать MVCC-aware secondary index

197. (L3 [P]) Реализовать version pointer

198. (L3 [P]) Реализовать index vacuum

199. (L3 [P]) Реализовать index compaction

200. (L3 [P]) Реализовать multi-version lookup

---

201. (L4 [S]) Когда создавать secondary index?
202. (L4 [S]) Как выбрать поля?
203. (L4 [S]) Как балансировать write cost?
204. (L4 [S]) Как избегать over-indexing?
205. (L4 [S]) Как проектировать indexing strategy?

---

## 🔹 Covering Indexes

---

206. (L1 [T]) Что такое covering index?

207. (L1 [T]) Почему он ускоряет запросы?

208. (L1 [T]) Чем отличается от обычного secondary index?

209. (L1 [T]) Что такое index-only scan?

210. (L1 [T]) Когда он не работает?

211. (L1 [P]) Реализовать covering index

212. (L1 [P]) Реализовать index-only scan

213. (L1 [P]) Реализовать projection из индекса

214. (L1 [P]) Реализовать fallback на table lookup

215. (L1 [P]) Реализовать multi-column index

---

216. (L2 [T]) Почему covering index увеличивает размер индекса?

217. (L2 [T]) Что такое selectivity?

218. (L2 [T]) Как влияет порядок колонок?

219. (L2 [T]) Почему index может не использоваться?

220. (L2 [T]) Что такое prefix index?

221. (L2 [P]) Реализовать composite index

222. (L2 [P]) Реализовать prefix matching

223. (L2 [P]) Реализовать index scan optimizer

224. (L2 [P]) Реализовать cost estimation

225. (L2 [P]) Реализовать column pruning

---

226. (L3 [T]) Как covering index влияет на cache locality?

227. (L3 [T]) Как влияет на write amplification?

228. (L3 [T]) Как работает visibility check в index-only scan?

229. (L3 [T]) Как MVCC влияет на index-only scan?

230. (L3 [T]) Как planner выбирает covering index?

231. (L3 [P]) Реализовать visibility map

232. (L3 [P]) Реализовать MVCC-aware index-only scan

233. (L3 [P]) Реализовать adaptive index selection

234. (L3 [P]) Реализовать cost-based optimizer для index choice

235. (L3 [P]) Реализовать статистику использования индексов

---

236. (L4 [S]) Когда стоит делать covering index?
237. (L4 [S]) Как балансировать size vs performance?
238. (L4 [S]) Как проектировать composite indexes?
239. (L4 [S]) Как избегать redundant indexes?
240. (L4 [S]) Как проектировать indexing под конкретный workload?

---

