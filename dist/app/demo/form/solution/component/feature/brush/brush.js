import { normalizeOptions } from '../../core/tool';
export default class {
    _getOptions;
    id = 'brush';
    constructor(_getOptions) {
        this._getOptions = _getOptions;
    }
    begin(context, point) {
        const options = normalizeOptions(this._getOptions());
        context.save();
        context.beginPath();
        context.globalAlpha = options.opacity;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = options.size;
        context.shadowBlur = options.size * .2;
        context.shadowColor = options.color;
        context.strokeStyle = options.color;
        context.moveTo(point.x, point.y);
        context.lineTo(point.x + .01, point.y + .01);
        context.stroke();
    }
    move(context, point) {
        context.lineTo(point.x, point.y);
        context.stroke();
    }
    end(context) {
        context.closePath();
        context.restore();
    }
}
