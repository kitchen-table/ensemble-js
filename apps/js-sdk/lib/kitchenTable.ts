import SendingEvents from 'sendingEvents';
import Api from 'api';
import ReceivingEvents from 'receivingEvents';
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
  sendingEvents!: SendingEvents;
  receivingEvents!: ReceivingEvents;
  myInfoStorage!: MyInfoStorage;

  constructor() {
    wire(this, 'api', TYPE.API);
    wire(this, 'fab', TYPE.FAB);
    wire(this, 'cursor', TYPE.CURSOR);
    wire(this, 'config', TYPE.CONFIG);
    wire(this, 'message', TYPE.MESSAGE);
    wire(this, 'sendingEvents', TYPE.SENDING_EVENTS);
    wire(this, 'receivingEvents', TYPE.RECEIVING_EVENTS);
    wire(this, 'myInfoStorage', TYPE.MY_INFO_STORAGE);
  }

  async init() {
    console.log('%c 😀 init kitchen-table!', 'background: #222; color: #bada55');

    await this.api.init();
    await this.setUsers();

    this.api.retryConnect(() => this.setUsers().catch(invariant.error));
    this.setEvents();
  }

  private async setUsers() {
    const loginOutput = await this.api.login({});
    const myInfo = this.mergeWithSavedLocalMyInfo(loginOutput.myInfo);
    this.myInfoStorage.save(myInfo);
    this.cursor.setUserCursor(myInfo.color);

    await this.api.getUserList({ roomId: this.config.getRoomId() });
    this.api.joinRoom(this.config.getRoomId());
  }

  private setEvents() {
    this.sendingEvents.registration();
    this.receivingEvents.listenAllEvents();
    this.message.bindNativeEventHandler();
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
    this.sendingEvents.unregister();
    this.message.unbindNativeEventHandler();
    this.fab.unmount();
    this.cursor.unmount();
    this.message.unmount();
  }
}

export default KitchenTable;
