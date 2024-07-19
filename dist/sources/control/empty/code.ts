import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'tip': boolean | string;
        'layer': boolean | string;
    } = {
            'tip': false,
            'layer': true
        };

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'no data': 'No data'
        },
        'sc': {
            'no data': '无数据'
        },
        'tc': {
            'no data': '無資料'
        },
        'ja': {
            'no data': 'データなし'
        },
        'ko': {
            'no data': '데이터 없음'
        },
        'th': {
            'no data': 'ไม่มีข้อมูล'
        },
        'es': {
            'no data': 'Sin datos'
        },
        'de': {
            'no data': 'Keine Daten'
        },
        'fr': {
            'no data': 'Pas de données'
        },
        'pt': {
            'no data': 'Sem dados'
        },
        'ru': {
            'no data': 'Нет данных'
        },
        'vi': {
            'no data': 'Không có dữ liệu'
        }
    };

    public onMounted(): void {
        console.log('xx', this.props);
    }

}
