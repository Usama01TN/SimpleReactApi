// React Bits component: CurvedLoop
// Source: https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/CurvedLoop
// Copyright (c) David Haz. Licensed under the MIT License with Commons Clause.
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './CurvedLoop.css';

export default function CurvedLoop({
  marqueeText = '',
  speed = 1.2,
  className = '',
  curveAmount = 300,
  direction = 'left',
  interactive = true,
}) {
  const text = useMemo(() => {
    const clean = marqueeText.replace(/\s+$/, '');
    return `${clean}\u00A0`;
  }, [marqueeText]);
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const directionRef = useRef(direction);
  const uid = useId().replace(/:/g, '');
  const pathId = `curved-loop-${uid}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;
  const totalText = spacing
    ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('')
    : text;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    const initial = -spacing;
    textPathRef.current.setAttribute('startOffset', `${initial}px`);
    setOffset(initial);
  }, [spacing]);

  useEffect(() => {
    if (!spacing) return undefined;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = directionRef.current === 'right' ? speed : -speed;
        const current = Number.parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let next = current + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute('startOffset', `${next}px`);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed]);

  const onPointerDown = (event) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const delta = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    let next = Number.parseFloat(textPathRef.current.getAttribute('startOffset') || '0') + delta;
    if (next <= -spacing) next += spacing;
    if (next > 0) next -= spacing;
    textPathRef.current.setAttribute('startOffset', `${next}px`);
    directionRef.current = delta >= 0 ? 'right' : 'left';
  };

  const endDrag = () => { dragRef.current = false; };

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: spacing ? 'visible' : 'hidden', cursor: interactive ? 'grab' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120" aria-hidden="true">
        <text ref={measureRef} xmlSpace="preserve" className={className} style={{ visibility: 'hidden', opacity: 0 }}>
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        {spacing > 0 && (
          <text fontWeight="700" xmlSpace="preserve" className={className}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${offset}px`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
