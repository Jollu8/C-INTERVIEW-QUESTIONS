# Вопросы: Transport Layer (с уклоном в C/C++)

## 1. TCP: базовые концепции

### Базовый уровень
1. Что такое TCP?
2. На каком уровне модели OSI работает TCP?
3. На каком уровне модели TCP/IP работает TCP?
4. Чем TCP отличается от UDP в общем виде?
5. Почему TCP называют connection-oriented protocol?
6. Что означает reliable delivery в TCP?
7. Что означает ordered delivery в TCP?
8. Что означает full-duplex соединение в TCP?
9. Что такое byte stream в TCP?
10. Почему TCP не сохраняет границы сообщений?
11. Что такое segment в TCP?
12. Из каких основных полей состоит TCP header?
13. Что такое source port?
14. Что такое destination port?
15. Что такое sequence number?
16. Что такое acknowledgement number?
17. Что такое flags в TCP?
18. Какие флаги TCP считаются основными?
19. Что такое SYN?
20. Что такое ACK?
21. Что такое FIN?
22. Что такое RST?
23. Что такое PSH?
24. Что такое URG?
25. Что такое window size?
26. Что такое checksum в TCP?
27. Что такое MSS?
28. Чем MSS отличается от MTU?
29. Что такое TCP options?
30. Почему TCP широко используется для прикладных протоколов?

### Средний уровень
31. Почему TCP считается stream-oriented, а не message-oriented?
32. Как приложение должно выделять сообщения поверх TCP?
33. Что может случиться, если считать один `recv()` одним сообщением?
34. Почему `send()` не гарантирует отправку всех данных одним вызовом?
35. Почему `recv()` может вернуть меньше данных, чем ожидается?
36. Что такое partial write?
37. Что такое partial read?
38. Как sequence numbers помогают обеспечивать порядок?
39. Как acknowledgements помогают обеспечивать надёжность?
40. Почему TCP может переупорядочивать сегменты на принимающей стороне?
41. Как TCP обнаруживает повреждённые сегменты?
42. Что происходит при checksum error?
43. Почему TCP зависит от IP, но дополняет его?
44. Какие задачи TCP не решает сам по себе?
45. Почему TCP соединение идентифицируется 4-tuple?
46. Что входит в 4-tuple TCP соединения?
47. Может ли один сокет обслуживать много TCP соединений?
48. Чем listening socket отличается от connected socket?
49. Что происходит с сегментом, если приложение не читает данные?
50. Что означает backpressure в TCP?

### Продвинутый уровень
51. Как TCP реализуется в ядре Linux на высоком уровне?
52. Что такое send buffer и receive buffer?
53. Как размер socket buffer влияет на производительность?
54. Что происходит между `write()` приложения и отправкой сегмента NIC?
55. Как ядро решает, когда формировать TCP segment?
56. Что такое segmentation offload?
57. Что такое TSO/GSO на концептуальном уровне?
58. Что такое GRO/LRO на приёмной стороне?
59. Как offloading влияет на анализ tcpdump?
60. Почему данные в tcpdump иногда выглядят "крупнее", чем MTU?
61. Как NIC offload может мешать отладке TCP?
62. Что такое socket backlog?
63. Как backlog связан с установкой соединения?
64. Чем accept queue отличается от SYN queue?
65. Что происходит, если accept queue переполнена?
66. Что происходит, если приложение слишком медленно вызывает `accept()`?
67. Как TCP соединение связано с файловым дескриптором в Unix?
68. Как epoll/select/poll используются с TCP сокетами?
69. Почему TCP код часто требует state machine в приложении?
70. Какие ошибки проектирования чаще всего возникают при работе с TCP в C/C++?

---

## 2. TCP: 3-way handshake

### Базовый уровень
71. Что такое 3-way handshake?
72. Зачем TCP нужен handshake перед передачей данных?
73. Какие пакеты участвуют в 3-way handshake?
74. Что отправляет клиент первым?
75. Что отвечает сервер на SYN?
76. Что отправляет клиент после SYN-ACK?
77. Почему handshake состоит именно из трёх шагов?
78. Что подтверждает SYN-ACK?
79. Что подтверждает финальный ACK?
80. Когда соединение считается установленным?
81. Почему нельзя обойтись двумя пакетами?
82. Что такое initial sequence number?
83. Зачем sequence number обмениваются уже на этапе handshake?
84. Какие TCP options обычно согласуются в handshake?
85. Что такое SYN flood?

