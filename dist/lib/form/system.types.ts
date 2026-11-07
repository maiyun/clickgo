import type * as clickgo from '../../clickgo';
import type * as lCore from '../core';
import type * as lTask from '../task';
import type * as lTool from '../tool';
import type * as lDom from '../dom';
import type { state, info } from './state';
import type { changeFocus, getMaxZIndexID } from './window';

/** --- 系统宿主所需的框架能力和状态；挂载后通过回调同步 Vue 根实例 --- */
export interface ISystemDependencies {
    /** --- Vue 与指针模块 --- */
    'clickgo': typeof clickgo;
    /** --- 配置、事件及 Vue 类型 --- */
    'lCore': typeof lCore;
    /** --- 任务启动及语言查询 --- */
    'lTask': typeof lTask;
    /** --- 语言标签、方向及回退工具 --- */
    'lTool': typeof lTool;
    /** --- 滚动容器与键盘状态 --- */
    'lDom': typeof lDom;
    /** --- 系统 ID 等共享状态 --- */
    'state': typeof state;
    /** --- 系统语言文本及窗体信息 --- */
    'info': typeof info;
    /** --- 切换窗体焦点 --- */
    'changeFocus': typeof changeFocus;
    /** --- 查询可恢复焦点的最上层窗体 --- */
    'getMaxZIndexID': typeof getMaxZIndexID;
    /** --- 语言方向变化后刷新通知位置 --- */
    'refreshNotifyPosition': () => void;
    /** --- 任务栏 Vue 挂载后同步根实例 --- */
    'setSimpleSystemTaskRoot': (root: lCore.IVue) => void;
    /** --- 启动器 Vue 挂载后同步根实例 --- */
    'setLauncherRoot': (root: lCore.IVue) => void;
}

/** --- 系统宿主创建的 DOM 节点，init 将它们挂载到页面 --- */
export interface ISystemElements {
    'wrap': HTMLDivElement;
    'list': HTMLDivElement;
    'popList': HTMLDivElement;
    'circular': HTMLDivElement;
    'rectangle': HTMLDivElement;
    'keyboard': HTMLDivElement;
    'notify': HTMLElement;
    'alert': HTMLElement;
    'simpletask': HTMLDivElement;
    'launcher': HTMLDivElement;
    'confirm': HTMLDivElement;
    'init': () => void;
}

/** --- 系统宿主运行时能力，节点和 Vue 根实例在初始化时挂载 --- */
export interface ISystemRuntime {
    'elements': ISystemElements;
    /** @param taskId 仅刷新指定任务，省略时刷新全部任务 */
    refreshLocaleDirection(taskId?: string): void;
    /** @param current 系统级 ID
     * @param html 询问框内容
     * @returns 用户选择；ID 不匹配或已有询问框时返回 false
     */
    superConfirm(current: string, html: string): Promise<boolean>;
    /** --- 显示虚拟键盘 --- */
    showKeyboard(): void;
    /** --- 隐藏虚拟键盘 --- */
    hideKeyboard(): void;
    /** @returns 启动器是否显示，不包含关闭动画 */
    getLauncherShow(): boolean;
    /** --- 显示启动器并广播状态变化 --- */
    showLauncher(): void;
    /** --- 隐藏启动器并广播状态变化 --- */
    hideLauncher(): void;
    /** --- 初始化宿主，重复调用无操作 --- */
    init(): void;
}
