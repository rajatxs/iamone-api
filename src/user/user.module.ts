import { Module, forwardRef, MiddlewareConsumer  } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from '../auth/auth.module'
import { HttpRequestMiddleware } from '../http-request/http-request.middleware'

@Module({
  imports: [forwardRef(() => AuthModule)],
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
