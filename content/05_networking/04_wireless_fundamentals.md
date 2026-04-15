# Вопросы: Wireless Fundamentals (с уклоном в C/C++ и сетевую инженерию)

## 1. Основы радиосвязи: частоты и спектр

### Базовый уровень
1. Что такое радиосвязь?
2. Чем беспроводная передача данных принципиально отличается от проводной?
3. Что такое электромагнитная волна?
4. Что такое частота сигнала?
5. В каких единицах измеряется частота?
6. Что такое герц, килогерц, мегагерц, гигагерц?
7. Что такое длина волны?
8. Как связаны частота и длина волны?
9. Почему более высокая частота соответствует меньшей длине волны?
10. Что такое радиоспектр?
11. Почему спектр считается ограниченным ресурсом?
12. Что такое полоса частот?
13. Что такое канал в беспроводной связи?
14. Чем частота отличается от канала?
15. Что такое несущая частота?
16. Что такое baseband и passband?
17. Что значит “модулировать” сигнал?
18. Зачем нужна модуляция?
19. Какие типы модуляции ты знаешь на базовом уровне?
20. Что такое мощность передатчика?
21. В каких единицах обычно измеряют мощность в радиосвязи?
22. Что такое dB?
23. Что такое dBm?
24. Чем dB отличается от dBm?
25. Почему в радиосвязи часто используют логарифмические единицы?
26. Что такое спектральная маска?
27. Что такое лицензируемый спектр?
28. Что такое нелицензируемый спектр?
29. Какие плюсы и минусы у нелицензируемого спектра?
30. Почему спектр в мобильных сетях строго регулируется?

### Средний уровень
31. Какие диапазоны частот чаще используются для wireless communication?
32. Почему низкие частоты распространяются дальше?
33. Почему высокие частоты обычно дают большую ёмкость, но меньший радиус покрытия?
34. Что такое sub-1 GHz диапазоны?
35. Что такое mid-band?
36. Что такое high-band / mmWave?
37. Почему mmWave требует более плотного размещения базовых станций?
38. Что такое channel bandwidth?
39. Чем wider channel может быть полезен?
40. Почему более широкая полоса не всегда даёт линейный рост скорости?
41. Что такое guard band?
42. Зачем нужны guard bands между каналами?
43. Что такое center frequency?
44. Что такое adjacent channel?
45. Что такое co-channel использование спектра?
46. Почему повторное использование частот важно для cellular networks?
47. Что такое frequency reuse?
48. Почему reuse factor влияет на interference?
49. Что такое uplink frequency и downlink frequency?
50. Почему uplink и downlink могут использовать разные частоты?
51. Что такое paired spectrum?
52. Что такое unpaired spectrum?
53. Чем спектр для FDD отличается от спектра для TDD?
54. Что такое channelization?
55. Как регулятор распределяет спектр между операторами?
56. Почему спектр — ключевой актив мобильного оператора?
57. Что такое effective isotropic radiated power (EIRP)?
58. Почему антенна влияет на эффективную излучаемую мощность?
59. Что такое antenna gain?
60. Как частота влияет на проникновение сигнала внутрь зданий?

### Продвинутый уровень
61. Как частотный диапазон влияет на link budget?
62. Что такое free-space path loss?
63. Почему path loss растёт с частотой?
64. Как частота влияет на diffraction?
65. Почему низкие частоты лучше обходят препятствия?
66. Как частота влияет на penetration loss?
67. Что такое spectrum efficiency?
68. В каких единицах измеряют спектральную эффективность?
69. Что такое bits/s/Hz?
70. Почему спектральная эффективность — один из ключевых KPI радиосистем?
71. Как modulation order связан со спектральной эффективностью?
72. Почему рост modulation order требует лучшего качества канала?
73. Что такое carrier aggregation на концептуальном уровне?
74. Зачем объединять несколько полос частот?
75. Чем spectrum fragmentation усложняет проектирование системы?
76. Как регуляторные ограничения влияют на архитектуру радио-сети?
77. Что такое DFS в беспроводных системах общего назначения?
78. Почему coexistence в общем спектре — сложная инженерная задача?
79. Что такое out-of-band emissions?
80. Почему filtering важно для передатчика и приёмника?
81. Что такое oscillator accuracy и почему она важна?
82. Что такое frequency offset?
83. Как frequency offset влияет на приём сигнала?
84. Что такое phase noise?
85. Почему phase noise важен для высокочастотных и широкополосных систем?
86. Как ADC/DAC ограничения влияют на работу радиотракта?
87. Что такое sampling rate в SDR/радиосистемах?
88. Как Nyquist criterion связан с обработкой радиосигналов?
89. Почему RF front-end критичен для качества канала?
90. Какие части радиотракта разработчику сетевых систем стоит понимать хотя бы концептуально?

