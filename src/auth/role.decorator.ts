import { SetMetadata } from '@nestjs/common'
import { Role } from './role.enum'

export const ROLES_KEY = 'role'
export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args)
