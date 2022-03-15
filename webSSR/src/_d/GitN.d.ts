/** 
 * git的命名kongjian 
 */
declare namespace GitN {
    /**
     * 用户
     */
    interface IUserInfo {
        /** 头像 */
        avatar_url: string;
        /** 主页 */
        html_url: string;
        /** 个人简介 */
        bio: string;
        /** 博客地址 */
        blog: string;
        /** 创建日期 */
        created_at: string;
        /** 邮箱 */
        email: string;
        /** 名字 */
        login: string;
        /** 名字 */
        name: string;
        /** 更新时间 */
        updated_at: string;

    }
    /** 
     * 仓库用户
     */
    interface IReposUser {
        [key: string]: any;
        /** 头像 */
        avatar_url: string;
        /** 主页 */
        html_url: string;
    }
    /**
     * 仓库
     */
    interface IRepos<U extends IReposUser = IReposUser> {
        [key: string]: any;
        /** 创建日期 */
        created_at: string;
        /** 默认分支 */
        default_branch: string;
        /** 描述 */
        description: string;
        fork: boolean;
        forks_count: number;
        full_name: string;
        /** 主页 */
        html_url: string;
        language: string;
        /** 仓库名称 */
        name: string;
        owner: U;
        ssh_url: string;
        /** 星星 */
        stargazers_count: number;
        /** 更新时间 */
        updated_at: string;
        watched: boolean;
        watchers_count: number;
    }
    namespace Github {
        interface IUserInfo extends GitN.IUserInfo {
            /** 公司 */
            company: string;
        }
        interface IUser extends GitN.IReposUser {
            /** 名字 */
            login: string;
        }
        interface IRepos extends GitN.IRepos<IReposUser> {
            /** 克隆地址 */
            clone_url: string;
            git_url: string;
            open_issues: number;
            open_issues_count: number;
            /** 能见度 */
            visibility: 'public' | 'private';
            /** 推送时间 */
            pushed_at: string;
            svn_url: string;
        }
    }
    namespace Gitee {
        interface IUserInfo extends GitN.IUserInfo { }
        interface IReposUser extends GitN.IReposUser {
            /** 名字 */
            name: string;
        }
        interface IRepos extends GitN.IRepos<IReposUser> {
            /** 贡献人 */
            assignee: IReposUser[];
            assigner: IReposUser;
            human_name: string;
            path: string;
            project_creator: string;
            public: boolean;
            private: boolean;
            /** 状态 */
            status: string;
        }
    }
}