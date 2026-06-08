const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { execSync } = require('child_process');
const sequelize = require('./config/database'); // Assuming your database.js is correctly set up

const runMigrations = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Run migrations using Sequelize CLI command
    // This is equivalent to running 'npx sequelize-cli db:migrate' from the command line
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });

    console.log('Migrations executed successfully.');

  } catch (error) {
    console.error('Error during migrations:', error);
  }
};

runMigrations();
