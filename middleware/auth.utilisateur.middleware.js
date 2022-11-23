const { Utilisateur } = require('../models/utilisateur.model')
const objectID = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')

module.exports = {
    authUserByToken : async (request , response , next) =>{
      if(await request.cookies.authToken){
            jwt.verify(await request.cookies.authToken , process.env.SECRET_TOKEN_DECODE , async (err , decodedToken) =>{
                    
                if(err) return response.status(400).json({message : 'Erreur authentification'})
                       
                else response.status(200).json({ message :'Compte existant', data : await Utilisateur.findById(decodedToken.id)}) 
            })
        }
        else response.status(401).json({message : 'Compte inexistant'})
            
        next()
    },

    checkAuthUser : (request , response , next) =>{
       
        // si aucun params
        if(request.url == '/signup' || request.url== '/signin' || request.url=='/signuProducteur'  ) next()
        else {
            
            if (Object.keys(request.params).length == 0) {
                
                    if(request.headers.authToken){
                        jwt.verify(request.headers.authToken , process.env.SECRET_TOKEN_DECODE , (err , decodedToken)=>{
                            if(err) response.status(401).json({message : 'Erreur authentification'})
                            else{  
                                if(!objectID.isValid(decodedToken.id)) {
                                    response.status(401).json({message : 'Erreur authentification'})
                                    next()
                                }
                                else next()
                            }
                        })
                    }
                    else {
                        response.status(401).json({message : 'Erreur authentification'})
                        next()
                    }
                }
                
            else {
                let {id} = request.params
                if(!objectID.isValid(id)) response.status(401).json({message : 'Aucune autorisation pour cet utilisateur'})
                else {}
                next()
            }
            
        } 
    }
}