import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')

export class AuthController {
      constructor(private readonly authService: AuthService) {}

      @Post('login')
        async login(@Body() loginDto: {username: string, password: string}) {
            console.log("loginDto", loginDto)
           try{ 
            const user =  await this.authService.validateUser(loginDto.username, loginDto.password);
            if(!user) {
                throw "Invalid credentials";
            }
            const result =  await this.authService.login(user);
            console.log(result);
            return result
        }catch(e){
                console.log(e)
                throw e?.response?.data?.message
            }
        }

}