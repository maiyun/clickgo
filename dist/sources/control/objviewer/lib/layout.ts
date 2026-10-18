import type * as clickgo from 'clickgo';
import * as layout from '../abox/layout';

/** --- 测量后的节点，manual 布局的 x/y 使用内容坐标，可为负数 --- */
export interface INode {
    'id': string;
    'width': number;
    'height': number;
    'x': number;
    'y': number;
    'hub': boolean;
    /** --- 中心节点说明的实际宽度，缺省时使用节点宽度 --- */
    'captionWidth'?: number;
}

/** --- 带绘制坐标的连接 --- */
export interface IEdge extends clickgo.control.IObjviewerEdge {
    'animation': 'none' | 'dash' | 'dots';
    'direction': 'forward' | 'reverse' | 'both';
    'duration': number;
    'dotCount': number;
    'path': string;
    'x': number;
    'y': number;
}

/** --- 已留出边距的场景，节点及连线共用同一坐标系 --- */
export interface IScene {
    'nodes': INode[];
    'edges': IEdge[];
    'width': number;
    'height': number;
}

/**
 * --- 计算有限场景及含标签的轮廓端点，不访问 DOM 或启动持续布局循环 ---
 * @param nodes 已去重的节点，顺序为插槽的实际顺序
 * @param edges 声明式连接，缺少端点时忽略
 * @param mode radial 环形、tree 分层、compact 紧凑纵排、manual 手动坐标
 * @param root 优先根节点 ID，空值自动选择
 * @param gap 自动布局的最小间隔，单位 CSS 像素
 * @returns 归一化后的场景，空节点返回零尺寸
 */
export function arrange(nodes: INode[], edges: clickgo.control.IObjviewerEdge[], mode: 'radial' | 'tree' | 'compact' | 'manual', root: string, gap: number): IScene {
    return layout.arrange(nodes, edges, mode, root, gap);
}