### Инженерные вопросы
91. Почему выбор частотного диапазона — это компромисс между покрытием и ёмкостью?
92. Когда оператору выгоднее низкий диапазон, а когда высокий?
93. Почему для indoor coverage и rural coverage могут требоваться разные диапазоны?
94. Как спектральные ограничения влияют на achievable throughput в системе?
95. Какие trade-offs между coverage, capacity и cost возникают при проектировании radio network?

---

## 2. Signal / Noise / SNR

### Базовый уровень
96. Что такое signal в контексте радиосвязи?
97. Что такое noise?
98. Какие бывают источники шума?
99. Что такое thermal noise?
100. Почему шум неизбежен в любой системе связи?
101. Что такое signal power?
102. Что такое noise power?
103. Что такое SNR?
104. Как расшифровывается SNR?
105. Почему SNR важен для качества связи?
106. Чем высокий SNR отличается от низкого SNR?
107. Почему при низком SNR декодирование сигнала ухудшается?
108. В каких единицах обычно выражают SNR?
109. Что означает SNR в dB?
110. Почему SNR часто удобнее анализировать в dB, а не в линейной шкале?
111. Что такое noise floor?
112. Почему сигнал должен быть выше noise floor?
113. Что происходит, если сигнал сравним с noise floor?
114. Как шум влияет на вероятность ошибок?
115. Почему SNR связан с achievable data rate?

### Средний уровень
116. Как измеряется received signal strength?
117. Что такое RSSI?
118. Чем RSSI отличается от SNR?
119. Может ли высокий RSSI сопровождаться плохим качеством канала?
120. Почему сильный сигнал не всегда означает хороший link?
121. Что такое RSRP на концептуальном уровне?
122. Что такое RSRQ на концептуальном уровне?
123. Чем метрики уровня сигнала отличаются от метрик качества сигнала?
124. Как noise floor зависит от bandwidth?
125. Почему увеличение bandwidth увеличивает шумовую мощность?
126. Что такое Shannon capacity на концептуальном уровне?
127. Как SNR влияет на теоретическую пропускную способность канала?
128. Почему система с низким SNR вынуждена использовать более устойчивую модуляцию?
129. Как coding gain помогает при плохом SNR?
130. Что такое BER?
131. Что такое BLER?
132. Как SNR влияет на BER/BLER?
133. Почему link adaptation опирается на качество канала?
134. Что такое CQI в общем смысле?
135. Почему при плохом SNR система понижает modulation and coding scheme?
136. Что такое dynamic range приёмника?
137. Почему слишком сильный сигнал тоже может быть проблемой?
138. Что такое receiver saturation?
139. Что такое AGC?
140. Зачем нужен automatic gain control?
141. Как SNR меняется при движении пользователя?
142. Как SNR влияет на latency и retransmissions?
143. Почему плохой SNR обычно снижает throughput?
144. Как SNR проявляется в логах/метриках radio stack?

