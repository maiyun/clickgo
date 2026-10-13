import * as lAboxCommand from '../../abox/command.js';
import * as lAboxTool from '../../abox/tool.js';
import type { ISchema, TJson } from '../command';

/**
 * --- 检查可序列化值，拒绝循环、非有限数和类实例；限制嵌套深度 ---
 * @param value 待检查值
 * @param seen 当前路径上的对象
 * @param depth 当前深度
 * @returns 是否为合法 JSON
 */
export function isJson(value: unknown, seen = new Set<object>(), depth = 0): value is TJson {
    return lAboxTool.isJson(value, seen, depth);
}

/**
 * --- 注册时检查 schema，错误约束不能静默放行 ---
 * @param schema 当前 schema
 * @param root 根 schema
 * @param seen 已检查的节点
 * @returns 错误说明，合法时返回 null
 */
export function check(schema: ISchema | boolean, root?: ISchema, seen = new Set<ISchema>()): string | null {
    return lAboxCommand.check(schema, root, seen);
}

/**
 * --- 校验数据，不转换类型、不补默认值、不删除额外参数 ---
 * @param value 待校验数据
 * @param schema 当前 schema
 * @param root 根 schema
 * @param path 错误字段路径
 * @param depth 递归深度
 * @param ancestors 当前校验路径上的 schema，防止不推进数据的循环引用
 * @returns 错误说明，匹配时返回 null
 */
export function validate(
    value: TJson, schema: ISchema | boolean, root?: ISchema, path = '$', depth = 0,
    ancestors: Array<{ 'schema': ISchema; 'path': string; }> = []
): string | null {
    return lAboxCommand.validate(value, schema, root, path, depth, ancestors);
}
