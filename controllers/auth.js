const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
   // SIGN UP (POST)
   app.post('/signup', async (req, res) => {
   try {
      if (!req.body.username || !req.body.password) {
         return res.status(400).json({ error: 'Please enter a username and password' });
      }
      if (req.body.password.length < 8) {
         return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      // const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
         username: req.body.username,
         password: req.body.password,
      });
      await user.save();
      console.log('User created:', user);
      console.log('User password:', user.password);

      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });

      res.json({ token });
   } catch (error) {
      if (error.name === 'ValidationError') {
         return res.status(400).json({ error: error.message });
      }

      console.error('Signup error:', error);
      res.status(500).json({ error: error.toString() });
   }
   });

   // LOGIN (POST)
   app.post('/login', async (req, res) => {
      console.log('Login request:', req.body);
      try {
         if (!req.body.username || !req.body.password) {
            return res.status(400).json({ error: 'Please enter a username and password' });
         }
         const user = await User.findOne({ username: req.body.username }).select('+password');

         console.log(bcrypt.getRounds(user.password))
         if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
         }
         user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
               return res.status(500).json({ error: err.toString() });
            }
            if (!isMatch) {
               return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
            res.json({ token });
         });
      } catch (error) {
         console.error('Login error:', error);
         res.status(500).json({ error: error.toString() });
      }
   });
};
