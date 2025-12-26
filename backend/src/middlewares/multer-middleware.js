import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../services/cloudinary.js';

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Ecommerce_Products', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

export default upload;
