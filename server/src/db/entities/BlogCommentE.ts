import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

/**
 * 博客评论
 */
@Entity('blog_comment')
export class BlogCommentE extends _BaseEntity implements EN.IBlogComment {
    @Column()
    blogId: number;
    @Column({
        type: 'text',
    })
    content: string;
    @Column({
        type: 'text',
    })
    name: string;
    @Column({
        type: 'text',
    })
    img: string;
    @Column({
        type: 'text',
    })
    theme: string;

    @Column('bool')
    mark: boolean;

    /** 验证规则 */
    static async V(_e: BlogCommentE): Promise<string> {
        return ''
            || this.VT.BlogCommentV.content(_e.content)
            || this.VT.BlogCommentV.name_(_e.name)
            || this.VT.BlogCommentV.img(_e.img);
    }
}