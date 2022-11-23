
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enchereSchema = new Schema({
    "nom": {
        type: String,
        required: true,
    },
    "nomVendeur": {
        type: String,
        required: true,
    },
    "telephone": {

        type: String,
        //required: true, *
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

    "lieuDit": {
        type: String,
    },
    "conditionnement": {
        type: String,
       // required: true, *
    },
    "quantite": {
        type: String,
        //required: true, *
    },
    "ticket": {
        type: String,
        //required: true,
    },

    "participant": {
        type: [{
            userId : String,
            prix : String,
            anonyme : Boolean  ,
            telephone : String,
            username : String
        }],
        //required : true* 
        unique : true
    },
    "dateDebut": {
        type: String,
        //required: true
    },
    "dateFin": {
        type: String,
       // required: true *
    }
},


    { timestamps: true })

const enchereModel = mongoose.model('Enchere' , enchereSchema)

module.exports = enchereModel