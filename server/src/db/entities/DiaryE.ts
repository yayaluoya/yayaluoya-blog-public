import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('diary')
export class DiaryE extends _BaseEntity implements EN.IDiaryE {
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
        default: false,
    })
    ifPublic: boolean;
    @Column({
        type: 'bigint',
    })
    userId: number;
    userE: EN.IUserE;

    /** 日记补充内容 */
    supplement?: EN.IDiarySupplementE[];

    /** 验证规则 */
    static async V(_e: DiaryE): Promise<string> {
        return ''
            || this.VT.DiaryV.content(_e.content)
            || this.VT.DiaryV.title(_e.title);
    }
}