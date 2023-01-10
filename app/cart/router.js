const express = require('express');
const router = express.Router();
const {addToCart, getUserCart, editCartItems, deleteCart} = require('./controller');

router.post('/',addToCart)
router.get('/',getUserCart)
router.put('/:id',editCartItems)
router.delete('/:id',deleteCart)

module.exports = router;