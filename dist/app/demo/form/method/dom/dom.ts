import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public watchSizeText = false;

    public watchSizeHeight = true;

    public watchText = false;

    public watchInner = true;

    public watchStyleChange = true;

    public bindGestureText = '';

    public bindGestureWheelText = '';

    public bindLongText = false;

    public moveLeft = 0;

    public moveTop = 0;

    public moveWidth = 25;

    public moveHeight = 25;

    public micWs: string = 'wss://127.0.0.1:8080/speaker';

    /** --- 说话中 --- */
    public micHuman = false;

    /** --- rms 值 --- */
    public micRms = 0;

    /** --- 麦克风状态，1-准备中,2-对讲中,3-关闭中 --- */
    public micState = 0;

    public async micClick(): Promise<void> {
        if (this.micState) {
            this.micState = 3;
            clickgo.dom.mic.stop();
            return;
        }
        this.micState = 1;
        // --- 开始对讲 ---
        const rtn = await clickgo.dom.mic.start(this.micWs, {
            onStart: () => {
                this.micState = 2;
            },
            onVoiceStart: () => {
                this.micHuman = true;
            },
            onVoiceEnd: () => {
                this.micHuman = false;
            },
            onProcess: (data) => {
                this.micRms = data.rms;
            },
            onStop: () => {
                this.micState = 0;
                this.micHuman = false;
                this.micRms = 0;
            },
        });
        if (rtn) {
            // --- 正确连接 ---
            return;
        }
        this.micState = 0;
        await clickgo.form.dialog(this, 'No microphone found.');
    }

    public get isMove(): boolean {
        return clickgo.dom.is.move;
    }

    public get isShift(): boolean {
        return clickgo.dom.is.shift;
    }

    public get isCtrl(): boolean {
        return clickgo.dom.is.ctrl;
    }

    public get isMeta(): boolean {
        return clickgo.dom.is.meta;
    }

    public get isFull(): boolean {
        return clickgo.dom.is.full;
    }

    public get isDark(): boolean {
        return clickgo.dom.is.dark;
    }

    public setGlobalCursor(type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    }

    public get isTransition(): boolean {
        return clickgo.dom.is.transition;
    }

    public setGlobalTransition(): void {
        clickgo.dom.setGlobalTransition(!this.isTransition);
    }

    public hasTouchButMouse(e: MouseEvent | TouchEvent): void {
        clickgo.form.dialog(this, clickgo.dom.hasTouchButMouse(e) ? 'true' : 'false').catch((e) => { throw e; });
    }

    public getStyleCount(): void {
        clickgo.form.dialog(this, clickgo.dom.getStyleCount(this, 'form').toString()).catch((e) => { throw e; });
    }

    public async getWatchSizeCount(taskId?: string): Promise<void> {
        await clickgo.form.dialog(this, clickgo.dom.getWatchSizeCount(taskId).toString());
    }

    public watchSize(): void {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this, this.refs.watchSize.$el, () => {
                clickgo.form.dialog(this, JSON.stringify({
                    'width': this.refs.watchSize.$el.offsetWidth,
                    'height': this.refs.watchSize.$el.offsetHeight
                })).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.refs.watchSize.$el);
        }
    }

    public watchPositionText = false;

    public watchPosition(): void {
        this.watchPositionText = !this.watchPositionText;
        if (this.watchPositionText) {
            clickgo.dom.watchPosition(this.refs.watchPosition.$el, (state) => {
                console.log('watchPosition', state);
            });
        }
        else {
            clickgo.dom.unwatchPosition(this.refs.watchPosition.$el);
        }
    }

    public wwatch(): void {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this, this.refs.watch.$el, () => {
                clickgo.form.dialog(this, 'Changed.').catch((e) => { throw e; });
            }, 'text');
        }
        else {
            clickgo.dom.unwatch(this, this.refs.watch.$el);
        }
    }

    public async getWatchCount(taskId?: string): Promise<void> {
        await clickgo.form.dialog(this, clickgo.dom.getWatchCount(taskId).toString());
    }

    public isWatchStyle(): void {
        clickgo.form.dialog(this, clickgo.dom.isWatchStyle(this.refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    }

    public getWatchInfoDisabled = false;

    public getWatchInfoText = '{}';

    public async getWatchInfo(): Promise<void> {
        this.getWatchInfoDisabled = true;
        for (let i = 0; i < 40; ++i) {
            const rtn = clickgo.dom.getWatchInfo();
            this.getWatchInfoText = JSON.stringify(rtn, undefined, 4);
            await clickgo.tool.sleep(500);
        }
        this.getWatchInfoDisabled = false;
    }

    public bindGesture(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            if (['top', 'bottom'].includes(dir)) {
                return 1;
            }
            return 0;
        }, async (dir): Promise<void> => {
            this.bindGestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
            await clickgo.tool.sleep(500);
            this.bindGestureText = '';
        });
    }

    public bindGestureWheel(e: WheelEvent): void {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            if (['top', 'bottom', 'left', 'right'].includes(dir)) {
                return 1;
            }
            return 0;
        }, async (dir) => {
            this.bindGestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
            await clickgo.tool.sleep(500);
            this.bindGestureWheelText = '';
        });
    }

    public bindLong(): void {
        clickgo.form.dialog(this, 'Press and hold this button.').catch((e) => { throw e; });
    }

    public bindLongDown(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindLong(e, async () => {
            this.bindLongText = true;
            await clickgo.tool.sleep(500);
            this.bindLongText = false;
        });
    }

    public bindDragDown(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindDrag(e, {
            'el': this.refs.bindDrag,
            'data': 'bindDragDownTest'
        });
    }

    public async dragEnter(e: Event): Promise<void> {
        (e.target as HTMLElement).innerText = 'enter';
        await clickgo.tool.sleep(200);
        (e.target as HTMLElement).innerText = '';
    }

    public async dragLeave(e: Event): Promise<void> {
        (e.target as HTMLElement).innerText = 'leave';
        await clickgo.tool.sleep(200);
        (e.target as HTMLElement).innerText = '';
    }

    public async drop(e: Event): Promise<void> {
        (e.target as HTMLElement).innerText = 'drop';
        await clickgo.tool.sleep(500);
        (e.target as HTMLElement).innerText = '';
    }

    public bindMoveDown(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindMove(e, {
            'areaObject': e.currentTarget as HTMLElement,
            'object': this.refs.move,
            move: (e, o): void => {
                this.moveLeft += o.ox;
                this.moveTop += o.oy;
            }
        });
    }

    public moveDown(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindDblClick(e, () => {
            this.moveWidth = this.moveWidth === 25 ? 50 : 25;
            this.moveHeight = this.moveHeight === 25 ? 50 : 25;
        });
    }

    public scaleX = 0;

    public scaleY = 0;

    public scaleS = 1;

    public bindScaleDown(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindScale(e, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
        });
    }

    public async fullscreen(): Promise<void> {
        await clickgo.dom.fullscreen();
    }

    public onMounted(): void {
        clickgo.dom.watchStyle(this.refs.watchStyle.$el, 'font-size', (n, v) => {
            clickgo.form.dialog(this, 'name: ' + n + ', value: ' + v).catch((e) => { throw e; });
        });
    }

}
