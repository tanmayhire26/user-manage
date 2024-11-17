import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "src/roles/entities/role.entity";
import { RolesService } from "src/roles/roles.service";
import { UserRolesService } from "src/user-roles/user-roles.service";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
   private userService: UsersService,
   private roleService: RolesService,
   private userRoleService: UserRolesService,
    private jwtService: JwtService,
    private configService: ConfigService  // Add this

  ) {
        console.log('JWT_SECRET:', this.configService.get('JWT_SECRET'));

  }

  async validateUser(username: string, password: string) {
    try{
      const user: any = await this.userService.findByUsername(username);
      console.log("user after validate ... ", user)

const isMatch = await bcrypt.compare(password, user.password);
console.log("isMatch", isMatch)

    if (user && isMatch) {
        const {password, ...result} = user;
        console.log("result", result)
      return result._doc;
    }
    return null;}
    catch (error) {
      console.log("error", error)
      throw error?.response?.data?.message
    }
  }

  async login(user: any) {
   try{ 
    console.log("entered login service fn", user);
    console.log("JWT_SECRET:", this.configService.get('JWT_SECRET'));
    const payload = { sub: user._id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  } catch (error) {
    console.log("error", error)
      throw error?.response?.data?.message
    }
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    
   try{ const userRoles = await this.userRoleService.findByUserId(userId);
    const roles = await this.roleService.findAll();
    const userRoleIds: any = userRoles.map(userRole => userRole.roleId);
    const userRolesWithPermissions = roles.filter(role => userRoleIds.includes(role?._id)).map(role => role.permissions).flat();
    return userRolesWithPermissions.includes(permission);}
     catch (error) {
      throw error?.response?.data?.message
     }
  
  }
}