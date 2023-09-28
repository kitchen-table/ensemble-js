import { render } from 'preact';
import { User } from '@packages/api/dist/esm';
import { signal, Signal } from '@preact/signals';
import FABContainer from 'ui/FAB/FABContainer';
import FABUsers from 'ui/FAB/FABUsers';
import FABChatList from 'ui/FAB/FABChatList';

class Fab {
  static usersSignal: Signal<User[]> = signal<User[]>([]);

  static mount() {
    const container = document.createElement('div');
    container.id = 'kitchen-table-fab-container';
    document.body.appendChild(container);
    render(<FabRoot />, container);
  }

  static renderUsers(users: Array<User>) {
    this.usersSignal.value = users;
  }
}

const FabRoot = () => {
  return (
    <FABContainer>
      <FABUsers />
      <FABChatList />
    </FABContainer>
  );
};

export default Fab;
