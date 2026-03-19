import * as clickgo from 'clickgo';

/** --- 同一窗体内的 sform 实例注册表，确保同时只有一个浮动面板打开 --- */
const formSforms = new WeakMap<object, Set<any>>();

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:expanded': null
    };

    public props: {
        'expanded': boolean | string;
        'width': number | string;
    } = {
            'expanded': true,
            'width': 280
        };

    /** --- 当前是否展开 --- */
    public expandedData: boolean = true;

    /** --- 浮动面板当前指向的 group 索引，-1 表示关闭 --- */
    public floatGroup: number = -1;

    /** --- 浮动面板当前选中的 item 索引 --- */
    public floatItem: number = 0;

    /** --- 展开时的宽度 --- */
    public get widthComp(): string {
        if (typeof this.props.width === 'number') {
            return this.props.width.toString() + 'px';
        }
        if (/^\d+$/.test(this.props.width)) {
            return this.props.width + 'px';
        }
        return this.props.width;
    }

    /**
     * --- 切换展开/收起 ---
     */
    public toggle(): void {
        this.expandedData = !this.expandedData;
        this.emit('update:expanded', this.expandedData);
        // --- 收起时关闭浮动面板 ---
        if (!this.expandedData) {
            this.floatGroup = -1;
        }
    }

    /**
     * --- 收起模式下，点击 icon 打开/关闭浮动面板 ---
     * @param groupIndex group 索引
     * @param itemIndex item 索引
     */
    public toggleFloat(groupIndex: number, itemIndex: number): void {
        if (this.floatGroup === groupIndex && this.floatItem === itemIndex) {
            // --- 再次点击同一个则关闭 ---
            this.floatGroup = -1;
            return;
        }
        // --- 关闭同一窗体内其他 sform 的浮动面板 ---
        const siblings = formSforms.get(this.rootForm);
        if (siblings) {
            for (const sform of siblings) {
                if (sform !== this) {
                    sform.floatGroup = -1;
                }
            }
        }
        this.floatGroup = groupIndex;
        this.floatItem = itemIndex;
    }

    /**
     * --- 关闭浮动面板 ---
     */
    public closeFloat(): void {
        this.floatGroup = -1;
    }

    public onMounted(): void {
        // --- 注册到窗体级别的 sform 集合 ---
        const form = this.rootForm;
        if (!formSforms.has(form)) {
            formSforms.set(form, new Set());
        }
        formSforms.get(form)!.add(this);

        this.watch('expanded', () => {
            this.expandedData = this.propBoolean('expanded');
            if (!this.expandedData) {
                this.floatGroup = -1;
            }
        }, {
            'immediate': true
        });
    }

    public onUnmounted(): void {
        formSforms.get(this.rootForm)?.delete(this);
    }

}
