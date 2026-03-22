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

- Auth: http://localhost:3000
- Recipes: http://localhost:3001