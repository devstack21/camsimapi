const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const TYPE_USER = {
    0 : "Consommateur",
    1 : "Producteur",
    2 : "Enqueteur",
    3 : "Controleur",
    4 : "Revendeur"
}
const moment = require('moment')

const utilisateurSchema = new mongoose.Schema({
    "username": {
        type: String,
        required: true,
        unique: true,
    },
    "nom": {
        type: String,
       required: true,
        unique: false,
    },
    "prenom": {
        type: String,
        required: false,
    },
   
    "telephone": {
        type: String,
        required: true , 
        unique: true,
    },
     
    "genre": {
        type: String,
       // required: true, µ
    },
    "mdp": {
        type: String,
        required: true ,
    },
    // type d'un utilisateur cad si il est producteur - consommateur etc ..
    "type_user": {
        type: String,
        //required: true,
    },
    "isActive": {
        type: Boolean,
        default: false,
    },
    "region": {
        type: String,
        //required: true, * 
    },
    "departement": {
        type: String,
        //required: true, * 
    },
    "arrondissement": {
        type: String,
        //required: true, *
    },
    "regionPl": {
        type: String,
        default: "",
    },
    
    "departementPl": {
        type: String,
        default: "",
    },
    "arrondissementPl": {
        type: String,
        default: "",
    },
    "superficiePl": {
        type: Number,
        default: 0,
    },

    "lieuDit": {
        type: String,
    },
    // liste de marché de preference 
    "preferencesMarches": {
        type: Array,
        default: [],
    },
    // categorie de produit :huile cacao etc 
    "categorie": {
        type: Array,
       // required : true, *
    },
    // la liste de toutes les enchères rencheries par this utilisateur 
    "rencheres":{
        type :[String],
    },
    // liste de toutes les contracts postulés a this utilisateur 
    "contractApply" : {
        type : [String],
    },

    // liste des enchères propres a this utilisateur 
    "ownEncheres" : {
        type : [String], // liste de tous les id de ses differentes enchères
    },
    // liste des contracts propres a this utilisateur 
    "ownContracts" : {
        type : [String],
    },
    // liste des achats propres a this utilisateur
    "ownAchats" : {
        type : [String],
    },
    // liste des ventes propres a this utilisateur 
    "ownVentes" : {
        type : [String],
    },
    "createdAt" : {
        type : String 
    }
},{
    methods : {
        getTypesSchemaObject () {
            return 'utilisateur'
        }
    },
},{ timestamps: true })

// hashage automatique des mdp lorsque la fonction save est utilisée
utilisateurSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt()
    this.mdp = await bcrypt.hash(this.mdp , salt)
    console.log(this.mdp);
    this.createdAt= moment().format("MM-DD-YYYY")
    next()
})

const utilisateurModel = mongoose.model('utilisateur' , utilisateurSchema)

module.exports = {
    Utilisateur : utilisateurModel,
    Schema : utilisateurSchema,
    TYPE_USER
}