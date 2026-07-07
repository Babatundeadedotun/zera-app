import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // The customer-facing product id (matches the frontend Product.id shape,
    // e.g. "gold-tennis-bracelet"). Auto-generated from the name if not supplied.
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fullDescription: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      // secure Cloudinary URL
      type: String,
      required: true,
    },
    imagePublicId: {
      // Cloudinary public_id, kept so we can delete the image later if needed
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
