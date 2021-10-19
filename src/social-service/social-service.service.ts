import { Injectable } from '@nestjs/common'
import { SocialService, PartialSocialService } from './social-service.interface'

@Injectable()
export class SocialServiceProvider {
   private serviceList: SocialService[]
   
   public constructor() {
      this.serviceList = require('../../data/social-services.json')
   }

   /** Get service data by key */
   public get(key: string): PartialSocialService {
      return this.serviceList.find(item => item.key === key)
   }

   /** Chech whether service is exists or not */
   public has(key: string): boolean {
      const index = this.serviceList.findIndex(item => item.key === key)
      return (index != -1)
   }

   /** Get list of services */
   public get list(): PartialSocialService[] {
      return this.serviceList
   }
}
