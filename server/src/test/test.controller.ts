import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ResData } from "src/http/ResData";
import { TabRepCon } from "src/main/TabRepCon";

@Controller('test')
export class TestController extends TabRepCon {

    /** get */
    @Get('get')
    async get(@Query() query: any) {
        return new ResData(query).compress().encrypt();
    }

    /** post */
    @Post('post')
    @HttpCode(HttpStatus.OK)
    post(@Body() body): ResData {
        return new ResData(body);
    }

    /** 添加根用户 */
    @Get('addRootUser')
    async addRootUser() {
        return this.userM.add({
            account: 'admin',
            password: '123456',
            name: 'admin',
        } as any);
    }
}