const Product = require('./model.js');
module.exports = {
    getAllProducts: async (req,res)=>{
        try{
            const products = await Product.find()
            res.status(200).json(products)
        }catch(err){
            res.status(500).json(err)
        }
    },
    getProduct: async (req,res)=>{
        const {id} = req.params;
        try {
            const product = await Product.findById(id)
            res.status(200).json(product)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    getTopRatedProducts: async (req,res)=>{
        try {
            const topRatedProducts = await Product.find().limit(6).sort( { rating: -1 } )
            res.status(200).json(topRatedProducts)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    getProductsByCategory: async (req,res)=>{
        const category = req.query.category
        const discounted = req.query.discounted
        try {
            if(discounted){
                const discountedProductByCategory = await Product.find({$and : [
                    {categories:category},
                    {discount : {$gt : 0}}
                ]})
                res.status(200).json(discountedProductByCategory)
            }else{
                console.log(category)
                const productByCategory = await Product.find({categories:category})
                res.status(200).json(productByCategory)
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },
    getProductsByLabel: async (req,res)=>{
        const label = req.body.label
        console.log(label)
        try {
            const productByLabel = await Product.find({label:label}).limit(6)
            res.status(200).json(productByLabel)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    getDiscountedProducts: async (req,res)=>{
        try {
            const productByLabel = await Product.find({discount : {$gt : 0}})
            res.status(200).json(productByLabel)
        } catch (err) {
            res.status(500).json(err)
        }
    },
}