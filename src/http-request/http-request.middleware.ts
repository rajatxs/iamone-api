import { Injectable, NestMiddleware, InternalServerErrorException, Logger} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { HttpRequestService } from './http-request.service'
import { HttpRequest, PartialHttpRequest } from './http-request.interface'
import { OkPacket } from 'mysql'

@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
  private readonly httpRequest = new HttpRequestService
  private readonly logger = new Logger(HttpRequestMiddleware.name)

  async use(req: Request, res: Response, next: NextFunction) {
    let payload: PartialHttpRequest = {}
    let packet: OkPacket, requestId: RowId

    payload.url_path = req.locals.urlPath
    payload.ip = req.ip
    payload.origin = req.header('origin') || req.header('host')
    payload.user_agent = req.header('user-agent')
    payload.lang = req.acceptsLanguages()[0]

    try {
      packet = await this.httpRequest.save(<HttpRequest>payload)
      requestId = <RowId>packet.insertId
      this.logger.log("Request created: " + requestId)
    }
    catch (error) {
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
    res.setHeader('X-Request-Id', String(requestId))

    next()
  }
}
