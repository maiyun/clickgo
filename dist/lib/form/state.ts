/** --- 窗体系统共享的身份、创建顺序和焦点状态 --- */
export const state: { 'sysId': string; 'index': number; 'focusId': string | null; } = {
    'sysId': '',
    'index': -1,
    'focusId': null,
};

/** --- form 相关信息 --- */
export const info: {
    /** --- 最后一个置底窗体层级，1000（一千）开始 --- */
    'bottomLastZIndex': number;
    /** --- 最后一个窗体层级，1000000（百万）开始 --- */
    'lastZIndex': number;
    /** --- 最后一个置顶窗体层级，100000000（一亿）开始 --- */
    'topLastZIndex': number;
    /** --- 用到的语言包 --- */
    'locale': Record<string, {
        'ok': string;
        'yes': string;
        'no': string;
        'cancel': string;
        'search': string;
        'confirmExitStep': string;
    }>;
} = {
    'bottomLastZIndex': 999,
    'lastZIndex': 999999,
    'topLastZIndex': 99999999,
    'locale': {
        'en': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'cancel': 'Cancel',
            'search': 'Search',
            'confirmExitStep': 'This operation will exit the current process. Are you sure you want to exit?'
        },
        'sc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '搜索',
            'confirmExitStep': '此操作将退出当前流程，确定退出吗？'
        },
        'tc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '檢索',
            'confirmExitStep': '此操作將結束目前的流程，確定退出嗎？'
        },
        'ja': {
            'ok': '好',
            'yes': 'はい',
            'no': 'いいえ',
            'cancel': 'キャンセル',
            'search': '検索',
            'confirmExitStep': 'この操作は現在のプロセスを終了します。本当に終了しますか？'
        },
        'ko': {
            'ok': '확인',
            'yes': '예',
            'no': '아니오',
            'cancel': '취소',
            'search': '검색',
            'confirmExitStep': '이 작업은 현재 프로세스를 종료합니다. 종료하시겠습니까?'
        },
        'th': {
            'ok': 'ตกลง',
            'yes': 'ใช่',
            'no': 'ไม่',
            'cancel': 'ยกเลิก',
            'search': 'ค้นหา',
            'confirmExitStep': 'การดำเนินการนี้จะออกจากกระบวนการปัจจุบัน ยืนยันที่จะออกไหม？'
        },
        'es': {
            'ok': 'Aceptar',
            'yes': 'Sí',
            'no': 'No',
            'cancel': 'Cancelar',
            'search': 'Buscar',
            'confirmExitStep': 'Esta operación cerrará el proceso actual. ¿Estás seguro de que quieres salir?'
        },
        'de': {
            'ok': 'OK',
            'yes': 'Ja',
            'no': 'Nein',
            'cancel': 'Abbrechen',
            'search': 'Suchen',
            'confirmExitStep': 'Diese Aktion beendet den aktuellen Prozess. Möchten Sie wirklich beenden?'
        },
        'fr': {
            'ok': 'OK',
            'yes': 'Oui',
            'no': 'Non',
            'cancel': 'Annuler',
            'search': 'Rechercher',
            'confirmExitStep': 'Cette opération va quitter le processus en cours. Êtes-vous sûr de vouloir quitter ?'
        },
        'pt': {
            'ok': 'OK',
            'yes': 'Sim',
            'no': 'Não',
            'cancel': 'Cancelar',
            'search': 'Buscar',
            'confirmExitStep': 'Esta operação encerrará o processo atual. Você tem certeza de que deseja sair?'
        },
        'ru': {
            'ok': 'OK',
            'yes': 'Да',
            'no': 'Нет',
            'cancel': 'Отмена',
            'search': 'Поиск',
            'confirmExitStep': 'Эта операция завершит текущий процесс. Вы уверены, что хотите выйти?'
        },
        'vi': {
            'ok': 'OK',
            'yes': 'Có',
            'no': 'Không',
            'cancel': 'Hủy bỏ',
            'search': 'Tìm kiếm',
            'confirmExitStep': 'Thao tác này sẽ thoát khỏi quy trình hiện tại. Bạn có chắc chắn muốn thoát không?'
        },
        'ar': {
            'ok': 'موافق',
            'yes': 'نعم',
            'no': 'لا',
            'cancel': 'إلغاء',
            'search': 'بحث',
            'confirmExitStep': 'ستؤدي هذه العملية إلى إنهاء الإجراء الحالي. هل تريد المتابعة؟'
        },
        'id': {
            'ok': 'OK',
            'yes': 'Ya',
            'no': 'Tidak',
            'cancel': 'Batal',
            'search': 'Cari',
            'confirmExitStep': 'Tindakan ini akan mengakhiri proses saat ini. Yakin ingin keluar?'
        },
        'it': {
            'ok': 'OK',
            'yes': 'Sì',
            'no': 'No',
            'cancel': 'Annulla',
            'search': 'Cerca',
            'confirmExitStep': 'Questa operazione terminerà il processo corrente. Vuoi uscire?'
        },
        'tr': {
            'ok': 'Tamam',
            'yes': 'Evet',
            'no': 'Hayır',
            'cancel': 'İptal',
            'search': 'Ara',
            'confirmExitStep': 'Bu işlem mevcut süreci sonlandıracak. Çıkmak istiyor musunuz?'
        }
    }
};

/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id: string): void {
    if (state.sysId) {
        return;
    }
    state.sysId = id;
}
