<p align="center">Министерство образования Республики Беларусь</p>
<p align="center">Учреждение образования</p>
<p align="center">“Брестский Государственный технический университет”</p>
<p align="center">Кафедра ИИТ</p>
<br><br><br><br><br><br>
<p align="center"><strong>Лабораторная работа №2</strong></p>
<p align="center"><strong>По дисциплине:</strong> “Распределенные системы и облачные технологии”</p>
<p align="center"><strong>Тема:</strong> Kubernetes: базовый деплой</p>
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

Научиться готовить Kubernetes-манифесты для простого HTTP-сервиса (Deployment + Service).</p>
Настроить liveness/readiness probes и политику обновления (rolling update).</p>
Подготовить конфигурацию через ConfigMap/Secret и смонтировать volume для данных при необходимости.</p>
Научиться запускать кластер локально (Kind/Minikube) и проверять корректность деплоя.</p>

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


## Окружение и инструменты

- **Кластер:** Docker Desktop Kubernetes (Kind) v1.36.1
- **kubectl** - управление Kubernetes
- **Docker Desktop** - контейнеризация и встроенный Kubernetes
- **Ingress Controller:** nginx-ingress

## Структура репозитория c описанием содержимого

README.md # отчёт с метаданными, инструкциями, скриншотами</p>
Screenshot_x.png # Скриншоты работы</p>
namespace.yaml # Namespace web28</p>
configmap.yaml # Конфигурация (PORT, STU_ID, STU_GROUP, STU_VARIANT, DB_*)</p>
secret.yaml # Секрет с паролем БД</p>
deployment.yaml # Deployment (3 реплики, RollingUpdate, probes, resources)</p>
service.yaml # Service ClusterIP</p>
ingress.yaml # Ingress (nginx, app28.local)</p>
postgres.yaml # PostgreSQL зависимость</p>


## Подробное описание выполнения

1. Создание и применение манифестов: kubectl apply -f.
Сначала создаём namespace, потом все остальное.</p>
![kubectl apply -f.](Screenshot_1.png)</p>
2. Проверка статусов всех ресурсов</p>
![kubectl get all -n web28](Screenshot_2.png)
3. Проверка статуса подов</p>
![kubectl get pods -n web28](Screenshot_3.png)
4. Проверка работы приложения</p>
![kubectl port-forward -n web28 service/app28 8034:80](Screenshot_4.png)</p>
![curl](Screenshot_5.png)</p>
5. Проверка логов</p>
![kubectl logs -n web28 deployment/app28](Screenshot_6.png)
6. Rolling update</p>
![kubectl get pods -n web28 -w](Screenshot_7.png)
Kubernetes создаёт новый под (ErrImagePull) перед удалением старых, что соответствует стратегии RollingUpdate</p>
7. Graceful shutdown</p>
![kubectl delete pod -n web28](Screenshot_8.png)
8. Очистка ресурсов</p>
![kubectl delete namespace web28](Screenshot_9.png)
9. Проверка метаданных в Kubernetes</p>
![kubectl get deployment app28 -n web28 -o yaml | findstr "org.bstu"](Screenshot_10.png)


## Контрольный список (checklist)

- [ ✅ ] README с полными метаданными
- [ ✅ ] Namespace web28
- [ ✅ ] ConfigMap + Secret
- [ ✅ ] Deployment (3 реплики, RollingUpdate)
- [ ✅ ] Service ClusterIP
- [ ✅ ] Ingress (nginx)
- [ ✅ ] PostgreSQL зависимость
- [ ✅ ] livenessProbe + readinessProbe
- [ ✅ ] resources (requests/limits)
- [ ✅ ] Метаданные в labels
- [ ✅ ] Port-forward проверка
- [ ✅ ] Логирование метаданных
- [ ✅ ] Graceful shutdown
- [ ✅ ] Rolling Update без простоя

---

## Вывод

В ходе выполнения лабораторной работы №2 были освоены следующие навыки:

Подготовка Kubernetes-манифестов
Созданы манифесты для развертывания HTTP-сервиса: Namespace web28, Deployment с 3 репликами и стратегией RollingUpdate (maxUnavailable=0, maxSurge=1), Service типа ClusterIP и Ingress с ingressClassName: nginx.

Конфигурация приложения
Настроена передача конфигурации через ConfigMap (PORT, STU_ID, STU_GROUP, STU_VARIANT, параметры БД) и Secret для безопасного хранения пароля PostgreSQL.

Probes и управление ресурсами
Реализованы livenessProbe и readinessProbe (HTTP, порт 8034) для мониторинга состояния приложения. Установлены requests (cpu=200m, memory=256Mi) и limits (cpu=400m, memory=512Mi) для управления ресурсами.

Развертывание зависимостей
Развернута база данных PostgreSQL в виде отдельного Deployment с Service для обеспечения сетевой связности.

Метаданные и именование
В манифесты добавлены необходимые labels: org.bstu.student.fullname, org.bstu.student.id, org.bstu.group, org.bstu.variant, org.bstu.course, org.bstu.owner, org.bstu.student.slug (feis-576-220253-v28).

Проверка работоспособности
Доступ к приложению проверен через kubectl port-forward и curl-запросы к эндпоинтам /live, /ready и /. Выполнен Rolling Update без простоя. Подтвержден graceful shutdown с корректной обработкой сигнала SIGTERM и закрытием соединения с базой данных.

Работа выполнена в соответствии с вариантом №28.