### Средний уровень
86. Почему handshake нужен для синхронизации состояний обеих сторон?
87. Что означает half-open connection?
88. Что происходит на сервере после получения SYN?
89. В каком состоянии находится клиент после отправки SYN?
90. В каком состоянии сервер находится после получения SYN и отправки SYN-ACK?
91. Что означает состояние SYN_SENT?
92. Что означает состояние SYN_RECEIVED?
93. Что означает состояние ESTABLISHED?
94. Что происходит, если финальный ACK потеряется?
95. Может ли соединение всё равно установиться при потере ACK?
96. Что такое retransmission SYN?
97. Как TCP определяет timeout при handshake?
98. Что происходит, если сервер не отвечает на SYN?
99. Что увидит приложение при неудачном `connect()`?
100. Чем `ECONNREFUSED` отличается от timeout при `connect()`?
101. Когда сервер отвечает RST вместо SYN-ACK?
102. Как firewall влияет на handshake?
103. Почему handshake помогает защититься от старых/дублированных сегментов?
104. Что такое SYN cookies?
105. Как SYN cookies помогают против SYN flood?

### Продвинутый уровень
106. Как посмотреть handshake в tcpdump?
107. Как увидеть handshake в Wireshark?
108. Как `connect()` связан с 3-way handshake на уровне ядра?
109. Когда `connect()` возвращает управление приложению?
110. Что происходит при non-blocking `connect()`?
111. Как понять, что non-blocking `connect()` завершился успешно?
112. Почему после `EINPROGRESS` обычно проверяют сокет через `select`/`poll`/`epoll`?
113. Что показывает `getsockopt(SO_ERROR)` после non-blocking `connect()`?
114. Что происходит на стороне сервера между `listen()` и `accept()`?
115. Как handshake выглядит для `accept()`?
116. Почему accepted socket отличается от listening socket?
117. Как backlog влияет на устойчивость сервера под нагрузкой?
118. Что такое simultaneous open?
119. Может ли TCP handshake происходить одновременно в обе стороны?
120. Что такое TCP Fast Open?
121. Какие преимущества даёт TCP Fast Open?
122. Какие ограничения и риски у TCP Fast Open?
123. Как handshake ведёт себя при packet loss?
124. Как считать RTT по handshake?
125. Какие метрики handshake полезно логировать на сервере?

---

## 3. TCP: завершение соединения

### Базовый уровень
126. Как TCP соединение закрывается штатно?
127. Чем закрытие TCP отличается от установки соединения?
128. Что такое four-way termination?
129. Что означает FIN?
130. Что означает graceful shutdown?
131. Что такое half-close?
132. Что делает `close()`?
133. Что делает `shutdown()`?
134. Чем `shutdown()` отличается от `close()`?
135. Что означает RST при завершении соединения?

### Средний уровень
136. Почему закрытие часто требует четырёх пакетов?
137. Что происходит, если одна сторона больше не хочет отправлять данные, но готова принимать?
138. Что означает состояние FIN_WAIT_1?
139. Что означает состояние FIN_WAIT_2?
140. Что означает состояние CLOSE_WAIT?
141. Что означает состояние LAST_ACK?
142. Что означает состояние TIME_WAIT?
143. Зачем нужен TIME_WAIT?
144. Почему TIME_WAIT держится дольше RTT?
145. Почему TIME_WAIT обычно возникает на активной стороне закрытия?
146. Какие проблемы создаёт большое число сокетов в TIME_WAIT?
147. Что будет, если приложение не вызывает `close()` корректно?
148. Когда TCP завершает соединение через RST?
149. Почему abrupt close может приводить к потере данных?
150. Как unread data на сокете влияет на закрытие?

### Продвинутый уровень
151. Как в tcpdump выглядит корректное закрытие TCP?
152. Как выглядит reset соединения?
153. Когда `SIGPIPE` может возникать в Unix-приложении при TCP?
154. Как использовать `MSG_NOSIGNAL` или `SO_NOSIGPIPE`?
155. Что происходит, если писать в уже закрытый peer socket?
156. Что означает ошибка `EPIPE`?
157. Как close/shutdown влияют на протокол прикладного уровня?
158. Почему важно различать EOF и временное отсутствие данных?
159. Что означает `recv()` == 0?
160. Почему `recv()` == 0 указывает на orderly shutdown?
161. Как спроектировать протокол, который корректно переживает half-close?
162. Когда полезно использовать `shutdown(SHUT_WR)`?
163. Как TIME_WAIT влияет на клиентские load tests?
164. Почему `SO_REUSEADDR` не решает все проблемы TIME_WAIT?
165. Какие anti-patterns чаще всего возникают при завершении TCP соединений?

---

## 4. TCP: flow control

### Базовый уровень
166. Что такое flow control в TCP?
167. Зачем нужен flow control?
168. Чем flow control отличается от congestion control?
169. Что такое receive window?
170. Кто объявляет receive window?
171. Как receive window ограничивает объём неподтверждённых данных?
172. Что происходит, если принимающая сторона не успевает читать данные?
173. Что такое advertised window?
174. Почему flow control защищает приёмник от переполнения?
175. Что такое zero window?