### Продвинутый уровень
145. Чем SNR отличается от SINR?
146. Почему в реальных сетях часто важнее SINR, а не просто SNR?
147. Что такое interference-plus-noise?
148. Как noise figure приёмника влияет на итоговое качество?
149. Что такое link budget и где в нём учитывается SNR?
150. Как path loss и antenna gain влияют на SNR?
151. Почему coding и interleaving позволяют работать при более низком SNR?
152. Что такое Eb/N0?
153. Чем Eb/N0 отличается от SNR?
154. В каких случаях Eb/N0 полезнее для анализа?
155. Как SNR влияет на выбор modulation order: QPSK, 16QAM, 64QAM, 256QAM?
156. Почему higher-order modulation чувствительнее к noise?
157. Что такое constellation diagram?
158. Как по constellation diagram оценить влияние noise?
159. Что такое soft decision decoding?
160. Почему качественная оценка канала важна для scheduler?
161. Как fast-varying SNR усложняет link adaptation?
162. Что такое estimation error качества канала?
163. Как ошибки измерения SNR влияют на throughput?
164. Почему overestimation SNR приводит к росту ошибок?
165. Почему underestimation SNR приводит к консервативному использованию канала?
166. Как SNR измеряют в SDR / лабораторных стендах?
167. Как фильтрация и averaging влияют на измерения канала?
168. Какие метрики кроме SNR важны для оценки radio link quality?
169. Как приложение верхнего уровня косвенно "чувствует" плохой SNR?
170. Как плохой SNR проявляется в transport-layer метриках?

### Инженерные вопросы
171. Почему нельзя судить о качестве wireless link только по уровню сигнала?
172. Почему для production monitoring одной RSSI-метрики недостаточно?
173. Как плохой SNR проявится для TCP и для UDP приложений по-разному?
174. Почему radio-quality метрики важно связывать с packet loss, latency и retransmissions?
175. Какие практические метрики качества канала должен понимать network/software engineer?

---

## 3. Interference

### Базовый уровень
176. Что такое interference в беспроводной связи?
177. Почему interference возникает в shared medium?
178. Чем interference отличается от noise?
179. Почему interference часто опаснее простого thermal noise?
180. Что такое co-channel interference?
181. Что такое adjacent-channel interference?
182. Почему соседние каналы могут мешать друг другу?
183. Что происходит, если два передатчика используют один и тот же частотный ресурс?
184. Почему interference снижает качество приёма?
185. Как interference влияет на error rate?
186. Как interference влияет на throughput?
187. Как interference влияет на latency?
188. Почему interference особенно важно в dense deployments?
189. Что такое self-interference на концептуальном уровне?
190. Почему interference — ключевая проблема cellular systems?

### Средний уровень
191. Как interference влияет на SINR?
192. Почему SINR часто важнее SNR?
193. Что такое inter-cell interference?
194. Что такое intra-cell interference в широком смысле?
195. Почему frequency reuse увеличивает interference risk?
196. Как плотность базовых станций влияет на interference?
197. Почему reuse spectrum повышает ёмкость и одновременно риск деградации качества?
198. Что такое interference coordination?
199. Что такое power control и как он помогает против interference?
200. Почему слишком высокая мощность передачи может ухудшать общую систему?
201. Что такое hidden node problem?
202. В каких системах hidden node особенно заметен?
203. Что такое exposed node problem?
204. Почему scheduling помогает уменьшать interference?
205. Как beamforming помогает снизить interference?
206. Почему directional transmission полезен для spatial reuse?
207. Как duplex mode влияет на interference pattern?
208. Что такое uplink interference?
209. Что такое downlink interference?
210. Почему соседние соты могут ухудшать качество друг другу?
211. Как overlap coverage влияет на interference?
212. Что такое pilot pollution на концептуальном уровне?
213. Почему multi-user environments особенно сложны с точки зрения interference?
214. Как mobility влияет на interference profile?
215. Почему indoor deployments часто страдают от сложного interference environment?

