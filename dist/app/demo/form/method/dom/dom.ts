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

    public get isMove(): boolean {
        return clickgo.dom.is.move;
    }

    public get isShift(): boolean {
        return clickgo.dom.is.shift;
    }

    public get isCtrl(): boolean {
        return clickgo.dom.is.ctrl;
    }

    public setGlobalCursor(type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    }

    public hasTouchButMouse(e: MouseEvent | TouchEvent): void {
        clickgo.form.dialog(clickgo.dom.hasTouchButMouse(e) ? 'true' : 'false').catch((e) => { throw e; });
    }

    public getStyleCount(): void {
        clickgo.form.dialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    }

    public getSize(): void {
        clickgo.form.dialog(JSON.stringify(clickgo.dom.getSize(this.refs.getSize.$el))).catch((e) => { throw e; });
    }

    public watchSize(): void {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this.refs.watchSize.$el, (size) => {
                clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.refs.watchSize.$el);
        }
    }

    public wwatch(): void {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this.refs.watch.$el, () => {
                clickgo.form.dialog('Changed.').catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatch(this.refs.watch.$el);
        }
    }

    public isWatchStyle(): void {
        clickgo.form.dialog(clickgo.dom.isWatchStyle(this.refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    }

    public bindGesture(e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom'],
            handler: (dir) => {
                this.bindGestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                const handler = async (): Promise<void> => {
                    await clickgo.tool.sleep(500);
                    this.bindGestureText = '';
                };
                handler().catch((e) => {
                    console.log(e);
                });
            }
        });
    }

    public bindGestureWheel(e: WheelEvent): void {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom', 'left', 'right'],
            handler: (dir) => {
                this.bindGestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                const handler = async (): Promise<void> => {
                    await clickgo.tool.sleep(500);
                    this.bindGestureWheelText = '';
                };
                handler().catch((e) => {
                    console.log(e);
                });
            }
        });
    }

    public bindLong(): void {
        clickgo.form.dialog('Press and hold this button.').catch((e) => { throw e; });
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
            move: (ox: number, oy: number): void => {
                this.moveLeft += ox;
                this.moveTop += oy;
            }
        });
    }

    public fullscreen(): void {
        clickgo.dom.fullscreen();
    }

    public onMounted(): void {
        clickgo.dom.watchStyle(this.refs.watchStyle.$el, 'font-size', (n, v) => {
            clickgo.form.dialog('name: ' + n + ', value: ' + v).catch((e) => { throw e; });
        });
    }

}
