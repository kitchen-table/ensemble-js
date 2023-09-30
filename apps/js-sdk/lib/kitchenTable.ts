import SendEventBinder from 'sendEventBinder';
import Api from 'api';
import ReceiveEventListener from 'receiveEventListener';
import Cursor from 'ui/Cursor';
import Message from 'ui/Message';
import { TYPE, wire } from 'di';

class KitchenTable {
  roomId: string;

  api!: Api;
  cursor!: Cursor;
  message!: Message;
  sendEventBinder!: SendEventBinder;
  receiveEventListener!: ReceiveEventListener;

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'message', TYPE.MESSAGE);

    wire(this, 'cursor', TYPE.CURSOR);
    wire(this, 'sendEventBinder', TYPE.SEND_EVENT_BINDER);
    wire(this, 'receiveEventListener', TYPE.RECEIVE_EVENT_LISTENER);

    // TODO: hash에 설정된 roomId가 있으면 가져오기
    this.roomId = window.location.origin + window.location.pathname;
  }

  async init() {
    await this.api.init();
    await this.setup();
  }

  private async setup() {
    const { myInfo } = await this.api.login({ roomId: this.roomId });
    await this.api.getUserList({ roomId: this.roomId });

    this.cursor.setUserCursor(myInfo.color);

    this.sendEventBinder.bindNativeEventListener();
    this.message.bindNativeEventHandler();

    this.receiveEventListener.init();
    this.api.joinRoom(this.roomId);

    // TODO: cleanup or re-init
    window.addEventListener('locationchange', () => {
      this.cleanup();
    });
  }

  cleanup() {
    this.api?.leave({ roomId: this.roomId });
    this.sendEventBinder.unbindNativeEventListener();
  }
}

export default KitchenTable;
