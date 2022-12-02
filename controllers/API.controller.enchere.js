const Enchere = require('../models/enchere.model')
const { Utilisateur } = require('../models/utilisateur.model')

module.exports ={
   
      getParticularEnchereByNomSeller : async(req, res) => {

        res.status(200).json({data : await Enchere.find({ nomVendeur: req.params.nomVendeur })})
       
      },
      getAllEnchere : async (req , res) =>{
          res.status(200).json({data : await Enchere.find()})
      },
      getEnchereById : async (req ,res) =>{
        res.status(200).json({data : await Enchere.findById(req.params.enchereId)})
      },
      // mes encheres
      getMyEncheresById : async (req , res) =>{
          let user = await Utilisateur.findById(req.params.id) , encheres = []
          if(!Object.keys(user).includes('rencheres')) return res.status(400).json({data : []})
          else {
            for(id of user.rencheres){
              let data = await Enchere.findById(id)
              if(data instanceof Object) encheres.push(data)
              else {}
          }
            if(user) res.status(200).json({data : encheres})
            else return res.status(401).json({message : null})
          }
          
      },
}