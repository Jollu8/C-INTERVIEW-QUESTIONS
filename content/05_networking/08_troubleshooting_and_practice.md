# Вопросы: Troubleshooting и практика (с уклоном в C/C++, Linux и сетевую инженерию)

## 1. Общий подход к сетевой диагностике

### Базовый уровень
1. Что такое network troubleshooting?
2. Почему сетевые проблемы нельзя диагностировать хаотично?
3. Почему важно идти от простого к сложному?
4. Почему важно сначала определить symptom, а не сразу guessing root cause?
5. Что такое symptom, cause и root cause в сетевой диагностике?
6. Почему “интернет не работает” — слишком широкое описание проблемы?
7. Какие уточняющие вопросы нужно задать при сетевой проблеме?
8. Почему важно понять, проблема постоянная или интермиттирующая?
9. Почему важно знать, затронут один хост, один сервис или вся сеть?
10. Почему важно различать client-side, network-side и server-side проблему?
11. Почему полезно строить troubleshooting по уровням OSI?
12. Почему полезно разделять control-plane и data-plane симптомы?
13. Что такое baseline и почему он важен в диагностике?
14. Почему без baseline трудно понять, “плохо” это или “нормально”?
15. Почему важно смотреть на recent changes перед поиском экзотических причин?
16. Что такое blast radius проблемы?
17. Почему полезно определить scope инцидента как можно раньше?
18. Почему полезно собрать timeline событий?
19. Почему наблюдаемость (observability) важна для troubleshooting?
20. Почему packet capture не всегда нужен первым шагом?

### Средний уровень
21. Как выглядит хороший workflow для диагностики сетевой проблемы?
22. Почему стоит сначала проверить DNS/IP/reachability, а не сразу приложение?
23. Как отличить отсутствие connectivity от ошибки приложения?
24. Почему важно проверять проблему несколькими инструментами?
25. Почему нужно уметь отличать false positive от настоящей проблемы?
26. Что такое reproducibility в troubleshooting?
27. Почему интермиттирующие проблемы самые сложные?
28. Как коррелировать application logs и network symptoms?
29. Почему важно различать local issue и upstream issue?
30. Почему стоит проверять path in both directions?
31. Как asymmetric routing усложняет диагностику?
32. Почему packet loss в одну сторону может выглядеть как странная latency в другую?
33. Почему важно понимать, какой именно протокол используется приложением?
34. Почему TCP и UDP проблемы диагностируются по-разному?
35. Почему некоторые инструменты misleading в presence of ICMP filtering?
36. Что такое “working as designed”, но воспринимается как баг?
37. Почему firewall policy часто выглядит как “сеть сломалась”?
38. Почему NAT может маскировать реальную топологию?
39. Почему overlay/tunnel сети усложняют RCA?
40. Как важно различать network path issue и endpoint resource issue?
41. Почему CPU saturation на сервере может выглядеть как “сеть тормозит”?
42. Почему queueing и buffer pressure могут выглядеть как random loss?
43. Почему change management и troubleshooting тесно связаны?
44. Когда нужно делать packet capture, а когда достаточно counters/logs?
45. Что должен понимать инженер про порядок действий при сетевом инциденте?

### Продвинутый уровень
46. Как строить hypothesis-driven troubleshooting?
47. Как формулировать проверяемые гипотезы для сетевой проблемы?
48. Почему важно исключать целые классы причин, а не проверять всё подряд?
49. Как правильно выбирать vantage points для измерений?
50. Какой минимальный набор данных нужно собрать до эскалации?
51. Почему плохая observability делает любой network RCA почти невозможным?
52. Как строить correlation между host metrics, app metrics и network metrics?
53. Как избежать confirmation bias при troubleshooting?
54. Какие anti-patterns чаще всего встречаются у начинающих инженеров?
55. Почему “ping проходит, значит сеть в порядке” — плохой вывод?
56. Почему “packet loss есть в traceroute, значит там проблема” — не всегда верно?
57. Как отличить capacity issue от transient impairment?
58. Как distinguish application timeout from transport timeout?
59. Какие временные окна нужны для reliable diagnosis intermittent issues?
60. Как проектировать тесты, которые воспроизводят сетевую проблему controlled way?
61. Как netem/tc помогают в практике troubleshooting?
62. Как packet capture и flow telemetry дополняют друг друга?
63. Как строить RCA для проблем, где symptom на L7, а cause на L2/L3/L4?
64. Какие навыки senior engineer отличают хорошую сетевую диагностику от хаотичной?
65. Какие interview вопросы по troubleshooting лучше всего показывают реальный опыт?

### Инженерные вопросы
66. Почему troubleshooting — это не набор команд, а метод мышления?
67. Какие принципы наиболее универсальны для сетевой диагностики?
68. Что должен особенно хорошо уметь software/network engineer при production incident?
69. Как объяснить свой troubleshooting workflow на интервью?
70. Какие темы troubleshooting обязательны для сильного C/C++ network developer?

---

## 2. Инструмент: ping

