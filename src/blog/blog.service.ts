import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>
  ) {}

  async create(createBlogDto: CreateBlogDto, userId: string) {
    const blog = new this.blogModel({
      ...createBlogDto,
      author: new Types.ObjectId(userId)
    });
    return await blog.save();
  }

  async findAll() {
    return await this.blogModel.find({ isActive: true })
      .populate('author')
      .exec();
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id)
      .populate('author', 'username email')
      .exec();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, userId: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.author.toString() !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }

    return await this.blogModel.findByIdAndUpdate(
      id,
      updateBlogDto,
      { new: true }
    ).exec();
  }

  async remove(id: string, userId: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own blogs');
    }

    // Soft delete
    return await this.blogModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();
  }
}
