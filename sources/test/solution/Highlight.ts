export let data = {
    code: `var trim = function (text) {
    return text.replace(/^\\s+|\\s+$/g, "");
};`
};

export let watch = {
    code: function(this: Vue) {
        DeskRT.highlight(this.$refs.codeEle, this.$data.code);
    }
};