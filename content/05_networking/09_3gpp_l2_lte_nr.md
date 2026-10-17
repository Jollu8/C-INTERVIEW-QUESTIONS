# 3GPP L2 LTE/NR: вопросы и ответы для разработчика eNB/gNB

Материал ориентирован на **сетевую сторону: scheduler и стек eNB/gNB**. Здесь 160 вопросов: от архитектуры MAC/RLC/PDCP/SDAP до реализации на C/C++, диагностики и проверки real-time поведения. UE-процедуры рассматриваются там, где они определяют наблюдаемое сетью поведение и допустимые scheduling decisions.

**Базовая линия:** LTE/NR Release 17. Для основных протоколов ниже указаны конкретные редакции TS; это выбранная учебная база, а не утверждение о последних версиях. Для дополнительных документов ссылки ведут на карточки 3GPP: при реализации следует выбрать согласованную редакцию своего release. Поддержка отдельных возможностей зависит от UE capabilities и RRC configuration. NTN, sidelink и IAB не разобраны как самостоятельные стеки.

**Как читать ответы:** требования формата и процедур относятся к 3GPP; PF/OLLA, partitioning потоков, pools, generation handles и replay — инженерные решения реализации. Псевдокод и схемы иллюстрируют принцип и не заменяют нормативные state machines. Примеры budget помечены как условные, когда не являются wire-format vectors.

Связанные темы: [LTE основы](./05_lte.md), [NR основы](./06_nr.md), [Transport](./03_transport_layer.md), [Troubleshooting](./08_troubleshooting_and_practice.md).

## Карта спецификаций

| Область | LTE | NR / 5GS |
| --- | --- | --- |
| MAC | TS 36.321 | TS 38.321 |
| RLC | TS 36.322 | TS 38.322 |
| PDCP | TS 36.323; зависит от bearer architecture | TS 38.323 |
| SDAP / QoS | EPS имеет собственную QoS модель | TS 37.324 / TS 23.501 |
| PHY procedures | TS 36.213 | TS 38.213 / TS 38.214 |
| Архитектура / CU–DU | TS 36.300 | TS 38.300 / TS 38.401 / TS 38.425 |

## Навигация по вопросам

- **1–10:** Архитектура L2 и контракты eNB/gNB
- **11–20:** Время, numerology и граница MAC–PHY
- **21–30:** Основы политики scheduler, fairness и admission
- **31–40:** Downlink scheduling, link adaptation и control resources
- **41–50:** Uplink: BSR, SR, PHR и оценка demand
- **51–60:** HARQ: процессы, feedback и владение transport block
- **61–70:** MAC PDU: форматы, бюджет и безопасный parser
- **71–80:** Random access, DRX и служебные процедуры
- **81–90:** RLC: режимы, segmentation и sequence space
- **91–100:** RLC AM: polling, STATUS и retransmission
- **101–110:** PDCP: COUNT, security, reordering и duplication
- **111–120:** SDAP, QoS и scheduler policy
- **121–130:** CA, dual connectivity, mobility и CU/DU
- **131–140:** C/C++ реализация L2: ownership, concurrency и bounded state
- **141–150:** Проверка correctness и real-time performance
- **151–160:** Практические разборы проблем eNB/gNB

## 1. Архитектура L2 и контракты eNB/gNB

1. Какие функции L2 нужно различать разработчику eNB/gNB?

   **Ответ:** MAC управляет multiplexing, HARQ и доступом к radio resources; RLC — режимом передачи, сегментацией и при AM восстановлением; PDCP — нумерацией, security и обработкой delivery/reordering по конфигурации. SDAP в 5GS связывает QoS flows с DRBs. Scheduler использует эти состояния, но его utility function не задаётся единственным обязательным алгоритмом 3GPP. Сбой соседнего слоя нельзя автоматически компенсировать выдачей большего числа PRB.

   **Пример:** DL: IP packet → SDAP → PDCP PDU → RLC SDU → RLC PDU → MAC SDU → transport block.

   ```text
   DL: IP → SDAP → PDCP → RLC → MAC → PHY
   UL: PHY → MAC demux → RLC reassembly → PDCP → SDAP → IP
   ```

   **Типичная ошибка:** Называть RLC retransmission и HARQ retransmission одной очередью повторов.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 37.324 V17.0.0: SDAP](https://www.etsi.org/deliver/etsi_ts/137300_137399/137324/17.00.00_60/ts_137324v170000p.pdf).

2. Чем SDU одного слоя отличается от PDU и почему это важно для byte accounting?

   **Ответ:** SDU — объект, полученный от верхнего слоя; PDU — результат обработки с заголовками/контрольными полями данного слоя. Один и тот же буфер может быть PDCP PDU и RLC SDU. В scheduler API нужно явно указывать, включает ли размер headers, retransmissions и control PDUs. Иначе сравнение RLC backlog с TBS систематически даёт неверный payload budget и ложные показатели throughput.

   **Пример:** PDCP PDU размером 1200 байт требует дополнительного RLC header и MAC subheader перед размещением в TB.

   **Типичная ошибка:** Считать размер IP packet равным необходимому TBS.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf).

3. Как различаются logical, transport и physical channels в задаче scheduler?

   **Ответ:** Logical channel описывает вид сервиса между RLC и MAC, transport channel — способ передачи между MAC и PHY, physical channel — конкретную передачу radio symbols. DRB/LCID не является отдельным PDSCH. Scheduler выбирает ресурсы TB, а MAC может объединить данные разных logical channels одного UE с разрешёнными control elements. Mapping должен соответствовать действующей radio configuration.

   **Пример:** Несколько DTCH LCIDs могут войти в один MAC PDU на DL-SCH/PDSCH.

   **Типичная ошибка:** Выделять каждому DRB собственный физический канал как обязательное правило стандарта.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.211: NR physical channels](https://www.3gpp.org/dynareport/38211.htm).

4. Что относится к нормативному поведению UE, а что — к политике network scheduler?

   **Ответ:** Спецификации определяют форматы, процедуры и ограничения: допустимые grants, HARQ, UE logical-channel prioritisation, reporting и timing. Выбор между eligible UEs, PF weights, оценка UL demand и admission/fairness policy обычно зависят от реализации сети. Network scheduler обязан выдавать конфигурационно допустимый план, но не должен выдавать собственную эвристику за единственный стандартный алгоритм.

   **Пример:** Два gNB могут использовать разные PF/QoS scores, сохраняя одинаковые air-interface rules.

   **Типичная ошибка:** Копировать UE LCP как полностью заданный стандартом алгоритм выбора UE в gNB.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf).

5. Где находятся PDCP, RLC и MAC при CU/DU split?

   **Ответ:** В типичной NG-RAN architecture SDAP/PDCP user plane находятся в gNB-CU-UP, RLC/MAC/PHY — в gNB-DU; control plane PDCP/RRC связан с CU-CP. F1-U связывает user-plane части, E1 — CU-CP и CU-UP. Поэтому scheduler DU видит свои RLC queues, а не мгновенную полную картину CU buffers. Архитектурный split и локальный thread model — разные уровни описания.

   **Пример:** CU-UP накопил трафик, но DU RLC empty: проверить F1-U delivery/flow control до изменения radio allocation.

   **Типичная ошибка:** Приравнивать отсутствие данных в DU к отсутствию offered traffic из core.

   **Источник:** [3GPP TS 38.401: NG-RAN architecture](https://www.3gpp.org/dynareport/38401.htm); [3GPP TS 38.425: NR user plane protocol](https://www.3gpp.org/dynareport/38425.htm).

6. Какие данные конфигурации RRC критичны для L2?

   **Ответ:** Bearer modes/SN sizes, LC/LCG mapping, QoS-related parameters, BWP, search spaces, time-domain allocations, HARQ feedback, SR/BSR/PHR и DRX. Нужно согласовать момент применения конфигурации с её lifecycle и завершением соответствующей процедуры. Частично обновлённый UE context создаёт комбинации параметров, которых UE никогда не получал. Полезны immutable snapshots и generation IDs — это инженерная техника, не обязательная структура 3GPP.

   **Пример:** Grant вычислен по новой BWP, а PHY request ещё содержит старую configuration generation.

   **Типичная ошибка:** Изменять shared context по одному полю во время выполнения scheduler.

   **Источник:** [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

7. Почему SRB и DRB требуют различной обработки?

   **Ответ:** SRBs переносят control-plane signaling, DRBs — пользовательские данные; у них разные протокольные и security contracts и часто разные latency/reliability требования. Control signaling нужно обслуживать так, чтобы не блокировать установление и reconfiguration, но точная policy не сводится к «всегда весь SRB раньше всех DRB». Следует учитывать RLC mode, доступный grant и нормативные приоритеты процедур.

   **Пример:** Забитая data queue не должна бесконечно задерживать RRC message, нужный для завершения reconfiguration.

   **Типичная ошибка:** Определять всю QoS policy только по проверке SRB/DRB без состояния процедуры.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf).

8. Почему RNTI нельзя использовать как вечный уникальный ключ UE context?

   **Ответ:** RNTI имеет scope и lifecycle; после release значение может использоваться повторно. Поздний CRC/HARQ callback со старым идентификатором способен повредить новый context. Engineering key должен учитывать cell/MAC entity, идентичность lifecycle и generation; при CA/DC добавляются нужные scopes. Это не новое поле air interface, а защита внутренней корреляции асинхронных событий.

   **Пример:** UE A с C-RNTI X удалён; поздний feedback не должен изменить UE B, которому позже выдали X.

   ```text
   Air identity: {cell_group, serving_cell, RNTI}
   Internal handle: {context_slot, generation}
   Late event must match both active scope and lifetime.
   ```

   **Типичная ошибка:** Хранить map<RNTI, pointer> без проверки generation и event epoch.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

9. Как различить radio bearer, RLC bearer, logical channel и LCG?

   **Ответ:** Radio bearer относится к услуге PDCP/RRC; RLC bearer связывает RLC entity с logical channel. LCID идентифицирует MAC-level содержимое в конкретном направлении/контексте, LCG агрегирует logical channels для UL buffer reporting. При DC/duplication один PDCP bearer может обслуживаться несколькими RLC entities. Для диагностики нужен явный mapping, а не предположение «один DRB = один индекс во всех массивах».

   **Пример:** BSR сообщает объём LCG, в котором могут находиться несколько LC с разными priorities.

   **Типичная ошибка:** Считать LCG самостоятельным PDCP bearer или QFI.

   **Источник:** [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf).

10. Как читать спецификации L2, чтобы не смешивать LTE, NR и разные releases?

   **Ответ:** Сначала фиксировать RAT, release, конкретную версию TS и RRC configuration. Затем сверять procedure, state variables, timer rules и PDU format, включая ссылки на PHY/security. Version 17.x не означает одну неизменную редакцию. В коде полезно отделять release-dependent feature checks от общих алгоритмов и сохранять источник assumptions. Примеры ниже — объяснения и модели, а не буквальное воспроизведение normative state machines.

   **Пример:** LTE RLC AM имеет 10- или 16-битную SN-конфигурацию в выбранной Rel-17 TS, NR AM — 12/18; нельзя переносить width вслепую.

   **Типичная ошибка:** Назвать любой LTE AM SN всегда 10-битным или любое NR HARQ timing фиксированным.

   **Источник:** [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

## 2. Время, numerology и граница MAC–PHY

11. Как переводить SFN/slot в однозначное внутреннее время scheduler?

   **Ответ:** SFN циклический, slot number зависит от numerology и scope. Внутри полезен расширенный счётчик времени с epoch и явной единицей, полученный из согласованного clock domain. При сравнении событий учитывают допустимый горизонт и wraparound; network timestamp сам по себе не гарантирует порядок arrival callbacks. Переход numerology/BWP требует корректного преобразования, а не умножения старого slot index константой.

   **Пример:** Для normal CP при μ=1 один frame содержит 20 slots; SFN=1023 сменяется 0 без обнуления внутреннего monotonic timeline.

   ```text
   Normal CP, μ=1: 20 slots/frame
   (SFN=1023, slot=19) → (SFN=0, slot=0)
   Internal extended_slot: ...20479 → ...20480
   ```

   **Типичная ошибка:** Сравнивать пару SFN/slot обычным unsigned less-than через wrap.

   **Источник:** [3GPP TS 38.211: NR physical channels](https://www.3gpp.org/dynareport/38211.htm); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

12. Как numerology меняет бюджет работы L2?

   **Ответ:** При normal CP длительность slot равна 1 ms / 2^μ, а количество slots в frame растёт. Это сокращает время на scheduler/packing и увеличивает частоту событий, но не гарантирует, что вся pipeline должна запускаться одним thread на каждый slot. Нужно учитывать processing offsets, PHY deadline, batching и multi-cell composition; throughput CPU оценивают вместе с worst-case duration.

   **Пример:** μ=0: 1 ms; μ=1: 0.5 ms; μ=2: 0.25 ms. Это slot duration, а не готовый end-to-end latency budget.

   ```text
   μ       slot duration (normal CP)
   0       1000 µs
   1        500 µs
   2        250 µs
   Actual MAC deadline also depends on PHY lead time.
   ```

   **Типичная ошибка:** Планировать NR только по 1 ms tick, не учитывая сроки выдачи решений PHY.

   **Источник:** [3GPP TS 38.211: NR physical channels](https://www.3gpp.org/dynareport/38211.htm); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

13. Что означают K0, K1 и K2 для NR scheduler?

   **Ответ:** K0 связывает scheduling PDCCH с PDSCH, K1 — PDSCH с HARQ-ACK occasion, K2 — UL grant с PUSCH. Допустимые значения задаются комбинацией RRC configuration, DCI interpretation и PHY processing constraints. При разных numerologies нужна нормативная интерпретация времени, а не универсальный offset в одном массиве slots. Scheduler должен резервировать будущие ресурсы и context до отправки DCI.

   **Пример:** Планируя DL, заранее проверить наличие допустимого HARQ-ACK ресурса, а не только свободного PDSCH.

   ```text
   PDCCH ──K0──> PDSCH ──K1──> HARQ-ACK occasion
   PDCCH ──K2──> PUSCH
   Offsets require the configured numerology/time-domain interpretation.
   ```

   **Типичная ошибка:** Использовать LTE fixed-offset assumptions для всех NR configurations.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

14. Почему TDD pattern ограничивает выдачу grants?

   **Ответ:** Передача должна помещаться в допустимые DL/UL/flexible symbols с учётом configured pattern и dynamic indications, где они применимы. Кроме data region нужны подходящие control/feedback occasions и processing time. Свободные PRBs в неподходящем направлении не являются доступной ёмкостью. Проверка validity должна работать на уровне требуемой временной детализации, а не только одного флага «slot DL».

   **Пример:** PDSCH помещается в DL symbols, но выбранный K1 ведёт в occasion без допустимого UL feedback.

   **Типичная ошибка:** Считать весь flexible slot безусловно доступным для любого направления.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

15. Чем mini-slot отличается от обычного полного slot в контексте scheduler?

   **Ответ:** Передача может занимать разрешённый поднабор symbols с соответствующей mapping/configuration. Это позволяет более гибкую latency policy, но увеличивает значение symbol-level reservation, DMRS overhead и conflict detection. Короткая duration не означает автоматическую URLLC гарантию: нужны доступный control channel, processing budget и согласованность с другими allocations.

   **Пример:** Срочная передача размещается на нескольких symbols, если UE и configured time-domain allocation допускают это.

   **Типичная ошибка:** Уменьшить число symbols без пересчёта TBS, DMRS и processing constraints.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

16. Почему MAC нельзя вычислять TBS как PRB × постоянное число байтов?

   **Ответ:** Ёмкость зависит от allocated RE, symbols, DMRS/overhead, modulation, code rate, layers и нормативной TBS quantisation. Для LTE и NR алгоритмы различаются. Scheduler/PHY должны иметь согласованный расчёт и units; MAC packing использует уже определённый TB byte budget. CRC/coding overhead нельзя вычитать из него произвольно второй раз.

   **Пример:** Одинаковые 20 PRB при разной symbol allocation или rank дают разные TBS.

   ```text
   PRBs + symbols + DMRS/other overhead → usable RE
   MCS table/index → modulation order + target code rate
   RE + layers + prescribed quantisation → TBS
   TBS bits / 8 → MAC byte budget
   ```

   **Типичная ошибка:** Построить универсальную линейную таблицу «байты на PRB» для всех configurations.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 36.213: LTE PHY procedures](https://www.3gpp.org/dynareport/36213.htm).

17. Какие indications PHY нужно коррелировать с решениями MAC?

   **Ответ:** CRC для UL TB, decoded RX data, HARQ-ACK/UCI, SR/CSI и другие measurements связывают с cell, UE lifecycle, direction, scheduling time, HARQ process и configuration. Реальный API может разделять события по сообщениям; порядок доставки не всегда совпадает с radio time. Контекст должен поддерживать задержанные/повторные callbacks и обнаружение пропусков.

   **Пример:** UL RX bytes и CRC пришли раздельно; demux начинается только по согласованному контракту их validity.

   **Типичная ошибка:** Считать первый callback окончательным свидетельством успешного TB без проверки semantic type.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/).

18. Является ли FAPI или O-RAN fronthaul частью MAC air-interface specification?

   **Ответ:** Нет: это отдельные interface contracts с собственными версиями и timing/encoding rules. TS 38.321 описывает MAC procedures и PDUs, PHY TS — radio procedures; FAPI задаёт одно из возможных MAC–PHY API. О-RAN split может размещать границу в другой части radio processing. Нельзя смешивать номер FAPI message и LCID либо предполагать, что любой gNB использует одинаковый internal interface.

   **Пример:** Разделить в trace radio slot, MAC action и конкретное сообщение PHY API.

   **Типичная ошибка:** Выдавать vendor-specific callback order за требование 3GPP.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/); [3GPP TS 38.401: NG-RAN architecture](https://www.3gpp.org/dynareport/38401.htm).

19. Как проектировать обработку позднего или отсутствующего PHY indication?

   **Ответ:** Различать реальное radio событие, transport delay API и потерю local event. Для ожидаемого feedback хранить deadline и lifecycle token; поздние события учитывать по политике, не портя новое поколение HARQ/context. Recovery зависит от процедуры: timeout локального API не всегда нормативный NACK от UE. Нужно логировать причину синтетического решения и последствия для retransmission.

   **Пример:** Timeout feedback помечен как missing indication, а не поддельный принятый NACK в KPI.

   **Типичная ошибка:** Безусловно записывать NACK по каждому внутреннему timeout и затем диагностировать «плохой radio».

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

20. Что измерять как scheduler deadline miss?

   **Ответ:** Определить момент, к которому план и связанные buffers должны быть приняты PHY по interface contract; отдельно измерять queue wait, compute, packing и handoff. Miss относительно software trace начала не равен miss radio deadline. Нужны percentile/max duration и correlation по cell/slot; усреднение скрывает редкие перегрузки. Цена пропуска зависит от того, успели ли уйти control и data parts согласованно.

   **Пример:** Scheduler вычислил план быстро, но TX buffer allocation задержало handoff за PHY deadline.

   ```text
   event ingress → queue wait → scheduler → packing → PHY submit
   Measure each interval and: submit_time <= PHY_deadline
   Report p50/p95/p99/max and misses, with workload.
   ```

   **Типичная ошибка:** Оценивать realtime корректность только средней длительностью функции select_ue().

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

## 3. Основы политики scheduler, fairness и admission

21. Какие ограничения проверяются до ранжирования UE?

   **Ответ:** Доступность UE по procedure state/DRX, valid configuration, direction/time-domain allocation, HARQ process, control/feedback resources, buffer demand и UE capabilities. После eligibility можно применять score и QoS policy. Хороший score не делает недопустимый grant законным. Практично разделить hard constraints и soft preferences, сохраняя reason code для каждого исключения; это сильно упрощает разбор starvation.

   **Пример:** UE с максимальным PF score пропускается, если нет допустимого HARQ-ACK occasion.

   **Типичная ошибка:** Сначала выбрать победителя, затем молча не выдать grant без диагностируемой причины.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

22. Как работает proportional fair и что именно в нём implementation-specific?

   **Ответ:** Распространённый score сравнивает ожидаемую мгновенную полезную скорость с усреднённой уже обслуженной скоростью. Выбор averaging window, нулевой защиты, учёта retransmissions, QoS и resource cost зависит от реализации. PF стремится к компромиссу эффективности и fairness при своих assumptions, но не обеспечивает автоматически GBR/PDB. Определение delivered bytes должно быть устойчивым к retransmissions и idle periods.

   **Пример:** В учебной модели score=estimated_goodput/max(average_goodput, epsilon). Это policy example, не формула, предписанная TS.

   ```text
   Illustrative PF score = estimated_rate / average_served_rate
   UE A: 20 / 10 = 2
   UE B:  8 /  2 = 4
   B wins this comparison only if both are eligible.
   Averaging, QoS weights and zero-history handling are implementation policy.
   ```

   **Типичная ошибка:** Засчитывать повтор одного TB как новые delivered bytes и искусственно занижать будущий score UE.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm).

23. Чем round-robin отличается от max-C/I и PF?

   **Ответ:** Round-robin делит opportunities по выбранному правилу обхода, max-C/I отдаёт предпочтение лучшей ожидаемой radio эффективности, PF учитывает историю обслуживания. Но одинаковые opportunities не означают одинаковые bits или delays. Для сравнения нужны offered load, channel distribution, per-UE goodput, fairness и QoS violations; нельзя оценивать политику только суммарным cell throughput.

   **Пример:** Слабое UE получает столько же slots по RR, но меньше bytes, чем сильное UE.

   **Типичная ошибка:** Называть round-robin гарантией равной пользовательской скорости.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm).

24. Как учитывать head-of-line delay, не перепутав возраст очереди с end-to-end PDB?

   **Ответ:** Нужно знать точку timestamp и состав budget: DU RLC arrival не включает уже потраченное время в core/CU/F1. HOL policy ранжирует ожидающие объекты, но PDB относится к определённой service boundary и packet class. Просроченный пакет может требовать discard, а не бесконечного приоритета. Следует различать нормативные budgets и внутренние deadlines реализации.

   **Пример:** HOL в DU 3 ms при общем budget 10 ms не доказывает оставшиеся 7 ms без данных о предыдущих участках.

   **Типичная ошибка:** Считать возраст RLC queue полным one-way packet delay.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf).

