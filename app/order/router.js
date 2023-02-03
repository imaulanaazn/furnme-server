const express = require('express')
const router = express.Router()
const {createOrder, updateOrder, getUserOrders} = require('./controller');

router.post('/', createOrder)
router.put('/:id', updateOrder)
router.get('/', getUserOrders)

module.exports = router;