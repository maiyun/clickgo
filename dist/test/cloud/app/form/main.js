import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    active = 'Services';
    compact = false;
    search = '';
    status = ['All statuses'];
    selected = [];
    enabled = true;
    checked = true;
    menuAction = 'None';
    refreshPeriod = 'Every minute';
    workspace = 'Production';
    accent = ['Blue'];
    appearance = ['Light'];
    themeBusy = false;
    access = {
        'themeName': 'cloud',
        'appearance': 'Light',
        'media': null,
        'mediaChanged': null
    };
    accents = {
        'Blue': '#2563eb',
        'Green': '#087f72',
        'Violet': '#7546c7',
        'Amber': '#f2b83f'
    };
    rows = [
        { 'name': 'edge-gateway', 'type': 'Gateway', 'region': 'Asia Pacific', 'status': 'Healthy', 'version': '2026.10.1', 'updated': '2 minutes ago' },
        { 'name': 'api-production', 'type': 'Service', 'region': 'Europe', 'status': 'Healthy', 'version': '2026.10.1', 'updated': '5 minutes ago' },
        { 'name': 'worker-preview', 'type': 'Worker', 'region': 'North America', 'status': 'Pending', 'version': '2026.9.4', 'updated': '12 minutes ago' },
        { 'name': 'archive-storage', 'type': 'Storage', 'region': 'Asia Pacific', 'status': 'Offline', 'version': '2026.9.4', 'updated': '1 hour ago' }
    ];
    statusTypes = { 'Healthy': 'primary', 'Pending': 'warning', 'Offline': 'default' };
    /** --- 当前筛选结果 --- */
    get filteredRows() {
        const search = this.search.trim().toLowerCase();
        return this.rows.filter(row => row.name.includes(search) &&
            (this.status[0] === 'All statuses' || row.status === this.status[0]));
    }
    /**
     * --- 按预览选择切换框架主色 ---
     * @returns 更新完成
     */
    changeAccent() {
        clickgo.theme.setMain(this.accents[this.accent[0]]);
    }
    /**
     * --- 切换完整主题包，加载成功后才移除旧主题 ---
     * @returns 外观更新完成，失败时保留旧外观并提示
     */
    async changeAppearance() {
        if (this.themeBusy) {
            return;
        }
        const appearance = this.appearance[0];
        const dark = appearance === 'Dark' || appearance === 'System' && this.access.media?.matches;
        const name = dark ? 'cloud-dark' : 'cloud';
        if (name === this.access.themeName) {
            this.access.appearance = appearance;
            return;
        }
        this.themeBusy = true;
        try {
            const file = await clickgo.fs.getContent(this, `/clickgo/theme/${name}.cgt`);
            const theme = file instanceof Blob ? await clickgo.theme.read(file) : false;
            if (theme === false || !await clickgo.theme.load(this, theme)) {
                this.appearance = [this.access.appearance];
                await clickgo.form.dialog(this, 'Unable to load the selected appearance. Please try again.');
                return;
            }
            const previous = this.access.themeName;
            this.access.themeName = name;
            this.access.appearance = appearance;
            await clickgo.theme.remove(this, previous);
        }
        finally {
            this.themeBusy = false;
        }
    }
    /**
     * --- System 外观监听系统偏好，显式 Light/Dark 不受系统变化影响 ---
     * @returns 监听初始化完成
     */
    onMounted() {
        this.access.media = window.matchMedia('(prefers-color-scheme: dark)');
        this.access.mediaChanged = () => {
            if (this.appearance[0] !== 'System') {
                return;
            }
            this.changeAppearance().catch(() => { });
        };
        this.access.media.addEventListener('change', this.access.mediaChanged);
    }
    /**
     * --- 释放系统外观监听 ---
     * @returns 清理完成
     */
    onUnmounted() {
        if (this.access.mediaChanged) {
            this.access.media?.removeEventListener('change', this.access.mediaChanged);
        }
        this.access.media = null;
        this.access.mediaChanged = null;
    }
    /**
     * --- 打开原生对话框预览浮层 ---
     * @returns 对话框关闭
     */
    async showDetails() {
        await clickgo.form.dialog(this, {
            'title': 'Service details',
            'content': 'Your services are up to date. This workspace contains sample data for the Cloud theme preview.'
        });
    }
}
