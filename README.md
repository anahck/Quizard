# Quizard
"Making learning fun again for non-STEM subjects"

An educational quiz platform built for the Hive group of schools to boost engagement in non-STEM subjects through gamified learning.

# Features
User authentication (signup/login with JWT)
Student dashboard with profile + points tracking
Quizzes with instant scoring
Score history to review past attempts
PostgreSQL database for persistent storage
Deployed full-stack app (Frontend + Backend + Database)

# Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js + Express
Database: PostgreSQL
Auth: JWT + bcrypt
Testing: Jest + Supertest

# 1. Clone the repository
git clone https://github.com/anahck/Quizard.git
cd Quizard

# 2. Install dependencies
npm install


## Environment Setup
Create a `.env` file in the root directory with the following variables:
DB_URL=your_postgresql_connection_string
PORT=3000
BCRYPT_SALT_ROUNDS=10
SECRET_TOKEN=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# 4. Setup the Database
npm run setup-db

# 5. Run Locally
Backend:
npm run dev

Frontend:
Simply open index.html in your browser or use Live Server.

