"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native = require("./native");
class Boot extends native.AbstractBoot {
    main() {
        this.run('../desktop/index.html', {
            'frame': true
        });
    }
}
native.launcher(new Boot());
