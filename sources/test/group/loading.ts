export let data = {
    loading: false
};

export let methods = {
    onOpen: function(this: any) {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }
};