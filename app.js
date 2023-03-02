const createError = require('http-errors'); // module pour la gestion des erreurs HTTP
const express = require('express'); // you know 
const path = require('path');
const logger = require('morgan'); // module pour les logs des données du front 
const bodyParser = require('body-parser')// module pour parser json des req client
const {maxAvailable} = require('./modules')
// definition des variables d'environnement 
require('dotenv').config({path : './config/.env'})
const cors = require('cors') // module porur la configuration des accèes au serveur 


// definition des differentes routes d'accès au API 
//const simwebRouter = require('./routes/sim_web/sim_web') ; 
const camsimRoutes = require('./routes/CAMSIM.API.routes') 

// definition de l'app server 
const  app = express();

// fonction pour les authentification et la deconnexion
const {checkAuthUser , checkConnectionApplication  } = require('./middleware/auth.utilisateur.middleware') ;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

const { logout } = require('./controllers/ConnexionApp.controller');

app
.use(cors({
    "origin" : '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200
}))

.use(bodyParser.json())
.use(bodyParser.urlencoded({
    extended :true
}))
// deconnexion de l'utilisateur 
.use('/logout' , logout) // destruction du token dans l'entete de la requete HTTP 
.use(checkConnectionApplication)
.use(logger('dev'))
//.use('/' , authUserByToken , (request , response) =>{})
.use('/API',camsimRoutes) // checkAuthUser, // definition de l'objet global camsimRoutes indexant toutes les routes de l'application Web & Mobile
// catch 404 and forward to error handler
.use((req, res, next) => {
    next(createError(404));
})

// error handler : middleware pour le gestion d'erreur au sein d'application 
.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
    next()
})
.listen(process.env.PORT , () =>{
    console.log(`Lancement du serveur NODEJS  localement sur le port ${process.env.PORT} `);
})

module.exports = app;


