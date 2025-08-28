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


## Dot ENV File
Create a `.env` file and include:

```
DB_URL=postgresql://postgres.sgwujlfmrpnkxayhhcxu:quizards@aws-1-eu-west-2.pooler.supabase.com:6543/postgres
PORT=3000
BCRYPT_SALT_ROUNDS=10
SECRET_TOKEN=1513A942C9C1B04F8E31080D4E5657FD9E7D05D468712953DD8248C5FAB04450
EMAIL_USER=quizardsapp@gmail.com
EMAIL_PASS=wxiw rtyq myzd lrvn
```
