const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
    limits:{
        fileSize: 1 * 1024 * 1024 // limite de 1 mega
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, file.key);
            });
        },
    }),
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg||png)$/)){
            return callback(new Error('Por favor faça o upload do tipo jpg ou png'))
        }
        callback(undefined, true)
    }
}