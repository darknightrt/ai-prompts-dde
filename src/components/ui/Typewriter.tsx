"use client";

import { useEffect, useState } from 'react';

// Default texts as fallback
const DEFAULT_TEXTS = ["终极艺术", "顶级技巧", "思维能力"];
const TYPING_SPEED = 150;
const DELETING_SPEED = 100;
const PAUSE_TIME = 2000;

interface TypewriterProps {
  texts?: string[];
  className?: string;
  cursorClassName?: string;
}

export default function Typewriter({ 
  texts = DEFAULT_TEXTS,
  className = "",
  cursorClassName = "bg-purple-600"
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);

  // 当外部传入的 texts 变化时，重置状态
  useEffect(() => {
      setLoopNum(0);
      setText('');
      setIsDeleting(false);
  }, [texts]);

  useEffect(() => {
    // 确保有文本可打
    const currentTexts = texts.length > 0 ? texts : DEFAULT_TEXTS;

    const handleType = () => {
      const i = loopNum % currentTexts.length;
      const fullText = currentTexts[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? DELETING_SPEED : TYPING_SPEED);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), PAUSE_TIME);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, texts]);

  return (
    <span className={className}>
      {text}
      <span className={`cursor inline-block w-1 h-[1em] ml-1 align-middle animate-pulse ${cursorClassName}`}></span>
    </span>
  );
}
