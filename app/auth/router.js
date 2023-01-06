const express = require('express');
const router = express.Router();
const {googleauth,signup,signin} = require('./controller');

router.post('/googleauth',googleauth);
router.post('/signup',signup);
router.post('/signin',signin);

module.exports = router;
