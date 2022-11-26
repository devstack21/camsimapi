const mongoose = require('mongoose')
const TYPE_CONTRACT = {
    VENTE : Symbol('prix_fixe'),
    METAYAGE : Symbol('metayage')
}

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
           date : Date , 
           isOnContract : {
                type : Boolean,
                default : false 
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
contractSchema.pre('save' , function(next) {
    // si la quantite n'est pas un entier 
    if(isNaN(this.quantite)) throw Error('La quantite doit etre un entier')
    if(this.type_contract !== TYPE_CONTRACT.METAYAGE || this.type_contract !== TYPE_CONTRACT.FIXED) throw Error('Type de contract invalide')
    next()
})
const contractModel = mongoose.model('contract' , contractSchema)

module.exports = contractModel 