import categoryRepository from '../repositories/Category.js';
import productRepository from '../repositories/Product.js';
import subcategoryRepository from '../repositories/Subcategory.js';
import cloudinary from '../config/cloudinary.js';

const slugify = (value) => String(value || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const error = (message, status = 400) => Object.assign(new Error(message), { status });
const asBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

function serialize(product) {
  const value = product.get ? product.get({ plain: true }) : product;
  return { ...value, category_name: value.category?.name || 'Sin categoría', subcategory_name: value.subcategory?.name || '', category: undefined, subcategory: undefined };
}

class ProductService {
  async getAll(query) {
    const filters = {
      search: String(query.search || '').trim() || undefined,
      category_id: query.category_id ? Number(query.category_id) : undefined,
      subcategory_id: query.subcategory_id ? Number(query.subcategory_id) : undefined,
      is_featured: asBoolean(query.is_featured),
    };
    return (await productRepository.findAll(filters)).map(serialize);
  }

  async save(data, id) {
    const name = String(data.name || '').trim();
    let image_url = String(data.image_url || '').trim();
    const price = Number(data.price);
    const category_id = data.category_id ? Number(data.category_id) : null;
    const subcategory_id = data.subcategory_id ? Number(data.subcategory_id) : null;

    if (!name || !image_url || !Number.isFinite(price) || price < 0) throw error('Nombre, imagen y precio válido son obligatorios.');

    // Procesa Base64 y enlaces externos enviándolos a la carpeta 'productos' de Cloudinary
    if (!image_url.includes('res.cloudinary.com')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image_url, {
          folder: 'productos',
        });
        image_url = uploadResponse.secure_url;
      } catch (err) {
        console.error('Error subiendo imagen de producto a Cloudinary:', err);
        throw error('No se pudo procesar la imagen del producto.', 500);
      }
    }

    if (category_id && !await categoryRepository.findById(category_id)) throw error('Categoría no encontrada.', 404);
    if (subcategory_id) {
      const subcategory = await subcategoryRepository.findById(subcategory_id);
      if (!subcategory || subcategory.category_id !== category_id) throw error('La subcategoría no pertenece a la categoría seleccionada.');
    }

    const payload = {
      name, slug: slugify(name), description: String(data.description || '').trim() || null,
      price, category_id, subcategory_id, image_url, is_featured: asBoolean(data.is_featured),
      stock: Number.isFinite(Number(data.stock)) ? Math.max(0, Number(data.stock)) : 10,
    };

    if (id) {
      if (!await productRepository.findById(id)) throw error('Producto no encontrado.', 404);
      await productRepository.update(id, payload);
      return serialize(await productRepository.findByIdWithRelations(id));
    }

    const product = await productRepository.create(payload);
    return serialize(await productRepository.findByIdWithRelations(product.id));
  }

  async remove(id) {
    if (!await productRepository.findById(id)) throw error('Producto no encontrado.', 404);
    await productRepository.remove(id);
  }
}

export default new ProductService();