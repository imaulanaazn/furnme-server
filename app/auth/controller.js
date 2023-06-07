const User = require('../user/model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
    googleAuth: (req,res)=>{
        const jwtToken = req.headers.authorization.split(" ")[1];
        
        if(!jwtToken){
            res.status(401).json({message: "Authorization token is missing"})
        }

        const decoded = jwt.decode(jwtToken);
        if(!decoded){
            res.status(401).json({message: "Authorization token is invalid"})
        }
        const providedGoogleId = decoded.sub;
        const providedEmail = decoded.email;

        User.findOne({ $or: [{ googleId: providedGoogleId }, { email: providedEmail }] })
            .then((user) => {
                if (!user) {
                    // No matching user found, save the provided Google ID and email
                    const newUser = new User({
                        googleId: providedGoogleId,
                        email: providedEmail
                    });
                    
                    newUser.save()
                    .then(() => {
                        res.status(200).json({ message: 'User registered successfully' });
                    })
                    .catch((error) => {
                        console.error('Error saving user:', error);
                        res.status(500).json({ message: 'Internal server error' });
                    });
                } else if (user.googleId === providedGoogleId && user.email === providedEmail) {
                    // Matching user found, login
                    res.status(200).json({ message: 'Login successful' });
                } else if (user.email === providedEmail && !user.googleId) {
                    // Matching email found, but no Google ID, save the provided Google ID
                    user.googleId = providedGoogleId;
                    user.save()
                    .then(() => {
                        res.status(200).json({ message: 'Google ID added to the user account' });
                    })
                    .catch((error) => {
                        console.error('Error saving user:', error);
                        res.status(500).json({ message: 'Internal server error' });
                    });
                } else {
                    // Email is already registered with a different Google ID
                    res.status(400).json({ message: 'Email is already registered with a different Google ID' });
                }
            })
            .catch((error) => {
                console.error('Error finding user:', error);
                res.status(500).json({ message: 'Internal server error' });
            });
    },
    basicSignup: ()=>{

    },
    basicSignin: ()=>{

    }
}