# Conntour Space Explorer – Home Assignment

**Backend: Node.js + Express**, **Frontend: React + Vite + TypeScript**.

## Run

### Backend (Node + Express)
```bash
cd backend
npm i
npm run dev
# API: http://localhost:8000
```

### Frontend (Vite + React + TS)
```bash
cd ../frontend
npm i
npm run dev
# http://localhost:5173
```

## Endpoints
- GET `/sources?page=1&page_size=24`
- GET `/search?q=query&page=1&page_size=24&persist=true`
- GET `/history?page=1&page_size=20`
- DELETE `/history/:id`
- GET `/health`
