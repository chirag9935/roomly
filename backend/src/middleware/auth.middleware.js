const { verifyToken } = require('../utils/jwt');

function protect(req, res, next) {
  // Read the access token from the httpOnly cookie set at login/signup.
  // (Falls back to an Authorization header for non-browser clients, e.g. mobile apps,
  // which can't rely on cookies — remove this fallback if you never need that.)
  const bearer = req.headers.authorization;
  const token = req.cookies?.token || (bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : null);

  if (!token) {
    const err = new Error('No token provided');
    err.statusCode = 401;
    return next(err);
  }

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
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const err = new Error('Forbidden: insufficient permissions');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { protect, authorize };