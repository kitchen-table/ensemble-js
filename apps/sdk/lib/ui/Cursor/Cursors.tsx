import Cursor, { CursorData } from 'ui/Cursor/index';
import MessageBox from 'ui/Message/MessageBox';
import { css } from '@emotion/css';
import { useEffect, useState } from 'preact/compat';
import { debounce } from 'utils/debounce';

export default function Cursors() {
  const _setRenderNumber = useState(0)[1];

  const rerender = () => {
    _setRenderNumber((prev) => prev + 1);
  };

  useEffect(() => {
    const onScroll = debounce(rerender, 100);

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const getCursorAnchor = (cursor: CursorData) => {
    const location = getCursorPlace(cursor.x, cursor.y);
    if (location === 'center') {
      return '';
    }
    return css`
      ::after {
        content: '${getCursorCharacter(location)}';
        position: fixed;
        pointer-events: none;
        font-size: 14px;
        color: ${cursor.color};
        ${getCursorAnchorPosition(cursor, location)};
      }
    `;
  };

  return (
    <>
      {Cursor.cursorSignals.value.map((cursor) => {
        return (
          <div
            key={cursor.id}
            id={`ensemble-js-cursor-${cursor.id}`}
            style={{
              position: 'absolute',
              top: cursor.y - 7,
              left: cursor.x - 9,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            class={getCursorAnchor(cursor)}
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

type CursorPlace = 'top' | 'bottom' | 'left' | 'right' | 'center';

function getCursorPlace(x: number, y: number): CursorPlace {
  const visibleLeft = window.scrollX;
  const visibleRight = visibleLeft + window.innerWidth;
  const visibleTop = window.scrollY;
  const visibleBottom = visibleTop + window.innerHeight;
  if (x < visibleLeft) {
    return 'left';
  }
  if (x > visibleRight) {
    return 'right';
  }
  if (y < visibleTop) {
    return 'top';
  }
  if (y > visibleBottom) {
    return 'bottom';
  }
  return 'center';
}

const getCursorCharacter = (cursorPlace: CursorPlace) => {
  switch (cursorPlace) {
    case 'top':
      return '▲';
    case 'bottom':
      return '▼';
    case 'right':
      return '▶';
    case 'left':
      return '◀';
    default:
      return '';
  }
};

const getCursorAnchorPosition = (data: CursorData, cursorPlace: CursorPlace) => {
  const min = 0;

  const x = Math.max(data.x - window.scrollX, min);
  const y = Math.max(data.y - window.scrollY, min);

  switch (cursorPlace) {
    case 'top':
      return `top: 0; left: ${Math.min(x, window.innerWidth - 10)}px;`;
    case 'bottom':
      return `bottom: 0; left: ${Math.min(x, window.innerWidth - 10)}px;`;
    case 'left':
      return `left: 0; top: ${Math.min(y, window.innerHeight - 10)}px;`;
    case 'right':
      return `right: 0; top: ${Math.min(y, window.innerHeight - 10)}px;`;
    default:
      return '';
  }
};
