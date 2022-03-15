import { UserDataE } from "src/db/entities/UserDataE";
import { UserE } from "src/db/entities/UserE";
import { ResData } from "src/http/ResData";
import { BaseM } from "./BaseM";
import { ComVerify } from "@utils/ComVerify";
import { UserConfig } from "src/config/UserConfig";
import { Crypto_ } from "src/utils/Crypto_";

export class UserM extends BaseM<UserE>{
    /** 验证用户id */
    async vUserId(token: string): Promise<number | undefined> {
        let user = await this._eRep.findOne({
            where: {
                token,
                //必须为未删除
                delete: false,
            },
        });
        return user?.id;
    }

    /**
     * 是否存在这个用户
     * @param _userId 
     */
    async ifUser(_userId: number): Promise<boolean> {
        //先查找是否有这个用户
        let ifUser = await this._eRep.count({
            where: {
                id: _userId,
            },
        });
        return ifUser != 0;
    }

    /**
     * 添加用户
     * @param _op 
     * @returns 
     */
    async add(_op: UserE & Pick<UserDataE, 'name'>) {
        //验证各个字段
        let vMes = await UserE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //查看账户是否重复
        if (await this._eRep.findOne({
            where: {
                account: _op.account,
            },
        })) {
            return new ResData().fial('已经存在同账号的用户了');
        }
        let _newE = new UserE();
        _newE.account = _op.account;
        _newE.password = this.getPassword(_op.password);
        _newE.createTime = Date.now();
        _newE.token = '';
        _newE.ewPassword = '';
        await this._eRep.save(_newE);
        await this._parent.userDataM.add(_newE.id, _op.name);
        await this.completionData(_newE);
        this.deleteKey(_newE);
        return new ResData(_newE);
    }

    /** 
     * 编辑密码
     */
    async editPassword(query: {
        /** 原密码 */
        p: string;
        /** 新密码 */
        newP: string;
    }, userId: number) {
        let vMes = ComVerify.UserV.password(query.p) || ComVerify.UserV.password(query.newP);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _onE = await this._eRep.findOne({
            where: {
                id: userId,
            },
        });
        if (!_onE) {
            return new ResData().fial('找不到这个用户');
        }
        if (_onE.password != this.getPassword(query.p)) {
            return new ResData().fial('原密码错误');
        }
        _onE.password = this.getPassword(query.newP);
        _onE.ewPassword = '';
        //重置token
        _onE.token = this.getToken(_onE);
        await this._eRep.save(_onE);
        //
        return new ResData(_onE.token);
    }

    /**
     * 设置某个用户的删除状态
     * @param op 
     */
    async setDeleteState(op: {
        userId: number;
        delState: boolean;
    }) {
        let _onE = await this._eRep.findOne({
            where: {
                id: op.userId,
            },
        });
        if (!_onE) {
            return new ResData().fial('找不到这个用户');
        }
        if (_onE.id == UserConfig.rootUserId) {
            return new ResData().fial('不能设置根用户的删除状态');
        }
        //设置删除状态
        _onE.delete = op.delState;
        await this._eRep.save(_onE);
        //
        return new ResData();
    }

    /**
     * 登录
     * @param _op 
     */
    async login(_op: UserE) {
        //验证各个字段
        let vMes = await UserE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _onE = await this._eRep.findOne({
            where: {
                account: _op.account,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这个用户');
        }
        //再判断该账户是否被删除
        if (_onE.delete) {
            return new ResData().fial('该用户状态为已删除，不能登录，请联系管理员恢复');
        }
        //先看是否有明文密码，如果存在明文密码则先用明文密码重置密码，再执行验证逻辑
        if (_onE.ewPassword) {
            _onE.password = this.getPassword(_onE.ewPassword);
        }
        if (_onE.password != this.getPassword(_op.password)) {
            return new ResData().fial('密码错误');
        }
        _onE.ewPassword = '';
        _onE.token = this.getToken(_onE);
        await this._eRep.save(_onE);
        await this.completionData(_onE);
        //
        this.deleteKey(_onE);
        //
        return new ResData(_onE).encrypt();
    }

    /**
     * 退出登录
     * @param userId 
     */
    async outLogin(userId: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id: userId,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这个用户');
        }
        //重置token
        _onE.token = '';
        await this._eRep.save(_onE);
        return new ResData();
    }

    /**
     * 查找用户
     */
    async find(_op: {
        token?: string;
        id?: number;
    }, ifDToken: boolean = true) {
        let _onE = await this._eRep.findOne({
            where: _op,
        });
        if (!_onE) {
            return new ResData().fial('没有找到这个用户');
        }
        this.deleteKey(_onE);
        ifDToken && delete _onE.token;
        await this.completionData(_onE);
        return new ResData(_onE);
    }

    /**
     * 获取用户列表
     */
    async list() {
        let list = await this._eRep.find();
        for (let item of list) {
            this.deleteKey(item);
            delete item.token;
            // delete item.token;
            await this.completionData(item);
        }
        return new ResData(list);
    }

    /**
     * 其它M获取用户数据的方法
     * 其它M不能直接在数据库中找用户数据，因为用户的隐私数据需要剔除掉的
     * @param _id 
     * @returns 
     */
    async getOneUserData(_id: number) {
        let data = await this._eRep.findOne({
            where: {
                id: _id,
            },
        });
        if (data) {
            await this.completionData(data);
            this.deleteKey(data);
            delete data.token;
        }
        return data;
    }

    /** 删除不能外传的字段 */
    deleteKey(_e: UserE) {
        delete _e.password;
        delete _e.ewPassword;
    }

    /** 填充数据 */
    async completionData(_e: UserE): Promise<UserE> {
        _e.dataE = await this._parent.userDataRep.findOne({
            where: {
                userId: _e.id,
            },
        });
        return _e;
    }

    /** 获取token */
    private getToken(_e: UserE): string {
        return Crypto_.md5(`${_e.account}+${Date.now()}`)
    }

    /** 获取hash后的密码字符串 */
    private getPassword(_str: string): string {
        return Crypto_.md5(`test--${_str}-->`);
    }
}