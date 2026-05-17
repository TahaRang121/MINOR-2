# Crisis AI - Premium Global Crisis Intelligence Platform

A cutting-edge, cinematic frontend built with React, Tailwind CSS, Framer Motion, and GSAP for real-time crisis monitoring and market intelligence.

## 🎨 Design Philosophy

- **Premium Aesthetics**: Dark theme with blue/purple neon gradients
- **Glassmorphism**: Frosted glass effect cards with backdrop blur
- **Cinematic Animations**: Smooth, immersive motion using Framer Motion and GSAP
- **Luxury SaaS Design**: Apple-level smoothness and professional polish
- **Responsive**: Mobile-first, works seamlessly across all devices

## 🚀 Tech Stack

- **React 19**: Modern UI framework
- **Tailwind CSS 3.4**: Utility-first styling
- **Framer Motion 11**: Advanced animations
- **GSAP 3.12**: High-performance animations
- **React Router 7**: Client-side routing
- **Axios**: HTTP client for API integration
- **Zustand**: Lightweight state management
- **Lucide React**: Beautiful icon library
- **Recharts**: Data visualization

## 📁 Project Structure

```
src/
├── api/                    # API client and services
│   └── client.js          # Axios instance with interceptors
├── components/
│   ├── layout/            # Navigation, Footer
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── ui/                # Reusable UI components
│   │   └── index.jsx      # Button, Card, Badge, Input, etc.
│   └── cards/             # Business components
│       └── EventCard.jsx
├── pages/                 # Page components
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── EventDetail.jsx
│   ├── SearchPage.jsx
│   ├── Chat.jsx
│   └── HistoryPage.jsx
├── hooks/                 # Custom React hooks
│   └── useAuth.js
├── stores/               # Zustand stores
│   └── store.js
├── utils/                # Utility functions
│   └── animations.js     # Animation variants and helpers
├── styles/
│   └── globals.css       # Global Tailwind styles
├── App.jsx              # Main app with routing
└── main.jsx             # Entry point
```

## 🎯 Key Features

### Landing Page
- Cinematic hero section with animated gradients
- Feature showcase with glassmorphism cards
- Stats section
- Call-to-action sections
- Smooth scrolling experience

### Authentication
- Premium Login page with animations
- Signup with form validation
- Split-screen layouts (expandable for future)
- Remember me functionality
- Error handling

### Dashboard
- Real-time analytics cards with gradients
- Recent events feed
- Quick action buttons
- Top sector trends
- Animated statistics

### Event Details
- Comprehensive event information
- Sector predictions with confidence scores
- Direction indicators (rise/fall/neutral)
- Source links
- Related predictions

### Search
- Real-time search functionality
- Filtered results
- Event cards with preview
- Loading states

### AI Chat
- Real-time conversation with AI
- Message history
- Source attribution
- Smooth message animations
- Loading indicators

### Prediction History
- Sortable prediction list
- Filter by direction and sector
- Confidence scoring
- Timeline view
- Pagination support

## 🎨 Design Elements

### Colors
- **Primary**: Blue (#6084ff - #2f36ff)
- **Secondary**: Purple (#b060ff - #701fff)
- **Accent**: Cyan (#00d9ff), Pink (#ff006e), Green (#00ff88)
- **Dark**: Dark grays (#111827 - #030712)

### Components
- **Glassmorphism Cards**: Frosted effect with blur
- **Gradient Buttons**: From/to color gradients
- **Animated Icons**: Lucide React with motion
- **Badge Labels**: Status indicators with variants
- **Skeleton Loaders**: Shimmer effect during loading
- **Input Fields**: Focused state with glow

### Animations
- **Fade Up**: Elements fade in and slide up
- **Scale In**: Elements scale from small to normal
- **Stagger**: Sequential animation of multiple items
- **Hover Effects**: Interactive scaling and shadows
- **Scroll Triggers**: Animations on scroll (expandable with GSAP)
- **Floating Elements**: Subtle motion effect
- **Glowing Effects**: Neon-like borders and shadows

## 🔧 Installation

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Start development server**:
```bash
npm run dev
```

Server runs at `http://localhost:5173`

3. **Build for production**:
```bash
npm run build
```

## 🌐 API Integration

The frontend connects to the backend at `http://localhost:8000/api` (configurable).

### Available Endpoints
- `GET /api/events` - List crisis events
- `GET /api/events/{id}` - Get event details
- `POST /api/events/fetch` - Fetch new events
- `GET /api/predictions` - List predictions
- `GET /api/predictions/summary` - Prediction summary
- `GET /api/search` - Search events
- `POST /api/chat` - Chat with AI

### Authentication
Token-based auth using Bearer token stored in localStorage.

## 📱 Responsive Design

- **Mobile**: Full-width, stacked layout, hamburger menu
- **Tablet**: 2-column grid, optimized spacing
- **Desktop**: Multi-column layout, full features
- **4K**: Max-width container with centered content

## ⚡ Performance Optimizations

- Code splitting with Vite
- Lazy loading routes (recommended)
- Optimized animations (GPU-accelerated)
- Image optimization
- CSS-in-JS with Tailwind (no runtime overhead)
- Efficient re-rendering with React optimization

## 🔐 Security Features

- CORS-enabled API client
- Bearer token authentication
- Secure localStorage usage
- Input sanitization (recommended)
- XSS protection (React built-in)

## 🎬 Animation Examples

### Framer Motion
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Tailwind Animations
```jsx
<div className="animate-fade-up animation-delay-100">
  Content
</div>
```

## 🛠️ Development Tips

1. **Add new page**: Create component in `pages/`, add route to `App.jsx`
2. **Add UI component**: Extend `components/ui/index.jsx`
3. **Add animation**: Define variants in `utils/animations.js`
4. **Add API call**: Extend `apiService` in `api/client.js`
5. **State management**: Use Zustand stores in `stores/store.js`

## 📦 Deployment

1. Build: `npm run build`
2. Output: `dist/` folder
3. Deploy to Vercel, Netlify, or your server
4. Set `VITE_API_URL` environment variable for backend

## 🎓 Best Practices

- Use semantic HTML
- Accessibility (ARIA labels)
- Responsive images
- Mobile-first CSS
- Component composition
- Error boundaries (recommended)
- Performance monitoring (recommended)

## 🚀 Future Enhancements

- Dark/light theme toggle
- Internationalization (i18n)
- Progressive Web App (PWA)
- Real-time WebSocket updates
- Advanced analytics
- Data export (CSV/PDF)
- Custom dashboards
- Team collaboration features

## 📄 License

Proprietary - Crisis AI Platform

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for premium crisis intelligence**
