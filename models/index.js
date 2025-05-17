import sequelize from '../config/db.js';

// Direct imports instead of factories
import Role from './role.js';
import User from './user.js';
import LearnerVideo from './learnerVideo.js';
import Therapist from './therapist.js';
import Booking from './booking.js';
import OtpLog from './otpLog.js';

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Therapist, { foreignKey: 'therapistId', as: 'therapist' });
OtpLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Initialize roles
const initRoles = async () => {
  try {
    const roles = ['admin', 'therapist', 'learner', 'user'];
    for (const roleName of roles) {
      await Role.findOrCreate({ where: { name: roleName } });
    }
    console.log('Roles initialized successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

// Create default admin
const createDefaultAdmin = async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) return;

    const adminExists = await User.count({ where: { roleId: adminRole.id } });
    if (adminExists === 0) {
      await User.create({
        name: 'System Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
        roleId: adminRole.id,
        status: 'active',
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Make sure sequelize is included in exports
export {
  sequelize, // Make sure this is properly imported at the top
  User,
  Role,
  LearnerVideo,
  Therapist,
  Booking,
  OtpLog,
  initRoles,
  createDefaultAdmin,
};
