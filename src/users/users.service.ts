import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
}