25. Как соединить GBR policy с эффективностью радиоресурсов?

   **Ответ:** Отслеживать service rate/deficit в явном интервале и units, учитывать admission и фактическую radio feasibility. Уже принятые GBR обязательства конкурируют с control, retransmissions и ограниченной channel quality. Scheduler может компенсировать временный deficit, но не создаёт физическую ёмкость; нужны overload policy и отдельные причины нарушения QoS. GFBR и MFBR выполняют разные роли.

   **Пример:** При degraded channel сохранить наблюдаемость deficit и отклонить новый GBR load вместо бесконтрольного обещания скорости.

   **Типичная ошибка:** Гарантировать любой GBR одним высоким priority weight без admission control.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 23.203: EPS policy and QoS](https://www.3gpp.org/dynareport/23203.htm).

26. Зачем scheduler ограничивать одновременно per-UE и per-bearer demand?

   **Ответ:** Выбор UE определяет общие radio resources, а bearer policy — состав передаваемых данных. Если учитывать только общий backlog, bulk traffic может вытеснить low-latency bearer внутри того же UE. Если учитывать только bearers независимо, легко дважды занять один HARQ/process/control resource. Нужны согласованные arbitration и accounting на обоих уровнях.

   **Пример:** У UE есть voice и file download; общий большой buffer не должен скрыть просроченный voice packet.

   **Типичная ошибка:** Приписать один и тот же TBS двум bearers при независимом планировании.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm).

27. Почему приоритет retransmission не означает «retransmission всегда первая без условий»?

   **Ответ:** Для повторов есть HARQ/RLC state и PHY timing/resource constraints; валидность и сроки важнее общего лозунга. Затем policy учитывает стоимость блокирования процесса, QoS и доступные opportunities. RLC AM также имеет нормативные приоритеты control/retransmission перед new data в своей сущности. Эти уровни нельзя объединить в одну global FIFO без потери семантики.

   **Пример:** HARQ retransmission ждёт допустимого occasion, а в другой opportunity можно обслужить допустимый new transmission.

   **Типичная ошибка:** Выдать retransmission с изменённым payload только потому, что другой packet имеет больший priority.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf).

28. Как resource fragmentation снижает throughput при свободных PRB?

   **Ответ:** Свободные ресурсы могут быть разрозненными по time/frequency, недоступными выбранному UE allocation type или несовместимыми с control/DMRS/UL waveform. Поэтому occupancy ниже 100% не обязательно означает отсутствие demand или плохой score. Reservation map должен хранить реальные ограничения, а KPI — разделять unused-by-policy и unusable-under-constraints resources.

   **Пример:** Остаток PRB есть, но не помещается допустимая contiguous UL allocation для данного режима.

   **Типичная ошибка:** Суммировать все свободные PRB и считать их одним доступным grant.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

29. Почему стабильный deterministic tie-breaker полезен в scheduler?

   **Ответ:** Он делает повтор одинакового входного состояния воспроизводимым и позволяет анализировать fairness. Но постоянный tie-break по RNTI способен создавать bias; ротацию или seeded policy нужно описать явно. Determinism не требует одинакового решения при разном arrival order, если этот order является частью входа. В trace сохраняют snapshot inputs и policy version.

   **Пример:** При одинаковом score round-robin cursor выбирает следующего UE; replay использует тот же cursor.

   **Типичная ошибка:** Полагаться на порядок обхода unordered_map и считать разные решения случайной radio проблемой.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf).

