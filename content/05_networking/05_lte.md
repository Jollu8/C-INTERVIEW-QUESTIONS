# Вопросы: LTE (4G) (с уклоном в C/C++, сетевую инженерию и системный дизайн)

## 1. LTE: общая архитектура

### Базовый уровень
1. Что такое LTE?
2. Почему LTE относят к 4G?
3. Какие ключевые цели были у LTE по сравнению с 3G?
4. Какие основные компоненты входят в архитектуру LTE?
5. Что такое E-UTRAN?
6. Что такое EPC?
7. Чем radio access часть LTE отличается от core network?
8. Что такое eNodeB?
9. Что такое UE в LTE?
10. Какие функции выполняет EPC?
11. Почему LTE архитектурно разделяет access network и core network?
12. Что такое all-IP architecture в контексте LTE?
13. Почему переход к all-IP был важен для LTE?
14. Чем LTE архитектурно отличается от legacy circuit-switched сетей?
15. Что такое bearer в LTE?
16. Что такое PDN connection?
17. Что такое default bearer?
18. Что такое dedicated bearer?
19. Почему LTE считают packet-switched системой?
20. Какие интерфейсы внутри LTE архитектуры считаются ключевыми?
21. Что такое S1 interface?
22. Что такое X2 interface?
23. Для чего нужен S1-MME?
24. Для чего нужен S1-U?
25. Для чего нужен X2 между eNodeB?
26. Чем control signaling отличается от пользовательского трафика в LTE?
27. Почему архитектурное разделение control plane и user plane критично для LTE?
28. Как LTE обеспечивает mobility?
29. Как LTE обеспечивает data connectivity?
30. Какие главные сущности в LTE нужно знать до начала изучения процедур?

### Средний уровень
31. Почему eNodeB объединяет функции, которые раньше были более разделены?
32. Почему EPC построен как распределённая пакетная core-сеть?
33. Какие преимущества даёт упрощённая архитектура LTE по сравнению с 3G?
34. Как LTE поддерживает масштабируемость сети?
35. Как архитектура LTE помогает снижать latency?
36. Почему вынесение радиофункций в eNodeB улучшило responsiveness сети?
37. Как UE, eNodeB и EPC взаимодействуют при подключении пользователя?
38. Что такое NAS в архитектуре LTE?
39. Чем NAS отличается от AS signaling?
40. Почему важно различать radio layer процедуры и core network процедуры?
41. Как S1 интерфейс разделён на control/user части?
42. Почему X2 interface важен для handover?
43. Какие риски создаёт отказ eNodeB?
44. Какие риски создаёт отказ MME?
45. Какие риски создаёт отказ SGW/PGW?
46. Как архитектура LTE связана с roaming?
47. Что такое home network и visited network в LTE?
48. Как LTE архитектура помогает поддерживать множество сервисов с разными требованиями?
49. Как bearer architecture связана с QoS?
50. Почему understanding architecture важно для troubleshooting LTE?
51. Как транспортная IP-сеть оператора интегрируется с LTE архитектурой?
52. Почему backhaul критичен для LTE performance?
53. Какие bottlenecks возможны вне radio части, но всё равно деградируют LTE сервис?
54. Как control plane load и user plane load влияют на разные части сети?
55. Почему при анализе LTE нельзя ограничиваться только радиоинтерфейсом?
56. Как LTE архитектура отражает принципы modern distributed systems?
57. Где в LTE можно провести аналогию с классическим networking stack?
58. Какие части LTE ближе к telecom-specific domain, а какие — к обычной IP networking?
59. Что должен понимать software engineer про LTE architecture на уровне сущностей и интерфейсов?
60. Какие метрики архитектурного уровня наиболее полезны в эксплуатации LTE сети?

### Продвинутый уровень
61. Как control plane message flow проходит через архитектуру LTE при attach?
62. Как user plane traffic проходит через архитектуру LTE после установления bearer?
63. Как eNodeB разделяет radio resource management и transport forwarding?
64. Как EPC логически и физически масштабируется?
65. Какие stateful и stateless аспекты есть у LTE core?
66. Почему MME считается control-plane узлом без user-plane forwarding?
67. Как SGW и PGW разделяют функции data anchoring и external connectivity?
68. Как GTP-U используется в user plane LTE?
69. Как GTP-C используется в control procedures LTE?
70. Почему tunneling — фундаментальная часть EPC?
71. Какие преимущества и недостатки даёт широкое использование туннелей?
72. Как S1-U и GTP-U влияют на observability пользовательского трафика?
73. Какие проблемы debugging возникают из-за туннелирования?
74. Как correlation между subscriber/session/bearer реализуется в LTE core?
75. Как UE context распределён между eNodeB и EPC?
76. Что такое EPS session management на концептуальном уровне?
77. Как state machines в LTE похожи на state machines сетевых протоколов?
78. Как software fault в control plane может не затронуть established user plane сразу?
79. Как перегрузка core network проявляется для приложений пользователя?
80. Как LTE architecture влияет на failover scenarios?
81. Что значит anchor point в mobility context?
82. Почему SGW historically играл роль mobility anchor?
83. Как PGW связан с выходом в external packet networks?
84. Как charging/policy интегрируются в EPC?
85. Как lawful intercept и telecom policy constraints влияют на архитектуру LTE core?
86. Какие интерфейсы и узлы чаще всего становятся источником operational complexity?
87. Как latency budget распределяется между radio, backhaul и core?
88. Как tracing subscriber session делается сквозь архитектуру LTE?
89. Как программно моделировать LTE architecture для тестов/эмуляции?
90. Что должен понимать C/C++ разработчик сетевой платформы про разбиение LTE архитектуры на control и forwarding domains?

### Инженерные вопросы
91. Почему LTE архитектура считается хорошим примером эволюции к packet-native network?
92. Какие компромиссы между простотой, масштабируемостью и состоянием соединений заложены в LTE?
93. Почему EPC — это не просто “ещё один IP core”?
94. Какие архитектурные темы LTE особенно полезны для interview network/software engineer?
95. Что важно понимать про LTE architecture перед изучением attach, mobility и QoS?

---

## 2. eNodeB

