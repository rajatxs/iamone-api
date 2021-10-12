import { Module, MiddlewareConsumer } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { HttpRequestMiddleware } from '../http-request/http-request.middleware'

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpRequestMiddleware)
      .forRoutes('/user')
  }
}
