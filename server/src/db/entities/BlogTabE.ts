import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('blog_tab')
export class BlogTabE extends _BaseEntity implements EN.IBlogTabE {
    @Column({
        type: 'text',
    })
    name: string;
    @Column({
        type: 'text',
    })
    color: string;

    /** 验证规则 */
    static async V(_e: BlogTabE): Promise<string> {
        return ''
            || this.VT.BlogTabV.name_(_e.name)
            || this.VT.BlogTabV.color(_e.color);
    }
}