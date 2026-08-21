import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(180),
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' },
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'subcategories', key: 'id' },
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'brands', key: 'id' },
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { min: 0 },
    },
    unit_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'unidad',
      validate: { isIn: [['unidad', 'paquete', 'kg']] },
    },
  },
  {
    tableName: 'products',
    underscored: true,
  },
);

export default Product;
