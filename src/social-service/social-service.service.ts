import { Injectable } from '@nestjs/common'
import { AppModel } from '@classes/AppModel'
import { SocialService, PartialSocialService } from './social-service.interface'
import { Filter } from 'mongodb'

@Injectable()
export class SocialServiceProvider extends AppModel {
   public constructor() { super('socialServices') }

   /** Add new social service */
   public add(data: SocialService) {
      return this.$insert<SocialService>(data)
   }

   /** Check for service existance */
   public has(id: string | DocId) {
      return this.$existsId<PartialSocialService>(id)
   }

   /** Check whether key is exists or not */
   public hasKey(key: string) {
      return this.$exists<PartialSocialService>({ key })
   }

   /** Find single servic */
   public get(id: string | DocId) {
      return this.$findById<PartialSocialService>(id)
   }

   /** Find all services */
   public findAll(filter?: Filter<PartialSocialService>) {
      return this.model.find<SocialService>(filter).sort({ createdAt: 1 }).toArray()
   }

   /** Find service by key */
   public findByKey(key: string) {
      return this.model.findOne<PartialSocialService>({ key })
   }

   /** Check duplication for new document */
   public isDuplicate(data: SocialService) {
      const { templateUrl } = data
      return this.$exists<PartialSocialService>({ templateUrl })
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
