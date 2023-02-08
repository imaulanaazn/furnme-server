const jwt = require('jsonwebtoken');
const config = require('../../config');
module.exports = {
    isUserLogin : async (req,res,next)=>{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            res.status(401).json({error:  'Not authorized to acces this resource'});
        }else{
            try{
                const decode = jwt.verify(token, config.jwtKey, (error, decoded)=>{
                    if(decoded){
                        next();
                    }else{
                        res.status(401).json({error:  'Not authorized to acces this resource'});
                    }
                })
            }catch(err){
                console.log(err)
                res.status(400).json({err:err});
            }
        }
    }
}