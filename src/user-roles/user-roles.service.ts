import { Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRolesService {
   constructor(
    @InjectModel(UserRole.name) private UserRoleModel: Model<UserRole>
  ) {}
  async assignRole(userId: string, roleId: string) {
    const newUserRole = new this.UserRoleModel({userId, roleId});
    return await newUserRole.save();
    }

  findAll() {
    return `This action returns all userRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRole`;
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return `This action updates a #${id} userRole`;
  }

  async remove(userId: string, roleId: string) {
    return await this.UserRoleModel.findOneAndDelete({userId, roleId}).exec();
  }

  async findByUserId(userId: string) {
    return await this.UserRoleModel.find({userId}).exec();
  }
}
