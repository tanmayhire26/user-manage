import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRolesModule } from 'src/user-roles/user-roles.module';
import { JwtService } from '@nestjs/jwt';

@Module({
   imports: [
   UsersModule,
   RolesModule,
   UserRolesModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
