# salon

# SalonPro 💇‍♀️

A full-stack Salon Appointment Booking Application that allows customers to explore salon services, book appointments, and manage their bookings online.

## 🚀 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- Python Flask
- SQLAlchemy
- REST API

### Database
- PostgreSQL

### Authentication and Payments
- JWT Authentication
- Razorpay (Test Mode)

## ✨ Features

- Customer registration and login
- Role-based access for customers and service providers
- Browse salon services
- Search and filter services
- Book and manage appointments
- Service management for providers
- PostgreSQL database integration
- Online payment integration using Razorpay test mode
- Responsive user interface

## 📁 Project Structure

```text
salonpro/
├── backend/
│   ├── app/
│   ├── migrations/
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:
- Python and pip
- Node.js and npm
- PostgreSQL

## 🛠️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nidubrolupavan25-wq/salon.git
cd salon
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a PostgreSQL database and configure the required environment variables in your local `.env` file. Use the variable names expected by the application.

Start the backend using the project's configured entry point. If `run.py` is the entry point, run:

```bash
python run.py
```

Backend port: 5000 (if configured as shown in the project).

### 3. Frontend Setup

Open a new terminal from the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal by Vite. The default development port is usually 5173.

## 🔐 Environment Configuration

- Configure the database connection string and other required settings in a local `.env` file.
- Configure JWT and Razorpay test credentials if required by the application.
- Never commit passwords, secret keys, or private credentials to GitHub.
- Ensure `.env` files and virtual environment folders are excluded through `.gitignore`.

## 💳 Payment Integration

Razorpay is configured for test-mode payment workflows. Production payments require valid production credentials and appropriate configuration.

## 👨‍💻 Author

Pavan Kumar
