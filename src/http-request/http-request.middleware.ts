import { Injectable, NestMiddleware, InternalServerErrorException, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { InsertOneResult } from 'mongodb'
import { HttpRequestService } from './http-request.service'
import { HttpRequest, PartialHttpRequest } from './http-request.interface'

/** Save incoming HTTP request record */
@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
  private readonly httpRequest = new HttpRequestService
  private readonly logger = new Logger(HttpRequestMiddleware.name)

  async use(req: Request, res: Response, next: NextFunction) {
    let payload: PartialHttpRequest = {}
    let result: InsertOneResult, requestId: DocId

    payload.url_path = req.locals.urlPath
    payload.ip = req.ip
    payload.origin = req.header('origin') || req.header('host')
    payload.user_agent = req.header('user-agent')
    payload.lang = req.acceptsLanguages()[0]

    try {
      result = await this.httpRequest.save(<HttpRequest>payload)
      requestId = <DocId>result.insertedId
      this.logger.log(`Request received ${requestId}`)
    } catch (error) {
      this.logger.error("Failed to create HTTP request", error)
      return next(
        new InternalServerErrorException({
          statusCode: 500,
          message: "Something went wrong",
          code: 'x42121174'
        })
      )
    }

    req.locals.requestId = requestId
    res.setHeader('X-Request-Id', requestId.toString())

    next()
  }
}
