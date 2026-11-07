import type * as lCore from '../../lib/core';
import type { ISystemDependencies } from '../../lib/form/system.types';

export function createSystemRuntime(deps: ISystemDependencies) {
    const { clickgo, lCore, lTask, lTool, lDom, info, state, changeFocus, getMaxZIndexID, refreshNotifyPosition } = deps;
    let launcherRoot: import('../../lib/core').IVue;
    let superConfirmHandler: undefined | ((result: boolean) => void | Promise<void>);
    let keyboardHideTimer: number | undefined;
    let keyboardGeneration = 0;
    const folderGenerations = new WeakMap<HTMLElement, number>();
const elements: {
    'wrap': HTMLDivElement;
    'list': HTMLDivElement;
    'popList': HTMLDivElement;
    'circular': HTMLDivElement;
    'rectangle': HTMLDivElement;
    'keyboard': HTMLDivElement;
    'notify': HTMLElement;
    'alert': HTMLElement;
    'simpletask': HTMLDivElement;
    'launcher': HTMLDivElement;
    'confirm': HTMLDivElement;
    'init': () => void;
} = {
    'wrap': document.createElement('div'),
    'list': document.createElement('div'),
    'popList': document.createElement('div'),
    'circular': document.createElement('div'),
    'rectangle': document.createElement('div'),
    'keyboard': document.createElement('div'),
    'notify': document.createElement('div'),
    'alert': document.createElement('div'),
    'simpletask': document.createElement('div'),
    'launcher': document.createElement('div'),
    'confirm': document.createElement('div'),
    'init': function() {

        this.wrap.id = 'cg-wrap';
        setLocaleAttributes(this.wrap, lCore.config?.locale ?? lTool.lang.getCodeByAccept());
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        this.wrap.addEventListener('touchmove', function(e): void {

            if (e.target && lDom.findParentByData(e.target as HTMLElement, 'cg-scroll')) {
                return;
            }
            if (e.cancelable) {
                e.preventDefault();
            }

        }, {
            'passive': false
        });
        this.wrap.addEventListener('wheel', function(e): void {

            if (e.target && (((e.target as HTMLElement).dataset.cgScroll !== undefined) || lDom.findParentByData(e.target as HTMLElement, 'cg-scroll'))) {
                return;
            }
            e.preventDefault();
        }, {
            'passive': false
        });
        this.wrap.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });

        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);

        this.popList.id = 'cg-pop-list';
        this.wrap.appendChild(this.popList);

        this.circular.id = 'cg-circular';
        this.wrap.appendChild(this.circular);

        this.rectangle.setAttribute('data-pos', '');
        this.rectangle.id = 'cg-rectangle';
        this.wrap.appendChild(this.rectangle);

        this.notify.id = 'cg-notify';
        this.wrap.appendChild(this.notify);
        this.alert.id = 'cg-alert';
        this.wrap.appendChild(this.alert);

        this.simpletask.id = 'cg-simpletask';
        this.wrap.appendChild(this.simpletask);
        const simpletaskApp = clickgo.modules.vue.createApp({
            'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="click(formId)"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
            'data': function() {
                return {
                    'forms': {}
                };
            },
            'watch': {
                'forms': {
                    handler: function(this: any) {
                        const length = Object.keys(this.forms).length;
                        if (length > 0) {
                            if (elements.simpletask.style.bottom !== '0px') {
                                elements.simpletask.style.bottom = '0px';
                                lCore.trigger('screenResize').catch(() => {});
                            }
                        }
                        else {
                            if (elements.simpletask.style.bottom === '0px') {
                                elements.simpletask.style.bottom = '-46px';
                                lCore.trigger('screenResize').catch(() => {});
                            }
                        }
                    },
                    'deep': true,
                }
            },
            'methods': {
                click: async function(formId: string): Promise<void> {
                    await changeFocus(formId);
                },
            },
            'mounted': function(this: any): void {
                deps.setSimpleSystemTaskRoot(this);
            }
        });
        simpletaskApp.mount('#cg-simpletask');

        this.launcher.id = 'cg-launcher';
        this.wrap.appendChild(this.launcher);

        const waiting = function(): void {

            if (!lCore.config) {
                setTimeout(function() {
                    waiting();
                }, 150);
                return;
            }
            const launcherApp = clickgo.modules.vue.createApp({
                'template': `<div class="cg-launcher-search" @pointerdown="listClick">` +
    `<input v-if="folderName === ''" class="cg-launcher-sinput" :placeholder="search" v-model="name">` +
    `<input v-else class="cg-launcher-foldername" :value="folderName" @change="folderNameChange">` +
`</div>` +
`<div class="cg-launcher-list" @pointerdown="listClick" :class="[folderName === '' ? '' : 'cg-folder-open']">` +
    `<div v-for="item of list" class="cg-launcher-item">` +
        `<div class="cg-launcher-inner">` +
            `<div v-if="!item.list || item.list.length === 0" class="cg-launcher-icon" :style="{'background-image': 'url(' + item.icon + ')'}" @pointerdown="iconClick($event, item)"></div>` +
            `<div v-else class="cg-launcher-folder" @pointerdown="openFolder($event, item)">` +
                `<div>` +
                    `<div v-for="sub of item.list" class="cg-launcher-item">` +
                        `<div class="cg-launcher-inner">` +
                            `<div class="cg-launcher-icon" :style="{'background-image': 'url(' + sub.icon + ')'}" @pointerdown="subIconClick($event, sub)"></div>` +
                            `<div class="cg-launcher-name">{{sub.name}}</div>` +
                        `</div>` +
                        `<div class="cg-launcher-space"></div>` +
                    `</div>` +
                `</div>` +
            `</div>` +
            `<div class="cg-launcher-name">{{item.name}}</div>` +
        `</div>` +
        `<div class="cg-launcher-space"></div>` +
    `</div>` +
`</div>`,
                'data': function() {
                    return {
                        'name': '',
                        'folderName': '',
                        'folderItem': {}
                    };
                },
                'computed': {
                    'search': function() {
                        return info.locale[lCore.config.locale]?.search ?? info.locale['en'].search;
                    },
                    'list': function(this: any) {
                        if (this.name === '') {
                            return lCore.config['launcher.list'];
                        }
                        const list = [];
                        const query = this.name.toLowerCase();
                        for (const item of lCore.config['launcher.list']) {
                            if (item.list && item.list.length > 0) {
                                for (const sub of item.list) {
                                    if (sub.name.toLowerCase().includes(query)) {
                                        list.push(sub);
                                    }
                                }
                            }
                            else {
                                if (item.name.toLowerCase().includes(query)) {
                                    list.push(item);
                                }
                            }
                        }
                        return list;
                    }
                },
                'methods': {

                    listClick: function(this: lCore.IVue, e: PointerEvent): void {
                        if ((e.currentTarget !== e.target) &&
                            !(e.target as HTMLElement).classList.contains('cg-launcher-space')) {
                            return;
                        }
                        clickgo.modules.pointer.click(e, () => {
                            if (this.folderName === '') {
                                hideLauncher();
                            }
                            else {
                                this.closeFolder();
                            }
                        });
                    },

                    iconClick: function(
                        this: lCore.IVue,
                        e: PointerEvent,
                        item: lCore.IConfigLauncherItem
                    ): void {
                        clickgo.modules.pointer.click(e, async () => {
                            hideLauncher();
                            await lTask.run(state.sysId, item.path!, {
                                'icon': item.icon
                            });
                        });
                    },

                    subIconClick: function(
                        this: lCore.IVue,
                        e: PointerEvent,
                        item: lCore.IConfigLauncherItem
                    ): void {

                        if (!(e.currentTarget as HTMLElement).closest('.cg-launcher-folder > div')?.classList.contains('cg-show')) {
                            return;
                        }
                        clickgo.modules.pointer.click(e, async () => {
                            hideLauncher();
                            await lTask.run(state.sysId, item.path!, {
                                'icon': item.icon
                            });
                        });
                    },
                    closeFolder: function(this: any): void {

                        this.folderName = '';
                        const el = this.folderEl as HTMLDivElement;
                        const generation = (folderGenerations.get(el) ?? 0) + 1;
                        folderGenerations.set(el, generation);
                        const rect = (el.parentNode as HTMLDivElement).getBoundingClientRect();
                        el.classList.remove('cg-show');
                        el.style.left = (rect.left + 30).toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.width = '';
                        el.style.height = '';
                        setTimeout(() => {
                            if (folderGenerations.get(el) !== generation) return;
                            el.style.position = '';
                            el.style.left = '';
                            el.style.top = '';
                        }, 150);
                    },

                    openFolder: function(this: lCore.IVue, e: PointerEvent, item: lCore.IConfigLauncherItem): void {
                        const el = (e.currentTarget as HTMLDivElement).firstElementChild as HTMLDivElement;
                        if (el.classList.contains('cg-show') && (el !== e.target)) {
                            return;
                        }

                        e.stopPropagation();
                        clickgo.modules.pointer.click(e, () => {
                            if (this.folderName !== '') {
                                this.closeFolder();
                                return;
                            }
                            this.folderName = item.name;
                            this.folderItem = item;
                            this.folderEl = el;
                            const generation = (folderGenerations.get(el) ?? 0) + 1;
                            folderGenerations.set(el, generation);
                            const searchEl = document.getElementsByClassName('cg-launcher-search')[0] as HTMLDivElement;
                            const rect = el.getBoundingClientRect();
                            el.style.left = rect.left.toString() + 'px';
                            el.style.top = rect.top.toString() + 'px';
                            el.style.position = 'fixed';
                            requestAnimationFrame(() => {
                                if (folderGenerations.get(el) !== generation) return;
                                el.classList.add('cg-show');
                                el.style.left = '50px';
                                el.style.top = searchEl.offsetHeight.toString() + 'px';
                                el.style.width = 'calc(100% - 100px)';
                                el.style.height = 'calc(100% - 50px - ' + searchEl.offsetHeight.toString() + 'px)';
                            });
                        });
                    },
                    folderNameChange: function(this: any, e: InputEvent): void {
                        const input = e.target as HTMLInputElement;
                        const val = input.value.trim();
                        if (val === '') {
                            input.value = this.folderName;
                            return;
                        }
                        this.folderName = val;

                        lCore.trigger('launcherFolderNameChanged', this.folderItem.id ?? '', val).catch(() => {});
                    }
                },
                'mounted': function(this: any): void {
                    launcherRoot = this;
                    deps.setLauncherRoot(this);
                }
            });
            launcherApp.mount('#cg-launcher');
        };
        waiting();

        this.confirm.id = 'cg-confirm';
        this.wrap.appendChild(this.confirm);

        this.confirm.innerHTML = `<div class="cg-confirm-box">` +
            `<div id="cg-confirm-content"></div>` +
            `<div class="cg-confirm-controls">` +
                `<div id="cg-confirm-cancel"></div>` +
                `<div id="cg-confirm-ok"></div>` +
            `</div>` +
        `</div>`;
        this.confirm.style.display = 'none';
        document.getElementById('cg-confirm-cancel')!.addEventListener('click', () => {
            superConfirmHandler?.(false) as any;
            this.confirm.style.display = 'none';
            getMaxZIndexID(state.sysId).then(fid => {
                if (!fid) {
                    return;
                }
                changeFocus(fid).catch(() => {});
            }).catch(() => {});
        });
        document.getElementById('cg-confirm-ok')!.addEventListener('click', () => {
            superConfirmHandler?.(true) as any;
            this.confirm.style.display = 'none';
            getMaxZIndexID(state.sysId).then(fid => {
                if (!fid) {
                    return;
                }
                changeFocus(fid).catch(() => {});
            }).catch(() => {});
        });

        this.keyboard.id = 'cg-keyboard';
        this.keyboard.dir = 'ltr';
        this.keyboard.lang = 'en';
        this.wrap.appendChild(this.keyboard);
        this.keyboard.innerHTML = `<div v-for="line of list">` +
    `<div v-for="row of line" :style="{'width': row[2] ? (row[2] * 50 + 'px') : '50px'}" :class="[!row[0]&&'cg-keyboard-null',row[0]==='Caps'&&caps&&'cg-keyboard-checked',row[0]==='Shift'&&shift&&'cg-keyboard-checked']" @click="click(row)">` +
        `<div v-if="row[1]">{{row[1]}}</div>` +
        `<svg v-if="row[0] === '[x]'" width="24" height="24" viewBox="0 0 24 24" stroke="none"><path d="m7.53033 6.46967c-.29289-.29289-.76777-.29289-1.06066 0s-.29289.76777 0 1.06066l4.46963 4.46967-4.46963 4.4697c-.29289.2929-.29289.7677 0 1.0606s.76777.2929 1.06066 0l4.46967-4.4696 4.4697 4.4696c.2929.2929.7677.2929 1.0606 0s.2929-.7677 0-1.0606l-4.4696-4.4697 4.4696-4.46967c.2929-.29289.2929-.76777 0-1.06066s-.7677-.29289-1.0606 0l-4.4697 4.46963z" /></svg>` +
        `<div v-else>{{row[0]}}</div>` +
    `</div>` +
