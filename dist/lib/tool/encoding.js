import * as lAboxEncoding from '../../abox/tool-encoding.js';
/**
 * --- 严格解码文本；自动模式按 BOM 识别，否则采用 UTF-8，不猜测传统编码 ---
 * @param data 原始字节，Uint8Array 仅处理其视图范围
 * @param encoding 显式编码；省略时自动识别，显式编码与 BOM 冲突时失败
 * @returns 正文与实际采用的编码/BOM；非法字节、不支持的编码或 UTF-32 BOM 为 false
 */
export function decodeText(data, encoding) {
    return lAboxEncoding.decodeText(data, encoding);
}
/**
 * --- 将正文无损编码为字节，不自动规范化换行 ---
 * @param text 正文，不含文件头 BOM；正文自身的 U+FEFF 保留
 * @param options 编码及 BOM；默认 UTF-8 且无 BOM，GB18030 不允许 BOM
 * @returns 新字节数组；非法 UTF-16 代理项、无损编码失败或无效选项为 false，不用替代字符
 */
export function encodeText(text, options = { 'encoding': 'utf-8', 'bom': false }) {
    return lAboxEncoding.encodeText(text, options);
}
