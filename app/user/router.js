const express = require('express');
const router = express.Router();
const {authenticateJWT} = require('../utils/controller');

const {addRecentlyViewed, getRecentlyViewed} = require('./controller');

router.post('/validate', authenticateJWT, (req,res)=>{ res.status(200).json({tokenValid: true, ...req.user})})
router.put('/:userId/recently-viewed', addRecentlyViewed);
router.get('/:userId/recently-viewed', getRecentlyViewed);

module.exports = router;