### Средний уровень
176. Что происходит, если receiver advertises zero window?
177. Может ли sender продолжать отправку при zero window?
178. Что такое zero-window probe?
179. Зачем zero-window probes нужны?
180. Как размер receive buffer связан с advertised window?
181. Почему маленькое receive window снижает throughput?
182. Как медленное приложение на приёмнике влияет на TCP поток?
183. Что такое application-limited receiver?
184. Как flow control проявляется в tcpdump?
185. Почему чтение из сокета должно быть регулярным?
186. Что произойдёт, если сервер перестанет читать из сокета?
187. Как backpressure доходит до отправителя?
188. Как flow control влияет на latency приложения?
189. Что такое window scaling?
190. Почему без window scaling большие каналы работают плохо?

### Продвинутый уровень
191. Как `SO_RCVBUF` влияет на flow control?
192. Как `SO_SNDBUF` влияет на поведение отправителя?
193. Почему реальный размер buffer может отличаться от запрошенного?
194. Что такое bandwidth-delay product и как он связан с размером окна?
195. Почему большой RTT требует большего окна для полной загрузки канала?
196. Как window scaling согласуется в handshake?
197. Что будет, если одна сторона не поддерживает window scaling?
198. Как flow control влияет на long fat networks?
199. Как в приложении определить, что peer перестал читать?
200. Почему `send()` может блокироваться из-за flow control?
201. Как non-blocking sockets ведут себя при заполнении send buffer?
202. Что означает `EAGAIN` / `EWOULDBLOCK` для TCP записи?
203. Как epoll уведомляет о возможности записи?
204. Почему writable socket не означает "можно записать бесконечно много"?
205. Какие метрики помогают выявлять flow-control bottlenecks?

---

## 5. TCP: congestion control

### Базовый уровень
206. Что такое congestion control в TCP?
207. Зачем congestion control нужен в сети?
208. Чем congestion control отличается от flow control?
209. Что такое congestion window (cwnd)?
210. Как congestion window ограничивает объём данных в полёте?
211. Что такое slow start?
212. Почему slow start так называется?
213. Что такое congestion avoidance?
214. Что такое ssthresh?
215. Что означает packet loss для TCP congestion control?
216. Почему packet loss часто интерпретируется как признак congestion?
217. Как ACK влияет на рост окна?
218. Почему TCP не может всегда отправлять на полной скорости?
219. Что такое fairness в контексте congestion control?
220. Почему congestion control критичен для стабильности интернета?

### Средний уровень
221. Как растёт cwnd в slow start?
222. Как растёт cwnd в congestion avoidance?
223. Что происходит с cwnd при packet loss?
224. Чем fast retransmit связан с congestion control?
225. Что такое fast recovery?
226. Чем timeout хуже для throughput, чем fast retransmit?
227. Почему RTT влияет на поведение congestion control?
228. Почему каналы с большим RTT труднее "раскачать"?
229. Что такое AIMD?
230. Почему классический TCP использует additive increase / multiplicative decrease?
231. Какие проблемы у loss-based congestion control?
232. Почему loss не всегда означает congestion в беспроводных сетях?
233. Как bufferbloat связан с congestion control?
234. Что такое standing queue?
235. Как excessive buffering увеличивает latency?
236. Почему иногда throughput высокий, а latency плохая?
237. Что такое goodput?
238. Чем goodput отличается от throughput?
239. Почему reordering может ошибочно восприниматься как loss?
240. Как ECN связан с congestion control?

### Продвинутый уровень
241. Какие алгоритмы congestion control ты знаешь?
242. Чем Reno отличается от NewReno на концептуальном уровне?
243. Чем CUBIC отличается от Reno?
244. Почему CUBIC долго был дефолтом в Linux?
245. Что такое BBR на концептуальном уровне?
246. Чем BBR отличается от loss-based подходов?
247. Почему BBR может давать меньшую latency?
248. Какие риски и компромиссы есть у BBR?
249. Как выбрать congestion control algorithm в Linux?
250. Как посмотреть текущий congestion control в системе?
251. Как поменять congestion control для тестов?
252. Может ли одно приложение выбирать congestion control per-socket?
253. Как packet pacing помогает congestion control?
254. Что такое self-clocking в TCP?
255. Как delayed ACK влияет на оценку сети?
256. Как ACK compression влияет на TCP?
257. Как AQM (например CoDel/PIE) взаимодействует с congestion control?
258. Что такое incast и почему он опасен для датацентров?
259. Почему wireless links усложняют congestion inference?
260. Какие метрики нужны для анализа поведения congestion control?