### Продвинутый уровень
216. Как interference учитывается в radio resource management?
217. Что такое ICIC/eICIC/CoMP на концептуальном уровне?
218. Как fractional frequency reuse снижает interference?
219. Как time-domain coordination может уменьшать interference?
220. Что такое almost blank subframes на концептуальном уровне?
221. Почему TDD systems требуют более аккуратной синхронизации с точки зрения interference?
222. Что такое cross-link interference?
223. Почему uplink/downlink asymmetry усложняет interference management?
224. Как imperfect filtering вызывает adjacent-channel leakage?
225. Что такое ACLR?
226. Что такое receiver selectivity?
227. Как non-linearities PA могут усиливать interference issues?
228. Что такое intermodulation distortion?
229. Как front-end design влияет на устойчивость к interference?
230. Как interference проявляется в KPI радиосети?
231. Как interference проявляется для приложений: packet loss, jitter, retransmissions?
232. Как отличить плохой SNR из-за path loss от плохого SINR из-за interference?
233. Какие измерения нужны для root-cause analysis interference?
234. Как drive test / field test помогает выявлять interference hotspots?
235. Почему interference может быть локальной, временной и трудно воспроизводимой проблемой?
236. Как software scheduler адаптируется к interference fluctuations?
237. Как MIMO помогает бороться с interference?
238. Как spatial multiplexing и interference cancellation связаны между собой?
239. Какие ограничения есть у interference mitigation algorithms в реальных системах?
240. Что обязан понимать software/network engineer про interference, даже если он не RF specialist?

### Инженерные вопросы
241. Почему interference management так же важно, как и мощность передатчика?
242. Почему “просто увеличить мощность” часто ухудшает сеть?
243. Как interference влияет на транспортный уровень и perceived application quality?
244. Какие operational признаки указывают именно на interference, а не на обычный weak coverage?
245. Какие trade-offs между reuse, capacity и interference критичны для wireless systems?

---

## 4. Multipath propagation

### Базовый уровень
246. Что такое multipath propagation?
247. Почему радиосигнал может приходить к приёмнику по нескольким путям?
248. Какие объекты вызывают multipath?
249. Что такое reflection?
250. Что такое diffraction?
251. Что такое scattering?
252. Почему здания и стены создают multipath?
253. Почему вода, металл и стекло заметно влияют на отражение сигнала?
254. Что значит, что один и тот же сигнал приходит с разной задержкой?
255. Почему multipath может как помогать, так и мешать?
256. Что такое direct path?
257. Что такое line-of-sight (LOS)?
258. Что такое non-line-of-sight (NLOS)?
259. Почему NLOS обычно усложняет приём?
260. Что такое delay spread?

### Средний уровень
261. Как multipath влияет на качество сигнала?
262. Что такое constructive interference?
263. Что такое destructive interference?
264. Почему разные копии сигнала могут складываться или вычитаться?
265. Как delay spread связан с межсимвольной интерференцией?
266. Что такое inter-symbol interference (ISI)?
267. Почему ISI ухудшает декодирование?
268. Как symbol duration влияет на чувствительность к multipath?
269. Почему wideband systems особенно чувствительны к delay spread?
270. Как OFDM помогает бороться с multipath?
271. Что такое cyclic prefix?
272. Зачем нужен cyclic prefix в OFDM?
273. Почему слишком большой delay spread может ломать orthogonality поднесущих?
274. Как mobility влияет на multipath picture?
275. Почему в городе multipath обычно сильнее, чем на открытой местности?
276. Почему indoor и urban canyon среды сложны для радиосвязи?
277. Как антенны влияют на использование multipath?
278. Почему MIMO может извлекать пользу из multipath?
279. Как spatial diversity помогает при multipath?
280. Почему при движении пользователя качество может резко меняться даже на малых расстояниях?
281. Что такое small-scale variation канала?
282. Как multipath влияет на packet error rate?
283. Как multipath косвенно влияет на throughput?
284. Как multipath проявляется в измерениях канала?
285. Какие сценарии особенно тяжёлые с точки зрения multipath?

