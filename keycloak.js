const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();

// Configuration de la session
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Configuration Keycloak avec le fichier JSON
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');

// Utilisation du middleware Keycloak
app.use(keycloak.middleware());

// Exemple de route non sécurisée
app.get('/public', (req, res) => {
    res.json({ message: "Bienvenue dans la zone publique !" });
});

// Exemple de route sécurisée
app.get('/secure', keycloak.protect(), (req, res) => {
    res.json({ message: "Bienvenue dans la zone sécurisée !" });
});

// Démarrage du serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});