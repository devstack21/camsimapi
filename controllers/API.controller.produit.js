const Produit = require('../models/produit.model')
const { Utilisateur, TYPE_USER } = require('../models/utilisateur.model')
const {checkTypeObject} = require('../modules')
const lodash = require('lodash')
const {getValueNotEmpty} = require('../modules')

// rechercher un produit dans un marché donné

module.exports = {

    getAllProductByNomProduct : (req, res) => {
        Produit.find({ nom: req.params.nomProduit })
          .then((produits) => {
            res.status(200).json({data :produits})
          })
          .catch((error) => { res.status(500).json({message :error}) })
      },
    getAllProductsByNomProduitAndNameSeller : (req, res) => {
        //On récupère les produits d'un utilisateur précis pour envoyer à l'application mobile
      
        Produit.find({ nom: req.params.nomProduit, nomVendeur: req.params.nomVendeur })
          .then((produits) => {
            res.status(200).json(produits)
          })
          .catch((error) => { res.status(500).json(error) })
      },
      
    getMyProductsById : async (req , res) =>{
        let user = await Utilisateur.findById(req.params.id) , products= []
        for(id of user.ownVentes){
          let data = await Produit.findById(id)
          if(data == null) continue
          else products.push(data)
      }
        if(user) res.status(200).json({data : products})
        else return res.status(400).json({message : null})
      },

      
        // fonction d'ajout d'un produit (achat vente)
    addProductById : (req, res) => {
      Utilisateur.findById(req.params.id, (error, producteur) => {
        // Si une erreur survient
        if (error) return res.status(400).json({message :'Une erreur est survenue lors de la sauvegarde'});
        // Si le marché n'existe pas 
        if (producteur) {
          //On enregistre le produit
          const produit = Produit(req.body)
          produit.save().then(() => {
            Utilisateur.updateOne({_id : req.params.id} , {
              $push : {ownVentes : produit._id}
            },(err , result ) =>{
              if(err) return res.status(400).json({message : 'Une erreur est survenue lors de la sauvegarde'})
              if(result.acknowledged) res.status(200).json({message : 'Produit enregistré avec succès' , prixId : produit._id})
            })
          })
        } else {
          res.status(200).json({ message: "Ce producteur n'est pas repertorié!", status: false });
        }
    });
  },
  modifyProductPriceByIdAndProduitId : (req, res) => {
    Produit.findByIdAndUpdate(
      req.params.produitId, { prix: req.body.prix },
      (err, doc) => {
        if (err) return res.status(400).json({message :'Une erreur est survenue lors de la modification'})
        else res.status(200).json({ status: true , message : "prix modifié avec succès"});
      }
    );
  
  },
  // recherche filtre achat /vente 
  getAchatVenteRegionDepartement : async (req ,res) =>{
    let obj = getValueNotEmpty(req.body)
    if(Object.keys(obj).length !== 0) return res.status(200).json({data : await Produit.find(obj)})
    else return res.status(200).json({message : "Veuiilez remplir au moins un champ"})

  }
  
}