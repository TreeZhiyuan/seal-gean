import type { ReactNode } from 'react';

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="ui-tooltip"><span className="ui-tooltip-trigger">{children}</span><span className="ui-tooltip-content" role="tooltip">{label}</span></span>;
}
