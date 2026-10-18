# 🧪 Testing & Quality Guide

## Полнота раздела и порядок подготовки

В 18 темах — **598 вопросов с ответами и источниками**. Обзорный файл 01 намеренно повторяет основные направления в компактной форме; остальные темы раскрывают их подробнее с акцентом на C++ и backend-системы.

| Тема | Вопросов | С ответами |
| --- | ---: | ---: |
| [Основы тестирования](./01_base.md) | 76 | 76 |
| [Unit Testing](./02_unit_test.md) | 29 | 29 |
| [Integration Testing](./03_integration_test.md) | 29 | 29 |
| [E2E Testing](./04_e2e_test.md) | 29 | 29 |
| [API Testing](./05_api_test.md) | 33 | 33 |
| [Performance Testing](./06_performance_test.md) | 31 | 31 |
| [Security Testing](./07_security_test.md) | 31 | 31 |
| [Test Automation](./08_automation_test.md) | 33 | 33 |
| [Основы QA](./09_qa_base.md) | 27 | 27 |
| [Test Management](./10_qa_management_test.md) | 30 | 30 |
| [Bug Tracking](./11_qa_bug_tracking.md) | 31 | 31 |
| [Code Quality](./12_qa_code_qualaty.md) | 31 | 31 |
| [CI/CD и качество](./13_qa_ci_cd.md) | 31 | 31 |
| [Documentation](./14_qa_documentation.md) | 31 | 31 |
| [Agile QA](./15_qa_agile.md) | 31 | 31 |
| [Test Architecture](./16_test_architecture.md) | 31 | 31 |
| [Observability & Monitoring](./17_observabilty_and_monitorung.md) | 32 | 32 |
| [AI в тестировании](./18_test_ai.md) | 32 | 32 |
| **Всего** | **598** | **598** |

Начните с 01 → 02 → 03 → 05, затем изучите E2E, performance и security (04, 06, 07). Автоматизация и test architecture (08, 16) связывают проверки в систему; QA-процессы (09–15) — в lifecycle продукта. Observability (17) помогает расследовать failures, AI (18) — оценивать возможности и ограничения новых инструментов. [Ресурсы и практика](./19_resources.md) содержат ссылки на документацию.

L1–L4 обозначают глубину от терминов до стратегии; T/P/D/S — теорию, практику, диагностику и проектирование. Примеры являются учебными: пути, selectors, endpoints и численные SLO адаптируют к проекту. Команды и версии framework/runtime сверяют с документацией; высокий coverage или зелёный pipeline сами по себе не доказывают качество.

## 📌 Overview
Этот документ покрывает ключевые области тестирования и обеспечения качества (QA), которые используются в современной разработке ПО.

---

## 🧪 Testing

### 1. [Основы тестирования](./01_base.md)
- Что такое тестирование и зачем оно нужно
- Виды тестирования (manual vs automation)
- Уровни тестирования (unit, integration, system, acceptance)
- SDLC и STLC

### 2. [Unit Testing](./02_unit_test.md)
- Принципы unit-тестов
- Популярные фреймворки (JUnit, pytest, Jest)
- Моки и стабы
- TDD (Test-Driven Development)

### 3. [Integration Testing](./03_integration_test.md)
- Проверка взаимодействия модулей
- Контрактное тестирование
- Использование test containers

### 4. [End-to-End (E2E) Testing](04_e2e_test.md)
- Сквозные сценарии
- Инструменты (Cypress, Playwright, Selenium)
- Best practices

### 5. [API Testing](./05_api_test.md)
- REST / GraphQL тестирование
- Инструменты (Postman, REST Assured)
- Проверка статусов, схем, данных

### 6. [Performance Testing](./06_performance_test.md)
- Нагрузочное тестирование (load testing)
- Стресс-тестирование
- Инструменты (JMeter, k6)

### 7. [Security Testing](./07_security_test.md)
- Основы безопасности
- OWASP Top 10
- Static и Dynamic анализ

### 8. [Test Automation](./08_automation_test.md)
- Когда автоматизировать
- Паттерны (Page Object Model)
- CI/CD интеграция

---

## ✅ Quality Assurance (QA)

### 9. [Основы качества](./09_qa_base.md)
- Что такое Quality Assurance vs Quality Control
- Метрики качества
- Definition of Done

### 10. [Test Management](./10_qa_management_test.md)
- Тест-кейсы и чек-листы
- Тест-планы
- Инструменты (TestRail, Zephyr)

### 11. [Bug Tracking](./11_qa_bug_tracking.md)
- Жизненный цикл бага
- Приоритизация и severity
- Инструменты (Jira, YouTrack)

### 12. [Code Quality](./12_qa_code_qualaty.md)
- Code review
- Статический анализ (SonarQube, ESLint)
- Coding standards

### 13. [CI/CD и качество](./13_qa_ci_cd.md)
- Pipeline и автоматизация тестов
- Quality gates
- Continuous Testing

### 14. [Documentation](./14_qa_documentation.md)
- Тестовая документация
- Требования и спецификации
- Traceability matrix

### 15. [Agile QA](./15_qa_agile.md)
- Роль QA в Scrum
- Shift-left testing
- Continuous feedback

---

## 🚀 Advanced Topics

### 16. [Test Architecture](./16_test_architecture.md)
- Структура тестового проекта
- Масштабируемость тестов

### 17. [Observability & Monitoring](./17_observabilty_and_monitorung.md)
- Логи, метрики, трассировка
- Инструменты (Prometheus, Grafana)

### 18. [AI в тестировании](./18_test_ai.md)
- Генерация тестов
- Self-healing tests

---

## 📚 [Resources](./19_resources.md)
- Книги
- Курсы
- Полезные ссылки
