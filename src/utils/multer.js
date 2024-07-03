import multer from 'multer'
import path from "path"

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, __dirname + "/public/img");
    },
    filename:function (req,file,cb) {
        cb(null,file.originalname);
    }
});

export const uploader = multer({storage});
