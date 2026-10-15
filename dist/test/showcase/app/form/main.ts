import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    /** --- 原生导航选中状态，不切换本演示工作区 --- */
    public active = 'Overview';

    /** --- 演示宿主的当前主色 --- */
    public accent = '#087f72';

    /** --- 原生表格选中行 --- */
    public selected: Array<string | number> = [];

    /** --- 可复用的状态标签语义 --- */
    public statusTypes: Record<string, 'primary' | 'info' | 'warning'> = {
        'Completed': 'primary',
        'Processing': 'info',
        'Pending': 'warning',
    };

    /** --- 图表配色从主题读取，不固定实例的品牌色 --- */
    public palette = {
        'accent': '', 'fill': '', 'clear': '', 'previous': '',
        'info': '', 'warning': '', 'grid': '', 'text': '', 'muted': '',
    };

    /** --- 逐实例的弹窗占用及样式监听回调 --- */
    public access = {
        'dialogOpen': false,
        'paletteChanged': null as (() => void) | null,
        'colorContext': null as CanvasRenderingContext2D | null,
        'accentElement': null as HTMLElement | null,
    };

    /** --- 原生搜索输入过滤演示订单 --- */
    public get filteredOrders(): typeof this.orders {
        const search = this.search.trim().toLowerCase();
        return this.orders.filter(order =>
            `${order['id']} ${order['customer']} ${order['product']} ${order['status']}`.toLowerCase().includes(search)
        );
    }

    /**
     * --- 使用框架的主色 API 切换强调色 ---
     * @param color 目标主色
     * @returns 切换完成
     */
    public setAccent(color: string): void {
        this.accent = color;
        clickgo.theme.setMain(color);
    }

    /**
     * --- 按 Emerald、Indigo、Amber 顺序体验强调色 ---
     * @returns 主色更新完成
     */
    public cycleAccent(): void {
        if (this.accent === '#087f72') {
            this.setAccent('#5965c8');
        }
        else if (this.accent === '#5965c8') {
            this.setAccent('#aa641a');
        }
        else {
            this.setAccent('#087f72');
        }
    }

    /**
     * --- 刷新 Canvas 图表所需的主题配色 ---
     * @returns 配色更新完成
     */
    public refreshPalette(): void {
        const element = this.access.accentElement;
        if (!element) {
            return;
        }
        const style = getComputedStyle(this.element);
        const accent = getComputedStyle(element).backgroundColor;
        const context = this.access.colorContext;
        if (!context) {
            return;
        }
        // --- Canvas 原生解析 CSS Color，转换为图表库可用的 RGB ---
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = accent;
        context.fillRect(0, 0, 1, 1);
        const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
        this.palette = {
            'accent': `rgb(${red}, ${green}, ${blue})`,
            'fill': `rgba(${red}, ${green}, ${blue}, .24)`,
            'clear': `rgba(${red}, ${green}, ${blue}, 0)`,
            'previous': style.getPropertyValue('--dashboard-chart-previous').trim(),
            'info': style.getPropertyValue('--dashboard-chart-info').trim(),
            'warning': style.getPropertyValue('--dashboard-chart-warning').trim(),
            'grid': style.getPropertyValue('--dashboard-chart-grid').trim(),
            'text': style.getPropertyValue('--g-color').trim(),
            'muted': style.getPropertyValue('--g-color-tip').trim(),
        };
    }

    /**
     * --- 接入原生样式监听，主色切换时同步图表 ---
     * @returns 接入完成
     */
    public onMounted(): void {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.access.colorContext = canvas.getContext('2d');
        // --- 保留元素引用，卸载阶段不依赖可能已清空的 refs ---
        const element: HTMLElement = this.refs.accent.element;
        this.access.accentElement = element;
        this.access.paletteChanged = () => { this.refreshPalette(); };
        clickgo.dom.watchStyle(element, 'background-color', this.access.paletteChanged, true);
    }

    /**
     * --- 清理当前实例的颜色监听 ---
     * @returns 清理完成
     */
    public onUnmounted(): void {
        if (this.access.paletteChanged && this.access.accentElement) {
            clickgo.dom.unwatchStyle(this.access.accentElement, 'background-color', this.access.paletteChanged);
        }
        this.access.paletteChanged = null;
        this.access.accentElement = null;
        this.access.colorContext = null;
    }

    /** --- 截图使用固定演示数据 --- */
    public search = '';

    /** --- 统计周期 --- */
    public period = ['Last 30 days'];

    /** --- 单一主窗体中的导航项目 --- */
    public navigation = [
        { 'name': 'Overview', 'icon': 'grid' },
        { 'name': 'Analytics', 'icon': 'chart' },
        { 'name': 'Orders', 'icon': 'bag', 'count': '24' },
        { 'name': 'Products', 'icon': 'box' },
        { 'name': 'Customers', 'icon': 'people' },
        { 'name': 'Campaigns', 'icon': 'bolt' },
    ];

    /** --- 概览指标 --- */
    public metrics = [
        { 'name': 'Total revenue', 'value': '$128,430', 'delta': '+18.6%', 'points': '0,28 10,23 20,25 30,13 40,19 50,9 60,12 70,3' },
        { 'name': 'Orders', 'value': '1,842', 'delta': '+12.8%', 'points': '0,27 10,18 20,21 30,18 40,8 50,13 60,5 70,3' },
        { 'name': 'Active customers', 'value': '8,549', 'delta': '+24.2%', 'points': '0,27 10,28 20,18 30,22 40,15 50,9 60,12 70,3' },
        { 'name': 'Conversion rate', 'value': '4.86%', 'delta': '+0.8 pts', 'points': '0,26 10,21 20,23 30,15 40,17 50,6 60,8 70,3' },
    ];

    /** --- ClickGo 原生表格的演示订单 --- */
    public orders = [
        { 'id': '#CG-1048', 'customer': 'Olivia Bennett', 'initials': 'OB', 'product': 'Studio Collection', 'amount': '$249.00', 'status': 'Completed', 'date': 'Oct 14, 10:42' },
        { 'id': '#CG-1047', 'customer': 'James Wilson', 'initials': 'JW', 'product': 'Everyday Essentials', 'amount': '$128.50', 'status': 'Processing', 'date': 'Oct 14, 10:38' },
        { 'id': '#CG-1046', 'customer': 'Emma Laurent', 'initials': 'EL', 'product': 'Weekend Edit', 'amount': '$389.00', 'status': 'Completed', 'date': 'Oct 14, 10:31' },
        { 'id': '#CG-1045', 'customer': 'Noah Anderson', 'initials': 'NA', 'product': 'Studio Collection', 'amount': '$176.00', 'status': 'Pending', 'date': 'Oct 14, 10:25' },
        { 'id': '#CG-1044', 'customer': 'Sophia Chen', 'initials': 'SC', 'product': 'Everyday Essentials', 'amount': '$92.00', 'status': 'Completed', 'date': 'Oct 14, 10:19' },
    ];

    /** --- 收入与上一周期对比的真实图表配置 --- */
    public get revenue(): Record<string, unknown> {
        const weekly = this.period[0] === 'Last 7 days';
        return {
            'animation': false,
            'textStyle': { 'fontFamily': 'Arial, sans-serif' },
            'tooltip': { 'trigger': 'axis' },
            'grid': { 'left': 58, 'right': 24, 'top': 24, 'bottom': 35 },
            'xAxis': {
                'type': 'category', 'boundaryGap': false,
                'data': weekly ? ['Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14'] : ['Sep 15', '', '', '', 'Sep 22', '', '', '', 'Sep 29', '', '', '', 'Oct 06', '', '', '', 'Oct 14'],
                'axisLine': { 'show': false }, 'axisTick': { 'show': false },
                'axisLabel': { 'color': this.palette.muted, 'fontSize': 10, 'interval': 0, 'margin': 15 },
            },
            'yAxis': {
                'type': 'value', 'min': 0, 'max': 16000, 'interval': 4000,
                'axisLabel': { 'color': this.palette.muted, 'fontSize': 10, 'formatter': '${value}' },
                'splitLine': { 'lineStyle': { 'color': this.palette.grid, 'type': 'dashed' } },
            },
            'series': [
                {
                    'name': 'Previous period', 'type': 'line', 'smooth': true, 'symbol': 'none',
                    'data': weekly ? [8400, 6900, 8500, 7400, 8300, 10200, 8800] : [3300, 4200, 3800, 6200, 4800, 5800, 6900, 5300, 6600, 6100, 8400, 6900, 8500, 7400, 8300, 10200, 8800],
                    'lineStyle': { 'color': this.palette.previous, 'width': 2, 'type': 'dashed' },
                },
                {
                    'name': 'Revenue', 'type': 'line', 'smooth': 0.35, 'symbol': 'none',
                    'data': weekly ? [11800, 10100, 11500, 9900, 12500, 11800, 14800] : [4500, 5200, 4600, 7900, 6500, 7200, 8800, 7400, 9600, 8300, 11800, 10100, 11500, 9900, 12500, 11800, 14800],
                    'lineStyle': { 'color': this.palette.accent, 'width': 3 },
                    'areaStyle': { 'color': { 'type': 'linear', 'x': 0, 'y': 0, 'x2': 0, 'y2': 1, 'colorStops': [{ 'offset': 0, 'color': this.palette.fill }, { 'offset': 1, 'color': this.palette.clear }] } },
                    'markPoint': { 'symbol': 'circle', 'symbolSize': 8, 'label': { 'show': false }, 'itemStyle': { 'color': this.palette.accent, 'borderWidth': 3, 'borderColor': '#fff' }, 'data': [{ 'coord': [weekly ? 6 : 16, 14800] }] },
                },
            ],
        };
    }

    /** --- 渠道环形图 --- */
    public get channels(): Record<string, unknown> {
        return {
            'animation': false,
            'color': [this.palette.accent, this.palette.info, this.palette.warning],
            'series': [{ 'type': 'pie', 'radius': ['65%', '82%'], 'center': ['50%', '50%'], 'label': { 'show': false }, 'itemStyle': { 'borderColor': '#fff', 'borderWidth': 5, 'borderRadius': 5 }, 'data': [{ 'value': 58, 'name': 'Direct' }, { 'value': 28, 'name': 'Organic search' }, { 'value': 14, 'name': 'Campaigns' }] }],
            'graphic': [
                { 'type': 'text', 'left': 'center', 'top': '38%', 'style': { 'text': '24,892', 'fill': this.palette.text, 'fontSize': 25, 'fontWeight': 650, 'fontFamily': 'Arial, sans-serif' } },
                { 'type': 'text', 'left': 'center', 'top': '58%', 'style': { 'text': 'total visitors', 'fill': this.palette.muted, 'fontSize': 11, 'fontFamily': 'Arial, sans-serif' } },
            ],
        };
    }

    /**
     * --- 展示纯视觉演示的功能范围 ---
     * @param message 当前操作的演示提示
     * @returns 提示关闭
     */
    public async showDemoNotice(message: string): Promise<void> {
        if (this.access.dialogOpen) {
            return;
        }
        this.access.dialogOpen = true;
        try {
            await clickgo.form.dialog(this, message);
        }
        finally {
            this.access.dialogOpen = false;
        }
    }

}
