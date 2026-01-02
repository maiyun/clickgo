import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    init = {
        'url': '',
        'sid': '',
        'skey': '',
    };
    talk = {
        'url': '',
        'sid': '',
        'skey': '',
    };
    volume = [80];
    start() {
        this.refs.tums.start();
    }
    stop() {
        this.refs.tums.stop();
    }
    pause() {
        this.refs.tums.pause();
    }
    play() {
        this.refs.tums.play();
    }
    // --- talk ---
    async startTalk() {
        const tums = await clickgo.core.getModule('tums-player');
        await tums?.startTalk(this.talk);
    }
    async stopTalk() {
        const tums = await clickgo.core.getModule('tums-player');
        tums?.stopTalk();
    }
    onMounted() {
        // --- 也可以在这 loadModule 预先加载 tums-playr ---
        // --- 然后用 clickgo.modules['tums-player'] 就可以了 ---
    }
}
