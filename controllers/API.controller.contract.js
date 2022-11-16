const {Utilisateur} = require('../models/utilisateur.model')
const Contract = require('../models/contract.model')

module.exports = {
    getMyContractById : async (req , res) =>{
        const user = await Utilisateur.findById(req.params.id)
        if(user) res.status(200).json({data : user.contractApply})
        else return res.status(401).json({message : null})
    },
    getAllContract : async (req , res) =>{
        res.status(200).json({data : await Contract.find()})
    },
}