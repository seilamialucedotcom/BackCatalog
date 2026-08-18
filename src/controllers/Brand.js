import brandService from '../services/Brand.js';

class BrandController {
  async getAll(_req, res, next) {
    try { return res.json(await brandService.getAll()); } catch (error) { return next(error); }
  }

  async create(req, res, next) {
    try {
      const { brand, created } = await brandService.create(req.body);
      return res.status(created ? 201 : 200).json(brand);
    } catch (error) { return next(error); }
  }
}

export default new BrandController();