### Инженерные вопросы
261. Как congestion control влияет на проектирование высоконагруженного TCP сервиса?
262. Почему один и тот же сервис может вести себя по-разному в LAN, WAN и mobile networks?
263. Когда packet loss — это проблема сети, а когда нормальная часть поведения TCP?
264. Как проводить нагрузочное тестирование TCP сервиса так, чтобы не перепутать congestion и bottleneck приложения?
265. Как выбрать подходящий congestion control для latency-sensitive сервиса?

---

## 6. TCP: retransmissions

### Базовый уровень
266. Что такое retransmission в TCP?
267. Зачем TCP выполняет retransmission?
268. Как TCP понимает, что сегмент потерян?
269. Что такое retransmission timeout (RTO)?
270. Что такое duplicate ACK?
271. Как duplicate ACK помогает обнаружить loss?
272. Что такое fast retransmit?
273. Чем fast retransmit отличается от retransmission по timeout?
274. Почему timeout обычно считается более "дорогим" событием?
275. Как retransmissions обеспечивают надёжность TCP?

### Средний уровень
276. Как TCP вычисляет RTO?
277. Почему RTO не может быть слишком маленьким?
278. Почему RTO не может быть слишком большим?
279. Что такое spurious retransmission?
280. Почему retransmission может происходить без реальной потери?
281. Как packet reordering влияет на retransmissions?
282. Что такое duplicate ACK threshold?
283. Почему классически fast retransmit запускается после трёх duplicate ACK?
284. Что происходит с congestion window при retransmission?
285. Почему retransmissions снижают effective throughput?
286. Как retransmissions влияют на latency?
287. Что такое head-of-line blocking в контексте потери сегмента?
288. Почему потеря одного сегмента может задержать выдачу последующих данных приложению?
289. Как SACK помогает при multiple losses?
290. Что такое selective acknowledgement?
291. Чем SACK лучше cumulative ACK в некоторых сценариях?
292. Что произойдёт, если SACK не поддерживается?
293. Как retransmission выглядит в Wireshark?
294. Как retransmission выглядит в tcpdump?
295. Когда частые retransmissions указывают на проблему сети?

### Продвинутый уровень
296. Какие причины retransmissions кроме physical packet loss ты знаешь?
297. Как overloaded receiver может косвенно вызывать retransmissions?
298. Как queue drops в сети вызывают retransmissions?
299. Как microburst traffic связан с losses и retransmissions?
300. Как firewall/NAT могут приводить к неожиданным retransmissions?
301. Что такое retransmission ambiguity?
302. Как Karn’s algorithm помогает при оценке RTT?
303. Почему RTT measurement усложняется при retransmission?
304. Что такое RACK / TLP на концептуальном уровне?
305. Как современные TCP stack улучшают loss detection?
306. Что такое out-of-order delivery и как она влияет на loss detection?
307. Как DSACK помогает анализировать spurious retransmissions?
308. Как понять, retransmissions вызваны сетью или приложением?
309. Как недостаточный socket buffer может косвенно ухудшать поведение TCP?
310. Как NIC/driver issues могут проявляться как retransmissions?
311. Как собрать доказательства root cause для retransmissions в production?
312. Какие counters в Linux полезны для анализа retransmissions?
313. Как `ss -i` помогает анализировать TCP состояние?
314. Какие метрики стоит экспортировать на уровне приложения и хоста?
315. Когда retransmissions допустимы, а когда это инцидент?

---

## 7. UDP: базовые концепции

### Базовый уровень
316. Что такое UDP?
317. На каком уровне работает UDP?
318. Чем UDP отличается от TCP?
319. Почему UDP называют connectionless protocol?
320. Что означает message-oriented в контексте UDP?
321. Сохраняет ли UDP границы датаграмм?
322. Что такое UDP datagram?
323. Есть ли у UDP handshake?
324. Есть ли у UDP встроенные retransmissions?
325. Есть ли у UDP встроенный congestion control?
326. Есть ли у UDP встроенный flow control?
327. Почему UDP header проще TCP header?
328. Какие поля содержит UDP header?
329. Что такое UDP checksum?
330. Почему UDP часто быстрее TCP по накладным расходам?

