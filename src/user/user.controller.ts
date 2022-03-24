import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { LoginUserDto } from "./dto/login.dto";
import { UserDto } from "./dto/user.dto";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { UserResponseInterface } from "./types/userRes.interface";
import { UserService } from "./user.service";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.Dto";


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
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
        return this.userService.userResponse(user);
    }

    @Put('user')
    @UseGuards(AuthGuard)
    async updateUser(@User('id') userId: number, @Body('user') updateUser: UpdateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.updateUser(userId, updateUser);
        return this.userService.userResponse(user);
    } 
}