### Продвинутый уровень
286. Что такое channel impulse response?
287. Как channel impulse response описывает multipath environment?
288. Что такое coherence bandwidth?
289. Как coherence bandwidth связана с delay spread?
290. Почему frequency-selective fading возникает из-за multipath?
291. Что такое flat fading?
292. Чем flat fading отличается от frequency-selective fading?
293. Как эквалайзер помогает бороться с multipath distortions?
294. Почему OFDM снижает сложность equalization?
295. Что такое rake receiver на концептуальном уровне?
296. Как CDMA-системы использовали multipath constructively?
297. Как path delays оцениваются на приёмнике?
298. Что такое channel estimation?
299. Почему pilot/reference signals критичны для channel estimation?
300. Как ошибки channel estimation ухудшают работу системы?
301. Что такое Doppler spread?
302. Как Doppler spread и multipath вместе усложняют приём?
303. Что такое coherence time?
304. Почему fast-changing multipath требует быстрой адаптации?
305. Как beamforming взаимодействует с multipath environment?
306. Почему reflected paths могут использоваться как полезный ресурс?
307. Какие ограничения есть у MIMO gains в poor scattering и rich scattering средах?
308. Как измеряют multipath и delay spread в полевых испытаниях?
309. Как multipath отражается на higher-level KPI: retransmissions, jitter, goodput?
310. Как software engineer может косвенно распознать multipath-проблему по системным метрикам?

### Инженерные вопросы
311. Почему multipath нельзя рассматривать только как “помеху”?
312. Когда multipath помогает, а когда разрушает связь?
313. Почему OFDM и MIMO считаются фундаментально важными для современных wireless systems?
314. Как urban / indoor deployment меняет требования к PHY/MAC design?
315. Что из multipath propagation должен понимать разработчик transport/network software?

---

## 5. Fading

### Базовый уровень
316. Что такое fading?
317. Чем fading отличается от path loss?
318. Почему fading может происходить даже при фиксированном среднем уровне сигнала?
319. Что такое large-scale fading?
320. Что такое small-scale fading?
321. Чем shadowing отличается от fast fading?
322. Что такое shadow fading?
323. Какие объекты вызывают shadowing?
324. Что такое fast fading?
325. Почему fast fading может меняться на очень малых расстояниях?
326. Как fading влияет на качество канала?
327. Почему fading может вызывать резкие провалы уровня сигнала?
328. Почему движение пользователя усиливает проблему fading?
329. Как fading влияет на BER/BLER?
330. Как fading влияет на throughput?

### Средний уровень
331. Чем Rayleigh fading отличается от Rician fading?
332. В каких условиях ожидается Rayleigh fading?
333. В каких условиях ожидается Rician fading?
334. Что такое K-factor в Rician fading?
335. Почему наличие сильного LOS-компонента меняет статистику канала?
336. Что такое frequency-selective fading?
337. Что такое flat fading?
338. Что такое time-selective fading?
339. Как Doppler effect связан с fading?
340. Почему высокая скорость пользователя усложняет поддержание стабильного link?
341. Что такое coherence time?
342. Как coherence time влияет на scheduler и link adaptation?
343. Почему deep fades опасны для real-time traffic?
344. Как diversity помогает бороться с fading?
345. Что такое time diversity?
346. Что такое frequency diversity?
347. Что такое spatial diversity?
348. Как interleaving помогает бороться с fading?
349. Как coding помогает переживать глубокие fades?
350. Почему HARQ связан с борьбой против fading effects?
351. Как fading проявляется для TCP потока?
352. Как fading проявляется для UDP real-time трафика?
353. Почему fading может выглядеть как случайный packet loss?
354. Как отличить fading от обычной перегрузки сети?
355. Какие radio KPI особенно чувствительны к fading?

### Продвинутый уровень
356. Как autocorrelation канала связана с fading?
357. Что такое Doppler spectrum?
358. Почему Jakes model упоминают в контексте fading?
359. Как fast fading влияет на channel estimation?
360. Почему stale channel state information приводит к плохому выбору MCS?
361. Как fading влияет на HARQ retransmission pattern?
362. Что такое outage probability?
363. Как outage probability связана с fading statistics?
364. Почему link adaptation должна быть консервативной при быстро меняющемся канале?
365. Как scheduler использует multi-user diversity?
366. Почему opportunistic scheduling выигрывает в fading environments?
367. Что такое channel hardening на концептуальном уровне?
368. Как massive MIMO меняет влияние fading?
369. Как beamforming снижает impact fading?
370. Почему shadowing и multipath fading требуют разных mitigation techniques?
371. Как fading измеряют в реальных полевых тестах?
372. Как fading отражается в trace/log данных радиосистемы?
373. Какие higher-layer симптомы возникают при сильном fading: spikes RTT, retransmissions, jitter?
374. Как application telemetry может косвенно свидетельствовать о fading?
375. Почему wireless fading делает интерпретацию transport-layer проблем сложнее?

