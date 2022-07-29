const jwt = require('jsonwebtoken');

// Auth client
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoderToken = jwt.verify(token, 'gV6|6CLv*--&D62I1wH=&FYb)}Dc2');
    const userId = decoderToken.userId;
    req.auth = {
      userId: userId
    };
    next();
  } catch (error) {
    res.status(401).json({error});
  }
}
