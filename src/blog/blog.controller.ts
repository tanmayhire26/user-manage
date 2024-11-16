import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Permissions } from 'src/auth/permissions.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';

@Controller('blog')
@UseGuards(RolesGuard, PermissionsGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Roles('author') 
  @Permissions('create_blog')
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }
   @Permissions('read_blog')
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
