import { css } from '@emotion/css';
import { ComponentChildren } from 'preact';

export default function FABContainer({ children }: { children: ComponentChildren }) {
  return (
    <div
      id="kitchen-table-fab"
      className={css`
        position: fixed;
        bottom: 40px;
        right: 40px;
        z-index: 1;
      `}
    >
      <div
        className={css`
          display: grid;
          gap: 8px;
          width: 40px;
          min-height: 40px;
          padding: 8px 4px;
          background-color: white;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          border-radius: 8px;
        `}
      >
        {children}
      </div>
    </div>
  );
}
