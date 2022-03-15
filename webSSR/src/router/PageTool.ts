import router from ".";
import { EPage } from "./EPage";
import { Base64 } from "com_utils/Base64";

/**
 * 页面工具
 */
export class PageTool {
    /**
     * 去登录页面
     */
    static async toLogin() {
        let _router = await router;
        if (_router.currentRoute.value.path == EPage.login) { return; }
        _router.push({
            path: EPage.login,
            query: {
                back: Base64.encodeURL(_router.currentRoute.value.fullPath),
            },
        });
    }

    /**
     * 去博客页面
     * @param tagName 
     */
    static async toBlogPage(tagName?: string) {
        let _router = await router;
        if (_router.currentRoute.value.path == EPage.Blog) {
            let onTagNamesArr = ((_router.currentRoute.value.query.tags || '') as string).split(',').filter(Boolean);
            if (tagName) {
                //有就删除，没有就添加
                if (onTagNamesArr.includes(tagName)) {
                    onTagNamesArr = onTagNamesArr.filter(item => item != tagName);
                } else {
                    onTagNamesArr.push(tagName);
                }
            }
            tagName = onTagNamesArr.join(',') || undefined;
        }
        _router.push({
            path: EPage.Blog,
            query: {
                tags: tagName,
            },
        });
    }
}