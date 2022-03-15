const config = require('../../config.json');

export const WXConfig = {
    /** 微信小程序appid */
    appid: config.WX.appid,
    /** 小程序密钥 */
    secret: config.WX.secret,
};