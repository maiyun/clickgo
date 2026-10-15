import * as lAboxTool from '../abox/tool.js';
export { decodeText, encodeText } from './tool/encoding.js';
/**
 * Copyright 2007-2025 MAIYUN.NET
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * --- 运行 iife 代码 ---
 * @param code iife 代码
 * @returns 模块对象
 */
export function runIife(code) {
    return lAboxTool.runIife(code);
}
/**
 * --- 压缩一个图片 ---
 * @param file 文件或 blob 类型 ---
 * @param options 参数
 */
export function compressor(file, options = {}) {
    return lAboxTool.compressor(file, options);
}
/**
 * --- 获取 class 的所有 method 和 get/set ---
 * @param obj 实例化 class 对象
 * @param over 不传入此参数
 * @param level 不传入此参数
 */
export function getClassPrototype(obj, over = [], level = 0) {
    return lAboxTool.getClassPrototype(obj, over, level);
}
/**
 * --- 将 blob 对象转换为 ArrayBuffer ---
 * @param blob 对象
 */
export function blob2ArrayBuffer(blob) {
    return lAboxTool.blob2ArrayBuffer(blob);
}
/**
 * --- 将文件大小格式化为带单位的字符串 ---
 * @param size 文件大小
 * @param spliter 分隔符
 */
export function sizeFormat(size, spliter = ' ') {
    return lAboxTool.sizeFormat(size, spliter);
}
/**
 * --- 将毫克重量格式化为带单位的字符串 ---
 * @param weight 毫克重量
 * @param spliter 分隔符
 */
export function weightFormat(weight, spliter = ' ') {
    return lAboxTool.weightFormat(weight, spliter);
}
/**
 * --- 完整的克隆一份数组/对象 ---
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function clone(obj) {
    return lAboxTool.clone(obj);
}
/**
 * --- 等待毫秒 ---
 * @param ms 等待的毫秒，默认 0，最大 30 秒
 */
export function sleep(ms = 0) {
    return lAboxTool.sleep(ms);
}
/**
 * --- 等待浏览器帧 ---
 */
export function nextFrame() {
    return lAboxTool.nextFrame();
}
/**
 * --- 等待浏览器帧 ---
 * @param count 等待帧数最高 10 帧
 */
export function sleepFrame(count) {
    return lAboxTool.sleepFrame(count);
}
/**
 * --- 去除 html 的空白符、换行以及注释 ---
 * @param text 要纯净的字符串
 */
export function purify(text) {
    return lAboxTool.purify(text);
}
/**
 * --- 传入正则进行匹配 str 是否有一项满足 ---
 * @param str 要检测的字符串
 * @param regs 正则列表
 */
export function match(str, regs) {
    return lAboxTool.match(str, regs);
}
/**
 * --- 将 style 中的 url 转换成 base64 data url ---
 * @param path 路径基准或以文件的路径为基准，以 / 结尾
 * @param style 样式表
 * @param files 在此文件列表或读取器中查找
 */
export function styleUrl2DataUrl(path, style, files) {
    return lAboxTool.styleUrl2DataUrl(path, style, files);
}
/**
 * --- 给标签增加 tag-tagname 的 class，同时给标签增加 cg- 前导（仅字符串，不是操作真实 dom） ---
 * @param layout layout
 * @param retagname 是否更改 tagname 为 cg-tagname
 */
export function layoutAddTagClassAndReTagName(layout, retagname) {
    return lAboxTool.layoutAddTagClassAndReTagName(layout, retagname);
}
/**
 * --- 给标签追加 attr，即使 attr 存在也会追加上一个新的（非真实 DOM 操作，仅仅是对字符串进行处理） ---
 * @param layout 被追加
 * @param insert 要追加
 * @param opt 选项, ignore 忽略的标签，include 包含的标签
 */
export function layoutInsertAttr(layout, insert, opt = {}) {
    return lAboxTool.layoutInsertAttr(layout, insert, opt);
}
/**
 * --- 给 class 增加 scope 的随机前缀，给 id 新增前缀 ---
 * @param layout layout
 * @param preps 前置标识符列表，特殊字符串 scope 会被替换为随机前缀
 */
