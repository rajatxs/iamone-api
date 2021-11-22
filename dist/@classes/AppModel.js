"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModel = exports.timestampType = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const db_1 = require("../@utils/db");
var timestampType;
(function (timestampType) {
    timestampType[timestampType["ALL"] = 1] = "ALL";
    timestampType[timestampType["CREATED_AT"] = 2] = "CREATED_AT";
    timestampType[timestampType["UPDATED_AT"] = 3] = "UPDATED_AT";
})(timestampType = exports.timestampType || (exports.timestampType = {}));
class AppModel {
    constructor(modelName, options = {}) {
        this.modelName = modelName;
        this.options = options;
        this.logger = new common_1.Logger;
        try {
            const db = (0, db_1.mongo)();
            this.model = db.collection(modelName);
        }
        catch (error) {
            this.logger.error(`Failed to instantiate <${this.modelName}> model`);
            throw new Error("Failed to serve your request");
        }
    }
    $oid(id) {
        return (id instanceof mongodb_1.ObjectId) ? id : new mongodb_1.ObjectId(id);
    }
    $docId(val) {
        return (val instanceof mongodb_1.ObjectId) ? val : new mongodb_1.ObjectId(val);
    }
    $doc(obj = {}) {
        if ('_id' in obj && typeof obj._id === 'string') {
            obj._id = new mongodb_1.ObjectId(obj._id);
        }
        else {
            obj._id = new mongodb_1.ObjectId();
        }
        if (this.options.timestamps) {
            const ts = obj._id.getTimestamp();
            switch (this.options.timestamps) {
                case timestampType.ALL:
                    obj.createdAt = obj.createdAt || ts;
                    obj.updatedAt = obj.updatedAt || ts;
                    break;
                case timestampType.CREATED_AT:
                    obj.createdAt = obj.createdAt || ts;
                    break;
                case timestampType.UPDATED_AT:
                    obj.updatedAt = obj.updatedAt || ts;
                    break;
            }
        }
        return obj;
    }
    $insert(doc) {
        doc = this.$doc(doc);
        return this.model.insertOne(doc);
    }
    $exists(query) {
        return new Promise(async (resolve, reject) => {
            let count, result = false;
            try {
                count = await this.model.countDocuments(query, { readPreference: 'nearest' });
            }
            catch (error) {
                return reject(error);
            }
            if (count > 0) {
                result = true;
            }
            resolve(result);
        });
    }
    $existsId(id) {
        return this.$exists({ _id: this.$docId(id) });
    }
    $findById(id, options) {
        return this.model.findOne({ _id: this.$docId(id) }, options);
    }
    $updateById(id, update) {
        delete update['_id'];
        return this.model.updateOne({ _id: this.$docId(id) }, { $set: update });
    }
    $deleteById(id) {
        return this.model.deleteOne({ _id: this.$docId(id) });
    }
}
exports.AppModel = AppModel;
