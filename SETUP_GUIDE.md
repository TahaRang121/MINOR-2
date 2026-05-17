# Crisis AI Platform - Complete Setup Guide

## 🎯 Overview

This guide walks you through setting up and running the **Crisis AI Premium Intelligence Platform** - a full-stack application with React frontend and Python/FastAPI backend.

## 📋 Prerequisites

- **Node.js**: v18+ (npm v9+)
- **Python**: 3.11+
- **Backend**: Running at `http://localhost:8000`

---

## 🔧 Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Key Dependencies**:
- FastAPI
- Uvicorn
- Pydantic
- Supabase
- APScheduler

### 2. Configure Backend

Create `.env` file in `backend/`:
```env
DATABASE_URL=your_supabase_url
API_KEY=your_api_key
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_key
```

### 3. Initialize Database

```bash
# Load Supabase schema
psql -h your-host -U your-user -d your-db -f supabase.sql
```

### 4. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: `http://localhost:8000`

**Health check**:
```bash
curl http://localhost:8000/api/health
```

---

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Installation takes ~2-3 minutes depending on your connection**

### 2. Configure Frontend

Create `.env.local` file in `frontend/`:
```env
VITE_API_URL=http://localhost:8000/api
```

(Optional - defaults to localhost:8000)

### 3. Start Development Server

```bash
cd frontend
npm run dev
```

**Frontend will be available at**: `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 🚀 Running Both Services

### Terminal 1 - Backend
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Application will be ready at**: `http://localhost:5173`

---

## ✅ Verification Checklist

### Backend Verification
- [ ] Backend server running at `http://localhost:8000`
- [ ] API health check passes: `GET http://localhost:8000/api/health`
- [ ] Database connection successful
- [ ] No console errors

### Frontend Verification
- [ ] Frontend dev server running at `http://localhost:5173`
- [ ] Landing page loads without errors
- [ ] Navbar renders correctly
- [ ] No console errors or warnings

### API Integration
- [ ] Login/Signup redirects work
- [ ] Dashboard loads events from `/api/events`
- [ ] Search returns results from `/api/search`
- [ ] Chat sends message to `/api/chat`
- [ ] Predictions display with confidence scores

### Features Testing

#### Landing Page
- [ ] Hero section animates on load
- [ ] Feature cards have hover effects
- [ ] Stats count up
- [ ] CTA buttons work

#### Authentication
- [ ] Login form validates email
- [ ] Password show/hide toggle works
- [ ] Signup requires password match
- [ ] Error messages display correctly
- [ ] Successful login redirects to dashboard

#### Dashboard
- [ ] Stat cards show real data
- [ ] Recent events feed displays
- [ ] Quick actions buttons visible
- [ ] Sector trends grid shows data
- [ ] Loading states appear while fetching

#### Event Detail
- [ ] Click event opens detail page
- [ ] Event info displays correctly
- [ ] Predictions show confidence
- [ ] Back button returns to previous page

#### Search
- [ ] Search input works
- [ ] Results display in grid
- [ ] Loading state shows while searching
- [ ] Empty state when no results

#### Chat
- [ ] Message appears immediately
- [ ] API response appears below
- [ ] Auto-scrolls to newest message
- [ ] Source attribution displays

#### History
- [ ] Predictions list displays
- [ ] Filter by direction works
- [ ] Search by sector works
- [ ] Pagination loads more

---

## 🐛 Troubleshooting

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API Connection Fails
- Verify backend is running: `curl http://localhost:8000/api/health`
- Check `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors
- Verify Vite proxy in `vite.config.js`

### Build Errors
```bash
# Clear build cache
rm -rf dist
npm run build
```

### Port Already in Use
```bash
# Frontend on different port
npm run dev -- --port 5174

# Backend on different port
uvicorn app.main:app --port 8001
```

### Module Not Found Errors
```bash
# Reinstall specific package
npm install package-name

# Check imports match file structure
# Use exact paths: ./components/ui, ./stores/store
```

---

## 📊 API Endpoints Reference

### Events
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events/fetch` - Fetch new events

### Predictions
- `GET /api/predictions` - List predictions
- `GET /api/predictions/summary` - Get summary

### Search
- `GET /api/search?q=query` - Search events

### Chat
- `POST /api/chat` - Send message to AI

### Health
- `GET /api/health` - Server health check

---

## 🎨 UI Component Reference

All reusable components are in `src/components/ui/index.jsx`:

```jsx
import { Button, Card, Badge, Input, Loading } from '@/components/ui'

// Button
<Button variant="primary">Click me</Button>
<Button variant="secondary" size="lg">Large button</Button>

// Card
<Card>Content</Card>
<Card className="glass-sm">Glassmorphism card</Card>

// Badge
<Badge status="critical">Critical</Badge>
<Badge status="warning">Warning</Badge>

// Input
<Input placeholder="Search..." onChange={e => setQuery(e.target.value)} />

// Loading
<Loading size="lg" />

// Skeleton
<Skeleton width="w-full" height="h-12" />
```

---

## 🚀 Performance Tips

1. **Development**: Use `npm run dev` for fast HMR
2. **Production**: Use `npm run build` and serve `dist/` folder
3. **Images**: Optimize before using
4. **Animations**: GPU-accelerated (no performance impact)
5. **Lazy Loading**: Use React Router's lazy loading (expandable)

---

## 📱 Responsive Testing

### Mobile (375px)
```bash
# Chrome DevTools: iPhone 12/13/14
```

### Tablet (768px)
```bash
# Chrome DevTools: iPad
```

### Desktop (1440px+)
```bash
# Full width
```

---

## 🔐 Security Notes

- Tokens stored in localStorage (for now)
- Bearer auth header on all API requests
- CORS configured on backend
- Input validation on forms
- Consider: HttpOnly cookies for token storage

---

## 📦 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub and connect Vercel
npm run build  # Test locally first
# Set VITE_API_URL environment variable in Vercel dashboard
```

### Backend (Railway/Render)
- Set environment variables
- Use production database
- Set allowed origins for CORS

---

## 🎯 Next Steps

1. ✅ Start backend server
2. ✅ Start frontend dev server
3. ✅ Open `http://localhost:5173`
4. ✅ Test login/signup
5. ✅ Navigate through pages
6. ✅ Verify API integration
7. ✅ Report any issues

---

## 💡 Tips & Tricks

- **Debug Mode**: Check browser console (F12) for errors
- **API Requests**: Monitor Network tab for API calls
- **Hot Reload**: Changes auto-refresh (try editing `src/pages/Dashboard.jsx`)
- **Animations**: Edit `src/utils/animations.js` for timing adjustments
- **Styling**: Edit `tailwind.config.js` for custom colors/animations

---

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Verify both backend and frontend are running
3. Check console for error messages
4. Review API response in Network tab

---

**Ready to revolutionize crisis intelligence? Let's go! 🚀**
