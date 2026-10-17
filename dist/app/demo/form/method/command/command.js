import * as clickgo from 'clickgo';
/** --- Demo 只展示框架自动接入状态，不要求用户手动启用 --- */
const webMcpStatusText = {
    'unsupported': 'WebMCP: Not supported by this browser',
    'ready': 'WebMCP: Browser interface ready',
};
export default class extends clickgo.form.AbstractForm {
    /** --- 各种调用入口都修改同一个实例的数据 --- */
    value = 0;
    source = '';
    result = '';
    webMcpStatus = '';
    /** --- 异步说明的请求顺序，旧结果不能覆盖更新后的状态 --- */
    access = {
        'guideRequest': 0,
        'fileId': '',
    };
    /** --- 同一应用可打开多个示例 Form，命令名称包含目标实例 --- */
    get addName() {
        return `counter.add.${this.formId}`;
    }
    get readName() {
        return `counter.read.${this.formId}`;
    }
    /** --- 导出当前实例内容，演示通用文件交付，不自行实现传输协议 --- */
    get exportName() {
        return `counter.export.${this.formId}`;
    }
    /** --- 框架生成的说明可直接复制给 AI，网页和 Native 使用同一个 API --- */
    agentGuide = '';
    /**
     * --- 刷新当前环境的 AI 接入说明，默认不包含连接凭据 ---
     * @returns 更新可复制的说明
     */
    async generateGuide() {
        const request = ++this.access.guideRequest;
        const guide = await clickgo.command.getAgentGuide(this);
        if (guide === null || guide === false || request !== this.access.guideRequest ||
            clickgo.form.get(this.formId) === null) {
            return;
        }
        this.agentGuide = guide;
    }
    /**
     * --- 跟随框架的页面级接入通知，不按任务筛选或轮询 ---
     * @param status 浏览器接入状态
     * @returns 更新显示与接入说明
     */
    async onWebMcpStatusChanged(status) {
        this.webMcpStatus = webMcpStatusText[status];
        await this.generateGuide();
    }
    /**
     * --- 展示同一份接入信息的结构化形式，便于应用自定义界面 ---
     * @returns 更新接入快照
     */
    async agentInfo() {
        const info = await clickgo.command.getAgentInfo(this);
        if (info === null || info === false || clickgo.form.get(this.formId) === null) {
            return;
        }
        this.result = JSON.stringify(info, null, 2);
        this.webMcpStatus = webMcpStatusText[info.webMcp.status];
    }
    /**
     * --- 展示代理可发现的名称、说明、参数规则和可用状态 ---
     * @returns 更新列表快照
     */
    listCommands() {
        this.result = JSON.stringify(clickgo.command.createBridge(this).list(), null, 2);
    }
    /**
     * --- 按钮、菜单和快捷键都调用注册的命令，不另写加法逻辑 ---
     * @returns 显示执行结果
     */
    async add() {
        const result = await clickgo.command.execute(this, this.addName, { 'amount': 1 });
        this.result = JSON.stringify(result, null, 2);
    }
    /**
     * --- 演示实例桥接与 UI 共享执行入口 ---
     * @returns 显示执行结果
     */
    async bridgeAdd() {
        const result = await clickgo.command.createBridge(this).execute(this.addName, { 'amount': 2 });
        this.result = JSON.stringify(result, null, 2);
    }
    /**
     * --- 界面与代理都接收同一个内置导出的文件句柄 ---
     * @returns 显示文件名、资源 URI 和读取入口
     */
    async exportFile() {
        const result = await clickgo.command.execute(this, this.exportName);
        this.result = JSON.stringify(result, null, 2);
    }
    /**
     * --- 打开通用命令面板 ---
     * @returns 面板关闭后完成
     */
    async palette() {
        await clickgo.command.showPalette(this);
    }
    /**
     * --- Form 挂载后声明一次业务命令，销毁时框架自动解除注册 ---
     * @returns 无返回值
     */
    async onMounted() {
        clickgo.command.register(this, {
            'name': this.addName,
            'title': 'Increase counter',
            'description': 'Increase this demo form\'s counter by the specified amount and return the updated value.',
            'inputSchema': {
                'type': 'object',
                'properties': { 'amount': { 'type': 'integer', 'minimum': 1, 'maximum': 10 } },
                'required': ['amount'],
                'additionalProperties': false,
            },
            'outputSchema': {
                'type': 'object', 'properties': { 'value': { 'type': 'integer' } }, 'required': ['value'],
            },
            'exposed': true,
            'annotations': { 'readOnlyHint': false, 'destructiveHint': false, 'openWorldHint': false },
            'execute': (args, context) => {
                this.value += args['amount'];
                this.source = context.source;
                return clickgo.command.success({ 'value': this.value });
            },
        });
        clickgo.command.register(this, {
            'name': this.readName,
            'title': 'Read counter',
            'description': 'Read this demo form\'s current counter value without changing it.',
            'inputSchema': { 'type': 'object', 'additionalProperties': false },
            'exposed': true,
            'annotations': { 'readOnlyHint': true, 'destructiveHint': false, 'openWorldHint': false },
            'execute': () => clickgo.command.success({ 'value': this.value }),
        });
        clickgo.command.register(this, {
            'name': this.exportName, 'title': 'Export counter as text',
            'description': 'Export this form\'s current counter as a text file. Use the returned file resource or its readCommand to retrieve the same bytes.',
            'inputSchema': { 'type': 'object', 'additionalProperties': false },
            'exposed': true,
            'annotations': { 'readOnlyHint': false, 'destructiveHint': false, 'openWorldHint': false },
            'execute': (_args, context) => {
                const blob = new Blob([`Counter: ${this.value}\n`], { 'type': 'text/plain' });
                const file = context.createFile(blob, { 'fileName': `counter-${this.formId}.txt` });
                if (file === false) {
                    return clickgo.command.failure('export-failed', 'Could not retain the exported file');
                }
                // --- 示例只保留本 Form 的最近一次导出，新文件准备好后释放旧句柄。 ---
                if (this.access.fileId) {
                    clickgo.command.releaseFile(this, this.access.fileId);
                }
                this.access.fileId = file.fileId;
                return clickgo.command.success({ 'value': this.value }, [file]);
            },
        });
        // --- 新建 Form 先读一次快照，后续变化由全局事件更新 ---
        const info = await clickgo.command.getAgentInfo(this);
        if (info === null || info === false || clickgo.form.get(this.formId) === null) {
            return;
        }
        this.webMcpStatus = webMcpStatusText[info.webMcp.status];
        await this.generateGuide();
    }
}
