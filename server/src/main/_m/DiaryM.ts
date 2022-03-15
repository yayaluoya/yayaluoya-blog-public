import { DiaryE } from "src/db/entities/DiaryE";
import { ResData } from "src/http/ResData";
import { Like } from "typeorm";
import { BaseM } from "./BaseM";

export class DiaryM extends BaseM<DiaryE>{
    /**
     * 添加日记
     * @param _op 
     * @param _userId 
     */
    async add(_op: DiaryE, _userId: number) {
        //验证各个字段
        let vMes = await DiaryE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _newE = new DiaryE();
        _newE.title = _op.title;
        _newE.content = _op.content;
        _newE.ifPublic = _op.ifPublic;
        _newE.theme = JSON.stringify(_op.theme);
        _newE.userId = _userId;
        _newE.createTime = Date.now();
        //保存
        await this._eRep.save(_newE);
        if (_op.ifPublic) {
            //添加贡献
            this._parent.contributionsM.add({
                type: 'diary',
                conType: 'add',
                targetId: _newE.id,
                userId: _userId,
            });
        }
        await this.completionData(_newE);
        return new ResData(_newE);
    }

    /**
     * 修改日记
     * 只能修改是否公开，不能修改其它内容
     * @param _op 
     */
    async edit(_op: DiaryE & {
        supplement: EN.IDiarySupplementE,
    }) {
        let _onE = await this._eRep.findOne({
            where: {
                id: _op.id,
            },
        });
        if (!_onE) {
            return new ResData().fial('找不到这篇日记');
        }
        _onE.ifPublic = _op.ifPublic;
        await this._eRep.save(_onE);
        //添加补充
        let is = await this._parent.diarySupplementM.add(_op.supplement, _op.id).catch((e) => {
            return e;
        });
        if (is) {
            return new ResData().fial('添加补充失败@' + is);
        }
        if (_onE.ifPublic) {
            //添加贡献
            this._parent.contributionsM.add({
                type: 'diary',
                conType: 'edit',
                targetId: _onE.id,
                userId: _onE.userId,
            });
        }
        await this.completionData(_onE);
        return new ResData(_onE);
    }

    /**
     * 查找日记
     * @param _str 
     */
    async find(_op: ComN.IPageQuery<{
        str?: string;
    }> & {
        userId: number;
    }) {
        let where: Partial<Record<keyof DiaryE, any>>[] = [
            {
                title: Like(`%${_op.query.str}%`),
                userId: _op.userId,
            },
            {
                content: Like(`%${_op.query.str}%`),
                userId: _op.userId,
            },
        ];
        //删除不必要的属性
        for (let o of where) {
            if (!_op.query.str) {
                delete o.content;
            }
            if (typeof _op.userId == 'undefined') {
                delete o.userId;
                //添加上必须是public的属性
                o.ifPublic = true;
            }
        }
        //分页查询
        let _list = await this._eRep.find({
            where,
            order: {
                id: 'DESC',
            },
            take: _op.size,
            skip: (_op.page - 1) * _op.size,
        });
        for (let item of _list) {
            await this.completionData(item);
        }
        return new ResData<ComN.IPageData>({
            list: _list,
            length: await this._eRep.count({
                where,
            }),
        });
    }

    protected async completionData(_op: DiaryE): Promise<DiaryE> {
        _op.userE = await this._parent.userM.getOneUserData(_op.userId);
        _op.supplement = await this._parent.diarySupplementM.get(_op.id);
        return _op;
    }
}