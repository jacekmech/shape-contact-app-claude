# shape-contact-ops

Local runtime orchestration for the contact app. Runs all services via Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2 (`docker compose`)

## Running the app

From this directory:

```bash
docker compose up --build
```

The app will be available at **http://localhost**.

On subsequent runs, omit `--build` if no code has changed:

```bash
docker compose up
```

To stop:

```bash
docker compose down
```

## Configuration

Copy `.env.example` to `.env` to override default values:

```bash
cp .env.example .env
```

| Variable        | Default         | Description                              |
|-----------------|-----------------|------------------------------------------|
| `HELLO_MESSAGE` | `Hello, world!` | Message returned by `GET /api/hello` and displayed on the frontend |

After changing `.env`, restart the affected service:

```bash
docker compose up api
```

## Services

| Service    | Internal port | Description          |
|------------|---------------|----------------------|
| `nginx`    | 80 (external) | Reverse proxy        |
| `api`      | 3001          | Node.js / Express    |
| `frontend` | 3000          | Vite / React         |
