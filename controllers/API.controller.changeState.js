{{
const {Utilisateur} = require('../models/utilisateur.model')
const moment = require('moment')
const {TYPE_USER} = require('../models/utilisateur.model')
const {checkTypeObject} = require('../modules')

module.exports = {
    changeStateUser : (request , response) =>{
            if(request.body.userState == undefined ) return response.status(400).json({message : "Erreur de changement d'etat"})
            else {
                if(checkTypeObject(TYPE_USER , request.body.userState).status)
                {
                    if(request.body.userState == "Enqueteur") return response.status(200).json({message : "Vous ne pouvez pas etre enqueteur sans l'autorisation de l'administrateur"})
                    else {
                        
                        request.session.userState = request.body.userState 
                        console.log(request.session)
                        response.status(200).json({message : `Votre changement en tant que ${request.body.userState} a reussi`})
                        // define triggers 
                        setTimeout(() => {
                            // update les données du type après 1000000ms
                            console.log("Les données seront mises a jour dans  100000ms ... ");
                            setTimeout(() => {
                                Utilisateur.updateOne({_id : request.params.id},{
                                    type_user : request.body.userState
                                },async (err , result) =>{
                                        if(err) console.log("une erreur est survenue lors de la mise a jour ");
                                        else {
                                            let {type_user} = await Utilisateur.findById(request.params.id)
                                            console.log("Le type est : ", type_user);
                                            console.log(`Mis a jour de l'etat reussie`);}
                                })
                            }, 100000);
                        }, 10);
                    }
                }
                else return response.status(200).json({message : "ce type n'est pas definit "})
               
            }

    }
}
}}