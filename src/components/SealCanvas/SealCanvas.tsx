import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Seal, Options } from '../../seal';

export interface SealCanvasHandle {
  download: () => string | undefined;
}

interface SealCanvasProps {
  options: Options;
}

export const SealCanvas = forwardRef<SealCanvasHandle, SealCanvasProps>(({ options }, ref) => {
  const el = useRef<HTMLDivElement>(null);
  const initialOptions = useRef(options);
  const seal = useRef<Seal | undefined>(undefined);

  useEffect(() => {
    if (el.current && !seal.current) {
      seal.current = new Seal(el.current, initialOptions.current);
    }

    const canvas = el.current?.querySelector('canvas');
    if (canvas) {
      canvas.setAttribute('aria-label', '当前印章只读预览');
      canvas.setAttribute('aria-readonly', 'true');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('draggable', 'false');
    }

    return () => {
      seal.current?.destroy();
      seal.current = undefined;
    };
  }, []);

  useEffect(() => {
    seal.current?.update(options);
  }, [options]);

  useImperativeHandle(ref, () => ({
    download: () => seal.current?.toBase64(true),
  }), []);

  return <div className="canvas-wrap" ref={el} aria-label="印章只读预览" data-readonly="true" />;
});
