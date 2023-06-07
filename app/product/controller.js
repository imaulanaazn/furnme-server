const Product = require('./model.js');
module.exports = {
    getAllProducts: async (req,res)=>{
        try{
            const products = await Product.find()
            res.status(200).json(products)
        }catch(err){
            res.status(500).json(err)
        }
    }
}