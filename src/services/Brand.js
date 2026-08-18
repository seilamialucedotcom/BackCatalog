import brandRepository from '../repositories/Brand.js';

const error = (message, status = 400) => Object.assign(new Error(message), { status });

class BrandService {
  getAll() { return brandRepository.findAll(); }

  async create(data) {
    const name = String(data.name || '').trim();
    if (!name) throw error('El nombre de la marca es obligatorio.');

    const [brand, created] = await brandRepository.findOrCreate(name);
    return { brand, created };
  }
}

export default new BrandService();
