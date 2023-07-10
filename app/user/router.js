const express = require('express');
const router = express.Router();

const {addRecentlyViewed, getRecentlyViewed} = require('./controller');

router.put('/:userId/recently-viewed', addRecentlyViewed);
router.get('/:userId/recently-viewed', getRecentlyViewed);

module.exports = router;