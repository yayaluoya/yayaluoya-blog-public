import { ContributionsE } from "src/db/entities/ContributionsE";
import { ResData } from "src/http/ResData";
import { BaseM } from "./BaseM";
const moment = require('moment');

export class ContributionsM extends BaseM<ContributionsE>{
    /** 
     * 添加贡献
     */
    async add(_op: Pick<EN.IContributionsE, 'type' | 'conType' | 'targetId' | 'userId'>) {
        let onMoment = moment();
        let y = onMoment.year();
        let m = onMoment.month() + 1;
        let d = onMoment.date();
        let _newE = new ContributionsE();
        _newE.y = y;
        _newE.m = m;
        _newE.d = d;
        _newE.type = _op.type;
        _newE.conType = _op.conType;
        _newE.targetId = _op.targetId;
        _newE.userId = _op.userId;
        _newE.createTime = Date.now();
        //保存贡献
        await this._eRep.save(_newE);
    }

    /** 获取贡献过的年份 */
    async getY(userId?: number) {
        let where: any = {};
        if (typeof userId != 'undefined') {
            where.userId = userId;
        }
        let ys = (await this._eRep.find({
            select: ['y'],
            where,
        })).map((item) => {
            return item.y;
        });
        return new ResData([...new Set(ys)]);
    }

    /** 获取某一年贡献列表 */
    async getList(_query: {
        /** 年份 */
        y: number;
    }, userId?: number) {
        let where: any = {};
        if (typeof userId != 'undefined') {
            where.userId = userId;
        }
        return new ResData(await this._eRep.find({
            select: ['id', 'y', 'm', 'd'],
            where: {
                y: _query.y,
                ...where,
            },
        }));
    }

    /** 分页查询贡献列表 */
    async page(_query: ComN.IPageQuery<{
        y: number;
        m: number;
        d: number;
    }>, userId: number) {
        let where: any = {};
        Object.keys(_query.query).forEach((key) => {
            where[key] = _query.query[key];
        });
        if (typeof userId != 'undefined') {
            where.userId = userId;
        }
        let list = await this._eRep.find({
            where,
            order: {
                id: 'DESC',
            },
            take: _query.size,
            skip: (_query.page - 1) * _query.size,
        });
        for (let o of list) {
            o.data = await this.getData(o.type, o.targetId);
        }
        let length = list.length;
        list = list.filter((item) => !!item.data);
        //
        return new ResData<ComN.IPageData>({
            list: list,
            length: await this._eRep.count({
                where,
            }) - (length - list.length),
        });
    }

    /** 获取贡献详情，包括谁贡献的，贡献的什么类型，贡献的什么内容 */
    async getContributionD(ids: number[]) {
        if (ids.length == 0) {
            return new ResData([]);
        }
        let list = await this._eRep.find({
            where: ids.map((id) => {
                return {
                    id,
                };
            }),
        });
        for (let o of list) {
            o.data = await this.getData(o.type, o.targetId);
        }
        return new ResData(list.filter((item) => !!item.data));
    }

    /** 获取data */
    private async getData(type: EN.ContributionsEType, id: number): Promise<any> {
        let op = {
            where: {
                id,
            },
        };
        let data;
        switch (type) {
            case 'blog':
                data = await this._parent.blogRep.findOne(op);
                break;
            case 'memo':
                data = await this._parent.memoRep.findOne(op);
                break;
            case 'diary':
                data = await this._parent.diaryRep.findOne(op);
                break;
            case 'bullet':
                data = await this._parent.bulletCommentRep.findOne(op);
                break;
            default:
                break;
        }
        return data;
    }
}