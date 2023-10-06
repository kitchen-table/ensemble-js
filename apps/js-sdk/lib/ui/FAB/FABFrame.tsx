import { ComponentChildren } from 'preact';
import styled from 'ui/styled';
import { useState } from 'preact/compat';
import FABIcon from 'ui/FAB/FABIcon';

type FABFrameProps = {
  rowChildren: ComponentChildren;
  columnChildren: ComponentChildren;
};

export default function FABFrame({ rowChildren, columnChildren }: FABFrameProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container>
      {isExpanded ? (
        <>
          <ColumnFrame>
            {columnChildren}
            <FABIcon onClick={toggle}>
              <CollapseIcon />
            </FABIcon>
          </ColumnFrame>
          <RowFrame>{rowChildren}</RowFrame>
        </>
      ) : (
        <Frame>
          <FABIcon onClick={toggle}>
            <ExpandIcon />
          </FABIcon>
        </Frame>
      )}
    </Container>
  );
}

const ExpandIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 10L21 3M21 3H15M21 3V9M10 14L3 21M3 21H9M3 21L3 15"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const CollapseIcon = () => {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <g>
        <g>
          <rect width="48" height="48" fill="none" />
        </g>
        <g>
          <g>
            <path d="M8,26a2,2,0,0,0-2,2.3A2.1,2.1,0,0,0,8.1,30h7.1L4.7,40.5a2,2,0,0,0-.2,2.8A1.8,1.8,0,0,0,6,44a2,2,0,0,0,1.4-.6L18,32.8v7.1A2.1,2.1,0,0,0,19.7,42,2,2,0,0,0,22,40V28a2,2,0,0,0-2-2Z" />
            <path d="M43.7,4.8a2,2,0,0,0-3.1-.2L30,15.2V8.1A2.1,2.1,0,0,0,28.3,6,2,2,0,0,0,26,8V20a2,2,0,0,0,2,2H39.9A2.1,2.1,0,0,0,42,20.3,2,2,0,0,0,40,18H32.8L43.4,7.5A2.3,2.3,0,0,0,43.7,4.8Z" />
          </g>
        </g>
      </g>
    </svg>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1;
`;

const Frame = styled.div`
  border: 1px solid #aeaeae;
  padding: 4px;
  background-color: white;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.15);
  border-radius: 8px;
`;

const RowFrame = styled.div`
  position: absolute;
  right: 45px;
  bottom: 0;
  display: flex;
  gap: 6px;
  padding: 4px;
  border-radius: 8px 0 0 8px;
  border: 1px solid #aeaeae;
  border-right: none;
  background-color: white;
  z-index: 2;

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
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: 1;
  display: grid;
  gap: 6px;
  padding: 4px;
  border-radius: 8px 8px 8px 0;

  background-color: white;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.15);
`;
