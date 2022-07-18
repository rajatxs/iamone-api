import { createHmac } from 'crypto';
import { IMAGEKIT_PRIVATE_KEY } from '../utils/env.js';

export class UtilityService {

   /**
    * Returns authentication signature for ImageKit
    * @param {string} token 
    * @param {number | string} expire 
    */
   generateImageKitSignature(token, expire) {
      let signature = createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
         .update(token + expire)
         .digest('hex');

      return {
         token,
         expire,
         signature
      };
   }
}
