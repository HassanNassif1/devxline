const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE, // Single field for both date and time
    allowNull: false,
  },
  time :{
    type: DataTypes.TIME,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,  // Optional message for the appointment
  },
}, {
  timestamps: true,
});

module.exports = Appointment;
