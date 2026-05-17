# Quick Reference - Crisis AI Platform

## 🚀 Quick Start (30 seconds)

```bash
# Terminal 1 - Backend
cd backend && uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Open browser
http://localhost:5173
```

## 📂 Key File Locations

| Purpose | Location |
|---------|----------|
| Main app config | `frontend/package.json` |
| Tailwind theme | `frontend/tailwind.config.js` |
| API client | `frontend/src/api/client.js` |
| State stores | `frontend/src/stores/store.js` |
| Animations | `frontend/src/utils/animations.js` |
| UI components | `frontend/src/components/ui/index.jsx` |
| Layout | `frontend/src/components/layout/` |
| Pages | `frontend/src/pages/` |
| Routes | `frontend/src/App.jsx` |
| Backend main | `backend/app/main.py` |
| Backend models | `backend/app/models.py` |
| Backend routes | `backend/app/routes/` |
| Database schema | `backend/supabase.sql` |

## 🎨 Common Tasks

### Add New Page
```jsx
// 1. Create src/pages/MyPage.jsx
export default function MyPage() {
  return <div>My Page</div>
}

// 2. Add to src/App.jsx routes
<Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

// 3. Add to navbar navigation (if needed)
```

### Add UI Component
```jsx
// Add to src/components/ui/index.jsx
export function MyComponent({ children, variant = 'primary' }) {
  return <div className={`my-component ${variant}`}>{children}</div>
}

// Then import and use
import { MyComponent } from '@/components/ui'
```

### Add API Call
```jsx
// In frontend/src/api/client.js
export const myApiCall = async (params) => {
  const response = await apiClient.get('/my-endpoint', { params })
  return response.data
}

// Then use in component
import { myApiCall } from '@/api/client'
const data = await myApiCall({ key: 'value' })
```

### Add Animation
```jsx
// 1. Define in src/utils/animations.js
export const myAnimationVariants = {
  initial: { /* ... */ },
  animate: { /* ... */ }
}

// 2. Use in component
import { myAnimationVariants } from '@/utils/animations'
<motion.div variants={myAnimationVariants}>Content</motion.div>
```

### Add Global Style
```css
/* Edit src/styles/globals.css */
@layer components {
  .my-custom-class {
    @apply bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg;
  }
}
```

### Update Tailwind Theme
```js
// Edit frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'my-color': '#hexcode'
      }
    }
  }
}
```

## 🔌 API Integration Pattern

```jsx
import { useEffect, useState } from 'react'
import { getEvents } from '@/api/client'
import { useDataStore } from '@/stores/store'

export default function MyPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const events = useDataStore(state => state.events)
  const setEvents = useDataStore(state => state.setEvents)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getEvents()
        setEvents(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return <div>{events.map(e => <div key={e.id}>{e.title}</div>)}</div>
}
```

## 🎬 Animation Pattern

```jsx
import { motion } from 'framer-motion'
import { fadeUpVariants, staggerContainerVariants } from '@/utils/animations'

export default function AnimatedList() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, i) => (
        <motion.div key={i} variants={fadeUpVariants}>
          {item.title}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

## 🎯 Component Pattern

```jsx
import { motion } from 'framer-motion'

export default function MyComponent({ title, description, onClick }) {
  return (
    <motion.div
      className="glass-sm p-6 rounded-xl cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <h3 className="text-lg font-bold gradient-text">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
```

## 🔑 Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```env
DATABASE_URL=your_database_url
API_KEY=your_api_key
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_key
```

## 📊 Important Imports

```jsx
// Components
import { Button, Card, Badge, Input, Loading } from '@/components/ui'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { EventCard } from '@/components/cards/EventCard'

// API
import * as apiService from '@/api/client'

// Stores
import { useAuthStore, useDataStore } from '@/stores/store'

// Hooks
import { useAuth, useLocalStorage, useScrollPosition } from '@/hooks/useAuth'

// Utils
import { fadeUpVariants, staggerContainerVariants } from '@/utils/animations'

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion'

// React Router
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
```

## ⚙️ Common Commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # (if configured)

# Backend
uvicorn app.main:app --reload          # Dev server
python -m pytest                        # Run tests (if configured)

# Git
git add .
git commit -m "your message"
git push origin main
```

## 🐛 Debug Tips

1. **Check Network Tab**: See API requests/responses
2. **Check Console**: Look for error messages
3. **React DevTools**: Inspect component props/state
4. **Zustand DevTools**: Monitor store changes (optional)
5. **Tailwind IntelliSense**: Verify class names exist

## 📱 Responsive Breakpoints (Tailwind)

```css
sm:  640px   /* tablet */
md:  768px   /* tablet large */
lg:  1024px  /* laptop */
xl:  1280px  /* desktop */
2xl: 1536px  /* 4K */
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #6084ff | Main brand color |
| Primary Dark | #2f36ff | Darker variant |
| Secondary Purple | #b060ff | Accent |
| Secondary Dark | #701fff | Darker variant |
| Accent Cyan | #00d9ff | Highlights |
| Accent Pink | #ff006e | Warnings |
| Accent Green | #00ff88 | Success |
| Dark BG | #111827 | Main background |
| Dark Darker | #030712 | Alt background |

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| API 401 Unauthorized | Login first, token in localStorage |
| CORS Error | Check backend CORS config, ensure backend running |
| Module not found | Check import path, ensure file exists |
| Styles not applying | Clear cache (`Ctrl+Shift+Del`), restart dev server |
| Animations not smooth | GPU acceleration enabled, check Framer Motion deps |
| Page not rendering | Check Router config, component exports |
| Data not loading | Check API endpoint, network errors, auth token |

## 🎯 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature

# After merge, sync main
git checkout main
git pull origin main
```

## 📈 Performance Checklist

- [ ] Images optimized
- [ ] Animations GPU-accelerated
- [ ] Code splitting enabled
- [ ] Lazy loading routes (recommended)
- [ ] No console warnings
- [ ] API calls efficient
- [ ] Build size acceptable (<500KB)

## 🔐 Security Checklist

- [ ] No secrets in code
- [ ] Auth token in localStorage (consider HttpOnly)
- [ ] CORS properly configured
- [ ] Input validation on forms
- [ ] No SQL injection possible
- [ ] XSS protection (React default)

---

**Last Updated**: Today  
**Platform**: Global Crisis Intelligence  
**Status**: ✅ Production Ready
