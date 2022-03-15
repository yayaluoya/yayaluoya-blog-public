import { BlogCommentE } from "src/db/entities/BlogCommentE";
import { ResData } from "src/http/ResData";
import { BaseM } from "./BaseM";

export class BlogCommentM extends BaseM<BlogCommentE>{
    /**
     * 添加
     * @param _op 
     */
    async add(_op: BlogCommentE, _ifMask: boolean) {
        //验证各个字段
        let vMes = await BlogCommentE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let _newE = new BlogCommentE();
        _newE.content = _op.content;
        _newE.blogId = _op.blogId;
        _newE.name = _op.name;
        _newE.img = _op.img;
        _newE.mark = _ifMask;
        _newE.theme = JSON.stringify(_op.theme);
        _newE.createTime = Date.now();
        //
        await this._eRep.save(_newE);
        return new ResData(_newE);
    }

    /**
     * 删除
     * @param _id 
     */
    async remote(_id: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id: _id,
            },
        });
        if (!_onE) {
            return new ResData().fial('找不到这个评论');
        }
        await this._eRep.remove(_onE);
        await this.completionData(_onE);
        return new ResData('删除成功');
    }

    /**
     * 查找
     * @param _op 
     */
    async find(_op: ComN.IPageQuery<{
        blogId: number;
    }>) {
        let where = {
            blogId: _op.query.blogId,
        };
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

    protected async completionData(_e: BlogCommentE): Promise<BlogCommentE> {
        try {
            _e.theme = JSON.parse(_e.theme);
        } catch {
            _e.theme = {} as any;
        }
        return _e;
    }
}