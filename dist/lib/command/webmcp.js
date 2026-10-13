import * as lAboxCommand from '../../abox/command.js';
/**
 * --- 创建浏览器发布器，内部组织同步队列、撤销信号和迟到结果处理 ---
 * @param runtime 灰箱提供的公开命令选择、身份校验和执行能力
 * @returns 独立发布器；不持有页面状态或决定业务授权
 */
export function create(runtime) {
    return lAboxCommand.createWebPublisher(runtime);
}
