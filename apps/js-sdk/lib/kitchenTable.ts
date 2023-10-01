import SendEventBinder from 'sendEventBinder';
import Api from 'api';
import ReceiveEventListener from 'receiveEventListener';
import Cursor from 'ui/Cursor';
import Message from 'ui/Message';
import { TYPE, wire } from 'di';
import Fab from 'ui/FAB';
import MyInfoStorage from 'storage/MyInfoStorage';
import { User } from '@packages/api';

class KitchenTable {
  roomId: string;

  api!: Api;
  fab!: Fab;
  cursor!: Cursor;
  message!: Message;
  sendEventBinder!: SendEventBinder;
  receiveEventListener!: ReceiveEventListener;
  myInfoStorage!: MyInfoStorage;

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'fab', TYPE.FAB);
    wire(this, 'cursor', TYPE.CURSOR);
    wire(this, 'message', TYPE.MESSAGE);
    wire(this, 'sendEventBinder', TYPE.SEND_EVENT_BINDER);
    wire(this, 'receiveEventListener', TYPE.RECEIVE_EVENT_LISTENER);
    wire(this, 'myInfoStorage', TYPE.MY_INFO_STORAGE);

    // TODO: hash에 설정된 roomId가 있으면 가져오기
    this.roomId = window.location.origin + window.location.pathname;
  }

  async init() {
    console.log('%c 😀 init kitchen-table!', 'background: #222; color: #bada55');
    await this.api.init();
    await this.setup();
  }

  private async setup() {
    const loginOutput = await this.api.login({ roomId: this.roomId });
    const myInfo = this.mergeWithSavedMyInfo(loginOutput.myInfo);
    this.myInfoStorage.save(myInfo);

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

  private mergeWithSavedMyInfo(myInfo: User) {
    const savedMyInfo = this.myInfoStorage.get();
    if (!savedMyInfo) {
      this.myInfoStorage.save(myInfo);
      return myInfo;
    }

    this.api.updateMyInfo({
      name: savedMyInfo.name,
      color: savedMyInfo.color,
    });
    return {
      ...myInfo,
      color: savedMyInfo.color,
      name: savedMyInfo.name,
    };
  }

  cleanup() {
    this.api?.leave({ roomId: this.roomId });
    this.cursor.restoreUserCursor();
    this.sendEventBinder.unbindNativeEventListener();
    this.message.unbindNativeEventHandler();
    this.fab.unmount();
    this.cursor.unmount();
    this.message.unmount();
  }
}

export default KitchenTable;
