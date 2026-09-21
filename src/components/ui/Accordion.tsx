import type { MouseEvent, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AccordionItem({ title, children, defaultOpen = true, description, open, onOpenChange }: AccordionItemProps) {
  const isControlled = open !== undefined;
  const handleSummaryClick = (event: MouseEvent<HTMLElement>) => {
    if (!isControlled) return;
    event.preventDefault();
    onOpenChange?.(!open);
  };

  return <details className="ui-accordion-item" open={isControlled ? open : defaultOpen}>
    <summary onClick={handleSummaryClick}><span><strong>{title}</strong>{description && <small>{description}</small>}</span><ChevronDown size={17} aria-hidden="true" /></summary>
    <div className="ui-accordion-content">{children}</div>
  </details>;
}