`</div>`;
        const keyboardApp = clickgo.modules.vue.createApp({
            'data': function() {
                return {
                    'caps': false,
                    'shift': false,
                    'list': [
                        [
                            ['`', '~'],
                            ['1', '!'],
                            ['2', '@'],
                            ['3', '#'],
                            ['4', '$'],
                            ['5', '%'],
                            ['6', '^'],
                            ['7', '&'],
                            ['8', '*'],
                            ['9', '('],
                            ['0', ')'],
                            ['-', '_'],
                            ['=', '+'],
                            ['Back', '', 1.2],
                        ],
                        [
                            ['Tab', '', 1.2],
                            ['q', 'Q'],
                            ['w', 'W'],
                            ['e', 'E'],
                            ['r', 'R'],
                            ['t', 'T'],
                            ['y', 'Y'],
                            ['u', 'U'],
                            ['i', 'I'],
                            ['o', 'O'],
                            ['p', 'P'],
                            ['[', '{'],
                            [']', '}'],
                            ['\\', '|'],
                        ],
                        [
                            ['Caps', '', 1.6],
                            ['a', 'A'],
                            ['s', 'S'],
                            ['d', 'D'],
                            ['f', 'F'],
                            ['g', 'G'],
                            ['h', 'H'],
                            ['j', 'J'],
                            ['k', 'K'],
                            ['l', 'L'],
                            [';', ':'],
                            ['\'', '"'],
                            ['Enter', '', 1.6],
                        ],
                        [
                            ['Shift', '', 2],
                            ['z', 'Z'],
                            ['x', 'X'],
                            ['c', 'C'],
                            ['v', 'V'],
                            ['b', 'B'],
                            ['n', 'N'],
                            ['m', 'M'],
                            [',', '<'],
                            ['.', '>'],
                            ['/', '?'],
                            ['', '', 2.2]
                        ],
                        [
                            ['', '', 4.2],
                            [' ', ' ', 5.8],
                            ['[x]', '', 4.2],
                        ]
                    ]
                };
            },
            'methods': {

                /* eslint-disable @typescript-eslint/no-deprecated */
                click: function(row: string[]): void {
                    if (!row[0]) {
                        return;
                    }
                    switch (row[0]) {
                        case 'Tab': {
                            document.execCommand('insertText', false, '\t');
                            break;
                        }
                        case 'Back': {
                            document.execCommand('delete');
                            break;
                        }
                        case 'Caps': {
                            this.caps = !this.caps;
                            break;
                        }
                        case 'Enter': {
                            document.execCommand('insertText', false, '\n');
                            break;
                        }
                        case 'Shift': {
                            this.shift = !this.shift;
                            break;
                        }
                        case '[x]': {
                            hideKeyboard();
                            break;
                        }
                        case '`':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '0':
                        case '-':
                        case '=': {
                            document.execCommand('insertText', false, row[this.shift ? 1 : 0]);
                            if (this.shift) {
                                this.shift = false;
                            }
                            break;
                        }
                        default: {
                            let n1 = this.caps;
                            if (this.shift) {
                                n1 = !n1;
                            }
                            document.execCommand('insertText', false, row[n1 ? 1 : 0]);
                            if (this.shift) {
                                this.shift = false;
                            }
                        }
                    }
                }
            },
            /* eslint-enable @typescript-eslint/no-deprecated */
        });
        keyboardApp.mount('#cg-keyboard');
        const down = (e: PointerEvent): void => {
            e.preventDefault();
            e.stopPropagation();
            clickgo.modules.pointer.move(e, {
                'object': e.currentTarget as HTMLElement,
                move: (e, o): void => {
                    this.keyboard.style.left = (parseFloat(this.keyboard.style.left) + o.ox) + 'px';
                    this.keyboard.style.top = (parseFloat(this.keyboard.style.top) + o.oy) + 'px';
                },
            });
        };
        this.keyboard.addEventListener('pointerdown', down);
    }
};

