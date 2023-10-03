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
import ScriptManager from 'scriptManager';
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
  container.bind<SendEventBinder>(TYPE.SEND_EVENT_BINDER).to(SendEventBinder).inSingletonScope();
  container
    .bind<ReceiveEventListener>(TYPE.RECEIVE_EVENT_LISTENER)
    .to(ReceiveEventListener)
    .inSingletonScope();

  /**
   * etc
   */
  container.bind<ScriptManager>(TYPE.SCRIPT_MANAGER).to(ScriptManager);

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
