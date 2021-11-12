import { Module, MiddlewareConsumer } from '@nestjs/common'
import { TemplateService } from './template.service'
import { ClinkService } from '../clink/clink.service'
import { SiteMetaService } from '../clink/site-meta.service'
import { SocialServiceProvider } from '../social-service/social-service.service'
import { TemplateMiddleware } from './template.middleware'

@Module({
  providers: [TemplateService, SocialServiceProvider, ClinkService, SiteMetaService],
  // imports: [ClinkService]
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TemplateMiddleware)
      .forRoutes(':username')
  }
}