export function layoutClassPrepend(layout, preps) {
    return lAboxTool.layoutClassPrepend(layout, preps);
}
/**
 * --- 对 layout 的 events 事件进行包裹 ---
 * @param layout 要包裹的 layout
 */
export function eventsAttrWrap(layout) {
    return lAboxTool.eventsAttrWrap(layout);
}
/**
 * --- 对 layout 的 teleport 做转义处理为 vue 识别的内容 ---
 * @param layout 要处理的窗体或控件的 layout
 * @param formId 要加入的 formId
 */
export function teleportGlue(layout, formId) {
    return lAboxTool.teleportGlue(layout, formId);
}
/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param style 样式内容
 * @param prep 给 class、font 等增加前置
 */
export function stylePrepend(style, prep = '') {
    return lAboxTool.stylePrepend(style, prep);
}
/**
 * --- 根据后缀、文件名或路径获取 mime 类型（简单版，完整版请使用 @litert/mime.js） ---
 * @param path 后缀、文件名或路径
 */
export function getMimeByPath(path) {
    return lAboxTool.getMimeByPath(path);
}
/**
 * --- 生成范围内的随机数 ---
 * @param min >= 最小值
 * @param max <= 最大值
 * @param prec 保留几位小数
 */
export function rand(min, max, prec = 0) {
    return lAboxTool.rand(min, max, prec);
}
export const RANDOM_N = '0123456789';
export const RANDOM_U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const RANDOM_L = 'abcdefghijklmnopqrstuvwxyz';
export const RANDOM_UN = RANDOM_U + RANDOM_N;
export const RANDOM_LN = RANDOM_L + RANDOM_N;
export const RANDOM_LU = RANDOM_L + RANDOM_U;
export const RANDOM_LUN = RANDOM_L + RANDOM_U + RANDOM_N;
export const RANDOM_V = 'ACEFGHJKLMNPRSTWXY34567';
export const RANDOM_LUNS = RANDOM_LUN + '()`~!@#$%^&*-+=_|{}[]:;\'<>,.?/]"';
/**
 * --- 生成随机字符串 ---
 * @param length 长度
 * @param source 字符源
 * @param block 剔除字符
 * @returns 随机字符串
 */
export function random(length = 8, source = RANDOM_LN, block = '') {
    return lAboxTool.random(length, source, block);
}
/**
 * --- 根据参数获取最终的布尔值 ---
 * @param param 参数
 */
export function getBoolean(param) {
    return lAboxTool.getBoolean(param);
}
/**
 * --- 根据参数获取最终的数字型 ---
 * @param param 参数
 */
export function getNumber(param) {
    return lAboxTool.getNumber(param);
}
/**
 * --- 根据参数获取最终的数组型，可传入类似 [1,2,3] 或 1,2,3 ---
 * @param param 参数
 */
export function getArray(param) {
    return lAboxTool.getArray(param);
}
/**
 * --- 转义 HTML ---
 * @param html HTML 字符
 */
export function escapeHTML(html) {
    return lAboxTool.escapeHTML(html);
}
/**
 * --- 还原转义后的 HTML ---
 * @param html 已转义的 HTML 字符
 */
export function unescapeHTML(html) {
    return lAboxTool.unescapeHTML(html);
}
/**
 * --- 将 rgb 或 hsl 等颜色转换为数字数组 ---
 * @param color 颜色字符串
 */
export function formatColor(color) {
    return lAboxTool.formatColor(color);
}
/**
 * --- 将 r, g, b 转换为 hex 字符串，不含 # ---
 * @param r r 或 rgb 用 , 分隔的字符串
 * @param g 可留空，g
 * @param b 可留空，b
 */
export function rgb2hex(r, g, b, a = 1) {
    return lAboxTool.rgb2hex(r, g, b, a);
}
/**
 * --- hex 转换为 rgba，#27ae60ff, 27ae60 #fff
 * @param hex hex 字符串，无所谓带不带 #
 */
