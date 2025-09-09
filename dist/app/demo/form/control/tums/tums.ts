import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public init = {
        'url': '',
        'sid': '',
        'skey': '',
    };

    public talk = {
        'url': '',
        'sid': '',
        'skey': '',
    };

    public volume: number[] = [80];

    public start(): void {
        this.refs.tums.start();
    }

    public stop(): void {
        this.refs.tums.stop();
    }

    public pause(): void {
        this.refs.tums.pause();
    }

    public play(): void {
        this.refs.tums.play();
    }

    // --- talk ---

    public async startTalk(): Promise<void> {
        const tums = await clickgo.core.getModule('tums-player');
        await tums?.startTalk(this.talk);
    }

    public async stopTalk(): Promise<void> {
        const tums = await clickgo.core.getModule('tums-player');
        tums?.stopTalk();
    }

    public onMounted(): void {
        // --- 也可以在这 loadModule 预先加载 tums-playr ---
        // --- 然后用 clickgo.modules['tums-player'] 就可以了 ---
    }

}
