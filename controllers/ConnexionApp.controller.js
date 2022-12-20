
const {Utilisateur} = require('../models/utilisateur.model')
const bcrypt = require('bcrypt')
const {generateToken} = require('../modules')
// methode pour la gestion des erreurs de connexion
const {signUpErrors } = require('../utils/errors.connexion.utils')

module.exports = {
    signIn : async (request, response) => {
         
        // on recupère des données depuis la base de données 
        const user = await Utilisateur.findOne({username : request.body.username })
        
        // si l'utilisateur existe 
        if(user){
            bcrypt.compare(request.body.mdp , user.mdp , (err , result) =>{
              
              if(err) return res.status(400).json({message : 'Mot de passe incorrect'})
              if (result) response.status(200).json({message : 'Connexion reussie' , token :generateToken(user._id) , data : user})
              else return response.status(400).json({message : 'Mot de passe incorrect'})
              })
          }
        else return response.status(401).json({message :'Veuillez creer compte'}) 
         
    },
    
    signUp: async (request , response ) =>{
            const user = await Utilisateur.findOne({username : request.body.username , telephone : request.body.telephone ,})
            if(user) return response.status(200).json({message :  'Cet utilisateur existe déja'})
            else {
              const newUser = Utilisateur(request.body)
              newUser.save()
                .then(() => response.status(200).json({message : "Inscription reussie avec succès", _id : newUser._id}))
                .catch((err) => response.status(400).json({message : signUpErrors(err) }))
            }
      },
    signuProducteur : (req, res) => {
        // On vérifie l'existence des informations reçues
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
      },
      logout : (request , response) =>{
        //response.cookie('authToken' , {maxAge : 1})
        // delete token in request?header
        response.redirect('/')
      },
      
}
