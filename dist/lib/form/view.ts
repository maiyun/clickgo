/**
 * Copyright 2007-2025 MAIYUN.NET
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AbstractComponent } from './abstract-component';
import type * as lTask from '../task';
import { notify } from './notification';
import * as lTool from '../tool';
import * as lDom from '../dom';
import * as lControl from '../control';
import { createViewRuntime } from '../../abox/form';

/** --- 隔离后的视图源码 --- */
export interface IPreparedView {
    'layout': string;
    'style': string;
    'prep': string;
}

/** --- 视图构建依赖，由框架入口提供 --- */
export interface IViewDependencies {
    'lTool': typeof lTool;
    'lDom': typeof lDom;
    'lControl': typeof lControl;
    'notify': typeof notify;
    'componentClass': typeof AbstractComponent;
}

let view: ReturnType<typeof createViewRuntime> | undefined;
function getView(): ReturnType<typeof createViewRuntime> {
    return view ??= createViewRuntime({ lTool, lDom, lControl, notify, componentClass: AbstractComponent });
}
/**
 * --- 隔离视图布局与样式，按任务和源码复用结果 ---
 * @param task 所属任务
 * @param path 资源基准路径
 * @param layout 布局源码
 * @param style 样式源码
 * @returns 隔离后的布局、样式和前缀；处理失败时拒绝
 */
export function prepareView(task: lTask.ITask, path: string, layout: string, style: string): Promise<IPreparedView> {
    return getView().prepareView(task, path, layout, style);
}

/**
 * --- 构建窗体或面板的局部组件定义 ---
 * @param task 所属任务
 * @param formId 所属窗体 ID
 * @param findex 窗体创建序号
 * @param componentClasses 要注册的组件类
 * @param panelId 所属面板 ID
 * @param chain 当前递归构建链
 * @returns 组件定义；源码无效或构建失败时拒绝
 */
export function buildLocalComponents(
    task: lTask.ITask,
    formId: string,
    findex: number,
    componentClasses: Record<string, new () => AbstractComponent>,
    panelId?: string,
    chain?: Array<new () => AbstractComponent>
): Promise<Record<string, any>> {
    return getView().buildLocalComponents(task, formId, findex, componentClasses, panelId, chain);
}
