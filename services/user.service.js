import { mongo } from '../utils/mongo.js';
import { AppModel, TimestampType } from '../classes/AppModel.js';
import { IPFSService } from './ipfs.service.js';
import { SocialLinkService } from './social-link.service.js';
import { LinkService } from './link.service.js';
import { PageConfigService } from './page-config.service.js';

/**
 * @typedef User 
 * @property {string} username
 * @property {string} [fullname]
 * @property {string} [bio]
 * @property {string} [location]
 * @property {string} email
 * @property {string|null} [imageHash]
 * @property {string|null} [image]
 * @property {boolean} [emailVerified]
 * @property {string} passwordHash
 */

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
    * Returns user document followed by `username` or `email`
    * @param {string} username 
    * @param {string} email 
    */
   findByUsernameOrEmail(username, email) {
      return this.model.findOne({ $or: [{ username }, { email }] });
   }

   /**
    * Returns user's profile followed by `userId`
    * @param {string | DocId} userId 
    */
   getProfile(userId) {
      return new Promise((resolve, reject) => {
         userId = this.$docId(userId);

         mongo()
            .collection('user_profiles')
            .findOne(
               { _id: userId },
               (error, result) => {
                  if (error) {
                     return reject(error);
                  }

                  resolve(result);
               }
            )
      })
   }

   /**
    * Returns user's data by `userId`
    * @param {string|DocId} userId 
    */
   getData(userId) {      
      return new Promise((resolve, reject) => {
         userId = this.$docId(userId);

         mongo()
            .collection('user_data')
            .findOne(
               { 'user._id': userId },
               (error, result) => {
                  if (error) {
                     return reject(error);
                  }

                  resolve(result);
               }
            )
      })
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
    * Removes account of user followed by `userId`
    * @param {string|DocId} userId 
    */
   async deleteById(userId) {
      userId = this.$oid(userId);
      await this.#socialLinkService.removeManyByUserId(userId);
      await this.#linkService.removeManyByUserId(userId);
      await this.#pageConfigService.remove({ userId });
      await this.$deleteById(userId);
      return true;
   }
}
