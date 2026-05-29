*This project has been created as part of the 42 curriculum by ncamobel, duamarqu, framador, dioalexa, lede-gui*

# Brunchio

Brunchio is the working name of this Transcendence project: a secure recipe-sharing web application built with a React frontend, an HTTPS API gateway, and two backend microservices backed by PostgreSQL and Redis.

## Description

The app lets users register, log in, complete 2FA, connect GitHub OAuth, edit their profile, upload avatars, manage friends, and browse or submit recipes for moderation. Public recipes and pending recipes are split into separate flows so the admin side can review submissions before they become visible to everyone.

The frontend is built with React, TypeScript, Vite, Material UI, and SSR support. The backend is split into an auth service, a recipes service, and an HTTPS API gateway. The whole stack is containerized and designed to run with a single command.

## Features

- Email/password authentication with JWT sessions.
- GitHub OAuth login.
- Two-factor authentication with TOTP.
- Profile management, public profiles, and avatar uploads.
- Friend requests and friend lists.
- Public recipes and pending recipe moderation.
- CSV recipe import support.
- HTTPS everywhere through the gateway.
- Redis-backed rate limiting.
- Privacy Policy and Terms of Service pages accessible from the footer.
- Responsive UI with Material UI components.
- Server-side rendering for the frontend.

## Instructions

### Prerequisites

- Docker and Docker Compose.
- Node.js 22+ if you want local frontend development outside Docker.
- A root-level `.env` file.

### Environment Setup

1. Copy `.env.example` to `.env`.
2. Replace the placeholder values with your real PostgreSQL, JWT, GitHub OAuth, and host settings.
3. Generate the local certificates with `./gen_certs.sh` if they are missing.

### Run The Project

1. Start the full stack from the repository root with `make`.
2. Stop everything with `make down`.
3. Restart the stack with `make restart`.
4. Run only the backend services with `make -C backend docker_build docker_up`.
5. Stop only the backend services with `make -C backend docker_down`.
6. View backend logs with `make -C backend docker_logs`.

### Main URLs

- Frontend: `https://localhost:1025`
- API gateway: `https://localhost:3443`
- Public API: `https://localhost/api`
- Privacy Policy: `https://localhost/privacy-policy`
- Terms of Service: `https://localhost/terms-of-service`
- PgAdmin: `https://localhost:5050`

### Local Frontend Development

- Run the frontend only with `cd frontend && npm install && npm run dev:ssr`.
- The root Makefile also includes a combined development target: `make dev-frontend-local`.

## Team Information

Ncampbel - Product Owner, Project Manager, Developer
Framador - Project Manager, Technical Lead, Developer
Duamarqu - Technical Lead, Developer
Dioalexa - Project Manager, Developer
Lede-gui - Architect, Developer

### Role Breakdown

Product Owner

ncampbell — defines the product vision, maintains the product backlog, prioritizes features, validates completed work, and communicates with stakeholders.

Project Manager / Scrum Master

ncampbell, framador, dioalexa — collectively responsible for organizing meetings, tracking progress and deadlines, ensuring team communication, and managing risks and blockers.

Technical Lead / Architect

framador, duamarqu, lede-gui — oversee technical decisions and architecture, define the technology stack, ensure code quality and best practices, and review critical code changes.

Developers

All team members — implement assigned features, participate in code reviews, test their own implementations, and document their work.

## Project Management

To stay organised and aligned throughout the project, we relied on a combination of structured planning and constant communication.

- Planning method: Regular group meetings and calls, supplemented by ongoing discussions over WhatsApp.
- Task tracking tool: We used Linear to manage and track tasks, keeping everyone aware of progress and priorities.
- Communication channel: Day-to-day communication happened primarily over WhatsApp, allowing for quick updates and decisions.
- Code review practice: We enforced a strict branching policy — direct pushes to main were not allowed. Every pull request required approval from at least one other team member, with review coverage across all changed files.

## Technical Stack

- Frontend: React 19, TypeScript, Vite, React Router, Material UI, GSAP.
- Backend: Express 5, JWT, bcrypt, Multer, Speakeasy, Redis, Axios, node-postgres.
- Database: PostgreSQL.
- Infra: Docker, Docker Compose, HTTPS certificates, API gateway, Prometheus metrics, Grafana and ELK-related monitoring services.

## API Overview

### Authentication

Protected routes require this header:

```https
Authorization: Bearer <jwt_token>
```

The auth middleware rejects missing, invalid, expired, or temporary tokens and requires a stable user identity in the payload.

### Main Auth Routes

- `POST /register`
- `POST /login`
- `POST /login/2fa`
- `GET /auth`
- `GET /auth/github`
- `GET /auth/github/callback`

### Profile Routes

- `PUT /profile`
- `PUT /profile/password`
- `POST /profile/avatar`
- `DELETE /profile/avatar`
- `POST /profile/2fa/setup`
- `POST /profile/2fa/verify`
- `POST /profile/2fa/disable`

### Friends Routes

- `GET /profile/friends`
- `POST /profile/friends`
- `GET /profile/friends/requests`
- `POST /profile/friends/requests/accept`
- `DELETE /profile/friends/requests`
- `DELETE /profile/friends`

### Recipes Routes

- `GET /recipes`
- `GET /recipes/:name`
- `POST /recipes`
- `PUT /recipes/:name`
- `DELETE /recipes/:name`
- `GET /pending/recipes`
- `POST /pending/recipes`
- `GET /pending/recipes/:name`
- `PUT /pending/recipes/:name`
- `DELETE /pending/recipes/:name`

Legacy view aliases are also available for the frontend routes:

- `/RecipeListView`
- `/RecipeView/:name`
- `/pending/RecipeListView`
- `/pending/RecipeView/:name`

## Database Schema

The schema is organized around the main application flows:

- `dev_dba.users`: user authentication, profile data, roles, avatar, 2FA state, and friend/request lists.
- `dev_dba.ingredients`: ingredient catalog data used by recipe import and moderation flows.
- `public.all_recipes`: approved recipes visible to all users.
- `public.pending_recipes`: user-submitted recipes waiting for review.

The relationships are centered on user ownership and moderation: users submit pending recipes, admins approve or reject them, and approved entries are promoted into the public recipe table.

## Resources

- React documentation: https://react.dev/
- Vite documentation: https://vite.dev/
- Express documentation: https://expressjs.com/
- Material UI documentation: https://mui.com/
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Docker documentation: https://docs.docker.com/
- JSON Web Token introduction: https://jwt.io/introduction
- GitHub OAuth documentation: https://docs.github.com/apps/oauth-apps
- TOTP / 2FA reference: https://github.com/speakeasyjs/speakeasy

### AI Usage

AI was used to reorganize and proofread this README, align it with the project rules, and format the setup and API sections from the repository content. The concrete stack, routes, and run commands were verified against the codebase before writing.