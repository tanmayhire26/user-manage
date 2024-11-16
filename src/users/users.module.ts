import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRolesModule } from 'src/user-roles/user-roles.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserRole, UserRoleSchema } from 'src/user-roles/entities/user-role.entity';
import { Role, RoleSchema } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }]),
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),

    UserRolesModule,
    RolesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