function setLocaleAttributes(el: HTMLElement, locale: string): void {
    el.lang = lTool.lang.getTag(locale);
    el.dir = lTool.lang.getDirection(locale);
}

function refreshLocaleDirection(taskId?: string): void {
    const systemLocale = lCore.config?.locale ?? lTool.lang.getCodeByAccept();
    setLocaleAttributes(elements.wrap, systemLocale);
    refreshNotifyPosition();
    const selector = taskId ? `[data-task-id="${taskId}"]` : '[data-task-id]';
    const wraps = [
        ...elements.list.querySelectorAll<HTMLElement>(`.cg-form-wrap${selector}`),
        ...elements.popList.querySelectorAll<HTMLElement>(selector),
    ];
    for (const wrap of wraps) {
        const currentTaskId = wrap.dataset.taskId;
        const task = currentTaskId ? lTask.getOrigin(currentTaskId) : null;
        const locale = lTool.logicalOr(task?.locale.lang ?? '', systemLocale);
        setLocaleAttributes(wrap, locale);
    }
}

function superConfirm(current: string, html: string): Promise<boolean> {
    return new Promise((resolve) => {
        if (current !== state.sysId) {
            resolve(false);
            return;
        }
        if (superConfirmHandler !== undefined) {
            resolve(false);
            return;
        }
        elements.confirm.style.display = 'flex';
        document.getElementById('cg-confirm-content')!.innerHTML = html;
        document.getElementById('cg-confirm-cancel')!.innerHTML = info.locale[lCore.config.locale]?.cancel ?? info.locale['en'].cancel;
        document.getElementById('cg-confirm-ok')!.innerHTML = info.locale[lCore.config.locale]?.ok ?? info.locale['en'].ok;
        superConfirmHandler = (result: boolean) => {
            superConfirmHandler = undefined;
            resolve(result);
        };
    });
}

