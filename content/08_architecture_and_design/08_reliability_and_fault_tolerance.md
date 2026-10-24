# 🔒 8. Надёжность и отказоустойчивость

Интервьюеры любят ломать твою систему.

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

* Retries, backoff
* Circuit breaker
* Failover
* SLA / SLO / SLI

---

1. (L1 [T]) Что такое надёжность системы?

   **Ответ:** Способность выполнять нужные функции с требуемой корректностью и качеством на заданном интервале. Описывается измеримыми SLI/SLO и моделью отказов.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

2. (L1 [T]) Что такое отказ (failure)?

   **Ответ:** Наблюдаемое нарушение требуемого поведения: ошибка, недоступность, неверный результат или превышение допустимого времени. Отказ компонента не обязательно становится отказом продукта.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

3. (L1 [T]) Что такое retry?

   **Ответ:** Повтор неуспешной или неопределённо завершившейся операции. Без идемпотентности может повторить уже выполненный бизнес-эффект.

   **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/); [AWS: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

4. (L1 [T]) Что такое backoff?

   **Ответ:** Пауза между повторными попытками для снижения давления на зависимость. Может расти и включать случайный jitter.

   **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

5. (L1 [T]) Что такое circuit breaker?

   **Ответ:** Механизм, прекращающий обращения к проблемной зависимости и периодически проверяющий восстановление. Ограничивает повторные обращения, но не заменяет timeout и bulkhead.

   **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

6. (L1 [T]) Что такое failover?

   **Ответ:** Переключение обслуживания на резервный узел/регион. Требует готовых данных, достаточной ёмкости и предотвращения одновременного конфликтующего владения.

   **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Raft paper](https://raft.github.io/raft.pdf)

7. (L1 [T]) Что такое SLA?

   **Ответ:** Соглашение об уровне сервиса с условиями измерения и последствиями нарушения. Должно точно задавать охват, окно и исключения.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

8. (L1 [T]) Что такое SLO?

   **Ответ:** Целевое значение показателя качества за определённое окно. Обычно внутренний SLO строже внешнего обязательства, чтобы оставался запас для реакции.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

9. (L1 [T]) Что такое SLI?

   **Ответ:** Количественный показатель качества с позиции пользователя: доля успешных запросов, доля запросов быстрее порога, свежесть данных.

   **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


---

10. (L2 [T]) Когда использовать retry?

    **Ответ:** Для временных ошибок при безопасном повторе и наличии общего deadline. Валидационные ошибки и постоянный отказ доступа обычно требуют исправления запроса, а не повтора.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

11. (L2 [P]) Как реализовать retry?

    **Ответ:** Задать retryable ошибки, максимум попыток, общий deadline, capped backoff и jitter. Перед каждой попыткой проверять оставшийся бюджет и использовать один выбранный слой retry.

    **Пример:** Не повторять создание заказа после timeout без idempotency key.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

12. (L2 [T]) Что такое exponential backoff?

    **Ответ:** Пауза увеличивается геометрически: cap_n = min(cap_max, base × 2^n). Для full jitter фактическую паузу выбирают случайно от 0 до cap_n.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

13. (L2 [P]) Как настроить backoff стратегию?

    **Ответ:** Выбрать base/cap из SLO и времени восстановления, ограничить суммарный бюджет и число попыток. Добавить jitter и учитывать Retry-After, не выходя за deadline.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

14. (L2 [T]) Когда retry вреден?

    **Ответ:** При перегрузке, неидемпотентных изменениях и постоянных ошибках. Вложенные retries умножают число вызовов и могут мешать восстановлению.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

15. (L2 [T]) Как работает circuit breaker (open/half-open/closed)?

    **Ответ:** Closed пропускает вызовы и учитывает результат; open быстро отказывает; half-open допускает ограниченные пробы. Успех возвращает closed, неуспех открывает цепь вновь.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

16. (L2 [P]) Как реализовать circuit breaker?

    **Ответ:** Потокобезопасный автомат с окном статистики, минимумом запросов, cooldown и ограниченными пробами. Разделять экземпляры по независимым зависимостям и измерять переходы/отклонения.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

17. (L2 [T]) Что такое timeout?

    **Ответ:** Предел времени ожидания стадии или операции. Клиентский timeout не гарантирует остановку server-side работы; отмену нужно распространять отдельно.

    **Источник:** [gRPC: Core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/); [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

18. (L2 [P]) Как правильно выбирать timeout?

    **Ответ:** По end-to-end SLO и распределениям задержек выбрать допустимую долю ложных timeout. Разделить connect/TLS и обработку, оставить запас на ответ и передавать deadline вниз.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

19. (L2 [T]) Что такое failover (active-passive, active-active)?

    **Ответ:** Active-passive держит резерв, active-active обслуживает в нескольких местах одновременно. Во втором случае сложнее маршрутизация записи и разрешение конфликтов.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

20. (L2 [P]) Как реализовать failover?

    **Ответ:** Health detection → выбор нового владельца → fencing старого → продвижение реплики → переключение маршрута. Проверить catch-up, RPO/RTO и возврат после восстановления.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

21. (L2 [T]) Как измерять availability?

    **Ответ:** Обычно доля хороших событий среди допустимых запросов; для некоторых сервисов — доля доступного времени. Граница измерения, ошибки и исключения должны совпадать с пользовательским опытом.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

22. (L2 [T]) Как рассчитывается SLA?

    **Ответ:** SLA — договорённость, а фактическое выполнение считают по её формуле. Для временной доступности A = (T−D)/T; для запросной — good/eligible, с явно заданными исключениями.

    **Пример:** 99,9% за условные 30 суток допускает 43,2 минуты недоступности при временном расчёте.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

23. (L2 [P]) Как определить SLO для сервиса?

    **Ответ:** Выбрать ключевые пользовательские сценарии, определить good/eligible events и окно, согласовать цель с продуктом и зависимостями. Не задавать показатель, который невозможно надёжно измерить.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

24. (L2 [T]) Что такое error budget?

    **Ответ:** Допустимая доля/число плохих событий: 1−SLO. Позволяет управлять риском изменений; это не разрешение планово ухудшать сервис.

    **Пример:** При SLO 99,9% на 1 млн запросов бюджет — 1000 плохих запросов.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)


---

25. (L3 [D]) Почему retry вызывает деградацию системы?

    **Ответ:** Повторы повышают offered load именно во время снижения capacity; многослойные повторы умножают давление. Очереди растут, попытки истекают и запускают новые попытки.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/); [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

26. (L3 [D]) Как диагностировать retry storm?

    **Ответ:** Сравнить исходные запросы и все попытки, распределение attempts и коррелированные пики. Найти клиента/слой с синхронным повтором, затем ограничить retry budget и добавить jitter.

    **Источник:** [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

27. (L3 [D]) Почему circuit breaker не спасает систему?

    **Ответ:** Он может открываться слишком поздно, учитывать неверные ошибки, иметь слишком много проб или не ограничивать уже выполняющуюся работу. Общие пулы и медленные успешные ответы также исчерпывают ресурсы.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker); [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

28. (L3 [P]) Как правильно настроить thresholds для circuit breaker?

    **Ответ:** Настроить окно, minimum calls, долю ошибок/slow calls и cooldown по профилю зависимости. Протестировать низкий трафик, краткий всплеск и длительный отказ, чтобы исключить flapping.

    **Источник:** [Azure Architecture: Circuit Breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

29. (L3 [D]) Почему failover не сработал?

    **Ответ:** Разобрать detection, election, replica lag, fencing, маршрутизацию и capacity резерва. Частые причины — ложное здоровье, stale DNS, несинхронный резерв и зависимость обоих регионов от одного компонента.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp)

30. (L3 [D]) Как обнаружить частичные отказы (partial failures)?

    **Ответ:** Измерять по регионам, ключам, операциям и зависимостям, использовать synthetic и пользовательские SLIs. Частичный отказ может затрагивать один shard или тип операции при зелёном общем health check.

    **Источник:** [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

31. (L3 [T]) Что такое cascading failure?

    **Ответ:** Отказ одного компонента вызывает перегрузку других, повторные попытки и исчерпание общих ресурсов. В итоге локальная проблема распространяется на систему.

    **Источник:** [Google SRE: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)

32. (L3 [P]) Как предотвратить cascading failure?

    **Ответ:** Admission control, bounded queues, deadlines, retry budgets, bulkheads и деградация. Восстановление проводить постепенно, чтобы возврат узлов и прогрев не создавали новый пик.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead); [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

33. (L3 [D]) Почему SLA не выполняется?

    **Ответ:** Сравнить пользовательский SLI с целью, разобрать вклад зависимостей, перегрузки, релизов и времени восстановления. Проверить полноту измерения и корректность договорной формулы.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/)

34. (L3 [P]) Как анализировать downtime?

    **Ответ:** Восстановить временную линию обнаружения, реакции, смягчения и полного восстановления по независимым сигналам. Оценить охват пользователей и причины задержки, оформить действия с владельцами.

    **Источник:** [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/)

35. (L3 [T]) Что такое graceful degradation?

    **Ответ:** Сохранение основной функции при управляемом снижении необязательного качества. Допустимые режимы должны быть заранее согласованы, а не выдавать неверные данные как корректные.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/)

36. (L3 [P]) Как реализовать graceful degradation?

    **Ответ:** Выделить critical path и лимиты, отключать рекомендации/дорогие вычисления, отдавать разрешённые stale данные. Проверять fallback под нагрузкой и не переносить ту же перегрузку на другую зависимость.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

37. (L3 [D]) Почему система падает при пике нагрузки?

    **Ответ:** Насыщаются пулы/диски/память, растут очереди и retries, autoscaling запаздывает. Измерить arrival/service rate, время ожидания и лимитирующий ресурс, затем ограничить вход.

    **Источник:** [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/); [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

38. (L3 [T]) Что такое bulkhead pattern?

    **Ответ:** Изоляция ресурсов по сервисам, зависимостям или tenants. Отказ одного отсека снижает доступную ёмкость, но не должен занимать все ресурсы остальных.

    **Источник:** [Azure Architecture: Bulkhead](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)


---

39. (L4 [S]) Как проектировать highly available систему?

    **Ответ:** Исключить общие точки отказа по данным, compute и control plane; распределить по failure domains. Спроектировать recovery, резервную ёмкость и регулярные учения от требований RPO/RTO и SLO.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

40. (L4 [S]) Как балансировать reliability vs cost?

    **Ответ:** Оценить стоимость плохих событий, RPO/RTO и резервирования; вкладываться в реальные риски. Рост числа девяток требует всё более дорогой изоляции и эксплуатации, а не только дополнительных replicas.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

41. (L4 [S]) Как проектировать multi-region failover?

    **Ответ:** Независимые региональные стеки, репликация и заранее проверенные сценарии promotion/routing. Ограничить запись одним владельцем либо определить безопасные конфликты; проверить ёмкость при потере региона.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [Raft paper](https://raft.github.io/raft.pdf)

42. (L4 [S]) Когда использовать active-active vs active-passive?

    **Ответ:** Active-active нужен для локального обслуживания и использования ресурсов, если модель данных допускает несколько активных мест. Active-passive проще для single-writer, но требует оплаты и проверки готовности резерва.

    **Источник:** [Azure Architecture: Deployment stamps](https://learn.microsoft.com/en-us/azure/architecture/patterns/deployment-stamp); [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html)

43. (L4 [S]) Как правильно задавать SLA/SLO для продукта?

    **Ответ:** Связать цели с пользовательскими сценариями, договориться о good events, окне, исключениях и измерении. SLA должен опираться на реально достижимый SLO с запасом и понятным владельцем.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

44. (L4 [S]) Как управлять error budget на уровне организации?

    **Ответ:** Общая политика расходования бюджета: при быстром burn приоритет восстановлению и снижению риска, при здоровом бюджете допустимы изменения. Отслеживать зависимые бюджеты и исключить наказание за честные измерения.

    **Источник:** [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/); [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

45. (L4 [S]) Как проектировать систему с минимальным downtime?

    **Ответ:** Совместимые rolling/canary deployments, миграции expand-contract, готовый rollback и независимые failure domains. Даже «безостановочные» релизы нужно проверять по пользовательскому SLI.

    **Источник:** [PostgreSQL: High Availability and Replication](https://www.postgresql.org/docs/current/high-availability.html); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/)

46. (L4 [S]) Как строить self-healing системы?

    **Ответ:** Health/readiness, автоматический restart/reschedule и безопасное восстановление состояния с ограничением частоты. Системе нужны защита от бесконечного restart loop, наблюдаемость и ручной путь вмешательства.

    **Источник:** [Kubernetes: Service](https://kubernetes.io/docs/concepts/services-networking/service/); [Google SRE: Managing Incidents](https://sre.google/sre-book/managing-incidents/)

47. (L4 [S]) Как проектировать систему, устойчивую к partial failures?

    **Ответ:** Предполагать асимметричные и частичные сетевые отказы: deadlines, fencing, bounded retries и отдельные SLIs по сегментам. Не определять глобальную истинность состояния по одному успешному ping.

    **Источник:** [Raft paper](https://raft.github.io/raft.pdf); [AWS: Timeouts, retries, backoff and jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/); [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
