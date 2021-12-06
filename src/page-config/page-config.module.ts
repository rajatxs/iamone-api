import { Module } from '@nestjs/common';
import { PageConfigService } from './page-config.service';
import { PageConfigController } from './page-config.controller';

@Module({
  providers: [PageConfigService],
  controllers: [PageConfigController]
})
export class PageConfigModule {}
