import { Injectable } from "@nestjs/common";
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