### Базовый уровень
71. Что делает `ping`?
72. Какой протокол использует `ping`?
73. Что такое ICMP Echo Request?
74. Что такое ICMP Echo Reply?
75. Что показывает `ping` кроме факта reachability?
76. Что такое RTT в выводе ping?
77. Что такое packet loss в выводе ping?
78. Что означает TTL в ответе ping?
79. Почему ping не проверяет “весь интернет”, а только reachability конкретного узла?
80. Почему ping не равен успешному TCP/UDP соединению?
81. Что означает, если ping до IP проходит?
82. Что означает, если ping до hostname не проходит?
83. Почему hostname issue и IP reachability issue нужно различать?
84. Что означает timeout в ping?
85. Что означает `Destination Host Unreachable`?
86. Что означает `Network is unreachable`?
87. Почему ping полезен как первый быстрый тест?
88. Какие ограничения у ping?
89. Почему некоторые хосты не отвечают на ping специально?
90. Почему отсутствие ответа на ping не всегда означает проблему?

### Средний уровень
91. Как интерпретировать jitter по серии ping?
92. Почему min/avg/max RTT полезны для диагностики?
93. Когда высокий RTT в ping указывает на congestion?
94. Когда spikes RTT могут указывать на queueing?
95. Почему occasional packet loss в ping может быть значимым?
96. Когда ICMP rate limiting искажает результаты ping?
97. Почему ping до gateway — полезный отдельный тест?
98. Почему ping loopback, local IP, gateway и remote host дают разные сведения?
99. Как ping помогает отличить local stack problem от upstream problem?
100. Почему важно ping-овать и IP, и hostname?
101. Почему large ping payload может выявлять path MTU issues?
102. Что делает флаг flood ping conceptually?
103. Почему flood ping опасен в production?
104. Как TTL в ping помогает косвенно судить о hops?
105. Почему изменение TTL само по себе редко достаточно для RCA?
106. Что означает packet reordering в серии ping?
107. Как asymmetric path может влиять на RTT interpretation?
108. Почему wireless/cellular networks могут давать variable ping even when “working normally”?
109. Как ping помогает проверить packet loss on path?
110. Почему ICMP может обрабатываться иначе, чем application traffic?
111. Почему ping иногда показывает хуже, чем TCP, а иногда лучше?
112. Как `ping -s` помогает в диагностике fragmentation/MTU?
113. Почему packet size matters in troubleshooting?
114. Какие типовые ошибки в интерпретации ping делают инженеры?
115. Что должен понимать software engineer про границы применимости ping?

### Продвинутый уровень
116. Как ядро обрабатывает ICMP Echo на sender и receiver?
117. Почему ping useful but not definitive for production diagnosis?
118. Как ICMP filtering/firewalling маскирует реальную ситуацию?
119. Как packet capture использовать вместе с ping?
120. Как distinguish loss on request path vs loss on reply path?
121. Как использовать ping для проверки jitter distribution?
122. Как timestamping влияет на точность ping measurements?
123. Как interpret ping under CPU saturation on endpoint?
124. Почему busy userspace or kernel can inflate ping latency?
125. Как ping помогает выявлять microbursts only indirectly?
126. Как use ping from multiple vantage points to isolate fault domain?
127. Какие pitfalls при использовании ping в overlay/VPN/tunnel environments?
128. Как IPv4 ping и IPv6 ping могут давать разную диагностику?
129. Какие C/C++ или raw socket знания полезны для понимания того, как реализован ping?
130. Какие interview вопросы по ping хорошо отделяют практику от формального знания?

### Инженерные вопросы
131. Почему ping — полезный, но опасный для переинтерпретации инструмент?
132. Когда ping должен быть первым шагом, а когда он почти ничего не доказывает?
133. Как объяснить ограничения ping на интервью?
134. Что должен понимать инженер про ICMP, чтобы корректно использовать ping?
135. Какие anti-patterns чаще всего связаны с ping-based troubleshooting?

---

## 3. Инструмент: traceroute

### Базовый уровень
136. Что делает `traceroute`?
137. Как traceroute определяет hops на пути?
138. Почему traceroute использует TTL?
139. Какую роль играют ICMP Time Exceeded сообщения?
140. Почему traceroute показывает последовательность маршрутизаторов?
141. Почему traceroute не всегда показывает все hops?
142. Почему некоторые hops отображаются как `* * *`?
143. Почему traceroute не гарантирует точную картину data path?
144. Чем traceroute полезен при диагностике?
145. Чем traceroute ограничен?
146. Почему разные реализации traceroute используют UDP, ICMP или TCP?
147. Что означает last hop в traceroute?
148. Почему last hop может не отвечать, даже если сервис работает?
149. Почему traceroute часто используют вместе с ping?
150. Что такое path discovery на базовом уровне?

