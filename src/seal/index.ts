import {
  defaultOpts,
  defaultBorderOpts,
  defaultInnerLoopLineOpts,
  defaultFiveStarOpts,
  defaultTextOpts,
  defaultSerNoOpts,
  defaultSubTextOpts,
  defaultCenterTextOpts,
  defaultInnerBorderOpts,
} from './config';
import { getTransparentData, getFontStr } from './utils';

import type {
  Options,
  BorderOptions,
  DrawCircleOptions,
  FiveStar,
  TextOptions,
  WriteSurroundTextOptions,
} from './types';

export class Seal {
  private options: Options;
  private canvas: HTMLCanvasElement | undefined;
  private context: CanvasRenderingContext2D | undefined;
  /** 画板的中心点 */
  private centerPoint: [number, number];

  private borderOpts: Required<BorderOptions>;
  private innerLoopLineOpts: Required<BorderOptions>;
  private innerBorderOpts: Required<BorderOptions>;

  private textOpts: Required<TextOptions>;
  private subTextOpts: Required<TextOptions>;
  private centerTextOpts: Required<TextOptions>;
  private serNoOpts: Required<TextOptions>;

  private fiveStarOpts: Required<FiveStar>;

  constructor(container: HTMLElement, opts: Options) {
    const canvas = document.createElement('canvas');

    const {
      options,
      borderOpts,
      innerBorderOpts,
      innerLoopLineOpts,
      fiveStarOpts,
      textOpts,
      serNoOpts,
      centerTextOpts,
      subTextOpts,
    } = this.resolveConfig(opts);

    canvas.width = options.width ?? defaultOpts.width;
    canvas.height = options.height ?? defaultOpts.height;

    container.appendChild(canvas);

    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.centerPoint = [
      canvas.width / 2,
      canvas.height / 2,
    ]

    this.options = options;
    this.borderOpts = borderOpts;
    this.innerBorderOpts = innerBorderOpts;
    this.innerLoopLineOpts = innerLoopLineOpts;
    this.fiveStarOpts = fiveStarOpts;
    this.textOpts = textOpts;
    this.subTextOpts = subTextOpts;
    this.serNoOpts = serNoOpts;
    this.centerTextOpts = centerTextOpts;

    this.render();
  }

  update(opts: Options) {
    const {
      options,
      borderOpts,
      innerBorderOpts,
      innerLoopLineOpts,
      fiveStarOpts,
      textOpts,
      subTextOpts,
      serNoOpts,
      centerTextOpts,
    } = this.resolveConfig(opts, false);

    this.options = options;
    this.borderOpts = borderOpts;
    this.innerBorderOpts = innerBorderOpts;
    this.innerLoopLineOpts = innerLoopLineOpts;
    this.fiveStarOpts = fiveStarOpts;
    this.textOpts = textOpts;
    this.subTextOpts = subTextOpts;
    this.serNoOpts = serNoOpts;
    this.centerTextOpts = centerTextOpts;

    this.render();
  }

  /**
   * 绘制印章
   */
  render() {
    if (!this.canvas || !this.context) return;
    /** 每次重绘都从默认变换开始，避免绘制状态影响下一次更新 */
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    /** 重置画布 */
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.options.showTransparent) {
      /** 绘制透明背景 */
      this.context.putImageData(
        getTransparentData(this.canvas.width, this.canvas.height, this.context),
        0,
        0
      );
    }

    this.drawBorder(this.borderOpts);
    this.drawInnerBorder(this.innerBorderOpts);
    this.drawInnerLoopLine(this.innerLoopLineOpts);

    this.drawFiveStar(this.fiveStarOpts);

