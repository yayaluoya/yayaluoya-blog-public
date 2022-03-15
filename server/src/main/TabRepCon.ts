import { InjectRepository } from "@nestjs/typeorm";
import { BlogCommentE } from "src/db/entities/BlogCommentE";
import { BlogE } from "src/db/entities/BlogE";
import { BlogTabE } from "src/db/entities/BlogTabE";
import { BulletCommentE } from "src/db/entities/BulletCommentE";
import { ContributionsE } from "src/db/entities/ContributionsE";
import { DiaryE } from "src/db/entities/DiaryE";
import { DiarySupplementE } from "src/db/entities/DiarySupplementE";
import { MemoE } from "src/db/entities/MemoE";
import { TestEntity } from "src/db/entities/TestEntity";
import { UserDataE } from "src/db/entities/UserDataE";
import { UserE } from "src/db/entities/UserE";
import { Repository } from "typeorm";
import { BlogCommentM } from "./_m/BlogCommentM";
import { BlogM } from "./_m/BlogM";
import { BlogTabM } from "./_m/BlogTabM";
import { BulletCommentM } from "./_m/BulletCommentM";
import { ContributionsM } from "./_m/ContributionsM";
import { DiaryM } from "./_m/DiaryM";
import { DiarySupplementM } from "./_m/DiarySupplementM";
import { MemoM } from "./_m/MemoM";
import { TestM } from "./_m/TestM";
import { UserDataM } from "./_m/UserDataM";
import { UserM } from "./_m/UserM";

/**
 * 表连接控制器
 * 注册了所有表的实体连接
 */
export class TabRepCon {
    /**
     * 测试表实体连接
     */
    @InjectRepository(TestEntity)
    public testRep: Repository<TestEntity>;
    /**
     * 博客表实体连接
     */
    @InjectRepository(BlogE)
    public blogRep: Repository<BlogE>;
    /**
     * 博客标签表实体连接
     */
    @InjectRepository(BlogTabE)
    public blogTabRep: Repository<BlogTabE>;
    /**
     * 弹幕表实体连接
     */
    @InjectRepository(BulletCommentE)
    public bulletCommentRep: Repository<BulletCommentE>;
    /**
     * 日记表实体连接
     */
    @InjectRepository(DiaryE)
    public diaryRep: Repository<DiaryE>;
    /**
     * 便签表实体连接
     */
    @InjectRepository(MemoE)
    public memoRep: Repository<MemoE>;
    /**
     * 用户数据表实体连接
     */
    @InjectRepository(UserDataE)
    public userDataRep: Repository<UserDataE>;
    /**
     * 用户表实体连接
     * 这个连接不暴露给其它地方使用，就是说用户表的连接只能userM能用，其它地方全部都要通过userM来调用，因为这张表涉及到了用户隐私
     */
    @InjectRepository(UserE)
    private userRep: Repository<UserE>;
    /**
     * 博客评论表实体连接
     */
    @InjectRepository(BlogCommentE)
    public blogCommentRep: Repository<BlogCommentE>;
    /**
     * 贡献表实体连接
     */
    @InjectRepository(ContributionsE)
    public contributionsRep: Repository<ContributionsE>;
    /**
     * 日记补充表实体连接
     */
    @InjectRepository(DiarySupplementE)
    public diarySupplementRep: Repository<DiarySupplementE>;

    private m_testM: TestM;
    /** 测试表模型 */
    public get testM() {
        if (!this.m_testM) {
            this.m_testM = new TestM(this.testRep, this);
        }
        return this.m_testM;
    }

    private m_blogM: BlogM;
    /** 博客表模型 */
    public get blogM() {
        if (!this.m_blogM) {
            this.m_blogM = new BlogM(this.blogRep, this);
        }
        return this.m_blogM;
    }
    private m_blogTabM: BlogTabM;
    /** 博客表tab模型 */
    public get blogTabM() {
        if (!this.m_blogTabM) {
            this.m_blogTabM = new BlogTabM(this.blogTabRep, this);
        }
        return this.m_blogTabM;
    }
    private m_bulletCommentM: BulletCommentM;
    /** 弹幕表模型 */
    public get bulletCommentM() {
        if (!this.m_bulletCommentM) {
            this.m_bulletCommentM = new BulletCommentM(this.bulletCommentRep, this);
        }
        return this.m_bulletCommentM;
    }
    private m_diaryM: DiaryM;
    /** 日记表模型 */
    public get diaryM() {
        if (!this.m_diaryM) {
            this.m_diaryM = new DiaryM(this.diaryRep, this);
        }
        return this.m_diaryM;
    }
    private m_memoM: MemoM;
    /** 便签表模型 */
    public get memoM() {
        if (!this.m_memoM) {
            this.m_memoM = new MemoM(this.memoRep, this);
        }
        return this.m_memoM;
    }
    private m_userDataM: UserDataM;
    /** 用户数据表模型 */
    public get userDataM() {
        if (!this.m_userDataM) {
            this.m_userDataM = new UserDataM(this.userDataRep, this);
        }
        return this.m_userDataM;
    }
    private m_userM: UserM;
    /** 用户表模型 */
    public get userM() {
        if (!this.m_userM) {
            this.m_userM = new UserM(this.userRep, this);
        }
        return this.m_userM;
    }
    private m_blogCommentRepM: BlogCommentM;
    /** 博客评论表模型 */
    public get blogCommentRepM() {
        if (!this.m_blogCommentRepM) {
            this.m_blogCommentRepM = new BlogCommentM(this.blogCommentRep, this);
        }
        return this.m_blogCommentRepM;
    }
    private m_contributionsM: ContributionsM;
    /** 贡献表模型 */
    public get contributionsM() {
        if (!this.m_contributionsM) {
            this.m_contributionsM = new ContributionsM(this.contributionsRep, this);
        }
        return this.m_contributionsM;
    }
    private m_diarySupplementM: DiarySupplementM;
    /** 日记补充表模型 */
    public get diarySupplementM() {
        if (!this.m_diarySupplementM) {
            this.m_diarySupplementM = new DiarySupplementM(this.diarySupplementRep, this);
        }
        return this.m_diarySupplementM;
    }
}