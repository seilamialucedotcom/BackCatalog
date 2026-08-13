import Subcategory from '../models/Subcategory.js';

class SubcategoryRepository {
  findById(id) { return Subcategory.findByPk(id); }
  create(data) { return Subcategory.create(data); }
  remove(id) { return Subcategory.destroy({ where: { id } }); }
}

export default new SubcategoryRepository();
