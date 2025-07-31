import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'imgselect': null,

        'update:modelValue': null,
        'update:preview': null
    };

    public props: {
        'disabled': boolean | string;
        'readonly': boolean | string;
        'preview': boolean | string;
        /** --- img 图像前缀 --- */
        'pre': string;

        'modelValue': any[];
    } = {
            'disabled': false,
            'readonly': false,
            'preview': false,
            'pre': '',

            'modelValue': []
        };

    public value: Array<{
        'type': 'p' | 'img';
        'value': string;
        'desc'?: string;
        'b'?: boolean;
        'i'?: boolean;
    }> = [];

    /** --- 当前是否是预览模式 --- */
    public previewData: boolean = false;

    /** --- 当前处于焦点的行 --- */
    public focusIndex: number = -1;

    /** --- 语言包 --- */
    public localeData = {
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

    /** --- 获取最终图像 --- */
    public get getImgUrl() {
        return (url: string): string => {
            if (!this.props.pre) {
                return url;
            }
            return clickgo.tool.urlResolve(this.props.pre, url);
        };
    }

    /** --- 添加按钮点击序列 --- */
    public controlIndex: number = 0;

    // --- 点击添加按钮 ---
    public controlDown(e: MouseEvent | TouchEvent, index: number): void {
        this.controlIndex = index;
    }

    // --- 添加 ---
    public add(type: string): void {
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
    public remove(index: number): void {
        this.value.splice(index, 1);
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }

    // --- 更新某行 ---
    public update(name: string, value: string, index: number): void {
        (this.value[index] as any)[name] = value;
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }

    // --- 反向更新 ---
    public updateBool(name: string): void {
        const item = this.value[this.focusIndex];
        if (!item) {
            return;
        }
        if (item.type !== 'p') {
            return;
        }
        (item as any)[name] = !(item as any)[name];
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
    }

    // --- 预览和撰写选项卡点击事件 ---
    public changePreview(mode: 'write' | 'preview'): void {
        const nowMode = this.previewData ? 'preview' : 'write';
        if (mode === nowMode) {
            return;
        }
        this.previewData = !this.previewData;
        this.emit('update:preview', this.previewData);
    }

    /** --- 图像点击选择事件 --- */
    public imgSelect(index: number): void {
        this.focusIndex = index;
        this.emit('imgselect', (url: string) => {
            this.update('value', url, index);
        });
    }

    public onMounted(): void {
        this.watch('modelValue', (): void => {
            let value: any = this.props.modelValue;
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
        this.watch('preview', (): void => {
            this.previewData = this.propBoolean('preview');
        });
    }

}
