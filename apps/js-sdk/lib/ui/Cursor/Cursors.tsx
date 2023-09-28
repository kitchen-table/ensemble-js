import Cursor from 'ui/Cursor/index';
import { css } from '@emotion/css';
import MessageBox from 'ui/Message/MessageBox';

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
              pointer-events: none;
              z-index: 9999;
            `}
          >
            <div
              className={css`
                width: ${Cursor.size}px;
                height: ${Cursor.size}px;
              `}
              dangerouslySetInnerHTML={{
                __html: Cursor.getCursorSVG(cursor.color),
              }}
            />
            <MessageBox id={cursor.id} color={cursor.color} />
          </div>
        );
      })}
    </>
  );
}
