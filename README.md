# Pagebound — Online Bookstore

A full-stack online bookstore: a Spring Boot REST API backed by MySQL, and a
React (Vite) frontend with JWT authentication, a searchable/filterable book
catalogue, and a responsive UI.

## Tech Stack

| Layer    | Technology                                              |
| -------- | -------------------------------------------------------- |
| Frontend | React 18, React Router, Axios, Tailwind CSS, Vite         |
| Backend  | Spring Boot 3, Spring Security, Spring Data JPA           |
| Database | MySQL 8 (MariaDB 10.11+ also works)                        |
| Auth     | JWT (stateless, `Authorization: Bearer <token>`)           |
| Build    | Maven (backend), Vite (frontend)                            |

## Prerequisites

- Node.js 18+ and npm 9+
- Java 17+ (developed against Java 21) and Maven 3.8+
- MySQL 8 (or MariaDB 10.11+) server running locally

## 1. Database setup

```sql
CREATE DATABASE bookstore_db;
CREATE USER 'bookstore'@'localhost' IDENTIFIED BY 'bookstore_pass';
GRANT ALL PRIVILEGES ON bookstore_db.* TO 'bookstore'@'localhost';
FLUSH PRIVILEGES;
```

(Adjust the username/password to match `backend/.env.example`, or override
via environment variables — see below.)

## 2. Backend (Spring Boot)

```bash
cd backend
cp .env.example .env   # then export these, or set them in your shell/IDE
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. Config is driven entirely by
environment variables (see `backend/.env.example` and
`src/main/resources/application.yml`) — no secrets are hardcoded.

On first startup, `DataSeeder` (a `CommandLineRunner`) seeds 6 categories and
20 sample books if the `books` table is empty, so the catalogue has data to
browse immediately. The JPA schema (`users`, `categories`, `books`) is
created/updated automatically via `spring.jpa.hibernate.ddl-auto=update`.

### Quick API check

```bash
curl http://localhost:8080/api/categories
curl http://localhost:8080/api/books/featured
curl "http://localhost:8080/api/books?page=0&size=5&sort=price,asc&genre=Fiction"
```

### REST API

| Method | Endpoint              | Description                          | Auth   |
| ------ | ---------------------- | ------------------------------------- | ------ |
| POST   | `/api/auth/register`  | Register a new user                    | Public |
| POST   | `/api/auth/login`     | Authenticate, returns a JWT             | Public |
| GET    | `/api/books`          | Paginated/filterable/sortable list      | Public |
| GET    | `/api/books/featured` | Featured books for the home page         | Public |
| GET    | `/api/books/{id}`     | Single book details                      | Public |
| GET    | `/api/categories`     | List all categories                       | Public |
| POST   | `/api/orders`         | Checkout: place an order from cart items | Required |
| GET    | `/api/orders`         | Current user's order history             | Required |
| GET    | `/api/orders/{id}`    | A single order (must belong to caller)   | Required |

`GET /api/books` query params: `search`, `genre` (repeatable), `author`,
`minPrice`, `maxPrice`, `inStock`, `page`, `size`, `sort`
(`price,asc` / `price,desc` / `title,asc` / `createdAt,desc`).

`POST /api/orders` body: `{ "items": [{ "bookId": 1, "quantity": 2 }, ...], "shippingAddress": "..." }`.
Stock is validated and decremented atomically in one transaction; if any
item's requested quantity exceeds available stock, the whole order is
rejected with `409 Conflict` and no stock is touched.

## 3. Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL if the backend isn't on :8080
npm install
npm run dev
```

Open `http://localhost:3000`.

- `npm run dev` — start the dev server
- `npm run build` — production build (output in `frontend/dist`)
- `npm run preview` — preview the production build
- `npm run lint` — ESLint

## Project structure

```
onlinebookstore/
├── backend/
│   └── src/main/java/com/bookstore/
│       ├── controller/   # REST endpoints
│       ├── service/      # business logic
│       ├── repository/   # Spring Data JPA repositories
│       ├── model/        # JPA entities
│       ├── dto/          # request/response payloads
│       ├── security/     # JWT filter, JwtUtil, UserDetailsService
│       ├── config/       # SecurityConfig, CORS, DataSeeder
│       └── exception/    # custom exceptions + @RestControllerAdvice
│
└── frontend/
    └── src/
        ├── components/   # Navbar, Footer, BookCard, CategoryCard, ...
        ├── pages/        # Home, Login, Register, Catalogue, BookDetail,
        │                 # Cart, Checkout, OrderHistory
        ├── services/     # api.js (Axios instance with JWT interceptor)
        └── context/      # AuthContext (login state), CartContext (cart state)
```

## Notable implementation details

- **Auth**: passwords are hashed with BCrypt; login/registration issue a
  signed JWT (HS256) with a configurable expiration, validated on every
  request by a stateless `OncePerRequestFilter`.
- **Validation**: registration fields are validated both client-side (inline
  errors) and server-side (Bean Validation annotations + a
  `@RestControllerAdvice` that turns validation/duplicate-email/bad-credential
  errors into consistent JSON error responses with proper HTTP status codes).
- **Catalogue filtering**: implemented with JPA Specifications
  (`BookSpecifications`) composed dynamically from whichever query params are
  present, so search, genre, author, price range, and availability can be
  combined freely alongside pagination and sorting.
- **Protected routes**: the frontend's `ProtectedRoute` wrapper redirects
  unauthenticated users to `/login` (used for the book detail page and
  checkout) and returns them to where they came from after logging in.
- **Cart & checkout**: the cart itself is client-side (`CartContext`,
  persisted to `localStorage`, cleared on logout) — it's just a staging area
  while browsing. Checkout submits the cart to `POST /api/orders`, which is
  the actual source of truth: it re-validates stock server-side, decrements
  it, and persists an `Order`/`OrderItem` row per purchase inside a single
  transaction, so a race between two checkouts (or a stale client-side stock
  figure) can't oversell — the second request simply gets a `409` naming the
  book and the shortfall.
