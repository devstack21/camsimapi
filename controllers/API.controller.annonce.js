const Enchere = require('../models/enchere.model')
const Contract = require('../models/contract.model')
const Prix = require('../models/prix.model')
const Product = require('../models/produit.model')

const {getLastDataArray} = require('../modules')

module.exports = {
    // affichage des annonces 
    getAnnonceByTimeOrder : async (req, res) =>{
            const enchere = await Enchere.find() , contract = await Contract.find() ,achats = await Prix.find()
            const ventes = await Product.find()
            res.status(200).json({
                contracts : getLastDataArray(contract),
                achats : getLastDataArray(achats),
                encheres : getLastDataArray(enchere),
                ventes : getLastDataArray(ventes)
            })
    }
}

