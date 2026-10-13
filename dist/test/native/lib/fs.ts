import * as lAboxFs from '../abox/fs.js';

/**
 * --- 刷新 Windows 根目录的盘符缓存 ---
 * @returns 无返回值
 */
export async function refreshDrives(): Promise<void> {
    return lAboxFs.refreshDrives();
}

/**
 * --- 读取文件内容或字节范围 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @param options encoding 为输出编码；start/end 为零起始字节位置，end 含末字节；两者为 0 时沿用完整读取
 * @returns 文件内容；读取失败为 null
 */
export async function getContent(
    path: string,
    options: {
        'encoding'?: BufferEncoding;
        'start'?: number;
        'end'?: number;
    }
): Promise<string | Buffer | null> {
    return lAboxFs.getContent(path, options);
}

/**
 * --- 写入文件内容 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @param data 完整文本或二进制内容
 * @param options encoding/mode/flag 沿用 Node.js 写文件选项
 * @returns 是否写入成功
 */
export async function putContent(path: string, data: string | Buffer, options: {
    'encoding'?: BufferEncoding;
    'mode'?: number;
    'flag'?: string;
}): Promise<boolean> {
    return lAboxFs.putContent(path, data, options);
}

/**
 * --- 读取符号链接目标 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @param encoding 字符编码；省略时沿用文件系统默认值
 * @returns 链接目标；读取失败为 null
 */
export async function readLink(path: string, encoding?: BufferEncoding): Promise<string | null> {
    return lAboxFs.readLink(path, encoding);
}

/**
 * --- 创建符号链接 ---
 * @param filePath 链接指向的 ClickGo 文件路径
 * @param linkPath 新链接的 ClickGo 文件路径
 * @param type 链接类型；省略时由系统确定
 * @returns 是否创建成功
 */
export async function symlink(filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction'): Promise<boolean> {
    return lAboxFs.symlink(filePath, linkPath, type);
}

/**
 * --- 删除文件，失败时最多重试三次，每次间隔 250 ms ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @returns 是否删除成功
 */
export async function unlink(path: string): Promise<boolean> {
    return lAboxFs.unlink(path);
}

/**
 * --- 读取文件元数据，不跟随符号链接 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @returns 元数据；读取失败为 null
 */
export async function stats(path: string): Promise<Record<string, any> | null> {
    return lAboxFs.stats(path);
}

/**
 * --- 递归创建目录，已有目录视为成功 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @param mode 目录权限位
 * @returns 是否创建成功；前置元数据读取异常由调用边界处理
 */
export async function mkdir(path: string, mode: number): Promise<boolean> {
    return lAboxFs.mkdir(path, mode);
}

/**
 * --- 删除空目录，非目录视为成功 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @returns 是否删除成功；前置元数据读取异常由调用边界处理
 */
export async function rmdir(path: string): Promise<boolean> {
    return lAboxFs.rmdir(path);
}

/**
 * --- 修改文件权限 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @param mod 权限字符串或权限位
 * @returns 是否修改成功
 */
export async function chmod(path: string, mod: string | number): Promise<boolean> {
    return lAboxFs.chmod(path, mod);
}

/**
 * --- 移动或重命名路径 ---
 * @param oldPath 原 ClickGo 文件路径
 * @param newPath 目标 ClickGo 文件路径
 * @returns 是否修改成功
 */
export async function rename(oldPath: string, newPath: string): Promise<boolean> {
    return lAboxFs.rename(oldPath, newPath);
}

/**
 * --- 读取目录的直接子项，Windows 根目录使用盘符缓存 ---
 * @param path ClickGo 文件路径；Windows 使用 /盘符/ 路径
 * @param encoding 字符编码；省略时沿用文件系统默认值
 * @returns 子项的类型标志和名称；读取失败为空数组
 */
export async function readDir(path: string, encoding?: BufferEncoding): Promise<any[]> {
    return lAboxFs.readDir(path, encoding);
}

/**
 * --- 复制文件 ---
 * @param src 源 ClickGo 文件路径
 * @param dest 目标 ClickGo 文件路径
 * @returns 是否复制成功
 */
export async function copyFile(src: string, dest: string): Promise<boolean> {
    return lAboxFs.copyFile(src, dest);
}
