const express = require('express');
const router = express.Router();
const {getAllProducts, getTrendingProducts, getRecommendedProducts} = require('./controller')

router.get('/trending', getTrendingProducts);
router.get('/', getAllProducts);
router.get('/recommended', getRecommendedProducts);

module.exports = router;