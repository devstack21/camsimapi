const Enchere = require('../models/enchere.model')
const { Utilisateur } = require('../models/utilisateur.model')

module.exports ={
    getAllEnchereByNomEnchere :  (req, res) => {

        Enchere.find({ nom: req.params.nomEnchere })
          .then((enchere) => {
      
            res.status(200).json({data : enchere})
          }).catch((error) => {
            res.status(400).json({message :error})
          })
      },
      getParticularEnchereByNomSeller : (req, res) => {

        Enchere.find({ nomVendeur: req.params.nomVendeur })
          .then((enchere) => {
      
            res.status(200).json({data: enchere})
            
          }).catch((error) => {
            res.status(400).json({message : error})
          })
      },
      getAllEnchere : async (req , res) =>{
          res.status(200).json({data : await Enchere.find()})
      },
      getEnchereById : async (req ,res) =>{
        res.status(200).json({data : await Enchere.findById(req.params.enchereId)})
      },
      // mes encheres
      getMyEncheresById : async (req , res) =>{
          const user = await Utilisateur.findById(req.params.id)
          if(user) res.status(200).json({data : user.rencheres})
          else return res.status(401).json({message : null})
      },
}