# Nuxt Boilerplate

Professional full-stack Nuxt 4 boilerplate with PostgreSQL, authentication, CRUD, search, and pagination.

## Architecture

```
Client (Browser)
   ↓
Nuxt Pages & Components
   ↓
Composables (useAuth, useApi, useTasks, useUsers)
   ↓
Nitro API Server (server/api/)
   ↓
Service Layer (server/services/)
   ↓
Repository Layer (server/repositories/)
   ↓
Prisma ORM
   ↓
PostgreSQL
```

## Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | Nuxt 4, Vue 3, TypeScript      |
| Backend     | Nitro (Nuxt server)            |
| Database    | PostgreSQL                     |
| ORM         | Prisma                         |
| Auth        | JWT + HttpOnly cookies         |
| Validation  | Zod                            |
| Testing     | Vitest, Playwright             |

## Project Structure

```
nuxt-boilerplate/
├── app.vue
├── nuxt.config.ts
├── pages/
│   ├── index.vue            # Dashboard
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   ├── tasks/
│   │   ├── index.vue         # Task list with search & pagination
│   │   ├── create.vue        # Create task form
│   │   ├── [id].vue          # Task detail
│   │   └── [id]/edit.vue     # Edit task form
│   └── users/
│       └── index.vue         # User management (admin)
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── layouts/
│   ├── default.vue           # Authenticated layout
│   └── auth.vue              # Guest layout (login/register)
├── composables/
│   ├── useApi.ts             # HTTP client wrapper
│   ├── useAuth.ts            # Authentication state & methods
│   ├── useUsers.ts           # User CRUD operations
│   └── useTasks.ts           # Task CRUD operations
├── middleware/
│   ├── auth.ts               # Protects authenticated routes
│   └── guest.ts              # Redirects authenticated users
├── server/
│   ├── api/
│   │   ├── health.get.ts
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   ├── users/
│   │   │   ├── index.get.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   └── tasks/
│   │       ├── index.get.ts
│   │       ├── index.post.ts
│   │       ├── [id].get.ts
│   │       ├── [id].put.ts
│   │       └── [id].delete.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── task.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   └── task.repository.ts
│   ├── middleware/
│   │   └── auth.ts           # Server-side auth middleware
│   └── utils/
│       ├── prisma.ts         # Prisma client singleton
│       ├── jwt.ts            # Token generation & verification
│       ├── errors.ts         # Error classes & handler
│       └── validation.ts     # Zod schemas
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── types/
│   └── index.ts              # Shared TypeScript types
├── utils/
├── assets/
│   └── css/
│       └── main.css
├── errors/
│   └── error.vue             # Error page
├── tests/
│   ├── unit/
│   │   ├── validation.test.ts
│   │   └── jwt.test.ts
│   └── e2e/
└── public/
```

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL >= 15
- npm

### Installation

```bash
# Clone the project
git clone <repo-url> nuxt-boilerplate
cd nuxt-boilerplate

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Setup database
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

The development server starts at `http://localhost:3000`.

### Default accounts (after seeding)

| Email              | Password     | Role    |
|--------------------|-------------|---------|
| admin@example.com  | password123 | ADMIN   |
| user@example.com   | password123 | USER    |

## Database Setup

### PostgreSQL Installation

**Fedora/RHEL:**
```bash
sudo dnf install postgresql-server
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database

```bash
sudo -u postgres psql -c "CREATE DATABASE nuxt_boilerplate;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

### Prisma Commands

```bash
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma db push        # Push schema to DB (no migration)
npx prisma studio         # Open Prisma Studio GUI
npx prisma db seed        # Seed database
```

## API Endpoints

### Authentication

| Method | Endpoint            | Description      | Auth Required |
|--------|---------------------|------------------|:---:|
| POST   | `/api/auth/login`   | Login            | No  |
| POST   | `/api/auth/register`| Register         | No  |
| POST   | `/api/auth/logout`  | Logout           | No  |
| GET    | `/api/auth/me`      | Get current user | Yes |

### Users

| Method | Endpoint               | Description    | Auth Required |
|--------|------------------------|----------------|:---:|
| GET    | `/api/users`           | List users     | Yes  |
| GET    | `/api/users/:id`       | Get user       | Yes  |
| PUT    | `/api/users/:id`       | Update user    | Yes  |
| DELETE | `/api/users/:id`       | Delete user    | Yes  |

### Tasks

| Method | Endpoint               | Description    | Auth Required |
|--------|------------------------|----------------|:---:|
| GET    | `/api/tasks`           | List tasks     | Yes  |
| POST   | `/api/tasks`           | Create task    | Yes  |
| GET    | `/api/tasks/:id`       | Get task       | Yes  |
| PUT    | `/api/tasks/:id`       | Update task    | Yes  |
| DELETE | `/api/tasks/:id`       | Delete task    | Yes  |

### Query Parameters (GET /api/tasks, GET /api/users)

| Parameter | Type   | Default | Description          |
|-----------|--------|---------|----------------------|
| page      | number | 1       | Page number          |
| limit     | number | 10      | Items per page       |
| search    | string | -       | Search query         |
| sort      | string | createdAt | Sort field          |
| order     | string | asc     | Sort order           |
| status    | string | -       | Filter by status (tasks only) |

## Features

- **Authentication**: JWT-based auth with HttpOnly cookies
- **Authorization**: Role-based access (USER/ADMIN)
- **CRUD Operations**: Full create, read, update, delete for users and tasks
- **Search**: Case-insensitive search with debounced input
- **Pagination**: Server-side pagination with page controls
- **Validation**: Zod schemas for all inputs
- **Error Handling**: Unified error response format
- **Security**: Password hashing (bcrypt), HttpOnly cookies, input validation
- **Service Layer**: Business logic separated from route handlers
- **Repository Pattern**: Data access abstraction
- **Responsive UI**: Tailwind CSS styling
- **Testing**: Unit tests with Vitest

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests (requires Playwright)
npx playwright install
npx playwright test
```

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `.output/` directory to a Node.js server with PostgreSQL.

### Recommended Production Stack

```
Nginx (reverse proxy)
  ↓
Node.js (Nuxt 4)
  ↓
PostgreSQL
  ↓
Linux (Ubuntu/Debian or Fedora/RHEL)
```
