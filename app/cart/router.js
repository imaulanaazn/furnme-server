const express = require('express');
const router = express.Router();
const {addToCart, getUserCart, editCartItems, deleteCart} = require('./controller');
// const {isUserLogin} = require('../middleware/auth')

router.post('/',addToCart)
router.get('/:id',getUserCart)
router.put('/:id',editCartItems)
router.delete('/:id',deleteCart)

module.exports = router;