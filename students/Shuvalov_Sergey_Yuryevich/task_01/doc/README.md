<p align="center">Министерство образования Республики Беларусь</p>
<p align="center">Учреждение образования</p>
<p align="center">“Брестский Государственный технический университет”</p>
<p align="center">Кафедра ИИТ</p>
<br><br><br><br><br><br>
<p align="center"><strong>Лабораторная работа №1</strong></p>
<p align="center"><strong>По дисциплине:</strong> “Распределенные системы и облачные технологии”</p>
<p align="center"><strong>Тема:</strong> Контейнеризация и Docker</p>
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

Научиться собирать минимальные образы (multi-stage) и запускать контейнеры под непривилегированным пользователем.

Закрепить основы docker-compose: зависимости (БД/кэш), volume, сети.

Настроить healthcheck и graceful shutdown. 

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

- **Язык:** Node.js 20 (Express 4.18)
- **База данных:** PostgreSQL 16
- **Порт приложения:** 9034
- **Health endpoint:** /live
- **Ready endpoint:** /ready
- **UID:** 10001 (непривилегированный пользователь)
- **Volume:** data_w28 

## Структура репозитория c описанием содержимого

README.md # отчёт с метаданными, инструкциями, скриншотами</p>
Screenshot_1.png # запуск сервисов</p>
Screenshot_2.png # статус контейнеров</p>
Screenshot_3.png # health check (/live)</p>
Screenshot_4.png # ready check (/ready)</p>
Screenshot_5.png # graceful shutdown</p>
Screenshot_6.png # остановка всех сервисов</p>
Dockerfile # multi-stage сборка</p>
docker-compose.yml # взаимодействия сервисов</p>
.dockerignore # исключения для Docker</p>
package.json # зависимости Node.js</p>
server.js # HTTP сервер с graceful shutdown</p>

## Подробное описание выполнения

1. Сборка образов: docker-compose build
2. Запуск сервисов</p>
![docker-compose up](Screenshot_1.png)
3. Статус контейнеров</p>
![docker-compose ps](Screenshot_2.png)
4. Проверка health (/live)</p>
![curl live](Screenshot_3.png)
5. Проверка ready</p>
![curl ready](Screenshot_4.png)
6. Graceful shutdown</p>
![graceful shutdown](Screenshot_5.png)
7. Остановка всех сервисов</p>
![docker-compose down](Screenshot_6.png)

## Контрольный список (checklist)

- [ ✅ ] README с полными метаданными 
- [ ✅ ] Dockerfile (multi-stage, non-root, labels)
- [ ✅ ] docker-compose.yml
- [ ✅ ] Health/Liveness/Readiness probes
- [ ✅ ] Старт/остановка: логирование и graceful 

---

## Вывод

В ходе выполнения лабораторной работы были освоены следующие навыки:

Контейнеризация приложения на Node.js/Express с использованием Docker

Создание multi-stage Dockerfile для минимизации размера образа (финальный образ на основе alpine)

Запуск контейнеров под непривилегированным пользователем (UID 10001) для повышения безопасности

Настройка healthcheck эндпоинта /live для мониторинга состояния контейнера

Оркестрация сервисов с помощью docker-compose (app + PostgreSQL)

Работа с именованными томами (data_w28) и сетями

Реализация graceful shutdown — корректная обработка сигнала SIGTERM с закрытием соединений с БД

Логирование метаданных при старте контейнера

Соблюдение требований к именованию ресурсов согласно варианту (slug, теги, имена контейнеров)

Работа выполнена в соответствии с вариантом №28 на стеке Node/Express.