import { Check, X } from 'lucide-react';
import { useEffect } from 'react';

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return <div className="ui-toast" role="status" aria-live="polite"><span className="ui-toast-icon"><Check size={15} aria-hidden="true" /></span><span>{message}</span><button type="button" className="ui-toast-close" onClick={onClose} aria-label="关闭提示"><X size={15} aria-hidden="true" /></button></div>;
}
