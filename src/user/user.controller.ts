import { Body, Controller, Post } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { UserResponseInterface } from "./types/userRes.interface";
import { UserService } from "./user.service";


@Controller()
export class UserController{
    constructor(private readonly userService: UserService){}
    @Post('users')
    async createUser(@Body('user') createUserDto: UserDto):Promise<UserResponseInterface>{
         const user = await this.userService.createUser(createUserDto);
         return this.userService.userResponse(user);
    }
}