import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";
import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { ArticleResponseInterface } from "./articleTypes/articleResponse.interface";
import { ArticlesResponseInterface } from "./articleTypes/articlesResponse.interface";
import { CreateArticleDto } from "./dto/createArticle.dto";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async findAll(@User('id') id: number, @Query() query: any): Promise<ArticlesResponseInterface> {
        return await this.articleService.findAll(id, query);
    }

    @Get('feed')
    @UseGuards(AuthGuard)
    async getFeed(@User('id') id:number, @Query() query: any): Promise<ArticlesResponseInterface> {
        return await this.articleService.getFeed(id, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async create(@User() user: UserEntity, @Body('article') articleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createArticle(user, articleDto);
        return this.articleService.articleResponse(article);
    }ug

    @Get(':slug')
    async getArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.findBySlug(slug);
        return this.articleService.articleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') id: number, @Param('slug') slug: string) {
        return await this.articleService.deleteArticle(id, slug);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async updateArticle(@User('id') id: number, @Param('slug') slug: string, @Body('article') articleDto: CreateArticleDto):
    Promise<ArticleResponseInterface> {
        const article = await this.articleService.updateArticle(id, slug, articleDto);
        return this.articleService.articleResponse(article);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleFavorites(@User('id') id: number, @Param('slug') slug: string):
    Promise<ArticleResponseInterface> {
        const article = await this.articleService.addArticleFavorite(id, slug);
        return this.articleService.articleResponse(article);
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleFavorites(@User('id') id: number, @Param('slug') slug: string):
    Promise<ArticleResponseInterface> {
        const article = await this.articleService.deleteArticleFavorite(id, slug);
        return this.articleService.articleResponse(article);
    }
}