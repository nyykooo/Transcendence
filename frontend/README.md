# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## API Documentation

This frontend consumes the backend API exposed by the `api` service.

### Base URL

- Local HTTPS (docker): `https://localhost:3443`

### Authentication

- Most protected endpoints require a Bearer token:

```http
Authorization: Bearer <jwt_token>
```

- JWT is returned by login/register/OAuth callback.

### Rate Limit

- Protected routes use user-based rate limiting in Redis.
- Current policy: `10 requests / minute / user`.
- Rate-limit key is based on stable user identity from JWT (`sub` or `id`).
- Users with JWT claim `role = admin` bypass rate limiting.
- Response headers when available:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- If limiter is unavailable, backend may return `503 Rate limiter unavailable`.

---

### Auth Endpoints

#### `POST /register`

Create a new user.

Body:

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "User Name"
}
```

Success `200`:

```json
{
  "message": "created user",
  "newuser": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "/uploads/avatars/test.webp",
    "is_active": false,
    "role": "user"
  },
  "token": "<jwt>"
}
```

Common errors: `400`, `409`, `500`.

#### `POST /login` (also accepts `POST /Login`)

Authenticate with email/password.

Body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Success `200`:

```json
{
  "message": "Sucessful login",
  "id": 1,
  "token": "<jwt>",
  "role": "user"
}
```

Common errors: `400`, `401`, `404`, `500`.

#### `GET /auth/github`

Starts GitHub OAuth flow (redirects to GitHub authorization page).

#### `GET /auth/github/callback`

OAuth callback endpoint used by GitHub.

- On success, backend redirects to frontend callback route:
  - `<FRONTEND_URL>/auth/github/callback?id=<user_id>&token=<jwt>`

Common errors: `400`, `401`, `500`.

---

### Profile Endpoints (Bearer required)

#### `GET /profile` (also accepts `GET /auth`)

Load current user profile.

Success `200`:

```json
{
  "message": "ok",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://...",
    "is_active": true,
    "role": "user"
  }
}
```

#### `PUT /profile`

Update name/email.

Body:

```json
{
  "name": "New Name",
  "email": "new@example.com"
}
```

Common errors: `400`, `401`, `404`, `409`, `500`.

#### `PUT /profile/password`

Update password.

Body:

```json
{
  "currentPassword": "oldSecret",
  "newPassword": "newSecret"
}
```

Common errors: `400`, `401`, `404`, `500`.

#### `POST /profile/avatar`

Upload avatar image (multipart).

Form-data:

- `avatar`: file

Success `200` returns updated user and avatar URL.

Common errors: `400`, `401`, `404`, `500`.

---

### Recipes Endpoints (Bearer required)

#### `GET /recipes` (also accepts `GET /RecipeListView`)

List recipes for grid/list view.

Success `200`:

```json
{
  "count": 2,
  "recipes": [
    {
      "recipe_name": "Avocado Toast",
      "ingridient_name": "avocado, bread, olive oil",
      "ingredients_names": ["avocado", "bread", "olive oil"],
      "diet": "vegan",
      "cost": 12,
      "portions": 2,
      "liked": 10,
      "viewed": 120
    }
  ]
}
```

#### `POST /recipes` (also accepts `POST /RecipeListView`)

Submit a recipe into `pending_recipes`.

Body (minimum):

```json
{
  "name": "My Recipe"
}
```

Optional fields: `diet`, `instructions`, `url`, `cost`, `portions`, `prep_time`, `cooking_time`.

Success `201`: created pending recipe row.

#### `GET /recipes/:name` (also accepts `GET /RecipeView/:name`)

Fetch one recipe by exact name.

Success `200` fields include: `name`, `ingridients`, `instructions`, `prep_time`, `cook_time`, `portions`, `diet`, `cost`, `liked`, `viewed`.

Common errors: `404`, `500`.

#### `PUT /recipes/:id` (also accepts `PUT /RecipeView/:id`)

Update one pending recipe owned by current user.

Body: any subset of

- `name`, `diet`, `instructions`, `url`, `cost`, `portions`, `prep_time`, `cooking_time`

Common errors: `400`, `403`, `404`, `500`.

#### `DELETE /recipes/:id` (also accepts `DELETE /RecipeView/:id`)

Delete one recipe (ownership required).

Success `204` with empty response.

Common errors: `403`, `404`.

---

### Quick cURL Examples

```bash
# login
curl -k -X POST https://localhost:3443/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# list recipes
curl -k https://localhost:3443/recipes \
  -H "Authorization: Bearer <jwt_token>"
```