function showKeyboard(): void {
    if (lDom.is.keyboard && keyboardHideTimer === undefined) return;
    clearTimeout(keyboardHideTimer);
    keyboardHideTimer = undefined;
    const generation = ++keyboardGeneration;
    lDom.is.keyboard = true;
    elements.keyboard.style.display = 'flex';
    requestAnimationFrame(() => {
        if (generation !== keyboardGeneration) return;
        elements.keyboard.style.left = (window.innerWidth - elements.keyboard.offsetWidth) / 2 + 'px';
        elements.keyboard.style.top = (window.innerHeight - elements.keyboard.offsetHeight) - 50 + 'px';
        requestAnimationFrame(() => {
            if (generation !== keyboardGeneration) return;
            elements.keyboard.style.opacity = '1';
            elements.keyboard.style.transform = 'translateY(0)';
        });
    });
}

function hideKeyboard(): void {
    const generation = ++keyboardGeneration;
    clearTimeout(keyboardHideTimer);
    elements.keyboard.style.opacity = '0';
    elements.keyboard.style.transform = 'translateY(-10px)';
    keyboardHideTimer = window.setTimeout(() => {
        if (generation !== keyboardGeneration) return;
        keyboardHideTimer = undefined;
        elements.keyboard.style.display = 'none';
        lDom.is.keyboard = false;
    }, 300);
}

