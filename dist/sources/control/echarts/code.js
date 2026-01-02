import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'init': null
    };
    props = {
        'disabled': false,
        'data': {},
        'theme': 'light',
    };
    notInit = false;
    isLoading = true;
    access = {
        'chart': undefined,
    };
    async onMounted() {
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
