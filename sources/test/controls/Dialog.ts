export let data = {
    dialogVisible: false
};

export let methods = {
    showLoading: async function() {
        DeskRT.showMask();
        await DeskRT.sleep(1000);
        DeskRT.hideMask();
    }
};