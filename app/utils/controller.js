const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
  // Middleware function for validating JWT token
  authenticateJWT : (req, res, next) => {
   const token = req.headers.authorization.split(' ')[1];
   console.log(token)
  
   if (!token) {
     return res.status(401).json({ tokenValid : false, message: 'Unauthorized: Missing token.' });
   }
  
   jwt.verify(token, config.jwtKey, (err, user) => {
     if (err) {
       return res.status(403).json({ tokenValid : false, message: 'Forbidden: Invalid token.' });
     }
     req.user = user;
     next();
   });
  }
}