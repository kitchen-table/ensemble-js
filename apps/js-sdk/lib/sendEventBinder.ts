import { finder } from '@medv/finder';
import Api from './api';
import { EventType } from '@packages/api';

type EventKey = keyof WindowEventMap;

class SendEventBinder {
  events: Map<EventKey, Function> = new Map();

  constructor(api: Api) {
    function emitMoveEvent(event: PointerEvent | MouseEvent) {
      api.emit(EventType.POINTER_MOVE, onMove(event));
    }
    function emitPointerClickEvent(event: PointerEvent) {
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

  bind(bind: (key: string, callback: any) => any) {
    this.events.forEach((callback, type) => {
      bind(type, callback);
    });
  }

  unbind(unbind: (key: string, callback: any) => any) {
    this.events.forEach((callback, type) => {
      unbind(type, callback);
    });
  }
}

function onMove(event: PointerEvent | MouseEvent) {
  if (!(event.target instanceof HTMLElement)) {
    console.error('event.target is not HTMLElement', event.target);
    return;
  }
  const element = finder(event.target);
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.

  return { element, x, y };
}

function onPointerClick(event: PointerEvent) {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }
  const element = finder(event.target);
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.

  return { element, x, y };
}

export default SendEventBinder;
