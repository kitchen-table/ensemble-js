import { ComponentChild, ComponentChildren, JSX } from 'preact';
import { css } from '@emotion/css';
import { useEffect, useRef } from 'preact/compat';
import { signal } from '@preact/signals';

type FABToggleProps = {
  icon: ComponentChild;
  children: ComponentChildren;
};

export default function FABToggle({ icon, children }: FABToggleProps) {
  const openSignal = signal<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (detailsRef.current?.contains(event.target as Node)) {
        return;
      }
      openSignal.value = false;
    }
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      open={openSignal}
      className={css`
        position: relative;
        cursor: pointer !important;
      `}
    >
      <summary
        onClick={(event) => {
          event.preventDefault();
          openSignal.value = !openSignal.value;
        }}
        className={css`
          list-style: none;
        `}
      >
        {icon}
      </summary>
      <div
        className={css`
          position: absolute;
          right: 56px;
          border-radius: 8px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          background-color: white;
          bottom: 0;
          padding: 8px;
        `}
      >
        {children}
      </div>
    </details>
  );
}
