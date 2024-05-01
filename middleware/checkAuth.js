// const jwt = require('jsonwebtoken');

// const checkAuth = async (req, res, next) => {
//   console.log('Checking authentication');
//   try {
//     if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
//       req.user = null;
//     } else {
//       const token = req.cookies.nToken;
//       const decodedToken = await jwt.decode(token, { complete: true }) || {};
//       req.user = decodedToken.payload;
//     }
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     res.status(500).json({ error: 'Authentication failed' });
//   }
// };

// module.exports = checkAuth;

// middleware to check if the user has provided a jwt with their api request

const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decodedToken = jwt.verify(token, process.env.SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = checkAuth;