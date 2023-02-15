const mongoose = require('mongoose')
const Schema = mongoose.Schema


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
    "quantite": {
        type: String,
        //required: true, *
    },
    "qualite" : {
        type : String
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