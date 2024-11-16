import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "src/roles/entities/role.entity";
import { RolesService } from "src/roles/roles.service";
import { UserRolesService } from "src/user-roles/user-roles.service";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
   private userService: UsersService,
   private roleService: RolesService,
   private userRoleService: UserRolesService,
      private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user: any = await this.userService.findByUsername(username);

const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
        const {password, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    
    const userRoles = await this.userRoleService.findByUserId(userId);
    const roles = await this.roleService.findAll();
    const userRoleIds: any = userRoles.map(userRole => userRole.roleId);
    const userRolesWithPermissions = roles.filter(role => userRoleIds.includes(role?._id)).map(role => role.permissions).flat();
    return userRolesWithPermissions.includes(permission);
  
  }
}