export function hex2rgb(hex) {
    return lAboxTool.hex2rgb(hex);
}
/**
 * --- rgb 字符串转 hsl 数组 ---
 * @param r r 值或 rgb(x, x, x) 或直接 x,x,x
 * @param g g 值
 * @param b b 值
 * @param a a 值
 * @param decimal 是否保留小数
 */
export function rgb2hsl(r, g, b, a = 1, decimal = false) {
    return lAboxTool.rgb2hsl(r, g, b, a, decimal);
}
/**
 * --- hsl 字符串转 rgb 数组 ---
 * @param h h 值或 hsl(x, x, x) 或直接 x,x,x
 * @param s s 值
 * @param l l 值
 * @param a a 值
 * @param decimal 是否保留小数
 */
export function hsl2rgb(h, s, l, a = 1, decimal = false) {
    return lAboxTool.hsl2rgb(h, s, l, a, decimal);
}
/**
 * --- 发起一个网络请求，若是返回值是 JSON 则自动解析，否则直接返回字符串 ---
 * @param url 网址
 * @param opt 选项
 */
export function request(url, opt) {
    return lAboxTool.request(url, opt);
}
/**
 * --- 发起 fetch 请求 ---
 * @param url 网址
 * @param init 选项
 * @returns 文本或二进制数据，失败时返回 null
 */
export function fetch(url, init) {
    return lAboxTool.fetch(url, init);
}
/**
 * --- 发起 GET 请求 ---
 * @param url 网址
 * @param init 选项
 * @param opt 选项
 * @returns 文本或二进制数据，失败时返回 null
 */
export function get(url, init, opt = {}) {
    return lAboxTool.get(url, init, opt);
}
/**
 * --- 发起 POST 请求（除 FormData 外都会转换为 JSON 提交） ---
 * @param url 网址
 * @param data 数据
 * @param init 选项
 * @returns 文本或二进制数据，失败时返回 null
 */
export function post(url, data, init) {
    return lAboxTool.post(url, data, init);
}
/**
 * --- 发起 GET 请求并解析 JSON 响应 ---
 * @param url 网址
 * @param init 选项
 * @returns JSON 数据，失败时返回 null
 */
export function getResponseJson(url, init) {
    return lAboxTool.getResponseJson(url, init);
}
/**
 * --- 发起 JSON 请求并获得文本 SSE 响应 ---
 * @param url 网址
 * @param data 数据
 * @param opts 选项
 * @returns 返回可随时中止的控制器
 */
export function postResponseEventStream(url, data, opts = {}) {
    return lAboxTool.postResponseEventStream(url, data, opts);
}
/**
 * --- 发起 POST 请求并解析 JSON 响应 ---
 * @param url 网址
 * @param data 数据
 * @param init 选项
 * @returns JSON 数据，失败时返回 null
 */
export function postResponseJson(url, data, init) {
    return lAboxTool.postResponseJson(url, data, init);
}
/**
 * --- 传输 url 并解析为 IUrl 对象 ---
 * @param url url 字符串
 */
export function parseUrl(url) {
    return lAboxTool.parseUrl(url);
}
/**
 * --- 将相对路径根据基准路径进行转换 ---
 * @param from 基准路径
 * @param to 相对路径
 */
export function urlResolve(from, to) {
    return lAboxTool.urlResolve(from, to);
}
/** --- 处理 URL 中的 .. / . 等 --- */
export function urlAtom(url) {
    return lAboxTool.urlAtom(url);
}
/**
 * --- 将 blob 对象转换为 text ---
 * @param blob 对象
 */
export function blob2Text(blob) {
    return lAboxTool.blob2Text(blob);
}
/**
 * --- 将 blob 对象转换为 base64 url ---
 * @param blob 对象
 * @returns base64 URL
 */
export function blob2DataUrl(blob) {
    return lAboxTool.blob2DataUrl(blob);
}
export function execCommand(ac) {
    lAboxTool.execCommand(ac);
}
/**
 * ---- 对比老值和新值，看看新值中哪些移除了，哪些新增了 ---
 * @param before 老值
 * @param after 新值
 */
