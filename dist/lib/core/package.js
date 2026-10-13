import * as lZip from '../zip.js';
import * as lTool from '../tool.js';
import * as lAboxPackage from '../../abox/package.js';
/**
 * --- 校验 CGA 应用包并创建按需读取器，统一接入框架的 ZIP、图标和文件类型能力 ---
 * @param blob CGA 应用包的二进制内容
 * @returns 图标 data URL 和包读取器；包格式、认证或图标读取失败返回 false
 */
export function createPackage(blob) {
    return lAboxPackage.createPackage(blob, {
        'getZip': lZip.get,
        'blob2DataUrl': lTool.blob2DataUrl,
        'getMimeByPath': lTool.getMimeByPath,
    });
}
