import { MemoE } from "src/db/entities/MemoE";
import { ResData } from "src/http/ResData";
import { Like, Not } from "typeorm";
import { BaseM } from "./BaseM";

export class MemoM extends BaseM<MemoE>{
    /**
     * 添加便签
     * @param _op 
     * @param _userId 
     */
    async add(_op: MemoE, _userId: number) {
        //验证各个字段
        let vMes = await MemoE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        if (!(await this._parent.userM.ifUser(_userId))) {
            return new ResData().fial('不存在这个用户');
        }
        //查看是否已经存在标题相同的博客了
        if (await this._eRep.findOne({
            where: {
                title: _op.title,
            },
        })) {
            return new ResData().fial('已经存在相同标题的便签了');
        }
        let _newE = new MemoE();
        _newE.title = _op.title;
        _newE.content = _op.content;
        _newE.theme = JSON.stringify(_op.theme);
        _newE.x = _op.x;
        _newE.y = _op.y;
        _newE.userId = _userId;
        _newE.createTime = Date.now();
        //
        await this._eRep.save(_newE);
        //添加贡献
        this._parent.contributionsM.add({
            type: 'memo',
            conType: 'add',
            targetId: _newE.id,
            userId: _userId,
        });
        //
        return new ResData(_newE);
    }

    /**
     * 修改便签内容
     * @param _op 
     */
    async edit(_op: MemoE) {
        //验证各个字段
        let vMes = await MemoE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _onE = await this._eRep.findOne({
            where: {
                id: _op.id,
            },
        });
        if (!_onE) {
            return new ResData().fial('不存在这个便签');
        }
        //查看是否已经存在标题相同的博客了
        if (await this._eRep.findOne({
            where: {
                title: _op.title,
                id: Not(_op.id),
            },
        })) {
            return new ResData().fial('已经存在相同标题的便签了');
        }
        //设置
        _onE.title = _op.title;
        _onE.content = _op.content;
        _onE.theme = JSON.stringify(_op.theme);
        _onE.x = _op.x;
        _onE.y = _op.y;
        //
        await this._eRep.save(_onE);
        //添加贡献
        this._parent.contributionsM.add({
            type: 'memo',
            conType: 'edit',
            targetId: _onE.id,
            userId: _onE.userId,
        });
        //
        return new ResData(_onE);
    }

    /**
     * 
     * @param _op 修改便签位置
     */
    async editPos(_op: MemoE) {
        //
        let _onE = await this._eRep.findOne({
            where: {
                id: _op.id,
            },
        });
        if (!_onE) {
            return new ResData().fial('不存在这个便签');
        }
        _onE.x = _op.x;
        _onE.y = _op.y;
        await this._eRep.save(_onE);
        //
        return new ResData();
    }

    /**
     * 查找便签
     * @param _str 
     */
    async find(_op: {
        str?: string;
        userId?: number;
    }) {
        let where: Partial<Record<keyof MemoE, any>>[] = [
            {
                title: Like(`%${_op.str}%`),
                userId: _op.userId,
            },
            {
                content: Like(`%${_op.str}%`),
                userId: _op.userId,
            },
        ];
        //删除不必要的属性
        for (let o of where) {
            if (!_op.str) {
                delete o.content;
            }
            if (typeof _op.userId == 'undefined') {
                delete o.userId;
            }
        }
        return new ResData(await this._eRep.find({
            where,
        }));
    }

    protected async completionData(_op: MemoE): Promise<MemoE> {
        _op.userE = await this._parent.userM.getOneUserData(_op.userId);
        return _op;
    }
}