### Средний уровень
331. Что получает приложение, если UDP packet потерян?
332. Что происходит, если UDP datagram приходит дублированным?
333. Что происходит, если UDP datagram приходит вне порядка?
334. Как приложение должно реализовать надёжность поверх UDP, если она нужна?
335. Почему UDP подходит не для всех задач?
336. Может ли UDP фрагментироваться на уровне IP?
337. Почему большие UDP datagrams опасны?
338. Что происходит, если UDP datagram больше receive buffer?
339. Что означает truncation для UDP reads?
340. Почему один `recvfrom()` обычно соответствует одной UDP датаграмме?
341. Может ли `sendto()` вернуть успех, хотя пакет позже будет потерян?
342. Почему UDP удобен для multicast?
343. Почему UDP часто используют для real-time traffic?
344. Какие недостатки у UDP для real-time приложений?
345. Как packet loss влияет на UDP приложение?
346. Как jitter влияет на UDP приложение?
347. Как приложение компенсирует jitter?
348. Почему UDP часто используется в DNS?
349. Почему UDP используется в RTP/VoIP?
350. Почему UDP подходит для telemetry / gaming / streaming сценариев?

### Продвинутый уровень
351. Как реализовать UDP сервер на C?
352. Как реализовать UDP клиент на C++?
353. Чем `recvfrom()` отличается от `recv()` для UDP?
354. Что даёт `connect()` на UDP socket?
355. Можно ли вызывать `send()` на UDP socket после `connect()`?
356. Зачем вообще "подключать" UDP socket?
357. Как connected UDP socket фильтрует пакеты?
358. Какие ICMP ошибки может увидеть UDP socket?
359. Как `ECONNREFUSED` может появиться у UDP?
360. Как non-blocking I/O работает с UDP?
361. Как epoll работает с UDP сокетами?
362. Как пакетная обработка (`recvmmsg`/`sendmmsg`) помогает UDP приложениям?
363. Что такое UDP GRO/GSO на концептуальном уровне?
364. Как SO_RCVBUF / SO_SNDBUF влияют на UDP?
365. Почему UDP drops могут происходить уже на стороне хоста?
366. Как в Linux увидеть UDP receive drops?
367. Что такое socket receive queue overflow?
368. Как packet capture помогает отладить UDP loss?
369. Как отличить network loss от application drop для UDP?
370. Какие типичные ошибки допускают в UDP сервисах на C/C++?

---

## 8. UDP: когда используется

### Базовый уровень
371. Когда UDP предпочтительнее TCP?
372. Почему UDP удобен для low-latency приложений?
373. В каких случаях потеря части пакетов допустима?
374. Почему real-time audio/video часто используют UDP?
375. Почему DNS historically использует UDP?
376. Почему DHCP использует UDP?
377. Почему multicast обычно строится на UDP?
378. Почему online games часто используют UDP?
379. Почему telemetry и metrics иногда отправляют по UDP?
380. Почему service discovery часто использует UDP?

### Средний уровень
381. Когда TCP всё же лучше UDP даже для быстрой передачи?
382. Почему "UDP быстрее" — слишком грубое утверждение?
383. Когда надёжность важнее latency?
384. Когда ordering критичен, а когда нет?
385. Когда приложение может само реализовать retransmission лучше TCP?
386. Почему media apps часто строят свои механизмы поверх UDP?
387. Что такое jitter buffer и зачем он нужен?
388. Почему FEC может быть полезен поверх UDP?
389. Когда QUIC вытесняет custom protocol поверх UDP?
390. Какие риски у UDP в интернете с точки зрения middleboxes?
391. Почему NAT traversal часто строят вокруг UDP?
392. Почему UDP amplification attacks являются проблемой?
393. Какие сервисы нельзя бездумно строить на UDP?
394. Как packet pacing важно для UDP real-time трафика?
395. Когда UDP приложение должно само ограничивать скорость передачи?

### Продвинутый уровень
396. Как принять решение TCP vs UDP для нового протокола?
397. Какие требования к доставке, ordering и latency нужно зафиксировать заранее?
398. Как измерить, что UDP действительно лучше для данного кейса?
399. Какие trade-offs у UDP в мобильных и беспроводных сетях?
400. Как проектировать протокол поверх UDP для loss-prone среды?
401. Когда стоит добавить sequence numbers в собственный UDP протокол?
402. Когда стоит добавить ACK/NACK поверх UDP?
403. Когда стоит добавить retransmission поверх UDP?
404. Когда стоит не добавлять retransmission вовсе?
405. Какие anti-patterns чаще всего возникают при разработке custom reliable UDP protocol?

---

## 9. QUIC: базовые концепции

### Базовый уровень
406. Что такое QUIC?
407. На каком транспорте работает QUIC?
408. Почему QUIC строится поверх UDP?
409. Какие задачи QUIC решает по сравнению с TCP+TLS?
410. Почему QUIC часто ассоциируется с HTTP/3?
411. Есть ли у QUIC встроенное шифрование?
412. Почему security встроена в QUIC изначально?
413. Чем QUIC отличается от TCP на концептуальном уровне?
414. Что такое connection ID в QUIC?
415. Почему connection ID полезен для мобильных клиентов?
416. Что такое streams в QUIC?
417. Чем QUIC streams отличаются от TCP byte stream?
418. Что такое multiplexing в QUIC?
419. Почему QUIC уменьшает head-of-line blocking на уровне приложения?
420. Что такое 0-RTT в QUIC?

