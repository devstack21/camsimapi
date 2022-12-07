const {Utilisateur} = require('../models/utilisateur.model')
const Contract = require('../models/contract.model')

module.exports = {
    // cette fonction permet d'afficher les contracts postulés par l'utilisateur
    getMyContractById : async (req , res) =>{
        // on recupère les données par rapport a l'id envoyé par le front end
        let user = await Utilisateur.findById(req.params.id) , contracts = []

        for(id of user.contractApply){
            let data = await Contract.findById(id)
            contracts.push(data)
        }
        if(user) res.status(200).json({data : contracts})
        else return res.status(401).json({message : 'Utilisateur inconnu'})
    },
    // cette fonction permet d'afficher tous les contracts crées par les producteurs et autres acteurs pouvant effectuer cette opération
    getAllContract : async (req , res) =>{
        res.status(200).json({data : await Contract.find()})
    },
    getContractCreateById : async (req , res) =>{

        let user = await Utilisateur.findById(req.params.id) , contracts = []
        
        for(id of user.ownContracts){
            let data = await Contract.findById(id)
            if(data == null) continue
            else contracts.push(data)
        }

        if(user)res.status(200).json({data : contracts })
        else return res.status(401).json({message : 'Utilisateur inconnu' })
        
    }
}