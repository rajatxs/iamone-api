import { Controller, HttpCode, Res, Get } from '@nestjs/common'
import { Role } from './auth/role.enum'
import { Roles } from './auth/role.decorator'
import { Response } from 'express'
import * as path from 'path'

@Controller()
@Roles(Role.Anonymous)
export class AppController {

  @Get('/')
  getHomePage(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '../public/index.html'))
  }

  @Get('/_/api/test')
  @HttpCode(200)
  getGreetingMessage(): ApiResponse {
    return {
      statusCode: 200,
      message: "Happy Coding!"
    }
  }
}
