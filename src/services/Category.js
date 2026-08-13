import sequelize from '../config/database.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import categoryRepository from '../repositories/Category.js';

const slugify = (value) => String(value || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const error = (message, status = 400) => Object.assign(new Error(message), { status });

class CategoryService {
  getAll() { return categoryRepository.findAllWithSubcategories(); }

  async save(data, id) {
    const name = String(data.name || '').trim();
    const image_url = String(data.image_url || '').trim();
    if (!name || !image_url) throw error('El nombre y la imagen de la categoría son obligatorios.');
    const payload = { name, image_url, slug: slugify(name) };
    if (id) {
      if (!await categoryRepository.findById(id)) throw error('Categoría no encontrada.', 404);
      await categoryRepository.update(id, payload);
      return categoryRepository.findById(id);
    }
    return categoryRepository.create({ ...payload, order_index: await categoryRepository.count() + 1 });
  }

  async remove(id) {
    if (!await categoryRepository.findById(id)) throw error('Categoría no encontrada.', 404);
    await sequelize.transaction(async (transaction) => {
      await Product.update({ category_id: null, subcategory_id: null }, { where: { category_id: id }, transaction });
      await Category.destroy({ where: { id }, transaction });
    });
  }
}

export default new CategoryService();
