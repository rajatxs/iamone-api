import { Module, MiddlewareConsumer } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthMiddleware } from '../auth/auth.middleware'

@Module({
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('user')
  }
}
