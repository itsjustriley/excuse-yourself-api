import User from "../models/user";
import jwt from 'jsonwebtoken';

export default (app) => {
   // TODO: Implement authentication controller.
   // SIGN UP FORM
   app.get('/sign-up', (req, res) => {
      res.render('sign-up');
   });

   // SIGN UP POST
   app.post('/sign-up', async (req, res) => {
      try {
         console.log(req.body);
         // compare passwords 
         if (req.body.password !== req.body.confirmPassword) {
            // Passwords do not match
            return res.status(400).send({ message: 'Passwords do not match' });
         }
         // Create User and JWT
         const user = new User(req.body);

         await user.save();

         const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
         res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
         return res.redirect('/');
      } catch (err) {
         console.log(err);
         return res.status(400).send({ err });
      }
   });

   // LOGOUT
   app.get('/logout', (req, res) => {
      res.clearCookie('nToken');
      return res.redirect('/');
   });


   // LOGIN FORM
   app.get('/login', (req, res) => {
      res.render('login');
   });
   // LOGIN
   app.post('/login', async (req, res) => {
      try {
         const { username, password } = req.body;
         // Find this user name
         const user = await User.findOne({ username }, 'username password');
         if (!user) {
            // User not found
            console.log("user not found")
            return res.status(400).send({ message: 'Wrong Username or Password' });
         }
         // Check the password
         user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
              // Password does not match
               console.log("wrong password")
               return res.status(401).send({ message: 'Wrong Username or password' });
            }
            // Create a token
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
               expiresIn: '60 days',
            });
            const maxAge = req.body.rememberMe ? 2592000000 : 900000;
            // Set a cookie and redirect to root
            res.cookie('nToken', token, { maxAge, httpOnly: true });

            return res.redirect('/');
         });
      } catch (err) {
         console.log(err);
      }
   });
};
