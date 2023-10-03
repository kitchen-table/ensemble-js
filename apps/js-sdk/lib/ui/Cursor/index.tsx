import { signal, Signal } from '@preact/signals';
import { render } from 'preact';
import Cursors from 'ui/Cursor/Cursors';
import CursorClicks from 'ui/Cursor/CursorClicks';
import invariant from 'ts-invariant';
import Config from 'config';
import { TYPE, wire } from 'di';

export type CursorData = {
  id: string;
  color: string;
  x: number;
  y: number;
};

class Cursor {
  private static cursorStyleId = 'kitchen-table-cursor-style';
  private static containerId = 'kitchen-table-cursors-container';
  static size = 24;
  static cursorSignals: Signal<CursorData[]> = signal([]);
  static cursorClickSignals: Signal<CursorData[]> = signal([]);

  config!: Config;

  static getCursorSVG(color: string, isMyCursor?: boolean) {
    return `
    <svg fill="#E2E2E2" width="${this.size}px" height="${this.size}px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.1,4.46l7.21,15.92A1.17,1.17,0,0,0,12.5,20l1.26-6.23L20,12.5a1.17,1.17,0,0,0,.39-2.19L4.46,3.1A1,1,0,0,0,3.1,4.46Z" style="fill: ${color}; stroke-width: 2;"></path>
      <path d="M3.1,4.46l7.21,15.92A1.17,1.17,0,0,0,12.5,20l1.26-6.23L20,12.5a1.17,1.17,0,0,0,.39-2.19L4.46,3.1A1,1,0,0,0,3.1,4.46Z" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
    </svg>`;
  }

  constructor() {
    wire(this, 'config', TYPE.CONFIG);

    this.mount();
  }

  setUserCursor(color: string) {
    const blob = new Blob([Cursor.getCursorSVG(color, true)], { type: 'image/svg+xml' });
    const URL = window.URL.createObjectURL(blob);
    const cssString = `
      * {
        cursor: url(${URL}) ${2} ${2}, auto;
      }
    `;
    const style = document.createElement('style');
    style.id = Cursor.cursorStyleId;
    style.innerHTML = cssString;
    document.head.appendChild(style);
  }

  restoreUserCursor() {
    document.head.removeChild(document.getElementById(Cursor.cursorStyleId)!);
  }

  private mount() {
    const container = document.createElement('div');
    container.id = Cursor.containerId;
    document.body.appendChild(container);
    render(<CursorRoot />, container);
  }

  unmount() {
    const container = document.getElementById(Cursor.containerId);
    invariant(container, 'Cursor container not found');
    container.remove();
  }

  deleteCursor(id: string) {
    Cursor.cursorSignals.value = Cursor.cursorSignals.value.filter((cursor) => cursor.id !== id);
  }

  deleteCursorClick(id: string) {
    Cursor.cursorClickSignals.value = Cursor.cursorClickSignals
      .peek()
      .filter((cursor) => cursor.id !== id);
  }

  moveCursor(data: CursorData) {
    const hasCursor = Cursor.cursorSignals.value.find((cursor) => cursor.id === data.id);
    if (hasCursor) {
      Cursor.cursorSignals.value = Cursor.cursorSignals.value.map((cursor) => {
        if (cursor.id === data.id) {
          return data;
        }
        return cursor;
      });
    } else {
      Cursor.cursorSignals.value.push(data);
    }
  }

  click(data: CursorData, isMyCursor: boolean) {
    Cursor.cursorClickSignals.value = Cursor.cursorClickSignals.value.concat(data);
    if (isMyCursor) {
      return;
    }
    /**
     * @experimental
     * This is a hack to make the click event work on the remote cursor.
     */
    if (this.config.getIsActivateExperimental()) {
      const element = document.elementFromPoint(data.x, data.y);
      if (element) {
        const customEvent = new PointerEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: data.x,
          clientY: data.y,
        });
        // @ts-ignore
        customEvent.isKitchenTableEvent = true;
        element.dispatchEvent(customEvent);
      }
    }
  }

  static hasThis(element: HTMLElement) {
    const container = document.getElementById(this.containerId);
    invariant(container, 'Cursor container not found');
    return container.contains(element);
  }
}

const CursorRoot = () => {
  return (
    <>
      <Cursors />
      <CursorClicks />
    </>
  );
};

export default Cursor;
