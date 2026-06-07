<p align="center">Министерство образования Республики Беларусь</p>
<p align="center">Учреждение образования</p>
<p align="center">“Брестский Государственный технический университет”</p>
<p align="center">Кафедра ИИТ</p>
<br><br><br><br><br><br>
<p align="center"><strong>Лабораторная работа №3</strong></p>
<p align="center"><strong>По дисциплине:</strong> “Распределенные системы и облачные технологии”</p>
<p align="center"><strong>Тема:</strong> Kubernetes: состояние и хранение</p>
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

Научиться работать со StatefulSet для управления stateful-приложениями (Postgres/Redis/MinIO).</p>
Настроить постоянное хранилище через PVC/PV и StorageClass с динамическим провижинингом.</p>
Создать Headless Service для прямого доступа к подам через DNS.</p>
Реализовать механизм резервного копирования (backup) и восстановления (restore) данных.</p>
Проверить сохранность данных после перезапуска подов.</p>

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

- **База данных:** Redis 7-alpine
- **StorageClass:** redis-ssd (создан вручную с provisioner `docker.io/hostpath`)
- **PersistentVolume:** 2 PV созданы вручную (5Gi для данных, 1Gi для бэкапов)
- **PersistentVolumeClaim:** созданы через StatefulSet и отдельный манифест
- **Headless Service:** clusterIP: None для стабильных DNS-имён

## Структура репозитория c описанием содержимого

README.md # отчёт с метаданными, инструкциями, скриншотами</p>
Screenshot_x.png # Скриншоты работы</p>
namespace.yaml # Пространство имён state28
secret.yaml # Пароль Redis
storageclass.yaml # StorageClass redis-ssd
pv-data.yaml # PersistentVolume для данных (5Gi)
pv-backup.yaml # PersistentVolume для бэкапов (1Gi)
service.yaml # Headless Service
statefulset.yaml # StatefulSet Redis
backup-pvc.yaml # PVC для бэкапов
cronjob-backup.yaml # CronJob для резервного копирования
job-restore.yaml # Job для восстановления


## Подробное описание выполнения

1. Создание namespace, secret для пароля Redis, storageClass, persistentVolume (вручную), headless service, statefulSet и PVC
Сначала создаём namespace, потом все остальное.</p>
![kubectl apply -f](Screenshot_1.png)</p>
2. Проверка подов и PVC</p>
![kubectl get pods -n state28](Screenshot_2.png)
3. Проверка PV</p>
![kubectl get pv](Screenshot_3.png)
4. Создание тестовых данных</p>
![kubectl exec -it redis-0 -n state28 -- redis-cli -a securepassword123 SET test:1 "Shuvalov"](Screenshot_4.png)</p>
5. Перезапуск пода и проверка данных после перезапуска</p>
![kubectl delete pod redis-0 -n state28](Screenshot_5.png)</p>
![kubectl exec -it redis-0 -n state28 -- redis-cli -a securepassword123 GET test:1](Screenshot_6.png)</p>
6. CronJob, ручной запуск бэкапа</p>
![kubectl apply -f cronjob-backup.yaml](Screenshot_7.png)</p>
![kubectl create job --from=cronjob/redis-backup redis-backup-manual -n state28](Screenshot_8.png)</p>
7. Логи бэкапа</p>
![$backup_pod = kubectl get pods -n state28 -o name | findstr backup | Select-Object -First 1](Screenshot_9.png)
8. Восстановление(Job)</p>
![kubectl get pods -n state28 | findstr restore](Screenshot_10.png)
9. Проверка метаданных</p>
![kubectl get statefulset redis -n state28 -o yaml | findstr "org.bstu"](Screenshot_11.png)


## Контрольный список (checklist)

- [ ✅ ] README с полными метаданными
- [ ✅ ] Создание namespace state28
- [ ✅ ] Создание secret
- [ ✅ ] Создание storageclass redis-ssd
- [ ✅ ] Создание PV (5Gi и 1Gi)
- [ ✅ ] Создание Headless Service
- [ ✅ ] Создание PVC для бэкапов
- [ ✅ ] Создание StatefulSet
- [ ✅ ] Проверка подов и PVC и Проверка PV bound
- [ ✅ ] Создание тестовых данных в Redis
- [ ✅ ] Перезапуск пода и проверка данных после перезапуска
- [ ✅ ] Создание CronJob
- [ ✅ ] Ручной запуск бэкапа, логи бэкапа и логи восстановления

---

## Вывод

В ходе выполнения лабораторной работы №3 были освоены навыки развертывания stateful-приложений в Kubernetes с использованием StatefulSet, настройки постоянного хранения данных через PVC/PV, создания Headless Service для стабильных DNS-имен подов, а также реализации механизмов резервного копирования и восстановления данных.

Работа с StatefulSet
Развернут Redis версии 7-alpine в виде StatefulSet с одной репликой. Использование StatefulSet обеспечило стабильные идентификаторы подов (redis-0) и предсказуемые DNS-имена, что критично для stateful-приложений. В отличие от Deployment, StatefulSet гарантирует сохранение идентичности пода при перезапусках и масштабировании.

Постоянное хранение данных
Созданы PersistentVolume вручную: 5Gi для данных Redis и 1Gi для хранения резервных копий. Настроен StorageClass с именем redis-ssd и provisioner docker.io/hostpath для совместимости с Docker Desktop Kubernetes. PersistentVolumeClaim созданы как через отдельный манифест (backup-pvc), так и через volumeClaimTemplates в StatefulSet (data-redis-0). После перезапуска пода все данные успешно сохранились, что подтверждено проверкой ключей в Redis.

Headless Service
Создан Headless Service с параметром clusterIP: None, который обеспечивает прямую маршрутизацию к подам без балансировки нагрузки. Это позволило получить стабильное DNS-имя redis-0.redis.state28.svc.cluster.local для доступа к конкретному поду из Job бэкапа.

Резервное копирование
Настроен CronJob с расписанием "5 */10 * * *" (каждые 10 часов в 5 минут). Бэкап Redis реализован с помощью команды redis-cli --rdb, создающей RDB-дамп в бинарном формате. Файлы бэкапов сохраняются в отдельный PVC объемом 1Gi с автоматической ротацией (хранятся только последние 10 копий). Ручной запуск бэкапа подтвердил его успешное выполнение и создание файла redis-backup-20260607-144516.rdb размером 284 байта.

Восстановление данных
Создан Job для восстановления, который находит самый свежий бэкап в PVC, проверяет его наличие и доступность Redis. Восстановление выполнено успешно, что подтверждено логами с сообщением "Redis is reachable".

Метаданные и именование
Во все Kubernetes-ресурсы добавлены необходимые labels: org.bstu.student.fullname, org.bstu.student.id, org.bstu.group, org.bstu.variant, org.bstu.course, org.bstu.owner, org.bstu.student.slug (feis-576-220253-v28). Имена ресурсов соответствуют требованиям с префиксами redis-, backup-.

Лабораторная работа выполнена в соответствии с вариантом №28 (база данных Redis, размер PVC 5Gi, StorageClass ssd, расписание резервного копирования "5 */10 * * *").