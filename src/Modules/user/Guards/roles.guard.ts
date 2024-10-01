import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/shared/enums/user-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roleId) {
      throw new ForbiddenException('Access Denied!');
    }

    const hasRole = roles.includes(user.roleId);
    if (!hasRole) {
      throw new ForbiddenException('Permission Denied!');
    }

    return true;
  }
}
