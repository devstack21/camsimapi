const mongoose = require('mongoose')
const Schema = mongoose.Schema

// les differents type de qualité de l'huile 
exports.TYPE_PRODUIT = {
    0 : "premier choix",
    1 : "deuxieme choix",
    2 : "troisieme choix "
}

const produitSchema = new Schema({
    "nom": {
        type: String,
        required: true,
    },
    "nomVendeur": {
        type: String,
        required: true,
    },
    "region": {
        type: String,
    },
    "departement": {
        type: String,
    },
    "arrondissement": {
        type: String,
    },
    "localisationPl": {
        type: String,
       // required: true, *
    },
    "lieuDit": {
        type: String,
    },
    "conditionnement": {
        type: String,
        //required: true, * 
    },
    "quantité": {
        type: String,
        //required: true, *
    },
    "telephone": {
        type: String,
        //required: true,*
    },
    "prix": {
        type: String,
        //required: true, *
    },
}, {
    methods : {
        getTypesSchemaObject () {
            return 'produit'
        }
    }
},{ timestamps: true })

const produitModel = mongoose.model('produit' , produitSchema)
module.exports = produitModel