const Prix = require('../models/prix.model')

module.exports = {

    getAllPricesByNameProduct : (request, response) => {
  
        Prix.find({ nom: request.params.nomProduit, isValidated: true })
          .then((prix) => {
            response.status(200).json(prix)
          })
          .catch((error) => { response.status(500).send(error) })
      },
      getUnvalitedPricesByNameProduct : (req, res) => {
        //On récupère les prix en attente de validation dans la bd pour les envoyer à l'application mobile
        Prix.find({ nom: req.params.nomProduit, isValidated: false })
          .then((prix) => {
            res.json(prix)
          })
          .catch((error) => { res.status(500).json(error) })
      },

      getAllPriceByHuileAndFilter : (req, res) => {
        //On récupère les prix de la bd pour les envoyer à l'application mobile
        Prix.findOne({ conditionnement: req.body.conditions, marche: req.body.marche })
          .then((prix) => {
            console.log(prix);
            res.status(200).json(prix);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send(error);
          });
      },
      getAllPrice : async (req , res) =>{
            //On récupère les prix validés de la bd pour les envoyer à l'application mobile
          Prix.find()
          .then((prix) => {
            res.status(200).json(prix);
          })
          .catch((error) => {
            res.status(500).send(error);
          });
          
      },
      getPriceByName : (req , res) =>{
          Prix.findOne({nom : req.params.namePrice})
          .then((data) => res.status(200).json({data : data}))
          .catch((err) => res.status(400).json({message : err}))
      },
      // mes achats 
      getMyPriceById : async (req , res) =>{
        const user = await Utilisateur.findById(req.params.id)
        if(user) res.status(200).json({data : user.ownAchats})
        else return res.status(400).json({message : null})
      }
}