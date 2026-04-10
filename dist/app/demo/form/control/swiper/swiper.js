import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    /** --- 当前幻灯片索引 --- */
    current = 0;
    /** --- 是否自动播放 --- */
    isAutoplay = true;
    /** --- 是否循环 --- */
    isLoop = true;
    /** --- 自动播放间隔（毫秒） --- */
    interval = 3000;
    /** --- 图片填充模式 --- */
    fit = 'cover';
    /** --- 演示用幻灯片列表（复用 res/ 中的本地图片）--- */
    items = [
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 1' },
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 2' },
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 3' },
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 4' },
    ];
}
