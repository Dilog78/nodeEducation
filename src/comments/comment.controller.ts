import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CommentEntity } from "./comment.entity";
import { CommentService } from "./comment.service";
import { UserCommType } from "./types/userComm.type";

@Controller('articles/:slug/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService){}

    @Post()
    @UseGuards(AuthGuard)
    async createComment(@User() user: UserCommType, @Param('slug') slug: string, @Body('comment') body: string): 
    Promise<CommentEntity> {
        return  await this.commentService.createComment(user, slug, body);
    }
}