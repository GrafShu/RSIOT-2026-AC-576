<p align="center">Министерство образования Республики Беларусь</p>
<p align="center">Учреждение образования</p>
<p align="center">“Брестский Государственный технический университет”</p>
<p align="center">Кафедра ИИТ</p>
<br><br><br><br><br><br>
<p align="center"><strong>Лабораторная работа №4</strong></p>
<p align="center"><strong>По дисциплине:</strong> “Распределенные системы и облачные технологии”</p>
<p align="center"><strong>Тема:</strong> Наблюдаемость и метрики</p>
<br><br><br><br><br><br>
<p align="right"><strong>Выполнил:</strong></p>
<p align="right">Студент 4 курса</p>
<p align="right">Группы АС-576</p>
<p align="right">Шувалов Сергей Юрьевич</p>
<p align="right"><strong>Проверил:</strong></p>
<p align="right">Несюк А.Н.</p>
<br><br><br><br><br>
<p align="center"><strong>Брест 2026</strong></p>

---

## Цель работы

Научиться устанавливать и настраивать систему мониторинга (Prometheus + Grafana) в Kubernetes.</p>
Добавить экспонирование метрик в приложение (endpoint /metrics) с использованием client-библиотек Prometheus.</p>
Создать ServiceMonitor/PodMonitor для автоматического сбора метрик.</p>
Разработать дашборды в Grafana для визуализации ключевых метрик (доступность, задержка, ошибки).</p>
Настроить алерты по SLO (Service Level Objectives) с использованием PrometheusRule и Alertmanager.</p>
Упаковать приложение в Helm-чарт с параметризацией основных настроек.</p>
(Опционально) Настроить GitOps-синхронизацию с использованием Argo CD или Flux.</p>

---

### Вариант № 28

## Метаданные студента

- **ФИО:** Шувалов Сергей Юрьевич
- **Группа:** feis-576
- **№ студенческого** (StudentID): 220253
- **Email (учебный):** zas57625@g.bstu.by
- **GitHub username:** GrafShu
- **Вариант №:** 28
- **ОС и версия:** Windows 10 (22H2, сборка 19045), Docker Desktop v4.76.0

---



## Структура репозитория c описанием содержимого

task_04/
├── src/
│ ├── package.json
│ └── server.js
├── helm/
│ └── web28-app/
│ ├── Chart.yaml
│ ├── values.yaml
│ └── templates/
│ ├── deployment.yaml
│ ├── service.yaml
│ ├── servicemonitor.yaml
│ └── prometheusrule.yaml
├── deployment.yaml
├── service.yaml
├── servicemonitor.yaml
├── prometheusrule.yaml
├── Dockerfile



## Подробное описание выполнения

1. Установка системы мониторинга, добавление Helm-репозитория</p>
![helm repo update](Screenshot_1.png)</p>
2. Установка kube-prometheus-stack</p>
3. Проверка компонентов мониторинга</p>
![kubectl get pods -n monitoring](Screenshot_3.png)
4. Доступ к Grafana</p>
![kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring](Screenshot_4.png)</p>
![kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring](Screenshot_5.png)</p>
5. Интеграция метрик в приложение, Добавление endpoint /metrics</p>
![prom-client](Screenshot_7.png)</p>
6. Сборка образа</p>
![docker build -t bstu-http-service:v2-metrics](Screenshot_8.png)</p>
7. Создание namespace и манифестов, проверка метрик</p>
![kubectl create namespace app-monitoring](Screenshot_9.png)
8. Настройка ServiceMonitor, проверка Targets в Prometheus</p>
![http://localhost:9090/targets](Screenshot_10.png)</p>
9. Создание дашбордов в Grafana</p>
![( sum(rate(web28_http_requests_total{status!~"5.."}[5m])) / sum(rate(web28_http_requests_total[5m])) ) * 100](Screenshot_11.png)</p>
10. Настройка алертов</p>
![http://localhost:9090/alerts](Screenshot_12.png)</p>
11. Helm-чарт, проверка чарта</p>
![helm lint helm/web28-app](Screenshot_13.png)</p>


## Контрольный список (checklist)

- [ ✅ ] README с полными метаданными
- [ ✅ ] Установлен kube-prometheus-stack (Prometheus, Grafana, Alertmanager)
- [ ✅ ] Приложение экспонирует /metrics с префиксом web28_
- [ ✅ ] Созданы метрики: counter, histogram, gauge
- [ ✅ ] ServiceMonitor для сбора метрик
- [ ✅ ] Дашборд Availability (SLO 99.2%)
- [ ✅ ] Дашборд P95 Latency (SLO 385ms)
- [ ✅ ] Дашборд Error Rate (SLO 2.5%)
- [ ✅ ] PrometheusRule с алертами
- [ ✅ ] Helm-чарт приложения

---

## Вывод

В ходе выполнения лабораторной работы №4 были освоены следующие навыки:

Установка системы мониторинга
Развернут kube-prometheus-stack в namespace monitoring через Helm. Настроен доступ к Grafana (admin/prom-operator) и Prometheus.

Интеграция метрик в приложение
В приложение на Node.js добавлена библиотека prom-client. Создан endpoint /metrics с префиксом метрик web28_ согласно варианту №28. Экспонируются базовые метрики: счётчик запросов (Counter), гистограмма задержек (Histogram), gauge для активных соединений и статуса БД.

ServiceMonitor
Создан ServiceMonitor с label release: monitoring для автоматического сбора метрик Prometheus. Прометей успешно обнаруживает endpoint /metrics приложения.

Дашборды Grafana
Разработаны 3 дашборда:

Доступность сервиса (SLO 99.2%)

P95 задержка (SLO 385ms)

Частота ошибок 5xx (SLO 2.5%)

Алерты
Настроены PrometheusRule с алертами по SLO:

Web28HighErrorRate — срабатывает при ошибках > 2.5% за 10 минут

Web28HighLatency — срабатывает при P95 > 385ms

Web28LowAvailability — срабатывает при доступности < 99.2%

Helm-чарт
Создан Helm-чарт приложения с параметризацией: namespace, replicas, image, resources, метрики. Включены шаблоны Deployment, Service, ServiceMonitor, PrometheusRule.

Метаданные
Во все ресурсы добавлены необходимые labels согласно требованиям.

Работа выполнена в соответствии с вариантом №28 (префикс метрик web28_, SLO: доступность 99.2%, P95 латентность 385ms, алерт на ошибки > 2.5% за 10 минут).