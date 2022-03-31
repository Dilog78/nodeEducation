import { ArticleEntity } from "@app/article/article.entity";
import { FollowEntity } from "@app/profile/follow.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentController } from "./comment.controller";
import { CommentEntity } from "./comment.entity";
import { CommentService } from "./comment.service";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, ArticleEntity, FollowEntity])],
    controllers: [CommentController],
    providers: [CommentService],
})

export class CommentModule {}