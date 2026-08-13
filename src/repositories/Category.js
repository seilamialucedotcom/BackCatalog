import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

class CategoryRepository {
  findAllWithSubcategories() {
    return Category.findAll({
      include: [{ model: Subcategory, as: 'subcategories' }],
      order: [['order_index', 'ASC'], ['id', 'ASC'], [{ model: Subcategory, as: 'subcategories' }, 'name', 'ASC']],
    });
  }
  findById(id) { return Category.findByPk(id); }
  create(data) { return Category.create(data); }
  update(id, data) { return Category.update(data, { where: { id } }); }
  remove(id) { return Category.destroy({ where: { id } }); }
  count() { return Category.count(); }
}

export default new CategoryRepository();
