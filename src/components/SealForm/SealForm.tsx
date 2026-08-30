import type { BorderOptions, FiveStar, Options, TextOptions } from '../../seal';
import { AccordionItem } from '../ui/Accordion';

interface SealFormProps { options: Options; onChange: (options: Options) => void; }

function SwitchField({ label, value, onChange, hint }: { label: string; value: boolean | undefined; onChange: (value: boolean) => void; hint?: string }) {
  return <label className="field switch-field"><span>{label}{hint && <small>{hint}</small>}</span><input aria-label={label} type="checkbox" checked={Boolean(value)} onChange={event => onChange(event.target.checked)} /><i /></label>;
}

function ColorField({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return <label className="field color-field"><span>{label}</span><span className="color-control"><input aria-label={label} type="color" value={value || '#ff0000'} onChange={event => onChange(event.target.value)} /><code>{value || '#ff0000'}</code></span></label>;
}

function NumberField({ label, value, onChange, hint, disabled = false }: { label: string; value?: number; onChange: (value: number) => void; hint?: string; disabled?: boolean }) {
  const numberHint = `${hint ? `${hint}，` : ''}可使用键盘上/下方向键调整数值`;
  return <label className="field"><span>{label}{hint && <small>{hint}</small>}</span><input aria-label={label} aria-keyshortcuts={disabled ? undefined : 'ArrowUp ArrowDown'} title={disabled ? undefined : numberHint} type="number" value={value ?? 0} disabled={disabled} onChange={event => onChange(Number(event.target.value))} /></label>;
}

function TextField({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span><input aria-label={label} type="text" placeholder="请输入" value={value || ''} onChange={event => onChange(event.target.value)} /></label>;
}

function BorderSection({ title, value, color, onChange, defaultOpen = true, description }: { title: string; value: BorderOptions | undefined; color: string; onChange: (value: BorderOptions) => void; defaultOpen?: boolean; description?: string }) {
  const current = { visible: true, color, width: 1, radius: 100, ...value };
  return <AccordionItem title={title} description={description} defaultOpen={defaultOpen}><div className="fields-row"><SwitchField label="是否显示" value={current.visible} onChange={visible => onChange({ ...current, visible })} /><ColorField label="颜色" value={current.color} onChange={borderColor => onChange({ ...current, color: borderColor })} /><NumberField label="线宽" value={current.width} onChange={width => onChange({ ...current, width })} /><NumberField label="半径" value={current.radius} hint="距离中心点的距离" onChange={radius => onChange({ ...current, radius })} /></div></AccordionItem>;
}

function TextSection({ title, value, color, mode, onChange, defaultOpen = true, description }: { title: string; value: TextOptions | undefined; color: string; mode: 'surround' | 'horizontal'; onChange: (value: TextOptions) => void; defaultOpen?: boolean; description?: string }) {
  const current = { visible: true, color, fontSize: 24, fontWeight: 600, text: '', distance: 0, radius: 120, startDegree: 25, ...value };
  return <AccordionItem title={title} description={description} defaultOpen={defaultOpen}><div className="fields-row"><SwitchField label="是否显示" value={current.visible} onChange={visible => onChange({ ...current, visible })} /><ColorField label="颜色" value={current.color} onChange={textColor => onChange({ ...current, color: textColor })} /><TextField label="文案" value={current.text} onChange={text => onChange({ ...current, text })} /><NumberField label="字体大小" value={current.fontSize} onChange={fontSize => onChange({ ...current, fontSize })} /><NumberField label="字体粗细" value={Number(current.fontWeight)} onChange={fontWeight => onChange({ ...current, fontWeight })} />{mode === 'surround' ? <><NumberField label="半径" value={current.radius} onChange={radius => onChange({ ...current, radius })} /><NumberField label="字体开始角度" value={current.startDegree} onChange={startDegree => onChange({ ...current, startDegree })} /></> : <NumberField label="距离" value={current.distance} hint="距离中心点的距离" onChange={distance => onChange({ ...current, distance })} />}</div></AccordionItem>;
}

export function SealForm({ options, onChange }: SealFormProps) {
  const color = options.color || '#ff0000';
  const patch = (next: Partial<Options>) => onChange({ ...options, ...next });
  const patchText = (key: 'text' | 'subText' | 'centerText' | 'serNo', value: TextOptions) => onChange({ ...options, [key]: value });

  return <div className="form-panel">
    <AccordionItem title="基本配置" description="类型、形状与画布" defaultOpen>
      <div className="fields-row basics">
        <label className="field"><span>印章类型</span><select aria-label="印章类型" value={options.type || 'company'} onChange={event => patch({ type: event.target.value as Options['type'] })}><option value="company">公司公章</option><option value="personal">个人印章</option></select></label>
        <label className="field"><span>印章形状</span><select aria-label="印章形状" value={options.shape || 'circle'} onChange={event => patch({ shape: event.target.value as Options['shape'] })}><option value="circle">圆形</option><option value="square">方形</option><option value="ellipse">椭圆</option></select></label>
        <SwitchField label="显示透明背景" value={options.showTransparent} onChange={showTransparent => patch({ showTransparent })} />
        <ColorField label="印章颜色" value={color} onChange={nextColor => patch({ color: nextColor })} />
        <NumberField label="画布宽度" value={options.width} disabled onChange={width => patch({ width })} />
        <NumberField label="画布高度" value={options.height} disabled onChange={height => patch({ height })} />
      </div>
    </AccordionItem>

    <BorderSection title="边线配置" value={options.border} color={color} onChange={border => patch({ border })} description="外圈边框样式" />
    <BorderSection title="内边线配置" value={options.innerBorder} color={color} onChange={innerBorder => patch({ innerBorder })} defaultOpen={false} description="内圈边框样式" />
    <BorderSection title="内环线配置" value={options.innerLoopLine} color={color} onChange={innerLoopLine => patch({ innerLoopLine })} defaultOpen={false} description="辅助环线样式" />

    <AccordionItem title="五角星配置" description="中心图形样式" defaultOpen>
      <div className="fields-row"><SwitchField label="是否显示" value={options.fiveStar?.visible} onChange={visible => patch({ fiveStar: { color, ...options.fiveStar, visible } as FiveStar })} /><ColorField label="颜色" value={options.fiveStar?.color || color} onChange={starColor => patch({ fiveStar: { color: starColor, ...options.fiveStar } as FiveStar })} /><NumberField label="大小" value={options.fiveStar?.size} onChange={size => patch({ fiveStar: { color, ...options.fiveStar, size } as FiveStar })} /></div>
    </AccordionItem>

    <TextSection title="主文字配置" value={options.text} color={color} mode="surround" onChange={value => patchText('text', value)} description="环绕印章上方的主文案" />
    <TextSection title="副文字配置" value={options.subText} color={color} mode="horizontal" onChange={value => patchText('subText', value)} description="印章中心上方的副文案" />
    <TextSection title="中心文字配置" value={options.centerText} color={color} mode="horizontal" onChange={value => patchText('centerText', value)} description="印章中心的文字" />
    <TextSection title="序列号配置" value={options.serNo} color={color} mode="surround" onChange={value => patchText('serNo', value)} defaultOpen={false} description="底部环绕序列号" />
  </div>;
}
