import { Op } from 'sequelize';
import { User, Role } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const getDashboard = async (req, res) => {
  try {
    // Find admin role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    const totalUsers = await User.count({
      where: adminRole ? { roleId: { [Op.ne]: adminRole.id } } : {},
    });

    const therapistRole = await Role.findOne({ where: { name: 'therapist' } });
    const therapistsCount = therapistRole
      ? await User.count({ where: { roleId: therapistRole.id } })
      : 0;

    let bookingsThisMonth = 0;
    try {
      if (typeof Booking !== 'undefined') {
        bookingsThisMonth = await Booking.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
            },
          },
        });
      }
    } catch (err) {
      console.error('Error counting bookings:', err);
    }

    let completedSessions = 0;
    try {
      if (typeof Session !== 'undefined') {
        completedSessions = await Session.count({
          where: {
            status: 'completed',
            createdAt: {
              [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        });
      }
    } catch (err) {
      console.error('Error counting sessions:', err);
    }

    return successResponse(res, 200, 'Dashboard data retrieved successfully', {
      totalUsers,
      therapistsCount,
      bookingsThisMonth,
      completedSessions,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};

// User List API
export const getUserList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    // Build role filter
    const includeClause = {
      model: Role,
      attributes: ['id', 'name'],
    };

    if (role) {
      includeClause.where = { name: role };
    }

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = [
      'id',
      'name',
      'email',
      'status',
      'createdAt',
      'updatedAt',
      'lastLogin',
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder : 'DESC';

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[validSortBy, validSortOrder]],
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
    });

    return successResponse(res, 200, 'Users retrieved successfully', {
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    console.error('User list error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};

// Change User Status API
export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Status must be active or inactive.');
    }

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Admin cannot change their own status
    if (user.id === req.user.id) {
      return errorResponse(res, 403, 'You cannot change your own status');
    }

    await user.update({ status });

    return successResponse(res, 200, `User status changed to ${status} successfully`, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Change user status error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};

// Delete User API
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Prevent admin from deleting their own account
    if (user.id === req.user.id) {
      return errorResponse(res, 403, 'You cannot delete your own account');
    }

    await user.destroy();

    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};
