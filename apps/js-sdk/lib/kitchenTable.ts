import SendingEvents from 'sendingEvents';
import Api from 'api';
import ReceivingEvents from 'receivingEvents';
import Cursor from 'ui/Cursor';
import Message from 'ui/Message';
import { TYPE, wire } from 'di';
import Fab from 'ui/FAB';
import MyInfoStorage from 'storage/myInfoStorage';
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
    console.log(
      '%c😀 Hi. Welcome to kitchen-table.\nThis is a kitchen table for Everyone who wants to talk with others into the same room. Enjoy!',
      'display:block; background: black; width:100%; color: #bada55; padding:8px; font-size: 18px; margin: auto;',
    );

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
    const savedMyInfo = this.myInfoStorage.getSnapshot();
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
