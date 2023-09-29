import { container, TYPE } from 'di';

import KitchenTable from 'kitchenTable';
import ChatStorage from 'storage/ChatStorage';
import MyInfoStorage from 'storage/MyInfoStorage';
import Api from 'api';
import SendEventBinder from 'sendEventBinder';
import ReceiveEventListener from 'receiveEventListener';
import Cursor from 'ui/Cursor';
import Fab from 'ui/FAB';
import UsersStorage from 'storage/UsersStorage';
import Message from 'ui/Message';

function containerBind() {
  /**
   * storages
   */
  container.bind<ChatStorage>(TYPE.CHAT_STORAGE).to(ChatStorage).inSingletonScope();
  container.bind<MyInfoStorage>(TYPE.MY_INFO_STORAGE).to(MyInfoStorage).inSingletonScope();
  container.bind<UsersStorage>(TYPE.USERS_STORAGE).to(UsersStorage).inSingletonScope();

  /**
   * api & events
   */
  container.bind<Api>(TYPE.API).to(Api).inSingletonScope();
  container.bind<SendEventBinder>(TYPE.SEND_EVENT_BINDER).to(SendEventBinder).inSingletonScope();
  container
    .bind<ReceiveEventListener>(TYPE.RECEIVE_EVENT_LISTENER)
    .to(ReceiveEventListener)
    .inSingletonScope();

  /**
   * ui
   */
  container.bind<Cursor>(TYPE.CURSOR).to(Cursor).inSingletonScope();
  container.bind<Message>(TYPE.MESSAGE).to(Message).inSingletonScope();

  /**
   * kitchenTable core
   */
  container.bind<KitchenTable>(TYPE.KITCHEN_TABLE).to(KitchenTable).inSingletonScope();
}

document.addEventListener('DOMContentLoaded', function () {
  containerBind();

  const kitchenTable = new KitchenTable();
  kitchenTable.init().catch(console.error);

  new Fab();
});
