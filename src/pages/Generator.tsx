import { useEffect, useRef, useState } from 'react';
import { SealCanvas, SealCanvasHandle } from '../components/SealCanvas/SealCanvas';
import { SealForm } from '../components/SealForm/SealForm';
import { defaultBorderOpts, defaultCenterTextOpts, defaultFiveStarOpts, defaultInnerBorderOpts, defaultInnerLoopLineOpts, defaultOpts, defaultSerNoOpts, defaultSubTextOpts, defaultTextOpts, Options } from '../seal';
const initial: Options = { ...defaultOpts, type: 'company', shape: 'circle', text: { ...defaultTextOpts, text: '超级无敌爱国创新科技有限公司' }, subText: { ...defaultSubTextOpts, text: '合同专用章' }, serNo: { ...defaultSerNoOpts }, fiveStar: { ...defaultFiveStarOpts, color: 'red' }, border: { ...defaultBorderOpts, color: 'red' }, innerBorder: { ...defaultInnerBorderOpts, color: 'red' }, innerLoopLine: { ...defaultInnerLoopLineOpts, color: 'red' }, centerText: { ...defaultCenterTextOpts, text: '测试文案' } };
export function Generator() {
  const [options, setOptions] = useState<Options>(initial);
  const canvas = useRef<SealCanvasHandle>(null);

  useEffect(() => {
    document.title = '在线印章生成器 - 免费制作印章图片';
  }, []);

  return <main className="configurator" aria-label="印章生成工具">
      <div className="preview-panel"><div className="preview-stage"><SealCanvas ref={canvas} options={options} /></div></div>
      <div className="configuration">
        <div className="configuration-header"><h1>印章生成器</h1><div><button className="text-button" onClick={() => canvas.current?.download()}>下载印章</button></div></div>
        <SealForm options={options} onChange={setOptions} />
      </div>
  </main>;
}
