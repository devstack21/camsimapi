const mongoose = require('mongoose')
let Marche = require('./marche.model')
const Schema = mongoose.Schema

const prixSchema = new Schema({
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
        required: true,
    },
    "isValidated": {
        type: Boolean,
        required: true,
        default: false,
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
    "marche": {
        type: Object,
        required: true,
    },
}, { timestamps: true })

const prixModel = mongoose.model('prix' ,prixSchema)
module.exports = prixModel