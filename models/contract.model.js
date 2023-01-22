const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({

    // l'id du producteur qui publie le contract
    vendeurId : {
        type : String,
        required : true ,
    },
    nomVendeur : {
        type : String,
        
    },
    nom : {
        type : String ,
    
    },
    ticket : {
        type : String
    },
    region : {
        type : String,
        // required : true *
    },
    departement: {
        type: String,
        // required : true *
    },
    arrondissement: {
        type: String,
        // required : true *
    },
    lieuDit: {
        type: String,
        // required : true *
    },
    conditionnement: {
        type: String,
       // required: true, *
    },
    quantite: {
        type: Number ,
        //required: true, *
    },

    description : {
        type : String
    },
    interested : {
        type : [Object],
    },
    type_contract : {
        type : String,
        

    },
    superficie : {
        type : String
    }
},
{
    methods : {
        getTypesSchemaObject () {
            return 'contrat'
        }
    }
},
{
    timestamps : true,
    
})

const contractModel = mongoose.model('contrat' , contractSchema)

module.exports = contractModel 
