import type * as clickgo from 'clickgo';

/** --- 分组高度调整所需的控件状态；高度包含标题和内容，单位为像素 --- */
export interface IDockGroupSizing extends clickgo.control.AbstractControl {
    'props': { 'resizable': boolean | string; };
    'dock': object | null;
    'groups': IDockGroupSizing[];
    'heightData': number;
    'isExpanded': boolean;
    'isCollapsed': boolean;
    'canResize': boolean;
    'minimumHeight': number;
    'nextGroup': IDockGroupSizing | null;
    'access': {
        'cancelResize': (() => void) | null;
    };
}
