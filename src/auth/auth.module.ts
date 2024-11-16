import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRolesModule } from 'src/user-roles/user-roles.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
   imports: [
   UsersModule,
   RolesModule,
   UserRolesModule,
   PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.TOKENEXPIRESIN||'1h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
