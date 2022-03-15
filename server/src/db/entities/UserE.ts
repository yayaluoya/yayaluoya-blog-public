import { Column, Entity } from "typeorm";
import { UserDataE } from "./UserDataE";
import { _BaseEntity } from "./_BaseEntity";

@Entity('user')
export class UserE extends _BaseEntity implements EN.IUserE {
    @Column({
        type: 'text',
    })
    account: string;
    @Column({
        type: 'text',
    })
    password: string;
    @Column({
        type: 'text',
    })
    ewPassword: string;
    @Column({
        type: 'text',
    })
    token: string;
    dataE?: EN.IUserDataE;

    /** 
     * 验证规则
     * TODO 注意这个userDataE中的name只有添加用户时才验证，登录时验证，也就是有就验证，没有就不验证
     */
    static async V(_e: UserE & Partial<Pick<UserDataE, 'name'>>): Promise<string> {
        return ''
            || this.VT.UserV.account(_e.account)
            || this.VT.UserV.password(_e.password)
            || (typeof _e.name != 'undefined' ? this.VT.UserV.name_(_e.name) : '');
    }
}