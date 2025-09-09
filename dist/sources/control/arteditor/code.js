import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'imgselect': null,
            'update:modelValue': null,
            'update:preview': null
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'preview': false,
            'pre': '',
            'modelValue': []
        };
        this.value = [];
        /** --- 当前是否是预览模式 --- */
        this.previewData = false;
        /** --- 当前处于焦点的行 --- */
        this.focusIndex = -1;
        /** --- 语言包 --- */
        this.localeData = {
            'en': {
                'passage': 'Paragraph',
                'image': 'Image',
                'select': 'Select',
                'write': 'Write',
                'preview': 'Preview'
            },
            'sc': {
                'passage': '段落',
                'image': '图像',
                'select': '选择',
                'write': '撰写',
                'preview': '预览'
            },
            'tc': {
                'passage': '段落',
                'image': '圖像',
                'select': '選擇',
                'write': '撰寫',
                'preview': '預覽'
            },
            'ja': {
                'passage': 'パラグラフ',
                'image': '画像',
                'select': '選択',
                'write': '執筆',
                'preview': 'プレビュー'
            },
            'ko': {
                'passage': '단락',
                'image': '이미지',
                'select': '선택',
                'write': '쓰기',
                'preview': '미리보기'
            },
            'th': {
                'passage': 'ย่อหน้า',
                'image': 'รูปภาพ',
                'select': 'เลือก',
                'write': 'เขียน',
                'preview': 'ดูตัวอย่าง'
            },
            'es': {
                'passage': 'Párrafo',
                'image': 'Imagen',
                'select': 'Seleccionar',
                'write': 'Escribir',
                'preview': 'Vista previa'
            },
            'de': {
                'passage': 'Absatz',
                'image': 'Bild',
                'select': 'Auswählen',
                'write': 'Schreiben',
                'preview': 'Vorschau'
            },
            'fr': {
                'passage': 'Paragraphe',
                'image': 'Image',
                'select': 'Sélectionner',
                'write': 'Écrire',
                'preview': 'Aperçu'
            },
            'pt': {
                'passage': 'Parágrafo',
                'image': 'Imagem',
                'select': 'Selecionar',
                'write': 'Escrever',
                'preview': 'Pré-visualização'
            },
            'ru': {
                'passage': 'Параграф',
                'image': 'Изображение',
                'select': 'Выбрать',
                'write': 'Написать',
                'preview': 'Просмотр'
            },
            'vi': {
                'passage': 'Đoạn văn',
                'image': 'Hình ảnh',
                'select': 'Chọn',
                'write': 'Viết',
                'preview': 'Xem trước'
            }
        };
        /** --- 添加按钮点击序列 --- */
        this.controlIndex = 0;
    }
    /** --- 获取最终图像 --- */
    get getImgUrl() {
        return (url) => {
            if (!this.props.pre) {
                return url;
            }
            return clickgo.tool.urlResolve(this.props.pre, url);
        };
    }
    // --- 点击添加按钮 ---
    controlDown(e, index) {
        this.controlIndex = index;
    }
    // --- 添加 ---
    add(type) {
        switch (type) {
            case 'passage': {
                this.value.splice(this.controlIndex + 1, 0, {
                    'type': 'p',
                    'value': '',
                    'b': false,
                    'i': false
                });
                this.emit('update:modelValue', clickgo.tool.clone(this.value));
                break;
            }
            case 'image': {
                this.value.splice(this.controlIndex + 1, 0, {
                    'type': 'img',
                    'value': '',
                    'desc': 'desc'
                });
                this.emit('update:modelValue', clickgo.tool.clone(this.value));
                break;
            }
        }
    }
    // --- 移除某行 ---
    remove(index) {
        this.value.splice(index, 1);
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }
    // --- 更新某行 ---
    update(name, value, index) {
        this.value[index][name] = value;
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }
    // --- 反向更新 ---
    updateBool(name) {
        const item = this.value[this.focusIndex];
        if (!item) {
            return;
        }
        if (item.type !== 'p') {
            return;
        }
        item[name] = !item[name];
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }
    // --- 预览和撰写选项卡点击事件 ---
    changePreview(mode) {
        const nowMode = this.previewData ? 'preview' : 'write';
        if (mode === nowMode) {
            return;
        }
        this.previewData = !this.previewData;
        this.emit('update:preview', this.previewData);
    }
    /** --- 图像点击选择事件 --- */
    imgSelect(index) {
        this.focusIndex = index;
        this.emit('imgselect', (url) => {
            this.update('value', url, index);
        });
    }
    onMounted() {
        this.watch('modelValue', () => {
            let value = this.props.modelValue;
            if (typeof value === 'string') {
                try {
                    if (value === JSON.stringify(this.value)) {
                        return;
                    }
                    value = JSON.parse(value);
                    if (Array.isArray(value)) {
                        this.value = value;
                        this.emit('update:modelValue', clickgo.tool.clone(value));
                        return;
                    }
                    this.value = [];
                    this.emit('update:modelValue', []);
                    return;
                }
                catch {
                    this.value = [];
                    this.emit('update:modelValue', []);
                    return;
                }
            }
            if (Array.isArray(value)) {
                if (JSON.stringify(value) === JSON.stringify(this.value)) {
                    return;
                }
                this.value = clickgo.tool.clone(value);
                return;
            }
            this.value = [];
            this.emit('update:modelValue', []);
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch('preview', () => {
            this.previewData = this.propBoolean('preview');
        });
    }
}
