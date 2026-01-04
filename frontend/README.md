# 🎨 ZooConnect — Frontend

Interface utilisateur du **Zoo Management System (ZMS)**, développée en HTML, CSS et JavaScript vanilla.

---

## 🚀 Installation

### Prérequis
- Node.js ≥ 18

### Installation
```bash
cd frontend
npm install
```

### Lancer l’application
Voir côté backend. Actuellement le backend sert le frontend.

## Détails techniques

### 🧱 Architecture frontend
```
├── src/
│   ├── css/                        # Feuilles de style pour les pages
│   ├── images/                     # Images et icônes utilisées dans l'UI
│   ├── js/
│   │   ├── controllers/            # Gestion des interactions utilisateur / DOM
│   │   ├── services/               # Appels API / logique métier côté client
│   │   └── utils/                  # Fonctions utilitaires réutilisables
│   ├── bookings.html               # Page de gestion des réservations
│   ├── events.html                 # Page des événements
│   ├── explore.html                # Page de recherche / exploration des animaux
│   ├── feeding-planning.html       # Page de planification des nourrissages
│   ├── index.html                  # Page d'accueil
│   ├── login.html                  # Page de connexion
│   ├── profile.html                # Page profil utilisateur
│   └── signup.html                 # Page d'inscription
```

### Rôles & Permissions
- Visitor : consultation des animaux, réservation de tickets
- Staff : gestion des animaux, planification des nourrissages
- Admin : gestion des utilisateurs et supervision des données

Les pages sont protégées côté client selon le rôle de l’utilisateur.

### 🔁 Communication avec le backend
- Appels REST API via les fichiers services
- Token JWT stocké côté client (localStorage / sessionStorage)
- Headers Authorization inclus pour les requêtes sécurisées

### 🖌️ UI & UX
- Pages publiques et privées selon l’utilisateur
- Feedback utilisateur (chargement, erreurs)
- Structure modulaire : contrôleurs, services et utilitaires séparés pour maintenabilité

### 🛣️ Évolutions prévues
- Dashboard admin avancé
- Statistiques et reporting visuel
- Notifications email / SMS
- Internationalisation (FR / EN)
- Accessibilité (WCAG)
- Passer au responsive avec REACT