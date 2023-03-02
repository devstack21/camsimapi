const mongoose = require('mongoose')
const moment = require('moment')
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
    // la qualite du produit 
    "qualite" : {
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
    "createdAt" : {
        type : String
    }
    
}, {
    methods : {
        getTypesSchemaObject () {
            return 'prix'
        }
    }
},{ timestamps: true })

prixSchema.pre('save' , async function (next){
    this.createdAt = moment().format("")
})
const prixModel = mongoose.model('prix' ,prixSchema)
module.exports = prixModel