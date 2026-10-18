import * as layout from '../abox/layout';
/**
 * --- 计算有限场景及含标签的轮廓端点，不访问 DOM 或启动持续布局循环 ---
 * @param nodes 已去重的节点，顺序为插槽的实际顺序
 * @param edges 声明式连接，缺少端点时忽略
 * @param mode radial 环形、tree 分层、compact 紧凑纵排、manual 手动坐标
 * @param root 优先根节点 ID，空值自动选择
 * @param gap 自动布局的最小间隔，单位 CSS 像素
 * @returns 归一化后的场景，空节点返回零尺寸
 */
export function arrange(nodes, edges, mode, root, gap) {
    return layout.arrange(nodes, edges, mode, root, gap);
}
