const express = require('express');
const router = express.Router();
const {getAllProducts, getTrendingProducts} = require('./controller')

router.get('/trending', getTrendingProducts);
router.get('/', getAllProducts);

module.exports = router;