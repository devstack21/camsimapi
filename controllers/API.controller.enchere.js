const Enchere = require('../models/enchere.model')

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
}