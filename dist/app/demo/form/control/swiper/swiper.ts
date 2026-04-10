import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    /** --- 当前幻灯片索引 --- */
    public current = 0;

    /** --- 是否自动播放 --- */
    public isAutoplay = true;

    /** --- 是否循环 --- */
    public isLoop = true;

    /** --- 自动播放间隔（毫秒） --- */
    public interval = 3000;

    /** --- 图片填充模式 --- */
    public fit = 'cover';

    /** --- 演示用幻灯片列表（复用 res/ 中的本地图片）--- */
    public items: Array<{ 'src': string; 'alt': string; }> = [
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 1' },
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 2' },
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 3' },
        { 'src': '../../../res/img.jpg', 'alt': 'Slide 4' },
    ];

}
