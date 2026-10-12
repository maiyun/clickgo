import * as clickgo from 'clickgo';

/** --- Demo 只展示框架自动接入状态，不要求用户手动启用 --- */
const webMcpStatusText = {
    'unsupported': 'WebMCP: Not supported by this browser',
    'ready': 'WebMCP: Browser interface ready',
};

export default class extends clickgo.form.AbstractForm {

    /** --- 各种调用入口都修改同一个实例的数据 --- */
    public value = 0;

    public source = '';

    public result = '';

    public webMcpStatus = '';

    /** --- 异步说明的请求顺序，旧结果不能覆盖更新后的状态 --- */
    public access = {
        'guideRequest': 0,
    };

    /** --- 同一应用可打开多个示例 Form，命令名称包含目标实例 --- */
    public get addName(): string {
        return `counter.add.${this.formId}`;
    }

    public get readName(): string {
        return `counter.read.${this.formId}`;
    }

    /** --- 框架生成的说明可直接复制给 AI，网页和 Native 使用同一个 API --- */
    public agentGuide = '';

    /**
     * --- 刷新当前环境的 AI 接入说明，默认不包含连接凭据 ---
     * @returns 更新可复制的说明
     */
    public async generateGuide(): Promise<void> {
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
    public async onWebMcpStatusChanged(status: clickgo.command.TWebMcpStatus): Promise<void> {
        this.webMcpStatus = webMcpStatusText[status];
        await this.generateGuide();
    }

    /**
     * --- 展示同一份接入信息的结构化形式，便于应用自定义界面 ---
     * @returns 更新接入快照
     */
    public async agentInfo(): Promise<void> {
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
    public listCommands(): void {
        this.result = JSON.stringify(clickgo.command.createBridge(this).list(), null, 2);
    }

    /**
     * --- 按钮、菜单和快捷键都调用注册的命令，不另写加法逻辑 ---
     * @returns 显示执行结果
     */
    public async add(): Promise<void> {
        const result = await clickgo.command.execute(this, this.addName, { 'amount': 1 });
        this.result = JSON.stringify(result, null, 2);
    }

    /**
     * --- 演示实例桥接与 UI 共享执行入口 ---
     * @returns 显示执行结果
     */
    public async bridgeAdd(): Promise<void> {
        const result = await clickgo.command.createBridge(this).execute(this.addName, { 'amount': 2 });
        this.result = JSON.stringify(result, null, 2);
    }

    /**
     * --- 打开通用命令面板 ---
     * @returns 面板关闭后完成
     */
    public async palette(): Promise<void> {
        await clickgo.command.showPalette(this);
    }

    /**
     * --- Form 挂载后声明一次业务命令，销毁时框架自动解除注册 ---
     * @returns 无返回值
     */
    public async onMounted(): Promise<void> {
        clickgo.command.register<{ 'amount': number; }>(this, {
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
        // --- 新建 Form 先读一次快照，后续变化由全局事件更新 ---
        const info = await clickgo.command.getAgentInfo(this);
        if (info === null || info === false || clickgo.form.get(this.formId) === null) {
            return;
        }
        this.webMcpStatus = webMcpStatusText[info.webMcp.status];
        await this.generateGuide();
    }

}
