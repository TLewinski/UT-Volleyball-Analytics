// UT Volleyball Analytics System

Full-stack volleyball stats tracking application built with React, Node.js, Express, MySQL, and Tailwind CSS.

// Features
- Player performance dashboard (kills, aces, blocks, digs)
- Team-wide season summary statistics
- Sortable player stats table
- Individual player detail pages using routing
- REST API connected to MySQL database

// Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MySQL
- API: RESTful architecture

// Project Structure
- volleyball-api → Backend (Express + MySQL)
- volleyball-frontend → Frontend (React UI)

// How to Run Locally

// Backend
cd volleyball-api
npm install
node server.js

Backend runs on:
http://localhost:5000

// Frontend
cd volleyball-api/volleyball-frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173 (or next available port)

// API Endpoints
- GET /players
- GET /stats/summary
- GET /players/totals

// Notes
- Make sure MySQL is running locally
- Environment variables are stored in `.env` (not included in repo)

// Author
Tyler Lewinski