### Базовый уровень
96. Что такое eNodeB?
97. Какова роль eNodeB в LTE?
98. Чем eNodeB отличается от базовой станции в более ранних поколениях?
99. Какие функции выполняет eNodeB на radio стороне?
100. Какие функции выполняет eNodeB на transport/control стороне?
101. Как eNodeB связан с UE?
102. Как eNodeB связан с EPC?
103. Почему eNodeB считается ключевым элементом E-UTRAN?
104. Какие протоколы/слои заканчиваются на eNodeB?
105. Что такое cell в контексте eNodeB?
106. Может ли один eNodeB обслуживать несколько сот?
107. Что такое sectorization на базовом уровне?
108. Почему eNodeB управляет radio resources?
109. Почему scheduling находится близко к radio edge?
110. Как eNodeB участвует в mobility?
111. Как eNodeB участвует в handover?
112. Что такое admission control на уровне eNodeB?
113. Что такое radio bearer и как eNodeB с ним связан?
114. Почему eNodeB важен для QoS enforcement?
115. Какие основные KPI обычно связывают с eNodeB?

### Средний уровень
116. Какие функции RRC выполняются в eNodeB?
117. Какие функции MAC/RLC/PDCP завершаются в eNodeB?
118. Как eNodeB управляет uplink и downlink ресурсами?
119. Почему eNodeB должен быстро реагировать на channel quality?
120. Как eNodeB принимает решения о scheduler allocation?
121. Что такое HARQ и как eNodeB участвует в HARQ?
122. Почему eNodeB критичен для latency-sensitive traffic?
123. Как eNodeB обрабатывает radio measurements от UE?
124. Как eNodeB выбирает MCS?
125. Как eNodeB принимает решение о handover?
126. Как eNodeB взаимодействует с соседними eNodeB?
127. Почему X2 interface важен именно для eNodeB-to-eNodeB coordination?
128. Как eNodeB контролирует load balancing между сотами?
129. Как eNodeB связан с interference management?
130. Как eNodeB участвует в power control?
131. Как eNodeB обеспечивает QoS differentiation?
132. Что происходит в eNodeB при attach пользователя?
133. Что происходит в eNodeB при release соединения?
134. Почему перегрузка eNodeB может проявляться и как радиопроблема, и как transport problem?
135. Какие counters eNodeB полезны для troubleshooting?
136. Как eNodeB влияет на user throughput?
137. Как eNodeB влияет на latency и jitter?
138. Как backhaul ограничения eNodeB masquerade as radio issues?
139. Что такое self-organizing network features на уровне eNodeB?
140. Какие operational проблемы чаще всего ассоциированы с eNodeB?
141. Почему software quality eNodeB stack критична для стабильности всей сети?
142. Какие части eNodeB обычно real-time sensitive?
143. Почему scheduler и HARQ logic нельзя делать с большой задержкой?
144. Какие интерфейсы eNodeB наиболее важны для packet captures и tracing?
145. Что должен понимать C/C++ engineer, если он пишет ПО для eNodeB или похожих real-time network nodes?

### Продвинутый уровень
146. Как eNodeB делит функции между control-plane processing и data-plane forwarding?
147. Как uplink packet проходит через radio stack eNodeB к GTP tunnel?
148. Как downlink packet проходит из S1-U/GTP к radio transmission?
149. Как eNodeB хранит UE context?
150. Какие state machines на UE-context уровне реализуются в eNodeB?
151. Как eNodeB управляет RRC states и radio bearers?
152. Как eNodeB реализует admission control при ограниченных ресурсах?
153. Как eNodeB взаимодействует с MME при attach и handover?
154. Как eNodeB выбирает target cell при handover?
155. Как реализуется scheduler fairness vs throughput optimization в eNodeB?
156. Как eNodeB балансирует QoS, channel quality и cell capacity?
157. Как real-time constraints влияют на архитектуру software внутри eNodeB?
158. Какие многопоточные/lock-free/RT подходы важны для eNodeB software?
159. Как NUMA, CPU affinity и packet processing влияют на performance eNodeB platform?
160. Как tracing в eNodeB усложняется из-за high event rate?
161. Какие race conditions опасны в UE context handling?
162. Как eNodeB software справляется с bursty control-plane events?
163. Как packet reordering может возникать на стыке radio retransmission и upper layers?
164. Как eNodeB expose metrics для OAM систем?
165. Как диагностика “проблема в eNodeB или в EPC” обычно строится?
166. Какие failure modes eNodeB приводят к attach failure?
167. Какие failure modes eNodeB приводят к throughput collapse?
168. Какие failure modes eNodeB приводят к abnormal handover behavior?
169. Как моделировать нагрузки на eNodeB в lab/testing environment?
170. Какие темы eNodeB наиболее важны для senior interview по telecom software?

### Инженерные вопросы
171. Почему eNodeB — это не просто “антенна с IP uplink”?
172. Почему eNodeB — один из самых сложных узлов LTE с точки зрения software engineering?
173. Какие компромиссы между low latency, fairness и capacity решает eNodeB?
174. Какие знания про eNodeB полезны C/C++ сетевому разработчику, даже если он не пишет PHY?
175. Что особенно важно понимать про eNodeB перед изучением scheduler, RRC и handover?

---

## 3. EPC: общая роль core network

### Базовый уровень
176. Что такое EPC?
177. Как расшифровывается EPC?
178. Какие главные узлы входят в EPC?
179. Зачем LTE нужна отдельная packet core сеть?
180. Как EPC связан с интернетом и внешними сетями?
181. Чем EPC отличается от радиодоступа?
182. Какие функции EPC относятся к control plane?
183. Какие функции EPC относятся к user plane?
184. Почему EPC является packet core, а не circuit core?
185. Что такое EPS в связи с EPC?
186. Что такое subscriber/session management на уровне EPC?
187. Как EPC участвует в mobility?
188. Как EPC участвует в аутентификации?
189. Как EPC участвует в policy enforcement?
190. Как EPC участвует в charging?
191. Почему EPC нужен даже если radio link отличный?
192. Как EPC влияет на end-to-end latency?
193. Как EPC влияет на user connectivity?
194. Какие KPI связаны с EPC?
195. Какие основные проблемы могут происходить в EPC?

