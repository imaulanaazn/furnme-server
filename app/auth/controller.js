module.exports = {
    googleAuth: async (req,res)=>{
        console.log(req.body)
    },
    signup: async (req,res)=>{
        res.send('this is signup')
    },
    signin: async (req,res)=>{
        res.send('this is sigin')
    }
}