### Средний уровень
421. Какие преимущества QUIC даёт по latency?
422. Почему объединение transport и crypto handshake ускоряет соединение?
423. Чем QUIC handshake отличается от TCP + TLS handshake?
424. Почему QUIC удобнее эволюционировать, чем TCP?
425. Как user-space implementation помогает быстрее развивать QUIC?
426. Что такое connection migration в QUIC?
427. Почему QUIC устойчивее к смене IP/сети у клиента?
428. Как QUIC реализует надёжность поверх UDP?
429. Есть ли у QUIC congestion control?
430. Есть ли у QUIC flow control?
431. Как QUIC реализует retransmission?
432. Почему QUIC может лучше контролировать packet loss recovery?
433. Что такое packet number spaces в QUIC?
434. Почему QUIC шифрует большую часть transport metadata?
435. Какие преимущества и недостатки этого для observability?
436. Что такое stream-level flow control в QUIC?
437. Чем stream-level flow control отличается от connection-level?
438. Как QUIC избегает HOL blocking между потоками?
439. Какие сложности внедрения QUIC в production ты знаешь?
440. Почему middleboxes иногда мешали новым transport-протоколам?

### Продвинутый уровень
441. Почему QUIC поверх UDP не означает "без надёжности"?
442. Чем loss recovery в QUIC концептуально отличается от TCP?
443. Какие преимущества даёт user-space QUIC implementation для приложений?
444. Какие недостатки даёт user-space QUIC по сравнению с kernel TCP?
445. Как QUIC взаимодействует с NAT и firewall?
446. Какие проблемы диагностики создаёт шифрование QUIC traffic?
447. Как анализировать QUIC производительность без расшифровки payload?
448. Почему packet capture для QUIC менее информативен, чем для TCP?
449. Как 0-RTT влияет на безопасность?
450. Какие replay risks есть у 0-RTT?
451. Когда QUIC выигрывает у TCP+TLS, а когда разница мала?
452. Почему QUIC особенно интересен для web и mobile workloads?
453. Какие системные вызовы и event-loop pattern обычно используются в QUIC серверах?
454. Чем реализация high-performance QUIC server в C/C++ отличается от TCP server?
455. Какие библиотеки/стеки QUIC обычно рассматривают в инженерной практике?
456. Какие метрики нужно собирать для QUIC сервиса?
457. Как сравнить эффективность TCP и QUIC в controlled experiment?
458. Какие anti-patterns возникают при миграции с HTTP/2 на HTTP/3?
459. Когда QUIC не даёт ожидаемой выгоды?
460. Как объяснить выбор QUIC на архитектурном интервью?

---

## 10. Метрики: latency

### Базовый уровень
461. Что такое latency?
462. Чем latency отличается от delay?
463. Что такое round-trip time (RTT)?
464. Чем RTT отличается от one-way latency?
465. Почему one-way latency труднее измерять?
466. Что такое network latency?
467. Какие компоненты входят в end-to-end latency?
468. Что такое propagation delay?
469. Что такое transmission delay?
470. Что такое queuing delay?
471. Что такое processing delay?
472. Почему высокая latency ухудшает user experience?
473. Почему latency важна даже при высоком throughput?
474. Для каких приложений latency критичнее всего?
475. Как latency влияет на TCP performance?

### Средний уровень
476. Как RTT влияет на handshake time?
477. Почему latency важна для request-response протоколов?
478. Почему высокая latency увеличивает time-to-first-byte?
479. Как congestion может увеличивать latency?
480. Как bufferbloat увеличивает latency?
481. Почему wireless links часто имеют variable latency?
482. Как retransmissions увеличивают effective latency?
483. Как DNS lookup влияет на perceived latency?
484. Как TLS handshake влияет на latency?
485. Почему keep-alive помогает уменьшать latency?
486. Почему connection pooling уменьшает latency?
487. Почему Nagle’s algorithm может влиять на latency?
488. Что такое delayed ACK и как он влияет на latency?
489. Когда маленькие пакеты ухудшают latency profile?
490. Как latency измерять на сервере и на клиенте?

### Продвинутый уровень
491. Как измерять latency в C/C++ приложении корректно?
492. Почему важно различать application latency и network RTT?
493. Как clock source влияет на точность latency measurements?
494. Почему percentiles важнее среднего значения?
495. Что такое p50, p95, p99 latency?
496. Почему tail latency критична для distributed systems?
497. Как coordinated omission искажает latency measurements?
498. Как packet capture использовать для оценки latency?
499. Как tcpdump/wireshark помогают измерять RTT?
500. Как отличить high latency из-за сети от high latency из-за перегруженного сервера?
501. Какие метрики и логи стоит собирать для анализа latency?
502. Как latency budget распределяется между компонентами системы?
503. Как проектировать transport/protocol stack для минимизации latency?
504. Какие оптимизации уменьшают latency без потери надёжности?
505. Какие anti-patterns ухудшают latency в сетевых C++ сервисах?

