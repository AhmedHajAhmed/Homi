# 🚀 Quick Start Guide - Homi

Get Homi running locally in 5 minutes!

## Prerequisites Check

Ensure you have installed:
- ✅ Node.js 20+ (`node --version`)
- ✅ npm (`npm --version`)
- ✅ Docker Desktop (running)

## Installation Steps

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Environment

Copy the example env file:

```bash
cp .env.example .env
```

The default values are already configured for local development!

### 3️⃣ Start Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432.

### 4️⃣ Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Add sample data (RECOMMENDED for demo)
npx prisma db seed
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

🎉 Open [http://localhost:3000](http://localhost:3000)

## Sample Accounts

After seeding, login with these accounts:

### Student Account
- **Email**: `student@example.com`
- **Password**: `password123`

### Host Accounts
- **Email**: `host@example.com`
- **Password**: `password123`

OR

- **Email**: `host2@example.com`
- **Password**: `password123`

## Testing the App

### As a Student:
1. Login with student account
2. Browse listings at `/listings`
3. Click a listing to view details
4. Send a booking request
5. View your requests at `/bookings`
6. Chat with hosts at `/messages`

### As a Host:
1. Login with host account
2. Create a listing at `/listings/create`
3. View booking requests at `/bookings`
4. Accept/reject requests
5. Chat with students at `/messages`

## Useful Commands

```bash
# View database in GUI
npx prisma studio

# Stop database
docker-compose down

# Restart database
docker-compose restart

# Check database logs
docker-compose logs postgres

# Reset database (deletes all data!)
npx prisma migrate reset
```

## Project Structure Overview

```
src/
├── app/
│   ├── api/              # Backend API routes
│   ├── (auth)/           # Login/Signup pages
│   ├── dashboard/        # Main dashboard
│   ├── listings/         # Browse & create listings
│   ├── bookings/         # Manage bookings
│   ├── messages/         # Chat interface
│   └── profile/          # User profile
├── components/           # React components
├── lib/                  # Utilities & helpers
└── types/                # TypeScript types
```

## Common Issues

### Port 5432 already in use
```bash
# Stop other PostgreSQL instances
sudo lsof -i :5432
# Or change port in docker-compose.yml
```

### Prisma Client not found
```bash
npx prisma generate
```

### Database migration error
```bash
# Reset database
npx prisma migrate reset
```

### Can't connect to database
```bash
# Check if Docker is running
docker ps

# Check database logs
docker-compose logs postgres
```

## Next Steps

- ✅ Explore the codebase
- ✅ Customize the UI in `src/app/globals.css`
- ✅ Add more features
- ✅ Deploy to production (see `DEPLOYMENT.md`)

## Demo Flow

Perfect 2-minute demo for hackathon judges:

1. **Home Page** → Show landing page
2. **Sign Up** → Create a host account
3. **Create Listing** → Add a sample listing
4. **Browse** → View all listings
5. **Booking** → Login as student, book the listing
6. **Host Dashboard** → Show pending request
7. **Accept Booking** → Accept the request
8. **Messages** → Send messages between student and host

## Documentation

- 📖 Full README: `README.md`
- 🚀 Deployment Guide: `DEPLOYMENT.md`
- 📋 Architecture Plan: `plan.md`

## Support

Having issues? Check:
1. Docker is running
2. Port 5432 is available
3. Node.js version is 20+
4. Environment variables are set correctly

---

**Happy Hacking! 🎉**

