import * as lZip from '../zip.js';
import * as lTool from '../tool.js';
import * as lAboxPackage from '../../abox/package.js';
import type { IAppPackage } from '../core.js';

/** --- CGA 读取器所需的框架能力，供黑箱调用 --- */
export interface IPackageIO {
    /** --- 打开已解密的 ZIP 内容块，供读取器访问文件；失败返回 null --- */
    'getZip': typeof lZip.get;
    /** --- 将包内图标 Blob 转为可展示的 data URL --- */
    'blob2DataUrl': typeof lTool.blob2DataUrl;
    /** --- 按包内路径识别 MIME 类型，用于构造二进制文件 Blob --- */
    'getMimeByPath': typeof lTool.getMimeByPath;
}

/**
 * --- 校验 CGA 应用包并创建按需读取器，统一接入框架的 ZIP、图标和文件类型能力 ---
 * @param blob CGA 应用包的二进制内容
 * @returns 图标 data URL 和包读取器；包格式、认证或图标读取失败返回 false
 */
export function createPackage(blob: Blob): Promise<false | {
    /** --- 无内嵌图标时为空字符串 --- */
    'icon': string;
    /** --- 按需读取文件，读取失败按 IAppPackage 契约返回 null --- */
    'package': IAppPackage;
}> {
    return lAboxPackage.createPackage(blob, {
        'getZip': lZip.get,
        'blob2DataUrl': lTool.blob2DataUrl,
        'getMimeByPath': lTool.getMimeByPath,
    });
}
