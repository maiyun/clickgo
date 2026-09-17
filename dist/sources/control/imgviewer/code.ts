import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:zoom': null,
        'change': null
    };

    public props: {
        'src': string[] | string;
        'modelValue': number | string;
        'zoom': number | string;
    } = {
            'src': [],
            'modelValue': 0,
            'zoom': 1
        };

    public width = 0;

    public height = 0;

    public imgData = '';

    public count = 0;

    public scaleS = 1;

    public scaleX = 0;

    public scaleY = 0;

    /** --- 切换图片时清空旧图，异步读取仅接受最后一次结果 --- */
    public async refreshImgData(): Promise<void> {
        const count = ++this.count;
        this.imgData = '';
        this.width = 0;
        this.height = 0;
        const src = this.propArray('src')[this.propNumber('modelValue')];
        if (typeof src !== 'string' || !src) {
            return;
        }
        const pre = src.slice(0, 6).toLowerCase();
        if (pre === 'file:/') {
            return;
        }
        if ((pre === 'http:/') || (pre === 'https:') || pre.startsWith('data:') || pre.startsWith('blob:')) {
            this.imgData = src;
            return;
        }
        let blob: string | Blob | null = null;
        if (src.startsWith('/control/')) {
            if (!this.rootControl) {
                return;
            }
            blob = this.rootControl.packageFiles[src.slice(8)];
        }
        else {
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', src);
            blob = await clickgo.fs.getContent(this, path);
        }
        if ((count !== this.count) || !blob || (typeof blob === 'string')) {
            return;
        }
        const data = await clickgo.tool.blob2DataUrl(blob);
        if (count === this.count) {
            this.imgData = data || '';
        }
    }

    /**
     * --- 使用图片原始尺寸，缩放交给 Panzoom ---
     * @param event 图片加载事件
     */
    public async load(event: Event): Promise<void> {
        const img = event.target as HTMLImageElement;
        if ((img !== (this.refs.img as HTMLElement)) || (img.getAttribute('src') !== this.imgData)) {
            return;
        }
        const count = this.count;
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
        await this.nextTick();
        if (count === this.count) {
            this.zoomFit();
        }
    }

    /** --- 完整显示当前图片 --- */
    public zoomFit(): void {
        this.refs.viewer.zoomFit();
    }

    /** --- 以原始尺寸居中显示当前图片 --- */
    public zoomActual(): void {
        this.refs.viewer.zoomActual();
    }

    /**
     * --- 同步缩放绑定及视图事件 ---
     * @param view 当前视图状态
     */
    public changed(view: clickgo.control.IPanzoomView): void {
        this.emit('update:zoom', view.zoom);
        this.emit('change', view);
    }

    public onMounted(): void {
        this.watch('zoom', () => {
            this.scaleS = this.propNumber('zoom');
        });
        this.scaleS = this.propNumber('zoom');
        this.watch('modelValue', async () => { await this.refreshImgData(); });
        this.watch('src', async () => { await this.refreshImgData(); }, { 'deep': true, 'immediate': true });
    }

    public onBeforeUnmount(): void {
        ++this.count;
    }

}
