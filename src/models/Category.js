import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING(140),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { isUrl: true },
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
  },
  {
    tableName: 'categories',
    underscored: true,
  },
);

export default Category;
