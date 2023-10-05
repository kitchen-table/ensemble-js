import { Container, createResolve, createWire, token } from '@owja/ioc';
import KitchenTable from 'kitchenTable';
import Api from 'api';
import SendingEvents from 'sendingEvents';
import ReceivingEvents from 'receivingEvents';
import ChatStorage from 'storage/ChatStorage';
import MyInfoStorage from 'storage/MyInfoStorage';
import Cursor from 'ui/Cursor';
import UsersStorage from 'storage/UsersStorage';
import Message from 'ui/Message';
import Fab from 'ui/FAB';
import Config from 'config';

const container = new Container();
const wire = createWire(container);
const resolve = createResolve(container);

const TYPE = {
  KITCHEN_TABLE: token<KitchenTable>('KitchenTable'),
  API: token<Api>('Api'),
  CONFIG: token<Config>('Config'),
  FAB: token<Fab>('Fab'),
  CURSOR: token<Cursor>('Cursor'),
  MESSAGE: token<Message>('Message'),
  SENDING_EVENTS: token<SendingEvents>('SendingEvents'),
  RECEIVING_EVENTS: token<ReceivingEvents>('ReceivingEvents'),
  CHAT_STORAGE: token<ChatStorage>('ChatStorage'),
  MY_INFO_STORAGE: token<MyInfoStorage>('MyInfoStorage'),
  USERS_STORAGE: token<UsersStorage>('UsersStorage'),
};

export { container, resolve, wire, TYPE };
