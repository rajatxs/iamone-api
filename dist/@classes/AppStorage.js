"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStorage = void 0;
const mongodb_1 = require("mongodb");
const fs_1 = require("fs");
const db_1 = require("../@utils/db");
const common_1 = require("../@utils/common");
class AppStorage {
    constructor(bucketName, writeConcern) {
        this.bucketName = bucketName;
        const db = (0, db_1.mongo)();
        this.bucket = new mongodb_1.GridFSBucket(db, {
            bucketName,
            writeConcern
        });
    }
    find(filter, options) {
        return this.bucket.find(filter, options).toArray();
    }
    async exists(_id) {
        let files;
        _id = (0, common_1.toDocId)(_id);
        files = await this.bucket.find({ _id }, { limit: 1 }).toArray();
        return (files.length > 0);
    }
    upload(filepath, filename, options) {
        return new Promise((resolve, reject) => {
            const read = (0, fs_1.createReadStream)(filepath);
            const write = this.bucket.openUploadStream(filename, options);
            read.pipe(write);
            read.on('error', reject);
            write.on('error', reject);
            write.on('finish', resolve);
        });
    }
    download(id, options) {
        id = (0, common_1.toDocId)(id);
        return this.bucket.openDownloadStream(id, options);
    }
    writable(filename, options) {
        return this.bucket.openUploadStream(filename, options);
    }
    remove(id) {
        id = (0, common_1.toDocId)(id);
        return this.bucket.delete(id);
    }
}
exports.AppStorage = AppStorage;
