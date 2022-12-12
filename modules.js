const jwt = require('jsonwebtoken')
exports.maxAvailable = 60 * 24 * 60 * 60 * 1000
/**
 * @param {Object} object
 * @param {Array} userObjectIds
 * @return {Promise}
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
 * @return {Boolean}
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
 * @return {Array} 
 * @private
 
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
    * @return {String}
    * @private
*/
exports.generateToken = (id) =>{
        return jwt.sign({
            id : id
        },
        process.env.SECRET_TOKEN_DECODE,{expiresIn : this.maxAvailable})
}

