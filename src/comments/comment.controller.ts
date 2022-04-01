import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommRespInterface } from "./types/commResponse.interface";
import { UserCommType } from "./types/userComm.type";

@Controller('articles/:slug/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService){}

    @Post()
    @UseGuards(AuthGuard)
    async createComment(@User() user: UserCommType, @Body('comment') body: string): 
    Promise<CommRespInterface> {
        return  await this.commentService.createComment(user, body);
    }

    @Get()
    async getComments(@User() user: UserCommType, @Param('slug') slug: string):
    Promise<CommRespInterface> {
        return await this.commentService.getComments(user, slug);
    }

}