### Инженерные вопросы
376. Почему fading — одна из главных причин непредсказуемости wireless links?
377. Как fading меняет требования к congestion control и retry strategy?
378. Почему статистическая природа wireless канала важна для проектирования протоколов?
379. Что должен понимать C/C++ разработчик сетевого ПО про fading, даже без глубокого DSP background?
380. Какие practical mitigations чаще всего применяют против fading на уровне системы?

---

## 6. Bandwidth vs throughput

### Базовый уровень
381. Что такое bandwidth в беспроводной связи?
382. Что такое throughput?
383. Чем bandwidth отличается от throughput?
384. Почему высокая bandwidth не гарантирует высокий throughput?
385. В каких единицах измеряют bandwidth?
386. В каких единицах измеряют throughput?
387. Почему throughput всегда меньше теоретического максимума?
388. Что такое peak data rate?
389. Что такое user throughput?
390. Что такое cell throughput?
391. Что такое spectral efficiency и как она связана с throughput?
392. Почему overhead уменьшает полезную скорость?
393. Какие виды overhead есть в беспроводных системах?
394. Как control signaling уменьшает полезный throughput?
395. Почему retransmissions снижают effective throughput?

### Средний уровень
396. Как качество радиоканала влияет на throughput?
397. Почему плохой SNR/SINR уменьшает throughput даже при той же полосе?
398. Как modulation and coding scheme влияет на throughput?
399. Почему scheduler влияет на throughput каждого пользователя?
400. Как число пользователей в соте влияет на throughput одного пользователя?
401. Почему shared medium означает деление ресурсов между пользователями?
402. Как interference снижает achievable throughput?
403. Как packet loss и HARQ влияют на goodput?
404. Почему TCP throughput в wireless среде может сильно колебаться?
405. Как RTT влияет на TCP throughput?
406. Почему небольшая полоса с хорошим качеством канала может давать лучший throughput, чем широкая полоса с плохим каналом?
407. Что такое resource blocks на концептуальном уровне?
408. Как количество доступных radio resources влияет на скорость?
409. Как carrier aggregation влияет на throughput?
410. Почему throughput зависит не только от PHY, но и от scheduler/MAC/RLC/transport?
411. Как duplex mode влияет на доступные ресурсы uplink/downlink?
412. Почему application throughput может быть ниже transport throughput?
413. Что такое goodput?
414. Чем goodput отличается от throughput?
415. Какие метрики лучше использовать для реального пользовательского опыта?

### Продвинутый уровень
416. Как Shannon limit задаёт верхнюю теоретическую границу throughput?
417. Почему реальные системы далеки от Shannon limit?
418. Как link adaptation балансирует между надёжностью и throughput?
419. Как CQI inaccuracies уменьшают throughput?
420. Что такое scheduler fairness vs max-throughput trade-off?
421. Почему round-robin scheduler и throughput-optimal scheduler дают разный пользовательский опыт?
422. Как HARQ combining влияет на итоговый goodput?
423. Что такое BLER target и почему он влияет на throughput?
424. Почему слишком консервативный MCS снижает throughput?
425. Почему слишком агрессивный MCS увеличивает retransmissions и тоже снижает throughput?
426. Как buffer status и traffic pattern приложения влияют на radio throughput?
427. Что такое bursty traffic и как оно влияет на измерения throughput?
428. Почему короткие тесты throughput могут быть нерепрезентативны?
429. Как mobility влияет на стабильность throughput?
430. Почему indoor penetration loss может резко ухудшать throughput?
431. Как background traffic в соте влияет на measured throughput?
432. Как protocol stack overhead влияет на end-to-end goodput?
433. Как CPU/device limitations пользователя ограничивают throughput?
434. Как transport protocol choice (TCP vs QUIC vs UDP) влияет на perceived throughput?
435. Как правильно интерпретировать “speed test” результаты в wireless сети?

