import { useId, useState, type ReactNode } from 'react';

interface TabItem { label: string; content: ReactNode; }

export function Tabs({ items, defaultIndex = 0 }: { items: TabItem[]; defaultIndex?: number }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const id = useId();
  return <div className="ui-tabs">
    <div className="ui-tabs-list" role="tablist" aria-label="预览视图">
      {items.map((item, index) => <button key={item.label} className={`ui-tab ${activeIndex === index ? 'is-active' : ''}`} role="tab" aria-selected={activeIndex === index} aria-controls={`${id}-panel-${index}`} id={`${id}-tab-${index}`} onClick={() => setActiveIndex(index)}>{item.label}</button>)}
    </div>
    {items.map((item, index) => <div key={item.label} className="ui-tab-panel" role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={activeIndex !== index}>{item.content}</div>)}
  </div>;
}
