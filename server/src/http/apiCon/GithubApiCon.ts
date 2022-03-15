import { BaseApiCon, cuBaseApiOp } from "../BaseApiCon";
import { InstanceTool } from "@utils/InstanceTool";
import { GitConfig } from "src/config/GitConfig";

/**
 * githubApi工具
 */
@InstanceTool()
export class GithubApiCon extends BaseApiCon {
    static readonly instance: GithubApiCon;

    protected get _op(): cuBaseApiOp {
        return {
            baseURL: 'https://api.github.com',
            headers: {
                'accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${this.token}`,
            },
        };
    }

    private get token() {
        return GitConfig.github.token;
    };

    /** 获取用户资料 */
    public getUserInfo() {
        return this.get({
            url: '/user',
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
            url: `/user/repos`,
            params: {
                type: 'public',
                sort: 'created',
                ...op,
            },
        }).then((res) => {
            let length = res.data.length < op.per_page ? (op.page - 1) * op.per_page + res.data.length : (op.page * op.per_page + 1);
            let data: ComN.IPageData<any> = {
                length,
                list: res.data,
            };
            return data;
        });
    }
}