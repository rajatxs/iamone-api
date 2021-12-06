import { Injectable } from '@nestjs/common'
import { AppModel } from '@classes/AppModel'
import { Filter, FindOptions } from 'mongodb'
import { PageConfig, PartialPageConfig } from './page-config.interface'

@Injectable()
export class PageConfigService extends AppModel {
   protected get findOptions() {
      return <FindOptions>{
         projection: {
            userId: false
         }
      }
   }

   public constructor() {
      super('pageConfig')
   }

   public create(data: PageConfig) {
      return this.$insert<PageConfig>(data)
   }

   public get(id: string | DocId) {
      return this.$findById<PartialPageConfig>(id)
   }

   public findByUserId(userId: string | DocId) {
      userId = this.$docId(userId)
      return this.model.findOne<PartialPageConfig>({ userId }, this.findOptions)
   }

   public isDuplicate(data: PartialPageConfig) {
      const { userId } = data
      return this.$exists<PartialPageConfig>({ $and: [{ userId }] })
   }

   public update(filter: Filter<PartialPageConfig>, newData: PartialPageConfig) {
      return this.model.updateOne(filter, { $set: newData })
   }

   public remove(filter: Filter<PageConfig>) {
      return this.model.deleteOne(filter)
   }
}
