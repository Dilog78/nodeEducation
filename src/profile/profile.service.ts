import { UserEntity } from "@app/user/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FollowEntity } from "./follow.entity";
import { ProfileType } from "./types/profile.type";
import { ProfileResponseInterface } from "./types/profileResponse.interface";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>
    ){}

    async getProfile( id: number, profileName: string): Promise<ProfileType> {
        const user = await this.userRepository.findOne({username: profileName});

        if(!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
        }

        const follow = await this.followRepository.findOne({followerId: id, followingId: user.id})

        return { ...user, following: Boolean(follow) };

    }

    async followProfile(userId: number, profileName: string): Promise<ProfileType> {
        const user = await this.userRepository.findOne({username: profileName});

        if(!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
        }

        if(userId === user.id) {
            throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followRepository.findOne({
            followerId: userId,
            followingId: user.id,
        });

        if(!follow) {
            const followCreate = new FollowEntity();
            followCreate.followerId = userId;
            followCreate.followingId = user.id;
            await this.followRepository.save(followCreate);
        }

        return {...user, following: true};
    }

    async UnFollow( userId: number, profileName: string):Promise<ProfileType> {

        const user = await this.userRepository.findOne({username: profileName});

        if(!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
        }

        if(userId === user.id) {
            throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST);
        }

        const follow = await this.followRepository.findOne({
            followerId: userId,
            followingId: user.id,
        });

        await this.followRepository.delete({followerId: userId, followingId: user.id});

        return {...user, following: false};
    }

    profileResponce(profile: ProfileType): ProfileResponseInterface {
        delete profile.email;
        return { profile };
    }

}