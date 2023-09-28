import Message from 'ui/Message/index';
import { css } from '@emotion/css';
import { useEffect, useRef } from 'preact/compat';
import { useSignal } from '@preact/signals';

const INITIAL_OPACITY = 8;

export default function MessageInput() {
  const opacitySignal = useSignal(INITIAL_OPACITY);
  const showPrevMessageSignal = useSignal(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeInput = () => {
    Message.isVisibleSignal.value = false;
    Message.messageSignal.value = '';
    showPrevMessageSignal.value = false;
  };

  const resetOpacity = () => {
    opacitySignal.value = INITIAL_OPACITY;
  };

  const onInputChange = () => {
    resetOpacity();
    showPrevMessageSignal.value = false;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (Message.isVisibleSignal.value) {
      resetOpacity();
      inputRef.current?.focus();
      interval = setInterval(() => {
        if (opacitySignal.value > 0) {
          opacitySignal.value -= 0.3;
        }
      }, 250);
    }

    return () => clearInterval(interval);
  }, [Message.isVisibleSignal.value]);

  useEffect(() => {
    if (opacitySignal.value <= 0) {
      Message.messageSignal.value = '';
      closeInput();
      resetOpacity();
    }
  }, [opacitySignal.value]);

  if (!Message.isVisibleSignal.value) {
    return null;
  }
  if (Message.mousePositionSignal.value.x === 0 || Message.mousePositionSignal.value.y === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={css`
        position: absolute;
        font-size: 14px;
        z-index: 1000;
        background-color: white;
        white-space: pre-wrap;
        transition: opacity 0.2s ease-in-out;
        opacity: ${opacitySignal.value};
        border-radius: 8px;
        padding: 8px;
        line-height: 1.5;
        top: ${Message.mousePositionSignal.value.y + 20}px;
        left: ${Message.mousePositionSignal.value.x + 20}px;
        border: 1px solid #ccc;
      `}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          Message.messageSignal.value = String(formData.get('message'));
          showPrevMessageSignal.value = true;
          form.reset();
        }}
      >
        <input
          ref={inputRef}
          onChange={onInputChange}
          onBlur={closeInput}
          className={css`
            outline: none;
            border: none;
            overflow: hidden;
          `}
          maxLength={80}
          name="message"
          placeholder="Message..."
          autocomplete="off"
          type="text"
          required
        />
      </form>
      <div
        className={css`
          padding: 0 0 2px 2px;
          overflow: visible;
          margin-top: 2px;
          transition: all 0.5s ease-in-out;
          opacity: ${showPrevMessageSignal.value ? 1 : 0};
          max-height: ${showPrevMessageSignal.value ? '300px' : 0};
        `}
      >
        {Message.messageSignal.value}
      </div>
    </div>
  );
}
