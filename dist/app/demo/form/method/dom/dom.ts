export const data = {
    'bindLongText': false,
    'moveLeft': 0,
    'moveTop': 0,
    'moveWidth': 25,
    'moveHeight': 25,
    'bindGestureText': '',
    'bindGestureWheelText': ''
};

export const computed = {
    'isMove': function(): boolean {
        return clickgo.dom.is.move;
    }
};

export const methods = {
    setGlobalCursor: function(this: IVForm, type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    },
    hasTouchButMouse: function(this: IVForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.hasTouchButMouse(e);
    },
    getStyleCount: function(this: IVForm): void {
        this.cgDialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    },
    fullscreen: function(this: IVForm): void {
        clickgo.dom.fullscreen();
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
                (this.moveLeft as number) += ox;
                (this.moveTop as number) += oy;
            }
        });
    },
    bindGesture: function(this: IVForm, e: MouseEvent | TouchEvent): void {
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
    bindGestureWheel: function(this: IVForm, e: WheelEvent): void {
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
};
