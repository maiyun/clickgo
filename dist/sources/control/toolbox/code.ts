import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:columns': null
    };

    public props: {
        /** --- columns，工具按一列或两列排列 --- */
        'columns': number | string;
        /** --- collapsible，是否允许通过标题箭头切换列数 --- */
        'collapsible': boolean | string;
        /** --- position，工具箱所在的逻辑侧边 --- */
        'position': 'left' | 'right';
        /** --- label，工具箱的无障碍名称 --- */
        'label': string;
    } = {
            'columns': 1,
            'collapsible': true,
            'position': 'left',
            'label': ''
        };

    public localeData = {
        'sc': { 'one-column': '使用单列工具箱', 'two-columns': '使用双列工具箱' },
        'tc': { 'one-column': '使用單列工具箱', 'two-columns': '使用雙列工具箱' },
        'en': { 'one-column': 'Use one tool column', 'two-columns': 'Use two tool columns' },
        'ja': { 'one-column': 'ツールを1列で表示', 'two-columns': 'ツールを2列で表示' },
        'ko': { 'one-column': '도구를 한 열로 표시', 'two-columns': '도구를 두 열로 표시' },
        'th': { 'one-column': 'แสดงเครื่องมือหนึ่งคอลัมน์', 'two-columns': 'แสดงเครื่องมือสองคอลัมน์' },
        'vi': { 'one-column': 'Hiển thị một cột công cụ', 'two-columns': 'Hiển thị hai cột công cụ' },
        'ar': { 'one-column': 'عرض الأدوات في عمود واحد', 'two-columns': 'عرض الأدوات في عمودين' },
        'id': { 'one-column': 'Tampilkan satu kolom alat', 'two-columns': 'Tampilkan dua kolom alat' },
        'es': { 'one-column': 'Mostrar una columna de herramientas', 'two-columns': 'Mostrar dos columnas de herramientas' },
        'de': { 'one-column': 'Werkzeuge in einer Spalte anzeigen', 'two-columns': 'Werkzeuge in zwei Spalten anzeigen' },
        'fr': { 'one-column': 'Afficher une colonne d’outils', 'two-columns': 'Afficher deux colonnes d’outils' },
        'pt': { 'one-column': 'Mostrar uma coluna de ferramentas', 'two-columns': 'Mostrar duas colunas de ferramentas' },
        'ru': { 'one-column': 'Показать инструменты в один столбец', 'two-columns': 'Показать инструменты в два столбца' },
        'it': { 'one-column': 'Mostra una colonna di strumenti', 'two-columns': 'Mostra due colonne di strumenti' },
        'tr': { 'one-column': 'Araçları tek sütunda göster', 'two-columns': 'Araçları iki sütunda göster' }
    };

    /** --- 当前工具列数 --- */
    public columnsData: 1 | 2 = 1;

    /** --- 切换单列或双列，工具状态仍由业务按钮管理 --- */
    public toggleColumns(): void {
        this.columnsData = this.columnsData === 1 ? 2 : 1;
        this.emit('update:columns', this.columnsData);
    }

    /**
     * --- 方向键在启用的工具按钮之间移动焦点 ---
     * @param event 键盘事件
     */
    public keydown(event: KeyboardEvent): void {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }
        const button = event.target.closest<HTMLElement>('[data-cg-control="button"][role="button"]');
        if (!button) {
            return;
        }
        const buttons = Array.from((this.refs.tools as HTMLElement).querySelectorAll<HTMLElement>(
            '[data-cg-control="button"][role="button"]:not([data-cg-disabled])')).filter(item => item.offsetHeight > 0);
        const index = buttons.indexOf(button);
        if (index < 0) {
            return;
        }
        let next = index;
        let axis: 'horizontal' | 'vertical' = 'vertical';
        let direction = 0;
        switch (event.key) {
            case 'ArrowUp': direction = -1; break;
            case 'ArrowDown': direction = 1; break;
            case 'ArrowLeft': axis = 'horizontal'; direction = -1; break;
            case 'ArrowRight': axis = 'horizontal'; direction = 1; break;
            case 'Home': next = 0; break;
            case 'End': next = buttons.length - 1; break;
            default: return;
        }
        event.preventDefault();
        if (direction) {
            // --- 分组可能从新行开始，按实际位置导航才能跨分组并兼容 RTL。 ---
            const current = button.getBoundingClientRect();
            const x = current.left + current.width / 2;
            const y = current.top + current.height / 2;
            const candidates = buttons.map((item, itemIndex) => {
                const rect = item.getBoundingClientRect();
                const dx = rect.left + rect.width / 2 - x;
                const dy = rect.top + rect.height / 2 - y;
                const along = axis === 'horizontal' ? dx : dy;
                const across = axis === 'horizontal' ? dy : dx;
                return { 'index': itemIndex, along, 'distance': Math.abs(along) + Math.abs(across) * 4 };
            }).filter(item => item.along * direction > 1).sort((a, b) => a.distance - b.distance);
            next = candidates[0]?.index ?? index;
        }
        buttons[Math.max(0, Math.min(buttons.length - 1, next))]?.focus();
    }

    public onMounted(): void {
        this.watch('columns', () => {
            this.columnsData = this.propNumber('columns') === 2 ? 2 : 1;
        }, {
            'immediate': true
        });
    }

}
