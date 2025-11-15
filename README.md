# Homi - Student Housing Platform

Homi is a full-stack MVP platform connecting college students with host families during school breaks. Built for hackathons with modern web technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: JWT with httpOnly cookies
- **Deployment**: Vercel (app) + Railway/Supabase (database)

## ✨ Features

- 🔐 **Authentication**: Secure email/password authentication with JWT
- 👥 **User Roles**: Separate experiences for Students and Hosts
- 🏠 **Listings**: Create, browse, and view detailed accommodation listings
- 📅 **Bookings**: Request-based booking system with status management
- 💬 **Messaging**: Real-time messaging with polling (no WebSocket complexity)
- 📊 **Dashboards**: Role-specific dashboards with statistics
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## 🏗️ Project Structure

```
/Homi
├── docker-compose.yml           # PostgreSQL container for local dev
├── Dockerfile                   # Production build configuration
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Sample data seeder
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/                # API routes
│   │   ├── (auth)/             # Auth pages (login/signup)
│   │   ├── dashboard/          # User dashboard
│   │   ├── listings/           # Listings pages
│   │   ├── bookings/           # Bookings page
│   │   ├── messages/           # Messaging page
│   │   └── profile/            # User profile
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── ...                 # Custom components
│   ├── lib/                    # Utility functions
│   │   ├── prisma.ts           # Prisma client
│   │   ├── auth.ts             # JWT helpers
│   │   └── utils.ts            # Utilities
│   └── types/                  # TypeScript types
└── public/                     # Static assets
```

## 🛠️ Local Development Setup

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for local database)
- Git

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd Homi
npm install
```

### Step 2: Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/homi"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database on `localhost:5432`.

### Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (optional but recommended)
npx prisma db seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Sample Accounts (from seed data)

After seeding, you can login with:

- **Student**: `student@example.com` / `password123`
- **Host 1**: `host@example.com` / `password123`
- **Host 2**: `host2@example.com` / `password123`

## 📦 Database Schema

### Models

- **User**: Authentication and profile information
  - Roles: `STUDENT` or `HOST`
  
- **Listing**: Accommodation listings created by hosts
  - Includes photos, amenities, pricing, availability
  
- **Booking**: Booking requests from students
  - Status: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`
  
- **Message**: Messages between students and hosts
  - Tied to specific bookings

### Viewing Database

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio
```

## 🚀 Deployment

### Deploy to Vercel + Railway

#### 1. Deploy Database (Railway)

1. Go to [Railway.app](https://railway.app/) and create a new project
2. Add a PostgreSQL database
3. Copy the `DATABASE_URL` from the database settings

#### 2. Deploy Application (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and import your repository
3. Add environment variables:
   - `DATABASE_URL`: Your Railway PostgreSQL URL
   - `JWT_SECRET`: Generate a secure random string
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL

4. Deploy!

#### 3. Initialize Production Database

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Run migration in production
vercel env pull .env.production.local
npx prisma migrate deploy
```

### Alternative: Supabase Database

1. Create a PostgreSQL database at [Supabase](https://supabase.com/)
2. Get the connection string (in "Database Settings")
3. Use this as your `DATABASE_URL` in Vercel

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed

# Generate Prisma Client
npx prisma generate

# Format code
npm run lint
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create listing (host only)
- `GET /api/listings/[id]` - Get single listing
- `PATCH /api/listings/[id]` - Update listing (owner only)
- `DELETE /api/listings/[id]` - Delete listing (owner only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking request (student only)
- `PATCH /api/bookings/[id]` - Update booking status

### Messages
- `GET /api/messages?bookingId=xxx` - Get messages for booking
- `POST /api/messages` - Send message
- `GET /api/messages/unread-count` - Get unread count

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/):
- Button, Card, Input, Label, Textarea
- Badge, Avatar, Dropdown Menu
- Fully customizable with Tailwind CSS

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication with httpOnly cookies
- CORS protection
- SQL injection prevention (Prisma)
- XSS protection (Next.js defaults)

## 📱 Features by Role

### Students
- Browse available listings
- Send booking requests
- Message hosts
- View booking status
- Cancel requests

### Hosts
- Create and manage listings
- Receive booking requests
- Accept/reject bookings
- Message students
- View dashboard statistics

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose restart

# Check logs
docker-compose logs postgres
```

### Prisma Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is open source and available for hackathons and educational purposes.

## 🤝 Contributing

This is a hackathon MVP. Feel free to fork and extend!

## 📞 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for hackathons**

