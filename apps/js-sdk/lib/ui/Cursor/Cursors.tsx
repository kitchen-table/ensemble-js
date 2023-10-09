import Cursor from 'ui/Cursor/index';
import MessageBox from 'ui/Message/MessageBox';
import { css } from '@emotion/css';

export default function Cursors() {
  return (
    <>
      {Cursor.cursorSignals.value.map((cursor) => {
        return (
          <div
            key={cursor.id}
            id={`kitchen-table-cursor-${cursor.id}`}
            style={{
              position: 'absolute',
              top: cursor.y - 7,
              left: cursor.x - 9,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            class={css`
              ::after {
                content: '${cursor.name}';
                position: absolute;
                pointer-events: none;
                font-size: 12px;
                line-height: 1.3;
                color: ${cursor.color};
                white-space: pre-wrap;
                word-break: keep-all;
              }
            `}
          >
            <div
              style={{
                width: `${Cursor.size}px`,
                height: `${Cursor.size}px`,
              }}
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
