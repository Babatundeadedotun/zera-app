import express from 'express';
import cloudinary from '../config/cloudinary.js';
import Product from '../models/Product.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function safeDestroy(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary delete warning:', err.message);
  }
}

// GET /api/products - public, used by the customer-facing site
router.get('/', async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const shaped = products.map((p) => ({
      id: p.productId,
      name: p.name,
      category: p.category,
      description: p.description,
      fullDescription: p.fullDescription,
      image: p.image,
      price: p.price,
    }));

    return res.json(shaped);
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ message: 'Could not load products.' });
  }
});

// POST /api/products - protected, admin adds a new item.
// The photo is uploaded straight from the browser to Cloudinary BEFORE this
// call (see src/lib/cloudinaryUpload.ts on the frontend); this endpoint just
// receives plain JSON with the resulting image URL + public ID to save.
router.post('/', requireAdminAuth, async (req, res) => {
  try {
    const { id, name, category, description, fullDescription, price, image, imagePublicId } = req.body;

    if (!name || !category || !description || !fullDescription || !price) {
      return res.status(400).json({
        message: 'Name, category, description, full description, and price are all required.',
      });
    }

    if (!image || !imagePublicId) {
      return res.status(400).json({ message: 'A product image is required.' });
    }

    const productId = slugify(id && id.trim() ? id : `${name}-${Date.now()}`);

    const existing = await Product.findOne({ productId });
    if (existing) {
      return res.status(409).json({ message: 'A product with that ID already exists. Please choose a different ID.' });
    }

    const product = await Product.create({
      productId,
      name: name.trim(),
      category: category.trim().toLowerCase(),
      description: description.trim(),
      fullDescription: fullDescription.trim(),
      price: price.trim(),
      image,
      imagePublicId,
    });

    return res.status(201).json({
      message: 'Product added successfully.',
      product: {
        id: product.productId,
        name: product.name,
        category: product.category,
        description: product.description,
        fullDescription: product.fullDescription,
        image: product.image,
        price: product.price,
      },
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ message: err.message || 'Could not add product.' });
  }
});

// PUT /api/products/:id - protected, admin edits an existing item.
// If the photo was replaced, the browser has already uploaded the new one to
// Cloudinary and sends the new image/imagePublicId here; the old photo is
// then deleted from Cloudinary server-side (this uses the real API secret,
// so it must happen on the server, never in the browser).
router.put('/:id', requireAdminAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const { id, name, category, description, fullDescription, price, image, imagePublicId } = req.body;

    if (!name || !category || !description || !fullDescription || !price) {
      return res.status(400).json({
        message: 'Name, category, description, full description, and price are all required.',
      });
    }

    // Allow renaming the product ID, but make sure it doesn't collide with another product
    let newProductId = product.productId;
    if (id && id.trim()) {
      const slug = slugify(id);
      if (slug !== product.productId) {
        const existing = await Product.findOne({ productId: slug });
        if (existing) {
          return res.status(409).json({ message: 'A product with that ID already exists. Please choose a different ID.' });
        }
        newProductId = slug;
      }
    }

    const isReplacingPhoto = Boolean(image && imagePublicId && imagePublicId !== product.imagePublicId);
    const oldPublicId = product.imagePublicId;

    product.productId = newProductId;
    product.name = name.trim();
    product.category = category.trim().toLowerCase();
    product.description = description.trim();
    product.fullDescription = fullDescription.trim();
    product.price = price.trim();
    if (isReplacingPhoto) {
      product.image = image;
      product.imagePublicId = imagePublicId;
    }
    await product.save();

    if (isReplacingPhoto) {
      await safeDestroy(oldPublicId);
    }

    return res.json({
      message: 'Product updated successfully.',
      product: {
        id: product.productId,
        name: product.name,
        category: product.category,
        description: product.description,
        fullDescription: product.fullDescription,
        image: product.image,
        price: product.price,
      },
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ message: err.message || 'Could not update product.' });
  }
});

// DELETE /api/products/:id - protected, remove a product the admin added
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await safeDestroy(product.imagePublicId);
    await product.deleteOne();

    return res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ message: 'Could not delete product.' });
  }
});

export default router;
