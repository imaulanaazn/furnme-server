const express = require('express');
const router = express.Router();

const {createTransaction, getTransactionById, getAllTransactions } = require('./controller');

router.post('/', createTransaction);
router.get('/:id', getTransactionById);
router.get('/', getAllTransactions);

module.exports = router;