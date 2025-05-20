const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Therapist = sequelize.define(
  'Therapist',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clinicName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    availability: {
      type: DataTypes.ENUM('Online', 'Offline'),
      defaultValue: 'Offline',
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Inactive'),
      defaultValue: 'Pending',
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

Therapist.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

module.exports = Therapist;
