"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const email_1 = require("../utils/email");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// GET /api/items - Get all items
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma.item.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(items);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
}));
// GET /api/items/:id - Get specific item
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield prisma.item.findUnique({
            where: { id }
        });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    }
    catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
}));
// POST /api/items - Create new item
router.post('/', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, description } = req.body;
        const files = req.files;
        if (!name || !type || !description) {
            return res.status(400).json({ error: 'Name, type, and description are required' });
        }
        if (!files.coverImage || files.coverImage.length === 0) {
            return res.status(400).json({ error: 'Cover image is required' });
        }
        // Upload cover image to Cloudinary
        const coverImageResult = yield (0, cloudinary_1.uploadToCloudinary)(files.coverImage[0].path);
        let coverImageUrl = coverImageResult.secure_url;
        // Upload additional images to Cloudinary
        let imageUrls = [];
        if (files.images && files.images.length > 0) {
            const uploadPromises = files.images.map(file => (0, cloudinary_1.uploadToCloudinary)(file.path));
            const results = yield Promise.all(uploadPromises);
            imageUrls = results.map(result => result.secure_url);
        }
        // Clean up local files
        fs_1.default.unlinkSync(files.coverImage[0].path);
        if (files.images) {
            files.images.forEach(file => fs_1.default.unlinkSync(file.path));
        }
        // Create item in database
        const item = yield prisma.item.create({
            data: {
                name,
                type,
                description,
                coverImage: coverImageUrl,
                images: imageUrls
            }
        });
        res.status(201).json({ message: 'Item successfully added', item });
    }
    catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
}));
// POST /api/items/:id/enquire - Send enquiry email
router.post('/:id/enquire', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield prisma.item.findUnique({
            where: { id }
        });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        yield (0, email_1.sendEnquiryEmail)(item);
        res.json({ message: 'Enquiry sent successfully' });
    }
    catch (error) {
        console.error('Error sending enquiry:', error);
        res.status(500).json({ error: 'Failed to send enquiry' });
    }
}));
exports.default = router;
