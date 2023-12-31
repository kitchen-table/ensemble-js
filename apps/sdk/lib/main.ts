import { container, TYPE } from 'di';

import EnsembleJS from 'ensembleJS';
import ChatStorage from 'storage/chatStorage';
import MyInfoStorage from 'storage/myInfoStorage';
import Api from 'api';
import SendingEvents from 'sendingEvents';
import ReceivingEvents from 'receivingEvents';
import Cursor from 'ui/Cursor';
import Fab from 'ui/FAB';
import UsersStorage from 'storage/usersStorage';
import Message from 'ui/Message';
import Config from 'config';
import { setVerbosity } from 'ts-invariant';
import UIStateStorage from 'storage/uiStateStorage';

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
  container.bind<UIStateStorage>(TYPE.UI_STATE_STORAGE).to(UIStateStorage).inSingletonScope();

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
   * EnsembleJS core
   */
  container.bind<EnsembleJS>(TYPE.ENSEMBLE_JS).to(EnsembleJS).inSingletonScope();

  return {
    initUI,
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const { initUI } = containerBind();

  initUI();
  const ensembleJS = new EnsembleJS();
  ensembleJS.init().catch(console.error);
  // @ts-ignore
  window.EnsembleJS = ensembleJS;
});
