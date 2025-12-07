"use client";

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // 延迟时间 (ms)
  threshold?: number; // 触发阈值 0-1
}

export default function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0, 
  threshold = 0.15 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 添加一个小延迟以配合 CSS transition
            setTimeout(() => {
              setIsActive(true);
            }, delay);
            if (ref.current) observer.unobserve(ref.current); // 只触发一次
          }
        });
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay, threshold]);

  return (
    <div 
      ref={ref} 
      // 添加 'group' 类，允许子元素使用 group-[.active]: 前缀来响应激活状态
      className={`reveal group ${isActive ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
