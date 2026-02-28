# Stockify - Professional Inventory Management System

Stockify is a professional inventory management application designed for speed and reliability. Built with the MERN stack (MongoDB, Express, React, Node.js), it includes real-time analytics, automated reporting, and a responsive interface.

## Live Deployment
- **Frontend URL:** [https://stockify-one.vercel.app](https://stockify-one.vercel.app)
- **Backend API URL:** [https://stockify-liqj.onrender.com](https://stockify-liqj.onrender.com)

## Core Functionality
- **Inventory Management:** Centralized tracking of stock levels, SKU codes, and low-stock indicators.
- **Sales Operations:** Point of Sale (POS) interface for recording real-time transactions.
- **Advanced Reporting:** Generation of sales summaries, inventory status, and customer ledgers.
- **Data Export:** Support for downloading reports in PDF and Excel formats.
- **Email Integration:** Secure delivery of reports to stakeholders via SMTP.
- **Responsive Design:** Optimized user interface for desktop, tablet, and mobile browsers.

## Technical Architecture
- **Frontend:** React 19, Vite, Tailwind CSS, Shadcn/UI, Framer Motion.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** MongoDB Atlas (Mongoose ODM).
- **State Management:** Zustand.
- **Security:** JWT Authentication, Environment variable protection.

---

## Local Development Setup

Follow these instructions to set up the project on a local environment.

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn package manager
- Access to a MongoDB database (Local or Atlas)

### 1. Project Initialization
```bash
git clone https://github.com/nithindas-k/Stockify-.git
cd Stockify-
```

### 2. Digital Server Configuration (Backend)
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder with the following keys:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```
Execute the backend server:
```bash
npm run dev
```

### 3. Client Application Configuration (Frontend)
Open a new terminal session from the project root:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
Execute the client application:
```bash
npm run dev
```

The application will be accessible at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## Deployment Strategy

### Backend (Render)
- **Root Directory:** backend
- **Build Command:** npm install && npm run build
- **Start Command:** npm start

### Frontend (Vercel)
- **Root Directory:** frontend
- **Framework Preset:** Vite
- **Build Command:** npm run build
- **Output Directory:** dist
- **Environment Variable:** VITE_API_URL pointing to the production backend API.

---

## License
Distributed under the MIT License.