30. Какие метрики нужны для сравнения двух scheduler implementations?

   **Ответ:** Cell/per-UE useful throughput, latency distribution, QoS deadline violations, airtime/PRB usage, retransmission overhead, control bottlenecks, starvation и software deadline misses. Нужны одинаковые channel/load profiles, warmup, seeds и определение offered/delivered bytes. Один sum throughput не показывает, что часть UE перестала обслуживаться. Нормативные measurement definitions отделяют от внутренних diagnostic counters.

   **Пример:** Policy B даёт +5% cell throughput, но у cell-edge UE p99 delay вырос втрое; это явный trade-off.

   **Типичная ошибка:** Сравнивать один короткий прогон со случайно разными каналами и только общей скоростью.

   **Источник:** [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

## 4. Downlink scheduling, link adaptation и control resources

31. Почему CQI нельзя напрямую объявить выбранным MCS?

   **Ответ:** CQI отражает оценку канала при заданных assumptions и reporting configuration; таблица CQI не тождественна таблице MCS. Scheduler учитывает report age, bandwidth/granularity, rank, target reliability и link adaptation policy. Допустимые MCS tables и TBS calculation определяются PHY configuration. Необходимо сохранять, какой report и offset использованы для конкретного решения.

   **Пример:** Одинаковый CQI при другом rank или старом measurement может привести к разному допустимому/разумному MCS.

   **Типичная ошибка:** Использовать индекс CQI как индекс MCS без mapping и проверок configuration.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

32. Как OLLA использует HARQ feedback и где здесь опасные assumptions?

   **Ответ:** Outer-loop link adaptation корректирует margin/offset по истории успешных и неуспешных передач, чтобы приблизиться к выбранной reliability target. Сам алгоритм и шаги — network policy, а не единственный стандартный механизм. Нужно различать first-transmission BLER, итоговую HARQ failure и missing feedback. Неверная выборка feedback вызывает дрейф даже при исправном канале.

   **Пример:** Обновлять offset по валидному feedback нужного transport block, исключив stale UE generation.

   **Типичная ошибка:** Считать внутренне потерянный UCI callback доказанным radio NACK и бесконечно снижать MCS.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

33. Как stale CSI влияет на DL scheduler?

   **Ответ:** Channel estimate относится к measurement time и ограниченной области frequency/beam, а не ко всем будущим resources. При mobility или interference устаревшая оценка делает rate prediction оптимистичной, увеличивает BLER и расход HARQ. Нужна age-aware policy и fallback, с явным различением отсутствия report и плохого качества канала. Срок полезности — инженерное решение, зависящее от scenario.

   **Пример:** CSI хорошее, но измерено до смены beam/резкого fading; текущий grant требует осторожного выбора.

   **Типичная ошибка:** Обновлять timestamp CSI временем приёма в scheduler, потеряв реальный возраст measurement.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

34. Почему увеличение rank не гарантирует рост полезного throughput?

   **Ответ:** Дополнительные layers меняют transmission assumptions, code rate, reliability и требования к channel/precoding. Высокий rank полезен при достаточном spatial quality, но при ошибочной оценке вызывает retransmissions. Нужно согласовать RI/PMI/CQI, выбранную MCS/TBS и возможности UE. Решение сравнивают по useful goodput, а не nominal bits в одной попытке.

   **Пример:** Rank 2 с высокой first-pass failure может проиграть устойчивому rank 1.

   **Типичная ошибка:** Всегда выбирать максимальное число layers из UE capability независимо от текущего channel.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

35. Как PDCCH/CCE bottleneck ограничивает scheduler при свободном PDSCH?

   **Ответ:** DCI должен попасть в допустимые CORESET/search space и monitoring occasions, с доступными candidates и aggregation level. Свободные data PRBs не помогают, если нельзя доставить допустимый control grant. Точное распределение CCE/candidates — отдельная задача с ограничениями UE monitoring. Для diagnostics нужны причины отказа на control allocation и различение DL/UL demand.

   **Пример:** Много small-packet UEs исчерпывают control opportunities раньше data capacity.

   ```text
   Data resource available: yes
   Valid PDCCH candidate available: no
   Decision: no grant; reason = control_candidate_exhausted
   Unused PRBs are expected in this decision.
   ```

   **Типичная ошибка:** Считать low PRB utilisation доказательством отсутствия bottleneck.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.212: NR channel coding / DCI](https://www.3gpp.org/dynareport/38212.htm).

36. Как aggregation level влияет на число обслуживаемых UE?

   **Ответ:** Более высокий aggregation level расходует больше control resources и может помогать decoding reliability при соответствующих conditions. Но число candidates, overlap и search-space restrictions означают, что capacity не равна просто total CCE / aggregation. Scheduler выбирает допустимое размещение с учётом reliability policy и competition. Переход на меньший level нельзя делать только ради заполнения таблицы grants.

   **Пример:** При ухудшении control channel вырос aggregation level, и число grants/slot снизилось без изменения data bandwidth.

   **Типичная ошибка:** Игнорировать рост CCE cost при сравнении scheduler throughput в разных radio conditions.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

37. Почему DL allocation должна одновременно учитывать будущий HARQ-ACK?

   **Ответ:** Feedback occasion и PUCCH/PUSCH multiplexing должны быть допустимы для configuration и UE capability. Если сначала занять PDSCH, а потом не найти feedback resource, план может оказаться невалидным или потребовать rollback. Control, data и feedback reservations образуют согласованную транзакцию. Для mixed numerology timing conversion берут из PHY rules.

   **Пример:** Выбранный K1 ведёт к занятому/недопустимому UCI occasion; попробовать другой допустимый вариант до публикации DCI.

   **Типичная ошибка:** Отправить DCI, затем отменить только data allocation, забыв согласовать PHY state.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

38. Как SPS в LTE и semi-persistent/configured scheduling в NR меняют обычный loop?

   **Ответ:** Часть ресурсов/параметров задаётся заранее и активируется соответствующей процедурой, уменьшая постоянный control overhead. Но остаются HARQ, activation/release state, periodicity и collision rules; periodic reservation нельзя трактовать как бесконечно свободный dynamic grant. DL SPS и UL configured grant различаются, а LTE и NR процедуры не взаимозаменяемы.

   **Пример:** Периодический voice traffic получает заранее configured opportunities, а dynamic scheduler видит уже занятые интервалы.

   **Типичная ошибка:** Планировать поверх persistent resources, потому что в текущем slot нет нового DCI.

   **Источник:** [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf).

39. Почему padding может расти даже при большом DL backlog?

   **Ответ:** Причины: несогласованный queue snapshot, недоступный RLC segment, header budget error, bearer eligibility, неатомарное reservation или underrun между scheduling и packing. Иногда padding нормативно необходим из-за TBS quantisation. Нужно считать доступный именно для этого TB payload и причины невозможности заполнения, а не только общий входной backlog.

   **Пример:** Queue была ненулевая в начале slot, но другой worker уже забрал те же bytes к моменту assembly.

   **Типичная ошибка:** Увеличивать grant для лечения padding, не проверив ownership и RLC pull result.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

40. Как реализовать rollback неудавшегося DL grant?

   **Ответ:** До external publication хранить tentative reservations: control/data/feedback, HARQ state и data-buffer ownership. При failure освобождать ровно собственные reservations и возвращать неподтверждённый data state по контракту. После отправки DCI простой rollback уже недостаточен: нужен согласованный failure path MAC–PHY. Лучше явно разделить prepare, validate и commit и сделать повторную очистку безопасной.

   **Пример:** PDCCH reservation успешна, но packing не смог получить buffer; до commit отменить связанные reservations без double free.

   ```text
   prepare: reserve control + data + feedback + HARQ context
   validate: obtain payload; verify budget and configuration epoch
   commit: publish a consistent decision to PHY
   failure before commit: release own reservations exactly once
   ```

   **Типичная ошибка:** Обновить NDI/HARQ buffer до того, как решение стало согласованно опубликовано.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/).

## 5. Uplink: BSR, SR, PHR и оценка demand

41. Что именно сообщает BSR и чего scheduler из него не узнаёт?

   **Ответ:** BSR передаёт закодированную оценку объёма данных UE по LCG; это не список PDCP packets и не точная очередь каждого LC. Значение соответствует reporting instant, приходит с задержкой и может представлять диапазон. Scheduler хранит время и происхождение оценки, учитывает уже выданные grants и результаты приёма. Преобразование индекса требует таблицы именно выбранного RAT и формата CE.

   **Пример:** LCG содержит voice и bulk LC: один BSR не показывает возраст и долю каждого потока.

   ```text
   BSR observation = {LCG, encoded_index, format, receive_time}
   Demand estimate = policy(observation, previous_grants, actual_payload)
   encoded_index != exact byte count
   ```

   **Типичная ошибка:** Считать BSR index числом байтов или точным текущим backlog.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

42. Чем SR отличается от BSR?

   **Ответ:** SR запрашивает возможность UL передачи по соответствующей процедуре; сам положительный SR не сообщает точный размер очереди. Он может привести к grant, позволяющему передать BSR и данные. Нужно учитывать SR configuration, prohibit/periodicity, pending state и допустимые occasions. Наличие SR не гарантирует, что к моменту grant исходная очередь остаётся неизменной.

   **Пример:** После SR выдать ограниченный initial grant и уточнить demand по полученному BSR и payload.

   **Типичная ошибка:** Выдавать каждому SR максимальный grant, считая его указанием большой очереди.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

43. Зачем различать regular, periodic и padding BSR?

   **Ответ:** Причина triggering влияет на pending state, выбор формата и отмену reporting. Regular BSR связан с предусмотренными событиями данных/таймеров; periodic — с периодическим reporting; padding BSR использует доступное место по правилам MAC. UE действует по нормативной процедуре, а gNB использует отчёт как наблюдение. Названия не означают три независимые очереди данных.

   **Пример:** Periodic report обновляет оценку при длительной нагрузке, даже если не возник новый переход empty→non-empty.

   **Типичная ошибка:** Восстанавливать UE trigger state на gNB только по содержимому одного CE.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

44. Как интерпретировать short, long и truncated BSR?

   **Ответ:** Формат определяет, какие LCG представлены и насколько полно. NR и LTE имеют разные форматы и таблицы; отсутствие LCG в усечённом отчёте нельзя автоматически считать сообщением о нулевой очереди. Decoder должен возвращать и значения, и маску действительно сообщённых групп. Обновление demand выполняют только для представленных данных с учётом процедуры.

   **Пример:** Truncated report описал часть групп: сохранить остальные оценки как устаревающие, а не обнулить их.

   **Типичная ошибка:** Считать любой пропущенный LCG пустым.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

45. Как избежать двойного учёта UL bytes после выдачи grant?

   **Ответ:** Полезно разделять reported estimate, ожидаемый payload в in-flight transmissions и реально принятые bytes. Grant/TBS не равен объёму user data: есть headers, CEs, padding и retransmissions. Обновление по новому BSR должно учитывать его временную связь с передачами. Это алгоритм оценки сети, а не универсальная формула 3GPP.

   **Пример:** Grant 1000 bytes не означает уменьшение очереди на 1000: приняты 760 bytes RLC data, остальное overhead/padding.

   ```text
   Report: estimated demand 3000 bytes
   Grant: TBS 1000 bytes
   Received: 760 data + 240 headers/CE/padding
   Do not subtract 1000 on grant AND another 760 on reception.
   ```

   **Типичная ошибка:** Вычесть полный TBS при grant, затем повторно те же bytes при CRC success.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

46. Как PHR влияет на UL resource allocation?

   **Ответ:** PHR характеризует power headroom по определённой процедуре и serving-cell context; это не запас свободных PRBs и не прямой CQI. Большая полоса при ограниченной мощности может снизить power spectral density и ухудшить decoding. Решение объединяет актуальность PHR, pathloss/power-control context, MCS и ограничения UE. Форматы multiple-entry и virtual/real reporting требуют отдельной интерпретации.

   **Пример:** У power-limited UE сравнить меньшую allocation и более устойчивый MCS с широким grant при том же power budget.

   **Типичная ошибка:** Увеличивать PRBs при низком PHR, ожидая линейного роста throughput.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

47. Какие наблюдения нужны для UL link adaptation?

   **Ответ:** Сеть использует доступные измерения UL channel, SRS/DMRS, историю CRC/HARQ и power constraints. DL CQI нельзя механически применять как UL MCS, особенно без обоснованной reciprocity/calibration. Алгоритм должен различать radio failure, interference, неверный timing и отсутствие ожидаемой передачи. Feedback связывают с конкретной transmission attempt.

   **Пример:** Рост UL CRC failures при стабильном DL CQI требует проверки UL measurements и power limitation.

   **Типичная ошибка:** Настраивать UL OLLA по DL ACK/NACK той же UE.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

48. Кто выбирает logical channels внутри UL grant?

   **Ответ:** Network scheduler задаёт разрешённые ресурсы и параметры grant, а UE выполняет normative logical channel prioritisation с конфигурационными ограничениями. Grant не является безусловной командой отправить ровно один DRB. Поэтому сеть не знает точное содержимое будущего MAC PDU только из BSR и должна проверять фактически полученные LCIDs.

   **Пример:** Два LC в LCG конкурируют по UE LCP; scheduler не может восстановить их payload split из суммарного BSR.

   **Типичная ошибка:** Считать network PF эквивалентом UE LCP и предсказывать точный MAC PDU.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

49. Чем NR configured grant Type 1 отличается от Type 2?

   **Ответ:** Type 1 получает необходимые параметры через RRC; Type 2 дополнительно использует активацию/деактивацию через предусмотренное управление DCI. Оба требуют соблюдения HARQ, periodicity и collision rules. Это UL механизм; DL SPS рассматривается отдельно. Конкретные supported options зависят от release и UE capabilities, а LTE UL SPS имеет собственные процедуры.

   **Пример:** После RRC configuration Type 2 не считать grant активным до соответствующей activation procedure.

   **Типичная ошибка:** Перенести Type 1/2 терминологию на любую LTE SPS процедуру.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

50. Почему UE может прислать мало данных при положительном BSR?

   **Ответ:** Возможны stale BSR, переоценка demand, LCP restrictions, serving-cell restrictions, power limitations, RLC readiness или изменение очереди. Разбирать нужно цепочку report→grant→actual MAC PDU, включая timestamps и padding. Сам факт небольшого payload не доказывает ошибку UE. Сначала проверяют decode BSR и соответствие grant действующей конфигурации.

   **Пример:** Сопоставить age отчёта, выданные ранее grants и LCIDs полученного TB.

   **Типичная ошибка:** Объявлять scheduler исправным только потому, что grant был выдан.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

## 6. HARQ: процессы, feedback и владение transport block

51. Чем HARQ retransmission отличается от RLC AM retransmission?

   **Ответ:** HARQ восстанавливает transport block на границе MAC–PHY и использует channel coding/soft combining. RLC AM восстанавливает данные своего протокольного уровня по STATUS и собственным таймерам. Один механизм не заменяет другой: HARQ success не подтверждает доставку IP приложению, а RLC может восстанавливаться после исчерпания HARQ. Счётчики и очереди повторов должны быть раздельными.

   **Пример:** HARQ несколько раз не доставил TB; позднее RLC STATUS инициирует повтор нужных AMD data.

   **Типичная ошибка:** Считать RLC retransmission повтором идентичного MAC transport block.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

52. Как моделировать жизненный цикл HARQ process?

   **Ответ:** Состояние связывает process ID, transport block, new-data interpretation, attempt history, feedback occasion и действующую конфигурацию. Практическая реализация может иметь free/prepared/waiting/retransmission states, но это инженерная модель поверх нормативных процедур. Повторное использование process допустимо только при согласованном завершении или предусмотренном reset. Для DL и UL обязанности сети различаются.

   **Пример:** Запоздалый feedback относится к прошлому использованию process ID: проверить generation и occasion до обновления текущего состояния.

   ```text
   free → prepared → waiting_feedback
                        ├─ ACK → completed/free
                        └─ NACK → retransmission_pending → waiting_feedback
   Reset/release/DTX paths need explicit procedure-specific handling.
   ```

   **Типичная ошибка:** Использовать process ID как глобально уникальный идентификатор пакета.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

53. Всегда ли toggled NDI означает обычную новую передачу?

   **Ответ:** Для типичных dynamic grants изменение NDI участвует в определении new transmission, но интерпретация зависит от HARQ context и процедуры, включая configured assignments/grants и reset. Нельзя применять одно правило без учёта предыдущего valid state. Decoder DCI и HARQ state machine должны использовать согласованную конфигурацию.

   **Пример:** После reset первый observed NDI обрабатывается в контексте инициализации, а не сравнивается с произвольным старым битом.

   **Типичная ошибка:** Сравнивать NDI между разными HARQ processes или serving cells.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

54. Зачем нужен redundancy version и почему RV не является номером повтора?

   **Ответ:** RV задаёт вариант rate matching/coded-bit selection. Он влияет на передачу и combining, но не заменяет process state, NDI и history. Последовательности и допустимые параметры зависят от процедуры. Счётчик attempt хранится отдельно: повторное использование RV не обязательно означает повторное получение одного события.

   **Пример:** Лог хранит attempt=3 и RV отдельно; из одного значения RV нельзя восстановить количество попыток.

   **Типичная ошибка:** Предполагать, что RV всегда последовательно равен 0,1,2,3.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.212: NR channel coding / DCI](https://www.3gpp.org/dynareport/38212.htm); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

55. Можно ли при HARQ retransmission заново собрать MAC PDU?

   **Ответ:** Повтор относится к тому же transport block: содержимое нельзя изменить, подмешав новый RLC segment или свежий CE. Реализация сохраняет TB либо гарантирует точное воспроизведение его bytes, пока процессу они нужны. Новые данные ожидают подходящей новой передачи. Владение буфером должно переживать asynchronous PHY processing.

   **Пример:** Новый BSR/TA CE появился после первой передачи: он не переписывает сохранённый DL TB для retransmission.

   ```text
   Initial TB: [MAC headers][RLC data A][CE][padding]
   HARQ retx: same TB bytes, permitted PHY parameter changes
   New RLC data B: waits for a new-data transmission
   ```

   **Типичная ошибка:** Повторно вызвать RLC pull и получить другой payload при неизменном HARQ context.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

56. Можно ли менять resources и MCS при повторе HARQ?

   **Ответ:** Adaptive retransmission допускает изменение параметров в рамках процедуры, но должна сохранять требуемую согласованность исходного TB, включая transport block size и coding interpretation. Новый PRB allocation сам по себе не делает повтор допустимым. Проверяют RAT, grant type и PHY constraints. Нельзя использовать универсальное правило «любые PRBs и любой MCS».

   **Пример:** Изменить allocation с пересчётом допустимых параметров, сохранив исходный TB size и data identity.

   **Типичная ошибка:** Сменить TBS и продолжить combining как для прежнего блока.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 36.213: LTE PHY procedures](https://www.3gpp.org/dynareport/36213.htm); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

57. Что доказывает DL HARQ ACK?

   **Ответ:** ACK подтверждает успешное decoding соответствующего transport block по процедуре feedback. Он не доказывает application delivery, PDCP in-order delivery или отсутствие дальнейших потерь. Кроме того, обработка feedback должна учитывать codebook, serving cells и transmission context. End-to-end goodput измеряют на выбранной границе отдельно от MAC successful bytes.

   **Пример:** MAC ACK приходит, но PDCP packet ещё ждёт пропущенный предыдущий COUNT.

   **Типичная ошибка:** Приравнивать ACKed TBS к доставленному TCP payload.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

58. Чем NACK отличается от DTX в диагностике?

   **Ответ:** NACK — отрицательный результат соответствующего feedback decoding/интерпретации, DTX обозначает отсутствие ожидаемого feedback в используемом PHY интерфейсе. Причины DTX включают missed control, отсутствие передачи, неверную occasion или проблемы decoding. Представление DTX зависит и от интерфейса PHY. Scheduler policy не должна скрывать разные причины под одним счётчиком BLER.

   **Пример:** Всплеск DTX одновременно с PDCCH issues проверить отдельно от PDSCH channel quality.

   **Типичная ошибка:** Уменьшать MCS при любом DTX без проверки feedback mapping.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/).

