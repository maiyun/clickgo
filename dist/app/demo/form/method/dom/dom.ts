export let data = {
    'bindLongText': false,
    'moveLeft': 0,
    'moveTop': 0,
    'moveWidth': 25,
    'moveHeight': 25,
    'bindGestureText': ''
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
            'top': async () => {
                this.bindGestureText = 'Top';
                await clickgo.tool.sleep(500);
                this.bindGestureText = '';
            },
            'right': async () => {
                this.bindGestureText = 'Right';
                await clickgo.tool.sleep(500);
                this.bindGestureText = '';
            },
            'bottom': async () => {
                this.bindGestureText = 'Bottom';
                await clickgo.tool.sleep(500);
                this.bindGestureText = '';
            },
            'left': async () => {
                this.bindGestureText = 'Left';
                await clickgo.tool.sleep(500);
                this.bindGestureText = '';
            }
        });
    }
};
