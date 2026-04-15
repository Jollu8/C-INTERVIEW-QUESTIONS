# 🗄️ Data Base & Storage
Это один из самых “глубоких” доменов. Здесь проверяют не только знание терминов, но и понимание **внутренностей БД, trade-offs и production проблем**.

---

## 🧱 1. [Модели данных](./01_mode.md)

**Что входит:**

* Relational model
* Key-value
* Document
* Column-family
* Graph

---

## 📦 2. [Типы баз данных](./02_types_of_data.md)

**Что входит:**

* OLTP vs OLAP
* Row-based vs column-based
* In-memory databases
* Time-series databases
* NewSQL

---

## 🧮 3. [Транзакции и консистентность](03_transactions_and_consistency.md)

**Что входит:**

* ACID
* Isolation levels (read committed, repeatable read, serializable)
* MVCC
* Locks (row/table)
* Deadlocks

---

## 🔍 4. [Индексы и структуры данных](04_indexes_and_data_structures.md)

**Что входит:**

* B-Tree
* LSM Tree
* Hash index
* Secondary indexes
* Covering indexes

---

## 🧩 5. [Партиционирование и шардинг](./05_partitioning_and_sharding.md)

**Что входит:**

* Range partitioning
* Hash partitioning
* Geo partitioning
* Consistent hashing
* Rebalancing

---

## 🔁 6. [Репликация](./06_replication.md)

**Что входит:**

* Leader-follower
* Multi-leader
* Leaderless (Dynamo-style)
* Sync vs async replication
* Replication lag

---

## ⚙️ 7. [Storage engine internals](./07_storage_engine_internals.md)

**Что входит:**

* WAL (write-ahead log)
* SSTables
* Compaction
* Write amplification
* Read amplification

---

## 💾 8. [Диски и I/O](./08_disks_and_io.md)

**Что входит:**

* HDD vs SSD
* Sequential vs random I/O
* fsync
* Page cache
* Direct I/O

---

## ⚡ 9. [Производительность и оптимизация](./09_performance_and_optimisation.md)

**Что входит:**

* Query planning
* Cost-based optimizer
* Execution plans
* Index selection
* Caching (buffer pool)

---

## 🧵 10. [Конкурентность](./10_competitiveness.md)

**Что входит:**

* Locks vs MVCC
* Isolation anomalies
* Phantom reads
* Write skew
* Contention

---

## 🔄 11. [Миграции и эволюция схемы](./11_migrations_and_schema_evolution.md)

**Что входит:**

* Schema migration
* Backward/forward compatibility
* Online migrations
* Dual writes
* Data backfill

---

## 📊 12. [Специализированные хранилища](./12_purpose_built_storage.md)

**Что входит:**

* Time-series DB
* Search engines
* Analytical warehouses
* Blob/object storage

---

## 🔐 13. [Надёжность данных](./13_data_reliability.md)

**Что входит:**

* Backup/restore
* Snapshots
* Point-in-time recovery
* Data corruption
* Checksums

---

## 🌍 14. [Distributed storage systems](./14_distributed_storage_systems.md)

**Что входит:**

* Distributed databases
* Consensus (Raft, Paxos)
* Quorum reads/writes
* Partition tolerance
* Data locality

