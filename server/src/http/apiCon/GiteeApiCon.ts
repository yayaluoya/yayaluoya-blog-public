import { BaseApiCon, cuBaseApiOp } from "../BaseApiCon";
import { InstanceTool } from "@utils/InstanceTool";
import { GitConfig } from "src/config/GitConfig";
/**
 * giteeApi工具
 */
@InstanceTool()
export class GiteeApiCon extends BaseApiCon {
    static readonly instance: GiteeApiCon;

    protected get _op(): cuBaseApiOp {
        return {
            baseURL: 'https://gitee.com/api/v5',
        };
    }

    private get access_token() {
        return GitConfig.gitee.token;
    }

    /** 获取用户资料 */
    public getUserInfo() {
        return this.get({
            url: '/user',
            params: {
                access_token: this.access_token,
            },
        });
    }

    /**
     * 获取公共仓库
     */
    public getPublicRepos(op: {
        page: number;
        per_page: number;
    }) {
        return this.requestPri({
            url: '/user/repos',
            params: {
                access_token: this.access_token,
                visibility: 'public',
                sort: 'created',
                ...op,
            },
        }).then((res) => {
            let data: ComN.IPageData<any> = {
                list: res.data,
                length: parseInt(res.headers['total_count']),
            };
            return data;
        });
    }
}