const express = require('express');
const router = express.Router();
const {getAllProducts,getProduct, 
    getTopRatedProducts, getProductsByCategory, 
    getProductsByLabel, getDiscountedProducts
} = require('./controller')

router.get('/',getAllProducts)
router.get('/toprated', getTopRatedProducts)
router.get('/categories',getProductsByCategory)
router.get('/label',getProductsByLabel)
router.get('/discount',getDiscountedProducts)
router.get('/:id',getProduct)

module.exports = router;