import { finder } from '@medv/finder';
import Api from './api';

type EventKey = keyof WindowEventMap;

class Events {
  static events: Map<EventKey, Function> = new Map();

  private constructor() {}

  static init(api: Api) {
    function emitMove(event: PointerEvent | MouseEvent) {
      // TODO: selector, x,y,pageX,pageY, sessionId 전달하도록 수정
      api.emit('mousemove', { x: event.clientX, y: event.clientY });
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const selector = finder(event.target);
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left; //x position within the element.
      const y = event.clientY - rect.top; //y position within the element.
      console.log(selector, 'X : ' + x + ' ; Ys : ' + y + '.');
    }

    this.events.set('mousemove', emitMove);
    this.events.set('pointermove', emitMove);
  }
  static add<K extends EventKey>(type: K, callback: (event: WindowEventMap[K]) => any) {
    this.events.set(type, callback);
  }

  static remove(type: EventKey) {
    this.events.delete(type);
  }

  static get<K extends EventKey>(type: K) {
    return this.events.get(type);
  }

  static bind(bind: (key: string, callback: any) => any) {
    this.events.forEach((callback, type) => {
      bind(type, callback);
    });
  }

  static unbind(unbind: (key: string, callback: any) => any) {
    this.events.forEach((callback, type) => {
      unbind(type, callback);
    });
  }
}

export default Events;
