import { ComponentChildren } from 'preact';
import styled from 'ui/styled';
import FABIcon from 'ui/FAB/FABIcon';
import { resolve, TYPE } from 'di';
import { BiCollapse, BiExpand } from 'react-icons/bi';

type FABFrameProps = {
  rowChildren: ComponentChildren;
  columnChildren: ComponentChildren;
};

export default function FABFrame({ rowChildren, columnChildren }: FABFrameProps) {
  const getApi = resolve(TYPE.API);
  const getUIStateStorage = resolve(TYPE.UI_STATE_STORAGE);
  const isExpanded = getUIStateStorage().getFABOpenState();

  const isReady = getApi().isReadySignal.value;

  const toggle = () => {
    getUIStateStorage().setFABOpenState(!isExpanded);
  };

  if (!isReady) {
    return (
      <Container>
        <EdgeFrame isExpanded={false}>
          <FABIcon>
            <LoadingIcon />
          </FABIcon>
        </EdgeFrame>
      </Container>
    );
  }

  return (
    <Container>
      {isExpanded && <ColumnFrame>{columnChildren}</ColumnFrame>}
      <EdgeFrame isExpanded={isExpanded}>
        <FABIcon
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          role="tooltip"
          data-microtip-position="bottom"
          onClick={toggle}
        >
          {isExpanded ? (
            <BiCollapse size={20} color={'rgba(0,0,0,0.8)'} />
          ) : (
            <BiExpand size={20} color={'rgba(0,0,0,0.8)'} />
          )}
        </FABIcon>
      </EdgeFrame>
      {isExpanded && <RowFrame>{rowChildren}</RowFrame>}
    </Container>
  );
}

const Spinner = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  > svg {
    animation: spin 1s linear infinite;
  }
`;

const LoadingIcon = () => {
  return (
    <Spinner
      aria-label="Loading"
      role="tooltip"
      data-microtip-position="bottom"
      style={{
        cursor: 'not-allowed',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Spinner>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1;
`;

const EdgeFrame = styled.div<{ isExpanded: boolean }>`
  padding: 4px;
  background-color: white;
  box-shadow: 2px 3px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #aeaeae;
  border-radius: ${({ isExpanded }) => (isExpanded ? '0 0 8px 0' : '8px')};
  ${({ isExpanded }) => (isExpanded ? 'border-left: none; border-top: none;' : '')};
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
`;

const RowFrame = styled.div`
  position: absolute;
  right: 45px;
  bottom: 0;
  display: flex;
  z-index: 0;
  gap: 6px;
  padding: 4px;
  border-radius: 8px 0 0 8px;
  border: 1px solid #aeaeae;
  border-right: none;
  background-color: white;

  &::before {
    position: absolute;
    left: 0;
    bottom: 0;
    content: '';
    border-radius: 8px 0 0 8px;
    background-color: white;
    width: calc(100% + 3px);
    height: 100%;
    box-shadow: -2px 3px 4px 0 rgba(0, 0, 0, 0.1);
  }
`;

const ColumnFrame = styled.div`
  border: 1px solid #aeaeae;
  border-bottom: none;
  bottom: 44px;
  right: 0;
  position: absolute;
  z-index: 1;
  display: grid;
  gap: 6px;
  padding: 4px;
  border-radius: 8px 8px 0 0;

  background-color: white;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.15);
`;
