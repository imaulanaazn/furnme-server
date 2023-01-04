const express = require('express');
const router = express.Router();
const {googleAuth,signup,signin} = require('./controller');

router.post('/google',googleAuth);
router.get('/signup',signup);
router.get('/signin',signin);

module.exports = router;
