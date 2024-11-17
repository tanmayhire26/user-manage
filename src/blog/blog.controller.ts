import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Permissions } from 'src/auth/permissions.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Request } from 'express';

@Controller('blog')
@UseGuards(RolesGuard, PermissionsGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  // @Roles('author')
  @Permissions('blog_create')
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: any) {
    return this.blogService.create(createBlogDto, req.user._id);
  }

  @Get()
  @Permissions('blog_read')
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @Permissions('blog_read')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @Roles('author')
  @Permissions('blog_edit')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: any,
  ) {
    return this.blogService.update(id, updateBlogDto, req.user._id);
  }

  @Delete(':id')
  @Roles('author')
  @Permissions('blog_delete')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.blogService.remove(id, req.user._id);
  }
}
