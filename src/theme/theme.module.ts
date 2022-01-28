import { Module } from '@nestjs/common'
import { ThemeService } from './theme.service'
import { ThemeController } from './theme.controller'
import { PageConfigService } from "../page-config/page-config.service"

@Module({
  providers: [ThemeService, PageConfigService],
  controllers: [ThemeController]
})
export class ThemeModule {}
