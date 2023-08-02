const express = require('express');
const router = express.Router();
const {
    getAllProducts, 
    getProductById,
    getTrendingProducts, 
    getRecommendedProducts,
    getNewArrivalProducts, 
    getFlashSaleProducts,
    updateFlashSale,
    deleteFlashSale
} = require('./controller')

router.get('/trending', getTrendingProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/new', getNewArrivalProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.put('/flash-sale', updateFlashSale);
router.get('/:productId', getProductById);
router.delete('/:productId/flash-sale', deleteFlashSale);
router.get('/', getAllProducts);

module.exports = router;