import invariant from 'ts-invariant';

class Cursor {
  static size = 24;
  static getCursorSVG(color: string) {
    return `
    <svg fill="${color}" width="${this.size}px" height="${this.size}px" viewBox="0 0 24 24" id="cursor-up-left" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><path id="primary" d="M20.8,9.4,4.87,2.18A2,2,0,0,0,2.18,4.87h0L9.4,20.8A2,2,0,0,0,11.27,22h.25a2.26,2.26,0,0,0,2-1.8l1.13-5.58,5.58-1.13a2.26,2.26,0,0,0,1.8-2A2,2,0,0,0,20.8,9.4Z"></path></svg>`;
  }

  static setUserCursor(color: string) {
    const blob = new Blob([this.getCursorSVG(color)], { type: 'image/svg+xml' });
    const URL = window.URL.createObjectURL(blob);
    const cssString = `
      * {
        cursor: url(${URL}) ${this.size / 2} ${this.size / 2}, auto;
      }
    `;
    const style = document.createElement('style');
    style.innerHTML = cssString;
    document.head.appendChild(style);
  }

  static make(id: string, color: string) {
    const container = document.createElement('div');
    container.id = convertIdToCursorName(id);
    container.innerHTML = this.getCursorSVG(color);
    document.body.appendChild(container);
    container.style.position = 'absolute';
    container.style.width = `${this.size}px`;
    container.style.height = `${this.size}px`;
    container.style.pointerEvents = 'none';
    return container;
  }

  static get(id: string) {
    const cursorId = convertIdToCursorName(id);
    return document.querySelector(`#${cursorId}`);
  }

  static delete(id: string) {
    const cursorId = convertIdToCursorName(id);
    const cursor: HTMLElement | null = document.querySelector(`#${cursorId}`);
    cursor?.remove();
  }

  static move(id: string, x: number, y: number) {
    const cursorId = convertIdToCursorName(id);
    const cursor: HTMLElement | null = document.querySelector(`#${cursorId}`);
    invariant(cursor, `cursor not found. id: ${cursorId}`);

    const cursorLeft = `${x + scrollX}px`;
    const cursorTop = `${y + scrollY}px`;
    cursor.style.left = cursorLeft;
    cursor.style.top = cursorTop;
  }
}

export default Cursor;

function convertIdToCursorName(id: string) {
  const prefix = 'kitchen-table-cursor';

  return prefix + id;
}
