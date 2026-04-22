# &#128640; Transcendence &#128640;
## General requirements
- The project must be a web application with frontend, backend, and a database;
- Containers (Docker, Podman, ...) and run with a single comand;
- Compatible with Latest Stable Version of Google Chrome;
- Privacy Policy and Terms of Service:
    - easily accessible from the app;
    - Contain relevant and appropriate content;
    - Not just placeholder or empty pages;
- Multi-User:
    - Users should be able to interact with the app at the same time;
    - Multiple users logged in;
    - Concurrent actions by different users handled properly;
    - Real-time updates are reflected across all connected users when
applicable;
    - No data corruptions or race conditions with simultaneous actions;

## Technical requirements
- Frontend:
    - Clear;
    - Responsive;
    - Accessible across all devices;
    - Use CSS Framework or styling solution (Tailwind CSS, Bootstrap, Material-UI, ...);
    - Validate user inputs and forms;
    - No WARNINGS OR ERRORS in Dev Tools terminal;
- Backend:
    - HTTPS everywhere;
    - User management system:
        - Minimum: e-mail and password, with proper security;
        - Additional validation method (2FA, OAuth, through modules);
    - Validate user inputs and forms;
- Database:
    - Clear schema;
    - Well defined relations;
- Secrets:
    - Store credentials in an .env file

## Backend (Auth + Recipes) containers

Run only the backend services (without frontend/database):

- Build + start: `make -C backend docker_build docker_up`
- Stop + remove volumes: `make -C backend docker_down`
- Logs: `make -C backend docker_logs`

Ports:

- Auth (HTTPS): https://localhost:3443
- Recipes (HTTPS): https://localhost:3443

## API documentation

### Base URL

- `https://localhost:3443`

### Authentication

- Protected routes require header:

```http
Authorization: Bearer <jwt_token>
```

- Auth middleware behavior:
    - rejects missing token (`401`);
    - rejects invalid/expired token (`401`);
    - rejects temporary tokens with `purpose` field (`401`);
    - requires user identity (`sub` or `id`) in token payload (`401`).

### Common status codes

- `200` success
- `201` created
- `204` deleted/no content
- `400` invalid payload/validation error
- `401` unauthenticated or invalid token
- `403` authenticated but forbidden
- `404` resource not found
- `429` rate limit exceeded
- `500` internal server error

### Auth endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register user (`email`, `password`, `name`) |
| POST | `/login` | No | Login with email/password |
| POST | `/login/2fa` | No | Complete login using `twoFactorToken` + `otp` |
| GET | `/auth` | Yes | Validate token and return authenticated profile info |
| GET | `/auth/github` | No | Start GitHub OAuth flow |
| GET | `/auth/github/callback` | No | GitHub OAuth callback |

### Profile endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| PUT | `/profile` | Yes | Update profile data |
| PUT | `/profile/password` | Yes | Change password |
| POST | `/profile/avatar` | Yes | Upload avatar (`multipart/form-data`) |
| DELETE | `/profile/avatar` | Yes | Remove custom avatar |

### 2FA endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/profile/2fa/setup` | Yes | Generate/setup TOTP secret |
| POST | `/profile/2fa/verify` | Yes | Verify setup code and enable 2FA |
| POST | `/profile/2fa/disable` | Yes | Disable 2FA |

### Friends endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/profile/friends` | Yes | List friends |
| POST | `/profile/friends` | Yes | Send friend request |
| GET | `/profile/friends/requests` | Yes | List pending friend requests |
| POST | `/profile/friends/requests/accept` | Yes | Accept friend request |
| DELETE | `/profile/friends/requests` | Yes | Reject/cancel friend request |
| DELETE | `/profile/friends` | Yes | Remove friend |

### Recipes endpoints

#### Public recipes (`all_recipes`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/recipes` | Yes | List all recipes |
| GET | `/recipes/:name` | Yes | Get recipe by name |
| POST | `/recipes` | Yes (admin) | Create recipe directly in all recipes |
| PUT | `/recipes/:name` | Yes (admin + owner checks) | Update recipe by name |
| DELETE | `/recipes/:name` | Yes (admin + owner checks) | Delete recipe by name |

#### Pending recipes (`pending_recipes`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/pending/recipes` | Yes | List pending recipes |
| POST | `/pending/recipes` | Yes | Submit recipe for review |
| GET | `/pending/recipes/:name` | Yes | Get pending recipe by name |
| PUT | `/pending/recipes/:name` | Yes (owner) | Update pending recipe by name |
| DELETE | `/pending/recipes/:name` | Yes (owner) | Delete pending recipe by name |

### Route aliases

- Recipes module also exposes view aliases used by legacy frontend routes:
    - `/RecipeListView`, `/RecipeView/:name`
    - `/pending/RecipeListView`, `/pending/RecipeView/:name`

### Ingredients payload format

- `ingredients` must be a JSON array of objects.

```json
[
    {
        "name": "Kiwi",
        "unit": "g",
        "quantity": 22
    },
    {
        "name": "Pineapple",
        "unit": "g",
        "quantity": 56
    }
]
```

### Minimal request example

```bash
curl -k -X POST "https://localhost:3443/pending/recipes" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <token>" \
    -d '{
        "name": "Fruit Bowl",
        "ingredients": [
            {"name": "Kiwi", "unit": "g", "quantity": 22},
            {"name": "Pineapple", "unit": "g", "quantity": 56}
        ],
        "diet": "Vegan"
    }'
```