import { Module, MiddlewareConsumer, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { HttpRequestMiddleware } from '../http-request/http-request.middleware'
import { SocialRefModule } from '../social-ref/social-ref.module'
import { SocialRefService } from '../social-ref/social-ref.service'
import { AuthModule } from '../auth/auth.module'
import { ClinkModule } from '../clink/clink.module'
import { ClinkService } from '../clink/clink.service'
import { SiteMetaService } from '../clink/site-meta.service'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    SocialRefModule, 
    ClinkModule,
  ],
  providers: [
    UserService,
    SocialRefService, 
    ClinkService,
    SiteMetaService
  ],
  controllers: [UserController],
  exports: [SocialRefService, UserService, ClinkService]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpRequestMiddleware)
      .forRoutes('/user')
  }
}
