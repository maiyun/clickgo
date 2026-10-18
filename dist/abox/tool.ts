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
import type { IClassPrototype, IUrl, IRequestOptions, TFalsy, TJson, ESTATE } from '../lib/tool.js';

let compressorjs: typeof import('compressorjs').default | null = null;

export function isJson(value: unknown, seen?: Set<object>, depth = 0): value is TJson {
    if (depth > 64) {
        return false;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value !== 'object' || seen?.has(value)) {
        return false;
    }
    const keys = Reflect.ownKeys(value);
    for (const key of keys) {
        if (typeof key === 'symbol') {
            return false;
        }
    }
    const array = Array.isArray(value);
    if (!array && Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value) as object | null;
    if (!array && prototype && Object.getPrototypeOf(prototype) !== null) {
        return false;
    }
    const length = array ? value.length : keys.length;
    if (array && keys.length !== length + 1) {
        return false;
    }
    seen ??= new Set<object>();
    seen.add(value);
    for (let index = 0; index < length; ++index) {
        const property = Object.getOwnPropertyDescriptor(value, array ? index : keys[index]);
        if (!property?.enumerable || !Object.hasOwn(property, 'value') ||
            !isJson(property.value, seen, depth + 1)) {
            seen.delete(value);
            return false;
        }
    }
    seen.delete(value);
    return true;
}

export function runIife(code: string): any {
    const func = new Function(code + '\nreturn emodule;');
    return func();
}

export async function compressor<T extends File | Blob>(file: T, options: {
    'maxWidth'?: number;
    'maxHeight'?: number;
    'quality'?: number;
} = {}): Promise<T | false> {
    if (!compressorjs) {
        try {
            const cdn = (window as any).clickgo.config?.cdn ?? 'https://cdn.jsdelivr.net';
            await loadScript(cdn + '/npm/compressorjs@1.2.1/dist/compressor.min.js');
            if (!(window as any).Compressor) {
                throw Error('Compressor load failed.');
            }
            compressorjs = (window as any).Compressor;
        }
        catch {
            return false;
        }
    }
    return new Promise(resolve => {
        if (!compressorjs) {
            resolve(false);
            return;
        }
        new compressorjs(file, {
            'quality': options.quality,
            'maxWidth': options.maxWidth,
            'maxHeight': options.maxHeight,
            success: (result: File) => {
                if ((file instanceof File) && !(result instanceof File)) {
                    resolve(new File([result], file.name, {
                        'lastModified': file.lastModified,
                        'type': file.type,
                    }) as T);
                    return;
                }
                resolve(result as T);
            },
            error: () => {
                resolve(false);
            },
        });
    });
}

export function getClassPrototype(obj: object, over: string[] = [], level: number = 0): IClassPrototype {
    if (level === 0) {
        obj = Object.getPrototypeOf(obj);
    }
    const rtn: IClassPrototype = {
        'method': {},
        'access': {},
    };
    const visited = new Set(over);
    let own = true;
    while (true) {
        const names = Object.getOwnPropertyNames(obj);
        if (names.includes('toString')) {
            return rtn;
        }
        for (const item of names) {
            if (item === 'constructor' || visited.has(item)) {
                continue;
            }
            const des = Object.getOwnPropertyDescriptor(obj, item);
            if (!des) {
                continue;
            }
            visited.add(item);
            over.push(item);
            if (des.value) {
                if (own || item !== '__proto__') {
                    rtn.method[item] = des.value;
                }
            }
            else if ((des.get ?? des.set) && !rtn.access[item]) {
                rtn.access[item] = {
                    'get': des.get ?? (() => { }),
                    'set': des.set ?? (() => { }),
                };
            }
        }
        obj = Object.getPrototypeOf(obj);
        own = false;
    }
}

export function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise(function (resove) {
        const fr = new FileReader();
        fr.addEventListener('load', function () {
            resove(fr.result as ArrayBuffer);
        });
        fr.readAsArrayBuffer(blob);
    });
}

export function sizeFormat(size: number, spliter: string = ' '): string {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    while (i < units.length - 1 && size >= 1024.0) {
        size /= 1024.0;
        i++;
    }
    return (Math.round(size * 100) / 100).toString() + spliter + units[i];
}

export function weightFormat(weight: number, spliter: string = ' '): string {
    const units = ['mg', 'g', 'kg'];
    let i = 0;
    for (; i < 3 && weight >= 1000; ++i) {
        weight /= 1000;
    }
    return (Math.round(weight * 100) / 100).toString() + spliter + units[i];
}

function cloneValue<T>(value: T, cache: WeakMap<object, unknown>): T {
    if ((value === null) || (typeof value !== 'object')) {
        return value;
    }
    const cached = cache.get(value);
    if (cached !== undefined) {
        return cached as T;
    }
    if (value instanceof Date) {
        const date = new Date(value.getTime());
        cache.set(value, date);
        return date as T;
    }
    if (value instanceof FormData) {
        const formData = new FormData();
        cache.set(value, formData);
        for (const item of value) {
            formData.append(item[0], item[1]);
        }
        return formData as T;
    }
    if (value instanceof Map) {
        const map = new Map<unknown, unknown>();
        cache.set(value, map);
        for (const item of value) {
            map.set(cloneValue(item[0], cache), cloneValue(item[1], cache));
        }
        return map as T;
    }
    if (value instanceof Set) {
        const set = new Set<unknown>();
        cache.set(value, set);
        for (const item of value) {
            set.add(cloneValue(item, cache));
        }
        return set as T;
    }
    if (Array.isArray(value)) {
        const array: unknown[] = [];
        cache.set(value, array);
        for (let i = 0; i < value.length; ++i) {
            array[i] = cloneValue(value[i], cache);
        }
        return array as T;
    }
    const object: Record<string, unknown> = {};
    cache.set(value, object);
    for (const key in value) {
        object[key] = cloneValue(value[key], cache);
    }
    return object as T;
}

export function clone<T>(obj: T): T {
    return cloneValue(obj, new WeakMap());
}

export function sleep(ms: number = 0): Promise<boolean> {
    return new Promise(function (resolve) {
        if (ms > 30000) {
            resolve(false);
            return;
        }
        window.setTimeout(function () {
            resolve(true);
        }, ms);
    });
}

export function nextFrame(): Promise<void> {
    return new Promise(function (resolve) {
        requestAnimationFrame(() => {
            resolve();
        });
    });
}

