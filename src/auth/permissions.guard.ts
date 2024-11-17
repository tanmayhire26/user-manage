import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true; 
    }
    console.log(
      'REquired permissions in canActicvate guards .. ',requiredPermissions,
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("User in requ ... ", user);

    return user && user.permissions && requiredPermissions.every(permission => user.permissions.includes(permission));
  }
}
