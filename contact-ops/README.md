# contact-ops

Local runtime orchestration for the contact app. Runs the full stack via Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose plugin (Docker Desktop or `docker compose` CLI)

## Running the app

```sh
cd contact-ops
docker compose up --build
```

Then open [http://localhost](http://localhost) in your browser.

To stop the stack:

```sh
docker compose down
```

## Configuration

Copy `.env.example` to `.env` and edit as needed:

```sh
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `HELLO_MESSAGE` | `Hello, World!` | The greeting message served by the API |

If no `.env` file is present, the app runs with the built-in defaults and no manual setup is required.