### Средний уровень
196. Почему EPC логически разделён на специализированные узлы?
197. Какие преимущества у разделения MME / SGW / PGW?
198. Как EPC поддерживает множество одновременных пользователей?
199. Как EPC хранит состояние активных сессий?
200. Что такое bearer context внутри EPC?
201. Как EPC взаимодействует с PCRF на концептуальном уровне?
202. Как EPC поддерживает разные QoS profiles?
203. Как EPC поддерживает roaming?
204. Как EPC взаимодействует с HSS на концептуальном уровне?
205. Почему signaling storm опасен для EPC?
206. Почему control-plane overload и user-plane overload проявляются по-разному?
207. Как backhaul/core congestion отражается на пользовательском опыте?
208. Какие интерфейсы EPC особенно важны для понимания attach и data session?
209. Почему GTP central to EPC architecture?
210. Какие сложности добавляет туннелирование для observability?
211. Как failures в одном EPC узле могут каскадно затрагивать остальные?
212. Какие узлы EPC наиболее чувствительны к high session churn?
213. Как EPC участвует в создании и удалении bearers?
214. Что такое default path for user traffic в EPC?
215. Почему EPC должен сочетать telecom signaling и обычный IP forwarding?
216. Как software engineers обычно отлаживают EPC issues?
217. Как state correlation между логами разных EPC узлов обычно организуется?
218. Почему EPC — хороший пример stateful distributed system?
219. Какие части EPC должны быть highly available?
220. Что особенно важно понимать в EPC инженеру по network software?

### Продвинутый уровень
221. Как attach procedure проходит через EPC на high level?
222. Как bearer establishment проходит через EPC?
223. Как MME, SGW, PGW делят ответственность при создании data path?
224. Как EPC реализует separation of control and forwarding?
225. Как GTP-C и GTP-U взаимодействуют в EPC?
226. Как session anchoring влияет на mobility behavior?
227. Как charging/policy decisions materialize as bearer/QoS state?
228. Как subscriber identity, mobility state и user plane tunnels связываются между собой?
229. Почему EPC observability сложна без хорошего correlation ID strategy?
230. Какие типичные bottlenecks EPC: CPU, memory, signaling rate, tunnel scale, state churn?
231. Как failover в EPC влияет на in-flight sessions?
232. Какие race conditions возможны между mobility и session procedures?
233. Как перегрузка MME может внешне выглядеть как random attach failure?
234. Как перегрузка SGW/PGW может внешне выглядеть как throughput/jitter problem?
235. Какие тесты используют для проверки scale EPC?
236. Как EPC debugging напоминает debugging distributed microservice systems?
237. Какие метрики EPC нужно обязательно собирать для production?
238. Как проектировать load tests для EPC-like systems?
239. Какие требования к latency и determinism есть у control-plane EPC components?
240. Что из EPC наиболее важно для C/C++ engineer, пишущего сетевой core software?

### Инженерные вопросы
241. Почему EPC нельзя рассматривать только как набор “телеком коробок”?
242. Какие аналогии между EPC и современными distributed network platforms наиболее полезны?
243. Почему при troubleshooting LTE важно быстро отделять radio issue от EPC issue?
244. Какие EPC темы часто всплывают на интервью для network/telecom engineer?
245. Что нужно понять про EPC до изучения MME, SGW и PGW отдельно?

---

## 4. MME

### Базовый уровень
246. Что такое MME?
247. Какова роль MME в LTE?
248. Почему MME относится к control plane?
249. Пересылает ли MME пользовательский трафик?
250. За какие процедуры отвечает MME?
251. Как MME участвует в attach?
252. Как MME участвует в аутентификации?
253. Как MME участвует в mobility management?
254. Как MME связан с NAS signaling?
255. С какими основными узлами взаимодействует MME?
256. Почему отказ MME критичен для абонентов?
257. Что такое UE context в MME?
258. Как MME связан с bearer establishment?
259. Почему MME важен для idle/connected state management?
260. Какие KPI обычно ассоциированы с MME?

### Средний уровень
261. Как MME взаимодействует с eNodeB по S1-MME?
262. Как MME взаимодействует с HSS?
263. Как MME взаимодействует с SGW/PGW?
264. Как MME участвует в tracking area updates?
265. Что такое tracking area?
266. Зачем нужна tracking area?
267. Как MME участвует в paging?
268. Почему paging связан именно с mobility state?
269. Что такое detach procedure и как MME в ней участвует?
270. Как MME выбирает SGW/PGW на концептуальном уровне?
271. Почему MME — stateful control node?
272. Какие типы перегрузки особенно опасны для MME?
273. Почему attach storm опасен для MME?
274. Почему массовая re-attach активность после outage может перегрузить MME?
275. Как MME failure проявляется для пользователя?
276. Какие ошибки приводят к attach reject?
277. Как MME участвует в handover control?
278. Как S1 handover затрагивает MME?
279. Как X2 handover может минимизировать involvement MME?
280. Какие логи MME наиболее важны при анализе attach failure?
281. Какие state transitions MME нужно понимать?
282. Чем MME похож на signaling control service в distributed systems?
283. Как software design MME должен учитывать большое количество состояний UE?
284. Почему таймеры и retransmissions важны для MME procedures?
285. Что должен понимать C/C++ разработчик про внутреннюю state machine MME?

### Продвинутый уровень
286. Как attach message flow обрабатывается MME по шагам?
287. Как NAS messages маршрутизируются и обрабатываются в MME?
288. Как MME correlates subscriber identity, security state и bearer context?
289. Какие timer-driven state transitions наиболее важны в MME?
290. Какие гонки возникают между detach, paging, TAU и handover?
291. Почему idempotency важна в обработке control-plane сообщений MME?
292. Как retries и duplicate signaling messages должны обрабатываться в MME?
293. Как MME scale ограничивается CPU, memory, session state или signaling I/O?
294. Как шардировать или распределять нагрузку MME-like control service?
295. Какие проблемы thread safety и concurrency типичны для MME software?
296. Как tracing одного subscriber through MME works in practice?
297. Как overload protection реализуется в MME?
298. Какие backpressure strategies полезны для MME?
299. Как MME failover влияет на active UE contexts?
300. Как тестировать MME на resilience к signaling storms?
301. Какие metrics/alerts нужны для production-grade MME?
302. Какие ошибки конфигурации чаще всего ломают MME procedures?
303. Как distinguish between MME bug and upstream/downstream integration issue?
304. Какие design patterns полезны при реализации MME в C/C++?
305. Какие темы MME чаще всего обсуждают на senior telecom software interview?