### Средний уровень
151. Как интерпретировать рост latency по hops?
152. Почему высокий RTT на одном hop не всегда означает проблему именно на нём?
153. Почему control plane ответа роутера не равен forwarding plane behavior?
154. Почему ICMP deprioritization искажает traceroute?
155. Как load balancing влияет на результаты traceroute?
156. Что такое per-flow и per-packet load balancing в контексте traceroute?
157. Почему разные прогоны traceroute могут показывать разный путь?
158. Почему asymmetric routing ограничивает usefulness traceroute?
159. Как traceroute помогает определить, где примерно теряется reachability?
160. Почему packet loss на intermediate hop не всегда равен packet loss through that hop?
161. Как TCP traceroute помогает в firewall-restricted environments?
162. Когда UDP traceroute misleading?
163. Когда ICMP traceroute misleading?
164. Как traceroute помогает при подозрении на routing loop?
165. Как traceroute помогает при blackhole issues?
166. Как interpret sudden jump in RTT after several hops?
167. Почему MPLS, tunnels и overlays могут скрывать реальный маршрут?
168. Как VPN/tunneling искажает traceroute?
169. Почему traceroute может не помочь при application-layer проблеме?
170. Какие ошибки чаще всего делают при анализе traceroute?
171. Что должен понимать инженер про useful vs misleading traceroute evidence?

### Продвинутый уровень
172. Как traceroute реализуется на уровне протоколов?
173. Как TTL manipulation приводит к генерации ICMP Time Exceeded?
174. Почему last hop behavior differs between UDP and TCP traceroute?
175. Как Paris traceroute conceptually improves stability результатов?
176. Почему classic traceroute плохо работает при ECMP/load balancing?
177. Как correlate traceroute with routing table and BGP/OSPF data?
178. Как combine traceroute with packet captures for deeper RCA?
179. Как distinguish control-plane ICMP anomalies from real forwarding issues?
180. Какие vantage points нужны, чтобы проверить forward и reverse path?
181. Как interpret traceroute in cloud environments with hidden networking layers?
182. Почему traceroute по IPv6 может вести себя иначе, чем по IPv4?
183. Какие interview вопросы по traceroute хорошо выявляют реальный практический опыт?
184. Какие типовые anti-patterns связаны с “over-trusting” traceroute?
185. Что должен понимать C/C++ инженер про то, как traceroute работает под капотом?

### Инженерные вопросы
186. Почему traceroute — это инструмент интерпретации, а не абсолютной истины?
187. Когда traceroute особенно полезен?
188. Когда traceroute почти бесполезен без дополнительных данных?
189. Как объяснить traceroute на интервью без ухода в лишние детали?
190. Какие ограничения traceroute обязан знать любой network/software engineer?

---

## 4. Инструменты: nslookup / dig

### Базовый уровень
191. Что делает `nslookup`?
192. Что делает `dig`?
193. Чем `dig` обычно полезнее `nslookup`?
194. Что такое DNS query?
195. Что такое A record?
196. Что такое AAAA record?
197. Что такое CNAME?
198. Что такое MX record?
199. Что такое NS record?
200. Что такое PTR record?
201. Что значит “resolve hostname”?
202. Почему DNS нужно проверять отдельно от IP reachability?
203. Что означает, если `ping IP` работает, а `ping hostname` — нет?
204. Какой базовый вопрос отвечает `dig example.com`?
205. Что такое authoritative answer?
206. Что такое TTL в DNS ответе?
207. Что такое NXDOMAIN?
208. Что значит SERVFAIL?
209. Почему DNS failure часто выглядит как “сеть не работает”?
210. Почему `dig` — ключевой инструмент для базовой сетевой диагностики?

### Средний уровень
211. Как проверить, какой DNS server используется?
212. Как запросить конкретный DNS server через `dig`?
213. Чем recursive lookup отличается от iterative trace?
214. Что показывает `dig +trace`?
215. Как определить, проблема в local resolver или upstream authoritative path?
216. Почему stale cache может вводить в заблуждение?
217. Как проверить TTL и cache behavior?
218. Что такое CNAME chain и как она влияет на lookup?
219. Почему long CNAME chains вредны operationally?
220. Как distinguish DNS issue from connectivity issue?
221. Почему IPv4/IPv6 DNS records могут давать разное поведение приложения?
222. Что такое split-horizon DNS?
223. Как split DNS усложняет troubleshooting?
224. Почему internal и external DNS views могут давать разные ответы?
225. Как проверить reverse DNS?
226. Когда reverse DNS важно practically?
227. Как DNSSEC может влиять на troubleshooting?
228. Почему timeout в DNS lookup отличается от NXDOMAIN?
229. Что означает truncated response?
230. Когда DNS использует TCP вместо UDP?
231. Как packet capture помогает при DNS troubleshooting?
232. Какие типовые ошибки интерпретации `dig` встречаются?
233. Что должен понимать software engineer про DNS troubleshooting beyond “nslookup не работает”?

### Продвинутый уровень
234. Как resolver behavior влияет на observed application latency?
235. Как diagnose intermittent DNS failures?
236. Как distinguish packet loss to resolver from resolver overload?
237. Как compare answers from multiple resolvers to detect propagation/split-view issues?
238. Какие метрики useful for DNS troubleshooting: RTT, SERVFAIL rate, NXDOMAIN rate, cache hit ratio?
239. Как application retries can amplify DNS issues?
240. Как TTL choices affect failover and troubleshooting?
241. Какие pitfalls при тестировании DNS через containerized/cloud environments?
242. Как `dig +trace` может помочь и в чём его ограничения?
243. Как DNS over TLS / DNS over HTTPS усложняют observability?
244. Как C/C++ приложение взаимодействует с resolver через `getaddrinfo()` и как это влияет на диагностику?
245. Какие interview вопросы по DNS troubleshooting показывают реальный опыт?
246. Какие anti-patterns опасны при интерпретации DNS результатов?
247. Что должен понимать инженер о negative caching?
248. Как correlate DNS timing with application timeout symptoms?
249. Почему DNS может быть root cause, даже если “сама сеть” в порядке?
250. Как объяснить DNS troubleshooting workflow на интервью?

