import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Brand = sequelize.define(
  'Brand',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
  },
  {
    tableName: 'brands',
    underscored: true,
  },
);

export default Brand;
