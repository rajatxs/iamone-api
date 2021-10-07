import { Injectable } from '@nestjs/common'
import { AppModel, timestampType } from '@classes/AppModel'
import { SocialService, PartialSocialService } from './social-service.interface'
import { Filter } from 'mongodb'

@Injectable()
export class SocialServiceProvider extends AppModel {
   public constructor() { super('socialServices', { timestamps: timestampType.ALL }) }

   /** Add new social service */
   public add(data: SocialService) {
      return this.$insert<SocialService>(data)
   }

   /** Find single servic */
   public get(id: string | DocId) {
      return this.$findById<PartialSocialService>(id)
   }

   /** Find all services */
   public findAll(filter: Filter<PartialSocialService>) {
      return this.model.find<SocialService>(filter).sort({ createdAt: 1 }).toArray()
   }

   /** Update service data */
   public update(id: string | DocId, newData: PartialSocialService) {
      return this.$updateById<PartialSocialService>(id, newData)
   }

   /** Delete one social service */
   public remove(id: string | DocId) {
      return this.$deleteById(id)
   }
}
