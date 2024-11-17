import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/user-roles/entities/user-role.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await await bcrypt.hash(createUserDto?.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

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
      console.log('error', error);
      throw error?.response?.data?.message;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username }).exec();
  }

  async getUserWithPermissions(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .lean()
      .exec();



    if (!user) {
      throw new NotFoundException('User not found');
    }
    const roles = await this.roleModel.find({
      _id: { $in: user.roles },
      isActive: true,
    }).lean().exec();

    // Extract unique permissions from all roles
    const permissions = [...new Set(
     roles.flatMap((role:any) => role.permissions)
    )];

    return {
      ...user,
      permissions,
      roles
    };
  }

  async assignRoles(userId: string, roleIds: Types.ObjectId[]): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const roles = await this.roleModel.find({
        _id: { $in: roleIds },
        isActive: true,
      });

      if (roles.length !== roleIds.length) {
        throw new BadRequestException(
          'One or more roles are invalid or inactive',
        );
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, { roles: roleIds }, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error?.response?.data.message);
    }
  }

  async updateMe(userId: string, updateUserDto: UpdateUserDto) {
    const safeUpdateDto = this.sanitizeUpdateDto(updateUserDto);
    
    return await this.userModel
      .findByIdAndUpdate(userId, safeUpdateDto, { new: true })
      .select('-password')  
      .exec();
  }

  private sanitizeUpdateDto(dto: UpdateUserDto) {
    const { password, roles, ...safeDto } = dto;
    return safeDto;
  }
}
