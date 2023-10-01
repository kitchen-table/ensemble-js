import { ComponentChildren } from 'preact';
import styled from 'ui/styled';

export default function FABFrame({ children }: { children: ComponentChildren }) {
  return (
    <Container>
      <Frame>{children}</Frame>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1;
`;

const Frame = styled.div`
  display: grid;
  gap: 8px;
  width: 40px;
  min-height: 40px;
  padding: 8px 4px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border-radius: 8px;
`;
