# Crisis AI Platform - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the **Crisis AI Platform** to production using modern cloud services.

## 📊 Architecture Options

```
Option 1: Vercel (Frontend) + Railway (Backend)
├── Frontend: Vercel (worldwide CDN)
└── Backend: Railway (Docker container)

Option 2: Vercel (Frontend) + Render (Backend)
├── Frontend: Vercel
└── Backend: Render (managed Python)

Option 3: AWS (Full Stack)
├── Frontend: CloudFront + S3
├── Backend: EC2 or Lambda
└── Database: RDS (PostgreSQL)

Option 4: Self-Hosted
├── Frontend: Nginx/Apache
├── Backend: Gunicorn + Supervisor
└── Database: Self-managed PostgreSQL
```

---

## 🌐 Frontend Deployment - Vercel

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with code
- Environment variables

### Step 1: Prepare for Deployment

```bash
cd frontend

# Build locally first
npm run build

# Test production build
npm run preview

# Check for errors
npm run build 2>&1 | grep -i error
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 3: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Click "Import"

### Step 4: Configure Build Settings

**Recommended Settings**:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 5: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL = https://your-backend-domain.com/api
```

### Step 6: Deploy

Click "Deploy" button and wait for build completion.

**Result**: Frontend live at `your-project.vercel.app`

### Continuous Deployment

After initial deployment:
- Every push to `main` triggers auto-deploy
- Preview deployments for pull requests
- Rollback to previous versions available

---

## 🔙 Backend Deployment - Railway

### Prerequisites
- Railway account (free tier: $5/month)
- GitHub repository
- Environment variables

### Step 1: Prepare Backend

```bash
cd backend

# Create requirements.txt (should exist)
pip freeze > requirements.txt

# Create runtime.txt for Python version
echo "python-3.11.0" > runtime.txt

# Create Procfile (for web server)
echo "web: uvicorn app.main:app --host 0.0.0.0 --port 8000" > Procfile
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect GitHub and select repository
5. Select `backend` directory (if in monorepo)

### Step 3: Configure Environment

Click "Add Variable" and set:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
API_KEY=your_key_here
NEWS_API_KEY=your_news_key
OPENAI_API_KEY=your_openai_key
PYTHONUNBUFFERED=1
```

### Step 4: Deploy

Railway auto-deploys from your GitHub repo.

**Monitor**:
- Deployments tab shows build status
- Logs show server output
- Click service for more details

**Result**: Backend live at `your-backend.railway.app`

### Configure CORS

Update backend `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:5173"  # Keep for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from "Database" → "Connection Pooling"
4. Upload schema: `backend/supabase.sql`

```sql
-- In Supabase SQL Editor
\i supabase.sql
```

### Option 2: Railway PostgreSQL

1. In Railway dashboard, click "New Service"
2. Select "PostgreSQL"
3. Get connection string
4. Run migrations:

```bash
psql "postgresql://user:pass@host:5432/dbname" -f backend/supabase.sql
```

### Option 3: AWS RDS

1. Create RDS instance (PostgreSQL)
2. Get endpoint
3. Set `DATABASE_URL` with connection string

---

## 🔗 Connect Frontend to Backend

### In Vercel Dashboard

**Environment Variables** → Add:
```
VITE_API_URL=https://your-backend-domain.com/api
```

**Rebuild** to apply changes.

### Verify Connection

```bash
# Test API health
curl https://your-backend-domain.com/api/health

# Check frontend logs in Vercel dashboard
```

---

## 🧪 Testing Production Build

### Local Production Test

```bash
# Frontend
cd frontend
npm run build
npm run preview
# Open http://localhost:4173

# Backend  
cd backend
# Set environment variables
export DATABASE_URL=your_production_db
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Production Checklist

- [ ] Frontend loads at production URL
- [ ] All pages accessible
- [ ] API calls successful
- [ ] Login/Signup works
- [ ] Events load correctly
- [ ] Search functional
- [ ] Chat responsive
- [ ] No console errors
- [ ] Images load fast
- [ ] Animations smooth

---

## 🔐 Security in Production

### HTTPS
✅ Automatic on Vercel and Railway

### API Keys
```bash
# Never commit keys, use environment variables
git add .gitignore  # Contains *.env
export OPENAI_API_KEY=sk-...
```

### CORS
- Only allow production frontend origin
- Don't use `allow_origins=["*"]` in production

### Database
- Use strong passwords
- Enable SSL connections
- Regular backups
- Don't expose database URL in frontend

### Rate Limiting (Optional)

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/events")
@limiter.limit("100/minute")
async def get_events(request: Request):
    # ...
```

---

## 📊 Monitoring & Logging

### Vercel Analytics
- Dashboard shows page performance
- Real user metrics
- Deployment history

### Railway Logs
- Real-time server logs
- Error tracking
- Database query logs

### Error Tracking (Optional)

Add Sentry:

```python
import sentry_sdk
sentry_sdk.init("https://your-sentry-url")

# Or in frontend
import * as Sentry from "@sentry/react"
Sentry.init({ dsn: "your-dsn" })
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Free)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Frontend
        run: cd frontend && npm install && npm run build
      
      - name: Deploy Frontend
        run: npm install -g vercel && vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      
      - name: Run Backend Tests
        run: cd backend && pip install -r requirements.txt && pytest
      
      - name: Deploy Backend
        uses: railway-app/deploy-action@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 🚨 Troubleshooting

### Frontend Won't Load
```
1. Check Vercel deployment logs
2. Verify environment variables set
3. Check VITE_API_URL points to correct backend
```

### API Errors
```
1. Check Railway logs
2. Verify DATABASE_URL set correctly
3. Check backend environment variables
```

### Database Connection Failed
```
1. Verify DATABASE_URL format
2. Check IP whitelist (if applicable)
3. Test connection string locally
```

### CORS Errors
```
1. Update backend CORS origins
2. Ensure HTTPS in frontend URL
3. Check backend deployment
```

---

## 📈 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm install -g npm-check-updates
npm run build -- --analyze  # If supported by vite
```

### Backend
```python
# Add caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
```

### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_events_severity ON events(severity);
CREATE INDEX idx_predictions_sector ON predictions(sector);
```

---

## 🎯 Deployment Timeline

| Phase | Timeline | Actions |
|-------|----------|---------|
| Dev | Week 1-2 | Build and test locally |
| Staging | Week 2-3 | Deploy to staging env |
| Beta | Week 3-4 | Limited production rollout |
| Production | Week 4+ | Full production launch |

---

## 📋 Pre-Launch Checklist

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance metrics acceptable
- [ ] Security audit completed
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Documentation updated
- [ ] Team trained
- [ ] Support plan ready

---

## 🚀 Launch Day Procedure

1. **Morning** (Before launch)
   - Final testing in production
   - Team standby
   - Monitoring set up

2. **Launch**
   - Announce to users
   - Monitor error rates
   - Watch database performance

3. **Post-Launch**
   - Gather feedback
   - Monitor for issues
   - Be ready to rollback if needed

---

## 📞 Support & Maintenance

### Weekly
- Review error logs
- Check performance metrics
- Update dependencies (security patches)

### Monthly
- Database maintenance
- Backup verification
- Security audit

### Quarterly
- Major dependency updates
- Performance optimization
- Architecture review

---

## 🎓 Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- FastAPI Production: https://fastapi.tiangolo.com/deployment/
- React Production: https://react.dev/learn/production-grade-tooling

---

**Congratulations! Your Crisis AI Platform is now live! 🎉**

For support, contact your DevOps team or refer to the main SETUP_GUIDE.md.
