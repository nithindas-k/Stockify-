# Stockify - Professional Inventory Management System

Stockify is a modern, high-performance inventory management application designed for speed and reliability. Built with the MERN stack (MongoDB, Express, React, Node.js), it features a premium dark UI, real-time analytics, and professional-grade reporting.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://stockify-one.vercel.app](https://stockify-one.vercel.app)
- **Backend (Render):** [https://stockify-liqj.onrender.com](https://stockify-liqj.onrender.com)

## ✨ Key Features
- **Smart Inventory:** Track stock levels, SKU codes, and low-stock alerts.
- **Real-time Sales:** Record transactions with a professional Point of Sale (POS) interface.
- **Reporting Engine:** Generate Sales, Inventory, and Customer Ledger reports.
- **Export Options:** Download reports in PDF, Excel, or print directly.
- **Email System:** Securely email reports to stakeholders via SMTP.
- **Premium UI:** Fully responsive dark-mode interface with Framer Motion animations.

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS 4, Shadcn/UI, Lucide icons, Framer Motion.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** MongoDB (using Mongoose).
- **State Management:** Zustand.
- **Authentication:** JWT (JSON Web Tokens).

---

## 💻 Local Setup Instructions

Follow these steps to get the project running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (installed with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance.

### 1. Clone the Repository
```bash
git clone https://github.com/nithindas-k/Stockify-.git
cd Stockify-
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the root directory, then:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

The application should now be running at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 📦 Deployment

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Frontend (Vercel)
- **Root Directory:** `frontend`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Environment Variable:** `VITE_API_URL` set to your backend URL + `/api`

---

## 🔒 License
This project is licensed under the MIT License.