---

## 11. Метрики: jitter

### Базовый уровень
506. Что такое jitter?
507. Чем jitter отличается от latency?
508. Почему jitter важен для real-time traffic?
509. Какие приложения особенно чувствительны к jitter?
510. Почему голос и видео страдают от jitter?
511. Может ли средняя latency быть нормальной, а качество связи — плохим из-за jitter?
512. Что такое packet delay variation?
513. Как jitter воспринимается пользователем?
514. Почему TCP приложения часто менее чувствительны к jitter, чем RTP/UDP?
515. Как jitter связан с буферизацией?

### Средний уровень
516. Какие причины jitter в сети?
517. Как очереди на роутерах создают jitter?
518. Как wireless medium создаёт jitter?
519. Как congestion создаёт jitter?
520. Как route changes создают jitter?
521. Как packet reordering может сопровождаться jitter?
522. Как jitter влияет на playout buffer?
523. Что такое jitter buffer?
524. Как выбрать размер jitter buffer?
525. Почему слишком маленький jitter buffer приводит к выпадениям?
526. Почему слишком большой jitter buffer увеличивает задержку?
527. Как измерять jitter?
528. Какой jitter считается приемлемым для VoIP?
529. Почему percentiles полезны и для jitter тоже?
530. Как отделить jitter сети от jitter приложения?

### Продвинутый уровень
531. Как вычислять jitter программно?
532. Какие timestamping подходы подходят для jitter measurement?
533. Как packet capture использовать для анализа jitter?
534. Как визуализировать jitter distribution?
535. Как event loop и scheduler OS могут добавлять "ложный" jitter?
536. Как GC/allocations/locks в user-space могут маскироваться под network jitter?
537. Как диагностировать, jitter вызван NIC, kernel, network path или application?
538. Как UDP realtime protocol должен адаптироваться к росту jitter?
539. Какие adaptive algorithms используют media applications?
540. Какие operational метрики нужны для контроля jitter в production?

---

## 12. Метрики: packet loss

### Базовый уровень
541. Что такое packet loss?
542. На каком этапе пакет может потеряться?
543. Почему packet loss возможен даже в "рабочей" сети?
544. Как packet loss влияет на TCP?
545. Как packet loss влияет на UDP?
546. Почему небольшая потеря может быть почти незаметна для одних приложений и критична для других?
547. Что такое random loss?
548. Что такое burst loss?
549. Почему burst loss обычно хуже random loss?
550. Как packet loss воспринимается пользователем?

### Средний уровень
551. Какие причины packet loss ты знаешь?
552. Как congestion вызывает packet loss?
553. Как buffer overflow вызывает packet loss?
554. Как плохой wireless signal вызывает packet loss?
555. Как faulty NIC/cable/driver может вызывать loss?
556. Как ACL/firewall/policer могут выглядеть как packet loss?
557. Как MTU black hole выглядит для приложения?
558. Как packet loss влияет на throughput TCP?
559. Почему 1% loss может сильно снизить производительность некоторых TCP flows?
560. Как packet loss влияет на latency и jitter?
561. Почему retransmissions скрывают loss от приложения, но не бесплатно?
562. Как packet loss измеряется?
563. Чем active measurement отличается от passive measurement?
564. Когда `ping` полезен для оценки loss, а когда недостаточен?
565. Как packet capture помогает анализировать loss?

### Продвинутый уровень
566. Как отличить true network loss от packet drop в host stack?
567. Как UDP receive queue overflow проявляется как loss?
568. Как ring buffer NIC может приводить к drops?
569. Какие Linux counters полезны для анализа loss?
570. Как `netstat -s`, `ss`, `ip -s link` помогают при диагностике?
571. Как определить, loss происходит на пути туда или обратно?
572. Почему asymmetric path усложняет анализ loss?
573. Как ECN помогает уменьшать loss?
574. Как AQM помогает уменьшать loss and latency?
575. Как FEC помогает бороться с packet loss в UDP приложениях?
576. Когда retransmission лучше FEC, а когда наоборот?
577. Как проектировать приложение, устойчивое к packet loss?
578. Какие метрики потерь надо собирать на transport и application уровне?
579. Когда packet loss является нормой, а когда это инцидент?
580. Как делать root-cause analysis packet loss в production сети?

---

## 13. Метрики: throughput

