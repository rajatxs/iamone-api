import { Injectable } from '@nestjs/common'
import { HttpRequest } from './http-request.interface'

@Injectable()
export class HttpRequestService {
   public save(data: HttpRequest) {
      return {}
   }
}
