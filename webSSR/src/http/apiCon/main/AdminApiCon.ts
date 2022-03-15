import { InstanceTool } from "com_utils/InstanceTool"
import { ComApiCon } from "./ComApiCon";
import { WebApiCon } from "./WebApiCon";

/**
 * 主api控制器
 */
@InstanceTool()
export class AdminApiCon extends WebApiCon {
    /** 单例 */
    static readonly instance: AdminApiCon;

    /** 根路径 */
    get _rootApi() {
        return super.rootApi.main.admin;
    }

    /** 测试 */
    test() {
        return this.getData<any>({
            url: this._rootApi.test,
        });
    }
    /** 获取sts的key */
    stsServer() {
        type t = {
            accessKeyId: string;
            accessKeySecret: string;
            stsToken: string;
            timeout: number;
        };
        return this.getData<t>({
            url: this._rootApi.stsServer,
        }).catch(({ mes }) => {
            console.error('获取临时访问key出错了', mes);
            return {} as t;
        });;
    }
    /** 添加博客 */
    addBlog(data: Partial<Omit<EN.IBlogE, 'theme'> & {
        theme: {
            md: string;
            code: string;
        },
    }>) {
        return this.postData<EN.IBlogE>({
            url: this._rootApi.addBlog,
            data,
        });
    }
    /** 编辑博客 */
    editBlog(data: Partial<Omit<EN.IBlogE, 'theme'> & {
        theme: {
            md: string;
            code: string;
        },
    }>) {
        return this.postData<EN.IBlogE>({
            url: this._rootApi.editBlog,
            data,
        }).then((d) => {
            //编辑完成后需要清除博客的缓存数据
            ComApiCon.instance.deleteBlogCatch(data.id!);
            //
            return d;
        });
    }
    /** 添加博客标签 */
    addBlogTab(data: Partial<EN.IBlogTabE>) {
        return this.postData<EN.IBlogTabE>({
            url: this._rootApi.addBlogTab,
            data,
        });
    }
    /** 编辑博客标签 */
    editBlogTab(data: Partial<EN.IBlogTabE>) {
        return this.postData<EN.IBlogTabE>({
            url: this._rootApi.editBlogTab,
            data,
        });
    }
    /** 删除一个标签 */
    remoteBlogTab(id: number) {
        return this.getData<void>({
            url: this._rootApi.remoteBlogTab,
            params: {
                id,
            },
        });
    }
    /** 添加弹幕 */
    addBC(data: Partial<EN.IBulletCommentE>) {
        return this.postData<EN.IBulletCommentE>({
            url: this._rootApi.addBC,
            data,
        });
    }
    /** 删除弹幕 */
    removeBC(id: number) {
        return this.postData<EN.IBulletCommentE>({
            url: this._rootApi.removeBC,
            data: {
                id,
            },
        });
    }
    /** 分页获取弹幕 */
    getBC(data: ComN.IPageQuery) {
        return this.postData<ComN.IPageData<EN.IBulletCommentE>>({
            url: this._rootApi.getBC,
            data,
        });
    }
    /** 添加日记 */
    addDiary(data: Partial<EN.IDiaryE>) {
        return this.postData<EN.IDiaryE>({
            url: this._rootApi.addDiary,
            data,
        });
    }
    /** 编辑日记 */
    editDiary(data: Partial<EN.IDiaryE & {
        supplement: any;
    }>) {
        return this.postData<EN.IDiaryE>({
            url: this._rootApi.editDiary,
            data,
        });
    }
    /** 添加便签 */
    addMemo(data: Partial<EN.IMemoE>) {
        return this.postData<EN.IMemoE>({
            url: this._rootApi.addMemo,
            data,
        });
    }
    /** 编辑便签 */
    editMemo(data: Partial<EN.IMemoE>) {
        return this.postData<EN.IMemoE>({
            url: this._rootApi.editMemo,
            data,
        });
    }
    /** 编辑便签位置 */
    editMemoPos(data: Partial<EN.IMemoE>) {
        return this.postData<EN.IMemoE>({
            url: this._rootApi.editMemoPos,
            data,
        });
    }
    /** 添加用户 */
    addUser(data: Partial<EN.IUserE & Pick<EN.IUserDataE, 'name'>>) {
        return this.postData<EN.IUserE>({
            url: this._rootApi.addUser,
            data,
        });
    }
    /** 编辑用户 */
    editUser(data: Partial<EN.IUserDataE>) {
        return this.postData<EN.IUserDataE>({
            url: this._rootApi.editUser,
            data,
        });
    }
    /** 编辑用户Memo数据 */
    editUserMemo(data: Partial<EN.IUserDataE>) {
        return this.postData<EN.IUserDataE>({
            url: this._rootApi.editUserMemo,
            data,
        });
    }
    /** 编辑用户密码，会返回一个新token */
    editUserPassword(data: {
        /** 原密码 */
        p: string;
        /** 新密码 */
        newP: string;
    }) {
        return this.postData<string>({
            url: this._rootApi.editUserPassword,
            data,
        });
    }
    /** 删除博客评论 */
    removeBlogC(id: number) {
        return this.getData<string>({
            url: this._rootApi.removeBlogC,
            params: {
                id,
            },
        });
    }
    /** 获取用户列表 */
    getUserList() {
        return this.getData<EN.IUserE[]>({
            url: this._rootApi.getUserList,
        });
    }
    /** 设置用户删除状态 */
    setUserDeleteState(data: {
        /** 用户id */
        userId: number;
        /** 删除状态 */
        delState: boolean;
    }) {
        return this.postData({
            url: this._rootApi.setUserDeleteState,
            data,
        });
    }
    /** 退出登录 */
    outLogin() {
        return this.getData({
            url: this._rootApi.outLogin,
        });
    }
}