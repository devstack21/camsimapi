const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const utilisateurSchema = new mongoose.Schema({
    "username": {
        type: String,
        required: true,
        unique: true,
    },
    "nom": {
        type: String,
       // required: true, *
        unique: false,
    },
    "prenom": {
        type: String,
        required: false,
        unique: false,
    },
   
    "telephone": {
        type: String,
        required: true,
        unique: true,
    },
    "genre": {
        type: String,
       // required: true, µ
    },
    "mdp": {
        type: String,
        required: true,
    },
    "statut": {
        type: String,
        //required: true,
    },
    "isActive": {
        type: Boolean,
        default: false,
    },
    "enqueteur": {
        type: Boolean,
        required: false, // *
        default: false,
    },
    "isController": {
        type: Boolean,
        required: false, //*
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
    "preferencesMarches": {
        type: Array,
        default: [],
    },
    "categorie": {
        type: Array,
       // required : true, *
    },
    // la liste de toutes les enchères rencheries 
    "rencheres":{
        type :[{
            enchereId : String,
            date : Date
        }],
        unique : true
    },
    // liste propres enchères
    "ownEncheres" : {
        type : [String], // liste de tous les id de ses differentes enchères
        unique : true // on definit par défaut une liste 
    },
    // liste propres contracts 
    "ownContract" : {
        type : [String],
        unique : true
    },
    // liste de toutes les contracts postulés
    "contractApply" : {
        type : [String],
        unique : true
    },
    // lors de creation d'un achat 
    "ownAchats" : {
        type : [String],
        unique : true 
    },
    "ownVentes" : {
        type : [String],
        unique : true 
    }
}, { timestamps: true })

// hashage automatique des mdp lorsque la fonction save est utilisée
utilisateurSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt()
    this.mdp = await bcrypt.hash(this.mdp , salt)
    console.log(this.mdp);
    next()
})

const utilisateurModel = mongoose.model('utilisateur' , utilisateurSchema)

module.exports = {
    Utilisateur : utilisateurModel,
    Schema : utilisateurSchema
}