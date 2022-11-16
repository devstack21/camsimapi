const createError = require('http-errors'); // module pour la gestion des erreurs HTTP
const express = require('express'); // you know 
const path = require('path'); // module de gestion des differents aux fichiers serveur 
const logger = require('morgan'); // module pour les logs des données du front 
const bodyParser = require('body-parser')// module pour parse des req client
// definition des variables d'environnement 
require('dotenv').config({path : './config/.env'})
const cors = require('cors') // module porur la configuration des accèes au serveur 
// const corsOptions = {
//     "origin" : process.env.URL_CLIENT,
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 200
// }

// definition des differentes routes d'accès au API 
//const simwebRouter = require('./routes/sim_web/sim_web') ; 
const camsimRoutes = require('./routes/CAMSIM.API.routes') 


// definition de l'app server 
const  app = express();

//lancement de la connexion a la base de donnée mongodb 
const {connectionMongodServer} = require('./config/database.connectMongodb')
connectionMongodServer()

app
.use(cors({
    "origin" : '*'
}))
.use(bodyParser.json())
.use(bodyParser.urlencoded({
    extended :true
}))
.get('/' , (req , res) => res.send('</p>Hello world<p>'))
// view engine setup
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

.use(logger('dev'))
.use(express.json())
.use(express.urlencoded({ extended: false }))
.use(express.static(path.join(__dirname, 'public')))

.use('/API' , camsimRoutes) // definition de l'objet global camsimRoutes indexant toutes les routes de l'application Web & Mobile

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
// 
.listen(process.env.PORT , () =>{
    console.log(`Lancement du serveur NODEJS  localement sur le port ${process.env.PORT} `);
})
module.exports = app;


// suivi et evaluation de projet 
// certification PEAS de l'UNICEF
// developpement communautaire 
