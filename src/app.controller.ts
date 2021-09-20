import { Controller, HttpCode, Get } from '@nestjs/common'

@Controller()
export class AppController {

  @Get('/test')
  @HttpCode(200)
  getGreetingMessage(): ApiResponse {
    return {
      statusCode: 200,
      message: "Happy Coding!"
    }
  }
}
