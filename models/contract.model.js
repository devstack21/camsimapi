const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({

    // l'id du producteur qui publie le contract
    vendeurId : {
        type : String,
        required : true 
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
    interested : {
        type : [{
           interestedId : String ,
           date : String , 
           isOnContract : {
                type : Boolean,
                default : false 
           }
        }],
        unique : true 
    }
},
{
    timestamps : true,
    
})
contractSchema.pre('save' , function(next) {
    // si la quantite n'est pas un entier 
    if(isNaN(this.quantite)) throw Error('La quantite doit etre un entier')
    next()
})
const contractModel = mongoose.model('contract' , contractSchema)

module.exports = contractModel 