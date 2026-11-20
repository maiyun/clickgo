import * as lCommand from '../command';
import * as lForm from '../form';
import * as lTool from '../tool';
import * as lGuide from './guide';
import { locale } from './agent-guide-locale';
import { showPalette } from './palette';
/**
 * --- 打开当前应用的 AI 接入说明，可复制给代理并查看已公开的命令 ---
 * @param current 打开窗口的业务 Form
 * @param options instructions 为可选的应用操作说明，作为纯文本追加到通用说明中
 * @returns 窗口关闭后完成；发起方已关闭或正在加载时直接返回
 */
export async function showAgentGuide(current, options = {}) {
    if (current.loading || !lForm.get(current.formId)) {
        return;
    }
    const filename = `/runtime/agent-guide-${lTool.random(8, lTool.RANDOM_LUN)}.js`;
    const instructions = options.instructions?.trim();
    const bridge = lCommand.createBridge(current);
    class AgentGuide extends lForm.AbstractForm {
        appName = '';
        nativeEntry = false;
        /** --- 只列出当前应用已具备的入口；浏览器支持 WebMCP 和工具发布完成是两个状态 --- */
        methodsLabel = '';
        guide = '';
        commandCount = 0;
        preview = false;
        failed = false;
        /** --- 环境通知可能先于上一次 Native 查询返回 --- */
        access = { 'request': 0 };
        get filename() {
            return filename;
        }
        get text() {
            return locale[this.locale] ?? locale['en'];
        }
        /**
         * --- 预览和剪贴板使用同一份环境快照，默认查询不含 HTTP 连接凭据 ---
         * @returns 更新当前应用的接入说明
         */
        async refresh() {
            const request = ++this.access.request;
            const info = await lCommand.getAgentInfo(this);
            if (request !== this.access.request || !lForm.get(this.formId)) {
                return;
            }
            if (!info) {
                this.guide = '';
                this.failed = true;
                return;
            }
            this.failed = false;
            this.appName = info.apps[0]?.name ?? '';
            this.nativeEntry = info.native !== null;
            const methods = ['JavaScript API'];
            if (info.webMcp.publishedTaskIds.includes(this.taskId)) {
                methods.unshift('WebMCP');
            }
            if (info.native?.mcp.enabled) {
                if (info.native.mcp.discovery) {
                    methods.unshift('MCP (stdio)', 'CLI');
                }
                else {
                    methods.unshift('MCP (HTTP)');
                }
            }
            this.methodsLabel = methods.join(' · ');
            this.commandCount = bridge.list().length;
            const guide = lGuide.format(info);
            this.guide = instructions ? `${guide}\n\n${instructions}` : guide;
        }
        /**
         * --- 剪贴板不可用时展开原文供手动选择 ---
         * @returns 复制完成后给出反馈
         */
        async copy() {
            if (!this.guide) {
                return;
            }
            try {
                await navigator.clipboard.writeText(this.guide);
            }
            catch {
                if (lForm.get(this.formId)) {
                    this.preview = true;
                    lForm.alert(this.text['manual'], 'warning');
                }
                return;
            }
            if (lForm.get(this.formId)) {
                lForm.alert(this.text['copied'], 'primary');
            }
        }
        /** --- 从说明进入的面板与代理具有相同的可见命令范围 --- */
        async openPalette() {
            await showPalette(this, { 'exposedOnly': true });
            if (lForm.get(this.formId)) {
                await this.refresh();
            }
        }
        /** --- 屏幕缩小或预览展开后，让越界的部分回到当前可用区域 --- */
        fitPosition() {
            const form = this.refs.form;
            if (!form?.isShow) {
                return;
            }
            const area = form.getArea();
            const right = area.left + area.width - this.element.offsetWidth;
            const left = Math.max(area.left, Math.min(form.leftData, right));
            const bottom = area.top + area.height - this.element.offsetHeight;
            const top = Math.max(area.top, Math.min(form.topData, bottom));
            if (left !== form.leftData) {
                form.setPropData('left', left);
            }
            if (top !== form.topData) {
                form.setPropData('top', top);
            }
        }
        onScreenResize() {
            this.fitPosition();
        }
        async onMounted() {
            await this.refresh();
        }
        async onWebMcpStatusChanged() {
            await this.refresh();
        }
        /** --- 销毁中的窗口不再接收正在查询的说明 --- */
        onBeforeUnmount() {
            ++this.access.request;
        }
    }
    current.loading = true;
    let form;
    try {
        form = await lForm.create(current, AgentGuide, undefined, {
            'layout': `<form :title="text['title']" width="auto" height="auto" min="false" max="false" resize="false" direction="v" @size="fitPosition">
                <!-- 按当前应用和运行环境说明如何接入 -->
                <layout direction="v" gutter="12" style="width: min(480px, 94vw); padding: 16px; box-sizing: border-box;">
                    <layout v-if="guide" gutter="8" align-v="center" wrap>
                        <label size="l" align="start" style="overflow-wrap: anywhere;">{{appName}}</label>
                        <label mode="tip" dir="ltr">{{methodsLabel}}</label>
                    </layout>
                    <label v-if="failed" align="start">{{text['failed']}}</label>
                    <layout v-if="failed"><button @click="refresh">{{text['retry']}}</button></layout>
                    <template v-else-if="guide">
                        <label align="start">{{text[nativeEntry ? 'native' : 'web']}}</label>
                        <layout gutter="8" wrap>
                            <button type="cg" @click="copy">{{text['copy']}}</button>
                            <button :checked="preview" @click="preview = !preview">{{text[preview ? 'hide' : 'preview']}}</button>
                        </layout>
                        <text v-if="preview" :model-value="guide" readonly type="multi" dir="ltr" style="height: min(160px, 24vh);"></text>
                    </template>
                </layout>
                <!-- 直接检查该应用公开给代理的命令 -->
                <template v-slot:footer>
                    <layout align-v="center" gutter="10" wrap style="padding: 8px 16px;">
                        <layout v-if="guide" align-v="center" gutter="6" style="flex: 1;">
                            <label align="start">{{text['commands']}}</label>
                            <label size="m">{{commandCount}}</label>
                        </layout>
                        <button @click="openPalette">{{text['palette']}}</button>
                    </layout>
                </template>
            </form>`,
        });
    }
    finally {
        current.loading = false;
    }
    if (!lForm.get(current.formId)) {
        form.close();
        return;
    }
    await form.showDialog();
}