### Инженерные вопросы
306. Почему MME — это хороший пример сложной stateful control-plane системы?
307. Какие инженерные уроки из MME полезны вне телекома?
308. Почему control-plane reliability часто важнее raw throughput для MME?
309. Какие части MME должны быть поняты глубоко разработчиком telecom software?
310. Какие анти-паттерны опасны при проектировании MME-like services?

---

## 5. SGW

### Базовый уровень
311. Что такое SGW?
312. Какова роль SGW в EPC?
313. Относится ли SGW к user plane?
314. Как SGW связан с eNodeB?
315. Как SGW связан с PGW?
316. Почему SGW участвует в forwarding пользовательского трафика?
317. Что такое mobility anchor в контексте SGW?
318. Почему SGW важен при handover?
319. Какие туннели обычно завершаются на SGW?
320. Участвует ли SGW в control signaling?
321. Как SGW связан с bearer path?
322. Какие KPI важны для SGW?
323. Как SGW влияет на latency?
324. Как SGW влияет на throughput?
325. Что происходит при отказе SGW?

### Средний уровень
326. Как SGW участвует в создании S1-U туннеля?
327. Как SGW участвует в handover между eNodeB?
328. Почему SGW может сохранять data-plane continuity во время mobility?
329. Как SGW взаимодействует с MME при bearer setup?
330. Как SGW взаимодействует с PGW в user plane?
331. Почему throughput bottleneck в SGW особенно болезнен?
332. Чем SGW отличается от обычного IP router?
333. Как tunneling overhead влияет на SGW performance?
334. Как SGW обрабатывает uplink и downlink traffic?
335. Как buffering downlink data связано с mobility/idle state?
336. Что происходит с данными при временном отсутствии UE?
337. Как SGW участвует в paging-related data buffering?
338. Какие counters и логи SGW полезны при troubleshooting?
339. Как packet loss в SGW отличить от radio packet loss?
340. Как SGW issues проявляются для TCP/UDP flows?
341. Как перегрузка SGW может повышать jitter?
342. Как SGW связан с lawful intercept/charging paths на концептуальном уровне?
343. Какие проблемы state management возможны в SGW?
344. Как SGW масштабируется горизонтально или вертикально?
345. Что важно понимать software engineer про SGW data path?

### Продвинутый уровень
346. Как uplink packet проходит через SGW по шагам?
347. Как downlink packet проходит через SGW по шагам?
348. Как SGW хранит bearer/tunnel state?
349. Как SGW переключает user plane path во время mobility?
350. Как packet forwarding в SGW сочетается с control-driven state changes?
351. Какие race conditions возникают при handover и concurrent packet forwarding?
352. Как buffering и reordering handled in SGW-like systems?
353. Как SGW design зависит от packet rate, session scale и tunnel scale?
354. Какие dataplane optimization techniques важны для SGW implementation?
355. Как DPDK/user-space packet processing может быть полезен для SGW-like nodes?
356. Какие сложности observability возникают в high-throughput tunneled dataplane?
357. Как pinpoint packet drops inside SGW?
358. Как distinguish SGW overload from PGW/backhaul/radio bottleneck?
359. Как SGW failover влияет на active sessions и packet continuity?
360. Какие metrics нужно собирать на SGW уровне: packets, drops, tunnel count, latency, buffering?
361. Как тестировать SGW under mobility-heavy load?
362. Какие memory management проблемы опасны для SGW C/C++ code?
363. Какие lock/contention проблемы типичны для high-rate SGW software?
364. Какие design trade-offs между feature richness и fast path performance у SGW?
365. Какие SGW темы самые важные для interview telecom dataplane engineer?

### Инженерные вопросы
366. Почему SGW ближе по духу к high-performance packet processing node, чем к классическому control server?
367. Какие dataplane engineering знания особенно полезны для понимания SGW?
368. Почему SGW troubleshooting требует одновременно telecom и IP networking мышления?
369. Что должен глубоко понимать C/C++ engineer, если он работает с SGW-like software?
370. Какие anti-patterns наиболее опасны в дизайне SGW dataplane?

---

## 6. PGW

### Базовый уровень
371. Что такое PGW?
372. Какова роль PGW в EPC?
373. Почему PGW считается шлюзом во внешние packet data networks?
374. Как PGW связан с интернетом?
375. Как PGW связан с SGW?
376. Почему PGW важен для IP connectivity пользователя?
377. Кто обычно назначает IP-адрес UE в LTE data session?
378. Как PGW связан с policy enforcement?
379. Как PGW связан с charging?
380. Почему PGW относится в основном к user plane, но участвует и в policy-related logic?
381. Как отказ PGW влияет на пользователя?
382. Какие KPI ассоциированы с PGW?
383. Как PGW влияет на latency?
384. Как PGW влияет на internet reachability?
385. Какие функции PGW отличают его от SGW?

### Средний уровень
386. Как PGW участвует в выделении PDN connectivity?
387. Как PGW связан с APN?
388. Что такое APN в LTE?
389. Почему APN важен для выбора PDN/service context?
390. Как PGW применяет policy and charging rules?
391. Как PGW обеспечивает NAT, firewalling или service chaining на концептуальном уровне?
392. Как PGW связан с subscriber-specific service profile?
393. Почему PGW — важная точка для QoS enforcement?
394. Как PGW участвует в bearer management?
395. Как PGW влияет на uplink/downlink data path?
396. Как проблемы в PGW могут выглядеть как general internet issue?
397. Как distinguish between PGW issue and external network issue?
398. Какие counters и логи PGW важны для troubleshooting?
399. Как PGW влияет на TCP/UDP applications?
400. Как packet filtering/policy на PGW может вызывать selective connectivity issues?
401. Какие bottlenecks типичны для PGW: throughput, session scale, NAT state, policy lookup?
402. Как PGW участвует в roaming scenarios?
403. Как PGW связан с charging data records?
404. Что должен понимать software engineer про PGW как edge service gateway?
405. Какие функции PGW похожи на функции cloud edge gateways или service gateways?

