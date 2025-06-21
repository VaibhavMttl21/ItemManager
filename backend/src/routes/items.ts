import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinary';
import { sendEnquiryEmail } from '../utils/email';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id - Get specific item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items - Create new item
router.post('/', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!name || !type || !description) {
      return res.status(400).json({ error: 'Name, type, and description are required' });
    }

    if (!files.coverImage || files.coverImage.length === 0) {
      return res.status(400).json({ error: 'Cover image is required' });
    }

    // Upload cover image to Cloudinary
    const coverImageResult = await uploadToCloudinary(files.coverImage[0].path);
    let coverImageUrl = coverImageResult.secure_url;

    // Upload additional images to Cloudinary
    let imageUrls: string[] = [];
    if (files.images && files.images.length > 0) {
      const uploadPromises = files.images.map(file => uploadToCloudinary(file.path));
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(result => result.secure_url);
    }

    // Clean up local files
    fs.unlinkSync(files.coverImage[0].path);
    if (files.images) {
      files.images.forEach(file => fs.unlinkSync(file.path));
    }

    // Create item in database
    const item = await prisma.item.create({
      data: {
        name,
        type,
        description,
        coverImage: coverImageUrl,
        images: imageUrls
      }
    });

    res.status(201).json({ message: 'Item successfully added', item });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// POST /api/items/:id/enquire - Send enquiry email
router.post('/:id/enquire', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id }
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await sendEnquiryEmail(item);
    res.json({ message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Error sending enquiry:', error);
    res.status(500).json({ error: 'Failed to send enquiry' });
  }
});

export default router;