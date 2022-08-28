const { Router } = require('express');

const UploadImgProd = new Router();
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'avatares'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const uploadImage = multer({
    storage,
}).single('file');

UploadImgProd.post('/test/upload-img-prod', (req, res) => {
    uploadImage(req, res, (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }

        const respuesta = {
            status: 200,
            result: "uploaded"
        }
        res.send(respuesta);
    });
});

module.exports = UploadImgProd;