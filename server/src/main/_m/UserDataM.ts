import { UserDataE } from "src/db/entities/UserDataE";
import { ResData } from "src/http/ResData";
import { BaseM } from "./BaseM";
import { ComVerify } from "@utils/ComVerify";

export class UserDataM extends BaseM<UserDataE>{
    /**
     * 添加用户数据
     * @param _userId 
     * @param _name 
     */
    async add(_userId: number, _name: string) {
        let _newE = new UserDataE();
        _newE.name = _name;
        _newE.state = '';
        _newE.introduction = '';
        _newE.themeData = '';
        _newE.socialData = '';
        _newE.memoData = '';
        _newE.userId = _userId;
        _newE.createTime = Date.now();
        //
        await this._eRep.save(_newE);
    }

    /**
     * 获取用户的memo数据
     * @param userId 
     * @returns 
     */
    async getMemo(userId: number) {
        let _onE = await this._eRep.findOne({
            where: {
                //这里要注意，这是个附带数据，必须通过主数据的id来查找
                userId: userId,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这个用户数据');
        }
        return new ResData(_onE.memoData);
    }

    /**
     * 编辑用户数据
     * @param _op 
     * @returns 
     */
    async edit(_op: UserDataE, _userId: number) {
        //验证各个字段
        let vMes = await UserDataE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _onE = await this._eRep.findOne({
            where: {
                //这里要注意，这是个附带数据，必须通过主数据的id来查找
                userId: _userId,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这个用户数据');
        }
        _onE.name = _op.name;
        _onE.state = _op.state;
        _onE.introduction = _op.introduction;
        _onE.themeData = _op.themeData;
        _onE.socialData = _op.socialData;
        //保存数据
        await this._eRep.save(_onE);
        //
        return new ResData(_onE);
    }

    /**
     * 编辑用户数据
     * @param _op 
     * @returns 
     */
    async editMemo(_op: UserDataE, _userId: number) {
        //验证各个字段
        let vMes = ComVerify.UserV.memoData(_op.memoData);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _onE = await this._eRep.findOne({
            where: {
                //这里要注意，这是个附带数据，必须通过主数据的id来查找
                userId: _userId,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这个用户数据');
        }
        _onE.memoData = _op.memoData;
        //保存数据
        await this._eRep.save(_onE);
        //
        return new ResData();
    }
}