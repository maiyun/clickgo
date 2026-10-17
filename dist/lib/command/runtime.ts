import type * as lCore from '../core';
import type * as lTask from '../task';
import type * as lNative from '../native';
import type * as lFile from './file';
import type * as lData from './data';
import type * as lWebMcp from './webmcp';
import type * as lGuide from './guide';
import type * as lTool from '../tool';

/** --- 命令运行时所需的框架机制；不自行创建任务、授权窗口或 Native 服务 --- */
export interface IRuntimeOptions {
    /** --- 页面接入状态变化通知，沿用框架全局事件 --- */
    'core': Pick<typeof lCore, 'trigger'>;
    /** --- 实时任务状态、任务发现及已有权限检查 --- */
    'task': Pick<typeof lTask, 'getOrigin' | 'getList' | 'checkPermission'>;
    /** --- Native 接入发现及显式、受权限保护的凭据导出 --- */
    'native': Pick<typeof lNative, 'getCommandEntry' | 'getMcpInfo'>;
    /** --- 文件句柄与容量、分段、有效期及所属范围契约 --- */
    'files': typeof lFile;
    /** --- 输入、元数据和结果的校验与独立快照 --- */
    'data': typeof lData;
    /** --- 公开命令的浏览器发布及撤销机制 --- */
    'webMcp': Pick<typeof lWebMcp, 'create'>;
    /** --- 从接入信息生成说明，不主动读取凭据 --- */
    'guide': Pick<typeof lGuide, 'format'>;
}

/** --- 文件缓存的外部机制与公开读取协议；每次创建得到独立缓存 --- */
export interface IFileStoreOptions {
    /** --- 文件随所属 App/Form 生命周期清理的框架计时器 --- */
    'task': Pick<typeof lTask, 'createTimer' | 'removeTimer'>;
    /** --- 把有界 Blob 分段编码为 Data URL，结果只取 Base64 数据部分 --- */
    'tool': Pick<typeof lTool, 'blob2DataUrl'>;
    /** --- 交付元数据中的框架读取命令名 --- */
    'readCommand': string;
    /** --- 默认读取长度与单段上限，单位为原始字节 --- */
    'defaultChunkBytes': number;
    'maxChunkBytes': number;
}