59. Как долго хранить HARQ buffers?

   **Ответ:** Срок определяется жизненным циклом процесса и контрактом MAC–PHY, а не временем выхода функции packing. Нужно различать CPU buffer, PHY-owned representation и receiver soft information. Освобождение выполняют после явного завершения использования, учитывая reset/release и late callbacks. Для C++ удобны move ownership и generation-tagged handles, но выбор контейнера сам по себе не решает lifecycle.

   **Пример:** UE release отменяет логический процесс, а PHY completion позже возвращает ссылку: обработчик должен безопасно завершить ownership.

   **Типичная ошибка:** Вернуть memory pool block сразу после отправки указателя PHY.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/).

60. Почему нельзя всегда считать количество HARQ processes равным 8 или 16?

   **Ответ:** Число и организация процессов зависят от RAT, направления, конфигурации и release features. Даже при известном числе processes throughput ограничивают RTT, доступность feedback и scheduling opportunities. Оценка pipeline требует реальной длительности занятия process, а не только количества. В коде capacity берут из поддерживаемой конфигурации с проверками границ.

   **Пример:** При среднем удержании process 4 ms ограниченное число processes может мешать выдавать новые TB каждый slot.

   **Типичная ошибка:** Жёстко зашить один массив и одинаковые timing rules для LTE FDD и любого NR.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

## 7. MAC PDU: форматы, бюджет и безопасный parser

61. Почему LTE и NR MAC PDU нельзя разбирать одним неизменным layout?

   **Ответ:** В LTE и NR отличаются организация subheaders, multiplexing и перечни CEs. В NR MAC PDU строится из MAC subPDUs с соответствующими subheaders и payload; LTE имеет собственную структуру заголовка и правила. Parser сначала выбирает RAT/direction/configuration, затем format. Общими можно оставить bounds-checked byte access и error reporting.

   **Пример:** Одинаковый первый байт в LTE и NR не гарантирует одинаковые LCID и length interpretation.

   **Типичная ошибка:** Применить LTE E-bit walking к NR PDU.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

62. Почему LCID нужно интерпретировать с учётом направления?

   **Ответ:** LCID кодирует logical channel или control/padding semantics в таблице конкретного MAC format. DL и UL таблицы различаются, а часть значений зависит от версии и расширений. Неизвестное значение нельзя автоматически считать DTCH. Нужны явные tables, supported-feature checks и диагностическая причина reject.

   **Пример:** Один numeric LCID проверяется по UL таблице при разборе PUSCH и по DL таблице при построении PDSCH.

   **Типичная ошибка:** Сделать один глобальный enum без RAT и direction.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

63. Какие проверки нужны до чтения length field?

   **Ответ:** Нужно убедиться, что subheader полностью доступен, определить формат и длину поля, затем проверить оставшийся payload и допустимость значения. Арифметику выполнять без overflow: сравнивать requested length с remaining bytes. Нельзя доверять ни DMA длине, ни декодированному TB только потому, что CRC прошёл: внутренние ошибки тоже возможны.

   **Пример:** Из remaining=12 получено length=100: вернуть structured parse error до создания span.

   **Типичная ошибка:** Сначала построить указатель за конец буфера, затем сравнивать его.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

64. Как посчитать DL MAC payload budget?

   **Ответ:** Начинают с допустимого TBS в bytes и вычитают реальные subheaders, выбранные CEs и их headers, затем RLC headers для конкретных PDUs. Размер заголовка может изменяться с длиной payload. Это задача согласованной packing decision, а не фиксированный процент overhead. Padding учитывается после выбора допустимого содержимого.

   **Пример:** Условный TBS=1000, MAC overhead=6 и RLC overhead=3 оставляет 991 byte RLC user payload; числа зависят от actual format.

   ```text
   Illustrative byte budget, not a wire-format vector:
   TBS               1000
   MAC overhead        -6
   RLC overhead        -3
   RLC user payload   991
   Always derive actual headers from selected formats.
   ```

   **Типичная ошибка:** Передать RLC весь TBS как максимальный SDU payload.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

65. Почему control elements нельзя безусловно добавлять после data packing?

   **Ответ:** CEs имеют собственные formats, triggering/priority и validity; они могут изменить доступный budget и pending procedure state. Сначала определяют обязательства по процедуре, затем формируют согласованный PDU. Pending CE не всегда означает, что его можно поставить в любой TB. Commit state должен соответствовать реально отправленной конструкции.

   **Пример:** Для выбранного TB учесть TA CE до запроса RLC data, если процедура требует его передачи.

   **Типичная ошибка:** Очистить pending CE после попытки packing, завершившейся отказом.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

66. Как отличать zero-length payload, padding и malformed PDU?

   **Ответ:** Смысл определяется конкретным subheader/CE format и ограничениями procedure. Padding имеет нормативное представление; нулевое значение length не является универсальным padding marker. Parser должен гарантировать продвижение offset либо завершать обработку с ошибкой. Отдельно проверяют fixed-size CE payload и reserved semantics.

   **Пример:** Malformed subheader не должен приводить к бесконечному циклу с неизменным cursor.

   **Типичная ошибка:** Использовать while-loop, который продолжает разбор после ошибки без изменения offset.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html).

67. Что делать с reserved bits и неизвестными extensions?

   **Ответ:** Поведение выбирают по нормативным правилам конкретного поля и supported release; нельзя универсально отвергать любой ненулевой reserved bit или игнорировать любую неизвестную длину. Реализация должна явно описывать compatibility policy и безопасный failure path. Unsupported format не должен изменять bearer state до validation.

   **Пример:** Decoder возвращает unsupported-format с RAT, direction и offset, сохраняя исходный buffer для ограниченной диагностики.

   **Типичная ошибка:** Считать неизвестный CE пользовательскими данными и передать RLC.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

68. Когда zero-copy помогает MAC, а когда усложняет реализацию?

   **Ответ:** Zero-copy уменьшает перемещения payload, но требует корректного lifetime, alignment, scatter/gather support и неизменности HARQ data. Малые headers иногда выгоднее копировать в contiguous TB, чем усложнять descriptors и cache access. Решение подтверждают профилем и PHY interface. Количество копий само по себе не является метрикой deadline success.

   **Пример:** RLC payload spans остаются owned до PHY completion; headers собираются в отдельном bounded buffer.

   **Типичная ошибка:** Назвать передачу raw pointers zero-copy и забыть, кто освобождает данные.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/).

69. Какие invariants проверять после MAC assembly?

   **Ответ:** Сумма subheaders, CEs, data и padding должна равняться TBS; каждый subPDU должен быть разрешён direction/configuration; data ownership и HARQ identity должны быть согласованы. Проверки выполняют до publication. Полезен независимый decoder для golden tests, но roundtrip тем же ошибочным encoder недостаточен.

   **Пример:** После packing независимо пересчитать consumed bytes и разобрать сохранённый TB reference parser.

   ```text
   assert(sum(subheaders, control, data, padding) == TBS_bytes)
   assert(all_subPDUs_valid_for_RAT_direction_configuration)
   assert(payload_lifetime_covers_PHY_use)
   assert(HARQ_retransmission_keeps_original_TB)
   ```

   **Типичная ошибка:** Проверять только общий размер и пропускать неверный LCID.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html).

70. Как связывать UL parser с обновлением state?

   **Ответ:** Сначала выполняют structural validation и формируют представление PDU; затем применяют допустимые updates с известным error policy. Иначе повреждённый поздний subPDU оставит частично изменённые BSR/PHR/bearer states. Полная атомарность зависит от процедуры, но порядок validation и side effects должен быть явным и тестируемым.

   **Пример:** Некорректная длина последнего CE не должна незаметно подтверждать данные, которые parser не смог валидировать.

   **Типичная ошибка:** Мутировать UE context непосредственно при каждом чтении байта.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

## 8. Random access, DRX и служебные процедуры

71. Какие этапы four-step random access важны scheduler?

   **Ответ:** В contention-based схеме различают preamble, random access response, Msg3 и contention resolution. Scheduler обеспечивает соответствующие resources, временные окна, temporary identity и обработку результата. Названия Msg1–Msg4 полезны для trace, но детали идентичности и содержимого зависят от RAT/procedure. Нельзя считать UE fully established сразу после preamble.

   **Пример:** Preamble обнаружен, но Msg3 CRC fails: искать RAR grant/timing/HARQ, а не PDCP issue.

   ```text
   Msg1: preamble
   Msg2: random access response
   Msg3: scheduled UL transmission
   Msg4: contention resolution in the relevant CBRA procedure
   At every stage: identity scope + timer + cleanup path.
   ```

   **Типичная ошибка:** Создать полноценный user-plane context на каждое preamble без timeout cleanup.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

72. Чем NR two-step RA отличается от four-step?

   **Ответ:** Two-step RA объединяет preamble и associated PUSCH в MsgA, а response относится к MsgB с предусмотренными вариантами, включая fallback. Это отдельная configured/capability-dependent процедура NR; простое переименование Msg1/Msg2 неверно. Scheduler учитывает ресурсы MsgA, response window и соответствующий state machine.

   **Пример:** MsgA preamble detected без успешного payload decoding требует процедуры response/fallback, а не обычного Msg3 completion.

   **Типичная ошибка:** Применять four-step timers и state transitions без проверки two-step configuration.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

73. Чем contention-free RA отличается от contention-based?

   **Ответ:** Dedicated resources/preamble уменьшают необходимость разрешения конкуренции по соответствующей процедуре, но не отменяют radio errors, timing и response handling. CFRA применяется в предусмотренных сценариях и требует корректной конфигурации. Общая инфраструктура resources может быть общей, а completion criteria должны различаться.

   **Пример:** Handover UE получает dedicated RA resource; trace не должен ждать обычный contention-resolution path без основания.

   **Типичная ошибка:** Считать любой dedicated preamble гарантией успешного завершения доступа.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

74. Как управлять временным RA context?

   **Ответ:** Context должен иметь identity scope, generation, procedure state и deadlines. Cleanup освобождает reservations и buffers, а late PHY/RAR/Msg3 events проверяются против active procedure. Это инженерный lifecycle; конкретные normative transitions берутся из MAC TS. Ресурсный лимит защищает систему от накопления незавершённых процедур.

   **Пример:** После expiry повторно использован temporary identifier; старый Msg3 callback не должен завершить новую процедуру.

   **Типичная ошибка:** Хранить context до бесконечности, если PHY не прислал ожидаемый event.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

75. Как DRX влияет на eligibility DL UE?

   **Ответ:** DRX задаёт условия monitoring/Active Time через configured timers и procedures; это не один флаг asleep с фиксированным периодом. Scheduler должен знать, когда UE ожидаемо мониторит соответствующий control, с учётом retransmission и pending events. Поведение зависит от конфигурации и RAT. Выделенные PRBs бесполезны, если выбранная передача не соответствует control-monitoring conditions.

   **Пример:** Backlog появился вне допустимого monitoring interval: учесть ожидаемое пробуждение и HOL budget.

   **Типичная ошибка:** Планировать DCI только по наличию queue, игнорируя DRX state.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

76. Почему HARQ retransmission может менять DRX Active Time?

   **Ответ:** MAC определяет timers и условия, связанные с HARQ и ожиданием retransmissions. Они могут продлевать или создавать Active Time по правилам процедуры. Нельзя вывести monitoring только из long cycle и onDuration. В trace нужны timer start/stop/expiry и HARQ context, иначе DRX баг выглядит как случайный DTX.

   **Пример:** UE продолжает monitoring из-за retransmission-related state после окончания onDuration.

   **Типичная ошибка:** Завершать Active Time всегда строго по onDurationTimer expiry.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf).

77. Что scheduler должен знать о timing advance и TAG?

   **Ответ:** TA управляет UL timing alignment; TAG группирует serving cells по соответствующим правилам. Состояние timeAlignmentTimer влияет на допустимость UL и связанные процедуры. DL backlog не восстанавливает автоматически UL synchronisation. При CA нельзя считать одну TA величину безусловно общей для всех configured cells.

   **Пример:** Истёк alignment для TAG: проверить допустимые действия MAC и recovery path до новых UL allocations.

   **Типичная ошибка:** Продолжать обычные PUSCH grants после потери alignment, не проверив procedure.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

78. Когда неуспешный SR связан с random access?

   **Ответ:** UE следует configured SR procedure, счётчикам и условиям, при которых инициируется RA или выполняются другие нормативные действия. Сеть видит лишь часть этой истории, поэтому отсутствие SR не доказывает отсутствие данных. Диагностика объединяет SR resource configuration, PUCCH detection и RA events.

   **Пример:** UL data ждут, SR resource недоступен: проверить последовавший RA и timing configuration.

   **Типичная ошибка:** Считать RA только процедурой первоначального attach.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

79. Как beam failure recovery затрагивает L2 gNB?

   **Ответ:** Radio recovery изменяет доступность control/data paths и использует соответствующие MAC/RRC procedures, включая reports и RA в определённых сценариях. Scheduler должен учитывать updated serving/beam context и не смешивать normal channel degradation с recovery state. Конкретные действия зависят от cell и configured mechanism.

   **Пример:** DTX всплеск совпадает с BFR events: сопоставить beam/control recovery до изменения PF weights.

   **Типичная ошибка:** Лечить beam/control failure только снижением data MCS.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf).

