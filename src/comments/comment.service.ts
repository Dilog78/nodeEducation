import { ArticleEntity } from "@app/article/article.entity";
import { FollowEntity } from "@app/profile/follow.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createQueryBuilder, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { CommRespInterface } from "./types/commResponse.interface";
import { UserCommType } from "./types/userComm.type";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>,
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
    ){}

    async createComment(user: UserCommType, body: string): Promise<CommRespInterface> {

        const comment = new CommentEntity;

        Object.assign(comment, body);

        const follow = await this.followRepository.findOne({followingId: user.id});
        user.following = Boolean(follow);

        comment.author = user;
        

        await this.commentRepository.save(comment);

        delete comment.author.id;
        delete comment.author.email;

        return { comment };
    }

    async getComments(user: UserCommType, slug: string): Promise<CommRespInterface> {

        const comments = await this.commentRepository
        .createQueryBuilder("comments")
        .leftJoinAndSelect("comments.author", "users")
        .getMany()
        

        return comments as any;
    }
}