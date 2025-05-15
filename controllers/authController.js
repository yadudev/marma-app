import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User, Role } from '../models/index.js';
import sendEmail, { emailTemplates } from '../utils/emailService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create admin user if not exists
const createAdminIfNotExists = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: {
        [Op.or]: [{ username: 'admin' }, { email: 'admin@example.com' }],
      },
    });

    if (!existingAdmin) {
      let adminRole = await Role.findOne({ where: { name: 'admin' } });

      if (!adminRole) {
        adminRole = await Role.create({
          name: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('Admin role created successfully!');
      }

      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        name: 'Admin',
        password: 'Admin123!',
        roleId: adminRole.id,
        status: 'active',
      });

      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user already exists!');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    await createAdminIfNotExists();

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
      include: Role,
    });

    if (!user) {
      return errorResponse(res, 401, 'Invalid email/username or password');
    }

    if (user.status !== 'active') {
      return errorResponse(res, 403, 'Account is inactive. Please contact administrator.');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return errorResponse(res, 401, 'Invalid email/username or password');
    }

    await user.update({ lastLogin: new Date() });

    const token = jwt.sign({ userId: user.id, role: user.Role?.name }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return successResponse(res, 200, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.Role?.name,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    // Always return success for security, but only continue if user exists
    if (!user) {
      return successResponse(
        res,
        200,
        'If your email exists in our system, you will receive reset instructions.'
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await user.update({ resetToken, resetTokenExpiry });

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : `${req.protocol}://${req.get('host')}`;

    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: emailTemplates.resetPassword(resetUrl, user.name),
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      await user.update({ resetToken: null, resetTokenExpiry: null });
    }

    return successResponse(
      res,
      200,
      'If your email exists in our system, you will receive reset instructions.'
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return errorResponse(res, 400, 'Invalid or expired token');
    }

    await user.update({
      password,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return successResponse(res, 200, 'Password reset successful');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(res, 500, 'Server error');
  }
};
