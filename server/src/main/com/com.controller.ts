import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { readFileSync } from "fs";
import { join } from "path";
import { ResData } from "src/http/ResData";
import { PathManager } from "src/pathManager/PathManager";
import { TabRepCon } from "../TabRepCon";

/**
 * 公共模块控制器
 */
@Controller('com')
export class ComC extends TabRepCon {
    @Get('test')
    async test() {
        return new ResData({
            mes: '公告模块测试',
        });
    }

    @Get('getOneBlog')
    getOneBlog(@Query() query) {
        return this.blogM.getOne(query.id);
    }

    @Get('getTimeLineBlog')
    getTimeLineBlog(@Query() query) {
        return this.blogM.getTimeLine(query.id, query.size);
    }

    @Post('findBlog')
    @HttpCode(HttpStatus.OK)
    async findBlog(@Body() body, @Headers() headers: ComN.IReqHead) {
        body.userId = await this.userM.vUserId(headers['x-token']);
        return this.blogM.find(body);
    }

    @Get('addBlogShowNumber')
    addBlogShowNumber(@Query() query) {
        return this.blogM.addShowNumber(query.id);
    }

    @Get('getOneBlogTab')
    getOneBlogTab(@Query() query) {
        return this.blogTabM.getOneTab(query.id);
    }

    @Get('getAllBlogTab')
    getAllBlogTab() {
        return this.blogTabM.getAll();
    }

    @Post('byTabNamesGetTabs')
    @HttpCode(HttpStatus.OK)
    async byTabNamesGetTabs(@Body() body) {
        return this.blogTabM.byTabNamesGetTabs(body.tabNames);
    }

    @Get('getAllBC')
    getAllBC() {
        return this.bulletCommentM.getAll();
    }

    @Post('randomBC')
    @HttpCode(HttpStatus.OK)
    random(@Body() body) {
        return this.bulletCommentM.random(body.ids);
    }

    @Post('findDiary')
    @HttpCode(HttpStatus.OK)
    async findDiary(@Body() body, @Headers() headers: ComN.IReqHead) {
        body.userId = await this.userM.vUserId(headers['x-token']);
        return this.diaryM.find(body);
    }

    @Post('findMemo')
    @HttpCode(HttpStatus.OK)
    async findMemo(@Body() body, @Headers() headers: ComN.IReqHead) {
        body.userId = await this.userM.vUserId(headers['x-token']);
        return this.memoM.find(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body) {
        return this.userM.login(body);
    }

    @Get('loginUser')
    loginUser(@Headers() headers: ComN.IReqHead) {
        return this.userM.find({
            token: headers['x-token'],
        }, false);
    }

    @Get('getUser')
    async getUser(@Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        return this.userM.find({
            //这里注意如果没登录的话则获取的是main用户的信息
            id: userId || 1,
        });
    }

    @Get('getUserMemo')
    async getUserMemo(@Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        return this.userDataM.getMemo(userId || 1);
    }

    @Post('addBC')
    @HttpCode(HttpStatus.OK)
    async addBC(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        return this.blogCommentRepM.add(body, !!userId);
    }

    @Post('findBC')
    @HttpCode(HttpStatus.OK)
    findBC(@Body() body) {
        return this.blogCommentRepM.find(body);
    }

    @Get('getMdHelp')
    getMdHelp() {
        return new ResData(readFileSync(join(PathManager.dataPath, 'mdHelp.md')).toString());
    }

    @Get('getContributionY')
    async getContributionY(@Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        return this.contributionsM.getY(userId);
    }

    @Get('getContributionList')
    async getContributionList(@Query() query, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        return this.contributionsM.getList(query, userId);
    }

    @Post('pageContributionList')
    @HttpCode(HttpStatus.OK)
    async pageContributionList(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        return this.contributionsM.page(body, userId);
    }

    @Post('getContributionD')
    @HttpCode(HttpStatus.OK)
    async getContributionD(@Body() body) {
        return this.contributionsM.getContributionD(body.ids);
    }

    @Get('getEmoji')
    getEmoji() {
        return new ResData(readFileSync(join(PathManager.dataPath, 'emoji.json')).toString());
    }
}