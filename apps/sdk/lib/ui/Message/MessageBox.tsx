import Message from 'ui/Message/index';
import { useEffect, useRef } from 'preact/compat';
import { useSignal } from '@preact/signals';

const INITIAL_OPACITY = 8;

export default function MessageBox({ id, color }: { id: string; color: string }) {
  const messageRef = useRef<HTMLSpanElement>(null);
  const opacitySignal = useSignal(INITIAL_OPACITY);
  const message = Message.currentMessagesSignal.value[id];

  useEffect(() => {
    opacitySignal.value = INITIAL_OPACITY;

    const interval = setInterval(() => {
      opacitySignal.value -= 0.3;
      if (opacitySignal.value <= 0) {
        Message.currentMessagesSignal.value = {
          ...Message.currentMessagesSignal.value,
          [id]: '',
        };
      }
    }, 250);

    return () => clearInterval(interval);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <span
      ref={messageRef}
      id={`ensemble-js-cursor-message-${id}`}
      style={{
        display: 'inline-block',
        position: 'relative',
        left: '20px',
        backgroundColor: 'white',
        transform: opacitySignal.value === INITIAL_OPACITY ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.5s ease-in-out',
        opacity: opacitySignal.value,
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '6px 8px',
        lineHeight: '1.5',
      }}
    >
      {message}
    </span>
  );
}
