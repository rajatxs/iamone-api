import { Injectable } from '@nestjs/common'
import { SocialRef } from './social-ref.interface'
import { AppModel, timestampType } from '@classes/AppModel'
import { PartialSocialRef } from './social-ref.interface'
import { Filter, FindOptions } from 'mongodb'

@Injectable()
export class SocialRefService extends AppModel {
   protected get findOptions() {
      return <FindOptions>{
         projection: {
            userId: false
         }
      }
   }

   public constructor() {
      super('socialRefs', { timestamps: timestampType.ALL })
   }

   /** Insert one social reference item */
   public insert(data: SocialRef) {
      return this.$insert<SocialRef>(data)
   }

   /** Get social ref */
   public get(id: string | DocId) {
      return this.$findById<PartialSocialRef>(id)
   }

   /** Check whether refs is exists or not */
   public exists(filter: Filter<PartialSocialRef>) {
      return this.$exists<PartialSocialRef>(filter)
   }

   /** Check for refs duplication */
   public isDuplicate(data: PartialSocialRef) {
      const { slug, socialServiceKey } = data
      return this.exists({ $and: [{ slug }, { socialServiceKey }] })
   }

   /** Count total refs */
   public count(filter: Filter<PartialSocialRef>) {
      return this.model.countDocuments(filter)
   }

   /** Find one social link */
   public findOne(filter: Filter<PartialSocialRef>) {
      return this.model.findOne<PartialSocialRef>(filter, this.findOptions)
   }

   /** Find all social refs */
   public findAll(filter: Filter<PartialSocialRef>) {
      return this.model
         .find<PartialSocialRef>(filter, this.findOptions)
         .sort({ index: 1 })
         .toArray()
   }

   /** Update social ref */
   public update(filter: Filter<PartialSocialRef>, newData: PartialSocialRef) {
      return this.model.updateOne(filter, { $set: newData })
   }

   /** Remove social reference item */
   public remove(filter: Filter<PartialSocialRef>) {
      return this.model.deleteOne(filter)
   }
}
