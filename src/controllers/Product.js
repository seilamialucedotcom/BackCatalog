import productService from '../services/Product.js';

class ProductController {
  async getAll(req, res, next) { try { return res.json(await productService.getAll(req.query)); } catch (error) { return next(error); } }
  async create(req, res, next) { try { return res.status(201).json(await productService.save(req.body)); } catch (error) { return next(error); } }
  async update(req, res, next) { try { return res.json(await productService.save(req.body, req.params.id)); } catch (error) { return next(error); } }
  async remove(req, res, next) { try { await productService.remove(req.params.id); return res.status(204).end(); } catch (error) { return next(error); } }
}

export default new ProductController();
