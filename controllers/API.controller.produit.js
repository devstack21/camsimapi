const Produit = require('../models/produit.model')
const { Utilisateur } = require('../models/utilisateur.model')

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
        if(!Object.keys(user).includes('ownVentes')) return res.status(400).json({data : []})
        for(id of user.ownVentes){
          let data = await Produit.findById(id)
          products.push(data)
      }
        if(user) res.status(200).json({data : products})
        else return res.status(400).json({message : null})
      }
}