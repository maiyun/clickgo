import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'watchSizeText': false,
    'watchSizeHeight': true,
    'watchText': false,
    'watchInner': true,
    'watchStyleChange': true,
    'bindGestureText': '',
    'bindGestureWheelText': '',
    'bindLongText': false,
    'moveLeft': 0,
    'moveTop': 0,
    'moveWidth': 25,
    'moveHeight': 25,
};

export const computed = {
    'isMove': function(): boolean {
        return clickgo.dom.is.move;
    },
    'isShift': function(): boolean {
        return clickgo.dom.is.shift;
    },
    'isCtrl': function(): boolean {
        return clickgo.dom.is.ctrl;
    }
};

export const methods = {
    setGlobalCursor: function(this: types.IVForm, type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    },
    hasTouchButMouse: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.form.dialog(clickgo.dom.hasTouchButMouse(e) ? 'true' : 'false').catch((e) => { throw e; });
    },
    getStyleCount: function(this: types.IVForm): void {
        clickgo.form.dialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    },
    getSize: function(this: types.IVForm): void {
        clickgo.form.dialog(JSON.stringify(clickgo.dom.getSize(this.$refs.getSize.$el))).catch((e) => { throw e; });
    },
    watchSize: function(this: types.IVForm): void {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this.$refs.watchSize.$el, (size) => {
                clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.$refs.watchSize.$el);
        }
    },
    watch: function(this: types.IVForm): void {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this.$refs.watch.$el, () => {
                clickgo.form.dialog('Changed.').catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatch(this.$refs.watch.$el);
        }
    },
    isWatchStyle: function(this: types.IVForm): void {
        clickgo.form.dialog(clickgo.dom.isWatchStyle(this.$refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    },
    bindGesture: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
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
    },
    bindGestureWheel: function(this: types.IVForm, e: WheelEvent): void {
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
    },
    bindLong: function(this: types.IVForm): void {
        clickgo.form.dialog('Press and hold this button.').catch((e) => { throw e; });
    },
    bindLongDown: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindLong(e, async () => {
            this.bindLongText = true;
            await clickgo.tool.sleep(500);
            this.bindLongText = false;
        });
    },
    bindDragDown: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindDrag(e, {
            'el': this.$refs.bindDrag,
            'data': 'bindDragDownTest'
        });
    },
    dragEnter: async function(this: types.IVForm, e: Event): Promise<void> {
        (e.target as HTMLElement).innerText = 'enter';
        await clickgo.tool.sleep(200);
        (e.target as HTMLElement).innerText = '';
    },
    dragLeave: async function(this: types.IVForm, e: Event): Promise<void> {
        (e.target as HTMLElement).innerText = 'leave';
        await clickgo.tool.sleep(200);
        (e.target as HTMLElement).innerText = '';
    },
    drop: async function(this: types.IVForm, e: Event): Promise<void> {
        (e.target as HTMLElement).innerText = 'drop';
        await clickgo.tool.sleep(500);
        (e.target as HTMLElement).innerText = '';
    },
    bindMoveDown: function(this: types.IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindMove(e, {
            'areaObject': e.currentTarget as HTMLElement,
            'object': this.$refs.move,
            move: (ox: number, oy: number): void => {
                (this.moveLeft as number) += ox;
                (this.moveTop as number) += oy;
            }
        });
    },
    fullscreen: function(this: types.IVForm): void {
        clickgo.dom.fullscreen();
    }
};

export const mounted = function(this: types.IVForm): void {
    clickgo.dom.watchStyle(this.$refs.watchStyle.$el, 'font-size', (n, v) => {
        clickgo.form.dialog('name: ' + n + ', value: ' + v).catch((e) => { throw e; });
    });
};
