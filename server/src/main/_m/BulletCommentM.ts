import { BulletCommentE } from "src/db/entities/BulletCommentE";
import { ResData } from "src/http/ResData";
import { In, Not } from "typeorm";
import { BaseM } from "./BaseM";
import ArrayUtils from "@utils/ArrayUtils";

export class BulletCommentM extends BaseM<BulletCommentE>{
    /**
     * 添加弹幕
     * @param _op 
     */
    async add(_op: BulletCommentE, _userId: number) {
        //验证各个字段
        let vMes = await BulletCommentE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        //先查看是否存在同名的弹幕了
        if (await this._eRep.findOne({
            where: {
                content: _op.content,
            },
        })) {
            return new ResData().fial('已经存在同名的弹幕了');
        }
        //
        let _newE = new BulletCommentE();
        _newE.content = _op.content;
        _newE.color = _op.color;
        _newE.createTime = Date.now();
        _newE.userId = _userId;
        //
        await this._eRep.save(_newE);
        //添加贡献
        this._parent.contributionsM.add({
            type: 'bullet',
            conType: 'add',
            targetId: _newE.id,
            userId: _userId,
        });
        return new ResData(_newE);
    }

    /**
     * 删除弹幕
     * @param _id 
     */
    async remove(_id: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id: _id,
            },
        });
        if (!_onE) {
            return new ResData().fial('不存在这个弹幕');
        }
        await this._eRep.remove(_onE);
        return new ResData(_onE);
    }

    /**
     * 获取所有弹幕
     */
    async getAll() {
        return new ResData(await this._eRep.find());
    }

    /**
     * 分页获取弹幕
     */
    async getBC(_op: ComN.IPageQuery) {
        let where = {};
        //分页查询
        let _list = await this._eRep.find({
            where,
            order: {
                id: 'DESC',
            },
            take: _op.size,
            skip: (_op.page - 1) * _op.size,
        });
        return new ResData<ComN.IPageData>({
            list: _list,
            length: await this._eRep.count({
                where,
            }),
        });
    }

    /**
     * 随机获取一个弹幕
     */
    async random(ids: number[] = []) {
        let id = (await this._eRep.find({
            select: ['id'],
            where: {
                id: Not(In(ids)),
            },
        })).map((e) => e.id);
        if (id.length == 0) {
            return new ResData();
        }
        let e = await this._eRep.findOne({
            where: {
                id: ArrayUtils.RandomGet(id)[0],
            },
        });
        return new ResData(e);
    }
}