import { signal, Signal } from '@preact/signals';
import { render } from 'preact';
import Cursors from 'ui/Cursor/Cursors';
import CursorClicks from 'ui/Cursor/CursorClicks';
import invariant from 'ts-invariant';

export type CursorData = {
  id: string;
  color: string;
  x: number;
  y: number;
};

class Cursor {
  static containerId = 'kitchen-table-cursors-container';
  static size = 24;
  static cursorSignals: Signal<CursorData[]> = signal([]);
  static cursorClickSignals: Signal<CursorData[]> = signal([]);

  static getCursorSVG(color: string) {
    return `
    <svg fill="${color}" width="${this.size}px" height="${this.size}px" viewBox="0 0 24 24" id="cursor-up-left" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><path id="primary" d="M20.8,9.4,4.87,2.18A2,2,0,0,0,2.18,4.87h0L9.4,20.8A2,2,0,0,0,11.27,22h.25a2.26,2.26,0,0,0,2-1.8l1.13-5.58,5.58-1.13a2.26,2.26,0,0,0,1.8-2A2,2,0,0,0,20.8,9.4Z"></path></svg>`;
  }

  static setUserCursor(color: string) {
    const blob = new Blob([this.getCursorSVG(color)], { type: 'image/svg+xml' });
    const URL = window.URL.createObjectURL(blob);
    const cssString = `
      * {
        cursor: url(${URL}) ${2} ${2}, auto;
      }
    `;
    const style = document.createElement('style');
    style.innerHTML = cssString;
    document.head.appendChild(style);
  }

  static mount() {
    const container = document.createElement('div');
    container.id = this.containerId;
    document.body.appendChild(container);
    render(<CursorRoot />, container);
  }

  static delete(id: string) {
    this.cursorSignals.value = this.cursorSignals.value.filter((cursor) => cursor.id !== id);
  }

  static move(data: CursorData) {
    const hasCursor = this.cursorSignals.value.find((cursor) => cursor.id === data.id);
    if (hasCursor) {
      this.cursorSignals.value = this.cursorSignals.value.map((cursor) => {
        if (cursor.id === data.id) {
          return data;
        }
        return cursor;
      });
    } else {
      this.cursorSignals.value.push(data);
    }
  }

  static click(data: CursorData, isMyCursor: boolean) {
    this.cursorClickSignals.value = this.cursorClickSignals.value.concat(data);
    if (isMyCursor) {
      return;
    }
    /**
     * @experimental
     * This is a hack to make the click event work on the remote cursor.
     */
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

  static isCursorElement(element: HTMLElement) {
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
