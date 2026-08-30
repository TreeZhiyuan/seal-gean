import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function AccordionItem({ title, children, defaultOpen = true, description }: { title: string; children: ReactNode; defaultOpen?: boolean; description?: string }) {
  return <details className="ui-accordion-item" open={defaultOpen}>
    <summary><span><strong>{title}</strong>{description && <small>{description}</small>}</span><ChevronDown size={17} aria-hidden="true" /></summary>
    <div className="ui-accordion-content">{children}</div>
  </details>;
}
