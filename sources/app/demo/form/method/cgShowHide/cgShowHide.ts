export let methods = {
    cgShowHide: function(this: IVueForm): void {
        this.cgHide();
        setTimeout(() => {
            this.cgShow();
        }, 1000);
    }
};
