# Task Manager (Next.js + TypeScript)

Клиентская часть Task Manager с требованиями:
- Next.js (React + TypeScript)
- MUI UI
- Redux Toolkit + RTK Query
- JWT auth
- Кэширование GET с TTL 5 минут + инвалидация при мутациях
- Web Worker для CPU-intensive обработки отчета
- Jest + React Testing Library, coverage >= 70%

## Локальный запуск

```bash
npm ci
npm run dev
```

Приложение: `http://localhost:3000`

## Тесты и coverage

```bash
npm run test
npm run test:coverage
```

Порог coverage настроен в `jest.config.mjs` и упадет при значениях ниже 70%.

## Docker

### Сборка образа

```bash
docker build -t task-manager:local .
```

### Запуск контейнера

```bash
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com \
  -e NEXT_PUBLIC_SOCKET_URL= \
  task-manager:local
```

## Docker Compose

### Запуск приложения

```bash
docker compose up -d app
```

### Запуск приложения + локального Docker Registry (опционально)

```bash
docker compose --profile registry up -d
```

Сервисы:
- `app` — Next.js приложение на `:3000`
- `registry` — локальный registry на `:5000`

## CI/CD (пример на GitHub Actions)

Workflow: `.github/workflows/ci-cd.yml`

Пайплайн делает:
1. `npm ci`
2. `npm run test:coverage` (фейл при coverage < 70%)
3. `docker build` образа
4. push образа в локальный registry (`localhost:5000`) на ветке `main`
5. пример команды deploy на тестовый сервер по SSH

### Как настроить

1. Добавить репозиторий в GitHub.
2. Убедиться, что workflow файл лежит в `.github/workflows/ci-cd.yml`.
3. Для реального deploy по SSH:
- добавить secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` (если используете ssh-action)
- заменить шаг `Deploy to test server (example)` на рабочий деплой шаг.

### Минимальный вариант деплоя на тестовый сервер

На сервере заранее:
- установить Docker и Docker Compose
- положить `docker-compose.yml` в `/opt/task-manager/`

Команда деплоя (пример):

```bash
ssh user@test-server "docker pull localhost:5000/task-manager:latest && docker compose -f /opt/task-manager/docker-compose.yml up -d"
```

## Переменные окружения

- `NEXT_PUBLIC_API_BASE_URL` — базовый URL REST API (по умолчанию `https://dummyjson.com`)
- `NEXT_PUBLIC_SOCKET_URL` — URL Socket.IO сервера (по умолчанию пустой)
