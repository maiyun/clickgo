import * as DeskRT from "deskrt";

export let data = {
    dialogVisible: false
};

export let methods = {
    showLoading: async function(top: boolean = false) {
        DeskRT.showMask(top);
        await DeskRT.sleep(2000);
        DeskRT.hideMask();
    }
};