import { UserEntity } from "@app/user/user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { ArticleResponseInterface } from "./articleTypes/articleResponse.interface";
import { CreateArticleDto } from "./dto/createArticle.dto";
import slugify from "slugify";
import { ArticlesResponseInterface } from "./articleTypes/articlesResponse.interface";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) 
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>,
    ) {}

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

        if(query.favorited) {
            const author = await this.userRepository.findOne({username: query.favorited}, {relations: ['favorites']});
            const ids = author.favorites.map(el => el.id);
            if(ids.length > 0) {
                queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
            } else {
                queryBuilder.andWhere('1=0');
            }
        }

        if(query.limit) {
            queryBuilder.limit(query.limit);
        }

        if(query.offset) {
            queryBuilder.offset(query.offset)
        }

        let favoriteIds: number[] = [];

        if(id) {
            const currentUser = await this.userRepository.findOne(id, {relations: ['favorites']});
            favoriteIds = [+(currentUser.favorites.map( favorite => favorite.id ))];
        }

        const articles = await queryBuilder.getMany();

        const articlesWithFavorites = articles.map((article) => {
            const favorited = favoriteIds.includes(+article.id);
            return { ...article, favorited };
        })

        queryBuilder.orderBy('articles.createdAt', 'DESC')

        return {articles: articlesWithFavorites, articlesCount}
    }

    async getFeed(id: number, query: any): Promise<ArticlesResponseInterface>{

        const follows = await this.followRepository.find({followerId: id});

        if(follows.length === 0) {
            return {articles: [], articlesCount: 0}
        };
        
        const followIds = follows.map(follow => follow.followingId);

        const queryBuilder = getRepository(ArticleEntity)
        .createQueryBuilder('articles')
        .leftJoinAndSelect('articles.author', 'author')
        .where('articles.authorId IN (:...ids)', {ids: followIds});

        queryBuilder.orderBy('articles.createdAt', 'DESC');

        const articlesCount = await queryBuilder.getCount();

        if(query.limit) {
            queryBuilder.limit(query.limit);
        }

        if(query.offset) {
            queryBuilder.limit(query.offset);
        }

        const articles = await queryBuilder.getMany();
     
        return {articles, articlesCount};
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

    async addArticleFavorite(id: number, slug: string): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne(id, {relations: ['favorites']});

        const notFavorited = user.favorites.findIndex( articleFavorite => articleFavorite.id === article.id) === -1;
        
        if(notFavorited) {
            user.favorites.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    async deleteArticleFavorite(id: number, slug: string): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne(id, {relations: ['favorites']});

        const articleIndex = user.favorites.findIndex( articleFavorite => articleFavorite.id === article.id);
        
        if(articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }

        return article;
    }

    articleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36,6)) | 0).toString(36);
    }
}