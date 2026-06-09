# ITWORKS Technologies Limited — MERN Website

Full-stack website for ITWORKS Technologies Limited, Eldoret Kenya.

## Stack
- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Email:** Nodemailer
- **Deployment:** Vercel (client) + Railway (server)

## Project Structure
```
itworks-mern/
├── client/                 ← React + Vite frontend
│   └── src/
│       ├── components/     ← Navbar, Footer, WhatsAppButton, MobileBottomBar
│       ├── pages/          ← Home, Services, About, Projects, Contact
│       ├── hooks/          ← useReveal (scroll animations)
│       └── styles/         ← global.css + per-page CSS
└── server/                 ← Express backend
    ├── models/             ← Contact.js, Project.js
    ├── routes/             ← contact.js, projects.js
    ├── controllers/        ← contactController.js, projectController.js
    └── index.js
```

## Getting Started

### 1. Clone and install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and SMTP credentials
```

### 3. Run in development

```bash
# Terminal 1 — Start backend
cd server
npm run dev        # runs on http://localhost:5000

# Terminal 2 — Start frontend
cd client
npm run dev        # runs on http://localhost:3000
```

### 4. Deploy

**Frontend → Vercel**
```bash
cd client
npm run build
# Push to GitHub, connect to Vercel
# Set VITE_API_URL env var to your Railway backend URL
```

**Backend → Railway**
```bash
# Push server/ to GitHub
# Connect to Railway
# Set environment variables: MONGO_URI, CLIENT_URL, SMTP_USER, SMTP_PASS
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Submit contact/quote form |
| GET | /api/contact | Get all contacts (admin) |
| PATCH | /api/contact/:id | Update contact status |
| GET | /api/projects | Get all projects (optional ?category=) |
| POST | /api/projects | Add new project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/health | Server health check |

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://...
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
NOTIFY_EMAIL=info@itworks.co.ke
```
#ITWorks
