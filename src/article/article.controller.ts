import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleResponceInterface } from "./articleTypes/articleResponce.interface";
import { CreateArticleDto } from "./dto/createArticle.dto";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@User() user: UserEntity, @Body('article') articleDto: CreateArticleDto): Promise<ArticleResponceInterface> {
        const article = await this.articleService.createArticle(user, articleDto);
        return this.articleService.articleResponse(article);
    }
}