import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/user-roles/entities/user-role.entity';
@Injectable()
export class UsersService {
  constructor(
   @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await await bcrypt.hash(createUserDto?.password, 10);
    const newUser = new this.userModel({...createUserDto, password: hashedPassword});

    return await newUser.save();

  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findMe(userId: string): Promise<any> {
    return await this.userModel.findById(userId).lean().exec();
  }

  async findById(id: string) {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      console.log("error", error);
      throw error?.response?.data?.message;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).exec();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({username}).exec();
  }

   async getUserWithPermissions(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    const userRoles = await this.userRoleModel.find({userId});
    const roleIds = userRoles.map(userRole => userRole.roleId);
    const roles = await this.roleModel.find({_id: { $in: roleIds }});
    const permissions = roles.reduce((acc, role) => {
      return [...acc, ...role.permissions];
    }, []);


    return { ...user, permissions, roles }; // Return user with aggregated permissions
  }
}
