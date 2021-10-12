import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { SocialRefModule } from './social-ref/social-ref.module'
import { SocialServiceModule } from './social-service/social-service.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    SocialRefModule,
    SocialServiceModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
