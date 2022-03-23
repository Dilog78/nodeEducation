import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { UserEntity } from "./user.entity";
import {sign} from "jsonwebtoken";
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userRes.interface";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}
    async createUser(UserDto: UserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({email: UserDto.email});
        const userByUsername = await this.userRepository.findOne({ username: UserDto.username});
        if (userByEmail || userByUsername){
            throw new HttpException('Email or ussername are taken', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const newUser = new UserEntity();
        Object.assign(newUser, UserDto);
        return await this.userRepository.save(newUser)
    }

    generateJwt(user: UserEntity): string{
        return sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
        }, 
        JWT_SECRET
      );
    }

    userResponse(user: UserEntity): UserResponseInterface {
        return {
            user:{
                ...user,
                token: this.generateJwt(user),
            }
        }
    }
}