import * as lCommand from '../command';
import * as lForm from '../form';
import * as lTool from '../tool';

/** --- 框架命令面板语言，覆盖内置语种，未知语言回退英文 --- */
const locale: Record<string, Record<string, string>> = {
    'sc': {
        'title': '命令面板', 'command': '命令', 'arguments': '参数（JSON）', 'schema': '参数规则',
        'result': '执行结果', 'execute': '执行', 'refresh': '刷新', 'close': '关闭',
        'empty': '当前没有可用命令', 'invalid': '请输入合法的 JSON 对象',
    },
    'tc': {
        'title': '命令面板', 'command': '命令', 'arguments': '參數（JSON）', 'schema': '參數規則',
        'result': '執行結果', 'execute': '執行', 'refresh': '重新整理', 'close': '關閉',
        'empty': '目前沒有可用命令', 'invalid': '請輸入有效的 JSON 物件',
    },
    'ja': {
        'title': 'コマンドパレット', 'command': 'コマンド', 'arguments': '引数（JSON）', 'schema': '入力スキーマ',
        'result': '実行結果', 'execute': '実行', 'refresh': '更新', 'close': '閉じる',
        'empty': '利用可能なコマンドはありません', 'invalid': '有効な JSON オブジェクトを入力してください',
    },
    'ko': {
        'title': '명령 팔레트', 'command': '명령', 'arguments': '인수 (JSON)', 'schema': '입력 스키마',
        'result': '실행 결과', 'execute': '실행', 'refresh': '새로 고침', 'close': '닫기',
        'empty': '사용 가능한 명령이 없습니다', 'invalid': '유효한 JSON 객체를 입력하세요',
    },
    'th': {
        'title': 'แผงคำสั่ง', 'command': 'คำสั่ง', 'arguments': 'อาร์กิวเมนต์ (JSON)', 'schema': 'สคีมาอินพุต',
        'result': 'ผลลัพธ์', 'execute': 'ดำเนินการ', 'refresh': 'รีเฟรช', 'close': 'ปิด',
        'empty': 'ไม่มีคำสั่งที่พร้อมใช้งาน', 'invalid': 'กรุณาป้อนออบเจ็กต์ JSON ที่ถูกต้อง',
    },
    'vi': {
        'title': 'Bảng lệnh', 'command': 'Lệnh', 'arguments': 'Tham số (JSON)', 'schema': 'Lược đồ đầu vào',
        'result': 'Kết quả', 'execute': 'Thực thi', 'refresh': 'Làm mới', 'close': 'Đóng',
        'empty': 'Không có lệnh khả dụng', 'invalid': 'Vui lòng nhập một đối tượng JSON hợp lệ',
    },
    'ar': {
        'title': 'لوحة الأوامر', 'command': 'الأمر', 'arguments': 'المعاملات (JSON)', 'schema': 'مخطط الإدخال',
        'result': 'النتيجة', 'execute': 'تنفيذ', 'refresh': 'تحديث', 'close': 'إغلاق',
        'empty': 'لا توجد أوامر متاحة', 'invalid': 'أدخل كائن JSON صالحًا',
    },
    'id': {
        'title': 'Palet perintah', 'command': 'Perintah', 'arguments': 'Argumen (JSON)', 'schema': 'Skema masukan',
        'result': 'Hasil', 'execute': 'Jalankan', 'refresh': 'Segarkan', 'close': 'Tutup',
        'empty': 'Tidak ada perintah yang tersedia', 'invalid': 'Masukkan objek JSON yang valid',
    },
    'en': {
        'title': 'Commands', 'command': 'Command', 'arguments': 'Arguments (JSON)', 'schema': 'Input schema',
        'result': 'Result', 'execute': 'Execute', 'refresh': 'Refresh', 'close': 'Close',
        'empty': 'No commands available', 'invalid': 'Enter a valid JSON object',
    },
    'es': {
        'title': 'Paleta de comandos', 'command': 'Comando', 'arguments': 'Argumentos (JSON)', 'schema': 'Esquema de entrada',
        'result': 'Resultado', 'execute': 'Ejecutar', 'refresh': 'Actualizar', 'close': 'Cerrar',
        'empty': 'No hay comandos disponibles', 'invalid': 'Introduce un objeto JSON válido',
    },
    'de': {
        'title': 'Befehlspalette', 'command': 'Befehl', 'arguments': 'Argumente (JSON)', 'schema': 'Eingabeschema',
        'result': 'Ergebnis', 'execute': 'Ausführen', 'refresh': 'Aktualisieren', 'close': 'Schließen',
        'empty': 'Keine Befehle verfügbar', 'invalid': 'Geben Sie ein gültiges JSON-Objekt ein',
    },
    'fr': {
        'title': 'Palette de commandes', 'command': 'Commande', 'arguments': 'Arguments (JSON)', 'schema': 'Schéma d’entrée',
        'result': 'Résultat', 'execute': 'Exécuter', 'refresh': 'Actualiser', 'close': 'Fermer',
        'empty': 'Aucune commande disponible', 'invalid': 'Saisissez un objet JSON valide',
    },
    'pt': {
        'title': 'Paleta de comandos', 'command': 'Comando', 'arguments': 'Argumentos (JSON)', 'schema': 'Esquema de entrada',
        'result': 'Resultado', 'execute': 'Executar', 'refresh': 'Atualizar', 'close': 'Fechar',
        'empty': 'Nenhum comando disponível', 'invalid': 'Insira um objeto JSON válido',
    },
    'ru': {
        'title': 'Палитра команд', 'command': 'Команда', 'arguments': 'Аргументы (JSON)', 'schema': 'Схема ввода',
        'result': 'Результат', 'execute': 'Выполнить', 'refresh': 'Обновить', 'close': 'Закрыть',
        'empty': 'Нет доступных команд', 'invalid': 'Введите корректный объект JSON',
    },
    'it': {
        'title': 'Tavolozza dei comandi', 'command': 'Comando', 'arguments': 'Argomenti (JSON)', 'schema': 'Schema di input',
        'result': 'Risultato', 'execute': 'Esegui', 'refresh': 'Aggiorna', 'close': 'Chiudi',
        'empty': 'Nessun comando disponibile', 'invalid': 'Inserisci un oggetto JSON valido',
    },
    'tr': {
        'title': 'Komut paleti', 'command': 'Komut', 'arguments': 'Bağımsız değişkenler (JSON)', 'schema': 'Girdi şeması',
        'result': 'Sonuç', 'execute': 'Çalıştır', 'refresh': 'Yenile', 'close': 'Kapat',
        'empty': 'Kullanılabilir komut yok', 'invalid': 'Geçerli bir JSON nesnesi girin',
    },
};

