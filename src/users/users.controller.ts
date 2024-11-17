import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Permissions } from 'src/auth/permissions.decorator';

@Controller('users')
@UseGuards(RolesGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('blog_read')
  // @Public()
  async findAll() {
    console.log('in find all users service');
    return await this.usersService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Get('me')
  async findMe(@Param('id') id: string) {
    return await this.usersService.findMe(id);
  }

  @Patch(':id/roles')
  @Permissions('user_edit')
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    try {
      return await this.usersService.assignRoles(id, assignRolesDto.roleIds);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Public()
  @Post('me')
  async updateMe(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateMe(req.user._id, updateUserDto);
  }
}