### Продвинутый уровень
406. Как PGW assigns UE IP and maintains session context?
407. Как policy enforcement materializes in actual packet handling inside PGW?
408. Как deep packet awareness, charging и QoS mapping влияют на PGW complexity?
409. Какие fast path / slow path разделения полезны для PGW software?
410. Как implement scalable subscriber session table for PGW-like systems?
411. Как per-subscriber policy lookup влияет на dataplane performance?
412. Как NAT inside PGW масштабируется?
413. Как observability строится в PGW при mix of session state, policy state and packet forwarding?
414. Как distinguish packet drops due to policy from congestion or transport issues?
415. Как PGW failover impacts subscriber sessions?
416. Какие performance optimizations важны для PGW C/C++ implementation?
417. Как memory locality и cache efficiency влияют на PGW packet processing?
418. Какие concurrency problems typical for PGW stateful dataplane?
419. Как trace one subscriber’s packets and policy decisions through PGW?
420. Как test PGW for scale, policy correctness and failure handling?
421. Какие interfaces/integrations чаще всего делают PGW operationally complex?
422. Как PGW-like functionality эволюционировала в 5G user plane concepts?
423. Какие темы PGW обычно спрашивают на interview high-performance networking engineer?
424. Что должен особенно хорошо понимать разработчик, если работает с PGW-like code?
425. Какие design mistakes опасны при реализации PGW?

### Инженерные вопросы
426. Почему PGW — это сочетание packet gateway, policy engine и subscriber-aware stateful system?
427. Какие архитектурные аналогии между PGW и современными cloud gateways наиболее полезны?
428. Почему PGW troubleshooting требует видеть и subscriber state, и packet path?
429. Какие знания из классического networking напрямую применимы к PGW, а какие — специфичны для LTE?
430. Что нужно понимать про PGW до изучения QoS и bearer management?

---

## 7. Control plane vs User plane

### Базовый уровень
431. Что такое control plane в LTE?
432. Что такое user plane в LTE?
433. Чем control plane отличается от user plane?
434. Какие данные передаются по control plane?
435. Какие данные передаются по user plane?
436. Почему разделение plane важно?
437. Какие узлы EPC mainly control-plane?
438. Какие узлы EPC mainly user-plane?
439. Почему MME не форвардит user traffic?
440. Почему SGW/PGW форвардят user traffic?
441. Как control plane участвует в attach?
442. Как user plane начинает работать после attach?
443. Как control plane участвует в mobility?
444. Как user plane участвует в data delivery?
445. Какие метрики различают проблемы control plane и user plane?

### Средний уровень
446. Почему control plane load и user plane throughput масштабируются по-разному?
447. Почему сеть может иметь рабочий control plane, но плохой user plane?
448. Почему сеть может иметь хороший user plane for existing sessions, но новые attach failing?
449. Как signaling storms влияют на control plane?
450. Как data traffic peaks влияют на user plane?
451. Какие процедуры в LTE чисто control-plane, а какие смешанные?
452. Как bearers связывают control decisions и user forwarding?
453. Как control-plane messages создают state для user-plane path?
454. Как outages проявляются по-разному в этих planes?
455. Как debugging control plane отличается от debugging user plane?
456. Какие инструменты/логи используются для control plane analysis?
457. Какие tools/counters используются для user plane analysis?
458. Как packet captures различаются для S1-MME и S1-U?
459. Почему latency проблем user plane не всегда означает control plane issue?
460. Почему attach success rate не гарантирует good throughput?
461. Как перегрузка MME и перегрузка SGW проявляются по-разному?
462. Как failures during handover могут затрагивать control и user planes differently?
463. Как software architecture обычно разделяет control и data processing?
464. Какие C/C++ design patterns полезны отдельно для control-plane code и data-plane code?
465. Что должен понимать engineer про границу между control и user plane?

### Продвинутый уровень
466. Как control-plane state machines drive creation/modification/release of user-plane tunnels?
467. Как data plane continues while some control updates are in-flight?
468. Какие race conditions между control updates и packet forwarding опасны?
469. Как обеспечить consistency между control plane state и dataplane tables?
470. Что лучше: synchronous or eventually consistent propagation of state to dataplane?
471. Как failover control-plane nodes affects established user plane?
472. Как telemetry for control plane and user plane should be correlated?
473. Как packet-processing pipelines строятся отдельно от signaling-processing pipelines?
474. Как backpressure differently manifests in control-plane services and dataplane services?
475. Какие performance requirements fundamentally differ between control plane and user plane?
476. Почему control plane часто более stateful и transaction-heavy?
477. Почему user plane более throughput/latency sensitive?
478. Как test methodology должна отличаться для control-plane и user-plane components?
479. Как security considerations differ for control and user planes?
480. Как observability gaps между planes приводят к ложным выводам during incident analysis?
481. Какие примеры bugs affect control plane only, user plane only, or both?
482. Как correlate subscriber incident across NAS logs, bearer state and packet drops?
483. Какие interview вопросы чаще всего проверяют понимание separation of planes?
484. Почему понимание control vs user plane полезно даже вне LTE, например в SDN/cloud networking?
485. Какие архитектурные уроки из LTE plane separation наиболее универсальны?

### Инженерные вопросы
486. Почему разделение control plane и user plane — один из главных архитектурных принципов LTE?
487. Какие преимущества и сложности создаёт такое разделение?
488. Как plane separation влияет на scalability, troubleshooting и software design?
489. Что особенно важно знать про control/user plane C/C++ инженеру?
490. Как использовать этот концепт для объяснения LTE архитектуры на интервью?

---

## 8. RRC (Radio Resource Control)

### Базовый уровень
491. Что такое RRC?
492. Где в LTE находится RRC?
493. Какие основные задачи RRC?
494. Почему RRC относится к control plane?
495. Что такое RRC connection?
496. Зачем UE устанавливает RRC connection?
497. Какие основные состояния RRC нужно знать в LTE?
498. Что такое RRC Idle?
499. Что такое RRC Connected?
500. Чем Idle отличается от Connected?
501. Что такое RRC setup?
502. Что такое RRC release?
503. Почему RRC важен для mobility?
504. Почему RRC важен для measurements?
505. Почему RRC важен для bearer setup?

