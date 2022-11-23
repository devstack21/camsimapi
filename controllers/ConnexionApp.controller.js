
const {Utilisateur} = require('../models/utilisateur.model')
const bcrypt = require('bcrypt')
const {generateToken , maxAvailable} = require('../utils/jwt.utils')
const jwt = require('jsonwebtoken')

module.exports = {
    signIn : async (request, response) => {
        
        try {
          // on recupère des données depuis la base de données 
           const user = await Utilisateur.findOne({username : request.body.username })
           console.log(user);
          // si l'utilisateur existe 
          if(user){
            console.log('WTF');
            // verification du mot de passe 
            if(await bcrypt.compare(request.body.mdp , user.mdp)) {
              console.log(bcrypt.compare(request.body.mdp , user.mdp));
              response.status(200).json({message : 'Connexion reussie' , user : user})
              
            }
            else {
              console.log('NO MDP');
              throw Error('Mot de passe incorrect')
            }
          }
          // si l'utilisateur n'existe pas 
          else throw Error('Utilisateur inconnu')
        } catch (error) {
          // on arrete le fonction et on envoie une reponse a l'application cliente 
          return response.status(400).json({message : 'login incorrect'})
        }
       
    },
    signUp : async function (request, response) {
  
        try {
             // On vérifie l'existence des informations reçues
             const user = await Utilisateur.findOne({ username : request.body.username , telephone : request.body.telephone})
             if(user) return response.status(200).json({message : 'Cet utilisateur existe déja'})
             else {
                response.locals.user = null 
                const newUser = new Utilisateur(request.body)
                console.log(request.body);
                // save new user 
                newUser.save((err , docs) =>{
                  if(!err) {
                    // on cree un token qui sera stocké dans un cookie coté client 
                    response.cookie('authToken' , generateToken(docs._id) , {httpOnly : true , maxAvailable })
                    response.status(200).json({message : 'Inscription reussie' , id : docs._id})
                  }
                
                  else throw Error('Erreur survenue lors de l'/'inscription')
                })
              }
        } catch (error) {
            return response.status(400).json({message : error})
        }
      
      },
      signuProducteur : (req, res) => {
        // On vérifie l'existence des informations reçues
        try {
          Utilisateur.findOne(
            {
              username: req.body.username , telephone: req.body.telephone 
            },
            (error, result) =>{
              // Si une erreur survient
              if (error) throw Error('Une erreur est survenue lors de votre authentification');
              // Si le compte existe
              if (result ) {
                res.satus(200).json({ message: "already exist"});
              } else {
        
                const utilisateur = Utilisateur(req.body);
                utilisateur.save().then(function () {
                  res.status(200).json({  id: utilisateur._id });
                });
              }
            }
          );
        } catch (error) {
          return res.status(400).json({message : error})
        }
      
      },
      logout : (request , response) =>{
        response.cookie('authToken' , {maxAge : 1})
        response.redirect('/')
      },
      
}
