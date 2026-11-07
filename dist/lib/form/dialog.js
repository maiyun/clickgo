import * as clickgo from '../../clickgo';
import * as lCore from '../core';
import * as lTask from '../task';
import * as lTool from '../tool';
import { info, state } from './state';
import { AbstractForm } from './abstract-form';
import { close } from './window';
import { create } from './create';
/**
 * --- 显示一个 dialog ---
 * @param current 当前任务
 * @param opt 选项或者一段文字
 */
export function dialog(current, opt) {
    return new Promise(function (resolve) {
        if (typeof current !== 'string') {
            current = current.taskId;
        }
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const filename = lTool.urlResolve(opt.path ?? '/', './tmp' + lTool.random(16, lTool.RANDOM_LN) + '.js');
        const nopt = opt;
        const t = lTask.getOrigin(current);
        if (!t) {
            resolve('');
            return;
        }
        // --- 防止快速重复调用时同时创建多个 dialog ---
        const runtime = lTask.getRuntime(state.sysId, current);
        if (!runtime || runtime.dialogCreating > 0) {
            resolve('');
            return;
        }
        runtime.dialogCreating++;
        const locale = t.locale.lang || lCore.config.locale;
        nopt.buttons ??= [info.locale[locale]?.ok ?? info.locale['en'].ok];
        const cls = class extends AbstractForm {
            buttons = nopt.buttons;
            dialogWidth = nopt.width;
            dialogHeight = nopt.height;
            dialogPadding = nopt.padding;
            data = nopt.data ?? {};
            methods = nopt.methods ?? {};
            get filename() {
                return filename;
            }
            select(button) {
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'button': button
                    }
                };
                if (nopt.select) {
                    nopt.select.call(this, event, button);
                }
                if (event.go) {
                    if (nopt.autoDialogResult !== false) {
                        this.dialogResult = button;
                    }
                    close(this.formId);
                }
            }
            async onMounted() {
                await nopt.onMounted?.call(this);
            }
        };
        create(current, cls, undefined, {
            'layout': `<form title="${nopt.title ?? 'dialog'}" min="false" max="false" resize="false" height="0" width="0" border="${nopt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select"${nopt.direction ? ` direction="${nopt.direction}"` : ''}${nopt.gutter ? ` gutter="${nopt.gutter}"` : ''}${nopt.width !== undefined ? ` :width="dialogWidth"` : ''}${nopt.height !== undefined ? ` :height="dialogHeight"` : ''}${nopt.padding !== undefined ? ` :padding="dialogPadding"` : ''}>${nopt.content}</dialog></form>`,
            'style': nopt.style
        }).then((frm) => {
            if (typeof frm === 'number') {
                runtime.dialogCreating--;
                resolve('');
                return;
            }
            runtime.dialogCreating--;
            frm.showDialog().then((v) => {
                resolve(v);
            }).catch(() => {
                resolve('');
            });
        }).catch(() => {
            runtime.dialogCreating--;
            resolve('');
        });
    });
}
/**
 * --- 显示一个验证码窗口 ---
 * @param current 当前任务
 * @param opt 选项
 * @returns 验证是否通过
 */
