import { DiarySupplementE } from "src/db/entities/DiarySupplementE";
import { BaseM } from "./BaseM";
import { ComVerify } from "@utils/ComVerify";

export class DiarySupplementM extends BaseM<DiarySupplementE>{
    /**
     * 添加补充
     * @param _op 
     * @param diaryId 
     */
    async add(_op: EN.IDiarySupplementE, diaryId: number): Promise<DiarySupplementE> {
        if (!_op.content) {
            return;
        }
        //验证各个字段
        let vMes = ComVerify.DiarySupplementV.content(_op.content);
        if (vMes) {
            throw vMes;
        }
        let newOp = new DiarySupplementE();
        newOp.content = _op.content;
        newOp.theme = JSON.stringify(_op.theme);
        newOp.diaryId = diaryId;
        newOp.createTime = Date.now();
        await this._eRep.save(newOp);
    }

    /**
     * 获取某一篇日记的全部补充
     * @param diaryId 
     */
    async get(diaryId: number) {
        return await this._eRep.find({
            where: {
                diaryId,
            },
        });
    }
}