# contact-ops

Local runtime orchestration for the contact app. Runs all services via Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose plugin (v2)

## Running the app

From this directory:

```bash
docker compose up --build
```

This builds and starts three containers:

| Service | Role | Internal port |
|---|---|---|
| `contact-nginx` | Reverse proxy, entry point | `80` (exposed) |
| `contact-api` | Express API | `3001` (internal) |
| `contact-frontend` | Vite dev server | `5173` (internal) |

Once running, open **http://localhost** in your browser. The page should display `Hello, World!`.

## Verifying the API directly

```bash
curl http://localhost/api/hello
```

Expected response:

```json
{"message":"Hello, World!"}
```

## Verifying the frontend

Open **http://localhost** in a browser. The React app fetches `/api/hello` on load and renders the message. If the API is unreachable, an error notice is shown instead.

## Stopping the stack

```bash
docker compose down
```

## Environment variables

All variables have working defaults — no `.env` file is required to run locally.

To customise, copy `.env.example` to `.env` and edit:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `HELLO_MESSAGE` | `Hello, World!` | Message returned by `GET /api/hello` |

## Running in detached mode

```bash
docker compose up --build -d
```

Check container status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```
