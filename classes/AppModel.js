import { ObjectId } from 'mongodb';
import { mongo } from '../utils/mongo.js';
import logger from '../utils/logger.js';

export const TimestampType = {
   ALL: 1,
   CREATED_AT: 2,
   UPDATED_AT: 3,
};

export class AppModel {

   /** @type {import('mongodb').Collection} */
   model = null;

   /**
    * @param {string} modelName
    * @param {ModelInitOptions} options
    */
   constructor(modelName, options = {}) {
      this.modelName = modelName;
      this.options = options;

      try {
         const db = mongo();
         this.model = db.collection(modelName);
      } catch (error) {
         logger.error(`Failed to instantiate <${this.modelName}> model`);
         throw new Error('Failed to serve your request');
      }
   }

   /**
    * Convert to ObjectId
    * @type {string | DocId} id
    * @returns {ObjectId}
    */
   $oid(id) {
      return id instanceof ObjectId ? id : new ObjectId(id);
   }

   /**
    * Convert to ObjectId
    * @type {string | ObjectId} val
    * @returns {ObjectId}
    */
   $docId(val) {
      return val instanceof ObjectId ? val : new ObjectId(val);
   }

   /** To regular document */
   $doc(obj = {}) {
      // to ObjectId
      if ('_id' in obj && typeof obj._id === 'string') {
         obj._id = new ObjectId(obj._id);
      } else {
         obj._id = new ObjectId();
      }

      // attach timestamps
      if (this.options.timestamps) {
         const ts = obj._id.getTimestamp();

         switch (this.options.timestamps) {
            case TimestampType.ALL:
               obj.createdAt = obj.createdAt || ts;
               obj.updatedAt = obj.updatedAt || ts;
               break;

            case TimestampType.CREATED_AT:
               obj.createdAt = obj.createdAt || ts;
               break;

            case TimestampType.UPDATED_AT:
               obj.updatedAt = obj.updatedAt || ts;
               break;
         }
      }

      return obj;
   }

   /** Insert single document */
   $insert(doc) {
      doc = this.$doc(doc);
      return this.model.insertOne(doc);
   }

   /**
    * Document existence
    * @returns {Promise<boolean>}
    */
   $exists(query) {
      return new Promise(async (resolve, reject) => {
         let count,
            result = false;

         try {
            count = await this.model.countDocuments(query, {
               readPreference: 'nearest',
            });
         } catch (error) {
            return reject(error);
         }

         if (count > 0) {
            result = true;
         }

         resolve(result);
      });
   }

   /**
    * Check document existance by id
    * @param {string | DocId} id
    */
   $existsId(id) {
      return this.$exists({ _id: this.$docId(id) });
   }

   /**
    * Find single document by id
    * @param {string | DocId} id
    * @param {import('mongodb').FindOptions} [options]
    */
   $findById(id, options) {
      return this.model.findOne({ _id: this.$docId(id) }, options);
   }

   /**
    * Update single document by id
    * @param {string | DocId} id
    * @param {object} update
    */
   $updateById(id, update) {
      delete update['_id'];

      return this.model.updateOne({ _id: this.$docId(id) }, { $set: update });
   }

   /**
    * Delete single document by id
    * @param {string | DocId} id
    */
   $deleteById(id) {
      return this.model.deleteOne({ _id: this.$docId(id) });
   }
}