export function compar(before, after) {
    return lAboxTool.compar(before, after);
}
/** --- 将秒数格式化为 0:0:0 的字符串 --- */
export function formatSecond(second) {
    return lAboxTool.formatSecond(second);
}
/**
 * --- 将日期对象或毫秒级时间戳转换为字符串 ---
 * @param ts 时间戳或日期对象
 * @param tz 传入要显示的时区，小时，如 8，默认以当前客户端时区为准
 */
export function formatTime(ts, tz) {
    return lAboxTool.formatTime(ts, tz);
}
/**
 * --- 是否是毫秒 ---
 * @param time 要判断的时间戳
 */
export function isMs(time) {
    return lAboxTool.isMs(time);
}
/**
 * --- 将对象转换为 query string ---
 * @param query 要转换的对象
 * @param encode 是否转义
 */
export function queryStringify(query, encode = true) {
    return lAboxTool.queryStringify(query, encode);
}
/**
 * --- 将 query string 转换为对象 ---
 * @param query 要转换的字符串
 */
export function queryParse(query) {
    return lAboxTool.queryParse(query);
}
/**
 * --- 转义字符检查 ---
 * 检查指定位置的字符是否被转义
 * @param str 字符串
 * @param pos 检查位置
 * @returns 是否被转义
 */
export function isEscaped(str, pos) {
    return lAboxTool.isEscaped(str, pos);
}
/**
 * --- 数组字符串解析器 ---
 * 解析数组字符串为各元素组成的字符串数组
 * @param arrayStr 数组字符串
 * @returns 解析后的字符串数组
 */
export function parseArrayString(arrayStr) {
    return lAboxTool.parseArrayString(arrayStr);
}
/**
 * --- 判断字符是否是转义字符 ---
 * @param code 字符串
 * @param index 字符在字符串中的位置
 * @returns 是否是转义字符
 */
export function isEscapeChar(code, index) {
    return lAboxTool.isEscapeChar(code, index);
}
/** --- 状态机状态 --- */
export var ESTATE;
(function (ESTATE) {
    /** --- 普通 --- */
    ESTATE[ESTATE["NORMAL"] = 0] = "NORMAL";
    /** --- 单词 --- */
    ESTATE[ESTATE["WORD"] = 1] = "WORD";
    /** --- 字符串 --- */
    ESTATE[ESTATE["STRING"] = 2] = "STRING";
    /** --- 正则 --- */
    ESTATE[ESTATE["REG"] = 3] = "REG";
    /** --- 注释 --- */
    ESTATE[ESTATE["COMMENT"] = 4] = "COMMENT";
})(ESTATE || (ESTATE = {}));
/**
 * --- 源码分段状态机，单词按 ASCII 字母、数字、_ 和 $ 识别 ---
 * @param code 待扫描源码，CRLF 和 CR 统一为 LF
 * @param start 归一化后的起始 UTF-16 索引
 * @param process 片段回调，true 继续、false 停止；位置含首尾，bracket 是共享计数对象
 * @returns 无返回值
 */
export function stateMachine(code, start, process) {
    lAboxTool.stateMachine(code, start, process, ESTATE);
}
/**
 * --- 加载脚本 ---
 * @param url 脚本网址
 * @param ordered 是否按插入顺序执行，下载仍并行，默认 false
 * @returns 加载是否成功
 */
export function loadScript(url, ordered = false) {
    return lAboxTool.loadScript(url, ordered);
}
/**
 * --- 批量加载 js 文件 ---
 * @param urls js 文件列表
 * @param opt 选项
 */
export function loadScripts(urls, opt = {}) {
    return lAboxTool.loadScripts(urls, opt);
}
/**
 * --- 加载 css 文件 ---
 * @param url css 文件网址
 * @returns 加载是否成功
 */
export function loadLink(url, pos = 'after') {
    return lAboxTool.loadLink(url, pos);
}
/**
 * --- 批量加载 css 文件 ---
 * @param urls css 文件列表
 * @param opt 选项
 */