export async function captcha(current, opt) {
    if (opt.factory === 'tc') {
        // --- TC ---
        const tcc = await clickgo.core.getModule('tjcaptcha');
        if (!tcc) {
            // --- 加载失败 ---
            return false;
        }
        return new Promise(resolve => {
            const instance = new tcc(opt.akey, (res) => {
                const event = {
                    'detail': {
                        'result': (res.ret === 0 && !res.errorCode) ? 1 : 0,
                        'token': res.ticket + '|' + res.randstr,
                    },
                };
                resolve(event.detail.result === 1 ? event : false);
            }, {
                'needFeedBack': false,
            });
            instance.show();
        });
    }
    const cft = await clickgo.core.getModule('turnstile');
    if (!cft) {
        // --- 没有成功 ---
        return false;
    }
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const t = lTask.getOrigin(current);
    if (!t) {
        return false;
    }
    const locale = t.locale.lang || lCore.config.locale;
    const buttons = [info.locale[locale]?.cancel ?? info.locale['en'].cancel];
    let instance;
    let token = '';
    let callbackReceived = false;
    let finished = false;
    let closeTimer;
    let resolveUnmount = () => { };
    const unmounted = new Promise((resolve) => {
        resolveUnmount = resolve;
    });
    try {
        const result = dialog(current, {
            'content': '<block ref="content"></block>',
            'buttons': buttons,
            onMounted: function () {
                const form = this;
                form.onBeforeUnmount = () => {
                    finished = true;
                    resolveUnmount();
                };
                const closeWhenReady = () => {
                    if (finished || !t.forms[form.formId] || t.forms[form.formId].closed) {
                        return;
                    }
                    // --- showDialog 完成显示后才安装关闭回调，避免同步验证码回调过早关闭 ---
                    if (!form.cgDialogCallback) {
                        closeTimer = setTimeout(closeWhenReady, 10);
                        return;
                    }
                    form.close();
                };
                instance = cft.render(this.refs.content, {
                    'sitekey': opt.akey,
                    'size': 'flexible',
                    callback: (value) => {
                        if (finished || callbackReceived || !t.forms[form.formId] || t.forms[form.formId].closed) {
                            return;
                        }
                        callbackReceived = true;
                        token = value;
                        closeWhenReady();
                    },
                });
            },
        });
        const res = await Promise.race([result, unmounted]);
        if (!token || res === (info.locale[locale]?.cancel ?? info.locale['en'].cancel)) {
            return false;
        }
        return {
            'detail': {
                'result': 1,
                token,
            },
        };
    }
    finally {
        finished = true;
        clearTimeout(closeTimer);
        if (instance !== undefined) {
            cft.remove(instance);
        }
    }
}
/**
 * --- 显示一个 confirm ---
 * @param current 当前任务 id
 * @param opt 选项或者一段文字
 */
export async function confirm(current, opt) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (typeof opt === 'string') {
        opt = {
            'content': opt
        };
    }
    const t = lTask.getOrigin(current);
    if (!t) {
        return false;
    }
    const locale = t.locale.lang || lCore.config.locale;
    const buttons = [info.locale[locale]?.no ?? info.locale['en'].no, info.locale[locale]?.yes ?? info.locale['en'].yes];
    if (opt.cancel) {
        buttons.unshift(info.locale[locale]?.cancel ?? info.locale['en'].cancel);
    }
    const res = await dialog(current, {
        'title': opt.title,
        'content': opt.content,
        'buttons': buttons,
    });
    if (res === (info.locale[locale]?.yes ?? info.locale['en'].yes)) {
        return true;
    }
    if (res === (info.locale[locale]?.cancel ?? info.locale['en'].cancel)) {
        return 0;
    }
    return false;
}
/**
 * --- 显示一个输入框 dialog ---
 * @param current 当前任务 id
 * @param opt 选项或者提示文字
 */
export async function prompt(current, opt) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (typeof opt === 'string') {
        opt = {
            'content': opt
        };
    }
    const t = lTask.getOrigin(current);
    if (!t) {
        return '';
    }
    const locale = t.locale.lang || lCore.config.locale;
    const buttons = [info.locale[locale]?.ok ?? info.locale['en'].ok];
    const cancelBtn = info.locale[locale]?.cancel ?? info.locale['en'].cancel;
    if (opt.cancel === true || opt.cancel === undefined) {
        buttons.unshift(cancelBtn);
    }
    const res = await dialog(current, {
        'title': opt.title,
        'direction': 'v',
        'gutter': 10,
        'content': '<block>' + opt.content + '</block><text v-model="data.text" />',
        'data': {
            'text': opt.text ?? ''
        },
        'select': function (e, button) {
            const isOk = button === (info.locale[locale]?.ok ?? info.locale['en'].ok);
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'button': isOk,
                    'value': this.data.text
                },
            };
            opt.select?.call(this, event, isOk);
            if (!event.go) {
                e.preventDefault();
            }
            if (e.detail.button === cancelBtn) {
                this.dialogResult = '';
                return;
            }
            this.dialogResult = this.data.text;
        },
        'buttons': buttons,
        'autoDialogResult': false
    });
    return res;
}
