const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./maBaseDeDonnees.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');

        // Vérifier si la table existe et ajouter la colonne "adresse" si elle n'existe pas
        db.all("PRAGMA table_info(personnes)", [], (err, columns) => {
            if (err) {
                console.error(err.message);
                return;
            }

            // Vérifier si "columns" est un tableau avant d'utiliser .some()
            if (Array.isArray(columns) && !columns.some(col => col.name === "adresse")) {
                db.run("ALTER TABLE personnes ADD COLUMN adresse TEXT", (err) => {
                    if (err) console.error(err.message);
                    else console.log("Colonne 'adresse' ajoutée avec succès !");
                });
            }
        });

        // Création de la table si elle n'existe pas encore
        db.run(`CREATE TABLE IF NOT EXISTS personnes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                const personnes = ['Bob', 'Alice', 'Charlie'];
                personnes.forEach((nom) => {
                    db.run(`INSERT INTO personnes (nom) VALUES (?)`, [nom]);
                });
            }
        });
    }
});

module.exports = db;
