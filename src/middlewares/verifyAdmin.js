import createError from '../utils/createError.js';

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(createError(403, 'Admin access required'));
  }
  next();
};

export default verifyAdmin;