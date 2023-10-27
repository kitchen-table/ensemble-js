import Cursor, { CursorData } from 'ui/Cursor/index';
import { keyframes } from '@emotion/css';
import { useEffect } from 'preact/compat';
import { useSignal } from '@preact/signals';

export default function CursorClicks() {
  return (
    <>
      {Cursor.cursorClickSignals.value.map((cursor) => {
        return <CursorClick key={cursor.id} cursor={cursor} />;
      })}
    </>
  );
}

const minimize = keyframes`
  from {
    transform: scale(1);
  }
  10% {
    transform: scale(1.1);
  }
  to {
    transform: scale(0);
  }
`;

const CursorClick = ({ cursor }: { cursor: CursorData }) => {
  const fadeOutSignal = useSignal(1);

  useEffect(() => {
    fadeOutSignal.value = 2;
    const interval = setInterval(() => {
      fadeOutSignal.value = fadeOutSignal.peek() * 0.8;
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div
      style={{
        position: 'absolute',
        top: cursor.y - 10,
        left: cursor.x - 10,
        pointerEvents: 'none',
        zIndex: 1001,
        opacity: 0.5,
        backgroundColor: cursor.color,
        transition: 'all 0.2s',
        borderRadius: '50%',
        width: 14,
        height: 14,
        animation: `${minimize} 1s ease forwards`,
      }}
    />
  );
};
