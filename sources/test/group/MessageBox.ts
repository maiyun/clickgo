export let data = {
    text: "Waiting..."
};

export let methods = {
    alert: async function(this: any) {
        this.text = "Waiting...";
        let r = await DeskRT.alert(`You clicked "alert".`);
        this.text = r ? "true" : "false";
    },
    confirm: async function(this: any) {
        this.text = "Waiting...";
        let r = await DeskRT.confirm(`You clicked "confirm".`);
        this.text = r ? "true" : "false";
    }
};