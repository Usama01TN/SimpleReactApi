import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <Tag ref={elementRef} style={{ '--reveal-delay': `${delay}ms` }} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</Tag>;
}
