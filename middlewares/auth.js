import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate the token in the request headers
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access denied, token missing' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error });
  }
};

/**
 * Middleware to check if the user has an admin role
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Permission denied: Admin role required' });
  }
  next();
};

/**
 * Middleware to check if the user is a normal user
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
export const isUser = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ message: 'Permission denied: User role required' });
  }
  next();
};

/**
 * Middleware to check if the user is a therapist
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
export const isTherapist = (req, res, next) => {
  if (req.user?.role !== 'therapist') {
    return res.status(403).json({ message: 'Permission denied: User role required' });
  }
  next();
};
