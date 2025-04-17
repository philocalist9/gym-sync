# GymSync

A comprehensive gym management system with multi-role dashboards.

## Project Folder Structure
```
📁 gym-sync/
├── 📁 frontend/                # Next.js + Tailwind CSS (for web)
│   ├── 📁 pages/               # All page components (home, auth, dashboards)
│   ├── 📁 components/          # Reusable UI components (Navbar, Footer, etc.)
│   ├── 📁 context/             # AuthContext, RoleContext, etc.
│   ├── 📁 utils/               # Axios setup, helper functions
│   ├── 📁 hooks/               # Custom hooks (e.g., useAuth, useRole)
│   ├── 📁 styles/              # Tailwind CSS, global styles
│   └── next.config.js          # Next.js config
│
├── 📁 backend/                 # Express.js REST API
│   ├── 📁 controllers/         # Auth, User, Workout, Plan, etc.
│   ├── 📁 routes/              # Routes for all roles
│   ├── 📁 middleware/          # JWT, Role-based Access
│   ├── 📁 models/              # Mongoose Schemas (User, Workout, etc.)
│   ├── 📁 config/              # DB Connection, Env setup
│   ├── 📁 utils/               # Helper modules (ID gen, Email, etc.)
│   └── server.js               # Entry point
│
├── 📁 mobile/                  # React Native App (for Members/Gym Owners)
│   ├── 📁 screens/             # Login, Dashboard, etc.
│   ├── 📁 components/          # Reusable mobile components
│   ├── 📁 services/            # API calls
│   └── App.js
│
├── 📁 ml-model/                # Python ML microservice (renewal predictor)
│   ├── 📁 model/               # Trained model file
│   ├── 📁 data/                # Training data
│   └── app.py                  # Flask app exposing `/predict` route
│
├── 📁 shared/                  # Shared constants / types / roles
│   ├── roles.ts
│   └── permissions.ts
│
├── docker-compose.yml          # Dev containers for frontend, backend, ML
├── .env                        # Shared environment variables
└── README.md
```

## Role Mapping
Defined in `shared/roles.ts` and `shared/permissions.ts`

## Highlights
- Role separation with permissions per dashboard
- Easily scale to add features or microservices
- Shared folder helps reuse constants/types
- Ready to plug in Docker for dev/deploy
- Mobile + ML are separate services using the same APIs 