import { FollowEntity } from "@app/profile/follow.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { UserCommType } from "./types/userComm.type";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>,
    ){}

    async createComment(user: UserCommType, slag: string, body: string): Promise<CommentEntity> {

        const comment = new CommentEntity;

        Object.assign(comment, body);

        const follow = await this.followRepository.findOne({followingId: user.id});
        user.following = Boolean(follow);

        comment.author = user;
        

        await this.commentRepository.save(comment);

        delete comment.author.id;
        delete comment.author.email;

        return comment;
    }
}