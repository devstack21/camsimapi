const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({

    // l'id du producteur qui publie le contract
    vendeurId : {
        type : String,
        required : true 
    },
    nomVendeur : {
        type : String,
        
    },
    nom : {
        type : String ,
        required : true
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
    price : {
        type : String 
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
        type : [{
           interestedId : String , 
           isOnContract : {
                type : Boolean,
                default : false ,
                unique : true
           },
           prix : String,
           username : {
            type : String
           }
        }],
        unique : true 
    },
    type_contract : {
        type : String,
        required : true 

    },
    superficie : {
        type : String
    }
},
{
    timestamps : true,
    
})

const contractModel = mongoose.model('contract' , contractSchema)

module.exports = contractModel 