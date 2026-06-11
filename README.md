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
| GET | /api/services | Get all services |
| GET | /api/services/:slug | Get a single service |
| GET | /api/stats | Get website stats |
| GET | /api/health | Server health check |

## How to Run Locally

1. Install all dependencies:
   ```bash
   npm run install-all
   ```
2. Start the development servers (client + server concurrently):
   ```bash
   npm run dev
   ```

## Database Management & Content Updates

To securely add, update, or remove projects and services directly:

1. **Using MongoDB Compass (Desktop UI)**:
   - Connect using the URI from `server/.env` (`mongodb+srv://trademint:Trademint2025@cluster0.4wpqqge.mongodb.net/itworks`).
   - Open the `itworks` database to edit the following collections:
     - **`projects`**: Manage projects shown on the Projects page.
     - **`services`**: Manage core services shown on the Services page.
     - **`stats`**: Manage counter statistics shown on the Home page.

2. **Using MongoDB Atlas (Web Dashboard)**:
   - Go to your MongoDB Atlas dashboard under **Database** > **Browse Collections** and navigate to `itworks` database to edit collections directly.
