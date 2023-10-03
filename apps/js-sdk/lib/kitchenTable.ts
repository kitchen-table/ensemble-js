import SendEventBinder from 'sendEventBinder';
import Api from 'api';
import ReceiveEventListener from 'receiveEventListener';
import Cursor from 'ui/Cursor';
import Message from 'ui/Message';
import { TYPE, wire } from 'di';
import Fab from 'ui/FAB';
import MyInfoStorage from 'storage/MyInfoStorage';
import { User } from '@packages/api';
import invariant from 'ts-invariant';
import Config from 'config';

class KitchenTable {
  api!: Api;
  fab!: Fab;
  config!: Config;
  cursor!: Cursor;
  message!: Message;
  sendEventBinder!: SendEventBinder;
  receiveEventListener!: ReceiveEventListener;
  myInfoStorage!: MyInfoStorage;

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'fab', TYPE.FAB);
    wire(this, 'cursor', TYPE.CURSOR);
    wire(this, 'config', TYPE.CONFIG);
    wire(this, 'message', TYPE.MESSAGE);
    wire(this, 'sendEventBinder', TYPE.SEND_EVENT_BINDER);
    wire(this, 'receiveEventListener', TYPE.RECEIVE_EVENT_LISTENER);
    wire(this, 'myInfoStorage', TYPE.MY_INFO_STORAGE);
  }

  async init() {
    console.log('%c 😀 init kitchen-table!', 'background: #222; color: #bada55');

    await this.api.init();
    await this.setUsers();

    this.api.retryConnect(() => this.setUsers().catch(invariant.error));
    this.bindEvents();
  }

  private async setUsers() {
    const loginOutput = await this.api.login({});
    const myInfo = this.mergeWithSavedLocalMyInfo(loginOutput.myInfo);
    this.myInfoStorage.save(myInfo);
    this.cursor.setUserCursor(myInfo.color);

    await this.api.getUserList({ roomId: this.config.getRoomId() });
    this.api.joinRoom(this.config.getRoomId());
  }

  private bindEvents() {
    this.sendEventBinder.bindNativeEventListener();
    this.message.bindNativeEventHandler();
    this.receiveEventListener.init();
  }

  private mergeWithSavedLocalMyInfo(myInfo: User) {
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
    this.api?.leave({ roomId: this.config.getRoomId() });
    this.cursor.restoreUserCursor();
    this.sendEventBinder.unbindNativeEventListener();
    this.message.unbindNativeEventHandler();
    this.fab.unmount();
    this.cursor.unmount();
    this.message.unmount();
  }
}

export default KitchenTable;
