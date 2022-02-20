import socialPlatformList from '../data/social-platforms.js';

/**
 * @typedef SocialPlatform
 * @property {string} key
 * @property {string} name
 * @property {string} [about]
 * @property {string} [website]
 * @property {string} [templateUrl]
 */

export class SocialPlatformService {
   /**
    * Get service data by key
    * @param {string} key
    * @returns {SocialPlatform}
    */
   get(key) {
      return socialPlatformList.find((item) => item.key === key);
   }

   /** Chech whether service is exists or not
    * @param {string} key
    */
   has(key) {
      const index = socialPlatformList.findIndex((item) => item.key === key);
      return index != -1;
   }

   /**
    * Get list of services
    * @returns {SocialPlatform[]}
    */
   get list() {
      return socialPlatformList;
   }
}