80. Почему MAC reset требует отдельного сценария тестирования?

   **Ответ:** Reset меняет HARQ, timers и pending procedures по нормативным правилам; не все состояния верхних слоёв обязательно очищаются одинаково. Реализация должна перечислять, что происходит с in-flight PHY requests, buffers и identifiers. Важны interleavings: reset может прийти между prepare и completion.

   **Пример:** Reset после DCI publication и до feedback проверяется отдельным deterministic replay.

   **Типичная ошибка:** Выполнить memset UE context без согласованного завершения ownership и callbacks.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

## 9. RLC: режимы, segmentation и sequence space

81. Когда выбирают TM, UM и AM?

   **Ответ:** TM не добавляет обычный RLC data header и используется для предусмотренных logical channels; UM поддерживает segmentation/reassembly без ARQ; AM дополнительно обеспечивает ARQ и STATUS. Выбор задаётся radio configuration и требованиями bearer, а не произвольным переключением scheduler. AM не гарантирует бесконечное восстановление: есть failure procedures и ограничения времени/ресурсов.

   **Пример:** Для latency-sensitive traffic оценивать UM losses против AM delay по требованиям сервиса и допустимой конфигурации.

   **Типичная ошибка:** Считать UM режимом без segmentation, а AM эквивалентом TCP.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

82. Как NR RLC отличается от LTE RLC по concatenation?

   **Ответ:** В LTE RLC предусмотрена concatenation данных разных SDUs в одном data PDU с соответствующими boundary indicators. В NR RLC один data PDU переносит один SDU или его segment; multiplexing нескольких RLC PDUs выполняет MAC. Это меняет header accounting, очередь descriptors и API packing. Перенос LTE length-indicator logic в NR нарушает format.

   **Пример:** Два PDCP PDUs в NR передаются через отдельные RLC PDUs, которые MAC может включить в один TB.

   **Типичная ошибка:** Склеить два NR RLC SDUs под одним RLC header.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

83. Что обозначает SO и как сегменты связываются с SDU?

   **Ответ:** Segment Offset задаёт положение данных в исходном SDU/PDU согласно RAT и формату; в NR AM сегменты одного RLC SDU сохраняют один SN. Нужно хранить byte ranges без смешения header length и payload offsets. Наличие SO зависит от segment type; первый segment не следует автоматически оформлять как middle segment.

   **Пример:** NR SDU 1000 bytes: payload ranges [0,400), [400,750), [750,1000); SO продолжений 400 и 750.

   ```text
   Original NR RLC SDU: 1000 bytes, SN=77
   Segment 1: [0,400), first, no SO field
   Segment 2: [400,750), middle, SO=400
   Segment 3: [750,1000), last, SO=750
   All segments retain SN=77; headers consume separate bytes.
   ```

   **Типичная ошибка:** Увеличивать NR AM SN для каждого сегмента одного SDU.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

84. Есть ли SN в каждом NR UM data PDU?

   **Ответ:** Нет: целый несегментированный NR UMD PDU использует соответствующий SI format без SN; segmented formats содержат необходимые SN/SO поля по таблицам TS. Поэтому decoder должен сначала читать SI, а не безусловно извлекать SN. Метрики, индексированные только SN, не могут напрямую представлять все UM SDUs одинаково.

   **Пример:** Whole SDU поступает в UM: parser не съедает первые payload bytes как sequence number.

   ```text
   NR UMD whole SDU:      SI/R header | SDU bytes
   NR UMD first segment:  configured SN-bearing header | segment
   NR UMD continuation:   configured SN/SO-bearing header | segment
   Exact bit layout: TS 38.322 §6.2.2; do not parse SN before SI.
   ```

   **Типичная ошибка:** Выделять фиксированный UMD header с SN для всех NR packets.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

85. Какие SN widths нужно учитывать в LTE/NR RLC?

   **Ответ:** В выбранных Rel-17 версиях LTE UM использует 5/10 bits, LTE AM — 10/16; NR UM — 6/12, NR AM — 12/18. Конкретный width задаёт configuration и связан с форматом/window. Таблица возможностей должна учитывать RAT/mode и supported release. Нельзя определять width эвристически по первым bytes трафика.

   **Пример:** При смене bearer configuration decoder получает новый width до приёма PDUs нового context.

   **Типичная ошибка:** Жёстко считать LTE AM только 10-bit при любой конфигурации.

   **Источник:** [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

86. Как сравнивать SN при wraparound?

   **Ответ:** SN принадлежит циклическому пространству, поэтому обычный integer less-than не определяет protocol order. Сравнения привязывают к base/window и её допустимому размеру. Две точки на расстоянии ровно половины пространства неоднозначны без контекста; stale data вне окна отбрасываются по procedure. Для security COUNT это отдельная задача с HFN.

   **Пример:** В 12-bit пространстве после 4095 идёт 0; base=4094 позволяет упорядочить 4095,0,1 по modular distance.

   **Типичная ошибка:** Сортировать retransmission queue обычным numeric SN.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

87. Что происходит при потере segment в UM?

   **Ответ:** UM не запрашивает ARQ retransmission: receiver использует reassembly/window/timer procedures, завершает собираемые SDUs и отбрасывает неполные согласно TS. Потеря одного segment может потерять весь соответствующий SDU. Timer слишком большой повышает удержание buffers и latency, слишком маленький увеличивает discard при допустимой задержке arrival.

   **Пример:** Из трёх segments пришли первый и последний: отсутствие middle не компенсируется склейкой доступных bytes.

   **Типичная ошибка:** Доставить частично собранный PDCP PDU как корректный packet.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

88. Как RLC должен сообщать scheduler объём доступных данных?

   **Ответ:** API различает new data, retransmission data, pending control и минимальный полезный grant; указывает включённые headers и timestamp snapshot. Иначе scheduler не знает, можно ли реально сформировать PDU заданного размера. Snapshot и последующий pull требуют reservation либо явной обработки изменения состояния. Это контракт реализации, а не стандартизованный C++ API.

   **Пример:** Pending STATUS требует отдельного budget; queue bytes=0 не означает отсутствие RLC работы.

   **Типичная ошибка:** Возвращать одно число без единиц и включать headers дважды.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

89. Как безопасно собирать пересекающиеся segments?

   **Ответ:** Receiver проверяет SN/window, допустимые offsets, длину и end marker, поддерживает покрытие byte ranges и ограничивает memory usage. Дубликаты не должны увеличивать собранный размер или повторно доставлять SDU. Поведение для противоречивых данных должно быть определено, диагностируемо и не приводить к out-of-bounds. Range arithmetic требует overflow checks.

   **Пример:** Получены [0,500) и [300,700): union имеет 700 bytes, а не 900.

   ```text
   Received [0,500) and [300,700)
   Unique coverage = [0,700), length 700
   Complete only if known final SDU length is 700
   Duplicate/overlapping bytes do not increase unique coverage.
   ```

   **Типичная ошибка:** Считать сумму длин segments равной количеству уникально принятых bytes.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

90. Почему t-Reassembly и t-Reordering нельзя смешивать?

   **Ответ:** NR RLC использует t-Reassembly для соответствующих receive procedures, LTE RLC имеет t-Reordering, а PDCP располагает собственным t-Reordering. Название не определяет общий алгоритм: у слоёв разные states, start/stop conditions и expiry effects. В timer service нужны entity, timer kind и generation, а в метриках — layer/RAT.

   **Пример:** В trace указать NR/RLC/t-Reassembly отдельно от NR/PDCP/t-Reordering.

   **Типичная ошибка:** Перенести LTE RLC timer handler в NR, переименовав только переменную.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf).

## 10. RLC AM: polling, STATUS и retransmission

91. Какие состояния AM надо видеть при window stall?

   **Ответ:** Нужны lower/upper transmission bounds, next SN, outstanding SDUs/PDUs, pending retransmission ranges и receive/status state с соответствующими именами выбранного RAT. Важны не только queue length, но и расстояние до window edge. Если новое data заблокировано окном, увеличение MAC grant не устраняет причину. Диагностика должна показать последнее продвижение acknowledgment.

   **Пример:** New-data backlog большой, но transmit window заполнено: искать отсутствующее STATUS или потерянный range.

   **Типичная ошибка:** Лечить AM stall ростом PRB allocation без проверки ACK progress.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

92. Когда AM transmitter устанавливает poll?

   **Ответ:** Polling определяется нормативными условиями: configured thresholds, состоянием buffers/window и timer-related procedures. Это не простой poll на каждом N-м IP packet. Счётчики относятся к определённым TS объектам/bytes и сбрасываются по правилам. LTE и NR отличаются деталями; network implementation не может произвольно менять wire semantics.

   **Пример:** Проверить pollPDU/pollByte вместе с empty-buffer/window conditions, а не только периодический task.

   **Типичная ошибка:** Считать poll бит просьбой подтвердить только PDU, в котором он установлен.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

93. Как действует t-PollRetransmit?

   **Ответ:** Timer поддерживает получение acknowledgment progress при отсутствии ожидаемого STATUS. Expiry запускает предусмотренную RLC процедуру выбора данных/повторного polling, а не безусловную retransmission всего outstanding buffer. Для корректности нужны POLL_SN/context и transmit state. Запоздалый timer event не должен воздействовать на новую entity после re-establishment.

   **Пример:** После STATUS, продвинувшего acknowledgment, проверить остановку/актуальность timer по TS.

   **Типичная ошибка:** На каждом expiry заново отправлять все RLC данные и удваивать очередь.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

94. Как понимать ACK_SN вместе с NACK entries?

   **Ответ:** ACK_SN задаёт границу cumulative acknowledgment, но перечисленные NACKs исключают соответствующие SDUs/segments. Нужно применить semantics полного STATUS, проверить window и extensions, затем освобождать только действительно acknowledged данные. NR NACK может описывать range и byte offsets; ACK_SN сам по себе недостаточен.

   **Пример:** Условный NR STATUS ACK_SN=105, NACK_SN=102: ниже 105 остаётся неподтверждённым 102 согласно NACK detail.

   ```text
   Simplified NR AM example, no segment NACKs:
   ACK_SN = 105
   NACK_SN = 102
   Outstanding previously sent: 100,101,102,103,104
   Acknowledged: 100,101,103,104; keep 102 for recovery.
   Apply only after validating STATUS against active window/context.
   ```

   **Типичная ошибка:** Освободить все SN ниже ACK_SN до разбора NACK fields.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

95. Зачем нужен t-StatusProhibit?

   **Ответ:** Он ограничивает частоту передачи STATUS согласно AM procedure, уменьшая control overhead. Pending trigger не обязательно приводит к немедленному STATUS, пока действуют запреты/условия. Слишком редкий feedback может тормозить AM window, но таймер настраивают в пределах configuration. В диагностике различают trigger time, eligibility и actual transmission.

   **Пример:** Poll получен во время status prohibit: trace показывает pending report и момент разрешённой отправки.

   **Типичная ошибка:** Считать отсутствие немедленного STATUS после poll доказательством decoder failure.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

96. Что делать, если grant не вмещает полный STATUS?

   **Ответ:** Формирование ограниченного STATUS должно сохранять нормативную согласованность ACK_SN/NACK описания. Нельзя отбросить хвост NACKs и оставить границу, ошибочно подтверждающую потери. RLC сообщает минимальный размер и формирует допустимый report под budget; scheduler учитывает control backlog. Проверять нужно разные размеры grant на границе каждого extension.

   **Пример:** Report с несколькими losses сокращается так, чтобы не ACK данные, описание missing которых не поместилось.

   **Типичная ошибка:** Обрезать сериализованный STATUS по длине TB.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

97. Как resegmentation помогает RLC retransmission?

   **Ответ:** Если новый grant меньше исходной data unit, AM может передать требуемую часть по процедуре resegmentation. Идентичность исходных данных и offsets сохраняются; новый MAC TB при этом не обязан повторять старый MAC TB. Для NR AM тот же SDU SN используется с соответствующим segment description. Headers и минимальный grant пересчитываются.

   **Пример:** Missing byte range [400,900) восстанавливается несколькими меньшими разрешёнными segments.

   **Типичная ошибка:** Назначить новый NR AM SN повторяемой части старого SDU.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

98. Что означает достижение maxRetxThreshold?

   **Ответ:** Это protocol failure indication по RLC procedure, а не команда бесконечно продолжать повторы. Upper layers принимают дальнейшие действия в соответствующем context. Счётчик связан с нормативной единицей/событием, поэтому не равен сумме всех HARQ attempts. В production нужен reason с bearer и relevant SN/range без раскрытия payload.

   **Пример:** Несколько HARQ retransmissions одной RLC передачи не должны автоматически стать тем же числом RLC RETX_COUNT increments.

   **Типичная ошибка:** Увеличивать RLC counter на каждый PHY NACK.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

99. Как отличить radio loss от ошибки обработки STATUS?

   **Ответ:** Сопоставляют реально переданные data ranges, decoded STATUS, transmit-window changes и последующие retransmissions. При radio loss receiver reports согласованы с пропусками; при parser/state bug могут появиться невозможные ACK bounds, повторное освобождение или игнорирование valid report. Полезен replay сохранённых headers с независимой моделью.

   **Пример:** STATUS received counter растёт, но lower window edge не меняется при valid cumulative ACK: проверить apply path.

   **Типичная ошибка:** Диагностировать только по агрегированному проценту RLC retransmissions.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

100. Нужно ли ждать предыдущий SN перед передачей complete NR RLC SDU в PDCP?

   **Ответ:** В NR RLC complete SDUs передаются upper layer по соответствующей receive procedure; in-order delivery нельзя автоматически переносить из LTE RLC. Reassembly/window state всё равно нужны, а PDCP может выполнять reordering. Для конкретного mode проверяют TS 38.322, а не строят универсальный reorder gate по примеру LTE.

   **Пример:** Полный NR SDU SN=12 может уйти выше, пока другой SDU ещё неполон; PDCP решает свой ordering отдельно.

   **Типичная ошибка:** Добавить не предусмотренный NR RLC head-of-line gate и получить лишнюю задержку.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf).

## 11. PDCP: COUNT, security, reordering и duplication

101. Зачем нужен PDCP SN, если уже существует RLC SN?

   **Ответ:** PDCP поддерживает свой порядок и процедуры поверх нижних путей; segmentation и retransmission RLC не должны менять идентичность исходного PDCP PDU. При split/duplication один PDCP context может использовать разные RLC entities с независимыми SN spaces. Нельзя выводить PDCP loss из разности RLC SN без reconstruction и configuration.

   **Пример:** Один PDCP PDU сегментируется на несколько NR RLC PDUs с общим RLC SDU SN, отличным от PDCP SN.

   **Типичная ошибка:** Считать PDCP SN и RLC SN одним сквозным sequence number.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

