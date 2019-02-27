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

export let methods = {
    // --- 回调函数 ---
    goCallback: async function(this: any, text: string) {
        this.q = "";
        let tl = text.length;
        for (let i = 0; i < tl; ++i) {
            await DeskRT.sleep(300);
            this.q += text[i];
        }
    }
};