/** 
    @description 'Ensemble des fonctionnalités qui seront utilisés pour la gestion des erreurs de connexion '
*/
module.exports = {
    // verification de la taille numero de telephone , si un des elements est une chaine de caractère 
    signInErrors : (err) =>{
        let errors = {pseudo : '' , email : '', password : '' , numero : ''};
    
        if (err.message.includes('nom')) errors.pseudo = 'pseudo incorrect';
    
        if (err.message.includes('email')) errors.pseudo = 'email incorrect';
    
        if (err.message.includes('password')) errors.password = 'password must have 10 character';
    
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')) errors.pseudo = 'email already exist ';
        
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')) errors.pseudo = 'pseudo already exist ';
    
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('password')) errors.pseudo = 'password already exist ';
    
        return errors;
    },
    loginErrors : (err ) =>{
        let errors = {}
        return errors 
    }
}