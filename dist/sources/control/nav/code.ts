import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'layer': null
    };

    public props: {
        'modelValue': string;
        // --- pop 模式时是否在显示 ---
        'show': boolean | string | undefined;
        'logo': string;
    } = {
            'modelValue': '',
            'show': undefined,
            'logo': ''
        };

    // --- 菜单是否在显示 ---
    public showData = true;

    /** --- logo 的实际图像 --- */
    public logoData: string = '';

    /** --- watch: logo 变更次数 --- */
    public logoCount: number = 0;

    /** --- 当前选中的 name（可能带 qs） --- */
    public selected: string = '';

    /** --- 当前是否是层的模式 --- */
    public layer = false;

    /** --- 当前的所有子集列表，['panel', 'order?a=b'] --- */
    public childs: string[] = [];

    /** --- 选择一个 name，child 可能也会调用 --- */
    public select(name: string): void {
        if (this.selected === name) {
            return;
        }
        this.selected = name;
        this.emit('update:modelValue', name);
        if (this.layer && this.showData) {
            this.showData = false;
            this.emit('update:show', this.showData);
        }
    }

    /** --- pop 模式点击外边空白处收缩 --- */
    public menuwrapClick(e: MouseEvent): void {
        if (!this.layer) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        if (!this.showData) {
            return;
        }
        this.showData = false;
        this.emit('update:show', this.showData);
    }

    public async onMounted(): Promise<void> {
        // --- 切换层的模式 ---
        await this.nextTick(); // 加这一段代表窗体项目也执行成功后再初始化本控件
        // --- 之前初始化将导致窗体宽度还没重置结束，导致本 nav 会先识别成为 layer 模式，因为太窄 ---
        clickgo.dom.watchSize(this.element, () => {
            if (this.element.offsetWidth < 500) {
                if (!this.layer) {
                    this.layer = true;
                    this.emit('layer', this.layer);
                }
            }
            else {
                if (this.layer) {
                    this.layer = false;
                    this.emit('layer', this.layer);
                }
            }
        }, true);

        this.watch('show', () => {
            if (this.props.show === undefined) {
                this.showData = this.layer ? false : true;
                this.emit('update:show', this.showData);
                return;
            }
            this.showData = this.propBoolean('show');
        }, {
            'immediate': true
        });

        this.watch('modelValue', () => {
            this.select(this.props.modelValue);
        }, {
            'immediate': true
        });

        // --- 监听 logo 是否显示 ---
        this.watch('logo', async () => {
            const count = ++this.logoCount;
            if (typeof this.props.logo !== 'string' || this.props.logo === '') {
                this.logoData = '';
                return;
            }
            const pre = this.props.logo.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                this.logoData = `url(${this.props.logo})`;
                return;
            }
            // --- 本 app 包 ---
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.logo);
            const blob = await clickgo.fs.getContent(path);
            if ((count !== this.logoCount) || !blob || typeof blob === 'string') {
                return;
            }
            const t = await clickgo.tool.blob2DataUrl(blob);
            if (count !== this.logoCount) {
                return;
            }
            if (t) {
                this.logoData = 'url(' + t + ')';
                return;
            }
            this.logoData = '';
        }, {
            'immediate': true
        });
    }

}