### Средний уровень
506. Какие процедуры выполняются по RRC при подключении UE?
507. Как RRC связан с NAS signaling?
508. Почему NAS часто переносится через RRC/AS?
509. Какие radio bearers конфигурируются через RRC?
510. Как RRC управляет measurement reporting?
511. Как RRC участвует в handover preparation?
512. Как RRC участвует в security activation?
513. Как RRC влияет на battery life UE?
514. Почему idle/connected transitions важны для power efficiency?
515. Как paging связан с RRC Idle?
516. Как service request связан с переходом в Connected?
517. Как measurement gaps и reports используются в RRC?
518. Почему частые RRC transitions могут быть проблемой?
519. Что такое signaling load из-за RRC?
520. Как RRC misconfiguration может ухудшать user experience?
521. Какие counters и KPI важны для RRC analysis?
522. Какие типовые причины RRC setup failure?
523. Как RRC problems manifest as attach or data issues?
524. Как RRC влияет на handover success?
525. Что должен понимать software engineer про RRC state machine?

### Продвинутый уровень
526. Как RRC coordinates radio bearer configuration, security, mobility and measurements?
527. Как state machine RRC реализуется внутри eNodeB software?
528. Какие timers и retransmission logic критичны для RRC?
529. Какие race conditions возможны между measurement report, handover decision и release?
530. Как RRC inactivity timers влияют на signaling load и latency?
531. Какие компромиссы между battery efficiency и responsiveness закладываются через RRC?
532. Как RRC events коррелируют с QoS and scheduling behavior?
533. Как poor RRC tuning increases control-plane load across network?
534. Как trace RRC issue through radio logs and core logs?
535. Какие message parsing/state handling ошибки типичны для RRC implementations?
536. Почему robust state machine design критичен для RRC software?
537. Как unit/integration/system tests строятся для RRC procedures?
538. Как моделировать abnormal UE behavior для тестов RRC?
539. Какие concurrency hazards есть в RRC handling on eNodeB?
540. Как observability для RRC должна быть спроектирована?
541. Какие метрики указывают на RRC storm or inefficient state management?
542. Как RRC behavior косвенно влияет на TCP session experience?
543. Какие interview темы по RRC особенно важны для telecom software engineer?
544. Что нужно понимать глубже всего в RRC: states, procedures, timers или measurements?
545. Какие anti-patterns опасны при реализации RRC-related software?

### Инженерные вопросы
546. Почему RRC — одна из центральных control-plane тем в LTE?
547. Как RRC связывает radio management, mobility и signalling efficiency?
548. Почему проблемы RRC могут выглядеть как “общие сетевые проблемы”?
549. Что должен понимать C/C++ engineer про RRC даже без углубления в PHY?
550. Как лучше объяснять RRC на интервью: через состояния, процедуры или practical symptoms?

---

## 9. MAC layer scheduling

### Базовый уровень
551. Что такое MAC layer в LTE?
552. Какова роль MAC в radio stack LTE?
553. Что такое scheduling в LTE?
554. Почему scheduler нужен в беспроводной системе?
555. Кто принимает решение о выделении radio resources?
556. Что именно распределяет scheduler?
557. Почему radio resources ограничены?
558. Что такое uplink scheduling?
559. Что такое downlink scheduling?
560. Почему scheduler должен учитывать качество канала?
561. Почему scheduler должен учитывать QoS?
562. Почему scheduler должен учитывать fairness?
563. Как scheduling влияет на throughput?
564. Как scheduling влияет на latency?
565. Как scheduling влияет на cell capacity?

### Средний уровень
566. Какие факторы учитывает LTE scheduler?
567. Как scheduler использует CQI/качество канала?
568. Почему “лучший канал” не всегда должен получать все ресурсы?
569. Что такое proportional fair scheduling на концептуальном уровне?
570. Чем round-robin отличается от channel-aware scheduling?
571. Какие trade-offs между fairness и total throughput?
572. Как scheduler учитывает delay-sensitive traffic?
573. Как scheduler учитывает GBR vs non-GBR traffic?
574. Как scheduler взаимодействует с HARQ?
575. Почему retransmissions имеют приоритетные последствия для scheduling?
576. Как buffer occupancy влияет на scheduling?
577. Что такое uplink grant?
578. Почему uplink требует координации ресурсов?
579. Как scheduler влияет на jitter real-time traffic?
580. Как scheduler влияет на packet delay budget?
581. Как congestion в cell проявляется через scheduler decisions?
582. Как плохой radio quality у части пользователей влияет на общую эффективность cell?
583. Почему scheduler важен для QoS enforcement?
584. Какие KPI помогают оценивать качество scheduling?
585. Что должен понимать software engineer про scheduler logic?

### Продвинутый уровень
586. Как scheduler balances CQI, QoS class, HARQ state, buffer status and fairness?
587. Какие эвристики обычно лежат в основе LTE scheduler?
588. Почему scheduling — это near-real-time optimization problem?
589. Какие hard timing constraints есть у MAC scheduler?
590. Как scheduler decisions impact TCP throughput and latency distribution?
591. Как scheduler can unintentionally starve edge users or low-priority flows?
592. Как cell-edge users влияют на spectral efficiency cell-wide?
593. Как semi-persistent scheduling conceptually helps for real-time traffic?
594. Как link adaptation tightly coupled with scheduling?
595. Какие race/timing bugs опасны в scheduler implementation?
596. Как multi-core software architecture влияет на scheduler determinism?
597. Какие data structures полезны для fast scheduling decisions?
598. Как test correctness and performance of MAC scheduler?
599. Какие synthetic traffic profiles нужны для scheduler testing?
600. Как measure scheduler fairness vs QoS compliance?
601. Как diagnose poor user throughput: scheduler issue or radio issue?
602. Как diagnose latency spikes caused by scheduling?
603. Как observability for scheduler should be designed?
604. Какие counters per-UE/per-QCI/per-cell наиболее полезны?
605. Какие interview вопросы чаще всего проверяют реальное понимание MAC scheduling?

### Инженерные вопросы
606. Почему scheduler — одно из главных “сердец” eNodeB?
607. Какие компромиссы scheduler решает каждую миллисекунду?
608. Почему scheduling напрямую влияет на восприятие сети пользователем?
609. Что должен хорошо понимать C/C++ инженер про scheduler, даже без углубления в PHY?
610. Как лучше объяснить MAC scheduling на интервью через fairness, QoS и throughput trade-offs?

---

## 10. Handover: базовые концепции

