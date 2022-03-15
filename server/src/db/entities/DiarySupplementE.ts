import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('diary_supplement')
export class DiarySupplementE extends _BaseEntity implements EN.IDiarySupplementE {
    @Column()
    diaryId: number;
    @Column({
        type: 'text',
    })
    content: string;
    @Column({
        type: 'text',
    })
    theme: string;

    /** 验证规则 */
    static async V(_e: DiarySupplementE): Promise<string> {
        return '' || this.VT.DiarySupplementV.content(_e.content);
    }
}