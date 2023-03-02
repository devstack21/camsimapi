const mongoose = require('mongoose')
const Schema = mongoose.Schema

const marcheSchema = new Schema({
    "nom": {
        type: String,
        required: true,
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
    "createdAt":{
        type : String
    }
}, {
    methods : {
        getTypesSchemaObject () {
            return 'marche'
        }
    }
},{ timestamps: true })

marcheSchema.pre('save' , async function (next){
    this.createdAt = moment().format("MM-DD-YYYY")
    next()
})
const marcheModel = mongoose.model('marche' , marcheSchema)

module.exports = marcheModel