import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = await context.switchToHttp().getRequest();
    const authorization = await request.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No Token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = {
        userId: payload.userId,
        fname: payload.fname,
        lname: payload.lname,
        email: payload.email,
        roleId: payload.roleId,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invaliddd Token!');
    }

    return true;
  }
}
