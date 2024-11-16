import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/entities/role.entity';
import { UserRole, UserRoleSchema } from './entities/user-role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: UserRole.name, schema: UserRoleSchema}])
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService]
})
export class UserRolesModule {}
