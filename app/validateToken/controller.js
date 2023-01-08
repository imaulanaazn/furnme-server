const jwt = require('jsonwebtoken');
const config = require('../../config');
module.exports = {
    validateToken : async (req,res)=>{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = atob(token)
        try{
            const decode = jwt.verify(decodedToken, config.jwtKey, (error, decoded)=>{
                if(decoded){
                    res.status(200).json({isTokenValid:true,message: 'token valid'});
                }else{
                    res.status(401).json({isTokenValid:false,message: 'token invalid'});
                }
            })
        }catch(err){
            res.status(400).json({err});
        }
    }
}