### Инженерные вопросы
251. Почему `dig` — один из самых мощных простых инструментов в сетевой диагностике?
252. Какие DNS темы особенно важны software engineer?
253. Когда проблема “не открывается сайт” чаще DNS, чем transport?
254. Как отличить DNS outage от upstream service outage?
255. Какие знания о DNS debugging обязательны для network/C++ engineer?

---

## 5. Анализ проблем: нет connectivity

### Базовый уровень
256. Что означает “нет connectivity”?
257. Почему важно уточнить: нет connectivity до чего именно?
258. Как отличить “не открывается сайт” от “нет IP reachability”?
259. С чего начать диагностику отсутствия connectivity?
260. Почему стоит проверить local interface up/down state?
261. Почему стоит проверить IP address на интерфейсе?
262. Почему default gateway — один из первых checkpoints?
263. Почему DNS нужно проверять отдельно?
264. Почему firewall/local policy могут полностью имитировать отсутствие сети?
265. Как проверить loopback, local IP, gateway, remote IP и hostname по очереди?
266. Почему этот порядок полезен?
267. Что означает, если loopback работает, а gateway — нет?
268. Что означает, если gateway reachable, а internet IP — нет?
269. Что означает, если remote IP reachable, а hostname — нет?
270. Почему ARP/NDP нужно учитывать в локальной проблеме?

### Средний уровень
271. Какой чеклист полезен при отсутствии connectivity на Linux-хосте?
272. Как routing table влияет на отсутствие connectivity?
273. Что означает отсутствие default route?
274. Что означает wrong subnet mask/prefix?
275. Как duplicate IP address может ломать connectivity?
276. Как DHCP failure проявляется как no connectivity?
277. Как stale ARP entry может ломать доступ?
278. Как MTU black hole может выглядеть как partial connectivity?
279. Почему small pings pass, but larger traffic fails?
280. Как NAT/firewall может ломать только часть направлений?
281. Почему service can be reachable locally but not remotely?
282. Как ACL/filtering отличить от routing issue?
283. Как packet capture помогает при полном отсутствии connectivity?
284. Какие counters интерфейса важны при no-connectivity incident?
285. Как distinguish physical/link issue from IP/routing issue?
286. Как distinguish server down from network unreachable?
287. Как container/netns/VM overlay environments усложняют диагностику?
288. Почему IPv6 can fail while IPv4 works, and vice versa?
289. Как application-specific port blocking looks compared to full no-connectivity?
290. Какие ошибки инженеры чаще всего пропускают в basic connectivity RCA?

### Продвинутый уровень
291. Как построить hypothesis tree для no-connectivity problem?
292. Как isolate fault domain between host, access network, upstream router and destination?
293. Как use packet capture on both ends to see where packets disappear?
294. Как infer directionality of failure from SYN, ICMP and ARP/NDP evidence?
295. Как overlay/tunnel misconfiguration manifests as no connectivity?
296. Как asymmetric policy routing complicates no-connectivity analysis?
297. Как cloud security groups / NACLs / host firewall differ symptomatically?
298. Как app connect timeout, ICMP unreachable and TCP RST help narrow root cause?
299. Как C/C++ приложение видит no-connectivity через errno and socket behavior?
300. Что значат `ENETUNREACH`, `EHOSTUNREACH`, `ETIMEDOUT`, `ECONNREFUSED` practically?
301. Как distinguish path MTU blackhole from server slowness?
302. Какие telemetry and logs must be collected for solid RCA?
303. Как reproduce no-connectivity failure safely in test environment?
304. Какие interview вопросы по no-connectivity diagnosis действительно показывают опыт?
305. Какие anti-patterns чаще всего ломают качественный RCA?

### Инженерные вопросы
306. Почему отсутствие connectivity — не одна проблема, а целый класс причин?
307. Какие проверки должны выполняться автоматически в голове инженера?
308. Как объяснить no-connectivity troubleshooting на интервью?
309. Что должен особенно хорошо уметь C/C++ network developer при such incidents?
310. Какие темы no-connectivity обязательно знать глубоко?

---

## 6. Анализ проблем: высокая задержка

### Базовый уровень
311. Что такое высокая задержка в сетевом контексте?
312. Чем latency отличается от slowness в общем смысле?
313. Почему высокая latency не всегда означает packet loss?
314. Почему высокая latency может быть и network, и server, и application проблемой?
315. Как ping помогает заметить high latency?
316. Почему average latency недостаточна без max/p95/p99?
317. Что такое latency spike?
318. Почему intermittent latency особенно сложна?
319. Как queueing влияет на задержку?
320. Почему distance/propagation delay не единственная причина latency?
321. Почему congestion повышает latency?
322. Почему bufferbloat повышает latency?
323. Как retransmissions повышают observed latency?
324. Почему DNS lookup тоже может добавлять latency?
325. Что нужно уточнить при жалобе “всё тормозит”?

