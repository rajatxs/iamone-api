import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService:AuthService) { }

   @Get('/token')
   getAccessToken(){
      return this.authService.generateAccessToken()
   }

   @Get('/verify')
   verifyAccessToken(){
      return this.authService.verifyAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFha2FzaCIsImlhdCI6MTYzMjA3MjM3NH0.B9qotwYrQsvLjjtqekMOkumZCWP2pNc8oL2b5RZxOe8")
   }
}
