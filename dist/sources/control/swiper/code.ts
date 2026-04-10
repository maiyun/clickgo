import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,
        'update:modelValue': null
    };

    public props: {
        /** --- 幻灯片列表，支持字符串 URL 或 { src, alt } 对象 --- */
        'items': string[] | Array<{ 'src': string; 'alt'?: string; }>;
        /** --- 是否自动播放 --- */
        'autoplay': boolean | string;
        /** --- 自动播放间隔（毫秒） --- */
        'interval': number | string;
        /** --- 是否循环播放 --- */
        'loop': boolean | string;
        /** --- 当前幻灯片索引（双向绑定） --- */
        'modelValue': number | string;
        /** --- 图片填充模式 CSS object-fit 值 --- */
        'fit': string;
    } = {
            'items': [],
            'autoplay': true,
            'interval': 3000,
            'loop': true,
            'modelValue': 0,
            'fit': 'cover'
        };

    /** --- 当前显示的幻灯片索引 --- */
    public currentIndex = 0;

    /** --- 拖拽时的水平偏移量（px） --- */
    public dragOffset = 0;

    /** --- 是否开启切换动画 --- */
    public isAni = true;

    /** --- 自动播放 timer ID --- */
    public autoTimer = 0;

    /** --- wrap 元素的宽度（px），用于拖拽偏移量的百分比换算 --- */
    public wrapWidth = 0;

    /** --- 解析后的幻灯片列表（src 已转为 data URL 或原始 URL）--- */
    public resolvedItems: Array<{ 'src': string; 'alt': string; }> = [];

    /** --- 用于防止旧的异步任务覆盖新结果的计数器 --- */
    public resolveCount = 0;

    /**
     * --- 标准化 items prop 为统一结构 ---
     */
    public get itemsNorm(): Array<{ 'src': string; 'alt': string; }> {
        const items = this.propArray('items');
        return items.map((item: string | { 'src': string; 'alt'?: string; }) => {
            if (typeof item === 'string') {
                return { 'src': item, 'alt': '' };
            }
            return { 'src': item.src ?? '', 'alt': item.alt ?? '' };
        });
    }

    /**
     * --- 轨道 X 方向的位移百分比（相对于轨道自身宽度）---
     * 轨道宽度 = n * wrapWidth，translateX(-i/n * 100%) 恰好将第 i 张对齐到 wrap 左侧
     */
    public get trackX(): number {
        const n = this.resolvedItems.length;
        if (n === 0 || this.wrapWidth === 0) {
            return 0;
        }
        return (-this.currentIndex + this.dragOffset / this.wrapWidth) / n * 100;
    }

    /**
     * --- 解析所有 items 的 src 为可用 URL ---
     */
    public async resolveItems(): Promise<void> {
        const count = ++this.resolveCount;
        const norm = this.itemsNorm;
        const result: Array<{ 'src': string; 'alt': string; }> = [];
        for (const item of norm) {
            if (count !== this.resolveCount) {
                return;
            }
            const src = item.src;
            if (!src) {
                result.push({ 'src': '', 'alt': item.alt });
                continue;
            }
            const pre = src.slice(0, 6).toLowerCase();
            // --- http/https/data: 直接使用 ---
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                result.push({ 'src': src, 'alt': item.alt });
                continue;
            }
            // --- 包内路径，通过 ClickGo FS 读取并转为 data URL ---
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', src);
            const blob = await clickgo.fs.getContent(this, path);
            if (count !== this.resolveCount) {
                return;
            }
            if (!blob || typeof blob === 'string') {
                result.push({ 'src': '', 'alt': item.alt });
                continue;
            }
            const dataUrl = await clickgo.tool.blob2DataUrl(blob);
            if (count !== this.resolveCount) {
                return;
            }
            result.push({ 'src': dataUrl ?? '', 'alt': item.alt });
        }
        this.resolvedItems = result;
        // --- 若 items 变化导致 currentIndex 越界则归零 ---
        if (this.currentIndex >= this.resolvedItems.length) {
            this.currentIndex = 0;
            this.emit('update:modelValue', this.currentIndex);
        }
    }

    /**
     * --- 跳转到指定幻灯片 ---
     * @param index 目标幻灯片索引
     */
    public go(index: number): void {
        const n = this.resolvedItems.length;
        if (n === 0) {
            return;
        }
        if (this.propBoolean('loop')) {
            // --- 取模保证 index 在 [0, n) 范围内 ---
            index = ((index % n) + n) % n;
        }
        else {
            if (index < 0) {
                index = 0;
            }
            else if (index >= n) {
                index = n - 1;
            }
        }
        if (index === this.currentIndex) {
            return;
        }
        this.currentIndex = index;
        this.emit('update:modelValue', this.currentIndex);
        this.emit('changed');
        // --- 用户交互后重置自动播放计时器 ---
        if (this.autoTimer !== 0) {
            this._stopAutoplay();
            this._startAutoplay();
        }
    }

    /** --- 切换到上一张 --- */
    public prev(): void {
        this.go(this.currentIndex - 1);
    }

    /** --- 切换到下一张 --- */
    public next(): void {
        this.go(this.currentIndex + 1);
    }

    /**
     * --- 处理轨道拖拽开始事件 ---
     * @param e 指针事件
     */
    public dragStart(e: PointerEvent): void {
        if (this.resolvedItems.length <= 1) {
            return;
        }
        this.isAni = false;
        const startX = e.clientX;
        const el = e.currentTarget as HTMLElement;
        el.setPointerCapture(e.pointerId);

        const onMove = (me: PointerEvent): void => {
            this.dragOffset = me.clientX - startX;
        };

        const onEnd = (): void => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onEnd);
            el.removeEventListener('pointercancel', onEnd);
            const threshold = this.wrapWidth * 0.3;
            const offset = this.dragOffset;
            this.dragOffset = 0;
            this.isAni = true;
            if (offset < -threshold) {
                this.next();
            }
            else if (offset > threshold) {
                this.prev();
            }
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onEnd);
        el.addEventListener('pointercancel', onEnd);
    }

    /** --- 启动自动播放 --- */
    private _startAutoplay(): void {
        if (this.autoTimer !== 0) {
            return;
        }
        const interval = this.propInt('interval');
        this.autoTimer = clickgo.task.createTimer(this, () => {
            this.next();
        }, interval > 0 ? interval : 3000);
    }

    /** --- 停止自动播放 --- */
    private _stopAutoplay(): void {
        if (this.autoTimer === 0) {
            return;
        }
        clickgo.task.removeTimer(this, this.autoTimer);
        this.autoTimer = 0;
    }

    public onMounted(): void {
        // --- 监听 wrap 宽度以支持响应式拖拽偏移换算 ---
        clickgo.dom.watchSize(this, this.element, () => {
            this.wrapWidth = this.element.offsetWidth;
        }, true);

        // --- 初始化当前索引 ---
        this.currentIndex = this.propInt('modelValue');

        this.watch('modelValue', () => {
            const n = this.propInt('modelValue');
            if (n === this.currentIndex) {
                return;
            }
            this.currentIndex = n;
        });

        this.watch('autoplay', () => {
            if (this.propBoolean('autoplay')) {
                this._startAutoplay();
            }
            else {
                this._stopAutoplay();
            }
        });

        this.watch('items', async () => {
            await this.resolveItems();
        }, {
            'deep': true,
            'immediate': true
        });

        if (this.propBoolean('autoplay')) {
            this._startAutoplay();
        }
    }

    public onUnmounted(): void {
        this._stopAutoplay();
    }

}
