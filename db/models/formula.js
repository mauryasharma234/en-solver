const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define('formula',  {
  id: {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: Sequelize.UUIDV4,
    defaultValue: Sequelize.UUIDV4
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  deletedAt: {
    type: Sequelize.DATE
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
}, {
  paranoid: true,
  timestamps: true,
  modelName: 'formula',
  freezeTableName: true,
  schema: process.env.DB_SCHEMA
})