import { BaseApiCon, cuBaseApiOp } from "../BaseApiCon";
import { InstanceTool } from "@utils/InstanceTool";
import { WXConfig } from "src/config/WXConfig";

/**
 * 微信api工具
 */
@InstanceTool()
export class WXApiCon extends BaseApiCon {
    static readonly instance: WXApiCon;

    protected get _op(): cuBaseApiOp {
        return {
            baseURL: 'https://api.weixin.qq.com',
        };
    }

    /**
     * 登录凭证校验
     * @param code 小程序登录凭证
     * @returns 
     */
    code2Session(code: string) {
        return this.get<{
            /** 用户唯一id */
            openid?: string;
            /** 会话密钥 */
            session_key?: string;
            /** 错误码 */
            errcode?: string;
            /** 错误消息 */
            errmsg?: string;
        }>({
            url: `sns/jscode2session?appid=${WXConfig.appid}&secret=${WXConfig.secret}&js_code=${code}&grant_type=authorization_code`,
        });
    }
}