### Средний уровень
326. Как отличить network latency от server processing latency?
327. Почему TCP handshake time полезен в диагностике?
328. Как traceroute помогает при latency issues?
329. Почему traceroute limited for latency RCA?
330. Как local interface queue drops correlate with high latency?
331. Как Wi-Fi/cellular variability влияет на latency?
332. Почему tail latency важнее average latency для user experience?
333. Как packet size влияет на latency symptoms?
334. Почему congestion на одном узле path может вызывать spikes throughout session?
335. Как overloaded firewall/NAT/LB device проявляется как latency?
336. Как CPU saturation on endpoint inflates network-looking latency?
337. Как application thread starvation masquerades as network delay?
338. Почему нужно измерять latency from multiple vantage points?
339. Как asymmetric path complicates latency interpretation?
340. Как delayed ACK / Nagle / small writes influence latency-sensitive apps?
341. Как high RTT affects TCP throughput?
342. Как queue buildup shows in packet capture?
343. Какие counters и графики нужны для high-latency RCA?
344. Как distinguish steady high latency from jitter bursts?
345. Какие common mistakes happen when diagnosing latency complaints?

### Продвинутый уровень
346. Как decompose end-to-end latency into DNS, connect, TLS, request, server and transfer components?
347. Как packet capture helps measure handshake and response phases precisely?
348. Как correlate kernel queueing, NIC stats and app timing?
349. Как bufferbloat manifests in ping, TCP RTT and application metrics?
350. Как use tc/netem to reproduce latency pathologies?
351. Как p50 vs p99 analysis changes RCA conclusions?
352. Как coordinated omission can hide real latency problems?
353. Как instrument C/C++ applications to separate network wait from user-space delays?
354. Как event loop starvation or thread contention inflate perceived network latency?
355. Как distinguish congestion-induced delay from routing detour?
356. Как packet pacing and queue discipline tuning can reduce latency?
357. Как identify latency bottleneck in multi-hop distributed service chains?
358. Какие interview вопросы по latency troubleshooting показывают engineering maturity?
359. Какие anti-patterns чаще всего вредят latency RCA?
360. Что должен глубоко понимать инженер про latency, прежде чем говорить “сеть медленная”?

### Инженерные вопросы
361. Почему высокая задержка — одна из самых коварных сетевых проблем?
362. Какие компоненты latency budget чаще всего игнорируют?
363. Как объяснить latency troubleshooting на интервью через decomposition?
364. Какие знания особенно важны software engineer для latency-sensitive systems?
365. Какие темы high-latency RCA нужно знать глубоко?

---

## 7. Анализ проблем: потери пакетов

### Базовый уровень
366. Что такое packet loss?
367. Почему packet loss возможен даже в работающей сети?
368. Как ping помогает увидеть packet loss?
369. Почему ping loss не всегда равен application loss?
370. Как packet loss влияет на TCP?
371. Как packet loss влияет на UDP?
372. Почему loss и latency часто связаны?
373. Почему burst loss обычно хуже random loss?
374. Что такое retransmission как symptom потерь?
375. Почему небольшая потеря может сильно ломать некоторые приложения?

### Средний уровень
376. Какие основные причины packet loss?
377. Как congestion вызывает loss?
378. Как queue overflow вызывает loss?
379. Как bad cable/NIC/driver может давать loss?
380. Как wireless interference or fading дают loss?
381. Как policer/shaper/firewall can look like packet loss?
382. Как MTU mismatch может выглядеть как loss?
383. Почему drops на receive queue хоста и drops в сети — не одно и то же?
384. Как interpret packet loss only on one protocol?
385. Почему TCP retransmissions are a critical clue?
386. Как `netstat -s`, `ss`, `ip -s link` помогают при loss diagnosis?
387. Какие interface counters особенно важны?
388. Как packet capture помогает увидеть retransmissions, dup ACKs, gaps?
389. Почему packet capture не всегда позволяет доказать, где именно теряется пакет?
390. Как multiple vantage points помогают pinpoint loss domain?
391. Как distinguish sender-side drop from network drop from receiver-side drop?
392. Почему high CPU on host can create drops without external network fault?
393. Как buffer sizing влияет на host-side loss?
394. Как loss проявляется в приложении на C/C++?
395. Какие common mistakes делают при анализе packet loss?

### Продвинутый уровень
396. Как correlate TCP retransmissions with interface drops and queue pressure?
397. Как distinguish true path loss from packet capture loss on observer host?
398. Как use sequence numbers, ACK patterns and timestamps to reason about loss?
399. Как asymmetric loss paths complicate RCA?
400. Как microbursts create loss without obvious average bandwidth saturation?
401. Как policers differ from congested queues symptomatically?
402. Как use synthetic traffic tests to characterize loss behavior?
403. Как FEC, retransmission and buffering trade off against loss in realtime apps?
404. Как instrument C/C++ services to detect downstream vs upstream packet loss symptoms?
405. Как interpret UDP loss in high-rate applications where app drops may dominate?
406. Какие interview вопросы по packet loss diagnosis действительно проверяют практику?
407. Какие anti-patterns чаще всего мешают реальному loss RCA?
408. Как build a production-ready loss investigation playbook?
409. Какие metrics must be retained historically to analyze intermittent loss?
410. Что должен глубоко понимать инженер про packet loss beyond “есть потеря/нет потери”?

