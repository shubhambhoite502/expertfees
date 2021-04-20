var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname.split('.', 1) + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

let fileFilter = function (req, file, cb) {
    var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb({
            success: false,
            message: 'Invalid file type. Only jpg, png image files are allowed.'
        }, false);
    }
};

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1 * 1000 * 1000
    }
})

var cpUpload = upload.fields([
    { name: 'aadhar-card' },
    { name: 'ration-card' },
    { name: 'sem-one-three-five', maxCount: 3 },
    { name: 'sem-two-four-five', maxCount: 3 },
    { name: 'sign' },
    { name: 'photo' }
])

/* file upload */
router.post('/upload', function (req, res, next) {
    cpUpload(req, res, function (error) {
        if (error instanceof multer.MulterError) {
            res.status(500);
            if (error.code == 'LIMIT_FILE_SIZE') {
                error.message = 'File Size is too large. Allowed file size is 1MB';
                error.success = false;
            }
            return res.json(error);
            // A Multer error occurred when uploading.
        } else if (error) {
            res.json(error)
        } else {
            if (!req.files) {
                res.status(500);
                res.json('file not found');
            }
            res.status(200);
            res.json({
                success: true,
                message: req.files
            });
        }
    })
})

module.exports = router;