102. Как связаны COUNT, HFN и PDCP SN?

   **Ответ:** COUNT объединяет hyper frame number и configured SN space; передаваемый SN — только часть полной идентичности. Receiver восстанавливает соответствующий COUNT в пределах procedure/window. Обычное сравнение SN через wrap не заменяет этот алгоритм. Security использует COUNT вместе с другими параметрами, поэтому неверный HFN вызывает не только ordering bug.

   **Пример:** После максимального SN следующий SN=0 относится к следующему HFN, если procedure определяет этот rollover.

   ```text
   COUNT = HFN × 2^SN_bits + SN
   Example with 12-bit SN:
   HFN=7, SN=4095 → COUNT=32767
   HFN=8, SN=0    → COUNT=32768
   Receiver COUNT reconstruction still follows the PDCP procedure.
   ```

   **Типичная ошибка:** Сбрасывать security COUNT при каждом SN wrap.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 33.501: 5GS security](https://www.3gpp.org/dynareport/33501.htm).

103. Какие параметры важны для PDCP security?

   **Ответ:** Помимо ключей/алгоритмов значимы COUNT, bearer identity, direction и security configuration. Ciphering и integrity имеют разные назначения, а применение зависит от bearer и negotiated capabilities/configuration. Нельзя включать user-plane integrity по предположению или логировать ключи для диагностики. Проверять нужно границы protected data и order processing.

   **Пример:** Ошибка direction при корректном key даёт неверный результат security, хотя RLC/MAC delivery успешен.

   **Типичная ошибка:** Искать только radio loss при систематическом integrity failure после reconfiguration.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 33.501: 5GS security](https://www.3gpp.org/dynareport/33501.htm); [3GPP TS 36.323 V17.0.0: LTE PDCP](https://www.etsi.org/deliver/etsi_ts/136300_136399/136323/17.00.00_60/ts_136323v170000p.pdf); [3GPP TS 33.401: EPS security](https://www.3gpp.org/dynareport/33401.htm).

104. Как PDCP t-Reordering влияет на latency?

   **Ответ:** Receiver использует reordering state и timer по configured procedure, чтобы не ждать пропавшие данные бесконечно. Это создаёт компромисс между tolerable path skew и delay; expiry не означает повторную передачу PDCP через тот же механизм. При out-of-order delivery configuration поведение отличается. Метрики должны показывать arrival, delivery и timer-induced waiting отдельно.

   **Пример:** Packets через две legs приходят с разной задержкой; большой timer увеличивает HOL при реальной потере.

   **Типичная ошибка:** Снижать scheduler priority, увидев PDCP delay, не проверив gap и timer.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf).

105. Чем discardTimer отличается от t-Reordering?

   **Ответ:** Discard относится к transmitter-side handling SDUs по procedure, reordering — к receiver-side порядку/обнаружению потерь. Expiry discard не даёт права произвольно удалять уже опубликованные HARQ buffers. Нужно согласовать upper-layer discard notification с состоянием нижних слоёв и нормативными ограничениями. Для мониторинга различают queue drop и radio delivery failure.

   **Пример:** Просроченный PDCP SDU, ещё не ушедший в нижний слой, и уже сегментированный RLC SDU требуют разных путей обработки.

   **Типичная ошибка:** Удалять один shared buffer без уведомления всех владельцев.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

106. Чем PDCP duplication отличается от RLC/HARQ retransmission?

   **Ответ:** Duplication передаёт связанные копии PDCP data по configured lower paths для reliability/latency. Receiver устраняет дубликаты по PDCP context. Это увеличивает radio/backhaul load и требует корректной activation configuration; не всякий split bearer означает duplication. Lower-layer copies имеют собственные RLC/HARQ histories.

   **Пример:** Две legs доставили один COUNT: upper delivery должна произойти один раз.

   **Типичная ошибка:** Считать каждую принятую копию новым user packet в goodput.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf).

107. Как ROHC влияет на обработку PDCP?

   **Ответ:** ROHC использует согласованные compression contexts и profiles; это не независимое сжатие каждого IP header без состояния. Context loss/recovery и feedback влияют на корректность decompression. Поддержка/configuration зависят от bearer. В throughput accounting compressed bytes отличаются от IP payload; сохранённый radio header не равен исходному packet header.

   **Пример:** После mobility проверить корректность context handling, если MAC/RLC принимают данные, а decompression failures растут.

   **Типичная ошибка:** Декомпрессировать произвольный пакет без нужного context и считать ошибку повреждением RLC.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 36.323 V17.0.0: LTE PDCP](https://www.etsi.org/deliver/etsi_ts/136300_136399/136323/17.00.00_60/ts_136323v170000p.pdf).

108. Зачем PDCP status и data recovery при mobility?

   **Ответ:** Они помогают обработать delivery state и восстановление данных в предусмотренных сценариях re-establishment/recovery/transfer. Это не тот же STATUS, что RLC AM: формат, SN space и trigger отличаются. Нужно определить, какие данные сохраняются, какие передаются по новой leg и где устраняются duplicates. Возможности зависят от procedure и configuration.

   **Пример:** После смены нижнего пути использовать PDCP-level state вместо переноса старого RLC SN window вслепую.

   **Типичная ошибка:** Передать RLC ACK_SN как PDCP delivery boundary.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf).

109. Всегда ли LTE bearer использует только TS 36.323?

   **Ответ:** Нет: interworking и dual-connectivity configurations могут использовать NR PDCP для соответствующих bearers. RAT радиолинии сам по себе не определяет весь protocol stack. Перед анализом packet format нужно установить bearer type, architecture и negotiated configuration. Особенно опасно определять PDCP header width исключительно по LTE/NR cell label.

   **Пример:** LTE-connected UE с определённой DC configuration требует проверки фактического PDCP protocol/configuration.

   **Типичная ошибка:** Выбирать decoder TS 36.323 только по EARFCN в trace.

   **Источник:** [3GPP TS 36.323 V17.0.0: LTE PDCP](https://www.etsi.org/deliver/etsi_ts/136300_136399/136323/17.00.00_60/ts_136323v170000p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 36.300: LTE architecture](https://www.3gpp.org/dynareport/36300.htm).

110. Как измерить latency отдельно для PDCP, RLC и MAC?

   **Ответ:** Определяют boundaries и clock domain: ingress SDU, enqueue/dequeue, first transmission, completion и upper delivery. Односторонняя задержка требует согласованного времени либо локальных интервалов. Нельзя складывать overlapping intervals и считать retransmission bytes новыми данными. Для per-packet correlation нужны доступные layer identifiers, а не один общий SN.

   **Пример:** PDCP wait 3 ms, RLC wait 2 ms и MAC HARQ residence могут частично перекрываться: фиксировать реальные timestamp intervals.

   **Типичная ошибка:** Назвать время от MAC enqueue до ACK end-to-end application latency.

   **Источник:** [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

## 12. SDAP, QoS и scheduler policy

111. Чем QFI отличается от 5QI, DRB, LCID и LCG?

   **Ответ:** QFI идентифицирует QoS flow внутри соответствующей PDU session; 5QI описывает QoS characteristics. DRB переносит mapped flows, LCID обозначает logical channel MAC, LCG используется для UL reporting. Между ними нет универсального взаимно-однозначного соответствия. Scheduler нуждается в актуальном mapping и policy, а не в арифметическом преобразовании идентификаторов.

   **Пример:** Несколько QFI могут отображаться в один DRB, а несколько LC входят в один LCG.

   ```text
   PDU session
     QoS flow QFI=a ─┐
     QoS flow QFI=b ─┴─> DRB x → RLC bearer → LCID y → LCG z (UL)
   Mapping/configuration decides cardinality; identifiers are not interchangeable.
   ```

   **Типичная ошибка:** Считать LCID=QFI или создавать один HARQ process на QoS flow.

   **Источник:** [3GPP TS 37.324 V17.0.0: SDAP](https://www.etsi.org/deliver/etsi_ts/137300_137399/137324/17.00.00_60/ts_137324v170000p.pdf); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

112. Как SDAP mapping влияет на наблюдаемость scheduler?

   **Ответ:** SDAP отображает QoS flows в DRBs по configured rules; после объединения flows нижний слой может не видеть их исходные различия напрямую. Поэтому policy и metadata contracts должны определить, какая QoS информация доступна scheduler. Нельзя обещать per-QFI isolation только на основании per-DRB queue. Mapping changes требуют согласованного перехода.

   **Пример:** Два flow с разными arrival patterns в одном DRB: lower queue HOL не обязательно описывает каждый flow.

   **Типичная ошибка:** Оценивать per-flow PDB только по одной суммарной RLC queue.

   **Источник:** [3GPP TS 37.324 V17.0.0: SDAP](https://www.etsi.org/deliver/etsi_ts/137300_137399/137324/17.00.00_60/ts_137324v170000p.pdf); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm).

113. Можно ли считать 5QI простым scheduler priority?

   **Ответ:** Нет: 5QI связан с набором QoS characteristics, включая resource type, priority level, delay/error characteristics по соответствующей модели. Есть standardised и non-standardised characteristics. Итоговая radio policy учитывает admission, capability и available resources. Нельзя превращать любой numeric 5QI в сортировку по самому номеру.

   **Пример:** Flow с меньшим числом 5QI не обязательно получает больше PRBs при любой конфигурации.

   **Типичная ошибка:** Сортировать UEs по raw 5QI value.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm).

114. Как различать GFBR, MFBR и aggregate limits?

   **Ответ:** GFBR/MFBR задают соответствующие гарантированные/максимальные flow rates, aggregate limits относятся к своим scope и правилам. Rate enforcement требует правильной единицы, averaging window и accounting boundary. Это не обещание мгновенной скорости в каждом slot. Реализация scheduler должна разделять admission feasibility, guaranteed-service accounting и limiting.

   **Пример:** Flow временно передаёт burst выше среднего GFBR, если policy и limits допускают это.

   **Типичная ошибка:** Обрезать каждый slot ровно до GFBR × slot duration без token/averaging model.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm).

115. Чем ARP отличается от packet scheduling priority?

   **Ответ:** Allocation and Retention Priority относится к admission/retention и pre-emption decisions в модели QoS, а не заменяет priority characteristics для каждого packet. Использование ARP как постоянного weight может дать поведение, не соответствующее intended policy. Нужно явно описать, какой параметр применяется на этапе admission и какой — к текущей allocation.

   **Пример:** При overload ARP участвует в решении сохранить bearer, затем packet scheduler применяет свою QoS policy.

   **Типичная ошибка:** Всегда обслуживать traffic только по ARP, игнорируя delay и GBR.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm).

116. Как admission связан с radio feasibility?

   **Ответ:** Обещания должны учитывать ожидаемую spectral efficiency, control/feedback overhead, retransmissions, UL power и temporal constraints. Сумма nominal bitrate не равна доступной capacity для UE у cell edge. Policy выбирает margin и реагирует на изменения channel/load; 3GPP не задаёт одну формулу оптимального admission scheduler.

   **Пример:** Два GBR bearers с одинаковой rate требуют разных ресурсов при разных channel conditions.

   **Типичная ошибка:** Принимать все GBR requests по сумме theoretical peak cell rate.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf).

117. Как разложить packet delay budget на инженерные бюджеты?

   **Ответ:** Сначала определить нормативные reference points QoS модели и оставшуюся долю для RAN, затем измерить transport, queueing, processing и radio intervals. Для scheduler нужен local deadline/HOL target с обоснованными assumptions. Нельзя выдать весь end-to-end budget одной RLC queue или обещать соблюдение PDB только по среднему.

   **Пример:** Из локального RAN budget выделить время на queueing, PHY/HARQ и transport; проверять tail latency.

   ```text
   Choose explicit reference points before measuring:
   transport interval + processing intervals + radio/queue intervals
   Local scheduler deadline = justified share of the applicable budget
   Use non-overlapping intervals; report tail latency, not just average.
   ```

   **Типичная ошибка:** Сравнивать MAC queue delay с PDB без учёта границ измерения.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm).

118. Для чего SDAP end-marker при remapping?

   **Ответ:** В предусмотренной procedure end-marker участвует в обработке перехода mapping и ordering между old/new DRBs. Это SDAP control semantics, а не универсальный конец IP stream. Поддержка и момент отправки определяются SDAP configuration/procedure. Lower layers должны корректно переносить marker, не смешивая его с GTP-U End Marker.

   **Пример:** QoS flow переводится на другой DRB: разобрать именно SDAP remapping sequence.

   **Типичная ошибка:** Использовать GTP-U End Marker как замену SDAP control PDU.

   **Источник:** [3GPP TS 37.324 V17.0.0: SDAP](https://www.etsi.org/deliver/etsi_ts/137300_137399/137324/17.00.00_60/ts_137324v170000p.pdf); [3GPP TS 29.281: GTP-U](https://www.3gpp.org/dynareport/29281.htm).

119. Почему UL QoS сложнее восстановить из BSR?

   **Ответ:** BSR агрегирует по LCG и не передаёт полный per-flow backlog/HOL. Даже при известном LC mapping остаются uncertainty и UE LCP. gNB может использовать history, configuration и другие допустимые наблюдения, но должен отличать оценку от измерения. Слишком грубый mapping затрудняет policy enforcement.

   **Пример:** Voice и bulk в одной LCG: положительный BSR не сообщает, сколько voice bytes ждёт deadline.

   **Типичная ошибка:** Публиковать точный per-QFI UL queue delay, имея только BSR.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 37.324 V17.0.0: SDAP](https://www.etsi.org/deliver/etsi_ts/137300_137399/137324/17.00.00_60/ts_137324v170000p.pdf).

120. Как обнаружить starvation без ухудшения high-priority service?

   **Ответ:** Нужно измерять service gaps, per-bearer progress и tail HOL, учитывая eligibility и admission. Aging/minimum-service policies — выбор реализации, проверяемый против QoS obligations. Низкий average throughput может объясняться отсутствием demand, поэтому нужен backlogged-and-eligible denominator. Одна aggregate fairness метрика скрывает крайние случаи.

   **Пример:** UE непрерывно eligible 200 ms и не получает service: проверить score/weights и feasibility reasons.

   **Типичная ошибка:** Считать UE starving по нулевой скорости, когда у неё нет данных или доступного control.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm).

## 13. CA, dual connectivity, mobility и CU/DU

