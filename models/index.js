import sequelize from '../config/db.js';
import User from './user.js';
import Role from './role.js';

// Define relationships
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// Function to initialize roles
const initRoles = async () => {
  try {
    const roles = ['admin', 'therapist', 'learner', 'user'];

    for (const roleName of roles) {
      await Role.findOrCreate({
        where: { name: roleName },
      });
    }
    console.log('Roles initialized successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

// Function to create default admin if none exists
const createDefaultAdmin = async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) return;

    const adminExists = await User.count({
      where: { roleId: adminRole.id },
    });

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

export { sequelize, User, Role, initRoles, createDefaultAdmin };
