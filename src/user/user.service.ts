import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { UserEntity } from "./user.entity";


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
}