    this.writeText(this.textOpts);
    this.writeSubText(this.subTextOpts);
    this.writeCenterText(this.centerTextOpts);
    this.writeSerNo(this.serNoOpts);
  }

  /**
   * 销毁印章
   */
  destroy() {
    this.canvas?.remove();
    this.canvas = undefined;
    this.context = undefined;
  }

  /**
   * 获取印章Base64，支持下载文件
   * @returns
   */
  toBase64(download: boolean = true) {
    if (!this.canvas) return;
    const base64 = this.canvas.toDataURL();

    if (download) {
      const fileName = `seal_${Math.random().toString(36).slice(-6)}`;

      const msSaveOrOpenBlob = (window.navigator as Navigator & { msSaveOrOpenBlob?: (blob: Blob, name: string) => void }).msSaveOrOpenBlob;

      if (msSaveOrOpenBlob) {
        const bstr = atob(base64.split(',')[1])
        let len = bstr.length
        const u8arr = new Uint8Array(len)
        while (len--) {
          u8arr[len] = bstr.charCodeAt(len)
        }
        const blob = new Blob([u8arr]);
        msSaveOrOpenBlob(blob, fileName + '.png')
      } else {
        const a = document.createElement('a')
        a.href = base64;
        a.setAttribute('download', fileName)
        a.click();
      }
    }

    return base64;
  }

  /**
   * 绘制边线
   */
  private drawBorder(opts: Required<BorderOptions>) {
    if (!opts.visible || !this.canvas) return;
    const maxRadius = this.canvas.width / 2;

    this.drawCircle(opts.width, opts.color, {
      radius: opts.radius > maxRadius
        ? maxRadius
        : opts.radius,
      shape: opts.shape,
    });
  }

  /**
   * 绘制内边线
   * @param opts
   */
  drawInnerBorder(opts: Required<BorderOptions>) {
    if (!opts.visible || !this.canvas) return;

    const maxRadius = this.borderOpts.radius - this.borderOpts.width;

    this.drawCircle(opts.width, opts.color, {
      radius: opts.radius > maxRadius
        ? maxRadius
        : opts.radius,
      shape: opts.shape,
    });
  }

  /**
   * 绘制内环线
   * @param opts
   */
  drawInnerLoopLine(opts: Required<BorderOptions>) {
    if (!opts.visible || !this.canvas) return;

    const maxRadius = this.innerBorderOpts.radius - this.innerBorderOpts.width;

    this.drawCircle(opts.width, opts.color, {
      radius: opts.radius > maxRadius
        ? maxRadius
        : opts.radius,
      shape: opts.shape,
    });
  }

  /**
   * 绘制主文字
   * @param opts
   * @returns
   */
  writeText(opts: Required<TextOptions>) {
    this.writeSurroundText(opts);
  }

  /**
   * 绘制副文字
   * @param opts
   */
  writeSubText(opts: Required<TextOptions>) {
    this.writeHorizontalText(opts);
  }

  /**
   * 绘制中心文字
   * @param opts
   */
  writeCenterText(opts: Required<TextOptions>) {
    this.writeHorizontalText({
      ...opts,
      textBaseline: 'middle',
    });
  }

  /**
   * 绘制序列号
   * @param opts
   */
  writeSerNo(opts: Required<TextOptions>) {
    this.writeSurroundText({
      ...opts,
      position: 'bottom',
    });
  }

  /**
   * 绘制五角星
   * @param opts
   */
  drawFiveStar(opts: Required<FiveStar>) {
    if (!this.canvas || !this.context || !opts.visible) return;

    this.context.save();
    this.context.lineWidth = 1;
    this.context.fillStyle = opts.color;
    this.context.strokeStyle = opts.color;

    this.context.translate(...this.centerPoint);
    this.context.rotate(Math.PI);
    this.context.beginPath();

    const dig = Math.PI / 5 * 4;

    for (let i = 0; i < 5; i++) {
      const x = Math.sin(i * dig);
      const y = Math.cos(i * dig);
      this.context.lineTo(x * opts.size, y * opts.size);
    }

    this.context.closePath();
    this.context.stroke();
    this.context.fill();
    this.context.restore();
  }

  /**
   * 绘制水平文案
   * @param opts
   */
  writeHorizontalText({
    visible,
    text,
    color,
    fontWeight,
    fontSize,
    distance = 0,
    textBaseline = 'bottom'
  }: Required<TextOptions> & { textBaseline?: CanvasTextBaseline }) {
    if (!this.canvas || !this.context || !visible || !text) return;

    this.context.save();
    this.context.font = getFontStr({
      fontWeight,
      fontSize,
    });
    this.context.fillStyle = color;

    this.context.textBaseline = textBaseline;
    this.context.textAlign = 'center';

    this.context.lineWidth = 1;

    this.context.fillText(text, this.centerPoint[0], this.centerPoint[1] + distance);
    this.context.restore();
}

  /**
   * 绘制环绕文案
   * @param opts
   */
  writeSurroundText({
    visible,
    text,
    color,
    radius,
    fontSize,
    fontWeight,
    position = 'top',
    startDegree = 25,
  }: WriteSurroundTextOptions) {
    if (!this.canvas || !this.context || !visible || !text) return;

    if (this.options.shape === 'square') {
      this.writeSquareText({ visible, text, color, radius, fontSize, fontWeight, position, startDegree, distance: 0 });
      return;
    }

    if (this.options.shape === 'ellipse') {
      this.writeEllipseText({ visible, text, color, radius, fontSize, fontWeight, position, startDegree, distance: 0 });
      return;
    }

    this.context.save();
    this.context.font = getFontStr({
      fontWeight: fontWeight,
      fontSize: fontSize,
    });
    this.context.fillStyle = color;

    this.context.textAlign ='center';
    this.context.textBaseline = 'alphabetic';
    this.context.translate(...this.centerPoint);

    const count = text.length;
    const chars = text.split('').reverse();

    const textDegree = position === 'top'
      ? -(startDegree * 2 + 180) / (count - 1)
      : (startDegree * 2) / (count - 1)

    for (let i = 0; i < count; i++){
      const char = chars[i];

      this.context.rotate((i === 0 ? startDegree : textDegree) * Math.PI / 180);

      const { width } = this.context.measureText(char)

      this.context.save();
      this.context.translate(radius - width / 2, 0);
      this.context.rotate((position === 'top' ? 90 : -90) * Math.PI / 180);
      this.context.fillText(char, 0, 5);
      this.context.restore();
    }

    this.context.restore();
  }

  /**
   * 绘制椭圆印章的上下弧形文案。
   * 椭圆使用参数方程定位字符，并沿切线旋转，避免直接套用圆形半径导致文字变形。
   */
  private writeEllipseText({
    text,
    color,
    radius,
    fontSize,
    fontWeight,
    position = 'top',
    startDegree = 25,
  }: WriteSurroundTextOptions) {
    if (!this.canvas || !this.context || !text) return;

    const start = Math.max(0, Math.min(80, startDegree)) * Math.PI / 180;
    const span = Math.PI - start * 2;
    const maxRadius = this.getMaxRadius();
    const rx = Math.min(radius, maxRadius);
    const ry = Math.min(radius * 0.68, maxRadius * 0.78);

    this.context.save();
    this.context.fillStyle = color;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = getFontStr({ fontWeight, fontSize });

    const arcLength = ((rx + ry) / 2) * span;
    const measuredWidth = this.context.measureText(text).width;
    const fittedSize = measuredWidth > arcLength
      ? Math.max(10, fontSize * arcLength / measuredWidth)
      : fontSize;
    if (fittedSize !== fontSize) {
      this.context.font = getFontStr({ fontWeight, fontSize: fittedSize });
    }

    const chars = text.split('');
    const denominator = Math.max(chars.length - 1, 1);

    for (let i = 0; i < chars.length; i++) {
      const progress = i / denominator;
      const angle = position === 'top'
        ? Math.PI + start + progress * span
        : Math.PI - start - progress * span;
      const tangentAngle = position === 'top'
        ? Math.atan2(ry * Math.cos(angle), -rx * Math.sin(angle))
        : Math.atan2(-ry * Math.cos(angle), rx * Math.sin(angle));

      this.context.save();
      this.context.translate(
        this.centerPoint[0] + rx * Math.cos(angle),
        this.centerPoint[1] + ry * Math.sin(angle),
      );
      this.context.rotate(tangentAngle);
      this.context.fillText(chars[i], 0, 0);
      this.context.restore();
    }

    this.context.restore();
  }

  /** 绘制方形印章上下两条直线文案，并自动压缩过长文本。 */
  private writeSquareText({
    text,
    color,
    radius,
    fontSize,
    fontWeight,
    position = 'top',
    startDegree = 25,
  }: WriteSurroundTextOptions) {
    if (!this.canvas || !this.context || !text) return;

    const half = Math.min(radius, this.getMaxRadius());
    const sideMargin = Math.max(fontSize / 2, Math.min(half * 0.14, startDegree));
    const availableWidth = Math.max(fontSize, half * 2 - sideMargin * 2);

    this.context.save();
    this.context.fillStyle = color;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = getFontStr({ fontWeight, fontSize });

    const measuredWidth = this.context.measureText(text).width;
    const fittedSize = measuredWidth > availableWidth
      ? Math.max(10, fontSize * availableWidth / measuredWidth)
      : fontSize;
    if (fittedSize !== fontSize) {
      this.context.font = getFontStr({ fontWeight, fontSize: fittedSize });
    }

    const left = this.centerPoint[0] - half + sideMargin;
    const right = this.centerPoint[0] + half - sideMargin;
    const denominator = Math.max(text.length - 1, 1);
    const y = position === 'top'
      ? this.centerPoint[1] - half + fittedSize * 0.75
      : this.centerPoint[1] + half - fittedSize * 0.75;

    for (let i = 0; i < text.length; i++) {
      const x = text.length === 1
        ? this.centerPoint[0]
        : left + (right - left) * (i / denominator);
      this.context.fillText(text[i], x, y);
    }

    this.context.restore();
  }

  /**
   * 绘制圆形
   * @param width 线条的宽度
   * @param color 线条的颜色
   * @param params 圆半径和圆心配置
   * @returns
   */
  drawCircle(
    width: number,
    color: string,
    {
      radius,
      shape = 'circle',
      circleCenter = {
        x: this.centerPoint[0],
        y: this.centerPoint[1],
      }
    }: DrawCircleOptions
  ) {
    if (!this.canvas || !this.context) return;

    this.context.save();
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.beginPath();

    if (shape === 'square') {
      this.drawSquarePath(circleCenter.x, circleCenter.y, radius - width / 2);
    } else if (shape === 'ellipse') {
      const [radiusX, radiusY] = this.getEllipseRadii(radius - width / 2);
      this.context.ellipse(circleCenter.x, circleCenter.y, radiusX, radiusY, 0, 0, Math.PI * 2);
    } else {
      this.context.arc(circleCenter.x, circleCenter.y, radius - width / 2, 0, Math.PI * 2);
    }

    this.context.stroke();
    this.context.restore();
  }

  private drawSquarePath(centerX: number, centerY: number, half: number) {
    if (!this.context) return;

    const left = centerX - half;
    const top = centerY - half;
    const right = centerX + half;
    const bottom = centerY + half;
    const corner = Math.min(10, half * 0.08);

    this.context.moveTo(left + corner, top);
    this.context.lineTo(right - corner, top);
    this.context.quadraticCurveTo(right, top, right, top + corner);
    this.context.lineTo(right, bottom - corner);
    this.context.quadraticCurveTo(right, bottom, right - corner, bottom);
    this.context.lineTo(left + corner, bottom);
    this.context.quadraticCurveTo(left, bottom, left, bottom - corner);
    this.context.lineTo(left, top + corner);
    this.context.quadraticCurveTo(left, top, left + corner, top);
    this.context.closePath();
  }

  private getEllipseRadii(radius: number): [number, number] {
    const maxRadius = this.getMaxRadius();
    return [
      Math.min(radius, maxRadius),
      Math.min(radius * 0.68, maxRadius * 0.78),
    ];
  }

  private getMaxRadius() {
    if (!this.canvas) return 0;
    return Math.min(this.canvas.width, this.canvas.height) / 2;
  }

  /**
   * 解析配置
   * @param opts
   * @param useDefault
   * @returns
   */
  resolveConfig(opts: Options, useDefault: boolean = true) {
    const options = Object.assign({}, defaultOpts, opts);

    const borderOpts = Object.assign({}, {
      ...(useDefault ? defaultBorderOpts : this.borderOpts),
      color: options.color,
      shape: options.shape,
    }, opts?.border);

    const innerBorderOpts = Object.assign({}, {
      ...(useDefault ? defaultInnerBorderOpts: this.innerBorderOpts),
      color: options.color,
      shape: options.shape,
    }, opts?.innerBorder);

    const innerLoopLineOpts = Object.assign({}, {
      ...(useDefault ? defaultInnerLoopLineOpts : this.innerLoopLineOpts),
      color: options.color,
      shape: options.shape,
    }, opts?.innerLoopLine);

    const fiveStarOpts = Object.assign({}, {
      ...(useDefault ? defaultFiveStarOpts: this.fiveStarOpts),
      color: options.color,
    }, opts?.fiveStar);

    const textOpts = Object.assign({}, {
      ...(useDefault ? defaultTextOpts : this.textOpts),
      color: options.color,
    }, opts?.text) as Required<TextOptions>;

    const subTextOpts = Object.assign({}, {
      ...(useDefault ? defaultSubTextOpts : this.subTextOpts),
      color: options.color,
    }, opts?.subText) as Required<TextOptions>;

    const serNoOpts = Object.assign({}, {
      ...(useDefault ? defaultSerNoOpts : this.serNoOpts),
      color: options.color,
    }, opts?.serNo) as Required<TextOptions>;

    const centerTextOpts = Object.assign({}, {
      ...(useDefault ? defaultCenterTextOpts : this.centerTextOpts),
      color: options.color,
    }, opts?.centerText) as Required<TextOptions>;

    return {
      options,
      borderOpts,
      innerBorderOpts,
      innerLoopLineOpts,
      fiveStarOpts,
      textOpts,
      subTextOpts,
      serNoOpts,
      centerTextOpts,
    }
  }
}

export {
  defaultOpts,
  defaultBorderOpts,
  defaultInnerLoopLineOpts,
  defaultFiveStarOpts,
  defaultTextOpts,
  defaultSerNoOpts,
  defaultSubTextOpts,
  defaultInnerBorderOpts,
  defaultCenterTextOpts,
};
export type { Options, BorderOptions, FiveStar, TextOptions } from './types';
