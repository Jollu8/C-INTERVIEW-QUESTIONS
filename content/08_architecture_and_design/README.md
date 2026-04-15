# System Design & C/C++ & Linux Interview Questions

## 🧠 1. Базовые принципы распределённых систем

Это фундамент. Без него любые “кейсы” превращаются в угадайку.

**Что входит:**

* CAP theorem (consistency / availability / partition tolerance)
* Consistency models (strong, eventual, causal)
* Latency vs throughput trade-offs
* Idempotency
* Fault tolerance
* Horizontal vs vertical scaling

👉 Это база для 30–40% всех вопросов.

---

## 🗄️ 2. Хранение данных (Data Storage)

Очень часто проверяют глубину именно здесь.

**Подтемы:**

* SQL vs NoSQL
* ACID vs BASE
* Indexing (B-Tree, LSM)
* Sharding (range, hash, geo)
* Replication (leader-follower, multi-leader)
* Data partitioning

👉 Классический вопрос: “как хранить миллиарды записей и быстро читать?”

---

# ⚙️ 3. Backend архитектура

Здесь начинается реальный System Design.

**Подтемы:**

* Monolith vs Microservices
* API design (REST, gRPC)
* Service discovery
* Load balancing
* Stateless vs stateful services

👉 Часто дают: “спроектируй backend для X”

---

# 🌐 4. Сетевой слой и доставка

Про это забывают — и заваливаются.

**Подтемы:**

* DNS
* CDN (например Cloudflare)
* Reverse proxy
* HTTP vs WebSockets
* TLS / HTTPS

👉 Вопросы уровня: “как ускорить загрузку контента по всему миру?”

---

# ⚡ 5. Кэширование

Один из самых частых топиков.

**Подтемы:**

* Cache aside / write-through / write-back
* TTL, eviction policies (LRU, LFU)
* Distributed cache (например Redis)

👉 Почти в каждом дизайне ты обязан предложить кэш.

---

# 📩 6. Асинхронность и очереди

Критично для масштабируемости.

**Подтемы:**

* Message queues
* Pub/Sub
* Event-driven architecture
* Stream processing

**Инструменты:**

* Apache Kafka
* RabbitMQ

---

# 📈 7. Масштабирование

Отдельный блок, хотя пересекается с другими.

**Подтемы:**

* Horizontal scaling
* Auto-scaling
* Load balancing algorithms
* Hot partitions

---

# 🔒 8. Надёжность и отказоустойчивость

Интервьюеры любят ломать твою систему.

**Подтемы:**

* Retries, backoff
* Circuit breaker
* Failover
* SLA / SLO / SLI

---

# 🔍 9. Observability (наблюдаемость)

Senior уровень без этого не проходит.

**Подтемы:**

* Logging
* Metrics
* Tracing (например Jaeger)
* Alerting

---

# 🔐 10. Безопасность

Часто задают ближе к концу интервью.

**Подтемы:**

* Authentication / Authorization
* OAuth, JWT
* Rate limiting
* DDoS protection

---

# 🧩 11. Типовые system design кейсы

Это уже “прикладной слой”.

**Набор must-have:**

* URL shortener (как Bitly)
* Chat system (как WhatsApp)
* News feed (как Instagram)
* Video streaming (как YouTube)
* Ride sharing (как Uber)

---

# 📊 Как это превратить в вопросы

### 1. Вопросы по теории

* “В чём разница между strong consistency и eventual?”
* “Когда нарушается CAP?”

### 2. Вопросы по trade-offs

* “Почему выбрать NoSQL вместо SQL?”
* “Когда кэш вреден?”

### 3. Дизайн-вопросы

* “Спроектируй WhatsApp”
* “Спроектируй CDN”

