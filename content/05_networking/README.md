# Networking Topics (Structured)

## 📌 Краткий список топиков

1. OSI и TCP/IP модели
2. Core Networking (IP, Routing, DNS)
3. Transport Layer (TCP/UDP/QUIC)
4. Wireless Fundamentals
5. LTE (4G) основы
6. 5G NR основы
7. Network Security
8. Troubleshooting и практические инструменты

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