### Базовый уровень
581. Что такое throughput?
582. Чем throughput отличается от bandwidth?
583. Чем throughput отличается от goodput?
584. Почему nominal link speed не равна реальному throughput?
585. Какие факторы ограничивают throughput?
586. Как RTT влияет на achievable throughput?
587. Как packet loss влияет на throughput?
588. Почему protocol overhead снижает useful throughput?
589. Почему TCP и UDP могут давать разный effective throughput?
590. Как размер окна влияет на throughput?

### Средний уровень
591. Что такое bandwidth-delay product?
592. Почему BDP важен для high-throughput TCP?
593. Как недостаточный receive window ограничивает throughput?
594. Как congestion window ограничивает throughput?
595. Как small writes ухудшают throughput?
596. Как syscall overhead влияет на throughput?
597. Как copy overhead влияет на throughput?
598. Почему zero-copy техники могут улучшить throughput?
599. Как MTU влияет на throughput?
600. Почему jumbo frames могут повышать throughput?
601. Когда jumbo frames вредны или бесполезны?
602. Как packet pacing влияет на throughput?
603. Как CPU bottleneck ограничивает throughput?
604. Как single-threaded event loop может ограничивать throughput?
605. Почему throughput нужно анализировать вместе с latency?

### Продвинутый уровень
606. Как измерять throughput корректно?
607. Почему короткие тесты часто дают ложные выводы о throughput?
608. Как slow start и handshake искажают результаты коротких тестов?
609. Как iperf-подобные тесты отличаются от реальной нагрузки?
610. Как оценить throughput на уровне приложения, а не только сокета?
611. Почему bytes written в сокет не равны bytes delivered peer application?
612. Как TLS/QUIC encryption overhead влияет на throughput?
613. Как NUMA / CPU affinity / IRQ affinity влияют на throughput?
614. Как batching syscalls повышает throughput?
615. Как sendfile/splice/io_uring могут влиять на throughput?
616. Какие perf counters и system metrics полезны при анализе throughput?
617. Как понять, bottleneck в сети, ядре, приложении или удалённой стороне?
618. Когда имеет смысл жертвовать throughput ради latency?
619. Когда высокий throughput — ложная цель для приложения?
620. Как проектировать C/C++ сервис для стабильного throughput под нагрузкой?

---

## 14. Сквозные вопросы по TCP/UDP/QUIC

### Сравнение протоколов
621. Когда выбрать TCP, когда UDP, когда QUIC?
622. Почему QUIC не является просто "UDP с шифрованием"?
623. Почему TCP всё ещё доминирует во многих системах?
624. Когда custom protocol поверх UDP оправдан, а когда нет?
625. Когда HTTP/3 реально даёт выигрыш?
626. Какие ограничения у TCP в современных web/mobile сценариях?
627. Когда UDP — плохой выбор, даже если нужна низкая latency?
628. Как NAT/firewall влияет на TCP, UDP и QUIC по-разному?
629. Какие протоколы проще отлаживать в production?
630. Какие протоколы проще масштабировать?

### C/C++ / Linux / sockets
631. Как реализовать простой TCP echo server на C?
632. Как реализовать UDP echo server на C?
633. Как реализовать event-driven TCP server на epoll?
634. Как реализовать timeout для TCP клиента?
635. Как реализовать timeout для UDP запроса?
636. Как обрабатывать partial reads/writes корректно?
637. Как проектировать framing protocol поверх TCP?
638. Почему length-prefixed framing часто лучше "читать до разделителя"?
639. Какие проблемы возникают при смешивании network I/O и business logic в одном потоке?
640. Как устроить backpressure-aware архитектуру сервера?
641. Как логировать transport-level ошибки полезно для отладки?
642. Какие errno чаще всего важны в transport-layer коде?
643. Как корректно обрабатывать `EINTR`, `EPIPE`, `ECONNRESET`, `ETIMEDOUT`, `ECONNREFUSED`?
644. Как не спутать EOF, timeout и temporary unavailability?
645. Как тестировать transport-level код под loss, delay и reordering?

### Диагностика и эксплуатация
646. Как понять, проблема в handshake, congestion, flow control или приложении?
647. Как отличить packet loss от slow receiver?
648. Как отличить network bottleneck от CPU bottleneck?
649. Какие графики и метрики нужны для transport-level observability?
650. Как packet captures сочетаются с application logs при разборе инцидента?
651. Как воспроизводить transport проблемы в lab/CI среде?
652. Как network emulation помогает тестировать TCP/UDP/QUIC?
653. Какие tc/netem сценарии полезны для интервью и практики?
654. Как transport-layer метрики использовать при capacity planning?
655. Что обязан понимать senior C/C++ network developer про transport layer глубоко, а что можно знать обзорно?