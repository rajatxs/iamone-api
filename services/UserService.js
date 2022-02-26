import sharp from 'sharp';
import { AppModel, TimestampType } from '../classes/AppModel.js';
import { generateFilename } from '../utils/random.js';
import { IPFSService } from './IPFSService.js';
import { SocialLinkService } from './SocialLinkService.js';
import { LinkService } from './LinkService.js';
import { PageConfigService } from './PageConfigService.js';
import cache from '../utils/cache.js';

/**
 * @typedef User 
 * @property {string} username
 * @property {string} [fullname]
 * @property {string} [bio]
 * @property {string} [location]
 * @property {string} email
 * @property {string|null} [imageHash]
 * @property {boolean} [emailVerified]
 * @property {string} passwordHash
 */

export class UserCacheService {

   /**
    * Returns username by `userId`
    * @param {string} userId 
    * @returns {string}
    */
   static getUsername(userId) {
      return cache.get(`username:${userId}`);
   }

   /**
    * Check whether specified username exists or not
    * @param {string} userId 
    * @returns {boolean}
    */
   static containsUsername(userId) {
      return cache.has(`username:${userId}`);
   }

   /**
    * Sets `username` with specified `userId`
    * @param {string} userId 
    * @param {string} username 
    */
   static setUsername(userId, username) {
      return cache.set(`username:${userId}`, username);
   }

   /**
    * Removed username record
    * @param {string} userId 
    */
   static removeUsername(userId) {
      return cache.del(userId);
   }
}

export class UserService extends AppModel {
   #socialLinkService = new SocialLinkService();
   #linkService = new LinkService();
   #pageConfigService = new PageConfigService();
   #ipfsService = new IPFSService();

   constructor() {
      super('users', { timestamps: TimestampType.ALL });
   }

   get #findOptions() {
      return {
         sort: { createdAt: -1 },
         limit: 10,
         skip: 0,
         projection: {
            passwordHash: 0,
         },
      };
   }

   /**
    * Creates new user account
    * @param {User} data 
    */
   async create(data) {
      data.emailVerified = false;
      data.imageHash = null;
      return this.$insert(data);
   }

   /**
    * Check whether account exists with given `email` or not
    * @param {string} email 
    */
   hasEmail(email) {
      return this.$exists({ email });
   }

   /**
    * Check whether account exists with given `username` or not
    * @param {string} username 
    */
   hasUsername(username) {
      return this.$exists({ username });
   }

   /**
    * Check whether account exists with given `id` or not
    * @param {string | DocId} id 
    * @returns 
    */
   has(id) {
      return this.$existsId(id);
   }

   /**
    * Returns user document followed by `id`
    * @param {string | DocId} id 
    */
   get(id) {
      // @ts-ignore
      return this.$findById(id);
   }

   /**
    * Returns single user document
    * @param {import('mongodb').Filter<Partial<User>>} filter 
    * @returns {Promise<User>}
    */
   findOne(filter) {
      // @ts-ignore
      return this.model.findOne(filter, this.#findOptions);
   }

   /**
    * Returns all user documents
    * @param {import('mongodb').Filter<Partial<User>>} filter 
    * @returns 
    */
   findAll(filter) {
      // @ts-ignore
      return this.model.find(filter, this.#findOptions).toArray();
   }

   /**
    * Returns user document followed by `username` or `email`
    * @param {string} username 
    * @param {string} email 
    */
   findByUsernameOrEmail(username, email) {
      return this.model.findOne({ $or: [{ username }, { email }] });
   }

   /**
    * Updates user document followed by `userId`
    * @param {string|DocId} userId 
    * @param {Partial<User>} data 
    */
   update(userId, data) {
      return this.$updateById(userId, data);
   }

   /**
    * Change `username` of account followed by `userId`
    * @param {string|DocId} userId 
    * @param {string} username 
    */
   setUsername(userId, username) {
      return this.$updateById(userId, { username });
   }

   /**
    * Change `passwordHash` of account followed by `userId`
    * @param {string|DocId} userId 
    * @param {string} passwordHash 
    */
   setPasswordHash(userId, passwordHash) {
      return this.$updateById(userId, { passwordHash });
   }

   /**
    * Change `email` of account followed by `userId`
    * @param {string|DocId} userId 
    * @param {string} email
    * @param {boolean} [isVerified] 
    */
   setEmail(userId, email, isVerified = false) {
      return this.$updateById(userId, {
         email,
         emailVerified: isVerified,
      });
   }

   /**
    * Set account as verified
    * @param {string|DocId} userId  
    */
   markAsVerified(userId) {
      return this.$updateById(userId, { emailVerified: true });
   }

   /**
    * Removes profile image of user followed by `userId`
    * @param {string|DocId} userId 
    */
   async removeImage(userId) {
      const user = await this.$findById(userId);

      if (typeof user !== 'object' || !user.imageHash) {
         return;
      }
      
      await this.#ipfsService.unpinFile(user.imageHash);
      await this.update(userId, { imageHash: null });
   }

   /**
    * Uploads profile image of user followed by `userId`
    * @param {string|DocId} userId 
    * @param {Express.Multer.File} file 
    */
   async uploadImage(userId, file) {
      const webp = await sharp(file.buffer)
         .resize(300, 300)
         .webp({ quality: 60 })
         .toBuffer();

      const uploaded = await this.#ipfsService.addFile(webp, generateFilename('image/webp'));
      this.update(userId, { imageHash: uploaded.Hash });

      return uploaded;
   }

   /**
    * Removes account of user followed by `userId`
    * @param {string|DocId} userId 
    */
   async deleteById(userId) {
      userId = this.$oid(userId);
      await this.#socialLinkService.removeManyByUserId(userId);
      await this.#linkService.removeManyByUserId(userId);
      await this.removeImage(userId);
      await this.#pageConfigService.remove({ userId });
      await this.$deleteById(userId);
      return true;
   }
}
