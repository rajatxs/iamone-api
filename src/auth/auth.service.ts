import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
   public constructor(private readonly jwtService: JwtService) { }

   public generateAccessToken() {
      return this.jwtService.sign({id:"aakash"})
   }

   public verifyAccessToken(token:string) {
      return this.jwtService.verify(token)
   }
}
