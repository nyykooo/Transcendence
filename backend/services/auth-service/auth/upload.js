const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedDocTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
    const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image or document files allowed (images: JPEG, PNG, GIF, WebP; documents: CSV, JSON)'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter: fileFilter
});

async function removeFileIfExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    await fs.promises.unlink(filePath);
  } catch (err) {
    // File does not exist or cannot be accessed, ignore
  }
}


module.exports = {upload, removeFileIfExists, uploadDir};