### Инженерные вопросы
411. Почему packet loss — это symptom, а не root cause?
412. Какие классы причин потерь обязан быстро перебрать инженер?
413. Как объяснить packet-loss troubleshooting на интервью?
414. Какие темы packet loss особенно важны для TCP-heavy systems?
415. Какие темы packet loss особенно важны для realtime/UDP systems?

---

## 8. Bottlenecks в сети

### Базовый уровень
416. Что такое bottleneck в сети?
417. Почему bottleneck не всегда находится там, где highest utilization?
418. Как bottleneck влияет на throughput?
419. Как bottleneck влияет на latency?
420. Почему bottleneck может быть в сети, на хосте или в приложении?
421. Чем bandwidth bottleneck отличается от CPU bottleneck?
422. Чем queue bottleneck отличается от routing problem?
423. Почему bottleneck важно локализовать, а не просто “увидеть медленно”?
424. Какие симптомы у bottleneck чаще всего?
425. Почему один bottleneck может скрывать другой?

### Средний уровень
426. Как определить, bottleneck link это или endpoint limitation?
427. Почему high utilization не всегда bad, а low utilization не всегда good?
428. Как BDP связан с throughput bottleneck?
429. Почему small socket buffers могут выглядеть как network bottleneck?
430. Как TCP window limitation masquerades as path limitation?
431. Как queueing on one hop manifests at application level?
432. Как NAT/firewall/load balancer can become hidden bottleneck?
433. Как DNS or control-plane dependencies can become perceived bottleneck?
434. Как server disk/CPU/back-end latency may look like network bottleneck?
435. Как load tests help reveal bottlenecks?
436. Почему short benchmarks can misidentify bottlenecks?
437. Какие counters и metrics useful for bottleneck analysis?
438. Почему throughput нужно анализировать вместе с latency and drops?
439. Как traceroute помогает и в чём ограничен для bottleneck detection?
440. Как packet capture помогает понять bottleneck behavior?
441. Как distinguish policer from true capacity bottleneck?
442. Как distinguish wireless radio bottleneck from core transport bottleneck?
443. Какие mistakes чаще всего допускают при bottleneck analysis?
444. Что должен понимать software engineer про bottlenecks in distributed systems?
445. Какие interview вопросы по bottlenecks проверяют зрелое понимание?

### Продвинутый уровень
446. Как systematically locate bottleneck across host stack, NIC, access link, core and remote endpoint?
447. Как combine RTT growth, cwnd behavior, retransmissions and throughput to infer bottleneck type?
448. Как microbursts and shallow buffers create hidden bottlenecks?
449. Как queue disciplines, pacing and shaping alter bottleneck behavior?
450. Как use controlled experiments to move bottleneck and validate hypothesis?
451. Как instrument C/C++ network service to identify whether it is producer-limited, consumer-limited or path-limited?
452. Как asynchronous processing and thread pools can obscure real bottlenecks?
453. Как cloud/virtualization layers create hidden network-like bottlenecks?
454. Какие historical metrics are needed to catch transient bottlenecks?
455. Какие anti-patterns особенно опасны при bottleneck RCA?
456. Как design capacity tests that surface true bottlenecks rather than artifacts?
457. Как explain bottleneck analysis clearly on interview?
458. Какие bottleneck topics особенно важны для high-performance C++ networking?
459. Как distinguish steady-state bottleneck from transient congestion?
460. Что должен глубоко понимать senior engineer про bottleneck behavior?

### Инженерные вопросы
461. Почему bottleneck analysis — центральная часть performance troubleshooting?
462. Какие bottleneck classes стоит всегда держать в голове?
463. Как объяснить bottleneck reasoning на интервью через concrete examples?
464. Какие знания особенно важны для engineers working on packet processing or low-latency systems?
465. Какие темы bottlenecks обязательно знать глубоко?

---

## 9. Диагностика по уровням OSI

### Базовый уровень
466. Почему модель OSI полезна в troubleshooting?
467. Почему OSI не всегда literally соответствует implementation, но полезна practically?
468. Как L1 problems обычно проявляются?
469. Как L2 problems обычно проявляются?
470. Как L3 problems обычно проявляются?
471. Как L4 problems обычно проявляются?
472. Как L7 problems обычно проявляются?
473. Почему важно не перепрыгивать уровни слишком рано?
474. Почему “ping works” не исключает L4/L7 проблему?
475. Почему application error не всегда означает L7 root cause?

