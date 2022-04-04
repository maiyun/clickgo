"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native = require("./native");
native.ready().then(function () {
    native.run('../desktop/index.html');
});
