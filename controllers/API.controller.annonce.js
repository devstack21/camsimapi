const {Utilisateur} = require('../models/utilisateur.model')
const Enchere = require('../models/enchere.model')
const Contract = require('../models/contract.model')
const Prix = require('../models/prix.model')
const Product = require('../models/produit.model')

// defintion du module lodash 
const _ = require('lodash')

/**
 * @param {Array } tab
 * @return {Array} 
 * @private
 
*/
const getLastDataArray = (tab)=>{
    let temp = []
    // les objets nde sont pas si ancien 
    if(tab.length < 10) {
        for(let j = 1 ; j<=tab.length  ; j++){
            temp.push(tab[tab.length - j])
        }
        return temp 
    } 
    if(tab.length >= 10){
        for(let i=1 ; i<=10  ; i++){
                // console.log(tab[tab.length - i]);
                temp.push(tab[tab.length - i])
        }
       return temp 
    } 
}


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