### Инженерные вопросы
436. Почему “шире канал” не равно “быстрее для пользователя”?
437. Какие bottlenecks чаще ограничивают throughput в реальной wireless системе?
438. Как связать radio metrics с transport/application throughput?
439. Почему для troubleshooting важно различать PHY rate, MAC throughput и application goodput?
440. Какие вопросы про bandwidth vs throughput особенно важны для interview network/software engineer?

---

## 7. Duplex (FDD / TDD)

### Базовый уровень
441. Что такое duplex в системах связи?
442. Почему системе нужен duplex mode?
443. Чем simplex отличается от half-duplex?
444. Чем half-duplex отличается от full-duplex?
445. Что такое FDD?
446. Что такое TDD?
447. Как расшифровывается FDD?
448. Как расшифровывается TDD?
449. В чём базовая идея FDD?
450. В чём базовая идея TDD?
451. Почему FDD использует разные частоты для uplink и downlink?
452. Почему TDD использует одну полосу частот, но делит её по времени?
453. Что такое paired spectrum для FDD?
454. Что такое unpaired spectrum для TDD?
455. Почему FDD требует парного спектра?
456. Почему TDD удобен при непарном спектре?
457. Как duplex mode влияет на uplink/downlink передачу?
458. Почему выбор duplex mode важен для проектирования сети?
459. Где исторически чаще использовался FDD?
460. Где TDD особенно полезен?

### Средний уровень
461. Какие преимущества у FDD?
462. Какие недостатки у FDD?
463. Какие преимущества у TDD?
464. Какие недостатки у TDD?
465. Почему FDD даёт естественное одновременное разделение uplink и downlink?
466. Почему TDD гибче распределяет ресурсы между uplink и downlink?
467. Когда TDD особенно выгоден из-за асимметричного трафика?
468. Почему современные data workloads часто asymmetric?
469. Как TDD может выделять больше времени под downlink?
470. Что такое DL/UL slot configuration?
471. Почему TDD требует точной синхронизации между сотами?
472. Что такое guard period в TDD?
473. Зачем нужен guard period?
474. Что такое cross-link interference в TDD?
475. Почему соседние TDD сети должны координироваться?
476. Как mobility влияет на выбор duplex strategy?
477. Почему uplink coverage может быть ограничивающим фактором?
478. Почему FDD иногда удобнее с точки зрения coverage symmetry?
479. Как latency связана с TDD frame structure?
480. Почему в TDD uplink packet иногда ждёт следующего uplink slot?
481. Как frame configuration влияет на round-trip latency?
482. Почему TDD может иметь другой latency profile по сравнению с FDD?
483. Как duplex mode влияет на throughput uplink и downlink?
484. Как scheduler учитывает duplex constraints?
485. Какие operational сложности вносят разные duplex modes?

### Продвинутый уровень
486. Как duplex mode влияет на HARQ timing?
487. Почему TDD усложняет планирование retransmissions?
488. Как TDD влияет на beamforming и reciprocity assumptions?
489. Что такое channel reciprocity и почему она полезна для TDD?
490. Почему reciprocity в TDD требует калибровки RF chains?
491. Почему FDD сложнее использует reciprocity для downlink beamforming?
492. Как duplex mode влияет на reference signals и channel estimation?
493. Почему TDD-конфигурации особенно важны для dense deployments?
494. Как unsynchronized TDD systems создают severe interference?
495. Как duplex mode влияет на QoS и traffic engineering?
496. Как uplink-heavy приложения ведут себя в downlink-optimized TDD конфигурации?
497. Какие trade-offs между latency, throughput и flexibility возникают в TDD?
498. Как выбор duplex mode связан с доступным спектром у оператора?
499. Почему некоторые диапазоны почти всегда ассоциируются с TDD, а другие с FDD?
500. Что такое dynamic TDD на концептуальном уровне?
501. Какие преимущества dynamic TDD?
502. Какие проблемы возникают у dynamic TDD из-за interference?
503. Как duplex mode отражается в end-to-end поведении TCP/UDP flows?
504. Как software/network engineer может косвенно заметить влияние duplex configuration по метрикам?
505. Какие practical ограничения full-duplex radio пока сдерживают его широкое применение?

