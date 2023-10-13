import Cursor from 'ui/Cursor/index';
import MessageBox from 'ui/Message/MessageBox';
import { css } from '@emotion/css';
import { resolve, TYPE } from 'di';

export default function Cursors() {
  const getConfig = resolve(TYPE.CONFIG);

  return (
    <>
      {Cursor.cursorSignals.value.map((cursor) => {
        const cursorNameStyle = css`
          ::after {
            content: '${cursor.name}';
            position: absolute;
            pointer-events: none;
            transform: translate(90%, -20px);
            max-width: 30px;
            font-size: 12px;
            text-shadow: 1px 1px 2px #eae1e1;
            line-height: 1.3;
            color: ${cursor.color};
            white-space: pre-wrap;
            word-break: keep-all;
          }
        `;
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
            class={getConfig().getIsShowCursorName() ? cursorNameStyle : undefined}
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
