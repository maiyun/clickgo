export let data = {
    'bindLongText': false,
    'moveLeft': 0,
    'moveTop': 0,
    'moveWidth': 25,
    'moveHeight': 25,
    'bindGestureText': '',
    'bindGestureWheelText': ''
};

export let computed = {
    'isMove': function(): boolean {
        return clickgo.dom.is.move;
    }
};

export let methods = {
    setGlobalCursor: function(this: IVForm, type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    },
    hasTouchButMouse: function(this: IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.hasTouchButMouse(e);
    },
    getStyleCount: function(this: IVForm): void {
        this.cgDialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    },
    bindLong: function(this: IVForm): void {
        this.cgDialog('Press and hold this button.').catch((e) => { throw e; });
    },
    bindLongDown: function(this: IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindLong(e, async () => {
            this.bindLongText = true;
            await clickgo.tool.sleep(500);
            this.bindLongText = false;
        });
    },
    bindMoveDown: function(this: IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindMove(e, {
            'areaObject': e.currentTarget as HTMLElement,
            'object': this.$refs.move,
            move: (ox: number, oy: number): void => {
                this.moveLeft += ox;
                this.moveTop += oy;
            }
        });
    },
    bindGesture: function(this: IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom'],
            handler: async (dir) => {
                this.bindGestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                await clickgo.tool.sleep(500);
                this.bindGestureText = '';
            }
        });
    },
    bindGestureWheel: function(this: IVForm, e: WheelEvent): void {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom', 'left', 'right'],
            handler: async (dir) => {
                this.bindGestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                await clickgo.tool.sleep(500);
                this.bindGestureWheelText = '';
            }
        });
    }
};
