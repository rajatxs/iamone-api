import { Module } from '@nestjs/common'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { AuthGuard } from './auth/auth.guard'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { SocialRefModule } from './social-ref/social-ref.module'
import { SocialServiceModule } from './social-service/social-service.module'
import { AdminModule } from './admin/admin.module'
import { TemplateModule } from './template/template.module'
import { ClinkModule } from './clink/clink.module'
import { PageConfigModule } from './page-config/page-config.module';
import { ThemeModule } from './theme/theme.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot(
      {
        serveRoot: '/_/static',
        rootPath: join(__dirname, '..', 'public')
      }, 
      { 
        serveRoot: '/_/templates',
        rootPath: join(__dirname, '..', 'templates')
      },
      { 
        serveRoot: '/_/themes',
        rootPath: join(__dirname, '..', 'themes')
      }
    ),
    UserModule,
    AuthModule,
    SocialRefModule,
    SocialServiceModule,
    AdminModule,
    ClinkModule,
    PageConfigModule,

    RouterModule.register([
      {
        path: '/_/api',
        children: [
          UserModule,
          AuthModule,
          SocialServiceModule,
          SocialRefModule,
          AdminModule,
          ClinkModule,
          PageConfigModule,
          TemplateModule,
          ThemeModule
        ]
      }
    ]),

    TemplateModule,
    ThemeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ]
})
export class AppModule { }
