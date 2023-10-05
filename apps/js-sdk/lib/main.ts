import { container, TYPE } from 'di';

import KitchenTable from 'kitchenTable';
import ChatStorage from 'storage/ChatStorage';
import MyInfoStorage from 'storage/MyInfoStorage';
import Api from 'api';
import SendingEvents from 'sendingEvents';
import ReceivingEvents from 'receivingEvents';
import Cursor from 'ui/Cursor';
import Fab from 'ui/FAB';
import UsersStorage from 'storage/UsersStorage';
import Message from 'ui/Message';
import Config from 'config';
import { setVerbosity } from 'ts-invariant';

if (process.env.NODE_ENV !== 'development') {
  setVerbosity('error');
}

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
  container.bind<SendingEvents>(TYPE.SENDING_EVENTS).to(SendingEvents).inSingletonScope();
  container.bind<ReceivingEvents>(TYPE.RECEIVING_EVENTS).to(ReceivingEvents).inSingletonScope();

  /**
   * etc
   */
  container.bind<Config>(TYPE.CONFIG).to(Config);

  /**
   * ui
   */
  container.bind<Cursor>(TYPE.CURSOR).to(Cursor).inSingletonScope();
  container.bind<Message>(TYPE.MESSAGE).to(Message).inSingletonScope();
  container.bind<Fab>(TYPE.FAB).to(Fab).inSingletonScope();

  function initUI() {
    container.get(TYPE.CURSOR);
    container.get(TYPE.MESSAGE);
    container.get(TYPE.FAB);
  }

  /**
   * kitchenTable core
   */
  container.bind<KitchenTable>(TYPE.KITCHEN_TABLE).to(KitchenTable).inSingletonScope();

  return {
    initUI,
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const { initUI } = containerBind();

  initUI();
  const kitchenTable = new KitchenTable();
  kitchenTable.init().catch(console.error);
  // @ts-ignore
  window.kitchenTable = kitchenTable;
});
