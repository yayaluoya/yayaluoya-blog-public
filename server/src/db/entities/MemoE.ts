import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('memo')
export class MemoE extends _BaseEntity implements EN.IMemoE {
    @Column({
        type: 'bigint',
        default: 0,
    })
    x: number;
    @Column({
        type: 'bigint',
        default: 0,
    })
    y: number;
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
        type: 'bigint',
    })
    userId: number;
    userE: EN.IUserE;

    /** 验证规则 */
    static async V(_e: MemoE): Promise<string> {
        return ''
            || this.VT.MemoV.title(_e.title)
            || this.VT.MemoV.content(_e.content);
    }
}