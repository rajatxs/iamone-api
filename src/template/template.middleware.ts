import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TemplateService } from './template.service'
import { TemplateDataObject } from './template.interface'
import * as path from 'path'

@Injectable()
export class TemplateMiddleware implements NestMiddleware {
  private readonly logger = new Logger
  readonly publicResources = [
    'favicon.ico'
  ]
  constructor(private readonly templateService: TemplateService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    let templateData: TemplateDataObject
    let code: string

    if (username === '_' || this.publicResources.includes(username)) {
      return next()
    }

    res.setHeader('Content-Type', 'text/html')

    try {
      templateData = await this.templateService.findDataByUsername(username)

      if (templateData) {
        code = await this.templateService.compileTemplate(templateData)
      } else {
        return res.sendFile(path.join(__dirname, '../../public/404.html'))
      }
    } catch (error) {
      this.logger.error("Error while getting template data", error)
    }

    return res.status(200).send(code)
  }
}
