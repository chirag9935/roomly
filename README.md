# PG / Hostel Sharing Platform

A full-stack web application for finding, listing, and matching PG (paying guest) and hostel accommodations. Built as a solution to the unreliable, broker-dependent, unverified listing process students and young professionals typically face when relocating to a new city.

> Built as a learning project to gain hands-on, end-to-end experience with the React + Node + Express + PostgreSQL stack.


## Features

**For Seekers**
- Browse and search PG listings with filters (city, budget range, occupancy type, gender preference)
- View detailed listing information — amenities, house rules, rent, owner contact
- Set roommate preferences (budget, city, sleep schedule, food habit, cleanliness) and get matched with compatible seekers based on overlapping criteria
- Send inquiries to listing owners and track their status

**For Owners**
- Create, edit, and delete PG listings
- Manage listing lifecycle status (active → under inquiry → booked → closed)
- View and respond to inquiries from interested seekers

**Platform-wide**
- JWT-based authentication with role-based access control (seeker / owner)
- Ownership enforced at the database query level, not just in application logic

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router v7, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (hosted on [Neon](https://neon.tech) — serverless Postgres) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
Frontend (React/Vite)  →  REST API (Express)  →  PostgreSQL (Neon)
     Vercel                    Render                 Neon
```

The backend follows a layered structure separating concerns:
```
backend/src/
├── config/       # DB connection pool
├── controllers/  # Request handling, validation, business logic
├── models/       # Raw SQL queries (parameterized, no ORM)
├── routes/       # Route definitions
├── middleware/   # Auth guard, role authorization, error handling
└── app.js        # Express app configuration
```

Raw SQL (via the `pg` library) was used deliberately instead of an ORM, to work directly with query design, indexing considerations, and relational modeling rather than abstracting it away.

## Database Schema

Four core entities:

- **users** — unified table for both seekers and owners, differentiated by a `role` column
- **listings** — owner-posted PG listings, including a lifecycle `status` enum (active / under_inquiry / booked / closed)
- **roommate_preferences** — one-to-one profile per user (enforced via a `UNIQUE` constraint) used for compatibility matching
- **inquiries** — seeker-to-owner contact requests tied to a specific listing

Roommate matching is computed at query time (not pre-stored) — the API compares a user's preferences against everyone else's on the fly, checking for matching city and sleep schedule, and *overlapping* (not exact) budget ranges.

## Getting Started

### Prerequisites
- Node.js (v18+)
- A free [Neon](https://neon.tech) Postgres project (or any Postgres instance)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in DATABASE_URL and JWT_SECRET
npm run dev
```

Run the SQL migration files in `backend/src/db/migrations/` against your database (via the Neon SQL editor, or `psql`) in numeric order before starting the server.

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | — |
| POST | `/api/auth/login` | Log in | — |
| GET | `/api/listings/search` | Search/filter listings | — |
| GET | `/api/listings/:id` | Get a single listing | — |
| POST | `/api/listings` | Create a listing | Owner |
| PUT | `/api/listings/:id` | Update own listing | Owner |
| DELETE | `/api/listings/:id` | Delete own listing | Owner |
| GET | `/api/listings/my-listings` | Get own listings | Owner |
| PUT | `/api/roommate/preferences` | Set/update roommate preferences | Any user |
| GET | `/api/roommate/matches` | Get compatible roommates | Any user |
| POST | `/api/inquiries` | Send an inquiry | Seeker |
| GET | `/api/inquiries/sent` | View sent inquiries | Seeker |
| GET | `/api/inquiries/received` | View received inquiries | Owner |
| PUT | `/api/inquiries/:id/status` | Update inquiry status | Owner |

## Security Notes

- Passwords hashed with bcrypt (salted, cost factor 10) — never stored or transmitted in plaintext
- All SQL queries use parameterized placeholders to prevent SQL injection, including dynamically built search/filter queries
- JWTs signed with a server-side secret; ownership of resources (listings, inquiries) is enforced directly in SQL `WHERE` clauses, not just checked in application code
- Role-based route protection on both backend (Express middleware) and frontend (route guards) — the frontend guard is a UX convenience only; all real enforcement happens server-side

## Roadmap / Future Scope

- Ratings and reviews for listings and completed stays
- Owner KYC / listing verification
- Visit-booking calendar workflow
- Real-time chat (currently a simpler inquiry/status model)
- True geolocation radius-based search
- Admin moderation dashboard

## Author

Chirag Chaudhary — learning by building, one deliberate decision at a time. 
