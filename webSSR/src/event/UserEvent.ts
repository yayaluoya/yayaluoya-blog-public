import { BaseEvent } from "@/base/BaseEvent";
import { InstanceTool } from "com_utils/InstanceTool";
/**
 * 用户事件管理器
*/
@InstanceTool()
export class UserEvent extends BaseEvent<'updateInfo'> {
    /** 单例 */
    static readonly instance: UserEvent;
}