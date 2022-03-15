const config = require('../../config.json');

/**
 * git的配置
 */
export const GitConfig = {
    github: {
        token: config.github.token,
    },
    gitee: {
        token: config.gitee.token,
    },
};