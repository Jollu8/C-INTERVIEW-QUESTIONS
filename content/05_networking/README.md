# Networking Topics (Structured)

В девяти темах — 4 834 вопроса с ответами. Каждый ответ содержит источник;
примеры и типичные ошибки добавлены там, где помогают разобраться в теме.

## Полнота раздела

| Тема | Вопросов | С ответами |
| --- | ---: | ---: |
| [OSI и TCP/IP](./01_osi_and_tcp_ip.md) | 74 | 74 |
| [Core Networking](./02_core_networking.md) | 535 | 535 |
| [Transport Layer](./03_transport_layer.md) | 655 | 655 |
| [Wireless Fundamentals](./04_wireless_fundamentals.md) | 550 | 550 |
| [LTE](./05_lte.md) | 810 | 810 |
| [5G NR](./06_nr.md) | 680 | 680 |
| [Network Security](./07_network_security.md) | 745 | 745 |
| [Troubleshooting](./08_troubleshooting_and_practice.md) | 625 | 625 |
| [3GPP L2 LTE/NR](./09_3gpp_l2_lte_nr.md) | 160 | 160 |
| **Всего** | **4 834** | **4 834** |

Для последовательной подготовки проходите темы 1–3, затем безопасность и диагностику (7–8). Радиочасть изучайте по цепочке 4 → 5 → 6 → 9; последний файл посвящён реализации scheduler и L2 стека eNB/gNB.

## 📌 Краткий список топиков

1. OSI и TCP/IP модели
2. Core Networking (IP, Routing, DNS)
3. Transport Layer (TCP/UDP/QUIC)
4. Wireless Fundamentals
5. LTE (4G) основы
6. 5G NR основы
7. Network Security
8. Troubleshooting и практические инструменты
9. 3GPP L2 LTE/NR: scheduler и стек eNB/gNB — 160 вопросов с ответами

---

# 📚 Детализация топиков

## 1. [OSI и TCP/IP модели](./01_osi_and_tcp_ip.md)
- Слои модели OSI
- Сопоставление OSI ↔ TCP/IP
- Функции каждого уровня
- Примеры протоколов на каждом уровне
- Инкапсуляция данных
- Типичные проблемы по уровням (L1–L7)

---

## 2. [Core Networking](./02_core_networking.md)
- IPv4 vs IPv6
- CIDR и subnetting
- Private vs Public IP
- NAT (SNAT, DNAT, PAT)
- Routing:
    - Static routing
    - Dynamic routing (OSPF, BGP — обзор)
- ARP
- DNS:
    - Recursive vs iterative queries
- DHCP:
    - Процесс получения IP

---

## 3. [Transport Layer](./03_transport_layer.md)
- TCP:
    - Handshake (3-way)
    - Congestion control
    - Flow control
    - Retransmissions
- UDP:
    - Когда используется
- QUIC:
    - Основные преимущества
- Метрики:
    - Latency
    - Jitter
    - Packet loss
    - Throughput

---

## 4. [Wireless Fundamentals](./04_wireless_fundamentals.md)
- Основы радиосвязи:
    - Частоты и спектр
- Signal / Noise / SNR
- Interference
- Multipath propagation
- Fading
- Bandwidth vs throughput
- Duplex (FDD / TDD)

---

## 5. [LTE (4G)](./05_lte.md)
- Архитектура:
    - eNodeB
    - EPC (MME, SGW, PGW)
- Control plane vs User plane
- RRC (Radio Resource Control)
- MAC layer scheduling
- Handover:
    - Типы и сценарии
- QoS в LTE

---

## 6. [5G NR](./06_nr.md)
- Архитектура:
    - gNodeB
    - 5G Core
- Beamforming
- Massive MIMO
- Network slicing
- URLLC / eMBB / mMTC
- Low latency механизмы

---

## 7. [Network Security](./07_network_security.md)
- TLS/SSL
- HTTPS
- VPN:
    - IPsec
    - WireGuard (обзор)
- Основные атаки:
    - MITM
    - Spoofing
    - DDoS (обзор)
- Базовые принципы защиты

---

## 8. [Troubleshooting и практика](./08_troubleshooting_and_practice.md)
- Инструменты:
    - ping
    - traceroute
    - nslookup / dig
- Анализ проблем:
    - Нет connectivity
    - Высокая задержка
    - Потери пакетов
- Bottlenecks в сети
- Диагностика по уровням OSI

---

## 9. [3GPP L2 LTE/NR: scheduler и стек eNB/gNB](./09_3gpp_l2_lte_nr.md)

160 вопросов с развёрнутыми ответами, примерами, типичными ошибками и источниками. Базовая линия — Release 17, с явным разделением LTE/NR и требований стандарта/политик реализации.

- Архитектура MAC/RLC/PDCP/SDAP, CU/DU и контракты слоёв
- Numerology, timing, MAC–PHY, DL/UL scheduling, PF и link adaptation
- BSR/SR/PHR, HARQ, MAC PDU packing и безопасный parsing
- Random access, DRX, timing advance и recovery
- RLC UM/AM, segmentation, sequence windows, polling и STATUS
- PDCP COUNT/security/reordering/duplication, SDAP и QoS
- CA/DC, mobility, split bearers и F1-U flow control
- C/C++ ownership, concurrency, timers, replay, fuzzing и performance
- Практические разборы stalls, потерь throughput и ошибок lifecycle
