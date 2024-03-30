"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
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
        this.previewData = false;
        this.focusIndex = -1;
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
        this.controlIndex = 0;
    }
    get getImgUrl() {
        return (url) => {
            if (!this.props.pre) {
                return url;
            }
            return clickgo.tool.urlResolve(this.props.pre, url);
        };
    }
    controlDown(e, index) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.controlIndex = index;
        const el = e.currentTarget;
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        clickgo.dom.bindClick(e, () => {
            clickgo.form.showPop(el, this.refs.pop, e);
        });
    }
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
    remove(index) {
        this.value.splice(index, 1);
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }
    update(name, value, index) {
        this.value[index][name] = value;
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }
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
    changePreview(mode) {
        const nowMode = this.previewData ? 'preview' : 'write';
        if (mode === nowMode) {
            return;
        }
        this.previewData = !this.previewData;
        this.emit('update:preview', this.previewData);
    }
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
                catch (_a) {
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
exports.default = default_1;
