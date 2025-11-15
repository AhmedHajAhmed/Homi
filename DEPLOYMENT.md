# Deployment Guide for Homi

This guide covers deploying Homi to production using Vercel (for the application) and Railway or Supabase (for the database).

## Option 1: Vercel + Railway (Recommended)

### Step 1: Setup Railway Database

1. Go to [railway.app](https://railway.app/) and sign up/login
2. Create a new project
3. Click "New" → "Database" → "PostgreSQL"
4. Once created, go to the PostgreSQL service
5. Click on "Connect" tab and copy the `DATABASE_URL`
   - Format: `postgresql://user:password@host:port/database`

### Step 2: Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com/) and sign up/login

3. Click "Add New" → "Project"

4. Import your GitHub repository

5. Configure the project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. Add Environment Variables:
   ```
   DATABASE_URL=<your-railway-database-url>
   JWT_SECRET=<generate-a-secure-random-string>
   NEXT_PUBLIC_APP_URL=<will-be-provided-after-first-deploy>
   ```

7. Click "Deploy"

### Step 3: Update App URL

After first deployment:
1. Copy your Vercel deployment URL (e.g., `https://homi.vercel.app`)
2. Go to Vercel project settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your Vercel URL
4. Redeploy

### Step 4: Initialize Database

Install Vercel CLI:
```bash
npm i -g vercel
```

Pull environment variables:
```bash
vercel env pull .env.production.local
```

Run migrations:
```bash
npx prisma migrate deploy
```

Optionally seed the database:
```bash
npx prisma db seed
```

## Option 2: Vercel + Supabase

### Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com/) and create an account
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

### Step 2: Deploy to Vercel

Follow the same steps as Option 1, but use your Supabase connection string as the `DATABASE_URL`.

### Step 3: Initialize Database

Same as Option 1, Step 4.

## Option 3: Deploy with Docker

### Build Docker Image

```bash
docker build -t homi .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-secret" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  homi
```

### Docker Compose (Full Stack)

The included `docker-compose.yml` is for local development only. For production, you'll need to:

1. Remove the development-only configurations
2. Add proper volume mounts
3. Configure networking
4. Set up reverse proxy (nginx)

## Post-Deployment Checklist

### 1. Database Migrations

Ensure migrations are run in production:
```bash
npx prisma migrate deploy
```

### 2. Verify Environment Variables

Check all required env vars are set:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`

### 3. Test Core Features

- [ ] User registration and login
- [ ] Creating a listing (as host)
- [ ] Browsing listings
- [ ] Booking requests (as student)
- [ ] Messaging system
- [ ] Dashboard loads correctly

### 4. Security Checks

- [ ] JWT_SECRET is a strong, random string
- [ ] DATABASE_URL is not exposed in client-side code
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] CORS is properly configured

### 5. Performance Optimization

Vercel automatically handles:
- ✅ CDN for static assets
- ✅ Image optimization
- ✅ Edge caching
- ✅ Serverless functions

## Monitoring & Logs

### Vercel Logs

View deployment and runtime logs:
1. Go to your Vercel project dashboard
2. Click "Deployments"
3. Select a deployment
4. View "Building" and "Functions" logs

### Railway Logs

View database logs:
1. Go to your Railway project
2. Click on PostgreSQL service
3. Click "Deployments" tab
4. View logs

## Troubleshooting

### Build Failures

**Error: Prisma Client not generated**
```bash
# Make sure build command includes prisma generate
"build": "prisma generate && next build"
```

**Error: Cannot find module '@prisma/client'**
- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`

### Database Connection Issues

**Error: Can't reach database server**
- Check `DATABASE_URL` format
- Verify Railway/Supabase database is running
- Check if IP whitelist is configured (Supabase requires this)

**Error: SSL required**
Add `?sslmode=require` to your DATABASE_URL:
```
postgresql://user:pass@host:port/db?sslmode=require
```

### Authentication Issues

**Error: JWT verification failed**
- Ensure `JWT_SECRET` is the same across all deployments
- Don't change `JWT_SECRET` in production (users will be logged out)

### Image Loading Issues

Images from external sources (Unsplash, etc.) require domain configuration:

In `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

## Scaling Considerations

### Database

**Railway Free Tier**:
- 500 MB storage
- Shared CPU
- Suitable for MVP/Demo

**Upgrade when**:
- More than 100 concurrent users
- Database size > 400 MB
- Need backups and monitoring

### Application

Vercel automatically scales based on traffic. No configuration needed.

### Caching

For production with high traffic, consider:
- Adding Redis for session storage
- Implementing API response caching
- Using SWR for client-side caching

## Environment-Specific Configurations

### Development
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/homi"
JWT_SECRET="dev-secret-not-for-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production
```env
DATABASE_URL="postgresql://user:pass@railway.app:5432/railway"
JWT_SECRET="<64-char-random-string>"
NEXT_PUBLIC_APP_URL="https://homi.vercel.app"
```

## Backup Strategy

### Railway
- Automatic daily backups (paid plans)
- Manual backup: Use Railway CLI or pg_dump

### Supabase
- Point-in-time recovery (paid plans)
- Manual backup via Supabase dashboard

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import backup
psql $DATABASE_URL < backup.sql
```

## Custom Domain (Optional)

### Vercel
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### SSL Certificate
- Automatically provisioned by Vercel
- Renews automatically

## Cost Estimates

### Free Tier (Perfect for MVP/Demo)
- Vercel: Free (Hobby plan)
- Railway: Free trial → $5-10/month
- Supabase: Free (includes 500 MB storage)
- **Total**: $0-10/month

### Recommended Production
- Vercel Pro: $20/month
- Railway Pro: $20/month or Supabase Pro: $25/month
- **Total**: $40-45/month

## Support & Issues

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Check Railway/Supabase database status
3. Verify all environment variables
4. Test database connection with Prisma Studio
5. Open an issue on GitHub with error logs

---

**Happy Deploying! 🚀**

