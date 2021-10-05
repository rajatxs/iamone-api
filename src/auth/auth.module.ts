import { Module, MiddlewareConsumer } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { JwtConfigService } from './auth-config.service'
import { HttpRequestMiddleware } from '../http-request/http-request.middleware'

@Module({
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfigService })
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpRequestMiddleware)
      .forRoutes('/user')
  }
}
