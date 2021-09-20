import { Injectable } from '@nestjs/common'
import { AppModalService } from '@classes/app-model'
import { HttpRequest } from './http-request.interface'

@Injectable()
export class HttpRequestService extends AppModalService {
   public constructor() { super('http_requests') }

   public save(data: HttpRequest) {
      return this.$insertOne(data)
   }
}