### Базовый уровень
611. Что такое handover в LTE?
612. Зачем нужен handover?
613. Когда handover происходит?
614. Почему mobility требует handover?
615. Что произойдёт без handover при движении UE?
616. Какие основные типы handover есть в LTE на высоком уровне?
617. Что такое intra-LTE handover?
618. Что такое inter-frequency handover?
619. Что такое intra-frequency handover?
620. Что такое inter-RAT handover?
621. Чем X2 handover отличается от S1 handover?
622. Почему handover важен для непрерывности сервиса?
623. Как handover влияет на голос/видео/данные?
624. Какие KPI связаны с handover?
625. Что такое handover success rate?

### Средний уровень
626. Какие события/метрики запускают handover decision?
627. Как measurement reports от UE участвуют в handover?
628. Почему handover обычно network-controlled?
629. Что такое handover preparation?
630. Что такое handover execution?
631. Что такое handover completion?
632. Чем X2 handover обычно быстрее S1 handover?
633. Почему X2 handover уменьшает нагрузку на core?
634. Когда приходится использовать S1 handover?
635. Как handover влияет на user plane path?
636. Как handover влияет на control plane state?
637. Что такое handover interruption time?
638. Почему низкое interruption time важно?
639. Что такое too early handover?
640. Что такое too late handover?
641. Что такое ping-pong handover?
642. Почему ping-pong handovers вредны?
643. Как hysteresis и time-to-trigger помогают?
644. Как плохая настройка thresholds ухудшает mobility?
645. Как handover проблемы проявляются для TCP и UDP приложений?
646. Какие причины handover failure наиболее типичны?
647. Как radio conditions влияют на handover success?
648. Как load balancing мотивирует handover кроме radio quality?
649. Какие counters полезны для handover troubleshooting?
650. Что должен понимать software engineer про basic handover flow?

### Продвинутый уровень
651. Как X2 handover message flow выглядит на high level?
652. Как S1 handover message flow выглядит на high level?
653. Как user-plane forwarding/packet buffering handled during handover?
654. Какие state transitions проходят в source eNodeB, target eNodeB, MME, SGW?
655. Какие race conditions опасны during handover?
656. Как in-flight packets могут теряться или переупорядочиваться во время handover?
657. Как handover affects TCP cwnd, RTT and retransmissions?
658. Как handover affects UDP jitter and packet loss?
659. Как distinguish radio handover issue from core path switch issue?
660. Какие таймеры критичны для handover procedures?
661. Как measurement configuration влияет на handover stability?
662. Как mobility robustness optimization conceptually works?
663. Как test handover scenarios in lab?
664. Какие synthetic mobility profiles useful for testing?
665. Как observability for handover should correlate RRC, X2/S1, GTP and QoS metrics?
666. Какие software bugs типичны в handover implementations?
667. Как concurrency and state consistency problems show up under high mobility?
668. Какие interview вопросы обычно проверяют реальное понимание handover beyond buzzwords?
669. Какие части handover нужно понимать глубже всего для telecom software?
670. Какие anti-patterns опасны при handover troubleshooting?

### Инженерные вопросы
671. Почему handover — одна из самых сложных процедур LTE?
672. Почему handover нельзя анализировать только как radio event?
673. Как handover объединяет radio measurements, control-plane state и user-plane continuity?
674. Что должен понимать C/C++ engineer о handover, если он работает с eNodeB/EPC software?
675. Какие practical handover темы особенно важны на interview?

---

## 11. Handover: типы и сценарии

### Базовый уровень
676. Какие типы handover обычно выделяют в LTE?
677. Что такое intra-cell vs inter-cell mobility на концептуальном уровне?
678. Что такое intra-eNodeB handover?
679. Что такое inter-eNodeB handover?
680. Что такое intra-frequency handover?
681. Что такое inter-frequency handover?
682. Что такое inter-RAT handover из LTE в 3G/2G?
683. Когда inter-frequency handover может быть нужен?
684. Когда inter-RAT handover может быть нужен?
685. Чем mobility for coverage отличается от mobility for load balancing?

### Средний уровень
686. В каких сценариях предпочтителен X2 handover?
687. В каких сценариях нужен S1 handover?
688. Чем handover в пределах одного MME/SGW отличается от более сложных mobility scenarios?
689. Когда handover затрагивает path switch?
690. Когда handover может затрагивать SGW relocation?
691. Почему inter-frequency handover сложнее measurement-wise?
692. Почему inter-RAT handover operationally более сложен?
693. Как coverage holes влияют на handover performance?
694. Как high-speed mobility влияет на типичные handover failures?
695. Почему highway/train scenarios особенно трудны?
696. Как dense urban deployment влияет на handover tuning?
697. Почему small cells создают больше handover events?
698. Как load-based handover может конфликтовать с radio-quality-based handover?
699. Как VoLTE or real-time traffic ужесточает требования к handover?
700. Какие сценарии handover чаще всего вызывают packet loss bursts?
701. Какие сценарии чаще вызывают ping-pong?
702. Какие сценарии handover hardest to reproduce in lab?
703. Как roaming scenarios усложняют mobility path?
704. Какие counters useful specifically per handover type?
705. Что должен понимать engineer про сценарную классификацию handover?

### Продвинутый уровень
706. Как tuning differs for macro-only, macro+small-cell, indoor and high-speed mobility scenarios?
707. Как event thresholds/hysteresis/time-to-trigger should adapt to scenario type?
708. Как per-scenario mobility optimization affects throughput vs stability?
709. Какие design trade-offs between aggressive and conservative handover policies?
710. Как different handover scenarios affect EPC signaling load?
711. Как scenario-specific failures surface in app-level telemetry?
712. Как reproduce inter-frequency/inter-RAT handovers in test automation?
713. Как build trace analysis framework that classifies handover failures by scenario?
714. Какие log dimensions нужны для scenario-aware handover RCA?
715. Какие interview вопросы проверяют понимание сценариев, а не только определения handover types?

### Инженерные вопросы
716. Почему handover нужно изучать не только по типам, но и по practical deployment scenarios?
717. Какие сценарии handover наиболее важны для production troubleshooting?
718. Что особенно полезно знать разработчику ПО про сценарии handover?
719. Какие deployment assumptions чаще всего ломают “идеальную” handover логику?
720. Как объяснить handover scenarios на интервью через практические кейсы?

---

