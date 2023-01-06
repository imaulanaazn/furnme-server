const jwt = require('jsonwebtoken');
const { jwtKey } = require('../../config');
const config = require('../../config');
const User = require('./model')
module.exports = {
    googleauth: async (req,res)=>{
        const {name,picture,email} = req.body;
        const googleData = req.body;
        try{
            await User.findOne({email})
            .then(async(user)=>{
                // WHEN USER NOT EXIST THEN SAVE THE DATA TO THE DATABASE AND MAKE JWT TOKEN OUT OF IT
                if(!user){
                    const newUser = await new User({name,picture,email,googleData})
                    await newUser.save()
                    delete newUser._doc.password
                    const token = jwt.sign({
                        id:newUser._id,
                        name:newUser.name,
                        picture:newUser.picture,
                        email:newUser.email,
                        googleData:newUser.googleData
                    }, config.jwtKey)
                    res.status(201).json({message: 'user signup success',data:{token}})
                }else{
                    if(user.password){
                        res.status(401).json({message: "your account was registered with email and password, try to login with email and password instead"})
                    }
                    // WHEN USER EXIST THEN CREATE JWT TOKEN BASED ON USER DATA
                     const token = jwt.sign({
                        id:user._id,
                        name:user.name || "",
                        picture:user.picture || "",
                        email:user.email,
                        googleData:user.googleData || ""
                    }, config.jwtKey)
                    res.status(200).json({message:"user logged in",data:{token}})
                }
            }).catch((err)=>{
                console.log(err)
            })
        }catch(err){
            if(err && err.name === "ValidationError"){
                return res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors
                })
            }
            console.log(err)
        }
    },
    signup: async (req,res)=>{
        const {username,email,password} = req.body;
        try{
            const user = await User.findOne({email});
            if(user){
                res.status(409).json({message: "email already registered"})
            }else{
                const newUser = await new User({name:username,email,password})
                await newUser.save()
                delete newUser._doc.password
                const token = jwt.sign({
                    id:newUser._id,
                    name:newUser.name || "",
                    picture:newUser.picture || "",
                    email:newUser.email,
                    googleData:newUser.googleData || ""
                }, config.jwtKey)
                res.status(201).json({message: "user signup success", data:{token}})
            }
        }catch(err){
            console.log(err)
        }
    },
    signin: async (req,res)=>{
        const {email,password} = req.body;
        try{
            const user = await User.findOne({email});
            if(!user){
                res.status(404).json({message: "user dengan email tersebut tidak ditemukan, silahkan registrasi untuk melanjutkan"})
            }else{
                const checkPassword = password === user.password;
                if(checkPassword){
                    const token = jwt.sign({
                        id:user._id,
                        name:user.name || "",
                        picture:user.picture || "",
                        email:user.email,
                        googleData:user.googleData || ""
                    },config.jwtKey)
                    res.status(200).json({message: "login succes", data:{token}})
                }else{
                    if(!user.password){
                        res.status(401).json({message: "your account was registered with google auth, try to login with google auth instead"})
                    }
                    res.status(401).json({message: "password yang anda masukkan salah"})
                }
            }
        }catch(err){
            console.log(err)
        }
    }
}