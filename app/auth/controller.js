const User = require('../user/model.js');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const bcrypt = require('bcrypt');


module.exports = {
    googleAuth: (req,res)=>{
        const jwtToken = req.headers.authorization.split(" ")[1];
        
        if(!jwtToken){
            return res.status(401).json({message: "Authorization token is missing"})
        }

        const decoded = jwt.decode(jwtToken);
        if(!decoded){
            return res.status(401).json({message: "Authorization token is invalid"})
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
                        return res.status(200).json({ message: 'User registered successfully' });
                    })
                    .catch((error) => {
                        console.error('Error saving user:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                } else if (user.googleId === providedGoogleId && user.email === providedEmail) {
                    // Matching user found, login
                    return res.status(200).json({ message: 'Login successful' });
                } else if (user.email === providedEmail && !user.googleId) {
                    // Matching email found, but no Google ID, save the provided Google ID
                    user.googleId = providedGoogleId;
                    user.save()
                    .then(() => {
                        return res.status(200).json({ message: 'Google ID added to the user account' });
                    })
                    .catch((error) => {
                        console.error('Error saving user:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                } else {
                    // Email is already registered with a different Google ID
                    return res.status(400).json({ message: 'Email is already registered with a different Google ID' });
                }
            })
            .catch((error) => {
                console.error('Error finding user:', error);
                return res.status(500).json({ message: 'Internal server error' });
            });
    },
    basicSignup: async (req,res)=>{
        const { username, email, password } = req.body;

        if(!email || !password || !username){
            return res.status(400).json({ error: 'Username, email and password are required.' });
        }

        const passwordHash = await hashPassword(password);

        await User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    // No matching user found, save the provided email and password
                    const newUser = new User({
                        username,
                        email,
                        password : passwordHash
                    });
                    newUser.save()
                    .then(() => {
                        const token = generateToken(newUser);
                        return res.status(201).json({ message: 'Signup successful', token });
                    })
                    .catch((error) => {
                        console.error('Error saving user:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                } else if (user.password) {
                    // Matching email found and password found on the database, suggest logging in instead
                    return res.status(400).json({ message: 'Please login instead' });
                } else {
                    // Email is already registered with a different password
                    return res.status(400).json({ message: 'Iam confused with the response :)' });
                }
            })
            .catch((error) => {
                console.error('Error finding user:', error);
                return res.status(500).json({ message: 'Internal server error' });
            });
    },
    basicSignin: async (req, res)=>{
        const { username, email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        await User.findOne({ email: email })
            .then(async (user) => {
                if (!user) {
                    // No matching user found, suggest signup
                    return res.status(400).json({ message: 'Please signup' });
                } else if (!user.password) {
                    // Matching email found, but no password, suggest logging in with Google instead
                    return res.status(400).json({ message: 'Please login with Google instead' });
                } 
                
                const isPasswordValid = await verifyPassword(password, user.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Kata sandi salah.' });
                  }
                
                  // Buat token JWT dan kirimkan sebagai respons.
                  const token = generateToken(user);
                  return res.status(200).json({message: 'login Succesful', token });
            })
            .catch((error) => {
                console.error('Error finding user:', error);
                res.status(500).json({ message: 'Internal server error' });
            });
    }
}

async function verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Fungsi bantu untuk membuat token JWT.
function generateToken(user) {
    const secretKey = config.jwtKey; // Ganti dengan kunci rahasia yang lebih kuat di lingkungan produksi.
    const expiresIn = '84h'; // Token akan berakhir dalam 1 jam.

    return jwt.sign({ id: user._id, username: user.username, email:  user.email}, secretKey, { expiresIn });
}