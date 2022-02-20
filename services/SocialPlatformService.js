import socialPlatformList from '../data/social-platforms.js';

export class SocialPlatformService {
   /**
    * Get service data by key
    * @param {string} key
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

   /** Get list of services */
   get list() {
      return socialPlatformList;
   }
}