### Средний уровень
476. Какие типовые симптомы для Physical layer?
477. Какие типовые симптомы для Data Link layer?
478. Какие типовые симптомы для Network layer?
479. Какие типовые симптомы для Transport layer?
480. Какие типовые симптомы для Application layer?
481. Как ARP/NDP issues классифицировать между L2 и L3 practically?
482. Почему VLAN/tagging/STP issues часто выглядят как “пропадает сеть”?
483. Как routing issues symptomatically differ from firewall issues?
484. Как TCP reset, timeout и retransmissions помогают L4 diagnosis?
485. Как DNS issues sit between L7 symptom and lower-layer connectivity?
486. Почему TLS handshake issues часто ошибочно считают “сеть не работает”?
487. Как MTU issues проявляются across multiple layers?
488. Как congestion can look like L3/L4/L7 problem simultaneously?
489. Почему wireless issues often surface as L4/L7 symptoms?
490. Как OSI mindset помогает сузить fault domain быстрее?
491. Какие команды/инструменты наиболее полезны per OSI layer?
492. Как packet capture maps to OSI-based thinking?
493. Какие common mistakes делают при “OSI troubleshooting”?
494. Почему OSI should guide reasoning, not replace evidence?
495. Что должен понимать engineer про layered troubleshooting?

### Продвинутый уровень
496. Как build OSI-based fault tree for a real incident?
497. Как map application symptom to likely lower-layer hypotheses?
498. Как distinguish transport backpressure from network loss using layered reasoning?
499. Как overlays, tunnels and service meshes blur OSI-style diagnosis?
500. Как combine OSI model with control-plane/user-plane separation?
501. Как LTE/5G or wireless systems fit imperfectly but usefully into layered troubleshooting?
502. Как instrument systems so that each logical layer has observable signals?
503. Какие interview вопросы по OSI-based troubleshooting показывают real engineering approach?
504. Какие anti-patterns бывают у engineers who overfit every problem into one layer?
505. Что должен глубоко понимать engineer about using OSI as a troubleshooting framework?

### Инженерные вопросы
506. Почему OSI — полезный mental model для RCA?
507. Когда OSI помогает, а когда слишком упрощает картину?
508. Как объяснить layered troubleshooting на интервью?
509. Какие OSI темы особенно важны C/C++ network developer?
510. Что надо знать глубоко, чтобы эффективно диагностировать проблемы по слоям?

---

## 10. Практика: Linux, сокеты и системная диагностика

### Базовый уровень
511. Какие базовые команды Linux полезны для network troubleshooting?
512. Что показывают `ip addr`, `ip route`, `ip neigh`?
513. Зачем нужны `ss` и `netstat`?
514. Что показывает `ss -tulpen`?
515. Как проверить, слушает ли процесс нужный порт?
516. Как проверить, есть ли established TCP connections?
517. Зачем нужен `tcpdump`?
518. Почему packet capture остаётся ключевым инструментом?
519. Что такое `errno` в сетевом программировании?
520. Какие ошибки сокетов нужно знать в первую очередь?

### Средний уровень
521. Что означают `ECONNREFUSED`, `ETIMEDOUT`, `ECONNRESET`, `EHOSTUNREACH`, `ENETUNREACH`?
522. Как эти ошибки помогают в troubleshooting?
523. Что означает `recv() == 0`?
524. Почему `connect()` timeout и `ECONNREFUSED` указывают на разные проблемы?
525. Как `strace` помогает в сетевой диагностике приложения?
526. Как `lsof -i` помогает?
527. Как `ip -s link` помогает?
528. Как `ethtool` помогает при L1/L2 проблемах?
529. Как `journalctl` и system logs помогают network troubleshooting?
530. Как container network namespaces усложняют диагностику?
531. Как Linux firewall (`iptables`/`nftables`) влияет на симптомы?
532. Как policy routing и multiple tables complicate host-side debugging?
533. Почему reverse path filtering sometimes breaks valid traffic?
534. Как socket buffer sizes influence performance symptoms?
535. Что должен понимать C/C++ engineer about host-side network debugging?

### Продвинутый уровень
536. Как instrument C/C++ application for useful network diagnostics without too much overhead?
537. Какие per-request/per-connection timings стоит логировать?
538. Как distinguish app hang from blocked socket I/O?
539. Как non-blocking sockets and epoll complicate debugging?
540. Какие race conditions typical in asynchronous network code?
541. Как packet captures correlate with userspace timestamps?
542. Как use `perf`, `ebpf` or kernel tracing conceptually in network RCA?
543. Как identify host stack bottleneck vs external network bottleneck?
544. Какие interview вопросы по Linux/socket troubleshooting показывают сильного инженера?
545. Какие anti-patterns вредят observability in C/C++ networking code?
546. Как build reproducible local labs for debugging network code?
547. Как use network namespaces, tc/netem and packet capture together?
548. Какие logging fields most useful: local/remote IP, port, errno, RTT, bytes, retries?
549. Как explain practical Linux-side network debugging on interview?
550. Что должен глубоко понимать engineer about sockets as observability surface?

### Инженерные вопросы
551. Почему сильный network developer должен уметь и команды Linux, и packet capture, и socket-level reasoning?
552. Какие host-side инструменты обязательны для практики?
553. Что особенно важно логировать в production network service?
554. Как лучше объяснять socket-level troubleshooting на интервью?
555. Какие темы Linux/network debugging нужно знать глубоко?

---

## 11. Практические сценарии troubleshooting

