import * as DeskRT from "deskrt";

export let data = {
    text: "okey, okey. bye!"
};

export let methods = {
    doit: function(this: any) {
        DeskRT.showTextMask("Automation...");
        DeskRT.go("group/watch", async (vm) => {
            await vm.goCallback(this.text);
            DeskRT.hideTextMask();
        });
    }
};