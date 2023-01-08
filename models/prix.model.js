const mongoose = require('mongoose')
let Marche = require('./marche.model')
const Schema = mongoose.Schema

const prixSchema = new Schema({
    // nom du produit 
    "nom": {
        type: String,
        required: true,
    },
    "idEnqueteur": {
        type: String,
        required: true,
    },
    "nomenqueteur": {
        type: String,
        required: false,
    },
    "numeroEnqueteur": {
        type: String,
        //required: true,
    },
    "isValidated": {
        type: Boolean,
        default: false,
    },
    "qualite_produit" : {
        type : String 
    },
    "conditionnement": {
        type: String,
        required: true,
    },
    "description": {
        type: String,
        required: false,
    },
    "prix_marche": {
        type: Number,
        required: true,
    },
    "prix_bordChamp": {
        type: Number,
    },
    "prix_avantMaturite": {
        type: Number,
    },
    // id du marché
    "marche": {
        type: Object,
       // required: true,
    },
}, {
    methods : {
        getTypesSchemaObject () {
            return 'prix'
        }
    }
},{ timestamps: true })

const prixModel = mongoose.model('prix' ,prixSchema)
module.exports = prixModel