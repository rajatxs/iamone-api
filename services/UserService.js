import sharp from 'sharp';
import { ObjectId } from 'mongodb';
import { AppStorage } from '../classes/AppStorage.js';
import { AppModel, TimestampType } from '../classes/AppModel.js';
import { alphaNumeric, generateFilename } from '../utils/random.js';
import { IPFSService } from './IPFSService.js';
// import social_ref_service_1 from '../social-ref/social-ref.service';
// import clink_service_1 from '../clink/clink.service';
// import page_config_service_1 from '../page-config/page-config.service';

export class UserService extends AppModel {
   // #socialRefService = socialRefService;
   // #clinkService = clinkService;
   // #pageConfigService = pageConfigService;
   #ipfsService = new IPFSService();

   constructor() {
      super('users', { timestamps: TimestampType.ALL });
      this.userImageStorage = new AppStorage('users');
   }

   get #findOptions() {
      return {
         sort: { createdAt: -1 },
         limit: 10,
         skip: 0,
         projection: {
            passwordHash: 0,
            httpRequestId: 0,
         },
      };
   }
   async create(data) {
      data.emailVerified = false;
      data.image = null;
      return this.$insert(data);
   }
   hasEmail(email) {
      return this.$exists({ email });
   }
   hasUsername(username) {
      return this.$exists({ username });
   }
   has(id) {
      return this.$existsId(id);
   }
   get(id) {
      return this.$findById(id);
   }
   findOne(filter) {
      return this.model.findOne(filter, this.#findOptions);
   }
   findAll(filter) {
      return this.model.find(filter, this.#findOptions).toArray();
   }
   findByUsernameOrEmail(username, email) {
      return this.model.findOne({ $or: [{ username }, { email }] });
   }
   update(userId, data) {
      return this.$updateById(userId, data);
   }
   setUsername(userId, username) {
      return this.$updateById(userId, { username });
   }
   setPasswordHash(userId, passwordHash) {
      return this.$updateById(userId, { passwordHash });
   }
   setEmail(userId, email, isVerified = false) {
      return this.$updateById(userId, {
         email,
         emailVerified: isVerified,
      });
   }
   markAsVerified(userId) {
      return this.$updateById(userId, { emailVerified: true });
   }
   getImage(id, options) {
      return new Promise(async (resolve, reject) => {
         try {
            const exists = await this.userImageStorage.exists(id);
            let stream;
            if (!exists) {
               return resolve(null);
            }
            stream = this.userImageStorage.download(id, options);
            return resolve(stream);
         } catch (error) {
            reject(error);
         }
      });
   }
   async removeImage(userId) {
      const user = await this.$findById(userId);
      if ((user.image || {}) instanceof ObjectId) {
         await this.userImageStorage.remove(user.image);
         await this.update(userId, { image: null });
      }
   }
   async uploadImage(userId, file) {
      const webp = await sharp(file.buffer)
         .resize(300, 300)
         .webp({ quality: 60 })
         .toBuffer();

      const uploaded = await this.#ipfsService.addFile(webp, generateFilename('image/webp'));
      this.update(userId, { imageHash: uploaded.Hash });

      return uploaded;
   }
   async deleteById(userId) {
      // userId = this.$oid(userId);
      // await this.#socialRefService.removeManyByUserId(userId);
      // await this.#clinkService.removeManyByUserId(userId);
      // await this.removeImage(userId);
      // await this.#pageConfigService.remove({ userId });
      await this.$deleteById(userId);
      return true;
   }
}
