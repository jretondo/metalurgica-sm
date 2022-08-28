const { Router } = require('express');

const UploadImgCountD = new Router();

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'CountDown'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const uploadImage = multer({
    storage,
}).single('file');

UploadImgCountD.post('/test/upload-img-countd', (req, res) => {
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

module.exports = UploadImgCountD;