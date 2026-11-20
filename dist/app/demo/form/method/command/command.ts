import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    /** --- 各种调用入口都修改同一个实例的数据 --- */
    public value = 0;

    public lastAction = '';

    public showPrompt = false;

    public scrollTop = 0;

    public scrollHeight = 0;

    public clientHeight = 0;

    /** --- 窗口可同时打开多次，测试指令明确当前目标 --- */
    public get testPrompt(): string {
        return `In ClickGo app ${this.taskId}, read the counter in form ${this.formId}, then increase it by one and report its new value.`;
    }

    /**
     * --- 将当前实例的测试指令复制给代理，复制失败时展示原文 ---
     * @returns 无返回值
     */
    public async copyPrompt(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.testPrompt);
        }
        catch {
            this.showPrompt = true;
            clickgo.form.alert('Select the text and copy it manually.', 'warning');
            return;
        }
        clickgo.form.alert('Test prompt copied.', 'primary');
    }

    /** --- 当前窗口最近一次导出的文件句柄 --- */
    public access = {
        'fileId': '',
    };

    /** --- 同一应用可打开多个示例 Form，命令名称包含目标实例 --- */
    public get addName(): string {
        return `counter.add.${this.formId}`;
    }

    public get readName(): string {
        return `counter.read.${this.formId}`;
    }

    /** --- 导出当前实例内容，演示通用文件交付，不自行实现传输协议 --- */
    public get exportName(): string {
        return `counter.export.${this.formId}`;
    }

    /**
     * --- 打开框架提供的 AI 接入说明 ---
     * @returns 窗口关闭后完成
     */
    public async guide(): Promise<void> {
        await clickgo.command.showAgentGuide(this);
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
    public onMounted(): void {
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
                this.lastAction = `Increase counter · ${context.source}`;
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
            'execute': (_args, context) => {
                this.lastAction = `Read counter · ${context.source}`;
                return clickgo.command.success({ 'value': this.value });
            },
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
                this.lastAction = `Export counter as text · ${context.source}`;
                return clickgo.command.success({ 'value': this.value }, [file]);
            },
        });
    }

}
