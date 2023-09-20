import Events from './events';
import Api from './api';

type Config = {
  window: Window;
};

class KitchenTable {
  sessionId: string;
  roomId: string;
  api: Api | null = null;
  window: Window;

  constructor(config: Config) {
    this.window = config.window;
    // TODO: hash에 설정된 roomId가 있으면 가져오기
    this.roomId = this.window.location.origin + this.window.location.pathname;
    this.sessionId = this.initSessionId();
  }

  async init(server: string) {
    const api = await Api.init(server);
    this.api = api;

    api.join({ roomId: this.roomId, sessionId: this.sessionId });
    Events.init(api);
    Events.bind(this.window.addEventListener);

    // TODO: cleanup or re-init
    this.window.addEventListener('locationchange', (evt) => {
      this.cleanup();
    });
  }

  private initSessionId() {
    const storedSessionId = window.sessionStorage.getItem('kitchen-table-session-id');
    if (storedSessionId) {
      return storedSessionId;
    }
    const sessionId = this.window.crypto.randomUUID();
    window.sessionStorage.setItem('kitchen-table-session-id', sessionId);
    return sessionId;
  }

  cleanup() {
    this.api?.leave({ roomId: this.roomId, sessionId: this.sessionId });
    Events.unbind(this.window.removeEventListener);
  }
}

export default KitchenTable;
