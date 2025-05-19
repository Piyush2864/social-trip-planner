import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, "../../upoads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `user-${Date.now()}${ext}`);
    },
});

const upload = multer({storage});

export default upload;