import Api from './api';
import { EventType } from '@packages/api';
import Cursor from 'ui/Cursor';
import { TYPE, wire } from 'di';
import Fab from 'ui/FAB';
import Message from 'ui/Message';
import { ELEMENT_SELECTOR } from 'utils/constants';
import { elementFinder } from 'utils/elementFinder';
import { throttle } from 'utils/throttle';
import Config from 'config';

type EventKey = keyof DocumentEventMap;

class SendEventBinder {
  api!: Api;
  config!: Config;
  events: Map<EventKey, Function> = new Map();

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'config', TYPE.CONFIG);

    const api = this.api;

    const emitMoveEvent = (event: PointerEvent) => {
      api.emit(EventType.POINTER_MOVE, onMove(event));
    };
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
    function emitIsBackgroundEvent() {
      api.updateMyInfo({ isBackground: document.hidden });
      api.emit(EventType.POINTER_MOVE, { element: ELEMENT_SELECTOR.HIDE, x: 0, y: 0 });
    }

    this.events.set('mousemove', throttle(emitMoveEvent, this.config.getMoveEventThrottleMs()));
    this.events.set('pointermove', throttle(emitMoveEvent, this.config.getMoveEventThrottleMs()));
    this.events.set('click', emitPointerClickEvent);
    this.events.set('visibilitychange', emitIsBackgroundEvent);
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

const onMove = handleFallback((event) => {
  const element = elementFinder(event.target);
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.

  return { element, x, y };
});

const onPointerClick = handleFallback((event) => {
  const element = elementFinder(event.target);
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left; //x position within the element.
  const y = event.clientY - rect.top; //y position within the element.

  return { element, x, y };
});

function handleFallback<R>(eventHandler: (event: PointerEvent & { target: HTMLElement }) => R) {
  return (event: PointerEvent) => {
    if (!(event.target instanceof HTMLElement) || isIgnoreElement(event.target)) {
      return {
        element: ELEMENT_SELECTOR.HIDE,
        x: event.clientX,
        y: event.clientY,
      };
    }
    return eventHandler(event as PointerEvent & { target: HTMLElement });
  };
}

const isIgnoreElement = (target: HTMLElement) => {
  return Fab.hasThis(target) || Message.hasThis(target) || Cursor.hasThis(target);
};

export default SendEventBinder;
