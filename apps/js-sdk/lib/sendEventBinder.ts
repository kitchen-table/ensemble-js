import { finder } from '@medv/finder';
import Api from './api';
import { EventType } from '@packages/api';
import Cursor from 'ui/Cursor';
import { TYPE, wire } from 'di';
import Fab from 'ui/FAB';
import Message from 'ui/Message';

type EventKey = keyof WindowEventMap;

class SendEventBinder {
  api!: Api;
  events: Map<EventKey, Function> = new Map();

  constructor() {
    wire(this, 'api', TYPE.API);

    const api = this.api;

    function emitMoveEvent(event: PointerEvent | MouseEvent) {
      api.emit(EventType.POINTER_MOVE, onMove(event));
    }
    function emitPointerClickEvent(event: PointerEvent) {
      // @ts-ignore
      if (event.isKitchenTableEvent) {
        return;
      }
      // ignore bubbled event
      if (event.pointerId === -1 && event.pointerType === '') {
        return;
      }
      api.emit(EventType.POINTER_CLICK, onPointerClick(event));
    }

    this.events.set('mousemove', emitMoveEvent);
    this.events.set('pointermove', emitMoveEvent);
    this.events.set('click', emitPointerClickEvent);
  }

  add<K extends EventKey>(type: K, callback: (event: WindowEventMap[K]) => any) {
    this.events.set(type, callback);
  }

  remove(type: EventKey) {
    this.events.delete(type);
  }

  get<K extends EventKey>(type: K) {
    return this.events.get(type);
  }

  bindNativeEventListener() {
    this.events.forEach((callback, type) => {
      window.addEventListener(type, callback as any);
    });
  }

  unbindNativeEventListener() {
    this.events.forEach((callback, type) => {
      window.removeEventListener(type, callback as any);
    });
  }
}

function onMove(event: PointerEvent | MouseEvent) {
  if (!(event.target instanceof HTMLElement) || isIgnoreElement(event.target)) {
    return {
      element: finder(document.body),
      x: event.clientX,
      y: event.clientY,
    };
  }
  const element = finder(event.target);
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.

  return { element, x, y };
}

function onPointerClick(event: PointerEvent) {
  if (!(event.target instanceof HTMLElement) || isIgnoreElement(event.target)) {
    return {
      element: finder(document.body),
      x: event.clientX,
      y: event.clientY,
    };
  }
  const element = finder(event.target);
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.

  return { element, x, y };
}

const isIgnoreElement = (element: HTMLElement) => {
  return Fab.hasThis(element) || Message.hasThis(element) || Cursor.hasThis(element);
};

export default SendEventBinder;
