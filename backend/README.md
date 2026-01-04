# 🧠 ZooConnect — Backend API

API REST du Zoo Management System.  
Elle centralise la logique métier, la sécurité, la gestion des données et les règles fonctionnelles.

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js ≥ 18
- MongoDB
- npm ou yarn

### Installation
```bash
cd backend
npm install
```
### Configuration
Créer un fichier .env :
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/zoo_connect
JWT_SECRET=your_secret
SALT_ROUNDS=10
```

### Lancer l’API
`npm run dev`

## Détails techniques

### 🏗️ Architecture backend
```
src/
├── controllers/    # Gestion HTTP
├── services/       # Logique métier
├── repositories/   # Accès base de données
├── models/         # Schémas Mongoose
├── middlewares/    # Auth, RBAC, erreurs
├── routes/         # Définition des endpoints
├── helpers/        # Helpers (dates, etc.)
└── app.js
```

### Rôles des couches
- Controller : extraction req / res
- Service : règles métier
- Repository : accès DB uniquement
- Middleware : sécurité et permissions

### 🔐 Authentification & RBAC
- Authentification via JWT Bearer Token
- Middlewares disponibles :
    - auth : vérification du token et création de req.user
    - requireRole : accès réservé à différents rôles, notamment à partir de celui spécifié
    - requireOwnerOrAdmin : accès si propriétaire ou admin

### 📡 Exemples d’endpoints
- POST /api/auth/login
- GET /api/animals
- POST /api/bookings
- PUT /api/bookings/:id/reprogram
- GET /api/users (admin)

### 🧪 Gestion des erreurs & validation

- Erreurs métier via CustomError
- Middleware global errorHandler
- Codes HTTP cohérents (400 / 403 / 404 / 409 / 500)
- Validation côté services et middlewares

### 📅 Gestion des dates
- Luxon
- Validation format + dates passées
- Centralisation des messages d’erreur

### 🔮 Évolutions backend prévues
- Notifications (email/SMS)
- Paiement
- Audit logs
- Reporting & statistiques