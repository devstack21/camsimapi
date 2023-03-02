const jwt = require('jsonwebtoken')
exports.maxAvailable = 60 * 24 * 60 * 60 * 1000

/**
 * @param {Object} object
 * @param {Array} userObjectIds
 * @returns {Promise}
 * @public
*/
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

/**
 * @param {String} date1
 * @param {String} date2
 * @returns {Boolean}
 * @public
*/
exports.compareDate = (date1 , date2 ) =>
    {   
        if(date1.length == date2.length || typeof date2 !="string"){
            let charac= new String() , characTmp=new String();
            for(let index = 0 ; index <=date1.length-1 ; index ++)
            {
                charac+=date2[index] , characTmp+=date1[index]
                if(date2[index] == "-"&& index<7)
                {            
                    if(parseInt(characTmp.slice(0 , index) , 10) < parseInt(charac.slice(0, index) , 10) ) return false 
                    return true
                }if(date2[index] == "-" && index == 7)
                {
                    if(parseInt(characTmp.slice(5 , index) , 10) < parseInt(charac.slice(5, index) , 10) ) return false 
                    return true            
                }if(index == date1.length-1){
                    if(parseInt(characTmp.slice(index-1,index+2) , 10) < parseInt(charac.slice(index-1,index+2) , 10)) return false 
                    return true
                      
                }
            }
        }
        else return false 
           
    }
/**
 * @param {Array } tab
 * @returns {Array} 
 * @public
 
*/
exports.getLastDataArray = (tab)=>{
    let temp = []
    // les objets nde sont pas si ancien 
    if(tab.length < 10) {
        for(let j = 1 ; j<=tab.length  ; j++){
            temp.push(tab[tab.length - j])
        }
        return temp 
    } 
    if(tab.length >= 10){
        for(let i=1 ; i<=10  ; i++){
                // console.log(tab[tab.length - i]);
                temp.push(tab[tab.length - i])
        }
       return temp 
    } 
}
/**
    * @param {String} id 
    * @returns {String}
    * @public
*/
exports.generateToken = (id) =>{
        return jwt.sign({
            id : id
        },
        process.env.SECRET_TOKEN_DECODE,{expiresIn : this.maxAvailable})
}
/**
 * @param {Object} globalType 
 * @param {String} typeObject
 * @returns {Object}
 * @public
*/
exports.checkTypeObject = (globalType , typeObject ) =>{
        for(let index in globalType){
            if(globalType[index] === typeObject || globalType[index].toLowerCase() == typeObject.toLowerCase()) return {status : true , index : index}
        }
        return {status : false , index: undefined} 
}

/**
 * @param {Object} typeObject
 * @returns {Object}
 * @public
*/
exports.getValueNotEmpty = (object) =>{
    
    let obj = {}
    for(let keys in object){
        if(object[keys].length !== 0) {
            //let value = object[keys].toLowerCase()
            // check le nombre element présent dans la données

            let value = object[keys].toLowerCase().replace(object[keys].toLowerCase()[0] , object[keys].toLowerCase()[0].toUpperCase())
            
            obj[keys] = value
            
        }
    }
    return obj
    
}

/**
 * @param {array} dataDB
 * @param {object | any} object
 * @returns {object | any} 
 * @public
 */
exports.checkValueIsEqualsElementNumber = (dataDB , object) =>{
    // les données de object seront en miniscule et les premiers elts de chqua element en majuscule 
    // tableau des clés de l'objet
    const keysObject = Object.keys(object) 
    let cmptDataDB = 0
    if(dataDB.length == 0 || keysObject.length == 0) throw Error('Le tableau dataDB ou object ne doit pas etre vide')
    else {
        for (let data of dataDB)
        {
            cmptDataDB++;
            console.log(`LA VALEUR ${cmptDataDB} -- >`, data);
            // on parcoure chaque element et on compare le nombre d'élement 
            // dataDB tableau des objets 
            // data objets in dataDB 
            let keysData = Object.keys(this.deleteKeysObject(data , "_id")) , cmptKey = 0 , cmptValue = 0 ,dataTmp = {} // données temporaires destinées pour une data 
            // verifier si les données du tableau de données ont les clés correpondant a l'objet
            for(let key of keysObject){
            
                // si la valeur correspondant a clé est un objet ???? !! 
                if(keysData.includes(key)) {
                    cmptKey++
                    dataTmp[key] = data[key]
                }
            }
            // si tous les champs existe et sont non vide 
            //verification de la valeur 
            if(keysObject.length == cmptKey)
            {
                // verification si la vriable dataTmp est != undefined 
                if(Object.keys(dataTmp).length !== 0){
                    for(let key in dataTmp)
                    {
                        if(dataTmp[key] !== undefined ){
                            let keyTmp = 0
                            // premiere valeur
                            // on parcourt tous les caractères de chaque object pour chaque clé (region  , departement , arrondissement)
                            for(let index=0 ; index<dataTmp[key].length ; index++)
                            {
                                console.log(`DATATMP --- >  INDEX = ${index} VALUE = ${dataTmp[key][index]}  KEY = ${key}`)
                                console.log(`OBJECT ---  > INDEX = ${index} VALUE = ${object[key][index]} KEY = ${key}`);
                                if(dataTmp[key][index] == object[key][index]) {
                                    keyTmp++
                                    console.log(`CMPT --- > ${keyTmp} INDEX ${index} VALUE = ${dataTmp[key][index]} KEY = ${key}`);
                                }

                            }
                            // au moins deux caractères un genre 
                            console.log(keyTmp ," -- ",object[key].length);
                            if(keyTmp == object[key].length || keyTmp == object[key].length-2  || keyTmp == object[key].length-1 ) {
                                cmptValue++
                                console.log(`VALUE OKAY = ${object[key]}`);
                            }
                        }
                        
                    }// end for 
                }
                
                // verification si les données des differentes clés correspondantes
                console.log("COMPT VALUE -- >  " , cmptValue);

                // si le nombre d'element pour le nombre de clé-valeur est ok
                if(cmptValue == Object.keys(dataTmp).length) {
                   console.log("La valeur ",dataTmp); 
                   return dataTmp
                }

            }
            

            console.log( `FIN DE ITERATION DATA${cmptDataDB} -- >` , data, ` \n`);

        }// end for 
        return []
    }
}

exports.deleteKeysObject = (object , key) =>{
    let result = {}
    if(object[key] == undefined) throw Error("this key isn't include in object")
    else {
        for(let ky in object){
            if(ky !== key ) result[ky] = object[ky]
        }
        return {} 
    }  
     
}
