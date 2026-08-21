import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductPortion = sequelize.define(
  'ProductPortion',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.000001 },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
  },
  {
    tableName: 'product_portions',
    underscored: true,
  },
);

export default ProductPortion;
