# TypeScript, Fastify, Prisma, AWS S3 and Monorepo

---

## Overview

This project is a **monorepo** setup for managing a Fastify-based API and a Prisma-based database service. It uses a Yarn workspace structure to organize code and streamline dependencies across packages.

---

## Architecture Overview

- Fastify:
  - Main framework for API development.
  - Plugins for Swagger documentation, authentication, user roles, error handling and WebSockets.
- Prisma:
  - ORM for managing Postgres database operations.
  - Includes schema migrations and type-safe queries.
- Docker:
  - Used to run Postgres locally.
  - Simplifies database setup and teardown.

---

## Project Structure

```bash
├── packages/
│   ├── api/                         # Fastify API service
│   │   ├── src/
│   │   │   ├── routes/              # API routes
│   │   │   ├── plugins/             # Fastify plugins
│   │   │   ├── app.ts               # Main entry point for the API
│   │   │   └── index.ts             # Fastify APP
│   │   └── package.json             # API service dependencies
│   ├── services/
│   │   ├── database/                # Prisma database service
│   │   │   ├── src/
│   │   │   │   ├── userService.ts   # Database functions for user operations
│   │   │   └── index.ts             # Main entry point for the DATABASE
│   │   │   ├── schema.prisma        # Prisma schema for database
│   │   │   └── __mocks__/           # Mocked Prisma client for testing
│   │   └── package.json             # Database service dependencies
│   └── utils/                       # Utility functions and shared modules
│       ├── src/
│       │   ├── auth/
│       │   │   ├── password.ts      # Password hashing utilities
│   │   │   └── index.ts             # Main entry point for the UTILS
│       └── package.json             # Utilities package dependencies
├── docker-compose.yml               # Docker setup for running Postgres locally
├── package.json                     # Root package dependencies
└── README.md                        # Project documentation

```

---

## Features

- **API Service**: Built with Fastify for high performance for:

  - User CRUD managment and authentification using **JWT**.
  - File upload using **AWS S3**
  - Real-Time Notification using **Websocket**.

- **Database Service**: Managed with Prisma, offering type-safe database operations.
  - **User** Table.
  - **Posts** Table.
- **Utilities**: Common utilities:
  - Password hashing using **bcrypt**.
- **Monorepo Management**: Streamlined with Yarn workspaces.
- **Dockerized Postgres**: Simplified local database setup using **docker-compose**.

---

## Requirements

- Node.js 20.16.0 or later
- Yarn 1.x or 3.x (for workspace support)
- Docker and Docker-Compose (for local database)

---

## Environment Variables

1. **Postgres Docker**
   Create an `.env` file at the root of the repository based on the `.env.example`
2. **Api**
   Create an `.env` file under `packages/api`based on the `packages/api/.env.example`
3. **Prisma**
   Create an `.env` file under `packages/services/database`based on the `packages/services/database/.env.example`

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```
2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Build the packages**:

   ```bash
   yarn build:all
   ```

4. **Run the database**:

   ```bash
   docker-compose up -d
   ```

5. **Migrate the database**:

   ```bash
   yarn migrate
   ```

---

## Running Locally

1. **Start the API server**:
   ```bash
   yarn start:api
   ```
2. **Access the API**:

- Swagger Docs: http://localhost:3000/docs
- API Base URL: http://localhost:3000/api

---

## Testing

- **Run all tests**:

  ```bash
  yarn test
  ```
