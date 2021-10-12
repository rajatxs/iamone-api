import { Module, forwardRef } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
   imports: [forwardRef(() => AuthModule)],
   providers: [AdminService],
   controllers: [AdminController],
   exports: [AdminService]
})
export class AdminModule {}
