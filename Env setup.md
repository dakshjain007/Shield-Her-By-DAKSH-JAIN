# ENVIRONMENT VARIABLE TEMPLATES

## backend/.env
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shieldher
# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shieldher

# Authentication
JWT_SECRET=shieldher_super_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Optional: SMS/Call Integration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Optional: Email Integration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@shieldher.com

# Optional: Cloud Storage (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=shieldher-evidence
AWS_REGION=us-east-1

# Optional: Google Maps (for geocoding)
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## frontend/.env.local
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Mapbox (Required for maps)
# Get free token at: https://www.mapbox.com
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6InlvdXJ0b2tlbiJ9.example

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# App Configuration
NEXT_PUBLIC_APP_NAME=ShieldHer
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SUPPORT_EMAIL=support@shieldher.com
```

## .env.example (Root)
```env
# Copy this to .env and fill in your values

# Development URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Production URLs (when deploying)
# FRONTEND_URL=https://shieldher.vercel.app
# BACKEND_URL=https://shieldher-api.railway.app
```

---

## HOW TO GET API KEYS (All Free Tiers)

### 1. Mapbox Token (REQUIRED for maps)
```
1. Go to https://www.mapbox.com
2. Sign up for free account
3. Go to Account → Tokens
4. Copy your default public token
5. Add to frontend/.env.local as NEXT_PUBLIC_MAPBOX_TOKEN
```

### 2. MongoDB Atlas (RECOMMENDED)
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 - 512MB)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace <password> with your database password
7. Add to backend/.env as MONGODB_URI
```

### 3. Twilio (OPTIONAL - for real SMS)
```
1. Go to https://www.twilio.com
2. Sign up for free trial ($15.50 credit)
3. Get Account SID and Auth Token from dashboard
4. Get a trial phone number
5. Add to backend/.env
```

### 4. SendGrid (OPTIONAL - for emails)
```
1. Go to https://sendgrid.com
2. Sign up for free (100 emails/day)
3. Create API key in Settings
4. Add to backend/.env
```

---

## QUICK SETUP COMMANDS

### Backend Setup
```bash
cd backend

# Create .env from template
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shieldher
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOF

npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend

# Create .env.local from template
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
EOF

npm install
npm run dev
```

---

## SECURITY NOTES

⚠️ **IMPORTANT**: 
- NEVER commit .env files to git
- Change JWT_SECRET in production
- Use environment variables in deployment platforms
- Rotate API keys regularly
- Use different secrets for dev/staging/prod

✅ **Good Practices**:
- Add .env to .gitignore
- Use .env.example for templates
- Store production secrets in platform (Vercel/Railway)
- Use strong random strings for secrets
- Enable 2FA on all service accounts

---

## PRODUCTION DEPLOYMENT VARIABLES

### Vercel (Frontend)
```
Add in Vercel Dashboard → Settings → Environment Variables:

NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
```

### Railway (Backend)
```
Add in Railway Dashboard → Variables:

MONGODB_URI=mongodb+srv://...
JWT_SECRET=xxx
NODE_ENV=production
FRONTEND_URL=https://shieldher.vercel.app
```

---

## TESTING CREDENTIALS

For demo purposes, use these test values:

```env
# Test MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/shieldher_test

# Test JWT (dev only)
JWT_SECRET=test_secret_do_not_use_in_production

# Test Mapbox (public token - limited)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoidGVzdCIsImEiOiJ0ZXN0In0.test
```

⚠️ Replace with real values before deploying!

---

## VERIFICATION CHECKLIST

Before running the app, verify:

- [ ] backend/.env exists
- [ ] frontend/.env.local exists
- [ ] MongoDB URI is correct
- [ ] Mapbox token is valid
- [ ] Ports 3000 and 5000 are free
- [ ] MongoDB is running (if local)
- [ ] No syntax errors in .env files
- [ ] CORS URLs match between frontend/backend

---

## TROUBLESHOOTING

**MongoDB connection fails:**
```bash
# Local MongoDB
mongod --dbpath=/path/to/data

# Or use MongoDB Atlas cloud (recommended)
```

**Mapbox map not showing:**
```
1. Check token is correct
2. Verify no extra spaces in .env.local
3. Restart frontend dev server
4. Check browser console for errors
```

**CORS errors:**
```
Ensure FRONTEND_URL in backend/.env matches
the actual frontend URL (http://localhost:3000)
```

**Port already in use:**
```bash
# Find process using port
lsof -ti:5000
lsof -ti:3000

# Kill process
kill -9 <PID>
```

---

## ADDITIONAL RESOURCES

- Mapbox Docs: https://docs.mapbox.com
- MongoDB Atlas Guide: https://docs.atlas.mongodb.com
- Twilio Quickstart: https://www.twilio.com/docs/usage/tutorials
- Next.js Env Vars: https://nextjs.org/docs/basic-features/environment-variables

---

Generated for ShieldHer Platform