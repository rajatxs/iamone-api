import { Module, MiddlewareConsumer } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { HttpRequestMiddleware } from '../http-request/http-request.middleware'
import { SocialRefModule } from '../social-ref/social-ref.module'
import { SocialRefService } from '../social-ref/social-ref.service'

@Module({
  imports: [SocialRefModule],
  providers: [SocialRefService, UserService],
  controllers: [UserController],
  exports: [SocialRefService, UserService]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpRequestMiddleware)
      .forRoutes('/user')
  }
}
