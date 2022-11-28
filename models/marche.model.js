const mongoose = require('mongoose')
const Schema = mongoose.Schema

const marcheSchema = new Schema({
    "nom": {
        type: String,
        required: true,
        unique: true,
    },
    "latitude": {
        type: Number,
        //required: true, * 
        unique: true,
    },
    "longitude": {
        type: Number,
        //required: true, * 
        unique: true,
    },
    "altitude": {
        type: Number,
        required: false,
    },
    "description": {
        type: String,
       // required: false, *
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
        required: true, 
    },
}, {
    methods : {
        getTypesSchemaObject () {
            return 'marche'
        }
    }
},{ timestamps: true })

const marcheModel = mongoose.model('marche' , marcheSchema)

module.exports = marcheModel