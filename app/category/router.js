const express = require('express');
const router = express.Router();
const {addCategory, getCategories, getCategoryById, deleteCategoryById} = require('./controller');

router.post('/', addCategory)
router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.delete('/:id', deleteCategoryById)

module.exports = router;