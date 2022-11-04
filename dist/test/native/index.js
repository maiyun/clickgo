"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native = require("./native");
class Boot extends native.AbstractBoot {
    main() {
        this.run('../desktop/index.html', {
            'frame': this.platform === 'win32' ? false : true
        });
    }
}
native.launcher(new Boot());
