/** 
    @description 'Ensemble des fonctionnalités qui seront utilisés pour la gestion des erreurs de connexion '
*/
module.exports = {

    signInErrors : (err) =>{
        let errors = {pseudo : '' , email : '', password : '' , numero : ''};
    
        if (err.message.includes('nom')) errors.pseudo = 'le champ nom doit etre remplit';
    
        if (err.message.includes('username')) errors.username = 'le champ username doit etre remplit';

        if (err.message.includes('mdp')) errors.password = 'Le champ mot de passe doit etre remplit ';

        if (err.message.includes('prenom')) errors.prenom = 'le champ prenom doit etre remplit';
        
        if(err.message.includes('telephone')) errors.telephone = 'le champ telephone doit etre remplit'
        
        if (err.message.includes('genre')) errors.password = 'le champ genre doit etre remplit';
        
        if (err.message.includes('statut')) errors.statut = 'le champ statut doit etre remplit';

        if (err.message.includes('region')) errors.region = 'le champ region doit etre remplit';
        
        if (err.message.includes('departement')) errors.statut = 'le champ departement doit etre remplit';

        if (err.message.includes('arrondissement')) errors.arrondissement = 'le champ arrondissement doit etre remplit';

        if (err.message.includes('lieuDit')) errors.lieuDit = 'le champ lieu-dit doit etre remplit';

        
        // gestion des erreurs de duplication des données 
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('nom')) errors.nom = 'ce nom existe déja dans la base donnée';
        
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('username')) errors.username = 'ce nom utilisateur existe deja dans la base de donnée';
         
        if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('telephone')) errors.telephone = 'Ce numéro existe deja dans la base de donnée'
    
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('mdp')) errors.pseudo = 'ce mot de passe existe deja dans la base donnée ';
    
        return errors;
    },
    loginErrors : (err ) =>{
        let errors = {}
        return errors 
    }
    ,
    loginErrors : (err) =>{
        let errors = {}
        if(err.message.includes('username') ) errors.username = 'Le champ username doit etre remplit'
        if(err.message.includes('password'))  errors.password='Le champ password doit etre remplit'
        return errors
    }
}