import { Module, forwardRef } from '@nestjs/common'
import { ClinkService } from './clink.service'
import { ClinkController } from './clink.controller'
import { SiteMetaService } from './site-meta.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [ClinkService, SiteMetaService],
  controllers: [ClinkController],
  exports: [ClinkService, SiteMetaService]
})
export class ClinkModule { }
