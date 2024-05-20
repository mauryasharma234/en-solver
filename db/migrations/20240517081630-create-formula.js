'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({
      tableName: 'formula',
      schema: process.env.DB_SCHEMA
    }, {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID
      },

      createdAt: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: 'TIMESTAMP',
        allowNull: false,
      },
      deletedAt: {
        type: 'TIMESTAMP',
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSONB
      },
      expression: {
        type: Sequelize.TEXT
      },
      variables: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      tableName: 'formula',
      schema: process.env.DB_SCHEMA
    });
  }
};