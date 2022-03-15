import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ResData } from "src/http/ResData";
import { TabRepCon } from "../TabRepCon";
import { UserConfig } from "src/config/UserConfig";
import { AliOssT } from "src/utils/AliOssT";

/**
 * 后台模块控制器
 */
@Controller('admin')
export class AdminC extends TabRepCon {
    @Get('test')
    test() {
        return new ResData('后台模块测试');
    }

    /** 验证用户 */
    async vUser(token: string | undefined): Promise<boolean> {
        if (!token) {
            return false;
        } else {
            return this.userM.vUserId(token).then((id) => {
                return !!id;
            });
        }
    }

    @Get('stsServer')
    async stsServer() {
        return AliOssT.stsServer().then((info) => {
            return new ResData(info);
        }).catch((e) => {
            return new ResData().fialData(e);
        })
    }

    /** 获取用户列表 */
    @Get('getUserList')
    async getUserList() {
        return this.userM.list();
    }

    @Post('addBlog')
    @HttpCode(HttpStatus.OK)
    async addBlog(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.blogM.add(body, userId);
    }

    @Post('editBlog')
    @HttpCode(HttpStatus.OK)
    async editBlog(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.blogM.edit(body);
    }

    @Post('addBlogTab')
    @HttpCode(HttpStatus.OK)
    async addBlogTab(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.blogTabM.add(body);
    }

    @Post('editBlogTab')
    @HttpCode(HttpStatus.OK)
    async editBlogTab(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.blogTabM.edit(body);
    }

    @Get('remoteBlogTab')
    async remoteBlogTab(@Query() query, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.blogTabM.remote(query.id);
    }

    @Post('addBC')
    @HttpCode(HttpStatus.OK)
    async addBC(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.bulletCommentM.add(body, userId);
    }

    @Post('removeBC')
    @HttpCode(HttpStatus.OK)
    async removeBC(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.bulletCommentM.remove(body.id);
    }

    @Post('getBC')
    @HttpCode(HttpStatus.OK)
    async getBC(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.bulletCommentM.getBC(body);
    }

    @Post('addDiary')
    @HttpCode(HttpStatus.OK)
    async addDiary(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.diaryM.add(body, userId);
    }

    @Post('editDiary')
    @HttpCode(HttpStatus.OK)
    async editDiary(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.diaryM.edit(body);
    }

    @Post('addMemo')
    @HttpCode(HttpStatus.OK)
    async addMemo(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.memoM.add(body, userId);
    }

    @Post('editMemo')
    @HttpCode(HttpStatus.OK)
    async editMemo(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.memoM.edit(body);
    }

    @Post('editMemoPos')
    @HttpCode(HttpStatus.OK)
    async editMemoPos(@Body() body, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.memoM.editPos(body);
    }

    @Post('addUser')
    @HttpCode(HttpStatus.OK)
    async addUser(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        //只有根用户能添加别的用户
        if (userId != UserConfig.rootUserId) {
            return new ResData().needLogin();
        }
        return this.userM.add(body);
    }

    @Post('editUserPassword')
    @HttpCode(HttpStatus.OK)
    async editUserPassword(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.userM.editPassword(body, userId);
    }

    @Post('editUser')
    @HttpCode(HttpStatus.OK)
    async editUser(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.userDataM.edit(body, userId);
    }

    @Post('editUserMemo')
    @HttpCode(HttpStatus.OK)
    async editUserMemo(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.userDataM.editMemo(body, userId);
    }

    @Post('setUserDeleteState')
    @HttpCode(HttpStatus.OK)
    async setUserDeleteState(@Body() body, @Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        //只有根用户能修改用户删除状态
        if (userId != UserConfig.rootUserId) {
            return new ResData().needLogin();
        }
        return this.userM.setDeleteState(body);
    }

    @Get('outLogin')
    async outLogin(@Headers() headers: ComN.IReqHead) {
        let userId = await this.userM.vUserId(headers['x-token']);
        if (!userId) {
            return new ResData().needLogin();
        }
        return this.userM.outLogin(userId);
    }

    @Get('removeBlogC')
    async removeBlogC(@Query() query, @Headers() headers: ComN.IReqHead) {
        if (!await this.vUser(headers['x-token'])) {
            return new ResData().needLogin();
        }
        return this.blogCommentRepM.remote(query.id);
    }
}