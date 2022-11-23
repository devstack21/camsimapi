
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
            bcrypt.compare(request.body.mdp , user.mdp , (err , result) =>{
              if(err) return res.status(400).json({message : 'Mot de passe incorrect'})
              if (result) {
                response.cookie('authToken', generateToken(user._id) , {httpOnly : true , maxAge : maxAvailable})
                response.status(200).json({message : 'Connexion reussie'})
              }
              else return response.status(400).json({message : 'Mot de passe incorrect'})
            })
          }
          else return response.status(401).json({message :'Creer un compte'})

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
                  if(!err) response.status(200).json({message : 'Inscription reussie' , id : docs._id})
                  
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
