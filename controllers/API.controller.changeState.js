
const {Utilisateur} = require('../models/utilisateur.model')
const moment = require('moment')
const {TYPE_USER} = require('../models/utilisateur.model')
const {checkTypeObject} = require('../modules')

exports.changeStateUser = (request , response) =>{
    if(request.body.userState == undefined ) return response.status(400).json({message : "Erreur de changement d'etat"})

    else {
        // si le type envoyé correspond aux differents status possibles de l'utilisateur 
        if(checkTypeObject(TYPE_USER , request.body.userState).status){
            if(request.body.userState == "enqueteur")  return response.status(200).json({message : "Vous ne pouvez pas etre enqueteur sans l'autorisation de l'administrateur"})
            req.session = {userState : request.body.userState , date: moment.format("MM-DD-YYYY")}
            response.status(200).json({message : `Votre changement en tant que ${request.body.userState} a reussi`})
            // define triggers
            setTimeout(() => {
                // update les données du type après 1000000ms
                console.log("Les données seront mises a jour dans 1000000ms ... ");
                Utilisateur.updateOne({_id : request.params.id},{
                    type_user : request.body.userState
                },(err , result) =>{
                        if(err) console.log("une erreur est survenue lors de la mise a jour ");
                        else console.log(`Mis a jour de l'etat reussie`);
                })
            },1000000);
        }
        else return response.status(200).json({message : "ce type n'est pas definit "})
    }
   
}