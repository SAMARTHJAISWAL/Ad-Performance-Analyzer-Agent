# Frontend

React 19 + React Router single-page app, built with [Vite](https://vite.dev/).
See the repository's top-level README for the full setup.

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env   # optional: set VITE_API_URL (default http://localhost:5005)
npm run dev            # dev server on http://localhost:3000 (npm start is an alias)
npm test               # Vitest + Testing Library (jsdom)
npm run build          # production build into build/
npm run preview        # serve the production build locally
```

Environment variables must start with `VITE_` to be exposed to the app; read them with
`import.meta.env.VITE_*`. `VITE_API_URL` replaces the old Create React App `REACT_APP_API_URL`.
