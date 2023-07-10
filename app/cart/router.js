const express = require('express');
const router = express.Router();

const {getCart, addToCart, removeFromCart} = require('./controller');

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', removeFromCart);

module.exports = router;