import { Injectable } from '@nestjs/common'
import { AppModel, timestampType } from '@classes/AppModel'
import { Filter } from 'mongodb'
import { Admin } from './admin.interface'

@Injectable()
export class AdminService extends AppModel {
   public constructor() {
      super('admins', { timestamps: timestampType.ALL })
   }

   /** Create new admin */
   public create(data: Admin) {
      return this.$insert<Admin>(data)
   }

   /** Check whether admin is exists or not with specified id */
   public has(id: string | DocId) {
      return this.$existsId<Admin>(id)
   }

   /** Check whether admin is exists or not with specified email */
   public hasEmail(email: string) {
      return this.$exists<Admin>({ email })
   }

   /** Get admin by id */
   public get(id: DocId) {
      return this.$findById<Admin>(id)
   }

   /** Find admin */
   public find(filter: Filter<Admin>) {
      return this.model.findOne<Admin>(filter)
   }

   /** Find all admins */
   public findAll(filter: Filter<Admin>) {
      return this.model.find<Admin>(filter).toArray()
   }

   /** Find admin by email */
   public findByEmail(email: string) {
      return this.model.findOne<Admin>({ email })
   }

   /** Delete admin by id */
   public delete(id: string | DocId) {
      return this.$deleteById(id)
   }
}
