const { verifyToken } = require('../utils/jwt');

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('No token provided');
    err.statusCode = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = 'Invalid or expired token';
    next(err);
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error('Forbidden: insufficient permissions');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { protect, authorize };