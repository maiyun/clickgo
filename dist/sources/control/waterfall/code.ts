import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        /** --- 滚动条滚动事件 --- */
        'scroll': null
    };

    public props: {
        /** --- 瀑布流的数据源。为了通用性使用 any 数组 --- */
        'data': any[];
        /** --- 列间距和行间距 --- */
        'gap': number | string;
        /** --- 显示列数 --- */
        'columns': number | string;
        /** --- 每个列表项高度的映射对象，key 可以是 id 或索引，value 为对应像素高度 --- */
        'sizes': Record<string, number | undefined>;
    } = {
            'data': [],
            'gap': 10,
            'columns': 2,
            'sizes': {}
        };

    /** --- 内部记录各列的高度 --- */
    public columnHeights: number[] = [];

    /** --- 内部记录每个元素的计算位置信息 --- */
    public itemPositions: Array<{ left: number; top: number; width: number; height: number; }> = [];

    /** --- 内容的真实滚动 Top --- */
    public scrollTopData: number = 0;

    /** --- 视口的有效高度 --- */
    public clientHeight: number = 0;

    /** --- 视口的总宽度 --- */
    public clientWidth: number = 0;

    /** --- 内部容纳所有被定位元素所需的总高度 --- */
    public totalHeight: number = 0;

    /**
     * --- 要显示的项目起、终下标 ---
     */
    public renderList: number[] = [];

    /** --- 内部 DOM 的 padding --- */
    public padding = {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
    };

    /**
     * --- 处理滚动事件并更新虚拟渲染列表 ---
     * @param e 滚动事件对象
     */
    public onScroll(e: Event): void {
        const target = e.target as HTMLElement;
        this.scrollTopData = target.scrollTop;
        this.updateRenderList();
        this.emit('scroll', e);
    }

    /**
     * --- 根据当前滚动区域计算需要渲染的下标列表 ---
     * @returns 无返回值
     */
    public updateRenderList(): void {
        const topView = this.scrollTopData;
        const bottomView = topView + this.clientHeight;
        const buffer = this.clientHeight * 0.5;

        const newRenderList: number[] = [];
        for (let i = 0; i < this.itemPositions.length; i++) {
            const pos = this.itemPositions[i];
            if (pos.top + pos.height > topView - buffer && pos.top < bottomView + buffer) {
                newRenderList.push(i);
            }
        }
        this.renderList = newRenderList;
    }

    /**
     * --- 重新计算瀑布流布局 ---
     * @returns 无返回值
     */
    public computeLayout(): void {
        const colsRaw = typeof this.props.columns === 'string' ? parseInt(this.props.columns, 10) : this.props.columns;
        const gapRaw = typeof this.props.gap === 'string' ? parseInt(this.props.gap, 10) : this.props.gap;
        const cols = Number.isFinite(colsRaw) ? Math.floor(colsRaw) : 0;
        const gap = Number.isFinite(gapRaw) ? Math.max(gapRaw, 0) : 0;

        if (cols <= 0) {
            this.columnHeights = [];
            this.itemPositions = [];
            this.totalHeight = this.padding.top + this.padding.bottom;
            this.renderList = [];
            return;
        }

        this.columnHeights = new Array(cols).fill(0);
        this.itemPositions = [];

        const availableWidth = Math.max(0, this.clientWidth - this.padding.left - this.padding.right);
        const itemWidthRaw = (availableWidth - gap * (cols - 1)) / cols;
        const itemWidth = Math.max(itemWidthRaw, 0);

        for (let i = 0; i < this.props.data.length; i++) {
            const row = this.props.data[i];

            let minColIndex = 0;
            let minHeight = this.columnHeights[0];
            for (let j = 1; j < this.columnHeights.length; j++) {
                if (this.columnHeights[j] < minHeight) {
                    minColIndex = j;
                    minHeight = this.columnHeights[j];
                }
            }

            const left = minColIndex * (itemWidth + gap) + this.padding.left;
            const top = this.columnHeights[minColIndex] + this.padding.top;

            /** --- 假设预先从 sizes 传入了高度（或者用固定的 100 垫底） --- */
            const rowKey = typeof row === 'object' && row !== null && typeof row.id !== 'undefined' ? String(row.id) : i.toString();
            const itemHeight = this.props.sizes[rowKey];
            const h = typeof itemHeight === 'number' && itemHeight > 0 ? itemHeight : 100;

            this.itemPositions.push({
                'left': left,
                'top': top,
                'width': itemWidth,
                'height': h
            });

            this.columnHeights[minColIndex] += h + gap;
        }

        let maxHei = 0;
        for (const ch of this.columnHeights) {
            if (ch > maxHei) {
                maxHei = ch;
            }
        }
        if (this.props.data.length > 0) {
            maxHei = Math.max(maxHei - gap, 0);
        }
        this.totalHeight = maxHei + this.padding.top + this.padding.bottom;
        this.updateRenderList();
    }

    /**
     * --- 挂载后初始化尺寸监听和属性监听 ---
     * @returns 无返回值
     */
    public onMounted(): void | Promise<void> {
        const style = window.getComputedStyle(this.element);
        this.padding.top = clickgo.tool.getNumber(style.paddingTop);
        this.padding.right = clickgo.tool.getNumber(style.paddingRight);
        this.padding.bottom = clickgo.tool.getNumber(style.paddingBottom);
        this.padding.left = clickgo.tool.getNumber(style.paddingLeft);

        this.clientWidth = this.element.clientWidth;
        this.clientHeight = this.element.clientHeight;
        this.computeLayout();

        clickgo.dom.watchSize(this, this.element, () => {
            this.clientWidth = this.element.clientWidth;
            this.clientHeight = this.element.clientHeight;
            this.computeLayout();
        });

        this.watch('data', () => {
            this.computeLayout();
        }, {
            'deep': true
        });

        this.watch('sizes', () => {
            this.computeLayout();
        }, {
            'deep': true
        });

        this.watch('columns', () => {
            this.computeLayout();
        });

        this.watch('gap', () => {
            this.computeLayout();
        });
    }

}
