import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { SealCanvas, SealCanvasHandle } from '../components/SealCanvas/SealCanvas';
import { SealForm } from '../components/SealForm/SealForm';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Toast } from '../components/ui/Toast';
import { Tooltip } from '../components/ui/Tooltip';
import { defaultBorderOpts, defaultCenterTextOpts, defaultFiveStarOpts, defaultInnerBorderOpts, defaultInnerLoopLineOpts, defaultOpts, defaultSerNoOpts, defaultSubTextOpts, defaultTextOpts, Options } from '../seal';

const initial: Options = { ...defaultOpts, type: 'company', shape: 'circle', text: { ...defaultTextOpts, text: '保护伞进化卡普空制药责任有限公司' }, subText: { ...defaultSubTextOpts, text: '浣熊养殖基地' }, serNo: { ...defaultSerNoOpts }, fiveStar: { ...defaultFiveStarOpts, color: 'red' }, border: { ...defaultBorderOpts, color: 'red' }, innerBorder: { ...defaultInnerBorderOpts, color: 'red' }, innerLoopLine: { ...defaultInnerLoopLineOpts, color: 'red' }, centerText: { ...defaultCenterTextOpts, text: '生化危机' } };

export function Generator() {
  const [options, setOptions] = useState<Options>(initial);
  const [toast, setToast] = useState<string | null>(null);
  const canvas = useRef<SealCanvasHandle>(null);

  useEffect(() => {
    document.title = '在线印章生成器 - 免费制作印章图片';
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);
  const downloadSeal = useCallback(() => {
    if (canvas.current?.download()) setToast('印章已下载为 PNG');
  }, []);
  const resetOptions = useCallback(() => {
    setOptions({ ...initial, text: { ...initial.text }, subText: { ...initial.subText }, centerText: { ...initial.centerText } });
    setToast('已恢复默认配置');
  }, []);

  return <main className="generator-page" aria-label="印章生成工具">
    <section className="workspace-shell">
      <div className="preview-panel">
        <div className="preview-heading">
          <div><span className="section-kicker">LIVE PREVIEW</span><h1>印章预览</h1></div>
          <span className="preview-status"><span className="status-dot" />实时更新</span>
        </div>
        <Tabs items={[
          { label: '预览', content: <div className="preview-tab-content"><div className="preview-stage"><div className="preview-grid"><SealCanvas ref={canvas} options={options} /></div></div><div className="preview-caption"><ShieldCheck size={16} aria-hidden="true" /><span>所有配置均在浏览器本地处理</span></div></div> },
          { label: '使用提示', content: <div className="preview-tips"><div className="tip-item"><Sparkles size={17} aria-hidden="true" /><div><strong>从基本配置开始</strong><p>先选择印章类型和形状，再调整文案、颜色和边线。</p></div></div><div className="tip-item"><Download size={17} aria-hidden="true" /><div><strong>导出透明 PNG</strong><p>打开透明背景后下载，方便用于设计稿和演示文件。</p></div></div></div> }
        ]} />
      </div>

      <div className="configuration">
        <div className="configuration-header">
          <div><span className="section-kicker">CONFIGURATION</span><h2>调整印章细节</h2></div>
          <div className="configuration-actions">
            <Tooltip label="恢复默认配置"><Button type="button" variant="icon" onClick={resetOptions} aria-label="恢复默认配置"><RotateCcw size={17} aria-hidden="true" /></Button></Tooltip>
            <Button type="button" variant="primary" onClick={downloadSeal}><Download size={16} aria-hidden="true" /><span>下载 PNG</span></Button>
          </div>
        </div>
        <SealForm options={options} onChange={setOptions} />
      </div>
    </section>
    {toast && <Toast message={toast} onClose={dismissToast} />}
  </main>;
}
