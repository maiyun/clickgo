import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'media': null
    };

    public props: {
        'direction': 'h' | 'v';
        /** --- 如 [100, 300]，width 每次达到后则响应 media 事件，并传入响应的数字值，否则为 0 就是比最小值还小 --- */
        'media': number[] | string;
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
            'direction': 'h',
            'media': [],
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };

    public mediaOld: number = -1;

    public onMounted(): void | Promise<void> {
        this.watch('media', () => {
            if (this.propArray('media').length) {
                clickgo.dom.watchSize(this.element, () => {
                    let now: number = 0;
                    for (const width of this.propArray('media')) {
                        if (this.element.offsetWidth < width) {
                            continue;
                        }
                        if (now > width) {
                            continue;
                        }
                        now = width;
                    }
                    if (now === this.mediaOld) {
                        return;
                    }
                    this.mediaOld = now;
                    this.emit('media', now);
                }, true);
            }
            else {
                clickgo.dom.unwatchSize(this.element);
                if (this.mediaOld === -1) {
                    return;
                }
                this.mediaOld = -1;
                this.emit('media', -1);
            }
        }, {
            'immediate': true
        });
    }

}
