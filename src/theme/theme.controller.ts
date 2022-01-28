import { Controller, Get, Header, Param, InternalServerErrorException } from '@nestjs/common'
import { ThemeService } from './theme.service'
import { PageConfigService } from '../page-config/page-config.service'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'

@Controller('theme')
export class ThemeController {
   constructor(
      public themeService: ThemeService,
      public pageConfigService: PageConfigService
   ) { }

   @Get(':configId')
   @Roles(Role.Anonymous)
   @Header('Content-Type', 'text/css')
   async getThemeSource(@Param('configId') configId: string) {
      let code = ''

      try {
         const { theme, styles } = await this.pageConfigService.get(configId)
         code = await this.themeService.compile(theme, styles)
      } catch (error) {
         throw new InternalServerErrorException("Failed to get theme")
      }

      return code
   }
}
