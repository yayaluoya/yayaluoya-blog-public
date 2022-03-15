import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { GiteeApiCon } from "src/http/apiCon/GiteeApiCon";
import { GithubApiCon } from "src/http/apiCon/GithubApiCon";
import { ResData } from "src/http/ResData";

/**
 * git模块控制器
 */
@Controller('git')
export class GitC {
    @Get('test')
    async test() {
        return new ResData({
            mes: 'git模块测试',
        });
    }

    @Get('getGiteeUserInfo')
    async getGiteeUserInfo() {
        return GiteeApiCon.instance.getUserInfo().then((data) => {
            return new ResData(data);
        }).catch((e) => {
            return new ResData().fialData(e, '获取失败');
        })
    }

    @Get('getGithubUserInfo')
    async getGithubUserInfo() {
        return GithubApiCon.instance.getUserInfo().then((data) => {
            return new ResData(data);
        }).catch((e) => {
            return new ResData().fialData(e, '获取失败');
        })
    }

    @Get('getGiteePublicRepos')
    async getGiteePublicRepos(@Query() query) {
        return GiteeApiCon.instance.getPublicRepos(query).then((data) => {
            return new ResData(data);
        }).catch((e) => {
            return new ResData().fialData(e, '获取失败');
        })
    }

    @Get('getGithubPublicRepos')
    async getGithubPublicRepos(@Query() query) {
        return GithubApiCon.instance.getPublicRepos(query).then((data) => {
            return new ResData(data);
        }).catch((e) => {
            return new ResData().fialData(e, '获取失败');
        })
    }
}