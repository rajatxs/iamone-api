import * as sharp from 'sharp'
import { Injectable } from '@nestjs/common'
import { 
   Filter,
   FindOptions,
   GridFSBucketReadStream, 
   GridFSBucketReadStreamOptionsWithRevision,
   ObjectId
} from 'mongodb'
import type { Sharp } from 'sharp'
import { AppStorage } from '@classes/AppStorage'
import { AppModel, timestampType } from '@classes/AppModel'
import { alphaNumeric } from '@utils/random'
import { User, MutableUserFields, PartialUser } from './user.interface'
import { SocialRefService } from '../social-ref/social-ref.service'
import { ClinkService } from '../clink/clink.service'

@Injectable()
export class UserService extends AppModel {
   protected userImageStorage = new AppStorage('users')
   protected get findOptions() {
      return <FindOptions>{
         sort: { createdAt: -1 },
         limit: 10,
         skip: 0,
         projection: {
            passwordHash: 0,
            httpRequestId: 0
         }
      }
   }

   public constructor(
      private readonly socialRefService: SocialRefService,
      private readonly clinkService: ClinkService
   ) { super('users', { timestamps: timestampType.ALL }) }

   /** Create new user account */
   public async create(data: User) {
      data.emailVerified = false
      data.image = null
      return this.$insert<User>(data)
   }

   /** Check uniqueness of email */
   public hasEmail(email: string) {
      return this.$exists({ email })
   }

   /** Check uniqueness of username */
   public hasUsername(username: string) {
      return this.$exists({ username })
   }

   /** Check existance of user by id */
   public has(id: string | DocId) {
      return this.$existsId(id)
   }

   /** Find user by _id */
   public get(id: string | DocId) {
      return this.$findById<User>(id, this.findOptions)
   }

   /** Find single user document */
   public findOne(filter: Filter<User>) {
      return this.model.findOne<User>(filter, this.findOptions)
   }

   /** Find all users */
   public findAll(filter?: Filter<User>) {
      return this.model
         .find<User>(filter, this.findOptions)
         .toArray()
   }

   /** Find user by username of email */
   public findByUsernameOrEmail(username?: string, email?: string) {
      return this.model.findOne<User>({ $or: [{ username }, { email }] })
   }

   /** Update mutable user fields */
   public update(userId: string | DocId, data: MutableUserFields) {
      return this.$updateById<MutableUserFields>(userId, data)
   }

   /** Set new username */
   public setUsername(userId: string | DocId, username: string) {
      return this.$updateById<PartialUser>(userId, { username })
   }

   public setPassword() {

   }

   /** Get profile image */
   public getImage(id: string, options?: GridFSBucketReadStreamOptionsWithRevision): Promise<GridFSBucketReadStream | null> {
      return new Promise(async (resolve, reject) => {         
         try {
            const exists = await this.userImageStorage.exists(id)
            let stream: GridFSBucketReadStream

            if (!exists) {
               return resolve(null)
            }

            stream = this.userImageStorage.download(id, options)

            return resolve(stream)
         } catch (error) {
            reject(error)
         }
      })
   }

   /** Remove profile image */
   public async removeImage(userId: string | DocId) {
      const user = await this.$findById<User>(userId)

      if ((user.image || {}) instanceof ObjectId) {
         await this.userImageStorage.remove(user.image)
         await this.update(userId, { image: null })
      }
   }

   /** Upload new profile image */
   public async uploadImage(userId: string | DocId, file: Express.Multer.File) {
      return new Promise(async (resolve, reject) => {
         const write = this.userImageStorage.writable('user-' + alphaNumeric(12), {
            contentType: 'image/webp'
         })
         let image: DocId
         let read: Sharp

         // remove existing image file
         await this.removeImage(userId)

         read = sharp(file.buffer)
            .webp({ quality: 60 })
            .resize(512, 512)

         read.pipe(write)

         read.on('error', reject)
         write.on('error', reject)

         write.on('finish', () => {
            image = write.id
            this.update(userId, { image })

            resolve(image)
         })
      })
   }

   /** Delete user generated data */
   public async deleteById(userId: string | DocId) {
      userId = this.$oid(userId)

      // remove all social refs 
      await this.socialRefService.removeManyByUserId(userId)

      // remove all clinks
      await this.clinkService.removeManyByUserId(userId)

      // remove user profile image
      await this.removeImage(userId)

      // remove user data
      await this.$deleteById(userId)

      return true
   }
}
