# 🥗 Food Rescue Platform

A web app connecting food donors with shelters and volunteers to reduce food waste.

## 🚀 Features

- **Donors** can post surplus food listings with location and expiry time
- **Shelters** can claim available food based on their needs  
- **Volunteers** can accept delivery routes and mark deliveries complete
- **Live Map** showing all food listings with real coordinates
- **Auto-expiry** of unclaimed listings every 15 minutes
- **Platform Report** with real-time stats

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Maps | Leaflet.js + OpenStreetMap |
| Auth | JWT Tokens |
| Real-time | node-cron |

## 📁 Project Structure
food-rescue/          ← Backend

├── index.js

├── db.js

├── routes/

│   ├── auth.js

│   └── listings.js

└── middleware/

└── auth.js
food-rescue-frontend/  ← Frontend

├── src/

│   ├── App.js

│   ├── Map.js

│   ├── components/

│   │   ├── Btn.jsx

│   │   ├── Input.jsx

│   │   ├── Toast.jsx

│   │   └── styles.js

│   └── pages/

│       ├── LoginPage.jsx

│       ├── DonorDashboard.jsx

│       ├── ShelterDashboard.jsx

│       └── VolunteerDashboard.jsx

## ⚙️ Setup

### Backend
```bash
cd food-rescue
npm install
npm run dev
```

### Frontend
```bash
cd food-rescue-frontend
npm install
npm start
```

### Database
```sql
CREATE DATABASE foodrescue;
-- Run all ALTER TABLE commands from setup guide
```

### .env file
DB_USER=postgres

DB_PASSWORD=your_password

DB_HOST=localhost

DB_PORT=5432

DB_NAME=foodrescue

JWT_SECRET=your_secret_key

## 👥 User Roles

| Role | Kya kar sakta hai |
|---|---|
| 🍱 Donor | Food post karo, delete karo, status track karo |
| 🏠 Shelter | Available food claim karo |
| 🚗 Volunteer | Delivery pickup karo, delivered mark karo |