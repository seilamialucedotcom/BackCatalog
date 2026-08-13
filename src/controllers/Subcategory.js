import subcategoryService from '../services/Subcategory.js';

class SubcategoryController {
  async create(req, res, next) { try { return res.status(201).json(await subcategoryService.create(req.body)); } catch (error) { return next(error); } }
  async remove(req, res, next) { try { await subcategoryService.remove(req.params.id); return res.status(204).end(); } catch (error) { return next(error); } }
}

export default new SubcategoryController();
