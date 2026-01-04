# 🦁 ZooConnect — Zoo Management System (ZMS)

ZooConnect est une application web **full-stack MERN** conçue pour centraliser et structurer la gestion d’un zoo moderne : animaux, utilisateurs, événements et réservations.

Le projet répond aux besoins opérationnels et métiers d’un zoo en proposant une plateforme sécurisée, modulaire et évolutive, exposée via une API web.

---

## 🎯 Objectifs du projet

- Centraliser la gestion des animaux, du personnel et des visiteurs
- Structurer les règles métier liées aux événements et aux réservations
- Sécuriser l’accès aux fonctionnalités via un contrôle des rôles
- Réduire les tâches manuelles et les erreurs administratives
- Fournir une base technique propre pour des évolutions futures

---

## 🧩 Périmètre fonctionnel

### 🐾 Animal Management
- Création et mise à jour des profils animaux
- Suivi des espèces, habitats et âges
- Gestion des statuts (actif / inactif)
- Filtrage et recherche des animaux

### 👥 User & Staff Management
- Authentification sécurisée (JWT)
- Rôles et permissions (RBAC)
  - Visitor
  - Staff
  - Admin
- Gestion des utilisateurs par les administrateurs

### 🎟️ Booking
- Consultation des événements
- Création de réservations
- Annulation et reprogrammation
- Vérification des règles métier (dates, statut, ownership)

### 📅 Events
- Création et gestion d’événements
- Gestion des dates, capacités et statuts
- Association événements ↔ réservations

### 📊 Administration
- Gestion des utilisateurs
- Supervision des données principales
- Base préparée pour des fonctionnalités de reporting

---

## 🏗️ Architecture générale

ZooConnect suit une **architecture en couches**, orientée **séparation des responsabilités** :

#### Client HTTP (REST / JSON)
```
frontend/
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

#### Backend API (Node.js / Express)
```
src
├── Controllers (gestion HTTP)
├── Services (logique métier)
├── Repositories (accès base de données)
├── Middlewares (authentification, permissions, validation)
└── Models (Mongoose / MongoDB)
```

### Pourquoi cette architecture ?
- Testabilité accrue
- Lisibilité et maintenabilité du code
- Découplage de la logique métier et de l’accès aux données
- Préparation à un éventuel changement de base de données ou de framework

---

## ⚙️ Stack technique

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (authentification)
- RBAC (Role-Based Access Control)
- Luxon (gestion et validation des dates)

### Frontend
- Client web consommant une API REST
- Gestion des rôles et des permissions côté interface
- Communication HTTP structurée (JSON)

---

## 🔐 Sécurité

- Authentification basée sur JWT
- Hashage des mots de passe
- Contrôle d’accès par rôles et permissions
- Middlewares de sécurité dédiés
- Validation des données entrantes
- Gestion centralisée des erreurs

---

## 📐 Exigences non fonctionnelles

- Performance : ≤ 2s par requête
- Scalabilité : architecture modulaire
- Disponibilité : API stateless
- Maintenabilité : services découplés
- Sécurité : RBAC, validation, audit futur

---

## 📁 Structure du dépôt

```
zoo_connect/
├── backend/ # API Node.js / Express
│ └── README.md
├── frontend/ # Client web
│ └── README.md
└── README.md # Documentation globale
```


---

## 🚀 Lancer le projet

Voir les README spécifiques :
- 👉 [`/backend/README.md`](./backend/README.md)
- 👉 [`/frontend/README.md`](./frontend/README.md)

---

## 🛣️ Évolutions prévues

- Paiement en ligne
- Notifications (email / SMS)
- Reporting avancé
- Gestion avancée de la santé animale
- Internationalisation (FR / EN)

---

## 👤 Auteurs

**MONTARON Léa**  
**NAISSANS Clément**  
**Harreshh Mourougan**  
**Arjuna Santhoosh**

Projet académique et technique — ZooConnect  
Architecture MERN & principes de clean code

