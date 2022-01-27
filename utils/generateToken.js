const jwt = require('jsonwebtoken');
const env = require('../config/env');


const generateToken = (id) =>{
    return jwt.sign({id},env.jwt_secert,{
        expiresIn:'30d'
    })
}

module.exports = generateToken;