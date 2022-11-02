import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'direction': 'h',

        'scrollLeft': -1,
        'scrollTop': -1,
        'content': '',
        'selection': false,
        'same': false,
        'solo': true,

        'data': [],
        'itemsSize': []
    };

    /** --- watch 的最外层的 padding，设置到内层 --- */
    public padding = '';

    /** --- watch 的最外层的 padding 的四个距离 --- */
    public paddingChild = {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
    };

    /** --- 要显示的项目起、终下标 --- */
    public showPos = {
        'start': 0,
        'end': 0
    };

    /** --- 当前框选的部分起终下标 --- */
    public selectPos = {
        'start': 0,
        'end': 0
    };

    /** --- 每项的起终像素 --- */
    public itemsPos: Array<{
        'start': number;
        'end': number;
    }> = [];

    /** --- 当前正在需要重新计算起终像素的项的下标序列 --- */
    public needItemsComp: number[] = [];

    public scrollLeftEmit = 0;

    public scrollTopEmit = 0;

    public length = 0;

    public lengthWidth = 0;

    public lengthHeight = 0;

    public client = 0;

    public clientWidth = 0;

    public clientHeight = 0;

    public refreshCount = 0;

    public lengthInit = false;

    /** --- reshow 是否在正在执行的过程中 --- */
    public reShowing = false;

    public get isSame(): boolean {
        return clickgo.tool.getBoolean(this.props.same);
    }

    public get isSelection(): boolean {
        return clickgo.tool.getBoolean(this.props.selection);
    }

    /** --- 是否没有嵌套拖动层，有的话 solo 需要设置为 false --- */
    public get isSolo(): boolean {
        return clickgo.tool.getBoolean(this.props.solo);
    }

    public get dataComp(): any[] {
        if (typeof this.props.data !== 'number') {
            return this.props.data;
        }
        const list: any[] = [];
        for (let i = 1; i <= this.props.data; ++i) {
            list.push(i);
        }
        return list;
    }

    public get scrollOffset(): number {
        return this.props.direction === 'v' ? this.scrollTopEmit : this.scrollLeftEmit;
    }

    public get itemStyle(): any {
        return (index: number): any => {
            return {
                'left': (this.props.direction === 'v' ?
                    this.paddingChild.left :
                    (this.itemsPos[index] ?
                        this.itemsPos[index].start :
                        '0'
                    )
                ) as string + 'px',
                'top': (this.props.direction === 'v' ?
                    (this.itemsPos[index] ?
                        this.itemsPos[index].start :
                        '0'
                    ) :
                    this.paddingChild.top
                ) as string + 'px',
                'min-width': (this.props.direction === 'v' ?
                    `calc(100% - ${this.paddingChild.left + this.paddingChild.right}px)` :
                    undefined
                ),
                'min-height': (this.props.direction === 'v' ?
                    undefined :
                    `calc(100% - ${this.paddingChild.top + this.paddingChild.bottom}px)`
                )
            };
        };
    }

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    // --- method ---

    // --- 重新获取宽度高度 ---
    public async refreshView(): Promise<void> {
        const nowCount = ++this.refreshCount;
        // let date = Date.now();

        let lengthWidth: number = this.paddingChild.left;
        let lengthHeight: number = this.paddingChild.top;
        if (this.dataComp.length === 0) {
            // --- 没有数据 ---
            this.lengthWidth = lengthWidth + this.paddingChild.right;
            this.lengthHeight = lengthHeight + this.paddingChild.bottom;
            this.length = this.props.direction === 'v' ? this.lengthHeight : this.lengthWidth;
            return;
        }

        await clickgo.tool.sleep(0);
        if (nowCount !== this.refreshCount) {
            // --- 重复执行，以最后一次执行为准 ---
            return;
        }

        /** --- 数据总数 --- */
        const maxCursor = this.dataComp.length;
        /** --- 当前位置 --- */
        let cursor = 0;
        /** --- 另一边的最大值 --- */
        let anotherMax: number = 0;
        /** --- 独立的 item 的 size --- */
        const itemsSize: number[] = [];
        /** --- item 的 size 别名对应的 size 数值 --- */
        const itemsSizeAlias: Record<string, number> = {};
        // --- 循环建立 itemsSize ---
        while (true) {
            if (nowCount !== this.refreshCount) {
                // --- 重复执行，以最后一次执行为准 ---
                return;
            }
            /** --- 获取要计算的值 --- */
            const needItemsComp = [];
            for (let i = cursor; i < maxCursor; ++i) {
                const type = typeof this.props.itemsSize[i];
                if (type === 'number') {
                    // --- 用户已经定义了 size，无需计算 ---
                    cursor = i;
                    continue;
                }
                if (type === 'string') {
                    // --- 需要计算 size，但有别名，多个同用一个 size ---
                    if (itemsSizeAlias[this.props.itemsSize[i]] !== undefined) {
                        // --- 已经计算过了，无需再次计算 ---
                        cursor = i;
                        continue;
                    }
                    else {
                        // --- 没有计算过，但相同的不会计算两次 ---
                        itemsSizeAlias[this.props.itemsSize[i]] = -1;
                    }
                }
                else if (this.isSame) {
                    if (itemsSizeAlias['cg-same'] !== undefined) {
                        // --- same 计算过了，无需再次计算 ---
                        cursor = i;
                        continue;
                    }
                    else {
                        // --- 标注一下，下次不要再次计算这个了
                        itemsSizeAlias['cg-same'] = -1;
                    }
                }
                // --- 需要计算 size ---
                needItemsComp.push(i);
                if (needItemsComp.length === 50) {
                    cursor = i;
                    break;
                }
                cursor = i;
            }
            this.needItemsComp = needItemsComp;
            // --- 调整后等待视图响应 ---
            await this.nextTick();
            // await clickgo.tool.sleep(34);
            if (nowCount !== this.refreshCount) {
                // --- 重复执行，以最后一次执行为准 ---
                return;
            }
            if (!this.refs.comp || !this.refs.comp.offsetParent) {
                // --- 当前被卸载了 ---
                return;
            }
            // --- 遍历 comp items ---
            for (let i = 0; i < this.refs.comp.children.length; ++i) {
                const item = this.refs.comp.children.item(i) as HTMLElement;
                const rect = item.getBoundingClientRect();
                /** --- items size cursor --- */
                const theCursor = parseInt(item.dataset.cursor!);
                let size = 0;
                if (this.props.direction === 'v') {
                    size = rect.height;
                    if (anotherMax < rect.width) {
                        anotherMax = rect.width;
                    }
                }
                else {
                    size = rect.width;
                    if (anotherMax < rect.height) {
                        anotherMax = rect.height;
                    }
                }
                // --- 别名 ---
                if (typeof this.props.itemsSize[theCursor] === 'string') {
                    itemsSizeAlias[itemsSize[theCursor]] = size;
                }
                else if (this.isSame) {
                    itemsSizeAlias['cg-same'] = size;
                }
                else {
                    itemsSize[theCursor] = size;
                }
            }
            if (cursor + 1 === maxCursor) {
                break;
            }
            ++cursor;
        }
        // --- 遍历 itemsSize 检查哪些还没应用 size ---
        // --- 同时组合 itemsPos ---
        const itemsPos = [];
        for (let i = 0; i < maxCursor; ++i) {
            let size = 0;
            if (this.props.itemsSize[i] !== undefined) {
                const type = typeof this.props.itemsSize[i];
                if (type === 'number') {
                    size = this.props.itemsSize[i];
                }
                else {
                    size = itemsSizeAlias[this.props.itemsSize[i]];
                }
            }
            else if (this.isSame) {
                size = itemsSizeAlias['cg-same'];
            }
            else {
                size = itemsSize[i];
            }
            const start = this.props.direction === 'v' ? lengthHeight : lengthWidth;
            const end = start + size;
            itemsPos.push({
                'start': start,
                'end': end
            });
            if (this.props.direction === 'v') {
                lengthHeight += size;
            }
            else {
                lengthWidth += size;
            }
        }
        // console.log('xxx1', Date.now() - date);
        // --- 增加另一边的边长 ---
        if (this.props.direction === 'v') {
            lengthWidth += anotherMax;
        }
        else {
            lengthHeight += anotherMax;
        }
        // --- 加末尾的 padding ---
        lengthWidth += this.paddingChild.right;
        lengthHeight += this.paddingChild.bottom;
        this.lengthWidth = lengthWidth;
        this.lengthHeight = lengthHeight;
        this.length = this.props.direction === 'v' ? this.lengthHeight : this.lengthWidth;
        this.itemsPos = itemsPos;
        if (!this.lengthInit) {
            this.lengthInit = true;
            // --- 延迟让 length 的变更生效，让 view 可以监测到并重置他的 lengthWidth 逻辑 ---
            await clickgo.tool.sleep(34);
            // --- length 计算完毕后初次进行上层设定值的传导 ---
            if (this.props.scrollLeft >= 0) {
                this.scrollLeftEmit = this.props.scrollLeft;
                this.refs.view.goScroll(this.props.scrollLeft, 'left');
            }
            if (this.props.scrollTop >= 0) {
                this.scrollTopEmit = this.props.scrollTop;
                this.refs.view.goScroll(this.props.scrollTop, 'top');
            }
        }
        this.emit('itemsposchange');
        this.reShow();
    }

    /** --- 控制显示和隐藏 --- */
    public refreshPos(pos: { 'start': number; 'end': number; }, area: { 'start': number; 'end': number; }): { 'start': number; 'end': number; } {
        if (this.length <= area.start) {
            return {
                'start': -1,
                'end': -1
            };
        }
        // let date = Date.now();
        const rtn = { 'start': pos.start, 'end': pos.end };
        /** --- 是否要大找 --- */
        let needFind: boolean = false;
        const startShow = this.isInArea(rtn.start, area);
        const endShow = this.isInArea(rtn.end, area);
        // --- 检测起始 ---
        if (startShow) {
            // --- 往上找，看看上面还有没有显示 ---
            for (let i = rtn.start - 1; i >= 0; --i) {
                if (this.isInArea(i, area)) {
                    rtn.start = i;
                    continue;
                }
                break;
            }
        }
        else {
            // --- 往下找三个看看 ---
            let found = false;
            const jmax = endShow ? 999 : 3;
            for (let i = rtn.start + 1, j = 0; i < this.dataComp.length && j < jmax; ++i, ++j) {
                if (!this.isInArea(i, area)) {
                    continue;
                }
                found = true;
                rtn.start = i;
                break;
            }
            if (!found) {
                needFind = true;
            }
        }
        // --- 检测终止 ---
        if (endShow) {
            // --- 往下找 ---
            for (let i = rtn.end + 1; i < this.dataComp.length; ++i) {
                if (this.isInArea(i, area)) {
                    rtn.end = i;
                    continue;
                }
                break;
            }
        }
        else {
            // --- 往上找三个看看 ---
            let found = false;
            const jmax = startShow ? 999 : 3;
            for (let i = rtn.end - 1, j = 0; i >= 0 && j < jmax; --i, ++j) {
                if (!this.isInArea(i, area)) {
                    continue;
                }
                found = true;
                rtn.end = i;
                break;
            }
            if (!found) {
                needFind = true;
            }
        }
        if (needFind) {
            // --- 是否已初次显示 ---
            let firstShow = false;
            if (!this.itemsPos[rtn.start]) {
                // --- 可能有移除的后，导致 rtn.start 没有 item ---
                rtn.start = 0;
                if (!this.itemsPos[rtn.start]) {
                    return { 'start': 0, 'end': 0 };
                }
            }
            if (area.start < this.itemsPos[rtn.start].start) {
                // --- 从后往前 ---
                for (let i = rtn.start; i >= 0; --i) {
                    if (this.isInArea(i, area)) {
                        // --- 肯定要显示 ---
                        if (!firstShow) {
                            firstShow = true;
                            rtn.end = i;
                        }
                        if (!this.dataComp[i - 1]) {
                            rtn.start = i;
                        }
                        continue;
                    }
                    // --- 在已经显示后才遇到不显示的，就直接结束 ---
                    if (firstShow) {
                        rtn.start = i + 1;
                        break;
                    }
                }
            }
            else {
                // --- 从前往后 ---
                for (let i = rtn.start; i < this.dataComp.length; ++i) {
                    if (this.isInArea(i, area)) {
                        // --- 肯定要显示 ---
                        if (!firstShow) {
                            firstShow = true;
                            rtn.start = i;
                        }
                        if (!this.dataComp[i + 1]) {
                            rtn.end = i;
                        }
                        continue;
                    }
                    // --- 在已经显示后才遇到不显示的，就直接结束 ---
                    if (firstShow) {
                        rtn.end = i - 1;
                        break;
                    }
                }
            }
        }
        // console.log('xxx', Date.now() - date);
        return rtn;
    }

    public reShow(): void {
        this.reShowing = true;
        const rtn = this.refreshPos(this.showPos, {
            'start': this.scrollOffset - 20,
            'end': this.scrollOffset + this.client + 20
        });
        this.showPos.start = rtn.start;
        this.showPos.end = rtn.end;
        this.nextTick().then(() => {
            this.reShowing = false;
        }).catch(() => {
            // --- Nothing ---
        });
    }

    public isInArea(i: number, area: { 'start': number; 'end': number; }): boolean {
        const pos = this.itemsPos[i];
        if (!pos) {
            return false;
        }
        if ((pos.end > area.start) && (pos.start < area.end)) {
            return true;
        }
        return false;
    }

    public updateScrollOffset(val: number, pos: 'left' | 'top'): void {
        // --- 接收 view 组件传递的 scroll-offset 更改事件 ---
        if (!this.lengthInit) {
            // --- length 还没初始化成功，不更新 scroll offset ---
            return;
        }
        if (pos === 'left') {
            this.scrollLeftEmit = val;
            this.emit('update:scrollLeft', val);
            if (this.props.direction === 'h') {
                this.reShow();
            }
        }
        else {
            this.scrollTopEmit = val;
            this.emit('update:scrollTop', val);
            if (this.props.direction === 'v') {
                this.reShow();
            }
        }
    }

    public onResize(val: number): void {
        this.client = val;
        this.emit('resize', val);
        if (this.props.direction === 'v') {
            this.clientHeight = val;
        }
        else {
            this.clientWidth = val;
        }
        if (!this.lengthInit) {
            return;
        }
        this.refreshView().catch((e) => { console.log(e); });
    }

    public onResizen(val: number): void {
        this.emit('resizen', val);
        if (this.props.direction === 'h') {
            this.clientHeight = val;
        }
        else {
            this.clientWidth = val;
        }
        this.refreshView().catch((e) => { console.log(e); });
    }

    public onChange(val: number): void {
        if (!this.lengthInit) {
            return;
        }
        this.emit('change', val);
    }

    public onSelect(area: Record<string, number>): void {
        const offset = this.props.direction === 'v' ? area.y : area.x;
        const length = this.props.direction === 'v' ? area.height : area.width;
        const rtn = this.refreshPos(this.selectPos, {
            'start': offset,
            'end': offset + length
        });
        this.selectPos.start = rtn.start;
        this.selectPos.end = rtn.end;
        area.start = rtn.start;
        area.end = rtn.end;
        this.emit('select', area);
    }

    public getPos(val: number): { 'start': number; 'end': number; } {
        return this.itemsPos[val];
    }

    public onMounted(): void {
        this.watch('data', (): void => {
            this.refreshView().catch((e) => { console.log(e); });
        }, {
            'deep': true
        });
        this.watch('direction', (): void => {
            this.refreshView().catch((e) => { console.log(e); });
        });
        this.watch('scrollLeft', (): void => {
            if (this.props.direction === 'h' && this.scrollLeftEmit !== this.props.scrollLeft && this.props.scrollLeft >= 0) {
                this.scrollLeftEmit = this.props.scrollLeft;
                this.reShow();
            }
        });
        this.watch('scrollTop', (): void => {
            if (this.props.direction === 'v' && this.scrollTopEmit !== this.props.scrollTop && this.props.scrollTop >= 0) {
                this.scrollTopEmit = this.props.scrollTop;
                this.reShow();
            }
        });

        // --- nest 内嵌闪烁是 mounted 导致 ---
        clickgo.dom.watchStyle(this.element, ['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'font'], (n, v) => {
            switch (n) {
                case 'padding': {
                    this.padding = v;
                    break;
                }
                case 'padding-top': {
                    this.paddingChild.top = parseInt(v);
                    break;
                }
                case 'padding-right': {
                    this.paddingChild.right = parseInt(v);
                    break;
                }
                case 'padding-bottom': {
                    this.paddingChild.bottom = parseInt(v);
                    break;
                }
                case 'padding-left': {
                    this.paddingChild.left = parseInt(v);
                    break;
                }
            }
            this.refreshView().catch((e) => { console.log(e); });
        }, true);
        // --- 监听 content 发生的变动，如果不监听，可能导致内容撑开了元素，但是行高没有改变（content 按钮的例子） ---
        clickgo.dom.watch(this.element, () => {
            if (this.reShowing) {
                return;
            }
            this.refreshView().catch((e) => { console.log(e); });
        }, 'childsub');
        /*
        let mo = new MutationObserver(() => {
            this.refreshView();
        });
        mo.observe(this.$refs.view.$el, {
            'attributeFilter': ['style', 'class'],
            'attributes': true
        });
        //*/
    }

}
