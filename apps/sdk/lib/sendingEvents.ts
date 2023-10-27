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
import { getMyPath } from 'utils/userPath';

type DocumentEventKey = keyof DocumentEventMap;
type WindowEventKey = keyof WindowEventMap;

class SendingEvents {
  api!: Api;
  config!: Config;
  documentEvents: Map<DocumentEventKey, Function> = new Map();
  windowEvents: Map<WindowEventKey, Function> = new Map();
  schedulingEvents: Map<Function, number> = new Map();
  scheduledEvents: number[] = [];

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'config', TYPE.CONFIG);

    const api = this.api;

    const emitMoveEvent = (event: PointerEvent) => {
      api.emit(EventType.POINTER_MOVE, onMove(event));
    };
    function emitPointerClickEvent(event: PointerEvent) {
      // @ts-ignore
      if (event.isEnsembleJSEvent) {
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

    function emitPathChangeEvent() {
      let prevPath = '';
      return () => {
        if (prevPath === getMyPath()) {
          return;
        }
        prevPath = getMyPath();
        api.updateMyInfo({ path: getMyPath() });
      };
    }

    this.documentEvents.set('mousemove', throttle(emitMoveEvent, this.config.moveEventThrottleMs));
    this.documentEvents.set(
      'pointermove',
      throttle(emitMoveEvent, this.config.moveEventThrottleMs),
    );
    this.documentEvents.set('click', emitPointerClickEvent);
    this.documentEvents.set('visibilitychange', emitIsBackgroundEvent);
    this.windowEvents.set('popstate', emitPathChangeEvent);
    this.schedulingEvents.set(emitPathChangeEvent(), 500);
  }

  registration() {
    this.documentEvents.forEach((callback, type) => {
      document.addEventListener(type, callback as any);
    });
    this.windowEvents.forEach((callback, type) => {
      window.addEventListener(type, callback as any);
    });
    this.schedulingEvents.forEach((ms, callback) => {
      const interval = window.setInterval(callback, ms);
      this.scheduledEvents.push(interval);
    });
  }

  unregister() {
    this.documentEvents.forEach((callback, type) => {
      document.removeEventListener(type, callback as any);
    });
    this.windowEvents.forEach((callback, type) => {
      window.removeEventListener(type, callback as any);
    });
    this.scheduledEvents.forEach((interval) => {
      window.clearInterval(interval);
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

export default SendingEvents;
