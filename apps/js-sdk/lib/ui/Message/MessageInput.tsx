import Message from 'ui/Message/index';
import { ChangeEvent, useEffect, useRef } from 'preact/compat';
import { signal, useSignal } from '@preact/signals';

const INITIAL_OPACITY = 8;
const showPrevMessageSignal = signal(false);

export default function MessageInput() {
  const opacitySignal = useSignal(INITIAL_OPACITY);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeInput = () => {
    Message.isVisibleSignal.value = false;
  };

  const resetOpacity = () => {
    opacitySignal.value = INITIAL_OPACITY;
  };

  const resetInputWidth = () => {
    inputRef.current?.style.removeProperty('width');
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    resetOpacity();
    resetInputWidth();
    e.currentTarget.style.width = `${e.currentTarget.scrollWidth}px`;

    if (showPrevMessageSignal.value) {
      setTimeout(() => {
        showPrevMessageSignal.value = false;
      }, 200);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (Message.isVisibleSignal.value || showPrevMessageSignal.value) {
      resetOpacity();
      inputRef.current?.focus({
        preventScroll: true,
      });
      interval = setInterval(() => {
        if (opacitySignal.value > 0) {
          opacitySignal.value -= 0.3;
        }
      }, 250);
    }

    return () => clearInterval(interval);
  }, [Message.isVisibleSignal.value, showPrevMessageSignal.value]);

  useEffect(() => {
    if (opacitySignal.value <= 0) {
      Message.messageSignal.value = '';
      showPrevMessageSignal.value = false;
      closeInput();
      resetOpacity();
    }
  }, [opacitySignal.value]);

  return (
    <div
      id={Message.inputContainerId}
      ref={containerRef}
      style={{
        display: showPrevMessageSignal.value || Message.isVisibleSignal.value ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: 'white',
        whiteSpace: 'pre-wrap',
        transition: 'opacity 0.2s ease-in-out',
        opacity: opacitySignal.value,
        borderRadius: '8px',
        padding: '8px',
        lineHeight: '1.5',
        border: '1px solid #ccc',
      }}
    >
      {Message.isVisibleSignal.value && (
        <form
          tabIndex={-1}
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            Message.messageSignal.value = String(formData.get('message'));
            showPrevMessageSignal.value = true;
            resetInputWidth();
            form.reset();
          }}
        >
          <input
            tabIndex={-1}
            ref={inputRef}
            onChange={onInputChange}
            onBlur={closeInput}
            style={{
              padding: 0,
              outline: 'none',
              border: 'none',
              overflow: 'hidden',
              resize: 'none',
              wordBreak: 'break-all',
              fontSize: '14px',
            }}
            maxLength={50}
            name="message"
            placeholder="Message..."
            autocomplete="off"
            type="text"
            required
          />
        </form>
      )}
      <PrevMessageBox />
    </div>
  );
}

function PrevMessageBox() {
  return (
    <div
      tabIndex={-1}
      style={{
        fontSize: '14px',
        overflow: 'visible',
        wordBreak: 'break-all',
        transition: 'all 0.5s ease-in-out',
        opacity: showPrevMessageSignal.value ? 1 : 0,
        maxHeight: showPrevMessageSignal.value ? '300px' : 0,
      }}
    >
      {Message.messageSignal.value}
    </div>
  );
}
