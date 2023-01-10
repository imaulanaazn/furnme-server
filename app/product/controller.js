const Product = require('./model.js');
module.exports = {
    getAllProducts: async (req,res)=>{
        try{
            const products = await Product.find()
            res.status(200).json({data:products})
        }catch(err){
            res.status(500).json(err)
        }
    },
    getProduct: async (req,res)=>{
        const {id} = req.params;
        try {
            const product = await Product.findById(id)
            res.status(200).json({data: product})
        } catch (err) {
            res.status(500).json(err)
        }
    }
}