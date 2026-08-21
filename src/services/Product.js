import categoryRepository from '../repositories/Category.js';
import brandRepository from '../repositories/Brand.js';
import productRepository from '../repositories/Product.js';
import subcategoryRepository from '../repositories/Subcategory.js';
import cloudinary from '../config/cloudinary.js';
import sequelize from '../config/database.js';

const slugify = (value) => String(value || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const UNIT_TYPES = ['unidad', 'paquete', 'kg'];
const error = (message, status = 400) => Object.assign(new Error(message), { status });
const asBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;
const optionalId = (value, field) => {
  if (value === undefined || value === null || value === '') return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw error(`${field} no valido.`);
  return id;
};
const nullableStock = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const stock = Number(value);
  if (!Number.isInteger(stock) || stock < 0) throw error('El stock debe ser un numero entero no negativo o null.');
  return stock;
};
const unitType = (value) => {
  const type = String(value || 'unidad').trim().toLowerCase();
  if (!UNIT_TYPES.includes(type)) throw error('El tipo de unidad debe ser unidad, paquete o kg.');
  return type;
};
const portions = (value) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw error('Las porciones deben enviarse como una lista.');

  return value.map((portion, index) => {
    const label = String(portion?.label || '').trim();
    const amount = 1;
    const price = Number(portion?.price);

    if (!label || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(price) || price < 0) {
      throw error(`La porciÃ³n ${index + 1} debe tener etiqueta, cantidad mayor a cero y precio vÃ¡lido.`);
    }

    return { label, amount, price };
  });
};

// El editor solo necesita estos elementos. Se descarta cualquier atributo y
// cualquier etiqueta no permitida antes de persistir la descripción.
function sanitizeDescription(value) {
  const source = String(value || '').trim();
  if (!source) return null;

  const allowedTags = { p: 'p', br: 'br', strong: 'strong', b: 'strong', em: 'em', i: 'em', ul: 'ul', ol: 'ol', li: 'li', mark: 'mark' };
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|style|iframe|object|embed|svg|math)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(\/?)\s*([a-z0-9]+)(?:\s[^>]*)?>/gi, (match, closing, tagName) => {
      const tag = allowedTags[tagName.toLowerCase()];
      if (!tag) return '';
      return closing ? `</${tag}>` : `<${tag}>`;
    })
    .trim() || null;
}

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
    const category_id = optionalId(data.category_id, 'Categoria');
    const subcategory_id = optionalId(data.subcategory_id, 'Subcategoria');
    const brand_id = optionalId(data.brand_id, 'Marca');
    const stock = nullableStock(data.stock);
    const portionList = portions(data.portions);

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
    if (brand_id && !await brandRepository.findById(brand_id)) throw error('Marca no encontrada.', 404);
    if (subcategory_id) {
      const subcategory = await subcategoryRepository.findById(subcategory_id);
      if (!subcategory || subcategory.category_id !== category_id) throw error('La subcategoría no pertenece a la categoría seleccionada.');
    }

    const payload = {
      name, slug: slugify(name), description: sanitizeDescription(data.description),
      price, category_id, subcategory_id, brand_id, image_url, is_featured: asBoolean(data.is_featured), stock,
      unit_type: unitType(data.unit_type),
    };

    return sequelize.transaction(async (transaction) => {
      if (id) {
        if (!await productRepository.findById(id, { transaction })) throw error('Producto no encontrado.', 404);
        await productRepository.update(id, payload, { transaction });
        if (portionList !== undefined) await productRepository.replacePortions(id, portionList, transaction);
        return serialize(await productRepository.findByIdWithRelations(id, { transaction }));
      }

      const product = await productRepository.create(payload, { transaction });
      await productRepository.replacePortions(product.id, portionList || [], transaction);
      return serialize(await productRepository.findByIdWithRelations(product.id, { transaction }));
    });
  }

  async remove(id) {
    if (!await productRepository.findById(id)) throw error('Producto no encontrado.', 404);
    await productRepository.remove(id);
  }
}

export default new ProductService();
