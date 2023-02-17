import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'modelValue': number | string;
        // --- 最大页数 ---
        'max': number | string;
        /** --- 总条数，可留空 --- */
        'total': number | string;
        'count': number | string;
    } = {
            'modelValue': 1,
            'max': 0,
            'total': 0,
            'count': 10
        };

    public svg: string = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="m6 10.25c-.9665 0-1.75.7835-1.75 1.75s.7835 1.75 1.75 1.75h.01c.9665 0 1.75-.7835 1.75-1.75s-.7835-1.75-1.75-1.75zm4.25 1.75c0-.9665.7835-1.75 1.75-1.75h.01c.9665 0 1.75.7835 1.75 1.75s-.7835 1.75-1.75 1.75h-.01c-.9665 0-1.75-.7835-1.75-1.75zm6 0c0-.9665.7835-1.75 1.75-1.75h.01c.9665 0 1.75.7835 1.75 1.75s-.7835 1.75-1.75 1.75h-.01c-.9665 0-1.75-.7835-1.75-1.75z" /></svg>';

    /** --- 上面页面序列 --- */
    public prevs: number[] = [];

    /** --- 下面页面序列 --- */
    public nexts: number[] = [];

    /** --- 当前页面 --- */
    public page: number = 0;

    /** --- 最大页数，如果用户传入了 max 则以 max 为准，否则以 total 和 count 计算最大页面值 --- */
    public maxPage: number = 0;

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'total-of': 'Total of ? items'
        },
        'sc': {
            'total-of': '共 ? 条'
        },
        'tc': {
            'total-of': '共 ? 條'
        },
        'ja': {
            'total-of': '? 件の合計'
        },
        'ko': {
            'total-of': '? 개 항목 총계'
        },
        'th': {
            'total-of': 'ทั้งหมด ? รายการ'
        },
        'es': {
            'total-of': 'Total de ? elementos'
        },
        'de': {
            'total-of': 'Insgesamt ?'
        },
        'fr': {
            'total-of': 'Total de ?'
        },
        'pt': {
            'total-of': 'Total de ?'
        },
        'ru': {
            'total-of': 'Всего ?'
        },
        'vi': {
            'total-of': 'Tổng cộng ?'
        }
    };

    // --- 刷新重置界面 ---
    public refresh(): void {
        this.prevs.length = 0;
        if (this.page > 2) {
            let prev = this.page - 2;
            if (prev < 2) {
                prev = 2;
            }
            for (let i = prev; i < this.page; ++i) {
                this.prevs.push(i);
            }
        }

        this.nexts.length = 0;
        const last2 = this.maxPage - 1;
        if (this.page < last2) {
            let next = this.page + 2;
            if (next > last2) {
                next = last2;
            }
            for (let i = this.page + 1; i <= next; ++i) {
                this.nexts.push(i);
            }
        }
    }

    // --- 更新最大页面数值 ---
    public refreshMaxPage(): void {
        const max = this.maxPage;
        if (max) {
            this.maxPage = max;
            return;
        }
        if (!this.propInt('total')) {
            this.maxPage = 1;
            return;
        }
        this.maxPage = Math.ceil(this.propInt('total') / this.propInt('count'));
    }

    public keydown(e: KeyboardEvent): void {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        (e.target as HTMLElement).click();
    }

    public onMounted(): void | Promise<void> {
        this.watch('modelValue', () => {
            this.page = this.propInt('modelValue');
            this.refresh();
        }, {
            'immediate': true
        });
        this.watch('max', () => {
            this.refreshMaxPage();
        });
        this.watch('total', () => {
            this.refreshMaxPage();
        });
        this.refreshMaxPage();
        this.refresh();
    }

}