### Базовый уровень
556. Как диагностировать сценарий: “ping до IP работает, сайт не открывается”?
557. Как диагностировать сценарий: “hostname не резолвится”?
558. Как диагностировать сценарий: “в локальной сети всё работает, наружу — нет”?
559. Как диагностировать сценарий: “иногда всё работает, иногда timeout”?
560. Как диагностировать сценарий: “только один сервис недоступен”?
561. Как диагностировать сценарий: “UDP сервис теряет пакеты”?
562. Как диагностировать сценарий: “TCP соединения долго устанавливаются”?
563. Как диагностировать сценарий: “под нагрузкой сеть резко деградирует”?
564. Как диагностировать сценарий: “только large responses ломаются”?
565. Как диагностировать сценарий: “через VPN работает, без VPN нет”?

### Средний уровень
566. Как построить RCA для intermittent packet loss?
567. Как построить RCA для only-one-region issue?
568. Как построить RCA для only-one-client-class issue?
569. Как построить RCA для DNS-only issue?
570. Как построить RCA для SYN timeout vs TLS timeout?
571. Как построить RCA для high RTT but no visible loss?
572. Как построить RCA для good ping but bad application throughput?
573. Как построить RCA для no-connectivity after config change?
574. Как построить RCA для NAT-related reachability issue?
575. Как построить RCA для MTU blackhole?
576. Как built layered evidence rather than intuition in these scenarios?
577. Какие данные обязательно собрать перед эскалацией?
578. Какие минимальные reproduction steps стоит описывать?
579. Почему incident notes и exact timestamps важны?
580. Какие типовые ошибки инженеры делают в scenario-based troubleshooting?

### Продвинутый уровень
581. Как design troubleshooting exercises for interview or training?
582. Какие synthetic scenarios best test real network reasoning?
583. Как simulate packet loss, delay, DNS failure, MTU issue, routing issue in lab?
584. Как evaluate whether candidate truly understands troubleshooting?
585. Какие interview questions on practical scenarios reveal senior-level thinking?
586. Как distinguish cargo-cult command running from evidence-based diagnosis?
587. Как structure written RCA after solving scenario?
588. Какие anti-patterns чаще всего появляются в practical troubleshooting exercises?
589. Как convert real production incidents into reusable question bank?
590. Что должен уметь senior engineer in scenario-driven network RCA?

### Инженерные вопросы
591. Почему лучшие вопросы по troubleshooting — это сценарии, а не определения?
592. Какие практические сценарии обязательно включить в сборник вопросов?
593. Как объяснить своё решение сценария на интервью?
594. Какие темы practical troubleshooting наиболее ценны для network/software engineer?
595. Что стоит изучать после этого блока: tcpdump, Wireshark, netem, Linux kernel networking, eBPF?

---

## 12. Сквозные вопросы по troubleshooting и практике

### Обобщение
596. Какой минимальный troubleshooting workflow должен знать любой network engineer?
597. Какие 5 инструментов наиболее полезны ежедневно?
598. Почему `ping`, `traceroute`, `dig`, `ss`, `tcpdump` — сильная стартовая связка?
599. Как быстро отделить DNS issue от connectivity issue?
600. Как быстро отделить routing issue от firewall issue?
601. Как быстро отделить network issue от app/server issue?
602. Как packet capture вписывается в layered troubleshooting?
603. Почему hypothesis-driven подход эффективнее случайного запуска команд?
604. Какие метрики нужно всегда связывать: latency, loss, retransmissions, errors, throughput?
605. Почему packet loss, latency и throughput нельзя анализировать изолированно?
606. Как bottlenecks и OSI model together помогают RCA?
607. Как troubleshooting differs in wired vs wireless/mobile networks?
608. Какие дополнительные сложности вносят LTE/5G/Wi-Fi/cellular paths?
609. Что должен понимать C/C++ engineer о production troubleshooting?
610. Какие вопросы по troubleshooting чаще всего показывают senior-level понимание?

### Interview-style
611. Как за 2 минуты описать свой стандартный подход к сетевой диагностике?
612. Как за минуту объяснить, чем полезен и чем ограничен ping?
613. Как за минуту объяснить, как интерпретировать traceroute?
614. Как за минуту объяснить базовый DNS troubleshooting workflow?
615. Как за минуту объяснить подход к no-connectivity incident?
616. Как за минуту объяснить подход к high-latency incident?
617. Как за минуту объяснить подход к packet-loss incident?
618. Как за минуту объяснить, что такое bottleneck и как его искать?
619. Как за минуту объяснить OSI-based troubleshooting practically?
620. Какие troubleshooting темы нужно знать глубоко network/software engineer?
621. Какие troubleshooting темы достаточно знать на уровне инженерной интуиции?
622. Какие вопросы по troubleshooting обязательно стоит задать кандидату на C/C++ networking role?
623. Какие вопросы по troubleshooting отличают junior, middle и senior?
624. Как построить хороший раздел “практика и диагностика” в большом сборнике вопросов?
625. Какие темы из troubleshooting стоит расширить следующими блоками: tcpdump/Wireshark, Linux networking, eBPF, sockets, performance tuning?