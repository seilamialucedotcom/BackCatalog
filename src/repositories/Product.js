import { Op } from 'sequelize';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import ProductPortion from '../models/ProductPortion.js';

const productIncludes = [
  { model: Brand, as: 'brand' },
  { model: Category, as: 'category', attributes: ['id', 'name'] },
  { model: Subcategory, as: 'subcategory', attributes: ['id', 'name'] },
  { model: ProductPortion, as: 'portions' },
];

class ProductRepository {
  findAll(filters = {}) {
    const where = {};
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }
    if (filters.category_id !== undefined) where.category_id = filters.category_id;
    if (filters.subcategory_id !== undefined) where.subcategory_id = filters.subcategory_id;
    if (filters.is_featured) where.is_featured = true;
    return Product.findAll({
      where,
      include: productIncludes,
      order: [['created_at', 'DESC'], ['id', 'DESC']],
    });
  }
  findById(id, options = {}) { return Product.findByPk(id, options); }
  findByIdWithRelations(id, options = {}) {
    return Product.findByPk(id, {
      ...options,
      include: productIncludes,
    });
  }
  create(data, options = {}) { return Product.create(data, options); }
  update(id, data, options = {}) { return Product.update(data, { where: { id }, ...options }); }
  replacePortions(productId, portions, transaction) {
    return ProductPortion.destroy({ where: { product_id: productId }, transaction })
      .then(() => ProductPortion.bulkCreate(
        portions.map((portion) => ({ ...portion, product_id: productId })),
        { transaction },
      ));
  }
  remove(id) { return Product.destroy({ where: { id } }); }
}

export default new ProductRepository();
