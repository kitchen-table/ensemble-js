import { render } from 'preact';
import { User } from '@packages/api/dist/esm';
import { signal, Signal } from '@preact/signals';
import FABContainer from 'ui/FAB/FABContainer';
import FABUsers from 'ui/FAB/FABUsers';
import FABChatList from 'ui/FAB/FABChatList';
import invariant from 'ts-invariant';

class Fab {
  private static containerId = 'kitchen-table-fab-container';
  static usersSignal: Signal<User[]> = signal<User[]>([]);

  static mount() {
    const container = document.createElement('div');
    container.id = this.containerId;
    document.body.appendChild(container);
    render(<FabRoot />, container);
  }

  static renderUsers(users: Array<User>) {
    this.usersSignal.value = users;
  }
  static isFabElement(element: HTMLElement) {
    const container = document.getElementById(this.containerId);
    invariant(container, 'Fab container not found');
    return container.contains(element);
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
