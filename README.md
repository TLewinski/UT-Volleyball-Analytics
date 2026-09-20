# UT Volleyball Analytics

Full-stack stats platform for the University of Toledo men's club volleyball team, built with React, Node.js, Express, MySQL, and Tailwind CSS.

## Features
- **Team dashboard** — season record, team hitting %, and total kills, aces, and blocks
- **Hitting percentage** — (kills − errors) / attempts, per player, per match, and for the team
- **Sortable player table** — click any column to sort
- **Player pages** — season totals, a kills-per-match trend chart, and a match-by-match table
- **Match results** — every match with its win/loss result
- **Data entry** — forms to add new matches and player stat lines (with validation)
- **REST API** connected to a MySQL database

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios
- **Backend:** Node.js, Express
- **Database:** MySQL

## Project Structure
```
api/        Express REST API
frontend/   React app
database/   schema.sql (tables), seed.sql (season data), migrate.sql
```

## Run Locally

### 1. Database
Make sure MySQL is running, then load the tables and data:
```
mysql -u root -p -e "source database/schema.sql"
mysql -u root -p -e "source database/seed.sql"
```

### 2. Backend
```
cd api
npm install
cp .env.example .env    # then fill in your MySQL password
npm start
```
Runs on http://localhost:5000

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/players` | All players |
| GET | `/players/totals` | Season totals + hitting % for each player |
| GET | `/players/:id` | One player's stats for every match |
| GET | `/stats` | Every stat line with player and match info |
| GET | `/stats/summary` | Team totals + team hitting % |
| POST | `/stats` | Add a player's stat line for a match |
| GET | `/matches` | All matches with results |
| GET | `/matches/record` | Team win/loss record |
| POST | `/matches` | Add a match |

## Author
Tyler Lewinski
