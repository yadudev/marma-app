import { errorResponse } from '../utils/responseHandler.js';

/**
 * Middleware factory for role-based access control
 * @param {Array} allowedRoles - Array of allowed role names
 * @returns {function} - Express middleware
 */
export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.Role) {
      return errorResponse(res, 403, 'Access denied. User role not found.');
    }

    if (allowedRoles.includes(req.user.Role.name)) {
      next();
    } else {
      return errorResponse(res, 403, `Access denied. Required roles: ${allowedRoles.join(', ')}`);
    }
  };
};

// Predefined role check middlewares
export const isAdmin = checkRole(['admin']);
export const isTherapist = checkRole(['therapist']);
export const isLearner = checkRole(['learner']);
export const isUser = checkRole(['user']);
export const isAdminOrTherapist = checkRole(['admin', 'therapist']);
