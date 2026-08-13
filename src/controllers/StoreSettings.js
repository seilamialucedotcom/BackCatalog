import storeSettingsService from '../services/StoreSettings.js';

class StoreSettingsController {
  async getCatalog(_req, res, next) { try { return res.json(await storeSettingsService.getCatalog()); } catch (error) { return next(error); } }
  async getSettings(_req, res, next) { try { return res.json(await storeSettingsService.getSettings()); } catch (error) { return next(error); } }
  async update(req, res, next) { try { return res.json(await storeSettingsService.update(req.body)); } catch (error) { return next(error); } }
}

export default new StoreSettingsController();
