import categoryService from './Category.js';
import storeSettingsRepository from '../repositories/StoreSettings.js';
import cloudinary from '../config/cloudinary.js';

const error = (message, status = 400) => Object.assign(new Error(message), { status });

class StoreSettingsService {
  async getCatalog() {
    const [settings, categories] = await Promise.all([storeSettingsRepository.getOrCreate(), categoryService.getAll()]);
    return { settings, categories };
  }

  getSettings() { return storeSettingsRepository.getOrCreate(); }

  async update(data) {
    const current = await storeSettingsRepository.getOrCreate();

    // Si viene logo_url y NO pertenece a tu Cloudinary (Base64 o link externo), lo subimos
    if (data.logo_url && String(data.logo_url).trim() !== '' && !String(data.logo_url).includes('res.cloudinary.com')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(data.logo_url, {
          folder: 'empresa',
        });
        data.logo_url = uploadResponse.secure_url;
      } catch (err) {
        console.error('Error subiendo logo a Cloudinary:', err);
        throw error('No se pudo procesar la imagen del logo.', 500);
      }
    }

    const allowed = ['store_name', 'logo_url', 'primary_color', 'secondary_color', 'whatsapp_number', 'secondary_whatsapp', 'contact_email'];
    const payload = Object.fromEntries(allowed.filter((key) => data[key] !== undefined).map((key) => [key, data[key] === '' ? null : data[key]]));
    
    await storeSettingsRepository.update(payload);
    return storeSettingsRepository.getOrCreate();
  }
}

export default new StoreSettingsService();