export let methods = {
    setGlobalCursor: function(this: IVueForm, type?: string): void {
        clickgo.dom.setGlobalCursor(type);
    },
    isMouseAlsoTouchEvent: function(this: IVueForm, e: MouseEvent | TouchEvent): void {
        clickgo.dom.isMouseAlsoTouchEvent(e);
    }
};
