const {Utilisateur} = require('../models/utilisateur.model')
const Contract = require('../models/contract.model')

module.exports = {
    // cette fonction permet d'afficher les contracts postulés par l'utilisateur
    getMyContractById : async (req , res) =>{
        // on recupère les données par rapport a l'id envoyé par le front end
        const user = await Utilisateur.findById(req.params.id)
        if(user) res.status(200).json({data : user.contractApply})
        else return res.status(401).json({message : null})
    },
    // cette fonction permet d'afficher tous les contracts crées par les producteurs et autres acteurs pouvant effectuer cette opération
    getAllContract : async (req , res) =>{
        res.status(200).json({data : await Contract.find()})
    },
}