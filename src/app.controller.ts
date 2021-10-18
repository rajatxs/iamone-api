import { Controller, HttpCode, Get } from '@nestjs/common'
import { Role } from './auth/role.enum'
import { Roles } from './auth/role.decorator'

@Controller()
@Roles(Role.Anonymous)
export class AppController {

  @Get('api/test')
  @HttpCode(200)
  getGreetingMessage(): ApiResponse {
    return {
      statusCode: 200,
      message: "Happy Coding!"
    }
  }
}
