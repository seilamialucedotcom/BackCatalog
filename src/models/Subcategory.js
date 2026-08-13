import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Subcategory = sequelize.define(
  'Subcategory',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING(140),
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    tableName: 'subcategories',
    underscored: true,
    indexes: [{ unique: true, fields: ['category_id', 'slug'] }],
  },
);

export default Subcategory;
