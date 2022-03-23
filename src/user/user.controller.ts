import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { LoginUserDto } from "./dto/login.dto";
import { UserDto } from "./dto/user.dto";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { UserResponseInterface } from "./types/userRes.interface";
import { UserService } from "./user.service";


@Controller()
export class UserController{
    constructor(private readonly userService: UserService){}
    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: UserDto):Promise<UserResponseInterface>{
         const user = await this.userService.createUser(createUserDto);
         return this.userService.userResponse(user);
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async login(@Body('user') loginDto: LoginUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.login(loginDto);
        return this.userService.userResponse(user);
    }

    @Get('user')
    async currentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInterface> {
        console.log(request.headers, request.user);
        // return this.userService.userResponse(request.user);
        return request.user as any;
    }
}