export async function sleepFrame(count: number): Promise<void> {
    if (count > 10) {
        count = 10;
    }
    for (let i = 0; i < count; ++i) {
        await nextFrame();
    }
}

export function purify(text: string): string {
    text = '>' + text + '<';
    const scripts: string[] = [];
    let num: number = -1;
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/<script[\s\S]+?<\/script>/g, function (t: string): string {
        scripts.push(t);
        return '[SCRIPT]';
    }).replace(/>([\s\S]*?)</g, function (t: string, t1: string): string {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    }).replace(/\[SCRIPT\]/g, function (): string {
        ++num;
        return scripts[num];
    });
    return text.slice(1, -1);
}

export function match(str: string, regs: RegExp[]): boolean {
    for (const reg of regs) {
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}

export async function styleUrl2DataUrl(path: string, style: string, files: Record<string, Blob | string> | ((path: string) => Promise<Blob | string | null>)): Promise<string> {
    const reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
    let match: RegExpExecArray | null = null;
    while ((match = reg.exec(style))) {
        let realPath = urlResolve(path, match[1]);
        if (realPath.startsWith('/package/')) {
            realPath = realPath.slice(8);
        }
        const file = typeof files === 'function' ? await files(realPath) : files[realPath];
        if (!file) {
            continue;
        }
        if (typeof file !== 'string') {
            style = style.replace(match[0], `url('${await blob2DataUrl(file)}')`);
        }
    }
    return style;
}

export function layoutAddTagClassAndReTagName(layout: string, retagname: boolean): string {
    const list: string[] = [];
    layout = layout.replace(/([^\s<>]+)=(".+?"|'.+?')/g, function (t, t1): string {
        if (t1 === 'class') {
            return t;
        }
        list.push(t);
        return '"CG-PLACEHOLDER"';
    });
    layout = layout.replace(/<(\/{0,1})([\w-]+)([\s\S]*?>)/g, function (t, t1, t2: string, t3: string): string {
        if (['template', 'slot', 'teleport', 'canvas'].includes(t2)) {
            return t;
        }
        else {
            if (t1 === '/') {
                if (t2 === 'block') {
                    return '</div' + t3;
                }
                else {
                    return retagname ? ('</cg-' + t2 + t3) : t;
                }
            }
            if (/\sclass\s*=/.test(t3.toLowerCase())) {
                t3 = t3.replace(/\sclass\s*=(["']{0,1})/i, function (t, t1: string): string {
                    return `${t.slice(0, t.indexOf('class'))}class=${t1}tag-${t2} `;
                });
            }
            else {
                t3 = ` class="tag-${t2}"` + t3;
            }
            if (t2 === 'block') {
                return '<div' + t3;
            }
            else {
                return retagname ? ('<cg-' + t2 + t3) : ('<' + t2 + t3);
            }
        }
    });
    let i = -1;
    return layout.replace(/"CG-PLACEHOLDER"/g, function () {
        return list[++i];
    });
}

export function layoutInsertAttr(layout: string, insert: string, opt: {
    'ignore'?: RegExp[];
    'include'?: RegExp[];
} = {}): string {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function (t, t1): string {
        if (opt.ignore) {
            for (const item of opt.ignore) {
                if (item.test(t1)) {
                    return t;
                }
            }
        }
        if (opt.include) {
            let found = false;
            for (const item of opt.include) {
                if (item.test(t1)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return t;
            }
        }
        return t.replace(/<[\w-]+/, function (t) {
            return t + ' ' + insert;
        });
    });
}

function layoutClassPrependObject(object: string): string {
    object = object.slice(1, -1).trim();
    return `{${object.replace(/([ a-zA-Z0-9'"`[\]\-_]+)(\s*:)/g, (t, t1: string, t2: string) => {
        t1 = t1.trim();
        if (t1.startsWith('[')) {
            t1 = `[classPrepend(${t1.slice(1, -1)})]`;
        }
        else {
            let sp = '';
            if (t1.startsWith('\'') || t1.startsWith('"') || t1.startsWith('`')) {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            else {
                sp = '\'';
            }
            t1 = `[classPrepend(${sp}${t1}${sp})]`;
        }
        return `${t1}${t2}`;
    })}}`;
}

export function layoutClassPrepend(layout: string, preps: string[]): string {
    const rtn = layout.replace(/(\s)class=["'](.*?)["']/gi, function (t, t0: string, t1: string) {
        t1 = t1.trim();
        const classList = t1.split(/\s+/);
        const resultList: string[] = [];
        for (const item of classList) {
            if (!item) {
                continue;
            }
            for (const prep of preps) {
                if (item.startsWith('fa-')) {
                    resultList.push(`${item}`);
                }
                else {
                    resultList.push(`${prep}${item}`);
                }
            }
        }
        return `${t0}class="${resultList.join(' ')}"`;
    }).replace(/\s:class=(["']).*?["']((\s+[a-zA-Z0-9-_:@]+(=|\s*>))|(\s*)>)/gi, function (t, sp) {
        return t.replace(new RegExp(`:class=${sp}([^${sp}]+?)${sp}`, 'gi'), function (t, t1: string) {
            t1 = t1.trim();
            if (t1.startsWith('[')) {
                const t1a = parseArrayString(t1);
                for (let i = 0; i < t1a.length; ++i) {
                    t1a[i] = t1a[i].trim();
                    if (t1a[i].startsWith('{')) {
                        t1a[i] = layoutClassPrependObject(t1a[i]);
                    }
                    else {
                        t1a[i] = `classPrepend(${t1a[i]})`;
                    }
                }
                t1 = `[${t1a.join(',')}]`;
            }
            else if (t1.startsWith('{')) {
                t1 = layoutClassPrependObject(t1);
            }
            else {
                t1 = `classPrepend(${t1})`;
            }
            return `:class="${t1}"`;
        });
    }).replace(/(\s)id=(["'])/gi, `$1id=$2${preps[0]}`);
    return rtn;
}

export function eventsAttrWrap(layout: string): string {
    const events = ['click', 'dblclick', 'pointerdown', 'pointerenter', 'pointerleave', 'pointerup', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keypress', 'keyup', 'contextmenu'];
    const reg = new RegExp(`@(${events.join('|')})="(.+?)"`, 'g');
    return layout.replace(reg, function (t, t1, t2): string {
        if (/^[\w]+$/.test(t2)) {
            return `@${t1}="allowEvent($event) && ${t2}($event)"`;
        }
        return `@${t1}=";if(allowEvent($event)){${t2}}"`;
    });
}

export function teleportGlue(layout: string, formId: string): string {
    return layout.replace(/<teleport([\s\S]+?)to="(.+?)"([\s\S]+?<[\w-]+)/g, (v, v1, v2, v3): string => {
        if (v2 !== 'system') {
            return v;
        }
        return '<teleport' + v1 + 'to="#cg-pop-list > [data-form-id=\'' + formId + '\']"' + v3 + ' data-cg-pop data-cg-pop-none';
    });
}

export function stylePrepend(style: string, prep: string = ''): {
    'style': string;
    'prep': string;
} {
    if (prep === '') {
        prep = 'cg-scope' + Math.round(Math.random() * 1000000000000000).toString() + '_';
    }
    style = style.replace(/([^{}]+){([^{}]*)}/g, function (t, t1: string, t2: string) {
        if (/^(?:from|to|\d+(?:\.\d+)?%)(?:\s*,\s*(?:from|to|\d+(?:\.\d+)?%))*$/i.test(t1.trim())) {
            return t;
        }
        t1 = t1.replace(/(^|[ >,}\r\n])([a-zA-Z-_][a-zA-Z0-9-_]*)/g, function (t: string, t1: string, t2: string) {
            if (t2 === 'global') {
                return '[CGTMP-GLOBAL]';
            }
            return t1 + '.tag-' + t2;
        });
        t1 = t1.replace(/keyframes \.tag-([a-zA-Z0-9-_]+)/g, function (t: string, t1: string) {
            return 'keyframes ' + t1;
        });
        t1 = t1.replace(/([.#])([a-zA-Z0-9-_]+)/g, function (t: string, t1: string, t2: string) {
            return t1 + prep + t2;
        }) + '{' + t2 + '}';
        return t1;
    });
    const fontList: string[] = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function (t, t1: string, t2: string, t3: string) {
        fontList.push(t2);
        return t1 + prep + t2 + t3;
    });
    for (const font of fontList) {
        const reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function (t, t1: string, t2: string) {
            return t1 + prep + t2;
        });
    }
    const keyframeList: string[] = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function (t, t1: string, t2: string, t3: string) {
        if (!keyframeList.includes(t2)) {
            keyframeList.push(t2);
        }
        return t1 + prep + t2 + t3;
    });
    for (const keyframe of keyframeList) {
        let reg = new RegExp(`(animation[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function (t, t1: string, t2: string, t3: string) {
            return t1 + prep + t2 + t3;
        });
        reg = new RegExp(`(animation-name[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function (t, t1: string, t2: string, t3: string) {
            return t1 + prep + t2 + t3;
        });
    }
    return {
        'prep': prep,
        'style': style
    };
}

export function getMimeByPath(path: string): {
    'mime': string;
    'ext': string;
} {
    const lio = path.lastIndexOf('.');
    const ext: string = (lio === -1 ? path : path.slice(lio + 1)).toLowerCase();
    const exts: Record<string, string> = {
        'eot': 'application/vnd.ms-fontobject',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'svg': 'image/svg+xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    };
    const mime: string = exts[ext] ?? 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
}

export function rand(min: number, max: number, prec: number = 0): number {
    if (prec < 0) {
        prec = 0;
    }
    if (prec === 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const p = Math.pow(10, prec);
    return Math.round((Math.random() * (max - min) + min) * p) / p;
}

export function random(length: number = 8, source: string, block: string = ''): string {
    let len = block.length;
    if (len > 0) {
        for (let i = 0; i < len; ++i) {
            source = source.replace(block[i], '');
        }
    }
    len = source.length;
    if (len === 0) {
        return '';
    }
    let temp = '';
    for (let i = 0; i < length; ++i) {
        temp += source[rand(0, len - 1)];
    }
    return temp;
}

export function getBoolean(param: boolean | string | number | undefined): boolean {
    const t = typeof param;
    if (t === 'boolean') {
        return param as boolean;
    }
    if (t === 'string') {
        return param === 'false' ? false : true;
    }
    return param ? true : false;
}

export function getNumber(param: string | number): number {
    if (typeof param === 'number') {
        return param;
    }
    return parseFloat(param);
}

export function getArray(param: string | any[]): any[] {
    if (typeof param !== 'string') {
        return param;
    }
    param = param.trim();
    let rtn: any[] = [];
    if (param.startsWith('[')) {
        try {
            rtn = JSON.parse(param);
        }
        catch {
            return [];
        }
    }
    else {
        param = param.replace(/ /g, '');
        rtn = param.split(',');
    }
    return rtn;
}

export function escapeHTML(html: string): string {
    return html.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&#34;')
        .replace(/'/g, '&#39;');
}

export function unescapeHTML(html: string): string {
    return html.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#34;/g, '"')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&apos;/g, '\'');
}

export function formatColor(color: string): number[] {
    const matc = /[0-9.%, ]+/.exec(color);
    if (!matc) {
        return [];
    }
    const arr = matc[0].split(',');
    return arr.map((v: string) => {
        return parseFloat(v);
    });
}

export function rgb2hex(r: string | number, g?: string | number, b?: string | number, a: string | number = 1): string {
    if (g === undefined || b === undefined) {
        if (typeof r !== 'string') {
            return '';
        }
        const rgb = formatColor(r);
        r = Math.round(rgb[0]);
        g = Math.round(rgb[1]);
        b = Math.round(rgb[2]);
        a = rgb[3] ?? 1;
    }
    else {
        if (typeof r === 'string') {
            r = Math.round(parseFloat(r));
        }
        if (typeof g === 'string') {
            g = Math.round(parseFloat(g));
        }
        if (typeof b === 'string') {
            b = Math.round(parseFloat(b));
        }
        if (typeof a === 'string') {
            a = parseFloat(a);
        }
    }
    return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0') + (a === 1 ? '' : Math.round(a * 255).toString(16).padStart(2, '0'));
}

export function hex2rgb(hex: string): {
    'r': number;
    'g': number;
    'b': number;
    'a': number;
    'rgb': string;
} {
    const rgb = {
        'r': 0,
        'g': 0,
        'b': 0,
        'a': 1,
        'rgb': 'rgb'
    };
    let alpha = false, h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) {
        h = [...h].map(x => x + x).join('');
    }
    else if (h.length === 8) {
        alpha = true;
    }
    const hn = parseInt(h, 16);
    rgb.r = (hn >>> (alpha ? 24 : 16));
    rgb.g = (hn & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8);
    rgb.b = (hn & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0);
    if (alpha) {
        rgb.a = Math.round((hn & 0x000000ff) / 255 * 100) / 1000;
    }
    rgb.rgb = `${alpha ? 'a' : ''}(${rgb.r},${rgb.g},${rgb.b}${alpha ? ',' + rgb.a : ''})`;
    return rgb;
}

export function rgb2hsl(r: string | number, g?: string | number, b?: string | number, a: string | number = 1, decimal: boolean = false): {
    'h': number;
    's': number;
    'l': number;
    'a': number;
    'hsl': string;
} {
    const hsl = {
        'h': 0,
        's': 0,
        'l': 0,
        'a': 1,
        'hsl': 'hsl'
    };
    if (g === undefined || b === undefined) {
        if (typeof r !== 'string') {
            return hsl;
        }
        const rgb = formatColor(r);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        a = rgb[3] ?? 1;
    }
    else {
        if (typeof r === 'string') {
            r = parseFloat(r);
        }
        if (typeof g === 'string') {
            g = parseFloat(g);
        }
        if (typeof b === 'string') {
            b = parseFloat(b);
        }
        if (typeof a === 'string') {
            a = parseFloat(a);
        }
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta == 0) {
        h = 0;
    }
    else if (cmax == r) {
        h = ((g - b) / delta) % 6;
    }
    else if (cmax == g) {
        h = (b - r) / delta + 2;
    }
    else {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = s * 100;
    l = l * 100;
    hsl.h = h;
    hsl.s = s;
    hsl.l = l;
    hsl.a = a;
    if (!decimal) {
        hsl.h = Math.round(hsl.h);
        hsl.s = Math.round(hsl.s);
        hsl.l = Math.round(hsl.l);
    }
    hsl.hsl += (hsl.a === 1 ? '' : 'a') + `(${hsl.h},${hsl.s}%,${hsl.l}%${hsl.a === 1 ? '' : ',' + hsl.a})`;
    return hsl;
}

export function hsl2rgb(h: string | number, s?: string | number, l?: string | number, a: string | number = 1, decimal: boolean = false): {
    'r': number;
    'g': number;
    'b': number;
    'a': number;
    'rgb': string;
} {
    const rgb = {
        'r': 0,
        'g': 0,
        'b': 0,
        'a': 1,
        'rgb': 'rgb'
    };
    if (s === undefined || l === undefined) {
        if (typeof h !== 'string') {
            return rgb;
        }
        const hsl = formatColor(h);
        h = hsl[0];
        s = hsl[1];
        l = hsl[2];
        a = hsl[3] ?? 1;
    }
    else {
        if (typeof h === 'string') {
            h = parseFloat(h);
        }
        if (typeof s === 'string') {
            s = parseFloat(s);
        }
        if (typeof l === 'string') {
            l = parseFloat(l);
        }
        if (typeof a === 'string') {
            a = parseFloat(a);
        }
    }
    s /= 100;
    l /= 100;
    const k = (n: number): number => (n + h / 30) % 12;
    const aa = s * Math.min(l, 1 - l);
    const f = (n: number): number => l - aa * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    rgb.r = 255 * f(0);
    rgb.g = 255 * f(8);
    rgb.b = 255 * f(4);
    rgb.a = a;
    if (!decimal) {
        rgb.r = Math.round(rgb.r);
        rgb.g = Math.round(rgb.g);
        rgb.b = Math.round(rgb.b);
    }
    rgb.rgb += (rgb.a === 1 ? '' : 'a') + `(${rgb.r},${rgb.g},${rgb.b}${rgb.a === 1 ? '' : ',' + rgb.a})`;
    return rgb;
}

export function request(url: string, opt: IRequestOptions): Promise<null | any> {
    return new Promise(function (resove) {
        const xhr = new XMLHttpRequest();
        if (opt.credentials === false) {
            xhr.withCredentials = false;
        }
        if (opt.uploadStart) {
            xhr.upload.onloadstart = function (e: ProgressEvent): void {
                const r = opt.uploadStart?.(e.total);
                if (r && (r instanceof Promise)) {
                    r.catch(() => { });
                }
            };
        }
        if (opt.uploadProgress) {
            xhr.upload.onprogress = function (e: ProgressEvent): void {
                const r = opt.uploadProgress?.(e.loaded, e.total);
                if (r && (r instanceof Promise)) {
                    r.catch(() => { });
                }
            };
        }
        if (opt.uploadEnd) {
            xhr.upload.onloadend = function (): void {
                const r = opt.uploadEnd?.();
                if (r && (r instanceof Promise)) {
                    r.catch(() => { });
                }
            };
        }
        xhr.onloadstart = function (e: ProgressEvent): void {
            const r = opt.start?.(e.total);
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
        };
        xhr.onprogress = function (e: ProgressEvent): void {
            const r = opt.progress?.(e.loaded, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
        };
        xhr.onloadend = function (): void {
            const r = opt.end?.();
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
        };
        xhr.onload = function (): void {
            let res = this.response;
            if (this.getResponseHeader('content-type')?.includes('json')) {
                try {
                    res = JSON.parse(res);
                }
                catch {
                    res = this.response;
                }
            }
            const r = opt.load?.(res);
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
            resove(res);
        };
        xhr.onerror = function (): void {
            const r = opt.error?.();
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
            resove(null);
        };
        if (opt.responseType) {
            xhr.responseType = opt.responseType;
        }
        if (opt.timeout) {
            xhr.timeout = opt.timeout;
        }
        if (opt.headers && !Array.isArray(opt.headers)) {
            for (const k in opt.headers) {
                xhr.setRequestHeader(k, (opt.headers as any)[k]);
            }
        }
        xhr.open(opt.method ?? 'GET', url, true);
        xhr.send(opt.body);
    });
}

export async function fetch(url: string, init?: RequestInit): Promise<string | Blob | null> {
    try {
        const res = await window.fetch(url, init);
        if (res.status === 200 || res.status === 304) {
            const ct = res.headers.get('content-type')?.toLowerCase() ?? '';
            const types = ['text/', 'javascript', 'json', 'css', 'xml', 'html'];
            return types.some(item => ct.includes(item)) ? await res.text() : await res.blob();
        }
        return null;
    }
    catch {
        return null;
    }
}

const retryTimes = [300, 1000, 2000];

export async function get(url: string, init?: RequestInit, opt: {
    'retry'?: number;
} = {}): Promise<string | Blob | null> {
    init ??= {};
    init.method = 'GET';
    const retry = opt.retry ?? 3;
    for (let i = 0; i <= retry; ++i) {
        const res = await fetch(url, init);
        if (res !== null) {
            return res;
        }
        if (i === retry) {
            return null;
        }
        await sleep(retryTimes[i]);
    }
    return null;
}

export async function post(url: string, data: Record<string, any> | FormData, init?: RequestInit): Promise<string | Blob | null> {
    init ??= {};
    init.method = 'POST';
    init.headers ??= {};
    if (!(data instanceof FormData)) {
        if (init.headers instanceof Headers) {
            init.headers.set('content-type', 'application/json');
        }
        else {
            (init.headers as Record<string, string>)['content-type'] = 'application/json';
        }
    }
    init.body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await fetch(url, init);
    return res;
}

export async function getResponseJson(url: string, init?: RequestInit): Promise<any | null> {
    const res = await get(url, init);
    if (!res) {
        return null;
    }
    if (typeof res !== 'string') {
        return null;
    }
    try {
        return JSON.parse(res);
    }
    catch {
        return null;
    }
}

export function postResponseEventStream(url: string, data: Record<string, any>, opts: {
    'init'?: RequestInit;
    onStart?: () => void | Promise<void>;
    onInit?: (data: {
        'uid': string;
        'name': string;
    }) => void | Promise<void>;
    onData?: (chunk: string) => void | Promise<void>;
    onEnd?: () => void | Promise<void>;
    onTimeout?: () => void | Promise<void>;
} = {}): AbortController {
    const controller = new AbortController();
    setTimeout(() => {
        (async () => {
            try {
                const res = await window.fetch(url, {
                    'method': 'POST',
                    'headers': { 'content-type': 'application/json' },
                    'body': JSON.stringify(data),
                    'signal': controller.signal,
                });
                const body = res.body;
                if (!body) {
                    await opts.onTimeout?.();
                    return;
                }
                await opts.onStart?.();
                const reader = body.getReader();
                const decoder = new TextDecoder('utf8');
                let buf = '';
                while (true) {
                    try {
                        const { value, done } = await reader.read();
                        if (done) {
                            break;
                        }
                        buf += decoder.decode(value, { 'stream': true, });
                        if (!buf.includes('\n\n')) {
                            continue;
                        }
                        const events = buf.split('\n\n');
                        buf = events.pop() ?? '';
                        for (const ev of events) {
                            const line = JSON.parse(ev.slice(5).trim());
                            if (line.init) {
                                await opts.onInit?.(line.init);
                                continue;
                            }
                            await opts.onData?.(typeof line === 'string' ? line : (line.choices?.[0]?.delta?.content ?? ''));
                        }
                    }
                    catch {
                        break;
                    }
                }
                await opts.onEnd?.();
            }
            catch {
                await opts.onTimeout?.();
                return;
            }
        })().catch(() => { });
    }, 0);
    return controller;
}

export async function postResponseJson(url: string, data: Record<string, any> | FormData, init?: RequestInit): Promise<any | null> {
    const res = await post(url, data, init);
    if (!res) {
        return null;
    }
    if (typeof res !== 'string') {
        return null;
    }
    try {
        return JSON.parse(res);
    }
    catch {
        return null;
    }
}

export function parseUrl(url: string): IUrl {
    const rtn: IUrl = {
        'protocol': null,
        'auth': null,
        'user': null,
        'pass': null,
        'host': null,
        'hostname': null,
        'port': null,
        'pathname': '/',
        'path': null,
        'query': null,
        'hash': null
    };
    const hash = url.indexOf('#');
    if (hash > -1) {
        rtn['hash'] = url.slice(hash + 1);
        url = url.slice(0, hash);
    }
    const query = url.indexOf('?');
    if (query > -1) {
        rtn['query'] = url.slice(query + 1);
        url = url.slice(0, query);
    }
    const protocol = url.indexOf(':');
    if (protocol > -1) {
        rtn['protocol'] = url.slice(0, protocol + 1).toLowerCase();
        url = url.slice(protocol + 1);
        if (url.startsWith('//')) {
            url = url.slice(2);
        }
        let path = url.indexOf('/');
        if (path === -1) {
            path = url.indexOf('\\');
        }
        if (path > -1) {
            rtn['pathname'] = url.slice(path);
            url = url.slice(0, path);
        }
        const auth = url.indexOf('@');
        if (auth > -1) {
            const authStr = url.slice(0, auth);
            const authSplit = authStr.indexOf(':');
            if (authSplit > -1) {
                rtn['user'] = authStr.slice(0, authSplit);
                rtn['pass'] = authStr.slice(authSplit + 1);
                rtn['auth'] = rtn['user'] + ':' + rtn['pass'];
            }
            else {
                rtn['user'] = authStr;
                rtn['auth'] = authStr;
            }
            url = url.slice(auth + 1);
        }
        if (url) {
            const port = url.indexOf(':');
            if (port > -1) {
                rtn['hostname'] = url.slice(0, port).toLowerCase();
                rtn['port'] = url.slice(port + 1);
                rtn['host'] = rtn['hostname'] + (rtn['port'] ? ':' + rtn['port'] : '');
            }
            else {
                rtn['hostname'] = url.toLowerCase();
                rtn['host'] = rtn['hostname'];
            }
        }
    }
    else {
        rtn['pathname'] = url;
    }
    rtn['path'] = rtn['pathname'] + (rtn['query'] ? '?' + rtn['query'] : '');
    return rtn;
}

export function urlResolve(from: string, to: string): string {
    from = from.replace(/\\/g, '/');
    to = to.replace(/\\/g, '/');
    if (to === '') {
        return urlAtom(from);
    }
    const f = parseUrl(from);
    if (to.startsWith('//')) {
        return urlAtom(f.protocol ? f.protocol + to : to);
    }
    if (f.protocol) {
        from = f.protocol + from.slice(f.protocol.length);
    }
    const t = parseUrl(to);
    if (t.protocol) {
        return urlAtom(t.protocol + to.slice(t.protocol.length));
    }
    if (to.startsWith('#') || to.startsWith('?')) {
        const sp = from.indexOf(to[0]);
        if (sp !== -1) {
            return urlAtom(from.slice(0, sp) + to);
        }
        else {
            return urlAtom(from + to);
        }
    }
    let abs = (f.auth ? f.auth + '@' : '') + (f.host ?? '');
    if (to.startsWith('/')) {
        abs += to;
    }
    else {
        const path = f.pathname.replace(/\/[^/]*$/g, '');
        abs += path + '/' + to;
    }
    if (f.protocol && (f.protocol !== 'file:') && !f.host) {
        return urlAtom(f.protocol + abs);
    }
    else {
        return urlAtom((f.protocol ? f.protocol + '//' : '') + abs);
    }
}

export function urlAtom(url: string): string {
    while (url.includes('/./')) {
        url = url.replace(/\/\.\//g, '/');
    }
    while (/\/(?!\.\.)[^/]+\/\.\.\//.test(url)) {
        url = url.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, '/');
    }
    url = url.replace(/\.\.\//g, '');
    return url;
}

export function blob2Text(blob: Blob): Promise<string> {
    return new Promise(function (resove) {
        const fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resove(e.target.result as string);
            }
            else {
                resove('');
            }
        });
        fr.readAsText(blob);
    });
}

const blobDataUrlCache = new WeakMap<Blob, Promise<string>>();

export function blob2DataUrl(blob: Blob): Promise<string> {
    const cached = blobDataUrlCache.get(blob);
    if (cached) {
        return cached;
    }
    const converting = new Promise<string>(function (resolve) {
        const fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resolve(e.target.result as string);
            }
            else {
                resolve('');
            }
        });
        fr.readAsDataURL(blob);
    });
    blobDataUrlCache.set(blob, converting);
    return converting;
}

export function execCommand(ac: string): void {
    if (!['copy', 'cut'].includes(ac)) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(ac);
}

export function compar(before: Array<string | number>, after: Array<string | number>): {
    'remove': Record<string, number>;
    'add': Record<string, number>;
    'length': {
        'remove': number;
        'add': number;
    };
} {
    const rtn: {
        'remove': Record<string, number>;
        'add': Record<string, number>;
        'length': {
            'remove': number;
            'add': number;
        };
    } = {
        'remove': {},
        'add': {},
        'length': {
            'remove': 0,
            'add': 0
        }
    };
    const indexed = before.length >= 64 && after.length >= 64;
    const afterValues = indexed ? new Set(after) : null;
    const beforeValues = indexed ? new Set(before) : null;
    for (let i = 0; i < before.length; ++i) {
        const item = before[i];
        if (afterValues ? afterValues.has(item) : after.includes(item)) {
            continue;
        }
        rtn.remove[item] = i;
        ++rtn.length.remove;
    }
    for (let i = 0; i < after.length; ++i) {
        const item = after[i];
        if (beforeValues ? beforeValues.has(item) : before.includes(item)) {
            continue;
        }
        rtn.add[item] = i;
        ++rtn.length.add;
    }
    return rtn;
}

export function formatSecond(second: number): string {
    const h = Math.floor(second / 3600);
    second = second - h * 3600;
    const m = Math.floor(second / 60);
    const s = Math.floor(second - m * 60);
    return (h ? h.toString().padStart(2, '0') + ':' : '') + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}

export function formatTime(ts: number | Date, tz?: number): {
    'date': string;
    'time': string;
    'zone': string;
} {
    const rtn = {
        'date': '',
        'time': '',
        'zone': ''
    };
    if (typeof ts === 'number') {
        ts = new Date(ts);
    }
    const ntz = tz ?? -(ts.getTimezoneOffset() / 60);
    ts.setTime(ts.getTime() + ntz * 60 * 60000);
    rtn.date = ts.getUTCFullYear().toString() + '-' + (ts.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + ts.getUTCDate().toString().padStart(2, '0');
    rtn.time = ts.getUTCHours().toString().padStart(2, '0') + ':' + ts.getUTCMinutes().toString().padStart(2, '0') + ':' + ts.getUTCSeconds().toString().padStart(2, '0');
    rtn.zone = 'UTC' + (ntz >= 0 ? '+' : '') + ntz.toString();
    return rtn;
}

export function isMs(time: number): boolean {
    return time > 1000000000000 ? true : false;
}

export function queryStringify(query: Record<string, any>, encode: boolean = true): string {
    if (encode) {
        return Object.entries(query).map(([k, v]) => {
            if (Array.isArray(v)) {
                return v.map((i) => `${encodeURIComponent(k)}=${encodeURIComponent(i)}`).join('&');
            }
            return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        }).join('&');
    }
    return Object.entries(query).map(([k, v]) => {
        if (Array.isArray(v)) {
            return v.map((i) => `${k}=${i}}`).join('&');
        }
        return `${k}=${v}`;
    }).join('&');
}

export function queryParse(query: string): Record<string, string | string[]> {
    const ret: Record<string, string | string[]> = {};
    const arrayKeys: Record<string, boolean> = {};
    for (const i of query.split('&')) {
        if (!i.length) {
            continue;
        }
        const pos = i.indexOf('=');
        const key = decodeURIComponent(pos === -1 ? i : i.slice(0, pos));
        const value = pos === -1 ? '' : decodeURIComponent(i.slice(pos + 1));
        if (arrayKeys[key]) {
            (ret[key] as string[]).push(value);
        }
        else if (undefined === ret[key]) {
            ret[key] = value;
        }
        else {
            ret[key] = [ret[key] as string, value];
            arrayKeys[key] = true;
        }
    }
    return ret;
}

export function isEscaped(str: string, pos: number): boolean {
    let count = 0;
    for (let i = pos - 1; i >= 0 && str[i] === '\\'; i--) {
        count++;
    }
    return count % 2 !== 0;
}

export function parseArrayString(arrayStr: string): string[] {
    const content = arrayStr.trim().slice(1, -1);
    const result: string[] = [];
    let start = 0;
    let depth = 0;
    let inString = false;
    let quote = '';
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if ((char === '"' || char === "'") && !inString) {
            inString = true;
            quote = char;
        }
        else if (char === quote && inString && !isEscaped(content, i)) {
            inString = false;
            quote = '';
        }
        if (!inString) {
            if (char === '{' || char === '[' || char === '(') {
                depth++;
            }
            else if (char === '}' || char === ']' || char === ')') {
                depth--;
            }
            else if (char === ',' && depth === 0) {
                const item = content.slice(start, i).trim();
                if (item) {
                    result.push(item);
                }
                start = i + 1;
            }
        }
    }
    const item = content.slice(start).trim();
    if (item) {
        result.push(item);
    }
    return result;
}

export function isEscapeChar(code: string, index: number): boolean {
    let preChar = code[index - 1];
    let count = 0;
    while (preChar === '\\') {
        preChar = code[index - (++count) - 1];
    }
    return count % 2 === 0 ? false : true;
}

const wordCharacters = new Uint8Array(128);
for (let code = 48; code <= 57; ++code) wordCharacters[code] = 1;
for (let code = 65; code <= 90; ++code) wordCharacters[code] = 1;
for (let code = 97; code <= 122; ++code) wordCharacters[code] = 1;
wordCharacters[95] = 1;
wordCharacters[36] = 2;

function isWordCharacter(char: string, dollar = true): boolean {
    const kind = wordCharacters[char?.charCodeAt(0) ?? 117];
    return kind === 1 || dollar && kind === 2;
}

export function stateMachine(code: string, start: number, process: (event: {
    'state': ESTATE;
    'start': number;
    'end': number;
    'word': string;
    'pre': {
        'state': ESTATE;
        'word': string;
        'nonnull': string;
    };
    'bracket': {
        's': number;
        'm': number;
        'l': number;
    };
}) => boolean, states: typeof import('../lib/tool.js').ESTATE): void {
    let state: ESTATE = states.NORMAL;
    code = code.replace(/\r\n?/g, '\n');
    const bracket: {
        's': number;
        'm': number;
        'l': number;
    } = {
        's': 0,
        'm': 0,
        'l': 0,
    };
    let marker = '';
    let word = '';
    let pre: {
        'state': ESTATE;
        'word': string;
        'nonnull': string;
    } = {
        'state': states.NORMAL,
        'word': '',
        'nonnull': '',
    };
    for (let i = start; i < code.length; ++i) {
        const char = code[i];
        switch (state) {
            case states.COMMENT: {
                if (marker === '*') {
                    if ((char === '*') && (code[i + 1] === '/')) {
                        word += char + code[++i];
                        if ((i >= 0) && !process({
                            'state': state,
                            'start': i - word.length + 1,
                            'end': i,
                            'word': word,
                            'pre': {
                                'state': pre.state,
                                'word': pre.word,
                                'nonnull': pre.nonnull,
                            },
                            'bracket': bracket,
                        })) {
                            return;
                        }
                        pre.state = state;
                        pre.word = word;
                        const wordTrim = word.trim();
                        if (wordTrim) {
                            pre.nonnull = wordTrim;
                        }
                        state = states.NORMAL;
                        word = '';
                        marker = '';
                    }
                    else {
                        word += char;
                    }
                    break;
                }
                if (char === '\n') {
                    --i;
                    if (!process({
                        'state': state,
                        'start': i - word.length + 1,
                        'end': i,
                        'word': word,
                        'pre': {
                            'state': pre.state,
                            'word': pre.word,
                            'nonnull': pre.nonnull,
                        },
                        'bracket': bracket,
                    })) {
                        return;
                    }
                    pre.state = state;
                    pre.word = word;
                    const wordTrim = word.trim();
                    if (wordTrim) {
                        pre.nonnull = wordTrim;
                    }
                    state = states.NORMAL;
                    word = '';
                    marker = '';
                }
                else {
                    word += char;
                }
                break;
            }
            case states.REG: {
                switch (char) {
                    case '[': {
                        if (!isEscapeChar(code, i)) {
                            marker = '[';
                        }
                        word += char;
                        break;
                    }
                    case ']': {
                        if (!isEscapeChar(code, i) && (marker === '[')) {
                            marker = '/';
                        }
                        word += char;
                        break;
                    }
                    case '/': {
                        if (!isEscapeChar(code, i) && (marker === '/')) {
                            marker = 'e';
                        }
                        word += char;
                        break;
                    }
                    default: {
                        if (marker !== 'e') {
                            word += char;
                            break;
                        }
                        if (isWordCharacter(char, false)) {
                            word += char;
                            break;
                        }
                        --i;
                        if (!process({
                            'state': state,
                            'start': i - word.length + 1,
                            'end': i,
                            'word': word,
                            'pre': {
                                'state': pre.state,
                                'word': pre.word,
                                'nonnull': pre.nonnull,
                            },
                            'bracket': bracket,
                        })) {
                            return;
                        }
                        pre.state = state;
                        pre.word = word;
                        const wordTrim = word.trim();
                        if (wordTrim) {
                            pre.nonnull = wordTrim;
                        }
                        state = states.NORMAL;
                        word = '';
                        marker = '';
                    }
                }
                break;
            }
            case states.STRING: {
                word += char;
                if ((char === marker) && !isEscapeChar(code, i)) {
                    if (!process({
                        'state': state,
                        'start': i - word.length + 1,
                        'end': i,
                        'word': word,
                        'pre': {
                            'state': pre.state,
                            'word': pre.word,
                            'nonnull': pre.nonnull,
                        },
                        'bracket': bracket,
                    })) {
                        return;
                    }
                    pre.state = state;
                    pre.word = word;
                    const wordTrim = word.trim();
                    if (wordTrim) {
                        pre.nonnull = wordTrim;
                    }
                    state = states.NORMAL;
                    word = '';
                    marker = '';
                }
                break;
            }
            case states.WORD: {
                if (!isWordCharacter(char)) {
                    --i;
                    if (!process({
                        'state': state,
                        'start': i - word.length + 1,
                        'end': i,
                        'word': word,
                        'pre': {
                            'state': pre.state,
                            'word': pre.word,
                            'nonnull': pre.nonnull,
                        },
                        'bracket': bracket,
                    })) {
                        return;
                    }
                    pre.state = state;
                    pre.word = word;
                    const wordTrim = word.trim();
                    if (wordTrim) {
                        pre.nonnull = wordTrim;
                    }
                    state = states.NORMAL;
                    word = '';
                    marker = '';
                    break;
                }
                word += char;
                break;
            }
            default: {
                switch (char) {
                    case '"':
                    case '\'':
                    case '`': {
                        if ((i - 1 >= 0) && !process({
                            'state': state,
                            'start': i - 1 - word.length + 1,
                            'end': i - 1,
                            'word': word,
                            'pre': {
                                'state': pre.state,
                                'word': pre.word,
                                'nonnull': pre.nonnull,
                            },
                            'bracket': bracket,
                        })) {
                            return;
                        }
                        pre.state = state;
                        pre.word = word;
                        const wordTrim = word.trim();
                        if (wordTrim) {
                            pre.nonnull = wordTrim;
                        }
                        state = states.STRING;
                        word = char;
                        marker = char;
                        break;
                    }
                    case '/': {
                        if (code[i + 1] === '/') {
                            if ((i - 1 >= 0) && !process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.state = state;
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            state = states.COMMENT;
                            word = char + code[++i];
                            marker = char;
                            break;
                        }
                        if (code[i + 1] === '*') {
                            if ((i - 1 >= 0) && !process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.state = state;
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            state = states.COMMENT;
                            word = char + code[++i];
                            marker = code[i];
                            break;
                        }
                        let tmp = '';
                        for (let j = i - 1; j >= 0; --j) {
                            if (!tmp) {
                                if (/\s/.test(code[j])) {
                                    continue;
                                }
                                if (code[j] === ')' || code[j] === ']') {
                                    break;
                                }
                                if (!isWordCharacter(code[j])) {
                                    if ((i - 1 >= 0) && !process({
                                        'state': state,
                                        'start': i - 1 - word.length + 1,
                                        'end': i - 1,
                                        'word': word,
                                        'pre': {
                                            'state': pre.state,
                                            'word': pre.word,
                                            'nonnull': pre.nonnull,
                                        },
                                        'bracket': bracket,
                                    })) {
                                        return;
                                    }
                                    pre.state = state;
                                    pre.word = word;
                                    const wordTrim = word.trim();
                                    if (wordTrim) {
                                        pre.nonnull = wordTrim;
                                    }
                                    state = states.REG;
                                    word = char;
                                    marker = char;
                                    break;
                                }
                                tmp = code[j];
                                continue;
                            }
                            if (isWordCharacter(code[j])) {
                                tmp = code[j] + tmp;
                                continue;
                            }
                            break;
                        }
                        if (tmp) {
                            if (tmp === 'return') {
                                if ((i - 1 >= 0) && !process({
                                    'state': state,
                                    'start': i - 1 - word.length + 1,
                                    'end': i - 1,
                                    'word': word,
                                    'pre': {
                                        'state': pre.state,
                                        'word': pre.word,
                                        'nonnull': pre.nonnull,
                                    },
                                    'bracket': bracket,
                                })) {
                                    return;
                                }
                                pre.state = state;
                                pre.word = word;
                                const wordTrim = word.trim();
                                if (wordTrim) {
                                    pre.nonnull = wordTrim;
                                }
                                state = states.REG;
                                word = char;
                                marker = char;
                            }
                        }
                        if (state !== states.REG) {
                            word += char;
                        }
                        break;
                    }
                    case '(': {
                        if (word.includes('(') || word.includes(')')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        ++bracket.s;
                        break;
                    }
                    case ')': {
                        if (word.includes('(') || word.includes(')')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        --bracket.s;
                        break;
                    }
                    case '[': {
                        if (word.includes('[') || word.includes(']')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        ++bracket.m;
                        break;
                    }
                    case ']': {
                        if (word.includes('[') || word.includes(']')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        --bracket.m;
                        break;
                    }
                    case '{': {
                        if (word.includes('{') || word.includes('}')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        ++bracket.l;
                        break;
                    }
                    case '}': {
                        if (word.includes('{') || word.includes('}')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        --bracket.l;
                        break;
                    }
                    default: {
                        if (isWordCharacter(char)) {
                            if ((i - 1 >= 0) && !process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.state = state;
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            state = states.WORD;
                            word = char;
                            marker = char;
                            break;
                        }
                        word += char;
                    }
                }
            }
        }
    }
    if (word) {
        const i = code.length - 1;
        process({
            'state': state,
            'start': i - word.length + 1,
            'end': i,
            'word': word,
            'pre': {
                'state': pre.state,
                'word': pre.word,
                'nonnull': pre.nonnull,
            },
            'bracket': bracket,
        });
    }
}

let headElement: HTMLHeadElement;

function getHeadElement(): HTMLHeadElement {
    if (!headElement) {
        const heads = document.querySelectorAll('head');
        headElement = heads[heads.length - 1];
    }
    return headElement;
}

export async function loadScript(url: string, ordered: boolean = false): Promise<boolean> {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.addEventListener('load', function () {
            resolve(true);
        });
        script.addEventListener('error', function () {
            resolve(false);
        });
        script.async = !ordered;
        script.src = url;
        getHeadElement().appendChild(script);
    });
}

export async function loadScripts(urls: string[], opt: {
    loaded?: (url: string, state: number) => void;
    'ordered'?: boolean;
} = {}): Promise<void> {
    await Promise.all(urls.map(async (url) => {
        const res = await loadScript(url, opt.ordered);
        opt.loaded?.(url, res ? 1 : 0);
    }));
}

export async function loadLink(url: string, pos: 'before' | 'after' = 'after'): Promise<boolean> {
    return new Promise((resolve) => {
        const head = getHeadElement();
        const link = document.createElement('link');
        link.addEventListener('load', function () {
            resolve(true);
        });
        link.addEventListener('error', function () {
            resolve(false);
        });
        link.href = url;
        link.rel = 'stylesheet';
        if (pos === 'before') {
            head.insertBefore(link, head.firstChild);
        }
        else {
            head.appendChild(link);
        }
    });
}

export async function loadLinks(urls: string[], opt: {
    loaded?: (url: string, state: number) => void;
} = {}): Promise<void> {
    await Promise.all(urls.map(async (url) => {
        const res = await loadLink(url);
        opt.loaded?.(url, res ? 1 : 0);
    }));
}

export async function loadAssets(urls: string[], opt: {
    loaded?: (url: string, state: number) => void;
} = {}): Promise<boolean> {
    const scripts: string[] = [];
    const links: string[] = [];
    for (const url of urls) {
        if (url.split(/[?#]/, 1)[0].toLowerCase().endsWith('.css')) {
            links.push(url);
        }
        else {
            scripts.push(url);
        }
    }
    let loaded = true;
    const onLoaded = (url: string, state: number): void => {
        if (state === 0) {
            loaded = false;
        }
        opt.loaded?.(url, state);
    };
    await Promise.all([
        loadScripts(scripts, { 'ordered': true, 'loaded': onLoaded }),
        loadLinks(links, { 'loaded': onLoaded }),
    ]);
    return loaded;
}

export function loadStyle(style: string): void {
    const sel = document.createElement('style');
    sel.innerHTML = style;
    getHeadElement().appendChild(sel);
}

export function isFalsy(val: any): val is TFalsy {
    return (val === null) || (val === undefined) || (val === '') || (val === false) || (val === 0);
}

export function isTruthy(val: any): val is Exclude<typeof val, TFalsy> {
    return !isFalsy(val);
}

export function logicalOr<T, T2>(v1: T, v2: T2): [
    T
] extends [
    TFalsy
] ? T2 : T {
    return (isFalsy(v1) ? v2 : v1) as any;
}
