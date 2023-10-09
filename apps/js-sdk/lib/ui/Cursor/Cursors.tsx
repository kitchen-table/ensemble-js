import Cursor from 'ui/Cursor/index';
import MessageBox from 'ui/Message/MessageBox';

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
