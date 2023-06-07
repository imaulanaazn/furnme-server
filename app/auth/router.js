const express = require('express');
const router  = express.Router();
const {googleAuth, basicSignup, basicSignin} = require('./controller');

router.post('/google', googleAuth);
router.post('/signup', basicSignup);
router.post('/signin', basicSignin);

module.exports = router;
