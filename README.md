# Rent2Go BuyCarz - Separated Monorepo Architecture

This project has been fully reorganized into a clean, separated frontend and backend architecture. It allows both projects to be run, tested, and deployed independently in modern cloud hosting environments (e.g., Vercel for the frontend, Railway for the backend).

---

## 📂 Repository Structure

The root workspace contains only clean directories and configuration files:

```bash
├── frontend/               # React (Vite/Tailwind) Frontend Application
│   ├── src/                # Shared source files
│   ├── .gitignore          # Frontend-specific Git ignore rules
│   ├── index.html          # Index template
│   ├── jsconfig.json       # Aliases mapping
│   ├── package.json        # Frontend independent dependencies
│   └── vite.config.js      # Frontend localized Vite configuration
│
├── backend/                # Express (Node/Mongoose) API Server
│   ├── src/                # Server models, routes, middlewares & controllers
│   ├── database/           # Simulated/seeded cloud database components
│   ├── .env                # Local environmental secrets
│   ├── .gitignore          # Backend-specific Git ignore rules
│   └── package.json        # Server independent dependencies
│
├── .gitignore              # Monorepo level ignoring rules
├── .env.example            # Root helper tracking variable contracts
├── README.md               # Architecture documentation (This file)
└── package.json            # Orchestrator scripts for dev studio compilation
```

---

## 💻 Running Locally

### 1. Unified Dev Stack (AI Studio Dev Mode)

To start both servers in the unified development workspace seamlessly:

```bash
# Starts Express and Vite middleware on Port 3000
npm run dev
```

### 2. Standalone Frontend

To run the frontend client independently:

```bash
cd frontend
npm install
npm run dev
```

To build production static assets:

```bash
npm run build
```

### 3. Standalone Backend

To run the API backend server independently:

```bash
cd backend
npm install
npm start
```

---

## 🚀 Deployment Guildlines

### 🖥️ Frontend (e.g., Vercel / Netlify)

1. Connect your Github Repository to **Vercel**.
2. Select **`frontend`** as the Root Directory in Vercel settings.
3. Use the following build settings:
   * **Build Command**: `vite build` or `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
4. Set required React environmental variables in Vercel.

### ⚙️ Backend (e.g., Railway / Render / Heroku)

1. Connect your Github Repository to **Railway**.
2. Set the Root Directory to **`backend`** (or let Railway auto-detect your subproject).
3. Railway will execute `npm start` automatically based on the `backend/package.json` scripts.
4. Set all server-side environmental variables (e.g., `MONGO_URI`, `PORT=3000`, etc.) under Railway variables panel.
