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
        if(date1.length == date2.length){
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

let d1 = "2022-02-30"
let d2 = "2022-01-21"

let s = this.compareDate(d1 , d2) 
console.log(s);

let moment = require('moment')
console.log(moment().format("MM-DD-YYYY"));