import { render } from 'preact';
import FABFrame from 'ui/FAB/FABFrame';
import FABUsers from 'ui/FAB/FABUsers';
import FABChatList from 'ui/FAB/FABChatList';
import invariant from 'ts-invariant';
import FABShare from 'ui/FAB/FABShare';
import FABLeave from 'ui/FAB/FABLeave';

class Fab {
  private static containerId = 'kitchen-table-fab-container';

  constructor() {
    this.mount();
  }

  private mount() {
    const container = document.createElement('div');
    container.id = Fab.containerId;
    document.body.appendChild(container);
    render(<FabRoot />, container);
  }

  unmount() {
    const container = document.getElementById(Fab.containerId);
    invariant(container, 'Fab container not found');
    container.remove();
  }

  static hasThis(element: HTMLElement) {
    const container = document.getElementById(this.containerId);
    invariant(container, 'Fab container not found');
    return container.contains(element);
  }
}

const FabRoot = () => {
  return (
    <FABFrame>
      <FABUsers />
      <FABShare />
      <FABChatList />
      <FABLeave />
    </FABFrame>
  );
};

export default Fab;