### Инженерные вопросы
506. Когда FDD архитектурно предпочтительнее TDD?
507. Когда TDD даёт наибольший выигрыш?
508. Почему выбор duplex mode нельзя делать без учёта traffic asymmetry?
509. Как duplex mode влияет на user experience для download-heavy и uplink-heavy приложений?
510. Что должен понимать software/network engineer про FDD/TDD, чтобы корректно интерпретировать сетевые проблемы?

---

## 8. Сквозные вопросы по Wireless Fundamentals

### Сравнение и связи между темами
511. Как частота влияет на coverage, penetration и throughput одновременно?
512. Как SNR, SINR, interference и fading связаны между собой?
513. Почему strong signal не гарантирует high throughput?
514. Как multipath связан с fading?
515. Почему bandwidth, quality of channel и scheduler нельзя анализировать по отдельности?
516. Как duplex mode влияет на latency, throughput и interference?
517. Почему wireless link fundamentally менее предсказуем, чем wired link?
518. Какие из wireless-проблем чаще всего проявляются как packet loss на transport layer?
519. Какие проблемы чаще проявляются как jitter spikes?
520. Какие проблемы чаще проявляются как снижение throughput без полного обрыва связи?

### Практика и диагностика
521. Как понять, что проблема вызвана weak coverage, а не interference?
522. Как понять, что проблема вызвана interference, а не просто высокой нагрузкой?
523. Как понять, что причина деградации — fading из-за mobility?
524. Почему одна и та же точка в помещении может иметь резко разное качество связи при смещении на полметра?
525. Почему wireless проблемы часто интермиттирующие?
526. Какие radio metrics полезно коррелировать с TCP retransmissions?
527. Какие radio metrics полезно коррелировать с UDP jitter?
528. Почему application logs без radio metrics часто недостаточны?
529. Как packet captures помогают, а в чём их ограничения для wireless troubleshooting?
530. Какие измерения нужны для end-to-end анализа wireless performance?

### C/C++ / systems / observability
531. Что должен понимать C/C++ разработчик сетевых сервисов о беспроводной среде, даже если он не пишет PHY/MAC код?
532. Почему transport-layer таймауты в mobile/wireless среде должны настраиваться осторожнее?
533. Как variability wireless link влияет на retry logic приложения?
534. Почему aggressive retransmission policy приложения может ухудшить ситуацию в radio сети?
535. Как jitter и variable throughput влияют на design real-time приложения?
536. Как адаптировать bitrate/packetization к wireless conditions?
537. Почему congestion control, рассчитанный на wired loss, может вести себя неоптимально в wireless?
538. Как observability stack должен учитывать radio metrics?
539. Какие метрики стоит логировать в клиентском приложении, работающем по wireless link?
540. Какие anti-patterns возникают, когда software engineer игнорирует природу wireless канала?

### Архитектурные вопросы
541. Почему wireless networking нельзя понимать только через классический TCP/IP стек?
542. Почему PHY/MAC особенности напрямую влияют на поведение transport и application layer?
543. Какие компромиссы между coverage, capacity, reliability и cost лежат в основе всех wireless систем?
544. Почему современный network/software engineer должен понимать хотя бы основы радиосвязи?
545. Какие темы из Wireless Fundamentals особенно важны как база перед LTE/NR?
546. Что важнее понять сначала: частоты, SNR, interference или scheduling?
547. Какой минимальный набор wireless fundamentals обязателен для interview в networking/mobile systems?
548. Какие темы стоит изучать дальше после Wireless Fundamentals: LTE, NR, Wi-Fi MAC, MIMO, scheduler, HARQ?
549. Как связать Wireless Fundamentals с практикой сетевого программирования на C/C++?
550. Что из Wireless Fundamentals нужно знать глубоко, а что достаточно понимать на уровне инженерной интуиции?