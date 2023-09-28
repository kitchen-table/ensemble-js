import Cursor from 'ui/Cursor/index';
import { css } from '@emotion/css';

export default function Cursors() {
  return (
    <>
      {Cursor.cursorSignals.value.map((cursor) => {
        return (
          <div
            key={cursor.id}
            id={`kitchen-table-cursor-${cursor.id}`}
            className={css`
              position: absolute;
              top: ${cursor.y - 2}px;
              left: ${cursor.x - 2}px;
              width: ${Cursor.size}px;
              height: ${Cursor.size}px;
              pointer-events: none;
              z-index: 9999;
            `}
            dangerouslySetInnerHTML={{
              __html: Cursor.getCursorSVG(cursor.color),
            }}
          />
        );
      })}
    </>
  );
}
