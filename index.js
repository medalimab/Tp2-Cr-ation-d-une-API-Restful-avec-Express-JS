const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const db = require('./database');
const app = express();

// Configuration de la session
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'secret-key',  // Remplace par une clé plus sécurisée
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

// Configuration Keycloak avec le fichier JSON
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');

// Utilisation du middleware Keycloak
app.use(keycloak.middleware());

app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.json("Registre de personnes! Choisissez le bon routage!");
});

// Récupérer toutes les personnes
app.get('/personnes', keycloak.protect(), (req, res) => {  // Route sécurisée
    db.all("SELECT * FROM personnes", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": rows });
    });
});

// Récupérer une personne par ID
app.get('/personnes/:id', keycloak.protect(), (req, res) => {  // Route sécurisée
    const id = req.params.id;
    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": row });
    });
});

// Créer une nouvelle personne (avec nom et adresse)
app.post('/personnes', keycloak.protect(), (req, res) => {  // Route sécurisée
    const { nom, adresse } = req.body;

    if (!nom || !adresse) {
        res.status(400).json({ "error": "Le nom et l'adresse sont requis" });
        return;
    }

    db.run(`INSERT INTO personnes (nom, adresse) VALUES (?, ?)`, [nom, adresse], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": { id: this.lastID } });
    });
});

// Mettre à jour une personne (nom et/ou adresse)
app.put('/personnes/:id', keycloak.protect(), (req, res) => {  // Route sécurisée
    const id = req.params.id;
    const { nom, adresse } = req.body;

    console.log("Requête PUT reçue avec :", { id, nom, adresse });  // Debugging

    if (!nom && !adresse) {
        res.status(400).json({ "error": "Au moins un champ (nom ou adresse) est requis" });
        return;
    }

    db.run(`UPDATE personnes SET nom = COALESCE(?, nom), adresse = COALESCE(?, adresse) WHERE id = ?`, 
        [nom, adresse, id], 
        function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ "message": "success" });
        }
    );
});

// Supprimer une personne
app.delete('/personnes/:id', keycloak.protect(), (req, res) => {  // Route sécurisée
    const id = req.params.id;
    db.run(`DELETE FROM personnes WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
