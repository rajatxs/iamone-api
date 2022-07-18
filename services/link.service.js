import { AppModel, TimestampType } from '../classes/AppModel.js';

/** @typedef {'simple' | 'thumb' | 'background' | 'card' | 'grid' | 'slider'} LinkLayout */
/**
 * @typedef LinkItem
 * @property {string} [thumb]
 * @property {string} title
 * @property {number} [index]
 * @property {string} [description]
 * @property {string} href
 * @property {LinkLayout} [style]
 * @property {string} [favicon]
 * @property {DocId} userId
 */

export class LinkService extends AppModel {
   get findOptions() {
      return {
         projection: {},
      };
   }

   constructor() {
      super('links', { timestamps: TimestampType.ALL });
   }

   /**
    * Find one link
    * @param {import('mongodb').Filter<Partial<LinkItem>>} filter
    */
   findOne(filter) {
      return this.model.findOne(filter, this.findOptions);
   }

   /**
    * Find all links
    * @param {import('mongodb').Filter<Partial<LinkItem>>} filter
    */
   findAll(filter) {
      return this.model.find(filter, this.findOptions).toArray();
   }

   /**
    * Get custom link data by id
    * @param {string | DocId} id
    */
   get(id) {
      return this.$findById(id);
   }

   /**
    * Check whether link is exists or not
    * @param {string | DocId} id
    */
   has(id) {
      return this.$existsId(id);
   }

   /**
    * Add new link
    * @param {LinkItem} data
    */
   add(data) {
      return this.$insert(data);
   }

   /**
    * Count total custom links
    * @param {import('mongodb').Filter<Partial<LinkItem>>} filter
    */
   count(filter) {
      return this.model.countDocuments(filter);
   }

   /**
    * Check whether custom link is duplicated or not
    * @param {Partial<LinkItem>} data
    */
   isDuplicate(data) {
      const { userId, href } = data;

      return this.$exists({
         $and: [{ userId }, { href }],
      });
   }
   
   /**
    * Update link
    * @param {import('mongodb').Filter<Partial<LinkItem>>} filter
    * @param {Partial<LinkItem>} newData
    */
   update(filter, newData) {
      return this.model.updateOne(filter, { $set: newData });
   }

   /**
    * Update link data by id
    * @param {string|DocId} id
    * @param {Partial<LinkItem>} data
    */
   updateById(id, data) {
      return this.$updateById(id, data);
   }

   /**
    * Remove link
    * @param {import('mongodb').Filter<Partial<LinkItem>>} filter
    */
   remove(filter) {
      return this.model.deleteOne(filter);
   }

   /**
    * Remove link by id
    * @param {DocId} id
    */
   removeById(id) {
      return this.$deleteById(id);
   }

   /**
    * Remove clinks by user id
    * @param {string | DocId} userId
    */
   removeManyByUserId(userId) {
      return this.model.deleteMany({ userId: this.$oid(userId) });
   }
}
