# Tea Shop — Fullstack Project

A full-stack e-commerce demo website built with **Node.js**, **Express**, **Prisma (SQLite)**, and **React (Vite)**.

---

## Features

- **Backend (Express + Prisma)** — REST API, JWT authentication, SQLite database  
- **Frontend (React + Vite)** — Single Page Application using React Router and Bootstrap  
- **Authentication** — Role-based access (User / Admin)  
- **E-commerce Core** — Products, Categories, Cart, Orders  
- **Exchange Rate** — Live EUR/RON conversion via Frankfurter API  

---

## Installation Guide

### 1. Clone the repository
git clone https://github.com/AlexFLR/tea_shop
cd tea_shop

### 2. Install dependencies
# Root (to install concurrently for both apps)
npm install

# Backend (Express + Prisma)
cd server
npm install

# Frontend (React + Vite)
cd client
npm install

### 3. Initialize the Prisma database
The Prisma schema and seed files are located in the `server/prisma/` folder.  
To generate the client, create the SQLite database, and populate it with sample data, run the following commands from the `server` directory:

npm run prisma:generate
npm run prisma:migrate
npm run seed

---

## Running the Project
The root `package.json` includes a script to start both the backend and frontend simultaneously.  
Run the following commands from the project root:

cd ..
npm run dev

---

## Access the Application
- Frontend: http://localhost:5173  
- Backend API: http://localhost:4000  

Example API endpoints:
- `/api/products` — Get all products  
- `/api/categories` — Get all categories  
- `/api/auth/register` — Register a new user  
- `/api/auth/login` — Login  

---

## Troubleshooting
**Prisma Client not initialized**
cd server
npm run prisma:generate

**Port conflicts**
- Change backend port in `.env` (default: 4000)  
- Change frontend port in `vite.config.js` (default: 5173)
