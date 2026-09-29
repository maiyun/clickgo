import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:expanded': null
    };
    props = {
        'expanded': true,
        'position': 'right',
        'label': '',
        'tipLabel': ''
    };
    localeData = {
        'sc': { 'expand': '展开侧栏', 'collapse': '收起侧栏' },
        'tc': { 'expand': '展開側欄', 'collapse': '收起側欄' },
        'en': { 'expand': 'Expand sidebar', 'collapse': 'Collapse sidebar' },
        'ja': { 'expand': 'サイドバーを展開', 'collapse': 'サイドバーを折りたたむ' },
        'ko': { 'expand': '사이드바 펼치기', 'collapse': '사이드바 접기' },
        'th': { 'expand': 'ขยายแถบด้านข้าง', 'collapse': 'ย่อแถบด้านข้าง' },
        'vi': { 'expand': 'Mở rộng thanh bên', 'collapse': 'Thu gọn thanh bên' },
        'ar': { 'expand': 'توسيع الشريط الجانبي', 'collapse': 'طي الشريط الجانبي' },
        'id': { 'expand': 'Perluas bilah samping', 'collapse': 'Ciutkan bilah samping' },
        'es': { 'expand': 'Expandir barra lateral', 'collapse': 'Contraer barra lateral' },
        'de': { 'expand': 'Seitenleiste ausklappen', 'collapse': 'Seitenleiste einklappen' },
        'fr': { 'expand': 'Développer la barre latérale', 'collapse': 'Réduire la barre latérale' },
        'pt': { 'expand': 'Expandir barra lateral', 'collapse': 'Recolher barra lateral' },
        'ru': { 'expand': 'Развернуть боковую панель', 'collapse': 'Свернуть боковую панель' },
        'it': { 'expand': 'Espandi barra laterale', 'collapse': 'Comprimi barra laterale' },
        'tr': { 'expand': 'Kenar çubuğunu genişlet', 'collapse': 'Kenar çubuğunu daralt' }
    };
    /** --- 收起指向外侧，展开指向工作区；物理方向由样式在 RTL 下镜像 --- */
    get chevronRight() {
        return (this.props.position === 'right') === this.propBoolean('expanded');
    }
    /** --- 可选名称只补充上下文，操作提示随展开状态更新 --- */
    get tipLabelComp() {
        if (this.props.tipLabel) {
            return this.props.tipLabel;
        }
        const action = this.l(this.propBoolean('expanded') ? 'collapse' : 'expand');
        return this.props.label ? `${action} · ${this.props.label}` : action;
    }
    /** --- 请求切换展开状态，布局和业务限制仍由宿主控制 --- */
    toggle() {
        this.emit('update:expanded', !this.propBoolean('expanded'));
    }
    /**
     * --- ClickGo 将 click 转为指针 tap，键盘激活需显式执行并隔离应用快捷键 ---
     * @param event 键盘事件
     */
    keydown(event) {
        if ((event.key !== 'Enter') && (event.key !== ' ')) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat) {
            this.toggle();
        }
    }
}
