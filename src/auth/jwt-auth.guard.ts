import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Is public route:', isPublic);
    console.log('Request path:', context.switchToHttp().getRequest().url);

    if (isPublic) {
      return true;
    }

    try {
      const canActivate = await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      console.log('JWT Auth Guard - Token:', request.headers.authorization);
      console.log('JWT Auth Guard - User:', request.user);
      return canActivate as boolean;
    } catch (error) {
      console.log('JWT Auth Guard - Error:', error);
      throw new UnauthorizedException('Token validation failed: ' + error.message);
    }
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('Handle Request - Error:', err);
    console.log('Handle Request - User:', user);
    console.log('Handle Request - Info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('User not authenticated');
    }
    return user;
  }
} 