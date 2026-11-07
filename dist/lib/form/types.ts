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
import type * as lCore from '../core';
import type * as lControl from '../control';
import type { AbstractForm } from '../form';

/** --- AbstractPanel 显示事件 --- */
export interface IAbstractPanelShowEvent {
    'detail': {
        'data': Record<string, any>;
        /** --- 是否是 nav 模式 --- */
        'nav': boolean;
        /** --- 仅 nav 联动时有效，代表是前进还是回退 --- */
        'action': 'forword' | 'back';
        /** --- 仅 nav 联动时有效，代表上一个的 formHash 的值 --- */
        'previous': string;
        /** --- 仅 nav 联动时有效，代表本次 show 的时候 qs 是否发生了变化 --- */
        'qsChange': boolean;
    };
}

/** --- AbstractPanel qsChange 显示事件 --- */
export interface IAbstractPanelQsChangeShowEvent {
    'detail': {
        'data': Record<string, any>;
        /** --- 是否是 nav 模式 --- */
        'nav': boolean;
        /** --- 仅 nav 联动时有效，代表是前进还是回退 --- */
        'action': 'forword' | 'back';
        /** --- 仅 nav 联动时有效，代表上一个的 formHash 的值 --- */
        'previous': string;
        /** --- 仅 nav 联动时有效，代表本次 qs 是否发生了变化 --- */
        'qsChange': boolean;
    };
}

/** --- 运行时 task 中的 form 对象 --- */
export interface IForm {
    'id': string;
    'vapp': lCore.IVApp;
    'vroot': lCore.IVue;
    /** --- 是否已经执行过了关闭窗体方法，此处加判断为了防止重复执行 close 导致的 bug --- */
    'closed': boolean;
}

/** --- Form 的简略情况，通常在 list 当中 --- */
export interface IFormInfo {
    'taskId': string;
    'title': string;
    'icon': string;
    'stateMax': boolean;
    'stateMin': boolean;
    'show': boolean;
    'focus': boolean;
    'showInSystemTask': boolean;
}

/** --- 移动 drag 到新位置函数的选项 --- */
export interface IMoveDragOptions {
    'top'?: number;
    'left'?: number;
    'width'?: number;
    'height'?: number;
    'icon'?: boolean;
}

/** --- 弹出 notify 信息框的选项 --- */
export interface INotifyOptions {
    'title'?: string;
    /** --- 正文 --- */
    'content'?: string;
    /** --- 浅色描述 --- */
    'note'?: string;
    'icon'?: string | null;
    'timeout'?: number;
    'type'?: 'primary' | 'info' | 'warning' | 'danger' | 'progress';
    'progress'?: boolean;
}

/** --- notify 信息框的修改选项 --- */
export interface INotifyContentOptions {
    'title'?: string;
    'content'?: string;
    'note'?: string;
    /** --- 可顺便修改进度 --- */
    'progress'?: number;
    /** --- 设置后将在 x 毫秒后隐藏，这不会大于创建时的设置的总时长 --- */
    'timeout'?: number;
}

/** --- Dialog 选项 --- */
export interface IFormDialogOptions {
    /** --- dialog 窗体标题，不传则使用默认标题 dialog --- */
    'title'?: string;
    /** --- dialog 内容，支持直接传布局字符串 --- */
    'content': string;
    /** --- 底部按钮文本列表，默认使用当前语言的确定按钮文本 --- */
    'buttons'?: string[];
    /** --- 点击按钮后是否自动将按钮文本写入 dialogResult，默认 true --- */
    'autoDialogResult'?: boolean;

    /** --- dialog 控件内容布局方向，h 为横向，v 为纵向 --- */
    'direction'?: 'h' | 'v';
    /** --- dialog 控件内容区项目间距，会透传给 dialog 控件 --- */
    'gutter'?: number | string;
    /** --- dialog 控件宽度，传数字时为像素值，传 fill 时代表填充可用宽度 --- */
    'width'?: number | string;
    /** --- dialog 控件高度，传数字时为像素值，传 fill 时代表填充可用高度 --- */
    'height'?: number | string;
    /** --- dialog 控件内容区是否显示内边距，默认表现与控件自身一致 --- */
    'padding'?: boolean | string;

    /** --- 传值，需要用 data.x 读取 --- */
    'data'?: Record<string, any>;
    /** --- 传值，需要用 methods.x 读取 --- */
    'methods'?: Record<string, (...param: any) => any>;
    /** --- 样式表 --- */
    'style'?: string;
    /** --- 路径基，以 / 结束或文件路径则以文件的基路径为准，可留空 --- */
    'path'?: string;

    /**
     * --- 点击按钮触发事件，不能用 Promise ---
     * @param e 数据事件
     * @param button 按钮的文本
     */
    select?: (
        this: AbstractForm & { 'data': Record<string, any>; 'methods': Record<string, (...param: any) => any>; },
        e: IFormDialogSelectEvent,
        button: string
    ) => void;

    /**
     * --- 窗体挂载完成事件 ---
     */
    onMounted?: () => void | Promise<void>;
}

export interface IFormDialogSelectEvent extends lControl.ICustomEvent {
    'detail': {
        'button': string;
    };
}

/** --- Confirm 选项 --- */
export interface IFormConfirmOptions {
    'title'?: string;
    'content': string;
    'cancel'?: boolean;
}

/** --- 显示验证码选项 --- */
export interface IFormCaptchaOptions {
    /** --- 验证码服务商 --- */
    'factory': 'tc' | 'cf';
    /** --- 验证码 key --- */
    'akey': string;
}

/** --- Prompt 选项 --- */
export interface IFormPromptOptions {
    /** --- 标题 --- */
    'title'?: string;
    /** --- 内容说明 --- */
    'content': string;
    /** --- 文本默认值 --- */
    'text'?: string;
    /** --- 是否显示取消按钮，默认显示 --- */
    'cancel'?: boolean;

    /**
     * --- 点击按钮触发事件 ---
     * @param e 数据事件
     * @param button true 代表确定，false 代表取消
     */
    'select'?: (
        this: AbstractForm & { 'data': Record<string, any>; },
        e: IFormPromptSelectEvent,
        button: boolean
    ) => void;
}

export interface IFormPromptSelectEvent extends lControl.ICustomEvent {
    'detail': {
        /** --- true 代表确定，false 代表取消 --- */
        'button': boolean;
        'value': string;
    };
}
