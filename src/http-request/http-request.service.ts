import { Injectable } from '@nestjs/common'
import { AppModel, timestampType } from '@classes/AppModel'
import { HttpRequest } from './http-request.interface'

@Injectable()
export class HttpRequestService extends AppModel {
   public constructor() { super('httpRequests', { timestamps: timestampType.CREATED_AT }) }

   /** Save HTTP request */
   public save(data: HttpRequest) {
      return this.$insert<HttpRequest>(data)
   }
}
