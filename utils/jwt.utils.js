const jwt = require('jsonwebtoken')
const maxAvailable = 60 * 24 * 60 * 60 * 1000
module.exports = {
    /**
     * @param {String} id 
     * @return {String}
     * @private
    */
    generateToken : (id) =>{
        return jwt.sign({
            id : id
        },
        process.env.SECRET_TOKEN_DECODE,{expiresIn : maxAvailable})
    },
    maxAvailable
}