export function loadLinks(urls, opt = {}) {
    return lAboxTool.loadLinks(urls, opt);
}
/**
 * --- 批量并行加载 JS 和 CSS；JS 按列表顺序执行，CSS 按列表顺序插入 ---
 * @param urls 资源网址，忽略查询参数和哈希后以 .css 结尾的按 CSS 加载，其余按 JS 加载
 * @param opt loaded 为单个资源加载完成回调，state 为 1-成功、0-失败
 * @returns 全部资源成功返回 true，任一资源失败返回 false；空列表返回 true
 */
export function loadAssets(urls, opt = {}) {
    return lAboxTool.loadAssets(urls, opt);
}
/**
 * --- 加载 css 字符串 ---
 * @param style css 字符串
 */
export function loadStyle(style) {
    lAboxTool.loadStyle(style);
}
/**
 * --- 判断 JS 值是否符合 JSON 数据约束；字符串按数据值接受，不解析其内容 ---
 * @param value 待检查值；仅接受 null、布尔值、有限数、字符串、连续且无额外属性的数组和普通对象
 * @returns 符合约束返回 true；循环、访问器、Symbol/非枚举属性或深度超过 64（根为 0）返回 false
 */
export function isJson(value) {
    return lAboxTool.isJson(value);
}
/**
 * --- 判断一个值是否是虚假的（为 null/undefined/空字符串/false/0） ---
 * @param val 要判断的值
 */
export function isFalsy(val) {
    return lAboxTool.isFalsy(val);
}
/**
 * --- 判断一个值是否是真实的（不为 null/undefined/空字符串/false/0） ---
 * @param val 要判断的值
 */
export function isTruthy(val) {
    return lAboxTool.isTruthy(val);
}
/**
 * --- 类似 || 运算符的效果 ---
 * @param v1 比对值
 * @param v2 比对值
 */
export function logicalOr(v1, v2) {
    return lAboxTool.logicalOr(v1, v2);
}
/** --- 语言相关 --- */
export const lang = {
    'codes': [
        'sc', 'tc', 'ja', 'ko', 'th', 'vi', 'ar', 'id',
        'en', 'es', 'de', 'fr', 'pt', 'ru', 'it', 'tr',
    ],
    'names': [
        '简体中文', '繁體中文', '日本語', '한국어', 'ไทย', 'Tiếng việt', 'العربية', 'Bahasa Indonesia',
        'English', 'Español', 'Deutsch', 'Français', 'Português', 'Русский', 'Italiano', 'Türkçe',
    ],
    'map': {
        'cn': 'sc',
        'zh': 'tc',
        'ja': 'ja',
        'ko': 'ko',
        'th': 'th',
        'vi': 'vi',
        'ar': 'ar',
        'id': 'id',
        'en': 'en',
        'es': 'es',
        'de': 'de',
        'fr': 'fr',
        'pt': 'pt',
        'ru': 'ru',
        'it': 'it',
        'tr': 'tr',
    },
    'tags': {
        'sc': 'zh-CN',
        'tc': 'zh-TW',
        'ja': 'ja',
        'ko': 'ko',
        'th': 'th',
        'vi': 'vi',
        'ar': 'ar',
        'id': 'id',
        'en': 'en',
        'es': 'es',
        'de': 'de',
        'fr': 'fr',
        'pt': 'pt',
        'ru': 'ru',
        'it': 'it',
        'tr': 'tr',
    },
    getCodeByAccept: (accept) => {
        accept ??= navigator.language;
        if (accept === '*') {
            return 'sc';
        }
        const ulang = accept.toLowerCase();
        for (const l in lang.map) {
            if (!ulang.includes(l)) {
                continue;
            }
            return lang.map[l];
        }
        return 'en';
    },
    getTag: (locale) => {
        if (lang.tags[locale]) {
            return lang.tags[locale];
        }
        return lang.tags[lang.getCodeByAccept(locale)] ?? (locale || 'en');
    },
    getDirection: (locale) => {
        if (/^ar(?:[-_]|$)/i.test(locale)) {
            return 'rtl';
        }
        return 'ltr';
    },
};
