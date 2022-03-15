import { BlogE } from "src/db/entities/BlogE";
import { ResData } from "src/http/ResData";
import { Any, LessThan, Like, MoreThan, Not } from "typeorm";
import { BaseM } from "./BaseM";

export class BlogM extends BaseM<BlogE>{
    /**
     * 添加博客
     * @param _op 
     * @param _userId 
     */
    async add(_op: BlogE, _userId: number) {
        //验证各个字段
        let vMes = await BlogE.V(_op);
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
            return new ResData().fial('已经存在相同标题的博客了');
        }
        let _newE = new BlogE();
        _newE.title = _op.title;
        _newE.content = _op.content;
        _newE.theme = JSON.stringify(_op.theme);
        //提取imgs列表
        _newE.imgs = this.getMdContentImgs(_op.content);
        _newE.tabIds = this.getTabs(_op.tabIds, 'set');
        _newE.externalLink = _op.externalLink || '';
        _newE.userId = _userId;
        _newE.showNumber = 0;
        _newE.createTime = _op.createTime || Date.now();
        //
        await this._eRep.save(_newE);
        await this.completionData(_newE);
        //添加贡献
        this._parent.contributionsM.add({
            type: 'blog',
            conType: 'add',
            targetId: _newE.id,
            userId: _userId,
        });
        //
        return new ResData(_newE);
    }

    /**
     * 修改博客内容
     * @param _op 
     */
    async edit(_op: BlogE) {
        //验证各个字段
        let vMes = await BlogE.V(_op);
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
            return new ResData().fial('不存在这个博客');
        }
        //查看是否已经存在标题相同的博客了
        if (await this._eRep.findOne({
            where: {
                title: _op.title,
                id: Not(_op.id),
            },
        })) {
            return new ResData().fial('已经存在相同标题的博客了');
        }
        //设置
        _onE.title = _op.title;
        _onE.content = _op.content;
        _onE.theme = JSON.stringify(_op.theme);
        //提取imgs列表
        _onE.imgs = this.getMdContentImgs(_op.content);
        _onE.tabIds = this.getTabs(_op.tabIds, 'set');
        _onE.externalLink = _op.externalLink;
        //
        await this._eRep.save(_onE);
        await this.completionData(_onE);
        //添加贡献
        this._parent.contributionsM.add({
            type: 'blog',
            conType: 'edit',
            targetId: _onE.id,
            userId: _onE.userId,
        });
        //
        return new ResData(_onE);
    }

    /** 获取一篇博客 */
    async getOne(id: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这篇博客');
        }
        await this.completionData(_onE);
        return new ResData(_onE);
    }

    /** 获取一条时间线上的博客，这个size指的是前后各多少条博客 */
    async getTimeLine(id: number, length: number) {
        let onE = await this._eRep.findOne({
            where: {
                id,
            },
        });
        if (!onE) {
            return new ResData().fial('没有找到目标博客');
        }
        let ss = await this._eRep.find({
            where: {
                id: LessThan(id),
            },
            take: length,
            order: {
                id: 'DESC',
            },
        });
        let es = await this._eRep.find({
            where: {
                id: MoreThan(id),
            },
            take: length,
        });
        let list = [
            ...ss,
            onE,
            ...es,
        ]
        //这个接口只用得到标题和时间，所以提出掉比较大的字符串
        for (let o of list) {
            // await this.completionData(o);
            delete o.content;
        }
        //
        return new ResData(list);
    }

    /**
     * 查找博客
     * @param _str 
     */
    async find(_op: ComN.IPageQuery<{
        str?: string;
        userId?: number;
        tagIds?: number[];
    }>) {
        let tabIdsWhere = (_op.query.tagIds && _op.query.tagIds.length > 0) ? {
            tabIds: Like(_op.query.tagIds.map(id => {
                return `%${id}%`;
            }).join(' AND ')),
        } : undefined;
        let where: Partial<Record<keyof BlogE, any>>[] = [
            {
                ...tabIdsWhere,
                title: Like(`%${_op.query.str}%`),
                userId: _op.query.userId,
            },
            {
                ...tabIdsWhere,
                content: Like(`%${_op.query.str}%`),
                userId: _op.query.userId,
            },
        ];
        //删除不必要的属性
        for (let o of where) {
            if (!_op.query.str) {
                delete o.content;
            }
            if (typeof _op.query.userId == 'undefined') {
                delete o.userId;
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
        for (let o of _list) {
            await this.completionData(o);
        }
        return new ResData<ComN.IPageData>({
            list: _list,
            length: await this._eRep.count({
                where,
            }),
        });
    }

    /**
     * 添加阅读数量
     * @param id 
     */
    async addShowNumber(id: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id,
            },
        });
        if (!_onE) {
            return new ResData().fial('没有找到这篇博客');
        }
        _onE.showNumber++;
        await this._eRep.save(_onE);
        return new ResData();
    }

    /** 获取md字符串中的图片列表 */
    private getMdContentImgs(_content: string) {
        return [..._content.matchAll(/\!\[.*?\]\((.*?)(\s+".*?")?\)/g)].map((item) => {
            return item[1];
        }).join(',');
    }
    /** 获取标签列表 */
    private getTabs(_str: string, module: 'set' | 'get'): string {
        switch (module) {
            case 'get':
                return _str.split(',').filter(Boolean).map(item => {
                    return item.replace(/^-|-$/g, '');
                }).join(',');
            case 'set':
                return _str.split(',').filter(Boolean).map((item) => {
                    return `-${item}-`;
                }).join(',');
        }
    }

    protected async completionData(_op: BlogE, ifGetUserE = false): Promise<BlogE> {
        ifGetUserE && (_op.userE = await this._parent.userM.getOneUserData(_op.userId));
        _op.tabsE = await this._parent.blogTabRep.find({
            where: this.getTabs(_op.tabIds, 'get').split(',').filter(Boolean).map((item) => {
                return {
                    id: parseInt(item),
                };
            }),
        });
        try {
            _op.theme = JSON.parse(_op.theme);
        } catch {
            _op.theme = {} as any;
        }
        return _op;
    }
}