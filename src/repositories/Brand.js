import Brand from '../models/Brand.js';

class BrandRepository {
  findAll() { return Brand.findAll({ order: [['name', 'ASC'], ['id', 'ASC']] }); }
  findById(id) { return Brand.findByPk(id); }
  findOrCreate(name) { return Brand.findOrCreate({ where: { name }, defaults: { name } }); }
}

export default new BrandRepository();
