const Marche = require('../models/marche.model')

module.exports = {
    addPricesById : (req, res) => {
        try {
          Marche.findOne({ nom: req.body.nomMarche, arrondissement: req.body.arrondissement }, (error, marche) => {
            // Si une erreur survient
            if (error) throw Error('Une erreur est survenue lors de la sauvegarde');
            // Si le marché n'existe pas
            if (!marche) {
              //On enregistre le produit
              const prix = Prix(req.body)
              prix.save().then(() => {
                res.status(200).json({ message: 'Prix enregistré!', status: true });
              })
            } else {
              res.status(200).json({ message: "Ce marché est deja repertorié!", status: false });
            }
          });
        } catch (error) {
          return res.status(400).json({message : error})
        }
       
      },
      getAllMarche : async (req , res) =>{
        res.status(200).json({data : await Marche.find()})
      }
 }