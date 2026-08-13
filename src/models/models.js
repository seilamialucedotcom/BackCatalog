import sequelize from '../config/database.js';
import Category from './Category.js';
import Product from './Product.js';
import StoreSettings from './StoreSettings.js';
import Subcategory from './Subcategory.js';
import User from './User.js';

Category.hasMany(Subcategory, {
  foreignKey: 'category_id',
  as: 'subcategories',
  onDelete: 'CASCADE',
});
Subcategory.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
  onDelete: 'SET NULL',
});
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Subcategory.hasMany(Product, {
  foreignKey: 'subcategory_id',
  as: 'products',
  onDelete: 'SET NULL',
});
Product.belongsTo(Subcategory, { foreignKey: 'subcategory_id', as: 'subcategory' });

export { sequelize, User, StoreSettings, Category, Subcategory, Product };
