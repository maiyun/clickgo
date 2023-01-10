import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        /** --- 小于此值，则 direction 自动变为 v，大于等于则为 h --- */
        'directionWidth': number | string;
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
            'direction': 'h',
            'directionWidth': 0,
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };

    public directionData: 'h' | 'v' = 'h';

    public onMounted(): void | Promise<void> {
        this.watch('directionWidth', (n, o) => {
            if (n && o) {
                return;
            }
            const w = this.propNumber('directionWidth');
            if (w) {
                clickgo.dom.watchSize(this.element, () => {
                    if (this.element.offsetWidth >= w) {
                        // --- h ---
                        if (this.directionData === 'h') {
                            return;
                        }
                        this.directionData = 'h';
                    }
                    else {
                        // --- v ---
                        if (this.directionData === 'v') {
                            return;
                        }
                        this.directionData = 'v';
                    }
                    if (this.directionData === this.props.direction) {
                        return;
                    }
                    this.emit('update:direction', this.directionData);
                });
            }
            else {
                clickgo.dom.unwatchSize(this.element);
            }
        }, {
            'immediate': true
        });
        this.watch('direction', () => {
            if (!this.propNumber('directionWidth')) {
                this.directionData = this.props.direction;
                return;
            }
            if (this.directionData === this.props.direction) {
                return;
            }
            this.emit('update:direction', this.directionData);
        });
        this.directionData = this.props.direction;
    }

}
