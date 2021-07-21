export let computed = {
    'isMove': function(): boolean {
        return clickgo.dom.is.move;
    }
};

export let methods = {
    setGlobalCursor: function(this: IVueForm, type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    },
    isMouseAlsoTouchEvent: function(this: IVueForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.isMouseAlsoTouchEvent(e);
    },
    getStyleCount: function(this: IVueForm): void {
        this.cgDialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    }
};
