# TP API sécurisée avec Keycloak

Ce TP consiste à créer une **API RESTful** avec **Node.js** et **Express**, sécurisée à l'aide de **Keycloak**. L'API gère un registre de personnes avec des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer). L'authentification et l'autorisation des utilisateurs sont gérées par **Keycloak** via **OAuth 2.0**.

## Prérequis

1. **Node.js** installé : https://nodejs.org
2. **Keycloak** installé et fonctionnel : https://www.keycloak.org
3. **Base de données SQLite** pour stocker les informations des personnes.

## Installation

1. **Clone ou télécharge le projet**.
2. **Installe les dépendances** :
   ```bash
   npm install
