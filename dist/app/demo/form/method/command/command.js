import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    /** --- 各种调用入口都修改同一个实例的数据 --- */
    value = 0;
    source = '';
    result = '';
    webMcp = false;
    /** --- 同一应用可打开多个示例 Form，命令名称包含目标实例 --- */
    get addName() {
        return `counter.add.${this.formId}`;
    }
    get readName() {
        return `counter.read.${this.formId}`;
    }
    /** --- 框架的统一网页入口及本窗体命令示例，不依赖 WebMCP --- */
    get agentGuide() {
        return `const api = window['clickgo']['command'];\n`
            + `api.listTasks();\n`
            + `api.list('${this.taskId}');\n`
            + `await api.execute('${this.taskId}', '${this.addName}', { 'amount': 2 });\n`
            + `await api.execute('${this.taskId}', '${this.readName}');`;
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
     * --- 打开通用命令面板 ---
     * @returns 面板关闭后完成
     */
    async palette() {
        await clickgo.command.showPalette(this);
    }
    /**
     * --- 运行时接入可用的 WebMCP；无需影响普通界面 ---
     * @returns 更新接入结果
     */
    async connect() {
        this.webMcp = await clickgo.command.connectWebMcp(this);
    }
    /**
     * --- Form 挂载后声明一次业务命令，销毁时框架自动解除注册 ---
     * @returns 无返回值
     */
    onMounted() {
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
    }
}
