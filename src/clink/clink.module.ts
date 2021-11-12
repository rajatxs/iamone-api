import { Module } from '@nestjs/common'
import { ClinkService } from './clink.service'
import { ClinkController } from './clink.controller'
import { SiteMetaService } from './site-meta.service'

@Module({
  providers: [ClinkService, SiteMetaService],
  controllers: [ClinkController],
  exports: [ClinkService]
})
export class ClinkModule { }