## 12. QoS в LTE

### Базовый уровень
721. Что такое QoS в LTE?
722. Зачем LTE нужна QoS model?
723. Почему не весь трафик можно обслуживать одинаково?
724. Что такое bearer-level QoS?
725. Что такое QCI?
726. Что такое ARP (Allocation and Retention Priority) в контексте QoS, не путая с Address Resolution Protocol?
727. Что такое GBR bearer?
728. Что такое non-GBR bearer?
729. Чем GBR отличается от non-GBR?
730. Почему voice/video/data могут требовать разный QoS?
731. Как QoS связана с default и dedicated bearers?
732. Где в LTE применяется QoS policy?
733. Какие узлы участвуют в обеспечении QoS?
734. Почему QoS влияет на scheduling?
735. Какие KPI полезны для оценки QoS?

### Средний уровень
736. Как QCI отражает delay/loss priority profile traffic?
737. Почему QCI влияет на scheduler treatment?
738. Как ARP используется при admission control?
739. Почему QoS не означает гарантированную идеальную скорость всегда?
740. Как congestion влияет на фактическое соблюдение QoS?
741. Как default bearer обслуживает generic traffic?
742. Зачем нужен dedicated bearer?
743. Как LTE differentiates real-time and best-effort traffic?
744. Как QoS rules превращаются в practical packet handling?
745. Как PGW/SGW/eNodeB совместно обеспечивают QoS?
746. Как scheduler учитывает GBR flows?
747. Как buffer management связан с QoS?
748. Как packet delay budget conceptually связан с real-time traffic?
749. Как packet loss tolerance differs across QCI classes?
750. Как QoS misconfiguration проявляется для приложений?
751. Почему QoS issue может выглядеть как random latency or jitter problem?
752. Как transport-layer метрики отражают плохой QoS enforcement?
753. Какие counters/logs помогут понять, что проблема именно в QoS policy?
754. Как admission control влияет на user experience under load?
755. Что должен понимать software engineer про LTE QoS mapping?

### Продвинутый уровень
756. Как bearer QoS parameters propagate from control-plane policy decisions to scheduler behavior?
757. Как dedicated bearer setup changes packet treatment end to end?
758. Как QoS state represented across MME, SGW, PGW and eNodeB?
759. Какие race/configuration consistency problems possible in QoS enforcement?
760. Как per-bearer QoS interacts with radio resource scarcity?
761. Как fairness and priority trade-offs manifest under congestion?
762. Как diagnose whether packet delay caused by radio scheduling, backhaul, SGW/PGW congestion or QoS policy?
763. Как build observability that ties subscriber QoS profile to actual transport metrics?
764. Какие software/data-model patterns useful for representing QoS policy in telecom systems?
765. Как test QoS correctness under mixed traffic loads?
766. Как simulate GBR/non-GBR traffic mixes in lab?
767. Какие anti-patterns common when teams treat QoS as static config rather than dynamic end-to-end behavior?
768. Как LTE QoS concepts map to more general networking ideas: priority queues, shaping, admission control?
769. Какие interview questions по QoS проверяют понимание end-to-end implications, а не только терминов?
770. Что нужно понимать глубже всего в QoS: QCI, bearers, scheduler or policy path?

### Инженерные вопросы
771. Почему QoS в LTE — это не только “приоритеты”, а end-to-end система?
772. Какие части QoS наиболее важны для network/software engineer?
773. Почему плохая QoS настройка может выглядеть как radio, core или application problem?
774. Как объяснить QoS в LTE на интервью через GBR/non-GBR, scheduler и bearers?
775. Какие знания про QoS особенно полезны перед изучением 5G QoS model?

---

## 13. Сквозные вопросы по LTE

### Архитектура и процедуры
776. Как attach, bearer setup, RRC setup и user-plane establishment связаны между собой?
777. Где заканчивается radio проблема и начинается core проблема в LTE?
778. Как eNodeB, MME, SGW и PGW совместно обеспечивают data session?
779. Почему understanding interfaces важнее простого заучивания узлов?
780. Как control-plane перегрузка проявится иначе, чем user-plane деградация?

### Производительность и QoE
781. Какие LTE метрики наиболее полезно коррелировать с TCP retransmissions?
782. Какие LTE метрики наиболее полезно коррелировать с UDP jitter?
783. Почему хороший RSRP не гарантирует хороший throughput?
784. Как scheduler, QoS и handover together shape user experience?
785. Как определить, что throughput проблема вызвана radio quality, а не core congestion?
786. Как отличить handover packet loss от обычного radio loss?
787. Как RRC reconfiguration может влиять на latency spikes?
788. Почему LTE troubleshooting требует смотреть и radio, и transport, и core metrics?
789. Какие counters per-UE полезны для root-cause analysis?
790. Какие counters per-cell полезны для capacity troubleshooting?

### C/C++ / systems / observability
791. Что должен понимать C/C++ engineer, если он пишет software для eNodeB или EPC?
792. Какие части LTE больше похожи на distributed control system?
793. Какие части LTE больше похожи на high-performance packet processing platform?
794. Какие design patterns полезны для telecom state machines?
795. Какие design patterns полезны для telecom dataplane?
796. Какие таймеры, retries и state transitions особенно опасны для багов?
797. Почему correlation ID и traceability критичны в LTE software?
798. Как тестировать LTE-like procedures в интеграционной среде?
799. Как воспроизводить mobility/QoS/control-plane failures в лаборатории?
800. Какие anti-patterns чаще всего встречаются у software engineers, которые смотрят на LTE только как на “ещё одну IP сеть”?

### Interview-style
801. Почему LTE считается важной базой перед изучением 5G NR?
802. Какие LTE темы обязан знать networking/software engineer глубоко?
803. Какие LTE темы достаточно понимать на уровне инженерной интуиции?
804. Как лучше объяснить architecture of LTE за 2–3 минуты на интервью?
805. Как лучше объяснить difference between MME, SGW and PGW?
806. Как лучше объяснить control plane vs user plane на практическом примере?
807. Как лучше объяснить RRC и scheduler без ухода в PHY детали?
808. Как лучше объяснить handover с точки зрения real user impact?
809. Как лучше объяснить QoS в LTE через bearers и application requirements?
810. Какие вопросы по LTE обычно показывают senior-level понимание, а не заученные определения?