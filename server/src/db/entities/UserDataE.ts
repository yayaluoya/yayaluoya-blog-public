import { Column, Entity } from "typeorm";
import { _BaseEntity } from "./_BaseEntity";

@Entity('user_data')
export class UserDataE extends _BaseEntity implements EN.IUserDataE {
    @Column({
        type: 'text',
    })
    name: string;
    @Column({
        type: 'bigint',
    })
    userId: number;
    @Column({
        type: 'text',
    })
    state: string;
    @Column({
        type: 'text',
    })
    introduction: string;
    @Column({
        type: 'text',
    })
    themeData: string;
    @Column({
        type: 'text',
    })
    socialData: string;
    @Column({
        type: 'text',
    })
    memoData: string;

    /** 验证规则 */
    static async V(_e: UserDataE): Promise<string> {
        return ''
            || this.VT.UserV.name_(_e.name)
            || this.VT.UserV.introduction(_e.introduction)
            || this.VT.UserV.state(_e.state)
            || this.VT.UserV.socialData(_e.socialData)
            || this.VT.UserV.themeData(_e.themeData);
    }
}