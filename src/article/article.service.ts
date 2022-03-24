import { UserEntity } from "@app/user/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { ArticleResponceInterface } from "./articleTypes/articleResponce.interface";
import { CreateArticleDto } from "./dto/createArticle.dto";
import slugify from "slugify";

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) {}
    async createArticle(user :UserEntity, articleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = new ArticleEntity;
        Object.assign(article, articleDto);

        if(!article.tagList) {
            article.tagList = [];
        }

        article.slug = this.getSlug(articleDto.title)

        article.author = user;

        return await this.articleRepository.save(article);
    }

    articleResponse(article: ArticleEntity): ArticleResponceInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36,6)) | 0).toString(36);
    }
}