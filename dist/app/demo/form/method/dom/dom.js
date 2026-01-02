import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    watchSizeText = false;
    watchSizeHeight = true;
    watchText = false;
    watchInner = true;
    watchStyleChange = true;
    moveLeft = 0;
    moveTop = 0;
    moveWidth = 25;
    moveHeight = 25;
    micWs = 'wss://127.0.0.1:8080/speaker';
    /** --- 说话中 --- */
    micHuman = false;
    /** --- rms 值 --- */
    micRms = 0;
    /** --- 麦克风状态，1-准备中,2-对讲中,3-关闭中 --- */
    micState = 0;
    async micClick() {
        if (this.micState) {
            this.micState = 3;
            clickgo.dom.mic.stop();
            return;
        }
        this.micState = 1;
        // --- 开始对讲 ---
        const rtn = await clickgo.dom.mic.start(this.micWs, {
            onStart: () => {
                this.micState = 2;
            },
            onVoiceStart: () => {
                this.micHuman = true;
            },
            onVoiceEnd: () => {
                this.micHuman = false;
            },
            onProcess: (data) => {
                this.micRms = data.rms;
            },
            onStop: () => {
                this.micState = 0;
                this.micHuman = false;
                this.micRms = 0;
            },
        });
        if (rtn) {
            // --- 正确连接 ---
            return;
        }
        this.micState = 0;
        await clickgo.form.dialog(this, 'No microphone found.');
    }
    get isMove() {
        return clickgo.dom.is.move;
    }
    get isShift() {
        return clickgo.dom.is.shift;
    }
    get isCtrl() {
        return clickgo.dom.is.ctrl;
    }
    get isMeta() {
        return clickgo.dom.is.meta;
    }
    get isFull() {
        return clickgo.dom.is.full;
    }
    get isDark() {
        return clickgo.dom.is.dark;
    }
    setGlobalCursor(type) {
        clickgo.dom.setGlobalCursor(type);
    }
    get isTransition() {
        return clickgo.dom.is.transition;
    }
    setGlobalTransition() {
        clickgo.dom.setGlobalTransition(!this.isTransition);
    }
    getStyleCount() {
        clickgo.form.dialog(this, clickgo.dom.getStyleCount(this, 'form').toString()).catch((e) => { throw e; });
    }
    async getWatchSizeCount(taskId) {
        await clickgo.form.dialog(this, clickgo.dom.getWatchSizeCount(taskId).toString());
    }
    watchSize() {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this, this.refs.watchSize.$el, () => {
                clickgo.form.dialog(this, JSON.stringify({
                    'width': this.refs.watchSize.$el.offsetWidth,
                    'height': this.refs.watchSize.$el.offsetHeight
                })).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.refs.watchSize.$el);
        }
    }
    watchPositionText = false;
    watchPosition() {
        this.watchPositionText = !this.watchPositionText;
        if (this.watchPositionText) {
            clickgo.dom.watchPosition(this.refs.watchPosition.$el, (state) => {
                console.log('watchPosition', state);
            });
        }
        else {
            clickgo.dom.unwatchPosition(this.refs.watchPosition.$el);
        }
    }
    wwatch() {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this, this.refs.watch.$el, () => {
                clickgo.form.dialog(this, 'Changed.').catch((e) => { throw e; });
            }, 'text');
        }
        else {
            clickgo.dom.unwatch(this, this.refs.watch.$el);
        }
    }
    async getWatchCount(taskId) {
        await clickgo.form.dialog(this, clickgo.dom.getWatchCount(taskId).toString());
    }
    isWatchStyle() {
        clickgo.form.dialog(this, clickgo.dom.isWatchStyle(this.refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    }
    getWatchInfoDisabled = false;
    getWatchInfoText = '{}';
    async getWatchInfo() {
        this.getWatchInfoDisabled = true;
        for (let i = 0; i < 40; ++i) {
            const rtn = clickgo.dom.getWatchInfo();
            this.getWatchInfoText = JSON.stringify(rtn, undefined, 4);
            await clickgo.tool.sleep(500);
        }
        this.getWatchInfoDisabled = false;
    }
    async fullscreen() {
        await clickgo.dom.fullscreen();
    }
    // --- pointer ---
    gestureText = '';
    gestureWheelText = '';
    longText = false;
    gesture(e) {
        clickgo.modules.pointer.gesture(e, (ne, dir) => {
            if (['top', 'bottom'].includes(dir)) {
                return 1;
            }
            return 0;
        }, async (dir) => {
            this.gestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
            await clickgo.tool.sleep(500);
            this.gestureText = '';
        });
    }
    gestureWheel(e) {
        clickgo.modules.pointer.gesture(e, (ne, dir) => {
            if (['top', 'bottom', 'left', 'right'].includes(dir)) {
                return 1;
            }
            return 0;
        }, async (dir) => {
            this.gestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
            await clickgo.tool.sleep(500);
            this.gestureWheelText = '';
        });
    }
    long() {
        clickgo.form.dialog(this, 'Press and hold this button.').catch((e) => { throw e; });
    }
    longDown(e) {
        clickgo.modules.pointer.long(e, async () => {
            this.longText = true;
            await clickgo.tool.sleep(500);
            this.longText = false;
        });
    }
    dragDown(e) {
        clickgo.modules.pointer.drag(e, this.refs.drag, {
            'data': ' dragDownTest'
        });
    }
    async dragEnter(e) {
        e.target.innerText = 'enter';
        await clickgo.tool.sleep(200);
        e.target.innerText = '';
    }
    async dragLeave(e) {
        e.target.innerText = 'leave';
        await clickgo.tool.sleep(200);
        e.target.innerText = '';
    }
    async drop(e) {
        e.target.innerText = 'drop';
        await clickgo.tool.sleep(500);
        e.target.innerText = '';
    }
    moveDown(e) {
        clickgo.modules.pointer.move(e, {
            'areaObject': e.currentTarget,
            'object': this.refs.move,
            move: (e, o) => {
                this.moveLeft += o.ox;
                this.moveTop += o.oy;
            }
        });
    }
    dblClickDown(e) {
        clickgo.modules.pointer.dblClick(e, () => {
            this.moveWidth = this.moveWidth === 25 ? 50 : 25;
            this.moveHeight = this.moveHeight === 25 ? 50 : 25;
        });
    }
    scaleX = 0;
    scaleY = 0;
    scaleS = 1;
    scaleDown(e) {
        clickgo.modules.pointer.scale(e, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
        });
    }
    onMounted() {
        clickgo.dom.watchStyle(this.refs.watchStyle.$el, 'font-size', (n, v) => {
            clickgo.form.dialog(this, 'name: ' + n + ', value: ' + v).catch((e) => { throw e; });
        });
    }
}
