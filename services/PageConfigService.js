import { AppModel } from '../classes/AppModel.js';

/**
 * @typedef PageConfig
 * @property {string} [title]
 * @property {string} [description]
 * @property {string[]} [tags]
 * @property {boolean} [watermark]
 * @property {string} [theme]
 * @property {string} [templateName]
 * @property {'LIGHT', 'DARK', 'AUTO'} [themeMode]
 * @property {object} styles
 * @property {DocId} userId
 */

export class PageConfigService extends AppModel {
   get #findOptions() {
      return {
         projection: {
            userId: false,
         },
      };
   }

   constructor() {
      super('pageConfig');
   }

   /**
    * Create page config instance
    * @param {PageConfig} data
    */
   create(data) {
      return this.$insert(data);
   }

   /**
    * Returns page config
    * @param {string | DocId} id
    * @returns {PageConfig}
    */
   get(id) {
      return this.$findById(id);
   }

   /**
    * Find config by userId
    * @param {string | DocId} userId
    * @returns {Promise<PageConfig>}
    */
   findByUserId(userId) {
      userId = this.$docId(userId);
      return this.model.findOne({ userId }, this.#findOptions);
   }

   /**
    * Check for config duplication
    * @param {Partial<PageConfig>} data
    */
   isDuplicate(data) {
      const { userId } = data;
      return this.$exists({ $and: [{ userId }] });
   }

   /**
    * Update page config
    * @param {import('mongodb').Filter<Partial<PageConfig>>} filter
    * @param {Partial<PageConfig>} newData
    */
   update(filter, newData) {
      return this.model.updateOne(filter, { $set: newData });
   }

   /**
    * Removes page config record
    * @param {import('mongodb').Filter<Partial<PageConfig>>} filter
    */
   remove(filter) {
      return this.model.deleteOne(filter);
   }
}