/**
 * --- 打开原生命令调试面板，也可作为界面操作型代理的可选入口 ---
 * @param current 发起操作的 Form，创建阶段使用其原生 Loading
 * @param options 是否只显示应用允许代理调用的命令，默认显示全部内部命令
 * @returns 面板关闭后完成；所属实例失效或正在创建时直接返回
 */
export async function showPalette(current: lForm.AbstractForm, options: { 'exposedOnly'?: boolean; } = {}): Promise<void> {
    if (current.loading || !lForm.get(current.formId)) {
        return;
    }
    const taskId = current.taskId;
    const filename = `/runtime/command-palette-${lTool.random(8, lTool.RANDOM_LUN)}.js`;
    const bridge = lCommand.createBridge(current);

    class Palette extends lForm.AbstractForm {

        /** --- 独立快照，不把业务函数或注册表放进模板 --- */
        public infos: lCommand.IInfo[] = [];

        public selected: string[] = [];

        public args = '{}';

        public result = '';

        /** --- 关闭面板时取消由本面板发起的调用 --- */
        public access = { 'controller': null as AbortController | null };

        /** --- 内置布局直接提供，不读取应用包内同名资源 --- */
        public get filename(): string {
            return filename;
        }

        /** --- 面板语言 --- */
        public get text(): Record<string, string> {
            return locale[this.locale] ?? locale['en'];
        }

        /** --- 列表名称保留稳定命令 ID，便于用户和代理辨认 --- */
        public get choices(): Array<{ 'value': string; 'label': string; }> {
            return this.infos.map(info => ({
                'value': info.name, 'label': info.title ? `${info.title} (${info.name})` : info.name,
            }));
        }

        /** --- 当前命令的说明与可用状态 --- */
        public get selectedInfo(): lCommand.IInfo | undefined {
            return this.infos.find(info => info.name === this.selected[0]);
        }

        /** --- 直接展示规则，不把输入转换或默认值隐式带进执行 --- */
        public get schema(): string {
            return this.selectedInfo ? JSON.stringify(this.selectedInfo.inputSchema, null, 2) : '';
        }

        /**
         * --- 刷新命令和可用条件，保留仍然存在的选择 ---
         * @returns 无返回值
         */
        public refresh(): void {
            this.infos = options.exposedOnly ? bridge.list() : lCommand.list(taskId);
            if (!this.selectedInfo) {
                this.selected = this.infos.length ? [this.infos[0].name] : [];
            }
        }

        /**
         * --- 解析用户输入后走同一命令执行入口 ---
         * @returns 显示结构化结果
         */
        public async submit(): Promise<void> {
            if (this.loading || !this.selectedInfo) {
                return;
            }
            let args: Record<string, lCommand.TJson>;
            try {
                args = JSON.parse(this.args) as Record<string, lCommand.TJson>;
            }
            catch {
                this.result = JSON.stringify(lCommand.failure('invalid-input', this.text['invalid']), null, 2);
                return;
            }
            this.loading = true;
            this.access.controller = new AbortController();
            const commandName = this.selectedInfo.name;
            const execution = options.exposedOnly ? bridge.execute(commandName, args, {
                'signal': this.access.controller.signal,
            }) : lCommand.execute(taskId, commandName, args, { 'signal': this.access.controller.signal });
            const result = await execution;
            this.access.controller = null;
            this.loading = false;
            this.result = JSON.stringify(result, null, 2);
            this.refresh();
        }

        /**
         * --- 初始化列表，选择其他命令时显式清空参数和旧结果 ---
         * @returns 无返回值
         */
        public onMounted(): void {
            this.refresh();
            this.watch('selected', () => {
                this.args = '{}';
                this.result = '';
            }, { 'deep': true });
        }

        /**
         * --- 模态面板关闭时取消调用，不回滚已经完成的业务效果 ---
         * @returns 无返回值
         */
        public onBeforeUnmount(): void {
            this.access.controller?.abort();
        }

    }

    current.loading = true;
    const form = await lForm.create(current, Palette, undefined, {
        'layout': `<form :title="text['title']" width="600" height="680" min-width="300" min-height="420" padding="10">
            <!-- 命令选择和状态 -->
            <flow direction="v" style="flex: 1;">
                <layout direction="v" gutter="10">
                    <label>{{text['command']}}</label>
                    <select v-model="selected" :data="choices" search :disabled="!infos.length"></select>
                    <label>{{selectedInfo?.description ?? text['empty']}}</label>
                    <label v-if="selectedInfo &amp;&amp; !selectedInfo.enabled">{{selectedInfo.disabledReason}}</label>
                    <!-- 参数规则和显式输入 -->
                    <label>{{text['schema']}}</label>
                    <text :model-value="schema" type="multi" readonly dir="ltr" style="height: 130px;"></text>
                    <label>{{text['arguments']}}</label>
                    <text v-model="args" type="multi" dir="ltr" style="height: 100px;"></text>
                    <layout gutter="10" wrap>
                        <button @click="submit" :disabled="!selectedInfo?.enabled">{{text['execute']}}</button>
                        <button @click="refresh">{{text['refresh']}}</button>
                        <button @click="close">{{text['close']}}</button>
                    </layout>
                    <!-- 各入口共用的结构化执行结果 -->
                    <label>{{text['result']}}</label>
                    <text :model-value="result" type="multi" readonly dir="ltr" style="height: 110px;"></text>
                </layout>
            </flow>
        </form>`,
    });
    current.loading = false;
    await form.showDialog();
}
