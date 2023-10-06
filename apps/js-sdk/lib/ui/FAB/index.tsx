import { render } from 'preact';
import FABFrame from 'ui/FAB/FABFrame';
import FABUsers from 'ui/FAB/FABUsers';
import FABChatList from 'ui/FAB/FABChatList';
import invariant from 'ts-invariant';
import FABShare from 'ui/FAB/FABShare';
import FABLeave from 'ui/FAB/FABLeave';
import EmotionCacheProvider from 'ui/styled/EmotionCacheProvider';
import { normalizeCss, tooltipCss } from 'ui/styled/css';
import FABProfile from 'ui/FAB/FABProfile';

class Fab {
  private static containerId = 'kitchen-table-fab-container';
  private static rootId = 'kitchen-table-fab-root';

  constructor() {
    this.mount();
    this.addTooltip();
    this.addNormalizer();
  }

  private mount() {
    const container = document.createElement('div');
    container.id = Fab.containerId;
    document.body.appendChild(container);

    const root = document.createElement('div');
    root.id = Fab.rootId;

    const shadowRoot = container.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(root);

    render(
      <EmotionCacheProvider rootId={Fab.containerId}>
        <FabRoot />
      </EmotionCacheProvider>,
      root,
    );
  }

  private addTooltip() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(tooltipCss);
    this.getContainer().shadowRoot?.adoptedStyleSheets.push(styleSheet);
  }

  private addNormalizer() {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(normalizeCss);
    this.getContainer().shadowRoot?.adoptedStyleSheets.push(styleSheet);
  }

  getRoot() {
    const container = this.getContainer();
    const root = container.shadowRoot?.firstChild;
    invariant(root instanceof HTMLElement, 'Fab root not found');
    invariant(root.id === Fab.rootId, 'Fab root not found');
    return root;
  }

  getContainer() {
    const container = document.getElementById(Fab.containerId);
    invariant(container, 'Fab container not found');
    return container;
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
    <FABFrame
      rowChildren={<FABUsers />}
      columnChildren={
        <>
          <FABProfile />
          <FABShare />
          <FABChatList />
          <FABLeave />
        </>
      }
    ></FABFrame>
  );
};

export default Fab;
