import type { IToolOptions } from '../../model';
import { normalizeOptions, type IDrawTool, type IPoint } from '../../core/tool';

export default class implements IDrawTool {

    public readonly id = 'brush';

    public constructor(private readonly _getOptions: () => IToolOptions) {
    }

    public begin(context: CanvasRenderingContext2D, point: IPoint): void {
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

    public move(context: CanvasRenderingContext2D, point: IPoint): void {
        context.lineTo(point.x, point.y);
        context.stroke();
    }

    public end(context: CanvasRenderingContext2D): void {
        context.closePath();
        context.restore();
    }

}
