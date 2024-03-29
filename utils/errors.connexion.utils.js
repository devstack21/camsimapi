/** 
    @description 'Ensemble des fonctionnalités qui seront utilisés pour la gestion des erreurs de connexion '
*/
module.exports = {

    signUpErrors : (err) =>{
        let errors = {};
    
        if (err.message.includes('nom')) errors.nom = 'le champ nom doit etre remplit';
    
        if (err.message.includes('username')) errors.username = 'le champ username doit etre remplit';

        if (err.message.includes('mdp')) errors.password = 'Le champ mot de passe doit etre remplit ';

        if (err.message.includes('prenom')) errors.prenom = 'le champ prenom doit etre remplit';
        
        if(err.message.includes('telephone')) errors.telephone = 'le champ telephone doit etre remplit'
        
        if (err.message.includes('genre')) errors.genre = 'le champ genre doit etre remplit';
        
        if (err.message.includes('type_user')) errors.statut = 'le champ statut doit etre remplit';

        if (err.message.includes('region')) errors.region = 'le champ region doit etre remplit';
        
        if (err.message.includes('departement')) errors.departement = 'le champ departement doit etre remplit';

        if (err.message.includes('arrondissement')) errors.arrondissement = 'le champ arrondissement doit etre remplit';

        if (err.message.includes('lieuDit')) errors.lieuDit = 'le champ lieu-dit doit etre remplit';

        
        // gestion des erreurs de duplication des données 
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('nom')) errors.nom = 'ce nom existe déja dans la base donnée';
        
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('username')) errors.username = 'ce nom utilisateur existe deja dans la base de donnée';
         
        if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('telephone')) errors.telephone = 'Ce numéro existe deja dans la base de donnée'
    
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('mdp')) errors.password = 'ce mot de passe existe deja dans la base donnée ';
    
        return errors;
    },

    // methode de gestion d'erreur des enqueteur 
    createProductByInvestigatorError : (err) =>{
            // add differents champs 
    }
   
}