import { BlogTabE } from "src/db/entities/BlogTabE";
import { ResData } from "src/http/ResData";
import { Not } from "typeorm";
import { BaseM } from "./BaseM";

export class BlogTabM extends BaseM<BlogTabE>{
    /**
     * 添加标签
     * @param _op 
     */
    async add(_op: BlogTabE) {
        //验证各个字段
        let vMes = await BlogTabE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        if (await this._eRep.findOne({
            where: {
                name: _op.name,
            },
        })) {
            return new ResData().fial('已经存在这个名字的标签了');
        }
        let _newE = new BlogTabE();
        _newE.name = _op.name;
        _newE.color = _op.color;
        _newE.createTime = Date.now();
        //
        await this._eRep.save(_newE);
        //
        return new ResData(_newE);
    }

    /**
     * 修改标签
     * @param _op 
     */
    async edit(_op: BlogTabE) {
        //验证各个字段
        let vMes = await BlogTabE.V(_op);
        if (vMes) {
            return new ResData().fial(vMes);
        }
        //
        let onE = await this._eRep.findOne({
            where: {
                id: _op.id,
            },
        });
        if (!onE) {
            return new ResData().fial('找不到这个标签');
        }
        if (await this._eRep.findOne({
            where: {
                name: _op.name,
                id: Not(_op.id),
            },
        })) {
            return new ResData().fial('已经存在这个名字的标签了');
        }
        //修改
        onE.name = _op.name;
        onE.color = _op.color;
        //保存
        await this._eRep.save(onE);
        return new ResData(onE);
    }

    /**
     * 删除一个标签
     * @param id 
     */
    async remote(id: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id,
            },
        });
        if (!_onE) {
            return new ResData().fial('找不到这个标签');
        }
        await this._eRep.remove(_onE);
        return new ResData();
    }

    /**
     * 获取一个标签数据
     * @param id 
     */
    async getOneTab(id: number) {
        let _onE = await this._eRep.findOne({
            where: {
                id,
            },
        });
        if (!_onE) {
            return new ResData().fial('找不到这个标签');
        }
        return new ResData(_onE);
    }

    /**
     * 通过tag名字获取tag数据
     * @param names 
     */
    async byTabNamesGetTabs(names: string[]) {
        let _onEs = [];
        for (let name of names) {
            _onEs.push(await this._eRep.findOne({
                where: {
                    name,
                },
            }));
        }
        return new ResData(_onEs.filter(Boolean));
    }

    /**
     * 获取所有标签
     */
    async getAll() {
        return new ResData(await this._eRep.find());
    }
}