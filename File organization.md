# SHIELDHER - COMPLETE FILE ORGANIZATION GUIDE

## 📁 HOW TO ORGANIZE THE PROVIDED FILES

You received these files:
1. shieldher-complete.html
2. package.json
3. SETUP-GUIDE.md
4. DEPLOYMENT-GUIDE.md
5. README.md
6. ENV-SETUP.md
7. backend-*.js files
8. frontend-*.js files

Here's EXACTLY where each file goes:

---

## 🗂️ DIRECTORY STRUCTURE

```
shieldher/                              ← Create this root folder
│
├── README.md                           ← Use provided README.md
├── package.json                        ← Use provided package.json
├── SETUP-GUIDE.md                      ← Use provided SETUP-GUIDE.md
├── DEPLOYMENT-GUIDE.md                 ← Use provided DEPLOYMENT-GUIDE.md
├── ENV-SETUP.md                        ← Use provided ENV-SETUP.md
├── shieldher-complete.html             ← Use provided (for quick demo)
├── .gitignore                          ← Create (template below)
│
├── backend/                            ← Create this folder
│   ├── package.json                    ← Rename: backend-package.json → package.json
│   ├── server.js                       ← Rename: backend-server.js → server.js
│   ├── .env                            ← Create manually (see ENV-SETUP.md)
│   ├── .env.example                    ← Create (template below)
│   │
│   └── src/                            ← Create this folder
│       ├── models/                     ← Create this folder
│       │   ├── User.js                 ← Rename: backend-User-model.js → User.js
│       │   ├── Event.js                ← Rename: backend-Event-model.js → Event.js
│       │   └── Alert.js                ← Rename: backend-Alert-model.js → Alert.js
│       │
│       ├── routes/                     ← Create this folder
│       │   ├── auth.js                 ← Rename: backend-auth-routes.js → auth.js
│       │   ├── events.js               ← Rename: backend-events-routes.js → events.js
│       │   ├── alerts.js               ← Rename: backend-alerts-routes.js → alerts.js
│       │   ├── tracking.js             ← Rename: backend-tracking-routes.js → tracking.js
│       │   └── analytics.js            ← Rename: backend-analytics-routes.js → analytics.js
│       │
│       ├── services/                   ← Create this folder
│       │   └── aiEngine.js             ← Rename: backend-aiEngine.js → aiEngine.js
│       │
│       └── socket/                     ← Create this folder
│           └── socketHandler.js        ← Rename: backend-socketHandler.js → socketHandler.js
│
└── frontend/                           ← Create this folder
    ├── package.json                    ← Rename: frontend-package.json → package.json
    ├── next.config.js                  ← Extract from frontend-configs.js (section 1)
    ├── tailwind.config.js              ← Extract from frontend-configs.js (section 2)
    ├── postcss.config.js               ← Extract from frontend-configs.js (section 3)
    ├── .env.local                      ← Create manually (see ENV-SETUP.md)
    ├── .env.example                    ← Create (template below)
    │
    ├── public/                         ← Create this folder
    │   └── (static assets)
    │
    └── src/                            ← Create this folder
        ├── app/                        ← Create this folder
        │   ├── layout.js               ← Extract from frontend-layout-and-styles.js
        │   ├── globals.css             ← Extract from frontend-layout-and-styles.js
        │   ├── page.js                 ← Create from shieldher-complete.html
        │   │
        │   ├── dashboard/              ← Create this folder
        │   │   └── page.js             ← Create (extract from HTML)
        │   │
        │   ├── guardian/               ← Create this folder
        │   │   └── page.js             ← Create (template below)
        │   │
        │   └── admin/                  ← Create this folder
        │       └── page.js             ← Create (template below)
        │
        ├── components/                 ← Create this folder
        │   ├── ThreatMeter.jsx         ← Create (extract from HTML)
        │   ├── LiveMap.jsx             ← Create (extract from HTML)
        │   ├── EventSimulator.jsx      ← Create (extract from HTML)
        │   ├── AlertTimeline.jsx       ← Create (extract from HTML)
        │   └── EmergencyPanel.jsx      ← Create (extract from HTML)
        │
        └── lib/                        ← Create this folder
            ├── api.js                  ← Create (template below)
            └── socket.js               ← Create (template below)
```

---

## 📝 FILE EXTRACTION INSTRUCTIONS

### 1. Extract Frontend Configs

**Source file:** `frontend-configs.js`

**Extract to 3 separate files:**

```bash
cd frontend

# Extract next.config.js (lines 1-10)
# Extract tailwind.config.js (lines 13-67)
# Extract postcss.config.js (lines 71-76)
```

### 2. Extract Frontend Layout

**Source file:** `frontend-layout-and-styles.js`

**Extract to 2 separate files:**

```bash
cd frontend/src/app

# Extract layout.js (lines 1-26)
# Extract globals.css (lines 30-end)
```

### 3. Convert HTML to React Components

**Source file:** `shieldher-complete.html`

The HTML file contains the complete UI. You need to:

**Option A: Use as-is for quick demo**
```bash
# Just open shieldher-complete.html in browser
# No setup needed!
```

