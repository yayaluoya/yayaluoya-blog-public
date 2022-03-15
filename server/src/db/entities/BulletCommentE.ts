import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('bullet_comment')
export class BulletCommentE extends _BaseEntity implements EN.IBulletCommentE {
    @Column({
        type: 'text',
    })
    content: string;
    @Column({
        type: 'text',
    })
    color: string;
    @Column()
    userId: number;

    /** 验证规则 */
    static async V(_e: BulletCommentE): Promise<string> {
        return ''
            || this.VT.BulletCommentV.color(_e.color)
            || this.VT.BulletCommentV.content(_e.content);
    }
}