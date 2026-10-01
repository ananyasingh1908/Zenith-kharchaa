# Kharcha

A mindful personal expense tracker and life-cost intelligence application built with React, Vite, and Tailwind CSS.

## Setup Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Environment Variable

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the REST API backend. If omitted, Kharcha operates in standalone mode using a realistic local mock data store. | `""` (Standalone mode) |

## API Contract

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticate user with email and password |
| `POST` | `/auth/signup` | Register a new user |
| `GET` | `/me` | Retrieve the authenticated user session |
| `GET` | `/expenses?month=YYYY-MM&category=&q=&sort=` | Query expenses by month, category, keyword, and sort order |
| `POST` | `/expenses` | Create a new expense record |
| `PUT` | `/expenses/:id` | Update an existing expense record |
| `DELETE` | `/expenses/:id` | Delete an expense record |
| `GET` | `/summary?month=YYYY-MM` | Fetch month-level financial velocity, spike detection, and story summaries |
| `GET` | `/budgets?month=YYYY-MM` | Fetch overall monthly envelope and category allocations |
| `PUT` | `/budgets` | Update monthly spending target and category allocations |
| `GET` | `/vault` | Retrieve all impulse cooldown items |
| `POST` | `/vault` | Park a prospective purchase in the mindful vault |
| `POST` | `/vault/:id/buy` | Convert a vault item into an expense and mark it bought |
| `POST` | `/vault/:id/release` | Dismiss a vault item and credit amount to "Saved by patience" |
| `GET` | `/settings` | Retrieve user preferences and currency rates |
| `PUT` | `/settings` | Update base currency, USD-INR exchange rate, and wage settings |
| `POST` | `/import` | Upload bank statement file (CSV / PDF) for server-side parsing |
