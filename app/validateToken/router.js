const express = require('express');
const router = express.Router();
const {validateToken} = require('./controller')

router.post('/',validateToken)

module.exports = router;