import { Injectable, NestMiddleware, InternalServerErrorException, Logger} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { HttpRequestService } from './http-request.service'
import { HttpRequest, PartialHttpRequest } from './http-request.interface'

@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
  private readonly httpRequest = new HttpRequestService
  private readonly logger = new Logger(HttpRequestMiddleware.name)

  async use(req: Request, res: Response, next: NextFunction) {
    next()
  }
}
