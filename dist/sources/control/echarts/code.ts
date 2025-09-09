import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null
    };

    public props: {
        'disabled': boolean | string;

        'data': Record<string, any>;
        'theme': 'light' | 'dark';
    } = {
            'disabled': false,
            'data': {},
            'theme': 'light',
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        /** --- 图标控件对象 --- */
        'chart': any;
    } = {
            'chart': undefined,
        };

    public async onMounted(): Promise<void> {
        const echarts = await clickgo.core.getModule('echarts');
        if (!echarts) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        // --- 监听 theme ---
        this.access.chart = echarts.init(this.refs.content, this.props.theme === 'light' ? undefined : 'dark');
        this.watch('theme', () => {
            this.access.chart.dispose();
            this.access.chart = echarts.init(this.refs.content, this.props.theme === 'light' ? undefined : 'dark');
            this.access.chart.setOption(this.props.data);
            this.emit('init', this.access.chart);
        }, {
            'deep': true
        });
        // --- 监听 data ---
        this.watch('data', () => {
            this.access.chart.setOption(this.props.data);
        }, {
            'immediate': true,
            'deep': true
        });
        // --- 自适应大小 ---
        clickgo.dom.watchSize(this, this.element, () => {
            this.access.chart.resize();
        }, true);
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.chart);
    }

}
