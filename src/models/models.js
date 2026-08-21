import sequelize from '../config/database.js';
import Brand from './Brand.js';
import Category from './Category.js';
import Product from './Product.js';
import ProductPortion from './ProductPortion.js';
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

Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

Product.hasMany(ProductPortion, {
  foreignKey: 'product_id',
  as: 'portions',
  onDelete: 'CASCADE',
});
ProductPortion.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export { sequelize, User, StoreSettings, Brand, Category, Subcategory, Product, ProductPortion };
