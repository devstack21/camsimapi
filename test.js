
exports.getDataById = async (object , userObjectIds ) =>{
    let model = object.getTypesSchemaObject() , result = [] , cmpt = 0
    const TYPE_MODEL = require(`./models/${model}.model`) 
    for(id of userObjectIds){
        cmpt++
        let data = await TYPE_MODEL.findById(id)
        if(Object.keys(data).keys !== 0) result.push(data)
        else {
            result = []
            break
        }
    }
    return new Promise((resolve , reject) =>{
        if(result.length == 0) reject(`Error Query[${cmpt}]`)
        else resolve(result)
    })
}
