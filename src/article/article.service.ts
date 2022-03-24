import { UserEntity } from "@app/user/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { ArticleResponseInterface } from "./articleTypes/articleResponse.interface";
import { CreateArticleDto } from "./dto/createArticle.dto";
import slugify from "slugify";
import { ArticlesResponseInterface } from "./articleTypes/articlesResponse.interface";

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) 
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>) {}

    async findAll(id: number, query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = getRepository(ArticleEntity)
        .createQueryBuilder('articles')
        .leftJoinAndSelect('articles.author', 'author');

        const articlesCount = await queryBuilder.getCount();

        if(query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {tag: `%${query.tag}%`});
        }

        if(query.author) {
            const author = await this.userRepository.findOne({ username: query.author });
            queryBuilder.andWhere('articles.authorId = :id', {id: author.id})
        }

        if(query.limit) {
            queryBuilder.limit(query.limit);
        }

        if(query.offset) {
            queryBuilder.offset(query.offset)
        }

        const articles = await queryBuilder.getMany();

        queryBuilder.orderBy('articles.createdAt', 'DESC')

        return {articles, articlesCount}
    }

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

    async findBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOne({ slug });
    }

    async updateArticle(id: number, slug: string, articleDto: CreateArticleDto): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);

        if(!article){
            throw new HttpException('article does not exist', HttpStatus.NOT_FOUND);
        }
        
        if (article.author.id !== id){
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }

        Object.assign(article, articleDto);

        return await this.articleRepository.save(article);
    }

    async deleteArticle(id: number, slug: string): Promise<DeleteResult> {
        const article = await this.findBySlug(slug);

        if(!article){
            throw new HttpException('article does not exist', HttpStatus.NOT_FOUND);
        }
        
        if (article.author.id !== id){
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }

       return await this.articleRepository.delete({ slug })
    }

    articleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36,6)) | 0).toString(36);
    }
}