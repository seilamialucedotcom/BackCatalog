import categoryService from './Category.js';
import storeSettingsRepository from '../repositories/StoreSettings.js';

class StoreSettingsService {
  async getCatalog() {
    const [settings, categories] = await Promise.all([storeSettingsRepository.getOrCreate(), categoryService.getAll()]);
    return { settings, categories };
  }
  getSettings() { return storeSettingsRepository.getOrCreate(); }
  async update(data) {
    const current = await storeSettingsRepository.getOrCreate();
    const allowed = ['store_name', 'logo_url', 'primary_color', 'secondary_color', 'whatsapp_number', 'secondary_whatsapp', 'contact_email'];
    const payload = Object.fromEntries(allowed.filter((key) => data[key] !== undefined).map((key) => [key, data[key] === '' ? null : data[key]]));
    await storeSettingsRepository.update(payload);
    return storeSettingsRepository.getOrCreate();
  }
}

export default new StoreSettingsService();