121. Чем carrier aggregation отличается от dual connectivity для L2?

   **Ответ:** CA объединяет serving cells в рамках соответствующей MAC entity/cell group; DC использует master/secondary cell groups с отдельными MAC contexts. Архитектура PDCP/RLC и bearer routing зависит от bearer type. Поэтому единый UE identifier не означает единый HARQ pool или общий BSR context для всех путей.

   **Пример:** При DC два MAC contexts имеют собственные serving-cell/HARQ states, хотя traffic относится к одному UE.

   ```text
   CA: cell group / MAC entity → multiple serving cells
   DC: master cell group / MAC + secondary cell group / MAC
   HARQ identity includes the applicable cell/group/process scope.
   ```

   **Типичная ошибка:** Объединить process ID двух cell groups в один массив без scope.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 36.300: LTE architecture](https://www.3gpp.org/dynareport/36300.htm); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

122. Как cross-carrier scheduling влияет на resource reservation?

   **Ответ:** Control transmission может назначать data resources другой serving cell по configured procedure. Тогда scheduler связывает control-cell capacity и target-cell data/feedback constraints. Наличие PDSCH ресурсов на target не гарантирует возможность выдать соответствующий DCI. Лог должен различать scheduling cell и scheduled cell.

   **Пример:** Target SCell свободна, но control resources scheduling cell исчерпаны.

   **Типичная ошибка:** Списать CCE и PRB всегда на одну cell, не проверяя configuration.

   **Источник:** [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

123. Почему смена BWP затрагивает L2 state?

   **Ответ:** Active BWP определяет доступные resource parameters и control/data configuration. Pending allocations и timing нужно интерпретировать в правильном configuration epoch. Нельзя заменить ширину массива PRB и сохранить все старые indexes. Переход выполняется согласно процедурам и processing constraints, с проверкой in-flight work.

   **Пример:** Decision создан до BWP switch: перед publication проверить, действуют ли его CORESET и time-domain assumptions.

   **Типичная ошибка:** Использовать cached resource map старой BWP для нового DCI.

   **Источник:** [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf).

124. Как SCell activation/deactivation влияет на eligibility?

   **Ответ:** Configured SCell не обязательно active и доступна для обычного scheduling. MAC procedures/timers и UE readiness задают соответствующие условия. Деактивация требует обработки associated state по TS, а не только скрытия cell из UI. Важно согласовать CA decisions и pending HARQ/resources.

   **Пример:** Backlog есть, но SCell inactive: причина no-allocation отличается от low PF score.

   **Типичная ошибка:** Планировать на всех configured carriers независимо от activation state.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

125. Какие данные важны при handover для L2?

   **Ответ:** Нужно различать configuration transfer, user-data forwarding, delivery status и reset/re-establishment нижних entities по конкретной mobility procedure. Сохранение PDCP continuity не означает перенос всех HARQ processes на target. Для каждого buffer указывают ownership и допустимость повторной передачи, учитывая duplicates и security context.

   **Пример:** Source HARQ TB не переносится как target HARQ process только потому, что forwarding сохранил PDCP data.

   **Типичная ошибка:** Скопировать UE context побайтно между cells с разными clocks/configurations.

   **Источник:** [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

126. Как управлять split bearer без бесконтрольного buffering?

   **Ответ:** PDCP routing policy учитывает доступность legs, delay, capacity и feedback; F1/inter-node transport добавляет свою задержку. Балансирование по равному числу packets может создать большой reordering skew. Нужны bounded queues, flow-control signals и метрики per-leg residence. Конкретный алгоритм распределения — решение реализации.

   **Пример:** Медленная leg получает меньше новых data, если её очередь растёт, чтобы не удерживать PDCP delivery на быстрой leg.

   **Типичная ошибка:** Делить каждый второй packet между legs без измерения delay.

   **Источник:** [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.300 V17.6.0: NR / NG-RAN overview](https://www.etsi.org/deliver/etsi_ts/138300_138399/138300/17.06.00_60/ts_138300v170600p.pdf); [3GPP TS 38.425: NR user plane protocol](https://www.3gpp.org/dynareport/38425.htm).

127. Чем RLC re-establishment отличается от PDCP data recovery?

   **Ответ:** Операции относятся к разным entities и имеют отдельные правила сохранения/сброса state. RLC re-establishment не является универсальным PDCP COUNT reset; PDCP recovery не восстанавливает старый HARQ context. Порядок определяется signalling procedure. Код должен реализовывать явные layer-specific действия, а не общий clear_all.

   **Пример:** После change lower path PDCP может сохранять требуемую continuity, пока RLC получает новое state.

   **Типичная ошибка:** Сбросить security COUNT вместе с RLC SN без нормативного основания.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

128. Зачем F1-U flow control разработчику DU scheduler?

   **Ответ:** CU-UP не видит мгновенную radio capacity непосредственно. Delivery/status и flow-control information в соответствующем user-plane protocol помогают ограничивать и направлять подачу данных. Неправильный feedback создаёт DU overflow либо radio starvation. Нужно различать transport delivery и успешную radio/PDCP delivery, следуя semantics конкретных полей.

   **Пример:** DU backlog растёт при fading: проверить, отражается ли это в flow-control feedback CU-UP.

   ```text
   CU-UP SDAP/PDCP → F1-U → DU RLC/MAC → PHY
                      ← applicable delivery/flow-control information
   Transport receive != radio delivery != application delivery
   ```

   **Типичная ошибка:** Считать UDP socket receive rate достаточным end-to-end flow control.

   **Источник:** [3GPP TS 38.425: NR user plane protocol](https://www.3gpp.org/dynareport/38425.htm); [3GPP TS 38.401: NG-RAN architecture](https://www.3gpp.org/dynareport/38401.htm).

129. Почему GTP-U tunnel ID не равен radio bearer identity во всех contexts?

   **Ответ:** TEID имеет scope tunnel endpoint/transport context и сопоставляется с bearer/session state через configuration. Radio identifiers имеют другие scope и lifecycle. После modification или reuse stale mapping может направить packets в чужой context. Таблица должна включать endpoint/session scope и generation там, где это нужно реализации.

   **Пример:** Одинаковый numeric TEID у разных endpoints не означает один DRB.

   **Типичная ошибка:** Использовать raw TEID как глобальный UE key.

   **Источник:** [3GPP TS 29.281: GTP-U](https://www.3gpp.org/dynareport/29281.htm); [3GPP TS 38.401: NG-RAN architecture](https://www.3gpp.org/dynareport/38401.htm); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

130. Как отличить разные end markers при debugging mobility?

   **Ответ:** GTP-U End Marker и SDAP end-marker принадлежат разным протоколам и процедурам. Первый связан с соответствующим user-plane transport handling, второй — с SDAP mapping semantics. Их payload, route и state effects нельзя подменять друг другом. Trace должен указывать layer, message type и context.

   **Пример:** В mobility capture отдельно отметить GTP-U marker на tunnel и SDAP control PDU внутри radio bearer.

   **Типичная ошибка:** Обозначать оба сообщения одной строкой end_of_stream и завершать bearer.

   **Источник:** [3GPP TS 29.281: GTP-U](https://www.3gpp.org/dynareport/29281.htm); [3GPP TS 37.324 V17.0.0: SDAP](https://www.etsi.org/deliver/etsi_ts/137300_137399/137324/17.00.00_60/ts_137324v170000p.pdf).

## 14. C/C++ реализация L2: ownership, concurrency и bounded state

131. Как организовать packet buffers в L2?

   **Ответ:** Полезно явно моделировать owner, payload bounds, headroom/tailroom и lifecycle переходов. Pools ограничивают allocation cost, но требуют контроля exhaustion и возврата blocks. Headers и payload могут иметь разные lifetime; immutable views безопасны только пока жив owner. Решение о contiguous/scatter buffers принимают с учётом PHY interface и профиля.

   **Пример:** RLC отдаёт move-only descriptor, MAC передаёт PHY handle, completion возвращает buffer в pool.

   **Типичная ошибка:** Хранить span на stack buffer после возврата packing function.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [SCF: 5G FAPI specification](https://www.smallcellforum.org/5g-fapi-for-mac-phy-interoperability/).

132. Когда single-writer state упрощает scheduler?

   **Ответ:** Один owner UE/cell state уменьшает data races и позволяет применять события последовательно. Другие threads передают immutable messages через bounded queues. Но single writer не устраняет deadlines, queue overflow и ordering между clock domains. Partitioning должно учитывать cross-cell decisions и shared resources.

   **Пример:** PHY callback enqueue-ит result; только cell executor меняет HARQ process.

   **Типичная ошибка:** Добавить mutex к части полей и читать остальные без согласованного snapshot.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

133. Как задать deterministic ordering событий?

   **Ответ:** Определяют timestamp domain, event class и tie-break sequence; явно описывают, когда late event допустим и как обрабатывается. Нельзя считать arrival order threads истинным radio order. Replay сохраняет configuration epoch и исходный порядок ingress, а policy решения должны быть воспроизводимы при одинаковых входных данных.

   **Пример:** Timer expiry и ACK одного logical tick обрабатываются по документированному порядку, проверенному against procedure.

   **Типичная ошибка:** Использовать unordered container iteration для выбора UE при равном score.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

134. Как защититься от late events после UE release?

   **Ответ:** Numeric UE/RNTI может быть reused, поэтому internal handle должен различать lifetime instances. Проверка generation выполняется до доступа к mutable state; ownership обеспечивает lifetime памяти независимо от логического validity. Это инженерный pattern, а не новый over-the-air identifier. Нужны tests release/recreate под pending callbacks.

   **Пример:** Handle {ue_slot=7,generation=42}; новая UE в slot 7 имеет generation=43 и игнорирует старый callback.

   ```cpp
   #include <cstdint>

   struct UeHandle { std::uint32_t slot; std::uint64_t generation; };
   struct UeState { std::uint64_t generation; bool active; };

   // Call on the state-owning executor while UeState storage is valid.
   bool accepts(const UeState& state, UeHandle handle) noexcept {
       return state.active && state.generation == handle.generation;
   }
   // Resolve slot with bounds checking first. This is not memory ownership.
   ```

   **Типичная ошибка:** Проверять только RNTI, затем разыменовывать освобождённый pointer.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

135. Почему отмены timer недостаточно без generation check?

   **Ответ:** Cancel может состязаться с уже поставленным в очередь expiry. Timer event должен содержать entity lifetime и timer-arm version; handler проверяет обе. Повторный arm делает старую expiry неактуальной даже в живой entity. Освобождение memory и protocol stop conditions — отдельные обязанности.

   **Пример:** t-Reassembly rearmed: ранее queued expiry с предыдущим arm_id не меняет receive state.

   ```text
   arm timer: {entity_generation=12, arm_id=8, deadline=t}
   rearm:     {entity_generation=12, arm_id=9, deadline=t2}
   late expiry arm_id=8 → ignore
   release/recreate entity → generation changes; old expiries ignored
   ```

   **Типичная ошибка:** Считать cancel гарантией, что callback физически никогда не выполнится.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

136. Как применять configuration update без смешения epochs?

   **Ответ:** Подготовить и validate новый immutable snapshot, выбрать допустимую transition boundary, затем атомарно опубликовать для соответствующего executor. In-flight work хранит нужный старый context либо отменяется по explicit rules. Не все protocol states можно просто продолжить: reconfiguration может требовать reset/re-establishment.

   **Пример:** Decoder использует SN width snapshot, с которым пришёл PDU, а scheduler не смешивает старый CORESET с новой BWP.

   **Типичная ошибка:** Обновлять поля shared config по одному во время packing.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

137. Почему bit fields C/C++ не подходят как универсальный wire format?

   **Ответ:** Layout, ordering и padding language bit-fields зависят от реализации и ABI. Network format разбирают явными masks/shifts и bounds-checked byte readers, указывая bit numbering. ASN.1 RRC encoding — отдельный PER format и не равен MAC headers. Host endian не определяет wire bit order.

   **Пример:** Сначала прочитать byte в uint8_t, затем извлечь документированные поля; многобайтные values собрать явно.

   **Типичная ошибка:** reinterpret_cast wire buffer в packed struct и считать portability доказанной.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [ITU-T X.691: ASN.1 Packed Encoding Rules](https://www.itu.int/rec/T-REC-X.691); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

138. Как реализовать bounded modular SN helper?

   **Ответ:** Helper должен проверять width/range и возвращать distance относительно конкретной base, а caller применяет normative window. Простая функция before корректна только при оговорённом горизонте меньше half-space; она не заменяет protocol receive procedure. Для NR AM 18-bit промежуточный тип должен вмещать расчёт без signed overflow.

   **Пример:** distance(0,4094,4096)=2; значение принимается только если входит в актуальное окно.

   ```cpp
   #include <cstdint>
   #include <optional>

   // Distance from base; caller applies the actual protocol window.
   std::optional<std::uint32_t> sn_distance(
       std::uint32_t sn, std::uint32_t base, unsigned bits) noexcept {
       if (bits == 0 || bits > 18) return std::nullopt;
       const std::uint32_t modulus = std::uint32_t{1} << bits;
       if (sn >= modulus || base >= modulus) return std::nullopt;
       return (sn + modulus - base) % modulus;
   }
   // sn_distance(0, 4094, 12) == 2. No universal ordering beyond a window.
   ```

   **Типичная ошибка:** Применить signed int16_t trick к 18-bit SN.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

139. Как bounded queues меняют overload handling?

   **Ответ:** Ограниченная очередь требует явной политики при exhaustion: backpressure, допустимый drop, admission отказ или deferred processing. Нельзя молча терять control/feedback events, поскольку это портит state. Отдельные budgets для data и critical events помогают, но priority не должна приводить к starvation. Метрики показывают причину и scope потерь.

   **Пример:** Переполнение data ingress запускает предусмотренный backpressure, а ACK events не исчезают без записи failure path.

   **Типичная ошибка:** Использовать unbounded queue и обнаружить overload по OOM через минуту.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.425: NR user plane protocol](https://www.3gpp.org/dynareport/38425.htm).

140. Какие state assertions особенно полезны в L2?

   **Ответ:** Проверяют TB byte budget, unique ownership, valid process transition, window membership, nonoverlapping reservations и bounded counters. Assertions отделяют programming bugs от некорректного внешнего input, для которого нужен controlled reject. В real-time path дорогие проверки можно выносить в debug/replay, сохраняя необходимые runtime bounds checks.

   **Пример:** Перед commit проверить, что один PRB-symbol region не зарезервирован дважды конфликтующими grants.

   **Типичная ошибка:** Убрать parser bounds checks ради скорости вместе с debug assertions.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

## 15. Проверка correctness и real-time performance

141. Какие unit tests нужны для MAC/RLC codecs?

   **Ответ:** Нужны golden vectors из independently derived formats, границы length fields, все supported SN widths, segments и CE variants. Roundtrip полезен, но одинаковая ошибка encoder/decoder может его скрыть. Expected bytes должны быть объяснимы через выбранную TS version. Malformed inputs проверяют controlled failure без state corruption.

   **Пример:** Vector с whole NR UMD SDU проверяет отсутствие SN; segmented vectors проверяют SI/SO variants.

   ```text
   Codec cases:
   - exact golden bytes from a separately reviewed format
   - minimum/maximum valid length; truncated length field
   - whole/first/middle/last NR RLC data
   - every supported SN width; wrap boundaries
   - malformed extension chain; reject without out-of-bounds
   ```

   **Типичная ошибка:** Генерировать expected output тем же serializer, который тестируется.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

142. Какие property tests полезны для SN и ranges?

   **Ответ:** Генерируют wraparound, overlapping/duplicate segments и reorder sequences в пределах заданных assumptions. Проверяют уникальную delivery, bounded memory, корректную union coverage и отсутствие acknowledgment невосстановленных bytes. Случайные значения вне protocol model не заменяют meaningful scenarios; rejected inputs тоже имеют expected semantics.

   **Пример:** Любой порядок segments одного SDU с duplicates даёт ровно одну полную delivery после достаточного покрытия.

   **Типичная ошибка:** Тестировать только SN=0,1,2 и никогда не пересекать wrap.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html).

143. Как fuzzing применить к L2 parser?

   **Ответ:** Входом служат bytes и ограниченная configuration; запрещены unbounded allocation и бесконечные loops. Помимо crash проверяют invariants: consumed length, no side effects on rejected structural input и bounded execution. Seed corpus содержит valid variants и boundary cases. Sanitizers помогают обнаружить memory/UB errors, но не подтверждают protocol correctness.

   **Пример:** Mutate CE length и extension bits; reject должен завершаться за ограниченное число шагов.

   **Типичная ошибка:** Подключить fuzzing к live scheduler state и получать невоспроизводимые failures.

   **Источник:** [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

144. Что сохранять для deterministic replay scheduler?

   **Ответ:** Configuration epochs, clock events, queue snapshots/ingress, PHY indications, random seeds и policy inputs. Payload часто можно заменить размером/идентичностью, если тест не проверяет codec/security. Replay должен воспроизводить reservations, scores и state transitions, а не только average throughput. Нужно версионировать trace schema.

   **Пример:** Повтор одного input log даёт тот же UE selection и no-allocation reason на каждом decision point.

   **Типичная ошибка:** Сохранять только DCI outputs и ожидать восстановить отсутствующие inputs.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

145. Как тестировать protocol timers без wall-clock sleeps?

   **Ответ:** Используют controllable logical clock и event executor. Проверяют start/stop/rearm, simultaneous events, expiry после release и jumps через wrap. Expected effects берут из конкретной procedure. Отдельный integration test проверяет связь logical clock с runtime timing source; unit tests не должны зависеть от удачного OS scheduling.

   **Пример:** Advance до deadline−1: expiry нет; до deadline: ровно одна актуальная expiry.

   ```text
   clock=t0: start timer(deadline=t0+10)
   advance(t0+9): no expiry
   rearm(deadline=t0+20)
   advance(t0+10): stale event ignored
   advance(t0+20): exactly one current expiry
   ```

   **Типичная ошибка:** Делать sleep в каждом timer test и получать flaky suite.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

146. Какие сценарии обязательны для scheduler evaluation?

   **Ответ:** Нужны разные channel distributions, saturated/bursty traffic, mixed QoS, cell-edge UL power, CA/DC, DRX и controlled loss. Проверяют resource validity, service gaps, tail latency и полезный throughput. Одинаковый traffic seed помогает comparison, но policy должна выдержать несколько независимых workloads. Peak single-UE result недостаточен.

   **Пример:** Сравнить PF/weights при 1 UE и 50 UEs, затем при burst arrivals и плохом UL power budget.

   ```text
   Workload matrix:
   1/50 UEs × full-buffer/bursty × good/cell-edge channel
   + mixed QoS, DRX, UL power limits, CA/DC and controlled losses
   Metrics: unique goodput, service gaps, tail HOL, deadline misses, validity
   ```

   **Типичная ошибка:** Оптимизировать только full-buffer DL в идеальном channel.

   **Источник:** [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm).

147. Как профилировать L2 с учётом deadlines?

   **Ответ:** Измеряют execution distribution и queue wait по стадиям, deadline misses, CPU/cache activity и input load. Среднее CPU может быть низким при редких длинных pauses. Sampling profiler связывают с targeted timestamps, учитывая overhead измерения. Проверяют debug/production config различия и real CPU affinity.

   **Пример:** p99 packing latency растёт из-за pool contention, хотя среднее scheduler duration стабильно.

   **Типичная ошибка:** Объявлять real-time path быстрым по average CPU utilisation.

   **Источник:** [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

148. Почему NUMA и cache locality важны для eNB/gNB?

   **Ответ:** Packet descriptors, HARQ buffers и UE state могут постоянно переходить между cores/sockets. Это увеличивает latency и jitter даже без дорогих algorithms. Partitioning, affinity и bounded batching оценивают по end-to-end deadline metrics. Padding cache lines полезен только при подтверждённом false sharing, а не как универсальное исправление.

   **Пример:** Producer и consumer счётчики одной queue разделяют cache line и создают contention под multi-cell load.

   **Типичная ошибка:** Копировать весь UE context между workers каждый slot ради load balance.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

149. Как логировать hot path без непредсказуемых задержек?

   **Ответ:** Используют bounded event records, заранее известные поля, controlled sampling и asynchronous export с loss counters. Formatting/IO выносят из deadline-critical path. Логи сохраняют correlation IDs и timestamps, иначе быстрый binary log бесполезен. Даже async logging требует ограничения очереди и оценки overhead.

   **Пример:** На deadline miss включается ограниченное окно trace по cell/UE вместо полного payload dump всех packets.

   **Типичная ошибка:** Выполнять synchronous file write при каждом HARQ event.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [Linux perf-record(1)](https://man7.org/linux/man-pages/man1/perf-record.1.html).

150. Что дают ASan, UBSan и TSan и чего они не проверяют?

   **Ответ:** Они обнаруживают определённые memory, undefined-behaviour и data-race ошибки в выполненных paths. Не доказывают отсутствие protocol bugs или deadline misses; overhead меняет timing. Нужны отдельные correctness runs с instrumentation и performance runs в подходящей сборке. Custom pools/lock-free код требуют корректной интеграции и дополнительных tests.

   **Пример:** TSan выявляет concurrent HARQ state mutation; затем single-writer redesign проверяется replay tests.

   **Типичная ошибка:** Считать отсутствие sanitizer report доказательством соблюдения 3GPP.

   **Источник:** [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html); [LLVM: libFuzzer](https://llvm.org/docs/LibFuzzer.html); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).

## 16. Практические разборы проблем eNB/gNB

151. DL RLC backlog большой, а PRBs свободны: что проверять?

   **Ответ:** Начать с eligibility: control resources, DRX/BWP/cell state, HARQ process availability и feedback feasibility. Затем RLC window/control state и actual pull result, после этого score/policy. Собирать no-allocation reason на decision point. Большая очередь сама по себе не доказывает наличие пригодного data для текущего grant.

   **Пример:** PRBs свободны, но все допустимые CCE candidates заняты: проблема control bottleneck.

   ```text
   backlog → eligibility → control candidate → HARQ process
           → data/feedback feasibility → RLC pull → packing → commit
   Record first failed condition and decision timestamp.
   ```

   **Типичная ошибка:** Первым действием увеличить PF weight или TBS.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

152. UL BSR положительный, но throughput нулевой: как локализовать?

   **Ответ:** Проверить decode/index/LCG mapping и age BSR, затем grants/DCI, PUSCH detection/CRC, actual MAC LCIDs и RLC delivery. Отдельно проверить timing alignment, power и UE LCP restrictions. Это последовательные observation points: отсутствие результата на одном участке сужает причину, но не доказывает ошибку следующего.

   **Пример:** Grants есть, PUSCH не detected: анализировать control reception/timing до PDCP processing.

   **Типичная ошибка:** Обвинять RLC, не проверив, были ли успешно приняты UL TBs.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.213 V17.5.0: NR PHY procedures for control](https://www.etsi.org/deliver/etsi_ts/138200_138299/138213/17.05.00_60/ts_138213v170500p.pdf); [3GPP TS 38.214 V17.5.0: NR PHY procedures for data](https://www.etsi.org/deliver/etsi_ts/138200_138299/138214/17.05.00_60/ts_138214v170500p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf).

153. HARQ ACK rate высокий, но IP goodput низкий: почему?

   **Ответ:** ACKed TBs включают overhead/padding и могут не означать новые уникальные upper-layer bytes. Проверить RLC repeats, PDCP duplication/reordering, ingress limitation и accounting boundary. Возможна также ошибка feedback correlation. Сравнение должно использовать одинаковый временной interval и исключать warm-up/teardown effects.

   **Пример:** MAC считает весь TBS, а application — уникальный payload; padding 40% объясняет часть разницы.

   ```text
   Same interval, explicit boundaries:
   ACKed TBS bytes
   - padding and MAC/RLC overhead
   - repeated lower-layer data
   - duplicate upper-layer data
   → compare unique upper-layer bytes, not a naive subtraction formula
   ```

   **Типичная ошибка:** Вычислять application throughput как сумму ACKed TBS.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm).

154. BLER низкий, а latency высокая: какие гипотезы сильнее?

   **Ответ:** Проверять queue wait, admission/priority, DRX, PDCP reorder gaps, RLC STATUS delay и processing backlog. Низкий BLER может быть следствием слишком консервативной link adaptation, но не доказывает это. Нужна decomposition по timestamps и deadline misses. Среднее radio quality не показывает tail queueing.

   **Пример:** Packet 15 ms ждёт eligibility и успешно проходит первую radio attempt: BLER не объясняет основной delay.

   **Типичная ошибка:** Пытаться улучшить latency только ростом transmit power.

   **Источник:** [3GPP TS 23.501: 5GS architecture and QoS](https://www.3gpp.org/dynareport/23501.htm); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

155. Почему NR UM decoder теряет первые bytes packet?

   **Ответ:** Проверить SI-dependent format: whole unsegmented SDU не содержит SN как segmented variant. Затем сверить RRC SN configuration, MAC payload boundaries и buffer offsets. Ложное чтение SN сдвигает payload, после чего ошибка проявляется выше как PDCP/IP corruption. Нужен golden vector с whole и segmented SDUs.

   **Пример:** Только небольшие целые UM packets повреждаются, а segmented работают: проверить unconditional SN parse.

   **Типичная ошибка:** Искать memory corruption до проверки actual wire format.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf).

156. AM window стоит, хотя STATUS приходит: что смотреть?

   **Ответ:** Сохранить decoded ACK_SN, NACK ranges/SO, current transmit base и application result STATUS. Проверить modular comparisons, stale context и partial acknowledgment semantics. STATUS может корректно не продвигать base из-за реального missing range; счётчик reports сам по себе не показатель progress. Важно видеть изменение outstanding set.

   **Пример:** Один старый missing byte range удерживает earliest unacked SDU при подтверждённых более новых данных.

   **Типичная ошибка:** Насильно продвинуть window edge, чтобы убрать stall.

   **Источник:** [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf).

157. Почему throughput падает периодически с периодом DRX?

   **Ответ:** Сопоставить dips с onDuration/Active Time, retransmission timers и ingress bursts. Возможно ожидаемое поведение конфигурации, неверный eligibility calculation или stale pending-data state. Проверить control-monitoring conditions, а не только period. Изменение DRX оценивают вместе с power/latency goals, без обещания универсального улучшения.

   **Пример:** Dips совпадают с long-cycle boundaries, но active retransmission state должен был поддерживать monitoring: проверить timer handler.

   **Типичная ошибка:** Отключать DRX как единственную диагностическую меру без trace state.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

158. Как расследовать crash после UE release под нагрузкой?

   **Ответ:** Связать crash с pending PHY callbacks, timer expiries, shared packet views и reuse identifiers. Проверить logical generation и physical lifetime отдельно. ASan/replay могут воспроизвести use-after-free, TSan — races; отсутствие crash в debug не снимает подозрение. Исправление должно покрыть release между каждой парой async stages.

   **Пример:** Release после PHY enqueue, callback после reuse UE slot: старый event безопасно отвергается до state access.

   **Типичная ошибка:** Добавить sleep перед free вместо исправления ownership.

   **Источник:** [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines); [Clang: ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html).

159. Что проверить при переносе LTE L2 реализации на NR?

   **Ответ:** Составить checklist wire formats, RLC concatenation/SN semantics, timers, numerology/time units, HARQ/DCI/feedback procedures, BSR formats и configuration model. Повторно проверить CU/DU ownership и QoS mapping, если меняется архитектура. Общие buffer/queue utilities можно переиспользовать после проверки assumptions; protocol state machines требуют нормативного review.

   **Пример:** LTE fixed subframe offsets заменить explicit configured time-domain handling, а RLC parser — NR formats.

   **Типичная ошибка:** Считать NR только LTE с более широкой полосой и большим SN.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 36.321 V17.5.0: LTE MAC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136321/17.05.00_60/ts_136321v170500p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 36.322 V17.0.0: LTE RLC](https://www.etsi.org/deliver/etsi_ts/136300_136399/136322/17.00.00_60/ts_136322v170000p.pdf); [3GPP TS 38.331 V17.5.0: NR RRC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138331/17.05.00_60/ts_138331v170500p.pdf).

160. Как оформить полный разбор L2 incident, чтобы он был проверяемым?

   **Ответ:** Зафиксировать RAT/version/configuration, workload и точную degraded metric. Построить timeline ingress→PDCP/RLC→scheduler decision→MAC/PHY→feedback/delivery с scoped IDs. Найти первый нарушенный invariant или ожидание procedure, предложить minimal fix и replay regression. Затем подтвердить effect на workload с похожими условиями и проверить tail/resource metrics.

   **Пример:** Incident: stale BSR subtraction после нового report; replay показывает двойное списание, fix разделяет epochs/in-flight accounting.

   ```text
   Incident record:
   1. RAT, TS versions, configuration epoch, workload
   2. Exact metric and reference points
   3. Correlated ingress/decision/PHY/delivery timeline
   4. First violated invariant + minimal reproducer
   5. Fix + deterministic regression + representative performance check
   ```

   **Типичная ошибка:** Писать «scheduler медленный» без inputs, boundaries и воспроизводимого decision trace.

   **Источник:** [3GPP TS 38.321 V17.12.0: NR MAC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138321/17.12.00_60/ts_138321v171200p.pdf); [3GPP TS 38.322 V17.4.0: NR RLC](https://www.etsi.org/deliver/etsi_ts/138300_138399/138322/17.04.00_60/ts_138322v170400p.pdf); [3GPP TS 38.323 V17.4.0: NR PDCP](https://www.etsi.org/deliver/etsi_ts/138300_138399/138323/17.04.00_60/ts_138323v170400p.pdf); [3GPP TS 38.314: NR L2 measurements](https://www.3gpp.org/dynareport/38314.htm); [C++ Core Guidelines: concurrency and resource safety](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines).
