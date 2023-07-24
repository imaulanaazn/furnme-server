const express = require('express');
const router = express.Router();

const {getCart , addToCart, removeFromCart} = require('./controller');
const {authenticateJWT} = require('../utils/controller');

router.get('/', authenticateJWT, getCart);
router.post('/', authenticateJWT, addToCart);
router.delete('/?', authenticateJWT, removeFromCart);

module.exports = router;