
const mongoose = require('mongoose');
const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  }

mongoose.set('strictQuery', true)
let cmpt=0

// fonction de connexion a la base de donnée mongodb 

exports.connectionMongodServer = () => {
    
    cmpt+=1
    if(cmpt <5){
        mongoose
        .connect(process.env.MONGO_URL , options)
        .then(() => {
            console.log("Connexion a la base de donnée mongodb reussie");
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
    if(cmpt == 5) {
       console.log("Tentative de connexion a la base de donnée refusée");
       
        
    }
   
}
