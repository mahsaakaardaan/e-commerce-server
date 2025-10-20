const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token)
    return res.status(401).json({ message: 'unAuthorized a' });
  jwt.verify(token, process.env.JWT, (err, data) => {
    if (err)
      return res.status(401).json({ message: 'unAuthorized b' });

    req.userId = data.id;
    next();
  });
};

module.exports = { auth };
