import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('blog')
export class BlogE extends _BaseEntity implements EN.IBlogE {
    @Column({
        type: 'text',
    })
    title: string;
    @Column({
        type: 'text',
    })
    content: string;
    @Column({
        type: 'text',
    })
    theme: string;
    @Column({
        type: 'text',
    })
    imgs: string;
    @Column({
        type: 'text',
    })
    tabIds: string;
    tabsE?: EN.IBlogTabE[];
    @Column({
        type: 'text',
    })
    externalLink: string;
    @Column({
        type: 'bigint',
    })
    userId: number;
    userE: EN.IUserE;

    @Column()
    showNumber: number;

    /** 验证规则 */
    static async V(_e: BlogE): Promise<string> {
        return ''
            || this.VT.BlogV.title(_e.title)
            || (_e.externalLink ? '' : this.VT.BlogV.content(_e.content))
            || (_e.externalLink ? this.VT.BlogV.externalLink(_e.externalLink) : '');
    }
}