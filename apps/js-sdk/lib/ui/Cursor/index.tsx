import { signal, Signal } from '@preact/signals';
import { render } from 'preact';
import Cursors from 'ui/Cursor/Cursors';
import CursorClicks from 'ui/Cursor/CursorClicks';
import invariant from 'ts-invariant';
import Config from 'config';
import { resolve, TYPE, wire } from 'di';
import UIStateStorage from 'storage/UIStateStorage';

export type CursorData = {
  id: string;
  color: string;
  x: number;
  y: number;
};

class Cursor {
  private static cursorStyleId = 'kitchen-table-cursor-style';
  private static containerId = 'kitchen-table-cursors-container';
  static size = 28;
  static cursorSignals: Signal<CursorData[]> = signal([]);
  static cursorClickSignals: Signal<CursorData[]> = signal([]);

  config!: Config;
  uiStateStorage!: UIStateStorage;

  static getCursorSVG(color: string, isMyCursor?: boolean) {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 28 28" fill="${color}" style="filter: drop-shadow(1px 1px 2px rgb(0 0 0 / 0.2));">
        <polygon fill="white" points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 "/>
        <polygon fill="white" points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 "/>
        <rect x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2" height="8"/>
        <polygon points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 "/>
    </svg>
    `;
  }

  constructor() {
    wire(this, 'config', TYPE.CONFIG);
    wire(this, 'uiStateStorage', TYPE.UI_STATE_STORAGE);

    this.mount();
  }

  setUserCursor(color: string) {
    const prevCursorCss = document.getElementById(Cursor.cursorStyleId);
    prevCursorCss?.remove();

    const blob = new Blob([Cursor.getCursorSVG(color, true)], { type: 'image/svg+xml' });
    const URL = window.URL.createObjectURL(blob);
    const cssString = ` * { cursor: url(${URL}) ${2} ${2}, auto; }`;
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
    this.uiStateStorage.setShowCursor(false);
  }

  deleteCursor(id: string) {
    const index = Cursor.cursorSignals.value.findIndex((cursor) => cursor.id === id);
    if (index === -1) {
      return;
    }
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
  const getUIState = resolve(TYPE.UI_STATE_STORAGE);
  if (!getUIState().getShowCursor()) {
    return null;
  }
  return (
    <>
      <Cursors />
      <CursorClicks />
    </>
  );
};

export default Cursor;
