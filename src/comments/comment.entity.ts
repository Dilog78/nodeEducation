import { UserEntity } from "@app/user/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'comments'})
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ default: '' })
    body: string;

    @BeforeUpdate()
    updateTime() {
        this.updatedAt = new Date();
    }

    @ManyToOne(() => UserEntity, user => user.comments)
    author: UserEntity;
}
