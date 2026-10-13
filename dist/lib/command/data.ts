import * as lAboxCommand from '../../abox/command.js';
import type { IDefinition, IMetadata, ISchema, TJson, TResult } from '../command';

/**
 * --- 检查命令定义的字段、支持的 schema 和 JSON 元数据，并保存独立快照 ---
 * @param definition 命令定义；名称为 1–128 位 ASCII 字母、数字、_、.、-，说明不能为空白
 * @returns 元数据快照；字段、回调类型、权限列表、注解或 schema 不合法返回 false；不检查授权或所属实例
 */
export function readMetadata<T extends Record<string, TJson>>(definition: IDefinition<T>): IMetadata | false {
    return lAboxCommand.readMetadata(definition);
}

/**
 * --- 按命令的输入 schema 校验 JSON 对象，并隔离调用方后续修改 ---
 * @param args 输入数据，不转换类型、不补默认值、不删除额外字段
 * @param schema 注册时已验证的输入 schema
 * @returns 成功时 data 为独立参数；非 JSON 对象或约束不匹配返回 invalid-input
 */
export function readInput(args: unknown, schema: ISchema): TResult<Record<string, TJson>> {
    return lAboxCommand.readInput(args, schema);
}

/**
 * --- 检查业务结果的 JSON 结构及输出约束，生成可跨入口传输的独立结果 ---
 * @param result 业务回调结果；成功须有 data，失败须有非空错误码和字符串说明
 * @param schema 可选输出 schema，只校验成功结果的 data
 * @returns 合法业务错误保留 code/message；成功数据复制；结构或约束不匹配返回 invalid-output
 */
export function readResult(result: unknown, schema?: ISchema): TResult {
    return lAboxCommand.readResult(result, schema);
}

/**
 * --- 复制已验证的 JSON，保持 JSON 往返语义，不与注册表共享对象 ---
 * @param value 已通过 JSON 检查的元数据或业务数据
 * @returns 独立快照
 */
export function copy<T>(value: T): T {
    return lAboxCommand.copyJson(value);
}
