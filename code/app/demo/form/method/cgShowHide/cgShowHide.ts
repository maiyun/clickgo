export let methods = {
    cgShowHide: function(this: IVueForm): void {
        this.cgHide();
        this.cgCreateTimer(() => {
            this.cgShow();
        }, 1000);
    }
};
