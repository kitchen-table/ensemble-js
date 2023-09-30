import { ComponentChildren, JSX } from 'preact';
import { css } from '@emotion/css';

type FABIconProps = {
  children: ComponentChildren;
} & Omit<JSX.IntrinsicElements['div'], 'className'>;

export default function FABIcon({ children, ...restProps }: FABIconProps) {
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: auto;

        border: 2px solid #3d3939;
        width: 32px;
        height: 30px;
        border-radius: 8px;

        &:hover {
          transform: scale(1.03);
          transition: transform 0.2s;
        }
      `}
      {...restProps}
    >
      <div
        className={css`
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
          &:active {
            transform: scale(1.03);
          }
          svg {
            pointer-events: none;
          }
        `}
      >
        {children}
      </div>
    </div>
  );
}
