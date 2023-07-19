const express = require('express');
const router = express.Router();
const {
    getAllProducts, 
    getTrendingProducts, 
    getRecommendedProducts,
    getNewArrivalProducts, 
    getFlashSaleProducts,
    updateFlashSale,
    deleteFlashSale
} = require('./controller')

router.get('/trending', getTrendingProducts);
router.get('/', getAllProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/new', getNewArrivalProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.put('/flash-sale', updateFlashSale);
router.delete('/:productId/flash-sale', deleteFlashSale);

module.exports = router;