import { ArticleEntity } from "@app/article/article.entity";
import { ArticleService } from "@app/article/article.service";
import { hash } from "bcrypt";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'users'})
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column({default: ''})
    bio: string;

    @Column({default: ''})
    image: string;

    @Column({select: false})
    password: string;

    @BeforeInsert()
    async hashPass(){
        this.password = await hash(this.password, 10)
    }

    @OneToMany(() => ArticleEntity, article => article.author)
    articles: ArticleEntity[];

    @ManyToMany(() => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];
}