import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Permissions } from 'src/auth/permissions.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('roles')
@UseGuards(RolesGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('role_create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  // @Public()
  @Get()
  @Permissions('role_read')
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(id);
  }

  @Patch(':id/permissions')
  @Permissions('role_edit')
  async assignPermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    return await this.rolesService.assignPermissions(id, permissions);
  }
}
