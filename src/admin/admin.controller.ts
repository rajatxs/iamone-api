import * as bcrypt from 'bcryptjs'
import {
   Controller,
   Post,
   Delete,
   Body,
   Logger,
   UsePipes,
   InternalServerErrorException,
   BadRequestException,
   NotFoundException,
   Param
} from '@nestjs/common'
import { Role } from '../auth/role.enum'
import { Roles } from '../auth/role.decorator'
import { DeleteResult, InsertOneResult } from 'mongodb'
import { JoiValidationPipe } from '@pipes/validation'
import { setPasswordHash } from '@utils/common'
import env from '@utils/env'
import { AdminService } from './admin.service'
import { Admin, AdminCredentials } from './admin.interface'
import { RegisteredAuthTokenResponse } from '../auth/auth.interface'
import { AuthService } from '../auth/auth.service'
import { createAdminSchema, authTokenRequestAdminSchema } from './admin.schema'

@Controller('admin')
export class AdminController {
   private readonly logger = new Logger
   constructor(
      private readonly adminService: AdminService,
      private readonly authService: AuthService
   ) { }

   @Post('register')
   @Roles(Role.Admin)
   @UsePipes(new JoiValidationPipe(createAdminSchema))
   async createNewAdmin(@Body() data: Admin): Promise<ApiResponse> {
      let newAdmin: InsertOneResult, insertedId: DocId, result: RegisteredAuthTokenResponse, admin: Admin

      console.log("CONTROLLER CALLED");

      if (await this.adminService.hasEmail(data.email)) {
         throw new BadRequestException("Given email address is already in use")
      }

      try {
         data = await setPasswordHash<Admin>(data)
         newAdmin = await this.adminService.create(data)
         insertedId = newAdmin.insertedId

         this.logger.log(`Admin created ${insertedId}`)

         // get newly created user
         admin = await this.adminService.get(insertedId)

         result = await this.authService.generateAdminUserAuthToken({
            id: insertedId.toString(),
            name: data.fullname,
            email: data.email
         }, data.email)
      } catch (error) {
         this.logger.error("Error while creating new admin", error)
         throw new InternalServerErrorException("Failed to create new admin")
      }

      return {
         statusCode: 201,
         message: "Admin created",
         result
      }
   }

   @Post('token')
   @Roles(Role.Anonymous)
   @UsePipes(new JoiValidationPipe(authTokenRequestAdminSchema))
   async generateAuthToken(@Body() data: AdminCredentials): Promise<ApiResponse> {
      const { email, password } = data
      let admin: Admin, isPasswordCorrect = false, result: RegisteredAuthTokenResponse

      try {
         admin = await this.adminService.findByEmail(email)
      } catch (error) {
         this.logger.error("Error while getting admin data", error)
         throw new InternalServerErrorException("Failed to get your account data")
      }

      if (!admin) {
         throw new NotFoundException("Admin account not registered with given email")
      }

      try {
         isPasswordCorrect = await bcrypt.compare(password, admin.passwordHash)
      } catch (error) {
         this.logger.error("Error while decode user password", error)
         throw new InternalServerErrorException("Failed to decrypt your credentials")
      }

      if (!isPasswordCorrect) {
         throw new BadRequestException("Incorrect password")
      }

      try {
         result = await this.authService.generateAdminUserAuthToken({
            id: admin._id.toString(),
            email: admin.email,
            name: admin.fullname
         }, admin.email)
      } catch (error) {
         this.logger.error("Error while generating auth token", error)
         throw new InternalServerErrorException("Failed to create your authentication key")
      }

      return {
         statusCode: 201,
         message: "Auth token successfully generated",
         result
      }
   }

   @Delete(':id')
   @Roles(Role.Admin)
   async deleteAdmin(@Param('id') adminId: string | DocId): Promise<ApiResponse> {
      let result: DeleteResult

      try {
         result = await this.adminService.delete(adminId)         
      } catch (error) {
         this.logger.error("Error while delete admin", error)
         throw new InternalServerErrorException("Failed to delete admin account")
      }

      if (result.deletedCount === 0) {
         throw new NotFoundException("Admin not found")
      }

      return {
         statusCode: 200,
         message: "Admin has been deleted"
      }
   }
}
