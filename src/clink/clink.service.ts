import { Injectable } from '@nestjs/common'
import { AppModel, timestampType } from '@classes/AppModel'
import { SiteMetaService } from './site-meta.service'
import { CLink, PartialCLink, SiteMetadata } from './clink.interface'
import { Filter, FindOptions } from 'mongodb'

@Injectable()
export class ClinkService extends AppModel {
   get findOptions(): FindOptions<CLink> {
      return {
         projection: {}
      }
   }

   public constructor(private readonly siteMetaService: SiteMetaService) {
      super('clinks', { timestamps: timestampType.ALL })
   }

   /** Find all Custom links */
   public findAll(filter: Filter<CLink>) {
      return this.model.find<CLink>(filter, this.findOptions).toArray()
   }

   /** Get custom link data by id */
   public get(id: string | DocId) {
      return this.$findById<CLink>(id)
   }

   /** Check whether link is exists or not */
   public has(id: string | DocId) {
      return this.$existsId(id)
   }

   /** Add new clink */
   public add(data: CLink) {
      return this.$insert<CLink>(data)
   }

   /** Count total custom links */
   public count(filter: Filter<CLink>) {
      return this.model.countDocuments(filter)
   }

   /** Check whether custom link is duplicated or not */
   public isDuplicate(data: CLink) {
      const { userId, href } = data

      return this.$exists<CLink>({
         $and: [{ userId }, { href }]
      })
   }

   /** Update link data by id */
   public update(id: string | DocId, data: PartialCLink) {
      return this.$updateById(id, data)
   }

   /** Remove link by id */
   public remove(id: DocId) {
      return this.$deleteById(id)
   }

   /** Fetch site metadata from URL */
   public async fetchSiteMetadata(url: string): Promise<SiteMetadata> {
      const content = await this.siteMetaService.fetch(url)
      const data: SiteMetadata = this.siteMetaService.extract(url, content)

      return data
   }
}
