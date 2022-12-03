import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'selection': boolean | string;
        'gesture': string[] | string;

        'scrollLeft': number | string;
        'scrollTop': number | string;

        'data': any[] | number;
        'sizes': Record<string, number | undefined>;
    } = {
            'direction': 'h',
            'selection': false,
            'gesture': [],

            'scrollLeft': 0,
            'scrollTop': 0,

            'data': [],
            'sizes': {}
        };

    /** --- 要显示的项目起、终下标 --- */
    public showPos = {
        'start': 0,
        'end': 9
    };

    /** --- 当前框选的部分起终下标 --- */
    public selectPos = {
        'start': 0,
        'end': 0
    };

    /** --- 每项的起终像素 --- */
    public pos: Array<{
        'start': number;
        'end': number;
    }> = [];

    /** --- 未定义像素的对象的胖度（计算 dom 得出） --- */
    public size: number = 0;

    /** --- 总胖度 --- */
    public length = 0;

    /** --- flow 的 scroll left --- */
    public scrollLeftData = 0;

    /** --- flow 的 scroll top --- */
    public scrollTopData = 0;

    /** --- flow 的 client width --- */
    public clientWidth = 0;

    /** --- flow 的 client height --- */
    public clientHeight = 0;

    /** --- watch 的最外层的 padding 的四个距离 --- */
    public padding = {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
    };

    /**
     * --- 格式化后的 data，主要针对 data 传输的是个 number 的情况 ---
     */
    public get dataFormat(): any[] {
        if (typeof this.props.data !== 'number') {
            return this.props.data;
        }
        const list: any[] = [];
        for (let i = 1; i <= this.props.data; ++i) {
            list.push(i);
        }
        return list;
    }

    /**
     * --- 获取同方向的 scroll 值 ---
     */
    public get scroll(): number {
        return this.props.direction === 'v' ? this.scrollTopData : this.scrollLeftData;
    }

    /**
     * --- 获取同方向的 client 值 ---
     */
    public get client(): number {
        return this.props.direction === 'v' ? this.clientHeight : this.clientWidth;
    }

    /**
     * --- 获取单虚拟项的 element 的 style 值 ---
     */
    public get itemStyle(): any {
        return (index: number): any => {
            return {
                'left': (this.props.direction === 'v' ?
                    this.padding.left :
                    (this.pos[index] ?
                        this.pos[index].start :
                        '0'
                    )
                ) as string + 'px',
                'top': (this.props.direction === 'v' ?
                    (this.pos[index] ?
                        this.pos[index].start :
                        '0'
                    ) :
                    this.padding.top
                ) as string + 'px',
                'min-width': (this.props.direction === 'v' ?
                    `calc(100% - ${this.padding.left + this.padding.right}px)` :
                    undefined
                ),
                'min-height': (this.props.direction === 'v' ?
                    undefined :
                    `calc(100% - ${this.padding.top + this.padding.bottom}px)`
                ),
                'display': this.props.direction === 'v' ? undefined : 'flex'
            };
        };
    }

    // --- method ---

    /**
     * ---- 供外部调用的获取某项的 start 和 end 像素 ---
     * @param val 项下标
     */
    public getPos(val: number): { 'start': number; 'end': number; } {
        return this.pos[val];
    }

    /**
     * --- 判断一个 item 项是否在一个 area 内 ---
     * @param i 项 index
     * @param area 区域像素
     */
    public inArea(i: number, area: { 'start': number; 'end': number; }): boolean {
        const pos = this.pos[i];
        if (!pos) {
            return false;
        }
        if ((pos.end > area.start) && (pos.start < area.end)) {
            return true;
        }
        return false;
    }

    /**
     * --- 根据一个旧 pos 和新 area，来获得一个新在 area 当中的 pos 段 ---
     * @param pos 旧 pos 的 item index 段
     * @param area 区域的像素段
     * @returns 新 pos 的 item index 段
     */
    public getNewPos(pos: { 'start': number; 'end': number; }, area: { 'start': number; 'end': number; }): { 'start': number; 'end': number; } {
        const rtn = { 'start': -1, 'end': -1 };
        /** --- 起项是否在新 area 区域内 --- */
        const startShow = this.inArea(pos.start, area);
        // --- 检测起始 ---
        if (startShow) {
            rtn.start = pos.start;
            // --- 起项在区域内，则往上找，看看上面还有没有显示 ---
            for (let i = pos.start - 1; i >= 0; --i) {
                if (this.inArea(i, area)) {
                    rtn.start = i;
                    continue;
                }
                // --- 一旦碰到没找到的，意味着到底了 ---
                break;
            }
        }
        else {
            // --- 起项不在区域内 ---
            let start = this.pos[pos.start];
            if (!start) {
                // --- 起项不存在 ---
                if (pos.start === 0 || !this.pos[0]) {
                    return { 'start': 0, 'end': 9 };
                }
                pos.start = 0;
                start = this.pos[0];
            }
            if (area.start > start.start) {
                // --- 区域顶部大于原起项的顶部 ---
                // --- 向下找 ---
                for (let i = pos.start + 1; i < this.dataFormat.length; ++i) {
                    if (!this.inArea(i, area)) {
                        continue;
                    }
                    // --- 找到了，直接结束 ---
                    rtn.start = i;
                    break;
                }
            }
            else {
                // --- 区域顶部小于等于原起项的顶部 ---
                // --- 向上找 ---
                let found = false;
                for (let i = pos.start - 1; i >= 0; --i) {
                    if (!this.inArea(i, area)) {
                        if (found) {
                            // --- 找到了后又没找到了意味着到底了 ---
                            break;
                        }
                        continue;
                    }
                    // --- 找到了 ---
                    if (!found) {
                        found = true;
                    }
                    rtn.start = i;
                    if (rtn.end === -1) {
                        rtn.end = i;
                    }
                }
            }
        }
        if (rtn.end > -1) {
            return rtn;
        }
        // --- 要找终项 ---
        if (!this.pos[pos.end]) {
            // --- 终项不存在，指定为起项 ---
            pos.end = rtn.start;
        }
        const endShow = this.inArea(pos.end, area);
        if (endShow) {
            rtn.end = pos.end;
            // --- 终项在区域内，则往下找，看看下面还有没有显示 ---
            for (let i = pos.end + 1; i < this.dataFormat.length; ++i) {
                if (this.inArea(i, area)) {
                    rtn.end = i;
                    continue;
                }
                // --- 一旦碰到没找到的，意味着到底了 ---
                break;
            }
        }
        else {
            // --- 终项不在区域内 ---
            const end = this.pos[pos.end];
            if (area.end < end.end) {
                // --- 区域底部小于终项的底部 ---
                // --- 向上找 ---
                for (let i = pos.end - 1; i >= 0; --i) {
                    if (!this.inArea(i, area)) {
                        continue;
                    }
                    // --- 找到了，直接结束 ---
                    rtn.end = i;
                    break;
                }
            }
            else {
                // --- 区域底部大于等于终项的底部 ---
                // --- 向下找 ---
                let found = false;
                for (let i = pos.end + 1; i < this.dataFormat.length; ++i) {
                    if (!this.inArea(i, area)) {
                        if (found) {
                            // --- 找到了后又没找到了意味着到底了 ---
                            break;
                        }
                        continue;
                    }
                    // --- 找到了 ---
                    if (!found) {
                        found = true;
                    }
                    rtn.end = i;
                }
            }
        }
        return rtn;
    }

    /**
     * --- 重新计算单项胖度和总 pos 位置 ---
     */
    public refreshSize(): void {
        // --- 计算通用胖度 ---
        const el: HTMLElement | null = this.element.querySelector('[data-cg-size="same"]');
        if (el) {
            this.size = this.props.direction === 'h' ? el.offsetWidth : el.offsetHeight;
        }

        // --- 重置所有项的 pos ---
        this.pos = [];
        /** --- 已计算的胖度 --- */
        this.length = 0;
        const padding = this.props.direction === 'h' ? this.padding.left : this.padding.top;
        for (let i = 0; i < this.dataFormat.length; ++i) {
            /** --- 当前项的胖度 --- */
            const isize = this.props.sizes[i] ?? this.size;
            this.pos.push({
                'start': this.length + padding,
                'end': this.length + isize + padding
            });
            this.length += isize;
        }
        this.reShow();
    }

    /**
     * --- 根据视图情况决定显示哪些隐藏哪些 ---
     */
    public reShow(): void {
        const rtn = this.getNewPos(this.showPos, {
            'start': this.scroll - 20,
            'end': this.scroll + this.client + 20
        });
        this.showPos.start = rtn.start;
        this.showPos.end = rtn.end;
    }

    /**
     * ---- scroll 事件响应 ---
     * @param val 响应值
     * @param pos 响应方向
     */
    public updateScrollOffset(val: number, pos: 'left' | 'top'): void {
        if (pos === 'left') {
            this.emit('update:scrollLeft', val);
            this.scrollLeftData = val;
            if (this.props.direction === 'h') {
                this.reShow();
            }
        }
        else {
            this.emit('update:scrollTop', val);
            this.scrollTopData = val;
            if (this.props.direction === 'v') {
                this.reShow();
            }
        }
    }

    public clientwidth(v: number): void {
        this.clientWidth = v;
        if (this.props.direction === 'h') {
            this.reShow();
        }
    }

    public clientheight(v: number): void {
        this.clientHeight = v;
        if (this.props.direction === 'v') {
            this.reShow();
        }
    }

    public onSelect(area: Record<string, number>): void {
        const offset = this.props.direction === 'v' ? area.y : area.x;
        const length = this.props.direction === 'v' ? area.height : area.width;
        const rtn = this.getNewPos(this.selectPos, {
            'start': offset,
            'end': offset + length
        });
        this.selectPos.start = rtn.start;
        this.selectPos.end = rtn.end;
        area.start = rtn.start;
        area.end = rtn.end;
    }

    public onMounted(): void {
        this.watch('dataFormat', (): void => {
            this.refreshSize();
        }, {
            'deep': true
        });
        this.watch('direction', (): void => {
            this.refreshSize();
        });
        // --- watch props 的 scroll 项 ---
        this.watch('scrollLeft', (): void => {
            if (this.props.direction === 'h' && this.scrollLeftData !== this.propInt('scrollLeft')) {
                this.scrollLeftData = this.propInt('scrollLeft');
                this.reShow();
            }
        });
        this.watch('scrollTop', (): void => {
            if (this.props.direction === 'v' && this.scrollTopData !== this.propInt('scrollTop')) {
                this.scrollTopData = this.propInt('scrollTop');
                this.reShow();
            }
        });
        this.watch('sizes', (): void => {
            this.refreshSize();
        });
        // --- 监听 padding ---
        clickgo.dom.watchStyle(this.element, ['padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'font'], (n, v) => {
            switch (n) {
                case 'padding-top': {
                    this.padding.top = parseInt(v);
                    break;
                }
                case 'padding-right': {
                    this.padding.right = parseInt(v);
                    break;
                }
                case 'padding-bottom': {
                    this.padding.bottom = parseInt(v);
                    break;
                }
                case 'padding-left': {
                    this.padding.left = parseInt(v);
                    break;
                }
            }
            this.refreshSize();
        }, true);
        // --- 监听 content 发生的变动，如果不监听，可能导致内容撑开了元素，但是行高没有改变 ---
        clickgo.dom.watch(this.element, () => {
            let el: HTMLElement | null = null;
            for (const child of this.element.children) {
                if ((child as HTMLElement).dataset.cgSize !== 'same') {
                    continue;
                }
                el = child as HTMLElement;
                break;
            }
            if (!el) {
                return;
            }
            const size = this.props.direction === 'h' ? el.offsetWidth : el.offsetHeight;
            if (size === this.size) {
                return;
            }
            // --- refresh ---
            this.refreshSize();
        }, 'childsub');
    }

}
