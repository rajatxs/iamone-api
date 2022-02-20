import { AppModel, TimestampType } from '../classes/AppModel.js';

/**
 * @typedef SocialLink
 * @property {string} [label]
 * @property {string} slug
 * @property {number} [index]
 * @property {string} platformKey
 * @property {DocId} userId
 */

export class SocialLinkService extends AppModel {
   get findOptions() {
      return {
         projection: {
            userId: false,
         },
      };
   }

   constructor() {
      super('socialLinks', { timestamps: TimestampType.ALL });
   }

   /**
    * Insert one social reference item
    * @param {SocialLink} data
    */
   insert(data) {
      return this.$insert(data);
   }

   /**
    * Get social ref
    * @param {string | DocId} id
    */
   get(id) {
      return this.$findById(id);
   }

   /**
    * Check whether refs is exists or not
    * @param {import('mongodb').Filter<Partial<SocialLink>>} filter
    */
   exists(filter) {
      return this.$exists(filter);
   }

   /**
    * Check for refs duplication
    * @param {Partial<SocialLink>} data
    */
   isDuplicate(data) {
      const { slug, platformKey } = data;
      return this.exists({ $and: [{ slug }, { platformKey }] });
   }

   /**
    * Count total refs
    * @param {import('mongodb').Filter<Partial<SocialLink>>} filter
    */
   count(filter) {
      return this.model.countDocuments(filter);
   }

   /**
    * Find one social link
    * @param {import('mongodb').Filter<Partial<SocialLink>>} filter
    */
   findOne(filter) {
      return this.model.findOne(filter, this.findOptions);
   }

   /**
    * Find all social refs
    * @param {import('mongodb').Filter<Partial<SocialLink>>} filter
    */
   findAll(filter) {
      return this.model
         .find(filter, this.findOptions)
         .sort({ index: 1 })
         .toArray();
   }

   /**
    * Update social ref
    * @param {import('mongodb').Filter<Partial<SocialLink>>} filter
    * @param {Partial<SocialLink>} newData
    */
   update(filter, newData) {
      return this.model.updateOne(filter, { $set: newData });
   }

   /**
    * Remove social reference item
    * @param {import('mongodb').Filter<Partial<SocialLink>>} filter
    */
   remove(filter) {
      return this.model.deleteOne(filter);
   }

   /**
    * Remove social refs by user id
    * @param {string | DocId} userId
    */
   removeManyByUserId(userId) {
      return this.model.deleteMany({ userId: this.$oid(userId) });
   }
}
