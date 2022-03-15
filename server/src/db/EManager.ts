import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogCommentE } from "./entities/BlogCommentE";
import { BlogE } from "./entities/BlogE";
import { BlogTabE } from "./entities/BlogTabE";
import { BulletCommentE } from "./entities/BulletCommentE";
import { ContributionsE } from "./entities/ContributionsE";
import { DiaryE } from "./entities/DiaryE";
import { DiarySupplementE } from "./entities/DiarySupplementE";
import { MemoE } from "./entities/MemoE";
import { TestEntity } from "./entities/TestEntity";
import { UserDataE } from "./entities/UserDataE";
import { UserE } from "./entities/UserE";
/**
 * 主体管理器
 */
export class EManager {
    /** 主体列表 */
    static get ES() {
        return [TestEntity, BlogE, BlogTabE, BulletCommentE, DiaryE, MemoE, UserDataE, UserE, BlogCommentE, ContributionsE, DiarySupplementE];
    }

    /** 导入所有主体 */
    static get imports() {
        return TypeOrmModule.forFeature(this.ES);
    }
}