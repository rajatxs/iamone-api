"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserImageUploadOptions = void 0;
const multer_1 = require("multer");
exports.UserImageUploadOptions = {
    limits: {
        fields: 1,
        fieldSize: 5000000,
    },
    storage: (0, multer_1.memoryStorage)()
};
