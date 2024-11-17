import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private configService: ConfigService, // Add this
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: any) {
    try{console.log('payload in jwt strategy ... ', payload);
    const user = await this.userService.getUserWithPermissions(payload.sub);
    console.log("USer to append to request")
    return {...user, userId: payload.sub};}
    catch (error) {
      console.log("error in jwt strategy", error)
      throw new UnauthorizedException('Invalid token');
    }
  }
}