let launcherShown = false;

let launcherHideTimer: ReturnType<typeof setTimeout> | undefined;

function getLauncherShow(): boolean {
    return launcherShown;
}

function showLauncher(): void {
    if (launcherShown) {
        return;
    }
    launcherShown = true;
    clearTimeout(launcherHideTimer);
    launcherHideTimer = undefined;
    elements.launcher.style.display = 'flex';
    requestAnimationFrame(function() {
        if (launcherShown) {
            elements.launcher.classList.add('cg-show');
        }
    });
    lCore.trigger('launcherShowChanged', true).catch(() => {});
}

function hideLauncher(): void {
    if (!launcherShown) {
        return;
    }
    launcherShown = false;
    elements.launcher.classList.remove('cg-show');
    launcherHideTimer = setTimeout(function() {
        launcherHideTimer = undefined;
        if (launcherRoot.folderName !== '') {
            launcherRoot.closeFolder();
        }
        launcherRoot.name = '';
        elements.launcher.style.display = 'none';
    }, 300);
    lCore.trigger('launcherShowChanged', false).catch(() => {});
}

let inited = false;
function init(): void {
    if (inited) {
        return;
    }
    inited = true;
    elements.init();
}

    return { elements, refreshLocaleDirection, superConfirm, showKeyboard, hideKeyboard, getLauncherShow, showLauncher, hideLauncher, init };
}
