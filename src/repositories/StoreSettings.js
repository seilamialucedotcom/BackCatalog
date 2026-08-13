import StoreSettings from '../models/StoreSettings.js';

class StoreSettingsRepository {
  async getOrCreate() {
    const [settings] = await StoreSettings.findOrCreate({
      where: { id: 1 },
      defaults: { id: 1, store_name: 'Mi Catálogo' },
    });
    return settings;
  }
  update(data) { return StoreSettings.update(data, { where: { id: 1 } }); }
}

export default new StoreSettingsRepository();
