const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    therapistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Therapists',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'upcoming',
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'bookings',
  }
);

Booking.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};

module.exports = Booking;