**Option B: Convert to Next.js (for full-stack)**
```bash
# Extract components from HTML:
# - Landing page → frontend/src/app/page.js
# - Dashboard → frontend/src/app/dashboard/page.js
# - Threat meter → frontend/src/components/ThreatMeter.jsx
# - Map → frontend/src/components/LiveMap.jsx
# - Event simulator → frontend/src/components/EventSimulator.jsx
```

---

## 🔧 FILES TO CREATE MANUALLY

### 1. .gitignore (root)
```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Next.js
.next/
out/
build/

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo

# MongoDB
data/
```

### 2. backend/.env.example
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shieldher
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. frontend/.env.example
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 4. frontend/src/lib/api.js
```javascript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// API methods
export const auth = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const events = {
  simulate: (data) => api.post('/api/events/simulate', data),
  getHistory: (userId) => api.get(`/api/events/history/${userId}`),
};

export const alerts = {
  trigger: (data) => api.post('/api/alerts/trigger', data),
  getAlerts: (userId) => api.get(`/api/alerts/${userId}`),
};

export const tracking = {
  update: (data) => api.post('/api/tracking/update', data),
  getHistory: (userId) => api.get(`/api/tracking/${userId}`),
};

export const analytics = {
  getHeatmap: () => api.get('/api/analytics/heatmap'),
  getTrends: () => api.get('/api/analytics/trends'),
};
```

### 5. frontend/src/lib/socket.js
```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  init: initSocket,
  get: getSocket,
  disconnect: disconnectSocket,
};
```

---

## ⚡ QUICK SETUP COMMANDS

### Complete Setup (10 minutes)

```bash
# 1. Create root structure
mkdir shieldher
cd shieldher

# 2. Copy provided files to root
cp ~/Downloads/README.md .
cp ~/Downloads/package.json .
cp ~/Downloads/SETUP-GUIDE.md .
cp ~/Downloads/DEPLOYMENT-GUIDE.md .
cp ~/Downloads/ENV-SETUP.md .
cp ~/Downloads/shieldher-complete.html .

# 3. Setup backend
mkdir -p backend/src/{models,routes,services,socket}
cd backend

# Copy and rename backend files
cp ~/Downloads/backend-package.json package.json
cp ~/Downloads/backend-server.js server.js
cp ~/Downloads/backend-User-model.js src/models/User.js
cp ~/Downloads/backend-Event-model.js src/models/Event.js
cp ~/Downloads/backend-Alert-model.js src/models/Alert.js
cp ~/Downloads/backend-auth-routes.js src/routes/auth.js
cp ~/Downloads/backend-events-routes.js src/routes/events.js
cp ~/Downloads/backend-alerts-routes.js src/routes/alerts.js
cp ~/Downloads/backend-tracking-routes.js src/routes/tracking.js
cp ~/Downloads/backend-analytics-routes.js src/routes/analytics.js
cp ~/Downloads/backend-aiEngine.js src/services/aiEngine.js
cp ~/Downloads/backend-socketHandler.js src/socket/socketHandler.js

# Create .env
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shieldher
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOF

npm install

# 4. Setup frontend
cd ..
mkdir -p frontend/src/{app,components,lib}
cd frontend

# Copy frontend files
cp ~/Downloads/frontend-package.json package.json

# Extract configs from frontend-configs.js manually
# Extract layout from frontend-layout-and-styles.js manually

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
EOF

npm install

# 5. Start everything
cd ..
npm run dev
```

---

## 🎯 VERIFICATION CHECKLIST

After organizing files, verify:

```bash
# Check backend structure
ls backend/src/models/      # Should see User.js, Event.js, Alert.js
ls backend/src/routes/      # Should see auth.js, events.js, etc.
ls backend/src/services/    # Should see aiEngine.js
ls backend/src/socket/      # Should see socketHandler.js

# Check frontend structure
ls frontend/src/app/        # Should see layout.js, globals.css
ls frontend/src/components/ # Should see component files
ls frontend/src/lib/        # Should see api.js, socket.js

# Check configs
ls frontend/               # Should see next.config.js, tailwind.config.js
cat backend/.env           # Should have PORT, MONGODB_URI, JWT_SECRET
cat frontend/.env.local    # Should have API URLs and Mapbox token
```

---

## 🚨 COMMON MISTAKES TO AVOID

❌ **Don't:**
- Leave files with `backend-` or `frontend-` prefixes
- Put all files in root directory
- Forget to create `src/` folders
- Skip creating .env files
- Copy .env files to git

✅ **Do:**
- Follow exact folder structure above
- Rename files properly
- Create all required folders
- Add sensitive data to .gitignore
- Test after each major step

---

## 🎬 READY TO RUN CHECKLIST

- [ ] All files organized as per structure
- [ ] backend/.env created with valid values
- [ ] frontend/.env.local created with Mapbox token
- [ ] node_modules installed in both folders
- [ ] MongoDB running (local or Atlas)
- [ ] Ports 3000 and 5000 available
- [ ] .gitignore created

**If all checked, run:**
```bash
npm run dev
```

---

## 📞 NEED HELP?

1. **Quick Demo**: Just use `shieldher-complete.html`
2. **Setup Issues**: See `DEPLOYMENT-GUIDE.md`
3. **Environment Vars**: See `ENV-SETUP.md`
4. **General Info**: See `README.md`

---

Generated for ShieldHer Platform