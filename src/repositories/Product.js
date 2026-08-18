import { Op } from 'sequelize';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

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
      include: [
        { model: Brand, as: 'brand' },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Subcategory, as: 'subcategory', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC'], ['id', 'DESC']],
    });
  }
  findById(id) { return Product.findByPk(id); }
  findByIdWithRelations(id) {
    return Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand' },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Subcategory, as: 'subcategory', attributes: ['id', 'name'] },
      ],
    });
  }
  create(data) { return Product.create(data); }
  update(id, data) { return Product.update(data, { where: { id } }); }
  remove(id) { return Product.destroy({ where: { id } }); }
}

export default new ProductRepository();
