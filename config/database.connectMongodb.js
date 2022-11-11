const mongoose = require('mongoose')

// fonction de connexion a la base de donnée mongodb 
exports.connectionMongodServer = () => {

    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log('Connexion a la base de donnée mongodb reussie');
        })
        .catch((err) =>{
            console.log('Une erreur est survenue lors de la connexion a la base donnée');
            setTimeout(() => {
                console.log('Nouvelle tentative de connexion a la base de donnée mongodb');
                // redefinition de facon recursive de la fonction de connexion a la base donnée
                this.connectionMongodServer()
            }, 4000);
        })
}