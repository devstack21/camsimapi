const { Utilisateur } = require('../models/utilisateur.model')
const objectID = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')

module.exports = {
  
    checkAuthUser : (request , response , next) =>{
        if(request.method == 'POST' || request.method == 'PUT' || request.method == 'PATCH' ){
            if (Object.keys(request.params).length == 0) {
                if(Object.keys(request.headers).includes('Authorization')){
                    // verification de sa valeur 
                    if(request.headers['Authorization'].length == 0) return response.status(401).json({message : 'Erreur authentification'})
                    else jwt.verify(request.headers['Authorization'] , process.env.SECRET_TOKEN_DECODE , (err , decodedToken)=>{
                        if(err) return response.status(401).json({message : 'Erreur authentification'})
                        else{  
                            if(!objectID.isValid(decodedToken.id)) return response.status(401).json({message : 'Erreur authentification'})
                            else next()
                        }
                    })  
                }
                else return response.status(401).json({message : 'Erreur authentification'})   
            }
            else {
                if(!objectID.isValid(request.params.id)) return response.status(401).json({message : 'Aucune autorisation pour cet utilisateur'})
                else next()
            }
        }
        if(request.url == '/signup' || request.url== '/signin' || request.url=='/signuProducteur' && request.method ==  'POST') next()
        else next()
    }
}