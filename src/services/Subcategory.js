import Product from '../models/Product.js';
import categoryRepository from '../repositories/Category.js';
import subcategoryRepository from '../repositories/Subcategory.js';

const slugify = (value) => String(value || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const error = (message, status = 400) => Object.assign(new Error(message), { status });

class SubcategoryService {
  async create({ category_id, name }) {
    const cleanName = String(name || '').trim();
    if (!category_id || !cleanName) throw error('La categoría y el nombre son obligatorios.');
    if (!await categoryRepository.findById(category_id)) throw error('Categoría no encontrada.', 404);
    return subcategoryRepository.create({ category_id: Number(category_id), name: cleanName, slug: slugify(cleanName) });
  }
  async remove(id) {
    if (!await subcategoryRepository.findById(id)) throw error('Subcategoría no encontrada.', 404);
    await Product.update({ subcategory_id: null }, { where: { subcategory_id: id } });
    await subcategoryRepository.remove(id);
  }
}

export default new SubcategoryService();
