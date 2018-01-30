export let data = {
    q: "input",
    w: "none"
};

export let watch = {
    q: function(this: any) {
        let a = [];
        for (let i = 0; i < this.q.length; ++i) {
            a.push(`{${this.q.charCodeAt(i)}}`);
        }
        this.w = a.join("");
    }
};